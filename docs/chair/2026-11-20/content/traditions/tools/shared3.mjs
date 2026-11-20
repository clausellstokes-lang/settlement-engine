// (5) what a shared page shows, for three of the twenty-four: the owner's text; the reader's text for the SAME rite
// composed from the party link's served document; and what the party link prints today (genesis over the served
// document, which has no _seed: a different set).
import { readFileSync, writeFileSync } from 'node:fs';
import { deriveFoundingTraditions } from '../../../../../../src/domain/traditions/genesis.js';
import { toPublicSafe } from '../../../../../../src/domain/display/publicSafe.js';
import { projectShareVeil, writeShareVeil } from '../../../../../../src/domain/display/galleryVeil.js';
import { describeTradition } from './describe.mjs';
const [, , poolFile, outFile, ...picks] = process.argv; // picks: seed|recId
const towns = new Map(readFileSync(poolFile, 'utf8').trim().split('\n').map((l) => { const t = JSON.parse(l); return [t._seed, t]; }));
const out = [];
for (const pick of picks) {
  const [seed, recId] = pick.split('|');
  const t = towns.get(seed); const served = projectShareVeil(toPublicSafe(t), writeShareVeil(null, []));
  const rec = deriveFoundingTraditions(t).find((r) => r.id === recId);
  out.push(`### ${t.name} — ${rec.name}`);
  out.push(`OWNER'S PAGE:   ${describeTradition(rec, t, { audience: 'owner' }).text}`);
  out.push(`PARTY LINK, the same rite from the served document: ${describeTradition(rec, served, { audience: 'reader' }).text}`);
  out.push('PARTY LINK TODAY (genesis over the served document, no _seed):');
  for (const r of deriveFoundingTraditions(served)) out.push(`  - ${r.name}: ${describeTradition(r, served, { audience: 'reader' })?.text}`);
  out.push('');
}
writeFileSync(outFile, `${out.join('\n')}\n`); console.log(out.join('\n'));
