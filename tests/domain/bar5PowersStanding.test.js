// BAR5-POWERS (BRIEF-BAR5 Amendment L, 2026-11-16): LAW 1's rules 1c and 1d, A POWER'S DESCRIPTION AND A PERSON'S STANDING READ
// THE POWER'S FINAL STATE, kept as a guard with the audit's own detector (tests/helpers/pageLaws/law1.mjs :: law1c, law1d;
// BAR5-AUDIT-A at c0ea05497). The detector reads a town's record and its printed lines; here the printed lines are the
// record's own (`recordTabs`): each power's stored description as the Power tab prints it, each card as the People tab
// prints it (its structural position, then "Standing <word>" from `npcInteriority`), the stability word. Each arm:
// (a) THE ZERO over the towns in which the rule fired at 600b7683a (the census's 720 and the fresh 300: the measure in
// docs/chair/2026-11-16/bar5/BAR5-POWERS-HANDBACK.md), every town run and every failure collected; (b) A POSITIVE CONTROL,
// a record built here from the read's own row, on which the detector MUST still fire. And the read's rows (REVIEW-BAR-5:
// C33631 C35627), each red at 600b7683a; C38889 is tests/domain/facts/seatOutranked.test.js's; C39734 C43925 are cured by the late key (BAR6-POWERS, 2026-11-16: `forces` handed at assembleSettlement.js's late reconcile; the exclusion below lifted); C32519 is named for BAR5-FOOD: the refused words and what prints in their place.
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { law1c, law1d, PROSPERITY_UP } from '../helpers/pageLaws/law1.mjs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { POSITION_VARIANTS } from '../../src/data/npcStructureVariants.js';
import { readFileSync } from 'node:fs';

// PEOPLE-1 B1c (the chair's ruling of 20:30 UTC): a pool's index 0 is the writer's own `T` row, its one home; read from the
// writer's table, SLICED FROM ITS FILE and evaluated (`npcPositionPools.test.js`'s method; never retyped)
const WRITER = readFileSync(new URL('../../src/generators/npcStructure.js', import.meta.url), 'utf8');
const cutT = (/** @type {string} */ from, /** @type {string} */ to) => { const a = WRITER.indexOf(from); const b = WRITER.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`slice ${from}`); return WRITER.slice(a, b); };
/** @type {Record<string, { position: string, constraint: string }>} */
const { T } = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from([cutT('const GOVERNANCE_FRACTURED', 'function getPrimaryCondition'), cutT('const T = {};', '// ── Score NPCs'), 'export { T };'].join('\n')).toString('base64')}`);

/** @param {string} s */
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** The trade head's low-standing twin (`npcStructure.js :: LOW_STANDING_TWIN`). */
const LOW_TWIN_TRADE = 'Heads the leading house in the trade in quiet times, though its word counts for little beyond the trade.';
import { npcInteriority } from '../../src/domain/display/npcInteriorityRead.js';
import { NO_PATROL_LINE, NO_FORCE_LINE, forceLineOf } from '../../src/generators/power/militaryForceLine.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';

/** the census's dials (CENSUS-3 :: seedcfg.mjs, verbatim) */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** the census's shapes and the bar's read shape (CENSUS-3 :: seedcfg.mjs, its r2r-, r2s- and bar0- arms) @param {string} seed */
function born(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  let cfg = m ? { ...DEFAULT_CONFIG, ...DIALS, settType: m[1] } : null;
  if (!cfg && (m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`)))) cfg = { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  if (!cfg && (m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`)))) {
    cfg = { ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
  }
  if (!cfg) throw new Error(`no shape for ${seed}`);
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

/** The record's own printed lines for 1c and 1d (the Power tab's descriptions; each card, its header first, as the People tab
 * prints it: the detector reads a card's standing up to the next header). @param {any} s */
function recordTabs(s) {
  const power = (s?.powerStructure?.factions || []).map((/** @type {any} */ f) => String(f?.desc || ''));
  const people = (s?.npcs || []).flatMap((/** @type {any} */ n) => {
    const standing = npcInteriority({ npc: n })?.standing;
    return [`${n.name} ●`, String(n.structuralPosition || ''), ...(standing ? [`Standing ${standing}`] : [])];
  });
  return { 'Systems/Power': power, 'Summary/People': people };
}
/** every variant text of a generated state leaf (computed at test time, never a literal) @param {unknown} o @returns {string[]} */
const textsOf = (o) => (Array.isArray(o) ? o.flatMap(textsOf) : o && typeof o === 'object'
  ? [...(typeof (/** @type {any} */ (o)).text === 'string' ? [(/** @type {any} */ (o)).text] : []), ...Object.values(o).flatMap(textsOf)] : []);

/** 1c and 1d: the census towns (and the fresh 300's) in which the detector fired at 600b7683a */
const FIRED_720 = Object.freeze([
  'r2r-city-1', 'r2r-city-16', 'r2r-city-18', 'r2r-city-21',
  'r2r-city-23', 'r2r-city-24', 'r2r-city-31', 'r2r-city-32',
  'r2r-city-36', 'r2r-city-38', 'r2r-city-45', 'r2r-city-55',
  'r2r-city-58', 'r2r-city-59', 'r2r-hamlet-23', 'r2r-hamlet-52',
  'r2r-metropolis-1', 'r2r-metropolis-10', 'r2r-metropolis-13', 'r2r-metropolis-15',
  'r2r-metropolis-16', 'r2r-metropolis-18', 'r2r-metropolis-21', 'r2r-metropolis-23',
  'r2r-metropolis-28', 'r2r-metropolis-3', 'r2r-metropolis-30', 'r2r-metropolis-37',
  'r2r-metropolis-40', 'r2r-metropolis-42', 'r2r-metropolis-43', 'r2r-metropolis-46',
  'r2r-metropolis-48', 'r2r-metropolis-55', 'r2r-metropolis-56', 'r2r-metropolis-57',
  'r2r-metropolis-9', 'r2r-town-17', 'r2r-town-2', 'r2r-town-28',
  'r2r-town-4', 'r2r-town-48', 'r2r-town-49', 'r2r-town-54',
  'r2r-town-6', 'r2r-village-13', 'r2r-village-18', 'r2r-village-20',
  'r2r-village-28', 'r2r-village-47', 'r2r-village-49', 'r2r-village-54',
  'r2s-indebted-metropolis-2', 'r2s-monster_pressure-city-3', 'r2s-monster_pressure-town-2', 'r2s-occupied-metropolis-1',
  'r2s-recently_betrayed-hamlet-0', 'r2s-under_siege-city-1', 'r2s-wartime-metropolis-2',
]);
const FIRED_FRESH = Object.freeze([
  'bar0-hamlet-calm-rand-118', 'bar0-metropolis-calm-rand-101', 'bar0-metropolis-calm-rand-102', 'bar0-metropolis-calm-rand-105',
  'bar0-metropolis-calm-rand-108', 'bar0-metropolis-calm-rand-110', 'bar0-metropolis-calm-rand-113', 'bar0-metropolis-calm-rand-114',
  'bar0-metropolis-calm-rand-118', 'bar0-metropolis-calm-rand-119', 'bar0-metropolis-calm-rand-124', 'bar0-metropolis-calm-rand-127',
  'bar0-metropolis-calm-rand-128', 'bar0-town-calm-rand-103', 'bar0-town-calm-rand-104', 'bar0-town-calm-rand-106',
  'bar0-town-calm-rand-115', 'bar0-town-calm-rand-116', 'bar0-town-occupied-rand-123', 'bar0-village-calm-rand-122',
  'bar0-village-famine-rand-130',
]);
/** THE CLASS (the casters' head row, the card line's sibling the detector's words do not reach): the census towns where a head of
 * low standing was told "their place is secure" at 600b7683a (9 of the 720, none of the fresh 300) */
const CASTERS_LOW = Object.freeze(['r2r-city-5', 'r2r-city-15', 'r2r-city-20', 'r2r-city-27', 'r2r-city-28', 'r2r-city-48', 'r2r-city-49', 'r2r-city-58', 'r2r-metropolis-13']);
/** The read's rows: [row, town, the refused opening, what prints in its place] (each red at 600b7683a) */
const ROWS = /** @type {Array<[string, string, string, string]>} */ ([
  ['C33631', 'bar0-town-calm-rand-25', 'Clergy and church institutions exercise meaningful civic influence', 'Clergy are present but operate at the margins of civic life'],
  // RE-KEYED BY IDENTITY (PEOPLE-1 B1, 2026-11-20, the chair's ruling of 16:41 UTC): the trade's calm head row is pooled; what
  // prints in the low-standing head's slot is its twin or a pooled wording that claims no secure hold ('@<pool>': the member the
  // town prints, never index 0)
  ['C35627', 'bar0-town-calm-rand-26', 'its hold is secure and its say is real', '@economy__stable__dominant'],
]);
/* THE NAMED EXCLUSION `AWAITS_THE_LATE_KEY` ('1c-force/roster') IS LIFTED (BAR6-POWERS, 2026-11-16): the force line reads the
 * SETTLED roster only, handed by the late replay (`projection.forces`; R-Q / R-U, tests/generators/census5cMilitiaReword.test.js),
 * and the key is handed now (`forces` in assembleSettlement.js's late reconcile options), so 1c-force joins the zero. */
/** KEEP: a force line where its force stands, and a secure head of established standing, still print */
const KEEP = /** @type {Array<[string, RegExp]>} */ ([
  ['bar0-village-calm-rand-22', /^Significant military force for this scale/],
  // RE-KEYED BY IDENTITY (PEOPLE-1 B1, 2026-11-20, the chair's ruling of 16:41 UTC): the casters' calm head row is pooled
  // (`data/npcStructureVariants.js`); a head of established standing prints a member of it (its index 0 the secure line), never
  // the low-standing twin, which is no member
  // (B1c: the pool as the writer composes it, [the T row's own line, ...the data pool])
  ['bar0-metropolis-calm-rand-21', new RegExp(`^(?:${[{ text: T.magic__stable__dominant.position }, ...POSITION_VARIANTS.magic__stable__dominant].map((r) => r.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{house\\\}/g, '[^"]+')).join('|')})`)],
]);

/** @type {Record<string, any>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const seeds = new Set([...FIRED_720, ...FIRED_FRESH, ...CASTERS_LOW, ...ROWS.map((r) => r[1]), ...KEEP.map((r) => r[0])]);
  for (const seed of seeds) towns[seed] = born(seed);
}, 1800000);

/** the 1c and 1d instances of a born town, its printed lines the record's own @param {string} seed */
const instancesOf = (seed) => [...law1c({ record: towns[seed], tabs: recordTabs(towns[seed]), town: seed }), ...law1d({ record: towns[seed], tabs: recordTabs(towns[seed]), town: seed })];
/** the record's stored lines a row is read in @param {any} s */
const said = (s) => JSON.stringify({ powers: (s.powerStructure?.factions || []).map((/** @type {any} */ f) => f.desc), cards: (s.npcs || []).map((/** @type {any} */ n) => n.structuralPosition ?? null) });

describe('BAR5-POWERS · 1c and 1d (detector: law1c, law1d over the record\'s printed lines)', () => {
  it('(a) the zero: in every town where a power\'s description or a card claimed a standing its final state denies at 600b7683a', () => {
    const failures = collectSeedFailures([...FIRED_720, ...FIRED_FRESH], (seed) => {
      expect(instancesOf(seed).map((x) => `${x.law}: ${x.line.slice(0, 80)}`), seed).toEqual([]);
    });
    expectNoSeedFailures(failures, '1c and 1d: zero in the towns where they printed at 600b7683a');
  });
  it('(a) the class: no head of low standing is told its place is secure (the casters\' row, the trade\'s row)', () => {
    const failures = collectSeedFailures([...CASTERS_LOW, ...FIRED_720, ...FIRED_FRESH], (seed) => {
      const secure = (towns[seed].npcs || []).filter((/** @type {any} */ n) => n.influence === 'low' && /(?:its hold|their place) is secure/.test(String(n.structuralPosition || '')));
      expect(secure.map((/** @type {any} */ n) => n.name), seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'the class: a low standing claims no secure hold');
  });
  it('(b) positive control: a constructed town of the read\'s four 1c rows and its 1d row, each found', () => {
    const noRival = textsOf(DOSSIER_STATE_PROSE_POWER).find((t) => /holds because no rival yet outweighs \{faction\}/.test(t));
    const upLine = textsOf(DOSSIER_STATE_PROSE_ECONOMY).find((t) => PROSPERITY_UP.some((r) => r.test(t)));
    expect(noRival && upLine).toBeTruthy();
    const record = {
      config: { stressTypes: ['occupied'] },
      defenseProfile: { institutions: { garrison: [], militia: [], watch: [], mercenary: [] } },
      powerStructure: {
        stability: 'Tense (militarised, chronically underfunded)',
        factions: [
          { faction: 'Church Council', powerLabel: 'Significant', isGoverning: true, desc: 'The church governs.' },
          { faction: 'Religious Authorities', powerLabel: 'Suppressed', desc: 'Clergy and church institutions exercise meaningful civic influence through moral authority, land ownership, and popular trust.' },
          { faction: 'Military Party', powerLabel: 'Strong', desc: "Armed patrol of able-bodied residents; the settlement's primary recourse when disputes turn physical." },
        ],
      },
    };
    const tabs = {
      'Systems/Power': [...record.powerStructure.factions.map((f) => f.desc),
        String(noRival).replace('{seat}', 'Church Council').replace('{settlement}', 'Pratonovum').replace('{faction}', 'Church Council')],
      'Summary/People': ['Ada Vintner ●', 'Heads the leading house in the trade in quiet times; its hold is secure and its say is real.', 'Standing marginal'],
      'World/Daily Life': [String(upLine).replace('{settlement}', 'Pratonovum')],
    };
    const laws = [...law1c({ record, tabs, town: 'control' }), ...law1d({ record, tabs, town: 'control' })].map((x) => x.law).sort();
    expect(laws).toEqual(['1c-force/roster', '1c-norival/outranked', '1c-npc/marginal', '1c-weight/Suppressed', '1d-up/underfunded']);
  });
  it('(b) the leaves: a force line keeps its words where the force stands and takes its twin where none does', () => {
    const patrol = "Armed patrol of able-bodied residents; the settlement's primary recourse when disputes turn physical.";
    expect(forceLineOf(patrol, { militia: true })).toBe(patrol);
    expect(forceLineOf(patrol, null)).toBe(patrol); // R-Q: without the settled atoms the step's own choice prints
    expectAbsentWithAnchor([forceLineOf(patrol, { garrison: true })], patrol, NO_PATROL_LINE, 'no militia and no watch: no patrol of residents');
    const force = "Significant military force for this scale; the commander's opinion on civic matters carries institutional weight.";
    expectAbsentWithAnchor([forceLineOf(force, {})], force, NO_FORCE_LINE, 'no force of any kind');
  });
  it('(b) DS-POW-4: "no rival yet outweighs" declares the town not occupied', () => {
    /** @type {any[]} */ const variants = [];
    const walk = (/** @type {any} */ o) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.text === 'string' && /no rival yet outweighs/.test(o.text)) variants.push(o); Object.values(o).forEach(walk); } };
    walk(DOSSIER_STATE_PROSE_POWER);
    expect(variants.length).toBe(1);
    expect(variants[0].marks).toContain('no crisis: occupied');
  });
});

describe('BAR5-POWERS · the read\'s rows (REVIEW-BAR-5), each red at 600b7683a', () => {
  /** PEOPLE-1 B1: '@<pool>' is the town's printed position that is the low-standing twin or a member of the pool past index 0. @param {string} seed @param {string} line */
  const resolved = (seed, line) => {
    if (!line.startsWith('@')) return line;
    const pool = POSITION_VARIANTS[line.slice(1)];
    // B1c: the data pool holds the members past index 0 only (index 0, the T row, is composed by the writer)
    const res = [new RegExp(`^${esc(LOW_TWIN_TRADE)}$`), ...pool.map((r) => new RegExp(`^${esc(r.text).replace(/\\\{(?:house|export|import)\\\}/g, '.+')}$`))];
    const printed = (towns[seed].npcs || []).map((/** @type {any} */ n) => String(n.structuralPosition || ''));
    return printed.find((/** @type {string} */ p) => res.some((re) => re.test(p))) ?? `(no member of ${line.slice(1)} prints)`;
  };
  for (const [row, seed, refused, instead0] of ROWS) {
    it(`${row} ${seed}: not "${refused.slice(0, 44)}…"; what prints instead`, () => {
      const text = said(towns[seed]);
      const instead = resolved(seed, instead0);
      expectAbsentWithAnchor(text, refused, instead, `${row}: the refused claim; the same slot's true text`);
      expect(text).toContain(instead);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: ${kept.source.slice(1, 48)}… still prints (its force stands; its head's standing is not marginal)`, () => {
      expect(said(towns[seed])).toMatch(new RegExp(kept.source.slice(1)));
    });
  }
});
