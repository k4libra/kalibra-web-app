/**
 * Tests for the course indicators service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { indicatorsService } from './indicators.service'

describe('indicatorsService', () => {
  it('returns the indicators of a course with activity', async () => {
    expect(await indicatorsService.getIndicators('course-1')).not.toBeNull()
  })

  it('returns null for a course without activity', async () => {
    expect(await indicatorsService.getIndicators('course-2')).toBeNull()
  })

  it('downloads the API CSV using a neutral course identifier', async () => {
    expect((await indicatorsService.exportIndicators('course-1')).fileName).toBe('indicadores-course-1.csv')
  })
})
