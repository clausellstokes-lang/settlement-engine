/**
 * composeInstantWorld.js — THE COMPOSER (W-R2 INSTANT WORLD, owner commission).
 *
 * A conductor over EXISTING generators. It changes no generator, no engine, no
 * wizard, and never touches the store or React: given a seed + the three basic
 * knobs it returns a plain, fully-staged world BUNDLE that a completed manual
 * realm-building session reaches at t=0, PRE-canonize:
 *
 *   seed → deriveWorldPlan (config from the knobs)
 *        → mint the tier-mixed settlements at the planned sites (the settlement
 *          pipeline — the same generator the manual wizard runs)
 *        → wrap each as a CANON save (canon is the manual prerequisite for map
 *          placement + world-snapshot membership; the settlements ARE canon, the
 *          REALM's SPATIAL canon is left unfrozen — "places everything, canonizes
 *          nothing")
 *        → place them on the map (mapState.placements at the planned sites)
 *        → compute the staged connections (deriveGraphWithDiscoveredCandidates —
 *          the same organic channel discovery the manual "discover channels" runs)
 *        → assemble the campaign (tone preset applied to worldState.simulationRules)
 *
 * COMPOSITION-EQUIVALENCE (the spec): the returned bundle is state-shape-identical
 * to a hand-built realm at the same stage — an active campaign (owner-clarified:
 * the instant world lands the user IN a campaign; a realm IS a campaign, so
 * campaign presence is inherent, not a divergence) holding N canon member saves,
 * a v2 mapState with placements + a map PLAN (seed + FMG template), a discovered
 * regionalGraph, and a worldState that is NOT spatially canonized
 * (spatialCanonVersion 0 / no spatialDigest). The FMG geography itself is
 * iframe-bound and seed-deterministic; the bundle carries the map PLAN and the
 * geometry materializes downstream from that seed when the realm map opens
 * (mapState.pendingMapGen — see useInstantWorldMaterialize).
 *
 * DETERMINISM: with a fixed idFactory + clock injected, byte-identical for a
 * fixed (seed, knobs). With the defaults (real uuids + wall clock) the only
 * variance is the opaque scaffolding (save/campaign ids, ISO timestamps) — the
 * content is byte-identical, exactly as the repo's other determinism pins scope
 * it. `instantWorldFingerprint` captures that content, excluding ids/timestamps.
 *
 * TIER-BLIND: nothing here reads auth/tier/entitlement. The premium gate wraps
 * the button that CALLS this; tier never reaches the composer (pin-asserted).
 * This is the clean programmatic API the soak harness + Surveyor S5 consume.
 *
 * LAZY: only ever reached behind the store binding's dynamic import, so its
 * static imports of the generator + region graph cost zero eager bytes.
 */
import { generateSettlementPipeline } from '../../generators/generateSettlementPipeline.js';
import { DEFAULT_CONFIG } from '../../store/configSlice.js';
import { deriveGraphWithDiscoveredCandidates } from '../../domain/region/discoverDependencyCandidates.js';
import { ensureRegionalGraph, ensureWizardNewsFeed } from '../../domain/region/index.js';
import { ensureWorldState } from '../../domain/worldPulse/worldState.js';
import { SIMULATION_RULE_PRESETS } from '../../domain/worldPulse/simulationRules.js';
import { validateDossier } from '../../domain/validation/consistency.js';
import { extractReducedFingerprint, stableStringify } from '../structuralFingerprint.js';
import { deriveWorldPlan, normalizeBasicConfig } from '../../domain/instantWorld/worldPlan.js';
import { dedupeWorldFactionNames } from './factionDedup.js';

const SCHEMA_VERSION = 2;
// Bounded, seed-derived coherence retries. A minted settlement that trips the
// dossier trust gate is re-forked with the retry index folded into its seed (so
// the result stays replayable), up to this many times before the draw is
// accepted as-is (the pipeline output is coherent by construction; this is a
// belt-and-braces net that has headroom, not a hot path).
const MAX_COHERENCE_RETRIES = 3;

// Pure default clock — a fixed epoch. This orchestration leaf is kept pure by
// design (no wall-clock, no Math.random), so the DEFAULT bundle is fully
// deterministic; that purity is enforced BEHAVIOURALLY by the same-seed
// byte-identity pin, not the domain lint (this lives in src/lib, over untyped
// generator output, to conduct generators without a domain→generators/store edge).
// The impure store binding overrides `clock` with real time (and `idFactory` with
// durable ids); the soak harness + tests may inject their own.
const EPOCH_ISO = '1970-01-01T00:00:00.000Z';

/**
 * Mint one settlement dossier for a planned site, re-forking deterministically
 * until it passes the dossier trust gate (or the retry budget is spent).
 * @param {{ generateSettlementPipeline: Function }} engine
 * @param {{ slot:number, tier:string, seed:string, x:number, y:number, burgId:string }} site
 * @param {{
 *   customContent?: object,
 *   tunables?: object,
 *   explicitConfigFields?: object,
 *   provenance?: object,
 * } | null} contentRuntime
 * @returns {{ settlement:any, seed:string, retries:number }}
 */
function mintSettlement(engine, site, contentRuntime) {
  let settlement = null;
  let usedSeed = site.seed;
  let retries = 0;
  for (let attempt = 0; attempt <= MAX_COHERENCE_RETRIES; attempt++) {
    usedSeed = attempt === 0 ? site.seed : `${site.seed}::retry${attempt}`;
    const config = {
      ...DEFAULT_CONFIG,
      settType: site.tier,
      // "Surprise-me within curated bounds": the pipeline rolls the priority
      // sliders (5..95) off the seed, and the DEFAULT_CONFIG random sentinels
      // (random_trade / random_culture / random_threat) resolve per-seed too.
      _randomizePriorities: true,
    };
    // An omitted runtime preserves the composer's headless, vanilla contract.
    // The store binding supplies one exact reviewed snapshot so an Instant
    // World's initial members and its campaign cutoff are born from the same
    // content constitution; the composer still never consults mutable app state.
    const generationOptions = contentRuntime
      ? {
          seed: usedSeed,
          customContent: contentRuntime.customContent || {},
          contentTunables: contentRuntime.tunables || {},
          explicitConfigFields: contentRuntime.explicitConfigFields || {},
          contentProvenance: contentRuntime.provenance || null,
        }
      : { seed: usedSeed, customContent: {} };
    settlement = engine.generateSettlementPipeline(
      config,
      null,
      generationOptions,
    );
    retries = attempt;
    const { blocking } = validateDossier(settlement);
    if (!blocking || blocking.length === 0) break;
  }
  return { settlement, seed: usedSeed, retries };
}

/**
 * Compose a fully-staged Instant World bundle.
 *
 * @param {object} [args]
 * @param {string} [args.seed]                       outer seed (drives everything)
 * @param {{ realmSize?:string, tone?:string, mapKind?:string }} [args.basicConfig]
 * @param {string} [args.name]                       campaign name (default derived)
 * @param {{ generateSettlementPipeline:Function }} [args.engine]  injectable generator
 * @param {{
 *   customContent?:object,
 *   tunables?:object,
 *   explicitConfigFields?:object,
 *   provenance?:object,
 * }} [args.contentRuntime] exact reviewed runtime; omission means vanilla
 * @param {() => string} [args.idFactory]            injectable id source (determinism)
 * @param {() => string} [args.clock]                injectable ISO clock (determinism)
 * @returns {{
 *   campaign: any,
 *   settlements: any[],
 *   plan: ReturnType<typeof deriveWorldPlan>,
 *   fingerprint: string,
 * }}
 */
export function composeInstantWorld({
  seed,
  basicConfig,
  name,
  engine = { generateSettlementPipeline },
  contentRuntime,
  idFactory,
  clock,
} = {}) {
  const knobs = normalizeBasicConfig(basicConfig);
  const plan = deriveWorldPlan({ seed, basicConfig: knobs });
  // Pure, seed-derived defaults keep the domain kernel deterministic; the store
  // binding overrides both with real ids + wall-clock time.
  let _idN = 0;
  const mkId = idFactory || (() => `iw::${plan.seed}::${_idN++}`);
  const now = (clock || (() => EPOCH_ISO))();

  const campaignId = mkId();
  const campaignName = String(name || '').trim() || `Instant Realm ${plan.seed}`.trim();

  // ── Mint + wrap the tier-mixed members as CANON saves ──────────────────────
  const settlements = plan.sites.map((site) => {
    const { settlement, seed: usedSeed, retries } = mintSettlement(
      engine,
      site,
      contentRuntime || null,
    );
    return {
      id: mkId(),
      name: settlement?.name || 'Settlement',
      tier: settlement?.tier || site.tier,
      settlement,
      config: { ...DEFAULT_CONFIG, settType: site.tier, _randomizePriorities: true },
      seed: usedSeed,
      aiData: {},
      // Canon phase — the manual prerequisite for placement + world membership
      // (isCanonSave). The realm's SPATIAL canon stays unfrozen.
      campaignState: { phase: 'canon', eventLog: [] },
      versionHistory: [],
      savedAt: now,
      _instantWorldRetries: retries,
      _slot: site.slot,
    };
  });

  // ── World-scoped faction-name de-dup (CONTENT-GT-DOSSIER) ──────────────────
  // Settlement generation dedups faction names only settlement-locally, so a realm
  // collides (many members each name a faction "The Trade Compact"). This PURE,
  // rng-free post-pass renames cross-settlement collisions deterministically — the
  // members are already minted, so per-settlement generation is untouched (zero
  // rng/golden impact); only the composed bundle's faction names (and the derived
  // fingerprint) change. See ./factionDedup.js.
  dedupeWorldFactionNames(settlements);

  // ── Place them on the map at the planned sites ─────────────────────────────
  const placements = /** @type {Record<string, any>} */ ({});
  plan.sites.forEach((site, i) => {
    placements[site.burgId] = {
      settlementId: settlements[i].id,
      x: site.x,
      y: site.y,
      cellId: null, // composer-derived coordinate; the live FMG cell resolves at canonize
      placedAt: now,
    };
  });

  // ── Compute the staged connections (organic channel discovery from members) ─
  const regionalGraph = deriveGraphWithDiscoveredCandidates(
    settlements,
    ensureRegionalGraph(),
    { now },
  );

  // ── Apply the tone preset to a fresh, spatially-un-canonized worldState ─────
  const tonePreset = SIMULATION_RULE_PRESETS[/** @type {keyof typeof SIMULATION_RULE_PRESETS} */ (plan.tonePresetId)] || SIMULATION_RULE_PRESETS.realistic_regional;
  const worldState = ensureWorldState(
    { simulationRules: tonePreset.rules },
    { id: campaignId, name: campaignName },
  );

  // ── The map state: geography PLAN (seed + template), placements, no snapshot ─
  const mapState = {
    schemaVersion: SCHEMA_VERSION,
    fmgSnapshot: null,
    seed: plan.mapSeed,
    // Instant-World map plan: the FMG template + a marker telling the realm map
    // to materialize geography from `seed` on first open (see
    // useInstantWorldMaterialize). Ignored by every existing surface.
    mapKind: plan.mapKind,
    pendingMapGen: true,
    customBackdrop: null,
    placements,
    labels: [],
    markers: [],
    forests: [],
    // Left minimal; replaceMapState merges the full default layer set on load,
    // exactly as a partial saved map does.
    layers: {},
    viewport: { cx: 0, cy: 0, scale: 1, width: 0, height: 0 },
    savedAt: now,
  };

  // ── Assemble the campaign (mirrors createCampaign's shape, tier-blind) ──────
  const campaign = {
    id: campaignId,
    name: campaignName,
    createdAt: now,
    updatedAt: now,
    settlementIds: settlements.map(s => s.id),
    mapState,
    regionalGraph,
    // ensureWizardNewsFeed stamps its own wall-clock updatedAt; the composer owns
    // the artifact's timestamp, so normalize it to `now` for full replayability.
    wizardNews: { ...ensureWizardNewsFeed(), updatedAt: now },
    worldState,
    collapsed: false,
    accessState: 'active',
    pendingSync: true,
    // Provenance marker — distinguishes an instant realm from a hand-built one
    // for analytics + support; carries no behavior.
    instantWorld: { seed: plan.seed, realmSize: plan.realmSize, tone: plan.tonePresetId, mapKind: plan.mapKind },
  };

  return {
    campaign,
    settlements,
    plan,
    fingerprint: instantWorldFingerprint({ campaign, settlements, plan }),
  };
}

/**
 * A privacy-safe, id/timestamp-free structural fingerprint of a composed bundle.
 * Same (seed, knobs) → identical fingerprint (the determinism pin). Captures the
 * derived CONTENT — each member's reduced structural fingerprint, the tier mix,
 * the regionalGraph channel structure, the placement layout, and the map plan —
 * while excluding opaque scaffolding (uuids, ISO timestamps).
 * @param {{ campaign:any, settlements:any[], plan:any }} bundle
 */
export function instantWorldFingerprint({ campaign, settlements, plan }) {
  const members = (settlements || []).map((/** @type {any} */ s) => ({
    slot: s._slot,
    tier: s.tier,
    fp: extractReducedFingerprint(s.settlement),
  }));
  const channels = ((campaign?.regionalGraph?.channels) || []).map((/** @type {any} */ ch) => ({
    type: ch.type,
    status: ch.status,
    // endpoints by SLOT index (id-free) so the topology is stable across id runs.
    from: slotOf(settlements, ch.fromId ?? ch.sourceId ?? ch.from),
    to: slotOf(settlements, ch.toId ?? ch.targetId ?? ch.to),
  }));
  const sites = (plan?.sites || []).map((/** @type {any} */ st) => ({ slot: st.slot, tier: st.tier, x: st.x, y: st.y }));
  return stableStringify({
    realmSize: plan?.realmSize,
    tone: plan?.tonePresetId,
    mapKind: plan?.mapKind,
    mapSeed: plan?.mapSeed,
    memberCount: members.length,
    members,
    channels,
    sites,
    simulationPreset: campaign?.worldState?.simulationRules?.presetId ?? null,
  });
}

/**
 * settlement id → its plan slot (id-free channel endpoints).
 * @param {any[]} settlements
 * @param {any} id
 */
function slotOf(settlements, id) {
  if (id == null) return null;
  const hit = (settlements || []).find((/** @type {any} */ s) => String(s.id) === String(id));
  return hit ? hit._slot : null;
}
