// AGREE-FOLLOW-UP probe 1 — the site inventory, row by row, at one tree.
// usage: node siteScan.mjs <tree root> <out.json>
// It re-births siteCoherenceRatchet's frozen 462-town corpus (the same literals, culture
// rotated by row index) and, for every town, records its identity, its
// (terrain, siteKind, decisiveToken) key exactly as the test's scanCorpus computes it
// (leave-one-out against the REAL generateSite; the production kind from
// buildTownLayoutV2), the export lines the token matched, and the town's own resource
// roster, active chains and institutions, so a moved row can be traced to its cause.
// The aggregate of `key` over the 462 is checked against the test's own figures by the
// caller (siteDiff.mjs); this file asserts nothing.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(process.argv[2]);
const out = process.argv[3];
const imp = (p) => import(pathToFileURL(join(root, p)).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { buildTownLayoutV2 } = await imp('src/domain/townMap/townLayoutV2.js');
const { generateSite } = await imp('src/domain/townMap/siteGenesis.js');
const { canonExports } = await imp('src/domain/canonicalAccessors.js');
const { resolveTerrain } = await imp('src/domain/resolveTerrain.js');
const { CULTURE_PROFILE_KEYS } = await imp('src/data/cultureProfiles.js');
const { jsRegexTokens } = await imp('tests/helpers/sourceContract.js');

const SETT_TYPES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
const ROUTES = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass'];
const ARM_A_SEEDS = ['scw0-a1', 'scw0-a2', 'scw0-a3', 'scw0-a4', 'scw0-a5'];

function corpusConfigs() {
  const rows = []; let i = 0;
  const next = () => CULTURE_PROFILE_KEYS[i++ % CULTURE_PROFILE_KEYS.length];
  for (const settType of SETT_TYPES) for (const t of TERRAINS) for (const seed of ARM_A_SEEDS)
    rows.push({ cfg: { settType, terrainOverride: t, tradeRouteAccess: 'road', monsterThreat: 'civilized', culture: next() }, seed, terrain: t });
  for (const settType of SETT_TYPES) for (const t of TERRAINS) for (const r of ROUTES)
    rows.push({ cfg: { settType, terrainOverride: t, tradeRouteAccess: r, monsterThreat: 'civilized', culture: next() }, seed: 'scw0-b1', terrain: t });
  return rows;
}
// the test's exportPredicatesOf / decisiveCandidatesOf, verbatim in logic
function candidatesOf(src) {
  const found = [];
  for (const m of src.matchAll(/const\s+([A-Z][A-Z0-9_]*_RE)\s*=\s*\/([^/\n]+)\/i;/g)) {
    if (!new RegExp(`\\b${m[1]}\\.test\\(String\\(e\\)\\)`).test(src)) continue;
    found.push({ at: m.index, alternatives: jsRegexTokens(m[2]) });
  }
  for (const m of src.matchAll(/\/([^/\n]+)\/i\.test\((String\(e\)|exports\.join\(' '\))\)/g))
    found.push({ at: m.index, alternatives: jsRegexTokens(m[1]) });
  const seen = new Set(); const outc = [];
  for (const { alternatives } of found.sort((a, b) => a.at - b.at)) for (const a of alternatives) if (!seen.has(a)) { seen.add(a); outc.push(a); }
  return outc;
}
function bagFor(s) {
  const cfg = s.config && typeof s.config === 'object' ? s.config : {};
  const terrain = resolveTerrain(cfg);
  const tradeAccess = typeof cfg.tradeRouteAccess === 'string' ? cfg.tradeRouteAccess : null;
  const realmBiome = typeof cfg.biome === 'string' ? cfg.biome : (typeof cfg.terrainOverride === 'string' ? cfg.terrainOverride : null);
  return { terrain, tradeAccess, isCoast: tradeAccess === 'port' || tradeAccess === 'coastal' || terrain === 'coastal',
    isRiver: terrain === 'riverside' || tradeAccess === 'river', exports: canonExports(s), realmBiome,
    seed: String(s._seed ?? s.id ?? 'town-map-seedless') };
}
function tokenFor(bag, kind, cands) {
  const list = Array.isArray(bag.exports) ? bag.exports : [];
  if (generateSite({ ...bag, exports: [] }).kind === kind) return '(biome)';
  let first = null;
  for (const alt of cands) {
    const re = new RegExp(alt, 'i');
    const kept = list.filter((e) => !re.test(String(e)));
    if (kept.length === list.length) continue;
    if (first === null) first = alt;
    if (generateSite({ ...bag, exports: kept }).kind !== kind) return alt;
  }
  return first ?? '(unattributed)';
}
const resKey = (r) => (typeof r === 'string' ? r : (r && (r.key || r.id || r.name)) || JSON.stringify(r));
const cands = candidatesOf(readFileSync(join(root, 'src/domain/townMap/siteGenesis.js'), 'utf8'));
const rows = [];
let idx = 0;
for (const { cfg, seed, terrain } of corpusConfigs()) {
  const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
  const bag = bagFor(s);
  const prodKind = buildTownLayoutV2(s).meta.siteKind;
  const kind = generateSite(bag).kind;
  const token = tokenFor(bag, kind, cands);
  const tre = token.startsWith('(') ? null : new RegExp(token, 'i');
  const ec = s.economicState || {};
  rows.push({
    idx: idx++, id: `${cfg.settType}/${terrain}/${cfg.tradeRouteAccess}@${seed}/${cfg.culture}`,
    seed, settType: cfg.settType, terrain, route: cfg.tradeRouteAccess, culture: cfg.culture,
    key: `${terrain}|${prodKind}|${token}`, kind, prodKind, token,
    exports: bag.exports.map(String),
    tokenLines: tre ? bag.exports.map(String).filter((e) => tre.test(e)) : [],
    resources: (s.config?.nearbyResources || s.nearbyResources || s.resources || []).map(resKey),
    chains: (ec.activeChains || []).map((c) => ({ id: c.chainId || c.id, input: c.resourceInputKey, avail: c.resourceInputAvailable, status: c.status, exports: c.exports || c.outputs })),
    institutions: (s.institutions || []).map((x) => x.name || x.id || x.type),
  });
}
writeFileSync(out, JSON.stringify({ root, candidates: cands, rows }, null, 1));
console.log(`rows=${rows.length} candidates=${cands.join(',')}`);
