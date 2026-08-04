/**
 * sovereigntyTradeDormancyFence.test.js — WR-10's FOUR-FENCE dormancy set (lane WW-A).
 *
 * `sovereigntyTradeEnabled` is built DARK. The claim this file has to make good is not
 * "nothing happened in a world where nothing was going to happen anyway" — that is the
 * vacuous green every dormancy pin drifts toward. It is the harder one: on the exact
 * world that DOES convey a settlement when the flag is lit, the dark run writes nothing
 * at all. Every fence below therefore runs on an ADVERSARIAL fixture — a war ending by
 * a negotiated peace whose envoy carried home a real cession clause, over a real
 * vassalage — and each is paired with the lit run that proves the fixture works.
 *
 *   FENCE 1 — OWN-FOOTPRINT INVARIANT. WR-10's own surface is the satellites ledger,
 *     the occupations ledger, any treaty carrying a sovereignty_transfer term, and its
 *     receipt kinds. Dark, that surface must come out of the drive EXACTLY as it went
 *     in, apart from the treaty the peace engine mints on its own authority.
 *
 *     WHY NO STORED HASH. The estate's own WR-2 manifest was a whole-world sha256 that
 *     rotted into a pure false-positive generator across 162 commits and had to be
 *     re-scoped by chair ruling. A feature declaring ZERO new persisted keys admits a
 *     strictly better fence than a frozen number: its footprint while dark is not
 *     merely stable, it is IDENTICAL TO ITS OWN INPUT, which is an invariant no amount
 *     of unrelated engine evolution can move and no re-record can ever be owed for.
 *     (It also honors this lane's standing instruction to leave tests/fixtures/ alone.)
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE, over the WHOLE projection. No
 *     fixture, so it cannot rot. Its designed blind spot is that it stays GREEN if the
 *     feature runs in BOTH configurations — which is exactly why it is never shipped
 *     alone, and why the flip-the-fixture-lit mutant below expects it to pass while
 *     fences 1 and 3 red.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. Strict pass-through wrappers around the conveyance
 *     writer count real invocations. State pins cannot see a feature that ran and
 *     happened to write nothing; this can.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree: every production read of
 *     the flag is the strict `=== true` form, so ABSENT and FALSE are identical BY
 *     CONSTRUCTION at decision sites no state pin reaches.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { SOVEREIGNTY_REQUIRED_RULES } from '../../src/domain/worldPulse/sovereigntyAssets.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

/**
 * FENCE 3's recorder. Hoisted because `vi.mock` factories hoist above the imports. Every
 * wrapper is a STRICT pass-through (rest-args in, original out), so instrumenting the
 * modules cannot perturb a byte of the runs the other fences measure.
 *
 * ⚠ EVERY SPY SITS OUTSIDE sovereigntyTransfer.js, AND THAT IS LOAD-BEARING — two
 * separate ways of getting it wrong were executed and measured here before this shape
 * was settled on.
 *
 *   (1) Wrapping `executeSovereigntyTransfer` in its own module's namespace counted
 *       ZERO on a run that demonstrably conveyed a town, because `executeTreatyConveyances`
 *       calls it INTRA-MODULE: the internal binding is the original, and replacing an
 *       export never severs a call that does not travel through the module boundary.
 *   (2) ⚠⚠ A TEST FILE THAT IMPORTS A MODULE IT ALSO `vi.mock`s LOSES INTERCEPTION FOR
 *       THAT MODULE'S OTHER CONSUMERS. Isolated on a two-line probe: the identical leaf
 *       spy on `occupation.js` fires 1× when the test file does not import that module,
 *       and 0× the moment it does — STATIC or DYNAMIC import, same result. This is the
 *       nastier of the two, because the failure mode is a silent green: every "never
 *       fires while dark" assertion in such a file passes for the wrong reason, forever.
 *       Only the paired non-vacuity anchor on the lit run caught it here.
 *
 * So: the instrumentation lives at CROSS-MODULE edges the writer really traverses, and
 * this file imports NOTHING from either mocked module — which is also why the fixture's
 * occupation record is written out by hand below instead of built from its constructor.
 */
const calls = vi.hoisted(() => ({ steadingMoves: 0, occupationRewrites: 0 }));

vi.mock('../../src/domain/worldPulse/settlementLifecycleKernel.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    conveySteading: (/** @type {any[]} */ ...args) => {
      calls.steadingMoves += 1;
      return actual.conveySteading(...args);
    },
  };
});

vi.mock('../../src/domain/worldPulse/occupation.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    conveyOccupationRecord: (/** @type {any[]} */ ...args) => {
      calls.occupationRewrites += 1;
      return actual.conveyOccupationRecord(...args);
    },
  };
});

const { advanceTreaties } = await import('../../src/domain/worldPulse/peaceTerms.js');

const SRC_ROOT = resolve(process.cwd(), 'src');
const FLAG = 'sovereigntyTradeEnabled';
const NOW = '2026-01-01T00:00:00.000Z';
const ASSET = 'harbourtown';

/** Every rule the conveyance needs, plus the peace engine's own two. */
const LIT_RULES = Object.freeze({
  ...Object.fromEntries(SOVEREIGNTY_REQUIRED_RULES.map((key) => [key, true])),
  warLayerEnabled: true,
  peaceEngineEnabled: true,
});

const WR10_RECEIPT_KINDS = Object.freeze([
  'sovereignty_sale_offered', 'sovereignty_sale_cleared', 'sovereignty_no_trade',
  'sovereignty_swap', 'cession_for_peace', 'sovereignty_edge_rewritten',
  'sold_settlement_grievance', 'bought_seat_fragility', 'lineage_survives_the_sale',
  'wartime_firesale', 'sovereignty_sale_judged', 'kinship_opposes_the_sale',
  'sale_books_diverged', 'overflow_valve_sold', 'streams_rerouted',
]);

// ── THE ADVERSARIAL FIXTURE ───────────────────────────────────────────────────
//
// A war between `crown` and `march` has just ended by a negotiated peace, and the envoy
// carried home a WR-7b term sheet containing a REAL cession of `harbourtown` — a
// settlement `march` genuinely holds at the conveyable rung. Lit, this mints a treaty
// AND moves the town. Dark, it must mint the treaty and move nothing.

/** One valid, strictly-canonical carried clause conveying ASSET. */
function cessionClause() {
  return {
    type: 'sovereignty_transfer',
    family: 'sovereignty_transfer',
    magnitude: 1,
    durationTicks: 10 * CURRENT_TREATY_TICKS_PER_YEAR,
    weightSpent: 2,
    burden01: 0,
    seam: true,
    assetId: ASSET,
  };
}

/** The exact WR-7b artifact shape the strict validator accepts. */
function carriedTermSheet() {
  const clause = cessionClause();
  return {
    schemaVersion: 1,
    id: 'sheet.errand.1',
    errandId: 'errand.1',
    encounterId: 'encounter.1',
    episodeKey: 'episode.1',
    relationshipKey: 'edge.crown.march',
    parties: ['crown', 'march'],
    proposerId: 'crown',
    responderId: 'march',
    victorId: 'crown',
    loserId: 'march',
    agreedTick: 8,
    pictureIds: { proposer: 'picture.crown', responder: 'picture.march' },
    clauses: [clause],
    budgetSpent: clause.weightSpent,
    valuations: [
      { partyId: 'crown', pictureId: 'picture.crown', role: 'proposer', decision: 'accept' },
      { partyId: 'march', pictureId: 'picture.march', role: 'responder', decision: 'accept' },
    ],
  };
}

const edges = Object.freeze([
  { id: 'edge.crown.march', from: 'crown', to: 'march', relationshipType: 'cold_war' },
  { id: 'edge.harbourtown.march', from: ASSET, to: 'march', relationshipType: 'neutral' },
]);

function item(id, patch = {}) {
  return {
    id,
    settlement: {
      name: id, tier: patch.tier || 'town', population: patch.population ?? 2400,
      config: { tradeRouteAccess: 'road' },
      institutions: [{ name: 'Market' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [], primaryImports: [], activeChains: [],
        foodSecurity: { storageMonths: 6, resilienceScore: 65 },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: `${id} council`, category: 'civic', power: 60, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
  };
}

const items = Object.freeze([item('crown', { tier: 'city', population: 9000 }), item('march'), item(ASSET)]);

/** @param {'lit'|'absent'|'false'} mode */
function worldFor(mode) {
  const rules = mode === 'lit'
    ? { ...LIT_RULES }
    : (() => {
      const off = { ...LIT_RULES };
      delete off[FLAG];
      return mode === 'false' ? { ...off, [FLAG]: false } : off;
    })();
  return {
    tick: 10,
    simulationRules: rules,
    calendar: { elapsedWeeks: 30 },
    deployments: {},
    warExhaustion: { crown: 0.7, march: 0.8 },
    // The holding that is actually for sale: march holds harbourtown at the top rung.
    occupations: {
      // ⚠ WRITTEN OUT RATHER THAN BUILT FROM `createOccupationRecord`, and that is not
      // laziness — see the spy note in the header. A test file that IMPORTS a module it
      // also `vi.mock`s loses interception for that module's OTHER consumers, so
      // reaching for the real constructor here would silently disarm fence 3. Measured:
      // the identical leaf spy fires 1× without the import and 0× with it, static or
      // dynamic. The record's real shape is exercised against the real constructor in
      // tests/domain/sovereigntyTransferWr10w.test.js, which mocks nothing.
      [ASSET]: {
        occupierId: 'march', state: 'vassalized', sinceTick: 2, stateHeld: 9,
        resistance: 0.05, benefitYield: 0, lastTick: 2,
      },
    },
    relationshipStates: {
      'edge.crown.march': {
        relationshipType: 'cold_war', resentment: 0.6, trust: 0.1, lastTransitionTick: 10,
        recentIncidents: [{
          tick: 10,
          type: 'strategy_sue_for_peace',
          outcomeId: 'candidate.strategy.sue_for_peace.crown.10',
          carriedTermSheet: carriedTermSheet(),
        }],
      },
    },
    spatialLedgers: {
      satellites: {
        march: {
          steadings: {
            'steading.march.1': {
              id: 'steading.march.1', name: 'Stead March', parentId: 'march', tier: 'thorp',
              population: 44, foundedTick: 1, provenance: 'growth', orbit: 0, inflow: 44,
              backing01: 0.5, history: ['Founded (tick 1).'],
            },
          },
        },
      },
    },
  };
}

/** Drive the treaty mover once on a fresh world in the given configuration. */
function drive(mode) {
  const worldState = worldFor(mode);
  const settlementUpdates = items.map((i) => ({ saveId: String(i.id), settlement: i.settlement }));
  const out = advanceTreaties({
    snapshot: { byId: new Map(items.map((i) => [String(i.id), i])), regionalGraph: { edges: [...edges] } },
    worldState,
    settlementUpdates,
    graph: { edges: [...edges] },
    pIndex: null,
    tick: 10,
    now: NOW,
  });
  return { before: worldState, out };
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * FENCE 1's projection: exactly what a CONVEYANCE writes, and nothing else.
 *
 * The cession TERM is deliberately not in here, and that distinction is the whole point
 * of the fence. The term arrived on the envoy's sheet and the peace engine mints it
 * under its OWN flag, so a dark world legitimately ends up holding a document that says
 * a town was ceded — while the town has not moved. A projection that lumped the two
 * together could not tell that correct outcome from a leak. The document half is pinned
 * separately, by its receipts.
 */
function footprint(worldState) {
  return normalizeForDormancy({
    satellites: worldState?.spatialLedgers?.satellites || {},
    occupations: worldState?.occupations || {},
    relationshipStates: worldState?.relationshipStates || {},
  });
}

/** The DOCUMENT half: which cession clauses exist, and what the treaty says it did. */
function documentFootprint(worldState) {
  const treaties = worldState?.spatialLedgers?.treaties || {};
  const out = {};
  for (const key of Object.keys(treaties).sort()) {
    const terms = (treaties[key]?.terms || []).filter((t) => t?.type === 'sovereignty_transfer');
    if (terms.length) out[key] = { assetIds: terms.map((t) => t.assetId), receipts: treaties[key].receipts || [] };
  }
  return normalizeForDormancy(out);
}

/** FENCE 2's projection: the whole result, minus only the spelling of the flag. */
function projectionOf({ out }) {
  const worldState = out.worldState || {};
  const rules = { ...(worldState.simulationRules || {}) };
  delete rules[FLAG];
  return normalizeForDormancy({
    worldState: { ...worldState, simulationRules: rules },
    changed: out.changed,
    newsEntries: out.newsEntries || [],
    settlementUpdates: out.settlementUpdates || [],
  });
}

function collectKinds(value, out = new Set()) {
  if (Array.isArray(value)) { for (const item of value) collectKinds(item, out); return out; }
  if (!value || typeof value !== 'object') return out;
  for (const [key, child] of Object.entries(value)) {
    if ((key === 'kind' || key === 'impactKind') && typeof child === 'string') out.add(child);
    collectKinds(child, out);
  }
  return out;
}

// ── FENCE 4's scanner ─────────────────────────────────────────────────────────
/** Strip comments and string literals so an identifier in PROSE or inside a JSDoc cast
 *  is not read as a gate (the cast-is-not-a-gate false positive). */
function codeResidue(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return '';
  return line
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
    .replace(/\/\/.*$/, '');
}

const STRICT_READ = new RegExp(`${FLAG}\\s*===\\s*true`);
const DECLARATION = new RegExp(`${FLAG}\\s*:\\s*(false|boolean)`);

function censusFlagGates(root) {
  const out = { strictReads: 0, files: new Set(), violations: [] };
  const walk = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) { walk(full); continue; }
      if (!/\.jsx?$/.test(name)) continue;
      const text = readFileSync(full, 'utf8');
      if (!text.includes(FLAG)) continue;
      const rel = full.slice(root.length + 1);
      text.split('\n').forEach((line, index) => {
        const residue = codeResidue(line);
        if (!residue.includes(FLAG)) return;
        if (STRICT_READ.test(residue)) { out.strictReads += 1; out.files.add(rel); return; }
        if (DECLARATION.test(residue)) return;
        out.violations.push(`${rel}:${index + 1}: ${line.trim()}`);
      });
    }
  };
  walk(root);
  return out;
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('WR-10 sovereignty trade — the four-fence dormancy set', () => {
  it('THE FIXTURE IS ADVERSARIAL: lit, this exact world really does convey the town', () => {
    const { out } = drive('lit');
    expect(out.changed, 'a treaty minted').toBe(true);
    expect(out.worldState.occupations[ASSET].occupierId, 'the town changed hands').toBe('crown');
    const treaties = out.worldState.spatialLedgers.treaties;
    const key = Object.keys(treaties)[0];
    expect(treaties[key].terms.some((t) => t.type === 'sovereignty_transfer'),
      'the cession clause survived the carried-sheet road').toBe(true);
    expect(treaties[key].terms.find((t) => t.type === 'sovereignty_transfer').assetId,
      'and it still names its object').toBe(ASSET);
    expect(treaties[key].receipts.join(' '), 'the document records the conveyance').toContain(ASSET);
  });

  // ── FENCE 1 ────────────────────────────────────────────────────────────────
  it('FENCE 1 — dark, WR-10\'s own footprint comes out EXACTLY as it went in', () => {
    for (const mode of ['absent', 'false']) {
      const { before, out } = drive(/** @type {'absent'|'false'} */ (mode));
      expect(hashOf(footprint(out.worldState)), `${mode}: the WR-10 surface did not move`)
        .toBe(hashOf(footprint(before)));
      expect(out.worldState.occupations[ASSET].occupierId, `${mode}: the holder is unchanged`).toBe('march');
      expect(out.worldState.spatialLedgers.satellites.march.steadings['steading.march.1'],
        `${mode}: the steading row is untouched`)
        .toEqual(before.spatialLedgers.satellites.march.steadings['steading.march.1']);
    }
    // NON-VACUITY: the same hash comparison MOVES on the lit run, so a green above is
    // the flag holding rather than a projection that reads nothing.
    const lit = drive('lit');
    expect(hashOf(footprint(lit.out.worldState))).not.toBe(hashOf(footprint(lit.before)));
  });

  it('FENCE 1b — the DOCUMENT admits the clause and denies the deed while dark', () => {
    // The honest dark outcome, stated so it cannot be mistaken for a leak later: the
    // envoy's sheet really did carry a cession, so the minted treaty really does hold
    // the clause — and its receipts say nothing about a conveyance, because none ran.
    for (const mode of ['absent', 'false']) {
      const { out } = drive(/** @type {'absent'|'false'} */ (mode));
      const doc = documentFootprint(out.worldState);
      const key = Object.keys(doc)[0];
      expect(doc[key].assetIds, `${mode}: the clause survived the sheet road`).toEqual([ASSET]);
      expect(doc[key].receipts.join(' '), `${mode}: but the document claims no conveyance`)
        .not.toContain('passed from');
    }
    // anchored: the lit run's receipts DO carry the line, so the negative above measures
    // the flag holding rather than a receipt vocabulary that never says anything.
    const lit = drive('lit');
    const litDoc = documentFootprint(lit.out.worldState);
    expect(litDoc[Object.keys(litDoc)[0]].receipts.join(' ')).toContain('passed from');
  });

  it('FENCE 1c — no WR-10 receipt kind escapes while dark', () => {
    for (const mode of ['absent', 'false']) {
      const { out } = drive(/** @type {'absent'|'false'} */ (mode));
      const kinds = collectKinds(projectionOf({ out }));
      expect(WR10_RECEIPT_KINDS.filter((kind) => kinds.has(kind)), mode).toEqual([]);
      // anchored: the drive genuinely produced news, so the empty intersection above is
      // a filter result rather than an empty feed.
      expect(kinds.size, `${mode}: the drive really emitted kinds`).toBeGreaterThan(0);
    }
  });

  // ── FENCE 2 ────────────────────────────────────────────────────────────────
  it('FENCE 2 — ABSENT and explicit FALSE are byte-identical across the whole projection', () => {
    const absent = projectionOf(drive('absent'));
    const explicitFalse = projectionOf(drive('false'));
    expect(explicitFalse).toEqual(absent);
    expect(hashOf(explicitFalse), 'canonical-form byte identity').toBe(hashOf(absent));
  });

  it('FENCE 2\'s BLIND SPOT is real and is why it never ships alone', () => {
    // Flip the fixture LIT on both sides: the differential is still green, because it
    // compares two spellings of the same configuration and can never see a feature that
    // runs in both. Fences 1 and 3 are the ones that catch it.
    const litA = projectionOf(drive('lit'));
    const litB = projectionOf(drive('lit'));
    expect(hashOf(litA), 'the differential stays GREEN on a lit-vs-lit comparison').toBe(hashOf(litB));
    // …while fence 1's own comparison, run on the same lit world, REDS.
    const lit = drive('lit');
    expect(hashOf(footprint(lit.out.worldState))).not.toBe(hashOf(footprint(lit.before)));
  });

  // ── FENCE 3 ────────────────────────────────────────────────────────────────
  it('FENCE 3 — neither conveyance PRIMITIVE fires while dark', () => {
    calls.steadingMoves = 0;
    calls.occupationRewrites = 0;
    for (const mode of ['absent', 'false']) drive(/** @type {'absent'|'false'} */ (mode));
    expect(calls.occupationRewrites, 'an occupation was rewritten while the flag is dark').toBe(0);
    expect(calls.steadingMoves, 'a steading row was moved while the flag is dark').toBe(0);
    // NON-VACUITY: the same spies increment on the lit run, so the zeros above are the
    // gate holding rather than instrumentation that was never connected. The dark drives
    // genuinely reached the conveyance road — fence 1b proves the cession clause was on
    // the minted document, and the mint hook walks every such clause into the writer.
    drive('lit');
    expect(calls.occupationRewrites, 'the lit run DOES rewrite, so the spy is live').toBe(1);
  });

  // ── FENCE 4 ────────────────────────────────────────────────────────────────
  //
  // ⚠ THE NAMED READ IN THE GATE IS LOAD-BEARING FOR THIS FENCE, and the first cut of
  // the wiring lane did not have it. The gate began as the frozen
  // SOVEREIGNTY_REQUIRED_RULES conjunction alone, read `rules[key] === true` over every
  // member (the envoy idiom) — a COMPUTED member access that no gate scanner in this
  // estate can attribute to any key. Measured consequence: this census found ZERO
  // strict reads for a fully-wired flag, and the subsystem-certification walker stayed
  // green while the flag was genuinely engine-gated. The cure was to read the market's
  // own flag by name as well; the polarity claim is proved in three parts below.
  it('FENCE 4a — the flag has a NAMED strict read, and no loose read anywhere in src/', () => {
    const census = censusFlagGates(SRC_ROOT);
    expect(census.violations, 'a loose gate makes ABSENT and FALSE diverge').toEqual([]);
    // Non-vacuity, and the regression guard for the invisible-gate episode above: the
    // named read must EXIST, or every flag scanner in the estate goes blind to it.
    expect(census.strictReads, 'the flag must be readable by a gate scanner').toBeGreaterThanOrEqual(1);
    expect(census.files.size).toBeGreaterThanOrEqual(1);
  });

  it('FENCE 4b — the ONE gate is the frozen conjunction, and it compares strictly', () => {
    const gateSource = readFileSync(join(SRC_ROOT, 'domain/worldPulse/sovereigntyAssets.js'), 'utf8');
    expect(gateSource, 'the conjunction is read with a strict === true comparison')
      .toMatch(/SOVEREIGNTY_REQUIRED_RULES\.every\(\(key\) => rules\[key\] === true\)/);
    expect(SOVEREIGNTY_REQUIRED_RULES, 'and the flag is a member of it').toContain(FLAG);
    expect(Object.isFrozen(SOVEREIGNTY_REQUIRED_RULES), 'the membership cannot be edited at runtime').toBe(true);
  });

  it('FENCE 4 is not vacuous: a loose gate is rejected and three non-gates are not', () => {
    for (const line of [`if (rules.${FLAG}) { lit(); }`, `x = a.${FLAG} !== false;`]) {
      const residue = codeResidue(line);
      expect(residue.includes(FLAG) && !STRICT_READ.test(residue) && !DECLARATION.test(residue), line).toBe(true);
    }
    expect(codeResidue(` * while ${FLAG} is active, the market opens`).includes(FLAG)).toBe(false);
    expect(codeResidue(`  '${FLAG}',`).includes(FLAG)).toBe(false);
    expect(codeResidue(`  const rules = /** @type {{${FLAG}?:unknown}} */ (ws?.simulationRules || {});`)
      .includes(FLAG)).toBe(false);
    expect(STRICT_READ.test(codeResidue(`  return rules.${FLAG} === true;`))).toBe(true);
  });
});
