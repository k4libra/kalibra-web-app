/**
 * Chip that shows the state of an invitation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Chip } from '@/components/ui'
import type { InvitationStatus } from '@/types/invitation'
import type { IconName, Tone } from '@/types/ui'

// Label, tone and icon of each invitation state.
const STATUS_CHIP: Record<InvitationStatus, { label: string; tone: Tone; icon: IconName }> = {
  pending: { label: 'Pendiente', tone: 'warning', icon: 'schedule' },
  accepted: { label: 'Aceptada', tone: 'success', icon: 'how_to_reg' },
  expired: { label: 'Vencida', tone: 'danger', icon: 'event_busy' },
  cancelled: { label: 'Cancelada', tone: 'neutral', icon: 'cancel' },
}

/**
 * Props accepted by {@link InvitationStatusChip}.
 */
export interface InvitationStatusChipProps {
  /** State of the invitation. */
  status: InvitationStatus
}

/**
 * Shows whether an invitation is pending, accepted, expired or cancelled.
 */
export function InvitationStatusChip({ status }: InvitationStatusChipProps) {
  return <Chip {...STATUS_CHIP[status]} />
}
