/**
 * Indicators page of a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useParams } from 'react-router'
import {
  AccuracyIndicator,
  ExportIndicatorsModal,
  IndicatorsGuideModal,
  MasteryEvolutionIndicator,
  PracticeIndicator,
  VerificationIndicator,
} from '@/components/indicators'
import { Button, Callout, EmptyState, LoadingState, PageHeader } from '@/components/ui'
import { useCourseIndicatorsPage } from '@/hooks/useCourseIndicatorsPage'

/**
 * Shows the four indicators of the course in the URL with the guide and the CSV export, using {@link useCourseIndicatorsPage}.
 */
export function CourseIndicatorsPage() {
  const { courseId = '' } = useParams()
  const page = useCourseIndicatorsPage(courseId)
  const hasData = page.indicators !== null

  return (
    <>
      <PageHeader
        eyebrow={`MIS CURSOS  ›  ${page.course?.name ?? ''}`}
        title="Indicadores del curso"
        description="Kalibra los calcula automáticamente con cada ejercicio que resuelven tus estudiantes."
        actions={
          hasData ? (
            <>
              <Button label="Cómo leerlos" icon="help" variant="tonal" onClick={page.openGuide} />
              <Button label="Exportar" icon="download" onClick={page.openExport} />
            </>
          ) : (
            !page.isLoading && <Button label="Cargar material" icon="upload_file" variant="tonal" onClick={page.goToMaterial} />
          )
        }
      />

      {page.error && (
        <Callout icon="error" tone="danger">
          {page.error}
        </Callout>
      )}

      {page.isLoading ? (
        <LoadingState />
      ) : page.indicators ? (
        <>
          <AccuracyIndicator students={page.indicators.students} />
          <PracticeIndicator subtopics={page.indicators.subtopics} students={page.indicators.students} />
          <MasteryEvolutionIndicator subtopics={page.indicators.subtopics} />
          <VerificationIndicator subtopics={page.indicators.subtopics} onReviewExercises={page.goToExercises} />
        </>
      ) : (
        <>
          <EmptyState
            icon="query_stats"
            title="Aún no hay indicadores para este curso"
            description="Aparecerán cuando tus estudiantes matriculados resuelvan ejercicios. Primero carga el material de sus subtemas e invita a tus estudiantes."
          />
          <Callout icon="info">Kalibra calcula los indicadores automáticamente: no necesitas registrar notas ni datos adicionales.</Callout>
        </>
      )}

      <IndicatorsGuideModal isOpen={page.isGuideOpen} onClose={page.closeGuide} />
      <ExportIndicatorsModal
        isOpen={page.isExportOpen}
        courseName={page.course?.name ?? ''}
        isExporting={page.isExporting}
        onClose={page.closeExport}
        onDownload={page.download}
      />
    </>
  )
}
