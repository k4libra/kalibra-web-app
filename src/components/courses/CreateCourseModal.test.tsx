/**
 * Tests editable course drafts before their single creation request.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CreateCourseModal } from './CreateCourseModal'

describe('CreateCourseModal', () => {
  it('edits and removes draft names and emits the final trimmed list', async () => {
    const onSubmit = vi.fn()
    render(<CreateCourseModal isSubmitting={false} onClose={vi.fn()} onSubmit={onSubmit} />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nombre del curso'), ' Curso ')
    await user.type(screen.getByLabelText('Código'), ' CODE ')
    await user.type(screen.getByLabelText('Nuevo subtema'), 'Primero{Enter}Segundo{Enter}')
    const field = screen.getByLabelText('Subtema 1')
    await user.clear(field)
    expect(screen.getByRole('button', { name: 'Crear curso' })).toBeDisabled()
    await user.type(field, ' Renombrado ')
    await user.click(screen.getByRole('button', { name: 'Eliminar subtema 2' }))
    await user.click(screen.getByRole('button', { name: 'Crear curso' }))
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ name: 'Curso', code: 'CODE', subtopics: ['Renombrado'] })
  })

  it('disables creation again after removing the last draft', async () => {
    render(<CreateCourseModal isSubmitting={false} onClose={vi.fn()} onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('Nombre del curso'), 'Curso')
    await userEvent.type(screen.getByLabelText('Código'), 'CODE')
    await userEvent.type(screen.getByLabelText('Nuevo subtema'), 'Tema{Enter}')
    expect(screen.getByRole('button', { name: 'Crear curso' })).toBeEnabled()
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar subtema 1' }))
    expect(screen.getByRole('button', { name: 'Crear curso' })).toBeDisabled()
  })
})
