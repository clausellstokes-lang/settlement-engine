import {stresses} from './stress.mjs';
export default (t,p,{page})=>{const ps=t.powerStructure;const rel=(ps.factionRelationships||[]).find(r=>r&&r.dmNote);
const other=rel?.pair?.find(n=>n!==ps.governingName);const fo=ps.factions.find(f=>f.faction===other||f.name===other);const g=ps.factions.find(f=>f.isGoverning);
const pr=(p.page[0]||{}).printed||'';
const ok=!!rel&&rel.type==='competitive'&&!rel.captureState&&pr.includes(other)&&fo&&(fo.power>=g.power*0.6);
return {ok,why:`st ${stresses(t)} rel ${rel?.type} ${rel?.pair} gov ${g?.faction} ${g?.power} other ${other} ${fo?.power} cat ${fo?.category} note: ${String(rel?.dmNote).slice(0,140)}`};};
