/**
 * effectReachability.coverage.test.js — liveness census for authored pipeline effects.
 *
 * THE LAW: an authored generation effect that no reachable configuration can
 * produce is dead code wearing a feature's clothes. Reading the producer is not
 * evidence that it runs; only executing the real pipeline and observing the
 * effect's own receipt is. Every effect registered in EFFECT_MANIFEST below must
 * therefore FIRE at least once across a pinned, deterministic corpus.
 *
 * WHY THIS FILE EXISTS — two confirmed dead strata:
 *
 *   1. The cart-shed conjunction (assembleInstitutions §14, found 2026-07-26).
 *      `!isProtected(x) && matchesSubsumptionTarget(x)` was unsatisfiable: every
 *      materialized custom institution was protected, so custom subsumption had
 *      a code path, a comment, and a semantics — and executed zero times out of
 *      130. The test that eventually caught it reported 1 failing seed out of
 *      100 when the true rate was 30, because a seed loop aborts on its first
 *      failure. A sampled pass proves nothing about reachability; only a
 *      counted fire does.
 *
 *   2. The seven entrepot chains (docs/GENERATION_COHERENCE_AUDIT.md): spices,
 *      silk, transit finance, luxury goods, magical goods, planar, and
 *      smuggling all shipped with empty processor lists and could never
 *      activate, while the vocabulary, the income labels, and the UI all
 *      described them as live.
 *
 * THE IDIOM. Detectors read the persisted dossier and its receipts — the
 * simulation trace, the coherence receipt's repair ledger, the isolation-support
 * receipt, the final roster — never a producer's internals. A detector that can
 * only see the effect by re-implementing the pass is testing the test.
 *
 * Two assertions, deliberately opposed:
 *   - every registered effect fires somewhere (no dead stratum);
 *   - every registered detector is false somewhere (no vacuous detector).
 * The second is what stops a failing census from being "fixed" by widening a
 * predicate until it matches every settlement.
 *
 * EXCLUSIONS ARE FINDINGS, NOT OMISSIONS. Three coherence-repair kinds the pass
 * can record are deliberately ABSENT from the manifest because probing found
 * them unreachable; see UNREACHABLE_STRATA at the foot of this file for the
 * evidence. Do not add them here to make the roster look complete — that would
 * re-hide exactly what this file exists to expose.
 */

import { beforeAll, describe, expect, it } from 'vitest';
import { canonicalSupplyChainStatus } from '../../src/domain/supplyChainState.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  REFERENCE_PACK_NAMES,
  identifiedCustomContentReferencePack,
} from '../fixtures/customContentReferencePack.js';
import {
  collectSeedFailures,
  expectNoSeedFailures,
} from '../helpers/seedFailures.js';

// ── receipt readers ─────────────────────────────────────────────────────────

const traces = settlement => settlement?.simulationTrace || [];
const repairs = settlement => settlement?.generationCoherenceReceipt?.repairs || [];
const roster = settlement => settlement?.institutions || [];

/** The id form every institution trace uses (subsumption/cascade/faction/repair). */
function institutionSlug(name) {
  return String(name)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function rosterNameForTrace(settlement, targetId) {
  const slug = String(targetId || '').replace(/^institution\./, '');
  return roster(settlement)
    .map(institution => institution?.name)
    .find(name => name && institutionSlug(name) === slug) || null;
}

/** True when the final economy actually consumed this institution. */
function isEconomicallyReconciled(settlement, name) {
  const target = String(name).toLowerCase();
  const chains = settlement?.economicState?.activeChains || [];
  const participatesInChain = chains.some(chain => (
    (chain?.processingInstitutions || []).some(entry => (
      String(entry?.name || entry).toLowerCase() === target
    ))
  ));
  if (participatesInChain) return true;
  const services = Object.values(settlement?.availableServices || {}).flat();
  return services.some(service => (
    String(service?.institution || '').toLowerCase() === target
  ));
}

/** The custom pack with its `subsumes` reference removed — the paired control. */
function referencePackWithoutSubsumption() {
  const pack = identifiedCustomContentReferencePack();
  pack.institutions = pack.institutions.map(institution => (
    institution.localUid === 'reference-aurora-provisioners'
      ? { ...institution, subsumes: [] }
      : institution
  ));
  return pack;
}

// ── the corpus ──────────────────────────────────────────────────────────────
//
// Every config and seed is a fixed literal. The first six entries are
// certification-corpus profiles (tests/generators/generationCertificationCorpus
// .test.js); the rest are authored to target one effect each, and say so.

const CORPUS = Object.freeze([
  {
    id: 'religious-river-village',
    targets: 'standard subsumption: a temple ladder collapses its lesser rungs',
    seed: 'effect-reach-v1-religious-river-village',
    config: Object.freeze({
      settType: 'village',
      culture: 'slavic',
      terrainOverride: 'riverside',
      tradeRouteAccess: 'river',
      priorityReligion: 90,
    }),
  },
  {
    id: 'frontier-hamlet',
    targets: 'cascade seating: a small chain-dense roster pulls adjacent trades in',
    seed: 'effect-reach-v1-frontier-hamlet',
    config: Object.freeze({
      settType: 'hamlet',
      culture: 'celtic',
      terrainOverride: 'forest',
      tradeRouteAccess: 'road',
      monsterThreat: 'frontier',
      priorityMilitary: 80,
    }),
  },
  {
    id: 'criminal-crossroads-town',
    targets: 'faction pull + economic reconcile: a dominant criminal bloc seats a '
      + 'signature institution LATE — after the provisional economy — so the '
      + 'reconcile has to re-derive chains and services from the final roster. A '
      + 'high-criminal crossroads town is the reliable trigger: the pull fired on '
      + '8 of 10 sibling seeds here versus 1 of 10 for the mercantile seaport '
      + 'profile, whose merchant bloc usually already owns its institutions',
    seed: 'effect-reach-v1-criminal-crossroads-town-3',
    config: Object.freeze({
      settType: 'town',
      culture: 'steppe',
      terrainOverride: 'plains',
      tradeRouteAccess: 'crossroads',
      priorityCriminal: 90,
    }),
  },
  {
    id: 'isolated-arcane-town',
    targets: 'isolation magical transit + magic chain substitution: an isolated, '
      + 'high-magic mountain town has a real mundane capacity gap and traditions '
      + 'strong enough to prop its impaired chains',
    seed: 'effect-reach-v1-isolated-arcane-town',
    config: Object.freeze({
      settType: 'town',
      culture: 'greek',
      terrainOverride: 'mountain',
      tradeRouteAccess: 'isolated',
      magicExists: true,
      priorityMagic: 90,
    }),
  },
  {
    id: 'plagued-isolated-druid-village',
    targets: 'threat-defense repair: plague pressure demands a perimeter and a '
      + 'force the ordinary roster did not roll',
    seed: 'effect-reach-v1-plagued-isolated-druid-village',
    config: Object.freeze({
      settType: 'village',
      culture: 'celtic',
      terrainOverride: 'forest',
      tradeRouteAccess: 'isolated',
      monsterThreat: 'plagued',
      magicExists: true,
      priorityMagic: 80,
      priorityReligion: 80,
    }),
  },
  {
    id: 'isolated-high-magic-metropolis',
    targets: 'isolation-support repair: a metropolis carries the largest required '
      + 'capacity in the table, so roster reconciliation can reopen a support gap '
      + 'the isolation pass had already closed and the pass re-injects transit. '
      + 'Tier is the load-bearing dial, not isolation alone — measured 2 fires in '
      + '20 seeds at metropolis against 0 in 70 across isolated thorp/town/city '
      + 'with the same culture, terrain, and magic settings. Seed pinned to a fire',
    seed: 'effect-reach-v1-iso-metro-7',
    config: Object.freeze({
      settType: 'metropolis',
      culture: 'greek',
      terrainOverride: 'mountain',
      tradeRouteAccess: 'isolated',
      magicExists: true,
      priorityMagic: 100,
    }),
  },
  {
    id: 'city-with-walls-excluded',
    targets: 'unsupported-institution repair: the DM force-excludes city walls, so '
      + 'a generated Citadel loses its only hard dependency AND every substitute '
      + 'the tier could offer — the repair pass must remove the dependent',
    seed: 'effect-reach-v1-city-with-walls-excluded',
    config: Object.freeze({
      settType: 'city',
      culture: 'norse',
      terrainOverride: 'hills',
      tradeRouteAccess: 'road',
      monsterThreat: 'safe',
      priorityMilitary: 95,
      _institutionToggles: Object.freeze({
        'city::Defense::City walls and gates': Object.freeze({ forceExclude: true }),
      }),
    }),
  },
  {
    id: 'custom-subsumption-town',
    targets: 'custom-target subsumption: the canonical reference pack\'s '
      + 'provisioners declare `subsumes` over the cart shed. This effect needs a '
      + 'customDefinition fixture by construction — the rule lives in an authored '
      + '`subsumes` reference, not in the native SUBSUMPTION_RULES table — and it '
      + 'needs the PAIRED CONTROL below, because the absorbed institution is '
      + 'optional (~30% seating) and its mere absence is not evidence of removal. '
      + 'That is the exact vacuity the cart-shed bug hid behind: measured over '
      + 'nine sibling seeds of this config, the cart shed seats on 3 — on the '
      + 'other 6 an uncontrolled detector would report a fire that never happened. '
      + 'The `-1` suffix is a seed pinned to one of the seating three.',
    seed: 'effect-reach-v1-custom-subsumption-town-1',
    config: Object.freeze({
      settType: 'town',
      culture: 'latin',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      monsterThreat: 'safe',
      priorityEconomy: 70,
    }),
    customContent: identifiedCustomContentReferencePack,
    // Same config, same seed, same pack minus the `subsumes` reference: the RNG
    // stream is identical because §14 removal happens after seating, so the
    // control proves the cart shed WAS seated and the treatment removed it.
    controlCustomContent: referencePackWithoutSubsumption,
  },
  {
    id: 'subsistence-thorp',
    targets: 'the mundane floor — a no-magic, no-threat, connected thorp. Present '
      + 'so the inverse-sanity assertion has a specimen where most effects are '
      + 'legitimately absent',
    seed: 'effect-reach-v1-subsistence-thorp',
    config: Object.freeze({
      settType: 'thorp',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      magicExists: false,
      priorityMagic: 0,
      priorityEconomy: 20,
      priorityMilitary: 35,
    }),
  },
]);

// ── the manifest ────────────────────────────────────────────────────────────
//
// `detect(settlement, specimen)` — the second argument carries the specimen
// record (including `control`, the paired dossier) and is used only by the
// custom-subsumption entry, whose effect is a REMOVAL that records no receipt.

const EFFECT_MANIFEST = Object.freeze([
  Object.freeze({
    id: 'subsumption.standard.absorbed',
    description:
      'subsumptionPass absorbed a lesser institution into a greater one from the '
      + 'native SUBSUMPTION_RULES ladder',
    detect: settlement => traces(settlement).some(trace => (
      trace.step === 'subsumptionPass'
      && trace.result === 'subsumed'
      && (trace.causes || []).some(cause => cause.effect === 'absorbed')
    )),
  }),
  Object.freeze({
    id: 'subsumption.customTarget.absorbed',
    description:
      'a custom institution\'s authored `subsumes` reference removed its exact '
      + 'target (assembleInstitutions §14 — the cart-shed conjunction)',
    detect: (settlement, specimen) => {
      const control = specimen?.control;
      if (!control) return false;
      const named = dossier => new Set(roster(dossier).map(entry => entry?.name));
      const treated = named(settlement);
      const untreated = named(control);
      return treated.has(REFERENCE_PACK_NAMES.institution)
        && untreated.has(REFERENCE_PACK_NAMES.absorbedInstitution)
        && !treated.has(REFERENCE_PACK_NAMES.absorbedInstitution);
    },
  }),
  Object.freeze({
    id: 'cascade.seat.added',
    description: 'cascadePass seated a chain-adjacent institution',
    detect: settlement => traces(settlement).some(trace => (
      trace.step === 'cascadePass' && trace.result === 'cascaded'
    )),
  }),
  Object.freeze({
    id: 'cascade.seat.borrowedRequiredFalse',
    description:
      'a cascade-seated record carries `required: false` — the borrowed lower-tier '
      + '`required` flag was scoped away at the producer (owner-ratified 2026-07-26)',
    detect: settlement => roster(settlement).some(institution => (
      institution?.cascadeAdded === true && institution?.required === false
    )),
  }),
  Object.freeze({
    id: 'isolation.magicalTransit.substituted',
    description:
      'isolationSupport credited a magical-transit path — the last substitution, '
      + 'reached only after every mundane path left a real deficit',
    detect: settlement => (settlement?.isolationSupport?.paths || []).some(
      path => path?.type === 'magical_transit',
    ),
  }),
  Object.freeze({
    id: 'chain.magicSubstitution.substituted',
    description:
      'a supply chain reached the canonical `substituted` status via magic '
      + 'tradition substitution (the producer emits the legacy '
      + '`magically_sustained`; the canonical vocabulary is the authority)',
    detect: settlement => (settlement?.economicState?.activeChains || []).some(
      chain => canonicalSupplyChainStatus(chain?.status) === 'substituted',
    ),
  }),
  Object.freeze({
    id: 'faction.pulled.economicallyReconciled',
    description:
      'a faction-pulled institution survived to the final roster AND the post-pull '
      + 'economy reconcile consumed it (chain participation or a provided service)',
    detect: (settlement) => traces(settlement)
      .filter(trace => trace.result === 'faction_pulled')
      .some(trace => {
        const name = rosterNameForTrace(settlement, trace.targetId);
        return Boolean(name) && isEconomicallyReconciled(settlement, name);
      }),
  }),
  Object.freeze({
    id: 'repair.threat_defense',
    description:
      'coherenceRepairPass added a fortification or standing force the resolved '
      + 'threat requires',
    detect: settlement => repairs(settlement).some(
      repair => repair?.type === 'threat_defense',
    ),
  }),
  Object.freeze({
    id: 'repair.isolation_support',
    description:
      'coherenceRepairPass injected transit infrastructure because roster '
      + 'reconciliation reopened an isolation-support gap',
    detect: settlement => repairs(settlement).some(
      repair => repair?.type === 'isolation_support',
    ),
  }),
  Object.freeze({
    id: 'repair.unsupported_institution',
    description:
      'coherenceRepairPass removed a generated institution whose hard dependency '
      + 'had no compatible, non-excluded candidate at this tier',
    detect: settlement => repairs(settlement).some(
      repair => repair?.type === 'unsupported_institution',
    ),
  }),
]);

/**
 * Coherence-repair kinds the pass CAN record and this manifest deliberately
 * omits. Each was probed against the real pipeline and found unreachable; the
 * probe evidence is the reason, and re-adding an entry without new evidence
 * would only convert a known finding back into a silent red.
 *
 * - `hard_dependency` (add the missing dependency): never observed in 194
 *   generated specimens. GATE_FEATURES dependencies are structurally
 *   pre-satisfied — 60 of 89 hard-`requires` gates are self-satisfying through
 *   structuralValidator's SPATIAL_FEATURES expansion (the gated institution
 *   implies its own prerequisites into the checked set), and the rest name
 *   `required: true` catalog entries their tier always seats. Forcing the gap
 *   with a toggle cannot reach it either: the toggle marks the dependency
 *   explicitly excluded, so `isCompatible` refuses to add it and the pass falls
 *   through to `unsupported_institution` instead.
 * - `access_compatibility` (remove an institution the route cannot support):
 *   INSTITUTION_SPATIAL gates exactly four names. Two ('Major port', 'Navy (if
 *   coastal)') are absent from institutionalCatalog entirely; 'Fishmonger'
 *   declares `forbiddenTradeRoutes: ['isolated']` and 'Docks/port facilities'
 *   declares `tradeRouteRequired: ['port','river']`, so no seating path can
 *   place either on an incompatible route. The cascade's airship override is
 *   the one path that seats docks off-route, and INSTITUTION_SPATIAL's
 *   exception names the exact catalog entry it requires. Custom content cannot
 *   open the gap: a custom institution has no native semantic name, so the
 *   airship check does not see it (finite-semantics law).
 * - `mutual_exclusion` (remove an institution that conflicts with another):
 *   `exclusion_violation` has exactly one producer — GATE_FEATURES `blockedBy`
 *   — and NO entry in src/data/spatialData.js declares `blockedBy`. The branch
 *   is unreachable by construction, not by sampling.
 *
 * Authored institutions cannot reach any of the three either: structuralValidator
 * downgrades every violation naming an authored/forced/custom institution to
 * `by_design`, below the error floor the repair pass acts on.
 */
const UNREACHABLE_STRATA = Object.freeze([
  'repair.hard_dependency',
  'repair.access_compatibility',
  'repair.mutual_exclusion',
]);

// ── execution ───────────────────────────────────────────────────────────────

/** @type {Array<{id:string, settlement:object, control:object|null}>} */
const specimens = [];

beforeAll(() => {
  for (const entry of CORPUS) {
    const settlement = generateSettlementPipeline(entry.config, null, {
      seed: entry.seed,
      customContent: entry.customContent ? entry.customContent() : {},
    });
    const control = entry.controlCustomContent
      ? generateSettlementPipeline(entry.config, null, {
        seed: entry.seed,
        customContent: entry.controlCustomContent(),
      })
      : null;
    specimens.push({ id: entry.id, settlement, control });
  }
}, 60_000);

describe('authored effect reachability', () => {
  // Both censuses run EVERY manifest entry before asserting. A bare loop would
  // stop at the first dead stratum and report "1", which is precisely how the
  // cart-shed bug was sized at 1-of-100 when it was 30-of-100.
  it('fires every registered effect at least once across the pinned corpus', () => {
    const failures = collectSeedFailures(EFFECT_MANIFEST, (effect) => {
      const firedOn = specimens
        .filter(specimen => effect.detect(specimen.settlement, specimen))
        .map(specimen => specimen.id);
      expect(
        firedOn.length,
        `${effect.id} never fired (${effect.description}); authored stratum may be `
        + 'unreachable — investigate the producer before widening the corpus',
      ).toBeGreaterThan(0);
    });
    expectNoSeedFailures(
      failures,
      'every registered authored effect fires somewhere in the pinned corpus',
    );
  });

  it('keeps every detector falsifiable — none matches every specimen', () => {
    const failures = collectSeedFailures(EFFECT_MANIFEST, (effect) => {
      const quietOn = specimens
        .filter(specimen => !effect.detect(specimen.settlement, specimen))
        .map(specimen => specimen.id);
      expect(
        quietOn.length,
        `${effect.id} matched every specimen, so a firing count proves nothing `
        + 'about the producer — narrow the detector to the effect\'s own receipt',
      ).toBeGreaterThan(0);
    });
    expectNoSeedFailures(
      failures,
      'every registered detector is false on at least one specimen',
    );
  });

  it('keeps the manifest and the recorded exclusions disjoint', () => {
    // A future session "completing" the roster by pasting an excluded id back in
    // would silently re-hide the finding the exclusion records.
    const registered = new Set(EFFECT_MANIFEST.map(effect => effect.id));
    expect(
      UNREACHABLE_STRATA.filter(excluded => registered.has(excluded)),
      'an id is registered as reachable while still listed as an unreachable '
      + 'stratum — one of the two records is now wrong',
    ).toEqual([]);
    expect(registered.size, 'duplicate effect id in EFFECT_MANIFEST')
      .toBe(EFFECT_MANIFEST.length);
  });
});
