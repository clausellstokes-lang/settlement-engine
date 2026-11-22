// V33-JOINPROBE pass 2, step 1: PROVE IT LIT ON A BIRTH. Reads the three dials and what birthConfig mints on this tree.
// node lit-receipt.mjs <worktree>
const W = process.argv[2];
const u = (p) => new URL(`file://${W}/${p}`).href;
const seat = await import(u('src/domain/seat/seatLaw.js'));
const circ = await import(u('src/domain/seat/seatCircumstances.js'));
const fort = await import(u('src/domain/fortune/fortuneLaw.js'));
const b = await import(u('src/domain/density/densityCreateBoundary.js'));
const out = {
  NEW_SETTLEMENT_SEAT_LAW_VERSION: seat.NEW_SETTLEMENT_SEAT_LAW_VERSION, HOLDER_SEAT_LAW_VERSION: seat.HOLDER_SEAT_LAW_VERSION,
  SEAT_CONTEST_LIT: circ.SEAT_CONTEST_LIT,
  NEW_SETTLEMENT_FORTUNE_LAW_VERSION: fort.NEW_SETTLEMENT_FORTUNE_LAW_VERSION, SIZE_RELATIVE_FORTUNE_LAW_VERSION: fort.SIZE_RELATIVE_FORTUNE_LAW_VERSION,
};
const cfg = b.birthConfig({ settType: 'town', _seatLawVersion: 1, _fortuneLawVersion: 1 });
out.birthConfig = Object.fromEntries(Object.entries(cfg).filter(([k]) => k.startsWith('_')));
console.log(JSON.stringify(out, null, 1));
