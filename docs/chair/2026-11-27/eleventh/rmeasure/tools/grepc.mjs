// node grepc.mjs <corpus.jsonl> <regex> [flags] [share]  — normalized printed lines matching, with page counts and views
import { createReadStream } from 'node:fs'; import readline from 'node:readline';
const [f, re, fl = 'i', which = 'views'] = process.argv.slice(2); const R = new RegExp(re, fl);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rl = readline.createInterface({ input: createReadStream(f), crlfDelay: Infinity });
const by = new Map(); let n = 0;
for await (const l of rl) { if (!l) continue; const j = JSON.parse(l); if (!j[which]) continue; n++;
  const names = (j.town?.npcs || []).map((p) => p.name).filter(Boolean).sort((a, b) => b.length - a.length);
  const norm = (s) => { let t = s.split(j.town?.name || '\u0000').join('{S}'); for (const nm of names) t = t.split(nm).join('{N}'); return t; };
  const seen = new Set();
  for (const [v, ls] of Object.entries(j[which])) for (const x of ls) if (R.test(x)) {
    for (const sent of x.split(/(?<=[.!?])\s+/)) if (R.test(sent)) { const k = `${v} :: ${norm(sent)}`; if (seen.has(k)) continue; seen.add(k); const e = by.get(k) || { pages: 0, ex: j.seed }; e.pages++; by.set(k, e); }
  }
}
console.log('pages read', n);
for (const [k, e] of [...by].sort((a, b) => b[1].pages - a[1].pages).slice(0, Number(process.env.TOP || 80))) console.log(e.pages, e.ex, '|', k.slice(0, 400));
