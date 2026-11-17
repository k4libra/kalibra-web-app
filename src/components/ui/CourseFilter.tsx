/** Local course filter over already-loaded groups; no additional requests.
 * @author Not specified
 * @packageDocumentation
 */
import { cn } from '@/utils/cn'
/** Displays the course tabs with actual group counts. */
export function CourseFilter({ courses, value, onChange }: { courses: { id: string; name: string; count: number }[]; value: string; onChange: (id: string) => void }) {
  const options = [{ id: '', name: 'Todos los cursos', count: courses.reduce((sum, course) => sum + course.count, 0) }, ...courses]
  return <div role="group" aria-label="Filtrar por curso" className="flex w-fit max-w-full flex-wrap gap-1 rounded-full bg-white p-1 shadow-card">
    {options.map((option) => <button key={option.id} type="button" aria-pressed={value === option.id} onClick={() => onChange(option.id)}
      className={cn('flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.75 text-label-l', value === option.id ? 'bg-primary text-white' : 'text-content-secondary hover:bg-primary-subtle')}>
      {option.name}{' '}<span className={cn('rounded-full px-1.5 text-label-s', value === option.id ? 'bg-white/20 text-white' : 'bg-primary-subtle text-primary')}>{option.count}</span>
    </button>)}
  </div>
}
