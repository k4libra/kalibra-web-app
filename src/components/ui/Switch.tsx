/** Accessible controlled switch with the approved vector geometry.
 * @author Not specified
 * @packageDocumentation
 */
import onUrl from '@/assets/switch-on.svg'
import offUrl from '@/assets/switch-off.svg'
/** Emits changes to its owning form without persisting independent state. */
export function Switch({ checked, onChange, label, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; label: string; disabled?: boolean }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled}
    onClick={() => onChange(!checked)} className="h-7 w-12 shrink-0 cursor-pointer rounded-full disabled:cursor-not-allowed disabled:opacity-50">
    <img src={checked ? onUrl : offUrl} alt="" width={48} height={28} />
  </button>
}
