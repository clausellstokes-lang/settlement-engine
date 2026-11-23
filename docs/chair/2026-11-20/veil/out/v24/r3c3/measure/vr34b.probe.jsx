// R3-CURE-3 MEASURE (the chair's ruling C of 10:21): criminalVeilSwitch VR34 (b)'s master town, read by the twin (applyVeil
// over resolveVeil, as the test reads it): the criminal power "Red hand" on each list, (0) the default, (1) the owner's
// switch ON (setCriminalVeil(..., false): every criminal part shown), (2) the switch on AND a house hidden elsewhere (the Mill
// hidden whole), (3) the switch on and the den alone hidden by hand, (4) a second criminal house ("Smugglers' cove") on the
// same town, the switch on (every criminal part shown) and the cove alone hidden by hand: a criminal house hidden ELSEWHERE. Out: RV9_OUT.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
it('VR34 (b) measure', async () => {
  const V = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const C = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const den = { kind: 'house', key: "Thieves' den", title: 'the fence', veiled: true };
  const town = { name: 'Redwick', tier: 'town',
    institutions: [{ id: 'inst-den', name: "Thieves' den", category: 'Criminal', desc: 'A den.' }, { id: 'inst-mill', name: 'Mill', category: 'Economy', desc: 'Grain.' }],
    npcs: [{ id: 'n1', name: 'Ada', role: 'Fence', corrupt: true, corruptionVector: 'bribes', secret: 'Owes the den.', institution: den }],
    powerStructure: { factions: [{ faction: 'Red hand', category: 'criminal', goals: 'Docks.', members: [] }] } };
  const master = { ...town, powerStructure: { factions: [{ faction: 'Red hand', name: 'Red hand', category: 'criminal', goals: 'Docks.' }] },
    factions: [{ name: 'Red hand', dominantCategory: 'criminal', members: [{ id: 'n1', name: 'Ada', role: 'Fence' }] }] };
  const m = V.curateModelFor(master, []); const d = V.defaultVeilFor(master);
  const on = C.setCriminalVeil([], d, false, undefined, m);
  const idOf = (h) => V.CARD_KINDS.institution.idOf(h);
  const mill = `card:institution:${idOf(master.institutions[1])}`; const denA = `card:institution:${idOf(master.institutions[0])}`;
  const read = (deltas) => { const o = V.applyVeil(master, V.resolveVeil(d, deltas));
    return { houses: (o.institutions || []).map((h) => h.name), powerStructure: o.powerStructure?.factions ?? null, factions: o.factions ?? null, switch: C.criminalSwitchStateOf(d, deltas, C.presentCriminalGroupings(master), m) }; };
  const out = { defaults: d.map((x) => x.address), switchOnDeltas: on,
    s0_default: read([]), s1_switchOn: read(on), s2_switchOn_millHidden: read([...on, { address: mill, hidden: true }]),
    s3_switchOn_denHidden: read([...on, { address: denA, hidden: true }]) };
  const m2 = { ...master, institutions: [...master.institutions, { id: 'inst-cove', name: "Smugglers' cove", category: 'Criminal', desc: 'A cove.' }] };
  const mm2 = V.curateModelFor(m2, []); const d2 = V.defaultVeilFor(m2); const on2 = C.setCriminalVeil([], d2, false, undefined, mm2);
  const cove = `card:institution:${idOf(m2.institutions[2])}`;
  const r2 = (deltas) => { const o = V.applyVeil(m2, V.resolveVeil(d2, deltas));
    return { houses: (o.institutions || []).map((h) => h.name), powerStructure: o.powerStructure?.factions ?? null, factions: o.factions ?? null, switch: C.criminalSwitchStateOf(d2, deltas, C.presentCriminalGroupings(m2), mm2) }; };
  out.s4_cove_switchOn = r2(on2); out.s4_cove_switchOn_coveHidden = r2([...on2, { address: cove, hidden: true }]);
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
});
