/**
 * Active course shared by the sidebar and the course pages.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

/**
 * Active course state shared across the app.
 */
export interface ActiveCourseState {
  /** Id of the course the teacher is managing; `null` until one is chosen. */
  activeCourseId: string | null
  /** Changes the course the teacher is managing. */
  setActiveCourseId: (courseId: string | null) => void
}

const ActiveCourseContext = createContext<ActiveCourseState | null>(null)

/**
 * Provides the active course to the component tree.
 */
export function ActiveCourseProvider({ children }: { children: ReactNode }) {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null)
  const value = useMemo(() => ({ activeCourseId, setActiveCourseId }), [activeCourseId])
  return <ActiveCourseContext.Provider value={value}>{children}</ActiveCourseContext.Provider>
}

/**
 * Reads the active course state.
 *
 * @returns The current active course state.
 * @throws Error when used outside {@link ActiveCourseProvider}.
 */
export function useActiveCourse(): ActiveCourseState {
  const context = useContext(ActiveCourseContext)
  if (!context) throw new Error('useActiveCourse must be used inside ActiveCourseProvider')
  return context
}
