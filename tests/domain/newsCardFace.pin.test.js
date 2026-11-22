/**
 * tests/domain/newsCardFace.pin.test.js — THE NEWS CARD'S FACE STATES AN EVENT AND NAMES ITS PEOPLE
 * (STYLE-RULINGS-2 C1, lane SW-11 PULSE-CARD, 2026-11-09).
 *
 * The ruling: the card body is a DEFECT CLASS, not a wording row. At the base every one of the
 * 4,496 bodies of the measured run (simulate-world, WAR_ECON_ALL, 2 × 52 weeks, 14 towns) was a
 * lifecycle line with no event in it ("It is being felt {scope} now."), while the event, the source
 * and the road sat in the hover tooltip; the pill beside it printed the pipeline's own state word
 * ("applied / queued / expired").
 *
 * THE PIN, on a planted run (named towns, named graph nodes, the war, faith and relationship layers
 * on, the regional graph propagating): for every entry the run files, the face NewsEntry prints
 *   1. has a body, and the body is not a lifecycle-only line (an EVENT, not "it");
 *   2. the body names a party the world holds (a town, a person, a power or a god, by name),
 *      read with the panel's own save-name map (the body's dateline is part of the face);
 *   3. no face word is a state-machine token (queued · ready · applied · resolved · ignored ·
 *      expired): the status pill never prints one, and no pill is one (the English verb inside
 *      a sentence — "the quarrel resolved" — is prose, not the pipeline's word).
 *
 * The face is read through `newsCardFace` (domain/display/newsBody.js), the one function the panel
 * renders. Before that function existed the panel printed `newsBodyText`, `humanizeToken(kind)` and
 * `newsReasonPhrases` — the fallback below is that base face, so the red at the base is a red on
 * the assertions, not on an import.
 */
import { describe, expect, it } from 'vitest';

import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import * as newsBody from '../../src/domain/display/newsBody.js';
import { humanizeToken } from '../../src/domain/display/humanizeEngineTokens.js';

const STATE_TOKENS = /\b(queued|ready|applied|resolved|ignored|expired)\b/i;
/** A pill that IS a state token (the English verb inside a sentence is not one). */
const STATE_WORD = /^(queued|ready|applied|resolved|ignored|expired)$/i;
const LIFECYCLE_ONLY = /^(it|its|word of it|rumou?r of it|the first whispers of it|the mark of it|the effects of it|the weight of it|talk of it|for the present|in the end|nothing came of it)\b/i;

/** @param {any} entry @param {Map<string, string>} nameById the panel's save-name map */
function faceOf(entry, nameById) {
  if (typeof newsBody.newsCardFace === 'function') return newsBody.newsCardFace(entry, { nameById });
  return {
    body: newsBody.newsBodyText(entry),
    status: humanizeToken(entry.kind),
    reasons: newsBody.newsReasonPhrases(entry).slice(0, 3),
  };
}

const DEITIES = [
  { _deityRef: 'custom:pin_vael', name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major' },
  { _deityRef: 'custom:pin_korl', name: 'Korl', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' },
  { _deityRef: 'custom:pin_aurum', name: 'Aurum', alignmentAxis: 'neutral', temperamentAxis: 'peaceful', rankAxis: 'major' },
];

const RULES = {
  propagationMode: 'full', intensity: 'dramatic', migrationMode: 'roll',
  stressorsEnabled: true, emergentEventsEnabled: true, relationshipDynamicsEnabled: true,
  npcAgencyEnabled: true, factionCompetitionEnabled: true, populationDynamicsEnabled: true,
  migrationFlowsEnabled: true, tradeFlowsEnabled: true, resourceDriftEnabled: true,
  tierDriftEnabled: true, institutionLifecycleEnabled: true,
  warLayerEnabled: true, settlementStrategyEnabled: true, religionDynamicsEnabled: true,
  warEconomyDrainEnabled: true, defenderResolveEnabled: true, warDispositionEnabled: true,
  allyDefenseEnabled: true, warForageEnabled: true, warLevyEnabled: true,
  majorChangesRequireProposal: false,
};

/** A planted eight-town realm: two hostile pairs, a cold war, an alliance beside each, named nodes. */
function plantWorld(seedBase) {
  const tiers = ['city', 'city', 'city', 'city', 'town', 'town', 'village', 'town'];
  const ids = tiers.map((_, i) => `pin${i}`);
  const saves = ids.map((id, i) => {
    const s = generateSettlementPipeline({ settType: tiers[i], culture: 'germanic' }, null, { seed: `${seedBase}-${i}`, customContent: {} });
    s.config = { ...s.config, primaryDeityRef: DEITIES[i % 3]._deityRef, primaryDeitySnapshot: DEITIES[i % 3] };
    if (i < 4) s.config.priorityMilitary = 70;
    if (i % 3 === 1) s.powerStructure = { ...s.powerStructure, publicLegitimacy: { score: 22, label: 'Crisis' } };
    return { id, name: s.name, phase: 'canon', settlement: s, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
  });
  const pairs = [[0, 4, 'hostile'], [1, 5, 'hostile'], [2, 6, 'cold_war']];
  const edges = [];
  const E = (a, b, rt) => edges.push({ id: `edge.${ids[a]}.${ids[b]}`, from: ids[a], to: ids[b], relationshipType: rt });
  for (const [a, b, rt] of pairs) E(a, b, rt);
  E(0, 1, 'allied'); E(2, 3, 'allied'); E(3, 7, 'trade_partner'); E(6, 7, 'allied');
  const relationshipStates = {};
  for (const [a, b, rt] of pairs) {
    relationshipStates[`edge.${ids[a]}.${ids[b]}`] = { relationshipType: rt };
    const att = saves[a]; const tgt = saves[b];
    const base = { relationshipType: rt, relationshipFrom: att.id, relationshipTo: tgt.id, bidirectional: true };
    att.settlement.neighbourNetwork = [...(att.settlement.neighbourNetwork || []), { ...base, id: tgt.id, linkId: `link.${att.id}.${tgt.id}`, neighbourName: tgt.name, name: tgt.name }];
    tgt.settlement.neighbourNetwork = [...(tgt.settlement.neighbourNetwork || []), { ...base, id: att.id, linkId: `link.${tgt.id}.${att.id}`, neighbourName: att.name, name: att.name }];
  }
  const channels = [];
  const C = (a, b, type) => channels.push({ type, from: ids[a], to: ids[b], status: 'confirmed' });
  for (let i = 1; i < ids.length; i++) C(i - 1, i, 'trade_dependency');
  C(0, 4, 'military_protection'); C(0, 7, 'political_authority'); C(1, 6, 'religious_authority'); C(2, 5, 'information_flow');
  const nodes = saves.map(s => ({ id: s.id, name: s.name }));
  const stressors = [
    { id: `world_stressor.famine.${ids[6]}`, type: 'famine', severity: 0.78, affectedSettlementIds: [ids[6]] },
    { id: `world_stressor.disease_outbreak.${ids[5]}`, type: 'disease_outbreak', severity: 0.7, affectedSettlementIds: [ids[5]] },
  ];
  return {
    saves,
    campaign: {
      id: seedBase, name: 'pin-world', settlementIds: ids,
      worldState: { rngSeed: seedBase, tick: 0, volatility: 'turbulent', stressors, relationshipStates, simulationRules: RULES },
      regionalGraph: ensureRegionalGraph({ nodes, edges, channels }),
      wizardNews: { currentTick: 0, entries: [] },
    },
  };
}

/** Every name the planted world has held, into `names`: towns, their people, their powers, the gods. */
function collectNames(saves, names) {
  for (const d of DEITIES) names.add(d.name);
  for (const s of saves) {
    if (s.name) names.add(String(s.name));
    for (const npc of s.settlement?.npcs || []) if (npc?.name) names.add(String(npc.name));
    for (const f of s.settlement?.powerStructure?.factions || []) if (f?.faction) names.add(String(f.faction));
  }
}

describe('the news card face — an event, its people, no state-machine word (C1)', () => {
  it('on a planted run, every card body names a party and states an event; no face word is a state token', () => {
    let { saves, campaign } = plantWorld('newscard-pin');
    const seen = new Map();
    const held = new Set();
    collectNames(saves, held);
    for (let t = 0; t < 16; t++) {
      const r = advanceCampaignWorld({ campaign, saves, interval: 'one_week', now: `2026-03-01T00:00:${String(t).padStart(2, '0')}.000Z` });
      campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
      saves = saves.map(s => { const u = r.settlementUpdates?.find(x => String(x.saveId) === String(s.id)); return u ? { ...s, settlement: u.settlement } : s; });
      for (const e of r.wizardNews?.entries || []) seen.set(String(e.id), e);
      collectNames(saves, held);
    }
    const names = [...held].filter(n => n.length >= 3);
    const nameById = new Map(saves.map(s => [String(s.id), String(s.name)]));
    const entries = [...seen.values()];
    // Anti-vacuity: the planted run must file a real feed, regional impacts and pulse events both.
    expect(entries.length).toBeGreaterThan(40);
    expect(entries.some(e => (e.impactIds || []).length > 0)).toBe(true);
    expect(entries.some(e => !(e.impactIds || []).length)).toBe(true);

    const faults = [];
    for (const e of entries) {
      const face = faceOf(e, nameById);
      const body = String(face.body || '');
      const why = [];
      if (!body.trim()) why.push('no body');
      if (LIFECYCLE_ONLY.test(body.trim())) why.push('lifecycle-only body');
      if (!names.some(n => body.includes(n))) why.push('no named party');
      if (face.status && STATE_TOKENS.test(face.status)) why.push(`state pill "${face.status}"`);
      for (const r of face.reasons || []) if (STATE_WORD.test(String(r).trim())) why.push(`state-token pill "${r}"`);
      if (why.length) faults.push(`${e.id} :: ${why.join(', ')} :: "${body}"`);
    }
    expect(faults.slice(0, 12), `${faults.length} of ${entries.length} card faces fail`).toEqual([]);
  }, 180_000);
});
