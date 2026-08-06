/**
 * errandConsumerRegistry.walker.test.js — SP-D. THE CONSUMER REGISTRATION TRIPWIRE, both
 * ways, plus the one-reader law that keeps the conditional class field readable.
 *
 * ── WHY A TRIPWIRE AT ALL ────────────────────────────────────────────────────────
 * J-SP-2 makes `worldState.envoyErrands` the estate's ONE purposeful-travel substrate, and
 * five unbuilt volumes are supposed to mint through it: TRADE's factors, FAITH's legates
 * and pilgrims, ES-1/IN-4's couriers, INTERIOR's emigres. "Supposed to" is not a mechanism.
 * The failure this file forecloses is the ordinary one: a volume lands, needs a traveller,
 * finds the errand seam slightly awkward for its case, and opens a second ledger — and
 * nobody notices until two subsystems disagree about where a named person is. So the map
 * is FROZEN in the vocabulary leaf and measured in BOTH directions:
 *
 *   UNREGISTERED MINTER REDS — a module that reaches the generalized mint head without a
 *     registry row fails.
 *   CONSUMERLESS ROW REDS — a row claiming `built: true` whose module does not mint fails,
 *     and a row claiming `built: false` whose module DOES mint fails. A registry that
 *     drifts into fiction is worse than no registry: it reports coverage it does not have.
 *
 * ── REPAIR SP-D-R1: THE MINT DETECTOR RESOLVES THE IMPORTED BINDING ──────────────
 * THE FIRST SPELLING OF THIS FILE MATCHED A LITERAL, and its header claimed the signature
 * "cannot be dodged by spelling". THAT CLAIM WAS MEASURED FALSE. A planted module spelled
 *
 *     import { mintErrandSpine as mint } from './errandMint.js';
 *     return mint({ worldState, purpose: 'sue' });
 *
 * minted through the head and left this walker at 7 passed (7) — while the SAME module
 * spelled with the literal name reddened two tests. An unregistered minter could therefore
 * open the second purposeful-travel substrate this file exists to prevent, by renaming an
 * import. This is the estate's recorded CREDIT-SIDE-ENUMERATION-FAILS-OPEN class, whose
 * cure is written down and is NOT a longer list of literals: resolve the IMPORTED BINDING
 * and treat every local alias as a call name.
 *
 * So the detector below is a TOTAL POSITIVE predicate over the module graph:
 *   1. Find every module that EXPORTS the mint head — the definition site, plus any module
 *      that re-exports it, to a fixed point. (`envoyErrand.js` really does re-export it, so
 *      this hop is load-bearing rather than hypothetical.)
 *   2. For each source file, resolve its imports FROM those modules and collect the LOCAL
 *      names the head arrived under: plain, `as`-renamed, and namespace
 *      (`ns.mintErrandSpine`), including the destructured dynamic-import form.
 *   3. A module mints if it CALLS any of those local names.
 * The literal spelling remains in the union as a belt, never as the load-bearing half.
 *
 * ── AND THE ONE-READER LAW ───────────────────────────────────────────────────────
 * `purposeClass` is ABSENT on every legacy row and on every errand the war path mints,
 * because the mapping row derives `diplomatic` for the war purposes (that is what buys
 * SP-D its no-migration promise). A consumer that reads `errand.purposeClass` DIRECTLY
 * therefore sees `undefined` on exactly the rows that are most common, and would file a
 * peace embassy under no class at all. One reader, `purposeClassOf`, and the scan below
 * holds the estate to it — the writer/reader spelling-drift class, one field wide.
 *
 * ── REPAIR SP-D-R2: THE LAW NOW COVERS `src/`, AND THREE SPELLINGS ───────────────
 * The first spelling scanned `src/domain` ONLY, and matched `.field` ONLY. Both holes were
 * MEASURED, not theorised. A planted `src/store/spinePeekProbe.js` containing the exact
 * offender spelling `errand.purposeClass === 'covert'` left this walker GREEN, because
 * src/store, src/components and src/hooks were outside the scanned tree — and the UI layer
 * is precisely where a veil leak reaches a player. A planted module destructuring
 * (`const { truePurpose } = errand;`) or reaching by computed access
 * (`errand['truePurpose']`) left it green too, INSIDE the scanned tree.
 *
 * The scan is therefore the whole of `src/` (js and jsx), and the detector is three
 * spellings — member access, computed access, and a genuine BINDING/LITERAL PATTERN. The
 * pattern half is element-precise rather than brace-greedy on purpose: a certification
 * row's English prose names all three fields inside an object literal, and a greedy brace
 * match reads that sentence as a destructure. An element must BE the field name, optionally
 * renamed or defaulted — never a field name with words around it.
 *
 * `envoyErrand.js` JOINS THE FAMILY, AND THAT IS A DELIBERATE, RECORDED LOOSENING
 * (J-SP-D-R3). It is the writer family's HEAD — `envoyErrandRecords.js`'s own header names
 * it so — and its only spelling of the three words is `mintEnvoyErrand`'s parameter list,
 * which ACCEPTS caller cargo and forwards it unread to `errandMint.js`. That is the one
 * lawful accept-and-forward in the tree. The loosening is one file wide and is bought many
 * times over by the two widenings above: the law went from 1 spelling over ~200 files to
 * 3 spellings over 2,000+.
 *
 * BOTH HALVES CARRY POSITIVE CONTROLS. A scanner that stopped matching would report no
 * offenders and pass having proved nothing, so each detector is driven against planted
 * sources that MUST red before any absence is asserted — and for the mint detector that
 * now means the aliased and namespaced spellings too, which are the ones that escaped.
 *
 * @enforced-by itself (a source scan; no runtime coupling)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  ENVOY_PURPOSE_CLASSES,
  ERRAND_CONSUMERS,
} from '../../src/domain/worldPulse/envoyErrandVocabulary.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** The mint head's own home — the definition site, never a consumer of itself. */
const MINT_HOME = 'src/domain/worldPulse/errandMint.js';
const MINT_EXPORT = 'mintErrandSpine';

/**
 * THE ERRAND FAMILY. These files own the row's shape and are the lawful direct readers of
 * the three conditional fields; everyone else goes through the vocabulary's readers or the
 * projection's audience split. `envoyErrand.js` is here as the family HEAD — see the
 * repair note above; it accepts mint cargo and forwards it without reading it.
 */
const FAMILY = Object.freeze([
  'src/domain/worldPulse/envoyErrand.js',
  'src/domain/worldPulse/errandMint.js',
  'src/domain/worldPulse/envoyErrandVocabulary.js',
  'src/domain/worldPulse/envoyErrandRecords.js',
  'src/domain/worldPulse/envoyErrandProjection.js',
]);

const FIELDS = 'purposeClass|declaredPurpose|truePurpose';

/** A direct property read of one of the three conditional fields. */
const RAW_FIELD_RE = new RegExp(`\\.\\s*(?:${FIELDS})\\b`);

/** `errand['truePurpose']` — the same read, spelled past a `.field` detector. */
const COMPUTED_FIELD_RE = new RegExp(`\\[\\s*['"\`](?:${FIELDS})['"\`]\\s*\\]`);

/** One element of a binding/object pattern that IS one of the fields. */
const PATTERN_ELEMENT_RE = new RegExp(
  `^\\s*(?:${FIELDS})\\s*(?::\\s*[A-Za-z_$][\\w$]*)?(?:=[^,]*)?\\s*$`,
);

/** Strip comments so prose cannot make a module look like a minter, or hide one. */
function executableSource(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

/**
 * A destructuring binding or an object literal naming one of the fields. Element-precise:
 * `{ truePurpose }`, `{ truePurpose: t }` and `{ truePurpose = null }` all match; an
 * English sentence that happens to contain the word inside some enclosing brace does not.
 */
function readsByPattern(code) {
  for (const group of code.match(/\{[^{}]*\}/g) || []) {
    const inner = group.slice(1, -1);
    if (inner.split(',').some((element) => PATTERN_ELEMENT_RE.test(element))) return true;
  }
  return false;
}

function readsAField(code) {
  return RAW_FIELD_RE.test(code) || COMPUTED_FIELD_RE.test(code) || readsByPattern(code);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(path);
  }
  return out;
}

const srcFiles = walk(SRC).map((absolute) => ({
  rel: relative(ROOT, absolute).replace(/\\/g, '/'),
  code: executableSource(readFileSync(absolute, 'utf8')),
}));

/** Resolve a RELATIVE import specifier to a repo-relative path, or null. */
function resolveSpec(fromRel, spec) {
  if (!spec.startsWith('.')) return null;
  return relative(ROOT, resolve(dirname(join(ROOT, fromRel)), spec)).replace(/\\/g, '/');
}

/** `export { a as b } from './x.js'` triples. */
function reExports(code) {
  const out = [];
  const re = /export\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g;
  for (const [, names, spec] of code.matchAll(re)) {
    for (const raw of names.split(',')) {
      const [source, local] = raw.split(/\s+as\s+/).map((part) => part.trim());
      if (source) out.push({ source, local: local || source, spec });
    }
  }
  return out;
}

/**
 * EVERY MODULE THAT HANDS OUT THE MINT HEAD, to a fixed point: the definition site plus
 * every re-export home, each mapped to the NAMES it publishes the head under. Without this
 * hop an importer of `envoyErrand.js` — which really does re-export the head — would be
 * invisible to the resolver below.
 * @returns {Map<string, Set<string>>}
 */
function mintExportHomes(files) {
  const homes = new Map([[MINT_HOME, new Set([MINT_EXPORT])]]);
  for (let pass = 0; pass < 8; pass += 1) {
    let grew = false;
    for (const { rel, code } of files) {
      for (const { source, local, spec } of reExports(code)) {
        const from = resolveSpec(rel, spec);
        if (!from || !homes.get(from)?.has(source)) continue;
        const mine = homes.get(rel) || new Set();
        if (!mine.has(local)) {
          mine.add(local);
          homes.set(rel, mine);
          grew = true;
        }
      }
    }
    if (!grew) break;
  }
  return homes;
}

const EXPORT_HOMES = mintExportHomes(srcFiles);

/**
 * THE LOCAL NAMES the mint head arrived under in one module — plain, renamed, namespaced,
 * and the destructured dynamic-import form. This is the total-positive half of the repair.
 * @returns {string[]}
 */
function mintLocalNames(rel, code, homes = EXPORT_HOMES) {
  const names = new Set();
  const take = (spec, pick) => {
    const from = resolveSpec(rel, spec);
    const published = from && homes.get(from);
    if (published) pick(published);
  };
  const named = (block, published) => {
    for (const raw of block.split(',')) {
      const [source, local] = raw.split(/\s+as\s+/).map((part) => part.trim());
      if (source && published.has(source)) names.add(local || source);
    }
  };
  const staticRe = /import\s*(?:\{([^}]*)\}|\*\s*as\s*([A-Za-z_$][\w$]*))\s*from\s*['"]([^'"]+)['"]/g;
  for (const [, block, namespace, spec] of code.matchAll(staticRe)) {
    take(spec, (published) => {
      if (block != null) named(block, published);
      if (namespace) for (const name of published) names.add(`${namespace}.${name}`);
    });
  }
  const dynamicRe = /\{([^}]*)\}\s*=\s*(?:await\s+)?import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const [, block, spec] of code.matchAll(dynamicRe)) take(spec, (p) => named(block, p));
  const nsDynamicRe = /([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const [, local, spec] of code.matchAll(nsDynamicRe)) {
    take(spec, (published) => {
      for (const name of published) names.add(`${local}.${name}`);
    });
  }
  return [...names];
}

const escapeRe = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Does this module CALL the head, under whatever name it arrived as? */
function mints(rel, code) {
  // The literal spelling stays in the union as a belt — never as the load-bearing half.
  if (new RegExp(`\\b${MINT_EXPORT}\\s*\\(`).test(code)) return true;
  return mintLocalNames(rel, code)
    .some((local) => new RegExp(`(?:^|[^\\w$.])${escapeRe(local)}\\s*\\(`).test(code));
}

/** Every module that mints through the spine, excluding the head's own home. */
const minters = srcFiles
  .filter(({ rel, code }) => rel !== MINT_HOME && mints(rel, code))
  .map(({ rel }) => rel)
  .sort();

const registeredModules = ERRAND_CONSUMERS.map((row) => row.module);
const builtModules = ERRAND_CONSUMERS.filter((row) => row.built).map((row) => row.module).sort();

describe('SP-D errand consumer registry — the map itself', () => {
  test('guard the guard: the scan is populated and the field detectors discriminate', () => {
    // A collapsed walk would make every absence below trivially true.
    expect(srcFiles.length, 'the src scan emptied').toBeGreaterThan(1500);
    expect(
      srcFiles.filter(({ rel }) => rel.startsWith('src/domain/')).length,
      'the domain half of the scan emptied',
    ).toBeGreaterThan(200);
    expect(ERRAND_CONSUMERS.length, 'the registry emptied').toBeGreaterThanOrEqual(6);
    // The scan really does now reach the layers the first spelling could not see.
    for (const prefix of ['src/store/', 'src/components/']) {
      expect(
        srcFiles.some(({ rel }) => rel.startsWith(prefix)),
        `${prefix} is outside the scan — the R2 widening regressed`,
      ).toBe(true);
    }
    // POSITIVE CONTROL for the raw-field detector, and the lawful reader it must not flag.
    expect(RAW_FIELD_RE.test('if (errand.purposeClass === "covert") run();')).toBe(true);
    expect(RAW_FIELD_RE.test('if (purposeClassOf(errand) === "covert") run();')).toBe(false);
    // POSITIVE CONTROLS for the two spellings that ESCAPED the first detector.
    expect(COMPUTED_FIELD_RE.test('return errand["truePurpose"];')).toBe(true);
    expect(COMPUTED_FIELD_RE.test('return errand[somethingElse];')).toBe(false);
    expect(readsByPattern('const { purposeClass, truePurpose } = errand;')).toBe(true);
    expect(readsByPattern('const { truePurpose: t } = errand;')).toBe(true);
    expect(readsByPattern('function f({ purposeClass = null }) { return f; }')).toBe(true);
    // ...and the prose false-positive the element-precise form exists to reject.
    expect(readsByPattern(
      "({ description: 'no row grows a purposeClass, declaredPurpose or truePurpose key' })",
    )).toBe(false);
    expect(readsByPattern('const { purposeClassOf } = readers;')).toBe(false);
    // ⚠ AND THE COMPOSITION ITSELF, DOOR BY DOOR. Pinning the three regexes individually
    // is NOT enough and this was MEASURED: with only the regex assertions above, deleting
    // `COMPUTED_FIELD_RE.test(code)` from `readsAField` left this file at 8 passed (8) —
    // the door was gone and nothing reddened, because no module in the tree uses that
    // spelling today. A predicate assembled from three halves needs each half driven
    // THROUGH the predicate, or defense-in-depth hides its own deletion.
    expect(readsAField("if (errand.purposeClass === 'covert') run();"), 'the .field door').toBe(true);
    expect(readsAField('return errand["truePurpose"];'), 'the computed door').toBe(true);
    expect(readsAField('const { truePurpose } = errand;'), 'the pattern door').toBe(true);
    expect(readsAField('return purposeClassOf(errand);'), 'the lawful reader').toBe(false);
  });

  test('guard the guard: the MINT detector resolves aliases, namespaces and re-export hops', () => {
    const probe = 'src/domain/worldPulse/__probe.js';
    // THE THREE SPELLINGS. The last two are the ones a literal matcher misses entirely;
    // the aliased one was EXECUTED against the first spelling of this file and PASSED it.
    expect(mints(probe, "import { mintErrandSpine } from './errandMint.js';\nmintErrandSpine({});"))
      .toBe(true);
    expect(mints(probe, "import { mintErrandSpine as mint } from './errandMint.js';\nmint({});"))
      .toBe(true);
    expect(mints(probe, "import * as spine from './errandMint.js';\nspine.mintErrandSpine({});"))
      .toBe(true);
    // THE RE-EXPORT HOP: arriving through the family head must resolve just as well.
    expect(mints(probe, "import { mintErrandSpine as go } from './envoyErrand.js';\ngo({});"))
      .toBe(true);
    // NEGATIVE CONTROLS: importing without calling is not minting, an alias of an
    // unrelated export is not minting, and prose is not minting.
    expect(mints(probe, "import { mintErrandSpine as mint } from './errandMint.js';\nexport { mint };"))
      .toBe(false);
    expect(mints(probe, "import { purposeClassOf as mint } from './envoyErrandVocabulary.js';\nmint({});"))
      .toBe(false);
    expect(mints(probe, executableSource('// a volume would call mintErrandSpine(here)')))
      .toBe(false);
    // The resolver really did learn the re-export home, rather than passing by accident.
    expect(EXPORT_HOMES.has('src/domain/worldPulse/envoyErrand.js'), 're-export hop not resolved')
      .toBe(true);
  });

  test('every row names a lawful class, and every class is claimed', () => {
    for (const row of ERRAND_CONSUMERS) {
      expect(ENVOY_PURPOSE_CLASSES, `${row.consumer}: ${row.purposeClass} is not a class`)
        .toContain(row.purposeClass);
      expect(typeof row.wave, `${row.consumer}: a row names the wave that owes it`).toBe('string');
      expect(row.wave.length).toBeGreaterThan(1);
      expect(typeof row.built).toBe('boolean');
    }
    // TOTALITY: the six classes exist because six kinds of business exist, and each has
    // somebody who will mint it. A class nobody claims is a word with no future.
    const claimed = new Set(ERRAND_CONSUMERS.map((row) => row.purposeClass));
    expect([...claimed].sort()).toEqual([...ENVOY_PURPOSE_CLASSES].sort());
    // Consumer names and module addresses are unique, or "which one is built" is unanswerable.
    expect(new Set(registeredModules).size).toBe(registeredModules.length);
    expect(new Set(ERRAND_CONSUMERS.map((r) => r.consumer)).size).toBe(ERRAND_CONSUMERS.length);
  });
});

describe('SP-D errand consumer registry — BOTH WAYS against the tree', () => {
  test('DIRECTION 1: every module that mints is registered', () => {
    const unregistered = minters.filter((rel) => !registeredModules.includes(rel));
    expect(
      unregistered,
      'a module mints errands with no row in ERRAND_CONSUMERS. Add its row (consumer,'
      + ' purposeClass, module, wave, built:true) in the SAME commit — an unregistered'
      + ' minter is how a second purposeful-travel substrate gets built by accident.',
    ).toEqual([]);
    // NON-VACUITY: somebody really does mint today, so direction 1 measures something.
    expect(minters.length, 'nothing mints — the direction-1 filter is empty').toBeGreaterThan(0);
  });

  test('DIRECTION 2: every BUILT row really mints, and every UNBUILT row really does not', () => {
    const problems = [];
    for (const row of ERRAND_CONSUMERS) {
      const isMinter = minters.includes(row.module);
      const exists = existsSync(join(ROOT, row.module));
      if (row.built && !isMinter) {
        problems.push(`${row.consumer}: row claims built:true but ${row.module} `
          + `${exists ? 'does not reach mintErrandSpine' : 'does not exist'}`);
      }
      if (!row.built && isMinter) {
        problems.push(`${row.consumer}: ${row.module} now mints — flip built:true in the`
          + ` same commit as ${row.wave}'s landing`);
      }
    }
    expect(problems, 'the errand consumer registry drifted from the tree').toEqual([]);
    // The partition is a MEASUREMENT only if both halves are non-empty: all-built or
    // all-unbuilt would make every row agree with the tree for free.
    expect(builtModules.length, 'no consumer is built — direction 2 proves nothing')
      .toBeGreaterThan(0);
    expect(
      ERRAND_CONSUMERS.filter((row) => !row.built).length,
      'every consumer is built — the pre-pin toward the unbuilt volumes has expired,'
      + ' which is a real event and wants a look',
    ).toBeGreaterThan(0);
  });

  test('the TWO built consumers today are the war errand head and the pact proposals', () => {
    // Recorded as a fact rather than assumed, and the fact MOVED at FP GR-2 (2026-08-06):
    // the spine's whole purpose is to be minted through by more than one lane, and this is
    // the first lane to do it. The remaining four pre-pins still point at volumes that have
    // not landed, so the built/unbuilt partition above is still a real measurement.
    //
    // THAT THE SECOND CONSUMER IS *NOT* A NEW `*Errand.js` FILE IS THE POINT. The registry's
    // unbuilt rows all name a prospective module of their own; GR-2 instead mints from the
    // ledger writer that creates the thing being carried, because a pact proposal has no
    // life of its own outside that row. A wave that felt it needed a private errand module
    // to travel would be building the second substrate this registry exists to prevent.
    expect(builtModules).toEqual([
      'src/domain/worldPulse/envoyErrand.js',
      'src/domain/worldPulse/pactProposals.js',
    ]);
    expect(minters).toEqual([
      'src/domain/worldPulse/envoyErrand.js',
      'src/domain/worldPulse/pactProposals.js',
    ]);
  });
});

describe('SP-D one-reader law — the conditional fields have exactly one reader', () => {
  test('no module outside the errand family reads purposeClass/declaredPurpose/truePurpose directly', () => {
    const offenders = srcFiles
      .filter(({ rel }) => !FAMILY.includes(rel))
      .filter(({ code }) => readsAField(code))
      .map(({ rel }) => rel)
      .sort();
    expect(
      offenders,
      'a direct read of a DROP-WHEN-DERIVABLE field. `purposeClass` is absent on every'
      + ' legacy row and on every war errand, so a direct read returns undefined exactly'
      + ' where it matters — use purposeClassOf / declaredPurposeClassOf, or'
      + ' projectErrandPurpose for an audience-side read. This scan covers ALL of src/,'
      + ' including store, components and hooks, and all three spellings.',
    ).toEqual([]);
    // NON-VACUITY: the family members really do read the fields, so an empty offender set
    // is a measurement rather than a regex that stopped matching. TOTALITY, not a count:
    // every declared family member must be a live reader, or the list is carrying a name
    // that buys an exemption it no longer needs.
    const familyReaders = srcFiles
      .filter(({ rel, code }) => FAMILY.includes(rel) && readsAField(code))
      .map(({ rel }) => rel)
      .sort();
    expect(familyReaders, 'the family stopped reading the fields — the scan broke')
      .toEqual([...FAMILY].sort());
  });

  test('the two readers are declared exactly once each, in the vocabulary leaf', () => {
    const declarations = (name) => srcFiles
      .filter(({ code }) => new RegExp(`function\\s+${name}\\s*\\(`).test(code))
      .map(({ rel }) => rel);
    // A second definition anywhere is the collision class SP-C was bitten by, and it would
    // let two modules disagree about what an errand is while both look correct.
    expect(declarations('purposeClassOf')).toEqual(['src/domain/worldPulse/envoyErrandVocabulary.js']);
    expect(declarations('declaredPurposeClassOf')).toEqual(['src/domain/worldPulse/envoyErrandVocabulary.js']);
  });
});
