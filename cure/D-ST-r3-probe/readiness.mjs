// D-ST-r3 probe: A.10's ONE value siteReadiness01 = F × Q (× ½ for a person or faith holder of a fortification),
// its word on SITE_READINESS (DRAFT thresholds), and the siege's defender value siteReadiness01 × SITE_DEFENSE_CEILING[kind]
// (= siteDefenseOf's latent term for a fortification at hand). Constants are ST §3.2's DRAFT factors.
const F = { unfunded: 0.15, meagre: 0.45, funded: 0.8, lavish: 1.0 };
const Q = { sound: 1, worn: 0.5, ruined: 0 };
const CEIL = { fortification: 18, watchtower: 6 };
const word = (r) => (r >= 0.75 ? 'at_strength' : r >= 0.40 ? 'manned' : r >= 0.20 ? 'sparse' : r > 0 ? 'skeleton' : 'hollow');
const STRENGTH_FLOORS = [[78, 'formidable'], [60, 'strong'], [42, 'capable'], [26, 'modest'], [0, 'thin']];
const armyWord = (v) => STRENGTH_FLOORS.find(([f]) => v >= f)[1];
console.log('funding  quality  readiness  word         keep(18)  tower(6)  [r2 garrisonBandOf 100·F·Q → army word]');
for (const [fk, fv] of Object.entries(F)) for (const [qk, qv] of Object.entries(Q)) {
  const r = +(fv * qv).toFixed(4);
  console.log(`${fk.padEnd(8)} ${qk.padEnd(8)} ${r.toFixed(3).padStart(9)}  ${word(r).padEnd(12)} ${(r * CEIL.fortification).toFixed(1).padStart(8)}  ${(r * CEIL.watchtower).toFixed(1).padStart(8)}  [${(100 * r).toFixed(0)} → ${armyWord(100 * r)}]`);
}
console.log('one scale: the siege value and the word both read siteReadiness01; the word set shares no token with STRENGTH_BANDS (thin · modest · capable · strong · formidable)');
