/**
 * Generated exercises service used by the hooks.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { exercisesMock } from '@/mocks/exercises.mock'
import type { ExercisesContract } from './exercises.contract'

/**
 * Reads the generated exercises and requests new ones.
 *
 * @remarks
 * Points to the simulated implementation until the backend integration is built.
 */
export const exercisesService: ExercisesContract = exercisesMock
