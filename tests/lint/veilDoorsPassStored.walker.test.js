/**
 * veilDoorsPassStored.walker.test.js — EVERY SHARE DOOR PASSES ITS STORED ROW TO THE VEIL (RULING V27 (1) and (3); VEIL-55's
 * term (a) of 2026-11-25 07:30 UTC; VEIL-51's 2376572f3, rebuilt by VEIL-56's U45).
 *
 * THE LAW. The stored belt (212 (38), V27 (1)) reads the withheld set off THE STORED DOCUMENT: every power of the stored row
 * that the served document does not name, whatever stage dropped it. 212 :: _gallery_veil's FIVE-argument form takes that
 * row (`stored`, no default); its four-argument form is a wrapper passing NULL, so a door that calls the veil with three or
 * four arguments serves WITHOUT the belt, silently. V27 (3): a door that cannot see the stored row is not "listed": it
 * stops and comes to the chair.
 *
 * THE WALKER. Over supabase/migrations/*.sql in order, the LIVE statement of every function (its last `create or replace`)
 * is read; every live function whose body calls `public._gallery_veil(` (the veil itself, not a `_gallery_veil_*` helper)
 * is a SITE. A site is either THE WRAPPER (212's four-argument `_gallery_veil`, whose one call passes `null::jsonb` to the
 * five-argument form) or a REGISTERED DOOR, and a door's every call passes FIVE arguments, the fifth a stored row
 * (`src.j`, `base.j`, or a `jsonb_build_array(...)` of them: never NULL). RED on an unregistered site, on a registered door
 * gone, and on a door's call of fewer than five arguments or a fifth that is NULL.
 *
 * RED BY DESIGN: 211's get_gallery_map (the campaign map's member) calls the veil with THREE arguments and is not restated
 * in 212; it reds here, by name, until unit 3 (VEIL-52's doors) restates it and passes its stored row. The three 212 doors
 * pass. The judgment proves itself on synthetic statements first.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MIGRATIONS = join(ROOT, 'supabase/migrations');

/** The registered doors: each reads a stored row and must hand it to the veil. */
const DOORS = Object.freeze(['get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map']);
/** The wrapper's own statement: the four-argument `_gallery_veil`, one call, the stored argument NULL. */
const WRAPPER = '_gallery_veil(pub jsonb, overrides jsonb, link boolean, copy boolean default false)';

/** Each `create or replace function public.<name>(<args>)` statement of a SQL text, to the end of its body. */
function statementsOf(sql) {
  const out = [];
  const re = /^create or replace function public\.([A-Za-z_0-9]+)\(([^)]*)\)/gm;
  for (let m = re.exec(sql); m; m = re.exec(sql)) {
    const tagged = /\bas\s+(\$[A-Za-z_]*\$)/.exec(sql.slice(m.index));
    if (!tagged) continue;
    const open = m.index + tagged.index + tagged[0].length;
    const close = sql.indexOf(tagged[1], open);
    out.push({ name: m[1], sig: `${m[1]}(${m[2].trim()})`, body: sql.slice(open, close < 0 ? sql.length : close) });
  }
  return out;
}
/** Comment lines dropped. */
const codeOf = (body) => body.split('\n').map((l) => l.replace(/--.*$/, '')).join('\n');
/** The argument lists of every `public._gallery_veil(` call in a body (top-level commas split). */
function veilCalls(body) {
  const code = codeOf(body);
  const calls = [];
  for (let i = code.indexOf('public._gallery_veil('); i >= 0; i = code.indexOf('public._gallery_veil(', i + 1)) {
    let depth = 0;
    let arg = '';
    const args = [];
    for (let j = i + 'public._gallery_veil'.length; j < code.length; j += 1) {
      const c = code[j];
      if (c === '(') { depth += 1; if (depth === 1) continue; }
      if (c === ')') { depth -= 1; if (depth === 0) { args.push(arg.trim()); break; } }
      if (c === ',' && depth === 1) { args.push(arg.trim()); arg = ''; continue; }
      arg += c;
    }
    calls.push(args);
  }
  return calls;
}
/** The faults of a door's calls. @param {string} name @param {string[][]} calls */
function doorFaults(name, calls) {
  const out = [];
  if (!calls.length) out.push(`${name}: registered as a door, calls no veil`);
  for (const a of calls) {
    if (a.length < 5) out.push(`${name}: calls _gallery_veil with ${a.length} arguments (no stored row: the belt cannot run)`);
    else if (/^null(::jsonb)?$/i.test(a[4])) out.push(`${name}: passes NULL as the stored row`);
    else if (!/^(?:src\.j|base\.j|jsonb_build_array\((?:\s*(?:src|base)\.j\s*,?)+\))$/.test(a[4].replace(/\s+/g, ' ').replace(/\( /g, '(').replace(/ \)/g, ')'))) out.push(`${name}: its stored argument is not a stored row: ${a[4]}`);
  }
  return out;
}

/** The live statement of each function signature, over every migration in order. */
function liveStatements() {
  const live = new Map();
  for (const f of readdirSync(MIGRATIONS).filter((n) => /^\d+.*\.sql$/.test(n)).sort()) {
    for (const st of statementsOf(readFileSync(join(MIGRATIONS, f), 'utf8'))) live.set(st.sig, { ...st, file: f });
  }
  return [...live.values()];
}

describe('the judgment proves itself on synthetic statements (its own controls)', () => {
  it('a call of three or four arguments, or a NULL stored row, reds; five with a stored row is clean', () => {
    const sql = "create or replace function public.d1(x text)\nreturns jsonb language sql as $$\n  select public._gallery_veil(proj.d, s.o, false) -- a comment, public._gallery_veil(a, b, c, d, e)\n$$;\n"
      + "create or replace function public.d2(x text)\nreturns jsonb language sql as $$ select public._gallery_veil(proj.d, s.o, false, src.copied, jsonb_build_array(base.j, src.j)) $$;\n"
      + "create or replace function public.d3(x text)\nreturns jsonb language sql as $$ select public._gallery_veil(f(a, b), s.o, true, false, null) $$;\n";
    const st = statementsOf(sql);
    expect(st.map((x) => x.name)).toEqual(['d1', 'd2', 'd3']);
    expect(veilCalls(st[0].body)).toEqual([['proj.d', 's.o', 'false']]);
    expect(doorFaults('d1', veilCalls(st[0].body))).toEqual(['d1: calls _gallery_veil with 3 arguments (no stored row: the belt cannot run)']);
    expect(doorFaults('d2', veilCalls(st[1].body))).toEqual([]);
    expect(doorFaults('d3', veilCalls(st[2].body))).toEqual(['d3: passes NULL as the stored row']);
    expect(doorFaults('d4', [])).toEqual(['d4: registered as a door, calls no veil']);
  });
});

describe('RULING V27 (1), (3): every live share door passes its stored row to the five-argument veil', () => {
  const live = liveStatements();
  const sites = live.filter((st) => veilCalls(st.body).length > 0);

  it('every live function that calls the veil is the wrapper or a registered door; the wrapper passes NULL to the five-argument form', () => {
    expect(sites.length, 'the census is not vacuous').toBeGreaterThanOrEqual(4);
    const unregistered = sites.filter((st) => st.sig !== WRAPPER && !DOORS.includes(st.name)).map((st) => `${st.file} :: ${st.sig}`);
    expect(unregistered).toEqual([]);
    const wrapper = sites.find((st) => st.sig === WRAPPER);
    expect(wrapper && wrapper.file, 'the four-argument wrapper is 212\'s live statement').toBe('212_share_veil_later_cures.sql');
    expect(veilCalls(wrapper.body)).toEqual([['pub', 'overrides', 'link', 'copy', 'null::jsonb']]);
    const missing = DOORS.filter((d) => !live.some((st) => st.name === d)).map((d) => `${d}: registered, no live statement`);
    expect(missing).toEqual([]);
  });

  for (const door of DOORS) {
    it(`${door}: every call passes five arguments, the fifth its stored row${door === 'get_gallery_map' ? ' (RED BY DESIGN until unit 3 restates 211\'s map door)' : ''}`, () => {
      const st = live.filter((x) => x.name === door);
      expect(st.length, `${door} has one live statement`).toBe(1);
      expect(doorFaults(`${st[0].file} :: ${door}`, veilCalls(st[0].body))).toEqual([]);
    });
  }
});
