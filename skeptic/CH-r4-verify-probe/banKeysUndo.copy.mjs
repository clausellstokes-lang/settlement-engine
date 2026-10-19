// D-CH-r4 probe (RU-3 · RULINGS-ROUND4 A.19): CH's `banKeys` rules adopted from PT l.115 (one key per door; the cap
// counts WINDOWED keys only, the oldest windowed evicting; a key at a door now INDEFINITE is inert, outside the cap,
// and drops with its edge) and the DM's `banish` inverse that RESTORES the prior edge at that door exactly (A.19).
// The `banKeys` list and the undo token are CH's DESIGN (unbuilt) — modelled here over master's ONE exclusions
// writer (addExclusionEdge · liftExclusionEdges · normalizeExclusionEdges' strictest-wins merge), read-only.
// Usage: node banKeysUndo.mjs <master worktree>
const M = process.argv[2];
const L = await import(`${M}/src/domain/worldPulse/npcLedger.js`);
const id = 'wnpc_h'; const K = 'banishment_edict';
const edgeAt = (ws, door) => L.exclusionsOf(ws, id).find((e) => e.settlementId === door && e.kind === K) || null;
const CAP = 8;
// --- the model of CH §11's cured key rules ------------------------------------------------------------
function mintEmergent(st, door, untilTick, episode) {          // a `person_banned` verdict `banned`
  const ws = L.addExclusionEdge(st.ws, id, { settlementId: door, kind: K, untilTick }).worldState;
  let keys = st.keys.filter((k) => k.settlementId !== door);  // ONE key per door: the newer episode replaces
  keys.push({ settlementId: door, episode });
  // the cap counts WINDOWED keys only: evict the oldest windowed past eight
  const windowed = () => keys.filter((k) => { const e = edgeAt(ws, k.settlementId); return e && e.indefinite !== true; });
  while (windowed().length > CAP) { const oldest = windowed()[0]; keys = keys.filter((k) => k !== oldest); }
  return { ws, keys };
}
function banish(st, door) {                                    // the DM's `banish`: indefinite; token keeps the PRIOR edge
  const prior = edgeAt(st.ws, door);
  const ws = L.addExclusionEdge(st.ws, id, { settlementId: door, kind: K, indefinite: true }).worldState;
  return { st: { ws, keys: st.keys }, undo: { door, prior } };
}
function undoBanishCured(st, undo) {                           // A.19: restore the prior edge exactly
  let ws = L.liftExclusionEdges(st.ws, id, { settlementId: undo.door, kinds: [K] }).worldState;
  if (undo.prior) ws = L.addExclusionEdge(ws, id, undo.prior).worldState;
  return { ws, keys: st.keys };
}
function undoBanishNaive(st, undo) {                           // "lift the edges it wrote" (after the merge: one edge)
  return { ws: L.liftExclusionEdges(st.ws, id, { settlementId: undo.door, kinds: [K] }).worldState, keys: st.keys };
}
function seatChangeAt(st, door) {                              // the court's own pardon: lift ONLY a still-windowed edge
  const e = edgeAt(st.ws, door); const key = st.keys.find((k) => k.settlementId === door);
  if (!key) return { ...st, lifted: false };
  if (!e || e.indefinite === true) return { ...st, lifted: false };   // indefinite-door key is INERT: kept, nothing lifted
  const ws = L.liftExclusionEdges(st.ws, id, { settlementId: door, kinds: [K] }).worldState;
  return { ws, keys: st.keys.filter((k) => k !== key), lifted: true };
}
const counts = (st) => ({ keys: st.keys.length, windowedKeys: st.keys.filter((k) => { const e = edgeAt(st.ws, k.settlementId); return e && e.indefinite !== true; }).length });
// --- the run -------------------------------------------------------------------------------------------
let st = { ws: { tick: 100, simulationRules: { npcConsequencesEnabled: true } }, keys: [] };
const doors = ['A','B','C','D','E','F','G','H','I','J'];
st = mintEmergent(st, 'C', 300, 'ep-C1');
const b = banish(st, 'C'); st = b.st;                          // C now INDEFINITE (merged); its key inert
for (const d of doors.filter((d) => d !== 'C')) st = mintEmergent(st, d, 300, 'ep-' + d);
const afterNine = counts(st); const keptC = st.keys.some((k) => k.settlementId === 'C');
const evicted = doors.filter((d) => d !== 'C' && !st.keys.some((k) => k.settlementId === d));
st = mintEmergent(st, 'J', 320, 'ep-J2');                      // a re-ban at door J: one key per door
const reBanJ = st.keys.filter((k) => k.settlementId === 'J');
const sc1 = seatChangeAt(st, 'C');                             // seat change at the indefinite door: nothing lifts, key stays
const naive = undoBanishNaive(st, b.undo); const cured = undoBanishCured(st, b.undo);
const sc2 = seatChangeAt(cured, 'C');                          // after the cured undo, the restored windowed ban lifts
// prior ABSENT and prior INDEFINITE cases
let s2 = { ws: { tick: 100, simulationRules: { npcConsequencesEnabled: true } }, keys: [] };
const b2 = banish(s2, 'X'); const u2 = undoBanishCured(b2.st, b2.undo);
let s3 = { ws: L.addExclusionEdge({ tick: 100, simulationRules: { npcConsequencesEnabled: true } }, id, { settlementId: 'Y', kind: K, indefinite: true }).worldState, keys: [] };
const b3 = banish(s3, 'Y'); const u3 = undoBanishCured(b3.st, b3.undo);
console.log(JSON.stringify({
  afterNineMoreBans: afterNine, inertKeyKeptAtC: keptC, evictedOldestWindowed: evicted,
  reBanAtJ_keys: reBanJ, seatChangeAtIndefiniteDoor: { lifted: sc1.lifted, keyKept: sc1.keys.some((k) => k.settlementId === 'C'), banned: L.isExcludedFrom(sc1.ws, id, 'C', 200) },
  undoNaive: { edgeAtC: edgeAt(naive.ws, 'C'), banned: L.isExcludedFrom(naive.ws, id, 'C', 200) },
  undoCured: { edgeAtC: edgeAt(cured.ws, 'C'), banned: L.isExcludedFrom(cured.ws, id, 'C', 200) },
  seatChangeAfterCuredUndo: { lifted: sc2.lifted, banned: L.isExcludedFrom(sc2.ws, id, 'C', 200) },
  priorAbsent_undo: { edgeAtX: edgeAt(u2.ws, 'X') }, priorIndefinite_undo: { edgeAtY: edgeAt(u3.ws, 'Y') },
}, null, 0));
