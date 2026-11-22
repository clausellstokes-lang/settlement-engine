#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/u3/measure-u3.mjs — U3's acceptance run (builder B3, 2026-11-20): the BUILT leaf
 * `src/domain/seat/holderOfSeat.js :: holderOf` over the proposal's two pools, beside the proposal's section (1).
 * Measures; changes nothing under src/. The loop is `../measure-holder.mjs`'s own (the same seeds, the same configs,
 * through `birthConfig`: today's births), reduced to the holder.
 *
 * Per pool it reports: the count of towns each rule answers for the owner; the reader's counts on the SERVED document
 * (`publicSafe.js :: toPublicSafe`) and every town where the reader is refused or names another holder than the owner;
 * the rule x holder-kind table; every town where two rules would answer differently (the draft's `holderAnswers`,
 * `../seat-draft.mjs`); and, town by town, the built leaf against the draft the proposal's figures were executed on
 * (rule and holder), every difference listed.
 *
 *   node docs/chair/2026-11-20/content/seat/u3/measure-u3.mjs --arm default|presets [--n N]
 * Writes u3-holder-<arm>.json / .md beside this file.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../../..');
const imp = (p) => import(join(ROOT, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { toPublicSafe } = await imp('src/domain/display/publicSafe.js');
const { holderOf } = await imp('src/domain/seat/holderOfSeat.js');
const D = await import(join(HERE, '../seat-draft.mjs'));

const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
const ARM = argOf('--arm', 'default');
const N = Number(argOf('--n', ARM === 'presets' ? 10 : 150));
await loadGenerationLawPayloads();
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
const JOBS = ARM === 'presets'
  ? TIERS.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: N }, (_, i) => ({ tier, preset, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } }))))
  : TIERS.flatMap((tier) => Array.from({ length: N }, (_, i) => ({ tier, preset: null, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } })));
const PROPOSAL = {
  default: { R1: 0, R2: 365, R3: 96, R4: 413, R5: 26, disagree: 0 },
  presets: { R1: 0, R2: 213, R3: 243, R4: 444, R5: 60, disagree: 2 },
}[ARM];
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const sorted = (m) => Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)));

const owner = {}; const reader = {}; const kinds = {}; const byTier = {}; const personRules = {};
const readerRefused = []; const readerOther = []; const draftDiff = []; const disagreements = [];
let towns = 0; let errors = 0; let noPerson = 0;
const t0 = Date.now();
for (const job of JOBS) {
  let s;
  try { s = generateSettlementPipeline(birthConfig(job.config), null, { seed: job.seed, customContent: {} }); } catch { errors += 1; continue; }
  towns += 1;
  const form = nameOf(governingFactionOf(s));
  const h = holderOf(s, { audience: 'owner' });
  const served = toPublicSafe(s);
  const r = holderOf(served, { audience: 'reader' });
  bump(owner, h.rule); bump(reader, r.refused ? `${r.rule} refused` : r.rule);
  bump(kinds, `${h.rule}:${h.kind}`); bump((byTier[job.tier] ||= {}), h.rule); bump(personRules, h.personRule);
  if (!h.person) noPerson += 1;
  if (r.refused) readerRefused.push({ seed: job.seed, form, rule: r.rule, ownerHolder: h.holderName });
  else if (r.rule !== h.rule || r.holderName !== h.holderName) readerOther.push({ seed: job.seed, form, owner: `${h.rule} ${h.holderName ?? '-'}`, reader: `${r.rule} ${r.holderName ?? '-'}` });
  const d = D.holderOf(s);
  const dName = d.holder ? nameOf(d.holder) : null;
  if (d.rule !== h.rule || dName !== h.holderName) draftDiff.push({ seed: job.seed, tier: job.tier, form, built: `${h.rule} ${h.holderName ?? '-'}`, draft: `${d.rule} ${dName ?? '-'}` });
  const ans = D.holderAnswers(s);
  const named = Object.entries(ans).filter(([, v]) => v);
  if (new Set(named.map(([, v]) => v)).size > 1) disagreements.push({ seed: job.seed, tier: job.tier, form, ...ans, chosen: `${h.rule} ${h.holderName}` });
}

const out = {
  meta: { script: 'docs/chair/2026-11-20/content/seat/u3/measure-u3.mjs', leaf: 'src/domain/seat/holderOfSeat.js', arm: ARM, n: N, towns, errors, seconds: Math.round((Date.now() - t0) / 1000) },
  owner: sorted(owner), reader: sorted(reader), proposal: PROPOSAL, kinds: sorted(kinds), byTier, personRules: sorted(personRules), noPerson,
  readerRefused, readerOther, disagreements, draftDiff,
};
writeFileSync(join(HERE, `u3-holder-${ARM}.json`), `${JSON.stringify(out, null, 1)}\n`);
const L = [`# U3 acceptance: the built holder leaf, arm ${ARM} (${towns} born towns through birthConfig, ${errors} errors)`, '',
  `Executed: \`node ${out.meta.script} --arm ${ARM} --n ${N}\` (${out.meta.seconds}s). Raw: \`u3-holder-${ARM}.json\`.`, '',
  '| rule | proposal (1) | built, owner | built, reader on the served document |', '|---|---|---|---|'];
for (const rule of ['R1', 'R2', 'R3', 'R4', 'R5']) L.push(`| ${rule} | ${PROPOSAL[rule]} | ${owner[rule] || 0} | ${reader[rule] || 0}${reader[`${rule} refused`] ? ` (+${reader[`${rule} refused`]} refused)` : ''} |`);
L.push('', `Towns where two rules answer differently: ${disagreements.length} (proposal: ${PROPOSAL.disagree}).`);
for (const d of disagreements) L.push(`- ${d.seed} (${d.form}): R2 ${d.R2 ?? '-'} · R3 ${d.R3 ?? '-'} → built ${d.chosen}`);
L.push('', `Built leaf against the draft, town by town (rule and holder): ${draftDiff.length} differ.`);
for (const d of draftDiff.slice(0, 60)) L.push(`- ${d.seed} (${d.form}): built ${d.built} · draft ${d.draft}`);
if (draftDiff.length > 60) L.push(`- … ${draftDiff.length - 60} more in the json`);
L.push('', `Reader refused (served document): ${readerRefused.length}. Reader names another holder than the owner: ${readerOther.length}.`);
for (const d of [...readerRefused, ...readerOther].slice(0, 40)) L.push(`- ${JSON.stringify(d)}`);
L.push('', `Rule x kind (owner): ${Object.entries(out.kinds).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '',
  `Person rule: ${Object.entries(out.personRules).map(([k, v]) => `${k} ${v}`).join(' · ')}; towns with no person: ${noPerson}.`, '',
  `By tier (owner): ${Object.entries(byTier).map(([t, m]) => `${t} ${Object.entries(sorted(m)).map(([k, v]) => `${k} ${v}`).join(', ')}`).join(' · ')}`, '');
writeFileSync(join(HERE, `u3-holder-${ARM}.md`), `${L.join('\n')}\n`);
process.stderr.write(`wrote u3-holder-${ARM} (${towns} towns, ${errors} errors, ${draftDiff.length} draft diffs, ${out.meta.seconds}s)\n`);
