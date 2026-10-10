/**
 * Accessible legend content tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Legend } from '@/components/ui/Legend'

describe('Legend', () => {
  it('exposes an accessible label and all semantic meanings in order', () => {
    render(<Legend label="Mastery levels" items={[{ label: 'Low', tone: 'danger' }, { label: 'Medium', tone: 'warning' }, { label: 'High', tone: 'success' }, { label: 'No data', tone: 'neutral' }]} />)
    expect(within(screen.getByRole('list', { name: 'Mastery levels' })).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Low', 'Medium', 'High', 'No data'])
  })
})
