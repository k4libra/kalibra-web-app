/**
 * Tests for the mastery presentation helpers.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { masteryTone } from './mastery'

describe('masteryTone', () => {
  it('is neutral without data', () => {
    expect(masteryTone(null)).toBe('neutral')
  })

  it('maps low, medium and high mastery to danger, warning and success', () => {
    expect(masteryTone(31)).toBe('danger')
    expect(masteryTone(65)).toBe('warning')
    expect(masteryTone(72)).toBe('success')
  })
})
