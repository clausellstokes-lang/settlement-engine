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

export const createNeighbourSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  importedNeighbour:  null,          // settlement JSON to feed into next generation
  neighbourRelType:   'neutral',     // relationship type for next link

  // ── Actions ────────────────────────────────────────────────────────────────
  // RETIRED (R-5b, owner queue #21): `importNeighbour`. It was the premium
  // "feed this settlement into the next generation" verb and no surface ever
  // called it. The SEAM it fed is untouched and still live — generateSettlement
  // reads `state.importedNeighbour`, the pipeline takes a `neighbor` argument,
  // and `canUseNeighbour` still gates — so re-exposing the feature is a matter of
  // writing that one field from a real control, not of rebuilding anything.
  // Recorded as a G-2b feature spec rather than kept as a decoy verb.

  clearNeighbour: () =>
    set(state => { state.importedNeighbour = null; }),

  setNeighbourRelType: (relType) =>
    set(state => {
      state.neighbourRelType = relType;
      // Also sync to config for the generator
      state.config._neighbourRelType = relType;
    }),

  /** Import a neighbour from direct JSON (for the Neighbour System tab). */
  handleImportDirect: (json) => {
    if (!get().canUseNeighbour()) return false;
    let parsed;
    try { parsed = JSON.parse(json); } catch { return false; }
    const s = parsed?.settlement?.name ? parsed.settlement : parsed;
    if (!s?.name || !s?.tier) return false;

    set(state => {
      state.importedNeighbour = s;
      state.config._neighbourRelType = state.neighbourRelType;
    });
    return true;
  },
});
