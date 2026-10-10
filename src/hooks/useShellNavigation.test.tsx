/**
 * Shell navigation refresh after the first course is created in an empty account.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { act, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ActiveCourseProvider } from '@/context/ActiveCourseContext'
import { useShellNavigation } from '@/hooks/useShellNavigation'
import { authService } from '@/services/auth.service'
import { coursesService } from '@/services/courses.service'

vi.mock('@/mocks/scenario', () => ({
  respond: async <T,>(data: T) => structuredClone(data),
  isEmptyScenario: () => false,
}))
afterEach(async () => {
  await act(async () => authService.logout())
})

function ShellProbe() {
  const shell = useShellNavigation()
  return (
    <>
      <p>{shell.activeCourse?.name ?? 'No active course'}</p>
      <p>{shell.teacher?.email}</p>
    </>
  )
}

describe('useShellNavigation', () => {
  it('loads the newly created first course into the existing empty shell', async () => {
    await authService.register({
      firstName: 'Nueva',
      lastName: 'Docente',
      email: 'shell@example.edu',
      password: 'Demo2025',
      confirmPassword: 'Demo2025',
    })
    const router = createMemoryRouter(
      [
        { path: '/cursos', element: <ShellProbe /> },
        { path: '/cursos/:courseId/subtemas', element: <ShellProbe /> },
      ],
      { initialEntries: ['/cursos'] },
    )
    render(
      <ActiveCourseProvider>
        <RouterProvider router={router} />
      </ActiveCourseProvider>,
    )
    await screen.findByText('shell@example.edu')
    expect(screen.getByText('No active course')).toBeInTheDocument()
    const course = await coursesService.createCourse({
      name: 'Primer curso de prueba',
      code: 'PC-100',
      term: '2026-II',
      subtopics: ['Tema inicial'],
    })
    await act(async () => router.navigate(`/cursos/${course.id}/subtemas`))
    await waitFor(() => expect(screen.getByText('Primer curso de prueba')).toBeInTheDocument())
  })
})
