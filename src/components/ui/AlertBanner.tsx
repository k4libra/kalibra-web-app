/** Dismissible authentication and operation error notice.
 * @author Not specified
 * @packageDocumentation
 */
import { IconBox } from './IconBox'
import { IconButton } from './IconButton'
/** Preserves form values while the caller dismisses the notice. */
export function AlertBanner({ title, children, onDismiss }: { title: string; children?: React.ReactNode; onDismiss?: () => void }) {
  return <div role="alert" className="flex items-start gap-3 rounded-lg bg-danger-container p-3.5 text-danger-strong">
    <IconBox icon="error" tone="danger" size="sm" className="bg-white" /><div className="min-w-0 flex-1"><p className="text-label-l">{title}</p>{children && <div className="mt-1 text-body-m">{children}</div>}</div>
    {onDismiss && <IconButton variant="plain" size="xs" icon="close" label="Descartar aviso" onClick={onDismiss} className="size-5 bg-transparent text-danger-strong shadow-none" />}
  </div>
}
