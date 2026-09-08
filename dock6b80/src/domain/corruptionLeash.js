/**
 * domain/corruptionLeash.js — THE RESOLVER CHOKEPOINT (W-DOCTRINE-3 §1).
 *
 * Corruption's beneficiary — "the leash" — was a raw name string fuzzy-matched in
 * several independent sites (the exposure attribution, sustainingInstitution,
 * severCorruptionTiesTo). resolveLeash is the SINGLE reader that normalizes
 * whatever legacy or explicit shape corruptTies carries into ONE typed leash, so
 * attribution becomes deliberate instead of an each-site accident. Read-only
 * normalization (no migration): every existing world resolves byte-identically.
 *
 * ── WHY ITS OWN LEAF (first-paint budget) ────────────────────────────────────
 * This lives OUTSIDE corruption.js on purpose. corruption.js is EAGER (first
 * paint) — its criminal-detector / climate readers are dragged into the static
 * closure by the eager mutate.js event router. The resolver's object-building
 * bulk is NOT needed at first paint (its consumers — the LAZY npcAgency exposure
 * loop and the LAZY causeLifecycle — live in the engine chunk), so it rides a
 * lazy leaf and the eager closure stays byte-identical. The engine-lazy idiom.
 *
 * Precedence:
 *   1. corruptTies.leash — an explicit normalized leash (foreign lanes / the DM
 *      composer's beneficiary picker). Its `kind` drives everything.
 *   2. corruptTies.foreignPatron — the betrayal-seed write (already shipping
 *      write-only from seedBetrayalTraitor): a foreign_settlement leash keyed by
 *      the sponsor save id. THIS is why the resolver repairs a CURRENTLY-LIVE
 *      bug — a foreign conspirator's exposure no longer blames the local guild.
 *   3. else — DERIVED-AS-LOCAL from corruptTies.criminalInstitution (the legacy
 *      shape). Absent ties ⇒ a local_org leash with a null criminalInstitution:
 *      the exposure path keeps its climate.criminalInstitutions[0] fallback for
 *      the LOCAL case only, so a tick-onset local corruption is byte-identical.
 *
 * The returned `criminalInstitution` is the LOCAL attribution string every
 * consumer reads; it is null for a purely-foreign leash (the innocent-guild pin,
 * §4). A `cutout` keeps the local org as its attribution (viaLocalOrg) so the
 * local machinery runs untouched while the patron rides as a second-hop
 * annotation. `covert` is always true (the covert-naming law, §6). Pure.
 */

/** The set of leash kinds whose beneficiary sits in ANOTHER settlement/court —
 *  the ones whose exposure must NEVER impair a local organization. */
const FOREIGN_LEASH_KINDS = Object.freeze(new Set(['foreign_settlement', 'foreign_faction', 'foreign_org']));

/**
 * ── THE WILLED MARKER (ENC-2; DESIGN_ENCOUNTERS §5.4, owner rows 5 + 5b) ──────
 *
 * A leash a CHANCE MEETING produced is WILLED: a named person was persuaded, once,
 * by another named person, and the meeting already priced that decision. Every other
 * leash the web mints is UNWILLED — the rarity die bought it.
 *
 * The distinction is a VALUE in the leash's own existing open `conspiracy` slot, never
 * a new persisted field: `mintLeashOnto` already writes `conspiracy: 'foreign_web'`
 * (corruptionWeb.js), `resolveLeash` already carries the slot through on both explicit
 * branches, and no closed vocabulary governs it. So a willed leash costs zero shape.
 *
 * ⛔ WHY THE MARKER EXISTS AT ALL — it is the only thing three fences can read, and the
 * three fences are what make STATE, NEVER FATE true of this mechanism BY CONSTRUCTION
 * rather than by assertion. Left in the estate's ordinary chain a meeting-born leash
 * ends with the honest magistrate ousted (npcAgency's organic exposure lane), replaced
 * by a generated successor, and sentenced a TURNCOAT (npcVerdictTable's `rival_power`
 * arm). The owner closed that fate in §881.11. The fences:
 *   FENCE 1  npcAgency.js  — the organic exposure lane returns before `exposureChance`.
 *   FENCE 2  npcVerdictTable.js — `compromiseSourceOf` never answers `rival_power`.
 *   FENCE 3  causeLifecycle.js — the cause pass never attributes a cause to it.
 * Each is one line and each is convicted by plant P6.
 *
 * ⚠ A willed leash is NOT permanent-and-unreachable in exchange: the web's own pass
 * gives it the two typed ends the estate's leash lacks — DISCOVERY (severs it and
 * demotes the man ONE rank) and LAPSE (clears a leash that never leaked). Fence 1
 * removes the FATE, not the consequence.
 */
export const WILLED_MEETING_CONSPIRACY = 'chance_meeting';

/**
 * True iff a leash was WILLED by a chance meeting. TOTAL: garbage, null, a leashless
 * npcState and a pre-feature save all read false, which is what keeps every dark and
 * every legacy world byte-identical through all three fences.
 *
 * Accepts either grain, because the marker is read from both sides of the mirror:
 *   - a RESOLVED leash (`resolveLeash(npc)`) — npcAgency, npcVerdictTable, causeLifecycle;
 *   - a RAW carrier that holds one under `corruptionLeash` (an npcStates row) — the web.
 * @param {unknown} subject  a ResolvedLeash, a raw leash object, or an npcStates row
 * @returns {boolean}
 */
export function isWilledLeash(subject) {
  if (!subject || typeof subject !== 'object') return false;
  const carrier = /** @type {Record<string, unknown>} */ (subject);
  const nested = carrier.corruptionLeash;
  const leash = nested && typeof nested === 'object'
    ? /** @type {Record<string, unknown>} */ (nested)
    : carrier;
  return leash.conspiracy === WILLED_MEETING_CONSPIRACY;
}

/** True iff a normalized leash kind is foreign (beneficiary in another court).
 *  @param {string} kind */
export function isForeignLeashKind(kind) {
  return FOREIGN_LEASH_KINDS.has(String(kind || ''));
}

/**
 * @typedef {Object} ResolvedLeash
 * @property {string} kind  'local_org' | 'foreign_settlement' | 'foreign_faction' | 'foreign_org' | 'cutout'
 * @property {string|null} settlementId  foreign endpoint (campaign save id) — null for local/cutout
 * @property {string|null} factionName   foreign faction endpoint (name-keyed) — null unless foreign_faction
 * @property {string|null} viaLocalOrg   the cutout's local front (or a local leash's org) — null otherwise
 * @property {string|null} criminalInstitution  the LOCAL attribution target (null for a purely-foreign leash)
 * @property {string|null} conspiracy    the betrayal variant, when carried
 * @property {boolean} foreign  true when the beneficiary sits in another court
 * @property {true} covert
 */

/**
 * Normalize an NPC's corruption beneficiary into one typed leash. @see the block
 * above. Extra args are reserved for foreign-endpoint / cutout resolution and are
 * optional (Phase A reads the NPC alone).
 * @param {import('./settlement.schema.js').SimNpc} npc
 * @param {import('./settlement.schema.js').SimSettlement} [settlement]
 * @param {object} [worldState]
 * @returns {ResolvedLeash}
 */
export function resolveLeash(npc, settlement, worldState) {
  const ties = npc && typeof npc.corruptTies === 'object' ? npc.corruptTies : null;

  // 1. Explicit normalized leash (foreign lanes / composer).
  const explicit = ties && typeof ties.leash === 'object' && ties.leash ? ties.leash : null;
  if (explicit && typeof explicit.kind === 'string') {
    const kind = explicit.kind;
    const foreign = isForeignLeashKind(kind);
    // local_org + cutout keep a LOCAL attribution target (the local machinery is
    // untouched); a foreign leash blames no one local.
    const localOrg = (kind === 'local_org' || kind === 'cutout')
      ? (explicit.viaLocalOrg || ties.criminalInstitution || null)
      : null;
    return {
      kind,
      settlementId: explicit.settlementId != null ? String(explicit.settlementId) : null,
      factionName: explicit.factionName != null ? String(explicit.factionName) : null,
      viaLocalOrg: explicit.viaLocalOrg != null ? String(explicit.viaLocalOrg) : null,
      criminalInstitution: localOrg,
      conspiracy: explicit.conspiracy != null ? String(explicit.conspiracy) : (ties.conspiracy != null ? String(ties.conspiracy) : null),
      foreign,
      covert: true,
    };
  }

  // 2. Betrayal-seed foreignPatron (already-shipping write-only). A sponsor save
  //    id ⇒ a foreign_settlement leash; NEVER a local criminalInstitution (§4).
  if (ties && ties.foreignPatron) {
    return {
      kind: 'foreign_settlement',
      settlementId: String(ties.foreignPatron),
      factionName: null,
      viaLocalOrg: null,
      criminalInstitution: null,
      conspiracy: ties.conspiracy != null ? String(ties.conspiracy) : null,
      foreign: true,
      covert: true,
    };
  }

  // 3. Derived-as-local (dormancy: byte-identical to the legacy read).
  return {
    kind: 'local_org',
    settlementId: null,
    factionName: null,
    viaLocalOrg: null,
    criminalInstitution: ties && ties.criminalInstitution != null ? ties.criminalInstitution : null,
    conspiracy: null,
    foreign: false,
    covert: true,
  };
}
