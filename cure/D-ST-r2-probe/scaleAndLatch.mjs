// D-ST-r2 probe — arithmetic on the volume's own constants (ST-r2-7, ST-r2-9, ST-r2-22) — no code import needed
const F = { unfunded: 0.15, meagre: 0.45, funded: 0.8, lavish: 1.0 }, Q = { sound: 1, worn: 0.5, ruined: 0 }, D = { at_hand: 1, nearby: 0.5, distant: 0.2 };
const M = { thin: 0.2, modest: 0.4, capable: 0.6, strong: 0.8, formidable: 1.0 }, Qu = { sound: 1, worn: 0.65, ruined: 0.35 };
const literal = (base, s) => base * s, deviation = (base, s) => 1 + (base - 1) * s;
console.log('(ST-r2-7) tied gate row BASE 0.8 (monsterRaiderGate fort):');
for (const f of Object.keys(F)) for (const d of ['at_hand', 'distant']) { const s = F[f] * Q.sound * D[d]; console.log(`  ${f.padEnd(8)} ${d.padEnd(8)} literal ${literal(0.8, s).toFixed(3)}  deviation ${deviation(0.8, s).toFixed(3)}`); }
console.log('(ST-r2-7) untied gate row BASE_H 1.3 (monsterRaiderGate den):');
for (const m of Object.keys(M)) { const s = M[m] * Qu.sound * D.at_hand; console.log(`  ${m.padEnd(10)} literal ${literal(1.3, s).toFixed(3)}  deviation ${deviation(1.3, s).toFixed(3)}`); }
const BASE_H = { fortification: 1.0, watchtower: 0.30, tower: 0.25, waystation: 0.45, crossing: 0.45, resource: 0.20, harbour_works: 0.45, ruin: 0.40 };
console.log('(ST-r2-9) untied presence feeder at at_hand, formidable, best quality (ruin fixed ruined) vs ENTER_THRESHOLD 0.55:');
for (const [k, b] of Object.entries(BASE_H)) { const q = k === 'ruin' ? Qu.ruined : Qu.sound; const p = b * M.formidable * q * D.at_hand; const tip = (T) => T + p * (1 - T); console.log(`  ${k.padEnd(14)} p=${p.toFixed(3)} latches alone: ${p > 0.55}  tips a town at T=0.30: ${tip(0.30) > 0.55}  at T=0.45: ${tip(0.45) > 0.55}`); }
console.log('(ST-r2-22) Kell Prosperous rank 0.8 → band', 0.8 < 0.2 ? 'unfunded' : 0.8 < 0.45 ? 'meagre' : 0.8 < 0.8 ? 'funded' : 'lavish', '→ siteDefense 18 × F × Q =', 18 * F.lavish * Q.sound);
console.log('(M50 parity) raid 0.60 − min(0.25, fort 0.20 + riders 0.15) =', (0.60 - Math.min(0.25, 0.20 + 0.15)).toFixed(2), '< 0.55 (the counterforce working; RULINGS-ROUND2b)');
