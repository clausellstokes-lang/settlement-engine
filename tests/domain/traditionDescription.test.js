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
import { describe, it, expect, vi } from 'vitest';
import { describeTradition, holdsAName, HELD_NAME_STOP_WORDS } from '../../src/domain/traditions/traditionDescription.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { shownTraditionsOf, sharedTraditionRowsOf, descriptionSetOf } from '../../src/domain/traditions/shownTraditions.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { ACT_LEADS, ELEMENT_GLOSS, CRISIS_SCOPED_ACTS, CRISIS_SCOPED_ELEMENTS } from '../../src/data/traditionDescriptionTable.js';
import * as DESCRIPTION_TABLE from '../../src/data/traditionDescriptionTable.js';
import { pickRendezvous } from '../../src/kernel/proseHash.js';

/** The keeper's "too" wordings (TRAD-4 unit 10, the chair's 17:55 ruling): read off the table's namespace, {} before it. */
const KEEPER_FRAMES_TOO = /** @type {Record<string, Array<{ text: string }>>} */ (DESCRIPTION_TABLE.KEEPER_FRAMES_TOO || {});

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
/** S1's lead: the first sentence up to its gloss (no lead holds a full stop or " that "). */
const s1OfText = (text) => String(text).slice(0, String(text).indexOf('.')).split(' that ')[0];
const CAUSE_WORDS = /\b(since|because|in memory of|founded|founding by|goes back|after|to mark)\b/i; // "goes back": TRAD-4 unit 11's third founding line

describe('describeTradition — what is done (the short form), and nothing invented', () => {
  it('a rite whose element and act find no fitting fact says only what is done: one sentence', () => {
    const t = town({ institutions: [], npcs: [], economicState: { incomeSources: [] } });
    const d = describeTradition(rite(2, 'long-sun', 'feast'), t, { audience: 'owner' });
    expect(d).not.toBeNull();
    expect(sentences(d.text)).toHaveLength(1);
    expect(d.text).toMatch(/honours the long summer sun/); // point 121: the gloss this rite now draws (the rendezvous)
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
    expect(d.text).toMatch(/120 years/); // not "120 years ago" (TRAD-4 unit 11): "It goes back 120 years, to the founding of …"
    expect(d.text).toContain('three or four families who agreed to try wintering together and never stopped');
  });

  it('THE FOUNDER PHRASE ENDS THE SENTENCE (TRAD-4 unit 11): a founder phrase ending on a verb never has the age hung on it ("…never left, 120 years ago"); the reader never reads the founder', () => {
    const FOUNDER = 'a single extended family who came and never left';
    const at = (i) => town({ _seed: `founder-${i}`, history: { ...town().history, founding: { age: 120, foundedBy: FOUNDER } } });
    const hung = [];
    const lines = new Set();
    for (let i = 1; i <= 12; i += 1) {
      const owner = describeTradition(rite(0, 'founding', 'feast'), at(i), { audience: 'owner' });
      const s3 = sentences(owner.text).at(-1);
      lines.add(s3);
      expect(owner.parts.origin).toBe('cause');
      expect(s3).toMatch(/120 years/);
      if (!s3.endsWith(` by ${FOUNDER}.`) || /never left,? \d+ years ago/.test(owner.text)) hung.push(`founder-${i}: ${s3}`);
      const reader = describeTradition(rite(0, 'founding', 'feast'), at(i), { audience: 'reader' });
      expect(reader.parts.origin).toBe('cause');
      // anchored: the owner's text of this same rite and town is asserted above to carry the founder; the reader's never does
      expect(reader.text).not.toContain('never left');
    }
    expect(lines.size).toBe(3); // not vacuous: the twelve seeds reach all three founding lines
    expect(hung).toEqual([]);
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
    expect(d.text).toMatch(/in memory of the Flood since then, 12 years ago/); // point 121: the dead frame this rite now draws
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
    // any of the body-and-person frames (the pick is keyed on the settlement's identity): the house, then its presider
    expect(d.text).toMatch(/\b[Tt]he blacksmiths\b/);
    expect(d.text).toMatch(/Ulf Brenner, the master smith, presid(?:es|ing)\./);
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

  it('a house is named in its prose form (data/houseSentenceName.js :: houseSentenceName): the catalogue\'s "Colosseum/arena" keeps a contest as "the arena"', () => {
    const t = town({ institutions: [{ name: 'Colosseum/arena', category: 'Entertainment' }], npcs: [] });
    for (const audience of ['owner', 'reader']) {
      const d = describeTradition(rite(2, 'hearth', 'contest'), t, { audience });
      expect(d.named.houses, audience).toEqual(['Colosseum/arena']);
      expect(d.text, audience).toMatch(/\b[Tt]he arena\b/);
      // anchored: this arm asserts the same text names the house as the arena; the private rule's spelling is what is absent
      expect(d.text, audience).not.toMatch(/Colosseum/i);
    }
  });

  it('a PLURAL house never meets a singular frame verb ("The market squares is where it is kept", "The blacksmiths keeps it"), in any frame', () => {
    const squares = { name: 'Multiple market squares', category: 'Economy' };
    const smiths = { name: 'Blacksmiths (3-10)', category: 'Crafts' };
    const ulf = { id: 'n-smith', name: 'Ulf Brenner', institution: { kind: 'house', key: 'Blacksmiths (3-10)', title: 'the master smith', veiled: false } };
    const guilds = { powerStructure: { factions: [{ faction: 'Merchant Guilds', category: 'economy', power: 18 }] } };
    const cases = [
      [town({ institutions: [squares], npcs: [], powerStructure: { factions: [] } }), 'market', 'fair', {}], // place
      [town({ institutions: [squares], npcs: [], ...guilds }), 'market', 'fair', {}], // place and power
      [town({ institutions: [smiths], npcs: [] }), 'forge', 'feast', {}], // body
      [town({ institutions: [smiths], npcs: [ulf] }), 'forge', 'feast', {}], // body and person
      [town({ institutions: [squares], npcs: [] }), 'harvest', 'feast', { ownerKey: 'k', ownerKind: 'institution', ownerLabel: 'Multiple market squares' }], // in play
    ];
    const SINGULAR = /\b[Tt]he (?:market squares|blacksmiths) (?:is|keeps|has|meets|oversees)\b/;
    let named = 0;
    const singular = [];
    for (const [t, el, act, extra] of cases) {
      for (let i = 1; i <= 12; i += 1) {
        for (const s of [{}, { _seed: `plural-${i}` }]) {
          const d = describeTradition(rite(i, el, act, extra), { ...t, ...s }, { audience: 'owner' });
          if (/\b[Tt]he (?:market squares|blacksmiths)\b/.test(d.text)) named += 1;
          if (SINGULAR.test(d.text)) singular.push(`${el}/${act}#${i}${s._seed ? ` ${s._seed}` : ''}: ${d.text}`);
        }
      }
    }
    expect(named).toBe(cases.length * 24);
    // anchored: `named` counts the same texts naming the plural house; the singular verb after it is what is absent
    expect(singular).toEqual([]);
  });

  it('a PLURAL power takes a plural verb in every POWER_FRAMES kind (powerSentenceName.js :: powerVerb); a singular power keeps its singular verb', () => {
    // the keeping power alone (no house fits, no owner): the seat for a founding rite, the faith for the stars, the
    // merchantry for a fair. The religious archetype is read from the category, so its plural power is the faith's own.
    const kinds = [
      ['seat', 'founding', 'feast', { faction: 'Merchant Guilds', category: 'economy', isGoverning: true, power: 30 }],
      ['religious', 'stars', 'feast', { faction: 'Religious Authorities', category: 'religious', power: 30 }],
      ['merchantry', 'hunt', 'fair', { faction: 'Merchant Guilds', category: 'economy', power: 30 }],
    ];
    const SINGULAR = /\b[Tt]he (?:Merchant Guilds|Religious Authorities) (?:meets|oversees|keeps|has|pays)\b/;
    const AS_SUBJECT = /\bThe (?:Merchant Guilds|Religious Authorities) (?:meet|oversee|keep)\b/;
    const singular = [];
    const subject = new Set();
    for (const [kind, el, act, power] of kinds) {
      for (let i = 1; i <= 12; i += 1) {
        const t = town({ institutions: [], npcs: [], powerStructure: { factions: [power] }, _seed: `verb-${i}` });
        const d = describeTradition(rite(i, el, act), t, { audience: 'owner' });
        if (d.parts.keeper !== 'power') singular.push(`${kind}#${i}: no power keeps it: ${d.text}`);
        if (SINGULAR.test(d.text)) singular.push(`${kind}#${i}: ${d.text}`);
        if (AS_SUBJECT.test(d.text)) subject.add(kind);
      }
    }
    expect(singular).toEqual([]);
    // anchored: the twelve seeds reach the frame whose subject is the power in every kind (the plural verb stands)
    expect([...subject].sort()).toEqual(['merchantry', 'religious', 'seat']);
    const council = [];
    for (let i = 1; i <= 12; i += 1) {
      const t = town({ institutions: [], npcs: [], powerStructure: { factions: [{ faction: 'Elder Council', category: 'government', isGoverning: true, power: 30 }] }, _seed: `verb-${i}` });
      council.push(describeTradition(rite(i, 'founding', 'feast'), t, { audience: 'owner' }).text);
    }
    expect(council.some((x) => /\bThe Elder Council oversees it\./.test(x))).toBe(true);
    // anchored: the line above asserts the singular verb stands for the same council in these same texts
    expect(council.filter((x) => /\bthe Elder Council oversee\b/i.test(x))).toEqual([]);
  });

  it('THE ECONOMY BAND FOR A READER is ranked over the incomes a reader can be served: a criminal income row (isCriminal, withheld whole by the gallery veil) neither outranks the market taxes nor counts beside them', () => {
    const crime = { source: 'Smuggling & Black Markets', percentage: 35, isCriminal: true };
    const taxes = { source: 'Market Taxes', percentage: 30 };
    const harvest = { source: 'Harvest', percentage: 20 };
    const CHIEF = /Nothing brings Ashford more than market taxes|Market taxes bring Ashford more than anything else|Ashford takes in more from market taxes than from anything else/;
    const LESSER = /A good share of what Ashford takes in comes from market taxes|Market taxes are one of the mainstays of Ashford|Ashford takes in a good part of its living from market taxes/;
    const ONLY = /All that Ashford takes in comes from market taxes|Ashford lives by market taxes alone|Market taxes are all Ashford lives by/;
    const said = (incomeSources, audience) => describeTradition(rite(2, 'market', 'fair'), town({ economicState: { incomeSources } }), { audience }).text;
    expect(said([crime, taxes, harvest], 'reader')).toMatch(CHIEF);
    expect(said([crime, taxes, harvest], 'reader')).toBe(said([taxes, harvest], 'reader')); // the row present or withheld
    expect(said([crime, taxes], 'reader')).toMatch(ONLY);
    expect(said([crime, taxes], 'reader')).toBe(said([taxes], 'reader'));
    // the owner reads the record whole: the criminal row ranks first, the market taxes second
    expect(said([crime, taxes, harvest], 'owner')).toMatch(LESSER);
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

  it('THE GUARD (CTR11): every clause that ranks, counts or chooses reads only rows a reader can be served — a planted hideable row that would outrank the served one leaves the reader\'s text byte-identical with it or without it', () => {
    const base = town();
    const ps = base.powerStructure;
    const crimeHouse = (name) => ({ name, category: 'Criminal', priorityCategory: 'criminal' });
    const cases = [
      // the economy's rank and its 'only' count (the criminal income row, withheld whole by the gallery veil)
      ['economy.rank', rite(2, 'market', 'fair'), { economicState: { incomeSources: [{ source: 'Smuggling', percentage: 40, isCriminal: true }, ...base.economicState.incomeSources] } }],
      ['economy.only', rite(2, 'market', 'fair'), { economicState: { incomeSources: [{ source: 'Smuggling', percentage: 60, isCriminal: true }, { source: 'Market Taxes', percentage: 40 }] } }],
      // the keeper house: a hideable house earlier in the table's order than the served one
      ['house.order', rite(2, 'market', 'fair'), { institutions: [crimeHouse('Weekly market'), { name: 'Market square', category: 'Economy' }] }],
      // the keeper power: a veiled power of the archetype, stronger than the served one
      ['power.strongest', rite(2, 'hunt', 'fair'), { institutions: [], powerStructure: { factions: [{ faction: 'The Quiet Exchange', category: 'economy', hidden: true, power: 99 }, ...ps.factions] } }],
      // the seat: a veiled power marked governing ahead of the served seat
      ['power.seat', rite(0, 'founding', 'feast'), { powerStructure: { factions: [{ faction: 'The Hand Unseen', category: 'other', hidden: true, isGoverning: true, power: 40 }, ...ps.factions] } }],
      // the line's admission (facts/drawDeclared.js): the only market is a hideable house
      ['facts.market', rite(2, 'market', 'fair'), { institutions: [crimeHouse('Weekly market')] }],
      // the owner in play: a veiled owner and no owner at all
      ['owner.veiled', rite(1, 'harvest', 'feast', { ownerKey: 'k', ownerKind: 'faction', ownerLabel: "Thieves' Guild" }), {}],
    ];
    /** the same town with every row of the withheld classes removed (criminal income, hideable house, veiled power) */
    const served = (t) => ({
      ...t,
      institutions: t.institutions.filter((i) => i.category !== 'Criminal'),
      powerStructure: { ...t.powerStructure, factions: t.powerStructure.factions.filter((f) => !f.hidden && f.category !== 'criminal') },
      economicState: { ...t.economicState, incomeSources: t.economicState.incomeSources.filter((r) => !r.isCriminal) },
    });
    const moved = [];
    for (const [name, rec, over] of cases) {
      const withRow = town({ ...over, npcs: [] });
      const a = describeTradition(rec, withRow, { audience: 'reader' }).text;
      const b = describeTradition(rec, served(withRow), { audience: 'reader' }).text;
      if (a !== b) moved.push(`${name}: ${a} | ${b}`);
    }
    expect(moved).toEqual([]);
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

const TABLE_PATH = '../../src/data/traditionDescriptionTable.js';
const LEAF_PATH = '../../src/domain/traditions/traditionDescription.js';
/**
 * The leaf re-imported over a table with `over` laid on it (a PLANTED table: the real one is frozen and never edited).
 * @param {(t: Record<string, unknown>) => Record<string, unknown>} over
 */
async function leafOver(over) {
  vi.resetModules();
  vi.doMock(TABLE_PATH, async (importOriginal) => {
    const t = /** @type {Record<string, unknown>} */ (await importOriginal());
    return { ...t, ...over(t) };
  });
  try {
    return (await import(LEAF_PATH)).describeTradition;
  } finally {
    vi.doUnmock(TABLE_PATH);
  }
}

describe('describeTradition — the kinds\' totality, fail-closed (TRAD-4 unit 5 item 4; the chair 13:32)', () => {
  /** a town whose record holds ONE graded event, of a kind planted into DEAD_EVENT_TYPES (a real history template type) */
  const risen = () => town({ history: { ...town().history, historicalEvents: [
    { name: 'The Rising of the Commons', templateType: 'popular_uprising', severity: 'major', yearsAgo: 30 },
  ] } });

  it('a rite of the dead whose only eligible event is of a type with NO phrase prints no cause clause for the reader (never "undefined", never the event\'s name); the owner\'s page keeps it', async () => {
    const planted = await leafOver((t) => ({ DEAD_EVENT_TYPES: Object.freeze([.../** @type {string[]} */ (t.DEAD_EVENT_TYPES), 'popular_uprising']) }));
    try {
      const rec = rite(1, 'the-dead', 'offering');
      const owner = planted(rec, risen(), { audience: 'owner' });
      // anchored: the planted kind IS eligible: the owner's page keeps the rite in memory of the event, by its name
      expect(owner.text).toMatch(/in memory of the Rising of the Commons(?: since then)?, 30 years ago/);
      expect(owner.parts.origin).toBe('cause');
      const reader = planted(rec, risen(), { audience: 'reader' });
      expect(reader.parts.origin).not.toBe('cause');
      expect(reader.named.events).toEqual([]);
      // anchored: the owner's text above, from this same planted table and town, names the event and its years
      expect(reader.text).not.toMatch(/in memory of|undefined|null|Rising|Commons|years ago/);
      // and the reader's clause stands as soon as the kind has its phrase (the omission is the missing phrase's alone)
      const phrased = await leafOver((t) => ({
        DEAD_EVENT_TYPES: Object.freeze([.../** @type {string[]} */ (t.DEAD_EVENT_TYPES), 'popular_uprising']),
        DEAD_EVENT_PHRASES: Object.freeze({ .../** @type {Record<string, string>} */ (t.DEAD_EVENT_PHRASES), popular_uprising: 'the rising' }),
      }));
      expect(phrased(rec, risen(), { audience: 'reader' }).text).toMatch(/in memory of the rising(?: since then)?, 30 years ago/);
    } finally {
      vi.resetModules();
    }
  });
});

describe('describeTradition — the text never says what became of the rite this year (TRAD-4 unit 5 item 3)', () => {
  it('the record\'s lastOutcome and lastHeldYear move no byte of the description, owner or reader', () => {
    const moved = [];
    let compared = 0;
    for (const [i, el, act] of [[0, 'founding', 'feast'], [1, 'harvest', 'feast'], [2, 'market', 'fair'], [3, 'the-dead', 'vigil'], [4, 'forge', 'contest']]) {
      for (const audience of ['owner', 'reader']) {
        const base = describeTradition(rite(i, el, act), town(), { audience }).text;
        for (const lastOutcome of ['triumph', 'good', 'modest', 'troubled', 'failure', 'cancelled']) {
          const d = describeTradition(rite(i, el, act, { lastOutcome, lastHeldYear: 119 }), town(), { audience }).text;
          compared += 1;
          if (d !== base) moved.push(`${el}/${act} ${audience} ${lastOutcome}: ${d}`);
        }
      }
    }
    expect(compared).toBe(60);
    expect(moved).toEqual([]);
  });
});

describe('describeTradition — THE CRISIS DIMENSION on born towns (TRAD-4 unit 5 item 3)', () => {
  const CRISES = ['famine', 'under_siege', 'occupied', 'wartime', 'plague_onset'];
  const SEEDS = ['village', 'town', 'city'].flatMap((settType) => [0, 1, 2].map((i) => ({ settType, seed: `trad4-u5-${settType}-${i}` })));
  const births = new Map();
  /** @param {string} settType @param {string} seed @param {string[]} selectedStresses (each birth once) */
  const born = (settType, seed, selectedStresses) => {
    const key = `${seed}|${selectedStresses.join()}`;
    if (!births.has(key)) {
      births.set(key, generateSettlementPipeline({
        settType, culture: 'germanic', terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized',
        selectedStressesRandom: false, selectedStresses,
      }, null, { seed, customContent: {} }));
    }
    return births.get(key);
  };
  const SCOPED = [...CRISIS_SCOPED_ACTS.map((a) => ['lead', ACT_LEADS[a]]), ...CRISIS_SCOPED_ELEMENTS.map((e) => ['gloss', ELEMENT_GLOSS[e]])];
  /** The lines of the crisis-scoped pools this record refuses (the vocabulary's one rule, `declarationAdmits`). */
  const excludedIn = (t) => {
    const f = factsOf(t);
    /** @type {{ lead: Set<string>, gloss: Set<string> }} */
    const out = { lead: new Set(), gloss: new Set() };
    for (const [k, pool] of SCOPED) for (const l of pool) if (!declarationAdmits(declarationOf(l), f, { crisisScoped: true }).admitted) out[k].add(l.text);
    return out;
  };
  /** S1's lead and gloss (no lead or gloss holds a full stop or " that "). */
  const s1Of = (text) => {
    const s = text.slice(0, text.indexOf('.'));
    const i = s.indexOf(' that ');
    return i < 0 ? { lead: s, gloss: null } : { lead: s.slice(0, i), gloss: s.slice(i + ' that '.length) };
  };
  /** Every S1 line a town's descriptions read, owner and reader, from the crisis-scoped pools. */
  const readOf = (t) => {
    const out = [];
    for (const rec of deriveFoundingTraditions(t)) {
      const { act, element } = rec.coreMotif;
      for (const audience of ['owner', 'reader']) {
        const d = describeTradition(rec, t, { audience });
        if (!d) continue;
        const { lead, gloss } = s1Of(d.text);
        if (CRISIS_SCOPED_ACTS.includes(act)) out.push({ k: 'lead', text: lead, audience });
        if (CRISIS_SCOPED_ELEMENTS.includes(element) && gloss) out.push({ k: 'gloss', text: gloss, audience });
      }
    }
    return out;
  };
  const feastLeads = ACT_LEADS.feast.filter((l) => !l.twinOf).map((l) => l.text);
  const fairExcluded = ACT_LEADS.fair.filter((l) => (l.excludes || []).includes('crisis: threat')).map((l) => l.text);

  it('born under famine, under_siege, occupied, wartime and plague_onset: no excluded line is read, owner or reader (and the crisis is the record\'s own)', () => {
    const hits = [];
    const unpinned = [];
    /** @type {Record<string, number>} */
    const scopedReads = {};
    // seed-loop: collected — every crisis and seed runs; its misses go to `unpinned` and `hits`, each asserted whole after the loop
    for (const crisis of CRISES) for (const { settType, seed } of SEEDS) {
      scopedReads[crisis] ??= 0;
      const t = born(settType, seed, [crisis]);
      if (!factsOf(t).crisis.has(crisis)) unpinned.push(`${seed}: ${crisis} is not on the record`);
      const ex = excludedIn(t);
      // the vocabulary's families, pinned: hunger takes every feast lead (famine, siege); threat the two fair lines (siege, occupation)
      if (crisis === 'famine' || crisis === 'under_siege') for (const l of feastLeads) if (!ex.lead.has(l)) unpinned.push(`${seed}: ${l}`);
      if (crisis === 'under_siege' || crisis === 'occupied') for (const l of fairExcluded) if (!ex.lead.has(l)) unpinned.push(`${seed}: ${l}`);
      for (const r of readOf(t)) {
        scopedReads[crisis] += 1;
        if (ex[r.k].has(r.text)) hits.push(`${t.name} (${seed} under ${crisis}, ${r.audience}): ${r.k} "${r.text}"`);
      }
    }
    expect(unpinned).toEqual([]);
    expect(CRISES.filter((c) => !(scopedReads[c] > 0))).toEqual([]);
    expect(hits).toEqual([]);
  }, 300000);

  it('NON-VACUITY: the same seeds born calm read the lines a crisis excludes (at least one, owner and reader)', () => {
    const union = { lead: new Set(), gloss: new Set() };
    for (const crisis of CRISES) for (const { settType, seed } of SEEDS) {
      const ex = excludedIn(born(settType, seed, [crisis]));
      for (const k of /** @type {const} */ (['lead', 'gloss'])) for (const x of ex[k]) union[k].add(x);
    }
    const read = { owner: 0, reader: 0 };
    for (const { settType, seed } of SEEDS) for (const r of readOf(born(settType, seed, []))) if (union[r.k].has(r.text)) read[r.audience] += 1;
    expect(read.owner).toBeGreaterThan(0);
    expect(read.reader).toBeGreaterThan(0);
  }, 120000);
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

  it('THE DRAW KEY carries the settlement\'s identity (String(_seed ?? id), the desks\' convention): the same rite id in two towns may read differently, and one town reads the same before a save, after it and after a reload', () => {
    const rec = rite(1, 'the-dead', 'vigil');
    const texts = new Set();
    for (let i = 0; i < 12; i += 1) texts.add(describeTradition(rec, town({ _seed: `ashford-${i}` }), { audience: 'owner' }).text);
    // a constant key (the record's id alone) gives every town the same frames: one text for twelve seeds
    expect(texts.size).toBeGreaterThan(1);
    const unsaved = town({ _seed: 'ashford-7' });
    const saved = { ...unsaved, id: 'b1f0c2d4-save-row' }; // a save stamps an id; the seed stands first, so nothing moves
    const reloaded = JSON.parse(JSON.stringify(saved));
    for (const audience of ['owner', 'reader']) {
      const before = describeTradition(rec, unsaved, { audience }).text;
      expect(describeTradition(rec, saved, { audience }).text, audience).toBe(before);
      expect(describeTradition(rec, reloaded, { audience }).text, audience).toBe(before);
    }
    // a record with no seed keys on its id (the same fallback every desk reads)
    const byId = new Set();
    for (let i = 0; i < 12; i += 1) byId.add(describeTradition(rec, town({ id: `row-${i}` }), { audience: 'owner' }).text);
    expect(byId.size).toBeGreaterThan(1);
  });

  it('THE LEAF\'S PICK IS THE RENDEZVOUS PICK (TRAD-4 unit 11 addendum; point 121, kernel/proseHash.js :: pickRendezvous): a calm feast rite alone reads, over 24 town seeds, the lead pickRendezvous takes on the leaf\'s key and each line\'s id', () => {
    const rec = rite(2, 'long-sun', 'feast');
    const domain = ACT_LEADS.feast.filter((l) => !l.twinOf);
    const off = [];
    const leads = new Set();
    for (let i = 0; i < 24; i += 1) {
      const seed = `mixed-${i}`;
      const lead = s1OfText(describeTradition(rec, town({ _seed: seed }), { audience: 'owner' }).text);
      leads.add(lead);
      const want = pickRendezvous(domain, `${seed}::${rec.id}#done`, (l) => l.id)?.text;
      if (lead !== want) off.push(`${seed}: read "${lead}", the rendezvous pick "${want}"`);
    }
    expect(leads.size).toBeGreaterThan(1); // not vacuous: the seeds reach more than one lead
    expect(off).toEqual([]);
  });

  it('total on garbage: no record, no town, an unknown motif', () => {
    expect(describeTradition(null, town(), { audience: 'owner' })).toBeNull();
    expect(describeTradition(rite(1, 'harvest', 'feast'), null, { audience: 'owner' })).toBeNull();
    expect(describeTradition(rite(1, 'nonsense', 'feast'), town(), { audience: 'owner' })).toBeNull();
    expect(() => describeTradition(rite(1, 'harvest', 'feast'), { name: 'X', institutions: 'no', npcs: 7, history: null }, { audience: 'owner' })).not.toThrow();
  });
});

describe('the reader\'s dead-cause word rule (TRAD-4 unit 7, the chair\'s ruling of 13:59 UTC): an event shares NO WORD with any held name', () => {
  it('THE STOP LIST is closed and pinned: the, a, an, of, and, in, on, at, by, for, to', () => {
    expect(HELD_NAME_STOP_WORDS).toEqual(['the', 'a', 'an', 'of', 'and', 'in', 'on', 'at', 'by', 'for', 'to']);
    expect(Object.isFrozen(HELD_NAME_STOP_WORDS)).toBe(true);
    // a held name of stop words alone holds no word: nothing is caught by it
    expect(holdsAName('The Siege of the Town', ['The Of And'])).toBe(false);
  });

  it('CASE: both sides are case-folded', () => {
    expect(holdsAName('THE ROOKERY FIRE', ['rookery'])).toBe(true);
    expect(holdsAName('the rookery fire', ['ROOKERY'])).toBe(true);
    expect(holdsAName('The Strasse Fire', ['Straße'])).toBe(true);
  });

  it('THE QUALIFIER: a held name\'s bracketed qualifier is part of the name (its words are in too); its stop words are not', () => {
    expect(holdsAName('The Rookery Fire', ['Rookery (word of mouth)'])).toBe(true);
    expect(holdsAName('The Mouth of the River', ['Rookery (word of mouth)'])).toBe(true);
    // anchored: the two lines above catch by this same held name; "of" is its one stop word and the event shares no other
    expect(holdsAName('The Fire of Years', ['Rookery (word of mouth)'])).toBe(false);
  });

  it('THE PREFIX: an event word that BEGINS WITH a held word counts as that word (a plural, a possessive); not the other way', () => {
    expect(holdsAName("The Fences' Fire", ['Fence'])).toBe(true);
    expect(holdsAName("Fence's Burning", ['Fence'])).toBe(true);
    // anchored: the held word "fences" is longer than the event's "fence": the event word does not begin with it
    expect(holdsAName('The Fence Fire', ['Fences'])).toBe(false);
  });

  it('ANY LENGTH; letter runs only: digits and punctuation are separators', () => {
    expect(holdsAName('The Inn Fire', ['Inn'])).toBe(true);
    expect(holdsAName('The Oxbow Flood', ['Ox (old)'])).toBe(true);
    expect(holdsAName('The 7Gates Siege', ['Gate7'])).toBe(true);
    expect(holdsAName("The Guild Fire", ["Thieves' guild"])).toBe(true);
  });

  it('CONTROL: an event that shares no word with any held name is not caught (the rule is not "never")', () => {
    expect(holdsAName('The Granary Fire', ['Rookery (word of mouth)', 'Town Council', 'Edda Vogt'])).toBe(false);
    expect(holdsAName('The Great Fire', [])).toBe(false);
  });

  it('THE LEAF: a reader\'s rite of the dead skips the event named by a hideable house\'s bare form and keeps the older one; the owner names the event', () => {
    const t = town({
      institutions: [...town().institutions, { name: 'Rookery (word of mouth)', category: 'Criminal', priorityCategory: 'criminal' }],
      history: { ...town().history, historicalEvents: [...town().history.historicalEvents,
        { name: 'The Rookery Fire', templateType: 'great_fire', severity: 'major', yearsAgo: 2 }] },
    });
    expect(describeTradition(rite(1, 'the-dead', 'vigil'), t, { audience: 'owner' }).text).toMatch(/the Rookery Fire(?: since then)?, 2 years ago/);
    const reader = describeTradition(rite(1, 'the-dead', 'vigil'), t, { audience: 'reader' }).text;
    expect(reader).toMatch(/in memory of the siege(?: since then)?, 40 years ago/);
    // anchored: the line above asserts the reader's cause stands, on the older siege
    expect(reader).not.toMatch(/great fire|2 years ago/);
  });
});

describe('the word rule RE-STATED (ADDENDUM 1, the chair, 15:10 UTC): a word is a run of letters and apostrophes; the whole name stays as a floor', () => {
  it('A POSSESSIVE HELD NAME against the bare event: "Cobbler\'s guild" / "The Cobbler Riots" is caught', () => {
    expect(holdsAName('The Cobbler Riots', ["Cobbler's guild"])).toBe(true);
  });

  it('THE REVERSE: "Cobbler" / "The Cobbler\'s Fall" is caught (the event word "cobblers" begins with the held "cobbler")', () => {
    expect(holdsAName("The Cobbler's Fall", ['Cobbler'])).toBe(true);
  });

  it('A PLURAL POSSESSIVE: "Smiths\' Hall" / "Smith\'s Fire" is caught (held "smiths", event "smiths")', () => {
    expect(holdsAName("Smith's Fire", ["Smiths' Hall"])).toBe(true);
  });

  it('A CURLY APOSTROPHE (U+2019) and the modifier apostrophe (U+02BC) read as the apostrophe', () => {
    expect(holdsAName('Smith’s Fire', ['Smiths’ Hall'])).toBe(true);
    expect(holdsAName('Smithʼs Fire', ['Smithsʼ Hall'])).toBe(true);
    expect(holdsAName("Smith's Fire", ['Smiths’ Hall'])).toBe(true);
  });

  it('AN INNER APOSTROPHE is deleted: "O\'Brien\'s Mill" / "The OBriens Flood" and "D\'Arcy Hall" / "The Darcy Fire" are caught', () => {
    expect(holdsAName('The OBriens Flood', ["O'Brien's Mill"])).toBe(true);
    expect(holdsAName('The Darcy Fire', ["D'Arcy Hall"])).toBe(true);
  });

  it('THE WHOLE-NAME FLOOR (full and bare form): a held name made only of stop words is still caught', () => {
    expect(holdsAName('The At Fire', ['At'])).toBe(true);
    expect(holdsAName('The By and By Siege', ['By and By (old)'])).toBe(true);
  });

  it('CONTROL THAT MUST KEEP ITS CAUSE: a held possessive against an event that only begins with s ("People\'s Council" / "The Siege")', () => {
    expect(holdsAName('The Siege', ["People's Council", "Cobbler's guild", "Tailor's guild"])).toBe(false);
    const t = town({ powerStructure: { factions: [...town().powerStructure.factions, { faction: "People's Council", category: 'government', power: 5 }] } });
    expect(describeTradition(rite(1, 'the-dead', 'vigil'), t, { audience: 'reader' }).text).toMatch(/in memory of the siege(?: since then)?, 40 years ago/);
  });
});

describe('ONE TOWN, NO SENTENCE TWICE (TRAD-4 unit 10; the chair, reading the owner\'s thirty): a slot\'s wording by rotation inside one town', () => {
  /** Every sentence a set of descriptions prints twice or more, with its count (the town's name left in). */
  const twice = (texts) => {
    /** @type {Map<string, number>} */
    const seen = new Map();
    for (const text of texts) for (const s of String(text || '').split(/(?<=\.) (?=\p{Lu})/u).filter(Boolean)) seen.set(s, (seen.get(s) || 0) + 1);
    return [...seen].filter(([, n]) => n >= 2).map(([s, n]) => `${n}x ${s}`);
  };
  const bornAt = (settType, culture, seed) => generateSettlementPipeline(
    { settType, culture, terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' }, null, { seed, customContent: {} },
  );
  // the owner's samples 17/19 and 23/25 (the 432 pool's seeds: tools/trad-pool.mjs)
  const SAMPLES = [['Ringthwaite', 'city', 'celtic', 'trad-e-city-celtic'], ['Bergbrekka', 'town', 'norse', 'trad-a-town-norse']];

  it('RINGTHWAITE and BERGBREKKA, the owner\'s page (the tab\'s set) and the reader\'s drawn rows: no sentence printed in two rites', () => {
    const found = [];
    // seed-loop: collected — every sample's every check pushes into `found`, asserted once after the loop
    for (const [name, settType, culture, seed] of SAMPLES) {
      const t = bornAt(settType, culture, seed);
      if (t.name !== name) found.push(`${seed}: born ${t.name}, not ${name}`);
      const recs = shownTraditionsOf(t, []).recs;
      if (recs.length < 2) found.push(`${name}: ${recs.length} rite(s), not vacuous only with two or more`);
      const owner = recs.map((rec) => describeTradition(rec, t, { audience: 'owner', set: recs })?.text ?? '');
      const reader = (sharedTraditionRowsOf(t) || []).map((r) => r.text);
      for (const s of twice(owner)) found.push(`${name} owner: ${s}`);
      for (const s of twice(reader)) found.push(`${name} reader: ${s}`);
    }
    expect(found).toEqual([]);
  });

  it('THE PAYER RUNS OUT: four rites that pay alike take the three wordings in order and the fourth leaves the payer sentence out; each rite alone reads as today', () => {
    // no house, no power: every rite's second sentence is its payer (Market Taxes, the chief income)
    const t = town({ institutions: [], npcs: [], powerStructure: { factions: [] } });
    const recs = [1, 2, 3, 4].map((i) => rite(i, 'market', 'fair'));
    const alone = recs.map((rec) => describeTradition(rec, t, { audience: 'owner' }));
    // not vacuous: alone, all four print a payer sentence, and four rites cannot print three wordings without a repeat
    for (const d of alone) expect(d.parts.origin).toBe('economy');
    const inSet = recs.map((rec) => describeTradition(rec, t, { audience: 'owner', set: recs }));
    expect(inSet[0].text).toBe(alone[0].text);
    expect(inSet.slice(0, 3).map((d) => d.parts.origin)).toEqual(['economy', 'economy', 'economy']);
    expect(new Set(inSet.slice(0, 3).map((d) => sentences(d.text).at(-1))).size).toBe(3);
    expect(inSet[3].parts.origin).toBeNull();
    // the payer sentences (the slot this arm rotates): S1 is no rotated slot, and four rites of one motif may share a lead
    // (TRAD-4 unit 11's mixed pick: these four keys take leads 1, 3, 0, 1; FNV's low bits had made them a permutation)
    expect(twice(inSet.map((d) => (d.parts.origin === 'economy' ? sentences(d.text).at(-1) : '')))).toEqual([]);
  });

  it('A KEEPER SLOT THAT RUNS OUT (the chair, 17:55 UTC; Zhongmen\'s shape: one market, one power): the first three rites take the three frames, the fourth and fifth the two "too" wordings (KEEPER_FRAMES_TOO, the presider\'s clause dropped), and only the sixth leaves the keeper sentence out; the fourth payer is left out', () => {
    const t = town({ institutions: [{ name: 'Weekly market', category: 'Economy' }], npcs: [], powerStructure: { factions: [{ faction: 'Merchant Guilds', category: 'economy', power: 18 }] } });
    const recs = [1, 2, 3, 4, 5, 6].map((i) => rite(i, 'market', 'fair'));
    const keeperOf = (d) => (d.parts.keeper ? sentences(d.text)[1] : null);
    const alone = recs.map((rec) => describeTradition(rec, t, { audience: 'owner' }));
    for (const d of alone) expect(d.parts.keeper).toBe('house'); // not vacuous: each alone is kept at the market, by the power
    const inSet = recs.map((rec) => describeTradition(rec, t, { audience: 'owner', set: recs }));
    expect(inSet[0].text).toBe(alone[0].text);
    const too = (KEEPER_FRAMES_TOO.placePower || []).map((l) => l.text.replace('{house}', 'the weekly market').replace('{power}', 'the Merchant Guilds'));
    expect(too).toHaveLength(2);
    expect(new Set(inSet.slice(0, 3).map(keeperOf)).size).toBe(3);
    // anchored: `too` is asserted two lines long above, and the next line asserts rites four and five print exactly it
    for (const d of inSet.slice(0, 3)) expect(too).not.toContain(keeperOf(d));
    expect(inSet.slice(3, 5).map(keeperOf)).toEqual(too);
    expect(inSet[5].parts.keeper).toBeNull();
    expect(inSet[5].named.houses).toEqual([]);
    expect(inSet[5].named.powers).toEqual([]);
    expect(inSet[3].parts.origin).toBeNull();
  });

  it('A "TOO" WORDING DROPS THE PRESIDER: a fourth rite kept by a house with a presiding person names the house, not the person (the earlier rite said it)', () => {
    const t = town({ institutions: [{ name: 'Parish church', category: 'Religious' }], powerStructure: { factions: [] } });
    const recs = [1, 2, 3, 4].map((i) => rite(i, 'the-dead', 'offering'));
    const inSet = recs.map((rec) => describeTradition(rec, t, { audience: 'owner', set: recs }));
    for (const d of inSet.slice(0, 3)) expect(d.text).toContain('Edda Vogt'); // not vacuous: the frames name the priest
    expect(inSet[3].parts.keeper).toBe('house');
    // anchored: the first three rites' texts are asserted to contain 'Edda Vogt' above, and this rite's keeper is asserted standing
    expect(inSet[3].text).not.toContain('Edda Vogt');
    expect(inSet[3].named.persons).toEqual([]);
    expect(inSet[3].named.houses).toEqual(['Parish church']);
  });

  it('A RITE ALONE, OR NOT IN THE SET, READS EXACTLY AS WITHOUT ONE; the set is found by the same id when the objects differ', () => {
    const t = town();
    const recs = [rite(1, 'market', 'fair'), rite(2, 'harvest', 'feast'), rite(3, 'market', 'contest')];
    for (const audience of ['owner', 'reader']) {
      for (const rec of recs) expect(describeTradition(rec, t, { audience, set: [rec] })).toEqual(describeTradition(rec, t, { audience }));
      expect(describeTradition(rite(9, 'market', 'fair'), t, { audience, set: recs })).toEqual(describeTradition(rite(9, 'market', 'fair'), t, { audience }));
      const copies = recs.map((r) => ({ ...r }));
      recs.forEach((rec, i) => expect(describeTradition(copies[i], t, { audience, set: recs })).toEqual(describeTradition(rec, t, { audience, set: recs })));
    }
  });

  // the eight towns of the 432 pool whose keeper slot ran out at the rotation's first cut (four rites, one keeper, three frames)
  const EIGHT = [['Ravenvich', 'city', 'slavic', 'trad-f-city-slavic'], ['Pianoripa', 'metropolis', 'latin', 'trad-c-metropolis-latin'],
    ['Castelcolonia', 'metropolis', 'latin', 'trad-f-metropolis-latin'], ['Ardthwaite', 'metropolis', 'celtic', 'trad-b-metropolis-celtic'],
    ['Jabalabad', 'metropolis', 'arabic', 'trad-a-metropolis-arabic'], ['Zhongmen', 'metropolis', 'east_asian', 'trad-c-metropolis-east_asian'],
    ['Bhagapuram', 'metropolis', 'south_asian', 'trad-d-metropolis-south_asian'], ['Collevetum', 'metropolis', 'mediterranean', 'trad-c-metropolis-mediterranean']];
  const eightBorn = new Map();
  const bornEight = ([, settType, culture, seed]) => { if (!eightBorn.has(seed)) eightBorn.set(seed, bornAt(settType, culture, seed)); return eightBorn.get(seed); };

  it('THE EIGHT TOWNS whose keeper ran out (the chair, 17:55 UTC): the owner\'s page and the reader\'s drawn rows print no sentence twice', () => {
    const found = [];
    // seed-loop: collected — every town's every check pushes into `found`, asserted once after the loop
    for (const sample of EIGHT) {
      const t = bornEight(sample);
      if (t.name !== sample[0]) found.push(`${sample[3]}: born ${t.name}, not ${sample[0]}`);
      const recs = shownTraditionsOf(t, []).recs;
      for (const s of twice(recs.map((rec) => describeTradition(rec, t, { audience: 'owner', set: recs })?.text ?? ''))) found.push(`${t.name} owner: ${s}`);
      for (const s of twice((sharedTraditionRowsOf(t) || []).map((r) => r.text))) found.push(`${t.name} reader: ${s}`);
    }
    expect(found).toEqual([]);
  }, 120000);

  it('THE "TOO" WORDINGS ARE NEVER A PICK (TRAD-4\'s law): over the eight towns, no rite described alone, and no rite first in its set to name its keeper, prints one; and the eight do print one', () => {
    const tooRe = Object.values(KEEPER_FRAMES_TOO).flat().map((l) => new RegExp(`^${l.text.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{\w+\}/g, '.+?')}$`));
    const isToo = (s) => tooRe.some((re) => re.test(s));
    const found = [];
    let printed = 0;
    // seed-loop: collected — every town's every check pushes into `found`, asserted once after the loop
    for (const sample of EIGHT) {
      const t = bornEight(sample);
      for (const audience of ['owner', 'reader']) {
        const set = descriptionSetOf(t, audience, []);
        const seen = new Set();
        for (const rec of set) {
          const alone = describeTradition(rec, t, { audience });
          const d = describeTradition(rec, t, { audience, set });
          if (alone && sentences(alone.text).some(isToo)) found.push(`${t.name} ${audience} alone: ${rec.name}`);
          if (!d) continue;
          const keeper = JSON.stringify([d.parts.keeper, d.named.houses, d.named.powers]);
          const tooHere = sentences(d.text).some(isToo);
          if (tooHere) printed += 1;
          if (tooHere && !seen.has(keeper)) found.push(`${t.name} ${audience} first of its keeper: ${rec.name}`);
          seen.add(keeper);
        }
      }
    }
    expect(found).toEqual([]);
    expect(printed).toBeGreaterThan(0);
  }, 120000);
});
