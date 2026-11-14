import fs from 'node:fs'; import zlib from 'node:zlib';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const { loadGenerationLawPayloads } = await import(S+'/q/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const sk = await import(S+'/q/src/domain/people/seatKeeper.js');
const Q=JSON.parse(fs.readFileSync('wants-q.json'));
const recs={}; for (const l of zlib.gunzipSync(fs.readFileSync('../../out/births-q.ndjson.gz')).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); recs[seed]=s; }
const tally={}; const all=[];
for(const seed in Q) for(const p of Q[seed]){ if(!p.cast||!p.goal||p.says!=='want') continue; const s=recs[seed]; const n=s.npcs.find(x=>x.name===p.name);
  const houses=(n?.memberships||[]).map(m=>m.power||m.factionName||'').filter(Boolean);
  const vac = sk.isSeatVacant ? sk.isSeatVacant(s) : null; const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type).join('+');
  let verdict='true-of-role', why='';
  if(/the raids takes/.test(p.line)) { verdict='false'; why='grammar (raids takes)'; }
  else if(/until the seat gives way|when the seat fails/.test(p.line) && vac) { verdict='false'; why='seat already vacant'; }
  else { const m=p.line.match(/(?:people of the|keep the) (.+?) (?:a fair|together|have left|standing)/); if(m && houses.length && !houses.some(h=>h===m[1]||h.includes(m[1])||m[1].includes(h))) { verdict='false'; why='names a house not theirs: '+m[1]+' vs '+houses.join('/'); } }
  const k=verdict+(why?' ('+why.replace(/:.*/,'')+')':''); tally[k]=(tally[k]||0)+1; all.push({seed,st,name:p.name,line:p.line,houses,verdict,why}); }
console.log(tally); fs.writeFileSync('wants-judged.json', JSON.stringify(all,null,1));
