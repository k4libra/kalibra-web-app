/**
 * Tests course curriculum editing, confirmation and conflict recovery.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { apiStub } from '@/test/apiStub'
import { CourseSubtopicsPage } from './CourseSubtopicsPage'

function renderPage(courseId = 'course-2') {
  const router = createMemoryRouter([{ path: '/cursos/:courseId/subtemas', element: <CourseSubtopicsPage /> }], { initialEntries: [`/cursos/${courseId}/subtemas`] })
  render(<RouterProvider router={router} />)
  return userEvent.setup()
}

describe('CourseSubtopicsPage', () => {
  it('shows locks and hides rename and deletion controls for material-backed subtopics', async () => {
    renderPage('course-1')
    expect(await screen.findAllByRole('img', { name: 'Tiene material: no se puede renombrar ni eliminar' })).toHaveLength(3)
    expect(screen.queryByRole('button', { name: 'Renombrar Recursividad y Backtracking' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Eliminar Programación Dinámica' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Archivar Programación Dinámica' })).toBeEnabled()
    expect(screen.getAllByTitle('Tiene material: no se puede renombrar ni eliminar')).toHaveLength(3)
  })

  it('saves course metadata and appends then renames a subtopic inline', async () => {
    const user = renderPage()
    const name = await screen.findByLabelText('Nombre del curso')
    await user.clear(name); await user.type(name, 'Curso actualizado')
    const code = screen.getByLabelText('Código')
    await user.clear(code); await user.type(code, 'NEW')
    await user.click(screen.getByRole('button', { name: 'Guardar curso' }))
    await waitFor(() => expect(screen.getByLabelText('Nombre del curso')).toHaveValue('Curso actualizado'))
    await user.type(screen.getByLabelText('Nuevo subtema'), 'Nuevo tema')
    await user.click(screen.getByRole('button', { name: 'Agregar subtema' }))
    await user.click(await screen.findByRole('button', { name: 'Renombrar Nuevo tema' }))
    const topic = screen.getByLabelText('Nombre de Nuevo tema')
    await user.clear(topic); await user.type(topic, 'Tema editado{Enter}')
    expect(await screen.findByText('Tema editado')).toBeInTheDocument()
    expect(apiStub.account.courses[1]).toMatchObject({ name: 'Curso actualizado', code: 'NEW' })
  })

  it('requires confirmation to archive and restore and hides archived rows by default', async () => {
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Archivar Espacios Vectoriales' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }))
    expect(apiStub.account.courses[1].subtopics[0].status).toBe('ACTIVE')
    await user.click(screen.getByRole('button', { name: 'Archivar Espacios Vectoriales' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Archivar subtema' }))
    await waitFor(() => expect(screen.queryByText('Espacios Vectoriales')).not.toBeInTheDocument())
    const toggle = await screen.findByRole('button', { name: 'Mostrar archivados' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggle)
    expect(screen.getByText('Archivado')).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Restaurar Espacios Vectoriales' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Restaurar subtema' }))
    expect(await screen.findByRole('button', { name: 'Archivar Espacios Vectoriales' })).toBeInTheDocument()
    expect(screen.queryByText('Archivado')).not.toBeInTheDocument()
  })

  it('reorders among all rows even when an archived subtopic is hidden', async () => {
    apiStub.account.courses[1].subtopics[1].status = 'ARCHIVED'
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Subir Autovalores y Autovectores' }))
    await waitFor(() => expect(apiStub.account.courses[1].subtopics.map((topic) => topic.id)).toEqual(['sub-5', 'sub-7', 'sub-6', 'sub-8']))
    await user.click(await screen.findByRole('button', { name: 'Bajar Autovalores y Autovectores' }))
    await waitFor(() => expect(apiStub.account.courses[1].subtopics.map((topic) => topic.id)).toEqual(['sub-5', 'sub-6', 'sub-7', 'sub-8']))
    expect(apiStub.account.courses[1].subtopics.map((topic) => topic.displayOrder)).toEqual([1, 2, 3, 4])
  })

  it('deletes an unlocked subtopic only after confirmation', async () => {
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Eliminar Espacios Vectoriales' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }))
    expect(apiStub.account.courses[1].subtopics).toHaveLength(4)
    await user.click(screen.getByRole('button', { name: 'Eliminar Espacios Vectoriales' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar subtema' }))
    await waitFor(() => expect(screen.queryByText('Espacios Vectoriales')).not.toBeInTheDocument())
    expect(apiStub.account.courses[1].subtopics).toHaveLength(3)
  })

  it('displays the 409 detail and keeps the last active subtopic and confirmation', async () => {
    apiStub.account.courses[1].subtopics.slice(1).forEach((topic) => { topic.status = 'ARCHIVED' })
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Archivar Espacios Vectoriales' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Archivar subtema' }))
    expect(await within(screen.getByRole('dialog')).findByText('El curso debe conservar al menos un subtema activo.')).toBeInTheDocument()
    expect(apiStub.account.courses[1].subtopics[0].status).toBe('ACTIVE')
  })
})
