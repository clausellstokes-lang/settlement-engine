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
 * ┌─ RE-PIN LANDED (backend-3 resolved — migration 131) ─────────────────────────┐
 * │ The 8 post-111 money/gallery SECURITY DEFINER functions that had regressed to │
 * │ a bare `set search_path = public` were re-pinned to `public, pg_temp` (pg_temp │
 * │ LAST) by 131_repin_definer_search_path_pg_temp.sql and REMOVED from the        │
 * │ baseline in lockstep (the shrink-only direction). 131 re-CREATEs each verbatim │
 * │ from its net-current body with only the header line changed — NOT an ALTER,    │
 * │ because this walker reads search_path from the `create or replace` HEADER and  │
 * │ is blind to ALTER (which is why the 103 service_* funcs, ALTERed by 111, stay  │
 * │ in the baseline). Appending pg_temp LAST is byte-neutral to behaviour.         │
 * │   114_ai_pricing_config.sql      — spend_credits, get_ai_pricing,             │
 * │                                    aggregate_ai_usage_stats                    │
 * │   115_pricing_resync_cron.sql    — run_pricing_resync_nightly                 │
 * │   120_gallery_import_premium_gate.sql — import_gallery_dossier                │
 * │   123_money_and_public_projection_hardening.sql — refund_credits             │
 * │   125_action_velocity_guards.sql — toggle_gallery_vote, add_gallery_comment   │
 * │ The 76 remaining (pre-094) entries are a larger, lower-stakes cleanup batch.   │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase/migrations');
const BASELINE_PATH = resolve(process.cwd(), 'tests/lint/.migration-searchpath-baseline.json');

// The 8 post-111 money/gallery functions that regressed to a bare search_path and were
// RE-PINNED to `public, pg_temp` by migration 131 (backend-3 resolved). They were
// removed from the baseline in lockstep; the guard below enforces that the re-pin stays
// landed — the walker must now SEE them pinned (absent from `current` violators) and
// they must stay OUT of the baseline.
const REPINNED_POST_111 = [
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

  it('keeps the 131 re-pin landed: the post-111 money/gallery functions are pinned, not baselined', () => {
    // migration 131 re-pinned all 8 to `public, pg_temp`. The walker must now see the
    // pin (each is ABSENT from the current violator set) AND they must be gone from the
    // baseline. A regression on either side — a future recreate dropping the pin, or a
    // stray re-baseline — fails here.
    const stillBare = REPINNED_POST_111.filter(name => name in current);
    expect(
      stillBare,
      `Re-pin regressed — these are bare SECURITY DEFINER again; migration 131 must pin them `
        + `\`set search_path = public, pg_temp\`:\n  ${stillBare.map(n => `${n} (${current[n]})`).join('\n  ')}`,
    ).toEqual([]);
    const stillBaselined = REPINNED_POST_111.filter(name => name in baseline);
    expect(
      stillBaselined,
      `Re-pinned by 131 but still in the baseline — remove them from `
        + `tests/lint/.migration-searchpath-baseline.json:\n  ${stillBaselined.join('\n  ')}`,
    ).toEqual([]);
  });

  it('parses a plausible number of migration functions (sanity — the walker is not silently empty)', () => {
    // Guards against a parser regression that would make the ratchet vacuously pass.
    expect(Object.keys(baseline).length).toBeGreaterThan(50);
  });
});
