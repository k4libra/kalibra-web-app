/**
 * Dialog that changes the active course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Button, Icon, Modal } from '@/components/ui'
import type { Course } from '@/types/course'
import { cn } from '@/utils/cn'

/**
 * Props accepted by {@link CourseSwitcherDialog}.
 */
export interface CourseSwitcherDialogProps {
  /** Whether the dialog is visible. */
  isOpen: boolean
  /** Courses the teacher can manage. */
  courses: Course[]
  /** Course currently active. */
  activeCourseId: string | null
  /** Called with the course the user picks. */
  onSelect: (courseId: string) => void
  /** Called when the user closes the dialog without changes. */
  onClose: () => void
}

/**
 * Lists the courses of the teacher and reports the one chosen as active.
 *
 * @example
 * ```tsx
 * <CourseSwitcherDialog isOpen={isOpen} courses={courses} activeCourseId={id} onSelect={select} onClose={close} />
 * ```
 */
export function CourseSwitcherDialog({ isOpen, courses, activeCourseId, onSelect, onClose }: CourseSwitcherDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showClose={false}
      title="Cambiar curso activo"
      description="Elige el curso que quieres gestionar. El menú lateral mostrará sus secciones."
      actions={<Button label="Cancelar" variant="neutral" onClick={onClose} />}
    >
      <ul className="flex flex-col gap-2">
        {courses.map((course) => {
          const isActive = course.id === activeCourseId
          return (
            <li key={course.id}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => (isActive ? onClose() : onSelect(course.id))}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-md border p-3 text-left',
                  isActive ? 'border-primary-container bg-primary-subtle' : 'border-line-subtle bg-surface-card hover:bg-primary-subtle',
                )}
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary-container text-primary-strong">
                  <Icon name={course.icon} size="lg" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-label-l text-content-primary">{course.name}</span>
                  <span className="text-body-m text-content-secondary">
                    {course.code} · Ciclo {course.term}
                  </span>
                </span>
                {isActive && <Icon name="check" className="text-primary-strong" />}
              </button>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}
