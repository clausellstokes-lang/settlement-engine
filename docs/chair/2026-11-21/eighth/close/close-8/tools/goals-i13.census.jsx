/** @vitest-environment node */
/**
 * BATCH item 5 (R24e (2): `goals` I-13 is its own finding, MEASURE ONLY): the `dealGoals` keying fault over a corpus. For every
 * birth of a plan, the I-13 test's own method (`tests/generators/people/goals.test.js`, 'removing a card leaves every card whose
 * draw read nothing of it byte-identical'): the dealt cards with goals cleared, the MIDDLE card removed (and its ties), both
 * dealt on `createPRNG(\`i13::${name}\`)`; a card is COMPARED where its receipt reads nothing of the removed card, neither deal
 * refused it, and no uncanny goal landed in the town; it is a FAULT where its goal then differs. No threshold on the card count
 * (the test's sample takes towns of 20 or more; here every town of 2 or more is read, the count by size said).
 * Env: GI_TREE, GI_PLAN, GI_OUT (jsonl).
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';

const TREE = String(process.env.GI_TREE); const PLAN = String(process.env.GI_PLAN); const OUT = String(process.env.GI_OUT);

test('goals I-13 over a plan', async () => {
  const pipe = await import(/* @vite-ignore */ `${TREE}/src/generators/generateSettlementPipeline.js`);
  const dens = await import(/* @vite-ignore */ `${TREE}/src/domain/density/densityCreateBoundary.js`);
  const { dealGoals, goalReceiptsOf } = await import(/* @vite-ignore */ `${TREE}/src/generators/people/goals.js`);
  const { createPRNG } = await import(/* @vite-ignore */ `${TREE}/src/kernel/prng.js`);
  await dens.loadGenerationLawPayloads();
  const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
  const out = [];
  for (const row of plan) {
    const s = pipe.generateSettlementPipeline(row.config, null, { seed: row.seed, customContent: {} });
    const cards = (s.npcs || []).filter((c) => !c.temporary).map((c) => ({ ...c, goal: null }));
    if (cards.length < 2) { out.push(JSON.stringify({ seed: row.seed, size: row.size, cards: cards.length, compared: 0, faults: [] })); continue; }
    const X = cards[Math.floor(cards.length / 2)];
    const ties = Array.isArray(s.relationships) ? s.relationships : [];
    const full = dealGoals(s, cards, ties, createPRNG(`i13::${s.name}`));
    const less = dealGoals(s, cards.filter((c) => c !== X), ties.filter((t) => t.from !== X.id && t.to !== X.id), createPRNG(`i13::${s.name}`));
    const rFull = new Map(goalReceiptsOf(full).map((r) => [r.id, r]));
    const rLess = new Map(goalReceiptsOf(less).map((r) => [r.id, r]));
    const byId = new Map(less.map((c) => [c.id, c]));
    const uncanny = [...rFull.values(), ...rLess.values()].some((r) => r.uncanny?.landed);
    let compared = 0; const faults = [];
    if (!uncanny) for (const c of full) {
      if (c.id === X.id) continue;
      const a = rFull.get(c.id); const b = rLess.get(c.id);
      if (!a || !b || a.refs.includes(X.id) || a.refused || b.refused) continue;
      compared += 1;
      if (JSON.stringify(byId.get(c.id)?.goal) !== JSON.stringify(c.goal)) faults.push({ id: c.id, removed: X.id, before: c.goal?.short, after: byId.get(c.id)?.goal?.short });
    }
    out.push(JSON.stringify({ seed: row.seed, size: row.size, cards: cards.length, uncanny, compared, faults }));
  }
  writeFileSync(OUT, `${out.join('\n')}\n`);
}, 1200000);
