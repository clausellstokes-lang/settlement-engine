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
//
// SEED RE-SELECTION 2026-08-01 (four specimens; CONFIGS UNCHANGED). Wave I1 added four
// information-brokerage entries to the town and city catalogs, and assembleInstitutions
// consumes one rng.chance() draw per catalog candidate clearing its gates, so every
// town / city / metropolis draw downstream of the catalog TRANSLATED. Four specimens
// here were explicitly "pinned to a fire" (the suffixes below), and a translated stream
// moves a pinned seed off its fire. THE PRODUCERS WERE RE-DERIVED AS UNCHANGED before
// any seed moved: no file under src/generators, no coherence-repair, isolation-support
// or supply-chain producer is touched by the wave, and the two new SUBSUMPTION_RULES
// pairs relate only the new brokerage entries to each other, removing no existing ladder
// relation. The re-measured fire RATES corroborate that independently, each matching the
// rate this file already recorded before the wave:
//   - custom-target subsumption 14/40 seeds (recorded: the cart shed seats on 3 of 9)
//   - isolation_support repair    7/60 seeds (recorded: 2 fires in 20 at metropolis)
//   - magic chain substitution   12/40 seeds
//   - faction pull + reconcile   22/40 seeds (recorded: the pull fired on 8 of 10)
// So the strata are as reachable as they ever were; only which seed lands on them moved.
// The corpus was NOT widened, no assertion was weakened, and no stratum was deleted.

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
    // Re-pinned `-3` to `-23` on 2026-08-01 (I1 catalog stream translation, see the
    // block note above). `-23` also keeps this specimen's threat_defense fire.
    seed: 'effect-reach-v1-criminal-crossroads-town-23',
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
    // Seed pinned to a fire on 2026-08-01 (I1 catalog stream translation, see the block
    // note above). All 12 firing seeds in the sweep also keep the magical-transit fire.
    seed: 'effect-reach-v1-isolated-arcane-town-3',
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
    // Re-pinned `-7` to `-24` on 2026-08-01 (I1 catalog stream translation, see the block
    // note above). This specimen is the sole firer of repair.hard_dependency, so the
    // replacement was chosen to keep ALL FOUR of its strata: isolation_support,
    // hard_dependency, standard subsumption, and magical transit. `-24` is also the seed
    // tests/generators/coherenceRepairPass.test.js pins for the same config, so the two
    // files keep sharing one metropolis specimen as they did before the wave.
    seed: 'effect-reach-v1-iso-metro-24',
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
      + 'The numeric suffix is a seed pinned to one of the seating minority.',
    // Re-pinned `-1` to `-8` on 2026-08-01 (I1 catalog stream translation, see the block
    // note above); `-8` is one of the 14-in-40 seeds where the cart shed seats and the
    // authored `subsumes` reference then removes it, with the paired control still silent.
    seed: 'effect-reach-v1-custom-subsumption-town-8',
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
    // Since §14 began recording its own receipt (queue EP-g, 2026-07-28) the
    // control ALSO cross-checks that receipt — it must be silent here, which is
    // what ties the trace to the `subsumes` reference rather than to the seed.
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
  {
    id: 'mountain-pass-fishmonger',
    targets: 'access-compatibility repair: mountain_pass is user-selectable but '
      + "absent from Fishmonger's forbiddenTradeRoutes (a forbidden-list permits "
      + "every route it does not name, while INSTITUTION_SPATIAL's requiredAccess "
      + 'is an inclusion-list that rejects it), so the Fishmonger seats and the '
      + 'access check removes it — fired on 10 of 40 sibling seeds',
    seed: 'effect-reach-v1-mountain-pass-fishmonger-6',
    config: Object.freeze({
      settType: 'village',
      culture: 'germanic',
      terrainOverride: 'hills',
      tradeRouteAccess: 'mountain_pass',
      monsterThreat: 'heartland',
    }),
  },
]);

// ── the manifest ────────────────────────────────────────────────────────────
//
// `detect(settlement, specimen)` — the second argument carries the specimen
// record (including `control`, the paired dossier) and is used only by the
// custom-subsumption entry. That entry reads §14's own receipt like every
// other detector here; the control it keeps is what proves the receipt tracks
// the authored `subsumes` reference and not the seed.

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
      // §14 now emits its own receipt (queue EP-g, 2026-07-28), so this reads
      // the trace directly — the file's own idiom — instead of inferring the
      // removal from a roster diff.
      const control = specimen?.control;
      if (!control) return false;
      const absorbed = traces(settlement).some(trace => (
        trace.step === 'assembleInstitutions'
        && trace.result === 'subsumed_by_custom'
        && (trace.causes || []).some(cause => cause.effect === 'absorbed')
      ));
      if (!absorbed) return false;
      // The PAIRED CONTROL is kept, and now does double duty. It still proves
      // the absorbed institution was SEATABLE on this seed (it is optional at
      // ~30%, so its mere absence from the treated roster is not evidence of
      // removal — that is the vacuity the cart-shed bug hid behind). It now
      // ALSO cross-checks the new receipt: the trace must be the §14 mechanism
      // firing, so it appears only when the `subsumes` reference is present.
      const named = dossier => new Set(roster(dossier).map(entry => entry?.name));
      const treated = named(settlement);
      const untreated = named(control);
      const controlSilent = !traces(control).some(
        trace => trace.result === 'subsumed_by_custom',
      );
      return controlSilent
        && treated.has(REFERENCE_PACK_NAMES.institution)
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
    id: 'repair.hard_dependency',
    description:
      'coherenceRepairPass added a real catalog prerequisite after validation '
      + 'stopped accepting the gated institution as evidence for its own gate',
    detect: settlement => repairs(settlement).some(
      repair => repair?.type === 'hard_dependency',
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
  Object.freeze({
    id: 'repair.access_compatibility',
    description:
      'coherenceRepairPass removed an institution the resolved trade route '
      + 'cannot support (a mountain-pass village seats a Fishmonger, whose '
      + 'catalog gate only forbids `isolated`, then the access check rejects it)',
    detect: settlement => repairs(settlement).some(
      repair => repair?.type === 'access_compatibility',
    ),
  }),
]);

/**
 * Coherence-repair kinds the pass CAN record and this manifest deliberately
 * omits. Each was probed against the real pipeline and found unreachable; the
 * probe evidence is the reason, and re-adding an entry without new evidence
 * would only convert a known finding back into a silent red.
 *
 * - `mutual_exclusion` (remove an institution that conflicts with another):
 *   `exclusion_violation` has exactly one producer — GATE_FEATURES `blockedBy`
 *   — and NO entry in src/data/spatialData.js declares `blockedBy`. The branch
 *   is unreachable by construction, not by sampling. INV-A archaeology
 *   (2026-07-27): the data was NEVER authored at any commit back to the
 *   2026-03-27 prototype bundle; the working exclusion mechanism is
 *   `exclusiveGroup` (61 catalog entries, four seat-time enforcement sites,
 *   0/400 measured coexistence), and authoring `blockedBy` pairs was measured
 *   HARMFUL (self-implication makes the blocker vacuously present; protected
 *   subjects produce permanent unclearable errors). Retirement is the
 *   recommended owner call (queue EP-g1), measured at 0/400 output change.
 *
 * `access_compatibility` was listed here until 2026-07-27 and its recorded
 * evidence was FALSIFIED by the EP-6 INV-A/INV-B probes: the reasoning held for
 * Docks (a true inclusion-list) but not for Fishmonger, whose FORBIDDEN-list
 * permits every route it does not name — `mountain_pass` (user-selectable) and
 * `none` fall in the gap between the two list polarities, seat the Fishmonger,
 * and the access check then removes it. The stratum now lives in
 * EFFECT_MANIFEST with the mountain-pass specimen. The lesson is recorded in
 * the zero-occurrence ratchet below: exclusion entries are CLAIMS, and claims
 * carry enforcement.
 *
 * Authored institutions cannot reach either stratum: structuralValidator
 * downgrades every violation naming an authored/forced/custom institution to
 * `by_design`, below the error floor the repair pass acts on.
 */
const UNREACHABLE_STRATA = Object.freeze([
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

  it('holds every recorded-unreachable stratum at ZERO occurrences (the exclusion ratchet)', () => {
    // The gap INV-B exposed: an exclusion entry is a CLAIM about the pipeline,
    // and until 2026-07-27 nothing enforced it — access_compatibility sat here
    // for a day while quietly firing at baseline. If a stratum recorded as
    // unreachable ever fires, that is NEWS (a producer changed, or the original
    // probe was wrong): promote it to EFFECT_MANIFEST with a specimen instead of
    // letting the finding rot.
    const failures = collectSeedFailures(UNREACHABLE_STRATA, (strataId) => {
      const repairType = strataId.replace(/^repair\./, '');
      const firedOn = specimens
        .filter(specimen => repairs(specimen.settlement).some(
          repair => repair?.type === repairType,
        ))
        .map(specimen => specimen.id);
      expect(
        firedOn,
        `${strataId} is recorded UNREACHABLE but fired on [${firedOn.join(', ')}] — `
        + 'the producer became reachable (or the exclusion evidence was wrong); '
        + 'move it into EFFECT_MANIFEST with a specimen and delete its exclusion',
      ).toEqual([]);
    });
    expectNoSeedFailures(
      failures,
      'every recorded-unreachable stratum records zero repairs across the corpus',
    );
  });
});
