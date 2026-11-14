// REVIEW-UPKEEP-MONOTONE 8(e): THE PULSE on worlds of the reviewer's own born records, played through the century soak's
// own seam (simulateCampaignWorldInterval, the full_simulation preset via composeSoakRules), the same world at the base and
// at the tip (each tree's records, each tree's code). Per year: the event-type counts and every war-shaped worldState key.
//   TREE=<tree> node pulse.mjs <record_dir> <out.json> <years> <world spec: seedA,seedB,...;seed...>
import fs from 'node:fs'; import zlib from 'node:zlib'; import { createHash } from 'node:crypto';
const T = process.env.TREE;
const { composeSoakRules, soakAdvanceEpoch } = await import(T + '/scripts/audit/soakRules.mjs');
const { observeBehavioralYear } = await import(T + '/scripts/audit/behavioral-observation.mjs');
const { simulateCampaignWorldInterval } = await import(T + '/src/domain/worldPulse/advanceInterval.js');
const { SIMULATION_RULE_PRESETS } = await import(T + '/src/domain/worldPulse/simulationRules.js');
const { ensureRegionalGraph } = await import(T + '/src/domain/region/index.js');
const NOW = '2026-07-12T00:00:00.000Z';
const [dir, outf, yearsArg, spec] = process.argv.slice(2);
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 12);
const WARRY = /war|siege|occup|army|armies|conquest|battle|campaignFront|muster|mobiliz|levy|raid/i;
const out = [];
let w = 0;
for (const world of spec.split(';')) {
  const seeds = world.split(','); w += 1;
  const saves = seeds.map((seed, i) => ({ id: `w${w}-${i}`, name: seed, phase: 'canon', settlement: JSON.parse(zlib.gunzipSync(fs.readFileSync(`${dir}/${seed}.json.gz`))), campaignState: { phase: 'canon', eventLog: [], locks: {} } }));
  const edges = []; const channels = [];
  for (let i = 0; i + 1 < saves.length; i++) {
    edges.push({ id: `edge.${saves[i].id}.${saves[i + 1].id}`, from: saves[i].id, to: saves[i + 1].id, relationshipType: i % 2 ? 'hostile' : 'rival' });
    channels.push({ type: 'trade_dependency', from: saves[i].id, to: saves[i + 1].id, status: 'confirmed', strength: 0.5, goods: [] });
  }
  edges.push({ id: `edge.${saves[0].id}.${saves[saves.length - 1].id}`, from: saves[0].id, to: saves[saves.length - 1].id, relationshipType: 'hostile' });
  const { fullRules } = composeSoakRules({ preset: SIMULATION_RULE_PRESETS.full_simulation.rules, seasons: 'preset', overlay: {} });
  let campaign = { id: `pulse-${w}`, name: `Pulse ${w}`, settlementIds: saves.map((s) => s.id), regionalGraph: ensureRegionalGraph({ edges, channels }, { now: NOW }), wizardNews: { currentTick: 0, entries: [] },
    worldState: { rngSeed: 1000 + w, tick: 0, canonizedAt: NOW, simulationRules: fullRules, stressors: [] } };
  let run = saves; const years = [];
  for (let year = 1; year <= Number(yearsArg); year++) {
    const before = run; const raw = new Map();
    let result;
    try {
      result = await simulateCampaignWorldInterval({ campaign, saves: run, interval: 'one_year', commit: true, now: NOW, autoResolve: true,
        advanceEpoch: soakAdvanceEpoch({ simulationRules: campaign.worldState.simulationRules, seed: 1000 + w, year }),
        onTickObservation: ({ rawWizardNewsEntries }) => { for (const e of rawWizardNewsEntries || []) if (e && e.id) raw.set(String(e.id), e); } });
    } catch (e) { years.push({ year, error: String(e).slice(0, 300) }); break; }
    campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
    if (Array.isArray(result.settlementUpdates)) { const m = new Map(result.settlementUpdates.map((u) => [String(u.saveId), u.settlement])); run = run.map((s) => (m.has(s.id) ? { ...s, settlement: m.get(s.id) } : s)); }
    const obs = observeBehavioralYear({ year, result, beforeSaves: before, afterSaves: run, rawWizardNewsEntries: [...raw.values()] });
    const ws = result.worldState || {};
    const warKeys = Object.fromEntries(Object.keys(ws).filter((k) => WARRY.test(k)).map((k) => [k, sha(ws[k])]));
    const warEvents = Object.fromEntries(Object.entries(obs?.eventTypeCounts || {}).filter(([k]) => WARRY.test(k)));
    const news = [...raw.values()].filter((e) => WARRY.test(JSON.stringify([e.type, e.kind, e.category, e.headline || e.title || '']))).map((e) => `${e.type || e.kind}:${(e.headline || e.title || '').slice(0, 90)}`);
    years.push({ year, events: obs?.eventTypeCounts || {}, warEvents, warKeys, news: news.slice(0, 40), stress: run.map((s) => (Array.isArray(s.settlement.stress) ? s.settlement.stress : s.settlement.stress ? [s.settlement.stress] : []).map((x) => x?.type).join('+')),
      military: run.map((s) => s.settlement.defenseProfile?.scores?.military), readiness: run.map((s) => s.settlement.defenseProfile?.readiness?.score), pop: run.map((s) => s.settlement.population) });
  }
  out.push({ world: w, seeds, years });
}
fs.writeFileSync(outf, JSON.stringify(out, null, 1));
console.log('worlds', out.length, 'errors', out.flatMap((x) => x.years).filter((y) => y.error).map((y) => y.error));
