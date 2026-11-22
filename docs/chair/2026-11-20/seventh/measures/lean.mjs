import { fnv1a32 } from '/home/user/wt/line/src/kernel/proseHash.js';
const fmix = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
const sizes = ['thorp','hamlet','village','town','city','metropolis'];
// realistic keys: the births' seeds are names like hxd-city-17; step-qualified keys append ::label::id
const shapes = {
  'seed::label (hxd-<size>-<i>)': (s,i) => `hxd-${s}-${i}::safetyDesc.opening`,
  'seed::label::npc_<k>': (s,i) => `hxd-${s}-${i}::npcStructure.activeConstraint::npc_${i%7}`,
  'numeric seed::label': (s,i) => `${(i*2654435761>>>0)}::tension::crime_wave`,
  'place name::label': (s,i) => `${['Ashford','Brindle','Corvale','Dunmere','Eastwick','Farrow','Glenhollow','Harrowgate','Ironbridge','Jarrow'][i%10]}${i}::cause`,
};
for (const [name, mk] of Object.entries(shapes)) {
  console.log('\n== key shape:', name, ' (600 keys: 100 a size) top share % raw | mixed | expected');
  for (const n of [2,3,4,5,6,7,8,9,10,12,15,16]) {
    const raw = new Array(n).fill(0), mix = new Array(n).fill(0); let N = 0;
    for (const s of sizes) for (let i = 0; i < 100; i++) { const h = fnv1a32(mk(s,i)); raw[h % n]++; mix[fmix(h) % n]++; N++; }
    const pct = (a) => (100*Math.max(...a)/N).toFixed(1);
    console.log(`n=${String(n).padStart(2)}  raw ${pct(raw).padStart(5)}  mixed ${pct(mix).padStart(5)}  expected ${(100/n).toFixed(1).padStart(5)}  raw counts [${raw.join(',')}]`);
  }
}
