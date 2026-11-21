/**
 * Tests hydration, role redirects and administrator isolation through the route table.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { ActiveCourseProvider } from '@/context/ActiveCourseContext'
import { ToastProvider } from '@/context/ToastContext'
import { APP_ROUTES } from '@/navigation/appRoutes'
import { sessionStore } from '@/services/http/sessionStore'
import { authService } from '@/services/auth.service'
import { mapUser } from '@/services/mappers/auth.mapper'
import { adminDto, apiStub, teacherCredentials, teacherDto } from '@/test/apiStub'

function mount(path: string) {
  const router = createMemoryRouter(APP_ROUTES, { initialEntries: [path] })
  render(<ToastProvider><ActiveCourseProvider><RouterProvider router={router} /></ActiveCourseProvider></ToastProvider>)
  return router
}

describe('role-aware navigation', () => {
  it('redirects an administrator away from teacher routes without calling teacher endpoints', async () => {
    sessionStore.setSession(mapUser(adminDto))
    const router = mount('/cursos/course-1/material')
    expect(await screen.findByRole('heading', { name: 'Panel institucional', level: 1 })).toBeInTheDocument()
    await screen.findByRole('table', { name: 'Indicadores por curso' })
    expect(router.state.location.pathname).toBe('/admin/panel')
    expect(screen.queryByRole('link', { name: 'Mis cursos' })).not.toBeInTheDocument()
    expect(vi.mocked(fetch).mock.calls.every(([path]) => String(path).includes('/institutional-indicators'))).toBe(true)
  })
  it('redirects a teacher away from administrator routes', async () => {
    await authService.login(teacherCredentials)
    const router = mount('/admin/subtemas-criticos')
    expect(await screen.findByRole('heading', { name: 'Hola, Profesor' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/cursos')
    expect(vi.mocked(fetch).mock.calls.some(([path]) => String(path).includes('/institutional-indicators'))).toBe(false)
  })
  it('does not allow a student or unprivileged account into either shell', async () => {
    sessionStore.setSession(mapUser({ ...teacherDto, roles: ['STUDENT'] }))
    const router = mount('/admin/panel')
    expect(await screen.findByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/iniciar-sesion')
    expect(fetch).not.toHaveBeenCalled()
  })
  it('holds navigation until users/me resolves and deduplicates startup restoration', async () => {
    sessionStore.reset()
    let resolve!: (response: Response) => void
    vi.mocked(fetch).mockImplementationOnce(() => new Promise((done) => { resolve = done }))
    const router = mount('/')
    expect(screen.getByText('Restaurando sesión…')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
    await act(async () => { resolve(new Response(JSON.stringify(adminDto))) })
    await screen.findByRole('heading', { name: 'Panel institucional', level: 1 })
    expect(router.state.location.pathname).toBe('/admin/panel')
    expect(vi.mocked(fetch).mock.calls.filter(([path]) => String(path).endsWith('/users/me'))).toHaveLength(1)
  })
  it('treats users/me 401 as anonymous without showing a restoration error', async () => {
    sessionStore.reset()
    const router = mount('/cursos')
    expect(await screen.findByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/iniciar-sesion')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
  it('shows restoration failures and recovers through retry', async () => {
    sessionStore.reset(); apiStub.respond('/users/me', 503)
    mount('/')
    expect(await screen.findByRole('alert')).toHaveTextContent('Servicio no disponible por el momento')
    apiStub.respond('/users/me', 200, adminDto)
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    await screen.findByRole('heading', { name: 'Panel institucional', level: 1 })
  })
  it('ends administrator sessions through the shared confirmation dialog', async () => {
    sessionStore.setSession(mapUser(adminDto))
    const router = mount('/admin/panel')
    await screen.findByRole('table', { name: 'Indicadores por curso' })
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(router.state.location.pathname).toBe('/admin/panel')
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    await userEvent.click(screen.getByRole('button', { name: 'Sí, cerrar sesión' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/iniciar-sesion'))
    expect(vi.mocked(fetch).mock.calls.some(([path, init]) => String(path).endsWith('/authentication/sign-out') && init?.method === 'POST')).toBe(true)
  })
})
