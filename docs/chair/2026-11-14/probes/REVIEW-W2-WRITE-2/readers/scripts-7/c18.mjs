import {stresses} from './stress.mjs';
export default (t,p,{page})=>{const ps=t.powerStructure;const g=ps.factions.find(f=>f.isGoverning)||{};
const lines=page.split('\n');const pw=lines.findIndex(l=>l==='== Systems/Power ==');let mem=null;
for(let i=pw;i<lines.length-2&&i>=0;i++){if(lines[i]===g.faction&&/Holds power/.test(lines[i+1])){const m=lines[i+2].match(/↳(\d+) members?/);mem=m?+m[1]:lines[i+2].slice(0,40);break;}}
const single=/\bheadman\b|\bmayor\b|\breeve\b|one person|\bsteward\b|\bgovernor\b|crown rules/i.test(g.desc||'');
const lord=/\b(?:feudal|royal|noble|ducal|governorship|stewardship|appointee|regency|lord)\b/i.test(ps.government||'');
const ok=!single&&!lord;
return {ok,why:`seat ${g.faction} members ${mem} single ${single} pop ${t.population} st ${stresses(t)}`};};
