/**
 * Drawer with the full detail of a generated exercise.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Callout, Chip, Drawer, Icon } from '@/components/ui'
import type { GeneratedExercise } from '@/types/exercise'
import { cn } from '@/utils/cn'
import { VerificationChip } from './VerificationChip'

/**
 * Props accepted by {@link ExerciseDetailDrawer}.
 */
export interface ExerciseDetailDrawerProps {
  /** Exercise to show; `null` keeps the drawer closed. */
  exercise: GeneratedExercise | null
  /** Name of the subtopic of the exercise. */
  subtopicName: string
  /** Called when the teacher closes the drawer. */
  onClose: () => void
}

/**
 * Shows the statement, options, correct answer and verification checks of an exercise.
 */
export function ExerciseDetailDrawer({ exercise, subtopicName, onClose }: ExerciseDetailDrawerProps) {
  return (
    <Drawer
      isOpen={exercise !== null}
      onClose={onClose}
      title="Detalle del ejercicio"
      footer={<Button label="Cerrar" variant="neutral" fullWidth onClick={onClose} />}
    >
      {exercise && (
        <>
          <div className="flex flex-wrap gap-1.5">
            <VerificationChip status={exercise.status} />
            <Chip label={subtopicName} />
            <Chip label={exercise.difficulty} tone="neutral" />
          </div>
          <p className="text-body-m text-content-secondary">
            Generado {exercise.generatedAt.toLowerCase()} · Opción múltiple · anclado a {exercise.sourceMaterial}
          </p>
          <div className="flex flex-col gap-2.5 rounded-md bg-primary-subtle p-4">
            <p className="text-label-s text-content-muted">ENUNCIADO</p>
            <p className="text-title text-content-primary">{exercise.statement}</p>
            {exercise.code && (
              <pre className="overflow-x-auto rounded-sm bg-surface-code p-3 font-mono text-body-m text-content-on-primary">{exercise.code}</pre>
            )}
          </div>
          <ul className="flex flex-col gap-1.5" aria-label="Opciones">
            {exercise.options.map((option) => (
              <li
                key={option.letter}
                className={cn(
                  'flex items-center gap-2.5 rounded-md border px-3 py-2',
                  option.isCorrect ? 'border-secondary-strong bg-secondary-container/30' : 'border-line-default bg-surface-card',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-6 items-center justify-center rounded-full text-label-s',
                    option.isCorrect ? 'bg-secondary-strong text-content-on-primary' : 'bg-primary-container text-primary-strong',
                  )}
                >
                  {option.letter}
                </span>
                <span className="flex-1 text-body-l text-content-primary">{option.text}</span>
                {option.isCorrect && <Chip label="Correcta" tone="success" icon="check" />}
              </li>
            ))}
          </ul>
          <p className="text-label-s text-content-muted">RESULTADO DE LA VERIFICACIÓN</p>
          <ul className="flex flex-col gap-3">
            {exercise.checks.map((check) => (
              <li key={check.label} className="flex items-start gap-2.5">
                <Icon
                  name={check.passed ? 'check_circle' : 'cancel'}
                  size="lg"
                  label={check.passed ? 'Aprobado' : 'No aprobado'}
                  className={check.passed ? 'text-secondary-strong' : 'text-danger'}
                />
                <span className="flex flex-col">
                  <span className="text-label-l text-content-primary">{check.label}</span>
                  <span className="text-body-m text-content-secondary">{check.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          {exercise.status === 'discarded' && (
            <Callout icon="block" tone="danger" size="sm">
              Descartado automáticamente: no se mostró a ningún estudiante y se generó un reemplazo.
            </Callout>
          )}
        </>
      )}
    </Drawer>
  )
}
