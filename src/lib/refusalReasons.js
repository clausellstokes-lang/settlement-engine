/**
 * lib/refusalReasons.js — THE REGISTER OF EVERY REASON A GATE MAY REFUSE.
 *
 * ⛔ NO GATE REFUSES SILENTLY (owner ruling, ODQ §934.24(c)). The 2026-09-19 browser
 * walk clicked 'Fork this sample' on the Create page and got NOTHING: no settlement,
 * no toast, no role=alert, not one console line. The cause was not one careless
 * handler. It was a CLASS: the generation lane refuses by returning `null`, four
 * separate surfaces had each hand-rolled their own pre-flight for the same cap, and
 * every one of them answered a refusal by navigating somewhere — including, on
 * /create, to the page the reader was already looking at.
 *
 *   src/components/generate/FoundingWorlds.jsx   onNavigate('generate')  (a no-op there)
 *   src/components/home/LandingArtifacts.jsx     onNavigate('generate')
 *   src/components/howto/ForgeExactDemo.jsx      navigate('generate')
 *   src/components/GenerateWizard.jsx            onSignIn()              (the least bad)
 *
 * ⭐ THE CURE IS A NAMED REASON THAT TRAVELS. A gate no longer just returns null: it
 * records WHICH of the reasons below refused, with the facts the sentence needs, on
 * the store (`lastRefusal`). Any surface can then render it, and they all render it
 * the same way — components/primitives/RefusalNotice.jsx, whose copy is the ONE
 * `refusals.*` block in copy/en.js.
 *
 * ⛔ THIS FILE IS THE JOIN KEY, AND IT IS WHY THE WALKER CAN BE TOTAL.
 * tests/lint/refusalNoticeCoverage.walker.test.js enumerates these ids and proves,
 * for every one of them: the copy dictionary answers it (a rubric, and a body or a
 * resolving bodyRef), SOMETHING IN src/ RAISES it, and something in src/ RENDERS the
 * notice. A reason added here without copy reds; copy without a reason reds; a reason
 * nothing raises reds as dead vocabulary. That totality is only possible because the
 * ids live in one place rather than as string literals scattered through the tree.
 *
 * ZERO IMPORTS, on purpose: both the store lane (lazy) and the UI primitives read it,
 * and neither should drag the other's graph in behind it.
 */

/**
 * Every reason a gate may refuse, as stable ids.
 *
 * ⚠ THE SPELLINGS ARE THE COPY KEYS. `refusals.<id>.rubric` / `.body` in copy/en.js,
 * so renaming one here is renaming it there in the same edit — the walker holds the
 * two together rather than trusting anyone to remember.
 */
export const REFUSAL_REASONS = Object.freeze({
  /** The anonymous daily generation allowance is spent (lib/anonGenCounter.js). */
  DAILY_CAP: 'dailyCap',
  /** The size asked for is above this account's ceiling — refused BEFORE the engine runs. */
  TIER: 'tier',
  /**
   * A 'random'/'custom' sentinel RESOLVED above the ceiling, so the finished settlement
   * was discarded rather than committed. A different fact from TIER and it needs its own
   * sentence: the reader picked nothing wrong, the roll came out too big.
   */
  RESOLVED_TIER: 'resolvedTier',
  /** The engine threw. */
  GENERATION_FAILED: 'generationFailed',
  /** The throw was a chunk of a previous build — this tab outlived a deploy. */
  STALE_BUILD: 'staleBuild',
  /**
   * A STAFF-ONLY destination reached by an account that is not staff (ODQ
   * §934.28). Not a paid gate and not an upgrade path — no tier buys it, so its
   * sentence offers no door; it simply says the page is not this account's.
   *
   * ⛔ IT EXISTS BECAUSE THE GUARD USED TO ANSWER BY NAVIGATING. The 'elevated'
   * route guard bounced a non-staff visitor at /admin to /create with nothing
   * said — the exact shape this register was built against, three of whose four
   * original offenders "answered a refusal by navigating". The guard no longer
   * moves anyone; the route says why, where the reader is.
   */
  STAFF_ONLY: 'staffOnly',
});

/** The ids, as an array, for walkers and for exhaustiveness checks. */
export const REFUSAL_REASON_IDS = Object.freeze(Object.values(REFUSAL_REASONS));

/**
 * Is this a registered reason?
 * @param {unknown} id
 * @returns {boolean}
 */
export function isRefusalReason(id) {
  // The register's values are literal types, so `includes` would only accept one of
  // them — which is the opposite of this function's job: it is asked about strings
  // from OUTSIDE the register (a stale record, a hand-rolled shape) and must be able
  // to answer no.
  return typeof id === 'string'
    && /** @type {readonly string[]} */ (REFUSAL_REASON_IDS).includes(id);
}

/**
 * Build a refusal record for the store.
 *
 * `vars` are interpolated into the reason's sentence, so they carry FACTS (a size
 * label, a ceiling) and never an id, a name or anything a reader did not already see
 * on the surface they clicked.
 *
 * @param {string} reason one of REFUSAL_REASONS
 * @param {Record<string, string|number>|null} [vars]
 * @returns {{ reason: string, vars: Record<string, string|number>|null }}
 */
export function refusalOf(reason, vars = null) {
  return { reason, vars: vars && Object.keys(vars).length ? vars : null };
}
