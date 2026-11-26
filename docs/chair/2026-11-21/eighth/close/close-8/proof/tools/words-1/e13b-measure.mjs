#!/usr/bin/env node
/**
 * E13b MEASURE (WORDS-1; the tenth chair's message of 2026-11-25 18:24): "How they deal" (`presentation.behaviour`), drawn by
 * `npcData.js :: dealingLineFor` from NPC_DEALING_BY_TRAIT (disposition × trait family) or the disposition's own line
 * (NPC_PLOT_HOOKS_DATA) when no trait names a family. Over a page-battery run made WITH `--strings --views`: per town, the
 * cards of each pair (the line a card holds, named back to its pair by the tables), and how many towns hold 2, 3, 4, 5 … cards of
 * one pair; per pair the most cards in one town (so the lines a pair needs for no repeat); the strings a no-repeat design moves
 * (every card after the first of its pair in its town) and the places; the pages that print one dealing line twice. A MEASURE.
 * Usage: node e13b-measure.mjs <tree> <runDir> [--pairs=<out.json>]
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [T, D] = process.argv.slice(2);
const arg = (n) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : null; };
const { NPC_DEALING_BY_TRAIT, NPC_PLOT_HOOKS_DATA } = await import(`${T}/src/data/npcData.js`);
/** @type {Map<string, string>} line → pair */ const PAIR = new Map();
for (const [disp, fam] of Object.entries(NPC_DEALING_BY_TRAIT)) for (const [f, line] of Object.entries(fam)) PAIR.set(line, `${disp}/${f}`);
for (const [disp, line] of Object.entries(NPC_PLOT_HOOKS_DATA)) if (!PAIR.has(line)) PAIR.set(line, `${disp}/(own)`);
const hist = {}; const maxK = {}; const townsAt = {}; let moved = 0; const movedPlaces = new Set(); let towns = 0; let cards = 0; let dealingCards = 0;
let pagesDoubled = 0; let pagesTopDoubled = 0;
for (const f of readdirSync(join(D, 'rows')).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(join(D, 'rows', f), 'utf8')); towns++;
  const by = {};
  for (const [k, v] of Object.entries(r.strings || {})) {
    if (!/^record\.npcs\[\d+\]\.presentation\.behaviour$/.test(k)) continue;
    cards++; const p = PAIR.get(String(v).trim()); if (!p) continue;
    dealingCards++; (by[p] ||= 0); by[p]++;
  }
  for (const [p, k] of Object.entries(by)) {
    maxK[p] = Math.max(maxK[p] || 0, k);
    if (k >= 2) { hist[k] = (hist[k] || 0) + 1; (townsAt[p] ||= {})[k] = ((townsAt[p] ||= {})[k] || 0) + 1; moved += k - 1; movedPlaces.add(r.seed); }
  }
  // the page: a dealing line printed twice or more in one view (and the town's most-held line, doubled)
  let dbl = false;
  for (const lines of Object.values(r.printed || {})) {
    const cnt = {}; for (const l of lines) { const t = String(l).replace(/^How they deal:?\s*/, '').trim(); if (PAIR.has(t)) cnt[t] = (cnt[t] || 0) + 1; }
    if (Object.values(cnt).some((n) => n >= 2)) dbl = true;
  }
  if (dbl) pagesDoubled++;
  const top = Object.values(by).sort((a, b) => b - a)[0] || 0; if (top >= 2) pagesTopDoubled++;
}
const pairs = Object.keys(maxK).sort();
console.log(`e13b-measure ${D}: towns ${towns}; cards ${cards}; cards holding a dealing line ${dealingCards}; pairs met ${pairs.length} of ${PAIR.size}`);
console.log(`  town-pairs holding k cards: ${Object.entries(hist).map(([k, n]) => `${k}: ${n}`).join(', ')}`);
console.log(`  towns where the town's most-held pair holds 2+ cards ${pagesTopDoubled}; pages printing one dealing line twice in a view ${pagesDoubled}`);
console.log(`  a no-repeat design moves ${moved} strings in ${movedPlaces.size} places (every card after the first of its pair in its town)`);
const need = pairs.reduce((s, p) => s + (maxK[p] - 1), 0);
console.log(`  new lines for no repeat anywhere in this corpus: ${need} (Σ per pair of (most cards in one town − 1)); by most-in-a-town: ${[2, 3, 4, 5, 6, 7].map((k) => `${k}: ${pairs.filter((p) => maxK[p] === k).length}`).join(', ')}`);
if (arg('pairs')) writeFileSync(String(arg('pairs')), JSON.stringify({ maxK, townsAt }, null, 1));
