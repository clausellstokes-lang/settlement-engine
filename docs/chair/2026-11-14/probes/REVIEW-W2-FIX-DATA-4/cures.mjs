// REVIEW-W2-FIX-DATA-4 step 2: each cured row's old and new text, by town, in the record (any field). TREE= SEEDS= OUT= node cures.mjs
import fs from 'node:fs';
const TREE=process.env.TREE; process.chdir(TREE);
const { boot } = await import(new URL('./born.mjs', import.meta.url).href); const born=await boot(TREE);
const { hasInstitution } = await import(TREE+'/src/domain/facts/institutions.js');
const ROWS = {
  churchOld: /Hundreds of houses of worship across all districts|Houses of worship in the hundreds/,
  churchNew: /Scores of parishes, from fifty|Parishes by the score/,
  mineOld: /worked by hired crews|Hired crews, winding gear|A worked shaft or adit with hired crews/,
  mineNew: /A mine of shafts and adits|A shaft driven into the deposits/,
  compactOld: /farming families and the merchant guilds negotiated/,
  compactNew: /farming families and the guilds negotiated/,
  compactTwin: /farming families agreed a formal compact/,
  brewOld: /After the bakers, no trade eats more grain/,
  brewNew: /Only bread takes more of the grain/,
};
const out=[];
for (const seed of fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n')) {
  const s=born(seed); const j=JSON.stringify(s); const hit={};
  for (const [k,re] of Object.entries(ROWS)) if (re.test(j)) hit[k]=1;
  if (!Object.keys(hit).length) continue;
  const names=(s.institutions||[]).map(i=>i.name);
  out.push({seed,tier:s.tier,stress:(s.stress?[].concat(s.stress):[]).map(x=>x.type),hit,
    guild:names.filter(n=>/guild/i.test(n)), merchantGuild:names.some(n=>/merchant/i.test(n)&&/guild/i.test(n)), baker:names.some(n=>/bak/i.test(n)), tavern:hasInstitution(s,'tavern'),
    mine:names.filter(n=>/\bmine/i.test(n)), reason:String(s.settlementReason?.reason||s.settlementReason?.label||JSON.stringify(s.settlementReason)||'').slice(0,120),
    churches:names.filter(n=>/Parish/i.test(n))});
}
fs.writeFileSync(process.env.OUT,out.map(x=>JSON.stringify(x)).join('\n')+'\n');
const c={}; for(const o of out) for(const k of Object.keys(o.hit)) c[k]=(c[k]||0)+1; console.log(JSON.stringify(c));
