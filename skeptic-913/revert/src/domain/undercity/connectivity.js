/**
 * undercity/connectivity.js — THE CONNECTIVITY GRAPH of the underground layer (ODQ §311.9), the
 * SIXTH and LAST car of the undercity train (MF-UC5; charter draft-UNDERCITY-PLAN.md §4 UC-5,
 * ruled ODQ §441, dispatched ODQ §484).
 *
 * The owner's boundary law, §311.9: three connection classes plus a REFUSAL class; seven laws —
 * motive · route value from surface causes · the security gradient OPEN/GUARDED/SEALED with the
 * stricter side's TYPED JOINT · sewers are the spine where they exist, else an ARCHIPELAGO ·
 * connectivity is STATE (sever without delete) · links persist · and the honesty contract, which
 * says an isolated piece is a first-class visible fact and not an omission.
 *
 * ⭐ THIS CAR DERIVES NO COMPONENT AND NO PORTAL. Every node is a row UC-1, UC-2, UC-3 or UC-4
 * already published, and every edge's typed joint is a `surfaceJoins[]` entry one of those four
 * producers already wrote. ONE PRODUCER PER JOIN: where no endpoint publishes a portal, no edge is
 * emitted — this leaf never invents a way in. The four leaves are consumed through their own
 * `opts` seams so a caller that already holds a result never pays for a second derivation, and no
 * fact in this file is re-derived (one truth per fact).
 *
 * ⭐ THE MOTIVE LAW IS ENFORCED BY THE PAYER, NOT BY A COMMENT. §311.6.4: "any new linking passage
 * is a dug act with a cause and a payer … never an assumed corridor." So the two DUG classes —
 * ADJACENCY_BREACH and FUNDED_LINK — are refused outright when no payer resolves to a CANONICAL
 * INSTITUTION KEY. Sparsity is therefore structural: a motiveless or payerless join is not dug,
 * and the graph stays as thin as the surface causes make it. Only NATIVE edges are free, and they
 * are free because they are not dug at all: one building has one underside, and a quarter the
 * works already drain is reached by the main that drains it.
 *
 * ⛔ THE REFUSAL CLASS IS VISIBLE, NOT SILENT. A vault connects to nothing by default (§311.8.3 —
 * a breach into one is a HEIST EVENT, which is an event and not a derived edge) and keepers resist
 * a sewer↔crypt join. Both refusals are RECORDED in `refusals[]` naming the pair they refused, so
 * the absence of an edge can be read as a decision rather than as a gap in the derivation.
 *
 * ⚠ THE DATE OF A DUG ACT IS REPORTED, NEVER INVENTED. The estate records no dug-act event: player-
 * commissioned digs are deferred whole (charter D-5, the §423 two-layer shape) and MF-R2's C5 ruled
 * new-sewer events DERIVED PROVENANCE rather than a store verb. The one dated act the immutable
 * record does carry is the calamity the town rebuilt after — UC-1's own CALAMITY_REBUILD cause, the
 * moment mains get laid under a quarter being rebuilt. Where the record carries none the date is
 * `null` and `dateSource` says `NO_DATED_RECORD`: the §434 understatement idiom, never a guess.
 * §443 is satisfied the way the whole train satisfies it — `calamityHistory` is a PULSE-WRITTEN key
 * and is reached ONLY through the banked projection `buildCalamityLedger`; this file never names it.
 *
 * ⛔ THE ONE-WAY SEAL (§311.9.3). The underground never causes the surface. This car reads surface
 * facts and publishes a graph; routes feed crime and espionage outcomes ONLY through the §287.4
 * receipt seam, never same-pass, and nothing here writes one byte anywhere.
 *
 * LAWS THIS LEAF KEEPS:
 *  - A PURE DERIVER at the domain root (the UC-0 / UC-1 / UC-2 / UC-3 / UC-4 precedent): generation
 *    never imports it, nothing is written, the generator golden is byte-identical — proven at S0.
 *  - DISPLAY-LAZY BY INHERITANCE (§443): importing `highWater.js` and `display/calamityLedger.js`
 *    transfers their law — this leaf is reached only from dormant or lazy consumers (CT-4 prose
 *    §7 F6, the D5 strata fabric, the DW program's law 7), never the first-paint entry closure.
 *  - FIRST-PAINT CLOSURE (§441.5(d)): `src/domain/undercity/**` never imports
 *    `src/domain/townMap/**`.
 *  - THE ANCHOR-KEY LAW (§441.5(k)) and the §437 carry note: every node and every edge end names
 *    the CANONICAL INSTITUTION KEY its producer wrote, so the DW program's per-building projection
 *    is a lookup on that key and needs no re-shape.
 *  - FINITE SEMANTICS: every vocabulary is closed and frozen. This car declares NO tuning surface
 *    and adds NO tuning-pass input: the tables below name which pairs and which buckets are
 *    REACHABLE, never a weight (the UC-3 `EXTENTS_BY_GROUND` precedent).
 *  - PURITY: no clock, no ambient randomness, no locale read, no I/O, and — unlike its four
 *    siblings — NO DRAW AT ALL: the graph is fully determined by the rows it reads, so this leaf
 *    defines no hash root and takes no seed. Iteration is ordered by `compareCodepoint`.
 */
import { compareCodepoint } from '../deterministicSort.js';
import { buildCalamityLedger } from '../display/calamityLedger.js';
import { deriveHighWater } from '../highWater.js';
import { isJointKind } from './jointVocabulary.js';
import { deriveUndercity, UNDERCITY_EXTENTS } from './colonization.js';
import { deriveMonotoneComponents, MONOTONE_EXTENTS } from './monotoneComponents.js';
import { deriveSewerLadder, WELL_EXTENTS } from './sewerDerivation.js';
import { CAVERN_EXTENTS, deriveStaticComponents } from './staticComponents.js';
import { deriveStrataExistence, sanitationRungSeeds } from './strataExistence.js';

/** @typedef {import('./jointVocabulary.js').JointKind} JointKind */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/**
 * The leaf's ONE input type: the estate's settlement plus the pulse-written calamity key spelled
 * the way `highWater.js`'s own input spells it — DECLARED because `buildCalamityLedger` takes a
 * WEAK type and TS refuses a weak-type argument declaring none of its properties (UC-1, UC-2 and
 * UC-4 each declare it for the same reason). Declaring it is not a second truth: the VALUE is read
 * only through the banked ledger projection, never off this key (§443).
 * @typedef {SimSettlement & { calamityHistory?: import('../display/calamityLedger.js').CalStampLike[] }} ConnectivityInput
 */
/** @typedef {'NATIVE'|'ADJACENCY_BREACH'|'FUNDED_LINK'} ConnectionClass */
/** @typedef {'SAME_ANCHOR'|'DRAINED_QUARTER'|'SHARED_QUARTER_WITH_MOTIVE'|'WORKS_EXTENSION'|'CONTRABAND_ROUTE'} EdgeCause */
/** @typedef {'OPEN'|'GUARDED'|'SEALED'} ConnectionPosture */
/** @typedef {'INSTITUTION'|'TERRAIN'|'QUARTER'|'FABRIC'} AnchorKind */
/** @typedef {'REFUSED'|'SEVERED'|'NO_PUBLISHED_JOINT'|'UNREACHED'} IsolationReason */
/** @typedef {'VAULT_REFUSAL'|'KEEPER_REFUSAL'} RefusalReason */
/** @typedef {'DATED_CALAMITY_REBUILD'|'NO_DATED_RECORD'|'NOT_A_DUG_ACT'} DateSource */
/** @typedef {{ kind: JointKind, anchor: string }} SurfaceJoin */

/**
 * @typedef {Object} GraphNode
 * @property {string} key         unique within one graph; producer, kind and anchor
 * @property {string} producer    which car published the row (`UC1`…`UC4`)
 * @property {string} kind        the producer's own component kind
 * @property {string|null} anchor the canonical institution key, the terrain family, the quarter —
 *   or null for anonymous fabric (§441.5(k))
 * @property {AnchorKind} anchorKind what the anchor names, so only building-anchored rows join by it
 * @property {string|null} zone   the district it sits in, from UC-1's pinned 12-enum
 * @property {ConnectionPosture} posture the security gradient this row stands at (§311.9.2(iii))
 * @property {boolean} criminal   its LICENCE names the criminal economy — the actor with a motive
 * @property {SurfaceJoin[]} joints the producer's own `surfaceJoins[]` — the portal truth, consumed
 * @property {number} routeRank   its extent's index on ITS OWN producer's closed ladder
 * @property {string|null} severedBy `FLOODED` / `SEALED` where the producer says the working receded
 */

/**
 * @typedef {Object} GraphEdge
 * @property {ConnectionClass} class
 * @property {EdgeCause} cause
 * @property {string} motive      §311.9's law 2 — the route value, in the doctrine's own terms
 * @property {string} from        node key, codepoint-first of the pair
 * @property {string} to          node key
 * @property {string|null} fromAnchor canonical institution key of the `from` end, where it has one
 * @property {string|null} toAnchor
 * @property {JointKind} joint    the stricter side's typed joint (§311.9.2(iii))
 * @property {ConnectionPosture} posture the stricter side's posture
 * @property {boolean} live       false when a producer severed an end — the row PERSISTS (law 6)
 * @property {string|null} severedBy
 * @property {string|null} payer  the canonical key that paid for a DUG act; null on a NATIVE edge
 * @property {number|null} date
 * @property {DateSource} dateSource
 * @property {'DERIVED_V1'} sourceKind
 */

/** The three connection classes (§311.9.2(i)). @type {ReadonlyArray<ConnectionClass>} */
export const CONNECTION_CLASSES = Object.freeze(/** @type {ConnectionClass[]} */ (['NATIVE', 'ADJACENCY_BREACH', 'FUNDED_LINK']));
/** The five typed causes, one per lawful pairing rule. @type {ReadonlyArray<EdgeCause>} */
export const EDGE_CAUSES = Object.freeze(/** @type {EdgeCause[]} */ ([
  'SAME_ANCHOR', 'DRAINED_QUARTER', 'SHARED_QUARTER_WITH_MOTIVE', 'WORKS_EXTENSION', 'CONTRABAND_ROUTE',
]));
/** The security gradient, least to most strict (§311.9.2(iii)). @type {ReadonlyArray<ConnectionPosture>} */
export const CONNECTION_POSTURES = Object.freeze(/** @type {ConnectionPosture[]} */ (['OPEN', 'GUARDED', 'SEALED']));
/** The four honest reasons a node ends with no edge (§311.9.2(vii)). @type {ReadonlyArray<IsolationReason>} */
export const ISOLATION_REASONS = Object.freeze(/** @type {IsolationReason[]} */ (['REFUSED', 'SEVERED', 'NO_PUBLISHED_JOINT', 'UNREACHED']));
/** The refusal class, recorded rather than silent. @type {ReadonlyArray<RefusalReason>} */
export const REFUSAL_REASONS = Object.freeze(/** @type {RefusalReason[]} */ (['VAULT_REFUSAL', 'KEEPER_REFUSAL']));
/** The two characters an undercity can have (§311.9's law 4). @type {ReadonlyArray<string>} */
export const GRAPH_CHARACTERS = Object.freeze(['spine', 'archipelago']);
/** Frozen provenance stamp; changing any rule below is a declared shift. */
export const CONNECTIVITY_SOURCE_KIND = 'DERIVED_V1';

/** The component kind that connects to nothing by default (§311.8.3, §311.9.2(ii)). */
export const REFUSED_KIND = 'vault';
/** The component kind whose keepers resist a join to the sanitation spine (§311.9.2(ii)). */
export const KEEPER_REFUSED_KIND = 'crypt';
/** The node key of the sanitation spine — one per settlement, anchored to no building. */
export const SPINE_KEY = 'UC1:sewer_network:fabric';

/**
 * The licences whose own words name the criminal economy. A row licensed by one of them is the
 * ACTOR WITH A MOTIVE §311.9's law 1 requires, and stands at GUARDED on the security gradient.
 * Read from the producers' published `license` strings, never re-derived from the criminal share.
 * @type {ReadonlyArray<string>}
 */
export const GUARDED_LICENSES = Object.freeze([
  'CRIMINAL_DEMAND_ON_A_SEEDED_SPACE', 'CRIMINAL_SHARE_AT_GATE_OR_WATERFRONT', 'WALL_OR_TOLL_AND_CRIMINAL_SHARE',
]);

/**
 * The typed motive each cause carries (§311.9's law 2 — route value comes from surface causes).
 * A GRAMMAR: one motive per lawful pairing, so no edge exists without naming why it was worth it.
 * @type {Readonly<Record<EdgeCause, string>>}
 */
export const MOTIVE_BY_CAUSE = Object.freeze(/** @type {Record<EdgeCause, string>} */ ({
  SAME_ANCHOR: 'ONE_BUILDING_HAS_ONE_UNDERSIDE',
  DRAINED_QUARTER: 'THE_MAIN_ALREADY_RUNS_UNDER_THIS_QUARTER',
  SHARED_QUARTER_WITH_MOTIVE: 'CRIMINAL_TRAFFIC_INSIDE_ONE_QUARTER',
  WORKS_EXTENSION: 'THE_OWNER_PAID_TO_REACH_AN_UNDRAINED_QUARTER',
  CONTRABAND_ROUTE: 'THE_BYPASS_SERVES_THE_CONTRABAND_IT_WAS_DUG_FOR',
}));

/**
 * Each producer's own closed extent ladder, smallest first. A row's ROUTE VALUE is its index here:
 * a grammar over four-bucket ladders that names which buckets are REACHABLE by a funded link, never
 * a weight (the UC-3 `EXTENTS_BY_GROUND` precedent). The ladders are IMPORTED from the cars that own
 * them, so a car that re-cuts its buckets moves this reading with it.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const EXTENT_LADDERS = Object.freeze({
  UC1: WELL_EXTENTS, UC2: MONOTONE_EXTENTS, UC3: CAVERN_EXTENTS, UC4: UNDERCITY_EXTENTS,
});

/**
 * The rank at which a component's own extent carries enough ROUTE VALUE to be worth a funded cut —
 * the UPPER HALF of every producer's four-bucket ladder. A niche is not worth reaching; a gallery
 * is. A grammar, not a threshold on a measured quantity: it names reachable buckets on closed
 * vocabularies this car does not own.
 */
export const FUNDED_ROUTE_VALUE_RANK = 2;

/** Strictness of the security gradient, for "the stricter side's TYPED JOINT".
 *  @type {Readonly<Record<string, number>>} */
const POSTURE_RANK = Object.freeze({ OPEN: 0, GUARDED: 1, SEALED: 2 });

/** A record view of any value — the CALL-receiver idiom the train uses everywhere.
 *  @param {unknown} v @returns {Record<string, unknown>} */
function recordOf(v) {
  return v && typeof v === 'object' ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** A string, or null. @param {unknown} v @returns {string|null} */
function str(v) {
  return typeof v === 'string' && v !== '' ? v : null;
}

/** The producer's published portals, kept only where the kind is in UC-0's closed vocabulary.
 *  @param {unknown} v @returns {SurfaceJoin[]} */
function jointsOf(v) {
  /** @type {SurfaceJoin[]} */
  const out = [];
  for (const raw of Array.isArray(v) ? v : []) {
    const row = recordOf(raw);
    const anchor = str(row.anchor);
    if (isJointKind(row.kind) && anchor) out.push({ kind: row.kind, anchor });
  }
  return out;
}

/**
 * ⛔ THE GRADIENT AND THE LICENCE ARE TWO DIFFERENT READINGS, AND KEEPING THEM APART IS WHAT MAKES
 * "SEVER, NEVER DELETE" TRUE. The POSTURE is the security gradient a link across this row has to
 * cross — SEALED is the producer's own word (UC-2 writes it on a vault, UC-4 on a flooded or sealed
 * working), GUARDED is a licence that names the criminal economy, everything else is OPEN. The
 * CRIMINAL flag is the licence alone and is NOT moved by recession. If severance also moved the
 * licence, sealing a working would UN-LICENSE its breach and the edge would VANISH rather than go
 * dark — deleting exactly what §311.9's laws 5 and 6 say must persist. So pairing reads `criminal`
 * and only the resulting link's strictness reads `posture`.
 * @param {Record<string, unknown>} row @param {string|null} severedBy @returns {ConnectionPosture}
 */
function postureOf(row, severedBy) {
  if (severedBy != null || row.posture === 'SEALED') return 'SEALED';
  return GUARDED_LICENSES.includes(String(row.license)) ? 'GUARDED' : 'OPEN';
}

/** The producer's own recession state, read not re-derived (§311.8.3, sever never delete).
 *  @param {Record<string, unknown>} row @returns {string|null} */
function severOf(row) {
  if (row.state === 'flooded') return 'FLOODED';
  return row.state === 'sealed' ? 'SEALED' : null;
}

/**
 * Add one published row to the node set, keyed uniquely and deterministically.
 * @param {GraphNode[]} nodes @param {Set<string>} seen
 * @param {{ producer: string, kind: string, anchor: string|null, anchorKind: AnchorKind,
 *   zone: string|null, row: Record<string, unknown> }} spec
 * @returns {void}
 */
function addNode(nodes, seen, spec) {
  const stem = `${spec.producer}:${spec.kind}:${spec.anchor ?? spec.zone ?? 'fabric'}`;
  let key = stem;
  for (let n = 2; seen.has(key); n += 1) key = `${stem}#${n}`;
  seen.add(key);
  const severedBy = severOf(spec.row);
  const ladder = EXTENT_LADDERS[spec.producer] ?? [];
  nodes.push({
    key,
    producer: spec.producer,
    kind: spec.kind,
    anchor: spec.anchor,
    anchorKind: spec.anchorKind,
    zone: spec.zone,
    posture: postureOf(spec.row, severedBy),
    criminal: GUARDED_LICENSES.includes(String(spec.row.license)),
    joints: jointsOf(spec.row.surfaceJoins),
    routeRank: ladder.indexOf(String(spec.row.extent)),
    severedBy,
  });
}

/**
 * THE NODE SET — every component row the four landed leaves publish, and nothing else. The sanitation
 * spine is ONE node whose portals are the grates UC-1 already keyed to the quarters it drains.
 * @param {{ sewer: Record<string, unknown>, monotone: unknown[], statics: unknown[], undercity: Record<string, unknown> }} parts
 * @returns {GraphNode[]}
 */
function buildNodes(parts) {
  /** @type {GraphNode[]} */
  const nodes = [];
  /** @type {Set<string>} */
  const seen = new Set();
  const rung = parts.sewer.rung;
  if (sanitationRungSeeds(rung)) {
    nodes.push({
      key: SPINE_KEY, producer: 'UC1', kind: 'sewer_network', anchor: null, anchorKind: 'FABRIC',
      zone: null, posture: 'OPEN', criminal: false, joints: jointsOf(parts.sewer.surfaceJoins),
      routeRank: -1, severedBy: null,
    });
  }
  for (const raw of Array.isArray(parts.sewer.wells) ? parts.sewer.wells : []) {
    const row = recordOf(raw);
    const zone = str(row.anchor);
    addNode(nodes, seen, { producer: 'UC1', kind: String(row.kind), anchor: zone, anchorKind: 'QUARTER', zone, row });
  }
  /** @type {Map<string, string>} the quarter each building's underside sits in, from UC-2's rows */
  const zoneByAnchor = new Map();
  for (const raw of parts.monotone) {
    const row = recordOf(raw);
    const anchor = str(row.anchor);
    const zone = str(row.zone);
    const kind = String(row.kind);
    if (anchor && zone && !zoneByAnchor.has(anchor)) zoneByAnchor.set(anchor, zone);
    addNode(nodes, seen, { producer: 'UC2', kind, anchor, anchorKind: kind === 'mine' ? 'TERRAIN' : 'INSTITUTION', zone, row });
  }
  for (const raw of parts.statics) {
    const row = recordOf(raw);
    addNode(nodes, seen, { producer: 'UC3', kind: String(row.kind), anchor: str(row.anchor), anchorKind: 'TERRAIN', zone: null, row });
  }
  for (const raw of Array.isArray(parts.undercity.components) ? parts.undercity.components : []) {
    const row = recordOf(raw);
    const anchor = str(row.anchor);
    addNode(nodes, seen, {
      producer: 'UC4', kind: String(row.kind), anchor, anchorKind: anchor ? 'INSTITUTION' : 'FABRIC',
      zone: anchor ? zoneByAnchor.get(anchor) ?? null : null, row,
    });
  }
  return nodes.sort((a, b) => compareCodepoint(a.key, b.key));
}

/**
 * THE STRICTER SIDE'S TYPED JOINT (§311.9.2(iii)). Where the two ends stand at different postures
 * the link is closed with the stricter one's own portal; where they stand equal — neither side is
 * stricter — the joint is the codepoint-first kind the two of them publish between them, so a
 * roster accident never decides it. A severed end publishes nothing, and the surviving end's portal
 * carries the row: the edge persists (law 6) even though it is no longer live.
 * @param {GraphNode} a @param {GraphNode} b @returns {JointKind|null}
 */
function jointFor(a, b) {
  const ra = POSTURE_RANK[a.posture];
  const rb = POSTURE_RANK[b.posture];
  const strict = ra > rb ? a : rb > ra ? b : null;
  if (strict && strict.joints.length > 0) return strict.joints[0].kind;
  const kinds = [...a.joints, ...b.joints].map((j) => j.kind).sort(compareCodepoint);
  return kinds.length > 0 ? kinds[0] : null;
}

/**
 * Assemble one edge, or null where no producer published a portal to carry it.
 * @param {GraphNode} a @param {GraphNode} b
 * @param {{ cls: ConnectionClass, cause: EdgeCause, payer: string|null, date: number|null }} spec
 * @returns {GraphEdge|null}
 */
function edgeFor(a, b, spec) {
  const joint = jointFor(a, b);
  if (joint == null) return null;
  const severedBy = a.severedBy ?? b.severedBy;
  const dug = spec.cls !== 'NATIVE';
  return {
    class: spec.cls,
    cause: spec.cause,
    motive: MOTIVE_BY_CAUSE[spec.cause],
    from: a.key,
    to: b.key,
    fromAnchor: a.anchorKind === 'INSTITUTION' ? a.anchor : null,
    toAnchor: b.anchorKind === 'INSTITUTION' ? b.anchor : null,
    joint,
    posture: POSTURE_RANK[a.posture] >= POSTURE_RANK[b.posture] ? a.posture : b.posture,
    live: severedBy == null,
    severedBy,
    payer: dug ? spec.payer : null,
    date: dug ? spec.date : null,
    dateSource: dug ? (spec.date == null ? 'NO_DATED_RECORD' : 'DATED_CALAMITY_REBUILD') : 'NOT_A_DUG_ACT',
    sourceKind: CONNECTIVITY_SOURCE_KIND,
  };
}

/**
 * THE PAIRING RULES, in precedence order — the first that licenses a pair decides its class, and a
 * pair no rule licenses is not joined. Returns null for an unjoined pair.
 * @param {GraphNode} a @param {GraphNode} b
 * @param {{ drained: Record<string, unknown>, payer: string|null, tunnelPayer: string|null }} ctx
 * @returns {{ cls: ConnectionClass, cause: EdgeCause, payer: string|null }|null}
 */
function classify(a, b, ctx) {
  const spine = a.key === SPINE_KEY ? b : b.key === SPINE_KEY ? a : null;
  if (a.anchorKind === 'INSTITUTION' && b.anchorKind === 'INSTITUTION' && a.anchor === b.anchor) {
    return { cls: 'NATIVE', cause: 'SAME_ANCHOR', payer: null };
  }
  if (spine != null) {
    if (spine.zone == null) return null;
    if (ctx.drained[spine.zone] === true) return { cls: 'NATIVE', cause: 'DRAINED_QUARTER', payer: null };
    // The works reached a quarter they do not drain: a DUG act, so it needs an owner to pay for it
    // and an extent worth reaching. An anonymous or slight working gets no corridor by assumption.
    if (spine.anchorKind !== 'INSTITUTION' || spine.routeRank < FUNDED_ROUTE_VALUE_RANK) return null;
    return { cls: 'FUNDED_LINK', cause: 'WORKS_EXTENSION', payer: spine.anchor };
  }
  const bypassed = a.kind === 'smugglers_tunnel' ? b : b.kind === 'smugglers_tunnel' ? a : null;
  if (bypassed != null) {
    // The bypass joins the criminal room it was dug to serve, and nothing else: a tunnel under the
    // wall is under nobody's building, so its ONE lawful end is a building-anchored criminal row.
    if (!bypassed.criminal || bypassed.anchorKind !== 'INSTITUTION' || ctx.tunnelPayer == null) return null;
    return { cls: 'FUNDED_LINK', cause: 'CONTRABAND_ROUTE', payer: ctx.tunnelPayer };
  }
  if (a.zone != null && a.zone === b.zone && (a.criminal || b.criminal) && ctx.payer != null) {
    return { cls: 'ADJACENCY_BREACH', cause: 'SHARED_QUARTER_WITH_MOTIVE', payer: ctx.payer };
  }
  return null;
}

/** The strongest syndicate's canonical key — the actor who pays for a dug criminal passage. UC-4's
 *  rows are already ordered by anchor, so the codepoint-first of a tie is stable.
 *  @param {unknown} syndicates @returns {string|null} */
function strongestSyndicate(syndicates) {
  /** @type {{ anchor: string, standing: number }|null} */
  let best = null;
  for (const raw of Array.isArray(syndicates) ? syndicates : []) {
    const row = recordOf(raw);
    const anchor = str(row.anchor);
    const standing = Number(row.standing);
    if (!anchor || !Number.isFinite(standing)) continue;
    if (best == null || standing > best.standing) best = { anchor, standing };
  }
  return best ? best.anchor : null;
}

/**
 * THE CONNECTIVITY GRAPH. Pure, total and deterministic: the same settlement at the same world
 * state yields the same nodes, the same edges and the same isolations, and no draw is taken.
 * @param {ConnectivityInput|null|undefined} settlement
 * ⭐ THE LAST CAR CLOSES SEAM D-UC0-3. UC-1's header names the composition its own leaf could not
 * make — `deriveStrataExistence(s, { sanitationRung: deriveSewerLadder(s).rung })` — because the
 * existence gate lands before the ladder and the epoch layer never derives one. This car derives
 * BOTH, so it hands UC-0 the rung and hands the resulting seed list to UC-4 through UC-4's own
 * `opts.strata` seam: §311.7.1's "cesspits contribute no sheet, culvert and above do" reaches the
 * colonization order at last, and the anchorless ladder seed arrives with it as the ANONYMOUS
 * FABRIC front §175.1 requires. No leaf is edited and no fact is derived twice.
 *
 * @param {{ highWater?: { population?: unknown, tier?: unknown }, sewer?: unknown, monotone?: unknown,
 *   staticComponents?: unknown, strata?: unknown, undercity?: unknown, asOfYear?: unknown,
 *   worldState?: unknown }} [opts]
 *   results a caller has ALREADY computed — one truth, never a second derivation
 * @returns {{ character: string, spineDegree: number, nodes: GraphNode[], edges: GraphEdge[],
 *   isolations: Array<{ node: string, anchor: string|null, kind: string, posture: ConnectionPosture, reason: IsolationReason }>,
 *   refusals: Array<{ reason: RefusalReason, node: string, peer: string|null }>, sourceKind: string }}
 */
export function deriveUndercityConnectivity(settlement, opts = {}) {
  const s = /** @type {ConnectivityInput} */ (recordOf(settlement));
  const o = recordOf(opts);
  const hw = recordOf(o.highWater).tier != null ? recordOf(o.highWater) : recordOf(deriveHighWater(s));
  const sewer = recordOf(o.sewer ?? deriveSewerLadder(s, { highWater: hw }));
  const monotone = Array.isArray(o.monotone) ? o.monotone
    : deriveMonotoneComponents(s, { highWater: hw, asOfYear: o.asOfYear, worldState: o.worldState });
  const statics = Array.isArray(o.staticComponents) ? o.staticComponents : deriveStaticComponents(s);
  const strata = o.strata ?? deriveStrataExistence(s, { sanitationRung: sewer.rung });
  const undercity = recordOf(o.undercity ?? deriveUndercity(s, { strata, highWater: hw }));
  const nodes = buildNodes({ sewer, monotone, statics, undercity });
  const drained = recordOf(sewer.perQuarterCoverage);
  const ledger = buildCalamityLedger(s);
  const dugDate = ledger.count > 0 && Number.isFinite(Number(ledger.lastYear)) ? Number(ledger.lastYear) : null;
  const syndicate = strongestSyndicate(recordOf(undercity.drivers).syndicates);
  /** @type {GraphEdge[]} */
  const edges = [];
  /** @type {Array<{ reason: RefusalReason, node: string, peer: string|null }>} */
  const refusals = [];
  /** @type {Set<string>} */
  const joined = new Set();
  for (const node of nodes) if (node.kind === REFUSED_KIND) refusals.push({ reason: 'VAULT_REFUSAL', node: node.key, peer: null });
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      if (a.kind === REFUSED_KIND || b.kind === REFUSED_KIND) continue;
      const spineEnd = a.key === SPINE_KEY ? b : b.key === SPINE_KEY ? a : null;
      if (spineEnd != null && spineEnd.kind === KEEPER_REFUSED_KIND) {
        if (spineEnd.zone != null && drained[spineEnd.zone] === true) {
          refusals.push({ reason: 'KEEPER_REFUSAL', node: spineEnd.key, peer: SPINE_KEY });
        }
        continue;
      }
      const licence = classify(a, b, { drained, payer: syndicate, tunnelPayer: syndicate });
      if (licence == null) continue;
      if (licence.cls !== 'NATIVE' && licence.payer == null) continue;
      const edge = edgeFor(a, b, { cls: licence.cls, cause: licence.cause, payer: licence.payer, date: dugDate });
      if (edge == null) continue;
      edges.push(edge);
      joined.add(a.key);
      joined.add(b.key);
    }
  }
  const isolations = nodes.filter((n) => !joined.has(n.key)).map((n) => ({
    node: n.key,
    anchor: n.anchor,
    kind: n.kind,
    posture: n.posture,
    reason: /** @type {IsolationReason} */ (n.kind === REFUSED_KIND ? 'REFUSED'
      : n.severedBy != null ? 'SEVERED'
        : n.joints.length === 0 ? 'NO_PUBLISHED_JOINT' : 'UNREACHED'),
  }));
  const spine = nodes.some((n) => n.key === SPINE_KEY);
  return {
    character: spine ? GRAPH_CHARACTERS[0] : GRAPH_CHARACTERS[1],
    spineDegree: edges.filter((e) => e.from === SPINE_KEY || e.to === SPINE_KEY).length,
    nodes,
    edges: edges.sort((e, f) => compareCodepoint(e.from, f.from) || compareCodepoint(e.to, f.to)),
    isolations,
    refusals: refusals.sort((r, t) => compareCodepoint(r.node, t.node) || compareCodepoint(r.reason, t.reason)),
    sourceKind: CONNECTIVITY_SOURCE_KIND,
  };
}
