/**
 * livedExperienceCatalog.test.js — the lived-experience vocabulary's laws
 * (W-LIVES car L3).
 *
 * Four things are pinned here, and each exists because its absence has a name:
 *
 *   THE TWO PARTITIONS, BOTH WAYS. Family and plane, forward and reverse. The
 *   REVERSE direction is the one that reds when a thirty-second kind lands and
 *   nobody decides what it teaches — without it, "unclassified" and "deliberately
 *   silent" are the same green.
 *
 *   THE SILENT FALLBACK. An unrecognised token must collapse to a kind that
 *   teaches NOTHING. That single property is what keeps the schema closed, and it
 *   is asserted against the reader rather than against the constant.
 *
 *   THE SOURCE QUALIFICATION CENSUS. Every row carries the module that emits it,
 *   or `null` and `sourceUnverified`. The two may never disagree — a row claiming
 *   a receipt while marked unverified would be exactly the confusion the census
 *   exists to end.
 *
 *   THE RECONCILE PINS. The axis roster is MIRRORED from car L1, which is unlanded
 *   at this base; the moment the two cars share a tree these become live equality
 *   assertions, so the mirror cannot outlive its source silently.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: a loop-registered
 * suite is TEST_UNREGISTERED to the lighting census and its assertions are then
 * evidence nowhere, however green vitest reports it.
 *
 * @enforced-by this test
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  AMBIENT_EXPERIENCE_KINDS,
  EXPERIENCE_PLANES,
  EXPERIENCE_TABLE,
  LESSON_FAMILIES,
  LESSON_FAMILY_KINDS,
  LESSON_FAMILY_OF,
  LIVED_EXPERIENCE_KINDS,
  LIVED_EXPERIENCE_PROVENANCE,
  PARADIGM_AXIS_IDS,
  PLANE_KINDS,
  PULL_BANDS,
  PULL_POLES,
  RECEIPTED_EXPERIENCE_KINDS,
  RECEIPT_DARK_KINDS,
  SILENT_EXPERIENCE_KIND,
  SILENT_EXPERIENCE_KINDS,
  SOURCE_UNVERIFIED_KINDS,
  experienceKindOf,
  experienceRowOf,
  familyOfKind,
  planeOfKind,
  planeRank,
  pullsOfKind,
} from '../../../src/domain/npc/livedExperienceCatalog.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const L1_CATALOG = join(REPO_ROOT, 'src/domain/npc/paradigmAxisCatalog.js');

/** Every pull in the table, flattened, so a whole-table property reads once. */
const ALL_PULLS = LIVED_EXPERIENCE_KINDS.flatMap((kind) =>
  EXPERIENCE_TABLE[kind].pulls.map((pull) => ({ kind, ...pull })));

describe('THE FAMILY PARTITION — asserted both ways, which is the whole point', () => {
  test('every kind is classified exactly once: a lesson family, or the silent set', () => {
    const taught = Object.values(LESSON_FAMILY_KINDS).flatMap((kinds) => [...kinds]);
    const silent = [...SILENT_EXPERIENCE_KINDS];
    // FORWARD: nothing is classified that the vocabulary does not speak.
    for (const kind of [...taught, ...silent]) {
      expect(LIVED_EXPERIENCE_KINDS, `${kind} is classified but is not a kind`).toContain(kind);
    }
    // REVERSE: nothing the vocabulary speaks is left unclassified. THIS is the
    // direction that reds when a new kind lands and nobody decides what it teaches.
    expect([...taught, ...silent].sort()).toEqual([...LIVED_EXPERIENCE_KINDS].sort());
    // AND EXACTLY ONCE: a kind in two families would be taught at two rates.
    expect(new Set([...taught, ...silent]).size).toBe(LIVED_EXPERIENCE_KINDS.length);
    // anchored: the vocabulary is asserted non-trivial here, so an emptied kind
    // list could not make the three equalities above pass vacuously.
    // ⭐ 31 -> 32 AT THE SUBSTRATE COUPLING: `faith_milieu` was admitted, paying the
    // debt W-FAITH's witness adapter had carried in a reconcile pin since car F3c
    // (§806/F14). A DECLARED count shift, not a drift.
    // ⭐ 32 -> 33: ENC-3 lands `met_a_foreigner`, the chance-meeting lesson. It is the
    // FIRST row in this table whose vector is supplied by its adapter rather than held
    // here (`vectorSupplied`), because what a meeting teaches is a function of who was
    // met. Personal plane, bond family, non-ambient, span 1.
    expect(LIVED_EXPERIENCE_KINDS.length).toBe(33);
  });

  test('every family has kinds, and every kind\'s family is a real family', () => {
    expect(LESSON_FAMILIES.length).toBe(10);
    for (const family of LESSON_FAMILIES) {
      expect(LESSON_FAMILY_KINDS[family].length, `${family} teaches nothing`).toBeGreaterThan(0);
    }
    for (const kind of LIVED_EXPERIENCE_KINDS) {
      const family = LESSON_FAMILY_OF[kind];
      if (family === null) continue;
      expect(LESSON_FAMILIES, `${kind} names a family that is not on the ladder`).toContain(family);
    }
  });

  test('the family ladder is the pack\'s own order, heaviest first — the funnel derives its steps from it', () => {
    // Pinned as an ORDER because the funnel's per-family step is an index into it:
    // re-ordering this list silently re-tunes how hard every kind teaches.
    expect([...LESSON_FAMILIES]).toEqual([
      'ordeal', 'bond', 'fall', 'career', 'house', 'realm', 'creed', 'repute', 'word', 'milieu',
    ]);
  });
});

describe('THE PLANE PARTITION — the second, independent one', () => {
  test('every kind sits on exactly one plane, and every plane holds kinds', () => {
    const placed = Object.values(PLANE_KINDS).flatMap((kinds) => [...kinds]);
    expect([...placed].sort()).toEqual([...LIVED_EXPERIENCE_KINDS].sort());
    expect(new Set(placed).size).toBe(LIVED_EXPERIENCE_KINDS.length);
    for (const plane of EXPERIENCE_PLANES) {
      expect(PLANE_KINDS[plane].length, `${plane} holds no kinds`).toBeGreaterThan(0);
    }
  });

  test('the plane ORDER is the precedence law: personal is closest, witness is furthest', () => {
    expect([...EXPERIENCE_PLANES]).toEqual(['personal', 'affiliation', 'witness']);
    expect(planeRank('personal')).toBeLessThan(planeRank('affiliation'));
    expect(planeRank('affiliation')).toBeLessThan(planeRank('witness'));
    // An unknown plane sorts LAST, so a malformed declaration can never win a
    // precedence contest against a real one.
    expect(planeRank('invented')).toBeGreaterThan(planeRank('witness'));
    expect(planeRank(undefined)).toBeGreaterThan(planeRank('witness'));
  });

  test('the two partitions are INDEPENDENT — a family spans planes, a plane spans families', () => {
    // creed teaches on both personal (commitment) and affiliation (a god's fortunes).
    const creedPlanes = new Set(LESSON_FAMILY_KINDS.creed.map(planeOfKind));
    expect(creedPlanes.size).toBeGreaterThan(1);
    const personalFamilies = new Set(PLANE_KINDS.personal.map(familyOfKind));
    expect(personalFamilies.size).toBeGreaterThan(1);
  });
});

describe('THE SILENT FALLBACK — what keeps the schema closed', () => {
  test('any string outside the vocabulary reads as the silent kind', () => {
    expect(experienceKindOf('betrayed_by_friend')).toBe('betrayed_by_friend');
    expect(experienceKindOf('a_kind_from_the_future')).toBe(SILENT_EXPERIENCE_KIND);
    expect(experienceKindOf('')).toBe(SILENT_EXPERIENCE_KIND);
    expect(experienceKindOf(null)).toBe(SILENT_EXPERIENCE_KIND);
    expect(experienceKindOf(42)).toBe(SILENT_EXPERIENCE_KIND);
    expect(experienceKindOf({ kind: 'turned_by_crime' })).toBe(SILENT_EXPERIENCE_KIND);
  });

  test('the silent kind is the ONLY one in no family, and it carries no pulls', () => {
    expect([...SILENT_EXPERIENCE_KINDS]).toEqual([SILENT_EXPERIENCE_KIND]);
    expect(familyOfKind(SILENT_EXPERIENCE_KIND)).toBeNull();
    expect(pullsOfKind(SILENT_EXPERIENCE_KIND)).toEqual([]);
    // If it taught anything, an unrecognised token would move a soul — the exact
    // open-schema leak a closed vocabulary exists to prevent.
    expect(pullsOfKind('a_kind_from_the_future')).toEqual([]);
    expect(familyOfKind('a_kind_from_the_future')).toBeNull();
  });

  test('every accessor is TOTAL — an unknown kind never throws and never guesses', () => {
    expect(experienceRowOf('nonsense')).toBe(EXPERIENCE_TABLE[SILENT_EXPERIENCE_KIND]);
    expect(planeOfKind('nonsense')).toBe('witness');
    expect(EXPERIENCE_PLANES).toContain(planeOfKind('nonsense'));
  });
});

describe('THE SOURCE QUALIFICATION CENSUS — walked against this tree, carried in the table', () => {
  test('a receipt and its verdict can never disagree', () => {
    for (const kind of LIVED_EXPERIENCE_KINDS) {
      const row = EXPERIENCE_TABLE[kind];
      expect(row.sourceUnverified, `${kind}: receipt/verdict disagree`).toBe(row.receipt === null);
      // A row cannot be dark AND absent: darkness is a property of a receipt that
      // exists, so claiming both would be claiming a flag on nothing.
      if (row.receiptDark) expect(row.receipt, `${kind} is dark but has no receipt`).not.toBeNull();
    }
  });

  test('the measured verdicts: 12 of 32 kinds have no receipt at all', () => {
    // These are ACTUALS from a walk of this tree, not a target. If a source lands
    // (or is found to be a phantom) this figure moves and the row moves with it.
    expect(SOURCE_UNVERIFIED_KINDS.length).toBe(12);
    // ⭐ 19 -> 20: `faith_milieu` arrives RECEIPTED (its adapter is real and homed in
    // `worldPulse/faithWitnessSource.js`, declared there and resolved against the
    // tree by `ADAPTER_HOMED_ELSEWHERE`). The unverified figure does NOT move — this
    // landing added a source, it did not find one missing.
    // ⭐ 20 -> 21: `met_a_foreigner` arrives RECEIPTED, on the same footing faith_milieu
    // did — its adapter is real, homed out of leaf in the ENC-3 stage, and resolved
    // against the tree by `ADAPTER_HOMED_ELSEWHERE`. The UNVERIFIED figure does not move:
    // this landing added a source, it did not find one missing.
    expect(RECEIPTED_EXPERIENCE_KINDS.length).toBe(21);
    expect(SOURCE_UNVERIFIED_KINDS.length + RECEIPTED_EXPERIENCE_KINDS.length)
      .toBe(LIVED_EXPERIENCE_KINDS.length);
    expect([...SOURCE_UNVERIFIED_KINDS]).toEqual([
      'abandoned_unransomed', 'bereavement_close', 'betrayed_by_friend', 'converted_faith',
      'house_power_fell', 'house_power_rose', 'news_believed_atrocity', 'news_believed_triumph',
      'plague_season_survived', 'refused_by_patron', 'survived_battle', 'took_holy_orders',
    ]);
  });

  test('three of the twenty receipted kinds are DARK — lit in no preset', () => {
    // ⭐ WAS FOUR. Car L4 executed the real preset table instead of reading the flag
    // file, and `festival_kept` moved out: `traditionsEnabled` rides the ONE_REGEN
    // fragment and is lit in dramatic_campaign, living_realm and full_simulation.
    // The three below are lit in ZERO presets — npcCredibilityEnabled,
    // npcConsequencesEnabled and infoStatecraftEnabled all return an empty list.
    expect([...RECEIPT_DARK_KINDS]).toEqual([
      'caught_lying_exposed', 'pardoned_released', 'turned_by_crime',
    ]);
    // The collection is asserted LIVE and non-trivial first, so the exclusions
    // below cannot pass because the unverified list drifted away to nothing.
    expect(SOURCE_UNVERIFIED_KINDS.length).toBe(12);
    for (const kind of RECEIPT_DARK_KINDS) {
      // anchored: SOURCE_UNVERIFIED_KINDS is pinned at 12 members one line above
      expect(SOURCE_UNVERIFIED_KINDS, `${kind} cannot be both dark and absent`).not.toContain(kind);
    }
  });

  test('the strongest source is named, and it is the one behind no flag at all', () => {
    // corruption_exposed rides `advanceNpcCorruption`, called unconditionally by the
    // pulse. If this row ever grows a flag, the funnel's only default-on personal
    // source has gone dark and somebody should have to notice.
    const row = EXPERIENCE_TABLE.corruption_exposed;
    expect(row.sourceUnverified).toBe(false);
    expect(row.receiptDark).toBe(false);
    expect(row.receipt).toContain('npcAgency.js');
  });

  test('every receipted kind names a module, not a hope', () => {
    for (const kind of RECEIPTED_EXPERIENCE_KINDS) {
      const receipt = EXPERIENCE_TABLE[kind].receipt;
      expect(typeof receipt, `${kind}`).toBe('string');
      expect(receipt.length, `${kind} names an empty receipt`).toBeGreaterThan(3);
    }
  });
});

describe('PULLS ARE BAND WORDS — no float can enter this table', () => {
  test('every pull names a real axis, a real pole and a real band word', () => {
    expect(ALL_PULLS.length).toBeGreaterThan(40);
    for (const pull of ALL_PULLS) {
      expect(PARADIGM_AXIS_IDS, `${pull.kind} pulls on a non-axis`).toContain(pull.axisId);
      expect(PULL_POLES, `${pull.kind} names a non-pole`).toContain(pull.pole);
      expect(PULL_BANDS, `${pull.kind} names a non-band`).toContain(pull.band);
    }
  });

  test('NO NUMBER appears anywhere in the table — magnitudes live in the funnel\'s signable row', () => {
    // Serialized rather than walked: a number smuggled into any nested position of
    // any row would show here, including one nobody thought to write an accessor for.
    const serialized = JSON.stringify(EXPERIENCE_TABLE);
    // The subject is asserted LIVE first: a table that serialized to `{}` would
    // satisfy the exclusion below for entirely the wrong reason.
    expect(serialized).toContain('betrayed_by_friend');
    expect(serialized.length).toBeGreaterThan(2000);
    // anchored: the serialized table is pinned non-empty and content-bearing above
    expect(serialized).not.toMatch(/:\s*-?\d/);
  });

  test('a kind never pulls the same axis twice — that would teach one axis at two rates', () => {
    for (const kind of LIVED_EXPERIENCE_KINDS) {
      const axes = EXPERIENCE_TABLE[kind].pulls.map((pull) => pull.axisId);
      expect(new Set(axes).size, `${kind} pulls one axis twice`).toBe(axes.length);
    }
  });

  test('the ambient kinds are declared, and NEITHER milieu row carries a fixed vector', () => {
    // ⭐ `faith_milieu` joined at the substrate coupling (§806/F14). Codepoint order.
    expect([...AMBIENT_EXPERIENCE_KINDS]).toEqual(['dwell_milieu', 'faith_milieu', 'plague_season_survived']);
    // §800.4 makes the milieu vector a READ of the host settlement, so a constant
    // here would be a variable frozen — the adapter supplies it, the funnel checks it.
    expect(pullsOfKind('dwell_milieu')).toEqual([]);
    expect(EXPERIENCE_TABLE.dwell_milieu.ambient).toBe(true);
    // …and the faith row is empty for a DIFFERENT reason — its vector is a read of
    // the DEITY'S authored chart, demoted by exposure. Same shape, different teacher,
    // and the funnel accepts a caller-supplied vector only on exactly this shape.
    expect(pullsOfKind('faith_milieu')).toEqual([]);
    expect(EXPERIENCE_TABLE.faith_milieu.ambient).toBe(true);
    expect(EXPERIENCE_TABLE.faith_milieu.receipt).not.toBe(EXPERIENCE_TABLE.dwell_milieu.receipt);
  });
});

describe('OWNER-UNSIGNED, and it says which calls are the pen\'s', () => {
  test('the table declares itself a candidate and names its rows', () => {
    expect(LIVED_EXPERIENCE_PROVENANCE.signedBy).toBeNull();
    expect(LIVED_EXPERIENCE_PROVENANCE.status).toContain('OWNER-UNSIGNED');
    expect(LIVED_EXPERIENCE_PROVENANCE.consumers).toContain('NONE in production');
    expect(LIVED_EXPERIENCE_PROVENANCE.ownerRows.length).toBeGreaterThanOrEqual(6);
  });

  test('the census raised its own rows, including the second-funnel fork', () => {
    const raised = LIVED_EXPERIENCE_PROVENANCE.raisedByCensus.join(' ');
    // The finding that outranks the rest: a lived-experience funnel already exists,
    // lit, keyed on the positional id L2 refuted. If this row is ever dropped, the
    // fork gets decided by silence.
    expect(raised).toContain('npcGrowthKernel');
    expect(raised).toContain('whereabouts');
    expect(LIVED_EXPERIENCE_PROVENANCE.raisedByCensus.length).toBeGreaterThanOrEqual(5);
  });

  test('the two rows whose SHAPE is an open owner call are marked, not guessed', () => {
    // captured_held: the register drafts a SEEDED fork (hardens or breaks) weighted
    // by current COURAGE. This leaf is pure, so the COURAGE half is ABSENT rather
    // than invented — an axis silently chosen here would answer an owner question.
    expect(EXPERIENCE_TABLE.captured_held.ownerRulingPending).toBe(true);
    expect(EXPERIENCE_TABLE.captured_held.pulls.map((p) => p.axisId)).toEqual(['TRUST']);
    expect(EXPERIENCE_TABLE.refused_by_patron.ownerRulingPending).toBe(true);
    expect(EXPERIENCE_TABLE.dwell_milieu.ownerRulingPending).toBe(true);
  });
});

describe('RECONCILE PINS — the mirror cannot outlive its source silently', () => {
  test('the axis roster is no longer a mirror at all — it is DERIVED from car L1', () => {
    // ⭐⭐ THE PIN OUTLIVED THE PROBLEM. This was a regex scrape of L1's source with a
    // dead `existsSync` arm; at the substrate coupling the roster stopped being a
    // hand-kept list and became `PARADIGM_AXES.map((axis) => axis.id)`. There is no
    // second list to drift, so what is left to assert is that the derivation is real
    // and non-trivial. The four-mirror census lives in L1's own suite.
    expect(existsSync(L1_CATALOG)).toBe(true);
    expect(PARADIGM_AXIS_IDS.length).toBe(17);
    expect([...PARADIGM_AXIS_IDS]).toEqual([...PARADIGM_AXIS_IDS].sort());
    // anchored: a derived roster that read back empty would satisfy a sorted-ness
    // check trivially, so the membership of a known axis is asserted live.
    expect(PARADIGM_AXIS_IDS).toContain('MERCY');
  });

  test('every (axis, pole) this table pulls on must resolve to a real pole word in L1', () => {
    if (!existsSync(L1_CATALOG)) {
      // Anchored the same way: the roster is asserted non-trivial and every pull is
      // asserted against it, so this car is not merely deferring the whole check.
      expect(new Set(ALL_PULLS.map((pull) => pull.axisId)).size).toBeGreaterThan(10);
      return;
    }
    const source = readFileSync(L1_CATALOG, 'utf8');
    for (const pull of ALL_PULLS) {
      const block = new RegExp(`id: '${pull.axisId}',[\\s\\S]*?${pull.pole}: Object\\.freeze\\(\\{ word: '([a-z-]+)'`);
      const found = block.exec(source);
      expect(found, `${pull.kind}: ${pull.axisId}.${pull.pole} has no pole word in L1`).toBeTruthy();
      expect(found[1].length).toBeGreaterThan(2);
    }
  });
});
