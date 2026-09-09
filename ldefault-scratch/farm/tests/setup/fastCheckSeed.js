/**
 * tests/setup/fastCheckSeed.js — the committed fast-check seed (test-gate-honesty-2).
 *
 * The property-test layer was the gate's ONLY nondeterministic component: ~38
 * `fc.assert` calls across ~11 suites ran UNSEEDED (no `fc.configureGlobal`
 * anywhere), so every run drew a fresh random seed. A property that holds 99.9%
 * of the time then fails on ~1 run in 1000 with a DIFFERENT counterexample each
 * time — a flake nobody can reproduce, because the failing seed scrolled past in
 * CI and the next local run drew a new one. That is the opposite of a gate: a gate
 * must be reproducible.
 *
 * This wires ONE global seed for the whole property layer via Vitest `setupFiles`
 * (vite.config.js `test.setupFiles`), so every `fc.assert`/`fc.check` in every suite
 * runs the SAME deterministic case sequence on every machine. fast-check's default
 * reporter prints `{ seed: <N>, path: <M>, … }` in its failure message, so a red is
 * now REPRODUCIBLE: `fc.assert(prop, { seed: <N>, path: <M> })` (or bumping the seed
 * below to that value) replays the exact counterexample. Only the seed is pinned —
 * numRuns and every other parameter keep fast-check's library defaults, so run counts
 * and timing are unchanged.
 *
 * ── SEED ROTATION POLICY (deliberate, per wave) ─────────────────────────────────
 * A fixed seed trades broad exploration for reproducibility: it always runs the
 * SAME cases, so it cannot discover a counterexample outside that fixed path. That
 * is the correct trade for a GATE (deterministic pass/fail), but coverage breadth is
 * then a maintenance act, not an accident. ROTATE this seed DELIBERATELY — once per
 * fix/verification wave, or whenever a property's arbitraries change — by bumping the
 * value below in its OWN commit and running the full property battery under the new
 * seed before landing. A rotation that reds a property revealed either a real latent
 * bug (fix it) or an over-strong property (weaken it) — never silence it by reverting
 * the seed. Do NOT rotate inside an unrelated change: an incidental seed churn hides
 * exactly the reproducibility this file exists to provide.
 *
 * Committed 2026-07-16 (W-R2-GUARDS). Seed derived from that date for legibility.
 */
import fc from 'fast-check';

/** The committed global property-test seed. Rotate deliberately (policy above). */
export const FAST_CHECK_SEED = 20260716;

fc.configureGlobal({ seed: FAST_CHECK_SEED });
