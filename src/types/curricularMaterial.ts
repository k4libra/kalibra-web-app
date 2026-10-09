
/**
 * Domain types for the curricular material feature.
 *
 * @remarks
 * These types describe the data required by the teacher
 * interface and prepare the feature for a future REST API.
 *
 * @packageDocumentation
 */

import type { MaterialStatus, Subtopic } from './course'

/**
 * File formats accepted by the curricular material uploader.
 */
export type MaterialFileType = 'pdf' | 'png' | 'jpg'

/**
 * Reuses the material processing states defined in develop.
 */
export type CurricularMaterialStatus = MaterialStatus

/**
 * A curricular material uploaded for a course subtopic.
 */
export interface CurricularMaterial {
    /** Unique identifier of the material. */
    id: string

    /** Course associated with the material. */
    courseId: string

    /** Subtopic associated with the material. */
    subtopicId: string

    /** Original name of the uploaded file. */
    fileName: string

    /** Format of the uploaded file. */
    fileType: MaterialFileType

    /** File size expressed in bytes. */
    fileSize: number

    /** Number of pages, when available. */
    pageCount?: number

    /** Date when the material was uploaded. */
    uploadedAt: string

    /** Current processing status. */
    status: CurricularMaterialStatus

    /** Optional URL provided by the future backend. */
    fileUrl?: string

    /** Reason for a failed ingestion, if applicable. */
    errorMessage?: string
}

/**
 * Input required to upload or replace curricular material.
 *
 * @remarks
 * The File object belongs to the frontend upload flow.
 * The backend request format will be defined when the
 * REST API is available.
 */
export interface UploadCurricularMaterialRequest {
    courseId: string
    subtopicId: string
    file: File
}

/**
 * Data used to display the material upload form.
 */
export interface MaterialUploadForm {
    subtopicId: string
    file: File | null
}

/**
 * Counters displayed at the top of the material page.
 */
export interface CurricularMaterialStats {
    total: number
    ready: number
    processing: number
    error: number
}

/**
 * Material together with its associated subtopic.
 *
 * @remarks
 * This is a frontend view model, not a database entity.
 */
export interface CurricularMaterialRow {
    material: CurricularMaterial
    subtopic: Subtopic
}

/**
 * Possible validation errors when selecting a file.
 */
export type MaterialValidationErrorCode =
    | 'UNSUPPORTED_FORMAT'
    | 'FILE_TOO_LARGE'
    | 'EMPTY_FILE'

/**
 * Validation error displayed in the upload modal.
 */
export interface MaterialValidationError {
    code: MaterialValidationErrorCode
    message: string
}

/**
 * Supported upload constraints shown in Figma.
 */
export const MATERIAL_UPLOAD_CONFIG = {
    acceptedExtensions: ['pdf', 'png', 'jpg'] as const,
    maxFileSizeBytes: 20 * 1024 * 1024,
} as const
