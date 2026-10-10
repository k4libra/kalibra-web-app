/**
 * Authentication field validation and full-name adapter tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { toRegisterRequest, validateAuth } from '@/utils/authValidation'

describe('authentication validation', () => {
  it('validates required fields and registration password strength', () => {
    expect(validateAuth({ fullName: '', email: 'bad', password: '' }, true)).toHaveProperty('fullName')
    expect(
      validateAuth({ fullName: 'Ana Torres', email: 'ana@example.edu', password: 'abcdefgh' }, true),
    ).toHaveProperty('password')
    expect(validateAuth({ fullName: 'Ana Torres', email: 'ana@example.edu', password: 'Demo2025' }, true)).toEqual({})
    expect(validateAuth({ fullName: '', email: 'ana@example.edu', password: 'existing' }, false)).toEqual({})
  })
  it('preserves compound surnames and adapts the designed single password field', () => {
    expect(
      toRegisterRequest({ fullName: '  Ana  Torres Vega ', email: ' ana@example.edu ', password: 'Demo2025' }),
    ).toEqual({
      firstName: 'Ana',
      lastName: 'Torres Vega',
      email: 'ana@example.edu',
      password: 'Demo2025',
      confirmPassword: 'Demo2025',
    })
  })
})
