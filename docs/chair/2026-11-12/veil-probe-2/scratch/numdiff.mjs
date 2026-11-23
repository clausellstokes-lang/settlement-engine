import { readFileSync } from 'node:fs';
const pg = (await import(process.env.PG_MODULE)).default;
const db = new pg.Client({ database: 'postgres' }); await db.connect();
await db.query('drop database if exists numdiff'); await db.query('create database numdiff'); await db.end();
const c = new pg.Client({ database: 'numdiff' }); await c.connect();
const sql = readFileSync(process.argv[2], 'utf-8');
// only the number helpers
const pick = (name) => { const i = sql.indexOf(`create or replace function public.${name}(`); return sql.slice(i, sql.indexOf('$$;', sql.indexOf('as $$', i)) + 3); };
for (const f of ['_gallery_veil_num_zero', '_gallery_veil_num_inf', '_gallery_veil_numstr']) await c.query(pick(f));
const buf = new DataView(new ArrayBuffer(8));
const toks = [];
let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) >>> 0);
for (let i = 0; i < 60000; i += 1) { buf.setUint32(0, rnd()); buf.setUint32(4, rnd()); const x = buf.getFloat64(0); if (Number.isFinite(x)) toks.push(JSON.stringify(x)); }
for (let i = 0; i < 20000; i += 1) { const x = (rnd() / 2 ** 32) * 10 ** ((rnd() % 60) - 30); toks.push(String(x)); toks.push(String(Math.round(x))); }
const extra = ['0', '-0', '1e-7', '1e21', '1e+21', '9007199254740993', '12345678901234567890123', '1e400', '-1e400', '1e-400', '-1e-400', '5e-324', '2.5e-324', '2.4703282292062327e-324', '2.4703282292062328e-324',
  '1.7976931348623157e308', '1.7976931348623158e308', '1.7976931348623159e308', '0.1', '-0.000001', '0.0000001', '123.456', '1E5', '100.0', '1e20', '123456789012345678901', '0.00000123', '-1.5e-10', '4.35e-6', '1e-6', '999999999999999999999.5'];
toks.push(...extra);
const text = `[${toks.join(',')}]`;
const r = await c.query(`select e::text as t, public._gallery_veil_numstr(e #>> '{}') as s from jsonb_array_elements($1::jsonb) e`, [text]);
let bad = 0; const ex = [];
for (const { t, s } of r.rows) { const want = String(JSON.parse(t)); if (want !== s) { bad += 1; if (ex.length < 10) ex.push({ t: t.slice(0, 60), want, s }); } }
console.log('values', r.rows.length, 'unequal', bad, JSON.stringify(ex));
await c.end();
