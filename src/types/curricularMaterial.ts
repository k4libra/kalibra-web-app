/**
 * Domain types for the curricular material feature.
 *
 * @remarks
 * These types describe the data required by the teacher
 * interface and its HTTP adapter.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { MaterialStatus, Subtopic } from '@/types/course'

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

    /** All associated subtopics, when provided by the API. */
    subtopicIds?: string[]

    /** Original name of the uploaded file. */
    fileName: string

    /** Format of the uploaded file. */
    fileType: MaterialFileType

    /** File size expressed in bytes. */
    fileSize?: number

    /** Number of pages, when available. */
    pageCount?: number

    /** Whether source metadata identifies this image as a scan. */
    isScan?: boolean

    /** Date when the material was uploaded. */
    uploadedAt: string

    /** Current processing status. */
    status: CurricularMaterialStatus

    /** Optional download URL, when supplied by the backend. */
    fileUrl?: string

    /** Reason for a failed ingestion, if applicable. */
    errorMessage?: string
}

/**
 * Input required to upload or replace curricular material.
 *
 * @remarks
 * The File object belongs to the frontend upload flow.
 * The service sends the bytes and associations as multipart data.
 */
export interface UploadCurricularMaterialRequest {
    /** Course whose material is being uploaded. */
    courseId: string
    /** Subtopic receiving the upload. */
    subtopicId: string
    /** Native file whose metadata is submitted. */
    file: File
}

/**
 * Data used to display the material upload form.
 */
export interface MaterialUploadForm {
    /** Subtopic receiving the upload. */
    subtopicId: string
    /** Selected native file, or no selection yet. */
    file: File | null
}

/**
 * Counters displayed at the top of the material page.
 */
export interface CurricularMaterialStats {
    /** Number of material records. */
    total: number
    /** Number of records ready for generation. */
    ready: number
    /** Number of records waiting for ingestion. */
    processing: number
    /** Number of records requiring replacement. */
    error: number
}

/**
 * Material together with its associated subtopic.
 *
 * @remarks
 * This is a frontend view model, not a database entity.
 */
export interface CurricularMaterialRow {
    /** Material metadata of the row. */
    material: CurricularMaterial
    /** Associated subtopic of the row. */
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
    /** Constraint that failed validation. */
    code: MaterialValidationErrorCode
    /** Spanish validation message displayed to the teacher. */
    message: string
}

/**
 * Supported upload constraints shown in Figma.
 */
export const MATERIAL_UPLOAD_CONFIG = {
    acceptedExtensions: ['pdf', 'png', 'jpg'] as const,
    maxFileSizeBytes: 10 * 1024 * 1024,
} as const
