/**
 * Explains an ingestion failure and emits the affected material for replacement.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { Button, Icon, Modal } from '@/components/ui'
import type { CurricularMaterial } from '@/types/curricularMaterial'
import { formatMaterialDate } from '@/utils/materialFile'

/**
 * Props accepted by {@link MaterialErrorModal}.
 */
export interface MaterialErrorModalProps {
  /** Failed record whose reason is visible. */
  material: CurricularMaterial
  /** Display name resolved from the course's subtopics. */
  subtopicName: string
  /** Closes the reason dialog. */
  onClose: () => void
  /** Opens the upload form with this material's subtopic selected. */
  onReplace: (material: CurricularMaterial) => void
}

/**
 * Shows the failed file, ingestion reason and recommendations, emitting close and replace actions.
 */
export function MaterialErrorModal({ material, subtopicName, onClose, onReplace }: MaterialErrorModalProps) {
  return (
    <Modal isOpen onClose={onClose} title="No pudimos procesar el material" icon="error" iconTone="danger"
      description={`${material.fileName} · ${subtopicName} · cargado el ${formatMaterialDate(material.uploadedAt)}`}
      actions={<>
        <Button label="Cerrar" variant="neutral" onClick={onClose} />
        <Button label="Reemplazar archivo" icon="upload_file" onClick={() => onReplace(material)} />
      </>}>
      <div role="alert" className="flex flex-col gap-1 rounded-md bg-danger-container p-4">
        <h3 className="text-label-s text-danger-strong">MOTIVO</h3>
        <p className="text-body-l text-content-primary">{material.errorMessage ?? 'No se pudo extraer el contenido del archivo.'}</p>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-body-m-bold text-content-primary">Para que la ingestión funcione</h3>
        <ul className="flex flex-col gap-4 text-body-l text-content-secondary">
          {[
            'Usa un PDF digital o un escaneo de al menos 300 ppp.',
            'Evita fotos con reflejos, sombras o texto cortado.',
            'Incluye solo el contenido de un subtema por archivo.',
          ].map((recommendation) => <li key={recommendation} className="flex items-start gap-3">
            <Icon name="check_circle" className="text-secondary-strong" />{recommendation}
          </li>)}
        </ul>
      </div>
    </Modal>
  )
}
