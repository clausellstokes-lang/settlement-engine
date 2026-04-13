/**
 * mapSlice — Azgaar Fantasy Map Generator integration state.
 *
 * Manages the iframe bridge state, selected burg data, supply chain
 * overlay toggles, and burg-to-settlement mappings.
 *
 * The FMG iframe communicates via postMessage. This slice handles
 * incoming messages and outgoing commands.
 */

export const createMapSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  mapLoaded:          false,        // true once FMG iframe signals ready
  mapSeed:            null,         // Azgaar map seed for reproducibility
  selectedBurg:       null,         // currently selected burg from the map
  burgSettlementMap:  {},           // { burgId → settlementId } linking map burgs to our settlements
  activeOverlays:     [],           // supply chain overlay IDs currently visible on map

  // All burgs received from the map (lightweight: id, name, x, y, population, state, culture)
  burgList:           [],

  // ── Actions ────────────────────────────────────────────────────────────────
  setMapLoaded: (loaded) =>
    set(state => { state.mapLoaded = loaded; }),

  setMapSeed: (seed) =>
    set(state => { state.mapSeed = seed; }),

  setSelectedBurg: (burg) =>
    set(state => { state.selectedBurg = burg; }),

  clearSelectedBurg: () =>
    set(state => { state.selectedBurg = null; }),

  setBurgList: (burgs) =>
    set(state => { state.burgList = burgs; }),

  // ── Burg ↔ Settlement linking ──────────────────────────────────────────────
  linkBurgToSettlement: (burgId, settlementId) =>
    set(state => { state.burgSettlementMap[burgId] = settlementId; }),

  unlinkBurg: (burgId) =>
    set(state => { delete state.burgSettlementMap[burgId]; }),

  getSettlementForBurg: (burgId) => {
    return get().burgSettlementMap[burgId] || null;
  },

  // ── Supply chain overlays (premium) ────────────────────────────────────────
  toggleOverlay: (chainId) =>
    set(state => {
      if (!get().canUseMapChains()) return;
      const idx = state.activeOverlays.indexOf(chainId);
      if (idx === -1) {
        state.activeOverlays.push(chainId);
      } else {
        state.activeOverlays.splice(idx, 1);
      }
    }),

  clearOverlays: () =>
    set(state => { state.activeOverlays = []; }),

  // ── postMessage bridge protocol ────────────────────────────────────────────

  /**
   * Handle incoming message from FMG iframe.
   * Call this from the window 'message' event listener.
   */
  handleMapMessage: (data) => {
    if (!data || !data.type) return;

    switch (data.type) {
      case 'fmg:ready':
        set(state => { state.mapLoaded = true; });
        break;

      case 'fmg:seed':
        set(state => { state.mapSeed = data.seed; });
        break;

      case 'fmg:burgSelected':
        set(state => { state.selectedBurg = data.burg; });
        break;

      case 'fmg:burgList':
        set(state => { state.burgList = data.burgs || []; });
        break;

      default:
        break;
    }
  },

  /**
   * Send a command to the FMG iframe.
   * The iframe ref must be passed in (not stored in Zustand).
   */
  sendMapCommand: (iframeRef, command) => {
    if (!iframeRef?.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(command, '*');
  },

  /**
   * Convert an Azgaar burg into a settlement config preset.
   * Maps burg properties to generator config fields.
   */
  burgToConfig: (burg) => {
    if (!burg) return null;

    // Population → tier
    const pop = burg.population || 500;
    let settType = 'village';
    if (pop <= 60)       settType = 'thorp';
    else if (pop <= 240) settType = 'hamlet';
    else if (pop <= 900) settType = 'village';
    else if (pop <= 5000)  settType = 'town';
    else if (pop <= 25000) settType = 'city';
    else                   settType = 'metropolis';

    // Port → trade route
    let tradeRouteAccess = 'road';
    if (burg.port)   tradeRouteAccess = 'port';
    // River proximity would come from cell data via postMessage

    // Culture mapping (Azgaar culture name → our culture key)
    // This is approximate; exact mapping depends on Azgaar's culture naming
    const cultureName = (burg.cultureName || '').toLowerCase();
    let culture = 'random_culture';
    const cultureMap = {
      'germanic': 'germanic', 'norse': 'norse', 'celtic': 'celtic',
      'latin': 'latin', 'greek': 'greek', 'arabic': 'arabic',
      'slavic': 'slavic', 'asian': 'east_asian', 'steppe': 'steppe',
    };
    for (const [key, val] of Object.entries(cultureMap)) {
      if (cultureName.includes(key)) { culture = val; break; }
    }

    return {
      settType,
      population: pop,
      tradeRouteAccess,
      culture,
      customName: burg.name || '',
      // Capital → boost government/military priorities
      ...(burg.capital ? { priorityMilitary: 70, priorityEconomy: 60 } : {}),
    };
  },
});
