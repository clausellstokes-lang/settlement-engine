#!/usr/bin/env node
/**
 * hook-theme-digest.mjs — THE DOOR of `src/domain/hookThemes.js :: THEME_DIGEST` (BUILD-THEMES, DEPTH-3, 2026-11-20).
 *
 * The theme of an `NPC_FACTION_LOYALTY` line is AUTHORED in one home, beside the line:
 * `src/data/npcData.js :: NPC_FACTION_LOYALTY_THEMES` (per pool key, an array index-aligned with the pool). The
 * classifier `themeOfText` runs at first paint on a STORED town's hook text and must not load the data module, so
 * first paint holds a DIGEST instead of the text: theme -> the base-36 `fnv1a32(hookThemeKey(text))` of each line it
 * tags, in pool order. This door GENERATES that digest, with a pool-order fingerprint in a comment beside it (so a
 * line moved with its theme reds too); the block between its markers is never hand-edited.
 *
 *   node scripts/hook-theme-digest.mjs           writes the block into src/domain/hookThemes.js
 *   node scripts/hook-theme-digest.mjs --check   exits 1 when the block differs from the one computed (drift: a
 *                                                line added, moved or reworded, or a theme moved, without the door)
 *
 * It refuses (exit 1, nothing written) when the themes are not index-aligned with the pools, a theme is outside
 * HOOK_THEMES, or two distinct folded lines share a hash (the digest could not tell them apart).
 * tests/lint/hookThemeTotality.walker.test.js runs the same check in-test.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { NPC_FACTION_LOYALTY, NPC_FACTION_LOYALTY_THEMES } from '../src/data/npcData.js';
import { HOOK_THEMES, hookThemeKey } from '../src/domain/hookThemes.js';
import { lineText } from '../src/domain/facts/drawDeclared.js';
import { textKey } from '../src/kernel/proseHash.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DIGEST_FILE = 'src/domain/hookThemes.js';
export const OPEN = '// <hook-theme-digest>';
export const CLOSE = '// </hook-theme-digest>';

/** The digest key of a hook text: base-36 fnv1a32 of its fold, by `textKey` (a content address). @param {unknown} text @returns {string} */
export const digestKeyOf = (text) => textKey(hookThemeKey(text)).toString(36);

/**
 * What is wrong with the authored themes, if anything (alignment, closure, hash collisions).
 * @param {Record<string, readonly unknown[]>} pools @param {Record<string, readonly string[]>} themes
 * @returns {string[]}
 */
export function digestProblems(pools, themes) {
  const problems = [];
  const vocab = new Set(HOOK_THEMES);
  for (const key of Object.keys(pools)) if (!Array.isArray(themes[key])) problems.push(`pool ${key}: no themes array`);
  for (const key of Object.keys(themes)) if (!Array.isArray(pools[key])) problems.push(`themes ${key}: no such pool`);
  /** @type {Map<string, string>} */ const foldOf = new Map();
  for (const [key, lines] of Object.entries(pools)) {
    const tags = themes[key] || [];
    if (tags.length !== lines.length) problems.push(`pool ${key}: ${lines.length} lines, ${tags.length} themes`);
    lines.forEach((line, i) => {
      if (!vocab.has(tags[i])) problems.push(`${key}[${i}]: theme ${JSON.stringify(tags[i])} is not a HOOK_THEMES member`);
      const fold = hookThemeKey(lineText(/** @type {any} */ (line)));
      const h = digestKeyOf(fold);
      if (foldOf.has(h) && foldOf.get(h) !== fold) problems.push(`${key}[${i}]: its hash ${h} is another line's`);
      foldOf.set(h, fold);
    });
  }
  return problems;
}

/**
 * The digest: theme -> the space-joined digest keys of its lines, themes in HOOK_THEMES order, keys in pool order.
 * @param {Record<string, readonly unknown[]>} pools @param {Record<string, readonly string[]>} themes
 * @returns {Record<string, string>}
 */
export function computeThemeDigest(pools, themes) {
  /** @type {Record<string, string[]>} */ const by = {};
  for (const [key, lines] of Object.entries(pools)) {
    lines.forEach((line, i) => { (by[themes[key][i]] ||= []).push(digestKeyOf(lineText(/** @type {any} */ (line)))); });
  }
  return Object.fromEntries(HOOK_THEMES.filter((t) => by[t]).map((t) => [t, by[t].join(' ')]));
}

/**
 * THE POOL-ORDER FINGERPRINT: the digest groups hashes by theme, so a line moved with its theme past lines of other
 * themes leaves it unchanged; this fingerprint (fnv1a32 of every `pool:index:hash`, in pool order) is not, so the
 * block — and the door's --check — reds on ANY move (the chair's condition C1). It rides in a comment: first paint
 * pays nothing for it.
 * @param {Record<string, readonly unknown[]>} pools @returns {string}
 */
export function poolOrderFingerprint(pools) {
  const seq = Object.entries(pools).flatMap(([key, lines]) => lines.map((line, i) => `${key}:${i}:${digestKeyOf(lineText(/** @type {any} */ (line)))}`));
  const sizes = Object.entries(pools).map(([key, lines]) => `${key} ${lines.length}`).join(', ');
  return `${textKey(seq.join('\n')).toString(36)} over ${seq.length} lines (${sizes})`;
}

/** The block's source text, markers included. @param {Record<string, string>} digest @param {string} fingerprint @returns {string} */
export function renderDigestBlock(digest, fingerprint) {
  return [
    OPEN,
    '// ⛔ GENERATED by scripts/hook-theme-digest.mjs from src/data/npcData.js :: NPC_FACTION_LOYALTY and',
    '// NPC_FACTION_LOYALTY_THEMES. NEVER HAND-EDITED: run the door when a line or a theme moves (--check reds on drift).',
    `// pool order: ${fingerprint}`,
    '/** theme -> the space-joined base-36 fnv1a32(hookThemeKey(text)) of each line it tags, in pool order. @type {Readonly<Record<string, string>>} */',
    'export const THEME_DIGEST = Object.freeze({',
    ...Object.entries(digest).map(([theme, keys]) => `  ${theme}: '${keys}',`),
    '});',
    CLOSE,
  ].join('\n');
}

/** The block as it stands in a source text (markers included), or null. @param {string} source @returns {string | null} */
export function readDigestBlock(source) {
  const a = source.indexOf(OPEN);
  const b = source.indexOf(CLOSE);
  return a < 0 || b < a ? null : source.slice(a, b + CLOSE.length);
}

/** The block the live data asks for. @returns {string} */
export const liveDigestBlock = () => renderDigestBlock(computeThemeDigest(NPC_FACTION_LOYALTY, NPC_FACTION_LOYALTY_THEMES), poolOrderFingerprint(NPC_FACTION_LOYALTY));

function main() {
  const check = process.argv.includes('--check');
  const problems = digestProblems(NPC_FACTION_LOYALTY, NPC_FACTION_LOYALTY_THEMES);
  if (problems.length) {
    console.error(`hook-theme-digest: refused, ${problems.length} problem(s):\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  const path = join(ROOT, DIGEST_FILE);
  const source = readFileSync(path, 'utf8');
  const standing = readDigestBlock(source);
  if (standing === null) { console.error(`hook-theme-digest: no ${OPEN} … ${CLOSE} block in ${DIGEST_FILE}`); process.exit(1); }
  const wanted = liveDigestBlock();
  if (check) {
    if (standing !== wanted) { console.error(`hook-theme-digest --check: DRIFT. ${DIGEST_FILE}'s THEME_DIGEST is not the one the pools ask for; run node scripts/hook-theme-digest.mjs`); process.exit(1); }
    console.log('hook-theme-digest --check: fresh');
    return;
  }
  if (standing === wanted) { console.log('hook-theme-digest: already fresh, nothing written'); return; }
  writeFileSync(path, source.replace(standing, () => wanted));
  console.log(`hook-theme-digest: wrote ${DIGEST_FILE}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main();
