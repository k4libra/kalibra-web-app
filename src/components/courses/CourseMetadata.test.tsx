/** Tests academic metadata from API responses across teacher course surfaces.
 * @packageDocumentation
 */
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { CourseCard } from './CourseCard'
import { CourseGroup } from '@/components/ui'
import { Sidebar } from '@/components/layout/Sidebar'
import { CourseSwitcherDialog } from '@/components/layout/CourseSwitcherDialog'
import { coursesService } from '@/services/courses.service'
import { currentAcademicTerm } from '@/services/mappers/courses.mapper'
import { apiStub } from '@/test/apiStub'
import type { CourseOverview } from '@/types/course'

const surfaces = {
  card: (course: CourseOverview) => <CourseCard course={course} onManage={vi.fn()} />,
  group: (course: CourseOverview) => <CourseGroup course={course} countLabel="2 materiales" />,
  sidebar: (course: CourseOverview) => <Sidebar activeCourse={course} teacher={null} generalLinks={[]} courseLinks={[]} onSwitchCourse={vi.fn()} onSignOut={vi.fn()} />,
  switcher: (course: CourseOverview) => <CourseSwitcherDialog isOpen courses={[course]} activeCourseId={course.id} onSelect={vi.fn()} onClose={vi.fn()} />,
}

describe.each(Object.entries(surfaces))('Course metadata in %s', (_, surface) => {
  it('shows the stored term, faculty and semester', async () => {
    Object.assign(apiStub.account.courses[0], { term: '2024-I', faculty: 'Ingeniería', semester: 'Semestre IV' })
    const course = await coursesService.getCourse('course-1')
    const { container } = render(<MemoryRouter>{surface(course)}</MemoryRouter>)
    expect(container.textContent).toContain('Ciclo 2024-I')
    expect(container.textContent).toContain('Ingeniería')
    expect(container.textContent).toContain('Semestre IV')
  })

  it('falls back only for the missing term and omits null faculty and semester', async () => {
    Object.assign(apiStub.account.courses[0], { term: null, faculty: null, semester: null })
    const course = await coursesService.getCourse('course-1')
    render(<MemoryRouter>{surface(course)}</MemoryRouter>)
    expect(screen.getByText(new RegExp(`Ciclo ${currentAcademicTerm()}`))).toBeInTheDocument()
    expect(screen.queryByText(/null|undefined|no disponible|Facultad|Semestre/)).not.toBeInTheDocument()
  })
})
