/** @vitest-environment node */
/**
 * READ-24 (CLOSE-7 unit (1)): THE RECORD SIDE of the measure. Births each of the close's census of 900 ONCE
 * (`dp-<size>-<i>`, i 0..149, `generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} })`
 * after `loadGenerationLawPayloads()`, close-3/births-sha.mjs's pattern) on the lit tree, and writes one JSON line a
 * birth of the facts READ-24's items read: the control (name, population), the land, the healing services and who gives
 * them, the healing and food capacities, the sick-house atom, the prosperity rung, the food ledger, the grain imports,
 * the governing form, and the PLAYER's projection of the government (the save's own path: `composePublicProse` →
 * `withPublicProse` → `toPublicSafe`, as the renderer stamps the record and `lib/gallery.js` projects a share).
 * Run under vitest only because `publicProseCompose.js` imports .jsx. Changes nothing; writes only $READ24_OUT.
 * Run (from the lit tree): npx vitest run --config <cfg> (cfg: root the lit tree, include this file).
 * READ24_PLAN=<plan.json> (optional): births a plan's rows `{ seed, size, config }` instead, each config through
 * `birthConfig` (the twin reading of FINDINGS.md's own dm24 places, whose births are the visitor's, not the census's).
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';

const T = process.env.READ24_TREE || '/home/user/wt/lit';
const OUT = String(process.env.READ24_OUT);
const N = Number(process.env.READ24_N || 150);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

test('READ-24 record measure', async () => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  const { composePublicProse } = await import(/* @vite-ignore */ R + 'components/new/publicProseCompose.js');
  const { withPublicProse } = await import(/* @vite-ignore */ R + 'domain/display/publicProse.js');
  const { toPublicSafe } = await import(/* @vite-ignore */ R + 'domain/display/publicSafe.js');
  const { deriveAllCapacities } = await import(/* @vite-ignore */ R + 'domain/capacityModel.js');
  const { healingLedger } = await import(/* @vite-ignore */ R + 'domain/healingLedger.js');
  const { defenceOf } = await import(/* @vite-ignore */ R + 'domain/facts/defence.js');
  const { liveInstitutions } = await import(/* @vite-ignore */ R + 'domain/institutions/institutionRoster.js');
  await loadGenerationLawPayloads();
  const lines = [];
  const PLAN = process.env.READ24_PLAN ? JSON.parse(readFileSync(process.env.READ24_PLAN, 'utf8')) : null;
  const births = PLAN || SIZES.flatMap((size) => Array.from({ length: N }, (_, i) => ({ seed: `dp-${size}-${i}`, size, config: { settType: size } })));
  for (const { seed, size, config } of births) {
    const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const live = liveInstitutions(s).map((x) => String(x?.name || ''));
    const liveSet = new Set(live);
    const healing = (s.availableServices?.healing || []).map((e) => ({
      name: typeof e === 'string' ? e : e?.name,
      institution: typeof e === 'string' ? '' : e?.institution || '',
      resident: typeof e !== 'string' && liveSet.has(String(e?.institution || '')) && !/^access to\b/i.test(String(e?.institution || '')),
    }));
    const led = healingLedger(s);
    const def = defenceOf(s);
    const cap = deriveAllCapacities(s);
    const govs = (s.powerStructure?.factions || []).filter((f) => f?.isGoverning).map((f) => f.faction);
    let pub = { error: null, gov: null, govFound: false, anyCorrupt: false, proseCorrupt: false, govString: null };
    try {
      const stamped = withPublicProse(s, composePublicProse(s));
      const p = toPublicSafe(stamped);
      const pj = JSON.stringify(p);
      const pg = (p.powerStructure?.factions || []).filter((f) => f?.isGoverning).map((f) => f.faction);
      pub = { error: null, gov: pg, govString: p.powerStructure?.government ?? null, govName: p.powerStructure?.governingName ?? null,
        anyCorrupt: /Corrupt Council/.test(pj), proseCorrupt: /Corrupt Council/.test(JSON.stringify(p.publicProse || {})),
        ownerProseCorrupt: /Corrupt Council/.test(JSON.stringify(stamped.publicProse || {})) };
    } catch (e) { pub.error = String(e?.message || e).slice(0, 200); }
    const houses = (re) => (s.institutions || []).filter((x) => re.test(String(x?.name || ''))).map((x) => ({ name: x.name, source: x.source || null, live: liveSet.has(String(x.name)), catalogId: x.catalogId || null }));
    lines.push(JSON.stringify({
      seed, size, name: s.name, population: s.population,
      terrainType: s.config?.terrainType ?? null, tradeRoute: s.config?.tradeRouteAccess ?? null,
      fish: houses(/fish market/i), sawmill: houses(/sawmill/i), hunter: houses(/hunter'?s lodge/i),
      healing, healerCount: led.healerCount, careCount: led.careServices.length,
      sickHouse: def.hospital === true || def.healer === true, hospital: def.hospital, healer: def.healer,
      healingBand: cap.bands?.healing ?? null, healingRatio: cap.ratios?.healing ?? null,
      foodBand: cap.bands?.food_production ?? null, foodRatio: cap.ratios?.food_production ?? null,
      prosperity: s.economicState?.prosperity ?? null,
      foodSecurity: (({ label, deficitPct, surplusPct, foodRatio } = {}) => ({ label, deficitPct, surplusPct, foodRatio }))(s.economicState?.foodSecurity || {}),
      grainChain: s.economicState?.foodSecurity?.chains?.['Grain & agriculture'] ?? null,
      imports: s.economicState?.primaryImports || [],
      grainImported: (s.economicState?.primaryImports || []).some((g) => typeof g === 'string' && /\bgrain\b/i.test(g)),
      farmland: live.some((n) => /\bfarmland\b|\bsubsistence farming\b/i.test(n)),
      govs, government: s.powerStructure?.government ?? null, governingName: s.powerStructure?.governingName ?? null,
      pub,
    }));
  }
  writeFileSync(OUT, lines.join('\n') + '\n');
}, 7200000);
