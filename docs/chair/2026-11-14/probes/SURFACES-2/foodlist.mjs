// lists births where the stored food label differs from the food band (folded case), with the facts a reader checks
import fs from 'node:fs';
const [tree, recdir] = process.argv.slice(2);
const { foodBandOf } = await import(`${tree}/src/domain/summary/tonightSheet.js`);
const fold = (s) => String(s ?? '').toLowerCase().trim();
const rows = [];
for (const f of fs.readdirSync(recdir).filter((x) => x.endsWith('.json')).sort()) {
  const t = JSON.parse(fs.readFileSync(`${recdir}/${f}`, 'utf8'));
  const fsec = t.economicState?.foodSecurity || {}; const r = fsec.foodRecord || {};
  const band = foodBandOf(r);
  const st = (Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).map((s) => s.type).join('+') || 'calm';
  if (band && fold(band.label) !== fold(fsec.label)) rows.push([f.replace('.json', ''), t.tier, st, fsec.label, band.label, r.band, r.gapPct, r.deficitPct, r.surplusPct, r.normalImportPct, r.storageMonths, r.hasGranary].join('\t'));
}
console.log(rows.length); console.log(rows.join('\n'));
