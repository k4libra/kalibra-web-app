/**
 * Generated exercises page of the teacher panel.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { CourseExercisesGroup, ExerciseDetailDrawer, GenerateExercisesModal } from '@/components/exercises'
import { useState } from 'react'
import { InlineToast } from '@/context/ToastContext'
import { CourseFilter, StatStrip, StatItem, Button, Callout, EmptyState, LoadingState, PageHeader } from '@/components/ui'
import { useGeneratedExercisesPage } from '@/hooks/useGeneratedExercisesPage'

/**
 * Shows the generated exercises of every course, their detail and the generation dialog, using {@link useGeneratedExercisesPage}.
 */
export function GeneratedExercisesPage() {
  const page = useGeneratedExercisesPage()
  const [courseFilter, setCourseFilter] = useState('')
  const visibleGroups = page.groups.filter((group) => !courseFilter || group.course.id === courseFilter)
  const hasCourses = page.groups.length > 0

  return (
    <div className="-mt-1 flex flex-col gap-4">
      <PageHeader
        eyebrow="PANEL DOCENTE"
        title="Ejercicios generados"
        description="Audita los ejercicios generados para tus cursos, agrupados por curso y subtema, con el resultado de su verificación."
        helperIcon="shield"
        helper="Los ejercicios descartados nunca se muestran a tus estudiantes; aquí puedes revisar su motivo de rechazo."
        actions={<Button label="Generar ejercicios" icon="auto_awesome" disabled={!hasCourses} onClick={page.openGenerate} />}
      />

      <InlineToast />
      {page.error && (
        <Callout icon="error" tone="danger">
          {page.error}
        </Callout>
      )}

      {page.isLoading ? (
        <LoadingState />
      ) : hasCourses ? (
        <>
          <StatStrip>
            <StatItem icon="quiz" value={String(page.totals.generated)} label="Ejercicios generados" />
            <StatItem icon="verified" tone="success" value={String(page.totals.approved)} label="Aprobados por verificación" />
            <StatItem icon="block" tone="danger" value={String(page.totals.discarded)} label="Descartados" />
          </StatStrip>
          <CourseFilter value={courseFilter} onChange={setCourseFilter} courses={page.groups.map((group) => ({ id: group.course.id, name: group.course.name, count: group.catalog.generatedCount }))} />
          {visibleGroups.map((group) => (
            <CourseExercisesGroup
              key={group.course.id}
              course={group.course}
              catalog={group.catalog}
              onOpenExercise={page.openExercise}
              onUploadMaterial={page.uploadMaterial}
            />
          ))}

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
    </div>
  )
}
