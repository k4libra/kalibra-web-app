/**
 * Presents controlled subtopic and file selection in the material upload dialog.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { Button, Callout, FileDropzone, MaterialStatusChip, Modal, Select } from '@/components/ui'
import type { Subtopic } from '@/types/course'
import type { CurricularMaterial, MaterialValidationError } from '@/types/curricularMaterial'
import { materialFileDescription, materialFileType } from '@/utils/materialFile'

/**
 * Props accepted by {@link UploadMaterialModal}.
 */
export interface UploadMaterialModalProps {
  /** Available subtopics, including their shared material state. */
  subtopics: Subtopic[]
  /** Current metadata used for option descriptions. */
  materials: CurricularMaterial[]
  /** Controlled selected subtopic. */
  subtopicId: string
  /** Native file selected by the teacher, or no selection. */
  file: File | null
  /** Shared validator's error, absent when the file is supported. */
  validationError: MaterialValidationError | null
  /** Service failure displayed in the dialog. */
  uploadError: string | null
  /** Whether an upload is in flight. */
  isUploading: boolean
  /** Whether all upload constraints have been met. */
  canSubmit: boolean
  /** Changes the controlled subtopic selection. */
  onSubtopicChange: (subtopicId: string) => void
  /** Reports a native file selection. */
  onFileSelect: (file: File) => void
  /** Removes the selection while retaining the subtopic. */
  onFileRemove: () => void
  /** Closes the dialog, unless submission is in flight. */
  onClose: () => void
  /** Submits the controlled upload form. */
  onSubmit: () => void
}

/**
 * Shows upload constraints, material-aware options and selection state, emitting form actions.
 */
export function UploadMaterialModal({
  subtopics, materials, subtopicId, file, validationError, uploadError, isUploading,
  canSubmit, onSubtopicChange, onFileSelect, onFileRemove, onClose, onSubmit,
}: UploadMaterialModalProps) {
  const options = subtopics.map((subtopic) => {
    const material = materials.find((item) => item.subtopicId === subtopic.id)
    return {
      value: subtopic.id, label: subtopic.name,
      description: material ? `${material.fileName}${material.status === 'error' ? ' · requiere reemplazo' : ''}` : 'Sin material cargado',
      trailing: <MaterialStatusChip status={subtopic.materialStatus} />,
    }
  })
  const isValid = Boolean(file && !validationError)
  const hasMaterials = materials.length > 0
  const fileType = file ? materialFileType(file.name) : null
  return (
    <Modal isOpen onClose={onClose} title="Cargar material" icon="upload_file"
      description="El material se asocia a un subtema y Kalibra lo procesa automáticamente."
      actions={<>
        <Button label="Cancelar" variant="neutral" disabled={isUploading} onClick={onClose} />
        <Button label={isUploading ? 'Subiendo material...' : 'Subir material'} icon="upload" disabled={!canSubmit} onClick={onSubmit} />
      </>}>
      <div className="flex flex-col gap-4" aria-busy={isUploading}>
        <Select label="Subtema" icon="account_tree" options={options} value={subtopicId} onChange={onSubtopicChange} />
        <FileDropzone label="Archivo de material" accept=".pdf,.png,.jpg" disabled={isUploading}
          title={isValid && !hasMaterials ? 'Archivo listo para subir' : 'Arrastra tu archivo aquí'}
          description="PDF, PNG o JPG · máximo 20 MB"
          selectLabel={validationError ? 'Seleccionar otro archivo' : 'Seleccionar archivo'}
          state={file ? (validationError ? 'invalid' : 'valid') : 'empty'}
          selectionLayout={hasMaterials ? 'picker' : 'compact'}
          fileName={file?.name} fileDescription={file ? materialFileDescription(file.name, file.size) : undefined}
          fileIcon={fileType === 'pdf' ? 'picture_as_pdf' : fileType ? 'image' : 'draft'}
          invalidLabel={validationError?.code === 'UNSUPPORTED_FORMAT' ? 'No soportado' : 'No válido'}
          onSelect={onFileSelect} onRemove={onFileRemove} />
        {validationError && <Callout tone="danger" icon="error" size="sm">{validationError.message}</Callout>}
        {uploadError && <Callout tone="danger" icon="error" size="sm">{uploadError}</Callout>}
      </div>
    </Modal>
  )
}
