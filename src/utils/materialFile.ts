/**
 * Validates upload constraints and formats truthful file metadata.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { MATERIAL_UPLOAD_CONFIG, type MaterialFileType, type MaterialValidationError } from '@/types/curricularMaterial'
import { plural } from '@/utils/plural'

// Reference abbreviations stay stable across operating-system locale databases.
const MONTH_LABELS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/**
 * Identifies a supported extension without trusting the browser MIME type.
 *
 * @param name - Original filename, including its extension.
 * @returns The accepted format or `null` for an unsupported extension.
 *
 * @example
 * ```ts
 * materialFileType('notes.PDF'); // 'pdf'
 * ```
 */
export function materialFileType(name: string): MaterialFileType | null {
  const extension = name.includes('.') ? name.split('.').pop()?.toLowerCase() : undefined
  return MATERIAL_UPLOAD_CONFIG.acceptedExtensions.find((item) => item === extension) ?? null
}

/**
 * Checks file format and size against the shared upload constraints.
 *
 * @param file - Native file selected or dropped by the teacher.
 * @returns A visible validation error or `null` when the file can be submitted.
 *
 * @example
 * ```ts
 * validateMaterialFile(new File([], 'notes.pdf')); // empty-file error
 * ```
 */
export function validateMaterialFile(file: File): MaterialValidationError | null {
  if (!materialFileType(file.name)) return { code: 'UNSUPPORTED_FORMAT', message: 'Formato no soportado. Sube un PDF, PNG o JPG; el archivo no se registró.' }
  if (file.size === 0) return { code: 'EMPTY_FILE', message: 'El archivo está vacío. Selecciona un archivo con contenido; el archivo no se registró.' }
  if (file.size > MATERIAL_UPLOAD_CONFIG.maxFileSizeBytes) return { code: 'FILE_TOO_LARGE', message: 'El archivo supera el límite de 20 MB; el archivo no se registró.' }
  return null
}

/**
 * Formats file size using the design's decimal megabytes and kilobytes.
 *
 * @param bytes - Native file size in bytes.
 * @returns A localized value with its unit.
 *
 * @example
 * ```ts
 * formatFileSize(1024); // '1 KB'
 * ```
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toLocaleString('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB`
}

/**
 * Describes only metadata supplied by the selected file or processing response.
 *
 * @param name - Original filename used to show its extension.
 * @param bytes - File size in bytes.
 * @param pageCount - Verified page count, omitted until the processor supplies it.
 * @param isScan - Whether the reference metadata identifies a scan.
 * @returns The file type, size and known page or scan information.
 *
 * @example
 * ```ts
 * materialFileDescription('notes.pdf', 1024); // 'PDF · 1 KB'
 * ```
 */
export function materialFileDescription(name: string, bytes: number, pageCount?: number, isScan = false): string {
  const extension = name.split('.').pop()?.toUpperCase() ?? ''
  const parts = [extension, formatFileSize(bytes)]
  if (pageCount !== undefined) parts.push(plural(pageCount, 'página', 'páginas'))
  else if (isScan) parts.push('escaneo')
  return parts.join(' · ')
}

/**
 * Formats uploads as today's local time or a stable calendar date.
 *
 * @param value - ISO timestamp or date-only fixture.
 * @param now - Clock used to determine today's date.
 * @returns A Spanish date or `Hoy` and the local hour for today's upload.
 *
 * @example
 * ```ts
 * formatMaterialDate('2025-09-02'); // '02 sep 2025'
 * ```
 */
export function formatMaterialDate(value: string, now = new Date()): string {
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value)
  if (Number.isNaN(date.getTime())) return value
  if (value.length > 10 && date.toDateString() === now.toDateString()) {
    return `Hoy, ${date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })}`
  }
  return `${String(date.getDate()).padStart(2, '0')} ${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`
}
