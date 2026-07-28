/**
 * neighbourSlice — Neighbour relationships, imported neighbour, cross-settlement effects.
 *
 * Premium-gated: only premium users can use the neighbour system.
 * Holds the currently imported neighbour (for next generation),
 * relationship type, and cross-settlement link data.
 */

// R-5b (owner queue #21) — RETIRED FROM THIS SLICE: `neighbourNetwork` and its
// three verbs (addNeighbourLink / removeNeighbourLink / setNeighbourNetwork).
// The array was written by nobody and read by nobody: three registered operations
// and a piece of session state maintaining a link list the product never showed.
// It was session-only (absent from the persist partialize), so nothing durable
// referred to it and no migration is owed. The analytics import went with them —
// NEIGHBOUR_LINKED was fired only by those three verbs, so the event has no
// remaining producer either. The LIVE neighbour surface is the relationship graph
// (domain/relationships/*), which never touched this array.

// KEPT DELIBERATELY (R-5b): the relationship-picker vocabulary now has no reader,
// because its only consumer would have been the Neighbour System tab whose verbs
// just retired. It stays with the seam above rather than being deleted twice — the
// G-2b re-exposure needs exactly this list. Not a dead-op ratchet member: it is a
// data export, not a registered operation.
export const RELATIONSHIP_TYPES = [
  { id: 'neutral',       label: 'Neutral',       color: '#888' },
  { id: 'trade_partner', label: 'Trade Partner',  color: '#2a7a2a' },
  { id: 'allied',        label: 'Allied',         color: '#2a4a8a' },
  { id: 'patron',        label: 'Patron',         color: '#6a4a8a' },
  { id: 'client',        label: 'Client',         color: '#8a6a2a' },
  { id: 'rival',         label: 'Rival',          color: '#8a4a2a' },
  { id: 'cold_war',      label: 'Cold War',       color: '#6a2a2a' },
  { id: 'hostile',        label: 'Hostile',        color: '#8b1a1a' },
  { id: 'criminal_network', label: 'Criminal Network', color: '#5a2a8a' },
];

// `_get` is unused: its last reader was handleImportDirect's canUseNeighbour()
// premium check, which retired with the verb. The parameter STAYS so this slice
// keeps the uniform `(set, get)` factory shape every sibling has in the
// store/index.js composition block — dropping it made tsc red there (TS2554) and
// would leave one odd factory out of fourteen for a future editor to trip over.
export const createNeighbourSlice = (set, _get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  importedNeighbour:  null,          // settlement JSON to feed into next generation
  neighbourRelType:   'neutral',     // relationship type for next link

  // ── Actions ────────────────────────────────────────────────────────────────
  // RETIRED (R-5b, owner queue #21): `importNeighbour`, and — completing the same
  // finding — `handleImportDirect` (the direct-JSON import for a "Neighbour System
  // tab" that does not exist) and `setNeighbourRelType` (the relationship picker
  // for the same absent tab). All three were premium verbs no surface ever called.
  //
  // THE SEAM IS UNTOUCHED AND STILL LIVE — generateSettlement reads
  // `state.importedNeighbour`, resolveNeighbour/assembleSettlement read the
  // `config._neighbourRelType` rider, the pipeline takes a `neighbor` argument, and
  // `canUseNeighbour` still gates. Both slice fields below are therefore kept ON
  // PURPOSE and are now WRITER-LESS by design: re-exposing the feature is a matter
  // of writing them from a real control (recorded as a G-2b feature spec), not of
  // rebuilding anything. What is gone is the decoy — three registered, documented,
  // Compendium-rendered verbs advertising a feature with no door.
  //
  // Their retirement also SHRANK the config single-door enumeration: both wrote
  // `state.config._neighbourRelType` directly and were two of the four reviewed
  // exemptions in tests/store/configDirectWriterExemptions.scan.test.js.

  clearNeighbour: () =>
    set(state => { state.importedNeighbour = null; }),
});
