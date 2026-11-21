/**
 * Dialog to export the course indicators.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Callout, Icon, Modal } from '@/components/ui'

// Contents of the exported file.
const FILE_CONTENTS = [
  'Porcentaje de aciertos por estudiante',
  'Ejercicios resueltos por subtema',
  'Dominio al empezar y actual por subtema',
  'Resultado de la verificación de los ejercicios generados',
]

/**
 * Props accepted by {@link ExportIndicatorsModal}.
 */
export interface ExportIndicatorsModalProps {
  /** Whether the dialog is visible. */
  isOpen: boolean
  /** Name of the course being exported. */
  courseName: string
  /** Whether the export is in flight. */
  isExporting: boolean
  /** Called when the teacher cancels or closes the dialog. */
  onClose: () => void
  /** Called when the teacher confirms the download. */
  onDownload: () => void
}

/**
 * Describes the anonymous CSV export and emits the download request.
 */
export function ExportIndicatorsModal({ isOpen, courseName, isExporting, onClose, onDownload }: ExportIndicatorsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon="download"
      title="Exportar indicadores del curso"
      description={`Descarga los datos de ${courseName} para analizarlos en una hoja de cálculo.`}
      actions={
        <>
          <Button label="Cancelar" variant="neutral" onClick={onClose} />
          <Button label="Descargar CSV" icon="download" disabled={isExporting} onClick={onDownload} />
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-2">
          <p className="text-label-s text-content-muted">EL ARCHIVO INCLUYE</p>
          <ul className="flex flex-col gap-2">
            {FILE_CONTENTS.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-body-l text-content-primary">
                <Icon name="check_circle" className="text-secondary-strong" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-body-m-bold text-content-primary">Formato</p>
          <p className="flex h-11 items-center gap-2.5 rounded-md border border-line-default bg-surface-background px-3 text-body-l text-content-primary">
            <Icon name="table_view" className="text-content-secondary" />
            CSV · una fila por estudiante y subtema
          </p>
        </div>
        <Callout icon="lock" size="sm">
          Cada estudiante aparece con un código anónimo (E-01, E-02…), sin nombre ni correo.
        </Callout>
      </div>
    </Modal>
  )
}
