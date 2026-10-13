/**
 * Tests active upload choices and the first-material naming warning.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SUBTOPICS } from '@/test/uiFixtures'
import { UploadMaterialModal, type UploadMaterialModalProps } from './UploadMaterialModal'

const warning = 'Al cargar material, el nombre de este subtema quedará fijo para no afectar los ejercicios ni el progreso de tus estudiantes.'
function props(): UploadMaterialModalProps {
  return { subtopics: [SUBTOPICS[0], SUBTOPICS[3], { ...SUBTOPICS[1], status: 'ARCHIVED' }], materials: [], subtopicId: 'sub-4', file: null,
    validationError: null, uploadError: null, isUploading: false, canSubmit: false,
    onSubtopicChange: vi.fn(), onFileSelect: vi.fn(), onFileRemove: vi.fn(), onClose: vi.fn(), onSubmit: vi.fn() }
}

describe('UploadMaterialModal', () => {
  it('warns only for an unlocked selected subtopic', () => {
    const input = props()
    const { rerender } = render(<UploadMaterialModal {...input} />)
    expect(screen.getByText(warning)).toBeInTheDocument()
    rerender(<UploadMaterialModal {...input} subtopicId="sub-1" />)
    expect(screen.queryByText(warning)).not.toBeInTheDocument()
  })
  it('omits archived options and blocks submission when the selection is archived', async () => {
    const input = props()
    const { rerender } = render(<UploadMaterialModal {...input} />)
    await userEvent.click(screen.getByRole('button', { name: 'Subtema' }))
    expect(screen.getByRole('option', { name: /Grafos y Caminos Mínimos/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Árboles Binarios/ })).not.toBeInTheDocument()
    rerender(<UploadMaterialModal {...input} subtopicId="sub-2" canSubmit />)
    expect(screen.getByRole('button', { name: 'Subir material' })).toBeDisabled()
  })
})
