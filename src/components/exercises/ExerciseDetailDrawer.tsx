/**
 * Drawer with the full detail of a generated exercise.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Callout, Chip, CodeBlock, FormulaBlock, Drawer, Icon } from '@/components/ui'
import type { GeneratedExercise } from '@/types/exercise'
import { splitExerciseContent } from '@/utils/exerciseContent'
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
            Generado {exercise.generatedAt.toLowerCase()} · Opción múltiple{exercise.sourceMaterial ? ` · anclado a ${exercise.sourceMaterial}` : ''}
          </p>
          <div className="flex flex-col gap-2.5 rounded-md bg-primary-subtle p-4">
            <p className="text-label-s text-content-muted">ENUNCIADO</p>
            {splitExerciseContent(exercise.statement).map((block, index) => block.kind === 'code'
              ? <CodeBlock key={index} code={block.value} language={block.language} />
              : block.kind === 'formula' ? <FormulaBlock key={index} formula={block.value} />
              : <p key={index} className="text-title whitespace-pre-wrap text-content-primary">{block.value}</p>)}
            {exercise.code && <CodeBlock code={exercise.code} />}
          </div>
          <ul className="flex flex-col gap-1.5" aria-label="Opciones">
            {exercise.options.map((option) => (
              <li
                key={option.letter}
                className={cn(
                  'flex items-center gap-2.5 rounded-md border px-3 py-2',
                  option.isCorrect ? 'border-secondary-accent bg-secondary-pale' : 'border-line-default bg-surface-card',
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
          {exercise.explanationSteps?.length ? (
            <ol aria-label="Explicación paso a paso" className="flex flex-col gap-4">
              {exercise.explanationSteps.map((step, index) => <li key={index} className="flex flex-col gap-2">
                <h3 className="text-title text-content-primary">{index + 1}. {step.title}</h3>
                {step.kind === 'CODE' ? <CodeBlock code={step.detail} />
                  : step.kind === 'FORMULA' ? <FormulaBlock formula={step.detail} />
                  : <p className="whitespace-pre-wrap text-body-l text-content-secondary">{step.detail}</p>}
              </li>)}
            </ol>
          ) : exercise.explanation && <Callout icon="info">{exercise.explanation}</Callout>}
          {exercise.keyIdea && <Callout icon="lightbulb"><strong>Idea clave</strong><p>{exercise.keyIdea}</p></Callout>}
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
          <ul className="flex flex-col gap-3" aria-label="Criterios de verificación">
            {['Corrección técnica', 'Nivel de dificultad', 'Anclaje curricular'].filter((label) => !exercise.checks.some((check) => check.label === label)).map((label) => <li key={label} className="flex items-start gap-2.5">
              <Icon name="help" size="lg" className="text-content-muted" /><span><span className="block text-label-l">{label}</span><span className="block text-body-m text-content-secondary">El servicio no entrega un resultado individual para este criterio.</span></span>
            </li>)}
          </ul>
          {exercise.status === 'discarded' && (
            <Callout icon="block" tone="danger" size="sm">
              Descartado automáticamente: no se mostró a ningún estudiante.
            </Callout>
          )}
        </>
      )}
    </Drawer>
  )
}
