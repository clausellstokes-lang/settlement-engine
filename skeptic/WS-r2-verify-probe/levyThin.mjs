// V-WS-r2 probe 3 (WS-r1-13 / D.7): levy_thin's half (ii) "the conscription room is spent ... below one
// season's draw", over the landed lines (warHomeCosts.js :: applyHomeWarCosts, quoted):
//   "const room = Math.max(0, homePop - WAR_CONSCRIPT_POP_FLOOR);"
//   "const sent = Math.min(Math.round(homePop * WAR_CONSCRIPT_RATE_PER_TICK), room);"
//   "const WAR_CONSCRIPT_RATE_PER_TICK = 0.006;" "const WAR_CONSCRIPT_POP_FLOOR = 250;"
// SEASON = 13 weekly ticks (DRAFT reading of "one season's draw"; the claim does not depend on it below 250).
const RATE = 0.006, FLOOR = 250, SEASON = 13;
for (const homePop of [60, 100, 150, 200, 249, 250, 260, 270, 275, 300, 400, 1000, 5000, 20000]) {
  const room = Math.max(0, homePop - FLOOR);
  const draw = Math.round(homePop * RATE);
  const sent = Math.min(draw, room);
  const seasonDraw = draw * SEASON;
  const iiHolds = room < seasonDraw;
  // continuous deployed ticks needed to conscript this home down to where (ii) holds (no births, no returns)
  let p = homePop, t = 0; while (!(Math.max(0, p - FLOOR) < Math.round(p * RATE) * SEASON) && t < 5000) { p -= Math.min(Math.round(p * RATE), Math.max(0, p - FLOOR)); t++; }
  console.log(`homePop ${String(homePop).padStart(5)} · room ${String(room).padStart(5)} · draw/tick ${draw} · sent/tick ${sent} · (ii) holds AT WAR'S START: ${iiHolds} · ticks of continuous conscription to reach (ii): ${t}`);
}
