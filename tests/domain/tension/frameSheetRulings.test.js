/**
 * tests/domain/tension/frameSheetRulings.test.js — THE CHAIR'S RULINGS ON THE SIX SHEETS, EACH ITS OWN COUNT ON THE POOL'S
 * 63 FRAMED OWNER SHEETS (FRAME-6 · F1–F5; the chair's message of 2026-11-20 15:35 UTC, each vetoable by the owner; brief:
 * docs/chair/2026-11-20/content/frame6/F1-F5-SHEET-RULINGS.md).
 *
 * THE POOL: the 330-town calm pool (`frame-calm-<tier>-<i>`, frame6/tools/pool.mjs 55: tried 484, calm 330), and of it the
 * 63 towns whose OWNER's Tonight sheet is framed (thorp 0, hamlet 8, village 15, town 7, city 14, metropolis 19), measured
 * at the base `038186160` (`frame6/F1-F5-RESULTS.md` holds the script). Each is born fresh here by the generator, as the
 * pool was.
 *
 *   F1 — the ladder is taken in order on a side that IS a power: its own free office-holder, then its own free member,
 *        then a person tied to one of its members by a tie of standing (FRAME_STANDING_TIES); the hash chooses only
 *        within a rung. A person with no membership and no such tie is never printed on a power's row. Count: such sides
 *        9 at the base -> 0.
 *   F2 — an empty side yields before the caps: a side that IS a power and would stand empty takes that power's first
 *        live person by rank whom no side holds, even one the record names by role (`isOfficeStandIn`) and even beyond
 *        `FRAME_TUNING.officeSidesMax`; she is printed by that name alone. Count: such sides 1 at the base, 2 after F1
 *        (village-75), -> 0.
 *   F5R — the seat's holder is a printed line on every framed sheet (FRAME-7 · F5R, the chair's ruling (a) of 17:45 UTC;
 *        brief frame6/F5R-SEAT-LINE.md): where the holder the calm sheet voices stands on no side, the owner's framed
 *        sheet carries him in its own field `seat` (his name and his office, the calm sheet's own seat row's), printed by
 *        the one line `seatLineOf`; the people to voice stay the sides' faces. Count: framed owner sheets whose holder is
 *        printed nowhere (no face, no seat line), 32 at the base 90874e392 (W3 16, W2 12, W4 3, W1 1) -> 0. The
 *        renderers are held in tests/components/tonightSeatLine.test.jsx.
 *   F3 — a W3 sheet says what is short (FRAME-8 · F3; the chair's ruling 45, 17:12 UTC, and its words of 22:02 UTC, each
 *        vetoable by the owner; brief frame8/F3F4-BUILD.md, lines frame8/F3F4-LINES.txt): under Facts, a third row,
 *        "Supply", names the FIRST impaired chain in the record's own order by its printed name, its source and its cause
 *        (`domain/display/chainCauseShown.js`), and where more chains are impaired, the count of the rest in digits.
 *        Count: W3 owner sheets naming the impaired resource, 0 of 26 at the base a42e90d89 -> 26.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet, seatLineOf, TONIGHT_COPY } from '../../../src/domain/summary/tonightSheet.js';
import { castTroubleFrame, FRAME_REASONS, FRAME_STANDING_TIES } from '../../../src/domain/tension/troubleCast.js';
import { chainPrintName } from '../../../src/domain/display/chainPrintName.js';
import { chainSourceOf } from '../../../src/domain/display/chainHouses.js';
import { SUPPLY_CHAIN_NEEDS } from '../../../src/data/supplyChainData.js';
import { FRAME_TUNING } from '../../../src/domain/tension/sideArchetypes.js';
import { membersByRank } from '../../../src/domain/people/membership.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

const OWNER = Object.freeze({ audience: 'owner' });

/** The 63 framed owner sheets of the calm pool, by tier and seed index (measured at the base 038186160). */
const FRAMED = Object.freeze({
  hamlet: [7, 17, 19, 35, 49, 62, 73, 74],
  village: [0, 5, 10, 20, 35, 38, 40, 45, 48, 49, 53, 58, 75, 76, 81],
  town: [1, 20, 33, 56, 68, 74, 80],
  city: [8, 12, 14, 22, 23, 25, 27, 30, 33, 35, 45, 49, 52, 57],
  metropolis: [1, 5, 8, 12, 14, 19, 21, 22, 39, 44, 48, 51, 53, 56, 57, 59, 64, 66, 68],
});
const TOWNS = Object.entries(FRAMED).flatMap(([tier, at]) => at.map((i) => {
  const seed = `frame-calm-${tier}-${i}`;
  return { seed, tier, s: generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} }) };
}));
const bySeed = (seed) => /** @type {{ s: any }} */ (TOWNS.find((t) => t.seed === seed)).s;

/** @param {unknown} v */
const str = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
/** @param {any} n */
const idOf = (n) => str(n.id) || str(n.name);

/**
 * Every side of a framed town that IS a power (its words, as the record holds them, are a power's name), with its face.
 * @param {any} s
 */
function powerSidesOf(s) {
  const cast = castTroubleFrame(s);
  if (!cast) return [];
  const raws = s.history.currentTensions[cast.at].factions.map(str).slice(0, 3);
  const powers = (s.powerStructure?.factions || []).filter((f) => f && str(f.faction));
  return cast.sides.map((side, i) => ({ side, power: powers.find((p) => str(p.faction) === raws[i]) })).filter((x) => x.power);
}

/**
 * F1's count over one town: the sides of a power voiced by a person who is no member of it and stands with none of its
 * members by a tie of standing (the record's own `type`, read here as written, not through the code under test).
 * @param {any} s
 */
function strangersOnAPowersRow(s) {
  const npcs = (s.npcs || []).filter((n) => n && typeof n === 'object');
  const standing = (s.relationships || []).filter((t) => t && ['ally', 'respect', 'mentor_student', 'family', 'patron_client'].includes(t.type));
  const tied = (a, b) => standing.some((t) => (t.from === a && t.to === b) || (t.from === b && t.to === a));
  return powerSidesOf(s).filter(({ side, power }) => {
    const f = side.face;
    if (!f || !f.npcId || f.kind === 'outsider') return false;
    const members = membersByRank(npcs, str(power.faction));
    return !members.some((m) => idOf(m) === f.npcId) && !members.some((m) => idOf(m) !== f.npcId && tied(f.npcId, idOf(m)));
  }).map(({ side }) => `${side.words} <- ${side.face.name} (${side.face.rule})`);
}

describe('the pool: 63 framed owner sheets', () => {
  it('every town of the list is calm and framed for the owner', () => {
    const failures = collectSeedFailures(TOWNS.map((t) => t.seed), (seed) => {
      const sheet = composeTonightSheet(bySeed(seed), OWNER);
      expect(sheet.crisis, `${seed} is calm`).toBe(null);
      expect(sheet.frame, `${seed} is framed`).toBeTruthy();
    });
    expectNoSeedFailures(failures, 'the 63 framed owner sheets');
    expect(TOWNS.length).toBe(63);
  }, 300000);
});

describe('F1: the ladder is taken in order on a power\'s side; the hash chooses only within a rung', () => {
  it('the ties of standing are the record\'s own kinds that stand WITH a member: never a rivalry, an enmity, leverage or a debt', () => {
    expect([...FRAME_STANDING_TIES]).toEqual(['ally', 'respect', 'mentor_student', 'family', 'patron_client']);
    for (const never of ['rival', 'enemy', 'political', 'debtor_creditor']) expectAbsentWithAnchor(FRAME_STANDING_TIES, never, 'ally', never);
    expect(FRAME_REASONS.member).toBe('because {they} [is|are] one of {power}');
  });

  it('frame-calm-town-20: "The Guard" is fronted by its own free office-holder, the watch captain, not the innkeeper', () => {
    const sheet = composeTonightSheet(bySeed('frame-calm-town-20'), OWNER);
    const guard = sheet.frame?.sides.find((x) => x.words === 'The Guard');
    expect(guard).toMatchObject({ name: 'Khurelbaatar Geniges', kind: 'office' });
    expect(sheet.people.map((p) => p.name)).toContain('Khurelbaatar Geniges');
  });

  it('over the 63: no side of a power is voiced by a person with no membership and no tie of standing (9 at the base -> 0)', () => {
    const found = TOWNS.flatMap(({ seed, s }) => strangersOnAPowersRow(s).map((x) => `${seed}: ${x}`));
    expect(found).toEqual([]);
  }, 300000);

  it('over the 63: a power\'s side is fronted by its office-holder, its member or one standing with a member, by rung', () => {
    const npcsOf = (s) => (s.npcs || []).filter((n) => n && typeof n === 'object');
    const failures = collectSeedFailures(TOWNS.map((t) => t.seed), (seed) => {
      const s = bySeed(seed);
      for (const { side, power } of powerSidesOf(s)) {
        const f = side.face;
        if (!f || !f.npcId) continue;
        const members = membersByRank(npcsOf(s), str(power.faction));
        const member = members.some((m) => idOf(m) === f.npcId);
        if (f.kind === 'member') expect(member && idOf(members[0]) !== f.npcId, `${seed}: ${side.words} member`).toBe(true);
        if (f.kind === 'tie') expect(member, `${seed}: ${side.words} tie`).toBe(false);
        expect(['office', 'member', 'tie', 'criminal'], `${seed}: ${side.words} ${f.kind}`).toContain(f.kind);
      }
    });
    expectNoSeedFailures(failures, 'a power\'s side takes its own rungs');
  }, 300000);
});

/**
 * F2's count over one town: the sides of a power that print no one while that power holds a live person (not temporary,
 * not ousted, named; one named by role counts) whom no side holds.
 * @param {any} s
 */
function emptyPowerSidesThatCouldYield(s) {
  const cast = castTroubleFrame(s);
  if (!cast) return [];
  const npcs = (s.npcs || []).filter((n) => n && typeof n === 'object' && !n.temporary && !n.ousted && str(n.name));
  const held = new Set(cast.sides.flatMap((x) => [x.face?.npcId, x.face?.viaId]).filter(Boolean));
  return powerSidesOf(s).filter(({ side, power }) => !side.face && membersByRank(npcs, str(power.faction)).some((m) => !held.has(idOf(m))))
    .map(({ side }) => side.words);
}

describe('F2: an empty side yields before the caps', () => {
  it('frame-calm-hamlet-17: "The Religious Authorities" is fronted by its head, the High Priestess, printed by her role alone', () => {
    const sheet = composeTonightSheet(bySeed('frame-calm-hamlet-17'), OWNER);
    const side = sheet.frame?.sides.find((x) => x.words === 'The Religious Authorities');
    expect(side).toMatchObject({ name: 'The High Priestess', role: '', kind: 'office', reason: 'because they head the Religious Authorities' });
    expect(sheet.people.map((p) => p.name)).toEqual(['Mustafa al-Malik', 'The High Priestess']);
  });

  it('frame-calm-village-75: the side F1 left empty takes its head beyond the office cap', () => {
    const side = composeTonightSheet(bySeed('frame-calm-village-75'), OWNER).frame?.sides.find((x) => x.words === 'The Religious Authorities');
    expect(side).toMatchObject({ name: 'Bayasgalan Geniges', kind: 'office', reason: 'because he heads the Religious Authorities' });
  });

  it('over the 63: no side of a power prints no one while its power holds a live person no side holds (1 at the base, 2 after F1 -> 0)', () => {
    const found = TOWNS.flatMap(({ seed, s }) => emptyPowerSidesThatCouldYield(s).map((w) => `${seed}: ${w}`));
    expect(found).toEqual([]);
  }, 300000);

  it('the office cap\'s meaning: officeSidesMax holds on every sheet but where a side would stand empty (2 of the 63)', () => {
    expect(FRAME_TUNING.officeSidesMax).toBe(1);
    const over = TOWNS.filter(({ s }) => (castTroubleFrame(s)?.sides || []).filter((x) => x.face?.kind === 'office').length > FRAME_TUNING.officeSidesMax).map((t) => t.seed);
    expect(over).toEqual(['frame-calm-hamlet-17', 'frame-calm-village-75']);
  }, 300000);
});

/**
 * The holder the calm sheet voices (the stranger's sheet is today's: its `seat` row), read here off that row, not through
 * the code under test. @param {any} s
 */
const calmSeatRowOf = (s) => composeTonightSheet(s).people.find((p) => p.why === 'seat');

/** The 32 framed owner sheets whose seat's holder stood on no side and so was printed nowhere at the base 90874e392. */
const SEAT_UNPRINTED_AT_BASE = Object.freeze([
  'frame-calm-hamlet-35', 'frame-calm-hamlet-49', 'frame-calm-village-20', 'frame-calm-village-58', 'frame-calm-town-1',
  'frame-calm-town-20', 'frame-calm-town-33', 'frame-calm-town-56', 'frame-calm-town-68', 'frame-calm-town-74',
  'frame-calm-town-80', 'frame-calm-city-8', 'frame-calm-city-14', 'frame-calm-city-22', 'frame-calm-city-25',
  'frame-calm-city-27', 'frame-calm-city-33', 'frame-calm-city-35', 'frame-calm-city-45', 'frame-calm-city-52',
  'frame-calm-city-57', 'frame-calm-metropolis-8', 'frame-calm-metropolis-19', 'frame-calm-metropolis-21',
  'frame-calm-metropolis-22', 'frame-calm-metropolis-48', 'frame-calm-metropolis-51', 'frame-calm-metropolis-56',
  'frame-calm-metropolis-57', 'frame-calm-metropolis-59', 'frame-calm-metropolis-64', 'frame-calm-metropolis-68',
]);

describe('F5R: the seat\'s holder is a printed line on every framed sheet', () => {
  it('frame-calm-city-14: the holder, on no side of the crime wave, is the sheet\'s seat by name and office, in one line', () => {
    const s = bySeed('frame-calm-city-14');
    const row = calmSeatRowOf(s);
    expect(row).toMatchObject({ name: 'Saoirse O\'Meara', role: 'First Magnate' });
    const sheet = composeTonightSheet(s, OWNER);
    expect(sheet.frame?.sides.map((x) => x.name).includes(row.name)).toBe(false);
    expect(sheet.seat).toEqual({ name: row.name, role: row.role, sourcePath: row.sourcePath });
    expect(seatLineOf(/** @type {any} */ (sheet.seat))).toBe('Holds the seat: Saoirse O\'Meara, First Magnate.');
    // one hat: the office, never the house's trade the card also carries
    const card = s.npcs[Number(row.sourcePath.match(/\d+/)[0])];
    expect(card.title).toBe('the senior guild master');
    expect(seatLineOf(/** @type {any} */ (sheet.seat)).includes(card.title)).toBe(false);
    // the people to voice stay the sides' faces
    expect(sheet.people.length).toBeGreaterThan(0);
    expect(sheet.people.every((p) => p.why === 'side')).toBe(true);
  });

  it('over the 63: no framed owner sheet leaves the seat\'s holder unprinted (32 at the base -> 0)', () => {
    const unprinted = TOWNS.filter(({ s }) => {
      const row = calmSeatRowOf(s);
      const sheet = composeTonightSheet(s, OWNER);
      return !!row && !sheet.frame?.sides.some((x) => x.name === row.name) && sheet.seat?.name !== row.name;
    }).map((t) => t.seed);
    expect(unprinted).toEqual([]);
  }, 300000);

  it('over the 63: the holder is printed once: on his side where he is a face, else in the seat line, by the calm row\'s name and office', () => {
    const failures = collectSeedFailures(TOWNS.map((t) => t.seed), (seed) => {
      const s = bySeed(seed);
      const row = calmSeatRowOf(s);
      expect(row, `${seed}: the calm sheet voices a holder`).toBeTruthy();
      const sheet = composeTonightSheet(s, OWNER);
      const face = /** @type {any} */ (sheet.frame).sides.some((/** @type {any} */ x) => x.name === row.name);
      if (face) expect('seat' in sheet, `${seed}: a face takes no seat line`).toBe(false);
      else {
        expect(sheet.seat, `${seed}: the calm row's name, office and source`).toEqual({ name: row.name, role: row.role, sourcePath: row.sourcePath });
        expect(seatLineOf(/** @type {any} */ (sheet.seat)), `${seed}: the one line`).toBe(`${TONIGHT_COPY.seat}: ${[row.name, row.role].filter(Boolean).join(', ')}.`);
      }
      expect(sheet.people.every((p) => p.why === 'side'), `${seed}: the people to voice are the sides' faces`).toBe(true);
    });
    expectNoSeedFailures(failures, 'the seat\'s holder is printed once on every framed sheet');
    expect(TOWNS.filter(({ s }) => 'seat' in composeTonightSheet(s, OWNER)).map((t) => t.seed)).toEqual(SEAT_UNPRINTED_AT_BASE);
  }, 300000);

  it('over the 63: the stranger\'s sheet is today\'s: no frame, no seat line, the holder among its people to voice', () => {
    const failures = collectSeedFailures(TOWNS.map((t) => t.seed), (seed) => {
      const sheet = composeTonightSheet(bySeed(seed));
      expect(sheet.people.some((p) => p.why === 'seat'), `${seed}: the holder voiced`).toBe(true);
      expect('seat' in sheet || 'frame' in sheet, `${seed}: no seat line, no frame`).toBe(false);
    });
    expectNoSeedFailures(failures, 'the stranger\'s sheet carries no seat line');
  }, 300000);
});

/**
 * F3's row over one town, re-derived here from the record (not through the sheet): the impaired chains in the record's own
 * order, the first one's printed name and source and its `resourceCondition`, the count of the rest. Null where none.
 * @param {any} s
 */
function supplyRowOf(s) {
  const impaired = (s.economicState?.activeChains || []).filter((c) => c && c.status === 'impaired');
  if (!impaired.length) return null;
  const first = impaired[0];
  const printed = chainPrintName(first, s);
  const rest = impaired.length - 1;
  return `${printed.label}: ${chainSourceOf(first, printed)} (${first.resourceCondition})${rest ? `; ${rest} more impaired` : ''}.`;
}

/** The 26 W3 sheets of the 63 (the trouble of weight's strain, W3: every one an impaired chain), measured at a42e90d89. */
const W3_SHEETS = Object.freeze([
  'frame-calm-hamlet-7', 'frame-calm-hamlet-35', 'frame-calm-hamlet-49', 'frame-calm-village-20', 'frame-calm-town-1',
  'frame-calm-town-33', 'frame-calm-town-56', 'frame-calm-town-68', 'frame-calm-town-74', 'frame-calm-city-22',
  'frame-calm-city-23', 'frame-calm-city-27', 'frame-calm-city-30', 'frame-calm-city-52', 'frame-calm-metropolis-1',
  'frame-calm-metropolis-5', 'frame-calm-metropolis-12', 'frame-calm-metropolis-14', 'frame-calm-metropolis-21',
  'frame-calm-metropolis-22', 'frame-calm-metropolis-39', 'frame-calm-metropolis-44', 'frame-calm-metropolis-48',
  'frame-calm-metropolis-53', 'frame-calm-metropolis-57', 'frame-calm-metropolis-59',
]);

describe('F3: a W3 sheet says what is short', () => {
  it('frame-calm-village-20 (one chain impaired): "Supply Leather & Hides: Hunting grounds (depleted)." under Facts, and no count', () => {
    const sheet = composeTonightSheet(bySeed('frame-calm-village-20'), OWNER);
    expect(sheet.facts.map((f) => f.id)).toEqual(['food', 'defence', 'supply']);
    expect(sheet.facts[2]).toEqual({ id: 'supply', label: 'Supply', text: 'Leather & Hides: Hunting grounds (depleted).', sourcePath: 'economicState.activeChains[0]' });
  });

  it('frame-calm-city-22 (five chains impaired): the first in the record\'s order, then the count of the rest in digits', () => {
    const sheet = composeTonightSheet(bySeed('frame-calm-city-22'), OWNER);
    expect(sheet.facts.find((f) => f.id === 'supply')).toEqual({ id: 'supply', label: 'Supply', text: 'Alchemy & Reagents: Magical ley line node (depleted); 4 more impaired.', sourcePath: 'economicState.activeChains[0]' });
  });

  it('over the 63: every W3 owner sheet names its impaired resource (0 of 26 at the base -> 26), and no other sheet carries the row', () => {
    const failures = collectSeedFailures(TOWNS.map((t) => t.seed), (seed) => {
      const s = bySeed(seed);
      const sheet = composeTonightSheet(s, OWNER);
      const row = sheet.facts.find((f) => f.id === 'supply');
      if (W3_SHEETS.includes(seed)) {
        expect(castTroubleFrame(s)?.strain, `${seed}: W3`).toBe('W3');
        expect(row?.label, `${seed}: the row's label`).toBe(TONIGHT_COPY.supply);
        expect(row?.text, `${seed}: the first impaired chain, its source and cause, the count of the rest`).toBe(supplyRowOf(s));
      } else expect(row, `${seed}: no Supply row off W3`).toBeUndefined();
      // the two facts every reader gets are unchanged: the stranger's, row for row
      expect(sheet.facts.slice(0, 2), `${seed}: Food and Defence are the stranger's`).toEqual(composeTonightSheet(s).facts);
    });
    expectNoSeedFailures(failures, 'the Supply row stands on every W3 owner sheet and on no other');
    expect(TOWNS.filter(({ s }) => composeTonightSheet(s, OWNER).facts.some((f) => f.id === 'supply')).map((t) => t.seed)).toEqual(W3_SHEETS);
    // both forms are on the pool: one chain (no count) and several (the count)
    const texts = W3_SHEETS.map((seed) => /** @type {string} */ (supplyRowOf(bySeed(seed))));
    expect(texts.filter((t) => !t.includes('more impaired')).length).toBe(5);
    expect(texts.filter((t) => / \d+ more impaired\.$/.test(t)).length).toBe(21);
  }, 300000);

  it('over the 63: the stranger\'s sheet carries no Supply row', () => {
    const carrying = TOWNS.filter(({ s }) => composeTonightSheet(s).facts.some((f) => f.id === 'supply')).map((t) => t.seed);
    expect(carrying).toEqual([]);
  }, 300000);

  it('a criminal chain is never the row\'s chain: every chain of the criminal economy draws on no ground (no source, no cause)', () => {
    const chains = SUPPLY_CHAIN_NEEDS.criminal_economy.chains;
    expect(chains.map((c) => c.id)).toEqual(['smuggling', 'black_market', 'guild_crime', 'slave_trade']);
    for (const c of chains) expect(c.resource, c.id).toBe(null);
  });
});
