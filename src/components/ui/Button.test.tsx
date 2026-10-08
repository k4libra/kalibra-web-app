/**
 * Tests for the button primitive.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('calls onClick when pressed', async () => {
    const handleClick = vi.fn()
    render(<Button label="Crear curso" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Crear curso' }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button label="Crear curso" disabled onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Crear curso' }))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
