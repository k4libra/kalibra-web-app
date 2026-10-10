/**
 * Contract of the courses endpoints, implemented by the HTTP service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CourseOverview, CreateCourseInput, Subtopic, Teacher } from '@/types/course'

/**
 * Operations the frontend needs from the courses module of the backend.
 */
export interface CoursesContract {
  /** Restores the server-selected active course. */
  getWorkspace: (signal?: AbortSignal) => Promise<{ activeCourseId: string | null }>
  /** Persists the active course after server ownership validation. */
  selectActiveCourse: (courseId: string) => Promise<{ activeCourseId: string | null }>
  /** Lists the courses of the signed-in teacher with their counters. */
  listCourses: (signal?: AbortSignal) => Promise<CourseOverview[]>
  /** Fetches one course with its counters; rejects when it does not exist. */
  getCourse: (courseId: string, signal?: AbortSignal) => Promise<CourseOverview>
  /** Lists the subtopics of a course in their defined order. */
  listSubtopics: (courseId: string, signal?: AbortSignal) => Promise<Subtopic[]>
  /** Creates a course with its subtopics and returns it with empty counters. */
  createCourse: (input: CreateCourseInput) => Promise<CourseOverview>
  /** Fetches the profile of the signed-in teacher. */
  getCurrentTeacher: (signal?: AbortSignal) => Promise<Teacher>
}
