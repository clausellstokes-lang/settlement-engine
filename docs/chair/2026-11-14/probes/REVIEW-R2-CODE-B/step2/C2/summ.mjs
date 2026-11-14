// summ.mjs <tree> <births.gz> : famine & wartime stored summaries with the atoms the writer reads (at <tree>)
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births] = process.argv.slice(2);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { factsOf } = await import(tree + '/src/domain/facts/factsOf.js');
const { atomHolds } = await import(tree + '/src/domain/facts/factVocabulary.js');
const A=(a,f)=>{ try { return atomHolds(a,f); } catch(e){ return 'ERR'; } };
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const st = Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]; const want = st.filter(x=>x.type==='famine'||x.type==='wartime'); if(!want.length) continue;
  const f = factsOf(s);
  const fr = s.economicState?.foodSecurity?.foodRecord || {};
  for (const x of want) console.log(JSON.stringify({ seed, tier:s.tier, type:x.type, summary:x.summary, grain:A('grain',f), prosp:A('prosperity: ≥ moderate',f), prosperity:s.economicState?.prosperity, market:A('market',f), isolated:A('route: isolated',f), hunger:A('crisis: hunger',f), route:s.config?.tradeRouteAccess, gov:s.powerStructure?.government, sources:fr.foodSources, failed:fr.failedSource, chains: JSON.stringify(s.economicState?.foodSecurity?.chains||null) })); }
