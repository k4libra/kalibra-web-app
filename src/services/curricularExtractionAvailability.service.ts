/**
 * Reads curricular material upload availability through the shared HTTP client.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CurricularExtractionAvailability, CurricularExtractionAvailabilityContract } from '@/services/curricularExtractionAvailability.contract'
import { apiClient } from '@/services/http/apiClient'

/** Provides the current upload availability without storing a client-side cache. */
export const curricularExtractionAvailabilityService: CurricularExtractionAvailabilityContract = {
  getAvailability: (signal) => apiClient.get<CurricularExtractionAvailability>('/curricular-extraction-availability', { signal }),
}
