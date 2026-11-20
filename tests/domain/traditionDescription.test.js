/**
 * traditionDescription.test.js — TRAD-1 (the seventh chair, 2026-11-20). The description under each tradition
 * (`domain/traditions/traditionDescription.js :: describeTradition`), built to the chair's rulings CTR1-CTR7:
 * two or three plain sentences from THIS town's own record (what is done; who keeps it; where it comes from; who pays
 * or presides), a clause only where the record holds a fitting fact, a CAUSE only on the two marked pairings (the
 * founding core and the founding; a rite of the dead and a siege, fire, flood or plague), derived at render with no
 * draw and no write, and an explicit AUDIENCE that fails closed to the reader.
 *
 * Every arm is written against a hand-built record so the fact it reads is on the page; the born pool is the walker's
 * (tests/lint/traditionDescriptionFrames.walker.test.js) and the shared page's (tests/security/…SharedPage.test.js).
 */
import { describe, it, expect } from 'vitest';
import { describeTradition } from '../../src/domain/traditions/traditionDescription.js';

/** A rite as genesis writes it (`genesis.js :: assembleRec`'s shape, the fields the leaf reads). */
function rite(index, element, act, extra = {}) {
  return {
    id: `tradition.ashford.${index}`,
    coreMotif: { element, act },
    name: `The ${element} ${act}`,
    foundedYear: index === 0 ? 1 : 30,
    ownerKey: null, ownerKind: null, ownerLabel: null, deityRef: null,
    mutationLog: [], lastHeldYear: null, lastOutcome: null, suppressedBy: null, adoptedFrom: null,
    ...extra,
  };
}

/** A town whose record holds one of each kind of fact the table reads. */
function town(overrides = {}) {
  return {
    name: 'Ashford',
    tier: 'town',
    institutions: [
      { name: 'Parish church', category: 'Religious' },
      { name: 'Weekly market', category: 'Economy' },
      { name: 'Town granary', category: 'Economy' },
      { name: 'Blacksmiths (3-10)', category: 'Crafts' },
    ],
    npcs: [
      { id: 'n-priest', name: 'Edda Vogt', gender: 'female', institution: { kind: 'house', key: 'Parish church', title: 'the priest', veiled: false } },
      { id: 'n-smith', name: 'Ulf Brenner', gender: 'male', institution: { kind: 'house', key: 'Blacksmiths (3-10)', title: 'the master smith', veiled: false } },
    ],
    powerStructure: {
      factions: [
        { faction: 'Town Council', category: 'government', isGoverning: true, power: 20 },
        { faction: 'Merchant Guilds', category: 'economy', power: 18 },
        { faction: 'Religious Authorities', category: 'religious', power: 15 },
        { faction: 'Military/Guard', category: 'military', power: 12 },
        { faction: "Thieves' Guild", category: 'criminal', power: 9 },
        { faction: 'The Hand Unseen', category: 'other', hidden: true, power: 15 },
      ],
    },
    history: {
      founding: { age: 120, foundedBy: 'three or four families who agreed to try wintering together and never stopped' },
      historicalEvents: [
        { name: 'The Siege', type: 'disaster', templateType: 'external_threat', severity: 'major', yearsAgo: 40 },
        { name: 'The Purge', type: 'occupation_infiltration', templateType: 'infiltration_fear', yearsAgo: 10 },
      ],
    },
    economicState: {
      incomeSources: [
        { source: 'Market Taxes', percentage: 30 },
        { source: 'Harvest', percentage: 25 },
        { source: 'Iron & Metalwork', percentage: 20 },
        { source: 'Court Fees & Fines', percentage: 10 },
      ],
    },
    ...overrides,
  };
}

/** Deep-freeze a value so a write anywhere inside throws in strict mode. */
function deepFreeze(v) {
  if (v && typeof v === 'object') { Object.values(v).forEach(deepFreeze); Object.freeze(v); }
  return v;
}

const sentences = (text) => String(text).split(/(?<=\.)\s+/).filter(Boolean);
const CAUSE_WORDS = /\b(since|because|in memory of|founded|founding by|after|to mark)\b/i;

describe('describeTradition — what is done (the short form), and nothing invented', () => {
  it('a rite whose element and act find no fitting fact says only what is done: one sentence', () => {
    const t = town({ institutions: [], npcs: [], economicState: { incomeSources: [] } });
    const d = describeTradition(rite(2, 'long-sun', 'feast'), t, { audience: 'owner' });
    expect(d).not.toBeNull();
    expect(sentences(d.text)).toHaveLength(1);
    expect(d.text).toMatch(/long days of high summer/);
    expect(d.named).toEqual({ houses: [], persons: [], powers: [], events: [] });
  });

  it('a description is two or three sentences at most', () => {
    const t = town();
    for (const [el, act] of [['the-dead', 'offering'], ['market', 'fair'], ['forge', 'contest'], ['harvest', 'feast']]) {
      const d = describeTradition(rite(1, el, act), t, { audience: 'owner' });
      expect(sentences(d.text).length).toBeLessThanOrEqual(3);
    }
  });

  it("a DM's authored custom tradition is the DM's truth: no description is composed for it", () => {
    expect(describeTradition({ ...rite(1, 'harvest', 'feast'), id: 'custom:abc' }, town(), { audience: 'owner' })).toBeNull();
  });

  it('the town is named by its own name, never "the town"', () => {
    const d = describeTradition(rite(0, 'charter', 'feast'), town({ name: 'Little Wend', tier: 'thorp' }), { audience: 'owner' });
    expect(d.text).toMatch(/Little Wend/);
    // anchored: this arm asserts this same text names Little Wend
    expect(d.text).not.toMatch(/\bthe town\b/); // lower case: the Town Council is a power's name, not the town
  });
});

describe('describeTradition — a cause only on the two marked pairings (CTR2)', () => {
  it('THE FOUNDING CORE carries the founding the record holds: its age and its founders, verbatim', () => {
    const d = describeTradition(rite(0, 'charter', 'feast'), town(), { audience: 'owner' });
    expect(d.text).toMatch(/120 years ago/);
    expect(d.text).toContain('three or four families who agreed to try wintering together and never stopped');
  });

  it('a founding-kind rite that is NOT the core carries no founding cause (the record holds no later charter)', () => {
    const d = describeTradition(rite(2, 'charter', 'feast'), town(), { audience: 'owner' });
    // anchored: the arm's own text is composed (the charter rite of a town that holds a founding); its founding facts are what is absent
    expect(d.text).not.toMatch(/120 years ago|wintering together/);
    // anchored: the same text is a composed description that this arm also asserts present by a positive match (the gloss it strips)
    expect(d.text.replace(/honours the charter/, '')).not.toMatch(CAUSE_WORDS);
  });

  it('A RITE OF THE DEAD carries the siege the record holds, by its name and year, and nothing of who won or what it cost', () => {
    const d = describeTradition(rite(1, 'the-dead', 'offering'), town(), { audience: 'owner' });
    expect(d.text).toMatch(/in memory of the Siege(?: since then)?, 40 years ago/);
    // anchored: this arm asserts this same text carries the Siege by name and year
    expect(d.text).not.toMatch(/\b(won|lost|fell|held|killed|dead of|died|victory|defeat)\b/i);
    expect(d.named.events).toEqual(['The Siege']);
  });

  it('the dead take the MOST RECENT siege, fire, flood or plague, and no other kind of event', () => {
    const t = town({ history: { ...town().history, historicalEvents: [
      { name: 'The Great Fire', templateType: 'great_fire', severity: 'major', yearsAgo: 90 },
      { name: 'The Flood', templateType: 'great_flood', severity: 'catastrophic', yearsAgo: 12 },
      { name: 'The Purge', templateType: 'infiltration_fear', yearsAgo: 3 },
    ] } });
    const d = describeTradition(rite(1, 'the-dead', 'vigil'), t, { audience: 'owner' });
    expect(d.text).toMatch(/the Flood, 12 years ago/);
    // anchored: this arm asserts this same text carries the Flood by name and year
    expect(d.text).not.toMatch(/Purge|Great Fire/);
  });

  it('a siege the record grades MINOR carries no cause: only a major or catastrophic one does', () => {
    const t = town({ history: { ...town().history, historicalEvents: [
      { name: 'The Siege', templateType: 'external_threat', severity: 'minor', yearsAgo: 5 },
      { name: 'The Plague Years', templateType: 'plague_years', severity: 'catastrophic', yearsAgo: 60 },
    ] } });
    const d = describeTradition(rite(1, 'the-dead', 'vigil'), t, { audience: 'owner' });
    expect(d.named.events).toEqual(['The Plague Years']);
  });

  it('a rite of the dead in a town whose record holds no such event carries no cause at all', () => {
    const t = town({ history: { ...town().history, historicalEvents: [{ name: 'The Purge', templateType: 'infiltration_fear', yearsAgo: 3 }] } });
    const d = describeTradition(rite(1, 'the-dead', 'vigil'), t, { audience: 'owner' });
    // anchored: the text is the vigil's composed description; the arm strips its own gloss before scanning, so the rest is live
    expect(d.text.replace(/remembers? the dead/, '')).not.toMatch(CAUSE_WORDS);
    expect(d.named.events).toEqual([]);
  });

  it('no other element carries a cause, even where the record holds a siege', () => {
    const t = town();
    for (const el of ['harvest', 'river', 'stone', 'field', 'forge', 'market', 'hunt', 'long-sun', 'tide', 'greening', 'stars', 'hearth']) {
      for (const act of ['feast', 'procession', 'vigil', 'contest', 'fair', 'offering']) {
        const d = describeTradition(rite(3, el, act), t, { audience: 'owner' });
        expect(d.named.events, `${el}/${act}`).toEqual([]);
        // anchored: this arm asserts named.events is an empty list for the same draw, and the walker proves every S1 is a frame
        expect(d.text, `${el}/${act}`).not.toMatch(/Siege|Purge|years ago/);
      }
    }
  });
});

describe('describeTradition — who keeps it, who presides, who pays (CTR1, CTR7)', () => {
  it('a house of a fitting kind keeps it, and the person on that house card presides under the title the card holds', () => {
    const d = describeTradition(rite(1, 'forge', 'feast'), town(), { audience: 'owner' });
    expect(d.text).toMatch(/the blacksmiths/);
    expect(d.text).toMatch(/Ulf Brenner, the master smith, presides/);
    expect(d.named.houses).toEqual(['Blacksmiths (3-10)']);
    expect(d.named.persons).toEqual(['Ulf Brenner']);
  });

  it('the founding core is overseen by the seat, in its prose form with its article', () => {
    const d = describeTradition(rite(0, 'founding', 'feast'), town(), { audience: 'owner' });
    expect(d.text).toMatch(/the Town Council/i);
    expect(d.named.powers).toEqual(['Town Council']);
  });

  it('a rite with no fitting power names none: the seat is not a filler', () => {
    const t = town({ institutions: [], npcs: [] });
    const d = describeTradition(rite(2, 'hunt', 'feast'), t, { audience: 'owner' });
    expect(d.named.powers).toEqual([]);
  });

  it('the economy states the rank the record holds, and only within the three largest incomes', () => {
    const d = describeTradition(rite(2, 'market', 'fair'), town(), { audience: 'owner' });
    expect(d.text).toMatch(/market taxes/i);
    expect(d.text).toMatch(/more .*than|Nothing brings/); // the chief rank, in plain words
    const low = town({ economicState: { incomeSources: [
      { source: 'Court Fees & Fines', percentage: 40 }, { source: 'Property Rents', percentage: 30 },
      { source: 'Guild Fees', percentage: 20 }, { source: 'Market Taxes', percentage: 10 },
    ] } });
    // anchored: this arm asserts the same rite in the default town names market taxes; only the incomes moved
    expect(describeTradition(rite(2, 'market', 'fair'), low, { audience: 'owner' }).text).not.toMatch(/Market taxes/i);
  });

  it('in play, the record\'s own owner keeps it, and no house is drawn beside it', () => {
    const d = describeTradition(rite(1, 'harvest', 'feast', { ownerKey: 'k', ownerKind: 'faction', ownerLabel: 'Merchant Guilds' }), town(), { audience: 'owner' });
    expect(d.text).toMatch(/the Merchant Guilds/i);
    expect(d.named.houses).toEqual([]);
    expect(d.named.powers).toEqual(['Merchant Guilds']);
  });
});

describe('describeTradition — the audience (CTR5), fail-closed to the reader', () => {
  const coup = () => town({ powerStructure: { factions: [
    { faction: "Thieves' Guild", category: 'criminal', isGoverning: true, power: 30 },
    { faction: 'Religious Authorities', category: 'religious', power: 15 },
  ] } });

  it('with no audience given, the leaf composes for the READER', () => {
    const asOwner = describeTradition(rite(0, 'founding', 'feast'), coup(), { audience: 'owner' });
    const asDefault = describeTradition(rite(0, 'founding', 'feast'), coup());
    expect(asOwner.named.powers).toEqual(["Thieves' Guild"]);
    expect(asDefault.named.powers).toEqual([]);
    // anchored: this arm asserts the same rite for the owner names the Thieves' Guild
    expect(asDefault.text).not.toMatch(/Thieves/);
  });

  it('a criminal seat is named on the owner\'s page and never on a reader\'s', () => {
    const r = describeTradition(rite(0, 'founding', 'feast'), coup(), { audience: 'reader' });
    // anchored: the default-audience arm above composes the same rite and names the guild for the owner
    expect(r.text).not.toMatch(/Thieves/);
    expect(r.named.powers).toEqual([]);
  });

  it('a HIDDEN power is named on no page: the town does not know it is there', () => {
    const t = town({ powerStructure: { factions: [{ faction: 'The Hand Unseen', category: 'other', hidden: true, isGoverning: true, power: 40 }] } });
    for (const audience of ['owner', 'reader']) {
      const d = describeTradition(rite(0, 'founding', 'feast'), t, { audience });
      // anchored: the same seat-less hidden-power town composes a founding rite whose S1 is asserted by the walker's frame law
      expect(d.text, audience).not.toMatch(/Hand Unseen/);
    }
    const lit = rite(0, 'founding', 'feast', { ownerKey: 'k', ownerKind: 'seat', ownerLabel: 'The Hand Unseen' });
    // anchored: the record names the hidden power as its owner, so the owner's page is the live path that must still drop it
    expect(describeTradition(lit, t, { audience: 'owner' }).text).not.toMatch(/Hand Unseen/);
  });

  it('a lit owner the reader\'s document does not hold as a public power is dropped for the reader', () => {
    const lit = rite(0, 'founding', 'feast', { ownerKey: 'k', ownerKind: 'seat', ownerLabel: "Thieves' Guild" });
    expect(describeTradition(lit, coup(), { audience: 'owner' }).text).toMatch(/Thieves' Guild/);
    // anchored: this arm asserts the owner's page names the Thieves' Guild for this same lit record
    expect(describeTradition(lit, coup(), { audience: 'reader' }).text).not.toMatch(/Thieves/);
    const absent = rite(1, 'harvest', 'feast', { ownerKey: 'k', ownerKind: 'faction', ownerLabel: 'Grain Holders' });
    // anchored: the in-play arm above names an owner held among the powers; here only the owner's presence among them changed
    expect(describeTradition(absent, town(), { audience: 'reader' }).text).not.toMatch(/Grain Holders/);
  });

  it('a PLANTED hideable house that would keep a rite: the owner\'s page names it, the reader\'s never does', () => {
    const t = town({ institutions: [{ name: 'Weekly market', category: 'Criminal', priorityCategory: 'criminal' }], npcs: [] });
    const owner = describeTradition(rite(2, 'market', 'fair'), t, { audience: 'owner' });
    const reader = describeTradition(rite(2, 'market', 'fair'), t, { audience: 'reader' });
    expect(owner.named.houses).toEqual(['Weekly market']);
    expect(reader.named.houses).toEqual([]);
    // anchored: this arm asserts the owner's page names the planted Weekly market for the same rite
    expect(reader.text).not.toMatch(/weekly market/i);
  });

  it('a person is named for the owner, whatever the veil bit, and never for a reader (a card\'s tie to its house is a field the DM may hide)', () => {
    for (const veiled of [false, true, undefined]) {
      const t = town({ npcs: [{ id: 'n', name: 'Edda Vogt', institution: { kind: 'house', key: 'Parish church', title: 'the priest', veiled } }] });
      expect(describeTradition(rite(1, 'the-dead', 'vigil'), t, { audience: 'owner' }).named.persons).toEqual(['Edda Vogt']);
      const r = describeTradition(rite(1, 'the-dead', 'vigil'), t, { audience: 'reader' });
      expect(r.named.persons, String(veiled)).toEqual([]);
      // anchored: this arm asserts the owner's page names Edda Vogt for the same rite and card
      expect(r.text).not.toMatch(/Edda Vogt|the priest/);
    }
  });
});

describe('describeTradition — derived at render: pure, deterministic, writes nothing (CTR3, CTR4)', () => {
  it('a frozen record and a frozen town describe without a write, and twice the same', () => {
    const t = deepFreeze(town());
    const recs = [rite(0, 'charter', 'feast'), rite(1, 'the-dead', 'offering'), rite(2, 'market', 'fair')].map(deepFreeze);
    const before = JSON.stringify({ t, recs });
    const a = recs.map((r) => describeTradition(r, t, { audience: 'owner' }));
    const b = recs.map((r) => describeTradition(r, t, { audience: 'owner' }));
    expect(a).toEqual(b);
    expect(JSON.stringify({ t, recs })).toBe(before);
  });

  it('total on garbage: no record, no town, an unknown motif', () => {
    expect(describeTradition(null, town(), { audience: 'owner' })).toBeNull();
    expect(describeTradition(rite(1, 'harvest', 'feast'), null, { audience: 'owner' })).toBeNull();
    expect(describeTradition(rite(1, 'nonsense', 'feast'), town(), { audience: 'owner' })).toBeNull();
    expect(() => describeTradition(rite(1, 'harvest', 'feast'), { name: 'X', institutions: 'no', npcs: 7, history: null }, { audience: 'owner' })).not.toThrow();
  });
});
