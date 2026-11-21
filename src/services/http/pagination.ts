/**
 * Loads complete paginated API resources.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { apiClient } from '@/services/http/apiClient'
import type { ApiPage } from '@/types/api'
/** Reads every page so UI counters and lists never silently truncate at twenty records. */
export async function readAllPages<T>(path: string, signal?: AbortSignal): Promise<T[]> {
  const separator = path.includes('?') ? '&' : '?'
  const first = await apiClient.get<ApiPage<T>>(`${path}${separator}page=0&size=100`, { signal })
  const result = [...first.content]
  for (let page = 1; page < first.totalPages; page++) {
    signal?.throwIfAborted()
    const next = await apiClient.get<ApiPage<T>>(`${path}${separator}page=${page}&size=100`, { signal })
    result.push(...next.content)
  }
  return result
}
