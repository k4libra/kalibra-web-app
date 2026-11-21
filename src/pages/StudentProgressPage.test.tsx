/**
 * Verifies authoritative activity dates on the individual progress page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ActiveCourseProvider } from '@/context/ActiveCourseContext'
import { apiStub } from '@/test/apiStub'
import { StudentProgressPage } from './StudentProgressPage'

function renderPage(studentId: string) {
  const router = createMemoryRouter([{ path: '/estudiantes/:studentId', element: <StudentProgressPage /> }], {
    initialEntries: [`/estudiantes/${studentId}?curso=course-1`],
  })
  return render(<ActiveCourseProvider><RouterProvider router={router} /></ActiveCourseProvider>)
}

describe('StudentProgressPage activity', () => {
  it('shows the timestamp returned by the progress API', async () => {
    apiStub.respond('/courses/course-1/student-progress', 200, {
      studentId: 'st-1', courseId: 'course-1', hasActivity: true, lastActivityAt: '2026-10-10T14:30:00Z',
      subtopics: [{ subtopicId: 'sub-1', subtopicName: 'Tema', mastery: 55, level: 'MEDIUM', solvedCount: 1 }], recentFeedback: [],
    })
    renderPage('st-1')
    expect(await screen.findByText(/Última actividad:/)).toHaveTextContent('10 oct 2026, 14:30')
    expect(screen.queryByText('Fecha no disponible')).not.toBeInTheDocument()
  })

  it('shows no activity when the timestamp is null', async () => {
    renderPage('st-3')
    expect(await screen.findByText(/Última actividad:/)).toHaveTextContent('Sin actividad')
  })
})
