/**
 * Drives upload, replacement and error dialogs for the material page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { useToast } from '@/context/ToastContext'
import { useCurricularMaterials } from '@/hooks/useCurricularMaterials'
import type { CurricularMaterial } from '@/types/curricularMaterial'
import { validateMaterialFile } from '@/utils/materialFile'

/**
 * Loads material data and owns the teacher's upload form and dialog actions.
 *
 * @param courseId - Course selected by the route.
 * @returns Material read state, `uploadForm`, validation state and dialog actions,
 * including `selectFile`, `removeFile`, `submit`, `viewError` and `replaceMaterial`.
 *
 * @example
 * ```tsx
 * const page = useCurricularMaterialPage(courseId);
 * ```
 */
export function useCurricularMaterialPage(courseId: string) {
  const data = useCurricularMaterials(courseId)
  const { clearError, materials, subtopics, isUploading, uploadMaterial } = data
  const { showToast } = useToast()
  const [form, setForm] = useState<{ courseId: string; subtopicId: string; file: File | null } | null>(null)
  const [errorMaterial, setErrorMaterial] = useState<CurricularMaterial | null>(null)
  const uploadForm = form?.courseId === courseId ? form : null
  const selectedErrorMaterial = errorMaterial?.courseId === courseId ? errorMaterial : null
  const validationError = uploadForm?.file ? validateMaterialFile(uploadForm.file) : null

  const openUpload = useCallback(() => {
    if (isUploading) return
    clearError()
    const first = materials.find((item) => item.status === 'error')?.subtopicId ?? subtopics[0]?.id ?? ''
    setForm({ courseId, subtopicId: first, file: null })
  }, [courseId, clearError, isUploading, materials, subtopics])
  const closeUpload = useCallback(() => {
    if (!isUploading) setForm(null)
  }, [isUploading])
  const selectSubtopic = useCallback((subtopicId: string) => {
    if (!isUploading) setForm((previous) => previous ? { ...previous, subtopicId } : null)
  }, [isUploading])
  const selectFile = useCallback((file: File) => {
    if (isUploading) return
    clearError()
    setForm((previous) => previous ? { ...previous, file } : null)
  }, [clearError, isUploading])
  const removeFile = useCallback(() => {
    if (isUploading) return
    clearError()
    setForm((previous) => previous ? { ...previous, file: null } : null)
  }, [clearError, isUploading])
  const viewError = useCallback((material: CurricularMaterial) => setErrorMaterial(material), [])
  const closeError = useCallback(() => setErrorMaterial(null), [])
  const replaceMaterial = useCallback((material: CurricularMaterial) => {
    if (isUploading || material.courseId !== courseId) return
    clearError()
    setErrorMaterial(null)
    setForm({ courseId, subtopicId: material.subtopicId, file: null })
  }, [courseId, clearError, isUploading])
  const canSubmit = Boolean(uploadForm?.file && !validationError && subtopics.some((item) => item.id === uploadForm.subtopicId) && !isUploading)
  const submit = useCallback(async () => {
    if (!canSubmit || !uploadForm?.file) return
    const material = await uploadMaterial({ courseId, subtopicId: uploadForm.subtopicId, file: uploadForm.file })
    if (!material) return
    setForm(null)
    showToast({
      title: 'Material cargado',
      message: `${material.fileName} quedó pendiente de ingestión.`,
      icon: 'check_circle', tone: 'success',
    })
  }, [canSubmit, courseId, uploadMaterial, showToast, uploadForm])

  return {
    ...data, uploadForm, validationError, canSubmit, selectedErrorMaterial,
    openUpload, closeUpload, selectSubtopic, selectFile, removeFile, submit,
    viewError, closeError, replaceMaterial,
  }
}
