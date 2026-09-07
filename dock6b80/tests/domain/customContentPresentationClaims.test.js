/**
 * Executable neutrality contract for every presentation-only manifest field.
 *
 * Presentation values are allowed to change dossier copy, grouping, scene
 * intent, and exact revision provenance. They are not allowed to change the
 * settlement's canonical simulation. Each test mutates one admitted
 * presentation field in the all-category reference pack, runs the real
 * generator with the same seed, removes only named presentation/provenance
 * surfaces, and compares the remaining mechanics digest.
 *
 * ⛔ THE CLAIM IS TWO-SIDED, AND IT HAS TO BE. "The mechanics digest is
 * unchanged" is satisfied perfectly, and forever, by a mutation that reaches
 * nothing at all — which is how 26 of these 52 cases passed while proving
 * nothing (ODQ §866, re-measured in the ledger below). Every case therefore
 * asserts that its mutation is VISIBLE BEFORE the presentation strip as well as
 * INVISIBLE AFTER it, and the cases that provably cannot manage the first half
 * are named, attributed and capped rather than left to pass in silence.
 */

import { describe, expect, it } from 'vitest';

import {
  admitCustomContentDefinition,
  CUSTOM_CONTENT_MANIFEST,
} from '../../src/domain/content/customContentManifest.js';
import {
  isMaterializedCustomContent,
} from '../../src/domain/content/customContentSemanticAuthority.js';
import {
  tradeLabelOwnership,
} from '../../src/domain/content/customTradeLabelOwnership.js';
import { fingerprintContent } from '../../src/domain/content/contentFingerprint.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { computeEffectiveMagicPresence } from '../../src/generators/priorityHelpers.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import {
  generateResourceAnalysis,
} from '../../src/generators/resourceGenerator.js';
import {
  applyFactionInstitutionBoosts,
} from '../../src/generators/factionCorrelation.js';
import {
  computeBaseProsperity,
} from '../../src/generators/economy/prosperity.js';
import {
  generateTradeIncomeStreams,
} from '../../src/generators/economy/tradeGoods.js';
import {
  clearActiveRng,
  setActiveRng,
} from '../../src/kernel/rngContext.js';
import {
  confirmCustomSupplyChainReview,
} from '../../src/domain/content/customSupplyChainReview.js';
import {
  inferSupplyChains,
} from '../../src/domain/inferSupplyChains.js';
import {
  customContentReferencePack,
  identifyCustomContentPack,
} from '../fixtures/customContentReferencePack.js';

const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  monsterThreat: 'civilized',
});

const EXACT_NATIVE_COLLISION_CONFIG = Object.freeze({
  ...CONFIG,
  nearbyResourcesRandom: false,
  nearbyResources: [],
});

const NON_MECHANICAL_SETTLEMENT_SURFACES = Object.freeze([
  'arrivalScene',
  'coherenceNotes',
  'customContentProvenance',
  // The receipt certifies both mechanical state and intentionally mutable
  // presentation surfaces such as history and dramatic prose. It is
  // diagnostic provenance, not canonical simulation state, and has dedicated
  // executable contracts of its own.
  'generationCoherenceReceipt',
  'history',
  'pressureSentence',
  'settlementReason',
  'simulationTrace',
  'spatialLayout',
  'structuralSuggestions',
  'structuralViolations',
]);

const PRESENTATION_KEYS_BY_CATEGORY = new Map(
  CUSTOM_CONTENT_MANIFEST.categories.map(category => [
    category.key,
    new Set(
      category.fields
        .filter(field => field.effect === 'presentation')
        .map(field => field.key)
        .filter(key => key !== 'name'),
    ),
  ]),
);

const REFERENCE_BY_CATEGORY = Object.freeze({
  factions: 'custom:reference-aurora-compact',
  institutions: 'custom:reference-aurora-cart-shed',
  tradeGoods: 'custom:reference-aurora-field-rations',
});

function presentationCases() {
  return CUSTOM_CONTENT_MANIFEST.categories.flatMap(category => (
    category.authorable
      ? category.fields
        .filter(field => field.effect === 'presentation')
        .map(field => ({
          key: `${category.key}.${field.key}`,
          bucket: category.key,
          field,
        }))
      : []
  ));
}

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
      // A display label is not a native semantic key. Use adversarial labels
      // that collide with the engine's legacy keyword vocabulary so this
      // contract catches accidental name-driven mechanics rather than proving
      // neutrality with the mechanically inert suffix "Revised".
      const adversarialNames = {
        institutions:
          "State Granary Mill Teleportation Circle Mages' Guild Cathedral Hospital Market Watch Port",
        services:
          'Food Drink Healing Magic Crime Lodging Transport',
        resources:
          'grain_fields fertile_floodplain fishing_grounds river_mills',
        stressors:
          'Famine Plague Siege Occupied War Mass Migration',
        tradeGoods:
          'Weapons Armor Luxury Food Rations',
        factions:
          'Royal Merchant Guild Criminal Church Military',
        deities:
          'War Death Harvest Magic Law',
        traditions:
          'Harvest War Magic Trade Faith',
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
        throw new Error(
          `${bucket}.${field.key} has no reference-pack category target.`,
        );
      }
      const currentValues = Array.isArray(current) ? current : [current];
      return currentValues.includes(reference) ? [] : [reference];
    }
    return ['alternate presentation value'];
  }
  throw new Error(`${bucket}.${field.key} has unsupported type ${field.type}.`);
}

function variantFor({ bucket, field }) {
  const pack = customContentReferencePack();
  const definition = pack[bucket][0];
  definition[field.key] = alternativeValue(
    bucket,
    field,
    definition[field.key],
  );
  const admission = admitCustomContentDefinition(bucket, definition, {
    allowSystemFields: true,
  });
  expect(admission, `${bucket}.${field.key} variant admission`).toMatchObject({
    ok: true,
  });
  return pack;
}

function generated(pack, seed, config = CONFIG) {
  return generateSettlementPipeline(
    config,
    null,
    {
      seed,
      customContent: identifyCustomContentPack(pack),
    },
  );
}

function withFixedRandom(value, action) {
  const previous = setActiveRng({ random: () => value });
  try {
    return action();
  } finally {
    clearActiveRng(previous);
  }
}

function customInstitution(name, category = 'residential') {
  return {
    name,
    category,
    isCustom: true,
    customDefinitionId: 'definition:institutions:presentation-probe',
    customDefinitionCategory: 'institutions',
  };
}

function referencePackWithName(bucket, name) {
  const pack = customContentReferencePack();
  const definition = pack[bucket][0];
  definition.name = name;
  definition.tierMin = 'thorp';
  definition.tierMax = 'metropolis';
  return pack;
}

function reviewedReferencePackWithTradeGoodName(name) {
  const source = customContentReferencePack();
  source.tradeGoods[0].name = name;
  const pack = identifyCustomContentPack(source);
  const supplyChains = inferSupplyChains(pack)
    .filter(chain => (
      chain.discovered?.nodes?.some(node => (
        node.refId === 'custom:reference-aurora-grain'
      ))
      && !chain.discovered?.nodes?.some(node => (
        node.refId === 'custom:reference-aurora-cart-shed'
      ))
      && chain.discovered?.nodes?.[
        chain.discovered.nodes.length - 1
      ]?.refId === 'custom:reference-aurora-field-rations'
    ))
    .map(chain => confirmCustomSupplyChainReview({
      ...chain,
      outputs: [name],
      exportable: true,
      discovered: {
        ...chain.discovered,
        tradeEndpoints: {
          imports: [],
          exports: [{ label: name }],
        },
      },
    }));
  expect(supplyChains.length).toBeGreaterThan(0);
  return { ...pack, supplyChains };
}

function nativeInstitutionNames(settlement) {
  return settlement.institutions
    .filter(institution => !isMaterializedCustomContent(institution))
    .map(institution => institution.name)
    .sort();
}

function adversarialNameMatrixPacks() {
  const control = customContentReferencePack();
  // Materialize the settlement-bearing definitions at every tier so the
  // matrix exercises native small-settlement branches as well as town+.
  for (const bucket of ['institutions', 'services', 'resources']) {
    for (const definition of control[bucket] || []) {
      definition.tierMin = 'thorp';
      definition.tierMax = 'metropolis';
    }
  }
  const adversarial = structuredClone(control);
  for (const [bucket, definitions] of Object.entries(adversarial)) {
    for (const [index, definition] of definitions.entries()) {
      const adversarial = alternativeValue(
        bucket,
        { key: 'name', type: 'string' },
        definition.name,
      );
      // Preserve distinct display labels so this matrix isolates semantic
      // keyword leakage rather than exercising the separate duplicate-name
      // ambiguity contract.
      definition.name = definitions.length > 1
        ? `${adversarial} ${index + 1}`
        : adversarial;
    }
  }
  // Cover resource-only native gates that do not appear in the primary
  // generation digest at every route/tier (arcane institution odds, metal and
  // herb chains) as well as food/fishing semantics.
  adversarial.resources[0].name = [
    adversarial.resources[0].name,
    'magical_node',
    'iron_deposits',
    'rare_herbs',
  ].join(' ');
  return { control, adversarial };
}

const NAME_AUTHORITY_MATRIX = Object.freeze(
  ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']
    .flatMap(tier => [
      {
        label: `${tier}/plains/road`,
        config: {
          ...CONFIG,
          settType: tier,
          terrainOverride: 'plains',
          tradeRouteAccess: 'road',
        },
        seed: `presentation-name-probe-${tier}-road`,
      },
      {
        label: `${tier}/mountain/isolated`,
        config: {
          ...CONFIG,
          settType: tier,
          terrainOverride: 'mountain',
          tradeRouteAccess: 'isolated',
        },
        seed: `presentation-name-probe-${tier}-isolated`,
      },
      {
        label: `${tier}/coastal/port`,
        config: {
          ...CONFIG,
          settType: tier,
          terrainOverride: 'coastal',
          tradeRouteAccess: 'port',
        },
        seed: `presentation-name-probe-${tier}-port`,
      },
    ]),
);

function customNameTokens(...packs) {
  const tokenByName = new Map();
  for (const pack of packs) {
    for (const [bucket, definitions] of Object.entries(pack)) {
      for (const definition of definitions) {
        tokenByName.set(
          definition.name,
          `<custom:${bucket}:${definition.localUid}>`,
        );
      }
    }
  }
  return [...tokenByName.entries()]
    .sort((left, right) => right[0].length - left[0].length);
}

function normalizeCustomNames(value, replacements) {
  let normalized = String(value);
  for (const [name, token] of replacements) {
    normalized = normalized.replaceAll(name, token);
    normalized = normalized.replaceAll(name.toLowerCase(), token);
  }
  return normalized;
}

function canonicalMechanicsProjection(settlement, replacements) {
  const projection = structuredClone(settlement);
  for (const key of NON_MECHANICAL_SETTLEMENT_SURFACES) delete projection[key];

  // Service category chooses a dossier grouping bucket. Flatten those buckets
  // before comparison while retaining whether each service materialized, its
  // provider, probability/forced state, and every non-presentation field.
  projection.availableServices = Object.values(
    projection.availableServices || {},
  )
    .flatMap(bucket => (Array.isArray(bucket) ? bucket : []))
    .sort((left, right) => {
      const leftName = typeof left === 'string' ? left : left?.name;
      const rightName = typeof right === 'string' ? right : right?.name;
      const normalizedLeft = normalizeCustomNames(
        leftName || '',
        replacements,
      );
      const normalizedRight = normalizeCustomNames(
        rightName || '',
        replacements,
      );
      if (normalizedLeft < normalizedRight) return -1;
      if (normalizedLeft > normalizedRight) return 1;
      return 0;
    });

  function visit(value) {
    if (typeof value === 'string') {
      return normalizeCustomNames(value, replacements);
    }
    if (Array.isArray(value)) {
      return value.map(child => (child === undefined ? null : visit(child)));
    }
    if (!value || typeof value !== 'object') return value;

    const record = value;
    const isCustom = record.custom === true
      || record.isCustom === true
      || record.source === 'custom'
      || typeof record.customDefinitionId === 'string';
    const identityMatch = typeof record.customDefinitionId === 'string'
      ? /^definition:([^:]+):/.exec(record.customDefinitionId)
      : null;
    const customCategory = record.customDefinitionCategory || identityMatch?.[1];
    const presentationKeys = PRESENTATION_KEYS_BY_CATEGORY.get(customCategory);
    const out = {};
    for (const [key, child] of Object.entries(record)) {
      // Match JSON's treatment of absent object members. Some canonical
      // simulation records deliberately retain optional keys with `undefined`
      // values; those keys cannot affect mechanics and are not accepted by the
      // content fingerprint serializer.
      if (child === undefined) continue;
      if (
        key.startsWith('customDefinition')
        || key === 'localUid'
        || (
          isCustom
          && (
            presentationKeys?.has(key)
            // Generated services retain the authored `description` under the
            // legacy dossier key `desc`; treat that one translation explicitly.
            || key === 'desc'
          )
        )
      ) continue;
      out[key] = visit(child);
    }
    return out;
  }

  return visit(projection);
}

function changedMechanicsPaths(left, right, path = '$', changes = []) {
  if (Object.is(left, right)) return changes;
  if (
    left == null
    || right == null
    || typeof left !== 'object'
    || typeof right !== 'object'
  ) {
    changes.push({ path, left, right });
    return changes;
  }
  if (Array.isArray(left) !== Array.isArray(right)) {
    changes.push({ path, left, right });
    return changes;
  }
  const keys = new Set([
    ...Object.keys(left),
    ...Object.keys(right),
  ]);
  for (const key of [...keys].sort()) {
    if (!Object.hasOwn(left, key) || !Object.hasOwn(right, key)) {
      changes.push({
        path: `${path}.${key}`,
        left: left[key],
        right: right[key],
      });
      continue;
    }
    changedMechanicsPaths(left[key], right[key], `${path}.${key}`, changes);
  }
  return changes;
}

const PRESENTATION_CASES = presentationCases();

// ── ⛔ THE INERTNESS PROOF THAT PROVED NOTHING FOR HALF ITS CASES (ODQ §866) ────
//
// §866 ruling (4) found this file's `deities.*` cases VACUOUS: the pipeline emits
// `primaryDeitySnapshot: undefined`, so flipping a deity presentation field moves an
// input the generated settlement never reads, and the two digests match for a reason
// with nothing to do with presentation neutrality. F1c had cited exactly those cases as
// "THE INDEPENDENT INERTNESS PROOF I did not write".
//
// ⛔⛔ RE-MEASURED HERE WITH THIS FILE'S OWN `alternativeValue` AND ITS OWN
// `changedMechanicsPaths`, AND THE VACUITY IS TWICE WHAT §866 RECORDED: 26 of the 52
// presentation cases discover nothing. Not one field family — FOUR WHOLE CATEGORIES.
// One mechanism, four times over: the reference pack's `stressors`, `factions`,
// `deities` and `traditions` definitions never materialize into the generated
// settlement at all (a probe over the entire settlement finds no `localUid`, no name
// and no `definition:<bucket>:<uid>` for any of them). `primaryDeitySnapshot:
// undefined` was one symptom of four, not the fault itself.
//
// THE HOUSE LAW IS THAT AN INERTNESS CLAIM IS A BIT CLAIM — base arm against tip arm
// on a comparator PROVEN ABLE TO SEE, never a self-comparison. This file asserted only
// the SECOND half of its own claim, "invisible after the presentation strip", and never
// the first, "visible before it". A mutation that reaches nothing anywhere satisfies
// the second half perfectly, forever, and reports it as a pass.
//
// THE REPAIR, AND WHAT IT DELIBERATELY IS NOT. Making those four categories
// materialize is a GENERATION-SIDE change and is out of scope for an instrument
// repair; the bill is named here, not paid here. What IS taken is the thing that stops
// a vacuous green shipping silently again — every case is now classified BY EXECUTION
// into one of two arms:
//
//   * a DISCOVERING case must be VISIBLE BEFORE THE STRIP and INVISIBLE AFTER IT. That
//     two-sided form is the only one in which the second half means anything.
//   * a BLIND case must be GENUINELY BLIND, and REDS the moment it starts
//     discriminating — so paying the generation-side bill is ANNOUNCED by the
//     instrument rather than silently converted into a new green.
//
// The ledger can therefore only ever shrink. When it finally empties, delete it, the
// blind arm and its two governance arms together and let one arm do the work again.

// ── ⚠ THIS FILE IS PARKED IN THE LIGHTING CENSUS — ITS TESTS ARE CREDITED NOWHERE ──
//
// MEASURED, not inferred, and recorded here so the next hand does not re-pay for it: a
// plain unambiguous `it('…')` was inserted into this file and
// tests/lint/sovereigntyLightingContract.walker.test.js was run — it stayed GREEN at
// 33/33. `parkReasonsFor` parks this source, and a parked file contributes ZERO to
// `titles` and `suiteTitles` (that walker, `titles: parked ? [] : …`). So the four static
// registrations the §866 repair added moved the lighting census by NOTHING, and its
// governed refreeze re-measured all five figures BYTE-IDENTICAL.
//
// ⛔ TWO CONSEQUENCES, AND THE SECOND IS THE ONE THAT MATTERS.
//   1. No lighting-census bill is owed for this file — do not "pay" one. A refreeze here
//      would only overwrite the provenance note of the landing that actually set the
//      figures, claiming a measurement nobody made.
//   2. This file's 97 tests RUN AND PASS AND ARE CREDITED IN NO TITLE CENSUS AT ALL. That
//      is the same class F1c recorded for its own parked suite. It is a real coverage-
//      accounting gap, it is NOT this repair's to close (de-parking is surgery on the
//      file's shape, not an instrument repair), and it is named here so it is not
//      re-found as a surprise.
// The census that DOES move is scripts/.test-ratchet-baseline.json's runtime `totalTests`
// (94 -> 97 for this file, +3); it needs the full unfiltered suite and is re-derived WHOLE
// at a landing, never composed by arithmetic.
// ⭐ RE-MEASURED AT THE INSTRUMENTS LANDING (2026-09-01, lane INSTR-land): the count is **98**
// here, not 97. The 94 and 97 above are TE-INSTR-1's own figures at its base `1d27accdc` and
// stay as the historical record. The extra registration is not this repair's: the SUBSTRATE
// landing's W-FAITH F1c `a8673e3e9` added an authored deity field, which `presentationCases()`
// derives straight out of `customContentManifest.generated.js`, so the case count moved
// underneath the train while it held. ⛔ THE SHAPE OF THIS FILE'S OWN LAW IS WHY THAT MATTERS:
// its case list is DERIVED FROM A GENERATED MANIFEST, so any wave that authors a new
// presentation field mints a registration here without touching this file — and the ratchet
// row must be re-derived whole at every landing rather than carried, which is exactly what
// the sentence above already told the next hand to do.

/** The shared mechanism behind every declared-blind row, measured rather than assumed. */
const NEVER_MATERIALIZES = 'the reference-pack definition never materializes into the'
  + ' generated settlement — a probe over the whole settlement finds no localUid, no name'
  + ' and no `definition:<bucket>:<uid>` for it — so the flipped presentation field is an'
  + ' input nothing downstream reads, and the two sides agree for a reason that has'
  + ' nothing to do with presentation neutrality';

/** Why each declared-blind bucket discovers nothing. Attribution, not a shrug. */
const DISCOVERY_BLIND_CAUSES = Object.freeze({
  stressors: `stressors.*: ${NEVER_MATERIALIZES}.`,
  factions: `factions.*: ${NEVER_MATERIALIZES}. ⚠ This is the row most likely to be`
    + ' mistaken for covered, because the settlement DOES carry a `factions` array — but it'
    + ' holds GENERATED factions only, and the custom compact is absent from it.',
  deities: `deities.*: ${NEVER_MATERIALIZES}. This is the family ODQ §866 ruling (4) named,`
    + ' through its symptom `primaryDeitySnapshot: undefined`; the measurement here shows'
    + ' that symptom is one face of a four-category mechanism, not a deity-specific fault.',
  traditions: `traditions.*: ${NEVER_MATERIALIZES}.`,
});

/**
 * The cases that CANNOT discover anything at this tip — exact, per case, never per
 * bucket, so a NEW presentation field added to a blind category still reds until
 * somebody looks at it rather than inheriting the category's excuse.
 */
const DISCOVERY_BLIND_CASES = Object.freeze([
  'stressors.name', 'stressors.description', 'stressors.severity', 'stressors.affects',
  'stressors.disablesInstitutions', 'stressors.disablesGoods',
  'deities.name', 'deities.temperamentAxis', 'deities.portfolio',
  // ⭐ THE 27th ROW IS THIS LEDGER'S FIRST-ARMING MEASUREMENT, NOT A CASE THAT WENT BLIND.
  // The ledger, both ceilings and the two governance arms are ALL minted by this same
  // repair (they exist at neither TE-INSTR-1's base `1d27accdc` nor the landing base
  // `8b07ce45f` — measured, both zero). Their initial figure was therefore taken on the
  // lane's own build tree, and the tree this instrument actually governs is three landings
  // newer. Bisected at the INSTRUMENTS landing dock: GREEN 97/97 at `853e0e9ba`, RED at the
  // SUBSTRATE CAS `598642981` — W-FAITH F1c `a8673e3e9`, "the deity's authored character,
  // six optional fields and NOT ONE ENGINE BYTE", put `characterAxes` in the authored deity
  // schema and hence in `customContentManifest.generated.js`, so `presentationCases()`
  // derived a FOURTH deity case (97 -> 98) on a bucket that was ALREADY WHOLLY BLIND.
  // ⛔ NOTHING WENT DARK: `DISCOVERY_BLIND_BUCKET_CEILING` DOES NOT MOVE — still four
  // categories, and that is the discriminating fact. A fifth bucket, or a deity case whose
  // blindness had a DIFFERENT cause, would be a defect to fix rather than a figure to
  // measure. This row's cause is byte-for-byte the same `NEVER_MATERIALIZES` mechanism its
  // three siblings carry, and the blind arm below PROVES it per case rather than inheriting
  // it: `{ materialized: false, reachedPaths: 0 }`, executed.
  'deities.characterAxes',
  'traditions.name', 'traditions.motifElement', 'traditions.motifAct', 'traditions.epithet',
  'factions.name', 'factions.authority', 'factions.archetype', 'factions.agenda',
  'factions.scale', 'factions.methods', 'factions.magical', 'factions.criminal',
  'factions.defenseRole', 'factions.description', 'factions.tierMin', 'factions.controls',
  'factions.rivals',
]);

// MONOTONE-DOWN, both of them, and they are LITERALS rather than figures read out of the
// list they cap — a ceiling derived from its own ledger proves list === list and rises
// silently with every row added. A case may LEAVE the ledger; none may ever join it,
// because a newly blind case is a vacuous green to fix, not a row to declare.
// ⛔ 26 -> 27 ONCE, AT FIRST ARMING, AND NEVER AGAIN BY THIS DOOR. The raise is lawful for
// exactly one reason, stated so the next hand cannot borrow it: this ceiling had never
// governed anything before the INSTRUMENTS landing, so its first true measurement is the
// one taken on the tree it lands on, not the one taken on the tree it was written on. That
// is the same act as re-deriving a register WHOLE at a landing tip instead of composing it
// by arithmetic — and it is the ONLY raise this ledger may ever take. From here the arm is
// live and armed: a 28th row is a defect to fix at cause, and the door used here is closed
// because the machinery is no longer new. The bucket ceiling did not move.
const DISCOVERY_BLIND_CEILING = 27;
const DISCOVERY_BLIND_BUCKET_CEILING = 4;

const BLIND_KEYS = new Set(DISCOVERY_BLIND_CASES);
const DISCOVERING_CASES = PRESENTATION_CASES.filter(({ key }) => !BLIND_KEYS.has(key));
const BLIND_CASES = PRESENTATION_CASES.filter(({ key }) => BLIND_KEYS.has(key));

/**
 * One generation pair per case, carrying the TWO-PART DISCOVERY ANCHOR beside the
 * projections.
 *
 *   `materialized` — did the mutated definition reach the settlement AT ALL? This is
 *     the measured root cause stated directly, and it is the half that cannot be
 *     faked: a definition the generator never instantiates can never demonstrate
 *     anything about neutrality.
 *   `reached` — what the flip moved in the settlement BEFORE any presentation surface
 *     is stripped.
 *
 * ⚠ BOTH HALVES ARE NEEDED AND NEITHER IS REDUNDANT. `reached` alone is satisfiable
 * by a provenance digest moving while the definition itself materializes nowhere —
 * the settlement carries `customContentProvenance`, which is a stripped surface, so a
 * pack-content hash shifting would light `reached` and prove nothing. `materialized`
 * alone would not notice a field that reaches the settlement and then changes nothing.
 * Together they say: the subject is really there, and flipping this field really moved
 * something — which is what makes "and the mechanics digest did not move" a claim.
 */
function presentationProbe({ key, bucket, field }) {
  const controlPack = customContentReferencePack();
  const variantPack = variantFor({ bucket, field });
  // The mutated definition is always index 0 of its bucket (see `variantFor`).
  const subjectUid = variantPack[bucket][0].localUid;
  const replacements = customNameTokens(controlPack, variantPack);
  const seed = `presentation-neutrality:${key}`;
  const control = generated(controlPack, seed);
  const variant = generated(variantPack, seed);
  const controlBlob = JSON.stringify(control);
  return {
    subjectUid,
    materialized: Boolean(subjectUid) && (
      controlBlob.includes(`definition:${bucket}:${subjectUid}`)
      || controlBlob.includes(`"${subjectUid}"`)
    ),
    reached: changedMechanicsPaths(control, variant),
    controlMechanics: canonicalMechanicsProjection(control, replacements),
    variantMechanics: canonicalMechanicsProjection(variant, replacements),
  };
}

describe('custom-content presentation-only claim neutrality', () => {
  it('discovers at least one presentation field in every authorable category', () => {
    const covered = new Set(
      PRESENTATION_CASES.map(({ bucket }) => bucket),
    );
    for (const bucket of CUSTOM_CONTENT_MANIFEST.authorableBuckets) {
      expect(covered.has(bucket), bucket).toBe(true);
    }
  });

  it('the discovery partition is total, exact, attributed and anchored', () => {
    const allKeys = PRESENTATION_CASES.map(({ key }) => key);
    expect(new Set(allKeys).size, 'two cases share a key').toBe(allKeys.length);
    expect(
      DISCOVERING_CASES.length + BLIND_CASES.length,
      'a presentation case escaped the partition — every case is discovering or declared blind',
    ).toBe(PRESENTATION_CASES.length);
    expect(new Set(DISCOVERY_BLIND_CASES).size, 'a key is declared blind twice')
      .toBe(DISCOVERY_BLIND_CASES.length);
    const known = new Set(allKeys);
    expect(
      DISCOVERY_BLIND_CASES.filter(key => !known.has(key)),
      'a declared-blind key names no live presentation case — delete the stale row',
    ).toEqual([]);
    for (const key of DISCOVERY_BLIND_CASES) {
      const [bucket] = key.split('.');
      expect(
        String(DISCOVERY_BLIND_CAUSES[bucket] || '').length,
        `${key} is declared blind with a stub instead of a measured cause`,
      ).toBeGreaterThan(60);
    }
  });

  // ⛔ THE ANTI-VACUITY FLOOR ON THE INSTRUMENT ITSELF, AND IT LIVES IN ITS OWN TEST
  // FOR A MEASURED REASON. It first sat at the foot of the partition arm above, and a
  // plant that declared ALL 52 cases blind never reached it: the attribution loop threw
  // first, so the one arm guarding against the whole file going vacuous was SHADOWED by
  // an earlier assertion in the same test and could not be shown to fire at all. An arm
  // that cannot be demonstrated independently is not an arm. Alone, it cannot be hidden.
  it('the instrument itself is not vacuous — something is still being discriminated', () => {
    expect(
      DISCOVERING_CASES.length,
      'EVERY presentation case is declared blind — this file now proves nothing whatsoever'
      + ' about presentation neutrality while reporting a suite of passes, which is the exact'
      + ' failure this ledger exists to make impossible.',
    ).toBeGreaterThan(0);
  });

  it('the blind ledger is monotone-down — a case may leave it, never join it', () => {
    expect(
      DISCOVERY_BLIND_CASES.length,
      'the blind set GREW. A newly vacuous case is a defect to fix, not a row to declare:'
      + ' either the definition stopped materializing, or a new presentation field was added'
      + ' to a category the generator never reaches.',
    ).toBeLessThanOrEqual(DISCOVERY_BLIND_CEILING);
    expect(
      new Set(DISCOVERY_BLIND_CASES.map(key => key.split('.')[0])).size,
      'a FIFTH category went blind — the four are stressors, deities, traditions, factions',
    ).toBeLessThanOrEqual(DISCOVERY_BLIND_BUCKET_CEILING);
  });

  it.each(DISCOVERING_CASES)(
    '$key leaves the canonical mechanics digest unchanged',
    (testCase) => {
      const { key, bucket } = testCase;
      const {
        materialized, subjectUid, reached, controlMechanics, variantMechanics,
      } = presentationProbe(testCase);

      // ⛔ HALF ONE — VISIBLE BEFORE THE STRIP. Without this anchor the digest equality
      // below is satisfied perfectly by a mutation that reaches nothing whatsoever, which
      // is precisely how 26 sibling cases passed across four categories at once (§866).
      expect(
        materialized,
        `${key}: the mutated definition (${bucket}:${subjectUid}) does not appear in the`
        + ' generated settlement at all, so this case cannot demonstrate anything about'
        + ' presentation neutrality. That is the exact §866 failure: either the definition'
        + ' stopped materializing (a real regression, and the interesting case), or this'
        + ' case belongs in DISCOVERY_BLIND_CASES with a measured cause.',
      ).toBe(true);
      expect(
        reached.length,
        `${key}: the definition materializes, but flipping this presentation field moved`
        + ' NOTHING anywhere in the settlement — so the digest equality this case asserts is'
        + ' true for a reason unrelated to neutrality. Find out why the field is inert before'
        + ' trusting the claim.',
      ).toBeGreaterThan(0);

      // HALF TWO — AND INVISIBLE AFTER IT.
      const changedPaths = changedMechanicsPaths(
        controlMechanics,
        variantMechanics,
      );
      expect(
        fingerprintContent(variantMechanics),
        `${key}; changed mechanics: ${[
          ...changedPaths.slice(0, 8),
          ...changedPaths.slice(-8),
        ]
          .map(change => (
            `${change.path}=${JSON.stringify(change.left)}`
            + `=>${JSON.stringify(change.right)}`
          ))
          .join(', ')}`,
      ).toBe(fingerprintContent(controlMechanics));
    },
  );

  it.each(BLIND_CASES)(
    '$key is DECLARED BLIND — it discovers nothing, and claims nothing',
    (testCase) => {
      const { key, bucket } = testCase;
      const { materialized, reached } = presentationProbe(testCase);
      // BOTH HALVES OF THE DECLARED CAUSE ARE ASSERTED, so the row reds if EITHER stops
      // being true — a subject that starts materializing, or a flip that starts moving
      // something. A declared blindness nobody re-measures is just a comment.
      expect(
        { materialized, reachedPaths: reached.length },
        `${key}: DECLARED BLIND, but it is discriminating now (materialized=${materialized},`
        + ` reached ${reached.length} path(s)). BANK THE WIN: delete this key from`
        + ' DISCOVERY_BLIND_CASES and lower DISCOVERY_BLIND_CEILING by one, so the case joins the'
        + ' discriminating arm and starts PROVING neutrality instead of merely declaring it.'
        + ` The cause on file was: ${DISCOVERY_BLIND_CAUSES[bucket]}`,
      ).toEqual({ materialized: false, reachedPaths: 0 });
    },
  );

  it.each(NAME_AUTHORITY_MATRIX)(
    'keeps adversarial custom names mechanically inert at $label',
    ({ config, seed, label }) => {
      const { control, adversarial } = adversarialNameMatrixPacks();
      const replacements = customNameTokens(control, adversarial);
      const controlSettlement = generated(control, seed, config);
      const adversarialSettlement = generated(adversarial, seed, config);
      // ⛔ THE SAME DISCOVERY ANCHOR THE PER-FIELD ARM CARRIES (§866). This matrix runs
      // eighteen tier/terrain/route cells, and a cell where the rename reached nothing
      // would report inertness it never tested. Assert the comparator SAW the rename
      // before believing that stripping presentation makes it vanish.
      const reached = changedMechanicsPaths(controlSettlement, adversarialSettlement);
      expect(
        reached.length,
        `${label}: the adversarial rename reached NOTHING in the generated settlement, so`
        + ' this cell asserts inertness it never tested. Find out why the renamed'
        + ' definitions stopped materializing at this tier/terrain/route before trusting it.',
      ).toBeGreaterThan(0);
      const controlMechanics = canonicalMechanicsProjection(
        controlSettlement,
        replacements,
      );
      const adversarialMechanics = canonicalMechanicsProjection(
        adversarialSettlement,
        replacements,
      );
      const changes = changedMechanicsPaths(
        controlMechanics,
        adversarialMechanics,
      );
      expect(
        fingerprintContent(adversarialMechanics),
        `${label}; changed mechanics: ${changes
          .slice(0, 16)
          .map(change => (
            `${change.path}=${JSON.stringify(change.left)}`
            + `=>${JSON.stringify(change.right)}`
          ))
          .join(', ')}`,
      ).toBe(fingerprintContent(controlMechanics));
    },
  );

  it('keeps exact criminal institution-name collisions out of safety', () => {
    const config = {
      priorityMilitary: 5,
      priorityCriminal: 5,
      monsterThreat: 'civilized',
    };
    const control = withFixedRandom(0.01, () => generateSafetyProfile(
      config,
      'thorp',
      [customInstitution('Quiet Hall')],
    ));
    const adversarial = withFixedRandom(0.01, () => generateSafetyProfile(
      config,
      'thorp',
      [customInstitution("Thieves' Guild Chapter")],
    ));

    expect(adversarial).toEqual(control);
  });

  it('keeps custom institution names and categories out of prosperity', () => {
    const config = {
      tier: 'village',
      tradeRouteAccess: 'road',
      priorityEconomy: 35,
      priorityMagic: 0,
      monsterThreat: 'civilized',
    };
    const observe = institution => withFixedRandom(0.01, () => (
      computeBaseProsperity(
        'village',
        'road',
        [institution],
        config,
        [],
        [],
      )
    ));
    const control = observe(customInstitution('Quiet Hall'));

    expect(observe(customInstitution('State Granary'))).toEqual(control);
    expect(observe(customInstitution('Quiet Hall', 'Economy'))).toEqual(control);
  });

  it.each(['magical_node', 'ancient_grove'])(
    'keeps exact custom resource key %s out of native magic scoring',
    (resourceKey) => {
      const config = {
        priorityMagic: 50,
        nearbyResources: [resourceKey],
        nearbyResourcesCustom: [resourceKey],
      };
      expect(computeEffectiveMagicPresence([], config)).toEqual(
        computeEffectiveMagicPresence([], {
          ...config,
          nearbyResources: [],
          nearbyResourcesCustom: [],
        }),
      );
    },
  );

  it.each([
    ['iron_deposits', 'exact-resource-iron_deposits-0'],
    ['magical_node', 'exact-resource-magical_node-2'],
    ['deep_harbour', 'exact-resource-deep_harbour-11'],
  ])(
    'keeps exact custom resource name %s out of native institution assembly',
    (resourceName, seed) => {
      const control = generated(
        referencePackWithName('resources', 'Quiet Custom Resource'),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );
      const adversarial = generated(
        referencePackWithName('resources', resourceName),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );

      expect(nativeInstitutionNames(adversarial))
        .toEqual(nativeInstitutionNames(control));
    },
  );

  it.each(['grain_fields', 'magical_node'])(
    'retains exact custom resource identity when %s already occupies the flat roster',
    (resourceName) => {
      const seed = `exact-resource-materialization:${resourceName}`;
      const control = generated(
        referencePackWithName('resources', 'Quiet Custom Resource'),
        seed,
        {
          ...EXACT_NATIVE_COLLISION_CONFIG,
          nearbyResources: [resourceName],
        },
      );
      const collision = generated(
        referencePackWithName('resources', resourceName),
        seed,
        {
          ...EXACT_NATIVE_COLLISION_CONFIG,
          nearbyResources: [resourceName],
        },
      );

      expect(
        collision.config.nearbyResources.filter(name => name === resourceName),
      ).toHaveLength(1);
      expect(collision.config.nearbyResourcesNative).toContain(resourceName);
      expect(collision.config.nearbyResourcesCustom).toContain(resourceName);
      // Source sidecars retain both identities behind one display row. The
      // custom rename cannot erase the selected native resource's mechanics.
      expect(nativeInstitutionNames(collision))
        .toEqual(nativeInstitutionNames(control));
    },
  );

  it('preserves rolled native mechanics through a custom name collision', () => {
    let seed = null;
    let control = null;
    for (let index = 0; index < 24; index += 1) {
      const candidateSeed = `collision-probe-${index}`;
      const candidate = generated(
        referencePackWithName('resources', 'Quiet Custom Resource'),
        candidateSeed,
        CONFIG,
      );
      if (!candidate.config.nearbyResourcesNative.includes('iron_deposits')) {
        continue;
      }
      seed = candidateSeed;
      control = candidate;
      break;
    }
    expect(
      seed,
      'bounded collision corpus must include a native iron roll',
    ).not.toBeNull();
    const collision = generated(
      referencePackWithName('resources', 'iron_deposits'),
      seed,
      CONFIG,
    );

    expect(control.config.nearbyResourcesNative).toContain('iron_deposits');
    expect(collision.config.nearbyResourcesNative).toContain('iron_deposits');
    expect(collision.config.nearbyResourcesCustom).toContain('iron_deposits');
    expect(nativeInstitutionNames(collision))
      .toEqual(nativeInstitutionNames(control));
    expect(collision.resourceAnalysis.resourceChains)
      .toEqual(control.resourceAnalysis.resourceChains);
    expect(collision.economicState.activeChains)
      .toEqual(control.economicState.activeChains);
  });

  it('does not grant native resource mechanics to a custom-only exact key', () => {
    const resourceName = 'grain_fields';
    const seed = 'custom-only-exact-resource';
    const customOnly = generated(
      referencePackWithName('resources', resourceName),
      seed,
      EXACT_NATIVE_COLLISION_CONFIG,
    );
    const absent = generated(
      referencePackWithName('resources', 'Quiet Custom Resource'),
      seed,
      EXACT_NATIVE_COLLISION_CONFIG,
    );

    expect(customOnly.config.nearbyResourcesNative).not.toContain(resourceName);
    expect(customOnly.config.nearbyResourcesCustom).toContain(resourceName);
    expect(nativeInstitutionNames(customOnly))
      .toEqual(nativeInstitutionNames(absent));
  });

  it('replays native-only exhaustion without deleting a custom namesake', () => {
    const resourceName = 'iron_deposits';
    const settlement = generated(
      referencePackWithName('resources', resourceName),
      'collision-probe-0',
      {
        ...CONFIG,
        resourceEdits: {
          added: [],
          removed: [],
          removedNative: [resourceName],
          depleted: [],
          recovered: [],
        },
      },
    );

    expect(settlement.config.nearbyResources).toContain(resourceName);
    expect(settlement.config.nearbyResourcesNative)
      .not.toContain(resourceName);
    expect(settlement.config.nearbyResourcesCustom).toContain(resourceName);
  });

  it('preserves native and reviewed-custom trade owners with the same label', () => {
    const config = {
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      monsterThreat: 'civilized',
      // This contract needs a real native Baked goods owner. Terrain describes
      // production potential, not an export; provide the chain's native grain
      // input explicitly so the collision test cannot pass or fail with a
      // resource roll unrelated to label ownership.
      nearbyResourcesRandom: false,
      nearbyResources: ['grain_fields'],
    };
    const generateTradeCase = name => generateSettlementPipeline(
      config,
      null,
      {
        seed: 'trade-collision-0',
        customContent: reviewedReferencePackWithTradeGoodName(name),
      },
    );
    const control = generateTradeCase('Quiet Custom Good');
    const collision = generateTradeCase('Baked goods');

    expect(control.economicState.primaryExports).toEqual(
      expect.arrayContaining(['Baked goods', 'Weapons & armour']),
    );
    expect(control.economicState.primaryExports)
      .not.toContain('Quiet Custom Good');
    expect(control.economicState.customCategoryExports?.['Weapons & armour'])
      .toContain('Quiet Custom Good');
    expect(control.economicState.nativeTradeLabels?.exports)
      .not.toContain('Quiet Custom Good');
    expect(control.economicState.customTradeEndpoints?.exports)
      .toContainEqual(expect.objectContaining({
        label: 'Quiet Custom Good',
        customDefinitionId:
          'definition:tradeGoods:reference-aurora-field-rations',
      }));
    expect(control.economicState.customTradeEndpoints?.exports.some(
      endpoint => (
        endpoint.chainId === null
        && endpoint.customDefinitionId
          === 'definition:tradeGoods:reference-aurora-field-rations'
      ),
    )).toBe(true);

    expect(collision.economicState.primaryExports).toEqual(
      expect.arrayContaining(['Baked goods', 'Weapons & armour']),
    );
    expect(collision.economicState.customCategoryExports?.['Weapons & armour'])
      .toContain('Baked goods');
    expect(collision.economicState.nativeTradeLabels?.exports)
      .toContain('Baked goods');
    expect(collision.economicState.customTradeEndpoints?.exports)
      .toContainEqual(expect.objectContaining({
        label: 'Baked goods',
        refId: 'custom:reference-aurora-field-rations',
        customDefinitionCategory: 'tradeGoods',
        customDefinitionId:
          'definition:tradeGoods:reference-aurora-field-rations',
      }));
    expect(collision.economicState.customTradeLabels?.exports)
      .toContain('Weapons & armour');
    expect(collision.economicState.customTradeLabels?.exports)
      .not.toContain('Baked goods');
    expect(tradeLabelOwnership(
      collision.economicState,
      'exports',
      'Baked goods',
    )).toMatchObject({
      custom: true,
      native: true,
      mixed: true,
    });
  });

  it.each([
    ['Town granary', 'exact-duplicate-Town granary-0'],
    ['Market square', 'exact-duplicate-Market square-0'],
    ['Weekly market', 'exact-duplicate-Weekly market-0'],
  ])(
    'materializes custom institution identity beside native %s',
    (institutionName, seed) => {
      const settlement = generated(
        referencePackWithName('institutions', institutionName),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );
      const matches = settlement.institutions.filter(
        institution => institution.name === institutionName,
      );

      expect(
        matches.filter(isMaterializedCustomContent),
      ).toEqual([
        expect.objectContaining({
          source: 'custom',
          localUid: 'reference-aurora-provisioners',
          customDefinitionId:
            'definition:institutions:reference-aurora-provisioners',
        }),
      ]);
      expect(
        matches.some(institution => !isMaterializedCustomContent(institution)),
      ).toBe(true);
    },
  );

  it.each([
    ['City walls and gates', 'exact-inst-City walls and gates-0'],
    ['Garrison', 'exact-inst-Garrison-0'],
    ["Mages' guild", "exact-inst-Mages' guild-3"],
  ])(
    'keeps exact custom institution name %s out of native upgrade collapse',
    (institutionName, seed) => {
      const control = generated(
        referencePackWithName('institutions', 'Quiet Custom Institution'),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );
      const adversarial = generated(
        referencePackWithName('institutions', institutionName),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );

      expect(nativeInstitutionNames(adversarial))
        .toEqual(nativeInstitutionNames(control));
    },
  );

  it('does not let a custom dock label reserve the native airship cascade', () => {
    const settlement = generated(
      referencePackWithName('institutions', 'Docks/port facilities'),
      'airship-trace-0',
      {
        ...CONFIG,
        settType: 'metropolis',
        terrainOverride: 'plains',
        tradeRouteAccess: 'road',
        priorityMagic: 95,
        magicExists: true,
        // The assertion concerns whether a custom namesake reserves the native
        // docks identity, not whether this seed happens to win the airship's
        // low-probability catalog roll. Establish the native cascade trigger
        // through the public force-toggle seam.
        _institutionToggles: {
          'metropolis::Exotic::Airship docking (high magic)': {
            allow: true,
            require: true,
          },
        },
      },
    );
    const docks = settlement.institutions.filter(
      institution => institution.name === 'Docks/port facilities',
    );

    expect(settlement.institutions).toContainEqual(
      expect.objectContaining({ name: 'Airship docking (high magic)' }),
    );
    expect(docks.some(isMaterializedCustomContent)).toBe(true);
    expect(docks).toContainEqual(expect.objectContaining({
      source: 'generated',
    }));
    expect(settlement.simulationTrace).toContainEqual(
      expect.objectContaining({
        targetId: 'institution.docks_port_facilities',
        step: 'cascadePass',
        result: 'airship_triggered',
      }),
    );
  });

  it('keeps a custom display name from reserving a faction-boost identity', () => {
    const boosts = [{
      factionCategory: 'economy',
      factionName: 'Merchant Compact',
      power: 40,
      catalogCategories: ['Economy', 'Crafts'],
      strength: 'strong',
    }];
    const observe = institutionName => withFixedRandom(0, () => (
      applyFactionInstitutionBoosts(
        boosts,
        [customInstitution(institutionName)],
        'town',
        { settType: 'town', tradeRouteAccess: 'road' },
      ).map(institution => institution.name)
    ));

    expect(observe('Town granary')).toEqual(observe('Quiet Hall'));
  });

  it('keeps custom institution names and tags out of native resource chains', () => {
    const analyze = institution => generateResourceAnalysis(
      'plains',
      ['grain'],
      [],
      [institution],
      {},
    );
    const control = analyze({
      ...customInstitution('Quiet Hall'),
      tags: ['decorative'],
    });

    expect(analyze({
      ...customInstitution('Quiet Hall'),
      tags: ['food'],
    })).toEqual(control);
    expect(analyze({
      ...customInstitution('Mill'),
      tags: ['decorative'],
    })).toEqual(control);
  });

  it('keeps custom institution labels out of native export prerequisites', () => {
    const observe = institution => withFixedRandom(0, () => (
      generateTradeIncomeStreams(
        'village',
        [institution],
        'road',
        {},
        { nearbyResources: [] },
      ).exports
    ));
    const control = observe(customInstitution('Quiet Hall'));
    const adversarial = observe(customInstitution('Mill'));
    const native = observe({ name: 'Mill', source: 'generated' });

    expect(adversarial).toEqual(control);
    expect(adversarial).not.toContain('Milled flour');
    expect(native).toContain('Milled flour');
  });
});
