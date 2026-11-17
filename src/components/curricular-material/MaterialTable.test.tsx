/** Tests file metadata from the shared HTTP contract in the material table.
 * @packageDocumentation
 */
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MaterialTable } from './MaterialTable'
import { curricularMaterialService } from '@/services/curricularMaterial.service'
import { apiStub } from '@/test/apiStub'
import { SUBTOPICS } from '@/test/uiFixtures'

describe('MaterialTable metadata', () => {
  it.each([
    { sizeBytes: Math.round(2.4 * 1024 * 1024), pageCount: 18, label: 'PDF · 2,4 MB · 18 páginas' },
    { sizeBytes: null, pageCount: 1, label: 'PDF · 1 página' },
    { sizeBytes: null, pageCount: null, label: 'PDF' },
  ])('renders $label without fabricating missing data', async ({ sizeBytes, pageCount, label }) => {
    apiStub.respond('/courses/course-1/curricular-materials', 200, {
      content: [{ id: 'material', courseId: 'course-1', subtopicIds: ['sub-1'], fileName: 'notes.pdf', format: 'PDF', status: 'READY', failureReason: null, uploadedAt: '2026-10-10', sizeBytes, pageCount }],
      page: 0, size: 20, totalElements: 1, totalPages: 1,
    })
    const materials = await curricularMaterialService.getByCourse('course-1')
    render(<MaterialTable materials={materials} subtopics={SUBTOPICS} onViewError={vi.fn()} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
