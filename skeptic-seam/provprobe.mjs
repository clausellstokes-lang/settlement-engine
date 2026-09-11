const SK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepSEAM';
const { classifyMoves } = await import(SK+'/src/domain/prose/moveGrammar.js');
const fs = await import('node:fs');
const files=['defense','economy','general','power','stressors','warFaith'];
const kindLimb = /\b(the (?:treasury|watch|parish|market|court|customs)(?:'s)? (?:books|roll|rolls|register|registers|count|ledger|ledgers)|the (?:muster|toll|tithe) (?:roll|rolls|books|register)|the elders (?:say|hold|remember|keep)|from the road)\b/i;
const genericLimb = /\b(the (?:rolls|registers?|ledgers?|books?|records?) (?:say|says|show|shows|hold|holds|carry|carries|name|names|record|records|have|has))\b/i;
let cited=[];
for (const f of files){
  const mod = await import(SK+'/src/data/dossierStateProse/'+f+'.generated.js');
  const B = Object.values(mod)[0];
  for (const [blockId, block] of Object.entries(B)) {
    for (const [pool, variants] of Object.entries(block.pools||{})) {
      for (const v of variants) {
        if (classifyMoves(v.text).includes('PROVENANCE')) cited.push({blockId,pool,text:v.text});
      }
    }
  }
}
console.log('citing variants:', cited.length);
let k=0,g=0,both=0;
for(const c of cited){
  const K=kindLimb.test(c.text), G=genericLimb.test(c.text);
  if(K&&G) both++; else if(K) k++; else if(G) g++;
  console.log((K?'KIND    ':'')+(G?'GENERIC ':'')+'| '+c.blockId+' :: '+c.pool+' | '+(c.text.match(K?kindLimb:genericLimb)||[''])[0]);
}
console.log('kind-only',k,'generic-only',g,'both',both);
