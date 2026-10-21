// D-FS-r1 probe 1 (FS-r1-1 re-check): the cured demand term reads NO stock.
// The war-wages demand = upkeepCostOfBand(upkeepBandFor(deployment)) / gross, where gross = minted + stopped of the
// CUSTOM mint (computeTaxYield). By construction `stopped: gross - minted`, so minted + stopped = gross for ANY vault.
// Executed against master 81f1cd963's own treasury.js (READ-ONLY import).
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const T = await import(M + '/src/domain/worldPulse/treasury.js');
const { computeTaxYield, treasuryCapacity, upkeepBandFor, upkeepCostOfBand, coffersRead } = T;
const taxable = (extra = {}) => ({
  tier: 'town', institutions: [],
  economicState: { prosperity: 'Moderate', incomeSources: [
    { source: 'Agricultural Rents', percentage: 40, desc: 'rents' },
    { source: 'Toll Revenue', percentage: 30, desc: 'tolls' },
    { source: 'Military Levy', percentage: 20, desc: 'levy' },
    { source: 'Black Market Revenue', percentage: 10, desc: 'racket', isCriminal: true },
  ] },
  powerStructure: { governingName: 'The Seat', factions: [{ faction: 'The Seat', category: 'government', power: 40, isGoverning: true }] },
  ...extra,
});
const withCoin = (s, coin) => ({ ...s, economicState: { ...s.economicState, treasury: { coin, openedTick: 1, lastTick: 1, coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 } } } });
const host = { targetId: 'x', currentEffectiveStrength: 50 };
const wage = upkeepCostOfBand(upkeepBandFor(host));
const base = taxable();
const cap = treasuryCapacity(base);
console.log('capacity(town) =', cap, '; host band =', upkeepBandFor(host), 'wage/tick =', wage);
for (const rp of ['council', 'autocrat', 'criminal', 'merchant_league']) {
  const rows = [0, 100, 500, Math.floor(cap / 2), cap].map((coin) => {
    const y = computeTaxYield(withCoin(base, coin), { rulingPower: rp });
    const gross = y.minted + y.stopped;
    const cof = coffersRead(withCoin(base, coin), host, 100);
    return { coin, minted: y.minted, gross, demand01: +Math.min(1, wage / Math.max(1, gross)).toFixed(4), coffersScore01: +cof.score01.toFixed(4) };
  });
  const demands = new Set(rows.map((r) => r.demand01));
  const coffers = new Set(rows.map((r) => r.coffersScore01));
  console.log(rp, JSON.stringify(rows));
  console.log(`  ${rp}: distinct demand01 across vaults = ${demands.size} (stock-free iff 1); distinct coffers score01 = ${coffers.size} (the OLD term — a stock read iff > 1)`);
}
