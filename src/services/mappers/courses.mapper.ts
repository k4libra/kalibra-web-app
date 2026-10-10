/**
 * Derives course counters and subtopic status from actual API resources.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CatalogDto, CourseDto, GapMapDto, InvitationGroupDto, MaterialDto, RosterDto } from '@/types/api'
import type { CourseOverview, Subtopic } from '@/types/course'
/** Averages only measurements; a missing observation never becomes zero. */
export function average(values: (number | null)[]): number | null {
  const measured = values.filter((value): value is number => value !== null)
  return measured.length ? Math.round(measured.reduce((sum, value) => sum + value, 0) / measured.length) : null
}
/** Projects counters from actual related endpoint responses. */
export function mapCourse(dto: CourseDto, materials: MaterialDto[], roster?: RosterDto, catalog?: CatalogDto, invitations?: InvitationGroupDto, gap?: GapMapDto): CourseOverview {
  return { id: dto.id, name: dto.name, code: dto.code, term: '', faculty: '', semester: '', icon: 'school',
    subtopicCount: dto.subtopics.length, materialCount: materials.length, studentCount: roster?.enrolledCount ?? 0, studentIds: roster?.students.map((student) => student.studentId) ?? [],
    approvedExerciseCount: catalog?.subtopics.reduce((sum, subtopic) => sum + subtopic.approved, 0) ?? 0,
    pendingInvitationCount: invitations?.invitations.filter((invitation) => invitation.status === 'PENDING').length ?? 0,
    averageMastery: gap ? average(gap.students.map((cell) => cell.mastery)) : null }
}
/** Selects the latest material of each subtopic and maps curriculum order. */
export function mapSubtopics(dto: CourseDto, materials: MaterialDto[], catalog?: CatalogDto, gap?: GapMapDto): Subtopic[] {
  return [...dto.subtopics].sort((a, b) => a.displayOrder - b.displayOrder).map((subtopic) => {
    const material = materials.filter((item) => item.subtopicIds.includes(subtopic.id)).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))[0]
    return { id: subtopic.id, courseId: dto.id, order: subtopic.displayOrder, name: subtopic.name, description: '',
      materialStatus: material ? material.status === 'READY' ? 'ready' : material.status === 'INGESTION_ERROR' ? 'error' : 'processing' : 'missing',
      approvedExerciseCount: catalog?.subtopics.find((item) => item.subtopicId === subtopic.id)?.approved ?? 0,
      averageMastery: gap ? average(gap.students.filter((item) => item.subtopicId === subtopic.id).map((item) => item.mastery)) : null }
  })
}
