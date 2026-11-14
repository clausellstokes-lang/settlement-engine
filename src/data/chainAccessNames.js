/**
 * data/chainAccessNames.js — THE NAME A CHAIN TAKES ON AN ACCESS ITS RESOURCE'S ROW REFUSES (COHERENCE-AGREE-6,
 * REVIEW-AGREE-2 F1; the chair's ruling of 2026-11-12, the words the chair's and the owner's to veto).
 *
 * The crossroads toll runs on every hub access: a river town with a toll bridge and a port with a customs house do
 * take tolls. On an access `RESOURCE_DATA.crossroads_position.requires` refuses, the toll prints the entry below.
 * The chain's own catalogue entry carries this table (`supplyChainData.js`, `crossroads_trade.namesByAccess`); it
 * lives here, a leaf with no import, so the page's leaf (`domain/display/chainPrintName.js`) reads it without the
 * chains table, which stays out of the first-paint graph.
 */
export const CHAIN_NAMES_BY_ACCESS = Object.freeze({
  crossroads_trade: Object.freeze({
    river: Object.freeze({ label: 'River Toll', resource: 'River traffic' }),
    port: Object.freeze({ label: 'Harbour Dues', resource: 'Harbour traffic' }),
  }),
});
