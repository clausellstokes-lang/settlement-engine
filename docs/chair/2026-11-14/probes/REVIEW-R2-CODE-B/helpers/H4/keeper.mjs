import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const B=await import(T+'domain/density/densityCreateBoundary.js'); if (B.loadGenerationLawPayloads) await B.loadGenerationLawPayloads();
const K=await import(T+'domain/people/seatKeeper.js');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let vac=0,keep=0,rels=0; const out=fs.createWriteStream('keeper.tsv'); const forms={};
for await (const line of rl){ const {seed,s}=JSON.parse(line);
 if(!K.isSeatVacant(s)) continue; vac++; const k=K.seatKeeperOf(s); if(!k) continue; keep++;
 const form=K.keeperFormOf(s); forms[form]=(forms[form]||0)+1;
 const relList=(s.relationships||s.npcRelationships||[]).filter(r=>r.from===k.id||r.to===k.id); rels+=relList.length;
 out.write([seed,s.tier,(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type).join('+'),k.id,k.name,k.role,k.title||'',form,K.seatKeeperLineOf(s),relList.length,relList.map(r=>`${r.from===k.id?r.npc1Role:r.npc2Role}`).join('|')].join('\t')+'\n');
}
out.end(); console.log({vac,keep,rels}); console.log(forms);
