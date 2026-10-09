
/**
 * Curricular material management page.
 *
 * @remarks
 * Displays curricular materials for the selected course
 * and supports simulated uploads and replacements.
 *
 * @packageDocumentation
 */

import { useMemo, useState } from 'react'
import { useParams } from 'react-router'

import {
    Button,
    Callout,
    EmptyState,
    LoadingState,
    PageHeader,
    StatCard,
} from '@/components/ui'

import {
    MaterialErrorModal,
    MaterialTable,
    UploadMaterialModal,
} from '@/components/curricular-material'

import { useCurricularMaterials } from '@/hooks/useCurricularMaterials'
import { useCourses } from '@/hooks/useCourses'
import { useToast } from '@/context/ToastContext'
import { SUBTOPICS } from '@/mocks/courses.mock'

import type { CurricularMaterial } from '@/types/curricularMaterial'

/**
 * Page for reviewing and uploading curricular material.
 */
export function CurricularMaterialPage() {
    const { courseId = '' } = useParams<{ courseId: string }>()

    const { courses } = useCourses()
    const { showToast } = useToast()

    const {
        materials,
        stats,
        isLoading,
        isUploading,
        error,
        uploadMaterial,
    } = useCurricularMaterials(courseId)

    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [selectedErrorMaterial, setSelectedErrorMaterial] =
        useState<CurricularMaterial | null>(null)
    const [replacingMaterial, setReplacingMaterial] =
        useState<CurricularMaterial | null>(null)

    const activeCourse = courses.find(
        (course) => course.id === courseId,
    )

    const subtopics = useMemo(
        () =>
            SUBTOPICS.filter(
                (subtopic) => subtopic.courseId === courseId,
            ),
        [courseId],
    )

    const hasMaterials = materials.length > 0

    const hasIngestionErrors = materials.some(
        (material) => material.status === 'error',
    )

    function openUploadModal() {
        setReplacingMaterial(null)
        setIsUploadOpen(true)
    }

    function closeUploadModal() {
        if (isUploading) return

        setIsUploadOpen(false)
        setReplacingMaterial(null)
    }

    function handleViewError(material: CurricularMaterial) {
        setSelectedErrorMaterial(material)
    }

    function handleReplaceMaterial(material: CurricularMaterial) {
        setSelectedErrorMaterial(null)
        setReplacingMaterial(material)
        setIsUploadOpen(true)
    }

    async function handleUpload(
        request: Parameters<typeof uploadMaterial>[0],
    ) {
        const uploadedMaterial = await uploadMaterial(request)

        showToast({
            title: 'Material cargado',
            message:
                `${uploadedMaterial.fileName} se encuentra pendiente de ingestión.`,
            icon: 'check_circle',
            tone: 'success',
        })

        return uploadedMaterial
    }

    return (
        <main className="flex flex-col gap-6">
            <PageHeader
                eyebrow={`MIS CURSOS > ${activeCourse?.name.toUpperCase() ?? 'CURSO'}`}
                title="Material curricular"
                description="Documentos que Kalibra procesa para anclar los ejercicios generados a lo que enseñas."
                actions={
                    <Button
                        label="Cargar material"
                        icon="upload_file"
                        onClick={openUploadModal}
                        disabled={!activeCourse}
                    />
                }
            />

            {isLoading ? (
                <LoadingState label="Cargando materiales curriculares..." />
            ) : error && !hasMaterials ? (
                <Callout icon="error" tone="danger">
                    {error}
                </Callout>
            ) : (
                <>
                    <section
                        aria-label="Resumen de materiales curriculares"
                        className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                        <StatCard
                            icon="description"
                            value={String(stats.total)}
                            label="Materiales cargados"
                        />

                        <StatCard
                            icon="check_circle"
                            tone="success"
                            value={String(stats.ready)}
                            label="Listos para generar"
                        />

                        <StatCard
                            icon="error"
                            tone="danger"
                            value={String(stats.error)}
                            label="Con error de ingestión"
                        />
                    </section>

                    {hasMaterials ? (
                        <MaterialTable
                            materials={materials}
                            subtopics={subtopics}
                            onViewError={handleViewError}
                        />
                    ) : (
                        <EmptyState
                            icon="description"
                            title="Aún no has cargado material"
                            description="Carga documentos de tus subtemas para que Kalibra pueda utilizarlos como referencia al generar ejercicios."
                            action={
                                <Button
                                    label="Cargar primer material"
                                    icon="upload_file"
                                    onClick={openUploadModal}
                                />
                            }
                        />
                    )}

                    {hasIngestionErrors && (
                        <Callout icon="error" tone="danger">
                            Uno o más materiales no pudieron procesarse.
                            Selecciona «Ver motivo» en la tabla para revisar
                            el error y reemplazar el archivo.
                        </Callout>
                    )}

                    <Callout icon="info" tone="info">
                        Formatos aceptados: PDF, PNG y JPG de hasta 20 MB.
                        Kalibra te avisará cuando cada material esté listo.
                    </Callout>

                    {error && (
                        <Callout icon="error" tone="danger">
                            {error}
                        </Callout>
                    )}
                </>
            )}

            <MaterialErrorModal
                isOpen={selectedErrorMaterial !== null}
                material={selectedErrorMaterial}
                onClose={() => setSelectedErrorMaterial(null)}
                onReplace={handleReplaceMaterial}
            />

            <UploadMaterialModal
                isOpen={isUploadOpen}
                courseId={courseId}
                subtopics={subtopics}
                materials={materials}
                isUploading={isUploading}
                replacingMaterial={replacingMaterial}
                onClose={closeUploadModal}
                onUpload={handleUpload}
            />
        </main>
    )
}
