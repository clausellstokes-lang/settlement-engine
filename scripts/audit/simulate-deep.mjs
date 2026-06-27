/**
 * simulate-deep.mjs — Phase 2b: do the SPECIFIC simulation dynamics happen, and at
 * every advance scale?
 *
 * Phase 2 proved the sim is bounded/alive/crash-free. This probes the actual
 * mechanics: tier PROMOTION/DEMOTION, WARS (sieges + trade wars), relationship /
 * faction / institution / NPC dynamics — across week/month/season/year AND across
 * both authority modes:
 *   - GATED (majorChangesRequireProposal: true, the default): majors are PROPOSED
 *     to the DM, not applied. We count what the sim OFFERS.
 *   - AUTO  (false, dramatic_campaign): majors AUTO-APPLY. We count what HAPPENS.
 *
 * Usage: npx vite-node scripts/audit/simulate-deep.mjs -- --reps 3 --ticks 30 --out <path.json>
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { liveSieges, liveTradeWars } from '../../src/domain/display/warStatus.js';
import { TIER_ORDER } from '../../src/domain/customContentSchema.js';
import { writeFileSync } from 'node:fs';

function arg(name, def) { const i = process.argv.indexOf(`--${name}`); return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def; }
const REPS = parseInt(arg('reps', '3'), 10);
const TICKS = parseInt(arg('ticks', '30'), 10);
const OUT = arg('out', 'scratchpad/simulate-deep.json');
const INTERVALS = ['one_week', 'one_month', 'one_season', 'one_year'];
const tierIdx = (t) => TIER_ORDER.indexOf(t);
const ID = (i) => String.fromCharCode(97 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : '');

// Two active topologies: an interdependent region + a war-prone frontier.
function buildTopo(kind, n, ids) {
  const ch = [];
  for (let i = 1; i < n; i++) ch.push({ type: kind === 'frontier' ? 'military_protection' : 'trade_dependency', from: ids[i - 1], to: ids[i], status: 'confirmed' });
  if (n > 2) ch.push({ type: 'political_authority', from: ids[0], to: ids[n - 1], status: 'confirmed' });
  for (let i = 0; i < n; i += 2) for (let j = i + 2; j < n; j += 3) ch.push({ type: 'trade_route', from: ids[i], to: ids[j], status: 'confirmed' });
  const stressors = kind === 'frontier'
    ? ids.slice(0, 3).map((id, k) => ({ id: `world_stressor.${k % 2 ? 'monster_pressure' : 'siege'}.${id}`, type: k % 2 ? 'monster_pressure' : 'siege', severity: 0.8, affectedSettlementIds: [id] }))
    : ids.slice(0, 1).map((id) => ({ id: `world_stressor.siege.${id}`, type: 'siege', severity: 0.75, affectedSettlementIds: [id] }));
  return { channels: ch, stressors };
}

function member(i, seed) {
  const tiers = ['hamlet', 'village', 'town', 'town', 'city']; // span tiers so promotion/demotion has room
  const s = generateSettlementPipeline({ settType: tiers[i % tiers.length], culture: 'germanic' }, null, { seed, customContent: {} });
  return { id: ID(i), name: s.name || `S-${i}`, phase: 'canon', settlement: s, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function inc(m, k, by = 1) { m[k] = (m[k] || 0) + by; }
function summ(a) { if (!a.length) return { n: 0 }; const s = a.slice().sort((x, y) => x - y); return { n: a.length, min: s[0], p50: s[(s.length / 2) | 0], mean: Math.round(a.reduce((x, y) => x + y, 0) / a.length * 100) / 100, max: s[s.length - 1] }; }

const TOPOS = { interdependent: 16, frontier: 12 };
const report = { meta: { reps: REPS, ticks: TICKS }, cells: {} };

for (const [topo, n] of Object.entries(TOPOS)) {
  for (const mode of ['gated', 'auto']) {
    for (const interval of INTERVALS) {
      const cell = {
        candidateTypes: {}, proposalsTotal: 0, autoAppliedTotal: 0,
        promotionsApplied: 0, demotionsApplied: 0, tierCandidates: 0,
        siegeStarts: 0, siegePeak: 0, tradeWarStarts: 0, tradeWarPeak: 0,
        relationshipEvents: 0, relTypeChanges: 0, relStateDrift: 0, conquests: 0, coups: 0, institutionChanges: 0, npcCulminations: 0,
        ranTicks: 0,
      };
      for (let r = 0; r < REPS; r++) {
        const ids = Array.from({ length: n }, (_, i) => ID(i));
        let saves = ids.map((i, k) => member(k, `deep-${topo}-${mode}-${interval}-${r}-${k}`));
        const { channels, stressors } = buildTopo(topo, n, ids);
        let campaign = {
          id: `${topo}-${mode}-${interval}-${r}`, name: topo, settlementIds: ids,
          worldState: { rngSeed: `deep-${topo}-${mode}-${interval}-${r}`, tick: 0, stressors, simulationRules: { majorChangesRequireProposal: mode === 'gated' } },
          regionalGraph: ensureRegionalGraph({ channels }),
          wizardNews: { currentTick: 0, entries: [] },
        };
        let tierById = new Map(saves.map(s => [s.id, s.settlement.tier]));
        let prevSieges = liveSieges(campaign).length, prevTradeWars = liveTradeWars(campaign).length;
        // Relationship evolution lives in worldState.relationshipStates (not candidates):
        // snapshot each edge's relationshipType + a JSON fingerprint to detect drift.
        const relSnap = (ws) => { const m = {}; for (const [k, v] of Object.entries(ws?.relationshipStates || {})) m[k] = { t: v?.relationshipType, j: JSON.stringify(v) }; return m; };
        let prevRel = relSnap(campaign.worldState);
        for (let t = 0; t < TICKS; t++) {
          let result;
          try { result = advanceCampaignWorld({ campaign, saves, interval, now: `2026-03-01T00:00:${String(t % 60).padStart(2, '0')}.000Z` }); }
          catch { inc(cell, 'throws'); break; }
          if (!result) break;
          cell.ranTicks++;
          for (const c of (result.candidates || [])) {
            const ct = c.candidateType || c.type || 'unknown';
            inc(cell.candidateTypes, ct);
            if (/tier/.test(ct)) cell.tierCandidates++;
            if (/conquest/.test(ct)) cell.conquests++;
            if (/coup/.test(ct)) cell.coups++;
            if (/institution/.test(ct)) cell.institutionChanges++;
            if (/relationship|disposition/.test(ct)) cell.relationshipEvents++;
            if (/npc_goal/.test(ct)) cell.npcCulminations++;
          }
          cell.proposalsTotal += (result.proposals || []).length;
          cell.autoAppliedTotal += (result.autoApplied || []).length;
          campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
          saves = saves.map(s => { const u = result.settlementUpdates?.find(x => String(x.saveId) === String(s.id)); return u ? { ...s, settlement: u.settlement } : s; });
          // applied tier changes
          for (const s of saves) {
            const prev = tierById.get(s.id), now = s.settlement.tier;
            if (prev && now && prev !== now) { if (tierIdx(now) > tierIdx(prev)) cell.promotionsApplied++; else cell.demotionsApplied++; tierById.set(s.id, now); }
          }
          // war trajectory
          const sieges = liveSieges(campaign).length, tw = liveTradeWars(campaign).length;
          cell.siegePeak = Math.max(cell.siegePeak, sieges); cell.tradeWarPeak = Math.max(cell.tradeWarPeak, tw);
          if (sieges > prevSieges) cell.siegeStarts += sieges - prevSieges;
          if (tw > prevTradeWars) cell.tradeWarStarts += tw - prevTradeWars;
          prevSieges = sieges; prevTradeWars = tw;
          // relationship-state evolution (type change = escalation/de-escalation; drift = any change)
          const nowRel = relSnap(campaign.worldState);
          for (const [k, v] of Object.entries(nowRel)) {
            const p = prevRel[k];
            if (!p) continue;
            if (p.t !== v.t) cell.relTypeChanges++;
            if (p.j !== v.j) cell.relStateDrift++;
          }
          prevRel = nowRel;
        }
      }
      const perTick = (x) => Math.round(x / Math.max(1, cell.ranTicks) * 1000) / 1000;
      report.cells[`${topo}|${mode}|${interval}`] = {
        ...cell,
        candidatesPerTick: perTick(cell.proposalsTotal + cell.autoAppliedTotal),
        topCandidateTypes: Object.fromEntries(Object.entries(cell.candidateTypes).sort((a, b) => b[1] - a[1]).slice(0, 8)),
      };
      process.stderr.write(`  ${topo}|${mode}|${interval}: promo=${cell.promotionsApplied} demo=${cell.demotionsApplied} tierCand=${cell.tierCandidates} siegePeak=${cell.siegePeak} TWpeak=${cell.tradeWarPeak} conquest=${cell.conquests} coup=${cell.coups} inst=${cell.institutionChanges} relType=${cell.relTypeChanges} relDrift=${cell.relStateDrift} auto=${cell.autoAppliedTotal} prop=${cell.proposalsTotal}\n`);
    }
  }
}
writeFileSync(OUT, JSON.stringify(report, null, 2));
process.stderr.write(`DONE → ${OUT}\n`);
