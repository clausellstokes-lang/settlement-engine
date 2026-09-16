/**
 * postureNameCollision.walker.test.js — SP-C. THE SINGLE-DEFINITION SCAN FOR
 * `riskToleranceOf`, and the enforcement half of chair ruling CR-C4-1 (2026-08-06).
 *
 * THE CLASS. The FP constitution and the SP volume both specced SP-4's court read as
 * `riskToleranceOf(actor)`. `src/domain/roads/state.js` has exported
 * `riskToleranceOf(npc)` since the roads lane landed — an NPC-grain courage read
 * consumed by `roadsKernel.js`. Two exports of one name in one domain tree is a defect
 * with no runtime symptom: both modules are internally consistent, every gate is green,
 * and the damage lands later, on the reader. A grep-led sweep conflates two contracts; a
 * successor's import resolves to the wrong one; a rename touches half the sites. This
 * estate has been bitten by that shape (the concurrent-lane rename class, the
 * writer/reader spelling-drift class), which is why SP §11 Q2's "module scoping
 * disambiguates" was overruled: a disambiguation that lives in the reader's head is not
 * enforcement.
 *
 * THE RULING. GRAMMAR §7 Q2 measured the collision and ruled the court reads
 * `courtPostureOf` / `courtRiskAppetiteOf`. The chair ruled for that spelling; SP-C
 * landed it; the SP volume's SP-C block, its J-SP-5 block and its §11 Q2 are aligned to
 * it in the same commit. THIS FILE IS WHAT KEEPS IT TRUE: `riskToleranceOf` resolves to
 * exactly ONE definition under `src/domain` from here on, and the two court reads
 * resolve to exactly one each.
 *
 * WHY DEFINITIONS AND EXPORT SITES, AND NOT CALLS. A call site is a consumer and there
 * may be many; a DEFINITION is the thing that can be duplicated. The scan counts where
 * the name is bound and where it is published, and it is deliberately blind to imports
 * and calls — including the leaf's own header, which quotes the hazard by name so a
 * grep-led successor finds the explanation at the site. Comments and string bodies are
 * blanked with the engine-gated-key walker's own blanker, imported rather than
 * re-spelled, so the documentation that prevents the defect cannot trip the scan for it.
 *
 * GUARD THE GUARD. The scanner is pure, so it is driven over synthetic sources carrying
 * every definition spelling — and over sources that merely CALL, IMPORT or MENTION the
 * name — before any live claim is made. A scanner that stopped matching would report
 * "exactly one definition" on an empty measurement and pass having proved nothing.
 *
 * @enforced-by itself (a source scan; no runtime coupling)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import { codeOnly } from './engineGatedRuleKeys.walker.test.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The R3 name, and its ONE lawful home. */
const ROADS_NAME = 'riskToleranceOf';
const ROADS_HOME = 'src/domain/roads/state.js';
/** CR-C4-1's spellings, and their ONE lawful home. */
const POSTURE_HOME = 'src/domain/worldPulse/strategicPosture.js';
const POSTURE_NAMES = Object.freeze(['courtPostureOf', 'courtRiskAppetiteOf']);
const SP_VOLUME = 'docs/DESIGN_FP_ARCH_SP.md';

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

const DOMAIN_FILES = walk(join(ROOT, 'src', 'domain')).map((p) => ({
  rel: relative(ROOT, p).replace(/\\/g, '/'),
  code: codeOnly(readFileSync(p, 'utf8')),
}));

/**
 * Where `name` is BOUND: a function declaration or a const/let/var binding, exported or
 * not. Deliberately not object properties — a `{ riskToleranceOf }` shorthand publishes
 * a binding made elsewhere and is counted by the export census instead.
 * @param {string} code @param {string} name @returns {number}
 */
function definitionCount(code, name) {
  const re = new RegExp(
    String.raw`(?:^|[;{}\n])\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+${name}\b`
    + String.raw`|(?:^|[;{}\n])\s*(?:export\s+)?(?:const|let|var)\s+${name}\s*=`,
    'g',
  );
  return [...code.matchAll(re)].length;
}

/**
 * Where `name` is PUBLISHED: an `export` statement naming it, including `as` renames —
 * the shape that would let a second module publish the roads name without defining it.
 * @param {string} code @param {string} name @returns {number}
 */
function exportCount(code, name) {
  const re = new RegExp(
    String.raw`export\s+(?:default\s+)?(?:async\s+)?function\s+${name}\b`
    + String.raw`|export\s+(?:const|let|var)\s+${name}\s*=`
    + String.raw`|export\s*\{[^}]*\b(?:${name}\s*(?:,|\}|$)|as\s+${name}\b)`,
    'g',
  );
  return [...code.matchAll(re)].length;
}

/** @param {string} name @returns {string[]} */
const definers = (name) => DOMAIN_FILES.filter((f) => definitionCount(f.code, name) > 0).map((f) => f.rel);
/** @param {string} name @returns {string[]} */
const exporters = (name) => DOMAIN_FILES.filter((f) => exportCount(f.code, name) > 0).map((f) => f.rel);

describe('the scanner BITES before anything is claimed absent (guard the guard)', () => {
  test('it finds every definition spelling', () => {
    const spellings = [
      'export function riskToleranceOf(npc) { return 1; }',
      'function riskToleranceOf(npc) { return 1; }',
      'export const riskToleranceOf = (npc) => 1;',
      'const riskToleranceOf = function (npc) { return 1; };',
      'let riskToleranceOf = null;',
      'export async function riskToleranceOf(npc) { return 1; }',
    ];
    for (const spelling of spellings) {
      expect(definitionCount(spelling, ROADS_NAME), `missed: ${spelling}`).toBe(1);
    }
    // Two in one file counts two — a same-file duplicate is a real shape.
    expect(definitionCount(`${spellings[0]}\n${spellings[2]}`, ROADS_NAME)).toBe(2);
  });

  test('it finds every export spelling, including the `as` rename', () => {
    const spellings = [
      'export function riskToleranceOf(npc) { return 1; }',
      'export const riskToleranceOf = (npc) => 1;',
      'export { riskToleranceOf };',
      'export { a, riskToleranceOf, b };',
      'export { courage as riskToleranceOf };',
    ];
    for (const spelling of spellings) {
      expect(exportCount(spelling, ROADS_NAME), `missed: ${spelling}`).toBe(1);
    }
  });

  test('it is BLIND to calls, imports and prose — the negative controls', () => {
    const innocents = [
      'const tolerance = riskToleranceOf(npc);',
      "import { riskToleranceOf } from '../roads/state.js';",
      "import { roadsActive, riskToleranceOf, isOffStage } from './x.js';",
      'const t = obj.riskToleranceOf(npc);',
    ];
    for (const innocent of innocents) {
      expect(definitionCount(innocent, ROADS_NAME), `false positive: ${innocent}`).toBe(0);
      expect(exportCount(innocent, ROADS_NAME), `false positive: ${innocent}`).toBe(0);
    }
    // A header that QUOTES the hazard must not trip the scan for it — the blanker is
    // what makes the documentation and the enforcement able to coexist.
    const quoted = codeOnly('/** roads exports riskToleranceOf(npc). export function riskToleranceOf() {} */\n');
    expect(definitionCount(quoted, ROADS_NAME)).toBe(0);
  });

  test('the denominator is real: the domain tree is non-empty and readable', () => {
    expect(DOMAIN_FILES.length).toBeGreaterThan(150);
    expect(DOMAIN_FILES.map((f) => f.rel)).toContain(ROADS_HOME);
    expect(DOMAIN_FILES.map((f) => f.rel)).toContain(POSTURE_HOME);
  });
});

describe('CR-C4-1 — `riskToleranceOf` resolves to exactly ONE definition', () => {
  test('the roads NPC read is the only binder, and the only publisher', () => {
    expect(
      definers(ROADS_NAME),
      'a second `riskToleranceOf` landed under src/domain. The name belongs to the roads'
      + ' NPC-grain read; a court-grain read is spelled `courtRiskAppetiteOf` (CR-C4-1),'
      + ' because two exports of one name in one tree is a defect with no runtime symptom.',
    ).toEqual([ROADS_HOME]);
    expect(exporters(ROADS_NAME)).toEqual([ROADS_HOME]);
    // ...and it really is a function, not a stub the scan happened to match.
    const home = DOMAIN_FILES.find((f) => f.rel === ROADS_HOME);
    expect(definitionCount(home.code, ROADS_NAME)).toBe(1);
    expect(home.code).toMatch(/export function riskToleranceOf\s*\(/);
  });

  test('the two court reads resolve to exactly one definition each, in the SP-C leaf', () => {
    for (const name of POSTURE_NAMES) {
      expect(definers(name), `${name} is defined in more than one place`).toEqual([POSTURE_HOME]);
      expect(exporters(name)).toEqual([POSTURE_HOME]);
    }
  });

  test('the SP-C leaf does not bind the roads name at all', () => {
    const leaf = DOMAIN_FILES.find((f) => f.rel === POSTURE_HOME);
    expect(definitionCount(leaf.code, ROADS_NAME)).toBe(0);
    expect(exportCount(leaf.code, ROADS_NAME)).toBe(0);
  });
});

describe('CR-C4-1 — the SP volume records the ruling where a reader will find it', () => {
  const volume = readFileSync(join(ROOT, SP_VOLUME), 'utf8');
  /** @param {string} needle */
  const occurrences = (needle) => volume.split(needle).length - 1;

  test('the SP-C block names the ruled spellings and cites the ruling', () => {
    // The first-match retargeting law: each anchor is asserted to appear EXACTLY ONCE,
    // so a pin cannot silently retarget onto a neighbouring wave's block.
    expect(occurrences('### SP-C — THE POSTURE READ')).toBe(1);
    const block = volume.slice(
      volume.indexOf('### SP-C — THE POSTURE READ'),
      volume.indexOf('### SP-D — '),
    );
    expect(block).toContain('courtPostureOf');
    expect(block).toContain('courtRiskAppetiteOf');
    expect(block).toContain('CR-C4-1');
    expect(block.length).toBeGreaterThan(500);
  });

  test('J-SP-5 and §11 Q2 record the supersession rather than contradicting it', () => {
    expect(occurrences('J-SP-5 (the posture export names)')).toBe(1);
    expect(occurrences('CR-C4-1')).toBeGreaterThanOrEqual(4);
    // The old ruling's text survives as a record; what must not survive is a live
    // instruction to build the colliding name.
    // The CR-C4-1 occurrence count above proves `volume` is the real SP volume.
    // anchored: that count is >= 4, so this absence cannot be an unread file.
    expect(volume).not.toMatch(/`postureOf`\/`riskToleranceOf` reads/);
  });
});
