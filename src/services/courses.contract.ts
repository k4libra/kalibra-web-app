/**
 * Contract of the courses endpoints, shared by the real and the simulated service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CourseOverview, Subtopic, Teacher } from '@/types/course'

/**
 * Operations the frontend needs from the courses module of the backend.
 */
export interface CoursesContract {
  /** Lists the courses of the signed-in teacher with their counters. */
  listCourses: () => Promise<CourseOverview[]>
  /** Fetches one course with its counters; rejects when it does not exist. */
  getCourse: (courseId: string) => Promise<CourseOverview>
  /** Lists the subtopics of a course in their defined order. */
  listSubtopics: (courseId: string) => Promise<Subtopic[]>
  /** Fetches the profile of the signed-in teacher. */
  getCurrentTeacher: () => Promise<Teacher>
}
