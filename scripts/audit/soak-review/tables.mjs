#!/usr/bin/env node
/**
 * scripts/audit/soak-review/tables.mjs — the report's tables, rendered from a run's aggregates.
 *
 *   node scripts/audit/soak-review/tables.mjs <out-dir>  > <out-dir>/aggregates/tables.md
 *
 * Finding classes (rate, reach, three cases), the chain table, the strongest cross-family
 * dependences, corpus repetition, and the key fields by tier. Pure formatting over the JSON
 * the run wrote; it recomputes nothing.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const out = process.argv[2];
const J = (f) => JSON.parse(readFileSync(join(out, f), 'utf-8'));
const run = J('run.json');
const classes = J('aggregates/finding-classes.json');
const chains = J('aggregates/chains.json');
const dep = J('aggregates/dependence-strong.json');
const rep = J('aggregates/repetition.json');
const fields = J('aggregates/fields.json');
let res = null; try { res = J('aggregates/dependence-residual.json'); } catch { /* a run older than the second pass */ }
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').slice(0, 160);
const L = [];

L.push(`# Soak tables — ${run.settlements} settlements at ${run.tip?.slice(0, 9)} · verdict ${run.verdict}`, '');
L.push('## Finding classes (ranked by rate × reach)', '', '| check | kind | settlements | rate | occurrences | surfaces | by tier |', '|---|---|---|---|---|---|---|');
for (const c of classes) L.push(`| ${c.check} | ${c.kindName} | ${c.settlements}/${c.pool} | ${c.rate} | ${c.occurrences} | ${cell(Object.entries(c.surfaces).map(([k, v]) => `${k} ${v}`).join(', '))} | ${cell(TIERS.map((t) => c.byTier[t] ?? 0).join(' / '))} |`);
L.push('', '### Three cases per class', '');
for (const c of classes) { L.push(`**${c.check}**`); for (const x of c.cases) L.push(`- \`${x.seed}\` (${x.tier}, ${x.surface}): "${cell(x.quote)}" — ${cell(x.detail)}`); L.push(''); }
L.push('## The engine\'s chains', '', '| id | from → to | rule | expect | n | measure | value | within tier (thorp…metropolis) | verdict |', '|---|---|---|---|---|---|---|---|---|');
for (const c of chains) L.push(`| ${c.id} | ${c.from.replace('chain.', '')} → ${c.to.replace('chain.', '')} | ${cell(c.rule)} | ${c.expect} | ${c.n} | ${c.measure} | ${c.value} | ${TIERS.map((t) => c.within?.[t] ?? '·').join(' / ')} | ${c.verdict} |`);
L.push('', `## Dependence scan: ${dep.candidates} fields, ${dep.strongPairs} cross-family pairs at |v| ≥ 0.5 (top 60)`, '', '| a | b | measure | value | seeds |', '|---|---|---|---|---|');
for (const p of dep.pairs.slice(0, 60)) L.push(`| ${cell(p.a)} | ${cell(p.b)} | ${p.measure} | ${p.value} | ${p.seeds.join(', ')} |`);
if (res) {
  const fam = (p) => p.replace(/^chain\./, 'chain:').split(/[.[:]/)[0];
  L.push('', `## Dependence, second pass (within tier, pooled): ${res.residualPairs} pairs at |v| ≥ 0.5 · ${res.copies} copies apart · ${res.surprisesA} kind (a) · ${res.surprisesB} kind (b)`, '');
  L.push('### The chains on the residual', '', '| id | from → to | rule | expect | n | measure | pooled | within tier (thorp…metropolis) | verdict | witness (cell · seeds) |', '|---|---|---|---|---|---|---|---|---|---|');
  for (const c of res.chainsResidual) L.push(`| ${c.id} | ${c.from.replace('chain.', '')} → ${c.to.replace('chain.', '')} | ${cell(c.rule)} | ${c.expect} | ${c.n} | ${c.measure} | ${c.pooled ?? '·'} | ${TIERS.map((t) => c.byTier?.[t] ?? '·').join(' / ')} | ${c.verdict} | ${c.witness ? `${cell(c.witness.cell)} · ${c.witness.seeds.join(', ')}` : '·'} |`);
  const groups = new Map();
  for (const p of res.surprisesAList) { const k = p.inputPair ? 'input × input (the corpus matrix)' : p.commonInput ? `common input ${p.commonInput.input}` : [fam(p.a), fam(p.b)].sort().join(' ~ '); const g = groups.get(k) ?? []; g.push(p); groups.set(k, g); }
  L.push('', '### Kind (a), grouped (input pairs; a shared generation input; else by top-level family) — strongest pair per group', '', '| group | pairs | strongest pair | measure | pooled | raw | witness (cell · seeds) |', '|---|---|---|---|---|---|---|');
  for (const [k, g] of [...groups].sort((x, y) => y[1].length - x[1].length)) { const p = g[0]; L.push(`| ${cell(k)} | ${g.length} | ${cell(`${p.a} ~ ${p.b}`)} | ${p.measure} | ${p.pooled} | ${p.raw} | ${cell(p.witness.cell)} · ${p.witness.seeds.join(', ')} |`); }
  L.push('', `### Copies (one value under two names; top 30 of ${res.copies})`, '', '| a | b | raw | pooled | why |', '|---|---|---|---|---|');
  for (const p of res.copiesList.slice(0, 30)) L.push(`| ${cell(p.a)} | ${cell(p.b)} | ${p.raw} | ${p.pooled} | ${cell(p.why)} |`);
}
L.push('', '## Repetition across the corpus', '', `towns ${rep.towns} · distinct sentences ${rep.distinctSentences} · sentences in ≥10% of towns ${rep.sharedByTenPercent} · median share of a town's sentences that another town also has ${rep.medianShareOfTownSeenInAnotherTown} (p90 ${rep.p90ShareSeenElsewhere}) · median share in ≥10%-sentences ${rep.medianShareOfTownInTenPercentSentences}`, '', '| towns | rate | sentence (names masked @, numbers #) |', '|---|---|---|');
for (const t of rep.top.slice(0, 30)) L.push(`| ${t.towns} | ${t.rate} | ${cell(t.sentence)} |`);
const key = fields.filter((f) => f.path.startsWith('chain.') && f.kind === 'numeric');
L.push('', '## Key numeric facts by tier (median [p10–p90], min–max)', '', `| fact | ${TIERS.join(' | ')} |`, `|---|${TIERS.map(() => '---').join('|')}|`);
for (const f of key) L.push(`| ${f.path.replace('chain.', '')} | ${TIERS.map((t) => { const b = f.byTier[t]; return b && b.median != null ? `${b.median} [${b.p10}–${b.p90}] ${b.min}–${b.max}` : '·'; }).join(' | ')} |`);
const keyCat = fields.filter((f) => f.path.startsWith('chain.') && f.kind === 'categorical');
L.push('', '## Key categorical facts by tier', '');
for (const f of keyCat) L.push(`- **${f.path.replace('chain.', '')}**: ${TIERS.map((t) => `${t} ${cell(Object.entries(f.byTier[t]?.counts ?? {}).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' '))}`).join(' · ')}`);
L.push('', `Fields walked ${run.fieldsWalked}; reported ${run.fieldsReported}; excluded ${JSON.stringify(run.fieldsExcluded)} (sparse = present in under 1% of settlements; constant = one value everywhere).`);
process.stdout.write(`${L.join('\n')}\n`);
