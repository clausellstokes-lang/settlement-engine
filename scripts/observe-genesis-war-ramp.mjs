#!/usr/bin/env node
/**
 * observe-genesis-war-ramp.mjs — THE POLIS-5 OBSERVATION HARNESS (A1.2.8).
 *
 * WHAT THIS IS FOR. POLIS-5 (the genesis ongoing-war option — a realm that begins
 * mid-conflict rather than at peace) is HELD, not refused: the volume bounds it
 * behind an observation, because nobody can charter a founding war without first
 * knowing what a Dramatic-tone realm does on its OWN in its first ticks. If the
 * mobilization ramp already produces war within a handful of ticks, a founding war
 * is redundant scenery; if it never does, the option is the only way that tone
 * keeps its promise. This harness produces that readout and NOTHING else — the
 * terminal fork (dispatch POLIS-5 pre-soak, or convert it to an owner row recording
 * the deferral) is decided at the readout, by the chair, not by this instrument.
 *
 * WHY IT LIVES IN scripts/ AND NOT tests/. It OBSERVES; it does not assert. Its
 * output is a measurement whose value is unknown in advance, so there is no green
 * for it to defend — and A1.2.13's discipline is that an instrument enters tests/
 * only in the act that makes it green. Putting an unknown-valued measurement in the
 * gate would either pin whatever today happens to do (freezing an accident into a
 * law) or red the suite for a finding.
 *
 * ⛔ THE COHERENCE SET SPANS TWO PLANES, AND THAT IS THE TRAP THIS FILE EXISTS TO
 * AVOID. A1.2.8 enumerates four members — deployments, war_front, warPosture,
 * warExhaustion — and it reads like one list of worldState keys. It is not.
 * THREE of them are worldState ledgers; `war_front` is a REGIONAL-GRAPH CHANNEL
 * TYPE, pulse-minted onto the graph beside the deployment record, and it appears
 * nowhere on worldState at all. A harness that read all four off worldState would
 * report `war_front` permanently EMPTY and would have reported it in exactly the
 * confident shape a reader trusts. Each member below is read on its own plane, and
 * the plane is named in the output so the reader can check it.
 *
 * Usage: node scripts/observe-genesis-war-ramp.mjs [--ticks N] [--seeds N]
 */
import { composeInstantWorld, loadGenerationLawPayloads } from '../src/lib/instantWorld/composeInstantWorld.js';
import { advanceCampaignWorld } from '../src/domain/worldPulse/advanceCampaignWorld.js';

const argv = process.argv.slice(2);
const argOf = (flag, dflt) => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : dflt;
};
const TICKS = argOf('--ticks', 12);
const SEEDS = argOf('--seeds', 5);
const NOW = '2026-01-01T00:00:00.000Z';

const countOf = (v) => (v && typeof v === 'object' ? Object.keys(v).length : 0);

/** The four coherence-set members, each read on the plane that actually holds it. */
function observe(worldState, regionalGraph) {
  const channels = Array.isArray(regionalGraph?.channels) ? regionalGraph.channels : [];
  return {
    // ── worldState ledgers ──
    deployments: countOf(worldState?.deployments),
    warPosture: countOf(worldState?.warPosture),
    warExhaustion: countOf(worldState?.warExhaustion),
    // ── regional graph channel set (NOT worldState) ──
    war_front: channels.filter(c => c?.type === 'war_front' || c?.channelType === 'war_front').length,
  };
}

/**
 * THE FOUNDING-STAMP LAW (A1.2.8). Every tick-valued field on a freshly composed
 * realm must be the FOUNDING tick — there must be no back-dated ramp, turning
 * point, or incident, because a realm that is one tick old cannot honestly carry a
 * history. This walks the composed bundle before a single tick runs and reports any
 * tick-valued field it finds, so a non-zero reading is visible rather than assumed
 * away.
 */
function foundingStampScan(campaign) {
  const hits = [];
  const seen = new WeakSet();
  const walk = (v, path) => {
    if (!v || typeof v !== 'object' || seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${path}[${i}]`)); return; }
    for (const [k, val] of Object.entries(v)) {
      if (/tick/i.test(k) && typeof val === 'number' && val !== 0) {
        hits.push({ path: `${path}.${k}`, value: val });
      }
      walk(val, `${path}.${k}`);
    }
  };
  walk(campaign, 'campaign');
  return hits;
}

// The create boundary's async prelude. The composer is a BIRTH and is
// synchronous, so it cannot load the lazy payload the law it mints needs; since
// the living-content dial was lit (2026-09-08) the seam throws rather than
// degrading when nothing has. Top-level await, like this script's own loop.
await loadGenerationLawPayloads();

const rows = [];
for (let i = 0; i < SEEDS; i++) {
  const seed = `polis5-observe-${String(i + 1).padStart(3, '0')}`;
  const bundle = composeInstantWorld({
    seed,
    basicConfig: { realmSize: 'medium', tone: 'dramatic_campaign', mapKind: 'highIsland' },
    idFactory: (() => { let n = 0; return () => `obs-${i}-${n++}`; })(),
    clock: () => NOW,
  });

  const atFounding = observe(bundle.campaign.worldState, bundle.campaign.regionalGraph);
  const stamps = foundingStampScan(bundle.campaign);

  let campaign = bundle.campaign;
  const perTick = [];
  let firstWarTick = null;
  for (let t = 1; t <= TICKS; t++) {
    let result;
    try {
      result = advanceCampaignWorld({
        campaign, saves: bundle.settlements, interval: 'one_month', now: NOW,
      });
    } catch (err) {
      perTick.push({ tick: t, error: String(err && err.message ? err.message : err) });
      break;
    }
    campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph || campaign.regionalGraph };
    const o = observe(result.worldState, campaign.regionalGraph);
    // ⛔ THE LIVENESS COLUMNS, AND THEY ARE NOT DECORATION. A war reading of zero
    // has TWO causes that look identical in a readout: the ramp genuinely produced
    // no war, or the harness never drove the engine at all. An instrument that
    // cannot tell those apart reports "no war in N ticks" with the same confidence
    // in both cases, and the second is a false finding that would decide POLIS-5
    // the wrong way. Candidate count and worldState key growth are carried on every
    // row so a zero is always accompanied by the proof that the engine ran.
    perTick.push({
      tick: t,
      ...o,
      candidates: (result.candidates || []).length,
      wsKeys: Object.keys(result.worldState || {}).length,
    });
    if (firstWarTick === null && (o.deployments > 0 || o.war_front > 0)) firstWarTick = t;
  }

  rows.push({ seed, atFounding, foundingStampHits: stamps, firstWarTick, perTick });
}

// ── THE READOUT ────────────────────────────────────────────────────────────
console.log(`POLIS-5 OBSERVATION — Dramatic tone, ${SEEDS} seeds x ${TICKS} ticks`);
console.log('');
console.log('AT FOUNDING (before any tick):');
for (const r of rows) {
  const f = r.atFounding;
  console.log(`  ${r.seed}: deployments=${f.deployments} warPosture=${f.warPosture} warExhaustion=${f.warExhaustion} war_front=${f.war_front} | back-dated tick fields: ${r.foundingStampHits.length}`);
  for (const h of r.foundingStampHits.slice(0, 5)) console.log(`      ⚠ ${h.path} = ${h.value}`);
}
console.log('');
console.log('FIRST TICK AT WHICH WAR APPEARS (deployments>0 or war_front>0):');
for (const r of rows) {
  console.log(`  ${r.seed}: ${r.firstWarTick === null ? `NONE within ${TICKS} ticks` : `tick ${r.firstWarTick}`}`);
}
console.log('');
console.log('FINAL STATE:');
for (const r of rows) {
  const last = r.perTick[r.perTick.length - 1] || {};
  if (last.error) { console.log(`  ${r.seed}: ERROR at tick ${last.tick}: ${last.error}`); continue; }
  console.log(`  ${r.seed} @t${last.tick}: deployments=${last.deployments} warPosture=${last.warPosture} warExhaustion=${last.warExhaustion} war_front=${last.war_front}`);
}
console.log('');
console.log('LIVENESS (the proof a zero above is a FINDING and not a dead harness):');
for (const r of rows) {
  const ticks = r.perTick.filter(t => !t.error);
  const cands = ticks.reduce((n, t) => n + (t.candidates || 0), 0);
  const keyGrowth = ticks.length ? `${ticks[0].wsKeys}→${ticks[ticks.length - 1].wsKeys}` : 'n/a';
  console.log(`  ${r.seed}: ${ticks.length} ticks ran, ${cands} candidates evaluated, worldState keys ${keyGrowth}`);
}
console.log('');
const reached = rows.filter(r => r.firstWarTick !== null).length;
const totalCandidates = rows.reduce((n, r) => n + r.perTick.reduce((m, t) => m + (t.candidates || 0), 0), 0);
console.log(`SUMMARY: ${reached}/${rows.length} seeds reached war within ${TICKS} ticks.`);
console.log(`Founding-stamp law: ${rows.reduce((n, r) => n + r.foundingStampHits.length, 0)} back-dated tick fields across all seeds (0 is the law).`);
if (reached === 0 && totalCandidates === 0) {
  console.log('⛔ VACUOUS READOUT: zero war AND zero candidates — the harness did not drive the engine.');
  console.log('   Do NOT read the war result as a finding; fix the driver first.');
  process.exitCode = 3;
} else if (reached === 0) {
  console.log(`✅ The zero is a FINDING: ${totalCandidates} candidates were evaluated across the run.`);
}
