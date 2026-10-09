
/**
 * Modal for uploading or replacing curricular material.
 *
 * @remarks
 * Supports subtopic selection, drag-and-drop file selection,
 * file validation and simulated upload operations.
 *
 * @packageDocumentation
 */

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, FormEvent } from 'react'

import {
    Button,
    Icon,
    MaterialStatusChip,
    Modal,
    Select,
} from '@/components/ui'

import type { Subtopic } from '@/types/course'
import type {
    CurricularMaterial,
    MaterialValidationError,
    UploadCurricularMaterialRequest,
} from '@/types/curricularMaterial'

import {
    MATERIAL_UPLOAD_CONFIG,
} from '@/types/curricularMaterial'

export interface UploadMaterialModalProps {
    isOpen: boolean
    courseId: string
    subtopics: Subtopic[]
    materials: CurricularMaterial[]
    isUploading: boolean
    replacingMaterial?: CurricularMaterial | null
    onClose: () => void
    onUpload: (
        request: UploadCurricularMaterialRequest,
    ) => Promise<unknown>
}

function validateFile(file: File): MaterialValidationError | null {
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (
        extension !== 'pdf' &&
        extension !== 'png' &&
        extension !== 'jpg'
    ) {
        return {
            code: 'UNSUPPORTED_FORMAT',
            message:
                'Formato no soportado. Selecciona un archivo PDF, PNG o JPG.',
        }
    }

    if (file.size === 0) {
        return {
            code: 'EMPTY_FILE',
            message: 'El archivo seleccionado está vacío.',
        }
    }

    if (file.size > MATERIAL_UPLOAD_CONFIG.maxFileSizeBytes) {
        return {
            code: 'FILE_TOO_LARGE',
            message: 'El archivo supera el tamaño máximo de 20 MB.',
        }
    }

    return null
}

function formatSize(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Upload form used by the curricular material page.
 */
export function UploadMaterialModal({
                                        isOpen,
                                        courseId,
                                        subtopics,
                                        materials,
                                        isUploading,
                                        replacingMaterial = null,
                                        onClose,
                                        onUpload,
                                    }: UploadMaterialModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [subtopicId, setSubtopicId] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [validationError, setValidationError] =
        useState<MaterialValidationError | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        setSubtopicId(replacingMaterial?.subtopicId ?? '')
        setSelectedFile(null)
        setValidationError(null)
        setUploadError(null)
        setIsDragging(false)
    }, [isOpen, replacingMaterial])

    const subtopicOptions = subtopics.map((subtopic) => {
        const material = materials.find(
            (item) => item.subtopicId === subtopic.id,
        )

        return {
            value: subtopic.id,
            label: subtopic.name,
            trailing: (
                <MaterialStatusChip
                    status={material?.status ?? 'missing'}
                />
            ),
        }
    })

    function handleFile(file: File | undefined) {
        if (!file) return

        setSelectedFile(file)
        setValidationError(validateFile(file))
        setUploadError(null)
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        handleFile(event.target.files?.[0])

        // Allows selecting the same file again after an error.
        event.target.value = ''
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setIsDragging(false)

        if (isUploading) return

        handleFile(event.dataTransfer.files[0])
    }

    function handleDragOver(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()

        if (!isUploading) {
            setIsDragging(true)
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!subtopicId || !selectedFile || isUploading) return

        const error = validateFile(selectedFile)

        if (error) {
            setValidationError(error)
            return
        }

        setUploadError(null)

        try {
            await onUpload({
                courseId,
                subtopicId,
                file: selectedFile,
            })

            onClose()
        } catch (error) {
            setUploadError(
                error instanceof Error
                    ? error.message
                    : 'No se pudo subir el material. Inténtalo nuevamente.',
            )
        }
    }

    const canSubmit =
        Boolean(subtopicId) &&
        Boolean(selectedFile) &&
        !validationError &&
        !isUploading

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={replacingMaterial ? 'Reemplazar material' : 'Cargar material'}
            description="Selecciona el subtema y adjunta el documento que Kalibra procesará."
            icon="upload_file"
            size="lg"
        >
            <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-5">
                <Select
                    label="Subtema"
                    value={subtopicId}
                    onChange={setSubtopicId}
                    options={[
                        {
                            value: '',
                            label: 'Seleccionar subtema',
                            disabled: true,
                        },
                        ...subtopicOptions,
                    ]}
                />

                <div className="flex flex-col gap-2">
          <span className="text-body-m-bold text-content-primary">
            Archivo
          </span>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.png,.jpg"
                        onChange={handleInputChange}
                        className="hidden"
                        aria-label="Seleccionar material curricular"
                    />

                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                            isDragging
                                ? 'border-primary bg-primary-subtle'
                                : validationError
                                    ? 'border-danger bg-danger-subtle'
                                    : 'border-line-default bg-surface-background'
                        }`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-primary-subtle text-primary-strong">
                                <Icon name="upload_file" size="xl" />
                            </div>

                            <div>
                                <p className="text-body-m-bold text-content-primary">
                                    Arrastra tu archivo aquí
                                </p>
                                <p className="mt-1 text-body-m text-content-secondary">
                                    o selecciónalo desde tu computadora
                                </p>
                            </div>

                            <Button
                                label="Seleccionar archivo"
                                variant="neutral"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            />

                            <p className="text-body-m text-content-secondary">
                                PDF, PNG o JPG · Máximo 20 MB
                            </p>
                        </div>
                    </div>
                </div>

                {selectedFile && (
                    <div className="flex items-center gap-3 rounded-lg border border-line-default bg-surface-background p-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary-strong">
                            <Icon name="description" size="lg" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-body-m-bold text-content-primary">
                                {selectedFile.name}
                            </p>
                            <p className="text-body-m text-content-secondary">
                                {formatSize(selectedFile.size)}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedFile(null)
                                setValidationError(null)
                                setUploadError(null)
                            }}
                            disabled={isUploading}
                            aria-label="Quitar archivo"
                            className="rounded-md p-2 text-content-secondary hover:bg-surface-secondary disabled:opacity-50"
                        >
                            <Icon name="close" />
                        </button>
                    </div>
                )}

                {validationError && (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-lg border border-danger bg-danger-subtle p-3 text-body-m text-danger"
                    >
                        <Icon name="error" />
                        <p>{validationError.message}</p>
                    </div>
                )}

                {uploadError && (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-lg border border-danger bg-danger-subtle p-3 text-body-m text-danger"
                    >
                        <Icon name="error" />
                        <p>{uploadError}</p>
                    </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-line-default pt-4 sm:flex-row sm:justify-end">
                    <Button
                        label="Cancelar"
                        variant="neutral"
                        onClick={onClose}
                        disabled={isUploading}
                    />

                    <Button
                        label={isUploading ? 'Subiendo...' : 'Subir material'}
                        icon="upload_file"
                        type="submit"
                        disabled={!canSubmit}
                    />
                </div>
            </form>
        </Modal>
    )
}
