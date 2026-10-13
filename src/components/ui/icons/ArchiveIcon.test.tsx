/**
 * Tests inline storage-box SVG rendering in both action control types.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ActionMenu, IconButton } from '@/components/ui'
import { ArchiveIcon, UnarchiveIcon } from './index'

describe('storage-box icons', () => {
  it.each([ArchiveIcon, UnarchiveIcon])('renders a decorative inline line-art SVG', (Graphic) => {
    const { container } = render(<Graphic size="lg" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveAttribute('stroke-linejoin', 'round')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('img')).toBeNull()
  })

  it('supports SVGs in menu items and row actions without font ligatures', async () => {
    render(<><ActionMenu label="Acciones" items={[{ id: 'archive', label: 'Archivar', icon: ArchiveIcon, onSelect: vi.fn() }]} />
      <IconButton icon={UnarchiveIcon} label="Desarchivar" /></>)
    await userEvent.click(screen.getByRole('button', { name: 'Acciones' }))
    expect(screen.getByRole('menuitem', { name: 'Archivar' }).querySelector('svg')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Desarchivar' }).querySelector('svg')).not.toBeNull()
    expect(screen.queryByText(/pause|play_arrow/)).not.toBeInTheDocument()
  })
})
