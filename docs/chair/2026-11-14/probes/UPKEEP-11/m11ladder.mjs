// UPKEEP-11 step 4(i): the posture line's ladder (defenseStateProse.js :: posturePoolKey, scoreBand of readiness.score)
// against the badge's band (readiness.label), and the ruled pool (UPKEEP-6 ruling 6: Fortress, Well-Defended -> STRONG;
// Defensible, Lightly Defended -> ADEQUATE; Vulnerable, Undefended -> WEAK), over a gz corpus. As one-ladder.txt.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T = process.env.TREE;
const { posturePoolKey } = await import(T + '/src/domain/display/stateProse/defenseStateProse.js');
const RULED = { Fortress: 'STRONG', 'Well-Defended': 'STRONG', Defensible: 'ADEQUATE', 'Lightly Defended': 'ADEQUATE', Vulnerable: 'WEAK', Undefended: 'WEAK' };
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const cells = {}; const ex = {}; let n = 0;
for await (const line of rl) {
  if (!line.trim()) continue; n++;
  const { seed, s } = JSON.parse(line); const r = s.defenseProfile?.readiness || {};
  const today = String(posturePoolKey(r.score) || 'none').replace('readiness ', '');
  const k = `(${r.label}, ${today}, ${RULED[r.label] || '?'})${today !== RULED[r.label] ? ' CHANGES' : ''}`;
  cells[k] = (cells[k] || 0) + 1; (ex[k] ||= []).length < 6 && ex[k].push(`${seed}(${r.score})`);
}
console.log(`# births ${n}. Cells: (badge band, pool today, pool ruled): births`);
for (const [k, v] of Object.entries(cells).sort((a, b) => b[1] - a[1])) console.log(`#   ${k} ${v}`);
for (const [k, v] of Object.entries(ex)) if (k.includes('CHANGES')) console.log(`# six of ${k}: ${v.join(' ')}`);
