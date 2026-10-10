/**
 * Resource and navigation hooks for grouped students, gap maps and individual progress.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useActiveCourse } from '@/context/ActiveCourseContext'
import { ROUTES, studentRoutes } from '@/navigation/routes'
import { coursesService } from '@/services/courses.service'
import { studentMonitoringService } from '@/services/studentMonitoring.service'
import type { CourseStudentGroup, GapMapResource } from '@/types/studentMonitoring'
import { formatMonitoringDate, reinforcementNotice } from '@/utils/monitoring'
import { useResource } from '@/hooks/useResource'

/**
 * Loads every course roster and coordinates the student-list navigation.
 *
 * @returns The `groups`, snapshot `updatedAt`, global `stats`, `isLoading`, `error`, `refetch`, `viewProgress`,
 * `inviteStudent` and `createFirstCourse` actions.
 *
 * @example
 * ```tsx
 * const page = useMonitoredStudents();
 * ```
 */
export function useMonitoredStudents() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const resource = useResource(async () => {
    const [courses, stats] = await Promise.all([coursesService.listCourses(), studentMonitoringService.getStats()])
    const groups = await Promise.all(courses.map(async (course): Promise<CourseStudentGroup> => ({ course, students: await studentMonitoringService.getStudentsByCourse(course.id) })))
    return { groups, stats }
  }, `students:${search}`)
  const groups = resource.isLoading || resource.error ? [] : resource.data?.groups ?? []
  const students = groups.flatMap((group) => group.students)
  const activeStudents = students.filter((student) => student.resolvedExercises > 0).length
  const viewProgress = useCallback((studentId: string) => navigate(studentRoutes.progress(studentId)), [navigate])
  const inviteStudent = useCallback(() => navigate(ROUTES.invitations), [navigate])
  const createFirstCourse = useCallback(() => navigate({ pathname: ROUTES.courses, search }), [navigate, search])
  return { isLoading: resource.isLoading, error: resource.error, refetch: resource.refetch, groups, updatedAt: resource.data?.stats.updatedAt ?? '', stats: { totalStudents: students.length, activeStudents, inactiveStudents: students.length - activeStudents },
    viewProgress, inviteStudent, createFirstCourse }
}

/**
 * Loads the whole gap map atomically, including every heatmap measurement.
 *
 * @returns The `map`, `isLoading`, `error`, `refetch`, `viewProgress` and `viewStudents`.
 *
 * @example
 * ```tsx
 * const page = useGapMap();
 * ```
 */
export function useGapMap() {
  const { courseId = '' } = useParams<{ courseId: string }>()
  const { search } = useLocation()
  const navigate = useNavigate()
  const resource = useResource<GapMapResource>(async () => {
    const [course, courseSubtopics, gapMap, students] = await Promise.all([
      coursesService.getCourse(courseId), coursesService.listSubtopics(courseId),
      studentMonitoringService.getGapMap(courseId), studentMonitoringService.getStudentsByCourse(courseId),
    ])
    const progress = await Promise.all(students.map((student) => studentMonitoringService.getStudentProgress(student.id)))
    return { course, courseSubtopics, gapMap, progress }
  }, `gap-map:${courseId}:${search}`)
  const viewProgress = useCallback((studentId: string) => navigate(studentRoutes.progress(studentId)), [navigate])
  const viewStudents = useCallback(() => navigate({ pathname: ROUTES.students, search }), [navigate, search])
  return { isLoading: resource.isLoading, error: resource.error, refetch: resource.refetch, map: resource.isLoading || resource.error ? null : resource.data, viewProgress, viewStudents }
}

/**
 * Loads individual progress and synchronizes the shell with the enrollment's course.
 *
 * @returns The `progress`, `course`, `courseSubtopics`, `recommendation`, `enrollmentDate`,
 * `firstName`, `isLoading`, `error`, `refetch` and `viewStudents`.
 *
 * @example
 * ```tsx
 * const page = useStudentProgress();
 * ```
 */
export function useStudentProgress() {
  const { studentId = '' } = useParams<{ studentId: string }>()
  const { search } = useLocation()
  const navigate = useNavigate()
  const { setActiveCourseId } = useActiveCourse()
  const resource = useResource(async () => {
    const progress = await studentMonitoringService.getStudentProgress(studentId)
    const [course, courseSubtopics] = await Promise.all([
      coursesService.getCourse(progress.student.courseId), coursesService.listSubtopics(progress.student.courseId),
    ])
    return { progress, course, courseSubtopics }
  }, `student-progress:${studentId}:${search}`)
  const data = resource.isLoading || resource.error ? null : resource.data
  const courseId = data?.course.id
  useEffect(() => {
    if (courseId) setActiveCourseId(courseId)
  }, [courseId, setActiveCourseId])
  const viewStudents = useCallback(() => navigate({ pathname: ROUTES.students, search }), [navigate, search])
  return { isLoading: resource.isLoading, error: resource.error, refetch: resource.refetch, progress: data?.progress ?? null, course: data?.course ?? null,
    courseSubtopics: data?.courseSubtopics ?? [],
    recommendation: data ? reinforcementNotice(data.progress, data.courseSubtopics) : null,
    firstName: data?.progress.student.fullName.split(' ')[0] ?? '',
    enrollmentDate: data ? formatMonitoringDate(data.progress.student.enrolledAt) : '', viewStudents }
}
