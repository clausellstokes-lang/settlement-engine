/**
 * tests/domain/dailyLifeNoRepeat.test.js — DAILY-4 · D4C-1 unit (1), NO CONDITION STATED TWICE (the chair's E133 (1); the
 * brief `docs/chair/2026-11-20/content/daily/briefs/D4C-1-REPEAT-AND-POSSESSIVE.md`; the measure `measures/D4C/`).
 *
 * A REPEAT is two parts, in two slots of one page, that each STATE the same condition (hxd-city-0 opened "The country
 * around is overrun with beasts…" and closed "Beasts now roam the country around…"). What a part does is read from its
 * pool branch's DECLARATION (`src/data/dailyLife/*.js :: <POOL>_DOES`: `states` / `consequence` / `names`), never from
 * its words. A part is found by D4C's instrument (`measures/D4C/measure.d4c.mjs :: readSlot`, copied): every branch's
 * keyed pick by THE ROUTE, kept where its template is found in the printed text.
 *
 * On 30 born places (five a size, M1's births `hxd-<size>-0..4`; the 900 in the measure's script):
 *   (a) every branch of every Daily Life pool declares what it does;
 *   (b) the instrument reads every printed slot back to its pool rows (no part unread);
 *   (c) no page prints two parts that state one condition (the public eight and the owner-only line);
 *   (d) the outsider line is never emptied;
 *   (e) the public eight are equal on the owner's and the reader's derivation, and on the per-slot read the PDF's
 *       chapter takes (`deriveDailyLifeSlot`).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { deriveDailyLife, deriveDailyLifeSlot, DAILY_LIFE_PAGE_SLOTS } from '../../src/domain/dailyLife.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { deriveAllCapacities } from '../../src/domain/capacityModel.js'; // CLOSE-7 THE MIRROR: the profile the pools' `food production` atom reads
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { INSTITUTION_KIND_PATTERNS, ACCESS_ONLY } from '../../src/domain/facts/institutions.js';
import { isMarketInstitution } from '../../src/domain/facts/market.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { nativeSemanticName } from '../../src/domain/content/customContentSemanticAuthority.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';
import { pickRendezvous } from '../../src/kernel/proseHash.js';
import { pickKeyOf } from '../../src/domain/display/pickKey.js'; // point 124: the town's pick key
import * as Gathering from '../../src/data/dailyLife/gatheringPlaces.js';
import * as Dawn from '../../src/data/dailyLife/dawnWork.js';
import * as Child from '../../src/data/dailyLife/childWarnings.js';
import * as Dm from '../../src/data/dailyLife/commonerResentmentsDm.js';
import * as Resent from '../../src/data/dailyLife/commonerResentments.js';
import * as Food from '../../src/data/dailyLife/foodCulture.js';
import * as Outsider from '../../src/data/dailyLife/outsiderImpressions.js';
import * as Unspoken from '../../src/data/dailyLife/unspokenTopics.js';
import * as Recent from '../../src/data/dailyLife/recentChanges.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DM = 'commoner_resentments_dm';
const OUT = 'outsider_impressions';
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @type {Record<string, Record<string, ReadonlyArray<{ id: string, text: string, needs?: ReadonlyArray<string> }>>>} */
const POOLS = {
  outsider_impressions: Outsider.OUTSIDER_IMPRESSIONS, dawn_work: Dawn.DAWN_WORK, food_culture: Food.FOOD_CULTURE,
  gathering_places: { named: Gathering.GATHERING_NAMED, plain: Gathering.GATHERING_PLAIN }, child_warnings: Child.CHILD_WARNINGS,
  commoner_resentments: Resent.COMMONER_RESENTMENTS, unspoken_topics: Unspoken.UNSPOKEN_TOPICS, recent_changes: Recent.RECENT_CHANGES,
  [DM]: Dm.COMMONER_RESENTMENTS_DM,
};
/** THE DECLARATIONS, by slot (read from the pool files; absent before D4C-1). @type {Record<string, any>} */
const DOES = {
  outsider_impressions: /** @type {any} */ (Outsider).OUTSIDER_IMPRESSIONS_DOES, dawn_work: /** @type {any} */ (Dawn).DAWN_WORK_DOES,
  food_culture: /** @type {any} */ (Food).FOOD_CULTURE_DOES, gathering_places: /** @type {any} */ (Gathering).GATHERING_DOES,
  child_warnings: /** @type {any} */ (Child).CHILD_WARNINGS_DOES, commoner_resentments: /** @type {any} */ (Resent).COMMONER_RESENTMENTS_DOES,
  unspoken_topics: /** @type {any} */ (Unspoken).UNSPOKEN_TOPICS_DOES, recent_changes: /** @type {any} */ (Recent).RECENT_CHANGES_DOES,
  [DM]: /** @type {any} */ (Dm).COMMONER_RESENTMENTS_DM_DOES,
};
/** @param {string} slot @param {string} branch @returns {string|null} the condition the branch states */
const statesOf = (slot, branch) => DOES[slot]?.[branch]?.states ?? null;

// the placeholders a slot's deriver FILLS before the route (dailyLife.js: withGovernment, withPower, the beat's fill)
/** @param {string} slot @param {string} branch @returns {string[]} */
const FILLED = (slot, branch) => {
  if (slot === 'commoner_resentments') return ['gov'];
  if (slot === OUT && (branch === 'power' || branch === 'power.level')) return ['power', 'Power'];
  if (slot === OUT && branch.startsWith('services.')) return ['gov'];
  if (slot === 'recent_changes' && branch === 'beat') return ['Event', 'event'];
  return [];
};

// ── the house finder, COPIED from dailyLife.js (DAILY_HOUSES, nameableRows, houseFinder), as the measure copies it ──
const SACRED_ORDER = [/\bcathedral/i, /\btemple|\bchurch|\babbey|\bchapel/i, /\bshrine/i, /\bmonaster|\bfriary\b/i];
const CHURCH_ORDER = [SACRED_ORDER[0], SACRED_ORDER[1], SACRED_ORDER[3]];
const MARKET_NAME = /\bmarkets?\b(?!\s*squares?)/i;
const DOCKS_NAME = /\bdocks?\b|\bwharf|\bquays?\b/i;
/** @param {any} inst */
const rowName = (inst) => String(nativeSemanticName(inst) || inst?.name || '');
/** @param {any} s @returns {any[]} */
const nameableRows = (s) => liveInstitutions(s).filter((/** @type {any} */ i) => !isHideableHouse(i) && !ACCESS_ONLY.test(rowName(i)));
/** @param {any[]} rows @param {RegExp} re @param {(i: any) => boolean} [extra] */
const firstRow = (rows, re, extra = () => true) => rows.find((i) => re.test(rowName(i)) && extra(i));
/** @type {Record<string, (rows: any[]) => any>} */
const DAILY_HOUSES = {
  sacred: (rows) => SACRED_ORDER.map((re) => firstRow(rows, re)).find(Boolean),
  church: (rows) => CHURCH_ORDER.map((re) => firstRow(rows, re)).find(Boolean),
  cathedral: (rows) => firstRow(rows, /\bcathedral/i),
  market: (rows) => firstRow(rows, MARKET_NAME, isMarketInstitution),
  square: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.square, isMarketInstitution),
  inn: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.tavern),
  mill: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.mill),
  bathhouse: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.bathhouse),
  bridge: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.bridge),
  docks: (rows) => firstRow(rows, DOCKS_NAME),
  theater: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.theatre),
};
/** @param {any} s @returns {(k: string) => any} */
function houseFinder(s) {
  const rows = nameableRows(s);
  /** @type {Record<string, any>} */
  const found = {};
  return (k) => (k in found ? found[k] : (found[k] = DAILY_HOUSES[k]?.(rows)));
}
/** @param {string} v */
const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** @param {string} text @returns {RegExp} a template, its placeholders wildcards */
function templateRe(text) {
  const src = text.split(/\{[^{}]*\}/).map(esc).join('(.+?)');
  return new RegExp(/\{[^{}]*\}$/.test(text) ? src.replace(/\(\.\+\?\)$/, '([^,.]+)') : src);
}

/** @typedef {{ slot: string, branch: string, id: string, said: string, at: number, states: string|null }} Part */
/**
 * THE INSTRUMENT (the measure's `readSlot`): every branch's pick by THE ROUTE; the ones found in the printed text are the parts.
 * @param {any} rec @param {string} slot @param {string} text @param {(k: string) => any} house
 * @returns {{ parts: Part[], uncovered: string }}
 */
function readSlot(rec, slot, text, house) {
  const facts = factsOf(rec);
  const capacities = deriveAllCapacities(rec);
  const name = typeof rec.name === 'string' && rec.name ? rec.name : null;
  /** @type {Part[]} */
  const parts = [];
  for (const [branch, pool] of Object.entries(POOLS[slot])) {
    const filled = FILLED(slot, branch);
    // CLOSE-7 THE MIRROR: the deriver hands the fare and Dawn Work the capacity profile (`food production`), so the instrument does
    const eligible = filterDeclared(/** @type {any} */ (pool), { facts: /** @type {any} */ (facts), ctx: { capacities }, poolId: `dailyLife.${slot}.${branch}`, surface: 'dailyLife' })
      .filter((/** @type {any} */ l) => [...l.text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).filter((k) => !filled.includes(k)).every((k) => !!house(k)));
    const pick = /** @type {any} */ (pickRendezvous(eligible, pickKeyOf(rec, name) ? `${pickKeyOf(rec, name)}::dailyLife.${slot}::${branch}` : null, (/** @type {any} */ l) => l.id));
    if (!pick) continue;
    const m = templateRe(pick.text).exec(text);
    if (m) parts.push({ slot, branch, id: pick.id, said: m[0], at: m.index, states: statesOf(slot, branch) });
  }
  parts.sort((a, b) => a.at - b.at || b.said.length - a.said.length);
  const kept = parts.filter((p, i) => parts.findIndex((q) => q.at === p.at && q.said.length === p.said.length) === i)
    .filter((p, _, all) => !all.some((q) => q !== p && q.at <= p.at && q.at + q.said.length >= p.at + p.said.length && q.said.length > p.said.length));
  let rest = text;
  for (const p of kept) rest = rest.split(p.said).join(' ');
  if (slot === 'child_warnings') rest = rest.replace(/^\s*Children are warned about /, '').replace(/\s*, and about /g, ' ').replace(/\.\s*$/, '');
  return { parts: kept, uncovered: rest.replace(/\s+/g, '') };
}

/** @typedef {{ seed: string, rec: any, pub: Record<string, any>, own: Record<string, any>, parts: Part[], uncovered: string[] }} Born */
/** @type {Born[]} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 5; i++) {
    const seed = `hxd-${size}-${i}`;
    const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const pub = deriveDailyLife(rec).slots;
    const own = deriveDailyLife(rec, { audience: 'owner' }).slots;
    const house = houseFinder(rec);
    /** @type {Part[]} */
    const parts = [];
    /** @type {string[]} */
    const uncovered = [];
    for (const k of [...DAILY_LIFE_PAGE_SLOTS, DM]) {
      const text = String((k === DM ? own : pub)[k]?.text ?? '').trim();
      if (!text) continue;
      const read = readSlot(rec, k, text, house);
      parts.push(...read.parts);
      if (read.uncovered) uncovered.push(`${k}: "${read.uncovered.slice(0, 60)}"`);
    }
    births.push({ seed, rec, pub, own, parts, uncovered });
  }
}, 300_000);

const seeds = () => births.map((b) => b.seed);
const at = (/** @type {string} */ seed) => /** @type {Born} */ (births.find((b) => b.seed === seed));

describe('D4C-1 (1): no condition stated twice on a Daily Life page', () => {
  it('the born places number 30, five a size (M1\'s births)', () => {
    expect(births).toHaveLength(30);
  });

  it('(a) every branch of every Daily Life pool declares what it does: states a condition, a consequence, or names', () => {
    const bad = [];
    for (const [slot, pools] of Object.entries(POOLS)) {
      if (!DOES[slot]) { bad.push(`${slot}: no declaration table`); continue; }
      for (const branch of Object.keys(pools)) {
        const d = DOES[slot][branch];
        const ok = !!d && ((typeof d.states === 'string' && /^[a-z_]+:[\w:-]+$/.test(d.states) && Object.keys(d).length === 1)
          || (d.consequence === true && Object.keys(d).length === 1) || (d.names === true && Object.keys(d).length === 1));
        if (!ok) bad.push(`${slot} :: ${branch}: ${JSON.stringify(d)}`);
      }
      for (const branch of Object.keys(DOES[slot])) if (!(branch in pools)) bad.push(`${slot} :: ${branch}: declared, no pool`);
    }
    expect(bad, 'every branch declares one of { states }, { consequence }, { names }').toEqual([]);
  });

  it('(b) the instrument reads every printed slot back to its pool rows (no part unread)', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      expect(at(seed).uncovered, `${seed}: printed text read back to no pool row`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'every printed slot is read back wholly');
  });

  it('the 30 hold the case: on some page another slot states a condition an outsider branch states (no vacuous pass)', () => {
    expect(DOES[OUT], 'the outsider pool declares').toBeTruthy();
    const outsiderStates = new Set(Object.keys(POOLS[OUT]).map((b) => statesOf(OUT, b)).filter(Boolean));
    const pages = births.filter((b) => b.parts.some((p) => p.slot !== OUT && p.slot !== DM && p.states && outsiderStates.has(p.states)));
    expect(pages.length, 'pages where another slot states a condition the outsider line can state').toBeGreaterThan(0);
  });

  it('(c) no page prints two parts, in two slots, that state one condition (the public eight and the owner-only line)', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      expect(DOES[OUT], 'the pools declare what they do').toBeTruthy();
      const twice = [];
      const { parts } = at(seed);
      for (let a = 0; a < parts.length; a++) for (let b = a + 1; b < parts.length; b++) {
        const A = parts[a], B = parts[b];
        if (A.slot !== B.slot && A.states && A.states === B.states) twice.push(`${A.states}: [${A.slot} ${A.branch}#${A.id}] "${A.said}" || [${B.slot} ${B.branch}#${B.id}] "${B.said}"`);
      }
      expect(twice, `${seed}: one condition stated twice: ${twice.join(' ; ')}`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no page states one condition twice');
  });

  it('(d) the outsider line is never emptied: every born place prints one', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      expect(String(at(seed).pub[OUT]?.text ?? '').trim(), `${seed}: the outsider line is empty`).not.toBe('');
    });
    expectNoSeedFailures(failures, 'the outsider line prints on every born place');
  });

  it('(e) the public eight are equal on the owner\'s and the reader\'s derivation, and on the per-slot read (the PDF\'s)', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec, pub, own } = at(seed);
      for (const k of DAILY_LIFE_PAGE_SLOTS) {
        expect(own[k].text, `${seed} ${k}: the owner's page`).toBe(pub[k].text);
        expect(deriveDailyLifeSlot(k, rec)?.text, `${seed} ${k}: the per-slot read`).toBe(pub[k].text);
      }
    });
    expectNoSeedFailures(failures, 'the public eight print the same on every read');
  });
});
