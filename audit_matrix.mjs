// audit_matrix.mjs — cross-mapping matrix checks (read-only analysis)
import { institutionalCatalog } from './src/data/institutionalCatalog.js';
import { INSTITUTION_SERVICES } from './src/data/institutionServices.js';
import { LOCALE_SERVICE_OVERRIDES } from './src/data/servicesData.js';
import { SUPPLY_CHAIN_NEEDS, RESOURCE_TO_CHAINS } from './src/data/supplyChainData.js';
import { RESOURCE_DATA, RESOURCE_CHAINS } from './src/data/resourceData.js';
import { GOODS_MODIFIERS_BY_TIER } from './src/data/tradeGoodsData.js';

const out = [];
const log = (...a) => out.push(a.join(' '));

// ── Collect every catalog institution name (with tier/category) ──
const catalogInsts = [];
for (const [tier, cats] of Object.entries(institutionalCatalog)) {
  for (const [cat, insts] of Object.entries(cats)) {
    for (const name of Object.keys(insts)) {
      catalogInsts.push({ tier, cat, name, meta: insts[name] });
    }
  }
}
const catalogNames = [...new Set(catalogInsts.map(i => i.name))];
log(`TOTAL catalog institutions (unique names): ${catalogNames.length}`);

// ── A. institutions -> services join (replicating getServicesForInstitution) ──
// order: 1) LOCALE override, 2) exact key (ci), 3) fuzzy word overlap
const svcKeys = Object.keys(INSTITUTION_SERVICES);
function fuzzyMatch(r) {
  // replicate the fuzzy loop: word overlap scoring
  let g = 0, h = null;
  for (const C of svcKeys) {
    const T = C.toLowerCase().split(/[\s'(),/-]+/).filter(v => v.length > 2);
    let M = 0;
    const rl = r.toLowerCase();
    const rwords = rl.split(/[\s'(),/-]+/).filter(v => v.length > 2);
    for (const t of T) if (rwords.includes(t)) M += 2; else if (rl.includes(t)) M += 1;
    const A = M / (T.length * 2);
    const S = h ? h.toLowerCase().split(/[\s'(),/-]+/).filter(v => v.length > 2).length : 1;
    const y = g / (S * 2);
    if (M > g || (M === g && M > 0 && A > y)) { g = M; h = C; }
  }
  return g > 0 ? h : null;
}
const unmatchedInst = [];
const matchVia = { override: 0, exact: 0, fuzzy: 0, none: 0 };
const reachedKeys = new Set();
for (const name of catalogNames) {
  const l = LOCALE_SERVICE_OVERRIDES[name.toLowerCase()];
  if (l && INSTITUTION_SERVICES[l]) { matchVia.override++; reachedKeys.add(l); continue; }
  const exact = svcKeys.find(k => k.toLowerCase() === name.toLowerCase());
  if (exact) { matchVia.exact++; reachedKeys.add(exact); continue; }
  const fz = fuzzyMatch(name);
  if (fz) { matchVia.fuzzy++; reachedKeys.add(fz); }
  else { matchVia.none++; unmatchedInst.push(name); }
}
log(`\nA1. Institution->service match counts: ${JSON.stringify(matchVia)}`);
log(`A2. Catalog institutions with NO service mapping at all:`);
unmatchedInst.forEach(n => log(`   - ${n}`));

// Shadowed keys: INSTITUTION_SERVICES key K exists, but LOCALE override for k.toLowerCase()
// redirects elsewhere, so exact-match never happens.
log(`\nA3. INSTITUTION_SERVICES entries SHADOWED by a LOCALE override redirect:`);
for (const k of svcKeys) {
  const ov = LOCALE_SERVICE_OVERRIDES[k.toLowerCase()];
  if (ov && ov !== k) log(`   - "${k}" shadowed -> override sends to "${ov}"`);
}

// Service keys never reached by any catalog institution (via the 3 paths)
log(`\nA4. INSTITUTION_SERVICES keys NOT reached by any catalog institution (exact/override only; fuzzy may still reach):`);
const reachableExactOrOverride = new Set();
for (const name of catalogNames) {
  const l = LOCALE_SERVICE_OVERRIDES[name.toLowerCase()];
  if (l && INSTITUTION_SERVICES[l]) reachableExactOrOverride.add(l);
  else {
    const exact = svcKeys.find(k => k.toLowerCase() === name.toLowerCase());
    if (exact) reachableExactOrOverride.add(exact);
  }
}
// also overrides values from non-catalog variants count as reachable in principle
for (const k of svcKeys) {
  if (!reachableExactOrOverride.has(k)) log(`   - ${k}`);
}

// LOCALE override targets that don't exist in INSTITUTION_SERVICES
log(`\nA5. LOCALE_SERVICE_OVERRIDES targets that DO NOT EXIST as INSTITUTION_SERVICES keys (dead redirect -> falls to fuzzy):`);
for (const [variant, target] of Object.entries(LOCALE_SERVICE_OVERRIDES)) {
  if (!INSTITUTION_SERVICES[target]) log(`   - "${variant}" -> "${target}" (missing)`);
}

// ── B. chains: processors vs catalog (slice(0,12) fuzzy, like computeActiveChains) ──
log(`\nB1. SUPPLY_CHAIN_NEEDS chain processors that match NO catalog institution (slice-12 contains test):`);
const lcCatalog = catalogNames.map(n => n.toLowerCase());
const chainIds = new Set();
const dupChainIds = [];
for (const [needKey, need] of Object.entries(SUPPLY_CHAIN_NEEDS)) {
  for (const chain of need.chains) {
    const cid = `${needKey}.${chain.id}`;
    if (chainIds.has(cid)) dupChainIds.push(cid);
    chainIds.add(cid);
    const dead = [];
    let anyMatch = false;
    for (const p of chain.processingInstitutions) {
      const frag = p.toLowerCase().slice(0, 12);
      const hit = lcCatalog.some(n => n.includes(frag));
      if (!hit) dead.push(p); else anyMatch = true;
    }
    if (chain.processingInstitutions.length === 0) {
      log(`   ! ${cid}: EMPTY processingInstitutions -> chain can NEVER activate (matchedInsts.length===0 early return)`);
    } else if (!anyMatch) {
      log(`   ! ${cid}: NO processor matches any catalog institution -> chain unreachable. processors=${JSON.stringify(chain.processingInstitutions)}`);
    } else if (dead.length) {
      log(`   - ${cid}: unmatched processors: ${JSON.stringify(dead)}`);
    }
  }
}
log(`\nB2. Duplicate chain ids (needKey.id collisions): ${JSON.stringify(dupChainIds)}`);

// ── C. RESOURCE_TO_CHAINS targets vs actual chain ids ──
log(`\nC1. RESOURCE_TO_CHAINS entries pointing at NONEXISTENT chain ids:`);
for (const [rk, refs] of Object.entries(RESOURCE_TO_CHAINS)) {
  for (const ref of refs) {
    if (!chainIds.has(ref)) log(`   - ${rk} -> ${ref}`);
  }
}
log(`\nC2. RESOURCE_DATA keys with NO RESOURCE_TO_CHAINS entry (resource never flagged as activating a chain):`);
for (const rk of Object.keys(RESOURCE_DATA)) {
  if (!RESOURCE_TO_CHAINS[rk]) log(`   - ${rk}`);
}
log(`\nC3. Chains never referenced by any resource in RESOURCE_TO_CHAINS (can still run via institutions, but never 'running'/activatedByResource):`);
const referenced = new Set(Object.values(RESOURCE_TO_CHAINS).flat());
for (const cid of chainIds) {
  if (!referenced.has(cid)) log(`   - ${cid}`);
}

// ── C4. chain.resource label resolves to which RESOURCE_DATA key? (resourceLabelToKey replica) ──
function resourceLabelToKey(label) {
  if (!label) return null;
  const words = label.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  let bestKey = null, bestScore = 0;
  Object.keys(RESOURCE_DATA).forEach(key => {
    const keyWords = key.toLowerCase().split('_');
    const score = words.filter(w => keyWords.some(kw => kw.startsWith(w) || w.startsWith(kw))).length;
    if (score > bestScore) { bestScore = score; bestKey = key; }
  });
  return bestScore > 0 ? bestKey : null;
}
log(`\nC4. chain.resource labels and the RESOURCE_DATA key they fuzzy-resolve to (null = no key; mismatch risk):`);
for (const [needKey, need] of Object.entries(SUPPLY_CHAIN_NEEDS)) {
  for (const chain of need.chains) {
    if (!chain.resource) continue;
    const k = resourceLabelToKey(chain.resource);
    const flag = k === null ? ' !! NO KEY' : '';
    log(`   - ${needKey}.${chain.id}: "${chain.resource}" -> ${k}${flag}`);
  }
}

// ── D. GOODS_MODIFIERS_BY_TIER requiredInstitution vs catalog (exact/includes, case-sensitive) ──
log(`\nD1. GOODS_MODIFIERS_BY_TIER requiredInstitution that match NO catalog institution (case-sensitive includes test as in getGoodsModifiers):`);
for (const [tier, goods] of Object.entries(GOODS_MODIFIERS_BY_TIER)) {
  for (const [g, def] of Object.entries(goods)) {
    const req = def.requiredInstitution;
    if (!req) continue;
    const hit = catalogNames.some(n => n === req || n.includes(req));
    if (!hit) log(`   - [${tier}] "${g}" requires "${req}" -> NO catalog name matches (export can never fire)`);
  }
}

// ── E. legacy RESOURCE_CHAINS: processingInstitutions exact-match against catalog ──
log(`\nE1. legacy RESOURCE_CHAINS processors with NO exact catalog name match (evaluateInstitutions uses i.name === name):`);
for (const [key, chain] of Object.entries(RESOURCE_CHAINS)) {
  const dead = chain.processingInstitutions.filter(p => !catalogNames.includes(p));
  if (dead.length) log(`   - ${key}: ${JSON.stringify(dead)} (of ${chain.processingInstitutions.length})`);
}
log(`\nE2. legacy RESOURCE_CHAINS rawResource vs nearbyResources keys (evaluateEconomicActivity: nearbyResources.includes(rawResource)):`);
for (const [key, chain] of Object.entries(RESOURCE_CHAINS)) {
  const isKey = Object.keys(RESOURCE_DATA).includes(chain.rawResource);
  if (!isKey) log(`   - ${key}: rawResource "${chain.rawResource}" is NOT a RESOURCE_DATA key -> resourcePresent always false`);
}

// ── F. resource commodities orphan check ──
log(`\nF1. all commodities produced by RESOURCE_DATA:`);
const allCommodities = new Set();
Object.values(RESOURCE_DATA).forEach(r => (r.commodities||[]).forEach(c => allCommodities.add(c)));
log('   ' + [...allCommodities].sort().join(', '));

// instBoost keywords that match no catalog institution (substring, ci)
log(`\nF2. RESOURCE_DATA instBoosts keywords matching NO catalog institution (substring test):`);
const boostKw = new Set();
Object.values(RESOURCE_DATA).forEach(r => Object.keys(r.instBoosts||{}).forEach(k => boostKw.add(k)));
for (const kw of [...boostKw].sort()) {
  const hit = lcCatalog.some(n => n.includes(kw.toLowerCase()));
  if (!hit) log(`   - "${kw}"`);
}

// ── G. priorityCategory values used in catalog ──
log(`\nG1. priorityCategory distribution by catalog category:`);
const pcByCat = {};
for (const i of catalogInsts) {
  const pc = i.meta.priorityCategory || '(none)';
  pcByCat[i.cat] = pcByCat[i.cat] || {};
  pcByCat[i.cat][pc] = (pcByCat[i.cat][pc] || 0) + 1;
}
for (const [cat, pcs] of Object.entries(pcByCat)) log(`   ${cat}: ${JSON.stringify(pcs)}`);

console.log(out.join('\n'));
