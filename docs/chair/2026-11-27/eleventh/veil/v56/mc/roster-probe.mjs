// MC (VEIL-56): WHERE _gallery_veil_roster_choices's OWN TIME GOES, statement by statement (a LOCAL instrumented copy).
//   node roster-probe.mjs <db (holding 212 and trial-roster.sql)> <trial-roster.sql> <stored dir> <out json>
// Cuts an instrumented copy of the (hoisted) function: before each TOP-LEVEL statement of its body (two-space indent) a
// `raise notice` of clock_timestamp() and the statement's first words. Installs it, then for the 12 largest stored documents
// runs the map member's own path for an unmarked member (the sanitiser, the link's splice, the link's veil, which calls the
// function) and sums each statement's time from one notice to the next. A timing recipe: it judges nothing a read serves.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const [DB, TRIAL, DIR, OUT] = process.argv.slice(2);
const src = readFileSync(TRIAL, 'utf8').split('\n');
const b = src.findIndex((l) => l === 'begin'); const e = src.lastIndexOf('end $$;');
const out = [];
src.forEach((l, i) => {
  if (i > b && i < e && /^  [a-z]/.test(l) && !/^  (end if;|end loop;|else|elsif)/.test(l)) {
    const label = `L${i} ${l.trim().slice(0, 60).replace(/['%]/g, '')}`;
    out.push(`  raise notice 'mcp|%|${label}', (extract(epoch from clock_timestamp()) * 1000)::numeric(20,3);`);
  }
  if (i === e) out.push(`  raise notice 'mcp|%|END', (extract(epoch from clock_timestamp()) * 1000)::numeric(20,3);`);
  out.push(l);
});
// a `return` before the end: the probe's last mark is at the return's own notice; mark every return too
const sql = out.join('\n').replace(/^(\s+)(if not whole then return s; end if;)/m, "$1if not whole then raise notice 'mcp|%|END', (extract(epoch from clock_timestamp()) * 1000)::numeric(20,3); return s; end if;");
const db = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: DB }); await db.connect();
await db.query(sql);
const files = readdirSync(DIR).filter((f) => /^r3m-.*\.json$/.test(f)).map((f) => [f, statSync(`${DIR}/${f}`).size]).sort((x, y) => y[1] - x[1]).slice(0, 12).map((x) => x[0]);
const tot = {}; let calls = 0;
let marks = [];
db.on('notice', (m) => { const p = String(m.message).split('|'); if (p[0] === 'mcp') marks.push([Number(p[1]), p[2]]); });
for (const f of files) {
  const raw = readFileSync(`${DIR}/${f}`, 'utf8');
  marks = [];
  await db.query(`select public._gallery_veil(
      public._gallery_apply_member_overrides(public._gallery_sanitize_public_json(d), public._gallery_sanitize_public_json(d)
        || (select coalesce(jsonb_object_agg(k, d -> k), '{}'::jsonb) from unnest(array['relationships', 'prominentRelationship', 'pressureSentence']) k where d ? k),
        '{}'::jsonb, false, true, false), '{}'::jsonb, true) is not null from (select $1::jsonb d) x`, [raw]);
  // the function runs once a read on this path: marks come in order, from the first statement to END
  for (let i = 0; i + 1 < marks.length; i += 1) { const [t, l] = marks[i]; const dt = marks[i + 1][0] - t; tot[l] = (tot[l] || 0) + dt; if (l.startsWith('L')) calls += 0; }
  calls += 1;
}
const rows = Object.entries(tot).sort((x, y) => y[1] - x[1]).map(([l, ms]) => ({ statement: l, msTotal: +ms.toFixed(1), msPerCall: +(ms / calls).toFixed(2) }));
writeFileSync(OUT, JSON.stringify({ db: DB, documents: files, calls, rows }, null, 1));
for (const r of rows.slice(0, 15)) console.log(r.msPerCall, r.statement);
await db.end();
