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
 * ── 2026-11-07, THE MIGRATION DIRECTION DECLARED ONCE (THE WIRING WAVE'S WRITER LANE W0) ──
 * THE SIXTY-SECOND MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation of 2026-11-06,
 * inside a NAMED CHARTERED WINDOW: ODQ §934.105, the construction-and-wiring wave's writer lane (the chair's ruling
 * R-W7 (e)); the record is docs/shift-records/2026-11-07-w0-01-migration-direction.json. THE MOVER, FOUND: commit
 * 343bd4eec alone, on the rung-1 candidate 76febf9b0 (stress[].direction written once at the draw, arrivals at birth;
 * every migration surface reads it). On THIS corpus 6 of 360 rows move (thorp 1, village 2, city 2, metropolis 1;
 * the corpus's mass_migration places); 360/360 hashes stay distinct. Written from the staged tree (343bd4eec with the
 * door paths carried from the branch), measured by scripts/audit/refence.mjs before the write. `68c107c2…` -> `1bb9e7a2…`.
 *
 * ── 2026-11-06, THE VILLAGE WATCH'S ROTA PRESUMES NO GOVERNOR (RUNG 1 OF THE SOAK LADDER) ──
 * THE SIXTY-FIRST MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation of 2026-11-06,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-06-rung1-35-village-watch-no-governor.json. THE MOVER, FOUND: commit 8e92c0440
 * (R-H2) inside first-parent step 18fd6b442 of the rung-1 landing and nothing else (the catalogue desc and both desc
 * variants re-worded so no line names a headman; 66b1407bd reverse-applied leaves these 4 rows moving, 8e92c0440
 * reverse-applied leaves 20, record 34's). On THIS corpus 4 of 360 rows move (village 4; every other tier 0);
 * 360/360 hashes stay distinct. Written from the staged tree (18fd6b442 with the door paths carried from the branch),
 * measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path dormancy) re-run green at the write.
 * `2f6d48b3…` -> `68c107c2…`.
 *
 * ── 2026-11-06, THE FOOD PER CENT FROM THE POUNDS (RUNG 1 OF THE SOAK LADDER) ──
 * THE SIXTIETH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation of 2026-11-06,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-06-rung1-34-food-per-cent-from-pounds.json. THE MOVER, FOUND: one cause in two
 * steps — lane D's food floor bfd70d809 (step b37bbf395, the only commit of that step to move this corpus: 2 rows),
 * superseded by lane H's R-H5 66b1407bd (step 18fd6b442: the food writer and its view derive the per cent from the
 * pounds they publish, no floor; 8e92c0440 moves 4 other rows, its own cause, 5f6d243b2 moves 0). On THIS corpus 20 of
 * 360 rows move (thorp 12, hamlet 7, village 1; town, city, metropolis 0); 360/360 hashes stay distinct. Written from
 * the staged tree (18fd6b442 with the door paths carried from the branch, 8e92c0440 reverse-applied), measured by
 * scripts/audit/refence.mjs before the write. FENCE 3 (call-path dormancy) re-run green at the write.
 * `5213e9d9…` -> `2f6d48b3…`.
 *
 * ── 2026-11-06, THE VACANT SEAT IS SAID FROM ITS FACT (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTY-NINTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation of 2026-11-06,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-06-rung1-33-vacant-seat-fact.json. THE MOVER, FOUND: commit 5d3f7b5cb (R-G1) inside
 * first-parent step 64ad4fe47 of the rung-1 landing and nothing else (the vacant seat read from the governing faction's
 * `vacant` modifier, the crisis cast following it; c9be4d1f0 reverse-applied leaves the 8 rows moving, 5d3f7b5cb leaves
 * 0). On THIS corpus 8 of 360 rows move (thorp 2, hamlet 1, village 2, town 2, metropolis 1; city 0); 360/360 hashes
 * stay distinct. Written from the staged tree (64ad4fe47 with the door paths carried from the branch, lane D's food
 * floor bfd70d809 reverse-applied: its own cause, record 34), measured by scripts/audit/refence.mjs before the write.
 * FENCE 3 (call-path dormancy) re-run green at the write. `f6cccb63…` -> `5213e9d9…`.
 *
 * ── 2026-11-06, THE VILLAGE WATCH'S AUTHORED TEXTS (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTY-EIGHTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation of 2026-11-06,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-06-rung1-32-village-watch-texts.json. THE MOVER, FOUND: commit 59237b232 inside
 * first-parent step 3da1104da of the rung-1 landing and nothing else (the Village watch's identity one-liner and two
 * desc variants authored; each of the step's other three source commits reverse-applied leaves the 3 rows moving,
 * 59237b232 reverse-applied leaves 0). On THIS corpus 3 of 360 rows move (village 3; every other tier 0); 360/360
 * hashes stay distinct. Written from the staged tree (3da1104da with the door paths carried from the branch, lane D's
 * food floor bfd70d809 reverse-applied: its own cause, record 34), measured by scripts/audit/refence.mjs before the
 * write. FENCE 3 (call-path dormancy) re-run green at the write. `3302d755…` -> `f6cccb63…`.
 *
 * ── 2026-11-05, THE V-SUMMARY-HOOKS CURE (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTY-SEVENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-05-rung1-28-summary-hook-count.json. THE MOVER, FOUND: commit c1cf38bbb on the rung-1
 * landing and nothing else (the viability summary's plot-hook count is re-derived from the hooks that survive the truth
 * filter, hookTruthRecord.js :: withoutFalseHooks; the defect was TRUTH 7eb0bf0ba's). On THIS corpus 44 of 360 rows move
 * (village 8, town 13, city 13, metropolis 10; thorp, hamlet 0); 360/360 hashes stay distinct. Written at the branch tip
 * (the cure is the last step), measured by scripts/audit/refence.mjs before the write against the tip without the cure,
 * which reproduces this file's previous constant. FENCE 3 (call-path dormancy) re-run green at the write.
 * `dc33f86a…` -> `3302d755…`.
 *
 * ── 2026-11-04, F10 WALLS-WORD (units 1–4) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTY-SIXTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-26-f10-walls-word.json. THE MOVER, FOUND: first-parent step 54daafda3 of the rung-1
 * landing and nothing else (F10 WALLS-WORD (units 1–4): a line that names walls, soldiers or a garrison takes its twin where the roster lacks the thing — the hook-truth gate reads soldiers as the defence check does, and the service descriptions, the siege and wartime goals, the crisis cast's defence reasons, the waystation description and the power writers' garrison words follow). On THIS corpus 19 of 360 rows move
 * (thorp 1, hamlet 3, village 7, town 8; city, metropolis 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S26 (the tree of 54daafda3 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `4af36e27…` -> `dc33f86a…`.
 *
 * ── 2026-11-04, F4 CRIME-SIGNAL (units 1–5) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTY-FIFTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-25-f4-crime-signal.json. THE MOVER, FOUND: first-parent step ba9fde402 of the rung-1
 * landing and nothing else (F4 CRIME-SIGNAL (units 1–5): a relationship does not outlive the trim, affiliations, secrets and goals read the crime signal, no crime-wave tension without crime, and the survival and debt-evasion lines read the final crime signal). On THIS corpus 129 of 360 rows move
 * (thorp 23, hamlet 29, village 38, town 36, city 3; metropolis 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S25 (the tree of ba9fde402 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `6d8e01a1…` -> `4af36e27…`.
 *
 * ── 2026-11-04, F3 FOOD-WORDS (units 1–5) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTY-FOURTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-24-f3-food-words.json. THE MOVER, FOUND: first-parent step db8ce5da8 of the rung-1
 * landing and nothing else (F3 FOOD-WORDS (units 1–5): a secret says people are starving only where the food record goes hungry, an export list is goods ("Game meat" is game), a processed food good from the place's own food is an export only on a surplus, and a fishing row on water is a fish source). On THIS corpus 99 of 360 rows move
 * (thorp 15, hamlet 13, village 14, town 11, city 23, metropolis 23); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S24 (the tree of db8ce5da8 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `c2261133…` -> `6d8e01a1…`.
 *
 * ── 2026-11-04, F1 DEFENCE-WORDS, first step (units 1–5) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTY-THIRD MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-23-f1-defence-words.json. THE MOVER, FOUND: first-parent step 5e9ffb220 of the rung-1
 * landing and nothing else (F1 DEFENCE-WORDS, first step (units 1–5): every defence claim writer reads defenseFactsOf, the standing and siege-pressure lines read the record, a hired company is not called a garrison, and a Village watch row stands below town). On THIS corpus 146 of 360 rows move
 * (thorp 5, hamlet 19, village 37, town 56, city 28, metropolis 1); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S23 (the tree of 5e9ffb220 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `d1269dc0…` -> `c2261133…`.
 *
 * ── 2026-11-04, F6 BUDGET-FLOOR (units 1–4) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTY-SECOND MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-22-f6-budget-floor.json. THE MOVER, FOUND: first-parent step 6d84aa834 of the rung-1
 * landing and nothing else (F6 BUDGET-FLOOR (units 1–4): the institution budget's target gives way — the density factor d answers anchor − R − X over the scalable rows, the realised table re-measured on the scalable definition). On THIS corpus 318 of 360 rows move
 * (thorp 38, hamlet 55, village 58, town 60, city 60, metropolis 47); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S22 (the tree of 6d84aa834 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `205c0c40…` -> `d1269dc0…`.
 *
 * ── 2026-11-04, F5 INSTRUMENTS, first step (units 1–5) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTY-FIRST MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-21-f5-instruments.json. THE MOVER, FOUND: first-parent step 7e28a6331 of the rung-1
 * landing and nothing else (F5 INSTRUMENTS, first step (units 1–5): the hook pools' sea and dock lines are licensed on waterAccessKind (unit 4, the only unit that reaches the generator; units 1–3 are the soak's instruments)). On THIS corpus 38 of 360 rows move
 * (village 2, town 17, city 11, metropolis 8; thorp, hamlet 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S21 (the tree of 7e28a6331 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `4b80df04…` -> `205c0c40…`.
 *
 * ── 2026-11-04, PINS, second step (units 6–7) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FIFTIETH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-20-pins-2-rarity-mark.json. THE MOVER, FOUND: first-parent step 11467ed57 of the rung-1
 * landing and nothing else (PINS, second step (units 6–7): the rows whose own text calls them rare carry the rarity mark, and availableServices.criminal[].name is a service label, declared NON_CASCADED). On THIS corpus 95 of 360 rows move
 * (village 11, city 30, metropolis 54; thorp, hamlet, town 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S20 (the tree of 11467ed57 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `3f686283…` -> `4b80df04…`.
 *
 * ── 2026-11-04, X-46 car 3, I7 (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTY-NINTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-19-x46-car-3-i7-realised.json. THE MOVER, FOUND: first-parent step 6ca454d2b of the rung-1
 * landing and nothing else (X-46 car 3, I7: the realised table (INSTITUTION_BUDGET_REALISED) re-measured at the composed tip by the lane's own recipe, a metropolis forced through the custom-population path). On THIS corpus 325 of 360 rows move
 * (thorp 52, hamlet 53, village 60, town 60, city 60, metropolis 40); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S19 (the tree of 6ca454d2b with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `f95a9d28…` -> `3f686283…`.
 *
 * ── 2026-11-04, TRUTH, second step (unit D) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTY-EIGHTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-18-truth-2-unit-d.json. THE MOVER, FOUND: first-parent step 844acaccc of the rung-1
 * landing and nothing else (TRUTH, second step (unit D): the infiltrator takes a real name, hidden in the fiction, and the criminal structure is not null beside a network). On THIS corpus 5 of 360 rows move
 * (thorp 1, hamlet 1, city 1, metropolis 2; village, town 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S18 (the tree of 844acaccc with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `664d79e1…` -> `f95a9d28…`.
 *
 * ── 2026-11-04, PINS, first step (units 1–3 and the chair's addendum) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTY-SEVENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-17-pins-1-density-exemptions.json. THE MOVER, FOUND: first-parent step 37b1e746d of the rung-1
 * landing and nothing else (PINS, first step (units 1–3 and the chair's addendum): route-required rows and rows with an authored rarity are exempt from X-46 car 3's density factor, and the budget's top anchor is the catalogue's ceiling, 60,000 -> 93). On THIS corpus 197 of 360 rows move
 * (thorp 60, hamlet 28, village 29, town 15, city 15, metropolis 50); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S17 (the tree of 37b1e746d with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `641c300a…` -> `664d79e1…`.
 *
 * ── 2026-11-04, TRUTH, first step (units A–C and unit D's first commit) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTY-SIXTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-16-truth-1-units-a-c.json. THE MOVER, FOUND: first-parent step ff4448d2e of the rung-1
 * landing and nothing else (TRUTH, first step (units A–C and unit D's first commit): a hook false on its own record is not stored; the crisis page speaks the place's own tier noun; "no criminal infrastructure" never prints beside a network; stress factions take the role pool's first unused name). On THIS corpus 102 of 360 rows move
 * (thorp 13, hamlet 11, village 16, town 22, city 20, metropolis 20); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S16 (the tree of ff4448d2e with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `1362f4ce…` -> `641c300a…`.
 *
 * ── 2026-11-04, PLACE-NOT-TIER (R6, units 1–2) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTY-FIFTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-15-place-not-tier.json. THE MOVER, FOUND: first-parent step 6129c300d of the rung-1
 * landing and nothing else (PLACE-NOT-TIER (R6, units 1–2): the soldiers line, the Guard Captain and "The garrison" read the place's forces, not the tier; a thorp, hamlet or village seats no guild power without a market). On THIS corpus 105 of 360 rows move
 * (thorp 3, hamlet 35, village 53, town 14; city, metropolis 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S15 (the tree of 6129c300d with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `a126db33…` -> `1362f4ce…`.
 *
 * ── 2026-11-04, SELF-VOUCH, I5 (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTY-FOURTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-14-self-vouch-i5-kind-7.json. THE MOVER, FOUND: first-parent step cdc949867 of the rung-1
 * landing and nothing else (SELF-VOUCH, I5: the battery judgment counts kind 7 (a placeholder faction or a role-only person), so the self-vouch line prints only on a record clean of kinds 1-5, 7 and 8). On THIS corpus 183 of 360 rows move
 * (thorp 8, hamlet 32, village 38, town 28, city 48, metropolis 29); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S14 (the tree of cdc949867 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `2d13cedb…` -> `a126db33…`.
 *
 * ── 2026-11-04, X-46 car 1b, second step (U4–U5) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTY-THIRD MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-13-x46-car-1b-2-curve.json. THE MOVER, FOUND: first-parent step fb0341b93 of the rung-1
 * landing and nothing else (X-46 car 1b, second step (U4–U5): the owner's metropolis curve — flat to 50,000, thinning exponentially to 1,000,000 — and the rarer variant, 30% of random metropolises past 50,000). On THIS corpus 60 of 360 rows move
 * (metropolis 60; thorp, hamlet, village, town, city 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S13 (the tree of fb0341b93 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `0b130673…` -> `2d13cedb…`.
 *
 * ── 2026-11-04, X-46 car 3 (lane x46-3-budget) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTY-SECOND MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-12-x46-car-3-budget.json. THE MOVER, FOUND: first-parent step 90dc22f18 of the rung-1
 * landing and nothing else (X-46 car 3 (lane x46-3-budget): the institution budget follows the population). On THIS corpus 360 of 360 rows move
 * (thorp 60, hamlet 60, village 60, town 60, city 60, metropolis 60); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S12 (the tree of 90dc22f18 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `fff82c27…` -> `0b130673…`.
 *
 * ── 2026-11-04, X-46 car 1b, first step (U1–U3) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTY-FIRST MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-11-x46-car-1b-1-no-ceiling.json. THE MOVER, FOUND: first-parent step 79c442330 of the rung-1
 * landing and nothing else (X-46 car 1b, first step (U1–U3): the metropolis roll has no ceiling, the custom population input has a floor and no ceiling, and the band position is read on a log scale). On THIS corpus 60 of 360 rows move
 * (metropolis 60; thorp, hamlet, village, town, city 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S11 (the tree of 79c442330 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `64cff250…` -> `fff82c27…`.
 *
 * ── 2026-11-04, T1/T2 (the dry run §4's two proposals, adopted by the chair) (RUNG 1 OF THE SOAK LADDER) ──
 * THE FORTIETH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-10-t1-t2-siege-stores.json. THE MOVER, FOUND: first-parent step fe56bddd4 of the rung-1
 * landing and nothing else (T1/T2 (the dry run §4's two proposals, adopted by the chair): the siege keeps 0.3 of the harvest; a village stores as a hamlet does). On THIS corpus 66 of 360 rows move
 * (thorp 1, hamlet 2, village 60, metropolis 3; town, city 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S10 (the tree of fe56bddd4 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `5666cc4e…` -> `64cff250…`.
 *
 * ── 2026-11-04, TERRAIN-POOLS, second step (re-merged at 30141976) (RUNG 1 OF THE SOAK LADDER) ──
 * THE THIRTY-NINTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-09-terrain-pools-2.json. THE MOVER, FOUND: first-parent step fb5edb7f5 of the rung-1
 * landing and nothing else (TERRAIN-POOLS, second step (re-merged at 30141976): inland texts for the pools that speak only of water, and no ship captain or sailor where there is no water). On THIS corpus 62 of 360 rows move
 * (village 28, town 3, city 10, metropolis 21; thorp, hamlet 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S9 (the tree of fb5edb7f5 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `d04a3f23…` -> `5666cc4e…`.
 *
 * ── 2026-11-04, SELF-VOUCH (RUNG 1 OF THE SOAK LADDER) ──
 * THE THIRTY-EIGHTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-08-self-vouch.json. THE MOVER, FOUND: first-parent step 0be13b5cb of the rung-1
 * landing and nothing else (SELF-VOUCH: the eighth formal judgment, record_coherence_battery, over the stored record, and DS-GEN-11's zero pool vouches only when it passed). On THIS corpus 360 of 360 rows move
 * (thorp 60, hamlet 60, village 60, town 60, city 60, metropolis 60); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S8 (the tree of 0be13b5cb with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `d85b23c3…` -> `d04a3f23…`.
 *
 * ── 2026-11-04, FOOD-EXPORTS (with FOOD-4) (RUNG 1 OF THE SOAK LADDER) ──
 * THE THIRTY-SEVENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-07-food-exports.json. THE MOVER, FOUND: first-parent step 63bb72785 of the rung-1
 * landing and nothing else (FOOD-EXPORTS (with FOOD-4): a place short of food sells no food surplus, and the foodways line has one writer on the record). On THIS corpus 44 of 360 rows move
 * (village 1, town 8, city 16, metropolis 19; thorp, hamlet 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S7 (the tree of 63bb72785 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `89dedf71…` -> `d85b23c3…`.
 *
 * ── 2026-11-04, TERRAIN-POOLS, first step (lane terrain-pools at its first merge) (RUNG 1 OF THE SOAK LADDER) ──
 * THE THIRTY-SIXTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-06-terrain-pools-1.json. THE MOVER, FOUND: first-parent step ac09ea83b of the rung-1
 * landing and nothing else (TERRAIN-POOLS, first step (lane terrain-pools at its first merge): the water-speaking pools and lines are licensed on the place's water fact (the A-11 licences; the Defense desk's harbour line reads the water fact)). On THIS corpus 227 of 360 rows move
 * (thorp 13, hamlet 19, village 44, town 47, city 52, metropolis 52); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S6 (the tree of ac09ea83b with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `8ef28c7f…` -> `89dedf71…`.
 *
 * ── 2026-11-04, TIER-NOUN-POOLS (units 1–6) (RUNG 1 OF THE SOAK LADDER) ──
 * THE THIRTY-FIFTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-05-tier-noun-pools.json. THE MOVER, FOUND: first-parent step a9982e3b9 of the rung-1
 * landing and nothing else (TIER-NOUN-POOLS (units 1–6): a city's drawn institution description and its Gate Tolls line speak the place's own tier noun). On THIS corpus 76 of 360 rows move
 * (city 40, metropolis 36; thorp, hamlet, village, town 0); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S5 (the tree of a9982e3b9 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `5103a51e…` -> `8ef28c7f…`.
 *
 * ── 2026-11-04, CRISIS (lane crisis, units 1–7, docs/DESIGN_CRISIS_TAB.md) (RUNG 1 OF THE SOAK LADDER) ──
 * THE THIRTY-FOURTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-03-crisis-derived-cast.json. THE MOVER, FOUND: first-parent step d3e072368 of the rung-1
 * landing and nothing else (CRISIS (lane crisis, units 1–7, docs/DESIGN_CRISIS_TAB.md): the crisis record carries its derived cast). On THIS corpus 103 of 360 rows move
 * (thorp 21, hamlet 24, village 16, town 11, city 15, metropolis 16); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S3 (the tree of d3e072368 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `48e1248a…` -> `5103a51e…`.
 *
 * ── 2026-11-04, X-46 car 2 (lane x46-2-thresholds) (RUNG 1 OF THE SOAK LADDER) ──
 * THE THIRTY-THIRD MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-02-x46-car-2-thresholds.json. THE MOVER, FOUND: first-parent step d4bf6431c of the rung-1
 * landing and nothing else (X-46 car 2 (lane x46-2-thresholds): the thresholds — seventeen bare population comparisons re-based through TIER_STAMP_CUTS, the Dwellings and Housing rows on the owner's household column, Money changers' floor 3,000 -> 2,000). On THIS corpus 360 of 360 rows move
 * (thorp 60, hamlet 60, village 60, town 60, city 60, metropolis 60); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S2 (the tree of d4bf6431c with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `cab21525…` -> `48e1248a…`.
 *
 * ── 2026-11-04, X-46 car 1 (lane x46-train, U1–U4) (RUNG 1 OF THE SOAK LADDER) ──
 * THE THIRTY-SECOND MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: RUNG 1 OF THE SOAK LADDER, ODQ §934.105 (the §881.4 STOP's own terms); the
 * record is docs/shift-records/2026-11-04-rung1-01-x46-car-1-bands.json. THE MOVER, FOUND: first-parent step 1264a8152 of the rung-1
 * landing and nothing else (X-46 car 1 (lane x46-train, U1–U4): the owner's historical population bands and the one disjoint tier stamp; no household count (U4 removed it by the owner's word)). On THIS corpus 360 of 360 rows move
 * (thorp 60, hamlet 60, village 60, town 60, city 60, metropolis 60); 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written
 * from the staged tree S1 (the tree of 1264a8152 with the door paths carried from the branch, the previous
 * record's writes committed), measured by scripts/audit/refence.mjs before the write. FENCE 3 (call-path
 * dormancy) re-run green at the write. `00440713…` -> `cab21525…`.
 *
 * ── 2026-11-03, DEFENSE-2: THE DEFENCE GENERATOR'S MAGIC DEPENDENCY DERIVES FROM THE RELIANCE READING (THE COHERENCE AND SCALE WINDOW) ──
 * THE TWENTY-FOURTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: THE COHERENCE AND SCALE WINDOW, ODQ §934.104 (the §881.4 STOP's own
 * terms); the record is docs/shift-records/2026-11-03-defense-magic-dependency.json. THE MOVER, FOUND: 09694e448
 * (defenseGenerator.js :: generateDefenseProfile stores magicReliance.js :: deriveMagicReliance at relied-upon or
 * integral); f47cdd20d, its Defense-tab reading, moves no settlement byte. On THIS corpus 163 of 360 rows move
 * (hamlet 1, village 14, town 35, city 56, metropolis 57), in defenseProfile.magicDependency and its mirror
 * defenseProfile.scores.magicDependency alone; 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY
 * CONSTRUCTION: written from the staged tree S9 = S8 + this cause, where S8 (the roster-lines stage, its writes
 * committed) reproduces `12a9c494…` exactly. FENCE 3 (call-path dormancy) re-run green at the write: zero
 * espionage calls. `12a9c494…` -> `00440713…`.
 *
 * ── 2026-11-03, DEFENSE-2: THE CULTURE, STRESS AND WARTIME LINES SAY NOTHING A ROSTER CAN CONTRADICT (THE COHERENCE AND SCALE WINDOW) ──
 * THE TWENTY-THIRD MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: THE COHERENCE AND SCALE WINDOW, ODQ §934.104 (the §881.4 STOP's own
 * terms); the record is docs/shift-records/2026-11-03-defense-roster-lines.json. THE MOVER, FOUND: 8284242ef
 * (the culture, stress and wartime lines reworded to hold on every roster; defenseInstitutionBuckets.js ::
 * DEFENSE_BUCKET_KEYWORDS.militia reads 'household levy'). On THIS corpus 193 of 360 rows move (thorp 40,
 * hamlet 34, village 31, town 33, city 27, metropolis 28), in culturalIdentity.defensePattern (179 rows),
 * defenseProfile.institutions.militia (12 thorps gain the Household levy), the reworded NPC and faction-member
 * secrets (6 rows) and the wartime stress summary (3 rows); 360/360 hashes stay distinct. ATTRIBUTION, ZERO
 * RESIDUE BY CONSTRUCTION: written from the staged tree S8 = S7 + this cause, where S7 (X-49's stage, its write
 * committed) reproduces `5d0e4fb4…` exactly. FENCE 3 (call-path dormancy) re-run green at the write: zero
 * espionage calls. `5d0e4fb4…` -> `12a9c494…`.
 *
 * ── 2026-11-03, SIZE-3: THE SMALL-PLACE GUILD CHECK REQUIRES A REAL MARKET (THE COHERENCE AND SCALE WINDOW) ──
 * THE TWENTY-SECOND MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: THE COHERENCE AND SCALE WINDOW, ODQ §934.104 (the §881.4 STOP's own
 * terms); the record is docs/shift-records/2026-11-03-size-3-guild-market.json. THE MOVER, FOUND: 43f9c0dcc
 * (rulingStructure.js :: generatePowerStructure reads viability.js :: hasMarketInstitution): a thorp, hamlet or
 * village with no real market no longer seats a merchant guild. On THIS corpus 109 of 360 rows move (thorp 55,
 * hamlet 43, village 11; town, city, metropolis 0), in powerStructure and the power step's simulationTrace;
 * 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written from the staged tree
 * S5 = S4 + this cause, where S4 (SIZE-2's stage, its writes committed) reproduces `62338588…` exactly.
 * FENCE 3 (call-path dormancy) re-run green at the write: zero espionage calls. `62338588…` -> `5d0e4fb4…`.
 *
 * ── 2026-11-03, SIZE-2: GENERATED STORY TEXT NAMES THE PLACE BY ITS OWN TIER NOUN (THE COHERENCE AND SCALE WINDOW) ──
 * THE TWENTY-FIRST MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: THE COHERENCE AND SCALE WINDOW, ODQ §934.104 (the §881.4 STOP's own
 * terms); the record is docs/shift-records/2026-11-03-size-2-tier-noun-story-text.json. THE MOVER, FOUND: the
 * SIZE ruling-2 code (5eda29d5c + 8c76cf743): the stored history strings, the migration pressure line and the
 * arrival hook speak the place's own tier noun, a string map after every draw. On THIS corpus 127 of 360 rows
 * move (thorp 20, hamlet 18, village 24, city 26, metropolis 39, town 0), only in history.*, arrivalScene and
 * pressureSentence; 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written from the
 * staged tree S4 = S3 + this cause, where S3 (FOOD-3's stage, its writes committed) reproduces `5a2c0b5e…`
 * exactly. FENCE 3 (call-path dormancy) re-run green at the write: zero espionage calls. `5a2c0b5e…` -> `62338588…`.
 *
 * ── 2026-11-03, FOOD-3: FOOD DIVERSITY (THE COHERENCE AND SCALE WINDOW) ──
 * THE TWENTIETH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: THE COHERENCE AND SCALE WINDOW, ODQ §934.104 (the §881.4 STOP's own
 * terms); the record is docs/shift-records/2026-11-03-food-3-food-diversity.json. THE MOVER, FOUND: food
 * diversity (bd888a47a): the food record stores the sources a place has, the one source a famine fails and
 * the foodways line from the place's own table, and preserved non-grain sources lengthen the stores, which
 * the defence scores read. On THIS corpus 360 of 360 rows move; 360/360 hashes stay distinct. ATTRIBUTION,
 * ZERO RESIDUE BY CONSTRUCTION: written from the staged tree S3 = S2 + this cause, where S2 (FOOD-2's stage,
 * its writes committed) reproduces `0c918079…` exactly. FENCE 3 (call-path dormancy) re-run green at the
 * write: zero espionage calls. `0c918079…` -> `5a2c0b5e…`.
 *
 * ── 2026-11-03, FOOD-2: THE FOOD BASE NUMBERS (THE COHERENCE AND SCALE WINDOW) ──
 * THE NINETEENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: THE COHERENCE AND SCALE WINDOW, ODQ §934.104 (the §881.4 STOP's own
 * terms); the record is docs/shift-records/2026-11-03-food-2-food-base-numbers.json. THE MOVER, FOUND: the
 * food base numbers (a7f13fef4): one terrain table, no hidden /1.3 storage divisor, the tier's hinterland
 * share drawn as normal supply; the food record, viability and the defence scores read them, and what
 * legitimacy and prosperity re-deal downstream follows. On THIS corpus 360 of 360 rows move; 360/360 hashes
 * stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written from the staged tree S2 = S1 + this
 * cause, where S1 (FOOD-1's stage, its writes committed) reproduces `6260b43e…` exactly. FENCE 3 (call-path
 * dormancy) re-run green at the write: zero espionage calls. `6260b43e…` -> `0c918079…`.
 *
 * ── 2026-11-03, FOOD-1: ONE FOOD RECORD EVERY FOOD SENTENCE READS (THE COHERENCE AND SCALE WINDOW) ──
 * THE EIGHTEENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's delegation,
 * inside a NAMED CHARTERED WINDOW: THE COHERENCE AND SCALE WINDOW, ODQ §934.104 (the §881.4 STOP's own
 * terms); the record is docs/shift-records/2026-11-03-food-1-one-food-record.json. THE MOVER, FOUND: the
 * stored food record and its one set of cut-offs (b2aa5f5fa), with the surplus words reading it
 * (22d458883); prosperity reads the record, and what it re-deals downstream follows. On THIS corpus 360
 * of 360 rows move; 360/360 hashes stay distinct. ATTRIBUTION, ZERO RESIDUE BY CONSTRUCTION: written from
 * the staged tree S1 = S0 + this cause, where S0 (the window's tip 71541a9e6 with each of its golden-moving
 * commits reverse-applied) reproduces `8c4a42c5…` exactly. FENCE 3 (call-path dormancy) re-run green at
 * the write: zero espionage calls. `8c4a42c5…` -> `6260b43e…`.
 *
 * ── 2026-10-31, TENSION VARIETY: EIGHT VARIANTS PER ARCHETYPE, DRAWN WITHOUT REPLACEMENT (GS-1) ──────
 * THE SEVENTEENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's
 * delegation (ODQ §934.101); the record is docs/shift-records/2026-10-31-tension-variety.json.
 * THE MOVER: a tie's description and tension are drawn without replacement per settlement from
 * pools widened to eight per archetype, the drawn index stored on the tie (`proseVariant`); zero
 * rng draws. On THIS corpus 360 of 360 rows move; 360/360 hashes stay distinct.
 * ATTRIBUTION, ZERO RESIDUE (every differing JSON path, measured at the integration tip 458495a1
 * against the lane): relationships[].proseVariant (360), .tension (355), .description (351),
 * prominentRelationship.tension/phrasing/full (192/192/187) and pressureSentence (134, which
 * quotes the relationship phrasing); nothing else moves. `6f6dae34…` -> `8c4a42c5…`.
 *
 * ── 2026-10-31, ONE FACTION SET: THE POWER FACTIONS ARE THE FACTIONS (GS-2) ───────────────────────
 * THE SIXTEENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's
 * delegation (ODQ §934.101); the record is docs/shift-records/2026-10-31-one-faction-set.json.
 * THE MOVER: `factions[]` is a projection of the power factions derived at assembly from the final
 * roster, and `conflicts[]` (with its `powerStructure.conflicts` mirror) the power-faction pairs a
 * rivalry crosses, drawn on a new named assembly child stream; the faction-linkage trace is retired
 * and the receipt explains each conflict. On THIS corpus 360 of 360 rows move; 360/360 hashes stay
 * distinct. ATTRIBUTION, ZERO RESIDUE (measured at the integration tip b3d457b0 against the lane):
 * with `factions`, `conflicts`, `powerStructure.conflicts`, the linkage trace (and its clock) and the
 * receipt's conflict/faction evidence entries removed, all 360 rows hash identically before and
 * after. `607ea755…` -> `6f6dae34…`.
 *
 * ── 2026-10-30, THE MIGRATION CRISIS NAMES ONE DIRECTION (ruling 2) ─────────────────────────────
 * THE FIFTEENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's
 * delegation (ODQ §934.101); the record is docs/shift-records/2026-10-30-migration-one-direction.json.
 * THE MOVER: the mass-migration pressure line's weak-economy arm and two arrival vignettes told a
 * departure beside a crisis card that says the town is receiving people; they now tell the arrival
 * (pool sizes unchanged, so no draw moves). On THIS corpus 6 of 360 rows move; 360/360 hashes stay
 * distinct. ATTRIBUTION, ZERO RESIDUE: with `arrivalScene` and `pressureSentence` removed, all 360
 * rows hash identically before and after. `e90e078f…` -> `607ea755…`.
 *
 * ── 2026-10-30, THE ARRIVAL SCENE AGREES WITH THE INSTITUTIONS (T1-12, ruling 3) ───────────────
 * THE FOURTEENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's
 * delegation (ODQ §934.101, this fence's chartered window by the chair's ruling); the record is
 * docs/shift-records/2026-10-30-arrival-market-gate.json.
 * THE MOVER: every beat of the arrival scene (SIGHT, SENSE, PEOPLE) redraws a market-, stall- or
 * fair-worded line where the roster holds no market-class institution (DS-GEN-13's predicate,
 * arrivalScene.js :: holdsMarket). The merged tip 2acd0206 held `ddbfd9e8…` (reproduced from its
 * tree before this value was taken). On THIS corpus 48 of 360 rows move; 360/360 hashes stay
 * distinct. ATTRIBUTION, ZERO RESIDUE: with `arrivalScene` removed, all 360 rows hash identically
 * before and after. `ddbfd9e8…` -> `e90e078f…`.
 *
 * ── 2026-10-30, SERVICE CATEGORY FIDELITY (RS-1..RS-13): EVERY SERVICE IN ITS ONE BUCKET ──────
 * THE THIRTEENTH MOVEMENT OF THIS CONSTANT, chair-signed through the door under the owner's
 * delegation (ODQ §934.101, which the chair names this fence's chartered window); the record is
 * docs/shift-records/2026-10-30-service-category-fidelity.json.
 * THE MOVER: every authored catalog service name is registered in SERVICE_CATEGORY_MAP, so 162
 * catalog (service, host) pairs change bucket (Discreet passage -> criminal forks the crime-gate
 * stream at Underground-network hosts). The base d14c5c56 held `b9945f18…` (reproduced from its
 * tree before this value was taken). On THIS corpus 336 of 360 rows move; 360/360 hashes stay
 * distinct. ATTRIBUTION, ZERO RESIDUE: with `availableServices` removed, all 360 rows hash
 * identically at the base and here. `b9945f18…` -> `ddbfd9e8…`.
 *
 * ── 2026-10-02, THE VOICE PROGRAM WAVE 4 BLOCK 1: THE ARRIVAL HOOK NAMES ONLY WHAT IT HOLDS ──
 * THE TWELFTH MOVEMENT OF THIS CONSTANT, owner-signed through the door under ODQ §934.88; the
 * record is docs/shift-records/2026-10-02-voice-program-wave-4-hook-structures.json.
 * THE MOVER: a stress vignette naming a wall, gate, market, guard, granary or temple is drawn only
 * where the settlement holds it, and eleven structure-free vignettes join the pool (e76ea7f3c).
 * The base 5c12d56ee held `5df27d67…` (this file green there) before this value was taken.
 * On THIS corpus 59 of 360 rows move, the stressed ones; 360/360 hashes stay distinct.
 * ATTRIBUTION, ZERO RESIDUE: with `arrivalScene` and `pressureSentence` removed, all 360 rows
 * hash identically at the base and here. `5df27d67…` -> `b9945f18…`.
 *
 * ── 2026-10-02, THE VOICE PROGRAM WAVE 3: THE ARRIVAL SCENE IS A PLACE ──────────────────
 * THE ELEVENTH MOVEMENT OF THIS CONSTANT, owner-signed through the door under ODQ §934.88; the
 * record is docs/shift-records/2026-10-02-voice-program-wave-3-arrival-place.json.
 * THE MOVER: the arrival scene is composed beat by beat (d2dfd88b5): the tier template, the
 * slider-keyed magic line and the restating addon retire, and the sense, people and closing
 * beats speak facts the settlement holds. The base a85aa6c10 held `291e0a1e…` (this file green
 * there) before this value was taken.
 * On THIS corpus 360 of 360 rows move; 360/360 hashes stay distinct.
 * ATTRIBUTION, ZERO RESIDUE: with `arrivalScene` and `pressureSentence` removed, all 360 rows
 * hash identically at the base and here. `291e0a1e…` -> `5df27d67…`.
 *
 * ── 2026-10-02, THE VOICE PROGRAM WAVE 2: THE ARRIVAL AND PRESSURE DRAWS ON THEIR OWN STREAMS ──
 * THE TENTH MOVEMENT OF THIS CONSTANT, owner-signed through the door under ODQ §934.88; the
 * record is docs/shift-records/2026-10-02-voice-program-wave-2-substreams.json.
 * THE MOVER: assembleSettlement.js runs the pressure sentence and the arrival scene each on a
 * named child stream ('pressure-sentence', 'arrival-scene') instead of the step's shared one
 * (ed3768dc1), so the same seed prints different words in those two fields. The base 78ed2d08c
 * held `1c3748cb…` (this file green there) before this value was taken.
 * On THIS corpus 360 of 360 rows move; 360/360 hashes stay distinct.
 * ATTRIBUTION, ZERO RESIDUE: with `arrivalScene` and `pressureSentence` removed, all 360 rows
 * hash identically at the base and here. `1c3748cb…` -> `291e0a1e…`.
 *
 * ── 2026-10-01, J33: THE WARDEN'S LODGE CENSUS (owner-signed, through the door) ──────────
 * THE NINTH MOVEMENT OF THIS CONSTANT, under the same owner words as the eighth ("Warden's
 * Lodge stays defense, not druid"); the record is
 * docs/shift-records/2026-10-01-urban-band-warden-census.json (odqRow §934.86 addendum 2).
 * THE MOVER: the census the eighth movement's J31 owed. The lodge leaves every druid and magic
 * list (the chains' druid tradition, druidic cultivation in both food readers, folk magic
 * presence, the Druid Elder's seat), so in this magic-world corpus a settlement holding one
 * loses the druid readings it alone had opened. The base 731e19597 held `4888fd37…` (this
 * file green there) before this value was taken.
 * On THIS corpus 29 of 360 rows move, all of them towns; 360/360 hashes stay distinct.
 * ATTRIBUTION, ZERO RESIDUE: the 29 moved rows are exactly the 29 corpus settlements holding
 * a Warden's Lodge, and none of the 331 unmoved rows holds one. `4888fd37…` -> `1c3748cb…`.
 *
 * ── 2026-10-01, DRUIDS IN A WORLD WITHOUT MAGIC (owner-signed, through the door) ─────────
 * THE EIGHTH MOVEMENT OF THIS CONSTANT since the genesis freeze, a signed re-record under
 * tests/helpers/goldenRecordDoor.js like the seventh, and again not a spend of the one
 * window this file's STOP still names. The owner's words (2026-10-01): "druid is magic" ·
 * "Warden's Lodge stays defense, not druid"; the record is
 * docs/shift-records/2026-10-01-urban-band-druid-faith.json (odqRow §934.86 addendum 2).
 * THE MOVER: Warden's Lodge is defence, not druid. Its description, variants and identity
 * sentence lose the druid clause, its pairing becomes military, and it defends in every
 * world with a mundane tracking term (J31/J32). The instrument was re-run at the base
 * 4b86da68a and reproduced `9dab4460…` exactly before this value was taken.
 * On THIS corpus 29 of 360 rows move, all of them towns; 360/360 hashes stay distinct.
 * ATTRIBUTION, ZERO RESIDUE: the 29 moved rows are exactly the 29 corpus settlements
 * holding a Warden's Lodge, and none of the 331 unmoved rows holds one. `9dab4460…` ->
 * `4888fd37…`.
 *
 * ── 2026-09-30, THE URBAN BAND (owner-signed, through the door) ──────────────────────────
 * THE SEVENTH MOVEMENT OF THIS CONSTANT since the genesis freeze, and like the ones before
 * it a signed re-record under tests/helpers/goldenRecordDoor.js rather than a spend of
 * the one window this file's STOP still names. The owner's rulings: "Urban-band rebuild
 * (Recommended)" and "Approve + fold in MF-CH2B (Recommended)" (2026-09-30); the record is
 * docs/shift-records/2026-09-30-urban-band-institutions.json (odqRow §934.86). THE MOVER, IN
 * THE RECORD'S OWN WORDS: ONE CAUSE: THE URBAN BAND — the institution catalog became a
 * registry with two cumulative laws and complete tier blocks, and MF-CH2B's gates read the
 * declared magic licence (folded in by the owner, which is why MF-CH2B — named below as a
 * constituent of the LIGHTING WAVE — moves this constant here, through the door, and not
 * as a spend of that window). The registry re-orders the catalog draws, so every same-seed
 * roster moves. The instrument was re-run at the base 5d699cc68 and reproduced `0d5dac61…`
 * exactly before this value was taken.
 * On THIS corpus 360 of 360 rows move; 360/360 hashes stay distinct. `0d5dac61…` ->
 * `9dab4460…`.
 *
 * ── 2026-09-19, THE READER MET 'CHURCHES, MONASTERIES' IN A QUARTER CARD (owner-signed, through the door) ────
 * THE SIXTH MOVEMENT OF THIS CONSTANT since the genesis freeze, and like the ones before
 * it a signed re-record under tests/helpers/goldenRecordDoor.js rather than a spend of
 * the one window this file's STOP still names. The owner's order: "the parish church is
 * a house of worship on every surface" (2026-09-19); the record is
 * docs/shift-records/2026-09-19-religious-quarter-text.json (odqRow §934.22). THE MOVER,
 * IN THE RECORD'S OWN WORDS, because the record is the authority and this paragraph does
 * not paraphrase it: THE READER MET 'Churches, monasteries' IN A QUARTER CARD WHOSE OWN
 * BULLET NOW READS 'Houses of worship (2-5)'.
 * On THIS corpus 346 of 360 rows move; 360/360 hashes stay distinct. `91a60437…` ->
 * `0d5dac61…`.
 *
 * ── 2026-09-19, THE READER STOPPED MEETING 'PARISH CHURCH' IN THE SENTE… (owner-signed, through the door) ────
 * THE FIFTH MOVEMENT OF THIS CONSTANT since the genesis freeze, and like the ones before
 * it a signed re-record under tests/helpers/goldenRecordDoor.js rather than a spend of
 * the one window this file's STOP still names. The owner's order: "do these as well"
 * (2026-09-19); the record is docs/shift-records/2026-09-19-parish-church-text.json
 * (odqRow §934.13). THE MOVER, IN THE RECORD'S OWN WORDS, because the record is the
 * authority and this paragraph does not paraphrase it: THE READER STOPPED MEETING
 * 'PARISH CHURCH' IN THE SENTENCE UNDER A LABEL THAT SAYS HOUSE OF WORSHIP.
 * On THIS corpus 348 of 360 rows move; 360/360 hashes stay distinct. `6ffc462c…` ->
 * `91a60437…`.
 *
 * ── 2026-09-19, THE VIEW RE-DERIVED THREE NUMBERS ITS WRITER ALREADY HELD (owner-signed, through the door) ────
 * THE FOURTH MOVEMENT OF THIS CONSTANT since the genesis freeze, and like the ones
 * before it a signed re-record under tests/helpers/goldenRecordDoor.js rather than a
 * spend of the one window this file's STOP still names. The owner's order: "make sure
 * that the food deficit math and the band visual are correct" (2026-09-19); the record
 * is docs/shift-records/2026-09-19-food-balance-arithmetic.json (odqRow §934.15). THE
 * MOVER, IN THE RECORD'S OWN WORDS, because the record is the authority and this
 * paragraph does not paraphrase it: THE VIEW RE-DERIVED THREE NUMBERS ITS WRITER ALREADY
 * HELD, AND GOT TWO OF THEM WRONG.
 * On THIS corpus 360 of 360 rows move; 360/360 hashes stay distinct. `38a26ac1…` ->
 * `6ffc462c…`.
 *
 * ── 2026-09-18, THE PRESSURE-SENTENCE AGREEMENT (owner-signed, through the door) ─────────
 * THE THIRD MOVEMENT SINCE THE GENESIS FREEZE, and like the two before it a signed re-record
 * under tests/helpers/goldenRecordDoor.js rather than a spend of the one window this file's STOP
 * still names. The owner ordered every reported fix implemented ("impliment every fix",
 * 2026-09-18); the record is docs/shift-records/2026-09-18-pressure-sentence-agreement.json
 * (odqRow §934). THE MOVER, IN THE RECORD'S OWN WORDS: "THE PRESSURE SENTENCES STOPPED MAKING A
 * PLURAL COMMODITY THE SUBJECT OF A SINGULAR VERB." A famine hook read "knows where the hoarded
 * medicinal herbs is" on the Overview, the DM Summary and Table View at once, because all three
 * read the one generated pressureSentence; src/generators/narrativeText.js carried three
 * templates that made a bare commodity label the subject of a number-sensitive verb, and all
 * three became invariant clauses. On THIS corpus 3 of 360 rows move; 360/360 hashes stay
 * distinct. `a0c145b2…` -> `38a26ac1…` (the record's cause quotes the LANE-TIP chain
 * `f13df68e…` -> `38a26ac1…`, measured before the consist carried the second movement; the
 * door re-measured on the consist and wrote this figure, as the record itself instructs).
 *
 * ── 2026-09-18, THE CONTENT-COHERENCE FIXES (owner-signed, through the door) ────────────
 * THE SECOND MOVEMENT SINCE THE GENESIS FREEZE, and like the first it is a signed re-record
 * under tests/helpers/goldenRecordDoor.js rather than a spend of the one window this file's STOP
 * still names. The owner ordered every reported fix implemented ("impliment every fix",
 * 2026-09-18); the record is docs/shift-records/2026-09-18-content-coherence.json (odqRow §934).
 * THE MOVERS, FOUND AND ATTRIBUTED TO ZERO RESIDUE by single-variable trees measured against the
 * base, whose union is exactly the tip and leaves no row unexplained: D1 and D1b took one world's
 * liturgy out of the service catalogue and the role labels (a Mesoamerican-inspired hamlet was
 * listing Baptism and Sunday mass under HEALING beside its own cultural titles), D2 stopped the
 * role catalog's generalist bucket filing any role into any faction, and D3 rewrote eight plot
 * hooks out of the rolled-table register. D4 and D4b moved nothing here: they are a display
 * read-model. On THIS corpus 360 of 360 rows move; 360/360 hashes stay distinct.
 * `f13df68e…` -> `a0c145b2…` (the record's cause quotes `4f764737…`, the D1–D4 lane-tip
 * measurement taken before D1b moved 441 further rows of the same corpus; the door
 * re-measured on the consist and wrote this figure).
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
const PRE_COUPLING_CORPUS_SHA = '1bb9e7a2721538c7891c6b983b4d02db9aacd9aa29ff4794153246e7bbb43730';

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
