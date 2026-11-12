// The native scratch cluster (PostgreSQL 16, trust auth on a unix socket, the caller's own): a chain
// 001..N built from the files on disk, with the pglite probe's scaffold. PG_MODULE names a `pg` install
// outside the repository (package.json is a governed source); PGHOST/PGPORT/PGUSER name the cluster.
import { readFileSync } from 'node:fs';
import { SCAFFOLD_SQL, chainFiles } from '../../2026-11-11/veil-probe/chain.mjs';

const pg = (await import(process.env.PG_MODULE || 'pg')).default;
export const OWNER = '11111111-1111-1111-1111-111111111111';
export const READER = '22222222-2222-2222-2222-222222222222';

export async function client(database) {
  const c = new pg.Client({ database });
  await c.connect();
  return c;
}

/** Build `name` from 001..through; `replace` maps a file name to the text applied in its place. */
export async function nativeChain(name, through = 999, replace = {}) {
  const admin = await client('postgres');
  await admin.query(`drop database if exists ${name} with (force)`);
  await admin.query(`create database ${name}`);
  await admin.end();
  const db = await client(name);
  await db.query(SCAFFOLD_SQL);
  const failed = [];
  for (const [f, sql] of chainFiles(through)) {
    const text = replace[f] !== undefined ? readFileSync(replace[f], 'utf-8') : sql;
    try { await db.query(text); } catch (e) { failed.push(`${f}: ${String(e.message).slice(0, 160)}`); }
  }
  await db.query(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '${OWNER}';
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
  return { db, failed };
}

/** Reuse a built database. */
export async function open(name) { return { db: await client(name), failed: [] }; }
