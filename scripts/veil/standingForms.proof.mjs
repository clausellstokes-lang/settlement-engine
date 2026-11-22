#!/usr/bin/env node
// scripts/veil/standingForms.proof.mjs — THE TABLE'S PROOF (VEIL-36 R5D-FORMS, brief item 4). Light: one core, the local cluster.
//
//   node scripts/veil/standingForms.proof.mjs <scratch dir> [--pg] [--walk <births>]
//
// (a) every row of R5D-0's hand table (git show e1e5548cf:.../standing-table.mjs) is a row here, by id and by text, and every
//     literal its own expansion prints cuts to that id;
// (b) every row, expanded with the header's samples (every force word, every count word, every name and label), cuts WHOLE (JS);
// (c) with --pg: THE SAME IN POSTGRES (PGHOST/PGUSER from the environment, database r5dforms, no migration): regexp_match over
//     the printed literal's patterns, the lazy base "^(.*?)(?:^| )(" + re + ")$" (each pass loops the ROWS outermost in plpgsql, every
//     desc inside, so each pattern compiles once per pass: Postgres caches only 32 compiled regexes, and a join the planner
//     orders desc-outer recompiles all 117 for every desc; a row is first tested by
//     `~`, no capture, and the capture runs only where it matches); the PG cut equals the JS cut on every sample,
//     on the brief's four bases (which stay WHOLE), on each base + one standing, and on each base + two standings;
// (e) with --walk N: N tip births (r5dforms-0..N-1, every size); every standing the tip's engine AND master's engine (75e60fc94,
//     a scratch copy: it imports nothing) write over each roster cuts WHOLE, and the stored descs' split is counted.
// The last line is "PROOF exit <0|1>".
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileRows, cutDesc, expandTokens, literalOf, readTable, sha256 } from './standingForms.mjs';
import { powerSentenceName } from '../../src/data/people/powerSentenceName.js';
import { pluralPowerName } from '../../src/domain/display/pluralPowerName.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPO_VARS = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY', 'GIT_PREFIX', 'GIT_NAMESPACE'];
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !REPO_VARS.includes(k)));
const git = (...a) => execFileSync('git', a, { cwd: ROOT, env, encoding: 'utf8', maxBuffer: 1 << 26 });
export const BASES = [
  'The governing body is systematically compromised; offices are sold and justice is purchasable.',
  'Elders guide the community by custom, not by formal authority, but fewer and fewer people accept their word.',
  'An external interest with its own people placed inside the settlement. Its presence is not known to the settlement.',
  'Emergency committee with authority over rationing, conscription, and defence spending; not accountable to normal governance.',
];
const R5D0_TEXT = { '{X}': '{NAME|the governing council}', '{Y}': '{NAME|the second power}', '{Z}': '{NAME|the leading power}', '{S have}': '{NAME} {has|have}', '{S has}': '{NAME} {has|have}', '{S carries}': '{NAME} {carries|carry}', '{VOTE}': '{council vote|decision}' };

async function main(argv) {
  const dir = resolve(argv[0] || '');
  if (!argv[0]) { console.error('usage: standingForms.proof.mjs <scratch dir> [--pg] [--walk <births>]'); return 2; }
  mkdirSync(dir, { recursive: true });
  const table = readTable();
  const rows = compileRows(table.forms);
  const byId = new Map(table.forms.map((r) => [r.id, r]));
  let red = 0;
  const whole = new Map(table.forms.map((r) => [r.id, new RegExp(`^(?:${r.re})`)]));
  /** A sample cut whole to its own row, or to a row that spans the same sentence (a tie, broken by the smaller id). */
  const ownCut = (s, id) => { const c = cutDesc(s, rows); return !!c && c.base === '' && c.ids.length === 1 && (c.ids[0] === id || (whole.get(c.ids[0]).test(s) && whole.get(id).test(s))); };
  let ties = 0;
  const L = (s) => console.log(s);
  const bad = (s) => { red += 1; L(`  RED ${s}`); };

  // (a) R5D-0's table
  const r5d0 = join(dir, 'r5d0-standing-table.mjs');
  writeFileSync(r5d0, git('show', 'e1e5548cf:docs/chair/2026-11-20/veil/out/v34/r5d0/measure/standing-table.mjs'));
  const { FORMS, expand } = await import(r5d0);
  let aText = 0;
  const aWide = [];
  let aLit = 0;
  const aOff = [];
  for (const [id, , t] of FORMS) {
    const mine = byId.get(id);
    if (!mine) { bad(`(a) R5D-0's ${id} is no row`); continue; }
    if (!mine.origins.includes('tip')) bad(`(a) ${id} is not a tip row`);
    const said = Object.entries(R5D0_TEXT).reduce((s, [k, v]) => s.split(k).join(v), t);
    if (said === mine.template) aText += 1;
    else if (said === mine.template.split('{LABEL').join('{NAME')) { aText += 1; aWide.push(id); } else bad(`(a) ${id} by text: R5D-0 "${said}" / here "${mine.template}"`);
  }
  for (const [id, , s] of expand(table.header.samples.labels, powerSentenceName, pluralPowerName)) {
    const cut = cutDesc(s, rows);
    if (ownCut(s, byId.has(id) ? id : '')) { aLit += 1; if (cut.ids[0] !== id) ties += 1; } else aOff.push([id, s, cut ? cut.ids.join('+') : 'no match']);
  }
  L(`(a) R5D-0's ${FORMS.length} rows: ${FORMS.length - [...FORMS].filter(([id]) => !byId.has(id)).length} are rows here by id; ${aText} by text (${aWide.join(', ') || 'none'} widened: master writes the same sentence with a raw label, so the one row takes {LABEL}, which holds every {NAME})`);
  L(`(a) R5D-0's expansion over the ${table.header.samples.labels.length} sample labels: ${aLit} literals cut to their own id; ${aOff.length} do not:`);
  for (const [id, s, got] of aOff.slice(0, 8)) L(`    ${id} -> ${got}: "${s}"`);
  const aBogus = aOff.filter(([id, s]) => id === 'NM-more' && s.startsWith('The merchant guilds now have more say now:'));
  if (aOff.length !== aBogus.length) bad(`(a) ${aOff.length - aBogus.length} R5D-0 literals other than NM-more's "The merchant guilds now have more say now:" do not cut`);
  L(`    (R5D-0's NM-more also expands {S have} to "The merchant guilds now have more say now: ...", which no engine writes (the engine writes row NM-guilds, "...have more say: ..."); ${aBogus.length} such literals do not cut; it cuts here as NM-more, its words a name)`);

  // (b) every row's samples, whole, in JS
  const samples = [];
  for (const r of table.forms) for (const s of expandTokens(r.tokens, table.header.samples)) samples.push({ id: r.id, s });
  let bWhole = 0;
  for (const { id, s } of samples) {
    const cut = cutDesc(s, rows);
    if (ownCut(s, id)) { bWhole += 1; if (cut.ids[0] !== id) ties += 1; } else bad(`(b) ${id} sample does not cut whole to itself: "${s}" -> ${cut ? cut.ids.join('+') : 'no match'}`);
  }
  L(`(b) ${samples.length} samples of ${table.forms.length} rows: ${bWhole} cut WHOLE to their own row (JS); of (a) and (b), ${ties} are a same-span tie (two rows hold the one sentence: tip's and master's, e.g. R2-buy / M-R2-buy over a plain name), named by the smaller id`);

  // the bases: whole alone; base + one standing; base + two standings (the engine's rank line + a note)
  const cases = [];
  BASES.forEach((b, bi) => {
    cases.push({ s: b, base: b, ids: 0 });
    samples.forEach(({ id, s }, i) => {
      if (i % BASES.length === bi || id.startsWith('R') || /NAME|LABEL/.test(byId.get(id).template)) cases.push({ s: `${b} ${s}`, base: b, ids: 1 });
    });
    for (let i = 0; i < samples.length; i += 9) {
      const one = samples[i];
      const two = samples[(i * 13 + bi + 5) % samples.length];
      cases.push({ s: `${b} ${one.s} ${two.s}`, base: b, ids: 2 });
    }
  });
  let baseOk = 0;
  for (const c of cases) {
    const cut = cutDesc(c.s, rows);
    const base = cut ? cut.base : c.s;
    const ids = cut ? cut.ids.length : 0;
    if (base === c.base && ids === c.ids) baseOk += 1; else bad(`(c-js) "${c.s.slice(0, 160)}" -> base "${base.slice(0, 120)}" ids ${ids} (want ${c.ids})`);
  }
  L(`(c-js) the four bases: ${cases.length} cases (alone: whole; + one standing; + two): ${baseOk} cut back to the base exactly, by as many rows as were joined`);
  // the lazy base in JS too (the form the SQL builder writes): the same split, row by row
  let lazyAgree = 0;
  const lazyRows = table.forms.map((r) => ({ id: r.id, re: new RegExp(`^(.*?)(?:^| )(${r.re})`) }));
  const lazyCut = (desc) => {
    let rest = desc;
    const ids = [];
    for (;;) {
      let best = null;
      for (const r of lazyRows) { const m = r.re.exec(rest); if (m && (!best || m[1].length < best.base.length || (m[1].length === best.base.length && r.id < best.id))) best = { id: r.id, base: m[1] }; }
      if (!best) break;
      ids.unshift(best.id);
      rest = best.base;
    }
    return { base: rest, ids: ids.join('+') };
  };
  const all = [...samples.map(({ s }) => s), ...cases.map((c) => c.s)];
  for (const s of all) {
    const a = cutDesc(s, rows);
    const b = lazyCut(s);
    if ((a ? a.base : s) === b.base && (a ? a.ids.join('+') : '') === b.ids) lazyAgree += 1; else bad(`(c-js) lazy and index cuts differ on "${s.slice(0, 120)}"`);
  }
  L(`(c-js) the lazy-base cut equals the index cut on ${lazyAgree} / ${all.length}`);

  // (c) Postgres
  if (argv.includes('--pg')) {
    const literal = literalOf(table);
    const csv = (v) => `"${String(v).replace(/"/g, '""')}"`;
    writeFileSync(join(dir, 'lit.csv'), `${csv(literal)}\n`);
    writeFileSync(join(dir, 'cases.csv'), all.map((s, i) => `${i},${csv(s)}`).join('\n') + '\n');
    const sql = `\\set ON_ERROR_STOP on
create temp table lit(t text);
\\copy lit from '${join(dir, 'lit.csv')}' with (format csv)
create temp table forms as select key as id, value->>'re' as re from lit, jsonb_each(lit.t::jsonb);
create temp table cases(n int, s text);
\\copy cases from '${join(dir, 'cases.csv')}' with (format csv)
select 'literal_sha256', encode(sha256(convert_to(t, 'UTF8')), 'hex') from lit;
select 'forms', count(*) from forms;
create temp table w as select n, s as rest, ''::text as ids, true as live from cases;
create temp table cand(n int, id text, base text);
do $$ declare moved int; f record; begin loop
  truncate cand;
  for f in select id, re from forms order by id loop
    insert into cand select w.n, f.id, (regexp_match(w.rest, '^(.*?)(?:^| )(' || f.re || ')$'))[1] from w where w.live and w.rest ~ ('(?:^| )(?:' || f.re || ')');
  end loop;
  update w set live = false where w.live and not exists (select 1 from cand where cand.n = w.n);
  update w set rest = b.base, ids = b.id || case when w.ids = '' then '' else '+' || w.ids end from (select distinct on (n) n, id, base from cand order by n, length(base), id) b where b.n = w.n;
  get diagnostics moved = row_count; exit when moved = 0; end loop; end $$;
\\copy (select n, rest, ids from w order by n) to '${join(dir, 'pg-cut.csv')}' with (format csv)
`;
    writeFileSync(join(dir, 'cut.sql'), sql);
    const out = execFileSync('psql', ['-X', '-q', '-At', '-d', 'r5dforms', '-f', join(dir, 'cut.sql')], { env, encoding: 'utf8', maxBuffer: 1 << 26 });
    L(`(c-pg) ${out.trim().split('\n').join('; ')} (the literal printed: ${sha256(literal)})`);
    if (!out.includes(sha256(literal))) bad('(c-pg) Postgres read another literal');
    const { readFileSync } = await import('node:fs');
    const pg = parseCsv(readFileSync(join(dir, 'pg-cut.csv'), 'utf8'));
    let eq = 0;
    for (const [n, base, ids] of pg) {
      const s = all[Number(n)];
      const a = cutDesc(s, rows);
      if ((a ? a.base : s) === base && (a ? a.ids.join('+') : '') === ids) eq += 1; else bad(`(c-pg) PG and JS differ on "${s.slice(0, 120)}": PG base "${base.slice(0, 80)}" ids ${ids}`);
    }
    if (pg.length !== all.length) bad(`(c-pg) PG returned ${pg.length} of ${all.length} cases`);
    L(`(c-pg) the PG cut equals the JS cut on ${eq} / ${all.length} (${samples.length} samples, ${cases.length} base cases; the four bases alone stay whole)`);
  }

  // (e) the engines over real rosters
  const wi = argv.indexOf('--walk');
  if (wi >= 0) {
    const n = Number(argv[wi + 1] || 0);
    const masterCopy = join(dir, 'factionStanding.master.mjs');
    writeFileSync(masterCopy, git('show', '75e60fc94:src/generators/power/factionStanding.js'));
    const { annotateFactionStanding: masterAnnotate } = await import(masterCopy);
    const { annotateFactionStanding: tipAnnotate } = await import(join(ROOT, 'src/generators/power/factionStanding.js'));
    const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
    const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    const forces = table.header.samples.force.map((body) => ({ body }));
    const stat = { births: 0, tip: 0, master: 0, stored: 0, storedSplit: 0, fails: 0, seen: new Set() };
    for (let i = 0; i < n; i += 1) {
      const s = generateSettlementPipeline({ tier: tiers[i % 6], settType: tiers[i % 6] }, null, { seed: `r5dforms-${i}` });
      const fs = s?.powerStructure?.factions ?? [];
      stat.births += 1;
      for (const f of fs) {
        stat.stored += 1;
        const cut = cutDesc(f.desc || '', rows);
        if (cut) { stat.storedSplit += 1; cut.ids.forEach((id) => stat.seen.add(id)); }
      }
      for (const [k, annotate] of [['tip', tipAnnotate], ['master', masterAnnotate]]) {
        const clone = fs.map((f) => ({ ...f, desc: '' }));
        annotate(clone, forces[i % forces.length], k === 'tip' ? s.powerStructure : undefined);
        for (const f of clone) {
          if (!f.desc) continue;
          stat[k] += 1;
          const cut = cutDesc(f.desc, rows);
          if (!cut || cut.base !== '') { stat.fails += 1; bad(`(e) ${k}'s standing does not cut whole: "${f.desc.slice(0, 160)}"`); } else cut.ids.forEach((id) => stat.seen.add(id));
        }
      }
    }
    L(`(e) ${stat.births} births: ${stat.tip} tip standings and ${stat.master} master standings cut WHOLE; ${stat.stored} stored descs (${stat.storedSplit} cut to a base + standing); fails ${stat.fails}; ${stat.seen.size} rows exercised`);
  }
  L(`PROOF exit ${red ? 1 : 0}`);
  return red ? 1 : 0;
}

/** A minimal CSV reader (Postgres' csv: quoted fields, doubled quotes, newlines inside quotes). */
function parseCsv(text) {
  const out = [];
  let row = [];
  let f = '';
  let q = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { f += '"'; i += 1; } else if (c === '"') q = false; else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); out.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); out.push(row); }
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(await main(process.argv.slice(2)));
