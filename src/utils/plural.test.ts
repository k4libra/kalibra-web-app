/**
 * Tests for the count label helper.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { plural } from './plural'

describe('plural', () => {
  it('uses the singular form for one item', () => {
    expect(plural(1, 'curso', 'cursos')).toBe('1 curso')
  })

  it('uses the plural form for zero and many items', () => {
    expect(plural(0, 'curso', 'cursos')).toBe('0 cursos')
    expect(plural(3, 'curso', 'cursos')).toBe('3 cursos')
  })
})
