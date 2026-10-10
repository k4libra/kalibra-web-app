/**
 * Tests for the modal dialog primitive.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders nothing while closed', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Crear curso" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is labelled by its title', () => {
    render(<Modal isOpen onClose={vi.fn()} title="Crear curso" />)
    expect(screen.getByRole('dialog', { name: 'Crear curso' })).toBeInTheDocument()
  })

  it('closes with Escape and with the close button', async () => {
    const handleClose = vi.fn()
    render(<Modal isOpen onClose={handleClose} title="Crear curso" />)
    await userEvent.keyboard('{Escape}')
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(handleClose).toHaveBeenCalledTimes(2)
  })
  it('contains keyboard focus and restores it to the trigger on close', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <>
        <button>Open</button>
        <Modal isOpen={false} onClose={() => {}} title="Confirm" actions={<button>Confirm</button>} />
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    rerender(
      <>
        <button>Open</button>
        <Modal isOpen onClose={() => {}} title="Confirm" actions={<button>Confirm</button>} />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus()
    rerender(
      <>
        <button>Open</button>
        <Modal isOpen={false} onClose={() => {}} title="Confirm" />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
  })
})
