/**
 * Generic read hook shared by the data hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react'

/**
 * State exposed by {@link useResource}.
 *
 * @typeParam T - Shape of the loaded data.
 */
export interface ResourceState<T> {
  /** Loaded data; `null` until the first response arrives. */
  data: T | null
  /** Whether a request is in flight. */
  isLoading: boolean
  /** Message of the last failure; `null` when the last request succeeded. */
  error: string | null
  /** Repeats the request. */
  refetch: () => void
}

/**
 * Runs an asynchronous loader and exposes its result, loading and error state.
 *
 * @remarks
 * The loader runs again whenever `key` changes. Responses that arrive after unmounting or after a
 * newer request are ignored.
 *
 * @typeParam T - Shape of the loaded data.
 * @param loader - Function that returns the data; usually a service method.
 * @param key - Serializable value that identifies the request, for example the course id.
 * @returns The `data`, the `isLoading` and `error` state, and `refetch` to reload.
 *
 * @example
 * ```ts
 * const { data, isLoading } = useResource(() => coursesService.listSubtopics(courseId), courseId);
 * ```
 */
export function useResource<T>(loader: (signal: AbortSignal) => Promise<T>, key: string): ResourceState<T> {
  const [version, setVersion] = useState(0)
  const requestKey = `${key}#${version}`
  const [result, setResult] = useState<{ requestKey: string | null; data: T | null; error: string | null }>({
    requestKey: null,
    data: null,
    error: null,
  })

  useEffect(() => {
    let isCurrent = true
    const controller = new AbortController()
    loader(controller.signal)
      .then((data) => {
        if (isCurrent) setResult({ requestKey, data, error: null })
      })
      .catch((reason: unknown) => {
        const error = reason instanceof Error ? reason.message : 'No se pudo cargar la información.'
        if (isCurrent) setResult((previous) => ({ requestKey, data: previous.data, error }))
      })
    return () => {
      isCurrent = false
      controller.abort()
    }
    // The loader is recreated on every render; `requestKey` identifies the request instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const refetch = useCallback(() => setVersion((value) => value + 1), [])
  return { data: result.data, isLoading: result.requestKey !== requestKey, error: result.error, refetch }
}
