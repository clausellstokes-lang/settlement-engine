/**
 * clientErrorReports.pglite.test.js — EXECUTION tests for the client-error
 * admin read/alert functions over public.client_error_events (migration 167 —
 * renumbered from 156 by the V-E fold; caught by migrationRefIntegrity.meta).
 *
 * The two REAL migration function bodies run inside in-process Postgres
 * against a minimal client_error_events mirror. What's pinned:
 *
 *   • report_client_errors GROUPS by the normalized signature (digit runs
 *     blanked), so "…line 42" / "…line 88" collapse into one counted row;
 *     distinct messages stay distinct; ordering is by event_count desc.
 *   • report_client_error_alert counts DISTINCT signatures in the last hour,
 *     ignores rows older than the window, and flips over_threshold at >8.
 *   • the grant posture is service_role-only (structural, over the SQL text).
 *
 * LIMITATION (same as the other *.pglite tests): single-connection superuser,
 * so the grant is pinned by regex over the migration text, not role execution.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_167 = resolve(process.cwd(), 'supabase', 'migrations', '167_client_error_reports.sql');
const exists = existsSync(MIG_167);
const src = exists ? readFileSync(MIG_167, 'utf8') : '';

/** Extract a `create or replace function … $$;` block verbatim (harness idiom). */
function extractFn(text, name) {
  const m = text.match(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'im'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

let db;

beforeAll(async () => {
  if (!exists) return;
  db = new PGlite();
  // Minimal mirror of the migration-081 table (only the columns the reads touch).
  await db.exec(`
    create table public.client_error_events (
      id bigserial primary key,
      kind text,
      message text,
      url text,
      release text,
      created_at timestamptz not null default now()
    );
  `);
  await db.exec(extractFn(src, 'report_client_errors'));
  await db.exec(extractFn(src, 'report_client_error_alert'));
}, 60000); // PGlite cold-start can exceed the default 10s hook budget under load.

beforeEach(async () => {
  if (exists) await db.exec('truncate public.client_error_events;');
});

const insert = (kind, message, opts = {}) =>
  db.query(
    `insert into public.client_error_events (kind, message, url, release, created_at)
     values ($1, $2, $3, $4, coalesce($5::timestamptz, now()))`,
    [kind, message, opts.url ?? null, opts.release ?? null, opts.at ?? null],
  );

describe.skipIf(!exists)('report_client_errors — grouping', () => {
  it('collapses digit-varying messages into one counted signature', async () => {
    await insert('window.error', 'boom at line 42');
    await insert('window.error', 'boom at line 88');
    await insert('window.error', 'boom at line 99');
    await insert('unhandledrejection', 'kaboom');
    await insert('unhandledrejection', 'kaboom');

    const { rows } = await db.query(
      `select signature, kind, event_count from public.report_client_errors(current_date, current_date)`,
    );
    // Two groups: the three "boom at line #" collapse; the two "kaboom" collapse.
    expect(rows).toHaveLength(2);
    // Ordered by event_count desc → the boom group (3) first.
    expect(Number(rows[0].event_count)).toBe(3);
    expect(rows[0].signature).toBe('window.error: boom at line #');
    expect(Number(rows[1].event_count)).toBe(2);
    expect(rows[1].signature).toBe('unhandledrejection: kaboom');
  });

  it('surfaces a sample message + url and the releases seen', async () => {
    await insert('window.error', 'boom at 1', { url: 'https://x/a', release: 'r1' });
    await insert('window.error', 'boom at 2', { url: 'https://x/b', release: 'r2' });
    const { rows } = await db.query(
      `select sample_message, sample_url, releases from public.report_client_errors(current_date, current_date)`,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].sample_url).toMatch(/^https:\/\/x\//);
    expect(rows[0].releases).toContain('r1');
    expect(rows[0].releases).toContain('r2');
  });
});

describe.skipIf(!exists)('report_client_error_alert — threshold', () => {
  it('counts distinct signatures in the last hour and stays under threshold', async () => {
    await insert('window.error', 'a');
    await insert('window.error', 'a'); // dup signature
    await insert('window.error', 'b');
    const { rows } = await db.query(`select * from public.report_client_error_alert()`);
    expect(Number(rows[0].distinct_signatures)).toBe(2);
    expect(Number(rows[0].total_events)).toBe(3);
    expect(rows[0].over_threshold).toBe(false);
    expect(Number(rows[0].threshold)).toBe(8);
  });

  it('ignores events older than the one-hour window', async () => {
    await insert('window.error', 'recent');
    await insert('window.error', 'stale', { at: new Date(Date.now() - 2 * 3600_000).toISOString() });
    const { rows } = await db.query(`select * from public.report_client_error_alert()`);
    expect(Number(rows[0].distinct_signatures)).toBe(1);
    expect(Number(rows[0].total_events)).toBe(1);
  });

  it('flips over_threshold above 8 distinct signatures', async () => {
    // Distinct, NON-digit messages: digit runs are blanked by the normalizer, so
    // "sig-0"…"sig-8" would (correctly) collapse to one signature.
    for (const c of 'abcdefghi') await insert('window.error', `failure ${c}`);
    const { rows } = await db.query(`select * from public.report_client_error_alert()`);
    expect(Number(rows[0].distinct_signatures)).toBe(9);
    expect(rows[0].over_threshold).toBe(true);
  });
});

describe.skipIf(!exists)('grant posture (structural)', () => {
  it('locks both functions to service_role, revoking public', () => {
    expect(src).toMatch(/revoke all on function public\.report_client_errors\(date, date\) from public;/);
    expect(src).toMatch(/grant execute on function public\.report_client_errors\(date, date\) to service_role;/);
    expect(src).toMatch(/revoke all on function public\.report_client_error_alert\(\) from public;/);
    expect(src).toMatch(/grant execute on function public\.report_client_error_alert\(\) to service_role;/);
  });
});
