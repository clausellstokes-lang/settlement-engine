// W2-C-LEAVES-9 item 1: the three printed lines, per town. `TREE=<tree> node lines9.mjs <corpus.ndjson.gz>... > out.ndjson`
// Per birth: seed, tier, the criminal structure's key and note (deriveCriminalStructure), the food endurance sentence,
// every active chain's chainNeedLine (first=true and first=false), tradeStoppedHere and factsOf's under_siege.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R = process.env.TREE + '/src';
const { deriveCriminalStructure, foodEnduranceLine } = await import(R + '/domain/display/defenseDisplay.js');
const { chainNeedLine } = await import(R + '/domain/display/chainNeedShown.js');
const { tradeStoppedHere } = await import(R + '/domain/display/chainStateShown.js');
const { factsOf } = await import(R + '/domain/facts/factsOf.js');
for (const f of process.argv.slice(2)) {
  const rl = readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line) continue;
    const { seed, s } = JSON.parse(line);
    const crim = deriveCriminalStructure(s);
    const chains = (s?.economicState?.activeChains || []).map((c) => [chainNeedLine(c, s, true), chainNeedLine(c, s, false)]);
    process.stdout.write(JSON.stringify({ seed, tier: s.tier, crimKey: crim?.key ?? null, crimNote: crim?.note ?? null,
      food: foodEnduranceLine(s)?.sentence ?? null, stopped: tradeStoppedHere(s), siegeFact: factsOf(s).crisis.has('under_siege'), chains }) + '\n');
  }
}
