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
 * THE LAW OF THE COUNT, ONE TEST (UPKEEP-CAPACITY C4, the chair's ruling of 2026-11-13): one job is counted once. A house
 * opens two parts that share a score only where they are TWO JOBS, each named below (TWO_JOBS): the village's Parish
 * church and the Monastery or friary. Two arms: THE STATIC ARM (the parts each house opens ALONE in its own place, minus
 * what an empty roster opens, standing in the birth and sharing a score) and THE DROP ARM (each house dropped alone).
 * The traditions' shared cap against beasts (R2: arcane, clergy and druids count 35 at most together) moves the other
 * traditions' parts when one opens or closes: that is the cap at work, classed apart, not a second feed of the house.
 * THE WAYSIDE SHRINE is a house that opens ONE part, by name (the chair's G3s: "No resident clergy", so no clergy part;
 * its parish row, the place's rallying point, stays).
 * The corpus adds births in the app's own shape at every tier, thorps and hamlets among them, with the dials drawn
 * (the walk to another's church is a thorp's and a hamlet's row, and a clergy part opens only where religion is high).
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
/**
 * THE NAMED TWO-JOB HOUSES (the chair's law of the count): the only houses that open two parts sharing a score, each
 * part a job of its own. By the catalogue's exact name.
 * @type {Record<string, Record<string, string>>}
 */
const TWO_JOBS = {
  'Parish church': { clergy: "its clergy's powers", parish: "the building, the community's rallying point" },
  'Monastery or friary': { clergy: "its clergy's powers", hospital: 'its infirmary' },
};
/** THE NAMED ONE-JOB HOUSES the law reads by name: the one part each opens alone where it stands. */
const ONE_JOB = { 'Wayside shrine': 'parish' };
const TRADITIONS = new Set(['arcane', 'clergy', 'druids']);
const CLASS_SEEDS = [
  'cold-famine-hamlet-1', 'cold-hamlet-237', 'cold-thorp-201', 'cold-wartime-hamlet-11', 'fresh5-thorp-56',
  'cold-famine-hamlet-13', 'cold-hamlet-95', 'cold-thorp-69', 'cold-wartime-hamlet-8', 'fresh5-village-11',
  'cold-famine-town-18', 'cold-town-160', 'cold-town-84', 'cold-wartime-town-1', 'fresh5-town-28',
  'cold-famine-village-1', 'cold-village-138', 'cold-village-3', 'cold-wartime-village-38', 'fresh5-village-45',
];
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SMALL = new Set(['thorp', 'hamlet', 'village']);
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
    // The count's own births (UPKEEP-CAPACITY C4b): the app's shape with the dials drawn, every tier.
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 6; i++) {
        const seed = `count6-${stress || 'calm'}-${tier}-${i}`;
        const cfg = stress
          ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier, selectedStresses: [stress], selectedStressesRandom: false })
          : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier });
        births.push({ seed, s: generateSettlementPipeline(cfg, null, { seed, customContent: {} }) });
      }
    }
  }
  // And five births of each house the static arm reads on the 3,756 (probes/UPKEEP-CAPACITY/seat2/once.mjs at C3,
  // every fifth of each class): the walk to church, the wayside shrine, the monastery, the village's parish church.
  for (const seed of CLASS_SEEDS) {
    const m = /^[a-z0-9]+-(?:([a-z_]+)-)?(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
    if (!m) throw new Error(seed);
    const cfg = m[1]
      ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false })
      : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2] });
    births.push({ seed, s: generateSettlementPipeline(cfg, null, { seed, customContent: {} }) });
  }
  for (const { s } of births) dropsOf(s);
}, 600000);

/**
 * The parts one house opens ALONE in its own place (the record's config, tier and economy kept), minus what an empty
 * roster opens there. @param {any} s @param {any} inst @param {Set<string>} empty
 */
const opensAlone = (s, inst, empty) => partsOf({ ...s, institutions: [inst] }).map((p) => p.id).filter((id) => !empty.has(id));

/**
 * Drop each house alone: the parts that move, with the scores each feeds. A tradition part that stays open and moves
 * only because another tradition opened or closed is R2's shared cap at work (`cap`), not in `moved`.
 * @param {any} s
 */
function dropEach(s) {
  const base = partsOf(s);
  const full = Object.fromEntries(base.map((p) => [p.id, p.full]));
  /** @type {Record<string, string[]>} */
  const feeds = Object.fromEntries(base.map((p) => [p.id, p.feeds]));
  const empty = new Set(partsOf({ ...s, institutions: [] }).map((p) => p.id));
  return s.institutions.map((/** @type {any} */ inst, /** @type {number} */ i) => {
    const now = partsOf({ ...s, institutions: s.institutions.filter((/** @type {any} */ _, /** @type {number} */ j) => j !== i) });
    for (const p of now) feeds[p.id] ??= p.feeds;
    const was = Object.fromEntries(now.map((p) => [p.id, p.full]));
    const all = [...new Set([...Object.keys(full), ...Object.keys(was)])].filter((k) => Math.abs((full[k] ?? 0) - (was[k] ?? 0)) > 1e-9);
    const opens = opensAlone(s, inst, empty);
    const toggled = [...TRADITIONS].some((id) => (id in full) !== (id in was));
    const cap = all.filter((id) => TRADITIONS.has(id) && id in full && id in was && !opens.includes(id) && toggled);
    return { inst, moved: all.filter((id) => !cap.includes(id)), cap, feeds };
  });
}

/** Each birth's drops, computed once (the setup does it; three tests read them). @type {WeakMap<object, ReturnType<typeof dropEach>>} */
const DROPS = new WeakMap();
/** @param {any} s */
const dropsOf = (s) => { if (!DROPS.has(s)) DROPS.set(s, dropEach(s)); return /** @type {ReturnType<typeof dropEach>} */ (DROPS.get(s)); };

/** Of the parts, the pairs that feed one score: score → the parts. @param {string[]} ids @param {Record<string, string[]>} feeds */
const sharedScores = (ids, feeds) => {
  /** @type {Record<string, string[]>} */
  const byScore = {};
  for (const id of ids) for (const score of feeds[id] || []) (byScore[score] ??= []).push(id);
  return Object.entries(byScore).filter(([, v]) => v.length > 1);
};
/** A named two-job house, by its exact catalogue name, whose shared parts are its named jobs. @param {any} inst @param {string[]} ids */
const isNamedTwoJobs = (inst, ids) => Object.hasOwn(TWO_JOBS, String(inst?.name)) && ids.every((id) => Object.hasOwn(TWO_JOBS[String(inst.name)], id));

describe('count once, on the design\'s own law (ruling W1)', () => {
  test('RED-FIRST: the magic part reads the whole roster: a magic house, dropped alone, moves the magic part', () => {
    let held = 0;
    const bad = [];
    for (const { seed, s } of births) {
      if (SMALL.has(s.tier)) continue; // a small place's magic part also waits on a magic house standing at all
      for (const { inst, moved } of dropsOf(s)) {
        if (!MAGIC_HOUSES.some((h) => lc(inst).includes(h))) continue;
        if (!partsOf(s).some((p) => p.id === 'magic')) continue;
        held += 1;
        if (!moved.includes('magic')) bad.push([seed, inst.name, moved.join('+')]);
      }
    }
    expect(held, 'anchored: the corpus holds magic houses beside a magic part').toBeGreaterThan(10);
    expect(bad).toEqual([]);
  });

  test('THE LAW, the drop arm: no house feeds one score through two parts, but a named two-job house', () => {
    const bad = [];
    let capped = 0;
    for (const { seed, s } of births) {
      for (const { inst, moved, cap, feeds } of dropsOf(s)) {
        if (cap.length) capped += 1;
        const twice = sharedScores(moved, feeds).filter(([, ids]) => !isNamedTwoJobs(inst, ids));
        if (twice.length) bad.push([seed, inst.name, twice.map(([sc, ids]) => `${sc}: ${ids.join('+')}`).join('; ')]);
      }
    }
    expect(capped, 'anchored: the shared cap against beasts is at work in the corpus, and classed apart').toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  test('RED-FIRST: THE LAW, the static arm: the houses that open two parts sharing a score are exactly the named two-job houses', () => {
    const bad = [];
    /** @type {Record<string, number>} */
    const named = {};
    for (const { seed, s } of births) {
      const standing = partsOf(s);
      const ids = new Set(standing.map((p) => p.id));
      /** @type {Record<string, string[]>} */
      const feeds = Object.fromEntries(standing.map((p) => [p.id, p.feeds]));
      const empty = new Set(partsOf({ ...s, institutions: [] }).map((p) => p.id));
      for (const inst of s.institutions) {
        const twice = sharedScores(opensAlone(s, inst, empty).filter((id) => ids.has(id)), feeds);
        if (!twice.length) continue;
        if (twice.every(([, v]) => isNamedTwoJobs(inst, v))) named[inst.name] = (named[inst.name] || 0) + 1;
        else bad.push([seed, inst.name, twice.map(([sc, v]) => `${sc}: ${v.join('+')}`).join('; ')]);
      }
    }
    expect(Object.keys(named).sort(), 'anchored: each named two-job house stands in the corpus with both its jobs').toEqual(Object.keys(TWO_JOBS).sort());
    expect(bad).toEqual([]);
  });

  test('RED-FIRST: the wayside shrine opens one part, by name: its parish row, and no clergy part', () => {
    let held = 0;
    const bad = [];
    for (const { seed, s } of births) {
      const empty = new Set(partsOf({ ...s, institutions: [] }).map((p) => p.id));
      for (const inst of s.institutions) {
        if (!Object.hasOwn(ONE_JOB, String(inst.name))) continue;
        const opens = opensAlone(s, inst, empty);
        held += 1;
        if (opens.length !== 1 || opens[0] !== ONE_JOB[String(inst.name)]) bad.push([seed, inst.name, opens.join('+')]);
      }
    }
    expect(held, 'anchored: the corpus holds wayside shrines').toBeGreaterThan(5);
    expect(bad).toEqual([]);
  });

  test('every house that stands in two roles is listed, with its parts and the scores each feeds', () => {
    let roles = 0;
    const bad = [];
    for (const { seed, s } of births) {
      for (const { inst, moved, feeds } of dropsOf(s)) {
        if (moved.length < 2) continue;
        roles += 1;
        if (isNamedTwoJobs(inst, moved)) continue;
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
