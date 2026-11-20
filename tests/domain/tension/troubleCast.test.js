/**
 * tests/domain/tension/troubleCast.test.js — A CALM TOWN'S SHARPEST TROUBLE AND THREE PEOPLE ON ITS SIDES (FRAME-1, the
 * seventh chair's CF1, CF2, CF4, CF6). Over born calm towns of every tier: the trouble is the record's sharpest by its
 * own severity and order; every face is a person (or a house) on the record, with a reason from the closed set, filled;
 * an outsider is never named and is reached through a person on the record; the caps hold (one side by office, the
 * seat-holder on one side, nobody on two); the cast is pure (same record in, same frame out) and stores nothing; and
 * the owner's variety shows: the seat-holder, a power's head and a force's commander are not the usual three.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { castTroubleFrame, sharpestTroubleOf, fillReason, FRAME_REASONS, templateLabelOf } from '../../../src/domain/tension/troubleCast.js';
import { SIDE_ARCHETYPE } from '../../../src/domain/tension/sideArchetypes.js';
import { rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SEV = { minor: 1, major: 2, catastrophic: 3 };
/** Born calm towns, `per` of each tier (a birth with a crisis is set aside). */
const calmTowns = (per) => {
  const out = [];
  for (const tier of TIERS) {
    for (let i = 0, got = 0; got < per && i < per * 4; i += 1) {
      const seed = `frame-cast-${tier}-${i}`;
      const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
      if (s.stress && (!Array.isArray(s.stress) || s.stress.length)) continue;
      out.push({ seed, tier, s });
      got += 1;
    }
  }
  return out;
};
const TOWNS = calmTowns(10);
/** Every reason the closed set can print, as a pattern over its filled text. */
const REASON_PATTERNS = Object.values(FRAME_REASONS).map((r) => new RegExp(`^${r
  .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  .replace(/\\\[[^\]]*\\\]/g, '\\w+')
  .replace(/\\\{(?:they|their|them)\\\}/g, '(?:she|he|they|her|his|their|him|them)')
  .replace(/\\\{\w+\\\}/g, '.+?')}$`));

describe('the sharpest standing trouble (CF1)', () => {
  it('is the tension whose severity admits the highest grade, the record\'s order breaking a tie', () => {
    const s = { history: { currentTensions: [
      { type: 'guild_conflict', factions: ['a', 'b', 'c'], severity: ['minor', 'major'] },
      { type: 'great_fire', factions: ['a', 'b', 'c'], severity: ['major', 'catastrophic'] },
      { type: 'plague_years', factions: ['a', 'b', 'c'], severity: ['major', 'catastrophic'] },
    ] } };
    expect(sharpestTroubleOf(s)).toMatchObject({ at: 1 });
    expect(sharpestTroubleOf({ history: { currentTensions: [] } })).toBe(null);
  });

  it('on born towns it is never a tension the rank would pass over', () => {
    for (const { s } of TOWNS) {
      const ts = s.history.currentTensions;
      const top = sharpestTroubleOf(s);
      const grade = (t) => Math.max(...[].concat(t.severity).map((g) => SEV[g] || 0));
      for (let i = 0; i < ts.length; i += 1) {
        expect(grade(ts[i]) > grade(top.tension) || (grade(ts[i]) === grade(top.tension) && i < top.at)).toBe(false);
      }
    }
  });
});

describe('three people on its three sides (CF4, CF6)', () => {
  it(`${TOWNS.length} calm born towns: every face is on the record, every reason is from the closed set, the caps hold`, () => {
    const failures = collectSeedFailures(TOWNS.map((t) => t.seed), (seed) => {
      const { s } = TOWNS.find((t) => t.seed === seed);
      const frame = castTroubleFrame(s);
      if (!frame) throw new Error('a calm town with a standing tension has no frame');
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
