// The owner's stop condition 2 (the seventh handoff, 20:45 UTC 2026-11-20): calm places whose seat reads Contested or
// Critical with no cause on the page. calm = !t.stress; risk = rulingPowerCoup.js :: coupRiskLabel(coupContenders(t));
// "cause on the page" = the place's rendered text (the census's --text file) names the first challenger.
// usage: node stop2.mjs <tree> <plan.json> <run dir>
import { readFileSync, existsSync } from 'node:fs';
const [T, P, R] = process.argv.slice(2); const plan = JSON.parse(readFileSync(P, 'utf8'));
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { coupContenders, coupRiskLabel } = await import(`${T}/src/domain/rulingPowerCoup.js`);
await loadGenerationLawPayloads();
const out = {}; const listed = [];
for (const row of plan) {
  const s = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
  const calm = !s.stress || (Array.isArray(s.stress) && s.stress.length === 0);
  const c = coupContenders(s); const risk = String(coupRiskLabel(c));
  const contested = risk === 'Contested' || risk.startsWith('Critical');
  const o = (out[row.size] ||= { births: 0, calm: 0, calmContested: 0, calmContestedNoCause: 0, textMissing: 0 });
  o.births += 1; if (calm) o.calm += 1;
  if (!(calm && contested)) continue;
  o.calmContested += 1;
  const first = (c.challengers || [])[0]; const name = first?.name || first?.faction || '';
  const f = `${R}/text/${row.seed}.txt`;
  if (!existsSync(f)) { o.textMissing += 1; continue; }
  const text = readFileSync(f, 'utf8');
  if (!name || !text.includes(name)) { o.calmContestedNoCause += 1; listed.push(`${row.seed}\t${risk}\tfirst challenger: ${name || '(none)'}`); }
}
for (const [k, v] of Object.entries(out)) console.log(k, JSON.stringify(v));
for (const l of listed) console.log(l);
