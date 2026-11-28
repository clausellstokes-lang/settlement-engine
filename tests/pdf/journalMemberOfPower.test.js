/**
 * journalMemberOfPower.test.js — COHERENCE-UPKEEP-7, the chair's ruling F2 on the fourth read's C-L3: the Foundry
 * journal printed a raw category key as a power ("Member of: magic", "criminal", "other") on 107 of the reader's
 * 1,440 births, because the view model's NPC row (`pdf/lib/viewModel.js :: npcsSlice`) fell back to the person's
 * raw category for `factionLabel`. RULED: it never falls back to a category key; where a person is in no power, the
 * journal prints no such row (the "Member of" line is left out; the people table's cell is empty).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';

/** A raw category key: one lower-case word, as the record stores it; a power's name is never one. */
const RAW_KEY = /^[a-z_]+$/;

/** @type {Array<{ seed: string, s: any, vm: any, pages: string }>} */
const rows = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const tier of ['village', 'town', 'city']) {
    for (let i = 0; i < 8; i++) {
      const seed = `rv2-calm-${tier}-${i}`;
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier, selectedStresses: [], selectedStressesRandom: false }), null, { seed, customContent: {} });
      const vm = buildViewModel({ settlement: s });
      rows.push({ seed, s, vm, pages: buildJournalPages(vm, { settlement: s }).map((p) => p.markdown).join('\n') });
    }
  }
}, 300000);

describe('the journal names a power, never a category key (F2)', () => {
  test('RED-FIRST: no person\'s "Member of" is a raw category key, on the view row or in the journal', () => {
    let people = 0;
    let none = 0;
    const bad = [];
    for (const { seed, vm, pages } of rows) {
      for (const n of vm.npcs?.sorted || []) {
        people += 1;
        if (!n.factionLabel) none += 1;
        if (n.factionLabel && RAW_KEY.test(n.factionLabel)) bad.push([seed, n.name, n.factionLabel]);
      }
      for (const m of pages.matchAll(/- \*\*Member of:\*\* ([^\n]+)/g)) if (RAW_KEY.test(m[1])) bad.push([seed, 'journal', m[1]]);
      for (const m of pages.matchAll(/^\| [^|]+ \| [^|]* \| ([a-z_]+) \| \d+ \|$/gm)) bad.push([seed, 'people table', m[1]]);
    }
    expect(people, 'anchored: the corpus has people').toBeGreaterThan(50);
    expect(bad).toEqual([]);
    expect(none, 'anchored: some people stand in no power, and print no power').toBeGreaterThan(0);
  });
});
