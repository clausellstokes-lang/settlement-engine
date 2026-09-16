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
 * THE REALM'S ARCANE STANCE (MG-2, docs/DESIGN_REALM_MAGIC_TOGGLE) is answered
 * once, before any of that, and then PROJECTED: a mundane realm stamps
 * magicExists:false + priorityMagic:0 into every member's config at mint
 * (memberConfigFor below). It is deliberately not a realm-level gate — the whole
 * engine already reads per-settlement truth, so projecting the answer makes
 * generation, the pulse, display, regen, share, and export correct by
 * inheritance rather than by fifteen new checks. The realm keeps only a
 * default-for-later (simulationRules.realmMagicDefault) and a provenance echo.
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
import { birthConfig } from '../../domain/density/densityCreateBoundary.js';
// ⭐ THE CREATE BOUNDARY'S ASYNC EDGE, RE-EXPORTED RATHER THAN WRAPPED. This
// composer is SYNCHRONOUS by design — it is the pure realm composer, and making
// it async to await a payload would change every caller's shape for a load that
// is idempotent and memoized. So the callers await it, and they reach it through
// THIS module because all three already pay for this chunk: a caller that has
// dynamically imported the composer needs no second dynamic import to arm the
// seam. It is a re-export and not a second wrapper because a second NAME for one
// act is how two call sites come to await different things. The edge is
// lazy -> lazy (this file's static import of the boundary is one line above),
// so it adds no module to any closure.
export { loadGenerationLawPayloads } from '../../domain/density/densityCreateBoundary.js';
import { deriveGraphWithDiscoveredCandidates } from '../../domain/region/discoverDependencyCandidates.js';
import { ensureRegionalGraph, ensureWizardNewsFeed } from '../../domain/region/index.js';
import { ensureWorldState } from '../../domain/worldPulse/worldState.js';
import { SIMULATION_RULE_PRESETS } from '../../domain/worldPulse/simulationRules.js';
import { validateDossier } from '../../domain/validation/consistency.js';
import { extractReducedFingerprint, stableStringify } from '../structuralFingerprint.js';
import { deriveWorldPlan, normalizeBasicConfig } from '../../domain/instantWorld/worldPlan.js';
import { dedupeWorldFactionNames } from './factionDedup.js';
import { materializeGenesisRelations, genesisRelationsSection } from '../../domain/instantWorld/genesisDiplomacy.js';
import { runComposerSteps } from './composerPipeline.js';

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
 * THE MEMBER CONFIG — one source, two consumers (MG-2).
 *
 * This is the ONLY place an Instant World member's generation config is spelled.
 * It is read twice — once as the pipeline's input at mint, once as the save
 * entry's `config` (which becomes the member's persisted `_config`) — and those
 * two had drifted into two literals that merely happened to agree. A projection
 * written into one of them and not the other would produce a member generated
 * mundane whose stored config claims magic, and the next regeneration would
 * quietly restore the magic. One spelling makes that class impossible.
 *
 * THE PROJECTION (MG-2, docs/DESIGN_REALM_MAGIC_TOGGLE §4). A mundane realm is
 * not a live gate anyone consults later: the realm's answer is STAMPED into each
 * member's own config here, after which every existing mechanism — the
 * generation world law, the pulse's per-settlement magicLedger read, the display
 * envelope, full regen, section reroll, share, export — is already correct,
 * because they all read per-settlement truth and always did. Both fields move
 * together, matching what the per-settlement UI itself writes
 * (ConfigurationPanel: magicExists:false ⇒ priorityMagic:0).
 *
 * Byte-identity when magical: both keys already exist in DEFAULT_CONFIG, so the
 * mundane override replaces values in place and the conditional spread is empty
 * for 'yes' — key order and content are unchanged from before this knob existed.
 *
 * @param {{ slot:number, tier:string, seed:string, x:number, y:number, burgId:string }} site
 * @param {{ magic?: string }} plan
 * @returns {Record<string, any>}
 */
function memberConfigFor(site, plan) {
  return {
    ...DEFAULT_CONFIG,
    // THE CREATE BOUNDARY (ODQ §822). A realm member is unambiguously a BIRTH —
    // it is composed from DEFAULT_CONFIG with no prior world in the call — so it
    // carries the generation laws a new world is born under. ⚠ THIS COMMENT USED
    // TO END "Dormant today: `birthConfig` spreads an EMPTY object while the dial
    // sits at the default, so an Instant World's configs are byte-identical to
    // pre-law ones", and the living-content half of that stopped being true on
    // 2026-09-08. `birthConfig` now spreads `_livingContentLawVersion: 2` here as
    // everywhere else; the density dial is still dormant and still spreads
    // nothing. The configs are no longer byte-identical to pre-law ones, and the
    // WORLDS still are: measured at the lighting on two corpora, nothing but the
    // law's own declaration moves.
    ...birthConfig({}),
    settType: site.tier,
    // "Surprise-me within curated bounds": the pipeline rolls the priority
    // sliders (5..95) off the seed, and the DEFAULT_CONFIG random sentinels
    // (random_trade / random_culture / random_threat) resolve per-seed too.
    _randomizePriorities: true,
    ...(plan?.magic === 'no' ? { magicExists: false, priorityMagic: 0 } : {}),
  };
}

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
 * @param {Record<string, any>} memberConfig the ONE config (memberConfigFor)
 * @returns {{ settlement:any, seed:string, retries:number }}
 */
function mintSettlement(engine, site, contentRuntime, memberConfig) {
  let settlement = null;
  let usedSeed = site.seed;
  let retries = 0;
  for (let attempt = 0; attempt <= MAX_COHERENCE_RETRIES; attempt++) {
    usedSeed = attempt === 0 ? site.seed : `${site.seed}::retry${attempt}`;
    // A fresh copy per attempt: the pipeline is handed an object it may resolve
    // in place, and a retry must start from the same raw truth as attempt 0.
    const config = { ...memberConfig };
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
 * @param {{ realmSize?:string, tone?:string, mapKind?:string, magic?:string }} [args.basicConfig]
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
 * @param {number} [args.planLaw]                    plan-law version, threaded to
 *   `deriveWorldPlan`; absent ⇒ the legacy law, so an existing caller composes the
 *   same world it always did
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
  planLaw,
} = {}) {
  const knobs = normalizeBasicConfig(basicConfig);
  // ── THE SHARED CLOCK, READ EXACTLY ONCE (coupling `shared_now`) ────────────
  // Every timestamp in the bundle is this one value. A step that read the clock
  // again would produce a bundle whose parts disagree about when it was made and
  // would break the injected-clock replay pin.
  const now = (clock || (() => EPOCH_ISO))();
  // ── THE SHARED ID COUNTER (coupling `id_order`) ────────────────────────────
  // Pure, seed-derived defaults keep the domain kernel deterministic; the store
  // binding overrides both with real ids + wall-clock time. The ORDER of the calls
  // below is load-bearing: the campaign takes the first id, each member the next.
  let _idN = 0;
  /** @type {{ plan?: any }} */
  const seedRef = {};
  const mkId = idFactory || (() => `iw::${seedRef.plan?.seed}::${_idN++}`);

  // ── THE INSTANCE-SCOPED STEP LIST (ST-3 / D12) ────────────────────────────
  // Built per call, never registered globally — the composer invokes the settlement
  // pipeline NESTED, and a shared registry would splice these steps into that
  // pipeline's own topological sort. `runComposerSteps` refuses any list whose
  // order does not match the declared contract, so the four couplings the contract
  // records cannot be broken by an edit that merely looks tidy.
  const ctx = /** @type {Record<string, any>} */ ({
    seed, knobs, name, engine, contentRuntime, now, planLaw,
    // The knobs AS GIVEN ride beside the normalized ones: the surprise-me sentinels
    // are erased by normalization (that is what normalization is for), so the plan
    // needs the raw form to see that a knob was left to the seed.
    rawBasicConfig: basicConfig,
  });

  const steps = [
    { name: 'derivePlan', fn: (/** @type {any} */ c) => {
      const plan = deriveWorldPlan({
        seed: c.seed,
        basicConfig: c.rawBasicConfig === undefined ? c.knobs : c.rawBasicConfig,
        planLaw: c.planLaw,
      });
      seedRef.plan = plan;
      return { plan };
    } },

    { name: 'openCampaignIdentity', fn: (/** @type {any} */ c) => ({
      // FIRST call on the id counter — see coupling `id_order`.
      campaignId: mkId(),
      campaignName: String(c.name || '').trim() || `Instant Realm ${c.plan.seed}`.trim(),
    }) },

    { name: 'mintMembers', fn: (/** @type {any} */ c) => ({
      settlements: mintMembers(c, mkId),
    }) },

    // ── World-scoped faction-name de-dup (CONTENT-GT-DOSSIER) ────────────────
    // Settlement generation dedups faction names only settlement-locally, so a realm
    // collides (many members each name a faction "The Trade Compact"). This PURE,
    // rng-free post-pass renames cross-settlement collisions deterministically — the
    // members are already minted, so per-settlement generation is untouched (zero
    // rng/golden impact); only the composed bundle's faction names (and the derived
    // fingerprint) change. IN-PLACE (coupling `in_place_mutation`). See ./factionDedup.js.
    { name: 'dedupeFactionNames', fn: (/** @type {any} */ c) => { dedupeWorldFactionNames(c.settlements); } },

    // ── The realm's FOUNDING TIES, materialized onto the members ─────────────
    // POLIS-2 (DESIGN_FMG_WEAVE D6, ordered by A1.2.12). The plan decides which ties
    // a realm is born holding, SLOT-addressed; this turns those slots into save-id
    // links on the members themselves. IN-PLACE (coupling `in_place_mutation`).
    //
    // THE POSITION IS THE CONTRACT. It must run AFTER the faction de-dup, so a link
    // stores each neighbour's FINAL name; and BEFORE channel discovery, because
    // discovery INGESTS `neighbourNetwork` — a founding tie materialized after it
    // would exist on the members and be invisible to the regional graph. The step
    // list makes that order checkable instead of merely stated.
    //
    // DORMANT until the plan car lands: `plan.relations` is absent today, the call
    // writes nothing, and the composed bundle is byte-identical.
    { name: 'materializeGenesisTies', fn: (/** @type {any} */ c) => {
      materializeGenesisRelations({ settlements: c.settlements, relations: c.plan.relations });
    } },

    { name: 'placeMembers', fn: (/** @type {any} */ c) => ({ placements: placeMembers(c) }) },

    // ── Compute the staged connections (organic channel discovery from members) ─
    { name: 'discoverChannels', fn: (/** @type {any} */ c) => ({
      // The SEED graph takes `c.now` too. It was `ensureRegionalGraph()` with no options while
      // the sibling argument threaded `{ now: c.now }` — so the composer's empty starting graph
      // took its default stamp from the wall clock inside the one step whose whole job is to be
      // a pure function of the seed.
      regionalGraph: deriveGraphWithDiscoveredCandidates(c.settlements, ensureRegionalGraph(undefined, { now: c.now }), { now: c.now }),
    }) },

    { name: 'applyTonePreset', fn: (/** @type {any} */ c) => ({ worldState: applyTonePreset(c) }) },

    { name: 'buildMapState', fn: (/** @type {any} */ c) => ({ mapState: buildMapState(c) }) },

    { name: 'assembleCampaign', fn: (/** @type {any} */ c) => ({ campaign: assembleCampaign(c) }) },
  ];

  runComposerSteps(steps, ctx);

  return {
    campaign: ctx.campaign,
    settlements: ctx.settlements,
    plan: ctx.plan,
    fingerprint: instantWorldFingerprint({
      campaign: ctx.campaign, settlements: ctx.settlements, plan: ctx.plan,
    }),
  };
}

/**
 * Mint + wrap the tier-mixed members as CANON saves. One member per planned site,
 * in slot order — which is also id-mint order (coupling `id_order`).
 * @param {any} c the composer context
 * @param {() => string} mkId
 */
function mintMembers(c, mkId) {
  const { plan, engine, contentRuntime, now } = c;
  return plan.sites.map((/** @type {any} */ site) => {
    const memberConfig = memberConfigFor(site, plan);
    const { settlement, seed: usedSeed, retries } = mintSettlement(
      engine,
      site,
      contentRuntime || null,
      memberConfig,
    );
    return {
      id: mkId(),
      name: settlement?.name || 'Settlement',
      tier: settlement?.tier || site.tier,
      settlement,
      // The RAW config the member was generated under — this is what the save
      // persists as `_config`, and what a full regen replays. Neither projected
      // field is in the DERIVED_CONFIG_KEYS strip list, so the stance survives
      // regen, reroll, save/load, share, and account export untouched.
      config: { ...memberConfig },
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
}

/**
 * Place each member on the map at its planned site.
 *
 * ⛔ THE JOIN IS ON `slot`, NEVER ON ARRAY INDEX (coupling `placement_join`).
 * This loop used to read `settlements[i]` while walking `plan.sites` — correct only
 * for as long as the member array is built by mapping the site array and is never
 * filtered, sorted, or appended to. Nothing said so and nothing would have failed
 * loudly: a reorder would have placed every settlement on its neighbour's site, and
 * the realm would still have looked well-formed. `slot` is the identity a plan and
 * a member genuinely share, so the join now cannot drift. Today the two orders
 * agree, which is exactly why this repair is byte-identical and safe to make now
 * rather than after something has already reordered the array.
 *
 * EXPORTED so the coupling is EXECUTABLE. A declared coupling whose guard cannot be
 * run is a promise, not a guard: the only way to prove the join survives a reordered
 * member array is to hand it one, and that requires a seam. This is that seam.
 * @param {any} c the composer context
 */
export function placeMembers(c) {
  const { plan, settlements, now } = c;
  const bySlot = new Map(settlements.map((/** @type {any} */ s) => [s._slot, s]));
  const placements = /** @type {Record<string, any>} */ ({});
  for (const site of plan.sites) {
    const member = bySlot.get(site.slot);
    if (!member) continue;
    placements[site.burgId] = {
      settlementId: member.id,
      x: site.x,
      y: site.y,
      cellId: null, // composer-derived coordinate; the live FMG cell resolves at canonize
      placedAt: now,
    };
  }
  return placements;
}

/**
 * Apply the tone preset to a fresh, spatially-un-canonized worldState.
 * @param {any} c the composer context
 */
function applyTonePreset(c) {
  const { plan, campaignId, campaignName } = c;
  const tonePreset = SIMULATION_RULE_PRESETS[/** @type {keyof typeof SIMULATION_RULE_PRESETS} */ (plan.tonePresetId)] || SIMULATION_RULE_PRESETS.realistic_regional;
  // THE REALM'S REMAINDER (MG-2). The members carry the whole truth; what the
  // realm keeps is a DEFAULT-FOR-LATER, written at the same site the tone preset
  // already writes rules. Its one consumer is the single-settlement wizard, which
  // pre-selects a mundane config when generating INTO this realm — visibly and
  // overridably, because the DM's one strange glowing city is a deliberate act.
  // No generator, pulse, or display path ever reads it (MG-LAW-1): a realm rule
  // consulted at read time is the double-authority defect this design avoids.
  //
  // VIRTUAL-FLAG DISCIPLINE (MG-LAW-6): written ONLY for a mundane realm, so a
  // magical realm's rules are byte-identical to the preset's and absence means
  // magical. It is not a RULE_COMPARISON_KEY (those derive from the boolean
  // surface of DEFAULT_SIMULATION_RULES, which this key is absent from), so
  // preset identity and preset inference are untouched.
  const mundaneRealm = plan.magic === 'no';
  return ensureWorldState(
    { simulationRules: mundaneRealm ? { ...tonePreset.rules, realmMagicDefault: 'mundane' } : tonePreset.rules },
    { id: campaignId, name: campaignName },
  );
}

/**
 * The map state: geography PLAN (seed + template), placements, no snapshot.
 * @param {any} c the composer context
 */
function buildMapState(c) {
  const { plan, placements, now } = c;
  return {
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
}

/**
 * Assemble the campaign (mirrors createCampaign's shape, tier-blind).
 * @param {any} c the composer context
 */
function assembleCampaign(c) {
  const { campaignId, campaignName, now, settlements, mapState, regionalGraph, worldState, plan } = c;
  const mundaneRealm = plan.magic === 'no';
  return {
    id: campaignId,
    name: campaignName,
    createdAt: now,
    updatedAt: now,
    settlementIds: settlements.map(s => s.id),
    mapState,
    regionalGraph,
    // ⛔ THE COMPOSER'S CLOCK IS `now`, AND IT IS THREADED, NOT OVERWRITTEN. This used to
    // read `{ ...ensureWizardNewsFeed(), updatedAt: now }` — the normalizer minted a live
    // wall-clock `updatedAt` and the spread then overwrote it one property later. The BYTES
    // were right; the READ was not, and it was right only by key order. The composer's whole
    // contract is a pure function of the seed (`now` defaults to EPOCH_ISO via the injected
    // clock), so a wall-clock read inside it forfeits that for nothing. Threading `now`
    // produces the identical value with no clock read at all.
    wizardNews: ensureWizardNewsFeed(undefined, { now }),
    worldState,
    collapsed: false,
    accessState: 'active',
    pendingSync: true,
    // Provenance marker — distinguishes an instant realm from a hand-built one
    // for analytics + support; carries no behavior. `magic` rides the same
    // virtual discipline as the rules key above: recorded only when the answer
    // was 'no', so a magical realm's marker is byte-identical to every marker
    // written before the question existed.
    instantWorld: {
      seed: plan.seed,
      realmSize: plan.realmSize,
      tone: plan.tonePresetId,
      mapKind: plan.mapKind,
      ...(mundaneRealm ? { magic: 'no' } : {}),
    },
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
    // POLIS-2 (D6). The fingerprint covered every derived surface EXCEPT the
    // relationship edges — a determinism blind spot sitting exactly where genesis
    // diplomacy lands, so the feature would have been unpinnable by the pin that
    // exists to catch it. Slot-addressed, so it is stable across id runs.
    // ABSENT WHEN DARK: the section is `undefined` for a plan with no relations and
    // the serializer skips undefined keys, so a realm composed without a relations
    // plan fingerprints byte-identically to one composed before this section existed.
    relations: genesisRelationsSection(plan?.relations),
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
