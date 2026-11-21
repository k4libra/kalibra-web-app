/**
 * Resolves the landing route for each web role.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { UserRole } from '@/types/auth'
/** Resolves a web account landing route from its actual role. */
export function sessionHome(role: UserRole): string {
  return role === 'ADMINISTRATOR' ? '/admin/panel' : role === 'TEACHER' ? '/cursos' : '/iniciar-sesion'
}
