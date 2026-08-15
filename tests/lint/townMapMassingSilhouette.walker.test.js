/**
 * tests/lint/townMapMassingSilhouette.walker.test.js — THE SILHOUETTE TOTALITY WALKER
 * (Tranche M, M-0; the INSTITUTION SILHOUETTE LAW).
 *
 * The massing substrate lifts every named glyph kind to a composite 3D silhouette so an
 * institution is RECOGNIZABLE ("a cathedral needs to look like a cathedral"). This walker pins
 * the totality of that map STRUCTURALLY: every kind in the LIVE glyph vocabulary
 * (design/townGlyphs/medieval.js — the kinds glyphAssign resolves buildings to) must have an
 * EXPLICIT silhouette spec in massing.SILHOUETTE_BY_KIND (a composite, or an explicit generic
 * default). A new glyph kind that lands without a spec REDS here (deposit-and-consume) rather
 * than silently falling to a wrong generic shape on the map. It also pins each spec well-formed:
 * every component roof is a real ROOF_FORM, every component is inscribed WITHIN the footprint (a
 * cathedral never sprawls past its ground claim), and every feature targets a real component.
 *
 * E-A: its removing power is proven by scripts/mutation-sweep.sh (label
 * "massing/silhouette totality unmapped kind" — a planted glyph kind with no spec must red this).
 *
 * TO COMPLY when this reds: a new glyph kind needs a SILHOUETTE_BY_KIND entry (a composite for a
 * signature institution, or map it to the generic commons form explicitly) — never a silent gap.
 */
import { describe, expect, test } from 'vitest';
import { MEDIEVAL_GLYPHS } from '../../src/design/townGlyphs/medieval.js';
import { SILHOUETTE_BY_KIND, ROOF_FORMS } from '../../src/domain/townMap/massing.js';

const LIVE_KINDS = Object.keys(MEDIEVAL_GLYPHS);
const ROOF_SET = new Set(ROOF_FORMS);
const FEATURE_TYPES = new Set(['cross', 'wheel', 'smoke', 'sign', 'jetty']);
const EPS = 1e-9;

describe('massing silhouette totality (the institution silhouette law)', () => {
  test('guard-the-guard: the live vocabulary and the form set are not vacuous', () => {
    // The medieval library ships 27 kinds today; the roof-form set is the fixed five. If either
    // silently emptied, the totality assertion below would pass on nothing.
    expect(LIVE_KINDS.length).toBeGreaterThanOrEqual(27);
    expect(ROOF_SET.size).toBe(5);
  });

  test('TOTALITY: every live glyph kind has an explicit silhouette spec', () => {
    const unmapped = LIVE_KINDS.filter((k) => !(k in SILHOUETTE_BY_KIND));
    expect(
      unmapped,
      `\nGlyph kind(s) with NO massing silhouette spec. For each: add a SILHOUETTE_BY_KIND entry in `
      + `src/domain/townMap/massing.js — a composite form for a signature institution, or map it to `
      + `the generic commons form explicitly. A missing spec falls to a wrong generic shape on the `
      + `dimensional map:\n${unmapped.join('\n')}\n`,
    ).toEqual([]);
  });

  test('no stale specs: every silhouette key is a live glyph kind', () => {
    const live = new Set(LIVE_KINDS);
    const stale = Object.keys(SILHOUETTE_BY_KIND).filter((k) => !live.has(k));
    expect(stale, `silhouette specs for glyph kinds no longer in the library — remove them:\n${stale.join('\n')}`).toEqual([]);
  });

  test('every spec is well-formed: non-empty, real roofs, inscribed footprint, valid features', () => {
    const problems = [];
    for (const [kind, spec] of Object.entries(SILHOUETTE_BY_KIND)) {
      if (!Array.isArray(spec.parts) || spec.parts.length === 0) { problems.push(`${kind}: no parts`); continue; }
      if (!(spec.foot > 0)) problems.push(`${kind}: foot scale must be > 0`);
      spec.parts.forEach((p, i) => {
        if (!ROOF_SET.has(p.roof)) problems.push(`${kind}.parts[${i}]: roof "${p.roof}" is not a ROOF_FORM`);
        // Inscribed within the footprint (a signature building never exceeds its ground claim).
        if (Math.abs(p.dx) + p.hw > 1 + EPS) problems.push(`${kind}.parts[${i}]: |dx|+hw = ${Math.abs(p.dx) + p.hw} exceeds the footprint`);
        if (Math.abs(p.dy) + p.hd > 1 + EPS) problems.push(`${kind}.parts[${i}]: |dy|+hd = ${Math.abs(p.dy) + p.hd} exceeds the footprint`);
        if (!(p.hMul > 0)) problems.push(`${kind}.parts[${i}]: hMul must be > 0`);
      });
      for (const f of (spec.feat || [])) {
        if (!FEATURE_TYPES.has(f.t)) problems.push(`${kind}: unknown feature type "${f.t}"`);
        if (typeof f.c !== 'number' || f.c < 0 || f.c >= spec.parts.length) problems.push(`${kind}: feature "${f.t}" targets missing part index ${f.c}`);
      }
    }
    expect(problems).toEqual([]);
  });
});
