#!/usr/bin/env node
/**
 * E8b · THE SUCCESSOR (the chair's G29 (2), G30): on made records, the successor of every card that holds a bound tell or the
 * bound long goal, built by each tree's own `successorNpc` from that tree's own born card; the two successors must be
 * byte-equal (the base copies the drawn they-form; E8b copies the held form of its card's own-form line). A MEASURE.
 * Usage: node e8b-successor.mjs <treeBefore> <treeAfter> <seed>…    exit 1 on any difference.
 */
const [A, B, ...SEEDS] = process.argv.slice(2);
const load = async (T) => {
  const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
  const { successorNpc } = await import(`${T}/src/domain/worldPulse/successorNpc.js`);
  await loadGenerationLawPayloads();
  return (seed) => {
    const s = generateSettlementPipeline(birthConfig({ settType: seed.match(/^dp-(\w+)-\d+$/)[1] }), null, { seed, customContent: {} });
    return s.npcs.filter((c) => /speaks of \w+ in the third person|whatever the cost to \w+/.test(`${c?.personality?.tell} ${c?.goal?.long}`))
      .map((c) => ({ id: c.id, ownTell: c.personality?.tell, ownLong: c.goal?.long, successor: JSON.stringify(successorNpc(c)) }));
  };
};
const [before, after] = [await load(A), await load(B)];
let n = 0; let bad = 0;
for (const seed of SEEDS) {
  const x = before(seed); const y = after(seed);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    n++;
    const same = x[i]?.successor === y[i]?.successor;
    if (!same) bad++;
    if (i < 2 || !same) console.log(`${seed} ${y[i]?.id}: card tell before "${x[i]?.ownTell}" / after "${y[i]?.ownTell}"; successor tell ${same ? 'EQUAL' : 'DIFFERS'}: ${JSON.parse(y[i]?.successor || '{}').personality?.tell}${y[i]?.ownLong ? `; goal.long → ${JSON.parse(y[i].successor).goal?.long}` : ''}`);
  }
}
console.log(`e8b-successor: ${n} successors built on both trees; differing ${bad}`);
process.exit(bad ? 1 : 0);
