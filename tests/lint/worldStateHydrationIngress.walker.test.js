/**
 * The persisted-world trust boundary has two jobs that must remain coupled:
 * raw campaign rows cross the strict envoy DTO validator exactly once, while
 * trusted live worlds retain the small structural normalizer on first paint.
 * These source contracts pin every production ingress and the async fences
 * around the cold campaign-hydration import.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = rel => readFileSync(join(ROOT, rel), 'utf8');
const executable = source => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(abs);
  }
  return out;
}

const sources = walk(join(ROOT, 'src'))
  .map(abs => relative(ROOT, abs).replace(/\\/g, '/'))
  .sort();

describe('persisted world hydration — production ingress contracts', () => {
  test('the eager world materializer structurally clones while the cold leaf injects strict admission', () => {
    const hot = executable(read('src/domain/worldPulse/worldState.js'));
    const cold = executable(read('src/domain/worldPulse/worldStateHydration.js'));

    expect(hot).not.toContain("from './envoyErrandRecords.js'");
    expect(hot).toMatch(/key === 'envoyErrands'[\s\S]{0,120}normalizeEnvoyRows\s*\(/);
    expect(hot).toMatch(
      /function\s+cloneAdmittedEnvoyErrands[\s\S]*Array\.isArray\(value\)[\s\S]*deepClone\(value\)/,
    );
    expect(cold).toMatch(/from\s+['"]\.\/envoyErrandRecords\.js['"]/);
    expect(cold).toMatch(
      /ensureWorldStateWithEnvoyNormalizer\([\s\S]*normalizeEnvoyErrands/,
    );
  });

  test('cache and cloud start together, then hydrate behind stale-session and rejection fences', () => {
    const slice = executable(read('src/store/campaignSlice.js'));
    const list = slice.indexOf('campaignService.list()');
    const coldImport = slice.indexOf("import('./campaignHydration.js')");
    const staleBeforeCache = slice.indexOf(
      'if (!isCurrentCampaignSession(get(), session)) return get().campaigns',
      coldImport,
    );
    const cacheRead = slice.indexOf('campaignService.loadCached(ownerId)', coldImport);

    expect(list).toBeGreaterThan(-1);
    expect(coldImport).toBeGreaterThan(list);
    expect(staleBeforeCache).toBeGreaterThan(coldImport);
    expect(cacheRead).toBeGreaterThan(staleBeforeCache);
    expect(slice).not.toMatch(/from\s+['"][^'"]*campaignHydration\.js['"]/);
    expect(slice).toMatch(
      /error\s*=>\s*\(\{\s*remote:\s*null,\s*tools:\s*undefined,\s*error\s*\}\)/,
    );
    expect(slice).toContain('cached = hydrateRows(campaignService.loadCached(ownerId))');
    expect(slice).toContain('const migratedRemote = hydrateRows(remote)');

    const remoteHydration = slice.indexOf('const migratedRemote = hydrateRows(remote)');
    const staleBeforeRemote = slice.lastIndexOf(
      'if (!isCurrentCampaignSession(get(), session)) return get().campaigns',
      remoteHydration,
    );
    expect(staleBeforeRemote).toBeGreaterThan(cacheRead);
    expect(remoteHydration).toBeGreaterThan(staleBeforeRemote);
  });

  test('campaign hydration admits the world before structural migration', () => {
    const hydration = executable(read('src/store/campaignHydration.js'));
    const strictWorld = hydration.indexOf('hydratePersistedCampaignWorld(campaign)');
    const migration = hydration.indexOf('migrateCampaign(');

    expect(hydration).toMatch(/from\s+['"][^'"]*worldStateHydration\.js['"]/);
    expect(strictWorld).toBeGreaterThan(-1);
    expect(migration).toBeGreaterThan(-1);
    expect(strictWorld).toBeLessThan(migration);
  });

  test('the structured-import RPC projection crosses the same strict world boundary', () => {
    const transaction = executable(
      read('src/store/importReconciliationCommandTransaction.js'),
    );
    expect(transaction).toMatch(
      /campaignAdmission\.entries\.map\(hydratePersistedCampaignWorld\)/,
    );
  });

  test('all current raw campaign service/admission call sites are represented above', () => {
    const rawServiceCallers = sources.filter((rel) => (
      /campaignService\.(?:list|loadCached)\s*\(/.test(executable(read(rel)))
    ));
    const supabaseAdmissionSites = sources.filter((rel) => (
      /\badmitSupabaseCampaignRows\b/.test(executable(read(rel)))
    ));

    expect(rawServiceCallers).toEqual(['src/store/campaignSlice.js']);
    expect(supabaseAdmissionSites).toEqual([
      'src/lib/campaigns.js',
      'src/store/importReconciliationCommandTransaction.js',
    ]);
  });
});
