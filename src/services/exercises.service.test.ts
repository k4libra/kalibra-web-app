/**
 * Tests for the generated exercises service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { exercisesService } from './exercises.service'

describe('exercisesService', () => {
  it('lists catalogs grouped by course and subtopic', async () => {
    const catalogs = await exercisesService.listCatalogs()
    expect(catalogs.length).toBeGreaterThan(0)
    expect(catalogs.every((catalog) => Array.isArray(catalog.subtopics))).toBe(true)
  })

  it('returns the outcome of a generation request', async () => {
    const result = await exercisesService.generate('course-1', 'sub-1')
    expect(result.generatedCount).toBe(result.approvedCount + result.discardedCount)
  })
})
