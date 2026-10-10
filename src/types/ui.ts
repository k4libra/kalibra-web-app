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
 * Height presets of a button: `lg` is 52 px, `md` is 44 px and `sm` is 32 px.
 */
export type ButtonSize = 'lg' | 'md' | 'sm'

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
  | 'bolt'
  | 'calendar_month'
  | 'cancel'
  | 'check'
  | 'check_circle'
  | 'chevron_left'
  | 'chevron_right'
  | 'close'
  | 'danger'
  | 'description'
  | 'download'
  | 'download_done'
  | 'draft'
  | 'edit'
  | 'emoji_events'
  | 'error'
  | 'event_busy'
  | 'expand_less'
  | 'expand_more'
  | 'fact_check'
  | 'forward_to_inbox'
  | 'functions'
  | 'gesture'
  | 'ghost'
  | 'grid_on'
  | 'group'
  | 'help'
  | 'history'
  | 'hourglass_empty'
  | 'how_to_reg'
  | 'info'
  | 'insights'
  | 'lightbulb'
  | 'local_fire_department'
  | 'lock'
  | 'logout'
  | 'mail'
  | 'menu'
  | 'monitoring'
  | 'neutral'
  | 'notifications'
  | 'park'
  | 'pause'
  | 'person'
  | 'person_add'
  | 'play_arrow'
  | 'priority_high'
  | 'psychology'
  | 'query_stats'
  | 'quiz'
  | 'radio_button_unchecked'
  | 'schedule'
  | 'school'
  | 'send'
  | 'shield'
  | 'sm'
  | 'speed'
  | 'success'
  | 'table_view'
  | 'tag'
  | 'task_alt'
  | 'terminal'
  | 'timelapse'
  | 'timer'
  | 'tonal'
  | 'trending_up'
  | 'tune'
  | 'unfold_more'
  | 'upload_file'
  | 'verified'
  | 'warning'
  | 'workspace_premium'
  | 'badge'
  | 'visibility'
  | 'visibility_off'
