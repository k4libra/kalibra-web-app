/**
 * Tests the populated, replacement and first-material screen flows through service boundaries.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider } from '@/context/ToastContext'
import { CurricularMaterialPage } from '@/pages/CurricularMaterialPage'
import { coursesService } from '@/services/courses.service'
import { curricularMaterialService } from '@/services/curricularMaterial.service'
import type { CourseOverview, Subtopic } from '@/types/course'
import type { CurricularMaterial } from '@/types/curricularMaterial'

let materials: CurricularMaterial[]
let subtopics: Subtopic[]
const course: CourseOverview = { id: 'course-a', name: 'Curso de referencia', code: 'TEST', term: '', faculty: '', semester: '', icon: 'school', subtopicCount: 4, materialCount: 3, approvedExerciseCount: 0, studentCount: 0, studentIds: [], pendingInvitationCount: 0, averageMastery: null }

beforeEach(() => {
  vi.restoreAllMocks()
  subtopics = Array.from({ length: 4 }, (_, index) => ({ id: `topic-${index}`, courseId: course.id, order: index + 1, name: `Tema ${index + 1}`, description: '', materialStatus: 'missing', approvedExerciseCount: 0, averageMastery: null }))
  materials = subtopics.slice(0, 3).map((subtopic, index) => ({ id: `material-${index}`, courseId: course.id, subtopicId: subtopic.id, fileName: index === 2 ? 'failed.jpg' : `notes-${index}.pdf`, fileType: index === 2 ? 'jpg' : 'pdf', fileSize: 1024, pageCount: index === 2 ? undefined : 18, uploadedAt: '2025-09-02', status: index === 2 ? 'error' : 'ready', errorMessage: index === 2 ? 'La imagen tiene baja resolución.' : undefined }))
  vi.spyOn(coursesService, 'getCourse').mockImplementation(async (id) => ({ ...course, id }))
  vi.spyOn(coursesService, 'listSubtopics').mockImplementation(async () => subtopics.map((subtopic) => ({ ...subtopic, materialStatus: materials.find((item) => item.subtopicId === subtopic.id)?.status ?? 'missing' })))
  vi.spyOn(curricularMaterialService, 'getByCourse').mockImplementation(async () => structuredClone(materials))
  vi.spyOn(curricularMaterialService, 'upload').mockImplementation(async ({ courseId, subtopicId, file }) => {
    const existing = materials.findIndex((item) => item.subtopicId === subtopicId)
    const uploaded: CurricularMaterial = { id: existing < 0 ? 'first-material' : materials[existing].id, courseId, subtopicId, fileName: file.name, fileType: 'pdf', fileSize: file.size, uploadedAt: new Date().toISOString(), status: 'processing' }
    if (existing < 0) materials.push(uploaded)
    else materials[existing] = uploaded
    return uploaded
  })
})

function renderPage(courseId = course.id) {
  const router = createMemoryRouter([{ path: '/cursos/:courseId/material', element: <CurricularMaterialPage /> }], { initialEntries: [`/cursos/${courseId}/material`] })
  render(<ToastProvider><RouterProvider router={router} /></ToastProvider>)
  return router
}
function uploader() { return screen.getByLabelText('Archivo de material') as HTMLInputElement }

describe('CurricularMaterialPage', () => {
  it('preserves the failed subtopic through reason, replacement, invalid selection and successful upload', async () => {
    const user = userEvent.setup({ applyAccept: false })
    renderPage()
    expect(await screen.findByText('failed.jpg')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ver motivo' }))
    expect(screen.getByRole('dialog', { name: 'No pudimos procesar el material' })).toHaveTextContent('failed.jpg · Tema 3')
    expect(screen.getByText('Usa un PDF digital o un escaneo de al menos 300 ppp.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reemplazar archivo' }))
    const dialog = screen.getByRole('dialog', { name: 'Cargar material' })
    expect(within(dialog).getByRole('button', { name: 'Subtema' })).toHaveTextContent('Tema 3')
    await user.click(within(dialog).getByRole('button', { name: 'Subtema' }))
    expect(screen.getAllByRole('option')).toHaveLength(4)
    expect(screen.getByRole('option', { name: /Tema 3/ })).toHaveTextContent('failed.jpg · requiere reemplazo')
    expect(screen.getByRole('option', { name: /Tema 4/ })).toHaveTextContent('Sin material cargado')
    await user.click(screen.getByRole('option', { name: /Tema 3/ }))
    await user.upload(uploader(), new File(['word'], 'notes.docx'))
    expect(screen.getByText('No soportado')).toBeInTheDocument()
    expect(screen.getByText('Formato no soportado. Sube un PDF, PNG o JPG; el archivo no se registró.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subir material' })).toBeDisabled()
    expect(curricularMaterialService.upload).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Seleccionar otro archivo' }))
    await user.upload(uploader(), new File(['pdf content'], 'replacement.pdf', { type: 'application/pdf' }))
    expect(screen.getByText('Válido')).toBeInTheDocument()
    expect(screen.getByText('Arrastra tu archivo aquí')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Subir material' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(await screen.findByText('Pendiente')).toBeInTheDocument()
    expect(screen.queryByText('Error de ingestión')).not.toBeInTheDocument()
    expect(screen.getByText('Kalibra está extrayendo el contenido de Tema 3. Te avisaremos cuando esté listo para generar ejercicios.')).toBeInTheDocument()
    expect(screen.getByText('Material cargado')).toBeInTheDocument()
    expect(screen.getByText('replacement.pdf quedó pendiente de ingestión.')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Resumen de materiales curriculares' })).getByText('0')).toBeInTheDocument()
  })

  it('supports first upload, all empty subtopic choices and removal without losing the subtopic', async () => {
    materials = []
    const user = userEvent.setup()
    renderPage()
    expect(await screen.findByText('Aún no has cargado material')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Resumen de materiales curriculares' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cargar primer material' }))
    expect(screen.getByRole('button', { name: 'Subir material' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Subtema' })).toHaveTextContent('Tema 1')
    await user.click(screen.getByRole('button', { name: 'Subtema' }))
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(4)
    options.forEach((option) => expect(option).toHaveTextContent('Sin material cargado'))
    await user.click(screen.getByRole('option', { name: /Tema 2/ }))
    const file = new File(['pdf content'], 'first.pdf', { type: 'application/pdf' })
    await user.upload(uploader(), file)
    expect(screen.getByText('Válido')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Quitar archivo' }))
    expect(screen.queryByText('first.pdf')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subtema' })).toHaveTextContent('Tema 2')
    expect(screen.getByText('Arrastra tu archivo aquí')).toBeInTheDocument()
    await user.upload(uploader(), file)
    await user.click(screen.getByRole('button', { name: 'Subir material' }))
    expect(await screen.findByText('Pendiente')).toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Resumen de materiales curriculares' })
    expect(within(summary).getByText('1')).toBeInTheDocument()
    expect(within(summary).getAllByText('0')).toHaveLength(2)
    expect(screen.getByText('Kalibra está extrayendo el contenido de Tema 2. Te avisaremos cuando esté listo para generar ejercicios.')).toBeInTheDocument()
    expect(curricularMaterialService.upload).toHaveBeenCalledWith({ courseId: course.id, subtopicId: 'topic-1', file })
  })

  it('keeps the dialog and selection when upload fails', async () => {
    vi.mocked(curricularMaterialService.upload).mockRejectedValue(new Error('No se pudo subir el material.'))
    const user = userEvent.setup()
    renderPage()
    await user.click(await screen.findByRole('button', { name: 'Cargar material' }))
    await user.upload(uploader(), new File(['pdf'], 'notes.pdf', { type: 'application/pdf' }))
    await user.click(screen.getByRole('button', { name: 'Subir material' }))
    expect(await within(screen.getByRole('dialog', { name: 'Cargar material' })).findByRole('alert')).toHaveTextContent('No se pudo subir el material.')
    expect(screen.getByRole('dialog', { name: 'Cargar material' })).toHaveTextContent('notes.pdf')
    expect(screen.queryByText('Material cargado')).not.toBeInTheDocument()
  })

  it('closes an upload with Escape and resets its file on reopening', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(await screen.findByRole('button', { name: 'Cargar material' }))
    await user.upload(uploader(), new File(['pdf'], 'notes.pdf', { type: 'application/pdf' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cargar material' }))
    expect(screen.getByRole('dialog')).not.toHaveTextContent('notes.pdf')
    expect(screen.getByRole('button', { name: 'Subir material' })).toBeDisabled()
  })

  it('shows read failures without exposing stale material or enabling upload', async () => {
    vi.mocked(coursesService.getCourse).mockRejectedValue(new Error('El curso no existe.'))
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('El curso no existe.')
    expect(screen.getByRole('button', { name: 'Cargar material' })).toBeDisabled()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('submits the actual route and newly created subtopic identifiers', async () => {
    materials = []
    subtopics = [{ ...subtopics[0], id: 'new-course-sub-1', courseId: 'new-course' }]
    const user = userEvent.setup()
    renderPage('new-course')
    await user.click(await screen.findByRole('button', { name: 'Cargar primer material' }))
    const file = new File(['pdf'], 'new.pdf', { type: 'application/pdf' })
    await user.upload(uploader(), file)
    await user.click(screen.getByRole('button', { name: 'Subir material' }))
    expect(await screen.findByText('Pendiente')).toBeInTheDocument()
    expect(curricularMaterialService.upload).toHaveBeenCalledWith({ courseId: 'new-course', subtopicId: 'new-course-sub-1', file })
  })
})
