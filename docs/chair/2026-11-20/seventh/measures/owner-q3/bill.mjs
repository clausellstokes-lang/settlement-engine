// Owner Q3, second measure: (D) where cross-town repeats come from, (E) the bill by simulation, (F) culture split.
// Usage: node bill.mjs <line> [runs=200]
import { bornAll, masker, rng } from './born.mjs';
const L = process.argv[2]; const RUNS = +(process.argv[3] || 200);
const t0 = Date.now();
const { towns } = await bornAll(L);
console.log(`born ${towns.length} in ${((Date.now() - t0) / 1000).toFixed(0)}s; runs=${RUNS}`);
const npcData = await import(`${L}/src/data/npcData.js`);
const { TITLE_SECRETS } = await import(`${L}/src/data/people/titleSecretsPresentations.js`);
const R = rng(424242); const pick = (n) => Math.floor(R() * n);
const mean = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN;
const pct = (x) => (100 * x).toFixed(1) + '%';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// template -> regex (slots {x} become wildcards)
const tplRe = (s) => new RegExp('^' + esc(String(s).trim()).replace(/\\\{[^}]*\\\}/g, '.+?') + '$', 'i');
// ---- hook source index: NPC_FACTION_LOYALTY[<pool>] (the pool drawPersonHook/hookPoolFor key by) ----
const hookIdx = [];
for (const [cat, rows] of Object.entries(npcData.NPC_FACTION_LOYALTY)) for (const r of rows) { const tx = typeof r === 'string' ? r : r?.text; if (tx) hookIdx.push([cat, tplRe(tx), tx.trim()]); }
const hookExact = new Map(); for (const [c, , tx] of hookIdx) if (!hookExact.has(tx)) hookExact.set(tx, c);
const hookGroup = (raw) => { const s = String(raw).trim(); if (hookExact.has(s)) return 'hook:' + hookExact.get(s); for (const [c, re] of hookIdx) if (re.test(s)) return 'hook:' + c; return 'hook:(unmatched)'; };
// ---- secret source index: NPC_CRIMINAL_SECRETS_BY_HOLDER[holder][type] (grouped by type), TITLE_SECRETS[title] ----
const secIdx = [];
for (const [holder, types] of Object.entries(npcData.NPC_CRIMINAL_SECRETS_BY_HOLDER)) for (const [type, rows] of Object.entries(types)) for (const r of rows) if (r?.secret) secIdx.push(['type:' + type, tplRe(r.secret), r.secret.trim()]);
for (const [title, rows] of Object.entries(TITLE_SECRETS)) for (const r of rows) if (r?.secret) secIdx.push(['title:' + title, tplRe(r.secret), r.secret.trim()]);
const secExact = new Map(); for (const [g, , tx] of secIdx) if (!secExact.has(tx)) secExact.set(tx, g);
const secGroup = (raw) => { const s = String(raw).trim(); if (secExact.has(s)) return 'secret:' + secExact.get(s); for (const [g, re] of secIdx) if (re.test(s)) return 'secret:' + g; return 'secret:(unmatched: crime-knowledge/stress/food pools)'; };
// ---- draws: per town, per pool, [group, maskedLine] ----
const POOLS = ['short goal', 'long goal', 'own hook', 'tie description', 'secret'];
const draws = new Map(towns.map((t) => { const m = masker(t); const o = Object.fromEntries(POOLS.map((p) => [p, []]));
  for (const n of t.npcs) {
    const gi = n.goal?.intent || {};
    if (n.goal?.short) o['short goal'].push([`${gi.short?.family || '?'}/${gi.short?.kind || '?'}`, m(n.goal.short)]);
    if (n.goal?.long) o['long goal'].push([`${gi.long?.family || '?'}/${gi.long?.kind || '?'}`, m(n.goal.long)]);
    for (const h of n.plotHooks || []) if (h) o['own hook'].push([hookGroup(h), m(h)]);
    if (n.secret?.what) o['secret'].push([secGroup(n.secret.what), m(n.secret.what)]);
  }
  for (const r of t.relationships || []) if (r.description) o['tie description'].push([`tie:${r.archetypeKey || r.type || '?'}`, m(r.description)]);
  return [t, o]; }));
const SZ = ['town', 'city', 'metropolis'];
const bySize = Object.fromEntries(SZ.map((s) => [s, towns.filter((t) => t.tier === s)]));
const allPairs = (n) => { const a = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) a.push([i, j]); return a; };
const PAIRS = allPairs(50);
console.log('\nunmatched source groups (share of draws, all 300 towns):');
for (const p of ['own hook', 'secret']) { const a = towns.flatMap((t) => draws.get(t)[p]); console.log(`  ${p}: ${pct(a.filter(([g]) => /unmatched/.test(g)).length / a.length)} of ${a.length}`); }
for (const p of POOLS) { const per = towns.map((t) => { const a = draws.get(t)[p].map(([, l]) => l); return a.length - new Set(a).size; }); const tot = towns.reduce((x, t) => x + draws.get(t)[p].length, 0); console.log(`  in-town repeats, ${p}: ${per.reduce((x, y) => x + y, 0)} of ${tot} draws`); }

// ===== (D) =====
const distinct = {}; // pool -> group -> Set(lines) over 300 towns
for (const p of POOLS) { distinct[p] = new Map(); for (const t of towns) for (const [g, l] of draws.get(t)[p]) { if (!distinct[p].has(g)) distinct[p].set(g, new Set()); distinct[p].get(g).add(l); } }
const repeatsByGroup = {}; // pool -> size -> Map(group -> repeats over all ordered pairs)
console.log('\n===== (D) WHERE REPEATS COME FROM (all 2,450 ordered pairs per size; a repeat = a draw of B whose masked line stands among A\'s lines, charged to B\'s draw group) =====');
console.log('groups: goal = goal.intent.<short|long> family/kind; tie = relationships[].archetypeKey; hook = NPC_FACTION_LOYALTY pool matched by text (template slots as wildcards); secret = NPC_CRIMINAL_SECRETS_BY_HOLDER type (holder classes merged) or TITLE_SECRETS title, matched by text');
for (const p of POOLS) { repeatsByGroup[p] = {};
  for (const s of SZ) { const g = bySize[s]; const sets = g.map((t) => new Set(draws.get(t)[p].map(([, l]) => l))); const rep = new Map(); let tot = 0;
    for (const [a, b] of PAIRS) for (const [grp, l] of draws.get(g[b])[p]) if (sets[a].has(l)) { rep.set(grp, (rep.get(grp) || 0) + 1); tot++; }
    repeatsByGroup[p][s] = rep;
    const perTown = new Map(); for (const t of g) for (const [grp] of draws.get(t)[p]) perTown.set(grp, (perTown.get(grp) || 0) + 1);
    console.log(`\n-- ${p} @ ${s}: groups drawn ${perTown.size}; repeats ${tot}; top ten: group · distinct lines seen (300 towns) · mean draws per town · share of repeats`);
    for (const [grp, r] of [...rep].sort((x, y) => y[1] - x[1]).slice(0, 10)) console.log(`   ${grp.padEnd(48)} ${String(distinct[p].get(grp).size).padStart(4)}  ${(perTown.get(grp) / g.length).toFixed(2).padStart(6)}  ${pct(r / tot).padStart(6)}`);
  } }

// ===== (E) simulation =====
console.log('\n===== (E) THE BILL BY SIMULATION =====');
console.log('Model: each card keeps its group; groups NOT enlarged keep their observed lines; each enlarged group of observed size s (distinct masked lines seen over 300 towns) becomes ceil(m*s) lines and its cards re-draw uniformly from it. Within a town the re-draw is WITHOUT replacement (while the group has lines left) for pools whose observed in-town repeats are ~0 (the held-text registry), WITH replacement otherwise. Metric = mean over all ordered pairs of share of B\'s lines already among A\'s (measure A). Groups ranked by their repeats at that size.');
const MS = [1.5, 2, 3, 5]; const KS = [5, 10, 20, 'all'];
const results = []; // {p,s,m,K,newLines,groups,share}
for (const p of POOLS) {
  const tot = towns.reduce((x, t) => x + draws.get(t)[p].length, 0); const inRep = towns.reduce((x, t) => { const a = draws.get(t)[p].map(([, l]) => l); return x + a.length - new Set(a).size; }, 0);
  const noRepl = inRep / tot < 0.005;
  for (const s of ['city', 'metropolis']) {
    const g = bySize[s]; const ranked = [...repeatsByGroup[p][s]].sort((x, y) => y[1] - x[1]).map(([grp]) => grp);
    const allGroups = [...new Set(g.flatMap((t) => draws.get(t)[p].map(([grp]) => grp)))];
    // integer ids
    const lineId = new Map(); const idOf = (l) => { if (!lineId.has(l)) lineId.set(l, lineId.size); return lineId.get(l); };
    const obs = g.map((t) => draws.get(t)[p].map(([grp, l]) => [grp, idOf(l)]));
    const shareOf = (towIds) => { const sets = towIds.map((a) => new Set(a)); let acc = 0, n = 0; for (const [a, b] of PAIRS) { const B = towIds[b]; if (!B.length) continue; let c = 0; for (const x of B) if (sets[a].has(x)) c++; acc += c / B.length; n++; } return acc / n; };
    const base = shareOf(obs.map((a) => a.map(([, id]) => id)));
    console.log(`\n-- ${p} @ ${s}: observed share ${pct(base)}; re-draw ${noRepl ? 'without' : 'with'} replacement in town (in-town repeats ${inRep}/${tot})`);
    const row = (m, K, model = 'uniform') => {
      const top = new Set(K === 'all' ? allGroups : ranked.slice(0, K));
      const sizes = new Map(); const lines = new Map(); let newLines = 0;
      for (const grp of top) { const seen = [...distinct[p].get(grp)].map(idOf); const S = Math.ceil(m * seen.length); newLines += S - seen.length; const arr = [...seen]; for (let k = seen.length; k < S; k++) arr.push(`${grp}#new${k}`); lines.set(grp, arr); sizes.set(grp, S); }
      const shares = [];
      for (let run = 0; run < RUNS; run++) {
        const towIds = obs.map((a) => { const used = new Map(); return a.map(([grp, id]) => { if (!top.has(grp)) return id; const arr = lines.get(grp); let u = used.get(grp); if (!u) { u = new Set(); used.set(grp, u); }
          if (model === 'skew') { const n0 = distinct[p].get(grp).size; if (R() < n0 / arr.length) return id; const nn = arr.length - n0; if (!nn) return id; let x; if (noRepl && u.size < nn) { do { x = n0 + pick(nn); } while (u.has(x)); } else x = n0 + pick(nn); u.add(x); return arr[x]; }
          let x; if (noRepl && u.size < arr.length) { do { x = pick(arr.length); } while (u.has(x)); } else x = pick(arr.length); u.add(x); return arr[x]; }); });
        shares.push(shareOf(towIds));
      }
      const sh = mean(shares); results.push({ p, s, m, K, model, newLines, groups: top.size, share: sh });
      return `${pct(sh).padStart(6)} (+${newLines} in ${top.size})`;
    };
    console.log(`   control m=1, K=all (uniform re-draw at observed sizes): ${row(1, 'all')}`);
    console.log('   m \\ K      ' + KS.map((k) => String(k).padEnd(22)).join(''));
    for (const m of MS) console.log(`   ${String(m).padEnd(10)} ${KS.map((K) => row(m, K).padEnd(22)).join('')}`);
    console.log('   SKEW-KEPT model (a card keeps its observed line with chance s/ceil(m*s), else draws a NEW line uniformly): m \\ K');
    for (const m of MS) console.log(`   ${String(m).padEnd(10)} ${KS.map((K) => row(m, K, 'skew').padEnd(22)).join('')}`);
  }
}
console.log('\nSMALLEST BILL in the grid (city): pool · under 30% · under 20%  (new lines, groups touched, m, K, simulated share)');
for (const model of ['uniform', 'skew']) { console.log(` model: ${model}`); for (const p of POOLS) { const c = results.filter((r) => r.p === p && r.s === 'city' && r.m !== 1 && r.model === model);
  const best = (th) => { const ok = c.filter((r) => r.share < th).sort((a, b) => a.newLines - b.newLines)[0]; return ok ? `+${ok.newLines} lines in ${ok.groups} groups (m=${ok.m}, K=${ok.K}, ${pct(ok.share)})` : 'not reached in grid'; };
  const ctl = results.find((r) => r.p === p && r.s === 'city' && r.m === 1);
  console.log(`  ${p.padEnd(16)} <30%: ${best(0.30).padEnd(48)} <20%: ${best(0.20)}   [uniform control ${pct(ctl.share)}]`); } }

// ===== (F) culture =====
console.log('\n===== (F) SAME vs DIFFERENT CULTURE (culturalIdentity.key), all ordered pairs, share of B\'s lines among A\'s =====');
for (const s of ['city', 'metropolis']) { const g = bySize[s];
  for (const p of ['short goal', 'own hook', 'tie description']) { const sets = g.map((t) => new Set(draws.get(t)[p].map(([, l]) => l))); const acc = { same: [], diff: [] };
    for (const [a, b] of PAIRS) { const B = draws.get(g[b])[p]; if (!B.length) continue; const sh = B.filter(([, l]) => sets[a].has(l)).length / B.length; acc[g[a].culturalIdentity?.key === g[b].culturalIdentity?.key ? 'same' : 'diff'].push(sh); }
    console.log(`  ${s.padEnd(11)} ${p.padEnd(16)} same culture ${pct(mean(acc.same))} (${acc.same.length} pairs)   different ${pct(mean(acc.diff))} (${acc.diff.length} pairs)`); } }
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
