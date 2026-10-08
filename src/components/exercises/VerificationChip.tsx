/**
 * Chip that shows the verification result of a generated exercise.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Chip } from '@/components/ui'
import type { VerificationStatus } from '@/types/exercise'

/**
 * Props accepted by {@link VerificationChip}.
 */
export interface VerificationChipProps {
  /** Verification result. */
  status: VerificationStatus
}

/**
 * Shows whether a generated exercise was approved or discarded.
 */
export function VerificationChip({ status }: VerificationChipProps) {
  return status === 'approved' ? (
    <Chip label="Aprobado" tone="success" icon="verified" />
  ) : (
    <Chip label="Descartado" tone="danger" icon="block" />
  )
}
