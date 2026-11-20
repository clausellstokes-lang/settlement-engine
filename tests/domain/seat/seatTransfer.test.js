/**
 * tests/domain/seat/seatTransfer.test.js — U5 (CS7, dark): THE TRANSFER UNDER THE SEAT LAW (SEAT-1 train 1; brief
 * docs/chair/2026-11-20/content/seat/briefs/U5-TRANSFER.md, the chair's two conditions and SEAT-5's addition).
 *
 * Under the seat law (`seat/seatLaw.js :: seatsByHolder`), `rulingPower.js :: transferRulingPower`:
 *   - makes the winner the HOLDER (`seat/holderOfSeat.js :: holderOf` reads it by R1, and reads exactly ONE taker);
 *   - KEEPS the form where the table lets the winner's kind hold it (`seatTable.js :: pairLicense`: `own`, `civic`, or
 *     `licensed` with the licence's circumstance HANDED IN through `opts.seatCircumstances`), else writes the winner's
 *     own form (today's path);
 *   - RETIRES every "power behind" edge of another power on the seat to a competitive edge naming both powers.
 *
 * The arms, in the brief's order (every fixture hand-built, each run with `_seatLawVersion: 2` and without it):
 *   (1) a City Council (civic) taken by Merchant Guilds by coup: KEPT; R1 names Merchant Guilds; without the law,
 *       today's rename (and a town-size Town Council the same);
 *   (2) `none` and `fallback`: a Ducal Governorship taken by a military power, a Town Council taken by a temple: the
 *       winner's own form, byte for byte today's output under both laws;
 *   (3) a Royal Authority city taken by Merchant Guilds: WITH trade wealth held (handed in, as a value or a thunk of
 *       `seatCircumstances.js :: seatCircumstancesOf`) KEPT; WITHOUT it, or with nothing handed (fail closed), the
 *       merchants' own form; and the chair's condition 1 measured: the person `holderOf` names on the kept crown;
 *   (4) three transfers returning the seat to a form it held before (the case U3's report names), and three on a kept
 *       form: after each, exactly ONE edge answers R1 and it names the last taker; the earlier takers' edges read
 *       competitive, naming both powers; under the old law the two-taker shape stands as today;
 *   (5) a demotion (election, Register VII) with a kept form: no two rows share a name; the former holder stands as its
 *       own row; the renamed path's demotion keeps working as today;
 *   (6) a town-size case through the real transfer: the person `holderOf` names, and every card, unmoved by this unit;
 *   (7) the old law byte-identical for every cause: against expectations RECORDED from the pre-change module (base
 *       `6e697f5db`) before the code was written; the law rows differ where the law acts (the negative control);
 *   (8) the chair's condition 2: with the form kept, `recentConflict`, the "power behind" edge and the `ascendant`
 *       marker each name the taker, no line reads "reshaped", and both new lines are in `TRANSFER_WORDINGS`;
 *       the retired edge is never read as a transfer (R1's matcher and `unattributedTransferOn`'s read both refuse it);
 *   (9) CS22 (d), the GUARD (the chair's condition 1): on arm (3)'s transferred town no card carries a crown word
 *       (`cultureOfficeTitles.js :: officeWordInfo(word).crown`) together with a house it keeps (rank 1) other than the
 *       seat's own, and the person `holderOf` names keeps none; the predicate reds on a planted keeper-king;
 *  (10) the chair's cure (1), its class word disambiguated by U5-CURE (the chair 17:32Z): `'retiredEdge'`;
 *  (11) U5-CURE (b): a Royal Authority city, trade wealth held, taken by Merchant Guilds through each WIRED caller's real
 *       path (the roster's `government_change`; and, from U5-CURE2, the world pulse's power-transfer outcome in
 *       `applyWorldPulse.js`, room made without a rise) keeps the form; the path NOT wired falls closed, pinned with its
 *       stop: the DM's `CHANGE_RULING_POWER` (`mutateWorld.js :: changeRulingPower`: first paint);
 *  (12) U5-CURE (b): the law dark, the three paths byte-identical at play time (digests RECORDED at 9a05215bc before any
 *       caller was edited), with the negative control that the law-on digest differs.
 */
import { createHash } from 'node:crypto';
import { describe, test, expect } from 'vitest';
import { transferRulingPower, RULING_POWER_CAUSES, DEPOSED_MODIFIER } from '../../../src/domain/rulingPower.js';
import { holderOf, isCrownedForm, TRANSFER_WORDINGS, transferSentenceSays, transferTakerOf } from '../../../src/domain/seat/holderOfSeat.js';
import { seatCircumstancesOf } from '../../../src/domain/seat/seatCircumstances.js';
import { officeWordInfo } from '../../../src/data/cultureOfficeTitles.js';
import { applyWorldPulseOutcomes } from '../../../src/domain/worldPulse/applyWorldPulse.js';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';

// ── fixtures ───────────────────────────────────────────────────────────────────────────────────────────────

const LAW = Object.freeze({ _seatLawVersion: 2 });
const REGISTER_VII = Object.freeze({ _densityLawVersion: 2 });
const OWNER = { audience: 'owner' };

/** A card the served document keeps whole. */
const card = (id, name, role, memberships) => ({
  id, name, role, title: role,
  institution: { kind: 'power', key: memberships[0]?.power || '', family: null, title: role, veiled: false },
  memberships: memberships.map((m) => ({ share: 0, veiled: false, ...m })),
});

/** A trade-wealth economy (`seatCircumstances.js`'s read: Prosperous or Wealthy, a trade source the largest income). */
const WEALTHY = Object.freeze({ prosperity: 'Wealthy', incomeSources: [{ source: 'Market Taxes', percentage: 45 }, { source: 'Guild Fees', percentage: 20 }] });
const MODEST = Object.freeze({ prosperity: 'Modest', incomeSources: [{ source: 'Farming Tithes', percentage: 45 }, { source: 'Market Taxes', percentage: 20 }] });

/** A place whose seat is `government`, with four open powers, a criminal one and two edges on the seat. */
const place = ({ tier = 'city', government = 'City Council', category = 'government', config = {}, extra = [], relationships = [],
  npcs = [], economicState = null, previousGovernments = null } = {}) => ({
  name: 'Harrowgate',
  tier,
  config: { ...config },
  ...(economicState ? { economicState: structuredClone(economicState) } : {}),
  powerStructure: {
    government,
    governingName: government,
    factions: [
      { faction: government, category, power: 30, isGoverning: true, modifiers: [] },
      { faction: 'Merchant Guilds', category: 'economy', power: 28, modifiers: [] },
      { faction: 'Noble Houses', category: 'noble', power: 22, modifiers: [] },
      { faction: 'The Garrison', category: 'military', power: 24, modifiers: [] },
      { faction: 'Temple of the Dawn', category: 'religious', power: 16, modifiers: [] },
      { faction: 'The Shadow Hand', category: 'criminal', power: 18, modifiers: [] },
      ...extra,
    ],
    factionRelationships: [
      { pair: [government, 'The Garrison'], type: 'symbiotic', direction: 'stable', narrative: `The ${government} gives the orders and The Garrison carries them out.` },
      { pair: [government, 'Merchant Guilds'], type: 'competitive', direction: 'stable', narrative: 'They haggle over the market dues.' },
      ...relationships,
    ],
    publicLegitimacy: { score: 40, label: 'Contested', govMultiplier: 0.8 },
    stability: 'Holding',
    recentConflict: 'None of note.',
    ...(previousGovernments ? { previousGovernments } : {}),
  },
  npcs,
});

/** The same place under the seat law. */
const lawful = (s) => ({ ...s, config: { ...(s.config || {}), ...LAW } });

/** Transfer through the real door, asserting it applied (a refused transfer would make every arm vacuous). */
const transfer = (s, winner, opts = { cause: 'coup' }) => {
  const r = transferRulingPower(s, winner, opts);
  expect(r.error, `transfer to ${winner}`).toBeNull();
  return r.settlement;
};

/** The edges that answer R1 for the current form (R1's own matcher), each as the taker it names. */
const r1Takers = (s) => {
  const form = s.powerStructure.government;
  return s.powerStructure.factionRelationships
    .filter((r) => Array.isArray(r.pair) && r.pair.includes(form))
    .map((r) => ({ taker: r.pair.find((n) => n !== form), narrative: r.narrative }))
    .filter(({ taker, narrative }) => transferSentenceSays(narrative, 'edge', taker, form))
    .map(({ taker }) => taker);
};

/** The edge between the seat and a power. */
const seatEdge = (s, power) => s.powerStructure.factionRelationships.find((r) => r.pair.includes(s.powerStructure.government) && r.pair.includes(power));

const names = (s) => s.powerStructure.factions.map((f) => f.faction);

// ── (1) civic: kept ────────────────────────────────────────────────────────────────────────────────────────

describe('(1) a civic seat taken by its merchants: KEPT under the law, renamed without it', () => {
  for (const [tier, government, ownForm] of [['city', 'City Council', 'Grand Merchant Senate'], ['town', 'Town Council', 'Merchant City Council']]) {
    test(`${tier}: ${government} taken by Merchant Guilds by coup`, () => {
      const law = transfer(lawful(place({ tier, government })), 'Merchant Guilds');
      expect(law.powerStructure.government).toBe(government);
      expect(law.powerStructure.governingName).toBe(government);
      const seat = law.powerStructure.factions.find((f) => f.isGoverning);
      expect(seat).toMatchObject({ faction: government, category: 'government' });
      expect(seat.desc).toBeUndefined(); // the governing row keeps its desc (here: none): it is not a new body
      expect(law.powerStructure.previousGovernments).toBeUndefined(); // no row: nothing was renamed
      expect(holderOf(law, OWNER)).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds' });

      const old = transfer(place({ tier, government }), 'Merchant Guilds');
      expect(old.powerStructure.government).toBe(ownForm);
      expect(old.powerStructure.previousGovernments).toEqual([{ label: government, cause: 'coup', tick: null }]);
    });
  }
});

// ── (2) none and fallback: today's path ────────────────────────────────────────────────────────────────────

describe('(2) none and fallback: the winner\'s own form, today\'s output under both laws', () => {
  const cases = [
    ['none: a Ducal Governorship taken by a military power', { tier: 'town', government: 'Ducal Governorship', category: 'noble' }, 'The Garrison', 'Military Council'],
    ['fallback: a Town Council taken by a temple', { tier: 'town', government: 'Town Council' }, 'Temple of the Dawn', 'Theocratic Council'],
    ['fallback, a city: a City Council taken by a military power', { tier: 'city', government: 'City Council' }, 'The Garrison', 'Grand Military Council'],
  ];
  for (const [label, fixture, winner, form] of cases) {
    test(label, () => {
      for (const cause of RULING_POWER_CAUSES) {
        const old = transferRulingPower(place(fixture), winner, { cause, tick: 3, losers: ['Noble Houses'] });
        const law = transferRulingPower(lawful(place(fixture)), winner, { cause, tick: 3, losers: ['Noble Houses'] });
        expect(law.settlement.powerStructure.government, cause).toBe(form);
        const { config: _c, ...lawRest } = law.settlement;
        const { config: _o, ...oldRest } = old.settlement;
        expect(JSON.stringify({ ...law, settlement: lawRest }), cause).toBe(JSON.stringify({ ...old, settlement: oldRest }));
      }
    });
  }
});

// ── (3) licensed: kept only where the circumstance is held ─────────────────────────────────────────────────

describe('(3) a Royal Authority city taken by Merchant Guilds: KEPT only with trade wealth held (handed in)', () => {
  const king = () => card('npc_king', 'Aldric Vane', 'King', [{ power: 'Royal Authority', rank: 1 }, { power: 'Noble Houses', rank: 3 }]);
  const guildmaster = () => card('npc_gm', 'Corin Marsh', 'Guildmaster', [{ power: 'Merchant Guilds', rank: 1 }]);
  const crownCity = (economicState) => place({ tier: 'city', government: 'Royal Authority', category: 'noble', economicState, npcs: [king(), guildmaster()] });

  test('trade wealth held, handed in as the caller\'s thunk of seatCircumstancesOf: kept', () => {
    const s = lawful(crownCity(WEALTHY));
    expect(seatCircumstancesOf(s)).toContain('trade_wealth');
    const kept = transfer(s, 'Merchant Guilds', { cause: 'coup', seatCircumstances: () => seatCircumstancesOf(s) });
    expect(kept.powerStructure.government).toBe('Royal Authority');
    expect(holderOf(kept, OWNER)).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds' });
    // handed in as a value: the same
    const byValue = transfer(s, 'Merchant Guilds', { cause: 'coup', seatCircumstances: ['trade_wealth'] });
    expect(byValue).toEqual(kept);
  });

  test('trade wealth NOT held: the merchants\' own form', () => {
    const s = lawful(crownCity(MODEST));
    // anchored: the read is live: the WEALTHY sibling above reads trade_wealth off the same economicState read
    expect(seatCircumstancesOf(s)).not.toContain('trade_wealth');
    const own = transfer(s, 'Merchant Guilds', { cause: 'coup', seatCircumstances: () => seatCircumstancesOf(s) });
    expect(own.powerStructure.government).toBe('Grand Merchant Senate');
  });

  test('nothing handed in (every caller but the coup path): fail closed, the merchants\' own form', () => {
    const own = transfer(lawful(crownCity(WEALTHY)), 'Merchant Guilds');
    expect(own.powerStructure.government).toBe('Grand Merchant Senate');
  });

  test('the old law ignores what is handed in: today\'s rename', () => {
    const s = crownCity(WEALTHY);
    const old = transfer(s, 'Merchant Guilds', { cause: 'coup', seatCircumstances: ['trade_wealth'] });
    expect(old.powerStructure.government).toBe('Grand Merchant Senate');
    expect(old).toEqual(transfer(s, 'Merchant Guilds'));
  });

  test('the chair\'s condition 1, measured: on the kept crown the person is the seat\'s own card, never the taker\'s keeper', () => {
    const s = lawful(crownCity(WEALTHY));
    const kept = transfer(s, 'Merchant Guilds', { cause: 'coup', seatCircumstances: ['trade_wealth'] });
    expect(isCrownedForm(kept.powerStructure.government, kept.tier)).toBe(true);
    const h = holderOf(kept, OWNER);
    expect(h).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds', personRule: 'crown' });
    expect(h.person?.name).toBe('Aldric Vane');
    // the houses the person keeps (rank 1) other than the seat's own: none (a member of Noble Houses, rank 3, keeps it not)
    expect((h.person?.memberships || []).filter((m) => m.rank === 1 && m.power !== 'Royal Authority')).toEqual([]);
  });
});

// ── (4) one taker after every transfer ─────────────────────────────────────────────────────────────────────

describe('(4) after every transfer exactly ONE edge answers R1, and it names the last taker', () => {
  const coinExchange = { faction: 'Coin Exchange', category: 'merchant', power: 20, modifiers: [] };

  test('three transfers that return the seat to a form it held before (Military Council -> MCC -> Ducal -> MCC)', () => {
    let s = lawful(place({ tier: 'town', government: 'Military Council', category: 'military', extra: [coinExchange] }));
    const takers = [];
    for (const [winner, form] of [['Merchant Guilds', 'Merchant City Council'], ['Noble Houses', 'Ducal Governorship'], ['Coin Exchange', 'Merchant City Council']]) {
      s = transfer(s, winner);
      takers.push(winner);
      expect(s.powerStructure.government, winner).toBe(form);
      expect(r1Takers(s), winner).toEqual([winner]);
      expect(transferTakerOf(s, form), winner).toBe(winner);
      expect(holderOf(s, OWNER), winner).toMatchObject({ rule: 'R1', holderName: winner });
      for (const earlier of takers.slice(0, -1)) {
        const edge = seatEdge(s, earlier);
        expect(edge.type, `${winner}: ${earlier}'s edge`).toBe('competitive');
        expect(edge.narrative).toContain(earlier);
        expect(edge.narrative).toMatch(/(Merchant Guilds|Noble Houses|Coin Exchange).*(Merchant Guilds|Noble Houses|Coin Exchange)/);
      }
    }
  });

  test('control, the old law: the same three transfers leave two takers\' edges on the form (today\'s shape)', () => {
    let s = place({ tier: 'town', government: 'Military Council', category: 'military', extra: [coinExchange] });
    for (const winner of ['Merchant Guilds', 'Noble Houses', 'Coin Exchange']) s = transfer(s, winner);
    expect(r1Takers(s).sort()).toEqual(['Coin Exchange', 'Merchant Guilds']);
  });

  test('three transfers on a KEPT form (City Council: Merchant Guilds, Noble Houses, Merchant Guilds again)', () => {
    let s = lawful(place({ tier: 'city' }));
    for (const [winner, before] of [['Merchant Guilds', null], ['Noble Houses', 'Merchant Guilds'], ['Merchant Guilds', 'Noble Houses']]) {
      s = transfer(s, winner);
      expect(s.powerStructure.government).toBe('City Council');
      expect(r1Takers(s), winner).toEqual([winner]);
      expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R1', holderName: winner });
      if (before) {
        const edge = seatEdge(s, before);
        expect(edge.type).toBe('competitive');
        expect(edge.narrative).toContain(before);
        expect(edge.narrative).toContain(winner);
      }
    }
    // no edge is deleted and none is added beyond today's: the seat's two born edges plus one per new taker
    expect(s.powerStructure.factionRelationships.length).toBe(3);
  });

  test('a town-size case: Town Council taken by two takers in turn (both kept)', () => {
    const s = transfer(transfer(lawful(place({ tier: 'town', government: 'Town Council' })), 'Noble Houses'), 'Merchant Guilds');
    expect(s.powerStructure.government).toBe('Town Council');
    expect(r1Takers(s)).toEqual(['Merchant Guilds']);
    expect(seatEdge(s, 'Noble Houses').type).toBe('competitive');
  });
});

// ── (5) the demotion ───────────────────────────────────────────────────────────────────────────────────────

describe('(5) a demotion (election, Register VII) with a kept form: no two rows share a name', () => {
  const reg7 = (fixture) => place({ ...fixture, config: { ...REGISTER_VII } });

  test('a City Council held by Noble Houses (an earlier coup) passes by election to Merchant Guilds, kept', () => {
    const before = transfer(lawful(reg7({ tier: 'city' })), 'Noble Houses');
    const after = transfer(before, 'Merchant Guilds', { cause: 'election' });
    expect(after.powerStructure.government).toBe('City Council');
    const all = names(after);
    expect(new Set(all).size).toBe(all.length);
    // the former holder stands as its own row under its own name; nothing is appended under the form's name
    expect(all.filter((n) => n === 'Noble Houses')).toHaveLength(1);
    expect(all.filter((n) => n === 'City Council')).toHaveLength(1);
    expect(after.powerStructure.factions.length).toBe(before.powerStructure.factions.length);
    expect(r1Takers(after)).toEqual(['Merchant Guilds']);
    expect(seatEdge(after, 'Noble Houses').type).toBe('competitive');
  });

  test('a town-size kept form under a forced demotion: still one row of the form\'s name', () => {
    const after = transfer(lawful(reg7({ tier: 'town', government: 'Town Council' })), 'Merchant Guilds', { cause: 'succession', demoteIncumbent: true });
    const all = names(after);
    expect(after.powerStructure.government).toBe('Town Council');
    expect(new Set(all).size).toBe(all.length);
  });

  test('control, the renamed path keeps today\'s demotion under the law: the house lives as its own row', () => {
    for (const config of [{}, LAW]) {
      const after = transfer(place({ tier: 'town', government: 'Ducal Governorship', category: 'noble', config: { ...REGISTER_VII, ...config } }), 'The Garrison', { cause: 'election' });
      expect(after.powerStructure.government).toBe('Military Council');
      const house = after.powerStructure.factions.find((f) => f.faction === 'Ducal Governorship');
      expect(house).toMatchObject({ isGoverning: false, modifiers: [DEPOSED_MODIFIER] });
      const all = names(after);
      expect(new Set(all).size).toBe(all.length);
    }
  });

  test('control, the old law: a civic winner on a Register VII world appends the fallen house (today)', () => {
    const after = transfer(reg7({ tier: 'city' }), 'Merchant Guilds', { cause: 'election' });
    expect(after.powerStructure.government).toBe('Grand Merchant Senate');
    expect(after.powerStructure.factions.find((f) => f.faction === 'City Council')).toMatchObject({ isGoverning: false, modifiers: [DEPOSED_MODIFIER] });
  });
});

// ── (6) a town through the real transfer: the person and the cards unmoved ─────────────────────────────────

describe('(6) a town-size case: the person holderOf names, and every card, are not moved by this unit', () => {
  test('Town Council (town) taken by Merchant Guilds: the Mayor stays the person; no card changes', () => {
    const mayor = card('npc_mayor', 'Hilde Brandt', 'Mayor', [{ power: 'Town Council', rank: 1 }]);
    const keeper = card('npc_gm', 'Corin Marsh', 'Guildmaster', [{ power: 'Merchant Guilds', rank: 1 }]);
    const s = lawful(place({ tier: 'town', government: 'Town Council', npcs: [mayor, keeper] }));
    const before = holderOf(s, OWNER);
    const after = transfer(s, 'Merchant Guilds');
    expect(after.npcs).toEqual(s.npcs);
    const h = holderOf(after, OWNER);
    expect(h).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds', personRule: 'seat' });
    expect(h.person).toEqual(before.person);
    expect(h.person?.name).toBe('Hilde Brandt');
  });
});

// ── (7) the old law, byte for byte ─────────────────────────────────────────────────────────────────────────

describe('(7) the old law is byte-identical for every cause (recorded from the pre-change module)', () => {
  /** A prior transfer on record: Noble Houses' power-behind edge on the seat, and a previous government. */
  const history = {
    relationships: [{ pair: ['City Council', 'Noble Houses'], type: 'symbiotic', direction: 'stable', narrative: 'Noble Houses is the power behind the city council. The seat answers to them now.' }],
    previousGovernments: [{ label: 'Royal Authority', cause: 'coup', tick: 1 }],
  };
  const FIXTURES = {
    cityKept: () => place({ tier: 'city', ...history }),
    register7: () => place({ tier: 'city', config: { ...REGISTER_VII }, ...history }),
    townNone: () => place({ tier: 'town', government: 'Ducal Governorship', category: 'noble' }),
  };
  const WINNER = { cityKept: 'Merchant Guilds', register7: 'Merchant Guilds', townNone: 'The Garrison' };
  /** sha256 of a result with the settlement's config left out (the law key rides config, and nothing else). */
  const digest = (r) => {
    const { config: _drop, ...rest } = r.settlement;
    return createHash('sha256').update(JSON.stringify({ ...r, settlement: rest })).digest('hex');
  };
  const run = (key, cause, config) => {
    const base = FIXTURES[key]();
    return transferRulingPower({ ...base, config: { ...base.config, ...config } }, WINNER[key], { cause, tick: 7, losers: ['Noble Houses', 'The Garrison', 'Temple of the Dawn'] });
  };

  // RECORDED at base 6e697f5db (the module before U5), by this arm's own `digest`, before rulingPower.js was edited.
  const RECORDED = {
    'cityKept:coup': '4240d923837065622bbbc16c7f74eaa0606c7bdced08ea7a520c0af65f5192a9',
    'cityKept:election': '25530c2826fd7a504a3018b880ed9909893d8d3b5e9f2d2d27cf175c47cf91d9',
    'cityKept:succession': 'ec3d8664266de537416195436a3ed47a83675bc23e816ca6557e7106a9a3013f',
    'cityKept:conquest': 'a6aab1fb9f4de87ac10ffea51fc61bca3130297d2a358652d5a362e45b6ae0f4',
    'cityKept:appointment': '8b9b69ddc04909155e74e154f7cd776ef0fdd65c206bee74ba11d20dbd742ab2',
    'register7:coup': '4240d923837065622bbbc16c7f74eaa0606c7bdced08ea7a520c0af65f5192a9',
    'register7:election': '5b1174f31103ab256fcb1ee757761a2165d9640929c184b4b2aa9aca04196b58',
    'register7:succession': 'ed7960182f5006cc4bf75a78f2786d10fbbd5c68e9759f56574ff2777a4d84a5',
    'register7:conquest': 'a6aab1fb9f4de87ac10ffea51fc61bca3130297d2a358652d5a362e45b6ae0f4',
    'register7:appointment': 'c18296c9bd204e209108e57587dac76b6427b0084829d10be091b93a629ad393',
    'townNone:coup': 'cb5e4e9cf8cb01fa373e449cb55b4212d32cc249b5871ac12cd6bf24204ec950',
    'townNone:election': '5867536815074b039358e9f9bc40c7741d3c47a83407f4bbdb52fc25ff13ca0c',
    'townNone:succession': '1e35ee830c8679e45fe000fad83d1a67fa37c96fff3bac03e50ad02e7cdc2e5a',
    'townNone:conquest': '4cd9ad32d46bab6f4393379d561ef47064886f751966f59c0190b002573fa827',
    'townNone:appointment': '12cd234874b28288015cc3790af5608161dd0a766971aed20acb5e4de78619cd',
  };

  test('no law key, `_seatLawVersion: 1`, and the string \'2\' (a foreign value) all read the recorded output', () => {
    const got = {};
    for (const key of Object.keys(FIXTURES)) for (const cause of RULING_POWER_CAUSES) {
      got[`${key}:${cause}`] = digest(run(key, cause, {}));
      for (const config of [{ _seatLawVersion: 1 }, { _seatLawVersion: '2' }]) {
        expect(digest(run(key, cause, config)), `${key}:${cause}:${JSON.stringify(config)}`).toBe(got[`${key}:${cause}`]);
      }
    }
    expect(got).toEqual(RECORDED);
  });

  test('negative control: under the law every row differs, where it keeps the form and where it retires an edge', () => {
    let differs = 0;
    for (const key of ['cityKept', 'register7']) for (const cause of RULING_POWER_CAUSES) {
      if (digest(run(key, cause, LAW)) !== RECORDED[`${key}:${cause}`]) differs += 1;
    }
    expect(differs).toBe(2 * RULING_POWER_CAUSES.length);
  });
});

// ── (8) the chair's condition 2: the change of hands stays readable ────────────────────────────────────────

describe('(8) with the form kept, the change of hands names the taker on every surface the transfer writes', () => {
  for (const cause of RULING_POWER_CAUSES) {
    test(`${cause}: recentConflict, the power-behind edge and the ascendant marker name Merchant Guilds; nothing reads "reshaped"`, () => {
      const prior = transfer(lawful(place({ tier: 'city' })), 'Noble Houses');
      const s = transfer(prior, 'Merchant Guilds', { cause, tick: 9 });
      const ps = s.powerStructure;
      expect(ps.government).toBe('City Council');
      // (a) the transfer's own line names the taker and the form, says no reshaping, and is a wording R1's list holds
      expect(ps.recentConflict).toContain('Merchant Guilds');
      expect(ps.recentConflict).toContain('city council');
      // anchored: recentConflict is live text: the two lines above assert it names Merchant Guilds and the city council
      expect(ps.recentConflict).not.toMatch(/reshap/i);
      expect(transferSentenceSays(ps.recentConflict, 'conflict', 'Merchant Guilds', 'City Council')).toBe(true);
      expect(transferSentenceSays(ps.recentConflict, 'conflict', 'Noble Houses', 'City Council')).toBe(false);
      // (b) the power-behind edge
      const edge = seatEdge(s, 'Merchant Guilds');
      expect(edge).toMatchObject({ type: 'symbiotic', narrative: 'Merchant Guilds is the power behind the city council. The seat answers to them now.' });
      // (c) the ascendant marker
      expect(ps.factions.find((f) => f.faction === 'Merchant Guilds').modifiers).toContain('ascendant');
      // the retired edge names both powers, states the loss, and is never read as a transfer by R1's matcher
      const retired = seatEdge(s, 'Noble Houses');
      expect(retired.type).toBe('competitive');
      expect(retired.narrative).toContain('Noble Houses');
      expect(retired.narrative).toContain('Merchant Guilds');
      for (const who of ['Noble Houses', 'Merchant Guilds']) expect(transferSentenceSays(retired.narrative, 'edge', who, null)).toBe(false);
      // no line the transfer writes reads "reshaped"
      // anchored: ps is the live record: recentConflict and the taker's edge were asserted present above
      expect(JSON.stringify(ps)).not.toMatch(/reshap/i);
    });
  }

  test('the old law still writes today\'s coup line', () => {
    const s = transfer(place({ tier: 'city' }), 'Merchant Guilds');
    expect(s.powerStructure.recentConflict).toBe('Merchant Guilds overthrew the city council and reshaped the government as a grand merchant senate.');
  });
});

// ── (9) CS22 (d): the guard ────────────────────────────────────────────────────────────────────────────────

describe('(9) CS22 (d), the guard: no card carries a crown word with a house it keeps other than the seat\'s own', () => {
  /** A crown word, read through the title table, its leading article dropped: a born monarch's title is "the monarch",
   *  which `officeWordInfo` alone reads as no word at all (it matches the bare word only). */
  const isCrownWord = (w) => officeWordInfo(String(w ?? '').replace(/^the\s+/i, ''))?.crown === true;
  /** The cards that carry a crown word (by title, else role) and keep (rank 1) a house other than the seat's own. */
  const crownedKeepers = (s) => {
    const seat = s.powerStructure.government;
    return (s.npcs || []).filter((npc) => [npc.title, npc.role].some(isCrownWord)
      && (npc.memberships || []).some((m) => m.rank === 1 && m.power !== seat));
  };
  const king = (memberships) => card('npc_king', 'Aldric Vane', 'King', memberships);
  const guildmaster = () => card('npc_gm', 'Corin Marsh', 'Guildmaster', [{ power: 'Merchant Guilds', rank: 1 }]);
  const kept = (npcs) => transfer(lawful(place({ tier: 'city', government: 'Royal Authority', category: 'noble', economicState: WEALTHY, npcs })),
    'Merchant Guilds', { cause: 'coup', seatCircumstances: ['trade_wealth'] });

  test('arm (3)\'s transferred town: green, and the person holderOf names keeps no other house', () => {
    const s = kept([king([{ power: 'Royal Authority', rank: 1 }, { power: 'Noble Houses', rank: 3 }]), guildmaster()]);
    expect(s.powerStructure.government).toBe('Royal Authority');
    expect(crownedKeepers(s)).toEqual([]);
    const person = holderOf(s, OWNER).person;
    expect(person?.name).toBe('Aldric Vane');
    expect((person?.memberships || []).filter((m) => m.rank === 1 && m.power !== 'Royal Authority')).toEqual([]);
  });

  test('the born monarch\'s word ("the monarch", as birth titles it) reads as a crown word; a mayor\'s does not', () => {
    expect(officeWordInfo('the monarch')).toBeNull(); // the bare table read misses it: why the guard drops the article
    expect(isCrownWord('the monarch')).toBe(true);
    expect(isCrownWord('King')).toBe(true);
    expect(isCrownWord('Mayor')).toBe(false);
    const s = kept([card('npc_king', 'Aldric Vane', 'the monarch', [{ power: 'Royal Authority', rank: 1 }, { power: 'Noble Houses', rank: 1 }]), guildmaster()]);
    expect(crownedKeepers(s).map((n) => n.name)).toEqual(['Aldric Vane']);
  });

  test('negative control: a king planted as the keeper of Noble Houses is caught', () => {
    const s = kept([king([{ power: 'Royal Authority', rank: 1 }, { power: 'Noble Houses', rank: 1 }]), guildmaster()]);
    expect(crownedKeepers(s).map((n) => n.name)).toEqual(['Aldric Vane']);
  });
});

// ── (10) cure (1), the chair 16:43Z: the retired edge is a class of its own ────────────────────────────────

describe('(10) the retired edge\'s narrative is ONE fixed wording of its own class (\'retiredEdge\'), never an \'edge\' wording', () => {
  /** A kept City Council (Noble Houses, then Merchant Guilds) and a renamed one (Military Council, two coups). */
  const keptTown = () => transfer(transfer(lawful(place({ tier: 'city' })), 'Noble Houses'), 'Merchant Guilds');
  const renamedTown = () => transfer(transfer(lawful(place({ tier: 'town', government: 'Military Council', category: 'military' })), 'Merchant Guilds'), 'Noble Houses');

  test('the list holds the retired wording once, as \'retiredEdge\', and the real transfer writes it (kept and renamed)', () => {
    expect(TRANSFER_WORDINGS.filter((w) => w.sentence === 'retiredEdge').length).toBe(1);
    for (const [label, s, loser, taker, heldForm] of [
      ['kept', keptTown(), 'Noble Houses', 'Merchant Guilds', 'City Council'],
      ['renamed', renamedTown(), 'Merchant Guilds', 'Noble Houses', 'Merchant City Council'],
    ]) {
      const retired = seatEdge(s, loser);
      expect(retired.type, label).toBe('competitive');
      expect(transferSentenceSays(retired.narrative, 'retiredEdge', taker, heldForm), label).toBe(true);
      // the matcher reads the class: the retired wording is no 'edge' and no 'conflict' wording, for any form
      for (const who of [loser, taker]) {
        expect(transferSentenceSays(retired.narrative, 'edge', who, null), `${label}: ${who}`).toBe(false);
        expect(transferSentenceSays(retired.narrative, 'conflict', who, null), `${label}: ${who}`).toBe(false);
      }
    }
  });

  test('R1 neither reads the loser as a taker nor falls to the fail-closed "nobody" on a retired edge alone', () => {
    for (const s of [keptTown(), renamedTown()]) {
      const form = s.powerStructure.government;
      const winner = holderOf(s, OWNER).holderName;
      // the winner's own edge taken away: the retired edge is the only edge on the seat that names a former holder
      const bare = structuredClone(s);
      bare.powerStructure.factionRelationships = bare.powerStructure.factionRelationships
        .filter((r) => !(r.pair.includes(form) && r.pair.includes(winner)));
      expect(transferTakerOf(bare, form)).toBeNull();
      const h = holderOf(bare, OWNER);
      expect(h.rule).not.toBe('R1'); // no taker read, and Addendum 3's "nobody" did not fire
    }
  });
});

// ── U5-CURE (b): the callers hand in the seat's circumstances (the chair 17:32Z) ───────────────────────────

/** A Royal Authority city, trade wealth held, its king the seat's card: the licensed pair a merchant king keeps. */
const crownTown = (config = {}) => place({
  tier: 'city', government: 'Royal Authority', category: 'noble', economicState: WEALTHY, config,
  npcs: [card('npc_king', 'Aldric Vane', 'King', [{ power: 'Royal Authority', rank: 1 }, { power: 'Noble Houses', rank: 3 }])],
});
const NOW = '2026-11-20T00:00:00.000Z';

/** The world pulse's apply pass over ONE outcome on ONE settlement (the real `applyWorldPulseOutcomes`). */
const pulse = (settlement, outcome) => applyWorldPulseOutcomes({
  snapshot: { regionalGraph: { edges: [], channels: [] }, settlements: [{ id: 's1', name: settlement.name, settlement }], campaign: {} },
  worldState: { stressors: [], npcStates: {}, proposals: [] },
  regionalGraph: { edges: [], channels: [] },
  settlementMap: new Map([['s1', { saveId: 's1', save: { name: settlement.name }, settlement }]]),
  outcomes: [outcome], tick: 4, now: NOW, advanceNewsTick: false, advanceRegionalImpacts: false,
});
const settledOf = (r) => r.settlementUpdates.find((e) => e.saveId === 's1').settlement;

/** THE THREE PATHS, each by its real door, each with every cause it takes. */
const PATHS = {
  // (i) the world pulse's power-transfer outcome (`applyWorldPulse.js`, the shape `worldPulse/coup.js` writes)
  pulseTransfer: {
    causes: RULING_POWER_CAUSES,
    run: (s, cause) => pulse(s, {
      id: `coup.${cause}`, type: 'power_transfer', candidateType: 'coup_succeeded', applyMode: 'auto', targetSaveId: 's1', severity: 0.6,
      headline: 'Merchant Guilds seizes power in Harrowgate', summary: 'The seat fell.', reasons: [],
      powerTransfer: { toPowerName: 'Merchant Guilds', cause, tick: 4, losers: ['Noble Houses'] },
    }),
    settled: settledOf,
  },
  // (ii) the roster's `government_change` (`applyWorldPulseFactionRoster.js :: applyFactionPayloadEffect`), cause 'appointment'
  rosterChange: {
    causes: ['appointment'],
    run: (s) => pulse(s, {
      id: 'faction.gov', type: 'faction', candidateType: 'faction_government_change', applyMode: 'auto', targetSaveId: 's1', severity: 0.6,
      headline: 'Merchant Guilds take the seat', summary: 'U5-CURE fixture: government_change.', reasons: [],
      proposalPayload: { kind: 'government_change', settlementId: 's1', factionId: 's1:merchant_guilds' },
      metadata: { factionName: 'Merchant Guilds' },
    }),
    settled: settledOf,
  },
  // (iii) the DM's CHANGE_RULING_POWER event (`mutateWorld.js :: changeRulingPower`, through `mutate.js`)
  eventChange: {
    causes: RULING_POWER_CAUSES,
    run: (s, cause) => mutateSettlement({
      settlement: s, now: NOW,
      event: { id: `ev.${cause}`, type: 'CHANGE_RULING_POWER', targetId: 'Merchant Guilds', payload: { cause }, cause: 'player_action' },
    }),
    settled: (r) => r,
  },
};

describe('(11) U5-CURE (b): under the law a merchant king keeps the Royal Authority through each WIRED caller\'s real path', () => {
  test('the fixture holds trade wealth (the licence\'s circumstance), read live', () => {
    expect(seatCircumstancesOf(crownTown(LAW))).toContain('trade_wealth');
  });
  // pulseTransfer joined the wired paths at U5-CURE2 (the chair 19:19Z/19:34Z): the room was made without a rise
  // (`applyWorldPulse.js`'s multi-line import of `rulingPower.js` collapsed to one line, 907 -> 902), then the one argument.
  for (const key of ['rosterChange', 'pulseTransfer']) {
    test(`${key}: every cause it takes keeps the Royal Authority, and R1 names Merchant Guilds`, () => {
      for (const cause of PATHS[key].causes) {
        const s = PATHS[key].settled(PATHS[key].run(crownTown(LAW), cause));
        expect(s.powerStructure.government, `${key}:${cause}`).toBe('Royal Authority');
        expect(holderOf(s, OWNER), `${key}:${cause}`).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds' });
      }
    });
  }
  // THE ONE STOP, pinned (U5-CURE's report; the NAMED SURVIVOR at U5-CURE2): the path is NOT wired and falls closed to
  // the merchants' own form.
  //   eventChange: `mutateWorld.js` is FIRST PAINT (main.jsx -> store/index.js -> store/settlementSlice.js ->
  //     events/mutate.js -> events/mutateWorld.js); the brief forbids its import of the lazy `seatCircumstances.js`.
  // (pulseTransfer's stop, the size ceiling, was cured at U5-CURE2 and moved up to the wired paths above.)
  for (const key of ['eventChange']) {
    test(`the STOP, pinned: ${key} is NOT wired: under the law it falls closed to the merchants' own form`, () => {
      for (const cause of PATHS[key].causes) {
        const s = PATHS[key].settled(PATHS[key].run(crownTown(LAW), cause));
        expect(s.powerStructure.government, `${key}:${cause}`).toBe('Grand Merchant Senate');
      }
    });
  }
  test('control, the old law: every path renames the seat to the merchants\' own form', () => {
    for (const [key, path] of Object.entries(PATHS)) for (const cause of path.causes) {
      expect(path.settled(path.run(crownTown(), cause)).powerStructure.government, `${key}:${cause}`).toBe('Grand Merchant Senate');
    }
  });
});

describe('(12) U5-CURE (b): THE LAW DARK, the three paths are byte-identical at play time (the chair\'s condition)', () => {
  const digest = (r) => createHash('sha256').update(JSON.stringify(r)).digest('hex');
  /** Both fixtures dark: the crown city (licensed) and a civic town (kept under the law). */
  const FIXTURES = { crown: () => crownTown(), civic: () => place({ tier: 'town', government: 'Town Council' }) };

  // RECORDED at 9a05215bc (the callers before U5-CURE), by this arm's own `digest`, before any caller was edited. The
  // two rosterChange rows were re-recorded the same way (this file run in a `git archive` tree of 9a05215bc) when the
  // fixture's summary left a state-prose wording (proseDrawnAnchors.walker); the other 20 rows read equal there.
  const RECORDED = {
    'civic:eventChange:appointment': '2a2319a200081990518ee5187f523d0b970280e658b9630a6ae7231cc7874a9e',
    'civic:eventChange:conquest': 'a2c423eb8c3bb76fc02af3e7a52caee9e5be9e527ed82784fbdd672f6fa9a7cd',
    'civic:eventChange:coup': '0824ce77a34014d03878d71ba563c81af76239db386d45786f72b4c5410c75d5',
    'civic:eventChange:election': '370bd3a117ff568eeaae3a8366e95e732069dad97a034f4d81670cf4d59fa991',
    'civic:eventChange:succession': 'b3c44df47fae89bc7df42a5a0577eea32310b5d784b896055ef562e685a7c8e9',
    'civic:pulseTransfer:appointment': 'b0867ad8f261299307479cb44c35d1b302b004433c84a7077f43767a8125ae5b',
    'civic:pulseTransfer:conquest': '2e445617e6a1c7b655f78180c8a03d1b93ddf11fc17f6dbe6919a20a719aa3c6',
    'civic:pulseTransfer:coup': 'd63b15b884b2e7eea63f5f405339268d954cb55ffad5028e5da031a046278b7d',
    'civic:pulseTransfer:election': '0459ffabb43a8ec0ae91572e71586e96d8ef62515606d1eac965253cdd322e1b',
    'civic:pulseTransfer:succession': 'dca96502b76cbe76efcb751bdd00beef6ac9d988bbf7f2ee96cbae87c1525d10',
    'civic:rosterChange:appointment': '61cd36cdaf56a24c2c76685032a8012255e29ef5abbc829c83171124a6acdde2',
    'crown:eventChange:appointment': 'c506372f380686044559b50787b38472084d7bb0b53353da7691499444bf8188',
    'crown:eventChange:conquest': '70a7aed68c0876aa038bb3c82fdd16b628fdf5104b4f445408698975fab2634f',
    'crown:eventChange:coup': '98e3e1068d18c91cda7d859c8a066be149c995663f702a544b440639eda57801',
    'crown:eventChange:election': 'e9cf5fc2ce337755a83f2bcff2a299c9c73df13860d90000e7e56c7cd7f4c0c2',
    'crown:eventChange:succession': 'ee712da208196701c0ff3ce1900f4d56feca297f2fe1899bb74a3d1a987a7582',
    'crown:pulseTransfer:appointment': '89f9a7962135cecfe858fef3211979e91ab11c6021d8b864e7403fc13ca09c28',
    'crown:pulseTransfer:conquest': 'a9020767af0044afba2826a4decbdcbb32481f24429301cd877ee6977d25c78d',
    'crown:pulseTransfer:coup': '256f7092c533c247994fefdb1dd86414422e5bbb19857184264edb5617a7e8c1',
    'crown:pulseTransfer:election': '185326cc5cb66d2de70e92bfeafa333518c9e8b114910640534cdc1ca15bdeeb',
    'crown:pulseTransfer:succession': 'babe5d415740772bd062b8735d68c2798e146d7d6fe7849852dc75f3a58621a7',
    'crown:rosterChange:appointment': 'c184d3a992ab8b5aeb838d8b654603c0e2af7f5d32fb52908993dc4e0fe99829',
  };

  const runAll = (config) => {
    const got = {};
    for (const [fx, make] of Object.entries(FIXTURES)) for (const [key, path] of Object.entries(PATHS)) for (const cause of path.causes) {
      const base = make();
      got[`${fx}:${key}:${cause}`] = digest(path.run({ ...base, config: { ...base.config, ...config } }, cause));
    }
    return got;
  };

  test('no law key: every path, every cause, reads the recorded result (and is stable run to run)', () => {
    const got = runAll({});
    expect(runAll({})).toEqual(got);
    expect(Object.keys(got).length).toBe(2 * (2 * RULING_POWER_CAUSES.length + 1));
    expect(got).toEqual(RECORDED);
  });

  test('negative control: under the law every row\'s digest differs from the dark one', () => {
    const dark = runAll({});
    const lit = runAll(LAW);
    expect(Object.keys(lit).filter((k) => lit[k] === dark[k])).toEqual([]);
  });
});
