/**
 * founderTransferDueCron.pglite.test.js — the due-runner dispatch guard (162, §6.6,
 * slice M-7c). Applies the REAL 162 migration into pglite and pins that the pure
 * _founder_transfer_cron_should_dispatch(cfg) guard returns exactly the branch the
 * hourly dispatcher acts on: not_configured / disabled / ok. The pg_cron + pg_net
 * DO blocks apply cleanly (their extensions are absent → the guarded notices fire).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_162 = resolve(dir, '162_founder_transfer_due_cron.sql');

let db;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create table if not exists public.system_config (key text primary key, value jsonb not null, updated_at timestamptz default now());
  `);
  // 162 applies cleanly even without pg_cron/pg_net (the DO blocks catch + notice).
  await db.exec(readFileSync(MIG_162, 'utf8'));
}, 60000);

async function verdict(cfg) {
  const arg = cfg === null ? 'null' : `'${JSON.stringify(cfg)}'::jsonb`;
  const { rows } = await db.query(`select public._founder_transfer_cron_should_dispatch(${arg}) as v`);
  return rows[0].v;
}

describe('_founder_transfer_cron_should_dispatch', () => {
  it('missing/malformed config → not_configured', async () => {
    expect(await verdict(null)).toBe('not_configured');
  });
  it('enabled=false → disabled (the kill switch), even with url+secret', async () => {
    expect(await verdict({ enabled: false, url: 'https://x/founder-transfer', secret: 's' })).toBe('disabled');
  });
  it('enabled but url or secret absent → not_configured (INERT until the operator sets them)', async () => {
    expect(await verdict({ enabled: true, url: null, secret: 's' })).toBe('not_configured');
    expect(await verdict({ enabled: true, url: 'https://x/founder-transfer', secret: null })).toBe('not_configured');
    expect(await verdict({ enabled: true, url: '', secret: '' })).toBe('not_configured');
  });
  it('enabled + url + secret all present → ok (fires hourly, no hour/dedupe gate)', async () => {
    expect(await verdict({ enabled: true, url: 'https://x/founder-transfer', secret: 's' })).toBe('ok');
  });
});
