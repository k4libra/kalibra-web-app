/**
 * Tests for the select primitive.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'

const OPTIONS = [
  { value: 'a', label: 'Curso A' },
  { value: 'b', label: 'Curso B' },
  { value: 'c', label: 'Curso C', disabled: true },
]

describe('Select', () => {
  it('reports the option the user chooses', async () => {
    const handleChange = vi.fn()
    render(<Select label="Curso" options={OPTIONS} value="a" onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Curso' }))
    await userEvent.click(screen.getByRole('option', { name: 'Curso B' }))
    expect(handleChange).toHaveBeenCalledWith('b')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('ignores disabled options', async () => {
    const handleChange = vi.fn()
    render(<Select label="Curso" options={OPTIONS} value="a" onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Curso' }))
    await userEvent.click(screen.getByRole('option', { name: 'Curso C' }))
    expect(handleChange).not.toHaveBeenCalled()
  })
})
