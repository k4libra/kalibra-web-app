/**
 * Merged router smoke tests for student monitoring flows and accepted destinations.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { courseRoutes, ROUTES, studentRoutes } from '@/navigation/routes'
import { authService } from '@/services/auth.service'
import { studentMonitoringService } from '@/services/studentMonitoring.service'

async function open(path: string) {
  await act(async () => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
}

beforeEach(async () => {
  await authService.login({ email: 'docente@kalibra.com', password: 'Kalibra123' })
})

afterEach(async () => {
  vi.restoreAllMocks()
  await act(async () => authService.logout())
})

describe('merged monitoring routes', () => {
  it('starts at sign-in and keeps the accepted course, invitation, exercise and indicator destinations', async () => {
    await act(async () => authService.logout())
    await open('/')
    render(<App />)
    expect(await screen.findByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(window.location.pathname).toBe(ROUTES.signIn)
    await act(async () => {
      await authService.login({ email: 'docente@kalibra.com', password: 'Kalibra123' })
    })
    for (const [path, heading] of [
      [ROUTES.courses, 'Hola, Ricardo'], [ROUTES.invitations, 'Invitaciones'],
      [ROUTES.exercises, 'Ejercicios generados'], [courseRoutes.indicators('course-1'), 'Indicadores del curso'],
      [courseRoutes.subtopics('course-1'), 'Subtemas del curso'], [courseRoutes.material('course-1'), 'Material curricular'],
    ]) {
      await open(path)
      expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument()
    }
    await open('/unknown')
    await waitFor(() => expect(window.location.pathname).toBe(ROUTES.courses))
  })

  it('opens all three individual states from grouped students and returns to the same course roster', async () => {
    await open(ROUTES.students)
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Álgebra Lineal' })).toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Resumen de estudiantes' })
    expect(within(summary).getByText('3')).toBeInTheDocument()
    expect(within(summary).getByText('2')).toBeInTheDocument()
    expect(within(summary).getByText('1')).toBeInTheDocument()
    const names = ['Valentina Morales Rivera', 'Diego Paredes Luna', 'Lucía Ramos Soto']
    for (let index = 0; index < names.length; index++) {
      await userEvent.click((await screen.findAllByRole('button', { name: 'Ver progreso' }))[index])
      expect(await screen.findByRole('heading', { name: names[index], level: 1 })).toBeInTheDocument()
      expect(window.location.pathname).toBe(studentRoutes.progress(`st-${index + 1}`))
      if (index === 0) expect(screen.getByText(/Sus últimas 3 respuestas/)).toBeInTheDocument()
      if (index === 1) expect(screen.getByText('Refuerzo sugerido: Programación Dinámica (29%) y Recursividad y Backtracking (58%).')).toBeInTheDocument()
      if (index === 2) {
        expect(screen.getByRole('heading', { name: 'Lucía aún no registra actividad' })).toBeInTheDocument()
        expect(screen.getByText(/Lucía aceptó tu invitación el 04 sep 2025/)).toBeInTheDocument()
        expect(screen.queryByRole('region', { name: 'Resumen del progreso' })).not.toBeInTheDocument()
      }
      await userEvent.click(screen.getByRole('button', { name: 'Volver a estudiantes' }))
      expect(await screen.findByRole('heading', { name: 'Álgebra Lineal' })).toBeInTheDocument()
      expect(window.location.pathname).toBe(ROUTES.students)
    }
    await userEvent.click(screen.getByRole('button', { name: 'Invitar estudiante' }))
    expect(await screen.findByRole('heading', { name: 'Invitaciones', level: 1 })).toBeInTheDocument()
    await userEvent.click(await screen.findByRole('button', { name: 'Invitar estudiante' }))
    expect(screen.getByRole('dialog', { name: 'Invitar estudiante' })).toBeInTheDocument()
  })

  it('opens progress from a heatmap cell and synchronizes the sidebar after course two', async () => {
    await open(courseRoutes.gapMap('course-2'))
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Aún no hay datos suficientes' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Ver estudiantes' }))
    await userEvent.click((await screen.findAllByRole('button', { name: 'Ver progreso' }))[0])
    expect(await screen.findByRole('heading', { name: 'Valentina Morales Rivera', level: 1 })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('link', { name: 'Mapa de brechas' })).toHaveAttribute('href', courseRoutes.gapMap('course-1')))
    await userEvent.click(screen.getByRole('link', { name: 'Mapa de brechas' }))
    expect(await screen.findByRole('heading', { name: 'Prioridad de refuerzo por subtema' })).toBeInTheDocument()
    expect(screen.getByText('56%')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Ver progreso de Diego Paredes Luna: Programación Dinámica/ }))
    expect(await screen.findByRole('heading', { name: 'Diego Paredes Luna', level: 1 })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Volver a estudiantes' }))
    expect(await screen.findAllByRole('button', { name: 'Ver progreso' })).toHaveLength(3)
  })

  it('shows an explicit heatmap failure with retry instead of a successful empty matrix', async () => {
    vi.spyOn(studentMonitoringService, 'getStudentProgress').mockRejectedValueOnce(new Error('Heatmap unavailable'))
    await open(courseRoutes.gapMap('course-1'))
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Heatmap unavailable')
    expect(screen.queryByRole('table', { name: 'Dominio por estudiante y subtema' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByRole('table', { name: 'Dominio por estudiante y subtema' })).toBeInTheDocument()
  })

  it('keeps unknown students recoverable through the return-to-roster action', async () => {
    await open(studentRoutes.progress('missing'))
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent('No se encontró al estudiante.')
    await userEvent.click(screen.getByRole('button', { name: 'Volver a estudiantes' }))
    expect(await screen.findAllByRole('button', { name: 'Ver progreso' })).toHaveLength(3)
  })

  it('renders the teacher-empty state and reaches the accepted course creation dialog', async () => {
    await open(`${ROUTES.students}?vacio`)
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Aún no tienes estudiantes' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Resumen de estudiantes' })).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Crear mi primer curso' }))
    expect(window.location.pathname).toBe(ROUTES.courses)
    expect(window.location.search).toBe('?vacio')
    await userEvent.click(await screen.findByRole('button', { name: 'Crear mi primer curso' }))
    expect(screen.getByRole('dialog', { name: 'Crear curso' })).toBeInTheDocument()
  })
})
