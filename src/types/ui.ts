/**
 * Variant and icon types shared by the design-system primitives.
 *
 * @remarks
 * Same content as `src/types/ui.ts` in kalibra-mobile-app so both platforms expose the same API.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Visual styles available for a button.
 *
 * @remarks
 * - `primary`: main action of the view (filled indigo).
 * - `tonal`: secondary action on a soft indigo container.
 * - `neutral`: dismissive action such as Cancel or Close.
 * - `danger`: confirmed destructive action.
 * - `danger-soft`: destructive entry point that still asks for confirmation.
 * - `ghost`: text-only action without container.
 */
export type ButtonVariant = 'primary' | 'tonal' | 'neutral' | 'danger' | 'danger-soft' | 'ghost'

/**
 * Height presets of a button: `md` is 44 px and `sm` is 32 px.
 */
export type ButtonSize = 'md' | 'sm'

/**
 * Semantic color families used by chips, icon boxes, callouts and progress bars.
 *
 * @remarks
 * - `primary`: brand indigo, the default.
 * - `success`: positive state (ready, approved, accepted).
 * - `warning`: attention state (pending, medium mastery).
 * - `danger`: error or negative state (rejected, expired, low mastery).
 * - `neutral`: informative state without judgement (no material, no data).
 */
export type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

/**
 * Material Symbols Rounded ligatures used by the product.
 *
 * @remarks
 * Add a name here before using a new icon so every call site stays typed.
 */
export type IconName =
  | 'account_tree'
  | 'add'
  | 'add_circle'
  | 'arrow_back'
  | 'arrow_downward'
  | 'arrow_forward'
  | 'arrow_upward'
  | 'auto_awesome'
  | 'bar_chart'
  | 'block'
  | 'calendar_month'
  | 'cancel'
  | 'check'
  | 'check_circle'
  | 'chevron_right'
  | 'close'
  | 'description'
  | 'download'
  | 'download_done'
  | 'draft'
  | 'edit'
  | 'error'
  | 'event_busy'
  | 'expand_less'
  | 'expand_more'
  | 'fact_check'
  | 'forward_to_inbox'
  | 'functions'
  | 'group'
  | 'help'
  | 'history'
  | 'hourglass_empty'
  | 'how_to_reg'
  | 'info'
  | 'insights'
  | 'lightbulb'
  | 'lock'
  | 'logout'
  | 'mail'
  | 'menu'
  | 'notifications'
  | 'person'
  | 'person_add'
  | 'priority_high'
  | 'query_stats'
  | 'quiz'
  | 'schedule'
  | 'school'
  | 'send'
  | 'shield'
  | 'table_view'
  | 'tag'
  | 'task_alt'
  | 'timer'
  | 'trending_up'
  | 'unfold_more'
  | 'upload_file'
  | 'verified'
