import { goodCriticality } from './goodsCatalog.js';
import { ensureRegionalGraphOnce } from './graph.js';
import { wallClockNow } from '../clock.js';
import { compareCodepoint } from '../deterministicSort.js';

export const WIZARD_NEWS_SCHEMA_VERSION = 1;
export const WIZARD_NEWS_SIGNIFICANCE = Object.freeze({
  MAJOR: 'major',
  NOTABLE: 'notable',
  ROUTINE: 'routine',
});

// The governed section vocabulary mirrors the Herald's seven desks without
// importing the reader-only routing module into the regional engine graph.
// Unknown persisted values fail closed to absence; every valid supplied desk
// survives normalization unchanged.
const WIZARD_NEWS_SECTIONS = new Set([
  'war', 'faith', 'trade', 'knowledge', 'events', 'divination', 'adjudication',
]);

const MAX_ENTRIES = 240;

// FP-31 (the chair's ruling of 2026-09-24 on FP-21 U2, vetoable by the owner): THE FEED KEEPS
// THE LAST YEAR WHOLE. Every entry inside the newest windowWeeks ticks of the feed
// survives the cap; MAX_ENTRIES and the arc rescue govern only what survives beyond it (see
// capEntries). The span is the estate's own year, IMPORTED from the one interval table rather
// than mirrored, so the window cannot drift from the calendar the advance menu offers.
// FP-34 (the FP chair, 2026-09-24): the feed's retention window is a REGISTERED DRAFT TUNING TABLE
// (tests/lint/.tuning-register.json, like the docket's horizon), pinned equal to INTERVAL_WEEKS.one_year
// by tests/domain/wizardNewsYearWindow.test.js, so intervalWeeks.js stays OUT of the first-paint set
// (the import owed about 387 B of eager bytes; a signed budget never rises by the chair's hand) and
// the tuning inventory sees a table, not a named magic number. The owner signs it at the tuning sitting.
export const FEED_RETENTION_TUNING = Object.freeze({ windowWeeks: 52 });
// Read in capEntries, never at module scope: a top-level read held this module in first paint.

// ── Types ──────────────────────────────────────────────────────────────────

/** @typedef {{id?: string, label?: string}} ImpactGood */

/**
 * A queued regional impact (region/propagation.js shape) as this module
 * reads it.
 * @typedef {Object} WizardRegionalImpact
 * @property {string | number} [id]
 * @property {string} [kind]
 * @property {string} [status]
 * @property {string} [channelType]
 * @property {string | number} [channelId]
 * @property {number} [severity]
 * @property {number} [waveDepth]
 * @property {number} [delayTicks]
 * @property {ImpactGood[]} [goods]
 * @property {string | number} [sourceSettlementId]
 * @property {string | number} [targetSettlementId]
 * @property {string} [sourceSettlementName]
 * @property {string} [targetSettlementName]
 * @property {Array<string | number>} [pathSettlementIds]
 * @property {string} [explanation]
 * @property {string | null} [sourceEventId]
 */

/**
 * @typedef {Object} WizardGraphEvent
 * @property {string} [id]
 * @property {Array<string | number>} [impactIds]
 * @property {{type?: string, id?: string}} [sourceEvent]
 */

/**
 * The regional-graph slice this module reads (ensureRegionalGraph output).
 * @typedef {Object} WizardGraph
 * @property {Array<{id?: string | number, name?: string}>} [nodes]
 * @property {Array<{id?: string | number, type?: string}>} [channels]
 * @property {WizardGraphEvent[]} [eventLog]
 * @property {WizardRegionalImpact[]} [queuedImpacts]
 */

/**
 * Canonical normalized feed entry (normalizeEntry output).
 * @typedef {Object} WizardNewsEntry
 * @property {number} schemaVersion
 * @property {string} id
 * @property {string | null} createdAt  null = NO STAMP (the caller threaded `now: null`).
 * @property {number} tick
 * @property {string} scope
 * @property {string} significance
 * @property {number} score
 * @property {string} headline
 * @property {string} summary
 * @property {string} kind
 * @property {string | null} impactKind
 * @property {string | null} channelType
 * @property {number} severity
 * @property {string[]} settlementIds
 * @property {string[]} [settlementNames] NEWS ADDRESS LAW reader layer.
 * @property {string[]} impactIds
 * @property {string[]} channelIds
 * @property {string | null} sourceEventId
 * @property {string[]} tags
 * @property {string[]} reasons
 * @property {string[]} [npcIds]      NEWS ADDRESS LAW actor layer — present only when non-empty.
 * @property {string[]} [factionIds]  NEWS ADDRESS LAW actor layer — present only when non-empty.
 * @property {string[]} [thirdPartyIds] Governed third-party actor addresses.
 * @property {string[]} [venueIds] Governed parley/hold place addresses.
 * @property {string[]} [termSheetIds] Governed carried-sheet provenance addresses.
 * @property {string} [source]
 * @property {boolean} [covert]
 * @property {string} [region] Q-W4 — the engagement's PLACE as a settlement id, present
 *   only when the emitting layer resolved one. An id, never a terrain class and never a
 *   name: the place sentence is re-authored from this id at render.
 * @property {string} [familyId] SP-6 structural template family.
 * @property {string} [audience] Governed reader audience for authored receipts.
 * @property {string} [section] Governed Herald desk for authored receipts.
 * @property {string} [sectionAuthority] Closed registry that authored `section`.
 */

/**
 * A raw (possibly partial / persisted) entry accepted by normalizeEntry.
 * @typedef {Object} RawWizardNewsEntry
 * @property {string | number} [id]
 * @property {string | null} [createdAt]
 * @property {number} [tick]
 * @property {string} [scope]
 * @property {string} [significance]
 * @property {number} [score]
 * @property {string} [headline]
 * @property {string} [summary]
 * @property {string} [kind]
 * @property {string | null} [impactKind]
 * @property {string | null} [channelType]
 * @property {number} [severity]
 * @property {Array<string | number | null | undefined>} [settlementIds]
 * @property {Array<string | number | null | undefined>} [settlementNames]
 * @property {Array<string | number | null | undefined>} [impactIds]
 * @property {Array<string | number | null | undefined>} [channelIds]
 * @property {string | null} [sourceEventId]
 * @property {Array<string | number | null | undefined>} [tags]
 * @property {Array<string | number | null | undefined>} [reasons]
 * @property {Array<string | number | null | undefined>} [npcIds]
 * @property {Array<string | number | null | undefined>} [factionIds]
 * @property {Array<string | number | null | undefined>} [thirdPartyIds]
 * @property {Array<string | number | null | undefined>} [venueIds]
 * @property {Array<string | number | null | undefined>} [termSheetIds]
 * @property {string} [source]
 * @property {boolean} [covert]
 * @property {string} [region]
 * @property {string} [familyId]
 * @property {string} [audience]
 * @property {string} [section]
 * @property {string} [sectionAuthority]
 */

/**
 * @typedef {Object} WizardNewsOptions
 * @property {string | null} [now]   deterministic timestamp for replay. ABSENT ⇒ the wall-clock
 *   boundary fallback; `null` ⇒ NO STAMP; a string ⇒ that instant. See resolveStamp.
 * @property {number} [tick]
 * @property {string | null} [createdAt]
 * @property {Object} [graph]
 * @property {string} [transition]
 * @property {WizardGraphEvent | null} [event]
 * @property {number} [maxEntries]
 */

/**
 * @typedef {Object} WizardNewsFeed
 * @property {number} [schemaVersion]
 * @property {number} [currentTick]
 * @property {RawWizardNewsEntry[]} [entries]
 * @property {string | null} [updatedAt]
 */

/** @type {Set<string | undefined>} */
const CRITICAL_IMPACT_KINDS = new Set([
  'import_shortage',
  'authority_instability',
  'protection_gap',
  'conflict_pressure',
  'migration_pressure',
  'route_disruption',
]);

/** @type {Set<string | undefined>} */
const CRITICAL_CHANNEL_TYPES = new Set([
  'trade_dependency',
  'trade_route',
  'political_authority',
  'military_protection',
  'war_front',
  'resource_competition',
]);

// THE SUBJECT VOCABULARY of a regional-impact receipt. These were DATABASE LABELS
// ('Conflict pressure') interpolated as the grammatical SUBJECT of six headline
// frames, so a reader met "Conflict pressure takes hold in Elmspur" — a taxonomy
// noun standing where a doer belongs. §754.3's positive clause wants a named actor
// and a typed verb; the frames below now put the SETTLEMENT in the subject slot and
// these phrases in the object slot, which is the only position a noun phrase can
// honestly hold.
//
// THE VALUES MIRROR `WHAT_PHRASES` (settlementRumors.js) FOR THESE TWELVE KINDS, and
// that is deliberate rather than incidental: the rumor surface has been telling the
// reader "the drums of war" for the same `impactKind` this file spelled 'Conflict
// pressure', so the two surfaces described one event in two registers. The mirror is
// SPELLED OUT rather than imported for the reason stated at the top of this file for
// WIZARD_NEWS_SECTIONS: the regional engine graph does not import the reader-only
// display modules. tests/lint/newsSubjectVocabulary.walker.test.js imports BOTH and
// pins them equal, so the duplication is machinery rather than a drift hazard.
//
// `relief` carries NO row: both prose functions intercept that kind ahead of every
// label frame ([domain-events-region-7] G1d, extended to the summary here), so a row
// would be unreachable. The walker asserts that unreachability by execution.
// Exported for tests/lint/newsSubjectVocabulary.walker.test.js ONLY, which imports
// this map and WHAT_PHRASES together and pins them equal. Nothing in src reads it
// (the WHAT_PHRASES precedent: a table exported so its mirror can be enforced).
/** @type {Readonly<Record<string, string>>} */
export const IMPACT_LABELS = Object.freeze({
  import_shortage: 'a shortage of goods',
  export_market_loss: 'lost markets',
  route_disruption: 'the roads gone bad',
  authority_instability: 'a shaken authority',
  tax_revenue_disruption: 'coffers running short',
  protection_gap: 'defences grown thin',
  service_disruption: 'services faltering',
  conflict_pressure: 'the drums of war',
  migration_pressure: 'people on the move',
  information_shock: 'unsettling news',
  criminal_pressure: 'a rise in lawlessness',
  religious_pressure: 'a stir among the faithful',
});

// The subject an unregistered regional kind takes. It is an in-world phrase and NOT
// a de-underscored token: `human(kind)` used to serve here, which meant an engine
// slug could reach a PERSISTED headline and, under THE PROMISE, stay in a save for
// the life of that world. Refusing to mint vocabulary is the whole cure.
const NEUTRAL_SUBJECT = 'a hard turn in its fortunes';

// Reader-facing scoring receipts. The score and all numeric evidence remain on
// the entry; these closed phrases are the only form the reasons take in prose.
const IMPACT_REASON_PHRASES = Object.freeze({
  high: 'a heavy blow',
  meaningful: 'a real blow',
  criticalImpact: 'a matter that cuts deep',
  criticalChannel: 'carried along a vital road',
  cascade: 'spreading from town to town',
  broad: 'reaching across the country',
  criticalGoods: 'touching goods the country cannot do without',
  importantGoods: 'touching goods that matter',
  applied: 'the effect has taken hold',
  ready: 'the long wait is over',
  resolved: 'a great pressure lifted',
  expired: 'the danger has passed',
  routine: 'a quiet matter',
});

// The regional graph keeps the typed channel on the record. Prose speaks the
// same fact through a finite world vocabulary instead of printing an engine key.
/** @type {Readonly<Record<string, string>>} */
const CHANNEL_PHRASES = Object.freeze({
  trade_dependency: 'through the trade that binds the two towns',
  export_market: 'through the markets they share',
  trade_route: 'along the trade roads',
  political_authority: 'through the chain of authority',
  tax_obligation: 'along the tax road',
  military_protection: 'under the shield that joins them',
  war_front: 'along the war front',
  resource_competition: 'through their struggle over scarce goods',
  service_dependency: 'through the services one town owes the other',
  religious_authority: 'through the temples that bind them',
  criminal_corridor: 'along the hidden roads of the underworld',
  migration_pressure: 'along the roads taken by the displaced',
  information_flow: 'by rumour and messenger',
});

function nowIso() {
  return wallClockNow();
}

/**
 * Resolve a threaded instant into a stamp. THE THREE CASES ARE THREE, NOT TWO — this is
 * the news half of the same contract `region/graph.js` states for the regional graph, and
 * the two are deliberately spelled identically so a reader of one recognises the other.
 *
 *   • `undefined` (the option was never supplied) → the documented BOUNDARY fallback,
 *     mint from the wall clock. UNCHANGED, and it is why this module still holds exactly
 *     one `wallClockNow` read (LEDGER_A's row for this file).
 *   • `null` (the caller explicitly passed one) → NO STAMP. Honoured as written.
 *   • a non-empty string → that instant.
 *
 * WHY THIS EXISTS. The six writers below all ended at `… || options.now || nowIso()` — an
 * `||`, so an explicitly passed `now: null`, which READS as "pin this to nothing", was
 * falsy and landed on the wall clock at millisecond resolution. Two calls a few
 * milliseconds apart then produced different bytes ~0.4% of the time, which is a random
 * red on every landing gate rather than an honest one. A spelling ban was fenced around
 * the trap at these six writers; this removes the trap, and the ban narrows to the half
 * that still deceives (`now: undefined`, which really does mean "absent").
 *
 * An empty string collapses to null: it is not a valid instant, and letting it through
 * would put `""` into a persisted stamp.
 * @param {string | null | undefined} now
 * @returns {string | null}
 */
function resolveStamp(now) {
  return now === undefined ? nowIso() : (now || null);
}

/**
 * @param {unknown} value
 * @param {number} [fallback]
 * @returns {number}
 */
function finiteNumber(value, fallback = 0) {
  return /** @type {number} */ (Number.isFinite(value) ? value : fallback);
}

/**
 * @param {unknown} value
 * @returns {number}
 */
function clamp01(value) {
  const n = finiteNumber(value, 0);
  return Math.max(0, Math.min(1, n));
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function human(value) {
  if (!value) return '';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * The in-world SUBJECT PHRASE for a regional impact kind. There is deliberately no
 * compute arm: an unregistered kind takes the neutral phrase rather than a
 * de-underscored slug, so this function SELECTS vocabulary and never mints it.
 * @param {string | null | undefined} kind
 * @returns {string}
 */
function impactPhrase(kind) {
  return IMPACT_LABELS[/** @type {string} */ (kind)] || NEUTRAL_SUBJECT;
}

/**
 * Capitalize a leading name or neutral phrase. The frames below LEAD with the
 * settlement, and the neutral stand-in ('a far settlement') is authored lowercase so
 * one literal serves every position — the eager-byte law recorded at the C2/bar-4
 * cure. This restores sentence case at the one position that needs it, instead of a
 * capitalized twin literal.
 * @param {string} value
 * @returns {string}
 */
function leadCap(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

/**
 * @param {WizardGraph} graph
 * @returns {Map<string, string>}
 */
function nodeNameMap(graph) {
  // Map only REALLY-NAMED nodes: graph normalization (region/graph.js) defaults a
  // nameless node's name to String(node.id), so a node "has a name" that is just
  // its raw internal id. Exclude those (name === id) as well as the truly nameless
  // so the headline/summary fallback chains reach a neutral in-world phrase, never
  // the raw id inside diegetic copy.
  return new Map(
    (graph.nodes || [])
      .filter(node => node && node.name && String(node.name) !== String(node.id))
      .map(node => /** @type {[string, string]} */ ([String(node.id), String(node.name)])),
  );
}

/**
 * @param {WizardGraph} graph
 * @returns {Map<string, {id?: string | number, type?: string}>}
 */
function channelMap(graph) {
  return new Map((graph.channels || []).map(channel => /** @type {[string, {id?: string | number, type?: string}]} */ ([String(channel.id), channel])));
}

/**
 * @param {WizardGraph} graph
 * @param {string | number | null | undefined} impactId
 * @returns {WizardGraphEvent | null}
 */
function eventForImpact(graph, impactId) {
  if (!impactId) return null;
  return (graph.eventLog || []).find(event =>
    Array.isArray(event.impactIds) && event.impactIds.map(String).includes(String(impactId))
  ) || null;
}

/**
 * @param {ImpactGood[]} [goods]
 * @returns {number}
 */
function maxCriticality(goods = []) {
  return (goods || []).reduce((max, good) => Math.max(max, goodCriticality(good)), 0);
}

/**
 * Compact an id list: drop falsy members, stringify, dedupe. NON-ARRAY INPUT
 * DEGRADES TO EMPTY rather than throwing — this runs on PERSISTED save data
 * (ensureWizardNewsFeed re-normalizes every stored entry on every read), and a
 * malformed or hand-edited field must not take the whole feed down with a
 * TypeError. Degrading here is the same fail-closed posture normalizeEntry
 * already applies to every other field it reads.
 * @param {unknown} [values]
 * @returns {string[]}
 */
function compactIds(values = []) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter(Boolean).map(String))];
}

/** Names are an ADDRESS CHAIN parallel to settlementIds, not a set. Preserve two
 * distinct settlements that honestly share one name instead of deduplicating them. */
function compactNames(values = []) {
  if (!Array.isArray(values)) return [];
  return values.filter(value => value != null && value !== '').map(String);
}

/**
 * @param {WizardRegionalImpact} impact
 * @returns {string[]}
 */
function pathSettlementIds(impact) {
  return compactIds([
    impact.sourceSettlementId,
    ...(Array.isArray(impact.pathSettlementIds) ? impact.pathSettlementIds : []),
    impact.targetSettlementId,
  ]);
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} [transition]
 * @returns {{score: number, reasons: string[]}}
 */
function scoreImpact(impact, transition = 'queued') {
  const severity = clamp01(impact.severity);
  const pathCount = pathSettlementIds(impact).length;
  const criticality = maxCriticality(impact.goods);
  /** @type {string[]} */
  const reasons = [];
  let score = Math.round(severity * 70);

  if (severity >= 0.75) {
    score += 25;
    reasons.push(IMPACT_REASON_PHRASES.high);
  } else if (severity >= 0.6) {
    score += 15;
    reasons.push(IMPACT_REASON_PHRASES.meaningful);
  }

  if (CRITICAL_IMPACT_KINDS.has(impact.kind)) {
    score += 14;
    reasons.push(IMPACT_REASON_PHRASES.criticalImpact);
  }

  if (CRITICAL_CHANNEL_TYPES.has(impact.channelType)) {
    score += 10;
    reasons.push(IMPACT_REASON_PHRASES.criticalChannel);
  }

  if ((impact.waveDepth || 0) > 0) {
    score += 16;
    reasons.push(IMPACT_REASON_PHRASES.cascade);
  }

  if (pathCount >= 3) {
    score += 14;
    reasons.push(IMPACT_REASON_PHRASES.broad);
  }

  if (criticality >= 0.8) {
    score += 12;
    reasons.push(IMPACT_REASON_PHRASES.criticalGoods);
  } else if (criticality >= 0.65) {
    score += 7;
    reasons.push(IMPACT_REASON_PHRASES.importantGoods);
  }

  if (transition === 'applied') {
    score += 10;
    reasons.push(IMPACT_REASON_PHRASES.applied);
  } else if (transition === 'ready') {
    score += 8;
    reasons.push(IMPACT_REASON_PHRASES.ready);
  } else if (transition === 'resolved' && severity >= 0.6) {
    score += 6;
    reasons.push(IMPACT_REASON_PHRASES.resolved);
  } else if (transition === 'expired') {
    score += 4;
    reasons.push(IMPACT_REASON_PHRASES.expired);
  }

  return { score, reasons };
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} [transition]
 * @returns {{score: number, reasons: string[], significance: string}}
 */
function significanceForImpact(impact, transition = 'queued') {
  const severity = clamp01(impact.severity);
  const pathCount = pathSettlementIds(impact).length;
  const { score, reasons } = scoreImpact(impact, transition);
  const major =
    score >= 85
    || severity >= 0.75
    || ((impact.waveDepth || 0) > 0 && severity >= 0.4)
    || pathCount >= 3
    || (transition === 'applied' && severity >= 0.65);

  return {
    score,
    reasons: reasons.length ? reasons : [IMPACT_REASON_PHRASES.routine],
    significance: major ? WIZARD_NEWS_SIGNIFICANCE.MAJOR : WIZARD_NEWS_SIGNIFICANCE.NOTABLE,
  };
}

/**
 * @param {WizardRegionalImpact} impact
 * @returns {string}
 */
function scopeForImpact(impact) {
  if (pathSettlementIds(impact).length >= 3 || (impact.waveDepth || 0) > 0) return 'realm';
  if (impact.sourceSettlementId && impact.targetSettlementId && String(impact.sourceSettlementId) !== String(impact.targetSettlementId)) return 'regional';
  return 'settlement';
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} transition
 * @param {Map<string, string>} names
 * @returns {string}
 */
function headlineForImpact(impact, transition, names) {
  const phrase = impactPhrase(impact.kind);
  // C2 (bar 4): the neutral fallback speaks the world's register, never the
  // software's — "a far settlement". Raw ids still never leak (finding-11's law).
  const target = names.get(String(impact.targetSettlementId)) || impact.targetSettlementName || 'a far settlement';
  // THE NAMED TOWN IS THE GRAMMATICAL SUBJECT of every frame below. It is the only
  // address in the headline ON PURPOSE: `sourceSettlementId` is optional on a
  // hand-built impact, so a frame that named a source would ASSERT an origin the
  // record may not hold. The summary carries the full chain, and `settlementIds`
  // carries it structurally on every entry either way.
  //
  // ⛔ THE HEADLINE IS A METRONOME SUPPRESSION KEY — `isMetronomeRepeat`
  // (worldPulse/worldPulseFeedCuration.js) compares `prior.headline === entry.headline`
  // over a six-tick window. These frames are SINGLE-VALUED for that reason: pooling
  // them the way newsVoice pools its lines would give every repeat a different
  // variant, silently disable the suppressor, let extra entries survive into the
  // 240-cap feed and move the rumor-ledger golden. Identical inputs must keep
  // yielding identical headlines, so the suppression equivalence class is unchanged
  // BY CONSTRUCTION. Variety belongs at render, where it is byte-inert by contract.
  const town = leadCap(target);

  if ((impact.waveDepth || 0) > 0 && (transition === 'queued' || transition === 'ready')) {
    return `${town} feels the trouble spreading from town to town`;
  }
  // [domain-events-region-7] G1d — relief reads as a POSITIVE beat (pressure eases),
  // not "faces relief" / "relief takes hold". Frozen byte-identically.
  if (impact.kind === 'relief') {
    if (transition === 'applied' || transition === 'resolved') return `Pressure eases in ${target}`;
    return `Relief reaches ${target}`;
  }
  if (transition === 'ready') return `${town} braces for ${phrase}`;
  if (transition === 'applied') return `${town} wakes to ${phrase}`;
  if (transition === 'resolved') return `${town} has seen the last of ${phrase}`;
  if (transition === 'ignored') return `${town} pays no heed to ${phrase}`;
  if (transition === 'expired') return `${town} is spared ${phrase}`;
  return `${town} has word of ${phrase}`;
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} transition
 * @param {Map<string, string>} names
 * @param {Map<string, {id?: string | number, type?: string}>} channels
 * @returns {string}
 */
function summaryForImpact(impact, transition, names, channels) {
  // Both stand-ins speak the world's register rather than the software's, and both
  // sit MID-SENTENCE in every frame below, so both stay lowercase — the same
  // one-literal-serves-every-position law the headline's fallback follows. The two
  // that used to sit here, 'A regional source' and 'the target', were the software
  // naming its own parameters inside diegetic copy.
  const source = names.get(String(impact.sourceSettlementId)) || impact.sourceSettlementName || 'a neighbouring town';
  const target = names.get(String(impact.targetSettlementId)) || impact.targetSettlementName || 'a far settlement';
  const channel = channels.get(String(impact.channelId));
  const channelType = String(impact.channelType || channel?.type || '');
  const road = CHANNEL_PHRASES[channelType] || 'across the region';
  const goods = (impact.goods || [])
    .map((good) => {
      if (typeof good === 'string') return human(good);
      return good?.label || human(good?.id);
    })
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');
  const goodsPart = goods ? `, with ${goods} caught in the balance` : '';
  const phrase = impactPhrase(impact.kind);
  const town = leadCap(target);
  // [domain-events-region-7] G1d, EXTENDED TO THE SUMMARY. The headline has read
  // relief as a positive beat since that wave; the summary one line below it still
  // ran the negative frames, so one entry carried both signs. The interception is
  // what makes `relief` unreachable in IMPACT_LABELS, and the walker proves it.
  if (impact.kind === 'relief') {
    if (transition === 'applied' || transition === 'resolved') {
      return `${town} feels the pressure easing, with help come from ${source} ${road}${goodsPart}.`;
    }
    return `${town} has word of relief on the road from ${source} ${road}${goodsPart}.`;
  }
  // THE NAMED TOWN IS THE SUBJECT here too, and the verbs are the headline's, so the
  // lede and the detail read as one desk. Each frame adds what the headline withheld:
  // the SOURCE, the ROAD it travelled and the GOODS caught in it — the address chain
  // the record has always carried in `settlementIds` and never spoke aloud.
  if (transition === 'ready') return `${town} braces for ${phrase}, come from ${source} ${road}${goodsPart}.`;
  if (transition === 'applied') return `${town} wakes to ${phrase}, come from ${source} ${road}${goodsPart}.`;
  if (transition === 'resolved') return `${town} has seen the last of ${phrase}, which came from ${source} ${road}${goodsPart}.`;
  if (transition === 'ignored') return `${town} pays no heed to ${phrase}, come from ${source} ${road}${goodsPart}.`;
  if (transition === 'expired') return `${town} is spared ${phrase}, which ${source} sent ${road}${goodsPart}.`;
  return `${town} has word of ${phrase}, on the way from ${source} ${road}${goodsPart}.`;
}

/**
 * @param {WizardRegionalImpact} impact
 * @param {string} transition
 * @returns {string[]}
 */
function tagList(impact, transition) {
  return compactIds([
    transition,
    impact.kind,
    impact.channelType,
    ...(impact.goods || []).map(g => g.id || g.label),
    (impact.waveDepth || 0) > 0 ? 'cascade' : null,
  ]);
}

// Deterministic timestamps: callers thread options.now so replay stamps no
// wall-clock time; the wall clock is the fallback ONLY when not provided.
/**
 * @param {RawWizardNewsEntry | null | undefined} entry
 * @param {WizardNewsOptions} [options]
 * @returns {WizardNewsEntry | null}
 */
function normalizeEntry(entry, options = {}) {
  if (!entry?.id) return null;
  const familyId = entry.familyId ? String(entry.familyId) : '';
  const severity = clamp01(entry.severity);
  const score = Math.max(0, Math.round(finiteNumber(entry.score, severity * 70)));
  const significance = entry.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR
    ? WIZARD_NEWS_SIGNIFICANCE.MAJOR
    : familyId && entry.significance === WIZARD_NEWS_SIGNIFICANCE.ROUTINE
      ? WIZARD_NEWS_SIGNIFICANCE.ROUTINE
      : WIZARD_NEWS_SIGNIFICANCE.NOTABLE;

  return {
    schemaVersion: WIZARD_NEWS_SCHEMA_VERSION,
    id: String(entry.id),
    createdAt: entry.createdAt || resolveStamp(options.now),
    tick: Math.max(0, Math.floor(finiteNumber(entry.tick, 0))),
    scope: entry.scope || 'regional',
    significance,
    score,
    headline: entry.headline || 'Regional update',
    summary: entry.summary || '',
    kind: entry.kind || 'queued',
    impactKind: entry.impactKind || null,
    channelType: entry.channelType || null,
    severity,
    settlementIds: compactIds(entry.settlementIds),
    // The reader half of the governed SP-6 address chain. It rides familyId so
    // existing v1 producers that happened to pass names remain byte-identical
    // when the WR-2 flag is dark; new governed rows retain both together.
    ...(familyId && compactNames(entry.settlementNames).length
      ? { settlementNames: compactNames(entry.settlementNames) }
      : {}),
    impactIds: compactIds(entry.impactIds),
    channelIds: compactIds(entry.channelIds),
    sourceEventId: entry.sourceEventId || null,
    tags: compactIds(entry.tags),
    reasons: compactIds(entry.reasons),
    // THE NEWS ADDRESS LAW's ACTOR layer (T4 ONE-REGEN batch). `settlementIds`
    // already carries the place; these carry the SUBJECT — the npc or faction the
    // beat is about — as TYPED ids, so the Herald links a subject instead of
    // scanning its own headline prose for a name. Ids are minted only where a
    // composer already holds the typed identity, in the realm entity web's own
    // spelling (`<saveId>:<localId>`), so a rendered link resolves or degrades to
    // exactly today's text.
    //
    // BYTE-NEUTRAL BY CONSTRUCTION (the V-17 `source` idiom above): the key is
    // spread in ONLY when a non-empty id list survives compaction. Every entry
    // minted without ids — and every entry already persisted in a save, which
    // ensureWizardNewsFeed re-normalizes on every read — serializes exactly as
    // before. Absent-tolerant on old saves without a migration.
    ...(compactIds(entry.npcIds).length ? { npcIds: compactIds(entry.npcIds) } : {}),
    ...(compactIds(entry.factionIds).length ? { factionIds: compactIds(entry.factionIds) } : {}),
    ...(compactIds(entry.thirdPartyIds).length
      ? { thirdPartyIds: compactIds(entry.thirdPartyIds) }
      : {}),
    ...(compactIds(entry.venueIds).length ? { venueIds: compactIds(entry.venueIds) } : {}),
    ...(compactIds(entry.termSheetIds).length
      ? { termSheetIds: compactIds(entry.termSheetIds) }
      : {}),
    // V-17 provenance: table-authored history (source:'table') is distinguishable
    // from world-authored (the soak excludes 'table'). BYTE-NEUTRAL: world entries
    // pass no `source`, so this spread adds nothing and their serialization is
    // unchanged; only table-imported entries carry the field.
    ...(entry.source ? { source: entry.source } : {}),
    // Covert pass-through (the same byte-neutral idiom): no generated feed writes
    // `covert` today, so every existing entry serializes unchanged — but an
    // imported/future covert entry KEEPS its flag through normalization, so the
    // World Book's player-face isCovertEntry filter is live end-to-end instead of
    // a dead branch (SB2 finding: covert marks must not survive into the handout).
    ...(entry.covert === true ? { covert: true } : {}),
    // Q-W4 — THE ENGAGEMENT'S PLACE, as a settlement id. Same byte-neutral conditional
    // idiom as `covert` above, and for the same reason that defect taught: this
    // rebuilder is an ALLOWLIST, so a field the writer sets and normalizeEntry does not
    // name is silently dropped on the very first append and again on every load —
    // leaving a live reader branch dead against every persisted feed. A field battle is
    // the one engagement whose site existed at mint time and was spent entirely on a
    // display name baked into `reasons[0]`; persisting the ID lets the place sentence be
    // re-authored at render instead of parsed back out of our own prose. Absent when the
    // emitting layer resolved no region ⇒ no key ⇒ every existing feed is byte-identical.
    ...(typeof entry.region === 'string' && entry.region.trim()
      ? { region: entry.region.trim() }
      : {}),
    // SP-6 family identity is metadata, never prose. It records which structural
    // template produced the rendered sentence; changing slot fills cannot disguise
    // a repeated family from the soak instrument.
    ...(familyId ? { familyId } : {}),
    ...(entry.audience === 'public' || entry.audience === 'dm-only'
      ? { audience: entry.audience }
      : {}),
    ...(WIZARD_NEWS_SECTIONS.has(entry.section)
      ? { section: entry.section }
      : {}),
    // ⛔ THIS LIST MUST EQUAL heraldRouting.js#heraldSectionOfRecord's ACCEPTED SET.
    // It is spelled here BY HAND rather than imported, following the estate's own
    // precedent (brokerageStamps.js:333 keeps a local copy "rather than imported from
    // domain/realm/heraldRouting.js"), because the engine chunk's margin is 236 B and a
    // new cross-layer import is not worth it for four string literals. The two lists are
    // held identical by an ARM in tests/lint/heraldRouting.walker.test.js, so a future
    // divergence reds instead of ghosting.
    //
    // `sovereignty_registry` WAS MISSING HERE, and the router's own WR-10 comment names
    // the consequence: "without this token those five file wrong while compiling and
    // passing". Because normalizeEntry is an ALLOWLIST rebuilder run on every APPEND as
    // well as every load, the authority was stripped the moment an entry was written, so
    // heraldSectionOfRecord stopped honouring the authored desk and fell through to
    // SECTION_OF — and SECTION_OF structurally never returns `adjudication`. The five
    // measured casualties: cession_for_peace, bought_seat_fragility,
    // kinship_opposes_the_sale and sale_books_diverged (all `adjudication`) landed in the
    // `events` catch-all, and sovereignty_sale_judged (`faith`) agreed only by coincidence.
    ...((entry.sectionAuthority === 'war_rulings_registry'
        || entry.sectionAuthority === 'war_coalition_registry'
        || entry.sectionAuthority === 'envoy_registry'
        || entry.sectionAuthority === 'sovereignty_registry')
      && WIZARD_NEWS_SECTIONS.has(entry.section)
      ? { sectionAuthority: entry.sectionAuthority }
      : {}),
  };
}

/**
 * @param {WizardNewsEntry[]} entries
 * @returns {WizardNewsEntry[]}
 */
function sortEntries(entries) {
  return entries.slice().sort((a, b) => {
    if (b.tick !== a.tick) return b.tick - a.tick;
    if (b.score !== a.score) return b.score - a.score;
    return compareCodepoint(b.createdAt, a.createdAt);
  });
}

/**
 * Cap the feed. FP-31, A STATED BEHAVIOUR CHANGE (the chair's ruling of 2026-09-24 on FP-21 U2,
 * vetoable by the owner): THE LAST YEAR IS KEPT WHOLE. Every entry inside the newest
 * FEED_RETENTION_TUNING.windowWeeks ticks survives; the policy of record (`recencyArcCap`: recency
 * plus the major-arc rescue) runs unchanged over the whole feed and decides only what survives
 * BEYOND the window. The two compose as a union:
 *   - at or below `max` nothing is evicted (unchanged);
 *   - when the policy already keeps the whole window, the result IS the policy's own array,
 *     byte-identical to the pre-FP-31 cap (every feed that holds fewer than `max` entries in
 *     its newest year, rescue room included);
 *   - otherwise the window entries the policy would evict are restored in global order, and
 *     every head the policy rescued stays: the biggest burnings still outlive the year, and a
 *     lesser one is still forgotten once it leaves it (believedRazings.js, THE RECORDED LIMIT,
 *     now with a one-year floor).
 * WHY: the kernel appends once per weekly tick and every append re-caps, so at the year grain
 * the news of the advance in progress was evicted before any surface showed it (FP EXPERIENCE
 * READ 2 §3 S4: year one minted 426, the feed kept 240). The window is anchored on the NEWEST
 * ENTRY'S tick and knows nothing of the advance grain, so a one-year advance still composes the
 * same feed as fifty-two one-week advances (advanceCampaignWorldInterval.test.js EQUIVALENCE).
 * @param {WizardNewsEntry[]} sortedEntries  already sorted newest-first
 * @param {number} [max]
 * @returns {WizardNewsEntry[]}
 */
function capEntries(sortedEntries, max = MAX_ENTRIES) {
  if (sortedEntries.length <= max) return sortedEntries.slice(0, max);
  const capped = recencyArcCap(sortedEntries, max);
  // The window is a PREFIX of the newest-first order: sortEntries' first key is the tick.
  const floorTick = sortedEntries[0].tick - FEED_RETENTION_TUNING.windowWeeks;
  /** @type {Set<WizardNewsEntry>} */
  const kept = new Set(capped);
  let restored = 0;
  for (const entry of sortedEntries) {
    if (entry.tick <= floorTick) break;
    if (!kept.has(entry)) { kept.add(entry); restored += 1; }
  }
  return restored === 0 ? capped : sortedEntries.filter(e => kept.has(e));
}

/**
 * THE POLICY OF RECORD (the pre-FP-31 capEntries, unchanged; capEntries above adds the
 * one-year window over it). At or below the cap this is the byte-identical recency
 * slice (`sortedEntries.slice(0, max)`). Above it: keep the most-recent `max`
 * (RECENCY — so recent low-volume notables, e.g. a season marker, always
 * survive), then RESCUE the heads of major arcs that recency would flush — one
 * slot per story, so a high-volume major arc (e.g. a 100-entry crime churn)
 * contributes at most its single newest entry and can never dominate the feed.
 * Each rescue displaces the OLDEST recency entry; rescues are bounded to
 * floor(max/2) so recency always keeps the majority of the window. Pure +
 * deterministic: operates on the pre-sorted array and filters by reference, so
 * the global newest-first order is preserved and the total is always <= max.
 * @param {WizardNewsEntry[]} sortedEntries  already sorted newest-first
 * @param {number} max
 * @returns {WizardNewsEntry[]}
 */
function recencyArcCap(sortedEntries, max) {
  if (sortedEntries.length <= max) return sortedEntries.slice(0, max);
  const recent = sortedEntries.slice(0, max);
  /** @type {Set<WizardNewsEntry>} */
  const recentSet = new Set(recent);
  /** @type {Set<string>} */
  const majorArcs = new Set();
  for (const e of sortedEntries) {
    if (e.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR) majorArcs.add(arcIdForEntry(e));
  }
  // One HEAD (newest entry) per major arc, kept only when recency would flush it
  // (an orphan: its whole arc fell outside the most-recent-`max` window).
  /** @type {Set<string>} */
  const seenArc = new Set();
  /** @type {WizardNewsEntry[]} */
  const orphanHeads = [];
  for (const e of sortedEntries) {            // newest-first
    const a = arcIdForEntry(e);
    if (seenArc.has(a)) continue;
    seenArc.add(a);
    if (majorArcs.has(a) && !recentSet.has(e)) orphanHeads.push(e);
  }
  if (orphanHeads.length === 0) return recent;              // identical to pure recency
  const rescue = orphanHeads.slice(0, Math.floor(max / 2)); // never displace more than half the window
  // Each rescue displaces the OLDEST recency entry. Rescues are orphans (chosen
  // only when NOT in `recent`), so `recent ∩ rescue = ∅` and dropping the oldest
  // `rescue.length` recency entries reduces to a head slice: keep the newest
  // (max − rescue.length) recency entries, then add the rescued heads.
  /** @type {Set<WizardNewsEntry>} */
  const keep = new Set([...recent.slice(0, max - rescue.length), ...rescue]);
  return sortedEntries.filter(e => keep.has(e));            // preserve global order, total === max
}

/**
 * The feed's normalized tick, WITHOUT normalizing the feed.
 *
 * ⛔ WHY THIS EXISTS AS ITS OWN EXPORT. `ensureWizardNewsFeed` mints an `updatedAt` when the
 * feed carries none, and that mint falls through to the wall clock. A caller that wants only
 * the integer tick — `campaignPulseHelpers.campaignClockTick` is the one in the estate — was
 * paying a wall-clock read for a value it then threw away, on a READ path. This is the
 * single source both it and `ensureWizardNewsFeed` now use, so the normalization cannot
 * fork: change the clamp here and both move together.
 * @param {WizardNewsFeed | null | undefined} feed
 * @returns {number}
 */
export function wizardNewsCurrentTick(feed) {
  return Math.max(0, Math.floor(finiteNumber(feed?.currentTick, 0)));
}

/**
 * @param {WizardNewsFeed | null | undefined} [feed]
 * @param {WizardNewsOptions} [options]
 * @returns {{schemaVersion: number, currentTick: number, entries: WizardNewsEntry[], updatedAt: string | null}}
 */
export function ensureWizardNewsFeed(feed = {}, options = {}) {
  const entries = /** @type {WizardNewsEntry[]} */ (Array.isArray(feed?.entries)
    ? feed.entries.map(entry => normalizeEntry(entry, options)).filter(Boolean)
    : []);
  return {
    schemaVersion: WIZARD_NEWS_SCHEMA_VERSION,
    currentTick: wizardNewsCurrentTick(feed),
    entries: capEntries(sortEntries(entries), MAX_ENTRIES),
    updatedAt: feed?.updatedAt || resolveStamp(options.now),
  };
}

/**
 * Project one stored Wizard News feed for a reader without rewriting or
 * re-normalizing it. The DM receives the original feed, byte for byte. Every
 * other audience fails closed: covert entries and entries explicitly authored
 * for a DM-only audience are omitted while the feed's schema, clock, and other
 * sidecar fields are preserved.
 *
 * This is deliberately a read-side projection rather than a second feed. A
 * covert fact stays available to the DM and to replay, but cannot cross a
 * player/public presentation seam merely because that surface reads the shared
 * campaign feed directly.
 *
 * @template T
 * @param {T} feed
 * @param {string} [audience]
 * @returns {T}
 */
export function projectWizardNewsForAudience(feed, audience = 'dm') {
  if (audience === 'dm' || !feed || typeof feed !== 'object') return feed;
  const record = /** @type {{entries?: unknown}} */ (feed);
  if (!Array.isArray(record.entries)) return feed;

  const entries = record.entries.filter((entry) => {
    if (!entry || typeof entry !== 'object') return true;
    const row = /** @type {{covert?: unknown, audience?: unknown}} */ (entry);
    return row.covert !== true && row.audience !== 'dm-only' && row.audience !== 'dm';
  });
  if (entries.length === record.entries.length) return feed;
  return /** @type {T} */ ({ ...record, entries });
}

/**
 * @param {WizardNewsFeed | null | undefined} [feed]
 * @param {number} [ticks]
 * @param {WizardNewsOptions} [options]
 * @returns {{schemaVersion: number, currentTick: number, entries: WizardNewsEntry[], updatedAt: string | null}}
 */
export function advanceWizardNewsFeed(feed = {}, ticks = 1, options = {}) {
  const current = ensureWizardNewsFeed(feed, options);
  const amount = Math.max(1, Math.floor(finiteNumber(ticks, 1)));
  return {
    ...current,
    currentTick: current.currentTick + amount,
    updatedAt: resolveStamp(options.now),
  };
}

/**
 * @param {WizardRegionalImpact | null | undefined} impact
 * @param {WizardNewsOptions} [options]
 * @returns {WizardNewsEntry | null}
 */
export function createWizardNewsEntryFromImpact(impact, options = {}) {
  if (!impact?.id) return null;
  // performance-scale-7: the diff below passes its already-ensured `after` graph per
  // changed impact — ensureRegionalGraphOnce skips the redundant re-normalization.
  const graph = ensureRegionalGraphOnce(options.graph || {}, { now: options.now });
  const transition = options.transition || impact.status || 'queued';
  const tick = Math.max(0, Math.floor(finiteNumber(options.tick, 0)));
  const names = nodeNameMap(graph);
  const channels = channelMap(graph);
  const event = options.event || eventForImpact(graph, impact.id);
  const { significance, score, reasons } = significanceForImpact(impact, transition);
  const createdAt = options.createdAt || resolveStamp(options.now);

  return normalizeEntry({
    id: `wizard_news.${tick}.${transition}.${impact.id}`,
    createdAt,
    tick,
    scope: scopeForImpact(impact),
    significance,
    score,
    headline: headlineForImpact(impact, transition, names),
    summary: summaryForImpact(impact, transition, names, channels),
    kind: transition,
    impactKind: impact.kind,
    channelType: impact.channelType || channels.get(String(impact.channelId))?.type || null,
    severity: impact.severity,
    settlementIds: pathSettlementIds(impact),
    impactIds: [impact.id],
    channelIds: [impact.channelId],
    sourceEventId: event?.sourceEvent?.id || event?.id || impact.sourceEventId || null,
    tags: tagList(impact, transition),
    reasons,
  });
}

/**
 * @param {WizardGraph | null | undefined} [beforeGraph]
 * @param {WizardGraph | null | undefined} [afterGraph]
 * @param {WizardNewsOptions} [options]
 * @returns {WizardNewsEntry[]}
 */
export function deriveWizardNewsEntriesFromGraphChange(beforeGraph = {}, afterGraph = {}, options = {}) {
  // performance-scale-7: this diff runs per changed outcome application, so re-
  // normalizing the whole graph ×2 here multiplied by the outcome count. The call
  // sites already hold ensureRegionalGraph outputs (branded), so the Once form skips
  // the redundant normalization; an unbranded/rehydrated graph still gets a full ensure.
  const before = ensureRegionalGraphOnce(/** @type {import('./graph.js').RegionGraph} */ (beforeGraph || {}), { now: options.now });
  const after = ensureRegionalGraphOnce(/** @type {import('./graph.js').RegionGraph} */ (afterGraph || {}), { now: options.now });
  const beforeById = new Map(before.queuedImpacts.map(impact => [impact.id, impact]));
  const entries = [];
  const tick = Math.max(0, Math.floor(finiteNumber(options.tick, 0)));
  const createdAt = options.createdAt || resolveStamp(options.now);

  for (const impact of after.queuedImpacts) {
    const previous = beforeById.get(impact.id);
    let transition = null;

    if (!previous) {
      transition = impact.status || 'queued';
    } else if (previous.status !== impact.status) {
      transition = impact.status;
    } else if (
      impact.status === 'queued'
      && (previous.delayTicks || 0) > 0
      && (impact.delayTicks || 0) <= 0
    ) {
      transition = 'ready';
    }

    if (!transition) continue;
    const entry = createWizardNewsEntryFromImpact(impact, {
      graph: after,
      transition,
      tick,
      createdAt,
      // `now` MUST ride along with the already-resolved `createdAt`. When the caller
      // threaded `now: null`, `createdAt` above resolves to null — and a null
      // `options.createdAt` is falsy, so the callee re-resolves from ITS `options.now`.
      // Without this line that is `undefined`, i.e. "absent", and the callee would mint
      // a wall clock — reintroducing at the hand-off exactly the leak this cure closes.
      now: options.now,
    });
    if (entry) entries.push(entry);
  }

  return sortEntries(entries);
}

/**
 * @param {WizardNewsFeed | null | undefined} [feed]
 * @param {RawWizardNewsEntry[]} [entries]
 * @param {WizardNewsOptions} [options]
 * @returns {{schemaVersion: number, currentTick: number, entries: WizardNewsEntry[], updatedAt: string | null}}
 */
export function appendWizardNewsEntries(feed = {}, entries = [], options = {}) {
  const current = ensureWizardNewsFeed(feed, options);
  const byId = new Map(current.entries.map(entry => [entry.id, entry]));
  for (const raw of entries || []) {
    const entry = normalizeEntry(raw, options);
    if (!entry) continue;
    byId.set(entry.id, { ...(byId.get(entry.id) || {}), ...entry });
  }
  return {
    ...current,
    entries: capEntries(sortEntries([...byId.values()]), options.maxEntries || MAX_ENTRIES),
    updatedAt: entries?.length ? resolveStamp(options.now) : current.updatedAt,
  };
}

// ── THE AUTHORING GUARD (habitat removal for the SILENT ID-LESS DROP) ───────────
//
// THE CLASS: a world-pulse mover authors a receipt with a kind, a headline, reasons
// and no `id`. normalizeEntry returns null on `!entry?.id` and the sink push below is
// id-gated, so the beat is dropped from BOTH the canonical feed and the audit receipt
// — silently, on the ONE path an author never re-reads. The subsystem fires, narrates
// nothing, and every downstream reading of it (Herald, Chronicle, soak observation)
// records an honest zero. Two members lived undetected for their whole life:
// momentum.js climbDownNews and the four supplyWebWarfare.js campaign receipts, both
// fixed 2026-07-31. Nothing would have caught a third.
//
// THE GUARD makes the drop LOUD at the seam where entries are AUTHORED rather than
// where they are normalized. That distinction is load-bearing: normalizeEntry also
// runs over PERSISTED save data on every read (ensureWizardNewsFeed), where degrading
// a malformed row is the deliberate fail-closed posture and throwing would take a save
// down. appendObservedWizardNewsEntries has exactly one caller family — pulseKernel's
// thirteen mover-append sites — and every entry reaching it is freshly minted this
// tick, so an id-less entry here is always an authoring bug and never bad save data.
//
// SAFETY (the residueStripGuard.js precedent, verbatim posture):
//   • Pure read; it never mutates an entry or the feed → byte-neutral to the simulation.
//   • It runs ONLY under NODE_ENV==='test' → never in the browser, never in the soak's
//     default run. A mistaken check can only surface as a TEST failure, never a silent
//     determinism corruption.
// So a future author that forgets an id reds the suite the moment ANY test drives its
// mover, instead of shipping a subsystem that narrates into a void.

/** True only in a Node test run (vitest sets NODE_ENV=test). Browser / prod / soak = off.
 *  Reads `process` reflectively and narrows it to a REAL shape rather than taking the
 *  loose cast the sibling guards use: this file's any-cast baseline is 0, and that
 *  ratchet is fix-the-types, never widen-the-baseline. (Do not name the loose cast
 *  literally here either. The detector is a text scan, so quoting it in prose counts
 *  as one.) */
function authoringGuardEnabled() {
  try {
    const proc = /** @type {{ env?: { NODE_ENV?: string } } | undefined} */ (
      Reflect.get(globalThis, 'process')
    );
    return proc?.env?.NODE_ENV === 'test';
  } catch {
    return false;
  }
}

/**
 * The distinct `kind`s among freshly-authored entries that carry no id (deduped,
 * codepoint-sorted). Pure; exported for direct unit testing.
 * @param {RawWizardNewsEntry[]} [entries]
 * @returns {string[]}
 */
export function findIdlessAuthoredEntries(entries = []) {
  return [...new Set((entries || [])
    .filter(entry => entry && !entry.id)
    .map(entry => String(entry.kind || 'unknown')))].sort(compareCodepoint);
}

/**
 * Test-only assertion on the authoring seam: throws if a mover minted a receipt the
 * feed would silently discard. No-op everywhere but a Node test run, always read-only.
 * @param {RawWizardNewsEntry[]} [entries]
 */
export function assertAuthoredEntriesCarryIds(entries = []) {
  if (!authoringGuardEnabled()) return;
  const kinds = findIdlessAuthoredEntries(entries);
  if (kinds.length) {
    throw new Error(
      '[wizard-news] a mover authored ID-LESS receipt(s), which the feed DROPS silently. kind(s): '
      + kinds.join(', ')
      + '\nAn entry without `id` is refused by normalizeEntry AND skipped by the audit receipt sink,'
      + ' so the beat reaches no reader, no Herald and no soak receipt.'
      + '\nMint one in the house shape `wizard_news.${tick}.<slug>.<stableParts>` (see'
      + ' generosityNews.js, upswingKernel.js), using stablePart on actor/target ids and'
      + ' enough parts that two beats of the same kind cannot collide within one tick.',
    );
  }
}

/**
 * Audit-only append seam. Valid raw receipts are copied into `receiptSink`
 * before the canonical feed normalizes, dedupes, sorts, and caps them. With no
 * sink this delegates exactly to appendWizardNewsEntries.
 * @param {WizardNewsFeed | null | undefined} [feed]
 * @param {RawWizardNewsEntry[]} [entries]
 * @param {WizardNewsOptions} [options]
 * @param {RawWizardNewsEntry[] | null} [receiptSink]
 * @returns {ReturnType<typeof appendWizardNewsEntries>}
 */
export function appendObservedWizardNewsEntries(feed = {}, entries = [], options = {}, receiptSink = null) {
  assertAuthoredEntriesCarryIds(entries);
  if (Array.isArray(receiptSink)) {
    for (const entry of entries || []) if (entry?.id) receiptSink.push(entry);
  }
  return appendWizardNewsEntries(feed, entries, options);
}

/**
 * Fold a per-settlement pulse mover's result into the kernel's threaded state (the
 * upswing/lifecycle/growth applier — the "minimal-line" mover-registration idiom that keeps
 * pulseKernel under its frozen line ceiling). A mover returns
 * `{ changed, worldState, settlementUpdates?, newsEntries }`; when UNCHANGED it returns the
 * same references, so this is byte-identical to the inline `if (r.changed) { … }` blocks it
 * replaces. Pure; no side effects.
 * @param {{ changed?: boolean, worldState?: Record<string, unknown>, settlementUpdates?: unknown[], newsEntries?: unknown[] }} result
 * @param {Record<string, unknown>} worldState @param {unknown[]} settlementUpdates
 * @param {ReturnType<typeof appendWizardNewsEntries>} wizardNews @param {string|null} now
 * @param {RawWizardNewsEntry[] | null} [receiptSink]
 * @returns {{ worldState: Record<string, unknown>, settlementUpdates: unknown[], wizardNews: ReturnType<typeof appendWizardNewsEntries> }} */
export function applyPulseMover(result, worldState, settlementUpdates, wizardNews, now, receiptSink = null) {
  if (!result || !result.changed) return { worldState, settlementUpdates, wizardNews };
  const news = Array.isArray(result.newsEntries) && result.newsEntries.length
    // `now` is passed THROUGH, not `now ?? undefined`. That coercion was a workaround from
    // the era when a null `now` was silently a wall clock: turning it into `undefined` at
    // least made the fallthrough honest about being one. Now that null means NO STAMP, the
    // coercion would convert an explicit "no stamp" back into a live clock read. pulseKernel
    // — this function's only caller family — pins a real instant (assertNowPinnedInTest), so
    // no production byte moves; what changes is that a null caller is now obeyed.
    ? appendObservedWizardNewsEntries(wizardNews, /** @type {Parameters<typeof appendWizardNewsEntries>[1]} */ (result.newsEntries), { now }, receiptSink)
    : wizardNews;
  return {
    worldState: result.worldState !== undefined ? result.worldState : worldState,
    settlementUpdates: result.settlementUpdates !== undefined ? result.settlementUpdates : settlementUpdates,
    wizardNews: news,
  };
}

export function summarizeWizardNews(feed = {}) {
  const current = ensureWizardNewsFeed(feed);
  const major = current.entries.filter(entry => entry.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR);
  // Preserve the v1 public return shape: routine is a governed subtype of the
  // existing non-major bucket, not a new unconditional summary key.
  const notables = current.entries.filter(entry => entry.significance !== WIZARD_NEWS_SIGNIFICANCE.MAJOR);
  const byTick = [];
  const groups = new Map();

  for (const entry of current.entries) {
    if (!groups.has(entry.tick)) groups.set(entry.tick, []);
    groups.get(entry.tick).push(entry);
  }

  for (const [tick, entries] of groups.entries()) {
    byTick.push({ tick, entries: sortEntries(entries) });
  }

  byTick.sort((a, b) => b.tick - a.tick);
  return { feed: current, major, notables, byTick, threads: deriveNewsThreads(current.entries) };
}

// ── Arc threading ───────────────────────────────────────────────────────────
// A DM reads news as STORIES, not isolated ticks: an impact that queues, matures
// (ready), takes hold (applied), then resolves is ONE arc; a recurring pressure
// of the same kind on the same place is one escalating arc. Threading collapses
// each arc into a single entry with its progression, so a slow-burning story
// (or a damped-but-repeating world-pulse beat) reads as one thread instead of a
// wall of near-duplicates. Determinism is preserved: arcs order by significance,
// then tick, then score, then a codepoint tiebreak on the stable arc id.

/**
 * Stable arc identity for an entry. A regional impact's lifecycle
 * (queued → ready → applied → resolved) threads on its impact id; anything else
 * threads by (substantive type × primary settlement) so the same kind of
 * pressure recurring on the same place is recognised as one continuing arc.
 * @param {WizardNewsEntry} entry
 * @returns {string}
 */
function arcIdForEntry(entry) {
  if (Array.isArray(entry.impactIds) && entry.impactIds.length) {
    return `impact:${entry.impactIds[0]}`;
  }
  const place = (Array.isArray(entry.settlementIds) && entry.settlementIds[0]) || 'realm';
  const kind = entry.impactKind || entry.kind || 'update';
  return `arc:${kind}:${place}`;
}

/**
 * @param {string} significance
 * @returns {number}
 */
function significanceRank(significance) {
  if (significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR) return 2;
  if (significance === WIZARD_NEWS_SIGNIFICANCE.NOTABLE) return 1;
  return 0;
}

/**
 * A threaded arc.
 * @typedef {Object} WizardNewsThread
 * @property {string} arcId
 * @property {WizardNewsEntry[]} entries   chronological (oldest → newest); each carries entry.thread
 * @property {WizardNewsEntry} head        the latest stage (what the panel renders collapsed)
 * @property {number} size
 * @property {string} significance         highest SP-6a class across the stages
 * @property {number} tick                 head tick (for ordering)
 * @property {number} score                max score across stages
 * @property {string[]} settlementIds      union across stages
 */

/**
 * Group feed entries into arcs. Stamps each entry (on a copy) with
 *   entry.thread = { arcId, stage, priorEntryIds }
 * and returns the arcs newest/most-significant first. Pure; deterministic.
 * @param {WizardNewsEntry[]} entries
 * @returns {WizardNewsThread[]}
 */
export function deriveNewsThreads(entries = []) {
  /** @type {Map<string, WizardNewsEntry[]>} */
  const byArc = new Map();
  for (const entry of entries || []) {
    if (!entry?.id) continue;
    const arcId = arcIdForEntry(entry);
    const bucket = byArc.get(arcId);
    if (bucket) bucket.push(entry);
    else byArc.set(arcId, [entry]);
  }

  /** @type {WizardNewsThread[]} */
  const threads = [];
  for (const [arcId, arcEntries] of byArc.entries()) {
    // Chronological progression: oldest → newest. Codepoint tiebreak keeps the
    // stage order deterministic when two stages land on the same tick.
    const chronological = arcEntries.slice().sort((/** @type {WizardNewsEntry} */ a, /** @type {WizardNewsEntry} */ b) =>
      (a.tick - b.tick) || (a.score - b.score) || compareCodepoint(a.id, b.id));

    /** @type {string[]} */
    const priorEntryIds = [];
    const stamped = chronological.map((/** @type {WizardNewsEntry} */ entry, /** @type {number} */ index) => {
      const thread = { arcId, stage: index + 1, priorEntryIds: [...priorEntryIds] };
      priorEntryIds.push(entry.id);
      return { ...entry, thread };
    });

    const head = stamped[stamped.length - 1];
    threads.push({
      arcId,
      entries: stamped,
      head,
      size: stamped.length,
      significance: stamped.some(e => e.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR)
        ? WIZARD_NEWS_SIGNIFICANCE.MAJOR
        : stamped.some(e => e.significance === WIZARD_NEWS_SIGNIFICANCE.NOTABLE)
          ? WIZARD_NEWS_SIGNIFICANCE.NOTABLE
          : WIZARD_NEWS_SIGNIFICANCE.ROUTINE,
      tick: head.tick,
      score: stamped.reduce((max, e) => Math.max(max, e.score || 0), 0),
      settlementIds: [...new Set(stamped.flatMap(e => e.settlementIds || []))],
    });
  }

  return threads.sort((a, b) =>
    (significanceRank(b.significance) - significanceRank(a.significance))
    || (b.tick - a.tick)
    || (b.score - a.score)
    || compareCodepoint(a.arcId, b.arcId));
}
