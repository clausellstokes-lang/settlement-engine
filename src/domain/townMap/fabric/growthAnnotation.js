/**
 * domain/townMap/fabric/growthAnnotation.js — ⭐⭐⭐ A6.1's MINTED ANNOTATION SCHEMA, VERBATIM
 * (DESIGN_REGISTER_PROGRAM.md A6.1; adopted by DESIGN_REG_GROW.md **Amendment A1.3**, ODQ §643.3).
 *
 * A6.1 mints it AS ITS OWN MODULE, and the sentence that decides this file's whole shape is the
 * parenthesis: *"a named fabric-side surface whose PATH each wave's changeManifest reserves —
 * **the manifest carries the obligation's file, never the data**"*. So this module publishes
 *   • the SCHEMA (what an element owes),
 *   • the TRANSIENT-ELEMENT CHANNEL (what a beat pre-state owes),
 *   • the OBLIGATION (the path + the owing classes, which is what a manifest may carry), and
 *   • the TOTALITY WALKER (whose planted-omission control rides car A, A1.3's own law).
 * It publishes no per-element data of its own: the data lives on the leaf.
 *
 * ⛔⛔ WHY THE A5 TUPLE WAS REPLACED, and it is A6.1's own measured reason: the A5 schema had
 * **appearance only** and *"could not draw six of the twelve beats"* — decline was inexpressible
 * because there was no `disappearanceYear` and no `beatEvents[]`. DESIGN_REG_GROW's §3g repeated
 * that starvation with a THIRD spelling (`{appearanceEpoch, accretionOrder, originType,
 * provenance}` — a renamed order field, no disappearance, no beats, and the data in the
 * manifest). A1.3 replaces §3g outright and this module is the replacement.
 *
 * ⛔ AND THE PROVENANCE ENUM CARRIES **THREE** VALUES, NOT TWO (A1.2, ruling S2-B1's finding that
 * *"the two-value enum was schema starvation"*): `recorded` (a dated event the record states) ·
 * `interpolated` (spacing between anchors — L-REG-19's class) · `derived-frozen` (a date the
 * fabric derived ONCE and then froze as history — wall epochs and their kin). The third value
 * exists because §3b's *"raised at their recorded (or derived-then-frozen) epoch"* had **no
 * honest value at all** in a two-value enum, and stamping a derived date as `recorded` is exactly
 * the zero-interpolated-years-as-facts violation A6 was minted against.
 *
 * PURITY: pure data and pure functions. No Date, no Math.random, no I/O, no ambient rng.
 */

/**
 * ⭐⭐⭐ THE THREE PROVENANCE VALUES. Ordered from most to least sourced, so a consumer that
 * wants "at least this honest" can compare indices rather than spell a set.
 */
export const PROVENANCE = Object.freeze(['recorded', 'interpolated', 'derived-frozen']);

/** The schema's field roster, published so a walker can check SHAPE and not only presence. */
export const ANNOTATION_FIELDS = Object.freeze([
  'appearanceEpoch', 'withinEpochOrder', 'disappearanceYear', 'provenance', 'beatEvents',
]);

/**
 * ⭐⭐ THE TWELVE BEATS' VOCABULARY, as the kernel may MINT it. A6.3's law binds every one:
 * *"the trigger creates the dated event; the event drives the map, the film beats, and the
 * monotonicity pin. No automatic healing; **no beat without a source event**."* So every beat
 * minted here carries `sourceEvent` — the dated, typed record entry it cites — or it is not
 * minted. A beat with a null source is refused by `beatEvent` below rather than stamped.
 *
 * ⚠ THE RECLAMATION PAIR IS RESERVED, NOT BUILT (car B, A1.4). `RECLAMATION_START` /
 * `RECLAMATION_HALT` are named here because A6.3 requires them minted **into the LossRegion
 * stream**, and reserving the spelling is what stops car B minting a fourth vocabulary. Car A
 * emits neither; the census that proves it is `reclamationBeatsAreReserved` below.
 */
export const BEAT_KINDS = Object.freeze([
  'FOUNDING', 'QUARTER_MINT', 'CIRCUIT_RAISED', 'CIRCUIT_OUTGROWN', 'FAUBOURG_EMITTED',
  'INFILL', 'DEBRIS', 'ABANDONMENT', 'RECLAMATION_START', 'RECLAMATION_HALT',
  'SCAR', 'HEAL',
]);

/** The beats car A may mint. The rest are RESERVED for car B and refused here BY NAME. */
export const CAR_A_BEATS = Object.freeze([
  'FOUNDING', 'QUARTER_MINT', 'CIRCUIT_RAISED', 'CIRCUIT_OUTGROWN', 'FAUBOURG_EMITTED', 'INFILL',
]);

/**
 * ⭐ THE TRANSIENT-ELEMENT CHANNEL (A6.1's "PLUS"), and it is a separate channel rather than a
 * flag on the schema because a transient is a thing that is **not on the final map**: the
 * demolished predecessor's outline, the pre-merge pair, the unhealed scar, the siege camp. A
 * totality walker over the drawn set can never see one, so a walker that read a flag would score
 * 100 % over a population that excludes exactly the six beats the channel exists for.
 */
export const TRANSIENT_KINDS = Object.freeze([
  'demolishedPredecessor', 'preMergePair', 'unhealedScar', 'siegeCamp', 'preInfillVoid',
  'preRaiseOpenEdge',
]);

/**
 * Mint one element annotation. Every field is validated at the door, because an annotation that
 * carries a mistyped provenance is worse than an absent one — a census reads it as honest.
 *
 * @param {Object} a
 * @param {number} a.appearanceEpoch      the ledger epoch index the element came into being at
 * @param {number} a.withinEpochOrder     accretion order INSIDE that epoch — 0-based, dense
 * @param {number|null} [a.disappearanceYear]  the year it left the map, or null while it stands
 * @param {string} a.provenance           one of PROVENANCE
 * @param {Array<any>} [a.beatEvents]     beats minted by `beatEvent`, in mint order
 * @returns {Readonly<Object>}
 */
export function annotate(a) {
  const epoch = a && a.appearanceEpoch;
  const order = a && a.withinEpochOrder;
  if (!Number.isInteger(epoch) || epoch < 0) {
    throw new Error(`growthAnnotation: appearanceEpoch must be a non-negative integer, got ${JSON.stringify(epoch)}`);
  }
  if (!Number.isInteger(order) || order < 0) {
    throw new Error(`growthAnnotation: withinEpochOrder must be a non-negative integer, got ${JSON.stringify(order)}`);
  }
  if (PROVENANCE.indexOf(a.provenance) < 0) {
    throw new Error(`growthAnnotation: provenance '${a.provenance}' is not one of ${PROVENANCE.join(' | ')}`);
  }
  const dis = a.disappearanceYear == null ? null : a.disappearanceYear;
  if (dis !== null && !Number.isFinite(dis)) {
    throw new Error(`growthAnnotation: disappearanceYear must be a finite year or null, got ${JSON.stringify(dis)}`);
  }
  const beats = Array.isArray(a.beatEvents) ? a.beatEvents : [];
  for (const b of beats) {
    if (!b || BEAT_KINDS.indexOf(b.kind) < 0) {
      throw new Error(`growthAnnotation: beat '${b && b.kind}' is not in BEAT_KINDS`);
    }
  }
  return Object.freeze({
    appearanceEpoch: epoch,
    withinEpochOrder: order,
    disappearanceYear: dis,
    provenance: a.provenance,
    beatEvents: Object.freeze(beats.slice()),
  });
}

/**
 * Mint one beat. ⛔ `sourceEvent` IS REQUIRED AND THAT IS A6.3's LAW, NOT A CONVENIENCE: a beat
 * whose source is null is a mark with no citation, which §8.2 and §11.10 cut before they cut
 * anything else (immersion.js:12-14's ration). The kernel therefore cannot mint an unsourced
 * beat even by accident.
 *
 * @param {string} kind          one of BEAT_KINDS
 * @param {number} year          years since founding
 * @param {string} sourceEvent   the record entry this beat cites — a dated event's template
 *                               type, or the derivation that froze the date
 * @param {string} provenance    one of PROVENANCE
 */
export function beatEvent(kind, year, sourceEvent, provenance) {
  if (BEAT_KINDS.indexOf(kind) < 0) throw new Error(`growthAnnotation: beat '${kind}' is not in BEAT_KINDS`);
  if (!Number.isFinite(year)) throw new Error(`growthAnnotation: beat '${kind}' needs a finite year`);
  if (!sourceEvent || typeof sourceEvent !== 'string') {
    throw new Error(`growthAnnotation: beat '${kind}' has no sourceEvent — A6.3: no beat without a source event`);
  }
  if (PROVENANCE.indexOf(provenance) < 0) {
    throw new Error(`growthAnnotation: beat '${kind}' provenance '${provenance}' is not one of ${PROVENANCE.join(' | ')}`);
  }
  return Object.freeze({ kind, year: Math.trunc(year), sourceEvent, provenance });
}

/** A transient pre-state. It lives in its own channel and never on the drawn element. */
export function transient(kind, epoch, payload) {
  if (TRANSIENT_KINDS.indexOf(kind) < 0) throw new Error(`growthAnnotation: transient '${kind}' is not in TRANSIENT_KINDS`);
  if (!Number.isInteger(epoch) || epoch < 0) throw new Error('growthAnnotation: transient needs an integer epoch');
  return Object.freeze({ kind, epoch, payload: payload == null ? null : payload });
}

/**
 * ⭐⭐⭐ THE OBLIGATION — what a changeManifest may carry, and it is a FILE and a ROSTER, never a
 * row of data. A6.1: *"the manifest carries the obligation's file, never the data."*
 */
export const ANNOTATION_MODULE_PATH = 'src/domain/townMap/fabric/growthAnnotation.js';

/**
 * ⭐⭐ THE OWING CLASSES — the drawn element families that owe timeline data, scoped the way
 * A6.1 scopes its walker: *"classes owing timeline data enumerated, timeless dress (paint,
 * chrome, lettering, legend) exempt BY NAME"*.
 *
 * ⚠ THE ROSTER IS OVER THE **FABRIC LEAF'S OWN BODY FAMILIES**, not over the lens's op classes,
 * and the difference is deliberate. The op roster counts what the LENS emits (a hachure stroke,
 * a wash patch); this counts what the FABRIC produced, which is the only population a kernel can
 * be responsible for. A lens class is exempt here because it is not an element — it is ink.
 */
export const OWING_CLASSES = Object.freeze([
  'parcel', 'backHouse', 'mass', 'hut', 'faubourgBuilding', 'leanTo',
  'dwelling', 'keeperDwelling', 'institution', 'wallRing', 'middleRow',
]);

/**
 * ⭐ EXEMPT BY NAME (A6.1's own four families, spelled against this fabric's surfaces). A class
 * here is TIMELESS DRESS: it has no appearance year because it never appeared — it is how the
 * paper is drawn, not what the town built.
 */
export const TIMELESS_DRESS = Object.freeze([
  'relief', 'hachure', 'waterStroke', 'fieldFurrow', 'groundWash', 'lettering', 'legend',
  'scaleBar', 'cartouche', 'chrome', 'commons', 'green', 'square', 'channel',
]);

/**
 * ⚠ THE THIRD POPULATION S4's M4 NAMED, RECORDED RATHER THAN HIDDEN. `colonize.rows`,
 * the §10 state bodies, the shanty huts and the demotion fossils are created OUTSIDE the kernel
 * and are not F0's "pre-GROW legacy layers" either. Car A takes ONE of them into the kernel —
 * the middle rows, because §18.4 becomes a ledger consumer under A1.5 — and NAMES the rest as
 * deferred, with the car that owes each.
 */
export const DEFERRED_CLASSES = Object.freeze([
  { klass: 'stateBody', owedBy: 'REG-GROW-B', why: '§10 state expressions are a STRESSOR fact, not a growth act — they appear at the present by declaration' },
  { klass: 'demotionFossil', owedBy: 'REG-GROW-B', why: 'a fossil is a DISAPPEARANCE record — it needs the LossRegion channel A1.4 charters for car B' },
  { klass: 'steading', owedBy: 'REG-H', why: 'countryside steadings are hinterland, R-MORPH-gated (§640.3)' },
]);

/** The obligation object a wave's manifest carries — path, roster, exemptions. No data. */
export function annotationObligation() {
  return Object.freeze({
    file: ANNOTATION_MODULE_PATH,
    schemaVersion: 1,
    fields: ANNOTATION_FIELDS,
    provenance: PROVENANCE,
    owing: OWING_CLASSES,
    exemptByName: TIMELESS_DRESS,
    deferred: DEFERRED_CLASSES,
    transientChannel: TRANSIENT_KINDS,
  });
}

/**
 * ⭐⭐⭐ THE PER-WAVE TOTALITY WALKER (A1.3: *"Car A carries the per-wave totality walker with
 * its planted-omission control"* — not deferred to car B).
 *
 * It takes the leaf's own annotation table and the drawn roster, and returns the ORPHANS: drawn
 * elements in an owing class with no annotation. A6.1's proven-zero law binds the control — a
 * planted orphan must move the count **by exactly one**.
 *
 * @param {Object} a
 * @param {Array<{key:string, klass:string}>} a.drawn   the drawn roster, one row per element
 * @param {Record<string, any>} a.annotations           key → annotation
 * @param {Array<string>} [a.owing]                     the owing roster (defaults to OWING_CLASSES)
 */
export function walkTotality(a) {
  const owing = new Set(a.owing || OWING_CLASSES);
  const dress = new Set(TIMELESS_DRESS);
  const ann = a.annotations || {};
  /** @type {Array<{key:string, klass:string}>} */ const orphans = [];
  let owed = 0, exempt = 0, unknown = 0;
  /** @type {Record<string, number>} */ const byClass = {};
  for (const row of (a.drawn || [])) {
    const k = String(row.klass);
    if (dress.has(k)) { exempt++; continue; }
    if (!owing.has(k)) { unknown++; continue; }
    owed++;
    byClass[k] = (byClass[k] || 0) + 1;
    if (!ann[row.key]) orphans.push({ key: row.key, klass: k });
  }
  return {
    owed,
    annotated: owed - orphans.length,
    orphans,
    exempt,
    /** ⚠ A class the roster names neither owing NOR exempt. It is REPORTED, never silently
     *  dropped — an unknown class is how a totality walker scores 100 % over a shrinking
     *  denominator. */
    unknown,
    byClass,
    total: owed === 0 ? 1 : (owed - orphans.length) / owed,
    reason: `${owed - orphans.length}/${owed} drawn elements in ${owing.size} owing class(es) carry`
      + ` appearance data; ${exempt} timeless-dress element(s) exempt BY NAME; ${unknown} in no`
      + ` declared class (REPORTED — see DEFERRED_CLASSES)`,
  };
}

/**
 * ⭐ THE RECLAMATION RESERVATION CENSUS. Car A must emit NO reclamation beat — the mechanics are
 * car B's (A1.4) and the spellings are reserved here so B never mints a fourth vocabulary.
 * Returns the reclamation beats found, which must be zero at car A's tip.
 */
export function reclamationBeatsAreReserved(annotations) {
  const found = [];
  for (const [key, an] of Object.entries(annotations || {})) {
    for (const b of (an && an.beatEvents) || []) {
      if (CAR_A_BEATS.indexOf(b.kind) < 0) found.push({ key, kind: b.kind });
    }
  }
  return found;
}
