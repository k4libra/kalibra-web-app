/**
 * Teacher login page composition.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { AuthLayout } from '@/components/layout'
import { AuthForm } from '@/components/auth'
import { useLogin } from '@/hooks/useLogin'

/** Shows the teacher sign-in form using {@link useLogin} for state and actions. */
export function LoginPage() {
  const form = useLogin()
  return (
    <AuthLayout
      title="Bienvenido de vuelta a tu panel docente"
      description="Retoma el seguimiento de tus cursos: material curricular, ejercicios verificados y brechas de dominio de tu grupo."
    >
      <AuthForm mode="login" {...form} />
    </AuthLayout>
  )
}
