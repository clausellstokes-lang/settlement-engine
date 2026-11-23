/**
 * tests/domain/dailyLifeNewLines.test.js — DAILY-5 · D5C-2 phase B, THE SAMENESS LINES BUILT (the chair's E133 (2); the
 * brief `docs/chair/2026-11-20/content/daily/briefs/D5C-2-PHASE-B.md`; the lines `lines/D4C/DRAFT-1.md` and `DRAFT-2.md`,
 * read by the chair and taken 2026-11-22 21:55 UTC, F9 reworded as the brief says).
 *
 * THE 34 below are the brief's: each its pool, its branch, its id, its text and its needs (B27 its excludes) exactly as
 * the drafts print them, appended at the end of its branch in the drafts' order. On 30 born places (five a size, M1's
 * births `hxd-<size>-0..4`, the recipe `dailyLifeNoRepeat.test.js` copies):
 *   (a) each of the 34 is in its pool branch, at its end in the drafts' order, with this file's text, needs and excludes;
 *   (b) a new line prints only where its needs hold and its excludes do not: on every page where its template is found
 *       in its slot's printed text, the door (`facts/drawDeclared.js :: filterDeclared` over `facts/factsOf.js ::
 *       factsOf`) admits it;
 *   (c) at least one of the 34 prints on the 30 (no vacuous pass).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { OUTSIDER_IMPRESSIONS } from '../../src/data/dailyLife/outsiderImpressions.js';
import { DAWN_WORK } from '../../src/data/dailyLife/dawnWork.js';
import { GATHERING_NAMED, GATHERING_PLAIN } from '../../src/data/dailyLife/gatheringPlaces.js';
import { CHILD_WARNINGS } from '../../src/data/dailyLife/childWarnings.js';
import { COMMONER_RESENTMENTS } from '../../src/data/dailyLife/commonerResentments.js';
import { RECENT_CHANGES } from '../../src/data/dailyLife/recentChanges.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

/** @typedef {{ slot: string, branch: string, id: string, text: string, needs: string[], excludes?: string[] }} NewLine */
/** THE 34, in the drafts' order. @type {NewLine[]} */
const NEW_LINES = [
  // DRAFT-1 · outsider_impressions
  { slot: 'outsider_impressions', branch: 'power', id: 'P12', text: 'A visitor who wants anything settled here is told to speak to {power} first.', needs: [] },
  { slot: 'outsider_impressions', branch: 'power', id: 'P13', text: 'Nothing of weight is agreed here without the leave of {power}.', needs: [] },
  { slot: 'outsider_impressions', branch: 'power', id: 'P14', text: 'Newcomers soon notice how often talk here comes round to {power}.', needs: [] },
  { slot: 'outsider_impressions', branch: 'power.level', id: 'V4', text: 'Power here does not sit in one pair of hands, and a visitor learns to ask around.', needs: [] },
  { slot: 'outsider_impressions', branch: 'power.level', id: 'V5', text: 'There is no single master here, and getting anything done means winning over more than one side.', needs: [] },
  { slot: 'outsider_impressions', branch: 'threat.monster_pressure.frontier', id: 'MF7', text: 'People here are used to living close to the wild, and they tell a visitor where not to go.', needs: [] },
  { slot: 'outsider_impressions', branch: 'threat.monster_pressure.frontier', id: 'MF8', text: 'Living this near the wild has made people watchful, and a visitor notices it.', needs: [] },
  { slot: 'outsider_impressions', branch: 'threat.monster_pressure.frontier', id: 'MF9', text: 'People here know the wild country well, and they warn a visitor not to go far into it.', needs: [] },
  { slot: 'outsider_impressions', branch: 'services.defense', id: 'D15', text: 'There is not much here to stop trouble once it starts, and people know it.', needs: [] },
  // DRAFT-1 · dawn_work
  { slot: 'dawn_work', branch: 'defence', id: 'W15', text: 'Before the day\'s work begins, someone looks out over the country around to see that nothing is stirring.', needs: [] },
  { slot: 'dawn_work', branch: 'default', id: 'B27', text: 'Carts are already coming in at the gates as it grows light, bringing the day\'s goods.', needs: ['gate'], excludes: ['crisis: under_siege'] },
  // DRAFT-2 · gathering_places
  { slot: 'gathering_places', branch: 'named', id: 'N29', text: 'People pass the time of day by {sacred}, and the talk there is of the work and of one another.', needs: ['sacredHouse'] },
  { slot: 'gathering_places', branch: 'named', id: 'N30', text: 'News goes round by {sacred} and from door to door, and little stays private for long.', needs: ['sacredHouse', 'institution: dwellings'] },
  { slot: 'gathering_places', branch: 'named', id: 'N31', text: 'People meet out on the common by day, and at one another\'s doors of an evening.', needs: ['institution: commonGrazing', 'institution: dwellings'] },
  { slot: 'gathering_places', branch: 'named', id: 'N32', text: 'Where the water is drawn and out on the common, people stop to talk as they pass.', needs: ['institution: waterSource', 'institution: commonGrazing'] },
  { slot: 'gathering_places', branch: 'named', id: 'N33', text: 'Most of the news is passed on in the fields and where the water is drawn.', needs: ['institution: farmland', 'institution: waterSource', 'tier: ≤ village'] },
  { slot: 'gathering_places', branch: 'named', id: 'N34', text: 'People talk at one another\'s doors and where the water is drawn, and little news is missed.', needs: ['institution: dwellings', 'institution: waterSource'] },
  { slot: 'gathering_places', branch: 'plain', id: 'P16', text: 'People talk wherever the day\'s work brings them together, and the news goes round with them.', needs: [] },
  { slot: 'gathering_places', branch: 'plain', id: 'P17', text: 'News is passed from door to door here, and most of it is known by nightfall.', needs: ['institution: dwellings'] },
  { slot: 'gathering_places', branch: 'plain', id: 'P18', text: 'People meet in the fields and on the paths between the houses, and talk as they go.', needs: ['institution: farmland', 'institution: dwellings', 'tier: ≤ village'] },
  { slot: 'gathering_places', branch: 'plain', id: 'P19', text: 'Most news here is passed on at the doorstep, a few words at a time.', needs: ['institution: dwellings'] },
  { slot: 'gathering_places', branch: 'plain', id: 'P20', text: 'Most of the talk here goes on out of doors, wherever people are at work.', needs: [] },
  // DRAFT-2 · child_warnings
  { slot: 'child_warnings', branch: 'monster_pressure', id: 'P10', text: 'slipping out of doors once it is dark', needs: [] },
  { slot: 'child_warnings', branch: 'monster_pressure', id: 'P11', text: 'answering any call that comes out of the dark', needs: [] },
  { slot: 'child_warnings', branch: 'monster_pressure', id: 'P12', text: 'staying out once the evening comes on', needs: [] },
  { slot: 'child_warnings', branch: 'monster_pressure', id: 'P13', text: 'leaving a door unbarred at night', needs: [] },
  // DRAFT-2 · commoner_resentments
  { slot: 'commoner_resentments', branch: 'legitimacy', id: 'L14', text: 'There is little trust here that {gov} will do right by ordinary people.', needs: ['government named'] },
  { slot: 'commoner_resentments', branch: 'legitimacy', id: 'L15', text: 'People put up with {gov}, but they expect little of {gov|it|them}.', needs: ['government named'] },
  { slot: 'commoner_resentments', branch: 'food', id: 'F9', text: 'Short rations are the talk of every household, and patience is wearing thin.', needs: [] },
  { slot: 'commoner_resentments', branch: 'food', id: 'F10', text: 'There is grumbling in every kitchen about how little there is to put on the table.', needs: [] },
  { slot: 'commoner_resentments', branch: 'food', id: 'F11', text: 'People complain that a day\'s work does not buy a day\'s food.', needs: ['market'] },
  { slot: 'commoner_resentments', branch: 'food', id: 'F12', text: 'Going short at table is the complaint heard most often here.', needs: [] },
  { slot: 'commoner_resentments', branch: 'food', id: 'F13', text: 'Many households are eating less than they would like, and they say so.', needs: [] },
  // DRAFT-2 · recent_changes
  { slot: 'recent_changes', branch: 'beat', id: 'B8', text: '{Event} is still remembered here, and not lightly.', needs: [] },
];

/** @param {string} slot @param {string} branch @returns {ReadonlyArray<any>|undefined} the live branch array */
function poolOf(slot, branch) {
  /** @type {Record<string, Record<string, ReadonlyArray<any>>>} */
  const by = {
    outsider_impressions: /** @type {any} */ (OUTSIDER_IMPRESSIONS), dawn_work: /** @type {any} */ (DAWN_WORK),
    gathering_places: { named: GATHERING_NAMED, plain: GATHERING_PLAIN }, child_warnings: /** @type {any} */ (CHILD_WARNINGS),
    commoner_resentments: /** @type {any} */ (COMMONER_RESENTMENTS), recent_changes: /** @type {any} */ (RECENT_CHANGES),
  };
  return by[slot]?.[branch];
}

/** @param {string} v */
const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** @param {string} text @returns {RegExp} a template, its placeholders wildcards (the measure's reader) */
function templateRe(text) {
  const src = text.split(/\{[^{}]*\}/).map(esc).join('(.+?)');
  return new RegExp(/\{[^{}]*\}$/.test(text) ? src.replace(/\(\.\+\?\)$/, '([^,.]+)') : src);
}

/** @type {Array<{ seed: string, rec: any, pub: Record<string, any> }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 5; i++) {
    const seed = `hxd-${size}-${i}`;
    const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    births.push({ seed, rec, pub: deriveDailyLife(rec).slots });
  }
}, 300_000);

/** Every page where a new line's template is found in its slot's printed text. */
const printings = () => births.flatMap((b) => NEW_LINES
  .filter((l) => templateRe(l.text).test(String(b.pub[l.slot]?.text ?? '')))
  .map((l) => ({ seed: b.seed, rec: b.rec, line: l })));

describe('D5C-2 phase B: the 34 sameness lines, built', () => {
  it('the brief names 34 lines, and the born places number 30, five a size', () => {
    expect(NEW_LINES).toHaveLength(34);
    expect(births).toHaveLength(30);
  });

  it('(a) each of the 34 is in its pool branch, appended at its end in the drafts\' order, with its text, needs and excludes', () => {
    const bad = [];
    /** @type {Map<string, NewLine[]>} */
    const byBranch = new Map();
    for (const l of NEW_LINES) {
      const k = `${l.slot}|${l.branch}`;
      byBranch.set(k, [...(byBranch.get(k) || []), l]);
    }
    for (const [k, lines] of byBranch) {
      const [slot, branch] = k.split('|');
      const pool = poolOf(slot, branch);
      if (!pool) { bad.push(`${k}: no such branch`); continue; }
      const tail = pool.slice(-lines.length).map((r) => r.id);
      if (tail.join(',') !== lines.map((l) => l.id).join(',')) bad.push(`${k}: the branch ends [${tail.join(',')}], not [${lines.map((l) => l.id).join(',')}]`);
      for (const l of lines) {
        const row = pool.find((r) => r.id === l.id && r.text === l.text);
        if (!row) { bad.push(`${k} ${l.id}: not in the branch with its text`); continue; }
        if (pool.filter((r) => r.id === l.id).length !== 1) bad.push(`${k} ${l.id}: the id is not unique in its branch`);
        if (JSON.stringify([...row.needs]) !== JSON.stringify(l.needs)) bad.push(`${k} ${l.id}: needs ${JSON.stringify(row.needs)}`);
        if (JSON.stringify(row.excludes ? [...row.excludes] : null) !== JSON.stringify(l.excludes ?? null)) bad.push(`${k} ${l.id}: excludes ${JSON.stringify(row.excludes ?? null)}`);
      }
    }
    expect(bad, 'the 34 as the brief names them').toEqual([]);
  });

  it('(b) a new line prints only where its needs hold and its excludes do not (the door, on every page that prints it)', () => {
    const bad = [];
    for (const { seed, rec, line } of printings()) {
      const admitted = filterDeclared([{ id: line.id, text: line.text, needs: line.needs, ...(line.excludes ? { excludes: line.excludes } : {}) }],
        { facts: /** @type {any} */ (factsOf(rec)), poolId: `dailyLife.${line.slot}.${line.branch}`, surface: 'dailyLife' });
      if (admitted.length !== 1) bad.push(`${seed}: ${line.slot} ${line.branch}#${line.id} printed where its needs ${JSON.stringify(line.needs)} / excludes ${JSON.stringify(line.excludes ?? [])} do not admit it`);
    }
    expect(bad, 'no new line printed false').toEqual([]);
  });

  it('(c) at least one of the 34 prints on the 30 (no vacuous pass)', () => {
    const printed = [...new Set(printings().map((p) => `${p.line.slot} ${p.line.branch}#${p.line.id}`))];
    expect(printed.length, 'new lines printed on the 30').toBeGreaterThan(0);
  });
});
