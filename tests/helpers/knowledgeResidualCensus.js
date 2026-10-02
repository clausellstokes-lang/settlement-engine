/**
 * knowledgeResidualCensus.js — THE LIVE CENSUS behind knowledgeLaneEvidence.js's residual
 * catalog (FP IN-6 U1, the decontamination ratchet re-measured at build).
 *
 * WHY A HELPER. The catalog's two lists claim "these kinds reach the `knowledge` mover family
 * only through the wizard-news id". A claim like that rots the day a lane mints a kind, so the
 * ratchet re-derives it from the tree on every run: it enumerates the estate's kinds, runs the
 * PRODUCTION classifier (behavioral-observation.moverFamilyOf) on each one twice, once on its own
 * vocabulary and once carrying its ordinary wizard-news id, and keeps the kinds whose family
 * comes only from the id. Nothing here reads a token list; the classifier is the authority.
 *
 * THE TWO CENSUSES, defined here once:
 *   impactKinds  every `impactKind: '<literal>'` spelled in src/ (the wizard-news impact field).
 *   kinds        every exact routing token of the Herald (heraldRouting.EXACT_SECTION's keys)
 *                that is not itself an impactKind literal. A routed token is a kind a producer
 *                can mint as `kind` with no impactKind at all, which is the kind-only shape the
 *                catalog's second list exists for. Each token is classified ON ITS OWN, because
 *                the classifier reads the token wherever it sits.
 *
 * Pure reads of the tree and the classifier; no clock, no randomness, codepoint-sorted output.
 * CONSUMERS: tests/domain/subsystemRowsEpistemics.test.js · tests/lint/earnedClassification.walker.test.js
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';
import { EXACT_SECTION } from '../../src/domain/realm/heraldRouting.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const IMPACT_KIND_LITERAL = /impactKind: '([a-z0-9_]+)'/g;

/** @param {string} dir @param {string[]} out @returns {string[]} */
function sourceFiles(dir, out = []) {
  for (const name of readdirSync(dir).sort(compareCodepoint)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) sourceFiles(path, out);
    else if (/\.(js|jsx|mjs)$/.test(name)) out.push(path);
  }
  return out;
}

/** Every impactKind literal spelled in src/, codepoint-sorted. @returns {string[]} */
export function impactKindCensus() {
  const found = new Set();
  for (const file of sourceFiles(join(ROOT, 'src'))) {
    for (const match of readFileSync(file, 'utf8').matchAll(IMPACT_KIND_LITERAL)) found.add(match[1]);
  }
  return [...found].sort(compareCodepoint);
}

/** Every exact Herald routing token that is not an impactKind literal. @returns {string[]} */
export function routedKindCensus() {
  const impact = new Set(impactKindCensus());
  return Object.keys(EXACT_SECTION).filter((kind) => !impact.has(kind)).sort(compareCodepoint);
}

/** The ordinary wizard-news id a receipt of this kind carries. @param {string} kind */
export const wizardNewsIdOf = (kind) => `wizard_news.5.${kind}.observer.subject`;

/**
 * The kinds of one census whose family comes ONLY from the wizard-news id: no family on the
 * kind's own vocabulary, `knowledge` once the id rides along.
 * @param {'impactKind' | 'kind'} field @param {ReadonlyArray<string>} kinds @returns {string[]}
 */
export function residualOf(field, kinds) {
  return kinds.filter((kind) => moverFamilyOf({ [field]: kind }) == null
    && moverFamilyOf({ [field]: kind, id: wizardNewsIdOf(kind) }) === 'knowledge');
}

/** The live residual of both censuses. @returns {{ impactKinds: string[], kinds: string[] }} */
export function measuredResidual() {
  return {
    impactKinds: residualOf('impactKind', impactKindCensus()),
    kinds: residualOf('kind', routedKindCensus()),
  };
}
