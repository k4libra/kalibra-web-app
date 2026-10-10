/**
 * Teacher authentication form composed from shared primitives.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { Button, Callout, Icon, TextField } from '@/components/ui'
import type { AuthFieldErrors, AuthFormValues } from '@/types/auth'

/** Props accepted by {@link AuthForm}. */
export interface AuthFormProps {
  /** Authentication flow presented by the form. */
  mode: 'login' | 'register'
  /** Current field values owned by the use-case hook. */
  values: AuthFormValues
  /** Field validation messages. */
  errors: AuthFieldErrors
  /** Whether submission is in progress. */
  isSubmitting: boolean
  /** Service failure shown as a notice. */
  error: string | null
  /** Whether the email belongs to an existing account. */
  isDuplicateEmail?: boolean
  /** Called when any field changes. */
  onChange: (field: keyof AuthFormValues, value: string) => void
  /** Called when the form is submitted. */
  onSubmit: () => void
  /** Dismisses the sign-in failure without clearing entered values. */
  onDismiss: () => void
  /** Opens the alternate authentication route. */
  onAlternate: () => void
  /** Resets the duplicate email and returns to editable registration. */
  onUseAnotherEmail?: () => void
}

/** Renders the teacher authentication controls and emits validation recovery actions. */
export function AuthForm({
  mode,
  values,
  errors,
  isSubmitting,
  error,
  isDuplicateEmail = false,
  onChange,
  onSubmit,
  onDismiss,
  onAlternate,
  onUseAnotherEmail,
}: AuthFormProps) {
  const isRegister = mode === 'register'
  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-12 items-center justify-center gap-2 rounded-md border-4 border-primary-container bg-primary-strong text-label-l text-content-on-primary">
        <Icon name="badge" />
        Docente
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-headline-l">{isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</h2>
        <p className="text-body-l text-content-secondary">
          {isRegister ? 'Regístrate' : 'Accede'} con tu correo institucional para administrar tus cursos.
        </p>
      </div>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (!isSubmitting) {
            if (isDuplicateEmail) onAlternate()
            else onSubmit()
          }
        }}
        className="flex flex-col gap-4"
      >
        {error && !isDuplicateEmail && (
          <Callout icon="error" tone="danger" onDismiss={isRegister ? undefined : onDismiss}>
            <p className="text-label-l">{error}</p>
            {!isRegister && <p className="mt-1 text-body-m">Revisa tus datos e inténtalo nuevamente.</p>}
          </Callout>
        )}
        {isRegister && (
          <TextField
            label="Nombre completo"
            name="name"
            autoComplete="name"
            icon="person"
            appearance="card"
            value={values.fullName}
            onChange={(value) => onChange('fullName', value)}
            placeholder="Ingresa tu nombre completo"
            disabled={isSubmitting}
            status={errors.fullName ? 'error' : 'default'}
            description={errors.fullName}
            showStatusIcon={false}
          />
        )}
        <TextField
          label="Correo institucional"
          labelHint="Dominio .edu"
          name="email"
          autoComplete="email"
          type="email"
          icon="mail"
          appearance="card"
          value={values.email}
          onChange={(value) => onChange('email', value)}
          placeholder="nombre@institucion.edu.pe"
          disabled={isSubmitting}
          status={errors.email || isDuplicateEmail ? 'error' : 'default'}
          showStatusIcon={false}
          description={
            isDuplicateEmail ? (
              <Callout icon="error" tone="danger" size="sm">
                <span className="text-body-m-bold">{error}</span>
              </Callout>
            ) : (
              errors.email
            )
          }
        />
        <TextField
          label="Contraseña"
          name="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          type="password"
          icon="lock"
          appearance="card"
          value={values.password}
          onChange={(value) => onChange('password', value)}
          placeholder="Ingresa tu contraseña"
          disabled={isSubmitting}
          status={errors.password ? 'error' : 'default'}
          description={
            errors.password ??
            (isRegister ? (
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1">
                  <Icon name="info" size="sm" />
                  Mínimo 8 caracteres
                </span>
                <span className="text-label-s text-content-muted">Usa letras y números</span>
              </span>
            ) : undefined)
          }
        />
        <Button
          type="submit"
          label={isSubmitting ? 'Procesando...' : isRegister && !isDuplicateEmail ? 'Crear cuenta' : 'Iniciar sesión'}
          icon="arrow_forward"
          iconPosition="end"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          className="shadow-raised"
        />
        {isDuplicateEmail && <Button label="Usar otro correo" variant="ghost" size="sm" onClick={onUseAnotherEmail} />}
      </form>
      <div className="flex flex-wrap items-center justify-center text-body-l text-content-secondary">
        <span>{isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}</span>
        <Button
          variant="ghost"
          size="sm"
          label={isRegister ? 'Iniciar sesión' : 'Regístrate'}
          onClick={onAlternate}
          className="px-1"
        />
      </div>
    </div>
  )
}
