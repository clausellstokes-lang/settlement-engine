import { ruleSvg, RULE_FALLBACK_SPACE } from '../../design/organic/rules.js';

/**
 * components/organic/Rule — a graded rule from the manuscript vocabulary (law §3).
 *
 * variant carries meaning: hairline = subdivision · single = section close ·
 * double = total/finality · swelled = hiatus/scene-break. The mark is pre-baked
 * static SVG (rules.js) and always decorative (aria-hidden). Every structural mark
 * degrades to pure whitespace: pass `asSpace` to render the variant's collapse gap
 * instead of the line (the pilcrow→indent lesson) — the narrow/dense fallback.
 *
 * @param {{ variant?: 'hairline'|'single'|'double'|'swelled', ink?: string, asSpace?: boolean }} props
 */
export default function Rule({ variant = 'single', ink, asSpace = false }) {
  if (asSpace) {
    return <div aria-hidden="true" style={{ height: RULE_FALLBACK_SPACE[variant] }} />;
  }
  return (
    <div
      className={`oc-rule oc-rule--${variant}`}
      aria-hidden="true"
      // Pre-baked, author-controlled SVG string (no user input) — the idiomatic
      // way to mount a static inline SVG (townMapThumb precedent).
      dangerouslySetInnerHTML={{ __html: ruleSvg(variant, ink ? { ink } : undefined) }}
    />
  );
}
