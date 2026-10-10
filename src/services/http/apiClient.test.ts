/**
 * Tests cookie requests, response formats, cancellation and Spanish error recovery.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/services/http/apiClient'
import { sessionStore } from '@/services/http/sessionStore'
import { mapUser } from '@/services/mappers/auth.mapper'
import { teacherDto } from '@/test/apiStub'
import { ApiError } from '@/types/apiError'

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/problem+json' } })
}

describe('apiClient', () => {
  it('sends JSON, credentials and the cancellation signal to the configured API prefix', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response({ id: 'created' }))
    const controller = new AbortController()
    expect(await apiClient.post('/resource', { name: 'Curso' }, { signal: controller.signal })).toEqual({ id: 'created' })
    const [url, init] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe('/api/v1/resource')
    expect(init).toMatchObject({ method: 'POST', body: '{"name":"Curso"}', credentials: 'include', signal: controller.signal })
    expect(new Headers(init?.headers).get('Content-Type')).toBe('application/json')
  })
  it('supports a public base URL without introducing a double slash', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:9090/api/v1/')
    try {
      vi.mocked(fetch).mockResolvedValueOnce(response([]))
      await apiClient.get('/courses')
      expect(vi.mocked(fetch).mock.calls[0][0]).toBe('http://localhost:9090/api/v1/courses')
    } finally { vi.unstubAllEnvs() }
  })
  it('lets the browser supply the multipart boundary and sends the native file', async () => {
    const form = new FormData(); form.append('file', new File(['bytes'], 'notes.pdf'))
    vi.mocked(fetch).mockResolvedValueOnce(response({}))
    await apiClient.post('/upload', form)
    const init = vi.mocked(fetch).mock.calls[0][1]
    expect(init?.body).toBe(form)
    expect(new Headers(init?.headers).has('Content-Type')).toBe(false)
  })
  it('reads CSV as a blob, text when requested and empty sign-out responses', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('course,count\nTEST,1'))
    const blob = await apiClient.get<Blob>('/export', { headers: { Accept: 'text/csv' }, responseType: 'blob' })
    expect(await blob.text()).toContain('TEST,1')
    expect(new Headers(vi.mocked(fetch).mock.calls[0][1]?.headers).get('Accept')).toBe('text/csv')
    vi.mocked(fetch).mockResolvedValueOnce(new Response('texto'))
    expect(await apiClient.get('/text', { responseType: 'text' })).toBe('texto')
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 204 }))
    expect(await apiClient.post('/authentication/sign-out')).toBeUndefined()
  })
  it.each([[401, 'unauthorized'], [403, 'forbidden'], [404, 'not-found'], [409, 'conflict'], [503, 'unavailable']] as const)('maps a %s ProblemDetail to %s without showing untranslated details', async (status, code) => {
    vi.mocked(fetch).mockResolvedValueOnce(response({ status, title: 'Failure', detail: 'English server message' }, status))
    await expect(apiClient.get('/resource')).rejects.toMatchObject({ name: 'ApiError', code, status, problem: { detail: 'English server message' } })
  })
  it('clears an expired session on protected calls and keeps sign-in failures separate', async () => {
    sessionStore.setSession(mapUser(teacherDto))
    vi.mocked(fetch).mockResolvedValueOnce(response({}, 401))
    await expect(apiClient.post('/authentication/sign-in', {})).rejects.toBeInstanceOf(ApiError)
    expect(sessionStore.getSession()).not.toBeNull()
    vi.mocked(fetch).mockResolvedValueOnce(response({}, 401))
    await expect(apiClient.get('/courses')).rejects.toBeInstanceOf(ApiError)
    expect(sessionStore.getSession()).toBeNull()
  })
  it('maps non-JSON 503 responses and transport failures to actionable Spanish errors', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('Unavailable', { status: 503 }))
    await expect(apiClient.get('/resource')).rejects.toMatchObject({ message: 'Servicio no disponible por el momento', code: 'unavailable' })
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(apiClient.get('/resource')).rejects.toMatchObject({ code: 'network', status: 0 })
  })
  it('keeps a newer signed-in identity when an older protected request returns 401', async () => {
    sessionStore.setSession(mapUser(teacherDto))
    let resolve!: (response: Response) => void
    vi.mocked(fetch).mockImplementationOnce(() => new Promise((done) => { resolve = done }))
    const pending = apiClient.get('/courses')
    sessionStore.setSession(mapUser({ ...teacherDto, id: 'new-identity' }))
    resolve(response({}, 401))
    await expect(pending).rejects.toMatchObject({ code: 'unauthorized' })
    expect(sessionStore.getSession()?.user.id).toBe('new-identity')
  })
  it('preserves cancellation instead of displaying a network error', async () => {
    const controller = new AbortController(); controller.abort()
    await expect(apiClient.get('/courses', { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
  })
  it('reports malformed successful JSON in Spanish', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('invalid json'))
    await expect(apiClient.get('/resource')).rejects.toMatchObject({ code: 'unexpected', message: 'El servidor devolvió una respuesta no válida.' })
  })
})
