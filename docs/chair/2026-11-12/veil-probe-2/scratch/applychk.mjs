import { readFileSync } from 'node:fs';
const pg = (await import(process.env.PG_MODULE)).default;
const a = new pg.Client({ database: 'postgres' }); await a.connect();
await a.query('drop database if exists chk with (force)'); await a.query('create database chk template cv211w'); await a.end();
const c = new pg.Client({ database: 'chk' }); await c.connect();
try { await c.query(readFileSync(process.argv[2], 'utf-8')); console.log('applied'); } catch (e) { console.log('FAIL', e.message, e.position); }
await c.end();
