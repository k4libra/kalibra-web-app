/**
 * Tests availability reads through the shared authenticated HTTP client.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it, vi } from 'vitest'
import { curricularExtractionAvailabilityService } from '@/services/curricularExtractionAvailability.service'
import { apiStub } from '@/test/apiStub'

describe('curricularExtractionAvailabilityService', () => {
  it.each([true, false])('reads availability %s with credentials and cancellation', async (available) => {
    apiStub.respond('/curricular-extraction-availability', 200, { available })
    const controller = new AbortController()
    expect(await curricularExtractionAvailabilityService.getAvailability(controller.signal)).toEqual({ available })
    expect(fetch).toHaveBeenCalledWith('/api/v1/curricular-extraction-availability', expect.objectContaining({
      method: 'GET', credentials: 'include', signal: controller.signal,
    }))
  })

  it('rejects request failures so the consuming hook can choose its fallback', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(curricularExtractionAvailabilityService.getAvailability()).rejects.toMatchObject({ code: 'network' })
  })
})
