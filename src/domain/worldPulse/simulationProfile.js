/**
 * domain/worldPulse/simulationProfile.js — the Phase 5.5 CL-0 control-layer
 * toolkit AROUND the simulation profile: validation with coercions-as-data,
 * the per-domain tri-state read model, and the ruleset-change receipt builder.
 *
 * DELIBERATELY A SEPARATE LEAF from simulationRules.js: that module rides the
 * first-paint entry closure (the store slice imports it statically), and the
 * closure budget has byte-level headroom. Everything here is reachable only
 * from lazy surfaces — the SimulationRulesDialog chunk and the store's
 * dynamic `loadProfileTools()` import inside updateCampaignSimulationRules —
 * so none of it costs first-paint bytes. simulationRules.js keeps only what
 * the eager normalize path needs (the profile clamps + the two accessors);
 * this module is the rest of item 1/2/6 of the CL-0 brief.
 *
 * PURITY: everything here is a pure function of its inputs. Determinism,
 * idempotence, and totality-on-garbage are pinned by
 * tests/domain/simulationProfileValidate.test.js.
 */
import {
  DEFAULT_SIMULATION_RULES,
  PROFILE_KEYS,
  POLITICAL_AUTONOMY_MODES,
  SIMULATION_PROFILE_VERSION,
  SIMULATION_RULE_PRESETS,
  isFaithSpreadEnabled,
  normalizeSimulationRules,
  politicalAutonomyOf,
  worldProgressionOf,
} from './simulationRules.js';
import { appendWizardNewsEntries } from '../region/wizardNews.js';

// ── The §11 axis catalogs (full ladders, including the not-yet-built rungs) ──
// The dialog renders every rung; `available` is what today's engine honors.
// Everything else is ACCEPTED by the normalizer but fails closed to the safe
// default — the coercion laws below turn that into explainable data.
export const WORLD_PROGRESSION_MODES = Object.freeze(['frozen', 'dm_advanced', 'living', 'autonomous']);
export const SPATIAL_MODES = Object.freeze(['ignore', 'abstract', 'mapped', 'full']);
export const TRAVEL_MODES = Object.freeze(['instant', 'compressed', 'standard', 'slow']);
export const INFO_MODES = Object.freeze(['omniscient', 'delayed', 'unreliable', 'full']);

/**
 * @typedef {object} ProfileCoercion
 * @property {string} key      The profile key the law acted on.
 * @property {unknown} from    The value the input carried.
 * @property {unknown} to      The value the law resolved it to.
 * @property {'stored'|'presentation'} kind  'stored' laws rewrite the canonical
 *   value (fail-closed clamps); 'presentation' laws leave the stored value
 *   intact and only shape what the engine/dialog treats as effective right now
 *   (§11: "settings preserved, reactivate on resume").
 * @property {string} law      Stable law id (the dependency-gating matrix row).
 * @property {string} message  Fiction-level explanation for the DM.
 */

// ── The dependency-gating matrix AS DATA (brief item 2) ─────────────────────
// Each law is a pure predicate + resolution over (raw input, canonical rules).
// validateSimulationProfile evaluates them in order and reports every hit; the
// dialog's disabled states and the ruleset receipts consume the same records.
/** @type {ReadonlyArray<{ law: string, kind: 'stored'|'presentation', apply: (input: Record<string, unknown>, canonical: Record<string, unknown>) => ProfileCoercion | null }>} */
export const PROFILE_COERCION_LAWS = Object.freeze([
  {
    // Forward progression modes are accepted but the engine cannot yet carry
    // time on its own — fail closed to DM-advanced until Living/Autonomous ship.
    law: 'progression_not_yet_built',
    kind: 'stored',
    apply: (input, canonical) => (
      'worldProgression' in input && input.worldProgression !== canonical.worldProgression
        ? {
          key: 'worldProgression', from: input.worldProgression, to: canonical.worldProgression,
          kind: 'stored', law: 'progression_not_yet_built',
          message: 'The world cannot yet carry time on its own — it moves when you advance it.',
        }
        : null
    ),
  },
  {
    // Garbage autonomy values derive from the legacy proposal flag.
    law: 'autonomy_derived_from_legacy_flag',
    kind: 'stored',
    apply: (input, canonical) => (
      'politicalAutonomy' in input && !POLITICAL_AUTONOMY_MODES.includes(/** @type {string} */ (input.politicalAutonomy))
        ? {
          key: 'politicalAutonomy', from: input.politicalAutonomy, to: canonical.politicalAutonomy,
          kind: 'stored', law: 'autonomy_derived_from_legacy_flag',
          message: 'That autonomy setting is not recognised; the realm keeps its current approval custom.',
        }
        : null
    ),
  },
  {
    // Geography is not part of the engine yet: every spatial assumption
    // collapses to "distance does not matter".
    law: 'geography_not_yet_built',
    kind: 'stored',
    apply: (input, canonical) => (
      'spatialMode' in input && input.spatialMode !== canonical.spatialMode
        ? {
          key: 'spatialMode', from: input.spatialMode, to: canonical.spatialMode,
          kind: 'stored', law: 'geography_not_yet_built',
          message: 'The realm does not yet reckon distance — every settlement is a neighbour.',
        }
        : null
    ),
  },
  {
    // §11 dependency row: ignore-geography limits travel to instant. Today
    // spatialMode is always 'ignore', so this is ALSO the axis-locked clamp.
    law: 'instant_travel_without_geography',
    kind: 'stored',
    apply: (input, canonical) => (
      'travelMode' in input && input.travelMode !== canonical.travelMode
        ? {
          key: 'travelMode', from: input.travelMode, to: canonical.travelMode,
          kind: 'stored', law: 'instant_travel_without_geography',
          message: 'While distance does not matter, word and armies arrive as they depart.',
        }
        : null
    ),
  },
  {
    law: 'information_not_yet_built',
    kind: 'stored',
    apply: (input, canonical) => (
      'infoMode' in input && input.infoMode !== canonical.infoMode
        ? {
          key: 'infoMode', from: input.infoMode, to: canonical.infoMode,
          kind: 'stored', law: 'information_not_yet_built',
          message: 'News does not yet travel or distort — everyone knows the true state of the world.',
        }
        : null
    ),
  },
  {
    // §11 dependency row: FROZEN ⇒ autonomy presents as dm_only. The stored
    // setting is PRESERVED (kind:'presentation') and reactivates on resume.
    law: 'frozen_world_pauses_autonomy',
    kind: 'presentation',
    apply: (input, canonical) => (
      worldProgressionOf(canonical) === 'frozen' && politicalAutonomyOf(canonical) !== 'dm_only'
        ? {
          key: 'politicalAutonomy', from: politicalAutonomyOf(canonical), to: 'dm_only',
          kind: 'presentation', law: 'frozen_world_pauses_autonomy',
          message: 'While time is frozen no one acts. Your autonomy choice is kept and wakes with the world.',
        }
        : null
    ),
  },
]);

/**
 * validateSimulationProfile — pure, versioned, deterministic, total on garbage
 * (brief item 2). Canonicalizes a raw rules object and reports every coercion
 * the §11 dependency-gating matrix applied as DATA (consumed by the ruleset
 * receipts and the dialog's honest disabled-state copy).
 *
 * `canonical` IS `normalizeSimulationRules(raw)` — the normalizer is the single
 * canonicalization step, so every engine consumer that already re-normalizes at
 * entry (worldState reads/writes, pulseKernel) reads the canonical result
 * without any new call site.
 *
 * Idempotent on its own output: validate(validate(x).canonical).canonical is
 * deep-equal to validate(x).canonical, and no 'stored' coercion fires twice
 * ('presentation' laws re-report by design — they describe standing state).
 *
 * @param {unknown} raw
 * @returns {{ profileVersion: number, canonical: Record<string, unknown>, coercions: ProfileCoercion[] }}
 */
export function validateSimulationProfile(raw) {
  // EXACTLY the normalizer's input coercion (including its array treatment),
  // so canonical is always deep-equal to normalizeSimulationRules(raw).
  const input = /** @type {Record<string, unknown>} */ (raw && typeof raw === 'object' ? raw : {});
  const canonical = normalizeSimulationRules(input);
  /** @type {ProfileCoercion[]} */
  const coercions = [];
  // Stored laws only bite when the profile materializes (a profile key was
  // touched); presentation laws describe the standing canonical state.
  const touched = PROFILE_KEYS.some(key => key in input);
  for (const entry of PROFILE_COERCION_LAWS) {
    if (entry.kind === 'stored' && !touched) continue;
    const hit = entry.apply(input, canonical);
    if (hit) coercions.push(hit);
  }
  return { profileVersion: SIMULATION_PROFILE_VERSION, canonical, coercions };
}

// ── Per-domain tri-state read model (brief item 1) ──────────────────────────
// The booleans REMAIN the storage; this is the derived §11 view over them plus
// the authority policy. 'off' = the engine neither initiates nor propagates;
// 'dm' = the engine only proposes (the DM approves every introduction);
// 'auto' = the engine may initiate and propagate.
/**
 * @type {Readonly<Record<string, { flag: string, dmDriven: 'live'|'deferred' }>>}
 *   dmDriven 'deferred': the war domain cannot present a DM-driven middle state
 *   until the initiate/resolve split (PART VII.1) — evaluateWarLayer both opens
 *   and resolves sieges inline, outside the proposal machinery.
 */
export const SIMULATION_DOMAINS = Object.freeze({
  diplomacy: Object.freeze({ flag: 'relationshipDynamicsEnabled', dmDriven: 'live' }),
  trade: Object.freeze({ flag: 'tradeFlowsEnabled', dmDriven: 'live' }),
  migration: Object.freeze({ flag: 'migrationFlowsEnabled', dmDriven: 'live' }),
  religion: Object.freeze({ flag: 'faithSpreadEnabled', dmDriven: 'live' }),
  war: Object.freeze({ flag: 'warLayerEnabled', dmDriven: 'deferred' }),
  strategy: Object.freeze({ flag: 'settlementStrategyEnabled', dmDriven: 'live' }),
});

/**
 * domainState — the derived tri-state for one domain (brief item 1). Pure and
 * tolerant: reads raw or normalized rules, absent keys resolve to each flag's
 * default (so a legacy virtual profile reads correctly).
 *
 * In CL-0 the 'dm' state is GLOBAL — it reflects the dm_only/recommendations
 * autonomy modes (which force every candidate to a proposal), because
 * per-domain authority overrides are a future seam (authorityFor already
 * accepts the domain for exactly that reason). War never reports 'dm'
 * (initiate/resolve are still fused — the row ships Off/Autonomous).
 *
 * @param {Record<string, unknown> | null | undefined} rules
 * @param {string} domain  A SIMULATION_DOMAINS key.
 * @returns {'off'|'dm'|'auto'}
 */
export function domainState(rules, domain) {
  const spec = /** @type {Record<string, {flag: string, dmDriven: string}>} */ (SIMULATION_DOMAINS)[domain];
  if (!spec) return 'off';
  const r = rules && typeof rules === 'object' ? rules : {};
  const enabled = spec.flag === 'faithSpreadEnabled'
    ? isFaithSpreadEnabled(r)
    : (typeof r[spec.flag] === 'boolean'
      ? r[spec.flag]
      : /** @type {Record<string, unknown>} */ (DEFAULT_SIMULATION_RULES)[spec.flag]);
  if (!enabled) return 'off';
  if (spec.dmDriven === 'deferred') return 'auto';
  const autonomy = politicalAutonomyOf(r);
  return autonomy === 'dm_only' || autonomy === 'recommendations' ? 'dm' : 'auto';
}

// ── Ruleset-change receipts (brief item 6) ──────────────────────────────────

// FICTION-NOT-INTERNALS phrasing for the receipt headline: each entry maps a
// changed key to what the WORLD now assumes, never to a mechanism. Keys absent
// here fall back to a humanized key name.
/** @type {Record<string, (value: unknown) => string>} */
const CHANGE_PHRASES = {
  presetId: value => {
    const preset = /** @type {Record<string, { label: string } | undefined>} */ (
      /** @type {unknown} */ (SIMULATION_RULE_PRESETS)
    )[/** @type {string} */ (value)];
    return preset ? `the realm now runs as ${preset.label}` : 'the realm now follows a custom law';
  },
  politicalAutonomy: value => ({
    dm_only: 'every action now awaits your word',
    recommendations: 'the realm now proposes and you decide',
    routine: 'routine life now runs itself; major turns still ask you',
    full: 'the realm now acts on its own',
  })[/** @type {string} */ (value)] || 'the realm follows a new approval custom',
  worldProgression: value => (value === 'frozen'
    ? 'time is now frozen'
    : 'time now passes as you advance it'),
  majorChangesRequireProposal: value => (value
    ? 'major turns now ask you first'
    : 'major turns now land on their own'),
  warLayerEnabled: value => (value
    ? 'war can now begin on its own'
    : 'wars now begin only by your hand'),
  settlementStrategyEnabled: value => (value
    ? 'settlements now pursue their own ambitions'
    : 'settlements now wait for your direction'),
  faithSpreadEnabled: value => (value
    ? 'faith now crosses borders'
    : 'faith now stays within its walls'),
  relationshipDynamicsEnabled: value => (value
    ? 'ties between settlements now shift on their own'
    : 'ties between settlements now hold as written'),
  tradeFlowsEnabled: value => (value
    ? 'trade now adjusts autonomously'
    : 'trade now holds until you act'),
  migrationFlowsEnabled: value => (value
    ? 'people now move on their own'
    : 'migrations now wait for your word'),
};

// The headline leads with the most world-defining change present.
const PHRASE_PRIORITY = Object.freeze([
  'presetId', 'worldProgression', 'politicalAutonomy', 'warLayerEnabled',
  'faithSpreadEnabled', 'settlementStrategyEnabled', 'relationshipDynamicsEnabled',
  'tradeFlowsEnabled', 'migrationFlowsEnabled', 'majorChangesRequireProposal',
]);

/** @param {string} key */
function humanKey(key) {
  return key
    .replace(/Enabled$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase();
}

/**
 * @param {string} key
 * @param {Record<string, unknown>} after
 * @returns {string}
 */
function phraseFor(key, after) {
  const phrase = CHANGE_PHRASES[key];
  if (phrase) return phrase(after[key]);
  if (typeof after[key] === 'boolean') {
    return `${humanKey(key)} ${after[key] ? 'now runs on its own' : 'now holds still'}`;
  }
  return `${humanKey(key)} is now ${String(after[key]).replace(/_/g, ' ')}`;
}

/**
 * describeRulesChange — the plain-language diff headline for a ruleset change
 * (brief item 6, e.g. "World law changed: trade now adjusts autonomously").
 * @param {string[]} changedKeys
 * @param {Record<string, unknown>} before
 * @param {Record<string, unknown>} after
 * @returns {string}
 */
export function describeRulesChange(changedKeys, before, after) {
  // A presetId flip leads the headline only when the DM chose a NAMED preset;
  // drifting to 'custom' is a side effect of whatever law actually changed, so
  // it trails instead of burying the real story.
  const presetDrifted = changedKeys.includes('presetId') && after.presetId === 'custom';
  const ordered = [
    ...PHRASE_PRIORITY.filter(key => changedKeys.includes(key) && !(key === 'presetId' && presetDrifted)),
    ...changedKeys.filter(key => !PHRASE_PRIORITY.includes(key)).sort(),
    ...(presetDrifted ? ['presetId'] : []),
  ];
  if (!ordered.length) return 'World law changed';
  const lead = phraseFor(ordered[0], after);
  const more = ordered.length - 1;
  return `World law changed: ${lead}${more > 0 ? ` (+${more} more)` : ''}`;
}

// Keys whose flips are pure MIRRORS of another changed key — noise in a
// receipt, not signal. religionDynamicsEnabled shadows faithSpreadEnabled
// through the deprecation window; profileVersion materializes alongside any
// first profile touch.
const MIRROR_KEYS = Object.freeze({
  religionDynamicsEnabled: 'faithSpreadEnabled',
});

/**
 * prepareRulesUpdate — everything updateCampaignSimulationRules needs, computed
 * pure (brief item 6): the canonical merged rules, the effective changed-key
 * diff, the NEXT worldState (with the ruleset-change receipt folded into the
 * conditionally-materialized rulesetLog — OBJECT keyed rc_<tick>_<seq>, because
 * deepCloneConditionalLedger rejects arrays), and the NEXT wizard-news feed
 * (with the kind:'ruleset_change' realm entry appended). NO effective change ⇒
 * nextWorldState carries no receipt and nextWizardNews is null — an untouched
 * save stays byte-invisible. Lives here (the LAZY leaf) so the store slice's
 * entry-closure footprint is just this one call.
 *
 * @param {Record<string, unknown>} worldState  The ensured (normalized) world state.
 * @param {unknown} patch  The rules patch the caller is applying.
 * @param {import('../region/wizardNews.js').WizardNewsFeed | null | undefined} wizardNews  The campaign's current wizard-news feed (read-only).
 * @param {string} now  ISO timestamp for the news append.
 * @returns {{
 *   canonical: Record<string, unknown>,
 *   changedKeys: string[],
 *   coercions: ProfileCoercion[],
 *   nextWorldState: Record<string, unknown>,
 *   nextWizardNews: Record<string, unknown> | null,
 * }}
 */
export function prepareRulesUpdate(worldState, patch, wizardNews, now) {
  const current = normalizeSimulationRules(/** @type {Record<string, unknown>} */ (worldState?.simulationRules || {}));
  const merged = {
    ...(/** @type {Record<string, unknown>} */ (worldState?.simulationRules || {})),
    ...(/** @type {Record<string, unknown>} */ (patch && typeof patch === 'object' ? patch : {})),
  };
  const { canonical, coercions } = validateSimulationProfile(merged);
  const keys = [...new Set([...Object.keys(current), ...Object.keys(canonical)])].sort();
  const changedKeys = keys.filter(key => current[key] !== canonical[key])
    // Drop pure mirror flips (the mirrored key itself changed too).
    .filter((key, _, all) => {
      const mirrored = /** @type {Record<string, string>} */ (MIRROR_KEYS)[key];
      return !(mirrored && all.includes(mirrored));
    });
  if (!changedKeys.length) {
    return {
      canonical,
      changedKeys: [],
      coercions,
      nextWorldState: { ...worldState, simulationRules: canonical },
      nextWizardNews: null,
    };
  }
  const rawTick = Number(worldState?.tick);
  const tick = Math.max(0, Math.floor(Number.isFinite(rawTick) ? rawTick : 0));
  const log = /** @type {Record<string, unknown>} */ (
    worldState?.rulesetLog && typeof worldState.rulesetLog === 'object' && !Array.isArray(worldState.rulesetLog)
      ? worldState.rulesetLog
      : {}
  );
  let seq = 0;
  while (`rc_${tick}_${seq}` in log) seq += 1;
  const receiptId = `rc_${tick}_${seq}`;
  /** @type {Record<string, unknown>} */
  const from = {};
  /** @type {Record<string, unknown>} */
  const to = {};
  for (const key of changedKeys) {
    from[key] = current[key] === undefined ? null : current[key];
    to[key] = canonical[key] === undefined ? null : canonical[key];
  }
  const headline = describeRulesChange(changedKeys, current, canonical);
  return {
    canonical,
    changedKeys,
    coercions,
    nextWorldState: {
      ...worldState,
      simulationRules: canonical,
      rulesetLog: {
        ...log,
        [receiptId]: { tick, changedKeys, from, to, preset: canonical.presetId, coercions },
      },
    },
    nextWizardNews: appendWizardNewsEntries(wizardNews, [{
      id: `wizard_news.ruleset.${receiptId}`,
      tick,
      scope: 'realm',
      kind: 'ruleset_change',
      significance: 'notable',
      severity: 0.5,
      headline,
      summary: changedKeys.length === 1
        ? 'One law of the realm changed.'
        : `${changedKeys.length} laws of the realm changed.`,
      settlementIds: [],
      reasons: changedKeys.map(key => phraseFor(key, canonical)),
    }], { now }),
  };
}
