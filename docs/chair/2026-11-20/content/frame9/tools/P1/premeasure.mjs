// FRAME-9 · P1 pre-measure: the occupied kind of B7's pool (24 towns, seeds b7-occupied-<tier>-<i>), born at the worktree;
// for each town the stored face, the first free lodging keeper (crisisPage.js :: lodgingKeeperOf's rule, occupier members
// excluded) with the house word, and the first free records-trade person (TROUBLE_MATTER.occupation_legacy.trade).
const R = process.argv[2] + '/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { LODGING_HOUSE, TROUBLE_MATTER } = await import(R + 'domain/tension/sideArchetypes.js');
const { castHash } = await import(R + 'domain/crisis/crisisCast.js');
const { isHideableHouse } = await import(R + 'domain/people/cardVeil.js');
const RECORDS = TROUBLE_MATTER.occupation_legacy.trade;
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const str = (v) => (typeof v === 'string' ? v : '');
const rows = [];
for (const tier of TIERS) for (let i = 0; i < 4; i++) {
  const seed = `b7-occupied-${tier}-${i}`;
  const s = generateSettlementPipeline({ settType: tier, stressType: 'occupied' }, null, { seed, customContent: {} });
  const e = (s.stress || []).find((x) => x.type === 'occupied');
  const held = new Set((e?.cast?.roles || []).filter((r) => r.kind === 'npc' && r.role !== 'face').map((r) => r.id));
  const occ = new Set((s.powerStructure?.factions || []).filter((f) => /occupation|occupying/i.test(f.faction || f.name || '')).map((f) => f.faction || f.name));
  const roster = (s.npcs || []).filter((n) => n && !n.temporary && !n.ousted && str(n.name))
    .filter((n) => !(n.memberships || []).some((m) => occ.has(m.power)))
    .map((n, k) => ({ n, k })).sort((a, b) => ((b.n.power || 0) - (a.n.power || 0)) || (a.k - b.k)).map(({ n }) => n);
  const inst = (n) => (n.institution && typeof n.institution === 'object' ? n.institution : {});
  const words = (n) => [str(n.role), str(n.title), str(inst(n).key), str(inst(n).family)].join(' | ');
  const houseOf = (n) => str(inst(n).key).replace(/\s*\([^)]*\)\s*$/, '').toLowerCase();
  const keeper = roster.find((n) => !held.has(n.id) && LODGING_HOUSE.test(words(n)) && !!houseOf(n));
  const trade = roster.find((n) => !held.has(n.id) && n !== keeper && RECORDS.test(words(n)));
  const face = (e?.cast?.roles || []).find((r) => r.role === 'face');
  const hk = keeper ? (s.institutions || []).find((x) => x.name === inst(keeper).key) : null;
  rows.push([seed, face ? `${face.name} (${face.reason})` : '-',
    keeper ? `${keeper.name}, ${keeper.title || keeper.role} · house "${inst(keeper).key}" -> "${houseOf(keeper)}"${hk && isHideableHouse(hk) ? ' HIDEABLE' : ''}` : '-',
    trade ? `${trade.name}, ${trade.title || trade.role} [${str(inst(trade).key)}]` : '-',
    castHash(seed, 'occupied', 'face:outsider').toFixed(3), castHash(seed, 'occupied', 'face:trade').toFixed(3)].join(' | '));
}
console.log(rows.join('\n'));
