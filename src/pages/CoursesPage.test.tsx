/**
 * Tests for the courses page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ToastProvider } from '@/context/ToastContext'
import { CoursesPage } from './CoursesPage'

function renderPage() {
  const router = createMemoryRouter([{ path: '/cursos', element: <CoursesPage /> }], { initialEntries: ['/cursos'] })
  return render(
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>,
  )
}

describe('CoursesPage', () => {
  it('lists the courses of the teacher', async () => {
    renderPage()
    expect(await screen.findAllByRole('button', { name: 'Gestionar curso' })).not.toHaveLength(0)
  })

  it('keeps the create button disabled until a subtopic is added', async () => {
    renderPage()
    await userEvent.click(await screen.findByRole('button', { name: 'Crear curso' }))
    const dialog = screen.getByRole('dialog', { name: 'Crear curso' })
    await userEvent.type(screen.getByLabelText('Nombre del curso'), 'Física I')
    await userEvent.type(screen.getByLabelText('Código'), 'FI-101')
    await userEvent.type(screen.getByLabelText('Ciclo'), '2025-II')
    const confirm = dialog.querySelectorAll('button')[dialog.querySelectorAll('button').length - 1]
    expect(confirm).toBeDisabled()
    await userEvent.type(screen.getByLabelText('Nuevo subtema'), 'Cinemática{Enter}')
    expect(confirm).toBeEnabled()
  })
})
