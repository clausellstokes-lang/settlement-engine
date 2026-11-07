/**
 * scripts/prose-manifest-cells.mjs — THE PER-CELL TABLE, ON DEMAND (ARCH §3.7).
 *
 * WHAT IT IS. The DRIFT corpus composed through the six desks at both audiences, written out
 * one row per CELL — `${keyOf(config)}::${audience}::${mount}::${rungIndex}` with the pool,
 * the variant, the drawn index, the face, the angle, the pieces and a text digest. ~72,000
 * rows at this tip.
 *
 * ⛔ NEVER COMMITTED, AND THAT IS THE DESIGN. The committed artefact is the per-ROW roll-up
 * (`tests/fixtures/dossier-prose-manifest-golden.json`, 1,050 rows), which is what a gate can
 * afford to carry and what the drift arm reads. The per-cell table is regenerated at any sha
 * by this command and handed to `scripts/prose-manifest-diff.mjs`, which is how a signed car
 * answers "what KIND of movement was that" instead of "a row moved".
 *
 * ⛔ IT RE-SPELLS NOTHING. Every cell comes from `tests/helpers/dossierManifest.js`, the same
 * module the suite asserts through, so the recorded world and the asserted world cannot
 * diverge — the estate's own `presetLightingWitnessRun.js` law.
 *
 * READ-ONLY except the `--out` file it is asked for.
 *
 *   node scripts/prose-manifest-cells.mjs --out <file>       the DRIFT corpus, both audiences
 *   node scripts/prose-manifest-cells.mjs --out <file> --limit 20    a cheap slice for a plant
 *   node scripts/prose-manifest-cells.mjs --out <file> --limit 8 --seeds 60
 *                                                           the RE-INDEXED plant's corpus
 *   GOLDEN_SHIFT_SIGNED=docs/shift-records/<record>.json \
 *     node scripts/prose-manifest-cells.mjs --record         re-record the committed fixture,
 *                                                           THROUGH THE SIGNED DOOR (see below)
 *
 * ⛔ WHY `--seeds` EXISTS (the MEASURE fold's U4, cure 7). Car 1's second classifier plant —
 * a third variant appended to a two-variant pool, RE-INDEXED on ≈ 2/3 of that pool's cells —
 * was measured on 8 configurations x 60 SEEDS, and no committed command produced that corpus:
 * the DRIFT corpus is 516 rows at one seed, where a pool has one hash and one drawn variant,
 * so the plant cannot fire on it at all. A plant nobody but its author can re-run is a
 * measurement the estate has to take on trust. `--seeds N` re-seeds each configuration N
 * times (`--seed-prefix` names the family), and `keyOf` folds the seed into the row key, so
 * the corpus is exactly the plant's and every cell is addressed distinctly.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { recordGolden } from '../tests/helpers/goldenRecordDoor.js';

import {
  AUDIENCES, driftRun, goldenCorpus, manifestBytes, recorderShas,
} from '../tests/helpers/dossierManifest.js';
import { ROOT } from '../tests/helpers/dossierCorpus.js';

/** The committed roll-up the drift arm reads. */
export const MANIFEST_REL = 'tests/fixtures/dossier-prose-manifest-golden.json';

/**
 * THE DECLARED SHIFT THE RE-RECORD CARRIES. It is written INTO the fixture's bytes, so the
 * drift arm compares it and a fixture cannot carry one declaration while its rows carry another.
 *
 * ⭐ A PROSE SHIFT, SIGNED (owner orders 2026-09-17). The declaration before this one was an
 * INSTRUMENT shift (SITTING §P.2-29, MEASURE car 3: the economy desk called by its shipped
 * recipe; recorded over `fcd98a3dbb3178adccb37b6f3f103bb5dc03af63`). This one moves composed
 * PROSE, under the owner's own words, so it names the orders and the signed record rather than
 * a sitting row.
 */
export const MANIFEST_PROVENANCE = Object.freeze({
  shift: 'PROSE',
  ruling: 'OWNER ORDERS 2026-09-17: "Fix the contradiction." and "fix the remaining contradictions";'
    + ' the owner signed the re-record ("I approve"); docs/shift-records/2026-09-17-dossier-contradictions.json.',
  car: 'DOSSIER AND REALM POLISH, parts 1 and 3 (docs/FIRST_CONTACT_BACKLOG.md)',
  recordedOverSha: '4416e8f9d68fd06a380bd84715681b6e69829ff9',
  note: 'Three predicates now read the same truth as the surface beside them. DS-STR-1\'s no-banner'
    + ' rung composes on a town with NO crisis banner instead of on every town with one (all 1,050'
    + ' rows: 516 golden-master-v3 towns lose the cell, the three calm gm-seed towns gain it);'
    + ' DS-GEN-16\'s UNMARKED ("No great blow stands on the record") no longer composes over a record'
    + ' carrying a major or catastrophic row (15 towns, 30 rows lose that cell); and DS-POW-2\'s'
    + ' stability header follows the label beneath it now that an infiltrated town no longer reads'
    + ' `Stable` beside its own ACTIVE CRISIS card (958 cells = 479 towns x 2 audiences, all in'
    + ' `power.stabilityHeader`, leaving the `stable matched` pool for the plain-description floor;'
    + ' the CELL COUNT does not move for this one, only the content). 73,284 cells become 72,240.'
    + ' `recordedOverSha` is DECLARATIVE (the base the change was built on); `recorder` is the'
    + ' executable half.'
    + ' 2026-09-20 (CURE-J, docs/shift-records/2026-09-20-cure-j-provenance.json): re-recorded with'
    + ' ZERO rows moved (rowsSha unchanged) after the recorder identity became comment-insensitive'
    + ' — FIX-C2\'s citation re-address in scripts/prose-rate-corpus.mjs had moved the raw sha of a'
    + ' recorder file.'
    + ' 2026-09-30 (THE URBAN BAND, docs/shift-records/2026-09-30-urban-band-institutions.json, ODQ'
    + ' §934.86): re-recorded over the owner\'s declared same-seed generation shift. The institution'
    + ' registry re-orders the catalog draws, so 980 of the 1,050 rows move and none is added or'
    + ' removed; the PROSE declaration stands because what moves is the composed prose of the moved'
    + ' worlds, under the same recorder.'
    + ' 2026-10-01 (DRUIDS IN A WORLD WITHOUT MAGIC, docs/shift-records/2026-10-01-urban-band-druid-faith.json, ODQ'
    + ' §934.86 addendum 2): re-recorded again because Warden\'s Lodge reads as the ranger post it is (no druid clause)'
    + ' and defends in every world; 36 of the 1,050 rows move, none added or removed.'
    + ' 2026-10-01 (J33, docs/shift-records/2026-10-01-urban-band-warden-census.json, the same rulings): re-recorded'
    + ' again because Warden\'s Lodge leaves every druid and magic list, so a magic town holding one loses the druid'
    + ' readings it alone had opened; 70 of the 1,050 rows move, none added or removed.'
    + ' 2026-11-03 (FOOD-1, docs/shift-records/2026-11-03-food-1-one-food-record.json, ODQ §934.104, THE COHERENCE AND'
    + ' SCALE WINDOW): re-recorded because every food sentence reads one stored food record with one set of cut-offs and'
    + ' the surplus words read it; 222 of the 1,050 rows move, none added or removed.'
    + ' 2026-11-03 (FOOD-2, docs/shift-records/2026-11-03-food-2-food-base-numbers.json, ODQ §934.104, THE COHERENCE AND'
    + ' SCALE WINDOW): re-recorded because the food base numbers read one terrain table with no hidden storage divisor'
    + ' and draw the hinterland as normal supply; 978 of the 1,050 rows move, none added or removed.'
    + ' 2026-11-03 (FOOD-3, docs/shift-records/2026-11-03-food-3-food-diversity.json, ODQ §934.104, THE COHERENCE AND'
    + ' SCALE WINDOW): re-recorded because the food record holds the sources a place has and preserved sources lengthen'
    + ' the stores the defence lines read; 120 of the 1,050 rows move, none added or removed.'
    + ' 2026-11-03 (SIZE-3, docs/shift-records/2026-11-03-size-3-guild-market.json, ODQ §934.104, THE COHERENCE AND'
    + ' SCALE WINDOW): re-recorded because a small place with no real market no longer seats a merchant guild, so its'
    + ' power lines and the conflict line the guild carried move; 174 of the 1,050 rows move, none added or removed.'
    + ' 2026-11-03 (DEFENSE, docs/shift-records/2026-11-03-defense-roster-pools.json, ODQ §934.104, THE COHERENCE AND'
    + ' SCALE WINDOW): re-recorded because the Defense tab\'s pools check the roster before they speak, so the defence'
    + ' lines that presupposed a garrison, soldiers, walls or an empty store are reworded; 1,018 of the 1,050 rows move,'
    + ' none added or removed.'
    + ' 2026-11-03 (X-49, docs/shift-records/2026-11-03-x49-stores-off-defense.json, ODQ §934.104, THE COHERENCE AND'
    + ' SCALE WINDOW): re-recorded because the stored-food figure has one home, the Economy tab, so the Defense tab\'s'
    + ' food-stores lines leave; all 1,050 rows move, none added or removed.'
    + ' 2026-11-03 (DEFENSE-2, docs/shift-records/2026-11-03-defense-magic-dependency.json, ODQ §934.104, THE COHERENCE'
    + ' AND SCALE WINDOW): re-recorded because the defence record stores the one magic reliance reading and the Defense'
    + ' tab reads it and the one practitioner census; 512 of the 1,050 rows move, none added or removed.'
    + ' 2026-11-03 (FOOD-print, docs/shift-records/2026-11-03-food-print-comfortable-pool.json, ODQ §934.104, THE'
    + ' COHERENCE AND SCALE WINDOW): re-recorded because the comfortable-prosperity pool stops claiming a food surplus'
    + ' the food record does not show; 232 of the 1,050 rows move, none added or removed.'
    + ' 2026-11-04 (X-46 car 1, docs/shift-records/2026-11-04-rung1-01-x46-car-1-bands.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 1264a8152 because the owner\'s historical population bands and the one disjoint tier stamp; no household count (U4 removed it by the owner\'s word); 376 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (X-46 car 2, docs/shift-records/2026-11-04-rung1-02-x46-car-2-thresholds.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of d4bf6431c because the thresholds — seventeen bare population comparisons re-based through TIER_STAMP_CUTS, the Dwellings and Housing rows on the owner\'s household column, Money changers\' floor 3,000 -> 2,000; 8 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (FAITH-POOLS, docs/shift-records/2026-11-04-rung1-04-faith-pools.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 2e10cd529 because 0 golden-master rows, the dossier prose moves): DS-FTH-2 reads the one faith reading — no denial, no grade, each sentence a fact the reading gives; 1,050 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (TERRAIN-POOLS, first step, docs/shift-records/2026-11-04-rung1-06-terrain-pools-1.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of ac09ea83b because the water-speaking pools and lines are licensed on the place\'s water fact (the A-11 licences; the Defense desk\'s harbour line reads the water fact); 282 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (SELF-VOUCH, docs/shift-records/2026-11-04-rung1-08-self-vouch.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 0be13b5cb because the eighth formal judgment, record_coherence_battery, over the stored record, and DS-GEN-11\'s zero pool vouches only when it passed; 978 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (T1/T2, docs/shift-records/2026-11-04-rung1-10-t1-t2-siege-stores.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of fe56bddd4 because the siege keeps 0.3 of the harvest; a village stores as a hamlet does; 70 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (X-46 car 3 (lane x46-3-budget), docs/shift-records/2026-11-04-rung1-12-x46-car-3-budget.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 90dc22f18 because the institution budget follows the population: seven anchors read log-linearly and one density factor per settlement; 960 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (X-46 car 1b, second step (U4–U5), docs/shift-records/2026-11-04-rung1-13-x46-car-1b-2-curve.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of fb0341b93 because the metropolis roll is flat to 50,000 and thins exponentially to 1,000,000, the rarer variant past 50,000; 96 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (PLACE-NOT-TIER (R6, units 1–2), docs/shift-records/2026-11-04-rung1-15-place-not-tier.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 6129c300d because the soldiers line, the Guard Captain and the garrison read the place\'s forces, and a small place seats no guild power without a market; 48 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (PINS, first step (units 1–3 and the chair\'s addendum), docs/shift-records/2026-11-04-rung1-17-pins-1-density-exemptions.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 37b1e746d because route-required and authored-rarity rows leave the density factor and the top anchor is the catalogue\'s ceiling; 340 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (TRUTH, second step (unit D), docs/shift-records/2026-11-04-rung1-18-truth-2-unit-d.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 844acaccc because the infiltrator takes a real name and the criminal structure is not null beside a network; 24 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (X-46 car 3, I7, docs/shift-records/2026-11-04-rung1-19-x46-car-3-i7-realised.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 6ca454d2b because the realised table is re-measured at the composed tip and every settlement\'s density factor answers it; 158 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (PINS, second step (units 6–7), docs/shift-records/2026-11-04-rung1-20-pins-2-rarity-mark.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 11467ed57 because the rows whose own text calls them rare carry the rarity mark; 72 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (F6 BUDGET-FLOOR (units 1–4), docs/shift-records/2026-11-04-rung1-22-f6-budget-floor.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 6d84aa834 because the institution budget\'s density factor answers anchor − R − X over the scalable rows; 412 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (F1 DEFENCE-WORDS, first step (units 1–5), docs/shift-records/2026-11-04-rung1-23-f1-defence-words.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 5e9ffb220 because every defence claim writer reads defenseFactsOf and a hired company is not called a garrison; 34 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (F3 FOOD-WORDS (units 1–5), docs/shift-records/2026-11-04-rung1-24-f3-food-words.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of db8ce5da8 because a processed food good is an export only on a surplus and a fishing row on water is a fish source; 2 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-04 (F10 WALLS-WORD (units 1–4), docs/shift-records/2026-11-04-rung1-26-f10-walls-word.json, ODQ §934.105, RUNG 1 OF THE'
    + ' SOAK LADDER): re-recorded at the stage of 54daafda3 because a line that names walls, soldiers or a garrison takes its twin where the roster lacks the thing; 288 of the 1,050 rows move, '
    + '0 added, 0 removed.'
    + ' 2026-11-06 (THE FOOD PER CENT FROM THE POUNDS, docs/shift-records/2026-11-06-rung1-34-food-per-cent-from-pounds.json, ODQ §934.105,'
    + ' RUNG 1 OF THE SOAK LADDER): re-recorded at the stage of 18fd6b442 because the food writer and its view derive the per cent from the'
    + ' pounds they publish, with no floor; 24 of the 1,050 rows move, 0 added, 0 removed.'
    + ' 2026-11-07 (THE REVIEW-INTAKE LANE, RECORD 0a OF THE PEOPLE CAR\'S LANDING, docs/shift-records/2026-11-07-people-land-0a-review-intake.json,'
    + ' ODQ §934.105): re-recorded at the stage of 5b444331a because the review-intake lane\'s merge (a proxy is not a provider; water read'
    + ' from the record; no roster carries one secret or goal twice) moved the composed prose of four towns; 8 of the 1,050 rows move, 0 added,'
    + ' 0 removed.'
    + ' 2026-11-07 (PEOPLE-1 CAST, RECORD 1 OF THE PEOPLE CAR\'S LANDING, docs/shift-records/2026-11-07-people-1-cast'
    + '.json, ODQ §934.105): re-recorded at the stage of dc655f712 because one face per face-bearing house replaces t'
    + 'he faction rungs\' NPCs, each power ranking its first, second and third; 762 of the 1,050 rows move, 0 added, '
    + '0 removed.'
    + ' 2026-11-07 (PEOPLE-3 HOOKS, RECORD 3 OF THE PEOPLE CAR’S LANDING, docs/shift-records/2026-11-07-people-3-hook'
    + 's.json, ODQ §934.105): re-recorded at the stage of 0f930ce95 because one person hook per card replaces the man'
    + 'y, the tensions and the history kept; 484 of the 1,050 rows move, 0 added, 0 removed.'
    + ' 2026-11-07 (PEOPLE-4 TIES, RECORD 4 OF THE PEOPLE CAR’S LANDING, docs/shift-records/2026-11-07-people-4-ties.'
    + 'json, ODQ §934.105): re-recorded at the stage of c7d552370 because one outgoing tie per card replaces the pair'
    + ' writer; 892 of the 1,050 rows move, 0 added, 0 removed.'
    + ' 2026-11-07 (PEOPLE-5A DISPLAY, RECORD 5a OF THE PEOPLE CAR’S LANDING, docs/shift-records/2026-11-07-people-5a'
    + '-display.json, ODQ §934.105): re-recorded at the stage of 053283dfd because the legacy grouping’s member lists'
    + ' are read from the memberships; 312 of the 1,050 rows move, 0 added, 0 removed.',
});

/** This surface's identity in tests/fixtures/.golden-freeze-register.json. */
export const MANIFEST_SURFACE = 'dossier-prose-manifest';

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const outAt = argv.indexOf('--out');
  const limitAt = argv.indexOf('--limit');
  const seedsAt = argv.indexOf('--seeds');
  const prefixAt = argv.indexOf('--seed-prefix');
  const record = argv.includes('--record');
  const limit = limitAt >= 0 ? Number(argv[limitAt + 1]) : 0;
  const seeds = seedsAt >= 0 ? Number(argv[seedsAt + 1]) : 0;
  const prefix = prefixAt >= 0 ? String(argv[prefixAt + 1]) : 'manifest-seed';
  const base = limit > 0 ? goldenCorpus().slice(0, limit) : goldenCorpus();
  const configs = seeds > 0
    ? base.flatMap((config) => Array.from({ length: seeds }, (_, i) => ({ ...config, _seed: `${prefix}-${i}` })))
    : base;
  console.log(`PROSE MANIFEST CELLS · ${configs.length} configurations x ${AUDIENCES.length} audiences`
    + (seeds > 0 ? ` (${base.length} configurations x ${seeds} seeds, family ${prefix})` : ''));
  const run = await driftRun({ configs });
  console.log(`  towns ${run.towns} · rows ${run.rows.size} · cells ${run.cells.length} · ${run.seconds} s`);
  console.log(`  cells whose variant the rendered sentence did not identify: ${run.unresolved}`
    + ` · identified ambiguously: ${run.ambiguous}`);
  console.log('  cells where a recomputation over the AUDIBLE pool would have drawn a different'
    + ` variant (the slot-anchoring filter's own footprint, not a defect): ${run.drawDisagrees}`);
  if (record) {
    // ⛔ THE ONE WRITE PATH IS THE SIGNED GOLDEN DOOR. This surface was written here directly
    // while the register was UNFROZEN (the door's own arms forbade a recorded value then). The
    // genesis freeze (2026-09-16) armed the register, and from it a plain write is an unsigned
    // move of a frozen golden, so `--record` now goes through `recordGolden`: it REFUSES without
    // `GOLDEN_SHIFT_SIGNED` naming a signed record for this surface, refuses a dirty tree beyond
    // the fixture, the register and the record, writes the fixture and its register row in one
    // act, and THROWS on success by design. Re-run the manifest suite and
    // tests/lint/goldenFreeze.walker.test.js plainly afterwards; that green is the receipt.
    if (seeds > 0 || limit > 0) throw new Error('--record writes the DRIFT corpus whole: drop --limit and --seeds');
    const bytes = manifestBytes(run.rows, { ...MANIFEST_PROVENANCE, recorder: recorderShas() });
    recordGolden({ surface: MANIFEST_SURFACE, path: join(ROOT, MANIFEST_REL), produce: () => bytes, root: ROOT });
  }
  if (outAt >= 0 && argv[outAt + 1]) {
    writeFileSync(argv[outAt + 1], `${JSON.stringify({
      corpus: { kind: 'DRIFT', configs: configs.length, audiences: [...AUDIENCES] },
      rows: Object.fromEntries([...run.rows].sort((a, b) => (a[0] < b[0] ? -1 : 1))),
      cells: run.cells,
    }, null, 1)}\n`);
    console.log(`  wrote ${argv[outAt + 1]}`);
  } else {
    console.log('  (no --out given: nothing written)');
  }
}

if (process.argv[1] && process.argv[1].endsWith('prose-manifest-cells.mjs')) await main();
