/**
 * Tests for shared material status and contextual processing presentation.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MaterialStatusChip } from '@/components/ui/MaterialStatusChip'

describe('MaterialStatusChip', () => {
  it('preserves the accepted processing copy outside the material table', () => {
    render(<MaterialStatusChip status="processing" />)
    expect(screen.getByText('En ingestión')).toBeInTheDocument()
  })

  it('uses contextual copy only for processing records', () => {
    const { rerender } = render(<MaterialStatusChip status="processing" processingLabel="Pendiente" processingIcon="hourglass_empty" />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    rerender(<MaterialStatusChip status="error" processingLabel="Pendiente" />)
    expect(screen.getByText('Error de ingestión')).toBeInTheDocument()
  })
})
