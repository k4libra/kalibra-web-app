/**
 * Hook that loads the generated exercises of every course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { coursesService } from '@/services/courses.service'
import { exercisesService } from '@/services/exercises.service'
import type { CourseOverview, Subtopic } from '@/types/course'
import type { CourseExerciseCatalog, GeneratedExercise } from '@/types/exercise'
import { useResource } from './useResource'

/**
 * Generated exercises of one course, ready to render as a group.
 */
export interface CourseExerciseGroup {
  /** Course of the group. */
  course: CourseOverview
  /** Subtopics of the course, used by the generation dialog. */
  subtopics: Subtopic[]
  /** Generated exercises of the course; empty catalog when none were generated. */
  catalog: CourseExerciseCatalog
}

/**
 * Loads the courses of the teacher, their subtopics and their generated exercises.
 *
 * @returns The `groups` per course, the `totals` (`generated`, `approved`, `discarded`),
 * `findExercise` to look up an exercise with its subtopic name, the `isLoading` and `error` state, and `refetch`.
 *
 * @example
 * ```tsx
 * const { groups, totals } = useGeneratedExercises();
 * ```
 */
export function useGeneratedExercises() {
  const { data, isLoading, error, refetch } = useResource(async () => {
    const [courses, catalogs] = await Promise.all([coursesService.listCourses(), exercisesService.listCatalogs()])
    const subtopics = await Promise.all(courses.map((course) => coursesService.listSubtopics(course.id)))
    return courses.map<CourseExerciseGroup>((course, index) => ({
      course,
      subtopics: subtopics[index],
      catalog: catalogs.find((catalog) => catalog.courseId === course.id) ?? { courseId: course.id, generatedCount: 0, subtopics: [] },
    }))
  }, 'generated-exercises')

  const groups = data ?? []
  const subtopicGroups = groups.flatMap((group) => group.catalog.subtopics)
  const totals = {
    generated: subtopicGroups.reduce((total, group) => total + group.generatedCount, 0),
    approved: subtopicGroups.reduce((total, group) => total + group.approvedCount, 0),
    discarded: subtopicGroups.reduce((total, group) => total + group.discardedCount, 0),
  }

  const findExercise = (exerciseId: string): { exercise: GeneratedExercise; subtopicName: string } | null => {
    for (const group of subtopicGroups) {
      const exercise = group.exercises.find((item) => item.id === exerciseId)
      if (exercise) return { exercise, subtopicName: group.subtopicName }
    }
    return null
  }

  return { groups, totals, findExercise, isLoading, error, refetch }
}
