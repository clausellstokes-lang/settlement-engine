// V39-C2M (seated by VEIL-39, chain C unit C2): THE STORED PROSE'S CURE "(c)", MEASURED BEFORE IT IS RULED. A measure only.
// Run by the probe runner (/var/tmp/v18/rv9/vitest.config.mjs) with RV6_SRC = the SCRATCH tree (the one-line change:
// publicProseCompose.js's source = rederiveForPage(withholdAlways(publicVeiledRecordOf(s)))), RV9_STORED_DIR = stored.probe.jsx's
// docs/ (C1's today-born stored documents), RV9_OUT_DIR, RV9_SHARD=<s>/<n>, RV9_LIMIT (documents per shard), RV9_MODE:
//
//   m1  THE COST ON EQUALITY. Per document d (its publicProse removed): A = publicVeiledRecordOf(d) (the base composer's source),
//       B = withholdAlways(A), C = rederiveForPage(B) (the call the shared page makes, gallery.js :: sanitizeDossier; its one
//       option `unveiled` defaults false, the served read's value; the variant `unveiled: true` is composed beside it). COMPOSE is
//       a scratch copy of publicProseCompose.js :: composePublicProse's loop with its source (and ctx.veiledRecord) given. Controls:
//       COMPOSE(A) against the stored pp-1 (the copy reproduces the save), and the scratch tree's own composePublicProse(d) against
//       COMPOSE(C) (the copy is the change). Each site's block is RESOLVED (publicProse.js :: publicProseOf, the alias hop) and
//       compared leaf by leaf (tell-common.mjs :: leaves). A differing leaf's CAUSE, by ablation: every input leaf A and C
//       disagree on, grouped by its generalized path, is put back to A's value one group at a time and the document recomposed;
//       the groups whose restoring alone gives the stored leaf are its cause (two levels: the coarse group, the first two steps of
//       the path, then each fine group inside a coarse group that moves the leaf; a coarse group that restores it with no fine
//       one alone is named "(jointly)"). Kinds: (i) the cause is withheld (differs A->B) and not re-derived (not B->C), and the
//       withheld value's own text (for a cut, the part cut) is in the stored leaf and not the composed one: its text gone,
//       intended; (ii-w) the cause is withheld and not re-derived, but no text of it is gone: a sentence changed because an
//       input the page does not re-derive is absent (the input named); (ii-r) the cause is re-derived (differs B->C) and the
//       re-derived value differs from the stored one (the input named); (ii-j) only restoring every input together restores
//       it; (iii) anything else: nothing restores it, or the control already differs there.
//       Also writes RV9_CDOCS/<seed>.json: the stored document with its publicProse REPLACED by the scratch composer's (M2's feed).
//   m3  THE THREE RECOMPOSE ROWS on hiding reads (the twin, tell-common.mjs :: loadVeil, every gated setting C1's prose.probe.jsx
//       reads: own, g:000..g:110, allOpen, off; both Reveals), places with a hideable house only (elsewhere nothing is hidden).
//       Where the served field differs from the stored: (a) the stored block holds the stored field's text word for word; (b)
//       that text replaced by the served field's text gives exactly the block the BASE composer (COMPOSE over
//       publicVeiledRecordOf) gives from the record carrying the served field.
//       M2x (every place, every read): the recent-conflict sentence (c) composes from (the nothing-hidden share's re-derivation)
//       against the one the page's own reader (rederiveRecentConflict) draws over that read's served document.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { loadEngine, loadVeil, isRec, clone, leaves, norm } from '../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const MODE = process.env.RV9_MODE || 'm1';
const CUT = (s) => (typeof s === 'string' && s.length > 400 ? `${s.slice(0, 400)}…` : s);
/** Split a leaves() path into steps: ['a', 'b', 3, 'c']. */
const steps = (p) => { const out = []; for (const m of p.matchAll(/([^.[\]]+)|\[(\d+)\]/g)) out.push(m[2] !== undefined ? Number(m[2]) : m[1]); return out; };
const setAt = (o, p, json) => {
  const st = steps(p); let x = o;
  for (let i = 0; i < st.length - 1; i += 1) { if (!x[st[i]] || typeof x[st[i]] !== 'object') x[st[i]] = typeof st[i + 1] === 'number' ? [] : {}; x = x[st[i]]; }
  x[st[st.length - 1]] = JSON.parse(json);
};
const delAt = (o, p) => {
  const st = steps(p); let x = o;
  for (let i = 0; i < st.length - 1; i += 1) { if (!x || typeof x !== 'object') return; x = x[st[i]]; }
  if (x && typeof x === 'object') delete x[st[st.length - 1]];
};

it(`V39-C2M ${MODE}`, async () => {
  const PP = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { PUBLIC_PROSE_SITES, composePublicProse: scratchCompose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { publicVeiledRecordOf } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const { withholdAlways } = await import(`${SRC}/src/domain/display/galleryWithholdAlways.js`);
  const { rederiveForPage, rederiveRecentConflict } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const E = await loadEngine(SRC);
  /** THE SCRATCH COPY of composePublicProse's loop (publicDossier false), its source given. */
  const COMPOSE = (rec) => {
    const blocks = {}; const ctx = { veiledRecord: rec };
    for (const [site, draw] of PUBLIC_PROSE_SITES) {
      try { const shipped = PP.shippedProseOf(draw(rec, false, ctx)); if (shipped !== null && shipped !== undefined) blocks[site] = shipped; } catch { /* SILENT */ }
    }
    return { v: PP.PUBLIC_PROSE_VERSION, blocks: PP.aliasRepeatedRungs(blocks) };
  };
  /** The named sites only, unaliased (a resolved alias is the earlier site's identical rung): per site, the shipped block's leaves. */
  const COMPOSE_AT = (rec, sites) => {
    const out = new Map(); const ctx = { veiledRecord: rec }; const want = new Set(sites);
    for (const [site, draw] of PUBLIC_PROSE_SITES) {
      if (!want.has(site)) continue;
      try { const shipped = PP.shippedProseOf(draw(rec, false, ctx)); if (shipped !== null && shipped !== undefined) out.set(site, leaves(shipped)); } catch { /* SILENT */ }
    }
    return out;
  };
  /** Per site, the resolved block's leaves. */
  const resolved = (pp) => {
    const out = new Map(); const holder = { publicProse: pp };
    for (const site of Object.keys(pp?.blocks || {})) out.set(site, leaves(PP.publicProseOf(holder, site)));
    return out;
  };
  /** Differing leaves between two resolved projections: [{ site, path, a, b }]. */
  const diff = (ra, rb) => {
    const out = [];
    for (const site of new Set([...ra.keys(), ...rb.keys()])) {
      const la = ra.get(site) || new Map(); const lb = rb.get(site) || new Map();
      for (const p of new Set([...la.keys(), ...lb.keys()])) if (la.get(p) !== lb.get(p)) out.push({ site, path: p, a: la.get(p), b: lb.get(p) });
    }
    return out;
  };
  const DIR = process.env.RV9_STORED_DIR; const OUTD = process.env.RV9_OUT_DIR; mkdirSync(OUTD, { recursive: true });
  const CDOCS = process.env.RV9_CDOCS; if (CDOCS) mkdirSync(CDOCS, { recursive: true });
  const LIMIT = Number(process.env.RV9_LIMIT || 0);
  const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index)
    .sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
  const out = []; let i = 0; let n = 0; const t0 = Date.now();
  const V = MODE === 'm3' ? await loadVeil(SRC) : null;
  for (const m of index) {
    i += 1; if (i % SHARD[1] !== SHARD[0]) continue; if (LIMIT && n >= LIMIT) break; n += 1;
    const doc = JSON.parse(readFileSync(`${DIR}/${m.seed}.json`, 'utf8'));
    const d = clone(doc); delete d.publicProse;
    const houses = (Array.isArray(doc.institutions) ? doc.institutions : []).filter((h) => isRec(h) && E.isHideableHouse(h)).map((h) => h.name);
    const stored = resolved(doc.publicProse);
    if (MODE === 'm1') {
      const A = publicVeiledRecordOf(clone(d));
      const B = withholdAlways(clone(A));
      const C = rederiveForPage(clone(B));
      const CT = rederiveForPage(clone(B), { unveiled: true });
      const base = COMPOSE(clone(A)); const comp = COMPOSE(clone(C)); const compT = COMPOSE(clone(CT));
      const scratch = scratchCompose(clone(d));
      const control = diff(stored, resolved(base));
      const scratchVsCopy = diff(resolved(scratch), resolved(comp)).length;
      const rC = resolved(comp); const delta = diff(stored, rC);
      const deltaT = diff(stored, resolved(compT));
      // THE INPUTS A and C disagree on, by generalized path; each group's kind from A->B and B->C.
      const lA = leaves(A); const lB = leaves(B); const lC = leaves(C);
      const groups = new Map();
      for (const p of new Set([...lA.keys(), ...lC.keys()])) {
        if (lA.get(p) === lC.get(p)) continue;
        const g = norm(p); const o = groups.get(g) || { paths: [], ab: false, bc: false };
        o.paths.push(p); if (lA.get(p) !== lB.get(p)) o.ab = true; if (lB.get(p) !== lC.get(p)) o.bc = true; groups.set(g, o);
      }
      // ABLATION, two levels: COARSE groups (the first two steps of the generalized path), then, inside a coarse group that
      // restores or moves a differing leaf, each FINE group (the whole generalized path). Only the differing sites are recomposed.
      const key = (x) => `${x.site}\u0000${x.path}`;
      const need = [...new Set(delta.map((x) => x.site))];
      const atCheck = need.length ? diff(new Map(need.filter((x) => rC.has(x)).map((x) => [x, rC.get(x)])), COMPOSE_AT(clone(C), need)).length : 0;
      const coarseOf = (g) => g.split('.').slice(0, 2).join('.');
      const coarse = new Map();
      for (const [g, o] of groups) { const c = coarseOf(g); const k = coarse.get(c) || { fine: [], ab: false, bc: false }; k.fine.push(g); k.ab ||= o.ab; k.bc ||= o.bc; coarse.set(c, k); }
      const restoreRun = (gs) => {
        const R = clone(C);
        for (const g of gs) for (const p of groups.get(g).paths) { if (lA.has(p)) setAt(R, p, lA.get(p)); else delAt(R, p); }
        return COMPOSE_AT(R, need);
      };
      const causes = new Map(delta.map((x) => [key(x), { cfix: [], cmove: [], fix: [], all: false }]));
      if (delta.length) {
        for (const [c, k] of coarse) {
          const rR = restoreRun(k.fine); let moved = false;
          for (const x of delta) { const v = rR.get(x.site)?.get(x.path); const o = causes.get(key(x)); if (v === x.a) { o.cfix.push(c); moved = true; } else if (v !== x.b) { o.cmove.push(c); moved = true; } }
          if (moved && k.fine.length > 1) for (const g of k.fine) {
            const rF = restoreRun([g]);
            for (const x of delta) { const o = causes.get(key(x)); if ((o.cfix.includes(c) || o.cmove.includes(c)) && rF.get(x.site)?.get(x.path) === x.a) o.fix.push(g); }
          } else if (moved) for (const x of delta) { const o = causes.get(key(x)); if (o.cfix.includes(c)) o.fix.push(k.fine[0]); }
        }
        if ([...causes.values()].some((o) => !o.fix.length && !o.cfix.length)) {
          const rAll = restoreRun([...groups.keys()]);
          for (const x of delta) { const o = causes.get(key(x)); o.all = rAll.get(x.site)?.get(x.path) === x.a; }
        }
      }
      /** (i) only where the withheld value's OWN TEXT is in the stored leaf and not in the composed one (a cut keeps its word: the cause). */
      const textGone = (gs, x) => gs.some((g) => groups.get(g).paths.some((p) => {
        const a = lA.has(p) ? JSON.parse(lA.get(p)) : null; if (typeof a !== 'string' || a.length < 8) return false;
        const b = lB.has(p) ? JSON.parse(lB.get(p)) : null; const t = typeof b === 'string' && a.startsWith(b) ? a.slice(b.length).trim() : a;
        return t.length >= 8 && String(x.a ?? '').includes(JSON.stringify(t).slice(1, -1)) && !String(x.b ?? '').includes(JSON.stringify(t).slice(1, -1));
      }));
      const ctl = new Set(control.map(key));
      const leafs = delta.map((x) => {
        const o = causes.get(key(x));
        const gs = o.fix.length ? o.fix : o.cfix.flatMap((c) => coarse.get(c).fine);
        const label = o.fix.length ? o.fix.join(' + ') : o.cfix.map((c) => `${c} (jointly)`).join(' + ');
        let kind; let why;
        if (ctl.has(key(x))) { kind = 'iii'; why = 'the control (the base composer) already differs here'; }
        else if (gs.length) {
          const re = gs.filter((g) => groups.get(g).bc);
          if (re.length) { kind = 'ii-r'; why = o.fix.length ? re.join(' + ') : label; }
          else { kind = textGone(gs, x) ? 'i' : 'ii-w'; why = label; }
        } else if (o.all) { kind = 'ii-j'; why = `jointly, across: ${o.cmove.join(' + ') || '(no single coarse group moves it)'}`; }
        else { kind = 'iii'; why = `no input restores it${o.cmove.length ? `; moved by ${o.cmove.join(' + ')}` : ''}`; }
        return { site: x.site, path: x.path, kind, why, stored: CUT(x.a), composed: CUT(x.b) };
      });
      const sitesT = [...new Set(deltaT.map((x) => x.site))];
      out.push({ seed: m.seed, role: m.role, size: m.size, houses: houses.length, control: control.length, atCheck, controlEx: control.slice(0, 2).map((x) => ({ ...x, a: CUT(x.a), b: CUT(x.b) })), scratchVsCopy,
        groups: Object.fromEntries([...groups].map(([g, o]) => [g, `${o.ab ? 'AB' : ''}${o.bc ? 'BC' : ''}`])), leafs,
        unveiledTrue: { leafs: deltaT.length, sites: sitesT, sameAsDefault: JSON.stringify(deltaT) === JSON.stringify(delta) } });
      if (CDOCS) writeFileSync(`${CDOCS}/${m.seed}.json`, JSON.stringify({ ...doc, publicProse: scratch }));
    } else {
      // M2x, THE SENTENCE (c) SHIPS against THE SENTENCE THE PAGE DRAWS on the same read: (c)'s source sentence (C's
      // recentConflict, the nothing-hidden share's re-derivation) and whether (c)'s power:governance block holds it word for word,
      // against pageRederive.js :: rederiveRecentConflict over that read's served document (the page's own reader).
      const Cm = rederiveForPage(withholdAlways(publicVeiledRecordOf(clone(d))));
      const cSentence = isRec(Cm?.powerStructure) && typeof Cm.powerStructure.recentConflict === 'string' ? Cm.powerStructure.recentConflict : null;
      const cGov = JSON.stringify(PP.publicProseOf({ publicProse: scratchCompose(clone(d)) }, 'power:governance') ?? null);
      const rc = { cSentence: cSentence !== null, cHolds: cSentence !== null && cGov.includes(JSON.stringify(cSentence).slice(1, -1)), reads: 0, same: 0, differ: 0, pageNone: 0, ex: [] };
      const ROWS = { 'safety.guardEffectivenessDesc': ['economicState', 'safetyProfile', 'guardEffectivenessDesc'], 'economy.complexity': ['economicState', 'economicComplexity'], 'safety.safetyDesc': ['economicState', 'safetyProfile', 'safetyDesc'] };
      const at = (o, path) => path.reduce((x, k) => (isRec(x) ? x[k] : undefined), o);
      const rows = {}; const cache = new Map();
      for (const dm of [false, true]) {
        const { deltas } = V.settings(doc, dm);
        for (const [k, dl] of Object.entries(deltas)) {
          if (k === 'g:111') continue;
          const page = V.twin(doc, dm, V.write(dl));
          rc.reads += 1;
          const pr = rederiveRecentConflict(clone(page)); const ps = isRec(pr?.powerStructure) && typeof pr.powerStructure.recentConflict === 'string' ? pr.powerStructure.recentConflict : null;
          if (ps === null) rc.pageNone += 1; else if (ps === cSentence) rc.same += 1; else { rc.differ += 1; if (rc.ex.length < 2) rc.ex.push({ read: `${dm ? 'dm' : 'off'}|${k}`, shipped: CUT(cSentence), page: CUT(ps) }); }
          if (!houses.length) continue;
          for (const [row, path] of Object.entries(ROWS)) {
            const sv = at(doc, path); const pv = at(page, path);
            if (typeof sv !== 'string' || pv === sv) continue;
            const o = (rows[row] ||= { reads: 0, absent: 0, held: 0, notHeld: 0, equal: 0, differ: 0, ex: [] });
            o.reads += 1;
            if (typeof pv !== 'string') { o.absent += 1; continue; }
            const ck = `${row}\u0000${pv}`;
            if (!cache.has(ck)) {
              const R = clone(d); let x = R; for (const s of path.slice(0, -1)) x = x[s]; x[path[path.length - 1]] = pv;
              const owner = resolved(COMPOSE(publicVeiledRecordOf(R)));
              const res = { holds: [], equal: true, ex: null };
              for (const [site, ls] of stored) {
                const hit = [...ls.values()].some((v) => v.includes(JSON.stringify(sv).slice(1, -1)));
                if (!hit) continue; res.holds.push(site);
                const sub = new Map([...ls].map(([p, v]) => { const x = JSON.parse(v); return [p, typeof x === 'string' ? JSON.stringify(x.split(sv).join(pv)) : v]; }));
                const ow = owner.get(site) || new Map();
                for (const p of new Set([...sub.keys(), ...ow.keys()])) if (sub.get(p) !== ow.get(p)) { res.equal = false; res.ex ||= { site, path: p, substituted: CUT(sub.get(p)), ownerComposed: CUT(ow.get(p)) }; }
              }
              cache.set(ck, res);
            }
            const res = cache.get(ck);
            if (!res.holds.length) { o.notHeld += 1; continue; }
            o.held += 1; if (res.equal) o.equal += 1; else { o.differ += 1; if (o.ex.length < 5) o.ex.push({ read: `${dm ? 'dm' : 'off'}|${k}`, holds: res.holds, stored: CUT(sv), served: CUT(pv), ...res.ex }); }
          }
        }
      }
      out.push({ seed: m.seed, role: m.role, houses: houses.length, rows, rc });
    }
  }
  writeFileSync(`${OUTD}/${MODE}-shard${SHARD[0]}.json`, JSON.stringify({ meta: { src: SRC, dir: DIR, shard: SHARD, n, ms: Date.now() - t0, ended: new Date().toISOString() }, births: out }));
}, 14_400_000);
