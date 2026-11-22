/**
 * components/organic/Manuscript — the reading-tier primitives (law §3/§4/§6).
 *
 * Typography IS the interface: these are the ranked signals (scale · ink density ·
 * rubric) that organize information without boxes. All styling lives in
 * organic.css under .oc-* classes reading the var(--oc-*) tokens, so a component
 * carries no raw colours/sizes and field mode is a single class swap upstream.
 */

/**
 * Surface — the organic root. Establishes the role vars and, when field, swaps the
 * whole subtree to the warm-dark field-notebook ramp. Posture is passed in (never
 * read here) so the same component SSR-renders deterministically for a fixture.
 * @param {{ field?: boolean, posture?: string, as?: any, className?: string, children?: any }} props
 */
export function Surface({ field = false, posture, as: Tag = 'div', className = '', children, ...rest }) {
  const cls = ['oc-surface', field ? 'oc-field' : '', className].filter(Boolean).join(' ');
  return <Tag className={cls} data-posture={posture} {...rest}>{children}</Tag>;
}

/** Display heading — the period voice at 24px+ (size: 'xl'|'l'|'m'|'s'). */
export function Display({ size = 'l', as: Tag = 'h2', className = '', children, ...rest }) {
  return <Tag className={`oc-display oc-display--${size}${className ? ` ${className}` : ''}`} {...rest}>{children}</Tag>;
}

/** An uppercase micro-eyebrow (running-head / kicker). */
export function Eyebrow({ as: Tag = 'div', className = '', children, ...rest }) {
  return <Tag className={`oc-eyebrow${className ? ` ${className}` : ''}`} {...rest}>{children}</Tag>;
}

/**
 * Rubric — the interface speaking. `variant` ∈ RUBRIC_ROLES semantics:
 * 'sectionLabel' (default, uppercase apparatus), 'instruction' (a do-this, italic
 * serif), 'entryPoint' (the gold lead-in). Reserved accent — never decorative.
 * (The prop is `variant`, not `role`, so it is not mistaken for the ARIA attribute.)
 */
export function Rubric({ variant = 'sectionLabel', as: Tag = 'span', className = '', children, ...rest }) {
  const base = variant === 'instruction'
    ? 'oc-rubric oc-rubric--instruction'
    : variant === 'entryPoint'
      ? 'oc-rubric oc-entry'
      : 'oc-rubric';
  return <Tag className={`${base}${className ? ` ${className}` : ''}`} {...rest}>{children}</Tag>;
}

/** Prose — the reading column on a 45–90ch measure. `dropcap` illuminates the
 *  opening initial (at most one per view). `wide` opts into the ~82ch measure. */
export function Prose({ dropcap = false, wide = false, as: Tag = 'div', className = '', children, ...rest }) {
  const cls = ['oc-prose', wide ? 'oc-prose--wide' : '', dropcap ? 'oc-dropcap' : '', className].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}

/** Ink — a tonal-ramp text span (tone: 'ink'|'strong'|'body'|'secondary'). */
export function Ink({ tone = 'body', as: Tag = 'span', className = '', children, ...rest }) {
  const base = tone === 'ink' ? 'oc-ink' : `oc-ink-${tone}`;
  return <Tag className={`${base}${className ? ` ${className}` : ''}`} {...rest}>{children}</Tag>;
}
