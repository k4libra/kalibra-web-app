/**
 * Presents material metadata and the shared ingestion state in a responsive table.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { Button, IconBox, MaterialStatusChip, TableCard, TableHeader, TableRow } from '@/components/ui'
import type { Subtopic } from '@/types/course'
import type { CurricularMaterial } from '@/types/curricularMaterial'
import { formatMaterialDate, materialFileDescription } from '@/utils/materialFile'

/**
 * Props accepted by {@link MaterialTable}.
 */
export interface MaterialTableProps {
  /** Material records in the course's table order. */
  materials: CurricularMaterial[]
  /** Subtopics used to resolve generic display names. */
  subtopics: Subtopic[]
  /** Opens the ingestion reason for the selected failed record. */
  onViewError: (material: CurricularMaterial) => void
}

/**
 * Lists type-specific metadata and emits the failed record when its reason is requested.
 */
export function MaterialTable({ materials, subtopics, onViewError }: MaterialTableProps) {
  const names = new Map(subtopics.map((subtopic) => [subtopic.id, subtopic.name]))
  return (
    <TableCard label="Materiales curriculares del curso">
      <TableHeader columns={['Archivo', 'Subtema', 'Cargado', 'Estado', 'Acción']}
        className="md:hidden lg:grid lg:grid-cols-24" cellClassNames={['lg:col-span-7', 'lg:col-span-6', 'lg:col-span-3', 'lg:col-span-5', 'lg:col-span-3']} />
      {materials.map((material) => <TableRow key={material.id} className="md:grid-cols-1 lg:grid-cols-24">
        <div role="cell" className="flex min-w-0 items-center gap-2.5 lg:col-span-7">
          <IconBox icon={material.fileType === 'pdf' ? 'picture_as_pdf' : 'image'} size="sm" tone={material.status === 'error' ? 'danger' : 'primary'} isSubtle={material.status !== 'error'} />
          <div className="min-w-0">
            <p className="truncate text-label-l text-content-primary" title={material.fileName}>{material.fileName}</p>
            <p className="text-body-m text-content-secondary">{materialFileDescription(material.fileName, material.fileSize, material.pageCount, material.isScan)}</p>
          </div>
        </div>
        <div role="cell" className="text-body-l text-content-primary lg:col-span-6">{names.get(material.subtopicId)}</div>
        <div role="cell" className="text-body-m text-content-secondary lg:col-span-3">{formatMaterialDate(material.uploadedAt)}</div>
        <div role="cell" className="lg:col-span-5">
          <MaterialStatusChip status={material.status} processingLabel="Pendiente" processingIcon="hourglass_empty" />
        </div>
        <div role="cell" className="lg:col-span-3">
          {material.status === 'error' ? <Button label="Ver motivo" variant="tonal" size="sm" onClick={() => onViewError(material)} /> : <span className="text-content-muted">—</span>}
        </div>
      </TableRow>)}
    </TableCard>
  )
}
