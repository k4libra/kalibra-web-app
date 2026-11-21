/**
 * Tests for accessible native file selection, removal and drop behavior.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FileDropzone, type FileDropzoneProps } from '@/components/ui/FileDropzone'

function props(overrides: Partial<FileDropzoneProps> = {}): FileDropzoneProps {
  return { title: 'Arrastra tu archivo aquí', description: 'PDF', label: 'Archivo', selectLabel: 'Seleccionar archivo', accept: '.pdf,.png,.jpg', state: 'empty', onSelect: vi.fn(), onRemove: vi.fn(), ...overrides }
}

describe('FileDropzone', () => {
  it('opens the native picker and allows selecting the same file again', async () => {
    const controls = props()
    render(<FileDropzone {...controls} />)
    const input = screen.getByLabelText('Archivo') as HTMLInputElement
    const click = vi.spyOn(input, 'click')
    await userEvent.click(screen.getByRole('button', { name: 'Seleccionar archivo' }))
    expect(click).toHaveBeenCalledOnce()
    const file = new File(['pdf'], 'notes.pdf', { type: 'application/pdf' })
    await userEvent.upload(input, file)
    await userEvent.upload(input, file)
    expect(controls.onSelect).toHaveBeenCalledTimes(2)
    expect(input.value).toBe('')
  })

  it('shows valid metadata and emits the remove action', async () => {
    const controls = props({ state: 'valid', fileName: 'notes.pdf', fileDescription: 'PDF · 1 KB', title: 'Archivo listo para subir' })
    render(<FileDropzone {...controls} />)
    expect(screen.getByText('Válido')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Seleccionar archivo' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Quitar archivo' }))
    expect(controls.onRemove).toHaveBeenCalledOnce()
  })

  it('shows an invalid selection and the recovery action', () => {
    render(<FileDropzone {...props({ state: 'invalid', fileName: 'notes.docx', selectLabel: 'Seleccionar otro archivo' })} />)
    expect(screen.getByText('No soportado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Seleccionar otro archivo' })).toBeEnabled()
  })

  it('keeps the picker available for replacement selections', () => {
    render(<FileDropzone {...props({ state: 'valid', fileName: 'replacement.pdf', selectionLayout: 'picker' })} />)
    expect(screen.getByRole('button', { name: 'Seleccionar archivo' })).toBeEnabled()
    expect(screen.getByText('Válido')).toBeInTheDocument()
  })

  it('reports a dropped file and blocks drops while disabled', () => {
    const controls = props()
    const { rerender } = render(<FileDropzone {...controls} />)
    const file = new File(['image'], 'notes.png')
    fireEvent.drop(screen.getByText('Arrastra tu archivo aquí'), { dataTransfer: { files: [file] } })
    expect(controls.onSelect).toHaveBeenCalledWith(file)
    rerender(<FileDropzone {...controls} disabled />)
    fireEvent.drop(screen.getByText('Arrastra tu archivo aquí'), { dataTransfer: { files: [file] } })
    expect(controls.onSelect).toHaveBeenCalledOnce()
    expect(screen.getByLabelText('Archivo')).toBeDisabled()
  })
})
