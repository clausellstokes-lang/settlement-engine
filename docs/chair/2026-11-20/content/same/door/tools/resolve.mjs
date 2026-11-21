#!/usr/bin/env node
/**
 * door/tools/resolve.mjs — SAME-2 brief D part 2: writes the `?` resolutions into scripts/census/sameness-census.classes.json
 * by the file's own rule (a key with ` ~ <top sentence>` splits one slot by its commonest sentence), and names every
 * `?` group left unresolved in door/UNRESOLVED.md. A GROUP is the `?` register rows that share their first stored path,
 * or (composed) `COMPOSED@<heading> ~ <module>`. A resolved group's rows get one key per size's commonest sentence, keyed
 * as scripts/sameness-census.mjs :: classifySlot reads it, so no other slot of that field or module is re-classed.
 * Usage: node .../door/tools/resolve.mjs <reading.json> <tree>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { SIZES, moduleIndex, moduleOf, readRegister } from '../../../../../../../scripts/sameness-census.mjs';

const [readingPath, tree] = process.argv.slice(2);
const ROOT = new URL('../../../../../../../', import.meta.url).pathname;
const CLASSES = `${ROOT}scripts/census/sameness-census.classes.json`;
const reg = readRegister(); const { slots } = JSON.parse(readFileSync(readingPath, 'utf8')); const idx = moduleIndex();
const ranked = new Set(Object.values(slots).filter((o) => Object.values(o.sizes).some((e) => e.shareAll > 0.15)).map((o) => o.slot));
const headingOf = (/** @type {string} */ slot) => (slot.startsWith('session |') ? slot.split(' | ')[1] : '(none)');
const groupOf = (/** @type {string} */ slot, /** @type {any} */ r) => { const p = Object.keys(r.paths || {}); return p.length ? p[0] : `COMPOSED@${headingOf(slot)} ~ ${slots[slot]?.module || 'unfound'}`; };

// ── THE RESOLUTIONS: each read from the code that composes the slot (path :: symbol) ──
/** @type {Record<string, { cls: string, why: string }>} */
const RESOLVED = {
  'COMPOSED@(none) ~ src/pdf/lib/headlines.js': { cls: 'STATE', why: 'src/pdf/lib/headlines.js :: overviewHeadline, defenseHeadline, servicesHeadline, hooksHeadline (and src/domain/display/noForceLine.js :: NO_FORCE_REST where no force stands): a chapter\'s headline composed from the place\'s counts and state, no draw' },
  'COMPOSED@(none) ~ src/pdf/sections/SupplyChainFlow.jsx': { cls: 'LABEL', why: 'src/pdf/sections/SupplyChainFlow.jsx :: Legend: the chain chart\'s swatch labels' },
  'COMPOSED@(none) ~ src/domain/coherence/pageCensusFindings.js': { cls: 'LABEL', why: 'empty state: src/domain/display/defenseDisplay.js :: ARCANE_NONE and deriveSupportingCapabilities\' notes, the arcane tile where the rolls hold no practitioner (pageCensusFindings.js only names the words)' },
  'stress.cast.stakes[].reason': { cls: 'STATE', why: 'src/domain/crisis/crisisCast.js :: STAKE_REASONS: a stake\'s kind (loses, split, must answer) read to its fixed reason' },
  'resourceAnalysis.gaps[].impact': { cls: 'STATE', why: 'src/domain/display/validationOnPage.js :: resourceGapLines: a gap\'s kind and its house read to a sentence, no draw' },
  'powerStructure.stability': { cls: 'LABEL', why: 'src/generators/power/governanceNarrative.js :: applyStressStability, annotateMonsterThreat: the stability band\'s word and its cause' },
  'COMPOSED@(none) ~ src/components/new/tabs/ServicesTab.jsx': { cls: 'LABEL', why: 'a section heading: src/pdf/sections/DefenseSecurity.jsx :: DefenseSecurity prints "ARMED FORCES & FORTIFICATIONS" (ServicesTab.jsx only names it)' },
  'COMPOSED@(none) ~ src/components/InterviewPanel.jsx': { cls: 'LABEL', why: 'empty state: src/pdf/sections/Relationships.jsx :: Relationships, where the place is linked to no neighbour' },
  'COMPOSED@(none) ~ src/domain/summary/tonightSheet.js': { cls: 'LABEL', why: 'src/domain/summary/tonightSheet.js :: TONIGHT_COPY: the sheet\'s eyebrow caption' },
  'COMPOSED@(none) ~ src/pdf/sections/Services.jsx': { cls: 'LABEL', why: 'src/pdf/sections/Services.jsx :: Services: the chapter band\'s count caption' },
  'COMPOSED@(none) ~ src/pdf/sections/ResourcesProduction.jsx': { cls: 'LABEL', why: 'src/pdf/sections/ResourcesProduction.jsx :: ResourcesProduction: a resource row\'s fixed hint' },
  'COMPOSED@(none) ~ src/components/new/tabs/power/PowerStrata.jsx': { cls: 'LABEL', why: 'src/components/new/tabs/power/PowerStrata.jsx :: seatListTitle: a disclosure\'s title and its count' },
  'COMPOSED@(none) ~ src/domain/display/tradeListDisplay.js': { cls: 'LABEL', why: 'src/components/new/tabs/EconomicsTab.jsx :: EconomicsTab: the exports list\'s legend (tradeListDisplay.js only names it)' },
  'COMPOSED@(none) ~ src/domain/display/criticalImportsShown.js': { cls: 'LABEL', why: 'src/components/new/tabs/EconomicsTab.jsx :: EconomicsTab: a critical import\'s reason tags' },
  'COMPOSED@(none) ~ src/pdf/sections/EconomicsTrade.jsx': { cls: 'STATE', why: 'src/pdf/sections/EconomicsTrade.jsx :: farmlandWords: the farmland\'s yield modifier read to a band sentence' },
  'COMPOSED@(none) ~ src/components/new/tabs/SubstrateTab.jsx': { cls: 'LABEL', why: 'src/components/new/tabs/SubstrateTab.jsx :: SubstrateTab: a field\'s name run into its band word (NameColumns)' },
};
// ── THE NAMED (unresolved, with why) ──
const WHY = {
  'COMPOSED@(none) ~ unfound': 'composed at display from no literal the module index holds (moduleOf found none): each slot needs its own composer read by hand; one key cannot hold them (page furniture, counts and band words mixed)',
  'COMPOSED@(none) ~ src/data/people/dmPowerLines.js': 'mixed under one module key: a power\'s band words (dmPowerLines.js :: boostWords, a LABEL) and state sentences (CAPTURE_LINES, a STATE); needs a split by sentence, row by row',
  'COMPOSED@(none) ~ src/pdf/sections/Overview.jsx': 'mixed under one module key: cross-reference captions (Overview, a LABEL) and enforcementWords\' band sentences (a STATE)',
  'COMPOSED@(none) ~ src/components/new/tabs/EconomicsTab.jsx': 'mixed under one module key: disclosure titles and counts (a LABEL) and a food sentence (a STATE)',
  'COMPOSED@(none) ~ src/domain/display/defenseDisplay.js': 'mixed under one module key: capability tiles\' label-and-band runs (deriveSupportingCapabilities, a LABEL) and the food-endurance sentence (a STATE)',
};
const DEFAULT_WHY = (/** @type {string} */ g) => (g.startsWith('COMPOSED@')
  ? 'not reached: the composer is not yet read from code (the module the door names may only quote the words)'
  : 'not reached: the stored path is the door\'s attribution by containment; whether it composes the printed line, and by which symbol, is not yet read from code');

/** @type {Map<string, { rows: string[], ranked: number, cls: Set<string> }>} */ const groups = new Map();
for (const [slot, r] of Object.entries(reg.rows)) {
  if (!String(r.class).endsWith('?')) continue;
  const g = groupOf(slot, r); const o = groups.get(g) || { rows: [], ranked: 0, cls: new Set() };
  o.rows.push(slot); o.cls.add(r.class); if (ranked.has(slot)) o.ranked++; groups.set(g, o);
}
const text = readFileSync(CLASSES, 'utf8'); const classes = JSON.parse(text);
/** @type {Record<string, { cls: string, why: string }>} */ const add = {};
let resolvedRows = 0; let resolvedRanked = 0;
for (const [g, o] of groups) {
  const res = RESOLVED[g]; if (!res) continue;
  resolvedRows += o.rows.length; resolvedRanked += o.ranked;
  for (const slot of o.rows) {
    const sl = slots[slot]; const r = reg.rows[slot];
    for (const s of SIZES) {
      const e = sl?.sizes?.[s]; if (!e) continue;
      const p = Object.keys(r.paths || {});
      const key = p.length ? `${p[0]} ~ ${e.sentence}` : `COMPOSED@${headingOf(slot)} ~ ${moduleOf(e.sentence, idx)?.file || 'unfound'} ~ ${e.sentence}`;
      if (!classes[key]) add[key] = { cls: res.cls, why: res.why };
    }
  }
}
const body = Object.entries(add).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, v]) => ` ${JSON.stringify(k)}: ${JSON.stringify(v).replace(/^\{"cls"/, '{ "cls"').replace(/"\}$/, '" }').replace('","why":', '", "why": ')}`);
const note = ` "_resolved_same2": ${JSON.stringify(`SAME-2 brief D part 2 (2026-11-20, tree ${tree}): the \`?\` resolutions below, read from the code that composes each slot (the \`why\` names path :: symbol), keyed by the slot's commonest sentence at each size (the file's own \` ~ <top sentence>\` split, so no other slot of that field or module moves); the groups not resolved are named in docs/chair/2026-11-20/content/same/door/UNRESOLVED.md. Written by docs/chair/2026-11-20/content/same/door/tools/resolve.mjs.`)}`;
const trimmed = text.replace(/\s*\}\s*$/, '');
if (!classes._resolved_same2 && body.length) writeFileSync(CLASSES, `${trimmed},\n\n${note},\n${body.join(',\n')}\n}\n`);
JSON.parse(readFileSync(CLASSES, 'utf8'));

// ── UNRESOLVED.md ──
const U = [];
const rest = [...groups].filter(([g]) => !RESOLVED[g]).sort((a, b) => b[1].ranked - a[1].ranked || b[1].rows.length - a[1].rows.length);
U.push('# UNRESOLVED — the `?` classes not resolved from code (SAME-2 brief D part 2)', '');
U.push(`Tree **${tree}**. The register holds ${[...groups.values()].reduce((a, o) => a + o.rows.length, 0)} rows with a \`?\` class in ${groups.size} groups (a group: the rows sharing their first stored path, or \`COMPOSED@<heading> ~ <module>\`). RESOLVED into \`scripts/census/sameness-census.classes.json\`: ${Object.keys(RESOLVED).filter((g) => groups.has(g)).length} groups, ${resolvedRows} rows (${resolvedRanked} of them ranked), ${Object.keys(add).length} keys. NAMED here: ${rest.length} groups, ${rest.reduce((a, [, o]) => a + o.rows.length, 0)} rows (${rest.reduce((a, [, o]) => a + o.ranked, 0)} of them ranked). The count ran long: the ranked groups were taken first and the work stopped inside them; every group left is named with why, never guessed.`, '');
U.push('| # | group | `?` classes | rows | ranked | example slot | why not resolved |', '|---|---|---|---|---|---|---|');
rest.forEach(([g, o], i) => U.push(`| ${i + 1} | \`${g.replace(/\|/g, '\\|')}\` | ${[...o.cls].join(', ')} | ${o.rows.length} | ${o.ranked} | \`${o.rows[0].replace(/\|/g, '\\|')}\` | ${(WHY[g] || DEFAULT_WHY(g)).replace(/\|/g, '\\|')} |`));
writeFileSync(`${ROOT}docs/chair/2026-11-20/content/same/door/UNRESOLVED.md`, `${U.join('\n')}\n`);
console.log(`groups ${groups.size}; resolved groups ${Object.keys(RESOLVED).filter((g) => groups.has(g)).length} rows ${resolvedRows} (ranked ${resolvedRanked}), keys ${Object.keys(add).length}; named groups ${rest.length} rows ${rest.reduce((a, [, o]) => a + o.rows.length, 0)} (ranked ${rest.reduce((a, [, o]) => a + o.ranked, 0)})`);
for (const g of Object.keys(RESOLVED)) if (!groups.has(g)) console.log(`NOTE: resolution for an absent group: ${g}`);
