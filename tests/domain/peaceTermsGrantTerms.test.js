/**
 * peaceTermsGrantTerms.test.js — GR-3. THE NEW TERM FAMILIES, THE SEVENTH EXECUTOR,
 * AND THE LAW THAT NO TERM MAY BE VOCABULARY ALONE.
 *
 * GR-3 mints twelve catalog rows: five faith, three population, `mutual_defense` into
 * security, and the three trade-rights seams WR-10's bundle has been unable to name. It
 * mints the seventh executor kind with them — `grant`, a standing RIGHT one party holds
 * while the term lives — and consolidates every one of those reads in
 * `treatyEnforcement.js` under that module's one-reader law.
 *
 * ── WHY SECTION A EXISTS, AND WHY IT IS THE HARDEST TEST HERE ────────────────────
 *
 * `non_intervention` has sat in this catalog since W-CONVERGENCE as a term with no
 * producer: typed, priced, named, and unreachable by any path the engine can walk. That
 * is the D4 tombstone, and it was a DELIBERATE seam — but nothing stopped the next one
 * from being an accident. Section A is that lesson made law: every catalog row is
 * PRODUCED, or an explicitly documented SEAM, or carries a dated entry in a FROZEN,
 * SHRINK-ONLY owed register naming the wave that owes it. There is no fourth bucket, and
 * the mutant below proves a row cannot fall between them.
 *
 * ⚠ THE OWED REGISTER IS NOT AN EXEMPTION, and the difference is the whole design. An
 * exemption is a hole a law is born with. This register is the estate's own
 * REACH_OWED_ROWS idiom (couplingInclusion.walker.test.js): every entry names a real
 * catalog row and a real owing wave, an entry whose row IS produced reds until it is
 * DELETED so the win is banked, and the count is frozen so it cannot grow while
 * individual rows churn. A tenth owed row is a chair conversation, not an edit.
 *
 * ── WHAT THIS WAVE DELIBERATELY DID NOT BUILD, STATED HERE SO IT IS NOT RE-FOUND ──
 *
 * The nine faith/population/security rows have NO producer in this commit, and that is a
 * measured stop rather than an oversight. Their producer is the peacetime draft lens in
 * `pactFormation.js`, and a second build lane held that file under uncommitted
 * strict-typing work for the whole of this wave; editing it would have meant committing
 * another lane's unfinished change to land this one. The ladder PRIMITIVE they need
 * (`orderTermsByAsk`) ships here, exported and consumed by nothing — the GR-0
 * `treatiesPricedDuring` handoff idiom — and section E pins that unconsumed state so it
 * reds the day GR-3b wires it.
 *
 * @enforced-by itself
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  CLASS_TERM, TERM_CATALOG, TERM_FAMILIES, TERM_TYPES, orderTermsByAsk, termLabel,
} from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import {
  grantedRightFor, grantedRightStateFor, laborCompactFor, migrationRightFor,
  missionaryAccessFor, mutualDefenseFor, pilgrimageRightFor, sharedRiteFor,
  toleranceGuaranteeFor,
} from '../../src/domain/worldPulse/treatyEnforcement.js';
import { PACT_DRAFT_LENS } from '../../src/domain/worldPulse/pactFormation.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
/** Source with every comment stripped — a census must not indict an explanation. */
const code = (rel) => read(rel)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

// ── Fixtures ────────────────────────────────────────────────────────────────────

const EXPIRES = 100;

/** One term record of `type`, shaped exactly as the writers shape one.
 *  @param {string} type @param {string} beneficiary @param {number} [expiresTick] */
function term(type, beneficiary, expiresTick = EXPIRES) {
  const spec = TERM_CATALOG[type];
  return {
    type,
    family: spec.family,
    magnitude: 0.5,
    mintedTick: 0,
    expiresTick,
    weightSpent: spec.weight,
    complianceState: 'honored',
    trueState: 'honored',
    burden01: 0,
    receipt: `${type} for ${beneficiary || 'nobody named'}`,
    // T4 drop-when-absent: a term with no beneficiary is a war-door/sale term, and the
    // absence is what routes it through the orientation reader instead.
    ...(beneficiary ? { beneficiary } : {}),
  };
}

/** A negotiated instrument between two courts. @param {Array<Record<string, unknown>>} terms */
function negotiated(terms, extra = {}) {
  return {
    spatialLedgers: {
      treaties: {
        'treaty.aldermoor.brightwater': {
          parties: ['aldermoor', 'brightwater'],
          mintedTick: 0,
          provenance: 'negotiated',
          complianceState: 'honored',
          terms,
          ...extra,
        },
      },
    },
  };
}

/** A war-door instrument: victor/loser, terms carrying NO beneficiary.
 *  @param {Array<Record<string, unknown>>} terms */
function wartime(terms) {
  return {
    spatialLedgers: {
      treaties: {
        'treaty.aldermoor.brightwater': {
          parties: ['aldermoor', 'brightwater'],
          victorId: 'aldermoor',
          loserId: 'brightwater',
          mintedTick: 0,
          complianceState: 'honored',
          terms,
        },
      },
    },
  };
}

// ── A) NO PRODUCER-LESS TERM — the D4 lesson made law ───────────────────────────

/** Every term type an engine path can actually reach TODAY. Two producers exist: the
 *  war door's asset→term map, and the peacetime draft lens. Both are read LIVE. */
function producedTypes() {
  return new Set([
    ...Object.values(CLASS_TERM).map(String),
    ...Object.values(PACT_DRAFT_LENS).map(String).filter(Boolean),
  ]);
}

/**
 * THE FROZEN, SHRINK-ONLY OWED REGISTER. Nine rows, each naming the wave that owes it a
 * producer. TO COMPLY: when the producer lands, DELETE the entry — the exactness test
 * below reds until it is gone, so the win is banked and cannot be quietly re-borrowed.
 */
const PRODUCER_OWED = Object.freeze([
  // ⚠⚠ THE LAW'S FIRST RUN FOUND ONE NOBODY HAD DECLARED, AND IT PRE-DATES THIS WAVE.
  // `reparations` has a working `transfer` executor, a stream physics home
  // (treatyTransfer.js names it among the four), a `termLabel` case and a drafting
  // signing-reason line — and NO asset class in CLASS_TERM maps to it, so `draftTerms`,
  // which selects only through `CLASS_TERM[assetClass]`, can never reach it. It is the
  // `non_intervention` shape happening by ACCIDENT rather than by declaration, which is
  // exactly what this section exists to surface.
  //
  // NOT REPAIRED HERE, DELIBERATELY. The two lawful cures both belong to someone else:
  // giving it an asset class changes what war ends draft on the same seed (a golden shift
  // on a landed, pinned feature), and declaring it `executor:'seam'` retires a built
  // executor. Either is a chair ruling. Recorded where it will be found, owed to the
  // chair, and counted — which is the whole point of a register that cannot grow silently.
  Object.freeze({ type: 'reparations', owingWave: 'CHAIR', producer: 'an asset class in CLASS_TERM, or a seam declaration retiring it — PRE-EXISTING, found by this law on its first run' }),
  Object.freeze({ type: 'missionary_access', owingWave: 'GR-3b', producer: 'the faith rung of PACT_DRAFT_LENS' }),
  Object.freeze({ type: 'pilgrimage_right', owingWave: 'GR-3b', producer: 'the faith rung of PACT_DRAFT_LENS' }),
  Object.freeze({ type: 'shared_rite', owingWave: 'GR-3b', producer: 'the faith rung of PACT_DRAFT_LENS' }),
  Object.freeze({ type: 'temple_restitution', owingWave: 'GR-3b', producer: 'the faith rung of PACT_DRAFT_LENS' }),
  Object.freeze({ type: 'tolerance_guarantee', owingWave: 'GR-3b', producer: 'the faith rung of PACT_DRAFT_LENS' }),
  Object.freeze({ type: 'labor_compact', owingWave: 'GR-3b', producer: 'the population rung of PACT_DRAFT_LENS' }),
  Object.freeze({ type: 'migration_right', owingWave: 'GR-3b', producer: 'the population rung of PACT_DRAFT_LENS' }),
  Object.freeze({ type: 'settlement_provision', owingWave: 'GR-3b', producer: 'the population rung of PACT_DRAFT_LENS' }),
  Object.freeze({ type: 'mutual_defense', owingWave: 'GR-3b', producer: 'the security rung of PACT_DRAFT_LENS' }),
]);

/** The three buckets a catalog row may sit in, and a row sits in EXACTLY one.
 *  @param {string} type @param {Set<string>} produced @param {Record<string, unknown>} catalog */
function bucketOf(type, produced, catalog) {
  const buckets = [];
  if (produced.has(type)) buckets.push('produced');
  if (/** @type {{executor: string}} */ (catalog[type]).executor === 'seam') buckets.push('seam');
  if (PRODUCER_OWED.some((row) => row.type === type)) buckets.push('owed');
  return buckets;
}

describe('GR-3 A — NO PRODUCER-LESS TERM (the D4 tombstone made law)', () => {
  test('the census is looking at a real catalog and a real pair of producers', () => {
    // Every absence claim below is worthless if the catalog, the lens or the asset map
    // silently emptied. Floors tighten toward reality; they are never relaxed.
    expect(TERM_TYPES.length).toBeGreaterThanOrEqual(24);
    expect(TERM_FAMILIES.length).toBeGreaterThanOrEqual(11);
    expect(Object.keys(CLASS_TERM).length).toBeGreaterThanOrEqual(9);
    expect(Object.keys(PACT_DRAFT_LENS).length).toBeGreaterThanOrEqual(5);
    expect(producedTypes().size).toBeGreaterThanOrEqual(9);
  });

  test('EVERY catalog row is produced, or a documented seam, or on the owed register', () => {
    const produced = producedTypes();
    const homeless = TERM_TYPES.filter((type) => bucketOf(type, produced, TERM_CATALOG).length === 0);
    expect(
      homeless,
      'a term type is vocabulary and nothing else — no producer, no seam declaration, no'
      + ' owed-register entry. That is `non_intervention` happening again by accident,'
      + ' which is the exact failure this law exists to forbid. Give it a producer, mark'
      + ' it executor:\'seam\' with a reason, or add a dated owed-register row.',
    ).toEqual([]);
  });

  test('MUTANT: a row in NO bucket is caught, and one in a bucket is not', () => {
    // The predicate under test, run against a planted catalog rather than a planted file.
    // Without this the emptiness above could be a scan that had stopped scanning.
    const planted = { ...TERM_CATALOG, orphan_clause: { family: 'economic', executor: 'transfer' } };
    expect(bucketOf('orphan_clause', producedTypes(), planted)).toEqual([]);
    // ...and the three real buckets each genuinely catch their own member.
    expect(bucketOf('tribute', producedTypes(), TERM_CATALOG)).toEqual(['produced']);
    expect(bucketOf('non_intervention', producedTypes(), TERM_CATALOG)).toEqual(['seam']);
    expect(bucketOf('missionary_access', producedTypes(), TERM_CATALOG)).toEqual(['owed']);
  });

  test('the owed register is EXACT: every entry real, none already produced, count frozen', () => {
    const produced = producedTypes();
    const stale = [];
    for (const entry of PRODUCER_OWED) {
      if (!TERM_CATALOG[entry.type]) {
        stale.push(`${entry.type} is not a catalog row — DELETE its owed entry.`);
        continue;
      }
      if (produced.has(entry.type)) {
        stale.push(`${entry.type} HAS a producer now (${entry.owingWave} landed)`
          + ' — DELETE its owed entry so the win is banked.');
      }
      if (TERM_CATALOG[entry.type].executor === 'seam') {
        stale.push(`${entry.type} is a declared seam — it cannot also be owed.`);
      }
      expect(entry.owingWave.length, `${entry.type} owes no named wave`).toBeGreaterThan(2);
      expect(entry.producer.length, `${entry.type} names no producer`).toBeGreaterThan(10);
    }
    expect(stale).toEqual([]);
    // Frozen: the register cannot grow silently while individual rows churn. TEN, not
    // nine — the tenth is `reparations`, which this law found already orphaned on its
    // first run and which is owed to the chair rather than to a wave.
    expect(PRODUCER_OWED).toHaveLength(10);
    expect(new Set(PRODUCER_OWED.map((row) => row.type)).size).toBe(PRODUCER_OWED.length);
    // The pre-existing orphan is called out BY NAME so it cannot be quietly absorbed into
    // GR-3's own debt and closed by GR-3b along with the rest.
    expect(PRODUCER_OWED.filter((row) => row.owingWave === 'CHAIR').map((row) => row.type))
      .toEqual(['reparations']);
    expect(PRODUCER_OWED.filter((row) => row.owingWave === 'GR-3b')).toHaveLength(9);
  });

  test('the three trade-rights rows are SEAMS and stay producer-less (seam-2 tripwire)', () => {
    // Reds the day TR-5 lands its executors and producers — which is the instruction to
    // move the reachability obligation into TR-5's own commit, not a defect here.
    const commercial = TERM_TYPES.filter((type) => TERM_CATALOG[type].family === 'commercial');
    expect([...commercial].sort()).toEqual(['exclusivity', 'market_access', 'toll_exemption']);
    const produced = producedTypes();
    for (const type of commercial) {
      expect(TERM_CATALOG[type].executor, `${type} executor`).toBe('seam');
      expect(produced.has(type), `${type} has grown a producer`).toBe(false);
      expect(PRODUCER_OWED.some((row) => row.type === type)).toBe(false);
    }
  });

  test('every one of the twelve new rows has an authored crier\'s label', () => {
    // A label is not decoration: `termLabel` is what the treaty document, the fraying
    // line and the DM chip all speak. Pinned as a TABLE rather than as "it differs from
    // the default", because two of them legitimately DO coincide with the de-underscored
    // form — `shared rite` and `temple restitution` are already the house's words — and a
    // difference rule would have forced a worse label to satisfy the test.
    const LABELS = Object.freeze({
      missionary_access: 'right of mission',
      shared_rite: 'shared rite',
      pilgrimage_right: 'pilgrim\'s road',
      tolerance_guarantee: 'guarantee of tolerance',
      temple_restitution: 'temple restitution',
      migration_right: 'right of passage',
      labor_compact: 'labour compact',
      settlement_provision: 'settler\'s provision',
      mutual_defense: 'bond of mutual defence',
      exclusivity: 'pledge of trade primacy',
      market_access: 'grant of market access',
      toll_exemption: 'exemption from tolls',
    });
    expect(Object.keys(LABELS)).toHaveLength(12);
    for (const [type, expected] of Object.entries(LABELS)) {
      expect(TERM_CATALOG[type], `${type} is not a catalog row`).toBeTruthy();
      expect(termLabel(type), type).toBe(expected);
    }
    // ...and the default arm is still total for a type nobody has found a word for, so a
    // future row without a case renders legibly rather than breaking a dossier.
    expect(termLabel('a_clause_with_no_word')).toBe('a clause with no word');
  });
});

// ── B) THE GRANT READS — direction, lift, and the broken instrument ─────────────

describe('GR-3 B — the seventh executor: a standing right, read once', () => {
  test('a DIRECTIONAL grant runs one way only', () => {
    const world = negotiated([term('missionary_access', 'brightwater')]);
    expect(missionaryAccessFor(world, 'aldermoor', 'brightwater', 10)).toBe(true);
    // The mirror is the load-bearing half: brightwater holds the right, so aldermoor
    // does NOT hold it back. A read that answered true both ways would make every
    // directional clause in the catalog symmetric by accident.
    expect(missionaryAccessFor(world, 'brightwater', 'aldermoor', 10)).toBe(false);
  });

  test('a SYMMETRIC grant (`beneficiary: both`) runs both ways', () => {
    const world = negotiated([term('mutual_defense', 'both')]);
    expect(mutualDefenseFor(world, 'aldermoor', 'brightwater', 10)).toBe(true);
    expect(mutualDefenseFor(world, 'brightwater', 'aldermoor', 10)).toBe(true);
  });

  test('a LEGACY term with no beneficiary routes through the ONE orientation reader', () => {
    // A war's end can extract a right — Augsburg's darker half. Such a term carries no
    // beneficiary at all, so the direction comes from the obligation axis: the VICTOR
    // (obligee) holds what the loser (obligor) promised.
    const world = wartime([term('missionary_access', '')]);
    expect(missionaryAccessFor(world, 'brightwater', 'aldermoor', 10)).toBe(true);
    expect(missionaryAccessFor(world, 'aldermoor', 'brightwater', 10)).toBe(false);
  });

  test('THE LIFT IS ON THE EXPIRY TICK ITSELF, not the one after', () => {
    // The one-reader law's whole purpose: a right and a cap and a war-block must all end
    // on the same tick. A two-tick fixture, because a single-tick harness cannot tell an
    // expiry from an absence (the recorded vacuous-absence class).
    const world = negotiated([term('pilgrimage_right', 'brightwater', 40)]);
    expect(pilgrimageRightFor(world, 'aldermoor', 'brightwater', 39)).toBe(true);
    expect(pilgrimageRightFor(world, 'aldermoor', 'brightwater', 40)).toBe(false);
    expect(pilgrimageRightFor(world, 'aldermoor', 'brightwater', 41)).toBe(false);
  });

  test('A BROKEN TERM GRANTS NOTHING — and the unit is the TERM, not the instrument', () => {
    const kept = negotiated([term('tolerance_guarantee', 'brightwater')]);
    expect(toleranceGuaranteeFor(kept, 'aldermoor', 'brightwater', 10)).toBe(true);
    // The SAME right, observed in default. A court cannot claim a right it is seen to
    // have lost — but the question is asked of THIS CLAUSE, not of the document.
    const brokenTerm = term('tolerance_guarantee', 'brightwater');
    brokenTerm.complianceState = 'defaulted';
    expect(toleranceGuaranteeFor(negotiated([brokenTerm]), 'aldermoor', 'brightwater', 10)).toBe(false);
  });

  test('THE MIXED INSTRUMENT: one party\'s breach does not strip the OTHER party\'s right', () => {
    // ⚠ CHAIR RULING J-GR3-C1 (2026-08-06), and the case the wave never drove. The first
    // spelling of this read skipped any treaty whose INSTRUMENT-level complianceState was
    // 'defaulted'. peaceTerms.js sets exactly that field to `worstObserved` across ALL
    // live terms, driven by the LOSER's capacity — so a loser who stopped paying tribute
    // silently voided the VICTOR's honored tolerance guarantee. Election to void belongs
    // to the injured party, never to the mechanism. GR-2 widened §13 stacking to
    // family × beneficiary, so a multi-clause instrument is the NORMAL case and this fired
    // on the common path.
    const defaultedTribute = term('tribute', '');
    defaultedTribute.complianceState = 'defaulted';
    const honoredGuarantee = term('tolerance_guarantee', 'aldermoor');
    const mixed = negotiated([defaultedTribute, honoredGuarantee], { complianceState: 'defaulted' });
    // The instrument really is in default — the fixture is not quietly honored.
    expect(mixed.spatialLedgers.treaties['treaty.aldermoor.brightwater'].complianceState)
      .toBe('defaulted');
    // …and the right that nobody breached SURVIVES, in both of its doors.
    expect(toleranceGuaranteeFor(mixed, 'brightwater', 'aldermoor', 10)).toBe(true);
    expect(grantedRightStateFor(mixed, 'tolerance_guarantee', 'brightwater', 'aldermoor', 10))
      .toBe('honored');
  });

  test('NEVER GRANTED and GRANTED-THEN-VOIDED are different answers, not one', () => {
    // The second half of J-GR3-C1. Collapsing these two would make a broken right
    // indistinguishable from one that never existed — absence read as denial, which is
    // exactly what the DARK/ABSENT/NONSENSE pin above forbids. `grantedRightFor` answers
    // false for both (neither is HELD); only the state read separates them, which is why
    // both doors are asserted on both worlds.
    const nothingGranted = negotiated([term('tribute', '')]);
    expect(grantedRightFor(nothingGranted, 'tolerance_guarantee', 'brightwater', 'aldermoor', 10))
      .toBe(false);
    expect(grantedRightStateFor(nothingGranted, 'tolerance_guarantee', 'brightwater', 'aldermoor', 10))
      .toBe('');

    const voided = term('tolerance_guarantee', 'aldermoor');
    voided.complianceState = 'defaulted';
    const wasGranted = negotiated([voided]);
    expect(grantedRightFor(wasGranted, 'tolerance_guarantee', 'brightwater', 'aldermoor', 10))
      .toBe(false);
    expect(grantedRightStateFor(wasGranted, 'tolerance_guarantee', 'brightwater', 'aldermoor', 10))
      .toBe('defaulted');
  });

  test('honored on parchment, harassed on the road — the right stands while it frays', () => {
    // The peacetime face of §12.2. `grantedRightStateFor` reports the OBSERVED word and
    // never `trueState`, so the fog governs a right exactly as it governs a war-block.
    const strained = term('migration_right', 'brightwater');
    strained.complianceState = 'strained';
    strained.trueState = 'defaulted';
    const world = negotiated([strained]);
    expect(migrationRightFor(world, 'aldermoor', 'brightwater', 10)).toBe(true);
    expect(grantedRightStateFor(world, 'migration_right', 'aldermoor', 'brightwater', 10)).toBe('strained');
    // ...and the truth the observer has not earned never leaves the ledger by this door.
    expect(grantedRightStateFor(world, 'migration_right', 'aldermoor', 'brightwater', 10)).not.toBe('defaulted');
    // An absent right says so with an empty word rather than a compliance state.
    expect(grantedRightStateFor(world, 'labor_compact', 'aldermoor', 'brightwater', 10)).toBe('');
  });

  test('DARK / ABSENT / NONSENSE all return the identity, never a guess', () => {
    const world = negotiated([term('labor_compact', 'brightwater')]);
    expect(laborCompactFor({}, 'aldermoor', 'brightwater', 10)).toBe(false); // no ledger
    expect(laborCompactFor(null, 'aldermoor', 'brightwater', 10)).toBe(false);
    expect(laborCompactFor(world, 'aldermoor', 'nowhere', 10)).toBe(false); // not a party
    expect(grantedRightFor(world, '', 'aldermoor', 'brightwater', 10)).toBe(false); // no type
    // A right nobody granted is absent, not defaulted — absence and denial are different
    // facts and the read must not collapse them.
    expect(sharedRiteFor(world, 'aldermoor', 'brightwater', 10)).toBe(false);
  });

  test('A COURT CANNOT GRANT ITSELF A RIGHT — and the guard is what stops it', () => {
    // ⚠ THIS FIXTURE IS BUILT SO THE SELF-GUARD IS THE ONLY THING HOLDING, and that is a
    // MEASURED correction. The first version of this pin asked for a self-grant against a
    // world whose only term ran to the OTHER court, so the beneficiary check refused it
    // and the assertion passed with the self-guard DELETED — the executed mutant proved
    // it. Two guards over one job can only be pinned jointly unless the fixture disarms
    // one of them, so this term's beneficiary IS the self id: strike the guard and the
    // read returns the term.
    const world = negotiated([term('labor_compact', 'aldermoor')]);
    expect(laborCompactFor(world, 'brightwater', 'aldermoor', 10), 'the fixture is live')
      .toBe(true);
    expect(laborCompactFor(world, 'aldermoor', 'aldermoor', 10)).toBe(false);
    expect(grantedRightFor(world, 'labor_compact', 'aldermoor', 'aldermoor', 10)).toBe(false);
    expect(grantedRightStateFor(world, 'labor_compact', 'aldermoor', 'aldermoor', 10)).toBe('');
  });

  test('every named right is a POINTER to the one generic read, never a second walk', () => {
    // A second spelling of "is this right still live" is the fork this module's header
    // forbids. Each wrapper must agree with the generic read on the same fixture.
    /** @type {Array<[string, Function]>} */
    const wrappers = [
      ['missionary_access', missionaryAccessFor], ['shared_rite', sharedRiteFor],
      ['pilgrimage_right', pilgrimageRightFor], ['tolerance_guarantee', toleranceGuaranteeFor],
      ['migration_right', migrationRightFor], ['labor_compact', laborCompactFor],
      ['mutual_defense', mutualDefenseFor],
    ];
    expect(wrappers).toHaveLength(7);
    for (const [type, wrapper] of wrappers) {
      const world = negotiated([term(type, 'brightwater')]);
      expect(wrapper(world, 'aldermoor', 'brightwater', 10), type)
        .toBe(grantedRightFor(world, type, 'aldermoor', 'brightwater', 10));
      expect(wrapper(world, 'aldermoor', 'brightwater', 10), `${type} is reachable`).toBe(true);
      // ...and it reads its OWN type: a wrapper wired to the wrong row would pass the
      // agreement check above and fail here.
      expect(wrapper(negotiated([term('tribute', 'brightwater')]), 'aldermoor', 'brightwater', 10), type)
        .toBe(false);
    }
  });
});

// ── C) LAW ONE — the engine moves believers, never gods ─────────────────────────

describe('GR-3 C — LAW ONE holds across the whole faith family', () => {
  test('the grant reads reach NO deity surface at all', () => {
    // The strongest form of the negative available: not "it does not write deity truth"
    // but "it cannot — the module names no such thing". A source census, because a
    // behavioural pin over one fixture proves only that fixture.
    const body = code('src/domain/worldPulse/treatyEnforcement.js');
    for (const token of ['deity', 'Deity', 'pantheon', 'divine', 'miracle', 'god', 'God', 'faithProximity']) {
      expect(body.includes(token), `treatyEnforcement names ${token}`).toBe(false);
    }
    // Guard-the-guard: the same scan FINDS a token that genuinely is there.
    expect(body.includes('missionary_access')).toBe(true);
  });

  test('a faith term carries no theological field, only a right and a clock', () => {
    const faith = TERM_TYPES.filter((type) => TERM_CATALOG[type].family === 'faith');
    expect([...faith].sort()).toEqual([
      'missionary_access', 'pilgrimage_right', 'shared_rite', 'temple_restitution',
      'tolerance_guarantee',
    ]);
    for (const type of faith) {
      expect(Object.keys(TERM_CATALOG[type]).sort()).toEqual([
        'baseMag', 'baseYears', 'executor', 'family', 'maxYears', 'stream', 'weight',
      ]);
    }
    // Conversion-mandate is a DECLARED NON-GOAL (it would resolve belief by fiat), not an
    // omission — and a catalog that grew one would red here. ANCHORED on a faith sibling
    // that travels the identical derivation (TERM_CATALOG key ⇒ TERM_TYPES): if the
    // taxonomy ever drifts out from under this file, the anchor reds instead of the
    // absence passing vacuously.
    expectAbsentWithAnchor(TERM_TYPES, 'conversion_mandate', 'missionary_access',
      'the faith family admits access, never compulsion');
  });

  test('the house voice for a faith term speaks of priests and doors, never of gods', () => {
    // Same law, at the surface a reader actually meets.
    const voice = read('src/domain/display/treatyDocument.js');
    const faithRow = voice.slice(voice.indexOf('faith: Object.freeze('), voice.indexOf('population: Object.freeze('));
    expect(faithRow.length).toBeGreaterThan(200); // the slice really found the row
    for (const token of ['god', 'God', 'divine', 'miracle', 'blessed', 'holy']) {
      expect(faithRow.includes(token), `the faith voice says "${token}"`).toBe(false);
    }
    expect(faithRow).toContain('priests');
  });
});

// ── D) THE FOUND-WRITER TRIPWIRE — the V-18 readers are not wired YET ───────────

/** The reader families that treat a `defensive_pact` edge as support. The survey found
 *  readers with no writer; `mutualDefenseFor` is the writer, and NONE of these consults
 *  it yet. @type {readonly string[]} */
const DEFENSIVE_PACT_READERS = Object.freeze([
  'src/domain/worldPulse/warHomeCosts.js',
  'src/domain/worldPulse/warCapacityReads.js',
  'src/domain/worldPulse/warAllianceRisk.js',
  'src/domain/roads/thirdPartyRansom.js',
]);

describe('GR-3 D — the found-writer seam, pinned from the producer side', () => {
  test('all five reader families are still live and still read the relationship edge', () => {
    // A filename-anchored census goes vacuous the day a module moves, so the positive
    // half runs first: each file exists AND still spells the token whose writer is owed.
    for (const rel of DEFENSIVE_PACT_READERS) {
      expect(code(rel).includes('defensive_pact'), `${rel} no longer reads the edge`).toBe(true);
    }
    expect(DEFENSIVE_PACT_READERS.length).toBe(4);
    // The fifth is prose rather than code — the certification notes — so it is asserted
    // as prose and never counted among the wiring targets.
    expect(read('src/domain/certification/subsystemRowsWar.js')).toContain('defensive_pact');
  });

  test('NONE of them consults the writer yet — and this red is the instruction', () => {
    // WHEN THIS GOES RED IT IS NOT A DEFECT. It means a war-layer reader has been taught
    // to admit a sworn `mutual_defense` term as support, which is the consumer-side work
    // the GRAMMAR×WAR coupling row DEFERS BY NAME. Discharge that row in the same commit.
    //
    // Why it was not done here: `computeAllyRelief` takes no `tick`, so a treaty-scoped
    // right cannot be read at that site without threading the clock through war hot
    // paths — a war-owned change with its own verification, not a catalog wave's.
    const wired = DEFENSIVE_PACT_READERS.filter((rel) => code(rel).includes('mutualDefenseFor'));
    expect(wired).toEqual([]);
    // Guard-the-guard: the identical predicate FINDS the symbol where it does live, so
    // the emptiness above is a measurement and not a misspelt token.
    expect(code('src/domain/worldPulse/treatyEnforcement.js').includes('mutualDefenseFor')).toBe(true);
  });

  test('the writer itself is real and reachable, whatever the readers do', () => {
    // The producer-side obligation discharged HERE: the term drafts into an instrument,
    // the read finds it, and it lifts on its own tick. The consumer's silence cannot make
    // this vacuous.
    const world = negotiated([term('mutual_defense', 'both', 30)]);
    expect(mutualDefenseFor(world, 'aldermoor', 'brightwater', 29)).toBe(true);
    expect(mutualDefenseFor(world, 'aldermoor', 'brightwater', 30)).toBe(false);
  });

  test('`mutual_defense` shares the security family with `non_aggression` DELIBERATELY', () => {
    // §4's frozen COMPOSABLE pair is exactly {non_aggression, mutual_defense}. Sharing a
    // family is what makes that pair meaningful — and it is why the pair, not the family,
    // is the thing §13 stacking must learn to admit (GR-3b's work, owed).
    expect(TERM_CATALOG.mutual_defense.family).toBe('security');
    expect(TERM_CATALOG.non_aggression.family).toBe('security');
    // Promising to FIGHT is a heavier ask than promising not to, and the ladder says so.
    expect(TERM_CATALOG.mutual_defense.weight).toBeGreaterThan(TERM_CATALOG.non_aggression.weight);
  });
});

// ── E) THE ASK LADDER — derived, never restated ────────────────────────────────

describe('GR-3 E — orderTermsByAsk: the ordering primitive GR-3b consumes', () => {
  test('it orders by the catalog\'s own weight, codepoint on a tie', () => {
    const faith = orderTermsByAsk([
      'temple_restitution', 'shared_rite', 'missionary_access', 'tolerance_guarantee', 'pilgrimage_right',
    ]);
    expect([...faith]).toEqual([
      'shared_rite', 'pilgrimage_right', 'tolerance_guarantee', 'missionary_access', 'temple_restitution',
    ]);
    // ...and it is genuinely DERIVED: the order must equal a fresh sort of the live
    // weights, so a retune moves both together and nothing goes stale.
    const byWeight = [...faith].sort((a, b) => TERM_CATALOG[a].weight - TERM_CATALOG[b].weight);
    expect([...faith]).toEqual(byWeight);
    // The codepoint tie-break is live, not decorative: these two share weight 0.8.
    expect(TERM_CATALOG.reparations.weight).toBe(TERM_CATALOG.restitution.weight);
    expect([...orderTermsByAsk(['restitution', 'reparations'])]).toEqual(['reparations', 'restitution']);
  });

  test('a type the catalog does not carry is DROPPED, never ranked at zero', () => {
    // A phantom rung would be worse than a short ladder: it would draft a clause the
    // engine cannot execute.
    expect([...orderTermsByAsk(['shared_rite', 'a_row_that_never_landed'])]).toEqual(['shared_rite']);
    expect([...orderTermsByAsk([])]).toEqual([]);
    expect([...orderTermsByAsk(/** @type {never} */ (null))]).toEqual([]);
    // Duplicates collapse — a set, not a bag.
    expect([...orderTermsByAsk(['shared_rite', 'shared_rite'])]).toEqual(['shared_rite']);
  });

  test('THE HANDOFF SIGNAL: it is exported and consumed by NOTHING in src/', () => {
    // The GR-0 `treatiesPricedDuring` idiom. GR-3b wires the peacetime draft ladder to
    // this primitive; the day it does, this reds — and that red is the instruction to
    // delete this test and the owed register above together.
    const consumers = DEFENSIVE_PACT_READERS.concat([
      'src/domain/worldPulse/pactFormation.js',
      'src/domain/worldPulse/pactTriggers.js',
      'src/domain/worldPulse/peaceTermsDrafting.js',
      'src/domain/worldPulse/peaceTermsSale.js',
    ]).filter((rel) => code(rel).includes('orderTermsByAsk'));
    expect(consumers).toEqual([]);
    // Guard-the-guard: it really is exported under that name.
    expect(code('src/domain/worldPulse/peaceTermsCatalog.js')).toContain('export function orderTermsByAsk');
  });
});

// ── F) LIFECYCLE — the new terms ride the record, and nothing migrates ─────────

describe('GR-3 F — lifecycle totality on the new shapes', () => {
  test('a treaty carrying the new terms JSON-ROUND-TRIPS byte-true', () => {
    // persist → read. The new rows add no key to the ledger and no top-level state, so
    // the whole lifecycle claim reduces to: the record survives serialization and every
    // read agrees on both sides of it.
    const world = negotiated([
      term('missionary_access', 'brightwater'),
      term('migration_right', 'aldermoor'),
      term('mutual_defense', 'both'),
    ]);
    const revived = JSON.parse(JSON.stringify(world));
    expect(revived).toEqual(world);
    for (const [fn, grantor, grantee] of /** @type {Array<[Function, string, string]>} */ ([
      [missionaryAccessFor, 'aldermoor', 'brightwater'],
      [migrationRightFor, 'brightwater', 'aldermoor'],
      [mutualDefenseFor, 'aldermoor', 'brightwater'],
    ])) {
      expect(fn(revived, grantor, grantee, 10)).toBe(fn(world, grantor, grantee, 10));
      expect(fn(revived, grantor, grantee, 10)).toBe(true);
    }
  });

  test('NOTHING MIGRATES: a legacy record carries no new key and every read tolerates it', () => {
    // The `treatyTicksPerYear` provenance discipline (V-5) verbatim. A treaty minted
    // before this wave has no `beneficiary` anywhere and no faith term at all; every new
    // read must answer false rather than throw or invent.
    const legacy = wartime([term('tribute', ''), term('non_aggression', '')]);
    // ANCHORED on the fixture's own payload: `tribute` must be IN the serialization,
    // which proves the record was actually built and stringified. Without it, a fixture
    // that silently became `{}` would satisfy the absence of `beneficiary` perfectly.
    expectAbsentWithAnchor(JSON.stringify(legacy), 'beneficiary', 'tribute',
      'a pre-wave treaty carries no beneficiary key anywhere');
    for (const fn of [missionaryAccessFor, sharedRiteFor, pilgrimageRightFor,
      toleranceGuaranteeFor, migrationRightFor, laborCompactFor, mutualDefenseFor]) {
      expect(fn(legacy, 'aldermoor', 'brightwater', 10)).toBe(false);
      expect(fn(legacy, 'brightwater', 'aldermoor', 10)).toBe(false);
    }
  });

  test('DORMANCY: no engine path can mint one of these while the flag is dark', () => {
    // The `non_intervention` mechanism, measured rather than promised. The ONLY producer
    // these rows will ever have is the peacetime draft lens, which runs behind
    // `pactFormationEnabled`; and today it does not name them at all. So the registration
    // is byte-identical on every path, dark or lit.
    const produced = producedTypes();
    for (const entry of PRODUCER_OWED) expect(produced.has(entry.type), entry.type).toBe(false);
    // The war door cannot reach them either: no asset class names one. ANCHORED on
    // `tribute` — a live CLASS_TERM value reached by the identical Object.values read —
    // so a CLASS_TERM that drifted to empty reds here rather than certifying every owed
    // term as unreachable for the wrong reason.
    for (const entry of PRODUCER_OWED) {
      expectAbsentWithAnchor(Object.values(CLASS_TERM), entry.type, 'tribute',
        `no asset class drafts ${entry.type}`);
    }
  });
});
