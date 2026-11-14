// UPKEEP-9, the chair's 01:30 measures over a gzipped corpus: C-L7's military and internal bars (the 60/35 colour
// against scoreBand's 65/40/20), #608's figure and word one band apart, and the income label naming alchemy
// beside no alchemist's house. usage: TREE=<tree> node chair0130.mjs <corpus.gz> <out.json>
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T=process.env.TREE;
const { scoreBand } = await import(T+'/src/domain/display/defenseScoreBands.js');
const { buildThreatAssessment } = await import(T+'/src/domain/display/threatAssessment.js');
const { PROSPERITY_LABELS } = await import(T+'/src/domain/prosperityRank.js');
const cls=(c)=>({'#1a4a2a':'green','#1a5a28':'green','#7a5010':'amber','#8b1a1a':'red'}[c]||c);
const bandCls=(b)=>b==='STRONG'?'green':b==='ADEQUATE'?'amber':'red';
const C={}, ex={}; const inc=(k,seed)=>{C[k]=(C[k]||0)+1;(ex[k]??=[]); if(ex[k].length<6) ex[k].push(seed);};
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let n=0;
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); n++;
  const sc=s.defenseProfile?.scores||{};
  let rows=[]; try{ rows=buildThreatAssessment(s); }catch(e){ inc('ta.err',seed); }
  for(const [label,key] of [['Invasion & War','military'],['Internal Security','internal'],['Economic Survival','economic']]){
    const row=rows.find(r=>r.label===label); if(!row) continue;
    const band = key==='economic' ? null : scoreBand(sc[key]||0);
    if(band && cls(row.color)!==bandCls(band)) inc(`bar.${key}.disagree:${cls(row.color)}-beside-${band}`,seed);
  }
  // #608
  const eco=s.economicState||{}; const score=Math.round(eco.compound?.economyOutput||0); const label=String(eco.prosperity??'');
  const rung=['Subsistence',...PROSPERITY_LABELS].map(String).indexOf(label);
  if(score>0 && rung>=0){ const wb = rung>=1+PROSPERITY_LABELS.indexOf('Prosperous') ? 2 : rung<=1+PROSPERITY_LABELS.indexOf('Poor') ? 0 : 1;
    const fb = score>=60?2:score>=35?1:0; const d=Math.abs(wb-fb); inc('608.apart:'+d,seed); }
  // income label
  const names=(s.institutions||[]).map(i=>String(i.name).toLowerCase());
  for(const src of (eco.incomeSources||[])) if(/alchem/i.test(String(src.source))){ inc('inc.alchemyLabel',seed); if(!names.some(n=>/alchemist/.test(n))) inc('inc.alchemyLabel.noAlchemist:'+src.source,seed); }
}
fs.writeFileSync(process.argv[3],JSON.stringify({n,C,ex},null,1));
for(const [k,v] of Object.entries(C).sort()) console.log(v,k,(ex[k]||[]).slice(0,3).join(' '));
