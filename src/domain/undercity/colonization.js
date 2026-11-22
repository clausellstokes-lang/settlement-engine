/**
 * undercity/colonization.js — THE UNDERCITY EPOCH LAYER (ODQ §311.3 / §311.4 / §311.8.2(d) /
 * §311.8.3 / §311.8.4), the fourth car of the undercity train and the FLAG-MINTING wave
 * (MF-UC4; charter draft-UNDERCITY-PLAN.md §4 UC-4, ruled ODQ §441, dispatched ODQ §484).
 *
 * The owner's two-level reading, verbatim: "the SHEET exists with any qualifying seed (the honest
 * mundane network, however modest); the UNDERCITY additionally requires the criminal-economic
 * drivers that grew it." UC-0 owns the first level. THIS leaf owns the second: given the seeded
 * spaces, how much of them the criminal economy actually colonized — "PROPORTIONAL to the economy,
 * to the criminal share of that economy, and to crime-syndicate power standings — typed dossier
 * facts, a DERIVATION never a dial, THE PROMISE intact."
 *
 * ⭐ ONE TRUTH FOR THE CRIMINAL SHARE (§441.3). `drivers.criminalShare` is `readCorruptionClimate`'s
 * own `crime` — the estate's ONE stored reading of `safetyProfile.compound.criminalEffective` with
 * the `blackMarketCapture` fallback (corruption.js:539-542). It is CONSUMED, never re-weighted: the
 * charter struck the compile's parallel institution-weight derivation by name (J-10). The same call
 * yields `drivers.economy` (the prosperity band), so this leaf reads the climate ONCE and no second
 * reading of either fact exists anywhere in the train.
 *
 * ⭐ THE SYNDICATE STANDING IS THE SEPARATE INPUT, and it is the one that MOVES. The criminal share
 * is generation-time and static; faction power is what the pulse advances tick by tick
 * (factionCompetition.js:531-533 — "the roster IS the live power source"). So the recession that
 * leaves fossils is a fall in SYNDICATE STANDING, and the thing a ring buffer forgot is that
 * standing's peak.
 *
 * ⭐⭐ THE VERTICAL HIGH-WATER LAW, AND WHY ONE FIELD HAS TO PERSIST (§311.3: "dug is forever";
 * §359.5, first built here). Every other fact in this train is derivable from the settlement as it
 * stands. The peak is not: nothing in the estate retains a faction's historical maximum power, and
 * a derivation cannot reconstruct a maximum from a present value. So ONE field persists —
 * `powerHighWater`, a monotone, drop-when-absent number on the faction record — folded at an
 * EXISTING registered pulse seam (`ensureFactionStates`, which the pulse runs every advance over
 * every settlement's roster) behind ONE NEW VIRTUAL FLAG, and projected onto the settlement's own
 * roster by the seam that already projects live faction state. The GR-5A monotone-memory precedent
 * (`treatyRenewalActive` / `worstObservedEverOf` / `worstObservedEverAfter` in pactAmendment.js,
 * assigned at one line in peaceTerms.js) is followed shape for shape: gate by NAME with `=== true`,
 * a reader that resolves ABSENCE without writing, a fold that only ever moves UP, and no clearer
 * anywhere.
 *
 * ⛔ DARK BY DEFAULT, AND THE DARK PATH LIES ABOUT NOTHING (§441.4, R-5). The flag is ABSENT from
 * `DEFAULT_SIMULATION_RULES`, so on every live world today the fold is never evaluated, no record
 * gains the key, and `undercityHighWaterOf` answers `null`. `drivers.highWater` is then `null` and
 * `fossils` is EMPTY — not "no recession found" but "no instrument": the reader reports the
 * absence and CT-4 is forbidden to speak of fossils on this path (§7 term 3). Lighting the flag in
 * defaults is same-seed pulse motion and is the owner's call, R-5.
 *
 * LAWS THIS LEAF KEEPS:
 *  - A PURE DERIVER at the domain root (the UC-0 / UC-1 / UC-3 precedent): generation never imports
 *    it, `deriveUndercity` writes nothing, the generator golden is byte-identical. The ONE write in
 *    this car is `withPowerHighWater`, which RETURNS the next record and lets the seam assign it.
 *  - DISPLAY-LAZY BY INHERITANCE (§443): importing `highWater.js` and `display/calamityLedger.js`
 *    transfers their law. `calamityHistory` is a PULSE-written key and is reached ONLY through the
 *    banked projection `buildCalamityLedger` — this file never names it as a read.
 *  - FIRST-PAINT CLOSURE (§441.5(d)): `src/domain/undercity/**` never imports `src/domain/townMap/**`.
 *  - ONE TRUTH WITH THE TRAIN: the seeds come from UC-0's `deriveStrataExistence`, the anchor key
 *    from UC-0's `institutionAnchorKey`, the joint kinds from UC-0's `jointVocabulary.js`, the wall
 *    fact from the accessor MF-UC0's packet NAMED (`defenseProfileHasWalls`, causalState.js:380).
 *    Nothing here restates any of them.
 *  - THE UNIVERSAL FRONT (§175.1): every colonized piece names its surface cover. Where the seed is
 *    a REAL institution the front IS that institution, by canonical key; where the seed is UC-1's
 *    anchorless derived rung the front is ANONYMOUS FABRIC. No clickable truth is ever minted.
 *  - SEVER, NEVER DELETE (§311.8.3 / §311.9's law 5): a flooded or sealed working keeps its row and
 *    loses its joins. Use recedes; dug space does not.
 *  - FINITE SEMANTICS: every vocabulary is closed and frozen. The ONE tuning surface is
 *    `UNDERCITY_TUNING`; the tables beside it name which buckets are REACHABLE, never a weight
 *    (the UC-3 `EXTENTS_BY_GROUND` / UC-1 `TIER_LADDER_BOUNDS` precedent).
 *  - PURITY: no Date, no Math.random, no Intl, no I/O; the only draw is a seed-keyed uniform off the
 *    settlement's existing identity (the §311.7.3 district-affinity idiom); iteration is ordered by
 *    `compareCodepoint`; the FNV root is IMPORTED from `kernel/proseHash.js` and the clamp from
 *    `kernel/math.js`, so this file defines no hash root and no local clamp.
 */
import { clamp } from '../../kernel/math.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { defenseProfileHasWalls } from '../causalState.js';
import { readCorruptionClimate } from '../corruption.js';
import { compareCodepoint } from '../deterministicSort.js';
import { buildCalamityLedger } from '../display/calamityLedger.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { deriveHighWater } from '../highWater.js';
import { resolveSettlementTerrain } from '../resolveTerrain.js';
import { factionPowerShare01 } from '../factionPowerShare.js';
import { stablePart } from '../worldPulse/stablePart.js';
import { isJointKind } from './jointVocabulary.js';
import { deriveStrataExistence, institutionAnchorKey } from './strataExistence.js';

/** @typedef {import('./jointVocabulary.js').JointKind} JointKind */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/**
 * The leaf's ONE input type: the estate's settlement plus the pulse-written calamity key spelled
 * the way `highWater.js`'s own `HighWaterInput` spells it — DECLARED because `buildCalamityLedger`
 * takes a WEAK type and TS refuses a weak-type argument declaring none of its properties. Declaring
 * it is not a second truth: the VALUE is still read only through the banked ledger projection.
 * The WF-1B/WF-1C law: cure by TYPEDEF, never by widening.
 * @typedef {SimSettlement & { calamityHistory?: import('../display/calamityLedger.js').CalStampLike[] }} UndercityInput
 */
/** @typedef {'open'|'flooded'|'sealed'} WorkingState */
/** @typedef {'abandoned'|'sealed'|'flooded'} FossilKind */
/** @typedef {'colonized_seed'|'smugglers_tunnel'} UndercityComponentKind */
/** @typedef {'INSTITUTION'|'ANONYMOUS_FABRIC'} FrontKind */

/** @typedef {{ kind: JointKind, anchor: string }} SurfaceJoin */
/** @typedef {{ kind: FrontKind, anchor: string|null, name: string|null }} SurfaceFront */
/** @typedef {{ archetype: string, anchor: string|null, name: string, standing: number, mark: number|null }} SyndicateRow */

/**
 * @typedef {Object} UndercityComponent
 * @property {UndercityComponentKind} kind
 * @property {string} license          the typed fact that permits it (§311.8.1)
 * @property {string|null} anchor      the canonical institution key, or null for anonymous fabric
 * @property {SurfaceFront} front      the UNIVERSAL FRONT — what stands over it (§175.1)
 * @property {string} extent           the closed extent bucket its driver reaches
 * @property {'DEMAND_DRIVEN'} temperament
 * @property {SurfaceJoin[]} surfaceJoins  EMPTY when severed; empty is lawful (§311.6.4)
 * @property {WorkingState} state      open / flooded / sealed — sever, never delete
 * @property {'DERIVED_V1'} sourceKind
 */

/**
 * @typedef {Object} Undercity
 * @property {boolean} present
 * @property {number} colonizationShare 0..1
 * @property {{ economy: number, criminalShare: number, syndicates: SyndicateRow[], highWater: { share: number, source: 'PULSE_SIGNAL' }|null }} drivers
 * @property {UndercityComponent[]} components
 * @property {Array<{ kind: FossilKind, cause: string, date: number|null }>} fossils
 * @property {string} highWaterTier    the peak tier the colonization ceiling is keyed to
 * @property {'DERIVED_V1'} sourceKind
 */

/** The simulation rule this car mints. VIRTUAL: absent from `DEFAULT_SIMULATION_RULES`. */
export const UNDERCITY_HIGH_WATER_RULE = 'undercityHighWaterEnabled';
/** The temperament every row of this car declares (§311.8.2(d)). */
export const UNDERCITY_TEMPERAMENT = 'DEMAND_DRIVEN';
/** Frozen provenance stamp; changing any rule below is a declared shift. */
export const UNDERCITY_SOURCE_KIND = 'DERIVED_V1';
/** The persisted signal's field name — ONE key, on the faction record (§359.5, C-2). */
export const POWER_HIGH_WATER_KEY = 'powerHighWater';
/** The closed component kinds. @type {ReadonlyArray<UndercityComponentKind>} */
export const UNDERCITY_COMPONENT_KINDS = Object.freeze(/** @type {UndercityComponentKind[]} */ (['colonized_seed', 'smugglers_tunnel']));
/** The closed working states (§311.8.3). @type {ReadonlyArray<WorkingState>} */
export const WORKING_STATES = Object.freeze(/** @type {WorkingState[]} */ (['open', 'flooded', 'sealed']));
/** The closed fossil kinds. @type {ReadonlyArray<FossilKind>} */
export const FOSSIL_KINDS = Object.freeze(/** @type {FossilKind[]} */ (['abandoned', 'sealed', 'flooded']));
/** The closed extent buckets, smallest to largest. @type {ReadonlyArray<string>} */
export const UNDERCITY_EXTENTS = Object.freeze(['bolthole', 'warren', 'quarter', 'undercity']);
/** The two joints a demand-driven working opens through, and the surface features they pass. */
export const GATE_JOINT = 'stair';
export const WATERFRONT_JOINT = 'sluice';
export const GATE_FEATURE = 'gate';
export const WATERFRONT_FEATURE = 'waterfront';
/** The published route values that state a body of water AT the settlement — UC-1's read, reused. */
export const WATER_ROUTE_VALUES = Object.freeze(['coastal', 'port', 'river']);
/** The terrain classes whose published ground the water table reaches. */
export const WATERSIDE_TERRAINS = Object.freeze(['coastal', 'riverside']);
/** The one §311.8.2(d) licence half with NO typed home in the estate (D-UC0-2; see the packet). */
export const NO_TYPED_HOME_LICENCE = 'TOLL';

/**
 * THE ONE TUNING SURFACE (§441.6, the `UNDERWAYS_TUNING` / `SEWER_DERIVATION_TUNING` precedent).
 * Bounded, typed, frozen, owner-retunable, a registered TUNING-PASS INPUT (§8 R-3), PROVISIONAL
 * until the §362.4 tuning signature and EXPOSABLE-PROVISIONAL in the interim (§7 term 5).
 *
 * PROVENANCE: chosen by THIS lane's seed sweep over a 420-settlement corpus generated at the build
 * base (the UC-1 corpus idiom: 6 tiers x 2 cultures x 7 terrains x 5 seeds, each terrain paired with
 * its honest route). Four candidate weight sets were driven; the chosen set is the one that keeps
 * all three drivers LIVE (each moves the colonized count on a real part of the corpus, so no weight
 * is decorative) while holding the two ruled invariants — no criminal drivers means no undercity,
 * and the share is monotone non-decreasing in syndicate standing. The three weights sum to exactly 1.
 * The full table and the refused candidates are in the packet's provenance section.
 */
export const UNDERCITY_TUNING = Object.freeze({
  weights: Object.freeze({
    CRIMINAL_SHARE: 0.40,
    SYNDICATE_STANDING: 0.40,
    ECONOMY: 0.20,
  }),
  /** at or below this share there is no undercity — the seeded sheet stands alone (§311.4). */
  presenceFloor: 0.30,
  /** the criminal share below which a smugglers' tunnel is not worth digging (§311.8.2(d)). */
  smugglerCriminalFloor: 0.35,
  /** how many workings deep a colonization must run before the deepest cut can meet the water
   *  table. A single bolthole is not a deep working, so waterside ground alone never floods one. */
  floodDepth: 2,
});

/**
 * HOW MUCH OF THE SEEDED SPACE A PEAK TIER COULD EVER COLONIZE — a GRAMMAR, not a tuning table: it
 * names which counts are REACHABLE at a tier, never a weight or a threshold. Keyed to the HIGH-WATER
 * tier rather than the current one, because the constitutional high-water law says built extent
 * derives from the historical maximum (highWater.js) and §311.3 says dug is forever: a city that
 * peaked at twenty thousand has the workings of twenty thousand.
 * @type {Readonly<Record<string, number>>}
 */
export const COLONIZED_CEILING_BY_TIER = Object.freeze({
  thorp: 0, hamlet: 0, village: 1, town: 2, city: 4, metropolis: 6,
});

/**
 * WHICH EXTENT A COLONIZED COUNT REACHES — a nested grammar over the closed bucket list, smallest
 * first. Index into `UNDERCITY_EXTENTS` by how many workings the drive actually opened.
 * @param {number} count @returns {string}
 */
function extentFor(count) {
  const i = count >= 5 ? 3 : count >= 3 ? 2 : count >= 2 ? 1 : 0;
  return UNDERCITY_EXTENTS[i];
}

/**
 * The Murmur finaliser applied to the kernel's FNV-1a before the modulus — the CURED spelling
 * (avalanche before multiply), because a raw `fnv % n` aliases onto a parity class. The FNV root is
 * IMPORTED, never restated: this leaf defines no hash root and adds no entropy-census row.
 * @param {number} h @returns {number}
 */
function avalanche32(h) {
  let x = h >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b) >>> 0;
  x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  return x >>> 0;
}

/** A seed-keyed uniform in [0,1). No weight, no threshold — the hash is the whole rule.
 *  @param {string} token @returns {number} */
function unitDraw(token) {
  return avalanche32(fnv1a32(token)) / 4294967296;
}

/** The settlement's seed-stable identity: `id`, else the name, else the slug helper's fallback.
 *  UC-3's idiom, unchanged. @param {{ id?: unknown, name?: unknown }} s @returns {string} */
function identityOf(s) {
  if (typeof s.id === 'string' && s.id.trim()) return s.id;
  if (typeof s.name === 'string' && s.name.trim()) return s.name;
  return stablePart(null);
}

/** A record view of any value — the CALL-receiver idiom (pactAmendment.js:150-153): the
 *  observed-shape detector grounds a finding by its receiver ROOT, and a CallExpression receiver
 *  resolves to no shape, so reading a pulse-written key through this costs zero inventory rows.
 *  @param {unknown} v @returns {Record<string, unknown>} */
function recordOf(v) {
  return v && typeof v === 'object' ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** Build a caused portal, refusing any kind outside the closed vocabulary (UC-3's law: a component
 *  may lack a portal, but none may carry an invented one).
 *  @param {unknown} kind @param {unknown} anchor @returns {SurfaceJoin|null} */
export function undercitySurfaceJoin(kind, anchor) {
  if (!isJointKind(kind)) return null;
  if (typeof anchor !== 'string' || !anchor.trim()) return null;
  return { kind, anchor };
}

/**
 * THE GATE (§3, the CQ5 law), read ONCE and BY NAME with the strict `=== true` idiom, in the
 * `urbanFabricActive` / `treatyRenewalActive` spelling: ABSENT and FALSE are identical at the
 * decision site, and a campaign that never lights it pays ZERO persisted bytes. Manifested in
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS` with its AUTHORED certification row in the SAME COMMIT as this,
 * its first real gate read. BY NAME rather than through a frozen-list `.every()`, because a
 * computed member access attributes to no key and would hide a fully wired flag from the
 * engine-gated-key census.
 * @param {{ simulationRules?: unknown }|null|undefined} worldState @returns {boolean}
 */
export function undercityHighWaterActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).undercityHighWaterEnabled === true);
}

/**
 * THE READ that resolves an absent mark WITHOUT writing it — the `worstObservedEverOf` discipline.
 * ⭐ ABSENCE IS REPORTED, NEVER DEFAULTED TO ZERO. A record written before this wave, or in a world
 * that never lit the flag, carries no key and answers `null`: "no instrument", not "no recession".
 * Zero would be a claim that the syndicate has always been powerless, which is the quiet lie the
 * dark-path pin exists to refuse. Nothing migrates and nothing is backfilled.
 * @param {unknown} record a faction state or a settlement roster entry @returns {number|null}
 */
export function powerHighWaterOf(record) {
  const written = Number(recordOf(record)[POWER_HIGH_WATER_KEY]);
  return Number.isFinite(written) ? clamp(written, 0, 1) : null;
}

/**
 * THE MONOTONE FOLD — the whole of this car's persisted substrate, and the one thing a faction
 * record cannot do today. Faction power is renormalized from the roster every advance, so a
 * syndicate that ruled for a decade and was broken last year is, on the parchment, a syndicate that
 * never ruled. This fold is the counterforce: it moves UP and never down, so the record keeps the
 * strongest that syndicate was ever OBSERVED to be.
 * ⛔ PURE, and an IDENTITY NO-OP when nothing moved: it returns the SAME record object unless the
 * mark actually rises, so the seam's own quiet-state discipline is preserved exactly.
 * @param {unknown} record @param {unknown} observed this advance's standing, 0..1
 * @returns {unknown} the record to store — the same object when the mark did not move
 */
export function withPowerHighWater(record, observed) {
  if (!record || typeof record !== 'object') return record;
  const seen = Number(observed);
  if (!Number.isFinite(seen)) return record;
  const next = clamp(seen, 0, 1);
  const held = powerHighWaterOf(record);
  if (held != null && held >= next) return record;
  return { ...recordOf(record), [POWER_HIGH_WATER_KEY]: next };
}

/**
 * THE SYNDICATE STANDINGS — A.CRIMINAL faction power off the settlement's own roster, the SEPARATE
 * §311.4 input (kept distinct from the criminal SHARE, which is corruption.js's stored read).
 * ⚠ THE VALUE NORMALIZATION MIRRORS `factionCompetition.factionPower`'s finite branch (a value
 * above 1 is a 0..100 score) because the roster carries both spellings; the acceptance drives both
 * and pins them equal. Its INDEX FALLBACK is deliberately NOT mirrored: `0.72 - index * 0.16` is a
 * contest-weight prior for RANKING, and a faction carrying no power number has no measured
 * standing, so it contributes nothing to a dug extent.
 * ⛔ ITS KEY FALLBACKS ARE NOT MIRRORED EITHER, AND THAT IS A MEASUREMENT RATHER THAN A STYLE CALL.
 * `influence`, `score`, `weight` and `label` are keys the observed generation corpus never carries
 * on a faction (the reader-with-no-writer walker reports each as a ceiling-0 row against this
 * file), so mirroring them would land four arms that are dead on every generated world. The
 * competition layer's own chain is frozen debt it already carries; a new reader does not inherit it.
 * Ordered by anchor key, then name. Total on garbage.
 * @param {{ powerStructure?: unknown }|null|undefined} settlement @returns {SyndicateRow[]}
 */
export function syndicateStandingOf(settlement) {
  const rows = recordOf(recordOf(settlement).powerStructure).factions;
  /** @type {SyndicateRow[]} */
  const out = [];
  for (const raw of Array.isArray(rows) ? rows : []) {
    const row = recordOf(raw);
    if (factionArchetype(row) !== FACTION_ARCHETYPES.CRIMINAL) continue;
    // The ONE faction-power reader; the sniff this replaces read a 1%-share syndicate as a
    // syndicate standing at full strength (§759.3).
    const standing = factionPowerShare01(Number(row.power)) ?? 0;
    const name = String(row.faction ?? row.name ?? '');
    out.push({
      archetype: FACTION_ARCHETYPES.CRIMINAL,
      anchor: institutionAnchorKey({ name }),
      name,
      standing,
      mark: powerHighWaterOf(row),
    });
  }
  return out.sort((a, b) => compareCodepoint(a.anchor ?? '', b.anchor ?? '') || compareCodepoint(a.name, b.name));
}

/** The strongest live standing and the strongest RECORDED mark across the syndicates. The mark is
 *  null when no syndicate carries one — the dark path, reported not defaulted.
 *  @param {SyndicateRow[]} syndicates @returns {{ now: number, mark: number|null }} */
function standingSummary(syndicates) {
  let now = 0;
  /** @type {number|null} */
  let mark = null;
  for (const s of syndicates) {
    if (s.standing > now) now = s.standing;
    if (s.mark != null && (mark == null || s.mark > mark)) mark = s.mark;
  }
  return { now, mark };
}

/** Does the water table reach this ground? Its own declared route first, else the terrain class —
 *  UC-1's outfall read, reused for the §311.8.3 flood consequence.
 *  @param {unknown} settlement @param {string|null} terrain @returns {boolean} */
function waterside(settlement, terrain) {
  const own = String(recordOf(recordOf(settlement).config).tradeRouteAccess ?? '').toLowerCase();
  return WATER_ROUTE_VALUES.includes(own) || WATERSIDE_TERRAINS.includes(String(terrain));
}

/**
 * THE UNIVERSAL FRONT (§175.1's truth roster): a colonized piece under a REAL seeded institution
 * names that institution by canonical key; a piece under UC-1's anchorless derived rung names
 * ANONYMOUS FABRIC. No institution is ever minted here, so nothing clickable is invented.
 * @param {{ anchor: string|null, name: string|null }} seed @returns {SurfaceFront}
 */
function frontFor(seed) {
  if (typeof seed.anchor === 'string' && seed.anchor !== '') {
    return { kind: 'INSTITUTION', anchor: seed.anchor, name: seed.name };
  }
  return { kind: 'ANONYMOUS_FABRIC', anchor: null, name: null };
}

/**
 * THE SMUGGLERS' TUNNEL (§311.8.2(d), §441.5(c)) — the one row whose licence is a SURFACE fact:
 * "smugglers' tunnels ONLY where a wall or toll makes the dig worth it — a bypass needs something
 * to bypass". The WALL half reads the accessor MF-UC0's packet named (`defenseProfileHasWalls`,
 * causalState.js:306, the same fact the map draws). The TOLL half has NO TYPED HOME: no engine
 * accessor exists and the catalog's toll rows ('Toll bridge', 'Customs house', 'Gates (if walled)',
 * "Harbour master's office") carry no facet a chokepoint read could resolve, and a name-list match
 * is REFUSED BY NAME everywhere in this train. The slot is therefore typed and inert (D-UC0-2,
 * re-deferred with the measurement) — the licence resolves on the wall alone, exactly as §311.8.2(d)
 * permits, which is what makes the G-43 arm (remove the wall, lose the licence) a clean directional.
 * @param {unknown} settlement @param {number} criminalShare @param {number} economy
 * @param {boolean} water @returns {UndercityComponent|null}
 */
function smugglersTunnel(settlement, criminalShare, economy, water) {
  const walled = defenseProfileHasWalls(/** @type {{ hasWalls?: unknown }} */ (recordOf(settlement).defenseProfile));
  if (!walled) return null;
  if (criminalShare < UNDERCITY_TUNING.smugglerCriminalFloor) return null;
  // EXTENT = the contraband flow: what the town trades, times the share of it that is criminal.
  const flow = clamp(economy * criminalShare, 0, 1);
  const join = water
    ? undercitySurfaceJoin(WATERFRONT_JOINT, WATERFRONT_FEATURE)
    : undercitySurfaceJoin(GATE_JOINT, GATE_FEATURE);
  return {
    kind: 'smugglers_tunnel',
    license: 'WALL_OR_TOLL_AND_CRIMINAL_SHARE',
    anchor: null,
    front: { kind: 'ANONYMOUS_FABRIC', anchor: null, name: null },
    extent: extentFor(flow >= 0.5 ? 5 : flow >= 0.3 ? 3 : flow >= 0.15 ? 2 : 1),
    temperament: UNDERCITY_TEMPERAMENT,
    surfaceJoins: join ? [join] : [],
    state: 'open',
    sourceKind: UNDERCITY_SOURCE_KIND,
  };
}

/**
 * THE PROXIMITY GRAMMAR (§311.8.4) — which seed classes the criminal economy reaches first. Lower
 * is nearer. A grammar over UC-0's closed seed vocabulary, not a weight: it names ORDER, never
 * quantity. Cellars sit behind the trade fronts the shadows district already uses; the declared
 * subterranean kin are already underground; the sanitation spine is the town's own back door; burial
 * ground and workings are the far end.
 * @type {Readonly<Record<string, number>>}
 */
export const SEED_PROXIMITY = Object.freeze({
  cellar: 0, subterranean: 1, sanitation: 2, crypt: 3, mine: 4, other: 5,
});

/**
 * THE UNDERCITY. Pure, total, deterministic: the same settlement yields the same colonization, the
 * same fronts and the same fossils. The FIRST level of §311.4 (does a sheet exist at all) belongs
 * to UC-0 and is consumed here, never re-derived.
 *
 * COLONIZATION ORDER (§311.8.4): from the seeds nearest the surface causes. The seeds arrive from
 * UC-0 already ordered by canonical anchor key, and the order this leaf imposes on top is a typed
 * PROXIMITY reading — the classes the criminal economy reaches first (cellars behind the trade
 * fronts, then the subterranean kin, then the sanitation spine, then the burial and working
 * ground), with a seed-keyed uniform breaking ties inside a class so two identical rosters in
 * different worlds do not colonize in lockstep.
 *
 * @param {UndercityInput|null|undefined} settlement
 * @param {{ strata?: { seeds?: unknown }, highWater?: { tier?: unknown } }} [opts] facts a caller
 *   already computed — one truth, never a second read
 * @returns {Undercity}
 */
export function deriveUndercity(settlement, opts = {}) {
  const s = /** @type {UndercityInput} */ (recordOf(settlement));
  const climate = readCorruptionClimate(s);
  const criminalShare = clamp(climate.crime, 0, 1);
  const economy = clamp(climate.prosperity, 0, 1);
  const syndicates = syndicateStandingOf(s);
  const { now, mark } = standingSummary(syndicates);
  const W = UNDERCITY_TUNING.weights;
  const colonizationShare = clamp(
    W.CRIMINAL_SHARE * criminalShare + W.SYNDICATE_STANDING * now + W.ECONOMY * economy, 0, 1,
  );
  const suppliedStrata = opts && typeof opts === 'object' ? opts.strata : undefined;
  const strata = suppliedStrata && typeof suppliedStrata === 'object' ? suppliedStrata : deriveStrataExistence(s);
  const seedRows = Array.isArray(strata.seeds) ? strata.seeds.map(recordOf) : [];
  const suppliedHw = opts && typeof opts === 'object' ? opts.highWater : undefined;
  const hw = suppliedHw && typeof suppliedHw === 'object' ? suppliedHw : deriveHighWater(s);
  const highWaterTier = typeof hw.tier === 'string' ? hw.tier : '';
  const ceiling = Object.prototype.hasOwnProperty.call(COLONIZED_CEILING_BY_TIER, highWaterTier)
    ? COLONIZED_CEILING_BY_TIER[highWaterTier]
    : 0;
  const present = seedRows.length > 0 && colonizationShare > UNDERCITY_TUNING.presenceFloor && ceiling > 0;
  const identity = identityOf(s);
  const ordered = seedRows
    .map((row) => ({
      anchor: typeof row.anchor === 'string' ? row.anchor : null,
      name: typeof row.name === 'string' ? row.name : null,
      rank: SEED_PROXIMITY[String(row.class)] ?? SEED_PROXIMITY.other,
      tie: unitDraw(`${identity}|colonize|${String(row.anchor ?? '')}|${String(row.class)}`),
    }))
    .sort((a, b) => a.rank - b.rank || a.tie - b.tie || compareCodepoint(a.anchor ?? '', b.anchor ?? ''));
  const opened = present ? Math.min(ordered.length, ceiling, Math.max(1, Math.round(colonizationShare * ceiling))) : 0;
  const terrain = resolveSettlementTerrain(s);
  const water = waterside(s, terrain);
  const ledger = buildCalamityLedger(s);
  // §311.8.3, as two indices rather than a band, because both consequences land on ONE working
  // each and a band would silently sever a whole colonization. The DEEPEST cut (the last opened)
  // meets the water table where the ground is waterside and the working actually runs deep; a
  // DATED collapse in the immutable record seals the cut ABOVE it — the newest one still in use.
  const floodAt = water && opened >= UNDERCITY_TUNING.floodDepth ? opened - 1 : -1;
  const sealAt = ledger.count > 0 ? opened - 1 - (floodAt >= 0 ? 1 : 0) : -1;
  /** @type {UndercityComponent[]} */
  const components = [];
  for (let i = 0; i < opened; i += 1) {
    const seed = ordered[i];
    // Both consequences SEVER the joins and KEEP the row: use recedes, dug space never does.
    const flooded = i === floodAt;
    const sealed = !flooded && i === sealAt;
    /** @type {WorkingState} */
    const state = flooded ? 'flooded' : sealed ? 'sealed' : 'open';
    const join = water
      ? undercitySurfaceJoin(WATERFRONT_JOINT, WATERFRONT_FEATURE)
      : undercitySurfaceJoin(GATE_JOINT, GATE_FEATURE);
    components.push({
      kind: 'colonized_seed',
      license: 'CRIMINAL_DEMAND_ON_A_SEEDED_SPACE',
      anchor: seed.anchor,
      front: frontFor(seed),
      extent: extentFor(opened),
      temperament: UNDERCITY_TEMPERAMENT,
      surfaceJoins: state === 'open' && join ? [join] : [],
      state,
      sourceKind: UNDERCITY_SOURCE_KIND,
    });
  }
  const tunnel = present ? smugglersTunnel(s, criminalShare, economy, water) : null;
  if (tunnel) components.push(tunnel);
  return {
    present,
    colonizationShare,
    drivers: {
      economy,
      criminalShare,
      syndicates,
      highWater: mark == null ? null : { share: mark, source: 'PULSE_SIGNAL' },
    },
    components,
    fossils: fossilsFrom(mark, now, ceiling, water, ledger),
    highWaterTier,
    sourceKind: UNDERCITY_SOURCE_KIND,
  };
}


/**
 * THE FOSSILS (§311.3's high-water law, run vertically). Recession is the recorded PEAK standing
 * minus the standing now; the workings that peak opened are still there, unused.
 * ⛔ ON THE DARK PATH THERE ARE NO FOSSILS AND THE LIST SAYS SO HONESTLY. With no recorded mark the
 * function returns EMPTY — not because nothing receded but because nothing was ever measured. CT-4
 * is forbidden to ground a sentence in this list while the flag is dark (§7 term 3), and the
 * acceptance pins the absence rather than letting a vacuous fence hold over it.
 * @param {number|null} mark @param {number} now @param {number} ceiling @param {boolean} water
 * @param {{ count: number, lastYear: number|null }} ledger
 * @returns {Array<{ kind: FossilKind, cause: string, date: number|null }>}
 */
function fossilsFrom(mark, now, ceiling, water, ledger) {
  if (mark == null || ceiling <= 0) return [];
  const recession = clamp(mark - now, 0, 1);
  const count = Math.min(ceiling, Math.floor(recession * ceiling));
  /** @type {Array<{ kind: FossilKind, cause: string, date: number|null }>} */
  const out = [];
  for (let i = 0; i < count; i += 1) {
    if (water && i === 0) out.push({ kind: 'flooded', cause: 'THE_WATER_TABLE_TOOK_THE_DEEP_CUT', date: null });
    else if (ledger.count > 0 && i === (water ? 1 : 0)) out.push({ kind: 'sealed', cause: 'A_DATED_CALAMITY_SEALED_IT', date: ledger.lastYear });
    else out.push({ kind: 'abandoned', cause: 'THE_SYNDICATE_RECEDED_FROM_ITS_HIGH_WATER', date: null });
  }
  return out;
}
