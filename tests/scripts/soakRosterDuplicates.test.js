/**
 * tests/scripts/soakRosterDuplicates.test.js — REVIEW-INTAKE-3 R10 (unit 5, instruments only).
 *
 * The same secret or the same short goal on two NPCs of ONE roster is X-50's defect inside one
 * dossier (across dossiers it is a feature, the owner's word of 2026-11-04). The soak battery
 * (`scripts/audit/soak-review/checks.mjs :: reviewSettlement`) gains two record checks,
 * `coh:roster-duplicate-secret` and `coh:roster-duplicate-goal`, keyed as a CONTRADICTION kind
 * (`KIND_OF` >= 1 and not 6) so the stop rule reads them. Red-first with planted rosters on a
 * real birth; the control is the same birth with every text made distinct.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { KIND_OF, reviewSettlement } from '../../scripts/audit/soak-review/checks.mjs';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

/** @type {{settlement: any, config: any}} */
let born;
beforeAll(async () => {
  await ensureLaws();
  born = birth(0);
}, 120_000);

/** A copy of the birth whose roster carries distinct texts, then the planted duplicates. */
const planted = ({ secret = false, goal = false } = {}) => {
  const s = structuredClone(born.settlement);
  expect(s.npcs.length, 'the birth has a roster of at least two').toBeGreaterThanOrEqual(2);
  s.npcs.forEach((npc, k) => {
    npc.secret = { ...(typeof npc.secret === 'object' && npc.secret ? npc.secret : {}), what: `distinct secret ${k}` };
    npc.goal = { ...(typeof npc.goal === 'object' && npc.goal ? npc.goal : {}), short: `distinct goal ${k}` };
  });
  if (secret) s.npcs[1].secret.what = s.npcs[0].secret.what;
  if (goal) s.npcs[1].goal.short = s.npcs[0].goal.short;
  return reviewSettlement(s, born.config, null).filter((f) => f.check.startsWith('coh:roster-duplicate'));
};

describe('one roster, the same text on two NPCs (R10)', () => {
  it('the control: distinct texts raise neither check', () => {
    expect(planted()).toEqual([]);
  });

  it('a planted duplicate SECRET raises coh:roster-duplicate-secret, naming the two NPCs', () => {
    const found = planted({ secret: true });
    expect(found.map((f) => f.check)).toEqual(['coh:roster-duplicate-secret']);
    expect(found[0].surface).toBe('record');
    expect(found[0].quote).toBe('distinct secret 0');
    expect(found[0].detail).toContain(born.settlement.npcs[0].name);
    expect(found[0].detail).toContain(born.settlement.npcs[1].name);
  });

  it('a planted duplicate GOAL raises coh:roster-duplicate-goal', () => {
    const found = planted({ goal: true });
    expect(found.map((f) => f.check)).toEqual(['coh:roster-duplicate-goal']);
    expect(found[0].quote).toBe('distinct goal 0');
  });

  it('both are keyed as a contradiction kind the stop rule reads (>= 1, not repetition 6)', () => {
    for (const check of ['coh:roster-duplicate-secret', 'coh:roster-duplicate-goal']) {
      expect(KIND_OF[check], check).toBeGreaterThanOrEqual(1);
      expect(KIND_OF[check], check).not.toBe(6);
    }
  });
});
