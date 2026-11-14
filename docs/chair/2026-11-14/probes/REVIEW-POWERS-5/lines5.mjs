// REVIEW-POWERS-5 lines5.mjs — TREE=<tip tree> BTREE=<base tree> CORPUS=<tip corpus> BCORPUS=<base corpus> [DUMPS=<tip dumps>] OUT=<file.json> node lines5.mjs
// Step 1: every line class the stage 3909655c3..0ea65f574 added or re-conditioned, found in every town of a corpus, with the
// town's own record beside it (the facts the line claims), and whether it prints on the rendered page (DUMPS). The
// base corpus is the same seeds born at the stage's base, so a print is marked NEW where the base town printed otherwise.
// Reads only; draws nothing. The verdict is the reader's, read from the rows (REVIEW-POWERS-5-LINES-READ.md).
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE, BT = process.env.BTREE;
const load = (f) => zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => JSON.parse(l));
const rows = load(process.env.CORPUS);
const BASE = new Map(load(process.env.BCORPUS).map((r) => [r.seed, r.s]));
const dumpOf = (seed) => { if (!process.env.DUMPS) return null; try { return fs.readFileSync(`${process.env.DUMPS}/${seed}.txt`, 'utf8'); } catch { return null; } };
const tabOf = (d, name) => { if (!d) return null; const i = d.indexOf(`== ${name} ==`); if (i < 0) return ''; const j = d.indexOf('\n== ', i + 5); return d.slice(i, j < 0 ? undefined : j); };
const { governingModifierWordsOf, modifierFamilyOf } = await import(T + '/src/domain/display/governingModifierWords.js');
const { governingFactionOf, nameOf } = await import(T + '/src/domain/rulingPower.js');
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js');
const { magicOf } = await import(T + '/src/domain/facts/magic.js');
const { practisingInstitutions } = await import(T + '/src/domain/magicReliance.js');
const { dmPowerViewOf } = await import(T + '/src/domain/people/patronage.js');
const { dmPowerViewOf: dmPowerViewOfBase } = await import(BT + '/src/domain/people/patronage.js');
const stressOf = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type).filter(Boolean);
const RAW = ['arcane-advised', 'mage-advised', 'military-dominated', 'defended', 'arms-backed', 'theocratic-aligned', 'church-guided', 'commerce-driven', 'merchant-led', 'corruption-riddled', 'compromised'];
const out = { chip: [], rawOnScreen: [], pdfRaw: [], stability: [], conflict: [], hall: [], inn: [], n: 0, dumps: 0 };
for (const { seed, s } of rows) {
  out.n++; const b = BASE.get(seed); const d = dumpOf(seed); if (d) out.dumps++;
  const power = tabOf(d, 'Systems/Power');
  const st = stressOf(s); const tier = s.tier; const f = factsOf(s); const ps = s.powerStructure || {};
  const gov = governingFactionOf(s); const key = gov?.modifier || null; const words = governingModifierWordsOf(s);
  const facs = (ps.factions || []).map((x) => ({ n: nameOf(x), cat: x.category, p: x.power, gov: !!x.isGoverning, crim: x.isCriminal || undefined }));
  const hallT = (() => { try { return dmPowerViewOf(s)?.hall || null; } catch (e) { return { err: e.message }; } })();
  const hallB = b ? (() => { try { return dmPowerViewOfBase(b)?.hall || null; } catch (e) { return { err: e.message }; } })() : null;
  if (key) {
    const powerLine = power ? (power.split('\n').find((l) => l.startsWith('The power')) || '') : null;
    out.chip.push({ seed, tier, st, key, family: modifierFamilyOf(key), words, ruler: nameOf(gov), rulerCat: gov?.category, powerLine,
      onPage: powerLine == null ? null : (words ? powerLine.endsWith(words) : false),
      facts: { crime: f.crime, guard: !!f.guardPresence, sacred: f.sacredHouse ? (f.sacredHouse.name || true) : false, market: !!f.market, guild: f.guild ? (f.guild.name || true) : false,
        magic: magicOf(s).functions === true, arcaneHouses: practisingInstitutions(s).map((i) => i.name || i), captureRung: ps.criminalCaptureState || 'none', hallLine: hallT?.line || null },
      roster: facs, rels: (ps.factionRelationships || []).filter((r) => (r.pair || []).includes(nameOf(gov))).map((r) => `${r.type}:${(r.pair || []).join('>')}`) });
  }
  if (d) { for (const k of RAW) { const re = new RegExp(`(^|[^a-z-])${k}([^a-z-]|$)`, 'im'); const hit = d.split('\n').filter((l) => re.test(l) && !/^== /.test(l)); if (hit.length) out.rawOnScreen.push({ seed, k, lines: hit.slice(0, 3) }); } }
  if (key) out.pdfRaw.push({ seed, key });
  // stability
  const sT = ps.stability, sB = b?.powerStructure?.stability;
  if (sT !== sB) {
    const stabLine = power ? (() => { const L = power.split('\n'); const i = L.indexOf('Stability'); return i >= 0 ? L[i + 1] : null; })() : null;
    out.stability.push({ seed, tier, st, base: sB, tip: sT, readiness: s.defenseProfile?.readiness?.label, readinessScore: s.defenseProfile?.readiness?.score, baseReadiness: b?.defenseProfile?.readiness?.label, onPage: stabLine, legit: [b?.powerStructure?.publicLegitimacy?.label, ps.publicLegitimacy?.label] });
  }
  // conflict
  const cT = ps.recentConflict, cB = b?.powerStructure?.recentConflict;
  if (cT !== cB) {
    const inst = (s.institutions || []).map((i) => i.name);
    out.conflict.push({ seed, tier, st, base: cB, tip: cT, onPage: d ? (d.includes(String(cT || '').slice(0, 60))) : null,
      facts: { market: f.market ? (f.market.name || true) : false, guard: !!f.guardPresence, guild: !!f.guild,
        court: inst.filter((n) => /court|magistrat|judge|justic|assiz|tribunal/i.test(n)),
        military: inst.filter((n) => /garrison|barracks|militia|watch|guard|mercenar/i.test(n)),
        noble: facs.filter((x) => x.cat === 'noble').map((x) => x.n), crime: f.crime, govType: ps.government } });
  }
  // hall
  if ((hallT?.line || null) !== (hallB?.line || null)) {
    out.hall.push({ seed, tier, st, rung: hallT?.rung, base: hallB?.line, tip: hallT?.line, crime: f.crime, ruler: nameOf(gov), rulerCat: gov?.category,
      criminalPowers: facs.filter((x) => x.cat === 'criminal' || x.crim).map((x) => `${x.n} ${x.p}`), onPage: d ? d.includes(String(hallT?.line || '').slice(0, 70)) : null,
      three: (() => { try { return (dmPowerViewOf(s)?.rulingThree || []).map((x) => `${x.rank}:${x.name}`); } catch { return null; } })() });
  }
  // the coaching-inn keeper
  const bn = new Map((b?.npcs || []).map((n) => [n.id, n]));
  for (const n of s.npcs || []) {
    if (!/coaching-inn keeper/.test(String(n.title || ''))) continue;
    const o = bn.get(n.id);
    out.inn.push({ seed, tier, st, crisisKinds: f.crisis?.kinds, name: n.name, imp: n.presentation?.impression, beh: n.presentation?.behaviour, disp: n.presentation?.disposition,
      baseImp: o?.presentation?.impression, secret: n.secret?.what, baseSecret: o?.secret?.what, onPage: d ? d.includes(String(n.presentation?.impression || '').slice(0, 50)) : null,
      route: f.route, roads: s.config?.tradeRouteAccess });
  }
}
fs.writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
console.log('towns', out.n, 'dumps', out.dumps, 'chip', out.chip.length, 'rawOnScreen', out.rawOnScreen.length, 'stability moved', out.stability.length, 'conflict moved', out.conflict.length, 'hall moved', out.hall.length, 'inn', out.inn.length);
