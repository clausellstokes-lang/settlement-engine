import { ROLE_CONTENT } from './src/domain/display/causeConjunctionRoleContent.js';
import { CLASS_CONTENT } from './src/domain/display/causeConjunctionClassContent.js';
import { FULL_CONTENT } from './src/domain/display/causeConjunctionContent.js';
const pools=[]; const walk=(o,p,t)=>{for(const[k,v]of Object.entries(o)){if(Array.isArray(v))pools.push({tier:t,path:[...p,k],lines:v});else if(v&&typeof v==='object')walk(v,[...p,k],t);}};
walk(ROLE_CONTENT,[],'role'); walk(CLASS_CONTENT,[],'class'); walk(FULL_CONTENT,[],'full');
const all=pools.flatMap(p=>p.lines.map(t=>({...p,text:t})));
const words=s=>s.trim().split(/\s+/).filter(Boolean).length;
// interiority: mental-state predicates attached to the role-bearer
const MENTAL=/\b(believes?|believed|feels?|felt|fears?|feared|hopes?|hoped|wants?|wanted|knows|knew|thinks?|thought|regrets?|resents?|intends?|means to|conscience|shame|guilt|pride|appetite|conviction|loyalty|despair|weary|weariness|reluctan\w*)\b/gi;
const hits={}; let n=0; const ex=[];
for(const a of all){const m=a.text.match(MENTAL); if(m){n++; ex.push(a.text); for(const x of m)hits[x.toLowerCase()]=(hits[x.toLowerCase()]||0)+1;}}
console.log('lines with an interior/mental predicate:', n, '/', all.length, '=', (n/all.length).toFixed(4));
console.log(JSON.stringify(Object.entries(hits).sort((x,y)=>y[1]-x[1]).slice(0,20)));
ex.slice(0,8).forEach(t=>console.log('  ::', t.slice(0,120)));
// who is the subject of the mental predicate: town vs role
console.log('\n"the town" as knower:', all.filter(a=>/\bthe town (knows|is learning|has learned|learned|believes|thinks|is deciding|does not know)\b/i.test(a.text)).length);
// closers by KIND
const lastW=t=>(t.replace(/[^A-Za-z'’ ]/g,'').trim().split(/\s+/).pop()||'').toLowerCase();
const ABSTRACT=/^(arrangement|habit|reckoning|silence|power|debt|leverage|price|trade|order|record|obligation|consideration|protection|confession|accounting|fiction|practice|business|difference|question|answer|truth|shame|disgrace|loyalty|authority|cost)$/;
const PRON=/^(it|them|they|him|her|us|this|that|one|those|these)$/;
const ADV=/^(now|again|first|already|still|yet|anyway|too|alone|over|back|since|instead|entirely|quietly)$/;
let ab=0,pr=0,ad=0,other=0;
for(const a of all){const w=lastW(a.text); if(ABSTRACT.test(w))ab++; else if(PRON.test(w))pr++; else if(ADV.test(w))ad++; else other++;}
console.log('\ncloser kinds — abstract-arrangement family', ab, '| pronoun', pr, '| adverb/deictic', ad, '| other(noun etc)', other, 'of', all.length);
// FULL tier
const f=all.filter(a=>a.tier==='full').map(a=>words(a.text)).sort((x,y)=>x-y);
console.log('\nFULL tier lengths:', JSON.stringify(f));
// two-sentence lines
const seg=t=>t.replace(/\{[a-z_0-9]+\}/g,'X').split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter(s=>s.trim());
const two=all.filter(a=>seg(a.text).length>1);
console.log('\nlines with 2+ sentences:', two.length, 'of', all.length, '; by tier:', JSON.stringify(['role','class','full'].map(t=>[t,two.filter(a=>a.tier===t).length])));
two.slice(0,5).forEach(a=>console.log('  ::', a.text.slice(0,130)));
// role noun vocabulary
const ROLES=/\b(the (captain|priest|ruler|boss|official|merchant|healer|claimant|adept|agitator|foreman|envoy|clerk|steward))\b/gi;
const rn={}; for(const a of all) for(const m of (a.text.match(ROLES)||[])) rn[m.toLowerCase()]=(rn[m.toLowerCase()]||0)+1;
console.log('\nrole nouns:', JSON.stringify(Object.entries(rn).sort((x,y)=>y[1]-x[1])));
console.log('{role} slot lines:', all.filter(a=>/\{role\}/.test(a.text)).length);
