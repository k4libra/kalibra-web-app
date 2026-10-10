/**
 * Tests unavailable engine and storage recovery in the actual teacher dialogs.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ToastProvider } from '@/context/ToastContext'
import { GeneratedExercisesPage } from '@/pages/GeneratedExercisesPage'
import { CurricularMaterialPage } from '@/pages/CurricularMaterialPage'
import { apiStub } from '@/test/apiStub'

function mount(element: React.ReactNode, path: string) {
  const router = createMemoryRouter([{ path: path.includes('/material') ? '/cursos/:courseId/material' : path, element }], { initialEntries: [path] })
  render(<ToastProvider><RouterProvider router={router} /></ToastProvider>)
}

describe('unavailable feature APIs', () => {
  it('keeps the generation choice and displays engine 503 inside the dialog', async () => {
    mount(<GeneratedExercisesPage />, '/ejercicios')
    await screen.findAllByText('¿Cuál es el valor retornado por fact(4)?')
    await userEvent.click(screen.getByRole('button', { name: 'Generar ejercicios' }))
    apiStub.respond('/courses/course-1/generated-exercises', 503)
    await userEvent.click(screen.getByRole('button', { name: 'Generar 10 ejercicios' }))
    const dialog = screen.getByRole('dialog', { name: 'Generar ejercicios' })
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('Servicio no disponible por el momento')
    expect(within(dialog).getByRole('radio', { name: /Recursividad y Backtracking/ })).toBeChecked()
    expect(within(dialog).getByRole('button', { name: 'Generar 10 ejercicios' })).toBeEnabled()
  })
  it('keeps the selected file and displays storage 503 inside the upload dialog', async () => {
    mount(<CurricularMaterialPage />, '/cursos/course-2/material')
    await userEvent.click(await screen.findByRole('button', { name: 'Cargar primer material' }))
    await userEvent.upload(screen.getByLabelText('Archivo de material'), new File(['content'], 'notes.pdf', { type: 'application/pdf' }))
    apiStub.respond('/courses/course-2/curricular-materials', 503)
    await userEvent.click(screen.getByRole('button', { name: 'Subir material' }))
    const dialog = screen.getByRole('dialog', { name: 'Cargar material' })
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('Servicio no disponible por el momento')
    expect(within(dialog).getByText('notes.pdf')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Subir material' })).toBeEnabled()
  })
})
