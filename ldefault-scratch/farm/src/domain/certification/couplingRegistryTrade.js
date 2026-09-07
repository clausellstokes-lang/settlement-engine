/**
 * domain/certification/couplingRegistryTrade.js — the TRADE volume's coupling rows.
 *
 * The first non-WAR leaf of the CW-0w family, and the reason slice 1 widened the
 * couplingId shape: the registry's own gate was locked against every volume but war, so
 * the FIRST row a TRADE wave wrote would have reddened the registry test. It does not.
 *
 * A coupling row records the foreign read, the receipt field that makes it reviewable,
 * and the counterforce reading the same evidence. THE SAME-COMMIT OBLIGATION
 * (DESIGN_FP_COUPLINGS.md §0.3, made structural by
 * tests/lint/couplingInclusion.walker.test.js): the registry grows in the same change
 * that lands each cross-layer read — this file's row and the tradeWar.js seam it
 * describes are one commit.
 *
 * Pure data only: no state, writer, clock, or randomness. Every row constant is
 * re-exported by couplingRegistry.js, so no consumer imports this file directly.
 *
 * @enforced-by tests/domain/couplingRegistry.test.js
 */

import { couplingRow } from './couplingRegistrySchema.js';

/** @typedef {import('./couplingRegistrySchema.js').CouplingRegistryRow} CouplingRegistryRow */

/**
 * TR-1 / CPL-1 TRADE→WAR. THE CASUS COMMERCII'S ONE WAR SEAM.
 *
 * A defeated trade incumbent that already holds a typed, receipted commercial grievance
 * against the winner reaches for the sword marginally sooner. The counterforce is the
 * SAME ledger read with the other sign — the standing partnership that argues against
 * cutting a tie worth keeping — which is why both addresses resolve through one evidence
 * factory (`makeCommercialPressureRead`), the WR-3 idiom.
 *
 * WHERE THE RECEIPT LIVES, AND WHY IT IS NOT THE OUTCOME LINE. The escalation deposit
 * prints the ledger's casus receipt into its own `reasons`, and the first draft of this
 * row addressed it there — `evaluateTradeWar(...).outcomes[].{reasons}`. That is a
 * RETURNED READ, and CW-0w's receipt sampler freezes the count of rows that can only be
 * addressed that way as SHRINK-ONLY debt: a new row hiding behind a returned address
 * raises the debt and reds, which is the tripwire working exactly as designed. The row
 * was re-aimed rather than the frozen list widened. The persisted ledger row IS the
 * evidence that makes this read reviewable — the outcome line is the consumer's echo of
 * it — so the address is state-rooted, samplable, and truer to what the coupling reads.
 *
 * WHAT THIS ROW DELIBERATELY DOES NOT CLAIM. It declares no `kinds`: the read moves an
 * existing war-pressure deposit's probability and prints the ledger's own casus receipt
 * into that outcome's reasons. It mints no Herald kind of its own, so declaring one would
 * be the row asserting a channel the engine does not fill. TR-1's nineteen Herald kinds
 * are the LEDGER's, not this coupling's.
 *
 * AND IT NEVER MINTS A CASUS BELLI (J-TR-2). The commercial ledger is evidence for war's
 * existing taxonomy through tradeWar's existing intent deposit; it does not write into
 * warReasons, and the war volume's own casus set is untouched by TRADE.
 */
export const TR1_SEVERANCE_PRESSURE_COUPLING = couplingRow({
  couplingId: 'CPL-1.TRADE_TO_WAR.TR-1.severance_pressure',
  pairId: 'CPL-1',
  direction: 'TRADE→WAR',
  read: 'src/domain/worldPulse/commercialReasons.js#makeCommercialPressureRead.severancePressureOf',
  receiptField: 'spatialLedgers.commercialReasons[...][].{type,magnitude01,receipt}',
  counterforce: 'src/domain/worldPulse/commercialReasons.js#makeCommercialPressureRead.partnershipRestraintOf',
  flags: ['warLayerEnabled', 'casusCommerciiEnabled'],
  owningVolume: 'TRADE',
  owningWave: 'TR-1',
  intendedDesk: 'trade',
});

/** The TR-1 cross-layer reads, in decision-flow order. */
export const TR1_CASUS_COMMERCII_COUPLINGS = Object.freeze([
  TR1_SEVERANCE_PRESSURE_COUPLING,
]);
