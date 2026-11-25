/**
 * standingFormsTotality.walker.test.js — THE STANDING TABLE'S TOTALITY, MASTER'S FORMS PINNED, AND THE CENSUS OF STORED
 * TAILS (VEIL-51 unit 4 item 3, STANDWALK; RULING V15; V14 (1), (2); test-only).
 *
 * THE TABLE. scripts/veil/standingForms.data.json is the ONE frozen table by which migration 212 and the client's twin
 * (galleryWithholdAlways.js :: standingBase) cut the STANDING tail (factionStanding.js :: annotateFactionStanding's appended
 * prose) off every served power desc. Its door, scripts/veil/standingForms.mjs, derives the forms a writer source appends
 * STATICALLY (deriveForms), and is the JS reference cut (compileRows, cutDesc). Nothing in tests/ ran it before this file.
 *
 *   1. TOTALITY BY CONSTRUCTION (V14 (2)). Every form the tip's writer source derives (the module's own deriveForms over
 *      src/generators/power/factionStanding.js, its local helpers inlined) is a row (by template, or a row whose language
 *      holds it: the module's subsumes), each such row's re is its own template's pattern (reOf), and every row's re
 *      matches, and the cut takes whole, every sample of its own template (expandTokens over the header's samples). The
 *      check is the module's `--check`, composed here from its exported functions (it does not export `check`, which reads
 *      the tip from disk): no derivation is re-implemented. RED FIRST: the same check over a PLANTED source text (the tip's
 *      text with one extra standing sentence added as a second branch of one closed form, built here as a string, never
 *      written to src/) reds with exactly that form named.
 *   2. MASTER'S FORMS PINNED (V14 (2)). The forms master's writer at db832c892 derives
 *      (src/generators/power/factionStanding.js at that commit) are RECORDED in
 *      tests/fixtures/standingForms.master-db832c892.json (the templates, their tokens and patterns, the commit, the path, the
 *      blob, the force's words, and the command that made it: no git at run time); every recorded template is a row.
 *   3. THE CENSUS OF STORED TAILS (V14 (1), (2)), a MEASURE, run only under STANDWALK_POOLS=<today's pool>:<master's pool>
 *      (r3m-*.json stored documents; skipped in the gate's default run). For every stored power desc of the served roster
 *      (pageRederive.js :: servedRosterOf; a row the read hides keeps no desc on any read, is never cut, and is counted
 *      apart as `hidden rows`) the table's cut gives base + standing, judged against a GROUND TRUTH:
 *        today-born: the tree's writer as pageRederive.js :: rederiveStanding calls it (rosterText.js :: standingRosterOf
 *          over the served roster, annotateFactionStanding with standingForceOf(houses) and the seat's legitimacy); the
 *          stored tail is the writer's tail where the desc ends in it, else (DRIFT: the stored roster's re-run is not the
 *          birth's; counted and listed) the longest form-boundary suffix of it the desc ends in;
 *        master-born: the master writer is out of reach at run time; its recorded templates (arm 2's fixture) judge: every
 *          cut segment must be one recorded template whole, and no base may still end in one.
 *      Classes per pool: CUT EXACTLY, NO TAIL, UNCUT (a tail the cut misses), AMBIGUOUS (two rows match at one start), WRONG
 *      (the cut removes text the writer did not write). The counts are appended to STANDWALK_MEASURES (when set); UNCUT,
 *      AMBIGUOUS and WRONG must be 0, every case listed when not (the arm is never tuned to the pools).
 */
import { describe, it, expect } from 'vitest';
import { appendFileSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  readTable,
  deriveForms,
  forceWords,
  subsumes,
  reOf,
  expandTokens,
  compileRows,
  cutDesc,
  CHECK_MESSAGE,
} from '../../scripts/veil/standingForms.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TIP_PATH = 'src/generators/power/factionStanding.js';
const FIXTURE_PATH = 'tests/fixtures/standingForms.master-db832c892.json';
const POOLS = process.env.STANDWALK_POOLS || '';
const MEASURES = process.env.STANDWALK_MEASURES || '';

/** The planted sentence: a standing form no writer has ever written (the red-first control's subject). */
const PLANTED = 'They keep a seat nobody recalls granting them, and nobody has yet asked for it back.';

/** @param {any} table @param {string[]} force @param {{ template: string, tokens: any[] }} f @returns {any | null} the row that holds the form */
const rowOf = (table, force, f) => table.forms.find((r) => r.template === f.template) || table.forms.find((r) => subsumes(r.tokens, f.tokens, force)) || null;

/**
 * The module's `--check`, composed from its exports over a SOURCE TEXT: every derived form a row, that row's re its own
 * template's pattern. @param {string} source @param {any} table @param {string[]} force @returns {string[]}
 */
function totalityErrors(source, table, force) {
  const errors = [];
  for (const f of deriveForms(source)) {
    const row = rowOf(table, force, f);
    if (!row) errors.push(`line ${f.line}: no row holds the form "${f.template}"`);
    else if (row.re !== reOf(row.tokens, force)) errors.push(`${row.id}: its re is not its own template's pattern`);
  }
  return errors;
}

/** Every row's re against its own template's samples, and the cut taking each whole. @param {any} table @returns {string[]} */
function sampleErrors(table) {
  const errors = [];
  const compiled = compileRows(table.forms);
  for (const row of table.forms) {
    const re = new RegExp(`^(?:${row.re})`);
    const samples = expandTokens(row.tokens, table.header.samples);
    if (!samples.length) errors.push(`${row.id}: no sample`);
    for (const s of samples) {
      if (!re.test(s)) errors.push(`${row.id}: its re does not match its own template's sample "${s}"`);
      const cut = cutDesc(s, compiled);
      if (!cut || cut.base !== '') errors.push(`${row.id}: its sample does not cut whole: "${s}"`);
    }
  }
  return errors;
}

/** @param {string} hay @param {string} needle @returns {number} */
const occurrences = (hay, needle) => hay.split(needle).length - 1;

describe('standing forms: the table is total over the writers (V14 (2)) and the stored tails cut (V14 (1))', () => {
  it('1. TOTALITY BY CONSTRUCTION: every form the tip\'s writer derives is a row, every row matches its own samples; a planted extra form reds by name', () => {
    const table = readTable();
    const force = forceWords();
    expect(force, 'the force\'s body words moved from the table\'s samples').toEqual(table.header.samples.force);
    const tipSource = readFileSync(join(ROOT, TIP_PATH), 'utf8');
    const tipForms = deriveForms(tipSource);
    expect(tipForms.length, 'the deriver found the tip\'s forms').toBeGreaterThan(20);

    // RED FIRST: one closed form's literal, once in the source, gains a second branch carrying the planted sentence
    const anchor = tipForms.find((f) => f.tokens.length === 1 && f.tokens[0].t === 'lit' && !f.tokens[0].v.includes("'") && occurrences(tipSource, `'${f.tokens[0].v}'`) === 1);
    expect(anchor, 'a closed form whose literal stands once in the source').toBeTruthy();
    const lit = `'${anchor.tokens[0].v}'`;
    const planted = tipSource.replace(lit, `(Math.random() < 0 ? '${PLANTED}' : ${lit})`);
    expect(occurrences(planted, PLANTED)).toBe(1);
    const plantedForms = deriveForms(planted);
    expect(plantedForms.map((f) => f.template)).toContain(PLANTED);
    expect(plantedForms.length).toBe(tipForms.length + 1);
    const plantedErrors = totalityErrors(planted, table, force);
    expect(plantedErrors, `the planted check reds with the planted form named (${CHECK_MESSAGE})`).toHaveLength(1);
    expect(plantedErrors[0]).toMatch(/^line \d+: no row holds the form "/);
    expect(plantedErrors[0].endsWith(`"${PLANTED}"`), plantedErrors[0]).toBe(true);

    // THE TIP: green
    expect(totalityErrors(tipSource, table, force), CHECK_MESSAGE).toEqual([]);
    expect(sampleErrors(table)).toEqual([]);
    expect(table.forms.every((r) => r.re === reOf(r.tokens, force)), 'every row\'s re is its own template\'s pattern').toBe(true);
  });

  it('2. MASTER\'S FORMS PINNED: every form master\'s writer at db832c892 derives (the recorded extraction) is a row', () => {
    const table = readTable();
    const force = forceWords();
    const fx = JSON.parse(readFileSync(join(ROOT, FIXTURE_PATH), 'utf8'));
    expect(fx.commit).toBe('db832c892');
    expect(fx.commitFull.startsWith(fx.commit)).toBe(true);
    expect(fx.path).toBe(TIP_PATH);
    expect(typeof fx.command === 'string' && fx.command.includes('deriveForms') && fx.command.includes(`"${fx.commit}"`) && fx.command.includes('git'), 'the fixture names the command that made it').toBe(true);
    expect(fx.forms.length, 'the recorded extraction holds master\'s forms').toBeGreaterThan(20);
    for (const f of fx.forms) expect(f.re, `the recorded re is its own template's pattern: ${f.template}`).toBe(reOf(f.tokens, fx.force));
    // the control: the same membership reds a form no writer wrote (a recorded closed form with a word added)
    const closed = fx.forms.find((f) => f.tokens.length === 1 && f.tokens[0].t === 'lit');
    const altered = { template: `${closed.template} Planted.`, tokens: [{ t: 'lit', v: `${closed.tokens[0].v} Planted.` }] };
    expect(rowOf(table, force, altered), 'the membership reds an altered form').toBe(null);
    const missing = fx.forms.filter((f) => !rowOf(table, force, f)).map((f) => `${fx.commit}:${fx.path}:${f.line}: no row holds "${f.template}"`);
    expect(missing, CHECK_MESSAGE).toEqual([]);
  });

  it.skipIf(!POOLS)('3. THE CENSUS OF STORED TAILS (a measure: runs only under STANDWALK_POOLS=<today>:<master>; skipped in the gate\'s default run): UNCUT, AMBIGUOUS and WRONG are 0 in both pools', async () => {
    const [todayDir, masterDir] = POOLS.split(':');
    expect(todayDir && masterDir, 'STANDWALK_POOLS=<today-born pool>:<master-born pool>').toBeTruthy();
    const { servedRosterOf } = await import('../../src/domain/veil/pageRederive.js');
    const { standingRosterOf, standingForceOf } = await import('../../src/generators/power/rosterText.js');
    const { annotateFactionStanding } = await import('../../src/generators/power/factionStanding.js');
    const table = readTable();
    const compiled = compileRows(table.forms);
    const fx = JSON.parse(readFileSync(join(ROOT, FIXTURE_PATH), 'utf8'));
    const masterWhole = fx.forms.map((f) => ({ template: f.template, re: new RegExp(`^(?:${f.re})`) }));
    const masterTail = fx.forms.map((f) => ({ template: f.template, re: new RegExp(`(?:^| )(${f.re})`) }));
    const mirrorErrors = [];

    /** The cut's steps, each with every row matching at its start (the cut keeps the smallest id): it must agree with cutDesc. */
    const stepsOf = (/** @type {string} */ desc) => {
      let rest = desc;
      const steps = [];
      for (;;) {
        const hits = compiled.map((r) => ({ id: r.id, m: r.re.exec(rest) })).filter((h) => h.m);
        if (!hits.length) break;
        const at = Math.min(...hits.map((h) => h.m.index));
        const tied = hits.filter((h) => h.m.index === at);
        const ids = tied.map((h) => h.id).sort();
        const m = tied[0].m;
        steps.unshift({ ids, text: rest.slice(at + m[0].length - m[1].length) });
        rest = rest.slice(0, at);
      }
      const cut = cutDesc(desc, compiled);
      const ids = steps.map((s) => s.ids[0]);
      if (cut ? cut.base !== rest || JSON.stringify(cut.ids) !== JSON.stringify(ids) : steps.length) mirrorErrors.push(desc);
      return { cut, steps };
    };
    /** The longest suffix of the writer's tail, at a form boundary, the desc ends in. */
    const storedTailOf = (/** @type {string} */ desc, /** @type {string} */ tail) => {
      const ends = (/** @type {string} */ s) => desc === s || desc.endsWith(` ${s}`);
      if (!tail || ends(tail)) return tail;
      for (let i = 2; i < tail.length; i += 1) if (tail[i - 1] === ' ' && /[.!?]/.test(tail[i - 2]) && ends(tail.slice(i))) return tail.slice(i);
      return '';
    };
    const filesOf = (/** @type {string} */ dir) => readdirSync(dir).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
    const CLASSES = ['CUT EXACTLY', 'NO TAIL', 'UNCUT', 'AMBIGUOUS', 'WRONG'];
    const fresh = () => ({ counts: Object.fromEntries(CLASSES.map((k) => [k, 0])), cases: [], docs: 0, rows: 0, extra: {} });
    const bump = (/** @type {any} */ o, /** @type {string} */ k) => { o.extra[k] = (o.extra[k] || 0) + 1; };
    /** Rows the read hides (stamped `hidden` or masked): their desc is dropped on every read, never cut; counted apart. */
    const countHidden = (/** @type {any} */ doc, /** @type {any} */ o, /** @type {any[]} */ served) => {
      const all = (doc.powerStructure?.factions || []).filter((f) => f && typeof f.desc === 'string');
      for (let i = served.filter((f) => typeof f.desc === 'string').length; i < all.length; i += 1) bump(o, 'hidden rows');
    };

    // ── today-born: the tree's writer as rederiveStanding calls it ──
    const today = fresh();
    for (const file of filesOf(todayDir)) {
      const doc = JSON.parse(readFileSync(join(todayDir, file), 'utf8'));
      today.docs += 1;
      const roster = servedRosterOf(doc);
      countHidden(doc, today, roster);
      let tails;
      try {
        const seats = standingRosterOf(roster).map((f) => ({ ...f, desc: '' }));
        annotateFactionStanding(seats, standingForceOf(doc.institutions), { publicLegitimacy: doc.powerStructure?.publicLegitimacy });
        tails = new Map(seats.map((f) => [f.faction, String(f.desc || '')]));
      } catch (e) {
        today.cases.push({ class: 'UNREAD', file, why: String(e) });
        bump(today, 'UNREAD');
        continue;
      }
      for (const f of roster) {
        if (typeof f.desc !== 'string') continue;
        today.rows += 1;
        const tail = tails.get(String(f.faction || '')) ?? '';
        const stored = storedTailOf(f.desc, tail);
        if (stored !== tail) bump(today, 'DRIFT');
        const { cut, steps } = stepsOf(f.desc);
        const got = cut ? cut.standing : '';
        const k = got === stored
          ? (steps.some((s) => s.ids.length > 1) ? 'AMBIGUOUS' : stored ? 'CUT EXACTLY' : 'NO TAIL')
          : stored.endsWith(got) && (got === '' || stored === got || stored.endsWith(` ${got}`)) ? 'UNCUT' : 'WRONG';
        if (cut === null) bump(today, 'cut null');
        today.counts[k] += 1;
        if (!['CUT EXACTLY', 'NO TAIL'].includes(k) || stored !== tail) {
          today.cases.push({ class: k, drift: stored !== tail, file, faction: f.faction, writerTail: tail, storedTail: stored, cut: got, ids: steps.map((s) => s.ids) });
        }
      }
    }

    // ── master-born: the recorded master templates judge ──
    const master = fresh();
    for (const file of filesOf(masterDir)) {
      const doc = JSON.parse(readFileSync(join(masterDir, file), 'utf8'));
      master.docs += 1;
      const served = servedRosterOf(doc);
      countHidden(doc, master, served);
      for (const f of served) {
        if (typeof f.desc !== 'string') continue;
        master.rows += 1;
        const { cut, steps } = stepsOf(f.desc);
        const base = cut ? cut.base : f.desc;
        const left = masterTail.find((m) => m.re.test(base));
        const foreign = steps.filter((s) => !masterWhole.some((m) => m.re.test(s.text)));
        const k = foreign.length ? 'WRONG' : left ? 'UNCUT' : steps.some((s) => s.ids.length > 1) ? 'AMBIGUOUS' : cut ? 'CUT EXACTLY' : 'NO TAIL';
        if (cut === null) bump(master, 'cut null');
        master.counts[k] += 1;
        if (!['CUT EXACTLY', 'NO TAIL'].includes(k)) {
          master.cases.push({ class: k, file, faction: f.faction, desc: f.desc, cut: cut ? cut.standing : '', foreign: foreign.map((s) => s.text), leftTemplate: left ? left.template : null, ids: steps.map((s) => s.ids) });
        }
      }
    }

    const line = (/** @type {string} */ name, /** @type {string} */ dir, /** @type {any} */ o) =>
      `standwalk census ${new Date().toISOString()} pool=${name} dir=${dir} docs=${o.docs} rows=${o.rows} ${CLASSES.map((k) => `${k.replaceAll(' ', '_')}=${o.counts[k]}`).join(' ')} ${Object.entries(o.extra).map(([k, v]) => `${k.replaceAll(' ', '_')}=${v}`).join(' ')}\n`;
    if (MEASURES) {
      appendFileSync(MEASURES, line('today', todayDir, today));
      appendFileSync(MEASURES, line('master', masterDir, master));
      for (const c of [...today.cases.map((c) => ({ pool: 'today', ...c })), ...master.cases.map((c) => ({ pool: 'master', ...c }))]) appendFileSync(MEASURES, `  case ${JSON.stringify(c)}\n`);
    }
    expect(mirrorErrors, 'the census\'s steps agree with cutDesc').toEqual([]);
    expect(today.docs > 0 && master.docs > 0, 'both pools hold r3m-*.json documents').toBe(true);
    const findings = (/** @type {any} */ o) => o.cases.filter((c) => ['UNCUT', 'AMBIGUOUS', 'WRONG', 'UNREAD'].includes(c.class));
    expect(findings(today), `today-born: ${line('today', todayDir, today)}`).toEqual([]);
    expect(findings(master), `master-born: ${line('master', masterDir, master)}`).toEqual([]);
  }, 600000);
});
