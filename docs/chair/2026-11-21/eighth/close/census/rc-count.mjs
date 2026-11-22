// For the veil (the chair, 15:29): over the 900 visitor births lit, recentConflict by writer, and the taker's kind.
import { readFileSync } from 'node:fs';
const T = process.argv[2]; const plan = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
await loadGenerationLawPayloads();
const TRANSFER = [/^(.+?) is the power behind the /, /^(.+?) overthrew the .+ and reshaped the government as a /, /^Power passed to (.+?) by [^;]+; the /, /^(.+?) seized the .+ and left the government as it stood\.$/, /^.+ held the .+ until (.+?) took it\.$/];
const out = {}; const examples = [];
for (const row of plan) {
  const s = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
  const ps = s.powerStructure || {}; const rc = typeof ps.recentConflict === 'string' ? ps.recentConflict.trim() : '';
  const o = (out[row.size] ||= { births: 0, none: 0, baseline: 0, transfer: 0, criminalTaker: 0, previousGovernments: 0 });
  o.births += 1; if ((ps.previousGovernments || []).length) o.previousGovernments += 1;
  if (!rc) { o.none += 1; continue; }
  let taker = null; for (const re of TRANSFER) { const m = rc.match(re); if (m) { taker = m[1]; break; } }
  if (!taker) { o.baseline += 1; const named = (ps.factions || []).filter((x) => (x.category === 'criminal' || /thie|smuggl|crimin|underworld|syndicate|black market/i.test(String(x.faction))) && rc.includes(String(x.faction))); if (named.length) { o.baselineNamesCriminal = (o.baselineNamesCriminal || 0) + 1; if (examples.length < 6) examples.push(`${row.seed}: ${rc.slice(0, 160)} [names ${named.map((x) => x.faction).join(', ')}]`); } continue; }
  o.transfer += 1;
  const f = (ps.factions || []).find((x) => x.faction === taker || x.name === taker);
  const crim = f && (f.category === 'criminal' || /thie|smuggl|cult|crimin|clandest|underworld|syndicate|black market/i.test(`${f.faction} ${f.category}`));
  if (crim) o.criminalTaker += 1;
  if (examples.length < 8) examples.push(`${row.seed}: ${rc.slice(0, 140)} [taker category ${f?.category ?? '?'}]`);
}
console.log(JSON.stringify(out)); for (const e of examples) console.log(e);
