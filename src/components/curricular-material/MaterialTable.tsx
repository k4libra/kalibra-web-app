
/**
 * Curricular material table.
 *
 * @remarks
 * Displays uploaded files, their associated subtopics,
 * upload dates, ingestion states and available actions.
 *
 * @packageDocumentation
 */

import {
    Icon,
    MaterialStatusChip,
    TableCard,
    TableHeader,
    TableRow,
} from '@/components/ui'

import type { Subtopic } from '@/types/course'
import type { CurricularMaterial } from '@/types/curricularMaterial'

/**
 * Props accepted by MaterialTable.
 */
export interface MaterialTableProps {
    materials: CurricularMaterial[]
    subtopics: Subtopic[]
    onViewError: (material: CurricularMaterial) => void
}

/**
 * Formats file size in megabytes.
 */
function formatFileSize(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Formats the upload date without timezone shifts.
 */
function formatUploadDate(value: string): string {
    const date = value.slice(0, 10).split('-')

    if (date.length !== 3) {
        return value
    }

    const [year, month, day] = date

    const months = [
        'ene', 'feb', 'mar', 'abr',
        'may', 'jun', 'jul', 'ago',
        'sep', 'oct', 'nov', 'dic',
    ]

    const monthIndex = Number(month) - 1

    if (monthIndex < 0 || monthIndex > 11) {
        return value
    }

    return `${day} ${months[monthIndex]} ${year}`
}

/**
 * Returns a short description of the uploaded file.
 */
function getFileDescription(
    material: CurricularMaterial,
): string {
    const type = material.fileType.toUpperCase()
    const size = formatFileSize(material.fileSize)

    if (material.pageCount) {
        return `${type} · ${size} · ${material.pageCount} páginas`
    }

    if (material.fileType !== 'pdf') {
        return `${type} · ${size} · Escaneo`
    }

    return `${type} · ${size}`
}

/**
 * Displays the curricular material records for a course.
 */
export function MaterialTable({
                                  materials,
                                  subtopics,
                                  onViewError,
                              }: MaterialTableProps) {
    const subtopicNames = new Map(
        subtopics.map((subtopic) => [
            subtopic.id,
            subtopic.name,
        ]),
    )

    return (
        <TableCard label="Materiales curriculares del curso">
            <TableHeader
                columns={[
                    'Archivo',
                    'Subtema',
                    'Cargado',
                    'Estado',
                    'Acción',
                ]}
                className="md:grid-cols-12"
                cellClassNames={[
                    'md:col-span-4',
                    'md:col-span-3',
                    'md:col-span-2',
                    'md:col-span-2',
                    'md:col-span-1',
                ]}
            />

            {materials.map((material) => (
                <TableRow
                    key={material.id}
                    className="md:grid-cols-12"
                >
                    {/* File name and metadata */}
                    <div
                        role="cell"
                        className="flex min-w-0 items-center gap-3 md:col-span-4"
                    >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                            <Icon
                                name="description"
                                size="xl"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate font-medium text-content-primary">
                                {material.fileName}
                            </p>

                            <p className="text-sm text-content-secondary">
                                {getFileDescription(material)}
                            </p>
                        </div>
                    </div>

                    {/* Associated subtopic */}
                    <div
                        role="cell"
                        className="min-w-0 md:col-span-3"
                    >
                        <p className="text-sm text-content-primary">
                            {subtopicNames.get(material.subtopicId) ??
                                'Subtema no encontrado'}
                        </p>
                    </div>

                    {/* Upload date */}
                    <div
                        role="cell"
                        className="text-sm text-content-secondary md:col-span-2"
                    >
                        {formatUploadDate(material.uploadedAt)}
                    </div>

                    {/* Ingestion status */}
                    <div
                        role="cell"
                        className="md:col-span-2"
                    >
                        <MaterialStatusChip status={material.status} />
                    </div>

                    {/* Available actions */}
                    <div
                        role="cell"
                        className="md:col-span-1"
                    >
                        {material.status === 'error' ? (
                            <button
                                type="button"
                                onClick={() => onViewError(material)}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Ver motivo
                            </button>
                        ) : (
                            <span className="text-sm text-content-tertiary">
                —
              </span>
                        )}
                    </div>
                </TableRow>
            ))}
        </TableCard>
    )
}
