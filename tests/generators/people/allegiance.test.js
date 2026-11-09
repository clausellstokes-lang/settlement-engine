/**
 * tests/generators/people/allegiance.test.js — THE HIDDEN ALLEGIANCE's invariants (the allegiance
 * train, car 1, ALLEGIANCE-CAR1, 2026-11-08; docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §4).
 *
 * Written FIRST, red-first (the brief §4.3): every check reads the RECORD's raw fields — not the
 * module under test — so it runs at the split's tip, where no allegiance is dealt and the anti-vacuity
 * arms red; and every check reds on a planted violation (its control), so a green arm proves the check
 * is live, not that there was nothing to look at.
 *
 *   I-2  every hidden allegiance has exactly one handler, a roster card ≠ itself;
 *   I-3  every handler is a criminal face — a member of `allegiance.power`, or a crim-house face — and
 *        never a card that itself holds an allegiance;
 *   I-4  the gate: no allegiance on a card without a corruptible flaw, on a criminal face, or in a town
 *        with no criminal house on its roster;
 *   I-13 keyed determinism: removing a card leaves every other card's roll byte-identical;
 *   and the birth record carries none of the retired mark's three fields (`corrupt`, `corruptionVector`,
 *   `corruptTies`): "the compromised tag from now on would only appear for the simulator purpose".
 */
import { describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';
import { isCriminalInstitution, isCorruptibleFlaw } from '../../../src/domain/corruption.js';
import { INSTITUTION_FAMILIES, familyNamesByTier } from '../../../src/data/institutionalCatalog.js';

/** The soak slice: the cities and metropolises of the soak 1,000's first 240 (index ≡ 4, 5 mod 6). */
const SLICE = Array.from({ length: 240 }, (_, i) => i).filter((i) => i % 6 === 4 || i % 6 === 5);
/** @type {Map<number, any>} */
const BORN = new Map();
async function born() {
  await ensureLaws();
  for (const i of SLICE) if (!BORN.has(i)) BORN.set(i, birth(i).settlement);
  return SLICE.map((i) => ({ i, s: BORN.get(i) }));
}

const flawOf = (card) => [card?.personality?.flaw, card?.flaw].find((f) => isCorruptibleFlaw(f)) || null;

/**
 * Every invariant finding on one settlement, by the raw record (I-2, I-3, I-4).
 * @param {any} s @returns {string[]}
 */
export function allegianceFindings(s) {
  const out = [];
  const cast = (s?.npcs || []).filter((n) => n && n.id != null);
  const byId = new Map(cast.map((n) => [String(n.id), n]));
  const crimHouses = new Set((s?.institutions || []).filter((inst) => isCriminalInstitution(inst)).map((inst) => String(inst.name)));
  const crimPowers = new Set((s?.powerStructure?.factions || [])
    .filter((f) => String(f?.category || '').toLowerCase() === 'criminal' || /thie/i.test(String(f?.faction || f?.name || '')))
    .map((f) => String(f.faction || f.name)));
  const isCrimFace = (n) => (n?.institution?.kind === 'house' && crimHouses.has(String(n.institution.key)))
    || (n?.institution?.kind === 'power' && crimPowers.has(String(n.institution.key)));
  for (const card of cast) {
    const a = card.allegiance;
    if (a == null) continue;
    const tag = `${card.id}`;
    // I-4 — the gate
    if (!flawOf(card)) out.push(`I-4 ${tag}: an allegiance on a card with no corruptible flaw`);
    if (isCrimFace(card)) out.push(`I-4 ${tag}: an allegiance on a criminal face`);
    if (!crimHouses.size) out.push(`I-4 ${tag}: an allegiance in a town with no criminal house on its roster`);
    if (!a.house || !crimHouses.has(String(a.house))) out.push(`I-4 ${tag}: the allegiance's house ${a.house} is not a roster criminal house`);
    // I-2 — exactly one handler, a roster card, not itself
    if (typeof a.handler !== 'string' || !a.handler) { out.push(`I-2 ${tag}: no handler`); continue; }
    if (a.handler === String(card.id)) { out.push(`I-2 ${tag}: its own handler`); continue; }
    const h = byId.get(a.handler);
    if (!h) { out.push(`I-2 ${tag}: handler ${a.handler} is not on the roster`); continue; }
    // I-3 — the handler is a criminal face, never an agent itself
    const member = a.power && (h.memberships || []).some((m) => m?.power === a.power);
    if (!member && !isCrimFace(h)) out.push(`I-3 ${tag}: handler ${h.id} is neither a member of ${a.power} nor a criminal face`);
    if (h.allegiance != null) out.push(`I-3 ${tag}: handler ${h.id} holds an allegiance itself`);
  }
  return out;
}

/** The retired mark's fields on a birth-era card. @param {any} s @returns {string[]} */
function legacyFields(s) {
  const out = [];
  for (const n of s?.npcs || []) {
    for (const k of ['corrupt', 'corruptionVector', 'corruptTies']) if (n && Object.hasOwn(n, k)) out.push(`${n.id}.${k}`);
  }
  return out;
}

describe('the hidden allegiance — invariants over the soak slice (I-2, I-3, I-4)', () => {
  it('the slice deals allegiances (anti-vacuity): at least 40 agents across at least 12 towns', async () => {
    const rows = await born();
    const agents = rows.flatMap(({ s }) => (s.npcs || []).filter((n) => n?.allegiance != null));
    const towns = rows.filter(({ s }) => (s.npcs || []).some((n) => n?.allegiance != null));
    expect(agents.length, 'agents in the slice').toBeGreaterThanOrEqual(40);
    expect(towns.length, 'towns with an agent').toBeGreaterThanOrEqual(12);
  }, 300_000);

  it('I-2 / I-3 / I-4 hold on every town of the slice', async () => {
    const rows = await born();
    const findings = rows.flatMap(({ i, s }) => allegianceFindings(s).map((f) => `soak1k-${i} ${f}`));
    expect(findings).toEqual([]);
    // anchored: THE COUNTERFORCE — the anti-vacuity arm above proves the slice holds agents to check
    expect(rows.length).toBe(SLICE.length);
  }, 300_000);

  it('the birth record carries none of the retired mark\'s three fields', async () => {
    const rows = await born();
    const found = rows.flatMap(({ i, s }) => legacyFields(s).map((f) => `soak1k-${i} ${f}`));
    expect(found.slice(0, 10)).toEqual([]);
    // anchored: THE COUNTERFORCE — a town of the slice holds a criminal house, so the retired pass would have stamped it
    expect(rows.some(({ s }) => (s.institutions || []).some((inst) => isCriminalInstitution(inst)))).toBe(true);
  }, 300_000);
});

describe('the checks are live — each reds on a planted violation (the controls)', () => {
  /** A minimal town: a thieves' guild chapter and its face, a tavern and its keeper. */
  const town = () => ({
    institutions: [{ name: "Thieves' guild chapter", category: 'criminal' }, { name: 'Inns and taverns (district)', category: 'economy' }],
    powerStructure: { factions: [{ faction: "Thieves' Guild", category: 'criminal', power: 15 }, { faction: 'The Council', category: 'government', power: 85, isGoverning: true }] },
    npcs: [
      { id: 'npc_boss', institution: { kind: 'house', key: "Thieves' guild chapter" }, memberships: [{ power: "Thieves' Guild", rank: 1, share: 1 }] },
      { id: 'npc_keeper', institution: { kind: 'house', key: 'Inns and taverns (district)' }, personality: { flaw: 'greedy' }, memberships: [{ power: 'The Council', rank: null, share: 1 }],
        allegiance: { power: "Thieves' Guild", house: "Thieves' guild chapter", vector: 'greed', via: 'front', handler: 'npc_boss', share: 0.15, veiled: true, covert: true } },
    ],
  });
  it('the clean control is clean', () => {
    expect(allegianceFindings(town())).toEqual([]);
    expect(isCorruptibleFlaw('greedy'), 'the control\'s flaw is corruptible').toBe(true);
  });
  it('I-2 reds: no handler · its own handler · a handler off the roster', () => {
    for (const handler of [null, 'npc_keeper', 'npc_ghost']) {
      const s = town(); s.npcs[1].allegiance.handler = handler;
      expect(allegianceFindings(s).some((f) => f.startsWith('I-2'))).toBe(true);
    }
  });
  it('I-3 reds: a handler who is no criminal face · a handler who is an agent', () => {
    const a = town(); a.npcs.push({ id: 'npc_clerk', institution: { kind: 'house', key: 'Inns and taverns (district)' }, memberships: [] }); a.npcs[1].allegiance.handler = 'npc_clerk';
    expect(allegianceFindings(a).some((f) => f.startsWith('I-3'))).toBe(true);
    const b = town(); b.npcs[0].allegiance = { house: "Thieves' guild chapter", vector: 'greed', handler: 'npc_keeper' };
    expect(allegianceFindings(b).some((f) => f.startsWith('I-3'))).toBe(true);
  });
  it('I-4 reds: no flaw · a criminal face · no criminal house on the roster', () => {
    const a = town(); a.npcs[1].personality = {};
    expect(allegianceFindings(a).some((f) => f.includes('no corruptible flaw'))).toBe(true);
    const b = town(); b.npcs.push({ id: 'npc_fence', institution: { kind: 'house', key: "Thieves' guild chapter" }, personality: { flaw: 'greedy' },
      allegiance: { power: "Thieves' Guild", house: "Thieves' guild chapter", vector: 'greed', handler: 'npc_boss' } });
    expect(allegianceFindings(b).some((f) => f.includes('on a criminal face'))).toBe(true);
    const c = town(); c.institutions = [c.institutions[1]];
    expect(allegianceFindings(c).some((f) => f.includes('no criminal house on its roster'))).toBe(true);
  });
  it('the legacy-field check reds on a planted `corrupt`', () => {
    const s = town(); s.npcs[1].corrupt = false;
    expect(legacyFields(s)).toEqual(['npc_keeper.corrupt']);
  });
});

/**
 * J-10 AMENDED BY CAUSE (the chair's ruling, 2026-11-08, on ALLEGIANCE-CAR3's band census): THE ROUND-ROBIN DEAL.
 * The remainder is dealt around the pool's handlers, never piled on the last — no handler of a pool carries more than
 * ceil(the pool's agents / its handlers). Read on the raw record: each agent's pool is its allegiance's power (else the
 * houses), and the pool's handler count is the distinct handlers its agents were dealt (a pool deals to its first
 * min(agents, handlers) handlers, so that count is the pool size the deal used).
 * @param {any} s @returns {string[]}
 */
export function roundRobinFindings(s) {
  const pools = new Map();
  for (const n of s?.npcs || []) {
    const a = n?.allegiance;
    if (!a || typeof a.handler !== 'string') continue;
    const key = a.power ? `power:${a.power}` : 'houses';
    if (!pools.has(key)) pools.set(key, new Map());
    const load = pools.get(key);
    load.set(a.handler, (load.get(a.handler) || 0) + 1);
  }
  const out = [];
  for (const [key, load] of pools) {
    const agents = [...load.values()].reduce((x, y) => x + y, 0);
    const cap = Math.ceil(agents / load.size);
    for (const [h, n] of load) if (n > cap) out.push(`J-10 ${key}: handler ${h} carries ${n} of ${agents} agents over ${load.size} handlers (cap ${cap})`);
  }
  return out;
}

describe('J-10 amended — the round-robin deal (no handler above ceil(agents / handlers) in its pool)', () => {
  it('holds on every town of the slice, and the slice holds a pool with more agents than handlers (anti-vacuity)', async () => {
    const towns = await born();
    expect(towns.flatMap(({ i, s }) => roundRobinFindings(s).map((f) => `soak1k-${i} ${f}`))).toEqual([]);
    const crowded = towns.filter(({ s }) => {
      const per = new Map();
      for (const n of s.npcs || []) if (n?.allegiance?.handler) { const k = n.allegiance.power || 'houses'; per.set(k, (per.get(k) || new Set()).add(n.allegiance.handler)); }
      const agents = new Map();
      for (const n of s.npcs || []) if (n?.allegiance?.handler) { const k = n.allegiance.power || 'houses'; agents.set(k, (agents.get(k) || 0) + 1); }
      return [...agents].some(([k, a]) => a > 2 * per.get(k).size);
    });
    expect(crowded.length).toBeGreaterThan(0);
  }, 300_000);

  // THE RESIDUE, RULED (the chair, 2026-11-08, vetoable by the owner): soak1k-537's shape — five agents, a pool of ONE
  // non-boss handler (the guild's second) and the boss sitting out under J-10's boss-last rule. The boss joins the round
  // ONLY when every other handler would otherwise carry more than ALLEGIANCE_TUNING.bossJoinsAbove (4): the fallback sense
  // of boss-last and nothing more. (soak1k-849 — the boss the town's only criminal face — is supply-bound: named in the record.)
  it('the boss joins the round only when every other handler would carry more than 4 (a planted 537-shaped record)', async () => {
    const { assignHandlers } = await import('../../../src/domain/people/allegiance.js');
    const settlement = {
      institutions: [{ name: 'Street gang' }, { name: 'Front businesses' }],
      powerStructure: { factions: [{ faction: 'Town Council', power: 70, isGoverning: true }, { faction: "Thieves' Guild", power: 30, category: 'criminal' }] },
    };
    const boss = { id: 'boss', institution: { kind: 'house', key: 'Street gang' }, memberships: [{ power: "Thieves' Guild", rank: 1, share: 1 }] };
    const second = { id: 'second', institution: { kind: 'house', key: 'Front businesses' }, memberships: [{ power: "Thieves' Guild", rank: 2, share: 0.7 }] };
    const agent = (i) => ({ id: `a${i}`, institution: { kind: 'house', key: `House ${i}` }, memberships: [],
      allegiance: { power: "Thieves' Guild", house: 'Street gang', vector: 'greed', via: 'retainer', handler: null, share: 0.15, veiled: true, covert: true } });
    const deal = (n) => { const cards = [boss, second, ...Array.from({ length: n }, (_, i) => agent(i))].map((c) => JSON.parse(JSON.stringify(c))); assignHandlers(cards, settlement); return cards.filter((c) => c.allegiance).map((c) => c.allegiance.handler); };
    const load = (hs) => hs.reduce((m, h) => ((m[h] = (m[h] || 0) + 1), m), {});
    // five agents: the second alone would carry 5 > 4, so the boss joins the round
    expect(load(deal(5))).toEqual({ second: 3, boss: 2 });
    // four agents: the second carries 4, not more than 4 — the boss stays out (boss-last holds)
    expect(load(deal(4))).toEqual({ second: 4 });
  });

  it('the control: ten agents piled on the last of six handlers read as a finding', () => {
    const npcs = Array.from({ length: 15 }, (_, i) => ({ id: `a${i}`, allegiance: { power: 'G', handler: `h${Math.min(i, 5)}` } }));
    expect(roundRobinFindings({ npcs }).length).toBe(1);
  });
});

describe('I-13 — keyed determinism: removing a card moves no other card\'s roll', () => {
  it('the deal over a born cast with one card removed leaves every other card\'s allegiance byte-identical', async () => {
    const { dealAllegiances } = await import('../../../src/domain/people/allegiance.js');
    const { createPRNG } = await import('../../../src/kernel/prng.js');
    const rows = await born();
    let compared = 0; let agents = 0;
    for (const { i, s } of rows.slice(0, 16)) {
      const strip = () => JSON.parse(JSON.stringify(s.npcs || [])).map((n) => { delete n.allegiance; return n; });
      const settlement = { institutions: s.institutions, powerStructure: s.powerStructure, economicState: s.economicState };
      const whole = strip();
      dealAllegiances(settlement, whole, createPRNG(`allegiance-i13-${i}`));
      // remove a card that is no criminal face (a crim-house face's removal may lawfully re-name an agent's power)
      const k = whole.findIndex((n) => n?.institution?.kind === 'house' && !(s.institutions || []).some((inst) => inst.name === n.institution.key && isCriminalInstitution(inst)));
      if (k < 0) continue;
      const less = strip(); const goneId = less[k].id; less.splice(k, 1);
      dealAllegiances(settlement, less, createPRNG(`allegiance-i13-${i}`));
      const pick = (n) => (n.allegiance ? { house: n.allegiance.house, vector: n.allegiance.vector, via: n.allegiance.via, power: n.allegiance.power } : null);
      for (const n of less) {
        const twin = whole.find((w) => w.id === n.id);
        expect(pick(n), `soak1k-${i}: ${n.id} after removing ${goneId}`).toEqual(pick(twin));
        compared += 1; if (n.allegiance) agents += 1;
      }
    }
    expect(compared).toBeGreaterThan(200);
    expect(agents, 'the comparison covers agents').toBeGreaterThan(10);
  }, 300_000);
});

describe('the front census — the trade families J-7 does not name (listed for the chair)', () => {
  it('every Crafts, Economy and Entertainment family is PRIME, FRONT, or on this list by name', async () => {
    const { frontClassOfInstitution } = await import('../../../src/data/institutionalCatalog.js');
    const unnamed = INSTITUTION_FAMILIES
      .filter((f) => ['Crafts', 'Economy', 'Entertainment'].includes(f.shelf))
      .map((f) => familyNamesByTier(f).map((x) => x.name))
      .filter((names) => !names.some((name) => frontClassOfInstitution({ name })))
      .map((names) => names[names.length - 1]);
    expect(unnamed).toEqual(UNNAMED_TRADE_FAMILIES);
  });
});

/**
 * The trade families J-7's table does not name: NOT front-capable by its default, listed FOR THE CHAIR (60, measured at
 * the cause commit; each by its highest tier's name). Notable for a ruling: the taverns (an alehouse family, not the
 * inn family J-7 names), the docks, the auction house, the gambling district, the brothels.
 */
const UNNAMED_TRADE_FAMILIES = [
  "Farmland",
  "Common grazing land",
  "Communal root cellar",
  "Fisher's landing",
  "Fishmonger",
  "Shepherd",
  "Dairy farmer",
  "Beekeeper",
  "Wildfowler",
  "Woodcutter's camp",
  "Peat cutter",
  "Mine",
  "Stone quarry",
  "Salt works",
  "Hunter's lodge",
  "District markets (5-10)",
  "Multiple market squares",
  "Major annual fairs",
  "International trade center",
  "Taverns (5-20)",
  "Carriers' guild",
  "Pack animal trader",
  "Post relay station",
  "River ferry",
  "River boatyard",
  "Shipyard",
  "Barge and river transport company",
  "Docks/port facilities",
  "Harbour master's office",
  "Customs house",
  "State granary complex",
  "Slave market",
  "Slave market district",
  "Auction house",
  "Assay office",
  "Mint (official)",
  "Listening post",
  "Chroniclers' exchange",
  "Maltster",
  "Jeweller",
  "Thatcher",
  "Apothecary district",
  "Bowyers & fletchers (guild)",
  "Fuller",
  "Midwife",
  "Woodcarver",
  "Village scribe",
  "Printing house",
  "Cartographer's guild",
  "Alchemist quarter",
  "Traveling performers",
  "Opera house",
  "Bardic college",
  "Gambling district",
  "Brothel (red light district)",
  "Red light district",
  "Fighting pits",
  "Gladiatorial school",
  "Colosseum/arena",
  "Charlatan fortune tellers",
];
