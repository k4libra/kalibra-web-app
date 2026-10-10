/**
 * Generated exercises page of the teacher panel.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { CourseExercisesGroup, ExerciseDetailDrawer, GenerateExercisesModal } from '@/components/exercises'
import { Button, Callout, EmptyState, LoadingState, PageHeader, StatCard } from '@/components/ui'
import { useGeneratedExercisesPage } from '@/hooks/useGeneratedExercisesPage'

/**
 * Shows the generated exercises of every course, their detail and the generation dialog, using {@link useGeneratedExercisesPage}.
 */
export function GeneratedExercisesPage() {
  const page = useGeneratedExercisesPage()
  const hasCourses = page.groups.length > 0

  return (
    <>
      <PageHeader
        eyebrow="PANEL DOCENTE"
        title="Ejercicios generados"
        description="Audita los ejercicios generados para tus cursos, agrupados por curso y subtema, con el resultado de su verificación."
        actions={<Button label="Generar ejercicios" icon="auto_awesome" disabled={!hasCourses} onClick={page.openGenerate} />}
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
            <StatCard icon="quiz" value={String(page.totals.generated)} label="Ejercicios generados" />
            <StatCard icon="verified" tone="success" value={String(page.totals.approved)} label="Aprobados por verificación" />
            <StatCard icon="block" tone="danger" value={String(page.totals.discarded)} label="Descartados" />
          </section>
          {page.groups.map((group) => (
            <CourseExercisesGroup
              key={group.course.id}
              course={group.course}
              catalog={group.catalog}
              onOpenExercise={page.openExercise}
              onUploadMaterial={page.uploadMaterial}
            />
          ))}
          <Callout icon="shield">
            Los ejercicios descartados nunca se muestran a tus estudiantes. Aquí puedes revisar su motivo de rechazo.
          </Callout>
        </>
      ) : (
        <EmptyState
          icon="quiz"
          title="Todavía no hay ejercicios generados"
          description="Crea un curso y carga su material: los ejercicios se generan a partir del material listo de cada subtema."
          action={<Button label="Crear mi primer curso" icon="add" onClick={page.goToCourses} />}
        />
      )}

      <ExerciseDetailDrawer exercise={page.selected?.exercise ?? null} subtopicName={page.selected?.subtopicName ?? ''} onClose={page.closeExercise} />
      {page.isGenerateOpen && (
        <GenerateExercisesModal
          error={page.generationError}
          courses={page.groups}
          isSubmitting={page.isGenerating}
          onClose={page.closeGenerate}
          onGenerate={page.generate}
          onUploadMaterial={page.uploadMaterial}
        />
      )}
    </>
  )
}
