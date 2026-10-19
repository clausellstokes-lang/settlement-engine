// D-PR-r5 probe: PR-X5 — the r4 construction (share over the points ACTUALLY drawn) with the r5 stamp rule:
// the stamp is written WHENEVER riders are kept (`kept > 0`), `points` the strength actually drawn (0 where nothing could be drawn).
function drawn(off, pts, kept) {
  const take = Math.min(off, pts); const cap = take > 0 ? off - take : off;
  const share = take > 0 ? (off > 0 ? cap / off : 0) : 1;
  const stampR4 = take > 0 ? `{riders: ${kept}, points: ${take}}` : 'absent';
  const stampR5 = kept > 0 ? `{riders: ${kept}, points: ${take}}` : 'absent';
  return { take, cap, share, stampR4, stampR5 };
}
const rows = [[0, 6, 3], [5, 12, 4], [40, 6, 3], [40, 0, 0], [0, 0, 0]];
for (const [off, pts, kept] of rows) {
  const d = drawn(off, pts, kept);
  console.log(`offensive ${off} · draw ${pts} · kept ${kept} → drawn ${d.take} · drawnCap.offensive ${d.cap} · drawShare01 ${d.share} · stamp r4 ${d.stampR4} · stamp r5 ${d.stampR5} · the kept bound has a carrier: ${kept > 0 ? (d.stampR5 !== 'absent') : 'n/a (none kept)'}`);
}
