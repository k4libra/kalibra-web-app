/**
 * Authentication layout branding and form-slot composition tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthLayout } from '@/components/layout/AuthLayout'

describe('AuthLayout', () => {
  it('renders the branded teacher introduction and the supplied form content', () => {
    render(
      <AuthLayout title="Teacher access" description="Manage your courses.">
        <p>Form content</p>
      </AuthLayout>,
    )
    expect(screen.getByRole('heading', { name: 'Teacher access' })).toBeInTheDocument()
    expect(screen.getByText('Form content')).toBeInTheDocument()
    expect(screen.getByText('Material curricular por subtema')).toBeInTheDocument()
    expect(screen.getByText('Tus datos académicos están protegidos')).toBeInTheDocument()
  })
})
