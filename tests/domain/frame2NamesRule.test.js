/**
 * tests/domain/frame2NamesRule.test.js — THE NAMES RULE IN FRAME-2'S OWN FILES (FRAME-2 · B5; the chair's ruling: "a power
 * in a sentence takes its prose form with its article through the one helper (`display/governanceAccount.js ::
 * powerNameInProse`); a person's second mention in one sentence is a pronoun from that person's own `gender` where no
 * second person of that gender is in play, else the role, else the surname, else the given name; a pronoun or a role is
 * never the ONLY reference to a person or a power in a stored string").
 *
 * Over a born pool of 120 towns (10 calm and 10 in crisis a tier, thorp to metropolis; the calm by `{ settType }` alone,
 * seeds `b5-names-calm-<tier>-<i>`, a birth with a crisis set aside; the crisis towns by `{ settType, stressTypes }`, one or
 * two kinds cycling the catalogue, seeds `b5-names-crisis-<tier>-<i>`), every sentence the four files compose is read for
 * the rule's four breaches:
 *   (A) a power named in a sentence not through `powerNameInProse` (a raw slashed or bracketed label, a doubled article,
 *       a missing article, a capital "The" mid-sentence);
 *   (B) a person named twice in one sentence by full name;
 *   (C) a pronoun or a role as the only reference to a person or a power in a string the crisis cast STORES;
 *   (D) a pronoun that disagrees with the person's own `gender`.
 * A string that is the record's own text copied verbatim (a person's own goal or secret, a tension's sentence, a template
 * hook) is not these files' composition and is not read here (docs/chair/2026-11-20/content/frame2/B5-NAMES-RESULTS.md).
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet, sideReadOf, CAST_WANTS } from '../../src/domain/summary/tonightSheet.js';
import { castTroubleFrame } from '../../src/domain/tension/troubleCast.js';
import { crisisHooksOf, crisisHookFor } from '../../src/domain/crisis/crisisHooks.js';
import { effectiveCastOf } from '../../src/domain/crisis/crisisCast.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { powerNameAfterArticle } from '../../src/domain/display/powerSentenceName.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KINDS = Object.keys(STRESS_TYPE_MAP);
const PER = 10;
/** @param {any} s */
const entriesOf = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);

/** The born pool: per tier, ten calm towns and ten in crisis. */
function bornPool() {
  const out = [];
  for (const tier of TIERS) {
    for (let i = 0, got = 0; got < PER && i < PER * 4; i += 1) {
      const seed = `b5-names-calm-${tier}-${i}`;
      const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
      if (entriesOf(s).length) continue;
      out.push({ seed, s, calm: true });
      got += 1;
    }
    for (let i = 0; i < PER; i += 1) {
      const seed = `b5-names-crisis-${tier}-${i}`;
      const k = TIERS.indexOf(tier) * PER + i;
      const stressTypes = [KINDS[k % KINDS.length], KINDS[(k * 5 + 2) % KINDS.length]].filter((x, j, a) => a.indexOf(x) === j).slice(0, 1 + (i % 2));
      out.push({ seed, s: generateSettlementPipeline({ settType: tier, stressTypes }, null, { seed, customContent: {} }), calm: false });
    }
  }
  return out;
}

/** @param {string} x */
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** (A): every power of the town named in `text`, read against its prose form with its article. @param {string} text @param {string[]} powers */
function breachesA(text, powers) {
  const hits = [];
  if (/\b[Tt]he [Tt]he\b/.test(text)) hits.push('doubled article');
  let masked = text;
  const forms = powers.map((raw) => ({ raw, body: powerNameAfterArticle(raw) })).filter((f) => f.body).sort((a, b) => b.body.length - a.body.length);
  for (const { raw, body } of forms) {
    if (raw !== body && /[/(]/.test(raw) && masked.includes(raw)) { hits.push(`raw label "${raw}"`); masked = masked.split(raw).join('#'); }
    const re = new RegExp(`(^|[^\\w'])${esc(body)}(?![\\w])`, 'g');
    let m;
    while ((m = re.exec(masked))) {
      const before = masked.slice(0, m.index + m[1].length);
      if (!/(?:^|\s)(?:the|The) $/.test(before)) hits.push(`no article: "${body}"`);
      else if (/\S\s+The $/.test(before) && !/[.!?:]\s+The $/.test(before)) hits.push(`capital article mid-sentence: "The ${body}"`);
    }
    masked = masked.replace(re, (_, p) => `${p}#`);
  }
  return hits;
}
/** (B): a person named twice by full name in one sentence. @param {string} text @param {string[]} names */
const breachesB = (text, names) => names.filter((n) => n.includes(' ') && text.split(n).length > 2).map((n) => `"${n}" twice`);
const PRONOUNS = Object.freeze({ female: /\b(she|her|hers|herself)\b/i, male: /\b(he|him|his|himself)\b/i, neutral: /\b(they|them|their|theirs|themselves)\b/i });
/** (D): a pronoun of another gender than the person's own. @param {string} text @param {unknown} gender */
function breachesD(text, gender) {
  const g = gender === 'female' || gender === 'male' ? gender : 'neutral';
  return Object.entries(PRONOUNS).filter(([k, re]) => k !== g && re.test(text)).map(([k]) => `${k} pronoun for a ${String(gender || 'ungendered')} person`);
}
const STORED_PRONOUN = /\b(it|its|they|their|them|he|him|his|she|her|this one|whoever)\b/i;
const ROLE_FOR_POWER = /\b(the military|the church|the merchants|crime|the occupier|the governing house|the seat)\b/i;
/** (C): a stored string whose only reference to a person or a power is a pronoun or a role. @param {string} text @param {string[]} named */
function breachesC(text, named) {
  if (named.some((n) => n && text.includes(n))) return [];
  const p = text.match(STORED_PRONOUN);
  if (p) return [`pronoun only: "${p[0]}"`];
  const r = text.match(ROLE_FOR_POWER);
  return r ? [`role only: "${r[0]}"`] : [];
}
/**
 * FRAME-3 · B11, from FRAME-2 · B10's lead (the chair's ruling of 2026-11-20: "a person takes the pronoun of their own
 * `gender`, else 'they'; a power holding the row keeps 'it'"): a reason the cast STORES on a row held by a PERSON never says
 * "it" or "its" of that person; the person's own pronoun is from `gender` (she/her, he/his, else they/their). The "it" that
 * names something the sentence itself names first is not the holder's, and is masked before the read: the seat ("holds the
 * seat, and the right to it"), the house ("the blame falls on the house, and its good name"), the occupation ("the
 * occupation's resistance turns on its local face").
 * @param {string} text @param {unknown} gender
 */
function personItBreaches(text, gender) {
  const masked = text
    .replace(/\bthe right to it\b/g, '#')
    .replace(/\bthe house, and its\b/g, '#')
    .replace(/\bthe occupation's resistance turns on its\b/g, '#');
  const hits = [];
  const it = masked.match(/\b(it|its)\b/i);
  if (it) hits.push(`"${it[0]}" said of a person`);
  const own = gender === 'female' ? 'her' : gender === 'male' ? 'his' : 'their';
  for (const p of ['her', 'his']) if (p !== own && new RegExp(`\\b${p}\\b`, 'i').test(masked)) hits.push(`"${p}" for a ${String(gender || 'ungendered')} person`);
  return hits;
}
/** The role wants (`CAST_WANTS`) as patterns: a cast person's line the sheet composes, not the person's own goal. */
const WANT_LINES = Object.values(CAST_WANTS).flat().map((l) => new RegExp(`^${esc(l).replace(/\\\{\w+\\\}/g, '.+?')}$`));

/** Every breach, by file and kind, over the pool. */
function readPool() {
  /** @type {Record<string, Array<{ seed: string, kind: string, where: string, why: string, text: string }>>} */
  const by = { tonightSheet: [], crisisHooks: [], troubleCast: [], crisisCast: [], personIt: [] };
  const read = { tonightSheet: 0, crisisHooks: 0, troubleCast: 0, crisisCast: 0 };
  for (const { seed, s } of bornPool()) {
    const powers = (s.powerStructure?.factions || []).map((/** @type {any} */ f) => f.faction || f.name).filter(Boolean);
    const npcs = (s.npcs || []).filter(Boolean);
    const names = npcs.map((/** @type {any} */ n) => n.name).filter(Boolean);
    const byName = new Map(npcs.map((/** @type {any} */ n) => [n.name, n]));
    const byId = new Map(npcs.map((/** @type {any} */ n) => [n.id || n.name, n]));
    /** @param {keyof typeof by} file @param {string} text @param {string} where @param {any} [person] */
    const check = (file, text, where, person) => {
      if (!text) return;
      read[file] += 1;
      for (const why of breachesA(text, powers)) by[file].push({ seed, kind: 'A', where, why, text });
      for (const why of breachesB(text, names)) by[file].push({ seed, kind: 'B', where, why, text });
      if (person) for (const why of breachesD(text, person.gender)) by[file].push({ seed, kind: 'D', where, why, text });
    };
    const sheet = composeTonightSheet(s, { audience: 'owner' });
    if (sheet.crisis) check('tonightSheet', sheet.crisis.line, 'crisis.line');
    for (const p of sheet.people) {
      if (p.why === 'cast' && p.says === 'want' && WANT_LINES.some((re) => re.test(p.line))) check('tonightSheet', p.line, 'people.line (a role want)', byName.get(p.name));
      if (p.reason) check('troubleCast', p.reason, 'people.reason', byName.get(p.name));
    }
    for (const side of sheet.frame?.sides || []) {
      const r = sideReadOf(side);
      check('tonightSheet', r.why, 'side.why');
      if (side.sameAs) check('tonightSheet', r.wants, 'side.wants');
    }
    const frame = castTroubleFrame(s);
    for (const side of frame?.sides || []) {
      check('troubleCast', side.words, 'side.words');
      if (side.face) check('troubleCast', side.face.reason, `face.reason (${side.face.rule})`, side.face.npcId ? byId.get(side.face.npcId) : null);
    }
    for (const entry of entriesOf(s)) {
      const { cast } = effectiveCastOf(s, entry);
      for (const h of crisisHooksOf(s, { type: entry.type, cast })) check('crisisHooks', h.text, `crisisHooksOf (${h.bound})`);
      check('crisisHooks', crisisHookFor(s, entry), 'crisisHookFor');
      const c = entry.cast;
      if (!c) continue;
      const stored = [
        ...c.roles.map((/** @type {any} */ r) => ({ t: r.reason, w: `cast.roles.${r.role}.reason (${r.kind})` })),
        ...c.absent.map((/** @type {any} */ r) => ({ t: r.reason, w: `cast.absent.${r.role}.reason` })),
        ...c.stakes.map((/** @type {any} */ r) => ({ t: r.reason, w: `cast.stakes.${r.stake}.reason` })),
      ];
      for (const r of c.roles) {
        if (r.kind !== 'npc') continue;
        const person = byId.get(r.id) || byName.get(r.name);
        for (const why of personItBreaches(r.reason, person?.gender)) by.personIt.push({ seed, kind: 'IT', where: `${entry.type} · cast.roles.${r.role}.reason`, why, text: r.reason });
      }
      for (const { t, w } of stored) {
        read.crisisCast += 1;
        for (const why of breachesA(t, powers)) by.crisisCast.push({ seed, kind: 'A', where: w, why, text: t });
        for (const why of breachesB(t, names)) by.crisisCast.push({ seed, kind: 'B', where: w, why, text: t });
        for (const why of breachesC(t, [...names, ...powers])) by.crisisCast.push({ seed, kind: 'C', where: w, why, text: t });
      }
    }
  }
  return { by, read };
}

const { by, read } = readPool();
/** @param {keyof typeof by} file @param {string} kind */
const of = (file, kind) => by[file].filter((b) => b.kind === kind);
/** @param {Array<{ seed: string, where: string, why: string, text: string }>} list */
const shown = (list) => list.slice(0, 5).map((b) => `${b.seed} · ${b.where} · ${b.why}: ${b.text}`).join('\n');

describe('the names rule in FRAME-2\'s own files, over 120 born towns', () => {
  it('reads every file\'s output (the pool is not empty)', () => {
    // FRAME-2 · B5c: measured 97 at 8df635b61 (247 at 79db75eb2). The sheet is composed as the owner throughout; the fall
    // is B2's weight (CF11): only a calm town with a trouble of weight is framed now, 10 of this pool's 60 calm towns
    // (3 villages, 2 cities, 5 metropolises; all 60 before), so the sides' sentences fell from 180 to 30.
    expect(read.tonightSheet).toBeGreaterThan(90);
    expect(read.crisisHooks).toBeGreaterThan(100);
    expect(read.troubleCast).toBeGreaterThan(300);
    expect(read.crisisCast).toBeGreaterThan(300);
  });

  for (const file of /** @type {const} */ (['tonightSheet', 'crisisHooks', 'troubleCast', 'crisisCast'])) {
    for (const kind of ['A', 'B', 'D']) {
      it(`${file}: no breach of kind (${kind})`, () => {
        const list = of(file, kind);
        expect(list.length, shown(list)).toBe(0);
      });
    }
  }

  // FRAME-3 · B11: no reason the cast stores on a person's row calls that person "it" (red at 4421fbf6c:
  // docs/chair/2026-11-20/content/frame3/B11-PERSON-NOT-IT-RESULTS.md).
  it('crisisCast: no stored reason on a person\'s row calls that person "it"; the pronoun is the person\'s own', () => {
    const list = by.personIt;
    expect(list.length, shown(list)).toBe(0);
  });

  // ⛔ OPEN, THE SEAT RULES (B5's census, step 4): the crisis cast's stored reasons and stakes are a closed vocabulary
  // that names nobody (factionRename.js's law: no rename reaches it), so nearly every one refers to its person or power
  // by "it", "its", "this one", "whoever" or a role ("the military", "the seat"). Naming them would rewrite the stored
  // record of every crisis town, so B5 stopped at the census. This assertion is the rule's zero; it fails today, and
  // `it.fails` says so until the seat's ruling lands, when it must be flipped to `it`. The reader is generous: at
  // 79db75eb2 it reads 762 strings, 598 of them by hand a true (C); the other 164 say "it" of the crisis, the seat or the
  // role ("gains and loses by it at once"), and must be told apart when the flip lands (B5-NAMES-RESULTS.md).
  it.fails('crisisCast: no breach of kind (C) in what the cast stores', () => {
    expect(of('crisisCast', 'C').length).toBe(0);
  });
});
