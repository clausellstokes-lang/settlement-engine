// D-CH-r5 probe (F1 = SEAMS-r4-6 = D-PT-r4 ROUTES CH (2); RULINGS-ROUND4 A.19; PT §2.1/§6 R4-1):
// CH's CURED `paragon.banKeys` row carries the court's own window — `{ settlementId, episode, untilTick }` —
// and `banish`'s inverse, after RESTORING the prior edge at the door, RE-WRITES that door's key window where it
// is still ahead. The key list and the undo token are CH's DESIGN (unbuilt): modelled here over master's ONE
// exclusions writer (addExclusionEdge · liftExclusionEdges · normalizeExclusionEdges' strictest-wins merge),
// read-only. Usage: node banKeysWindow.mjs <master worktree>
const M = process.argv[2];
const L = await import(`${M}/src/domain/worldPulse/npcLedger.js`);
const id = 'wnpc_orrin'; const K = 'banishment_edict';
const edgeAt = (ws, door) => L.exclusionsOf(ws, id).find((e) => e.settlementId === door && e.kind === K) || null;
const fresh = (tick) => ({ ws: { tick, simulationRules: { npcConsequencesEnabled: true } }, keys: [] });

// ---- the model of CH §11 as cured in r5 ------------------------------------------------------------------
function mintEmergent(st, door, untilTick, episode) {        // a `person_banned` verdict `banned`
  const ws = L.addExclusionEdge(st.ws, id, { settlementId: door, kind: K, untilTick }).worldState;
  const prior = st.keys.find((k) => k.settlementId === door);
  // ONE key per door, the newer episode replacing; its window the STRICTER of the door's emergent windows
  const win = Math.max(untilTick, prior ? prior.untilTick : -Infinity);
  const keys = st.keys.filter((k) => k.settlementId !== door).concat([{ settlementId: door, episode, untilTick: win }]);
  return { ws, keys };
}
function banish(st, door) {                                  // the DM's `banish`: indefinite; the token keeps the PRIOR edge
  const prior = edgeAt(st.ws, door);
  const ws = L.addExclusionEdge(st.ws, id, { settlementId: door, kind: K, indefinite: true }).worldState;
  return { st: { ws, keys: st.keys }, undo: { door, prior } };
}
function undoBanishR5(st, undo, now) {                       // A.19 + R4-1: restore the prior, then the key's window if ahead
  let ws = L.liftExclusionEdges(st.ws, id, { settlementId: undo.door, kinds: [K] }).worldState;
  if (undo.prior) ws = L.addExclusionEdge(ws, id, undo.prior).worldState;
  const key = st.keys.find((k) => k.settlementId === undo.door);
  if (key && Number(key.untilTick) > now) ws = L.addExclusionEdge(ws, id, { settlementId: undo.door, kind: K, untilTick: key.untilTick }).worldState;
  // a key whose window has passed drops (PT l.115: "drops with its edge or once its own `untilTick` passes")
  const keys = st.keys.filter((k) => !(k.settlementId === undo.door && !(Number(k.untilTick) > now)));
  return { ws, keys };
}
function undoBanishR4(st, undo) {                            // round 4a's inverse: the prior edge only
  let ws = L.liftExclusionEdges(st.ws, id, { settlementId: undo.door, kinds: [K] }).worldState;
  if (undo.prior) ws = L.addExclusionEdge(ws, id, undo.prior).worldState;
  return { ws, keys: st.keys };
}
const view = (st, door, t) => ({ edge: edgeAt(st.ws, door), bannedAt: Object.fromEntries(t.map((x) => [x, L.isExcludedFrom(st.ws, id, door, x)])), keys: st.keys });

const out = {};
// F — the verifier's reverse order: banish (prior none) at 100 → the BENCH's window to 220 at 120 → undo at 130
{ let st = fresh(100); const b = banish(st, 'Kell'); st = b.st; st = mintEmergent(st, 'Kell', 220, 'kell-ep-3');
  out.F_merged = edgeAt(st.ws, 'Kell');
  out.F_r4 = view(undoBanishR4(st, b.undo), 'Kell', [150, 230]);
  out.F_r5 = view(undoBanishR5(st, b.undo, 130), 'Kell', [150, 230]); }
// S45 — the forward order: window to 300 at 100 → banish at 110 → undo at 120 (the prior window restored exactly)
{ let st = fresh(100); st = mintEmergent(st, 'Kell', 300, 'kell-ep-1'); const b = banish(st, 'Kell'); st = b.st;
  out.S45_r5 = view(undoBanishR5(st, b.undo, 120), 'Kell', [250, 310]); }
// G — reverse order, but the court's window has PASSED when the DM undoes: nothing re-written, the key drops
{ let st = fresh(100); const b = banish(st, 'Kell'); st = b.st; st = mintEmergent(st, 'Kell', 140, 'kell-ep-4');
  out.G_r5_undoAt200 = view(undoBanishR5(st, b.undo, 200), 'Kell', [210]); }
// H — no prior and no key: the undo leaves the door open
{ let st = fresh(100); const b = banish(st, 'Kell'); st = b.st;
  out.H_r5 = view(undoBanishR5(st, b.undo, 120), 'Kell', [130]); }
// I — a prior INDEFINITE (an authored ban) under a second banish and a later window: the prior indefinite stands
{ let st = fresh(100); st.ws = L.addExclusionEdge(st.ws, id, { settlementId: 'Kell', kind: K, indefinite: true }).worldState;
  const b = banish(st, 'Kell'); st = b.st; st = mintEmergent(st, 'Kell', 220, 'kell-ep-5');
  out.I_r5 = view(undoBanishR5(st, b.undo, 130), 'Kell', [500]); }
// J — two emergent windows at one door (re-ban): the key keeps the newer episode and the stricter window
{ let st = fresh(100); st = mintEmergent(st, 'Kell', 300, 'kell-ep-1'); st = mintEmergent(st, 'Kell', 200, 'kell-ep-2');
  out.J_edge = edgeAt(st.ws, 'Kell'); out.J_keys = st.keys; }
console.log(JSON.stringify(out, null, 1));
