/**
 * Indicator of the verification of generated exercises.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, StackedBar } from '@/components/ui'
import type { SubtopicIndicator } from '@/types/indicators'
import { percent } from '@/utils/percent'
import { plural } from '@/utils/plural'
import { IndicatorCard } from './IndicatorCard'

/**
 * Props accepted by {@link VerificationIndicator}.
 */
export interface VerificationIndicatorProps {
  /** Indicators of each subtopic; subtopics without generated exercises are left out of the detail. */
  subtopics: SubtopicIndicator[]
  /** Called when the teacher wants to review the generated exercises. */
  onReviewExercises: () => void
}

/**
 * Shows which share of the generated exercises passed verification, in total and per subtopic.
 */
export function VerificationIndicator({ subtopics, onReviewExercises }: VerificationIndicatorProps) {
  const generatedSubtopics = subtopics.filter((subtopic) => subtopic.generatedCount > 0)
  const generated = generatedSubtopics.reduce((sum, subtopic) => sum + subtopic.generatedCount, 0)
  const approved = generatedSubtopics.reduce((sum, subtopic) => sum + subtopic.approvedCount, 0)
  const discarded = generated - approved
  const rate = percent(approved, generated)

  return (
    <IndicatorCard
      icon="verified"
      tone="primary"
      title="¿Qué tan confiables son los ejercicios generados?"
      subtitle="Ejercicios creados por la IA que aprobaron la verificación de corrección y dificultad"
      chip={{ label: `${approved} de ${generated} aprobados`, tone: 'success', icon: 'verified' }}
      kpi={rate === null ? '—' : `${rate}%`}
      kpiLabel="de los ejercicios generados aprobó la verificación"
      kpiDetail={`${discarded === 1 ? 'El descartado nunca se mostró' : `Los ${discarded} descartados nunca se mostraron`} a tus estudiantes.`}
      howToRead="cada ejercicio que crea la IA se revisa en corrección y dificultad antes de mostrarse. Un 90 % significa que 9 de cada 10 ejercicios generados fueron válidos; los descartados se reemplazan y nunca llegan a tus estudiantes."
    >
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex flex-wrap justify-between gap-2">
          <span className="text-label-l text-content-primary">Todos los subtemas</span>
          <span className="text-body-l text-content-secondary">
            {plural(approved, 'aprobado', 'aprobados')} · {plural(discarded, 'descartado', 'descartados')}
          </span>
        </div>
        <StackedBar
          label="Ejercicios aprobados y descartados"
          segments={[
            { label: 'Aprobados', value: approved, tone: 'success' },
            { label: 'Descartados', value: discarded, tone: 'danger' },
          ]}
        />
        <div className="flex gap-4 text-body-m text-content-secondary">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-secondary-strong" aria-hidden /> Aprobados
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-danger" aria-hidden /> Descartados
          </span>
        </div>
      </div>
      <ul>
        {generatedSubtopics.map((subtopic) => (
          <li key={subtopic.subtopicId} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-subtle py-3">
            <span className="flex-1 text-label-l text-content-primary">{subtopic.subtopicName}</span>
            <span className="text-body-l text-content-secondary">
              {subtopic.approvedCount} de {subtopic.generatedCount} aprobados
            </span>
            <span className="text-headline-l text-content-primary">{percent(subtopic.approvedCount, subtopic.generatedCount)}%</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3 border-t border-line-subtle pt-3 sm:flex-row sm:items-center">
        <span className="flex-1 text-body-m text-content-secondary">Revisa el motivo de cada descarte en Ejercicios generados.</span>
        <Button label="Ver ejercicios generados" icon="quiz" variant="tonal" onClick={onReviewExercises} />
      </div>
    </IndicatorCard>
  )
}
