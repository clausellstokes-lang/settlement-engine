/**
 * engineGenerateBodyCap.test.js — THE `generate` BODY CAP IS DERIVED FROM THE CATALOGS
 * (remote-path R4, D4 of the chair's flagged-path walk, 2026-11-10).
 *
 * engine-generate held a `generate` body to 32 KB. The generate action sends EVERY stored
 * toggle of every bag (`_institutionToggles`, `_categoryToggles`, `_goodsToggles`,
 * `_servicesToggles`), and the wizard's own bulk presses fill them: the chair measured the
 * grid's "exclude all" on six tiers at 454 keys and a 39,940-byte body. Such an account got a
 * 413 on every generation until it cleared its toggles; local generation never had a limit.
 *
 * THE DERIVATION. The REAL store, as a premium account (whose forge takes its stored config and
 * bags), is driven through the wizard's own bulk actions to the largest bags they can build:
 *   - InstitutionalGrid: `bulkSetInstitutions` by the grid's own getter rule on every grid tier
 *     (each of the six tiers chosen by hand presses over the FULL catalog, keyed under that
 *     tier; the 'all' browse over the merged catalog), plus `toggleCategory` off on every
 *     category;
 *   - ServicesTogglePanel: `bulkSetServices` with its own key list over the widest catalog it
 *     can show;
 *   - TradeDynamicsPanel: `bulkSetGoods` with every good of every tier;
 * each press taking the LONGER of its 'force' / 'exclude' value spelling; the longest custom
 * name the field admits (25) and the longest seed the function admits (256), both of a
 * character JSON writes as a six-byte escape; and a pinned engineVersion. The body is the one
 * the remote transport itself posts (`runRemoteGeneration`, a capturing fetch), measured in
 * UTF-8 bytes.
 *
 * THE CAP must hold that bound with MARGIN (1.1×), and stay under the chair's ceiling (256 KB,
 * above which the number goes back to the chair). Measured at this writing: 233,119 bytes
 * (1,622 institution keys, 77 category keys, 874 service keys, 61 goods keys), so the 256 KB cap
 * holds it with 1.12×; a margin of 1.5× would need 342 KB, past the ceiling. The cap is read from the function's source
 * by its own declaration. If the catalogs ever outgrow the cap, this reds.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const captured = [];
vi.mock('../../src/lib/generationClient.js', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    runGeneration: async (request) => {
      captured.push(structuredClone(request));
      throw Object.assign(new Error('measured, not generated'), { code: 'measure_only' });
    },
  };
});

const { useStore } = await import('../../src/store/index.js');
const { getInstitutionalCatalog, getFullCatalogWithTierMeta } = await import('../../src/data/institutionLookups.js');
const { INSTITUTION_SERVICES, GOODS_MODIFIERS_BY_TIER } = await import('../../src/data/tradeGoodsData.js');
const { TIER_ORDER } = await import('../../src/generators/helpers.js');
const { runRemoteGeneration } = await import('../../src/lib/engineRemote.js');
const { resolveServiceCatalogKey } = await import('../../src/generators/services/institutionServices.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FUNCTION_SRC = readFileSync(join(ROOT, 'supabase/functions/engine-generate/index.ts'), 'utf8');

/** The chair's ceiling: a derived bound above it goes back to the chair with the number. */
const CEILING_BYTES = 256 * 1024;
/** The stated margin the cap must hold over the derived bound. */
const MARGIN = 1.1;
/** The longest custom name the configuration field admits (ConfigurationPanel.jsx, maxLength). */
const NAME_MAX = 25;
/** The function's own seed ceiling (index.ts, MAX_SEED_CHARS). */
const SEED_MAX = Number(FUNCTION_SRC.match(/const MAX_SEED_CHARS = (\d+);/)?.[1]);
/** A character JSON.stringify writes as a six-byte escape (the worst per character). */
const WORST_CHAR = '\u0001';

/** The `generate` cap, read from its declaration in the function. */
function generateCapBytes() {
  const m = FUNCTION_SRC.match(/const MAX_BODY_BYTES = ([0-9* ]+);/);
  expect(m, 'MAX_BODY_BYTES is declared in engine-generate/index.ts').toBeTruthy();
  return m[1].split('*').map((x) => Number(x.trim())).reduce((a, b) => a * b, 1);
}

/** Drive the real store's bulk actions to their largest bags; answer the posted body's bytes. */
async function largestWizardBody() {
  const state = () => useStore.getState();
  useStore.setState({ auth: { ...state().auth, user: { id: 'cap-measure' }, tier: 'premium' } });
  expect(state().canCustomizePreGeneration(), 'the forge takes the stored bags').toBe(true);
  state().resetAllToggles();
  const gridTiers = [...TIER_ORDER, 'all'];
  for (const tier of gridTiers) {
    // InstitutionalGrid's own rule: a manual tier presses over the FULL catalog (keyed under
    // that tier), the 'all' browse over the merged tier catalog. 'force' then 'exclude': the
    // later write stands, and 'exclude' is the longer spelling.
    const getter = tier === 'all' ? getInstitutionalCatalog : getFullCatalogWithTierMeta;
    for (const mode of ['force', 'exclude']) state().bulkSetInstitutions(getter, tier, mode);
    for (const category of Object.keys(getter(tier))) {
      if (state().isCategoryEnabled(tier, category)) state().toggleCategory(tier, category);
    }
  }
  // ServicesTogglePanel's key list over the widest catalog it can show (a manual tier's full
  // catalog, unfiltered, with the 'all' browse's names beside it), by its own spelling.
  const svcKeys = new Set();
  for (const cat of [getFullCatalogWithTierMeta(), getInstitutionalCatalog('all')]) {
    for (const insts of Object.values(cat)) {
      for (const name of Object.keys(insts)) {
        const svcKey = resolveServiceCatalogKey(name);
        if (svcKey && INSTITUTION_SERVICES[svcKey] && Object.keys(INSTITUTION_SERVICES[svcKey]).length) svcKeys.add(svcKey);
      }
    }
  }
  const serviceKeys = [...svcKeys]
    .flatMap((svcKey) => Object.keys(INSTITUTION_SERVICES[svcKey]).map((name) => `${svcKey}_service_${name}`));
  const tierData = Object.fromEntries(TIER_ORDER.map((t) => [t, GOODS_MODIFIERS_BY_TIER[t] || {}]));
  // The longer value spelling of each bag ('exclude' writes `false,false,true`, one byte longer
  // per entry than 'force''s `true,true,false`), measured rather than assumed:
  const longer = (a, b) => (JSON.stringify(a).length >= JSON.stringify(b).length ? a : b);
  const pick = (bag, write) => {
    write('force'); const forced = structuredClone(state()[bag]);
    write('exclude'); const excluded = structuredClone(state()[bag]);
    return longer(forced, excluded);
  };
  const services = pick('servicesToggles', (m) => state().bulkSetServices(m, serviceKeys));
  state().setServiceToggles(services);
  const goods = pick('goodsToggles', (m) => state().bulkSetGoods(m, tierData));
  state().setGoodsToggles(goods);
  state().updateConfig({ settType: 'metropolis', customName: WORST_CHAR.repeat(NAME_MAX) });

  const before = captured.length;
  const seed = WORST_CHAR.repeat(SEED_MAX);
  await state().generateSettlement(seed).catch(() => {});
  expect(captured.length, 'the store reached the generation client').toBe(before + 1);
  const request = captured.at(-1);
  const counts = {
    institutions: Object.keys(request.payload.fullConfig._institutionToggles || {}).length,
    categories: Object.keys(request.payload.fullConfig._categoryToggles || {}).length,
    services: Object.keys(request.payload.fullConfig._servicesToggles || {}).length,
    goods: Object.keys(request.payload.fullConfig._goodsToggles || {}).length,
  };
  // The body the transport itself posts, with a pinned version riding it.
  let body = null;
  await runRemoteGeneration(request, {
    url: 'https://measure/engine-generate',
    getAccessToken: async () => null,
    engineVersion: 'f'.repeat(16),
    fetchImpl: async (_url, init) => { body = init.body; throw new Error('measured'); },
  }).catch(() => {});
  expect(body, 'the transport posted a body').toBeTypeOf('string');
  return { bytes: new TextEncoder().encode(body).length, counts };
}

describe('the engine-generate `generate` body cap holds the largest body the wizard can build', () => {
  it('derived bound × margin ≤ cap ≤ the chair\'s ceiling', async () => {
    const { bytes, counts } = await largestWizardBody();
    // The derivation is not vacuous: every bag is filled.
    expect(counts.institutions).toBeGreaterThan(400);
    expect(counts.categories).toBeGreaterThan(0);
    expect(counts.services).toBeGreaterThan(0);
    expect(counts.goods).toBeGreaterThan(0);
    process.stderr.write(`\n[engine-generate body cap] derived bound ${bytes} B `
      + `(${JSON.stringify(counts)}); × ${MARGIN} = ${Math.ceil(bytes * MARGIN)} B; cap ${generateCapBytes()} B\n`);
    expect(bytes, 'the derived bound is past the chair\'s ceiling: bring the number').toBeLessThanOrEqual(CEILING_BYTES);
    expect(generateCapBytes(), 'the cap is past the chair\'s ceiling').toBeLessThanOrEqual(CEILING_BYTES);
    expect(generateCapBytes(), `the cap must hold the derived bound (${bytes} B) with ${MARGIN}× margin`)
      .toBeGreaterThanOrEqual(Math.ceil(bytes * MARGIN));
  }, 120_000);

  it('the record ops keep their own 1 MiB cap', () => {
    expect(FUNCTION_SRC).toMatch(/const MAX_DERIVE_BODY_BYTES = 1024 \* 1024;/);
  });
});
