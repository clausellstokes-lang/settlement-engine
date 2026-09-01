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

import { describe, expect, it } from 'vitest';

import {
  admitCustomContentDefinition,
  CUSTOM_CONTENT_MANIFEST,
} from '../../src/domain/content/customContentManifest.js';
import {
  LIVING_CONTENT_BUCKETS,
  NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
  newSettlementLivingContentLaw,
} from '../../src/domain/content/livingContentLaw.js';
// THE GATE IS THE SEAM'S. The version vocabulary and the closed membership test
// live on the ENGINE side of the lazy boundary, because the synchronous pipeline
// must answer dormant-or-lit before anything is loaded.
import {
  DEFAULT_LIVING_CONTENT_LAW_VERSION,
  LIVING_CONTENT_LAW_CONFIG_KEY,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
  materializesLivingContent,
  readLivingContentLawVersion,
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
// exercise the SAME path production takes after `loadLivingContentRoster()`.
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
  it('is dormant by default and the dial writes nothing', () => {
    expect(NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION)
      .toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
    expect(
      newSettlementLivingContentLaw(),
      'the create boundary must write NO byte while the dial sits at the default',
    ).toEqual({});
  });

  it.each([
    ['absent', undefined],
    ['null', null],
    ['garbage', 'yes please'],
    ['the default itself', 1],
    ['a version that has not shipped', 3],
    ['a numeric string for an unshipped version', '3'],
    ['NaN', Number.NaN],
  ])('fails closed on %s', (_label, value) => {
    expect(readLivingContentLawVersion(value)).toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
    expect(materializesLivingContent({ [LIVING_CONTENT_LAW_CONFIG_KEY]: value })).toBe(false);
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
  it.each(BLIND_CASES)(
    '$key materializes and discovers under the lit law',
    (testCase) => {
      const { key, bucket } = testCase;
      const { materialized, subjectUid, reached } = probe(testCase, LIT_CONFIG);

      expect(
        materialized,
        `${key}: the definition (${bucket}:${subjectUid}) still does not appear in the`
        + ' generated settlement under the LIT law — the §866 bill is unpaid for this case.',
      ).toBe(true);
      expect(
        reached.length,
        `${key}: the definition materializes, but flipping this presentation field moved`
        + ' NOTHING anywhere in the settlement, so the case still discovers nothing.',
      ).toBeGreaterThan(0);

      // ⛔ AND IT LANDED ON THE PRESENTATION SIDE — BY ENUMERATION, NOT BY DIGEST.
      // Every path the flip moved must be inside the additive roster key. This is
      // a strictly stronger claim than "the mechanics digest did not move": a
      // digest says the projection saw no difference, this says there was no
      // difference anywhere else to see. It is what keeps the payment on the
      // presentation side of the governed split rather than promoting a
      // presentation field into a mechanic.
      const escaped = reached.filter(path => !path.startsWith(`$.${ROSTER_KEY}.`));
      expect(
        escaped,
        `${key}: flipping a PRESENTATION field moved something outside the inert roster.`
        + ' That is a presentation→mechanical promotion, which is OWNER-GATED and must'
        + ` not arrive as a side effect of materialization. Escaped: ${escaped.join(', ')}`,
      ).toEqual([]);
    },
  );

  // ── THE F2c TRIPWIRE: THE LINE THIS LANE BUILDS UP TO AND DOES NOT CROSS ───
  it.each(BLIND_CASES.filter(({ field }) => field.key === 'name'))(
    '$key materializes WITHOUT adoption — the mechanical surfaces stay free',
    (testCase) => {
      const { bucket } = testCase;
      const { control, subjectUid } = probe(testCase, LIT_CONFIG);

      // The four surfaces `settlementContentProvenance.js` already scans for
      // living content. Their readers exist; keeping them EMPTY is the boundary.
      for (const surface of LIVING_CONTENT_ADOPTION_SURFACES) {
        const blob = JSON.stringify(at(control, surface) ?? null);
        expect(
          blob.includes(subjectUid) || blob.includes(`definition:${bucket}:`),
          `${surface} ADOPTED a living-content definition. Materialization is not`
          + ' adoption: the reference pack fixture states that a reviewed definition'
          + ' "must not make a generated settlement silently adopt a deity, faction,'
          + ' stressor, or tradition". Writing custom content into this surface is a'
          + ' presentation→mechanical promotion and is OWNER-GATED — it does not land'
          + ' as a side effect of this law.',
        ).toBe(false);
      }

      // And the roster genuinely holds it — otherwise the sweep above is
      // satisfied by a build that materializes nothing at all.
      expect(
        JSON.stringify(control[ROSTER_KEY]),
        'THE CONTROL for the sweep above: the subject must really be in the roster',
      ).toContain(subjectUid);
    },
  );

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
