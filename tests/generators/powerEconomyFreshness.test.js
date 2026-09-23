/**
 * Final economy -> power freshness.
 *
 * The pipeline intentionally forms political intent from a provisional economy:
 * faction power is required before factionCorrelationPass can pull a signature
 * institution. A successful pull can then change prosperity, safety, or food.
 * The bounded powerEconomyReconcilePass must consume that final economy without
 * inventing a second political roster or reopening institution production.
 */

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test, vi } from 'vitest';
import {
  computePublicLegitimacy,
} from '../../src/generators/factionDynamics.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { fingerprintPowerEconomyInput } from '../../src/data/economyFingerprint.js';
import {
  assertPowerEconomyFreshness,
} from '../../src/generators/power/economyReconciliation.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { censusCorpus, runHeadless } from '../helpers/generationForkCensus.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

/**
 * THE MINT RECORDER, DECLARED THROUGH `vi.hoisted` (EM-R3 A5). `vi.mock` is hoisted ABOVE this
 * file's STATIC imports and those imports reach `src/kernel/prng.js` transitively, so the factory
 * runs while they load — before any plain module-scope `const` below has initialized. Declared as
 * a plain const the recorder kills the whole file at load with `Cannot access ... before
 * initialization`, MEASURED on `tests/generators/pipelinePinnedChoosers.test.js` and recorded in
 * that file's own docblock; `vi.hoisted` lifts the initialization above both the mock and the
 * imports. OFF by default: only A5 turns it on, around the two runs it discriminates.
 *
 * THE WRAPPER IS A PURE PASS-THROUGH: it records the seed and returns the REAL stream, so no draw
 * order moves and no fork is re-implemented.
 */
const mintSeeds = vi.hoisted(() => ({ seeds: [], on: false, actualKeys: [] }));

vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
  const actual = await importOriginal();
  mintSeeds.actualKeys = Object.keys(actual).sort();
  return {
    ...actual,
    createPRNG: (seed) => {
      if (mintSeeds.on) mintSeeds.seeds.push(String(seed));
      return actual.createPRNG(seed);
    },
  };
});

/**
 * THE TEST'S OWN SEAM over the reconciliation leaf (EM-R3 A3 and A6), also `vi.hoisted` and also
 * a pure pass-through: it COUNTS the freshness assert's reaches (A3's arm is the count, not
 * prose) and it can replace `refreshPowerGenerationTraces` with a no-op (A6 measures the record
 * with and without it). BOTH toggles are off by default, so every other arm in this file — the
 * four that predate EM-R3 included — runs against the real module exactly as before.
 *
 * `reconcilePowerStructure` is NOT wrapped: it is the member's own subject, and a wrapper over it
 * would measure the wrapper.
 */
const seam = vi.hoisted(() => ({ assertCalls: 0, countAsserts: false, skipRefresh: false }));

vi.mock('../../src/generators/power/economyReconciliation.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    assertPowerEconomyFreshness: (...args) => {
      if (seam.countAsserts) seam.assertCalls += 1;
      return actual.assertPowerEconomyFreshness(...args);
    },
    refreshPowerGenerationTraces: (...args) => (
      seam.skipRefresh ? undefined : actual.refreshPowerGenerationTraces(...args)
    ),
  };
});

const STALE_SEED_CONFIG = {
  settType: 'city',
  culture: 'latin',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  priorityEconomy: 75,
  priorityMilitary: 55,
  priorityReligion: 50,
  priorityCriminal: 50,
  priorityMagic: 40,
};

function generate(config, seed, options = {}) {
  return generateSettlementPipeline(config, null, {
    seed,
    customContent: {},
    ...options,
  });
}

function powerByFaction(settlement) {
  return Object.fromEntries(
    settlement.powerStructure.factions.map(
      faction => [faction.faction, faction.power],
    ),
  );
}

// ── EM-R3's instruments ──────────────────────────────────────────────────────────────────
/** The repository root, derived from this file rather than from the working directory. */
const REPO_ROOT = resolve(process.cwd());
const RECONCILE_FILE = join(REPO_ROOT, 'src', 'generators', 'power', 'economyReconciliation.js');
const GOLDEN_MANIFEST = join(REPO_ROOT, 'tests', 'fixtures', 'generator-golden-master.json');
/** The roster assert's whole sentence, as the leaf spells it. */
const ROSTER_REFUSAL = 'Power intent replay changed the generated faction identity roster. '
  + 'Only economy-dependent projections may change during finalization.';

const text = (value) => JSON.stringify(value ?? null);
const factionName = (faction) => faction.faction || faction.name;
const factionNamed = (structure, name) => (structure?.factions || [])
  .find((faction) => factionName(faction) === name);

/**
 * The census corpus MINUS the rows whose terrain is already the flagship world change's, so
 * `terrainOverride: 'desert'` is a CHANGE in every row the arms below run.
 */
const nonDesertCorpus = () => censusCorpus().filter((row) => row.terrainOverride !== 'desert');

/** One plain run per corpus row, memoized: every bag below is built FROM the record. */
const baselines = new Map();
function baselineFor(row) {
  const key = text(row);
  if (!baselines.has(key)) baselines.set(key, runHeadless(row, createPRNG(row._seed)));
  return baselines.get(key);
}

/** The DM's share edit, on a CLONE of the record's roster: one non-governing faction halved. */
function heldWithHalvedShare(record) {
  const held = structuredClone(record.powerStructure);
  const target = (held.factions || []).find((faction) => faction.isGoverning !== true)
    || held.factions[0];
  const want = Math.max(1, Math.round((target.power || 10) / 2));
  target.power = want;
  return { held, name: factionName(target), want };
}

/** The DM's seat edit: the governing flag moved to another faction, config unchanged. */
function heldWithMovedSeat(record) {
  const held = structuredClone(record.powerStructure);
  const factions = held.factions;
  const seat = factions.findIndex((faction) => faction.isGoverning === true);
  const other = factions.findIndex(
    (faction, index) => index !== seat && faction.isGoverning !== true,
  );
  if (seat < 0 || other < 0) return null;
  factions[seat].isGoverning = false;
  factions[other].isGoverning = true;
  return { held, name: factionName(factions[other]) };
}

/**
 * THROUGH THE MEMBER: the runner's own pins channel. `powerIntent` has no record path, so the
 * runner's partial-pin rule refuses the bag and `onStrictViolation` COLLECTS that refusal
 * instead of throwing — the pin is honoured, which is how every figure here was taken.
 */
function throughTheMember(row, held, onStep) {
  return runHeadless(row, createPRNG(row._seed), {
    pins: { powerStructure: structuredClone(held) },
    onStrictViolation: () => {},
    onStep,
  });
}

/**
 * THE COUNTERFORCE INSTRUMENT: the same bag injected over the producer's patch with NO pins
 * channel, so `options.pins` never reaches the seam and the replay runs exactly as it does
 * with no member at all. It is what makes every identity below a measurement.
 */
function withoutThePinChannel(row, held) {
  return runHeadless(row, createPRNG(row._seed), {
    onStep: (name, ctx) => {
      if (name === 'generatePower') ctx.powerStructure = structuredClone(held);
    },
  });
}

/** Every `createPRNG(` site under one root — the entropy census's own two arms, re-counted. */
function createPrngSites(relativeRoot) {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(js|jsx)$/.test(entry)) files.push(full);
    }
  };
  walk(join(REPO_ROOT, relativeRoot));
  return files.reduce(
    (sum, file) => sum + (readFileSync(file, 'utf-8').match(/createPRNG\(/g) || []).length, 0,
  );
}

describe('bounded final economy -> power reconciliation', () => {
  test('econ-power-freshness-166 consumes Moderate, not provisional Comfortable', () => {
    const snapshots = {};
    const settlement = generate(
      STALE_SEED_CONFIG,
      'econ-power-freshness-166',
      {
        onStep(name, ctx) {
          if (
            name === 'generatePower'
            || name === 'economyReconcilePass'
            || name === 'powerEconomyReconcilePass'
          ) {
            snapshots[name] = {
              prosperity: ctx.economicState.prosperity,
              legitimacy: structuredClone(
                ctx.powerStructure.publicLegitimacy,
              ),
              powers: Object.fromEntries(
                ctx.powerStructure.factions.map(
                  faction => [faction.faction, faction.power],
                ),
              ),
            };
          }
        },
      },
    );

    expect(snapshots.generatePower.prosperity).toBe('Comfortable');
    expect(snapshots.generatePower.legitimacy.breakdown.prosperity).toBe(8);
    expect(snapshots.economyReconcilePass.prosperity).toBe('Moderate');
    // This is the exact stale join: immediately after the economy changes,
    // power still carries Comfortable's +8 until the bounded closeout runs.
    expect(
      snapshots.economyReconcilePass.legitimacy.breakdown.prosperity,
    ).toBe(8);

    expect(
      snapshots.powerEconomyReconcilePass.legitimacy.breakdown.prosperity,
    ).toBe(0);
    // Split re-pinned 2026-08-01: wave I1 added four information-brokerage entries to the
    // town/city catalogs, which moves this city's institution mix and so the power the
    // bounded closeout re-derives from the FINAL economy. Two powers traded one point
    // (Craft Guilds 9 to 8, Merchant City Council 18 to 19); the total still sums to 100
    // and the prosperity-contribution claim above (0, not the stale +8) is unchanged.
    expect(snapshots.powerEconomyReconcilePass.powers).toEqual({
      'Military/Guard': 22,
      'Merchant City Council': 19,
      'Merchant Guilds': 13,
      'Religious Authorities': 12,
      'Craft Guilds': 8,
      'War Council': 8,
      "Thieves' Guild": 8,
      'Noble Families': 5,
      'Arcane Orders': 5,
    });
    expect(powerByFaction(settlement)).toEqual(
      snapshots.powerEconomyReconcilePass.powers,
    );
    expect(
      settlement.powerStructure.factions.reduce(
        (sum, faction) => sum + faction.power,
        0,
      ),
    ).toBe(100);
  });

  test('the final fingerprint and legitimacy match final dossier inputs across a cohort', () => {
    const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    for (const tier of tiers) {
      for (let index = 0; index < 4; index += 1) {
        const config = {
          settType: tier,
          culture: index % 2 ? 'latin' : 'germanic',
          terrainOverride: index % 2 ? 'forest' : 'plains',
          tradeRouteAccess: index % 3 ? 'road' : 'crossroads',
        };
        const seed = `power-freshness-${tier}-${index}`;
        let institutionsBeforePowerCloseout;
        let institutionsAfterPowerCloseout;
        let powerCloseoutCount = 0;
        const options = {
          onStep(name, ctx) {
            if (name === 'economyReconcilePass') {
              institutionsBeforePowerCloseout = ctx.institutions.map(
                institution => institution.name,
              );
            }
            if (name === 'powerEconomyReconcilePass') {
              powerCloseoutCount += 1;
              institutionsAfterPowerCloseout = ctx.institutions.map(
                institution => institution.name,
              );
            }
          },
        };
        const first = generate(config, seed, options);
        const replay = generate(config, seed);

        expect(first.powerStructure).toEqual(replay.powerStructure);
        expect(powerCloseoutCount).toBe(1);
        expect(institutionsAfterPowerCloseout).toEqual(
          institutionsBeforePowerCloseout,
        );
        expect(first.powerStructure.powerProjectionVersion).toBe(1);
        expect(first.powerStructure.economyInputFingerprint).toBe(
          fingerprintPowerEconomyInput(first.economicState, first.tier),
        );
        expect(() => assertPowerEconomyFreshness(
          first.powerStructure,
          first.economicState,
          first.tier,
        )).not.toThrow();

        const expectedLegitimacy = computePublicLegitimacy(
          first.economicState,
          first.defenseProfile.readiness.label,
          first.tier,
        );
        expect(first.powerStructure.publicLegitimacy).toEqual(
          expectedLegitimacy,
        );
        expect(first.powerIntent).toBeUndefined();
      }
    }
  });

  test('the freshness assertion fails closed on changed or missing economic input', () => {
    const settlement = generate(
      STALE_SEED_CONFIG,
      'power-freshness-assertion',
    );
    const changedEconomicState = {
      ...settlement.economicState,
      prosperity:
        settlement.economicState.prosperity === 'Wealthy'
          ? 'Poor'
          : 'Wealthy',
    };
    expect(() => assertPowerEconomyFreshness(
      settlement.powerStructure,
      changedEconomicState,
      settlement.tier,
    )).toThrow(/freshness invariant failed/i);

    expect(() => assertPowerEconomyFreshness(
      {
        ...settlement.powerStructure,
        economyInputFingerprint: undefined,
      },
      settlement.economicState,
      settlement.tier,
    )).toThrow(/no economy fingerprint/i);
  });

  // TIER CHANGED city -> thorp on 2026-08-01, and the change is a FINDING, not a tidy-up.
  // This test needs a neighbour-sourced faction to exist so that "it survives both final
  // projections" is a claim about survival rather than a comparison of two empty arrays.
  // After wave I1, no seed produces one at city tier: neighbourFactions injects a mirror
  // only when `!existingTypes.has(fType)`, and a post-I1 city already holds every faction
  // category the bias can name (economy, military, religious, criminal), so the gate is
  // shut for EVERY relationship type. Measured on this tree: 0 of 200 seeds at city and
  // 0 of 60 at town, against 14 of 60 at thorp. Ablating just the four new catalog entries
  // in memory restores the original single mirror on the original seed, which is what
  // identifies I1 as the cause. Re-pinning the length to 0 was rejected outright: it would
  // convert this into a vacuous-absence pin, which is precisely the failure the
  // `toHaveLength(1)` line was written to prevent. The underlying question — whether a
  // city should be structurally incapable of receiving neighbour influence — is a design
  // call and is escalated in the reconciliation report, not decided here.
  test('neighbour identities and raw rolls survive both final projections', () => {
    const neighbour = generateSettlementPipeline(
      {
        settType: 'city',
        culture: 'imperial',
        tradeRouteAccess: 'port',
        priorityMilitary: 70,
      },
      null,
      { seed: 'renorm-neighbour-fixture', customContent: {} },
    );
    let rolledNeighbours = [];
    const settlement = generateSettlementPipeline(
      {
        settType: 'thorp',
        culture: 'imperial',
        tradeRouteAccess: 'road',
        _neighbourRelType: 'allied',
      },
      neighbour,
      {
        seed: 'renorm-allied-2',
        customContent: {},
        onStep(name, ctx) {
          if (name !== 'neighbourFactions') return;
          rolledNeighbours = ctx.powerStructure.factions
            .filter(faction => faction.source?.startsWith('neighbour_'))
            .map(faction => ({
              faction: faction.faction,
              desc: faction.desc,
              source: faction.source,
              neighbourName: faction.neighbourName,
              rawPower: faction.rawPower,
            }));
        },
      },
    );
    const finalNeighbours = settlement.powerStructure.factions
      .filter(faction => faction.source?.startsWith('neighbour_'))
      .map(faction => ({
        faction: faction.faction,
        desc: faction.desc,
        source: faction.source,
        neighbourName: faction.neighbourName,
        rawPower: faction.rawPower,
      }));

    expect(rolledNeighbours).toHaveLength(1);
    expect(finalNeighbours).toEqual(rolledNeighbours);
    expect(
      settlement.powerStructure.factions.reduce(
        (sum, faction) => sum + faction.power,
        0,
      ),
    ).toBe(100);
  });
});

describe('EM-R3 — the power structure is final under a held pin', () => {
  test('A1 — the replay does not run under a held structure: the DM roster survives a changed world', () => {
    const rows = nonDesertCorpus();
    // ANTI-VACUITY: the declared census corpus, not an empty or truncated list.
    expect(rows).toHaveLength(57);
    const pinTaken = [];
    const heldIdentical = [];
    const shareKept = [];
    const threw = [];
    const controlOverwritten = [];
    const controlThrew = [];
    const controlKept = [];
    for (const row of rows) {
      const { held, name, want } = heldWithHalvedShare(baselineFor(row));
      const changed = { ...row, terrainOverride: 'desert' };
      const before = text(held);
      try {
        const after = throughTheMember(changed, held, (step, ctx) => {
          if (step !== 'generatePower') return;
          const seen = factionNamed(ctx.powerStructure, name);
          if (seen && seen.power === want) pinTaken.push(row._seed);
        });
        if (text(after.powerStructure) === before) heldIdentical.push(row._seed);
        const got = factionNamed(after.powerStructure, name);
        if (got && got.power === want) shareKept.push(row._seed);
      } catch (error) {
        threw.push(`${row._seed}: ${error.message}`);
      }
      try {
        const control = withoutThePinChannel(changed, held);
        if (text(control.powerStructure) !== before) controlOverwritten.push(row._seed);
        const got = factionNamed(control.powerStructure, name);
        if (got && got.power === want) controlKept.push(row._seed);
      } catch (error) {
        controlThrew.push(`${row._seed}: ${error.message}`);
      }
    }

    expect(threw, 'a pinned re-derivation refused a held power structure').toEqual([]);
    // ANTI-VACUITY: every row really took the pin at the producer, so the identity below is
    // a property of the held bag and not of a bag that never arrived.
    expect(pinTaken).toHaveLength(rows.length);
    expect(heldIdentical, 'the held power structure came back changed').toHaveLength(rows.length);
    expect(shareKept, "the DM's halved share was lost").toHaveLength(rows.length);

    // THE COUNTERFORCE, same bag, no pins channel: the replay overwrites the roster in 56 rows
    // and refuses the 57th by the roster assert, and the DM's share survives in NONE of them.
    expect(controlOverwritten).toHaveLength(56);
    expect(controlThrew).toHaveLength(1);
    expect(controlKept, 'the counterforce kept the share, so this arm proves nothing').toEqual([]);
  }, 180_000);

  test('A2 — the seat change sticks instead of throwing, and the roster assert is unweakened', () => {
    const rows = nonDesertCorpus();
    const seatKept = [];
    const threw = [];
    const controlThrew = [];
    const controlKept = [];
    const controlMessages = new Set();
    for (const row of rows) {
      const moved = heldWithMovedSeat(baselineFor(row));
      if (!moved) continue;
      try {
        const after = throughTheMember(row, moved.held);
        const got = factionNamed(after.powerStructure, moved.name);
        if (got?.isGoverning === true) seatKept.push(row._seed);
      } catch (error) {
        threw.push(`${row._seed}: ${error.message}`);
      }
      try {
        const control = withoutThePinChannel(row, moved.held);
        const got = factionNamed(control.powerStructure, moved.name);
        if (got?.isGoverning === true) controlKept.push(row._seed);
      } catch (error) {
        controlThrew.push(row._seed);
        controlMessages.add(error.message);
      }
    }

    expect(threw, 'a seat change still refuses under a held power structure').toEqual([]);
    expect(seatKept, 'the newly seated faction is not governing in the finished record')
      .toHaveLength(rows.length);

    // RED-FIRST / NEGATIVE CONTROL: the identical bag with no pins channel enters the replay,
    // and `assertStableGeneratedRoster` refuses it in every row, by its whole sentence.
    expect(controlThrew).toHaveLength(rows.length);
    expect(controlKept, 'the counterforce kept the seat, so this arm proves nothing').toEqual([]);
    expect([...controlMessages]).toEqual([ROSTER_REFUSAL]);

    // UNWEAKENED IN SOURCE, TOO: one declaration, module-private, and no pin reaches it.
    const reconcileSource = readFileSync(RECONCILE_FILE, 'utf-8');
    expect(
      reconcileSource.match(/function assertStableGeneratedRoster\(currentFactions, projectedFactions\) \{/g),
      'the roster assert lost its one declaration',
    ).toHaveLength(1);
    // The toHaveLength(1) above proves the declaration is live and this file was really read, so
    // anchored: the exclusion below measures that it stayed module-private, never that it vanished.
    expect(reconcileSource).not.toContain('export function assertStableGeneratedRoster');
  }, 180_000);

  test('A3 — the freshness assert is pin-aware at its three call sites', () => {
    const rows = nonDesertCorpus();
    const callCounts = new Set();
    const staleAtCloseout = [];
    const threw = [];
    let staleWitness = null;
    for (const row of rows) {
      const { held } = heldWithHalvedShare(baselineFor(row));
      const changed = { ...row, terrainOverride: 'desert' };
      let isStale = false;
      seam.assertCalls = 0;
      seam.countAsserts = true;
      try {
        const after = throughTheMember(changed, held, (name, ctx) => {
          if (name !== 'economyReconcilePass') return;
          const expected = fingerprintPowerEconomyInput(ctx.economicState, ctx.tier);
          if (ctx.powerStructure?.economyInputFingerprint !== expected) isStale = true;
        });
        if (isStale && staleWitness === null) {
          staleWitness = { held, economicState: after.economicState, tier: after.tier };
        }
      } catch (error) {
        threw.push(`${row._seed}: ${error.message}`);
      } finally {
        seam.countAsserts = false;
      }
      callCounts.add(seam.assertCalls);
      if (isStale) staleAtCloseout.push(row._seed);
    }

    expect(threw, 'the freshness assert refused a held power structure').toEqual([]);
    // THE COUNT IS THE ARM: three sites, reached exactly three times per run, in every row.
    expect([...callCounts]).toEqual([3]);

    // THE COUNTERFORCE, and the reason the two halves are ONE member: in 42 of the 57 rows the
    // held receipt is already stale against the changed world's economy when the closeout runs,
    // so an assert that was not pin-aware would refuse there.
    expect(staleAtCloseout).toHaveLength(42);
    expect(staleWitness, 'no stale row was captured, so the refusal below proves nothing')
      .not.toBeNull();
    expect(() => assertPowerEconomyFreshness(
      staleWitness.held, staleWitness.economicState, staleWitness.tier,
    )).toThrow(/freshness invariant failed/i);

    // ANTI-VACUITY: with NO pin bag the same three sites still compare on every run.
    seam.assertCalls = 0;
    seam.countAsserts = true;
    try {
      runHeadless(rows[0], createPRNG(rows[0]._seed));
    } finally {
      seam.countAsserts = false;
    }
    expect(seam.assertCalls).toBe(3);
  }, 180_000);

  test('A4 — the golden is unmoved by construction, and a held bag does move it', () => {
    const rows = goldenCorpus();
    const manifest = JSON.parse(readFileSync(GOLDEN_MANIFEST, 'utf-8'));
    const stride = Math.max(1, Math.floor(rows.length / 40));
    const digestOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
    const moved = [];
    const diverged = [];
    let checked = 0;
    for (let index = 0; index < rows.length; index += stride) {
      const row = rows[index];
      const { _seed: seed, ...config } = row;
      checked += 1;
      const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
      if (manifest[keyOf(row)] !== digestOf(settlement)) moved.push(keyOf(row));
      // ANTI-VACUITY, on ONE instrument: the same row through the same runner, once plain and
      // once with the DM's held bag. The identity above is a measurement only if this differs.
      const plain = baselineFor(row);
      const { held } = heldWithHalvedShare(plain);
      const pinned = throughTheMember(row, held);
      if (digestOf(pinned.settlement) !== digestOf(plain.settlement)) diverged.push(keyOf(row));
    }

    expect(checked).toBeGreaterThanOrEqual(40);
    expect(moved, 'the pin-aware guards moved generated output with no pin bag').toEqual([]);
    expect(diverged, 'a held, edited bag left the record identical').toHaveLength(checked);
  }, 180_000);

  test('A5 — no new stream, no new draw, and the later mint disappears', () => {
    const row = nonDesertCorpus()[0];
    const record = baselineFor(row);
    const mintSeed = `${row._seed}::generatePower::power-structure`;
    expect(mintSeeds.actualKeys, 'the recorder no longer stands over the real module')
      .toContain('createPRNG');
    expect(record.powerIntent.rngSeed, 'the power stream seed moved').toBe(mintSeed);

    /** Every mint the run takes, drained at each step boundary so the windows are separable. */
    const mintsByWindow = (held) => {
      const windows = new Map();
      mintSeeds.seeds = [];
      mintSeeds.on = true;
      try {
        const options = { onStep: (name) => { windows.set(name, mintSeeds.seeds.splice(0)); } };
        if (held) {
          Object.assign(options, {
            pins: { powerStructure: structuredClone(held) },
            onStrictViolation: () => {},
          });
        }
        runHeadless(row, createPRNG(row._seed), options);
        windows.set('after the last step', mintSeeds.seeds.splice(0));
      } finally {
        mintSeeds.on = false;
      }
      return windows;
    };
    const flat = (windows) => [...windows.values()].flat();

    const unpinned = mintsByWindow(null);
    const { held } = heldWithHalvedShare(record);
    const pinned = mintsByWindow(held);

    // WITH NO PIN BAG the seed is minted in BOTH windows: the producer's own projection and the
    // bounded closeout's replay of the very same intent.
    expect(unpinned.get('generatePower')).toContain(mintSeed);
    expect(unpinned.get('powerEconomyReconcilePass')).toContain(mintSeed);
    // ANTI-VACUITY: the recorder was live in the pinned run too, so the absence below is about
    // THIS seed and not about a recorder that stopped recording.
    expect(flat(pinned).length).toBeGreaterThan(0);
    // THE WHOLE-RUN ABSENCE: under a held structure the power stream is minted nowhere at all.
    expectPresentThenAbsent(
      flat(unpinned), flat(pinned), mintSeed,
      'A5: a held powerStructure mints the power stream nowhere in the whole run',
    );

    // AND NO NEW STREAM: the entropy census's two site counts are unmoved by this member.
    expect(createPrngSites('src/domain')).toBe(36);
    expect(createPrngSites('src')).toBe(47);
  }, 180_000);

  test("A6 — the receipt stays the record's and the trace refresher is a measured no-op", () => {
    const rows = nonDesertCorpus();
    const receiptKept = [];
    const identicalWithoutRefresher = [];
    const threw = [];
    const refreshedAway = [];
    for (const row of rows) {
      const { held } = heldWithHalvedShare(baselineFor(row));
      const changed = { ...row, terrainOverride: 'desert' };
      try {
        const withRefresher = throughTheMember(changed, held);
        seam.skipRefresh = true;
        let without;
        try {
          without = throughTheMember(changed, held);
        } finally {
          seam.skipRefresh = false;
        }
        if (withRefresher.powerStructure?.economyInputFingerprint
          === held.economyInputFingerprint) receiptKept.push(row._seed);
        if (text(withRefresher) === text(without)) identicalWithoutRefresher.push(row._seed);
      } catch (error) {
        threw.push(`${row._seed}: ${error.message}`);
      }
      // ANTI-VACUITY: with NO pin bag the replay refreshes that receipt, so "it stayed the
      // record's" is a measurement rather than a field nothing ever writes.
      try {
        const control = withoutThePinChannel(changed, held);
        if (control.powerStructure?.economyInputFingerprint
          !== held.economyInputFingerprint) refreshedAway.push(row._seed);
      } catch { /* the roster assert refuses one row; it is counted by A1's own control */ }
    }

    expect(threw).toEqual([]);
    expect(receiptKept, "the held receipt was recomputed inside generation").toHaveLength(rows.length);
    expect(identicalWithoutRefresher, 'the trace refresher moved the record under a held structure')
      .toHaveLength(rows.length);
    // 41 of the 57: the desert world moves the fingerprint's own inputs in those rows, one more
    // row is refused outright by the roster assert, and the rest reach the same fingerprint by
    // arithmetic. What matters is that the replay DOES recompute this receipt when no pin is held.
    expect(refreshedAway).toHaveLength(41);

    // ANTI-VACUITY (2): the refresher is not inert in general — skip it on an UNPINNED run and
    // the record moves, so the identity above is a property of the HELD path.
    const stride = rows.filter((_, index) => index % 6 === 0);
    const movedWhenSkipped = [];
    for (const row of stride) {
      const plain = text(runHeadless(row, createPRNG(row._seed)));
      seam.skipRefresh = true;
      let skipped;
      try {
        skipped = text(runHeadless(row, createPRNG(row._seed)));
      } finally {
        seam.skipRefresh = false;
      }
      if (plain !== skipped) movedWhenSkipped.push(row._seed);
    }
    expect(stride.length).toBeGreaterThanOrEqual(8);
    // MEASURED: it moves the record in 5 of these 10 rows — it re-keys a generatePower trace
    // only where the replay actually moved a faction identity. The claim here is that the seam
    // is LIVE, not that every row exercises it.
    expect(movedWhenSkipped.length, 'the refresher changes nothing even unpinned: the seam is inert')
      .toBeGreaterThan(0);
  }, 180_000);
});
