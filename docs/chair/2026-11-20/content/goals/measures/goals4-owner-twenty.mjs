// GOALS-4 (2026-11-20): FOR THE OWNER, twenty wants of one city, before and after the wants' tranche.
// usage: node goals4-owner-twenty.mjs <before tree> <after tree> <seed> <out.txt>
// Each tree generates the same city from the same seed. The first twenty cards that hold a want are printed by name and
// role, their short want BEFORE and AFTER. A want marked "=" is unchanged.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [, , BEFORE, AFTER, seed = 'hxd-city-0', out] = process.argv;
/** @param {string} L */
async function cityOf(L) {
  const imp = (p) => import(pathToFileURL(path.join(L, p)).href);
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
  await loadGenerationLawPayloads();
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed, customContent: {} });
  return { name: t.name, cards: (t.npcs || []).map((c) => ({ id: String(c.id), name: c.name, role: c.role ?? c.title ?? '', short: c.goal?.short ?? null, long: c.goal?.long ?? null })) };
}
const before = await cityOf(BEFORE);
const after = await cityOf(AFTER);
const was = new Map(before.cards.map((c) => [c.id, c]));
const rows = after.cards.filter((c) => c.short).slice(0, 20);
const lines = [
  `TWENTY WANTS OF ONE CITY, BEFORE AND AFTER THE WANTS' TRANCHE (GOALS-4, 2026-11-20)`,
  `The city: ${after.name} (seed ${seed}). The same seed in both trees; the cards are the same people.`,
  `BEFORE is the working line (062504aa8). AFTER is the GOALS-4 lane with the 380 new wants and the tie cure.`,
  `Each person shows the short want ("Wants…") the page prints. "(unchanged)" means the line did not move.`,
  '',
];
rows.forEach((c, k) => {
  const b = was.get(c.id);
  lines.push(`${k + 1}. ${c.name}${c.role ? `, ${c.role}` : ''}`);
  lines.push(`   BEFORE: ${b?.short ?? '(no want)'}`);
  lines.push(`   AFTER:  ${c.short}${b?.short === c.short ? '   (unchanged)' : ''}`);
  lines.push('');
});
const changed = rows.filter((c) => was.get(c.id)?.short !== c.short).length;
lines.push(`${changed} of these 20 wants changed. Same people, same city; only the wording drawn for them moved.`);
fs.writeFileSync(out, `${lines.join('\n')}\n`);
console.log(`wrote ${out}: ${changed} of 20 changed`);
