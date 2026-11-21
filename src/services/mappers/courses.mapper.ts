/**
 * Derives course counters and subtopic status from actual API resources.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CatalogDto, CourseDto, GapMapDto, IndicatorsDto, InvitationGroupDto, MaterialDto, RosterDto } from '@/types/api'
import type { CourseOverview, Subtopic } from '@/types/course'
import type { IconName } from '@/types/ui'
/** Current academic cycle (I: January–July, II: August–December); used only when the API omits the term. */
export function currentAcademicTerm(today: Date = new Date()): string {
  return `${today.getFullYear()}-${today.getMonth() >= 7 ? 'II' : 'I'}`
}
/** Picks the subject icon shown in the design from the course name. */
export function courseIcon(name: string): IconName {
  const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  if (/algebra|matric|vector|estadist/.test(normalized)) return 'functions'
  if (/calculo|integral|derivad/.test(normalized)) return 'gesture'
  if (/algoritm|program|estructura|dato|grafo|comput/.test(normalized)) return 'account_tree'
  return 'school'
}
/** Averages only measurements; a missing observation never becomes zero. */
export function average(values: (number | null)[]): number | null {
  const measured = values.filter((value): value is number => value !== null)
  return measured.length ? Math.round(measured.reduce((sum, value) => sum + value, 0) / measured.length) : null
}
/** Projects counters from actual related endpoint responses. */
export function mapCourse(dto: CourseDto, materials: MaterialDto[], roster?: RosterDto, catalog?: CatalogDto, invitations?: InvitationGroupDto, gap?: GapMapDto): CourseOverview {
  return { id: dto.id, name: dto.name, code: dto.code, term: dto.term ?? currentAcademicTerm(), faculty: dto.faculty ?? null, semester: dto.semester ?? null, icon: courseIcon(dto.name),
    subtopicCount: dto.subtopics.length, materialCount: materials.length, studentCount: roster?.enrolledCount ?? 0, studentIds: roster?.students.map((student) => student.studentId) ?? [],
    approvedExerciseCount: catalog?.subtopics.reduce((sum, subtopic) => sum + subtopic.approved, 0) ?? 0,
    pendingInvitationCount: invitations?.invitations.filter((invitation) => invitation.status === 'PENDING').length ?? 0,
    averageMastery: gap ? average(gap.students.map((cell) => cell.mastery)) : null }
}
/**
 * Selects the latest material of each subtopic and maps curriculum order and historical practice.
 *
 * @param dto - Authoritative course curriculum and lock state.
 * @param materials - Complete material collection used to resolve the latest ingestion state.
 * @param catalog - Generated and approved exercise counts, when available.
 * @param gap - Measured group mastery, when available.
 * @param report - Optional practice report including archived subtopics supplied by the API.
 * @returns Ordered subtopics; missing solved counts stay unknown rather than becoming zero.
 */
export function mapSubtopics(dto: CourseDto, materials: MaterialDto[], catalog?: CatalogDto, gap?: GapMapDto, report?: IndicatorsDto): Subtopic[] {
  return [...dto.subtopics].sort((a, b) => a.displayOrder - b.displayOrder).map((subtopic) => {
    const material = materials.filter((item) => item.subtopicIds.includes(subtopic.id)).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))[0]
    return { id: subtopic.id, courseId: dto.id, order: subtopic.displayOrder, name: subtopic.name, description: subtopic.description ?? '', status: subtopic.status, locked: subtopic.locked,
      materialStatus: material ? material.status === 'READY' ? 'ready' : material.status === 'INGESTION_ERROR' ? 'error' : 'processing' : 'missing',
      solvedExerciseCount: report?.practice.perSubtopic.find((item) => item.subtopicId === subtopic.id)?.solved ?? null,
      approvedExerciseCount: catalog?.subtopics.find((item) => item.subtopicId === subtopic.id)?.approved ?? 0,
      averageMastery: gap ? average(gap.students.filter((item) => item.subtopicId === subtopic.id).map((item) => item.mastery)) : null }
  })
}
