/**
 * Keyboard and pointer interaction tests for the heatmap primitive.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HeatmapCell } from '@/components/ui/HeatmapCell'

describe('HeatmapCell', () => {
  it('opens the labeled measurement by keyboard', async () => {
    const onClick = vi.fn()
    render(<HeatmapCell value="70%" label="Open student progress" tone="success" onClick={onClick} />)
    expect(screen.getByRole('button', { name: 'Open student progress' })).toHaveTextContent('70%')
    await userEvent.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledOnce()
  })
  it('keeps an unmeasured cell actionable', async () => {
    const onClick = vi.fn()
    render(<HeatmapCell value="—" label="Student without data" tone="neutral" onClick={onClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Student without data' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
