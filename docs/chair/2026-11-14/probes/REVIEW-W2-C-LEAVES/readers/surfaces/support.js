const fs=require("fs");const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const famL=fs.readFileSync("/tmp/claude-0/rw2c/run/fam-surf/pdf.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const famSeeds=l=>new Set(famL.filter(r=>r.line===l).map(r=>r.seed));
const NONEs=famSeeds("None"),NDB=famSeeds("No deterrence beyond force."),PO=famSeeds("Prison only");
const LEGAL=/court|magistrat|judge|justiciar|lawspeaker|assize|tribunal|town hall|city hall|guildhall|moot|thing\b|council|reeve|bailiff|sheriff|headman|elder|chief|lord/i;
const COURT=/court|magistrat|judge|justiciar|lawspeaker|assize|tribunal|moot|\bthing\b/i;
const PRISON=/prison|jail|gaol|stocks|dungeon|lock-?up/i;
const ARC=/wizard|mage|arcan|sorcer|alchem|enchant|scroll|hedge|witch|warlock|magic|teleport|spell|druid|astrolog|diviner/i;
const res={legalNone:{n:0,court:[],prison:[]},prisonOnly:{n:0,court:[],noPrison:[]},arcNone:{n:0,arc:[]}};
for(const x of P){const S=x.pdf.support;if(!S)continue;const inst=x.facts.inst.filter(n=>!/^access to/i.test(n));
 const li=S.indexOf("Legal Infrastructure"),ai=S.indexOf("Arcane Support");
 if(li>=0){const v=S[li+1];
  if(v==="None"&&NDB.has(x.seed)){res.legalNone.n++;const c=inst.filter(n=>COURT.test(n)),p=inst.filter(n=>PRISON.test(n));if(c.length)res.legalNone.court.push(x.seed+": "+c.join(","));if(p.length)res.legalNone.prison.push(x.seed+": "+p.join(","));}
  if(v==="Prison only"&&PO.has(x.seed)){res.prisonOnly.n++;const c=inst.filter(n=>COURT.test(n)),p=inst.filter(n=>PRISON.test(n));if(c.length)res.prisonOnly.court.push(x.seed+": "+c.join(","));if(!p.length)res.prisonOnly.noPrison.push(x.seed+": "+inst.join(",").slice(0,200));}}
 if(ai>=0&&S[ai+1]==="None"&&NONEs.has(x.seed)){res.arcNone.n++;const a=inst.filter(n=>ARC.test(n));if(a.length)res.arcNone.arc.push(x.seed+" ("+x.facts.tier+"): "+a.join(","));}
}
for(const k in res){console.log(k,res[k].n);for(const kk in res[k])if(Array.isArray(res[k][kk]))console.log("  ",kk,res[k][kk].length,res[k][kk].slice(0,8))}
