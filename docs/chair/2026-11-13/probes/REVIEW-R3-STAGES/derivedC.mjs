// derivedC.mjs: TREE=<tree> IN=<births.ndjson.gz> OUT=<out.jsonl> — C1's display-derived lines per town, computed by the
// tree's own domain functions over the tree's own births: daily-life slots (all), the conditions sentence, the threat
// profiles' names/types, the crisis vantage summary on each surface.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { deriveDailyLife } = await import(R+'/domain/dailyLife.js');
const { activeConditionWords, conditionsSentence } = await import(R+'/domain/display/conditionWords.js');
const { deriveAllThreatProfiles } = await import(R+'/domain/threatProfile.js');
const { crisisSummaryForSurface } = await import(R+'/domain/crisis/crisisSummaryVantage.js');
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const out=fs.createWriteStream(process.env.OUT); let n=0, err=0;
for await (const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); const o={seed};
  try{ const dl=deriveDailyLife(s); o.daily=Object.fromEntries(Object.entries(dl.slots).map(([k,x])=>[k,x.text])); }catch(e){ o.dailyErr=e.message; err++; }
  try{ const w=activeConditionWords(s); o.cond=w.length?conditionsSentence(w):null; }catch(e){ o.condErr=e.message; err++; }
  try{ o.threats=(deriveAllThreatProfiles(s)||[]).map(t=>`${t.type}|${t.label||t.name}|${t.severityBand||''}`); }catch(e){ o.thrErr=e.message; err++; }
  try{ const st=Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]; o.vantage=st.map(e=>['cover','overview','defence','tonight'].map(k=>crisisSummaryForSurface(e,s.name,k)).join(' ‖ ')); }catch(e){ o.vanErr=e.message; err++; }
  out.write(JSON.stringify(o)+'\n'); n++; }
out.end(); console.log('towns',n,'errors',err);
