/**
 * In-memory mock identity and account-owned fixture collections.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { AuthResponse } from '@/types/auth'

let session: AuthResponse | null = null
const listeners = new Set<() => void>()
const workspaces = new Map<number, Map<string, unknown[]>>()

/**
 * Reads the current in-memory demo session.
 *
 * @returns The stable session snapshot or `null` before sign-in.
 *
 * @example
 * ```ts
 * const user = getMockSession()?.user;
 * ```
 */
export function getMockSession(): AuthResponse | null {
  return session
}

/**
 * Replaces the demo session and notifies navigation subscribers.
 *
 * @param next - Authenticated profile, or `null` on logout.
 * @returns Nothing.
 *
 * @example
 * ```ts
 * setMockSession(null);
 * ```
 */
export function setMockSession(next: AuthResponse | null): void {
  session = next
  listeners.forEach((listener) => listener())
}

/**
 * Subscribes to session changes without storing credentials on disk.
 *
 * @param listener - Called after a session change.
 * @returns A callback that removes the subscription.
 *
 * @example
 * ```ts
 * const unsubscribe = subscribeMockSession(refresh);
 * ```
 */
export function subscribeMockSession(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Selects the mutable collection owned by the current demo account.
 *
 * @remarks
 * Account 1 receives a clone of the sample data; registered accounts start empty. Collections
 * survive logout during this browser session. Without authentication the fixtures remain available
 * to isolated service tests; navigation guards prevent access to the panel.
 *
 * @typeParam T - Element of the collection.
 * @param key - Collection name shared by projections of the same resource.
 * @param fixtures - Demo-account seed data.
 * @returns The account's mutable collection.
 *
 * @example
 * ```ts
 * const courses = sessionCollection('courses', COURSES);
 * ```
 */
export function sessionCollection<T>(key: string, fixtures: T[]): T[] {
  if (!session) return fixtures
  const id = session.user.id
  let workspace = workspaces.get(id)
  if (!workspace) {
    workspace = new Map()
    workspaces.set(id, workspace)
  }
  if (!workspace.has(key)) workspace.set(key, id === 1 ? structuredClone(fixtures) : [])
  return workspace.get(key) as T[]
}
