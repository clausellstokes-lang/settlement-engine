/**
 * researchCapture.js — capture structural snapshots at lifecycle moments.
 *
 * Bridges the privacy-safe extractor (structuralFingerprint.js) to the sink
 * (analyticsQueue.enqueueSnapshot) and fires the research-class
 * SETTLEMENT_FINGERPRINT_CAPTURED event. Consent is enforced twice over:
 *   - the snapshot's `structural` payload is only built under research consent
 *     (product-tier rows carry the minimal hot-column form);
 *   - the fingerprint event is research-class, so track() drops it without
 *     research consent;
 *   - extractors early-return on a null settlement.
 *
 * A snapshot needs a stable settlement uuid (a saved settlement / map). Anonymous
 * "generated" distributions ride on the essential GENERATION_COMPLETED event's
 * reduced-fingerprint props instead (see settlementSlice generate wiring), so no
 * uuid-less rows are sent here.
 */

import { getConsent } from './consent.js';
import { track, EVENTS } from './analytics.js';
import { enqueueSnapshot } from './analyticsQueue.js';
import {
  extractReducedFingerprint,
  extractSettlementFingerprint,
  computeFingerprintHash,
  computeConfigSignature,
  usedRandomSentinels,
} from './structuralFingerprint.js';

const CAPTURE_POINTS = new Set(['generated', 'saved', 'canonized', 'exported', 'ai_polished', 'pulse_advanced']);

// Per-settlement previous fingerprint hash, so evolution chains reconstruct.
const _prevHash = new Map();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function hotColumns(reduced, save, full) {
  if (!reduced) return {};
  const cs = save?.campaignState || {};
  const ai = save?.aiData || save?.ai_data;
  const hot = {
    tier: reduced.tier,
    population_band: reduced.population_band,
    prosperity: reduced.prosperity,
    faction_count: reduced.faction_count,
    institution_count: reduced.institution_count,
    npc_count: reduced.npc_count,
    condition_count: reduced.condition_count,
    stressor_count: reduced.stressor_count,
    campaign_phase: typeof cs.phase === 'string' ? cs.phase : undefined,
    narrative_mode: ai && typeof ai === 'object' ? ai.narrativeMode : undefined,
  };
  // Research-tier hot columns: the 037 table declares dedicated columns for
  // these (defense scores, legitimacy, food, archetypes, lineage) but they were
  // never populated — the extractor only surfaces them in the FULL fingerprint.
  if (full && typeof full === 'object') {
    const d = full.defense?.scores || {};
    Object.assign(hot, {
      food_resilience: full.economy?.food_resilience,
      legitimacy: full.power?.legitimacy_score,
      defense_military: d.military,
      defense_monster: d.monster,
      defense_internal: d.internal,
      defense_economic: d.economic,
      defense_magical: d.magical,
      condition_archetypes: Array.isArray(full.conditions)
        ? full.conditions.map(c => c?.archetype).filter(Boolean)
        : undefined,
      schema_version: full.schemaVersion,
      generator_version: full.generatorVersion,
      seed: full.seed, // research-tier only (the full fingerprint already gates it)
    });
  }
  return hot;
}

/**
 * Capture a structural snapshot at a lifecycle moment. Fire-and-forget; never
 * throws. Skips silently without essential consent, or without a valid uuid.
 *
 * @param {string} moment  one of CAPTURE_POINTS
 * @param {Object} settlement
 * @param {Object} [opts]
 * @param {Object} [opts.save]            the save envelope (for lifecycle/ai fields)
 * @param {string} [opts.settlementUuid]  stable uuid (save id / settlement id)
 * @param {{ npcStates?: Object }} [opts.worldState]  campaign sim-state (NPC
 *        evolution), filtered to this settlement in the extractor; absent for
 *        pre-pulse moments.
 */
export function captureFingerprint(moment, settlement, opts = {}) {
  try {
    if (!CAPTURE_POINTS.has(moment) || !settlement) return;
    const consent = getConsent();
    if (!consent.essential) return; // full opt-out / DNT

    const save = opts.save || null;
    const settlementUuid = opts.settlementUuid
      || (UUID_RE.test(String(save?.id || '')) ? String(save.id) : null)
      || (UUID_RE.test(String(settlement?.id || '')) ? String(settlement.id) : null);
    if (!settlementUuid) return; // snapshots require a stable subject

    const reduced = extractReducedFingerprint(settlement);
    // opts.worldState carries the campaign's live npcStates (NPC sim-evolution),
    // filtered to this settlement inside the extractor; absent for pre-pulse moments.
    const full = consent.research
      ? extractSettlementFingerprint(settlement, save, { npcStates: opts.worldState?.npcStates, settlementUuid })
      : null;

    Promise.all([
      computeFingerprintHash(full || reduced),
      computeConfigSignature(settlement.config),
    ]).then(([fingerprintHash, configSignature]) => {
      enqueueSnapshot({
        settlementUuid,
        capturePoint: moment,
        hot: {
          ...hotColumns(reduced, save, full),
          // deterministic, seed-independent grouping key (a hash — non-personal).
          config_signature: configSignature,
          used_random_sentinels: usedRandomSentinels(settlement.config),
        },
        structural: full || undefined,   // research-tier only; clamped again server-side
        fingerprintHash,
      });
      // Research-class event (track() drops it without research consent). Carries
      // the chain link so evolution sequences reconstruct without prose.
      track(EVENTS.SETTLEMENT_FINGERPRINT_CAPTURED, {
        moment,
        fingerprint_hash: fingerprintHash,
        prev_fingerprint_hash: _prevHash.get(settlementUuid),
      }, { subjectId: settlementUuid });
      _prevHash.set(settlementUuid, fingerprintHash);
    }).catch((e) => {
      // Best-effort for the USER; observable for the DEVELOPER — a broken
      // fingerprint extractor would otherwise silently emit zero research data.
      if (import.meta?.env?.DEV) console.warn('[researchCapture] fingerprint capture failed', e?.message);
    });
  } catch { /* never throw */ }
}
