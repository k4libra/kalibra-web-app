/**
 * Chip that shows the state of the curricular material of a subtopic.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Chip } from './Chip'
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
}

/**
 * Shows whether the material of a subtopic is ready, processing, failed or missing.
 */
export function MaterialStatusChip({ status }: MaterialStatusChipProps) {
  return <Chip {...STATUS_CHIP[status]} />
}
