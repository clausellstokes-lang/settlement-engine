// REVIEW-GRANTS-1 unit (2): boot a hosted-default replay of a chosen tree's migrations, then either
// migration 211 (mode 'mig') or the owner's files 1..4 (mode 'owner'). The tree root is argv/env ROOT211.
// Uses the seat's measure/boot.mjs only to load migrations (allowed by the prompt).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = process.env.ROOT211 || process.cwd();
const { boot } = await import(join(ROOT, 'docs/chair/2026-11-24/tenth/grants/measure/boot.mjs'));
export async function boot211({ upTo = 210, mode = 'mig', hostedDefaults = true, files = ['1', '2', '3', '4'] } = {}) {
  const prev = process.cwd(); process.chdir(ROOT);
  const r = await boot({ hostedDefaults, upTo });
  process.chdir(prev);
  if (mode === 'mig') {
    await r.db.exec(readFileSync(join(ROOT, 'supabase/migrations/211_close_visitor_reach.sql'), 'utf8'));
  } else if (mode === 'owner') {
    const dir = join(ROOT, 'docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS');
    for (const p of files) {
      const f = readdirSync(dir).find((x) => x.startsWith(p + '-'));
      await r.db.exec(readFileSync(join(dir, f), 'utf8'));
    }
  }
  return r;
}
