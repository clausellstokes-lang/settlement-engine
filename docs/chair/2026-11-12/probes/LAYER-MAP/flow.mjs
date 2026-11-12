// LAYER-MAP flow.mjs — EXECUTED flow faults over every desk site's drawn prose (composePublicProse's sites, owner
// draw, player audience), per town: (F1) a sentence twice inside ONE site's desk (identical site outputs counted once: the mount registry decides which rung prints where); (F2) two sentences NEXT TO EACH
// OTHER in one site sharing a run of 5+ content-bearing words (one claim said twice in neighbouring sentences);
// (F3) a run of 3+ words repeated INSIDE one sentence (the doubled clause, pattern 13's shape); (F4) the same
// opening word-pair on neighbouring sentences of one site (a flat paragraph). Counts towns and instances.
// Run: TREE=<tree> CORPUS=<corpus.ndjson.gz> node --import ./jsx-register.mjs flow.mjs > flow.json
import { loadCorpus } from './load.mjs';
const R = (process.env.TREE || process.cwd()) + '/src';
const { PUBLIC_PROSE_SITES } = await import(R + '/components/new/publicProseCompose.js');
const { publicVeiledRecordOf } = await import(R + '/domain/display/publicSafe.js');
const STOP = new Set('the a an of and or to in on at by for with is are was it its as that this be has have not no from but so'.split(' '));
const toks = (s) => s.toLowerCase().replace(/[^a-z' ]+/g, ' ').split(/\s+/).filter(Boolean);
const grams = (t, n) => { const out = []; for (let i = 0; i + n <= t.length; i++) { const g = t.slice(i, i + n); if (g.filter((w) => !STOP.has(w)).length >= Math.ceil(n / 2)) out.push(g.join(' ')); } return out; };
const sentencesOf = (x) => String(x).split(/(?<=[.!?])\s+(?=[A-Z"“])/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 4);
const corpus = loadCorpus(process.env.CORPUS);
const tally = { F1: [0, 0], F2: [0, 0], F3: [0, 0], F3b: [0, 0], F4: [0, 0] }; const ex = { F1: [], F2: [], F3: [], F3b: [], F4: [] }; const F3distinct = new Set(), F3bdistinct = new Set(), F2distinct = new Set();
let towns = 0, sentencesTotal = 0;
for (const { seed, s } of corpus) {
  towns++; const hit = { F1: 0, F2: 0, F3: 0, F3b: 0, F4: 0 }; const doneSites = new Set();
  const ctx = { veiledRecord: publicVeiledRecordOf(s) };
  for (const [site, draw] of PUBLIC_PROSE_SITES) {
    let o; try { o = draw(s, false, ctx); } catch { continue; }
    const sig = JSON.stringify(o); if (doneSites.has(sig)) continue; doneSites.add(sig); const seen = new Map();
    const units = []; const walk = (x) => { if (!x || typeof x !== 'object') return; if (typeof x.sentence === 'string' && x.sentence) units.push(x.sentence); for (const [k, v] of Object.entries(x)) if (k !== 'provenance' && k !== 'sentence') walk(v); }; walk(o);
    const sents = units.flatMap(sentencesOf); sentencesTotal += sents.length;
    sents.forEach((t, i) => {
      if (seen.has(t) && seen.get(t) !== site + i) { hit.F1++; if (ex.F1.length < 6) ex.F1.push(`${seed} ${site}: ${t}`); } else seen.set(t, site + i);
      const tk = toks(t);
      const g3 = grams(tk, 3); const dup = g3.find((g, j) => g3.indexOf(g) !== j && !g3.slice(j - 2, j).includes(g));
      if (dup) { hit.F3++; F3distinct.add(t); if (ex.F3.length < 8) ex.F3.push(`${seed} ${site}: «${dup}» in: ${t}`); }
      const g4 = grams(tk, 4); const dup4 = g4.find((g, j) => g4.indexOf(g) !== j && !g4.slice(j - 3, j).includes(g));
      if (dup4) { hit.F3b++; F3bdistinct.add(t); if (ex.F3b.length < 8) ex.F3b.push(`${seed} ${site}: «${dup4}» in: ${t}`); }
      if (i > 0) {
        const prev = toks(sents[i - 1]);
        const a = new Set(grams(prev, 5)); const shared = grams(tk, 5).find((g) => a.has(g));
        if (shared) { hit.F2++; F2distinct.add(sents[i - 1] + ' || ' + t); if (ex.F2.length < 8) ex.F2.push(`${seed} ${site}: «${shared}» | ${sents[i - 1]} || ${t}`); }
        if (prev.slice(0, 2).join(' ') === tk.slice(0, 2).join(' ') && !STOP.has(tk[1] || 'the')) { hit.F4++; if (ex.F4.length < 6) ex.F4.push(`${seed} ${site}: ${sents[i - 1].slice(0, 60)} || ${t.slice(0, 60)}`); }
      }
    });
  }
  for (const k of Object.keys(hit)) if (hit[k]) { tally[k][0]++; tally[k][1] += hit[k]; }
}
console.log(JSON.stringify({ towns, sentencesTotal, distinct: { F2pairs: F2distinct.size, F3sentences: F3distinct.size, F3bsentences: F3bdistinct.size }, tally: Object.fromEntries(Object.entries(tally).map(([k, [t, n]]) => [k, { towns: t, instances: n }])), examples: ex }, null, 1));
