/**
 * analyticsEventsBundle.freshness.test.js — keep the edge ingest contract bundle
 * in sync with the source registry.
 *
 * supabase/functions/ingest-events imports the frozen event contract from
 * supabase/functions/_shared/analyticsEventsBundle.js — an esbuild bundle of
 * src/lib/analyticsEvents.js. The bundle is committed (deploy stays buildless);
 * this test fails when it drifts from source. Mirrors the aiGrounding bundle
 * freshness test.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const BUNDLE = join(ROOT, 'supabase', 'functions', '_shared', 'analyticsEventsBundle.js');
const META   = join(ROOT, 'supabase', 'functions', '_shared', 'analyticsEventsBundle.meta.json');

describe('analyticsEvents bundle exists + is fresh', () => {
  let bundleSrc; let meta;
  beforeAll(() => {
    if (existsSync(BUNDLE)) bundleSrc = readFileSync(BUNDLE, 'utf8');
    if (existsSync(META)) meta = JSON.parse(readFileSync(META, 'utf8'));
  });

  it('the bundle + sidecar meta are committed', () => {
    expect(existsSync(BUNDLE)).toBe(true);
    expect(existsSync(META)).toBe(true);
  });

  it('records the analyticsEvents entry', () => {
    expect(meta.entry).toBe('src/lib/analyticsEvents.js');
  });

  it('every recorded input still exists', () => {
    for (const p of meta.inputs) {
      expect(existsSync(join(ROOT, p)), `${p} missing`).toBe(true);
    }
  });

  it('the banner sourceHash matches the meta', () => {
    const m = bundleSrc.match(/Source hash:\s*([0-9a-f]+)/);
    expect(m).toBeTruthy();
    expect(m[1]).toBe(meta.sourceHash);
  });

  it('the source tree matches the recorded hash (regenerate via npm run build:edge-shared)', () => {
    const live = meta.inputs.map(p => `${p}:${readFileSync(join(ROOT, p), 'utf8')}`).join('\n');
    const liveHash = createHash('sha256').update(live).digest('hex').slice(0, 16);
    expect(liveHash, 'Bundle is stale. Run: npm run build:edge-shared').toBe(meta.sourceHash);
  });
});

describe('analyticsEvents bundle exports the contract surface', () => {
  let bundleSrc;
  beforeAll(() => { bundleSrc = readFileSync(BUNDLE, 'utf8'); });

  for (const name of ['EVENTS', 'EVENT_CLASS', 'EVENTS_REV', 'EVENT_NAME_RE', 'EDIT_KINDS', 'classForEvent', 'RESEARCH_EVENT_KEYS']) {
    it(`exports "${name}"`, () => {
      expect(bundleSrc).toMatch(new RegExp(`export\\s*\\{[^}]*\\b${name}\\b`));
    });
  }

  it('does NOT contain unresolved bare imports', () => {
    expect(bundleSrc).not.toMatch(/from\s+['"][a-z][^'"]*['"]/i);
  });
});

describe('analyticsEvents bundle agrees with source at runtime', () => {
  it('bundle EVENTS / EVENT_CLASS equal the source', async () => {
    const bundle = await import(BUNDLE);
    const source = await import('../../src/lib/analyticsEvents.js');
    expect(bundle.EVENTS).toEqual(source.EVENTS);
    expect(bundle.EVENT_CLASS).toEqual(source.EVENT_CLASS);
    expect(bundle.EDIT_KINDS).toEqual(source.EDIT_KINDS);
  });
});
