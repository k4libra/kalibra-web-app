/**
 * Subtopics page of a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useNavigate, useParams } from 'react-router'
import { SubtopicsTable } from '@/components/courses'
import { Button, Callout, EmptyState, LoadingState, PageHeader, StatCard } from '@/components/ui'
import { useCourseSubtopics } from '@/hooks/useCourseSubtopics'
import { courseRoutes } from '@/navigation/routes'

/**
 * Shows the subtopics of the course in the URL with their material and mastery, using {@link useCourseSubtopics}.
 */
export function CourseSubtopicsPage() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const { course, subtopics, isLoading, error } = useCourseSubtopics(courseId)
  const readyCount = subtopics.filter((subtopic) => subtopic.materialStatus === 'ready').length
  const approvedCount = subtopics.reduce((total, subtopic) => total + subtopic.approvedExerciseCount, 0)
  const goToMaterial = () => navigate(courseRoutes.material(courseId))

  return (
    <>
      <PageHeader
        eyebrow={`MIS CURSOS  ›  ${course?.name ?? ''}`}
        title="Subtemas del curso"
        description="Cada subtema agrupa el material curricular sobre el que Kalibra genera y verifica ejercicios."
        actions={<Button label="Cargar material" icon="upload_file" onClick={goToMaterial} />}
      />

      {error && (
        <Callout icon="error" tone="danger">
          {error}
        </Callout>
      )}

      {isLoading ? (
        <LoadingState />
      ) : subtopics.length === 0 ? (
        <EmptyState icon="account_tree" title="Este curso aún no tiene subtemas" description="Los subtemas se definen al crear el curso." />
      ) : (
        <>
          <section aria-label="Resumen" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon="account_tree" value={String(subtopics.length)} label="Subtemas definidos" />
            <StatCard icon="task_alt" tone="success" value={String(readyCount)} label="Con material listo" />
            <StatCard icon="quiz" tone="warning" value={String(approvedCount)} label="Ejercicios aprobados" />
          </section>
          <SubtopicsTable subtopics={subtopics} />
          <Callout icon="lightbulb">
            {readyCount > 0
              ? 'Solo los subtemas con material en estado Listo pueden generar ejercicios. Reemplaza el material con error o carga el que falta.'
              : 'Carga el material de cada subtema para que Kalibra pueda generar ejercicios anclados a lo que enseñas.'}
          </Callout>
        </>
      )}
    </>
  )
}
