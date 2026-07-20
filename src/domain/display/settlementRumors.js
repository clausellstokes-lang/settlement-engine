/**
 * domain/display/settlementRumors.js — the RUMORS & NEWS read-model (Phase 5.5
 * STEP 3.5), the DM-vs-player information asymmetry made a pure selector.
 *
 * Follows the mobilizationStatus.js `includeCovert` convention (design PART IV
 * §IV.2): ONE stored record (worldState.rumorLedgers, spatial/rumorNetwork.js),
 * one pure selector that decides how much of it a viewer may see.
 *
 *   • PLAYER projection (includeGroundTruth: false, THE DEFAULT — fail closed):
 *     a WHITELISTED field set, value-scrubbed (PART III §III.2-4, binding).
 *     Every field the player sees is ENUMERATED in projectPlayerRumor below —
 *     nothing is spread off the record. causeClass and any covert marker are
 *     DROPPED; fidelity internals (completeness01/accuracy01), provenance,
 *     lineage, and corroboration roots NEVER appear; a deity name appears ONLY
 *     when it resolves into the caller-supplied set of ACTIVATED public deity
 *     snapshots (config.primaryDeitySnapshot / cultDeitySnapshots names — the
 *     FaithSection seam; absent set ⇒ scrubbed). What remains is FICTION: a
 *     rendered headline/detail built from the degraded structured fields, plus
 *     in-world bands (freshness, distance, confidence) a settlement would
 *     genuinely know about its own rumor mill.
 *
 *   • DM projection (includeGroundTruth: true — premium/DM surfaces only): the
 *     SAME player projection plus a `truth` block — the canonical event ref,
 *     fidelity vector, provenance chain, lineage, independence count, the raw
 *     (unscrubbed) structured fields, and a DIVERGENCE summary against the
 *     campaign's wizard-news ground truth when the feed is provided. The DM
 *     runs the table on the players' partial picture while knowing precisely
 *     where it is wrong.
 *
 * IN-TRANSIT records (arrivalTick > tick) are invisible to BOTH projections —
 * word that has not arrived is not known here (the DM reads ground truth in
 * the Wizard News feed itself, dated at origin).
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on
 * absent/garbage ledgers; every list codepoint-sorted or total-ordered.
 * Strict-clean; zero any-casts.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, activeSpatialDigest } from '../spatial/distanceRead.js';
import { routeAwareHopDelayTicks } from '../worldPulse/distancePricedNews.js';
import { embattlementLevel } from '../spatial/embattlement.js';

/** @typedef {import('../spatial/rumorNetwork.js').RumorArrivalRecord} RumorArrivalRecord */

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** @param {unknown} v @returns {number} */
function clamp01(v) {
  const n = finiteNumber(v, 0);
  return Math.max(0, Math.min(1, n));
}

/** FNV-1a 32-bit — the pure frame-selection hash (no rng, no wall clock). A LOCAL
 *  copy of the 8-line helper (the newsVoice.js precedent — a display sidecar keeps
 *  its own copy rather than importing a sibling's content tables). @param {string} str */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

// ── The what-token → in-world PHRASE vocabulary (content-immersion-1) ─────────
// The rumor's SUBJECT is captured from a wizardNews entry's impactKind (which is
// itself an engine candidateType/kind token — 'strategy_deploy', 'plague_arrival',
// 'stressor_birth_religious_pact_betrayal', …). Rendering that token raw into a
// player headline ("Merchants bring word of strategy deploy in Thornwall") leaks
// engine vocabulary onto the flagship fiction surface. This map turns every
// known token into a noun phrase a townsperson would actually say — usable both
// capitalized-first ("Soldiers marching to war in X") and after "word of …".
// Any UNKNOWN token falls to whatPhrase()'s neutral fallback, never the raw token.
// Pure display; byte-inert to the engine (goldens never import this).
// Exported for the impactKind walker (tests/domain/settlementRumors.walker.test.js),
// which source-scans every minted impactKind and reds until it is phrased here.
/** @type {Readonly<Record<string, string>>} */
export const WHAT_PHRASES = Object.freeze({
  // war / conflict candidate types
  roads: 'travellers upon the roads',
  strategy_deploy: 'soldiers marching to war',
  war_mobilization: 'a call to arms',
  war_conscription: 'a levy of men called up',
  war_levy: 'a war-levy',
  war_spoils: 'the spoils of war',
  army_homecoming: 'soldiers returning home',
  siege_lifted: 'a siege lifted',
  conquest: 'a conquest',
  field_battle: 'a battle in the field',
  conflict_pressure: 'the drums of war',
  protection_gap: 'defences grown thin',
  // power / faction / coup
  coup_succeeded: 'a seizure of power',
  coup_suppressed: 'an uprising put down',
  faction_exhaustion: 'a faction spent and failing',
  faction_government_challenge: 'a challenge to those in power',
  faction_rival_power_contest: 'a contest between rival powers',
  faction_capture: 'a faction seizing control',
  hierarchy_cascade: 'an upheaval in the ranks',
  authority_instability: 'a shaken authority',
  occupation_lifted: 'an occupation ended',
  occupation_vassalized: 'a town brought to heel',
  // faith
  faith_foothold_recruited: 'a new faith taking root',
  faith_pact_formed: 'a pact sworn between faiths',
  religious_pressure: 'a stir among the faithful',
  pantheon_ascendancy: 'a faith ascendant',
  pantheon_twilight: 'a faith in twilight',
  moral_reckoning: 'a reckoning',
  belief_misjudgment: 'a dangerous misjudgement',
  stressor_birth_religious_conversion_fracture: 'a schism among the faithful',
  stressor_birth_religious_pact_betrayal: 'a holy pact broken',
  // trade / economy / resources / flow
  flow_trade_scarcity: 'goods grown scarce',
  import_shortage: 'a shortage of goods',
  export_market_loss: 'lost markets',
  route_disruption: 'the roads gone bad',
  tax_revenue_disruption: 'coffers running short',
  service_disruption: 'services faltering',
  resource_depletion: 'a source run dry',
  resource_recovery: 'a source restored',
  harvest: 'the harvest',
  hungry_gap: 'the lean season',
  spring_thaw: 'the spring thaw',
  // people / migration
  flow_migration: 'people on the move',
  migration_pressure: 'people on the move',
  population_emigration: 'families leaving',
  // D-1 (deep-couplings): a refugee column on the road (the demographic belief-axis substrate)
  migration_flight: 'families taking to the road',
  // institutions
  institution_build: 'a great work underway',
  institution_closure: 'a hall shuttered',
  institution_founding: 'something new founded',
  // npc arcs
  npc_goal_culmination: 'a long design come to a head',
  npc_goal_rebranch: 'a change of ambitions',
  // sickness / disaster
  plague_arrival: 'a sickness spreading',
  calamity: 'a great disaster',
  // information / crime / residuals / lifecycle
  information_shock: 'unsettling news',
  criminal_pressure: 'a rise in lawlessness',
  stressor_residual: 'lingering troubles',
  party_stressor_residual: 'lingering troubles',
  stressor_aftermath: 'the aftermath of troubles',
  stressor_graduated: 'a trouble deepening',
  stressor_wind_down: 'troubles easing',
  cause_lifecycle: 'shifting fortunes',
  // ── post-A1 merged-wave impactKinds (content-immersion-r2-1/-2) ────────────
  // Every minted impactKind must be phrased here or the impactKind walker
  // (settlementRumors.walker.test.js) reds — no more raw de-underscored slugs
  // ('generosity relief', 'intervention clash') reaching player headlines.
  // W-UPSWING abundance / downturn
  boom: 'flush times',
  bust: 'hard times',
  reconstruction: 'a town rebuilding',
  flourishing: 'a golden age',
  // THE GROWTH LAYER — a leader weathered into a learned trait (owner commission #36)
  npc_growth: 'a change in a leader\'s temper',
  // THE URBAN FABRIC LAYER — a settlement's stone turned (owner commission #39)
  urban_fabric: 'the changing face of a settlement',
  spatial_consequence: 'where in a settlement the blow fell',
  // THE LADDER — a shift in a faction's rank order (owner commission, engine lift #3)
  npc_ladder: 'a change in who holds rank within a faction',
  // THE CONTESTED GOALS CLASS — two named NPCs reach for the same prize (Deep Couplings D-4)
  npc_contest: 'a rivalry over the same ambition',
  npc_support: 'a cause bound to a patron\'s',
  // THE TRADITIONS — a settlement's festival held or set aside (owner commission, engine lift #4)
  tradition: 'a festival kept',
  // D-1c (deep-couplings): a rededicated/reshaped observance (the cultural belief-axis substrate)
  tradition_change: 'an old rite made over',
  // W-NAVY sea war
  blockade_declared: 'a harbour sealed off',
  blockade_lifted: 'a harbour opened again',
  sea_battle: 'a battle at sea',
  // W-CONVERGENCE foreign intervention
  intervention: 'a foreign hand at work',
  intervention_clash: 'rival patrons come to blows',
  // E1 generosity instruments
  generosity_relief: 'aid sent to the stricken',
  generosity_refusal: 'aid turned away',
  generosity_credit_default: 'a debt gone unpaid',
  generosity_purchase: 'a great purchase made',
  generosity_refuge: 'refuge given to the displaced',
  generosity_trade_overture: 'an offer of trade',
  // peace / realm-composer beats
  diplomacy: 'envoys at parley',
  queue_refused: 'a petition denied',
  realm_verb_refused: 'a decree set aside',
});

// Bare LIFECYCLE/transition kinds — when a rumor's subject falls back to the
// entry's `kind` (impactKind absent) it would otherwise read as internal
// vocabulary ("Travellers speak of applied near X"). These map to a neutral,
// in-world word instead of ever rendering the lifecycle token.
/** @type {ReadonlySet<string>} */
const TRANSITION_KINDS = new Set([
  'queued', 'ready', 'applied', 'resolved', 'ignored', 'expired',
  'proposal', 'condition', 'stirring', 'update', 'world_pulse',
]);

// Engine prefixes the neutral fallback strips before de-underscoring an unknown
// token, so a future candidateType degrades to readable words, never a raw slug.
const WHAT_STRIP_PREFIX = /^(npc_|stressor_birth_|stressor_|party_|flow_|faction_|faith_|war_|institution_|occupation_|coup_|resource_|pantheon_)/;

/**
 * A what-token → the in-world phrase a settlement would use for the rumor's
 * subject. Known tokens map explicitly; bare lifecycle kinds neutralize to
 * 'unrest'; any other unknown token strips its engine prefix and de-underscores
 * (readable, never a raw slug), falling to 'unrest' if nothing usable remains.
 * @param {unknown} value
 * @returns {string}
 */
export function whatPhrase(value) {
  const key = String(value || '').trim().toLowerCase();
  if (!key) return 'unrest';
  if (WHAT_PHRASES[key]) return WHAT_PHRASES[key];
  if (TRANSITION_KINDS.has(key)) return 'unrest';
  const stripped = key.replace(WHAT_STRIP_PREFIX, '').replace(/_/g, ' ').trim();
  return stripped || 'unrest';
}

// ── The in-world vocabulary (fiction-not-internals) ─────────────────────────

const MAGNITUDE_WORDS = Object.freeze(['a minor stir', 'a notable turn', 'a serious blow', 'a grave calamity']);

/** Magnitude band 0..3 → the phrase the town uses. @param {number} band */
export function magnitudePhrase(band) {
  return MAGNITUDE_WORDS[Math.max(0, Math.min(3, Math.round(finiteNumber(band, 0))))];
}

/** How long ago word arrived → an in-world freshness band. @param {number} ageTicks */
export function freshnessBand(ageTicks) {
  const age = Math.max(0, finiteNumber(ageTicks, 0));
  if (age <= 1) return 'fresh';
  if (age <= 4) return 'recent';
  return 'old';
}

/** Hop count → how far the word travelled, banded. @param {number} hopCount */
export function distanceBand(hopCount) {
  const hops = Math.max(0, finiteNumber(hopCount, 0));
  if (hops === 0) return 'firsthand';
  if (hops <= 2) return 'nearby word';
  return 'distant word';
}

/**
 * The settlement's OWN assessment of a telling — in-world knowledge (how many
 * independent tellings agree, how far the word travelled), never the DM's
 * fidelity numbers. Independence counts INDEPENDENT LINEAGES (PART V §V.3):
 * firsthand knowledge is certain; two independent tellings corroborate; a
 * single distant telling stays unverified.
 * @param {RumorArrivalRecord} record
 * @returns {'certain' | 'corroborated' | 'credible' | 'unverified'}
 */
export function confidenceBand(record) {
  const hops = finiteNumber(record?.hopCount, 0);
  const independent = Array.isArray(record?.corroborationRoots) ? record.corroborationRoots.length : 1;
  if (hops === 0) return 'certain';
  if (independent >= 2) return 'corroborated';
  if (hops <= 1) return 'credible';
  return 'unverified';
}

// Completeness thresholds — WHICH degraded fields a telling still carries
// (§4f: completeness decay drops low-salience FIELDS; the packet stores the
// values, the projection derives visibility). Documented here, read by both
// projections and their tests.
export const RUMOR_DETAIL_THRESHOLD = 0.75; // full parties + the cause-shaped hints
export const RUMOR_OUTLINE_THRESHOLD = 0.5; // magnitude + when survive
export const RUMOR_VAGUE_THRESHOLD = 0.3;   // below: only "trouble near X"

/** @param {string | null | undefined} id @param {(id: string) => string} nameFor */
function nameOf(id, nameFor) {
  return id == null || id === '' ? 'parts unknown' : nameFor(String(id));
}

// ── The HEADLINE FRAME pools (content-vt-2) ─────────────────────────────────
// The rumor headline picked ONE fixed frame per completeness band — so a
// year-long advance's rumor tab cycled "Merchants bring word of …" / "Travellers
// speak of …" verbatim down the list. Each band is now a small pool of
// interchangeable frames; the SUBJECT ({what}, an in-world phrase) and PLACE
// ({where}, a settlement name) ride EVERY frame unchanged — only the connective
// framing varies (mirror-not-rederive: the rumor's facts never move). Selection
// is a pure FNV-1a hash of the telling's stable event ref, so the SAME event
// frames the same way at every settlement that hears it, and two DIFFERENT events
// in one tab generally read differently. CANONICAL-AT-ZERO: index 0 of every pool
// is the original frame. Byte-inert — settlementRumors renders fresh into the
// lazy dossier/PDF/brief chunks and no rumor prose persists (the ledger golden
// hashes the STRUCTURED records, never these strings).
//
// FRAME LAW: every frame carries {where}; the FIRSTHAND/OUTLINE/VAGUE frames also
// carry {what}; no frame emits an engine token (the walker + the render tests
// enforce the subject vocabulary). {What} is {what} capitalized.
/** @type {Readonly<Record<'firsthand'|'outline'|'vague'|'thin', ReadonlyArray<string>>>} */
export const HEADLINE_FRAMES = Object.freeze({
  firsthand: Object.freeze([
    '{What} in {where}',
    '{What} — and {where} sees it firsthand',
    '{What}, here in {where}',
    '{What} in {where}, for all to see',
  ]),
  outline: Object.freeze([
    'Merchants bring word of {what} in {where}',
    'Down the trade roads comes word of {what} in {where}',
    'The caravans carry word of {what} in {where}',
    'Word is brought of {what} in {where}',
  ]),
  vague: Object.freeze([
    'Travellers speak of {what} somewhere near {where}',
    'Wayfarers mutter of {what} somewhere near {where}',
    'There is loose talk of {what} off near {where}',
    'Faint word comes of {what} somewhere near {where}',
  ]),
  thin: Object.freeze([
    'Travellers speak of trouble near {where}',
    'Wayfarers speak of some trouble off near {where}',
    'There is vague talk of trouble near {where}',
    'Faint word of trouble drifts in from near {where}',
  ]),
});

/**
 * Pick a headline frame for a band and fill it. index 0 (the original frame) when
 * the telling has no stable seed; otherwise a deterministic FNV pick.
 * @param {'firsthand'|'outline'|'vague'|'thin'} band
 * @param {string} seed
 * @param {{ what: string, where: string }} slots
 * @returns {string}
 */
function frameHeadline(band, seed, { what, where }) {
  const pool = HEADLINE_FRAMES[band];
  const frame = seed ? pool[fnv1a32(`${seed}::${band}`) % pool.length] : pool[0];
  return frame
    .replace('{What}', capitalize(what))
    .replace('{what}', what)
    .replace('{where}', where);
}

/**
 * The rendered player fiction for one telling. Built ONLY from scrubbed
 * values: the what-token, the where/party settlement NAMES, the magnitude
 * band, and (when activated-public) the deity name. Never event prose.
 * @param {RumorArrivalRecord} record
 * @param {{ nameFor: (id: string) => string, deityName: string | null, seed?: string }} ctx
 * @returns {{ headline: string, detail: string }}
 */
function renderFiction(record, { nameFor, deityName, seed = '' }) {
  const completeness = clamp01(record.completeness01);
  const what = whatPhrase(record.content?.what);
  const where = nameOf(record.content?.whereId, nameFor);
  const firsthand = finiteNumber(record.hopCount, 0) === 0;
  const band = firsthand ? 'firsthand'
    : completeness >= RUMOR_OUTLINE_THRESHOLD ? 'outline'
    : completeness >= RUMOR_VAGUE_THRESHOLD ? 'vague'
    : 'thin';
  const headline = frameHeadline(band, seed, { what, where });
  const parts = [];
  if (completeness >= RUMOR_OUTLINE_THRESHOLD) {
    parts.push(`They call it ${magnitudePhrase(record.content?.magnitude ?? 0)}.`);
  }
  if (completeness >= RUMOR_DETAIL_THRESHOLD) {
    const partyNames = (record.content?.partyIds || [])
      .map((id) => nameOf(id, nameFor))
      .filter((name, index, all) => all.indexOf(name) === index);
    if (partyNames.length > 1) parts.push(`The tale names ${partyNames.join(', ')}.`);
  }
  if (deityName) {
    parts.push(`They speak of ${deityName}'s hand in it.`);
  }
  if (!firsthand && completeness < RUMOR_VAGUE_THRESHOLD) {
    parts.push('The tale is thin and much-worn by the road.');
  }
  return { headline, detail: parts.join(' ') };
}

/** @param {string} s */
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/**
 * THE PLAYER WHITELIST (PART III §III.2-4 — the manager reads this function
 * line-by-line). Every field the player projection carries is enumerated
 * here; nothing is spread off the stored record. Scrub rules:
 *   • causeClass — DROPPED unconditionally (covert/DM causality never shows).
 *   • deityName  — included ONLY when it resolves into `activatedDeityNames`
 *     (the caller-derived set of ACTIVATED public deity-snapshot names);
 *     a null/absent set fails CLOSED (scrubbed).
 *   • completeness01 / accuracy01 / provenance / lineageIds /
 *     corroborationRoots / score — NEVER projected; the player sees only the
 *     in-world bands derived from them.
 *   • subjectIds / whereId — settlement ids only (the packet's name-swap
 *     mutation pool is the frozen digest's REAL settlement ids), truncated by
 *     completeness (low-salience fields fall away with the telling).
 * @param {string} key
 * @param {RumorArrivalRecord} record
 * @param {{ tick: number, nameFor: (id: string) => string,
 *   activatedDeityNames: ReadonlySet<string> | null, newsDelayTicks?: number }} ctx
 */
function projectPlayerRumor(key, record, { tick, nameFor, activatedDeityNames, newsDelayTicks = 0 }) {
  const completeness = clamp01(record.completeness01);
  const rawDeity = record.content?.deityName;
  const deityName = typeof rawDeity === 'string' && rawDeity
    && activatedDeityNames instanceof Set && activatedDeityNames.has(rawDeity)
    ? rawDeity
    : null;
  const subjectIds = completeness >= RUMOR_DETAIL_THRESHOLD
    ? [...(record.content?.partyIds || [])].map(String)
    : completeness >= RUMOR_OUTLINE_THRESHOLD
      ? (record.content?.partyIds || []).slice(0, 1).map(String)
      : [];
  // Frame seed: the telling's stable canonical event ref (so the same event frames
  // the same way at every settlement that hears it), falling back to the ledger key.
  const seed = String(record.eventRef ?? key ?? '');
  const { headline, detail } = renderFiction(record, { nameFor, deityName, seed });
  const arrivalTick = Math.max(0, finiteNumber(record.arrivalTick, 0));
  return {
    id: String(key),
    carrier: 'trade',
    significance: record.significance === 'major' ? 'major' : 'notable',
    headline,
    detail,
    arrivalTick,
    // agoTicks stays LITERAL (ticks since the packet arrived); D1's distance surcharge
    // colours only the perceived STALENESS band — "word from the far coast runs weeks
    // behind" (newsDelayTicks 0 when D1 dark ⇒ freshnessBand unchanged ⇒ byte-identical).
    agoTicks: Math.max(0, tick - arrivalTick),
    freshness: freshnessBand(tick - arrivalTick + Math.max(0, finiteNumber(newsDelayTicks, 0))),
    distance: distanceBand(record.hopCount),
    confidence: confidenceBand(record),
    magnitude: completeness >= RUMOR_OUTLINE_THRESHOLD
      ? magnitudePhrase(record.content?.magnitude ?? 0)
      : null,
    knownWhenTick: completeness >= RUMOR_OUTLINE_THRESHOLD
      ? Math.max(0, finiteNumber(record.eventTick, 0))
      : null,
    whereId: record.content?.whereId ? String(record.content.whereId) : null,
    subjectIds,
    deityName,
  };
}

/**
 * The DM `truth` block (includeGroundTruth) — ground truth + provenance +
 * divergence (§3.2-5). When the campaign's wizard-news feed is supplied, the
 * telling is joined back to its canonical entry and the divergence summary
 * says exactly where the players' picture is wrong.
 * @param {RumorArrivalRecord} record
 * @param {{ entries?: Array<{ id?: string, sourceEventId?: string | null,
 *   headline?: string, severity?: number, settlementIds?: string[] }> } | null | undefined} wizardNews
 */
function projectTruth(record, wizardNews) {
  const entries = Array.isArray(wizardNews?.entries) ? wizardNews.entries : [];
  const source = entries.find((entry) => entry
    && (entry.sourceEventId === record.eventRef || entry.id === record.eventRef)) || null;
  /** @type {string[]} */
  const divergence = [];
  const completeness = clamp01(record.completeness01);
  const accuracy = clamp01(record.accuracy01);
  if (completeness < 1) divergence.push('details lost on the road');
  if (accuracy < 1) divergence.push('facts drifted in the telling');
  if (source) {
    const trueBand = severityBand(source.severity);
    const heardBand = Math.max(0, Math.min(3, Math.round(finiteNumber(record.content?.magnitude, 0))));
    if (trueBand !== heardBand) {
      divergence.push(heardBand > trueBand ? 'the tale has grown in the telling' : 'the tale understates it');
    }
    const trueIds = new Set((source.settlementIds || []).map(String));
    if ((record.content?.partyIds || []).some((id) => !trueIds.has(String(id)))) {
      divergence.push('a name has been swapped for the wrong settlement');
    }
  }
  return {
    eventRef: record.eventRef,
    eventTick: record.eventTick,
    hopCount: record.hopCount,
    completeness01: record.completeness01,
    accuracy01: record.accuracy01,
    provenance: {
      originId: String(record.provenance?.originId ?? ''),
      relayIds: (record.provenance?.relayIds || []).map(String),
    },
    lineageIds: [...(record.lineageIds || [])],
    independentSources: Array.isArray(record.corroborationRoots) ? record.corroborationRoots.length : 0,
    corroborationRoots: [...(record.corroborationRoots || [])],
    causeClass: record.content?.causeClass ?? null,
    deityName: record.content?.deityName ?? null,
    framing: [...(record.framing || [])],
    trueHeadline: source?.headline || null,
    divergence,
  };
}

/** Mirror of the packet capture's severity banding (rumorNetwork). @param {unknown} severity */
function severityBand(severity) {
  const s = finiteNumber(severity, 0);
  if (s >= 0.8) return 3;
  if (s >= 0.55) return 2;
  if (s >= 0.3) return 1;
  return 0;
}

/**
 * The Rumors & News a settlement holds, projected for a viewer. Pure selector;
 * absent ledger / unknown settlement ⇒ []. Ordered newest-arrival-first with a
 * deterministic total order (arrival desc, score desc, codepoint key).
 *
 * @param {Object} args
 * @param {{ tick?: number, spatialLedgers?: unknown, simulationRules?: Record<string, unknown>,
 *   spatialCanonVersion?: number, spatialDigest?: import('../spatial/distanceRead.js').SpatialDigest } |
 *   null | undefined} args.worldState
 * @param {unknown} args.settlementId
 * @param {boolean} [args.includeGroundTruth]  DM/premium surfaces ⇒ true;
 *   player/public/free surfaces ⇒ false (THE DEFAULT — fail closed).
 * @param {ReadonlySet<string> | null} [args.activatedDeityNames]  the names of
 *   ACTIVATED public deity snapshots (embeds); null fails closed (scrub all).
 * @param {(id: string) => string} [args.nameFor]  settlement id → display name.
 * @param {{ entries?: Array<Record<string, unknown>> } | null} [args.wizardNews]
 *   the campaign feed, for the DM divergence join (ignored for players).
 * @returns {Array<Record<string, unknown>>}
 */
export function settlementRumors({
  worldState,
  settlementId,
  includeGroundTruth = false,
  activatedDeityNames = null,
  nameFor = (id) => String(id),
  wizardNews = null,
} = /** @type {never} */ ({})) {
  if (settlementId == null) return [];
  const ledgers = /** @type {Record<string, Record<string, RumorArrivalRecord>> | undefined} */ (
    getSpatialLedger(worldState, 'rumorLedgers'));
  if (!ledgers || typeof ledgers !== 'object' || Array.isArray(ledgers)) return [];
  const ledger = ledgers[String(settlementId)];
  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) return [];
  const tick = Math.max(0, finiteNumber(worldState?.tick, 0));
  // D1 distance-priced news (player-view staleness ONLY — the DM truth block is never
  // delayed): the frozen digest, read once, gated on the virtual flag. The flag is read
  // inline (never importing the belief engine into a display selector); activeSpatialDigest
  // returns null without a spatial marker, and omniscient worlds carry no ledger to reach
  // here — so absent flag / no digest ⇒ newsDelayTicks 0 ⇒ byte-identical projection.
  const rules = /** @type {Record<string, unknown> | undefined} */ (
    worldState && typeof worldState === 'object' ? worldState.simulationRules : undefined);
  const newsDigest = rules && rules.distancePricedNewsEnabled === true
    ? activeSpatialDigest(worldState) : null;
  // V-24b PER-ROUTE RE-PROPAGATION: the route-status reader that lets the PLAYER-VISIBLE rumor
  // staleness re-price as routes sever/open (embattlement/blockade). Null (dark) ⇒ geometric ⇒
  // byte-identical projection. embattlementLevel is a light spatial read, not the belief engine.
  const newsEmbattlement = newsDigest ? (/** @type {string} */ sid) => embattlementLevel(worldState, sid) : null;
  const arrived = Object.entries(ledger)
    .filter(([, record]) => record && typeof record === 'object'
      && finiteNumber(record.arrivalTick, Infinity) <= tick)
    .sort(([keyA, a], [keyB, b]) => (finiteNumber(b.arrivalTick, 0) - finiteNumber(a.arrivalTick, 0))
      || (finiteNumber(b.score, 0) - finiteNumber(a.score, 0))
      || compareCodepoint(keyA, keyB));
  return arrived.map(([key, record]) => {
    const newsDelayTicks = newsDigest
      ? routeAwareHopDelayTicks(newsDigest, String(record?.provenance?.originId ?? ''), String(settlementId), newsEmbattlement)
      : 0;
    const projection = projectPlayerRumor(key, record, { tick, nameFor, activatedDeityNames, newsDelayTicks });
    if (!includeGroundTruth) return projection;
    return { ...projection, truth: projectTruth(record, wizardNews) };
  });
}

/**
 * Panel presence gate: does this campaign's world carry ANY rumor ledger?
 * Dormant (no key) ⇒ false ⇒ no surface renders ⇒ byte-identical UI.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 */
export function hasRumorLedgers(worldState) {
  const ledgers = getSpatialLedger(worldState, 'rumorLedgers');
  return !!ledgers && typeof ledgers === 'object' && !Array.isArray(ledgers)
    && Object.keys(ledgers).length > 0;
}

/**
 * The dossier tab-presence gate: does the campaign OWNING this save carry a
 * rumor ledger? Boolean-only (a store selector calls this every render);
 * dormant / legacy / omniscient campaigns have no key ⇒ false ⇒ no tab ⇒ the
 * dossier UI is byte-identical.
 * @param {Array<{ settlementIds?: Array<string | number>,
 *   worldState?: { spatialLedgers?: unknown } } | null> | null | undefined} campaigns
 * @param {unknown} saveId
 * @returns {boolean}
 */
export function campaignHasRumorLedger(campaigns, saveId) {
  if (saveId == null || !Array.isArray(campaigns)) return false;
  const sid = String(saveId);
  return campaigns.some((campaign) => campaign
    && (campaign.settlementIds || []).map(String).includes(sid)
    && hasRumorLedgers(campaign.worldState));
}

/**
 * The ACTIVATED public deity-name set for the value-scrub, derived from the
 * settlements' PUBLIC embedded snapshots (config.primaryDeitySnapshot /
 * cultDeitySnapshots — the same embeds FaithSection shows read-only to every
 * viewer; the latent pantheon never appears here). UI convenience so every
 * surface derives the set the same way.
 * @param {Array<{ settlement?: { config?: { primaryDeitySnapshot?: { name?: string },
 *   cultDeitySnapshots?: Array<{ name?: string }> } } } | null> | null | undefined} saves
 * @returns {Set<string>}
 */
export function activatedDeityNamesFrom(saves) {
  /** @type {Set<string>} */
  const names = new Set();
  for (const save of Array.isArray(saves) ? saves : []) {
    const config = save?.settlement?.config;
    if (!config || typeof config !== 'object') continue;
    const primary = config.primaryDeitySnapshot;
    if (primary && typeof primary === 'object' && typeof primary.name === 'string' && primary.name) {
      names.add(primary.name);
    }
    for (const cult of Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots : []) {
      if (cult && typeof cult === 'object' && typeof cult.name === 'string' && cult.name) {
        names.add(cult.name);
      }
    }
  }
  return names;
}
