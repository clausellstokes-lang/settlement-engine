// PA-C-1 receipt: what the plane's own memory law leaves of a seeded grudge, and whether a pastRef survives ensure.
const M = process.argv[2];
const ev = await import(M + '/src/domain/worldPulse/relationshipEvolution.js');
const rs = await import(M + '/src/domain/worldPulse/relationshipState.js');
const edge = { id: 'e1', from: 'a', to: 'b', relationshipType: 'rival' };
const seeded = rs.ensureRelationshipState(edge, { relationshipType: 'rival', resentment: 0.95, trust: 0.05, pastRef: 'pf:test' });
console.log('ensure keeps pastRef?', 'pastRef' in seeded, '| resentment', seeded.resentment, '| baseline rival', JSON.stringify(rs.RELATIONSHIP_DEFAULTS ? rs.RELATIONSHIP_DEFAULTS.rival : ev.RELATIONSHIP_DEFAULTS?.rival));
for (const [label, resolver] of [['generational', null], ['long', () => 3], ['undying', () => Infinity]]) {
  let ws = { relationshipStates: { e1: seeded } };
  const marks = {};
  for (let t = 1; t <= 260; t++) {
    ws = ev.relaxRelationshipStates(ws, resolver);
    if ([1, 4, 13, 26, 52, 260].includes(t)) marks[t] = Number(ws.relationshipStates.e1.resentment.toFixed(4));
  }
  console.log(label.padEnd(13), JSON.stringify(marks));
}
