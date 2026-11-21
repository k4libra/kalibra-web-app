/**
 * Stores public session identity without browser credentials.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { AuthResponse } from '@/types/auth'
/** Stable session snapshot observed by navigation. */
export interface SessionSnapshot {
  /** Public profile, never a token. */
  session: AuthResponse | null
  /** Whether startup restoration remains unresolved. */
  isLoading: boolean
  /** Restoration failure, or null after success or anonymous restoration. */
  error: string | null
}
let snapshot: SessionSnapshot = { session: null, isLoading: true, error: null }
let revision = 0
const listeners = new Set<() => void>()
/** Owns only the public identity and restoration lifecycle. */
export const sessionStore = {
  /** Reads a referentially stable snapshot. */
  getSnapshot: () => snapshot,
  /** Reads the public identity. */
  getSession: () => snapshot.session,
  /** Observes identity changes and returns an unsubscribe callback. */
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
  /** Identifies the current identity revision to discard stale restorations. */
  getRevision: () => revision,
  /** Publishes a session or clears an expired identity. */
  setSession(session: AuthResponse | null) {
    revision++; snapshot = { session, isLoading: false, error: null }; listeners.forEach((listener) => listener())
  },
  /** Publishes a restoration error without granting access. */
  fail(message: string) {
    revision++; snapshot = { session: null, isLoading: false, error: message }; listeners.forEach((listener) => listener())
  },
  /** Starts a fresh restoration attempt. */
  reset() {
    revision++; snapshot = { session: null, isLoading: true, error: null }; listeners.forEach((listener) => listener())
  },
}
