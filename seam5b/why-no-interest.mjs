import { writeFileSync } from 'node:fs';
import { rateGrid } from '../laneSEAM/scripts/prose-rate-corpus.mjs';
import { generateSettlementPipeline } from '../laneSEAM/src/generators/generateSettlementPipeline.js';
import { compromisedSecurityInstitutions, npcHomeInstitution, SECURITY_INSTITUTION_RE } from '../laneSEAM/src/domain/corruption.js';
let towns = 0; let anyCompromised = 0; let corruptNpcs = 0; let homed = 0; let homedToSecurity = 0;
const homes = new Map();
for (const spec of rateGrid()) {
  let s;
  try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { continue; }
  towns += 1;
  const c = compromisedSecurityInstitutions(s);
  if (c.covert.length || c.revealed.length) anyCompromised += 1;
  const sec = (s.institutions || []).filter((i) => SECURITY_INSTITUTION_RE.test(String(i?.name || '')));
  for (const npc of s.npcs || []) {
    if (npc?.corrupt !== true || npc?.ousted) continue;
    corruptNpcs += 1;
    const home = npcHomeInstitution(npc);
    if (home) { homed += 1; homes.set(String(home), (homes.get(String(home)) || 0) + 1); }
    if (home && sec.some((i) => String(i.name).toLowerCase().includes(String(home).toLowerCase())
      || String(home).toLowerCase().includes(String(i.name).toLowerCase()))) homedToSecurity += 1;
  }
}
const out = [
  `towns ${towns}`,
  `towns where compromisedSecurityInstitutions() answers anything: ${anyCompromised}`,
  `corrupt, un-ousted NPCs over the corpus: ${corruptNpcs} · of them carrying a home institution field: ${homed} · homed to a SECURITY institution: ${homedToSecurity}`,
  `the home values those NPCs carry, most common first:`,
  ...[...homes].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, n]) => `  ${String(n).padStart(4)}  ${k}`),
].join('\n');
console.log(out);
writeFileSync(process.argv[2], `${out}\n`);
