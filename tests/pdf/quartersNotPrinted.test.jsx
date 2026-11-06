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
import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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
    // The WHOLE canon dossier, every chapter (the Overview's own QUARTERS block among them),
    // with the battery's props (renderHarness.mjs :: renderSurfaces).
    const pdf = pdfLeaves(React.createElement(SettlementPDF, { settlement: s, phase: 'canon', variant: 'canon_dossier', faithUnlocked: true, isFounder: true, isAnonymous: true }), [])
      .join('').replace(/[ \t]+/g, ' ');
    const journal = buildJournalPages(vm, { variant: 'canon_dossier', faithUnlocked: true, settlement: s })
      .map((p) => `# ${p.name}\n${p.markdown}`).join('\n');
    // The battery's own reading (scripts/audit/soak-review/checks.mjs, X-47:district-name).
    const names = (s.spatialLayout?.quarters || []).map((q) => q?.name).filter((n) => typeof n === 'string' && n.length > 3);
    ROWS.push({ seed, s, vm, chapter15, pdf, journal, names });
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

  test('the whole canon-dossier PDF prints no quarter name (chapter 01 Overview included), over soak1k-0 … soak1k-11', () => {
    const offenders = printed('pdf');
    expect(offenders, `printed quarter names:\n${offenders.slice(0, 20).join('\n')}`).toEqual([]);
  });

  test('the walk read real exports, and the view model still carries the quarters for the plat', () => {
    // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so soak1k-0 (now
    // a thorp with no quarters) no longer carries the dry run's named quarter; re-anchored on the first seed of
    // the new corpus that carries one (soak1k-1, "Religious Quarter"). Was: soak1k-0, "Woodcutters' Ground".
    const zero = ROWS.find((r) => r.seed === 'soak1k-1');
    // anchored: a named quarter is on the record, so its absence above is not vacuous.
    expect(zero.names).toContain('Religious Quarter');
    // Collected, so every row runs and the failure count is the true count (seedLoopTotality).
    const failures = collectSeedFailures(ROWS, ({ seed, s, vm, chapter15, pdf, journal, names }) => {
      expect(chapter15.includes(s.name), `${seed}: chapter 15 carries the settlement's name`).toBe(true);
      expect(pdf.includes('Identity & Daily Life') && pdf.includes('Overview'), `${seed}: the PDF carries chapters 01 and 15`).toBe(true);
      expect(vm.overview.quarters.map((q) => q.name), `${seed}: vm.overview.quarters`).toEqual(
        (s.spatialLayout?.quarters || []).map((q) => q.name),
      );
      expect(journal.includes('# Identity & Daily Life'), `${seed}: the journal carries the identity page`).toBe(true);
      // No data removed: the view model keeps every quarter (the plat reads it).
      expect(vm.identity.quarters.map((q) => q.name), `${seed}: vm.identity.quarters`).toEqual(
        (s.spatialLayout?.quarters || []).map((q) => q.name),
      );
      expect(vm.identity.quarters.length >= names.length, `${seed}: quarters kept`).toBe(true);
    });
    expectNoSeedFailures(failures, 'every row reads real exports and keeps its quarters for the plat');
  });
});
