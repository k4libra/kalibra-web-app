/**
 * Provides JSON, multipart and file HTTP requests with cookie authentication.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { ApiError, type ApiErrorCode, type ProblemDetail } from '@/types/apiError'
import { sessionStore } from '@/services/http/sessionStore'

/** Options shared by JSON, multipart and file requests. */
export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'credentials'> {
  /** JSON value or native multipart body. */
  body?: unknown
  /** Expected successful response representation. */
  responseType?: 'json' | 'blob' | 'text'
}
const failures: Record<number, [ApiErrorCode, string]> = {
  400: ['invalid-input', 'Revisa los datos ingresados.'],
  401: ['unauthorized', 'Tu sesión venció. Inicia sesión nuevamente.'],
  403: ['forbidden', 'No tienes permiso para realizar esta acción.'],
  404: ['not-found', 'No se encontró el recurso solicitado.'],
  409: ['conflict', 'La operación entra en conflicto con los datos existentes.'],
  413: ['invalid-input', 'El archivo supera el tamaño permitido por el servidor.'],
  422: ['unprocessable', 'No se pudo procesar la solicitud.'],
  503: ['unavailable', 'Servicio no disponible por el momento'],
}
/** Makes a cookie-authenticated request and maps server failures into Spanish errors. */
async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, responseType = 'json', ...init } = options
  const headers = new Headers(init.headers)
  const multipart = body instanceof FormData
  if (!headers.has('Accept')) headers.set('Accept', responseType === 'json' ? 'application/json' : responseType === 'text' ? 'text/plain' : 'application/octet-stream')
  if (body !== undefined && !multipart) headers.set('Content-Type', 'application/json')
  const sessionRevision = sessionStore.getRevision()
  let response: Response
  try {
    response = await fetch(`${(import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '')}${path}`, {
      ...init, headers, credentials: 'include', body: body === undefined ? undefined : multipart ? body : JSON.stringify(body),
    })
  } catch (reason) {
    if (init.signal?.aborted || (reason instanceof Error && reason.name === 'AbortError')) throw reason
    throw new ApiError('network', 'No se pudo conectar con el servidor. Intenta nuevamente.', 0)
  }
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/authentication/') && sessionStore.getRevision() === sessionRevision) sessionStore.setSession(null)
    let problem: ProblemDetail | undefined
    try { problem = await response.json() as ProblemDetail } catch { /* Non-JSON failures keep the status-based message. */ }
    const [code, message] = failures[response.status] ?? ['unexpected', 'No se pudo completar la operación. Intenta nuevamente.']
    throw new ApiError(code, message, response.status, problem)
  }
  if (response.status === 204) return undefined as T
  if (responseType === 'blob') return await response.blob() as T
  if (responseType === 'text') return await response.text() as T
  try { return await response.json() as T }
  catch (reason) {
    if (init.signal?.aborted) throw reason
    throw new ApiError('unexpected', 'El servidor devolvió una respuesta no válida.', response.status)
  }
}
/** Supplies the single HTTP entry point for all feature services. */
export const apiClient = {
  /** Performs a request with a custom method or representation. */
  request,
  /** Reads a resource as JSON. */
  get: <T>(path: string, options?: ApiRequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  /** Creates a resource with JSON or multipart data. */
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => request<T>(path, { ...options, method: 'POST', body }),
  /** Updates a resource with JSON data. */
  put: <T>(path: string, body: unknown, options?: ApiRequestOptions) => request<T>(path, { ...options, method: 'PUT', body }),
}
