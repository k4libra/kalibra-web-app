
/**
 * Service implementation for curricular material management.
 *
 * @remarks
 * Provides the operations required by the curricular
 * material feature.
 *
 * Currently delegates requests to an in-memory mock.
 * A future REST implementation can replace this
 * dependency without changing the service contract.
 *
 * @packageDocumentation
 */

import type {
    CurricularMaterial,
    CurricularMaterialStats,
    UploadCurricularMaterialRequest,
} from '@/types/curricularMaterial'

import type {
    CurricularMaterialServiceContract,
} from './curricularMaterial.contract'

import {
    listCurricularMaterials,
    getCurricularMaterialStats,
    uploadCurricularMaterial,
} from '@/mocks/curricularMaterial.mock'

/**
 * Service responsible for curricular material operations.
 */
class CurricularMaterialService
    implements CurricularMaterialServiceContract {

    /**
     * Retrieves the materials associated with a course.
     *
     * @param courseId - Selected course identifier.
     * @returns Materials belonging to the course.
     */
    getByCourse(
        courseId: string,
    ): Promise<CurricularMaterial[]> {
        return listCurricularMaterials(courseId)
    }

    /**
     * Retrieves the material status counters.
     *
     * @param courseId - Selected course identifier.
     * @returns Material statistics.
     */
    getStats(
        courseId: string,
    ): Promise<CurricularMaterialStats> {
        return getCurricularMaterialStats(courseId)
    }

    /**
     * Uploads or replaces a material for a subtopic.
     *
     * @param request - Course, subtopic and selected file.
     * @returns Created or updated material.
     */
    upload(
        request: UploadCurricularMaterialRequest,
    ): Promise<CurricularMaterial> {
        return uploadCurricularMaterial(request)
    }
}

/**
 * Shared service instance used by the frontend.
 */
export const curricularMaterialService:
    CurricularMaterialServiceContract =
    new CurricularMaterialService()
