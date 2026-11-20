#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/history-examples.mjs — SEAT-1's measure for CS17 (history may say a change of
 * seat). Measures; changes nothing. On the default pool (measure-holder.mjs's births): the templateTypes of
 * history.historicalEvents; then, for towns whose record ALREADY holds a cause (an event of a political type, or the
 * questioned/vacant mandate circumstance) AND whose seat is held by a power (seat-draft.mjs :: holderOf R2/R3), a draft
 * line that names the event and the holder and agrees with the record. Writes history-examples.{json,md}.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../..');
const imp = (p) => import(join(ROOT, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { nameOf } = await imp('src/domain/rulingPower.js');
const D = await import(join(HERE, 'seat-draft.mjs'));
await loadGenerationLawPayloads();
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const POLITICAL = /succession|coup|revolt|rebell|usurp|civil|guild_conflict|election|uprising|faction|noble|depos|regency|charter|tyran|war_of/i;
const types = {}; const examples = []; let towns = 0, withCause = 0, withHolder = 0;
for (const tier of TIERS) for (let i = 0; i < 150; i++) {
  const seed = `seat-measure-${tier}-${i}`;
  const s = generateSettlementPipeline(birthConfig({ settType: tier }), null, { seed, customContent: {} });
  towns += 1;
  const evs = Array.isArray(s.history?.historicalEvents) ? s.history.historicalEvents : [];
  for (const e of evs) types[e.templateType || e.type || '(none)'] = (types[e.templateType || e.type || '(none)'] || 0) + 1;
  const pol = evs.filter((e) => POLITICAL.test(String(e.templateType || '')) || POLITICAL.test(String(e.type || '')));
  const held = D.circumstancesOf(s);
  const cause = pol[0] || (held.includes('mandate') ? { name: null, mandate: true } : null);
  if (!cause) continue;
  withCause += 1;
  const h = D.holderOf(s);
  if (!h.holder) continue;
  withHolder += 1;
  if (examples.length >= 12 && examples.filter((x) => x.mandateOnly).length >= 3) continue;
  const form = s.powerStructure.government;
  const holder = nameOf(h.holder);
  const line = cause.name
    ? `Since ${cause.name} (${cause.yearsAgo} years ago: "${cause.description}"), the ${form} has answered to ${holder}.`
    : `The ${form}'s mandate is questioned (${s.powerStructure.publicLegitimacy?.label}); it answers to ${holder}, and not everyone accepts that it should.`;
  if (examples.length < 12 || (!cause.name && examples.filter((x) => x.mandateOnly).length < 3)) {
    examples.push({ seed, tier, form, holder, rule: h.rule, event: cause.name ? `${cause.name} [${cause.templateType}]` : null, mandateOnly: !cause.name, legitimacy: s.powerStructure.publicLegitimacy?.label, line });
  }
}
const out = { meta: { script: 'docs/chair/2026-11-20/content/seat/history-examples.mjs', towns, withCause, withHolder }, templateTypes: Object.fromEntries(Object.entries(types).sort((a, b) => b[1] - a[1])), examples: examples.slice(0, 12) };
writeFileSync(join(HERE, 'history-examples.json'), `${JSON.stringify(out, null, 1)}\n`);
const L = [`# CS17: history may say a change of seat (default pool, ${towns} towns)`, '', `Executed: \`node ${out.meta.script}\`. Towns whose record already holds a cause (a political history event, or a questioned/vacant mandate): ${withCause}; of those, a seat held by a power (R2/R3): ${withHolder}.`, '',
  `History event types (all towns): ${Object.entries(out.templateTypes).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '', '## Twelve draft lines', ''];
for (const e of out.examples) L.push(`- **${e.seed}** (${e.form}, held by ${e.holder} via ${e.rule}; ${e.event ? `event ${e.event}` : `mandate ${e.legitimacy}`}): ${e.line}`);
writeFileSync(join(HERE, 'history-examples.md'), `${L.join('\n')}\n`);
process.stderr.write(`wrote history-examples (${towns} towns)\n`);
