/**
 * Service contract for curricular material management.
 *
 * @remarks
 * Defines the operations required by the frontend.
 * The HTTP implementation adapts REST resources without coupling the UI to transport details.
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
    getByCourse(courseId: string, signal?: AbortSignal): Promise<CurricularMaterial[]>

    /**
     * Retrieves the material processing counters.
     *
     * @param courseId - Identifier of the selected course.
     * @returns Total, ready, processing and error counters.
     * @throws Error when the requested course does not exist.
     */
    getStats(courseId: string, signal?: AbortSignal): Promise<CurricularMaterialStats>

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
