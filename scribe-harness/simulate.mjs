#!/usr/bin/env node
/**
 * simulate.mjs — THE MODEL SEAT PLAYED BY A CLAUDE SESSION (the owner's ask, 2026-09-14 ~12:0x:
 * "take the place of the API key and test it"). Two modes, so the prompt the boundary would send
 * and the answer that comes back are both files a reader can inspect:
 *
 *   node simulate.mjs build --seed <seed> --tab <tab> [--audience dm|player] [--type town]
 *       → out/sim/<seed>/<tab>/{brief.md,turn.md,schema.json,card.json}
 *   node simulate.mjs judge --seed <seed> --tab <tab> --response <units.json>
 *       → parses the response under UnitSchema (the grammar test), runs refuteAll (the tier-0
 *         refuter) and refuteTab (the page arms), prints a verdict line per unit, writes
 *         out/sim/<seed>/<tab>/judged.json and page.md.
 *
 * It measures everything the real path measures EXCEPT tokens-by-the-API, cache reads, dollars and
 * wall-clock: those need the key. It never reads a credential.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import { UnitSchema, DOCK } from './lib/brief.mjs';
import { buildRender, parseArgs, refuteAll } from './render-town.mjs';

const { generateSettlementPipeline } = await import(`${DOCK}/src/generators/generateSettlementPipeline.js`);

const args = parseArgs(process.argv.slice(2));
const mode = String(args._[0] || 'build');
const seed = String(args.seed || 'render-town');
const tab = String(args.tab || 'defense');
const dir = resolve(`out/sim/${seed}/${tab}`);
mkdirSync(dir, { recursive: true });

const settlement = generateSettlementPipeline(
  { settType: String(args.type || 'town'), culture: 'germanic', terrainOverride: 'river', roadOverride: 'road', civOverride: 'civilized' },
  null, { seed, customContent: {} },
);
const built = buildRender({ settlement, tab, audience: args.audience === 'player' ? 'player' : 'dm' });

if (mode === 'build') {
  writeFileSync(`${dir}/brief.md`, built.brief);
  writeFileSync(`${dir}/turn.md`, built.turn);
  writeFileSync(`${dir}/card.json`, JSON.stringify(built.card, null, 1));
  writeFileSync(`${dir}/schema.json`, JSON.stringify(z.toJSONSchema(UnitSchema), null, 1));
  console.log(`${built.card.town.name} (${built.card.town.tier}) :: ${tab} :: ${built.card.pools.length} pools over ${built.blocks.join(' + ')}`);
  console.log(`brief ${built.brief.length} chars · turn ${built.turn.length} chars · ~${Math.round((built.brief.length + built.turn.length) / 4)} tokens`);
  for (const p of built.card.pools) console.log(`  - ${p.blockId} :: ${p.poolKey} · sources ${(p.faceSources || []).map((s) => s.role || s).join('/') || '(none)'} · spine: ${p.unit?.spine?.slice(0, 90) || ''}`);
  console.log(`wrote ${dir}/{brief.md,turn.md,card.json,schema.json}`);
} else if (mode === 'judge') {
  const raw = readFileSync(resolve(String(args.response)), 'utf8');
  const parsed = UnitSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    console.log('SCHEMA FAIL:', JSON.stringify(parsed.error.issues, null, 1));
    process.exit(3);
  }
  const { judged, page } = refuteAll(parsed.data.units, built.card);
  const tally = {};
  for (const row of judged) {
    tally[row.verdict] = (tally[row.verdict] || 0) + 1;
    const arm = row.findings.find((f) => f.channel === 'FAIL') || row.findings.find((f) => f.channel === 'WITHHELD');
    console.log(`${row.verdict.padEnd(9)} ${(arm ? arm.arm : '(clean)').padEnd(22)} [${row.unit.poolKey}] ${row.unit.text}`);
    if (arm) console.log(`           ↳ ${arm.reason || arm.detail || JSON.stringify(arm).slice(0, 200)}`);
  }
  const missing = built.card.pools.filter((p) => !parsed.data.units.some((u) => u.poolKey === p.poolKey)).map((p) => p.poolKey);
  const unknown = parsed.data.units.filter((u) => !built.card.pools.some((p) => p.poolKey === u.poolKey)).map((u) => u.poolKey);
  console.log(`\nverdicts ${JSON.stringify(tally)} · pools on card ${built.card.pools.length} · units returned ${parsed.data.units.length} · missing ${JSON.stringify(missing)} · unknown ${JSON.stringify(unknown)}`);
  console.log(`page arms: ${JSON.stringify(page).slice(0, 600)}`);
  writeFileSync(`${dir}/judged.json`, JSON.stringify({ judged, page, missing, unknown }, null, 1));
  writeFileSync(`${dir}/page.md`, judged.map((r) => `[${r.verdict}] ${r.unit.text}`).join('\n\n'));
  console.log(`wrote ${dir}/judged.json and page.md`);
}
