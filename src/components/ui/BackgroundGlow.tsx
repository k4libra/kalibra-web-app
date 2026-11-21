/** Decorative lavender and mint glow shared by all desktop screens.
 * @author Not specified
 * @packageDocumentation
 */
/** Places the approved background artwork behind page content. */
export function BackgroundGlow() {
  return <div aria-hidden className="background-glow pointer-events-none absolute top-0 left-0 -z-10 h-[600px] w-full lg:left-66 lg:w-[calc(100%-264px)]" />
}
