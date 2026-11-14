const zlib=require('zlib'),fs=require('fs');
const R='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/r/tip';
const cache={};
function rec(t){if(!cache[t])cache[t]=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${R}/records/${t}.json.gz`)));return cache[t];}
function facts(t){const j=rec(t),e=j.economicState||{},p=j.powerStructure||{},d=j.defenseProfile||{};
 const st=Array.isArray(j.stress)?j.stress:(j.stress?[j.stress]:[]);
 const di=d.institutions||{};
 return {name:j.name,tier:j.tier,pop:j.population,stress:st.map(s=>s.type).join(','),
  prosp:e.prosperity,trade:e.tradeAccess,entrepot:e.isEntrepot,transit:(e.transit||[]).length,
  inst:(j.institutions||[]).map(i=>i.name+(i.status&&i.status!=='active'?'['+i.status+']':'')).join('; '),
  gov:p.government,factions:(p.factions||[]).map(f=>`${f.faction}(${f.power}${f.isGoverning?',GOV':''})`).join('; '),
  legit:p.publicLegitimacy?.label,capture:p.criminalCaptureState,
  def:Object.entries(di).filter(([k,v])=>v&&v.length).map(([k,v])=>k+':'+v.map(x=>x.name).join('/')).join('; '),
  ready:d.readiness?.label,
  chains:(e.activeChains||[]).map(c=>`${c.label}[${c.status}]`).join('; '),
  food:e.foodSecurity?`${e.foodSecurity.label} siege=${e.foodSecurity.hasSiege} famine=${e.foodSecurity.hasFamine} store=${e.foodSecurity.storageMonths}`:null,
  sit:e.situationDesc,via:j.stress?.viabilityNote||(Array.isArray(j.stress)?j.stress.map(s=>s.viabilityNote).join(" | "):null),imports:(e.primaryImports||[]).join('; ')};
}
function sents(p){return (p||'').split(/(?<=[.!?])\s+(?=[A-Z"'(])/).map(s=>s.trim()).filter(Boolean);}
function diff(base,tip){const b=new Set(sents(base)),t=new Set(sents(tip));return {gone:[...b].filter(s=>!t.has(s)),added:[...t].filter(s=>!b.has(s))};}
function dump(t){return fs.readFileSync(`${R}/dumps/${t}.txt`,'utf8');}
function grep(t,re){return dump(t).split('\n').filter(l=>re.test(l));}
module.exports={rec,facts,sents,diff,dump,grep,R};
