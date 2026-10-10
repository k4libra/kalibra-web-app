/**
 * Dismissible callout interaction tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Callout } from '@/components/ui/Callout'

describe('Callout', () => {
  it('announces a failure and emits dismissal without changing content', async () => {
    const onDismiss = vi.fn()
    render(
      <Callout icon="error" tone="danger" onDismiss={onDismiss}>
        Revisa tus datos.
      </Callout>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Revisa tus datos.')
    await userEvent.click(screen.getByRole('button', { name: 'Descartar aviso' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
