/**
 * Uploads binary curricular material and reads its real ingestion state.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { CurricularMaterialServiceContract } from '@/services/curricularMaterial.contract'
import { apiClient } from '@/services/http/apiClient'
import { readAllPages } from '@/services/http/pagination'
import { mapMaterial } from '@/services/mappers/material.mapper'
import type { MaterialDto } from '@/types/api'
import { validateMaterialFile } from '@/utils/materialFile'
/** Lists complete material resources and uploads actual file bytes. */
export const curricularMaterialService: CurricularMaterialServiceContract = {
  async getByCourse(courseId, signal) { return (await readAllPages<MaterialDto>(`/courses/${courseId}/curricular-materials`, signal)).map(mapMaterial) },
  async getStats(courseId, signal) {
    const materials = await this.getByCourse(courseId, signal)
    return { total: materials.length, ready: materials.filter((item) => item.status === 'ready').length,
      processing: materials.filter((item) => item.status === 'processing').length, error: materials.filter((item) => item.status === 'error').length }
  },
  async upload(request) {
    const error = validateMaterialFile(request.file)
    if (error) throw new Error(error.message)
    const form = new FormData()
    form.append('file', request.file)
    form.append('subtopicIds', request.subtopicId)
    form.append('fileName', request.file.name)
    form.append('format', request.file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : request.file.name.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG')
    return mapMaterial(await apiClient.post<MaterialDto>(`/courses/${request.courseId}/curricular-materials`, form))
  },
}
