/**
 * Downloads anonymized CSV files returned by the API.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { apiClient } from '@/services/http/apiClient'
/** Downloads a server CSV response with a neutral, locally generated filename. */
export async function downloadCsv(path: string, fileName: string, signal?: AbortSignal): Promise<{ fileName: string }> {
  const blob = await apiClient.get<Blob>(path, { headers: { Accept: 'text/csv' }, responseType: 'blob', signal })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = fileName
  document.body.append(anchor)
  try { anchor.click() } finally { anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 0) }
  return { fileName }
}
