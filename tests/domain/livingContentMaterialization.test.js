/**
 * The living-content materialization law: DARK BY CONSTRUCTION, and it pays
 * ODQ §866's generation-side bill without crossing the adoption line.
 *
 * ⛔ WHAT §866 FOUND, AND WHAT TE-INSTR-1 RE-MEASURED. The presentation-claim
 * instrument (`customContentPresentationClaims.test.js`) asserts that flipping a
 * presentation-only field leaves the canonical mechanics digest unchanged. §866
 * ruled the `deities.*` cases VACUOUS — the pipeline emits
 * `primaryDeitySnapshot: undefined`, so the flip moves an input nothing reads
 * and the digests match for a reason with nothing to do with neutrality. The
 * instrument repair (`f777abd4d`) re-measured that vacuity with the instrument's
 * OWN mutation values and its OWN comparator and found it TWICE as wide: 26 of
 * 52 cases, four whole categories — stressors(6), deities(3), traditions(4),
 * factions(13) — one mechanism, four times over. Those four categories'
 * definitions never materialize into a generated settlement at all.
 *
 * That repair named the remainder and capped it rather than paying it:
 * "Making `stressors`/`deities`/`traditions`/`factions` materialize —
 * GENERATION-SIDE, outside a guard repair." This file is that remainder, and it
 * is deliberately built so that paying it moves not one same-seed byte.
 *
 * ⭐⭐ MATERIALIZATION IS NOT ADOPTION. `tests/fixtures/customContentReferencePack.js`
 * states the governing law in its own header: the living-content definitions
 * "deliberately have no automatic activation event: their presence in a reviewed
 * environment must not make a generated settlement silently adopt a deity,
 * faction, stressor, or tradition." Both halves are held here at once:
 *
 *   • the definitions become PRESENT (an inert roster on one additive key), so
 *     the 26 blind cases acquire a subject and start proving something;
 *   • the settlement never ADOPTS them — `settlement.factions`,
 *     `settlement.stressors`, `settlement.traditions` and
 *     `config.primaryDeitySnapshot` stay free of custom definitions even when
 *     the law is LIT, and the arm below pins that so crossing the line reds.
 *
 * ⛔ THE DARK CLAUSE IS THE POINT. The dial sits at v1 and the roster is
 * unreachable from the product, so every world the product mints is
 * byte-identical to one generated before this law existed. Lighting it is a
 * SEPARATE owner decision. Everything here is therefore REGRESSION-grade under
 * the dark arm and DISCOVERY-grade only under the lit one, and this file says
 * which is which rather than presenting one green as both.
 *
 * ⚠ THE MUTATION VOCABULARY BELOW IS A PORT, NOT A SECOND OPINION. `alternativeValue`
 * and `variantFor` mirror `customContentPresentationClaims.test.js` so this
 * file's aliveness claim is stated in the instrument's own terms — a claim that
 * the 26 come alive is worth nothing if measured with a friendlier mutation than
 * the one that found them blind. That instrument currently lives on a sibling
 * line (`f777abd4d`, not an ancestor of this tree); WHEN THE TWO LINES MEET, the
 * shared vocabulary should collapse into one exported fixture helper and this
 * copy should be deleted. Recorded as owed rather than left to be re-found.
 */

import { describe, expect, it, vi } from 'vitest';

import {
  admitCustomContentDefinition,
  CUSTOM_CONTENT_MANIFEST,
} from '../../src/domain/content/customContentManifest.js';
import {
  LIVING_CONTENT_BUCKETS,
  NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
  newSettlementLivingContentLaw,
} from '../../src/domain/content/livingContentLaw.js';
// THE GATE IS THE LEAF'S. The version vocabulary and the closed membership test
// live on the ENGINE side of the lazy boundary, because the synchronous pipeline
// must answer dormant-or-lit before anything is loaded — and they live in a
// dependency-free leaf rather than in the seam because the seam/roster/law trio
// was otherwise a 3-module import cycle (tests/architecture/layerBoundaries).
import {
  DEFAULT_LIVING_CONTENT_LAW_VERSION,
  LIVING_CONTENT_LAW_CONFIG_KEY,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
  materializesLivingContent,
  readLivingContentLawVersion,
} from '../../src/domain/content/livingContentLawVersion.js';
// The REGISTRY half is still the seam's, and arming it here is what lets a lit arm
// run WITHOUT awaiting anything: production reaches the same builder through
// `loadGenerationLawPayloads()` (lane LIGHT, car 1a), which is async by nature.
import {
  registerLivingContentRosterBuilder,
} from '../../src/domain/content/livingContentSeam.js';
import {
  LIVING_CONTENT_ADOPTION_SURFACES,
  LIVING_CONTENT_ROSTER_SCHEMA_VERSION,
  buildLivingContentRoster,
} from '../../src/domain/content/livingContentRoster.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  customContentReferencePack,
  identifyCustomContentPack,
} from '../fixtures/customContentReferencePack.js';

// ⛔ THE SEAM MUST BE ARMED BEFORE ANY LIT PIPELINE RUN. The roster payload is
// reached through a dynamic import in production (livingContentSeam.js), and the
// pipeline throws rather than quietly degrading when a v2 world finds no builder
// registered. Registering the real builder here is what makes every lit arm below
// exercise the path production takes after `loadGenerationLawPayloads()`.
// ⭐ "TAKES", NOT "WOULD TAKE", AND THE TENSE MOVED ON THE LIGHTING DAY (lane LIGHT,
// car 1a). The two files that carried the "WOULD" correction (§912 R-J, §913) were
// right at the time: nothing in `src/` called the loader, so production reached the
// throw and not the builder, and this hand-registration was the only thing making a
// lit roster reachable in the estate. The loader now has a caller on every path that
// can reach the pipeline, held to the tree by
// `tests/lint/densityCreateBoundary.walker.test.js`. The registration stays because
// this file is SYNCHRONOUS and the product's edge is async, not because the product
// still cannot arm itself.
registerLivingContentRosterBuilder(buildLivingContentRoster);

const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  monsterThreat: 'civilized',
});

const LIT_CONFIG = Object.freeze({
  ...CONFIG,
  [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
});

/** The roster's key on the settlement — the ONE key this law may write. */
const ROSTER_KEY = 'customContentRoster';

// ── THE 26, EXACT AND PER CASE ────────────────────────────────────────────────
// Copied from the instrument's `DISCOVERY_BLIND_CASES` (`f777abd4d`) rather than
// recounted here, because the whole claim of this file is that THESE cases — the
// ones measured blind — come alive. A recount could agree with itself while
// disagreeing with the instrument, which is the one thing that would make the
// proof meaningless.
const BLIND_CASE_KEYS = Object.freeze([
  'stressors.name', 'stressors.description', 'stressors.severity', 'stressors.affects',
  'stressors.disablesInstitutions', 'stressors.disablesGoods',
  'deities.name', 'deities.temperamentAxis', 'deities.portfolio',
  'traditions.name', 'traditions.motifElement', 'traditions.motifAct', 'traditions.epithet',
  'factions.name', 'factions.authority', 'factions.archetype', 'factions.agenda',
  'factions.scale', 'factions.methods', 'factions.magical', 'factions.criminal',
  'factions.defenseRole', 'factions.description', 'factions.tierMin', 'factions.controls',
  'factions.rivals',
]);

/** MONOTONE-DOWN literals, not figures read out of the list they cap. A ceiling
 *  derived from its own ledger proves list === list and rises silently with
 *  every row added. */
const BLIND_CASE_COUNT = 26;
const BLIND_BUCKET_COUNT = 4;

const REFERENCE_BY_CATEGORY = Object.freeze({
  factions: 'custom:reference-aurora-compact',
  institutions: 'custom:reference-aurora-cart-shed',
  tradeGoods: 'custom:reference-aurora-field-rations',
});

/** Ported from the instrument. See the file header on why, and on its deletion. */
function alternativeValue(bucket, field, current) {
  if (field.type === 'boolean') return current === true ? false : true;
  if (field.type === 'enum') {
    const values = Array.isArray(field.values) ? field.values : [];
    const alternative = values.find(value => value !== current);
    if (alternative !== undefined) return alternative;
    throw new Error(`${bucket}.${field.key} has no alternative enum value.`);
  }
  if (field.type === 'string') {
    if (field.key === 'name') {
      const adversarialNames = {
        stressors: 'Famine Plague Siege Occupied War Mass Migration',
        factions: 'Royal Merchant Guild Criminal Church Military',
        deities: 'War Death Harvest Magic Law',
        traditions: 'Harvest War Magic Trade Faith',
      };
      return adversarialNames[bucket] || `${current} Revised`;
    }
    return `Alternate ${bucket} ${field.key}`;
  }
  if (field.type === 'string-or-string-list') {
    if (Array.isArray(field.values)) {
      const currentValues = new Set(Array.isArray(current) ? current : [current]);
      const alternative = field.values.find(value => !currentValues.has(value));
      return alternative === undefined ? [] : [alternative];
    }
    if (field.category) {
      const reference = REFERENCE_BY_CATEGORY[field.category];
      if (!reference) {
        throw new Error(`${bucket}.${field.key} has no reference-pack category target.`);
      }
      const currentValues = Array.isArray(current) ? current : [current];
      return currentValues.includes(reference) ? [] : [reference];
    }
    return ['alternate presentation value'];
  }
  throw new Error(`${bucket}.${field.key} has unsupported type ${field.type}.`);
}

const FIELD_BY_CASE = new Map(
  CUSTOM_CONTENT_MANIFEST.categories.flatMap(category => (
    category.authorable
      ? category.fields
        .filter(field => field.effect === 'presentation')
        .map(field => [`${category.key}.${field.key}`, { bucket: category.key, field }])
      : []
  )),
);

const BLIND_CASES = BLIND_CASE_KEYS.map((key) => {
  const found = FIELD_BY_CASE.get(key);
  if (!found) {
    throw new Error(
      `${key} names no live presentation case — the blind ledger is stale against the manifest.`,
    );
  }
  return { key, ...found };
});

/** The instrument's `variantFor`: mutate definition 0 of the bucket, re-admit. */
function variantFor({ bucket, field }) {
  const pack = customContentReferencePack();
  const definition = pack[bucket][0];
  definition[field.key] = alternativeValue(bucket, field, definition[field.key]);
  const admission = admitCustomContentDefinition(bucket, definition, {
    allowSystemFields: true,
  });
  expect(admission, `${bucket}.${field.key} variant admission`).toMatchObject({ ok: true });
  return pack;
}

function generated(pack, seed, config) {
  return generateSettlementPipeline(config, null, {
    seed,
    customContent: identifyCustomContentPack(pack),
  });
}

/** The instrument's `changedMechanicsPaths`, over UNPROJECTED settlements. */
function changedPaths(left, right, path = '$', changes = []) {
  if (Object.is(left, right)) return changes;
  if (left == null || right == null || typeof left !== 'object' || typeof right !== 'object') {
    changes.push(path);
    return changes;
  }
  if (Array.isArray(left) !== Array.isArray(right)) {
    changes.push(path);
    return changes;
  }
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of [...keys].sort()) {
    if (!Object.hasOwn(left, key) || !Object.hasOwn(right, key)) {
      changes.push(`${path}.${key}`);
      continue;
    }
    changedPaths(left[key], right[key], `${path}.${key}`, changes);
  }
  return changes;
}

/**
 * The instrument's TWO-PART DISCOVERY ANCHOR, driven under a given law.
 *
 *   `materialized` — the mutated definition's identity is actually present in
 *     the generated settlement. Spelled EXACTLY as the instrument spells it, so
 *     "the 26 come alive" means alive to the instrument and not merely to this
 *     file's own friendlier notion of presence.
 *   `reached` — what the flip moved, before any presentation strip.
 */
function probe({ key, bucket, field }, config) {
  const controlPack = customContentReferencePack();
  const variantPack = variantFor({ bucket, field });
  const subjectUid = variantPack[bucket][0].localUid;
  const seed = `living-content-materialization:${key}`;
  const control = generated(controlPack, seed, config);
  const variant = generated(variantPack, seed, config);
  const controlBlob = JSON.stringify(control);
  return {
    subjectUid,
    control,
    variant,
    materialized: Boolean(subjectUid) && (
      controlBlob.includes(`definition:${bucket}:${subjectUid}`)
      || controlBlob.includes(`"${subjectUid}"`)
    ),
    reached: changedPaths(control, variant),
  };
}

/** Every value at or under a dotted path, for the adoption sweep. */
function at(value, path) {
  return path.split('.').reduce(
    (node, key) => (node && typeof node === 'object' ? node[key] : undefined),
    value,
  );
}

/**
 * A settlement's bytes with the law marker itself removed, so the dormancy
 * comparison is of the WORLD rather than of the input bag that selected it.
 *
 * ⚠ THE MARKER RIDES TWO CONFIG ECHOES, NOT ONE — `settlement.config` AND
 * `settlement._config` — measured, not assumed: a first cut stripped only
 * `config` and the arm failed by exactly 29 bytes, which is the literal length
 * of `,"_livingContentLawVersion":3`. This is not special to this law; it is how
 * every resolved config key persists, `_seed` and `_densityLawVersion`
 * included. A future reader stripping one echo will get the same 29-byte lie.
 */
function worldBytes(settlement) {
  const strip = (bag) => {
    if (!bag || typeof bag !== 'object') return bag;
    const { [LIVING_CONTENT_LAW_CONFIG_KEY]: _marker, ...rest } = bag;
    return rest;
  };
  return JSON.stringify({
    ...settlement,
    config: strip(settlement.config),
    _config: strip(settlement._config),
  });
}

describe('living-content materialization law', () => {
  // ── THE LAW ITSELF ─────────────────────────────────────────────────────────
  it('⭐ the dial is LIT, and the mint writes the marker and nothing else', () => {
    // ⭐⭐ THIS ARM WAS `is dormant by default and the dial writes nothing`, AND IT
    // IS INVERTED RATHER THAN DELETED (2026-09-08, lane LIGHT car 1b). The owner
    // ruled the dial lit; an arm that asserted dormancy is now an arm asserting
    // the opposite of the product, and softening it to "whatever the dial says"
    // would make the flip unobservable in either direction. It still fails the
    // day the dial moves, which is the whole job of a one-line dial's arm.
    expect(NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION)
      .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(
      newSettlementLivingContentLaw(),
      'the create boundary must mint the lit marker, and exactly one key',
    ).toEqual({ [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION });
    // …and the LEAF's own closed test still answers the dormant default, which is
    // what a markerless world resolves through on every read path.
    // ⚠ THIS PAIR IS NOT THE MINT'S DORMANT BRANCH, AND IT USED TO SAY IT WAS
    // (corrected 2026-09-08, lane LIGHT car 2e, on the fold's row 3). What these
    // two lines exercise is `readLivingContentLawVersion` and
    // `materializesLivingContent` — the LEAF — while the mint's `{}` branch is a
    // different function's ternary. The branch is executed by the arm below, and
    // by nothing else in the estate.
    expect(readLivingContentLawVersion(DEFAULT_LIVING_CONTENT_LAW_VERSION))
      .toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
    expect(materializesLivingContent({})).toBe(false);
  });

  /**
   * ⭐⭐ THE MINT'S DORMANT BRANCH, EXECUTED THROUGH THE REAL FUNCTION (lane
   * LIGHT car 2e, 2026-09-08; the fold's row 3 and its untested row U3).
   *
   * ⛔ THE STATE THIS ARM WAS WRITTEN FOR. After the dial was lit,
   * `newSettlementLivingContentLaw()` had exactly two real call sites in the
   * estate and both took the LIT branch; every DARK drive in
   * `livingContentLawWiring.test.js` replaces the function WHOLESALE with
   * `vi.doMock`, so it proves what the boundary does with a dark mint and says
   * nothing about the shipped one. The `{}` branch was therefore executed by
   * NOTHING, while three receipts and this file's own comment claimed it was
   * still exercised. A branch nobody runs is a revert nobody has tested, and the
   * one-line revert is the whole argument for the dial's shape.
   *
   * ⛔ WHY THE LEAF IS MOCKED AND NOT THE MINT. The dial is a module-level const
   * (`NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION = ROSTER_LIVING_CONTENT_LAW_VERSION`),
   * so the only way to vary it without editing the shipped source line is to vary
   * what the LEAF hands the law module and re-import. Mocking the leaf leaves the
   * mint itself untouched: the ternary, the key and the returned object are the
   * product's own. Mocking the mint would be the very substitution that left this
   * branch unexecuted in the first place. No runtime switch was added to the
   * product for this, deliberately.
   */
  it('⭐ the mint\'s DORMANT branch is executed by the real function at a dark dial', async () => {
    vi.resetModules();
    vi.doMock('../../src/domain/content/livingContentLawVersion.js', async (importOriginal) => ({
      .../** @type {Record<string, unknown>} */ (await importOriginal()),
      ROSTER_LIVING_CONTENT_LAW_VERSION: DEFAULT_LIVING_CONTENT_LAW_VERSION,
    }));
    let darkMint;
    try {
      const dark = await import('../../src/domain/content/livingContentLaw.js');
      // ⛔ IT IS THE REAL FUNCTION. If this ever became a mock the arm would be
      // asserting the fixture's own return value, which is the exact false green
      // it exists to replace.
      expect(
        vi.isMockFunction(dark.newSettlementLivingContentLaw),
        'the mint was replaced rather than driven — this arm would then prove nothing',
      ).toBe(false);
      expect(dark.NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION)
        .toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
      darkMint = dark.newSettlementLivingContentLaw();
    } finally {
      vi.doUnmock('../../src/domain/content/livingContentLawVersion.js');
      vi.resetModules();
    }
    expect(
      darkMint,
      'the mint wrote something at the dormant dial. A dark birth must carry NO key at all:'
      + ' an empty-but-present marker is a persisted shape change on every world the product'
      + ' mints, and a non-empty one re-births every world under a law nobody chose.',
    ).toEqual({});
    expect(Object.keys(/** @type {Record<string, unknown>} */ (darkMint))).toEqual([]);

    // ⭐ AND THE SAME REAL FUNCTION, RE-IMPORTED WITH THE LEAF UNTOUCHED, MINTS
    // THE MARKER. This is what makes the `{}` above a BRANCH rather than an
    // artefact of the substitution: one function, one ternary, two answers, and
    // the only thing that moved between them is the value the leaf hands it.
    const lit = await import('../../src/domain/content/livingContentLaw.js');
    expect(lit.NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION)
      .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(lit.newSettlementLivingContentLaw())
      .toEqual({ [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION });
    vi.resetModules();
  });

  // ⚠ ONE NAMED TEST THAT LOOPS INSIDE — deliberately NOT `it.each`, and the reason
  // is measured rather than stylistic. A parameterised callback generates titles the
  // lighting census's reader cannot recognise statically, so `it.each` PARKS THIS
  // WHOLE FILE, and a parked file's titles are census-invisible: it takes the other
  // literal titles in this file out of evidence with it. Measured at the COUPLED
  // landing on 2026-09-01: this file was the single member that pushed the estate's
  // each-family park debt from 111 to 112 against a ceiling of 111. The census's own
  // prescribed idiom is to loop INSIDE a named test, never to generate tests from a
  // loop; every assertion below is still made PER CASE and still fails BY NAME.
  it('fails closed on every non-shipping version marker', () => {
    const FAIL_CLOSED_CASES = [
      ['absent', undefined],
      ['null', null],
      ['garbage', 'yes please'],
      ['the default itself', 1],
      ['a version that has not shipped', 3],
      ['a numeric string for an unshipped version', '3'],
      ['NaN', Number.NaN],
    ];
    const offenders = [];
    let examined = 0;
    for (const [label, value] of FAIL_CLOSED_CASES) {
      examined += 1;
      const read = readLivingContentLawVersion(value);
      if (read !== DEFAULT_LIVING_CONTENT_LAW_VERSION) {
        offenders.push(`${label}: readLivingContentLawVersion returned ${String(read)},`
          + ` not the default ${DEFAULT_LIVING_CONTENT_LAW_VERSION}`);
      }
      const materializes = materializesLivingContent({ [LIVING_CONTENT_LAW_CONFIG_KEY]: value });
      if (materializes !== false) {
        offenders.push(`${label}: materializesLivingContent returned ${String(materializes)}`
          + ' — the law did not fail closed on this marker');
      }
    }
    // Non-vacuity INSIDE the loop's own arm: a loop that ran zero times would
    // otherwise report an empty offender list and pass.
    expect(examined, 'the fail-closed sweep examined no marker').toBe(7);
    expect(
      offenders,
      `the law did not fail closed:\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  it('reads the config and nothing else', () => {
    expect(materializesLivingContent({
      [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
    })).toBe(true);
    // A world whose persisted config carries no marker is a v1 world FOREVER,
    // whatever the dial later says. This is THE PROMISE clause of the gate.
    expect(materializesLivingContent({})).toBe(false);
    expect(materializesLivingContent(null)).toBe(false);
  });

  it('never materializes a settlement-bearing bucket', () => {
    // institutions/services/resources/tradeGoods already materialize through
    // their own generators. A second path for them would be two truths about
    // one definition.
    expect([...LIVING_CONTENT_BUCKETS].sort())
      .toEqual(['deities', 'factions', 'stressors', 'traditions']);
    const roster = buildLivingContentRoster(
      identifyCustomContentPack(customContentReferencePack()),
      LIT_CONFIG,
    );
    expect(Object.keys(roster?.buckets || {}).sort())
      .toEqual(['deities', 'factions', 'stressors', 'traditions']);
    expect(roster?.schemaVersion).toBe(LIVING_CONTENT_ROSTER_SCHEMA_VERSION);
  });

  // ── THE DORMANCY FENCE, WITH ITS OWN DISCRIMINATION CONTROL ────────────────
  // ⚠ A dormancy instrument can pass by comparing nothing (§713.2). The final
  // assertion here is that the LIT arm DIFFERS — without it, every equality
  // above is satisfiable by a build in which the roster does not exist at all.
  it('is byte-identical across every non-enabled marker, and the lit arm proves it can tell', () => {
    const pack = customContentReferencePack();
    const seed = 'living-content-dormancy';
    const darkBlobs = [
      undefined,
      DEFAULT_LIVING_CONTENT_LAW_VERSION,
      3,
      'garbage',
      null,
    ].map((marker) => {
      const config = marker === undefined
        ? { ...CONFIG }
        : { ...CONFIG, [LIVING_CONTENT_LAW_CONFIG_KEY]: marker };
      const settlement = generated(pack, seed, config);
      expect(
        Object.hasOwn(settlement, ROSTER_KEY),
        `marker ${JSON.stringify(marker)} wrote a roster key on a DORMANT run`,
      ).toBe(false);
      return worldBytes(settlement);
    });
    for (const blob of darkBlobs) {
      expect(
        blob.length,
        'a dormant run must be byte-identical whatever non-enabled marker it carries',
      ).toBe(darkBlobs[0].length);
      expect(blob).toBe(darkBlobs[0]);
    }

    const lit = generated(pack, seed, LIT_CONFIG);
    expect(
      Object.hasOwn(lit, ROSTER_KEY),
      'THE CONTROL: if the lit arm writes no roster either, every equality above is vacuous',
    ).toBe(true);
    expect(worldBytes(lit)).not.toBe(darkBlobs[0]);
    // And the ONLY difference the lit arm makes is the roster key: strip that
    // too and the lit world is byte-identical to the dark one. This is the
    // dormancy claim stated from the other side — the law adds a key, and
    // changes nothing that was already there.
    const { [ROSTER_KEY]: _roster, ...litWithoutRoster } = lit;
    expect(
      worldBytes(litWithoutRoster),
      'the lit law perturbed the world beyond adding its own key',
    ).toBe(darkBlobs[0]);
  });

  it('writes no roster when the pack holds no living content, even when lit', () => {
    const pack = customContentReferencePack();
    for (const bucket of LIVING_CONTENT_BUCKETS) delete pack[bucket];
    const settlement = generated(pack, 'living-content-empty', LIT_CONFIG);
    expect(Object.hasOwn(settlement, ROSTER_KEY)).toBe(false);
    expect(buildLivingContentRoster({}, LIT_CONFIG)).toBeNull();
  });

  // ── THE ANTI-VACUITY FLOOR, IN ITS OWN TEST ───────────────────────────────
  // It lives alone for a reason TE-INSTR-1 measured the hard way: a floor placed
  // at the foot of a bigger arm is SHADOWED by the assertions above it and
  // cannot be shown to fire. An arm that cannot be demonstrated is not an arm.
  it('the ledger is not empty — this file is discriminating something', () => {
    expect(
      BLIND_CASES.length,
      'the blind ledger is EMPTY, so every per-case arm below runs zero times and this'
      + ' file reports a suite of passes while proving nothing whatsoever.',
    ).toBeGreaterThan(0);
  });

  it('the ledger is exact, deduplicated and monotone-down', () => {
    expect(new Set(BLIND_CASE_KEYS).size, 'a key is listed twice')
      .toBe(BLIND_CASE_KEYS.length);
    expect(
      BLIND_CASE_KEYS.length,
      'the ledger GREW. It is a copy of the instrument\'s measured blind set, not a'
      + ' place to add rows: a newly blind case is a defect to fix.',
    ).toBeLessThanOrEqual(BLIND_CASE_COUNT);
    expect(
      new Set(BLIND_CASE_KEYS.map(key => key.split('.')[0])).size,
      'a FIFTH category joined — the four are stressors, deities, traditions, factions',
    ).toBeLessThanOrEqual(BLIND_BUCKET_COUNT);
    expect([...new Set(BLIND_CASE_KEYS.map(key => key.split('.')[0]))].sort())
      .toEqual([...LIVING_CONTENT_BUCKETS].sort());
  });

  // ── THE PAYMENT: THE 26 COME ALIVE UNDER THE LIT LAW ──────────────────────
  // ⚠ LOOPS INSIDE ONE NAMED TEST — see the note on the fail-closed sweep above:
  // `it.each` parks this whole file in the lighting census. Every assertion below is
  // still made PER CASE and still names the offending case; they are collected so a
  // failure reports EVERY unpaid case at once rather than only the first.
  it('every blind case materializes and discovers under the lit law', () => {
    const unpaid = [];
    const undiscovered = [];
    const promoted = [];
    let examined = 0;
    for (const testCase of BLIND_CASES) {
      examined += 1;
      const { key, bucket } = testCase;
      const { materialized, subjectUid, reached } = probe(testCase, LIT_CONFIG);

      if (materialized !== true) {
        unpaid.push(`${key}: the definition (${bucket}:${subjectUid}) still does not appear in the`
          + ' generated settlement under the LIT law — the §866 bill is unpaid for this case.');
        continue;
      }
      if (!(reached.length > 0)) {
        undiscovered.push(`${key}: the definition materializes, but flipping this presentation field`
          + ' moved NOTHING anywhere in the settlement, so the case still discovers nothing.');
      }

      // ⛔ AND IT LANDED ON THE PRESENTATION SIDE — BY ENUMERATION, NOT BY DIGEST.
      // Every path the flip moved must be inside the additive roster key. This is
      // a strictly stronger claim than "the mechanics digest did not move": a
      // digest says the projection saw no difference, this says there was no
      // difference anywhere else to see. It is what keeps the payment on the
      // presentation side of the governed split rather than promoting a
      // presentation field into a mechanic.
      const escaped = reached.filter(path => !path.startsWith(`$.${ROSTER_KEY}.`));
      if (escaped.length) {
        promoted.push(`${key}: flipping a PRESENTATION field moved something outside the inert roster.`
          + ' That is a presentation→mechanical promotion, which is OWNER-GATED and must'
          + ` not arrive as a side effect of materialization. Escaped: ${escaped.join(', ')}`);
      }
    }
    // Non-vacuity INSIDE the loop's own arm: a loop that ran zero times would
    // otherwise report three empty lists and pass.
    expect(examined, 'the lit-law sweep examined no case').toBe(BLIND_CASES.length);
    expect(examined, 'the blind-case ledger is empty — the sweep proves nothing').toBeGreaterThan(0);
    expect(unpaid, `the §866 bill is unpaid:\n  ${unpaid.join('\n  ')}`).toEqual([]);
    expect(undiscovered, `materialized but discovers nothing:\n  ${undiscovered.join('\n  ')}`).toEqual([]);
    expect(promoted, `presentation→mechanical promotion:\n  ${promoted.join('\n  ')}`).toEqual([]);
  });

  // ── THE F2c TRIPWIRE: THE LINE THIS LANE BUILDS UP TO AND DOES NOT CROSS ───
  // ⚠ LOOPS INSIDE ONE NAMED TEST — see the note on the fail-closed sweep above.
  it('every name case materializes WITHOUT adoption — the mechanical surfaces stay free', () => {
    const nameCases = BLIND_CASES.filter(({ field }) => field.key === 'name');
    const adopted = [];
    const missingFromRoster = [];
    let examined = 0;
    for (const testCase of nameCases) {
      examined += 1;
      const { key, bucket } = testCase;
      const { control, subjectUid } = probe(testCase, LIT_CONFIG);

      // The four surfaces `settlementContentProvenance.js` already scans for
      // living content. Their readers exist; keeping them EMPTY is the boundary.
      for (const surface of LIVING_CONTENT_ADOPTION_SURFACES) {
        const blob = JSON.stringify(at(control, surface) ?? null);
        if (blob.includes(subjectUid) || blob.includes(`definition:${bucket}:`)) {
          adopted.push(`${key}: ${surface} ADOPTED a living-content definition. Materialization is not`
            + ' adoption: the reference pack fixture states that a reviewed definition'
            + ' "must not make a generated settlement silently adopt a deity, faction,'
            + ' stressor, or tradition". Writing custom content into this surface is a'
            + ' presentation→mechanical promotion and is OWNER-GATED — it does not land'
            + ' as a side effect of this law.');
        }
      }

      // And the roster genuinely holds it — otherwise the sweep above is
      // satisfied by a build that materializes nothing at all.
      if (!JSON.stringify(control[ROSTER_KEY]).includes(subjectUid)) {
        missingFromRoster.push(`${key}: THE CONTROL for the sweep above — the subject`
          + ' must really be in the roster');
      }
    }
    // Non-vacuity INSIDE the loop's own arm.
    expect(examined, 'the adoption sweep examined no name case').toBe(nameCases.length);
    expect(examined, 'there is no name case at all — the sweep proves nothing').toBeGreaterThan(0);
    expect(adopted, `adoption escaped the boundary:\n  ${adopted.join('\n  ')}`).toEqual([]);
    expect(
      missingFromRoster,
      `the control failed — the roster does not hold the subject:\n  ${missingFromRoster.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the provenance receipt is untouched by the roster', () => {
    // The roster is NOT fed to `buildSettlementContentProvenance`. That receipt
    // is tamper-evident and carries a persisted `receiptHash` with its own
    // admission validator, so widening it is a persisted-shape change that
    // belongs with the lighting decision, not with the machinery. Pinned so the
    // day someone widens it is a deliberate day.
    const pack = customContentReferencePack();
    const seed = 'living-content-provenance';
    const dark = generated(pack, seed, CONFIG);
    const lit = generated(pack, seed, LIT_CONFIG);
    expect(lit.customContentProvenance).toEqual(dark.customContentProvenance);
    expect(
      (lit.customContentProvenance?.materializedDefinitions || [])
        .map(definition => definition.category)
        .filter(category => LIVING_CONTENT_BUCKETS.includes(category)),
      'the provenance receipt started recording living content — that is a widening of a'
      + ' persisted, hash-validated receipt and is owner-gated, not a side effect.',
    ).toEqual([]);
  });
});
