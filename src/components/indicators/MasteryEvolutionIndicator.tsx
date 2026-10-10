/**
 * Indicator of the mastery change per subtopic.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Chip, ComparisonBar } from '@/components/ui'
import type { SubtopicIndicator } from '@/types/indicators'
import { masteryTone } from '@/utils/mastery'
import { IndicatorCard } from './IndicatorCard'

/**
 * Props accepted by {@link MasteryEvolutionIndicator}.
 */
export interface MasteryEvolutionIndicatorProps {
  /** Indicators of each subtopic. */
  subtopics: SubtopicIndicator[]
}

// Formats a change in points with an explicit sign.
const formatDelta = (delta: number) => `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${Math.abs(delta)} pts`

/**
 * Compares the group mastery at the start and today for each subtopic.
 */
export function MasteryEvolutionIndicator({ subtopics }: MasteryEvolutionIndicatorProps) {
  const practiced = subtopics.filter((subtopic) => subtopic.initialMastery !== null && subtopic.currentMastery !== null)
  const average = (values: number[]) => (values.length === 0 ? 0 : Math.round(values.reduce((sum, value) => sum + value, 0) / values.length))
  const start = average(practiced.map((subtopic) => subtopic.initialMastery ?? 0))
  const now = average(practiced.map((subtopic) => subtopic.currentMastery ?? 0))
  const improving = practiced.filter((subtopic) => (subtopic.currentMastery ?? 0) > (subtopic.initialMastery ?? 0))
  const declining = practiced.filter((subtopic) => (subtopic.currentMastery ?? 0) < (subtopic.initialMastery ?? 0))

  return (
    <IndicatorCard
      icon="insights"
      tone="success"
      title="¿Cuánto avanzó el dominio de cada subtema?"
      subtitle="Dominio del grupo en cada subtema · al empezar frente a hoy"
      chip={{ label: `Avanza en ${improving.length} de ${practiced.length} subtemas`, tone: 'success', icon: 'trending_up' }}
      kpi={formatDelta(now - start)}
      kpiLabel={`Dominio promedio del grupo: de ${start}% a ${now}%`}
      kpiDetail={
        declining.length > 0
          ? `${declining.map((subtopic) => `${subtopic.subtopicName} retrocede ${Math.abs((subtopic.currentMastery ?? 0) - (subtopic.initialMastery ?? 0))} pts`).join('; ')}: conviene reforzarla en clase.`
          : 'Ningún subtema retrocede.'
      }
      howToRead="el dominio indica qué tan preparado está tu grupo para resolver bien los ejercicios del subtema (de 0 % a 100 %) y Kalibra lo actualiza con cada respuesta. La marca oscura muestra cómo empezó el grupo y la barra de color cómo va hoy: si la barra supera la marca, el grupo aprendió en ese subtema."
    >
      <div className="flex flex-wrap gap-4 pb-3 text-body-m text-content-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-primary-pale" aria-hidden /> Hoy (color según nivel)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-0.75 bg-content-primary" aria-hidden /> Al empezar
        </span>
      </div>
      <ul className="flex flex-col gap-4">
        {subtopics.map((subtopic) => {
          const hasData = subtopic.initialMastery !== null && subtopic.currentMastery !== null
          const delta = (subtopic.currentMastery ?? 0) - (subtopic.initialMastery ?? 0)
          return (
            <li key={subtopic.subtopicId} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex-1 text-label-l text-content-primary">{subtopic.subtopicName}</span>
                {hasData ? (
                  <>
                    <span className="text-body-l text-content-secondary">
                      {subtopic.initialMastery}% → {subtopic.currentMastery}%
                    </span>
                    <Chip
                      label={formatDelta(delta)}
                      tone={delta >= 0 ? 'success' : 'danger'}
                      icon={delta >= 0 ? 'arrow_upward' : 'arrow_downward'}
                    />
                  </>
                ) : (
                  <Chip label="Sin práctica aún" tone="neutral" icon="hourglass_empty" />
                )}
              </div>
              <ComparisonBar
                value={subtopic.currentMastery}
                marker={subtopic.initialMastery}
                tone={masteryTone(subtopic.currentMastery)}
                label={`Dominio de ${subtopic.subtopicName} al empezar y hoy`}
              />
            </li>
          )
        })}
      </ul>
    </IndicatorCard>
  )
}
