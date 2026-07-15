/**
 * domain/display/guidanceRegistry.js — THE GUIDANCE REGISTRY (W-GUIDE-1).
 *
 * One inventory, one budget, one walker — the tierFacts pattern generalized to
 * the teaching seams. Every whisper the product shows through a guidance organ
 * (callout, coach step, inline hint, empty-state invitation) is declared here
 * ONCE, so a walker can prove each id resolves to copy + a mounted surface, the
 * budget can hold ONE whisper per surface, and future waves cannot ship a
 * mechanism without its registered whisper (the criterion clause, §2).
 *
 * FIRST-PAINT LAW (the registryProse idiom): this module is a ZERO-IMPORT LAZY
 * LEAF. It imports nothing (no store, no copy, no theme, no localStorage) so it
 * can never drag anything into the eager first-paint closure, and it is imported
 * ONLY from lazy guidance surfaces (and tests). `body`/`glossaryRef` are copy
 * KEYS resolved by the consumer via t() — never resolved here — so the copy
 * registry stays off this leaf.
 *
 * SENTINEL NON-VACUITY: the dist guard in tests/build/vendorPdfLazy.test.js
 * asserts this module is ABSENT from the entry closure. A standalone dead
 * `export const SENTINEL` would be tree-shaken out of the app bundle entirely
 * (the fate of AFFORDANCE_MANIFEST_LAZY_SENTINEL), making that guard vacuous —
 * "absent from entry" is trivially true for a string that appears in NO chunk.
 * So the sentinel is embedded as a PROPERTY of the retained frozen GUIDANCE_REGISTRY
 * object that lazy consumers read at runtime; object-literal properties are not
 * DCE'd once the object is retained, so the string lands in the lazy chunk. The
 * test additionally asserts PRESENCE in some chunk (upgrading the guard from
 * absence-only to a real non-vacuity check).
 *
 * @enforced-by tests/domain/guidanceRegistry.walker.test.js (inventory walker,
 *   census both directions, budget pin, firsts-backfill pin, register guard)
 * @enforced-by tests/build/vendorPdfLazy.test.js (lazy-leaf closure sentinel)
 */

export const GUIDANCE_REGISTRY_LAZY_SENTINEL = 'GUIDANCE_REGISTRY_LAZY_SENTINEL';

/** Lanes — inferred from surface + firsts, never asked (§3). */
export const GUIDANCE_LANES = Object.freeze(['tourist', 'keeper', 'sovereign', 'builder', 'reader']);

/** Registers — the two-register voice law (§4). 'note' is the Surveyor's-notes
 *  persona (W-GUIDE-2 supplies its content module); 'plain' is the house voice
 *  (software about software) and NEVER borrows the persona. W-GUIDE-1 ships all
 *  copy in the 'plain' register and the registry SHAPE ready for the notes. */
export const GUIDANCE_REGISTERS = Object.freeze(['note', 'plain']);

/** Budget classes — a coarse tag for the priority queue's tie-breaks + future
 *  frequency caps. Teaching (first-run pedagogy) < wayfinding (what-next) <
 *  lifecycle (return-visit / state-change accents). */
export const GUIDANCE_BUDGET_CLASSES = Object.freeze(['teaching', 'wayfinding', 'lifecycle']);

/** The mounted surfaces a whisper may target. A surface is "mounted" when a real
 *  component hosts it; the walker cross-checks every whisper.surface against this
 *  set AND against a source scan proving a host component names the surface. Map
 *  surfaces are intentionally ABSENT here — the map pane is owned by a parallel
 *  wave; its guidance dispositions register in a later, map-coordinated pass. */
export const GUIDANCE_SURFACES = Object.freeze([
  'dossier',        // the generated-dossier top band (FirstDossierCallouts)
  'wizard-postgen', // the post-generate what's-next guide (WizardNextSteps)
  'home',           // the signed-in home hero (WelcomeBackCard)
  'config',         // inline config-field help (HelpPopover)
]);

/**
 * @typedef {Object} GuidanceTrigger
 * @property {string} [first] - the firsts-map milestone that GATES eligibility
 *   (e.g. 'first_generate'); the whisper is eligible only once the milestone is
 *   available. Absent ⇒ no firsts gate.
 * @property {(ctx: GuidanceContext) => boolean} [condition] - a PURE extra
 *   predicate over the render context (never reads the store/DOM directly).
 */

/**
 * @typedef {Object} GuidanceWhisper
 * @property {string}  id            — stable unique id (the dismissal key stem).
 * @property {string}  surface       — one of GUIDANCE_SURFACES.
 * @property {'tourist'|'keeper'|'sovereign'|'builder'|'reader'} lane
 * @property {'note'|'plain'} register
 * @property {GuidanceTrigger} trigger
 * @property {number}  priority      — higher wins the single per-surface slot.
 * @property {string}  body          — copy KEY (resolved by the consumer via t()).
 * @property {string|null} [glossaryRef] - a Compendium anchor the lifeline links to.
 * @property {'teaching'|'wayfinding'|'lifecycle'} budgetClass
 * @property {boolean} [newbornOnly] - when true, suppressed for veterans (the
 *   firsts-backfill law: a veteran sees no newborn hints). Default true for the
 *   'teaching' class, false otherwise.
 * @property {string}  component     — the host component that mounts this whisper
 *   (the source-census cross-check).
 */

/** @param {GuidanceWhisper} w */
const whisper = (w) => Object.freeze({
  glossaryRef: null,
  newbornOnly: w.budgetClass === 'teaching',
  ...w,
  trigger: Object.freeze({ ...w.trigger }),
});

/**
 * THE WHISPERS. Seeded with W-GUIDE-1's re-registered keepers + the retired
 * PostGenCoach's preserved steps + the absorbed HelpPopover compendium hints.
 * @type {ReadonlyArray<GuidanceWhisper>}
 */
export const GUIDANCE_WHISPERS = Object.freeze([
  // ── Dossier top band — the first-dossier teaching moment (FirstDossierCallouts,
  //    re-registered). Rendered as ONE band (three stacked teaching points); it
  //    is a single per-surface whisper so the budget holds. ──────────────────
  whisper({
    id: 'dossier_first_callouts',
    surface: 'dossier',
    lane: 'reader',
    register: 'plain',
    trigger: {
      first: 'first_generate',
      condition: (ctx) => ctx.data.tier !== 'anon' && ctx.data.savedCount === 0,
    },
    priority: 60,
    body: 'guidance.dossierFirstCallouts',
    budgetClass: 'teaching',
    component: 'FirstDossierCallouts',
  }),

  // ── The retired PostGenCoach's three steps, PRESERVED as registered
  //    first_generate whispers (JUDGMENT, §5): the floating fixed dialog is
  //    gone; its copy survives in the inventory + guidance.postGenCoach.* and
  //    is hosted by the dossier-top grammar (FirstDossierCallouts). Lower
  //    priority than the callouts band, so the single dossier slot is not
  //    contended for and no new chrome is introduced. ─────────────────────────
  whisper({
    id: 'postgen_read_dossier',
    surface: 'dossier',
    lane: 'reader',
    register: 'plain',
    trigger: { first: 'first_generate' },
    priority: 30,
    body: 'guidance.postGenCoach.read',
    budgetClass: 'teaching',
    component: 'FirstDossierCallouts',
  }),
  whisper({
    id: 'postgen_watch_simulated',
    surface: 'dossier',
    lane: 'reader',
    register: 'plain',
    trigger: { first: 'first_generate' },
    priority: 29,
    body: 'guidance.postGenCoach.simulated',
    budgetClass: 'teaching',
    component: 'FirstDossierCallouts',
  }),
  whisper({
    id: 'postgen_save_it',
    surface: 'dossier',
    lane: 'reader',
    register: 'plain',
    trigger: { first: 'first_generate' },
    priority: 28,
    body: 'guidance.postGenCoach.save',
    budgetClass: 'teaching',
    component: 'FirstDossierCallouts',
  }),

  // ── Post-generate what's-next (WizardNextSteps, re-registered inventory). ──
  whisper({
    id: 'wizard_next_steps',
    surface: 'wizard-postgen',
    lane: 'builder',
    register: 'plain',
    trigger: {
      first: 'first_generate',
      condition: (ctx) => !!ctx.data.hasSettlement,
    },
    priority: 50,
    newbornOnly: false,
    body: 'guidance.wizardNextSteps',
    budgetClass: 'wayfinding',
    component: 'WizardNextSteps',
  }),

  // ── Return-visit resume (WelcomeBackCard, re-registered inventory). ───────
  whisper({
    id: 'home_welcome_back',
    surface: 'home',
    lane: 'keeper',
    register: 'plain',
    trigger: {
      condition: (ctx) => ctx.data.tier !== 'anon' && !!ctx.data.isReturn && !!ctx.data.hasLastSettlement,
    },
    priority: 40,
    newbornOnly: false,
    body: 'guidance.welcomeBack',
    budgetClass: 'lifecycle',
    component: 'WelcomeBackCard',
  }),

  // ── The absorbed HelpPopover compendium hints (§5): the inline COMPENDIUM_HINTS
  //    move into the registry with glossaryRefs. One whisper per config topic;
  //    the host (HelpPopover) selects by topic, so these share the 'config'
  //    surface but are addressed by id (topic), not by the per-surface budget. ──
  whisper({
    id: 'config_trade_route',
    surface: 'config', lane: 'builder', register: 'plain',
    trigger: {}, priority: 10, newbornOnly: false,
    body: 'guidance.compendium.tradeRoute.body', glossaryRef: 'trade-routes',
    budgetClass: 'wayfinding', component: 'HelpPopover',
  }),
  whisper({
    id: 'config_terrain',
    surface: 'config', lane: 'builder', register: 'plain',
    trigger: {}, priority: 10, newbornOnly: false,
    body: 'guidance.compendium.terrain.body', glossaryRef: 'terrain',
    budgetClass: 'wayfinding', component: 'HelpPopover',
  }),
  whisper({
    id: 'config_culture',
    surface: 'config', lane: 'builder', register: 'plain',
    trigger: {}, priority: 10, newbornOnly: false,
    body: 'guidance.compendium.culture.body', glossaryRef: 'cultures',
    budgetClass: 'wayfinding', component: 'HelpPopover',
  }),
  whisper({
    id: 'config_monster_threat',
    surface: 'config', lane: 'builder', register: 'plain',
    trigger: {}, priority: 10, newbornOnly: false,
    body: 'guidance.compendium.monsterThreat.body', glossaryRef: 'threat',
    budgetClass: 'wayfinding', component: 'HelpPopover',
  }),
  whisper({
    id: 'config_magic_level',
    surface: 'config', lane: 'builder', register: 'plain',
    trigger: {}, priority: 10, newbornOnly: false,
    body: 'guidance.compendium.magicLevel.body', glossaryRef: 'magic',
    budgetClass: 'wayfinding', component: 'HelpPopover',
  }),
  whisper({
    id: 'config_tier',
    surface: 'config', lane: 'builder', register: 'plain',
    trigger: {}, priority: 10, newbornOnly: false,
    body: 'guidance.compendium.tier.body', glossaryRef: 'tiers',
    budgetClass: 'wayfinding', component: 'HelpPopover',
  }),
]);

/**
 * THE LEGACY LEDGER (§2): the instructional-UI components from the census (§1)
 * NOT yet routed through the registry. Shrink-only — as a disposition lands, its
 * component moves off this list (registered) and the ceiling is lowered with it.
 * The walker asserts (a) length ≤ LEGACY_GUIDANCE_CEILING and (b) every source
 * instructional component is registered OR on this list (both directions).
 *
 * Seeded from the §1 census MINUS the components W-GUIDE-1 registers
 * (FirstDossierCallouts, WizardNextSteps, WelcomeBackCard, HelpPopover) and MINUS
 * the retired PostGenCoach (deleted, not legacy). Map-pane instructional
 * components stay here until the map-coordinated pass.
 */
export const LEGACY_GUIDANCE_COMPONENTS = Object.freeze([
  'PipelineReveal',
  'StaleNarrativeModal',
  'WorldMapTour',
  'CampaignEmptyState',
  'SampleDashboard',
  'HowToUse',
  'DesktopOnlyGate',
  'RealmMobileGate',
]);

/** The shrink-only ceiling for LEGACY_GUIDANCE_COMPONENTS (clamp-ratchet idiom). */
export const LEGACY_GUIDANCE_CEILING = LEGACY_GUIDANCE_COMPONENTS.length;

/**
 * The retained registry object. The sentinel rides HERE (a live property of a
 * runtime-read frozen object) so it survives tree-shaking into the lazy chunk —
 * the non-vacuity fix. Consumers read `.whispers` / `.surfaces`, retaining the
 * whole object (and thus `.sentinel`).
 */
export const GUIDANCE_REGISTRY = Object.freeze({
  sentinel: GUIDANCE_REGISTRY_LAZY_SENTINEL,
  whispers: GUIDANCE_WHISPERS,
  surfaces: GUIDANCE_SURFACES,
});

/**
 * @typedef {Object} GuidanceContext
 * @property {(id: string) => boolean} isDismissed — whether the whisper's
 *   unified dismissal (sf:guidance:*) is set for this device.
 * @property {(firstKey: string) => boolean} firstAvailable — whether the firsts
 *   milestone has been reached (from the sf_features_used map, derive-backfilled).
 * @property {boolean} isNewborn — true when the user is NOT a veteran (no saves);
 *   gates newbornOnly whispers.
 * @property {Record<string, unknown>} data - surface-specific signals for condition().
 */

/** Whispers targeting a surface, highest-priority first. @param {string} surface */
export function whispersForSurface(surface) {
  return GUIDANCE_WHISPERS
    .filter((w) => w.surface === surface)
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Is a whisper eligible to render, given the context? Pure — no side effects.
 * @param {GuidanceWhisper} w
 * @param {GuidanceContext} ctx
 */
export function isWhisperEligible(w, ctx) {
  if (ctx.isDismissed(w.id)) return false;
  if (w.newbornOnly && !ctx.isNewborn) return false;
  if (w.trigger.first && !ctx.firstAvailable(w.trigger.first)) return false;
  if (w.trigger.condition && !w.trigger.condition(ctx)) return false;
  return true;
}

/**
 * THE BUDGET: select the ONE whisper that renders on a surface (the highest-
 * priority eligible one), or null. This is the pressureSuggestions cap-and-dedupe
 * walker generalized to a per-surface single slot — a second whisper can never
 * render (the budget pin).
 * @param {string} surface
 * @param {GuidanceContext} ctx
 * @returns {GuidanceWhisper|null}
 */
export function selectWhisper(surface, ctx) {
  for (const w of whispersForSurface(surface)) {
    if (isWhisperEligible(w, ctx)) return w;
  }
  return null;
}

/**
 * Derive whether a guidance FIRST milestone is available from plain store
 * signals - the "derive rather than flag" path (§3). All of W-GUIDE-1's live
 * whispers gate on DERIVABLE firsts, so the firsts logic lives HERE (a pure lazy
 * leaf, ZERO eager bytes) rather than growing the eager sf_features_used map and
 * blowing the first-paint budget. A future wave that needs a NON-derivable first
 * (first_treaty_strain, first_docket, ...) flags it via the existing
 * markFeatureUsed and extends this switch alongside its whisper (the criterion
 * clause). Veterans (saves exist) never re-see a derivable milestone.
 * @param {string} key
 * @param {{ hasSettlement?: boolean, savedCount?: number }} signals
 * @returns {boolean}
 */
export function deriveGuidanceFirst(key, signals) {
  const savedCount = signals.savedCount || 0;
  switch (key) {
    case 'first_generate': return !!signals.hasSettlement || savedCount > 0;
    case 'first_save': return savedCount > 0;
    default: return false;
  }
}

/**
 * Whether the user is a NEWBORN (no library yet) rather than a veteran - gates
 * every newbornOnly whisper so a returning user with saved work is never shown
 * first-run teaching (the firsts-backfill law, PINNED).
 * @param {number} savedCount
 * @returns {boolean}
 */
export function deriveGuidanceNewborn(savedCount) {
  return (savedCount || 0) === 0;
}

/** A whisper by id (the topic-addressed path, e.g. HelpPopover). @param {string} id */
export function whisperById(id) {
  return GUIDANCE_WHISPERS.find((w) => w.id === id) || null;
}

/** Every registered whisper id (walker helper). */
export function allWhisperIds() {
  return GUIDANCE_WHISPERS.map((w) => w.id);
}

/** The set of host components the registry claims (walker census helper). */
export function registeredComponents() {
  return [...new Set(GUIDANCE_WHISPERS.map((w) => w.component))];
}
