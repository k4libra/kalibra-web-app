/**
 * Behavior tests for course groups, individual mastery and heatmap navigation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CourseStudentsGroup, StudentHeatmap, StudentMasteryTable, SubtopicPriorityList } from '@/components/student-monitoring'
import { COURSES, SUBTOPICS } from '@/test/uiFixtures'
import { STUDENTS, STUDENT_SUBTOPIC_MASTERY } from '@/test/uiFixtures'

const topics = SUBTOPICS.filter((topic) => topic.courseId === 'course-1')

describe('student monitoring compositions', () => {
  it('keeps an unenrolled course visible with a data-driven invitation notice', () => {
    render(<CourseStudentsGroup course={COURSES[1]} students={[]} updatedAt="2025-09-15T10:15:00" onViewProgress={vi.fn()} />)
    expect(screen.getByRole('heading', { name: COURSES[1].name })).toBeInTheDocument()
    expect(screen.getByText('0 matriculados')).toBeInTheDocument()
    expect(screen.getByText(/Invítalos desde Invitaciones/)).toHaveTextContent(COURSES[1].name)
  })
  it('opens progress from a roster and distinguishes no activity from low mastery', async () => {
    const onViewProgress = vi.fn()
    render(<CourseStudentsGroup course={COURSES[0]} students={STUDENTS} updatedAt="2025-09-15T10:15:00" onViewProgress={onViewProgress} />)
    expect(screen.getByText('Hoy, 09:48')).toBeInTheDocument()
    expect(screen.getByText('Sin actividad')).toBeInTheDocument()
    expect(screen.queryByText('Fecha no disponible')).not.toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: `Dominio de ${STUDENTS[0].fullName}` })).toHaveAttribute('aria-valuenow', '62')
    expect(screen.getByRole('progressbar', { name: `Dominio de ${STUDENTS[2].fullName}` })).not.toHaveAttribute('aria-valuenow')
    await userEvent.click(screen.getAllByRole('button', { name: 'Ver progreso' })[2])
    expect(onViewProgress).toHaveBeenCalledWith('st-3', 'course-1')
  })
  it.each([[null, 'Sin datos'], [39, 'Dominio bajo'], [40, 'Dominio medio'], [69, 'Dominio medio'], [70, 'Dominio alto'], [71, 'Dominio alto']] as const)('displays the shared level at %s', (mastery, label) => {
    render(<StudentMasteryTable subtopics={[topics[0]]} masteryRecords={[{ studentId: 'st-1', subtopicId: 'sub-1', mastery, resolvedExercises: mastery === null ? 0 : 1, correctAnswers: 0 }]} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
  it('opens every student through a heatmap cell, including an unmeasured cell', async () => {
    const onViewProgress = vi.fn()
    render(<StudentHeatmap subtopics={topics} progress={STUDENTS.map((student) => ({ student, subtopics: STUDENT_SUBTOPIC_MASTERY.filter((record) => record.studentId === student.id), recentResponses: [], reinforcementSubtopicIds: [] }))} onViewProgress={onViewProgress} />)
    for (const student of STUDENTS) {
      await userEvent.click(screen.getByRole('button', { name: new RegExp(`Ver progreso de ${student.fullName}: ${topics[0].name}`) }))
      expect(onViewProgress).toHaveBeenLastCalledWith(student.id)
    }
    await userEvent.click(screen.getByRole('button', { name: STUDENTS[0].fullName }))
    expect(onViewProgress).toHaveBeenLastCalledWith('st-1')
  })
  it('sorts reinforcement priorities and documents the accepted 70 percent threshold', () => {
    render(<SubtopicPriorityList subtopics={topics} totalStudents={3} updatedAt="2025-09-15T10:15:00" gaps={topics.map((topic) => ({ subtopicId: topic.id, averageMastery: topic.averageMastery, lowMasteryCount: 0, mediumMasteryCount: 0, highMasteryCount: 0, noDataCount: 3, studentsWithActivity: 0 }))} />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([topics[2].name, topics[0].name, topics[1].name, topics[3].name])
    expect(within(screen.getByRole('list', { name: 'Niveles de dominio' })).getByText('Alto ≥ 70%')).toBeInTheDocument()
  })
})
