/** Emit the Tier-1 literal as measured: step · key · kind · draws · drawn|pure · onRecord. */
import { readFileSync, writeFileSync } from 'node:fs';

const m3 = JSON.parse(readFileSync(new URL('./m3-result-stride1.json', import.meta.url), 'utf-8'));
const m45 = JSON.parse(readFileSync(new URL('./m4-m5-result.json', import.meta.url), 'utf-8'));
const m2 = JSON.parse(readFileSync(new URL('./m2-result.json', import.meta.url), 'utf-8'));
const drewIn = Object.fromEntries(m2.out.map(o => [o.step, `${o.rowsDrawn}/${o.rows}`]));
const record = new Map(m45.m4dump.map(d => {
  const v = d.verdicts;
  const same = new Set(v.map(x => x.verdict));
  const town = v[1];
  let tag;
  if (town.verdict === 'IS THE RECORD') tag = 'IS THE RECORD';
  else if (town.verdict === 'SAME NAME, SAME VALUE') tag = `record.${d.key}`;
  else if (town.verdict === 'SAME NAME, VALUE DIFFERS') tag = `record.${d.key} (VALUE DIFFERS from ctx)`;
  else if (town.verdict.startsWith('VALUE MATCH (nested')) tag = `record.${town.where}`;
  else if (town.verdict.startsWith('VALUE MATCH (scalar')) tag = 'NOT CARRIED (only a coincidental scalar match)';
  else if (town.verdict === 'NAME ELSEWHERE, VALUE DIFFERS') tag = `name at record.${town.where.split(' , ')[0]} but a DIFFERENT value`;
  else tag = 'ABSENT';
  if (same.size > 1) tag += ` [tier-dependent: ${v.map(x => `${x.tier}=${x.verdict}`).join('; ')}]`;
  return [d.key, tag];
}));

const lines = [];
lines.push('| step | key | provides/mutates | step draws (rows of 525) | key drawn? (rows moved of 525) | reaches the record |');
lines.push('|---|---|---|---:|---|---|');
for (const d of m3.dump) {
  const cls = d.moved === 0 ? '**pure** (0)' : `**drawn** (${d.moved})`;
  lines.push(`| \`${d.step}\` | \`${d.key}\` | ${d.kind} | ${drewIn[d.step]} | ${cls} | ${record.get(d.key) ?? '?'} |`);
}
const text = lines.join('\n');
writeFileSync(new URL('./TIER1-LITERAL.md', import.meta.url), `${text}\n`);
console.log(text);
console.log(`\nrows=${m3.dump.length} drawn=${m3.dump.filter(d => d.moved > 0).length} pure=${m3.dump.filter(d => d.moved === 0).length}`);
