// V-WS-r3: levy_thin half (ii) under a home that SHRINKS by a non-war cause (calamity exodus).
// Landed arithmetic (warHomeCosts.js :: applyHomeWarCosts): room = max(0, homePop - 250); sent = min(round(homePop*0.006), room).
// WS §5.1: spent01 = conscripted / (conscripted + roomNow); holds at >= WAY_LEVY_SPENT (0.5).
const FLOOR = 250, RATE = 0.006, CUT = 0.5;
function run(homePop0, exodusAt, exodus, ticks) {
  let pop = homePop0, conscripted = 0; const roomAtMarch = Math.max(0, homePop0 - FLOOR); const rows = [];
  for (let t = 1; t <= ticks; t++) {
    const room = Math.max(0, pop - FLOOR); const sent = Math.min(Math.round(pop * RATE), room);
    conscripted += sent; pop -= sent;
    if (t === exodusAt) pop -= exodus; // calamityKernel.js "Fled the calamity." / populationDynamics "Population loss from cumulative settlement pressure."
    const roomNow = Math.max(0, pop - FLOOR); const spent = conscripted / Math.max(1, conscripted + roomNow);
    rows.push({ t, conscripted, roomNow, spent: +spent.toFixed(3), trueShareOfRoomAtMarch: +(conscripted / Math.max(1, roomAtMarch)).toFixed(3), holds: spent >= CUT });
  }
  return { homePop0, roomAtMarch, exodusAt, exodus, last: rows[rows.length - 1], firstHold: rows.find((r) => r.holds) || null };
}
for (const [h, at, ex] of [[400, 5, 0], [400, 5, 140], [600, 8, 300], [1000, 10, 700]]) console.log(JSON.stringify(run(h, at, ex, 12)));
