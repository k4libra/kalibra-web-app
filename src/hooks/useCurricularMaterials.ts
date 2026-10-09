
/**
 * React hook for curricular material management.
 *
 * @remarks
 * Handles material loading, upload operations,
 * statistics and error states for the selected course.
 *
 * Uses the curricular material service, which currently
 * works with simulated data.
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react'

import { curricularMaterialService } from '@/services/curricularMaterial.service'

import type {
    CurricularMaterial,
    CurricularMaterialStats,
    UploadCurricularMaterialRequest,
} from '@/types/curricularMaterial'

const INITIAL_STATS: CurricularMaterialStats = {
    total: 0,
    ready: 0,
    processing: 0,
    error: 0,
}

/**
 * Manages the curricular materials of a selected course.
 *
 * @param courseId - Identifier of the active course.
 */
export function useCurricularMaterials(courseId: string) {
    const [materials, setMaterials] = useState<CurricularMaterial[]>([])
    const [stats, setStats] = useState<CurricularMaterialStats>(INITIAL_STATS)

    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)

    const [error, setError] = useState<string | null>(null)

    /**
     * Retrieves materials and statistics for the course.
     */
    const refreshMaterials = useCallback(async () => {
        if (!courseId) {
            setMaterials([])
            setStats(INITIAL_STATS)
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const [courseMaterials, courseStats] = await Promise.all([
                curricularMaterialService.getByCourse(courseId),
                curricularMaterialService.getStats(courseId),
            ])

            setMaterials(courseMaterials)
            setStats(courseStats)
        } catch (caughtError) {
            const message =
                caughtError instanceof Error
                    ? caughtError.message
                    : 'No se pudieron cargar los materiales.'

            setError(message)
        } finally {
            setIsLoading(false)
        }
    }, [courseId])

    /**
     * Loads materials when the selected course changes.
     */
    useEffect(() => {
        void refreshMaterials()
    }, [refreshMaterials])

    /**
     * Uploads or replaces a material and refreshes the list.
     */
    const uploadMaterial = useCallback(
        async (request: UploadCurricularMaterialRequest) => {
            setIsUploading(true)
            setError(null)

            try {
                const uploadedMaterial =
                    await curricularMaterialService.upload(request)

                await refreshMaterials()

                return uploadedMaterial
            } catch (caughtError) {
                const message =
                    caughtError instanceof Error
                        ? caughtError.message
                        : 'No se pudo subir el material.'

                setError(message)
                throw caughtError
            } finally {
                setIsUploading(false)
            }
        },
        [refreshMaterials],
    )

    /**
     * Clears the current error message.
     */
    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        materials,
        stats,
        isLoading,
        isUploading,
        error,
        refreshMaterials,
        uploadMaterial,
        clearError,
    }
}
