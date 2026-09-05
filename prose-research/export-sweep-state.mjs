// export-sweep-state.mjs — exports each sweep's FOUND CLAIMS and VERIFIED VERDICTS from its workflow journal into the kit,
// so a successor session (which cannot resume another session's workflow run id) restarts from the claims, not from zero.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
const WF = '/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/subagents/workflows/';
const OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/prose-research/sweep/';
const RUNS = { tolkien: 'wf_9b91b240-c98', martin: 'wf_e25da3f7-7fb', dnd: 'wf_6051234f-d27', ai: 'wf_60f0a1e1-39c' };
mkdirSync(OUT, { recursive: true });
const summary = {};
for (const [name, id] of Object.entries(RUNS)) {
  const j = WF + id + '/journal.jsonl'; if (!existsSync(j)) { summary[name] = 'no journal'; continue; }
  const claims = []; const sources = []; const verdicts = {};
  for (const line of readFileSync(j, 'utf8').split('\n')) { let d; try { d = JSON.parse(line); } catch { continue; }
    if (d.type !== 'result') continue; const r = d.result; if (!r || typeof r !== 'object') continue;
    if (Array.isArray(r.claims)) { for (const c of r.claims) claims.push(c); for (const s of (r.sourcesRead || [])) sources.push(s); }
    if (Array.isArray(r.verdicts)) for (const v of r.verdicts) verdicts[v.index] = v; }
  writeFileSync(OUT + 'state-' + name + '.json', JSON.stringify({ name, runId: id, exportedAt: new Date().toISOString(), claims, sources, verdicts }, null, 1));
  summary[name] = { claims: claims.length, sources: sources.length, verdictsSoFar: Object.keys(verdicts).length };
}
console.log(JSON.stringify(summary));
