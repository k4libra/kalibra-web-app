import { describe, expect, it } from 'vitest'
import { daysUntil, formatRelativeDateTime, formatShortDate, formatShortDateTime } from './date'

describe('short date labels', () => {
  it('formats dates and times like the design', () => {
    const date = new Date(2025, 8, 12, 9, 30)
    expect(formatShortDate(date)).toBe('12 sep 2025')
    expect(formatShortDateTime(date)).toBe('12 sep 2025, 09:30')
  })
  it('counts whole remaining days and never goes negative', () => {
    const now = new Date(2025, 8, 12, 9, 0)
    expect(daysUntil(new Date(2025, 8, 14, 8, 0), now)).toBe(2)
    expect(daysUntil(new Date(2025, 8, 10), now)).toBe(0)
  })
})

describe('relative date labels', () => {
  it('uses Hoy and Ayer before falling back to a short date', () => {
    const now = new Date(2025, 8, 12, 18, 0)
    expect(formatRelativeDateTime(new Date(2025, 8, 12, 10, 12), now)).toBe('Hoy, 10:12')
    expect(formatRelativeDateTime(new Date(2025, 8, 11, 16, 40), now)).toBe('Ayer, 16:40')
    expect(formatRelativeDateTime(new Date(2025, 8, 3, 15, 12), now)).toBe('03 sep 2025, 15:12')
  })
})
