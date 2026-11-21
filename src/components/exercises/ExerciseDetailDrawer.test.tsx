/** Tests structured explanations and legacy fallback through the HTTP adapter.
 * @packageDocumentation
 */
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ExerciseDetailDrawer } from './ExerciseDetailDrawer'
import { exercisesService } from '@/services/exercises.service'
import { apiStub } from '@/test/apiStub'
import type { ExerciseDto } from '@/types/api'

async function showExercise(fields: Partial<ExerciseDto>) {
  const exercise: ExerciseDto = {
    id: 'exercise', subtopicId: 'sub-1', origin: 'TEACHER_REQUEST', statement: '¿Cuánto es 2 + 2?',
    options: [{ key: 'A', text: '4', correct: true }], explanation: 'Explicación anterior.',
    difficulty: 'EASY', verdict: 'APPROVED', rejectionReason: null, generatedAt: '2026-10-10T12:00:00Z', ...fields,
  }
  apiStub.respond('/courses/course-1/generated-exercises', 200, { content: [exercise], page: 0, size: 20, totalElements: 1, totalPages: 1 })
  const [catalog] = await exercisesService.listCatalogs()
  return render(<ExerciseDetailDrawer exercise={catalog.subtopics[0].exercises[0]} subtopicName="Sumas" onClose={vi.fn()} />)
}

describe('ExerciseDetailDrawer', () => {
  it('renders ordered TEXT, CODE and FORMULA steps and the key idea', async () => {
    const { container } = await showExercise({
      explanationSteps: [
        { title: 'Identifica los valores', detail: 'Ambos sumandos valen dos.', kind: 'TEXT' },
        { title: 'Calcula', detail: 'const total = 2 + 2;\nreturn total;', kind: 'CODE' },
        { title: 'Comprueba', detail: '2 + 2 = 4', kind: 'FORMULA' },
      ], keyIdea: 'Sumar reúne las cantidades.',
    })
    const steps = within(screen.getByRole('list', { name: 'Explicación paso a paso' }))
    expect(steps.getAllByRole('listitem')).toHaveLength(3)
    expect(steps.getAllByRole('heading').map((heading) => heading.textContent)).toEqual(['1. Identifica los valores', '2. Calcula', '3. Comprueba'])
    expect(steps.getByText('Ambos sumandos valen dos.').tagName).toBe('P')
    expect(container.querySelector('pre code')).toHaveTextContent('const total = 2 + 2;')
    expect(steps.getByLabelText('Fórmula del ejercicio')).toHaveTextContent('2 + 2 = 4')
    expect(screen.getByText('Idea clave')).toBeInTheDocument()
    expect(screen.getByText('Sumar reúne las cantidades.')).toBeInTheDocument()
    expect(screen.queryByText('Explicación anterior.')).not.toBeInTheDocument()
  })

  it.each([undefined, null, []])('falls back to the plain explanation when steps are %s', async (explanationSteps) => {
    await showExercise({ explanationSteps, keyIdea: null })
    expect(screen.getByText('Explicación anterior.')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Explicación paso a paso' })).not.toBeInTheDocument()
    expect(screen.queryByText('Idea clave')).not.toBeInTheDocument()
  })

  it('preserves the plain explanation when only the key idea is supplied', async () => {
    await showExercise({ keyIdea: 'Una idea para recordar.' })
    expect(screen.getByText('Explicación anterior.')).toBeInTheDocument()
    expect(screen.getByText('Una idea para recordar.')).toBeInTheDocument()
  })
})
