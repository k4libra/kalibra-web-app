/**
 * Restores and observes the startup cookie session.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { authService } from '@/services/auth.service'
import { sessionStore } from '@/services/http/sessionStore'
/**
 * Restores the cookie identity once and observes its resolution.
 *
 * @returns The session, loading state, restoration error and retry callback.
 * @example
 * ```tsx
 * const status = useSessionStatus();
 * ```
 */
export function useSessionStatus() {
  const snapshot = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot, sessionStore.getSnapshot)
  useEffect(() => { void authService.restore() }, [])
  const retry = useCallback(() => { sessionStore.reset(); void authService.restore() }, [])
  return { ...snapshot, retry }
}
