// trad.mjs <tree> <births.gz> [seeds] : market-element traditions, raw vs admitted
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, seeds='ALL'] = process.argv.slice(2); const want = seeds==='ALL'?null:new Set(seeds.split(','));
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { deriveFoundingTraditions } = await import(tree + '/src/domain/traditions/genesis.js');
const { TRADITION_ELEMENTS } = await import(tree + '/src/data/traditionCorpus.js');
const { filterDeclared } = await import(tree + '/src/domain/facts/drawDeclared.js');
const { factsOf } = await import(tree + '/src/domain/facts/factsOf.js');
const NEEDS = new Map(TRADITION_ELEMENTS.filter((e) => Array.isArray(e.needs) && e.needs.length).map((e) => [e.id, e.needs]));
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); if (want && !want.has(seed)) continue;
  const kept = deriveFoundingTraditions(s) || [];
  const adm = filterDeclared(kept.map((rec) => ({ text: String(rec?.name ?? ''), needs: NEEDS.get(rec?.coreMotif?.element) || [], rec })), { facts: () => factsOf(s), poolId: 'traditions:tab', surface: 'traditions', drawKind: 'A' }).map(r=>r.rec);
  const mk = kept.filter(r=>r?.coreMotif?.element==='market').map(r=>r.name); const mka = adm.filter(r=>r?.coreMotif?.element==='market').map(r=>r.name);
  let fm; try { fm = JSON.stringify(factsOf(s).market ?? null); } catch(e){ fm='ERR'; }
  if (mk.length) console.log(JSON.stringify({ seed, tier: s.tier, raw: mk, admitted: mka, all: kept.map(r=>r.name+'/'+r?.coreMotif?.element), market: fm })); }
