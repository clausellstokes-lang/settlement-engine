// born/sweep-removes.mjs <pg module dir> <db>...      REVIEW-VEIL-7, LOCAL scratch only.
// WHAT THE NAME SWEEP TAKES. For each database a cold run left behind, a clone `<db>_ns` is made in which
// _gallery_veil_sweep returns its input; every share is then read (gallery, link) from both, and every string the
// read WITH the sweep no longer sends is listed by path, with the towns and an example. (An array that lost an entry
// is compared as a multiset of its strings.)
import { execFileSync } from 'node:child_process';
const [pgdir, ...dbs] = process.argv.slice(2);
const pg = (await import(`${pgdir}/node_modules/pg/lib/index.js`)).default;
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const psql = (db, sql) => execFileSync('psql', ['-U', 'postgres', '-qd', db, '-v', 'ON_ERROR_STOP=1', '-c', sql], { env: process.env });
const rows = {}; let reads = 0, changed = 0; const towns = new Set();
const strings = (v, path, out) => { if (typeof v === 'string') (out[path] = out[path] || []).push(v);
  else if (Array.isArray(v)) v.forEach(x => strings(x, `${path}[]`, out)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out); return out; };
for (const dbname of dbs) {
  psql('postgres', `drop database if exists ${dbname}_ns with (force)`); psql('postgres', `create database ${dbname}_ns template ${dbname}`);
  psql(`${dbname}_ns`, `create or replace function public._gallery_veil_sweep(v jsonb, named jsonb, pre text, is_root boolean) returns jsonb language sql immutable as $f$ select v $f$`);
  const a = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await a.connect();
  const b = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: `${dbname}_ns` }); await b.connect();
  const list = (await a.query(`select name, public_slug, unlisted_slug, gallery_share_dm dm from public.settlements where public_slug is not null and public_slug not like 'rv7%' order by public_slug`)).rows;
  for (const sh of list) for (const read of ['gallery', 'link']) {
    const q = read === 'gallery' ? `select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d` : `select public.get_unlisted_dossier($1) -> 'dossier' as d`;
    const arg = [read === 'gallery' ? sh.public_slug : sh.unlisted_slug];
    const withS = (await a.query(q, arg)).rows[0]?.d, without = (await b.query(q, arg)).rows[0]?.d;
    if (!isRec(withS) || !isRec(without)) continue; reads += 1; towns.add(sh.name);
    const sa = strings(withS, '$', {}), sb = strings(without, '$', {}); let any = false;
    for (const [path, vals] of Object.entries(sb)) {
      const left = [...(sa[path] || [])];
      for (const v of vals) { const i = left.indexOf(v); if (i >= 0) { left.splice(i, 1); continue; }
        any = true; const r = rows[path] = rows[path] || { towns: new Set(), n: 0, ex: new Set() }; r.towns.add(sh.name); r.n += 1; if (r.ex.size < 3) r.ex.add(`${sh.name}: ${v.slice(0, 110)}`); }
    }
    if (any) changed += 1;
  }
  await a.end(); await b.end(); psql('postgres', `drop database if exists ${dbname}_ns with (force)`);
}
console.log(`sweep census over ${dbs.join(',')}: ${towns.size} towns, ${reads} reads compared, ${changed} reads from which the sweep took a string`);
for (const k of Object.keys(rows).sort()) console.log(`${k} | towns ${rows[k].towns.size} | strings ${rows[k].n}\n      e.g. ${[...rows[k].ex].join('\n           ')}`);
