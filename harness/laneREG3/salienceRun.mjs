/**
 * salienceRun.mjs — RUN THE REG-I0 INSTRUMENT 4 AS-IS over a rendered corpus directory.
 * ⛔ This file DOES NOT re-implement the instrument. It shells `i4-landmark-salience.mjs`,
 * once per leaf for the real anchors and once for the matched decoys, and tables the pair.
 *
 * ⚠⚠ THE BUG THIS EXISTS TO PREVENT, AND IT BIT THIS LANE: `ls town-*-parchment.svg | head -1`
 * matches `town-2-town-parchment.svg` FIRST, so a "town" reading was silently a town-2 reading
 * and disagreed with the recorded baseline by +0.75. Leaf files are resolved by EXACT
 * `<key>-<tier>-parchment.svg` match, never by glob.
 *
 * Usage: node salienceRun.mjs --dir=<renderDir> --png=<pngDir> [--leaves=a,b] [--json=]
 */
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const SP = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad';
const I4 = join(SP, 'reg-instruments/i4-landmark-salience.mjs');
const SHOOT = join(SP, 'reg0/shoot.sh');
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };

const dir = arg('dir', null);
const pngDir = arg('png', null);
if (!dir || !pngDir) { console.error('need --dir and --png'); process.exit(2); }
mkdirSync(pngDir, { recursive: true });
const files = readdirSync(dir).filter((f) => f.endsWith('-parchment.svg'));
/** exact resolution: the file name is `<key>-<tier>-parchment.svg`, so the key is everything
 *  before the LAST two dash-separated fields. */
const rows = files.map((f) => {
  const parts = f.replace(/-parchment\.svg$/, '').split('-');
  const tier = parts[parts.length - 1];
  return { key: parts.slice(0, -1).join('-'), tier, file: join(dir, f) };
}).sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));

const only = arg('leaves', '');
const wanted = only ? new Set(only.split(',')) : null;
const out = [];
for (const r of rows) {
  if (wanted && !wanted.has(r.key)) continue;
  const png = join(pngDir, `${r.key}.png`);
  if (!existsSync(png)) {
    const res = execFileSync('/bin/zsh', [SHOOT, r.file, png, '2200'], { encoding: 'utf8' });
    if (!/SHOOT_OK/.test(res)) { console.log(`${r.key}\tSHOOT FAILED\t${res.trim()}`); continue; }
  }
  const jL = join(pngDir, `.i4-${r.key}.json`), jD = join(pngDir, `.i4d-${r.key}.json`);
  const run = (extra, j) => {
    try { execFileSync(process.execPath, [I4, `--base=${r.file}`, `--png=${png}`, `--json=${j}`, ...extra], { encoding: 'utf8', stdio: ['ignore', 'ignore', 'ignore'] }); } catch { /* I4_FAIL exits nonzero-free; json still written */ }
    // ⚠ AN EXIT STATUS IS NOT A VERDICT AND A MISSING ARTIFACT IS NOT A ZERO. i4 exits nonzero
    // on I4_FAIL, so the catch above is expected — but if it ALSO failed to write the json the
    // row is UNMEASURED and must say so rather than throwing the whole sweep away.
    try { return JSON.parse(readFileSyncSafe(j)); } catch { return null; }
  };
  const L = run([], jL), D = run(['--decoy'], jD);
  if (!L || !D) { console.log(); continue; }
  out.push({
    leaf: r.key, tier: r.tier,
    real: L.groupMeanSalience, decoy: D.groupMeanSalience,
    beats: L.groupMeanSalience > D.groupMeanSalience,
    eachReal: L.rows.map((x) => x.value), anchors: L.rows.map((x) => x.anchor || '(unanchored)'),
    minReal: Math.min(...L.rows.map((x) => x.value)),
    fabricPx: L.fabricPx, fabricMean: L.fabricMean, fabricSD: L.fabricSD,
    massesFound: L.massesFound,
    pass: L.pass,
  });
}
import { readFileSync as _rfs } from 'node:fs';
function readFileSyncSafe(p) { return _rfs(p, 'utf8'); }

console.log(['leaf', 'tier', 'REAL', 'DECOY', 'beats?', 'minEach', 'band(each>=1,grp>=1.5)', 'fabricPx', 'anchors'].join('\t'));
for (const r of out) {
  console.log([r.leaf, r.tier, r.real, r.decoy, r.beats ? 'YES' : 'no', r.minReal.toFixed(4), r.pass ? 'PASS' : 'fail', r.fabricPx, r.anchors.join(' | ')].join('\t'));
}
const beat = out.filter((r) => r.beats).length;
console.log(`\nBEATS-DECOY: ${beat} of ${out.length} leaves · BAND-PASS: ${out.filter((r) => r.pass).length} of ${out.length}`);
// ⭐ THE EXIT'S OWN POPULATION IS THE **WALLED** LEAVES (REG-3's row: "real anchors BEAT matched
// decoys on every walled exemplar leaf"), and REG-2 measured which twelve those are. The unwalled
// six are reported beside them, never folded in — a denominator that quietly grows is the defect
// the REG-I0 lane's one rule exists to stop.
const WALLED = new Set(['town', 'town-2', 'city', 'metropolis', 'polycentric', 'highwater', 'siege', 'plague', 'famine', 'migration', 'year-100', 'crossing']);
const w = out.filter((r) => WALLED.has(r.leaf));
console.log(`WALLED ONLY (the exit's population, 12 leaves): BEATS-DECOY ${w.filter((r) => r.beats).length} of ${w.length} · BAND-PASS ${w.filter((r) => r.pass).length} of ${w.length}`);
console.log(`UNWALLED (reported, not counted): ${out.filter((r) => !WALLED.has(r.leaf)).map((r) => `${r.leaf} ${r.real}/${r.decoy}${r.beats ? '' : ' ✗'}`).join(' · ')}`);
const j = arg('json', null);
if (j) writeFileSync(j, JSON.stringify(out, null, 2));
