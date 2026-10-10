/**
 * Composes the material page from hooks and controlled presentation components.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useParams } from 'react-router'
import { Button, Callout, EmptyState, LoadingState, PageHeader, StatCard } from '@/components/ui'
import { MaterialErrorModal, MaterialTable, UploadMaterialModal } from '@/components/curricular-material'
import { useCurricularMaterialPage } from '@/hooks/useCurricularMaterialPage'

/**
 * Shows course materials and both upload flows using {@link useCurricularMaterialPage} for data and actions.
 */
export function CurricularMaterialPage() {
  const { courseId = '' } = useParams<{ courseId: string }>()
  const page = useCurricularMaterialPage(courseId)
  const names = new Map(page.subtopics.map((subtopic) => [subtopic.id, subtopic.name]))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow={`MIS CURSOS › ${page.course?.name.toUpperCase() ?? 'CURSO'}`} title="Material curricular"
        description="Documentos que Kalibra procesa para anclar los ejercicios generados a lo que enseñas."
        actions={<Button label="Cargar material" icon="upload_file" onClick={page.openUpload} disabled={!page.course || page.isLoading} />} />
      {page.isLoading ? <LoadingState label="Cargando materiales curriculares..." /> : page.error ? <Callout icon="error" tone="danger">{page.error}</Callout> : <>
        {page.materials.length > 0 ? <>
          <section aria-label="Resumen de materiales curriculares" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard icon="description" value={String(page.stats.total)} label="Materiales cargados" />
            <StatCard icon="check_circle" tone="success" value={String(page.stats.ready)} label="Listos para generar" />
            <StatCard icon="error" tone="danger" value={String(page.stats.error)} label="Con error de ingestión" />
          </section>
          <MaterialTable materials={page.materials} subtopics={page.subtopics} onViewError={page.viewError} />
        </> : <EmptyState icon="upload_file" title="Aún no has cargado material"
          description="Sube un PDF o una imagen por subtema. Kalibra extraerá su contenido y te avisará cuando esté listo para generar ejercicios."
          className="py-14" action={<Button label="Cargar primer material" icon="upload_file" onClick={page.openUpload} disabled={!page.subtopics.length} />} />}
        {page.materials.filter((material) => material.status === 'error').map((material) => <Callout key={material.id} icon="error" tone="danger">
          {names.get(material.subtopicId)} no pudo procesarse. Revisa el motivo y reemplaza el archivo para habilitar la generación de ejercicios.
        </Callout>)}
        {page.materials.filter((material) => material.status === 'processing').map((material) => <Callout key={material.id} icon="hourglass_empty">
          Kalibra está extrayendo el contenido de {names.get(material.subtopicId)}. Te avisaremos cuando esté listo para generar ejercicios.
        </Callout>)}
        <Callout icon="info">Formatos aceptados: PDF, PNG y JPG de hasta 20 MB. Kalibra te avisará cuando cada material esté listo.</Callout>
      </>}
      {page.selectedErrorMaterial && <MaterialErrorModal material={page.selectedErrorMaterial}
        subtopicName={names.get(page.selectedErrorMaterial.subtopicId) ?? ''} onClose={page.closeError} onReplace={page.replaceMaterial} />}
      {page.uploadForm && <UploadMaterialModal key={courseId} subtopics={page.subtopics} materials={page.materials}
        subtopicId={page.uploadForm.subtopicId} file={page.uploadForm.file} validationError={page.validationError}
        uploadError={page.uploadError} isUploading={page.isUploading} canSubmit={page.canSubmit}
        onSubtopicChange={page.selectSubtopic} onFileSelect={page.selectFile} onFileRemove={page.removeFile}
        onClose={page.closeUpload} onSubmit={() => void page.submit()} />}
    </div>
  )
}
