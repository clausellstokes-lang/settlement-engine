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
 * Rows contain no actor ids (the research views omit them) — the export is
 * structural + anonymous by construction.
 */

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const EXPORT_SECRET = Deno.env.get('EXPORT_SHARED_SECRET') || '';
const BUCKET = 'research-exports';

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json' } });
}

async function gzip(text: string): Promise<Blob> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Response(stream).blob();
}

// deno-lint-ignore no-explicit-any
async function exportView(admin: any, view: string, cursorName: string, monthDir: string) {
  const { data: cur } = await admin.from('export_cursors').select('last_id').eq('name', cursorName).maybeSingle();
  const lastId = cur?.last_id || 0;
  const { data: rows, error } = await admin.schema('research').from(view)
    .select('*').gt('id', lastId).order('id', { ascending: true }).limit(50000);
  if (error || !rows || rows.length === 0) return { view, exported: 0 };

  const jsonl = rows.map((r: Record<string, unknown>) => JSON.stringify(r)).join('\n') + '\n';
  const gz = await gzip(jsonl);
  const maxId = rows[rows.length - 1].id;
  const path = `${monthDir}/${view}-${lastId + 1}-${maxId}.jsonl.gz`;
  const up = await admin.storage.from(BUCKET).upload(path, gz, { contentType: 'application/gzip', upsert: true });
  if (up.error) return { view, exported: 0, error: up.error.message };
  await admin.from('export_cursors').upsert({ name: cursorName, last_id: maxId, updated_at: new Date().toISOString() }, { onConflict: 'name' });
  return { view, exported: rows.length, path };
}

serve(async (req: Request) => {
  const guard = botGuard(req, 'analytics-export');
  if (guard.reject) return guard.reject;
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'unconfigured' }, 503);

  // Fail-closed shared-secret gate (constant-ish compare; secret never logged).
  const provided = req.headers.get('x-export-secret') || '';
  if (!EXPORT_SECRET || provided !== EXPORT_SECRET) return json({ error: 'forbidden' }, 403);

  try {
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const now = new Date();
    const monthDir = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const results = [
      await exportView(admin, 'snapshots', 'research_snapshots', monthDir),
      await exportView(admin, 'edits', 'research_edits', monthDir),
    ];
    // Rollups live in public, not research; export them too for offline funnels.
    try {
      const { data: roll } = await admin.from('analytics_daily_rollups').select('*');
      if (roll && roll.length) {
        const gz = await gzip(roll.map((r: Record<string, unknown>) => JSON.stringify(r)).join('\n') + '\n');
        await admin.storage.from(BUCKET).upload(`${monthDir}/daily_rollups.jsonl.gz`, gz, { contentType: 'application/gzip', upsert: true });
        results.push({ view: 'daily_rollups', exported: roll.length });
      }
    } catch (e) {
      results.push({ view: 'daily_rollups', exported: 0, error: e instanceof Error ? e.message : 'failed' });
    }
    return json({ ok: true, month: monthDir, results }, 200);
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : 'export failed' }, 500);
  }
});
