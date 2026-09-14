#!/usr/bin/env node
/**
 * lib/pin.mjs — THE TWO TRANSCRIPTIONS CANNOT DRIFT (W3a car 1).
 *
 *   node lib/pin.mjs
 *
 * The VOICE exists twice on purpose: once in `rewrite/rewrite-block-v3.workflow.js`, which is the
 * law the hand corpus was cut under, and once in `supabase/functions/scribe-render/voice.ts`,
 * because an edge function cannot read the kit. Two copies of one law is the estate's oldest
 * failure shape, and the product's own suite can only pin its copy's LENGTH — it has no way to
 * reach the workflow. This is the reader that can reach both.
 *
 * It also checks the exemplar pack's one remaining seam: the product module `exemplars.ts` is
 * generated from the dock markdown, and the harness reads that same markdown, so the two are
 * equal by construction — asserted here rather than assumed, because "by construction" is exactly
 * the claim a generator drifting from its source makes right up until it does not.
 *
 * Exit 0 when both hold, 1 otherwise, with the two lengths printed either way.
 */
import { readFileSync } from 'node:fs';
import { voiceText, productVoiceText, exemplarPack, PATHS } from './brief.mjs';

const workflowVoice = voiceText();
const productVoice = productVoiceText();
const pack = exemplarPack();

const ts = readFileSync(`${PATHS.VOICE_TS}`, 'utf8');
const pinned = Number((/SCRIBE_VOICE_CHARS = (\d+)/.exec(ts) || [])[1] ?? -1);

const exemplarsTs = readFileSync(
  PATHS.VOICE_TS.replace('voice.ts', 'exemplars.ts'),
  'utf8',
);
const packPinned = Number((/SCRIBE_EXEMPLARS_CHARS = (\d+)/.exec(exemplarsTs) || [])[1] ?? -1);
const packInModule = JSON.parse(`"${(/export const SCRIBE_EXEMPLARS = "([\s\S]*?)";\n/.exec(exemplarsTs) || [])[1] ?? ''}"`);

const rows = [
  ['the workflow VOICE', workflowVoice.length],
  ['the product VOICE (voice.ts)', productVoice.length],
  ['voice.ts SCRIBE_VOICE_CHARS', pinned],
  ['the dock exemplar pack (md)', pack.length],
  ['exemplars.ts SCRIBE_EXEMPLARS_CHARS', packPinned],
  ['exemplars.ts SCRIBE_EXEMPLARS', packInModule.length],
];
for (const [name, n] of rows) console.log(`${String(n).padStart(8)}  ${name}`);

const failures = [];
if (workflowVoice !== productVoice) {
  failures.push('the workflow VOICE and voice.ts are NOT the same string: the corpus and the Scribe are written to two laws');
}
if (pinned !== productVoice.length) {
  failures.push(`voice.ts pins ${pinned} chars and holds ${productVoice.length}`);
}
if (packInModule !== pack) {
  failures.push('exemplars.ts is not the dock markdown: run `node scripts/scribe-exemplars.mjs` in the dock');
}
if (packPinned !== pack.length) {
  failures.push(`exemplars.ts pins ${packPinned} chars and the markdown holds ${pack.length}`);
}

if (failures.length) {
  for (const f of failures) console.error(`PIN FAILED: ${f}`);
  process.exit(1);
}
console.log('pin ok: one VOICE, one exemplar pack, both transcriptions byte-equal.');
