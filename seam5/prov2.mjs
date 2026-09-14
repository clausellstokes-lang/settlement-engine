import { readdirSync } from 'node:fs';
import path from 'node:path'; import { pathToFileURL } from 'node:url';
import { classifyMoves, clauseUnits, CLAUSE_DETECTORS, orderIdOf } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneSEAM/src/domain/prose/moveGrammar.js';
const D = process.cwd();
const texts = [];
const gdir = path.join(D, 'src/data/dossierStateProse');
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) for (const [pool, vs] of Object.entries(b.pools || {})) for (const v of vs) texts.push({block,pool,text:v.text});
}
const PROV_RE = /\b(the (?:treasury|watch|parish|market|court|customs)(?:'s)? (?:books|roll|rolls|register|registers|count|ledger|ledgers)|the (?:muster|toll|tithe) (?:roll|rolls|books|register)|the parish register|the elders (?:say|hold|remember|keep)|from the road|the (?:rolls|registers?|ledgers?|books?|records?) (?:say|says|show|shows|hold|holds|carry|carries|name|names|record|records|have|has))\b/i;
const SLOT_RE=/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
const SLOT_MOVE={good:'OBJECT',resource:'OBJECT',asset:'OBJECT',ruin:'OBJECT',institution:'INSTITUTION',seat:'INSTITUTION',govFaction:'INSTITUTION',faction:'PERSON',faction2:'PERSON',npc:'PERSON',governing:'PERSON',counterpart:'GEOGRAPHY',route:'GEOGRAPHY',terrain:'GEOGRAPHY',creed:'TRADITION',rival_creed:'TRADITION',event:'HISTORY',calamity:'HISTORY',timeband_age:'HISTORY',timeband_since:'HISTORY'};
// candidate detector list: PROVENANCE inserted where?  Try FIRST (highest priority) and LAST.
function classifyWith(text, dets){
  const units=clauseUnits(text); const moves=[];
  for(const unit of units){
    const slots=[...unit.matchAll(SLOT_RE)].map(m=>SLOT_MOVE[m[1]]).filter(Boolean);
    const marks=dets.map(d=>{const m=d.re.exec(unit); return m?{move:d.move,at:m.index}:null;}).filter(m=>m!==null).sort((a,b)=>a.at-b.at);
    const local=[]; const head=slots[0]||'PRESENT';
    if(marks.length===0) local.push(head);
    else { if(marks[0].at>12) local.push(head); for(const mk of marks) local.push(mk.move); }
    for(const mv of local) if(moves[moves.length-1]!==mv) moves.push(mv);
  }
  return moves.length?moves:['PRESENT'];
}
for (const pos of ['first','last']) {
  const dets = pos==='first' ? [{move:'PROVENANCE',re:PROV_RE},...CLAUSE_DETECTORS] : [...CLAUSE_DETECTORS,{move:'PROVENANCE',re:PROV_RE}];
  let changed=0, orderChanged=0; const ex=[];
  for(const t of texts){
    const a=classifyMoves(t.text).join('→'); const b=classifyWith(t.text,dets).join('→');
    if(a!==b){changed++; if(orderIdOf(a.split('→'))!==orderIdOf(b.split('→')))orderChanged++; if(ex.length<6)ex.push(`${t.block}::${t.pool}\n      ${a}\n   -> ${b}`);}
  }
  console.log(`PROVENANCE at ${pos}: variants changed ${changed} of ${texts.length}; orderId changed ${orderChanged}`);
  for(const e of ex) console.log('   ', e);
}
