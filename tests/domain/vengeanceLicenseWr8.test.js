/**
 * vengeanceLicenseWr8.test.js — WR-8 amendment R2, slice 5: THE VENGEANCE LICENSE.
 *
 * WHAT THIS FILE HAS TO PROVE, AND WHY THE BAR IS HIGHER THAN USUAL. A license is
 * a CAPABILITY: it unlocks the razing intent for a court that could not otherwise
 * reach it, at any alignment. So the pins here are not only "does the economy
 * work" — they are "can a forged save arm somebody", "can the cascade start",
 * and "does the record survive the five lifecycle paths the volume named". Chair
 * ruling CR-WR8-E permits this persistence surface precisely BECAUSE the volume
 * specified its whole lifecycle, so the lifecycle is what gets pinned.
 *
 * THE PERSISTENCE PINS RUN THE REAL SAVE NORMALIZER (`ensureWorldState`) rather
 * than a hand-rolled clone, because that function is what every save and load
 * actually goes through, and the property the whole pipeline leans on — unknown
 * sub-ledgers survive untouched — is a property of THAT function and of nothing
 * a fixture could stand in for.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import {
  LICENSE_DEAD_REASONS,
  VENGEANCE_LICENSE_LEDGER_KEY,
  VENGEANCE_LICENSE_TUNING,
  consumeVengeanceLicense,
  extinguishLicensesAgainst,
  heldLicense,
  licenseDeadReason,
  licenseExpired,
  licenseHoldersFrom,
  mintVengeanceLicenses,
  pruneVengeanceLicenses,
  readVengeanceLicenses,
  validateVengeanceLicense,
  vengeanceLicensesActive,
} from '../../src/domain/worldPulse/vengeanceLicense.js';
import { RAZING_TUNING, razingGate, readRelationshipExtremity } from '../../src/domain/worldPulse/razing.js';
import { CONQUEST_REQUIRED_RULES } from '../../src/domain/worldPulse/conquestDoctrineStage.js';
import { getSpatialLedger, hasSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { EXEMPT_LEDGER_KEYS } from '../../src/lib/spatialUsage.js';

const LIT = Object.freeze({ conquestDoctrineEnabled: true });
const DARK = Object.freeze({ conquestDoctrineEnabled: false });

/** The three friends of the victim, only two of whom can ever collect. */
const CANDIDATES = Object.freeze([
  // An ally of the victim who also borders the razer: minted.
  { holderId: 'greyford', adequacyToVictim01: 0.9, sharesEdgeWithRazer: true },
  // Equally devoted, but a STRANGER to the razer: CR-WR8-A refuses it.
  { holderId: 'far-harbour', adequacyToVictim01: 0.95, sharesEdgeWithRazer: false },
  // A neighbour of the razer who did not care about the victim: refused.
  { holderId: 'indifferent-vale', adequacyToVictim01: 0.2, sharesEdgeWithRazer: true },
  // A second real avenger, so "one per coalition" has something to bite on.
  { holderId: 'ashmoor', adequacyToVictim01: 0.7, sharesEdgeWithRazer: true },
]);

/** A world with one initiation razing already recorded at tick 100. */
function worldWithLicense(tick = 100) {
  return mintVengeanceLicenses({
    worldState: { simulationRules: LIT, tick },
    razerId: 'karrow', victimId: 'thornwall', tick, road: 'initiation',
    candidates: CANDIDATES,
  });
}

const LICENSE_ID = 'vengeance_license.karrow.thornwall.100';

// ─────────────────────────────────────────────────────────────────────────────
// THE MINT.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R2 — who is minted a license, and who is not', () => {
  test('victim-adequate holders WITH an existing edge to the razer, and nobody else', () => {
    const holders = licenseHoldersFrom(CANDIDATES, 'karrow');
    expect(holders).toEqual(['ashmoor', 'greyford']);
    // The two refusals are DIFFERENT refusals, and both matter.
    expect(holders).not.toContain('far-harbour');       // CR-WR8-A: no edge to the razer
    expect(holders).not.toContain('indifferent-vale');  // under the adequacy band
  });

  test('the razer never holds the right of vengeance for its own atrocity', () => {
    const holders = licenseHoldersFrom(
      [...CANDIDATES, { holderId: 'karrow', adequacyToVictim01: 1, sharesEdgeWithRazer: true }],
      'karrow',
    );
    expect(holders).not.toContain('karrow');
  });

  test('A FRIENDLESS VICTIM MINTS NOTHING, and the world state is the SAME REFERENCE', () => {
    // "A fat victim with devoted friends is expensive to burn; a friendless one
    // is cheap — which is honest, dark, and exactly the incentive landscape the
    // owner named." Identity, not equality: a refusing pass must be byte-identical.
    const before = { simulationRules: LIT };
    const after = mintVengeanceLicenses({
      worldState: before, razerId: 'karrow', victimId: 'thornwall', tick: 100,
      road: 'initiation', candidates: [{ holderId: 'nobody', adequacyToVictim01: 0.1, sharesEdgeWithRazer: true }],
    });
    expect(after).toBe(before);
    expect(hasSpatialLedger(after, VENGEANCE_LICENSE_LEDGER_KEY)).toBe(false);
  });

  test('DARK MINTS NOTHING, and dormancy is the same reference', () => {
    const before = { simulationRules: DARK };
    expect(mintVengeanceLicenses({
      worldState: before, razerId: 'karrow', victimId: 'thornwall', tick: 100,
      road: 'initiation', candidates: CANDIDATES,
    })).toBe(before);
    expect(vengeanceLicensesActive(before)).toBe(false);
    expect(vengeanceLicensesActive({ simulationRules: LIT })).toBe(true);
    // An absent rules object is dark, not permissive.
    expect(vengeanceLicensesActive(undefined)).toBe(false);
    expect(vengeanceLicensesActive({})).toBe(false);
  });

  test('the mint is IDEMPOTENT: a replayed tick does not mint a second license', () => {
    const once = worldWithLicense();
    const twice = mintVengeanceLicenses({
      worldState: once, razerId: 'karrow', victimId: 'thornwall', tick: 100,
      road: 'initiation', candidates: CANDIDATES,
    });
    expect(twice).toBe(once);
    expect(Object.keys(readVengeanceLicenses(twice))).toHaveLength(1);
  });

  test("this leaf's own flag is a real member of WR-8's lighting order", () => {
    // The module checks ONE flag and documents that the caller composes the rest
    // through conquestDoctrineActive. That division is only safe if the flag it
    // checks is genuinely part of the chain, so this pin owns the coupling
    // instead of the comment owning it.
    expect(CONQUEST_REQUIRED_RULES).toContain('conquestDoctrineEnabled');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE CLOSED LOOP.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R2 — the closed loop: vengeance mints no license', () => {
  test('a JUST razing mints NOTHING, and the cascade therefore cannot start', () => {
    // "The sacked razer's allies gain nothing, vengeance is a settlement not a
    // chain reaction, and the eye-for-an-eye cascade is structurally impossible."
    const world = worldWithLicense();
    const afterVengeance = mintVengeanceLicenses({
      worldState: world, razerId: 'greyford', victimId: 'karrow', tick: 300,
      road: 'vengeance', candidates: [
        { holderId: 'karrows-friend', adequacyToVictim01: 1, sharesEdgeWithRazer: true },
      ],
    });
    expect(afterVengeance).toBe(world);
    expect(Object.keys(readVengeanceLicenses(afterVengeance))).toEqual([LICENSE_ID]);
  });

  test('THE LOOP IS CLOSED AT THE ONLY DOOR: no road but `initiation` mints at all', () => {
    // The refusal is not a special case for `vengeance` — the mint is an
    // ALLOW-LIST of one, so a future road, a typo, or a missing field cannot
    // slip a license through.
    const world = { simulationRules: LIT };
    for (const road of ['vengeance', 'conquer', 'terms', 'none', '', undefined, null]) {
      expect(mintVengeanceLicenses({
        worldState: world, razerId: 'karrow', victimId: 'thornwall', tick: 100,
        road, candidates: CANDIDATES,
      })).toBe(world);
    }
    // And the one road that does.
    expect(mintVengeanceLicenses({
      worldState: world, razerId: 'karrow', victimId: 'thornwall', tick: 100,
      road: 'initiation', candidates: CANDIDATES,
    })).not.toBe(world);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// COUPLING — the license is necessary, never sufficient.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R2 — the coupling, end to end through the real gate', () => {
  test('a holder WITHOUT its own extremity cannot raze, licensed or not', () => {
    const world = worldWithLicense();
    const license = heldLicense(world, { holderId: 'greyford', razerId: 'karrow', tick: 120 });
    expect(license).not.toBeNull();

    const mild = readRelationshipExtremity({
      edgeType: 'rival', resentment01: 0.5, grievance01: 0.1,
      partyId: 'greyford', counterpartId: 'karrow',
    });
    const verdict = razingGate({
      siegeWon: true, extremity: mild, alignmentBand: 'benevolent', licenseHeld: license !== null,
    });
    expect(verdict.permitted).toBe(false);
    expect(verdict.refusal).toBe('not_extreme');
  });

  test('a holder WITH its own extremity may prosecute, at any alignment', () => {
    const world = worldWithLicense();
    const license = heldLicense(world, { holderId: 'greyford', razerId: 'karrow', tick: 120 });
    const extreme = readRelationshipExtremity({
      edgeType: 'hostile', resentment01: 0.85, grievance01: 0.8,
      partyId: 'greyford', counterpartId: 'karrow',
    });
    for (const alignmentBand of ['benevolent', 'balanced', 'malicious']) {
      const verdict = razingGate({
        siegeWon: true, extremity: extreme, alignmentBand, licenseHeld: license !== null,
      });
      expect(verdict.permitted).toBe(true);
    }
  });

  test('a NON-HOLDER gets nothing from somebody else\'s license', () => {
    const world = worldWithLicense();
    expect(heldLicense(world, { holderId: 'far-harbour', razerId: 'karrow', tick: 120 })).toBeNull();
    expect(heldLicense(world, { holderId: 'greyford', razerId: 'some-other-realm', tick: 120 })).toBeNull();
  });

  test('the two modules share ONE adequacy band (CR-WR8-B: one band reused, none minted)', () => {
    expect(VENGEANCE_LICENSE_TUNING.ADEQUACY_01).toBe(RAZING_TUNING.LICENSE_ADEQUACY_01);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CONSUMPTION, EXTINGUISHMENT, EXPIRY.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R2 — one per coalition, executed once', () => {
  test('the first HOLDER consumes it and every later attempt changes nothing', () => {
    const world = worldWithLicense();
    // W8-D F1: the consumer is one of the MINTED HOLDERS. It used to be an arbitrary
    // id ('the-answer'), which is how the hole below went unseen — the one-shot was
    // real but nobody had to hold the license to fire it.
    const consumed = consumeVengeanceLicense({
      worldState: world, licenseId: LICENSE_ID, coalitionId: 'greyford', tick: 150,
    });
    expect(consumed).not.toBe(world);
    expect(readVengeanceLicenses(consumed)[LICENSE_ID].consumedBy).toBe('greyford');
    expect(readVengeanceLicenses(consumed)[LICENSE_ID].consumedAtTick).toBe(150);

    // The SAME holder again, the OTHER holder, and a stranger: all no-ops, by reference.
    for (const coalitionId of ['greyford', 'ashmoor', 'somebody-else']) {
      expect(consumeVengeanceLicense({
        worldState: consumed, licenseId: LICENSE_ID, coalitionId, tick: 160,
      })).toBe(consumed);
    }
    // And nobody holds it any more, including the other minted holder.
    for (const holderId of ['greyford', 'ashmoor']) {
      expect(heldLicense(consumed, { holderId, razerId: 'karrow', tick: 160 })).toBeNull();
    }
    expect(licenseDeadReason(readVengeanceLicenses(consumed)[LICENSE_ID], 160)).toBe('consumed');
  });

  test('W8-D F1 — A NON-HOLDER CANNOT SPEND IT, at the writer AND at the read', () => {
    // A license is a CAPABILITY. Before this, ANY coalition id could consume one:
    // the one-shot was enforced against the wrong party, so a stranger — or a court
    // friendly to the razer — could burn the avengers' right and every real holder
    // would find it dead. Both halves are asserted, because they must move together.
    const world = worldWithLicense();
    const holders = readVengeanceLicenses(world)[LICENSE_ID].holders;
    expect(holders).toEqual(['ashmoor', 'greyford']);

    // (1) THE WRITER refuses, by reference — nothing about the world changes.
    for (const stranger of ['the-answer', 'karrow', 'thornwall', 'far-harbour']) {
      expect(holders).not.toContain(stranger);
      expect(consumeVengeanceLicense({
        worldState: world, licenseId: LICENSE_ID, coalitionId: stranger, tick: 150,
      })).toBe(world);
    }
    // And the license is still LIVE for the courts that actually hold it.
    for (const holderId of holders) {
      expect(heldLicense(world, { holderId, razerId: 'karrow', tick: 150 })).not.toBeNull();
    }

    // (2) THE READ refuses a HAND-FORGED non-holder consumption. This is why the
    // validator line and the writer gate are one change: if only the writer were
    // gated, a record like this would still validate and read as legitimately spent.
    const forged = {
      ...readVengeanceLicenses(world)[LICENSE_ID],
      consumedBy: 'the-answer',
      consumedAtTick: 150,
    };
    expect(validateVengeanceLicense(forged)).toBe(false);
    // ANCHOR (the negative control's own control): the SAME record with a real
    // holder as its consumer validates, so the refusal above is about entitlement
    // and not about some unrelated field this fixture happens to get wrong.
    expect(validateVengeanceLicense({ ...forged, consumedBy: 'greyford' })).toBe(true);
  });

  test('the debt dies with the debtor: a razer destroyed by another road extinguishes it', () => {
    const world = worldWithLicense();
    const after = extinguishLicensesAgainst({ worldState: world, razerId: 'karrow', tick: 200 });
    expect(heldLicense(after, { holderId: 'greyford', razerId: 'karrow', tick: 210 })).toBeNull();
    expect(licenseDeadReason(readVengeanceLicenses(after)[LICENSE_ID], 210)).toBe('extinguished');
    // An unrelated razer changes nothing, by reference.
    expect(extinguishLicensesAgainst({ worldState: world, razerId: 'nobody', tick: 200 })).toBe(world);
  });

  test('EXPIRY IS A READ AGAINST heldSince, and it is generational', () => {
    const world = worldWithLicense(100);
    const T = VENGEANCE_LICENSE_TUNING;
    // Patient: an heir collects what a father was owed.
    expect(heldLicense(world, { holderId: 'greyford', razerId: 'karrow', tick: 100 + T.EXPIRY_TICKS }))
      .not.toBeNull();
    // But not eternal: a century-old license is a legend, not a law.
    expect(heldLicense(world, { holderId: 'greyford', razerId: 'karrow', tick: 100 + T.EXPIRY_TICKS + 1 }))
      .toBeNull();
    // The band is generational on the canonical 52-week year, and is under a century.
    expect(T.TICKS_PER_YEAR).toBe(52);
    expect(T.EXPIRY_TICKS).toBe(T.EXPIRY_YEARS * T.TICKS_PER_YEAR);
    expect(T.EXPIRY_YEARS).toBeGreaterThan(20);
    expect(T.EXPIRY_YEARS).toBeLessThan(100);
    // ⚠️ NOTHING IS STORED. The record carries no countdown field at all, so no
    // save, load, undo or regeneration can leave it half-aged.
    const record = readVengeanceLicenses(world)[LICENSE_ID];
    expect(Object.keys(record).sort()).toEqual([
      'consumedAtTick', 'consumedBy', 'extinguishedAtTick', 'heldSince', 'holders', 'id',
      'razerId', 'victimId',
    ]);
    expect(licenseExpired(record, 100)).toBe(false);
    // An unreadable clock refuses rather than granting an immortal license.
    expect(licenseExpired(record, undefined)).toBe(true);
    expect(licenseExpired(null, 100)).toBe(true);
  });

  test('every dead reason this ledger can emit is in the closed vocabulary', () => {
    const world = worldWithLicense(100);
    const consumed = consumeVengeanceLicense({
      // W8-D F1: 'c' held nothing, so it can no longer spend the license. The
      // consumer here is a real minted holder.
      worldState: world, licenseId: LICENSE_ID, coalitionId: 'greyford', tick: 150,
    });
    const extinguished = extinguishLicensesAgainst({ worldState: world, razerId: 'karrow', tick: 150 });
    const seen = [
      licenseDeadReason(readVengeanceLicenses(consumed)[LICENSE_ID], 160),
      licenseDeadReason(readVengeanceLicenses(extinguished)[LICENSE_ID], 160),
      licenseDeadReason(readVengeanceLicenses(world)[LICENSE_ID], 100 + VENGEANCE_LICENSE_TUNING.EXPIRY_TICKS + 1),
    ];
    expect(seen).toEqual(['consumed', 'extinguished', 'expired']);
    for (const r of seen) expect(LICENSE_DEAD_REASONS).toContain(r);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE LIFECYCLE PATHS (CR-WR8-E) — every one the volume named.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R2 / CR-WR8-E — the five lifecycle paths the volume specified', () => {
  test('PERSIST: the license survives a JSON round-trip byte-identically', () => {
    const world = worldWithLicense();
    const round = JSON.parse(JSON.stringify(world));
    expect(JSON.stringify(readVengeanceLicenses(round)))
      .toBe(JSON.stringify(readVengeanceLicenses(world)));
    expect(readVengeanceLicenses(round)[LICENSE_ID].heldSince).toBe(100);
  });

  test('SAVE/LOAD: the real world-state normalizer carries the sub-ledger untouched', () => {
    // `ensureWorldState` is what every save and load actually goes through, and
    // unknown-sub-ledger preservation is a property of THAT function. A fixture
    // clone would prove nothing about the pipeline.
    const world = worldWithLicense();
    const normalized = ensureWorldState(JSON.parse(JSON.stringify(world)), { id: 'c', name: 'C' });
    const carried = getSpatialLedger(normalized, VENGEANCE_LICENSE_LEDGER_KEY);
    expect(carried).toBeTruthy();
    expect(JSON.stringify(carried))
      .toBe(JSON.stringify(getSpatialLedger(world, VENGEANCE_LICENSE_LEDGER_KEY)));
    // And it is still LIVE after the trip — the whole point of expiry-as-a-read.
    expect(heldLicense(normalized, { holderId: 'greyford', razerId: 'karrow', tick: 120 }))
      .not.toBeNull();
  });

  test('REGEN + UNDO: the license travels WITH the record and is never re-derived', () => {
    // The pulse-undo snapshot parks a copy of worldState; regeneration carries
    // worldState forward. Both are structural clones of the same object, so the
    // ledger rides along — and it must survive with NO chronicle present at all,
    // which is what "never re-derived from the chronicle" means as a test.
    const world = worldWithLicense();
    const snapshot = structuredClone(world);
    const restored = structuredClone(snapshot);
    expect(JSON.stringify(readVengeanceLicenses(restored)))
      .toBe(JSON.stringify(readVengeanceLicenses(world)));
    expect(restored.chronicle).toBeUndefined();
    expect(heldLicense(restored, { holderId: 'ashmoor', razerId: 'karrow', tick: 120 })).not.toBeNull();
  });

  test('IMPORT: a forged record is refused — and refused AT THE READ, not only at the door', () => {
    const good = readVengeanceLicenses(worldWithLicense())[LICENSE_ID];
    expect(validateVengeanceLicense(good)).toBe(true);

    /** Each forgery is a DIFFERENT lie, and each must be caught by its own check. */
    const forgeries = {
      'no razer': { ...good, razerId: '' },
      'razer is its own victim': { ...good, razerId: 'thornwall' },
      'the razer arms itself': { ...good, holders: ['karrow'] },
      'nobody holds it': { ...good, holders: [] },
      'a holder that is not a name': { ...good, holders: [42] },
      'heldSince is not a tick': { ...good, heldSince: 'long ago' },
      'heldSince is negative': { ...good, heldSince: -1 },
      'consumed by nobody, at a time': { ...good, consumedBy: null, consumedAtTick: 150 },
      'consumed by somebody, at no time': { ...good, consumedBy: 'ghost', consumedAtTick: null },
      'consumed before it was minted': { ...good, consumedBy: 'ghost', consumedAtTick: 99 },
      'extinguished before it was minted': { ...good, extinguishedAtTick: 99 },
      'not an object at all': 'a license, honest',
    };
    for (const [why, forged] of Object.entries(forgeries)) {
      expect(validateVengeanceLicense(forged), `must refuse: ${why}`).toBe(false);
      // AND the read must refuse it too, so an importer that forgot to validate
      // still cannot arm anybody.
      const poisoned = {
        simulationRules: LIT,
        spatialLedgers: { [VENGEANCE_LICENSE_LEDGER_KEY]: { [LICENSE_ID]: forged } },
      };
      expect(readVengeanceLicenses(poisoned), `read must drop: ${why}`).toEqual({});
      expect(heldLicense(poisoned, { holderId: 'greyford', razerId: 'karrow', tick: 120 }),
        `a forged save must arm nobody: ${why}`).toBeNull();
    }
    expect(Object.keys(forgeries)).toHaveLength(12);
  });

  test('PRUNE: a world finished with vengeance is byte-identical to one that never knew it', () => {
    const world = worldWithLicense(100);
    // Nothing dead yet: identity.
    expect(pruneVengeanceLicenses({ worldState: world, tick: 120 })).toBe(world);

    const consumed = consumeVengeanceLicense({
      worldState: world, licenseId: LICENSE_ID, coalitionId: 'greyford', tick: 150,
    });
    const pruned = pruneVengeanceLicenses({ worldState: consumed, tick: 160 });
    // The WHOLE sub-ledger goes, not just the record — dormancy at the end of
    // life, not only at the start.
    expect(hasSpatialLedger(pruned, VENGEANCE_LICENSE_LEDGER_KEY)).toBe(false);
    expect(JSON.stringify(pruned)).toBe(JSON.stringify({ simulationRules: LIT, tick: 100 }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATION, DETERMINISM, HYGIENE.
// ─────────────────────────────────────────────────────────────────────────────

describe('WR-8 R2 — the ledger is registered, deterministic, and non-mutating', () => {
  test('the sub-ledger key is classified in the spatialUsage manifest', () => {
    // The coverage walker enforces this too; asserting it here means the
    // classification is part of THIS lane's contract rather than a coincidence.
    expect(Object.keys(EXEMPT_LEDGER_KEYS)).toContain(VENGEANCE_LICENSE_LEDGER_KEY);
    expect(EXEMPT_LEDGER_KEYS[VENGEANCE_LICENSE_LEDGER_KEY].length).toBeGreaterThan(200);
  });

  test('holders and keys are codepoint-sorted, so a ledger serializes identically anywhere', () => {
    const shuffled = [...CANDIDATES].reverse();
    expect(licenseHoldersFrom(shuffled, 'karrow')).toEqual(licenseHoldersFrom(CANDIDATES, 'karrow'));
    const a = worldWithLicense();
    const b = mintVengeanceLicenses({
      worldState: { simulationRules: LIT, tick: 100 },
      razerId: 'karrow', victimId: 'thornwall', tick: 100, road: 'initiation',
      candidates: shuffled,
    });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  test('no writer mutates its inputs', () => {
    const world = worldWithLicense();
    const before = JSON.stringify(world);
    const candidatesBefore = JSON.stringify(CANDIDATES);
    consumeVengeanceLicense({ worldState: world, licenseId: LICENSE_ID, coalitionId: 'c', tick: 150 });
    extinguishLicensesAgainst({ worldState: world, razerId: 'karrow', tick: 150 });
    pruneVengeanceLicenses({ worldState: world, tick: 999999 });
    licenseHoldersFrom(CANDIDATES, 'karrow');
    expect(JSON.stringify(world)).toBe(before);
    expect(JSON.stringify(CANDIDATES)).toBe(candidatesBefore);
  });

  test('no rng, no wall-clock, and no chronicle read anywhere in the module', () => {
    const src = readFileSync('src/domain/worldPulse/vengeanceLicense.js', 'utf8');
    // ⚠️ THE SCAN IS ON CODE, NOT ON PROSE, and that distinction is why this pin
    // is worth having. Written against the raw file it red immediately — on the
    // module's own doc block, which says in so many words that it never reads the
    // chronicle. A pin that a correct explanation can fail is a pin that will be
    // silenced by deleting the explanation, so comments are stripped first and
    // the claim is asserted about the executable text.
    const code = src
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/(^|[^:])\/\/.*$/gm, '$1');
    expect(code).not.toMatch(/Math\.random/);
    expect(code).not.toMatch(/new Date|Date\.now/);
    // "never re-derived from the chronicle" — as a fact about the code.
    expect(code).not.toMatch(/chronicle/i);
    // Negative controls for this source pin, both directions: the file it reads
    // must really be the module under test (so a rename reds here instead of
    // guarding nothing), and the comment-stripper must not have eaten the code.
    expect(code).toMatch(/export function mintVengeanceLicenses/);
    expect(code).toMatch(/setSpatialLedger\(/);
    expect(src).toMatch(/chronicle/i); // the doc block DOES explain it; that is fine
  });
});
