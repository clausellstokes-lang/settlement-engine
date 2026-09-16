/**
 * archStatuaryScopeCensus.test.js -- K-3 SPINE: the statuary scope law (abstract forms, NEVER a named figure).
 *
 * Product scope (memory: "never resolve a named character's fate"; kernel doc K-3: "abstract robed
 * figures -- NEVER a named character"). The statuary kit is enforced to be a FINITE registry of
 * ABSTRACT ARCHITECTURAL FORMS with:
 *   - keys drawn ONLY from an allowed abstract-form vocabulary (a NEW kit asset outside it REDS --
 *     deposit-and-consume, so no portrait/named piece can slip in);
 *   - output terminals that are ONLY closed geometry kinds (box/spire/prism/sweep/extrudeConvex) --
 *     there is NO text/label/portrait terminal in the vocabulary, so statuary cannot depict a name;
 *   - a source free of proper-name string literals (the heuristic guard).
 *
 * E-A: a planted kit asset keyed to a proper name (e.g. 'kingArthur') must red the whitelist totality.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { KIT_ASSETS } from '../../src/domain/townMap/arch/kit.js';

const KIT_PATH = join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/townMap/arch/kit.js');

/** the ONLY permitted statuary/kit forms -- all abstract architectural terms, no proper names. */
const ALLOWED_ABSTRACT_FORMS = new Set([
  'finial', 'pinnacle',                                    // K-1 base
  'crocket', 'gargoyle', 'grotesque', 'robedFigure', 'skull', // K-3 statuary (abstract)
]);
const GEOMETRY_KINDS = new Set(['box', 'spire', 'prism', 'sweep', 'extrudeConvex']);
const SAMPLE_BOX = { min: [0, 0, 0], max: [20, 40, 20] };

describe('the statuary kit is a finite registry of abstract forms', () => {
  it('every KIT_ASSETS key is an allowed abstract form (a portrait/named piece REDS)', () => {
    const offenders = Object.keys(KIT_ASSETS).filter((k) => !ALLOWED_ABSTRACT_FORMS.has(k));
    expect(offenders, `kit assets outside the abstract-form vocabulary (add an abstract form, never a named figure):\n${offenders.join('\n')}`).toEqual([]);
  });
  it('guard-the-guard: the K-3 statuary set is present', () => {
    for (const k of ['crocket', 'gargoyle', 'grotesque', 'robedFigure', 'skull']) expect(KIT_ASSETS[k]).toBeDefined();
  });
});

describe('statuary produces ONLY closed geometry -- no text/portrait terminal exists', () => {
  for (const key of Object.keys(KIT_ASSETS)) {
    it(`${key}: every emitted terminal is a geometry kind`, () => {
      const terms = KIT_ASSETS[key](SAMPLE_BOX, 'relief');
      expect(terms.length).toBeGreaterThan(0);
      for (const t of terms) expect(GEOMETRY_KINDS.has(t.kind), `${key} emitted a non-geometry kind "${t.kind}"`).toBe(true);
    });
  }
});

describe('the kit source carries no proper-name string literals (the heuristic guard)', () => {
  it('no capitalized multi-letter proper-name tokens in kit string literals', () => {
    const src = readFileSync(KIT_PATH, 'utf8');
    // strip comments, then scan string literals for a Titlecase word that reads as a personal name.
    const noComments = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
    const strings = [...noComments.matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] || m[2] || '');
    const NAMEY = /\b(Saint|King|Queen|Lord|Lady|Sir|St)\b/i;
    const offenders = strings.filter((s) => NAMEY.test(s));
    expect(offenders, `kit string literals read as named figures:\n${offenders.join('\n')}`).toEqual([]);
  });
});
