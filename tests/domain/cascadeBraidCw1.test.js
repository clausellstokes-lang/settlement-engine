/**
 * cascadeBraidCw1.test.js — CW-1, THE CASCADE GOVERNOR (FP; docs/DESIGN_FP_ARCHITECTURE.md §5
 * block #58, docs/DESIGN_FP_ARCH_CW.md §CW-1; the flag `cascadeGovernorEnabled`, VIRTUAL, dark).
 *
 * THE UNIT. At Herald composition (heraldFeed.js buildHeraldFeed, one guarded line) the braid finds
 * a CASCADE: MEMBER_FLOOR or more filed receipts inside a closed window that share one causal
 * ancestor BY IDENTITY (a recorded provenance edge) and whose links cross LAYER_FLOOR or more
 * registry layers. It files ONE story item at the cascade's top significance, its sentence naming
 * the ancestor, the layers crossed and the count (SR-17), its body the chain rendered forward
 * through discourseKernel; every member stays in its desk with its id, damped to the routine
 * class; a major member is never damped. Damped, never dropped.
 *
 * THE FOUR FENCES + THE LIT-MUTANT CONTROL (the §3 flag law; ARCH_CW §2): own footprint (dark, the
 * feed is the pre-CW-1 bytes, the digest computed with the pre-CW-1 composer planted), absent vs
 * false, the call path (a cross-module spy on the braid's entry), the gate polarity census.
 *
 * THE FIXTURE REALM: Schwarzholz (sch), Obergasse (obe), Cathfield (cat), Tyrstad (tyr), READ 3's
 * four towns, so the read's own specificity scorer can name them.
 *
 * @enforced-by this file
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve as resolvePath } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly, commentsOnly } from '../helpers/codeOnlySource.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = vi.hoisted(() => ({ braid: 0 }));

vi.mock('../../src/domain/display/cascadeBraid.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // A STRICT pass-through: the original's answer, counted.
    braidCascadesInto: (...args) => {
      calls.braid += 1;
      return actual.braidCascadesInto(...args);
    },
  };
});

import { buildHeraldFeed } from '../../src/components/map/heraldFeed.js';
import { severityBand } from '../../src/components/map/heraldFilter.js';
import {
  BRAID_KIND,
  BRAID_LAYERS_OF_KIND,
  CASCADE_BRAID_TUNING,
  DECREE_ROOT,
  LAYER_WORDS,
  braidSentence,
  cascadeGovernorActive,
  layersCrossed,
} from '../../src/domain/display/cascadeBraid.js';
import { COUPLING_REGISTRY } from '../../src/domain/certification/couplingRegistry.js';
import { VIRTUAL_SUBSYSTEM_ROWS } from '../../src/domain/certification/subsystemRowsVirtual.js';
import {
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import { isDecreeNode } from '../../src/domain/display/chronicleGraph.js';
import { ALL_CONNECTIVES } from '../../src/domain/display/discourseKernel.js';
import { facetAvailability, readableBy, searchHerald } from '../../src/domain/display/heraldIndex.js';
import { PHANTOM_CONSEQUENCE_POLICIES } from '../../src/domain/edit/phantoms.js';
import { SIGNIFICANCE_CLASSES } from '../../src/domain/worldPulse/bandFamilies.js';
import { DECREE_CAUSE } from '../../src/domain/worldPulse/decreeHook.js';
import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/intervalWeeks.js';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'cascadeGovernorEnabled';
const LEAF = 'src/domain/display/cascadeBraid.js';
const COMPOSER = 'src/components/map/heraldFeed.js';
const LIT = Object.freeze({ cascadeGovernorEnabled: true });

/** @param {string} dir @param {string[]} out @returns {string[]} */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

/** Every src module as CODE: comments and string contents blanked, offsets kept. */
const SOURCES = walk(join(ROOT, 'src'))
  .filter((path) => /\.(js|jsx)$/.test(path))
  .map((path) => ({
    rel: relative(ROOT, path).replace(/\\/g, '/'),
    code: codeOnly(readFileSync(path, 'utf8')),
  }))
  .sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));

// ── THE FENCE WORLD ────────────────────────────────────────────────────────────
// One advance (the previous record at 4, this one at 8), the ancestor an outcome of this advance,
// four consequences on the wizard feed carrying their recorded parents, and one unrelated raid.
// A→M1, A→M2, M2→M3, A→M4: a cascade of four receipts across five registry layers.

const A = 'outcome.5.war_declared.sch.cat';
const M1 = 'wizard_news.6.coalition_joined.obe.0';
const M2 = 'wizard_news.7.envoy_intercepted.tyr.0';
const M3 = 'wizard_news.7.treaty_disclosure_opened.cat.0';
const M4 = 'wizard_news.8.coalition_spoils_divided.sch.0';
const RAID = 'wizard_news.7.webwar_raid.cat.0';

const ANCESTOR_HEADLINE = 'Schwarzholz declares war on Cathfield';

/** A recorded outcome, the ancestor's record shape. */
function outcome(id, tick, headline, extra = {}) {
  return {
    id, candidateType: 'war_declared', type: 'war_declared', headline, summary: '', tick,
    significance: 'notable', severity: 0.6, targetSaveId: 'sch', settlementIds: ['sch', 'cat'],
    npcId: 'sch:npc:ulrich', factionId: 'sch.council', ...extra,
  };
}

/** A wizard-feed entry, the members' record shape. */
function news(id, kind, tick, headline, extra = {}) {
  return {
    id, kind, impactKind: kind, tick, headline, summary: '', significance: 'notable', severity: 0.45,
    settlementIds: ['cat'], ...extra,
  };
}

const FENCE_NEWS = Object.freeze([
  news(M1, 'coalition_joined', 6, 'Obergasse joins the war against Cathfield', { severity: 0.5, settlementIds: ['obe', 'cat'] }),
  news(M2, 'envoy_intercepted', 7, 'An envoy of Tyrstad is taken on the Cathfield road', { settlementIds: ['tyr', 'cat'], npcId: 'tyr:npc:klara' }),
  news(M3, 'treaty_disclosure_opened', 7, 'Cathfield opens the terms of its pact with Tyrstad', { significance: 'routine', severity: 0.3, settlementIds: ['cat', 'tyr'], routeId: 'route.cat.tyr' }),
  news(M4, 'coalition_spoils_divided', 8, 'Schwarzholz divides the spoils of Cathfield', { significance: 'major', severity: 0.8, settlementIds: ['sch', 'cat'] }),
  news(RAID, 'webwar_raid', 7, 'Cathfield raids the Obergasse road', { severity: 0.4, settlementIds: ['cat', 'obe'] }),
]);

const FENCE_EDGES = Object.freeze({
  [M1]: { parents: [A], type: 'coalition_joined', tick: 6 },
  [M2]: { parents: [A], type: 'envoy_intercepted', tick: 7 },
  [M3]: { parents: [M2], type: 'treaty_disclosure_opened', tick: 7 },
  [M4]: { parents: [A], type: 'coalition_spoils_divided', tick: 8 },
});

/** A pulse record as the interval collapse leaves it. */
function pulse(tick, selectedOutcomes = []) {
  return { tick, selectedOutcomes, impactDigest: [], resolvedStressors: [] };
}

/**
 * The fence world. `rules` is the rules bag; the options swap the ancestor, the feed and the
 * recorded edges so every negative runs on the positive's own fixture.
 */
function fenceWorld(rules = {}, { ancestor = outcome(A, 5, ANCESTOR_HEADLINE), outcomes, entries = FENCE_NEWS, edges = FENCE_EDGES, history } = {}) {
  return {
    worldState: {
      simulationRules: { ...rules },
      pulseHistory: history || [pulse(4), pulse(8, outcomes || (ancestor ? [ancestor] : []))],
      stressors: [],
      spatialLedgers: { provenance: JSON.parse(JSON.stringify(edges)) },
    },
    wizardNews: { entries: JSON.parse(JSON.stringify(entries)) },
  };
}

/** The feed's bytes, hashed. */
function feedDigest(campaign, lens = 'advance') {
  return createHash('sha256').update(JSON.stringify(buildHeraldFeed(campaign, { lens }))).digest('hex');
}

/** Every filed item, desk by desk. */
function itemsOf(feed) {
  return Object.values(feed.bySection).flat();
}

/** The braided story items of a feed. */
function braidsOf(feed) {
  return itemsOf(feed).filter((item) => item.kind === BRAID_KIND);
}

/** One item by id. */
function itemById(feed, id) {
  return itemsOf(feed).find((item) => item.id === id);
}

/**
 * THE PRE-CW-1 DARK DIGEST: the fence world's advance-lens feed, computed with the pre-CW-1
 * composer (src/components/map/heraldFeed.js at 90cbf7963, sha256 0b7563cb…) PLANTED over the tree
 * and restored byte-identically. The dark feed must be these bytes.
 */
const PRE_CW1_DARK_DIGEST = '6dbe3431e13d23cd17d7a15e18e8ee42cc243e1345f1db90ebab26b14d6a0723';

/** The fence world's feed swapped at one entry. */
function withEntry(id, patch) {
  return FENCE_NEWS.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry));
}

// ── READ 3's SPECIFICITY SCORER, A LOWER BOUND ─────────────────────────────────
// findings/FP-EXPERIENCE-3/_instrument/probe/score3.mjs (the FP kit): its town, magnitude, cause
// and consequence detectors and the owner's test, copied VERBATIM; its person detector is omitted,
// so a sentence scored here scores the same or higher on the instrument itself.
const TOWNS = Object.freeze(['Schwarzholz', 'Obergasse', 'Cathfield', 'Tyrstad']);
const SETTLE_RE = new RegExp(`\\b(${TOWNS.join('|')})\\b`);
const NUMWORD = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|hundreds?|thousands?|dozens?|score of|half|halves|halved|a third|thirds|a quarter|quarters|a tenth|a fifth|twice|thrice|double|doubled|triple|tripled|fortnight|handful|a trickle|a flood|near-total|nearly all|all but|the bulk of|most of|barely any|scarcely any|every last)\b/i;
const HUMAN_NUM = /\b\d+(?:[.,]\d+)?\s*(%|percent|per cent|settlers?|people|souls|residents|families|households|folk|soldiers|men|women|hands|coins?|gold|silver|crowns?|marks?|weeks?|months?|years?|days?|seasons?|winters?|summers?|miles?|leagues?|wagons?|carts?|ships?|head|y left)\b/i;
const DURATION = /\b(a|one) (fortnight|season|year|winter|summer|harvest|month|week)'s\b|\bfor (weeks|months|years|seasons|a season|a year|a month)\b|\b(a few|many|a great many) years\b/i;
const CAUSE = /\b(because|since|for want of|for lack of|owing to|due to|driven by|drove|in the wake of|after|over (a|an|the|its|their|his|her)|out of|on account of|in answer to|in response to|answering|provoked|prompted|forced|thanks to|as a result|rooted in|born of|the price of|the cost of|by reason of|under (the )?(pressure|weight|strain|threat)|demands it|left no room|for fear|on a belief|on a read|believed|misjudg|word never reached|a new reason|for the reason|on \w+ business|the old debt|mercy for)\b/i;
const VACUOUS_CAUSE = /\b(a changed settlement|new circumstances|the times|circumstances)\b/i;
const CONSEQ = /\b(so|so that|now|will|would|may|might|must|cannot|can no longer|can't|could|leaves|leaving|means|meaning|unless|threatens|threatening|risks|risking|in the balance|at stake|expect|lest|forcing|forces|then|soon|before long|becomes|has become|shall|stands to|faces|facing|begins to|has begun|will tear|frays|is turning)\b/i;

/** @param {string} t */
function specificityOf(t) {
  const named = SETTLE_RE.test(t);
  const magnitude = NUMWORD.test(t.replace(/\bthe two (towns|courts|settlements|of them)\b/gi, '')) || HUMAN_NUM.test(t) || DURATION.test(t);
  const cause = CAUSE.test(t) && !(VACUOUS_CAUSE.test(t) && !/\b(because|for want of|after|over (a|an|the))\b/i.test(t));
  const consequence = CONSEQ.test(t);
  const generic = !named && !magnitude;
  return { named, magnitude, cause, consequence, score: generic ? 0 : [named, magnitude, cause, consequence].filter(Boolean).length };
}

describe('CW-1: the cascade governor, cascadeGovernorEnabled minted dark (the four fences and the lit-mutant control)', () => {
  test('FENCE 1 · own footprint: dark, the feed is the pre-CW-1 bytes over a world that braids the moment the key is lit, under every shipped preset', () => {
    const dark = fenceWorld();
    expect(cascadeGovernorActive(dark.worldState)).toBe(false);
    expect(feedDigest(dark)).toBe(PRE_CW1_DARK_DIGEST);
    const presets = Object.entries(SIMULATION_RULE_PRESETS);
    expect(presets.length, 'the shipped presets are enumerated').toBeGreaterThan(3);
    for (const [name, preset] of presets) {
      const world = fenceWorld({ ...((preset && preset.rules) || {}) });
      expect(cascadeGovernorActive(world.worldState), name).toBe(false);
      expect(feedDigest(world), `${name}: no shipped preset lights the braid`).toBe(PRE_CW1_DARK_DIGEST);
    }
  });

  test('THE LIT-MUTANT CONTROL: the same world lit files one story item, so every fence can see', () => {
    const lit = buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' });
    expect(braidsOf(lit)).toHaveLength(1);
    expect(feedDigest(fenceWorld(LIT)), 'lit, the feed moves off the dark bytes').not.toBe(PRE_CW1_DARK_DIGEST);
  });

  test('FENCE 2 · absent, explicit false and every truthy non-true spelling are one output', () => {
    const absent = feedDigest(fenceWorld());
    for (const value of [false, 'true', 1, {}, null]) {
      expect(feedDigest(fenceWorld({ [FLAG]: value })), String(value)).toBe(absent);
    }
    expect(cascadeGovernorActive({ simulationRules: LIT })).toBe(true);
    expect(cascadeGovernorActive(null)).toBe(false);
    expect(cascadeGovernorActive({ simulationRules: 'cascadeGovernorEnabled' })).toBe(false);
  });

  test('FENCE 3 · the call path: dark, the braid is never entered; lit, it is', () => {
    calls.braid = 0;
    buildHeraldFeed(fenceWorld(), { lens: 'advance' });
    buildHeraldFeed(fenceWorld({ [FLAG]: false }), { lens: 'campaign' });
    expect(calls.braid, 'dark, not one braid is attempted').toBe(0);
    buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' });
    expect(calls.braid, 'lit, the pass-through spy is reached cross-module').toBe(1);
  });

  test('FENCE 4 · the gate polarity census: one read of the key in src, strict, in the leaf; manifested, and in no rules surface', () => {
    const reads = SOURCES.filter((file) => /\bcascadeGovernorEnabled\b/.test(file.code));
    expect(reads.map((file) => file.rel)).toEqual([LEAF]);
    const code = reads[0].code;
    expect([...code.matchAll(/\bcascadeGovernorEnabled\b/g)]).toHaveLength(1);
    expect(/\)\.cascadeGovernorEnabled === true/.test(code)).toBe(true);
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(FLAG);
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, FLAG)).toBe(false);
    for (const [name, preset] of Object.entries(SIMULATION_RULE_PRESETS)) {
      const rules = /** @type {Record<string, unknown>} */ ((preset && preset.rules) || {});
      expect(Object.prototype.hasOwnProperty.call(rules, FLAG), `${name} lights the braid (SR-6)`).toBe(false);
    }
    // THE SEAM IS ONE GUARDED LINE: the composer calls the gate once and the braid once, and
    // reads no key of its own.
    const composer = /** @type {{ code: string }} */ (SOURCES.find((file) => file.rel === COMPOSER)).code;
    expect([...composer.matchAll(/\bcascadeGovernorActive\(worldState\)/g)]).toHaveLength(1);
    expect([...composer.matchAll(/\bbraidCascadesInto\(/g)]).toHaveLength(1);
    expect(/if \(cascadeGovernorActive\(worldState\)\) braidCascadesInto\(bySection, campaign, toHeraldItem\);/.test(composer)).toBe(true);
  });

  test('the manifest carries the key at its codepoint-sorted position, and the census and the registry carry its row', () => {
    const at = ENGINE_GATED_VIRTUAL_RULE_KEYS.indexOf(FLAG);
    expect(at).toBeGreaterThan(0);
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS[at - 1] < FLAG).toBe(true);
    expect(FLAG < ENGINE_GATED_VIRTUAL_RULE_KEYS[at + 1]).toBe(true);
    expect(simulationRuleKeys()).toContain(FLAG);
    const row = VIRTUAL_SUBSYSTEM_ROWS.find((candidate) => candidate.rule === FLAG);
    expect(row).toBeTruthy();
    expect(/** @type {{ module: string }} */ (row).module.split(',')).toContain(LEAF);
    expect(/** @type {{ soakEvidence: string }} */ (row).soakEvidence).toBe('unobserved');
    expect(SUBSYSTEM_CERTIFICATION_REGISTRY.some((candidate) => candidate.rule === FLAG)).toBe(true);
  });
});

describe('CW-1: the braid', () => {
  test('A CASCADE BRAIDS: four receipts sharing one recorded ancestor across five layers file ONE story item at the top significance, every member damped and still present', () => {
    const dark = buildHeraldFeed(fenceWorld(), { lens: 'advance' });
    const lit = buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' });
    expect(braidsOf(dark)).toHaveLength(0);
    const braids = braidsOf(lit);
    expect(braids).toHaveLength(1);
    const [braid] = braids;
    expect(braid.id).toBe(`${BRAID_KIND}:${[M1, M2, M3, M4].sort().join('+')}`);
    expect(braid.section, 'filed at its ancestor\'s desk').toBe(itemById(dark, A).section);
    expect(lit.bySection[braid.section][0], 'and it leads that desk').toBe(braid);
    expect(braid.record).toMatchObject({
      type: BRAID_KIND, ancestorId: A, root: A, memberIds: [M1, M2, M3, M4],
      layers: ['INTERIOR', 'WAR', 'GRAMMAR', 'INFO', 'TRADE'], significance: 'major',
    });
    expect(braid).toMatchObject({ major: true, severity: 0.8, tick: 8, rootId: M4, provenance: 'canon', kind: BRAID_KIND });
    // COUNT IDENTITY, NOTHING DROPPED: the lit feed is the dark feed, item for item, plus one.
    expect(itemsOf(lit)).toHaveLength(itemsOf(dark).length + 1);
    for (const item of itemsOf(dark)) {
      expect(itemsOf(lit).filter((candidate) => candidate.id === item.id), item.id).toHaveLength(1);
    }
    for (const section of Object.keys(dark.bySection)) {
      const shift = section === braid.section ? 1 : 0;
      expect(lit.bySection[section].slice(shift).map((item) => item.id), section).toEqual(dark.bySection[section].map((item) => item.id));
    }
    // DAMPED TO THE ROUTINE CLASS, where each stood, with its id and its record.
    for (const id of [M1, M2, M3]) {
      const before = itemById(dark, id);
      const after = itemById(lit, id);
      expect(after.section).toBe(before.section);
      expect(after.record).toEqual(before.record);
      expect(after.significance).toBe(SIGNIFICANCE_CLASSES[0]);
      expect(after.major).toBe(false);
      expect(after.severity).toBe(Math.min(before.severity, CASCADE_BRAID_TUNING.DAMPED_SEVERITY));
      expect(severityBand(after), id).toBe('routine');
      expect(after.braidId).toBe(braid.id);
    }
    // The unrelated raid and the ancestor itself are untouched.
    expect(itemById(lit, RAID)).toEqual(itemById(dark, RAID));
    expect(itemById(lit, A)).toEqual(itemById(dark, A));
  });

  test('A MAJOR MEMBER IS NEVER DAMPED, and a braid of quieter members speaks at their own top class', () => {
    const dark = buildHeraldFeed(fenceWorld(), { lens: 'advance' });
    const lit = buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' });
    const [braid] = braidsOf(lit);
    const before = itemById(dark, M4);
    const after = itemById(lit, M4);
    expect(before.major).toBe(true);
    expect(after).toEqual({ ...before, braidId: braid.id });
    const quieter = buildHeraldFeed(fenceWorld(LIT, { entries: withEntry(M4, { significance: 'notable', severity: 0.5 }) }), { lens: 'advance' });
    const [notable] = braidsOf(quieter);
    expect(notable.record.significance).toBe('notable');
    expect(notable).toMatchObject({ major: false, severity: 0.5 });
    expect(itemById(quieter, M4)).toMatchObject({ severity: CASCADE_BRAID_TUNING.DAMPED_SEVERITY, major: false, significance: SIGNIFICANCE_CLASSES[0] });
  });

  test('BELOW THE FLOOR NOTHING BRAIDS and the feed is byte-identical; the third recorded edge braids the same world', () => {
    const two = { [M1]: FENCE_EDGES[M1], [M2]: FENCE_EDGES[M2] };
    expect(feedDigest(fenceWorld(LIT, { edges: two }))).toBe(PRE_CW1_DARK_DIGEST);
    const three = buildHeraldFeed(fenceWorld(LIT, { edges: { ...two, [M4]: FENCE_EDGES[M4] } }), { lens: 'advance' });
    expect(braidsOf(three).map((braid) => braid.record.memberIds)).toEqual([[M1, M2, M4]]);
  });

  test('FALSE CAUSALITY IS THE HARDEST NEGATIVE: two unrelated misfortunes of one season never braid, though together they would clear every floor', () => {
    const B = 'outcome.5.war_declared.obe.tyr';
    const outcomes = [outcome(A, 5, ANCESTOR_HEADLINE), outcome(B, 5, 'Obergasse declares war on Tyrstad', { targetSaveId: 'obe', settlementIds: ['obe', 'tyr', 'cat'], npcId: 'obe:npc:greta' })];
    // THE LIVE CHAIN, SEEDED FIRST (the vacuous-absence law): A's three consequences braid here.
    const seeded = { [M1]: { parents: [A] }, [M2]: { parents: [A] }, [M3]: { parents: [A] }, [M4]: { parents: [B] } };
    expect(braidsOf(buildHeraldFeed(fenceWorld(LIT, { outcomes, edges: seeded }), { lens: 'advance' })).map((braid) => braid.record.ancestorId)).toEqual([A]);
    // Two chains of two, one season, one town, five layers between them: no recorded common parent.
    const unrelated = { [M1]: { parents: [A] }, [M2]: { parents: [A] }, [M3]: { parents: [B] }, [M4]: { parents: [B] } };
    const lit = fenceWorld(LIT, { outcomes, edges: unrelated });
    expect(layersCrossed(itemsOf(buildHeraldFeed(lit, { lens: 'advance' })).filter((item) => [M1, M2, M3, M4].includes(item.id))).length).toBeGreaterThanOrEqual(CASCADE_BRAID_TUNING.LAYER_FLOOR);
    expect(braidsOf(buildHeraldFeed(lit, { lens: 'advance' }))).toHaveLength(0);
    expect(feedDigest(lit)).toBe(feedDigest(fenceWorld({}, { outcomes, edges: unrelated })));
  });

  test('THE DEPTH FLOOR: a chain across two layers never braids; the same chain across three does', () => {
    const twoLayer = [
      news(M1, 'envoy_intercepted', 6, 'An envoy of Obergasse is taken on the Cathfield road', { settlementIds: ['obe', 'cat'] }),
      news(M2, 'envoy_intercepted', 7, 'An envoy of Tyrstad is taken on the Cathfield road', { settlementIds: ['tyr', 'cat'] }),
      news(M4, 'interceptor_dilemma', 8, 'Cathfield must choose what to do with the envoys it holds', { settlementIds: ['cat'] }),
    ];
    const edges = { [M1]: { parents: [A] }, [M2]: { parents: [A] }, [M4]: { parents: [A] } };
    const flat = fenceWorld(LIT, { entries: twoLayer, edges });
    expect(layersCrossed(itemsOf(buildHeraldFeed(flat, { lens: 'advance' })))).toEqual(['WAR', 'GRAMMAR']);
    expect(braidsOf(buildHeraldFeed(flat, { lens: 'advance' }))).toHaveLength(0);
    const deep = fenceWorld(LIT, { entries: twoLayer.map((entry) => (entry.id === M4 ? { ...entry, kind: 'treaty_disclosure_opened', impactKind: 'treaty_disclosure_opened' } : entry)), edges });
    const [braid] = braidsOf(buildHeraldFeed(deep, { lens: 'advance' }));
    expect(braid.record.layers).toEqual(['WAR', 'GRAMMAR', 'INFO']);
  });

  test('THE SENTENCE (SR-17) names the ancestor, the layers crossed and the count, and scores 3 or better on READ 3\'s scorer', () => {
    const [braid] = braidsOf(buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' }));
    expect(braid.headline).toBe('In the wake of one cause, four consequences now run across politics, war, treaties, belief and trade: Schwarzholz declares war on Cathfield');
    const score = specificityOf(braid.headline);
    expect(score).toEqual({ named: true, magnitude: true, cause: true, consequence: true, score: 4 });
    // The frame alone, with an ancestor that names no town, still clears the floor.
    const bare = braidSentence({ count: 3, layers: ['WAR', 'GRAMMAR', 'INFO'], ancestorHeadline: 'A war is declared', decree: false });
    expect(bare).toBe('In the wake of one cause, three consequences now run across war, treaties and belief: A war is declared');
    expect(specificityOf(bare).score).toBeGreaterThanOrEqual(3);
    // The count past the closed table is spoken as a band, never a numeral.
    expect(braidSentence({ count: 25, layers: ['WAR', 'TRADE', 'FAITH'], ancestorHeadline: 'X', decree: false }))
      .toBe('In the wake of one cause, several consequences now run across war, trade and faith: X');
  });

  test('THE BODY is the chain rendered FORWARD through discourseKernel: the cause first, every consequence verbatim in reading order, the pivot last, only the kernel\'s connectives', () => {
    const [braid] = braidsOf(buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' }));
    const headlines = [ANCESTOR_HEADLINE, ...FENCE_NEWS.filter((entry) => entry.id !== RAID).map((entry) => entry.headline)];
    expect(braid.summary.startsWith(`In the spring of year 1: ${ANCESTOR_HEADLINE}.`)).toBe(true);
    let cursor = 0;
    const bridges = [];
    for (const headline of headlines) {
      const at = braid.summary.indexOf(headline, cursor);
      expect(at, headline).toBeGreaterThanOrEqual(cursor);
      bridges.push(braid.summary.slice(cursor, at).replace(/^\.\s*/, '').trim());
      cursor = at + headline.length;
    }
    expect(braid.summary.slice(cursor)).toBe('.');
    expect(bridges[0]).toBe('In the spring of year 1:');
    for (const bridge of bridges.slice(1)) expect(ALL_CONNECTIVES.has(bridge), bridge).toBe(true);
    expect(braid.reasons).toEqual(headlines);
  });

  test('THE RUNTIME NO-DECIMAL PIN: the braided prose carries no decimal, no em dash and no exclamation', () => {
    const [braid] = braidsOf(buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' }));
    for (const text of [braid.headline, braid.summary, ...braid.reasons]) {
      expect(/\d+\.\d+/.test(text), text).toBe(false);
      expect(/[—!]/.test(text), text).toBe(false);
    }
  });

  test('THE HERALD INDEX: the braid carries typed entity-ref slots, and each facet finds it by the refs it carries (SC-8: a pending facet lights)', () => {
    const lit = buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' });
    const [braid] = braidsOf(lit);
    const entries = itemsOf(lit);
    const found = (facets) => searchHerald({ entries, facets }).results.map((item) => item.id);
    for (const settlement of ['sch', 'obe', 'cat', 'tyr']) expect(found({ settlement: [settlement] }), settlement).toContain(braid.id);
    expect(found({ npc: ['sch:npc:ulrich'] })).toContain(braid.id);
    expect(found({ faction: ['sch.council'] })).toContain(braid.id);
    expect(found({ desk: [braid.section] })).toContain(braid.id);
    expect(found({ kind: [BRAID_KIND] })).toEqual([braid.id]);
    expect(found({ route: ['route.cat.tyr'] })).toContain(braid.id);
    expect(facetAvailability([braid]).find((facet) => facet.id === 'route')).toMatchObject({ declared: 'pending', populated: true, values: ['route.cat.tyr'] });
    expect(readableBy(braid, false)).toBe(true);
  });

  test('THE ADDRESS LAW: the braid names every town and every person its members name', () => {
    const lit = buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' });
    const [braid] = braidsOf(lit);
    const members = [M1, M2, M3, M4].map((id) => itemById(lit, id));
    for (const member of members) {
      for (const id of member.affectedIds) expect(braid.affectedIds, `${member.id} names ${id}`).toContain(id);
      if (member.subject.npcId) expect(braid.record.npcIds).toContain(member.subject.npcId);
    }
    expect([...braid.affectedIds].sort()).toEqual(['cat', 'obe', 'sch', 'tyr']);
    expect(braid.record.settlementIds).toEqual(['cat', 'obe', 'sch', 'tyr']);
    expect(braid.record.npcIds).toEqual(['sch:npc:ulrich', 'tyr:npc:klara']);
    expect(braid.record.factionIds).toEqual(['sch.council']);
    expect(braid.subject).toEqual(itemById(lit, A).subject);
  });

  test('THE WINDOW is closed and opens on the ancestor: a consequence on its last week joins, one a week past it does not', () => {
    const last = 5 + CASCADE_BRAID_TUNING.WINDOW_WEEKS;
    const at = (tick) => buildHeraldFeed(fenceWorld(LIT, { entries: withEntry(M1, { tick }) }), { lens: 'campaign' });
    expect(braidsOf(at(last))[0].record.memberIds).toEqual([M2, M3, M4, M1]);
    const past = at(last + 1);
    const braids = braidsOf(past);
    expect(braids.map((braid) => braid.record.memberIds)).toEqual([[M2, M3, M4]]);
    expect(itemById(past, M1).braidId).toBeUndefined();
  });

  test('A CAUSE FROM THE LAST ADVANCE still anchors this advance\'s consequences, named in its own recorded words', () => {
    const world = fenceWorld(LIT, { history: [pulse(0), pulse(4, [outcome(A, 3, ANCESTOR_HEADLINE)]), pulse(8)] });
    const feed = buildHeraldFeed(world, { lens: 'advance' });
    expect(itemById(feed, A), 'the cause is off this lens').toBeUndefined();
    const [braid] = braidsOf(feed);
    expect(braid.record.ancestorId).toBe(A);
    expect(braid.headline.endsWith(`: ${ANCESTOR_HEADLINE}`)).toBe(true);
    // A cause the records no longer hold cannot be named, so it anchors nothing.
    const forgotten = fenceWorld(LIT, { history: [pulse(0), pulse(4), pulse(8)] });
    expect(braidsOf(buildHeraldFeed(forgotten, { lens: 'advance' }))).toHaveLength(0);
    // Nor does a cause that recorded no words of its own.
    const wordless = fenceWorld(LIT, { ancestor: outcome(A, 5, '') });
    expect(braidsOf(buildHeraldFeed(wordless, { lens: 'advance' }))).toHaveLength(0);
  });

  test('THE AUDIENCE: a covert receipt never joins a braid, as member or as ancestor; a decision is never damped', () => {
    const covertMember = buildHeraldFeed(fenceWorld(LIT, { entries: withEntry(M2, { covert: true }) }), { lens: 'advance' });
    const [braid] = braidsOf(covertMember);
    expect(braid.record.memberIds, 'M3 descends from A through the hidden M2 and still joins').toEqual([M1, M3, M4]);
    expect(braid.summary.includes('An envoy of Tyrstad')).toBe(false);
    expect(itemById(covertMember, M2)).toMatchObject({ provenance: 'covert', severity: 0.45 });
    expect(itemById(covertMember, M2).braidId).toBeUndefined();
    const covertCause = fenceWorld(LIT, { ancestor: outcome(A, 5, ANCESTOR_HEADLINE, { covert: true }) });
    expect(braidsOf(buildHeraldFeed(covertCause, { lens: 'advance' }))).toHaveLength(0);
    const pending = buildHeraldFeed(fenceWorld(LIT, { entries: withEntry(M1, { status: 'pending' }) }), { lens: 'advance' });
    expect(itemById(pending, M1)).toMatchObject({ provenance: 'amendable', severity: 0.5 });
    expect(braidsOf(pending)[0].record.memberIds).toEqual([M2, M3, M4]);
  });

  test('THE EDITOR (R-37): the table\'s decree is a TRUE ROOT and the braid names the table', () => {
    const decreed = buildHeraldFeed(fenceWorld(LIT, { ancestor: outcome(A, 5, ANCESTOR_HEADLINE, { applyMode: 'proposal' }) }), { lens: 'advance' });
    const [fromTable] = braidsOf(decreed);
    expect(fromTable.record.root).toBe(DECREE_ROOT);
    expect(fromTable.headline).toBe('In the wake of one decree set down by the table\'s hand, four consequences now run across politics, war, treaties, belief and trade: Schwarzholz declares war on Cathfield');
    const [plain] = braidsOf(buildHeraldFeed(fenceWorld(LIT), { lens: 'advance' }));
    expect(plain.record.root).toBe(A);
    expect(plain.headline.startsWith('In the wake of one cause,')).toBe(true);
    // THE MARKER IS THE NORMALIZER'S OWN CHIP: the table is the root exactly when the Herald files
    // the ancestor as the table's act (amendable), over every marker shape. ⚠ MEASURED DIVERGENCE,
    // kept visible rather than smoothed: chronicleGraph.isDecreeNode also counts a record carrying
    // only a proposalPayload, which the feed files as canon, so its braid names its own words.
    const shapes = [
      [{}, false, false], [{ applyMode: 'proposal' }, true, true], [{ applyMode: 'auto' }, false, false],
      [{ proposalPayload: { verb: 'declare_war' } }, true, false], [{ status: 'pending' }, false, true],
    ];
    for (const [extra, chronicleSays, tableRoot] of shapes) {
      const record = outcome(A, 5, ANCESTOR_HEADLINE, extra);
      expect(isDecreeNode(record), JSON.stringify(extra)).toBe(chronicleSays);
      const feed = buildHeraldFeed(fenceWorld(LIT, { ancestor: record }), { lens: 'advance' });
      const [braid] = braidsOf(feed);
      expect(itemById(feed, A).provenance === 'amendable', JSON.stringify(extra)).toBe(tableRoot);
      expect(braid.record.root === DECREE_ROOT, JSON.stringify(extra)).toBe(tableRoot);
    }
  });

  test('THE EDITOR (R-37): a phantom\'s record-only outcome is a member and never an ancestor: its resolution rides the decree cause, which no filed record carries', () => {
    const RECORD_ONLY = PHANTOM_CONSEQUENCE_POLICIES[0];
    const decree = 'decree.obe.1';
    const cause = { decreeId: decree, saveId: 'obe', opType: 'declare-war', cause: DECREE_CAUSE, tickRef: 'pulse.5', orderIndex: 0, offStage: true, consequence: RECORD_ONLY };
    const history = [pulse(4), { ...pulse(8, [outcome(A, 5, ANCESTOR_HEADLINE)]), decreeCauses: [cause] }];
    const hung = { [M1]: { parents: [decree] }, [M2]: { parents: [decree] }, [M3]: { parents: [decree] }, [M4]: { parents: [decree] } };
    // THE CONTROL FIRST: the same four receipts hung on the filed ancestor braid in this world.
    expect(braidsOf(buildHeraldFeed(fenceWorld(LIT, { history }), { lens: 'advance' }))).toHaveLength(1);
    // Hung on the record-only act instead, they braid nothing: the act is never an ancestor.
    expect(braidsOf(buildHeraldFeed(fenceWorld(LIT, { history, edges: hung }), { lens: 'advance' }))).toHaveLength(0);
    // …and a receipt carrying the resolution is braided as a member like any other.
    const marked = buildHeraldFeed(fenceWorld(LIT, { entries: withEntry(M1, { offStage: true, consequence: RECORD_ONLY }) }), { lens: 'advance' });
    expect(braidsOf(marked)[0].record.memberIds).toEqual([M1, M2, M3, M4]);
    // THE SHAPE THIS RESTS ON, pinned so the day it moves reds here: the leaf reads no decree cause.
    const code = /** @type {{ code: string }} */ (SOURCES.find((file) => file.rel === LEAF)).code;
    expect(/\bdecreeCauses\b|\bconsequence\b|\boffStage\b/.test(code)).toBe(false);
  });

  test('PERSISTS NOTHING, DRAWS NOTHING, ANSWERS THE SAME TWICE', () => {
    const world = fenceWorld(LIT);
    const before = JSON.stringify(world);
    const first = JSON.stringify(buildHeraldFeed(world, { lens: 'advance' }));
    expect(JSON.stringify(world), 'the campaign is read, never written').toBe(before);
    expect(JSON.stringify(buildHeraldFeed(world, { lens: 'advance' }))).toBe(first);
    const code = /** @type {{ code: string }} */ (SOURCES.find((file) => file.rel === LEAF)).code;
    expect(/\b(?:createPRNG|hash01|fnv1a32|Math\.random|Date\.now|localeCompare|setSpatialLedger|dropSpatialLedger|appendPulseHistory)\b/.test(code)).toBe(false);
    expect(/\bnew Date\b/.test(code)).toBe(false);
  });
});

describe('CW-1: the registers the braid answers to', () => {
  test('THE LAYER AUTHORITY IS THE REGISTRY: the braid\'s table is the registry\'s own projection, both ways, and the lexicon is total over its layers', () => {
    /** @type {Map<string, Array<{ direction: string }>>} */
    const declaring = new Map();
    for (const row of COUPLING_REGISTRY) for (const kind of row.kinds || []) declaring.set(kind, [...(declaring.get(kind) || []), row]);
    /** @type {Record<string, string[]>} */
    const derived = {};
    for (const [kind, rows] of declaring) {
      const ends = rows[0].direction.split('→');
      derived[kind] = ends.filter((layer, i) => ends.indexOf(layer) === i && rows.every((row) => row.direction.split('→').includes(layer)));
    }
    expect(Object.keys(derived).length, 'the registry declares kinds, so the projection measures something').toBeGreaterThan(10);
    expect(JSON.parse(JSON.stringify(BRAID_LAYERS_OF_KIND))).toEqual(derived);
    const keys = Object.keys(BRAID_LAYERS_OF_KIND);
    expect(keys).toEqual([...keys].sort());
    const layers = new Set(COUPLING_REGISTRY.flatMap((row) => row.direction.split('→')));
    expect(Object.keys(LAYER_WORDS).sort()).toEqual([...layers].sort());
    // A kind no row declares crosses nothing, and no prototype key is a layer.
    expect(layersCrossed([{ kind: 'webwar_raid' }, { kind: 'war_declared' }, { kind: 'constructor' }, { kind: '__proto__' }])).toEqual([]);
  });

  test('THE RE-SPELLINGS ARE HELD EQUAL: the table, the INTERVAL_WEEKS window, the routine band', () => {
    expect(DECREE_ROOT).toBe(DECREE_CAUSE);
    expect(CASCADE_BRAID_TUNING.WINDOW_WEEKS).toBe(INTERVAL_WEEKS.one_season);
    expect(severityBand({ severity: CASCADE_BRAID_TUNING.DAMPED_SEVERITY })).toBe('routine');
    expect(CASCADE_BRAID_TUNING).toEqual({ MEMBER_FLOOR: 3, WINDOW_WEEKS: 13, LAYER_FLOOR: 3, DAMPED_SEVERITY: 0.35 });
  });

  test('THE ENGINE/DISPLAY SPLIT (SC-4): the braid\'s whole import closure is reviewed, and its one engine-directory module imports nothing', () => {
    const closure = new Set();
    const queue = [LEAF];
    while (queue.length) {
      const rel = /** @type {string} */ (queue.pop());
      if (closure.has(rel)) continue;
      closure.add(rel);
      const source = commentsOnly(readFileSync(join(ROOT, rel), 'utf8'));
      for (const [, spec] of source.matchAll(/from '([^']+)'/g)) {
        if (!spec.startsWith('.')) continue;
        const target = relative(ROOT, resolvePath(dirname(join(ROOT, rel)), spec)).replace(/\\/g, '/');
        if (existsSync(join(ROOT, target))) queue.push(target);
      }
    }
    expect([...closure].sort()).toEqual([
      'src/domain/deterministicSort.js',
      'src/domain/display/cascadeBraid.js',
      'src/domain/display/chronicleGraph.js',
      'src/domain/display/discourseKernel.js',
      'src/domain/display/heraldCausalGrammar.js',
      'src/domain/display/heraldIndex.js',
      'src/domain/display/humanizeEngineTokens.js',
      'src/domain/display/numberWords.js',
      'src/domain/display/receiptClauseFloor.js',
      'src/domain/worldPulse/bandFamilies.js',
    ]);
    const engine = [...closure].filter((rel) => rel.startsWith('src/domain/worldPulse/'));
    expect(engine).toEqual(['src/domain/worldPulse/bandFamilies.js']);
    expect(/from '/.test(commentsOnly(readFileSync(join(ROOT, engine[0]), 'utf8'))), 'the family leaf imports nothing').toBe(false);
  });
});
