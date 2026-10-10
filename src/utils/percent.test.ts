/**
 * Tests for the percentage helpers.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { percent } from './percent'

describe('percent', () => {
  it('rounds the percentage', () => {
    expect(percent(48, 69)).toBe(70)
  })

  it('returns null without a reference amount', () => {
    expect(percent(0, 0)).toBeNull()
  })
})
