/**
 * Tests row menu boundaries, lock explanations and inline editing callbacks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SUBTOPICS } from '@/test/uiFixtures'
import { SubtopicEditorRow } from './SubtopicEditorRow'

describe('SubtopicEditorRow', () => {
  it.each([{ order: 1, unavailable: 'Mover arriba', available: 'Mover abajo', destination: 2 },
    { order: 4, unavailable: 'Mover abajo', available: 'Mover arriba', destination: 3 }])(
    'disables the unavailable move at order $order and emits the available destination', async ({ order, unavailable, available, destination }) => {
      const move = vi.fn()
      render(<SubtopicEditorRow subtopic={{ ...SUBTOPICS[0], order, locked: false }} total={4} isSubmitting={false}
        onMove={move} onRename={vi.fn()} onStatus={vi.fn()} onDelete={vi.fn()} />)
      const user = userEvent.setup()
      expect(screen.getAllByRole('button')).toHaveLength(1)
      await user.click(screen.getByRole('button', { name: /Acciones de/ }))
      expect(screen.getAllByRole('menuitem')).toHaveLength(5)
      await user.click(screen.getByRole('menuitem', { name: new RegExp(unavailable) }))
      expect(move).not.toHaveBeenCalled()
      await user.click(screen.getByRole('menuitem', { name: available }))
      expect(move).toHaveBeenCalledWith(destination)
    },
  )

  it('opens inline rename from the menu, cancels and saves only the trimmed name', async () => {
    const rename = vi.fn().mockResolvedValue(true)
    render(<SubtopicEditorRow subtopic={{ ...SUBTOPICS[0], locked: false }} total={4} isSubmitting={false}
      onMove={vi.fn()} onRename={rename} onStatus={vi.fn()} onDelete={vi.fn()} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Acciones de/ }))
    await user.click(screen.getByRole('menuitem', { name: 'Renombrar' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(rename).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: /Acciones de/ }))
    await user.click(screen.getByRole('menuitem', { name: 'Renombrar' }))
    const field = screen.getByRole('textbox')
    await user.clear(field)
    await user.type(field, '  Nombre actualizado  ')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(rename).toHaveBeenCalledWith('Nombre actualizado')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
