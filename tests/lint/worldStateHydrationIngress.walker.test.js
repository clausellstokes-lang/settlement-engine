/**
/**
 * The persisted-world trust boundary has two jobs that must remain coupled:
 * raw campaign rows cross the strict envoy DTO validator exactly once, while
 * trusted live worlds retain the small structural normalizer on first paint.
 * These source contracts pin every production ingress and the async fences
 * around the cold campaign-hydration import.
 *
 * THE INGRESS MOVED ONCE (6e7acc4d, "isolate campaign runtime and strict
 * hydration") and these pins did not, so they addressed a campaignSlice.js that
 * no longer holds the ingress and went red as HAND-KEYED-ADDRESS ROT: the code
 * was right and the pin was stale. Two consequences are designed in below.
 * First, the ingress module is named ONCE, in `INGRESS`. Second — and this is
 * the part that matters — the call-site census no longer greps for the literal
 * import name `campaignService`. The ingress reaches the raw service through an
 * INJECTED seam (`service = campaignService`), which a literal grep cannot see:
 * it matched nothing and the census silently emptied. It now DERIVES each
 * file's local bindings of the campaigns service and follows the injection
 * defaults, so the next move reds this walker with the new path named in the
 * diff instead of quietly measuring nothing.
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

/** The one module holding the cache/cloud campaign ingress. */
const INGRESS = 'src/store/campaignLoadSession.js';
/** The stale-session fence, spelled identically at both gates it guards. */
const STALE_FENCE = 'if (!isCurrentCampaignSession(get(), session)) return get().campaigns';

/**
 * Every local name a file gives the RAW campaigns service: the import binding,
 * the lazy-destructure form, and any parameter defaulted to one of those (the
 * injected-seam shape the ingress uses). Over-approximating is the safe
 * direction — a spurious name can only ADD a file to the census, which reds
 * loudly, whereas a missed alias empties it silently.
 */
function campaignServiceBindings(code) {
  const bindings = new Set();
  for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"][^'"]*campaigns\.js['"]/g)) {
    for (const clause of m[1].split(',')) {
      const [imported, local] = clause.trim().split(/\s+as\s+/);
      if (imported?.trim() === 'campaigns') bindings.add((local || imported).trim());
    }
  }
  for (const m of code.matchAll(
    /\{\s*campaigns\s*:\s*(\w+)\s*\}\s*=\s*await\s+import\(\s*['"][^'"]*campaigns\.js['"]/g,
  )) bindings.add(m[1]);
  for (let pass = 0; pass < 4; pass += 1) {
    const before = bindings.size;
    for (const m of code.matchAll(/(\w+)\s*=\s*(\w+)\s*[,)}\n]/g)) {
      if (bindings.has(m[2])) bindings.add(m[1]);
    }
    if (bindings.size === before) break;
  }
  return bindings;
}

/** True when the file calls list()/loadCached() on any such binding. */
function callsRawCampaignService(code) {
  return [...campaignServiceBindings(code)].some(name => (
    new RegExp(String.raw`\b${name}\.(?:list|loadCached)\s*\(`).test(code)
  ));
}

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
    const ingress = executable(read(INGRESS));

    // The cold admission chunk is reached through a lazy factory, never a static
    // import — that is what keeps the strict DTO family out of first paint.
    expect(ingress).toContain("import('./campaignHydration.js')");
    expect(ingress).not.toMatch(/from\s+['"][^'"]*campaignHydration\.js['"]/);
    expect(ingress).toMatch(/loadHydration\s*=\s*loadCampaignHydration/);
    expect(ingress).toMatch(
      /const\s*\{\s*hydratePersistedCampaignRows\s*\}\s*=\s*await\s+Promise\.resolve\(\)/,
    );

    // Cloud I/O is kicked off BEFORE the cold chunk is awaited, so the two start
    // together rather than serializing behind the validator's download.
    const listKickoff = ingress.indexOf('service.list()');
    const coldAwait = ingress.indexOf('.then(loadHydration)');
    const staleBeforeCache = ingress.indexOf(STALE_FENCE, coldAwait);
    const cacheRead = ingress.indexOf('service.loadCached(ownerId)', staleBeforeCache);

    expect(listKickoff).toBeGreaterThan(-1);
    expect(coldAwait).toBeGreaterThan(listKickoff);
    expect(staleBeforeCache).toBeGreaterThan(coldAwait);
    expect(cacheRead).toBeGreaterThan(staleBeforeCache);

    // THE INVARIANT THIS WALKER EXISTS FOR: neither raw row set reaches the store
    // except through the validating normalizer. `hydrateRows` is that seam, and it
    // must be the cold `hydratePersistedCampaignRows`, not a local passthrough.
    expect(ingress).toMatch(
      /const\s+hydrateRows\s*=\s*rows\s*=>[\s\S]{0,200}hydratePersistedCampaignRows\(\s*rows\s*,/,
    );
    expect(ingress).toContain('cached = hydrateRows(service.loadCached(ownerId))');
    expect(ingress).toContain('const migratedRemote = hydrateRows(remoteResult.remote)');

    // Both configured loads settle their own rejection immediately, and they stay
    // DIFFERENT outcomes: a degraded transport is not an unavailable validator.
    expect(ingress).toMatch(/error\s*=>\s*\(\{\s*remote:\s*null,\s*error\s*\}\)/);
    expect(ingress).toMatch(
      /error\s*=>\s*\(\{\s*tools:\s*null,\s*error:\s*campaignAdmissionError\(error\)\s*\}\)/,
    );

    const remoteHydration = ingress.indexOf('const migratedRemote = hydrateRows(remoteResult.remote)');
    const staleBeforeRemote = ingress.lastIndexOf(STALE_FENCE, remoteHydration);
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
    // Control the derivation before trusting the census: an alias walker that
    // resolved nothing would report an empty set as a clean bill of health.
    expect(campaignServiceBindings(
      "import { campaigns as campaignService } from '../lib/campaigns.js';",
    )).toContain('campaignService');
    expect(campaignServiceBindings(
      "import { campaigns as campaignService } from '../lib/campaigns.js';\nfunction f({ service = campaignService }) {}",
    )).toContain('service');
    expect(campaignServiceBindings(
      "const { campaigns: svc } = await import('../lib/campaigns.js');",
    )).toContain('svc');
    // A file that merely imports a NEIGHBOUR export binds nothing…
    expect([...campaignServiceBindings(
      "import { isCampaignActive } from '../lib/campaigns.js';",
    )]).toEqual([]);
    // …and a bound name that never calls the raw reads is not a call site.
    expect(callsRawCampaignService(
      "import { campaigns as campaignService } from '../lib/campaigns.js';\ncampaignService.reserveDelete?.(id);",
    )).toBe(false);
    expect(callsRawCampaignService(
      "import { campaigns as campaignService } from '../lib/campaigns.js';\nfunction f({ service = campaignService }) { return service.loadCached(o); }",
    )).toBe(true);

    const rawServiceCallers = sources.filter(rel => callsRawCampaignService(executable(read(rel))));
    const supabaseAdmissionSites = sources.filter((rel) => (
      /\badmitSupabaseCampaignRows\b/.test(executable(read(rel)))
    ));

    expect(
      rawServiceCallers.length,
      'the raw-service census resolved NO call sites — an emptied census is a '
      + 'disabled guard, not a clean tree; the alias derivation above has rotted',
    ).toBeGreaterThan(0);
    expect(rawServiceCallers).toEqual([INGRESS]);
    expect(supabaseAdmissionSites).toEqual([
      'src/lib/campaigns.js',
      'src/store/importReconciliationCommandTransaction.js',
    ]);
  });
});
