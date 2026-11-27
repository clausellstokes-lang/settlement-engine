import { createReadStream } from 'node:fs'; import readline from 'node:readline';
const L = await import(new URL('../lib.mjs', import.meta.url).href); await L.loadGenerationLawPayloads();
const CELL = { C: ['dp-hamlet-117', 'dp-village-51', 'dp-village-54', 'dp-village-76'], V: ['dp-hamlet-100', 'dp-hamlet-139', 'dp-village-76'] };
const K2 = 'Every fish that comes in is counted'; const C7 = 'The catch is too small to feed everyone';
for (const [c, seeds] of Object.entries(CELL)) {
  for await (const l of readline.createInterface({ input: createReadStream(`${c}.jsonl`) })) {
    const j = JSON.parse(l); if (!seeds.includes(j.seed)) continue;
    for (const variant of ['append', 'prepend']) {
      const T = structuredClone(j.town); const fr = T.economicState.foodSecurity.foodRecord;
      fr.foodSources = variant === 'append' ? [...fr.foodSources, 'fish'] : ['fish', ...fr.foodSources];
      const f = L.factsOf(T); const cap = L.deriveAllCapacities(T);
      const s = L.deriveDailyLife(T, { audience: 'owner' }).slots;
      const fare = String(s.food_culture?.text || ''); const dawn = String(s.dawn_work?.text || '');
      console.log(c, j.seed, variant, 'sources', JSON.stringify(fr.foodSources), 'famine', L.atomHolds('food: = famine', f), 'band', cap.capacities.food_production.band, 'fish', L.atomHolds('fish', f), 'K2', fare.includes(K2), 'C7', fare.includes(C7), '| fare:', fare, '| dawn:', dawn);
    }
  }
}
