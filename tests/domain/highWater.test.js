/**
 * tests/domain/highWater.test.js — MF-T2R's acceptance, plus the two STRUCTURAL ROSTERS
 * that keep the high-water channels honest (ODQ §433, re-ruled at §434).
 *
 * THE MEMBER: `src/domain/highWater.js` re-expresses the sealed sandbox's `deriveHighWater`
 * app-side over three evidence channels the engine already writes. Two of those channels
 * depend on ENGINE INVARIANTS that live in other files, so this file pins them BY SOURCE
 * SCAN rather than trusting them:
 *
 *   ROSTER 1 — the `populationHistory` ring writers. A new writer that does not adopt the
 *     ring idiom drifts channel 2's window out from under the reader. Frozen at NINE
 *     appends plus ONE constructor, each classified capped/uncapped.
 *
 *   ROSTER 2 — the settlement-tier writers. Channel 1's residual arm only carries evidence
 *     while a stored tier outlives the population that earned it, and §434 found THREE
 *     pulse paths that lower one. Frozen so a FOURTH reds on arrival with the §434 context
 *     in its face.
 *
 * ⛔ NEITHER ROSTER IS A WISH. The falsified "no pulse path demotes" pin is dead (§434);
 * these pin what the tree ACTUALLY does, so drift is what reds — not reality.
 *
 * ⚠ THE ROSTERS ARE WHOLE-DIRECTORY, NOT IMPORT-DERIVED (the §417 wrong-denominator
 * lesson): both scan every non-test `.js` under `src/domain/worldPulse`, so a writer in a
 * module nothing imports still counts.
 *
 * Registration: this member mints no registry row, no flag, no spatial ledger and no
 * coupling-census entry — `src/domain/highWater.js` is a domain-ROOT leaf and the coupling
 * census scopes to `src/domain/(worldPulse|spatial)/` only (CENSUS_SCOPE_RE, measured at
 * this base). The anchor walker and the test census are the registers it does fire.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { popToTier } from '../../src/data/constants.js';
import { forceCalamityStrike } from '../../src/domain/worldPulse/calamityKernel.js';
import {
  deriveHighWater, HIGH_WATER_CHANNELS, HIGH_WATER_GAPS,
  RING_RETAINED_PREFIX, RING_WINDOW_ENTRIES,
} from '../../src/domain/highWater.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PULSE_DIR = 'src/domain/worldPulse';

function walk(dir, out = []) {
  for (const entry of readdirSync(join(ROOT, dir))) {
    const rel = `${dir}/${entry}`;
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out);
    else if (/\.js$/.test(rel) && !/\.test\./.test(rel)) out.push(rel);
  }
  return out;
}
const PULSE_FILES = walk(PULSE_DIR).sort();
const sourceOf = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const isCommentLine = (line) => {
  const t = line.trim();
  return t.startsWith('*') || t.startsWith('//') || t.startsWith('/*');
};

/** ROSTER-1 SCAN: every `populationHistory: [` site, classified append/constructor and
 *  capped/uncapped by the four lines it opens. */
function ringWriterScan() {
  const rows = [];
  for (const rel of PULSE_FILES) {
    const lines = sourceOf(rel).split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (isCommentLine(lines[i]) || !/populationHistory:\s*\[/.test(lines[i])) continue;
      const window = lines.slice(i, i + 4).join('\n');
      const appends = window.includes('...');
      const capped = window.includes(`.slice(-${RING_RETAINED_PREFIX})`);
      rows.push(`${rel}|${appends ? 'append' : 'constructor'}|${appends ? (capped ? 'capped' : 'UNCAPPED') : 'n/a'}`);
    }
  }
  return [...new Set(rows)].sort();
}

/** ROSTER-2 SCAN: every settlement-tier WRITE — a `tier:` key or `.tier =` assignment
 *  whose VALUE is a tier literal or a computed `*Tier` identifier. A read-through
 *  (`tier: settlement.tier`) has a dotted value and does not match. */
const TIER_WRITE_RE =
  /(?:(?:^|[{,(\s])tier:\s*|\.tier\s*=\s*)(?:'(?:thorp|hamlet|village|town|city|metropolis)'|[A-Za-z_$][\w$]*(?:Tier|tier))\s*[,;}]/;

/** ARGUED NON-SETTLEMENT TIERS — modules the scan reaches whose `tier` is a DIFFERENT
 *  subject's. Each needs a written reason, never a silent exclusion (the ARGUED_UNLAYERED
 *  idiom). A new module here must be argued in this table or it counts. */
const ARGUED_NON_SETTLEMENT = Object.freeze({
  [`${PULSE_DIR}/pantheon.js`]:
    "a DEITY's standing tier ('cult' / 'major' / …), written on a pantheon entry — it is not a settlement's size tier and cannot carry high-water evidence",
});

function tierWriterScan() {
  const rows = [];
  for (const rel of PULSE_FILES) {
    const sites = sourceOf(rel).split('\n')
      .filter((line) => !isCommentLine(line) && TIER_WRITE_RE.test(line)).length;
    if (sites > 0) rows.push({ module: rel, sites });
  }
  return rows;
}

/** THE FROZEN ROSTER-1, measured at this base. Nine appends, one constructor, one uncapped. */
const FROZEN_RING_WRITERS = Object.freeze([
  `${PULSE_DIR}/calamityKernel.js|append|capped`,
  `${PULSE_DIR}/demographicsKernel.js|append|capped`,
  `${PULSE_DIR}/demographicsMigration.js|append|capped`,
  `${PULSE_DIR}/lineageMemberBirth.js|constructor|n/a`,
  `${PULSE_DIR}/migrationKernel.js|append|capped`,
  `${PULSE_DIR}/populationDynamics.js|append|capped`,
  // ⚠ §434, OWNER-DOCKETED, FROZEN AS-IS: this append carries NO ring cap — `[...history,
  // {…}]` with no `.slice`. A parent that founds many steadings therefore keeps a LONGER
  // ring than every sibling writer. That only ever HELPS this reader (more history to see),
  // so it is recorded rather than normalized. Capping it would move same-seed pulse output
  // and is the owner's call, never this lane's.
  `${PULSE_DIR}/realmVerbExecution.js|append|UNCAPPED`,
  `${PULSE_DIR}/settlementLifecycleFirstClass.js|append|capped`,
  `${PULSE_DIR}/settlementLifecycleKernel.js|append|capped`,
  `${PULSE_DIR}/tierOutcomeApply.js|append|capped`,
]);

/** THE FROZEN ROSTER-2, measured at this base: five modules, eighteen write sites, and the
 *  adjudication of which can LOWER a stored tier. `DEMOTING` is the §434 set. */
const FROZEN_TIER_WRITERS = Object.freeze([
  // The strike re-derives the tier from the post-loss population and writes it only when
  // strictly lower — a demotion-only writer, and the one §434's counterfactual convicted.
  { module: `${PULSE_DIR}/calamityKernel.js`, sites: 1, verdict: 'DEMOTING' },
  // Newborn settlements: a chartered steading starts at village. Nothing is lowered.
  { module: `${PULSE_DIR}/lineageMemberBirth.js`, sites: 4, verdict: 'CONSTRUCTOR' },
  // The resettle path forces tier/config.tier/_config.tier to 'thorp' — the glory is
  // aspired to, not inherited — which lowers a dead city's stored tier to the floor.
  { module: `${PULSE_DIR}/settlementLifecycleFirstClass.js`, sites: 3, verdict: 'DEMOTING' },
  // Satellite birth at 'thorp' and the promotion/fold writes at 'hamlet' — upward or new.
  { module: `${PULSE_DIR}/settlementLifecycleKernel.js`, sites: 5, verdict: 'PROMOTING' },
  // `tier: toTier` on an outcome whose `direction` may be 'demotion'.
  { module: `${PULSE_DIR}/tierOutcomeApply.js`, sites: 5, verdict: 'DEMOTING' },
]);

/** A real settlement carried through a lived interval, via the engine's own strike path.
 *  `withStrike:false` is the COUNTERFACTUAL — the same world, the same seed, no calamity. */
function livedInterval({ withStrike }) {
  const start = 5100;
  const settlement = {
    name: 'Probeholt', tier: popToTier(start), population: start,
    config: { terrainType: 'plains' },
    institutions: [], populationHistory: [], calamityHistory: [],
  };
  if (!withStrike) return settlement;
  const struck = forceCalamityStrike({
    settlement, item: undefined, id: 'mf-t2r-strike', year: 20, tick: 1040,
    forkFn: () => ({ random: () => 0.99 }), severity: 'catastrophic', flavorText: null, buffer: null,
  });
  // The strike seam deducts DEATHS; the exodus rides the separate buildExodusOutcome pass,
  // so settle it here or the fixture reads mid-pipeline.
  return {
    ...struck.settlement,
    population: Math.max(0, struck.settlement.population - struck.loss.exodus),
    __loss: struck.loss,
  };
}

describe('MF-T2R — the high-water evidence read, and the channels proven whole', () => {
  it('guard-the-guard: the two source scans are live before any roster assertion runs', () => {
    // If either scan silently emptied — a moved directory, a changed idiom, a broken regex —
    // every exact-set assertion below would pass on nothing. Prove they are populated first.
    expect(PULSE_FILES.length).toBeGreaterThan(300);
    // ⭐ THE DENOMINATOR IS WHOLE-DIRECTORY, NESTING INCLUDED (§417). A walk that stopped at
    // the top level would still clear a count threshold — 394 of these files are top-level —
    // so prove it actually descends, or both rosters are pinned over a quietly smaller tree.
    expect(PULSE_FILES.some((rel) => rel.split('/').length > 4)).toBe(true);
    expect(ringWriterScan().length).toBeGreaterThan(0);
    expect(tierWriterScan().length).toBeGreaterThan(0);
    // And the leaf's own vocabularies are non-empty, or the channel assertions are vacuous.
    expect(HIGH_WATER_CHANNELS.length).toBe(4);
    expect(HIGH_WATER_GAPS.length).toBe(2);
  });

  it('a lived interval with a calamity strike reports the peak its dated losses prove, and the same interval without the strike does not', () => {
    const lived = livedInterval({ withStrike: true });
    const result = deriveHighWater(lived);
    // The strike really happened: a dated stamp with a real exodus.
    expect(lived.calamityHistory.length).toBe(1);
    expect(lived.calamityHistory[0].year).toBe(20);
    expect(lived.__loss.exodus).toBeGreaterThan(0);
    // THE HIGH WATER: current + exodus, recovered from the dated record.
    expect(result.population).toBe(lived.population + lived.__loss.exodus);
    expect(result.demoted).toBe(true);
    expect(result.channels).toContain('DATED_LOSSES');
    expect(result.evidence.join(' ')).toContain(`totalling ${lived.__loss.exodus} souls`);

    // THE COUNTERFACTUAL (the §306.2 input-trap law): the SAME run with the strike absent.
    // The reader's answer moves because the FACT moved, not because a field was written.
    const quiet = livedInterval({ withStrike: false });
    const quietResult = deriveHighWater(quiet);
    expect(quietResult.population).toBe(quiet.population);
    expect(quietResult.demoted).toBe(false);
    expect(quietResult.deficit).toBe(0);
    // The lived arm above asserted this SAME channel name IS present on the struck world, so
    // anchored: an absence here measures the strike's absence, not a deriver that went dark.
    expect(quietResult.channels).not.toContain('DATED_LOSSES');

    // DETERMINISM COMPANION: the same stored facts derive the same answer, every time.
    expect(deriveHighWater(lived)).toEqual(result);
  });

  it('channel 1 reads both arms in declared precedence: the peakTier stamp leads and the tier disagreement is the residual', () => {
    const base = { name: 'Vale', population: 300, calamityHistory: [], populationHistory: [] };
    // THE PRIMARY: the monotone stamp, which survives a decline the stored tier does not.
    const stamped = { ...base, tier: 'hamlet', config: { peakTier: 'city' } };
    const stampedResult = deriveHighWater(stamped);
    expect(stampedResult.channels).toContain('PEAK_TIER_STAMP');
    expect(stampedResult.demoted).toBe(true);
    expectAbsentWithAnchor(stampedResult.channels, 'TIER_DISAGREEMENT', 'PEAK_TIER_STAMP', 'stamp leads');

    // THE RESIDUAL: no stamp, but a stored tier still standing above its population. This
    // is the arm that keeps working on saves, imports, and every path that never demotes.
    const residual = { ...base, tier: 'city', config: {} };
    const residualResult = deriveHighWater(residual);
    expect(residualResult.channels).toContain('TIER_DISAGREEMENT');
    expect(residualResult.evidence.join(' ')).toContain('a recorded demotion');
    expectAbsentWithAnchor(residualResult.channels, 'PEAK_TIER_STAMP', 'TIER_DISAGREEMENT', 'residual arm');

    // BOTH PRESENT: the stamp's higher floor wins, and precedence orders the credit.
    const both = { ...base, tier: 'town', config: { peakTier: 'city' } };
    const bothResult = deriveHighWater(both);
    expect(bothResult.channels).toEqual(['PEAK_TIER_STAMP']);
    expect(bothResult.population).toBe(5001);
  });

  it('channel 2 declares a TWELVE-entry window and understates a peak older than it', () => {
    expect(RING_WINDOW_ENTRIES).toBe(12);
    expect(RING_WINDOW_ENTRIES).toBe(RING_RETAINED_PREFIX + 1);
    // The ring the engine actually produces: eleven retained plus one appended.
    let ring = [];
    for (let i = 0; i < 30; i++) {
      ring = [...ring.slice(-RING_RETAINED_PREFIX), { tick: i, population: i === 0 ? 9000 : 400 + i }];
    }
    expect(ring.length).toBe(RING_WINDOW_ENTRIES);

    const settlement = {
      name: 'Longmemory', population: 430, tier: 'village', config: {},
      populationHistory: ring, calamityHistory: [],
    };
    const result = deriveHighWater(settlement);
    // POSITIVE CONTROL: the window prose declares the real cap, so no consumer can mistake
    // this reading for the settlement's whole life.
    expect(result.window).toContain('the ring settles at 12');
    expect(result.window).toContain('11 retained plus one appended');
    expect(result.gaps).toContain('RING_WINDOW_SATURATED');
    // THE UNDERSTATEMENT, positively stated: the 9,000 peak fell out of the ring thirty
    // writes ago, so the reader reports the population it can still see — never the peak.
    expect(result.population).toBe(430);
    expect(result.demoted).toBe(false);
  });

  it('the frozen populationHistory writer roster: nine appends, one constructor, one uncapped', () => {
    const live = ringWriterScan();
    expect(live).toEqual([...FROZEN_RING_WRITERS]);
    expect(live.filter((r) => r.includes('|append|')).length).toBe(9);
    expect(live.filter((r) => r.includes('|constructor|')).length).toBe(1);
    // The one uncapped writer is FROZEN AS-IS (§434, owner-docketed) — pinned so it cannot
    // grow to two silently, and so capping it is a visible act rather than a quiet one.
    expect(live.filter((r) => r.endsWith('|UNCAPPED')).length).toBe(1);
  });

  it('the frozen settlement-tier writer roster: exactly three of five modules can lower a stored tier (§434)', () => {
    const live = tierWriterScan().filter(
      (row) => !Object.prototype.hasOwnProperty.call(ARGUED_NON_SETTLEMENT, row.module),
    );
    expect(live).toEqual(FROZEN_TIER_WRITERS.map(({ module, sites }) => ({ module, sites })));
    // THE §434 SET. A fourth demoting writer cannot arrive without reddening the line above
    // (a new module or a new site) and being adjudicated into this table with its reason.
    const demoting = FROZEN_TIER_WRITERS.filter((r) => r.verdict === 'DEMOTING').map((r) => r.module);
    expect(demoting).toEqual([
      `${PULSE_DIR}/calamityKernel.js`,
      `${PULSE_DIR}/settlementLifecycleFirstClass.js`,
      `${PULSE_DIR}/tierOutcomeApply.js`,
    ]);
    // Every argued exclusion carries a written reason — never a bare name.
    for (const reason of Object.values(ARGUED_NON_SETTLEMENT)) expect(reason.length).toBeGreaterThan(40);
  });

  it('the §434 gap is TYPED, never silent: a demoted settlement with no stamp reports understated and invents no peak', () => {
    // The engine's own demoting write, executed: a city struck down to town scale, with the
    // dated record stripped the way a later regeneration or a save round-trip can strip it.
    const lived = livedInterval({ withStrike: true });
    const erased = { ...lived, calamityHistory: [], populationHistory: [] };
    expect(erased.tier).toBe('town');
    expect(popToTier(erased.population)).toBe('town');

    const result = deriveHighWater(erased);
    // THE READER SAYS SO RATHER THAN GUESSING: the peak is the population it can see, the
    // gap is named from the closed vocabulary, and nothing is invented from the demoted state.
    expect(result.population).toBe(erased.population);
    expect(result.demoted).toBe(false);
    expect(result.gaps).toContain('NO_PEAK_TIER_STAMP');
    expect(result.understated).toBe(true);
    expect(result.window).toContain('§434');
    expect(result.evidence).toEqual([]);

    // AND THE GAP CLOSES when the monotone stamp is present — proving `understated` tracks
    // the evidence rather than being pinned on. This is the anchor for the negative below.
    const stamped = { ...erased, config: { peakTier: 'city' } };
    const stampedResult = deriveHighWater(stamped);
    expect(stampedResult.understated).toBe(false);
    expectAbsentWithAnchor(
      [...result.gaps, 'RING_WINDOW_SATURATED'], 'NEVER_A_GUESS', 'NO_PEAK_TIER_STAMP', 'closed gap vocabulary',
    );
    expect(stampedResult.population).toBeGreaterThan(result.population);
  });
});
