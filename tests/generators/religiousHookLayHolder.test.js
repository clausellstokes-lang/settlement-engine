/**
 * tests/generators/religiousHookLayHolder.test.js — R2-CODE-A-3, round three's cut (ROUND-3-CUT-2026-11-13, lane ra),
 * MEDIUM #518–#524 and #1322–#1334: under an outbreak or a conversion the crisis bias pulls any person's one hook into
 * the religious pool, so a cooper "has no congregation", a tanner "hears no confessions", a toll-keeper "has no
 * novices". A religious line is refused for a holder outside the religious pool and resolves DRAW-FREE into the
 * holder's own pool, in the form of the soldier's hooks (dca86dfe1). The two religious lines true of anyone (who will
 * fall from grace; a predecessor's sealed letter) stay admitted for every holder.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { NPC_FACTION_LOYALTY, RELIGIOUS_HOOKS_TRUE_OF_ANY_HOLDER } from '../../src/data/npcData.js';

/** @param {unknown} l @returns {string} */
const textOf = (l) => (typeof l === 'string' ? l : String(/** @type {{ text?: unknown }} */ (l)?.text ?? ''));
const OFFICE = new Set(NPC_FACTION_LOYALTY.religious.map(textOf).filter((t) => !RELIGIOUS_HOOKS_TRUE_OF_ANY_HOLDER?.has?.(t)));

describe('the religious lines that are true of any holder', () => {
  it('are two named lines of the religious pool, and every other religious line presumes the office', () => {
    expect(RELIGIOUS_HOOKS_TRUE_OF_ANY_HOLDER instanceof Set).toBe(true);
    expect(RELIGIOUS_HOOKS_TRUE_OF_ANY_HOLDER.size).toBe(2);
    for (const t of RELIGIOUS_HOOKS_TRUE_OF_ANY_HOLDER) expect(NPC_FACTION_LOYALTY.religious.map(textOf)).toContain(t);
    expect(OFFICE.size).toBe(NPC_FACTION_LOYALTY.religious.length - 2);
  });
});

describe("the reader's two outbreak towns, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed @param {string} settType @param {object} [route] */
  const born = (seed, settType, route = {}) => /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType, selectedStressesRandom: false, selectedStresses: ['plague_onset'], _randomizePriorities: true }), null, { seed, customContent: {} }));
  it.each([
    ['rr2s-town-plague_onset-rand-1', 'town', {}],
    ['rr2s-metropolis-plague_onset-port-1', 'metropolis', { tradeRouteAccess: 'port' }],
  ])('%s: no holder outside the religious pool carries a priest\'s hook', (seed, settType, route) => {
    const s = born(seed, settType, route);
    const lay = (s.npcs || []).filter((/** @type {any} */ n) => n.category !== 'religious');
    const false_ = lay.flatMap((/** @type {any} */ n) => (n.plotHooks || []).filter((/** @type {string} */ h) => OFFICE.has(h)).map((/** @type {string} */ h) => `${n.role}: ${h}`));
    expect(false_).toEqual([]);
  });
});
