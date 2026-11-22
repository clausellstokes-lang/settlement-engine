// FRAME-9 · F4 under the lit seat law (the chair's question of 2026-11-22 08:54 UTC): births the calm pool (frame6/tools/pool.mjs's
// seeds and rule, 55 a size) at a tree, each through that tree's own `birthConfig` (so its dials decide the laws), and reads,
// for the pool's five W4 towns and every calm place that is W4 there, `factions[].captureState` and
// `powerStructure.criminalCaptureState`, and what F4's rule prints. Read-only. argv: <tree src/ (trailing slash)> <out.json>
import fs from 'node:fs';
const [R, OUT] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig } = await import(R + 'domain/density/densityCreateBoundary.js');
const { castTroubleFrame, HALL_TAKEN } = await import(R + 'domain/tension/troubleCast.js');
const { CAPTURE_RUNG_LABELS } = await import(R + 'data/people/dmPowerLines.js');
const FIVE = ['frame-calm-town-20', 'frame-calm-town-80', 'frame-calm-city-12', 'frame-calm-city-49', 'frame-calm-metropolis-51'];
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = []; let calm = 0; let tried = 0; let laws = null;
const birth = (tier, seed) => generateSettlementPipeline(birthConfig({ settType: tier }), null, { seed, customContent: {} });
const read = (seed, tier, s, inPool) => {
  const ps = s.powerStructure || {};
  const taken = (ps.factions || []).filter((f) => f && f.faction && HALL_TAKEN.includes(String(f.captureState))).map((f) => `${f.faction}=${f.captureState}`);
  const rung = typeof ps.criminalCaptureState === 'string' ? ps.criminalCaptureState : null;
  const strain = castTroubleFrame(s)?.strain ?? null;
  const prints = strain === 'W4' && taken.length > 0 && HALL_TAKEN.includes(rung)
    ? `The ruling seat is ${CAPTURE_RUNG_LABELS[rung][0].toLowerCase()}${CAPTURE_RUNG_LABELS[rung].slice(1)}.` : null;
  return { seed, tier, inPool, calm: !(Array.isArray(s.stress) ? s.stress.length : s.stress), strain, seatLaw: s._seatLawVersion ?? s.config?._seatLawVersion ?? null, rung, taken, agree: (taken.length > 0) === HALL_TAKEN.includes(rung), prints };
};
for (const tier of TIERS) {
  let got = 0; let i = 0;
  while (got < 55) {
    const seed = `frame-calm-${tier}-${i++}`; tried++;
    const s = birth(tier, seed);
    if (!laws) laws = { seat: s._seatLawVersion ?? s.config?._seatLawVersion, fortune: s._fortuneLawVersion ?? s.config?._fortuneLawVersion };
    const st = Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []);
    if (st.length) { if (FIVE.includes(seed)) rows.push(read(seed, tier, s, false)); continue; }
    calm++; got++;
    const r = read(seed, tier, s, true);
    if (FIVE.includes(seed) || r.strain === 'W4' || !r.agree) rows.push(r);
  }
}
for (const seed of FIVE) if (!rows.some((r) => r.seed === seed)) { const tier = seed.split('-')[2]; rows.push(read(seed, tier, birth(tier, seed), false)); }
fs.writeFileSync(OUT, JSON.stringify({ tried, calm, laws, rows }, null, 1));
console.log(JSON.stringify({ tried, calm, laws, w4: rows.filter((r) => r.strain === 'W4').length, printing: rows.filter((r) => r.prints).length, disagree: rows.filter((r) => !r.agree).length }));
for (const r of rows) console.log(JSON.stringify(r));
