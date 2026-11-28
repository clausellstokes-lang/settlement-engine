/**
 * journalForceNoProvenance.test.js — R2-CODE-B-13, the reader's M10 (REVIEW-R2-CODE-B-2026-11-14 §9): the Foundry
 * journal's Defense page printed each force with the generator's PROVENANCE in brackets ("City walls and gates:
 * Masonry ramparts … (required)", r2r-city-0; 1,017 of the reader's 1,536 births), on the line this lane rewrote
 * (src/foundry/journalPages.js :: defensePage, 2af8bdfa9). The provenance ('required', 'generated',
 * 'coherence_repair', 'cascade', 'faction_boost', 'forced') is the generator's machinery, which the page never shows
 * (the Defense tab's force card dropped its badge by R3-TABS ruling b1). RULED (M10): the tag goes off the line.
 * COLLECTED over the census's own towns (every force with a source checked, not the first); a KEEP-GUARD (each force
 * still prints its house label and its description) and a TAKEN-OFF GUARD (the record still carries the provenance, so
 * the absence is not vacuous).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { institutionHouseLabel } from '../../src/domain/display/institutionDisplayName.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own cfgFor (r2r-<size>-<i>, r2s-<crisis>-<size>-<i>). */
function cfgFor(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  throw new Error(seed);
}
/** The reader's town, a siege, an occupation, a famine, the smallest and the largest sizes. */
const SEEDS = ['r2r-city-0', 'r2r-thorp-4', 'r2r-hamlet-2', 'r2r-village-3', 'r2r-town-15', 'r2r-metropolis-8',
  'r2s-under_siege-town-1', 'r2s-under_siege-city-0', 'r2s-occupied-city-1', 'r2s-famine-village-3', 'r2s-wartime-village-2'];

const ENTITY = { '&#39;': "'", '&quot;': '"', '&lt;': '<', '&gt;': '>', '&amp;': '&' };
/** The journal's markdown as a reader sees it: its backslash escapes and its HTML entities undone. */
const unescape = (t) => String(t).replace(/\\([\\`*_{}[\]()#+\-.!|>~<])/g, '$1').replace(/&#39;|&quot;|&lt;|&gt;|&amp;/g, (e) => ENTITY[e]);
/** @type {Array<{ seed: string, forces: any[], lines: string[] }>} */
const rows = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    const vm = buildViewModel({ settlement: s });
    const d = vm.defense || {};
    const forces = ['fortifications', 'standing', 'contracted', 'charter', 'arcane'].flatMap((k) => d.armedForces?.[k] || []).filter((f) => f && typeof f === 'object');
    const page = buildJournalPages(vm, { settlement: s }).map((p) => unescape(p.markdown ?? '')).join('\n');
    const sec = page.split('\n## Armed forces\n')[1]?.split('\n## ')[0] ?? '';
    rows.push({ seed, forces, lines: sec.split('\n').filter((l) => l.startsWith('- ')) });
  }
}, 300000);

describe('M10: the journal prints a force without the generator\'s provenance', () => {
  test('COLLECTED: no Armed forces bullet carries its force\'s source in brackets; KEEP: the force still prints whole', () => {
    const bad = [];
    const lost = [];
    let sourced = 0;
    for (const { seed, forces, lines } of rows) {
      for (const f of forces) {
        const head = `- ${institutionHouseLabel(f.name || '')}${f.desc ? `: ${f.desc}` : ''}`;
        if (!lines.some((l) => l.startsWith(head))) lost.push([seed, head]);
        if (!f.source) continue;
        sourced += 1;
        for (const l of lines) if (l.startsWith(head) && l.includes(`(${f.source})`)) bad.push([seed, l]);
      }
    }
    expect(bad, 'the provenance tag is off the line').toEqual([]);
    expect(lost, 'KEEP-GUARD: every force still prints its label and description').toEqual([]);
    expect(sourced, 'TAKEN-OFF GUARD: the record still carries provenance, so the absence is not vacuous').toBeGreaterThan(10);
  });
});
