import { test } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const T = '/home/user/settlement-engine', S = process.env.S;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const rx = (t) => new RegExp('^' + esc(t).replace(/\\\{\w+\\\}/g, '.+') + '$');
test('falsity', async () => {
  const fv = await import(`${T}/src/domain/facts/factVocabulary.js`);
  const { factsOf } = await import(`${T}/src/domain/facts/factsOf.js`);
  const { normalizeSettlement } = await import(`${T}/src/domain/normalizeSettlement.js`);
  const dlLines = []; const walkDL = (v, d = 0) => { if (!v || typeof v !== 'object' || d > 9) return; if (Array.isArray(v)) { v.forEach((x) => walkDL(x, d + 1)); return; } if (typeof v.text === 'string') dlLines.push({ text: v.text, rx: rx(v.text), decl: { needs: v.needs || [], excludes: v.excludes || [], crisis: [] } }); Object.values(v).forEach((x) => walkDL(x, d + 1)); };
  for (const f of readdirSync(`${T}/src/data/dailyLife`)) if (f.endsWith('.js')) walkDL(Object.values(await import(`${T}/src/data/dailyLife/${f}`)));
  const sp = new Map(); const walkSP = (v, block, key, d = 0) => { if (!v || typeof v !== 'object' || d > 12) return; if (Array.isArray(v)) { for (const x of v) if (x && typeof x === 'object' && 'vid' in x) sp.set(`${block}|${key}|${x.vid}`, x.marks || []); else walkSP(x, block, key, d + 1); return; } for (const [k, x] of Object.entries(v)) walkSP(x, /^DS-/.test(k) ? k : block, k, d + 1); };
  for (const f of readdirSync(`${T}/src/data/dossierStateProse`)) walkSP(await import(`${T}/src/data/dossierStateProse/${f}`), null, null);
  const M = JSON.parse(readFileSync(`${S}/d13-on-master.json`)), L = JSON.parse(readFileSync(`${S}/d13-on-line.json`));
  const judge = (decl, facts) => { const r = fv.declarationAdmits(decl, facts); if (r.admitted) return 'admitted'; const contradicted = [...decl.needs.filter((a) => fv.atomHolds(a, facts) === false), ...decl.excludes.filter((a) => fv.atomHolds(a, facts) === true)]; return contradicted.length ? 'false' : 'unknown-or-crisis'; };
  const out = { dl: {}, sp: { admitted: 0, false: 0, 'unknown-or-crisis': 0, notFound: 0 }, spEx: [] };
  for (const [seed, m] of Object.entries(M)) {
    const facts = factsOf(normalizeSettlement(JSON.parse(readFileSync(`${S}/d13-master-rec/${seed}.json`, 'utf8'))));
    for (const [slot, mt] of Object.entries(m.dlText)) { const lt = L[seed].dlText[slot]; if (mt === lt || !mt) continue; const hit = dlLines.find((x) => x.rx.test(mt)); if (!hit) continue; const j = judge(hit.decl, facts); (out.dl[slot] ||= {})[j] = ((out.dl[slot] ||= {})[j] || 0) + 1; }
    const lmap = new Map(L[seed].sp.map((p) => [p.path, p]));
    for (const p of m.sp) { const q = lmap.get(p.path); if (!q || p.sentence === q.sentence || p.poolKey !== q.poolKey || p.blockId !== q.blockId || JSON.stringify(p.vids) === JSON.stringify(q.vids)) continue;
      const marks = sp.get(`${p.blockId}|${p.poolKey}|${p.vids[0]}`); if (!marks) { out.sp.notFound++; continue; }
      let j; try { j = judge(fv.declarationOfMarks(marks), facts); } catch (e) { j = 'unknown-or-crisis'; } out.sp[j]++; if (j === 'admitted' && out.spEx.length < 5) out.spEx.push(`${seed} ${p.blockId} ${p.poolKey}: "${p.sentence}" -> "${q.sentence}"`); }
  }
  writeFileSync(`${S}/falsity.json`, JSON.stringify(out, null, 1));
}, 3600000);
