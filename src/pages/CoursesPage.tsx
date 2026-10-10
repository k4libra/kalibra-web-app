/**
 * Courses page of the teacher panel.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { CourseCard, CreateCourseModal } from '@/components/courses'
import { Button, Callout, Chip, EmptyState, LoadingState, PageHeader, SectionHeader, StatCard } from '@/components/ui'
import { useCoursesPage } from '@/hooks/useCoursesPage'
import { plural } from '@/utils/plural'

/**
 * Shows the courses the teacher manages and the create course dialog, using {@link useCoursesPage}.
 */
export function CoursesPage() {
  const page = useCoursesPage()
  const hasCourses = page.courses.length > 0
  const greeting = page.teacher ? `Hola, ${page.teacher.firstName}` : 'Hola'

  return (
    <>
      <PageHeader
        eyebrow="PANEL DOCENTE"
        title={greeting}
        description={
          hasCourses || page.isLoading
            ? 'Administra tus cursos, su material curricular y el seguimiento de tus estudiantes.'
            : 'Aún no administras cursos. Crea el primero para cargar su material y matricular estudiantes.'
        }
        actions={<Button label="Crear curso" icon="add" onClick={page.openCreate} />}
      />

      {page.error && (
        <Callout icon="error" tone="danger">
          {page.error}
        </Callout>
      )}

      {page.isLoading ? (
        <LoadingState />
      ) : hasCourses ? (
        <>
          <section aria-label="Resumen" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon="school" value={String(page.courses.length)} label={page.courses.length === 1 ? 'Curso activo' : 'Cursos activos'} />
            <StatCard icon="group" tone="success" value={String(page.studentCount)} label={page.studentCount === 1 ? 'Estudiante matriculado' : 'Estudiantes matriculados'} />
            <StatCard
              icon="forward_to_inbox"
              tone="warning"
              value={String(page.pendingInvitationCount)}
              label={page.pendingInvitationCount === 1 ? 'Invitación pendiente' : 'Invitaciones pendientes'}
            />
          </section>
          <section className="flex flex-col gap-4">
            <SectionHeader title="Cursos que administras" trailing={<Chip label={plural(page.courses.length, 'curso', 'cursos')} tone="neutral" />} />
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
              {page.courses.map((course) => (
                <CourseCard key={course.id} course={course} onManage={page.manageCourse} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <EmptyState
          icon="school"
          title="Todavía no tienes cursos"
          description="Crea tu primer curso y define los subtemas que lo componen. Luego podrás cargar su material e invitar a tus estudiantes."
          action={<Button label="Crear mi primer curso" icon="add" onClick={page.openCreate} />}
        />
      )}

      {page.isCreateOpen && <CreateCourseModal isSubmitting={page.isSubmitting} onClose={page.closeCreate} onSubmit={page.createCourse} />}
    </>
  )
}
