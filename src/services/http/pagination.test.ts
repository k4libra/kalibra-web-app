/**
 * Tests complete pagination and cancellation across API pages.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it, vi } from 'vitest'
import { readAllPages } from '@/services/http/pagination'

describe('complete API pagination', () => {
  it('collects all pages while preserving filters, credentials and the signal', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ content: [{ id: 'first' }], totalPages: 2 })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ content: [{ id: 'second' }], totalPages: 2 })))
    const controller = new AbortController()
    expect(await readAllPages('/materials?status=READY', controller.signal)).toEqual([{ id: 'first' }, { id: 'second' }])
    expect(vi.mocked(fetch).mock.calls.map(([url]) => url)).toEqual(['/api/v1/materials?status=READY&page=0&size=100', '/api/v1/materials?status=READY&page=1&size=100'])
    expect(vi.mocked(fetch).mock.calls.every(([, init]) => init?.signal === controller.signal && init.credentials === 'include')).toBe(true)
  })
  it('does not fetch another page after cancellation', async () => {
    const controller = new AbortController()
    vi.mocked(fetch).mockImplementationOnce(async () => {
      const response = new Response(JSON.stringify({ content: [], totalPages: 3 }))
      vi.spyOn(response, 'json').mockImplementation(async () => { controller.abort(); return { content: [], totalPages: 3 } })
      return response
    })
    await expect(readAllPages('/materials', controller.signal)).rejects.toMatchObject({ name: 'AbortError' })
    expect(vi.mocked(fetch).mock.calls).toHaveLength(1)
  })
})
