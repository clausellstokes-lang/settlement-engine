/**
 * magicCountOnce.test.js — COUNT ONCE, ON THE DESIGN'S OWN LAW (COHERENCE-UPKEEP-7, the chair's ruling W1 on the
 * fourth read, REVIEW-UPKEEP-0a07f98c7 C-H1: reading A WITHDRAWN, the chair's own error).
 *
 * The magic presence is the whole of the Magical Capability score, and no named house was ever counted twice in that
 * score: the lane's design (docs/chair/2026-11-13/UPKEEP-DEFENCE-PARTS.md, "Count once: double homes found", items 4
 * and 6) keeps the presence alone as the magic score, which counts the magic houses as magic, and the magic houses
 * stand in TWO ROLES, force or craft (their named part) and magic, each feeding scores of its own. So:
 *   - the magic part reads the WHOLE roster: a magic house, dropped alone, moves the magic part (red first: reading A
 *     took them out);
 *   - THE LAW: no house feeds ONE score through two parts (drop each house alone, recompute the parts, never stored;
 *     the parts that move, by the scores each feeds: no score fed by two of them);
 *   - every house that stands in two roles is listed below with its parts and the scores each feeds.
 * Births in the app's own shape (`selectedStresses`, `selectedStressesRandom: false`), the reader's shape.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { defencePartsOf } from '../../src/generators/defenseGenerator.js';

/**
 * THE HOUSES THAT STAND IN TWO ROLES (measured on the reader's 330 births at the W1 tree,
 * docs/chair/2026-11-13/probes/UPKEEP-7/once8.mjs): each house, its parts, and the scores each part feeds.
 * @type {Record<string, Record<string, string[]>>}
 */
const TWO_ROLES = {
  "wizard's tower": { arcane: ['military', 'monster', 'internal'], magic: ['magical'] },
  "mages' guild": { arcane: ['military', 'monster', 'internal'], magic: ['magical'] },
  'hedge wizard': { arcane: ['military', 'monster', 'internal'], magic: ['magical'] },
  'alchemist shop': { arcane: ['military', 'monster', 'internal'], alchemists: ['economic'], magic: ['magical'] },
  'alchemist quarter': { arcane: ['military', 'monster', 'internal'], alchemists: ['economic'], magic: ['magical'] },
  'apothecary district': { alchemists: ['economic'], magic: ['magical'] },
  'elder grove council': { druids: ['monster'], magic: ['magical'] },
  'druid circle': { druids: ['monster'], magic: ['magical'] },
  'healer (divine': { hospital: ['economic', 'monster'], magic: ['magical'] },
};
const MAGIC_HOUSES = ["wizard's tower", "mages' guild"];
const RULE_PARTS = new Set(['terrain', 'size', 'danger', 'wallsUnmanned', 'sustainsHeld', 'scaleTop', 'scaleBottom', 'will', 'rounding']);
const isRulePart = (/** @type {string} */ id) => RULE_PARTS.has(id) || id.startsWith('full:') || id.startsWith('floor:');
const lc = (/** @type {any} */ i) => String(i?.name || '').toLowerCase();
/** @param {any} s */
const partsOf = (s) => defencePartsOf(s).filter((p) => !isRulePart(p.id));

/** @type {any[]} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const stress of [null, 'famine', 'under_siege']) {
    for (const tier of ['village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 8; i++) {
        const seed = `once8-${stress || 'calm'}-${tier}-${i}`;
        const cfg = birthConfig({ ...DEFAULT_CONFIG, settType: tier, selectedStresses: stress ? [stress] : [], selectedStressesRandom: false });
        births.push({ seed, s: generateSettlementPipeline(cfg, null, { seed, customContent: {} }) });
      }
    }
  }
}, 600000);

/** Drop each house alone: the parts that move, with the scores each feeds. @param {any} s */
function dropEach(s) {
  const base = partsOf(s);
  const full = Object.fromEntries(base.map((p) => [p.id, p.full]));
  /** @type {Record<string, string[]>} */
  const feeds = Object.fromEntries(base.map((p) => [p.id, p.feeds]));
  return s.institutions.map((/** @type {any} */ inst, /** @type {number} */ i) => {
    const now = partsOf({ ...s, institutions: s.institutions.filter((/** @type {any} */ _, /** @type {number} */ j) => j !== i) });
    for (const p of now) feeds[p.id] ??= p.feeds;
    const was = Object.fromEntries(now.map((p) => [p.id, p.full]));
    const moved = [...new Set([...Object.keys(full), ...Object.keys(was)])].filter((k) => Math.abs((full[k] ?? 0) - (was[k] ?? 0)) > 1e-9);
    return { inst, moved, feeds };
  });
}

describe('count once, on the design\'s own law (ruling W1)', () => {
  test('RED-FIRST: the magic part reads the whole roster: a magic house, dropped alone, moves the magic part', () => {
    let held = 0;
    const bad = [];
    for (const { seed, s } of births) {
      if (['village'].includes(s.tier)) continue; // a small place's magic part also waits on a magic house standing at all
      for (const { inst, moved } of dropEach(s)) {
        if (!MAGIC_HOUSES.some((h) => lc(inst).includes(h))) continue;
        if (!partsOf(s).some((p) => p.id === 'magic')) continue;
        held += 1;
        if (!moved.includes('magic')) bad.push([seed, inst.name, moved.join('+')]);
      }
    }
    expect(held, 'anchored: the corpus holds magic houses beside a magic part').toBeGreaterThan(10);
    expect(bad).toEqual([]);
  });

  test('THE LAW: no house feeds one score through two parts', () => {
    const bad = [];
    for (const { seed, s } of births) {
      for (const { inst, moved, feeds } of dropEach(s)) {
        /** @type {Record<string, string[]>} */
        const byScore = {};
        for (const id of moved) for (const score of feeds[id] || []) (byScore[score] ??= []).push(id);
        const twice = Object.entries(byScore).filter(([, ids]) => ids.length > 1);
        if (twice.length) bad.push([seed, inst.name, twice.map(([sc, ids]) => `${sc}: ${ids.join('+')}`).join('; ')]);
      }
    }
    expect(bad).toEqual([]);
  });

  test('every house that stands in two roles is listed, with its parts and the scores each feeds', () => {
    let roles = 0;
    const bad = [];
    for (const { seed, s } of births) {
      for (const { inst, moved, feeds } of dropEach(s)) {
        if (moved.length < 2) continue;
        roles += 1;
        const key = Object.keys(TWO_ROLES).find((h) => lc(inst).includes(h));
        const listed = key ? TWO_ROLES[key] : null;
        const fits = listed && moved.every((id) => listed[id] && (feeds[id] || []).every((sc) => listed[id].includes(sc)));
        if (!fits) bad.push([seed, inst.name, moved.map((id) => `${id}(${(feeds[id] || []).join('/')})`).join('+')]);
      }
    }
    expect(roles, 'anchored: the corpus holds houses in two roles').toBeGreaterThan(10);
    expect(bad).toEqual([]);
  });
});
