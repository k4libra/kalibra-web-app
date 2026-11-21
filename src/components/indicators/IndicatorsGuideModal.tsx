/**
 * Dialog that explains how to read the course indicators.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IndicatorGuideEntry } from '@/types/api'
import { Button, Callout, LoadingState, IconBox, Modal } from '@/components/ui'
import type { IconName, Tone } from '@/types/ui'

// Plain-language guide of each indicator, in the order the page shows them.
const GUIDE: Array<{ indicator: string; icon: IconName; tone: Tone; title: string; measures: string; goodSign: string }> = [
  {
    indicator: 'ACCURACY',
    icon: 'fact_check',
    tone: 'primary',
    title: '¿Qué tan bien responden tus estudiantes?',
    measures: 'la parte de las respuestas de tus estudiantes que fueron correctas.',
    goodSign: 'un porcentaje alto; si baja, revisa el mapa de brechas.',
  },
  {
    indicator: 'PRACTICE',
    icon: 'task_alt',
    tone: 'warning',
    title: '¿Cuánto practican tus estudiantes?',
    measures: 'los ejercicios que tu grupo resuelve en cada subtema.',
    goodSign: 'todos los subtemas tienen práctica.',
  },
  {
    indicator: 'MASTERY_EVOLUTION',
    icon: 'insights',
    tone: 'success',
    title: '¿Cuánto avanzó el dominio de cada subtema?',
    measures: 'qué tan preparados están tus estudiantes para resolver bien los ejercicios del subtema, al empezar y hoy.',
    goodSign: 'la barra de hoy supera la marca de «Al empezar».',
  },
  {
    indicator: 'VERIFICATION_APPROVAL',
    icon: 'verified',
    tone: 'primary',
    title: '¿Qué tan confiables son los ejercicios generados?',
    measures: 'qué parte de los ejercicios creados por la IA aprobó la revisión de corrección y dificultad.',
    goodSign: 'un porcentaje alto; los descartados nunca llegan a tus estudiantes.',
  },
]

/**
 * Props accepted by {@link IndicatorsGuideModal}.
 */
export interface IndicatorsGuideModalProps {
  /** Official guide content supplied by the API. */
  entries?: IndicatorGuideEntry[]
  /** Whether the guide is loading. */
  isLoading?: boolean
  /** Failure returned by the guide request. */
  error?: string | null
  /** Repeats a failed guide request. */
  onRetry?: () => void
  /** Whether the dialog is visible. */
  isOpen: boolean
  /** Called when the teacher closes the dialog. */
  onClose: () => void
}

/**
 * Explains in plain language what each indicator measures and what a good sign looks like.
 */
export function IndicatorsGuideModal({ isOpen, onClose, entries, isLoading, error, onRetry }: IndicatorsGuideModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      icon="help"
      title="Cómo leer los indicadores del curso"
      description="Cuatro preguntas para saber si Kalibra está ayudando a tu grupo. Cada una se responde con datos de tu curso."
      actions={<Button label="Entendido" icon="check" onClick={onClose} />}
    >
      {isLoading ? <LoadingState /> : error ? <Callout icon="error" tone="danger" action={<Button label="Reintentar" onClick={onRetry} />}>{error}</Callout> : <ul className="flex flex-col">
        {(entries ? entries.map((entry) => ({ ...(GUIDE.find((item) => item.indicator === entry.indicator) ?? { icon: 'help' as IconName, tone: 'primary' as Tone, title: 'Guía del indicador' }), indicator: entry.indicator, measures: entry.whatItMeasures, goodSign: entry.goodSignal })) : GUIDE).map((item) => (
          <li key={item.indicator} className="flex gap-3.5 border-t border-line-subtle py-3.5 first:border-t-0">
            <IconBox icon={item.icon} tone={item.tone} size="sm" />
            <div className="flex flex-col gap-1">
              <p className="text-label-l text-content-primary">{item.title}</p>
              <p className="text-body-m text-content-secondary">Qué mide: {item.measures}</p>
              <p className="text-body-m text-content-secondary">Buena señal: {item.goodSign}</p>
            </div>
          </li>
        ))}
      </ul>}
    </Modal>
  )
}
