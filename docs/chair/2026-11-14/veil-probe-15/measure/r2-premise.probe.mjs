// VEIL-15, ITEM 2 (R2), THE PREMISE, BY EXECUTION: what the engine's processor match and the twin lower with, and whether
// the design's SQL form lowers as they do wherever the result can meet an ASCII needle, over every code point of every
// plane, in every SQL engine at hand. Read-only: it creates one scratch database (R2_CDB, ctype C, dropped at the end)
// to show what lower() does in a third locale; nothing else is written anywhere but its one output file (R2_OUT).
//   RV6_SRC=<tree> V15_PROBE=<this file> R2_OUT=<file> RV6_PGMOD=<dir with pg@8.13.1> PGHOST=<socket dir>
//   npx vitest run --config <veil-probe-15/measure/probe.config.mjs>
// J(t): String.prototype.toLowerCase (the engine's fuzzyProcessorMatch and the twin's `answers`).
// F(t): the design's form, translate(replace(replace(t, chr(304), 'i' || chr(775)), chr(8490), 'k'), A-Z, a-z).
// mask(t): t with every maximal run of code points outside ASCII written as one U+FFFF: two strings with one mask hold the
// same ASCII runs in the same order, so an ASCII needle is inside the one exactly where it is inside the other.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const az = 'abcdefghijklmnopqrstuvwxyz';
const F_SQL = (t) => `translate(replace(replace(${t}, chr(304), 'i' || chr(775)), chr(8490), 'k'), '${AZ}', '${az}')`;
const J = (t) => t.toLowerCase();
const F = (t) => t.replace(/İ/g, 'i̇').replace(/K/g, 'k').replace(/[A-Z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 32));
const mask = (t) => t.replace(/[^\x00-\x7f]+/gu, '￿');
const ascii = (t) => !/[^\x00-\x7f]/.test(t);
const hex = (t) => Array.from(t).map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`).join(' ');
const SCALARS = [];
for (let n = 1; n <= 0x10ffff; n += 1) if (n < 0xd800 || n > 0xdfff) SCALARS.push(n);

it('R2 premise: the lowering of the processor match, every code point of every plane, every engine', async () => {
  const out = [];
  const say = (s) => { out.push(s); };
  // ── 0. THE CODE, as it stands in this tree ──────────────────────────────────────────────────────────────────────
  const { readFileSync } = await import('node:fs');
  const engine = readFileSync(`${SRC}/src/generators/computeActiveChains.js`, 'utf8');
  const twin = readFileSync(`${SRC}/src/domain/display/gallerySecondHomes.js`, 'utf8');
  const sql = readFileSync(`${SRC}/supabase/migrations/212_share_veil_later_cures.sql`, 'utf8');
  say('0. THE CODE (this tree):');
  say(`  engine  ${(engine.match(/const fuzzyProcessorMatch = [^;]+;/s) || ['?'])[0].replace(/\s+/g, ' ')}`);
  say(`  twin    ${(twin.match(/const answers = [^;]+;/) || ['(no `answers`)'])[0]}`);
  say(`  server  ${(sql.match(/position\(left\(lower\(q\.v\), 12\) in lower\(g\)\) > 0/) || ['(no lower() in _gallery_veil_hidden_name)'])[0]}`);

  // ── 1. EVERY CODE POINT: J against F (JS), and each SQL engine's lower() and F ────────────────────────────────────
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const { PGlite } = await import(`${SRC}/node_modules/@electric-sql/pglite/dist/index.js`);
  const CDB = process.env.R2_CDB || 'v15r2ctype';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${CDB}`);
  await admin.query(`create database ${CDB} template template0 encoding 'UTF8' lc_collate 'C' lc_ctype 'C'`);
  const native = admin;
  const cdb = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: CDB }); await cdb.connect();
  const lite = new PGlite();
  const perPlane = `select n >> 16 as p, jsonb_agg(jsonb_build_array(n, lower(chr(n)), ${F_SQL('chr(n)')}) order by n)::text as a
                      from generate_series(1, 1114111) n where n < 55296 or n > 57343 group by 1 order by 1`;
  const engines = [];
  for (const [name, run] of [
    ['native PostgreSQL 16, database ctype C.UTF-8', (q) => native.query(q).then((r) => r.rows)],
    ['native PostgreSQL 16, database ctype C (scratch)', (q) => cdb.query(q).then((r) => r.rows)],
    ['pglite (the guards\' engine)', (q) => lite.query(q).then((r) => r.rows)],
  ]) {
    const meta = (await run(`select version() as v, (select datctype from pg_database where datname = current_database()) as c`))[0];
    const low = new Map(); const fs = new Map();
    for (const row of await run(perPlane)) for (const [n, l, f] of JSON.parse(row.a)) { low.set(n, l); fs.set(n, f); }
    engines.push({ name, meta, low, fs });
  }
  say('');
  say(`1. EVERY CODE POINT (U+0001 to U+10FFFF, the surrogates aside: ${SCALARS.length} code points; no text holds U+0000 or a surrogate):`);
  let jfExact = 0; let jfMask = 0; const jfMaskRows = []; const jAscii = [];
  for (const n of SCALARS) {
    const c = String.fromCodePoint(n); const j = J(c); const f = F(c);
    if (j !== f) jfExact += 1;
    if (mask(j) !== mask(f)) { jfMask += 1; if (jfMaskRows.length < 20) jfMaskRows.push(`${hex(c)} J=${hex(j)} F=${hex(f)}`); }
    if (n > 0x7f && /[\x00-\x7f]/.test(j)) jAscii.push(`${hex(c)} -> ${hex(j)}`);
  }
  say(`  J's image holds an ASCII code point for a code point outside ASCII: ${jAscii.length} (${jAscii.join('; ')})`);
  say(`  J against F (in JavaScript): exact disagreements ${jfExact} (every one outside ASCII in both images, see the mask); MASK disagreements ${jfMask}${jfMaskRows.length ? `: ${jfMaskRows.join('; ')}` : ''}`);
  for (const e of engines) {
    let fBad = 0; const fBadRows = []; let lowExact = 0; let lowMask = 0; const lowMaskRows = [];
    for (const n of SCALARS) {
      const c = String.fromCodePoint(n); const j = J(c);
      if (e.fs.get(n) !== F(c)) { fBad += 1; if (fBadRows.length < 10) fBadRows.push(hex(c)); }
      const l = e.low.get(n);
      if (l !== j) lowExact += 1;
      if (mask(l) !== mask(j)) { lowMask += 1; lowMaskRows.push(`${hex(c)} lower()=${hex(l)} J=${hex(j)}`); }
    }
    say(`  ${e.name} [${e.meta.v.split(' on ')[0]}; datctype ${e.meta.c}]:`);
    say(`    the SQL form F, against F in JavaScript: ${fBad} code points differ${fBadRows.length ? ` (${fBadRows.join(', ')})` : ''}`);
    say(`    BEFORE (lower()) against J: exact disagreements ${lowExact}; MASK disagreements ${lowMask}${lowMaskRows.length ? `: ${lowMaskRows.slice(0, 12).join('; ')}${lowMaskRows.length > 12 ? ' ...' : ''}` : ''}`);
    say(`    AFTER (F) against J: MASK disagreements ${jfMask} (F is F in JavaScript, measured above)`);
  }

  // ── 2. J IS CONTEXT-FREE ON THE MASK: a string's J is its code points' J, but for the final sigma (both images outside ASCII)
  const CTX = ['', 'a', 'A', ' ', 'Σ', 'σ', 'İ', '́', '1', 'Α', '𐐀', 'k'];
  let ctxExact = 0; let ctxMask = 0; const ctxRows = []; let calls = 0;
  for (const n of SCALARS) {
    const c = String.fromCodePoint(n); const jc = J(c);
    for (const x of CTX) for (const y of CTX) {
      calls += 1;
      const whole = J(x + c + y); const parts = J(x) + jc + J(y);
      if (whole !== parts) ctxExact += 1;
      if (mask(whole) !== mask(parts)) { ctxMask += 1; if (ctxRows.length < 10) ctxRows.push(`${hex(x + c + y)}`); }
    }
  }
  say('');
  say(`2. J IN CONTEXT (each code point between ${CTX.length} x ${CTX.length} contexts: ${calls} strings): J(x+c+y) differs from J(x)+J(c)+J(y) in ${ctxExact} strings (the final sigma), on the MASK in ${ctxMask}${ctxRows.length ? `: ${ctxRows.join('; ')}` : ''}`);

  // ── 3. THE ENGINE'S MATCH IS J, AND THE TWIN'S RULE IS THE ENGINE'S: pairs (house name g, processing name x) ─────────
  const chains = await import(`${SRC}/src/generators/computeActiveChains.js`);
  const ALPHA = ['a', 'b', 'i', 'k', 'r', 'o', 'n', ' ', 'I', 'K', 'R', 'O', 'N', 'İ', 'K', 'ı', '̇', 'ß', 'ẞ', 'Σ', 'σ', 'ς', 'Α', 'α',
    'Ж', 'ж', 'Ä', 'ä', '𐐀', '𐐨', 'ǅ', 'Ω', 'Å', '-', "'", '1'];
  let seed = 20261115; // mulberry32: exact in 32-bit integers (a float LCG loses its low bits past 2^53)
  const rnd = (m) => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) % m; };
  const word = (len, asciiBias) => { let t = ''; for (let i = 0; i < len; i += 1) t += rnd(100) < asciiBias ? ALPHA[rnd(12)] : ALPHA[rnd(ALPHA.length)]; return t; };
  const pairs = [];
  for (let i = 0; i < 6000; i += 1) {
    const x = word(4 + rnd(14), rnd(2) ? 92 : 60);
    const g = rnd(3) === 0 ? word(rnd(6), 70) + x + word(rnd(8), 70) : rnd(2) ? word(rnd(6), 70) + (rnd(2) ? x.toUpperCase() : x.toLowerCase()) + word(rnd(6), 70) : word(6 + rnd(18), 70);
    pairs.push([g, x]);
  }
  // the hand rows' own pairs
  pairs.push(['İron smelter yard', 'Iron smelter'], ['Iron smelter of the Vale', 'Iron smelter'], ['Kiln works', 'Kiln'], ['Kiln of the Marsh', 'Kiln'],
    ['Kiln of the Marsh', 'Kiln'], ['ΧΑΛΚΟΣ ΑΓΟΡΑ', 'Χαλκοσ'], ['Straßenmarkt yard', 'Straßenmarkt'],
    ['ÄPFEL HAUS', 'Äpfel'], ['КУЗНИЦА двора', 'Кузница']);
  let engMiss = 0; const engRows = [];
  for (const [g, x] of pairs) {
    const e = chains.institutionMatchesProcessor({ name: g }, x);
    const j = J(g).includes(J(x).slice(0, 12));
    if (e !== j) { engMiss += 1; if (engRows.length < 5) engRows.push(`${JSON.stringify(g)} ${JSON.stringify(x)}`); }
  }
  say('');
  say(`3. THE ENGINE (computeActiveChains.js :: institutionMatchesProcessor, an unstamped house) against J(g).includes(J(x).slice(0, 12)), ${pairs.length} pairs: ${engMiss} differ${engRows.length ? `: ${engRows.join('; ')}` : ''}`);

  // ── 4. THE STRING LEVEL, in every SQL engine: the needle's ASCII-ness and, for an ASCII needle, the match ────────────
  say('');
  say(`4. THE MATCH ON ${pairs.length} PAIRS (a needle: the first twelve of the lowered processing name; JavaScript slices code units, SQL left() code points):`);
  const sqlPairs = `select i, ${F_SQL('x')} as fx, left(${F_SQL('x')}, 12) !~ '[^\\x01-\\x7f]' as a, position(left(${F_SQL('x')}, 12) in ${F_SQL('g')}) > 0 as m,
                           position(left(lower(x), 12) in lower(g)) > 0 as ml
                      from unnest($1::text[], $2::text[]) with ordinality u(g, x, i) order by i`;
  const gs = pairs.map((p) => p[0]); const xs = pairs.map((p) => p[1]);
  for (const [name, run] of [['native C.UTF-8', (q, a) => native.query(q, a).then((r) => r.rows)], ['native C', (q, a) => cdb.query(q, a).then((r) => r.rows)],
    ['pglite', (q, a) => lite.query(q, a).then((r) => r.rows)]]) {
    const rows = await run(sqlPairs, [gs, xs]);
    let aBad = 0; let asciiN = 0; let mBad = 0; let mlBad = 0; let nonAscii = 0; let nonAsciiBad = 0; let naLowBad = 0; const mlRows = []; const naRows = [];
    rows.forEach((r, k) => {
      const [g, x] = pairs[k];
      const nj = J(x).slice(0, 12); const aj = ascii(nj); const mj = J(g).includes(nj);
      if (aj !== r.a) aBad += 1;
      if (aj) {
        asciiN += 1;
        if (r.m !== mj) mBad += 1;
        if (r.ml !== mj) { mlBad += 1; if (mlRows.length < 4) mlRows.push(`${JSON.stringify(g)} ${JSON.stringify(x)} lower()=${r.ml} J=${mj}`); }
      } else {
        nonAscii += 1;
        if (r.ml !== mj) naLowBad += 1;
        if (r.m !== mj) { nonAsciiBad += 1; if (naRows.length < 4) naRows.push(`${JSON.stringify(g)} ${JSON.stringify(x)} F=${r.m} J=${mj}`); }
      }
    });
    say(`  ${name}: the needle ASCII in one engine and not in the other: ${aBad}; ASCII needles ${asciiN}: F's match differs from J's in ${mBad}, lower()'s in ${mlBad}${mlRows.length ? ` (${mlRows.join('; ')})` : ''}`);
    say(`  ${' '.repeat(name.length)}  needles holding a code point outside ASCII ${nonAscii}: lower()'s match differs from J's in ${naLowBad}, F's in ${nonAsciiBad}${naRows.length ? ` (${naRows.join('; ')})` : ''}`);
  }

  // ── 5. WHAT THE ENGINE CAN WRITE: every processing pattern of the static data, every catalogue name ─────────────────
  const strs = (v, acc = []) => { if (typeof v === 'string') acc.push(v); else if (Array.isArray(v)) v.forEach((x) => strs(x, acc)); else if (isRec(v)) Object.values(v).forEach((x) => strs(x, acc)); return acc; };
  const patterns = new Set();
  const walkPatterns = (v, seen = new Set()) => {
    if (!v || typeof v !== 'object' || seen.has(v)) return; seen.add(v);
    if (Array.isArray(v)) { v.forEach((x) => walkPatterns(x, seen)); return; }
    for (const [k, x] of Object.entries(v)) { if (k === 'processingInstitutions' || k === 'processingInstitutionsByResource') strs(x).forEach((t) => patterns.add(t)); else walkPatterns(x, seen); }
  };
  for (const mod of ['src/data/supplyChainData.js', 'src/data/resourceChains.js']) { try { walkPatterns(await import(`${SRC}/${mod}`)); } catch (err) { say(`  (${mod}: ${String(err).slice(0, 80)})`); } }
  const { ALL_CATALOG_NAMES } = await import(`${SRC}/src/domain/institutions/institutionCategory.js`);
  const nonAsciiPat = [...patterns].filter((t) => !ascii(t)); const nonAsciiCat = [...ALL_CATALOG_NAMES].filter((t) => !ascii(t));
  say('');
  say(`5. WHAT THE ENGINE WRITES: ${patterns.size} processing patterns in the static chain data, ${nonAsciiPat.length} holding a code point outside ASCII${nonAsciiPat.length ? ` (${nonAsciiPat.join(', ')})` : ''}; ${ALL_CATALOG_NAMES.length} catalogue names, ${nonAsciiCat.length} outside ASCII${nonAsciiCat.length ? ` (${nonAsciiCat.slice(0, 5).join(', ')})` : ''}`);

  await cdb.end();
  await admin.query(`drop database if exists ${CDB}`);
  const left = (await admin.query('select count(*)::int as n from pg_database where datname = $1', [CDB])).rows[0].n;
  say(`(the scratch database ${CDB}: dropped; ${left} left)`);
  await admin.end();
  await lite.close();
  writeFileSync(process.env.R2_OUT, `${out.join('\n')}\n`);
  console.log(out.join('\n'));
}, 14_400_000);
