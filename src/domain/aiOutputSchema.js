/**
 * domain/aiOutputSchema.js - THE SCHEMA SUBSTRATE (wave L-9a of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md, closing the recorded suboptimality §4c.1:
 * "constrained output at the API level").
 *
 * A SURFACE OUTPUT SCHEMA is the JSON Schema an AI surface's answer must satisfy, shaped so
 * it can be handed to a provider as a tool `input_schema`. Where the CHARTER (aiCharter.js)
 * TEACHES the vocabulary in prose, this module makes the same vocabulary STRUCTURAL: an
 * unregistered bucket, an out-of-enum value, or a missing required field stops being a thing
 * the model can emit and the wall then rejects, and becomes a thing the model cannot emit at
 * all. The failure classes that survive are the semantic ones, which is exactly the residue
 * the formative repair loop (wave L-6) was built to own.
 *
 * DERIVED, NEVER AUTHORED TWICE. Every enum below is rendered from the SAME live builders the
 * schema walls already trust (AUTHORABLE_CONTENT_BUCKETS and the per-category field contracts,
 * buildStyleVocabulary, buildConstructVocabulary, buildOpVocabulary, PARTY_IMPACT_KINDS, the
 * signal registry, NUDGE_TYPES). A bucket added to a registry appears in the schema without
 * anyone remembering to copy it; a value renamed can never leave a schema permitting a word
 * its own wall rejects. This module is the structural twin of aiCharter.js: same sources, same
 * purity rules, same byte-stability contract, different output register.
 *
 * BYTE-STABILITY IS THE CONTRACT. A tool schema rides the cached prompt prefix, and a prefix
 * that differs by one byte per request is a silent cache no-op that costs more, not less.
 * Every list here SORTS before it prints, every property bag is built in sorted key order, and
 * nothing reads a clock, an rng, or any ambient state: the same tree yields the same bytes on
 * every call, in every process.
 *
 * PURITY / BUDGET: no transport, no React, no store, no side effects at import time. This
 * module must ONLY ever be LAZY-imported (the Surveyor panels' dynamic-import lane) and must
 * NEVER be statically imported by any boot / first-paint module: it pulls the whole vocabulary
 * graph behind it, so a static edge would land all of that in the entry closure (the same rule
 * aiCharter.js, correctionTypology.js and opVocabulary.js carry). It emits only registered
 * vocabulary strings, never engine internals, formulas, or tuned constants.
 *
 * ── WHAT EACH SURFACE'S SCHEMA KILLS, AND WHAT IT LEAVES ─────────────────────────────────
 *
 *  customContent
 *    KILLED   unregistered_bucket (the bucket key is a single-value enum per oneOf branch)
 *             unregistered_field (per-bucket `fields` bag, additionalProperties false, so a
 *               field borrowed from another category is rejected too)
 *             invalid_value (enums, string bounds, list caps, booleans, item vocabularies)
 *             missing_required_field (the category's own required keys, in `required`)
 *    REMAINS  a well-typed entry that means the wrong thing (a mill filed as a service),
 *             mechanical intent smuggled into a presentation field, an entry the world
 *             cannot support. Semantic: the review screen and the repair loop own these.
 *
 *  styleOverhaul
 *    KILLED   unsupported_field (the top-level bag is the EDGE contract's field set exactly,
 *               additionalProperties false)
 *             unknown_role (each role map carries the renderer's own role keys and nothing
 *               else), not_in_vocab, not_hex, out_of_range, not_array, not_object
 *    REMAINS  ugly-but-legal composition, a style that reads nothing like the request, and
 *             THE TRUTH LAW itself (asking for a district the world does not hold is a
 *             musing, not a field, so no schema can express the refusal for the model).
 *
 *  construct
 *    KILLED   unregistered_key (one branch per config surface, additionalProperties false,
 *               so settlement keys cannot leak into a realm config or the reverse)
 *             invalid_value (enums and numeric bounds from the same field specs the wall
 *               validates against); an unregistered constraint dimension or band
 *    REMAINS  a legal config that builds the wrong place, and constraints declared that the
 *             request never implied. The deterministic comparator owns that judgment.
 *
 *  interpret
 *    KILLED   unregistered_type (per-family type enums)
 *             wrong_family (the family is a single-value enum inside each branch, so a
 *               party kind tagged canon_event matches no branch). NOTE: §4c.1 predicted
 *               wrong_family would survive as semantic. A discriminated union kills it, so
 *               the repair loop's interpret jurisdiction is smaller than the spec expected.
 *    REMAINS  no_primitive (the honest-refusal register: a request with no primitive at all
 *             is reported in `unsupported`, which is the schema working, not failing),
 *             a registered op aimed at the wrong entity, and every consent judgment.
 *
 *  autonomy
 *    KILLED   unregistered_signal (signal ids are enums, grouped so each id sits beside the
 *               TEST SHAPE its type takes and the TARGET FIELDS its scope requires)
 *             unregistered_stressor (nudge type enum), out-of-range severity (minimum /
 *               maximum from the live nudge bounds), out-of-range maxWeeks, empty groups,
 *               nesting past the condition depth cap (the node union is unrolled to the cap
 *               rather than recursed, so depth is structural)
 *    REMAINS  out_of_bounds for a settlement id the campaign does not hold (ids are
 *             per-request data, never a static vocabulary), the total leaf-test cap (a count
 *             across a tree is not expressible), a band value legal for some other signal of
 *             the same type and scope, and outcome_write (a request to decide a named fate
 *             is refused in `unsupported`, which again is the schema working).
 *
 * ── HOW THIS REACHES A PROVIDER (wave L-WIRE, LANDED) ────────────────────────────────────
 * 1. The bundle: an ENTRIES row in scripts/build-edge-shared.mjs generates
 *    `_shared/aiOutputSchemaBundle.js` from this module, exactly as aiCharterBundle.js is
 *    generated from aiCharter.js, with the same four-layer freshness suite.
 * 2. The call: each `callAnthropic` on a compile surface sends
 *    `tools: [{ name: 'submit_<surface>', description, input_schema: buildSurfaceOutputSchema(surface) }]`
 *    plus a forced `tool_choice`, and reads the answer out of the `tool_use` block.
 * 3. The fallback stays: every core keeps `parse<Surface>Answer` on the free-text path, so a
 *    provider or model that returns no tool_use block degrades exactly as it did before this
 *    wave, and the cross-provider path is unchanged.
 * 4. The economics: these schemas are byte-stable, so they ride the cached prefix ahead of
 *    the system and message blocks and cost the same as the charter does, which is to say
 *    almost nothing after the first read.
 */

import {
  AUTHORABLE_CONTENT_BUCKETS,
  getCustomContentCategory,
} from './content/customContentManifest.js';
import { buildConstructVocabulary } from './construct/configVocabulary.js';
import { buildOpVocabulary } from './intent/opVocabulary.js';
import { PARTY_IMPACT_KINDS } from './worldPulse/partyImpactKinds.js';
import { signalRegistryEntries } from './autonomy/signalRegistry.js';
import { MAX_CONDITION_DEPTH } from './autonomy/stopConditions.js';
import { NUDGE_TYPES, MIN_NUDGE_SEVERITY, MAX_NUDGE_SEVERITY } from './autonomy/accelerationOps.js';
import { CATCH_UP_CAP_WEEKS } from './worldPulse/simulationRules.js';
import { buildStyleVocabulary } from '../design/townMapStyleWall.js';

/** Bump when the schema's STRUCTURE changes. The rendered vocabularies move with their own
 *  registries and do not bump this (the same idiom CHARTER_VERSION carries). */
export const SCHEMA_VERSION = '1.0.0';

/**
 * The surfaces an output schema exists for: the same five compile surfaces CHARTER_SURFACES
 * names. `construct` serves BOTH construct-settlement and construct-realm, one branch each.
 */
export const SCHEMA_SURFACES = Object.freeze([
  'customContent',
  'styleOverhaul',
  'construct',
  'interpret',
  'autonomy',
]);

const SURFACE_SET = new Set(SCHEMA_SURFACES);

/** @typedef {Record<string, unknown>} JsonSchema */

// ── bounded-string and cap constants ─────────────────────────────────────────
// LITERAL MIRRORS of the caps the edge validators already apply, named at their source. They
// are bounds, not vocabulary, so they cannot be derived across the Deno / src import barrier.
// Stating them here means the model is asked for text that fits rather than text that is
// silently truncated after the fact.

/** sanitizeMusings (ai-analyst/analystCore.ts): 8 items, 600 characters each. */
const MUSING_MAX_ITEMS = 8;
const MUSING_MAX_LENGTH = 600;
/** extractRider (ai-analyst/analystCore.ts): the deduped theme set is capped at 6. */
const RIDER_THEME_MAX_ITEMS = 6;
const RIDER_TAG_MAX_LENGTH = 40;
/** The `rationale` slice every compile core applies to a proposed item. */
const RATIONALE_MAX_LENGTH = 240;
/** The `requested` slice every compile core applies to an unsupported entry. */
const SUBJECT_MAX_LENGTH = 80;
/** An entity or settlement id, as the grounding slices spell it. */
const TARGET_ID_MAX_LENGTH = 120;
/** townMapStyleWall.js caps a bespoke style label at 60 characters. */
const STYLE_LABEL_MAX_LENGTH = 60;
/** autonomyCore.cleanNudges reads at most 6 nudges and slices a rationale at 160. */
const NUDGE_MAX_ITEMS = 6;
const NUDGE_RATIONALE_MAX_LENGTH = 160;
/** autonomyCore.cleanCondition slices a condition label at 80. */
const CONDITION_LABEL_MAX_LENGTH = 80;
/** sev01 (domain/events/mutateHelpers.js) clamps an event severity dial to 0..1. */
const SEVERITY_MIN = 0;
const SEVERITY_MAX = 1;

// The numeric ceilings and the hex shape THE WALL enforces (src/design/townMapStyleWall.js).
// They are module-private there, so these are mirrors; tests/domain/aiOutputSchema.test.js
// re-reads the wall's source and fails closed if either side moves.
const STYLE_STROKE_MAX = 40;
const STYLE_RASTER_MAX = 8;
const STYLE_GRID_STEP_MAX = 500;
const STYLE_TOKEN_PX_MAX = 400;
const STYLE_HEX_PATTERN = '^#[0-9a-fA-F]{3,8}$';

// The controlled reason vocabularies. Their authority is the edge core that owns each wall,
// which sits behind the Deno / src import barrier, so these are mirrors of the SAME lists
// aiCharter.js renders in prose. The test pins each one against the charter's rendered line,
// so the two src-side statements can never drift apart silently.
const CONFIDENCE_LABELS = ['required', 'inferred', 'optional', 'uncertain'];
const CONTENT_UNSUPPORTED_REASONS = [
  'unregistered_bucket', 'unregistered_field', 'invalid_value', 'missing_required_field',
];
const INTERPRET_UNSUPPORTED_REASONS = ['no_primitive', 'unregistered_type', 'wrong_family'];
const AUTONOMY_UNSUPPORTED_REASONS = [
  'unregistered_signal', 'unregistered_stressor', 'outcome_write', 'out_of_bounds',
];

/** The two op families the interpret compiler is scoped to (interpretCore.INTERPRET_FAMILIES). */
const CANON_FAMILY = 'canon_event';
const PARTY_FAMILY = 'party_impact';

/**
 * The party-impact addressing key the kind catalog's own `targets` lists do not name:
 * partyImpact.js accepts `settlementId` plus `relationshipTargetId` as an alternative to a
 * precomputed `relationshipKey`, deriving the key itself. Recorded here rather than inferred,
 * because closing the params bag without it would forbid a path the engine supports.
 */
const PARTY_EXTRA_PARAM_KEYS = ['magnitude', 'relationshipTargetId'];

// ── deterministic construction helpers ───────────────────────────────────────
// Code-unit ordering, never locale-aware collation: a locale-sensitive comparator would make
// the emitted bytes depend on the runtime's locale data, and byte-stability is the contract.

/** @param {string} a @param {string} b @returns {number} */
function byText(a, b) {
  if (a < b) return -1;
  return a > b ? 1 : 0;
}

/** @param {readonly string[]} list @returns {string[]} */
function sorted(list) {
  return [...new Set(list)].sort(byText);
}

/**
 * An object node: sorted properties, sorted required, closed to anything else. Closing every
 * object is the whole mechanism, so it is applied here rather than left to each call site.
 * @param {Record<string, JsonSchema>} properties
 * @param {readonly string[]} [required]
 * @returns {JsonSchema}
 */
function objectNode(properties, required = []) {
  /** @type {Record<string, JsonSchema>} */
  const ordered = {};
  for (const key of sorted(Object.keys(properties))) ordered[key] = properties[key];
  return { type: 'object', properties: ordered, required: sorted(required), additionalProperties: false };
}

/** @param {number} [maxLength] @param {number} [minLength] @returns {JsonSchema} */
function stringNode(maxLength, minLength) {
  /** @type {JsonSchema} */
  const node = { type: 'string' };
  if (minLength !== undefined) node.minLength = minLength;
  if (maxLength !== undefined) node.maxLength = maxLength;
  return node;
}

/** @param {readonly string[]} values @returns {JsonSchema} */
function enumNode(values) {
  return { type: 'string', enum: sorted(values) };
}

/** @param {number} [minimum] @param {number} [maximum] @returns {JsonSchema} */
function numberNode(minimum, maximum) {
  /** @type {JsonSchema} */
  const node = { type: 'number' };
  if (minimum !== undefined) node.minimum = minimum;
  if (maximum !== undefined) node.maximum = maximum;
  return node;
}

/** @param {JsonSchema} items @param {number} [maxItems] @param {number} [minItems] @returns {JsonSchema} */
function arrayNode(items, maxItems, minItems) {
  /** @type {JsonSchema} */
  const node = { type: 'array' };
  if (minItems !== undefined) node.minItems = minItems;
  if (maxItems !== undefined) node.maxItems = maxItems;
  node.items = items;
  return node;
}

/**
 * A union. `oneOf` is used where the branches are provably disjoint (a discriminating
 * single-value or non-overlapping enum), `anyOf` where they are not, so a validator that
 * enforces oneOf strictly can never reject a legal answer on an ambiguity we created.
 * @param {JsonSchema[]} branches @returns {JsonSchema}
 */
function oneOfNode(branches) {
  return { oneOf: branches };
}

/** @param {JsonSchema[]} branches @returns {JsonSchema} */
function anyOfNode(branches) {
  return { anyOf: branches };
}

/** @param {unknown} node @returns {unknown} */
function deepFreeze(node) {
  if (Array.isArray(node)) {
    for (const item of node) deepFreeze(item);
    return Object.freeze(node);
  }
  if (node && typeof node === 'object') {
    for (const value of Object.values(/** @type {Record<string, unknown>} */ (node))) {
      deepFreeze(value);
    }
    return Object.freeze(node);
  }
  return node;
}

// ── the two registers every surface shares ───────────────────────────────────

/** The conversational register. Never read for engine behaviour, so plain bounded text. */
function musingsNode() {
  return arrayNode(objectNode({ text: stringNode(MUSING_MAX_LENGTH) }, ['text']), MUSING_MAX_ITEMS);
}

/**
 * The enrichment rider. Its controlled vocabularies live edge-side in RIDER_VOCAB, behind the
 * import barrier, and extractRider coerces every unrecognised tag to a safe default rather
 * than failing, so no failure class rides on them. Bounded strings therefore buy the same
 * safety as an enum would, without minting a third copy of a list this module cannot see.
 */
function riderNode() {
  return objectNode({
    actionDrafted: { type: 'boolean' },
    intent: stringNode(RIDER_TAG_MAX_LENGTH),
    refusalReason: stringNode(RIDER_TAG_MAX_LENGTH),
    themes: arrayNode(stringNode(RIDER_TAG_MAX_LENGTH), RIDER_THEME_MAX_ITEMS),
  });
}

/** The honest-refusal register: what was asked, and which controlled reason class applies. */
/** @param {readonly string[]} reasons @returns {JsonSchema} */
function unsupportedNode(reasons) {
  return arrayNode(objectNode({
    reason: enumNode(reasons),
    requested: stringNode(SUBJECT_MAX_LENGTH),
  }, ['reason', 'requested']));
}

// ── 1. customContent ─────────────────────────────────────────────────────────

/**
 * One registered content field, as a schema node. Mirrors classifyField's own validity test
 * (customContentCore.validValue) rather than a summary of it.
 * @param {{ type: string, values?: readonly string[], minLength?: number, maxLength?: number,
 *           maxItems?: number, itemMaxLength?: number }} field
 * @returns {JsonSchema}
 */
function contentFieldNode(field) {
  if (field.type === 'boolean') return { type: 'boolean' };
  if (field.type === 'enum') return enumNode(field.values || []);
  if (field.type === 'string-or-string-list') {
    const item = Array.isArray(field.values) && field.values.length
      ? enumNode(field.values)
      : stringNode(field.itemMaxLength);
    // A bare string counts as a one-item list at the wall, so it carries the item bounds too.
    return anyOfNode([item, arrayNode(item, field.maxItems)]);
  }
  return stringNode(field.maxLength, field.minLength);
}

/** One authorable bucket, as a discriminated entry branch. */
/** @param {string} bucket @returns {JsonSchema|null} */
function contentEntryBranch(bucket) {
  const category = getCustomContentCategory(bucket);
  if (!category) return null;
  /** @type {Record<string, JsonSchema>} */
  const fields = {};
  /** @type {string[]} */
  const requiredFields = [];
  for (const field of category.fields) {
    fields[field.key] = contentFieldNode(field);
    if (field.required === true) requiredFields.push(field.key);
  }
  return objectNode({
    bucket: enumNode([bucket]),
    fields: objectNode(fields, requiredFields),
    label: enumNode(CONFIDENCE_LABELS),
    rationale: stringNode(RATIONALE_MAX_LENGTH),
    sourced: { type: 'boolean' },
  }, ['bucket', 'fields']);
}

/** @returns {JsonSchema} */
function customContentSchema() {
  /** @type {JsonSchema[]} */
  const branches = [];
  for (const bucket of sorted(AUTHORABLE_CONTENT_BUCKETS)) {
    const branch = contentEntryBranch(bucket);
    if (branch) branches.push(branch);
  }
  return objectNode({
    entries: arrayNode(oneOfNode(branches)),
    musings: musingsNode(),
    rider: riderNode(),
    unsupported: unsupportedNode(CONTENT_UNSUPPORTED_REASONS),
  }, ['entries']);
}

// ── 2. styleOverhaul ─────────────────────────────────────────────────────────

/** A role map: the renderer's own role keys, closed, each carrying the role's value shape. */
/** @param {readonly string[]} roles @param {JsonSchema} value @returns {JsonSchema} */
function roleMapNode(roles, value) {
  /** @type {Record<string, JsonSchema>} */
  const properties = {};
  for (const role of sorted(roles)) properties[role] = value;
  return objectNode(properties);
}

/**
 * @returns {JsonSchema}
 *
 * DELIBERATE EXCLUSION, recorded (vetoable): `id` is assigned by the caller through the
 * wall's `meta` argument, never composed by the model.
 *
 * FINDING F-C CLOSED (wave L-WIRE). `glyphSet` and `seasonBias` were excluded here because
 * the EDGE contract (styleOverhaulCore.STYLE_FIELDS) omitted them, so offering them would
 * have manufactured the very unsupported_field verdict this schema exists to prevent. That
 * omission was the bug, and L-WIRE fixed it on the edge side: both fields now ride the edge
 * contract, the client wall has accepted both since IT-4, and the charter already taught
 * them. So they are offered here too, from the SAME buildStyleVocabulary the wall uses.
 * `seasonBias` renders the four bounded seasons only: the vocabulary carries a leading
 * `null` meaning "follow the live world clock", and absence already says that, so a null
 * member would add a second spelling of the default while making the enum unsortable.
 */
function styleOverhaulSchema() {
  const vocab = buildStyleVocabulary();
  const hex = { type: 'string', pattern: STYLE_HEX_PATTERN };
  const style = objectNode({
    anchorGlyph: enumNode(vocab.anchorGlyphs),
    background: hex,
    baseLens: enumNode(vocab.baseLenses),
    contrast: enumNode(vocab.contrast),
    district: roleMapNode(vocab.roles.district, hex),
    functional: objectNode({
      grid: { type: 'boolean' },
      gridStep: numberNode(0, STYLE_GRID_STEP_MAX),
      scaleBar: { type: 'boolean' },
      tokenPx: numberNode(0, STYLE_TOKEN_PX_MAX),
    }),
    furniture: arrayNode(enumNode(vocab.furniture)),
    glyphSet: enumNode(vocab.glyphSets),
    hazardGlyph: enumNode(vocab.hazardGlyphs),
    label: stringNode(STYLE_LABEL_MAX_LENGTH),
    opacity: roleMapNode(vocab.roles.opacity, numberNode(0, 1)),
    palette: roleMapNode(vocab.roles.palette, hex),
    // The wall admits a raster scale strictly above zero, so the floor is exclusive.
    rasterScale: { type: 'number', exclusiveMinimum: 0, maximum: STYLE_RASTER_MAX },
    seasonBias: enumNode(vocab.seasonBias.filter((v) => typeof v === 'string')),
    stroke: roleMapNode(vocab.roles.stroke, numberNode(0, STYLE_STROKE_MAX)),
  });
  return objectNode({ musings: musingsNode(), rider: riderNode(), style }, ['style']);
}

// ── 3. construct ─────────────────────────────────────────────────────────────

/**
 * @param {{ type: string, values?: readonly string[], min?: number, max?: number,
 *           max_len?: number }} spec
 * @returns {JsonSchema}
 */
function configFieldNode(spec) {
  if (spec.type === 'enum') return enumNode(spec.values || []);
  if (spec.type === 'bool') return { type: 'boolean' };
  if (spec.type === 'number') return numberNode(spec.min, spec.max);
  return stringNode(spec.max_len);
}

/**
 * @param {Record<string, { type: string, values?: readonly string[], min?: number, max?: number,
 *                          max_len?: number }>} fields
 * @returns {JsonSchema}
 */
function configBranch(fields) {
  /** @type {Record<string, JsonSchema>} */
  const properties = {};
  for (const [key, spec] of Object.entries(fields)) properties[key] = configFieldNode(spec);
  return objectNode(properties);
}

/** @returns {JsonSchema} */
function constructSchema() {
  const vocab = buildConstructVocabulary();
  /** @type {Record<string, JsonSchema>} */
  const constraints = {};
  for (const dimension of sorted(vocab.constraintDimensions)) {
    constraints[dimension] = enumNode(vocab.constraintBands);
  }
  return objectNode({
    // ONE schema serves both construct shells, as one charter does. The branches are
    // key-disjoint and each is closed, so a settlement key can never ride a realm config or
    // the reverse; `anyOf` rather than `oneOf` because an empty config matches both branches
    // and a strict oneOf would reject that legal answer. L-WIRE may narrow to a single branch
    // per shell if it wants the tighter teaching signal.
    config: anyOfNode([configBranch(vocab.settlementFields), configBranch(vocab.realmFields)]),
    constraints: objectNode(constraints),
    musings: musingsNode(),
    rider: riderNode(),
  }, ['config']);
}

// ── 4. interpret ─────────────────────────────────────────────────────────────

/**
 * The canon-event params bag: THE F-B SHAPE, made structural. interpretCore teaches
 * `"params":{...}` with no shape while applyDispatch spreads params into the event, so the
 * real shape is `targetId` plus a `payload` of dials (domain/types.js Event).
 *
 * `payload` is THE ONE OPEN BAG in this module, and deliberately so: the Event typedef
 * declares it `Record<string, any>`, "type-specific extras" that generators stamp per event
 * type, so closing it would forbid legal ops while killing no recorded reason class. The three
 * named dials are the ones the record actually states.
 *
 * The event's own `cause` is a closed provenance enum the dispatcher owns, and `description` /
 * `inWorldDate` are prose; none of them is a compiler field, so none of them is offered here.
 * @returns {JsonSchema}
 */
function canonParamsNode() {
  return objectNode({
    payload: {
      type: 'object',
      properties: {
        cause: stringNode(RATIONALE_MAX_LENGTH),
        importance: stringNode(RIDER_TAG_MAX_LENGTH),
        severity: numberNode(SEVERITY_MIN, SEVERITY_MAX),
      },
      required: [],
      additionalProperties: true,
    },
    targetId: stringNode(TARGET_ID_MAX_LENGTH),
  });
}

/**
 * The party-impact params bag: the union of every kind's own documented `targets` (the fields
 * the DM must supply, per PARTY_IMPACT_KINDS) plus the two addressing extras partyImpact.js
 * reads. The union rather than a per-kind branch is deliberate: `broker_relationship` names
 * `relationshipKey` as its target but the engine also accepts settlementId plus
 * relationshipTargetId and derives the key itself, so requiring a kind's targets would forbid
 * a path that works.
 * @returns {JsonSchema}
 */
function partyParamsNode() {
  /** @type {string[]} */
  const keys = [];
  for (const spec of Object.values(PARTY_IMPACT_KINDS)) {
    for (const target of spec.targets || []) keys.push(String(target));
  }
  /** @type {Record<string, JsonSchema>} */
  const properties = {};
  for (const key of sorted([...keys, ...PARTY_EXTRA_PARAM_KEYS])) {
    properties[key] = key === 'magnitude'
      ? numberNode(SEVERITY_MIN, SEVERITY_MAX)
      : stringNode(TARGET_ID_MAX_LENGTH);
  }
  return objectNode(properties);
}

/** @param {string} family @param {readonly string[]} types @param {JsonSchema} params @returns {JsonSchema} */
function opBranch(family, types, params) {
  return objectNode({
    family: enumNode([family]),
    label: enumNode(CONFIDENCE_LABELS),
    params,
    rationale: stringNode(RATIONALE_MAX_LENGTH),
    sourced: { type: 'boolean' },
    type: enumNode(types),
  }, ['family', 'type']);
}

/** @returns {JsonSchema} */
function interpretSchema() {
  const vocab = buildOpVocabulary();
  return objectNode({
    musings: musingsNode(),
    ops: arrayNode(oneOfNode([
      opBranch(CANON_FAMILY, vocab.canonEventTypes, canonParamsNode()),
      opBranch(PARTY_FAMILY, vocab.partyImpactKinds, partyParamsNode()),
    ])),
    rider: riderNode(),
    unsupported: unsupportedNode(INTERPRET_UNSUPPORTED_REASONS),
  }, ['ops']);
}

// ── 5. autonomy ──────────────────────────────────────────────────────────────

/**
 * The registry, grouped by (type, scope). Every id in a group takes the SAME test shape and
 * needs the SAME target fields, so one branch per group pairs an id with its shape structurally
 * instead of teaching the pairing in prose and validating it afterwards.
 * @returns {Array<{ type: string, scope: string, ids: string[], values: string[] }>}
 */
function signalGroups() {
  /** @type {Map<string, { type: string, scope: string, ids: string[], values: string[] }>} */
  const groups = new Map();
  for (const entry of signalRegistryEntries()) {
    const key = `${entry.type}|${entry.scope}`;
    let group = groups.get(key);
    if (!group) {
      group = { type: entry.type, scope: entry.scope, ids: [], values: [] };
      groups.set(key, group);
    }
    group.ids.push(entry.id);
    for (const value of entry.values || []) group.values.push(value);
  }
  return [...groups.values()].sort((a, b) => byText(`${a.type}|${a.scope}`, `${b.type}|${b.scope}`));
}

/** @param {{ type: string, values: string[] }} group @returns {JsonSchema} */
function signalTestNode(group) {
  if (group.type === 'number') {
    return objectNode({
      op: enumNode(['gte', 'lte']),
      value: { type: 'number' },
    }, ['op', 'value']);
  }
  if (group.type === 'bool') return objectNode({ is: { type: 'boolean' } }, ['is']);
  return objectNode({ in: arrayNode(enumNode(group.values), undefined, 1) }, ['in']);
}

/** @param {{ type: string, scope: string, ids: string[], values: string[] }} group @returns {JsonSchema} */
function conditionTestBranch(group) {
  /** @type {Record<string, JsonSchema>} */
  const properties = {
    kind: enumNode(['test']),
    signalId: enumNode(group.ids),
    test: signalTestNode(group),
  };
  /** @type {string[]} */
  const required = ['kind', 'signalId', 'test'];
  if (group.scope === 'settlement' || group.scope === 'pair') {
    properties.settlementId = stringNode(TARGET_ID_MAX_LENGTH);
    required.push('settlementId');
  }
  if (group.scope === 'pair') {
    properties.otherId = stringNode(TARGET_ID_MAX_LENGTH);
    required.push('otherId');
  }
  return objectNode(properties, required);
}

/**
 * A condition node at `depth`, UNROLLED rather than recursed through `$ref`. Two reasons, both
 * load-bearing: `$ref` support inside a provider tool schema varies, and unrolling makes the
 * depth cap structural, so a tree nested past MAX_CONDITION_DEPTH is unbuildable rather than
 * merely rejected. At the cap only leaf tests remain, because a group there would have to hold
 * children one level deeper than the wall allows.
 * @param {JsonSchema[]} testBranches @param {number} depth @returns {JsonSchema}
 */
function conditionNode(testBranches, depth) {
  if (depth >= MAX_CONDITION_DEPTH) return oneOfNode([...testBranches]);
  const group = objectNode({
    children: arrayNode(conditionNode(testBranches, depth + 1), undefined, 1),
    kind: enumNode(['all', 'some']),
  }, ['children', 'kind']);
  return oneOfNode([...testBranches, group]);
}

/** @returns {JsonSchema} */
function autonomySchema() {
  const testBranches = signalGroups().map(conditionTestBranch);
  const stopCondition = objectNode({
    label: stringNode(CONDITION_LABEL_MAX_LENGTH),
    root: conditionNode(testBranches, 1),
    version: { type: 'integer', enum: [1] },
  }, ['root', 'version']);
  return objectNode({
    // maxWeeks is REQUIRED: an absent value clamps to a single week at the edge, silently
    // shortening a run the DM asked for, which is the one place an omission is not the safe
    // default this house usually relies on.
    maxWeeks: { type: 'integer', minimum: 1, maximum: CATCH_UP_CAP_WEEKS },
    musings: musingsNode(),
    nudges: arrayNode(objectNode({
      originSettlementId: stringNode(TARGET_ID_MAX_LENGTH),
      rationale: stringNode(NUDGE_RATIONALE_MAX_LENGTH),
      severity: numberNode(MIN_NUDGE_SEVERITY, MAX_NUDGE_SEVERITY),
      type: enumNode(NUDGE_TYPES),
    }, ['originSettlementId', 'severity', 'type']), NUDGE_MAX_ITEMS),
    rider: riderNode(),
    stopCondition: anyOfNode([stopCondition, { type: 'null' }]),
    unsupported: unsupportedNode(AUTONOMY_UNSUPPORTED_REASONS),
  }, ['maxWeeks', 'stopCondition']);
}

// ── the public builders ──────────────────────────────────────────────────────

/** @type {Readonly<Record<string, () => JsonSchema>>} */
const SURFACE_BUILDER = Object.freeze({
  customContent: customContentSchema,
  styleOverhaul: styleOverhaulSchema,
  construct: constructSchema,
  interpret: interpretSchema,
  autonomy: autonomySchema,
});

/** One line of orientation on the root node, so a tool listing reads honestly. */
/** @type {Readonly<Record<string, string>>} */
const SURFACE_DESCRIPTION = Object.freeze({
  customContent: 'Proposed custom-content entries, each filed into a registered bucket with'
    + ' registered fields, plus anything the manifest cannot express.',
  styleOverhaul: 'One bespoke map style, composed only from registered visual roles and'
    + ' values. A style skins the display, never the substance.',
  construct: 'A generator config drawn from one construction vocabulary, plus the coarse'
    + ' target constraint bands the result is meant to satisfy.',
  interpret: 'Proposed operations compiled from a session account, drawn only from the'
    + ' registered op vocabulary, plus anything the engine has no primitive for.',
  autonomy: 'One typed stop condition over registered signals, a week budget, and bounded'
    + ' pressure nudges, plus anything the engine cannot express.',
});

/**
 * Build one surface's complete output schema, shaped for use as a provider tool
 * `input_schema`. Deterministic and deeply frozen: byte-identical for a given tree, and
 * unmutable by any caller that shares the returned object. THROWS on an unknown surface key,
 * because a schema that silently degraded to an open object would constrain nothing while
 * looking like it worked, which is the exact failure this module exists to prevent.
 *
 * @param {string} surfaceKey one of SCHEMA_SURFACES
 * @returns {JsonSchema}
 */
export function buildSurfaceOutputSchema(surfaceKey) {
  const key = typeof surfaceKey === 'string' ? surfaceKey : '';
  if (!SURFACE_SET.has(key)) {
    throw new Error(
      `buildSurfaceOutputSchema: unknown schema surface "${String(surfaceKey)}"`
      + `. Known surfaces: ${SCHEMA_SURFACES.join(', ')}`,
    );
  }
  const schema = SURFACE_BUILDER[key]();
  schema.description = SURFACE_DESCRIPTION[key];
  return /** @type {JsonSchema} */ (deepFreeze(schema));
}

/**
 * Estimate a schema's token cost, over its serialized JSON. The chars/4 heuristic is the same
 * sizing rule estimateCharterTokens uses: close enough to weigh a static prefix against a
 * provider's cache floor, and never to be presented as a billed token count.
 *
 * @param {string} surfaceKey one of SCHEMA_SURFACES
 * @returns {number}
 */
export function estimateSchemaTokens(surfaceKey) {
  return Math.ceil(JSON.stringify(buildSurfaceOutputSchema(surfaceKey)).length / 4);
}
