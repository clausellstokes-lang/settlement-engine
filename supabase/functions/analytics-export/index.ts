import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { botGuard } from '../_shared/requestMeta.ts';

/**
 * analytics-export — monthly research export (docs §4d/§5). Streams
 * research.snapshots / research.edits / analytics_daily_rollups as gzipped JSONL
 * to the private `research-exports` bucket, cursored by export_cursors so each
 * run is incremental. Invoked by cron via pg_net with the EXPORT_SHARED_SECRET
 * header (NOT public). Fail-closed on a missing/incorrect secret.
 *
 * A query/upload error on ANY leg is reported per-leg AND flips the overall
 * response to ok:false / 500 — a persistently failing export must look broken
 * (alertable), never like a quiet month with no new rows.
 *
 * Rows contain no actor ids (the research views omit them) — the export is
 * structural + anonymous by construction.
 */

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const EXPORT_SECRET = Deno.env.get('EXPORT_SHARED_SECRET') || '';
const BUCKET = 'research-exports';

type LegResult = { view: string; exported: number; path?: string; error?: string };

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json' } });
}

async function gzip(text: string): Promise<Blob> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Response(stream).blob();
}

// deno-lint-ignore no-explicit-any
async function exportView(admin: any, view: string, cursorName: string, monthDir: string): Promise<LegResult> {
  const { data: cur, error: curError } = await admin.from('export_cursors').select('last_id').eq('name', cursorName).maybeSingle();
  if (curError) return { view, exported: 0, error: curError.message };
  const lastId = cur?.last_id || 0;
  const { data: rows, error } = await admin.schema('research').from(view)
    .select('*').gt('id', lastId).order('id', { ascending: true }).limit(50000);
  // A failed query is NOT "no new rows": surface it so the run is alertable
  // (a broken view / revoked grant previously reported ok:true forever).
  if (error) return { view, exported: 0, error: error.message };
  if (!rows || rows.length === 0) return { view, exported: 0 };

  const jsonl = rows.map((r: Record<string, unknown>) => JSON.stringify(r)).join('\n') + '\n';
  const gz = await gzip(jsonl);
  const maxId = rows[rows.length - 1].id;
  const path = `${monthDir}/${view}-${lastId + 1}-${maxId}.jsonl.gz`;
  const up = await admin.storage.from(BUCKET).upload(path, gz, { contentType: 'application/gzip', upsert: true });
  if (up.error) return { view, exported: 0, error: up.error.message };
  await admin.from('export_cursors').upsert({ name: cursorName, last_id: maxId, updated_at: new Date().toISOString() }, { onConflict: 'name' });
  return { view, exported: rows.length, path };
}

// Rollups live in public, not research, and key on (day, metric, dims) with no
// bigint id — so the incremental cursor is the DAY encoded as YYYYMMDD in
// export_cursors.last_id. Only COMPLETED days (strictly before today, UTC) are
// exported, so a still-accumulating day is never bookmarked past. Previously
// this leg re-exported the ENTIRE table every run, unbounded.
const dayToCursor = (isoDay: string) => Number(isoDay.slice(0, 10).replace(/-/g, ''));
const cursorToDay = (n: number) => {
  const s = String(n).padStart(8, '0');
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
};

// deno-lint-ignore no-explicit-any
async function exportRollups(admin: any, monthDir: string, todayIso: string): Promise<LegResult> {
  const view = 'daily_rollups';
  const { data: cur, error: curError } = await admin.from('export_cursors').select('last_id').eq('name', view).maybeSingle();
  if (curError) return { view, exported: 0, error: curError.message };
  const lastDayCursor = Number(cur?.last_id || 0);

  let query = admin.from('analytics_daily_rollups').select('*')
    .lt('day', todayIso).order('day', { ascending: true }).limit(50000);
  if (lastDayCursor > 0) query = query.gt('day', cursorToDay(lastDayCursor));
  const { data: rows, error } = await query;
  if (error) return { view, exported: 0, error: error.message };
  if (!rows || rows.length === 0) return { view, exported: 0 };

  const jsonl = rows.map((r: Record<string, unknown>) => JSON.stringify(r)).join('\n') + '\n';
  const gz = await gzip(jsonl);
  const firstDay = String(rows[0].day).slice(0, 10);
  const lastDay = String(rows[rows.length - 1].day).slice(0, 10);
  const path = `${monthDir}/${view}-${firstDay}-${lastDay}.jsonl.gz`;
  const up = await admin.storage.from(BUCKET).upload(path, gz, { contentType: 'application/gzip', upsert: true });
  if (up.error) return { view, exported: 0, error: up.error.message };
  // Advance the bookmark only after a successful upload. NOTE: if the 50000-row
  // page ends mid-day the tail of that day would be skipped next run — with a
  // handful of metrics per day the page covers years of rollups, so a page
  // boundary inside one day is not a practical concern.
  await admin.from('export_cursors').upsert({ name: view, last_id: dayToCursor(lastDay), updated_at: new Date().toISOString() }, { onConflict: 'name' });
  return { view, exported: rows.length, path };
}

export async function handleAnalyticsExport(
  req: Request,
  // deno-lint-ignore no-explicit-any
  deps: { adminClient?: () => any } = {},
): Promise<Response> {
  const guard = botGuard(req, 'analytics-export');
  if (guard.reject) return guard.reject;
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'unconfigured' }, 503);

  // Fail-closed shared-secret gate (constant-ish compare; secret never logged).
  const provided = req.headers.get('x-export-secret') || '';
  if (!EXPORT_SECRET || provided !== EXPORT_SECRET) return json({ error: 'forbidden' }, 403);

  try {
    const admin = deps.adminClient ? deps.adminClient() : createClient(SUPABASE_URL, SERVICE_KEY);
    const now = new Date();
    const monthDir = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const todayIso = now.toISOString().slice(0, 10);
    const results: LegResult[] = [
      await exportView(admin, 'snapshots', 'research_snapshots', monthDir),
      await exportView(admin, 'edits', 'research_edits', monthDir),
      // Rollups live in public, not research; export them too for offline funnels.
      await exportRollups(admin, monthDir, todayIso).catch((e) => ({
        view: 'daily_rollups', exported: 0, error: e instanceof Error ? e.message : 'failed',
      })),
    ];
    const failed = results.filter((r) => r.error);
    // Any failed leg makes the RUN a failure (non-2xx) so cron/monitoring sees
    // it — cursors for failed legs did not move, so the next run retries them.
    return json({ ok: failed.length === 0, month: monthDir, results }, failed.length ? 500 : 200);
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : 'export failed' }, 500);
  }
}

serve((req) => handleAnalyticsExport(req));
