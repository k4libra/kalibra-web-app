/** Numeric presentation regressions.
 * @author Not specified
 * @packageDocumentation
 */
import { describe, expect, it } from 'vitest'
import { formatDelta, formatNumber } from './number'
describe('numeric presentation', () => {
  it.each([[Number('2.4999999999999993'), '+2 pts'], [2.5, '+3 pts'], [-2.7, '−3 pts'], [-0.1, '0 pts'], [0, '0 pts']])('formats %s as %s', (value, expected) => {
    expect(formatDelta(Number(value))).toBe(expected)
  })
  it('allows one fractional digit for practice averages and omits binary artifacts', () => {
    expect(formatNumber(34.49999999999999, 1)).toBe('34.5')
    expect(formatNumber(69.99999999999999)).toBe('70')
  })
})
