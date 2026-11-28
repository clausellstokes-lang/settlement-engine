// K2 MEASURE: on each birth, every stored string leaf that holds the town's name (Unicode-aware whole word, as
// substituteWholeWord matches), by path; and the HAZARDS: another stored name (a person, a house, a power, a quarter, a
// neighbour, any `name`/`faction`-like field) that holds the town's name inside it, as a whole word or as a part.
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { appendFileSync } from 'node:fs';
const W = '[\\p{L}\\p{N}\\p{M}_]';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NAMEISH = /(^|\.)(name|faction|holderName|npcName|npc1Name|npc2Name|partner|from|to|target|source|label|title)$/;
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    const t = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const nm = String(t.name);
    const whole = new RegExp(`(?<!${W})${esc(nm)}(?!${W})`, 'gu');
    const part = new RegExp(esc(nm), 'giu');
    const leaves = []; const hazards = [];
    const walk = (v, p, k) => {
      if (typeof v === 'string') {
        if (p === 'name') return;
        const w = (v.match(whole) || []).length; const any = (v.match(part) || []).length;
        if (w) leaves.push([p, w, v.length > 400 ? `${v.slice(0, 400)}…` : v]);
        if (any > w) hazards.push(['part', p, v.slice(0, 200)]); // the name inside a longer word (case-folded)
        if (w && NAMEISH.test(p) && v !== nm) hazards.push(['inName', p, v.slice(0, 200)]); // a whole-word hit in another NAME
        if (v === nm) hazards.push(['exact', p, v]);
      } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, k));
      else if (v && typeof v === 'object') for (const [kk, x] of Object.entries(v)) walk(x, p ? `${p}.${kk}` : kk, kk);
    };
    walk(t, '', '');
    const persons = (t.npcs || []).map((n) => String(n?.name || ''));
    appendFileSync(out, `${JSON.stringify({ seed: row.seed, size: row.size, name: nm, words: nm.split(/\s+/).length, personHolds: persons.filter((p) => new RegExp(`(?<!${W})${esc(nm)}(?!${W})`, 'u').test(p) || p.split(/\s+/).includes(nm)), leaves, hazards })}\n`);
  }
  console.log('done');
}
