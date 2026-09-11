import { loadCrierVoice } from '../skepINSTR2/tests/helpers/dossierCorpus.js';
const rows = await loadCrierVoice();
console.log('R5 rows (authored lines):', rows.length);
const texts = rows.map(r=>r.text);
console.log('distinct lines:', new Set(texts).size);
const sents=[];
for (const t of texts) for (const s of String(t).split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(Boolean)) sents.push(s);
console.log('sentences:', sents.length, 'distinct:', new Set(sents).size);
const seen=new Map(); const dups=[];
for (const t of texts){ if(seen.has(t)) dups.push(t); seen.set(t,1); }
console.log('duplicate lines:', dups.length);
