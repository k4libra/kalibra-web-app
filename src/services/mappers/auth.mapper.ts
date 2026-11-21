/**
 * Maps real account profiles to public UI models.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { UserDto } from '@/types/api'
import type { AuthResponse } from '@/types/auth'
import type { Teacher } from '@/types/course'
/** Uses supplied names, falling back to the actual email when names are unavailable. */
export function profileName(user: { email: string; firstName?: string; lastName?: string }): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email
}
/** Derives avatar initials from a supplied display name. */
export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}
/** Selects the strongest web role without fabricating a teacher role. */
export function mapUser(dto: UserDto): AuthResponse {
  const role = dto.roles.includes('ADMINISTRATOR') ? 'ADMINISTRATOR' : dto.roles.includes('TEACHER') ? 'TEACHER' : dto.roles.includes('STUDENT') ? 'STUDENT' : 'REGISTERED_USER'
  return { user: { id: dto.id, email: dto.email, firstName: dto.firstName ?? '', lastName: dto.lastName ?? '', role } }
}
/** Maps a public account to the existing sidebar profile. */
export function mapTeacher(dto: UserDto): Teacher {
  const fullName = profileName(dto)
  return { fullName, firstName: dto.firstName || fullName, email: dto.email, initials: initials(fullName) }
}
