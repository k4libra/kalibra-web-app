/**
 * Hook that loads a course and its subtopics.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { coursesService } from '@/services/courses.service'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/types/apiError'
import type { UpdateCourseInput, UpdateSubtopicInput } from '@/types/course'
import { useResource } from './useResource'

/**
 * Loads a course with its counters and the list of its subtopics.
 *
 * @param courseId - Course to load.
 * @returns The course, all and visible subtopics, archive filter, read state and mutation actions,
 * including `isSubmitting`, `mutationError`, `updateCourse`, `addSubtopic`, `updateSubtopic` and `deleteSubtopic`.
 *
 * @example
 * ```tsx
 * const { course, subtopics, isLoading } = useCourseSubtopics(courseId);
 * ```
 */
export function useCourseSubtopics(courseId: string) {
  const { data, isLoading, error, refetch } = useResource(
    (signal) => Promise.all([coursesService.getCourse(courseId, signal), coursesService.listSubtopics(courseId, signal)]),
    `course-subtopics-${courseId}`,
  )
  const [showArchived, setShowArchived] = useState(false)
  const [mutation, setMutation] = useState<{ courseId: string; error: string | null; isSubmitting: boolean } | null>(null)
  const lifecycle = useRef<AbortController | null>(null)
  const submitting = useRef(false)
  useEffect(() => {
    const controller = new AbortController()
    lifecycle.current = controller
    submitting.current = false
    return () => controller.abort()
  }, [courseId])
  const mutate = useCallback(async (operation: () => Promise<unknown>) => {
    const controller = lifecycle.current
    if (!controller || controller.signal.aborted || submitting.current) return false
    submitting.current = true
    setMutation({ courseId, error: null, isSubmitting: true })
    try {
      await operation()
      if (controller.signal.aborted) return false
      refetch()
      return true
    } catch (reason: unknown) {
      if (!controller.signal.aborted) setMutation({ courseId, isSubmitting: false,
        error: reason instanceof ApiError && reason.status === 409 && reason.problem?.detail
          ? reason.problem.detail : reason instanceof Error ? reason.message : 'No se pudo guardar el cambio.' })
      return false
    } finally {
      if (!controller.signal.aborted) {
        submitting.current = false
        setMutation((previous) => previous ? { ...previous, isSubmitting: false } : null)
      }
    }
  }, [courseId, refetch])
  const updateCourse = useCallback((input: UpdateCourseInput) => mutate(() => coursesService.updateCourse(courseId, input)), [courseId, mutate])
  const addSubtopic = useCallback((name: string) => mutate(() => coursesService.addSubtopic(courseId, name)), [courseId, mutate])
  const updateSubtopic = useCallback((subtopicId: string, input: UpdateSubtopicInput) => mutate(() => coursesService.updateSubtopic(courseId, subtopicId, input)), [courseId, mutate])
  const deleteSubtopic = useCallback((subtopicId: string) => mutate(() => coursesService.deleteSubtopic(courseId, subtopicId)), [courseId, mutate])
  const current = data?.[0].id === courseId ? data : null
  const subtopics = current?.[1] ?? []
  return {
    course: current?.[0] ?? null, subtopics, visibleSubtopics: subtopics.filter((item) => showArchived || item.status === 'ACTIVE'),
    showArchived, setShowArchived, isLoading, error, refetch,
    isSubmitting: mutation?.courseId === courseId && mutation.isSubmitting,
    mutationError: mutation?.courseId === courseId ? mutation.error : null,
    updateCourse, addSubtopic, updateSubtopic, deleteSubtopic,
  }
}
