/**
 * neighbourSlice — Neighbour relationships, imported neighbour, cross-settlement effects.
 *
 * Premium-gated: only premium users can use the neighbour system.
 * Holds the currently imported neighbour (for next generation),
 * relationship type, and cross-settlement link data.
 */

export const RELATIONSHIP_TYPES = [
  { id: 'neutral',       label: 'Neutral',       color: '#888' },
  { id: 'trade_partner', label: 'Trade Partner',  color: '#2a7a2a' },
  { id: 'allied',        label: 'Allied',         color: '#2a4a8a' },
  { id: 'patron',        label: 'Patron',         color: '#6a4a8a' },
  { id: 'client',        label: 'Client',         color: '#8a6a2a' },
  { id: 'rival',         label: 'Rival',          color: '#8a4a2a' },
  { id: 'cold_war',      label: 'Cold War',       color: '#6a2a2a' },
  { id: 'hostile',        label: 'Hostile',        color: '#8b1a1a' },
];

export const createNeighbourSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  importedNeighbour:  null,          // settlement JSON to feed into next generation
  neighbourRelType:   'neutral',     // relationship type for next link
  neighbourNetwork:   [],            // array of { settlementId, relType, npcContacts[] }

  // ── Actions ────────────────────────────────────────────────────────────────
  importNeighbour: (settlement) => {
    if (!get().canUseNeighbour()) return false;
    set(state => { state.importedNeighbour = settlement; });
    return true;
  },

  clearNeighbour: () =>
    set(state => { state.importedNeighbour = null; }),

  setNeighbourRelType: (relType) =>
    set(state => {
      state.neighbourRelType = relType;
      // Also sync to config for the generator
      state.config._neighbourRelType = relType;
    }),

  addNeighbourLink: (link) =>
    set(state => { state.neighbourNetwork.push(link); }),

  removeNeighbourLink: (settlementId) =>
    set(state => {
      state.neighbourNetwork = state.neighbourNetwork.filter(
        l => l.settlementId !== settlementId
      );
    }),

  setNeighbourNetwork: (network) =>
    set(state => { state.neighbourNetwork = network; }),

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
