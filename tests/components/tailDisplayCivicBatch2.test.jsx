/** @vitest-environment jsdom */
/**
 * TAIL-DISPLAY-CIVIC · BATCH 2 (READ-ALL, the chair's ruling X2 of 2026-11-14, its second sentence: a pair of powers'
 * chip and the prose beside it read ONE relation, the record's factionRelationships and conflicts). The Web's chip is the
 * relationship row's direction; where the record's conflicts hold the same two powers in a HIGH quarrel (printed on the
 * Overview and the Relationships tab as "High tension A vs B"), the "stable" chip is not printed: 114 chips in 107 of the
 * census's 720 towns at the base f663a2699 (READ-ALL 13341 10196 13403 04908 10188 23115 13395 06925 07168 07174 10187
 * 03798 09976). The pair and its narrative still print; "escalating" and "declining" chips stay. Births of the census's
 * own seeds (CENSUS-3 seedcfg.mjs :: cfgFor); every cured pair red at the base, every keep green before and after.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { PowerStrata } from '../../src/components/new/tabs/power/PowerStrata.jsx';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's cfgFor, its r2r- and r2s- arms. @param {string} seed */
function born(seed) {
  const r = seed.match(/^r2r-(\w+)-(\d+)$/);
  const m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  const conf = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  return generateSettlementPipeline(birthConfig(conf), null, { seed, customContent: {} });
}
afterEach(cleanup);
/** Every Web row's head line (the pair, the glyph and the chip) as the page prints it. @param {any} s */
function webLines(s) {
  const { container } = render(<PowerStrata settlement={s} powerStructure={s.powerStructure} expandedFaction={null}
    setExpandedFaction={() => {}} focusIndex={-1} focusedRowRef={null} />);
  const out = [...container.querySelectorAll('p')].map((p) => p.previousElementSibling?.textContent).filter(Boolean);
  cleanup();
  return out;
}

// Re-keyed BY IDENTITY (TAIL-CLOSE-DISPLAY-2, red 8): TAIL-POWERS-B-2's DECLARED move c1263e61 (withConflictRelations: a
// pair the conflicts hold at HIGH takes the quarrel's twin, its direction 'escalating') reached the line at JOIN-8 · 16
// (d700bda44), and TAIL-POWERS-B-4's P31 (d99bce57, DECLARED: the merchants' and craftsmen's vote at a HIGH quarrel takes
// a twin naming it) at JOIN-9 · 15. Where they moved the record, the pair prints the record's own "escalating" chip, never "stable":
// r2s-occupied-town-3 and r2r-city-10 (cured rows), r2r-metropolis-31 (its keep: was "declining"); the declining arm is
// kept in r2r-city-10, whose dependent pair with the Highborn Circle still prints "declining".
// [seed, the line that must not print, what prints in its place: the pair without "stable" (the record's chip, if any)]
const CURED = [
  // RE-KEYED BY IDENTITY 2026-11-25, CLOSE-7 ANCHORS-4 (the tenth chair's R24q, point 117): THE CAUSE, C1 (R24-C1 under R24m; its first
  // commit a7870e9cb, green at 3388806b4): r2s-occupied-town-3 (Lykopetra) is governed by the bought hall, born now "Council of Aldermen";
  // conflicts.js keys its issue draw on the powers' names, so the town's conflicts re-draw and Merchant Guilds and Craft Guilds hold no
  // quarrel at all (before: HIGH, "A broken promise of support"); its "stable" chip is now true, the cure's premise gone. Re-picked by this
  // row's own predicate (the record's conflicts hold the pair at HIGH, its Web row tense with the record's "escalating" chip), the lowest
  // r2s-occupied-town: town-16 (the first three: 16, 66, 180). Was r2s-occupied-town-3.
  ['r2s-occupied-town-16', 'Merchant Guilds~Craft Guildsstable', 'Merchant Guilds~Craft Guildsescalating'],
  ['r2r-city-1', 'Military City Council↓Merchant Guildsstable', 'Military City Council↓Merchant Guilds'],
  ['r2r-city-10', 'Merchant Guild Council↔Merchant Guildsstable', 'Merchant Guild Council↔Merchant Guildsescalating'],
];
// [seed, the true sibling that must still print]
const KEPT = [
  ['r2r-city-1', 'Merchant Guilds~Craft Guildsstable'],
  ['r2r-city-0', 'Merchant City Council⇌Military/Guardstable'],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-metropolis-31's Noble Houses and Royal Authority lit hold only a moderate quarrel, so the pair prints
  // "declining"; the lowest r2r-metropolis whose conflicts hold the pair at HIGH and print this line is metropolis-173 (the pair
  // at HIGH in 51 88 173 of 200; 51 and 88 are tense and subordinate rows)
  ['r2r-metropolis-173', 'Noble Houses↔Royal Authorityescalating'],
  ['r2r-city-10', 'The Highborn Circle↔Merchant Guild Councildeclining'],
];
const LINES = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CURED, ...KEPT].map((r) => r[0]))) LINES.set(seed, webLines(born(seed)));
}, 600000);

describe('batch 2: a pair\'s chip does not call a high quarrel stable', () => {
  test('the cured chips no longer print, and the pair still does', () => {
    expect(CURED.filter(([seed, gone, now]) => LINES.get(seed).includes(gone) || !LINES.get(seed).includes(now))
      .map(([seed, gone]) => `${seed}: ${gone}`)).toEqual([]);
  });
  test('the true chips still print', () => {
    expect(KEPT.filter(([seed, kept]) => !LINES.get(seed).includes(kept)).map(([seed, kept]) => `${seed}: ${kept}`)).toEqual([]);
  });
});
