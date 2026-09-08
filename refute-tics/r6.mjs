import { readFileSync } from 'node:fs';
import { segments, words } from './metrics.mjs';
const corpus = JSON.parse(readFileSync('corpus.json','utf8'));
const R6 = corpus.filter(r=>r.register==='R6');
console.log('R6 variants:', R6.length, ' files:', new Set(R6.map(r=>r.file)).size);
let segs=[];
for (const r of R6) for (const s of segments(r.text)) segs.push({s, file:r.file, text:r.text});
console.log('R6 segments:', segs.length);
const opener = segs.filter(x=>/^(There|It) (is|was|were|are)\b/.test(x.s));
console.log('thereIsOpener segments (metric definition):', opener.length);
const tally={};
for (const x of opener) { const k=x.s.split(/\s+/).slice(0,3).join(' ').replace(/[^\w\s]/g,''); tally[k]=(tally[k]||0)+1; }
console.log('opener first-3-words tally:'); Object.entries(tally).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log('   ',String(v).padStart(4),k));
const pubOrKnown = opener.filter(x=>/^It is (public|known)\b/.test(x.s));
console.log('=> "It is public" OR "It is known" openers:', pubOrKnown.length);
console.log('   of which It is public:', opener.filter(x=>/^It is public\b/.test(x.s)).length);
console.log('   of which It is known :', opener.filter(x=>/^It is known\b/.test(x.s)).length);
// variant-level opener (first segment of variant)
const varOpen = R6.filter(r=>/^(There|It) (is|was|were|are)\b/.test(r.text.trim()));
console.log('VARIANT-level There/It-is openers:', varOpen.length, 'of', R6.length);
console.log('VARIANT-level It is public/known openers:', R6.filter(r=>/^It is (public|known)\b/.test(r.text.trim())).length);
// short sentences
const lens = segs.map(x=>({n:words(x.s).length, s:x.s, file:x.file}));
const under8 = lens.filter(x=>x.n<8);
console.log('segments under 8 words:', under8.length, ' share', (under8.length/segs.length).toFixed(4));
under8.forEach(x=>console.log('   ('+x.n+'w) '+x.file+' :: '+x.s));
const sorted = lens.map(x=>x.n).sort((a,b)=>a-b);
const pct=(a,p)=>a[Math.floor(p*(a.length-1))];
console.log('min:', sorted[0], ' p10:', pct(sorted,0.1), ' p50:', pct(sorted,0.5), ' p90:', pct(sorted,0.9), ' max:', sorted[sorted.length-1]);
console.log('under 12 words:', sorted.filter(x=>x<12).length, ' under 15:', sorted.filter(x=>x<15).length);
