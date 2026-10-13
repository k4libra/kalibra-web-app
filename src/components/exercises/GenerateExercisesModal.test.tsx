/**
 * Tests generation choices restricted to active subtopics with ready material.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { COURSES, SUBTOPICS } from '@/test/uiFixtures'
import { GenerateExercisesModal } from './GenerateExercisesModal'

describe('GenerateExercisesModal', () => {
  it('omits archived ready material and generates for the active ready subtopic', async () => {
    const generate = vi.fn()
    render(<GenerateExercisesModal courses={[{ course: COURSES[0], subtopics: [{ ...SUBTOPICS[0], status: 'ARCHIVED' }, SUBTOPICS[1]] }]}
      isSubmitting={false} onClose={vi.fn()} onGenerate={generate} onUploadMaterial={vi.fn()} />)
    expect(screen.queryByText(SUBTOPICS[0].name)).not.toBeInTheDocument()
    expect(screen.getByRole('radio')).toBeChecked()
    await userEvent.click(screen.getByRole('button', { name: 'Generar 10 ejercicios' }))
    expect(generate).toHaveBeenCalledExactlyOnceWith('course-1', 'sub-2')
  })
  it('disables generation when the only ready material belongs to an archived subtopic', () => {
    render(<GenerateExercisesModal courses={[{ course: COURSES[0], subtopics: [{ ...SUBTOPICS[0], status: 'ARCHIVED' }] }]}
      isSubmitting={false} onClose={vi.fn()} onGenerate={vi.fn()} onUploadMaterial={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Generar 10 ejercicios' })).toBeDisabled()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })
})
