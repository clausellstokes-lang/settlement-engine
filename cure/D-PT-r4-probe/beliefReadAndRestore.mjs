// D-PT-r4 probe (read-only imports of master 81f1cd963; nothing edited; the design is unbuilt, so the
// cured rules are MODELLED on master's own writers and readers).
// (1) A.8: enemy_in_service = readBeliefRelationship(court, served, ws, relationshipTypeBetween(graph, ws, court, served)) === 'hostile'
//     and at_war_with_employer = atOpenWar(graph, court, served) read first (P49).
// (2) A.19: BAN_PARTY's undo token stores the PRIOR edge(s) at each door it touched; the inverse lifts the
//     door and re-adds the prior edge verbatim (the landed PARDON-undo idiom, npcDmVerbs.js :: undoDmVerb).
//     PARDON_PARTY's undo re-adds the lifted edges verbatim (the landed idiom) and restores the dropped banKeys.
// (3) the verifier's convicting case re-run: the round-3 inverse ("lifts exactly the edges it wrote").
const M = process.argv[2];
const B = await import(`${M}/src/domain/worldPulse/beliefMap.js`);
const E = await import(`${M}/src/domain/roads/embassyHazard.js`);
const L = await import(`${M}/src/domain/worldPulse/npcLedger.js`);
const out = {};

// ---- (1) the one belief read ----
const wsBelief = (label) => ({ tick: 100, spatialCanonVersion: 1, simulationRules: { infoMode: 'full' },
  spatialLedgers: { beliefMaps: { Kell: { seat: { Ashford: { allianceLabel: label, strengthBand: 'modest', confidence01: 0.6 } } } } } });
const wsOmni = () => ({ tick: 100, simulationRules: { infoMode: 'omniscient' } });
const graph = (rt, front = false) => ({ edges: [{ from: 'Ashford', to: 'Kell', relationshipType: rt }],
  channels: front ? [{ type: 'war_front', status: 'confirmed', from: 'Ashford', to: 'Kell' }] : [] });
const gateReasonA8 = (g, w, court, served) => {
  if (E.atOpenWar(g, court, served)) return 'at_war_with_employer';
  const truthType = E.relationshipTypeBetween(g, w, court, served);
  if (B.readBeliefRelationship(court, served, w, truthType) === 'hostile') return 'enemy_in_service';
  return null;
};
const cases = [
  ['belief hostile, truth rival, no front', wsBelief('hostile'), graph('rival')],
  ['belief allied, truth hostile, no front', wsBelief('allied'), graph('hostile')],
  ['belief hostile, truth hostile, no front (P49)', wsBelief('hostile'), graph('hostile')],
  ['belief hostile, truth hostile, LIVE FRONT (P49 war arm)', wsBelief('hostile'), graph('hostile', true)],
  ['omniscient, truth hostile, no front', wsOmni(), graph('hostile')],
  ['omniscient, truth rival, no front', wsOmni(), graph('rival')],
];
out.A8 = {};
for (const [name, w, g] of cases) {
  out.A8[name] = { beliefsActive: B.beliefsActive(w), reason: gateReasonA8(g, w, 'Kell', 'Ashford'),
    landed_atWarWith: E.atWarWith(g, w, 'Kell', 'Ashford'), atOpenWar: E.atOpenWar(g, 'Kell', 'Ashford') };
}

// ---- (2)/(3) the ban's undo ----
const KIND = 'banishment_edict';
const base = () => ({ tick: 100, simulationRules: { npcConsequencesEnabled: true } });
const add = (w, edge) => L.addExclusionEdge(w, 'party', { kind: KIND, ...edge }).worldState;
const doorEdges = (w, door) => L.exclusionsOf(w, 'party').filter((e) => e.settlementId === door && e.kind === KIND);
// BAN_PARTY over a list of doors: the token carries each door's PRIOR edges verbatim.
const banParty = (w, doors) => {
  const token = { verb: 'BAN_PARTY', prior: doors.map((d) => ({ settlementId: d, edges: doorEdges(w, d) })) };
  let next = w; for (const d of doors) next = add(next, { settlementId: d, indefinite: true });
  return { worldState: next, token };
};
const undoBanParty = (w, token) => {
  let next = w;
  for (const { settlementId, edges } of token.prior) {
    next = L.liftExclusionEdges(next, 'party', { settlementId, kinds: [KIND] }).worldState;
    for (const e of edges) next = L.addExclusionEdge(next, 'party', e).worldState;
  }
  return next;
};
const snap = (w) => JSON.stringify(L.exclusionsOf(w, 'party'));
{ // A: prior windowed (the court's emergent ban) at Kell
  const w0 = add(base(), { settlementId: 'Kell', untilTick: 152 });
  const { worldState: w1, token } = banParty(w0, ['Kell']);
  const w2 = undoBanParty(w1, token);
  out.A19_A_priorWindowed = { before: L.exclusionsOf(w0, 'party'), afterBan: L.exclusionsOf(w1, 'party'),
    afterUndo: L.exclusionsOf(w2, 'party'), exact: snap(w2) === snap(w0),
    bannedAt120: L.isExcludedFrom(w2, 'party', 'Kell', 120), bannedAt160: L.isExcludedFrom(w2, 'party', 'Kell', 160) };
  // the round-3 inverse ("lifts exactly the edges it wrote") on the same world: the verifier's conviction
  const r3 = L.liftExclusionEdges(w1, 'party', { settlementId: 'Kell', kinds: [KIND] }).worldState;
  out.r3Inverse_rerun = { afterInverse: L.exclusionsOf(r3, 'party'), bannedAt120: L.isExcludedFrom(r3, 'party', 'Kell', 120),
    priorBannedAt120: L.isExcludedFrom(w0, 'party', 'Kell', 120) };
}
{ // B: prior absent
  const w0 = base(); const { worldState: w1, token } = banParty(w0, ['Kell']); const w2 = undoBanParty(w1, token);
  out.A19_B_priorAbsent = { afterUndo: L.exclusionsOf(w2, 'party'), exact: snap(w2) === snap(w0) };
}
{ // C: prior indefinite (the DM banned Kell before)
  const w0 = add(base(), { settlementId: 'Kell', indefinite: true });
  const { worldState: w1, token } = banParty(w0, ['Kell']); const w2 = undoBanParty(w1, token);
  out.A19_C_priorIndefinite = { afterUndo: L.exclusionsOf(w2, 'party'), exact: snap(w2) === snap(w0) };
}
{ // D: a REGION ban over Kell (prior windowed), Tolle (prior absent), Ashford (prior indefinite); Merewick untouched (windowed)
  let w0 = add(base(), { settlementId: 'Kell', untilTick: 152 });
  w0 = add(w0, { settlementId: 'Ashford', indefinite: true });
  w0 = add(w0, { settlementId: 'Merewick', untilTick: 140 });
  const { worldState: w1, token } = banParty(w0, ['Kell', 'Tolle', 'Ashford']); const w2 = undoBanParty(w1, token);
  out.A19_D_region = { before: L.exclusionsOf(w0, 'party'), afterUndo: L.exclusionsOf(w2, 'party'), exact: snap(w2) === snap(w0) };
}
{ // E: PARDON_PARTY's inverse — the landed idiom: the lifted edges verbatim, re-added; banKeys restored beside
  let w0 = add(base(), { settlementId: 'Kell', untilTick: 152 });
  w0 = add(w0, { settlementId: 'Tolle', indefinite: true });
  const banKeys0 = [{ settlementId: 'Kell', episode: 'Kell:seat:3' }];
  const lift = L.liftExclusionEdges(w0, 'party', { settlementId: 'Kell', kinds: [KIND] });
  const token = { verb: 'PARDON_PARTY', edges: lift.lifted, banKeys: banKeys0.filter((k) => k.settlementId === 'Kell') };
  const banKeys1 = banKeys0.filter((k) => k.settlementId !== 'Kell');
  let w2 = lift.worldState; for (const e of token.edges) w2 = L.addExclusionEdge(w2, 'party', e).worldState;
  const banKeys2 = [...banKeys1, ...token.banKeys];
  out.A19_E_pardonInverse = { afterPardon: L.exclusionsOf(lift.worldState, 'party'), afterUndo: L.exclusionsOf(w2, 'party'),
    exact: snap(w2) === snap(w0), banKeysRestored: JSON.stringify(banKeys2) === JSON.stringify(banKeys0) };
}
{ // F: a court's verdict at the door AFTER the DM's BAN_PARTY (the window folds into the indefinite edge);
  // the DM then undoes BAN_PARTY alone. Round-4 rule: the banKeys row carries the emergent window (`untilTick`),
  // so the inverse lifts the door, re-writes the prior edge from the token, then re-writes the key's window if it
  // is still ahead (the one writer's strictest-wins merge).
  const w0 = base();                                                  // no prior edge at Kell
  const { worldState: w1, token } = banParty(w0, ['Kell']);           // DM: indefinite
  const w2 = add(w1, { settlementId: 'Kell', untilTick: 160 });       // later verdict: folds into indefinite
  const banKeys = [{ settlementId: 'Kell', episode: 'Kell:seat:3', untilTick: 160 }];
  let w3 = undoBanParty(w2, token);
  const tokenOnly = L.exclusionsOf(w3, 'party');
  for (const k of banKeys) if (k.untilTick > 120) w3 = L.addExclusionEdge(w3, 'party', { kind: KIND, settlementId: k.settlementId, untilTick: k.untilTick }).worldState;
  out.A19_F_laterVerdict = { afterLaterVerdict: L.exclusionsOf(w2, 'party'), afterUndoTokenOnly: tokenOnly,
    afterUndoWithKeyWindow: L.exclusionsOf(w3, 'party'), courtBanStillAt150: L.isExcludedFrom(w3, 'party', 'Kell', 150),
    openAt170: !L.isExcludedFrom(w3, 'party', 'Kell', 170) };
}
console.log(JSON.stringify(out, null, 1));
