import { emblem, emblemForKind, cartouche, compassRose } from '../../design/organic/ornament/compose.js';

/**
 * components/organic/Ornament — the seeded-ornament React surface (law §5).
 *
 * Thin wrappers over the pure SVG builders (design/organic/ornament/compose.js).
 * The SVG is always decorative (aria-hidden, non-interactive); anything a reader
 * must perceive — a settlement's NAME inside a cartouche — is real HTML the caller
 * passes as children (the decorative/functional split), so it stays in the
 * accessibility tree and the reading order.
 */

/** A single house emblem. Pass `kind` for the meaning-bearing mark, or `seed`
 *  for a seeded choice. */
export function Emblem({ kind, seed, mode = 'light', size = 48 }) {
  const svg = kind ? emblemForKind(kind, { seed, mode, size }) : emblem(seed ?? 'emblem', { mode, size });
  return <span className="oc-ornament" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** THE house compass rose — the one canonical signature. */
export function CompassRose({ mode = 'light', size = 64 }) {
  return <span className="oc-ornament" aria-hidden="true" dangerouslySetInnerHTML={{ __html: compassRose({ mode, size }) }} />;
}

/**
 * SeededCartouche — a rare, meaningful nameplate framing its children. The frame
 * is seeded, decorative SVG behind the content; the children (the NAME) are HTML
 * on top, centred, and remain the accessible label. Parametric size.
 */
export function SeededCartouche({ seed, mode = 'light', width = 320, height = 96, children }) {
  const svg = cartouche(seed, { mode, width, height });
  return (
    <span className="oc-cartouche" style={{ position: 'relative', display: 'inline-block', width, height }}>
      <span
        className="oc-ornament"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0 }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <span
        className="oc-cartouche__label"
        // The left device medallion occupies ~19% of the width; pad the name past
        // it so the label centres in the remaining plate.
        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', textAlign: 'center', padding: '0 8% 0 22%', boxSizing: 'border-box' }}
      >
        {children}
      </span>
    </span>
  );
}

export default Emblem;
