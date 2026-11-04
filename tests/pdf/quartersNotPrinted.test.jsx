/**
 * @vitest-environment node
 *
 * X-47 (the owner, 2026-11-03): NO DISTRICTS BEFORE THE PLAT. "No districts or taverns until we
 * get the PLAT working"; later, "we are working on PLAT for the map". A quarter's name stays on
 * the record and in the view model (`src/pdf/lib/viewModel.js :: buildViewModel` keeps
 * `quarters`, for the plat to read), and no text export prints it.
 *
 * The 1,000-settlement dry run (docs/SOAK_1000_2026-11-03.md §2 row 1, §4b R1) found quarter
 * names in 974 PDFs and 971 Foundry journals and on no screen. This renders, for the battery's
 * own corpus members `soak1k-0` … `soak1k-11` (scripts/audit/soak-review/corpus.mjs :: birth — two
 * passes of the six tiers), the journal (`src/foundry/journalPages.js :: buildJournalPages`) and
 * the PDF's text, its element tree walked to the text leaves the way
 * scripts/audit/soak-review/renderHarness.mjs :: renderSurfaces walks it, and convicts any quarter
 * name from the record (the battery's own reading, checks.mjs `X-47:district-name`) found there.
 */
import React from 'react';
import { describe, test, expect, beforeAll } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';

const INDICES = Array.from({ length: 12 }, (_, i) => i);

/** Text leaves of a @react-pdf element tree, calling each function component as it goes. */
function pdfLeaves(node, out, depth = 0) {
  if (node == null || typeof node === 'boolean' || depth > 400) return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) pdfLeaves(n, out, depth + 1); return out; }
  if (typeof node === 'object') {
    const t = node.type;
    if (typeof t === 'function') {
      const rendered = t.prototype?.isReactComponent ? new t(node.props).render() : t(node.props);
      return pdfLeaves(rendered, out, depth + 1);
    }
    if (t && typeof t === 'object' && typeof t.type === 'function') return pdfLeaves(t.type(node.props), out, depth + 1);
    if (t === 'TEXT' || t === 'LINK') { const seg = []; pdfLeaves(node.props?.children, seg, depth + 1); out.push(`${seg.join('')}\n`); return out; }
    if (typeof node.props?.render === 'function') return out;
    return pdfLeaves(node.props?.children, out, depth + 1);
  }
  return out;
}

const ROWS = [];
beforeAll(async () => {
  await ensureLaws();
  for (const i of INDICES) {
    const { seed, settlement } = birth(i);
    const s = normalizeSettlement(settlement);
    const vm = buildViewModel({ settlement: s, phase: 'canon' });
    const chapter15 = pdfLeaves(React.createElement(IdentityDailyLife, { settlement: s, narrativeMode: false, vm, stateProse: null }), [])
      .join('').replace(/[ \t]+/g, ' ');
    const journal = buildJournalPages(vm, { variant: 'canon_dossier', faithUnlocked: true, settlement: s })
      .map((p) => `# ${p.name}\n${p.markdown}`).join('\n');
    // The battery's own reading (scripts/audit/soak-review/checks.mjs, X-47:district-name).
    const names = (s.spatialLayout?.quarters || []).map((q) => q?.name).filter((n) => typeof n === 'string' && n.length > 3);
    ROWS.push({ seed, s, vm, chapter15, journal, names });
  }
}, 600000);

describe('X-47: no quarter name in any text export before the plat', () => {
  /** Every (seed, quarter name) the given surface prints. */
  function printed(surface) {
    const offenders = [];
    let checked = 0;
    for (const row of ROWS) {
      for (const name of row.names) {
        checked += 1;
        if (row[surface].includes(name)) offenders.push(`${row.seed} · ${surface} · ${name}`);
      }
    }
    expect(checked, 'the walk found no quarter names on the record').toBeGreaterThan(12);
    return offenders;
  }

  test('the Foundry journal prints no quarter name (identityPage, no ## Quarters), over soak1k-0 … soak1k-11', () => {
    const offenders = printed('journal');
    expect(offenders, `printed quarter names:\n${offenders.slice(0, 20).join('\n')}`).toEqual([]);
  });

  test('chapter 15, Identity & Daily Life, prints no quarter name (no QUARTERS block), over soak1k-0 … soak1k-11', () => {
    const offenders = printed('chapter15');
    expect(offenders, `printed quarter names:\n${offenders.slice(0, 20).join('\n')}`).toEqual([]);
  });

  test('the walk read real exports, and the view model still carries the quarters for the plat', () => {
    const zero = ROWS.find((r) => r.seed === 'soak1k-0');
    // anchored: the dry run's named quarter is on the record, so its absence above is not vacuous.
    expect(zero.names).toContain("Woodcutters' Ground");
    for (const { seed, s, vm, chapter15, journal, names } of ROWS) {
      expect(chapter15.includes(s.name), `${seed}: chapter 15 carries the settlement's name`).toBe(true);
      expect(journal.includes('# Identity & Daily Life'), `${seed}: the journal carries the identity page`).toBe(true);
      // No data removed: the view model keeps every quarter (the plat reads it).
      expect(vm.identity.quarters.map((q) => q.name), `${seed}: vm.identity.quarters`).toEqual(
        (s.spatialLayout?.quarters || []).map((q) => q.name),
      );
      expect(vm.identity.quarters.length >= names.length, `${seed}: quarters kept`).toBe(true);
    }
  });
});
