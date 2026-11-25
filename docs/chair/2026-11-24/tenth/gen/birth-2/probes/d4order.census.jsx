/** @vitest-environment node */
// D4 probe (BIRTH-2): per birth, the stored power order against power order (a stable sort, strongest first), the rows out of
// place, and for each reader that takes strongest-first by position what it would pick on the stored order and on the sorted:
// first (Summary's "Power rests with", the Power tile, genPressureDetail's and genSettSummary's topFaction, history's
// dominantFaction), top three (Summary's copy text), top five (the bar, aiLayer's factions), second (history's altFaction),
// and the seat's holder (holderOfSeat.js :: holderOf, the owner's read) against the governing row. Changes nothing.
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const T = process.env.D4_TREE || '/home/user/settlement-engine';
test('D4 order', async () => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  const { holderOf } = await import(/* @vite-ignore */ R + 'domain/seat/holderOfSeat.js');
  await loadGenerationLawPayloads();
  const plan = JSON.parse(readFileSync(process.env.D4_PLAN, 'utf8')).filter((_, i) => i % 150 < Number(process.env.D4_N || 150));
  const out = [];
  for (const { seed, size, config } of plan) {
    const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const recordHash = createHash('sha256').update(JSON.stringify(s)).digest('hex');
    const fs = (s.powerStructure?.factions || []).map((f) => ({ name: String(f.faction), power: Number(f.power) || 0, gov: f.isGoverning === true }));
    const sorted = fs.map((f, i) => ({ ...f, i })).sort((a, b) => b.power - a.power || a.i - b.i);
    const names = (xs, n) => xs.slice(0, n).map((f) => f.name).join(' | ');
    const outOfPlace = fs.map((f, i) => (sorted[i].name !== f.name ? i : -1)).filter((i) => i >= 0);
    let holder = null; try { holder = holderOf(s, { audience: 'owner' })?.holder?.faction ?? null; } catch (e) { holder = `ERR ${String(e?.message || e).slice(0, 60)}`; }
    const gov = fs.find((f) => f.gov)?.name ?? null;
    out.push(JSON.stringify({ seed, size, recordHash, n: fs.length, outOfPlace, stored: fs.map((f) => `${f.name}=${f.power}`),
      first: [names(fs, 1), names(sorted, 1)], top3: [names(fs, 3), names(sorted, 3)], top5: [names(fs, 5), names(sorted, 5)], top8: [names(fs, 8), names(sorted, 8)],
      second: [fs[1]?.name ?? null, sorted[1]?.name ?? null], gov, holder, pressure: s.pressureSentence ?? null }));
  }
  writeFileSync(process.env.D4_OUT, out.join('\n') + '\n');
}, 3600000);
