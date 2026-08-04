/**
 * allianceWebRiskConsumers.walker.test.js — THE ONE WEB.
 *
 * WR-6 built the believed-retaliation read (`readAllianceWebRisk` in
 * warAllianceRisk.js). WR-8 amendment R says the razing's deterrent is "E3's
 * alliance-web risk read, POINTED AT THE AFTERMATH" — built there, consumed
 * here. The failure that ruling exists to prevent is not a missing consumer; it
 * is a SECOND WEB: a razing that answers "who would retaliate" with its own
 * private walk, drifting from the coalition layer's answer at the first edit and
 * never reporting that it had.
 *
 * So this walker pins the census, not the presence:
 *   1. EXACTLY TWO runtime consumers, BOTH NAMED. A third appearing is a design
 *      question that must be argued, not absorbed; a second disappearing means
 *      somebody quietly stopped consuming and probably started rebuilding.
 *   2. NOBODY REBUILDS THE WALK. No module outside the read's own file may
 *      compose the depth-two alliance walk that defines it.
 *   3. THE CENSUS IS NON-EMPTY AND ANCHORED. Both cures for the recorded
 *      filename-anchored vacuity class: the scanned module SET is asserted
 *      non-empty, and each named consumer is proved to still contain the call —
 *      so a pure relocation reds instead of silently guarding nothing.
 *
 * WHY A SOURCE SCAN RATHER THAN A RUNTIME COUNT: the thing under guard is
 * authorship. A second web would be perfectly functional at runtime — that is
 * exactly why nothing else would catch it.
 *
 * @enforced-by this file
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The read's own home — the one file allowed to define the walk. */
const OWNER = 'src/domain/worldPulse/warAllianceRisk.js';

/**
 * THE CLOSED CONSUMER SET. Two, and the reason each is here:
 *   - warCoalitionDecision.js — WR-6's own consumer: pricing what a court risks
 *     by ANSWERING an alliance call (the web of the enemy it would take on).
 *   - razingExecution.js      — WR-8 amendment R: pricing what a would-be razer
 *     risks by BURNING a town (the web the burning would arm). Added by lane
 *     WZ-4; before it, WZ-3's census recorded exactly one.
 */
const ALLOWED_CONSUMERS = Object.freeze([
  'src/domain/worldPulse/razingExecution.js',
  'src/domain/worldPulse/warCoalitionDecision.js',
]);

/**
 * Registry / certification modules that merely NAME the symbol in a string (the
 * coupling registry records it as a read address). They are not consumers and
 * must be excluded by an explicit list rather than by a loose pattern.
 */
const NAME_ONLY = Object.freeze([
  'src/domain/certification/couplingRegistry.js',
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

/** Every src module, repo-relative with forward slashes. */
const SRC_MODULES = walk(join(ROOT, 'src'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();

const sourceOf = (rel) => readFileSync(join(ROOT, rel), 'utf8');
/** Source with comments stripped — a census must read code, not prose about it. */
const codeOf = (rel) => sourceOf(rel)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

describe('THE ONE WEB — readAllianceWebRisk has exactly two runtime consumers', () => {
  test('the scanned module set is non-empty and contains the read\'s own home', () => {
    // THE ANTI-VACUITY ANCHOR. A relocation that emptied this walk would make
    // every absence below pass while guarding nothing.
    expect(SRC_MODULES.length).toBeGreaterThan(500);
    expect(SRC_MODULES).toContain(OWNER);
    expect(codeOf(OWNER)).toContain('export function readAllianceWebRisk');
  });

  test('the consumer census is EXACTLY the two named modules', () => {
    const consumers = SRC_MODULES.filter((rel) => {
      if (rel === OWNER || NAME_ONLY.includes(rel)) return false;
      return /\breadAllianceWebRisk\b/.test(codeOf(rel));
    });
    expect(consumers).toEqual([...ALLOWED_CONSUMERS].sort());
    expect(consumers).toHaveLength(2);
  });

  test('each named consumer actually CALLS it — the census is not satisfied by an import', () => {
    for (const rel of ALLOWED_CONSUMERS) {
      const code = codeOf(rel);
      expect(code).toContain("from './warAllianceRisk.js'");
      // An import alone would satisfy a naive census while proving nothing —
      // the recorded lit-coverage lesson, applied to a consumer count.
      expect(/readAllianceWebRisk\s*\(\s*\{/.test(code)).toBe(true);
    }
  });

  test('the two consumers point the web at DIFFERENT questions', () => {
    // Both price a web; the razing's is pointed at the AFTERMATH (the victim's
    // friends), the coalition's at the enemy a called court would take on. If
    // these ever became the same call, one of them is redundant and the amendment
    // pointer is wrong.
    const razing = codeOf('src/domain/worldPulse/razingExecution.js');
    const coalition = codeOf('src/domain/worldPulse/warCoalitionDecision.js');
    expect(razing).toContain('enemyId: victim');
    expect(coalition).toContain('enemyId: episode.enemyId');
  });
});

describe('NEGATIVE CONTROL — nobody rebuilds the depth-two alliance walk', () => {
  test('only the read\'s own home composes alliesOf into a depth-two web', () => {
    // `alliesOf` is the primitive the web is built from. Walking it ONE level is
    // ordinary (the coalition census does it); NESTING it is what "a second web"
    // means, and only warAllianceRisk.js may.
    const nested = SRC_MODULES.filter((rel) => {
      if (rel === OWNER) return false;
      const code = codeOf(rel);
      if (!/\balliesOf\s*\(/.test(code)) return false;
      // A nested walk: an alliesOf loop whose body contains another alliesOf.
      return /for\s*\([^)]*\balliesOf\s*\([^)]*\)\s*\)\s*\{[\s\S]{0,600}?\balliesOf\s*\(/.test(code);
    });
    expect(nested).toEqual([]);
    // ANCHORED: the owner itself DOES nest, so the detector is proved live
    // rather than merely returning empty because it matches nothing anywhere.
    const ownerCode = codeOf(OWNER);
    expect(/for\s*\([^)]*\balliesOf\s*\([^)]*\)\s*\)\s*\{[\s\S]{0,600}?\balliesOf\s*\(/.test(ownerCode)).toBe(true);
  });

  test('the razing estate holds no private band table for retaliation risk', () => {
    // The bands belong to the read (`decisive`/`pressing`/`present`/`quiet`).
    // The razing may NAME one as its threshold; it may not redefine the ladder.
    const razing = codeOf('src/domain/worldPulse/razingExecution.js');
    for (const band of ['pressing', 'present']) {
      expect(razing).not.toContain(`'${band}'`);
    }
    // …while the threshold it DOES name is present, so this is not vacuous.
    expect(razing).toContain("DETERRENCE_BAND: 'decisive'");
  });
});
