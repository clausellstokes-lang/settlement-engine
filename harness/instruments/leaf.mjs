/**
 * harness/instruments/leaf.mjs — ⭐ THE KIT · LEAF RESOLUTION (ODQ §634.3).
 *
 * Every wave from REG-1 on has re-written the same three lines to get from a corpus KEY to a
 * built fabric, and every wave has re-written the same footgun beside them. This module is the
 * one place both live, so REG-5..9 stop paying the boilerplate tax.
 *
 * ⚠⚠ **THE GLOB THAT HAS NOW BITTEN THIS PROGRAMME FOUR TIMES.** `ls town-*-parchment.svg | head -1`
 * matches `town-2-town-parchment.svg` FIRST, because `-2` sorts before `-town`. A lane that picks
 * its leaf that way measures a DIFFERENT SETTLEMENT than the one it names, and every figure it
 * reports is honest about the wrong picture. `artifactName()` below is the cure: an artifact is
 * addressed by EXACT `<key>-<tier>-<lens>.svg`, composed from the corpus row, never matched.
 *
 * ⛔ AND `buildLeaf` GOES THROUGH THE HARNESS'S OWN `buildOne` — never a fork. A probe that
 * re-implements the build measures its own re-implementation.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '../..');

const ex = await import(join(ROOT, 'harness/exemplars.mjs'));
export const { CORPUS, buildOne, siteRepresentatives, bothTotals, siteKey } = ex;

/** the corpus row for a key, or a refusal naming what was asked for */
export function specOf(key) {
  const row = CORPUS.find((c) => c.key === key);
  if (!row) throw new Error(`NO_SUCH_LEAF ${key} — the corpus holds: ${CORPUS.map((c) => c.key).join(', ')}`);
  return row;
}

/** one exemplar leaf's fabric, through the harness's own buildOne */
export function buildLeaf(key, fabricOptions = {}) {
  return buildOne(specOf(key), fabricOptions);
}

/**
 * ⭐⭐ THE EXACT ARTIFACT NAME. `artifactName('town')` is `town-town-parchment.svg` and
 * `artifactName('town-2')` is `town-2-town-parchment.svg` — two different settlements that a
 * glob cannot keep apart. The tier is taken from the corpus row, never guessed.
 */
export function artifactName(key, lens = 'parchment') {
  const spec = specOf(key);
  return `${key}-${spec.settType}-${lens}.svg`;
}

/** the exact path of one artifact inside a render directory */
export function artifactPath(dir, key, lens = 'parchment') {
  return join(dir, artifactName(key, lens));
}

/** every key of a given tier, in corpus order — for a per-tier census that must not miss a leaf */
export function keysOfTier(tier) {
  return CORPUS.filter((c) => c.settType === tier).map((c) => c.key);
}

/** the tiers the corpus actually carries, in first-appearance order */
export function tiers() {
  const seen = [];
  for (const c of CORPUS) if (!seen.includes(c.settType)) seen.push(c.settType);
  return seen;
}
