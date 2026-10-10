/**
 * Tests for the mastery presentation helpers.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { masteryTone } from './mastery'

describe('masteryTone', () => {
  it.each([[null, 'neutral'], [39, 'danger'], [40, 'warning'], [69, 'warning'], [70, 'success'], [71, 'success']] as const)('classifies the boundary %s as %s', (value, tone) => {
    expect(masteryTone(value)).toBe(tone)
  })
  it('is neutral without data', () => {
    expect(masteryTone(null)).toBe('neutral')
  })

  it('maps low, medium and high mastery to danger, warning and success', () => {
    expect(masteryTone(31)).toBe('danger')
    expect(masteryTone(65)).toBe('warning')
    expect(masteryTone(72)).toBe('success')
  })
})
