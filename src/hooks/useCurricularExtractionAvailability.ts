/**
 * Refreshes curricular upload availability on mount and window focus.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useEffect } from 'react'
import { useResource } from '@/hooks/useResource'
import { curricularExtractionAvailabilityService } from '@/services/curricularExtractionAvailability.service'

/**
 * Reads availability while allowing the server to guard uploads after transient read failures.
 *
 * @returns Availability, initially true and restored to true when a read fails.
 */
export function useCurricularExtractionAvailability() {
  const { data, refetch } = useResource(async (signal) => {
    try {
      return await curricularExtractionAvailabilityService.getAvailability(signal)
    } catch {
      return { available: true }
    }
  }, 'curricular-extraction-availability')

  useEffect(() => {
    window.addEventListener('focus', refetch)
    return () => window.removeEventListener('focus', refetch)
  }, [refetch])

  return { available: data?.available ?? true }
}
