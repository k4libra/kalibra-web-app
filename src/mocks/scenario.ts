/**
 * Selects which fixture set the simulated services return.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Whether the empty scenario is active.
 *
 * @remarks
 * Append `?vacio` to any URL to see the empty states (teacher without courses, invitations or exercises).
 *
 * @returns `true` when the current URL carries the `vacio` query parameter.
 *
 * @example
 * ```ts
 * const courses = isEmptyScenario() ? [] : COURSES;
 * ```
 */
export function isEmptyScenario(): boolean {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('vacio')
}

/**
 * Resolves a value after a short delay to imitate a network round trip.
 *
 * @typeParam T - Shape of the simulated response.
 * @param data - Response returned by the simulated endpoint.
 * @param signal - Optional signal that cancels the simulated round trip.
 * @returns A promise that resolves with `data` after 150 ms.
 * @throws Error when the signal is aborted.
 *
 * @example
 * ```ts
 * listCourses: () => respond(COURSES)
 * ```
 */
export function respond<T>(data: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const abort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve(structuredClone(data))
    }, 150)
    signal?.addEventListener('abort', abort, { once: true })
  })
}
