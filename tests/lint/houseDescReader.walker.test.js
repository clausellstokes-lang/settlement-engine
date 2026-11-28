/**
 * houseDescReader.walker.test.js — SURVEY S-A-4 (the chair's ruling on the independent reader's two findings): ONE READER
 * FOR A HOUSE's DESCRIPTION, AND EVERY CALLER STATES ITS AUDIENCE.
 *   ARM 1. Every call of the one reader (`institutionDescShown(`, `institutionDescription(` with a record,
 *          `<InstitutionCard`, the search's `InstitutionCard` renderer) states its `audience` (`owner` / `reader`); a
 *          caller that states none prints the stored line (the reader fails closed), so a new caller with none is red here.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(__dirname, '../..');
const rel = (f) => relative(ROOT, f).split('\\').join('/');
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : /\.(m?js|jsx)$/.test(n) ? [p] : [];
});

/** The text of a call or a JSX element starting at `at` (balanced parentheses, or up to `/>` / `>`). */
function spanAt(src, at) {
  if (src[at] === '<') { const end = src.indexOf('/>', at); return src.slice(at, end < 0 ? at + 600 : end); }
  let depth = 0;
  for (let k = src.indexOf('(', at); k < src.length && k >= 0; k++) {
    if (src[k] === '(') depth++;
    else if (src[k] === ')' && --depth === 0) return src.slice(at, k + 1);
  }
  return src.slice(at, at + 600);
}

/** The calls that hand on their caller's own `options` (the audience is the caller's, stated where IT is called). */
const PASS_THROUGH = Object.freeze({
  'src/components/new/tabs/InstitutionsTab.jsx': 'institutionDescription(inst, settlement, options) hands its caller\'s options to the leaf',
});

describe('S-A-4: one reader for a house\'s description', () => {
  it('ARM 1: every caller of the reader states its audience', () => {
    const missing = [];
    for (const file of walk(join(ROOT, 'src'))) {
      const r = rel(file);
      if (r === 'src/domain/display/institutionDescShown.js') continue; // the reader itself
      const src = readFileSync(file, 'utf8');
      // `InstitutionCard` is the Institutions tab's card only where the file IS that tab or imports it from there (the
      // popover in primitives/, the catalogue picker and the PDF's own section card are other components of that name,
      // and print no stored description: the PDF's reads the gated view model)
      const theCard = r === 'src/components/new/tabs/InstitutionsTab.jsx' || /import\s*\{[^}]*\bInstitutionCard\b[^}]*\}\s*from\s*'[^']*tabs\/InstitutionsTab\.jsx'/.test(src);
      for (const m of src.matchAll(/institutionDescShown\(|institutionDescription\(|<InstitutionCard\b|Component: InstitutionCard/g)) {
        if (!theCard && /InstitutionCard/.test(m[0])) continue;
        const before = src.slice(Math.max(0, m.index - 9), m.index);
        if (/function\s$/.test(before)) continue; // a definition
        const span = m[0] === 'Component: InstitutionCard' ? src.slice(m.index, m.index + 400) : spanAt(src, m.index);
        if (m[0] === 'institutionDescription(' && !span.includes(',')) continue; // no record: the stored line (the old leaf)
        if (span.includes('audience')) continue;
        if (PASS_THROUGH[r] && /options\)/.test(span)) continue;
        missing.push(`${r}: ${span.slice(0, 90).replace(/\s+/g, ' ')}`);
      }
    }
    expect(missing, 'state the audience: owner (the owner\'s page, the whole-document surfaces) or reader (a shared page)').toEqual([]);
  });
});
