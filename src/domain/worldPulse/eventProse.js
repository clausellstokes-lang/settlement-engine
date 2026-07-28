/**
 * domain/worldPulse/eventProse.js — THE GENERATION-TIME EVENT-PROSE VARIANT POOLS.
 *
 * The content-volume program's generation-time slice (task #27, the park wave). Every
 * corpus here feeds a GENERATION-TIME surface whose picked string PERSISTS into save /
 * golden data (wizardNews entries, settlement.calamityHistory stamps, the warReasons /
 * peaceReasons spatial ledgers, pulseHistory impactDigests). Growing these pools shifts
 * same-seed picks ⇒ this is a golden-bound, park-red surface — the goldens regen once.
 *
 * ── THE LAWS (enforced by tests/domain/eventProse.test.js) ──────────────────────────
 *  1. PURE SELECTION. `pickLine` is a pure FNV-1a hash of a STABLE seed string — no rng,
 *     no Date, no rng-stream perturbation. Selection consumes zero draws, so NO
 *     structural/numeric field of the world can move; only the prose text varies. The
 *     newsVoice.js FNV idiom, brought engine-side (the CONTENT-VT-2 "new mechanism" note).
 *  2. CANONICAL-AT-ZERO. A falsy seed selects index 0, keeping every seedless caller
 *     on the canonical telling. For pools that predate T5, index 0 preserves the
 *     original semantics while the declared punctuation sweep retires its em dashes.
 *  3. FRAMING-NOT-SEMANTICS. Variants vary PHRASING only. Interpolated semantic tokens
 *     (counts, cause, provenance, names, numbers) are threaded through unchanged, so the
 *     receipt's meaning — the same reason, the same cause — never drifts.
 *  4. PORTABLE SPECIFICITY. Catalog-anchored generics only ("the granaries", "the looms",
 *     "the harbour") — NEVER a canon proper noun. "Just enough generic to drop into any
 *     campaign." (Interpolated settlement/mediator NAMES are the world's own, not ours.)
 *  5. CALAMITY BUCKET-NEUTRALITY (CONSTITUTIONAL). The engine never asserts a disaster
 *     KIND. No calamity variant may contain flood/fire/quake/earthquake/storm (as a
 *     substring); the joined calamity prose speaks the bucket ("calamity"). Variety here
 *     adds PHRASING, never disaster-kind vocabulary.
 *
 * Pure leaf: imports ONLY the roads prose data leaf (src/data/roadsProse.js — the
 * CONTENT-GT content-in-data rule), imported only by the lazy worldPulse sim kernels
 * (calamityKernel, warReasons, peaceReasons, hegemonyFear, upswingKernel,
 * resourceDynamicsKernel, settlementLifecycleKernel, realmVerbExecution, roadsKernel) ⇒ it
 * rides the lazy engine chunk, never the eager first-paint closure.
 */
import { ROADS_NEWS } from '../../data/roadsProse.js';

/**
 * FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date). Matches the
 * newsVoice.js idiom. @param {string} str @returns {number} */
export function fnv1a32(str) {
  let h = 0x811c9dc5;
  const s = String(str);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * @typedef {string | ((interp: Record<string, unknown>) => string)} ProseVariant
 * A pool entry: a fixed string, or a function that interpolates the semantic tokens.
 */

/**
 * Pick a phrasing variant deterministically from a pool. A FALSY seed ⇒ index 0 (the
 * canonical string), so seedless callers are byte-identical. A function entry is resolved
 * with `interp`. Pure.
 * @param {readonly ProseVariant[]} pool
 * @param {string | null | undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {string}
 */
export function pickLine(pool, seed, interp = {}) {
  if (!Array.isArray(pool) || pool.length === 0) return '';
  const idx = seed ? fnv1a32(seed) % pool.length : 0;
  const v = pool[idx];
  return typeof v === 'function' ? String(v(interp)) : String(v);
}

// ════════════════════════════════════════════════════════════════════════════════════
// NPC GOAL BEATS (C2-Q2). These two emitters used one fixed telling for every
// culmination and every context-driven change of ambition. The pools vary only
// the telling; names, goals, roles, personality anchors, and context receipts
// remain the same semantic facts. npcAgency seeds each cell from npc id + tick +
// cell, so no rng draw moves and the same beat always replays to the same words.
// ════════════════════════════════════════════════════════════════════════════════════

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const NPC_GOAL_NEWS = Object.freeze({
  culmination: {
    headline: [
      (x) => `${x.name} achieves a long ambition`, // canonical
      (x) => `${x.name}'s long design comes to fruition`,
      (x) => `${x.name} claims a long-sought prize`,
      (x) => `${x.name} brings a long ambition to its end`,
    ],
    summary: [
      (x) => `${x.name} has worked toward "${x.goal}" for a long while, and now seizes it.`, // canonical
      (x) => `After a long pursuit of "${x.goal}", ${x.name} has at last made it real.`,
      (x) => `${x.name}'s patient work toward "${x.goal}" has paid off; the prize is now in hand.`,
      (x) => `The long design to "${x.goal}" has borne fruit for ${x.name}.`,
    ],
    progressReason: [
      (x) => `${x.name}'s long-term goal progress reached its culmination.`, // canonical
      (x) => `${x.name}'s long design had ripened into action.`,
      (x) => `The accumulated work toward "${x.goal}" could no longer be deferred.`,
      (x) => `Patient effort finally carried ${x.name}'s ambition across the threshold.`,
    ],
    roleReason: [
      (x) => `Role: ${x.role}; goal: ${x.goal}.`, // canonical
      (x) => `${x.name} pursued "${x.goal}" from the position of ${x.role}.`,
      (x) => `The ${x.role} path gave ${x.name} the means to pursue "${x.goal}".`,
      (x) => `For ${x.name}, "${x.goal}" had become the defining aim of the ${x.role} role.`,
    ],
    conditionDescription: [
      (x) => `${x.name} has consolidated power, shifting the local balance.`, // canonical
      (x) => `${x.name}'s success has rearranged the local balance of power.`,
      (x) => `${x.name} now commands greater standing, and the local balance has shifted around that fact.`,
      (x) => `The old balance no longer holds after ${x.name}'s ascent.`,
    ],
    causeReason: [
      'A long ambition reached fruition.', // canonical
      'Years of effort brought a long design to its end.',
      'A sustained ambition finally became fact.',
      'The balance shifted when patient work paid off.',
    ],
  },
  rebranch: {
    headline: [
      (x) => `${x.name} changes ambitions`, // canonical
      (x) => `${x.name} takes up a new ambition`,
      (x) => `${x.name} redirects a long design`,
      (x) => `${x.name}'s aims turn with the times`,
    ],
    summary: [
      (x) => `${x.name}'s goals shift because the settlement context changed.`, // canonical
      (x) => `A changed settlement has forced ${x.name} to reconsider what comes next.`,
      (x) => `${x.name} keeps the same character, but new circumstances now demand different aims.`,
      (x) => `New conditions in the settlement have turned ${x.name}'s effort toward another end.`,
    ],
    contextReason: [
      (x) => `Context changed from ${x.previous} to ${x.next}.`, // canonical
      (x) => `The settlement context moved from ${x.previous} to ${x.next}.`,
      (x) => `${x.name}'s recorded circumstances changed from ${x.previous} to ${x.next}.`,
      (x) => `A new context, ${x.next}, displaced the old footing, ${x.previous}.`,
    ],
    personalityReason: [
      (x) => `Personality remains anchored by ideal ${x.ideal} and flaw ${x.flaw}.`, // canonical
      (x) => `${x.name}'s ${x.ideal} ideal and ${x.flaw} flaw remain unchanged beneath the new aims.`,
      (x) => `The ambitions turn, but ${x.ideal} and ${x.flaw} still anchor ${x.name}.`,
      (x) => `New goals do not rewrite ${x.name}: the ${x.ideal} ideal and ${x.flaw} flaw still hold.`,
    ],
  },
});

// ════════════════════════════════════════════════════════════════════════════════════
// CALAMITY (CRITICAL — bucket-neutral by constitution). Title keeps "Great Calamity"
// + name + year; summary/reasons never assert a kind and speak the bucket.
// ════════════════════════════════════════════════════════════════════════════════════

/** @type {readonly ProseVariant[]} title — every variant keeps "Great Calamity" + name + year. */
export const CALAMITY_TITLES = Object.freeze([
  (x) => `The Great Calamity of ${x.name}, year ${x.year}`,          // canonical (== stampTitle)
  (x) => `The Great Calamity that befell ${x.name}, year ${x.year}`,
  (x) => `${x.name}'s Great Calamity, year ${x.year}`,
  (x) => `Year ${x.year}: the Great Calamity of ${x.name}`,
  (x) => `The Great Calamity of ${x.name} in the year ${x.year}`,
]);

/** @type {readonly ProseVariant[]} strike summary — interp {name, ruin, deaths}; contains "calamity". */
export const CALAMITY_SUMMARIES = Object.freeze([
  (x) => `A calamity has struck ${x.name}: ${x.ruin}, about ${x.deaths} dead, and many more take to the roads.`, // canonical
  (x) => `Calamity has come to ${x.name}: ${x.ruin}, near ${x.deaths} dead, and the survivors scatter to the roads.`,
  (x) => `A great calamity has fallen on ${x.name}. The toll is ${x.ruin}, some ${x.deaths} dead, and many take flight along the roads.`,
  (x) => `${x.name} lies broken by calamity: ${x.ruin}, about ${x.deaths} dead, and the roads fill with those who remain.`,
  (x) => `Calamity has undone ${x.name}: ${x.ruin}, roughly ${x.deaths} dead, and the living take what they can to the roads.`,
]);

/** @type {readonly ProseVariant[]} strike reason — bucket-neutral, geography-of-exposure. */
export const CALAMITY_REASONS = Object.freeze([
  'The calamity struck where the land lies most exposed. Geography exacted the reckoning.', // canonical
  'It fell hardest where the land lies most exposed. Geography kept no favourites.',
  'The most exposed ground bore the worst of it. The reckoning was written by the terrain.',
  'Where the land lies open and unsheltered, the ruin ran deepest. Geography decided the toll.',
  'The exposed ground took the heaviest blow because the land offers no shelter there.',
]);

// ════════════════════════════════════════════════════════════════════════════════════
// WAR / PEACE REASON RECEIPTS. One fixed sentence per type persisted per directed pair —
// the same casus read identically on every pair. Per-type pools, seeded on the DIRECTED
// pair key (stable across ticks ⇒ no per-tick churn; different pairs differ). The
// receipt's semantic content stays honest (same reason, varied phrasing); interpolated
// numbers/names are threaded through unchanged.
// ════════════════════════════════════════════════════════════════════════════════════

/** @type {Record<string, ProseVariant[] | Record<string, ProseVariant[]>>} */
export const WAR_RECEIPTS = Object.freeze({
  grievance: [
    (x) => `A ledger of grievances stands open: resentment ${x.resentment}, memory ${x.memory}.`, // canonical
    (x) => `The book of grievances stays open between them: resentment ${x.resentment}, memory ${x.memory}.`,
    (x) => `Old accounts go unsettled: resentment stands at ${x.resentment}, the long memory at ${x.memory}.`,
    (x) => `Every slight is still tallied: resentment ${x.resentment}, memory ${x.memory}, and nothing forgiven.`,
  ],
  revanchism: [
    (x) => `Old wounds unforgotten: ${x.wounds} mark${x.s} in the ledger, and the grudge still burns.`, // canonical (keyword: unforgotten)
    (x) => `The old wounds are not forgotten: ${x.wounds} mark${x.s} stand in the ledger, and the grudge burns yet.`,
    (x) => `Wrongs long past still ache: ${x.wounds} mark${x.s} unavenged, and the grudge has not cooled.`,
    (x) => `The reckoning was never paid: ${x.wounds} old mark${x.s} in the ledger, and the anger keeps its heat.`,
  ],
  resource_pressure: [
    'Their granaries stand full while ours thin. Hunger is faster than patience.', // canonical
    'Their stores are heavy while our own run lean. An empty granary outpaces patience.',
    'They eat their fill while our larders empty. Want moves quicker than restraint.',
    'Their harvest keeps while ours fails. A hungry season answers sooner than diplomacy.',
  ],
  treaty_default: [
    'The treaty lies broken and the promised wagons never came. Oathbreach is casus.', // canonical (keyword: oathbreach)
    'The treaty is in tatters and the promised convoys never arrived. Oathbreach is cause enough.',
    'A signed compact went unhonoured and the pledged goods never came. Oathbreach makes the casus.',
    'The bargain was struck and then abandoned, the promised tribute withheld. Such oathbreach is its own casus.',
  ],
  encirclement: [
    'War stands at the borders on more sides than one. Better to strike than be ringed.', // canonical
    'Enemies press the frontier from several quarters. Better the first blow than the closing ring.',
    'Hostile banners gather on more marches than one. Strike now, or be surrounded at leisure.',
    'The borders are threatened from too many sides at once. Better to break out than be encircled.',
  ],
  foreign_clash: [
    'Our banners and theirs bleed for opposite claimants on the same field. The proxy is becoming our own quarrel.', // canonical
    'Our men and theirs die for rival claimants on one field. The proxy war is curdling into ours.',
    'We back opposite sides of the same contest with our own blood. What began as proxy is turning personal.',
    'Their sponsored side and ours meet on the same ground. The borrowed quarrel is becoming a private one.',
  ],
  legitimacy_hunger: [
    'The seat is contested at home. A foreign enemy is cheaper than a domestic answer.', // canonical
    'The throne is shaky at home. A war abroad costs less than an answer to the streets.',
    'Authority is questioned within the walls. An outside foe is a cheaper reply than reform.',
    'The seat is unsteady and challenged. A foreign quarrel buys the loyalty a domestic fix would not.',
  ],
  corruption_exposed: [
    'Their court is rotten and the rot is now public. Someone must answer for it.', // canonical
    'Their court is corrupt and the corruption is now in the open. A reckoning is demanded.',
    'The rot in their halls is known to all now. Such exposure calls for an answer.',
    'Their governance is fouled and the foulness laid bare. Someone must be made to answer.',
  ],
  ingratitude_debt: [
    'The grain we gave in the lean years is spoken of now as a debt unpaid. Ingratitude is its own casus.', // canonical
    'The aid we gave in the hungry years is now called a debt owed. Such ingratitude is casus enough.',
    'What we shared in the lean seasons is remembered as a loan unrepaid. The ingratitude alone is cause.',
    'The help extended in the thin years is recast as an obligation defaulted. Ingratitude makes its own casus.',
  ],
  dependency_by_design: [
    'Our looms and larders were bound to their markets by design. The dependence was built to be a leash.', // canonical
    'Our trades and stores were tied to their markets on purpose. The dependence was made to be a tether.',
    'Our workshops and granaries were fastened to their custom deliberately. The reliance was shaped into a leash.',
    'Our craft and provisions were made to lean on their markets by intent. The dependence was meant to bind.',
  ],
  // fear_of_dominance — authored in hegemonyFear.js (see HEGEMONY_RECEIPTS below).
});

/** @type {Record<string, ProseVariant[] | Record<string, ProseVariant[]>>} */
export const PEACE_RECEIPTS = Object.freeze({
  exhaustion: [
    (x) => `The war has worn the town to the bone: exhaustion ${x.score}; the seat needs peace to survive.`, // canonical (keyword: exhaustion)
    (x) => `The war has ground the town to the bone: exhaustion ${x.score}; the seat must have peace to last.`,
    (x) => `The fighting has hollowed the town: exhaustion ${x.score}; without peace the seat cannot hold.`,
    (x) => `The war has spent the town to its bones: exhaustion ${x.score}; peace is now a matter of survival.`,
  ],
  belief_convergence: {
    converged: [
      'The fighting has taught both courts the same truth. No offer insults any longer.', // canonical (keyword: same truth)
      'The war has taught both courts the same truth at last. No terms give offence now.',
      'Both courts have been schooled to the same truth by the fighting. No offer is an insult any more.',
      'The fighting has brought both courts to the same truth. An honest offer no longer offends.',
    ],
    drifting: [
      (x) => `The courts' reckonings drift closer (divergence ${x.divergence}). The war is running out of illusions.`, // canonical
      (x) => `The two courts' accounts draw nearer (divergence ${x.divergence}). The war is losing its illusions.`,
      (x) => `Their reckonings are converging (divergence ${x.divergence}). The war has fewer illusions left to spend.`,
      (x) => `The courts read the war more alike now (divergence ${x.divergence}). The last illusions are wearing thin.`,
    ],
  },
  economic_strangulation: {
    base: [
      'The routes are severed and the treasury bleeds. The war costs more than its aims.', // canonical
      'The trade routes are cut and the treasury drains. The war now costs more than it can win.',
      'With the routes broken and the coffers emptying, the war is dearer than its purpose.',
      'The severed routes and the bleeding treasury make the war cost more than it could ever gain.',
    ],
    blockade: [
      'The harbour is blockaded. No keel comes or goes, and the wharves stand idle; a strangled port cannot bear the war.', // canonical (keyword: blockaded)
      'The port is blockaded. Nothing sails in or out, and the docks lie still; a choked harbour cannot fund a war.',
      'A blockade seals the harbour. No ship moves, and the quays stand empty; a strangled port cannot sustain the fight.',
      'The harbour is blockaded shut. No cargo comes or goes, and the wharves are idle; a throttled port cannot carry the war.',
    ],
    supplyweb: [
      'A neighbour strangles the supply web by design. The granary villages burn and the routes are cut; the war cannot be borne.', // canonical (keyword: supply web)
      'A neighbour throttles the supply web on purpose. The granary villages fall and the routes are severed; the war cannot be carried.',
      'The supply web is being strangled by deliberate design. The feeder villages are put to ruin and the roads cut; the war is past bearing.',
      'A rival chokes the supply web by intent. The granary hamlets are wasted and the routes broken; the war can no longer be borne.',
    ],
  },
  coalition_fracture: [
    (x) => `The coalition thins: ${x.peel} of ${x.peak} co-belligerents have left the field.`, // canonical (keyword: coalition thins)
    (x) => `The coalition is thinning: ${x.peel} of ${x.peak} co-belligerents have quit the field.`,
    (x) => `The alliance frays: ${x.peel} of ${x.peak} co-belligerents have withdrawn from the field.`,
    (x) => `The war-coalition thins out: ${x.peel} of ${x.peak} co-belligerents have abandoned the field.`,
  ],
  // mediation — EVERY variant must lead with the mediator's name (the ^M pin).
  mediation: [
    (x) => `${x.mediatorName} stands torn between the belligerents. Its envoys carry terms both courts will hear.`, // canonical
    (x) => `${x.mediatorName}, caught between the belligerents, sends envoys with terms both courts will hear.`,
    (x) => `${x.mediatorName} is pulled both ways between the warring courts. Its envoys bring terms each will hear.`,
    (x) => `${x.mediatorName} stands cross-pressured between the two. Its envoys offer terms both courts can hear.`,
  ],
  harvest_pressure: [
    'The harvest stands in the fields and the levies mutter of home. Wars pause for bread.', // canonical
    'The harvest waits in the fields and the levies grumble for home. Wars give way to bread.',
    'The crop stands ready and the levies long for home. Even wars pause for the harvest.',
    'The fields are heavy with harvest and the levies want home. Bread stills the war for a season.',
  ],
  realignment: {
    common: [
      'A third banner is at both gates. The peace is signed in haste, for the horde was at the passes.', // canonical (keyword: horde/passes)
      'A common enemy stands at both gates. The peace is signed in haste, for the horde was in the passes.',
      'One third banner threatens them both. Terms are struck quickly, with the horde already at the passes.',
      'A shared foe presses both courts. The peace comes in haste, the horde loose in the passes.',
    ],
    distinct: [
      'Each court is beset by another foe. This front is a luxury neither can keep.', // canonical
      'Each court has another enemy of its own. This front is a luxury neither can afford.',
      'Both courts face separate threats elsewhere. Keeping this front is a luxury for neither.',
      'Each is pressed by a different foe. Neither can spare the strength this front demands.',
    ],
  },
  spheres_understanding: [
    'Better to draw a line between our claims than to make this proxy our own war: a sphere apiece, and the field left to them.', // canonical
    'Better a line drawn between our claims than a proxy made our own war: a sphere for each, the field left to them.',
    'Sooner a boundary between our claims than a borrowed quarrel turned real: a sphere apiece, and the field theirs.',
    'Rather mark our claims apart than let this proxy become our war: a sphere for each side, the field left to them.',
  ],
  debt_forgiven: [
    'The old grain-debt is spoken of as a gift once more. What was owed is forgiven, and the quarrel loses its cause.', // canonical
    'The old grain-debt is called a gift again. What was owed is written off, and the quarrel loses its reason.',
    'The aid once counted a debt is named a gift once more. The obligation is forgiven, and the cause of the quarrel falls away.',
    'The old debt of grain is remembered as a gift again. It is forgiven, and with it the quarrel loses its ground.',
  ],
  bonds_of_commerce: [
    'Too many looms and larders bind us to their markets. A war would cost more than either court could bear.', // canonical
    'Too many trades and stores tie us to their markets. A war would cost more than either court could stand.',
    'Our workshops and granaries are too bound to their custom. A war would cost more than either could bear.',
    'So much of our craft and provision leans on their markets. A war would ruin both courts before it settled anything.',
  ],
  // balance_restored — authored in hegemonyFear.js (see HEGEMONY_RECEIPTS below).
});

/** @type {Record<string, ProseVariant[]>} the two hegemony-sphere receipts (hegemonyFear.js). */
export const HEGEMONY_RECEIPTS = Object.freeze({
  fear_of_dominance: [
    (x) => `The shadow of ${x.centerName} falls long over the free towns. Better to gather against it than be swallowed one by one.`, // canonical
    (x) => `${x.centerName}'s shadow lies long over the free towns. Better to band against it than be taken one by one.`,
    (x) => `The reach of ${x.centerName} looms over the free towns. Sooner a common stand than to be swallowed piecemeal.`,
    (x) => `${x.centerName} throws a long shadow across the free towns. Better to gather now than be devoured one at a time.`,
  ],
  balance_restored: [
    (x) => `${x.centerName}'s grip is slipping. With the shadow lifting, old rivals can breathe and treat.`, // canonical
    (x) => `${x.centerName}'s hold is loosening. As the shadow lifts, old rivals can breathe and come to terms.`,
    (x) => `The grip of ${x.centerName} is failing. With its shadow receding, old rivals find room to treat.`,
    (x) => `${x.centerName}'s dominance wanes. The shadow lifts, and old rivals can breathe and parley.`,
  ],
});

/** @type {readonly ProseVariant[]} decree-default war receipt (interp {type, to}). */
export const DECREE_DEFAULT_RECEIPTS = Object.freeze([
  (x) => `Declared by decree: ${x.type} against ${x.to}.`, // canonical
  (x) => `By decree, ${x.type} is declared against ${x.to}.`,
  (x) => `Set by decree: ${x.type} against ${x.to}.`,
  (x) => `A decree names the cause: ${x.type} against ${x.to}.`,
]);

/** Resolve a possibly-dotted pool key ("economic_strangulation.blockade") to its array.
 *  @param {Record<string, unknown>} root @param {string} typeKey @returns {readonly ProseVariant[]} */
function resolvePool(root, typeKey) {
  let p = /** @type {unknown} */ (root);
  for (const k of String(typeKey).split('.')) {
    p = p && typeof p === 'object' ? /** @type {Record<string, unknown>} */ (p)[k] : undefined;
  }
  return Array.isArray(p) ? /** @type {ProseVariant[]} */ (p) : [];
}

/**
 * A war-reason receipt phrasing. `typeKey` may be dotted for branch pools. The pair seed
 * is namespaced by type so each reason on a pair picks independently. Seedless ⇒ canonical.
 * @param {string} typeKey @param {string|null|undefined} seed @param {Record<string, unknown>} [interp]
 */
export function warReceipt(typeKey, seed, interp = {}) {
  return pickLine(resolvePool(WAR_RECEIPTS, typeKey), seed ? `${seed}#${typeKey}` : null, interp);
}

/**
 * A peace-reason receipt phrasing (see warReceipt). @param {string} typeKey
 * @param {string|null|undefined} seed @param {Record<string, unknown>} [interp]
 */
export function peaceReceipt(typeKey, seed, interp = {}) {
  return pickLine(resolvePool(PEACE_RECEIPTS, typeKey), seed ? `${seed}#${typeKey}` : null, interp);
}

/**
 * A hegemony-sphere receipt phrasing (fear_of_dominance | balance_restored).
 * @param {string} typeKey @param {string|null|undefined} seed @param {Record<string, unknown>} [interp]
 */
export function hegemonyReceipt(typeKey, seed, interp = {}) {
  return pickLine(resolvePool(HEGEMONY_RECEIPTS, typeKey), seed ? `${seed}#${typeKey}` : null, interp);
}

// ════════════════════════════════════════════════════════════════════════════════════
// KERNEL NEWS BEATS (upswing / resource / lifecycle). 1 headline+summary+reason per event
// kind, persisted into wizardNews + the pulseHistory impactDigest. Variety is FRAMING ONLY:
// every interpolated semantic token (counts, cause, provenance, artery, names) is threaded
// through unchanged, so keyword/structural pins hold; only the surrounding prose rotates.
// ════════════════════════════════════════════════════════════════════════════════════

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const UPSWING_NEWS = Object.freeze({
  reconstruction: {
    headline: [
      (x) => `${x.name} is rebuilt`, // canonical
      (x) => `${x.name} rises from its ruin`,
      (x) => `${x.name} has repaired its wounds`,
      (x) => `${x.name} stands whole again`,
    ],
    summary: [
      (x) => `${x.name} has finished rebuilding in the year ${x.year}, its wounds closed by its own hands and its allies'.${x.built}${x.graft}`, // canonical
      (x) => `By the year ${x.year} ${x.name} has finished its rebuilding, the damage mended by its own labour and its allies' aid.${x.built}${x.graft}`,
      (x) => `${x.name} has closed its wounds at last, the rebuilding done in the year ${x.year} by its own hands and its allies'.${x.built}${x.graft}`,
      (x) => `The rebuilding of ${x.name} is complete in the year ${x.year}. Its own people and its allies together have made it whole.${x.built}${x.graft}`,
    ],
    reasons: [
      "A conserved rebuild: its own prosperity, builders, peace, and its allies' investment repaid.", // canonical
      "A rebuild paid for in kind: its own prosperity, its builders, a lasting peace, and its allies' returned investment.",
      "The recovery drew on what it had: its prosperity, its masons, the peace, and the aid its allies repaid.",
      "Nothing conjured: the rebuild ran on its own wealth, its builders, the peace it kept, and its allies' repaid stake.",
    ],
  },
  boom: {
    headline: [
      (x) => `${x.name} is booming`, // canonical
      (x) => `${x.name} strikes it rich`,
      (x) => `Coin floods into ${x.name}`,
      (x) => `${x.name} rides a boom`,
    ],
    summary: [
      (x) => `Brisk and sustained trade has tipped ${x.name} into a boom. Markets swell and coin flows.${x.dep}`, // canonical
      (x) => `A steady run of brisk trade has tipped ${x.name} into a boom. The markets swell and the coin runs freely.${x.dep}`,
      (x) => `Trade has come thick and lasting to ${x.name}, and it has tipped into a boom. Its markets swell and coin flows.${x.dep}`,
      (x) => `Sustained, vigorous trade has carried ${x.name} into a boom. Its markets swell and coin moves fast.${x.dep}`,
    ],
    reasons: [
      (x) => `The boom is fed by ${x.arteries} trade artery${x.arteryS}: a composition the trade movers already built.`, // canonical
      (x) => `The boom rides on ${x.arteries} trade artery${x.arteryS}: a mix the trade movers had already laid.`,
      (x) => `${x.arteries} trade artery${x.arteryS} feed the boom: the composition the trade movers built beforehand.`,
      (x) => `Behind the boom stand ${x.arteries} trade artery${x.arteryS}: a structure the trade movers already assembled.`,
    ],
  },
  bust: {
    headline: [
      (x) => `${x.name}'s boom has busted`, // canonical
      (x) => `${x.name}'s boom collapses`,
      (x) => `The boom breaks in ${x.name}`,
      (x) => `${x.name}'s fortune turns`,
    ],
    summary: [
      (x) => `The trade that made ${x.name} rich has collapsed because ${x.cause}. The boom curdles into flight and empty stalls.`, // canonical
      (x) => `The commerce that made ${x.name} rich has fallen apart because ${x.cause}. The boom sours into flight and shuttered stalls.`,
      (x) => `What made ${x.name} rich has come undone because ${x.cause}. The boom curdles into departures and empty market rows.`,
      (x) => `The trade that lifted ${x.name} has broken because ${x.cause}. The boom turns to flight and abandoned stalls.`,
    ],
    reasons: [
      (x) => `The boom's own dependency concentration was its undoing${x.arteryClause}.`, // canonical
      (x) => `Its boom leaned on too narrow a base, and that concentration undid it${x.arteryClause}.`,
      (x) => `The boom had staked itself on too few threads. The concentration was its ruin${x.arteryClause}.`,
      (x) => `Over-reliance on a narrow trade was the boom's undoing${x.arteryClause}.`,
    ],
  },
  flourishing: {
    headline: [
      (x) => `${x.name} enters a golden age`, // canonical
      (x) => `A golden age dawns in ${x.name}`,
      (x) => `${x.name} comes into flower`,
      (x) => `${x.name} enjoys a golden age`,
    ],
    summary: [
      (x) => `A long peace and steady rule have made ${x.name} culturally fertile. Tolerance broadens and the temples keep warm.${x.built}`, // canonical
      (x) => `Under a long peace and a steady hand, ${x.name} has grown culturally fertile. Tolerance widens and the temples stay warm.${x.built}`,
      (x) => `Years of peace and steady rule have left ${x.name} culturally fertile. Its tolerance broadens and its temples keep warm.${x.built}`,
      (x) => `A lasting peace and settled rule have made ${x.name} fertile in its culture. Tolerance broadens, and the temples keep warm.${x.built}`,
    ],
    reasons: [
      'A bounded cultural attractor. No army, no treasury swell, only the fertility of a long peace.', // canonical
      'A cultural high, and a bounded one. No army, no swelling treasury, only what a long peace makes fertile.',
      'A contained cultural flowering. Not arms, not coin, only the fertility a long peace brings.',
      'A modest, bounded flourishing. No host and no full treasury, just the fruit of a lasting peace.',
    ],
  },
});

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const RESOURCE_NEWS = Object.freeze({
  discovery: {
    headline: [
      (x) => `${x.label} discovered near ${x.name}`, // canonical
      (x) => `New ${x.labelLower} found near ${x.name}`,
      (x) => `Prospectors strike ${x.labelLower} near ${x.name}`,
      (x) => `${x.label} comes to light near ${x.name}`,
    ],
    summary: [
      (x) => `Prospecting near ${x.name} has struck ${x.labelLower}: a new resource for the local economy.`, // canonical
      (x) => `Prospecting around ${x.name} has turned up ${x.labelLower}: a fresh resource for the local economy.`,
      (x) => `Diggers working near ${x.name} have hit ${x.labelLower}: a new resource for the local economy.`,
      (x) => `A prospecting effort near ${x.name} has found ${x.labelLower}: new wealth for the local economy.`,
    ],
  },
  removal: {
    headline: [
      (x) => `${x.label}'s workings near ${x.name} have given out`, // canonical
      (x) => `The ${x.labelLower} near ${x.name} runs dry`,
      (x) => `${x.label} near ${x.name} is worked out`,
      (x) => `${x.label}'s vein near ${x.name} fails`,
    ],
    summary: [
      (x) => `The ${x.labelLower} near ${x.name} has been worked out. After long depletion, the vein is done.`, // canonical
      (x) => `The ${x.labelLower} near ${x.name} is exhausted. After a long depletion, the vein is finished.`,
      (x) => `After a long decline the ${x.labelLower} near ${x.name} has given out. The vein is done.`,
      (x) => `The ${x.labelLower} workings near ${x.name} have run out. Long depleted, the vein is now done.`,
    ],
  },
});

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const LIFECYCLE_NEWS = Object.freeze({
  orbit_dispersed: {
    headline: [
      (x) => `The steadings around ${x.parent} empty out`, // canonical
      (x) => `The steadings around ${x.parent} scatter`,
      (x) => `${x.parent}'s steadings are left empty`,
      (x) => `The orbit of ${x.parent} disperses`,
    ],
    summary: [
      (x) => `With ${x.parent} dead, its ${x.count} outlying steading${x.countS} emptied. ${x.dispersed} folk scattered to the wider world with the town's own.`, // canonical
      (x) => `${x.parent} being dead, its ${x.count} outlying steading${x.countS} emptied. ${x.dispersed} folk scattered into the wider world alongside the town's own.`,
      (x) => `With ${x.parent} gone, its ${x.count} outlying steading${x.countS} fell empty. ${x.dispersed} folk drifted out to the wider world with the town's own.`,
      (x) => `The death of ${x.parent} emptied its ${x.count} outlying steading${x.countS}. ${x.dispersed} folk scattered into the wider world with the town's own.`,
    ],
  },
  founded: {
    headline: [
      (x) => `A new steading rises near ${x.parent}`, // canonical
      (x) => `A steading takes root near ${x.parent}`,
      (x) => `New ground is broken near ${x.parent}`,
      (x) => `A frontier steading rises near ${x.parent}`,
    ],
    // summary keeps the resource-strike / growth PROVENANCE branch; the two sub-pools below
    // are selected by the caller and vary only their framing.
    summary_strike: [
      (x) => `${x.debit} settlers have raised the steading of ${x.name} on the new ${x.resource} workings.`, // canonical
      (x) => `${x.debit} settlers have thrown up the steading of ${x.name} beside the new ${x.resource} workings.`,
      (x) => `The new ${x.resource} workings have drawn ${x.debit} settlers, who have raised the steading of ${x.name}.`,
      (x) => `${x.debit} settlers have founded the steading of ${x.name} on the fresh ${x.resource} workings.`,
    ],
    summary_growth: [
      (x) => `${x.debit} settlers have struck out from ${x.parent} to found the steading of ${x.name}.`, // canonical
      (x) => `${x.debit} settlers have left ${x.parent} to found the steading of ${x.name}.`,
      (x) => `${x.debit} settlers have gone out from ${x.parent} and founded the steading of ${x.name}.`,
      (x) => `From ${x.parent}, ${x.debit} settlers have struck out to found the steading of ${x.name}.`,
    ],
  },
  charter_pending: {
    headline: [
      (x) => `${x.name} has outgrown its parent's shadow`, // canonical
      (x) => `${x.name} outgrows its parent`,
      (x) => `${x.name} comes of age`,
      (x) => `${x.name} steps out of its parent's shadow`,
    ],
    summary: [
      (x) => `The steading of ${x.name} has reached village scale. A charter awaits.`, // canonical
      (x) => `The steading of ${x.name} has grown to village scale. A charter is due.`,
      (x) => `Now at village scale, the steading of ${x.name} awaits a charter.`,
      (x) => `The steading of ${x.name} has come up to village scale. A charter is pending.`,
    ],
  },
  abandoned: {
    headline: [
      (x) => `The steading of ${x.name} is abandoned`, // canonical
      (x) => `The steading of ${x.name} is left empty`,
      (x) => `${x.name} is given up`,
      (x) => `The steading of ${x.name} fails`,
    ],
    summary: [
      (x) => `Without backing or newcomers, ${x.name} failed; its last folk walked back to ${x.parent}.`, // canonical
      (x) => `With no backing and no newcomers, ${x.name} gave out; its last folk went back to ${x.parent}.`,
      (x) => `Starved of backing and newcomers, ${x.name} failed, and its last folk returned to ${x.parent}.`,
      (x) => `${x.name} failed for want of backing and newcomers; its last folk walked back to ${x.parent}.`,
    ],
  },
  coalesced: {
    headline: [
      (x) => `${x.a} and ${x.b} fold into one palisade`, // canonical
      (x) => `${x.a} and ${x.b} grow into one`,
      (x) => `${x.a} and ${x.b} join under one palisade`,
      (x) => `${x.a} and ${x.b} become a single steading`,
    ],
    summary: [
      (x) => `The neighbouring steadings of ${x.a} and ${x.b} have grown together into a single hamlet of ${x.pop}.`, // canonical
      (x) => `The neighbouring steadings of ${x.a} and ${x.b} have merged into one hamlet of ${x.pop}.`,
      (x) => `${x.a} and ${x.b}, close neighbours, have grown together into a single hamlet of ${x.pop}.`,
      (x) => `The adjoining steadings of ${x.a} and ${x.b} have knit into one hamlet of ${x.pop}.`,
    ],
  },
});

// ── THE REGISTRY (the walker manifest) ──────────────────────────────────────────────
// Every pool flattened to { id, pool }, derived from the structures above so a new pool
// is auto-covered by the register / reachability guards (structural-prevention pattern).
/** @param {string} prefix @param {Record<string, unknown>} obj @param {Array<{id:string,pool:readonly ProseVariant[]}>} out */
function flattenPools(prefix, obj, out) {
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) out.push({ id: `${prefix}.${k}`, pool: /** @type {readonly ProseVariant[]} */ (v) });
    else if (v && typeof v === 'object') flattenPools(`${prefix}.${k}`, /** @type {Record<string, unknown>} */ (v), out);
  }
}

/** @type {Array<{ id: string, pool: readonly ProseVariant[] }>} */
const REGISTRY = [
  { id: 'calamity.title', pool: CALAMITY_TITLES },
  { id: 'calamity.summary', pool: CALAMITY_SUMMARIES },
  { id: 'calamity.reason', pool: CALAMITY_REASONS },
  { id: 'decree_default', pool: DECREE_DEFAULT_RECEIPTS },
];
flattenPools('npc_goal', NPC_GOAL_NEWS, REGISTRY);
flattenPools('war', WAR_RECEIPTS, REGISTRY);
flattenPools('peace', PEACE_RECEIPTS, REGISTRY);
flattenPools('hegemony', HEGEMONY_RECEIPTS, REGISTRY);
flattenPools('upswing', UPSWING_NEWS, REGISTRY);
flattenPools('resource', RESOURCE_NEWS, REGISTRY);
flattenPools('lifecycle', LIFECYCLE_NEWS, REGISTRY);
flattenPools('roads', ROADS_NEWS, REGISTRY); // THE ROADS (ENGINE LIFT #5) — the src/data leaf

/** The flat walker manifest: every prose pool, id'd. @type {ReadonlyArray<{ id: string, pool: readonly ProseVariant[] }>} */
export const EVENT_PROSE_REGISTRY = Object.freeze(REGISTRY);

/** The disaster-KIND vocabulary the calamity pools must never assert (bucket-neutrality). */
export const FORBIDDEN_CALAMITY_KINDS = Object.freeze(['flood', 'fire', 'quake', 'earthquake', 'storm']);
