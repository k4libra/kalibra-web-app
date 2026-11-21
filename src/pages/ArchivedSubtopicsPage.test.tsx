/**
 * Tests the dedicated archive screen, historical data and confirmation recovery.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { apiStub } from '@/test/apiStub'
import { ArchivedSubtopicsPage } from './ArchivedSubtopicsPage'
import { CourseSubtopicsPage } from './CourseSubtopicsPage'

function renderPage(courseId = 'course-1') {
  const router = createMemoryRouter([
    { path: '/cursos/:courseId/subtemas/archivados', element: <ArchivedSubtopicsPage /> },
    { path: '/cursos/:courseId/subtemas', element: <CourseSubtopicsPage /> },
  ], { initialEntries: [`/cursos/${courseId}/subtemas/archivados`] })
  render(<RouterProvider router={router} />)
  return userEvent.setup()
}

describe('ArchivedSubtopicsPage', () => {
  it('lists only archived rows with real solved counts and one SVG restore action', async () => {
    apiStub.account.courses[0].subtopics[0].status = 'ARCHIVED'
    renderPage()
    const table = await screen.findByRole('table', { name: 'Subtemas archivados' })
    expect(within(table).getByText('Recursividad y Backtracking')).toBeInTheDocument()
    expect(within(table).getByText('30 ejercicios resueltos')).toBeInTheDocument()
    expect(within(table).queryByText('Árboles Binarios de Búsqueda')).not.toBeInTheDocument()
    const actions = within(table).getAllByRole('button')
    expect(actions).toHaveLength(1)
    expect(actions[0]).toHaveAccessibleName('Desarchivar Recursividad y Backtracking')
    expect(actions[0].querySelector('svg')).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Subtemas' })).toHaveAttribute('href', '/cursos/course-1/subtemas')
  })

  it('cancels without mutation and confirms restoration of a locked archived row', async () => {
    apiStub.account.courses[0].subtopics[0].status = 'ARCHIVED'
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Desarchivar Recursividad y Backtracking' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }))
    expect(apiStub.account.courses[0].subtopics[0].status).toBe('ARCHIVED')
    await user.click(screen.getByRole('button', { name: 'Desarchivar Recursividad y Backtracking' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desarchivar subtema' }))
    expect(await screen.findByRole('heading', { name: 'No hay subtemas archivados' })).toBeInTheDocument()
    expect(apiStub.account.courses[0].subtopics[0]).toMatchObject({ status: 'ACTIVE', locked: true })
    await user.click(screen.getByRole('link', { name: 'Subtemas' }))
    expect(await screen.findByRole('button', { name: 'Acciones de Recursividad y Backtracking' })).toBeInTheDocument()
  })

  it('keeps the dialog and archived row on conflict and allows retry', async () => {
    apiStub.account.courses[0].subtopics[0].status = 'ARCHIVED'
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Desarchivar Recursividad y Backtracking' }))
    apiStub.respond('/courses/course-1/subtopics/sub-1', 409, { detail: 'El curso cambió. Vuelve a intentarlo.' })
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desarchivar subtema' }))
    expect(await within(screen.getByRole('dialog')).findByText('El curso cambió. Vuelve a intentarlo.')).toBeInTheDocument()
    expect(apiStub.account.courses[0].subtopics[0].status).toBe('ARCHIVED')
    apiStub.clear('/courses/course-1/subtopics/sub-1')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desarchivar subtema' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(await screen.findByRole('heading', { name: 'No hay subtemas archivados' })).toBeInTheDocument()
  })

  it('shows an explicit error rather than an empty archive for an unknown course', async () => {
    renderPage('missing')
    expect(await screen.findByRole('alert')).toHaveTextContent('No se encontró el recurso solicitado.')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'No hay subtemas archivados' })).not.toBeInTheDocument()
  })
})
