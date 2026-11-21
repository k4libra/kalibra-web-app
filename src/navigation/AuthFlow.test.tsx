/**
 * Integrated auth page, protected route, course switcher and logout flow tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { ActiveCourseProvider } from '@/context/ActiveCourseContext'
import { ToastProvider } from '@/context/ToastContext'
import { APP_ROUTES } from '@/navigation/appRoutes'
import { authService } from '@/services/auth.service'

afterEach(async () => {
  await act(async () => authService.logout())
})

function mount(path: string) {
  const router = createMemoryRouter(APP_ROUTES, { initialEntries: [path] })
  render(
    <ToastProvider>
      <ActiveCourseProvider>
        <RouterProvider router={router} />
      </ActiveCourseProvider>
    </ToastProvider>,
  )
  return router
}
async function fill(email: string, password = '@profesortest1') {
  await userEvent.type(screen.getByLabelText('Correo institucional'), email)
  await userEvent.type(screen.getByLabelText('Contraseña'), password)
}

describe('authentication navigation', () => {
  it.each([
    '/',
    '/unknown',
    '/cursos',
    '/invitaciones',
    '/ejercicios',
    '/estudiantes',
    '/cursos/course-1/subtemas',
    '/cursos/course-1/material',
    '/cursos/course-1/mapa-de-brechas',
    '/cursos/course-1/indicadores',
  ])('redirects unauthenticated %s to sign-in', async (path) => {
    const router = mount(path)
    expect(await screen.findByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/iniciar-sesion')
  })
  it('preserves notice state and values across both password visibility states and dismissal', async () => {
    mount('/iniciar-sesion')
    await fill('profesor.test1@upc.edu.pe', 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos')
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'text')
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Descartar aviso' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toHaveValue('wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Ocultar contraseña' }))
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
  })
  it('keeps invalid registration on the form and supports both duplicate-email recoveries', async () => {
    const router = mount('/registro')
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('aria-invalid', 'true')
    expect(router.state.location.pathname).toBe('/registro')
    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Ana Torres')
    await fill('profesor.test1@upc.edu.pe')
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(screen.getByLabelText('Contraseña')).toHaveValue('@profesortest1')
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Este correo ya tiene una cuenta registrada.')
    expect(screen.getByLabelText('Correo institucional')).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Usar otro correo' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Correo institucional')).toHaveValue('')
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Ana Torres')
    await userEvent.type(screen.getByLabelText('Correo institucional'), 'profesor.test1@upc.edu.pe')
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    await screen.findByRole('alert')
    await userEvent.click(screen.getAllByRole('button', { name: 'Iniciar sesión' })[0])
    expect(await screen.findByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument()
  })
  it('registers into the real empty courses screen and preserves the new teacher identity', async () => {
    const router = mount('/registro')
    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Elena Vega')
    await fill('elena@example.edu', 'Demo2025')
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByRole('heading', { name: 'Todavía no tienes cursos' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/cursos')
    expect(screen.getByRole('heading', { name: 'Hola, Elena' })).toBeInTheDocument()
    expect(screen.getByText('Elena Vega')).toBeInTheDocument()
  })
  it('signs in, switches courses and confirms or cancels logout over the current page', async () => {
    const router = mount('/iniciar-sesion')
    await fill('profesor.test1@upc.edu.pe')
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(await screen.findAllByRole('button', { name: 'Gestionar curso' })).toHaveLength(2)
    await userEvent.click(await screen.findByRole('button', { name: /Cambiar de curso/ }))
    const switcher = await screen.findByRole('dialog')
    await userEvent.click(within(switcher).getByRole('button', { name: /Álgebra Lineal/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/cursos/course-2/subtemas'))
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByRole('dialog', { name: '¿Deseas cerrar sesión?' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(router.state.location.pathname).toBe('/cursos/course-2/subtemas')
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    await userEvent.click(screen.getByRole('button', { name: 'Sí, cerrar sesión' }))
    expect(await screen.findByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument()
    expect(authService.getSession()).toBeNull()
  })
})
