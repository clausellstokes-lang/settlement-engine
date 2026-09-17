/**
 * espionageDormancyFence.test.js — ES-0's FOUR-FENCE dormancy set, its lit-mutant
 * control, and the per-door conjunction pins.
 *
 * ⚠ READ THIS FIRST, BECAUSE THIS FENCE SET IS SHAPED DIFFERENTLY FROM ITS SIBLINGS AND
 * THE DIFFERENCE IS DELIBERATE. Every other dormancy fence in this estate guards a
 * subsystem that RUNS and is gated. ES-0's subsystem does not run at all: it lands three
 * pure leaves, one shared-vocabulary mint and the gate that will govern them, and
 * NOTHING under src/ imports any of it. That is the WR-10 dark-instrument shape, and it
 * makes the usual fence-1 (drive the engine dark, compare the world to itself) a
 * VACUOUS pin — it would compare a world to itself through a code path that does not
 * exist, and would stay green if the whole layer were deleted.
 *
 * So fence 1 is restated at the level where the claim actually lives:
 *
 *   ⭐⭐ FENCE 1 — REPLACED AT THE SUBSTRATE COUPLING, BY ITS OWN INSTRUCTION. Until this
 *     commit fence 1 was an IMPORT-CLOSURE CENSUS asserting that NO production module
 *     imports the espionage set, and its own failure message named its successor: "the
 *     espionage layer gained a caller — this fence is now the wrong fence: replace it
 *     with a driven byte-identity golden in the commit that added the caller." W-OPS car
 *     O1 added that caller — `operations/missionDispatcher.js` imports
 *     `DOCTRINE_TARGETINGS`, `DELIBERATION_VERDICTS` and `deliberationRead` — so the
 *     emptiness claim is now FALSE and the census is retired rather than widened.
 *
 *     ⛔⛔ AND THE CALLER IS NOT THE CALLER THE OLD TEXT ANTICIPATED, WHICH CHANGES WHAT
 *     AN HONEST REPLACEMENT LOOKS LIKE. The text was written for ES-1 mounting a caller
 *     on a LIVE path. MEASURED here instead: `missionDispatcher.js` has ZERO src
 *     importers of its own, imports the espionage set's ARITHMETIC AND VOCABULARY and
 *     NOT its gate, and never reads `espionageEnabled` at all. So the import chain
 *     TERMINATES one hop further out than it used to, and lighting the espionage flag
 *     cannot reach the new edge even in principle.
 *
 *     THE REPLACEMENT IS THEREFORE TWO ARMS, and the second is the load-bearing one:
 *       (a) THE DRIVEN GOLDEN — 360 settlements (six tiers x four route accesses x
 *           fifteen seeds, MAT probe-C's shape) driven at this tip must hash to
 *           `PRE_COUPLING_CORPUS_SHA`, executed in a `git archive` of committed
 *           `853e0e9ba`, whose tree carries no `operations/` directory at all.
 *       (b) THE REACHABILITY CHAIN — the espionage set's src importer set is EXACTLY
 *           `[missionDispatcher.js]`, and THAT module's src importer set is EMPTY.
 *
 *     ⚠⚠ ARM (a)'s REACH IS DECLARED, NOT ASSUMED, because §713.2 rules that a dormancy
 *     instrument can pass by comparing nothing. MEASURED with a loader hook over the
 *     real graph: the corpus loads 213 modules and reaches exactly TWO of the coupling's
 *     35 touched src files (`corruption.js`, `customContentSchema.js`) — and NONE of the
 *     espionage set, the dispatcher, or the npc/worldPulse cars. ⇒ ARM (a) IS A
 *     CONTAINMENT PROOF, NEVER A DORMANCY ONE, and it is shipped saying so. Its
 *     discrimination is not argued either: a planted `corruption.js` flaw-vector swap
 *     moves the corpus sha and restoring it moves it back (recorded in the lane receipt).
 *     ⚠ Its limit is inherited: the chain scan sees static `from '…'` specifiers only, so
 *     a dynamic `await import()` crosses it unseen, exactly as it crosses the coupling
 *     inclusion ratchet's own scan.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE, over the whole door matrix. No
 *     fixture, so it cannot rot. Its designed blind spot is that it stays green if the
 *     feature runs in BOTH configurations, which is why it is never shipped alone.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. A strict pass-through spy on the espionage module set
 *     counts real invocations. State pins cannot see a feature that ran and happened to
 *     write nothing; this can. The spy sits on the espionage modules themselves and the
 *     count is asserted ZERO after a real read of the gate — which is the honest claim
 *     at ES-0: the gate is the only thing anyone can call, and calling it calls nothing
 *     else. Its guard-the-guard drives the spied exports directly and requires the count
 *     to MOVE, so a mock that silently stopped intercepting reds here instead of
 *     certifying silence.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree: every production read of
 *     `espionageEnabled` is the strict `=== true` form, so ABSENT and FALSE are
 *     identical BY CONSTRUCTION at decision sites no state pin reaches. It reuses the
 *     engine-gated-key walker's own comment/string blanker rather than a second regex,
 *     so a gate written in prose cannot be miscounted as a gate.
 *
 *   THE PER-DOOR CONJUNCTION PINS. `espionageActive` has THREE doors and each is dropped
 *     ALONE. This estate has twice shipped a guard that a second guard silently covered
 *     for — a guard that cannot be reddened cannot be proven — so no door here is
 *     allowed to rest on a neighbour.
 *
 *   THE LIT MUTANT. A flag that can never be lit is a dead flag wearing a dormancy
 *     fence's clothes, and every assertion above would pass over it. So the set closes
 *     by satisfying all three doors and requiring the gate to open — and by requiring
 *     fences 3 and 4 AND fence 1's reachability chain to STAY GREEN with it open, which
 *     is the whole content of "dark by construction": lighting a flag nothing reads moves
 *     nothing. ⚠ RE-SHAPED at the coupling: its fence-1 re-statement used to be "the src
 *     importer set is still empty", which is no longer true of ANY tree; it is now "the
 *     chain still terminates", which is the claim that survived the caller's arrival.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = { doctrine: 0, catchRolls: 0 };

vi.mock('../../src/domain/worldPulse/espionage/espionageDoctrine.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    // STRICT pass-through: rest-args in, the original's result out. Instrumenting the
    // module cannot perturb a byte of the runs the other fences measure.
    readEspionageDoctrine: (...args) => { calls.doctrine += 1; return actual.readEspionageDoctrine(...args); },
  };
});

vi.mock('../../src/domain/worldPulse/espionage/espionageMath.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    catchChance01: (...args) => { calls.catchRolls += 1; return actual.catchChance01(...args); },
  };
});

const { espionageActive } = await import('../../src/domain/worldPulse/espionage/espionageGate.js');
const { readEspionageDoctrine } = await import('../../src/domain/worldPulse/espionage/espionageDoctrine.js');
const { catchChance01 } = await import('../../src/domain/worldPulse/espionage/espionageMath.js');
const { ENGINE_GATED_DORMANT_RULE_KEYS, ENGINE_GATED_VIRTUAL_RULE_KEYS } =
  await import('../../src/domain/worldPulse/simulationRules.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'espionageEnabled';
/** The module set this wave landed, as import specifiers a scan can look for. */
const ESPIONAGE_SET = Object.freeze([
  'espionage/espionageGate.js',
  'espionage/espionageDoctrine.js',
  'espionage/espionageMath.js',
]);

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

/** Static `from '…'` specifiers, comments and strings NOT blanked (a specifier is a string). */
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g;

/** Which files import any member of the espionage set. */
function importersOf(files) {
  const hits = [];
  for (const { rel, src } of files) {
    // The espionage modules import EACH OTHER's siblings legitimately; the census is
    // about consumers OUTSIDE the set.
    if (rel.includes('/espionage/')) continue;
    for (const match of src.matchAll(IMPORT_RE)) {
      if (ESPIONAGE_SET.some((member) => match[1].endsWith(member))) { hits.push(rel); break; }
    }
  }
  return hits.sort();
}

/**
 * A world whose three doors are individually controllable.
 *
 * ⚠ `OMIT` IS A SENTINEL AND NOT `undefined`, AND THAT IS LOAD-BEARING. A default
 * parameter fires on an explicitly-passed `undefined`, so `{ espionage: undefined }`
 * would silently mean "lit" — which is precisely the absent-vs-false distinction fence 2
 * exists to measure, inverted by the harness itself. Caught by this file's own fence 2
 * on its first run.
 */
const OMIT = Symbol('omitted from the rules object');
function world({ canon = 1, infoMode = 'unreliable', spine = true, espionage = true, extra = {} } = {}) {
  return {
    spatialCanonVersion: canon,
    simulationRules: {
      infoMode,
      ...(spine === OMIT ? {} : { errandSpineEnabled: spine }),
      ...(espionage === OMIT ? {} : { [FLAG]: espionage }),
      ...extra,
    },
  };
}

/** THE ONE CALLER W-OPS car O1 added, and the only one this fence admits. */
const THE_CALLER = 'src/domain/worldPulse/operations/missionDispatcher.js';

/**
 * ⛔ THE CORPUS GOLDEN — RE-RECORDED AT EACH OF THE ARC'S *NAMED CHARTERED WINDOWS*,
 * AND NOWHERE ELSE. Most recently at the ENGINE-HYGIENE landing (SHIFT RECORD,
 * 2026-09-01, TE-AGNOSTIC-1 cars `f2c1ad181` / `97d119c9b`); before that at T8.
 *
 * ── 2026-09-17, THE DOSSIER CONTRADICTIONS (owner-signed, through the door) ────────────
 * THE FIRST MOVEMENT OF THIS CONSTANT SINCE THE GENESIS FREEZE, AND IT DID NOT WAIT FOR THE
 * LIGHTING WAVE: it is a signed re-record under tests/helpers/goldenRecordDoor.js, which from the
 * genesis (2026-09-16) is the lawful path for every frozen surface. The owner ordered the dossier's
 * contradictions fixed ("Fix the contradiction."; "fix the remaining contradictions as well") and
 * signed the re-records ("I approve"), record docs/shift-records/2026-09-17-dossier-contradictions.json.
 * THE MOVER, FOUND AND ATTRIBUTED TO ZERO RESIDUE: src/generators/power/governanceNarrative.js alone
 * (a single-variable revert returns the old value). A town under an insurgency, a mass migration, a
 * war or a religious conversion read `Stable` beside its ACTIVE CRISIS banner; it now reads a crisis
 * band. On this corpus exactly 26 of 360 rows move, every one in the single field
 * powerStructure.stability (11 wartime, 6 insurgency, 6 mass migration, 3 religious conversion);
 * 360/360 hashes stay distinct. `cda5ec87…` -> `b9dc82bc…`.
 *
 * ── 2026-09-02, T13 TRANS — THE WINDOW OPENED AND CLOSED WITH ZERO MOVEMENT ──────────
 * ⛔ THE STOP IS RE-ARMED TO EXACTLY ONE NAMED WINDOW. T13 TRANS (ODQ §879.11 REC, §883
 * landing) retired every transcendental site in the six census trees — thirty declared-shift
 * sites onto engine-exact kernels, the ratchet at ZERO with an eslint ban behind it — and this
 * corpus did not move: at the composed landing tip the driven golden hashed 360/360 distinct
 * settlements to `72acacd8…`, the value below, so this constant is NOT re-recorded (a re-record
 * that never happens leaves the same trace as one that does — this block is that trace). The
 * two cured sites the generator reaches (corruption.js's guild grip, now in thievesGuild.js, and
 * canonicalRelationship's popScore, folded to a lexicographic key) proved bit-identical on every
 * integer input, and the reach was RE-DERIVED at the composed tip rather than inherited: of the
 * thirty-eight cured src leaves, exactly those two are reachable from the pipeline and the other
 * thirty-six are not. ⚠ ONE ROW DID FLIP IN THE WINDOW, OUTSIDE THIS CORPUS, and it is named
 * here because a seal that hides a mover is worth nothing: momentumDormancyGolden's
 * `mo-b|8|one_month`, attributed by single-variable revert to `attrition.js` at `da8cd72fb`
 * (family (iii)'s log-ratio) and re-recorded ONCE. It does not touch this corpus, which is
 * generator-side; the fence's own 21/21 is the proof.
 * Remaining chartered windows: ONE — the LIGHTING WAVE
 * (ODQ §881.4, the owner's order: every dark door lights as a DECLARED SHIFT before the GOLDEN
 * freeze), carrying the re-homed constituents MF-CH2B (§881.14 CR-3: its own SHIFT RECORD and
 * revert control, fresh from the post-HORIZON tip) and CH-6b's §594.1 can-it-see control
 * (CR-10). NON-MOVERS BY CONSTRUCTION, named so this seal names ALL chartered windows: HORIZON-
 * INSTR and HORIZON-DARK (instrumentation and dark doors move no default-preset byte; each lands
 * with this fence 21/21 as its proof). Any movement outside the LIGHTING WAVE's own recorded
 * window is a STOP, never a re-record. TERMINAL — ZERO windows, permanent STOP, the posture the
 * GOLDEN freeze then makes owner-keyed — is the LIGHTING WAVE's close act, immediately before
 * the freeze; it is deliberately NOT this act (§881.4 supersedes the charter's §8a/§11.5).
 * (Scope chain, executed: {WAR-mini iff generator-side · AGN@HYG · T13} → {T13 TRANS} →
 * {LIGHTING WAVE} at this act.)
 *
 * ── 2026-09-01, ENGINE-HYGIENE (`500cc111…` → `72acacd8…`) ──────────────────
 * THE MOVER WAS NAMED BEFORE IT LANDED, WHICH IS THE WHOLE POINT OF THIS FENCE.
 * TE-AGNOSTIC-1's two output-moving cars carry their own SHIFT RECORDS (commit
 * messages + docs/DESIGN_SETTING_AGNOSTIC.md § SHIFT RECORD 1/2) and cure rulebook
 * tells in generated settlement prose. This corpus is germanic across six tiers ×
 * four routes, so it sits directly in their blast radius — 43 of their 305 moved
 * golden rows are germanic. THE PRE-BOARD PREDICTED IT AND THE LANDING PRICED IT:
 * a settling experiment run BEFORE any pick, on the boarding base plus the six AGN
 * cars alone, produced `72acacd8…` — the exact value this constant now holds, and
 * an attribution that cannot be back-fitted.
 * RESIDUE ZERO, ON THE OTHER TWO TRAINS: the fence ran 21/21 GREEN at the boarding
 * base, again at the VIRT tip and again at the CEIL tip, so neither of this consist's
 * other trains moves one byte of this corpus. 100 % is AGN's.
 * ANTI-VACUITY, PRESERVED AND RE-PROVEN: 360 rows, 0 errors, 360 DISTINCT hashes —
 * the arms above this assertion, which passed on the very run that convicted the
 * constant.
 * ⛔ THE SCOPE IS NOW RE-NARROWED TO ONE. Chair ruling R-FENCE-SCOPE (ODQ §876.1)
 * amended the §875.2 seal, which had named T13 as the last mover and was measured
 * TOO STRONG: AGN's chartered movement was already in flight. The amended scope was
 * {WAR-mini iff generator-side · AGN@HYG · T13}; WAR-mini measured generation-inert
 * (fence 21/21 on three arms) and AGN@HYG is discharged HERE, so the remaining named
 * window was exactly **{T13 TRANS}** — SPENT AND SUPERSEDED by the T13 TRANS block
 * above, which closed that window with zero movement and re-armed the scope to
 * {LIGHTING WAVE}. ⭐ AND THE LAW THE AMENDMENT MINTED, kept where the
 * next sealer will read it: A SEAL MUST NAME ALL CHARTERED WINDOWS, OR NONE.
 *
 * ── 2026-09-01, T8 (`a5207e29…` → `500cc111…`) ──────────────────────────────
 *
 * History: the original value `a5207e29…f835bcb` was executed against a git archive of
 * `853e0e9ba` (pre-coupling) and HELD through the substrate landing's gate 6 — the
 * coupling, the espionage caller included, moved no byte, exactly as it claimed. Then
 * T8 — the arc's ONE deliberately-priced same-seed shift (ODQ §858/§860; cars 1 and 3:
 * the prosperityRank01 flip and the 27-row priorityCategory relabel with backing
 * factions) — lawfully moved generation. The movement is attributed to ZERO RESIDUE by
 * the landing's probe battery (410/600 moved on the A corpus = car1 53 + car3 389 +
 * car2 0; single-variable reverts reconstruct it exactly; laneT8PROBE-receipt.md), so
 * the mover is FOUND, which is what the old text demanded before touching this line.
 * That value (`500cc111…`) was the same 360-settlement corpus measured at the T8
 * landing tip (replica receipt: t8-fence-corpus.mjs, 360/360 distinct). It is
 * superseded by the ENGINE-HYGIENE re-record above, which is the record of the
 * one chartered window that has been spent since.
 */
const PRE_COUPLING_CORPUS_SHA = 'f13df68e5e511cd385473e95307240d5b73659e11f718eaeafc5f69bf060a69e';

const CORPUS_TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const CORPUS_ROUTES = Object.freeze(['road', 'isolated', 'port', 'crossroads']);
const CORPUS_SEEDS = 15;

/** Key-sorted structural serializer — the corpus hash is over THIS form, not JSON order. */
function stable(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
}
const sha = (s) => createHash('sha256').update(s).digest('hex');

/**
 * Which files import `spec` (a repo-relative module path), by static specifier. Two
 * spellings are admitted and no more: the directory-qualified tail, and a SIBLING's bare
 * `./name.js` — a bare basename anywhere else would convict a same-named module in
 * another directory, which is the substring class this landing has met six times.
 * @param {{rel: string, src: string}[]} files @param {string} spec @returns {string[]}
 */
function importersOfModule(files, spec) {
  const parts = spec.split('/');
  const twoDeep = parts.slice(-2).join('/');
  const sibling = `./${parts[parts.length - 1]}`;
  const dir = parts.slice(0, -1).join('/');
  const hits = [];
  for (const { rel, src } of files) {
    if (rel === spec) continue;
    for (const match of src.matchAll(IMPORT_RE)) {
      const specifier = match[1];
      const isSibling = specifier === sibling && rel.startsWith(`${dir}/`);
      if (specifier.endsWith(`/${twoDeep}`) || isSibling) { hits.push(rel); break; }
    }
  }
  return hits.sort();
}

describe('FENCE 1 (REPLACED) — the driven byte-identity golden, and the chain that terminates', () => {
  test('THE DRIVEN GOLDEN: 360 settlements at this tip hash to the PRE-COUPLING corpus', () => {
    const rows = [];
    for (const tier of CORPUS_TIERS) {
      for (const route of CORPUS_ROUTES) {
        for (let i = 0; i < CORPUS_SEEDS; i += 1) {
          const seed = `SUBw4-fence1-${tier}-${route}-${String(i).padStart(3, '0')}`;
          const settlement = generateSettlementPipeline(
            { settType: tier, tier, tradeRouteAccess: route, culture: 'germanic' }, null, { seed },
          );
          rows.push(`${tier}\t${route}\t${seed}\t${sha(stable(settlement))}`);
        }
      }
    }
    // ⭐ ANTI-VACUITY FIRST, because a corpus that errored or collapsed would hash
    // stably to a wrong constant and read as a pass. The row count is the shape, and
    // the DISTINCT count is the discrimination: 360 identical settlements would be a
    // generator that stopped seeing its seed, and this arm would never say so.
    expect(rows).toHaveLength(CORPUS_TIERS.length * CORPUS_ROUTES.length * CORPUS_SEEDS);
    expect(rows.filter((row) => row.includes('\tERROR:')), 'the corpus threw').toEqual([]);
    expect(new Set(rows.map((row) => row.split('\t')[3])).size, 'the corpus stopped discriminating seeds')
      .toBe(rows.length);
    expect(
      sha(rows.join('\n')),
      'THE DRIVEN CORPUS MOVED. This is a STOP, not a re-record. The constant is'
      + ' re-recorded ONLY inside a NAMED CHARTERED WINDOW, and after the'
      + ' ENGINE-HYGIENE landing spent AGN\'s, T13 TRANS closed with zero movement'
      + ' (§883); exactly ONE remains: the LIGHTING WAVE (§881.4).'
      + ' Anything else moving this number is an unpriced same-seed shift in the world'
      + ' a player gets. FIND THE MOVER — and attribute it to zero residue — before'
      + ' touching this constant; see this file\'s golden header for how the last two'
      + ' windows did it.',
    ).toBe(PRE_COUPLING_CORPUS_SHA);
  }, 120_000);

  test('THE REACHABILITY CHAIN terminates, and the detector that says so is not blind', () => {
    // ⛔ THE CLAIM THAT REPLACED "NOBODY IMPORTS IT". The set has exactly ONE src
    // importer and that importer has NONE, so no engine entry point reaches the layer.
    expect(
      importersOf(SRC_FILES),
      'the espionage set gained a SECOND src importer, or lost the one it has. This fence'
      + ' admits exactly one, because exactly one is what the chain argument covers —'
      + ' a new importer needs its own reachability reading, not a wider roster.',
    ).toEqual([THE_CALLER]);
    expect(
      importersOfModule(SRC_FILES, THE_CALLER),
      'the one admitted caller ACQUIRED a caller of its own — the chain no longer'
      + ' terminates and the espionage layer is reachable from production.',
    ).toEqual([]);
    // ⭐ AND THE EDGE IS ARITHMETIC, NOT THE GATE — which is why lighting the flag cannot
    // reach it. The caller takes the doctrine vocabulary and the deliberation read; it
    // does not import `espionageGate.js` and never names the flag.
    const caller = SRC_FILES.find((f) => f.rel === THE_CALLER);
    expect(caller, 'the admitted caller vanished from the tree').toBeTruthy();
    expect(caller.src).toContain('DOCTRINE_TARGETINGS');
    expect(caller.src).toContain('deliberationRead');
    // anchored: the two toContain assertions directly above prove this same source string is live and populated, so an unreadable or renamed leaf reds there rather than certifying the gate unimported here
    expect(caller.src).not.toContain('espionageGate.js');
    // anchored: same live source, same two positives above — an empty read cannot reach this line
    expect(caller.src).not.toContain(FLAG);
    // GUARD THE GUARD: the detector must FIND the importers that exist, or every
    // enumeration above is a broken scan reporting a clean tree.
    const testImporters = importersOf(TEST_FILES);
    expect(testImporters.length, 'the scan found nothing anywhere — it is broken, not clean').toBeGreaterThan(2);
    expect(testImporters).toContain('tests/domain/espionageMath.test.js');
    expect(testImporters).toContain('tests/domain/espionageDoctrine.test.js');
    // NOTE this file is NOT in that list, and the omission is correct: it reaches the
    // set through `vi.mock` + dynamic `await import`, which is exactly the blind spot
    // fence 1's header declares. Asserting its absence keeps the limit honest.
    // anchored: the two toContain assertions above prove this very list is populated with real importers, so this absence measures the dynamic-import blind spot rather than an empty scan
    expect(testImporters).not.toContain(relative(ROOT, fileURLToPath(import.meta.url)).replace(/\\/g, '/'));
    // And the scan really is scoped to consumers OUTSIDE the set: the doctrine leaf
    // imports the shared vocabulary, and that is not a consumer edge.
    expect(SRC_FILES.some((f) => f.rel.includes('/espionage/')), 'the espionage set vanished').toBe(true);
  });
});

describe('FENCE 2 — absent and explicitly false are the same world', () => {
  test('over the whole door matrix, absent === false', () => {
    for (const canon of [0, 1]) {
      for (const infoMode of ['unreliable', 'omniscient']) {
        for (const spine of [OMIT, false, true]) {
          const absent = espionageActive(world({ canon, infoMode, spine, espionage: OMIT }));
          const explicitFalse = espionageActive(world({ canon, infoMode, spine, espionage: false }));
          expect(absent, `absent/false diverged at canon=${canon} infoMode=${infoMode} spine=${String(spine)}`)
            .toBe(explicitFalse);
          expect(absent).toBe(false);
        }
      }
    }
  });

  test('and every non-boolean truthy spelling is refused too', () => {
    // The dark-never-permissive law: `=== true`, not truthiness. A config that carried
    // the string "true" would otherwise light a subsystem the owner never enabled.
    for (const value of ['true', 1, {}, [], 'yes']) {
      expect(espionageActive(world({ espionage: /** @type {any} */ (value) }))).toBe(false);
    }
  });
});

describe('FENCE 3 — call-path dormancy', () => {
  test('reading the gate invokes NOTHING in the espionage set', () => {
    calls.doctrine = 0;
    calls.catchRolls = 0;
    for (let i = 0; i < 20; i += 1) {
      espionageActive(world({ espionage: i % 2 === 0 }));
      espionageActive(world({ espionage: OMIT }));
    }
    expect(calls.doctrine, 'the gate reached the doctrine leaf').toBe(0);
    expect(calls.catchRolls, 'the gate rolled a catch').toBe(0);
  });

  test('guard the guard: the spy MOVES when the exports are really called', () => {
    // Without this, a mock that silently stopped intercepting would certify silence.
    const before = calls.doctrine + calls.catchRolls;
    readEspionageDoctrine({ courtId: 'a', orderWord: 'lawful', natureWord: 'balanced' });
    catchChance01({ hostRung: 3 });
    expect(calls.doctrine + calls.catchRolls).toBe(before + 2);
  });
});

describe('FENCE 4 — gate-polarity census over the real source tree', () => {
  test('every production read of the flag is the strict === true form', () => {
    const strict = new RegExp(String.raw`\b(?:rules|simulationRules)\s*\)?\s*\??\.\s*${FLAG}\s*===\s*true`);
    const anyRead = new RegExp(String.raw`\.\s*${FLAG}\b`);
    const offenders = [];
    let strictReads = 0;
    for (const { rel, src } of SRC_FILES) {
      const code = codeOnly(src);
      if (!anyRead.test(code)) continue;
      for (const line of code.split('\n')) {
        if (!anyRead.test(line)) continue;
        if (strict.test(line)) { strictReads += 1; continue; }
        offenders.push(`${rel}: ${line.trim()}`);
      }
    }
    // Guard the guard, both directions: the census must have found a real read (an empty
    // scan would make the absence of offenders meaningless) and no loose one.
    expect(strictReads, 'the flag has no production gate read at all — the manifest entry is fiction').toBeGreaterThan(0);
    expect(offenders, 'a non-strict read makes ABSENT and FALSE different worlds').toEqual([]);
  });

  test('the flag is VIRTUAL — manifested, and declared in no defaults or preset', async () => {
    const { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS } =
      await import('../../src/domain/worldPulse/simulationRules.js');
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(FLAG);
    // …and the estate's own DERIVED virtuality answer agrees with the two measurements
    // below (LGT-P2-MANIFEST, 2026-09-05: the register records the gate, this list records
    // that no preset has lit it yet, and a lit key leaves only the second).
    expect(ENGINE_GATED_DORMANT_RULE_KEYS, `${FLAG} is registered but a preset has lit it`)
      .toContain(FLAG);
    // anchored: DEFAULT_SIMULATION_RULES is asserted non-empty on the next line, so an
    // emptied defaults object reds here instead of certifying the flag virtual.
    expect(Object.keys(DEFAULT_SIMULATION_RULES).length).toBeGreaterThan(10);
    // anchored: the length assertion above proves the defaults object is populated.
    expect(Object.keys(DEFAULT_SIMULATION_RULES)).not.toContain(FLAG);
    for (const preset of Object.values(SIMULATION_RULE_PRESETS)) {
      // anchored: each preset's rule set is proven populated first, so a catalog that
      // emptied cannot pass this loop by having nothing to contain.
      expect(Object.keys(preset?.rules || {}).length, `${preset?.id}: empty preset`).toBeGreaterThan(10);
      // anchored: the length assertion above proves each preset's rule set is populated.
      expect(Object.keys(preset?.rules || {}), `${preset?.id}: the flag stopped being virtual`).not.toContain(FLAG);
    }
  });
});

describe('THE THREE DOORS — each dropped alone', () => {
  test('door 1: beliefs must be live', () => {
    // Two ways beliefsActive refuses, and BOTH are pinned: no spatial-canon marker, and
    // an omniscient world (where belief is not a thing that exists to be moved).
    expect(espionageActive(world({ canon: 0 })), 'the canon marker door is dead').toBe(false);
    expect(espionageActive(world({ infoMode: 'omniscient' })), 'the infoMode door is dead').toBe(false);
  });

  test('door 2: the errand spine must be lit', () => {
    expect(espionageActive(world({ spine: OMIT })), 'the spine door is dead').toBe(false);
    expect(espionageActive(world({ spine: false })), 'the spine door is dead').toBe(false);
    // AND the spine door reads the strict positive: a truthy non-true value is refused,
    // which is what keeps the lighting ORDER (spine first, then espionage) enforceable.
    expect(espionageActive(world({ spine: /** @type {any} */ ('true') }))).toBe(false);
  });

  test('door 3: the flag itself, by name', () => {
    expect(espionageActive(world({ espionage: false })), 'the flag door is dead').toBe(false);
  });

  test('a missing rules object, and a non-object world, both refuse', () => {
    expect(espionageActive(null)).toBe(false);
    expect(espionageActive(undefined)).toBe(false);
    expect(espionageActive({ spatialCanonVersion: 1 })).toBe(false);
    expect(espionageActive({ spatialCanonVersion: 1, simulationRules: 'nonsense' })).toBe(false);
  });
});

describe('THE LIT MUTANT — the gate can be opened, and opening it moves nothing', () => {
  test('all three doors satisfied opens the gate', () => {
    // A flag that can never be lit is a DEAD FLAG wearing a dormancy fence's clothes,
    // and every assertion above would pass over it unchanged.
    expect(espionageActive(world()), 'the gate cannot be opened at all').toBe(true);
    // THE LITERAL DRIVE, spelled out rather than composed. Everything above reaches the
    // flag through a computed key, which is correct for a door matrix and INVISIBLE to
    // tests/property/mechanismLitCoverage.test.js — that walker credits a flag as
    // lit-proven by finding `<flag>: true` as a literal in a test. A wave whose only
    // lit drive is computed reads to that walker as a mechanism shipped lit-unproven,
    // which is exactly the class it exists to close. So the drive is written twice: once
    // parameterised for coverage, and once literally for the census.
    expect(espionageActive({
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'unreliable', errandSpineEnabled: true, espionageEnabled: true },
    })).toBe(true);
  });

  test('with the gate OPEN, fences 1, 3 and 4 still hold — that IS dark-by-construction', () => {
    calls.doctrine = 0;
    calls.catchRolls = 0;
    const lit = world();
    expect(espionageActive(lit)).toBe(true);
    // FENCE 3, re-run lit: opening a gate nothing reads calls nothing.
    expect(calls.doctrine + calls.catchRolls).toBe(0);
    // ⚠ FENCE 1, RE-STATED AT THE COUPLING. This arm used to assert the src importer set
    // was EMPTY with the gate open — a claim that is no longer true of ANY tree, so
    // re-asserting it here would have been the same wrong fence in a second place. The
    // claim that SURVIVED the caller's arrival is the one restated: the chain still
    // terminates. The source tree does not change when a flag is set, and that is the
    // point — the darkness is structural, not conditional.
    expect(importersOf(SRC_FILES)).toEqual([THE_CALLER]);
    expect(importersOfModule(SRC_FILES, THE_CALLER)).toEqual([]);
  });
});
