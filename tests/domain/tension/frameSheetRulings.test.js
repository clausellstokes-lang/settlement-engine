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
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet } from '../../../src/domain/summary/tonightSheet.js';
import { castTroubleFrame, FRAME_REASONS, FRAME_STANDING_TIES } from '../../../src/domain/tension/troubleCast.js';
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
