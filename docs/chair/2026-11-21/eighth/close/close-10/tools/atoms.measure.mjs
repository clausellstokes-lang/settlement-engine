import { test } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const T = '/home/user/settlement-engine';
test('atoms', async () => {
  const fv = await import(`${T}/src/domain/facts/factVocabulary.js`);
  const { factsOf } = await import(`${T}/src/domain/facts/factsOf.js`);
  const { normalizeSettlement } = await import(`${T}/src/domain/normalizeSettlement.js`);
  const atoms = new Set(); const texts = [];
  const walk = (v, d = 0) => { if (!v || typeof v !== 'object' || d > 9) return; if (Array.isArray(v)) { v.forEach((x) => walk(x, d + 1)); return; }
    if (typeof v.text === 'string') texts.push(v.text);
    for (const k of ['needs', 'excludes']) if (Array.isArray(v[k])) v[k].forEach((a) => typeof a === 'string' && atoms.add(a));
    if (Array.isArray(v.marks)) { try { const dcl = fv.declarationOfMarks(v.marks); dcl.needs.forEach((a) => atoms.add(a)); dcl.excludes.forEach((a) => atoms.add(a)); } catch {} }
    Object.values(v).forEach((x) => walk(x, d + 1)); };
  for (const f of readdirSync(`${T}/src/data/dailyLife`)) if (f.endsWith('.js')) walk(Object.values(await import(`${T}/src/data/dailyLife/${f}`)));
  for (const f of readdirSync(`${T}/src/data/dossierStateProse`)) walk(Object.values(await import(`${T}/src/data/dossierStateProse/${f}`)));
  const A = [...atoms].sort(); const unknownM = {}, unknownL = {}; let n = 0;
  for (const f of readdirSync(process.env.MDIR).sort()) {
    const m = factsOf(normalizeSettlement(JSON.parse(readFileSync(`${process.env.MDIR}/${f}`, 'utf8'))));
    const l = factsOf(normalizeSettlement(JSON.parse(readFileSync(`${process.env.LDIR}/${f}`, 'utf8')))); n++;
    for (const a of A) { let hm, hl; try { hm = fv.atomHolds(a, m); } catch { hm = 'ERR'; } try { hl = fv.atomHolds(a, l); } catch { hl = 'ERR'; }
      if (hm === undefined) unknownM[a] = (unknownM[a] || 0) + 1; if (hl === undefined) unknownL[a] = (unknownL[a] || 0) + 1; }
  }
  const lacks = A.filter((a) => (unknownM[a] || 0) > (unknownL[a] || 0)).map((a) => [a, unknownM[a] || 0, unknownL[a] || 0]);
  writeFileSync(process.env.OUT, JSON.stringify({ n, atoms: A.length, templates: texts.length, lacks, texts }));
}, 3600000);
