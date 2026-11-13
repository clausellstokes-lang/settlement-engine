// REVIEW-VEIL-5 — the finding sent from the W2-A review (R3): is the public prose a save ships composed from the
// OWNER's record or from the stripped one, and does the difference ever reach the text?
//   A = composePublicProse(owner)                       what lib/saves.js stamps into data.publicProse (the page prints it)
//   B = composePublicProse(publicVeiledRecordOf(owner)) the same composer over the record after the public strip
// Every rung where A and B differ is a sentence (or a count of sentences) that depends on something the strip removes.
// Run in a lane worktree: RV5_SRC=<worktree> RV5_PROBE=r3.probe.jsx RV5_OUT=<file> npx vitest run --config vitest.config.mjs
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';

const SRC = process.env.RV5_SRC; const OUT = process.env.RV5_OUT; const SEEDS = Number(process.env.RV5_SEEDS || 20);
const SHARD = (process.env.RV5_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
function diff(a, b, path, out) {
  if (Array.isArray(a) && Array.isArray(b)) { const n = Math.max(a.length, b.length); if (a.length !== b.length) out.push([`${path}.length`, a.length, b.length]); for (let i = 0; i < n; i += 1) diff(a[i], b[i], `${path}[${i}]`, out); return; }
  if (isRec(a) && isRec(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], path ? `${path}.${k}` : k, out); return; }
  if (JSON.stringify(a) !== JSON.stringify(b)) out.push([path, a, b]);
}

it('R3: owner-composed against stripped-composed public prose', async () => {
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const { composePublicProse } = await import(`${M}/components/new/publicProseCompose.js`);
  const safe = await import(`${M}/domain/display/publicSafe.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = { towns: 0, withHiddenPower: 0, divergentTowns: 0, bySite: {}, rows: [] };
  let i = 0;
  for (let k = 0; k < SEEDS; k += 1) for (const size of ['village', 'town', 'city', 'metropolis']) for (const stress of ['infiltrated', null]) {
    i += 1; if (i % SHARD[1] !== SHARD[0]) continue;
    const seed = `rv5-r3-${size}-${stress}-${k}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let s; try { s = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }); } catch { continue; }
    out.towns += 1;
    const stripped = safe.publicVeiledRecordOf(s);
    const hiddenPowers = (s.powerStructure?.factions || []).filter((f) => !(stripped.powerStructure?.factions || []).some((g) => (g.faction || g.name) === (f.faction || f.name))).map((f) => f.faction || f.name);
    if (hiddenPowers.length) out.withHiddenPower += 1;
    const A = composePublicProse(s); const B = composePublicProse(stripped);
    const d = []; diff(A?.blocks, B?.blocks, '', d);
    if (!d.length) continue;
    out.divergentTowns += 1;
    for (const [path, a, b] of d) { const site = path.replace(/\[\d+\]/g, '[]'); out.bySite[site] = (out.bySite[site] || 0) + 1; }
    // does the public page's own projection of the saved row print the owner-composed text?
    const page = safe.toPublicSafe({ ...s, publicProse: A }, {});
    const d2 = []; diff(page?.publicProse?.blocks, A?.blocks, '', d2);
    out.rows.push({ seed, hiddenPowers, hiddenNamesInOwnerText: hiddenPowers.filter((n) => JSON.stringify(A).includes(n)),
      diverge: d.slice(0, 8).map(([p, a, b]) => ({ path: p, owner: a, stripped: b })), pageDiffersFromOwnerComposed: d2.length });
  }
  writeFileSync(OUT, JSON.stringify(out, null, 1));
}, 7_200_000);
