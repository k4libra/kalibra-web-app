/**
 * Indicator of the correct answers of the students.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Avatar, Chip, ProgressBar } from '@/components/ui'
import type { StudentAccuracy } from '@/types/indicators'
import { masteryTone } from '@/utils/mastery'
import { percent } from '@/utils/percent'
import { IndicatorCard } from './IndicatorCard'

/**
 * Props accepted by {@link AccuracyIndicator}.
 */
export interface AccuracyIndicatorProps {
  /** Answers of each enrolled student. */
  students: StudentAccuracy[]
}

/**
 * Renders one row of the accuracy table.
 */
function AccuracyRow({ name, initials, correct, answered }: { name: string; initials?: string; correct: number; answered: number }) {
  const value = percent(correct, answered)
  return (
    <li className="grid grid-cols-12 items-center gap-3 border-t border-line-subtle py-3 first:border-t-0">
      <span className="col-span-12 flex items-center gap-2.5 sm:col-span-5">
        {initials && <Avatar initials={initials} size="sm" />}
        <span className="text-label-l text-content-primary">{name}</span>
      </span>
      <span className="col-span-9 flex flex-col gap-1.5 sm:col-span-5">
        {value === null ? (
          <Chip label="Sin actividad" tone="neutral" icon="hourglass_empty" />
        ) : (
          <>
            <span className="text-body-m text-content-secondary">
              {correct} de {answered}
            </span>
            <ProgressBar value={value} tone={masteryTone(value)} size="md" label={`Aciertos de ${name}`} />
          </>
        )}
      </span>
      <span className="col-span-3 text-right text-title text-content-primary sm:col-span-2">{value === null ? '—' : `${value}%`}</span>
    </li>
  )
}

/**
 * Shows the share of correct answers of each student and of the group.
 */
export function AccuracyIndicator({ students }: AccuracyIndicatorProps) {
  const active = students.filter((student) => student.answeredCount > 0)
  const correct = active.reduce((total, student) => total + student.correctCount, 0)
  const answered = active.reduce((total, student) => total + student.answeredCount, 0)
  const group = percent(correct, answered)

  return (
    <IndicatorCard
      icon="fact_check"
      tone="primary"
      title="¿Qué tan bien responden tus estudiantes?"
      subtitle="Porcentaje de respuestas correctas en los ejercicios resueltos"
      chip={{ label: `${active.length} de ${students.length} estudiantes con actividad`, tone: 'neutral', icon: 'group' }}
      kpi={group === null ? '—' : `${group}%`}
      kpiLabel="de respuestas correctas del grupo"
      kpiDetail={`${correct} de ${answered} respuestas correctas.`}
      howToRead="es la parte de las respuestas que tus estudiantes contestaron bien, y se actualiza con cada ejercicio resuelto. Si baja, revisa el mapa de brechas para ver en qué subtemas fallan más."
    >
      <div className="hidden grid-cols-12 gap-3 pb-1 text-label-s text-content-muted sm:grid">
        <span className="col-span-5">ESTUDIANTE</span>
        <span className="col-span-5">RESPUESTAS CORRECTAS</span>
        <span className="col-span-2 text-right">ACIERTOS</span>
      </div>
      <ul>
        {students.map((student) => (
          <AccuracyRow
            key={student.studentId}
            name={student.fullName}
            initials={student.initials}
            correct={student.correctCount}
            answered={student.answeredCount}
          />
        ))}
      </ul>
      <ul className="mt-1 rounded-sm bg-primary-subtle px-3">
        <AccuracyRow name="Grupo" correct={correct} answered={answered} />
      </ul>
    </IndicatorCard>
  )
}
