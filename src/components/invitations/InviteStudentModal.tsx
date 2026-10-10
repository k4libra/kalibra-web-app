/**
 * Dialog to invite a student to a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react'
import { Button, Callout, Icon, Modal, Select, TextField, type FieldStatus } from '@/components/ui'
import type { CourseOverview } from '@/types/course'
import { plural } from '@/utils/plural'

// Minimal shape check of an email, only to decide when to show the corrected state.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Props accepted by {@link InviteStudentModal}.
 */
export interface InviteStudentModalProps {
  /** Error returned by the invitation request. */
  error?: string | null
  /** Courses the teacher can invite to. */
  courses: CourseOverview[]
  /** Email rejected by the last attempt because it has no account; `null` when there was no rejection. */
  rejectedEmail: string | null
  /** Whether a request is in flight. */
  isSubmitting: boolean
  /** Called when the teacher cancels or closes the dialog. */
  onClose: () => void
  /** Called with the chosen course and the email when the teacher sends the invitation. */
  onSend: (courseId: string, email: string) => void
}

/**
 * Collects the course and the institutional email of a student and emits the invitation.
 *
 * @remarks
 * When `rejectedEmail` matches the typed email the field turns red and explains that nothing was sent;
 * editing the email clears the error. Mount it only while open so each opening starts empty.
 */
export function InviteStudentModal({ error, courses, rejectedEmail, isSubmitting, onClose, onSend }: InviteStudentModalProps) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? '')
  const [email, setEmail] = useState('')
  const isRejected = rejectedEmail !== null && rejectedEmail === email.trim()
  const isCorrected = rejectedEmail !== null && !isRejected && EMAIL_PATTERN.test(email.trim())
  const status: FieldStatus = isRejected ? 'error' : isCorrected ? 'success' : 'default'
  const canSend = courseId && email.trim() && !isRejected && !isSubmitting

  return (
    <Modal
      isOpen
      onClose={onClose}
      icon="person_add"
      title="Invitar estudiante"
      description="El estudiante recibirá la invitación y quedará matriculado cuando la acepte."
      actions={
        <>
          <Button label="Cancelar" variant="neutral" onClick={onClose} />
          <Button label="Enviar invitación" icon="send" disabled={!canSend} onClick={() => onSend(courseId, email.trim())} />
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        {error && <Callout icon="error" tone="danger">{error}</Callout>}
        <Select
          label="Curso"
          icon="school"
          value={courseId}
          onChange={setCourseId}
          options={courses.map((course) => ({
            value: course.id,
            label: course.name,
            description:
              course.studentCount > 0
                ? `${course.code} · ${plural(course.studentCount, 'estudiante matriculado', 'estudiantes matriculados')}`
                : `${course.code} · sin estudiantes aún`,
          }))}
        />
        <TextField
          label="Correo institucional del estudiante"
          type="email"
          icon="mail"
          placeholder="nombre@upc.edu.pe"
          value={email}
          onChange={setEmail}
          status={status}
          onSubmit={() => canSend && onSend(courseId, email.trim())}
        />
        {isRejected && (
          <Callout icon="error" tone="danger" size="sm">
            Este correo no tiene una cuenta en Kalibra. Pide al estudiante que se registre primero; no se envió ninguna invitación.
          </Callout>
        )}
        <p className="flex items-center gap-2 text-body-m text-content-secondary">
          <Icon name="timer" size="sm" />
          La invitación vence a los 3 días si el estudiante no responde.
        </p>
      </div>
    </Modal>
  )
}
