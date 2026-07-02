/**
 * index.test.ts — regression tests for the analytics-export low finding:
 * a QUERY ERROR must not be conflated with "no new rows". A persistently
 * failing view previously reported ok:true forever (the error object was
 * discarded), and the daily_rollups leg re-exported the whole table every run
 * with no cursor.
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT
 * vitest). `handleAnalyticsExport` is the exported handler; a recording admin
 * stub is injected via its `deps.adminClient` seam (production passes nothing).
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
Deno.env.set('EXPORT_SHARED_SECRET', 'sekrit');

const { handleAnalyticsExport } = await import('./index.ts');

type TableResult = { data?: unknown; error?: { message: string } | null };

/**
 * Admin stub: `research` maps a research view name to its query result;
 * `rollups` is the analytics_daily_rollups result; export_cursors reads resolve
 * to no cursor and upserts are recorded so a test can assert bookmark movement.
 */
function makeAdmin(research: Record<string, TableResult>, rollups: TableResult = { data: [] }) {
  const cursorUpserts: Array<Record<string, unknown>> = [];
  const uploads: string[] = [];
  const finish = (r: TableResult) => Promise.resolve({ data: r.data ?? null, error: r.error ?? null });
  // Thenable query builder: every refinement returns itself; awaiting resolves.
  const builder = (r: TableResult) => {
    // deno-lint-ignore no-explicit-any
    const q: any = {};
    for (const m of ['select', 'gt', 'lt', 'order', 'limit', 'eq']) q[m] = () => q;
    q.maybeSingle = () => finish(r);
    q.then = (res: (v: unknown) => unknown, rej?: (e: unknown) => unknown) => finish(r).then(res, rej);
    return q;
  };
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (table: string) => {
      if (table === 'export_cursors') {
        return {
          select: () => builder({ data: null }), // no cursor yet
          upsert: (row: Record<string, unknown>) => {
            cursorUpserts.push(row);
            return finish({ data: null });
          },
        };
      }
      if (table === 'analytics_daily_rollups') return builder(rollups);
      return builder({ data: [] });
    },
    schema: () => ({ from: (view: string) => builder(research[view] ?? { data: [] }) }),
    storage: {
      from: () => ({
        upload: (path: string) => {
          uploads.push(path);
          return Promise.resolve({ error: null });
        },
      }),
    },
  };
  return { client, cursorUpserts, uploads };
}

const req = () =>
  new Request('https://edge/analytics-export', {
    method: 'POST',
    headers: { 'x-export-secret': 'sekrit', 'user-agent': 'pg_net/0.7' },
  });

Deno.test('a failing research view is a FAILED run (ok:false, 500), not a quiet month', async () => {
  const admin = makeAdmin({
    snapshots: { error: { message: 'permission denied for schema research' } },
    edits: { data: [] },
  });
  const res = await handleAnalyticsExport(req(), { adminClient: () => admin.client });
  assertEquals(res.status, 500);
  const body = await res.json();
  assertEquals(body.ok, false);
  const snap = body.results.find((r: { view: string }) => r.view === 'snapshots');
  assertEquals(snap.exported, 0);
  assertEquals(typeof snap.error, 'string');
  // The failed leg's cursor must NOT advance (retry next run picks it up).
  assertEquals(admin.cursorUpserts.length, 0);
});

Deno.test('a genuinely empty month stays ok:true 200 with zero exports', async () => {
  const admin = makeAdmin({ snapshots: { data: [] }, edits: { data: [] } }, { data: [] });
  const res = await handleAnalyticsExport(req(), { adminClient: () => admin.client });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.results.every((r: { exported: number }) => r.exported === 0), true);
});

Deno.test('daily_rollups is CURSORED by day: exports move the YYYYMMDD bookmark after upload', async () => {
  const admin = makeAdmin(
    { snapshots: { data: [] }, edits: { data: [] } },
    { data: [
      { day: '2026-06-29', metric: 'homepage', dims: {}, value: 4 },
      { day: '2026-06-30', metric: 'homepage', dims: {}, value: 7 },
    ] },
  );
  const res = await handleAnalyticsExport(req(), { adminClient: () => admin.client });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  const roll = body.results.find((r: { view: string }) => r.view === 'daily_rollups');
  assertEquals(roll.exported, 2);
  // Bookmark advanced to the last exported day, encoded YYYYMMDD.
  assertEquals(admin.cursorUpserts.length, 1);
  assertEquals(admin.cursorUpserts[0].name, 'daily_rollups');
  assertEquals(admin.cursorUpserts[0].last_id, 20260630);
  assertEquals(admin.uploads.some((p) => p.includes('daily_rollups-2026-06-29-2026-06-30')), true);
});
