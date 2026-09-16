/**
 * emigreErrand.js — INT-3b. THE ÉMIGRÉ MINT SEAM: a defeated claimant's flight, priced
 * through the estate's ONE purposeful-travel substrate, and nothing else.
 *
 * WHAT THIS LEAF IS FOR. `ERRAND_CONSUMERS` has carried a row naming THIS FILE since SP-D
 * — `{consumer:'ambitious', purposeClass:'factional', module:'…/emigreErrand.js',
 * wave:'INT-3b', built:false}` — and `errandMint.js`'s own header names "INTERIOR's emigres"
 * among the five volumes that mint through it. Until this file existed both were a PROMISE.
 * This leaf makes them a MEASUREMENT, enforced in both directions by
 * `tests/lint/errandConsumerRegistry.walker.test.js`, which reds an unregistered minter AND
 * a registry row whose module does not mint. That conversion is the whole of this wave.
 *
 * ⚠ NOTHING IN `src/` CALLS THIS, AND THAT IS THE WAVE'S IDENTITY CLAIM RATHER THAN AN
 * OMISSION — the landed HB-2 precedent verbatim ("`writeHabits` exists and nothing in
 * `src/` calls it"), and `tests/domain/emigreErrand.test.js` A6 pins it by source walk.
 * Dormancy here is STRUCTURAL, not gated: with no caller, no seed, flag, preset or
 * lifecycle path can reach this module at all. That is a stronger claim than a dormancy
 * fence and a weaker capability, and it is exactly what a seam waiting for its trigger
 * should be. The producer — the contest-loss trigger — is INT-3b-ii's, and it cannot land
 * until the chair signs a departure share and a per-pair cap (OQ §42/§43).
 *
 * ⚠ THIS LEAF MINTS NO LEDGER ROW, AND IT MAY NOT. `normalizeErrand`
 * (`envoyErrandRecords.js`) refuses any row without a valid peace `offer`, a matching
 * `acceptance` and a departure `snapshot`, with an `id` derived from the offer and a
 * `purpose` inside `PURPOSE_SET` — so the design volume's "NO NEW LEDGER — SP-1 errands"
 * sentence is REFUTED at this base: an exile is not suing for peace and no émigré record
 * can be persisted into `worldState.envoyErrands`. The landed precedent is GR-2's
 * `pactTransportFor`, one volume over: MINTING THROUGH THE SPINE MEANS PRICING A JOURNEY
 * AND VALIDATING A CLASS, NEVER WRITING A ROW. Where an émigré record eventually lives is
 * a persistence-shape decision, owner-gated by name, open as Q-TC12-1 — and this leaf is
 * built so that leaving it open costs nothing, because it persists nothing at all.
 *
 * ⚠ THE PURPOSE IS FREE-FORM AND `ENVOY_PURPOSES` IS UNTOUCHED. `'emigre_flight'` is spelled
 * exactly as GR-2 spells `'pact_proposal'` — a purpose that is deliberately NOT a member of
 * that closed two-word vocabulary. Widening it from the interior would be the cross-program
 * write the estate forbids; the generalization rides `ENVOY_PURPOSE_CLASSES` instead, which
 * is what the class cargo below is for.
 *
 * ⚠ THE CLASS RIDES AS A QUOTED LITERAL, NEVER AS A NAMED CONSTANT (HZ-LITERALCLASS). SP-D's
 * one-reader law flags any object-literal or binding element that IS `purposeClass` renamed
 * TO AN IDENTIFIER, so `purposeClass: EMIGRE_CLASS` is an offender while
 * `purposeClass: 'factional'` is clean — measured, not assumed. This module therefore defines
 * no constant for its own class, and A8 pins that from the inside.
 *
 * ⚠ IT DOES NOT COMPUTE THE TICKS. The caller's `departTick`/`arrivalTick` are forwarded
 * UNCHANGED into a one-leg injected plan. Arithmetic on a leg clock is what
 * `tests/lint/namedPersonTransitTotality.walker.test.js`'s bypass detectors exist to catch,
 * and a leaf that priced its own journey would be claiming a speed law it does not own — an
 * exile and an embassy cannot be made to travel at different speeds, because there is no
 * second place to say how fast anyone walks. The transit owner prices; this leaf forwards.
 * That is also why this module authors ZERO numbers of any kind (A7): it spends nothing the
 * chair has not signed, so it lands with no value signature at all.
 *
 * ⚠ IT IMPORTS EXACTLY ONE MODULE, AND A SECOND IMPORT IS A STOP RATHER THAN A BUDGET.
 * `errandMint.js` is `kind:'substrate'` in the coupling walker's ARGUED_UNLAYERED roster and
 * therefore carries no layer, and `scanCrossLayerPairs` skips any dependency with no layer —
 * so this INTERIOR-layered leaf produces ZERO cross-layer pairs, mints no
 * `couplingRegistryInterior.js`, buys no baseline entry, and moves neither exact ceiling.
 * Any LAYERED dependency added here mints the volume registry leaf, the composing head's
 * import/spread/re-export, the exact-list pin and a baseline row, and changes this wave's
 * shape entirely.
 *
 * K3 (NOBODY IS EVER CURRENT): the reach is the mint head alone. It cannot hand back a
 * settlement's real strength, stock or pressure.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/emigreErrand.test.js,
 *   tests/lint/errandConsumerRegistry.walker.test.js,
 *   tests/lint/couplingInclusion.walker.test.js
 */
import { mintErrandSpine } from './errandMint.js';

/**
 * Price one defeated claimant's flight from his own seat to the town that will host him.
 *
 * The mint answers the two questions that must be answered before any errand exists — is
 * this journey lawfully priced, and is this business a kind of business the estate has a
 * word for — and this leaf narrows its four-part answer to the shape a caller needs:
 *
 *   `ok`      the mint accepted the journey and the class cargo
 *   `lit`     the spine really ran (`reason === 'spine'`), never `ok` — a dark world
 *             answers `ok:true` with no fields at all, so reading `ok` as "lit" would
 *             report a lit spine on a world that has none
 *   `reason`  the mint's own closed word: `spine`, `dark`, or a refusal
 *   `plan`    the normalized route, or `null` when the roads refused it
 *
 * THE THREE TRANSITIONS, and the flag moves only the middle one:
 *
 *   lit + priceable    → `{ok:true,  lit:true,  reason:'spine',              plan}`
 *   dark + priceable   → `{ok:true,  lit:false, reason:'dark',               plan}`
 *   unpriceable, EITHER→ `{ok:false, lit:false, reason:'invalid_route_plan', plan:null}`
 *
 * The refusal is identical lit and dark because the head normalizes the plan FIRST and
 * unconditionally: the flag can change what an errand IS, never whether the roads are real.
 *
 * @param {{worldState: Record<string, unknown>, fromId: string, toId: string,
 *   departTick: number, arrivalTick: number}} input
 * @returns {{ok: boolean, lit: boolean, reason: string,
 *   plan: Record<string, unknown>|null}}
 */
export function emigreErrandFor({ worldState, fromId, toId, departTick, arrivalTick }) {
  const minted = mintErrandSpine({
    worldState,
    purpose: 'emigre_flight',
    purposeClass: 'factional',
    fromId,
    toId,
    journey: 'outbound',
    routePlan: {
      legs: [{ fromId, toId, departTick, arrivalTick, journey: 'outbound' }],
      expectedReturnTick: arrivalTick,
    },
  });
  return {
    ok: minted.ok,
    lit: minted.reason === 'spine',
    reason: minted.reason,
    plan: minted.plan,
  };
}
