// V33-C1 (STORED-UNIVERSE) PIECE 3: THE PROSE THAT HOLDS A WITHHELD FIELD, MEASURED ON THE SERVED PAGE. No line of 212 or the twin.
// Every stored document of RV9_STORED_DIR (stored.probe.jsx's docs/), read by THIS tree's twin (tell-common.mjs :: loadVeil ::
// twin) under every gated setting tell-common.mjs :: settings computes on the document (own, g:000..g:110, allOpen, off; g:111 is
// own), Reveal DM off and on. On each read:
//   WITHHELD  a stored string leaf (outside publicProse) the page serves NOWHERE as a string leaf outside publicProse. Only
//             strings that can be told apart from prose's own words: 40 characters or more, or a name (a capital, a space, 6+).
//   HELD      a served publicProse block (publicProse.blocks.<site>, every string leaf under it) that holds the withheld value
//             WORD FOR WORD (the whole value inside the block's text), or a CUT of it of at least 40 characters (any 40-character
//             window of the value found in the block's text).
//   ROW       the registry row of the withheld leaf's generalized path (legacy.probe.jsx :: rowOf, its prefix walk), else
//             "(unregistered) <first two segments>".
// Out: RV9_OUT_DIR/prose-shard<s>.json: per document { seed, role, held: { row: { reads, whole, cut, sites: {site: n}, ex } } }.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { loadEngine, loadVeil, isRec } from '../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const W = 40;
/** Every string leaf outside publicProse: [generalized path, value]; and the prose blocks' strings by site. */
const split = (doc) => {
  const strs = []; const prose = {};
  const go = (x, g, site) => {
    if (typeof x === 'string') { if (site) (prose[site] ||= []).push(x); else strs.push([g, x]); return; }
    if (Array.isArray(x)) { for (const y of x) go(y, `${g}[]`, site); return; }
    if (isRec(x)) for (const [k, y] of Object.entries(x)) {
      const q = g ? `${g}.${k}` : k;
      if (!site && q === 'publicProse') { const b = isRec(y?.blocks) ? y.blocks : {}; for (const [s, v] of Object.entries(b)) go(v, `publicProse.blocks.${s}`, s); continue; }
      go(y, q, site);
    }
  };
  go(doc, '', null); return { strs, prose };
};
const telling = (s) => s.length >= W || (s.length >= 6 && /^[A-Z]/.test(s) && /\s/.test(s));

it('V33-C1 prose', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const REG = await import(`${SRC}/src/domain/veil/rosterChoiceRegistry.js`);
  const ROWS = REG.REGISTRY_ROWS.filter((x) => typeof x.path === 'string' && x.path).map((x) => ({ id: x.id, re: new RegExp(x.path) }));
  const rowCache = new Map();
  const rowOf = (np) => {
    if (rowCache.has(np)) return rowCache.get(np);
    const segs = np.split(/(?=\.)|(?=\[\])/); let id = null;
    for (let n = segs.length; n > 0 && !id; n -= 1) { const p = segs.slice(0, n).join(''); const hit = ROWS.find((x) => x.re.test(p)); if (hit) id = hit.id; }
    id ||= `(unregistered) ${segs.slice(0, 2).join('')}`; rowCache.set(np, id); return id;
  };
  const DIR = process.env.RV9_STORED_DIR; const OUTD = process.env.RV9_OUT_DIR; mkdirSync(OUTD, { recursive: true });
  const LIMIT = Number(process.env.RV9_LIMIT || 0);
  const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index)
    .sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
  const out = []; let i = 0; const t0 = Date.now();
  for (const m of index) {
    i += 1; if (i % SHARD[1] !== SHARD[0]) continue; if (LIMIT && i > LIMIT * SHARD[1]) break;
    const doc = JSON.parse(readFileSync(`${DIR}/${m.seed}.json`, 'utf8'));
    const { strs: stored } = split(doc);
    const cand = stored.filter(([, s]) => telling(s));
    const held = {}; let reads = 0;
    for (const dm of [false, true]) {
      const { deltas } = V.settings(doc, dm);
      for (const [k, d] of Object.entries(deltas)) {
        if (k === 'g:111') continue;
        reads += 1;
        const page = V.twin(doc, dm, V.write(d)); const { strs: served, prose } = split(page);
        const servedSet = new Set(served.map(([, s]) => s));
        const sites = Object.entries(prose).map(([site, list]) => {
          const text = list.join('\n'); const win = new Set(); for (let j = 0; j + W <= text.length; j += 1) win.add(text.slice(j, j + W));
          return { site, text, win };
        });
        if (!sites.length) continue;
        const seenRead = new Set();
        for (const [g, s] of cand) {
          if (servedSet.has(s)) continue;
          let hit = null;
          for (const b of sites) {
            if (b.text.includes(s)) { hit = { site: b.site, how: 'whole' }; break; }
            if (s.length >= W) { for (let j = 0; j + W <= s.length; j += 1) if (b.win.has(s.slice(j, j + W))) { hit = { site: b.site, how: 'cut', at: j }; break; } if (hit) break; }
          }
          if (!hit) continue;
          const row = rowOf(g); const key = `${row}|${hit.site}`;
          const o = (held[row] ||= { reads: 0, whole: 0, cut: 0, sites: {}, paths: {}, settings: {}, ex: null });
          if (!seenRead.has(row)) { seenRead.add(row); o.reads += 1; o.settings[`${dm ? 'dm' : 'off'}|${k}`] = 1; }
          if (!seenRead.has(key)) { seenRead.add(key); o.sites[hit.site] = (o.sites[hit.site] || 0) + 1; }
          o[hit.how] += 1; o.paths[g] = (o.paths[g] || 0) + 1;
          o.ex ||= `${dm ? 'dm' : 'off'}|${k} ${g} -> publicProse.blocks.${hit.site} (${hit.how}): ${s.slice(hit.at || 0, (hit.at || 0) + 140)}`;
        }
      }
    }
    const houses = (Array.isArray(doc.institutions) ? doc.institutions : []).filter((h) => isRec(h) && E.isHideableHouse(h)).map((h) => h.name);
    out.push({ seed: m.seed, role: m.role, size: m.size, houses, reads, held });
  }
  writeFileSync(`${OUTD}/prose-shard${SHARD[0]}.json`, JSON.stringify({ meta: { src: SRC, dir: DIR, shard: SHARD, ms: Date.now() - t0, ended: new Date().toISOString() }, births: out }));
}, 14_400_000);
