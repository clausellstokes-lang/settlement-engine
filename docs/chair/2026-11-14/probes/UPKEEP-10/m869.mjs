// UPKEEP-10: #869 at display. Over a gzipped corpus ({seed, s} per line), the births with a siege in force
// (settlement.stress holds type under_siege: the tabs lane's own test) and the trade-connectivity band the causal
// state gives them (the band every Foundations grid prints: the screen's and the PDF's).
// usage: TREE=<tree> node m869.mjs <corpus.gz> [--list]
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T = process.env.TREE;
const { deriveCausalState } = await import(T + '/src/domain/causalState.js');
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const by = {}; const ok = []; let n = 0, sieges = 0;
for await (const line of rl) {
  if (!line.trim()) continue; n++;
  const { seed, s } = JSON.parse(line);
  const st = Array.isArray(s?.stress) ? s.stress : s?.stress ? [s.stress] : [];
  if (!st.some((x) => x?.type === 'under_siege')) continue;
  sieges++;
  const band = deriveCausalState(s).variables?.trade_connectivity?.band ?? 'none';
  by[band] = (by[band] || 0) + 1;
  if (band === 'adequate' || band === 'surplus') ok.push(`${seed} ${band} ${s.tier}`);
}
console.log(JSON.stringify({ births: n, sieges, bands: by, adequateOrBetter: ok.length }));
if (process.argv.includes('--list')) console.log(ok.join('\n'));
