/**
 * Tests menu semantics, focus, keyboard navigation and dismissal.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ActionMenu } from './ActionMenu'

function setup() {
  const select = vi.fn()
  render(<><ActionMenu label="Acciones de Tema" items={[
    { id: 'rename', label: 'Renombrar', icon: 'edit', onSelect: select },
    { id: 'delete', label: 'Eliminar', icon: 'delete', disabled: true, disabledReason: 'Tiene material', onSelect: select },
    { id: 'archive', label: 'Archivar', icon: 'folder_open', onSelect: select },
  ]} /><button>Después</button></>)
  return { user: userEvent.setup(), select, trigger: screen.getByRole('button', { name: 'Acciones de Tema' }) }
}

describe('ActionMenu', () => {
  it('opens with Enter, exposes menu relationships and wraps arrow navigation including disabled reasons', async () => {
    const { user, trigger, select } = setup()
    trigger.focus()
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('menu').id)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menuitem', { name: 'Renombrar' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    const disabled = screen.getByRole('menuitem', { name: /Eliminar/ })
    expect(disabled).toHaveFocus()
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    expect(disabled).toHaveAccessibleDescription('Tiene material')
    await user.keyboard('{Enter} ')
    expect(select).not.toHaveBeenCalled()
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Renombrar' })).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('menuitem', { name: 'Archivar' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('menuitem', { name: 'Renombrar' })).toHaveFocus()
    await user.keyboard('{End}{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('opens with Space and selects with the keyboard, returning focus to the trigger', async () => {
    const { user, trigger, select } = setup()
    trigger.focus()
    await user.keyboard(' ')
    await user.keyboard('{Enter}')
    expect(select).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('opens at the last item with ArrowUp and exits to the following control with Tab', async () => {
    const { user, trigger } = setup()
    trigger.focus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('menuitem', { name: 'Archivar' })).toHaveFocus()
    await user.tab()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Después' })).toHaveFocus()
  })

  it('closes on outside interaction and toggles closed from the trigger', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Después' }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await user.click(trigger)
    await user.click(trigger)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('blocks the trigger while saving', async () => {
    render(<ActionMenu label="Acciones" disabled items={[]} />)
    await userEvent.click(screen.getByRole('button', { name: 'Acciones' }))
    expect(screen.getByRole('button', { name: 'Acciones' })).toBeDisabled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
