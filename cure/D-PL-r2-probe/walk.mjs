// D-PL-r2 probe for PL-r1-6 (re-cure): the proposed walk rule over the REAL foreignSeatOf (read-only import).
// Rule under test: a cycle that contains a matured-rung step is ONE link read two ways -> the walk follows the
// contract (the edge), the rung's subject is a lord in chains (root, class 'occupied'); only an all-edge cycle is
// a polity_circle. vassalageSeatsOf (PL-r1-7's additive export) does not exist on master; foreignSeatOf's own
// edge view stands in for it here (one candidate per settlement in these worlds, so the choice is identical).
const W = process.argv[2];
const { foreignSeatOf } = await import(`${W}/src/domain/rulingPowerSeat.js`);
const MEMBER = new Set(['vassal_edge', 'vassal_edge_treaty_floor', 'occupation_rung_vassalized']);
function walk(ws, snap, start, cap = 12) {
  const path = [start]; const steps = []; const at = new Map([[start, 0]]);
  let cur = start;
  for (let d = 0; d < cap; d += 1) {
    const v = foreignSeatOf(ws, snap, cur);
    if (!v || v.regime !== 'vassalage' || !MEMBER.has(v.basis)) return { rootId: cur, path, cls: 'paramount_or_member', receipt: null };
    const next = String(v.patronSettlementId);
    const step = { from: cur, to: next, basis: v.basis };
    if (at.has(next)) {
      const cycle = [...steps.slice(at.get(next)), step];
      // A rung step BACKED by a sworn edge to the same patron is an edge step (the contract agrees).
      const backed = (st) => Object.values(ws.relationshipStates || {}).some((r) => r?.relationshipType === 'vassal' && String(r.vassalSaveId) === st.from && String(r.overlordSaveId) === st.to);
      const rung = cycle.find((s) => s.basis === 'occupation_rung_vassalized' && !backed(s));
      if (!rung) return { rootId: null, path, cls: null, receipt: 'polity_circle' };
      const cut = path.indexOf(rung.from);
      return { rootId: rung.from, path: path.slice(0, cut + 1), cls: 'occupied (lord in chains)', receipt: null };
    }
    steps.push(step); path.push(next); at.set(next, path.length - 1); cur = next;
  }
  return { rootId: null, path, cls: null, receipt: 'depth_cap' };
}
const byId = (ids) => new Map(ids.map((id) => [id, { id, settlement: {} }]));
const rs = (over, vas) => ({ relationshipType: 'vassal', overlordSaveId: over, vassalSaveId: vas, leverage: 0.6, dependency: 0.5, pactStrength: 0.4, fear: 0.3, resentment: 0.1 });
// World 1 (the verifier's): H is M's overlord by edge; M holds H at the matured rung (contest; the edge not relabeled).
const w1 = { occupations: { H: { occupierId: 'M', state: 'vassalized', resistance: 0, sinceTick: 1, stateHeld: 0, lastTick: 9 } }, relationshipStates: { H__M: rs('H', 'M') } };
const s1 = { regionalGraph: { edges: [{ id: 'H__M', from: 'H', to: 'M', relationshipType: 'vassal', status: 'confirmed' }] }, settlements: [{ id: 'H' }, { id: 'M' }], byId: byId(['H', 'M']) };
// World 1b: a third member L sworn to M (H <- M <- L), H held by M at the rung.
const w1b = { occupations: w1.occupations, relationshipStates: { H__M: rs('H', 'M'), L__M: rs('M', 'L') } };
const s1b = { regionalGraph: { edges: [...s1.regionalGraph.edges, { id: 'L__M', from: 'M', to: 'L', relationshipType: 'vassal', status: 'confirmed' }] }, settlements: [{ id: 'H' }, { id: 'M' }, { id: 'L' }], byId: byId(['H', 'M', 'L']) };
// World 2: an all-edge three-cycle A <- B <- C <- A (P2 stays a circle).
const w2 = { relationshipStates: { A__B: rs('A', 'B'), B__C: rs('B', 'C'), A__C: rs('C', 'A') } };
const s2 = { regionalGraph: { edges: [{ id: 'A__B', from: 'A', to: 'B', relationshipType: 'vassal', status: 'confirmed' }, { id: 'B__C', from: 'B', to: 'C', relationshipType: 'vassal', status: 'confirmed' }, { id: 'A__C', from: 'C', to: 'A', relationshipType: 'vassal', status: 'confirmed' }] }, settlements: [{ id: 'A' }, { id: 'B' }, { id: 'C' }], byId: byId(['A', 'B', 'C']) };
// World 3: H <- M <- L by edges; L holds H at the matured rung AND an L-H edge re-stamped L overlord (backed rung).
const w3 = { occupations: { H: { occupierId: 'L', state: 'vassalized', resistance: 0, sinceTick: 1, stateHeld: 0, lastTick: 9 } }, relationshipStates: { H__M: rs('H', 'M'), L__M: rs('M', 'L'), H__L: rs('L', 'H') } };
const s3 = { regionalGraph: { edges: [...s1b.regionalGraph.edges, { id: 'H__L', from: 'L', to: 'H', relationshipType: 'vassal', status: 'confirmed' }] }, settlements: s1b.settlements, byId: byId(['H', 'M', 'L']) };
// World 4: as W3 but no L-H edge at all (an edgeless matured rung; unbacked).
const w4 = { occupations: w3.occupations, relationshipStates: { H__M: rs('H', 'M'), L__M: rs('M', 'L') } };
for (const [name, ws, sn, ids] of [['W1 H<->M mixed', w1, s1, ['H', 'M']], ['W1b H<-M<-L, H held by M', w1b, s1b, ['H', 'M', 'L']], ['W2 all-edge A<-B<-C<-A', w2, s2, ['A', 'B', 'C']], ['W3 L holds H at the rung, L-H edge re-stamped (backed)', w3, s3, ['H', 'M', 'L']], ['W4 L holds H at the rung, no L-H edge (unbacked)', w4, s1b, ['H', 'M', 'L']]]) {
  console.log(`== ${name}`);
  for (const id of ids) { const v = foreignSeatOf(ws, sn, id); console.log(`  foreignSeatOf(${id}) -> ${v ? `${v.patronSettlementId} via ${v.basis}` : 'none'}`); }
  for (const id of ids) console.log(`  walk(${id}) ->`, JSON.stringify(walk(ws, sn, id)));
}
