/**
 * Tests for the courses and current teacher hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { authService } from '@/services/auth.service'
import { teacherCredentials } from '@/test/apiStub'
import { useCourses } from './useCourses'
import { useCurrentTeacher } from './useCurrentTeacher'

describe('useCourses', () => {
  it('starts empty and then exposes the courses', async () => {
    const { result } = renderHook(() => useCourses())
    expect(result.current.courses).toEqual([])
    await waitFor(() => expect(result.current.courses.length).toBeGreaterThan(0))
  })
})

describe('useCurrentTeacher', () => {
  it('exposes the signed-in teacher', async () => {
    await authService.login(teacherCredentials)
    const { result } = renderHook(() => useCurrentTeacher())
    await waitFor(() => expect(result.current.teacher).not.toBeNull())
  })
})
