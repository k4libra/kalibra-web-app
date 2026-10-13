/**
 * Contract of the courses endpoints, implemented by the HTTP service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CourseOverview, CreateCourseInput, Subtopic, Teacher, UpdateCourseInput, UpdateSubtopicInput } from '@/types/course'

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
  /**
   * Lists subtopics in their defined order, optionally including historical practice counts.
   *
   * @param courseId - Owned course to read.
   * @param signal - Cancels all requests in the projection.
   * @param includePractice - Requests solved counts for the archive screen only.
   * @returns The ordered curriculum with material, generation and optional practice counters.
   * @throws ApiError when a required projection resource cannot be read.
   */
  listSubtopics: (courseId: string, signal?: AbortSignal, includePractice?: boolean) => Promise<Subtopic[]>
  /** Creates a course with its subtopics and returns it with empty counters. */
  createCourse: (input: CreateCourseInput) => Promise<CourseOverview>
  /**
   * Updates course metadata.
   * @param courseId - Owned course to change.
   * @param input - Name or institutional code to replace.
   * @returns The stored course metadata and curriculum count.
   * @throws ApiError when ownership or validation fails.
   */
  updateCourse: (courseId: string, input: UpdateCourseInput) => Promise<CourseOverview>
  /**
   * Appends a new active, unlocked subtopic.
   * @param courseId - Owned course receiving the subtopic.
   * @param name - Validated display name of the new subtopic.
   * @returns The stored course with the appended subtopic count.
   * @throws ApiError when ownership or validation fails.
   */
  addSubtopic: (courseId: string, name: string) => Promise<CourseOverview>
  /**
   * Renames, reorders or changes the availability of a subtopic.
   * @param courseId - Owned course containing the subtopic.
   * @param subtopicId - Subtopic to change.
   * @param input - Independent changes; positions include archived rows.
   * @returns The stored course metadata and curriculum count.
   * @throws ApiError with status `409` for locked names or the last active subtopic.
   */
  updateSubtopic: (courseId: string, subtopicId: string, input: UpdateSubtopicInput) => Promise<CourseOverview>
  /**
   * Deletes an unlocked subtopic.
   * @param courseId - Owned course containing the subtopic.
   * @param subtopicId - Subtopic to remove.
   * @returns Nothing after a successful no-content response.
   * @throws ApiError with status `409` for locks or the last active subtopic.
   */
  deleteSubtopic: (courseId: string, subtopicId: string) => Promise<void>
  /** Fetches the profile of the signed-in teacher. */
  getCurrentTeacher: (signal?: AbortSignal) => Promise<Teacher>
}
