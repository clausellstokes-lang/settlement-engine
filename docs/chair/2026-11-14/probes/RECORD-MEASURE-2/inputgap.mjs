// RECORD-MEASURE-2 · M3: a house whose input the record denies. node inputgap.mjs <tree> <corpus>
// For every resource chain (data/resourceChains.js) and each of its processing houses: towns holding the house (exact name,
// or a catalog name that starts with it); towns whose resourceAnalysis.gaps holds { chain, institution: house, kind: 'missing' }
// ("<house> exists but lacks access to <raw>"); and how many towns of all 720 hold the raw resource in availableResources.
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const [TREE, CORPUS] = process.argv.slice(2);
const RC = await import(TREE + '/src/data/resourceChains.js');
const CH = RC.RESOURCE_CHAINS || RC.default || Object.values(RC).find((v) => v && typeof v === 'object' && v.grain);
const C = require('./load.cjs')(CORPUS);
const rows = [];
for (const [key, ch] of Object.entries(CH)) for (const house of ch.processingInstitutions || []) {
  let held = 0, denied = 0, imp = 0, loc = 0;
  for (const { s } of C) {
    const names = s.institutions.map((i) => String(i.name));
    const R = s.resourceAnalysis || {};
    if ((R.gaps || []).some((g) => g.chain === ch.rawResource && g.kind === 'imported')) imp++; if (s.institutions.some((i) => (ch.processingInstitutions || []).includes(String(i.name))) && !(R.gaps || []).some((g) => g.chain === ch.rawResource && g.institution)) loc++;
    if (!names.some((n) => n === house || n.startsWith(house + ' ('))) continue;
    held++;
    if ((R.gaps || []).some((g) => g.chain === ch.rawResource && g.institution === house && g.kind === 'missing')) denied++;
  }
  if (held) rows.push({ key, raw: ch.rawResource, house, held, denied, imp, loc });
}
rows.sort((a, b) => b.denied - a.denied);
console.log('chain\traw\thouse\theld\tdenied\t%\ttowns: input imported · input local or chain active (any house)');
for (const r of rows) console.log(`${r.key}\t${r.raw}\t${r.house}\t${r.held}\t${r.denied}\t${Math.round(100 * r.denied / r.held)}%\t${r.imp} · ${r.loc}`);
