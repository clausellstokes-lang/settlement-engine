/**
 * treatyOrientationWr10g.test.js — CR-WR10-G: WHO GIVES, WHO RECEIVES, AND WHO PAYS.
 *
 * Every treaty this engine had ever minted ended a war, so `victorId` and `loserId`
 * were not merely the names of two fields — they were the names of two ROLES that
 * dozens of reads spelled directly. WR-10's market mints a treaty with a seller and a
 * buyer and no war anywhere in it, and each pin below exists because a specific way of
 * getting that wrong is cheap, silent, and durable:
 *
 *   • THE COURT THAT DOES NOT EXIST. `String(treaty.loserId)` on a victor-free record
 *     is the four-character string `"undefined"`, and peaceTerms' PASS 2 threads that
 *     value into FOUR reads at once — the payer's granary, the monitor reach, the
 *     strain accrual, and the `defaultedBy` write. Measured on this file's fixtures
 *     with the pre-ruling spelling restored: a sale's whole consideration goes SILENTLY
 *     INERT (`extractedFromLoser` 0, compliance frozen at 'honored' forever) because
 *     every one of those reads addresses a court nobody can find. That is the failure
 *     the direction and default pins below catch, and it is worse than a loud one.
 *   • THE COLLAPSED AXIS. A sale's conveyance runs seller → buyer, and its
 *     CONSIDERATION runs buyer → seller. Reading one axis for both is a one-word
 *     mistake that makes a sale's stream terms draw grain out of the party that was
 *     owed it. Pinned on a real granary in both directions, with the collapse executed
 *     as a mutant.
 *   • THE BOUND PARTY. `demilitarizationCapFor` and `occupationHoldFor` used to read
 *     `loserId` and mean "the party this binds". On a sale that party is the BUYER.
 *     Both arms pinned — the cap the buyer bears, and the seller's freedom from it.
 *   • THE RENDERED LIE. The treaty document is the single source of every party id and
 *     name four display surfaces show. A deep scan asserts no reachable string in a
 *     sale's document is `"undefined"`, and the names resolve to real ids.
 *
 * Every negative here is anchored against a live sibling or an inline reason. No
 * fixture mirrors the deriver: the treaty records are hand-built in the shape the real
 * mints produce, and every read under test is the production one.
 */
import { describe, it, expect } from 'vitest';

import {
  TREATY_ORIENTATION_KINDS,
  TREATY_ROLE_WORDS,
  treatyOrientationOf,
  treatyRoleWord,
} from '../../src/domain/worldPulse/treatyOrientation.js';
import {
  advanceTreaties, demilitarizationCapFor, occupationHoldFor, treatyDocument,
  treatyPairKey, TERM_CATALOG,
} from '../../src/domain/worldPulse/peaceTerms.js';
import { executeTreatyConveyances } from '../../src/domain/worldPulse/sovereigntyTransfer.js';
import { SOVEREIGNTY_REQUIRED_RULES } from '../../src/domain/worldPulse/sovereigntyAssets.js';
import { createOccupationRecord } from '../../src/domain/worldPulse/occupation.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const LIT = { warLayerEnabled: true, peaceEngineEnabled: true };
const SOVEREIGNTY_LIT = Object.fromEntries(SOVEREIGNTY_REQUIRED_RULES.map((k) => [k, true]));

// THE TWO COURTS ARE IDENTICAL — same granary, same population — so the ONLY thing that
// differs between the sale run and the war run below is the treaty's orientation. A
// direction pin whose two fixtures differ in wealth would be measuring the wealth.
const BUYER_MONTHS = 6;
const SELLER_MONTHS = 6;
const POP = 1800;

/** A snapshot item with a REAL granary, so a stream term has somewhere to move grain
 *  from and to and the direction pin measures physics rather than a no-op. */
function item(id, storageMonths) {
  return {
    id,
    name: id,
    settlement: {
      name: id, tier: 'town', population: POP,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
        foodSecurity: {
          storageMonths, dailyNeed: 100, dailyProduction: 100,
          deficitPct: 0, surplusPct: 0, resilienceScore: 50,
        },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'military seat', category: 'military', power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
  };
}

const PARTIES = [item('buyer', BUYER_MONTHS), item('seller', SELLER_MONTHS)];
const EDGES = [{ id: 'edge.buyer.seller', from: 'buyer', to: 'seller', relationshipType: 'neutral' }];

/** One term in the shape the mints write. */
function term(type, patch = {}) {
  const spec = TERM_CATALOG[type];
  const t = {
    type, family: spec.family, magnitude: 0.3, mintedTick: 0, expiresTick: 100,
    weightSpent: spec.weight, complianceState: 'honored', trueState: 'honored', burden01: 0,
    receipt: `${type} term`, ...patch,
  };
  if (spec.stream) { t.deliveredToVictor = t.deliveredToVictor ?? 0; t.extractedFromLoser = t.extractedFromLoser ?? 0; }
  if (spec.executor === 'seam') t.seam = true;
  return t;
}

/** THE SALE TREATY, exactly as CR-WR10-G declares it: sellerId/buyerId present, the war
 *  pair ABSENT (drop-when-absent — a key set to null is still a key and still a byte). */
function saleTreaty(terms, patch = {}) {
  return {
    parties: ['buyer', 'seller'],
    sellerId: 'seller', buyerId: 'buyer',
    sellerName: 'Seller Court', buyerName: 'Buyer Court',
    mintedTick: 0, budgetGranted: 0, budgetSpent: 0,
    complianceState: 'honored', terms, receipts: ['pin'], ...patch,
  };
}

/** THE WAR TREATY, the historic shape, unchanged. */
function warTreaty(terms, patch = {}) {
  return {
    parties: ['buyer', 'seller'],
    victorId: 'buyer', loserId: 'seller',
    victorName: 'Buyer Court', loserName: 'Seller Court',
    mintedTick: 0, believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored', terms, receipts: ['pin'], ...patch,
  };
}

function ledgerWorld(treaty, key, extra = {}) {
  return {
    tick: 10,
    simulationRules: { ...LIT },
    calendar: { elapsedWeeks: 30 },
    deployments: {},
    relationshipStates: {},
    spatialLedgers: { treaties: { [key]: treaty } },
    ...extra,
  };
}

/** Run the mover once over a ledger world. `pIndex` drives the obligor's capacity, which
 *  is what decides whether a term strains or defaults. */
function advance(worldState, pIndex = null) {
  const settlementUpdates = PARTIES.map((i) => ({ saveId: String(i.id), settlement: i.settlement }));
  return advanceTreaties({
    snapshot: { byId: new Map(PARTIES.map((i) => [String(i.id), i])), regionalGraph: { edges: EDGES } },
    worldState, settlementUpdates, graph: { edges: EDGES }, pIndex, tick: 10,
    now: '2026-01-01T00:00:00.000Z',
  });
}

/** A pressure index that crushes ONE settlement's economy and food — enough capacity
 *  loss for evolveCompliance to observe a default. */
function crushing(id) {
  return { get: (sid, kind) => (String(sid) === id && (kind === 'economy' || kind === 'food') ? { score: 95 } : undefined) };
}

/** The payer/payee granary read, straight off the mover's own settlementUpdates. */
function monthsIn(out, id) {
  const row = (out.settlementUpdates || []).find((u) => String(u.saveId) === id);
  return Number(row?.settlement?.economicState?.foodSecurity?.storageMonths);
}

/** Every string reachable in a value — the deep scan the rendered-lie pin uses. */
function allStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('CR-WR10-G — the orientation reader itself', () => {
  it('a WAR settlement reads the historic pair on BOTH axes: the loser gives AND owes', () => {
    const o = treatyOrientationOf(warTreaty([term('tribute')]));
    expect(o.kind).toBe('wartime');
    expect(o.resolved).toBe(true);
    expect(o.giverId).toBe('seller');
    expect(o.receiverId).toBe('buyer');
    // The axes COINCIDE here, and that coincidence is the whole reason the collapse
    // below was ever plausible: a wartime fixture cannot distinguish the two readings.
    expect(o.obligorId).toBe('seller');
    expect(o.obligeeId).toBe('buyer');
    expect(o.giverName).toBe('Seller Court');
    expect(o.receiverName).toBe('Buyer Court');
  });

  it('a SALE reads seller/buyer, and the obligation axis is the MIRROR of the conveyance axis', () => {
    const o = treatyOrientationOf(saleTreaty([term('tribute')]));
    expect(o.kind).toBe('sale');
    expect(o.resolved).toBe(true);
    // The conveyance: the seller hands the holding over.
    expect(o.giverId).toBe('seller');
    expect(o.receiverId).toBe('buyer');
    // THE MIRROR: the BUYER pays. This single assertion is the direction CR-WR10-G
    // asks for, and it is the one a collapsed implementation gets backwards.
    expect(o.obligorId, 'on a sale the BUYER pays').toBe('buyer');
    expect(o.obligeeId, 'and the SELLER is owed').toBe('seller');
    expect(o.obligorName).toBe('Buyer Court');
    expect(o.obligeeName).toBe('Seller Court');
  });

  it('MUTANT: collapsing the obligation axis onto the conveyance axis IS caught', () => {
    const o = treatyOrientationOf(saleTreaty([term('tribute')]));
    // The mutation under test: obligor := giver, the reading a single-axis
    // implementation produces. It is correct on the wartime record above and wrong here.
    const collapsed = { ...o, obligorId: o.giverId, obligeeId: o.receiverId };
    expect(collapsed.obligorId).not.toBe(o.obligorId);
    // anchored: the unmutated obligorId was asserted to be 'buyer' one test above, so
    // this inequality measures the mutation rather than a comparison that never holds.
    expect(collapsed.obligorId).toBe('seller');
    // …and the same mutation is INVISIBLE on the wartime record, which is exactly why
    // a war-only fixture set could never have caught it.
    const war = treatyOrientationOf(warTreaty([term('tribute')]));
    expect({ ...war, obligorId: war.giverId }).toEqual(war);
  });

  it('an unresolvable treaty yields EMPTY strings on every field — never the word "undefined"', () => {
    for (const shape of [null, undefined, {}, { terms: [] }, { victorId: 'lone' }, { buyerId: 'lone' },
      { victorId: 'same', loserId: 'same' }, { sellerId: 'same', buyerId: 'same' }]) {
      const o = treatyOrientationOf(shape);
      expect(o.kind).toBe('unknown');
      expect(o.resolved).toBe(false);
      expect([o.giverId, o.receiverId, o.obligorId, o.obligeeId,
        o.giverName, o.receiverName, o.obligorName, o.obligeeName]).toEqual(['', '', '', '', '', '', '', '']);
    }
    // THE PRE-GUARD BEHAVIOUR, REPRODUCED: the reading this module replaced really does
    // produce the four-character string, so the emptiness above is a cure and not a
    // property the tree always had.
    expect(String(/** @type {any} */ ({}).loserId)).toBe('undefined');
  });

  it('the kind vocabulary and the role words are closed, and the role word follows the instrument', () => {
    expect([...TREATY_ORIENTATION_KINDS].sort()).toEqual(['sale', 'unknown', 'wartime']);
    expect(Object.keys(TREATY_ROLE_WORDS).sort()).toEqual([...TREATY_ORIENTATION_KINDS].sort());
    const war = treatyOrientationOf(warTreaty([term('tribute')]));
    expect(treatyRoleWord(war, 'buyer')).toBe('victor');
    expect(treatyRoleWord(war, 'seller')).toBe('the bound party');
    const sale = treatyOrientationOf(saleTreaty([term('tribute')]));
    expect(treatyRoleWord(sale, 'buyer')).toBe('the buyer');
    expect(treatyRoleWord(sale, 'seller')).toBe('the seller');
    // A stranger is 'a party' under either instrument — the word is never guessed.
    expect(treatyRoleWord(sale, 'bystander')).toBe('a party');
    expect(treatyRoleWord(treatyOrientationOf({}), 'buyer')).toBe('a party');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('CR-WR10-G — the four structurally-requires rows', () => {
  it('THE STREAM DRAWS FROM THE BUYER on a sale, and from the loser on a war settlement', () => {
    const key = treatyPairKey('buyer', 'seller');
    const sale = advance(ledgerWorld(saleTreaty([term('tribute', { magnitude: 0.9 })]), key));
    const t = getSpatialLedger(sale.worldState, 'treaties')[key].terms.find((x) => x.type === 'tribute');
    // THE LEDGER'S OWN RECORD of who lost and who gained — exact, unrounded by display.
    expect(t.extractedFromLoser, 'the obligor actually paid').toBeGreaterThan(0);
    expect(t.deliveredToVictor, 'the obligee actually received').toBeGreaterThan(0);
    // THE DIRECTION, MEASURED ON REAL GRANARIES: the BUYER's fell, the SELLER's did not.
    expect(monthsIn(sale, 'buyer'), "the buyer's granary fell").toBeLessThan(BUYER_MONTHS);
    expect(monthsIn(sale, 'seller'), "the seller's granary did not pay").toBeGreaterThanOrEqual(SELLER_MONTHS);
    expect(monthsIn(sale, 'seller'), 'and it received').toBeGreaterThan(SELLER_MONTHS);

    // THE CONTROL, SAME PARTIES, SAME TERM, WAR ORIENTATION: the flow REVERSES, so the
    // assertion above measures the orientation rather than which fixture is richer.
    const war = advance(ledgerWorld(warTreaty([term('tribute', { magnitude: 0.9 })]), key));
    expect(monthsIn(war, 'seller'), "the war loser's granary fell").toBeLessThan(SELLER_MONTHS);
    expect(monthsIn(war, 'buyer'), 'the war victor received').toBeGreaterThan(BUYER_MONTHS);
  });

  it('THE DEFAULT IS NEVER WRITTEN NAMELESS: a sale names the buyer, an orientation-less record names nobody', () => {
    const key = treatyPairKey('buyer', 'seller');
    const sale = advance(
      ledgerWorld(saleTreaty([term('tribute', { magnitude: 0.9 })]), key), crushing('buyer'),
    );
    const stored = getSpatialLedger(sale.worldState, 'treaties')[key];
    expect(stored.complianceState, 'the crushed obligor is observed in default').toBe('defaulted');
    expect(stored.defaultedBy, 'the BUYER is the oathbreaker on a sale').toBe('buyer');
    // anchored: `defaultedBy` was just asserted to be the live string 'buyer', so this
    // exclusion measures a real value rather than an absent key.
    expect(stored.defaultedBy).not.toBe('undefined');

    // THE ORIENTATION-LESS RECORD may not accuse anyone — and reaching that branch takes
    // a deliberate probe, because an unresolved treaty's obligor is the EMPTY id and the
    // ordinary pressure index has no entry for it, so its terms can never strain at all.
    // Crushing the empty id is the only input that drives the write the guard guards; a
    // pin that skipped this would assert an absence the code could never have produced.
    const orphanKey = treatyPairKey('buyer', 'seller');
    const orphanTreaty = saleTreaty([term('tribute', { magnitude: 0.9 })], { sellerId: undefined, buyerId: undefined });
    const orphan = advance(ledgerWorld(orphanTreaty, orphanKey), crushing(''));
    const orphanStored = getSpatialLedger(orphan.worldState, 'treaties')?.[orphanKey];
    expect(orphanStored, 'the nameless record survives the pass').toBeTruthy();
    expect(orphanStored.complianceState, 'the probe really did drive it into default').toBe('defaulted');
    expectAbsentWithAnchor(
      Object.keys(orphanStored), 'defaultedBy', 'complianceState',
      'the record is live and its compliance verdict IS written, and it still names no oathbreaker',
    );

    // AND THE HONEST PRODUCTION FACT beside the probe: with an ordinary index, a treaty
    // that cannot say who owes it simply never strains, so nothing is written at all.
    const inert = advance(
      ledgerWorld(saleTreaty([term('tribute', { magnitude: 0.9 })], { sellerId: undefined, buyerId: undefined }), orphanKey),
      crushing('buyer'),
    );
    expect(getSpatialLedger(inert.worldState, 'treaties')[orphanKey].complianceState).toBe('honored');
  });

  it('THE CAP BINDS THE BUYER on a sale — and the seller walks free of it', () => {
    const key = treatyPairKey('buyer', 'seller');
    const world = ledgerWorld(saleTreaty([term('demilitarization', { magnitude: 0.6 })]), key);
    const buyerCap = demilitarizationCapFor(world, 'buyer', 10);
    expect(buyerCap, 'the obligor bears the cap').toBeCloseTo(0.4, 6);
    // anchored: the buyer's cap is a live number one line above, so a null here is the
    // seller's genuine freedom from a term it did not promise.
    expect(demilitarizationCapFor(world, 'seller', 10), 'the obligee bears nothing').toBeNull();

    // THE WAR CONTROL: the identical term on the historic orientation binds the LOSER,
    // which is the seller — the exact reverse, on the same two names.
    const warWorld = ledgerWorld(warTreaty([term('demilitarization', { magnitude: 0.6 })]), key);
    expect(demilitarizationCapFor(warWorld, 'seller', 10)).toBeCloseTo(0.4, 6);
    expect(demilitarizationCapFor(warWorld, 'buyer', 10)).toBeNull();
  });

  it('THE OCCUPATION HOLD is directional through the same reader, on both instruments', () => {
    const key = treatyPairKey('buyer', 'seller');
    const sale = ledgerWorld(saleTreaty([term('occupation_continuation', { magnitude: 0.5 })]), key);
    expect(occupationHoldFor(sale, 'buyer', 'seller', 10), 'obligor held by obligee').toBe(true);
    // anchored: the true direction is asserted one line above, so this false is the
    // reversal being refused rather than a read that always returns false.
    expect(occupationHoldFor(sale, 'seller', 'buyer', 10)).toBe(false);

    const war = ledgerWorld(warTreaty([term('occupation_continuation', { magnitude: 0.5 })]), key);
    expect(occupationHoldFor(war, 'seller', 'buyer', 10), 'loser held by victor').toBe(true);
    expect(occupationHoldFor(war, 'buyer', 'seller', 10)).toBe(false);
  });

  it('THE CONVEYANCE derives its seller and buyer from the sale fields, not from a war pair', () => {
    const assetId = 'holding';
    const worldState = {
      simulationRules: { ...SOVEREIGNTY_LIT },
      occupations: { [assetId]: { ...createOccupationRecord('seller', 3), state: 'vassalized', stateHeld: 9, resistance: 0.04 } },
      relationshipStates: {},
    };
    const treaty = saleTreaty([{ type: 'sovereignty_transfer', family: 'sovereignty_transfer', assetId }]);
    const out = executeTreatyConveyances({
      treaty, worldState, settlementUpdates: [], edges: EDGES, tick: 12, now: null,
    });
    expect(out.worldState.occupations[assetId].occupierId, 'the BUYER holds it now').toBe('buyer');
    expect(out.worldState.occupations[assetId].state, 'the rung survived').toBe('vassalized');
    // The document recorded what it did, and named no war.
    expect(treaty.receipts.join(' ')).toContain('seller');
    expect(treaty.receipts.join(' ')).toContain('buyer');
    // The receipts were just proved non-empty and to name both courts.
    // anchored: the exclusion measures prose, not an empty string.
    expect(treaty.receipts.join(' ')).not.toContain('undefined');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('CR-WR10-G — the display surface renders no "undefined"', () => {
  it('a sale document resolves every party slot, names the instrument, and carries the holding', () => {
    const key = treatyPairKey('buyer', 'seller');
    const world = ledgerWorld(saleTreaty([
      { type: 'sovereignty_transfer', family: 'sovereignty_transfer', assetId: 'holding', magnitude: 1,
        mintedTick: 0, expiresTick: 100, complianceState: 'honored', burden01: 0 },
      term('tribute', { magnitude: 0.3 }),
    ]), key);
    const doc = treatyDocument(world, key);
    expect(doc, 'the document is live').toBeTruthy();
    expect(doc.orientationKind).toBe('sale');
    expect(doc.victorId, 'the receiver fills the historic victor slot').toBe('buyer');
    expect(doc.loserId, 'the giver fills the historic loser slot').toBe('seller');
    expect(doc.victorName).toBe('Buyer Court');
    expect(doc.loserName).toBe('Seller Court');
    expect(doc.receiverRole).toBe('the buyer');
    expect(doc.giverRole).toBe('the seller');
    expect(doc.terms.find((t) => t.type === 'sovereignty_transfer').assetId).toBe('holding');
    // THE DEEP SCAN. Every reachable string in what four display surfaces consume.
    const strings = allStrings(doc);
    expect(strings.length, 'the scan reached real prose').toBeGreaterThan(5);
    // The scan was just proved non-empty and the party names were asserted above.
    // anchored: the exclusion measures rendered values, not an empty walk.
    expect(strings).not.toContain('undefined');
    expect(strings.some((s) => s.includes('undefined'))).toBe(false);
  });

  it('the historic war document is byte-identical in every field this ruling touched', () => {
    const key = treatyPairKey('buyer', 'seller');
    const doc = treatyDocument(ledgerWorld(warTreaty([term('tribute')]), key), key);
    expect(doc.victorId).toBe('buyer');
    expect(doc.loserId).toBe('seller');
    expect(doc.victorName).toBe('Buyer Court');
    expect(doc.loserName).toBe('Seller Court');
    expect(doc.pairKey).toBe(key);
    expect(doc.orientationKind).toBe('wartime');
    // A term with no assetId gains NO key — the drop-when-absent discipline, so every
    // treaty minted before WR-10 reads exactly as it always did.
    expect(Object.prototype.hasOwnProperty.call(doc.terms[0], 'assetId')).toBe(false);
  });
});
