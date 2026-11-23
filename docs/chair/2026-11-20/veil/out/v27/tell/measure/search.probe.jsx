// R3-TELL unit 1, PASS 1: THE SEARCH FOR THE CRIMINAL SURFACE (a search, not a memory). Twin only, Reveal DM off and on.
// Over every birth of the gate's pool (140 at N=2) and every counterfactual B (92), each served page's leaves (exact paths;
// an empty list or object is a leaf: PRESENCE counts) under four settings of the record's own switch, then four tags per
// normalized path ([] for every index):
//   switch  the leaf differs between "Show everything criminal" (houses shown too) and "Hide everything criminal"
//   house   (A only) the leaf differs between allOpen (every criminal part shown but the hideable houses, hidden whole)
//           and the same with the houses shown: what hiding the houses moves, with every switch open
//   word    under "Show everything criminal", a string leaf with a criminal word (CRIM_RE)
//   key     under "Show everything criminal", a leaf whose path names a criminal key (KEY_RE)
// Out: { path: { switch, house, word, key, ex } } counts of pages (RV9_OUT).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, leaves, norm } from './tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const N = Number(process.env.RV9_N || 1); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const CRIM_RE = /crim|thie|smuggl|black.?market|\bfenc(e|es|ing)\b|bandit|outlaw|\bgangs?\b|underworld|illicit|contraband|covert|corrupt|brib|racket|extort|syndicate|cartel|underground|launder|poach|red.?light|slave|vice den|heist|cutpurse|pickpocket|assassin|drug|narcot/i;
const KEY_RE = /crim|covert|corrupt|capture|blackmarket|illicit|smuggl|thie|allegiance|underworld|isCriminal|contraband/i;
it('R3-TELL search', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const tally = {};
  const bump = (p, tag, ex) => { const r = (tally[p] ||= { switch: 0, house: 0, word: 0, key: 0, ex: null }); r[tag] += 1; if (ex && !r.ex) r.ex = String(ex).slice(0, 120); };
  const diff = (a, b, tag) => {
    const A = leaves(a); const B = leaves(b); const seen = new Set();
    for (const [p, v] of A) if (B.get(p) !== v) seen.add(norm(p));
    for (const [p] of B) if (!A.has(p)) seen.add(norm(p));
    for (const p of seen) bump(p, tag);
  };
  const page = (rec, dm, deltas) => { const ov = V.write(deltas); return V.twin(rec, dm, ov); };
  let pages = 0;
  for (const b of E.pool(N, SHARD)) {
    let A; try { A = E.birth(b.cfg, b.seed, null); } catch { continue; }
    const hidden = (A.institutions || []).filter((h) => E.isHideableHouse(h));
    let B = null; if (hidden.length) { try { B = E.birth(b.cfg, b.seed, (h) => E.isHideableHouse(h)); } catch { B = null; } }
    for (const dm of [false, true]) for (const [doc, isA] of [[A, true], [B, false]]) {
      if (!doc) continue;
      const sc = V.screen(doc, dm);
      const shown = V.sw.setCriminalVeil(V.opened(['tab:plot_hooks']), sc.defaults, false, sc.present, sc.model);
      const off = V.sw.setCriminalVeil(V.opened(['tab:plot_hooks']), sc.defaults, true, sc.present, sc.model);
      const pShown = page(doc, dm, shown); const pOff = page(doc, dm, off); pages += 2;
      diff(pShown, pOff, 'switch');
      if (isA && hidden.length) {
        const allOpen = shown.filter((d) => !String(d.address).startsWith('card:institution:'));
        diff(page(doc, dm, allOpen), pShown, 'house'); pages += 1;
      }
      for (const [p, v] of leaves(pShown)) {
        if (typeof v === 'string' && CRIM_RE.test(v)) bump(norm(p), 'word', v);
        if (KEY_RE.test(p)) bump(norm(p), 'key');
      }
    }
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify({ pages, tally }));
}, 14_400_000);
