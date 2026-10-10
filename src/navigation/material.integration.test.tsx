/**
 * Tests material entry points and shared material state using the accepted route table.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { resetCurricularMaterialsMock } from '@/mocks/curricularMaterial.mock'
import { courseRoutes, ROUTES } from '@/navigation/routes'
import { authService } from '@/services/auth.service'

const navigation = vi.hoisted(() => ({ router: null as ReturnType<typeof createMemoryRouter> | null }))

vi.mock('react-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-router')>()
  return {
    ...original,
    createBrowserRouter: (routes: Parameters<typeof createMemoryRouter>[0]) => {
      navigation.router = original.createMemoryRouter(routes, { initialEntries: ['/cursos'] })
      return navigation.router
    },
  }
})

async function open(path: string) {
  await navigation.router!.navigate(path)
  render(<App />)
}

beforeEach(async () => {
  window.history.replaceState({}, '', '/')
  resetCurricularMaterialsMock()
  await authService.login({ email: 'docente@kalibra.com', password: 'Kalibra123' })
})

afterEach(async () => {
  await act(async () => authService.logout())
})

describe('material integration routes', () => {
  it.each([
    [courseRoutes.subtopics('course-2'), 'Subtemas del curso'],
    [ROUTES.exercises, 'Ejercicios generados'],
    [courseRoutes.indicators('course-2'), 'Indicadores del curso'],
  ])('opens the correct course from %s', async (path, title) => {
    await open(path)
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    const button = await screen.findByRole('button', { name: 'Cargar material' })
    await userEvent.click(button)
    expect(await screen.findByText('Aún no has cargado material')).toBeInTheDocument()
    expect(navigation.router!.state.location.pathname).toBe(courseRoutes.material('course-2'))
  })

  it('uses the active course in the sidebar material entry point', async () => {
    await open(courseRoutes.subtopics('course-2'))
    const link = await screen.findByRole('link', { name: 'Material curricular' })
    expect(link).toHaveAttribute('href', courseRoutes.material('course-2'))
    await userEvent.click(link)
    expect(await screen.findByText('Aún no has cargado material')).toBeInTheDocument()
    expect(navigation.router!.state.location.pathname).toBe(courseRoutes.material('course-2'))
  })

  it('shows an uploaded subtopic as processing when returning through the sidebar', async () => {
    const user = userEvent.setup()
    await open(courseRoutes.material('course-2'))
    await user.click(await screen.findByRole('button', { name: 'Cargar primer material' }))
    await user.upload(screen.getByLabelText('Archivo de material'), new File(['pdf'], 'first.pdf', { type: 'application/pdf' }))
    await user.click(screen.getByRole('button', { name: 'Subir material' }))
    expect(await screen.findByText('Pendiente')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Subtemas' }))
    const table = await screen.findByRole('table', { name: 'Subtemas del curso' })
    expect(within(table).getByText('En ingestión')).toBeInTheDocument()
    expect(within(table).getAllByText('Sin material')).toHaveLength(3)
    expect(navigation.router!.state.location.pathname).toBe(courseRoutes.subtopics('course-2'))
    await user.click(screen.getByRole('link', { name: 'Mis cursos' }))
    const cards = await screen.findAllByRole('article')
    const courseCard = cards.find((card) => within(card).queryByRole('heading', { name: 'Álgebra Lineal' }))
    expect(courseCard).toHaveTextContent(/1\s*Materiales/)
    await user.click(screen.getByRole('link', { name: 'Ejercicios generados' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Generar ejercicios' })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: 'Generar ejercicios' }))
    const dialog = screen.getByRole('dialog', { name: 'Generar ejercicios' })
    await user.click(within(dialog).getByRole('button', { name: 'Curso' }))
    const unavailable = within(dialog).getByRole('option', { name: /Álgebra Lineal/ })
    expect(unavailable).toHaveAttribute('aria-disabled', 'true')
    expect(unavailable).toHaveTextContent('sin material listo')
    await user.keyboard('{Escape}')
    await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByRole('link', { name: 'Indicadores del curso' }))
    expect(await screen.findByText('Aún no hay indicadores para este curso')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cargar material' }))
    expect(await screen.findByText('Pendiente')).toBeInTheDocument()
  })

  it('keeps a replaced ready subtopic ineligible in the generation dialog', async () => {
    const user = userEvent.setup()
    await open(courseRoutes.material('course-1'))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cargar material' })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: 'Cargar material' }))
    await user.click(screen.getByRole('button', { name: 'Subtema' }))
    await user.click(screen.getByRole('option', { name: /Recursividad y Backtracking/ }))
    await user.upload(screen.getByLabelText('Archivo de material'), new File(['pdf'], 'replacement.pdf', { type: 'application/pdf' }))
    await user.click(screen.getByRole('button', { name: 'Subir material' }))
    expect(await screen.findByText('Pendiente')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Ejercicios generados' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Generar ejercicios' })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: 'Generar ejercicios' }))
    const dialog = screen.getByRole('dialog', { name: 'Generar ejercicios' })
    expect(within(dialog).getByRole('radio', { name: /Recursividad y Backtracking/ })).toBeDisabled()
    expect(within(dialog).getByRole('radio', { name: /Árboles Binarios de Búsqueda/ })).toBeEnabled()
    expect(within(dialog).getByText('El material aún está en ingestión')).toBeInTheDocument()
  })

  it('starts at sign-in while retaining the accepted course route', async () => {
    await act(async () => authService.logout())
    await open('/')
    expect(await screen.findByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(navigation.router!.state.location.pathname).toBe(ROUTES.signIn)
  })

  it('sends an unknown URL to the accepted courses fallback', async () => {
    await open('/unknown')
    expect(await screen.findByRole('heading', { level: 1, name: /Hola/ })).toBeInTheDocument()
    expect(navigation.router!.state.location.pathname).toBe(ROUTES.courses)
  })
})
