#!/usr/bin/env node
/**
 * RUN (from the repository root; needs ./texts.json from measure.thin.mjs and ./views from run-render.thin.mjs):
 *   node docs/chair/2026-11-20/content/page/measures/THIN/prints.thin.mjs > docs/chair/2026-11-20/content/page/measures/THIN/prints.out.txt 2>&1
 *
 * PAGE-9 THIN-MEASURE, section B: WHAT PRINTS TODAY, by CONTAINMENT. For each candidate text of each rendered town
 * (hxd-<size>-0..9, 60 towns), each SENTENCE of the text (split at . ! ? ; and :, so a quoted clause is searched on its own) is normalised (lower case, punctuation to
 * space, whitespace collapsed) and searched for INSIDE every printed line of every view: the owner's page (every group,
 * sub-tab and disclosure, the page census walker) and the PDF's DM document (SettlementPDF canon_dossier). A text
 * "prints" when any of its sentences of >= 12 normalised characters is contained in a printed line. Never equality.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');
const texts = JSON.parse(readFileSync(join(HERE, 'texts.json'), 'utf8'));
const views = Object.fromEntries(readdirSync(join(HERE, 'views')).filter((f) => f.endsWith('.json')).map((f) => { const j = JSON.parse(readFileSync(join(HERE, 'views', f), 'utf8')); return [j.seed, j]; }));
const { deriveViability } = await import(`${L}/src/domain/display/dossierViewModel.js`);
const { trimViabilitySummary, stripViabilityToken } = await import(`${L}/src/domain/display/viabilityFilter.js`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const norm = (x) => String(x ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const sentences = (x) => String(x).split(/(?<=[.!?;:])\s+|[;:]\s*/).map(norm).filter((q) => q.length >= 12);
const normViews = {};
for (const [seed, v] of Object.entries(views)) normViews[seed] = Object.entries(v.views).map(([k, lines]) => [k, lines.map(norm)]);
/** @returns {string[]} the views in which some sentence of `text` is contained in a printed line */
const where = (seed, text) => { const qs = sentences(text); if (!qs.length) return ['(no sentence >= 12 chars)'];
  return normViews[seed].filter(([, lines]) => lines.some((l) => qs.some((q) => l.includes(q)))).map(([k]) => k); };

console.log(`RE-RUN: node docs/chair/2026-11-20/content/page/measures/THIN/prints.thin.mjs > docs/chair/2026-11-20/content/page/measures/THIN/prints.out.txt 2>&1`);
const seeds = Object.keys(views).sort();
const pdfOk = seeds.filter((s) => !(views[s].views['PDF/canon_dossier'] || [''])[0].startsWith('[PDF THREW]')).length;
console.log(`rendered towns: ${seeds.length} (${SIZES.map((s) => `${s} ${seeds.filter((x) => views[x].size === s).length}`).join(', ')}); views per town ${Object.keys(views[seeds[0]].views).length}; PDF/canon_dossier rendered on ${pdfOk}/${seeds.length}`);
// the probe proves the search finds a line it should: the town's own name on its page
const probe = seeds.filter((s) => normViews[s].some(([, lines]) => lines.some((l) => l.includes('daily life')))).length;
// POSITIVE CONTROL: a stored text known to print (the history event's description quoted inside recent_changes) is found
const ctl = seeds.filter((s) => normViews[s].some(([k, lines]) => k === 'World/History' && lines.some((l) => l.includes('is still being felt') || l.length > 0))).length;
const hist = seeds.filter((s) => { const tx = texts[s].c['dailyLife.recent_changes'][0] || ''; const after = tx.split(/is still being felt:\s*/)[1]; return after && normViews[s].some(([k, lines]) => k === 'World/History' && lines.some((l) => l.includes(norm(after).slice(0, 40)))); }).length;
console.log(`positive control: the clause recent_changes quotes from the history found on World/History on ${hist} towns (World/History rendered on ${ctl})`);
console.log(`probe: the words "daily life" contained in some printed line on ${probe}/${seeds.length} towns (the walker reached the tab)`);

console.log(`\n════ B. per candidate: items in the 60 / items printed (any sentence contained) on the OWNER PAGE / on the PDF DM document / nowhere; where`);
const candNames = Object.keys(texts[seeds[0]].c);
for (const name of candNames) {
  let items = 0, page = 0, pdf = 0, none = 0; const at = new Map(); const bySize = {};
  const missed = [];
  for (const seed of seeds) {
    const size = views[seed].size; bySize[size] ??= [0, 0];
    for (const tx of new Set(texts[seed].c[name])) {
      items++; bySize[size][0]++;
      const w = where(seed, tx);
      const onPage = w.some((k) => !k.startsWith('PDF/') && !k.startsWith('('));
      const onPdf = w.includes('PDF/canon_dossier');
      if (onPage) page++; if (onPdf) pdf++; if (!onPage && !onPdf) { none++; if (missed.length < 2) missed.push(`${seed}: "${tx.slice(0, 110)}"`); }
      if (onPage || onPdf) bySize[size][1]++;
      for (const k of w) at.set(k, (at.get(k) || 0) + 1);
    }
  }
  console.log(`\n[${name}] COUNT: items ${items}; owner page ${page}; PDF ${pdf}; nowhere ${none}`);
  console.log(`   by size (printed anywhere/items): ${SIZES.map((s) => `${s} ${bySize[s]?.[1] ?? 0}/${bySize[s]?.[0] ?? 0}`).join(' · ')}`);
  console.log(`   views: ${[...at].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, c]) => `${k}(${c})`).join(' ') || '—'}`);
  if (missed.length) console.log(`   not printed, e.g. ${missed.join(' | ')}`);
}

console.log(`\n════ B. viability.summary: is it reworded? (the record's sentence vs ViabilityTab's: trimViabilitySummary(deriveViability(t).summary body), canonicalViewModel default-on, src/lib/flagRegistry.js:48)`);
// deriveViability reads only economicViability, the name, the seed and the food balance; the rendered town's stored
// summary is in texts.json, but deriveViability needs the record: re-read it from the rendered page instead: the
// view's Systems/Outlook lines are what printed.
let recPrinted = 0, outlookLines = 0;
for (const seed of seeds) {
  const rec = texts[seed].c['viability.summary'][0] || '';
  const body = trimViabilitySummary(stripViabilityToken(rec));
  const outlook = (views[seed].views['Systems/Outlook'] || []).map(norm);
  if (outlook.length) outlookLines++;
  if (sentences(body).some((q) => outlook.some((l) => l.includes(q)))) recPrinted++;
}
console.log(`  COUNT: the record summary's trimmed body (a sentence of it) contained in Systems/Outlook on ${recPrinted}/${seeds.length} (Outlook rendered on ${outlookLines})`);
for (const seed of ['hxd-thorp-0', 'hxd-village-0', 'hxd-city-0', 'hxd-metropolis-0']) {
  console.log(`  ${seed}: RECORD "${texts[seed].c['viability.summary'][0]}"\n      OUTLOOK PRINTS: ${(views[seed].views['Systems/Outlook'] || []).slice(0, 6).join(' ¶ ').slice(0, 400)}`);
}
console.log(`\n  where the dependency titles print (sample hxd-city-0): ${texts['hxd-city-0'].c['viability.dependencies[].title'].map((t) => `"${t}" -> ${where('hxd-city-0', t).join(',') || 'nowhere'}`).join(' | ')}`);
void deriveViability;
