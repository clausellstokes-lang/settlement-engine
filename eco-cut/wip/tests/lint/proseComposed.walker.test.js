/**
 * proseComposed.walker.test.js — THE NEW ARMS ON THE LANDED INSTRUMENTS (ARCH §8.4, SEAM car 5).
 *
 * ── WHAT THIS FILE IS ──────────────────────────────────────────────────────────────
 * ARCH §8.4 is a table: one row per property the composed model must hold, naming the
 * instrument that gates it today and the arm that is NEW. This file is the executable half of
 * the "new or extended" column. Every arm here CONVICTS A PLANTED CONTROL and PASSES A CLEAN
 * ONE, and every arm whose INPUT is absent at this tip declares itself NOT-EXECUTABLE and says
 * which column it wanted — never `[]`, and never a silent pass (the §908 law).
 *
 * ── WHAT IS NOT-EXECUTABLE AT THIS TIP, AND WHY THAT IS THE HONEST ANSWER ─────────
 * The composed model has no composed content yet. No shipped pool declares `role: modifier`
 * (car 4d's tally: 708 sentence / 0 clause, every one `not-a-modifier`), every shipped variant
 * carries ONE face, and the relation table joins nothing a desk reads (car 0's F1). So the
 * arms that judge a modifier, a face or a joint have nothing shipped to judge, and they say
 * so out loud on the shipped corpus while being fully driven on fixtures. An arm that answered
 * "no findings" on that corpus would be reporting the absence of content as the absence of
 * defects, which is the false green this estate has already paid for twice.
 *
 * ── THE ONE READING OVER THE SHIPPED CORPUS THAT IS REAL, AND IT IS HELD SHRINK-ONLY ─
 * A0b judges a SPINE against the census, so it runs today: 55 over-claims, 1,282 under-claims
 * and 13 implicit negations over 2,266 variants. That is the AUTHORING debt the rewrite wave
 * inherits, measured before a byte of it moves, and it is held as a ceiling that may not GROW
 * rather than as an exact integer, because a heuristic pinned exactly becomes a re-record every
 * car pays and nobody reads.
 *
 * ⚠ AND THE READING'S BASIS MOVED ONCE, at the ECONOMY leaf's granary row (R-ECO-4). The walk
 * now passes the RATIFIED field-synonym vocabulary that table's own docblock names this arm a
 * consumer of, as the wave gate and the entry walker already did. The figures at that tip go
 * 55 / 1273 / 13 on the old basis to 55 / 1250 / 11 on this one, and the CEILINGS are
 * deliberately NOT followed down in the same commit that moved the basis. See the call site.
 *
 * @enforced-by scripts/mutation-sweep.sh (plant 97)
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  armA0b, armA1, armA11, armA13, armA3, armA5, armA6, armA9, armAmbiguity, armAspect, armC7,
  armRestatement, armTail, armThread,
  claimTokensOf, claimsField, composedEntryOf, composedOrderOf, composedVerdictOf,
  COMPOSED_ARMS, provenanceCount, reWalkBlock, sampleOf, siblingDistance, walkComposed,
} from '../../src/domain/prose/composedWalker.js';
import { armA2 } from '../../src/domain/prose/composedWalker.js';
import { fieldSynonymsFor } from '../../src/domain/prose/fieldSynonyms.js';
import { composedOrderIdOf, LEVEL1_ORDERS, LEVEL2_ORDERS, MOVES } from '../../src/domain/prose/moveGrammar.js';
import { estateGround, withEntryContext } from '../../src/domain/prose/entryGround.js';
import { composeStateProse, composeStateProseMount } from '../../src/domain/display/stateProse/composeStateProse.js';
import { assertPoolDeclaration, TURN_KEY_REGISTRY, turnKeyStanding } from '../../scripts/lib/dossier-annex-grammar.mjs';
import { bandSiblingsOf, pairArms } from '../../scripts/check-pair.mjs';
import { loadStateLeaves } from '../helpers/dossierCorpus.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { DOSSIER_RELATIONS } from '../../src/data/dossierRelations.generated.js';
import { capturedRulingStructure, HOLDER_RECORDS, sourceOfForTown } from '../../src/domain/prose/holderTable.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { FACTION_ROLES } from '../../src/generators/factionRoles.js';
import * as ROLE_CATALOG from '../../src/generators/npc/factionRoleCatalog.js';
import { POWER_ROLES_BY_CATEGORY } from '../../src/data/historyData.js';
import { ROLE_CATEGORY_KEYWORDS } from '../../src/generators/roleCategory.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const census = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
const censusByPool = new Map(census.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));
const corpus = await loadStateLeaves();

/**
 * The office roster, DERIVED from the role catalogues exactly as
 * `proseEntryContradiction.walker.test.js` derives it and never transcribed.
 *
 * ⛔ IT MATTERS TO EVERY PRINTED FIGURE BELOW. A first cut handed the ground seven hand-written
 * roles, and the block re-walk then read 12 FAIL of 12 on DS-DEF-11 and 164 of 200 on the
 * sample — every one of them C2 reporting an office the roster did not hold, which is a
 * property of the fixture and not of the corpus. A walker printing a number it manufactured is
 * the false green this whole file exists to refuse.
 * @returns {string[]}
 */
function deriveOfficeRoster() {
  /** @type {Set<string>} */
  const roles = new Set();
  for (const list of Object.values(FACTION_ROLES)) for (const entry of list) if (entry.role) roles.add(entry.role);
  for (const value of Object.values(ROLE_CATALOG)) {
    if (!Array.isArray(value)) continue;
    for (const entry of value) {
      if (entry?.role) roles.add(entry.role);
      if (entry?.title) roles.add(entry.title);
    }
  }
  for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) {
    if (!Array.isArray(rows)) continue;
    for (const entry of rows) {
      if (entry?.role) roles.add(entry.role);
      if (entry?.title) roles.add(entry.title);
    }
  }
  for (const list of Object.values(ROLE_CATEGORY_KEYWORDS)) for (const keyword of list) roles.add(keyword);
  return [...roles].sort();
}

/** The estate ground every walk below runs against. */
const GROUND = estateGround({ officeRoster: deriveOfficeRoster() });

/** The three `proper`-typed slots of the brief's own slot census. */
const PROPER_SLOTS = Object.freeze(['settlement', 'faction', 'institution']);

/** A fixture corpus with one block, one spine and one modifier, wired for the composer. */
function fixtureCorpus(options = {}) {
  const spine = options.spine || 'The tithe is taken at the bridge.';
  const modifier = options.modifier || 'the fisherfolk are spared';
  return {
    'DS-FIX-1': {
      title: 'Fixture',
      slots: [],
      pools: {
        'toll: taken': [{ angle: 'ledger', slots: [], text: spine }],
        'exemption: granted': [{ angle: 'ledger', slots: [], text: modifier }],
      },
      poolMeta: {
        'toll: taken': { role: 'spine', readsCount: 1 },
        'exemption: granted': {
          role: 'modifier',
          relation: options.relation || 'consequence',
          seat: options.seat || 'clause',
          form: 'fragment',
          attach: ['toll: taken'],
        },
      },
    },
  };
}

/** The connective leaves a fixture composes with; the shipped floors carry no clause joint. */
const FIXTURE_LEAVES = Object.freeze({
  connectives: Object.freeze({
    addition: Object.freeze({ sentence: Object.freeze(['']) }),
    contrast: Object.freeze({ sentence: Object.freeze(['']) }),
    tension: Object.freeze({ sentence: Object.freeze(['']) }),
    consequence: Object.freeze({ clause: Object.freeze([' where']) }),
  }),
  norms: Object.freeze({}),
  relations: Object.freeze({}),
});

/**
 * One shipped variant as the one-piece composed unit it composes to today.
 *
 * ⛔ THE DECLARED SLOTS AND MARKS TRAVEL WITH THE PIECE, and that is not tidiness. A first cut
 * dropped them, so `composedEntryOf` built an entry declaring NO slots over a text naming
 * `{settlement}`, and arm D reported "a slot the variant does not declare" on 18 of DS-DEF-11's
 * rows: 12 FAIL of 12 units, every one manufactured by the driver. A composed walk that loses
 * the licence half of a piece measures its own harness.
 * @param {{block: string, pool: string, id: string, text: string,
 *   slots: ReadonlyArray<string>, marks: ReadonlyArray<string>}} entry
 */
function unitOfEntry(entry) {
  return {
    blockId: entry.block,
    poolKey: entry.pool,
    id: entry.id,
    text: entry.text,
    pieces: [{
      role: 'spine', key: entry.pool, text: entry.text, slots: entry.slots, marks: entry.marks,
    }],
  };
}

/** One composed unit row from a composer result plus the piece texts the walker needs. */
function unitRowOf(unit, texts) {
  return {
    blockId: unit.blockId,
    poolKey: unit.poolKey,
    text: unit.text,
    pieces: unit.pieces.map((piece) => ({
      role: piece.role,
      key: piece.key,
      text: texts[piece.key],
      relation: piece.relation,
      declaredRelation: piece.relation,
      seat: piece.seat,
    })),
  };
}

describe('GUARD THE GUARD — the inputs this file judges are the real ones', () => {
  it('the corpus, the census and the relation leaf are the shipped ones, not empty stubs', () => {
    expect(corpus.length, 'the shipped state corpus').toBe(2266);
    expect(census.rows.length, 'the committed wiring census').toBe(708);
    expect(Object.keys(DOSSIER_RELATIONS).length, 'the committed relation leaf').toBe(165);
    // Every arm this module owns is exercised below; a roster that quietly shrank would make
    // a whole describe disappear with nothing red.
    expect([...COMPOSED_ARMS].sort()).toEqual([
      'A0b', 'A1', 'A11', 'A13', 'A2', 'A3', 'A5', 'A6', 'A9', 'Ambiguity', 'Aspect', 'C7',
      'Restatement', 'Tail', 'Thread',
    ]);
  });

  it('THE SHIPPED STATE the not-executable arms rest on, asserted rather than assumed', () => {
    const withMeta = corpus.filter((entry) => {
      const row = censusByPool.get(`${entry.block} :: ${entry.pool}`);
      return row && row.status === 'RESOLVED';
    });
    expect(withMeta.length, 'the census resolved this many variant readings').toBeGreaterThan(0);
    const faces = corpus.filter((entry) => Array.isArray(entry.wordings) && entry.wordings.length);
    expect(faces, 'no shipped variant carries a wording set, so A5 and A6 are fixture-driven').toEqual([]);
    const modifiers = census.rows.filter((row) => row.attach.length > 0);
    expect(modifiers, 'no shipped pool declares an attach set, so A2, A9 and A11 are fixture-driven').toEqual([]);
  });
});

describe('THE COMPOSED UNIT AS THE WALKED ENTRY (S17)', () => {
  it('the entry takes the UNION of the pieces\' marks and slots, not the spine\'s', () => {
    const entry = composedEntryOf({
      blockId: 'DS-FIX-1',
      poolKey: 'a',
      text: 'The wall stands. The muster is thin.',
      pieces: [
        { role: 'spine', key: 'a', text: 'The wall stands.', slots: ['settlement'], marks: [] },
        { role: 'modifier', key: 'b', text: 'The muster is thin.', slots: ['institution'], marks: ['dm-only'] },
      ],
    });
    expect(entry.slots).toEqual(['settlement', 'institution']);
    expect(entry.marks).toEqual(['dm-only']);
    expect(entry.text).toBe('The wall stands. The muster is thin.');
  });

  it('⛔ THE COMPOSED ANTI-VACUITY CONTROL: two innocent pieces manufacture a C2 pair', () => {
    // The point of walking the JOIN. Each half is clean; the composition puts a duty word and
    // an ambiguous exemption lemma in ONE clause, and C2's clause-local licensing then fires
    // against a `whoIsExempt` column that is null on every settlement the product generates.
    const texts = { 'toll: taken': 'The tithe is taken at the bridge.', 'exemption: granted': 'the fisherfolk are spared' };
    for (const [name, text] of Object.entries(texts)) {
      const half = walkComposed({
        blockId: 'DS-FIX-1', poolKey: name, text, pieces: [{ role: 'spine', key: name, text }],
      }, withEntryContext(GROUND, { siblings: [{ id: 'sib', text: 'The bridge is kept.' }] }));
      expect(half.entry.fails.map((f) => f.klass), `the ${name} half alone is clean`).toEqual([]);
    }
    const unit = composeStateProse(fixtureCorpus(), 'DS-FIX-1', {
      spineKey: 'toll: taken',
      candidates: [{ key: 'exemption: granted' }],
      seed: 'seed-1',
      leaves: FIXTURE_LEAVES,
    });
    expect(unit.text).toBe('The tithe is taken at the bridge where the fisherfolk are spared.');
    const walked = walkComposed(
      unitRowOf(unit, texts),
      withEntryContext(GROUND, { siblings: [{ id: 'sib', text: 'The bridge is kept.' }] }),
    );
    expect(walked.entry.fails.map((f) => `${f.klass}/${f.arm}`))
      .toEqual(['C2/exemption on a null column']);
    expect(composedVerdictOf(walked)).toBe('FAIL');
  });

  it('a verdict of PASS means no FAIL and never "nothing was found"', () => {
    const clean = walkComposed({
      blockId: 'DS-FIX-1', poolKey: 'a', text: 'The bridge is kept in repair.',
      pieces: [{ role: 'spine', key: 'a', text: 'The bridge is kept in repair.' }],
    }, withEntryContext(GROUND, { siblings: [{ id: 'sib', text: 'The bridge is down.' }] }));
    expect(composedVerdictOf(clean)).toBe('PASS');
    const withheld = { entry: { fails: [], withheld: [{}], notes: [], notExecutable: [] }, composed: { fails: [], withheld: [], reports: [], notExecutable: [] } };
    expect(composedVerdictOf(/** @type {any} */ (withheld))).toBe('WITHHELD');
  });
});

describe('A0a — the projector refuses a READS the census does not list (set containment)', () => {
  const base = {
    blockId: 'DS-FIX-1',
    poolKey: 'toll: taken',
    variants: [{
      angle: 'ledger', marks: [], text: 'The tithe is taken.', slots: [], index: 1,
    }],
    isCovert: () => false,
    edgesFrom: () => [],
    blockPoolKeys: new Set(['toll: taken']),
    declaredRoleByPool: { 'toll: taken': 'spine' },
    censusOf: () => ({
      tests: ['tolls.taken', 'tolls.rate'], reads: ['tolls.taken'], objectClass: null, sites: [],
    }),
  };

  it('the CLEAN control passes: a READS inside the census tests', () => {
    expect(() => assertPoolDeclaration({ ...base, declared: { role: 'spine', reads: ['tolls.taken'] } })).not.toThrow();
  });

  it('⛔ THE PLANT: a READS outside the tests is refused by name', () => {
    expect(() => assertPoolDeclaration({ ...base, declared: { role: 'spine', reads: ['tolls.exemptions'] } }))
      .toThrow(/READS `tolls.exemptions`, which the wiring census does not list/);
  });
});

describe('A0b — the text claims every declared field and no other', () => {
  const universe = ['walls', 'garrison', 'militia'];

  it('claimTokensOf splits a dotted, camel-cased path into the words prose would spell', () => {
    // Longest first, so a plural is tried before the singular it contains.
    expect(claimTokensOf('defenseProfile.economicGates.military')).toEqual(['militarys', 'military']);
    expect(claimTokensOf('walls')).toEqual(['walls', 'wall']);
    expect(claimsField('The walls stand and the militia turns out.', 'walls')).toBe('walls');
    expect(claimsField('{settlement} keeps its own rolls.', 'settlement')).toBe('{settlement}');
    expect(claimsField('The bridge is kept.', 'garrison')).toBe('');
  });

  it('the CLEAN control passes: the text claims exactly what the pool reads', () => {
    const out = armA0b({
      id: 'clean',
      text: 'The walls stand and a citizen militia turns out behind them, with no garrison in the town.',
      reads: universe,
      universe,
      predicate: [],
    });
    expect(out.fails).toEqual([]);
  });

  it('⛔ PLANT 1 — OVER-CLAIM: the text names a field the pool does not read', () => {
    const out = armA0b({
      id: 'over',
      text: 'The walls stand and a professional garrison holds them.',
      reads: ['walls'],
      universe,
      predicate: [],
    });
    expect(out.fails.map((f) => f.subject)).toContain('over-claim');
    expect(out.fails.find((f) => f.subject === 'over-claim').value).toMatch(/^garrison/);
  });

  it('⛔ PLANT 2 — UNDER-CLAIM: a declared field the text never claims', () => {
    const out = armA0b({
      id: 'under',
      text: 'The walls stand.',
      reads: ['walls', 'militia'],
      universe,
      predicate: [{ field: 'militia', op: 'truthy', value: '(no literal)' }],
    });
    expect(out.fails.map((f) => `${f.subject}:${f.value}`)).toEqual(['under-claim:militia']);
  });

  it('⛔ PLANT 3 — IMPLICIT NEGATION: the branch reaches the key only when the field is FALSE', () => {
    // ARCH §4.4's own case: `invasionRowPoolKey`'s `walls with citizen militia` is reached only
    // when `garrison` is false (`defenseStateProse.js:412-425`, the branch SEAM car 3h tabled).
    const out = armA0b({
      id: 'invasion',
      text: 'Walls at {settlement} with townspeople behind them, credible against raiders.',
      reads: universe,
      universe,
      predicate: [
        { field: 'walls', op: 'truthy', value: '(no literal)' },
        { field: 'garrison', op: 'falsy', value: '(no literal)' },
        { field: 'militia', op: 'truthy', value: '(no literal)' },
      ],
    });
    const negation = out.fails.filter((f) => f.subject === 'implicit-negation');
    expect(negation.map((f) => f.value)).toEqual(['garrison']);
    expect(negation[0].description).toMatch(/discriminates on a fact it does not state/);
  });

  it('NOT-EXECUTABLE twice over, each naming its own column', () => {
    const noReading = armA0b({ id: 'none', text: 'The walls stand.', reads: [] });
    expect(noReading.fails).toEqual([]);
    expect(noReading.notExecutable.map((f) => f.value)).toEqual(['not recovered']);
    // ⚠ THE SECOND ONE IS NOT HYPOTHETICAL. SEAM car 3h tabled DS-DEF-2's four key functions,
    // so the block ARCH works its fact-budget example on now reads ONE synthetic table label
    // per row and this arm can ask nothing of it. Named rather than counted as a pass.
    const shipped = censusByPool.get('DS-DEF-2 :: Invasion & War: walls with citizen militia');
    expect(shipped.reads).toHaveLength(1);
    const synthetic = armA0b({ id: 'DS-DEF-2', text: 'Walls at {settlement}.', reads: shipped.reads });
    expect(synthetic.fails).toEqual([]);
    expect(synthetic.notExecutable[0].description).toMatch(/synthetic table label/);
  });

  it('⭐ THE SHIPPED CORPUS READING, printed and held SHRINK-ONLY', () => {
    const tally = {
      'over-claim': 0, 'under-claim': 0, 'implicit-negation': 0,
    };
    let notExecutable = 0;
    /** @type {Set<string>} */
    const pools = new Set();
    for (const entry of corpus) {
      const row = censusByPool.get(`${entry.block} :: ${entry.pool}`);
      const out = armA0b({
        id: `${entry.block} :: ${entry.pool}`,
        text: entry.text,
        reads: row ? row.reads : [],
        universe: row ? row.fieldsRead : [],
        predicate: row ? row.predicate : [],
        // ⛔⛔ THE RATIFIED VOCABULARY, WHICH THIS READING WENT WITHOUT UNTIL R-ECO-4 AND WHICH
        // ITS TWO SIBLING CONSUMERS ALREADY PASS. `fieldSynonyms.js`'s own docblock names this
        // arm — "the column widens what arm Q, F25 and A0b can SEE" — and both
        // `prose-wave-gate.mjs:1712` and `proseEntryContradiction.walker.test.js:798` hand
        // `fieldSynonymsFor(row)` to the walker. This call did not, so the one instrument holding
        // the ratchet was the one instrument blind to the table the estate ratifies rows into: a
        // chair could sign a synonym and the gate would still convict the spine that used it.
        // ⚠ THE BASIS OF THE PRINTED FIGURES THEREFORE MOVED ONCE, at the ECONOMY leaf's granary
        // row, and the shift is declared rather than absorbed: on the OLD basis the tip read
        // 55 / 1273 / 13 and on this one it reads 55 / 1250 / 11. The CEILINGS below are NOT
        // followed down in the same commit that moved the basis — a re-record and a basis change
        // landing together is exactly the pair a later reader cannot take apart. DEFERRED,
        // DELIBERATELY, AND WRITTEN DOWN: the next car that touches this arm should tighten
        // 1282 -> 1250 and 13 -> 11 once a second measurement on this basis exists.
        vocabulary: row ? fieldSynonymsFor(row) : {},
      });
      for (const finding of out.fails) {
        tally[finding.subject] += 1;
        pools.add(finding.id);
      }
      notExecutable += out.notExecutable.length;
    }
    console.log(`\nA0b · the AUTHORING debt on the shipped corpus, before a byte of the rewrite moves`
      + `\n  variants walked      ${corpus.length}`
      + `\n  over-claims          ${tally['over-claim']}`
      + `\n  under-claims         ${tally['under-claim']}`
      + `\n  implicit negations   ${tally['implicit-negation']}`
      + `\n  NOT-EXECUTABLE reads ${notExecutable}   pools carrying a finding ${pools.size}\n`);
    // NON-VACUITY FIRST: an arm reporting nothing on 2,266 variants has stopped reading.
    expect(tally['under-claim']).toBeGreaterThan(0);
    expect(tally['implicit-negation']).toBeGreaterThan(0);
    // SHRINK-ONLY, and NOT an exact pin. The rewrite wave pays this debt down; a car that
    // ADDS a claim the census does not license reds here on the day it lands.
    expect(tally['over-claim']).toBeLessThanOrEqual(55);
    expect(tally['under-claim']).toBeLessThanOrEqual(1282);
    expect(tally['implicit-negation']).toBeLessThanOrEqual(13);
    expect(pools.size).toBeLessThanOrEqual(240);
  });
});

describe('A1 — a modifier neither restates nor negates its spine', () => {
  const unitOf = (spineText, modifierText) => ({
    blockId: 'DS-FIX-1',
    poolKey: 'spine',
    text: `${spineText} ${modifierText}`,
    pieces: [
      { role: 'spine', key: 'spine', text: spineText },
      { role: 'modifier', key: 'modifier', text: modifierText },
    ],
  });

  it('the CLEAN control passes: two pieces band two different nouns', () => {
    expect(armA1(unitOf('A few households keep the wall.', 'Dozens of carts cross the bridge.')).fails).toEqual([]);
  });

  it('⛔ THE RESTATEMENT PLANT: two pieces band ONE noun the same way', () => {
    const out = armA1(unitOf('A few households remain.', 'A handful of households keep the mill.'));
    expect(out.fails.map((f) => f.subject)).toEqual(['restatement']);
    expect(out.fails[0].value).toMatch(/^households/);
  });

  it('⛔ THE CONFLICT PLANT: two pieces band ONE noun into disjoint classes', () => {
    const out = armA1(unitOf('A few households remain.', 'Many hundreds of households remain.'));
    expect(out.fails.map((f) => f.subject)).toEqual(['conflict']);
  });

  it('NOT-EXECUTABLE on a bare spine, which is every shipped unit at this tip', () => {
    const bare = armA1({
      blockId: 'DS-FIX-1', poolKey: 'spine', text: 'The wall stands.',
      pieces: [{ role: 'spine', key: 'spine', text: 'The wall stands.' }],
    });
    expect(bare.fails).toEqual([]);
    expect(bare.notExecutable.map((f) => f.arm)).toEqual(['A1']);
  });
});

describe('A2 — the joint is licensed by the relation table, in the right direction', () => {
  const joint = (declaredRelation) => ({
    blockId: 'DS-FIX-1',
    poolKey: 'spine',
    text: 'The stores are short, and the muster is thin.',
    pieces: [
      { role: 'spine', key: 'spine', text: 'The stores are short.' },
      {
        role: 'modifier', key: 'modifier', text: 'the muster is thin', declaredRelation, relation: declaredRelation, seat: 'clause',
      },
    ],
  });
  const options = (relations) => ({
    relations,
    primaryOf: () => 'condition:plague',
    fieldOf: () => 'system:food_security',
  });

  it('the CLEAN control passes: the pair carries a forward row of the declared relation', () => {
    const out = armA2(joint('consequence'), options({ 'condition:plague|system:food_security': [{ relation: 'consequence', direction: 'a→b' }] }));
    expect(out.fails).toEqual([]);
    expect(out.withheld).toEqual([]);
  });

  it('⛔ THE PLANT: both endpoints are in the table\'s vocabulary and no row joins them', () => {
    const out = armA2(joint('consequence'), options({
      'condition:plague|system:law_order': [{ relation: 'consequence', direction: 'a→b' }],
      'system:food_security|system:trade': [{ relation: 'consequence', direction: 'a→b' }],
    }));
    expect(out.fails.map((f) => f.subject)).toEqual(['no row']);
  });

  it('a row that runs modifier to spine is a CAUSE and is WITHHELD, not failed', () => {
    const out = armA2(joint('consequence'), options({ 'condition:plague|system:food_security': [{ relation: 'consequence', direction: 'b→a' }] }));
    expect(out.fails).toEqual([]);
    expect(out.withheld.map((f) => f.subject)).toEqual(['direction unread']);
  });

  it('⭐ THE SHIPPED STATE: every joint over the committed leaf is WITHHELD, not failed', () => {
    // Car 0's F1: none of the 165 engine rows joins a desk read root, so no endpoint a desk
    // could name is a member of the table's vocabulary. That is an UNESTABLISHED join and not
    // a negative answer, and calling it a FAIL would blame authors for an unratified table.
    const out = armA2(joint('consequence'), {
      relations: DOSSIER_RELATIONS,
      primaryOf: () => 'walls',
      fieldOf: () => 'defenseProfile.economicGates.military',
    });
    expect(out.fails).toEqual([]);
    expect(out.withheld.map((f) => f.subject)).toEqual(['unestablished join']);
    // NON-VACUITY: the leaf really does carry rows, so the WITHHELD is about the JOIN and not
    // about an empty table.
    expect(Object.keys(DOSSIER_RELATIONS).length).toBeGreaterThan(100);
  });

  it('NOT-EXECUTABLE with no joint, with no table, and with no primary field', () => {
    const bare = armA2({
      blockId: 'b', poolKey: 'p', text: 'x', pieces: [{ role: 'spine', key: 'p', text: 'x' }],
    }, {});
    expect(bare.notExecutable.map((f) => f.subject)).toEqual(['(joints)']);
    expect(armA2(joint('consequence'), {}).notExecutable.map((f) => f.subject)).toEqual(['(relation leaf)']);
    expect(armA2(joint('consequence'), { relations: DOSSIER_RELATIONS }).notExecutable.map((f) => f.subject))
      .toEqual(['(primary field)']);
  });
});

describe('A3 — wall 5: a contrast needs a sibling that names the rejected alternative', () => {
  const contrast = {
    blockId: 'DS-FIX-1',
    poolKey: 'readiness: thin',
    text: 'The town turns out its own people rather than paying a garrison.',
    pieces: [{ role: 'spine', key: 'readiness: thin', text: 'The town turns out its own people rather than paying a garrison.' }],
  };

  it('the CLEAN control passes: no contrast shape, nothing for wall 5 to license', () => {
    const out = armA3({
      blockId: 'DS-FIX-1', poolKey: 'p', text: 'The town keeps a garrison.', pieces: [],
    }, { siblingKeys: ['readiness: strong'] });
    expect(out.fails).toEqual([]);
    expect(out.notExecutable.map((f) => f.subject)).toEqual(['(contrast shape)']);
  });

  it('a contrast licensed by a sibling KEY is a REPORT, naming the word that licensed it', () => {
    const out = armA3(contrast, { siblingKeys: ['readiness: paid garrison'] });
    expect(out.fails).toEqual([]);
    expect(out.reports.map((f) => f.subject)).toEqual(['licensed by a sibling key']);
    expect(out.reports[0].value).toMatch(/garrison/);
  });

  it('⛔ THE PLANT: a contrast in a block with NO sibling at all', () => {
    const out = armA3(contrast, { siblingKeys: [] });
    expect(out.fails.map((f) => f.subject)).toEqual(['no sibling names the alternative']);
  });

  it('the band half is WITHHELD to the refuter, never a silent mechanical pass', () => {
    const out = armA3(contrast, { siblingKeys: ['readiness: unmanned posts'] });
    expect(out.fails).toEqual([]);
    expect(out.withheld.map((f) => f.subject)).toEqual(['the band half is the refuter\'s']);
  });
});

describe('A4 — the composition is deterministic, and the composer holds no locale API', () => {
  it('repeat calls are byte-identical, and the desk\'s call ORDER is never consulted', () => {
    const corpusFixture = fixtureCorpus();
    corpusFixture['DS-FIX-1'].pools['muster: short'] = [{ angle: 'ledger', slots: [], text: 'the muster is short' }];
    corpusFixture['DS-FIX-1'].poolMeta['muster: short'] = {
      role: 'modifier', relation: 'addition', attach: ['toll: taken'],
    };
    const forward = [{ key: 'exemption: granted' }, { key: 'muster: short' }];
    const reversed = [...forward].reverse();
    const failures = collectSeedFailures(['', 'seed-1', 'seed-2', 'seed-3', 'prose-0', 'prose-7'], (seed) => {
      const once = composeStateProse(corpusFixture, 'DS-FIX-1', {
        spineKey: 'toll: taken', candidates: forward, seed, leaves: FIXTURE_LEAVES,
      });
      const twice = composeStateProse(corpusFixture, 'DS-FIX-1', {
        spineKey: 'toll: taken', candidates: forward, seed, leaves: FIXTURE_LEAVES,
      });
      const shuffled = composeStateProse(corpusFixture, 'DS-FIX-1', {
        spineKey: 'toll: taken', candidates: reversed, seed, leaves: FIXTURE_LEAVES,
      });
      expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
      expect(JSON.stringify(shuffled)).toBe(JSON.stringify(once));
      expect(once.pieces.length).toBeGreaterThan(1);
    });
    expectNoSeedFailures(failures, 'the composer is a function of the seed and the frozen data alone');
  });

  it('⛔ THE LOCALE BAN, driven through the SAME scanner the plant reds', () => {
    const banned = /\.localeCompare\s*\(|\bIntl\b|\.toLocale[A-Z]\w*\s*\(/g;
    const scan = (source) => [...String(source).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').matchAll(banned)].map((hit) => hit[0]);
    const composer = readFileSync(join(ROOT, 'src/domain/display/stateProse/composeStateProse.js'), 'utf8');
    expect(scan(composer), 'the composer names no locale API outside its own documentation').toEqual([]);
    // A LIVE CONTROL, so an empty result cannot mean the scanner stopped reading.
    expect(scan('  return a.key.localeCompare(b.key);')).toEqual(['.localeCompare(']);
    expect(scan('  const c = new Intl.Collator();')).toEqual(['Intl']);
    expect(scan('  return name.toLocaleUpperCase();')).toEqual(['.toLocaleUpperCase(']);
    expect(scan('  // a comment naming localeCompare and Intl does not count')).toEqual([]);
  });
});

describe('A5 — the four faces are not four synonym swaps', () => {
  it('the ruler reads the opener, the sentence count and the content overlap', () => {
    const same = siblingDistance('The wall stands whole.', 'The wall stands entire.');
    expect(same.sameOpener).toBe(true);
    expect(same.sameSegments).toBe(true);
    expect(same.overlapBp).toBeGreaterThan(3000);
    const apart = siblingDistance('The wall stands whole.', 'Nobody has kept the circuit since the fire came.');
    expect(apart.sameOpener).toBe(false);
    expect(apart.overlapBp).toBe(0);
  });

  it('⛔ THE PLANT: a fixture family of four that is one wording said four times', () => {
    const out = armA5({
      id: 'swap',
      faces: [
        'The wall stands whole around the town.',
        'The wall stands whole around the town.',
        'The wall stands whole around the town.',
        'The wall stands whole around the town.',
      ],
    });
    expect(out.reports.map((f) => f.subject)).toEqual(['a synonym swap', 'a synonym swap', 'a synonym swap', 'a synonym swap', 'a synonym swap', 'a synonym swap']);
    expect(out.fails, 'the channel is REPORT until the sitting sets the floor').toEqual([]);
  });

  it('the CLEAN control passes: a family of four that moves opener, length and words', () => {
    const out = armA5({
      id: 'clean',
      faces: [
        'The wall stands whole around the town.',
        'Nobody has had to breach the circuit since the fire.',
        'A stranger sees the circuit before anything else, and it is kept.',
        'Masons still draw wages here.',
      ],
    });
    expect(out.reports).toEqual([]);
  });

  it('NOT-EXECUTABLE on a one-face variant, which is every shipped variant', () => {
    const out = armA5({ id: 'shipped', faces: ['The wall stands.'] });
    expect(out.notExecutable.map((f) => f.subject)).toEqual(['(wording set)']);
  });

  it('⭐ THE FLOOR\'S PROXY POPULATION, measured on the shipped pools and printed', () => {
    /** @type {Map<string, string[]>} */
    const pools = new Map();
    for (const entry of corpus) {
      const rows = pools.get(entry.poolId) || [];
      rows.push(entry.text);
      pools.set(entry.poolId, rows);
    }
    let pairs = 0;
    let sameOpener = 0;
    let sameSegments = 0;
    const buckets = [0, 0, 0, 0, 0];
    for (const texts of pools.values()) {
      for (let a = 0; a < texts.length; a += 1) {
        for (let b = a + 1; b < texts.length; b += 1) {
          const measured = siblingDistance(texts[a], texts[b]);
          pairs += 1;
          if (measured.sameOpener) sameOpener += 1;
          if (measured.sameSegments) sameSegments += 1;
          buckets[Math.min(4, Math.floor(measured.overlapBp / 1000))] += 1;
        }
      }
    }
    console.log(`\nA5 · the SIBLING-distance distribution the wording-set floor will be cut from`
      + `\n  sibling pairs ${pairs} over ${pools.size} pools`
      + `\n  same opener ${sameOpener}   same sentence count ${sameSegments}`
      + `\n  content overlap in basis points, 0-999 / 1000-1999 / 2000-2999 / 3000-3999 / 4000+:`
      + `\n    ${buckets.join(' / ')}\n`);
    expect(pairs).toBeGreaterThan(1000);
    // The floor is an ARGUMENT and this test does not settle it; what it pins is that a
    // sibling pair of the shipped corpus is NOT already at the conservative floor of 10000,
    // so the arm's default cannot be passing for want of a population.
    expect(buckets[4]).toBeLessThan(pairs);
  });
});

describe('A6 — a face shares its parent\'s slots (a subset) and marks, never a claim set (ADDENDUM 18 ruling 2), with the LONGER arm SUPPRESSED', () => {
  const located = { context: null, pool: null, siblingTexts: [] };

  it('⛔ THE LONGER ARM IS THE SWITCH, and both settings are driven', () => {
    const pair = { id: 'face', before: 'The wall stands.', after: 'The wall stands whole around the town.' };
    expect(pairArms(pair, located, { longer: true }).fails.filter((line) => line.startsWith('LONGER')))
      .toHaveLength(1);
    expect(pairArms(pair, located, { longer: false }).fails.filter((line) => line.startsWith('LONGER')))
      .toEqual([]);
  });

  it('the CLAIM arms still fire with LONGER suppressed, so the suppression is not a mute', () => {
    const digits = pairArms({ id: 'd', before: 'The wall stands.', after: 'The wall stands, all 3 spans of it.' }, located, { longer: false });
    expect(digits.fails).toContain('DIGIT in AFTER');
    const counts = pairArms({ id: 'c', before: 'The wall stands.', after: 'The wall stands, and a few souls keep it.' }, located, { longer: false });
    expect(counts.fails.some((line) => line.startsWith('COUNT words ADDED'))).toBe(true);
  });

  it('the SLOTS-AND-MARKS half: a face names a SUBSET of its parent\'s slots (ruling 12) and carries its parent\'s marks byte for byte', () => {
    const parent = { text: 'The walls at {settlement} are kept.', marks: ['dm-only'] };
    expect(armA6({ id: 'clean', parent, face: 'Masons still draw wages at {settlement}.', faceMarks: ['dm-only'] }).fails)
      .toEqual([]);
    // THE SUBSET PASSES: a face that omits its parent's slot names no fill it cannot receive.
    expect(armA6({ id: 'subset', parent, face: 'Masons still draw wages here.', faceMarks: ['dm-only'] }).fails)
      .toEqual([]);
    // A FOREIGN SLOT STILL FAILS: {faction} is absent from the parent, so no fill reaches it.
    const slots = armA6({ id: 'slots', parent, face: 'The walls at {faction} are kept.', faceMarks: ['dm-only'] });
    expect(slots.fails.map((f) => f.subject)).toEqual(['slot set']);

    const marks = armA6({ id: 'marks', parent, face: 'Masons still draw wages at {settlement}.', faceMarks: [] });
    expect(marks.fails.map((f) => f.subject)).toEqual(['mark set']);
  });

  it('check-pair\'s own axis reader is the one A6 rides, and it still reads the key grammar', () => {
    expect(bandSiblingsOf({ pool: 'readiness STRONG', siblings: ['readiness WEAK', 'terrain FAVOURABLE'] }))
      .toEqual(['readiness WEAK']);
    expect(bandSiblingsOf({ pool: 'Very Safe', siblings: ['SUBSISTENCE'] })).toEqual(['SUBSISTENCE']);
  });
});

describe('A8 — a turn is keyed on the frozen registry, and an EXPLAINS outside it throws', () => {
  it('the registry is a FROZEN list carrying both refused tier-2 forms by name', () => {
    expect(Object.isFrozen(TURN_KEY_REGISTRY)).toBe(true);
    expect(TURN_KEY_REGISTRY.map((row) => row.tier)).toEqual(['1a', '1b', '1c', '2', '2']);
    expect(turnKeyStanding('condition:plague:severe')).toEqual({ ok: true });
    expect(turnKeyStanding('cause:famine').why).toMatch(/tier 2, REFUSED/);
  });

  it('⛔ THE PLANT: a turn whose EXPLAINS is outside the registry is refused at projection', () => {
    const base = {
      blockId: 'DS-FIX-1',
      poolKey: 'turn: plague',
      variants: [{ angle: 'ledger', marks: [], text: 'x', slots: [], index: 1 }],
      isCovert: () => false,
      edgesFrom: () => [],
      blockPoolKeys: new Set(['turn: plague']),
      declaredRoleByPool: {},
      censusOf: () => null,
    };
    expect(() => assertPoolDeclaration({ ...base, declared: { role: 'turn', explains: 'condition:plague' } }))
      .not.toThrow();
    expect(() => assertPoolDeclaration({ ...base, declared: { role: 'turn', explains: 'weather:rain' } }))
      .toThrow(/outside TURN_KEY_REGISTRY/);
    expect(() => assertPoolDeclaration({ ...base, declared: { role: 'turn' } }))
      .toThrow(/a turn with no registry id explains nothing/);
  });
});

describe('A9 — the fragment and sentence forms, and the seam contract', () => {
  const openers = ['and', 'so', 'but', 'where'];

  it('the CLEAN controls pass, one per form', () => {
    expect(armA9({
      id: 'frag', text: 'the muster behind it is thinner than the wage roll says', form: 'fragment', clauseOpeners: openers,
    }).fails).toEqual([]);
    expect(armA9({
      id: 'sent', text: 'The muster behind it is thinner than the wage roll says.', form: 'sentence', clauseOpeners: openers, properSlots: PROPER_SLOTS,
    }).fails).toEqual([]);
  });

  it('⛔ THE FRAGMENT PLANTS: a comma, a clause-list word, a capital, a terminal stop', () => {
    const shape = (text) => armA9({ id: 'f', text, form: 'fragment', clauseOpeners: openers }).fails.map((f) => f.subject);
    expect(shape(', and the muster is thin')).toEqual(['opens on a comma', 'opens on a clause-list word']);
    expect(shape('so the muster is thin')).toEqual(['opens on a clause-list word']);
    expect(shape('The muster is thin')).toEqual(['opens on a capital']);
    expect(shape('the muster is thin.')).toEqual(['carries a terminal stop']);
  });

  it('⛔ THE SENTENCE PLANTS: a proper-typed opener, a lower-case opener, no stop', () => {
    const shape = (text) => armA9({
      id: 's', text, form: 'sentence', clauseOpeners: openers, properSlots: PROPER_SLOTS,
    }).fails.map((f) => f.subject);
    expect(shape('{settlement} keeps its own muster.')).toEqual(['opens on a proper-typed slot']);
    expect(shape('{good} is carried out by cart.')).toEqual([]);
    expect(shape('the muster is thin.')).toEqual(['does not open on a capital']);
    expect(shape('The muster is thin')).toEqual(['carries no terminal stop']);
  });

  it('NOT-EXECUTABLE with no FORM, which is every shipped pool', () => {
    expect(armA9({ id: 'shipped', text: 'The muster is thin.' }).notExecutable.map((f) => f.subject))
      .toEqual(['(FORM)']);
  });
});

describe('A11 — one fact backs a modifier at one mount per page-set, and never where it spines', () => {
  it('the CLEAN control passes: one fact, one modifier mount, spining elsewhere on another fact', () => {
    const out = armA11([
      { fact: 'walls', key: 'wall: kept', role: 'spine', mount: 'defense.posture' },
      { fact: 'muster', key: 'muster: short', role: 'modifier', mount: 'defense.posture' },
      { fact: 'stores', key: 'stores: short', role: 'modifier', mount: 'economics.supply' },
    ]);
    expect(out.fails).toEqual([]);
  });

  it('⛔ THE ECHO PLANT: one fact backs a modifier at two mounts', () => {
    const out = armA11([
      { fact: 'muster', key: 'muster: short', role: 'modifier', mount: 'defense.posture' },
      { fact: 'muster', key: 'muster: short', role: 'modifier', mount: 'overview.systemsHealth' },
    ]);
    expect(out.fails.map((f) => f.subject)).toEqual(['the fact echoes']);
  });

  it('⛔ THE SPINE PLANT: a modifier states a fact that spines at the same mount', () => {
    const out = armA11([
      { fact: 'muster', key: 'muster: strong', role: 'spine', mount: 'defense.posture' },
      { fact: 'muster', key: 'muster: short', role: 'modifier', mount: 'defense.posture' },
    ]);
    expect(out.fails.map((f) => f.subject)).toEqual(['the fact already spines']);
  });

  it('NOT-EXECUTABLE over the shipped census, because no pool declares role modifier', () => {
    const rows = census.rows.flatMap((row) => (row.sites || []).map((mount) => ({
      fact: (row.reads || [])[0] || '(none)', key: row.pool, role: row.attach.length ? 'modifier' : 'spine', mount,
    })));
    expect(rows.length).toBeGreaterThan(500);
    const out = armA11(rows);
    expect(out.fails).toEqual([]);
    expect(out.notExecutable.map((f) => f.subject)).toEqual(['(modifier rows)']);
  });
});

describe('⭐⭐ Thread — adjacent sentences of a composed unit must connect (SITTING §T.4, C″)', () => {
  const SPINE = 'The wall is kept up out of the town\'s own purse.';
  /** @param {string[]} sentences @returns {any} a unit whose TEXT is the reader's own */
  const unitOf = (...sentences) => ({
    id: 'DS-DEF-11 :: WALLED-STRAINED', blockId: 'DS-DEF-11', poolKey: 'WALLED-STRAINED',
    text: sentences.join(' '), pieces: [],
  });
  /** @param {any} out @returns {string[]} */
  const subjects = (out) => out.reports.map((f) => f.subject);

  it('CONTROL 1 — a CARRIED noun passes, and the carried word is named', () => {
    const out = armThread(unitOf(SPINE, 'The purse is thin because the muster was paid twice.'));
    expect(out.fails, 'the arm is REPORT-only until 8b\'s first batch').toEqual([]);
    expect(subjects(out)).toEqual(['carried at sentence 2']);
    expect(out.reports[0].value, 'and it prints WHAT was carried, not only that something was')
      .toContain('purse');
  });

  it('CONTROL 2 — a LAST-POSITION turn outward passes: the one turn the rule licenses', () => {
    const out = armThread(unitOf(SPINE, 'Beyond the gate the country is pressed.'));
    expect(out.fails).toEqual([]);
    expect(subjects(out)).toEqual(['turn-outward at sentence 2']);
  });

  it('⛔ PLANT 1 — a MID-PASSAGE shift that hands nothing back is BROKEN', () => {
    // The refuters' own finding at the taste: a tail that hands nothing back. The third
    // sentence carries the thread again, so the break is unambiguously the SECOND one's.
    const out = armThread(unitOf(SPINE, 'Beyond the gate the country is pressed.',
      'The country sends nothing back.'));
    expect(subjects(out)).toEqual(['broken at sentence 2', 'carried at sentence 3']);
    expect(out.reports[0].description, 'and the reason names the position, not only the noun')
      .toContain('MID-PASSAGE');
  });

  it('⛔ PLANT 2 — a SECOND turn outward is BROKEN even in the last position', () => {
    // "the one turn outward" is ONE. A unit that turns twice has stopped twice, and the
    // last-position licence has already been spent.
    //
    // ⚠ A MEASURED PROPERTY OF THE RULE, recorded here because the plant is what shows it:
    // the second-turn branch is NEVER REACHABLE ON ITS OWN. A turn is licensed only in the
    // LAST position, so a first turn anywhere else is already a mid-passage break — which
    // makes this plant necessarily carry BOTH failures, and makes "broken, broken" the
    // honest expectation rather than "licensed, then broken". The two are told apart by the
    // reason, which is why the reason is asserted and not only the count.
    const out = armThread(unitOf(SPINE, 'Beyond the gate the country is pressed.',
      'Harvest ships upriver by autumn.'));
    expect(subjects(out)).toEqual(['broken at sentence 2', 'broken at sentence 3']);
    expect(out.reports[0].description, 'the first is the mid-passage shift').toContain('MID-PASSAGE');
    expect(out.reports[1].description, 'and the second has spent the one licence')
      .toContain('SECOND turn outward');
  });

  it('CONTROL 3 — carry, then the turn LAST: the three-sentence shape the rule licenses', () => {
    // The paired positive for PLANT 2, on a unit of the same length: the same three positions,
    // one word carried at the first join, and the turn moved to the end.
    const out = armThread(unitOf(SPINE, 'The purse was emptied by the muster.',
      'Beyond the gate the country is pressed.'));
    expect(subjects(out)).toEqual(['carried at sentence 2', 'turn-outward at sentence 3']);
    expect(out.fails, 'and none of it gates, at this car').toEqual([]);
  });

  it('NOT-EXECUTABLE on a bare spine, which is every unit the estate composes today', () => {
    const out = armThread(unitOf(SPINE));
    expect(out.reports, 'a one-sentence unit reports no thread verdict at all').toEqual([]);
    expect(out.notExecutable.map((f) => f.subject)).toEqual(['(adjacent pairs)']);
    expect(out.notExecutable[0].value, 'and it says how many sentences it found').toBe('1');
  });

  it('⛔ THE SPLIT IS THE ESTATE\'S OWN, so a filled slot cannot manufacture a break', () => {
    // `entryWalker.sentencesOf` neutralises `{slot}` markers before it splits, which is why a
    // pool key or a filled abbreviation cannot be read as a sentence end. Driven rather than
    // trusted: the same two sentences with a slot in the first still read as ONE pair.
    const out = armThread(unitOf('The wall of {settlement} is kept up out of the purse.',
      'The purse is thin.'));
    expect(subjects(out)).toEqual(['carried at sentence 2']);
  });

  it('⛔⛔ A11 COUNTS FACTS AND Thread COUNTS NOUNS — the deliberate echo is not a violation', () => {
    // The owner's note on C″, made executable: "the echo bound counts FACTS, not nouns; a
    // deliberate noun echo for the thread is not an echo violation". The plant is the exact
    // pair the thread rule ASKS for — two sentences sharing the noun `muster` — and A11 must
    // read it as clean because the two rows carry DIFFERENT facts.
    const threaded = unitOf(SPINE, 'The muster is short, and the purse is why.');
    expect(subjects(armThread(threaded)), 'Thread rewards the shared noun')
      .toEqual(['carried at sentence 2']);
    const echo = armA11([
      { fact: 'walls', key: 'wall: kept', role: 'spine', mount: 'defense.posture' },
      { fact: 'muster', key: 'muster: short', role: 'modifier', mount: 'defense.posture' },
    ]);
    expect(echo.fails, 'and A11 says nothing, because the two rows are two FACTS').toEqual([]);
    // THE PAIRED POSITIVE, so the line above is A11 keying on `fact` and not A11 asleep: the
    // SAME two rows with one fact between them fail at once.
    const same = armA11([
      { fact: 'muster', key: 'wall: kept', role: 'spine', mount: 'defense.posture' },
      { fact: 'muster', key: 'muster: short', role: 'modifier', mount: 'defense.posture' },
    ]);
    expect(same.fails.map((f) => f.subject)).toEqual(['the fact already spines']);
  });
});

describe('⭐⭐ THE REFUTERS\' GROUNDS, AS REPORTED ARMS (SITTING §T.5)', () => {
  /** @param {string} text @returns {any} */
  const unitOf = (text) => ({
    id: 'DS-DEF-11 :: WALLED-STRAINED', blockId: 'DS-DEF-11', poolKey: 'WALLED-STRAINED',
    text, pieces: [],
  });
  /** @param {any} out @returns {string[]} */
  const subjects = (out) => [...out.reports, ...out.withheld].map((f) => f.subject);

  it('THE GROUND: the gate read 0 owned findings while the refuters failed 26 of 42', () => {
    // SITTING §T.5's measurement, made executable rather than remembered: the four arms below
    // are the classes the blind refuters convicted on and no owned arm carried. They are on
    // the ROSTER, which is what stops one of them being dropped without a red.
    for (const arm of ['Tail', 'Aspect', 'Restatement', 'Ambiguity']) {
      expect(COMPOSED_ARMS, `${arm} must be on the roster`).toContain(arm);
    }
  });

  it('⛔ TAIL — a qualification hung on the end, and a real second clause that is not', () => {
    expect(subjects(armTail(unitOf('The watch is paid out of the purse, at least for now.'))))
      .toEqual(['a qualification hung as a tail']);
    expect(armTail(unitOf('The watch is paid out of the purse, and the purse is thin.')).reports,
      'a comma clause that states a fact is not a tail').toEqual([]);
  });

  it('⛔ ASPECT — a forecast and a perfect aspect on a standing fact', () => {
    expect(subjects(armAspect(unitOf('The gate will never shut before dusk.'))))
      .toEqual(['a forecast on a standing fact']);
    expect(subjects(armAspect(unitOf('The watch has been paid out of the purse.'))))
      .toEqual(['a perfect aspect on a standing fact']);
    expect(armAspect(unitOf('The gate is shut at dusk by whoever is nearest.')).reports,
      'a present-tense standing fact is what the register is for').toEqual([]);
  });

  it('⛔ RESTATEMENT — one sentence whose two halves carry the same content words', () => {
    const out = armRestatement(unitOf('The muster roll is short, and the roll of the muster is short.'));
    expect(subjects(out)).toEqual(['a fact restated inside one sentence']);
    expect(out.reports[0].value, 'and it prints the overlap it measured').toContain('bp overlap');
    expect(armRestatement(unitOf('The muster roll is short, and the purse is why.')).reports,
      'a second clause that adds a fact is the thread, not a restatement').toEqual([]);
    // ⛔ AND IT IS NOT THE THREAD RULE INVERTED: the SAME pair across two SENTENCES is exactly
    // what Thread rewards, so the two arms must not be reading each other's evidence.
    expect(armRestatement(unitOf('The muster roll is short. The purse is why.')).reports).toEqual([]);
  });

  it('⛔ AMBIGUITY — WITHHELD, because the channel IS the ruling', () => {
    const out = armAmbiguity(unitOf('The north quarter stands without cover.'));
    expect(out.reports, 'this is not a REPORT: it is a question a refuter owes').toEqual([]);
    expect(out.withheld.map((f) => f.subject)).toEqual(['a reading that depends on the spine']);
    expect(armAmbiguity(unitOf('The north quarter stands behind a low wall.')).withheld).toEqual([]);
  });

  it('⛔ NONE OF THE FOUR GATES: every finding is REPORT or WITHHELD, never FAIL', () => {
    // Refuters default to FAIL when uncertain, so SITTING §T.5 recorded that "the count
    // overstates; the classes are real". An arm cut from an overstating count and gated on the
    // first day would refuse lawful prose, and a refused lawful face is a TRIM.
    const plants = [
      'The watch is paid out of the purse, at least for now.',
      'The gate will never shut before dusk.',
      'The muster roll is short, and the roll of the muster is short.',
      'The north quarter stands without cover.',
    ];
    for (const text of plants) {
      for (const arm of [armTail, armAspect, armRestatement, armAmbiguity]) {
        expect(arm(unitOf(text)).fails, `${text} must not FAIL`).toEqual([]);
      }
    }
  });

  it('THE RATE ON THE SHIPPED CORPUS, printed — the authoring debt the REWRITE inherits', () => {
    // The arms are landed to be run on wording sets that do not exist yet, so their rate on
    // TODAY's prose is the only reading available and it is a REPORT. It is asserted as a
    // BOUND rather than an exact figure: an arm firing on most of the corpus would be a
    // detector too loose to be worth having, and one firing on none would be untested.
    const tally = {
      Tail: 0, Aspect: 0, Restatement: 0, Ambiguity: 0,
    };
    for (const entry of corpus) {
      const unit = unitOf(entry.text);
      if (armTail(unit).reports.length) tally.Tail += 1;
      if (armAspect(unit).reports.length) tally.Aspect += 1;
      if (armRestatement(unit).reports.length) tally.Restatement += 1;
      if (armAmbiguity(unit).withheld.length) tally.Ambiguity += 1;
    }
    console.log(`\nSITTING §T.5's four arms on the shipped corpus (${corpus.length} variants)`
      + `\n  Tail ${tally.Tail} · Aspect ${tally.Aspect} · Restatement ${tally.Restatement}`
      + ` · Ambiguity ${tally.Ambiguity}\n`);
    for (const [arm, n] of Object.entries(tally)) {
      expect(n, `${arm} fires on more than half the corpus, which is a detector too loose to keep`)
        .toBeLessThan(corpus.length / 2);
    }
    // AND THE ONE THAT DOES FIRE IS NAMED, so a future cure that silenced it reds here.
    expect(tally.Aspect, 'the perfect aspect and the forecast are real in today\'s prose')
      .toBeGreaterThan(0);
  });
});

describe('A12 — the POSITION BUDGET, as a desk test', () => {
  /** Four rungs at one mount, each offering its own modifier. */
  function mountCorpus() {
    /** @type {Record<string, any>} */
    const pools = {};
    /** @type {Record<string, any>} */
    const poolMeta = {};
    for (let at = 0; at < 4; at += 1) {
      pools[`rung ${at}`] = [{ angle: 'ledger', slots: [], text: `Rung ${at} stands.` }];
      poolMeta[`rung ${at}`] = { role: 'spine', readsCount: 1 };
      pools[`mod ${at}`] = [{ angle: 'ledger', slots: [], text: `Modifier ${at} follows.` }];
      poolMeta[`mod ${at}`] = { role: 'modifier', relation: 'addition', attach: [`rung ${at}`] };
    }
    return { 'DS-FIX-2': { title: 'Mount', slots: [], pools, poolMeta } };
  }
  const rungs = [0, 1, 2, 3].map((at) => ({ spineKey: `rung ${at}`, candidates: [{ key: `mod ${at}` }] }));

  it('at most TWO rungs of one mount carry a modifier, and the rest render as bare spines', () => {
    const units = composeStateProseMount(mountCorpus(), 'DS-FIX-2', rungs, { seed: 'seed-1', leaves: FIXTURE_LEAVES });
    const bearing = units.filter((unit) => unit.pieces.some((piece) => piece.role === 'modifier'));
    expect(units).toHaveLength(4);
    expect(bearing).toHaveLength(2);
    expect(units.every((unit) => unit !== null)).toBe(true);
  });

  it('⛔ THE PLANT: raise the limit and four rungs bear, so the two is the BUDGET and not the data', () => {
    const units = composeStateProseMount(mountCorpus(), 'DS-FIX-2', rungs, {
      seed: 'seed-1', leaves: FIXTURE_LEAVES, limit: 4,
    });
    expect(units.filter((unit) => unit.pieces.some((piece) => piece.role === 'modifier'))).toHaveLength(4);
  });

  it('a pool seated at one rung is WITHDRAWN from the others at the same mount', () => {
    const shared = mountCorpus();
    shared['DS-FIX-2'].poolMeta['mod 0'].attach = ['rung 0', 'rung 1'];
    const units = composeStateProseMount(shared, 'DS-FIX-2', [
      { spineKey: 'rung 0', candidates: [{ key: 'mod 0' }] },
      { spineKey: 'rung 1', candidates: [{ key: 'mod 0' }] },
    ], { seed: 'seed-1', leaves: FIXTURE_LEAVES, limit: 4 });
    const seated = units.flatMap((unit) => unit.pieces.filter((piece) => piece.role === 'modifier').map((piece) => piece.key));
    expect(seated).toEqual(['mod 0']);
  });
});

describe('A13 — the PROVENANCE move, EXECUTABLE since the holder census landed (SEAM car 5b)', () => {
  const cited = {
    blockId: 'DS-FIX-1',
    poolKey: 'muster: long',
    text: 'The muster roll at {settlement} is long and current.',
    pieces: [{ role: 'spine', key: 'muster: long', text: 'The muster roll at {settlement} is long and current.' }],
  };

  it('PROVENANCE is a move of the grammar, classified by the shared classifier', () => {
    expect(Object.keys(MOVES)).toContain('PROVENANCE');
    expect(provenanceCount('The muster roll at {settlement} is long and current.')).toBe(1);
    expect(provenanceCount('The wall stands whole around the town.')).toBe(0);
  });

  it('a citation is COUNTED on the REPORT channel, per pool and per register', () => {
    const out = armA13(cited, { register: 'R1' });
    expect(out.reports.map((f) => f.subject)).toEqual(['citations in R1']);
    expect(out.reports[0].value).toBe('1');
  });

  it('⭐ THE COLUMN LANDED: every census row carries a `source`, and the arm is NOT-EXECUTABLE only without a reader', () => {
    // ⛔ THE ARM THIS REPLACES ASSERTED THE COLUMN'S ABSENCE, and SEAM car 5b falsified it.
    // Car 4c's precedent: an arm whose claim a later car falsifies is AMENDED at cause, never
    // left red and never deleted — the property that replaces it is stronger, because the
    // column is now asserted present on EVERY row rather than absent from all of them.
    const columns = new Set(census.rows.flatMap((row) => Object.keys(row)));
    expect([...columns].sort(), 'the census row carries the holder census\'s column').toContain('source');
    expect(census.rows.every((row) => typeof row.source === 'object' && row.source !== null),
      'and every one of the 708 rows carries it').toBe(true);
    expect(new Set(census.rows.map((r) => r.source.standing)),
      'from the register\'s own closed standing vocabulary')
      .toEqual(new Set(['LICENSED', 'OFFICE', 'SOURCE-UNRESOLVED']));
    // AND THE NOT-EXECUTABLE LIMB SURVIVES, because a CALLER may still bring no reader: the
    // arm refuses to license anything it cannot look up rather than passing by default.
    const out = armA13(cited, {});
    expect(out.fails).toEqual([]);
    expect(out.notExecutable.map((f) => f.subject)).toEqual(['(census source column)']);
  });

  it('the CLEAN control passes once a holder is licensed, and the two refusals are WITHHELD', () => {
    const licensed = armA13(cited, { sourceOf: () => ({ kind: 'muster', holder: 'the watch', standing: 'LICENSED' }) });
    expect(licensed.fails).toEqual([]);
    expect(licensed.withheld).toEqual([]);
    for (const standing of ['SOURCE-UNRESOLVED', 'OFFICE']) {
      const out = armA13(cited, { sourceOf: () => ({ kind: 'muster', holder: 'the watch', standing }) });
      expect(out.withheld.map((f) => f.subject)).toEqual(['a cited holder the census does not license']);
    }
    const noRow = armA13(cited, { sourceOf: () => null });
    expect(noRow.withheld.map((f) => f.subject)).toEqual(['a cited holder the census does not license']);
    const noInstitution = armA13(cited, { sourceOf: () => ({ kind: 'muster', holder: null, standing: 'INTERESTED' }) });
    expect(noInstitution.withheld.map((f) => f.subject)).toEqual(['a holder with no institution']);
  });

  it('⛔ THE INTERESTED-FACT PLANT: a citing face with no dm-only mark is a FAIL', () => {
    const source = () => ({ kind: 'treasury', holder: 'the counting hall', standing: 'INTERESTED' });
    expect(armA13(cited, { sourceOf: source }).fails.map((f) => f.subject))
      .toEqual(['an interested holder on the player face']);
    const marked = {
      ...cited,
      pieces: [{ ...cited.pieces[0], marks: ['dm-only'] }],
    };
    expect(armA13(marked, { sourceOf: source }).fails).toEqual([]);
    // ⛔ NO NEW MARK IS MINTED: `dm-only` is the mark the projector already emits and the
    // kernel already filters on, so the mark vocabulary gains nothing at this car.
    expect(corpus.some((entry) => entry.marks.includes('dm-only'))).toBe(true);
  });

  it('⭐ THE CITATION HABIT ON THE SHIPPED CORPUS, printed for the sitting\'s budget', () => {
    /** @type {Map<string, number>} */
    const byBlock = new Map();
    let citing = 0;
    for (const entry of corpus) {
      const count = provenanceCount(entry.text);
      if (count === 0) continue;
      citing += 1;
      byBlock.set(entry.block, (byBlock.get(entry.block) || 0) + count);
    }
    // ⭐⭐ THE EXECUTABLE VERDICTS, now that the `source` column exists (SEAM car 5b). Every
    // citing variant is walked as a one-piece composed unit through the SAME arm, with a
    // `sourceOf` built from the committed census.
    //
    // ⚠ THE HOLDER IS THE SHIPPED ROSTER'S KEEPER AND NOT THIS TOWN'S, AND THAT IS STATED
    // RATHER THAN GLOSSED. The corpus walk has no settlement, so `holderOf(kind, settlement)`
    // has nothing to resolve against; the register's own `holder` is null by construction. So
    // the reader names the institution the SHIPPED CATALOG offers for the kind, which is a real
    // institution of the game rather than a placeholder, and the town-resolved verdict is the
    // taste's (car 6). Without this, every licensed pool would read WITHHELD for want of a
    // holder and the tally would measure the walk's own blindness.
    const keeperOf = (kind) => Object.entries(INSTITUTION_SERVICES).find(([, services]) => Object
      .keys(services).some((name) => (HOLDER_RECORDS.find((r) => r.kind === kind)?.services || []).includes(name)))?.[0] ?? null;
    const sourceOf = (key) => {
      const row = censusByPool.get(key);
      if (!row?.source) return null;
      const { kind, kinds, standing } = row.source;
      return { kind, holder: kinds.length ? keeperOf(kinds[0]) : null, standing };
    };
    /** @type {Map<string, number>} */
    const verdicts = new Map();
    /** @type {Map<string, number>} */
    const byStanding = new Map();
    for (const entry of corpus) {
      if (provenanceCount(entry.text) === 0) continue;
      const key = `${entry.block} :: ${entry.pool}`;
      const unit = {
        blockId: entry.block,
        poolKey: entry.pool,
        text: entry.text,
        pieces: [{
          role: 'spine', key, text: entry.text, marks: entry.marks || [], slots: entry.slots || [],
        }],
      };
      const out = armA13(unit, { register: 'R1', sourceOf });
      const verdict = out.fails.length ? 'FAIL' : (out.withheld.length ? 'WITHHELD' : 'LICENSED');
      verdicts.set(verdict, (verdicts.get(verdict) || 0) + 1);
      const standing = sourceOf(key)?.standing ?? '(no census row)';
      byStanding.set(`${verdict} <- ${standing}`, (byStanding.get(`${verdict} <- ${standing}`) || 0) + 1);
    }
    console.log(`\nA13 · the CITATION habit before any budget is set`
      + `\n  variants naming a record holder: ${citing} of ${corpus.length}`
      + `\n  by block: ${[...byBlock.entries()].sort().map(([block, n]) => `${block} ${n}`).join(' · ')}`
      + `\n  EXECUTABLE VERDICTS (SEAM car 5b): `
      + `${[...verdicts].sort().map(([v, n]) => `${v} ${n}`).join(' · ')}`
      + `\n  by the pool's register standing: `
      + `${[...byStanding].sort().map(([k, n]) => `${k} ${n}`).join(' · ')}\n`);
    expect(citing).toBeGreaterThan(0);
    // ⛔ NON-VACUITY: the walk answered for every citing variant, and the arm is executable now
    // (no NOT-EXECUTABLE row can be reached with a reader in hand).
    expect([...verdicts.values()].reduce((a, b) => a + b, 0), 'every citing variant got a verdict').toBe(citing);
    expect(armA13({ ...cited, pieces: cited.pieces }, { sourceOf }).notExecutable,
      'and with a reader in hand the arm is executable').toEqual([]);
    // SHRINK-ONLY, AND THE CEILING FOLLOWED THE COUNT DOWN AT CAR 5c. It stood at 18 while
    // the PROVENANCE detector carried a generic reporting-verb limb; SITTING §R c-16 narrowed
    // the vocabulary to the twelve holder kinds and 11 of those 18 proved to name no holder at
    // all. A shrink-only ratchet left at 18 would silently re-admit them. The wave may cite
    // less; it may not quietly cite more before the sitting sets the budget the owner's
    // directive asks the bands for.
    expect(citing).toBeLessThanOrEqual(7);
  });

  // ── A13's FAIL LIMB, ON A REAL TOWN (SITTING §R c-22; the seam fold's P8) ────────────
  //
  // The fold found A13's FAIL limb structurally unreachable: the gate asserts the REGISTER's
  // standing vocabulary is the closed set {LICENSED, OFFICE, SOURCE-UNRESOLVED}, every one of
  // which `continue`s before FAIL, and the only plant supplying `INTERESTED` was a synthetic.
  // The register's vocabulary is still closed and still correct — a register knows no town.
  // What changed at car 5c is that the TOWN path can now mint INTERESTED from a typed birth
  // fact, so the limb is reachable on real input and this arm reaches it with one.
  //
  // ⚠ THE TOWN AND THE VARIANT ARE BOTH NAMED, AND BOTH ARE SHIPPED. The town is a rateGrid
  // spec quoted with its seed; the variant is a real citing variant of the real corpus whose
  // census row resolves to the TREASURY — a state organ. 17 of the 768 RATE towns put this
  // exact row into INTERESTED, so the arm sits on a measured population and not on a
  // coincidence.
  const CAPTURED_TREASURY_TOWN = Object.freeze({
    config: {
      settType: 'town',
      tradeRouteAccess: 'road',
      monsterThreat: 'random_threat',
      culture: 'germanic',
      terrainOverride: 'hills',
    },
    seed: 'rate-9-2',
  });

  it('⭐⭐ THE FAIL LIMB IS REACHABLE ON REAL INPUT: a citing variant whose holder this town has captured', () => {
    const town = generateSettlementPipeline(
      CAPTURED_TREASURY_TOWN.config, null, { seed: CAPTURED_TREASURY_TOWN.seed, customContent: {} },
    );
    expect(capturedRulingStructure(town).criminal, 'the named town\'s ruling structure is corrupted').toBe('corrupted');
    // A REAL SHIPPED CITING VARIANT, found in the corpus rather than written here.
    const entry = corpus.find((row) => row.block === 'DS-GEN-11'
      && row.pool === 'viable: true: the arithmetic closes'
      && provenanceCount(row.text) > 0);
    expect(entry, 'the shipped corpus must still carry this citing variant').toBeTruthy();
    const key = `${entry.block} :: ${entry.pool}`;
    const censusRow = censusByPool.get(key);
    expect(censusRow.source.kinds, 'and its holder is the treasury').toEqual(['treasury']);
    expect(censusRow.source.stateOrgan, 'which is one of the state\'s own organs').toBe(true);
    const resolved = sourceOfForTown(censusRow, town);
    expect(resolved.standing, 'so on THIS town the holder is an interested party').toBe('INTERESTED');
    expect(resolved.holder).toBe('Town hall');
    expect(resolved.marks.join(' | ')).toMatch(/captured-at-birth/);
    const sourceOf = () => resolved;
    const unitOf = (marks) => ({
      blockId: entry.block,
      poolKey: entry.pool,
      text: entry.text,
      pieces: [{
        role: 'spine', key, text: entry.text, marks, slots: entry.slots || [],
      }],
    });
    // ⛔ THE FAIL, on real input and with no synthetic standing anywhere in the call.
    const player = armA13(unitOf(entry.marks || []), { register: 'R1', sourceOf });
    expect(player.fails.map((f) => f.subject)).toEqual(['an interested holder on the player face']);
    // AND THE DM FACE, which is the licensed way to state the same fact (SITTING §Q.3).
    const dm = armA13(unitOf([...(entry.marks || []), 'dm-only']), { register: 'R1', sourceOf });
    expect(dm.fails).toEqual([]);
    // ⛔ NON-VACUITY: the SAME variant and the SAME arm on a town whose ruling structure is
    // NOT captured does not fail, so the FAIL is the town's fact and not the arm's habit.
    const clean = generateSettlementPipeline(
      { settType: 'town', tradeRouteAccess: 'random_trade', monsterThreat: 'random_threat', culture: 'arabic', terrainOverride: 'riverside' },
      null, { seed: 'rate-3-0', customContent: {} },
    );
    expect(capturedRulingStructure(clean).captured).toBe(false);
    const cleanSource = sourceOfForTown(censusRow, clean);
    expect(cleanSource.standing).not.toBe('INTERESTED');
    expect(armA13(unitOf(entry.marks || []), { register: 'R1', sourceOf: () => cleanSource }).fails).toEqual([]);
  });
});

describe('C7 — cross-block sibling agreement on a page-set', () => {
  const pageSet = (a, b) => [
    { blockId: 'DS-DEF-1', poolKey: 'p', text: a, pieces: [] },
    { blockId: 'DS-ECO-1', poolKey: 'q', text: b, pieces: [] },
  ];

  it('⛔ PLANT 1 — a true cross-block band conflict is convicted', () => {
    const out = armC7(pageSet('A few households remain in the lower town.', 'Many hundreds of households pay the toll.'));
    expect(out.reports.map((f) => f.subject)).toEqual(['two blocks band one noun differently']);
    expect(out.reports[0].value).toMatch(/^households/);
  });

  it('⛔ PLANT 2 — an innocent cross-block pair passes', () => {
    const out = armC7(pageSet('A few households remain in the lower town.', 'Dozens of carts cross the bridge each week.'));
    expect(out.reports).toEqual([]);
    expect(out.fails, 'the channel is REPORT before FAIL').toEqual([]);
  });

  it('two units of ONE block are C5\'s and the position budget\'s, not this arm\'s', () => {
    const out = armC7([
      { blockId: 'DS-DEF-1', poolKey: 'p', text: 'A few households remain.', pieces: [] },
      { blockId: 'DS-DEF-1', poolKey: 'q', text: 'Many hundreds of households remain.', pieces: [] },
    ]);
    expect(out.reports).toEqual([]);
    expect(out.notExecutable.map((f) => f.subject)).toEqual(['(blocks)']);
  });
});

describe('composedOrderIdOf — LEVEL1 union LEVEL2, and the share outside both', () => {
  it('LEVEL1 answers first, LEVEL2 second, and neither is the third answer', () => {
    expect(composedOrderIdOf(['PRESENT'])).toEqual({ id: 'V1', level: 1 });
    expect(composedOrderIdOf(['PRESENT', 'CONSEQUENCE'])).toEqual({ id: 'V2', level: 1 });
    expect(composedOrderIdOf(['PRESENT', 'ABSENCE'])).toEqual({ id: 'V3|V8', level: 1 });
    expect(composedOrderIdOf(['GEOGRAPHY', 'CONSEQUENCE', 'TRADITION'])).toEqual({ id: 'E3', level: 2 });
    expect(composedOrderIdOf(['PRESENT', 'PROVENANCE'])).toEqual({ id: '', level: 0 });
    // ⛔ THE OVERLAP IS NAMED: E5 is INSTITUTION -> PRESENT, which is V5 exactly, and a single
    // composed unit realising it is a LEVEL-1 grammar rather than a tab order.
    expect(LEVEL2_ORDERS.E5.join()).toBe(LEVEL1_ORDERS.V5.order.join());
    expect(composedOrderIdOf(['INSTITUTION', 'PRESENT'])).toEqual({ id: 'V5', level: 1 });
  });

  it('the composed order is derived from the PIECES and not from the arranged string', () => {
    const unit = {
      blockId: 'DS-FIX-1',
      poolKey: 'a',
      text: 'The stores are short, and the bill falls on the households.',
      pieces: [
        { role: 'spine', key: 'a', text: 'The stores are short.' },
        { role: 'modifier', key: 'b', text: 'the bill falls on the households' },
      ],
    };
    expect(composedOrderOf(unit)).toEqual({ moves: ['PRESENT', 'CONSEQUENCE'], id: 'V2', level: 1 });
  });

  it('⭐ THE SHARE OUTSIDE BOTH SETS, printed at the shipped corpus as car 6\'s baseline', () => {
    let outside = 0;
    /** @type {Map<string, number>} */
    const byId = new Map();
    for (const entry of corpus) {
      const read = composedOrderOf({
        blockId: entry.block, poolKey: entry.pool, text: entry.text, pieces: [{ role: 'spine', key: entry.pool, text: entry.text }],
      });
      if (read.level === 0) outside += 1;
      byId.set(read.id || '(outside)', (byId.get(read.id || '(outside)') || 0) + 1);
    }
    const shareBp = Math.round((outside * 10000) / corpus.length);
    console.log(`\ncomposedOrderIdOf · ${corpus.length} shipped variants as one-piece composed units`
      + `\n  outside LEVEL1 union LEVEL2: ${outside} (${shareBp} basis points)`
      + `\n  ${[...byId.entries()].sort((a, b) => b[1] - a[1]).map(([id, n]) => `${id} ${n}`).join(' · ')}\n`);
    expect(outside).toBeGreaterThan(0);
    expect(outside).toBeLessThan(corpus.length);
  });
});

describe('THE COMPOSED WALK — the exhaustive block re-walk, and the sampled walk with its sha', () => {
  const ground = withEntryContext(GROUND, { siblings: [{ id: 'sib', text: 'The bridge is down.' }] });

  it('⛔ A MODIFIER LANDING RE-WALKS ITS BLOCK EXHAUSTIVELY, never a sample', () => {
    const units = corpus.filter((entry) => entry.block === 'DS-DEF-11').map(unitOfEntry);
    expect(units.length, 'DS-DEF-11 is the block ARCH works its walls example on').toBeGreaterThan(10);
    const walked = reWalkBlock(units, ground, { landing: 'walls: kept' });
    expect(walked.walked).toBe(units.length);
    expect(walked.verdicts.FAIL + walked.verdicts.WITHHELD + walked.verdicts.PASS).toBe(units.length);
    console.log(`\nTHE BLOCK RE-WALK · DS-DEF-11 at a modifier landing`
      + `\n  units walked ${walked.walked}   FAIL ${walked.verdicts.FAIL}`
      + `  WITHHELD ${walked.verdicts.WITHHELD}   PASS ${walked.verdicts.PASS}\n`);
    // NOT-EXECUTABLE rather than a green on an empty block: an empty re-walk may never read
    // as "the landing broke nothing".
    const empty = reWalkBlock([], ground, { landing: 'walls: kept' });
    expect(empty.walked).toBe(0);
    expect(empty.findings.notExecutable.map((f) => f.arm)).toEqual(['block-re-walk']);
  });

  // ⛔ THE DRIVER'S OWN OPTIONS REACH THE ARMS (the seam fold's 4b; SITTING §R cure 2). Until
  // car 5c `reWalkBlock` called `walkComposed(unit, ground)` with no third argument, so A3
  // read `options.siblingKeys` as `[]` and FAILED 'no sibling names the alternative' on every
  // contrast-carrying unit of a re-walked block — findings manufactured by the harness, not
  // by the corpus. DS-DEF-11 carries no contrast shape, which is the only reason it was
  // latent; this fixture carries one on purpose, so the defect cannot go latent again.
  const CONTRAST_BLOCK = Object.freeze([
    {
      blockId: 'DS-FIX-9',
      poolKey: 'readiness: thin',
      text: 'The town turns out its own people rather than paying a garrison.',
      pieces: [{ role: 'spine', key: 'readiness: thin', text: 'The town turns out its own people rather than paying a garrison.' }],
    },
    {
      blockId: 'DS-FIX-9',
      poolKey: 'readiness: paid garrison',
      text: 'The gate is held by a paid garrison the town does not muster itself.',
      pieces: [{ role: 'spine', key: 'readiness: paid garrison', text: 'The gate is held by a paid garrison the town does not muster itself.' }],
    },
  ]);

  it('⭐ a block carrying a CONTRAST re-walks WITHOUT a manufactured A3 fail, because the options reach the arm', () => {
    const walked = reWalkBlock(CONTRAST_BLOCK, ground, {
      landing: 'garrison: paid',
      siblingKeys: ['readiness: paid garrison', 'readiness: thin'],
    });
    const a3 = (list) => list.filter((f) => f.arm === 'A3');
    expect(walked.walked).toBe(2);
    // THE LINE THE PLANT REDS. Remove the `options` third argument from `reWalkBlock`'s call
    // to `walkComposed` and A3 sees no sibling set at all: this REPORT becomes a
    // NOT-EXECUTABLE row and the next assertion's empty FAIL list is the only survivor.
    expect(a3(walked.findings.reports).map((f) => f.subject)).toEqual(['licensed by a sibling key']);
    expect(a3(walked.findings.fails), 'no A3 fail may be manufactured by the driver').toEqual([]);
    // The second unit carries no contrast shape at all, so its A3 row is the arm's OTHER
    // not-executable limb. What must NOT appear here is '(sibling keys)': the set was supplied.
    expect(a3(walked.findings.notExecutable).map((f) => f.subject)).toEqual(['(contrast shape)']);
  });

  it('⛔ AND A CALLER THAT BRINGS NO SIBLING SET GETS NOT-EXECUTABLE, never a FAIL', () => {
    // An ABSENT sibling set is an input nobody supplied; an EMPTY one is a fact about the
    // block. A3 answers differently to each, which is what stops the honest FAIL below from
    // ever being reachable by accident.
    const blind = reWalkBlock(CONTRAST_BLOCK, ground, { landing: 'garrison: paid' });
    const a3Blind = blind.findings.notExecutable.filter((f) => f.arm === 'A3');
    expect(a3Blind.map((f) => f.subject).sort()).toEqual(['(contrast shape)', '(sibling keys)']);
    expect(blind.findings.fails.filter((f) => f.arm === 'A3')).toEqual([]);
    // THE HONEST FAIL SURVIVES, and it is reached only by supplying the empty set on purpose.
    const declared = reWalkBlock(CONTRAST_BLOCK, ground, { landing: 'garrison: paid', siblingKeys: [] });
    expect(declared.findings.fails.filter((f) => f.arm === 'A3').map((f) => f.subject))
      .toEqual(['no sibling names the alternative']);
  });

  it('the SAMPLE is a deterministic stride over the sorted addresses, reproducible from N alone', () => {
    const units = corpus.map((entry) => ({
      blockId: entry.block, poolKey: entry.pool, id: entry.id, text: entry.text, pieces: [],
    }));
    const once = sampleOf(units, 120);
    const twice = sampleOf([...units].reverse(), 120);
    expect(once.addresses).toEqual(twice.addresses);
    expect(once.n).toBe(120);
    expect(once.total).toBe(corpus.length);
    expect(sampleOf(units, 0).addresses).toEqual([]);
    expect(sampleOf(units, corpus.length * 2).n).toBe(corpus.length);
  });

  it('⭐ THE SAMPLED COMPOSED WALK at a PLACEHOLDER N, with its cost and its sha printed', () => {
    // N IS SET AT CAR 6 from the measured per-entry cost, so this run prints the cost at a
    // placeholder rather than pinning a number the taste has not yet earned.
    const placeholderN = 200;
    const units = corpus.map(unitOfEntry);
    const sample = sampleOf(units, placeholderN);
    const sha = createHash('sha256').update(sample.addresses.join('\n')).digest('hex');
    const started = Date.now();
    /** @type {Record<string, number>} */
    const verdicts = { FAIL: 0, WITHHELD: 0, PASS: 0 };
    for (const unit of sample.picked) verdicts[composedVerdictOf(walkComposed(unit, ground))] += 1;
    const elapsed = Date.now() - started;
    const perUnitMicros = Math.round((elapsed * 1000) / Math.max(1, sample.n));
    console.log(`\nTHE SAMPLED COMPOSED WALK · N is a PLACEHOLDER until car 6 sets it`
      + `\n  N ${sample.n} of ${sample.total}   sample sha ${sha}`
      + `\n  FAIL ${verdicts.FAIL}   WITHHELD ${verdicts.WITHHELD}   PASS ${verdicts.PASS}`
      + `\n  cost ${elapsed} ms for the sample, about ${perUnitMicros} microseconds per unit;`
      + ` the whole corpus at this rate is about ${Math.round((perUnitMicros * corpus.length) / 1000)} ms\n`);
    expect(sample.n).toBe(placeholderN);
    expect(sha).toHaveLength(64);
    expect(verdicts.FAIL + verdicts.WITHHELD + verdicts.PASS).toBe(placeholderN);
  });
});
