/**
 * Tests for the class name helper.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names with a space', () => {
    expect(cn('flex', 'gap-2')).toBe('flex gap-2')
  })

  it('skips falsy values', () => {
    expect(cn('flex', false, null, undefined, '', 'p-4')).toBe('flex p-4')
  })
})
