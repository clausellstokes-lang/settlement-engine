/**
 * tests/generators/soldierHookCivilianHolder.test.js — R2-CODE-A-2, the medium soldier's hooks (the cold list
 * REVIEW-W2A-3, MEDIUM #676 #678 #968 #969): under a siege or a war, the crisis bias pulls any person's one hook
 * into the military pool, so a bowyer, a smith, a granary reeve or a troupe leader carried "Someone is paying their
 * soldiers more than their salary", "Someone knew the patrol route" or "Weapons from the armoury…": a force they
 * do not command. A military line that presumes a command is refused for a holder outside the military pool, and
 * resolves DRAW-FREE into the holder's own pool (the next admitted, unheld row from the drawn row's place); the
 * registry keeps the drawn text, so no later draw in a town without the false line moves. The two military lines
 * true of anyone ("noticed the same group of faces", "signed for supplies") stay admitted for every holder.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { NPC_FACTION_LOYALTY, MILITARY_HOOKS_TRUE_OF_ANY_HOLDER } from '../../src/data/npcData.js';

/** @param {unknown} l @returns {string} */
const textOf = (l) => (typeof l === 'string' ? l : String(/** @type {{ text?: unknown }} */ (l)?.text ?? ''));
const COMMAND = new Set(NPC_FACTION_LOYALTY.military.map(textOf).filter((t) => !MILITARY_HOOKS_TRUE_OF_ANY_HOLDER?.has?.(t)));

/** @param {string} seed */
function born(seed) {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
}

describe('the military lines that are true of any holder', () => {
  it('are two named lines of the military pool, and every other military line presumes a command', () => {
    expect(MILITARY_HOOKS_TRUE_OF_ANY_HOLDER instanceof Set).toBe(true);
    expect([...MILITARY_HOOKS_TRUE_OF_ANY_HOLDER].sort()).toEqual([
      "They've noticed the same group of faces at multiple locations where incidents occurred. No one else has.",
      'They signed for supplies that never arrived, and the merchant who sold them is already spending the money.',
    ].sort());
    for (const t of MILITARY_HOOKS_TRUE_OF_ANY_HOLDER) expect(NPC_FACTION_LOYALTY.military.map(textOf)).toContain(t);
    expect(COMMAND.size).toBe(NPC_FACTION_LOYALTY.military.length - 2);
  });
});

describe('the cold list\'s crisis towns, born as the app births them', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it.each([['rw3-city-wartime-1'], ['rw3-town-under_siege-1']])('%s: no holder outside the military carries a soldier\'s hook', (seed) => {
    const s = born(seed);
    const civil = (s.npcs || []).filter((/** @type {any} */ n) => n.category !== 'military');
    const false_ = civil.flatMap((/** @type {any} */ n) => (n.plotHooks || []).filter((/** @type {string} */ h) => COMMAND.has(h)).map((/** @type {string} */ h) => `${n.role}: ${h}`));
    expect(false_).toEqual([]);
    for (const n of civil) expect((n.plotHooks || []).length, `${n.role} keeps its one hook`).toBe(1);
  });
  it('rw3-city-wartime-1: the military holders keep their soldier\'s hooks', () => {
    const s = born('rw3-city-wartime-1');
    const mil = (s.npcs || []).filter((/** @type {any} */ n) => n.category === 'military');
    expect(mil.some((/** @type {any} */ n) => (n.plotHooks || []).some((/** @type {string} */ h) => COMMAND.has(h)))).toBe(true);
  });
});
