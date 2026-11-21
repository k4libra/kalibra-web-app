/**
 * Logout dialog composed from the shared modal and action primitives.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { Button, Callout, Modal } from '@/components/ui'

/** Props accepted by {@link LogoutConfirmModal}. */
export interface LogoutConfirmModalProps {
  /** Whether confirmation is visible. */
  isOpen: boolean
  /** Whether sign-out is in progress. */
  isSubmitting: boolean
  /** Failure of the last sign-out request. */
  error: string | null
  /** Confirms sign-out. */
  onConfirm: () => void
  /** Keeps the current page and session. */
  onCancel: () => void
}

/** Renders logout confirmation over the current page and emits confirm or cancel. */
export function LogoutConfirmModal({ isOpen, isSubmitting, error, onConfirm, onCancel }: LogoutConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="¿Deseas cerrar sesión?"
      description="Tu sesión se cerrará en este dispositivo. Tus cursos y el progreso de tus estudiantes se mantienen guardados."
      icon="logout"
      iconTone="danger"
      size="confirm"
      actions={
        <>
          <Button label="Cancelar" variant="neutral" onClick={onCancel} disabled={isSubmitting} />
          <Button
            label={isSubmitting ? 'Cerrando sesión...' : 'Sí, cerrar sesión'}
            icon="logout"
            variant="danger"
            onClick={onConfirm}
            disabled={isSubmitting}
          />
        </>
      }
    >
      {error && (
        <Callout icon="error" tone="danger">
          {error}
        </Callout>
      )}
    </Modal>
  )
}
