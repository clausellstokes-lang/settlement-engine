/**
 * tests/security/gallery_privacy.contract.test.js - public gallery privacy.
 *
 * These assertions guard the contract without requiring a live Supabase
 * database in every CI lane. The database migration still needs to be
 * applied and exercised against Postgres before deploy.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const MIGRATION = join(ROOT, 'supabase', 'migrations', '020_gallery_public_privacy.sql');
const REPORTS_MIGRATION = join(ROOT, 'supabase', 'migrations', '021_gallery_reports.sql');
const REPORT_MODERATION_MIGRATION = join(ROOT, 'supabase', 'migrations', '022_gallery_report_moderation.sql');
const CHRONICLE_MIGRATION = join(ROOT, 'supabase', 'migrations', '032_gallery_public_chronicle.sql');
const GALLERY_JS = join(ROOT, 'src', 'lib', 'gallery.js');
const OUTPUT_CONTAINER_JSX = join(ROOT, 'src', 'components', 'OutputContainer.jsx');
const SHARE_TO_GALLERY_JSX = join(ROOT, 'src', 'components', 'ShareToGallery.jsx');

function functionBody(source, name) {
  const start = source.indexOf(`function ${name}`);
  if (start < 0) return '';
  const nextExport = source.indexOf('\nexport ', start + 1);
  return source.slice(start, nextExport < 0 ? source.length : nextExport);
}

// A SQL function definition: from `create or replace function <name>` to the
// closing `$$;` of its dollar-quoted body.
function sqlFunctionBody(source, name) {
  const start = source.indexOf(`create or replace function ${name}`);
  if (start < 0) return '';
  const end = source.indexOf('$$;', start);
  return source.slice(start, end < 0 ? source.length : end);
}

describe('gallery public privacy migration', () => {
  it('commits the privacy boundary migration', () => {
    expect(existsSync(MIGRATION)).toBe(true);
  });

  it('removes direct anonymous public settlement row reads', () => {
    const sql = readFileSync(MIGRATION, 'utf8');
    expect(sql).toMatch(/drop policy if exists "Public dossiers are world-readable"/);
    expect(sql).not.toMatch(/create policy "Public dossiers are world-readable"/);
  });

  it('exposes a sanitized public dossier RPC to anonymous readers', () => {
    const sql = readFileSync(MIGRATION, 'utf8');
    expect(sql).toMatch(/create or replace function public\._gallery_sanitize_public_json/);
    expect(sql).toMatch(/create or replace function public\.get_gallery_dossier/);
    expect(sql).toMatch(/public\._gallery_sanitize_public_json\(s\.data\) as data/);
    expect(sql).toMatch(/grant execute on function public\.get_gallery_dossier\(text\) to authenticated, anon/);
  });

  it('keeps vote counts scoped to public settlements', () => {
    const sql = readFileSync(MIGRATION, 'utf8');
    const voteState = functionBody(sql, 'public.get_gallery_vote_state');
    expect(voteState).toMatch(/from public\.settlements s/);
    expect(voteState).toMatch(/s\.is_public = true/);
  });
});

describe('gallery client privacy contract', () => {
  it('uses RPCs for public listing/detail reads', () => {
    const js = readFileSync(GALLERY_JS, 'utf8');
    expect(js).toMatch(/supabase\.rpc\('list_gallery_dossiers'/);
    expect(js).toMatch(/supabase\.rpc\('get_gallery_dossier'/);
    expect(js).not.toMatch(/fetchPublicGalleryFromTable/);
  });

  it('does not select settlement table data inside public detail fetches', () => {
    const js = readFileSync(GALLERY_JS, 'utf8');
    const detail = functionBody(js, 'fetchPublicDossier');
    expect(detail).not.toMatch(/\.from\('settlements'\)/);
    expect(detail).not.toMatch(/\.select\([^)]*data/);
  });
});

describe('gallery public chronicle contract (migration 032)', () => {
  const sql = () => readFileSync(CHRONICLE_MIGRATION, 'utf8');

  it('commits the chronicle column migration (separate column, anon-readable RPC)', () => {
    expect(existsSync(CHRONICLE_MIGRATION)).toBe(true);
    const s = sql();
    // The return type changes (new output column) → drop-before-recreate
    // (the migration 026 precedent).
    expect(s).toMatch(/drop function if exists public\.get_gallery_dossier\(text\)/);
    expect(s).toMatch(/chronicle jsonb/);
    expect(s).toMatch(/public\._gallery_chronicle_json\(s\.campaign_state -> 'eventLog'\) as chronicle/);
    expect(s).toMatch(/grant execute on function public\.get_gallery_dossier\(text\) to authenticated, anon/);
  });

  it('projects entries through an explicit allowlist — exactly these keys, nothing else', () => {
    const body = sqlFunctionBody(sql(), 'public._gallery_chronicle_entry');
    expect(body).toBeTruthy();
    // Every quoted identifier built into the projected entry. The set must be
    // EXACTLY the allowlist: id / appliedAt / timestamp / narrativeSummary /
    // cause / partyCaused (+ the nested event object and its type).
    const keys = new Set([...body.matchAll(/'([A-Za-z]+)'\s*,/g)].map(m => m[1]));
    expect([...keys].sort()).toEqual(
      ['appliedAt', 'cause', 'event', 'id', 'narrativeSummary', 'partyCaused', 'timestamp', 'type']
    );
  });

  it('never references the private EventLogEntry fields in the chronicle projection', () => {
    // Raw log entries carry full system-state snapshots, per-system diffs,
    // faction reactions with adventure seeds, type-specific event extras, the
    // DM's free-text context, and rollback snapshots. None may appear in the
    // projection helpers. (Scoped to the helper bodies: the RPC's other
    // columns legitimately include e.g. gallery_description.)
    const bodies = (
      sqlFunctionBody(sql(), 'public._gallery_chronicle_entry')
      + sqlFunctionBody(sql(), 'public._gallery_chronicle_json')
    ).toLowerCase();
    expect(bodies).toBeTruthy();
    for (const forbidden of [
      'beforestate', 'afterstate', 'delta', 'factionresponses', 'hookseed',
      'undo', 'payload', 'description', 'inworlddate',
    ]) {
      expect(bodies).not.toContain(forbidden);
    }
  });

  it('caps the public chronicle at the newest 50 entries', () => {
    const body = sqlFunctionBody(sql(), 'public._gallery_chronicle_json');
    expect(body).toMatch(/jsonb_array_length\(entries\) - 50/);
  });

  it('leaves the existing data sanitizers untouched (denylists only grow)', () => {
    const s = sql();
    expect(s).not.toMatch(/create or replace function public\._gallery_sanitize_public_json/);
    expect(s).not.toMatch(/create or replace function public\._gallery_dm_full_json/);
    // The data column still routes through them, unchanged from migration 030.
    expect(s).toMatch(/public\._gallery_dm_full_json\(base\.j\)/);
    expect(s).toMatch(/public\._gallery_sanitize_public_json\(base\.j\)/);
  });
});

describe('gallery client chronicle contract', () => {
  it('maps the chronicle column through the client allowlist, never toPublicSafe', () => {
    const js = readFileSync(GALLERY_JS, 'utf8');
    const dossier = functionBody(js, 'sanitizeDossier');
    expect(dossier).toMatch(/chronicle:\s*sanitizeChronicle\(row\.chronicle\)/);
    expect(js).not.toMatch(/toPublicSafe\(row\.chronicle/);
    // The mapper re-applies the server allowlist (defense in depth) — these
    // key lists mirror migration 032's _gallery_chronicle_entry exactly.
    expect(js).toMatch(/CHRONICLE_ENTRY_KEYS = Object\.freeze\(\['id', 'appliedAt', 'timestamp', 'narrativeSummary', 'cause', 'partyCaused'\]\)/);
    expect(js).toMatch(/CHRONICLE_EVENT_KEYS = Object\.freeze\(\['id', 'type', 'cause', 'partyCaused'\]\)/);
  });

  it('keeps DM/AI notes player-hidden while the chronicle ships publicly', () => {
    const src = readFileSync(OUTPUT_CONTAINER_JSX, 'utf8');
    // The playerView hide-list keeps the owner-private tabs and no longer
    // blocks the chronicle…
    expect(src).toMatch(/playerView && \['summary', 'dm_notes', 'ai_notes'\]\.includes\(t\.id\)/);
    // …and the dm_notes hard-block for public dossiers (readOnly, no owning
    // saveId) stays in place.
    expect(src).toMatch(/t\.id === 'dm_notes' && readOnly && !saveId/);
  });

  it('discloses the public chronicle in the share flow', () => {
    const share = readFileSync(SHARE_TO_GALLERY_JSX, 'utf8');
    expect(share).toMatch(/event chronicle \(event titles and summaries\) is publicly visible/);
  });
});

describe('gallery report moderation contract', () => {
  it('commits the report moderation migration', () => {
    expect(existsSync(REPORTS_MIGRATION)).toBe(true);
  });

  it('requires auth and a public settlement for report inserts', () => {
    const sql = readFileSync(REPORTS_MIGRATION, 'utf8');
    expect(sql).toMatch(/create table if not exists public\.gallery_reports/);
    expect(sql).toMatch(/auth\.uid\(\) = user_id/);
    expect(sql).toMatch(/where s\.id = settlement_id and s\.is_public = true/);
    expect(sql).toMatch(/auth\.uid\(\) is null[\s\S]{0,140}Sign in to report a dossier/);
  });

  it('exposes only the authenticated report RPC', () => {
    const sql = readFileSync(REPORTS_MIGRATION, 'utf8');
    expect(sql).toMatch(/create or replace function public\.report_gallery_dossier/);
    expect(sql).toMatch(/grant execute on function public\.report_gallery_dossier\(uuid, text, text\) to authenticated/);
    expect(sql).not.toMatch(/grant execute on function public\.report_gallery_dossier\(uuid, text, text\) to authenticated, anon/);
  });

  it('commits elevated-only moderation review RPCs', () => {
    expect(existsSync(REPORT_MODERATION_MIGRATION)).toBe(true);
    const sql = readFileSync(REPORT_MODERATION_MIGRATION, 'utf8');
    expect(sql).toMatch(/create or replace function public\.list_gallery_reports/);
    expect(sql).toMatch(/create or replace function public\.resolve_gallery_report/);
    expect(sql).toMatch(/public\.current_user_is_privileged\(\)/);
    expect(sql).toMatch(/Only admins can resolve gallery reports/);
    expect(sql).toMatch(/grant execute on function public\.list_gallery_reports\(text, integer\) to authenticated/);
    expect(sql).toMatch(/grant execute on function public\.resolve_gallery_report\(uuid, text, text\) to authenticated/);
    expect(sql).not.toMatch(/grant execute on function public\.list_gallery_reports\(text, integer\) to authenticated, anon/);
    expect(sql).not.toMatch(/grant execute on function public\.resolve_gallery_report\(uuid, text, text\) to authenticated, anon/);
  });
});
