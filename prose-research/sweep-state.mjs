// sweep-state.mjs — the FILE-BACKED checkpoint of the prose sweeps (chair, 2026-09-05 evening, after the reboot).
//   node sweep-state.mjs merge <name> [--update-state]   merge state-<name>.json (claims + verdicts so far) with every
//                                                         verdicts-<name>-chunk-*.json a verifier wrote; writes kept-<name>.json
//                                                         (VERIFIED_* only, with index + verdict) and merged-<name>.json; with
//                                                         --update-state also rewrites state-<name>.json in place (claims from
//                                                         the state or, in fresh mode, from the chunk files; verdicts overlaid).
//   node sweep-state.mjs summary                          one JSON line per sweep: claims / verdicts / kept (for AUTOSTATUS).
// Why a file and not the journal: a workflow run id dies with its session and a 400 KB verbatim structured return exceeds an
// agent's output ceiling; so every verifier writes its chunk's claims+verdicts to disk and this tool is the only reader.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.env.SWEEP_OUT || join(HERE, 'sweep');
const NAMES = ['tolkien', 'martin', 'dnd', 'ai', 'kay', 'leguin', 'wolfe', 'hobb'];
function load(p) { return JSON.parse(readFileSync(p, 'utf8')); }
function merge(name, update) {
  const sp = join(OUT, `state-${name}.json`);
  const state = existsSync(sp) ? load(sp) : { name, claims: [], sources: [], verdicts: {} };
  const claims = state.claims.slice(); const verdicts = { ...(state.verdicts || {}) };
  const files = readdirSync(OUT).filter(f => f.startsWith(`verdicts-${name}-`) && f.endsWith('.json')).sort();   // chunk-NN (the first resumed runs) and iA-B (index-range, every run after)
  let fromFiles = 0;
  for (const f of files) {
    let d; try { d = load(join(OUT, f)); } catch (e) { console.error(`SKIP ${f}: ${e.message}`); continue; }
    // MATCH BY CLAIM CONTENT, never by the file's index alone: a chunk file's indices were cut against whatever claims array the
    // chair pre-split at launch (the first resumed runs were cut against a MISALIGNED array — rebuild-state.py, 2026-09-05), but
    // every file carries the claim it verified, so the key (lowercase source|feature|claim[:60]) is the stable identity.
    const keyOf = (c) => (String(c.source || '') + '|' + String(c.feature || '') + '|' + String(c.claim || '').slice(0, 60)).toLowerCase();
    const kidx = new Map(claims.map((c, i) => [c ? keyOf(c) : null, i]).filter(([k]) => k !== null));
    const byIdx = new Map((d.claims || []).filter(c => c && typeof c.index === 'number').map(c => [c.index, c]));
    for (const v of (d.verdicts || [])) {
      if (typeof v.index !== 'number' || !v.verdict) continue;
      const c = byIdx.get(v.index);
      let ni = c ? kidx.get(keyOf(c)) : undefined;
      if (ni === undefined && c) { ni = v.index; if (!claims[ni]) { claims[ni] = c; kidx.set(keyOf(c), ni); } else if (keyOf(claims[ni]) !== keyOf(c)) { console.error(`SKIP ${f} index ${v.index}: claim not in state and slot ${ni} holds a different claim`); continue; } }
      if (ni === undefined) { console.error(`SKIP ${f} index ${v.index}: no claim carried`); continue; }
      verdicts[ni] = { ...v, index: ni, fromFile: f }; fromFiles++;
    }
  }
  const kept = [];
  for (let i = 0; i < claims.length; i++) { const v = verdicts[i]; if (v && (v.verdict === 'VERIFIED_VERBATIM' || v.verdict === 'VERIFIED_SUBSTANCE')) kept.push({ index: i, ...claims[i], verdict: v }); }
  writeFileSync(join(OUT, `merged-${name}.json`), JSON.stringify({ name, claims, verdicts }, null, 1));
  writeFileSync(join(OUT, `kept-${name}.json`), JSON.stringify(kept, null, 1));
  if (update) writeFileSync(sp, JSON.stringify({ ...state, name, claims, verdicts, mergedAt: 'see autosave.log' }, null, 1));
  const s = { name, claims: claims.filter(Boolean).length, verdicts: Object.keys(verdicts).length, kept: kept.length, chunkFiles: files.length, verdictsFromFiles: fromFiles };
  return s;
}
const [cmd, name, flag] = process.argv.slice(2);
if (cmd === 'merge') { console.log(JSON.stringify(merge(name, flag === '--update-state'))); }
else if (cmd === 'summary') { const o = {}; for (const n of NAMES) { if (existsSync(join(OUT, `state-${n}.json`)) || readdirSync(OUT).some(f => f.startsWith(`verdicts-${n}-`))) { const s = merge(n, true); o[n] = { claims: s.claims, verdicts: s.verdicts, kept: s.kept }; } } console.log(JSON.stringify(o)); }
else { console.error('usage: merge <name> [--update-state] | summary'); process.exit(2); }
