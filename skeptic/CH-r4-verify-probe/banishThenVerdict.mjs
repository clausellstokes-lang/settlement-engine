// V-CH-r4 probe (A.19 · D-PT-r4 ROUTES CH (2)): CH §11's CURED `banish` inverse ("the undo token stores the edge that
// stood at that door before it ... re-adds it") in the REVERSE order of S45: the DM's `banish` FIRST, a court's
// `person_banned` window minted AFTER it at the same door (strictest-wins folds it into the indefinite edge), then the
// DM undoes the `banish`. CH's `banKeys` row is `{ settlementId, episode }` (no window), so the inverse has only the
// token's prior edge. Master's ONE exclusions writer (npcLedger.js), read-only. Usage: node banishThenVerdict.mjs <master>
const M = process.argv[2];
const L = await import(`${M}/src/domain/worldPulse/npcLedger.js`);
const id = 'wnpc_orrin'; const K = 'banishment_edict'; const door = 'Kell';
const edgeAt = (ws) => L.exclusionsOf(ws, id).find((e) => e.settlementId === door && e.kind === K) || null;
let ws = { tick: 100, simulationRules: { npcConsequencesEnabled: true } };
let keys = [];
// 1. the DM's banish at Kell (tick 100): the token keeps the PRIOR edge at that door (none)
const token = { door, prior: edgeAt(ws) };
ws = L.addExclusionEdge(ws, id, { settlementId: door, kind: K, indefinite: true }).worldState;
// 2. tick 120: Kell's BENCH, hearing a harmful deed, mints a person_banned window to tick 220 (a_year-ish)
ws = L.addExclusionEdge(ws, id, { settlementId: door, kind: K, untilTick: 220 }).worldState;
keys = keys.filter((k) => k.settlementId !== door).concat([{ settlementId: door, episode: 'kell-seat-ep-3' }]);
const afterVerdict = edgeAt(ws);
// 3. tick 130: the DM undoes the banish — CH §11's cured inverse: lift the door's edge, re-add the token's prior
let undone = L.liftExclusionEdges(ws, id, { settlementId: door, kinds: [K] }).worldState;
if (token.prior) undone = L.addExclusionEdge(undone, id, token.prior).worldState;
// CH L3: "every key drops when its edge lifts ... lapses or is pardoned"
const keysAfter = edgeAt(undone) ? keys : keys.filter((k) => k.settlementId !== door);
console.log(JSON.stringify({
  tokenPrior: token.prior, afterVerdict, afterUndo: edgeAt(undone),
  bannedAt150_courtSentenceStillRunning: L.isExcludedFrom(undone, id, door, 150),
  keysAfter,
  verdict: L.isExcludedFrom(undone, id, door, 150) ? 'court ban survives' : "court's later ban LOST by the DM's undo",
}, null, 1));
