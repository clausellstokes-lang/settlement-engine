// D-WS-r3 probe 3 (WS-r1-13 under RULINGS-P6 E.2): `levy_thin` reads ONLY A DEPLETION.
// The read: spent01 = conscripted / (conscripted + roomNow), where conscripted is the home's own banked share
// on the deployment (`deploymentReturn.js` "const conscripted = Math.max(0, deployedPopulation - leviedTotal);")
// and roomNow = max(0, homePopNow - WAR_CONSCRIPT_POP_FLOOR) (WC's `conscriptionRoomOf` car). With no births or
// deaths beside the conscription, conscripted + roomNow = the room at the host's march, so spent01 is the share
// of the men the home could spare at the march that the war has taken. Constants are read from master's text.
import { readFileSync } from 'node:fs';
const M = process.argv[2];
const whc = readFileSync(M + '/src/domain/worldPulse/warHomeCosts.js', 'utf8');
const sv = readFileSync(M + '/src/domain/worldPulse/warSiegeVerdict.js', 'utf8');
const num = (src, name) => Number((src.match(new RegExp(`const ${name} = ([0-9.]+)`)) || [])[1]);
const RATE = num(whc, 'WAR_CONSCRIPT_RATE_PER_TICK'), FLOOR = num(whc, 'WAR_CONSCRIPT_POP_FLOOR'), MAXAGE = num(sv, 'SIEGE_MAX_AGE');
console.log(`landed: WAR_CONSCRIPT_RATE_PER_TICK ${RATE} · WAR_CONSCRIPT_POP_FLOOR ${FLOOR} · SIEGE_MAX_AGE ${MAXAGE}`);
const CUT = 0.5; // WAY_LEVY_SPENT, DRAFT: "most" of the men the home could spare
console.log(`WAY_LEVY_SPENT (DRAFT) ${CUT}`);
for (const homeStart of [60, 150, 250, 260, 300, 400, 600, 800, 1000, 2000, 5000, 20000]) {
  let pop = homeStart, conscripted = 0, tCut = null, exact = true;
  const roomStart = Math.max(0, homeStart - FLOOR);
  for (let t = 1; t <= 400; t++) {
    const room = Math.max(0, pop - FLOOR);
    const sent = Math.min(Math.round(pop * RATE), room); // the landed lines, verbatim arithmetic
    pop -= sent; conscripted += sent;
    const roomNow = Math.max(0, pop - FLOOR);
    const denom = conscripted + roomNow;
    const spent = denom > 0 ? conscripted / denom : null; // null: the home could spare no one ⇒ never thin
    if (denom !== roomStart) exact = false;
    if (tCut === null && spent !== null && spent >= CUT) tCut = t;
  }
  const atMax = (() => { let p = homeStart, c = 0; for (let t = 1; t <= MAXAGE; t++) { const r = Math.max(0, p - FLOOR); const s = Math.min(Math.round(p * RATE), r); p -= s; c += s; } const d = c + Math.max(0, p - FLOOR); return d > 0 ? (c / d).toFixed(3) : 'none (room 0 at the march)'; })();
  console.log(`home at the march ${String(homeStart).padStart(5)} · room ${String(roomStart).padStart(5)} · spent01 after ${MAXAGE} ticks ${atMax} · ticks to reach the cut ${tCut === null ? 'never' : tCut} · denominator == room at the march every tick: ${exact}`);
}
