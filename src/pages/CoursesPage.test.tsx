/**
 * Tests for the courses page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ToastProvider } from '@/context/ToastContext'
import { apiStub } from '@/test/apiStub'
import type { RosterDto } from '@/types/api'
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

  it('counts a student enrolled in two courses once and preserves each course enrollment count', async () => {
    const student = { studentId: 'shared', email: 'shared@example.edu', enrolledAt: '2026-10-10' }
    const rosters: RosterDto[] = [
      { courseId: 'course-1', courseName: 'First', courseCode: 'ONE', enrolledCount: 2, students: [student, { ...student, studentId: 'other' }] },
      { courseId: 'course-2', courseName: 'Second', courseCode: 'TWO', enrolledCount: 1, students: [student] },
    ]
    apiStub.respond('/course-rosters', 200, rosters)
    renderPage()
    const label = await screen.findByText('Estudiantes matriculados')
    expect(within(label.parentElement!).getByText('2')).toBeInTheDocument()
    const cards = screen.getAllByRole('article')
    expect(within(within(cards[0]).getByText('Estudiantes').parentElement!).getByText('2')).toBeInTheDocument()
    expect(within(within(cards[1]).getByText('Estudiantes').parentElement!).getByText('1')).toBeInTheDocument()
  })

  it('keeps the create button disabled until a subtopic is added', async () => {
    renderPage()
    await userEvent.click(await screen.findByRole('button', { name: 'Crear curso' }))
    const dialog = screen.getByRole('dialog', { name: 'Crear curso' })
    await userEvent.type(screen.getByLabelText('Nombre del curso'), 'Física I')
    await userEvent.type(screen.getByLabelText('Código'), 'FI-101')
    const confirm = dialog.querySelectorAll('button')[dialog.querySelectorAll('button').length - 1]
    expect(confirm).toBeDisabled()
    await userEvent.type(screen.getByLabelText('Nuevo subtema'), 'Cinemática{Enter}')
    expect(confirm).toBeEnabled()
  })
})
