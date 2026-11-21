/**
 * Confirmation dialog to cancel an invitation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Modal } from '@/components/ui'

/**
 * Props accepted by {@link CancelInvitationDialog}.
 */
export interface CancelInvitationDialogProps {
  /** Email of the invitation to cancel; `null` keeps the dialog closed. */
  email: string | null
  /** Name of the course of the invitation. */
  courseName: string
  /** Whether the cancellation is in flight. */
  isSubmitting: boolean
  /** Called when the teacher keeps the invitation. */
  onClose: () => void
  /** Called when the teacher confirms the cancellation. */
  onConfirm: () => void
}

/**
 * Asks the teacher to confirm before withdrawing a pending invitation.
 */
export function CancelInvitationDialog({ email, courseName, isSubmitting, onClose, onConfirm }: CancelInvitationDialogProps) {
  return (
    <Modal
      isOpen={email !== null}
      onClose={onClose}
      size="md"
      icon="cancel"
      iconTone="danger"
      title="¿Cancelar la invitación?"
      description={`${email ?? ''} dejará de ver la invitación a ${courseName}. Podrás reenviarla después.`}
      actions={
        <>
          <Button label="Volver" variant="neutral" onClick={onClose} />
          <Button label="Sí, cancelar invitación" icon="cancel" variant="danger" disabled={isSubmitting} onClick={onConfirm} />
        </>
      }
    />
  )
}
