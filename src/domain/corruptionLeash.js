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
