/**
 * Defines the curricular material upload availability contract.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/** Availability reported by the curricular extraction endpoint. */
export interface CurricularExtractionAvailability {
  /** Whether curricular material uploads can currently be processed. */
  available: boolean
}

/** Reads availability independently of the selected course. */
export interface CurricularExtractionAvailabilityContract {
  /** Reads current availability, with optional request cancellation. */
  getAvailability: (signal?: AbortSignal) => Promise<CurricularExtractionAvailability>
}
