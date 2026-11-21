/**
 * Tests course curriculum editing, confirmation and conflict recovery.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { apiStub } from '@/test/apiStub'
import { ArchivedSubtopicsPage } from './ArchivedSubtopicsPage'
import { CourseSubtopicsPage } from './CourseSubtopicsPage'

function renderPage(courseId = 'course-2') {
  const router = createMemoryRouter([{ path: '/cursos/:courseId/subtemas', element: <CourseSubtopicsPage /> }, { path: '/cursos/:courseId/subtemas/archivados', element: <ArchivedSubtopicsPage /> }], { initialEntries: [`/cursos/${courseId}/subtemas`] })
  render(<RouterProvider router={router} />)
  return userEvent.setup()
}

describe('CourseSubtopicsPage', () => {
  it('stacks the add-subtopic controls until md and keeps course fields in one column on mobile', async () => {
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Editar curso' }))
    const field = (await screen.findByLabelText('Nuevo subtema')).closest('div.flex-col')
    expect(field).toHaveClass('w-full', 'min-w-0', 'md:flex-1')
    expect(field?.parentElement).toHaveClass('flex', 'flex-col', 'md:flex-row', 'md:items-end')
    expect(screen.getByRole('button', { name: 'Agregar subtema' })).toHaveClass('w-full', 'md:w-auto')
    const name = screen.getByLabelText('Nombre del curso').closest('div.flex-col')
    const code = screen.getByLabelText('Código').closest('div.flex-col')
    expect(name?.parentElement).toHaveClass('grid-cols-1', 'sm:grid-cols-2')
    expect(code?.parentElement).toBe(name?.parentElement)
  })

  it('keeps rename and deletion discoverable but disabled for material-backed subtopics', async () => {
    const user = renderPage('course-1')
    expect(await screen.findAllByRole('img', { name: 'Tiene material: archívalo en lugar de eliminarlo' })).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: 'Acciones de Programación Dinámica' }))
    expect(screen.getByRole('menuitem', { name: /Renombrar/ })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('menuitem', { name: /Eliminar/ })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('menuitem', { name: 'Archivar' })).not.toHaveAttribute('aria-disabled')
    expect(screen.getByRole('menuitem', { name: /Eliminar/ })).toHaveAccessibleDescription('Tiene material: archívalo en lugar de eliminarlo')
  })

  it('saves course metadata and appends then renames a subtopic inline', async () => {
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Editar curso' }))
    const name = await screen.findByLabelText('Nombre del curso')
    await user.clear(name); await user.type(name, 'Curso actualizado')
    const code = screen.getByLabelText('Código')
    await user.clear(code); await user.type(code, 'NEW')
    await user.clear(screen.getByLabelText('Ciclo'))
    await user.type(screen.getByLabelText('Ciclo'), '2027-I')
    await user.type(screen.getByLabelText('Facultad'), 'Ingeniería')
    await user.type(screen.getByLabelText('Semestre (opcional)'), 'IV')
    await user.click(screen.getByRole('button', { name: 'Guardar curso' }))
    await waitFor(() => expect(screen.getByLabelText('Nombre del curso')).toHaveValue('Curso actualizado'))
    await user.type(screen.getByLabelText('Nuevo subtema'), 'Nuevo tema')
    await user.type(screen.getByLabelText('Descripción del nuevo subtema (opcional)'), 'Resumen del nuevo tema')
    await user.click(screen.getByRole('button', { name: 'Agregar subtema' }))
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    await user.click(await screen.findByRole('button', { name: 'Acciones de Nuevo tema' }))
    await user.click(screen.getByRole('menuitem', { name: 'Renombrar' }))
    const topic = screen.getByLabelText('Nombre de Nuevo tema')
    await user.clear(topic); await user.type(topic, 'Tema editado{Enter}')
    expect(await screen.findByText('Tema editado')).toBeInTheDocument()
    expect(apiStub.account.courses[1]).toMatchObject({ name: 'Curso actualizado', code: 'NEW', term: '2027-I', faculty: 'Ingeniería', semester: 'IV' })
    expect(apiStub.account.courses[1].subtopics.at(-1)).toMatchObject({ description: 'Resumen del nuevo tema' })
    expect(vi.mocked(fetch)).toHaveBeenCalledWith('/api/v1/courses/course-2', expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ name: 'Curso actualizado', code: 'NEW', term: '2027-I', faculty: 'Ingeniería', semester: 'IV' }) }))
  })


  it('adds, edits and clears a locked subtopic description with description-only PATCH requests', async () => {
    const user = renderPage('course-1')
    const editDescription = async (label: string, value: string) => {
      await user.click(await screen.findByRole('button', { name: 'Acciones de Recursividad y Backtracking' }))
      await user.click(screen.getByRole('menuitem', { name: label }))
      const field = screen.getByLabelText('Descripción de Recursividad y Backtracking (opcional)')
      expect(field).toHaveAttribute('maxlength', '280')
      await user.clear(field)
      if (value) await user.type(field, value)
      await user.click(screen.getByRole('button', { name: 'Guardar descripción' }))
      await waitFor(() => expect(screen.queryByLabelText('Descripción de Recursividad y Backtracking (opcional)')).not.toBeInTheDocument())
    }
    await editDescription('Agregar descripción', 'Caso base y llamada recursiva')
    expect(await screen.findByText('Caso base y llamada recursiva')).toBeInTheDocument()
    await editDescription('Editar descripción', '  Resumen actualizado  ')
    expect(await screen.findByText('Resumen actualizado')).toBeInTheDocument()
    await editDescription('Editar descripción', '')
    expect(apiStub.account.courses[0].subtopics[0]).toMatchObject({ name: 'Recursividad y Backtracking', description: '', locked: true })
    for (const description of ['Caso base y llamada recursiva', 'Resumen actualizado', '']) {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith('/api/v1/courses/course-1/subtopics/sub-1', expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ description }) }))
    }
  })

  it('requires confirmation to archive and restore and hides archived rows by default', async () => {
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Acciones de Espacios Vectoriales' }))
    await user.click(screen.getByRole('menuitem', { name: 'Archivar' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }))
    expect(apiStub.account.courses[1].subtopics[0].status).toBe('ACTIVE')
    await user.click(await screen.findByRole('button', { name: 'Acciones de Espacios Vectoriales' }))
    await user.click(screen.getByRole('menuitem', { name: 'Archivar' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Archivar subtema' }))
    await waitFor(() => expect(screen.queryByText('Espacios Vectoriales')).not.toBeInTheDocument())
    const link = await screen.findByRole('link', { name: 'Ver archivados (1)' })
    expect(link).toHaveAttribute('href', '/cursos/course-2/subtemas/archivados')
    expect(screen.queryByRole('button', { name: 'Mostrar archivados' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Desarchivar/ })).not.toBeInTheDocument()
    await user.click(link)
    await user.click(await screen.findByRole('button', { name: 'Desarchivar Espacios Vectoriales' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desarchivar subtema' }))
    expect(await screen.findByRole('heading', { name: 'No hay subtemas archivados' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Subtemas' }))
    expect(await screen.findByRole('button', { name: 'Acciones de Espacios Vectoriales' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Ver archivados/ })).not.toBeInTheDocument()
  })

  it('reorders among all rows even when an archived subtopic is hidden', async () => {
    apiStub.account.courses[1].subtopics[1].status = 'ARCHIVED'
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Acciones de Autovalores y Autovectores' }))
    await user.click(screen.getByRole('menuitem', { name: 'Mover arriba' }))
    await waitFor(() => expect(apiStub.account.courses[1].subtopics.map((topic) => topic.id)).toEqual(['sub-5', 'sub-7', 'sub-6', 'sub-8']))
    await user.click(await screen.findByRole('button', { name: 'Acciones de Autovalores y Autovectores' }))
    await user.click(screen.getByRole('menuitem', { name: 'Mover abajo' }))
    await waitFor(() => expect(apiStub.account.courses[1].subtopics.map((topic) => topic.id)).toEqual(['sub-5', 'sub-6', 'sub-7', 'sub-8']))
    expect(apiStub.account.courses[1].subtopics.map((topic) => topic.displayOrder)).toEqual([1, 2, 3, 4])
  })

  it('deletes an unlocked subtopic only after confirmation', async () => {
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Acciones de Espacios Vectoriales' }))
    await user.click(screen.getByRole('menuitem', { name: 'Eliminar' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }))
    expect(apiStub.account.courses[1].subtopics).toHaveLength(4)
    await user.click(await screen.findByRole('button', { name: 'Acciones de Espacios Vectoriales' }))
    await user.click(screen.getByRole('menuitem', { name: 'Eliminar' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar subtema' }))
    await waitFor(() => expect(screen.queryByText('Espacios Vectoriales')).not.toBeInTheDocument())
    expect(apiStub.account.courses[1].subtopics).toHaveLength(3)
  })

  it('displays the 409 detail and keeps the last active subtopic and confirmation', async () => {
    apiStub.account.courses[1].subtopics.slice(1).forEach((topic) => { topic.status = 'ARCHIVED' })
    const user = renderPage()
    await user.click(await screen.findByRole('button', { name: 'Acciones de Espacios Vectoriales' }))
    await user.click(screen.getByRole('menuitem', { name: 'Archivar' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Archivar subtema' }))
    expect(await within(screen.getByRole('dialog')).findByText('El curso debe conservar al menos un subtema activo.')).toBeInTheDocument()
    expect(apiStub.account.courses[1].subtopics[0].status).toBe('ACTIVE')
  })
})
