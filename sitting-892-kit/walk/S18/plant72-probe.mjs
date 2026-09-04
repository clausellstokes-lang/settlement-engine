// READ-ONLY re-derivation of mutation-sweep plant 72's catching power, importing the dock's
// leaf and pools by absolute path and striking the range IN MEMORY (no dock file is touched).
import { NAMING_DATA } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/src/data/namingData.js';
import { CUSTOM_CONTENT_CHARSET } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/src/domain/content/customContentCharset.generated.js';
import { decodeRanges } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/src/domain/content/customContentCharset.js';
const orig = CUSTOM_CONTENT_CHARSET.surfaces['dossier-pdf'].ranges;
const struck = orig.replace('"D 20-7E A0-AC AE-132 '.slice(1), 'D 20-7E A0-AC ');
console.log('anchor present in dossier ranges:', orig.startsWith('D 20-7E A0-AC AE-132 '), '| struck differs:', struck !== orig);
console.log('campaign-pdf ranges start:', CUSTOM_CONTENT_CHARSET.surfaces['campaign-pdf'].ranges.slice(0,20), '| world-book:', CUSTOM_CONTENT_CHARSET.surfaces['world-book'].ranges.slice(0,20));
const DOSSIER0 = decodeRanges(orig), DOSSIER1 = decodeRanges(struck), BOOK = decodeRanges(CUSTOM_CONTENT_CHARSET.surfaces['campaign-pdf'].ranges);
function has(set, cp){ if (cp < 0x10000) return (set.bmp[cp >> 3] & (1 << (cp & 7))) !== 0; return set.astral.some(([lo,hi]) => cp>=lo && cp<=hi); }
function pooledStrings(){ const out=[]; const walk=(node,path)=>{ if (typeof node==='string'){out.push([path,node]);return;} if (Array.isArray(node)){node.forEach((c,i)=>walk(c,path+'['+i+']'));return;} if (node&&typeof node==='object'){for (const [k,v] of Object.entries(node)) walk(v,path+'.'+k);} }; walk(NAMING_DATA,'NAMING_DATA'); return out; }
function census(set){ const codepoints=new Set(); let instances=0; for (const [,value] of pooledStrings()) for (const ch of value){ const cp=ch.codePointAt(0); if (has(set,cp)) continue; instances++; codepoints.add(cp);} return { instances, codepoints:[...codepoints].sort((a,b)=>a-b).map(cp=>'U+'+cp.toString(16).toUpperCase().padStart(4,'0')) }; }
const strings = pooledStrings();
const arms = [];
arms.push(['1 walk not vacuous', strings.length > 3000, strings.length]);
const d0 = census(DOSSIER0), d1 = census(DOSSIER1);
arms.push(['2 dossier printable (CLEAN)', d0.instances === 0, d0]);
arms.push(['2 dossier printable (PLANT)', d1.instances === 0, d1]);
const b = census(BOOK);
arms.push(['3 book census exact', b.instances === 41 && JSON.stringify(b.codepoints) === JSON.stringify(['U+0101','U+0107','U+010C','U+010D','U+0110','U+0111','U+0161','U+017E']), b]);
const keys=[]; const wk=(n)=>{ if(!n||typeof n!=='object')return; if(Array.isArray(n)){n.forEach(wk);return;} for(const [k,v] of Object.entries(n)){keys.push(k);wk(v);} }; wk(NAMING_DATA);
arms.push(['4 keys printable in BOOK', keys.every(k=>[...k].every(ch=>has(BOOK,ch.codePointAt(0)))), keys.length]);
const arm5 = (set) => b.codepoints.every(l => has(set, Number.parseInt(l.slice(2),16)));
arms.push(['5 book-miss drawable in dossier (CLEAN)', arm5(DOSSIER0)]);
arms.push(['5 book-miss drawable in dossier (PLANT)', arm5(DOSSIER1), b.codepoints.filter(l=>!has(DOSSIER1, Number.parseInt(l.slice(2),16)))]);
for (const a of arms) console.log(a[1] ? 'PASS ' : 'FAIL ', a[0], JSON.stringify(a.slice(2)).slice(0,300));
