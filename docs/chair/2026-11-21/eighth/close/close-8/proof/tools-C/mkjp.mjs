// PROOF-4: a battery run "made WITH --views --strings" for WORDS-1's joined-proof / e8b-roundtrip / e13b-proof, assembled from
// CLOSE-8's battery rows (--views) and WORDS-1's twin-strings dump of the same tree and plan (the same `flat` of the born record
// and of `composePublicProse`, birthConfig(row.config), seed, customContent {}). A MEASURE. node mkjp.mjs <K>
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
const K = process.argv[2];
const P = '/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/proof';
const SP = '/tmp/claude-0/-home-user-settlement-engine/f9f37e55-dc9e-512d-9953-f1c7274d335f/scratchpad';
for (const [side, rows, strs] of [['before', `${SP}/before-${K}/rows`, `${P}/runs-${K}/strings-before`], ['after', `${P}/after-${K}/rows`, `${P}/runs-${K}/strings-join`]]) {
  const out = `${P}/jp-${K}/${side}/rows`; mkdirSync(out, { recursive: true });
  let n = 0;
  for (const f of readdirSync(rows)) {
    const r = JSON.parse(readFileSync(`${rows}/${f}`)); const s = JSON.parse(readFileSync(`${strs}/${f}`));
    writeFileSync(`${out}/${f}`, JSON.stringify({ ...r, strings: s.s })); n++;
  }
  console.log(`${side}: ${n} rows -> ${out}`);
}
