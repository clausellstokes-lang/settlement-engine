/**
 * tests/domain/tension/troubleCast.test.js — A CALM TOWN'S TROUBLE OF WEIGHT AND THREE PEOPLE ON ITS SIDES (FRAME-1, the
 * seventh chair's CF1, CF2, CF4, CF6; FRAME-2 · B2, CF11). The trouble is a tension ABOUT a graded strain the town holds,
 * the sharpest grade first and the record's order breaking a tie (its `severity` is never read). Over born calm towns
 * that carry one: every face is a person (or a house) on the record, with a reason from the closed set, filled;
 * an outsider is never named and is reached through a person on the record; the caps hold (one side by office, the
 * seat-holder on one side, nobody on two); the cast is pure (same record in, same frame out) and stores nothing; and
 * the owner's variety shows: the seat-holder, a power's head and a force's commander are not the usual three.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { readFileSync } from 'node:fs';
import { castTroubleFrame, troubleOfWeight, fillReason, FRAME_REASONS, templateLabelOf, WEIGHT_GRADES, WEIGHT_MATTER } from '../../../src/domain/tension/troubleCast.js';
import { LEGITIMACY_CUTS } from '../../../src/data/bandLadders.js';
import { SIDE_ARCHETYPE } from '../../../src/domain/tension/sideArchetypes.js';
import { rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

/**
 * Born calm towns that CARRY a trouble of weight, ten of each tier where the tier births one (CF11, measured over
 * `frame-cast-<tier>-<i>`): before CF11 this pool was the first ten calm births of each tier, every one framed by its
 * sharpest severity; under CF11 most calm towns keep today's sheet, so the pool is re-seated to the births that frame
 * (hamlet 4 and village 1 of their first 40 calm births do; no calm thorp of the 28 here, nor of the 55 of the CF11
 * measure, holds a trouble of weight, so the tier has none to cast). RE-SEATED at FRAME-2 · B9 (W2 as written: a high
 * conflict weighs only where both its powers are the tension's sides), by the same measure, the first ten calm births of
 * each tier that cast a frame: town 67, city 9, 19 and 21, and metropolis 2, 6, 13, 15 and 17 no longer do; hamlet and
 * village are unchanged.
 */
const FRAMED = Object.freeze({
  hamlet: [11, 23, 29, 36, 42, 45, 46, 52, 70, 77],
  village: [19, 42, 43, 50, 54, 56, 65, 69, 74, 82],
  town: [15, 36, 37, 40, 50, 59, 112, 113, 119, 134],
  city: [1, 2, 6, 14, 18, 20, 23, 27, 38, 40],
  metropolis: [1, 3, 5, 7, 18, 19, 25, 31, 41, 44],
});
const TOWNS = Object.entries(FRAMED).flatMap(([tier, at]) => at.map((i) => {
  const seed = `frame-cast-${tier}-${i}`;
  return { seed, tier, s: generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} }) };
}));
/** Every reason the closed set can print, as a pattern over its filled text. */
const REASON_PATTERNS = Object.values(FRAME_REASONS).map((r) => new RegExp(`^${r
  .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  .replace(/\\\[[^\]]*\\\]/g, '\\w+')
  .replace(/\\\{(?:they|their|them)\\\}/g, '(?:she|he|they|her|his|their|him|them)')
  .replace(/\\\{\w+\\\}/g, '.+?')}$`));

/** A calm record built by hand: one governing power, legitimacy 60, food Secure, no conflict, no impaired chain. */
const town = ({ tensions, score = 60, conflicts = [], food = 'Secure', chains = [], powers = [] }) => ({
  history: { currentTensions: tensions.map(([type, ...factions]) => ({ type, factions, description: type, severity: ['minor'] })) },
  powerStructure: { publicLegitimacy: { score, govMultiplier: 1 }, factions: [{ faction: 'Elder Council', power: 60, isGoverning: true }, ...powers], conflicts },
  economicState: { foodSecurity: { label: food }, activeChains: chains },
});
const SIDES = ['a', 'b', 'c'];
const grade = (s) => troubleOfWeight(s)?.strain.grade ?? null;

describe('the trouble of weight (CF11)', () => {
  it('the edges are the legitimacy ladder\'s own cuts, cited: below 30 and below 45 (a score AT a cut is in the band above)', () => {
    expect([LEGITIMACY_CUTS.contested, LEGITIMACY_CUTS.tolerated]).toEqual([30, 45]);
    const seatTrouble = (score) => grade(town({ score, tensions: [['succession_crisis', ...SIDES]] }));
    expect([29, 30, 44, 45, 60].map(seatTrouble)).toEqual(['legitimacy-below-30', 'legitimacy-below-45', 'legitimacy-below-45', null, null]);
  });

  it('a strain alone is not weight: only a tension ABOUT a strain the town holds makes it so', () => {
    // legitimacy below 45 with no tension about the seat
    expect(troubleOfWeight(town({ score: 40, tensions: [['crime_wave', ...SIDES], ['great_fire', ...SIDES]] }))).toBe(null);
    // a high conflict no side names
    expect(troubleOfWeight(town({ conflicts: [{ parties: ['Merchant Guilds', 'Craft Guilds'], intensity: 'high' }], tensions: [['crime_wave', ...SIDES]] }))).toBe(null);
    // an impaired chain with no material tension
    expect(troubleOfWeight(town({ chains: [{ status: 'impaired' }], tensions: [['guild_conflict', ...SIDES], ['economic_disparity', ...SIDES]] }))).toBe(null);
    // a tension about a strain the town does NOT hold
    expect(troubleOfWeight(town({ tensions: [['succession_crisis', ...SIDES], ['trade_dispute', ...SIDES]] }))).toBe(null);
    expect(troubleOfWeight({ history: { currentTensions: [] } })).toBe(null);
  });

  it('the closed lists: the seat\'s matters, the material matters, and a conflict only at intensity high, by sides naming BOTH its parties', () => {
    for (const type of WEIGHT_MATTER.seat) expect(grade(town({ score: 40, tensions: [[type, ...SIDES]] })), type).toBe('legitimacy-below-45');
    for (const type of WEIGHT_MATTER.material) expect(grade(town({ chains: [{ status: 'impaired' }], tensions: [[type, ...SIDES]] })), type).toBe('impaired-chain');
    const row = (intensity) => [{ parties: ["Thieves' Guild", 'Military/Guard'], intensity }];
    expect(grade(town({ conflicts: row('moderate'), tensions: [['crime_wave', 'Military/Guard', 'b', "Thieves' Guild"]] }))).toBe(null);
    // FRAME-2 · B9, W2 as written: one of the row's powers a side is not enough; both must be
    expect(grade(town({ conflicts: row('high'), tensions: [['crime_wave', 'a', 'b', "the Thieves' Guild"]] }))).toBe(null);
    expect(grade(town({ conflicts: row('high'), tensions: [['crime_wave', 'Military/Guard', 'b', 'c']] }))).toBe(null);
    const high = troubleOfWeight(town({ conflicts: row('high'), tensions: [['crime_wave', 'Military/Guard', 'b', "the Thieves' Guild"]] }));
    expect(high).toMatchObject({ at: 0, strain: { strain: 'W2', grade: 'high-conflict', powers: ["Thieves' Guild", 'Military/Guard'] } });
  });

  it('a corruption scandal is about the seat only where its own sides name the ruling power (the generator writes "Corrupt officials" as it)', () => {
    expect(grade(town({ score: 40, tensions: [['corruption_scandal', 'Elder Council', 'Reformers', 'Complicit beneficiaries']] }))).toBe('legitimacy-below-45');
    expect(grade(town({ score: 40, tensions: [['corruption_scandal', 'Corrupt officials', 'Reformers', 'Complicit beneficiaries']] }))).toBe(null);
    const gen = readFileSync(new URL('../../../src/generators/historyGenerator.js', import.meta.url), 'utf8');
    expect(gen).toContain('.replace(/Corrupt officials/g, govFaction)');
  });

  it('food below Secure and a creditor power on the roster are material strains (the names the indebted stress pushes)', () => {
    for (const food of ['Pressured', 'Import-Dependent', 'Deficit', 'Deficit — Active Famine']) expect(grade(town({ food, tensions: [['resource_scarcity', ...SIDES]] })), food).toBe('food-below-secure');
    expect(grade(town({ food: 'Surplus', tensions: [['resource_scarcity', ...SIDES]] }))).toBe(null);
    for (const faction of ["Creditor's Representative", 'Crown Creditors (Noble Coalition)']) {
      expect(grade(town({ powers: [{ faction, power: 18 }], tensions: [['outside_debt', ...SIDES]] })), faction).toBe('creditor-power');
    }
    const src = readFileSync(new URL('../../../src/generators/power/stressFactions.js', import.meta.url), 'utf8');
    expect(src).toContain("'Crown Creditors (Noble Coalition)' : \"Creditor's Representative\"");
  });

  it('the sharpest grade opens the sheet, over the record\'s order; the record\'s order breaks a tie; severity is never read', () => {
    const conflicts = [{ parties: ['Merchant Guilds', 'Craft Guilds'], intensity: 'high' }];
    const chains = [{ status: 'impaired' }];
    const s = town({ score: 40, conflicts, chains, tensions: [['trade_dispute', ...SIDES], ['economic_disparity', 'Merchant Guilds', 'Craft Guilds', 'c'], ['tyranny', ...SIDES], ['succession_crisis', ...SIDES]] });
    expect(troubleOfWeight(s)).toMatchObject({ at: 2, strain: { strain: 'W1', grade: 'legitimacy-below-45' } });
    const noSeat = town({ conflicts, chains, tensions: [['trade_dispute', ...SIDES], ['economic_disparity', 'Merchant Guilds', 'Craft Guilds', 'c']] });
    expect(troubleOfWeight(noSeat)).toMatchObject({ at: 1, strain: { grade: 'high-conflict' } });
    const sharper = { ...s, history: { currentTensions: s.history.currentTensions.map((t, i) => ({ ...t, severity: i === 0 ? ['catastrophic'] : ['minor'] })) } };
    expect(troubleOfWeight(sharper)?.at).toBe(2);
    expect(WEIGHT_GRADES.flat()).toEqual(['legitimacy-below-30', 'seat-ungated', 'legitimacy-below-45', 'high-conflict', 'food-below-secure', 'creditor-power', 'impaired-chain']);
  });

  it('on born towns the cast opens on the trouble of weight, and no tension about a sharper grade (or an equal one earlier) is passed over', () => {
    for (const { seed, s } of TOWNS) {
      const top = troubleOfWeight(s);
      expect(top, seed).not.toBe(null);
      expect(castTroubleFrame(s), seed).toMatchObject({ at: top.at, type: top.tension.type });
      const rank = (g) => WEIGHT_GRADES.findIndex((row) => row.includes(g));
      s.history.currentTensions.forEach((t, i) => {
        const own = troubleOfWeight({ ...s, history: { currentTensions: [t] } });
        if (!own) return;
        expect(rank(own.strain.grade) < rank(top.strain.grade) || (rank(own.strain.grade) === rank(top.strain.grade) && i < top.at), `${seed} #${i}`).toBe(false);
      });
    }
  });
});

describe('three people on its three sides (CF4, CF6)', () => {
  it(`${TOWNS.length} calm born towns: every face is on the record, every reason is from the closed set, the caps hold`, () => {
    const failures = collectSeedFailures(TOWNS.map((t) => t.seed), (seed) => {
      const { s } = TOWNS.find((t) => t.seed === seed);
      const frame = castTroubleFrame(s);
      if (s.stress && (!Array.isArray(s.stress) || s.stress.length)) throw new Error('a town of the pool is in crisis');
      if (!frame) throw new Error('a calm town with a trouble of weight has no frame');
      if (frame.sides.length !== 3) throw new Error(`${frame.sides.length} sides`);
      const ids = new Set(s.npcs.map((n) => n.id || n.name));
      const seatName = rulingChainOf(s).npc?.name;
      const named = [];
      let office = 0;
      let seat = 0;
      frame.sides.forEach((side, i) => {
        if (side.label !== templateLabelOf(frame.type, i, s.history.currentTensions[frame.at].factions[i])) throw new Error('label');
        if (SIDE_ARCHETYPE[side.label] !== side.archetype) throw new Error(`${side.label} is not classed ${side.archetype}`);
        const f = side.face;
        if (!f) return;
        if (!REASON_PATTERNS.some((re) => re.test(f.reason))) throw new Error(`reason "${f.reason}" is not one of FRAME_REASONS`);
        if (/[{}[\]]/.test(f.reason)) throw new Error(`reason "${f.reason}" left a slot unfilled`);
        if (f.kind === 'outsider') {
          if (f.npcId || f.name) throw new Error('an outsider is named');
          if (!ids.has(f.viaId)) throw new Error('an outsider is reached through no one on the record');
          if (!f.reason.includes(f.viaName)) throw new Error('the reach does not name its keeper');
          return;
        }
        if (f.npcId) {
          if (!ids.has(f.npcId)) throw new Error(`${f.name} is not on the record`);
          named.push(f.npcId);
          if (f.name === seatName) seat += 1;
        } else if (f.rule !== 'criminalHouse') throw new Error('a face with no person that is not a house');
        if (f.kind === 'office') office += 1;
      });
      if (new Set(named).size !== named.length) throw new Error('one person holds two sides');
      if (office > 1) throw new Error(`${office} sides by office`);
      if (seat > 1) throw new Error(`the seat-holder fronts ${seat} sides`);
    });
    expectNoSeedFailures(failures, 'the trouble cast over the calm towns');
  }, 300000);

  it('pure: the same record casts the same frame, and the record is not touched (CF2: nothing stored)', () => {
    for (const { s } of TOWNS.slice(0, 12)) {
      const before = JSON.stringify(s);
      const a = castTroubleFrame(s);
      const b = castTroubleFrame(JSON.parse(before));
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
      expect(JSON.stringify(s)).toBe(before);
    }
  });

  it('fails closed with no seed: a record a shared projection made (no `_seed`) casts no trouble (CF3)', () => {
    const { s } = TOWNS[0];
    const { _seed, ...shared } = s;
    expect(castTroubleFrame(shared)).toBe(null);
    expect(typeof _seed).toBe('string');
  });

  it('a person an active crisis\'s cast holds keeps that role and stands on no side', () => {
    const { s } = TOWNS.find(({ s: t }) => castTroubleFrame(t)?.sides.some((side) => side.face?.npcId));
    const held = castTroubleFrame(s).sides.find((side) => side.face?.npcId).face.npcId;
    const withCrisis = { ...s, stress: [{ type: 'famine', cast: { roles: [{ role: 'brunt', kind: 'npc', id: held }] } }] };
    // anchored: `held` was read off this same town's frame two lines above, so the member is live before the crisis takes them
    expect(castTroubleFrame(withCrisis).sides.map((side) => side.face?.npcId)).not.toContain(held);
  });

  it('the reasons read the person\'s own gender', () => {
    expect(fillReason(FRAME_REASONS.debtor, { gender: 'female' }, { other: 'the dean' })).toBe('because she owes the dean a debt not yet paid');
    expect(fillReason(FRAME_REASONS.debtor, { gender: 'male' }, { other: 'the dean' })).toBe('because he owes the dean a debt not yet paid');
    expect(fillReason(FRAME_REASONS.debtor, {}, { other: 'the dean' })).toBe('because they owe the dean a debt not yet paid');
    expect(fillReason(FRAME_REASONS.creditor, { gender: 'female' }, { other: 'Asa' })).toBe('because Asa owes her a debt not yet paid');
  });
});

describe('variety (the owner, 2026-11-20: "the lords appointee is not always the one")', () => {
  it('the seat-holder, a power\'s head and a force\'s commander together front under half the filled sides; ties, trades, outsiders and the criminal power front the rest', () => {
    const kinds = {};
    for (const { s } of TOWNS) {
      for (const side of castTroubleFrame(s).sides) {
        const f = side.face;
        const k = !f ? 'absent' : f.kind === 'office' ? 'office' : f.kind;
        kinds[k] = (kinds[k] || 0) + 1;
      }
    }
    const filled = Object.entries(kinds).filter(([k]) => k !== 'absent').reduce((n, [, v]) => n + v, 0);
    expect(kinds.office / filled).toBeLessThan(0.5);
    // and the seat still stands where the record puts it somewhere in the pool (the seat dial is live, not zeroed)
    expect(TOWNS.some(({ s }) => castTroubleFrame(s).sides.some((side) => side.face?.rule === 'seat'))).toBe(true);
    for (const k of ['tie', 'trade']) expect(kinds[k] || 0, k).toBeGreaterThan(0);
  });
});
