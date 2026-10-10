/**
 * Implements course management and teacher workspace using the HTTP API.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CoursesContract } from '@/services/courses.contract'
import { apiClient } from '@/services/http/apiClient'
import { readAllPages } from '@/services/http/pagination'
import { authService } from '@/services/auth.service'
import { mapTeacher } from '@/services/mappers/auth.mapper'
import { mapCourse, mapSubtopics } from '@/services/mappers/courses.mapper'
import type { CatalogDto, CourseDto, GapMapDto, InvitationGroupDto, MaterialDto, RosterDto, UserDto } from '@/types/api'

async function project(courses: CourseDto[], signal?: AbortSignal) {
  if (!courses.length) return []
  const [rosters, catalogs, invitations] = await Promise.all([
    apiClient.get<RosterDto[]>('/course-rosters', { signal }), apiClient.get<CatalogDto[]>('/course-exercise-catalogs', { signal }), apiClient.get<InvitationGroupDto[]>('/course-invitation-groups', { signal }),
  ])
  return Promise.all(courses.map(async (course) => {
    const [materials, gap] = await Promise.all([readAllPages<MaterialDto>(`/courses/${course.id}/curricular-materials`, signal), apiClient.get<GapMapDto>(`/courses/${course.id}/mastery-gap-map`, { signal })])
    return mapCourse(course, materials, rosters.find((item) => item.courseId === course.id), catalogs.find((item) => item.courseId === course.id), invitations.find((item) => item.courseId === course.id), gap)
  }))
}
/** Implements course reads and writes, deriving every counter from the API. */
export const coursesService: CoursesContract = {
  async listCourses(signal) { return project(await apiClient.get<CourseDto[]>('/courses', { signal }), signal) },
  async getCourse(courseId, signal) { return (await project([await apiClient.get<CourseDto>(`/courses/${courseId}`, { signal })], signal))[0] },
  async listSubtopics(courseId, signal) {
    const [course, materials, catalogs, gap] = await Promise.all([
      apiClient.get<CourseDto>(`/courses/${courseId}`, { signal }), readAllPages<MaterialDto>(`/courses/${courseId}/curricular-materials`, signal),
      apiClient.get<CatalogDto[]>('/course-exercise-catalogs', { signal }), apiClient.get<GapMapDto>(`/courses/${courseId}/mastery-gap-map`, { signal }),
    ])
    return mapSubtopics(course, materials, catalogs.find((item) => item.courseId === courseId), gap)
  },
  async createCourse(input) {
    const dto = await apiClient.post<CourseDto>('/courses', { name: input.name, code: input.code, subtopicNames: input.subtopics })
    return mapCourse(dto, [])
  },
  async getCurrentTeacher(signal) {
    const user = authService.getSession()?.user
    return mapTeacher(user ? { ...user, roles: [user.role] } : await apiClient.get<UserDto>('/users/me', { signal }))
  },
  async getWorkspace(signal) { return apiClient.get<{ activeCourseId: string | null }>('/teachers/me/workspace', { signal }) },
  async selectActiveCourse(courseId) { return apiClient.put<{ activeCourseId: string | null }>('/teachers/me/workspace/active-course', { courseId }) },
}
