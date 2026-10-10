/**
 * Chip that shows the state of the curricular material of a subtopic.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Chip } from '@/components/ui/Chip'
import type { MaterialStatus } from '@/types/course'
import type { IconName, Tone } from '@/types/ui'

// Label, tone and icon of each material state.
const STATUS_CHIP: Record<MaterialStatus, { label: string; tone: Tone; icon: IconName }> = {
  ready: { label: 'Listo', tone: 'success', icon: 'check_circle' },
  processing: { label: 'En ingestión', tone: 'warning', icon: 'schedule' },
  error: { label: 'Error de ingestión', tone: 'danger', icon: 'error' },
  missing: { label: 'Sin material', tone: 'neutral', icon: 'draft' },
}

/**
 * Props accepted by {@link MaterialStatusChip}.
 */
export interface MaterialStatusChipProps {
  /** State of the material. */
  status: MaterialStatus
  /** Contextual processing label; other states keep their shared presentation. */
  processingLabel?: string
  /**
   * Contextual processing icon.
   *
   * @defaultValue `'schedule'`
   */
  processingIcon?: IconName
}

/**
 * Shows whether the material of a subtopic is ready, processing, failed or missing.
 *
 * @example
 * ```tsx
 * <MaterialStatusChip status="processing" processingLabel="Pendiente" processingIcon="hourglass_empty" />
 * ```
 */
export function MaterialStatusChip({ status, processingLabel, processingIcon = 'schedule' }: MaterialStatusChipProps) {
  return <Chip {...STATUS_CHIP[status]} {...(status === 'processing' ? { label: processingLabel ?? STATUS_CHIP.processing.label, icon: processingIcon } : {})} />
}
