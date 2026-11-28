// node f1.mjs <base.plan.jsonl> <tip.plan.jsonl> [verbose] — F1: births with fewer powers than base, by cause
import fs from 'node:fs';
const read = (f) => new Map(fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.key, r]));
const B = read(process.argv[2]), T = read(process.argv[3]);
const cls = {}; const rows = []; const byCorpus = {};
for (const [k, t] of T) {
  const b = B.get(k); if (!b) continue;
  if (t.roster.length >= b.roster.length) continue;
  const bn = new Set(b.roster.map((x) => x[0])), tn = new Set(t.roster.map((x) => x[0]));
  const missing = [...bn].filter((x) => !tn.has(x));
  const bp = b.plans.at(-1) || {}, tp = t.plans.at(-1) || {};
  const fold = t.folds.at(-1) || { folded: [], dropped: [] };
  const causes = [];
  if (bp.gov !== tp.gov) causes.push('council');
  if (missing.some((m) => fold.folded.includes(m))) causes.push('fold');
  if (missing.some((m) => fold.dropped.includes(m))) causes.push('notbuilt');
  if ((tp.factionCount ?? 0) < (bp.factionCount ?? 0)) causes.push(`cut(${bp.factionCount}->${tp.factionCount}, mass ${bp.mass}->${tp.mass})`);
  if (!causes.length && fold.dropped.length) causes.push('notbuilt(renamed)');
  const c = causes.length ? causes.map((x) => x.replace(/\(.*$/, '')).join('+') : 'other';
  cls[c] = (cls[c] || 0) + 1;
  const corpus = k.startsWith('rv') ? 'R' : 'S';
  byCorpus[`${corpus}:${c}`] = (byCorpus[`${corpus}:${c}`] || 0) + 1;
  rows.push(`${k} [${t.tier}] ${c}: lost ${missing.join(', ')} (${causes.join(' ')}) base ${b.roster.map((x) => x.join(':')).join(' ')} | tip ${t.roster.map((x) => x.join(':')).join(' ')}`);
}
console.log('fewer powers, by cause:', cls); console.log('by corpus:', byCorpus);
if (process.argv[4]) for (const r of rows.filter((r) => process.argv[4] === 'all' || r.includes(process.argv[4]))) console.log(r);
