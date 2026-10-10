/**
 * Reactive session snapshot used by navigation guards.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useSyncExternalStore } from 'react'
import { authService } from '@/services/auth.service'

/**
 * Observes the current demo identity through the authentication contract.
 *
 * @returns The authenticated profile or `null` when signed out.
 *
 * @example
 * ```tsx
 * const session = useAuthSession();
 * ```
 */
export function useAuthSession() {
  return useSyncExternalStore(authService.subscribe, authService.getSession, authService.getSession)
}
