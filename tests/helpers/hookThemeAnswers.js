/**
 * tests/helpers/hookThemeAnswers.js — THE ONE HOME of themeOfText's held answers (CURE-REWORD-LODGER, addendum 1 (b),
 * DEPTH-5, 2026-11-22).
 *
 * tests/fixtures/hookThemeAnswers.base.json holds the answers taken at the base 2582075ed and is NEVER edited. A later
 * tranche or rewording that moves a line's hash APPENDS a step to tests/fixtures/hookThemeAnswers.steps.json (an ordered
 * list of `{ cause, part, retire: [hash], add: { answer: [hash] } }`), and every reader reads base ∘ steps through
 * `composedAnswers()` here, never the base file directly: tests/domain/hookThemeAnswersHeld.test.js and
 * tests/lint/hookThemeTotality.walker.test.js.
 *
 * A step may retire only a hash its part held before it, and add only a hash its part did not; `composeAnswers` reports
 * every breach as a fault and `composedAnswers` refuses (throws) on any, so no reader reads a half-composed part.
 * Paths are taken from this module's own location, never the working directory.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), '../fixtures');

/** The base fixture, as written at 2582075ed. @returns {{ base: string, parts: Record<string, Record<string, string[]>> }} */
export const readAnswersBase = () => JSON.parse(readFileSync(join(FIXTURES, 'hookThemeAnswers.base.json'), 'utf8'));

/** The ordered steps. @returns {{ cause: string, part: string, retire: string[], add: Record<string, string[]> }[]} */
export const readAnswersSteps = () => JSON.parse(readFileSync(join(FIXTURES, 'hookThemeAnswers.steps.json'), 'utf8')).steps;

/** hash -> answer of one part. @param {Record<string, string[]>} part @returns {Map<string, string>} */
export const answerByHash = (part) => new Map(Object.entries(part).flatMap(([answer, hashes]) => hashes.map((h) => [h, answer])));

/**
 * Base then steps, in order. Pure: neither input is mutated.
 * @param {{ parts: Record<string, Record<string, string[]>> }} base
 * @param {{ cause: string, part: string, retire?: string[], add?: Record<string, string[]> }[]} steps
 * @returns {{ parts: Record<string, Record<string, string[]>>, faults: string[] }}
 */
export function composeAnswers(base, steps) {
  /** @type {Record<string, Map<string, string>>} */
  const parts = Object.fromEntries(Object.entries(base.parts).map(([name, part]) => [name, answerByHash(part)]));
  const faults = [];
  steps.forEach((step, n) => {
    const where = `step ${n} (${step?.part})`;
    if (typeof step?.cause !== 'string' || step.cause.trim() === '') faults.push(`${where}: no cause`);
    const part = parts[step?.part];
    if (!part) { faults.push(`${where}: no such part`); return; }
    const before = new Set(part.keys());
    for (const h of step.retire || []) {
      if (!before.has(h)) faults.push(`${where}: retires ${h}, which the part did not hold`);
      part.delete(h);
    }
    for (const [answer, hashes] of Object.entries(step.add || {})) {
      for (const h of hashes) {
        if (before.has(h)) faults.push(`${where}: adds ${h}, which the part already held`);
        part.set(h, answer);
      }
    }
  });
  /** @type {Record<string, Record<string, string[]>>} */
  const out = {};
  for (const [name, byHash] of Object.entries(parts)) {
    /** @type {Record<string, string[]>} */ const part = {};
    for (const [h, answer] of byHash) (part[answer] ||= []).push(h);
    for (const hs of Object.values(part)) hs.sort();
    out[name] = part;
  }
  return { parts: out, faults };
}

/** The composed parts of the committed base and steps; throws on any fault. @returns {Record<string, Record<string, string[]>>} */
export function composedAnswers() {
  const { parts, faults } = composeAnswers(readAnswersBase(), readAnswersSteps());
  if (faults.length) throw new Error(`hookThemeAnswers: the steps do not compose over the base:\n  ${faults.join('\n  ')}`);
  return parts;
}
