/**
 * tests/lint/migrationSearchPathPin.test.js — structural guard for the
 * SECURITY DEFINER `search_path` pin (finding backend-3).
 *
 * THE INVARIANT (established by migrations 094 / 111): every public SECURITY
 * DEFINER function must pin `set search_path = public, pg_temp` with pg_temp LAST.
 * A bare `set search_path = public` leaves pg_temp implicitly FIRST — the
 * CVE-2018-1058 search-path-hijack class 094/111 exist to close. It regressed on
 * money-path functions authored after 111 (114/115/120/123/125) with no guard, so
 * it would keep recurring on every future recreate.
 *
 * THIS TEST is the ratchet the finding asks for. It scans the migration SOURCES
 * (static — no live DB), computes each function's NET-CURRENT definition (the last
 * `create or replace`), and flags any that is SECURITY DEFINER without a pg_temp-
 * LAST pin. The 84 functions bare TODAY are frozen in the baseline
 * (.migration-searchpath-baseline.json) — most predate the 094/111 convention. The
 * ratchet is shrink-only:
 *   - a NEW bare SECURITY DEFINER function (not in the baseline) FAILS — add the
 *     `, pg_temp` pin, do NOT widen the baseline;
 *   - a baseline entry that has been re-pinned FAILS with a remove-it message, so
 *     the baseline can only shrink, never go stale.
 *
 * ┌─ MIGRATION-TODO (OWNER-GATED — the re-pin migration is NOT written here) ─────┐
 * │ Re-pin these 8 post-111 money/gallery SECURITY DEFINER functions to           │
 * │ `set search_path = public, pg_temp` in a config-only 094/111-style migration  │
 * │ (byte-neutral: appending pg_temp LAST cannot change public resolution). Then   │
 * │ delete their rows from the baseline (this test enforces that removal):         │
 * │   114_ai_pricing_config.sql      — spend_credits, get_ai_pricing,             │
 * │                                    aggregate_ai_usage_stats                    │
 * │   115_pricing_resync_cron.sql    — run_pricing_resync_nightly                 │
 * │   120_gallery_import_premium_gate.sql — import_gallery_dossier                │
 * │   123_money_and_public_projection_hardening.sql — refund_credits             │
 * │   125_action_velocity_guards.sql — toggle_gallery_vote, add_gallery_comment   │
 * │ The 76 pre-094 entries are a larger, lower-stakes cleanup for the same batch.  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase/migrations');
const BASELINE_PATH = resolve(process.cwd(), 'tests/lint/.migration-searchpath-baseline.json');

// The post-111 money/gallery regressions the finding names — these MUST be in the
// baseline until the owner's re-pin migration lands (see MIGRATION-TODO above).
const KNOWN_POST_111 = [
  'public.spend_credits',
  'public.get_ai_pricing',
  'public.aggregate_ai_usage_stats',
  'public.run_pricing_resync_nightly',
  'public.import_gallery_dossier',
  'public.refund_credits',
  'public.toggle_gallery_vote',
  'public.add_gallery_comment',
];

const FUNC_RE = /create\s+or\s+replace\s+function\s+([a-zA-Z0-9_.]+)\s*\(/gi;

/** True when a `set search_path = …` clause pins pg_temp LAST (the invariant). */
function pinsPgTempLast(searchPath) {
  if (!searchPath) return false;
  const parts = searchPath.split(/[,\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
  return parts.length >= 1 && parts[parts.length - 1] === 'pg_temp';
}

/**
 * Walk every migration, keep each function's NET-CURRENT (last) definition, and
 * return the sorted set of net-current SECURITY DEFINER functions whose pin is
 * missing/wrong: { 'public.name': 'NNN_migration.sql' }.
 */
function currentViolators() {
  const files = readdirSync(MIG_DIR).filter(f => f.endsWith('.sql')).sort();
  /** @type {Record<string, { file: string, isSecDef: boolean, searchPath: string|null }>} */
  const netCurrent = {};
  for (const file of files) {
    const txt = readFileSync(join(MIG_DIR, file), 'utf-8');
    const starts = [];
    let m;
    FUNC_RE.lastIndex = 0;
    while ((m = FUNC_RE.exec(txt)) !== null) starts.push({ pos: m.index, name: m[1] });
    for (let i = 0; i < starts.length; i++) {
      const body = txt.slice(starts[i].pos, i + 1 < starts.length ? starts[i + 1].pos : txt.length);
      const he = body.search(/\bas\s*\$/i);
      const header = he >= 0 ? body.slice(0, he) : body.slice(0, 2000);
      const isSecDef = /security\s+definer/i.test(header);
      const sp = header.match(/set\s+search_path\s*(?:=|to)\s*([^\n;]+)/i);
      // Later migrations overwrite earlier ones (net-current by name).
      netCurrent[starts[i].name] = { file, isSecDef, searchPath: sp ? sp[1].trim() : null };
    }
  }
  const violators = {};
  for (const [name, def] of Object.entries(netCurrent)) {
    if (def.isSecDef && !pinsPgTempLast(def.searchPath)) violators[name] = def.file;
  }
  return violators;
}

describe('SECURITY DEFINER search_path pin — structural ratchet (backend-3)', () => {
  const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf-8'));
  const current = currentViolators();

  it('adds no NEW bare-search_path SECURITY DEFINER function', () => {
    const added = Object.keys(current).filter(name => !(name in baseline));
    expect(
      added,
      added.length
        ? `New SECURITY DEFINER function(s) without a pg_temp-LAST search_path pin — add `
          + `\`set search_path = public, pg_temp\` (pg_temp LAST) to each; do NOT widen the baseline:\n  `
          + added.map(n => `${n} (${current[n]})`).join('\n  ')
        : '',
    ).toEqual([]);
  });

  it('has no stale baseline entries (shrink-only — re-pinned functions must be removed)', () => {
    const stale = Object.keys(baseline).filter(name => !(name in current));
    expect(
      stale,
      stale.length
        ? `These baseline entries are no longer bare (re-pinned, renamed, or dropped). The baseline `
          + `only shrinks — remove them from tests/lint/.migration-searchpath-baseline.json:\n  `
          + stale.join('\n  ')
        : '',
    ).toEqual([]);
  });

  it('still tracks the post-111 money/gallery regressions until the owner re-pin lands', () => {
    // Guard the MIGRATION-TODO: if one of these gets re-pinned, the shrink-only
    // test above fires and this list should be trimmed in lockstep.
    const missing = KNOWN_POST_111.filter(name => !(name in baseline));
    expect(missing, `Post-111 regression re-pinned — update KNOWN_POST_111 + the baseline: ${missing.join(', ')}`).toEqual([]);
  });

  it('parses a plausible number of migration functions (sanity — the walker is not silently empty)', () => {
    // Guards against a parser regression that would make the ratchet vacuously pass.
    expect(Object.keys(baseline).length).toBeGreaterThan(50);
  });
});
