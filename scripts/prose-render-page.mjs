#!/usr/bin/env node
/**
 * scripts/prose-render-page.mjs — THE RENDERED DEFENSE PAGE PER POOL, ON TOWNS WHERE THE KEY
 * FIRES, WITHOUT A BROWSER (brief ADDENDUM 18 ruling 6: "a rendered page per pool on two or
 * three towns (one world-run), built on the 768-town RATE render, is the refuter's primary
 * evidence").
 *
 *   node scripts/prose-render-page.mjs <BLOCK> '<pool key>' [--towns 2] [--world-run --years 3]
 *       [--max-scan 768] [--region rr-fresh-full]
 *
 * Finds towns in the rate grid (`scripts/prose-rate-corpus.mjs` rateGrid, scanned in order) on
 * which this pool's key fires, and renders each town's Defense tab to TEXT in page order: the
 * composed lines with their pool, variant and face index; the machine assess + badge + funding
 * note per readiness row; the safety label and safetyDesc; the guard paragraph; the other
 * defense blocks' drawn lines through their mounts. With `--world-run` one reader-region town
 * (the 4-save region of `scripts/review/readerCorpus.mjs`, the first save on which the key fires
 * at year 0, else the first save) is advanced N years through the reader campaign and rendered
 * again, and every line that MOVED, APPEARED or VANISHED between year 0 and year N is marked.
 *
 * Output to stdout and to `.packets/page-<pool dir>.txt`. Deterministic. The grid scan is under
 * a minute for a key that fires early; the world-run is ~3 s per year for four towns.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { ROOT } from './lib/prose-mark-fields.mjs';
import { renderDefensePage, pageText, findTownsWhereKeyFires, poolDir, defensePoolsFired } from './lib/prose-render-defense-page.mjs';

/** @param {string[]} argv @param {string} flag @param {string|null} dflt */
const opt = (argv, flag, dflt) => { const i = argv.indexOf(flag); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : dflt; };

/**
 * Line-by-line comparison of two renders, keyed by (section, kind, label|pool) with a running
 * index so a repeated key compares in order.
 * @param {import('./lib/prose-render-defense-page.mjs').PageLine[]} a
 * @param {import('./lib/prose-render-defense-page.mjs').PageLine[]} b
 * @returns {string[]}
 */
export function diffPages(a, b) {
  // A composed line is keyed by its BLOCK and its ordinal within the block, never by its pool:
  // a pool that changes between the years (capture none -> capture) is a MOVED line, not a
  // vanished one and an appeared one.
  const keyOf = (l, seen) => {
    const base = `${l.section}|${l.kind}|${l.kind === 'composed' ? l.block : (l.label || '')}`;
    const n = (seen.get(base) || 0) + 1; seen.set(base, n);
    return `${base}#${n}`;
  };
  const A = new Map(); const B = new Map();
  const sa = new Map(); const sb = new Map();
  for (const l of a) A.set(keyOf(l, sa), l);
  for (const l of b) B.set(keyOf(l, sb), l);
  const out = [];
  for (const [k, l] of B) {
    const before = A.get(k);
    const tag = l.kind === 'composed' ? `[composed ${l.block} · ${l.pool} · v${l.vid ?? '?'} f${l.face ?? '?'}]` : `[${l.kind} ${l.label || ''}]`;
    const poolOf = (x) => (x.kind === 'composed' ? `[${x.pool} · v${x.vid ?? '?'} f${x.face ?? '?'}] ` : '');
    if (!before) out.push(`  + APPEARED ${tag} ${l.text}`);
    else if (before.text !== l.text || before.pool !== l.pool) { out.push(`  ~ MOVED    ${tag}`); out.push(`      year 0: ${poolOf(before)}${before.text}`); out.push(`      year N: ${poolOf(l)}${l.text}`); }
    else out.push(`    same     ${tag} ${l.text.slice(0, 90)}${l.text.length > 90 ? '…' : ''}`);
  }
  for (const [k, l] of A) if (!B.has(k)) out.push(`  - VANISHED [${l.kind} ${l.label || l.pool || ''}] ${l.text}`);
  return out;
}

async function main() {
  const argv = process.argv.slice(2);
  const [block, pool] = argv.filter((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').match(/^--(towns|years|max-scan|region)$/));
  if (!block || !pool) {
    console.error("usage: node scripts/prose-render-page.mjs <BLOCK> '<pool key>' [--towns 2] [--world-run --years 3] [--max-scan 768] [--region rr-fresh-full]");
    process.exit(2);
  }
  const towns = Number(opt(argv, '--towns', '2'));
  const years = Number(opt(argv, '--years', '3'));
  const maxScan = Number(opt(argv, '--max-scan', '768'));
  const worldRun = argv.includes('--world-run');
  const out = [];
  const say = (line = '') => { out.push(line); console.log(line); };

  say(`RENDERED PAGE — ${block} · \`${pool}\` (audience dm; page order of DefenseTab.jsx)`);
  const found = findTownsWhereKeyFires(block, pool, towns, { maxTowns: maxScan });
  say(`grid towns on which the key fires: ${found.length} found (scan cap ${maxScan})`);
  for (const { spec, settlement } of found) {
    say('');
    say(`════ GRID TOWN cell ${spec.cell} seed ${spec.seed} · ${spec.config.settType} · ${spec.config.culture} · threat ${spec.config.monsterThreat} · route ${spec.config.tradeRouteAccess} ════`);
    say(pageText(renderDefensePage(settlement)));
  }

  if (worldRun) {
    const reader = await import('./review/readerCorpus.mjs');
    const rowId = opt(argv, '--region', 'rr-fresh-full');
    const row = reader.READER_CORPUS_ROSTER.find((r) => r.campaignId === rowId);
    if (!row) throw new Error(`no reader roster row ${rowId}`);
    const { campaign, saves } = reader.composeReaderRegion(row);
    const firing = saves.filter((s) => defensePoolsFired(s.settlement).some((f) => f.block === block && f.pool === pool));
    const pick = firing[0] || saves[0];
    say('');
    say(`════ WORLD-RUN region ${row.campaignId} (${saves.map((s) => `${s.id}=${s.settlement.tier}`).join(', ')}) · years ${years} · town ${pick.id} ${firing.length ? '(the key fires at year 0)' : '(THE KEY FIRES ON NO SAVE OF THIS REGION AT YEAR 0 — the first save is rendered so the moving lines are still measured)'} ════`);
    const before = renderDefensePage(pick.settlement);
    say(`── year 0 ──`);
    say(pageText(before));
    const advanced = await reader.advanceReaderCampaign({ campaign, saves, years, seed: String(row.seed) });
    const after = advanced.saves.find((s) => s.id === pick.id);
    const afterLines = renderDefensePage(after.settlement);
    say(`── year ${years}: what MOVED (~), APPEARED (+), VANISHED (-) ──`);
    for (const l of diffPages(before, afterLines)) say(l);
    const otherFiring = advanced.saves.filter((s) => defensePoolsFired(s.settlement).some((f) => f.block === block && f.pool === pool)).map((s) => s.id);
    say(`saves on which the key fires at year ${years}: ${otherFiring.join(', ') || 'none'}`);
  }

  const dir = path.join(ROOT, '.packets');
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `page-${poolDir(block, pool)}.txt`);
  writeFileSync(file, `${out.join('\n')}\n`);
  console.log(`\n-> ${path.relative(ROOT, file)}`);
}

if (process.argv[1] && process.argv[1].endsWith('prose-render-page.mjs')) await main();
