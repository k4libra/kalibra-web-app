/**
 * Courses service used by the hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { coursesMock } from '@/mocks/courses.mock'
import type { CoursesContract } from './courses.contract'

/**
 * Reads the courses, subtopics and teacher profile.
 *
 * @remarks
 * Points to the simulated implementation until the backend integration is built; swap it for the
 * HTTP implementation of {@link CoursesContract} without touching hooks or pages.
 */
export const coursesService: CoursesContract = coursesMock
