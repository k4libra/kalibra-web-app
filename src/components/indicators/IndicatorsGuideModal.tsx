/**
 * Dialog that explains how to read the course indicators.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, IconBox, Modal } from '@/components/ui'
import type { IconName, Tone } from '@/types/ui'

// Plain-language guide of each indicator, in the order the page shows them.
const GUIDE: Array<{ icon: IconName; tone: Tone; title: string; measures: string; goodSign: string }> = [
  {
    icon: 'fact_check',
    tone: 'primary',
    title: '¿Qué tan bien responden tus estudiantes?',
    measures: 'la parte de las respuestas de tus estudiantes que fueron correctas.',
    goodSign: 'un porcentaje alto; si baja, revisa el mapa de brechas.',
  },
  {
    icon: 'task_alt',
    tone: 'warning',
    title: '¿Cuánto practican tus estudiantes?',
    measures: 'los ejercicios que tu grupo resuelve en cada subtema.',
    goodSign: 'todos los subtemas tienen práctica.',
  },
  {
    icon: 'insights',
    tone: 'success',
    title: '¿Cuánto avanzó el dominio de cada subtema?',
    measures: 'qué tan preparados están tus estudiantes para resolver bien los ejercicios del subtema, al empezar y hoy.',
    goodSign: 'la barra de hoy supera la marca de «Al empezar».',
  },
  {
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
  /** Whether the dialog is visible. */
  isOpen: boolean
  /** Called when the teacher closes the dialog. */
  onClose: () => void
}

/**
 * Explains in plain language what each indicator measures and what a good sign looks like.
 */
export function IndicatorsGuideModal({ isOpen, onClose }: IndicatorsGuideModalProps) {
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
      <ul className="flex flex-col">
        {GUIDE.map((item) => (
          <li key={item.title} className="flex gap-3.5 border-t border-line-subtle py-3.5 first:border-t-0">
            <IconBox icon={item.icon} tone={item.tone} size="sm" />
            <div className="flex flex-col gap-1">
              <p className="text-label-l text-content-primary">{item.title}</p>
              <p className="text-body-m text-content-secondary">Qué mide: {item.measures}</p>
              <p className="text-body-m text-content-secondary">Buena señal: {item.goodSign}</p>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
