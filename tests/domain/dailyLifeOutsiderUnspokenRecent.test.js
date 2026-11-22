/**
 * tests/domain/dailyLifeOutsiderUnspokenRecent.test.js — DAILY-3 · B3 E3, `outsider_impressions`, `unspoken_topics` AND
 * `recent_changes` (DAILY-1 `lines/L2/LINES-2.md` § 3, § 4 and § 5, revised by `LINES-2b.md` § 1 to § 4 and § 8, as the
 * chair ruled: rulings 7, 8, 14 and 15; the dispatch `docs/chair/2026-11-20/content/daily/briefs/B3-E3-DAILY-3-DISPATCH.md`).
 *
 * On 30 born places (five a size, M1's births `hxd-<size>-0..4`; the 900 live in `measures/B3/E3`):
 *   (a) M1's ENGINE LINES print on no place: `unspoken_topics`' `the matter referenced as "the wound"` (M1: 900/900);
 *       `recent_changes`' "… has come to a head" / "… is the new shape of things" over an engine label ("Civic stability
 *       at risk has come to a head."); `outsider_impressions`' "… is the obvious unspoken weight" and "several civic
 *       services run short"; no engine label ("civic stability", "economic fragility", "at risk"), no age, no "founding
 *       survey", no "town" below a town, no bracket.
 *   (b) THE CALM RULE (ruling 8): the defence's order and supply ratings are no threat. A place with no real threat said
 *       takes no threat line in `outsider_impressions` (an order line only from `services.defense`, where the defence
 *       lens is strained); `recent_changes` takes no rating as an acute threat or as a source.
 *   (c) RULING 7: no hidden or rumoured threat is said by any of the three; a veiled power is never named; a crime wound
 *       falls to the next tension the record holds; no crime or corruption beat is said.
 *   (d) THE ROUTE (ruling 11): every printed sentence is its branch's keyed pick (`pickVariantMixed` keyed
 *       `<record.name>::dailyLife.<slot>::<branch>`) of the slot's own pool (`src/data/dailyLife/outsiderImpressions.js`,
 *       `unspokenTopics.js`, `recentChanges.js`), admitted by its declared atoms (`facts/drawDeclared.js ::
 *       filterDeclared`); a slot with no true line is the EMPTY string. D4C-1 (the chair's E133 (1)): the outsider line
 *       yields a part whose condition another printed slot STATES (by the branches' declarations) and takes its next part
 *       by its own ranking, never emptied (`dailyLifeNoRepeat.test.js`); the oracle below does the same.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import { deriveAllThreatProfiles } from '../../src/domain/threatProfile.js';
import { deriveAllCapacities, CAPACITY_NAMES, VISIBLE_CAPACITY_LENSES } from '../../src/domain/capacityModel.js';
import { deriveAllFactionProfiles } from '../../src/domain/factionProfile.js';
import { deriveAllActiveConditions } from '../../src/domain/activeConditions.js';
import { deriveHistoryBeats } from '../../src/domain/historyBeats.js';
import { leaderLeadOfRecord } from '../../src/domain/facts/leaderLead.js';
import { isVeiledPower } from '../../src/domain/people/cardVeil.js';
import { EVENT_TYPE_NAMES } from '../../src/data/historyData.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { pickVariantMixed } from '../../src/kernel/proseHash.js';
import { fillAgreement, powerNameAfterArticle, powerNameWithArticle, powerPossessive } from '../../src/domain/display/powerSentenceName.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const BAD = ['strained', 'critical', 'collapsed'];

/** @typedef {{ seed: string, size: string, rec: any, outsider: string, unspoken: string, recent: string }} Born */
/** @type {Born[]} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 5; i++) {
    const seed = `hxd-${size}-${i}`;
    const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const slots = deriveDailyLife(rec).slots;
    births.push({ seed, size, rec, outsider: slots.outsider_impressions.text, unspoken: slots.unspoken_topics.text, recent: slots.recent_changes.text });
  }
}, 300_000);

const seeds = () => births.map((b) => b.seed);
const at = (/** @type {string} */ seed) => /** @type {Born} */ (births.find((b) => b.seed === seed));
const SLOTS = /** @type {const} */ (['outsider', 'unspoken', 'recent']);

/** The defence's order and supply ratings (`threatProfile.js` step 2): no threat (ruling 8). @param {any} t */
const isRating = (t) => t.originSurface === 'defenseProfile' && (t.type === 'unrest' || t.type === 'economic_collapse');

/** [slot, what, the pattern that must print nowhere] */
const ENGINE = /** @type {const} */ ([
  ['unspoken', 'M1: the matter referenced as "the wound"', /"the wound"|the matter referenced/i],
  ['unspoken', 'the old frame "Locals will not openly discuss"', /Locals will not openly discuss/],
  ['recent', 'M1: "… has come to a head" (an engine label said as a change)', /has come to a head/i],
  ['recent', 'M1: "… is the new shape of things" (a condition label)', /new shape of things/i],
  ['recent', 'an age ("N years ago")', /\b\d+\s+years?\s+ago\b/i],
  ['recent', 'the founding survey', /founding survey/i],
  ['outsider', 'M1: "… is the obvious unspoken weight" (a threat label)', /obvious unspoken weight/i],
  ['outsider', 'M1: "several civic services run short" (a hedge)', /civic services run short|missing watch, slow service/i],
  ['outsider', 'an engine label', /civic stability|economic fragility|\bat risk\b/i],
  ['recent', 'an engine label', /civic stability|economic fragility|\bat risk\b/i],
  ['unspoken', 'an engine label', /civic stability|economic fragility|\bat risk\b/i],
]);

describe('the three slots: M1\'s engine lines print on no born place (a)', () => {
  it('the born places number 30, five a size (M1\'s births)', () => {
    expect(births).toHaveLength(30);
  });
  for (const [slot, what, re] of ENGINE) {
    it(`${slot}: ${what} prints nowhere`, () => {
      const failures = collectSeedFailures(seeds(), (seed) => {
        const x = at(seed);
        expect(re.test(x[slot]), `${seed}: "${x[slot]}"`).toBe(false);
      });
      expectNoSeedFailures(failures, `${slot}: ${what}`);
    });
  }
  it('no "town" below a town and no bracket in any of the three', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const x = at(seed);
      for (const slot of SLOTS) {
        expect(['thorp', 'hamlet', 'village'].includes(x.size) && /\btowns?\b/i.test(x[slot]), `${seed} ${slot}: "${x[slot]}"`).toBe(false);
        expect(/[()]/.test(x[slot]), `${seed} ${slot}: a bracket: "${x[slot]}"`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'no "town" below a town, no bracket');
  });
});

describe('ruling 7: nothing hidden, no veiled power, no crime said (c)', () => {
  it('no hidden or rumoured threat\'s label prints in any of the three, nor a veiled power\'s name', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const x = at(seed);
      const hidden = deriveAllThreatProfiles(x.rec).filter((t) => t.visibility !== 'open').map((t) => String(t.label).toLowerCase());
      const veiled = (x.rec.powerStructure?.factions || []).filter((/** @type {any} */ f) => isVeiledPower(f))
        .map((/** @type {any} */ f) => String(f.faction ?? f.name ?? '')).filter(Boolean);
      for (const slot of SLOTS) {
        for (const label of hidden) expect(x[slot].toLowerCase().includes(label), `${seed} ${slot}: hidden "${label}"`).toBe(false);
        for (const name of veiled) expect(x[slot].includes(name), `${seed} ${slot}: veiled "${name}"`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'nothing hidden, no veiled power');
  });
});

// ── the oracle: what each slot says on a record, from the pools (ruling 8, ruling 7, LINES-2b) ──
/** @param {string} t @param {string} name */
const fillPower = (t, name) => fillAgreement(t, { power: name })
  .replace(/\{power's\}/g, `the ${powerPossessive(powerNameAfterArticle(name))}`)
  .replace(/\{Power\}/g, powerNameWithArticle(name, true)).replace(/\{power\}/g, powerNameWithArticle(name));
/** @param {string} t @param {string} gov */
const fillGov = (t, gov) => fillAgreement(t, { gov }).replace(/\{gov\}/g, powerNameWithArticle(gov));
/** @param {string} t @param {string} ev */
const fillEvent = (t, ev) => { const bare = ev.replace(/^the\s+/i, ''); return t.replace(/\{Event\}/g, `The ${bare}`).replace(/\{event\}/g, `the ${bare}`); };

/** @param {any} t the threat's form, as LINES-2 § 3 splits it @param {any} rec */
const formOf = (t, rec) => {
  if (t.type === 'unrest') return t.originSurface === 'activeConditions' ? 'void' : 'stressor';
  if (t.type === 'economic_collapse') return t.originSurface === 'activeConditions' ? 'route' : 'stressor';
  if (t.type === 'monster_pressure') return t.originSurface === 'config' ? (rec.config?.monsterThreat === 'plagued' ? 'overrun' : 'frontier') : 'stressor';
  return 'any';
};

/**
 * @param {any} rec
 * @param {{ OUTSIDER_IMPRESSIONS: any, UNSPOKEN_TOPICS: any, RECENT_CHANGES: any, [k: string]: any }} P
 */
function expected(rec, P) {
  const facts = factsOf(rec);
  /** @param {string} slot @param {any} pools @param {string} branch @param {(t: string) => string} [fill] */
  const say = (slot, pools, branch, fill = (t) => t) => {
    const pick = pickVariantMixed(filterDeclared(pools[branch] || [], { facts }), `${rec.name}::dailyLife.${slot}::${branch}`);
    return pick ? fill(pick.text) : '';
  };
  const threats = deriveAllThreatProfiles(rec);
  const caps = deriveAllCapacities(rec);
  const gov = String(rec.powerStructure?.government ?? '');

  // unspoken_topics
  const history = deriveHistoryBeats(rec);
  const tensions = Array.isArray(rec.history?.currentTensions) ? rec.history.currentTensions : [];
  const types = tensions.map((/** @type {any} */ t) => (t && typeof t === 'object' ? t.type : undefined));
  const CRIME = ['crime_wave', 'corruption_scandal'];
  let type = types[0];
  if (history.unresolvedWound && CRIME.includes(type)) type = types.slice(1).find((/** @type {any} */ x) => !CRIME.includes(x) && P.UNSPOKEN_TOPICS[`wound.${x}`]);
  const unspoken = history.unresolvedWound && type && P.UNSPOKEN_TOPICS[`wound.${type}`] ? say('unspoken_topics', P.UNSPOKEN_TOPICS, `wound.${type}`) : '';

  // recent_changes
  const rc = [];
  const beat = history.recentDisruption;
  const ev = String(beat?.references?.eventName ?? '');
  if (beat && ev && ev !== EVENT_TYPE_NAMES.crime_wave && ev !== EVENT_TYPE_NAMES.corruption_scandal) rc.push({ b: 'beat', t: say('recent_changes', P.RECENT_CHANGES, 'beat', (t) => fillEvent(t, ev)) });
  const fresh = deriveAllActiveConditions(rec).filter((c) => (c.duration?.elapsedTicks ?? 0) < 2);
  for (const c of fresh.slice(0, 2)) { const b = `condition.${c.archetype}`; if (P.RECENT_CHANGES[b] && !rc.some((p) => p.b === b)) rc.push({ b, t: say('recent_changes', P.RECENT_CHANGES, b) }); }
  const acuteOf = (/** @type {any} */ t) => !isRating(t) && (t.currentStage === 'imminent' || t.currentStage === 'realized');
  const acute = threats.filter((t) => t.visibility === 'open' && acuteOf(t)).sort((a, b) => b.severity - a.severity);
  for (const t of acute.slice(0, 2)) { const b = `threat.${t.type}.${formOf(t, rec)}.${t.currentStage}`; if (P.RECENT_CHANGES[b] && !rc.some((p) => p.b === b)) rc.push({ b, t: say('recent_changes', P.RECENT_CHANGES, b) }); }
  const anySource = !!beat || fresh.length > 0 || threats.some(acuteOf);
  if (!rc.length && !anySource) rc.push({ b: 'calm', t: say('recent_changes', P.RECENT_CHANGES, 'calm') });

  // outsider_impressions, LAST (D4C-1, the chair's E133 (1)): the conditions the other slots STATE, read from their
  // branches' declarations (`<POOL>_DOES`; dawn, gathering, child warnings and the grievances declare none); the line
  // yields a part whose condition one of them states, takes its next part by its own ranking, and is never emptied
  const stated = new Set();
  /** @param {any} does @param {string} branch */
  const statedBy = (does, branch) => { const k = does?.[branch]?.states; if (k) stated.add(k); };
  for (const p of rc) if (p.t) statedBy(P.RECENT_CHANGES_DOES, p.b);
  if (unspoken) statedBy(P.UNSPOKEN_TOPICS_DOES, `wound.${type}`);
  const band = caps.capacities.food_production.band;
  const foodBranch = band === 'surplus' ? (threats.some((t) => t.type === 'famine' || t.type === 'siege') ? 'surplus.wanting' : 'surplus')
    : ['adequate', 'strained', 'critical'].includes(band) ? band : 'collapsed';
  if (say('food_culture', P.FOOD_CULTURE, foodBranch)) statedBy(P.FOOD_CULTURE_DOES, foodBranch);
  /** @param {string} branch @param {Set<string>} st */
  const yields = (branch, st) => st.has(P.OUTSIDER_IMPRESSIONS_DOES?.[branch]?.states);
  const top = deriveAllFactionProfiles(rec).slice().sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  const row = top && (rec.powerStructure?.factions || []).find((/** @type {any} */ f) => f.faction === top.name);
  const lenses = VISIBLE_CAPACITY_LENSES.filter((n) => BAD.includes(caps.bands[n])).map((n) => `services.${n}`);
  const strained = CAPACITY_NAMES.filter((n) => BAD.includes(caps.bands[n])).length;
  /** @param {Set<string>} st @returns {{ parts: string[], real: boolean }} */
  const outsiderWith = (st) => {
    const out = [];
    if (top && !isVeiledPower(row) && top.archetype !== 'criminal') {
      const lead = leaderLeadOfRecord(rec).leadOverSecond;
      const b = lead === null || lead > 6 ? 'power' : 'power.level';
      if (!yields(b, st)) out.push(say('outsider_impressions', P.OUTSIDER_IMPRESSIONS, b, (t) => fillPower(t, top.name)));
    }
    let real = false;
    for (const open of threats.filter((t) => t.visibility === 'open' && !isRating(t)).sort((a, b) => b.severity - a.severity)) {
      if (open.severityBand === 'low') break;
      const b = `threat.${open.type}.${formOf(open, rec)}`;
      const said = say('outsider_impressions', P.OUTSIDER_IMPRESSIONS, b);
      if (!said) break;
      real = true;
      if (yields(b, st)) continue;
      out.push(said);
      break;
    }
    const options = (real ? (strained >= 3 ? lenses : []) : [...lenses, 'ordinary'])
      .filter((b) => filterDeclared(P.OUTSIDER_IMPRESSIONS[b], { facts }).length > 0);
    let second = pickVariantMixed(options, `${rec.name}::dailyLife.outsider_impressions::second`);
    if (second && yields(second, st)) second = pickVariantMixed(options.filter((b) => !yields(b, st)), `${rec.name}::dailyLife.outsider_impressions::second`);
    if (second) out.push(say('outsider_impressions', P.OUTSIDER_IMPRESSIONS, second, (t) => fillGov(t, gov)));
    return { parts: out.filter(Boolean), real };
  };
  const ruled = outsiderWith(stated);
  const out = ruled.parts.length ? ruled.parts : outsiderWith(new Set()).parts.slice(0, 1);
  const real = ruled.real;

  return {
    outsider: out.filter(Boolean).join(' '), unspoken, recent: rc.map((p) => p.t).filter(Boolean).join(' '),
    real, lensDefence: lenses.includes('services.defense'),
  };
}

describe('the route and the calm rule, from the slots\' own pools (b, d)', () => {
  /** @type {{ OUTSIDER_IMPRESSIONS: any, UNSPOKEN_TOPICS: any, RECENT_CHANGES: any, [k: string]: any }} */
  let P;
  beforeAll(async () => {
    P = {
      ...(await import('../../src/data/dailyLife/outsiderImpressions.js')),
      ...(await import('../../src/data/dailyLife/unspokenTopics.js')),
      ...(await import('../../src/data/dailyLife/recentChanges.js')),
      ...(await import('../../src/data/dailyLife/foodCulture.js')),
    };
  });

  for (const slot of SLOTS) {
    it(`${slot}: every born place says the keyed picks of its branches' admitted lines (EMPTY where none is true)`, () => {
      const failures = collectSeedFailures(seeds(), (seed) => {
        const x = at(seed);
        expect(x[slot], `${seed}: ${slot}`).toBe(expected(x.rec, P)[slot]);
      });
      expectNoSeedFailures(failures, `${slot} says its own pool's keyed picks on every born place`);
    });
  }

  it('THE CALM RULE: a place with no real threat said takes no threat line, and an order line only where the defence lens is strained', () => {
    const threatLines = new Set(Object.entries(P.OUTSIDER_IMPRESSIONS).filter(([b]) => b.startsWith('threat.')).flatMap(([, ls]) => ls.map((/** @type {any} */ l) => l.text)));
    const defenceLines = new Set(P.OUTSIDER_IMPRESSIONS['services.defense'].map((/** @type {any} */ l) => l.text));
    const failures = collectSeedFailures(seeds(), (seed) => {
      const x = at(seed);
      const e = expected(x.rec, P);
      const ratings = deriveAllThreatProfiles(x.rec).filter(isRating).map((t) => String(t.label).toLowerCase());
      for (const label of ratings) expect(x.outsider.toLowerCase().includes(label), `${seed}: a rating said "${label}"`).toBe(false);
      if (e.real) return;
      for (const line of threatLines) expect(x.outsider.includes(line), `${seed} (calm): a threat line "${line}"`).toBe(false);
      if (!e.lensDefence) for (const line of defenceLines) expect(x.outsider.includes(line), `${seed} (defence not strained): an order line "${line}"`).toBe(false);
    });
    expectNoSeedFailures(failures, 'outsider_impressions: the ratings are no threat; a calm place says no threat');
  });
});
