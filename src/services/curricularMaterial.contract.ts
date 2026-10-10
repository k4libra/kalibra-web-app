/**
 * Service contract for curricular material management.
 *
 * @remarks
 * Defines the operations required by the frontend.
 * The current implementation will use simulated data.
 * A future REST implementation can use this contract
 * without changing the consuming components.
 *
 * @author MRamirez202210582
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
     * @throws Error when the requested course does not exist.
     */
    getByCourse(courseId: string): Promise<CurricularMaterial[]>

    /**
     * Retrieves the material processing counters.
     *
     * @param courseId - Identifier of the selected course.
     * @returns Total, ready, processing and error counters.
     * @throws Error when the requested course does not exist.
     */
    getStats(courseId: string): Promise<CurricularMaterialStats>

    /**
     * Uploads or replaces the material of a subtopic.
     *
     * @param request - Selected course, subtopic and file.
     * @returns The material created or updated.
     * @throws Error when the course, subtopic, format or file size is invalid.
     */
    upload(
        request: UploadCurricularMaterialRequest,
    ): Promise<CurricularMaterial>
}
