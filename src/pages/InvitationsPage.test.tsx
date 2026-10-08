/**
 * Tests for the invitations page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ToastProvider } from '@/context/ToastContext'
import { InvitationsPage } from './InvitationsPage'

function renderPage() {
  const router = createMemoryRouter([{ path: '/invitaciones', element: <InvitationsPage /> }], { initialEntries: ['/invitaciones'] })
  return render(
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>,
  )
}

describe('InvitationsPage', () => {
  it('explains that an email without account receives nothing', async () => {
    renderPage()
    await userEvent.click(await screen.findByRole('button', { name: 'Invitar estudiante' }))
    const dialog = screen.getByRole('dialog', { name: 'Invitar estudiante' })
    await userEvent.type(within(dialog).getByLabelText('Correo institucional del estudiante'), 'nobody@gmail.com')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Enviar invitación' }))
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('no tiene una cuenta')
  })

  it('asks for confirmation before cancelling a pending invitation', async () => {
    renderPage()
    await userEvent.click(await screen.findByRole('button', { name: 'Cancelar' }))
    expect(screen.getByRole('dialog', { name: '¿Cancelar la invitación?' })).toBeInTheDocument()
  })
})
