// BD-r4 probe 3: sweep BD14's RAID_MARGIN over the two measured scales (defence.out):
// a body raids tier T iff bodyStrength(max, full readiness+cohesion) > homeDefense(T) x (1 + m).
// Question: is there ANY margin under which the urban band (town+) is never raided while the
// rural band (thorp/hamlet/village) is raidable by a `modest` (BD23's naming band) body?
const D = { thorp: 33.5, hamlet: 37.9, village: 42.6, town: 47.3, city: 52.1, metropolis: 56.7 };
const S = { thin: 13, modest: 34, capable: 51, strong: 69, formidable: 89 };
let found = false;
for (let m = 0; m <= 1.6001; m += 0.05) {
  const raids = {};
  for (const [b, s] of Object.entries(S)) raids[b] = Object.keys(D).filter(t => s > D[t] * (1 + m));
  const urbanSafe = Object.values(raids).every(ts => !ts.some(t => ['town', 'city', 'metropolis'].includes(t)));
  const modestRaidsHamlet = raids.modest.includes('hamlet');
  if (urbanSafe && modestRaidsHamlet) found = true;
  if (Math.abs((m * 100) % 20) < 1e-6 || urbanSafe) console.log('m=' + m.toFixed(2), JSON.stringify(raids), urbanSafe ? 'URBAN-SAFE' : '');
}
console.log('a margin with town+ never raided AND a modest body raiding a hamlet exists:', found);
