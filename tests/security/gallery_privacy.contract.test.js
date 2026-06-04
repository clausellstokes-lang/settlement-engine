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
const GALLERY_JS = join(ROOT, 'src', 'lib', 'gallery.js');

function functionBody(source, name) {
  const start = source.indexOf(`function ${name}`);
  if (start < 0) return '';
  const nextExport = source.indexOf('\nexport ', start + 1);
  return source.slice(start, nextExport < 0 ? source.length : nextExport);
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
