/**
 * Password visibility, native attributes and accessible field feedback tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TextField } from '@/components/ui/TextField'

function Field() {
  const [value, setValue] = useState('Demo2025')
  return (
    <TextField
      type="password"
      label="Contraseña"
      value={value}
      onChange={setValue}
      description="Mínimo 8 caracteres"
      autoComplete="new-password"
    />
  )
}

describe('TextField', () => {
  it('toggles password visibility without losing the value and remains a non-submit control', async () => {
    render(<Field />)
    const input = screen.getByLabelText('Contraseña')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAccessibleDescription('Mínimo 8 caracteres')
    const toggle = screen.getByRole('button', { name: 'Mostrar contraseña' })
    expect(toggle).toHaveAttribute('type', 'button')
    await userEvent.click(toggle)
    expect(input).toHaveAttribute('type', 'text')
    await userEvent.type(input, 'X')
    await userEvent.click(screen.getByRole('button', { name: 'Ocultar contraseña' }))
    expect(input).toHaveValue('Demo2025X')
    expect(input).toHaveAttribute('type', 'password')
  })
  it('associates validation errors and forwards disabled and autocomplete attributes', () => {
    render(
      <TextField
        label="Correo"
        value="bad"
        onChange={() => {}}
        type="email"
        autoComplete="email"
        status="error"
        description="Correo inválido"
        disabled
      />,
    )
    expect(screen.getByLabelText('Correo')).toBeDisabled()
    expect(screen.getByLabelText('Correo')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Correo')).toHaveAccessibleDescription('Correo inválido')
    expect(screen.getByLabelText('Correo')).toHaveAttribute('autocomplete', 'email')
  })
})
