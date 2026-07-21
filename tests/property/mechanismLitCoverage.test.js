/**
 * mechanismLitCoverage.test.js — the per-mechanism LIT-WALKTHROUGH walker
 * (Enforcer E-H, THE_APLUS_EXECUTION_ARCHITECTURE §E-H, bar 4 SUBSTANCE).
 *
 * The ~34 *DormancyGolden tests prove each opt-in subsystem is byte-identical
 * when DARK. Nothing proved the other half structurally: that every mechanism
 * also ships a flag-ON LIT walkthrough — an executed test of its lit behavior,
 * not merely its dark byte-identity. This walker closes that class. It
 * enumerates every worldPulse MECHANISM from source along two axes and asserts
 * each carries a standing lit proof:
 *
 *   AXIS 1 — MODULES: every flat *.js under src/domain/worldPulse (the
 *     kernels / movers / candidate producers — ~156 today). Lit credit:
 *       (a) AUTO — a lit-eligible test file (any tests/**\/*.test.js that is
 *           NOT a dormancy golden or byte-identity proof) imports the module
 *           directly (static `from '…/worldPulse/X.js'` or dynamic import).
 *           The repo's per-module unit tests are exactly this shape.
 *       (b) REGISTRY — LIT_COVERED_BY names an explicit lit proof for modules
 *           driven indirectly (via the index barrel, a display wrapper, a
 *           re-export seam, or a dormancy golden's LIT ANTI-VACUITY section —
 *           those sections drive the flag ON through the real pulse and assert
 *           a real effect, so they ARE lit proofs even though the file's dark
 *           half is not). Every entry is validated: the module must exist, the
 *           referenced test file must exist, the evidence string must appear
 *           in it, and the entry must not duplicate AUTO credit (minimality).
 *   AXIS 2 — FLAGS: every `<x>Enabled` simulation-rules key (tokens in
 *     simulationRules.js ∪ property reads across worldPulse — predicate
 *     helper FUNCTIONS like isFaithSpreadEnabled are excluded). Lit credit:
 *       (a) LITERAL — some test sets `<flag>: true` (dormancy goldens count
 *           here: their anti-vacuity halves are exactly such lit drives);
 *       (b) DEFAULT-TRUE — the flag is true in DEFAULT_SIMULATION_RULES, so
 *           every defaults-driven pulse test runs it lit;
 *       (c) REGISTRY — FLAG_LIT_COVERED_BY, validated as above (for flags
 *           whose lit tests feed the flag through a variable, or drive the
 *           gated mechanism directly below the gate).
 *
 * THE RATCHET: the mechanisms/flags with NO credit must EXACTLY equal the
 * committed baseline (tests/fixtures/mechanism-lit-coverage-baseline.json).
 * A NEW mechanism or flag without a lit proof fails here — a mechanism can no
 * longer ship lit-unproven ("a lit walkthrough runs for every mechanism"
 * becomes STRUCTURAL, not convention). A baseline entry that GAINS coverage
 * also fails, forcing the baseline to shrink and locking the win. Drive to [].
 *
 * TO COMPLY when this reds:
 *   - new mechanism/flag uncovered → write its lit test (drive it flag-ON,
 *     assert a real effect); or, if it is genuinely proven lit by an existing
 *     indirect test, add a validated LIT_COVERED_BY entry naming it;
 *   - baseline entry now covered → strike it from the baseline (shrink);
 *   - mechanism/flag deleted from source → strike its baseline/registry entry.
 *
 * Pure source/test-corpus reads + one pure-constant runtime import — no engine
 * state, no rng, no clock; byte-inert to first paint and to every golden.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { DEFAULT_SIMULATION_RULES } from '../../src/domain/worldPulse/simulationRules.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const WORLD_PULSE = join(ROOT, 'src', 'domain', 'worldPulse');
const SELF = relative(ROOT, fileURLToPath(import.meta.url)).replace(/\\/g, '/');
const BASELINE_PATH = join(ROOT, 'tests', 'fixtures', 'mechanism-lit-coverage-baseline.json');

// A test whose filename marks it as a DARK proof (flag-off dormancy golden or
// cross-path byte-identity pin) cannot claim AUTO lit credit for a module.
const NON_LIT_RE = /(dormanc|byteidentity)/i;

// ── AXIS 1 denominator: every flat worldPulse module ─────────────────────────
const mechanisms = readdirSync(WORLD_PULSE)
  .filter((f) => f.endsWith('.js'))
  .map((f) => f.replace(/\.js$/, ''))
  .sort();

// Modules that are NOT mechanisms — nothing runs, so nothing can run lit. Each
// exemption is guarded below: the file must still have ZERO runtime exports
// (if it ever grows one, it stops being exempt and reds until covered).
const NON_MECHANISM = Object.freeze({
  pulseShapes: 'typedef-only JSDoc shape module — zero runtime exports, nothing to drive lit',
});
// Permits the bare `export {};` module marker; catches declarations, default,
// re-export-all, and any non-empty export list.
const RUNTIME_EXPORT_RE = () => /\bexport\s+(?:function|const|class|default)\b|\bexport\s*\*|\bexport\s*\{\s*[^\s}]/g;

// ── The test corpus ──────────────────────────────────────────────────────────
/** @param {string} dir @param {string[]} out */
function walkTests(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walkTests(p, out);
    else if (/\.test\.js$/.test(e)) out.push(p);
  }
  return out;
}
const allTests = walkTests(join(ROOT, 'tests'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();
const litEligible = allTests.filter((rel) => !NON_LIT_RE.test(rel) && rel !== SELF);

// ── AUTO credit: direct worldPulse-module imports in lit-eligible tests ──────
// Matches literal import specifiers only (static and dynamic), never a mention
// in prose or a path-join — the walker string-literal-only idiom.
const IMPORT_RES = [
  () => /from\s+['"][^'"]*\/worldPulse\/([A-Za-z0-9_.]+)\.js['"]/g,
  () => /import\(\s*['"][^'"]*\/worldPulse\/([A-Za-z0-9_.]+)\.js['"]\s*\)/g,
];
/** @param {string} code @returns {Set<string>} module basenames the code imports */
function directWorldPulseImports(code) {
  const out = new Set();
  for (const mk of IMPORT_RES) {
    for (const m of code.matchAll(mk())) out.add(m[1].replace(/\.js$/, ''));
  }
  return out;
}
/** @type {Map<string, string[]>} mechanism -> lit-eligible test files importing it */
const autoCovered = new Map();
for (const rel of litEligible) {
  for (const mech of directWorldPulseImports(readFileSync(join(ROOT, rel), 'utf8'))) {
    if (!autoCovered.has(mech)) autoCovered.set(mech, []);
    autoCovered.get(mech)?.push(rel);
  }
}

// ── REGISTRY: explicit lit proofs for indirectly-driven modules ──────────────
// Each entry was verified against receipts when added; the walker re-validates
// file existence + evidence on every run, so a reference can never go stale.
/** @type {Record<string, { file: string, evidence: string, note: string }>} */
const LIT_COVERED_BY = {
  assizeKernel: {
    file: 'tests/property/assizeDormancyGolden.test.js',
    evidence: 'ANTI-VACUITY: LIT',
    note: 'the golden’s lit half drives assizeEnabled:true through the real pulse and asserts a seated verdict beat',
  },
  chronicle: {
    file: 'tests/domain/worldPulseChronicleCuration.test.js',
    evidence: 'buildChronicleGrounding',
    note: 'drives chronicle.js’s sole export via the index barrel re-export',
  },
  commonsVoiceKernel: {
    file: 'tests/property/commonsVoiceDormancyGolden.test.js',
    evidence: 'ANTI-VACUITY',
    note: 'the golden’s lit half drives commonsVoiceEnabled:true and asserts a petition mints',
  },
  hegemony: {
    file: 'tests/domain/hegemonyRead.test.js',
    evidence: 'hegemonyRead',
    note: 'src/domain/display/hegemonyRead.js re-exports from worldPulse/hegemony.js; the test drives all four exports',
  },
  reconcile: {
    file: 'tests/domain/chronicleAndReconcile.test.js',
    evidence: 'preserveWorldConditions',
    note: 'drives isWorldAuthoredCondition/worldAuthoredConditions/preserveWorldConditions via the index barrel',
  },
  relationshipHierarchy: {
    file: 'tests/domain/relationshipHierarchyCascade.test.js',
    evidence: 'resolveRelationshipHierarchy',
    note: 'drives both exports via the index barrel re-export',
  },
  relationshipMemory: {
    file: 'tests/domain/relationshipMemory.test.js',
    evidence: 'refreshRelationshipMemory',
    note: 'the dedicated lit suite imports the module’s exports via the index barrel',
  },
  tierOutcomeApply: {
    file: 'tests/domain/evaluateInstitutionLifecycle.test.js',
    evidence: 'applyTierOutcomeToSettlement',
    note: 'tierResourceDynamics.js re-exports from ./tierOutcomeApply.js; the test imports the applier from there',
  },
};

// ── AXIS 2 denominator: every simulation-rules `<x>Enabled` flag ─────────────
const simRulesSrc = readFileSync(join(WORLD_PULSE, 'simulationRules.js'), 'utf8');
const worldPulseSources = mechanisms.map((m) => readFileSync(join(WORLD_PULSE, `${m}.js`), 'utf8'));
/** @returns {string[]} sorted flag keys */
function enumerateFlags() {
  const tokens = new Set();
  for (const m of simRulesSrc.matchAll(/\b([a-zA-Z][a-zA-Z0-9]*Enabled)\b/g)) tokens.add(m[1]);
  const fnDeclared = new Set();
  for (const src of worldPulseSources) {
    for (const m of src.matchAll(/\.([a-zA-Z][a-zA-Z0-9]*Enabled)\b/g)) tokens.add(m[1]);
    for (const m of src.matchAll(/\bfunction\s+([A-Za-z0-9_]*Enabled)\b/g)) fnDeclared.add(m[1]);
  }
  // Predicate helpers (isFaithSpreadEnabled, guardEnabled, …) are functions,
  // not rules keys — a rules key is never declared as a function.
  return [...tokens].filter((t) => !/^is[A-Z]/.test(t) && !fnDeclared.has(t)).sort();
}
const flags = enumerateFlags();

// Flag lit credit (a): a literal `<flag>: true` in ANY test file. Dormancy
// goldens count — their LIT ANTI-VACUITY halves are exactly such drives.
/** @param {string} flag */
const flagTrueRe = (flag) => new RegExp(`\\b${flag}\\s*:\\s*true\\b`);
/** @type {Map<string, string[]>} flag -> test files that drive it lit */
const flagLiteralCovered = new Map();
{
  const corpus = allTests.filter((rel) => rel !== SELF)
    .map((rel) => [rel, readFileSync(join(ROOT, rel), 'utf8')]);
  for (const flag of flags) {
    for (const [rel, code] of corpus) {
      if (flagTrueRe(flag).test(/** @type {string} */ (code))) {
        if (!flagLiteralCovered.has(flag)) flagLiteralCovered.set(flag, []);
        flagLiteralCovered.get(flag)?.push(/** @type {string} */ (rel));
      }
    }
  }
}
// Flag lit credit (b): default-true flags run lit in every defaults-driven
// pulse test (the property suite drives DEFAULT_SIMULATION_RULES constantly).
const defaultTrue = new Set(flags.filter((f) => /** @type {Record<string, unknown>} */ (DEFAULT_SIMULATION_RULES)[f] === true));

// Flag lit credit (c): explicit registry, validated like LIT_COVERED_BY.
/** @type {Record<string, { file: string, evidence: string, note: string }>} */
const FLAG_LIT_COVERED_BY = {
  allyDefenseEnabled: {
    file: 'tests/domain/allyDefense.p3.test.js',
    evidence: 'computeAllyRelief',
    note: 'drives the gated mechanism’s functions directly below the gate and asserts relief lowers the fall probability',
  },
  defenderAttritionEnabled: {
    file: 'tests/domain/defenderAttrition.spike.test.js',
    evidence: 'defenderAttritionEnabled: defenderAttrition',
    note: 'feeds the flag through a variable set true at call sites; asserts sieges wear defenders down',
  },
  economicCoupReadEnabled: {
    file: 'tests/domain/round3WaveF3Couplings.test.js',
    evidence: 'economicCoupReadEnabled',
    note: 'drives economicAdj through resolveCoupVerdict (the flag’s mechanism) and asserts the hold-chance shifts',
  },
  warForageEnabled: {
    file: 'tests/domain/warForage.p3.test.js',
    evidence: 'warForageEnabled: warForage',
    note: 'feeds the flag through a variable set true at call sites; asserts forage effects on conquest',
  },
};

// ── The gaps, computed live ──────────────────────────────────────────────────
const uncoveredMechanisms = mechanisms.filter(
  (m) => !(m in NON_MECHANISM) && !autoCovered.has(m) && !(m in LIT_COVERED_BY),
);
const uncoveredFlags = flags.filter(
  (f) => !flagLiteralCovered.has(f) && !defaultTrue.has(f) && !(f in FLAG_LIT_COVERED_BY),
);
const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));

describe('mechanism lit-coverage walker (Enforcer E-H, bar 4)', () => {
  test('the enumerations are non-vacuous (scan-rot guard)', () => {
    // A silent regex/layout change that empties an enumeration or the credit
    // scan must not turn the walker green-by-vacuity.
    expect(mechanisms.length).toBeGreaterThan(140);
    expect(flags.length).toBeGreaterThan(40);
    expect(litEligible.length).toBeGreaterThan(500);
    expect(autoCovered.size).toBeGreaterThan(100);
    expect(flagLiteralCovered.size).toBeGreaterThan(30);
  });

  test('every NON_MECHANISM exemption still has zero runtime exports', () => {
    for (const [name, why] of Object.entries(NON_MECHANISM)) {
      expect(mechanisms, `${name} exempted but absent from source — strike the exemption`).toContain(name);
      const src = readFileSync(join(WORLD_PULSE, `${name}.js`), 'utf8');
      const runtimeExports = src.match(RUNTIME_EXPORT_RE()) || [];
      // If this fires, the module grew runtime behavior and is a mechanism now:
      // remove the exemption and give it a lit proof (or a baseline entry).
      expect(runtimeExports, `${name} (${why}) now has runtime exports — it is a mechanism`).toEqual([]);
    }
  });

  test('every LIT_COVERED_BY entry is real, minimal, and evidence-backed', () => {
    for (const [mech, ref] of Object.entries(LIT_COVERED_BY)) {
      expect(mechanisms, `${mech} registered but absent from source — strike the entry`).toContain(mech);
      expect(mech in NON_MECHANISM, `${mech} is exempt AND registered — pick one`).toBe(false);
      expect(
        autoCovered.has(mech),
        `${mech} now has direct-import lit coverage (${(autoCovered.get(mech) || []).join(', ')}) — strike its registry entry`,
      ).toBe(false);
      expect(allTests, `${mech}: registered lit proof ${ref.file} does not exist`).toContain(ref.file);
      expect(NON_LIT_RE.test(ref.file) && !/ANTI-VACUITY|LIT/.test(ref.evidence), `${mech}: a dark-proof file needs lit-section evidence`).toBe(false);
      const code = readFileSync(join(ROOT, ref.file), 'utf8');
      expect(code.includes(ref.evidence), `${mech}: evidence "${ref.evidence}" no longer appears in ${ref.file}`).toBe(true);
    }
  });

  test('every FLAG_LIT_COVERED_BY entry is real, minimal, and evidence-backed', () => {
    for (const [flag, ref] of Object.entries(FLAG_LIT_COVERED_BY)) {
      expect(flags, `${flag} registered but absent from the flag denominator — strike the entry`).toContain(flag);
      expect(
        flagLiteralCovered.has(flag),
        `${flag} now has a literal lit drive (${(flagLiteralCovered.get(flag) || []).join(', ')}) — strike its registry entry`,
      ).toBe(false);
      expect(defaultTrue.has(flag), `${flag} is default-true — strike its registry entry`).toBe(false);
      expect(allTests, `${flag}: registered lit proof ${ref.file} does not exist`).toContain(ref.file);
      const code = readFileSync(join(ROOT, ref.file), 'utf8');
      expect(code.includes(ref.evidence), `${flag}: evidence "${ref.evidence}" no longer appears in ${ref.file}`).toBe(true);
    }
  });

  test('THE RATCHET (modules): the lit-coverage gap exactly equals the shrink-only baseline', () => {
    // A NEW name here = a mechanism shipping without a lit walkthrough — write
    // its flag-ON lit test (or a validated LIT_COVERED_BY entry). A STALE
    // baseline name = coverage landed — strike it from the baseline. A GHOST
    // baseline name (mechanism deleted) = strike it too.
    expect(uncoveredMechanisms).toEqual(baseline.mechanisms);
  });

  test('THE RATCHET (flags): the flag lit-coverage gap exactly equals the shrink-only baseline', () => {
    expect(uncoveredFlags).toEqual(baseline.flags);
  });

  test('every baseline entry still names a live source mechanism/flag (no ghosts)', () => {
    for (const m of baseline.mechanisms) {
      expect(mechanisms, `baseline mechanism ${m} no longer exists in source — strike it`).toContain(m);
    }
    for (const f of baseline.flags) {
      expect(flags, `baseline flag ${f} no longer exists in source — strike it`).toContain(f);
    }
  });

  describe('the detectors discriminate (positive controls)', () => {
    test('the import scan matches real import forms and ignores prose/path mentions', () => {
      expect([...directWorldPulseImports(
        "import { momentum } from '../../src/domain/worldPulse/momentum.js';",
      )]).toEqual(['momentum']);
      expect([...directWorldPulseImports(
        "const m = await import('../../src/domain/worldPulse/navalKernel.js');",
      )]).toEqual(['navalKernel']);
      // A comment or a path-join mention is NOT an import — no false credit.
      expect(directWorldPulseImports('// see worldPulse/momentum.js for the kernel').size).toBe(0);
      expect(directWorldPulseImports("join(ROOT, 'src', 'domain', 'worldPulse')").size).toBe(0);
    });

    test('the flag-lit detector matches only a literal true drive', () => {
      expect(flagTrueRe('momentumEnabled').test('rules = { momentumEnabled: true }')).toBe(true);
      expect(flagTrueRe('momentumEnabled').test('rules = { momentumEnabled: false }')).toBe(false);
      expect(flagTrueRe('momentumEnabled').test("'momentumEnabled'")).toBe(false);
      expect(flagTrueRe('navalEnabled').test('navalEnabledX: true')).toBe(false);
    });

    test('the dark-proof filter excludes dormancy/byte-identity files and keeps lit tests', () => {
      expect(NON_LIT_RE.test('tests/property/momentumDormancyGolden.test.js')).toBe(true);
      expect(NON_LIT_RE.test('tests/domain/advanceWorkerByteIdentity.test.js')).toBe(true);
      expect(NON_LIT_RE.test('tests/domain/momentum.test.js')).toBe(false);
    });

    test('the runtime-export guard permits the bare module marker and catches real exports', () => {
      expect('export {};'.match(RUNTIME_EXPORT_RE())).toBeNull();
      expect('export { stablePart };'.match(RUNTIME_EXPORT_RE())).not.toBeNull();
      expect("export * from './stablePart.js';".match(RUNTIME_EXPORT_RE())).not.toBeNull();
      expect('export function advance() {}'.match(RUNTIME_EXPORT_RE())).not.toBeNull();
      expect('export default TUNING;'.match(RUNTIME_EXPORT_RE())).not.toBeNull();
    });

    test('an uncovered synthetic mechanism would red the ratchet (the guard fires)', () => {
      const synthetic = ['aBrandNewKernel', ...mechanisms].sort();
      const gap = synthetic.filter(
        (m) => !(m in NON_MECHANISM) && !autoCovered.has(m) && !(m in LIT_COVERED_BY),
      );
      expect(gap).toContain('aBrandNewKernel');
      expect(gap).not.toEqual(baseline.mechanisms);
    });
  });
});
