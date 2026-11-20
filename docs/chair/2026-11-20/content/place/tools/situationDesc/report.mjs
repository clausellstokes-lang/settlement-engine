// PLACE-1 · situationDesc MEASURE: every figure of situationDesc-MEASURE.md §A, §C and §E, from the rows measure.mjs wrote.
//   node report.mjs <repo> rows-plain.json rows-capture.json census100-before.json > report.out.txt
// The candidate composer is simulated here (composer.mjs), never in src/.
import { readFileSync } from 'node:fs';
import { composeOrdinaryTradeLine } from './composer.mjs';

const [, , L, plainPath, capPath, censusPath] = process.argv;
const plain = JSON.parse(readFileSync(plainPath, 'utf8'));
const cap = JSON.parse(readFileSync(capPath, 'utf8'));
const census = JSON.parse(readFileSync(censusPath, 'utf8'));
const { drawDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { pickVariant } = await import(`${L}/src/kernel/proseHash.js`);
const { tradeMarkOf } = await import(`${L}/src/domain/display/tradeListDisplay.js`);
const { TRADE_LINE_BANDS } = await import(`${L}/src/generators/economy/prosperity.js`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '-');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const tally = (arr) => { const m = new Map(); for (const x of arr) m.set(x, (m.get(x) || 0) + 1); return [...m].sort((a, b) => b[1] - a[1]); };

// ── §A: the branches by size, and the top sentence before (checked against the chair's census) ──
console.log('## §A THE BRANCHES (share of 100 places a size; seeds hxd-<size>-0..99)');
const branches = [...new Set(plain.map((r) => r.branch))];
console.log(['branch', ...SIZES].join(' | '));
for (const b of branches.sort((x, y) => plain.filter((r) => r.branch === y).length - plain.filter((r) => r.branch === x).length)) {
  console.log([b, ...SIZES.map((s) => plain.filter((r) => r.size === s && r.branch === b).length)].join(' | '));
}
console.log(`economy output (compound.economyOutput) at 70 or over, the high bands' door: ${plain.filter((r) => Number(r.econOut) >= 70).length}/600`);
console.log('twins printed (market-less twin of a market line), by size:', SIZES.map((s) => `${s} ${plain.filter((r) => r.size === s && r.twin).length}`).join(', '));
console.log('\n## BEFORE: top masked sentence by size (this run) vs the chair\'s census100-before.json');
for (const s of SIZES) {
  const rows = plain.filter((r) => r.size === s);
  const [topS, topN] = tally(rows.map((r) => r.masked))[0];
  const c = census[s].find((r) => r.path === 'economicState.situationDesc');
  console.log(`${s}: ${topN}/${rows.length} (${pct(topN, rows.length)}) "${topS.slice(0, 70)}" · census topN ${c.topN}, distinct ${c.distinct} · this run distinct ${new Set(rows.map((r) => r.masked)).size} · ${topN === c.topN ? 'AGREES' : 'DIFFERS'}`);
}

// ── the instrument moves nothing ──
let same = 0;
for (const r of cap) { const p = plain.find((x) => x.seed === r.seed); if (p && p.sd === r.sd && eq(p.exports, r.exports) && eq(p.imports, r.imports) && p.prosperity === r.prosperity) same++; }
console.log(`\n## INSTRUMENT: ${same}/${cap.length} births identical (line, both lists, label) between the plain run and the captured run`);

// ── §C: the lists in scope at the writer vs the final record ──
console.log('\n## §C IN SCOPE AT THE WRITER vs THE FINAL RECORD (600 births)');
const c = { calls2: 0, lastIsSurvivor: 0, seedAtWriter: 0, exp: 0, imp: 0, prosp: 0, expEcon: 0, impEcon: 0, expNarr: 0, impNarr: 0, roster: 0, impNarrMedium: 0, impMedium: 0, expMedium: 0, medium: 0 };
const bySize = Object.fromEntries(SIZES.map((s) => [s, { exp: 0, imp: 0, impNarr: 0 }]));
for (const r of cap) {
  const last = r.caps[r.caps.length - 1];
  if (r.caps.length > 1) c.calls2++;
  if (last.sd === r.sd) c.lastIsSurvivor++;
  if (last.seedAtWriter) c.seedAtWriter++;
  if (r.snaps.economyReconcilePass?.roster) c.roster++;
  const de = !eq(last.exp, r.exports), di = !eq(last.imp, r.imports);
  if (de) { c.exp++; bySize[r.size].exp++; }
  if (di) { c.imp++; bySize[r.size].imp++; }
  if (last.prosperity !== r.prosperity) c.prosp++;
  if (!eq(r.snaps.economyReconcilePass?.exp, r.exports)) c.expEcon++;
  if (!eq(r.snaps.economyReconcilePass?.imp, r.imports)) c.impEcon++;
  if (!eq(r.snaps.generateNarratives?.exp, r.exports)) c.expNarr++;
  if (!eq(r.snaps.generateNarratives?.imp, r.imports)) { c.impNarr++; bySize[r.size].impNarr++; }
  if (r.branch === 'medium') { c.medium++; if (de) c.expMedium++; if (di) c.impMedium++; }
}
console.log(`generateEconomicState called twice (roster changed after the economy): ${c.calls2}/600; the last call's line is the stored line: ${c.lastIsSurvivor}/600`);
console.log(`config._seed present at the writer: ${c.seedAtWriter}/600`);
console.log(`exports at the writer != final: ${c.exp}/600 · imports at the writer != final: ${c.imp}/600 · label at the writer != final: ${c.prosp}/600`);
console.log(`  of the ${c.medium} medium-branch places: exports differ ${c.expMedium}, imports differ ${c.impMedium}`);
console.log(`  by size (exports / imports): ${SIZES.map((s) => `${s} ${bySize[s].exp}/${bySize[s].imp}`).join(', ')}`);
console.log(`after economyReconcilePass != final: exports ${c.expEcon}/600, imports ${c.impEcon}/600`);
console.log(`after generateNarratives != final: exports ${c.expNarr}/600, imports ${c.impNarr}/600`);

// ── §C: the facts the medium-branch places hold ──
const plainName = (raw) => { const l = String(tradeMarkOf(raw).label || '').trim(); return l; };
console.log('\n## §C FACTS AT HAND, medium-branch places (final record)');
for (const s of SIZES) {
  const m = plain.filter((r) => r.size === s && r.branch === 'medium');
  const ex = m.filter((r) => r.exports.length), im = m.filter((r) => r.imports.length);
  const leadOnPage = ex.filter((r) => r.printed.exports.map(plainName).includes(plainName(r.exports[0]))).length;
  const impOnPage = im.filter((r) => r.printed.imports.map(plainName).includes(plainName(r.imports[0]))).length;
  console.log(`${s} (${m.length}): exports ${ex.length} · imports ${im.length} · both ${m.filter((r) => r.exports.length && r.imports.length).length} · market ${m.filter((r) => r.facts.market).length} · guild ${m.filter((r) => r.facts.guild).length} · routes ${tally(m.map((r) => r.facts.route)).map(([k, v]) => `${k} ${v}`).join('/')} · distinct lead export ${new Set(ex.map((r) => plainName(r.exports[0]))).size} · distinct lead import ${new Set(im.map((r) => plainName(r.imports[0]))).size} · record's lead export printed ${leadOnPage}/${ex.length} · lead import printed ${impOnPage}/${im.length}`);
}

// ── §E: the projection ──
console.log('\n## §E THE PROJECTION (the candidate composer, simulated on the same 600 births, masked as the census masks)');
const after = plain.map((r) => ({ ...r, afterText: r.branch === 'medium' ? composeOrdinaryTradeLine(r, { drawDeclared, pickVariant, tradeMarkOf }) : r.masked }));
const maskAfter = (r) => r.afterText.replace(/\d+/g, '0'); // the composer names no proper name of the place (goods are not masked)
let worst = null; let worstShare = -1;
for (const s of SIZES) {
  const rows = after.filter((r) => r.size === s);
  const [bS, bN] = tally(rows.map((r) => r.masked))[0];
  const [aS, aN] = tally(rows.map(maskAfter))[0];
  if (aN > worstShare) { worstShare = aN; worst = s; }
  console.log(`${s}: before ${bN}/100 "${bS.slice(0, 50)}…" → after ${aN}/100 "${aS.slice(0, 90)}" · distinct ${new Set(rows.map((r) => r.masked)).size} → ${new Set(rows.map(maskAfter)).size}`);
}
console.log(`\nthe ten commonest after-sentences in the worst size (${worst}):`);
for (const [s, k] of tally(after.filter((r) => r.size === worst).map(maskAfter)).slice(0, 10)) console.log(`  ${k}× ${s}`);
// the rules every composed line must keep
const composed = after.filter((r) => r.branch === 'medium');
const bandOpen = composed.filter((r) => TRADE_LINE_BANDS.some(([re]) => re.test(r.afterText))).length;
console.log(`\nthe commonest COMPOSED line a size (share of the 100): ${SIZES.map((s) => { const t = tally(composed.filter((r) => r.size === s).map(maskAfter))[0]; return `${s} ${t ? t[1] : 0} ("${t ? t[0].slice(0, 60) : ''}")`; }).join(' · ')}`);
console.log(`the stored line still canonical after the composer: ${composed.filter((r) => r.afterText === 'Trade proceeds at an ordinary pace for a settlement of this size.').length}/${composed.length}`);
console.log(`\ncomposed lines opening with a TRADE_LINE_BANDS pattern: ${bandOpen}/${composed.length}`);
console.log(`resolved by: ${tally(plain.filter((r) => r.branch === 'medium').map((r) => String(r.__wording).split(':')[1])).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
console.log('wording use over the medium places (id:resolvedBy places):', tally(plain.filter((r) => r.branch === 'medium').map((r) => r.__wording || '')).map(([k, v]) => `${k} ${v}`).join(' · '));
const SURPLUS_WORDS = /\b(?:farm|grain|food|agricultural|harvest) surplus\b/i; // foodWordsFindings.js's own words
console.log(`composed lines carrying a surplus word beside a record that grows less than it eats: ${composed.filter((r) => SURPLUS_WORDS.test(r.afterText) && !r.growsMoreThanEats).length}`);
console.log(`medium places where the record holds a list the page prints empty (exports / imports): ${composed.filter((r) => r.exports.length && !r.printed.exports.length).length} / ${composed.filter((r) => r.imports.length && !r.printed.imports.length).length}`);
console.log('\nten composed lines, one a size, for the eye:');
for (const s of SIZES) for (const r of composed.filter((x) => x.size === s).slice(0, 2)) console.log(`  ${s}: ${r.afterText}`);
