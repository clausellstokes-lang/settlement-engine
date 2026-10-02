/**
 * tests/lint/recordRegisterTotality.walker.test.js — THE TOTALITY WALKER for the record
 * class register (EM-R0a, the re-entry family member 1).
 *
 * WHAT IT HOLDS. `src/domain/edit/recordRegister.js` is pure frozen data: it declares the
 * CLASS of every top-level key of a settlement record, the declared KEY of every keyed
 * collection, every keyless or total-bound collection as ATOMIC, the consistency groups, and
 * the collections a future reclassification may not merge. Data that describes a record and
 * is never checked against one rots silently — a new generator key is classed nowhere, a key
 * that stops being unique keeps its row, a declared path stops existing and nothing says so.
 * This walker holds the register EQUAL IN BOTH DIRECTIONS to what a stride of the golden
 * corpus actually produces, so a new record key, a new collection, a broken key, a lost total
 * or a dead declaration REDS, by name.
 *
 * THE STRIDE. The 63-row structured sample is DERIVED IN-TEST from the golden master's own
 * corpus (`tests/helpers/goldenMasterCorpus.js#goldenCorpus`) — one culture per
 * (settType, terrainOverride) among the grid rows, then every non-grid row — and generated
 * through the real pipeline exactly as `tests/property/generatorGoldenMaster.test.js` does.
 * No fixture is committed: a second spelling of the corpus is how two instruments come to
 * disagree about which world they measured while both report green. The stride was CHOSEN BY
 * EXECUTION: it yields the same 41 top-level keys, the same 63 collection paths and the same
 * split as the full 525-row corpus, at a fraction of the generation cost.
 *
 * ⛔ THREE CONSTRUCTION RULES (packet §6), each with its own instrument:
 *   1. `it`, `test` and `describe` are bound EXACTLY ONCE each — never re-bound, not even as a
 *      callback parameter. The sovereignty-lighting census resolves an opener only where the
 *      module binds the word once, and a stray `(it) =>` parks the whole file.
 *   2. Every set an arm iterates is IMPORTED from the register and every record is DERIVED by
 *      running the real generator — never a local literal copy of a table, which is the shape
 *      `tests/lint/contractTestAntiVacuity.walker.test.js` Rule 2 convicts.
 *   3. Negative assertions are anchored: each carries `// anchored:` on the line immediately
 *      above, or is expressed as a both-directions set equality that cannot go vacuous.
 *
 * CANNOT-CATCH:
 * 1.  neighborRelationship is null in 525/525 corpus rows — its object shape is NEVER observed, and
 *     it is the very field whose presence makes the save path write `neighbourNetwork`.
 * 2.  Twelve array paths are EMPTY in every corpus row, so their ENTRY shape is never observed:
 *     aiOverlays · coherenceNotes · config.intendedStressTypes · config.nearbyResourceDefinitions
 *     · config.nearbyResourceDefinitionsDepleted · config.nearbyResourcesCustom
 *     · generationCoherenceReceipt.checks[].findings · generationCoherenceReceipt.judgments[].findings
 *     · resourceAnalysis.exploitation.warnings · resourceAnalysis.featureEffects
 *     · resourceAnalysis.imports.recommended · resourceAnalysis.priorityNotes
 * 3.  Five leaves are observed ONLY as null: economicState.incomeSources[].priorityNote ·
 *     economicState.foodSecurity.magicTradeChannel · powerStructure.factions[].modifier ·
 *     economicState.activeChains[].externalMillNote · powerStructure.factionRelationships[].dmNote
 * 4.  Uniqueness is VACUOUS for the nine KEY_UNPROVEN_AT_LENGTH_ONE rows; A4 names them, it does
 *     not prove them.
 * 5.  Single-observation paths are one bit: defenseProfile.institutions.militia appears in 1 of 63
 *     rows, as do institutions[].exclusiveGroupCoexists, defenseProfile.institutions.magicDef[]
 *     .nativeTier and .coherenceRepair, and economicViability.warnings[].category/.impact/
 *     .suggestedFixes.
 * 6.  The wizard's RANDOM modes are OFF-CORPUS (settType:'random', culture:'random_culture',
 *     _randomizePriorities — design §21.5 item 8): a key only those configs produce is unseen.
 * 7.  CUSTOM CONTENT is empty (customContent: {}): a compendium-promoted institution or resource can
 *     populate config.nearbyResourcesCustom and new institutions[].source values.
 * 8.  userCanon is {} and aiOverlays is [] in 525/525 — both AUTHORED, so their INTERIOR is unseen.
 * 9.  ⭐ THE WALKER GENERATES; IT DOES NOT SAVE. The six SAVED_ONLY_KEYS are classed from the save
 *     path's source and the public allow-list, and this walker can only assert their ABSENCE. The
 *     arm that observes them over a real save → load is EM-R7's (design §22.3 item 7).
 * 10. A MALFORMED repairs[] entry is the one seam by which HISTORY reaches a READING: the provenance
 *     check fires only on a repair missing `type`, `action` or `reason`
 *     (generationReceiptJudgments.js:654-660). No generated repair is malformed; a future op could
 *     write one.
 * 11. ⭐ dmLayer and decrees ARE WRITTEN NOW — by the STORE (`src/store/editSlice.js`), one
 *     lifecycle step outside generation — so they joined SAVED_ONLY_KEYS at the observed-shape
 *     register's schema-23 rung and NOT_YET_WRITTEN_KEYS is down to `crossSettlementConflicts`
 *     alone. What A1 can say about them is unchanged and is all it could ever say: this walker
 *     GENERATES and never saves, so it asserts their ABSENCE from a generated record, never
 *     their shape. The rung is what proves the writers exist — its gate 0 re-reads each named
 *     writer out of the scanned tree on every scan — and NOT_YET_WRITTEN_KEYS is now an OVERLAY
 *     on the saved-only list rather than a third partition member, which is what the partition
 *     arm below asserts.
 * 12. ⭐ THE `history-age` GROUP IS DECLARED HERE AND DETECTED ELSEWHERE. A6 proves the group is LIVE
 *     (its root and both members resolve on every record); it does NOT assert that the two leaves are
 *     EQUAL. The identity `history.age === history.founding.age` is EM-R0b's `V-HISTORY-AGE` check, by
 *     the division ODQ §934.47 addendum 38 ruling (1) draws — "the check DETECTS in this packet, and a
 *     `history` consistency GROUP PREVENTS the split". So if the generator ever stopped duplicating the
 *     leaf, this walker would stay green while the group quietly became pointless; V-HISTORY-AGE is
 *     what notices. The same boundary applies to every other group's invariant: §5.3's invariant
 *     column is documentation here and machinery in EM-R0b. A7 is the deliberate exception, because a
 *     cross-entry TOTAL is the reason a collection is ATOMIC rather than KEYED, and that reason lives
 *     in this register.
 */
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';
import {
  ATOMIC_COLLECTIONS,
  CLASS_EXCEPTIONS,
  CONSISTENCY_GROUPS,
  CROSS_ENTRY_TOTALS,
  GENERATED_KEYS,
  KEYED_COLLECTIONS,
  KEY_UNPROVEN_AT_LENGTH_ONE,
  NOT_YET_WRITTEN_KEYS,
  RECORD_CLASSES,
  RECORD_CLASS_NAMES,
  SAVED_ONLY_KEYS,
  UNMERGEABLE_COLLECTIONS,
} from '../../src/domain/edit/recordRegister.js';

/** The floor the whole file rests on: an empty walk would make every set equality vacuous. */
const STRIDE_FLOOR = 63;

/**
 * THE STRIDE, derived from the golden master's own corpus: the FIRST row of each
 * (settType, terrainOverride) pair among the grid rows, then every non-grid row. Collapsing
 * the corpus key by CULTURE expresses exactly that — the grid varies culture innermost, so one
 * row of each pair survives, and every sweep row (trade, threat, seed, random_trade) keeps its
 * own key and survives whole.
 */
const strideKeyOf = (row) => [
  row.settType, row.terrainOverride, row.tradeRouteAccess, row.monsterThreat, row._seed,
].join('|');

const STRIDE = (() => {
  const seen = new Set();
  return goldenCorpus().filter((row) => {
    const key = strideKeyOf(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
})();

/** Generated through the real pipeline, exactly as the golden master calls it. */
const ROWS = STRIDE.map((row) => {
  const { _seed: seed, ...cfg } = row;
  return { label: keyOf(row), record: generateSettlementPipeline(cfg, null, { seed, customContent: {} }) };
});

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * ONE WALK, collapsed: every `[i]` becomes `[]`. An EMPTY array carries no entry shape and is
 * therefore not an observation of its entries; `null` is an observation of the path and never
 * of its shape.
 */
function buildCensus(rows) {
  const collections = new Map();
  const observedPaths = new Set();
  const topKeys = new Set();

  const statsFor = (path) => {
    if (!collections.has(path)) collections.set(path, { arrays: 0, maxLen: 0, samples: [] });
    return collections.get(path);
  };

  const walk = (value, path) => {
    if (Array.isArray(value)) {
      if (value.length > 0) observedPaths.add(`${path}[]`);
      if (value.length > 0 && value.every((entry) => isPlainObject(entry))) {
        const stats = statsFor(path);
        stats.arrays += 1;
        if (value.length > stats.maxLen) stats.maxLen = value.length;
        stats.samples.push(value);
      }
      for (const entry of value) walk(entry, `${path}[]`);
      return;
    }
    if (isPlainObject(value)) {
      for (const key of Object.keys(value)) {
        const next = path ? `${path}.${key}` : key;
        observedPaths.add(next);
        walk(value[key], next);
      }
    }
  };

  for (const row of rows) {
    for (const key of Object.keys(row.record)) topKeys.add(key);
    walk(row.record, '');
  }
  return { collections, observedPaths, topKeys };
}

const CENSUS = buildCensus(ROWS);
const DECLARED_COLLECTIONS = [...Object.keys(KEYED_COLLECTIONS), ...ATOMIC_COLLECTIONS];

/** A composite key is an array of fields; a simple key is one field. */
const keyValueOf = (entry, key) => (Array.isArray(key)
  ? JSON.stringify(key.map((field) => entry[field]))
  : JSON.stringify(entry[key]));
const keyPresentOn = (entry, key) => (Array.isArray(key)
  ? key.every((field) => field in entry)
  : key in entry);

/** What a group COVERS: its root expanded by its member list, `members: null` covering the root. */
const coveredBy = (group) => (group.members === null
  ? [group.root]
  : group.members.map((member) => `${group.root}.${member}`));
/** Containment over collapsed paths — equality, a dotted descendant, or an entry node. */
const pathContains = (outer, inner) => inner === outer
  || inner.startsWith(`${outer}.`) || inner.startsWith(`${outer}[`);

/** The sum of one field over one array, rounded to the precision the corpus was measured at. */
const sumOf = (array, field) => Math.round(
  array.reduce((total, entry) => total + (Number(entry[field]) || 0), 0) * 1e6,
) / 1e6;

const sorted = (values) => [...values].sort();

describe('the record class register — totality over a generated record, in both directions', () => {
  it('A1 — every record key is classed, and GENERATED_KEYS equals the observed set exactly', () => {
    // THE DENOMINATOR IS REFUSED FIRST: every set equality below is vacuous on an empty walk.
    expect(ROWS.length, 'the derived stride of generated records').toBeGreaterThanOrEqual(STRIDE_FLOOR);

    const unclassed = [];
    for (const row of ROWS) {
      for (const key of Object.keys(row.record)) {
        if (!(key in RECORD_CLASSES)) unclassed.push(`${row.label} :: ${key}`);
      }
    }
    expect(unclassed, `record keys no RECORD_CLASSES row classes (add the key, do not widen the walk):\n${unclassed.join('\n')}`).toEqual([]);

    const strayClasses = Object.entries(RECORD_CLASSES)
      .filter(([, className]) => !RECORD_CLASS_NAMES.includes(className))
      .map(([key, className]) => `${key} -> ${className}`);
    expect(strayClasses, `classes outside RECORD_CLASS_NAMES:\n${strayClasses.join('\n')}`).toEqual([]);

    const observed = sorted(CENSUS.topKeys);
    expect(sorted(GENERATED_KEYS), 'GENERATED_KEYS equals the observed top-level key set, both directions')
      .toEqual(observed);

    const leaked = [];
    for (const row of ROWS) {
      for (const key of [...SAVED_ONLY_KEYS, ...NOT_YET_WRITTEN_KEYS]) {
        if (key in row.record) leaked.push(`${row.label} :: ${key}`);
      }
    }
    expect(leaked, `a saved-only or not-yet-written key is present on a GENERATED record:\n${leaked.join('\n')}`).toEqual([]);

    // ⭐ TWO LISTS PARTITION THE REGISTER, AND THE THIRD IS AN OVERLAY ON ONE OF THEM. It used
    // to be three: `NOT_YET_WRITTEN_KEYS` minus `SAVED_ONLY_KEYS` derived the EDITOR's two keys,
    // which were declared ahead of any writer. The observed-shape register's schema-23 rung
    // retired that state of affairs by measurement — `dmLayer` and `decrees` are written by
    // `src/store/editSlice.js`, and that rung's gate 0 re-proves both writers out of the scanned
    // tree on every scan — so they moved into the saved-only class and the not-yet-written list
    // is down to `crossSettlementConflicts`, which nothing in src/ writes at all.
    // ⛔ THE SUBSET ARM IS WHAT KEEPS THE OVERLAY HONEST: a key that is not-yet-written but
    // outside the saved-only class would be classed by no partition member, and the equality
    // below would stop being total without saying so.
    expect(NOT_YET_WRITTEN_KEYS.length, 'the keys the register classes but no writer produces')
      .toBeGreaterThan(0);
    const unclassedUnwritten = NOT_YET_WRITTEN_KEYS.filter((key) => !SAVED_ONLY_KEYS.includes(key));
    expect(unclassedUnwritten, `a NOT_YET_WRITTEN key outside the saved-only class:\n${unclassedUnwritten.join('\n')}`)
      .toEqual([]);
    expect(sorted([...GENERATED_KEYS, ...SAVED_ONLY_KEYS]),
      'the two key lists partition RECORD_CLASSES exactly')
      .toEqual(sorted(Object.keys(RECORD_CLASSES)));
  });

  it('A2 — the three class exceptions are live, and the MIRROR is a measurement', () => {
    const deadExceptions = Object.keys(CLASS_EXCEPTIONS)
      .filter((path) => !CENSUS.observedPaths.has(path));
    expect(deadExceptions, `a declared CLASS_EXCEPTIONS path no record carries:\n${deadExceptions.join('\n')}`).toEqual([]);

    const mirrorFaults = [];
    let chips = 0;
    let fieldsCompared = 0;
    for (const row of ROWS) {
      const npcById = new Map((row.record.npcs || []).map((npc) => [npc.id, npc]));
      for (const faction of row.record.factions || []) {
        for (const chip of faction.members || []) {
          chips += 1;
          const npc = npcById.get(chip.id);
          if (npc === undefined) {
            mirrorFaults.push(`${row.label} :: factions[].members[] id ${chip.id} resolves to no npcs[] entry`);
          } else {
            for (const field of Object.keys(npc)) {
              fieldsCompared += 1;
              if (JSON.stringify(chip[field]) !== JSON.stringify(npc[field])) {
                mirrorFaults.push(`${row.label} :: factions[].members[${chip.id}].${field} differs from its npcs[] field`);
              }
            }
          }
        }
      }
    }
    expect(chips, 'member chips observed (the MIRROR arm is not vacuous)').toBeGreaterThan(0);
    expect(fieldsCompared, 'NPC fields compared chip-for-chip').toBeGreaterThan(chips);
    expect(mirrorFaults, `a member chip is not a MIRROR of the NPC its id names:\n${mirrorFaults.join('\n')}`).toEqual([]);

    const repairRows = ROWS.filter((row) => (row.record.generationCoherenceReceipt?.repairs || []).length > 0);
    expect(repairRows.length, 'corpus rows that carry a generation repair (HISTORY reaches the receipt here)')
      .toBeGreaterThan(0);
  });

  it('A3 — every observed collection is KEYED xor ATOMIC, and every declared key holds', () => {
    const declared = new Set(DECLARED_COLLECTIONS);
    const unaccounted = sorted(CENSUS.collections.keys()).filter((path) => !declared.has(path));
    expect(unaccounted, `an observed array-of-objects path that neither table declares:\n${unaccounted.join('\n')}`).toEqual([]);

    const dead = DECLARED_COLLECTIONS.filter((path) => !CENSUS.collections.has(path));
    expect(sorted(dead), `a declared collection no record carries (a dead declaration):\n${dead.join('\n')}`).toEqual([]);

    const overlap = Object.keys(KEYED_COLLECTIONS).filter((path) => ATOMIC_COLLECTIONS.includes(path));
    expect(overlap, `KEYED and ATOMIC are disjoint; these appear in both:\n${overlap.join('\n')}`).toEqual([]);

    const keyFaults = [];
    for (const [path, key] of Object.entries(KEYED_COLLECTIONS)) {
      const stats = CENSUS.collections.get(path);
      for (const array of stats.samples) {
        for (const entry of array) {
          if (!keyPresentOn(entry, key)) keyFaults.push(`${path}: declared key ${JSON.stringify(key)} absent on an entry`);
        }
        const values = array.map((entry) => keyValueOf(entry, key));
        if (new Set(values).size !== values.length) {
          keyFaults.push(`${path}: declared key ${JSON.stringify(key)} is not unique within an observed array of ${array.length}`);
        }
      }
    }
    const distinctKeyFaults = sorted(new Set(keyFaults));
    expect(distinctKeyFaults, `a declared key is absent or not unique:\n${distinctKeyFaults.join('\n')}`).toEqual([]);

    // THE PAIRED NEGATIVE: resourceAnalysis.gaps is ATOMIC because its `chain` BREAKS. Re-measured
    // here so the atomic row keeps a live liveness anchor instead of an inherited sentence.
    const gaps = CENSUS.collections.get('resourceAnalysis.gaps');
    let chainPresentArrays = 0;
    let chainBrokenArrays = 0;
    for (const array of gaps.samples) {
      if (array.every((entry) => 'chain' in entry)) chainPresentArrays += 1;
      const chains = array.map((entry) => entry.chain);
      if (new Set(chains).size !== chains.length) chainBrokenArrays += 1;
    }
    expect(chainPresentArrays, 'resourceAnalysis.gaps carries `chain` on every entry of every array')
      .toBe(gaps.arrays);
    expect(chainBrokenArrays, 'and `chain` is NOT unique in some of them, which is why the row is ATOMIC')
      .toBeGreaterThan(0);
    expect(ATOMIC_COLLECTIONS.includes('resourceAnalysis.gaps'), 'so the register declares it ATOMIC').toBe(true);
  });

  it('A4 — KEY_UNPROVEN_AT_LENGTH_ONE is exactly the declared collections the corpus cannot test', () => {
    expect(ROWS.length, 'the walk behind the vacuity floor').toBeGreaterThanOrEqual(STRIDE_FLOOR);
    const measured = DECLARED_COLLECTIONS.filter((path) => CENSUS.collections.get(path)?.maxLen === 1);
    expect(sorted(KEY_UNPROVEN_AT_LENGTH_ONE),
      'the unproven-key set equals the measured length-one set, both directions: a row that gains a'
      + ' longer array must LEAVE it, and a row that loses its multi-entry observations must JOIN it')
      .toEqual(sorted(measured));
    expect(measured.length, 'and the set is non-empty, so the equality is not two empty sets')
      .toBeGreaterThan(0);
  });

  it('A5 — every UNMERGEABLE collection is still HELD, and its composite still holds', () => {
    const rootKeyOf = (path) => path.split('.')[0].replace('[]', '');
    const reclassified = UNMERGEABLE_COLLECTIONS
      .filter((path) => RECORD_CLASSES[rootKeyOf(path)] !== 'HELD')
      .map((path) => `${path} -> ${RECORD_CLASSES[rootKeyOf(path)]}`);
    expect(reclassified,
      'an UNMERGEABLE collection left HELD. These are safe only because the merge never reaches'
      + ` them; a reclassification must first prove a key:\n${reclassified.join('\n')}`).toEqual([]);

    const compositeFaults = [];
    let arraysChecked = 0;
    for (const path of UNMERGEABLE_COLLECTIONS) {
      const key = KEYED_COLLECTIONS[path];
      const stats = CENSUS.collections.get(path);
      expect(key, `${path} declares a composite key`).toBeDefined();
      expect(stats, `${path} is observed at all`).toBeDefined();
      for (const array of stats.samples) {
        arraysChecked += 1;
        const values = array.map((entry) => keyValueOf(entry, key));
        if (new Set(values).size !== values.length) {
          compositeFaults.push(`${path}: composite ${JSON.stringify(key)} repeats within an array of ${array.length}`);
        }
      }
    }
    expect(arraysChecked, 'unmergeable arrays observed').toBeGreaterThan(0);
    expect(compositeFaults, `an unmergeable collection's composite is not unique:\n${compositeFaults.join('\n')}`).toEqual([]);
  });

  it('A6 — every consistency group is live, and no group covers another', () => {
    const unresolved = [];
    for (const group of CONSISTENCY_GROUPS) {
      if (!CENSUS.observedPaths.has(group.root)) unresolved.push(`${group.id}: root ${group.root} resolves on no record`);
      for (const path of coveredBy(group)) {
        if (!CENSUS.observedPaths.has(path)) unresolved.push(`${group.id}: member path ${path} resolves on no record`);
      }
    }
    expect(unresolved, `a consistency group points at a path nothing carries:\n${unresolved.join('\n')}`).toEqual([]);

    const ids = CONSISTENCY_GROUPS.map((group) => group.id);
    expect(sorted(new Set(ids)), 'the group ids are unique').toEqual(sorted(ids));

    // ⛔ NESTING IS MEASURED OVER COVERED SETS, NEVER OVER ROOT STRINGS: by root prefix
    // `food-balance` sits inside `viability-counts`, and this arm would red on the register it
    // exists to protect. The member list is what makes that pair lawful (design §22.3 item 2).
    const nested = [];
    for (const outer of CONSISTENCY_GROUPS) {
      for (const inner of CONSISTENCY_GROUPS) {
        if (outer.id === inner.id) continue;
        for (const outerPath of coveredBy(outer)) {
          for (const innerPath of coveredBy(inner)) {
            if (pathContains(outerPath, innerPath)) {
              nested.push(`${outer.id} covers ${outerPath}, which contains ${inner.id}'s ${innerPath}`);
            }
          }
        }
      }
    }
    expect(nested, `two consistency groups cover the same ground:\n${nested.join('\n')}`).toEqual([]);

    // A PER-ENTRY root is matched at EVERY entry the keyed merge produces, which is the whole
    // reason `{ root, members }` needs no extension for "within each entry".
    const perEntry = CONSISTENCY_GROUPS.filter((group) => group.root.endsWith('[]'));
    expect(perEntry.length, 'the register declares at least one PER-ENTRY group').toBeGreaterThan(0);
    const entryFaults = [];
    let entriesSeen = 0;
    for (const group of perEntry) {
      const collectionPath = group.root.slice(0, -2);
      const stats = CENSUS.collections.get(collectionPath);
      expect(stats, `${group.id}'s collection ${collectionPath} is observed`).toBeDefined();
      for (const array of stats.samples) {
        for (const entry of array) {
          entriesSeen += 1;
          for (const member of group.members) {
            if (!(member in entry)) entryFaults.push(`${group.id}: ${member} missing from an ${group.root} entry`);
          }
        }
      }
    }
    expect(entriesSeen, 'per-entry group entries observed').toBeGreaterThan(0);
    expect(sorted(new Set(entryFaults)), `a per-entry group member is missing from an entry:\n${entryFaults.join('\n')}`).toEqual([]);
  });

  it('A7 — every cross-entry total still totals, and the two rejected candidates still do not', () => {
    const misplaced = Object.keys(CROSS_ENTRY_TOTALS)
      .filter((path) => !ATOMIC_COLLECTIONS.includes(path) || path in KEYED_COLLECTIONS);
    expect(misplaced,
      'a collection under a cross-entry total must be ATOMIC and never KEYED — taking one changed'
      + ` entry beside settled neighbours is exactly what breaks the total:\n${misplaced.join('\n')}`).toEqual([]);

    const totalFaults = [];
    for (const [path, spec] of Object.entries(CROSS_ENTRY_TOTALS)) {
      const stats = CENSUS.collections.get(path);
      const multiArrays = stats.samples.filter((array) => array.length > 1);
      if (multiArrays.length === 0) totalFaults.push(`${path}: no multi-entry array observed, so the total is untested`);
      for (const array of multiArrays) {
        const total = sumOf(array, spec.field);
        if (total !== spec.total) {
          totalFaults.push(`${path}: ${spec.field} sums to ${total} over ${array.length} entries, not ${spec.total}`);
        }
      }
    }
    expect(totalFaults, `a declared cross-entry total no longer totals:\n${totalFaults.join('\n')}`).toEqual([]);

    // THE PAIRED NEGATIVE, so the arm that ADMITS a total also REFUSES a near-miss. A loose
    // absolute tolerance once raised these two; a relative reading refuted them as independent
    // per-institution probabilities, and the refutation is re-measured rather than remembered.
    const rejectedFaults = [];
    for (const path of ['defenseProfile.institutions.magicDef', 'defenseProfile.institutions.walls']) {
      const stats = CENSUS.collections.get(path);
      const sums = new Set(stats.samples.filter((array) => array.length > 1)
        .map((array) => sumOf(array, 'baseChance')));
      if (sums.size < 2) rejectedFaults.push(`${path}: baseChance carries ${sums.size} distinct sum(s) — it now looks like a total, and the register does not name it`);
    }
    expect(rejectedFaults, `a REJECTED cross-entry candidate has become a total:\n${rejectedFaults.join('\n')}`).toEqual([]);
  });
});
