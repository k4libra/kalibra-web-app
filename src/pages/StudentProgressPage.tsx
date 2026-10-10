/**
 * Individual student progress page with evidence-based reinforcement notices.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { StudentMasteryTable } from '@/components/student-monitoring'
import { Button, Callout, EmptyState, LoadingState, PageHeader, StatCard } from '@/components/ui'
import { useStudentProgress } from '@/hooks/useStudentMonitoring'
import { formatMastery } from '@/utils/monitoring'

/** Shows activity or accepted-enrollment details using {@link useStudentProgress}. */
export function StudentProgressPage() {
  const page = useStudentProgress()
  const back = <Button label="Volver a estudiantes" icon="arrow_back" variant="neutral" onClick={page.viewStudents} />
  if (page.isLoading) return <LoadingState label="Cargando progreso del estudiante…" />
  if (page.error || !page.progress || !page.course) return <>
    <PageHeader eyebrow="Estudiantes" title="No se pudo cargar el progreso" actions={back} />
    <Callout icon="error" tone="danger" action={<Button label="Reintentar" variant="neutral" onClick={page.refetch} />}>{page.error ?? 'Estudiante no encontrado.'}</Callout>
  </>
  const { student, subtopics } = page.progress
  return <>
    <PageHeader eyebrow={`Estudiantes › ${page.course.name}`} title={student.fullName}
      description={`${student.email} · Matriculado el ${page.enrollmentDate}`} actions={back} />
    {student.resolvedExercises > 0 ? <>
      <section aria-label="Resumen del progreso" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon="insights" value={formatMastery(student.averageMastery)} label="Dominio promedio" />
        <StatCard icon="quiz" tone="warning" value={`${student.resolvedExercises}`} label="Ejercicios resueltos" />
        <StatCard icon="check_circle" tone="success" value={`${student.correctAnswers} de ${student.resolvedExercises}`} label="Respuestas correctas" />
      </section>
      <StudentMasteryTable subtopics={page.courseSubtopics} masteryRecords={subtopics} />
      {page.recommendation && <Callout icon="priority_high" tone="warning">{page.recommendation}</Callout>}
    </> : <>
      <EmptyState icon="hourglass_empty" title={`${page.firstName} aún no registra actividad`} className="py-14"
        description="Cuando resuelva su primer ejercicio verás aquí su dominio estimado por subtema y sus respuestas correctas." />
      <Callout icon="info">{page.firstName} aceptó tu invitación el {page.enrollmentDate}. Kalibra estimará su dominio desde su primer ejercicio resuelto.</Callout>
    </>}
  </>
}
