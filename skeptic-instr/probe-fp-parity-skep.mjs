// Cross-check: the repo's proseFingerprint against the kit's fingerprint.mjs, same input.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fingerprint, RATE_METRICS } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/src/domain/prose/proseFingerprint.js';
const K='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research';
const file = process.argv[2];
const text = readFileSync(file,'utf8');
const paras = text.split(/\n\s*\n/).map(p=>p.replace(/\s+/g,' ').trim()).filter(p=>p.length>20);
const mine = fingerprint(paras);
process.env.FP_OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skeptic-instr/kit-fp-skep.json';
execFileSync('node',[K+'/fingerprint.mjs','parity',file],{cwd:'/tmp',stdio:'ignore',env:{...process.env,FP_OUT:'/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skeptic-instr/kit-fp-skep.json'}});
const kit = JSON.parse(readFileSync('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skeptic-instr/kit-fp-skep.json','utf8'));
const at = (o,p)=>p.split('.').reduce((a,k)=>a?.[k],o);
console.log(`sentences mine=${mine.sentences} kit=${kit.sentences} | paragraphs mine=${mine.paragraphs} kit=${kit.paragraphs}`);
let diffs=0;
for (const m of RATE_METRICS) {
  const a=mine.metrics[m], b=at(kit,m);
  if (a!==b) { diffs++; console.log(`  DIFF ${m}: mine=${a} kit=${b}`); }
}
console.log(diffs===0 ? 'PARITY: all 21 rate metrics identical' : `PARITY BROKEN on ${diffs} of ${RATE_METRICS.length}`);
