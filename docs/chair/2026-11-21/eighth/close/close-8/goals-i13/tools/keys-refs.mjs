// GOALS-I13 measure: measure-keys' per-field hashes, plus the full I-13 deal's goal receipts' refs (sum, and unique per receipt).
import { measure as keys } from '/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/tools/measure-keys.mjs';
export async function measure(town, { tree }) {
  const { dealGoals, goalReceiptsOf } = await import(/* @vite-ignore */ `${tree}/src/generators/people/goals.js`);
  const { createPRNG } = await import(/* @vite-ignore */ `${tree}/src/kernel/prng.js`);
  const cards = (town.npcs || []).filter((c) => !c.temporary).map((c) => ({ ...c, goal: null }));
  const full = cards.length ? dealGoals(town, cards, Array.isArray(town.relationships) ? town.relationships : [], createPRNG(`i13::${town.name}`)) : [];
  const rs = goalReceiptsOf(full);
  return { ...keys(town), refs: rs.reduce((n, r) => n + new Set(r.refs).size, 0), receipts: rs.length };
}
