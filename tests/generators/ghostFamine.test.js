/**
 * tests/generators/ghostFamine.test.js — F9 (ghost famine) regression guard.
 *
 * isolationGenerator.applySubsistenceMode used to push 'famine' straight into
 * effectiveConfig.stressTypes (the ECONOMICS channel) without ever adding a
 * stress-container entry. stressConfirmPass iterates the container and returns
 * early when it is empty, so the poked famine was never re-weighed — and no
 * stress entry, Active Crisis card, or activeCondition was ever produced. The
 * result: ~a third of isolated thorps/hamlets got famine ECONOMICS (production
 * cuts, prosperity capped at Struggling) while the settlement showed no famine
 * anywhere — an invisible starvation.
 *
 * The fix routes the famine through the stress container as a real entry (the
 * single channel every other stressor rides): stressConfirmPass re-weighs it
 * against granaries and syncs effectiveConfig.stressTypes from the confirmed
 * container, and assembleSettlement promotes it to an activeCondition.
 *
 * The invariant this pins (across an isolated-subsistence seed sweep):
 *   famine ECONOMICS  ⟺  famine stress ENTRY  ⟺  famine activeCONDITION
 * i.e. the three are coupled — no channel can carry famine while another does
 * not. The old ghost was exactly the broken left-to-middle biconditional.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const entriesOf = (s) => {
  const c = s.stress;
  return Array.isArray(c) ? c : c ? [c] : [];
};
const hasFamineEconomics  = (s) => (s.config?.stressTypes || []).includes('famine');
const hasFamineEntry      = (s) => entriesOf(s).some((e) => e?.type === 'famine');
const hasFamineCondition  = (s) => (s.activeConditions || []).some((c) => c?.archetype === 'famine');

const isolated = (over, seed) =>
  generateSettlementPipeline(
    { settType: 'thorp', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'isolated', monsterThreat: 'civilized', ...over },
    null,
    { seed, customContent: {} },
  );

// A broad sweep across subsistence tiers, terrains, and seeds so the 35% famine
// roll fires on a good fraction of the corpus AND misses on the rest.
const SWEEP = [];
for (const settType of ['thorp', 'hamlet']) {
  for (const terrain of ['grassland', 'forest', 'mountains', 'swamp', 'coastal']) {
    for (let i = 0; i < 40; i++) SWEEP.push({ settType, terrain, seed: `ghost-${settType}-${terrain}-${i}` });
  }
}

describe('F9 — ghost famine is killed (economics ⟺ entry ⟺ condition)', () => {
  it('no isolated subsistence settlement carries famine economics without a famine entry', () => {
    const ghosts = [];
    for (const { settType, terrain, seed } of SWEEP) {
      const s = isolated({ settType, terrain }, seed);
      // The ghost's exact signature: economics ON, entry OFF.
      if (hasFamineEconomics(s) && !hasFamineEntry(s)) ghosts.push(`${settType}/${terrain}/${seed}`);
    }
    expect(ghosts, `ghost famine (economics with no stress entry) on: ${ghosts.slice(0, 8).join(', ')}`).toEqual([]);
  });

  it('famine channels are fully coupled — economics ⟺ entry ⟺ condition on every seed', () => {
    for (const { settType, terrain, seed } of SWEEP) {
      const s = isolated({ settType, terrain }, seed);
      const eco = hasFamineEconomics(s);
      const entry = hasFamineEntry(s);
      const cond = hasFamineCondition(s);
      expect(eco, `[${settType}/${terrain}/${seed}] economics⟺entry`).toBe(entry);
      expect(entry, `[${settType}/${terrain}/${seed}] entry⟺condition`).toBe(cond);
    }
  });

  it('exercises BOTH the famine-fires and famine-misses paths across the sweep', () => {
    let fired = 0;
    let missed = 0;
    for (const { settType, terrain, seed } of SWEEP) {
      if (hasFamineEntry(isolated({ settType, terrain }, seed))) fired++;
      else missed++;
    }
    expect(fired, 'the isolation famine roll should fire on some seeds').toBeGreaterThan(0);
    expect(missed, 'and miss on others (it is not unconditional)').toBeGreaterThan(0);
  });

  it('the isolation famine entry renders with the real name and drops its summaryRoll (F8 contract)', () => {
    // Find a seed that produced the isolation famine and check its entry shape.
    for (const { settType, terrain, seed } of SWEEP) {
      const s = isolated({ settType, terrain }, seed);
      const fam = entriesOf(s).find((e) => e?.type === 'famine');
      if (!fam) continue;
      expect(typeof fam.summary).toBe('string');
      expect(fam.summary, 'summary embeds the real settlement name').toContain(s.name);
      expect(fam.summary, 'no empty-name leading-space artifact').not.toMatch(/^\s/);
      expect(Object.prototype.hasOwnProperty.call(fam, 'summaryRoll'),
        'transient summaryRoll must be deleted at assembly').toBe(false);
      return; // one is enough
    }
    throw new Error('sweep produced no isolation famine — cannot check entry shape');
  });

  it('is deterministic — same config+seed reproduces the same famine outcome', () => {
    for (const seed of ['ghost-det-1', 'ghost-det-2', 'ghost-det-3']) {
      const a = isolated({}, seed);
      const b = isolated({}, seed);
      expect(hasFamineEntry(b)).toBe(hasFamineEntry(a));
      expect(entriesOf(b).map((e) => e.type)).toEqual(entriesOf(a).map((e) => e.type));
    }
  });
});
