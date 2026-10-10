/**
 * Loads course material projections and guards upload lifecycle against stale courses.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useResource } from '@/hooks/useResource'
import { coursesService } from '@/services/courses.service'
import { curricularMaterialService } from '@/services/curricularMaterial.service'
import type { UploadCurricularMaterialRequest } from '@/types/curricularMaterial'

/**
 * Loads materials, course and subtopics as one snapshot and exposes upload actions.
 *
 * @param courseId - Course addressed by the material route.
 * @returns The `course`, `subtopics`, `materials`, `stats`, read and upload state,
 * `refreshMaterials`, and `uploadMaterial` returning metadata or `null` on failure or stale completion.
 *
 * @example
 * ```tsx
 * const { materials, uploadMaterial, isLoading } = useCurricularMaterials(courseId);
 * ```
 */
export function useCurricularMaterials(courseId: string) {
  const resource = useResource(async (signal) => {
    const [course, subtopics, materials] = await Promise.all([
      coursesService.getCourse(courseId, signal), coursesService.listSubtopics(courseId, signal),
      curricularMaterialService.getByCourse(courseId, signal),
    ])
    return { course, subtopics, materials }
  }, `curricular-material-${courseId}`)
  const { refetch } = resource
  const current = resource.data?.course.id === courseId ? resource.data : null
  const materials = current?.materials ?? []
  const [mutation, setMutation] = useState<{ courseId: string; isUploading: boolean; error: string | null } | null>(null)
  const lifecycle = useRef<AbortController | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    lifecycle.current = controller
    return () => controller.abort()
  }, [courseId])

  const uploadMaterial = useCallback(async (request: UploadCurricularMaterialRequest) => {
    const controller = lifecycle.current
    if (!controller || controller.signal.aborted || request.courseId !== courseId) return null
    setMutation({ courseId, isUploading: true, error: null })
    try {
      const material = await curricularMaterialService.upload(request)
      if (controller.signal.aborted) return null
      refetch()
      return material
    } catch (reason: unknown) {
      if (!controller.signal.aborted) {
        setMutation({ courseId, isUploading: false, error: reason instanceof Error ? reason.message : 'No se pudo subir el material.' })
      }
      return null
    } finally {
      if (!controller.signal.aborted) setMutation((previous) => previous ? { ...previous, isUploading: false } : null)
    }
  }, [courseId, refetch])
  const clearError = useCallback(() => setMutation(null), [])

  return {
    course: current?.course ?? null,
    subtopics: current?.subtopics ?? [],
    materials,
    stats: {
      total: materials.length,
      ready: materials.filter((item) => item.status === 'ready').length,
      processing: materials.filter((item) => item.status === 'processing').length,
      error: materials.filter((item) => item.status === 'error').length,
    },
    isLoading: resource.isLoading,
    error: resource.error,
    isUploading: mutation?.courseId === courseId && mutation.isUploading,
    uploadError: mutation?.courseId === courseId ? mutation.error : null,
    refreshMaterials: refetch,
    uploadMaterial,
    clearError,
  }
}
