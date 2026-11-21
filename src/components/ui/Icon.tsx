/** Typed Lucide icon adapter used throughout the desktop interface.
 * @author Not specified
 * @packageDocumentation
 */
import type { ComponentType } from 'react'
import {
  Network, Plus, CirclePlus, ArrowLeft, ArrowDown, ArrowRight, ArrowUp, Sparkles, ChartColumn,
  Ban, Zap, Calendar, CircleX, Check, CircleCheck, ChevronLeft, ChevronRight, X, CloudUpload,
  CircleAlert, Trash2, FileText, Download, File, Pencil, PartyPopper,
  CalendarX, ChevronUp, ChevronDown, ClipboardCheck, Send, FolderOpen, Sigma, SquareFunction,
  Grid2X2, Users, CircleHelp, History, Hourglass, UserCheck, Info, Image, TrendingUp, Lightbulb,
  Lock, LogOut, Mail, Menu, SlidersHorizontal, EllipsisVertical, Bell, User, UserPlus, Target,
  GraduationCap, Shield, Gauge, Table, Hash, Terminal, Timer, ChevronsUpDown, Upload,
  ShieldCheck, Map, Presentation, IdCard, Eye, EyeOff, BookOpen, type LucideIcon, Clock, ListChecks, TrendingDown } from 'lucide-react'
import type { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'

/** Supported optical sizes. */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
/** A named icon or a custom vector accepted by action controls. */
export type ActionIcon = IconName | ComponentType<{ size?: IconSize; className?: string }>
/** Public icon properties, preserving the existing wrapper API. */
export interface IconProps {
  name: IconName
  size?: IconSize
  filled?: boolean
  label?: string
  className?: string
}
const ICONS: Record<IconName, LucideIcon> = {
  account_tree: Network, add: Plus, add_circle: CirclePlus, arrow_back: ArrowLeft,
  arrow_downward: ArrowDown, arrow_forward: ArrowRight, arrow_upward: ArrowUp,
  auto_awesome: Sparkles, bar_chart: ChartColumn, block: Ban, bolt: Zap, calendar_month: Calendar,
  cancel: CircleX, check: Check, clock: Clock, check_circle: CircleCheck, chevron_left: ChevronLeft,
  chevron_right: ChevronRight, close: X, cloud_upload: CloudUpload, danger: CircleAlert,
  delete: Trash2, description: FileText, download: Download, download_done: Download,
  draft: File, edit: Pencil, emoji_events: PartyPopper, error: CircleAlert, event_busy: CalendarX,
  expand_less: ChevronUp, expand_more: ChevronDown, fact_check: ClipboardCheck, forward_to_inbox: Send,
  folder_open: FolderOpen, functions: Sigma, gesture: SquareFunction, ghost: File, grid_on: Grid2X2,
  group: Users, help: CircleHelp, history: History, hourglass_empty: Hourglass, how_to_reg: UserCheck,
  info: Info, image: Image, insights: TrendingUp, lightbulb: Lightbulb, local_fire_department: Zap,
  lock: Lock, logout: LogOut, mail: Mail, menu: Menu, monitoring: ChartColumn, more_vert: EllipsisVertical,
  neutral: Info, notifications: Bell, park: Network, person: User, person_add: UserPlus,
  picture_as_pdf: FileText, priority_high: CircleAlert, psychology: Target, query_stats: ChartColumn,
  quiz: ListChecks, radio_button_unchecked: BookOpen, schedule: Hourglass, school: GraduationCap,
  send: Send, shield: Shield, sm: Info, speed: Gauge, success: CircleCheck, table_view: Table,
  tag: Hash, task_alt: CircleCheck, terminal: Terminal, timelapse: Hourglass, timer: Timer,
  tonal: SlidersHorizontal, trending_up: TrendingUp, trending_down: TrendingDown, tune: SlidersHorizontal, unfold_more: ChevronsUpDown,
  upload_file: Upload, upload: Upload, verified: ShieldCheck, warning: CircleAlert,
  workspace_premium: ShieldCheck, map: Map, presentation: Presentation, badge: IdCard, visibility: Eye, visibility_off: EyeOff,
}
const SIZES: Record<IconSize, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 22, '2xl': 28 }
/** Renders accessible, 2px-stroke SVG geometry without a font dependency. */
export function Icon({ name, size = 'md', label, className }: IconProps) {
  const Graphic = ICONS[name]
  return <Graphic size={SIZES[size]} strokeWidth={2} aria-hidden={label ? undefined : true}
    aria-label={label} role={label ? 'img' : undefined} className={cn('inline-flex shrink-0', className)} />
}
