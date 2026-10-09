
/**
 * Modal displaying a curricular material ingestion error.
 *
 * @remarks
 * Allows teachers to inspect why a file could not be
 * processed and initiate its replacement.
 *
 * @packageDocumentation
 */

import { Icon, Modal } from '@/components/ui'

import type { CurricularMaterial } from '@/types/curricularMaterial'

/**
 * Props accepted by MaterialErrorModal.
 */
export interface MaterialErrorModalProps {
    material: CurricularMaterial | null
    isOpen: boolean
    onClose: () => void
    onReplace: (material: CurricularMaterial) => void
}

/**
 * Displays ingestion error details for a selected material.
 */
export function MaterialErrorModal({
                                       material,
                                       isOpen,
                                       onClose,
                                       onReplace,
                                   }: MaterialErrorModalProps) {
    if (!material) {
        return null
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Motivo del error"
            description="No se pudo procesar el material curricular."
        >
            <div className="space-y-5">
                {/* Failed file information */}
                <div className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-secondary p-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-danger-subtle text-danger">
                        <Icon name="description" size="xl" />
                    </div>

                    <div className="min-w-0">
                        <p className="break-all font-semibold text-content-primary">
                            {material.fileName}
                        </p>

                        <p className="mt-1 text-sm text-content-secondary">
                            El archivo presenta un error de ingestión.
                        </p>
                    </div>
                </div>

                {/* Ingestion error explanation */}
                <div
                    role="alert"
                    className="rounded-xl border border-danger/20 bg-danger-subtle p-4"
                >
                    <div className="flex items-start gap-3">
                        <Icon
                            name="error"
                            size="lg"
                            className="mt-0.5 shrink-0 text-danger"
                        />

                        <div className="space-y-2">
                            <h3 className="font-semibold text-danger">
                                No se pudo procesar el archivo
                            </h3>

                            <p className="text-sm leading-relaxed text-content-primary">
                                {material.errorMessage ??
                                    'Ocurrió un problema durante el procesamiento del material curricular.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendation */}
                <p className="text-sm leading-relaxed text-content-secondary">
                    Revisa que el documento sea legible y tenga un
                    formato compatible. Puedes reemplazarlo por una
                    versión corregida para intentar procesarlo nuevamente.
                </p>

                {/* Modal actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-border-subtle px-5 py-2.5 text-sm font-medium text-content-primary transition-colors hover:bg-surface-secondary"
                    >
                        Cerrar
                    </button>

                    <button
                        type="button"
                        onClick={() => onReplace(material)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        <Icon name="upload_file" size="lg" />
                        Reemplazar archivo
                    </button>
                </div>
            </div>
        </Modal>
    )
}
