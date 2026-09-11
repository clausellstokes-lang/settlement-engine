import { ROLE_CONTENT } from './src/domain/display/causeConjunctionRoleContent.js';
import { CLASS_CONTENT } from './src/domain/display/causeConjunctionClassContent.js';
import { FULL_CONTENT } from './src/domain/display/causeConjunctionContent.js';
import { STAGE_TEMPLATES } from './src/domain/display/causeLifecycleVocabulary.js';

const pools = []; // {tier, key, lines[]}
const walk = (obj, path, tier) => {
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) pools.push({ tier, key: [...path, k].join('|'), lines: v });
    else if (v && typeof v === 'object') walk(v, [...path, k], tier);
  }
};
walk(ROLE_CONTENT, [], 'role');
walk(CLASS_CONTENT, [], 'class');
walk(FULL_CONTENT, [], 'full');
walk(STAGE_TEMPLATES, [], 'floor');

const all = pools.flatMap(p => p.lines.map(t => ({ ...p, text: t })));
console.log('pools', pools.length, 'lines', all.length);
const byTier = {}; for (const p of pools) { byTier[p.tier] = byTier[p.tier] || { pools: 0, lines: 0 }; byTier[p.tier].pools++; byTier[p.tier].lines += p.lines.length; }
console.log('by tier', JSON.stringify(byTier));
const sizes = {}; for (const p of pools) sizes[p.lines.length] = (sizes[p.lines.length]||0)+1;
console.log('pool sizes', JSON.stringify(sizes));

// segments
const seg = t => t.replace(/\{[a-z_0-9]+\}/g,'X').split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter(s=>s.trim());
const words = s => s.trim().split(/\s+/).filter(Boolean).length;
const segs = all.flatMap(a => seg(a.text));
console.log('segments', segs.length);
const ws = segs.map(words).sort((a,b)=>a-b);
const q = p => ws[Math.floor(p*(ws.length-1))];
console.log('words/seg mean', (ws.reduce((a,b)=>a+b,0)/ws.length).toFixed(2), 'p10', q(0.1), 'p50', q(0.5), 'p90', q(0.9), 'min', ws[0], 'max', ws[ws.length-1]);
console.log('under8', segs.filter(s=>words(s)<8).length, '=', (segs.filter(s=>words(s)<8).length/segs.length).toFixed(4));
console.log('over30', segs.filter(s=>words(s)>30).length, '=', (segs.filter(s=>words(s)>30).length/segs.length).toFixed(4));

// openers
const opener2 = t => t.replace(/\{[a-z_0-9]+\}/g,'{}').trim().split(/\s+/).slice(0,2).join(' ').toLowerCase().replace(/[^a-z{} ]/g,'');
const op1 = {}; for (const a of all) { const w = a.text.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g,''); op1[w]=(op1[w]||0)+1; }
console.log('top first words', JSON.stringify(Object.entries(op1).sort((x,y)=>y[1]-x[1]).slice(0,12)));
const existRe = /^(there|it)\s+(is|was|are|were)\b/i;
console.log('existential openers (line-initial)', all.filter(a=>existRe.test(a.text)).length, '/', all.length);
console.log('  "It is public"', all.filter(a=>/^it is public/i.test(a.text)).length);
console.log('  "It is out"/"is out"', all.filter(a=>/^it is out/i.test(a.text)).length, all.filter(a=>/\bis out\b/i.test(a.text)).length);
console.log('existential ANY segment', segs.filter(s=>existRe.test(s.trim())).length, '/', segs.length);

// punctuation
console.log('semicolon lines', all.filter(a=>a.text.includes(';')).length, '=', (all.filter(a=>a.text.includes(';')).length/all.length).toFixed(4));
console.log('semicolons total', all.reduce((n,a)=>n+(a.text.match(/;/g)||[]).length,0));
console.log('colon lines', all.filter(a=>a.text.includes(':')).length, '=', (all.filter(a=>a.text.includes(':')).length/all.length).toFixed(4));
console.log('lines with BOTH ; and :', all.filter(a=>a.text.includes(';')&&a.text.includes(':')).length);
console.log('lines with NEITHER', all.filter(a=>!a.text.includes(';')&&!a.text.includes(':')).length);
console.log('comma-and chains (", and")', all.filter(a=>/, and /.test(a.text)).length);

// pool spread
let sharedOpener = 0, uniformSeg = 0, multi = 0;
for (const p of pools) { if (p.lines.length<2) continue; multi++;
  const ops = p.lines.map(opener2); if (new Set(ops).size < ops.length) sharedOpener++;
  const sc = p.lines.map(t=>seg(t).length); if (new Set(sc).size===1) uniformSeg++;
}
console.log('multi-variant pools', multi, 'sharing 2-word opener', sharedOpener, 'uniform seg count', uniformSeg, '=', (uniformSeg/multi).toFixed(3));
// within-pool word sd
const sds = pools.filter(p=>p.lines.length>1).map(p=>{const w=p.lines.map(words);const m=w.reduce((a,b)=>a+b,0)/w.length;return Math.sqrt(w.reduce((a,b)=>a+(b-m)**2,0)/w.length);});
console.log('mean within-pool word sd', (sds.reduce((a,b)=>a+b,0)/sds.length).toFixed(2));

// second-office naming: agent nouns other than the bearer role
const AGENTS = /\b(the (auditor|auditors|magistrate|magistrates|bailiff|bailiffs|sheriff|reeve|constable|constables|assessor|assessors|inspector|inspectors|notary|coroner|clerk|clerks|duty sergeant|guild|guilds|syndicate|occupier|occupiers|crown|council|assembly|chapter|hall|garrison|watch|crews|congregation|creditors|factors|partners|paymaster|patron|rival|neighbours|neighbors|tax|tithe|excise))\b/gi;
const hits = {}; let linesWithAgent=0;
for (const a of all){ const m=a.text.match(AGENTS); if(m){linesWithAgent++; for(const x of m) hits[x.toLowerCase()]=(hits[x.toLowerCase()]||0)+1;} }
console.log('lines naming a second agent noun', linesWithAgent, '/', all.length);
console.log(JSON.stringify(Object.entries(hits).sort((x,y)=>y[1]-x[1]).slice(0,25)));

// digits, em dash, questions, contractions, second person
console.log('digits', all.filter(a=>/\d/.test(a.text)).length, 'emdash', all.filter(a=>/—/.test(a.text)).length, 'questions', all.filter(a=>/\?/.test(a.text)).length, 'excl', all.filter(a=>/!/.test(a.text)).length);
console.log('contractions', all.filter(a=>/\b\w+['’](s|t|re|ll|ve|d|m)\b/.test(a.text) && !/\b\w+['’]s\b/.test(a.text)).length);
console.log('second person you/your', all.filter(a=>/\b(you|your)\b/i.test(a.text)).length);
console.log('imperative-ish openers (Watch/Listen/Look/Ask/Note)', all.filter(a=>/^(watch|listen|look|ask|note|see)\b/i.test(a.text)).length);
console.log('future indicative will/shall', all.filter(a=>/\b(will|shall)\b/i.test(a.text)).length);
console.log('  examples:', all.filter(a=>/\b(will|shall)\b/i.test(a.text)).slice(0,6).map(a=>a.text.slice(0,90)));
// proper names (capitalised mid-sentence non-sentence-initial words not in a whitelist)
const NAMEISH = /(?<=[a-z,] )([A-Z][a-z]{2,})/g;
const nm = {}; for(const a of all){ for(const m of a.text.matchAll(NAMEISH)) nm[m[1]]=(nm[m[1]]||0)+1; }
console.log('capitalised mid-sentence tokens', JSON.stringify(Object.entries(nm).sort((x,y)=>y[1]-x[1]).slice(0,20)));
// triads
const TRIAD = /\b\w+, \w+,? and \w+\b/;
console.log('triad-ish lines', all.filter(a=>/,[^,;:.]+,[^,;:.]+,? and /.test(a.text)).length);
// modality / threshold
console.log('would/could/might', all.filter(a=>/\b(would|could|might)\b/i.test(a.text)).length);
