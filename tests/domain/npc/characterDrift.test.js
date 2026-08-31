/**
 * characterDrift.test.js — the drift state's laws (W-LIVES car L2).
 *
 * Four things are pinned here, and each exists because its absence has a name in
 * this estate's history:
 *
 *   THE IDENTITY RULING (ODQ 850). Drift keys on the durable `wnpc_` identity, so
 *   the rebind the L2 recon executed — a keeper moves npc_6 -> npc_8 while `npc_6`
 *   comes to name a stranger — is STRUCTURALLY impossible rather than remembered.
 *   The proof is not "we key on the right thing"; it is the stranger, driven
 *   through the same writer, arriving at a DIFFERENT chart.
 *
 *   BYTE-IDENTITY. An undrifted world serializes exactly as a pre-drift one, and
 *   `effectiveCharacter` hands back the authored object BY REFERENCE — so the claim
 *   is checkable by identity rather than by a diff that could pass on a lucky copy.
 *
 *   THE PANEL'S TWO AMENDMENTS. F9's materialization floor (both directions, plus
 *   the consequence F9 does not state) and F11's band-bounded clamp.
 *
 *   DARK BY CONSTRUCTION. Two independent darknesses: the virtual flag TE-VIRT-1
 *   owes a home to, and no production importer at all.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: a loop-registered
 * suite is TEST_UNREGISTERED to the lighting census and its assertions are then
 * evidence nowhere, however green vitest reports it.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  AXIS_LEVELS,
  CHARACTER_DRIFT_FLAG_KEY,
  CHARACTER_DRIFT_KEY,
  DRIFT_PROVENANCE,
  MATERIALIZATION_EPSILON,
  MAX_AXIS_OFFSET,
  OFFSET_DECIMALS,
  OFFSET_SCALE,
  SPECTRUM_HALF_SPAN,
  applyAxisDrift,
  axisOffsetAt,
  axisOffsetOf,
  characterDriftActive,
  characterDriftOf,
  driftEntryOf,
  effectiveCharacter,
  positionValue,
  setCharacterDrift,
  valuePosition,
  writeAxisDrift,
} from '../../../src/domain/npc/characterDrift.js';
import { durableIdForRoster, npcLedgerOf } from '../../../src/domain/worldPulse/npcLedger.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');

/** A world with BOTH doors open: the drift flag and the ledger the mint needs. */
const lit = (extra = {}) => ({
  tick: 10,
  simulationRules: { [CHARACTER_DRIFT_FLAG_KEY]: true, npcConsequencesEnabled: true },
  ...extra,
});

/** The same world with the ledger dark — drift on, no identity to key on. */
const litNoLedger = (extra = {}) => ({
  tick: 10,
  simulationRules: { [CHARACTER_DRIFT_FLAG_KEY]: true },
  ...extra,
});

const ROSTER = { rosterId: 'npc_6', name: 'Wolfhard Schenk', role: 'Reeve' };
const SEED = 'drift-seed';
const TOWN = 'save.town';

/** Write one drift delta for the fixture roster identity. */
const write = (worldState, delta, { axisId = 'CANDOR', tick = 10, rosterIdentity = ROSTER } = {}) =>
  writeAxisDrift({ worldState, settlementSeed: SEED, settlementId: TOWN, rosterIdentity, axisId, delta, tick });

describe('the constants are DERIVED, and the module says what is unsigned', () => {
  test('the spectrum is the band ladder, and the clamp is its full span', () => {
    expect(AXIS_LEVELS).toEqual(['a_touch', 'marked', 'defining']);
    expect(SPECTRUM_HALF_SPAN).toBe(AXIS_LEVELS.length);
    // F11 wants a BAND-BOUNDED clamp. The widest such bound is the offset that
    // carries one pole's extreme to the other's — derived, never authored.
    expect(MAX_AXIS_OFFSET).toBe(2 * AXIS_LEVELS.length);
  });

  test('the floor is a quarter band, and rounding can never decide materialization', () => {
    expect(MATERIALIZATION_EPSILON).toBe(1 / 4);
    // The persisted width must be far finer than the floor, or the rounding step
    // would silently become the sparsity rule.
    expect(1 / OFFSET_SCALE).toBeLessThan(MATERIALIZATION_EPSILON / 100);
    // And the scale is built by integer multiplication, never by `**` — a
    // transcendental site is not bit-guaranteed across engines, which is how a
    // same-seed replay diverges on somebody else machine and nowhere on yours.
    expect(OFFSET_SCALE).toBe(10000);
  });

  test('the module declares itself OWNER-UNSIGNED and names its rows', () => {
    expect(DRIFT_PROVENANCE.signedBy).toBeNull();
    expect(DRIFT_PROVENANCE.consumers).toContain('NONE by design');
    expect(DRIFT_PROVENANCE.ownerRows.length).toBeGreaterThanOrEqual(4);
  });

  test('RECONCILE PIN — the mirror is PROVEN, and the proof moved to ONE census', () => {
    // ⭐⭐ THIS PIN WAS A SOURCE-TEXT REGEX SCRAPE OF L1's FILE, with a dead
    // `existsSync` arm for a catalog that is now permanently present. It passed, but
    // it asserted a claim about TEXT — the exact class the substrate coupling spent
    // four walkers curing everywhere else in this file. The live equality now lives
    // in `tests/domain/npc/paradigmAxisCatalog.test.js`'s MIRROR CENSUS, beside the
    // other three restatements, because ONE census over four mirrors is a census and
    // four scattered scrapes are four things to remember.
    //
    // ⚠ AND THE MIRROR ITSELF IS RETAINED DELIBERATELY. An import here would reach the
    // catalog from `characterConsumers.js` — which `personaSlicer`, `clergyTraitPlane`
    // and `espionageTap` all import — lighting a 628-line table on a production path
    // and spending a darkness L1's own walker reserves to car L5's re-pointing. What
    // is kept here is the LOCAL half: the ladder this module's own arithmetic depends on.
    expect(existsSync(join(REPO_ROOT, 'src/domain/npc/paradigmAxisCatalog.js'))).toBe(true);
    expect([...AXIS_LEVELS]).toEqual(['a_touch', 'marked', 'defining']);
    expect(SPECTRUM_HALF_SPAN).toBe(AXIS_LEVELS.length);
  });
});

describe('THE GATE — dark is a whole-entry-point early return', () => {
  test('an absent flag reads dormant, and every writer no-ops by reference', () => {
    const dark = { tick: 10, simulationRules: { npcConsequencesEnabled: true } };
    expect(characterDriftActive(dark)).toBe(false);
    expect(characterDriftActive(null)).toBe(false);
    expect(characterDriftActive({ simulationRules: { [CHARACTER_DRIFT_FLAG_KEY]: 'true' } })).toBe(false);
    const before = JSON.stringify(dark);
    const applied = applyAxisDrift({ worldState: dark, wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: 2, tick: 10 });
    expect(applied.worldState).toBe(dark);
    expect(applied.changed).toBe(false);
    const written = write(dark, 2);
    expect(written.worldState).toBe(dark);
    expect(written.refusal).toBe('dormant');
    expect(JSON.stringify(dark)).toBe(before);
  });

  test('an empty map DROPS its key, so a drained world is byte-identical to a virgin one', () => {
    const virgin = { tick: 4 };
    const withKey = { tick: 4, [CHARACTER_DRIFT_KEY]: { wnpc_1: { CANDOR: { offset: 1, updatedTick: 2 } } } };
    expect(JSON.stringify(setCharacterDrift(withKey, {}))).toBe(JSON.stringify(virgin));
    // A no-op fold hands back the SAME reference, so an upstream change detector
    // cannot be defeated into a durable write on every quiet tick.
    expect(setCharacterDrift(virgin, {})).toBe(virgin);
  });
});

describe('the read model is TOTAL, sorted, and enforces the floor on the way in', () => {
  test('garbage of every shape reads as the empty map', () => {
    for (const ws of [null, undefined, {}, { characterDrift: null }, { characterDrift: [] }, { characterDrift: 'x' }]) {
      expect(characterDriftOf(ws)).toEqual({});
    }
    expect(characterDriftOf({ characterDrift: { wnpc_1: 'nonsense' } })).toEqual({});
    expect(driftEntryOf(null, 'wnpc_1')).toEqual({});
    expect(axisOffsetOf(null, 'wnpc_1', 'CANDOR')).toBe(0);
  });

  test('both levels are codepoint-sorted, so a persisted map is permutation-independent', () => {
    const ws = {
      [CHARACTER_DRIFT_KEY]: {
        wnpc_z: { MERCY: { offset: 1, updatedTick: 1 }, CANDOR: { offset: 1, updatedTick: 1 } },
        wnpc_a: { TRUST: { offset: 1, updatedTick: 1 } },
      },
    };
    const read = characterDriftOf(ws);
    expect(Object.keys(read)).toEqual(['wnpc_a', 'wnpc_z']);
    expect(Object.keys(read.wnpc_z)).toEqual(['CANDOR', 'MERCY']);
  });

  test('a sub-floor cell in a stored file reads as absent (F9 cannot be defeated by a hand edit)', () => {
    const ws = {
      [CHARACTER_DRIFT_KEY]: {
        wnpc_1: { CANDOR: { offset: 0.1, updatedTick: 1 }, MERCY: { offset: 1.5, updatedTick: 1 } },
        wnpc_2: { TRUST: { offset: 0.01, updatedTick: 1 } },
      },
    };
    // An entry whose every cell is under the floor is not an entry at all.
    expect(characterDriftOf(ws)).toEqual({ wnpc_1: { MERCY: { offset: 1.5, updatedTick: 1 } } });
  });
});

describe('the spectrum — seven rungs, and the two directions are the same journey', () => {
  test('every authored (pole, level) round-trips through its band value', () => {
    for (const [rung, level] of AXIS_LEVELS.entries()) {
      expect(positionValue({ pole: 'virtue', level })).toBe(rung + 1);
      expect(positionValue({ pole: 'vice', level })).toBe(-(rung + 1));
      expect(valuePosition(rung + 1)).toEqual({ pole: 'virtue', level });
      expect(valuePosition(-(rung + 1))).toEqual({ pole: 'vice', level });
    }
  });

  test('neutral carries NO pole, and an unreadable chart makes no claim', () => {
    expect(valuePosition(0)).toEqual({});
    expect(positionValue({})).toBe(0);
    expect(positionValue({ pole: 'virtue', level: 'not_a_band' })).toBe(0);
    expect(positionValue({ pole: 'neither', level: 'marked' })).toBe(0);
    expect(positionValue(null)).toBe(0);
  });

  test('banding is SYMMETRIC about zero and clamped to the spectrum', () => {
    // Math.round is half-UP, so -0.5 -> -0 and +0.5 -> +1: an asymmetry that would
    // make a virtue curdling into its vice behave unlike the reverse.
    expect(valuePosition(0.5)).toEqual({ pole: 'virtue', level: 'a_touch' });
    expect(valuePosition(-0.5)).toEqual({ pole: 'vice', level: 'a_touch' });
    expect(valuePosition(99)).toEqual({ pole: 'virtue', level: 'defining' });
    expect(valuePosition(-99)).toEqual({ pole: 'vice', level: 'defining' });
  });
});

describe('effectiveCharacter — the one chokepoint, and its byte-identity claim', () => {
  const core = { axes: { CANDOR: { pole: 'virtue', level: 'marked' } } };
  const npc = { id: 'npc_6', character: core };

  test('NO DRIFT returns the authored core BY REFERENCE, not a copy', () => {
    expect(effectiveCharacter(npc, undefined)).toBe(core);
    expect(effectiveCharacter(npc, {})).toBe(core);
    expect(effectiveCharacter(npc, null)).toBe(core);
  });

  test('a drifted axis re-bands; an undrifted sibling is carried verbatim', () => {
    const twoAxes = { axes: { CANDOR: { pole: 'virtue', level: 'marked' }, MERCY: { pole: 'vice', level: 'a_touch' } } };
    const out = effectiveCharacter({ character: twoAxes }, { CANDOR: { offset: 1, updatedTick: 1 } });
    expect(out.axes.CANDOR).toEqual({ pole: 'virtue', level: 'defining' });
    expect(out.axes.MERCY).toBe(twoAxes.axes.MERCY);
  });

  test('THE REVERSAL — a virtue can curdle into its own vice through the midpoint', () => {
    const out = effectiveCharacter(npc, { CANDOR: { offset: -4, updatedTick: 1 } });
    expect(out.axes.CANDOR).toEqual({ pole: 'vice', level: 'marked' });
  });

  test('an axis drifted back onto neutral carries no pole and leaves the chart', () => {
    const out = effectiveCharacter(npc, { CANDOR: { offset: -2, updatedTick: 1 } });
    expect(out.axes.CANDOR).toBeUndefined();
  });

  test('drift on an axis the core never authored still reads (latent, per 800.4)', () => {
    const out = effectiveCharacter(npc, { MERCY: { offset: -2, updatedTick: 1 } });
    expect(out.axes.MERCY).toEqual({ pole: 'vice', level: 'marked' });
    expect(out.axes.CANDOR).toEqual({ pole: 'virtue', level: 'marked' });
  });
});

describe('the writer — F9 both ways, F11, and rounding at persistence only', () => {
  const seeded = () => lit({
    [CHARACTER_DRIFT_KEY]: { wnpc_1: { CANDOR: { offset: 0.5, updatedTick: 3 } } },
  });

  test('F9 — a first write under the floor materializes NOTHING', () => {
    const ws = lit();
    const out = applyAxisDrift({ worldState: ws, wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: 0.2, tick: 10 });
    expect(out.materialized).toBe(false);
    expect(out.worldState).toBe(ws);
    expect(characterDriftOf(out.worldState)).toEqual({});
  });

  test('F9 THE OTHER WAY — decaying back under the floor DELETES the cell', () => {
    const out = applyAxisDrift({ worldState: seeded(), wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: -0.4, tick: 11 });
    expect(out.materialized).toBe(false);
    expect(out.changed).toBe(true);
    // The whole key goes, so a soul back at its authored core serializes as one
    // that never drifted.
    expect(out.worldState[CHARACTER_DRIFT_KEY]).toBeUndefined();
  });

  test('⚠ THE CONSEQUENCE F9 DOES NOT STATE — sub-floor pull never accumulates', () => {
    // Nothing sub-floor is stored, so every sub-floor tick starts from zero. Fifty
    // ticks of a 0.2 pull leave the map exactly as empty as one tick did. This is
    // pinned rather than merely documented so the funnel car meets it as a law.
    let ws = lit();
    for (let tick = 0; tick < 50; tick += 1) {
      ws = applyAxisDrift({ worldState: ws, wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: 0.2, tick }).worldState;
    }
    expect(characterDriftOf(ws)).toEqual({});
  });

  test('F11 — the stored offset is clamped to the spectrum\'s full span', () => {
    const out = applyAxisDrift({ worldState: lit(), wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: 1000, tick: 10 });
    expect(out.offset).toBe(MAX_AXIS_OFFSET);
    const back = applyAxisDrift({ worldState: lit(), wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: -1000, tick: 10 });
    expect(back.offset).toBe(-MAX_AXIS_OFFSET);
    // Unclamped, pull/(1-decay) is unbounded: an accumulator would grow invisibly
    // behind a position pinned at the edge, and one tuning change would teleport it.
    expect(applyAxisDrift({ worldState: out.worldState, wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: 1000, tick: 11 }).offset)
      .toBe(MAX_AXIS_OFFSET);
  });

  test('ROUNDING AT PERSISTENCE — n pulls of k and one pull of n*k persist identically', () => {
    // The floating-point associativity class that moved 1 leaf of 29 in the 713
    // dormancy wave: n x k is not k summed n times in IEEE-754. Rounding once, at
    // the persistence boundary, is what keeps the two paths byte-equal.
    let many = seeded();
    for (let i = 0; i < 4; i += 1) {
      many = applyAxisDrift({ worldState: many, wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: 0.1, tick: 10 }).worldState;
    }
    const once = applyAxisDrift({ worldState: seeded(), wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: 0.4, tick: 10 }).worldState;
    expect(JSON.stringify(characterDriftOf(many))).toBe(JSON.stringify(characterDriftOf(once)));
    expect(axisOffsetOf(many, 'wnpc_1', 'CANDOR')).toBe(0.9);
  });

  test('a sibling axis and a sibling soul are untouched by one write', () => {
    const ws = lit({
      [CHARACTER_DRIFT_KEY]: {
        wnpc_1: { CANDOR: { offset: 0.5, updatedTick: 3 }, MERCY: { offset: -1, updatedTick: 2 } },
        wnpc_2: { TRUST: { offset: 2, updatedTick: 1 } },
      },
    });
    const out = applyAxisDrift({ worldState: ws, wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: 1, tick: 12 });
    const drift = characterDriftOf(out.worldState);
    expect(drift.wnpc_1).toEqual({
      CANDOR: { offset: 1.5, updatedTick: 12 },
      MERCY: { offset: -1, updatedTick: 2 },
    });
    expect(drift.wnpc_2).toEqual({ TRUST: { offset: 2, updatedTick: 1 } });
  });

  test('READ-LAST / WRITE-NEXT — a same-tick write is invisible to this tick\'s readers', () => {
    const out = applyAxisDrift({ worldState: lit(), wnpcId: 'wnpc_1', axisId: 'CANDOR', delta: 2, tick: 10 });
    expect(axisOffsetOf(out.worldState, 'wnpc_1', 'CANDOR')).toBe(2);
    // Written ON tick 10: invisible at 10, visible at 11. Every consumer in one
    // fold therefore sees the same chart wherever it runs in the order.
    expect(axisOffsetAt(out.worldState, 'wnpc_1', 'CANDOR', 10)).toBe(0);
    expect(axisOffsetAt(out.worldState, 'wnpc_1', 'CANDOR', 11)).toBe(2);
  });
});

describe('GRADUATION — on first materialized write, and never on a nudge', () => {
  test('the first materialized write mints exactly one durable identity', () => {
    const out = write(lit(), 2);
    expect(out.refusal).toBeNull();
    expect(out.graduated).toBe(true);
    expect(out.materialized).toBe(true);
    expect(String(out.wnpcId)).toMatch(/^wnpc_[0-9a-f]{8}$/);
    expect(axisOffsetOf(out.worldState, out.wnpcId, 'CANDOR')).toBe(2);
    expect(Object.keys(npcLedgerOf(out.worldState).roamers)).toEqual([out.wnpcId]);
  });

  test('a SUB-FLOOR nudge graduates NOBODY — the floor governs the ledger too', () => {
    const ws = lit();
    const out = write(ws, 0.1);
    expect(out.refusal).toBe('below_floor');
    expect(out.graduated).toBe(false);
    expect(out.wnpcId).toBeNull();
    expect(out.worldState).toBe(ws);
    // Graduating a soul for a pull that vanished would be mass graduation for
    // nothing, and graduation is a ONE-WAY door.
    expect(npcLedgerOf(out.worldState).roamers).toEqual({});
  });

  test('a second write is IDEMPOTENT — same id, no second soul', () => {
    const first = write(lit(), 2);
    const second = write(first.worldState, 1, { tick: 11 });
    expect(second.wnpcId).toBe(first.wnpcId);
    expect(second.graduated).toBe(false);
    expect(axisOffsetOf(second.worldState, second.wnpcId, 'CANDOR')).toBe(3);
    expect(Object.keys(npcLedgerOf(second.worldState).roamers)).toEqual([first.wnpcId]);
  });

  test('NO DRIFT WITHOUT A DURABLE IDENTITY — a dark ledger REFUSES, never falls back', () => {
    const ws = litNoLedger();
    const before = JSON.stringify(ws);
    const out = write(ws, 2);
    expect(out.refusal).toBe('no_durable_identity');
    expect(out.wnpcId).toBeNull();
    expect(out.worldState).toBe(ws);
    // The refuted design is a positional fallback wearing a cure's name. There is
    // no such fallback: nothing is written at all.
    expect(JSON.stringify(out.worldState)).toBe(before);
  });

  test('THE REBIND IS STRUCTURALLY IMPOSSIBLE — the stranger at the old slot gets their own chart', () => {
    // The recon's executed scenario, at the level this module can decide it: the
    // keeper's chart is minted, the roster reroll moves them npc_6 -> npc_8, and a
    // STRANGER now answers to npc_6. Drive the stranger through the same writer.
    const keeper = write(lit(), 2);
    const stranger = write(keeper.worldState, 3, {
      rosterIdentity: { rosterId: 'npc_6', name: 'Ortlieb Schäfer', role: 'Reeve' },
      tick: 11,
    });
    expect(stranger.wnpcId).not.toBe(keeper.wnpcId);
    expect(stranger.graduated).toBe(true);
    // The keeper's chart is untouched — the stranger inherited nothing.
    expect(axisOffsetOf(stranger.worldState, keeper.wnpcId, 'CANDOR')).toBe(2);
    expect(axisOffsetOf(stranger.worldState, stranger.wnpcId, 'CANDOR')).toBe(3);
    // And the keeper, found at their MOVED slot, still resolves to their own id —
    // which is what car 1's originRef refresh buys and what makes this true after a
    // real reroll rather than only in this fixture.
    expect(durableIdForRoster(stranger.worldState, TOWN, { rosterId: 'npc_6', name: 'Wolfhard Schenk' }))
      .toBe(keeper.wnpcId);
  });

  test('a drifted soul in one town is not the same soul in another', () => {
    const here = write(lit(), 2);
    const away = writeAxisDrift({
      worldState: here.worldState,
      settlementSeed: SEED,
      settlementId: 'save.other',
      rosterIdentity: ROSTER,
      axisId: 'CANDOR',
      delta: 2,
      tick: 11,
    });
    expect(away.wnpcId).not.toBe(here.wnpcId);
    expect(Object.keys(npcLedgerOf(away.worldState).roamers).sort())
      .toEqual([here.wnpcId, away.wnpcId].sort());
  });
});

describe('DARK BY CONSTRUCTION — two independent darknesses', () => {
  /** @param {string} dir @returns {string[]} */
  function jsFilesUnder(dir) {
    /** @type {string[]} */
    const out = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) out.push(...jsFilesUnder(full));
      else if (/\.(js|jsx|ts|tsx|mjs)$/.test(entry.name)) out.push(full);
    }
    return out;
  }

/**
 * ⚠⚠ COMMENTS ARE STRIPPED BEFORE ANY CLOSURE SCAN, AMENDED BY CAR L5, AND IT IS A
 * SHARPENING RATHER THAN A LOOSENING. An IMPORT is a dependency; a CITATION is not.
 * L5's consumer seam is documented by name in the files that consume it — and in
 * `corruption.js`, whose comment says in as many words that it must NOT import it —
 * so a raw substring scan convicted three files for explaining themselves, and would
 * have paid for the closure claim by making the code less legible. Exactly L4's own
 * lesson one car earlier, when a substring ban on `simulationRules` had to become a
 * DEREFERENCE ban because the catalog cites its own proof.
 *
 * The claim is unchanged and is asserted on the CODE.
 * @param {string} text
 */
const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

/**
 * ⛔⛔ AND STRIPPING COMMENTS IS NOT ENOUGH — A FROZEN DATA ROSTER IS A CITATION TOO,
 * AND SO IS A REFUSAL LIST. THE SUBSTRATE COUPLING FOUND BOTH, AND THE SECOND IS A
 * SHAPE NOBODY HAD SEEN.
 *
 * L4 turned a substring ban into a dereference ban because the catalog cites its own
 * proof. L5 stripped comments because three files were convicted for explaining
 * themselves. The coupling then convicted TWO MORE files that survived the strip
 * because neither citation was a comment:
 *
 *   • `operationGrammar.js` records `home: 'src/domain/npc/characterDrift.js'` in a
 *     frozen acceptance roster — a module PATH quoted as data, never a dependency;
 *   • `customContentSchema.js` lists `'characterDrift'` inside
 *     `DEITY_REFUSED_DRIFT_KEYS` — ⭐ a BAN LIST. It names the symbol for the express
 *     purpose of REFUSING it, which is the exact opposite of depending on it. A
 *     detector that reads a refusal as a dependency has inverted its own question.
 *
 * ⭐ THE CLAIM IS UNCHANGED AND THE DETECTOR IS STRICTLY STRONGER: an IMPORT SPECIFIER
 * resolving to the module, or a DEREFERENCE of one of its uniquely-owned exports —
 * which additionally catches an aliased import plus a call that the path scan alone
 * would miss. Both directions are pinned by the control below.
 *
 * ⚠ `AXIS_LEVELS` is deliberately ABSENT from the drift roster: `paradigmAxisCatalog.js`
 * exports that name too, so a dereference arm carrying it would convict every reader
 * of the catalog. The uniqueness control measures this rather than trusting it.
 */
const DRIFT_SYMBOLS = Object.freeze([
  'characterDriftActive', 'characterDriftOf', 'setCharacterDrift', 'driftEntryOf',
  'axisOffsetOf', 'axisOffsetAt', 'effectiveCharacter', 'applyAxisDrift', 'writeAxisDrift',
  'CHARACTER_DRIFT_KEY', 'CHARACTER_DRIFT_FLAG_KEY', 'DRIFT_PROVENANCE',
]);
const FUNNEL_SYMBOLS = Object.freeze([
  'EXPERIENCE_TABLE', 'LIVED_EXPERIENCE_KINDS', 'AMBIENT_EXPERIENCE_KINDS',
  'experienceKindOf', 'experienceRowOf',
  'foldLivedExperience', 'effectiveChartOf', 'decayCharacterDrift', 'characterLegacyRecord',
  'collectLivedExperience', 'LIVED_EXPERIENCE_SOURCES', 'SOURCE_ADAPTER_OF',
]);
const CONSUMER_SYMBOLS = Object.freeze([
  'riskRegister', 'vettingTemperBand', 'effectiveDescriptors', 'derivedAlignment',
  'effectiveAxesOf', 'lensDrift', 'viceDepth', 'corruptibleAxisByDepth',
  'RISK_TERMS', 'CORRUPTIBLE_AXIS_VECTORS', 'RISK_CENTER_AXES',
  // ⛔ `VETTING_TEMPER_BANDS` IS DELIBERATELY ABSENT — and the uniqueness control
  // below is what found it, on this very car's first run. `sendTwoDivergence.js`
  // exports that name too, so a dereference arm carrying it would have convicted an
  // envoy leaf of reading the character door. The trap fired on the person who wrote
  // the trap, which is the only kind of control worth having.
]);
const KNOWN_SYMBOLS = Object.freeze(['knownCharacterOf', 'characterAsSeenBy']);

/**
 * @param {string} text @param {RegExp} moduleRe @param {readonly string[]} symbols
 */

/**
 * ⛔⛔⛔ AND A SYMBOL INSIDE A STRING LITERAL IS A CITATION TOO — THE SIXTH SIGHTING
 * OF THIS ESTATE'S LAW, AND IT CONVICTED THE VERY CAR THAT WROTE THE CURE.
 *
 * The dereference arm above was added to catch an aliased import plus a call. On its
 * first run it convicted `livedExperienceCatalog.js` of depending on the witness
 * adapter — on the strength of the RECEIPT STRING that names it:
 * `'faithWitnessSource.js:faithWitnessEntries (religionState pantheon ...)'`. A quoted
 * name followed by a space and a paren is indistinguishable from a call to a scanner
 * that only strips comments.
 *
 * ⭐ THE GENERALISATION, and it is the one this whole family has been converging on:
 * COMMENTS AND STRING LITERALS ARE BOTH CITATIONS. Only two things are dependencies —
 * an import specifier, and a dereference in CODE. So the module arm is asked BEFORE
 * strings are blanked (an import specifier IS a string literal), and the symbol arm is
 * asked AFTER. Ban lists, seam-name constants, `home:` paths and receipt strings all
 * fall out of the detector at once, because they were always the same shape.
 * @param {string} text
 */
const codeWithoutCitations = (text) => stripComments(text)
  .replace(/'(?:[^'\\]|\\.)*'/g, "''")
  .replace(/"(?:[^"\\]|\\.)*"/g, '""')
  .replace(/`(?:[^`\\]|\\.)*`/g, '``');

const dependsOn = (text, moduleRe, symbols) => (
  moduleRe.test(stripComments(text))
    || new RegExp(`\\b(${symbols.join('|')})\\s*[([.]`).test(codeWithoutCitations(text))
);

  test('the drift family has exactly ONE production door, and the WRITERS stay sealed', () => {
    // AMENDED BY CAR L3, which is the act this pin was written to meet: its own
    // comment said a red here "is the funnel car's act". The claim is unchanged —
    // nothing in production can reach drift — but it is now proved as a CLOSURE
    // over two steps instead of one, because the funnel legitimately imports this
    // module and is itself imported by nobody.
    //
    // Weakening it to "characterDrift may have importers" would have been the easy
    // edit and the wrong one: the closure is what the darkness claim actually is.
    //
    // AMENDED AGAIN BY CAR L4, and again by GROWING the family rather than
    // loosening the rule. The source adapters and the reputation read are the two
    // new members: each legitimately names the family, and each is itself imported
    // by nobody. The claim is still that there is no path INTO the family from
    // production — only the family's own membership moved, and every member is
    // asserted present below so the closure cannot pass over a set of typos.
    //
    // ⭐⭐ AMENDED A THIRD TIME BY CAR L5, AND THIS ONE IS AN HONEST NARROWING, SO
    // IT IS WRITTEN DOWN RATHER THAN QUIETLY ABSORBED. L5's whole car is the
    // consumer re-routes §4 asks for, so production DOES now reach the family: the
    // clergy plane, the espionage tap and the persona surface all import
    // `characterConsumers.js`. "No path in" is therefore no longer true and must
    // not be pretended.
    //
    // What replaces it is STRONGER on the half that matters and CHECKED on the
    // half that changed. The load-bearing claim was never that the chart is
    // unreadable — it is that NOTHING IN PRODUCTION CAN WRITE A DRIFT OFFSET. So:
    //
    //   · the DOOR is enumerated: exactly one non-family file may name the drift
    //     module, and it is the consumer seam (step 1);
    //   · the WRITERS are sealed absolutely: no file outside the family may name
    //     `applyAxisDrift` or `writeAxisDrift` at all — a NEW step, and the one
    //     that carries the darkness now (step 1b);
    //   · the FUNNEL stays sealed, which is what actually produces pulls (step 2);
    //   · the door's own production importers are enumerated BY NAME (step 4), so
    //     a fifth consumer cannot arrive without somebody meaning it.
    const FAMILY = [
      'characterDrift.js',
      'knownCharacter.js',
      'livedExperienceCatalog.js',
      'livedExperienceFunnel.js',
      'livedExperienceSources.js',
    ];
    /** The ONE production door onto the family — car L5's consumer seam. */
    const DOOR = 'src/domain/npc/characterConsumers.js';
    /**
     * Every production file allowed to walk through it, enumerated.
     *
     * ⛔⛔ THE FOURTH ROW WAS HIDING BEHIND A RED, AND THAT IS THE FINDING, NOT THE
     * ROW. `acceptanceCharacterReads.js` (the W-OPS acceptance supplier, landed by
     * the coupling's own car 1) really does import the door — and this STEP 4
     * roster never caught it, because STEP 1 above was already failing on a
     * citation, and vitest stops a test at its first failed assertion. The car that
     * landed it measured "zero new reds" truthfully and still moved this roster
     * without anyone seeing it.
     *
     * ⭐ THE LAW: a red at an early assertion BLINDS every later assertion in the
     * same test — the estate's `&&`-chain lesson, arriving inside a single test
     * body. A walker with four enumerated claims is four claims only while it is
     * green.
     *
     * The row is enrolled rather than excluded: the supplier is a deliberate, ruled
     * consumer (it reads the chokepoint alone, precisely so it need not import
     * `characterDrift.js` or `knownCharacter.js`), and it is itself imported by
     * nobody in src — pinned two tests below, so the darkness claim still holds
     * through it.
     */
    const DOOR_CONSUMERS = [
      'src/domain/ai/personaSlicer.js',
      'src/domain/npc/acceptanceCharacterReads.js',
      'src/domain/worldPulse/clergyTraitPlane.js',
      'src/domain/worldPulse/espionage/espionageTap.js',
    ];
    const files = jsFilesUnder(join(REPO_ROOT, 'src'));
    expect(files.length).toBeGreaterThan(100);
    const outside = files.filter((file) => !FAMILY.some((member) => file.endsWith(member)));
    // STEP 1: the ONLY thing outside the family that DEPENDS ON drift is the door.
    // ⭐ "names" became "depends on" at the substrate coupling — see the detector's
    // own header: a frozen `home:` path and a REFUSAL LIST both name this module
    // without depending on it, and both were convicted by the old spelling.
    expect(outside
      .filter((file) => dependsOn(readFileSync(file, 'utf8'), /from\s+'[^']*\/characterDrift\.js'/, DRIFT_SYMBOLS))
      .map((file) => relative(REPO_ROOT, file))).toEqual([DOOR]);
    // STEP 1b, the claim that now carries the darkness: NOTHING outside the family
    // — the door included — may name a drift WRITER. A read that cannot be followed
    // by a write is a read of a map nobody can fill.
    expect(files
      .filter((file) => !FAMILY.some((member) => file.endsWith(member)))
      .filter((file) => /applyAxisDrift|writeAxisDrift/.test(stripComments(readFileSync(file, 'utf8'))))
      .map((file) => relative(REPO_ROOT, file))).toEqual([]);
    // STEP 4: and the door's own importers are the enumerated three.
    expect(files
      .filter((file) => !file.endsWith('characterConsumers.js'))
      .filter((file) => dependsOn(readFileSync(file, 'utf8'), /from\s+'[^']*\/characterConsumers\.js'/, CONSUMER_SYMBOLS))
      .map((file) => relative(REPO_ROOT, file)).sort()).toEqual(DOOR_CONSUMERS);
    // STEP 2: and nothing outside the family names the funnel either, so there is
    // no path INTO the family at all. If this reds, a source adapter was wired
    // early — car L4's act, and it must arrive with the flag door TE-VIRT-1 owes
    // and its own dormancy proof.
    expect(outside
      .filter((file) => dependsOn(readFileSync(file, 'utf8'), /from\s+'[^']*\/livedExperience(Funnel|Catalog|Sources)\.js'/, FUNNEL_SYMBOLS))
      .map((file) => relative(REPO_ROOT, file))).toEqual([]);
    // STEP 3, added by car L4: and nothing outside the family names the reputation
    // read either. ⚠ STILL EMPTY AFTER L5, and that is a real fact about the car:
    // the re-routes L5 landed all take the TRUE chart (the clergy bench is GAP C's
    // structural group projection; the footholds are a deity's sight), so no
    // production reader consumes `knownCharacterOf` yet. The KNOWN read's first
    // consumer is the vetting band's caller and O2's acceptance door.
    expect(outside
      .filter((file) => dependsOn(readFileSync(file, 'utf8'), /from\s+'[^']*\/knownCharacter\.js'/, KNOWN_SYMBOLS))
      .map((file) => relative(REPO_ROOT, file))).toEqual([]);
    // anchored: the family members really are present, so the closure is over a
    // real set rather than passing because the names match nothing.
    for (const member of FAMILY) {
      expect(files.some((file) => file.endsWith(member)), `${member} is missing`).toBe(true);
    }
  });

  test('⭐⭐ THE SHARPENED DETECTOR IS ANTI-VACUOUS IN BOTH DIRECTIONS', () => {
    // Owed by the sharpening, in both directions: a scan that stopped seeing things
    // would report the same rosters forever, and a scan that still convicted
    // citations would have bought the closure by making the code less legible.
    expect(dependsOn("import { effectiveCharacter } from './characterDrift.js';", /from\s+'[^']*\/characterDrift\.js'/, DRIFT_SYMBOLS)).toBe(true);
    // AN ALIASED IMPORT PLUS A CALL — the reach a path-only scan misses.
    expect(dependsOn('const c = effectiveCharacter({ npc });', /from\s+'[^']*\/characterDrift\.js'/, DRIFT_SYMBOLS)).toBe(true);
    expect(dependsOn('const w = writeAxisDrift(state);', /from\s+'[^']*\/characterDrift\.js'/, DRIFT_SYMBOLS)).toBe(true);
    // ⛔ AND THE TWO CITATION SHAPES THE COUPLING ACTUALLY FOUND — a frozen `home:`
    // path, and a BAN LIST. Both were convicted by the old spelling; neither is a
    // dependency, and the second is the opposite of one.
    expect(dependsOn("const row = { home: 'src/domain/npc/characterDrift.js' };", /from\s+'[^']*\/characterDrift\.js'/, DRIFT_SYMBOLS)).toBe(false);
    expect(dependsOn("const REFUSED = Object.freeze(['characterDrift', 'drift', 'effectiveCharacter']);", /from\s+'[^']*\/characterDrift\.js'/, DRIFT_SYMBOLS)).toBe(false);
    expect(dependsOn('// characterDrift lives elsewhere\nconst a = 1;', /from\s+'[^']*\/characterDrift\.js'/, DRIFT_SYMBOLS)).toBe(false);
    // ⛔ AND THE STRING-LITERAL CITATION — a receipt or seam name held as data.
    expect(dependsOn("const receipt = 'characterDrift.js:writeAxisDrift (the sealed writer)';", /from\s+'[^']*\/characterDrift\.js'/, DRIFT_SYMBOLS)).toBe(false);
    // …and the stripper itself is pinned live in both directions.
    expect(stripComments("import { x } from './characterDrift.js';")).toContain('characterDrift');
    expect(stripComments('/** a block naming effectiveCharacter */\nconst a = 1;')).not.toContain('effectiveCharacter');
  });

  test('⛔⛔ EVERY DEREFERENCE SYMBOL IS EXPORTED BY EXACTLY ONE src FILE', () => {
    // The trap the sharpening invents for itself, and it is only reachable once two
    // lines share a tree: a dereference arm keyed on a name TWO modules export
    // convicts whichever file uses the OTHER one's.
    // ⚠ READ EACH FILE ONCE. The first cut re-read all of `src/` PER SYMBOL and
    // timed out at 20s — an O(files x symbols) walk dressed as a one-line helper.
    const texts = jsFilesUnder(join(REPO_ROOT, 'src')).map((file) => readFileSync(file, 'utf8'));
    /** @param {string} symbol */
    const exportersOf = (symbol) => texts
      .filter((text) => new RegExp(`^export (const|function) ${symbol}\\b`, 'm').test(text));
    for (const symbol of [...DRIFT_SYMBOLS, ...FUNNEL_SYMBOLS, ...CONSUMER_SYMBOLS, ...KNOWN_SYMBOLS]) {
      expect(exportersOf(symbol), `${symbol} must be owned by exactly one module`).toHaveLength(1);
    }
    // ⭐ ANCHORED, AND THE ANCHOR IS THE FINDING: `AXIS_LEVELS` really is exported by
    // BOTH `characterDrift.js` and `paradigmAxisCatalog.js` on this coupled tree, so
    // the check above discriminates rather than passing trivially — and it is exactly
    // why that name is absent from DRIFT_SYMBOLS.
    expect(exportersOf('AXIS_LEVELS').length).toBe(2);
    expect(DRIFT_SYMBOLS).not.toContain('AXIS_LEVELS');
  });

  test('⭐ THE DOOR\'S FOURTH CONSUMER IS ITSELF DARK — the darkness survives the new row', () => {
    // The DOOR_CONSUMERS roster gained `acceptanceCharacterReads.js` above. That row
    // is only safe if nothing reaches IT either, so the transitive claim is asserted
    // rather than assumed.
    const files = jsFilesUnder(join(REPO_ROOT, 'src'));
    const reachers = files
      .filter((file) => !file.endsWith('acceptanceCharacterReads.js'))
      .filter((file) => dependsOn(
        readFileSync(file, 'utf8'),
        /from\s+'[^']*\/acceptanceCharacterReads\.js'/,
        ['acceptanceCharacterRead', 'vettingInputFor', 'ACCEPTANCE_READ_TERMS', 'ACCEPTANCE_READ_PROVENANCE'],
      ))
      .map((file) => relative(REPO_ROOT, file));
    expect(reachers).toEqual([]);
    // anchored: the supplier really is on the tree, so the empty list is a fact
    // about its reachability and not about a path that matched nothing.
    expect(files.some((file) => file.endsWith('acceptanceCharacterReads.js'))).toBe(true);
  });

  test('the flag has no DEFAULT_SIMULATION_RULES entry, so no existing campaign carries it', () => {
    const rules = jsFilesUnder(join(REPO_ROOT, 'src'))
      .filter((file) => /DEFAULT_SIMULATION_RULES\s*=/.test(readFileSync(file, 'utf8')));
    // Anchored: the declaration site is found positively before its contents are
    // questioned, so this cannot pass by scanning a tree that moved.
    expect(rules.length).toBeGreaterThan(0);
    for (const file of rules) {
      // anchored: the file set above is asserted non-empty and is the real declaration site
      expect(readFileSync(file, 'utf8')).not.toContain(CHARACTER_DRIFT_FLAG_KEY);
    }
  });

  test('the door seam is NAMED in code, so the flag car has an address not a search', () => {
    const source = readFileSync(join(REPO_ROOT, 'src/domain/npc/characterDrift.js'), 'utf8');
    expect(source.length).toBeGreaterThan(5000);
    expect(CHARACTER_DRIFT_FLAG_KEY).toBe('characterDriftEnabled');
    expect(source).toContain('TE-VIRT-1 OWES THE FLAG\'S HOME');
    // The switch is read in exactly ONE place, through the exported constant, so a
    // second reader cannot invent a second spelling of the same door.
    expect(source.split(CHARACTER_DRIFT_FLAG_KEY).length - 1).toBeLessThanOrEqual(4);
  });
});
