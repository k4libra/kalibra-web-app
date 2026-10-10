/**
 * Maps material status and preserves multi-subtopic associations.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { MaterialDto } from '@/types/api'
import type { CurricularMaterial } from '@/types/curricularMaterial'
/** Preserves all subtopic associations without inventing file metadata. */
export function mapMaterial(dto: MaterialDto): CurricularMaterial {
  return { id: dto.id, courseId: dto.courseId, subtopicId: dto.subtopicIds[0] ?? '', subtopicIds: dto.subtopicIds,
    fileName: dto.fileName, fileType: dto.format === 'JPEG' ? 'jpg' : dto.format === 'PDF' ? 'pdf' : 'png', uploadedAt: dto.uploadedAt,
    status: dto.status === 'READY' ? 'ready' : dto.status === 'INGESTION_ERROR' ? 'error' : 'processing',
    ...(dto.failureReason ? { errorMessage: dto.failureReason } : {}) }
}
