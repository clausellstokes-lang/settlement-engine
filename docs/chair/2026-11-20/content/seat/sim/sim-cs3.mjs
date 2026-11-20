#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/sim/sim-cs3.mjs — SIM-MEASURE (SEAT-1, the seventh chair, 2026-11-20).
 * MEASURES; changes nothing under src/. What does CS3 (the holder never contests its own seat) do to the RATE of coups
 * and to WHO WINS them, in a simulated campaign on born towns of today's law?
 *
 * The same instrument runs from two trees of the SAME commit:
 *   arm A  --tree <this checkout>                         the shipped coupContenders;
 *   arm B  --tree <scratchpad>/simB --arm B               a throwaway worktree whose coupContenders drops the row
 *                                                         seat-draft.mjs :: holderOf names (patch read from
 *                                                         globalThis.__SIM_CS3__, installed AFTER the towns are born,
 *                                                         so both arms start from byte-identical towns: asserted).
 * Every module (generator, pulse, coup leaf, the draft) is imported from --tree, so arm B's pulse reads the patch.
 *
 * Pool: --regions R regions x --towns T born towns (mixed tiers, birthConfig, seeds `sim-cs3-r<r>-<i>`), each region run
 * under --seeds S world rng seeds, --ticks N one-week ticks of advanceCampaignWorld (the real pulse, the simulate-world
 * harness's own threading). Rules: DEFAULT_SIMULATION_RULES + stressorsEnabled, factionCompetitionEnabled (both
 * default-true, stated) + majorChangesRequireProposal:false (a coup_detat birth is a MAJOR, applyMode 'proposal';
 * without this no coup stressor ever lands — the simulate-world harness's own setting).
 * Every advance is followed by autoAdjudicateAdvanceProposals (FULL AUTO-RESOLVE: every proposal accepted through the
 * hand-accept path), the product's own wide-world mode; without it no coup_detat birth (a MAJOR proposal) ever lands.
 * --legit born|<n>: 'born' leaves every town's legitimacy as born; a number caps every town's score at n at tick 0
 * (the hand-lowered arm; reported beside the born arm, never alone).
 *
 *   node docs/chair/2026-11-20/content/seat/sim/sim-cs3.mjs --tree <root> --arm A|B --out <json>
 *        [--regions 3 --towns 14 --seeds 2 --ticks 52 --legit born]
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(`--${flag}`); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
const TREE = resolve(argOf('tree', process.cwd()));
const ARM = argOf('arm', 'A');
const OUT = argOf('out', null);
const REGIONS = Number(argOf('regions', 3));
const TOWNS = Number(argOf('towns', 14));
const SEEDS = Number(argOf('seeds', 2));
const TICKS = Number(argOf('ticks', 52));
const LEGIT = argOf('legit', 'born');
if (!OUT) throw new Error('--out required');

const imp = (p) => import(join(TREE, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { advanceCampaignWorld } = await imp('src/domain/worldPulse/index.js');
const { autoAdjudicateAdvanceProposals } = await imp('src/domain/worldPulse/autoAdjudication.js');
const { ensureRegionalGraph } = await imp('src/domain/region/index.js');
const { coupContenders } = await imp('src/domain/rulingPowerCoup.js');
const { governanceLedger } = await imp('src/domain/governanceLedger.js');
const { factionArchetype } = await imp('src/domain/factionArchetypes.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const DRAFT_PATH = join(TREE, 'docs/chair/2026-11-20/content/seat/seat-draft.mjs');
const D = await import(DRAFT_PATH);
const coupSrc = readFileSync(join(TREE, 'src/domain/rulingPowerCoup.js'), 'utf8');
const patched = coupSrc.includes('__SIM_CS3__');
if ((ARM === 'B') !== patched) throw new Error(`arm ${ARM} but tree patched=${patched}`);
await loadGenerationLawPayloads();

const sha = (x) => createHash('sha256').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 16);
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const sorted = (m) => Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)));
const TIERS = ['thorp', 'hamlet', 'village', 'village', 'town', 'town', 'town', 'town', 'city', 'city', 'city', 'metropolis', 'hamlet', 'village'];
const tierOf = (i) => TIERS[i % TIERS.length];
const ID = (r, i) => `r${r}t${String(i).padStart(2, '0')}`;

// ── born towns (generated BEFORE any patch hook is installed: the same towns in both arms) ──
const t0 = Date.now();
const born = {}; // region -> [{id, tier, seed, settlement}]
const birthErrors = [];
for (let r = 0; r < REGIONS; r++) {
  born[r] = [];
  for (let i = 0; i < TOWNS; i++) {
    const tier = tierOf(i); const seed = `sim-cs3-r${r}-${i}`;
    try { born[r].push({ id: ID(r, i), tier, seed, settlement: generateSettlementPipeline(birthConfig({ settType: tier }), null, { seed, customContent: {} }) }); }
    catch (e) { birthErrors.push({ seed, error: String(e).slice(0, 200) }); }
  }
}
const birthFingerprint = sha(Object.values(born).flat().map((b) => sha(b.settlement)).join(','));
const birthLegit = {};
for (const b of Object.values(born).flat()) bump(birthLegit, String(Math.floor((governanceLedger(b.settlement).legitimacyScore ?? -10) / 10) * 10));

// ── arm B: install CS3 (the patched coupContenders reads it) ──
const cs3 = { holderOf: (s) => D.holderOf(s), calls: 0, excluded: 0, throws: 0, lastThrow: null };
if (ARM === 'B') globalThis.__SIM_CS3__ = cs3;

const RULES = { stressorsEnabled: true, factionCompetitionEnabled: true, majorChangesRequireProposal: false };
const COUP = 'coup_detat';

const tot = {
  ranTicks: 0, throws: [], adjudicated: 0, coupIdsNew: 0, coupCandidates: 0, coupBorn: 0, resolved: 0, directed: 0, verdicts: 0, fell: 0, held: 0,
  collapsedNoChallengers: 0, ungatedFalls: 0, verdictOutcomesQueuedAsProposal: 0,
  winnerContestKind: {}, winnerFactionArchetype: {}, winnerWasHolder: 0, winnerHolderUnknown: 0,
  holderInChallengersAtVerdict: 0, holderRuleAtVerdict: {}, govChanges: 0,
  gateOpenTownTicks: 0, holderContendsTownTicks: 0, holderExistsTownTicks: 0,
};
const townLog = {}; // `${world}/${id}` -> { gateOpenTicks, candidates, born, fell, held, collapsed, winners[] }
const events = []; // ordered coup events for the determinism fingerprint
const proposalTypes = {};

function buildWorld(r, seedIdx) {
  const towns = born[r].map((b) => ({ ...b, settlement: structuredClone(b.settlement) }));
  if (LEGIT !== 'born') {
    const cap = Number(LEGIT);
    for (const t of towns) {
      const pl = t.settlement.powerStructure?.publicLegitimacy;
      const score = governanceLedger(t.settlement).legitimacyScore;
      if (Number.isFinite(score) && score > cap) t.settlement.powerStructure = { ...t.settlement.powerStructure, publicLegitimacy: { ...(pl && typeof pl === 'object' ? pl : {}), score: cap } };
    }
  }
  const saves = towns.map((t) => ({ id: t.id, name: t.settlement.name || t.id, phase: 'canon', settlement: t.settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } }));
  const ids = saves.map((s) => s.id);
  const edges = []; const channels = [];
  for (let i = 1; i < ids.length; i++) {
    edges.push({ id: `edge.${ids[i - 1]}.${ids[i]}`, from: ids[i - 1], to: ids[i], relationshipType: i % 3 ? 'trade_partner' : 'allied' });
    channels.push({ type: 'trade_dependency', from: ids[i - 1], to: ids[i], status: 'confirmed' });
  }
  const worldSeed = `sim-cs3-world-r${r}-s${seedIdx}`;
  const campaign = { id: worldSeed, name: 'sim-cs3', settlementIds: ids,
    worldState: { rngSeed: worldSeed, tick: 0, stressors: [], simulationRules: RULES },
    regionalGraph: ensureRegionalGraph({ edges, channels }), wizardNews: { currentTick: 0, entries: [] } };
  return { saves, campaign, worldSeed };
}

const activeOccupation = (worldState, sid) => (worldState?.stressors || []).some((x) => x?.type === 'occupation' && (x.affectedSettlementIds || []).map(String).includes(sid) && !x.resolved);

for (let r = 0; r < REGIONS; r++) for (let si = 0; si < SEEDS; si++) {
  let { saves, campaign, worldSeed } = buildWorld(r, si);
  for (let t = 0; t < TICKS; t++) {
    // pre-tick reads: the settlement the verdict reads is the save handed into this tick
    const pre = new Map(saves.map((s) => [String(s.id), s.settlement]));
    // a coup's id is `world_stressor.coup_detat.<town>`, so a second coup in one town reuses it: a birth is an id
    // present after the tick and absent before it
    const coupIdsBefore = new Set((campaign.worldState?.stressors || []).filter((x) => x?.type === COUP).map((x) => x.id));
    const preHolder = new Map();
    for (const s of saves) {
      const sid = String(s.id); const key = `${worldSeed}/${sid}`;
      const tl = (townLog[key] ||= { gateOpenTicks: 0, candidates: 0, born: 0, fell: 0, held: 0, collapsed: 0, winners: [] });
      let h = null; try { h = D.holderOf(s.settlement); } catch (e) { tot.throws.push({ where: 'holderOf(pre)', key, tick: t, error: String(e).slice(0, 200) }); }
      preHolder.set(sid, h);
      const cc = coupContenders(s.settlement); // this tree's coupContenders (patched in B)
      const score = governanceLedger(s.settlement).legitimacyScore;
      if (score < 45 && !activeOccupation(campaign.worldState, sid) && cc.challengers.length) { tl.gateOpenTicks += 1; tot.gateOpenTownTicks += 1; }
      if (h?.holder) { tot.holderExistsTownTicks += 1; if (cc.challengers.some((c) => c.name === nameOf(h.holder))) tot.holderContendsTownTicks += 1; }
    }
    let res;
    const now = `2026-03-01T00:00:${String(t % 60).padStart(2, '0')}.000Z`;
    try {
      res = advanceCampaignWorld({ campaign, saves, interval: 'one_week', now });
      // FULL AUTO-RESOLVE (the DM's "the realm rules on its own" toggle, campaignAdvanceSession.js): every proposal
      // row, held and minted, is ruled through the hand-accept path. Without it a coup_detat birth (a MAJOR, always
      // applyMode 'proposal') never lands and the docket's major cap fills: measured 176 rolled, 0 born.
      const ruled = autoAdjudicateAdvanceProposals({ campaign, saves, result: res, now });
      if (ruled && ruled !== res) { tot.adjudicated += (ruled.autoAdjudicated || []).length; res = ruled; }
    }
    catch (e) { tot.throws.push({ where: 'advanceCampaignWorld', world: worldSeed, tick: t, error: String(e).slice(0, 300) }); break; }
    if (!res) break;
    tot.ranTicks += 1;
    for (const c of res.candidates || []) if ((c.candidateType || c.type) === `stressor_birth_${COUP}`) { tot.coupCandidates += 1; townLog[`${worldSeed}/${c.targetSaveId}`].candidates += 1; }
    // a birth is the stressor_birth_coup_detat outcome that LANDED (applied; under full auto-resolve, the accepted
    // proposal). The stressor's id is `world_stressor.coup_detat.<town>` and a resolved coup lingers as 'residual', so
    // a second coup in one town reuses the id: an id diff misses it (measured: r11t13, born ticks 1 and 5).
    const birthIds = new Set();
    for (const o of res.autoApplied || []) {
      if (o?.candidateType !== `stressor_birth_${COUP}` || birthIds.has(o.id)) continue;
      birthIds.add(o.id); tot.coupBorn += 1;
      const sid = String(o.targetSaveId);
      townLog[`${worldSeed}/${sid}`].born += 1; events.push(['born', worldSeed, t, sid, o.id]);
    }
    for (const x of res.worldState?.stressors || []) if (x?.type === COUP && !coupIdsBefore.has(x.id)) tot.coupIdsNew += 1;
    for (const x of res.resolvedStressors || []) if (x?.type === COUP) { tot.resolved += 1; if (x.resolutionReason) tot.directed += 1; }
    const verdictOutcomes = new Map();
    for (const o of [...(res.autoApplied || []), ...(res.proposals || [])]) {
      const ct = o?.candidateType;
      if (ct === 'coup_succeeded' || ct === 'coup_suppressed') verdictOutcomes.set(o.id, o);
    }
    for (const o of res.proposals || []) if (o?.candidateType === 'coup_succeeded' || o?.candidateType === 'coup_suppressed') tot.verdictOutcomesQueuedAsProposal += 1;
    for (const o of res.proposals || []) bump(proposalTypes, o?.candidateType || o?.type || '?');
    for (const o of verdictOutcomes.values()) {
      const sid = String(o.targetSaveId); const key = `${worldSeed}/${sid}`; const tl = townLog[key];
      const v = o.metadata?.verdict || {};
      tot.verdicts += 1;
      const h = preHolder.get(sid);
      bump(tot.holderRuleAtVerdict, h ? h.rule : 'threw');
      const holderName = h?.holder ? nameOf(h.holder) : null;
      if (holderName && (v.challengers || []).some((c) => c.name === holderName)) tot.holderInChallengersAtVerdict += 1;
      if (o.candidateType === 'coup_suppressed') {
        tot.held += 1; tl.held += 1;
        if (!(v.challengers || []).length) { tot.collapsedNoChallengers += 1; tl.collapsed += 1; }
        events.push(['held', worldSeed, t, sid, (v.challengers || []).length, v.pHold, v.roll]);
        continue;
      }
      tot.fell += 1; tl.fell += 1;
      if (v.incumbent && v.incumbent.gated === false) tot.ungatedFalls += 1;
      const row = (pre.get(sid)?.powerStructure?.factions || []).find((f) => nameOf(f) === v.winner);
      const ck = row ? D.contestKindOf(row) : 'unfound'; const fa = row ? factionArchetype(row) : 'unfound';
      bump(tot.winnerContestKind, ck); bump(tot.winnerFactionArchetype, fa);
      if (!h) tot.winnerHolderUnknown += 1; else if (holderName && holderName === v.winner) tot.winnerWasHolder += 1;
      tl.winners.push({ tick: t, winner: v.winner, contestKind: ck, factionArchetype: fa, holder: holderName, holderRule: h?.rule ?? null,
        incumbent: v.incumbent?.name ?? null, gated: v.incumbent?.gated ?? null, challengers: (v.challengers || []).map((c) => c.name) });
      events.push(['fell', worldSeed, t, sid, v.winner, v.pHold, v.roll]);
    }
    campaign = { ...campaign, worldState: res.worldState, regionalGraph: res.regionalGraph, wizardNews: res.wizardNews };
    saves = saves.map((s) => { const u = res.settlementUpdates?.find((x) => String(x.saveId) === String(s.id)); return u ? { ...s, settlement: u.settlement } : s; });
    for (const s of saves) {
      const before = nameOf(governingFactionOf(pre.get(String(s.id)))); const after = nameOf(governingFactionOf(s.settlement));
      if (before && after && before !== after) { tot.govChanges += 1; events.push(['gov', worldSeed, t, String(s.id), before, after]); }
    }
  }
  events.push(['endWorld', worldSeed, sha(saves.map((s) => s.settlement.powerStructure))]);
}

const gateTowns = Object.entries(townLog).filter(([, v]) => v.gateOpenTicks > 0).map(([k]) => k).sort();
const candTowns = Object.entries(townLog).filter(([, v]) => v.candidates > 0).map(([k]) => k).sort();
const bornTowns = Object.entries(townLog).filter(([, v]) => v.born > 0).map(([k]) => k).sort();
const out = {
  meta: { instrument: 'docs/chair/2026-11-20/content/seat/sim/sim-cs3.mjs', tree: TREE, arm: ARM, patched, regions: REGIONS, towns: TOWNS, seeds: SEEDS, ticks: TICKS, legit: LEGIT,
    rules: RULES, draftSha256: createHash('sha256').update(readFileSync(DRAFT_PATH)).digest('hex'), coupLeafSha256: createHash('sha256').update(coupSrc).digest('hex'),
    birthErrors, bornTowns: Object.values(born).flat().length, birthFingerprint, birthLegitDecades: birthLegit, seconds: Math.round((Date.now() - t0) / 1000),
    cs3: ARM === 'B' ? { calls: cs3.calls, excluded: cs3.excluded, throws: cs3.throws, lastThrow: cs3.lastThrow } : null },
  totals: { ...tot, winnerContestKind: sorted(tot.winnerContestKind), winnerFactionArchetype: sorted(tot.winnerFactionArchetype), holderRuleAtVerdict: sorted(tot.holderRuleAtVerdict) },
  proposalTypes: sorted(proposalTypes),
  townsWithGateOpen: gateTowns, townsWithCoupCandidate: candTowns, townsWithCoupBorn: bornTowns,
  eventsFingerprint: sha(events), events, townLog,
};
writeFileSync(OUT, `${JSON.stringify(out, null, 1)}\n`);
process.stderr.write(`arm ${ARM}: ${out.meta.bornTowns} towns, ${tot.ranTicks} ticks, born ${tot.coupBorn}, verdicts ${tot.verdicts} (fell ${tot.fell}, held ${tot.held}, collapsed ${tot.collapsedNoChallengers}), throws ${tot.throws.length}, fp ${out.eventsFingerprint}, ${out.meta.seconds}s\n`);
