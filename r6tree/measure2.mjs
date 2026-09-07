import { ROLE_CONTENT } from './src/domain/display/causeConjunctionRoleContent.js';
import { CLASS_CONTENT } from './src/domain/display/causeConjunctionClassContent.js';
import { FULL_CONTENT } from './src/domain/display/causeConjunctionContent.js';
import { STAGE_TEMPLATES, CAUSE_MECHANISM_PHRASE } from './src/domain/display/causeLifecycleVocabulary.js';

const pools = [];
const walk = (obj, path, tier) => { for (const [k,v] of Object.entries(obj)) {
  if (Array.isArray(v)) pools.push({tier, path:[...path,k], lines:v});
  else if (v && typeof v==='object') walk(v,[...path,k],tier); } };
walk(ROLE_CONTENT, [], 'role');      // path = [role, causeClass, stage]
walk(CLASS_CONTENT, [], 'class');    // path = [causeClass, stage]
walk(FULL_CONTENT, [], 'full');      // path = [role, situation, causeClass, stage]
walk(STAGE_TEMPLATES, [], 'floor');

const R6 = pools.filter(p=>p.tier!=='floor');
const all = R6.flatMap(p=>p.lines.map(t=>({...p,text:t})));
const causeOf = p => p.tier==='role' ? p.path[1] : p.tier==='class' ? p.path[0] : p.path[2];
const stageOf = p => p.path[p.path.length-1];

// em dashes
console.log('--- em dashes in R6 (14 files) ---');
for (const a of all) if (/—/.test(a.text)) console.log(a.tier, a.path.join('|'), '::', a.text.slice(0,120));
console.log('floor em dashes:', pools.filter(p=>p.tier==='floor').flatMap(p=>p.lines).filter(t=>/—/.test(t)).length);

// LICENSED entity per causeClass (from CAUSE_MECHANISM_PHRASE, the only typed cause vocabulary)
const LICENSED = {
  underfunded:/coin|pay|purse|fee|wage|short|fund|strongbox|treasur/i,
  'chain-starved':/supply|wagon|requisition|chain|goods|caravan|road|freight/i,
  depleted:/store|dry|stock|relief|dole|scarcit|ration|deplet|empt/i,
  'trade-strangled':/trade|choke|embargo|toll|market|tariff|blockad/i,
  'levied-away':/lev(y|ie)|war|muster|conscript|draft|strength/i,
  'garrison-drained':/garrison|hollow|watch|guard|soldier|militia|troop/i,
  'siege-scarred':/siege|war|press|wall|breach|bombard/i,
  occupation:/occupier|occupation|held the town|garrison of|overseer/i,
  'conduct-drift':/patron|reward|deed|drift/i,
  'conversion-pressure':/rival|faith|convert|creed|mission|preach/i,
  secularization:/faith|cold|empt(y|ied) pew|pew|altar|rite|congregation|secular/i,
  'clergy-scandal':/priest|clergy|taint|pulpit|absolution|confess/i,
  captured:/underworld|syndicate|crew|boss|gang|racket|protection/i,
  scandal:/scandal|corrupt|bribe|disgrace|pardon|prosecut/i,
};
// institutions named that are NOT in the licensed vocabulary of the line's own causeClass
const INST = /\b(auditors?|magistrates?|bailiffs?|sheriffs?|reeves?|constables?|assessors?|inspectors?|notar(y|ies)|coroners?|duty sergeant|guilds?|councils?|assembl(y|ies)|chapter|creditors?|factors?|tribunal|court|assize|excise|tithe|census|roll)\b/gi;
const unlicensed = [];
for (const a of all) {
  const c = causeOf(a); const lic = LICENSED[c] || /$^/;
  const ms = [...new Set((a.text.match(INST)||[]).map(x=>x.toLowerCase()))];
  const bad = ms.filter(m => !lic.test(m));
  if (bad.length) unlicensed.push({c, stage:stageOf(a), bad, text:a.text});
}
console.log('\n--- lines naming an institution outside the causeClass vocabulary ---');
console.log('count', unlicensed.length, 'of', all.length, '=', (unlicensed.length/all.length).toFixed(4));
const tally={}; for(const u of unlicensed) for(const b of u.bad) tally[b]=(tally[b]||0)+1;
console.log(JSON.stringify(Object.entries(tally).sort((x,y)=>y[1]-x[1])));
for (const u of unlicensed.slice(0,10)) console.log(' ', u.c, '/', u.stage, '|', u.bad.join(','), '::', u.text.slice(0,110));

// stage x tier coverage & move shapes
console.log('\n--- pool count by stage ---');
const byStage={}; for(const p of R6){const s=stageOf(p); byStage[s]=byStage[s]||{pools:0,lines:0}; byStage[s].pools++; byStage[s].lines+=p.lines.length;}
console.log(JSON.stringify(byStage));

// MOVE SHAPES: what joins the clauses
const shape = t => {
  const s = t.replace(/\{[a-z_0-9]+\}/g,'X');
  if (/:/.test(s) && /;/.test(s)) return 'colon+semicolon';
  if (/;/.test(s)) return 'semicolon';
  if (/:/.test(s)) return 'colon';
  if (/, (and|but|so|yet)\b/.test(s)) return 'comma-conj';
  if (/\. /.test(s.slice(0,-1))) return 'two-sentence';
  return 'single-clause';
};
const sh={}; for(const a of all) sh[shape(a.text)]=(sh[shape(a.text)]||0)+1;
console.log('\n--- joint shape ---'); console.log(JSON.stringify(sh));

// FIRST MOVE: what does the line open with?
const firstMove = t => {
  const s=t.trim();
  if (/^(it is|there is|it was|there was)/i.test(s)) return 'existential-disclosure';
  if (/^(with|when|since|after|once|as )/i.test(s)) return 'subordinate-circumstance';
  if (/^(what|whatever|whoever)/i.test(s)) return 'wh-nominal';
  if (/^the (\w+) (is|was|are|were|has|have|had)\b/i.test(s)) return 'state-copula';
  if (/^(a|an) /i.test(s)) return 'indefinite-noun';
  if (/^the /i.test(s)) return 'the-noun-other';
  return 'other';
};
const fm={}; for(const a of all) fm[firstMove(a.text)]=(fm[firstMove(a.text)]||0)+1;
console.log('\n--- opening move ---'); console.log(JSON.stringify(Object.entries(fm).sort((x,y)=>y[1]-x[1])));
// same opening move as previous line, in file order
let same=0; let prev=null; for(const a of all){const f=firstMove(a.text); if(prev===f) same++; prev=f;}
console.log('same opening move as previous:', same, '/', all.length-1, '=', (same/(all.length-1)).toFixed(3));
// within a POOL, do both variants take the same opening move?
let poolSameMove=0, poolMulti=0;
for(const p of R6){ if(p.lines.length<2) continue; poolMulti++; const ms=p.lines.map(firstMove); if(new Set(ms).size===1) poolSameMove++; }
console.log('multi pools where every variant takes the SAME opening move:', poolSameMove, '/', poolMulti, '=', (poolSameMove/poolMulti).toFixed(3));

// closers
const lastWord = t => (t.replace(/[^A-Za-z'’ ]/g,'').trim().split(/\s+/).pop()||'').toLowerCase();
const lw={}; for(const a of all) lw[lastWord(a.text)]=(lw[lastWord(a.text)]||0)+1;
console.log('\n--- top closers ---'); console.log(JSON.stringify(Object.entries(lw).sort((x,y)=>y[1]-x[1]).slice(0,15)));
const PRON=/^(it|them|they|him|her|us|this|that|one|those|these)$/;
console.log('pronoun closers', all.filter(a=>PRON.test(lastWord(a.text))).length, '/', all.length);
