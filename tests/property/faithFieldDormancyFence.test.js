/**
 * faithFieldDormancyFence.test.js — W-FAITH F3c act 2's dormancy proof.
 *
 * ⚠ READ THIS FIRST, BECAUSE THIS FENCE IS SHAPED LIKE `espionageDormancyFence`'s
 * FENCE 1 AND NOT LIKE THE USUAL DORMANCY PIN, AND THE DIFFERENCE IS DELIBERATE.
 * Every other dormancy fence in this estate guards a subsystem that RUNS and is
 * gated. This car's subsystem does not run at all: it lands two pure leaves and
 * NOTHING under `src/` imports either of them. That is the WR-10 dark-instrument
 * shape, and it makes the usual "drive the engine dark, compare the world to
 * itself" pin VACUOUS — it would compare a world to itself through a code path that
 * does not exist, and would stay green if the whole layer were deleted.
 *
 * So the claim is stated at the level where it actually lives:
 *
 *   FENCE 1 — THE IMPORT-CLOSURE CENSUS (own-footprint). No production module under
 *     `src/` imports the faith-field set. For a subsystem with no caller this is
 *     STRICTLY STRONGER than a state pin: a state pin passes on a quiet fixture,
 *     while this fails the moment a caller exists — which is exactly the commit that
 *     owes a real fence. Its guard-the-guard is a POSITIVE CONTROL: the detector must
 *     FIND the imports that do exist (this file's, and the unit tests').
 *     ⚠ ITS LIMIT, STATED: it sees static `from '…'` specifiers only. A dynamic
 *     `await import()` would cross it unseen, exactly as it crosses the coupling
 *     inclusion ratchet's own scan.
 *
 *   FENCE 2 — THE PURITY PIN. The leaves read no clock, no rng and no global state,
 *     so a future caller cannot make them a source of nondeterminism.
 *
 *   FENCE 3 — THE IDENTITY PIN. Reading the field never mutates what it read, so a
 *     caller wiring it into the pulse cannot ghost a settlement.
 *
 * ⛔ WHEN F4c LANDS A CALLER, FENCE 1 IS **REPLACED** BY A DRIVEN BYTE-IDENTITY
 * GOLDEN IN THE SAME COMMIT — never deleted, and never merely loosened. A fence kept
 * past the thing it fences is a false claim with a passing status (F3c act 1's J5).
 */
import { describe, test, expect } from 'vitest';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { faithFieldOf, faithChannelMult, FAITH_CHANNELS } from '../../src/domain/worldPulse/faithField.js';
import { faithWitnessEntries } from '../../src/domain/worldPulse/faithWitnessSource.js';
// W-FAITH F4c — FENCE 4 drives the real seam rather than the kernel, so it imports the
// two production modules the wiring runs through. They are NOT members of FAITH_FIELD_SET
// and so do not perturb the censuses above.
import { projectReligionStateOntoSettlement } from '../../src/domain/worldPulse/religionState.js';
import { deriveCausalState } from '../../src/domain/causalState.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * ⛔ THE DORMANT GOLDEN — a sha256 prefix over the whole projected + derived corpus of
 * FENCE 4, measured at this car's committed tip and frozen here. It is the byte-identity
 * statement the replaced FENCE 1 owed: with nothing authored, the world this subsystem
 * produces is character-for-character what it was.
 *
 * ⚠ IF THIS REDS, DO NOT RE-FREEZE IT. A moved golden means the DORMANT path changed,
 * which is either a real regression or a legitimate behaviour shift that owes a written
 * shift record. Re-freezing without one is how a promise stops being checkable.
 */
const DORMANT_GOLDEN = '6e85308b0f396a77';

/**
 * The module set this car landed, as REPO-RELATIVE PATHS.
 *
 * ⚠⚠ THEY WERE SUFFIXES (`'worldPulse/faithField.js'`) AND THE SUFFIX MATCH HAD A HOLE
 * THIS BIG: a module INSIDE `src/domain/worldPulse/` imports its neighbour as
 * `'./faithField.js'`, which ends with no suffix in that list. Every one of the ~250
 * siblings in that directory — the likeliest home for a field consumer by a wide margin —
 * could have imported the field with this census staying green.
 *
 * ⭐ FOUND BY ACCIDENT, WHICH IS THE POINT WORTH RECORDING. W-FAITH F4c wrote exactly
 * that natural sibling import in `religionState.js`, and the census reported ONE importer
 * where two existed. Nothing in the guard-the-guard arms could have caught it: they all
 * import through the long `../../src/domain/worldPulse/…` path a TEST file must use, so
 * the detector was only ever exercised on the shape that worked. ⇒ F3c's dormancy claim
 * was narrower than its own words, and the cure is to resolve specifiers rather than to
 * match their tails.
 *
 * ⭐⭐ THE THIRD MEMBER ARRIVED BY A SPLIT, NOT BY A NEW FEATURE (SUBSTRATE coupling wave
 * 6, REC-1). `faithChannelBindings.js` is the register plus the pricing pair, lifted out
 * of `faithField.js` verbatim so the EAGER `causalState.js` can price a channel without
 * dragging the field kernel and `piety.js` into the first-paint closure. It is listed
 * here rather than left outside the set for one reason that matters to this census: with
 * it outside, `causalState.js` would have silently LEFT the FENCE 1 roster below — the
 * consumer would still exist, and the fence would report it gone. A split that shrinks a
 * census is the census failing, not the coupling ending.
 */
const FAITH_FIELD_SET = Object.freeze([
  'src/domain/worldPulse/deityFlaws.js', // W-FAITH F5c — the vice-pole flaw register joins the set: its lawful importers are the two leaves beside it (set members, so the census skips them), and any OTHER production importer reds in FENCE 1 exactly as an undeclared field consumer would
  'src/domain/worldPulse/faithChannelBindings.js',
  'src/domain/worldPulse/faithField.js',
  'src/domain/worldPulse/faithTuningSurface.js', // W-FAITH F6c — the tuning signature surface joins the set: its lawful importers are the three leaves it feeds (set members, so the census skips them), and a display module reaching straight for an unsigned tuning table reds in FENCE 1 exactly as an undeclared field consumer would
  'src/domain/worldPulse/faithWitnessSource.js',
]);

/** Resolve an import specifier to a repo-relative path, or '' for a bare/package one.
 *  This is what closes the sibling hole: `./faithField.js` seen from
 *  `src/domain/worldPulse/religionState.js` resolves to the same path the long form does.
 *  @param {string} fromRel the importing file, repo-relative
 *  @param {string} spec    the specifier as written
 *  @returns {string} */
function resolveSpec(fromRel, spec) {
  if (!spec.startsWith('.')) return '';
  return relative(ROOT, join(ROOT, dirname(fromRel), spec)).replace(/\\/g, '/');
}

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));
const TEST_FILES = walk(join(ROOT, 'tests'))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));

/** Static `from '…'` specifiers; comments and strings NOT blanked (a specifier IS a string). */
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g;

/**
 * Which files import any member of the faith-field set.
 * @param {Array<{rel: string, src: string}>} files
 * @returns {string[]}
 */
function importersOf(files) {
  /** @type {string[]} */
  const hits = [];
  for (const { rel, src } of files) {
    // The set's own members may import each other legitimately; the census is about
    // consumers OUTSIDE the set.
    if (FAITH_FIELD_SET.includes(rel)) continue;
    for (const match of src.matchAll(IMPORT_RE)) {
      if (FAITH_FIELD_SET.includes(resolveSpec(rel, match[1]))) { hits.push(rel); break; }
    }
  }
  return hits.sort();
}

describe('FENCE 1 — the import-closure census (own-footprint, for a car with no caller)', () => {
  test('the faith field\'s production importers are EXACTLY the declared consumers', () => {
    // ⛔⛔ THIS ARM WAS "NO PRODUCTION MODULE IMPORTS THE FAITH-FIELD SET" UNTIL W-FAITH
    // F4c WIRED THE CHANNELS. It is REPLACED here, in the commit that added the callers,
    // exactly as this file's header and `faithField.js`'s header both required — never
    // deleted, never loosened to a subset test. A fence kept past the thing it fences is
    // a false claim with a passing status (F3c act 1's J5); a fence DELETED at that
    // moment is worse, because the class it guarded then has no guard at all.
    //
    // What it guards now is the same property, stated for a subsystem that HAS callers:
    // the consumer set is CLOSED and enumerated. An unplanned seventh importer — a
    // display module reaching for the field, a second pulse site recomputing it — reds
    // here rather than quietly becoming a coupling nobody reviewed.
    expect(
      importersOf(SRC_FILES),
      'the faith field gained an UNDECLARED production consumer — add it here with its reason, or route through the two seams that already exist',
    ).toEqual([
      // The boon/bane channel term (F4c). ⚠ Since SUBSTRATE wave 6 it reaches the
      // BINDING LEAF, not `faithField.js` — a first-paint cure, not a decoupling, which
      // is why it is still in this roster and why the leaf is in the set above.
      'src/domain/causalState.js',
      // W-FAITH F7c: the faith tab's deepening read-model. Reads ONLY the frozen
      // registers (channels/strengths/bindings), the tuning surface's tables and
      // the pure faithChannelLift, to band a HANDED-IN projection record for
      // display — it computes no field, holds no state, and writes nothing.
      'src/domain/display/faithDeepening.js',
      'src/domain/worldPulse/religionState.js', // the tick-end projection writer (F4c)
    ]);
  });

  test('⭐ the witness-plane source is STILL dark, and its census keeps the original teeth', () => {
    // The set this file guards is two leaves, and only ONE of them gained a caller. The
    // witness source (F3c act 2b) is still imported by nothing under `src/`, so for that
    // half the strict-empty census is still the RIGHT fence and is kept verbatim rather
    // than folded into the softer registry above. Folding them would have retired a live
    // guarantee as a side effect of wiring an unrelated leaf.
    const WITNESS = 'src/domain/worldPulse/faithWitnessSource.js';
    const witnessImporters = SRC_FILES
      .filter(({ rel }) => rel !== WITNESS)
      .filter(({ rel, src }) => [...src.matchAll(IMPORT_RE)].some((m) => resolveSpec(rel, m[1]) === WITNESS))
      .map(({ rel }) => rel)
      .sort();
    expect(
      witnessImporters,
      'the witness source gained a caller — it owes the W-LIVES funnel reconcile pin, and this fence must be replaced the way FENCE 1 just was',
    ).toEqual([]);
  });

  test('guard the guard: the detector DOES find the importers that exist', () => {
    const testImporters = importersOf(TEST_FILES);
    expect(testImporters.length, 'the scan found nothing anywhere — it is broken, not clean').toBeGreaterThan(1);
    expect(testImporters).toContain('tests/domain/faithFieldEquation.test.js');
    expect(testImporters).toContain('tests/domain/faithWitnessSource.test.js');
    // ⭐ THIS FILE IS IN THAT LIST TOO, and that is correct: it imports both leaves
    // at the top. A fence that excluded itself would be one silent edit away from
    // scanning nothing.
    expect(testImporters).toContain('tests/property/faithFieldDormancyFence.test.js');
  });

  test('guard the guard, negative arm: a fabricated importer IS detected', () => {
    // The positive control above could pass on a scan that merely matched filenames.
    // This one proves the detector reads IMPORT SYNTAX: a file whose text names the
    // module without importing it must NOT be reported.
    const decoy = [
      { rel: 'src/fake/mentions.js', src: '// worldPulse/faithField.js is mentioned in a comment\nconst s = "worldPulse/faithField.js";\n' },
      { rel: 'src/fake/real.js', src: "import { faithFieldOf } from '../domain/worldPulse/faithField.js';\n" },
    ];
    expect(importersOf(decoy)).toEqual(['src/fake/real.js']);
  });

  test('⭐ guard the guard: a SIBLING-DIRECTORY import is detected — the hole this car found', () => {
    // ⛔ THIS ARM EXISTS BECAUSE THE DETECTOR MISSED THIS SHAPE UNTIL W-FAITH F4c WROTE
    // IT. `./faithField.js` from inside `src/domain/worldPulse/` matched no suffix in the
    // old set, so the ~250 siblings in that directory — the likeliest consumers there are
    // — were invisible to the census that claimed no production module imported the field.
    // Every pre-existing guard-the-guard arm used the long path a TEST file must write, so
    // none of them exercised the form that failed.
    const siblings = [
      { rel: 'src/domain/worldPulse/neighbour.js', src: "import { faithFieldOf } from './faithField.js';\n" },
      { rel: 'src/domain/worldPulse/deep/inner.js', src: "import { faithFieldOf } from '../faithField.js';\n" },
      { rel: 'src/domain/worldPulse/innocent.js', src: "import { x } from './piety.js';\n" },
    ];
    expect(importersOf(siblings)).toEqual([
      'src/domain/worldPulse/deep/inner.js',
      'src/domain/worldPulse/neighbour.js',
    ]);
  });
});

describe('FENCE 2 — the purity pin: no clock, no rng, no global state', () => {
  // ⚠ `join(ROOT, member)` — the set became REPO-RELATIVE when FENCE 1's suffix hole was
  // closed, so the old `join(ROOT, 'src/domain', member)` would now look for
  // `src/domain/src/domain/…`. Moved with the set rather than left to throw.
  const SOURCES = FAITH_FIELD_SET.map((member) => ({
    member,
    src: readFileSync(join(ROOT, member), 'utf8'),
  }));

  // A plain loop rather than `test.each(SOURCES)`: the lighting census parks a file
  // whose `each` table is a named binding, and a parked fence is one the census can
  // no longer prove runs — which is precisely the failure this fence guards against.
  test('no leaf in the set reads a wall-clock or an rng', () => {
    // 5 at this composition, and each member joined for its own reason: SUBSTRATE wave 6
    // split the binding leaf out of the field; W-FAITH F5c joined the flaw register (a
    // variance-shaped "capricious" modulation smuggling an rng in reds here); W-FAITH F6c
    // joined the tuning signature surface (a "tuned" value smuggling a clock or rng draw
    // in reds here).
    // ⛔ THE COUNT IS PINNED RATHER THAN DERIVED so a member silently dropping out of
    // FAITH_FIELD_SET cannot quietly shrink what this arm scans — the anti-vacuity guard
    // is the point.
    expect(SOURCES.length, 'the source list is empty — this arm is scanning nothing').toBe(5);
    for (const { member, src } of SOURCES) {
      // Comment-stripped so a prose mention of Math.random cannot red this.
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/[^\n]*/g, '$1');
      // anchored: SOURCES.length is pinned to 5 above and `code` is real file text from disk
      expect(code, `${member}: Math.random`).not.toMatch(/Math\.random/);
      // anchored: same pinned source list
      expect(code, `${member}: wall clock`).not.toMatch(/Date\.now|new Date\b/);
      // anchored: same pinned source list
      expect(code, `${member}: performance clock`).not.toMatch(/performance\.now/);
    }
  });

  test('the same inputs give the same reading, every time', () => {
    const st = {
      deities: { 'd.a': { deityRef: 'd.a', snapshot: { rankAxis: 'major', boonChannel: 'trade', boonStrength: 'firm' }, share: 60, standing: 'ascendant' } },
      patronRef: 'd.a',
    };
    const s = { id: 's', config: {} };
    const first = faithFieldOf(s, st);
    for (let i = 0; i < 25; i += 1) expect(faithFieldOf(s, st)).toEqual(first);
  });
});

describe('FENCE 4 — the DRIVEN BYTE-IDENTITY GOLDEN (W-FAITH F4c, the replacement FENCE 1 owed)', () => {
  // ⛔ THIS FENCE EXISTS BECAUSE FENCE 1 CHANGED SHAPE. While nothing imported the field,
  // an import census was strictly stronger than a state pin. Now that two production
  // modules DO import it, the census can only say the callers are the expected ones — it
  // can no longer say the world does not move. That claim needs a driven world, and this
  // is it: the real projection writer and the real causal substrate, over a corpus built
  // to exercise every lever the field has, with NOTHING authored.
  //
  // ⭐ THE GOLDEN IS A FROZEN HASH, not a self-comparison. A pin that compared the corpus
  // to itself would pass on any future change that perturbed both sides equally, which is
  // the exact vacuity the WR-10 note at the top of this file warns about.

  /** A pantheon that pulls every lever the field reads — ranks, standings, shares,
   *  suppression, patron and non-patron — and authors NO boon or bane anywhere. */
  const DORMANT_PANTHEON = {
    patronRef: 'd.major',
    deities: {
      'd.major': { deityRef: 'd.major', snapshot: { _deityRef: 'd.major', name: 'Major', rankAxis: 'major', domain: 'harvest', lawAxis: 'lawful' }, share: 55, standing: 'ascendant', legitimacy: 0.9, niche: 'a', suppressed: false },
      'd.minor': { deityRef: 'd.minor', snapshot: { _deityRef: 'd.minor', name: 'Minor', rankAxis: 'minor', domain: 'war' }, share: 30, standing: 'established', legitimacy: 0.5, niche: 'b', suppressed: false },
      'd.cult': { deityRef: 'd.cult', snapshot: { _deityRef: 'd.cult', name: 'Cult', rankAxis: 'cult' }, share: 15, standing: 'cult', legitimacy: 0.2, niche: 'c', suppressed: false },
      'd.gone': { deityRef: 'd.gone', snapshot: { _deityRef: 'd.gone', name: 'Gone', rankAxis: 'major' }, share: 0, standing: 'cult', legitimacy: 0, niche: 'd', suppressed: true },
    },
  };

  /** Settlements spanning the magic dial (absent / alive / DEAD) and the piety record
   *  (absent / present), because those are the two inputs that gate and scale the field.
   *
   *  ⚠⚠ THE PIETY ROW CARRIES ITS RECORD IN `pietyByCid`, NOT IN `config`, AND THE FIRST
   *  CUT OF THIS FIXTURE HAD IT WRONG. `projectReligionStateOntoSettlement` REPLACES
   *  `config.faithProfile` wholesale with the profile it builds this tick, so a piety
   *  record planted on the incoming settlement is discarded before the field ever reads
   *  it — the row would have looked devout and been measured at piety 1.0. Passing it the
   *  way the pulse does is the only way this lever is actually pulled, and it is also the
   *  live consequence of the car's "one record, one tick's truth" ordering. */
  const CORPUS = [
    { id: 'c.plain', name: 'Plain', population: 900, config: {} },
    { id: 'c.magic', name: 'Magelight', population: 4200, config: { magicLevel: 'high' } },
    { id: 'c.dead', name: 'Ashfall', population: 1500, config: { magicLevel: 'none', magicExists: false } },
    { id: 'c.devout', name: 'Devout', population: 8000, config: { magicLevel: 'medium' } },
  ];

  /** The tick's piety read-model, keyed as the pulse keys it. Only the devout row has one,
   *  so the corpus spans both the amplified and the unamplified case. */
  const PIETY_BY_CID = { 'c.devout': { composite: 1.7, localMult: 1.3, local01: 0.8, dampener: { megaphoneLaw: 0.9 } } };

  /** Drive the REAL seam over the corpus and return a stable digest of everything it
   *  produced — the projected settlement AND the whole derived substrate. */
  function digest(pantheon) {
    const rows = CORPUS.map((base) => {
      const projected = projectReligionStateOntoSettlement(base, { [base.id]: pantheon }, base.id, PIETY_BY_CID);
      return { id: base.id, config: projected.config, causal: deriveCausalState(projected) };
    });
    return createHash('sha256').update(JSON.stringify(rows)).digest('hex').slice(0, 16);
  }

  test('the dormant corpus hashes to its frozen golden', () => {
    // ⚠ MEASURED, NEVER TRANSCRIBED. If this reds, something moved the dormant path and
    // the right response is to find out WHAT, not to re-freeze the constant.
    expect(digest(DORMANT_PANTHEON)).toBe(DORMANT_GOLDEN);
  });

  test('no settlement in the dormant corpus carries a field key or a faith contributor', () => {
    for (const base of CORPUS) {
      const projected = projectReligionStateOntoSettlement(base, { [base.id]: DORMANT_PANTHEON }, base.id, PIETY_BY_CID);
      const cfg = /** @type {{ faithProfile?: { field?: unknown } }} */ (projected.config);
      expect(cfg.faithProfile, `${base.id}: the pantheon must still project a faith profile`).toBeTruthy();
      expect(cfg.faithProfile?.field, `${base.id} minted a field key with nothing authored`).toBeUndefined();
      const causal = deriveCausalState(projected);
      for (const v of Object.values(causal.variables)) {
        expect(v.contributors.some((c) => String(c.source).startsWith('faith.field.'))).toBe(false);
      }
    }
  });

  test('guard the guard: the digest MOVES when a boon is authored', () => {
    // Without this the golden above could be a hash of a corpus the field never touches —
    // a pin that would stay green if the whole wiring were deleted.
    const authored = JSON.parse(JSON.stringify(DORMANT_PANTHEON));
    authored.deities['d.major'].snapshot.boonChannel = 'harvest';
    authored.deities['d.major'].snapshot.boonStrength = 'heavy';
    expect(digest(authored)).not.toBe(DORMANT_GOLDEN);
  });

  test('guard the guard: a boon on an UNBOUND channel leaves the golden untouched', () => {
    // The other half of the same claim — the three declared-unbound channels really are
    // inert, proved on a driven world rather than by reading the register.
    const authored = JSON.parse(JSON.stringify(DORMANT_PANTHEON));
    authored.deities['d.major'].snapshot.boonChannel = 'learning';
    authored.deities['d.major'].snapshot.boonStrength = 'heavy';
    expect(digest(authored)).toBe(DORMANT_GOLDEN);
  });
});

describe('FENCE 3 — the identity pin: reading never writes', () => {
  test('neither leaf mutates the settlement or the religion state it reads', () => {
    const settlement = { id: 's.probe', config: { magicLevel: 'medium', faithProfile: { piety: { composite: 1.2 } } } };
    const religionState = {
      deities: {
        'd.a': { deityRef: 'd.a', snapshot: { rankAxis: 'major', name: 'A', boonChannel: 'harvest', boonStrength: 'heavy', characterAxes: 'MERCY:virtue:marked' }, share: 70, standing: 'ascendant', suppressed: false },
        'd.b': { deityRef: 'd.b', snapshot: { rankAxis: 'cult', name: 'B', baneChannel: 'sea', baneStrength: 'faint' }, share: 30, standing: 'cult', suppressed: false },
      },
      patronRef: 'd.a',
    };
    const before = JSON.stringify({ settlement, religionState });

    faithFieldOf(settlement, religionState);
    for (const ch of FAITH_CHANNELS) faithChannelMult(settlement, religionState, ch);
    faithWitnessEntries({ settlement, religionState, npc: { id: 'npc_1', name: 'Ada' }, dweltTicks: 52, eventId: 'e.1' });

    expect(JSON.stringify({ settlement, religionState })).toBe(before);
  });

  test('the reading itself is a fresh object each call — no shared mutable receipt', () => {
    const s = { id: 's', config: {} };
    const a = faithFieldOf(s, null);
    const b = faithFieldOf(s, null);
    expect(a).not.toBe(b);
    expect(a.channels).not.toBe(b.channels);
    expect(a).toEqual(b);
  });
});
