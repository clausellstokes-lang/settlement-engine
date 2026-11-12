import { readFileSync } from 'node:fs';
const pg = (await import(process.env.PG_MODULE)).default;
const q = async (db, sql) => { const c = new pg.Client({ database: db }); await c.connect(); const r = await c.query(sql); await c.end(); return r; };
const a = new pg.Client({ database: 'postgres' }); await a.connect();
await a.query('drop database if exists rb with (force)'); await a.query('create database rb template cv211w'); await a.end();
await q('rb', readFileSync(process.argv[2], 'utf-8'));  // the working 211 over the 211 chain (create or replace)
await q('rb', readFileSync(process.argv[3], 'utf-8'));  // the down
const CAT = `select p.oid::regprocedure::text as sig, md5(p.prosrc) b, p.provolatile, p.prosecdef, p.proconfig::text c, p.proacl::text acl from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' order by 1`;
const x = (await q('rb', CAT)).rows, y = (await q('cv210', CAT)).rows;
const k = (r) => JSON.stringify(r);
const xs = new Set(x.map(k)), ys = new Set(y.map(k));
console.log('rb', x.length, '210', y.length, 'only-rb', x.filter((r) => !ys.has(k(r))).map((r) => r.sig).slice(0, 8), 'only-210', y.filter((r) => !xs.has(k(r))).map((r) => r.sig).slice(0, 8));
