// shared loader: corpus records + dumps (per seed: {view -> lines[]})
import fs from 'node:fs'; import zlib from 'node:zlib';
export function loadCorpus(dir) {
  const txt = zlib.gunzipSync(fs.readFileSync(`${dir}/corpus.ndjson.gz`)).toString('utf8');
  const out = new Map();
  for (const line of txt.split('\n')) { if (!line) continue; const o = JSON.parse(line); out.set(o.seed, o.s); }
  return out;
}
export function loadDump(dir, seed) {
  const p = `${dir}/dumps/${seed}.txt`; if (!fs.existsSync(p)) return null;
  const views = {}; let cur = '?';
  for (const l of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = l.match(/^== (.+) ==$/); if (m) { cur = m[1]; views[cur] = []; continue; }
    if (l && !l.startsWith('[STYLE]')) (views[cur] ||= []).push(l);
  }
  return views;
}
export const roster = (s) => (s.institutions || []).map((i) => i.name || i.id || '');
export const crises = (s) => [].concat(s.stress || []).map((x) => (typeof x === 'string' ? x : x?.type || x?.id)).filter(Boolean);
