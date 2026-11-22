/**
 * PAGE-7, CAUSES-DATA (the brief at 9e4ba24b6, rule 7, first and second arms): THE CAUSES' DATA FILE IS WHOLE
 * (`src/data/tensionCauses.js`).
 *   - eight kinds, the causes in the ruled order with their ranks (`PAGE-5-HANDBACK.md` §5, the chair's 14:21 and 14:33;
 *     `old_crime_wave` dropped);
 *   - every cause's `holds` key is a predicate of `src/domain/display/tensionCauseHolds.js`, and every predicate is used;
 *   - three wordings for a cause the chair ruled in `WORDS`, two for the others, and the cap's added fourth or third (the
 *     chair's 16:45: contested, crisis_band, insurgency 3; great_flood river 4); plain three a kind, great_flood five;
 *   - every line declares the atoms its cause implies (addendum 3), drawn through `drawDeclared`;
 *   - no function and no pattern anywhere in the data file;
 *   - every wording pinned: the count and a content digest per kind, so a changed wording reds;
 *   - no wording holds "the place" twice; `{power}` only where ruled (outside_debt's `merchants_rule`);
 *   - `hideable` exactly as ruled (rule 5 and the addendum of 15:19).
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TENSION_CAUSES } from '../../src/data/tensionCauses.js';
import { TENSION_CAUSE_HOLDS } from '../../src/domain/display/tensionCauseHolds.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { CRISIS_KIND_WORDS, FACT_DIMENSIONS, parseAtom } from '../../src/domain/facts/factVocabulary.js';

/** The ruled tables, cause and rank, in order (`PAGE-5-HANDBACK.md` §5; `old_crime_wave` dropped by the chair, 14:33). */
const RULED = Object.freeze({
  crime_wave: [['criminal_power', 1], ['law_thin', 1], ['rival_rings', 1], ['no_force', 1], ['force_unpaid_or_cut', 1],
    ['thieves_house', 2], ['contraband_water', 2], ['underground', 2], ['assassins', 2], ['black_market', 2],
    ['whisper_market', 2], ['outlaws_near', 2]],
  guild_conflict: [['old_guild_war', 1], ['guilds_rule', 1], ['rival_power', 1], ['caravans', 2], ['ships', 2],
    ['crossroads', 2], ['fair', 2], ['trade_center', 2], ['luxury_quarter', 2]],
  resource_scarcity: [['famine', 1], ['sickness', 1], ['war_levy', 1], ['source_spent', 1], ['old_scarcity', 1], ['isolated', 2]],
  external_threat: [['war', 1], ['beasts_pressing', 1], ['old_threat', 1], ['militia_only', 2], ['open_road', 2], ['beasts_frontier', 2]],
  succession_crisis: [['void', 1], ['heir_house', 1], ['outranked', 1], ['rival_power', 1], ['contested', 1], ['old_succession', 1]],
  outside_debt: [['creditors_sit', 1], ['old_crash', 1], ['hard_up', 1], ['merchants_rule', 1], ['old_debt', 1], ['through_trade', 2]],
  great_flood: [['old_flood', 1], ['coast', 2], ['river', 2]],
  legitimacy_crisis: [['insurgency', 1], ['creed', 1], ['crisis_band', 1], ['outranked', 1], ['lord', 1], ['rival_power', 1]],
});
/** The chair's 14:33: three wordings for these. */
const WORDS = new Set(['crime_wave:rival_rings', 'guild_conflict:guilds_rule', 'guild_conflict:rival_power', 'guild_conflict:fair',
  'resource_scarcity:war_levy', 'external_threat:old_threat', 'external_threat:war', 'legitimacy_crisis:rival_power',
  'outside_debt:creditors_sit', 'great_flood:river', 'succession_crisis:old_succession']);
/** The cap's added wordings (the chair's 16:45, `lines/CAUSE-LINES-3.md`): each cause's count after its new line. */
const CAPPED = Object.freeze({ 'succession_crisis:contested': 3, 'legitimacy_crisis:crisis_band': 3, 'legitimacy_crisis:insurgency': 3, 'great_flood:river': 4 });
/** Rule 5 and the addendum: crime_wave's nine named rows and law_thin, no_force, force_unpaid_or_cut; guilds_rule and
 * rival_power; every rival_power, merchants_rule and outranked; militia_only reads the force that keeps order. */
const HIDEABLE = new Set(['crime_wave:criminal_power', 'crime_wave:law_thin', 'crime_wave:rival_rings', 'crime_wave:no_force',
  'crime_wave:force_unpaid_or_cut', 'crime_wave:thieves_house', 'crime_wave:contraband_water', 'crime_wave:underground',
  'crime_wave:assassins', 'crime_wave:black_market', 'crime_wave:whisper_market', 'crime_wave:outlaws_near',
  'guild_conflict:guilds_rule', 'guild_conflict:rival_power', 'external_threat:militia_only', 'succession_crisis:outranked',
  'succession_crisis:rival_power', 'outside_debt:merchants_rule', 'legitimacy_crisis:outranked', 'legitimacy_crisis:rival_power']);
/** The causes ruled to carry `{power}` (`CAUSES-LINES-B.md`: the governing power's name). */
const POWER_CAUSES = new Set(['outside_debt:merchants_rule']);
/** THE PIN: per kind, the wordings' count and the first 16 hex of the sha256 of its causes' ids and wordings, its plain
 * and (guild_conflict) its `withoutItsHouse`, the chair's sentence of 15:35. */
const PINNED = Object.freeze({
crime_wave: [28, 'de7d5b90d47f4378'],
  guild_conflict: [25, '91eb3b6ba43399b8'],
  resource_scarcity: [16, 'ee322988e4898ca0'],
  external_threat: [17, 'fe4c91dd9696867a'],
  succession_crisis: [17, 'df67afb3a05aa95d'],
  outside_debt: [16, '8de84450eff42c0b'],
  great_flood: [13, 'ef046afa7bf00bc1'],
  legitimacy_crisis: [18, '3b608a550f14414e'],
});

/** THE DECLARATIONS' PIN (addendum 3): the first 16 hex of the sha256 of every line's [needs, excludes, crisis], in order. */
// PAGE-12 (CAUSES-PARITY-2 H, the chair's leave of 23:39 UTC 2026-11-21): the five house rows' wordings declare their house
// (`house: underground`, `assassins`, `black_market`, `whisper_market`, `outlaws`): 47a99aefd046293b -> 433acc1d899a989a
const DECLARED = '433acc1d899a989a';
const kinds = Object.keys(TENSION_CAUSES);
const allCauses = kinds.flatMap((k) => TENSION_CAUSES[k].causes.map((c) => ({ kind: k, ...c })));
/** @param {ReadonlyArray<{ text: string }>} lines */
const texts = (lines) => lines.map((l) => l.text);
const without = /** @type {{ text: string, excludes?: ReadonlyArray<string> }} */ (TENSION_CAUSES.guild_conflict.withoutItsHouse);
const allLines = [...kinds.flatMap((k) => [...TENSION_CAUSES[k].causes.flatMap((c) => c.wordings), ...TENSION_CAUSES[k].plain]), without];
const allWordings = texts(allLines);

describe('the causes table: eight kinds, the ruled causes in the ruled order', () => {
  it('holds exactly the eight kinds', () => {
    expect(kinds).toEqual(Object.keys(RULED));
  });
  it('each kind: the ruled causes and ranks, in order', () => {
    expect(Object.fromEntries(kinds.map((k) => [k, TENSION_CAUSES[k].causes.map((c) => [c.id, c.rank])]))).toEqual(RULED);
  });
  it('every holds key is a predicate, and every predicate is used', () => {
    const used = new Set(allCauses.map((c) => c.holds));
    for (const c of allCauses) expect(typeof TENSION_CAUSE_HOLDS[c.holds], `${c.kind}:${c.id} → ${c.holds}`).toBe('function');
    expect(Object.keys(TENSION_CAUSE_HOLDS).filter((k) => !used.has(k))).toEqual([]);
  });
});

describe('the wordings', () => {
  it('three for a cause ruled in WORDS, two for the others, and the cap\'s added wordings (the chair\'s 16:45)', () => {
    for (const c of allCauses) expect(c.wordings.length, `${c.kind}:${c.id}`).toBe(CAPPED[`${c.kind}:${c.id}`] ?? (WORDS.has(`${c.kind}:${c.id}`) ? 3 : 2));
    expect(allCauses.filter((c) => WORDS.has(`${c.kind}:${c.id}`)).length).toBe(WORDS.size);
  });
  it('plain: three a kind, great_flood five (the chair\'s 16:45 added the fifth)', () => {
    for (const k of kinds) expect(TENSION_CAUSES[k].plain.length, k).toBe(k === 'great_flood' ? 5 : 3);
  });
  it('each kind: pinned by count and content digest', () => {
    const got = Object.fromEntries(kinds.map((kind) => {
      const t = TENSION_CAUSES[kind];
      // the TEXTS only (addendum 3 moved no wording's words: the digests of 15:35 stand); the declarations are pinned below
      const body = JSON.stringify({ causes: t.causes.map((c) => [c.id, texts(c.wordings)]), plain: texts(t.plain), withoutItsHouse: t.withoutItsHouse?.text });
      const count = t.causes.reduce((a, c) => a + c.wordings.length, 0) + t.plain.length + (t.withoutItsHouse ? 1 : 0);
      return [kind, [count, createHash('sha256').update(body).digest('hex').slice(0, 16)]];
    }));
    expect(got).toEqual(PINNED);
  });
  it('every wording is a sentence, none repeated within its kind', () => {
    for (const k of kinds) {
      const own = texts([...TENSION_CAUSES[k].causes.flatMap((c) => c.wordings), ...TENSION_CAUSES[k].plain]);
      expect(new Set(own).size, k).toBe(own.length);
      for (const w of own) expect(w, k).toMatch(/^[A-Z].*\.$/);
    }
  });
  it('no wording holds "the place" twice', () => {
    expect(allWordings.filter((w) => (w.match(/\bthe place\b/gi) || []).length > 1)).toEqual([]);
  });
  it('{power} appears only on the causes ruled to carry it, in each of their wordings, and they name its power category', () => {
    for (const c of allCauses) {
      const carries = c.wordings.map((w) => w.text.includes('{power}'));
      expect(carries.every(Boolean) || carries.every((x) => !x), `${c.kind}:${c.id}`).toBe(true);
      expect(carries[0], `${c.kind}:${c.id}`).toBe(POWER_CAUSES.has(`${c.kind}:${c.id}`));
      expect(c.power, `${c.kind}:${c.id}`).toBe(POWER_CAUSES.has(`${c.kind}:${c.id}`) ? 'ruler' : undefined);
    }
    for (const k of kinds) expect(TENSION_CAUSES[k].plain.some((w) => w.text.includes('{power}')), k).toBe(false);
    expect(allWordings.filter((w) => /\{(?!power\})[^}]*\}/.test(w))).toEqual([]);
  });
});

describe('the guild quarrel without its guild (addendum 2, the chair\'s 15:35)', () => {
  it('guild_conflict carries withoutItsHouse (its words pinned above); no other kind carries one', () => {
    expect(typeof without.text).toBe('string');
    expect(without.text).toMatch(/^[A-Z].*\.$/);
    expect(without.excludes).toEqual(['guild']);
    for (const k of kinds.filter((x) => x !== 'guild_conflict')) expect(Object.hasOwn(TENSION_CAUSES[k], 'withoutItsHouse'), k).toBe(false);
    expect(Object.keys(TENSION_CAUSES.guild_conflict).sort()).toEqual(['causes', 'plain', 'withoutItsHouse']);
    for (const k of kinds.filter((x) => x !== 'guild_conflict')) expect(Object.keys(TENSION_CAUSES[k]).sort(), k).toEqual(['causes', 'plain']);
  });
  it('is no cause\'s and no plain wording', () => {
    const own = texts([...TENSION_CAUSES.guild_conflict.causes.flatMap((c) => c.wordings), ...TENSION_CAUSES.guild_conflict.plain]);
    expectAbsentWithAnchor(own, without.text, TENSION_CAUSES.guild_conflict.plain[0].text, 'guild_conflict wordings');
  });
});

describe('hideable: a list for the security reader, exactly as ruled', () => {
  it('marks exactly the ruled causes', () => {
    expect(allCauses.filter((c) => c.hideable).map((c) => `${c.kind}:${c.id}`).sort()).toEqual([...HIDEABLE].sort());
    for (const c of allCauses) expect(typeof c.hideable, `${c.kind}:${c.id}`).toBe('boolean');
  });
  it('the header states the rule: one rule for every audience, a list and not a branch', () => {
    const src = readFileSync(new URL('../../src/data/tensionCauses.js', import.meta.url), 'utf8');
    expect(src).toMatch(/A CAUSE HOLDS ONLY WHERE THE DOCUMENT IN HAND SHOWS IT/);
    expect(src).toMatch(/ONE RULE FOR EVERY AUDIENCE/);
    expect(src).toMatch(/LIST for the security reader at the join, NOT A BRANCH/);
  });
});

describe('the declared lines (addendum 3, item 1: the chair\'s 16:30)', () => {
  it('every line is `{ text, needs?, excludes?, crisis? }`, each atom one the vocabulary can declare', () => {
    const bad = [];
    for (const l of allLines) {
      for (const k of Object.keys(l)) if (!['text', 'needs', 'excludes', 'crisis'].includes(k)) bad.push(`${l.text}: key ${k}`);
      for (const a of [...(l.needs || []), ...(l.excludes || [])]) { const p = parseAtom(a); if (!p || !FACT_DIMENSIONS[p.dimension]) bad.push(`${l.text}: ${a}`); }
      for (const c of l.crisis || []) if (!CRISIS_KIND_WORDS.includes(c)) bad.push(`${l.text}: crisis ${c}`);
    }
    expect(bad).toEqual([]);
  });
  it('a cause\'s wordings share one declaration; the guild quarrel\'s lines need the guild', () => {
    const declOf = (/** @type {any} */ l) => JSON.stringify([l.needs || [], l.excludes || [], l.crisis || []]);
    for (const c of allCauses) expect(new Set(c.wordings.map(declOf)).size, `${c.kind}:${c.id}`).toBe(1);
    for (const l of [...TENSION_CAUSES.guild_conflict.causes.flatMap((c) => c.wordings), ...TENSION_CAUSES.guild_conflict.plain]) expect(l.needs, l.text).toContain('guild');
  });
  it('the declarations are pinned (a changed atom reds; the implication itself is executed in tests/domain/display/tensionCause.test.js)', () => {
    const body = JSON.stringify(allLines.map((l) => [l.needs || [], l.excludes || [], l.crisis || []]));
    expect(createHash('sha256').update(body).digest('hex').slice(0, 16)).toBe(DECLARED);
  });
});

describe('data only', () => {
  it('holds no function and no pattern', () => {
    /** @param {unknown} v @param {string} at @returns {string[]} */
    const bad = (v, at) => {
      if (typeof v === 'function' || v instanceof RegExp) return [at];
      if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => bad(x, `${at}.${k}`));
      return [];
    };
    expect(bad(TENSION_CAUSES, 'TENSION_CAUSES')).toEqual([]);
    const code = readFileSync(new URL('../../src/data/tensionCauses.js', import.meta.url), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '""');
    expect(code).toMatch(/export const TENSION_CAUSES = Object\.freeze\(\{/);
    // anchored: the line above proves the scanned code is the data file's own, so an empty scan cannot pass these
    expect(code).not.toMatch(/=>|\bfunction\b|\bnew RegExp\b|\bimport\b/);
    // anchored: the same live scan as the line above (the export proven present two lines up)
    expect(code).not.toMatch(/[(,=:[]\s*\/[^/*]/);
  });
  it('is frozen through', () => {
    expect(Object.isFrozen(TENSION_CAUSES)).toBe(true);
    for (const k of kinds) {
      expect(Object.isFrozen(TENSION_CAUSES[k]) && Object.isFrozen(TENSION_CAUSES[k].causes) && Object.isFrozen(TENSION_CAUSES[k].plain), k).toBe(true);
      for (const c of TENSION_CAUSES[k].causes) expect(Object.isFrozen(c) && Object.isFrozen(c.wordings) && c.wordings.every((w) => Object.isFrozen(w)), `${k}:${c.id}`).toBe(true);
    }
  });
});
