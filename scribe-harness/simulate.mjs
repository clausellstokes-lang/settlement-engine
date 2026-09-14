#!/usr/bin/env node
/**
 * simulate.mjs — THE MODEL SEAT PLAYED BY A CLAUDE SESSION (the owner's ask, 2026-09-14 ~12:0x:
 * "take the place of the API key and test it"). Modes, so the prompt the boundary would send and
 * the answer that comes back are both files a reader can inspect:
 *
 *   node simulate.mjs build --seed <seed> --tab <tab> [--audience dm|player] [--type town]
 *       → out/sim/<seed>/<tab>/{brief.md,town.md,turn.md,schema.json,card.json}
 *   node simulate.mjs judge --seed <seed> --tab <tab> --response <units.json>
 *       → parses the response under SCRIBE_OUTPUT_SCHEMA's own parser, runs the ONE judge
 *         (`judgeUnits` + the dock's `refuteUnit`) and `refuteTab` (the page arms), prints a
 *         verdict line per unit, writes judged.json and page.md.
 *
 * ⭐ SINCE W3a IT BUILDS THE PRODUCT'S PROMPT AND NOT A SECOND ONE. The three files below are the
 * bytes `scribe-render/index.ts` sends: two cached system blocks and one volatile user turn, from
 * `src/domain/prose/scribeBrief.js` in the dock. The previous cut of this script wrote a brief
 * only this harness could produce, which is why the 2026-09-14 simulation measured a prompt the
 * product has never sent.
 *
 * It measures everything the real path measures EXCEPT tokens-by-the-API, cache reads, dollars and
 * wall-clock: those need the key. It never reads a credential.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DOCK, SCRIBE_OUTPUT_SCHEMA, parseScribeUnits } from './lib/brief.mjs';
import { buildRender, judgeAll, parseArgs } from './render-town.mjs';

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
  writeFileSync(`${dir}/town.md`, built.townBlock);
  writeFileSync(`${dir}/turn.md`, built.turn);
  writeFileSync(`${dir}/card.json`, JSON.stringify(built.card, null, 1));
  writeFileSync(`${dir}/schema.json`, JSON.stringify(SCRIBE_OUTPUT_SCHEMA, null, 1));
  const chars = built.brief.length + built.townBlock.length + built.turn.length;
  console.log(`${built.card.town.name} (${built.card.town.tier}) :: ${tab} :: ${built.card.pools.length} pools over ${built.blocks.join(' + ')}`);
  console.log(`brief ${built.brief.length} chars (cached) · town ${built.townBlock.length} chars (cached) · turn ${built.turn.length} chars (volatile) · ~${Math.round(chars / 4)} tokens`);
  for (const p of built.card.pools) console.log(`  - ${p.blockId} :: ${p.poolKey} · order ${p.unit?.order?.id || '(none)'} · sources ${(p.faceSources || []).join('/') || '(none)'} · spine: ${p.unit?.spine?.slice(0, 80) || ''}`);
  console.log(`wrote ${dir}/{brief.md,town.md,turn.md,card.json,schema.json}`);
} else if (mode === 'judge') {
  const raw = readFileSync(resolve(String(args.response)), 'utf8');
  const parsed = parseScribeUnits(raw);
  if (!parsed.ok) {
    console.log(`SCHEMA FAIL: ${parsed.reason}`);
    process.exit(3);
  }
  const judged = judgeAll(parsed.units, built.card);
  const tally = {};
  for (const row of judged.rows) {
    const verdict = row.verdict?.verdict ?? '?';
    tally[verdict] = (tally[verdict] || 0) + 1;
    const arm = row.verdict?.findings?.find((f) => f.channel === 'FAIL')
      || row.verdict?.findings?.find((f) => f.channel === 'WITHHELD');
    console.log(`${String(verdict).padEnd(9)} ${(arm ? arm.arm : '(clean)').padEnd(22)} [${row.unit.poolKey}] ${row.unit.spine}`);
    if (arm) console.log(`           ↳ ${arm.subject}: ${arm.value} — ${arm.description}`);
  }
  const missing = built.card.pools.filter((p) => !parsed.units.some((u) => u.poolKey === p.poolKey)).map((p) => p.poolKey);
  const unknown = parsed.units.filter((u) => !built.card.pools.some((p) => p.poolKey === u.poolKey)).map((u) => u.poolKey);
  console.log(`\nverdicts ${JSON.stringify(tally)} · kept ${judged.kept.length} · dropped ${judged.dropped} · pools on card ${built.card.pools.length} · units returned ${parsed.units.length} · missing ${JSON.stringify(missing)} · unknown ${JSON.stringify(unknown)}`);
  console.log(`page arms: ${JSON.stringify(judged.page).slice(0, 600)}`);
  writeFileSync(`${dir}/judged.json`, JSON.stringify({
    verdicts: judged.verdicts, kept: judged.kept, dropped: judged.dropped, page: judged.page, missing, unknown,
  }, null, 1));
  writeFileSync(`${dir}/page.md`, judged.rows.map((r) => `[${r.verdict?.verdict ?? '?'}] ${[r.unit.spine, ...r.unit.faces].join(' ')}`).join('\n\n'));
  console.log(`wrote ${dir}/judged.json and page.md`);
}
