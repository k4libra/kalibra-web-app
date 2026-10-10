/**
 * Authentication adapter selected for the UI demo.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { AuthServiceContract } from '@/services/auth.contract'
import { authMock } from '@/mocks/auth.mock'

/** Supplies the authentication contract through the simulated adapter. */
export const authService: AuthServiceContract = authMock
