/**
 * domain/display/cascadeBraid.js — CW-1, THE CASCADE GOVERNOR: the braid of causes that
 * makes a consequence legible (docs/DESIGN_FP_ARCHITECTURE.md §5 block #58;
 * docs/DESIGN_FP_ARCH_CW.md §CW-1). Dark behind the VIRTUAL `cascadeGovernorEnabled`.
 *
 * WHAT IT DOES, LIT. Herald composition (heraldFeed.js `buildHeraldFeed`, one guarded line)
 * hands this leaf the section-filed feed. A CASCADE is MEMBER_FLOOR or more filed receipts that
 * share one causal ANCESTOR BY IDENTITY: a recorded provenance edge in
 * `worldState.spatialLedgers.provenance`, walked through chronicleGraph's recorded-edge
 * primitives. Never a likeness of kind, desk, town or week: two misfortunes in one season with no
 * recorded common parent are two stories. The members lie inside the CLOSED window
 * [ancestor tick, ancestor tick + WINDOW_WEEKS], and their links cross LAYER_FLOOR or more
 * LAYERS. Each cascade adds ONE story item at the cascade's top significance: its headline names
 * the ancestor (its recorded headline, verbatim), the layers crossed and the count; its body is
 * the chain rendered FORWARD by discourseKernel.realizeCauseWalk, reused (this leaf authors one
 * sentence frame and a layer lexicon, never a second prose kernel). Every member stays in its own
 * desk with its own id, DAMPED to the routine class: the family's floor word and a severity
 * inside the routine band. A MAJOR member is never damped. Damped, never dropped: the lit feed is
 * the dark feed, item for item, plus the story items.
 *
 * THE LAYER AUTHORITY IS THE COUPLING REGISTRY (src/domain/certification/couplingRegistry.js),
 * RE-SPELLED HERE AND HELD EQUAL rather than imported. The Herald composers' import closure is a
 * reviewed list whose every module is scanned for the belief spellings
 * (tests/lint/heraldContaminationFence.test.js), and the registry's leaves NAME the belief
 * ledgers in their receipt addresses, so importing it would put those words inside the Herald's
 * fence. `BRAID_LAYERS_OF_KIND` is therefore the registry's own projection: for every kind a row
 * declares, the layers EVERY declaring row agrees on (a kind two rows mint through different
 * source layers keeps only the layer they share, so the braid never names a layer a receipt did
 * not cross). The acceptance derives the same table from the live registry and holds the two
 * equal both ways: a new coupling kind reds there until it is re-derived here (the
 * chronicleGraph DRAMA_CLASSES idiom). A kind no row declares crosses no layer. Nothing is
 * inferred from a word.
 *
 * THE AUDIENCE. A covert receipt never joins a braid, as ancestor or as member (fail closed: the
 * feed carries no audience, and a braid is a sentence anyone reading the paper may see); it keeps
 * its own covert item. A receipt awaiting the DM's word (amendable, or filed at the adjudication
 * desk) is never a member: it is a decision, and a decision is never damped.
 *
 * THE EDITOR (§12, L10; R-37). Forks: none; composition is order-determined and draws nothing.
 * Seal: none, by design (a derived composition; the DM's lever is EM-E5's `set-tempo`). A decree
 * the table applied is a TRUE ROOT: a braid whose ancestor is one names the table (DECREE_ROOT,
 * decreeHook.DECREE_CAUSE re-spelled) as its root. The live footprint of the table's act in the
 * records the feed files is a DM-queued change, which the composer's normalizer already files as
 * AMENDABLE (heraldFeed.provenanceOf reads its `applyMode`); the braid reads that one chip rather
 * than the record's markers again. Calling chronicleGraph.isDecreeNode from here would bind its
 * parameter to a second shape and blind the observed-shape scanner to its reads (the erasure
 * guard of tests/lint/observedShapeReaders.walker.test.js), and re-reading `applyMode` in a display
 * leaf moves the writer-reach register; both were measured red and are pinned away. A
 * phantom's record-only outcome may be a member and is never an ancestor: its resolution lives on
 * the decree cause (`pulseRecord.decreeCauses`), which no record the feed files carries and this
 * leaf never reads, so no chain can anchor on it. The day a unit files that resolution into the
 * feed, that unit owes this leaf its ancestor filter (the acceptance pins today's shape). It
 * persists nothing: a braid is derived per view from persisted receipts, and no record, ledger or
 * save byte is written.
 *
 * PURE. No store, no React, no clock, no draw, no localeCompare. It imports no engine writer (the
 * engine/display pacing split, SC-4: narrativeTempo throttles births engine-side; this leaf only
 * composes what was recorded). Its one engine-directory import is bandFamilies.js, the
 * significance family's zero-import vocabulary leaf. The acceptance pins the whole closure.
 *
 * @enforced-by tests/domain/cascadeBraidCw1.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { SIGNIFICANCE_CLASSES, significanceRankOf } from '../worldPulse/bandFamilies.js';
import { buildRecordedEdges, recordedAncestors } from './chronicleGraph.js';
import { realizeCauseWalk } from './discourseKernel.js';
import { entryRefs } from './heraldIndex.js';
import { numberWord } from './numberWords.js';

/**
 * THE BRAID'S BANDS. DRAFT (tests/lint/.tuning-register.json), signed by the owner at the lit
 * soak with the charter's other bands, per THE PROMISE.
 */
export const CASCADE_BRAID_TUNING = Object.freeze({
  // The fewest members a cascade braids: two consequences are a pair, not a cascade.
  MEMBER_FLOOR: 3,
  // The closed window in weeks, opened at the ancestor's tick: INTERVAL_WEEKS.one_season.
  WINDOW_WEEKS: 13,
  // The charter's depth threshold: the fewest layers a cascade's links cross.
  LAYER_FLOOR: 3,
  // The most severity a damped member keeps: inside heraldFilter's routine band.
  DAMPED_SEVERITY: 0.35,
});

/** The typed action a braided story item carries (its `kind`, the Herald index's kind facet). */
export const BRAID_KIND = 'cascade';

/** decreeHook.js DECREE_CAUSE, re-spelled: this leaf never imports the head-of-tick writer. */
export const DECREE_ROOT = 'table';

/**
 * THE REGISTRY'S LAYERS, BY KIND: the layers every row declaring the kind agrees on, source
 * before destination as the first declaring row spells its direction. Codepoint-sorted by kind.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const BRAID_LAYERS_OF_KIND = Object.freeze({
  coalition_entry_priced: Object.freeze(['INFO', 'WAR']),
  coalition_expenditure_read: Object.freeze(['WAR']),
  coalition_joined: Object.freeze(['INTERIOR', 'WAR']),
  coalition_refused: Object.freeze(['INTERIOR', 'WAR']),
  coalition_spoils_divided: Object.freeze(['WAR', 'TRADE']),
  envoy_intercepted: Object.freeze(['WAR', 'GRAMMAR']),
  envoy_silence_inference: Object.freeze(['GRAMMAR', 'INFO']),
  interceptor_dilemma: Object.freeze(['WAR', 'GRAMMAR']),
  plant_took: Object.freeze(['INFO', 'GRAMMAR']),
  race_person: Object.freeze(['INFO']),
  race_story: Object.freeze(['INFO']),
  race_together: Object.freeze(['INFO']),
  treaty_disclosure_opened: Object.freeze(['GRAMMAR', 'INFO']),
  word_came_too_late: Object.freeze(['INFO']),
});

/**
 * THE LAYER LEXICON: one reader word per registry layer, total over the registry's layers
 * (pinned). A closed list, never a paraphrase of a receipt.
 * @type {Readonly<Record<string, string>>}
 */
export const LAYER_WORDS = Object.freeze({
  FAITH: 'faith',
  GRAMMAR: 'treaties',
  INFO: 'belief',
  INTERIOR: 'politics',
  POP: 'populations',
  TRADE: 'trade',
  WAR: 'war',
});

/** @type {ReadonlyArray<string>} */
const NO_LAYERS = Object.freeze([]);

/**
 * The structural view of heraldFeed's HeraldItem this leaf reads and writes. Declared here
 * rather than imported so the domain layer names no component module.
 * @typedef {Object} BraidFeedItem
 * @property {string} id
 * @property {string} section
 * @property {string} headline
 * @property {string} summary
 * @property {number} severity
 * @property {boolean} major
 * @property {number|null} tick
 * @property {unknown[]} reasons
 * @property {{ npcId: unknown, factionId: unknown, factionName: unknown, settlementId: unknown }} subject
 * @property {string[]} affectedIds
 * @property {string} kind
 * @property {string|null} rootId
 * @property {string} provenance
 * @property {Record<string, unknown>} record
 * @property {string} [significance]
 * @property {string} [braidId]
 */

/** @typedef {{ item: BraidFeedItem, section: string, index: number }} FiledAt */
/** @typedef {Record<string, BraidFeedItem[]>} SectionMap */

/**
 * THE GATE: the virtual `cascadeGovernorEnabled`, read BY NAME with the strict idiom, the one
 * code read of the key in src. Absent, false or any truthy non-true value is dark.
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function cascadeGovernorActive(worldState) {
  const rules = worldState && typeof worldState === 'object'
    ? /** @type {Record<string, unknown>} */ (worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).cascadeGovernorEnabled === true);
}

/** @param {unknown} v @returns {Record<string, unknown>} */
function objectOf(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {number} */
function num(v) { return typeof v === 'number' && Number.isFinite(v) ? v : 0; }

/** @param {unknown} v @returns {boolean} */
function isTick(v) { return typeof v === 'number' && Number.isFinite(v); }

/** @param {BraidFeedItem} a @param {BraidFeedItem} b */
function byReading(a, b) {
  const ta = num(a.tick);
  const tb = num(b.tick);
  return ta !== tb ? ta - tb : compareCodepoint(String(a.id), String(b.id));
}

/**
 * The layers the registry says a receipt's kind crosses (own keys only, never the prototype).
 * @param {BraidFeedItem} item
 * @returns {ReadonlyArray<string>}
 */
function layersOfKind(item) {
  const kind = String(item.kind || '');
  return Object.prototype.hasOwnProperty.call(BRAID_LAYERS_OF_KIND, kind) ? BRAID_LAYERS_OF_KIND[kind] : NO_LAYERS;
}

/**
 * Every layer a cascade's receipts cross, in reading order, each once.
 * @param {BraidFeedItem[]} items
 * @returns {string[]}
 */
export function layersCrossed(items) {
  /** @type {string[]} */
  const out = [];
  for (const item of items) for (const layer of layersOfKind(item)) if (!out.includes(layer)) out.push(layer);
  return out;
}

/** The record and its nested outcome, the two places the normalizer reads a receipt's words.
 *  @param {BraidFeedItem} item @returns {Array<Record<string, unknown>>} */
function sourcesOf(item) {
  const record = objectOf(item.record);
  return [record, objectOf(record.outcome)];
}

/** A covert receipt: the chip the normalizer lifts from every covert marker a record carries.
 *  @param {BraidFeedItem} item */
function isCovert(item) {
  return item.provenance === 'covert';
}

/** An act of the table's hand: the chip the normalizer lifts from a DM-queued change
 *  (heraldFeed.provenanceOf files an outcome whose applyMode is `proposal` as amendable).
 *  @param {BraidFeedItem} item */
function isDecreeRoot(item) {
  return item.provenance === 'amendable';
}

/** The recorded words a receipt carries, or '' when it carries none.
 *  @param {BraidFeedItem} item */
function recordedHeadlineOf(item) {
  for (const source of sourcesOf(item)) {
    const text = source.headline ?? source.label;
    if (typeof text === 'string' && text.trim()) return text.trim();
  }
  return '';
}

/**
 * The significance class an item speaks at: the feed's own major law first, then the record's own
 * class word, else the family's floor. Never inflated, never a word comparison.
 * @param {BraidFeedItem} item
 * @returns {string}
 */
function classOf(item) {
  if (item.major) return SIGNIFICANCE_CLASSES[SIGNIFICANCE_CLASSES.length - 1];
  const word = objectOf(item.record).significance;
  return typeof word === 'string' && SIGNIFICANCE_CLASSES.includes(word) ? word : SIGNIFICANCE_CLASSES[0];
}

/** @param {string} cls */
function isTopClass(cls) {
  return significanceRankOf(cls) === SIGNIFICANCE_CLASSES.length - 1;
}

/** A receipt that may be braided as a member.
 *  @param {BraidFeedItem} item */
function memberEligible(item) {
  return item.provenance === 'canon' && item.section !== 'adjudication' && isTick(item.tick) && !isCovert(item);
}

/** A receipt that may anchor a braid: canon or the table's own act, dated, and named in its own
 *  recorded words.
 *  @param {BraidFeedItem|null} item */
function ancestorEligible(item) {
  return !!item && !isCovert(item) && isTick(item.tick) && recordedHeadlineOf(item) !== '';
}

/** 'a', 'a and b', 'a, b and c'. @param {string[]} words */
function listOf(words) {
  return words.length <= 1 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}

/**
 * THE BRAID'S SENTENCE (SR-17): the count, the layers crossed and the ancestor in its own recorded
 * words. A braid rooted in the table's decree names the table (R-37).
 * @param {{ count: number, layers: ReadonlyArray<string>, ancestorHeadline: string, decree: boolean }} args
 * @returns {string}
 */
export function braidSentence({ count, layers, ancestorHeadline, decree }) {
  const cause = decree ? 'one decree set down by the table\'s hand' : 'one cause';
  const across = listOf(layers.map((layer) => LAYER_WORDS[layer]).filter((word) => typeof word === 'string'));
  return `In the wake of ${cause}, ${numberWord(count)} consequences now run across ${across}: ${ancestorHeadline}`;
}

/**
 * The durable records the feed files from, by id, normalized by the composer's own `toItem`: the
 * door an ancestor filed outside the current lens is resolved through. First record wins, as in
 * the feed's own dedupe.
 * @param {Record<string, unknown>} campaign
 * @param {ToItem} toItem
 * @returns {Map<string, BraidFeedItem>}
 */
function recordIndexOf(campaign, toItem) {
  /** @type {Map<string, BraidFeedItem>} */
  const out = new Map();
  /** @param {unknown} raw */
  const add = (raw) => {
    const record = objectOf(raw);
    if (record.id == null || out.has(String(record.id))) return;
    out.set(String(record.id), toItem(record));
  };
  const worldState = objectOf(campaign.worldState);
  for (const pulse of Array.isArray(worldState.pulseHistory) ? worldState.pulseHistory : []) {
    const record = objectOf(pulse);
    for (const outcome of Array.isArray(record.selectedOutcomes) ? record.selectedOutcomes : []) add(outcome);
    for (const entry of Array.isArray(record.impactDigest) ? record.impactDigest : []) add(entry);
  }
  const news = objectOf(campaign.wizardNews);
  for (const entry of Array.isArray(news.entries) ? news.entries : []) add(entry);
  return out;
}

/**
 * The cascade rendered FORWARD as the walk discourseKernel realizes: the ancestor opens it, each
 * member's depth is its recorded generation's distance from the pivot (the latest member, the
 * effect the passage closes on), so the kernel's own ordering and connective bands read the
 * chain from cause to consequence.
 * @param {string} ancestorId
 * @param {BraidFeedItem} ancestor
 * @param {BraidFeedItem[]} members  in reading order
 * @param {import('./chronicleGraph.js').RecordedEdges} edges
 * @returns {import('./causeWalk.js').CauseWalk}
 */
function forwardWalk(ancestorId, ancestor, members, edges) {
  /** @type {Map<string, number>} */
  const generation = new Map([[ancestorId, 0]]);
  const queue = [ancestorId];
  while (queue.length) {
    const current = /** @type {string} */ (queue.shift());
    const children = [...(edges.childrenOf.get(current) || [])].sort(compareCodepoint);
    for (const child of children) {
      if (generation.has(child)) continue;
      generation.set(child, num(generation.get(current)) + 1);
      queue.push(child);
    }
  }
  const deepest = Math.max(...members.map((member) => num(generation.get(String(member.id))) || 1));
  const pivot = members[members.length - 1];
  // Every link is a recorded consequence of the ancestor, so the causal register is the honest one:
  // the cause reads as the kernel's `outcome` and every member as its `impact`, both causal. A
  // drama-class adversative bridge would claim a turn against the grain no edge records.
  /** @param {BraidFeedItem} item @param {number} depth @param {string} type */
  const node = (item, depth, type) => ({
    id: String(item.id),
    depth,
    headline: String(item.headline),
    tick: isTick(item.tick) ? item.tick : null,
    type,
    redacted: false,
    settlementIds: [...item.affectedIds].map(String),
  });
  const root = node(pivot, 0, 'impact');
  return /** @type {import('./causeWalk.js').CauseWalk} */ (/** @type {unknown} */ ({
    rootId: root.id,
    root: { headline: root.headline, tick: root.tick, type: root.type, settlementIds: root.settlementIds },
    chain: [
      node(ancestor, deepest + 1, 'outcome'),
      ...members.slice(0, -1).map((member) => node(member, deepest + 1 - (num(generation.get(String(member.id))) || 1), 'impact')),
    ],
  }));
}

/**
 * Every typed ref its receipts carry, gathered once each, codepoint order: the slots the Herald
 * index's facets read, so a search for anything a member names finds the braid too.
 * @param {BraidFeedItem[]} items
 * @returns {Record<string, string[]>}
 */
function refUnionOf(items) {
  /** @type {Record<string, Set<string>>} */
  const sets = {};
  for (const item of items) {
    for (const [facet, refs] of Object.entries(entryRefs(item))) {
      if (!sets[facet]) sets[facet] = new Set();
      for (const ref of refs) sets[facet].add(String(ref));
    }
  }
  /** @type {Record<string, string[]>} */
  const out = {};
  for (const facet of Object.keys(sets).sort(compareCodepoint)) out[facet] = [...sets[facet]].sort(compareCodepoint);
  return out;
}

/** The composer's normalizer: a record, and the desk it is filed at when the caller names one.
 *  @typedef {(record: Record<string, unknown>, forced?: string) => BraidFeedItem} ToItem */

/**
 * One braided story item: the cascade at its top significance, its members named in reading
 * order, its body the forward chain, its typed slots the union of its receipts' refs.
 *
 * THE BRAID'S RECORD IS OUTCOME-SHAPED and the composer's own normalizer files it, forced to the
 * ancestor's desk: its typed action rides `type` (the field the normalizer reads first for an
 * outcome's routing token), so the item passes through the SAME subject, address, severity and
 * provenance laws as every other item on the page rather than a second hand-built copy of them.
 * The braid is never routed by its kind (its desk is its ancestor's, named by the caller), and it
 * carries the addressable shape every Herald record owes: id, settlementIds, severity.
 * @param {{ ancestorId: string, ancestor: BraidFeedItem, members: BraidFeedItem[],
 *   edges: import('./chronicleGraph.js').RecordedEdges, provenance: Record<string, { parents?: ReadonlyArray<string> }>,
 *   toItem: ToItem }} args
 * @returns {BraidFeedItem}
 */
function braidItemOf({ ancestorId, ancestor, members, edges, provenance, toItem }) {
  const memberIds = members.map((member) => String(member.id));
  const id = `${BRAID_KIND}:${[...memberIds].sort(compareCodepoint).join('+')}`;
  let top = SIGNIFICANCE_CLASSES[0];
  for (const member of members) {
    const cls = classOf(member);
    if (significanceRankOf(cls) > significanceRankOf(top)) top = cls;
  }
  const decree = isDecreeRoot(ancestor);
  const layers = layersCrossed([ancestor, ...members]);
  const refs = refUnionOf([ancestor, ...members]);
  const walk = forwardWalk(ancestorId, ancestor, members, edges);
  const passage = realizeCauseWalk(walk, { seedId: id, provenance });
  const pivot = members[members.length - 1];
  const section = ancestor.section !== 'adjudication' ? ancestor.section : members[0].section;
  const subject = objectOf(ancestor.subject);
  const people = [ancestor, ...members].map((item) => objectOf(item.subject).npcId).filter((npc) => npc != null && npc !== '');
  const factions = [ancestor, ...members].map((item) => objectOf(item.subject).factionId).filter((faction) => faction != null && faction !== '');
  const record = {
    id,
    type: BRAID_KIND,
    headline: braidSentence({ count: members.length, layers, ancestorHeadline: recordedHeadlineOf(ancestor), decree }),
    summary: passage.text,
    severity: Math.max(...members.map((member) => num(member.severity))),
    significance: top,
    tick: Math.max(...members.map((member) => num(member.tick))),
    reasons: [String(ancestor.headline), ...members.map((member) => String(member.headline))],
    targetSaveId: subject.settlementId ?? null,
    npcId: subject.npcId ?? null,
    factionId: subject.factionId ?? null,
    factionName: subject.factionName ?? null,
    settlementIds: refs.settlement || [],
    root: decree ? DECREE_ROOT : ancestorId,
    ancestorId,
    memberIds,
    layers,
    npcIds: [...new Set(people.map(String))].sort(compareCodepoint),
    factionIds: [...new Set(factions.map(String))].sort(compareCodepoint),
    institutionIds: refs.institution || [],
    goodIds: refs.good || [],
    serviceIds: refs.service || [],
    routeIds: refs.route || [],
    arcId: refs.arc || [],
  };
  // The article opens on the pivot, the last consequence, whose cause walk runs back to the ancestor.
  return { ...toItem(record, section), rootId: String(pivot.id) };
}

/**
 * THE BRAID, over the composer's own section map. Finds every cascade, files one story item at the
 * FRONT of its ancestor's desk, and damps each member IN PLACE in its own desk (same index, same
 * id). Writes only into `bySection`, the feed's own fresh local map; never into a record, a
 * ledger or the campaign.
 * @param {SectionMap} bySection  the composer's section map (written in place)
 * @param {Record<string, unknown>} campaign
 * @param {ToItem} toItem  the composer's normalizer
 * @returns {number} the braids filed
 */
export function braidCascadesInto(bySection, campaign, toItem) {
  const worldState = objectOf(objectOf(campaign).worldState);
  const provenance = /** @type {Record<string, { parents?: ReadonlyArray<string> }>} */ (objectOf(objectOf(worldState.spatialLedgers).provenance));
  const edges = buildRecordedEdges(provenance);
  if (edges.size === 0) return 0;
  const { MEMBER_FLOOR, WINDOW_WEEKS, LAYER_FLOOR, DAMPED_SEVERITY } = CASCADE_BRAID_TUNING;

  /** @type {Map<string, FiledAt>} */
  const filed = new Map();
  for (const section of Object.keys(bySection)) {
    (bySection[section] || []).forEach((item, index) => {
      if (item && item.id != null) filed.set(String(item.id), { item, section, index });
    });
  }
  /** @type {Map<string, BraidFeedItem>|null} */
  let recorded = null;
  /** @param {string} id @returns {BraidFeedItem|null} */
  const resolve = (id) => {
    const hit = filed.get(id);
    if (hit) return hit.item;
    if (!recorded) recorded = recordIndexOf(objectOf(campaign), toItem);
    return recorded.get(id) || null;
  };

  // Every recorded ancestor of every eligible filed receipt: the only way two receipts share one.
  /** @type {Map<string, string[]>} */
  const descendantsOf = new Map();
  for (const [id, { item }] of filed) {
    if (!memberEligible(item)) continue;
    for (const ancestorId of recordedAncestors(id, edges)) {
      const list = descendantsOf.get(ancestorId) || [];
      list.push(id);
      descendantsOf.set(ancestorId, list);
    }
  }
  /** @type {Array<{ ancestorId: string, ancestor: BraidFeedItem }>} */
  const anchors = [];
  for (const ancestorId of descendantsOf.keys()) {
    const ancestor = resolve(ancestorId);
    if (ancestor && ancestorEligible(ancestor)) anchors.push({ ancestorId, ancestor });
  }
  // The deepest cause claims first: earliest tick, then codepoint id. Order-determined, no draw.
  anchors.sort((a, b) => (num(a.ancestor.tick) - num(b.ancestor.tick)) || compareCodepoint(a.ancestorId, b.ancestorId));

  /** @type {Set<string>} */
  const claimed = new Set();
  /** @type {BraidFeedItem[]} */
  const braids = [];
  for (const { ancestorId, ancestor } of anchors) {
    const opens = num(ancestor.tick);
    const members = (descendantsOf.get(ancestorId) || [])
      .filter((id) => !claimed.has(id))
      .map((id) => /** @type {FiledAt} */ (filed.get(id)).item)
      .filter((item) => num(item.tick) >= opens && num(item.tick) <= opens + WINDOW_WEEKS)
      .sort(byReading);
    if (members.length < MEMBER_FLOOR) continue;
    if (layersCrossed([ancestor, ...members]).length < LAYER_FLOOR) continue;
    claimed.add(ancestorId);
    const braid = braidItemOf({ ancestorId, ancestor, members, edges, provenance, toItem });
    // DAMPED, NEVER DROPPED: each member is replaced where it stands, same desk, same index,
    // same id. The story items are filed only after every damping, so no index moves under it.
    for (const member of members) {
      const at = /** @type {FiledAt} */ (filed.get(String(member.id)));
      claimed.add(String(member.id));
      bySection[at.section][at.index] = isTopClass(classOf(member))
        ? { ...member, braidId: braid.id }
        : { ...member, severity: Math.min(num(member.severity), DAMPED_SEVERITY), major: false, significance: SIGNIFICANCE_CLASSES[0], braidId: braid.id };
    }
    braids.push(braid);
  }
  // Each desk's story items lead it, in the order their ancestors claimed.
  for (const section of [...new Set(braids.map((braid) => braid.section))]) {
    bySection[section] = [...braids.filter((braid) => braid.section === section), ...(bySection[section] || [])];
  }
  return braids.length;
}
