/**
 * BAR5-BAND runner: rule 1c-band/quiet (tests/helpers/pageLaws/law1Band.mjs) over a PAGE-COPY render
 * (`dumps/<seed>.txt` + `corpus.ndjson.gz`), and the measure the chair's ruling LB1 asks before the cure.
 *   node run-band.mjs <render-dir> <out.json>
 * Writes: every instance; pages printing Law & order Critical or Collapsed by tier; how many meet LB1's (a) to (d);
 * how many the floor lifts; the lifted pages whose own words say the law failed (must be 0); every surface of the dump
 * (dossier, Tonight, PDF, Journal) that prints a law-and-order band. Reads the DOSSIER tabs for the rule.
 */
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const { parseDump, dossierTabs } = await import(path.join(ROOT, 'tests/helpers/pageLaws/page.mjs'));
const { law1cBand, quietFactsOf, safetyWordOnPage, LAW_ROW, QUIET_SAFETY } = await import(path.join(ROOT, 'tests/helpers/pageLaws/law1Band.mjs'));
const { deriveSystemVariable } = await import(path.join(ROOT, 'src/domain/causalState.js'));
const [, , dir, outFile] = process.argv;
const corpus = new Map(zlib.gunzipSync(fs.readFileSync(path.join(dir, 'corpus.ndjson.gz'))).toString().split('\n').filter(Boolean).map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const instances = []; const rows = []; const surfaces = {};
for (const f of fs.readdirSync(path.join(dir, 'dumps')).sort()) {
  const town = f.replace(/\.txt$/, '');
  const { tabs: all } = parseDump(fs.readFileSync(path.join(dir, 'dumps', f), 'utf8'));
  for (const [tab, ls] of Object.entries(all)) for (const l of ls) if (/law (?:&|and) order/i.test(l)) { const k = `${tab.split('/')[0]}/${tab.split('/')[1]} :: ${l.trim().replace(/\b(Collapsed|Critical|Strained|Adequate|Surplus)\b/i, '<band>').slice(0, 90)}`; (surfaces[k] ||= new Set()).add(town); }
  const tabs = dossierTabs(all); const record = corpus.get(town);
  for (const x of law1cBand({ record, tabs, town })) instances.push(x);
  const row = (tabs['Summary/Foundations'] || []).map((l) => LAW_ROW.exec(l.trim())).find(Boolean);
  const printed = row ? row[1] : null;
  const fx = quietFactsOf(record); const safety = safetyWordOnPage(tabs);
  let model = null; try { model = deriveSystemVariable('law_order', record)?.band ?? null; } catch { /* none */ }
  const lb1 = fx.offices.length === 0 && fx.crises.length === 0 && !fx.crimeWave && QUIET_SAFETY.has(String(safety));
  rows.push({ town, tier: record?.tier ?? null, printed, model, safety, offices: fx.offices.length, crises: fx.crises, crimeWave: fx.crimeWave, criminalPower: fx.criminalPower, lb1 });
}
const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const low = (r) => r.printed === 'Critical' || r.printed === 'Collapsed';
const byTier = Object.fromEntries(tiers.map((t) => { const rs = rows.filter((r) => r.tier === t); const lo = rs.filter(low); return [t, {
  towns: rs.length, critical: lo.filter((r) => r.printed === 'Critical').length, collapsed: lo.filter((r) => r.printed === 'Collapsed').length,
  meetLB1: lo.filter((r) => r.lb1).length, lifted: lo.filter((r) => r.lb1).length,
  quietWithOffice: lo.filter((r) => !r.lb1 && r.offices && !r.crises.length && !r.crimeWave && QUIET_SAFETY.has(String(r.safety))).length,
}]; }));
const liftedFailed = rows.filter((r) => low(r) && r.lb1 && r.criminalPower).map((r) => r.town); // lifted where a criminal power rivals the law
const quietUnlifted = rows.filter((r) => low(r) && !r.lb1 && !r.crises.length && !r.crimeWave && !r.criminalPower && QUIET_SAFETY.has(String(r.safety))).map((r) => ({ town: r.town, offices: r.offices }));
const counts = { towns: rows.length, instances: instances.filter((x) => x.law === '1c-band/quiet').length, excludedOffice: instances.filter((x) => x.law === '1c-band/quiet:office').length,
  printedLow: rows.filter(low).length, printedMismatchModel: rows.filter((r) => r.printed && r.model && r.printed.toLowerCase() !== r.model).length };
const surf = Object.fromEntries(Object.entries(surfaces).sort((a, b) => b[1].size - a[1].size).slice(0, 40).map(([k, s]) => [k, s.size]));
fs.writeFileSync(outFile, JSON.stringify({ counts, byTier, liftedFailed, quietUnlifted, surfaces: surf, instances, rows }, null, 1));
console.log(JSON.stringify(counts));
for (const [t, v] of Object.entries(byTier)) console.log(`  ${t}: ${JSON.stringify(v)}`);
console.log(`  lifted where a criminal power rivals the law: ${liftedFailed.length} ${liftedFailed.slice(0, 5).join(' ')}`);
console.log(`  quiet pages printed low that LB1 leaves: ${quietUnlifted.length} ${quietUnlifted.slice(0, 5).map((x) => x.town).join(' ')}`);
console.log('  surfaces:'); for (const [k, n] of Object.entries(surf).slice(0, 15)) console.log(`    ${n} ${k}`);
