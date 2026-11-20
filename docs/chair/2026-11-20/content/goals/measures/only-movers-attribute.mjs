// Attribute every out-of-scope holding (only-movers.mjs's OUT lines) to one cause, from instrumented births of both trees
// (goals.js patched in scratch copies to carry the deal's receipt on goal._r, and the post-pass's refused vantages on
// goal._refused). Usage: node attribute.mjs <only-movers out> <iborn-A> <iborn-B> <born-A> <born-B>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const [, , OM, IA, IB, BA, BB] = process.argv;
const read = (dir, corpus) => new Map(readFileSync(join(dir, `${corpus}.jsonl`), 'utf8').split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return [String(r.key), r.doc]; }));
const outLines = readFileSync(OM, 'utf8').split('\n').filter((l) => l.startsWith('  OUT '));
const cap = (v) => v[0].toUpperCase() + v.slice(1);
const res = {};
for (const corpus of ['golden', 'census']) {
  const ia = read(IA, corpus), ib = read(IB, corpus), ba = read(BA, corpus), bb = read(BB, corpus);
  // sanity: the instrumented births print the same goals as the clean ones; pass one identical everywhere
  let textMismatch = 0, passOneDiff = 0, groupDiffBeyondReserve = 0, cards = 0; const passOneList = [];
  let targetMoves = 0; const targetBy = {};
  for (const [key, da] of ia) { const db = ib.get(key); const ca = ba.get(key), cb = bb.get(key);
    da.npcs.forEach((n, i) => { const m = db.npcs[i]; cards++;
      for (const v of ['short', 'long']) {
        if (n.goal?.[v] !== ca.npcs[i].goal?.[v] || m.goal?.[v] !== cb.npcs[i].goal?.[v]) textMismatch++;
        const ra = n.goal?._r, rb = m.goal?._r; if (!ra || !rb) continue;
        if (ra[`drawn${cap(v)}`] !== rb[`drawn${cap(v)}`] || ra[`drawnText${cap(v)}`] !== rb[`drawnText${cap(v)}`]) { passOneDiff++; passOneList.push(`${corpus} ${key} ${n.id} ${v}: ${ra[`drawnText${cap(v)}`]} -> ${rb[`drawnText${cap(v)}`]}`); }
        const ga = ra[`group${cap(v)}`], gb = rb[`group${cap(v)}`];
        if (JSON.stringify(ga) !== JSON.stringify(gb.slice(0, ga.length).map((w) => w.replace(/ \[R\]$/, '')).map((w, k) => (ga[k].endsWith(' [R]') ? w + ' [R]' : w))) && JSON.stringify(ga) !== JSON.stringify(gb.slice(0, ga.length))) groupDiffBeyondReserve++;
        const ta = JSON.stringify(n.goal?.intent?.[v]?.target ?? null), tb = JSON.stringify(m.goal?.intent?.[v]?.target ?? null);
        if (ta !== tb) { targetMoves++; const why = (m.goal?._refused || []).includes(v) ? 'refusal post-pass' : rb.rotated?.[v] || ra.rotated?.[v] ? 'pass-two rotation' : 'other'; targetBy[why] = (targetBy[why] || 0) + 1; }
      } }); }
  const C = {}; const E = []; const named = {};
  for (const l of outLines.filter((x) => x.includes(` ${corpus} `))) {
    const m = /OUT (\S+) (\S+) (\S+) (\S+) npcs\[(\d+)\]\.goal\.(short|long) /.exec(l); const [, , , key, id, idx, v] = m; const i = +idx;
    const na = ia.get(key).npcs[i], nb = ib.get(key).npcs[i]; const ra = na.goal._r, rb = nb.goal._r; const V = cap(v);
    let cause;
    if (String(na.goal[v]).startsWith("Learn one thing from ")) cause = 'A';
    else if (ra[`drawn${V}`] !== rb[`drawn${V}`] || ra[`drawnText${V}`] !== rb[`drawnText${V}`]) { cause = 'E'; E.push(l); }
    else if ((nb.goal._refused || []).includes(v)) cause = 'R refusal post-pass (secret matched by the code\'s town rows, not by goals-final venal)';
    else if (rb.repeat?.[v]) {
      // a pass-one repeat in both trees (pass one identical): pass two moved it
      const baseTook = ra[`final${V}`], afterTook = rb[`final${V}`]; const baseGroup = ra[`group${V}`].map((w) => w.replace(/ \[R\]$/, ''));
      const gb = rb[`group${V}`]; const at = Math.max(0, gb.findIndex((w) => w.replace(/ \[R\]$/, '') === ra[`drawn${V}`]));
      const order = gb.map((_, k) => gb[(at + k) % gb.length]);
      const takenAt = order.findIndex((w) => w.replace(/ \[R\]$/, '') === afterTook);
      const guardBefore = order.slice(0, takenAt).some((w) => w.endsWith(' [R]') && !baseGroup.includes(w.replace(/ \[R\]$/, '')));
      const baseRotated = !!ra.rotated?.[v];
      const stem = baseRotated ? 'P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated)' : 'P2: a pass-one repeat the base let STAND';
      if (guardBefore) cause = `B harsh-tie guard (${stem}; a refused reserve line passed over before the line taken)`;
      else if (!baseGroup.includes(afterTook)) cause = `${stem}; now takes a RESERVE line`;
      else if (ra.repeat?.[v] && ra.repeat[v] !== rb.repeat[v] && (ra.repeat[v] === 'twice' || ra.repeat[v] === 'twice-same-power')) cause = `${stem}; base rung ${ra.repeat[v]} -> ${rb.repeat[v]} (mirror rule or holders)`;
      else cause = `${stem}; takes another CELL line (the pass-two holders moved by an earlier rotation)`;
      if (!baseRotated) cause += ` [base rung ${ra.repeat?.[v]}]`;
    } else cause = 'X unexplained';
    C[cause] = (C[cause] || 0) + 1; (named[cause] ||= []).push(l.replace(/^  OUT \S+ /, ''));
  }
  res[corpus] = { textMismatch, cards, passOneDiff, passOneList, groupDiffBeyondReserve, targetMoves, targetBy, C, E, named, n: outLines.filter((x) => x.includes(` ${corpus} `)).length };
}
console.log(JSON.stringify(res, null, 1));
