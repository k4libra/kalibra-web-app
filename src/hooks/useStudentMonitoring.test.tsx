/**
 * Monitoring hook tests for coordinated errors, retry, cleanup and course synchronization.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ActiveCourseProvider, useActiveCourse } from '@/context/ActiveCourseContext'
import { studentMonitoringService } from '@/services/studentMonitoring.service'
import type { StudentProgress } from '@/types/studentMonitoring'
import { useGapMap, useMonitoredStudents, useStudentProgress } from '@/hooks/useStudentMonitoring'

function wrapper(entry: string, path: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ActiveCourseProvider><MemoryRouter initialEntries={[entry]}><Routes><Route path={path} element={children} /></Routes></MemoryRouter></ActiveCourseProvider>
  }
}

beforeEach(() => window.history.replaceState({}, '', '/'))
afterEach(() => { vi.restoreAllMocks(); window.history.replaceState({}, '', '/') })

describe('useMonitoredStudents', () => {
  it('loads all course groups and derives global 3/2/1 counters', async () => {
    const { result } = renderHook(() => useMonitoredStudents(), { wrapper: wrapper('/estudiantes', '/estudiantes') })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.groups.map((group) => group.students.length)).toEqual([3, 0])
    expect(result.current.stats).toEqual({ totalStudents: 3, activeStudents: 2, inactiveStudents: 1 })
  })
  it('exposes a failed roster request and retries without partial groups', async () => {
    vi.spyOn(studentMonitoringService, 'getStudentsByCourse').mockRejectedValueOnce(new Error('Roster unavailable'))
    const { result } = renderHook(() => useMonitoredStudents(), { wrapper: wrapper('/estudiantes', '/estudiantes') })
    await waitFor(() => expect(result.current.error).toBe('Roster unavailable'))
    expect(result.current.groups).toEqual([])
    act(() => result.current.refetch())
    await waitFor(() => expect(result.current.groups).toHaveLength(2))
    expect(result.current.error).toBeNull()
  })
  it('returns zero groups and counters in the teacher-empty scenario', async () => {
    window.history.replaceState({}, '', '/?vacio')
    const { result } = renderHook(() => useMonitoredStudents(), { wrapper: wrapper('/estudiantes?vacio', '/estudiantes') })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.groups).toEqual([])
    expect(result.current.stats.totalStudents).toBe(0)
  })
})

describe('useGapMap', () => {
  it('treats a rejected heatmap measurement as a page failure and retries', async () => {
    vi.spyOn(studentMonitoringService, 'getStudentProgress').mockRejectedValueOnce(new Error('Measurement unavailable'))
    const { result } = renderHook(() => useGapMap(), { wrapper: wrapper('/cursos/course-1/mapa-de-brechas', '/cursos/:courseId/mapa-de-brechas') })
    await waitFor(() => expect(result.current.error).toBe('Measurement unavailable'))
    expect(result.current.map).toBeNull()
    act(() => result.current.refetch())
    await waitFor(() => expect(result.current.map?.progress).toHaveLength(3))
    expect(result.current.error).toBeNull()
  })
  it('ignores an obsolete course response when switching courses', async () => {
    const original = studentMonitoringService.getGapMap
    let resolveOld!: (value: Awaited<ReturnType<typeof original>>) => void
    const old = original('course-1')
    vi.spyOn(studentMonitoringService, 'getGapMap').mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve }))
    const { result } = renderHook(() => ({ ...useGapMap(), navigate: useNavigate() }), { wrapper: wrapper('/cursos/course-1/mapa-de-brechas', '/cursos/:courseId/mapa-de-brechas') })
    act(() => { void result.current.navigate('/cursos/course-2/mapa-de-brechas') })
    await waitFor(() => expect(result.current.map?.course.id).toBe('course-2'))
    await act(async () => { resolveOld(await old) })
    expect(result.current.map?.course.id).toBe('course-2')
    expect(result.current.map?.gapMap.stats.activeStudents).toBe(0)
  })
})

describe('useStudentProgress', () => {
  it('synchronizes the shell course after loading a student from another course', async () => {
    const { result } = renderHook(() => ({ ...useStudentProgress(), active: useActiveCourse() }), { wrapper: wrapper('/estudiantes/st-1', '/estudiantes/:studentId') })
    act(() => result.current.active.setActiveCourseId('course-2'))
    await waitFor(() => expect(result.current.progress?.student.id).toBe('st-1'))
    expect(result.current.active.activeCourseId).toBe('course-1')
    expect(result.current.recommendation).toContain('Sus últimas 3 respuestas')
  })
  it('ignores a late student response after a new student is selected', async () => {
    const original = studentMonitoringService.getStudentProgress
    const old = original('st-1')
    let resolveOld!: (value: StudentProgress) => void
    vi.spyOn(studentMonitoringService, 'getStudentProgress').mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve }))
    const { result } = renderHook(() => ({ ...useStudentProgress(), navigate: useNavigate() }), { wrapper: wrapper('/estudiantes/st-1', '/estudiantes/:studentId') })
    act(() => { void result.current.navigate('/estudiantes/st-2') })
    await waitFor(() => expect(result.current.progress?.student.id).toBe('st-2'))
    await act(async () => { resolveOld(await old) })
    expect(result.current.progress?.student.id).toBe('st-2')
  })
  it('exposes progress errors and recovers through the stable retry action', async () => {
    vi.spyOn(studentMonitoringService, 'getStudentProgress').mockRejectedValueOnce(new Error('Progress unavailable'))
    const { result } = renderHook(() => useStudentProgress(), { wrapper: wrapper('/estudiantes/st-2', '/estudiantes/:studentId') })
    await waitFor(() => expect(result.current.error).toBe('Progress unavailable'))
    expect(result.current.progress).toBeNull()
    act(() => result.current.refetch())
    await waitFor(() => expect(result.current.progress?.student.id).toBe('st-2'))
  })
  it('does not update after unmounting with a request in flight', async () => {
    let resolve!: (value: StudentProgress) => void
    vi.spyOn(studentMonitoringService, 'getStudentProgress').mockImplementationOnce(() => new Promise((done) => { resolve = done }))
    const { result, unmount } = renderHook(() => useStudentProgress(), { wrapper: wrapper('/estudiantes/st-1', '/estudiantes/:studentId') })
    unmount()
    await act(async () => { resolve({ student: { id: 'st-1', courseId: 'course-1', fullName: 'Example', email: 'example@example.com', initials: 'EX', enrolledAt: '2025-09-04', resolvedExercises: 0, correctAnswers: 0, averageMastery: null, lastActivityAt: null }, subtopics: [], recentResponses: [], reinforcementSubtopicIds: [] }) })
    expect(result.current.progress).toBeNull()
  })
})
