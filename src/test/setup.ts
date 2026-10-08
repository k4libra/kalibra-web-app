/**
 * Test setup: registers the DOM matchers used by every test file.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest runs without globals, so Testing Library cannot register its automatic cleanup.
afterEach(() => cleanup())
