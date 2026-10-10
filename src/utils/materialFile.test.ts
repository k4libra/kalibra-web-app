/**
 * Tests for file validation and truthful material metadata formatting.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest'
import { MATERIAL_UPLOAD_CONFIG } from '@/types/curricularMaterial'
import { formatFileSize, formatMaterialDate, materialFileDescription, materialFileType, validateMaterialFile } from '@/utils/materialFile'

describe('material file utilities', () => {
  it.each(['pdf', 'PDF', 'png', 'jpg'])('accepts the supported %s extension regardless of MIME', (extension) => {
    expect(validateMaterialFile(new File(['content'], `notes.${extension}`, { type: '' }))).toBeNull()
  })

  it.each(['docx', 'jpeg', 'exe', ''])('rejects unsupported %s extensions', (extension) => {
    expect(materialFileType(`notes.${extension}`)).toBeNull()
    expect(validateMaterialFile(new File(['content'], `notes.${extension}`))?.code).toBe('UNSUPPORTED_FORMAT')
  })

  it('rejects empty files', () => {
    expect(validateMaterialFile(new File([], 'notes.pdf'))?.code).toBe('EMPTY_FILE')
  })

  it('does not treat an extensionless filename as a file format', () => {
    expect(materialFileType('pdf')).toBeNull()
    expect(validateMaterialFile(new File(['content'], 'png'))?.code).toBe('UNSUPPORTED_FORMAT')
  })

  it('accepts exactly 10 MB and rejects the first byte above the limit', () => {
    const file = new File(['content'], 'notes.pdf')
    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024, configurable: true })
    expect(validateMaterialFile(file)).toBeNull()
    Object.defineProperty(file, 'size', { value: MATERIAL_UPLOAD_CONFIG.maxFileSizeBytes + 1 })
    expect(validateMaterialFile(file)).toEqual({ code: 'FILE_TOO_LARGE', message: 'El archivo supera el límite de 10 MB; el archivo no se registró.' })
  })

  it('shows known pages without inferring them from the file size', () => {
    expect(materialFileDescription('notes.pdf', 1024)).toBe('PDF · 1 KB')
    expect(materialFileDescription('notes.pdf', 1024, 1)).toBe('PDF · 1 KB · 1 página')
    expect(materialFileDescription('scan.jpg', 1024, undefined, true)).toBe('JPG · 1 KB · escaneo')
    expect(formatFileSize(2.4 * 1024 * 1024)).toBe('2,4 MB')
  })

  it('formats date-only fixtures without shifting the calendar date', () => {
    expect(formatMaterialDate('2025-09-02', new Date('2025-09-11T10:05:00'))).toBe('02 sep 2025')
    expect(formatMaterialDate('bad date')).toBe('bad date')
  })

  it('shows today and the actual local upload time', () => {
    expect(formatMaterialDate(new Date('2025-09-11T10:05:00').toISOString(), new Date('2025-09-11T12:00:00'))).toBe('Hoy, 10:05')
  })
})
