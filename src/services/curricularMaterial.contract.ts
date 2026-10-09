
/**
 * Service contract for curricular material management.
 *
 * @remarks
 * Defines the operations required by the frontend.
 * The current implementation will use simulated data.
 * A future REST implementation can use this contract
 * without changing the consuming components.
 *
 * @packageDocumentation
 */

import type {
    CurricularMaterial,
    CurricularMaterialStats,
    UploadCurricularMaterialRequest,
} from '@/types/curricularMaterial'

/**
 * Operations supported by the curricular material service.
 */
export interface CurricularMaterialServiceContract {
    /**
     * Lists the curricular materials associated with a course.
     *
     * @param courseId - Identifier of the selected course.
     * @returns The materials belonging to the course.
     */
    getByCourse(courseId: string): Promise<CurricularMaterial[]>

    /**
     * Retrieves the material processing counters.
     *
     * @param courseId - Identifier of the selected course.
     * @returns Total, ready, processing and error counters.
     */
    getStats(courseId: string): Promise<CurricularMaterialStats>

    /**
     * Uploads or replaces the material of a subtopic.
     *
     * @param request - Selected course, subtopic and file.
     * @returns The material created or updated.
     */
    upload(
        request: UploadCurricularMaterialRequest,
    ): Promise<CurricularMaterial>
}
