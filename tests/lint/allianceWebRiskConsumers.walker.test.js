/**
 * allianceWebRiskConsumers.walker.test.js — THE ONE WEB.
 *
 * WR-6 built the believed-retaliation read (`readAllianceWebRisk` in
 * warAllianceRisk.js). WR-8 amendment R says the razing's deterrent is "E3's
 * alliance-web risk read, POINTED AT THE AFTERMATH" — built there, consumed
 * here. FP GR-2 pointed the same read at a peaceful pair's shared fear — built
 * there too, and its admission to the census is argued at ALLOWED_CONSUMERS. The failure that ruling exists to prevent is not a missing consumer; it
 * is a SECOND WEB: a razing that answers "who would retaliate" with its own
 * private walk, drifting from the coalition layer's answer at the first edit and
 * never reporting that it had.
 *
 * So this walker pins the census, not the presence:
 *   1. EXACTLY THREE runtime consumers, ALL NAMED (two until GR-2, and the
 *      count is a measurement rather than a target). A FOURTH appearing is a
 *      design question that must be argued, not absorbed; one disappearing means
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
 * THE CLOSED CONSUMER SET. Three, and the reason each is here:
 *   - warCoalitionDecision.js — WR-6's own consumer: pricing what a court risks
 *     by ANSWERING an alliance call (the web of the enemy it would take on).
 *   - razingExecution.js      — WR-8 amendment R: pricing what a would-be razer
 *     risks by BURNING a town (the web the burning would arm). Added by lane
 *     WZ-4; before it, WZ-3's census recorded exactly one.
 *   - pactFormation.js        — FP GR-2, and THE CENSUS UPDATE IS ARGUED HERE
 *     RATHER THAN ABSORBED, because that is what this walker's own docstring
 *     demands of a third arrival. THE ARGUMENT: GR-2's `shared_threat` trigger
 *     asks whether two courts AT PEACE have reason to fear the same third court,
 *     and the compiled architecture (§6 seam 4, V-25) names this read as its
 *     source by design — "built in WR-6, consumed here — never duplicated".
 *     The failure this census exists to prevent is a SECOND WEB, and the
 *     admission is safe against exactly that on three measured counts: the
 *     consumer composes no `alliesOf` walk of its own (the nested-walk negative
 *     below covers it automatically, since that scan quantifies over every src
 *     module); it re-grades no intensity rung, naming exactly ONE band word as a
 *     floor to sit above and taking `risk01` from the read for everything else
 *     (`PACT_TRIGGER_TUNING.SHARED_THREAT_FLOOR_BAND`, asserted below); and it
 *     points the web at a THIRD question none of the other two asks — not what a
 *     called ally would take on, and not what a burning would arm, but what a
 *     pair of peaceful courts already share a fear of.
 *     ⚠ THE CENSUS IS NOW THREE. A FOURTH is a design question that must be
 *     argued in its own wave's commit, exactly as this one was.
 */
const ALLOWED_CONSUMERS = Object.freeze([
  'src/domain/worldPulse/pactFormation.js',
  'src/domain/worldPulse/razingExecution.js',
  'src/domain/worldPulse/warCoalitionDecision.js',
]);

/**
 * Registry / certification modules that merely NAME the symbol in a string (the
 * coupling registry records it as a read address). They are not consumers and
 * must be excluded by an explicit list rather than by a loose pattern.
 *
 * CW-0w slice 1 split the registry's rows into per-volume leaves; WR-6's
 * alliance-risk row — and therefore the read address string — now lives in
 * couplingRegistryWar.js. The head is retained here because a future row leaf
 * or head comment may name the read again, and an exclusion list that silently
 * shrank would be one relocation away from re-arming this census against a
 * registry file.
 */
const NAME_ONLY = Object.freeze([
  'src/domain/certification/couplingRegistry.js',
  'src/domain/certification/couplingRegistryWar.js',
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

describe('THE ONE WEB — readAllianceWebRisk has exactly three runtime consumers', () => {
  test('the scanned module set is non-empty and contains the read\'s own home', () => {
    // THE ANTI-VACUITY ANCHOR. A relocation that emptied this walk would make
    // every absence below pass while guarding nothing.
    expect(SRC_MODULES.length).toBeGreaterThan(500);
    expect(SRC_MODULES).toContain(OWNER);
    expect(codeOf(OWNER)).toContain('export function readAllianceWebRisk');
  });

  test('the consumer census is EXACTLY the three named modules', () => {
    const consumers = SRC_MODULES.filter((rel) => {
      if (rel === OWNER || NAME_ONLY.includes(rel)) return false;
      return /\breadAllianceWebRisk\b/.test(codeOf(rel));
    });
    expect(consumers).toEqual([...ALLOWED_CONSUMERS].sort());
    expect(consumers).toHaveLength(3);
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

  test('the three consumers point the web at DIFFERENT questions', () => {
    // All three price a web; the razing's is pointed at the AFTERMATH (the
    // victim's friends), the coalition's at the enemy a called court would take
    // on, and the pact lane's at a court a PEACEFUL PAIR both have reason to
    // fear. If any two ever became the same call, one of them is redundant and
    // its amendment pointer is wrong.
    const razing = codeOf('src/domain/worldPulse/razingExecution.js');
    const coalition = codeOf('src/domain/worldPulse/warCoalitionDecision.js');
    const pacts = codeOf('src/domain/worldPulse/pactFormation.js');
    expect(razing).toContain('enemyId: victim');
    expect(coalition).toContain('enemyId: episode.enemyId');
    expect(pacts).toContain('enemyId: threatId');
  });

  test('GR-2 consumes the read\'s OWN band ladder and declares no rival', () => {
    // THE ADMISSION'S LOAD-BEARING HALF (see ALLOWED_CONSUMERS). The intensity
    // rungs belong to warAllianceRisk.js. The pact lane may NAME one as a floor;
    // it may not redefine the ladder — the same rule the razing estate is held
    // to directly below, applied to the wave that widened this census.
    const triggers = codeOf('src/domain/worldPulse/pactTriggers.js');
    const pacts = codeOf('src/domain/worldPulse/pactFormation.js');
    for (const band of ['pressing', 'decisive']) {
      expect(triggers).not.toContain(`'${band}'`);
      expect(pacts).not.toContain(`'${band}'`);
    }
    // …while the ONE rung it does name is present, so this is not vacuous.
    expect(triggers).toContain("SHARED_THREAT_FLOOR_BAND: 'quiet'");
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
