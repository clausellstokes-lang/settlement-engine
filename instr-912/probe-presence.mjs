import { readFileSync, existsSync } from 'node:fs';
import { presenceOf } from '../laneINSTR/src/domain/prose/presenceMeasure.js';
import * as C from '../laneINSTR/tests/helpers/dossierCorpus.js';
const K='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/primary';
const row=(l,p)=>`  ${l.padEnd(28)} sensory/100w ${String(p.sensoryNounsPerHundredWords).padStart(6)} · textured ${(p.texturedParagraphShare*100).toFixed(0).padStart(3)}% · entropy ${p.senseSpreadEntropy.toFixed(2)} bits · shares ${Object.entries(p.senseShares).map(([k,v])=>k[0]+':'+(v*100).toFixed(0)).join(' ')}`;
console.log('THE ESTATE, per register:');
const regs = [
  ['R1 dossier state', (await C.loadStateLeaves()).map(e=>e.text)],
  ['R2 causal join',   (await C.loadCausalLeaf()).map(e=>e.text)],
  ['R5 crier voice',   (await C.loadCrierVoice()).map(e=>e.text)],
  ['R4b disclosure',   (await C.loadHeraldDisclosure()).map(e=>e.text)],
  ['R6 npc ladder',    (await C.loadNpcLadder()).map(e=>e.text)],
  ['R7 gazetteer',     (await C.loadInstitutionGazetteer()).map(e=>e.text)],
  ['chronicle R12',    (await C.loadChronicle()).map(e=>e.text)],
  ['D-d dm hooks',     (await C.loadDmHooks()).map(e=>e.text)],
  ['R9 chrome copy',   (await C.loadChromeCopy()).map(e=>e.text)],
];
for (const [l,texts] of regs) console.log(row(l, presenceOf(texts)));
console.log('\nTHE FOURTEEN EXEMPLAR FINGERPRINTS — the re-run needs RAW TEXT:');
const LEAF=['dnd-flavor','dnd-rules-srd52','dnd-rules','leguin-fiction','leguin-nonfiction-spoken','leguin-nonfiction-written','martin-chronicle','martin-narrative','tolkien-plain','tolkien-elevated'];
const UNION=['leguin-all','leguin-nonfiction','martin','tolkien-all'];
let have=0, miss=[];
for (const l of [...LEAF,...UNION]) {
  const d=JSON.parse(readFileSync(`${K}/${l}.fingerprint.json`,'utf8'));
  const files=d.files.map(p=>`${K}/raw/${p.split('/').pop()}`).filter(existsSync);
  if (!files.length) { miss.push(l); continue; }
  have++;
  const text=files.map(f=>readFileSync(f,'utf8')).join('\n');
  const paras=text.split(/\n\s*\n/).map(p=>p.replace(/\s+/g,' ').trim()).filter(p=>p.length>20);
  console.log(row(l, presenceOf(paras)));
}
console.log(`\n  re-run EXECUTED on ${have} of 14; NOT-EXECUTABLE on ${miss.length}: ${miss.join(', ')}`);
