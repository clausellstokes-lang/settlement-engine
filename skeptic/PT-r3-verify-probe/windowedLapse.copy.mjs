// D-PT-r3 probe for PT-V1: (E) re-run the verifier's convicting case under the r2b rule, then
// (A-D) the cured rule — "lapse ONLY an edge that is still WINDOWED; an indefinite edge is the
// DM's word, lifted only by PARDON_PARTY" — on master 81f1cd963's own writers; (F) the banKeys
// cap rule (WINDOWED keys only, the oldest evicts first). The cured rule is MODELLED here (the
// design is unbuilt); the writers, the merge and the gate read are master's.
const M = process.argv[2];
const L = await import(`${M}/src/domain/worldPulse/npcLedger.js`);
const KIND = 'banishment_edict';
const base = () => ({ tick: 100, simulationRules: { npcConsequencesEnabled: true } });
const add = (ws, edge) => L.addExclusionEdge(ws, 'party', { kind: KIND, ...edge }).worldState;
const edgeAt = (ws, sid) => L.exclusionsOf(ws, 'party').find((e) => e.settlementId === sid && e.kind === KIND) || null;
// the cured mint rule: one key per door (a re-ban replaces it with the newer episode); the cap
// counts keys whose edge is WINDOWED only — the oldest windowed key evicts first; a key whose door
// stands indefinite (the DM's) is outside the cap
const isWindowedKey = (ws, k) => { const e = edgeAt(ws, k.settlementId); return !!e && e.indefinite !== true; };
const capKeys = (ws, keys) => {
  const windowed = keys.filter((k) => isWindowedKey(ws, k));
  const over = Math.max(0, windowed.length - 8);
  const evict = new Set(windowed.slice(0, over));
  return keys.filter((k) => !evict.has(k));
};
const mintEmergent = (ws, keys, sid, untilTick, episode) => {
  const next = add(ws, { settlementId: sid, untilTick });
  const k = [...keys.filter((x) => x.settlementId !== sid), { settlementId: sid, episode }];
  return { ws: next, keys: capKeys(next, k) };
};
// the cured lapse rule at a seat change
const lapse = (ws, keys, sid) => {
  const e = edgeAt(ws, sid);
  const rest = keys.filter((k) => k.settlementId !== sid);
  if (!e) return { ws, keys: rest, action: 'key dropped (no edge)' };
  if (e.indefinite === true) return { ws, keys, action: "nothing lifted; key kept inert (indefinite = the DM's word)" };
  const r = L.liftExclusionEdges(ws, 'party', { settlementId: sid, kinds: [KIND] });
  return { ws: r.worldState, keys: rest, action: 'windowed edge lifted' };
};
const out = {};
// (E) the convicting receipt, r2b's rule: lift whatever stands at the door
{ let ws = add(base(), { settlementId: 'Kell', untilTick: 152 }); ws = add(ws, { settlementId: 'Kell', indefinite: true });
  const r = L.liftExclusionEdges(ws, 'party', { settlementId: 'Kell' });
  out.E_r2bRule = { merged: edgeAt(ws, 'Kell'), stillBannedAtKell: L.isExcludedFrom(r.worldState, 'party', 'Kell', 160) }; }
// (A) emergent then the DM's BAN_PARTY, then Kell's seat changes
{ let s = mintEmergent(base(), [], 'Kell', 152, 'ep1'); const keysAfterMint = s.keys.length;
  let ws = add(s.ws, { settlementId: 'Kell', indefinite: true });
  const l = lapse(ws, s.keys, 'Kell');
  out.A_emergentThenDm = { keysAfterMint, merged: edgeAt(ws, 'Kell'), action: l.action, keysAfter: l.keys.length, stillBannedAtKell: L.isExcludedFrom(l.ws, 'party', 'Kell', 160) }; }
// (B) the DM's ban first, then an emergent verdict at the same door
{ let ws = add(base(), { settlementId: 'Kell', indefinite: true });
  const s = mintEmergent(ws, [], 'Kell', 152, 'ep1');
  const l = lapse(s.ws, s.keys, 'Kell');
  out.B_dmThenEmergent = { merged: edgeAt(s.ws, 'Kell'), keysRecorded: s.keys.length, lapseAction: l.action, stillBannedAfterSeatChange: L.isExcludedFrom(l.ws, 'party', 'Kell', 160), stillBannedAtKell: L.isExcludedFrom(s.ws, 'party', 'Kell', 160) }; }
// (C) emergent alone: the seat change lifts it (the owner's "a new ruler at a succession")
{ const s = mintEmergent(base(), [], 'Kell', 152, 'ep1'); const l = lapse(s.ws, s.keys, 'Kell');
  out.C_emergentAlone = { action: l.action, keysAfter: l.keys.length, stillBannedAtKell: L.isExcludedFrom(l.ws, 'party', 'Kell', 120) }; }
// (D) emergent at Kell + the DM's at Tolle; Kell's seat changes: only Kell lifts
{ let s = mintEmergent(base(), [], 'Kell', 152, 'ep1'); let ws = add(s.ws, { settlementId: 'Tolle', indefinite: true });
  const l = lapse(ws, s.keys, 'Kell');
  out.D_twoDoors = { action: l.action, bannedKell: L.isExcludedFrom(l.ws, 'party', 'Kell', 120), bannedTolle: L.isExcludedFrom(l.ws, 'party', 'Tolle', 120) }; }
// (F) the cap: 9 emergent bans at 9 doors; WINDOWED keys only, the oldest evicts first; its edge stays (lapses at untilTick)
{ let ws = base(); let keys = [];
  { const s = mintEmergent(ws, keys, 'D0', 150, 'ep0'); ws = add(s.ws, { settlementId: 'D0', indefinite: true }); keys = s.keys; }
  for (let i = 1; i <= 9; i += 1) { const s = mintEmergent(ws, keys, `T${i}`, 152 + i, `ep${i}`); ws = s.ws; keys = s.keys; }
  out.F_cap = { keys: keys.map((k) => k.settlementId), windowedKeys: keys.filter((k) => isWindowedKey(ws, k)).length, indefiniteKeyKeptOutsideCap: keys.some((k) => k.settlementId === 'D0'), evictedDoorStillWindowedBanned: L.isExcludedFrom(ws, 'party', 'T1', 120), evictedDoorOpensAtUntil: !L.isExcludedFrom(ws, 'party', 'T1', 153) }; }
console.log(JSON.stringify(out, null, 1));
