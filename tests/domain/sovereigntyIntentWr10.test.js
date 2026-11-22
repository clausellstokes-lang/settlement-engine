/**
 * sovereigntyIntentWr10.test.js — WR-10 lane WW-E: the four consumer clauses.
 *
 * THE PINS ARE SHAPED BY WHAT COULD GO QUIETLY VACUOUS HERE, and each shape is named
 * where it is guarded:
 *
 *  • THE DEAD-BAND CLASS. `PRIVATE_BOOKS_DIVERGENCE_FLOOR01` and `UNSUPPRESSED_FLOOR01`
 *    are new bands, and this estate has shipped bands that could never fire (a march
 *    ceiling above every reachable pair; an "N× stronger" test above the maximum
 *    expressible ratio). Both are therefore pinned on BOTH SIDES against real
 *    `readWarSeatBooks` / `thresholdFactorOf` reads rather than hand-fed numbers: a
 *    realm-run court, a secure seat, and a precarious seat produce three different
 *    private-book weights, and the appetite floor is proven to BIND on a court whose
 *    commerce caution and insularity are both saturated.
 *
 *  • THE CONJUNCTION-BLIND GUARD. A suppression pin that only ever runs the suppressed
 *    fixture proves nothing about the suppressor. Every suppression pin below runs the
 *    SAME world twice — bond present and bond absent — and asserts both arms.
 *
 *  • THE SELF-REFERENTIAL PIN. The verdict table is not compared against itself: the
 *    observer natures are produced by `natureWordFor` over real `settlementAlignment`
 *    reads on three built courts, and the table's key set is asserted against those
 *    independently-derived words.
 *
 *  • THE IMPORT-LIST PIN (the P4 no-hidden-governor pattern). The leaf's reach is a
 *    reviewed exact set, so a "small lookup" added later reds here instead of widening
 *    the module in silence.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  SOVEREIGNTY_BOOKS_INTERESTS,
  SOVEREIGNTY_INTENT_TUNING,
  SOVEREIGNTY_JUDGED_NATURES,
  SOVEREIGNTY_SALE_VERDICTS,
  SOVEREIGNTY_SUPPRESSION_KINDS,
  judgeSovereigntySale,
  readSovereigntySaleIntent,
  saleAppetiteOf,
} from '../../src/domain/worldPulse/sovereigntyIntent.js';
import { natureWordFor } from '../../src/domain/worldPulse/conquestDoctrineStage.js';
import { settlementAlignment } from '../../src/domain/worldPulse/settlementAlignment.js';
import { razingOutcomeIdFor } from '../../src/domain/worldPulse/razing.js';
import { PEACE_REASON_TYPES, REASON_MIRRORS } from '../../src/domain/worldPulse/warReasonTaxonomy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/worldPulse/sovereigntyIntent.js';
const leafSource = readFileSync(join(ROOT, LEAF), 'utf8');

// ── FIXTURES ─────────────────────────────────────────────────────────────────

const RULES = Object.freeze({
  settlementPoliticsEnabled: true,
  factionCompetitionEnabled: true,
  dispositionChannelsEnabled: true,
});

/** A four-channel disposition entry. Absent channels read neutral. */
const channels = (mercantile, insular) => ({
  channels: { mercantile: { stock01: mercantile }, insular: { stock01: insular } },
});

/** A ruling NPC the ladder can name. `npcId('a', {id:'ruler'}, 0)` === 'a:ruler'. */
function ruler(overrides = {}) {
  return {
    id: 'ruler',
    name: 'Lady Arin',
    importance: 'pillar',
    factionAffiliation: 'Crown',
    personality: { dominant: 'principled', flaw: 'patient', modifier: 'diplomatic' },
    facets: { alignment: 'lawful_good', goal: 'protect_followers' },
    ...overrides,
  };
}

/** A seat-bearing snapshot item; `npcs: []` yields the realm-run court. */
function seatItem({
  id = 'seller', name = 'Sellhaven', legitimacy = 75,
  crownPower = 70, rivalPower = 30, npcs = [ruler()],
} = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      tier: 'city',
      npcs,
      powerStructure: {
        governingName: 'Crown',
        publicLegitimacy: { score: legitimacy },
        previousGovernments: [],
        factions: [
          { id: 'fac.crown', faction: 'Crown', power: crownPower, isGoverning: true },
          { id: 'fac.rival', faction: 'Rival House', power: rivalPower },
        ],
      },
    },
  };
}

/** A plain court with an authored conscience and a patron, for the alignment axis. */
function moralItem(id, name, { axis = null, personality = null } = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      tier: 'town',
      npcs: personality ? [{ id: 'seat', name: `${name} Elder`, personality }] : [],
      ...(axis ? { config: { primaryDeitySnapshot: { name: `${name} Patron`, alignmentAxis: axis } } } : {}),
    },
  };
}

const snap = (items) => ({
  settlements: items,
  byId: new Map(items.map((entry) => [String(entry.id), entry])),
});

const ladderFor = (sid, stock) => ({
  [sid]: { factions: { 'fac.crown': { rungs: [`${sid}:ruler`] } }, npcs: { [`${sid}:ruler`]: { stock } } },
});

/** A world whose seller court is seated, secure or precarious as asked. */
function seatedWorld({ legitimacy = 75, crownPower = 70, rivalPower = 30, stock = 7, disposition = null } = {}) {
  return {
    worldState: {
      simulationRules: { ...RULES },
      spatialLedgers: { npcLadder: ladderFor('seller', stock) },
      ...(disposition ? { dispositionStats: { seller: disposition } } : {}),
    },
    snapshot: snap([
      seatItem({ legitimacy, crownPower, rivalPower }),
      seatItem({ id: 'buyer', name: 'Buyholt' }),
    ]),
  };
}

/** A world whose seller court has no ladder-backed ruler at all (realm books). */
function realmWorld({ disposition = null } = {}) {
  return {
    worldState: {
      simulationRules: { ...RULES },
      spatialLedgers: { npcLadder: {} },
      ...(disposition ? { dispositionStats: { seller: disposition } } : {}),
    },
    snapshot: snap([
      seatItem({ npcs: [] }),
      seatItem({ id: 'buyer', name: 'Buyholt', npcs: [] }),
    ]),
  };
}

/** A live kinship mirror on the seller's own peace-reason entry. */
function withKinshipBond(worldState, fromId, toId) {
  return {
    ...worldState,
    spatialLedgers: {
      ...worldState.spatialLedgers,
      peaceReasons: {
        [`${fromId}>${toId}`]: {
          reasons: {
            [REASON_MIRRORS.lineage_claim]: {
              score: 0.6,
              sinceTick: 12,
              receipt: 'Sellhaven and Buyholt still keep the founding they share.',
            },
          },
        },
      },
    },
  };
}

const razingEntry = (razerId, victimId, tick) => ({
  impactKind: 'razing',
  sourceEventId: razingOutcomeIdFor({ road: 'initiation', razerId, victimId, tick }),
  settlementIds: [victimId],
  tick,
});

/** Three courts of three different moral natures, one buyer, one burned town. */
function judgmentWorld() {
  const items = [
    moralItem('saint', 'Saintsreach', { axis: 'good', personality: 'incorruptible' }),
    moralItem('plain', 'Plainford'),
    moralItem('tyrant', 'Tyrantsgate', { axis: 'evil', personality: 'cruel' }),
    moralItem('buyer', 'Buyholt'),
    moralItem('ember', 'Emberfall'),
  ];
  return {
    worldState: { simulationRules: { ...RULES } },
    snapshot: snap(items),
    wizardNews: { entries: [razingEntry('buyer', 'ember', 40)] },
    tick: 41,
  };
}

// ── §6.1 + E3 — THE DISPOSITION COLOUR, BUYER-BLIND BY SIGNATURE ─────────────

describe('WW-E §6.1 — WR-2 disposition colours the bar, never the target', () => {
  it('mercantile confidence reaches for the sale and an inward turn resists it', () => {
    const base = realmWorld().worldState;
    const neutral = saleAppetiteOf({ worldState: base, sellerId: 'seller' });
    const merchant = saleAppetiteOf({
      worldState: { ...base, dispositionStats: { seller: channels(1, 0.5) } }, sellerId: 'seller',
    });
    const hermit = saleAppetiteOf({
      worldState: { ...base, dispositionStats: { seller: channels(0.5, 1) } }, sellerId: 'seller',
    });

    expect(neutral.appetite01).toBe(SOVEREIGNTY_INTENT_TUNING.NEUTRAL_APPETITE01);
    expect(merchant.appetite01).toBeGreaterThan(neutral.appetite01);
    expect(hermit.appetite01).toBeLessThan(neutral.appetite01);
    // Both bands are live rather than merely ordered: each arm moves by its own reach.
    expect(merchant.appetite01).toBe(0.8);
    expect(hermit.appetite01).toBe(0.2);
    expect(merchant.mercantileBand).toBe('dominant');
    expect(hermit.insularBand).toBe('dominant');
  });

  it('dark WR-2 reads the neutral appetite EXACTLY and says so in the receipt', () => {
    const worldState = {
      simulationRules: { warLayerEnabled: true },
      dispositionStats: { seller: channels(1, 0) },
    };
    const dark = saleAppetiteOf({ worldState, sellerId: 'seller' });
    expect(dark.channelsLit).toBe(false);
    expect(dark.appetite01).toBe(SOVEREIGNTY_INTENT_TUNING.NEUTRAL_APPETITE01);
    expect(dark.receipt).toMatch(/no four-channel outcome memory/);
    // The same ledger LIT moves the number — so the dark arm is a gate, not an accident.
    const lit = saleAppetiteOf({
      worldState: { ...worldState, simulationRules: { ...RULES } }, sellerId: 'seller',
    });
    expect(lit.channelsLit).toBe(true);
    expect(lit.appetite01).not.toBe(dark.appetite01);
  });

  it('a nameless seller gets a sentence, not a receipt starting with an apostrophe', () => {
    const nameless = saleAppetiteOf({ worldState: realmWorld().worldState, sellerId: '' });
    expect(nameless.receipt).toBe('No court is named as the seller, so no appetite is recorded.');
    expect(nameless.appetite01).toBe(SOVEREIGNTY_INTENT_TUNING.NEUTRAL_APPETITE01);
  });

  it('E3 STRUCTURAL: the appetite read cannot see a buyer or an asset', () => {
    // The signature is the guarantee. Prove it two ways: the body never names either
    // id, and passing them changes nothing.
    const start = leafSource.indexOf('export function saleAppetiteOf');
    const body = leafSource.slice(start, leafSource.indexOf('\n}', start));
    expect(start).toBeGreaterThan(0);
    // ANTI-VACUITY FIRST: the slice must contain the real body, not just its header,
    // or the two absences below would pass over an empty string.
    expect(body).toContain('mercantileBand');
    expect(body).toContain('channelLift');
    expect(body).toContain('return {');
    expect(body.length).toBeGreaterThan(600);
    expect(body.includes('buyerId')).toBe(false);
    expect(body.includes('assetId')).toBe(false);

    const worldState = { ...realmWorld().worldState, dispositionStats: { seller: channels(1, 0) } };
    const bare = saleAppetiteOf({ worldState, sellerId: 'seller' });
    const baited = saleAppetiteOf({
      worldState, sellerId: 'seller', buyerId: 'buyer', assetId: 'steading.seller.1',
    });
    expect(baited).toEqual(bare);
  });
});

// ── §6.2 — AMENDMENT-B COHERENCE: THE KINSHIP MIRROR SUPPRESSES ─────────────

describe('WW-E §6.2 — a live kinship bond suppresses the sale to zero, with a receipt', () => {
  it('suppresses on the bond and clears without it, on the SAME world', () => {
    const { worldState, snapshot } = seatedWorld({ disposition: channels(1, 0) });
    const ask = (state) => readSovereigntySaleIntent({
      worldState: state, snapshot, sellerId: 'seller', buyerId: 'buyer', assetId: 'greenhollow',
    });

    const unbound = ask(worldState);
    const bound = ask(withKinshipBond(worldState, 'seller', 'buyer'));

    expect(unbound.suppressed).toBe(false);
    expect(unbound.score01).toBeGreaterThan(0);
    expect(unbound.suppressionKind).toBeNull();
    expect(unbound.evidence.kinship).toBe('unbound');

    expect(bound.suppressed).toBe(true);
    expect(bound.score01).toBe(0);
    expect(bound.suppressionKind).toBe(REASON_MIRRORS.lineage_claim);
    expect(SOVEREIGNTY_SUPPRESSION_KINDS).toContain(bound.suppressionKind);
    expect(bound.evidence.kinship).toBe('bound');
    // §1b-B: the receipt NAMES the contradicting state, carrying the world's own words.
    expect(bound.receipt).toContain('Sellhaven and Buyholt still keep the founding they share.');
  });

  it('a spent bond (score 0) is not a live bond', () => {
    const { worldState, snapshot } = seatedWorld();
    const spent = withKinshipBond(worldState, 'seller', 'buyer');
    spent.spatialLedgers.peaceReasons['seller>buyer'].reasons[REASON_MIRRORS.lineage_claim].score = 0;
    const read = readSovereigntySaleIntent({
      worldState: spent, snapshot, sellerId: 'seller', buyerId: 'buyer', assetId: 'greenhollow',
    });
    expect(read.suppressed).toBe(false);
    expect(read.score01).toBeGreaterThan(0);
  });

  it('the mirror is named through WR-3\'s cause, not a hand-copied literal', () => {
    expect(REASON_MIRRORS.lineage_claim).toBe('kinship_bond');
    expect(PEACE_REASON_TYPES).toContain(REASON_MIRRORS.lineage_claim);
    expect(SOVEREIGNTY_SUPPRESSION_KINDS).toEqual([REASON_MIRRORS.lineage_claim]);
  });
});

// ── §6.3 — G's BOOKS: WHOSE LEDGER DOES THE SALE SERVE? ─────────────────────

describe('WW-E §6.3 — the books divergence, both sides of the band', () => {
  it('reads realm books, an aligned seat, and a divergent seat from real seat reads', () => {
    const ask = ({ worldState, snapshot }) => readSovereigntySaleIntent({
      worldState, snapshot, sellerId: 'seller', buyerId: 'buyer', assetId: 'greenhollow',
    });

    const realm = ask(realmWorld());
    const secure = ask(seatedWorld({ legitimacy: 95, crownPower: 95, rivalPower: 5, stock: 40 }));
    const precarious = ask(seatedWorld({ legitimacy: 5, crownPower: 10, rivalPower: 90, stock: 0 }));

    expect(realm.interestKind).toBe('realm');
    expect(realm.booksDiverge).toBe(false);
    expect(realm.receipt).toContain("the realm's books");

    expect(secure.interestKind).toBe('seat');
    expect(secure.booksDiverge).toBe(false);
    expect(secure.securityBand).toBe('secure');

    expect(precarious.interestKind).toBe('seat');
    expect(precarious.booksDiverge).toBe(true);
    expect(precarious.securityBand).toBe('precarious');
    expect(precarious.receipt).toContain("the ruling seat's own books");

    // The band has both arms on REAL reads: a court that cannot lose its seat does
    // not sell the family silver to keep it, and one that can, reaches further.
    expect(precarious.score01).toBeGreaterThan(secure.score01);
    expect(SOVEREIGNTY_BOOKS_INTERESTS).toContain(precarious.interestKind);
    expect(SOVEREIGNTY_BOOKS_INTERESTS).toContain(realm.interestKind);
  });

  it('every evidence value is a banded word, never a number (law B)', () => {
    const { worldState, snapshot } = seatedWorld({ disposition: channels(0.9, 0.2) });
    const read = readSovereigntySaleIntent({
      worldState, snapshot, sellerId: 'seller', buyerId: 'buyer', assetId: 'greenhollow',
    });
    const values = Object.values(read.evidence);
    expect(values.length).toBeGreaterThanOrEqual(7);
    for (const value of values) {
      expect(typeof value).toBe('string');
      expect(Number.isFinite(Number(value))).toBe(false);
    }
  });
});

// ── THE ZERO INVARIANT: SCORE 0 MEANS SUPPRESSED, AND NOTHING ELSE ─────────

describe('WW-E — score 0 identifies suppression exactly', () => {
  it('the unsuppressed floor BINDS on a saturated-against realm court', () => {
    const { worldState, snapshot } = realmWorld({ disposition: channels(0, 1) });
    const appetite = saleAppetiteOf({ worldState, sellerId: 'seller' });
    const read = readSovereigntySaleIntent({
      worldState, snapshot, sellerId: 'seller', buyerId: 'buyer', assetId: 'greenhollow',
    });
    // The raw colour really does reach zero — so the floor is a live band, not decoration.
    expect(appetite.appetite01).toBe(0);
    expect(read.score01).toBe(SOVEREIGNTY_INTENT_TUNING.UNSUPPRESSED_FLOOR01);
    expect(read.suppressed).toBe(false);
  });

  it('no unsuppressed configuration in the corner set scores zero', () => {
    const corners = [
      realmWorld({ disposition: channels(0, 1) }),
      realmWorld({ disposition: channels(1, 0) }),
      seatedWorld({ legitimacy: 5, crownPower: 10, rivalPower: 90, stock: 0, disposition: channels(0, 1) }),
      seatedWorld({ legitimacy: 95, crownPower: 95, rivalPower: 5, stock: 40, disposition: channels(0, 1) }),
    ];
    expect(corners.length).toBe(4);
    for (const corner of corners) {
      const read = readSovereigntySaleIntent({
        worldState: corner.worldState,
        snapshot: corner.snapshot,
        sellerId: 'seller',
        buyerId: 'buyer',
        assetId: 'greenhollow',
      });
      expect(read.suppressed).toBe(false);
      expect(read.score01).toBeGreaterThan(0);
    }
  });

  it('the read writes nothing into the world it read', () => {
    const { worldState, snapshot } = seatedWorld({ disposition: channels(1, 0) });
    const before = JSON.stringify(worldState);
    const first = readSovereigntySaleIntent({
      worldState, snapshot, sellerId: 'seller', buyerId: 'buyer', assetId: 'greenhollow',
    });
    const second = readSovereigntySaleIntent({
      worldState, snapshot, sellerId: 'seller', buyerId: 'buyer', assetId: 'greenhollow',
    });
    expect(JSON.stringify(worldState)).toBe(before);
    expect(second).toEqual(first);
  });
});

// ── §6.4 — THE OBSERVER-AXIS JUDGMENT (requirement 13) ─────────────────────

describe('WW-E §6.4 — the same buyer, judged differently by different courts', () => {
  it('three courts read three natures off their own alignment', () => {
    const { worldState, snapshot } = judgmentWorld();
    const natureOf = (id) => natureWordFor(
      Number(settlementAlignment(snapshot.byId.get(id), worldState).malice01),
    );
    expect(natureOf('saint')).toBe('benevolent');
    expect(natureOf('plain')).toBe('balanced');
    expect(natureOf('tyrant')).toBe('malicious');
    // The verdict table's keys are exactly those independently-derived words.
    expect(SOVEREIGNTY_JUDGED_NATURES).toEqual(['balanced', 'benevolent', 'malicious']);
  });

  it('selling to a believed razer is damnable, troubling, or unremarkable by observer', () => {
    const world = judgmentWorld();
    const judge = (observerId) => judgeSovereigntySale({ ...world, observerId, buyerId: 'buyer' });

    const saint = judge('saint');
    const plain = judge('plain');
    const tyrant = judge('tyrant');

    expect(saint.verdict).toBe('damnable');
    expect(plain.verdict).toBe('troubling');
    expect(tyrant.verdict).toBe('unremarkable');
    for (const read of [saint, plain, tyrant]) {
      expect(SOVEREIGNTY_SALE_VERDICTS).toContain(read.verdict);
      expect(read.believedRazingCount).toBe(1);
      expect(read.victimName).toBe('Emberfall');
      expect(read.receipt).toContain('Emberfall');
      expect(read.receipt).toContain(read.verdict);
    }
    // The buyer is ONE court and the world is ONE world: the difference is the axis.
    expect(saint.buyerId).toBe(tyrant.buyerId);
  });

  it('a buyer nobody believes has burned anything is unremarkable to every court', () => {
    const world = { ...judgmentWorld(), wizardNews: { entries: [] } };
    for (const observerId of ['saint', 'plain', 'tyrant']) {
      const read = judgeSovereigntySale({ ...world, observerId, buyerId: 'buyer' });
      expect(read.verdict).toBe('unremarkable');
      expect(read.believedRazingCount).toBe(0);
      expect(read.receipt).toMatch(/has burned no town/);
    }
  });

  it('belief, not truth: an unreconstructable entry accuses nobody', () => {
    const world = judgmentWorld();
    const forged = {
      ...world,
      wizardNews: { entries: [{ ...razingEntry('buyer', 'ember', 40), sourceEventId: 'world_outcome.razing.initiation.buyer.ember.999' }] },
    };
    expect(judgeSovereigntySale({ ...world, observerId: 'saint', buyerId: 'buyer' }).verdict).toBe('damnable');
    expect(judgeSovereigntySale({ ...forged, observerId: 'saint', buyerId: 'buyer' }).verdict).toBe('unremarkable');
  });

  it('the burned town is not a third-party witness to its own burning', () => {
    const world = judgmentWorld();
    // Emberfall reads no razer-hood in its own fire — the atrocity read is the
    // THIRD-PARTY outrage, and its own grievance rides another clock.
    expect(judgeSovereigntySale({ ...world, observerId: 'ember', buyerId: 'buyer' }).believedRazingCount).toBe(0);
    expect(judgeSovereigntySale({ ...world, observerId: 'saint', buyerId: 'buyer' }).believedRazingCount).toBe(1);
  });

  it('an injected per-pass reader is used instead of a rebuilt one', () => {
    const world = judgmentWorld();
    let calls = 0;
    const believedRazings = {
      believedFor: (observerId, accusedId) => {
        calls += 1;
        return observerId === 'saint' && accusedId === 'buyer'
          ? [{ razerId: 'buyer', victimName: 'Ashfell', tick: 12 }]
          : [];
      },
    };
    const read = judgeSovereigntySale({
      ...world, wizardNews: { entries: [] }, observerId: 'saint', buyerId: 'buyer', believedRazings,
    });
    expect(calls).toBe(1);
    expect(read.victimName).toBe('Ashfell');
    expect(read.verdict).toBe('damnable');
  });

  it('the latest believed burning is named, deterministically', () => {
    const world = judgmentWorld();
    const believedRazings = {
      believedFor: () => [
        { razerId: 'buyer', victimName: 'Ashfell', tick: 12 },
        { razerId: 'buyer', victimName: 'Emberfall', tick: 40 },
        { razerId: 'buyer', victimName: 'Barrowmere', tick: 40 },
      ],
    };
    const read = judgeSovereigntySale({ ...world, observerId: 'plain', buyerId: 'buyer', believedRazings });
    expect(read.victimName).toBe('Barrowmere');
    expect(read.believedRazingCount).toBe(3);
  });

  it('the three unknown roads are the ONLY roads to an unknown verdict', () => {
    const world = judgmentWorld();
    const noBuyer = judgeSovereigntySale({ ...world, observerId: 'saint', buyerId: '' });
    const itself = judgeSovereigntySale({ ...world, observerId: 'buyer', buyerId: 'buyer' });
    const ghost = judgeSovereigntySale({ ...world, observerId: 'nowhere', buyerId: 'buyer' });

    for (const read of [noBuyer, itself, ghost]) {
      expect(read.verdict).toBe('unknown');
      expect(read.observerNature).toBe('unknown');
      expect(read.believedRazingCount).toBe(0);
    }
    expect(noBuyer.receipt).toMatch(/no buyer is named/);
    expect(itself.receipt).toMatch(/does not judge its own purchase/);
    expect(ghost.receipt).toMatch(/cannot resolve the observing court/);
    // A resolvable court always has a readable nature, so the gate is the one road.
    for (const observerId of ['saint', 'plain', 'tyrant', 'ember']) {
      expect(judgeSovereigntySale({ ...world, observerId, buyerId: 'buyer' }).observerNature)
        .not.toBe('unknown');
      // anchored: each id above is asserted resolvable by the nature pins in this
      // describe block, so an empty snapshot could not make this negative vacuous.
    }
  });
});

// ── THE REACH OF THE LEAF ───────────────────────────────────────────────────

describe('WW-E — the leaf\'s import list is a reviewed exact set', () => {
  it('imports exactly the reads its four clauses need', () => {
    const specifiers = [...leafSource.matchAll(/^import\s[^;]*?from\s+'([^']+)';$/gm)]
      .map((match) => match[1])
      .sort();
    expect(specifiers).toEqual([
      '../../kernel/math.js',
      './believedRazings.js',
      './conquestDoctrineStage.js',
      './dispositionLedger.js',
      './dispositionProfile.js',
      './peaceReasons.js',
      './settlementAlignment.js',
      './warReasonTaxonomy.js',
      './warSeatBooks.js',
    ]);
  });

  it('holds no state, no rng, and no wall clock', () => {
    expect(leafSource.includes('Math.random')).toBe(false);
    expect(leafSource.includes('Date.now')).toBe(false);
    expect(leafSource.includes('rngContext')).toBe(false);
    // anchored: the source is asserted non-empty and self-naming here, so a failed
    // read cannot make the three absences above pass vacuously.
    expect(leafSource).toContain('export function judgeSovereigntySale');
    expect(leafSource.length).toBeGreaterThan(2000);
  });
});
