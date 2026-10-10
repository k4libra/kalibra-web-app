/**
 * Accessible native file selection with drop, valid and invalid presentations.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { IconBox } from '@/components/ui/IconBox'
import { IconButton } from '@/components/ui/IconButton'
import type { IconName, Tone } from '@/types/ui'
import { cn } from '@/utils/cn'

/**
 * Selection states of the file picker.
 */
export type FileDropzoneState = 'empty' | 'valid' | 'invalid'

/**
 * Presentations of a valid selection: a compact summary or a persistent picker.
 */
export type FileSelectionLayout = 'compact' | 'picker'

// Exhaustive style and status presets keep state styling inside the primitive.
const ROW_CLASS: Record<FileDropzoneState, string> = {
  empty: '', valid: 'border-line-default', invalid: 'border-danger',
}
const STATUS: Record<FileDropzoneState, { label: string; icon: IconName; tone: Tone }> = {
  empty: { label: '', icon: 'draft', tone: 'primary' },
  valid: { label: 'Válido', icon: 'check_circle', tone: 'success' },
  invalid: { label: 'No soportado', icon: 'block', tone: 'danger' },
}

// The picker reserves room for the action; the compact summary omits that room.
const DROPZONE_CLASS: Record<FileSelectionLayout, string> = {
  compact: 'min-h-44',
  picker: 'min-h-48',
}

/**
 * Props accepted by {@link FileDropzone}.
 */
export interface FileDropzoneProps {
  /** Visible instructions for choosing or dropping a file. */
  title: string
  /** Accepted formats and limits displayed under the instructions. */
  description: string
  /** Native file input's accessible name. */
  label: string
  /** Visible file-picker action. */
  selectLabel: string
  /** Browser file filter; server-side validation remains the caller's responsibility. */
  accept: string
  /** Controlled validation presentation. */
  state: FileDropzoneState
  /**
   * Whether a valid file retains the picker action or uses a compact summary.
   *
   * @defaultValue `'compact'`
   */
  selectionLayout?: FileSelectionLayout
  /** Selected filename, absent before selection. */
  fileName?: string
  /** Truthful type, size and known processing metadata. */
  fileDescription?: string
  /**
   * Selected file's type-specific icon.
   *
   * @defaultValue `'draft'`
   */
  fileIcon?: IconName
  /** Overrides the invalid chip for size or empty-file errors. */
  invalidLabel?: string
  /**
   * Blocks file actions while the caller submits.
   *
   * @defaultValue `false`
   */
  disabled?: boolean
  /** Reports a native file from either the picker or a drop. */
  onSelect: (file: File) => void
  /** Removes the controlled selection. */
  onRemove: () => void
}

/**
 * Wraps a hidden native file input and reports selection without owning validation.
 *
 * @example
 * ```tsx
 * <FileDropzone title="Seleccionar archivo" description="PDF" label="Archivo" selectLabel="Seleccionar archivo"
 *   accept=".pdf" state="empty" onSelect={selectFile} onRemove={removeFile} />
 * ```
 */
export function FileDropzone({
  title, description, label, selectLabel, accept, state, fileName, fileDescription,
  fileIcon = 'draft', invalidLabel, disabled = false, selectionLayout = 'compact', onSelect, onRemove,
}: FileDropzoneProps) {
  const input = useRef<HTMLInputElement>(null)
  const isValid = state === 'valid'
  return (
    <div className="flex flex-col gap-4">
      <input ref={input} type="file" aria-label={label} accept={accept} disabled={disabled} className="hidden"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) onSelect(file)
          event.currentTarget.value = ''
        }} />
      <div className={cn('flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-primary-pale bg-primary-subtle px-5 py-5 text-center', DROPZONE_CLASS[isValid ? selectionLayout : 'picker'])}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          if (!disabled && event.dataTransfer.files[0]) onSelect(event.dataTransfer.files[0])
        }}>
        <IconBox icon="cloud_upload" size="lg" />
        <p className="pt-1 text-title text-content-primary">{title}</p>
        <p className="text-body-m text-content-secondary">{description}</p>
        {(!isValid || selectionLayout === 'picker') && <Button label={selectLabel} icon="folder_open" variant="neutral" size="sm" disabled={disabled}
          onClick={() => input.current?.click()} className="mt-1" />}
      </div>
      {fileName && <div className={cn('flex items-center gap-3 rounded-md border bg-surface-card px-3', isValid ? 'py-2' : 'py-3', ROW_CLASS[state])}>
        <IconBox icon={fileIcon} size="sm" tone={state === 'invalid' ? 'danger' : 'primary'} isSubtle={state !== 'invalid'} />
        <div className="min-w-0 flex-1">
          <p className="break-all text-label-l text-content-primary">{fileName}</p>
          <p className="text-body-m text-content-secondary">{fileDescription}</p>
        </div>
        <Chip {...STATUS[state]} label={state === 'invalid' ? invalidLabel ?? STATUS.invalid.label : STATUS[state].label} />
        {isValid && <IconButton icon="close" label="Quitar archivo" disabled={disabled} onClick={onRemove} />}
      </div>}
    </div>
  )
}
