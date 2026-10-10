/**
 * Test setup: registers the DOM matchers used by every test file.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { installApiStub } from '@/test/apiStub'

beforeEach(() => {
  vi.restoreAllMocks()
  installApiStub()
  URL.createObjectURL = vi.fn(() => 'blob:test-download')
  URL.revokeObjectURL = vi.fn()
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
})

// Vitest runs without globals, so Testing Library cannot register its automatic cleanup.
afterEach(() => cleanup())
