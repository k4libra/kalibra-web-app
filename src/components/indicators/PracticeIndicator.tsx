/**
 * Indicator of the exercises solved per subtopic.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { BarChart } from '@/components/ui'
import type { IndicatorSummary, StudentAccuracy, SubtopicIndicator } from '@/types/indicators'
import { plural } from '@/utils/plural'
import { IndicatorCard } from './IndicatorCard'

/**
 * Props accepted by {@link PracticeIndicator}.
 */
export interface PracticeIndicatorProps {
  /** Authoritative group summary from the API. */
  summary?: IndicatorSummary
  /** Indicators of each subtopic. */
  subtopics: SubtopicIndicator[]
  /** Answers of each enrolled student, used to count who practices. */
  students: StudentAccuracy[]
}

/**
 * Shows how many exercises the group solved in each subtopic and flags subtopics without practice.
 */
export function PracticeIndicator({ summary, subtopics, students }: PracticeIndicatorProps) {
  const total = summary?.totalSolved ?? subtopics.reduce((sum, subtopic) => sum + subtopic.solvedCount, 0)
  const active = summary?.activeStudents ?? students.filter((student) => student.answeredCount > 0).length
  const withoutPractice = subtopics.filter((subtopic) => subtopic.solvedCount === 0)
  const average = summary?.averagePerActiveStudent ?? (active === 0 ? 0 : Math.round((total / active) * 10) / 10)

  return (
    <IndicatorCard
      icon="task_alt"
      tone="warning"
      title="¿Cuánto practican tus estudiantes?"
      subtitle="Ejercicios resueltos en Kalibra por subtema"
      chip={
        withoutPractice.length > 0
          ? { label: `${plural(withoutPractice.length, 'subtema', 'subtemas')} sin práctica`, tone: 'warning', icon: 'priority_high' }
          : { label: 'Todos los subtemas con práctica', tone: 'success', icon: 'check_circle' }
      }
      kpi={String(total)}
      kpiLabel="ejercicios resueltos en total"
      kpiDetail={`${average} por estudiante con actividad · ${active} de ${students.length} estudiantes practican.`}
      howToRead="cada barra es la cantidad de ejercicios que tu grupo resolvió en ese subtema. Una barra baja o vacía indica un subtema que casi no practican: puedes generar ejercicios o reforzarlo en clase."
    >
      <BarChart
        label="Ejercicios resueltos por subtema"
        items={subtopics.map((subtopic) => ({ id: subtopic.subtopicId, label: subtopic.subtopicName, value: subtopic.solvedCount }))}
      />
      {withoutPractice.length > 0 && (
        <p className="pt-2 text-body-m text-content-secondary">
          {withoutPractice.map((subtopic) => subtopic.subtopicName).join(', ')} aún no {withoutPractice.length === 1 ? 'tiene' : 'tienen'} ejercicios
          resueltos.
        </p>
      )}
    </IndicatorCard>
  )
}
