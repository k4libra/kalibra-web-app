/**
 * Maps progress measurements without deriving verification counts from percentages.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CatalogDto, IndicatorGuideDto, IndicatorsDto } from '@/types/api'
import type { CourseIndicators } from '@/types/indicators'
import { initials, profileName } from '@/services/mappers/auth.mapper'

// Spanish copy of the standard guide, keyed by domain kind rather than response order.
const guideCopy: Record<string, { whatItMeasures: string; goodSignal: string }> = {
  ACCURACY: { whatItMeasures: 'la parte de las respuestas de tus estudiantes que fueron correctas.', goodSignal: 'un porcentaje alto; si baja, revisa el mapa de brechas.' },
  PRACTICE: { whatItMeasures: 'los ejercicios que tu grupo resuelve en cada subtema.', goodSignal: 'todos los subtemas tienen práctica.' },
  MASTERY_EVOLUTION: { whatItMeasures: 'qué tan preparados están tus estudiantes para resolver bien los ejercicios del subtema, al empezar y hoy.', goodSignal: 'la barra de hoy supera la marca de «Al empezar».' },
  VERIFICATION_APPROVAL: { whatItMeasures: 'qué parte de los ejercicios creados por la IA aprobó la revisión de corrección y dificultad.', goodSignal: 'un porcentaje alto; los descartados nunca llegan a tus estudiantes.' },
}
/** Localizes known guide kinds using existing product copy without assuming server entry order. */
export function mapIndicatorGuide(dto: IndicatorGuideDto): IndicatorGuideDto {
  return { entries: dto.entries.map((entry) => ({ indicator: entry.indicator,
    ...(guideCopy[entry.indicator] ?? { whatItMeasures: 'La guía de este indicador aún no está disponible.', goodSignal: 'Consulta la documentación del curso.' }),
  })) }
}

/** Joins practice, evolution and actual catalog counts by subtopic identity. */
export function mapIndicators(dto: IndicatorsDto, catalog?: CatalogDto): CourseIndicators | null {
  if (!dto.hasActivity) return null
  const ids = new Set([...dto.practice.perSubtopic, ...dto.evolution.perSubtopic, ...(catalog?.subtopics ?? [])].map((item) => item.subtopicId))
  return { summary: { groupAccuracy: dto.accuracy.groupAccuracy, groupInitial: dto.evolution.groupInitial, groupCurrent: dto.evolution.groupCurrent, groupDeltaPoints: dto.evolution.groupDeltaPoints, totalSolved: dto.practice.totalSolved, averagePerActiveStudent: dto.practice.averagePerActiveStudent, activeStudents: dto.practice.activeStudents, approvalRate: dto.verification.approvalRate, approved: dto.verification.approved, discarded: dto.verification.discarded }, courseId: dto.courseId, enrolledCount: dto.practice.enrolledStudents,
    students: dto.accuracy.perStudent.map((student) => ({ studentId: student.studentId, fullName: profileName(student), initials: initials(profileName(student)), answeredCount: student.submitted, correctCount: student.correct })),
    subtopics: [...ids].map((id) => {
      const practice = dto.practice.perSubtopic.find((item) => item.subtopicId === id)
      const evolution = dto.evolution.perSubtopic.find((item) => item.subtopicId === id)
      const count = catalog?.subtopics.find((item) => item.subtopicId === id)
      return { subtopicId: id, subtopicName: practice?.subtopicName ?? evolution?.subtopicName ?? count?.subtopicName ?? '',
        solvedCount: practice?.solved ?? 0, initialMastery: evolution?.initialAverage ?? null, currentMastery: evolution?.currentAverage ?? null,
        deltaPoints: evolution?.deltaPoints ?? null, generatedCount: count?.generated ?? 0, approvedCount: count?.approved ?? 0 }
    }) }
}
