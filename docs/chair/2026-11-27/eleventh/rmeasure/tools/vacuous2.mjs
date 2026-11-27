import { createReadStream } from 'node:fs'; import readline from 'node:readline';
const L = await import(new URL('../lib.mjs', import.meta.url).href); await L.loadGenerationLawPayloads();
const K2 = 'Every fish that comes in is counted';
for await (const l of readline.createInterface({ input: createReadStream('V.jsonl') })) {
  const j = JSON.parse(l); if (j.seed !== 'dp-hamlet-139') continue;
  const crit = L.FOOD_CULTURE.critical.map((x) => x.id); console.log('critical pool', crit.join(','));
  for (let i = 0; i < 400; i++) {
    const T = structuredClone(j.town); T.economicState.foodSecurity.foodRecord.foodSources = ['fish']; if (i) T.name = `${j.town.name}${'abcdefghijklmnopqrstuvwxyz'[i % 26]}${Math.floor(i / 26) || ''}`;
    const s = L.deriveDailyLife(T, { audience: 'owner' }).slots; const fare = String(s.food_culture?.text || '');
    if (i === 0) console.log('base name', T.name);
    if (fare.includes(K2)) { console.log('K2 at name', T.name, '| fare:', fare, '| dawn:', s.dawn_work?.text); break; }
  }
}
