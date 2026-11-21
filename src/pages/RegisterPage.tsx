/**
 * Teacher register page composition.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { AuthLayout } from '@/components/layout'
import { AuthForm } from '@/components/auth'
import { useRegister } from '@/hooks/useRegister'

/** Shows the teacher registration form using {@link useRegister} for state and actions. */
export function RegisterPage() {
  const form = useRegister()
  return (
    <AuthLayout
      title="Crea tu cuenta docente en Kalibra"
      description="Carga tu material por subtema, audita los ejercicios que genera la IA y detecta las brechas de dominio de tu grupo."
    >
      <AuthForm mode="register" {...form} />
    </AuthLayout>
  )
}
