/** @vitest-environment node */
/**
 * READ-25 (CLOSE-7, chain two; RULING-R24 R24-B1(i) and R24-C1): THE RECORD SIDE of B1(i)'s table and of C1's answer (b).
 * Births each row of a plan ONCE on a tree (`generateSettlementPipeline(birthConfig(row.config), null, { seed, customContent: {} })`
 * after `loadGenerationLawPayloads()`, READ-24's `measure.census.jsx` pattern) and writes one JSON line a birth:
 *   B1(i): the land (`config.terrainType`, the route, the terrain override, the terrain the route maps to, the native nearby
 *          resources as the draw reads them: `nativeSemanticResourceKeys(config)`) and every house of the roster (name,
 *          category, source, live or not); the record's sha256.
 *   C1:    where the governing form is "Corrupt Council", "Corrupt City Council" or "Shadow Senate": every string leaf of the
 *          born record that carries the form (its path, indices folded to `[]`), and the same over the player's projection
 *          (`toPublicSafe(withPublicProse(record, composePublicProse(record)))`, READ-24's path).
 * Changes nothing; writes only $R25_OUT. Run by vitest only (publicProseCompose.js imports .jsx):
 *   R25_TREE=<tree> R25_PLAN=<plan.json> R25_OUT=<out.jsonl> npx vitest run --config <cfg>   (cfg: root the tree, include this)
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const T = process.env.R25_TREE || '/home/user/wt/lit';
const OUT = String(process.env.R25_OUT);
const PLAN = JSON.parse(readFileSync(String(process.env.R25_PLAN), 'utf8'));
const FORMS = ['Corrupt City Council', 'Corrupt Council', 'Shadow Senate'];

/** every string leaf carrying `needle`, its path with indices folded @param {unknown} v @param {string} needle */
const pathsWith = (v, needle) => {
  const out = new Set();
  const walk = (/** @type {unknown} */ x, /** @type {string} */ p) => {
    if (typeof x === 'string') { if (x.includes(needle)) out.add(p); return; }
    if (Array.isArray(x)) { x.forEach((y) => walk(y, `${p}[]`)); return; }
    if (x && typeof x === 'object') for (const [k, y] of Object.entries(x)) walk(y, p ? `${p}.${k}` : k);
  };
  walk(v, '');
  return [...out].sort();
};

test('READ-25 record measure', async () => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  const { liveInstitutions } = await import(/* @vite-ignore */ R + 'domain/institutions/institutionRoster.js');
  const { nativeSemanticResourceKeys } = await import(/* @vite-ignore */ R + 'domain/content/customContentSemanticAuthority.js');
  const { getTerrainType } = await import(/* @vite-ignore */ R + 'generators/terrainHelpers.js');
  const { composePublicProse } = await import(/* @vite-ignore */ R + 'components/new/publicProseCompose.js');
  const { withPublicProse } = await import(/* @vite-ignore */ R + 'domain/display/publicProse.js');
  const { toPublicSafe } = await import(/* @vite-ignore */ R + 'domain/display/publicSafe.js');
  await loadGenerationLawPayloads();
  const lines = [];
  for (const { seed, size, config } of PLAN) {
    const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const recordHash = createHash('sha256').update(JSON.stringify(s)).digest('hex');
    const c = s.config || {};
    const live = new Set(liveInstitutions(s));
    const governing = (s.powerStructure?.factions || []).find((f) => f?.isGoverning)?.faction ?? null;
    const form = FORMS.find((f) => governing === f) || null;
    let c1 = null;
    if (form) {
      let pub = null;
      try { pub = pathsWith(toPublicSafe(withPublicProse(s, composePublicProse(s))), form); } catch (e) { pub = [`ERROR ${String(e?.message || e).slice(0, 120)}`]; }
      c1 = { form, record: pathsWith(s, form), projection: pub };
    }
    lines.push(JSON.stringify({
      seed, size, recordHash, governing,
      terrainType: c.terrainType ?? null, route: c.tradeRouteAccess ?? null, terrainOverride: c.terrainOverride ?? null,
      terrainByRoute: getTerrainType(c.tradeRouteAccess, c.terrainOverride || null),
      nearby: nativeSemanticResourceKeys(c),
      roster: (s.institutions || []).map((i) => ({ name: i?.name, category: i?.category, source: i?.source ?? null, live: live.has(i) })),
      c1,
    }));
  }
  writeFileSync(OUT, `${lines.join('\n')}\n`);
}, 7200000);
