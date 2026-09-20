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
   * The size asked for is BELOW this account's FLOOR (§934.34: a thorpe requires an
   * account). A different fact from TIER and it needs its own sentence, because TIER's
   * says the opposite: `isTierAllowed` refuses a RANGE, and for the one tier with a
   * floor above rung 0 the ceiling sentence read "A Thorpe is past what this account
   * forges; it reaches up to a Town" — a refusal that told the reader their thorpe was
   * too big. Raised wherever the refused rank is under the floor, on the picker path
   * and on the resolved-roll path alike.
   */
  TIER_TOO_SMALL: 'tierTooSmall',
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
  /**
   * ⛔ THE PRE-GENERATION OPTIONS BELONG TO AN ACCOUNT (the owner, §934.34). Raised by
   * the wizard beside its own locked controls, not by a gate the reader tripped: the
   * options are DRAWN and disabled — nothing is hidden — and this is the reason written
   * next to them. Like the Realm's, it is a property of the surface and carries no vars
   * of its own; its sentence interpolates the shared `{sizes}` default.
   */
  PRE_GEN_LOCKED: 'preGenLocked',
  /**
   * ⛔ THE REALM IS NOT A PHONE SURFACE (the owner, ODQ §934.26: "No realm view for
   * phone but it can be viewed on a tablet").
   *
   * The only reason here raised by a ROUTE rather than by a gate in the generation
   * lane, and it belongs in this register for the same reason the others do: the
   * alternative was a blank page or a silent redirect, which is the class this file
   * exists against wearing a different coat. It carries no `vars`: the sentence states
   * a property of the surface, not of the reader's request.
   */
  REALM_NEEDS_TABLET: 'realmNeedsTablet',
  /**
   * ⛔ THE LANDING'S "NARRATE" MOVED THE READER AND SAID NOTHING (REVIEW-P F4).
   * The §03 voice section offers an ENABLED "Narrate" under a "5 credits" plate;
   * clicking it from a clean anonymous context navigated to /create with no
   * settlement and no notice — the reader asked for narration and was silently
   * moved off the page, which is this register's founding shape wearing a CTA's
   * coat. The Narrative Layer READS a town (domain/aiGrounding.js: it never
   * invents facts), so with no town on the store there is nothing for it to read.
   * Raised by the SURFACE, like the Realm's and the wizard's locked options: it
   * states a property of the click, not of a gate in the generation lane.
   */
  NARRATE_NEEDS_TOWN: 'narrateNeedsTown',
  /**
   * ⛔ THE GUARD KEPT THE DESTINATION AND DROPPED THE REASON (REVIEW-P F10).
   * App's auth guard sends an anonymous visitor at a guarded route to
   * `/signin?next=<path>` — a door, not a refusal, and that redirect stays. But
   * the sign-in page led with the generic "Welcome back", so a reader who had
   * clicked /account was given no account of why they were suddenly at a form.
   * The page reads `next`, and when it names a route whose guard is 'auth' this
   * reason names the page that is waiting. Its `{page}` var is the route's own
   * label (lib/routes.js routeLabelForView), never a path and never a raw view id.
   */
  AUTH_REQUIRED: 'authRequired',
  /**
   * ⛔ A DEAD LINK LOOKED LIKE IT WORKED (REVIEW-P F11). lib/routes.js has always
   * returned `notFound: true` for an unknown path, and the canonical-URL upgrade
   * rewrote the address to /create and discarded it — so a mistyped or rotted link
   * landed a visitor on the Create page with the door closed behind them and
   * nothing said. Raised by the ROUTE, like the Realm's; its `{path}` var is the
   * address the reader actually asked for, which is the only fact they can use.
   */
  PAGE_NOT_FOUND: 'pageNotFound',
});

/** The ids, as an array, for walkers and for exhaustiveness checks. */
export const REFUSAL_REASON_IDS = Object.freeze(Object.values(REFUSAL_REASONS));

/**
 * ⛔ THE MIRROR-IMAGE DEFECT: ONE RECORD, RENDERED WHERE NOBODY CLICKED (REVIEW-P F12).
 *
 * The law is that a refusal is said WHERE THE READER CLICKED. `lastRefusal` is ONE
 * record on the store and every surface renders it, so on a page carrying two forging
 * controls the reader was told twice: the 2026-09-20 walk forked the Black Crag city
 * card on /create and measured TWO `role="alert"` nodes with byte-identical copy — one
 * above the hero CTA, one above the Founding Worlds strip. An assistive reader hears
 * the same sentence announced twice for one click, and the copy points at a control
 * the reader did not touch.
 *
 * ⚠ THE WALK SAW THE SMALLEST INSTANCE. Reading every store-fed mount: the /create
 * CONFIG stage pairs GenerateWizard with LayeredConfigurationPanel's SeedField, and
 * /home on desktop carries THREE (the hero, §02's forge-this-town, the commons strip).
 *
 * ⭐ SO THE RECORD NAMES WHERE IT WAS EARNED. A surface asks with its own key
 * (`generateSettlement(seed, { at })`, beside the `intent` that names who is asking),
 * the gate stamps it on the record, and a surface renders only what it raised.
 *
 * ⛔ AN UNKEYED RECORD IS RENDERED BY EVERYONE, DELIBERATELY. That is the behaviour
 * every surface had before this existed, so a raiser that does not key itself — a
 * route-raised reason, a hand-built record in a test, a caller written before this
 * field — loses nothing and says its piece exactly as it did. Keying is how a surface
 * OPTS IN to being the only one that speaks, never a condition of being heard.
 *
 * The keys are registered rather than spelled at the call sites for the same reason
 * the reason ids are: a walker can then prove each one is both passed and compared,
 * and a typo cannot silently produce a surface that never speaks.
 */
export const REFUSAL_SURFACES = Object.freeze({
  /** The landing + create-empty-state hero CTA (components/HomeHero.jsx). */
  HOME_HERO: 'homeHero',
  /** The curated sample strip (components/generate/FoundingWorlds.jsx). */
  FOUNDING_WORLDS: 'foundingWorlds',
  /** §02's "Forge this exact town" (components/home/LandingArtifacts.jsx). */
  LANDING_ARTIFACTS: 'landingArtifacts',
  /** The wizard's own Generate + the dossier's Regenerate (components/GenerateWizard.jsx). */
  GENERATE_WIZARD: 'generateWizard',
  /** The exact-seed forge (components/generate/LayeredConfigurationPanel.jsx). */
  SEED_FIELD: 'seedField',
});

/**
 * Is this record this surface's to say? True for a record raised HERE, and true for an
 * unkeyed record, which every surface renders exactly as it always has.
 *
 * @param {{ reason: string, at?: string|null }|null|undefined} refusal the store's record
 * @param {string} surface one of REFUSAL_SURFACES
 * @returns {boolean}
 */
export function raisedHere(refusal, surface) {
  return !!refusal && (!refusal.at || refusal.at === surface);
}

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
 * `at` is not a fact about the refusal, it is a fact about the CLICK: which surface
 * asked. It is compared, never rendered, so it can never reach a sentence — and it is
 * optional, because an unkeyed record must go on behaving exactly as records did
 * before the field existed (see REFUSAL_SURFACES).
 *
 * @param {string} reason one of REFUSAL_REASONS
 * @param {Record<string, string|number>|null} [vars]
 * @param {string|null} [at] one of REFUSAL_SURFACES — the surface that asked
 * @returns {{ reason: string, vars: Record<string, string|number>|null, at: string|null }}
 */
export function refusalOf(reason, vars = null, at = null) {
  return { reason, vars: vars && Object.keys(vars).length ? vars : null, at: at || null };
}
