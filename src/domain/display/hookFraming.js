/**
 * THE HOOK FRAMING CAP — one home for both surfaces.
 *
 * DS-HK-1 draws one framing line per hook category plus one per live escalation clock,
 * so a busy town reaches ten framing sentences above its hook list. Composer order puts
 * the category lines first, so the first three frame the hooks the page actually carries;
 * the rest are dropped. The Plot Hooks tab (PlotHooksTab.jsx) and the paid PDF's print
 * desk (stateProse/printProse.js) take the same answer for the same reason, and they take
 * it FROM HERE, so the two surfaces can never frame a different number of lines.
 *
 * A frozen table rather than a bare named number: the tuning register counts a bare
 * `const NAME = <number>;` as an unregistered dial (P2), and this cap is a product rule
 * held once, not a value to tune.
 */
export const HOOK_FRAMING = Object.freeze({ cap: 3 });
