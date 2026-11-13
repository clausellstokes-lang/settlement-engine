/**
 * tests/lint/proseWiringCensus.walker.test.js — INSTR-912 car 8's gate.
 *
 * WHAT IT PROVES. The wiring census (`src/domain/prose/wiringCensus.js`) recovers, per
 * (block, pool), the PREDICATE that selects the pool, the READINGS that predicate consults
 * and the SLOTS the composer's bag fills — from the composers' source, never from the pool's
 * own name. It then reads the same rows the other way: fact → the pools, variants and
 * grammars that can speak to it, sorted into MISSING · THIN · COVERED for the authoring wave.
 *
 * ── WHY EVERY ARM HERE CARRIES A CONTROL THAT MUST FIRE ─────────────────────────────
 * A census is the easiest instrument in the estate to make vacuous: report `[]`, report a
 * clean bill, and be believed. So every arm is proved on a fixture built to break it, in
 * PAIRS wherever the arm is a negative — the mutation must red and the cure must green, or
 * the arm measures as little as one that reds on everything.
 *
 * ── WHAT IT DOES NOT DO ─────────────────────────────────────────────────────────────
 * It gates NOTHING about the corpus. Every corpus figure below is REPORT-ONLY except the
 * three structural identities (the census covers every pool exactly once; the variant
 * arithmetic closes; both statuses occur). A pool the census cannot resolve is
 * WIRING-UNRESOLVED with its reason — a finding for the chair, never a defect asserted
 * against the corpus, and never a guess.
 *
 * @enforced-by npx vitest run tests/lint/proseWiringCensus.walker.test.js
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  absenceOf, attachSets, censusIndex, censusSummary, CIVIC_OBJECT_CLASSES, cleanPredicate,
  coOccurringPairs, COVERT_SOURCES, customReachable, decorateRows, factBudget, factIndex,
  isCovertPath, JS_METHOD_TAILS, modifierRows, moduleKeyTables, narrowedReads, objectClassesOf,
  objectClassOf, poolKeyFunctions, rootOf, spineRows, stringLiterals, tierRows, TIERS,
  wiringCensus, WIRING_STATUS,
} from '../../src/domain/prose/wiringCensus.js';
import {
  aliasDraft, aliasKey, astLineIndex, astTokens, buildCensus, CANDIDATE_LEAF_DIR,
  CANDIDATE_LEAF_SUFFIX, candidateLeafIndex, censusCheck, censusDry, CENSUS_JSON,
  draftSources, EVIDENCE_ORDER, factMounts, producerCitations, producerIndex,
  relationsFromSitting, relationTable, serialise, wilsonBp, wilsonFloorCount,
} from '../../scripts/wiring-census.mjs';
import {
  capturedRulingStructure, fieldSourceOf, FIELD_REASONS, holderCensus, HOLDER_KINDS,
  holderKindOfField, HOLDER_RECORDS, HOLDER_REASONS, HOLDER_SOURCES, holdersOf, sourceOfForTown,
  sourceOfRow, sourceSummary, sourcesAllCited, standingOf, STATE_ORGAN_KINDS, tableFieldsOf,
  uncitedSourcesOf,
} from '../../src/domain/prose/holderTable.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { DUTY_SERVICE_KINDS } from '../../src/domain/institutions/institutionTable.js';
// ⛔ THE SHIPPED RULE, IMPORTED, NEVER RE-SPELLED HERE (car 0e). The first cut of the per-tier
// arm kept a second copy of the silence rule in this file, so the fixture proved the copy and
// the corpus figure proved the script, and nothing tied the two together. The estate's idiom
// is the walker importing the scanner, which is how the census's own readers arrive above.
import {
  deskReturns, economyDeskOptions, impairedInstitutionOf, pairMemberClass,
  tierSilences as tierSilencesOf,
} from '../../scripts/prose-rate-corpus.mjs';
import { economyDeskRead } from '../../src/components/new/economyDeskRead.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';
import { composedReadingSequence } from '../fixtures/composedReadingSequence.js';
import { DOSSIER_MOUNTS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { walkEntry, walkPair } from '../../src/domain/prose/entryWalker.js';
import { walkGrammar } from '../../src/domain/prose/grammarWalker.js';
import { UNMOUNTED_BLOCKS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { loadStateLeaves, poolCells, ROOT, STATE_ANNEX } from '../helpers/dossierCorpus.js';
import { readAnnexDeclarations } from '../../scripts/lib/dossier-annex-grammar.mjs';
import {
  FIELD_SYNONYM_ROWS, HOLDER_KIND_NOUN_ROWS, fieldSynonymTable, fieldSynonymsFor,
} from '../../src/domain/prose/fieldSynonyms.js';
import {
  composedFillByBlock, composedFillByKeyFunction, composerSources, fillSites, unrenderedFacts,
} from '../helpers/dossierComposedFill.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import {
  COMPOSER_COVERT_SOURCE, COMPOSER_DEEP_PATH, COMPOSER_DEFAULTING_READ,
  COMPOSER_DEFAULTING_READ_GUARDED, COMPOSER_DOUBLE_QUOTED_KEY,
  COMPOSER_DOUBLE_QUOTED_KEY_REMOVED, COMPOSER_FOUR_BRANCHES, COMPOSER_NUMERIC_KEY,
  COMPOSER_BRANCH_FLAT, COMPOSER_BRANCH_GRAIN,
  COMPOSER_ONE_BRANCH, COMPOSER_PAIR_TABLE, COMPOSER_POLARITY,
  COMPOSER_PREDICATE_OVER_UNREAD, COMPOSER_TABLE, COMPOSER_TEMPLATE, COMPOSER_TWO_BRANCHES,
  firingsByTier, firingsCoFiring, MARKED_ON_A_COVERT_PATH, NAMES_AN_UNFILLED_SLOT,
  NAMES_ONLY_FILLED_SLOTS, SETTLEMENT_ONLY, UNMARKED_ON_A_COVERT_PATH,
} from '../fixtures/wiringFixtures.js';

/** Build the block → pool → variants table the census takes, from the R1 leaves. */
function poolTableOf(leaves) {
  /** @type {Map<string, Map<string, Array<{text: string, slots: string[]}>>>} */
  const table = new Map();
  for (const e of leaves) {
    if (!table.has(e.block)) table.set(e.block, new Map());
    const block = table.get(e.block);
    if (!block) continue;
    if (!block.has(e.pool)) block.set(e.pool, []);
    (block.get(e.pool) || []).push({ text: e.text, slots: e.slots });
  }
  return table;
}

/** One fixture census, from a composer source and a hand-written pool table. */
function fixtureCensus(source, pools, extra = {}) {
  return wiringCensus({
    sources: new Map([['fixture/composer.js', source]]),
    pools,
    ...extra,
  });
}

/** @param {Array<[string, Array<[string, ReadonlyArray<{text: string, slots?: string[]}>]>]>} spec */
function poolsFrom(spec) {
  return new Map(spec.map(([block, entries]) => [block, new Map(entries)]));
}

const leaves = await loadStateLeaves();
const poolTable = poolTableOf(leaves);
const sites = fillSites();
const fillByBlock = new Map([...composedFillByBlock(sites)].map(([b, r]) => [b, r.slots]));
const census = wiringCensus({
  sources: composerSources(),
  pools: poolTable,
  fill: fillByBlock,
  fillByKeyFunction: composedFillByKeyFunction(sites),
  unmounted: UNMOUNTED_BLOCKS,
  // ⭐ THE ANNEX DECLARATIONS, EXACTLY AS `buildCensus` PASSES THEM (TASTE car M-2). A live
  // census built WITHOUT them reads the taste's seven modifier pools as WIRING-UNRESOLVED with
  // no reading at all — an instrument measuring its own missing input and calling it a finding.
  declared: readAnnexDeclarations(readFileSync(STATE_ANNEX, 'utf8')),
});
const held = [...new Set(unrenderedFacts().flatMap((r) => r.held))];
/**
 * ⭐⭐ THE SPINE POPULATION, WHICH IS WHAT EVERY CORPUS FIGURE IN THIS FILE IS PINNED ON
 * (TASTE car M-2). Every integer below was measured on a corpus in which every pool was a
 * spine. `spineRows` is the same filter `scripts/wiring-census.mjs` applies before it writes
 * a single total, so the walker and the register are computing the same population or the
 * walker is measuring a different corpus than the file it checks.
 */
const spines = spineRows(census.rows);
const modifiers = modifierRows(census.rows);
const summary = censusSummary(spines, held);

describe('the wiring census — TOTALITY over the corpus', () => {
  test('every (block, pool) the loaders enumerate has exactly ONE census row', () => {
    const cells = poolCells(leaves.filter((e) => e.register === 'R1'));
    // The loaders' own pool count, and the census's, as INTEGERS. `> 0` would pass a census
    // that covered one pool of seven hundred.
    // ⛔ THE SPLIT IS ASSERTED RATHER THAN THE SUM (REWRITE car 8a-3, re-cutting TASTE car
    // M-2's pins to the PRODUCT's state). The taste's dock births seven MODIFIER pools and
    // reads 715 / 708 / 7; this tree lands the taste's INSTRUMENTS and none of its annex rows,
    // so the corpus is 708 cells, every one of them a spine, and the modifier population is
    // EMPTY BY CONSTRUCTION until 8b authors the estate's first modifier row. The partition
    // itself is proved on a plant below rather than on a population of zero, so this pair of
    // integers is a state record and never the arm's convicting half.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 709 -> 717.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 709 -> 717.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 709 -> 717.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 709 -> 717.
    expect(cells.size, 'the R1 loaders enumerate this many pool cells').toBe(856); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 857 -> 856 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 711 -> 715 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 715 -> 718 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 718 -> 724 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 724 -> 729 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 729 -> 733 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 733 -> 766 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (709 -> 792) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (709 -> 800) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (709 -> 852) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (709 -> 857)
    expect(census.rows.length, 'and the census carries exactly one row for each').toBe(856); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 711 -> 715 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 715 -> 718 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 718 -> 724 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 724 -> 729 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 729 -> 733 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 733 -> 766 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (709 -> 792) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (709 -> 800) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (709 -> 852) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (709 -> 857) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 857 -> 856
    expect(spines.length, 'of which SPINES, the population every corpus figure is pinned on').toBe(856); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 711 -> 715 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 715 -> 718 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 718 -> 724 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 724 -> 729 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 729 -> 733 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 733 -> 766 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (709 -> 792) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (709 -> 800) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (709 -> 852) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (709 -> 857) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 857 -> 856
    expect(modifiers.length, 'and MODIFIERS, none until 8b authors the first').toBe(0);
    const ids = new Set(census.rows.map((r) => `${r.block} :: ${r.pool}`));
    expect(ids.size, 'no (block, pool) is counted twice').toBe(856); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 711 -> 715 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 715 -> 718 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 718 -> 724 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 724 -> 729 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 729 -> 733 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 733 -> 766 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (709 -> 792) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (709 -> 800) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (709 -> 852) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (709 -> 857) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 857 -> 856
    expect(new Set(census.rows.map((r) => r.block)).size, 'over the leaves\' 68 blocks').toBe(69); // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 68 -> 69 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (68 -> 69) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (68 -> 69) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (68 -> 69) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (68 -> 69)
  });

  test('⛔ THE SPINE/MODIFIER PARTITION, PROVED ON A PLANT because the shipped population is all spines', () => {
    // The two arms above read 708 and 0 on this tree, and 0 is a population no assertion can
    // convict anything on: `spineRows` could return its argument unfiltered and every integer
    // in this file would still be green. The partition is therefore proved HERE, on planted
    // rows, so that the day 8b authors the first modifier row the filter is already known to
    // work rather than assumed to. Three planted shapes, because the default matters most:
    // a row with NO role is a spine (every one of the 708), an explicit spine is a spine, and
    // a modifier is neither counted as one nor dropped from the census.
    const planted = /** @type {any[]} */ ([
      { block: 'DS-PLANT', pool: 'no role at all' },
      { block: 'DS-PLANT', pool: 'role: spine', role: 'spine' },
      { block: 'DS-PLANT', pool: 'role: modifier', role: 'modifier' },
      { block: 'DS-PLANT', pool: 'role: turn', role: 'turn' },
    ]);
    expect(spineRows(planted).map((r) => r.pool), 'a modifier is the ONLY row a spine filter drops')
      .toEqual(['no role at all', 'role: spine', 'role: turn']);
    expect(modifierRows(planted).map((r) => r.pool), 'and the complement names it')
      .toEqual(['role: modifier']);
    expect(spineRows(planted).length + modifierRows(planted).length,
      'the two partition the input: nothing is counted twice and nothing is lost')
      .toBe(planted.length);
    // AND THE SHIPPED CORPUS IS THE DEGENERATE CASE OF THAT SAME PARTITION, said out loud so
    // the zero above is read as a state and not as a passing arm.
    expect(spineRows(census.rows).length + modifierRows(census.rows).length).toBe(census.rows.length);
  });

  test('the VARIANT column closes, and reproduces the histogram the owner\'s ruling sizes', () => {
    // ⭐ THE OWNER RULED (2026-09-07 ~21:50) that every semantic variant gets a family of
    // FOUR wordings and nothing is ever trimmed. That makes the variant count per pool a
    // first-class column of this census, because it is what the authoring wave is priced on.
    // 2310 -> 2342, and the histogram with it, by cause (the six leaves, parent -> commit):
    // F12 unit 2 e19e3e4cf +13; census-2b item 5 70d05b25b +4; census-5 unit 2 06b59812f +1;
    // census-3c unit 4 e3295d168 +10; census-5b unit 3 c00b30eb6 +4.
    // 2342 -> 2343 at LANDING-R2 helper G (the chair's §934.105 ruling (1): DS-GEN-17 PROVISIONED v3, the hospital-only line) +1.
    // 2343 -> 2344 at LANDING-R2 helper G2 (the chair's 06:5x DS-CND-1 boom line (ODQ §934.105, ruling (2)): ARCHETYPE: boom v4 `[street · crisis: any]`) +1.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 2344 -> 2363.
    // WIRING W3 second seat (2026-11-07), the owner's style law over DS-POW-1/-2/-5/-6/-7: the #23 tier twins (DS-POW-1 Endorsed v5, Legitimacy Crisis v5) +2 variants: 2363 -> 2365.
    // W3 POW fourth seat (2026-11-08): DS-POW-1 governanceFractured `[newcomer]` v5 (STYLE-AUDIT §2a #24), +1: 2365 -> 2366.
    expect(summary.variants, 'the R1 corpus holds this many variants').toBe(2936); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 2764 -> 2761 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 2348 -> 2356 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 2356 -> 2362 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 2362 -> 2374 // W2 DEF (FIXTURE: gates v3-v4, the referee's frame cure, 2026-11-07): 2374 -> 2376 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 2376 -> 2391 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 2391 -> 2405 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 2405 -> 2504 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 2504 -> 2505 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (2344 -> 2582) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (2344 -> 2604) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants); W4 PEOPLE second seat 2026-11-07: re-measured, DS-STR-1 the style law (+4 departures lines) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (2344 -> 2754) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (2344 -> 2764) // STYLE-2-MERGE at the SW-B5 merge (2026-11-09): SW-B5 FRAMES' vantage variants composed over SW-B2's zero-pool exit (the lane re-keyed this pin from its own base): 2761 -> 2779 // W2-WRITE GEN-9 history events (2026-11-13): 2779 -> 2803 // W2-WRITE GEN-5/GEN-6 the river route on a coast (2026-11-13): 2803 -> 2812 // W2-WRITE GEN-3 readiness and the military score (2026-11-13): 2812 -> 2818 // W2-WRITE FTH-4 heresy without a church (2026-11-13): 2818 -> 2824 // W2-WRITE POW-6 the armed power without a garrison (2026-11-13): 2824 -> 2827 // W2-WRITE ECO-6 off-book trade with no guild (2026-11-13): 2827 -> 2830 // W2-WRITE DEF-3 districts in small places (2026-11-13): 2830 -> 2834 // W2-WRITE POW-5 no law where a watch stands (2026-11-13): 2834 -> 2835 // W2-WRITE ECO-12 faith's weight without a house (2026-11-13): 2835 -> 2838 // W2-WRITE the key-implied words declared (2026-11-13): 2838 -> 2841 // W2-WRITE round 1, the cold list's corpus variants (2026-11-13): 2841 -> 2887 // W2-WRITE stage 2, the first seat's lines read town by town (2026-11-13): 2887 -> 2888 // W2-WRITE stage 3, three lines for every case (layer 2) (2026-11-13): 2888 -> 2908 // W2-WRITE the walls-word mute: a no-walls line (2026-11-13): 2908 -> 2909 // W2-WRITE W2-WRITE-3 DEF-2 STRONG debt (2026-11-13): 2909 -> 2912 // W2-WRITE W2-WRITE-3 stage 3 crisis cases (2026-11-13): 2912 -> 2928 // W2-WRITE W2-WRITE-3 M3 no line and no force beside a watch (2026-11-13): 2928 -> 2932 // W2-WRITE W2-WRITE-3 M1 strong posture under a siege or a war (2026-11-13): 2932 -> 2936
    // THE MEAN IS THE CALLER'S TO FORMAT (INSTR-912 car 11). The census publishes `variants`
    // and `total` as integers; a `toFixed` inside `src/domain/prose/` is a float
    // interpolation and a two-decimal score against the estate's prose-numerics register, and
    // the module has no reader to format for. The arm keeps its full force — the same two
    // decimal places over the same two integers — computed here.
    // 3.26 -> 3.30 with the same five causes; the histogram {2: 31, 3: 528, 4: 111, 5: 22, 6: 12,
    // 7: 4, 10: 1} -> the one below (pools grown 3 -> 4 by twins, 4 -> 5 by F12's calm lines).
    // {2: 29, 3: 507} -> {2: 28, 3: 508} at LANDING-R2 helper G (the chair's §934.105 ruling (1): DS-GEN-17 PROVISIONED v3, the hospital-only line): DS-GEN-17 PROVISIONED grew 2 -> 3; the mean holds.
    // {3: 508, 4: 128} -> {3: 507, 4: 129} and the mean 3.30 -> 3.31 (2,344 / 709 = 3.306) at LANDING-R2 helper G2 (the chair's
    // 06:5x DS-CND-1 boom line, ODQ §934.105 ruling (2)): DS-CND-1 ARCHETYPE: boom grew 3 -> 4.
    // {2: 28, 3: 507} -> {2: 33, 3: 510} and the mean 3.31 -> 3.30 (2,363 / 717 = 3.296) at WIRING W3
    // (2026-11-07): the C1-C6 pools, five of two variants and three of three, in DS-POW-5/-6.
    // {4: 129, 5: 27} -> {4: 127, 5: 29} at WIRING W3's second seat (2026-11-07, the owner's style law over DS-POW-1):
    // the #23 tier twins grow Endorsed and Legitimacy Crisis 4 -> 5; the mean holds (2,365 / 717 = 3.298).
    // {4: 127, 5: 29} -> {4: 126, 5: 30} at W3 POW's fourth seat (2026-11-08): DS-POW-1 governanceFractured grows 4 -> 5
    // (the `[newcomer]` fourth player vantage, STYLE-AUDIT §2a #24); the mean holds (2,366 / 717 = 3.300).
    // {2: 28} -> {2: 30} and the mean 3.31 -> 3.30 (2,348 / 711 = 3.302) at W2 DEF (2026-11-07, C1/C2, ODQ §934.105):
    // DS-DEF-9 gains the two FLAG pools of two variants each.
    expect((summary.variants / summary.total).toFixed(2), 'mean variants per pool').toBe('3.43'); // STYLE-2-MERGE at the SW-B5 merge (2026-11-09): SW-B5 FRAMES' eighteen vantage lines on five frame pools, composed over SW-B2's zero-pool exit: 3.23 -> 3.25 (2779 over 856) // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 2356/715 -> 2362/718 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 2362/718 -> 2374/724 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 3.28 -> 3.27 (2,504 / 766) // MERGE-WAVE at the W2 DEF merge (2026-11-08): measured at the merged tip — 2,582 / 792 = 3.26 // MERGE-WAVE at the W4 PEOPLE merge (2026-11-08): measured at the merged tip — 2,754 / 852 // W2-WRITE GEN-9 history events (2026-11-13): '3.25' -> '3.27' // W2-WRITE GEN-5/GEN-6 the river route on a coast (2026-11-13): '3.27' -> '3.29' // W2-WRITE FTH-4 heresy without a church (2026-11-13): '3.29' -> '3.30' // W2-WRITE ECO-6 off-book trade with no guild (2026-11-13): '3.30' -> '3.31' // W2-WRITE ECO-12 faith's weight without a house (2026-11-13): '3.31' -> '3.32' // W2-WRITE round 1, the cold list's corpus variants (2026-11-13): '3.32' -> '3.37' // W2-WRITE stage 3, three lines for every case (layer 2) (2026-11-13): '3.37' -> '3.40' // W2-WRITE W2-WRITE-3 stage 3 crisis cases (2026-11-13): '3.40' -> '3.42' // W2-WRITE W2-WRITE-3 M3 no line and no force beside a watch (2026-11-13): '3.42' -> '3.43'
    expect(Object.fromEntries(summary.variantHistogram), 'variants per pool, exactly').toEqual({
      // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): 3: 560 -> 559, DS-GEN-11's three-variant zero pool leaves (3e9de356e, B·#28).
      // STYLE-2-MERGE at the SW-B5 merge (2026-11-09): SW-B5 FRAMES' eighteen vantage lines on five frame pools, composed over SW-B2's zero-pool exit: five three-variant frame pools grow (DS-GEN-14 FOUNDED-OLD, DS-POW-2 unclassified, DS-ECO-8 STRUGGLING to 7;
      // DS-GEN-18 BOUGHT-IN, DS-ECO-10 established to 6): 3: 559 -> 554, 6: 14 -> 16, 7: 3 -> 6.
      2: 85, 3: 521, 4: 154, 5: 45, 6: 23, 7: 17, 8: 3, 9: 1, 10: 5, 11: 2, // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): four two-variant FIXTURE pools // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): three two-variant FIXTURE pools, 34 -> 37 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): six two-variant ARCANE pools, 37 -> 43 // FIXTURE: gates 2 -> 4 variants (the referee's frame cure) // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): five three-variant pools, 3: 507 -> 512 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): two three-variant (food) and two four-variant (force) pools // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 3: 514 -> 546 and 4: 132 -> 133 (thirty-two three-variant pools; the INFILTRATION override pool holds four) // MERGE-WAVE at the W2 DEF merge (2026-11-08): measured at the merged tip — W1 ECO's pools (2: 37, 3: 518, 4: 134, 6: 14 on its side) composed with W2 DEF's; sums to 2,582 // MERGE-WAVE at the W3 POW merge (2026-11-08): measured at the merged tip — W3 POW's {2: +5, 3: +3, 4: -3, 5: +3} composed; sums to 2,604 // MERGE-WAVE at the W4 PEOPLE merge (2026-11-08): measured at the merged tip: W4 PEOPLE's pools ({2: 61, 4: 147, 7: 3, 8: 1, 11: 1} on its side) composed; sums to 2,754 // MERGE-WAVE at the W5 HIS merge (2026-11-08): measured at the merged tip: W5 HIS's five two-variant pools (LIVING-MEMORY, LEGACY-*) composed; sums to 2,764 // W2-WRITE GEN-9 history events (2026-11-13): 4: 153 -> 145, 7: 6 -> 14 // W2-WRITE GEN-5/GEN-6 the river route on a coast (2026-11-13): 4: 145 -> 143, 7: 14 -> 15, 10: 1 -> 2 // W2-WRITE GEN-3 readiness and the military score (2026-11-13): 2: 94 -> 93, 3: 554 -> 553, 5: 30 -> 31, 6: 16 -> 17 // W2-WRITE FTH-4 heresy without a church (2026-11-13): 2: 93 -> 91, 5: 31 -> 33 // W2-WRITE POW-6 the armed power without a garrison (2026-11-13): 2: 91 -> 90, 5: 33 -> 34 // W2-WRITE ECO-6 off-book trade with no guild (2026-11-13): 4: 143 -> 142, 7: 15 -> 16 // W2-WRITE DEF-3 districts in small places (2026-11-13): 3: 553 -> 551, 5: 34 -> 36 // W2-WRITE POW-5 no law where a watch stands (2026-11-13): 3: 551 -> 550, 4: 142 -> 143 // W2-WRITE ECO-12 faith's weight without a house (2026-11-13): 2: 90 -> 89, 5: 36 -> 37 // W2-WRITE the key-implied words declared (2026-11-13): 3: 550 -> 549, 6: 17 -> 18 // W2-WRITE round 1, the cold list's corpus variants (2026-11-13): 2: 89 -> 86, 3: 549 -> 535, 4: 143 -> 146, 5: 37 -> 45, 6: 18 -> 21, 7: 16 -> 17, 8: 1 -> 2, 9: 0 -> 1 // W2-WRITE stage 2, the first seat's lines read town by town (2026-11-13): 7: 17 -> 16, 8: 2 -> 3 // W2-WRITE stage 3, three lines for every case (layer 2) (2026-11-13): 2: 86 -> 85, 3: 535 -> 523, 4: 146 -> 155, 5: 45 -> 47, 6: 21 -> 23 // W2-WRITE the walls-word mute: a no-walls line (2026-11-13): 5: 47 -> 46, 6: 23 -> 24 // W2-WRITE W2-WRITE-3 DEF-2 STRONG debt (2026-11-13): 4: 155 -> 154, 7: 16 -> 17 // W2-WRITE W2-WRITE-3 stage 3 crisis cases (2026-11-13): 3: 523 -> 521, 4: 154 -> 155, 5: 46 -> 45, 8: 3 -> 2, 10: 2 -> 4, 11: 1 -> 2 // W2-WRITE W2-WRITE-3 M3 no line and no force beside a watch (2026-11-13): 6: 24 -> 23, 10: 4 -> 5 // W2-WRITE W2-WRITE-3 M1 strong posture under a siege or a war (2026-11-13): 4: 155 -> 154, 8: 2 -> 3
    });
    const summed = summary.variantHistogram.reduce((total, [size, pools]) => total + size * pools, 0);
    expect(summed, 'and the histogram sums back to the corpus').toBe(2936); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 2764 -> 2761 // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 2348 -> 2356 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 2356 -> 2362 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 2362 -> 2374 // W2 DEF (FIXTURE: gates v3-v4, the referee's frame cure, 2026-11-07): 2374 -> 2376 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 2376 -> 2391 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 2391 -> 2405 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 2405 -> 2505 // MERGE-WAVE at the W2 DEF merge (2026-11-08): measured at the merged tip — 2,344 + 77 (W1 ECO) + 161 (W2 DEF), additive // MERGE-WAVE at the W3 POW merge (2026-11-08): 2,582 + 22 (W3 POW), additive (2,604) // MERGE-WAVE at the W4 PEOPLE merge (2026-11-08): 2,604 + 150 (W4 PEOPLE), additive (2,754) // MERGE-WAVE at the W5 HIS merge (2026-11-08): 2,754 + 10 (W5 HIS), additive (2,764) // STYLE-2-MERGE at the SW-B5 merge (2026-11-09): SW-B5 FRAMES' vantage variants composed over SW-B2's zero-pool exit (the lane re-keyed this pin from its own base): 2761 -> 2779 // W2-WRITE GEN-9 history events (2026-11-13): 2779 -> 2803 // W2-WRITE GEN-5/GEN-6 the river route on a coast (2026-11-13): 2803 -> 2812 // W2-WRITE GEN-3 readiness and the military score (2026-11-13): 2812 -> 2818 // W2-WRITE FTH-4 heresy without a church (2026-11-13): 2818 -> 2824 // W2-WRITE POW-6 the armed power without a garrison (2026-11-13): 2824 -> 2827 // W2-WRITE ECO-6 off-book trade with no guild (2026-11-13): 2827 -> 2830 // W2-WRITE DEF-3 districts in small places (2026-11-13): 2830 -> 2834 // W2-WRITE POW-5 no law where a watch stands (2026-11-13): 2834 -> 2835 // W2-WRITE ECO-12 faith's weight without a house (2026-11-13): 2835 -> 2838 // W2-WRITE the key-implied words declared (2026-11-13): 2838 -> 2841 // W2-WRITE round 1, the cold list's corpus variants (2026-11-13): 2841 -> 2887 // W2-WRITE stage 2, the first seat's lines read town by town (2026-11-13): 2887 -> 2888 // W2-WRITE stage 3, three lines for every case (layer 2) (2026-11-13): 2888 -> 2908 // W2-WRITE the walls-word mute: a no-walls line (2026-11-13): 2908 -> 2909 // W2-WRITE W2-WRITE-3 DEF-2 STRONG debt (2026-11-13): 2909 -> 2912 // W2-WRITE W2-WRITE-3 stage 3 crisis cases (2026-11-13): 2912 -> 2928 // W2-WRITE W2-WRITE-3 M3 no line and no force beside a watch (2026-11-13): 2928 -> 2932 // W2-WRITE W2-WRITE-3 M1 strong posture under a siege or a war (2026-11-13): 2932 -> 2936
    // PER PIECE: the same count rolled up to the block, which is the unit a reader meets.
    const perBlockTotal = summary.perBlock.reduce((total, [, n]) => total + n, 0);
    expect(perBlockTotal, 'the per-block roll-up carries every variant once').toBe(2936); // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 2348 -> 2356 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 2356 -> 2362 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 2362 -> 2374 // W2 DEF (FIXTURE: gates v3-v4, the referee's frame cure, 2026-11-07): 2374 -> 2376 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 2376 -> 2391 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 2391 -> 2405 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 2405 -> 2505 // MERGE-WAVE at the W2 DEF merge (2026-11-08): measured at the merged tip — 2,344 + 77 (W1 ECO) + 161 (W2 DEF), additive // MERGE-WAVE at the W3 POW merge (2026-11-08): 2,582 + 22 (W3 POW), additive (2,604) // MERGE-WAVE at the W4 PEOPLE merge (2026-11-08): 2,604 + 150 (W4 PEOPLE), additive (2,754) // MERGE-WAVE at the W5 HIS merge (2026-11-08): 2,754 + 10 (W5 HIS), additive (2,764) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 2764 -> 2761 // STYLE-2-MERGE at the SW-B5 merge (2026-11-09): SW-B5 FRAMES' vantage variants composed over SW-B2's zero-pool exit (the lane re-keyed this pin from its own base): 2761 -> 2779 // W2-WRITE GEN-9 history events (2026-11-13): 2779 -> 2803 // W2-WRITE GEN-5/GEN-6 the river route on a coast (2026-11-13): 2803 -> 2812 // W2-WRITE GEN-3 readiness and the military score (2026-11-13): 2812 -> 2818 // W2-WRITE FTH-4 heresy without a church (2026-11-13): 2818 -> 2824 // W2-WRITE POW-6 the armed power without a garrison (2026-11-13): 2824 -> 2827 // W2-WRITE ECO-6 off-book trade with no guild (2026-11-13): 2827 -> 2830 // W2-WRITE DEF-3 districts in small places (2026-11-13): 2830 -> 2834 // W2-WRITE POW-5 no law where a watch stands (2026-11-13): 2834 -> 2835 // W2-WRITE ECO-12 faith's weight without a house (2026-11-13): 2835 -> 2838 // W2-WRITE the key-implied words declared (2026-11-13): 2838 -> 2841 // W2-WRITE round 1, the cold list's corpus variants (2026-11-13): 2841 -> 2887 // W2-WRITE stage 2, the first seat's lines read town by town (2026-11-13): 2887 -> 2888 // W2-WRITE stage 3, three lines for every case (layer 2) (2026-11-13): 2888 -> 2908 // W2-WRITE the walls-word mute: a no-walls line (2026-11-13): 2908 -> 2909 // W2-WRITE W2-WRITE-3 DEF-2 STRONG debt (2026-11-13): 2909 -> 2912 // W2-WRITE W2-WRITE-3 stage 3 crisis cases (2026-11-13): 2912 -> 2928 // W2-WRITE W2-WRITE-3 M3 no line and no force beside a watch (2026-11-13): 2928 -> 2932 // W2-WRITE W2-WRITE-3 M1 strong posture under a siege or a war (2026-11-13): 2932 -> 2936
    expect(summary.perBlock.length, 'across every block').toBe(69); // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 68 -> 69
  });

  test('ANTI-VACUITY: the corpus census carries BOTH statuses, in measured integers', () => {
    // A census that resolved nothing and a census that resolved everything are both useless
    // and both look healthy from a distance. The arm pins the split.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 341 -> 349.
    expect(summary.resolved, 'pools that reached a recovery RUNG').toBe(488); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 489 -> 488 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 343 -> 347 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 347 -> 350 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 350 -> 356 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 356 -> 361 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 361 -> 365 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 365 -> 398 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (341 -> 425) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (341 -> 433) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (341 -> 485) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (341 -> 489)
    expect(summary.unresolved, 'pools reported WIRING-UNRESOLVED with a reason').toBe(368); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (368 -> 367) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (368 -> 367) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (368 -> 367) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (368 -> 368)
    expect(summary.resolved + summary.unresolved, 'and the two exhaust the census').toBe(summary.total);
    expect(summary.resolved, 'zero resolved rows would mean the reader is dark').toBeGreaterThan(0);
    expect(summary.unresolved, 'zero unresolved rows would mean it is guessing').toBeGreaterThan(0);
    for (const row of census.rows) {
      if (row.status === WIRING_STATUS.UNRESOLVED) expect(row.reason.length, `${row.block} :: ${row.pool} must carry its reason`).toBeGreaterThan(0);
    }
  });

  test('"RESOLVED" IS NOT "RECOVERED": the two narrower integers ship beside it', () => {
    // ⛔ THE FALSE GREEN THIS ARM EXISTS TO FORECLOSE (INSTR-912 car 10, cure 2). At the
    // pre-cure tip the receipt, this file's own assertion message and the wave's tier table
    // all read "RESOLVED 310" as "the selecting predicate was recovered", and 143 of those
    // 310 carried `predicate: []`. `resolved` counts a RUNG REACHED; these two count what was
    // read. Sweep plant #84 makes the pair non-vacuous by execution: the literal rung
    // returning `predicate: []` unconditionally reds these two and leaves the split above
    // green, which is exactly the blindness plant #80 cannot see.
    // 208 AND NOT 207 SINCE LANDING-7 lane F (R-F1): `magicDependencyPoolKey`'s absent pool is
    // returned from an `if (magicAbsent)` now, not a returned ternary, so its guard is recovered.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 208 -> 212.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 208 -> 212.
    expect(summary.resolvedWithPredicate, 'RESOLVED rows carrying at least one predicate row').toBe(317); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 210 -> 214 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 214 -> 217 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 217 -> 223 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 223 -> 227 (four of the five DS-DEF-12 pools carry a predicate row: the last CAPACITY step is the key's fall-through) // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 227 -> 256 (twenty-nine of the thirty-three new pools carry a predicate row) // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (208 -> 268) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (208 -> 272) // W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (208 -> 317)
    expect(summary.resolvedWithCleanPredicate, 'and of those, every row a readable comparison').toBe(317); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 210 -> 214 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 214 -> 217 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 217 -> 223 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 223 -> 227 (four of the five DS-DEF-12 pools carry a predicate row: the last CAPACITY step is the key's fall-through) // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 227 -> 256 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (208 -> 268) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (208 -> 272) // W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (208 -> 317)
    expect(summary.resolvedWithPredicate, 'a rung reached is never fewer than a predicate read')
      .toBeLessThanOrEqual(summary.resolved);
    expect(summary.resolvedWithCleanPredicate).toBeLessThanOrEqual(summary.resolvedWithPredicate);
    // THE RULE ITSELF, driven in both directions on a fixture, so the integers above are not
    // the only thing standing between the estate and a predicate made of source code.
    expect(cleanPredicate([{ field: 'readings.reading.mood', op: '===', value: 'calm' }])).toBe(true);
    expect(cleanPredicate([{ field: 'reading.rungs.length', op: '===', value: '0) return null; if (x' }]),
      'the exact shape the leftmost-`if` reader produced').toBe(false);
    expect(cleanPredicate([]), 'nothing recovered is not clean recovery').toBe(false);
  });
});

describe('the census printed BESIDE the composed-fill census (report-only)', () => {
  test('one table, and the join between them is total', () => {
    const rungs = spines.reduce((m, r) => m.set(r.rung, (m.get(r.rung) || 0) + 1), new Map());
    const unmounted = new Set(UNMOUNTED_BLOCKS);
    const lines = [
      'WIRING CENSUS · beside the composed-fill census · R1 at this tip',
      `  pools ${summary.total} · RESOLVED ${summary.resolved} · WIRING-UNRESOLVED ${summary.unresolved}`,
      `  of the RESOLVED: carrying a predicate row ${summary.resolvedWithPredicate} · every row a readable comparison ${summary.resolvedWithCleanPredicate}`,
      `  variants ${summary.variants} · mean/pool ${(summary.variants / summary.total).toFixed(2)} · histogram ${summary.variantHistogram.map(([k, n]) => `${k}->${n}`).join(' ')}`,
      `  recovery rungs: ${[...rungs].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · ')}`,
      `  key functions ${census.functions} (consulted ${census.consulted}) · module key tables ${census.tables}`,
      '  the ten largest UNRESOLVED reasons:',
      ...summary.reasons.slice(0, 10).map(([reason, n]) => `    ${String(n).padStart(4)}  ${reason}`),
      `  slots with NO provider (the block has a bag): ${summary.slotless.length} pools`,
      ...summary.slotless.slice(0, 8).map((r) => `    ${r.block} :: ${r.pool} — {${r.slots.join('}, {')}}`),
      `  pools whose block has NO bag at all (unmounted): ${summary.bagless.length}`,
      `  predicates over a field no composer holds: ${summary.predicatesOverUnreadFields.length}`
        + ` (the table rung's own synthetic labels, counted apart: ${summary.syntheticTableFields})`,
      ...summary.predicatesOverUnreadFields.slice(0, 6).map((r) => `    ${r.block} :: ${r.pool} — ${r.field}`),
      '  status by block (the twelve with the most unresolved):',
      ...summary.byBlock.slice(0, 12).map(([b, c]) => `    ${b.padEnd(12)} resolved ${String(c.resolved).padStart(3)} · unresolved ${String(c.unresolved).padStart(3)}`),
      '  COMPOSED FILL (the sibling census this one sits beside):',
      `    blocks with a composer bag ${fillByBlock.size} of 68 · call sites ${sites.length}`,
    ];
    for (const line of lines) console.log(line);
    // The join: every census row's block either has a bag or is declared unmounted. A block
    // in neither set would mean the two censuses disagree about what the dossier IS.
    const orphans = spines
      .filter((r) => !fillByBlock.has(r.block) && !unmounted.has(r.block))
      .map((r) => r.block);
    expect([...new Set(orphans)], 'every block has a bag or is declared unmounted').toEqual([]);
    expect(summary.predicateArmExecutable, 'the unread-field arm ran against car 5\'s held facts').toBe(true);
    // ⛔ THE SUPPORTING FIGURES ARE ASSERTED, NOT PRINTED (car 10, cure 5). The lane's own
    // rule was "every count asserted as an integer" and these four were `console.log` — which
    // is to say they could drift under any rebase and the gate would print the drift.
    // 65 -> 64 at W5 HIS second seat, DS-REL-2 (2026-11-08): `flagDriven count > 0` named {band}, which the
    // general desk's bag never fills (its slots are {settlement} alone), so three of its four variants could never
    // print; the rewrite strikes the unfilled slot (the census law: a fact the block does not read is struck).
    // 100 AND NOT 99 SINCE LANDING-7 lane F (R-F1): that recovered guard is over the bare
    // parameter `magicAbsent`, which no composer holds as a field (as `magicDependency` is not).
    expect(summary.slotless.length, 'pools naming a slot the block\'s bag never fills').toBe(69); // MERGE-WAVE at the W5 HIS merge (2026-11-08): W5 HIS's DS-REL-2 strike, -1 (its comment above), additive (69) // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (65 -> 70)
    expect(summary.bagless.length, 'pools in a block with no bag at all').toBe(129); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (140 -> 129)
    expect(summary.predicatesOverUnreadFields.length, 'predicates over a field no composer holds').toBe(108); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (100 -> 108) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (100 -> 108)
    expect(summary.syntheticTableFields, 'and the table rung\'s own labels, counted apart').toBe(174); // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 100 -> 129 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (100 -> 129) // W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (100 -> 174)
  });
});

describe('THE CONTROLS — each must fire, and each cure must stop it firing', () => {
  test('(c1) a pool whose key function has no branch selecting it reads WIRING-UNRESOLVED', () => {
    const pools = poolsFrom([['DS-FIX-1', [
      ['MOOD: calm', SETTLEMENT_ONLY],
      ['MOOD: restive', SETTLEMENT_ONLY],
    ]]]);
    const both = fixtureCensus(COMPOSER_TWO_BRANCHES, pools);
    const one = fixtureCensus(COMPOSER_ONE_BRANCH, pools);
    const statusOf = (result, key) => (result.rows.find((r) => r.pool === key) || {}).status;
    expect(statusOf(both, 'MOOD: restive'), 'with its branch present the pool resolves').toBe(WIRING_STATUS.RESOLVED);
    expect(statusOf(one, 'MOOD: restive'), 'with the branch struck it is UNRESOLVED, never guessed from the name')
      .toBe(WIRING_STATUS.UNRESOLVED);
    // The SIBLING pool must be unmoved, or the control proved only that the census can break.
    expect(statusOf(one, 'MOOD: calm'), 'and its sibling still resolves').toBe(WIRING_STATUS.RESOLVED);
    const restive = one.rows.find((r) => r.pool === 'MOOD: restive');
    expect(restive?.reason, 'the row says WHY').toMatch(/no pool-key function returns this key/);
    expect(restive?.predicate, 'and infers no predicate').toEqual([]);
  });

  test('(c1b) the predicate that IS recovered is the branch\'s own field, op and value', () => {
    const pools = poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]]);
    const row = fixtureCensus(COMPOSER_TWO_BRANCHES, pools).rows[0];
    expect(row.predicate, 'read off the guard, not off the pool name').toEqual([
      { field: 'readings.reading.mood', op: '===', value: 'calm' },
    ]);
    expect(row.keyFunction).toBe('moodPoolKey');
    expect(row.rung).toBe('literal');
    // The re-rooting is what joins this census to car 5's: the parameter is `reading`, the
    // call site supplies `readings.reading`, and the fact is the caller's path.
    expect(rootOf(row.predicate[0].field)).toBe('readings.reading');
  });

  test('(c1b2) FOUR branches before the literal — each recovers ITS OWN guard, not the first', () => {
    // ⛔ THE CONTROL THE ESTATE NEEDED AND DID NOT HAVE (car 10, cure 1). `COMPOSER_TWO_BRANCHES`
    // has ONE `if` before the matched literal, so a guard reader anchored at the LEFTMOST
    // `if (` read the right guard on it and swallowed four statements on the shipped shape.
    const pools = poolsFrom([['DS-FIX-6', [
      ['TIER: a large share off the books', SETTLEMENT_ONLY],
      ['TIER: significant off-book activity', SETTLEMENT_ONLY],
      ['TIER: minor shadow activity', SETTLEMENT_ONLY],
    ]]]);
    const rows = fixtureCensus(COMPOSER_FOUR_BRANCHES, pools).rows;
    const predicateOf = (key) => (rows.find((r) => r.pool === key) || {}).predicate;
    // The ARM the fold names, verbatim: the LAST branch's own field, op and value.
    expect(predicateOf('TIER: minor shadow activity')).toEqual([
      { field: 'safetyProfile.blackMarketCapture', op: '>=', value: '3' },
    ]);
    // AND THE DISCRIMINATION: three branches, three DIFFERENT thresholds. A leftmost reader
    // collapses all three into one blob, so equality across the three is what fails then.
    expect(rows.map((r) => predicateOf(r.pool)[0].value), 'each tier keeps its own threshold')
      .toEqual(['30', '15', '3']);
    expect(rows.every((r) => cleanPredicate(r.predicate)), 'and none is a code fragment').toBe(true);
    // The one-branch control stays beside it, so BOTH shapes are exercised, not one.
    expect(fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]])).rows[0].predicate)
      .toEqual([{ field: 'readings.reading.mood', op: '===', value: 'calm' }]);
  });

  test('(c1d) a fact spoken to by a DEEPER path, or by a guard that did not parse, is not MISSING', () => {
    // Cure 3's arm: the two independent faults that overstated MISSING by 41 %.
    const pools = poolsFrom([['DS-FIX-7', [
      ['POSTURE: net exporter', SETTLEMENT_ONLY],
      ['DRIFT: stalled', SETTLEMENT_ONLY],
    ]]]);
    const rows = fixtureCensus(COMPOSER_DEEP_PATH, pools).rows;
    const posture = rows.find((r) => r.pool === 'POSTURE: net exporter');
    const drift = rows.find((r) => r.pool === 'DRIFT: stalled');
    expect(posture?.predicate, 'the predicate names the DEEPER path').toEqual([
      { field: 'readings.exportPosture.status', op: '===', value: 'net exporter' },
    ]);
    expect(drift?.predicate, 'a regex guard yields no comparison row — correctly').toEqual([]);
    expect(drift?.fieldsRead, 'but the fact it READS is on the row').toContain('readings.flowDrift.label');
    const held = ['readings.exportPosture', 'readings.flowDrift'];
    const missingWith = tierRows({ rows, held }).filter((t) => t.tier === TIERS.MISSING).map((t) => t.subject);
    const missingWithout = tierRows({ rows: [], held }).filter((t) => t.tier === TIERS.MISSING).map((t) => t.subject);
    // PRESENT-THEN-ABSENT, both facts, on the same held list: MISSING when no pool speaks to
    // them, silent when these pools do.
    expectPresentThenAbsent(missingWithout, missingWith, 'readings.exportPosture', 'the deeper-path fact');
    expectPresentThenAbsent(missingWithout, missingWith, 'readings.flowDrift', 'the unparsed-guard fact');
  });

  test('(c1e) a PAIR-ARRAY key table is rung three, and a key it does not name is not', () => {
    const key = 'STABILITY: critical matched';
    const pools = poolsFrom([['DS-FIX-8', [
      [key, SETTLEMENT_ONLY], ['STABILITY: nothing matched', SETTLEMENT_ONLY],
    ]]]);
    const rows = fixtureCensus(COMPOSER_PAIR_TABLE, pools).rows;
    const hit = rows.find((r) => r.pool === key);
    expect(hit?.rung, 'the `[[value, key], …]` shape reaches the table rung').toBe('table');
    expect(hit?.predicate[0].value, 'and the pair\'s own first element is the value').toBe('critical');
    expect(rows.find((r) => r.pool === 'STABILITY: nothing matched')?.status,
      'a key the table does not name gains nothing').toBe(WIRING_STATUS.UNRESOLVED);
    expect(moduleKeyTables(COMPOSER_PAIR_TABLE)[0].shape).toBe('pairs');
    expect(moduleKeyTables(COMPOSER_TABLE)[0].shape, 'and the object shape still reads as itself').toBe('object');
    // PRESENT-THEN-ABSENT on the shape reader: a composer carrying only the OBJECT shape
    // cannot see this key, so the pair reader is what resolved it and not a looser match.
    const objectOnly = fixtureCensus(COMPOSER_TABLE, poolsFrom([['DS-FIX-8', [[key, SETTLEMENT_ONLY]]]])).rows;
    expectPresentThenAbsent(
      objectOnly.filter((r) => r.status === WIRING_STATUS.UNRESOLVED).map((r) => r.pool),
      rows.filter((r) => r.status === WIRING_STATUS.UNRESOLVED).map((r) => r.pool),
      key,
      'the pair-array shape reader',
    );
  });

  test('(c1f) a DOUBLE-quoted key is a key, and its apostrophe eats nothing after it', () => {
    const patron = 'NICHE: the patron\'s niche carries a contestant';
    const keys = [patron, 'NICHE: every niche uncontested', 'NICHE: no ranks were recorded'];
    const spec = poolsFrom([['DS-FIX-9', keys.map((k) => [k, SETTLEMENT_ONLY])]]);
    const withKey = fixtureCensus(COMPOSER_DOUBLE_QUOTED_KEY, spec).rows;
    const struck = fixtureCensus(COMPOSER_DOUBLE_QUOTED_KEY_REMOVED, spec).rows;
    // THE APOSTROPHE HALF: both keys written AFTER the double-quoted one resolve. Under a
    // single-quote regex scanner the apostrophe opened a phantom string and ate both.
    for (const key of keys.slice(1)) {
      expect(withKey.find((r) => r.pool === key)?.status, `${key} survives the apostrophe`).toBe(WIRING_STATUS.RESOLVED);
      expect(struck.find((r) => r.pool === key)?.status, `${key} resolves without it too`).toBe(WIRING_STATUS.RESOLVED);
    }
    // THE DOUBLE-QUOTE HALF, present-then-absent: the key resolves where the composer writes
    // it and is UNRESOLVED where it does not — so the scanner reads a key, not every string.
    expectPresentThenAbsent(
      withKey.filter((r) => r.status === WIRING_STATUS.RESOLVED).map((r) => r.pool),
      struck.filter((r) => r.status === WIRING_STATUS.RESOLVED).map((r) => r.pool),
      patron,
      'the double-quoted key',
    );
    // THE SCANNER ITSELF, driven on all three quote characters at once.
    expect(stringLiterals('const a = "x\'y"; const b = \'z\'; const c = `t`;').map((l) => `${l.kind}:${l.text}`))
      .toEqual(['double:x\'y', 'single:z', 'template:t']);
  });

  test('(c1c) rungs TWO and THREE recover a predicate the literal rung cannot see', () => {
    const template = fixtureCensus(COMPOSER_TEMPLATE, poolsFrom([['DS-FIX-3', [['posture peace', SETTLEMENT_ONLY]]]]));
    expect(template.rows[0].rung, 'a template binds the pool name\'s tail to the field').toBe('template');
    expect(template.rows[0].predicate).toEqual([{ field: 'war.status', op: '===', value: 'peace' }]);
    const table = fixtureCensus(COMPOSER_TABLE, poolsFrom([['DS-FIX-4', [['TERRAIN: Coastal', SETTLEMENT_ONLY]]]]));
    expect(table.rows[0].rung, 'a module-level key table is rung three').toBe('table');
    expect(table.rows[0].predicate[0].value, 'and the map\'s own key is the value').toBe('coastal');
    // A key NEITHER names is unresolved — the two rungs add reach, they do not add guessing.
    const miss = fixtureCensus(COMPOSER_TABLE, poolsFrom([['DS-FIX-4', [['TERRAIN: Marsh', SETTLEMENT_ONLY]]]]));
    expect(miss.rows[0].status).toBe(WIRING_STATUS.UNRESOLVED);
  });

  test('(c2) a variant naming a slot the bag never fills is a FINDING, not a crash', () => {
    const before = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', NAMES_AN_UNFILLED_SLOT]]]]), {
      fill: new Map([['DS-FIX-1', ['settlement']]]),
    });
    const after = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', NAMES_ONLY_FILLED_SLOTS]]]]), {
      fill: new Map([['DS-FIX-1', ['settlement']]]),
    });
    expectPresentThenAbsent(
      before.rows[0].slotsWithoutProvider,
      after.rows[0].slotsWithoutProvider,
      'seat',
      'the unprovided slot',
    );
    expect(before.rows[0].slotsFilled, 'the bag itself is unchanged between the two').toEqual(after.rows[0].slotsFilled);
    expect(censusSummary(before.rows, []).slotless.length, 'and the summary counts the pool once').toBe(1);
    expect(censusSummary(after.rows, []).slotless.length, 'and none once the slot is cured').toBe(0);
  });

  test('(c3) a predicate over a field no composer holds is a finding', () => {
    const pools = poolsFrom([['DS-FIX-5', [['DRIFT: yes', SETTLEMENT_ONLY]]]]);
    const drifted = fixtureCensus(COMPOSER_PREDICATE_OVER_UNREAD, pools);
    expect(drifted.rows[0].predicate, 'the guard IS recovered — the control is about its ROOT, not about reading it')
      .toEqual([{ field: 'ledger.ghostField', op: '===', value: 'yes' }]);
    // With `held` supplied and the root missing from it, the arm names the row. Name the
    // root as held and the same row goes quiet: one fixture, both halves of the pair.
    const named = censusSummary(drifted.rows, ['readings.reading']);
    const licensed = censusSummary(drifted.rows, ['readings.reading', rootOf(drifted.rows[0].predicate[0].field)]);
    const blind = censusSummary(drifted.rows, undefined);
    expect(named.predicateArmExecutable, 'held facts supplied').toBe(true);
    expect(blind.predicateArmExecutable, 'none supplied').toBe(false);
    expect(blind.predicatesOverUnreadFields.length, 'and the blind arm asserts nothing').toBe(0);
    expect(named.predicatesOverUnreadFields.length, 'the drifting predicate is named').toBe(1);
    expect(licensed.predicatesOverUnreadFields.length, 'and named as held it is not').toBe(0);
    // ⛔ AND THE ARM MUST NOT COUNT ITS OWN LABEL (car 10, cure 4). The table rung writes the
    // SAME synthetic string into `predicate[].field` and `fieldsRead`; its `rootOf` is the
    // whole string, so every table row was reported as a predicate over an unheld field BY
    // CONSTRUCTION — 74 of the shipped 158.
    expect(summary.predicatesOverUnreadFields.filter((r) => r.rung === 'table'),
      'no table row is a finding of this arm').toHaveLength(0);
    // NON-BLIND: on a census carrying BOTH a table row and a literal-rung predicate over an
    // unheld field, the literal one IS named. Silence over both would be the vacuous cure.
    const mixed = fixtureCensus(COMPOSER_PAIR_TABLE, poolsFrom([['DS-FIX-8', [['STABILITY: critical matched', SETTLEMENT_ONLY]]]])).rows
      .concat(drifted.rows);
    const both = censusSummary(mixed, ['readings.reading']);
    expect(both.predicatesOverUnreadFields.map((r) => r.rung), 'the literal rung is still named').toEqual(['literal']);
    expect(both.syntheticTableFields, 'and the table rung\'s own labels are counted, never dropped in silence').toBe(1);
  });

  test('(d) the ANTI-VACUITY arm reds on a fixture built to hold both, and can tell them apart', () => {
    const mixed = fixtureCensus(COMPOSER_ONE_BRANCH, poolsFrom([['DS-FIX-1', [
      ['MOOD: calm', SETTLEMENT_ONLY],
      ['MOOD: restive', SETTLEMENT_ONLY],
    ]]]));
    const mixedSummary = censusSummary(mixed.rows, []);
    expect(mixedSummary.resolved, 'the fixture was built to hold one of each').toBe(1);
    expect(mixedSummary.unresolved).toBe(1);
    const allResolved = censusSummary(fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [
      ['MOOD: calm', SETTLEMENT_ONLY], ['MOOD: restive', SETTLEMENT_ONLY],
    ]]])).rows, []);
    expect(allResolved.unresolved, 'a census with nothing unresolved is a DIFFERENT reading').toBe(0);
    const allUnresolved = censusSummary(fixtureCensus('export function nothingPoolKey() { return null; }', poolsFrom([['DS-FIX-1', [
      ['MOOD: calm', SETTLEMENT_ONLY],
    ]]])).rows, []);
    expect(allUnresolved.resolved, 'and one with nothing resolved is a third').toBe(0);
  });

  test('(e) THE FENCE: no src/ file outside the ISLAND names any of its FIFTEEN modules', () => {
    // ⛔ WIDENED FROM ONE MODULE TO TEN (INSTR-912 car 10, cure 10; FOLD-2 hazard H8). The
    // arm fenced `wiringCensus` alone, so a §913 or wave car could wire `entryWalker`,
    // `grammarWalker`, `moveGrammar`, `presenceMeasure`, `plantLedger`, `proseFingerprint`,
    // `entryGround`, `entryLexicons` or `institutionTable` into a product surface and NO GATE
    // WOULD SAY SO. The island is cheapest to fence before the merge, not after.
    const ISLAND = [
      'src/domain/prose/composedWalker.js',
      'src/domain/prose/entryGround.js',
      'src/domain/prose/entryLexicons.js',
      'src/domain/prose/entryWalker.js',
      // ⭐ THE FIFTEENTH, ADDED BY REWRITE car 8a-6. `fieldSynonyms.js` is the RATIFIED TABLE
      // of nouns a field may be named by — the column arm Q, F25 and A0b read. It is fenced
      // because it is an authoring licence: a product surface reaching for it would be a desk
      // deciding at render what a field may be called, which is the census's ruling and not a
      // desk's. It lives out here rather than inside `wiringCensus.js` because that file was
      // over its 800-line ceiling with it, and because ratified data does not belong inside a
      // scanner — the move also stopped the census reading the table's own property names as
      // leaf keys the estate writes.
      'src/domain/prose/fieldSynonyms.js',
      'src/domain/prose/grammarWalker.js',
      // ⭐ THE THIRTEENTH, ADDED BY SEAM CAR 5b. The holder table answers "who keeps the record
      // this fact comes from", which is a question a DM PANEL would very much like to ask at
      // render, and it is the first island module that reads a SETTLEMENT rather than a
      // source string. That makes it the likeliest of the thirteen to be reached for by a
      // product surface, and the fence is cheapest before that happens rather than after.
      'src/domain/prose/holderTable.js',
      'src/domain/prose/moveGrammar.js',
      // ⭐ THE FOURTEENTH, ADDED BY REWRITE car 8a-2. `passageShapes.js` models the fourth
      // seeded draw — which of three arrangements a composed unit takes. It is fenced for the
      // same reason `composedWalker.js` is, only more so: its subject is a PRODUCT shape, and
      // the day the sitting adopts a second shape the composer becomes its caller BY A
      // DECLARED ACT on the SHIFT REGISTER's `passage-shape` row. Until then no product
      // surface may reach it, and this fence is what makes "nothing ships a second shape at
      // car 8a" a measurement rather than a promise.
      'src/domain/prose/passageShapes.js',
      'src/domain/prose/plantLedger.js',
      'src/domain/prose/presenceMeasure.js',
      'src/domain/prose/proseFingerprint.js',
      // ⭐ THE TWELFTH IS `composedWalker.js`, ADDED BY SEAM CAR 5 AND LISTED FIRST ONLY BECAUSE
      // THE ROSTER IS ALPHABETICAL. It walks the COMPOSED unit — a spine, its seated modifiers
      // and their joint — against the facts of all of its pieces at once, so it is the one
      // island module whose subject is a PRODUCT shape. That makes it the likeliest of the
      // twelve to be reached for by a desk wanting "the same check at render", and the fence is
      // cheapest before that happens rather than after: a runtime refusal would change
      // `eligible.length` and move every later index (CLERK-LAWS §2.5 / R-DA-20).
      // THE ELEVENTH, ADDED BY ARCH CAR 0e. The branch reader is a scanner the census module
      // could not hold under its 800-effective-line ceiling, and car 0's refusal 1 named this
      // exact shape as the honest one. It is fenced the moment it lands rather than after.
      'src/domain/prose/wiringBranch.js',
      'src/domain/prose/wiringCensus.js',
      'src/domain/institutions/institutionTable.js',
    ];
    /** @type {Array<[string, string]>} */
    const files = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const abs = join(dir, name);
        if (statSync(abs).isDirectory()) { walk(abs); continue; }
        if (!/\.(js|jsx|ts|tsx)$/.test(name)) continue;
        files.push([relative(ROOT, abs), readFileSync(abs, 'utf8')]);
      }
    };
    walk(join(ROOT, 'src'));
    expect(files.length, 'the scan read the estate\'s src/ tree, not an empty directory').toBeGreaterThan(500);
    const inIsland = (path) => path.startsWith('src/domain/prose/') || path === 'src/domain/institutions/institutionTable.js';
    /** @type {string[]} */
    const breaches = [];
    for (const path of ISLAND) {
      const module = path.split('/').pop().replace(/\.js$/, '');
      const hits = files.filter(([, text]) => text.includes(module)).map(([p]) => p);
      // A CONTROL PER MODULE: the scan must find each one where it lives, or an empty result
      // outside is the walker failing to read rather than the fence holding.
      expect(hits, `the scan finds ${module} where it lives`).toContain(path);
      for (const hit of hits) if (!inIsland(hit)) breaches.push(`${module} <- ${hit}`);
    }
    expect(breaches, 'no product surface reaches the island').toEqual([]);
    // AND THE THIRTEENTH IS REACHED FROM EXACTLY ONE PLACE INSIDE THE ISLAND, which is the
    // paired positive for the module this car lands: the census writes the `source` column
    // through it and nothing else in the estate names it. A fence that held because nothing
    // imports the module at all would pass the loop above and prove nothing.
    const holderHits = files.filter(([, text]) => text.includes('holderTable')).map(([p]) => p);
    expect(holderHits, 'the census IMPORTS it; the composed walker NAMES it in arm A13\'s docblock;'
      + ' and REWRITE car 8a-6\'s synonym table imports HOLDER_KINDS so a kind added to that'
      + ' frozen list gains its record nouns with no edit — all three lawful because every one'
      + ' of them is inside the island')
      .toEqual(['src/domain/prose/composedWalker.js', 'src/domain/prose/fieldSynonyms.js',
        'src/domain/prose/holderTable.js', 'src/domain/prose/wiringCensus.js']);
    // AND THE INSIDE OF THE ISLAND IS STILL ONE GRAPH, not thirteen copies of the same fence:
    // the census names exactly one module of the eleven, so the equality the first cut
    // asserted is kept as the sharpest single case rather than lost inside the loop.
    const censusHits = files.filter(([, text]) => text.includes('wiringCensus')).map(([p]) => p);
    // ⭐ TWO SINCE REWRITE car 8a-6, and the second is a NAMING and not an import:
    // `fieldSynonyms.js` says in its own docblock why it is NOT inside `wiringCensus.js` (that
    // file was over its 800-line ceiling with the table in it, and a scanner is no home for
    // ratified data). Lawful for the same reason arm A13's docblock may name `holderTable`:
    // both files are inside the island. No product surface names it, which the breaches loop
    // above is what proves.
    expect(censusHits).toEqual([
      'src/domain/prose/fieldSynonyms.js', 'src/domain/prose/wiringCensus.js',
    ]);
    // AND THE ELEVENTH IS REACHED FROM EXACTLY ONE PLACE INSIDE THE ISLAND, which is the
    // paired positive: a fence that held because nothing imports the module at all would
    // pass this loop and prove nothing.
    const branchHits = files.filter(([, text]) => text.includes('wiringBranch')).map(([p]) => p);
    // ⭐ THREE SINCE REWRITE car 8a-6: `fieldSynonyms.js` cites `wiringBranch.js` in its
    // docblock as the PRECEDENT for its own existence — car 0 split the branch reader out of
    // the census for the same ceiling reason rather than banking a burn-down row. A citation
    // is a naming, not an import, and both files are inside the island.
    expect(branchHits).toEqual([
      'src/domain/prose/fieldSynonyms.js', 'src/domain/prose/wiringBranch.js',
      'src/domain/prose/wiringCensus.js',
    ]);
    // AND THE TWELFTH IS REACHED FROM EXACTLY ONE PLACE INSIDE THE ISLAND SINCE REWRITE car
    // 8a-2, which is the state this arm was written to notice. It said "a desk that reached
    // for it would move this list", and the list moved — lawfully, to an importer INSIDE the
    // island: `passageShapes.js` takes `contentWords` from the composed walker so the estate
    // has ONE stop list rather than two, and a second copy of that vocabulary is exactly the
    // drift nobody would see (both halves would agree with themselves). The fence is
    // unchanged: no file OUTSIDE the island names it, which the breaches loop above proves.
    const composedHits = files.filter(([, text]) => text.includes('composedWalker')).map(([p]) => p);
    expect(composedHits).toEqual([
      'src/domain/prose/composedWalker.js', 'src/domain/prose/passageShapes.js',
    ]);
    // AND THE FOURTEENTH IS REACHED FROM NOWHERE AT ALL, which is the vacuous-fence shape the
    // composed walker used to hold and now hands on: `passageShapes` names itself and nothing
    // in src/ names it, because the composer is deliberately NOT its caller at car 8a. The day
    // `composeStateProse.js` appears in this list, a second passage shape has shipped and the
    // register's `passage-shape` row owes a declared movement.
    // AND THE FIFTEENTH IS REACHED FROM EXACTLY ONE PLACE INSIDE THE ISLAND (REWRITE car 8a-6):
    // `fieldSynonyms` is named by nothing in `src/` but itself. Its readers are all OUTSIDE
    // `src/` — the census script, the wave gate and the walkers — which is lawful because the
    // fence is about PRODUCT surfaces reaching the island, and a script is not one.
    const synonymHits = files.filter(([, text]) => text.includes('fieldSynonyms')).map(([p]) => p);
    // TWO, AND THE SECOND IS A NAMING: `entryWalker.js`'s `ProseEntry` typedef says where a
    // `vocabulary` comes from, which is what makes arm Q's new column readable rather than
    // magic. Both are inside the island; its READERS — the census script, the wave gate and
    // the walkers — are all outside `src/`, which is lawful because the fence is about PRODUCT
    // surfaces reaching the island and a script is not one.
    expect(synonymHits, 'no product surface decides at render what a field may be called')
      .toEqual(['src/domain/prose/entryWalker.js', 'src/domain/prose/fieldSynonyms.js']);
    const shapeHits = files.filter(([, text]) => text.includes('passageShapes')).map(([p]) => p);
    expect(shapeHits, 'nothing ships a second shape at car 8a, measured rather than promised')
      .toEqual([
        // NAMED in the composed walker's `contentWords` docblock, which is lawful for the same
        // reason arm A13's docblock may name `holderTable`: both files are inside the island.
        'src/domain/prose/composedWalker.js', 'src/domain/prose/passageShapes.js',
      ]);
  });
});

describe('THE MAP READ THE OTHER WAY — fact → text, and the three tiers', () => {
  test('the fact index inverts the census without losing a pool', () => {
    const facts = factIndex(spines);
    // 63 AND NOT 59 SINCE SEAM car 3h: DS-DEF-2's four exposed key tables add four synthetic
    // table labels to the inverse, one per table, and no ordinary reading moved with them.
    // 64 AND NOT 63 SINCE LANDING-7 lane F (R-F1): `magicAbsent`, DS-DEF-9's absent pool's own guard.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 64 -> 68.
    expect(facts.length, 'distinct readings a key function conjoins, at this tip').toBe(102); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 66 -> 70 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 70 -> 73 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 73 -> 81 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 81 -> 83 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 83 -> 85 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (64 -> 95) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (64 -> 99) // W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (64 -> 102)
    const poolsNamed = new Set(facts.flatMap((f) => f.pools));
    const resolvedWithFields = spines.filter((r) => r.predicate.length > 0);
    expect(poolsNamed.size, 'every pool with a recovered predicate appears in the inverse')
      .toBe(resolvedWithFields.length);
    for (const f of facts.slice(0, 12)) {
      console.log(`  FACT ${f.fact.slice(0, 52).padEnd(52)} pools ${String(f.pools.length).padStart(3)} · variants ${String(f.variants).padStart(4)} · grammars ${f.grammars}`);
    }
  });

  test('the tiers name the block, the field, the reading function and the COUNT', () => {
    const tiers = tierRows({ rows: spines, held });
    const counts = tiers.reduce((m, t) => m.set(t.tier, (m.get(t.tier) || 0) + 1), new Map());
    console.log(`  TIERS · MISSING ${counts.get(TIERS.MISSING)} · THIN ${counts.get(TIERS.THIN)} · COVERED ${counts.get(TIERS.COVERED)}`);
    // ⛔ ALL THREE ARE INTEGERS NOW (INSTR-912 car 10, cure 5). MISSING was the only asserted
    // one; `THIN` and `COVERED` were `console.log` while Part B §18 sized the authoring wave
    // from all three, so two of the three could drift silently under the rebase that H6 says
    // must re-measure everything. MISSING fell 58 → 34 when cure 3 taught the membership test
    // to read `fieldsRead` and to normalise with `rootOf`.
    // ⭐ THIN 483 -> 482 AND COVERED 225 -> 226 AT SEAM CAR 5, THEN BACK TO 483 / 225 AT CAR 5c
    // — AND THE ROUND TRIP IS THE HONEST RECORD OF A CLASSIFIER CORRECTED, NOT A FLIP-FLOP.
    // Car 5 taught the classifier the owner's PROVENANCE move (SITTING §Q; MOVE-GRAMMAR
    // §4.4.3) and 18 of the 2,266 shipped variants read as citations, moving 15 pools'
    // `grammars` and carrying ONE pool — the only one whose whole THINness rested on having a
    // single grammar — from THIN to COVERED. The skeptic fold then measured the ground: 11 of
    // those 18 rested on a GENERIC reporting-verb limb naming no holder kind at all (two read
    // "the record has" / "the record holds"), so the majority of the count was not a citation
    // in SITTING §Q.2's sense. Car 5c narrowed the detector to the twelve holder kinds
    // (SITTING §R c-16): 7 citations survive, 9 of the 15 rows return to their pre-car-5
    // `grammars`, the six carrying a real KIND citation stay moved, and the one pool that
    // crossed the tier line crosses back. `grammars` is `new Set(orderIdOf(classifyMoves(text))
    // || the raw sequence)` per pool. The counts are recomputed FRESH from the live modules
    // here, which is why they move with the classifier rather than with the committed JSON.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 34 -> 33.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 482 -> 486.
    // WIRING W3 second seat (2026-11-07), the owner's style law over DS-POW-1/-2/-5/-6/-7: two power pools leave THIN at the rewrite (measured): 486 -> 484.
    // 484 -> 483 at the car rows of WIRING W3 (2026-11-08, the owner's style law over DS-POW-3 and DS-POW-4, after the people car) (measured).
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 227 -> 231.
    // WIRING W3 second seat (2026-11-07), the owner's style law over DS-POW-1/-2/-5/-6/-7: the same two pools land COVERED: 231 -> 233.
    // 233 -> 234 at the same cause.
    // 485 -> 484 at W5 HIS's style pass (2026-11-07): one pool's variants no longer share one grammar.
    expect(counts.get(TIERS.MISSING), 'held facts with no pool keyed on them').toBe(33); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 33 -> 32 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (34 -> 33) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (34 -> 32) // MERGE-WAVE at the W3 POW merge (2026-11-08): measured at the merged tip — 33, one above the arithmetic 32 (W1+W2 34 -> 33, W3 34 -> 33): both sides keyed the same held fact, so it leaves the MISSING tier once // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (34 -> 33) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (34 -> 33)
    expect(counts.get(TIERS.THIN), 'pools with one variant, one grammar, or {settlement} alone').toBe(613); // STYLE-2-MERGE at the SW-7 POWER-SIDE merge (2026-11-09): 616 -> 615, measured at the merged tree (DS-POW-4/5/6 style rows) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 617 -> 616 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 484 -> 488 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 488 -> 491 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 491 -> 497 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 497 -> 502 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 502 -> 506 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 506 -> 539 // W2 DEF fourth seat (DS-DEF-7 style rows, 2026-11-07): 539 -> 540 (DS-DEF-7's plain rewrites share one move order across a pool) // W2 DEF fourth seat (DS-DEF-10 style rows, 2026-11-07): 540 -> 541 // W2 DEF fourth seat (DS-WAR-1 style rows, 2026-11-07): 541 -> 542 // W2 DEF fourth seat (DS-WAR-2 style rows, 2026-11-07): 542 -> 541 // W2 DEF fourth seat (DS-WAR-5 style rows, 2026-11-07): 541 -> 540 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (482 -> 559) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (482 -> 560) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (482 -> 615) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (482 -> 617) // W2-WRITE POW-6 the armed power without a garrison (2026-11-13): 615 -> 614 // W2-WRITE W2-WRITE-3 stage 3 crisis cases (2026-11-13): 614 -> 613
    expect(counts.get(TIERS.COVERED), 'and the rest').toBe(243); // STYLE-2-MERGE at the SW-7 POWER-SIDE merge (2026-11-09): 240 -> 241, measured at the merged tree (DS-POW-4/5/6 style rows) // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF fourth seat (DS-DEF-7 style rows, 2026-11-07): 227 -> 226 (the one pool that moved to THIN) // W2 DEF fourth seat (DS-DEF-10 style rows, 2026-11-07): 226 -> 225 // W2 DEF fourth seat (DS-WAR-1 style rows, 2026-11-07): 225 -> 224 // W2 DEF fourth seat (DS-WAR-2 style rows, 2026-11-07): 224 -> 225 // W2 DEF fourth seat (DS-WAR-5 style rows, 2026-11-07): 225 -> 226 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (227 -> 233) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (227 -> 240) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (227 -> 237) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (227 -> 240) // W2-WRITE POW-6 the armed power without a garrison (2026-11-13): 241 -> 242 // W2-WRITE W2-WRITE-3 stage 3 crisis cases (2026-11-13): 242 -> 243
    expect(counts.get(TIERS.THIN) + counts.get(TIERS.COVERED), 'every pool lands in one of the two pool tiers')
      .toBe(spines.length);
    for (const row of tiers) {
      expect(row.count.length, `${row.tier} ${row.subject} must carry its measurement`).toBeGreaterThan(0);
      expect(typeof row.readingFunction, 'and name the reading function').toBe('string');
    }
    for (const row of tiers.filter((t) => t.tier === TIERS.MISSING).slice(0, 8)) {
      console.log(`    MISSING ${row.subject} — ${row.count}`);
    }
  });

  test('THIN fires on each of its three limbs, and COVERED on none of them', () => {
    const thinOf = (variants) => {
      const rows = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', variants]]]]), {
        fill: new Map([['DS-FIX-1', ['settlement', 'seat']]]),
      }).rows;
      return tierRows({ rows, held: [] }).find((t) => t.subject === 'MOOD: calm');
    };
    // limb 1 — ONE variant.
    expect(thinOf([SETTLEMENT_ONLY[0]])?.tier, 'a pool of one').toBe(TIERS.THIN);
    // limb 3 — a slot set of {settlement} alone (the S12 finding: twenty of sixty-eight
    // blocks carry only {settlement}).
    expect(thinOf(SETTLEMENT_ONLY)?.tier, 'settlement-only slots').toBe(TIERS.THIN);
    // COVERED — two variants, two grammars, a slot beyond {settlement}.
    const covered = thinOf([
      { text: 'The {seat} at {settlement} keeps the rolls, and has since the founding.', slots: ['seat', 'settlement'] },
      { text: 'Where the rolls are kept at {settlement} is the {seat}.', slots: ['seat', 'settlement'] },
    ]);
    expect(covered?.tier, 'a pool with a second slot and a second grammar').toBe(TIERS.COVERED);
    expect(covered?.count, 'and its count is the measurement, not a verdict').toMatch(/variant\(s\)/);
  });

  test('CO-OCCURRENCE has no floor of its own, and refuses to invent one', () => {
    const rows = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]])).rows
      .concat(fixtureCensus(COMPOSER_TABLE, poolsFrom([['DS-FIX-2', [['TERRAIN: Coastal', SETTLEMENT_ONLY]]]])).rows);
    const firings = firingsCoFiring(200);
    const blind = coOccurringPairs({ firings, rows });
    expect(blind.pairs, 'with no floor the measure answers nothing').toEqual([]);
    expect(blind.notExecutable.length, 'and says so rather than reading as a clean bill').toBe(1);
    const measured = coOccurringPairs({ firings, rows, minTowns: 100 });
    expect(measured.towns).toBe(200);
    expect(measured.pairs.length, 'the two facts co-fire on every town and no pool keys both').toBe(1);
    expect(measured.pairs[0].towns).toBe(200);
    // The PAIRED NEGATIVE: a floor above the sample must silence it, or the arm is reporting
    // every pair it can see rather than the pairs that meet the floor.
    expect(coOccurringPairs({ firings, rows, minTowns: 201 }).pairs.length, 'a floor above the sample silences it').toBe(0);
    // And a pair a pool IS keyed on must never be reported. One row keyed on BOTH facts.
    const keyedOnBoth = rows.concat([{
      ...rows[0],
      block: 'DS-FIX-9',
      pool: 'BOTH',
      predicate: [...rows[0].predicate, ...rows[1].predicate],
    }]);
    expect(coOccurringPairs({ firings, rows: keyedOnBoth, minTowns: 100 }).pairs.length,
      'a pair some pool already conjoins is not MISSING').toBe(0);
  });
});

describe('THE CENSUS AS THE WALKERS\' SOURCE OF TRUTH', () => {
  const entry = {
    id: 'fix#0',
    text: 'The {seat} at {settlement} keeps the rolls.',
    block: 'DS-FIX-1',
    pool: 'MOOD: calm',
    slots: ['seat', 'settlement'],
  };

  test('the GRAMMAR walker\'s arm D changes its verdict when the census is passed', () => {
    const corpus = [entry];
    const composedFill = new Map([['DS-FIX-1', ['seat', 'settlement']]]);
    const withoutCensus = walkGrammar({ corpus, composedFill, register: 'fixture' });
    const resolved = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]]), {
      fill: new Map([['DS-FIX-1', ['settlement']]]),
    }).rows;
    const withCensus = walkGrammar({
      corpus, composedFill, register: 'fixture', wiring: censusIndex(resolved),
    });
    const armD = (r, channel) => r[channel].filter((f) => String(f.arm).startsWith('D'));
    expect(armD(withoutCensus, 'withheld').length, 'without a census the block-wide bag licenses {seat}').toBe(0);
    expect(armD(withCensus, 'withheld').length, 'with it, THIS pool\'s wiring does not, and the claim is banked').toBe(1);
    expect(armD(withCensus, 'withheld')[0].detail, 'as PRE-EXISTING, never as a rewrite failure')
      .toMatch(/PRE-EXISTING unlicensed/);
    expect(armD(withCensus, 'fails').length, 'and nothing green went red by the wiring alone').toBe(0);
    // An UNRESOLVED row must make the arm NOT-EXECUTABLE rather than pass.
    const unresolved = fixtureCensus(COMPOSER_ONE_BRANCH, poolsFrom([['DS-FIX-1', [['MOOD: restive', SETTLEMENT_ONLY]]]])).rows
      .map((r) => ({ ...r, pool: 'MOOD: calm' }));
    const blind = walkGrammar({
      corpus, composedFill, register: 'fixture', wiring: censusIndex(unresolved),
    });
    expect(blind.notExecutable.some((f) => f.arm === 'D/wiring'), 'an unrecovered predicate is not a pass').toBe(true);
  });

  test('the ENTRY walker\'s C-PAIR calls an inherited claim PRE-EXISTING and a new one a failure', () => {
    const ground = { scope: 'estate', columns: { whoIsCounted: { closed: false, values: [] } } };
    const before = { id: 'b', text: 'The watch at {settlement} keeps the gate.', slots: ['settlement'] };
    const after = { id: 'a', text: 'The watch at {settlement} keeps the gate, and every household is counted.', slots: ['settlement'] };
    const added = walkPair(before, after, ground);
    expect(added.added.length, 'the AFTER buys a totality over an open column').toBe(1);
    expect(added.preExisting.length, 'and inherits none').toBe(0);
    // The same fault present in BOTH halves is debt, never a rewrite failure.
    const inherited = walkPair(after, after, ground);
    expect(inherited.added.length, 'a fault the BEFORE already carried is not added').toBe(0);
    expect(inherited.preExisting.length, 'it is banked').toBe(1);
    expect(inherited.preExisting[0].arm, 'and labelled').toMatch(/^PRE-EXISTING · /);
    expect(walkPair(after, before, ground).cured.length, 'and a rewrite that removes it is credited').toBe(1);
  });

  test('the ENTRY walker\'s wiring arm is silent without a census and speaks with one', () => {
    const bare = walkEntry(entry, { scope: 'estate', columns: {} });
    const row = fixtureCensus(COMPOSER_TWO_BRANCHES, poolsFrom([['DS-FIX-1', [['MOOD: calm', SETTLEMENT_ONLY]]]]), {
      fill: new Map([['DS-FIX-1', ['settlement']]]),
    }).rows[0];
    const wired = walkEntry(entry, { scope: 'estate', columns: {}, wiring: row });
    const armW = (r, channel) => r[channel].filter((f) => f.klass === 'W');
    expect(armW(bare, 'withheld').length, 'no census, no wiring finding — the pre-car-8 behaviour').toBe(0);
    expect(armW(wired, 'withheld').length, 'with the census the unlicensed slot is banked').toBe(1);
    expect(armW(wired, 'withheld')[0].arm).toBe('PRE-EXISTING unlicensed');
    expect(wired.fails.length, 'and the wiring never fails an entry').toBe(bare.fails.length);
    const unresolvedRow = { status: WIRING_STATUS.UNRESOLVED, reason: 'no branch selects it', slotsFilled: [] };
    const blind = walkEntry(entry, { scope: 'estate', columns: {}, wiring: unresolvedRow });
    expect(armW(blind, 'notExecutable').length, 'an unrecovered predicate reports, never passes').toBe(1);
  });

  test('C-SIBLING will not call a disagreement a contradiction on an unrecovered pool', () => {
    const conflicting = [
      { id: 'p#0', text: 'A few souls hold the fields at {settlement}.', block: 'DS-FIX-1', pool: 'MOOD: calm', slots: ['settlement'] },
      { id: 'p#1', text: 'Thousands of souls hold the fields at {settlement}.', block: 'DS-FIX-1', pool: 'MOOD: calm', slots: ['settlement'] },
    ];
    const cells = new Map([['DS-FIX-1 :: MOOD: calm', conflicting]]);
    const plain = walkGrammar({ corpus: conflicting, cells, register: 'fixture' });
    expect(plain.fails.filter((f) => f.arm === 'C-sibling').length, 'without a census the arm fails as before').toBe(1);
    const unresolved = [{
      block: 'DS-FIX-1', pool: 'MOOD: calm', status: WIRING_STATUS.UNRESOLVED, reason: 'no branch selects it',
    }];
    const gated = walkGrammar({
      corpus: conflicting, cells, register: 'fixture', wiring: censusIndex(unresolved),
    });
    expect(gated.fails.filter((f) => f.arm === 'C-sibling').length, 'with an unrecovered predicate the premise is unestablished').toBe(0);
    expect(gated.notExecutable.some((f) => f.arm === 'C-sibling/wiring'), 'and the arm says so').toBe(true);
  });
});

describe('the source readers themselves', () => {
  test('the pool-key reader finds every key function in the six composers', () => {
    let total = 0;
    for (const [file, src] of composerSources()) total += poolKeyFunctions(src, file).length;
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 118 -> 120.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 118 -> 120.
    expect(total, 'pool-key functions across the six desks').toBe(151); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 119 -> 120 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 120 -> 123 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 123 -> 124 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 124 -> 125 (isolationSupportPoolKey) // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 125 -> 127 (defenceSupplyPoolKey, foodTradesPoolKey) // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 127 -> 128 (compoundSafetyPoolKey) // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (118 -> 141) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (118 -> 143) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (118 -> 150) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (118 -> 151)
    expect(census.functions, 'and the census reads the same set').toBe(151); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 119 -> 120 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 120 -> 123 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 123 -> 124 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 124 -> 125 (isolationSupportPoolKey) // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 125 -> 127 (defenceSupplyPoolKey, foodTradesPoolKey) // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 127 -> 128 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (118 -> 141) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (118 -> 143) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (118 -> 150) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (118 -> 151)
    // ⛔ FOUND IS NOT CONSULTED (INSTR-912 car 10, cure 8). The ladder's map was keyed on the
    // BARE function name, and two desks both export `foodSecurityPoolKey`
    // (`economyStateProse.js:393`, `generalStateProse.js:353`) — so 118 collapsed to 117 while
    // this line asserted `fns.length` and read healthy. The key is `file::name` now and the
    // two counts are asserted EQUAL, so the next same-named pair cannot go quiet.
    expect(census.consulted, 'and the ladder actually walks every one of them').toBe(census.functions);
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 118 -> 120.
    expect(census.consulted, 'as an integer, not only as an equality').toBe(151); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 119 -> 120 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 120 -> 123 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 123 -> 124 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 124 -> 125 (isolationSupportPoolKey) // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 125 -> 127 (defenceSupplyPoolKey, foodTradesPoolKey) // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 127 -> 128 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (118 -> 141) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (118 -> 143) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (118 -> 150) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (118 -> 151)
    expect(census.tables, 'module-level key tables (object shape and pair-array shape)').toBe(39); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 33 -> 35 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (33 -> 36) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (33 -> 36) // W4 PEOPLE second seat 2026-11-07: +3, DS-CND-1's three crisis-keyed direction maps (CRISIS_WORSENING_POOL_OF, CRISIS_STABLE_POOL_OF, CRISIS_EASING_POOL_OF) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (33 -> 39) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (33 -> 39)
  });

  test('a reader that went dark would report zero, so both readers are pinned against a fixture', () => {
    expect(poolKeyFunctions(COMPOSER_TWO_BRANCHES, 'fixture').length).toBe(1);
    expect(poolKeyFunctions('export function notAKey() { return 1; }', 'fixture').length).toBe(0);
    expect(moduleKeyTables(COMPOSER_TABLE).length).toBe(1);
    expect(moduleKeyTables(COMPOSER_TEMPLATE).length, 'a composer with no table has none').toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════════
// ARCH CAR 0 — THE COLUMNS THE COMPOSED-PROSE WAVE IS SIZED FROM
//
// Every arm below carries a fixture or a plant that MUST fire and a paired cure that MUST
// silence it. A census column is the easiest thing in the estate to make vacuous: answer
// `{}`, answer 0, answer "measured" for everything, and read healthy from a distance.
// ═══════════════════════════════════════════════════════════════════════════════════

/** The committed census, built once: the same call `scripts/wiring-census.mjs` makes. */
const committed = await buildCensus({ rates: JSON.parse(readFileSync(CENSUS_JSON, 'utf8')).rate });
/**
 * ⭐ THE COMMITTED REGISTER'S SPINE ROWS (TASTE car M-2). Same rule as `spines` above: every
 * figure this register publishes is measured over the spines, so an arm that re-derives one
 * from `committed.rows` must re-derive it over the same population or it is checking the
 * register against a corpus the register never counted.
 */
const committedSpines = spineRows(committed.rows);

describe('car 0 — `reads`, and the NARROWS line that may narrow it', () => {
  test('reads = the SELECTING BRANCH\'s tests where one was recovered, function-wide where none was', () => {
    // ⭐ THE RULING (SITTING §O.1, ARCH §4.4, E-F2, T-F7). `tests` is every field the
    // SELECTING BRANCH evaluates. Car 8 implemented the KEY FUNCTION's whole reading set, so
    // two branches of one ladder shared one read set; the sitting re-cut the grain and asked
    // for the cost to be measured. Both grains ship on every row: `reads` carries the branch
    // where the reader recovered one, `fieldsRead` stays the function-wide union.
    // ⛔ 708 AND NOT THE TASTE'S 715 (REWRITE car 8a-3): this tree lands the taste's
    // INSTRUMENTS and none of its seven annex rows, so every row of the committed register is
    // still a spine and the two integers coincide. They are asserted apart anyway, because the
    // day they diverge is the day a modifier row is born and this line must move deliberately.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 709 -> 717.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 709 -> 717.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 311 -> 319.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 709 -> 717.
    expect(committed.rows.length, 'the census still covers every pool').toBe(856); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 857 -> 856 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 711 -> 715 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 715 -> 718 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 718 -> 724 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 724 -> 729 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 729 -> 733 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 733 -> 766 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (709 -> 792) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (709 -> 800) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (709 -> 852) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (709 -> 857)
    expect(committedSpines.length, 'of which SPINES, the population the totals count').toBe(856); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 711 -> 715 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 715 -> 718 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 718 -> 724 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 724 -> 729 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 729 -> 733 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 733 -> 766 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (709 -> 792) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (709 -> 800) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (709 -> 852) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (709 -> 857) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 857 -> 856
    expect(committed.totals.branchGrainRows, 'rows whose selecting branch was recovered').toBe(455); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 313 -> 317 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 317 -> 320 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 320 -> 326 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 326 -> 331 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 331 -> 335 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 335 -> 369 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (311 -> 392) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (311 -> 400) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (311 -> 452) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (311 -> 456) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 456 -> 455
    expect(committed.totals.functionGrainRows, 'and rows that fall back, fail-closed').toBe(401); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 398 -> 397 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (398 -> 400) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (398 -> 400) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (398 -> 400) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (398 -> 401)
    expect(committed.totals.branchGrainRows + committed.totals.functionGrainRows).toBe(856); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 711 -> 715 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 715 -> 718 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 718 -> 724 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 724 -> 729 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 729 -> 733 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 733 -> 766 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (709 -> 792) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (709 -> 800) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (709 -> 852) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (709 -> 857) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 857 -> 856
    for (const row of committed.rows) {
      expect(['branch', 'function'], `${row.pool} names its grain`).toContain(row.readsGrain);
      if (row.readsGrain === 'branch') expect(row.reads, `${row.pool}`).toEqual(row.branchReads);
      else expect(row.reads, `${row.pool} falls back to the whole function`).toEqual(row.fieldsRead);
    }
    // ⛔ THE FAIL-CLOSED HALF, AND IT IS THE ONE THAT COULD ROT. A row whose branch reader
    // recovered NOTHING must not read as a branch that evaluates nothing: that answers k = 3,
    // three free modifier seats on a pool nobody recovered, which is the §908 law's own
    // forbidden answer. Every function-grain row carries an EMPTY branch set and takes the
    // whole function's readings.
    const fellBack = committed.rows.filter((r) => r.readsGrain === 'function');
    expect(fellBack.every((r) => r.branchReads.length === 0), 'and it falls back only where nothing was read').toBe(true);
    const drift = committed.rows.filter((r) => r.reads.join('|') !== r.branchReads.join('|')
      && r.reads.join('|') !== r.fieldsRead.join('|'));
    expect(drift, 'no shipped row narrows its reads today').toEqual([]);
    expect(committed.totals.narrowedRows, 'and the narrowed count is an integer, not an impression').toBe(0);
    expect(committed.totals.narrowsRefused).toBe(0);
  });

  test('⭐ THE BRANCH IS READ STRUCTURALLY: an enclosing guard, a sibling that EXITS, and never a sibling BLOCK\'s insides', () => {
    // The fixture IS the shipped ladder (`defenseStateProse.js:747`), because the grain has
    // three shapes to get right and only the whole ladder carries all three at once.
    const pools = poolsFrom([['DS-FIX-13', [
      ['WALLED-STRAINED', SETTLEMENT_ONLY], ['WALLED-QUIET', SETTLEMENT_ONLY],
      ['WALLED-THREATENED', SETTLEMENT_ONLY], ['UNWALLED-SMALL', SETTLEMENT_ONLY],
      ['UNWALLED-LARGE', SETTLEMENT_ONLY],
    ]]]);
    const rows = fixtureCensus(COMPOSER_BRANCH_GRAIN, pools).rows;
    const readsOf = (pool) => (rows.find((r) => r.pool === pool) || {}).reads;
    expect(readsOf('WALLED-STRAINED'), 'the enclosing guard and the branch\'s own')
      .toEqual(['settlement.militaryGate', 'settlement.walls']);
    expect(readsOf('WALLED-QUIET'), 'plus the gate BY EXCLUSION and the family (ARCH §6.3)')
      .toEqual(['settlement.militaryGate', 'settlement.monsterThreat', 'settlement.walls']);
    expect(readsOf('WALLED-THREATENED')).toEqual(readsOf('WALLED-QUIET'));
    // ⛔ THE THIRD SHAPE, AND THE ONE A BACKWARDS SCAN FAILS: the UNWALLED literals sit AFTER
    // the walled block, so the guards INSIDE that block are NOT on their path.
    expect(readsOf('UNWALLED-SMALL'), 'never the gate and never the family')
      .toEqual(['settlement.tier', 'settlement.walls']);
    expect(readsOf('UNWALLED-LARGE')).toEqual(readsOf('UNWALLED-SMALL'));
    // THE PAIRED NEGATIVE — the same ladder flattened, where every branch tests everything.
    const flat = fixtureCensus(COMPOSER_BRANCH_FLAT, pools).rows.filter((r) => r.status === WIRING_STATUS.RESOLVED);
    expect(new Set(flat.map((r) => r.reads.join('|'))).size, 'the flat ladder collapses to ONE read set').toBe(1);
    expect(new Set(rows.map((r) => r.reads.join('|'))).size, 'and the shipped ladder to three').toBe(3);
    // AND THE CONSEQUENCE THE WAVE IS SIZED FROM: the ladder composes, the flat one cannot.
    expect(attachSets(rows)[0].spinesReachedBp, 'every spine of the ladder can carry a modifier').toBe(10000);
    expect(attachSets(flat)[0].spinesReachedBp, 'and none of the flat one can').toBe(0);
  });

  test('the SHIPPED DS-DEF-11 rows carry ARCH §6.3\'s own worked reading, to the field', () => {
    // ⭐ NOT A RESTATEMENT OF THE FIXTURE. ARCH §6.3 published DS-DEF-11's `tests` before this
    // reader existed — "STRAINED {walls, gate}; THREATENED and QUIET {walls, gate (by
    // exclusion), family}; UNWALLED-* {walls, tier}" — so the shipped rows reproducing it is
    // an independent check on the scanner, not the scanner checking itself.
    const readsOf = (pool) => (committed.rows.find(
      (r) => r.block === 'DS-DEF-11' && r.pool === pool,
    ) || {}).reads;
    const WALLS = 'forces.walls.present';
    const GATE = 'settlement.defenseProfile.economicGates.military';
    const FAMILY = 'settlement.config.monsterThreat';
    expect(readsOf('WALLED-STRAINED')).toEqual([WALLS, GATE]);
    expect(readsOf('WALLED-THREATENED')).toEqual([WALLS, FAMILY, GATE]);
    expect(readsOf('WALLED-QUIET')).toEqual([WALLS, FAMILY, GATE]);
    expect(readsOf('UNWALLED-SMALL')).toEqual([WALLS, 'settlement.tier']);
    expect(readsOf('UNWALLED-LARGE')).toEqual([WALLS, 'settlement.tier']);
    // AND THE BUDGET §6.3 PREDICTS FROM THEM: STRAINED and UNWALLED-* leave a seat, the two
    // three-field spines leave none unless the chair rules NARROWS on the gate.
    const kOf = (pool) => (committed.rows.find((r) => r.block === 'DS-DEF-11' && r.pool === pool) || {}).k;
    expect([kOf('WALLED-STRAINED'), kOf('UNWALLED-SMALL'), kOf('UNWALLED-LARGE')]).toEqual([1, 1, 1]);
    expect([kOf('WALLED-QUIET'), kOf('WALLED-THREATENED')]).toEqual([0, 0]);
  });

  test('a NARROWS line without a chair ruling id is REFUSED, and one with it narrows', () => {
    const row = {
      block: 'DS-FIX-1', pool: 'MOOD: calm', fieldsRead: ['readings.reading.mood', 'readings.reading.tier'],
    };
    const naked = narrowedReads(row, new Map([['DS-FIX-1 :: MOOD: calm', { fields: ['readings.reading.mood'] }]]));
    expect(naked.narrowed, 'a narrowing nobody ruled is not a narrowing').toBe(false);
    expect(naked.reads, 'and the reads stay at the recovered tests').toEqual(row.fieldsRead);
    expect(naked.refusal).toMatch(/no chair ruling id/);
    const ruled = narrowedReads(row, new Map([['DS-FIX-1 :: MOOD: calm', {
      fields: ['readings.reading.mood'], ruling: 'S-912-NARROWS-1', quote: 'the text claims the mood and never the tier',
    }]]));
    expect(ruled.narrowed, 'a ruled narrowing narrows').toBe(true);
    expect(ruled.reads).toEqual(['readings.reading.mood']);
    expect(ruled.refusal).toBe('');
    // AND THE SECOND REFUSAL: a ruling may not invent a field the branch does not test.
    const invented = narrowedReads(row, new Map([['DS-FIX-1 :: MOOD: calm', {
      fields: ['readings.reading.walls'], ruling: 'S-912-NARROWS-2', quote: 'x',
    }]]));
    expect(invented.narrowed).toBe(false);
    expect(invented.refusal).toMatch(/which the branch does not test/);
  });
});

describe('car 0 — `absent`: a measurement, or a default wearing a reading\'s clothes', () => {
  test('a read that supplies its own fallback is `default`; the guarded sibling is `measured`', () => {
    const pools = poolsFrom([['DS-FIX-10', [
      ['THREAT: embattled', SETTLEMENT_ONLY], ['GATE: underfunded', SETTLEMENT_ONLY],
    ]]]);
    const defaulting = fixtureCensus(COMPOSER_DEFAULTING_READ, pools).rows;
    const guarded = fixtureCensus(COMPOSER_DEFAULTING_READ_GUARDED, pools).rows;
    const labelOf = (rows, pool, needle) => {
      const row = rows.find((r) => r.pool === pool);
      const key = Object.keys(row.absent).find((f) => f.endsWith(needle));
      return row.absent[key];
    };
    // PRESENT-THEN-ABSENT on the one field, with the composer's ONLY change being the `||`.
    expect(labelOf(defaulting, 'THREAT: embattled', 'monsterThreat'), 'the fallback hides the absence').toBe('default');
    expect(labelOf(guarded, 'THREAT: embattled', 'monsterThreat'), 'and struck, the absence is visible').toBe('measured');
    // The gate read is the estate's own shape: ABSENT rather than 1.0 when no paid stack
    // exists, and guarded by `typeof === 'number' && Number.isFinite` before `< 1`.
    expect(labelOf(defaulting, 'GATE: underfunded', 'military'), 'a guarded read is a measurement').toBe('measured');
    // THE RULE ITSELF, driven in all three directions on strings, so the corpus integers
    // are not the only thing standing behind the column.
    expect(absenceOf('config.monsterThreat', "const t = config.monsterThreat || 'frontier';", null)).toBe('default');
    expect(absenceOf('config.monsterThreat', 'if (config.monsterThreat === \'plagued\') return 1;', new Set(['monsterThreat']))).toBe('measured');
    expect(absenceOf('ledger.ghostField', 'if (ledger.ghostField) return 1;', new Set(['other'])), 'no writer produces it').toBe('not-produced');
    // AND THE LONGEST-SUFFIX RULE: one `present ||` must not label every `*.present` path.
    const body = 'const a = forces.walls.present || false; if (forces.charter.present) return 1;';
    expect(absenceOf('forces.walls.present', body, new Set(['present']))).toBe('default');
    expect(absenceOf('forces.charter.present', body, new Set(['present'])), 'the sibling path is unmoved').toBe('measured');
  });

  test('the corpus\'s own absence distribution is an integer, and the table rung is counted apart', () => {
    const totals = committed.totals.absent;
    // ⚠ THE THREE MOVED WITH THE GRAIN (car 0e). `absent` is keyed on `reads`, so the branch
    // grain shrinks the read paths from 757 to 529 and the distribution with them; nothing
    // about a path's absence semantics changed, only how many paths a pool is entitled to.
    // ⭐ RE-BASED 2026-09-18 (owner §934.9). The COMMITTED census was stale against its own
    // tree: re-taking it by its own writer (`node scripts/wiring-census.mjs`) moved two read
    // paths from `not-produced` to `measured` — `readings.impairedInstitution` and
    // `hasPatron`, both of which a producer in the tree already writes — and the producer
    // index with them (1158 → 1159 files). Neither is this car's doing; the re-take BANKED
    // a truth the register had not caught up with, and it also cured two of the three
    // standing proseWiringCensus reds (the stale-bytes verdict and the holder register).
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 373 -> 398.
    expect(totals.measured, 'read paths whose absence a predicate can see').toBe(590); // COHERENCE-AGREE (guard fddcc13a2, 2026-11-12): the defence home's `court` atom is a producer, so DS-DEF-2's four `court` reads are measured: // COHERENCE-AGREE-4 (item 2 (i), f6000464f): the defence home's `prison` atom is a producer, so DS-DEF-2's four `prison` reads are measured: 586 -> 590 582 -> 586 // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 583 -> 582 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 378 -> 392 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 392 -> 400 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 400 -> 447 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 447 -> 470 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 470 -> 476 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 476 -> 482 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (373 -> 539) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (373 -> 564) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (373 -> 578) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (373 -> 582) // MERGE-WAVE at the W1-A0b merge point (2026-11-08): +1, the merchant-guild pool's commercePoolKey now reads `hasGuild` (5218e6b8d), a read no mapping row names
    expect(totals.default, 'read paths where a fallback hides it').toBe(3);
    // 61 AND NOT 59 SINCE LANDING-7 lane F (R-F1): DS-DEF-9's two `false` pools now read the bare
    // parameter `magicAbsent` at the branch grain, a read path no writer produces.
    expect(totals['not-produced'], 'read paths no writer in the estate produces').toBe(62); // COHERENCE-AGREE (guard fddcc13a2, 2026-11-12): the defence home's `court` atom is a producer for DS-DEF-2's four `court` reads: 70 -> 6 // COHERENCE-AGREE-4 (item 2 (i), f6000464f): and its `prison` atom for their four `prison` reads: 66 -> 626 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 71 -> 70
    // ⭐ THE FOURTH LABEL, ADDED AT MEASURE CAR 3 (the fold's cure 8, and the shape its P5
    // found in the pair table). A chain whose TAIL is a JS method — `eco.incomeSources.reduce`,
    // `readings.notableAbsences.map` — records a CALL the key function made on a reading, not a
    // field of the world. Asking the producer index about `map` answered `not-produced` on
    // eighteen cells, and every one of them was a wrong verdict rather than a finding.
    expect(totals['method-call'], 'read paths whose tail is a builtin, not a field').toBe(18);
    expect(Object.values(totals).reduce((a, b) => a + b, 0), 'and the four labels partition the read paths')
      .toBe(673); // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 460 -> 474 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 474 -> 482 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 482 -> 529 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 529 -> 552 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 552 -> 558 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 558 -> 564 // MERGE-WAVE at the W2 DEF merge (2026-11-08): measured at the merged tip — W1 ECO's +67 and W2 DEF's +109 over 455, additive (631) // MERGE-WAVE at the W3 POW merge (2026-11-08): W3 POW's +25 over 455 (480 on its side), additive (656) // MERGE-WAVE at the W4 PEOPLE merge (2026-11-08): W4 PEOPLE's +14 over 455 (469 on its side), additive (670) // MERGE-WAVE at the W5 HIS merge (2026-11-08): W5 HIS's +4 over 455 (459 on its side), additive (674) // MERGE-WAVE at the W1-A0b merge point (2026-11-08): +1, the merchant-guild pool's new `hasGuild` read (5218e6b8d) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 675 -> 673
    // ⛔ THE TABLE RUNG CARRIES NO ABSENCE RECORD (car 10, cure 4, applied to a new column).
    // Rung 3's field is `"<reader> (via <TABLE> in <file>)"` — this instrument's own label —
    // so asking a producer index about it answers `not-produced` on every table row BY
    // CONSTRUCTION. The rows are counted, never dropped in silence.
    expect(committed.totals.tableRungRowsWithoutAbsence, 'and they are counted').toBe(174); // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 100 -> 129 // W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (100 -> 174)
    for (const row of committed.rows) {
      if (row.rung === 'table') expect(Object.keys(row.absent), `${row.pool} carries no absence record`).toEqual([]);
    }
  });
});

describe('car 0 — `covert`, `objectClass` and the numeric key', () => {
  test('a covert read is covert and its revealed sibling is not', () => {
    const pools = poolsFrom([['DS-FIX-11', [
      ['WATCH: bought, unexposed', UNMARKED_ON_A_COVERT_PATH],
      ['WATCH: bought, on the record', MARKED_ON_A_COVERT_PATH],
    ]]]);
    const rows = fixtureCensus(COMPOSER_COVERT_SOURCE, pools).rows;
    const covert = rows.find((r) => r.pool === 'WATCH: bought, unexposed');
    const revealed = rows.find((r) => r.pool === 'WATCH: bought, on the record');
    expect(covert.covert, 'the `.covert` path is on the frozen list').toBe(true);
    expect(revealed.covert, 'and the `.revealed` path over the same call is not').toBe(false);
    // THE PROJECTOR ERROR CAR 4 REFUSES, convicted here on the census's own column: a
    // covert pool holding a variant with no `dm-only` mark.
    const unmarked = rows.filter((r) => r.covert)
      .filter((r) => pools.get('DS-FIX-11').get(r.pool).some((v) => !(v.marks || []).includes('dm-only')));
    expect(unmarked.map((r) => r.pool), 'an unmarked variant on a covert path is a finding')
      .toEqual(['WATCH: bought, unexposed']);
    const curedPools = poolsFrom([['DS-FIX-11', [['WATCH: bought, unexposed', MARKED_ON_A_COVERT_PATH]]]]);
    const cured = fixtureCensus(COMPOSER_COVERT_SOURCE, curedPools).rows;
    expect(cured.filter((r) => r.covert).map((r) => r.pool), 'the pool is still covert').toEqual(['WATCH: bought, unexposed']);
    expect(cured.filter((r) => r.covert && curedPools.get('DS-FIX-11').get(r.pool)
      .some((v) => !(v.marks || []).includes('dm-only'))), 'and marked dm-only, it is no longer a finding').toEqual([]);
    // The roster is DECLARED, and the general limb catches a covert segment anywhere.
    expect(COVERT_SOURCES.length, 'the covert-source list is published as a frozen constant').toBe(6);
    expect(isCovertPath('compromisedSecurityInstitutions.covert')).toBe(true);
    expect(isCovertPath('npc.corrupt')).toBe(true);
    expect(isCovertPath('readings.reading.mood'), 'and an ordinary reading is not covert').toBe(false);
  });

  test('the object class is read off the KEY, from the closed list the census emits', () => {
    // ⛔ THE ONE LICENSED USE OF THE KEY STRING (ARCH T-F12). Every other column is derived
    // from the recovered wiring; this one is the LABEL half by construction, because the
    // refusal it grounds is "the spine key and the modifier key name the same civic object".
    expect(objectClassOf('WALLED-STRAINED')).toBe('wall');
    expect(objectClassOf('Disasters & Famine: NO reserves, NO medical provision')).toBe('store');
    expect(objectClassOf('MOOD: calm'), 'a key naming no civic object gets none').toBe(null);
    // ⛔ ELEVEN SINCE REWRITE car 8a-8 (SITTING §T.5's T-F12 re-cut): `storehouse` split out of
    // `store`, because the word `granary` named two different civic objects and one class
    // could not tell the STOCK from the BUILDING THAT HOLDS IT. Closed at eleven.
    expect(Object.keys(CIVIC_OBJECT_CLASSES).length, 'the list is closed at eleven classes').toBe(11);
    // THE SAME-CLASS ATTACH, convicted: two keys of one block naming one object.
    const spine = 'Disasters & Famine: NO reserves, NO medical provision';
    const modifier = 'stores: short';
    expect(objectClassOf(spine)).toBe(objectClassOf(modifier));
    expect(objectClassOf(spine), 'so the projector refuses this attach').toBe('store');
    // The paired negative: a modifier over a DIFFERENT object attaches lawfully.
    expect(objectClassOf('watch: bought (covert)')).not.toBe(objectClassOf(spine));
    expect(committed.totals.objectClassed, 'and the corpus count is an integer').toBe(112); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 99 -> 101 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 101 -> 102 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 102 -> 103 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (99 -> 112)
    // ⭐ THE AMBIGUITY, NAMED (the fold's P3, cure 9). A key can name TWO civic objects and the
    // first-wins reading hid it: `granary AND hospital` answered `store`, so T-F12 — whose whole
    // job is to refuse an attach whose spine and modifier name the same object — would have
    // admitted a `care` modifier beside a spine that already names the hospital. The census now
    // records the SET and a refusal reads the INTERSECTION.
    expect(objectClassesOf('Disasters & Famine: granary AND hospital'),
      'the key lists two BUILDINGS — a storehouse and a care house — and no stock level')
      .toEqual(['care', 'storehouse']);
    expect(objectClassesOf('Disasters & Famine: NO reserves, NO medical provision'),
      'and the shipped key the walker used to pin as `store` alone').toEqual(['store', 'care']);
    expect(objectClassesOf('MOOD: calm'), 'a key naming no civic object gets an empty set').toEqual([]);
    const intersects = (a, b) => objectClassesOf(a).some((k) => objectClassesOf(b).includes(k));
    expect(intersects('Disasters & Famine: granary AND hospital', 'Medical Readiness: Clergy care'),
      'the SET refuses what the first class admitted: both name the care house').toBe(true);
    expect(intersects('Disasters & Famine: granary AND hospital', 'WALLED-STRAINED'),
      'and a modifier over a different object still attaches').toBe(false);
    // ⭐⭐ REWRITE car 8a-8 — THE FIVE WAIVED REFUSALS, EACH WITH ITS NEW VERDICT (SITTING §T.5;
    // TASTE M.15). Four of the seven attach sites ARCH §6.3–§6.5 specifies were refused by the
    // key-string proxy; the taste WAIVED them behind `--taste` and handed the sitting the
    // measurement. Re-cut, all five are LAWFUL PROJECTIONS and each on a stated ground.
    //
    //   THREE collided on the POLARITY MARKER T-F3 requires the key to carry. `country: pressed
    //   (walled)` is about the COUNTRY, which is not a civic object of the town at all; the
    //   `(walled)` was one rule's word being read by another. Stripped, the key names nothing.
    expect(objectClassesOf('country: pressed (walled)'),
      'the country is not a civic object; the marker was T-F3\'s and not the writer\'s').toEqual([]);
    expect(objectClassesOf('country: pressed (unwalled)')).toEqual([]);
    expect(intersects('country: pressed (walled)', 'WALLED-STRAINED')).toBe(false);
    expect(intersects('country: pressed (unwalled)', 'UNWALLED-LARGE')).toBe(false);
    expect(intersects('country: pressed (unwalled)', 'UNWALLED-SMALL')).toBe(false);
    //   TWO collided on the BUILDING/STOCK conflation. The spine LISTS BUILDINGS; the modifier
    //   speaks about the STOCK LEVEL, which is a fact the list does not carry.
    expect(intersects('stores: short', 'Disasters & Famine: granary AND hospital')).toBe(false);
    expect(intersects('stores: import-fed', 'Disasters & Famine: granary AND hospital')).toBe(false);
    // ⛔⛔ AND THE GUARD STILL BITES WHERE ARCH §6.4 SAYS IT MUST — "only the two `NO reserves`
    // cells are held". Those two spines carry a STOCK word of their own, so they class as
    // `store` and refuse the same modifier. The re-cut licenses the three building rows and
    // refuses the two stock rows, which is the architecture's own ruling reproduced by the
    // proxy rather than waived around.
    expect(intersects('stores: short', 'Disasters & Famine: NO reserves, hospital present')).toBe(true);
    expect(intersects('stores: short', 'Disasters & Famine: NO reserves, NO medical provision')).toBe(true);
    // AND THE CONSERVATIVE HALF OF THE SPLIT: a storehouse standing ALONE reads as its stock,
    // so a stock modifier is still refused beside `GRANARY: thin`.
    expect(objectClassesOf('GRANARY: thin')).toEqual(['store', 'storehouse']);
    expect(intersects('stores: short', 'GRANARY: thin'),
      'a lone granary is about what is in it, so the restatement is still caught').toBe(true);
    // ⛔ 12 -> 17 AT REWRITE car 8a-8, and the five are named rather than counted: the four
    // `DS-ECO-2 :: GRANARY: <band>` rows and `DS-DEF-6 :: Logistics & Supply: Granary in
    // isolation` gain `storehouse` beside the `store` they already had, because a lone
    // storehouse reads as its stock TOO. The other six granary rows traded `store` for
    // `storehouse` and did not change count.
    const multi = committedSpines.filter((r) => (r.objectClasses || []).length > 1);
    expect(multi.length, 'shipped keys naming MORE THAN ONE class').toBe(20); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted).
    expect(multi.filter((r) => (r.objectClasses || []).includes('storehouse'))
      .map((r) => `${r.block} :: ${r.pool}`).sort(), 'the storehouse rows, named')
      .toEqual([
        'DS-DEF-2 :: Disasters & Famine: granary AND hospital',
        'DS-DEF-2 :: Disasters & Famine: granary AND parish care only',
        'DS-DEF-2 :: Disasters & Famine: granary, NO medical provision',
        'DS-DEF-6 :: Logistics & Supply: Granary + port',
        'DS-DEF-6 :: Logistics & Supply: Granary in isolation',
        'DS-DEF-6 :: Logistics & Supply: Granary with road supply',
        'DS-ECO-2 :: GRANARY: nearly empty',
        'DS-ECO-2 :: GRANARY: stocked',
        'DS-ECO-2 :: GRANARY: thin',
        'DS-ECO-2 :: GRANARY: well stocked',
      ]);
    // ⛔ NOT-EXECUTABLE ON THE MODIFIER SIDE, DECLARED (REWRITE car 8a-3). TASTE car M-2 pins
    // `stores: import-fed` here — a modifier key naming a STORE and a MARKET, which is why the
    // T-F12 refusal must read the SET on the modifier side too. This tree has no modifier row
    // to read it on, so the arm states its input is absent rather than asserting `[]`, which
    // would be the same green whether the SET rule worked on a modifier or not. The rule
    // ITSELF is exercised above on `intersects`, over the same two shipped keys.
    expect(modifierRows(committed.rows).length,
      'NOT-EXECUTABLE: the modifier side of the class SET has no row until 8b authors one')
      .toBe(0);
    for (const row of committed.rows) {
      expect(row.objectClass, `${row.pool}: the single-valued column is the set's first`)
        .toBe(row.objectClasses.length ? row.objectClasses[0] : null);
    }
  });

  test('a numeric pool key is named, and its sibling is not', () => {
    const rows = fixtureCensus(COMPOSER_NUMERIC_KEY, poolsFrom([['DS-FIX-13', [
      ['1', SETTLEMENT_ONLY], ['RUNG: the second', SETTLEMENT_ONLY],
    ]]])).rows;
    // P-F12: a key matching `^\d+$` is refused at projection, because a desk that iterated
    // its own pools by index would select one. The census names them so car 4 can refuse.
    const numeric = rows.filter((r) => /^\d+$/.test(r.pool)).map((r) => r.pool);
    expect(numeric, 'the numeric key is named').toEqual(['1']);
    expect(rows.find((r) => r.pool === '1').status, 'and it is a real resolved row, not a parse artefact')
      .toBe(WIRING_STATUS.RESOLVED);
    expect(committed.rows.filter((r) => /^\d+$/.test(r.pool)), 'the shipped corpus holds none').toEqual([]);
  });
});

describe('MEASURE car 3 — the desk-read recipe, the absence readers and the `sites` column', () => {
  test('⭐ THE ECONOMY DESK IS CALLED BY ITS SHIPPED RECIPE, AND THE TWO AUDIENCES DIFFER', () => {
    // ⛔ THE FOLD'S FINDING 1 (SITTING §P.1), CONVICTED. `deskReturns` passed `{seed, audience}`
    // to `economyDeskRead`, which takes four readings from its OPTIONS and defaults each to
    // null, and which keys the audience on `options.playerView` — a key nothing passed. So the
    // instrument composed that desk with four caller readings absent and at the DM face on
    // BOTH audiences: the RATE corpus under-fired three FOOD pools, and the composed-prose
    // manifest was two-audience on five desks and DM-face-twice on the sixth, with 309 player
    // cells carrying DM-only prose at `index: -1`.
    // THE TOWN IS NAMED, not sampled: `thorp|germanic|forest|isolated|civilized` is the first
    // golden configuration on which `DS-ECO-6 :: TIER: minor shadow activity` fires, and that
    // pool holds a `dm-only` variant beside an unmarked one. A town where the two faces cannot
    // differ would make this arm pass while proving nothing, which is the state it convicts.
    const config = goldenCorpus()[2];
    expect(keyOf(config), 'the golden configuration this arm reads')
      .toBe('thorp|germanic|forest|isolated|civilized|golden-master-v3');
    const { _seed: seed, ...cfg } = config;
    const town = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    const at = (audience) => ({ seed: String(town._seed ?? town.id ?? seed), audience });
    // THE FIXTURE ARM: every reading `economyDeskRead` would default to `null` is supplied.
    const options = economyDeskOptions(town, at('dm'));
    for (const reading of ['foodBalance', 'granaryOutlook', 'flowDrift', 'impairedInstitution']) {
      expect(reading in options, `the recipe supplies ${reading}`).toBe(true);
    }
    expect(options.foodBalance.available, 'and `deriveFoodBalance` really reads this town').toBe(true);
    expect(options.playerView, 'the DM face').toBe(false);
    expect(economyDeskOptions(town, at('player')).playerView, 'and the player face').toBe(true);
    expect(impairedInstitutionOf(town) === null || typeof impairedInstitutionOf(town) === 'string',
      'the ServicesTab derivation answers a house or nothing, never undefined').toBe(true);
    // THE TWO-AUDIENCE ARM: the desk's return must DIFFER somewhere between the faces. Before
    // the cure this read `true` by construction, on every town in the estate.
    const dmDesk = economyDeskRead(town, economyDeskOptions(town, at('dm')));
    const playerDesk = economyDeskRead(town, economyDeskOptions(town, at('player')));
    expect(JSON.stringify(dmDesk) === JSON.stringify(playerDesk),
      'the economy desk answers the two audiences identically, which is the defect this arm exists for')
      .toBe(false);
    // AND THE PAIRED NEGATIVE, so the arm is not simply reading two different calls: the SAME
    // audience twice is byte-identical, or the difference above would prove nothing about the
    // audience at all.
    expect(JSON.stringify(economyDeskRead(town, economyDeskOptions(town, at('dm')))),
      'the same face twice is the same prose').toBe(JSON.stringify(dmDesk));
    // THE DEFECT ITSELF, driven: the old call shape cannot tell the faces apart.
    expect(JSON.stringify(economyDeskRead(town, at('dm'))),
      'the old `{seed, audience}` call answers the DM face at both audiences')
      .toBe(JSON.stringify(economyDeskRead(town, at('player'))));
    // AND THE SIX-DESK RECIPE CARRIES IT: `deskReturns` is what both instruments compose
    // through, so the difference must survive the walk and not only the direct call.
    const economyOf = (audience) => deskReturns(town, at(audience)).find((d) => d.desk === 'economy');
    expect(JSON.stringify(economyOf('dm').value) === JSON.stringify(economyOf('player').value),
      'the recipe both instruments use carries the audience through').toBe(false);
  }, 120_000);

  test('⭐ AND THE FIXTURE THE DEFECT CAME FROM CARRIES THE SAME CURE', () => {
    // ⛔ CURE 2. `tests/fixtures/composedReadingSequence.js:192` — INSTR-912 car 9's "corrected"
    // sequence — carried the identical `economyDeskRead(settlement, opts)` call, and car 0's
    // `deskReturns` took the defect from there. Fixed in the same commit or the next car
    // re-inherits it: both now build the economy desk's options through ONE function, and this
    // arm is the two-audience difference read over the FIXTURE rather than over the script.
    const dm = composedReadingSequence(1, { audience: 'dm' });
    const player = composedReadingSequence(1, { audience: 'player' });
    expect(dm.towns, 'one town at each face').toBe(1);
    expect(dm.deskThrows, 'and no desk threw on either').toEqual({});
    expect(player.deskThrows).toEqual({});
    const textAt = (run, pool) => run.rungs.filter((r) => r.pool === pool).map((r) => r.text).join('|');
    const differing = dm.rungs.filter((rung, i) => player.rungs[i] && player.rungs[i].text !== rung.text);
    expect(differing.length, 'the two faces read differently somewhere in the sequence').toBeGreaterThan(0);
    expect(textAt(dm, differing[0].pool) === textAt(player, differing[0].pool),
      `${differing[0].pool} reads the same on both faces`).toBe(false);
  }, 120_000);

  test('a REFUSAL GUARD is not a default, and a SHORTHAND write is not un-produced', () => {
    // ⛔ THE FOLD'S R3, cure 8. `absenceOf` tested `chain \s* (\|\||\?\?)`, which cannot tell
    // `x || fallback` — a default wearing a reading's clothes, the finding this column exists
    // for — from `!x || typeof x !== 'object'`, a guard that REFUSES and hands the predicate
    // nothing. Seven of the ten shipped `default` cells were guards.
    const guard = "if (!inst || typeof inst !== 'object') return null; return inst.name;";
    const fallback = 'const inst = readings.inst || {}; return inst.name;';
    expect(absenceOf('readings.inst', guard, new Set(['inst'])),
      'a guard that returns null hides nothing from the predicate').toBe('measured');
    expect(absenceOf('readings.inst', fallback, new Set(['inst'])),
      'and the same tokens as a fallback still read `default`').toBe('default');
    expectPresentThenAbsent(
      [absenceOf('readings.inst', fallback, new Set(['inst']))],
      [absenceOf('readings.inst', guard, new Set(['inst']))],
      'default',
      'the `||` alone is not the finding; the operand is',
    );
    // ⛔ THE FOLD'S P2, the other half of cure 8. `producerIndex` matched `key:` and `.key =`
    // by line regex, so an ES6 SHORTHAND property write was invisible and six cells carried a
    // wrong `not-produced` verdict. The estate had already spelled the cure by hand for one of
    // them (`src/domain/fieldManifest.js:373`, `producerProbe`). The index reads the syntax
    // tree now, where a shorthand key is a Property like any other.
    const shorthand = astTokens('const f = (blockadeBypass) => ({ stockpile: 1, blockadeBypass });');
    expect(shorthand.parsed, 'the fixture parses').toBe(true);
    expect(shorthand.writes.map((w) => w.name).sort(), 'both keys are writes, shorthand included')
      .toEqual(['blockadeBypass', 'stockpile']);
    expect(/(?:^|[{,\s])([A-Za-z_$][\w$]*)\s*:/.test('  blockadeBypass,'),
      'while the line regex it replaces sees nothing at all').toBe(false);
    expect(/producerProbe:[^\n]*blockadeBypass/.test(readFileSync(join(ROOT, 'src/domain/fieldManifest.js'), 'utf8')),
      'and the estate had spelled this cure by hand for the same field, at fieldManifest.js:373')
      .toBe(true);
    const { produced } = producerIndex();
    for (const key of ['blackMarketCapture', 'blockadeBypass', 'prominentRelationship']) {
      expect(produced.has(key), `${key} is written as a shorthand property and the index sees it`).toBe(true);
    }
    expect(produced.has('zzzNoWriterAnywhere'), 'and a key nothing writes is still absent').toBe(false);
    // ⛔ AND THE FOUR SHAPES THE AST REFUSES, which is why `generator-write` was re-cut with it
    // (SITTING §P.2-27): a comment, a prose string, a template string and an arrow's parameter
    // all named tokens the line reader counted as writes or as mentions.
    // The fixture is the four refuted shapes in their SHIPPED spelling: a comment line, a
    // `reason:` prose string, a template string, and a prose-template table whose key is on one
    // line and whose arrow parameter is the root the old rule read as a mention.
    const noisy = astLineIndex(new Map([['fixture/noisy.js', [
      '// forces: a comment naming a key',
      "const reason = 'underfunded: a prose string';",
      'const t = `siege: ${name}`;',
      'const table = {',
      '  famine: (row) =>',
      '    `${row} went hungry`,',
      '};',
    ].join('\n')]]));
    expect([...noisy.byWrite.keys()].sort(), 'only the real Property key is a write').toEqual(['famine']);
    for (const dead of ['forces', 'underfunded', 'siege']) {
      expect(noisy.byToken.has(dead), `${dead} is inside a comment or a string and proposes nothing`).toBe(false);
    }
    expect([...(noisy.byWrite.get('famine') || [])], 'the write is cited at its own line')
      .toEqual(['fixture/noisy.js:5']);
    expect([...(noisy.byToken.get('row') || [])],
      'and the arrow PARAMETER binding on line 5 is not a mention; only its use in the body is')
      .toEqual(['fixture/noisy.js:6']);
    expect(noisy.unparsed, 'and nothing was skipped').toEqual([]);
    // THE WRITE SHAPES, both of them, over a file set — what the alias draft consumes.
    const index = astLineIndex(new Map([['f.js', 'const o = { granary: 1 }; o.walls = 2;']]));
    expect([...index.byWrite.keys()].sort(), 'the two writes, keyed by the alias reading').toEqual(['granary', 'walls']);
  });

  test('⭐ THE `sites` COLUMN IS CONVICTED BY A FIXTURE THAT MUST FIRE', () => {
    // ⛔ THE FOLD'S P7. `totals.mountedRows` 566 was covered by the blunt byte-identity arm and
    // by nothing else: `grep -c "566\|mountedRows"` over this file answered 0. A change-detector
    // says a number moved; it says nothing about what the column MEANS.
    const pools = poolsFrom([
      ['DS-FIX-14', [['MOUNTED: the block speaks', SETTLEMENT_ONLY]]],
      ['DS-FIX-15', [['DARK: the registry names no mount', SETTLEMENT_ONLY]]],
    ]);
    const mounted = fixtureCensus(COMPOSER_ONE_BRANCH, pools, {
      mounts: [{ mount: 'defense.wallRationale', tab: 'defense', blockId: 'DS-FIX-14' }],
    }).rows;
    const speaking = mounted.filter((r) => (r.sites || []).length > 0);
    expect(speaking.map((r) => r.block), 'only the block the registry mounts carries a site').toEqual(['DS-FIX-14']);
    expect(speaking[0].sites, 'and it carries the mount by name').toEqual(['defense.wallRationale']);
    // THE PAIRED NEGATIVE: with no registry the column is EMPTY on every row, so a census that
    // stopped reading the registry could not pass this arm by answering the same thing twice.
    const blind = fixtureCensus(COMPOSER_ONE_BRANCH, pools).rows;
    expect(blind.filter((r) => (r.sites || []).length > 0), 'a blind census mounts nothing').toEqual([]);
    // AND THE SHIPPED INTEGER, tied to the same column on the same rule.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 567 -> 575.
    expect(committed.totals.mountedRows, 'rows the mount registry gives a place to speak').toBe(725); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 726 -> 725 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 569 -> 573 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 573 -> 576 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 576 -> 582 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 582 -> 587 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 587 -> 591 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 591 -> 624 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (567 -> 657) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (567 -> 665) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (567 -> 721) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (567 -> 726)
    expect(committedSpines.filter((r) => (r.sites || []).length > 0).length,
      'and the total is the column, not a second count').toBe(committed.totals.mountedRows);
    const registryBlocks = new Set(DOSSIER_MOUNTS.map((m) => m.blockId));
    expect(committed.rows.filter((r) => (r.sites || []).length > 0).every((r) => registryBlocks.has(r.block)),
      'every mounted row sits on a block the registry names').toBe(true);
  });

  test('⭐ THE THREE RATIFIED ALIASES, AND NOTHING ELSE (SITTING §P.2-27)', () => {
    // The chair ratified the draft's `identifier` rows — the same identifier on both sides,
    // ARCH §5.2's own worked edge among them — and WITHDREW the four "would join" rows and
    // every `generator-write` citation that was a comment, a prose string, a template string or
    // an arrow parameter. The census RECORDS the ratification so the relations leaf (SEAM car
    // 4) has one source; it is still not a leaf and the shipped join is still zero.
    const ratified = committed.ratifiedAliases;
    expect(ratified.rows.map((r) => `${r.endpoint} -> ${r.readRoot}`), 'the three, in the draft\'s order').toEqual([
      'cause:occupation -> war',
      'economicGates.military -> settlement.defenseProfile',
      'system:food_security -> eco',
    ]);
    expect(committed.totals.ratifiedAliases, 'and the total says three').toBe(3);
    expect(new Set(ratified.rows.map((r) => r.evidence)), 'every one of them an identifier row')
      .toEqual(new Set(['identifier']));
    for (const row of ratified.rows) {
      expect(row.at, `${row.endpoint} carries the read path that proposed it`).not.toBe('');
      expect(committed.rows.some((r) => (r.reads || []).includes(row.at)),
        `${row.at} is a read path the shipped census carries`).toBe(true);
    }
    expect(String(ratified.ruling), 'the ruling that ratified them is quoted in the file').toMatch(/P\.2-27/);
    expect(committed.relations.join.strictBoth, 'and the shipped join is unmoved at zero').toBe(0);
  });
});

describe('car 0 — the derived ATTACH sets, their coverage, and the fact budget', () => {
  test('an attach set is every RESOLVED spine whose tests EXCLUDE the fact', () => {
    const rows = fixtureCensus(COMPOSER_POLARITY, poolsFrom([['DS-FIX-12', [
      ['WALLED-STRAINED', SETTLEMENT_ONLY], ['WALLED-QUIET', SETTLEMENT_ONLY],
      ['UNWALLED-SMALL', SETTLEMENT_ONLY], ['UNWALLED-LARGE', SETTLEMENT_ONLY],
    ]]])).rows;
    expect(rows.every((r) => r.status === WIRING_STATUS.RESOLVED), 'all four spines resolve').toBe(true);
    const [block] = attachSets(rows);
    expect(block.spines, 'four spines over one polarity field').toBe(4);
    const gate = block.byFact.find((f) => f.field === 'gate');
    expect(gate, 'the block reads a second fact only ONE spine tests').toBeTruthy();
    // The spines whose branch tests `gate` are excluded; the rest are the attach set.
    expect(gate.attach.sort(), 'and every spine that does NOT test it is attachable')
      .toEqual(['UNWALLED-LARGE', 'UNWALLED-SMALL', 'WALLED-QUIET']);
    // ⭐ THE SPANNING SET, CONVICTED (T-F3). `gate`'s attach set holds spines on BOTH sides
    // of the polarity field `forces.walls.present`, and a relation-bearing modifier may not
    // span two value classes: a pressed country beside a standing wall and beside no wall
    // are not one relation. The census hands car 4 the set the refusal is computed over.
    const polarityOf = (pool) => (pool.startsWith('WALLED') ? 'walls=true' : 'walls=false');
    expect(new Set(gate.attach.map(polarityOf)).size, 'the set spans two polarity classes').toBe(2);
    const walled = block.byFact.find((f) => f.field === 'forces.walls.present');
    expect(walled.attach, 'while the polarity field itself attaches nowhere: every spine tests it')
      .toEqual([]);
  });

  test('attach coverage is printed per block, in basis points, over the shipped corpus', () => {
    const coverage = committed.attachCoverage;
    expect(coverage.length, 'one row per block carrying a RESOLVED spine').toBe(
      new Set(committed.rows.filter((r) => r.status === WIRING_STATUS.RESOLVED).map((r) => r.block)).size,
    );
    const gen3 = coverage.find((c) => c.block === 'DS-GEN-3');
    expect(gen3.spines, 'DS-GEN-3 is the estate\'s widest block').toBe(42);
    expect(gen3.spinesReachedBp, 'and every one of its spines can carry a modifier').toBe(10000);
    expect(coverage.length, 'and that is fifty of the sixty-eight blocks').toBe(55); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 50 -> 51 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 51 -> 52 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (50 -> 54) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (50 -> 55)
    // ⭐⭐ THE RULING'S OWN CONSEQUENCE, MEASURED (SITTING §O.1, car 0e). Under the
    // FUNCTION-WIDE grain twenty-six of the fifty composable blocks read 0 bp, because on a
    // block whose pools come from ONE ladder every spine carried the same read set. The
    // BRANCH grain frees FOUR of them and DS-DEF-11 — the owner's walls block, on which ARCH
    // §6.3 works its whole example — is one: `country: pressed (walled)` attaching to
    // STRAINED is reachable at this grain and was not at the last.
    const dark = coverage.filter((c) => c.spinesReachedBp === 0).map((c) => c.block);
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 21 -> 20.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 25 -> 24.
    expect(dark.length, 'blocks where no fact of the block can attach to any spine of it').toBe(18); // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (21 -> 20) // W4 PEOPLE 2026-11-07: re-measured, the faith and great-house construction // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (21 -> 19) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (21 -> 18)
    expect(committed.grains.function.cannotAttach.length, 'against the grain the ruling replaced').toBe(21); // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 24 -> 25 // MERGE-WAVE at the W2 DEF merge (2026-11-08): measured at the merged tip — 24: W1 ECO took DS-ECO-9 off the list, W2 DEF put DS-DEF-12 on it and took DS-DEF-9 off // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (25 -> 23) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (25 -> 22) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (25 -> 21)
    expect(committed.grains.function.cannotAttach.filter((b) => !dark.includes(b)),
      'and these four are what the branch grain buys (DS-DEF-9 went dark with F9 READER-CONTRADICTIONS\' absent-state pool at LANDING-1,'
      + ' and came back at LANDING-7 lane F when that pool\'s `magicAbsent` test became an `if` the branch reader sees;'
      + ' and at W2 DEF C1/C2, 2026-11-07, its two FLAG pools put a second key function in the block, so the FUNCTION grain attaches there too and it leaves this list;'
      + ' DS-DEF-12 joins at W2 DEF C3–C5, 2026-11-07: its one key function reads the five isolation-support fields, so only the branch grain attaches)')
      // MERGE-WAVE at the W2 DEF merge (2026-11-08): W1 ECO's DS-ECO-9 leaves the list (its food lenses read facts its
      // ladder does not, so the function grain attaches there), composed with W2 DEF's DS-DEF-12 joining it.
      .toEqual(['DS-DEF-11', 'DS-DEF-12', 'DS-POW-3']);
    expectAbsentWithAnchor(dark, 'DS-DEF-11', 'DS-STR-1', 'the blocks that cannot compose');
    // ⭐⭐ AND DS-DEF-2 HAS LEFT THE DARK SET (SEAM car 3h) — A WIRING ACT, NEVER A GRAIN ONE.
    // At the last tip 22 of its 26 pools were WIRING-UNRESOLVED and the 4 that resolved were
    // ONE ladder (`internalRowPoolKey`) whose every branch tests BOTH of its fields, so no
    // fact of the block excluded a spine and it read 0 bp. The desk then exposed its four
    // remaining key tables — BEASTS_ROW_POOL, INVASION_ROW_POOL, ECONOMIC_ROW_POOL,
    // DISASTER_ROW_POOL — as module-level frozen tables, the ladder's rung 3 recovered all 22
    // with a predicate each, and the block's fact set went 2 to 6. ARCH §6.4's own sentence
    // named the cure and this is it.
    // ⛔ THE MOVE IS DECLARED AND IT MOVED NO TEXT: no key string, no pool, no variant and no
    // drawn index moved with it, which the manifest drift arm is what proves.
    expectAbsentWithAnchor(dark, 'DS-DEF-2', 'DS-STR-1', 'the blocks that cannot compose');
    const def2 = committedSpines.filter((r) => r.block === 'DS-DEF-2');
    const def2Resolved = def2.filter((r) => r.status === WIRING_STATUS.RESOLVED);
    expect(def2.length, 'DS-DEF-2 ships thirty pools').toBe(30); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 26 -> 30, the four CHAIN pools
    expect(def2Resolved.length, 'and the census now recovers every one of them').toBe(30); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 26 -> 30
    expect(new Set(def2Resolved.map((r) => r.keyFunction)).size,
      'from SEVEN readers: the four exposed tables, the one literal ladder and the two CHAIN clause keys').toBe(7); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 5 -> 7 (defenceSupplyPoolKey, foodTradesPoolKey)
    expect(new Set(def2Resolved.map((r) => r.reads.join('|'))).size,
      'and seven read sets are what lets a fact of the block exclude a spine').toBe(7); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 5 -> 7, the two CHAIN key functions' read sets
    const def2Coverage = coverage.find((c) => c.block === 'DS-DEF-2');
    expect(def2Coverage.spines, 'every pool of the threat assessment is a spine now').toBe(30); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 26 -> 30
    expect(def2Coverage.facts, 'over eight facts (six until W2 DEF C6), where an earlier tip had two').toBe(8); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 6 -> 8
    expect(def2Coverage.spinesReachedBp, 'and every spine of it can carry a modifier').toBe(10000);
    // ⛔ THE ONE LADDER IS UNMOVED, which is the half a uniform sweep would have lost.
    // `internalRowPoolKey` still resolves on rung 1 with its OWN two readings rather than
    // through a table's synthetic label, so its four rows keep the block's only named fact
    // pair and their fact budget with it. A car that tabled row 3 as well would read greener
    // here and know less.
    const internal = def2Resolved.filter((r) => r.keyFunction === 'internalRowPoolKey');
    expect(internal.length, 'the literal ladder keeps its four rows').toBe(4);
    expect([...new Set(internal.map((r) => r.reads.join('|')))],
      'and its read set, recovered from the branch and not from a label').toEqual(['court|prison']);
    expect([...new Set(internal.map((r) => r.k))], 'so its fact budget is unmoved').toEqual([1]);
    expect(dark, 'and the single-fact block').toContain('DS-STR-1');
    // THE PAIRED POSITIVE: a block whose pools come from SEVERAL key functions composes, so
    // the dark list is a SELECTION and not the whole roster. Anchored on DS-STR-1, which the
    // same list does carry: a bare `not.toContain` would pass just as happily if the coverage
    // derivation drifted away entirely.
    expectAbsentWithAnchor(dark, 'DS-GEN-3', 'DS-STR-1', 'the blocks that cannot compose');
  });

  test('the fact budget is counted over RESOLVED rows and refuses the rest', () => {
    const budget = committed.factBudget;
    // ⛔ NOT-EXECUTABLE, NEVER k = 3. An UNRESOLVED row reads `[]`, which would answer "three
    // free seats" on a pool whose predicate nobody has recovered — the friendliest number,
    // and the §908 law forbids exactly that.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 49 -> 54.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 341 -> 349.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 709 -> 717.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 341 -> 349.
    expect(budget.zeroK, 'RESOLVED spines that can never take a modifier: k = 3 - |reads| <= 0').toBe(85); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 50 -> 53 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 53 -> 55 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 55 -> 61 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 61 -> 66 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (49 -> 78) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (49 -> 83) // W4 PEOPLE 2026-11-07: re-measured, the faith and great-house construction // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (49 -> 85) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (49 -> 85)
    expect(budget.executable, 'counted over the RESOLVED rows').toBe(488); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 489 -> 488 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 343 -> 347 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 347 -> 350 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 350 -> 356 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 356 -> 361 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 361 -> 365 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 365 -> 398 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (341 -> 425) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (341 -> 433) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (341 -> 485) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (341 -> 489)
    expect(budget.notExecutable, 'and the UNRESOLVED rows declare themselves').toBe(368); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (368 -> 367) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (368 -> 367) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (368 -> 367) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (368 -> 368)
    expect(budget.executable + budget.notExecutable).toBe(856); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 711 -> 715 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 715 -> 718 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 718 -> 724 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 724 -> 729 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 729 -> 733 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 733 -> 766 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (709 -> 792) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (709 -> 800) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (709 -> 852) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (709 -> 857) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 857 -> 856
    const summed = budget.histogram.reduce((total, [, n]) => total + n, 0);
    expect(summed, 'the histogram carries every executable row once').toBe(488); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 343 -> 347 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 347 -> 350 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 350 -> 356 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 356 -> 361 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 361 -> 365 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 365 -> 398 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (341 -> 425) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (341 -> 433) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (341 -> 485) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (341 -> 489) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 489 -> 488
    // The rule itself, on a fixture: a three-field spine has no seat and a one-field spine has two.
    const rows = [
      { block: 'B', pool: 'p1', status: WIRING_STATUS.RESOLVED, reads: ['a', 'b', 'c'] },
      { block: 'B', pool: 'p2', status: WIRING_STATUS.RESOLVED, reads: ['a'] },
      { block: 'B', pool: 'p3', status: WIRING_STATUS.UNRESOLVED, reads: [] },
    ];
    expect(factBudget(rows).zeroK).toBe(1);
    expect(factBudget(rows).notExecutable).toBe(1);
    expect(Object.fromEntries(factBudget(rows).histogram)).toEqual({ 0: 1, 2: 1 });
    // AND THE BRANCH GRAIN IS WHAT THAT 49 IS COUNTED OVER, with the function-wide reading
    // beside it: the ruling's cost is 72 rows that leave k = 0, printed in ONE table.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 49 -> 54.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 125 -> 131.
    expect(committed.grains.branch.zeroK, 'the shipped grain').toBe(85); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 50 -> 53 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 53 -> 55 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 55 -> 61 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 61 -> 66 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (49 -> 78) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (49 -> 83) // W4 PEOPLE 2026-11-07: re-measured, the faith and great-house construction // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (49 -> 85)
    expect(committed.grains.function.zeroK, 'and the grain the ruling replaced').toBe(169); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 127 -> 131 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 131 -> 133 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 133 -> 139 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 139 -> 144 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (125 -> 161) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (125 -> 167) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (125 -> 169)
  });
});

describe('car 0 — mounts per fact, custom reachability, and the relation table', () => {
  test('the modifier half of mounts-per-fact is NOT-EXECUTABLE without a desk-fact census', () => {
    const blind = factMounts(committed.rows, DOSSIER_MOUNTS);
    expect(blind.notExecutable.length, 'a comparison against nothing is not a clean bill').toBe(1);
    expect(blind.rows.every((r) => r.mountsModifier === null), 'and the column is null, never 0').toBe(true);
    const wired = committed.mountsPerFact;
    expect(wired.notExecutable, 'with the census supplied it is executable').toEqual([]);
    // ⭐ THE MODIFIER HALF IS THE TAB'S QUESTION. Derived within a block it is zero on every
    // row by construction, because a fact one of a block's own spines reads SPINES on that
    // block's tab and the echo bound excludes it there.
    expect(wired.rows.some((r) => (r.mountsModifier || 0) > 0), 'and it answers a real number').toBe(true);
    expect(wired.byTab.length, 'every mounted tab carries a modifier-eligible count').toBe(
      new Set(DOSSIER_MOUNTS.map((m) => m.tab)).size,
    );
    // ARCH §6.5's worked REFUSAL, as a measurement: `tradeRouteAccess` spines at
    // `overview.origin`, so it may take no modifier seat anywhere on the overview tab.
    const route = wired.rows.find((r) => r.field === 'readings.tradeRouteAccess');
    expect(route.spineTabs, 'the route spines on overview').toContain('overview');
    expect(route.modifierMounts.filter((m) => m.startsWith('overview.')),
      'so no overview mount is modifier-eligible for it').toEqual([]);
    expect(route.modifierMounts.length, 'while other tabs remain open to it').toBeGreaterThan(0);
  });

  test('custom-content reachability is enumerable from code, per kind, with the limb named', () => {
    // The owner's 2026-09-08 ~04:00 row: the CUSTOM-PROSE train authors one generic
    // construction per reachable (kind x fact x value), so the count per kind is its input.
    const custom = committed.customReachable;
    expect(custom.byKind.length, 'the eight authorable kinds, enumerated from the manifest').toBe(8);
    expect(custom.rows.length, 'in-house (block, pool) predicates a custom definition can reach').toBe(28); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 21 -> 26 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (21 -> 28)
    expect(Object.fromEntries(custom.byKind), 'per kind, as integers').toEqual({
      services: 6, resources: 6, institutions: 7, factions: 2, tradeGoods: 2, stressors: 0, deities: 0, traditions: 5, // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): the five ARCANE pools that read defenseProfile.traditions, 0 -> 5 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (5 -> 7; 0 -> 5)
    });
    for (const row of custom.rows) {
      expect(['bucket', 'field', 'value'], `${row.pool} names which limb caught it`).toContain(row.via);
    }
    // THE LIMBS, driven on a fixture so the integers above are not the only evidence.
    const categories = [{
      key: 'resources',
      singular: 'Resource',
      fields: [{ key: 'criticality', effect: 'mechanical', values: ['critical', 'important'] }],
    }];
    const hit = customReachable([{
      block: 'B', pool: 'p', reads: ['readings.resources'], predicate: [],
    }], categories);
    expect(hit.rows[0].via, 'a reads path naming the bucket').toBe('bucket');
    const byValue = customReachable([{
      block: 'B', pool: 'p', reads: ['readings.other'], predicate: [{ field: 'x', op: '===', value: 'critical' }],
    }], categories);
    expect(byValue.rows[0].via, 'a predicate value inside a mechanical enum').toBe('value');
    expect(customReachable([{ block: 'B', pool: 'p', reads: ['readings.mood'], predicate: [] }], categories).rows,
      'and a pool reaching nothing is not counted').toEqual([]);
  });

  test('PROBE: a category\'s DISPLAY singular is never an identity — renaming it changes no reachable row', () => {
    // 2026-11-09 (SW-8 RENAME-POWERS second seat, the chair's ruling (B) at 17:2x): SW-8 C7 renamed the
    // custom-content manifest's display singular "Faction" -> "Power", and the bucket limb read that LABEL
    // as a token, so the power desk's own root `power.*` became eight false reaches (28 -> 36). The bucket
    // tokens are the category's STORED identity — its key and its read-path `root` — never a label.
    const rows = [
      { block: 'B', pool: 'desk root', reads: ['power.stability'], predicate: [] },
      { block: 'B', pool: 'by key', reads: ['readings.factions'], predicate: [] },
      { block: 'B', pool: 'by root', reads: ['faction.name'], predicate: [] },
    ];
    const withSingular = (singular) => customReachable(rows, [{ key: 'factions', root: 'faction', singular, fields: [] }]).rows;
    expect(withSingular('Power'), 'the display singular moved no row').toEqual(withSingular('Faction'));
    expect(withSingular('Power').map((r) => r.pool), 'the key and the stored root still reach; the label never does')
      .toEqual(['by key', 'by root']);
  });

  test('the relation table has its row count by source and by direction, and source (d) is EMPTY', () => {
    const relations = committed.relations;
    expect(relations.rows.length, 'rows the four sources yield at this tip').toBe(165);
    expect(Object.fromEntries(relations.bySource), 'by source').toEqual({ a: 131, b: 28, c: 6 });
    expect(Object.fromEntries(relations.byDirection), 'and every row carries its direction').toEqual({ 'a->b': 165 });
    // ⭐ SOURCE (d) IS THE SITTING'S AND IS EMPTY, ASSERTED (ARCH §5.2, E-F14b). A missing key
    // would leave a reader to infer the emptiness; an assertion makes the standing
    // ratification door's first row visible the moment it lands.
    expect(relationsFromSitting(), 'no sitting has ratified an axis pair').toEqual([]);
    expect(relations.rows.filter((r) => r.source === 'd'), 'so the table carries none').toEqual([]);
    // THE EDGE ARCH §5.2 NAMES, recovered rather than transcribed: the generator's
    // `milUpkeepMult = min(1, 0.6 + econOutput/50 * 0.4)` degrading the military score.
    const gate = relations.rows.filter((r) => r.b === 'economicGates.military');
    expect(gate.map((r) => r.a), 'econOutput is the gate\'s source')
      .toEqual(['src/generators/defenseGenerator.js::econOutput']);
    expect(gate[0].relation).toBe('consequence');
    expect(gate[0].direction).toBe('a->b');
  });

  test('⭐ NOT ONE RELATION ROW JOINS TWO FIELDS A DESK READS, and that is the car\'s finding', () => {
    // ⛔ ARCH §11's EMPTY-TABLE RISK HAS MATERIALISED, MEASURED RATHER THAN FEARED. A
    // `consequence` or `tension` joint is licensed only by a row whose endpoints include the
    // spine's PRIMARY field. The table names PRODUCER tokens (`condition:<archetype>`,
    // `system:<variable>`, `economicGates.<gate>`); the census names CALLER paths and bare
    // key-function parameters (`readings.x`, `gate`, `forces`). At this tip the two
    // vocabularies do not meet — not once, in either direction, and not even at the leaf.
    const join = committed.relations.join;
    // 85 AND NOT 91 SINCE CAR 0e: the join is taken over `reads`, and six roots were reached
    // only by a field some OTHER branch of the same key function tested. 89 AND NOT 85 SINCE
    // SEAM car 3h: the four exposed DS-DEF-2 tables each root in their own synthetic label,
    // which is a root no relation endpoint can ever meet — so the finding below is unmoved
    // and the denominator it is measured against grew by exactly four. 90 AND NOT 89 SINCE LANE
    // DEFENSE's 0b2548de5 (the owner's word: stored food is the Economy tab's): the Defense desk
    // stopped calling `supplyLogisticsPoolKey`, so its bare parameter `tradeAccess` is no longer
    // rerooted to the caller's `settlement.config.tradeRouteAccess`. It reaches the census only
    // through DS-GEN-6 :: isolated, which the literal rung resolves through that key function's
    // `access === 'isolated'`. `settlement` stays a root through other reads; `tradeAccess` is
    // the one new root. Traced by lane DEFENSE-2; the finding below is unmoved. 91 AND NOT 90 SINCE
    // LANE DEFENSE-2 keyed DS-DEF-9 on the one magic reliance reading: the desk now passes
    // `reliesOnMagic(settlement)` (a call) where it passed `settlement.defenseProfile.magicDependency`,
    // so the census keeps `magicDependencyPoolKey`'s parameter name `magicDependency` as the read.
    // It still resolves to the muster holder by name (no licensed row moves); `settlement` stays a
    // root through other reads; `magicDependency` is the one new root.
    // 92 AND NOT 91 SINCE LANDING-7 lane F (R-F1): the same function's third parameter,
    // `magicAbsent`, reaches the branch grain through its `if`; it is the one new root.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 92 -> 93.
    expect(join.deskRoots, 'the desks read this many distinct field roots').toBe(108); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 93 -> 94 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 94 -> 95 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 95 -> 98 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (92 -> 104) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (92 -> 105) // MERGE-WAVE at the W3 POW merge (2026-11-08): measured at the merged tip — 104: the root W3 POW adds is already among W1/W2's, so it counts once (additive would be 105) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (92 -> 108)
    expect(join.strictBoth, 'rows a projector could license today').toBe(0);
    expect(join.strictEither, 'and rows sharing even ONE endpoint with a desk read').toBe(0);
    expect(join.leafBoth, 'nor does a leaf-level normalisation reach a row').toBe(0);
    // ⭐ TWO ROWS JOIN ON ONE ENDPOINT AT THE LEAF, and one of them is the ARCH document's
    // own worked edge — `econOutput` degrading `economicGates.military`. Even that edge is
    // half-joined, because the desks read the gate as an unrooted parameter.
    expect(join.leafEither, 'two rows touch a desk read at the leaf').toBe(2);
    expect(join.leafRows, 'and none of them on BOTH endpoints').toEqual([]);
    // THE CONSEQUENCE, stated as an executable fact rather than a caution: until a
    // normalisation lands, the clause seat has no licensed row and every modifier at this
    // tip is an `addition` with the empty opener. The measurement is what car 5's arm A2
    // will refuse against.
    const licensed = committed.relations.rows.filter((r) => r.relation === 'tension');
    expect(licensed, 'and no source yields a tension row at all today').toEqual([]);
  });
});

describe('car 0f — the ALIAS DRAFT: measured, nothing ratified, no leaf written', () => {
  test('a shared identifier proposes exactly ONE candidate, and the case reading is what finds it', () => {
    // SITTING §O.2 chartered a MEASUREMENT of what a normalisation between the relation
    // table's PRODUCER TOKENS and the desks' READ PATHS would buy. The draft proposes; it
    // ratifies nothing and writes no leaf.
    const one = aliasDraft({
      endpoints: ['system:food_security'],
      roots: ['eco'],
      paths: ['eco.foodSecurity.label'],
    });
    expect(one.rows.length, 'one endpoint, one root, one candidate').toBe(1);
    expect(one.rows[0], 'carrying the read path that proposed it').toEqual({
      endpoint: 'system:food_security',
      readRoot: 'eco',
      evidence: 'identifier',
      at: 'eco.foodSecurity.label',
      line: 'eco.foodSecurity.label',
    });
    expect(one.noCandidate, 'and nothing is left over').toEqual([]);
    // ⛔ THE CASE READING IS THE WHOLE MATCH, AND HERE IS THE PAIRED NEGATIVE. `food_security`
    // and `foodSecurity` are one identifier under a case- and separator-insensitive reading
    // and two under any other; car 0's LEAF join compared raw segments and reached 0 rows on
    // both endpoints, which is exactly this.
    expect(aliasKey('food_security'), 'the reading that joins them').toBe(aliasKey('foodSecurity'));
    expect('food_security' === 'foodSecurity', 'while the raw tokens are two').toBe(false);
    expect(aliasDraft({
      endpoints: ['system:food_security'], roots: ['eco'], paths: ['eco.grainStore.label'],
    }).rows, 'and a path that shares no segment proposes nothing').toEqual([]);
    // A PAIR IS ONE PROPOSAL however many paths carry it.
    const twice = aliasDraft({
      endpoints: ['system:food_security'],
      roots: ['eco'],
      paths: ['eco.foodSecurity.label', 'eco.foodSecurity.stockpile'],
    });
    expect(twice.rows.length, 'two paths, one pair, one row').toBe(1);
  });

  test('the draft over the SHIPPED endpoints and read paths, with its evidence and its debt', () => {
    const endpoints = [...new Set(committed.relations.rows.flatMap((r) => [r.a, r.b]))];
    /** @type {Set<string>} */
    const roots = new Set();
    /** @type {Set<string>} */
    const paths = new Set();
    for (const row of committedSpines) {
      for (const path of row.reads || []) { roots.add(rootOf(path)); paths.add(path); }
    }
    const draft = aliasDraft({
      endpoints, roots: [...roots], paths: [...paths].sort(), ...draftSources(),
    });
    // THE STRUCTURAL HALF, which no unrelated car can move.
    expect(endpoints.length, 'the relation table\'s endpoints').toBe(89);
    expect(draft.endpointsWithCandidate + draft.noCandidate.length, 'every endpoint is answered once').toBe(89);
    expect(new Set(draft.rows.map((r) => `${r.endpoint}|${r.readRoot}`)).size,
      'one row per pair, never one per citation').toBe(draft.rows.length);
    for (const row of draft.rows) {
      expect(EVIDENCE_ORDER, `${row.endpoint} names an evidence kind from the closed list`).toContain(row.evidence);
      expect(row.at, `${row.endpoint} carries a citation a reader can open`).not.toBe('');
    }
    // 19 AND NOT 15 SINCE SEAM car 3h: four more table labels, four more roots the draft
    // excludes by name rather than offering as a join target.
    expect(draft.syntheticRootsExcluded, 'the instrument\'s own table labels are not join targets').toBe(23); // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 19 -> 20 // W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (19 -> 23)
    // ⭐ THE THREE IDENTIFIER ROWS, which are the draft's whole strength and come from the
    // census's own read paths — including ARCH §5.2's OWN WORKED EDGE, whose gate endpoint
    // the defence desk reads at `settlement.defenseProfile.economicGates.military`.
    const identifiers = draft.rows.filter((r) => r.evidence === 'identifier');
    expect(identifiers.map((r) => `${r.endpoint} -> ${r.readRoot}`)).toEqual([
      'cause:occupation -> war',
      'economicGates.military -> settlement.defenseProfile',
      'system:food_security -> eco',
    ]);
    // ⚠ THE REPORT HALF. These counts read the six composers' docblocks and every file under
    // src/generators/, so a car that edits a generator comment can move them; they are
    // asserted because they are this car's FINDING and a drift should be seen, not because
    // they are structural.
    // ⛔ 7 AND NOT 33 SINCE SEAM car 5b: the `docblock` kind is WITHDRAWN from `rows` and
    // survives as a REPORT channel only (SITTING §P.2-27 EXTENDED; the chair's ruling on car
    // 3h §3h.6 item 2). Twenty-six of the thirty-three candidates rested on a comment line.
    // 7 -> 8 at census-1c unit 2 site 4 (1d64e08ba; measured on archives: 7 at its parent, 8 at
    // it): the stress-secret draw's `factsOf({ npcs: allNpcs, stress: ... })` argument is an AST
    // Property key `stress`, so `system:food_security -> stress` gains a generator-write row at
    // src/generators/npcGenerator.js:780. ⚠ A FINDING, NOT A JOIN: that key builds a fact READ's
    // argument, not a write of world state; the AST cut cannot tell the two apart. Nothing joins
    // on it (the join arm below stays 0).
    // 8 -> 9 at MERGE-R2 (2026-11-07, the integration merge; re-keyed with its cause): the stress-secret draw now carries
    // REVIEW-INTAKE-4's held key inside the census's declared draw on ONE line (src/generators/npcGenerator.js:791,
    // `heldKey: (e) => fillSentenceSlots(e.secret, { …, npc: otherNpc?.name }, …)` beside the `stress:` argument), so
    // `system:food_security -> name` gains a generator-write row there. ⚠ A FINDING, NOT A JOIN, like the 7 -> 8 row above:
    // the key builds a held-text comparison, not a write of world state. Nothing joins on it (the join arm stays 0).
    // 10 -> 13 at W2 DEF's stress-type keys (2026-11-07, the third seat): DS-DEF-3's migration pools read `settlement.stress`
    // inline (W0's direction), a desk read root new to the census, and three generator lines that name an endpoint token
    // beside a `stress` write gain a generator-write row (historyEventStrands.js:42, npcGenerator.js:176, :791). ⚠ FINDINGS,
    // NOT JOINS, like the two rows above; the identifier (ratified) rows are unchanged at three.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 9 -> 10.
    expect(draft.rows.length, 'candidate rows at this tip, docblock withdrawn').toBe(14); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (9 -> 14) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (9 -> 15) // MERGE-WAVE at the W3 POW merge (2026-11-08): measured at the merged tip — 14: W3 POW's new candidate is one the W1/W2 side already proposes, so it counts once (additive would be 15)
    expect(draft.endpointsWithCandidate, 'endpoints with at least one candidate').toBe(4);
    expect(draft.noCandidate.length, 'and the wiring debt the SEAM and WAVE trains inherit').toBe(85);
    expect(draft.docblockReports.length, 'the withdrawn candidates, reported and never proposed').toBe(37); // COHERENCE-AGREE (2026-11-11): 36 -> 37, one docblock of the lane's that names an endpoint token, re-measured at its tip; reported, never proposed // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 28 -> 29 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 29 -> 34 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (28 -> 35) // W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (28 -> 36)
    expect(draft.rows.every((r) => r.evidence !== 'docblock'), 'no row rests on a comment').toBe(true);
    // ⭐ `generator-write` IS AN AST READING NOW (SITTING §P.2-27, cure: the fold's R6). Five of
    // the nine citations the first cut carried were not writes of world state at all — a
    // `reason:` prose string, a comment line, a template string and two arrow parameters of a
    // prose-template table — and all four "would join" rows rested on one of them. The evidence
    // is re-cut to a real Property key or member assignment read from the syntax tree, where a
    // string, a comment and a parameter binding can propose nothing.
    const byEvidence = draft.rows.reduce((m, r) => m.set(r.evidence, (m.get(r.evidence) || 0) + 1), new Map());
    // 4 -> 5 at 1d64e08ba (the npcGenerator.js:780 Property key above). 5 -> 6 at MERGE-R2 (the held key's `name` row above).
    // 6 -> 7 at W2 DEF C1/C2 (2026-11-07): DS-DEF-9's FLAG pools read `safetyProfile.flags`, a new shipped read path, and
    // the AST cut finds one more npcGenerator.js Property key writing toward it. ⚠ A FINDING, NOT A JOIN, like the rows above.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 6 -> 7.
    expect(byEvidence.get('generator-write'), 'the four sound citations survive the AST cut').toBe(11); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 7 -> 10, the three `settlement.stress` findings above // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (6 -> 11) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (6 -> 12) // MERGE-WAVE at the W3 POW merge (2026-11-08): 11 measured, one under the additive 12: W3 POW's flag-read row lands on an npcGenerator.js write the W1/W2 side already counts, so it counts once
    expect(draft.rows.filter((r) => r.evidence === 'generator-write').map((r) => r.at.replace(/:\d+$/, '')).sort(),
      'and each is a real write in a generator').toEqual([
      'src/generators/defenseGenerator.js',
      'src/generators/history/historyEventStrands.js',
      'src/generators/history/historyEventStrands.js', // W2 DEF stress-type keys: a `stress` write toward the new settlement.stress root
      'src/generators/npc/factionLeaderSecret.js',
      'src/generators/npcGenerator.js',
      'src/generators/npcGenerator.js',
      'src/generators/npcGenerator.js', // MERGE-R2: the held key's `name` row (npcGenerator.js:791)
      'src/generators/npcGenerator.js', // W2 DEF C1/C2: one more Property key toward safetyProfile.flags
      'src/generators/npcGenerator.js', // W2 DEF stress-type keys: two Property keys `stress` (npcGenerator.js:176, :791)
      'src/generators/npcGenerator.js',
      'src/generators/npcGenerator.js', // W1 ECO construction (2026-11-07): one more Property key; composed at the W2 DEF merge (MERGE-WAVE)
    ]);
    for (const withdrawn of ['src/generators/structuralValidator.js:588', 'src/generators/stressNarrative.js:80',
      'src/generators/defenseGenerator.js:603', 'src/generators/narrativeText.js:53', // :603 re-derived: generateDefenseProfile's `Disasters & Famine` comment, which EM-R0d shifted -5 from :608
      'src/generators/stressNarrative.js:83']) {
      expect(draft.rows.map((r) => r.at), `${withdrawn} was a comment, a string or an arrow parameter`)
        .not.toContain(withdrawn); // anchored: the four sound citations are asserted above
    }
    /** @type {Set<string>} */
    const proposed = new Set(draft.rows.map((r) => r.endpoint));
    const joined = committed.relations.rows.filter((r) => proposed.has(r.a) && proposed.has(r.b));
    // ⭐⭐ ZERO, AND THAT IS THE WITHDRAWAL'S WHOLE MEASUREMENT. All four rows that "WOULD
    // join" under the draft — `condition:famine -> system:food_security`,
    // `condition:famine -> system:public_legitimacy`, `condition:boom ->
    // system:public_legitimacy` and `signal:occupied -> cause:occupation` — reached BOTH their
    // endpoints only through a docblock candidate. With comments out of the evidence, the
    // draft's own join agrees with the shipped one: car 0's F1 holds at every grade.
    expect(joined.length, 'relation rows that WOULD join under the draft').toBe(0);
    // NON-VACUITY, because a zero is the easiest number for a broken walk to answer: the
    // draft still lands on ONE endpoint of a relation row, so the join is empty by
    // measurement and not because `proposed` went dark.
    const oneEnded = committed.relations.rows.filter((r) => proposed.has(r.a) !== proposed.has(r.b));
    expect(oneEnded.length, 'rows the draft reaches on exactly one endpoint').toBeGreaterThan(0);
    // ⛔ AND NOTHING IS RATIFIED: the shipped join is still zero, and the draft is in no leaf.
    // Anchored on `relations`, a key the committed census DOES carry: a bare exclusion would
    // pass just as happily if the JSON's whole top level drifted away.
    expect(committed.relations.join.strictBoth, 'the shipped join is unmoved').toBe(0);
    expectAbsentWithAnchor(Object.keys(committed), 'aliases', 'relations',
      'the committed census\'s top level');
  });
});

describe('SEAM car 5b — THE HOLDER CENSUS: the source of each construction (SITTING §Q)', () => {
  test('⭐⭐ EVERY MAPPING ROW IS CITED TO A PRODUCER THE TREE STILL CARRIES, and a false one reds', () => {
    // THE TABLE IS A DECLARATION THE GATE CAN CATCH LYING, exactly as `COLUMN_SOURCES` is
    // (`institutionTable.js:121`): each row claims a `file:line` where the estate WRITES the
    // token it maps, and this arm re-derives all of them from a live syntax-tree pass.
    const { cites, files } = producerCitations();
    expect(files, 'the producer walk read the estate, not an empty tree').toBeGreaterThan(1000);
    /** @type {string[]} */
    const stale = [];
    for (const [token, row] of Object.entries(HOLDER_SOURCES)) {
      if (!(cites.get(token) || []).includes(row.cite)) stale.push(`${token} -> ${row.cite}`);
    }
    expect(stale, 'every holder-table citation is a live producer write').toEqual([]);
    // ⛔ THE PLANT, through the SAME reader: a citation to a line that writes nothing is
    // caught. Without it the loop above would pass on an empty `cites` map just as happily.
    expect((cites.get('incomeSources') || []).includes('src/generators/economy/economicState.js:1'),
      'a fabricated line of a real producer file is refused').toBe(false);
    expect((cites.get('thisTokenIsWrittenNowhere') || []).length, 'and an invented token has no citation').toBe(0);
    // ⛔ AND THE SYMBOL FORM (`path :: declaration`, rule 32; LANDING-R2, ODQ §934.105) is held to
    // the same reader: the declaration that WRITES the token resolves, and a real declaration of
    // the same file that does not write it is refused.
    // RE-KEYED 2026-11-08 (ALLEGIANCE-CAR2, J-13), by identity with its cause: the token's ONE writer is the derivation at
    // the coherence seam now (domain/people/hallCapture.js :: writeHallCapture); the power step writes it no longer, and
    // its own module's reader `hallCaptureOf` is the real symbol that does not write it.
    expect((cites.get('criminalCaptureState') || []).includes('src/domain/people/hallCapture.js :: writeHallCapture'),
      'the symbol that writes the token resolves').toBe(true);
    expect((cites.get('criminalCaptureState') || []).includes('src/domain/people/hallCapture.js :: hallCaptureOf'),
      'a real symbol that does not write it is refused').toBe(false);
    expect((cites.get('criminalCaptureState') || []).includes('src/generators/power/rulingStructure.js :: generatePowerStructure'),
      'and the retired birth writer resolves no longer').toBe(false);
  });

  test('the COLUMN_SOURCES arms convict this roster too: every kind is fully cited or names its gaps', () => {
    for (const kind of HOLDER_KINDS) {
      const rows = Object.values(HOLDER_SOURCES).filter((r) => r.kind === kind);
      if (rows.length === 0) {
        expect(sourcesAllCited(kind), `${kind} maps no field, so it is not "all cited"`).toBe(false);
        continue;
      }
      expect(sourcesAllCited(kind), `${kind} is fully cited`).toBe(true);
      expect(uncitedSourcesOf(kind), `${kind} names no uncited row`).toEqual([]);
    }
    // THE TWO KINDS THAT MAP NO FIELD AT THIS TIP, named rather than left to be noticed.
    const unmapped = HOLDER_KINDS.filter((k) => !Object.values(HOLDER_SOURCES).some((r) => r.kind === k));
    expect(unmapped, 'kinds no census field resolves to').toEqual(['census', 'tradition']);
  });

  test('⭐ THE RECORD-SERVICE LISTS ARE THE SHIPPED ROSTER\'S OWN WORDS, re-measured here', () => {
    /** @type {Set<string>} */
    const shipped = new Set();
    for (const services of Object.values(INSTITUTION_SERVICES)) {
      for (const name of Object.keys(services)) shipped.add(name);
    }
    expect(shipped.size, 'the service catalog is read, not an empty object').toBeGreaterThan(500);
    /** @type {string[]} */
    const invented = [];
    for (const record of HOLDER_RECORDS) {
      for (const service of record.services) if (!shipped.has(service)) invented.push(`${record.kind}: ${service}`);
    }
    expect(invented, 'no kind claims a service name the catalog does not carry').toEqual([]);
    // ⭐ `rosterBacked` AND `dutyNamed` ARE RE-DERIVED, never believed. A kind is backed when
    // some institution of the shipped roster offers one of its record services; `dutyNamed`
    // is the estate's one duty regex counted over the same list.
    for (const record of HOLDER_RECORDS) {
      const kind = record.kind;
      const backers = Object.entries(INSTITUTION_SERVICES)
        .filter(([, services]) => Object.keys(services).some((n) => record.services.includes(n)))
        .map(([inst]) => inst);
      expect(backers.length > 0, `${kind} declares rosterBacked ${record.rosterBacked}`).toBe(record.rosterBacked);
      expect(record.services.filter((n) => DUTY_SERVICE_KINDS.test(n)).length,
        `${kind} declares dutyNamed ${record.dutyNamed}`).toBe(record.dutyNamed);
    }
    // ⛔ THE WIRING DEBT THE WAVE INHERITS, as an exact list rather than a count nobody reads.
    const summary = sourceSummary(spines);
    expect(summary.kindsWithNoInstitution, 'holder kinds with NO institution in the shipped roster')
      .toEqual(['tradition']);
    // ⭐⭐ THE HEADLINE COUNTS AS INTEGERS (SITTING §R c-19; the schema lens's finding). They
    // were `console.log`'d beside an assertion on `kindsWithNoInstitution` alone, while the
    // sitting sizes the authoring wave from all six. The byte interlock stops them moving in a
    // green tree — but it cannot stop them moving THROUGH a register door with no arm naming
    // the move, which is exactly what car 5c's two pre-ruled row moves are. The idiom is
    // DS-DEF-2's own (13 / 13 / 66 have been pinned since car 5b); it was simply not applied
    // to the corpus totals.
    //
    // ⚠ MEASURED AT CAR 5c, AFTER THE CAPTURE STANDING LANDED, AND THEY DID NOT MOVE. These
    // are SOURCE counts — which record-holder kind a row's fields resolve to — and the capture
    // standing is a TOWN standing that no register row can carry. The rule moved 40 rows'
    // `stateOrgan` and not one row's `standing`, so 114 / 3 / 591 and 191 / 5 / 415 are the
    // same integers car 5b measured, now held.
    // 113 / 592 AND NOT 114 / 591 SINCE LANE DEFENSE's 0b2548de5: ONE row, DS-GEN-6 :: isolated,
    // moved LICENSED -> SOURCE-UNRESOLVED. The census resolves it through
    // `supplyLogisticsPoolKey` (a literal-rung collision with that function's 'isolated'), whose
    // third argument was the Defense desk's `settlement.config.tradeRouteAccess` (a toll-bar
    // field). The desk no longer calls it, so the read is the bare `tradeAccess`, and no mapping
    // row resolves it. Traced by lane DEFENSE-2 against the register at da2040ddb.
    expect(summary.rows, 'ROWS by source standing').toEqual({
      // 114 -> 120 LICENSED at WIRING W3 (2026-11-07): six of the eight C1-C6 rows resolve a source.
      // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): LICENSED 132 -> 131, DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28).
      LICENSED: 131, OFFICE: 3, 'SOURCE-UNRESOLVED': 722, // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 592 -> 596 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): the gates and charter-hall FIXTURE rows' forces.* reads are muster-sourced, 116 -> 118; the free company's reads no mapping row names, 596 -> 597 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): the six ARCANE rows, 597 -> 603 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 603 -> 608 (the five DS-DEF-12 pools) // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): LICENSED 118 -> 120 (the two force pools resolve their holder through the force guard), SOURCE-UNRESOLVED 608 -> 610 (the two food pools) // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): LICENSED 120 -> 122, SOURCE-UNRESOLVED 610 -> 641: the thirty-three new pools // MERGE-WAVE at the W2 DEF merge (2026-11-08): measured at the merged tip — W1 ECO's rows (118 / 614 on its side) composed with W2 DEF's (122 / 641) over the base's 114 / 592: LICENSED 126 = 114 + 4 + 8, SOURCE-UNRESOLVED 663 = 592 + 22 + 49, additive // MERGE-WAVE at the W3 POW merge (2026-11-08): W3 POW's +6 / +2 over 114 / 592, additive (132 / 665) // MERGE-WAVE at the W4 PEOPLE merge (2026-11-08): W4 PEOPLE's +0 / +52 over 114 / 592, additive (132 / 717) // MERGE-WAVE at the W5 HIS merge (2026-11-08): W5 HIS's +0 / +5 over 114 / 592, additive (132 / 722)
    });
    // 190 / 416 AND NOT 191 / 415, the same one row: its third field entry was the toll-bar's
    // `settlement.config.tradeRouteAccess` and is now the unresolved `tradeAccess`. The total
    // of 611 below does not move.
    // 419 -> 423 and the ROWS' 592 -> 597 at W5 HIS construction (2026-11-07, ODQ §934.105): DS-GEN-16's five new pools read
    // `history.legacyAnnotations` / `history.siegeNarrative` / `history.currentTensions`, which no source row licenses.
    expect(summary.fields, 'FIELDS by source standing').toEqual({
      // 191 / 419 -> 214 / 421 at WIRING W3 (2026-11-07): the C1-C6 rows' field entries.
      // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): LICENSED 234 -> 233 and SOURCE-UNRESOLVED 850 -> 849, DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28).
      LICENSED: 233, OFFICE: 5, 'SOURCE-UNRESOLVED': 849, // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): the four FIXTURE rows read economicState.compound.inst, which no mapping row names: 419 -> 433 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 196 -> 198 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 433 -> 439 (economicState.compound.inst and the flag, per FIXTURE row) // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 439 -> 486 (the ARCANE rows' container, flag and tradition entries) // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 486 -> 509 (the block's read fields, per pool) // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): LICENSED 198 -> 200 (the force pools' `force` guard), SOURCE-UNRESOLVED 509 -> 513 (the container read on the four CHAIN pools) // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): LICENSED 200 -> 202, SOURCE-UNRESOLVED 513 -> 546 // MERGE-WAVE at the W2 DEF merge (2026-11-08): measured at the merged tip — LICENSED 211 = 191 + 9 + 11, SOURCE-UNRESOLVED 604 = 419 + 58 + 127, additive // MERGE-WAVE at the W3 POW merge (2026-11-08): W3 POW's +23 / +2 over 191 / 419, additive (234 / 606) // MERGE-WAVE at the W4 PEOPLE merge (2026-11-08): W4 PEOPLE's +0 / +239 over 191 / 419, additive (234 / 845) // MERGE-WAVE at the W5 HIS merge (2026-11-08): W5 HIS's +0 / +4 over 191 / 419, additive (234 / 849) // MERGE-WAVE at the W1-A0b merge point (2026-11-08): +1, the merchant-guild pool's commercePoolKey now reads `hasGuild` (5218e6b8d), a read no mapping row names
    });
    expect(Object.values(summary.rows).reduce((a, b) => a + b, 0),
      'and every pool lands in exactly one row standing').toBe(spines.length);
    expect(Object.values(summary.fields).reduce((a, b) => a + b, 0),
      'over this many sourced field entries').toBe(1087); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 620 -> 634 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 634 -> 642 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 642 -> 689 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 689 -> 712 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 712 -> 718 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 718 -> 753 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (615 -> 820) // 615 -> 640 at WIRING W3 (2026-11-07) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (615 -> 845) // W4 PEOPLE 2026-11-07: +7 pools, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (615 -> 1084) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (615 -> 1088) // MERGE-WAVE at the W1-A0b merge point (2026-11-08): +1, the merchant-guild pool's new `hasGuild` read (5218e6b8d) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 1089 -> 1087
    expect(summary.twoSourceRows, 'rows whose fields resolve to more than one kind').toBe(10);
    expect(summary.rowsWithNoReading, 'and rows the census recovered no reading for at all').toBe(368); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (368 -> 368)
    // THE TWO UNRESOLVED GROUNDS STAY APART: a field no mapping row names is a different debt
    // from a kind with no institution behind it, and collapsing them would hide which is which.
    // 416 and toll-bar 12 (not 415 and 13) since lane DEFENSE's 0b2548de5: the same one field
    // entry of DS-GEN-6 :: isolated, traced at 'FIELDS by source standing' above.
    // 419 / 615 AND NOT 417 / 613 SINCE LANDING-7 lane F (R-F1): DS-DEF-9's two `false` pools each
    // gain the field entry `magicAbsent`, which no mapping row names. No row's standing moves.
    // 419 -> 421 at WIRING W3 (2026-11-07): two C1-C6 field entries no mapping row names.
    expect(summary.unresolvedGrounds).toEqual({ 'no-mapping': 849, 'no-institution-in-roster': 0 }); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): no-mapping 850 -> 849, DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28) // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 419 -> 433, the same fourteen field entries // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 433 -> 439 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 439 -> 486 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 486 -> 509, the same fields as the standing count above // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 509 -> 513, the same four field entries // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 513 -> 546, the same field entries // MERGE-WAVE at the W2 DEF merge (2026-11-08): 419 + 58 + 127, additive (604) // MERGE-WAVE at the W3 POW merge (2026-11-08): W3 POW's +2, additive (606) // W4 PEOPLE 2026-11-07: +14 field entries, the faith and great-house construction (readings.faithFlags.*, readings.inst.hasCathedral/hasMonastery), which no mapping row names; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (419 -> 845) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (419 -> 849) // MERGE-WAVE at the W1-A0b merge point (2026-11-08): +1, the merchant-guild pool's commercePoolKey now reads `hasGuild` (5218e6b8d), a read no mapping row names
    expect(summary.byKind, 'the licensed field count per kind').toEqual([
      // watch 9 -> 14 at W2 DEF C1/C2 (2026-11-07): DS-DEF-9's FLAG pools read `safetyProfile.flags`, licensed by the watch.
      // MERGE-WAVE at the W2 DEF merge (2026-11-08): watch 9 + 9 (W1 ECO's DS-ECO-6 lenses) + 7 (W2 DEF) = 25, additive; it
      // now ranks third.
      // watch 9 -> 32 at WIRING W3 (2026-11-07): the C1-C6 safety-flag fields are the watch's.
      // MERGE-WAVE at the W3 POW merge (2026-11-08): watch 25 + 23 (W3 POW's C1-C6 safety-flag fields) = 48, additive.
      // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): treasury 22 -> 21, DS-GEN-11's vouching zero pool leaves (3e9de356e,
      // B·#28); tied with the court at 21, the court ranks first by the summary's own order.
      ['muster', 66], ['market', 49], ['watch', 48], ['court', 21], ['treasury', 21], // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): the two forces.*.present guards, 62 -> 64 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): muster 64 -> 66, the force guard on the two CHAIN force pools // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): watch 14 -> 16, the two DS-DEF-3 migration pools' safetyLabel read (the watch holds the safety record)
      ['toll-bar', 12], ['road', 7], ['elders', 5], ['office', 5], ['parish', 4],
    ]);
    expect(summary.byKind.reduce((n, [, k]) => n + k, 0),
      'which must account for every licensed and office field').toBe(summary.fields.LICENSED + summary.fields.OFFICE);
    console.log(`\nSEAM 5b · THE HOLDER CENSUS on the shipped corpus`
      + `\n  ROWS      LICENSED ${summary.rows.LICENSED} · OFFICE ${summary.rows.OFFICE}`
      + ` · SOURCE-UNRESOLVED ${summary.rows['SOURCE-UNRESOLVED']} of ${spines.length}`
      + ` (two-source ${summary.twoSourceRows}; ${summary.rowsWithNoReading} read nothing at all)`
      + `\n  FIELDS    LICENSED ${summary.fields.LICENSED} · OFFICE ${summary.fields.OFFICE}`
      + ` · SOURCE-UNRESOLVED ${summary.fields['SOURCE-UNRESOLVED']}`
      + ` (no mapping ${summary.unresolvedGrounds['no-mapping']},`
      + ` no institution ${summary.unresolvedGrounds['no-institution-in-roster']})`
      + `\n  by KIND   ${summary.byKind.map(([k, n]) => `${k} ${n}`).join(' · ')}`
      + `\n  the table ${holderCensus().map((h) => `${h.kind} ${h.fields}`).join(' · ')}\n`);
  });

  // ── THE CAPTURE STANDING (SITTING §R c-22, correcting the seam fold's P7) ────────────
  //
  // Car 5b reported capture "structurally absent at birth" and measured INTERESTED at 0 over
  // all 768 RATE towns. THE FIGURE WAS RIGHT AND THE GROUND WAS FALSE: every generated town
  // carries `powerStructure.criminalCaptureState` (rulingStructure.js :: generatePowerStructure — the write the
  // holder table maps to the WATCH), on the same five-rung ladder `standingOf` consumes,
  // reading none 495 · adversarial 194 · equilibrium 64 · corrupted 15 over the corpus. The
  // car reported the fact ABSENT rather than asking whether it licenses a per-institution
  // standing. The chair ruled that it licenses one for the STATE'S OWN ORGANS and for nothing
  // else, and these arms are that rule, driven on REAL towns rather than on synthetics.
  //
  // ⚠ TWO NAMED TOWNS, NOT SAMPLED. Both are rateGrid specs, quoted with their seeds so the
  // arm reproduces from the file alone. `CAPTURED_TOWN` is the first grid town whose ruling
  // structure is captured and which keeps a licensed state-organ record; `CLEAN_TOWN` is the
  // first whose capture reads `none` while it still keeps those records, so a rule that
  // marked everything would red here rather than passing quietly.
  const CAPTURED_TOWN = Object.freeze({
    config: {
      settType: 'city',
      tradeRouteAccess: 'random_trade',
      monsterThreat: 'random_threat',
      culture: 'norse',
      terrainOverride: 'coastal',
    },
    seed: 'rate-4-0',
  });
  const CLEAN_TOWN = Object.freeze({
    config: {
      settType: 'town',
      tradeRouteAccess: 'random_trade',
      monsterThreat: 'random_threat',
      culture: 'arabic',
      terrainOverride: 'riverside',
    },
    seed: 'rate-3-0',
  });
  const townOf = (spec) => generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} });

  test('⭐⭐ THE CAPTURE STANDING — the reader is typed, both fields, and it never infers', () => {
    expect(STATE_ORGAN_KINDS, 'the state\'s own organs, and only these four')
      .toEqual(['office', 'court', 'treasury', 'watch']);
    for (const kind of STATE_ORGAN_KINDS) {
      expect(HOLDER_KINDS, `${kind} must be a holder kind`).toContain(kind);
    }
    // ABSENT IS ABSENT. A settlement carrying neither field answers null on both and `false`
    // on the rollup, and the standing reports the absence rather than reading a `false`.
    expect(capturedRulingStructure({})).toEqual({ criminal: null, faction: null, captured: false });
    expect(capturedRulingStructure({ powerStructure: {} })).toEqual({ criminal: null, faction: null, captured: false });
    // THE LADDER, rung by rung. `none` is not a capture; every other rung is.
    expect(capturedRulingStructure({ powerStructure: { criminalCaptureState: 'none' } }).captured).toBe(false);
    for (const rung of ['adversarial', 'equilibrium', 'corrupted', 'capture']) {
      expect(capturedRulingStructure({ powerStructure: { criminalCaptureState: rung } }).captured,
        `${rung} is a capture arc`).toBe(true);
    }
    // AND THE FACTION FIELD IS THE SECOND READER, on its own.
    const byFaction = capturedRulingStructure({
      powerStructure: { criminalCaptureState: 'none', factions: [{ captureState: 'none' }, { captureState: 'corrupted' }] },
    });
    expect(byFaction).toEqual({ criminal: 'none', faction: 'corrupted', captured: true });
  });

  test('⭐⭐ A CAPTURED RULING STRUCTURE MAKES THE STATE ORGANS INTERESTED, AND NO OTHER KIND', () => {
    const town = townOf(CAPTURED_TOWN);
    expect(capturedRulingStructure(town).criminal,
      'the named town\'s ruling structure is on the capture arc').toBe('adversarial');
    const licensed = spines.filter((row) => row.source.standing === 'LICENSED');
    const interested = licensed.filter((row) => sourceOfForTown(row, town).standing === 'INTERESTED');
    // ⛔ THE GATE, AND IT IS THE WHOLE RULING: not one row without a state organ among its
    // kinds is interested, on a town whose ruling structure IS captured.
    expect(licensed.filter((row) => !row.source.stateOrgan
      && sourceOfForTown(row, town).standing === 'INTERESTED')).toEqual([]);
    expect(interested.every((row) => row.source.stateOrgan === true),
      'every interested row names a state organ').toBe(true);
    // 16 -> 23 on 2026-09-30 (the urban band, ODQ §934.86): the city's complete block seats more
    // institutions that keep a state organ's record, so more licensed rows find a holder here.
    // 23 -> 16 at the F6 BUDGET-FLOOR stage (6d84aa834, the lane's bf3d1258e "the target gives
    // way"), bisected by first-parent stage of the rung-1 window (LANDING-7): the stage re-draws
    // this city's roster (65 -> 63 institutions), and the Professional city watch, still seated,
    // no longer instantiates its one record service ('Crime reporting'), so the WATCH kind has no
    // holder here. The seven rows that leave are exactly the watch's: DS-DEF-5 (watch PRESENT;
    // NO organized force at all), DS-ECO-6's three off-book TIER rows and DS-POW-6's two
    // capture-reached rows. No row was gained; the gate above is unmoved.
    expect(interested.length, 'the licensed rows this captured city makes interested').toBe(16);
    // THE MARK NAMES ITS GROUND rather than asserting a standing nobody can trace.
    const one = sourceOfForTown(interested[0], town);
    expect(one.standing).toBe('INTERESTED');
    expect(one.marks.join(' | ')).toMatch(/captured-at-birth \(criminalCaptureState adversarial\)/);
    // ⛔ NON-VACUITY 1 — THE PRE-5c READING, on the same town and the same rows. `standingOf`
    // without a KIND does not read the ruling structure at all, so a harness that forgot to
    // pass the kind would measure zero and call the rule dead.
    for (const holder of one.holders) {
      const blind = standingOf(holder, town, {});
      expect(blind.interested, 'no kind named means the birth capture is not read').toBe(false);
      expect(blind.capturedAtBirth).toBe(null);
      expect(blind.absent.join(' | ')).toMatch(/captured-at-birth \(the caller named no kind/);
      // AND THE KIND-GATED REFUSAL IS PRINTED, not silent, for a kind outside the four.
      expect(standingOf(holder, town, {}, 'market').absent.join(' | '))
        .toMatch(/market is not one of the state's own organs/);
      expect(standingOf(holder, town, {}, 'market').interested).toBe(false);
    }
    // ⛔ NON-VACUITY 2 — A TOWN THAT IS NOT CAPTURED, which still KEEPS these records. A rule
    // that marked every holder of a state organ would red here.
    const clean = townOf(CLEAN_TOWN);
    expect(capturedRulingStructure(clean).captured, 'the clean town is not on the arc').toBe(false);
    const held = licensed.filter((row) => sourceOfForTown(row, clean).holder !== null);
    // 61 AND NOT 62 SINCE LANE DEFENSE's 0b2548de5: the one licensed row that left
    // (DS-GEN-6 :: isolated, see 'ROWS by source standing') was one this town held, through its
    // toll-bar. No other licensed row changed its source. Traced by lane DEFENSE-2.
    // 66 AND NOT 61 SINCE the rung1-pins stage (37b1e746d, lane/rung1-pins at fa95f69d4),
    // bisected by first-parent stage of the rung-1 window (LANDING-7): the five DS-GEN-9
    // 'recency framing' rows (Recent · Living memory · Last century · Ancient · Deep history)
    // find a holder in this town, and no row left. The window passed through 50 between the X-46
    // car 3 stage (6ca454d2b) and the F6 BUDGET-FLOOR stage (6d84aa834), which restored exactly
    // the rung1-pins row set; the tip's 66 rows are that set, row for row.
    // 61 AND NOT 66 SINCE THE MERGE OF THE REVIEW-INTAKE LANE ONTO RUNG 1's TIP (REVIEW-INTAKE-LAND,
    // 2026-11-07), one cause, "a proxy is not a provider": at 77bfd3535 this town's renamed
    // 'Housing (75-650 households)' had no menu of its own and fuzzy-borrowed one ('Record of
    // custom', 'Dispute mediation'), which held the five DS-GEN-9 recency rows; it now rolls its
    // own one row ('Lodging (rooms to let)'), so those five leave, and the forked service stream
    // costs the Town hall its 'Tax payment', so the treasury rows (DS-DEF-8 ×2, DS-ECO-12 ×5,
    // DS-GEN-11 ×5, DS-GEN-3 ×2) are held by the Weekly market instead — same count. No row gained.
    expect(held.length, 'and it really does keep the records').toBe(60); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 61 -> 60
    expect(licensed.filter((row) => sourceOfForTown(row, clean).standing === 'INTERESTED')).toEqual([]);
  });

  test('the `stateOrgan` column names the rows a captured town can move, and only those', () => {
    const flagged = spines.filter((row) => row.source.stateOrgan === true);
    // The register knows no town, so its `standing` can never read INTERESTED. What it CAN
    // say is which rows the rule reaches, and it says it on the affected rows only.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 40 -> 46.
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 37 -> 43.
    expect(flagged.length, 'rows a captured ruling structure can make interested').toBe(53); // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 54 -> 53 // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 42 -> 44 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (40 -> 48) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (40 -> 54)
    expect(flagged.filter((row) => row.source.standing === 'LICENSED').length).toBe(50); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 39 -> 41 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (37 -> 45) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (37 -> 51) // STYLE-2-MERGE at the SW-B2 merge (2026-11-09): DS-GEN-11's vouching zero pool leaves (3e9de356e, B·#28): 51 -> 50
    expect(flagged.filter((row) => row.source.standing === 'OFFICE').length).toBe(3);
    // RE-DERIVED, never read: the flag is exactly `kinds names a state organ`.
    const wrong = census.rows.filter((row) => {
      const kinds = row.source.kinds.length ? row.source.kinds : [row.source.kind].filter(Boolean);
      const organ = kinds.some((kind) => STATE_ORGAN_KINDS.includes(kind));
      return organ !== (row.source.stateOrgan === true);
    }).map((row) => `${row.block} :: ${row.pool}`);
    expect(wrong, 'the column must equal its own definition').toEqual([]);
    // ABSENT IS THE ANSWER `no`, the `readsCount` idiom: no row carries `stateOrgan: false`.
    expect(census.rows.filter((row) => row.source.stateOrgan === false)).toEqual([]);
    // WIRING W3 (2026-11-07), C1-C6 said in DS-POW-5/-6 (+8 pools, +19 variants): 669 -> 671.
    expect(spines.length - flagged.length, 'and the rest carry no key at all').toBe(803); // W1 ECO construction (2026-11-07): 26 new pools (14 generation facts said; DS-SUP-2 mounted). // W2 DEF C7 (DS-DEF-4 FIXTURE pools, 2026-11-07): 669 -> 673 // W2 DEF C9 (DS-DEF-5 FIXTURE pools, 2026-11-07): 673 -> 676 // W2 DEF C8/C10 (DS-DEF-5 ARCANE pools, 2026-11-07): 676 -> 682 // W2 DEF C3–C5 (DS-DEF-12, 2026-11-07): 682 -> 687 // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 687 -> 691 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 691 -> 724 // W2 DEF stress-type keys (DS-DEF-3/-8, 2026-11-07): 724 -> 722 // MERGE-WAVE at the W2 DEF merge: both lanes' deltas composed (669 -> 744) // MERGE-WAVE at the W3 POW merge: both lanes' deltas composed (669 -> 746) // W4 PEOPLE 2026-11-07: +7 pools/+18 variants, the faith and great-house construction; W4 PEOPLE second seat 2026-11-07: re-measured, DS-CND-1 the stress type in the pool key (+45 pools/+128 variants) // MERGE-WAVE at the W4 PEOPLE merge: both lanes' deltas composed (669 -> 798) // MERGE-WAVE at the W5 HIS merge: both lanes' deltas composed (669 -> 803)
  });

  test('⭐⭐ A TABLED KEY FUNCTION RESOLVES THROUGH THE TABLE\'S OWN FIELDS — A0b\'s blindness is NOT inherited', () => {
    // ⛔ THE FINDING THIS ARM CLOSES (SEAM car 5, §5.8 item 1; the chair's ruling 4 on car 5).
    // Rung 3 writes `"<reader> (via <TABLE> in <file>)"` as the row's whole reading, so arm A0b
    // declares itself NOT-EXECUTABLE on DS-DEF-2 — the very block ARCH §6.4 works its example
    // on. The source column reads the TABLE'S FIELDS instead, so the same 22 rows answer.
    expect(tableFieldsOf('invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)'))
      .toEqual(['walls', 'garrison', 'militia']);
    expect(tableFieldsOf('text(terrainKey) (via TERRAIN_POOL_BY_KEY in economyStateProse.js)'),
      'the wrapper call name is not a field').toEqual(['terrainKey']);
    expect(tableFieldsOf('text(model?.mandate?.phrase) (via MANDATE_POOL_BY_PHRASE in warFaithStateProse.js)'))
      .toEqual(['model', 'mandate', 'phrase']);
    expect(tableFieldsOf('first (via STABILITY_LADDER in powerStateProse.js)'),
      'a bare identifier reader is its own field').toEqual(['first']);
    expect(tableFieldsOf('eco.foodSecurity.stockpile'), 'a plain path passes through whole')
      .toEqual(['eco.foodSecurity.stockpile']);
    expect(tableFieldsOf(''), 'and nothing answers nothing').toEqual([]);
    // THE SHIPPED BLOCK, ROW BY ROW: 26 pools, every one of them sourced through real fields.
    const defTwo = spines.filter((r) => r.block === 'DS-DEF-2');
    expect(defTwo.length, 'DS-DEF-2 carries this many pools').toBe(30); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 26 -> 30
    const standings = defTwo.reduce((m, r) => m.set(r.source.standing, (m.get(r.source.standing) || 0) + 1), new Map());
    expect(standings.get('LICENSED'), 'the invasion and beast rows resolve their holder').toBe(15); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 13 -> 15, the two CHAIN force pools beside the invasion row
    expect(standings.get('SOURCE-UNRESOLVED'), 'the internal, economic and disaster rows do not').toBe(15); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 13 -> 15, the two CHAIN food pools beside the economic row
    let sourcedFields = 0;
    for (const row of defTwo) {
      for (const field of Object.keys(row.source.fields)) {
        sourcedFields += 1;
        // anchored: the collection cannot have drifted away — `sourcedFields` is asserted at its exact count below
        expect(field, `${row.pool} sources a real field and never an instrument label`).not.toContain('(via ');
      }
    }
    expect(sourcedFields, 'and the walk actually saw the block\'s whole field set, not an empty one').toBe(72); // W2 DEF C6 (DS-DEF-2 CHAIN clauses, 2026-11-07): 66 -> 72
    const invasion = defTwo.find((r) => r.pool === 'Invasion & War: walls with citizen militia');
    expect(invasion.source.fields, 'the three fields ARCH §4.4 names, each with its holder').toEqual({
      walls: 'muster', garrison: 'muster', militia: 'muster',
    });
  });

  test('the FIRST HOP is most-specific-first, and a field no row names is UNRESOLVED, never guessed', () => {
    expect(holderKindOfField('forces.garrison.present').kind, '`present` names no row, `garrison` does').toBe('muster');
    expect(holderKindOfField('forces.garrison.present').token).toBe('garrison');
    expect(holderKindOfField('settlement.defenseProfile.economicGates.military').token,
      'and `military` names none, so `economicGates` answers').toBe('economicGates');
    expect(holderKindOfField('legitimacy.breakdown').kind, 'the legitimacy breakdown is the court\'s').toBe('court');
    expect(holderKindOfField('condition.severity'), 'a field no row names answers nothing').toBe(null);
    expect(fieldSourceOf('condition.severity').reason).toBe(FIELD_REASONS.NO_MAPPING);
    expect(fieldSourceOf('structuralViolations').standing, 'the record\'s own audit is the OFFICE\'s').toBe('OFFICE');
    expect(fieldSourceOf('structuralViolations').reason).toBe(FIELD_REASONS.OFFICE);
    expect(fieldSourceOf('forces.walls.present').standing).toBe('LICENSED');
    // THE FOURTH REASON, driven on a table whose kind has no institution behind it.
    const unbacked = { someField: { kind: 'tradition', cite: 'fixture:1', read: true } };
    expect(fieldSourceOf('a.someField', unbacked).standing).toBe('SOURCE-UNRESOLVED');
    expect(fieldSourceOf('a.someField', unbacked).reason).toBe(FIELD_REASONS.NO_INSTITUTION);
  });

  test('⛔ THE PLANT: a table that maps every field to the OFFICE reds — the office does not keep the muster', () => {
    const musterRow = { reads: ['forces.walls.present', 'forces.garrison.present'] };
    const honest = sourceOfRow(musterRow);
    expect(honest.standing, 'the shipped table licenses a muster holder').toBe('LICENSED');
    expect(honest.kind).toBe('muster');
    expect(honest.holder, 'and the register names no institution, because a register is not a town').toBe(null);
    expect(honest.holderReason).toBe(HOLDER_REASONS.TOWN);
    // THE PLANTED TABLE: every token of the shipped roster re-pointed at the office.
    const allOffice = Object.fromEntries(Object.entries(HOLDER_SOURCES)
      .map(([token, row]) => [token, { ...row, kind: 'office' }]));
    const planted = sourceOfRow(musterRow, allOffice);
    expect(planted.standing, 'and the plant makes the muster the office\'s own books').toBe('OFFICE');
    expect(planted.kind).toBe('office');
    expect(planted.standing).not.toBe(honest.standing);
    // AND THE STRONGEST-WINS RULE, with its own control: one licensed field among unresolved
    // ones still licenses a citation, because a citation names ONE holder (arm A13's question).
    const mixed = sourceOfRow({ reads: ['condition.severity', 'forces.walls.present'] });
    expect(mixed.standing, 'one licensed reading licenses the row').toBe('LICENSED');
    expect(sourceOfRow({ reads: ['condition.severity'] }).standing, 'and none licenses none')
      .toBe('SOURCE-UNRESOLVED');
    expect(sourceOfRow({ reads: [] }).holderReason, 'a row that reads nothing says so')
      .toBe(HOLDER_REASONS.UNRESOLVED);
    // A TWO-SOURCE FACT is counted as one, and named as two.
    const two = sourceOfRow({ reads: ['forces.walls.present', 'eco.incomeSources'] });
    expect(two.twoSource).toBe(true);
    expect(two.kinds).toEqual(['muster', 'treasury']);
  });

  test('⭐ THE SECOND HOP resolves a KIND to THIS TOWN\'S institution, and to null WITH ITS REASON', () => {
    const town = {
      institutions: [{ name: 'Parish burial grounds' }, { name: 'Town watch' }],
      availableServices: {
        Religious: [{ name: 'Register of the dead', institution: 'Parish burial grounds' }],
        Defense: [{ name: 'Night patrol', institution: 'Town watch' }],
      },
    };
    expect(holdersOf('parish', town), 'the keeper of the dead').toEqual(['Parish burial grounds']);
    expect(holdersOf('watch', town), 'a night patrol keeps no record').toEqual([]);
    expect(holdersOf('tradition', town), 'and the kind with no service list holds nothing').toEqual([]);
    const sourced = sourceOfForTown({ reads: ['faith.piety.trend'] }, town);
    expect(sourced.kind).toBe('parish');
    expect(sourced.holder, 'THIS town\'s institution, named').toBe('Parish burial grounds');
    expect(sourced.standing, 'and it is not a power here').toBe('LICENSED');
    // ⛔ A LICENSED KIND WITH NO INSTITUTION IN THIS TOWN IS `holder: null` WITH THE REASON.
    const bare = sourceOfForTown({ reads: ['faith.piety.trend'] }, { institutions: [], availableServices: {} });
    expect(bare.holder).toBe(null);
    expect(bare.absent, 'the gap is named, never inferred').toEqual([
      'holder (this town instantiates no institution that keeps this record)',
    ]);
    expect(sourceOfForTown({ reads: ['condition.severity'] }, town).standing).toBe('SOURCE-UNRESOLVED');
  });

  test('⭐ STANDING IS TYPED FACTS ONLY, and the facts the engine does not hold are printed ABSENT', () => {
    const town = {
      institutions: [
        { name: 'Town watch', impairments: [{ type: 'corruption' }] },
        { name: 'Parish church', impairments: [] },
      ],
    };
    const bought = standingOf('Town watch', town, { compromised: { covert: ['Town watch'], revealed: [] } });
    expect(bought.corrupt, 'a covert stooge in the watch').toBe(true);
    expect(bought.interested, 'so the holder is a power with an interest').toBe(true);
    expect(bought.marks).toContain('corrupt');
    const clean = standingOf('Parish church', town, { compromised: { covert: [], revealed: [] } });
    expect(clean.interested, 'and the clean control is not interested').toBe(false);
    // ⛔ THE ABSENCES ARE NAMED WITH THE READER THAT WOULD HOLD THEM, so a reader knows the
    // difference between "not captured" and "the engine holds no capture fact for this town".
    expect(clean.captured, 'no faction states: absent, never false').toBe(null);
    expect(clean.controlled, 'no world state: absent, never false').toBe(null);
    expect(clean.capturedAtBirth, 'and no KIND was named, so the ruling structure was not read').toBe(null);
    // THREE ABSENCES, NOT TWO, SINCE SEAM CAR 5c. The third is the birth-time capture, and it
    // is absent here for a REASON OF THE CALL rather than of the town: this call names no
    // kind, and SITTING §R c-22 reads the ruling structure for the state's own organs only.
    // Two of the three name the worldPulse reader that would hold them; the third names the
    // rule instead, which is the honest citation for a refusal by rule.
    expect(clean.absent.length).toBe(3);
    expect(clean.absent.filter((gap) => /worldPulse\//.test(gap)).length).toBe(2);
    expect(clean.absent.filter((gap) => /^captured-at-birth/.test(gap)).length).toBe(1);
    // AND WHEN THE CALLER DOES HOLD THEM, they read.
    const captured = standingOf('Town watch', town, { captureState: 'capture', patron: 'the Salters' }, 'watch');
    expect(captured.captured).toBe(true);
    expect(captured.controlled).toBe(true);
    // The fixture town carries no `powerStructure`, so the birth fact is absent FOR THE TOWN
    // even though the kind is a state organ — and the two absences say which is which.
    expect(captured.capturedAtBirth, 'this fixture holds no ruling structure at all').toBe(null);
    expect(captured.absent).toEqual([
      'captured-at-birth (this settlement carries no powerStructure.criminalCaptureState and no faction captureState)',
    ]);
    // ⛔ AND THE KIND GATE, ON THE SAME CALL: give the town a captured ruling structure and a
    // state organ reads it; the same town asked about the MARKET does not.
    const underCapture = { ...town, powerStructure: { criminalCaptureState: 'corrupted' } };
    expect(standingOf('Parish church', underCapture, {}, 'court').capturedAtBirth,
      'a court sits under the captured power').toBe(true);
    expect(standingOf('Parish church', underCapture, {}, 'court').interested).toBe(true);
    expect(standingOf('Parish church', underCapture, {}, 'market').capturedAtBirth,
      'a market keeps its own books').toBe(null);
    expect(standingOf('Parish church', underCapture, {}, 'market').interested).toBe(false);
    // ⛔ AND A HOLDER IS AN INSTITUTION, NEVER A NAMED PERSON: the reason is the institution
    // table's own hardcoded null, which this table inherits rather than works around.
    expect(HOLDER_KINDS.includes('holderRole'), 'no kind is a person').toBe(false);
  });

  test('⭐ THE DRY READ: both modes, and the one that writes is not among them', () => {
    // ⛔ THE HAZARD (SEAM car 5, §5.8 item 3): the script had four modes and none could answer
    // "what would change?" without writing the committed register. Car 5 ran that write by
    // accident doing exactly this. `--dry` is a pure comparison, so this arm drives it.
    const text = readFileSync(CENSUS_JSON, 'utf8');
    const current = censusDry(text, committed);
    expect(current.ok, 'the committed register is current at this tip').toBe(true);
    expect(current.rowsMoved, 'and no row would move').toBe(0);
    expect(current.sections, 'and no section would move').toEqual([]);
    expect(current.bytes.committed, 'the byte reading is the file\'s own length')
      .toBe(Buffer.byteLength(text, 'utf8'));
    // THE STALE LIMB, driven on a doctored copy so no committed byte is touched.
    const moved = JSON.parse(text);
    moved.rows[0].source = { ...moved.rows[0].source, standing: 'OFFICE' };
    const stale = censusDry(serialise(moved), committed);
    expect(stale.ok).toBe(false);
    expect(stale.rowsMoved, 'exactly the row that moved').toBe(1);
    expect(stale.rowExamples).toEqual([`${committed.rows[0].block} :: ${committed.rows[0].pool}`]);
    expect(stale.sections).toContain('rows');
    // AND THE TWO MODES AGREE: `--check` and `--dry` answer the same question, one by throwing
    // and one by reporting, so a lane can read the register without taking the door.
    expect(censusCheck(text, committed).ok).toBe(current.ok);
    expect(censusCheck(serialise(moved), committed).ok).toBe(stale.ok);
  });

  test('⛔⛔ THE INSTRUMENT MINTS NO PRODUCER TOKEN A DESK READS — the defect this car caused and cured', () => {
    // ⛔ MEASURED, NOT FEARED. The producer index reads every object-literal key under
    // `src/domain/**` as a WRITE of world state (car 3f-0's rule, from the other side). The
    // first cut of `holderTable.js` keyed its record table on the KIND, so `court`, `elders`,
    // `parish` and `toll-bar` entered the estate's produced set on the strength of an
    // instrument naming them, and FOUR DS-DEF-2 rows moved their `absent` label from
    // `not-produced` to `measured` because the defence desk reads a field called `court`.
    // The table is an ARRAY of rows now and the kind is a VALUE, so nothing is minted.
    const { writes } = astTokens(readFileSync(join(ROOT, 'src/domain/prose/holderTable.js'), 'utf8'));
    expect(writes.length, 'the module was parsed, not skipped').toBeGreaterThan(50);
    const { cites } = producerCitations();
    const own = 'src/domain/prose/holderTable.js';
    const minted = [...new Set(writes.map((w) => w.name))]
      .filter((token) => (cites.get(token) || []).every((c) => c.startsWith(own))).sort();
    /** @type {Set<string>} */
    const readTokens = new Set();
    for (const row of census.rows) {
      for (const path of row.reads || []) {
        for (const token of String(path).split(/[^A-Za-z_$0-9]+/)) if (token) readTokens.add(token);
      }
    }
    expect(readTokens.size, 'the read-token set is the corpus\'s, not an empty one').toBeGreaterThan(100);
    expect(minted.filter((token) => readTokens.has(token)),
      'no token this instrument alone writes is a field any pool reads').toEqual([]);
    // ⛔ THE PLANT, through the SAME two readers: the shape the first cut had. `court` is a
    // token the corpus reads, so a table that keyed a row on it would be caught here.
    expect(readTokens.has('court'), 'the control: `court` IS a field the corpus reads').toBe(true);
    expect(astTokens('export const T = Object.freeze({ court: 1 });').writes.map((w) => w.name),
      'and a table keyed on the kind writes that token').toEqual(['court']);
    expect(astTokens('export const T = Object.freeze([{ kind: \'court\' }]);').writes.map((w) => w.name),
      'while the shipped array shape writes only its own field names').toEqual(['kind']);
  });

  test('⛔ THE DOCBLOCK KIND IS WITHDRAWN: a comment pairing two tokens proposes nothing', () => {
    // SITTING §P.2-27 EXTENDED (the chair on car 3h §3h.6 item 2). The kind minted a row out
    // of two English words sharing one comment line, and the note recording that re-minted it.
    const docs = new Map([['fixture/composer.js',
      '// the eco reading is what food_security means on this row\nconst x = 1;\n']]);
    const draft = aliasDraft({
      endpoints: ['system:food_security'], roots: ['eco'], paths: [], docs,
    });
    expect(draft.rows, 'a comment proposes NO candidate').toEqual([]);
    expect(draft.docblockReports.length, 'and is reported instead').toBe(1);
    expect(draft.docblockReports[0]).toEqual({
      endpoint: 'system:food_security',
      readRoot: 'eco',
      at: 'fixture/composer.js:1',
      line: '// the eco reading is what food_security means on this row',
    });
    // THE CONTROL: the same pair on a READ PATH still proposes, so the withdrawal removed one
    // evidence kind and not the draft's ability to see anything.
    expect(aliasDraft({
      endpoints: ['system:food_security'], roots: ['eco'], paths: ['eco.foodSecurity.label'], docs,
    }).rows.length, 'an identifier candidate survives').toBe(1);
  });
});

describe('car 0 — the committed JSON and its interlock', () => {
  test('the committed census is byte-identical to a fresh build, and the stamp is live', () => {
    const text = readFileSync(CENSUS_JSON, 'utf8');
    const verdict = censusCheck(text, committed);
    expect(verdict.reason, 'the committed file is current').toBe('');
    expect(verdict.ok).toBe(true);
    expect(text, 'and byte-identical to what the script would write').toBe(serialise(committed));
    expect(Object.keys(committed.stamp.files).length, 'the six composers and the mount registry').toBe(7);
  });

  test('the CANDIDATE LEAVES are stamped as a measurement of the tip, not as a sentence about it', () => {
    // ⛔ THE FAILURE THIS ARM EXISTS FOR (SEAM car 3b-0). Car 0 stamped a hand-written string
    // saying the candidate leaves did not exist yet. Car 3a landed all six. Re-running the
    // census would have re-emitted the false sentence in good faith, because a literal is not
    // a reading. The stamp now carries what is THERE, and this arm names the six so that a
    // seventh desk, or a leaf deleted, reds instead of moving a number nobody reads.
    const expected = [
      'defense', 'economy', 'general', 'power', 'stressors', 'warFaith',
    ].map((desk) => `${CANDIDATE_LEAF_DIR}/${desk}${CANDIDATE_LEAF_SUFFIX}`);
    expect(Object.keys(committed.stamp.candidateLeaves), 'six leaves, one per desk, by name')
      .toEqual(expected);
    expect(candidateLeafIndex(), 'and the committed stamp is the tip').toEqual(committed.stamp.candidateLeaves);
    // AN ORTHOGONAL WITNESS, so the arm is not the script agreeing with itself: the digest is
    // recomputed here from the file's own bytes, by a hash this file spells for itself.
    for (const [rel, digest] of Object.entries(committed.stamp.candidateLeaves)) {
      const bytes = readFileSync(join(ROOT, rel), 'utf8');
      expect(digest, `${rel} is stamped by its bytes`)
        .toBe(createHash('sha256').update(bytes).digest('hex'));
      expect(digest, 'a sha256, not a claim').toMatch(/^[0-9a-f]{64}$/);
      expect(bytes, 'and the leaf ships an EMPTY candidate list at this car').toMatch(/const fired = \[\];/);
    }
    // THE PLANT, in the only form this arm can take without writing to the tree: a stamp whose
    // leaf bytes moved is a stale census, and the byte interlock is what says so.
    const drifted = JSON.parse(serialise(committed));
    drifted.stamp.candidateLeaves[expected[0]] = '0'.repeat(64);
    const moved = censusCheck(`${JSON.stringify(drifted, null, 2)}\n`, committed);
    expect(moved.ok, 'a moved leaf makes the committed census stale').toBe(false);
    expect(moved.reason, 'as a byte staleness, since the leaves are not in stamp.files').toBe('stale-bytes');
  });

  test('a STALE STAMP and a STALE BYTE are different refusals, and both fire', () => {
    // ⛔ THE PLANT THE INTERLOCK EXISTS FOR. A composer moves, nobody re-takes the census,
    // and the projector goes on refusing `READS` tokens against a map of a tree that no
    // longer exists. The two failures have different cures and are not collapsed.
    const fresh = JSON.parse(serialise(committed));
    fresh.stamp.files[Object.keys(fresh.stamp.files)[0]] = '0'.repeat(64);
    const stamped = censusCheck(`${JSON.stringify(fresh, null, 2)}\n`, committed);
    expect(stamped.ok, 'a stale stamp refuses').toBe(false);
    expect(stamped.reason).toBe('stale-stamp');
    expect(stamped.detail).toMatch(/the composer moved since the census was taken/);
    const drifted = JSON.parse(serialise(committed));
    drifted.totals.pools = 707;
    const bytes = censusCheck(`${JSON.stringify(drifted, null, 2)}\n`, committed);
    expect(bytes.ok, 'a stale byte refuses').toBe(false);
    expect(bytes.reason, 'and says which failure it is').toBe('stale-bytes');
    expect(censusCheck(null, committed).reason, 'a missing file is its own refusal').toBe('missing');
    // THE PAIRED POSITIVE, so the check is not simply refusing everything.
    expect(censusCheck(serialise(committed), committed).ok).toBe(true);
  });

  test('the producer index reads the estate, and a blind one would report nothing', () => {
    const { produced, files } = producerIndex();
    expect(files, 'the scan read src/generators and src/domain, not an empty directory').toBeGreaterThan(400);
    expect(produced.size, 'and found this many written leaf keys').toBeGreaterThan(2000);
    expect(produced.has('economicGates'), 'including the gate the ARCH document works from').toBe(true);
    expect(produced.has('zzzNoWriterAnywhere'), 'and not a key nothing writes').toBe(false);
  });
});

describe('car 0 — the RATE corpus, its per-tier arm and the occurrence bound', () => {
  test('the corpus is a marginal-controlled grid whose TIER axis is balanced', () => {
    const rate = committed.rate;
    expect(rate, 'the committed census carries its rate half').toBeTruthy();
    expect(rate.corpus.cells, 'threat 4 x route 8 x tier 6').toBe(192);
    expect(rate.corpus.seeds, 'seeds per cell').toBe(4);
    expect(rate.corpus.towns, 'and the sample the Wilson bound is stated at').toBe(768);
    expect(rate.corpus.genThrows, 'no generator threw').toBe(0);
    expect(rate.corpus.deskThrows, 'and no desk threw').toEqual([]);
    // ⭐ THE TIER AXIS IS EXACTLY BALANCED (the owner's 2026-09-08 01:3x row). A corpus whose
    // tiers were rolled could not answer "is this pool dark at city?" at all.
    expect(Object.fromEntries(rate.corpus.tierMarginals)).toEqual({
      thorp: 128, hamlet: 128, village: 128, town: 128, city: 128, metropolis: 128,
    });
    // ⭐ 267 BECAME 271 AT MEASURE CAR 3, AND THE FOUR ARE THE COST OF ONE OMITTED READING.
    // `deskReturns` called `economyDeskRead(s, opts)` with `opts = {seed, audience}`, and that
    // recipe takes `foodBalance`, `granaryOutlook`, `flowDrift` and `impairedInstitution` from
    // its OPTIONS and defaults each to null. `deriveFoodBalance(s).available` is true on 768 of
    // 768, so DS-ECO-2's three FOOD pools could never fire in this corpus, and DS-SUP-3's
    // impaired-house lens could not either. This is the corpus every rate figure below is read
    // from, so it is also the reason the departure line and the per-tier table moved.
    // ⛔ 271 AND NOT THE TASTE'S 276 (REWRITE car 8a-3). TASTE car M-4 made the rate table
    // measure MODIFIER PREDICATES beside the spines that drew (ARCH §4.3 freezes the norm bit
    // from the predicate's own rate, not from what seated) and its five firing modifier pools
    // each gained a row. That MEASURE lands here; its five rows do not, because this tree has
    // no modifier pool for the corpus walk to fire. The figure is the shipped one.
    expect(rate.rows.length, 'pools that fired somewhere on the grid').toBe(271);
    // The one-config 200-town probe reached 181; the grid reaches more, which is the point.
    expect(rate.rows.length, 'more than the single-configuration probe could reach').toBeGreaterThan(181);
  });

  test('a pool silent at a tier where its block MOUNTS is a per-tier finding', () => {
    expect(committed.rate.tierSilences.length, '(pool, tier) rows on the shipped grid').toBe(352);
    for (const row of committed.rate.tierSilences) {
      expect(row.sites, 'every finding is on a MOUNTED block').toBeGreaterThan(0);
      expect(row.firedOverall, 'and on a pool that fired somewhere').toBeGreaterThan(0);
    }
    // THE ARM ITSELF, on a fixture built to hold one silence and one lawful absence: a pool
    // that fires only at `city` is silent at `hamlet`, and a pool of an UNMOUNTED block is
    // not a finding at all, however silent it is.
    const towns = firingsByTier(4);
    const rows = [
      {
        block: 'DS-FIX-12', pool: 'WALLED-QUIET', towns: 4, byTier: { hamlet: { towns: 0 }, city: { towns: 4 } },
      },
      {
        block: 'DS-FIX-99', pool: 'DARK', towns: 4, byTier: { hamlet: { towns: 0 }, city: { towns: 4 } },
      },
    ];
    const tiers = [['hamlet', 4], ['city', 4]];
    const sites = new Map([['DS-FIX-12', ['defense.wallRationale']], ['DS-FIX-99', []]]);
    const found = tierSilencesOf(rows, tiers, sites);
    expect(found.map((f) => `${f.block}/${f.tier}`), 'the mounted block\'s silence is named, the unmounted one is not')
      .toEqual(['DS-FIX-12/hamlet']);
    expect(towns.length, 'and the fixture carries both tiers').toBe(8);
  });

  test('⭐ each per-tier silence is LAWFUL or MISSING-AT-TIER, and the second joins the tier table', () => {
    // SITTING §O.5. A pool silent at a size where its block mounts is LAWFUL when its own
    // RUNG spoke there and chose another value class — the ladder RAN and the field could not
    // hold this pool's value at that size, which is `walls at a thorp` exactly. It is
    // MISSING-AT-TIER when NO pool of the rung fired at that tier at all: the reader gets
    // silence at one size from a rung that speaks at every other, and that is the wave's row.
    const silences = committed.rate.tierSilences;
    const lawful = silences.filter((r) => r.verdict === 'LAWFUL');
    const missing = silences.filter((r) => r.verdict === 'MISSING-AT-TIER');
    expect(lawful.length, 'lawful silences, at 128 towns per tier').toBe(307);
    expect(missing.length, 'and the rows the authoring wave inherits').toBe(45);
    expect(lawful.length + missing.length, 'the two limbs partition the finding').toBe(352);
    expect(new Set(lawful.map((r) => r.limb)), 'each names the limb that answered it').toEqual(new Set(['value-class']));
    expect(new Set(missing.map((r) => r.limb))).toEqual(new Set(['rung-dark']));
    // THE FOURTH TIER, in the table the authoring wave reads and not in a second list.
    expect(committed.totals.tiers['MISSING-AT-TIER'], 'the fourth tier carries them').toBe(45);
    const fourth = committed.tiers.filter((t) => t.tier === TIERS.MISSING_AT_TIER);
    expect(fourth.length).toBe(45);
    for (const row of fourth) {
      expect(row.subject, 'each names the pool AND the size').toMatch(/ @ \w+$/);
      expect(row.count, 'and carries the measurement that put it there').toMatch(/fired on \d+ towns overall/);
    }
    // ⚠ WHAT THE 44 ARE NOT: no BLOCK is dark at a size on this corpus, only a RUNG is, and
    // twelve of the 44 sit on a block whose ladder SPLITS across a module-level key table and
    // the function carrying its `||` fallback, where the two halves cannot see each other.
    // Both are DECLARED with their integers rather than cured behind the verdict.
    expect(missing.filter((r) => r.siblingRungSpoke).length, 'every one of them').toBe(45);
    expect(missing.filter((r) => r.splitLadder).length, 'the split-ladder shape, counted').toBe(12);
    expect(new Set(missing.map((r) => r.block)).size, 'over this many blocks').toBe(7);
    // ⛔ THE THIRD COARSENESS, DECLARED WITH ITS INTEGER (the fold's P6, receipt row 17). The
    // LAWFUL limb requires ANOTHER pool of the SAME RUNG to have fired at that tier, so a rung
    // the census knows exactly one pool for can never be lawful and every tier it is quiet at
    // is automatically rung-dark. Twelve of these rows sit on such a rung — `originTierPoolKey`
    // 4 (already declared as a split ladder), `contractedForcePoolKey` 4, `operationRolePoolKey`
    // 3 and `impairedServicePoolKey` 1 (the row cure 1 gave back) — leaving EIGHT undeclared
    // rows that are not authoring-wave work at all.
    const poolsPerRung = new Map();
    for (const row of committed.rows) {
      const rung = `${row.block} :: ${row.keyFunction}`;
      poolsPerRung.set(rung, (poolsPerRung.get(rung) || 0) + 1);
    }
    const singlePool = missing.filter((r) => poolsPerRung.get(r.rung) === 1);
    expect(singlePool.length, 'MISSING-AT-TIER rows on a rung whose LAWFUL limb is unreachable').toBe(12);
    expect(singlePool.filter((r) => !r.splitLadder).length,
      'of which this many are beyond the twelve already declared').toBe(8);
    expect([...new Set(singlePool.map((r) => r.rung))].sort(), 'and the four rungs they sit on').toEqual([
      'DS-DEF-5 :: contractedForcePoolKey',
      'DS-GEN-6 :: originTierPoolKey',
      'DS-POW-6 :: operationRolePoolKey',
      'DS-SUP-3 :: impairedServicePoolKey',
    ]);
    // THE RULE ITSELF, on a fixture: two pools of ONE rung, one silent at hamlet where the
    // other spoke, against a rung with nothing at hamlet at all.
    const tiers2 = [['hamlet', 4], ['city', 4]];
    const sites2 = new Map([['DS-FIX-12', ['defense.wallRationale']]]);
    const rows2 = [
      { block: 'DS-FIX-12', pool: 'WALLED', towns: 4, byTier: { hamlet: { towns: 0 }, city: { towns: 4 } } },
      { block: 'DS-FIX-12', pool: 'UNWALLED', towns: 4, byTier: { hamlet: { towns: 4 }, city: { towns: 0 } } },
      { block: 'DS-FIX-12', pool: 'MERCENARIES', towns: 4, byTier: { hamlet: { towns: 0 }, city: { towns: 4 } } },
    ];
    const census2 = [
      { block: 'DS-FIX-12', pool: 'WALLED', keyFunction: 'wallPoolKey', rung: 'literal' },
      { block: 'DS-FIX-12', pool: 'UNWALLED', keyFunction: 'wallPoolKey', rung: 'literal' },
      { block: 'DS-FIX-12', pool: 'MERCENARIES', keyFunction: 'mercPoolKey', rung: 'literal' },
    ];
    const verdicts = tierSilencesOf(rows2, tiers2, sites2, census2);
    expect(verdicts.map((v) => `${v.pool}/${v.tier}/${v.verdict}`), 'the sibling class answers, the lone rung does not')
      .toEqual(['WALLED/hamlet/LAWFUL', 'UNWALLED/city/LAWFUL', 'MERCENARIES/hamlet/MISSING-AT-TIER']);
    // AND WITHOUT THE CENSUS the rung falls back to the BLOCK, which is coarser and says so.
    const blind = tierSilencesOf(rows2, tiers2, sites2);
    expect(new Set(blind.map((v) => v.grain)), 'the coarser grain is named on the row').toEqual(new Set(['block']));
    expect(blind.find((v) => v.pool === 'MERCENARIES').verdict, 'and it calls the lone rung lawful, which is why it is named')
      .toBe('LAWFUL');
  });

  test('the occurrence bound is the WILSON lower bound, and the pair distribution is printed at it', () => {
    // ARCH E-F4: at 27 of 525 a cell truly at 5 % clears a naive floor 48 % of the time, so
    // the floor is the 95 % LOWER bound and never the point estimate.
    expect(wilsonFloorCount(768, 500), 'the bound at N = 768').toBe(51);
    expect(wilsonFloorCount(525, 500), 'and at the golden corpus\'s N').toBe(37);
    expect(wilsonBp(51, 768).loBp, 'the interval at the bound clears 500 bp').toBeGreaterThanOrEqual(500);
    expect(wilsonBp(50, 768).loBp, 'and one town below it does not').toBeLessThan(500);
    const pairs = committed.rate.pairs;
    expect(pairs.n).toBe(768);
    expect(pairs.boundCount, 'the census carries the bound it was measured at').toBe(51);
    expect(pairs.rows.length, 'distinct co-occurring fact pairs with no pool keyed on both').toBe(729);
    expect(pairs.clearing, 'pairs clearing the bound, ALL members').toBe(590);
    // ⛔ AND THE HALF THE CHAIR MUST SET THE FLOOR FROM. `coOccurringPairs` builds a town's
    // facts from PREDICATE fields, two of whose shapes are this instrument's own bookkeeping:
    // the table rung's synthetic label and a bare unrooted parameter. A floor set on the
    // whole distribution would be set on 503 pairs of labels.
    // ⭐ 226 BECAME 205 AND 170 BECAME 151 AT MEASURE CAR 3 (the fold's P5, cure 10).
    // `pairMemberClass` called anything with a dot a `fact`, so `eco.incomeSources.reduce` —
    // `Array.prototype.reduce`, not a reading of the world — carried 21 of the 226 usable pairs
    // and 19 of the 170 clearing them, and four of the twenty most frequent usable pairs were
    // on it. SITTING §O.3 sets the co-occurrence floor over the USABLE pairs, so 11 % of the
    // licensed list was a method call until this cure.
    expect(pairs.usable, 'pairs whose BOTH members are dotted reading paths').toBe(205);
    expect(pairs.usableClearing, 'and those clearing the bound').toBe(151);
    expect(pairMemberClass('eco.incomeSources.reduce'), 'the tail is a builtin, never a fact').toBe('method');
    expect(pairMemberClass('eco.incomeSources'), 'and the reading it was called on is a fact').toBe('fact');
    expect(pairMemberClass('granary'), 'a bare key-function parameter is unrooted').toBe('unrooted');
    expect(pairMemberClass('x (via TABLE in f.js)'), 'and the table rung\'s own label is synthetic').toBe('synthetic');
    expect(JS_METHOD_TAILS.has('reduce'), 'the excluded list is published as a frozen constant').toBe(true);
    expect(JS_METHOD_TAILS.has('stockpile'), 'and it does not swallow a real settlement field').toBe(false);
    expect(pairs.rows.filter((p) => p.aClass === 'method' || p.bClass === 'method').length,
      'the pairs the exclusion removed, counted rather than dropped in silence').toBe(38);
    // ⛔ NO FLOOR IS SET HERE. The distribution ships; the floor is the chair's.
    expect(committed.rate.departureReport.lineBp, 'the departure line is a REPORT at 10 %').toBe(1000);
    expect(committed.rate.departureReport.uncommon, 'the departure bits at the report line').toBe(72);
    expect(committed.rate.departureReport.uncommon
      + committed.rate.departureReport.common, 'over every fired pool').toBe(271);
  });

  test('the wizard-default weighting ships as a REPORT column beside every rate', () => {
    // SITTING §N.3: the measurement population is UNIFORM OVER THE CONFIGURATION CHOICES;
    // the funnel is printed beside it and never silently re-orders an installed world.
    const wizard = committed.rate.wizard;
    expect(wizard.towns, 'the same N, so the two columns are comparable').toBe(768);
    // ⭐ THE FUNNEL'S TIERS ARE NOT BALANCED AND THE GRID'S ARE, which is the whole reason
    // the two populations are different questions.
    const wizardTiers = Object.fromEntries(wizard.tiers);
    expect(new Set(Object.values(wizardTiers)).size, 'the wizard rolls its tier').toBeGreaterThan(1);
    for (const row of committed.rate.rows) {
      expect(typeof row.wizardRateBp, `${row.pool} carries its report column`).toBe('number');
    }
  });
});

describe('⭐⭐ REWRITE car 8a-6 — THE FIELD-SYNONYM TABLE, a REPORT column ratified like an alias', () => {
  test('the ratified rows are short, closed and each CITED', () => {
    // SITTING §H rule 3, and the alias law applied: "a synonym is ratified like an alias —
    // cited to the card, never to a comment or a prose string". A generous table would make
    // arm Q quieter without anybody deciding it should be, so the roster is short and every
    // row says where the join comes from.
    expect(FIELD_SYNONYM_ROWS.length, 'the ratified field rows at this tip').toBe(1);
    for (const row of FIELD_SYNONYM_ROWS) {
      expect(row.field, 'a row names a FIELD PATH, not a pool key').toContain('.');
      expect(row.nouns.length, 'and at least one noun').toBeGreaterThan(0);
      expect(row.at, 'and cites where the join comes from').toContain('SITTING');
    }
    expect(FIELD_SYNONYM_ROWS[0].field).toBe('settlement.defenseProfile.economicGates.military');
    expect(FIELD_SYNONYM_ROWS[0].nouns, 'the owner\'s own exemplar word').toContain('wages');
  });

  test('⛔ THE HOLDER NOUNS ARE ROWS, NOT AN OBJECT KEYED BY KIND, and the reason is a defect', () => {
    // ⛔⛔ WRITTEN FIRST AS `{ treasury: [...], court: [...], … }`, this table CHANGED THE
    // CENSUS'S OWN MEASUREMENT: the census scans `src/` for the leaf keys the estate WRITES,
    // read a property named `court:` inside the module it scans, and flipped the `absent` label
    // on four DS-DEF-2 rows from `not-produced` to `measured`. An instrument that contaminates
    // its own reading by being added to the file it reads is the class this register exists to
    // refuse. As rows there is no key for the producer scan to misread.
    expect(Array.isArray(HOLDER_KIND_NOUN_ROWS), 'a LIST, so no property name is a write').toBe(true);
    const kinds = HOLDER_KIND_NOUN_ROWS.map((r) => r.kind);
    expect([...new Set(kinds)].length, 'no kind twice').toBe(kinds.length);
    // AND EVERY KIND OF THE FROZEN LIST IS COVERED, so a kind added there is not silently mute.
    for (const kind of HOLDER_KINDS) expect(kinds, `${kind} has no record noun`).toContain(kind);
  });

  test('the per-row vocabulary joins the FIELD rows and the HOLDER nouns, and keeps them apart', () => {
    // A `roll` is the record the WHOLE row is kept in; `wages` names ONE gate. Merging the two
    // would let a `books` claim a field the treasury does not keep.
    const gate = 'settlement.defenseProfile.economicGates.military';
    expect(fieldSynonymsFor({ reads: [gate], source: { kind: 'treasury' } })[gate].sort())
      .toEqual(['books', 'chest', 'pay', 'purse', 'wage', 'wages']);
    expect(fieldSynonymsFor({ reads: [gate], source: {} })[gate].sort(),
      'with no holder kind, only the field row applies')
      .toEqual(['pay', 'purse', 'wage', 'wages']);
    expect(fieldSynonymsFor({ reads: ['forces.walls.present'], source: {} }),
      'a field with no row and no kind gains nothing').toEqual({});
    expect(fieldSynonymsFor({}), 'and a row with no reads answers nothing').toEqual({});
  });

  test('the COMMITTED census carries the column, and it agrees with the module', () => {
    const committedTable = /** @type {any} */ (JSON.parse(readFileSync(CENSUS_JSON, 'utf8'))).fieldSynonyms;
    expect(committedTable, 'the register ships the REPORT column').toBeTruthy();
    expect(fieldSynonymTable(spineRows(census.rows)), 'and it is the module\'s own answer')
      .toEqual(committedTable);
    expect(Object.keys(committedTable).length, 'over this many fields').toBeGreaterThan(0);
    expect(committedTable['settlement.defenseProfile.economicGates.military'],
      'including the row SITTING §H names').toContain('wages');
  });

  test('⛔ IT IS A REPORT AND NEVER A GATE: no row of the census carries a per-row synonym column', () => {
    // The table is a top-level section keyed by FIELD. Writing it onto each ROW would make it
    // look like a licence the row carries, and a reader would have to guess whether an arm was
    // reading the row's own column or the register's table.
    const withColumn = census.rows.filter((row) => row.fieldSynonyms !== undefined
      || row.synonyms !== undefined || row.fieldVocabulary !== undefined);
    expect(withColumn.map((r) => `${r.block} :: ${r.pool}`)).toEqual([]);
  });
});
