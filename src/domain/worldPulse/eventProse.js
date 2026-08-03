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
 *  3. FRAMING-NOT-SEMANTICS. Variants vary PHRASING only. Meaning-bearing counts, causes,
 *     provenance and names are threaded through unchanged; engine scalars remain on their
 *     structured records and prose speaks their consequence in world words.
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
import { humanizeContextSignature } from '../display/humanizeEngineTokens.js';

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

/**
 * Pick a phrasing while retaining the STRUCTURAL template family that produced it.
 * Slot fills never create a new family: every interpolation of pool member 1 keeps
 * the same `${familyPrefix}.1` identity. That identity is persisted beside Wizard
 * News prose so the SP-6 repetition instrument can distinguish real authored depth
 * from one sentence dressed in different names. Pure; consumes no rng draw.
 *
 * @param {readonly ProseVariant[]} pool
 * @param {string | null | undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @param {string} [familyPrefix]
 * @returns {{ line: string, familyId: string, templateIndex: number } | null}
 */
export function pickLineWithFamily(pool, seed, interp = {}, familyPrefix = 'prose') {
  if (!Array.isArray(pool) || pool.length === 0) return null;
  const templateIndex = seed ? fnv1a32(seed) % pool.length : 0;
  const variant = pool[templateIndex];
  return {
    line: typeof variant === 'function' ? String(variant(interp)) : String(variant),
    familyId: `${familyPrefix}.${templateIndex + 1}`,
    templateIndex,
  };
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
      (x) => `Context changed from ${humanizeContextSignature(x.previous)} to ${humanizeContextSignature(x.next)}.`, // canonical
      (x) => `The settlement context moved from ${humanizeContextSignature(x.previous)} to ${humanizeContextSignature(x.next)}.`,
      (x) => `${x.name}'s recorded circumstances changed from ${humanizeContextSignature(x.previous)} to ${humanizeContextSignature(x.next)}.`,
      (x) => `A new context, ${humanizeContextSignature(x.next)}, displaced the old footing, ${humanizeContextSignature(x.previous)}.`,
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
    'A ledger of grievances stands open: resentment runs hot, and old wrongs have not faded.', // canonical
    'The book of grievances stays open between them; anger endures and every old slight is remembered.',
    'Old accounts go unsettled, their bitterness kept alive by a long memory.',
    'Every slight is still tallied, every old wrong remembered, and nothing forgiven.',
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
  // OPPORTUNISM (the vulture war, §14.1). The clause naming WHAT the court believes and
  // whether it is wrong is appended by opportunism.js — these lines carry the appetite,
  // the perceived-vulnerability clause carries the epistemics.
  opportunism: [
    'They are weaker now than they will ever be again. A season like this does not come twice.', // canonical (keyword: weaker)
    'They will never be weaker than they are this season. Such an hour does not return.',
    'Their guard is down and their house divided; they are weaker now than they will be again. The moment is the argument.',
    'Weaker than they have been in a generation, and mending. Wait, and the chance is gone.',
  ],
  // SACRED CLAIM (§14.1 ideology/faith), split by the CLOSED quadrant vocabulary: a
  // schism is a quarrel inside one rite, a natural enemy a quarrel between two.
  sacred_claim: {
    schism_axis: [
      'They keep our god and read it backwards. A heresy at our own altars is worse than a stranger god.', // canonical (keyword: heresy)
      'They name our god and invert its every teaching. Heresy among our own is fouler than any stranger creed.',
      'Ours is the god they claim, and they have turned it inside out. A heresy at home outweighs a foreign altar.',
      'They pray to our god in a corrupted tongue. Heresy under our own roof is the graver wrong.',
    ],
    natural_enemy: [
      'Their altars serve what ours abhor. There is no treaty to be made between such rites.', // canonical (keyword: altars)
      'What their altars honour, ours abhor. No treaty holds between rites so opposed.',
      'Their rite venerates everything our altars condemn. Between such faiths there is nothing to sign.',
      'Their altars and ours want opposite things of the world. No compact survives that.',
    ],
  },
  // WR-2 DISPOSITION. These eight pools are copied from the governed war receipt
  // annex. Each member is a different structural family; interpolated slot values do
  // not increase the family count. The dedicated selector below persists that family.
  disposition_martial_crossed: [
    (x) => `${x.settlement}'s martial temper now leans ${x.lean}; resolved contests changed the lesson.`,
    (x) => `The muster carries ${x.weight} weight in council than it did a generation ago.`,
    (x) => `${x.settlement}'s watchfires now draw a ${x.answer} answer from the court.`,
    (x) => `The court is ${x.answer} when captains ask for another campaign.`,
    (x) => `What force accomplished has made ${x.settlement} lean ${x.lean} on the next quarrel.`,
  ],
  disposition_mercantile_crossed: [
    (x) => `${x.settlement}'s mercantile temper now leans ${x.lean}; resolved ventures changed the lesson.`,
    (x) => `The quays carry ${x.weight} weight in council than they did before.`,
    (x) => `A generation of ledgers has made the court ${x.answer} about another bargain.`,
    (x) => `The town gives a ${x.answer} answer when its factors propose a costly venture.`,
    (x) => `What commerce accomplished has made ${x.settlement} lean ${x.lean} on the next bargain.`,
  ],
  disposition_diplomatic_crossed: [
    (x) => `${x.settlement}'s diplomatic temper now leans ${x.lean}; kept and broken pacts changed the lesson.`,
    (x) => `The treaty table carries ${x.weight} weight in council than it did before.`,
    (x) => `A generation of agreements has made the court ${x.answer} about another parley.`,
    (x) => `The town gives a ${x.answer} answer when a legate asks for a hearing.`,
    (x) => `What diplomacy accomplished has made ${x.settlement} lean ${x.lean} on the next quarrel.`,
  ],
  disposition_insular_crossed: [
    (x) => `${x.settlement}'s inward temper now leans ${x.lean}; its outward history changed the lesson.`,
    (x) => `The factors of ${x.house} are received ${x.welcome} than they were before.`,
    (x) => `The roads beyond the walls carry ${x.weight} weight in council than they once did.`,
    (x) => `The town gives a ${x.answer} answer when outsiders ask it to look beyond itself.`,
    (x) => `What outside ties accomplished has made ${x.settlement} lean ${x.lean}.`,
  ],
  disposition_reversal: [
    (x) => `${x.settlement}'s ${x.aspect} temper crossed its old balance and now leans ${x.lean}.`,
    (x) => `Later outcomes reversed what this court expected from ${x.practice}.`,
    (x) => `A learned habit is not a ratchet: ${x.settlement} now leans ${x.lean} on ${x.practice}.`,
    (x) => `The council changed its mind about ${x.practice}, slowly and on the evidence.`,
    (x) => `The old lesson no longer holds; ${x.practice} now draws a ${x.answer} answer.`,
  ],
  deity_war_pressure: [
    (x) => `${x.settlement}'s rites of ${x.domain} make a quicker muster easier to defend in council.`,
    'The local rites make a quicker muster easier to defend in council.',
    'Voices of restraint find less purchase in the court shaped by this worship.',
    'The rites do not order wars; they make restraint harder to argue.',
    'Local worship has lowered the court’s bar for arms.',
  ],
  deity_peace_pressure: [
    (x) => `${x.settlement}'s harvest rites leave its court ${x.band} slower to muster.`,
    'The local rites make another season easier to defend than another campaign.',
    (x) => `The court sets the cost of war beside its trade in ${x.good}, a reckoning no captain likes to hear.`,
    'Local worship has never forbidden war; it has made war look expensive.',
    'Where harvest rites shape the court, a grievance is more likely to wait another season.',
  ],
  war_culture_suppressed: [
    (x) => `${x.settlement}'s peaceable house, harvest rites, and book of losses cannot support a warlike reading; the contradiction is written plainly.`,
    (x) => `The clerks went looking for a martial temper at ${x.settlement} and wrote down what they found instead, item by item.`,
    'A town that has lost its wars and prays for rain is not made warlike by being asked.',
    'The court could be pressed and would not move; the ledger explains why before anyone asks.',
    'The contradiction is visible rather than silent: the warlike reading yields nothing, and every record behind that judgment is on the sheet.',
  ],
  // WR-3 LINEAGE CLAIM. The five governed kinds are copied from the receipt
  // annex. A parent/child name is interpolated only where the selected family
  // actually asks for it; lineageReceipt skips a family rather than inventing a
  // missing house, settlement, counterpart, or authored inversion band.
  lineage_edge_recorded: [
    (x) => `The steading at ${x.settlement} stands on its own books now, and remembers whose granary fed it.`,
    (x) => `${x.counterpart} seeded it, provisioned it, and has been outgrown by it.`,
    'What was a satellite is a settlement; the parish register says so, which is what matters later.',
    'The daughter house keeps its own reeve and its own quarrel with the tolls.',
    'A lineage edge is a small entry in a book and the cause of a great deal.',
  ],
  casus_lineage_claim_parent: [
    (x) => `${x.settlement} claims ${x.counterpart} by right of founding: it seeded the place, and the place has fallen ${x.band} below the seeding.`,
    'The parent house says the daughter cannot hold what it was given, and offers to hold it instead.',
    (x) => `There is a founding charter in the chest at ${x.settlement} and a hungry season at ${x.counterpart}; the two arguments arrived together.`,
    'They call it reclamation and their neighbours call it what it is.',
    "A thriving parent has no quarrel with a modest steading — which is why this parent's books are worth reading.",
  ],
  casus_lineage_claim_child: [
    (x) => `${x.settlement} was founded out of ${x.counterpart} and has outgrown it; the seat, it says, should follow the granary.`,
    'The daughter house keeps the bigger market and asks why it keeps the smaller title.',
    (x) => `The factors of ${x.house}, who once shipped through the parent's wharf, own it in all but the charter.`,
    'The child claims the seat by the simplest argument there is: it feeds more people.',
    'What was gratitude for a generation has become a grievance in a single harvest.',
  ],
  mirror_kinship_bond: [
    (x) => `The same founding that arms a claim binds a peace: ${x.settlement} and ${x.counterpart} read one edge and chose the other sign.`,
    'They share a charter and a graveyard; the courts remembered the graveyard.',
    'Kin do not sack kin cheaply, and both books said so.',
    'The lineage was cited by both sides to opposite ends, and the quieter reading held.',
    (x) => `The bond cost ${x.settlement} the claim, and the council called it a bargain.`,
  ],
  lineage_claim_suppressed: [
    'You do not sack the satellite you spent a generation provisioning; the claim scores nothing and the chronicle is named against it.',
    'The relationship record contradicts the casus, and the receipt says which entries do it.',
    'The court could raise the claim; its own wagon books refuse it.',
    'Sustained provisioning stands in the ledger where the grievance would go.',
    'Nothing was minted, so nothing decays; this claim waits on a change in the wagon books, not a change of heart.',
  ],
  // WR-4 COMPARATIVE COSTS + THE HOME FRONT. These nine governed kinds are
  // copied verbatim from the receipt annex. warCostReceipt resolves only
  // families whose named truths are present; it never invents a route, good,
  // house, NPC, temple, settlement, counterpart, or authored world-word band.
  war_trajectory_winning: [
    (x) => `The court of ${x.settlement} believes the war is turning its way, and prices every offer accordingly.`,
    'The word from the field is good, and the word is all the hall has.',
    'Terms that would have been signed in the spring are refused by the harvest, on no better evidence.',
    'Believing you are winning is expensive; the court has begun to pay for it.',
    (x) => `It is said the enemy is spent ${x.band}. The couriers who say so have been a fortnight on the road.`,
  ],
  war_trajectory_losing: [
    (x) => `${x.settlement}'s court believes the war is going against it, and the belief moves faster than the news.`,
    'The hall has begun to ask what peace costs, which is the first honest question of the war.',
    'Every report is read for the worst line in it.',
    (x) => `They may be wrong. They are certainly frightened, and the ${x.term} they draft will show it.`,
    'A court that believes it is losing will sign what a court that is losing would not.',
  ],
  home_front_roads: [
    (x) => `${x.route} has gone to ruts while the levies were away, and the tolls have gone with it.`,
    'Nobody has cut the causeway brush in a season; the drovers take the long way and charge for it.',
    'While the war continues, the road-work goes undone.',
    'The bridge at the ford held through the war and has not held since.',
    (x) => `One of ${x.settlement}'s wartime roads has worsened; the loss is ${x.band} harder to ignore.`,
  ],
  home_front_stores: [
    (x) => `The granaries of ${x.settlement} hold ${x.band}, and there is another season of war in front of them.`,
    (x) => `The reeve has begun measuring the seed ${x.good}, which is the last measure before hunger.`,
    'The war eats first and the town eats after; that order is written in the stores.',
    'The campaign continues while the stores remain low.',
    'There is bread enough for the season, and the season is not the question.',
  ],
  home_front_hands: [
    (x) => `${x.settlement} has sent ${x.band} of its hands to the field, and the work at home has noticed.`,
    'The harvest was got in by the old and the young, and got in late.',
    'The muster took the smiths first, which the town will feel for a generation.',
    (x) => `Names that ran the market are on the roll instead of the ledger, ${x.npc} among them.`,
    'A town can survive a war; it cannot keep sending its working hands away without paying for it at home.',
  ],
  home_front_institutions: [
    (x) => `The assize at ${x.settlement} sits with a clerk and no justice; the court has been hollowed by the war's bill.`,
    (x) => `The ${x.temple} keeps its doors and has stopped keeping its school.`,
    'Institutions need not fall to thin, and thin, and one day fail at the thing they are for.',
    'What was a working court is a room with a register in it.',
    'The buildings remain. Their offices cannot do the work they were built to do.',
  ],
  home_front_markets: [
    (x) => `The factors of ${x.house} no longer come to ${x.settlement}'s staple, and the wharf shows it.`,
    'The wharf hands stand about by the middle of the morning, and have done so since the levies went out.',
    (x) => `${x.good} that moved through this town moves around it now.`,
    'A recorded market tie has closed while the war continues.',
    'The tolls are what they were and there is nothing to toll.',
  ],
  winning_abroad_losing_at_home: [
    (x) => `${x.settlement}'s banners stand on ${x.counterpart}'s walls and its own granaries hold ${x.band}.`,
    'The couriers bring victories and the reeve brings the accounts; only one of them is believed in the market.',
    'The victory dispatch is read out in the market square, where the price of bread answers it.',
    'Every field taken has been paid for with a road, a craftsman, and a market.',
    'The gains abroad are real. So is the strain at home, and home is nearer.',
  ],
  trajectory_misread: [
    'The court believed the war was turning; the field says otherwise, and the receipt carries both readings.',
    (x) => `What ${x.settlement}'s hall knows and what is true have parted company, and the distance is on the record.`,
    'The belief is honest and wrong, which is the most expensive combination there is.',
    'The terms about to be drafted rest on a report the world has already overtaken.',
    'Nobody in that hall is wrong on purpose, which will be no comfort to anyone afterward.',
  ],
  // WR-5 THE TWO BOOKS + THE POLITICAL LOOP. These fourteen kinds are copied
  // from the war receipt annex. The section-eight parentheticals in the source
  // volume are editorial cross-references, not reader prose, so they are not
  // persisted with the first sentence of either suing pool.
  sued_for_peace_seat: [
    (x) => `${x.npc} sued for peace.`,
    "The offer went out over the seat's name and not the town's, and the quays noticed the distinction.",
    'It was the seat that could not carry another season, whatever the granaries said.',
    (x) => `${x.npc} sued, and the council was told afterward.`,
    'The peace served the man before it served the walls, and the receipt names whose books it answered.',
  ],
  sued_for_peace_realm: [
    'The realm sued for peace.',
    (x) => `The council of ${x.settlement} voted the offer and ${x.npc} carried it, willing or not.`,
    'The granaries wrote the terms; the seat only signed them.',
    'It was the town that wanted it ended and the town that will pay for the ending.',
    "The offer went out over the settlement's name, which tells you which book was open.",
  ],
  war_continued_for_the_seat: [
    (x) => `The war ruins ${x.settlement} and secures ${x.npc}, and it continues.`,
    "The council's arithmetic and the seat's arithmetic parted in the spring; the seat's won.",
    'Peace would cost the hall more than the war costs the town.',
    (x) => `Every season of this war is a season ${x.faction} cannot move.`,
    "The receipt names whose books were served, and they were not the town's.",
  ],
  war_ended_against_rival_triumph: [
    (x) => `${x.settlement} ended a war it was winning, because winning it would have crowned ${x.npc}.`,
    "The victory was already spoken for, and the seat declined to pay for another man's triumph.",
    'Terms were taken that the field did not require.',
    'A general too successful is a problem no treaty solves, so the treaty solved the war instead.',
    'They stopped short, and the reason is in the hall rather than the field.',
  ],
  peace_refused: [
    (x) => `${x.counterpart} offered terms and ${x.settlement} refused them; the refusal stands on the record with ${x.reason} and a name beside it.`,
    (x) => `The legate was heard, thanked, and sent back down ${x.route} with nothing.`,
    'The offer was read aloud in council, which is how the town learned there had been one.',
    'A refusal is a fact like a battle and goes into the same book.',
    (x) => `${x.npc} said no, and the saying of it hardened everything after.`,
  ],
  refusal_cost_legitimacy: [
    (x) => `${x.settlement} refused peace, and the streets priced the refusal within the season.`,
    'The seat spent its standing to keep its war.',
    'Men who bore the levy quietly do not bear a refused peace quietly.',
    (x) => `The council's confidence in ${x.npc} reads ${x.band}, and the refusal is the reason on every tongue.`,
    'Nothing was lost in the field that day. A good deal was lost in the market square.',
  ],
  refusal_cost_ally_patience: [
    (x) => `${x.counterpart} was refused, and ${x.third_party} read the refusal as a bill it had not agreed to.`,
    "The ally's factors have begun asking how long, which is the question before the door.",
    (x) => `Patience is a stock like any other, and this drew ${x.band} on it.`,
    "They refused peace with somebody else's soldiers in the field.",
    'The alliance held. It is thinner than it was, and both courts know it.',
  ],
  ruler_books_compromised: [
    (x) => `${x.npc} optimises a third book: the terms answer ${x.faction}'s needs before ${x.settlement}'s.`,
    'Every concession refused is a concession the patron would have paid for.',
    "The seat's arithmetic is sound; it is being done for somebody else.",
    'The web already knows whose interest this is, and the receipt names it.',
    'The war serves a party that has not sent a single man to it.',
  ],
  war_party_overturns_peacemaker: [
    (x) => `The peace ${x.npc} signed cost the seat: the war party took the hall and named the treaty as their grievance.`,
    (x) => `${x.faction} organised around one decision and rode it into the council chamber.`,
    'Men who were nobody in the spring hold the gate keys by the harvest.',
    'The town did not overturn a ruler; it overturned a signature.',
    'A peace made against the powers is a coup with a delay on it.',
  ],
  peace_party_overturns_warmonger: [
    (x) => `${x.settlement} put down the seat that kept the war, and the granaries did the counting.`,
    (x) => `${x.faction} formed at the almsgate and finished in the hall.`,
    'The war was the whole of the grievance and the whole of the programme.',
    'They removed the man and kept the levies, which is how these things usually end.',
    'The successor inherits a peace he must now actually make.',
  ],
  succession_demand_inherited: [
    (x) => `${x.faction} seated ${x.npc} on one condition, and the condition rides the succession record.`,
    'The new seat is not free: it was seated to do a particular thing about the war.',
    'A coup that does not bind its successor was a coup for nothing.',
    'The demand is written where the succession is written, and the next re-read must answer it.',
    'He holds the hall, and the hall holds a receipt.',
  ],
  successor_repudiates_war: [
    (x) => `${x.npc} came to the seat, read the war again, and the levies are coming home.`,
    'The quarrel belonged to a man who no longer holds the chair.',
    'The new seat owes the dead nothing and says so, which is easier from that chair than from any other.',
    'Momentum breaks at a succession, and this one broke loudly.',
    'Nothing changed in the field. Everything changed in the hall.',
  ],
  successor_escalates_war: [
    (x) => `${x.npc} came to the seat and widened the war his predecessor could not end.`,
    'The same state, the same ledgers, a different character — and a new front.',
    'The successor opened with a muster, and the town read it correctly.',
    'The restraint was never in the ledgers; it sat in a chair, and it sits there no longer.',
    'He inherited a stalemate and called it an opportunity.',
  ],
  war_dissolved_by_verdict: [
    (x) => `The officeholder whose rot opened the war was removed; ${x.npc} holds no quarrel with ${x.counterpart}, and the war has nothing left to stand on.`,
    'The casus was a man, and the man is out of office.',
    'The court that raised the grievance cannot now find anyone in it who owns the grievance.',
    'A verdict in one hall closed a war in another.',
    'They went to war over a corruption and unmade the war by exposing it, which the chronicles will call luck.',
  ],
  // WR-6 THE COALITION GRAPH. These twelve kinds are copied from the war
  // receipt annex. `warCoalitionReceipt` admits only families whose named
  // facts are present, so an unknown road, good, settlement, ally, enemy, or
  // qualitative band can never be improvised onto a reader card.
  coalition_entry_priced: [
    (x) => `${x.settlement} counted who might answer for ${x.counterpart}, and then who might answer for those.`,
    'The court priced the far compacts as beliefs, not promises of who would arrive.',
    'The obligation is plain and the arithmetic behind it is not.',
    (x) => `Entering a war is cheap; entering the war behind it is not, and this one prices ${x.band}.`,
    'They read the whole web before they read the field, which is why they are still deciding.',
  ],
  coalition_joined: [
    (x) => `${x.settlement} answered the call and opened its own edge against ${x.third_party}; the casus on the record is the obligation itself.`,
    (x) => `The banners went out down ${x.route}; the joined court now owns a separate front.`,
    'They came because they had said they would, and because the reading of not coming was worse.',
    "An ally's war is a war, with its own ledger and its own ending.",
    (x) => `${x.settlement}'s own war edge now records the alliance call among its causes.`,
  ],
  coalition_refused: [
    'They were called, and would not come.',
    (x) => `${x.settlement} read the alliance web, read its own books, and sent regrets down ${x.route}.`,
    (x) => `The refusal is a fact in the record now; how ${x.counterpart} reads it is ${x.counterpart}'s character.`,
    'The obligation was real and the answer was no, and both will be remembered.',
    'The refusal is archived on the allied edge as a durable fact.',
  ],
  casus_alliance_obligation: [
    (x) => `${x.settlement} is in this war because ${x.counterpart} called and the compact answers for it.`,
    'The alliance obligation is one recorded cause on this edge; other live causes remain their own facts.',
    "The borrowed cause remains anchored to the caller's exact war episode and compact.",
    'They march for a paper, which is a better reason than most.',
    (x) => `This edge against ${x.third_party} exists because an older edge does.`,
  ],
  mirror_obligation_discharged: [
    (x) => `The obligation is discharged: ${x.settlement} came when called.`,
    'The record now carries service under the compact beside the obligation it answered.',
    'They answered the alliance in the field, and that answer is recorded.',
    'What was owed under this call was given; other claims remain separate.',
    'The compact survived this use, and the relationship record says so.',
  ],
  coalition_expenditure_read: [
    (x) => `${x.settlement}'s surviving current-episode evidence reads ${x.band}; no lifetime total is invented.`,
    'The read uses deployed strength, recorded attrition, live exposure, and attributable home-front evidence.',
    'Damage that healed or left the bounded record is silence in this reckoning.',
    'What the alliance cost was never written down as a total — it is what the other books already say.',
    'The reckoning exists whether or not the coalition wants to hold it.',
  ],
  coalition_stayed: [
    'They stayed.',
    (x) => `${x.settlement} reread its open edge against ${x.third_party} and kept its army in the field.`,
    'The council reread the war, weighed the same ledgers as its neighbours, and reached the opposite conclusion.',
    'Staying was a decision and not an inertia, and the record says who made it.',
    'The ally that stays is owed differently from the ally that came.',
  ],
  coalition_separate_peace: [
    'They went home.',
    (x) => `${x.settlement} settled its own edge with ${x.third_party} and left the rest of the war standing.`,
    'The peace was pairwise, as every peace in this world is; the others learned of it from travellers.',
    'What the abandoned call betrayal, the departed call arithmetic, and the record carries both.',
    'One edge closed; every other front kept its own state and ending.',
  ],
  coalition_apportionment: [
    (x) => `The losers were assessed together and pay separately: ${x.band} in ${x.good} falls on ${x.settlement} by capacity, culpability, and who called whom.`,
    'One aggregate judgment became separate bilateral shares under the same settlement identifier.',
    'Capacity, culpability, field loss, and the alliance call all bear on the share; none alone dictates it.',
    'Collective liability, pairwise payment — the wagons roll along the edges they always rolled along.',
    'The apportionment is archived as a durable relationship fact.',
  ],
  coalition_spoils_divided: [
    'The victors divided the settlement by who bled, who led, and who came late.',
    (x) => `${x.settlement} received ${x.band} of the ${x.good} under the coalition settlement.`,
    'What was won together was assigned along ordinary bilateral transfer edges.',
    'What was won together is held separately, with every share archived on the relationship record.',
    "Every share is an explicit judgment on contribution under the same settlement identifier.",
  ],
  coalition_debt_paid: [
    'They paid what they owed.',
    (x) => `${x.counterpart} settled the recorded coalition claim owed to ${x.settlement}.`,
    'The conserved transfer met the recorded claim, and no unpaid remainder was minted.',
    (x) => `The payment travelled along ${x.route} and is archived as payment, never forgiveness.`,
    'This coalition claim is closed; other causes and obligations remain separate.',
  ],
  coalition_debt_unpaid: [
    'They never paid.',
    (x) => `${x.settlement}'s recorded claim against ${x.counterpart} remains unpaid along ${x.route}.`,
    (x) => `The missing ${x.good} remains an ordinary live obligation between the allied courts.`,
    'The coalition settlement closed without settling this internal claim.',
    'The unpaid obligation may later be read as ingratitude; it is not yet a new war.',
  ],
  // fear_of_dominance — authored in hegemonyFear.js (see HEGEMONY_RECEIPTS below).
});

/** @type {Record<string, ProseVariant[] | Record<string, ProseVariant[]>>} */
export const PEACE_RECEIPTS = Object.freeze({
  exhaustion: [
    'War exhaustion has worn the town to the bone; the seat needs peace to survive.', // canonical (keyword: exhaustion)
    'The war has ground the town to the bone; the seat must have peace to last.',
    'The fighting has hollowed the town; without peace the seat cannot hold.',
    'The war has spent the town to its bones; peace is now a matter of survival.',
  ],
  belief_convergence: {
    converged: [
      'The fighting has taught both courts the same truth. No offer insults any longer.', // canonical (keyword: same truth)
      'The war has taught both courts the same truth at last. No terms give offence now.',
      'Both courts have been schooled to the same truth by the fighting. No offer is an insult any more.',
      'The fighting has brought both courts to the same truth. An honest offer no longer offends.',
    ],
    drifting: [
      "The courts' reckonings drift closer. The war is running out of illusions.", // canonical
      "The two courts' accounts draw nearer. The war is losing its illusions.",
      'Their reckonings are converging. The war has fewer illusions left to spend.',
      'The courts read the war more alike now. The last illusions are wearing thin.',
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
  // HOPELESSNESS (§14.2 no-other-options) — the MIRROR of opportunism: the same believed
  // balance, read from the losing end. The perceived clause is appended by opportunism.js.
  hopelessness: [
    'They can bear this longer than we can. Every month we fight, the gap widens against us.', // canonical (keyword: bear this longer)
    'They can carry this war longer than we can. Each month we hold out, the gap grows against us.',
    'Their strength outlasts ours by a wide margin. The longer this runs, the worse our position.',
    'We cannot outlast them, and every season proves it further. There is no victory down this road.',
  ],
  // COMMON RITE (§14.2 moral/faith) — the same quadrant as sacred_claim, read the other way.
  common_rite: {
    brothers: [
      'We keep the same god and read it the same way. There is a floor here both courts can stand on.', // canonical (keyword: same god)
      'The same god, and the same reading of it. Both courts have a floor to stand on here.',
      'One god between us, understood alike. That is common ground enough for terms.',
      'We share a god and an understanding of it. Two courts on one floor can be brought to terms.',
    ],
    respectable_rival: [
      'Their rite is not ours, but it asks the same things of a person. Two honest faiths can share a table.', // canonical (keyword: share a table)
      'Their rite differs from ours, yet asks the same of a person. Honest faiths can share a table.',
      'A different altar, the same virtues taught beneath it. Such courts can sit at one table.',
      'We do not share their god, but we recognise what it asks. That is enough to share a table.',
    ],
  },
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
 * The WR-2 governed phrased-kind registry. This is deliberately narrower than the
 * legacy pool registry below: every row is a MINTED Wizard News kind and therefore
 * owes all four joins (pool floor, significance, audience, Herald section). Keeping
 * the metadata beside the pool makes omission mechanically visible to the walker.
 */
/** @typedef {'disposition_martial_crossed'|'disposition_mercantile_crossed'|
 * 'disposition_diplomatic_crossed'|'disposition_insular_crossed'|'disposition_reversal'|
 * 'deity_war_pressure'|'deity_peace_pressure'|'war_culture_suppressed'} DispositionReceiptKind */
/** @typedef {'notable'|'routine'} DispositionReceiptSignificance */
/** @typedef {'public'|'dm-only'} DispositionReceiptAudience */
/** @typedef {'war'|'trade'|'events'|'faith'} DispositionReceiptSection */
/** @typedef {{kind:DispositionReceiptKind,significance:DispositionReceiptSignificance,
 * audience:DispositionReceiptAudience,section:DispositionReceiptSection,
 * pool:readonly ProseVariant[],requiredSlots:ReadonlyArray<readonly string[]>}} DispositionReceiptRegistryEntry */

/**
 * @param {DispositionReceiptKind} kind
 * @param {DispositionReceiptSignificance} significance
 * @param {DispositionReceiptAudience} audience
 * @param {DispositionReceiptSection} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<DispositionReceiptRegistryEntry>}
 */
function dispositionKindRow(kind, significance, audience, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<DispositionReceiptRegistryEntry>>} */
export const WAR_DISPOSITION_KIND_REGISTRY = Object.freeze([
  dispositionKindRow('disposition_martial_crossed', 'notable', 'public', 'war',
    [['settlement', 'lean'], ['weight'], ['settlement', 'answer'], ['answer'], ['settlement', 'lean']]),
  dispositionKindRow('disposition_mercantile_crossed', 'notable', 'public', 'trade',
    [['settlement', 'lean'], ['weight'], ['answer'], ['answer'], ['settlement', 'lean']]),
  dispositionKindRow('disposition_diplomatic_crossed', 'notable', 'public', 'events',
    [['settlement', 'lean'], ['weight'], ['answer'], ['answer'], ['settlement', 'lean']]),
  dispositionKindRow('disposition_insular_crossed', 'notable', 'public', 'events',
    [['settlement', 'lean'], ['house', 'welcome'], ['weight'], ['answer'], ['settlement', 'lean']]),
  dispositionKindRow('disposition_reversal', 'notable', 'public', 'events',
    [['settlement', 'aspect', 'lean'], ['practice'], ['settlement', 'lean', 'practice'], ['practice'], ['practice', 'answer']]),
  dispositionKindRow('deity_war_pressure', 'notable', 'public', 'faith',
    [['settlement', 'domain'], [], [], [], []]),
  dispositionKindRow('deity_peace_pressure', 'notable', 'public', 'faith',
    [['settlement', 'band'], [], ['good'], [], []]),
  dispositionKindRow('war_culture_suppressed', 'routine', 'dm-only', 'war',
    [['settlement'], ['settlement'], [], [], []]),
]);

/** The exact WR-2 kind set, shared by emitters and structural walkers. */
export const WAR_DISPOSITION_KINDS = Object.freeze(
  WAR_DISPOSITION_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<DispositionReceiptRegistryEntry>>} */
const WAR_DISPOSITION_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<DispositionReceiptRegistryEntry>]>} */ (
    WAR_DISPOSITION_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-2 receipt plus its persistent structural family and governed
 * metadata. Unknown kinds return null rather than borrowing generic prose.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function dispositionReceipt(kind, seed, interp = {}) {
  const row = WAR_DISPOSITION_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  // NO-FABRICATION RESOLUTION. A template that asks for a house, good, temple,
  // settlement, or band is eligible only when the caller holds that exact truth.
  // The fallback remains inside the same authored pool; we never substitute a
  // generic invented entity. Family ids retain the ORIGINAL pool index so a slot-
  // constrained draw cannot masquerade as a new structural family.
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * The WR-3 governed phrased-kind registry. These are reader receipts rather
 * than behavioral candidate types: the registry pays SP-6's pool,
 * significance, audience, and Herald-desk joins without claiming that any of
 * them is an aliveness channel for the still-dark lineage scorer.
 */
/** @typedef {'lineage_edge_recorded'|'casus_lineage_claim_parent'|
 * 'casus_lineage_claim_child'|'mirror_kinship_bond'|'lineage_claim_suppressed'} LineageReceiptKind */
/** @typedef {{kind:LineageReceiptKind,significance:'major'|'notable'|'routine',
 * audience:'public'|'dm-only',section:'war'|'events',pool:readonly ProseVariant[],
 * requiredSlots:ReadonlyArray<readonly string[]>}} LineageReceiptRegistryEntry */

/**
 * @param {LineageReceiptKind} kind
 * @param {'major'|'notable'|'routine'} significance
 * @param {'public'|'dm-only'} audience
 * @param {'war'|'events'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<LineageReceiptRegistryEntry>}
 */
function lineageKindRow(kind, significance, audience, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<LineageReceiptRegistryEntry>>} */
export const WAR_LINEAGE_KIND_REGISTRY = Object.freeze([
  lineageKindRow('lineage_edge_recorded', 'notable', 'public', 'events',
    [['settlement'], ['counterpart'], [], [], []]),
  lineageKindRow('casus_lineage_claim_parent', 'major', 'public', 'war',
    [['settlement', 'counterpart', 'band'], [], ['settlement', 'counterpart'], [], []]),
  lineageKindRow('casus_lineage_claim_child', 'major', 'public', 'war',
    [['settlement', 'counterpart'], [], ['house'], [], []]),
  lineageKindRow('mirror_kinship_bond', 'notable', 'public', 'events',
    [['settlement', 'counterpart'], [], [], [], ['settlement']]),
  lineageKindRow('lineage_claim_suppressed', 'routine', 'dm-only', 'war',
    [[], [], [], [], []]),
]);

/** The exact WR-3 reader-kind set, shared by future emitters and walkers. */
export const WAR_LINEAGE_KINDS = Object.freeze(
  WAR_LINEAGE_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<LineageReceiptRegistryEntry>>} */
const WAR_LINEAGE_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<LineageReceiptRegistryEntry>]>} */ (
    WAR_LINEAGE_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-3 lineage receipt plus its stable structural family and
 * governed presentation metadata. A template is eligible only when every
 * truth slot it names is present; an unavailable house, settlement,
 * counterpart, or inversion band is never fabricated. Pure and deterministic.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function lineageReceipt(kind, seed, interp = {}) {
  const row = WAR_LINEAGE_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * The WR-4 governed phrased-kind registry. Comparative-cost and home-front
 * receipts are presentation evidence for the pure evaluator; registering their
 * authored families and proving behavioral reachability remain separate duties.
 */
/** @typedef {'war_trajectory_winning'|'war_trajectory_losing'|'home_front_roads'|
 * 'home_front_stores'|'home_front_hands'|'home_front_institutions'|
 * 'home_front_markets'|'winning_abroad_losing_at_home'|'trajectory_misread'} WarCostReceiptKind */
/** @typedef {{kind:WarCostReceiptKind,significance:'major'|'notable'|'routine',
 * audience:'public'|'dm-only',section:'war'|'trade'|'events',pool:readonly ProseVariant[],
 * requiredSlots:ReadonlyArray<readonly string[]>}} WarCostReceiptRegistryEntry */

/**
 * @param {WarCostReceiptKind} kind
 * @param {'major'|'notable'|'routine'} significance
 * @param {'public'|'dm-only'} audience
 * @param {'war'|'trade'|'events'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<WarCostReceiptRegistryEntry>}
 */
function warCostKindRow(kind, significance, audience, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<WarCostReceiptRegistryEntry>>} */
export const WAR_COST_KIND_REGISTRY = Object.freeze([
  warCostKindRow('war_trajectory_winning', 'notable', 'public', 'war',
    [['settlement'], ['fieldReport'], ['offerHistory'], [], ['fieldReport', 'band', 'courierDelay']]),
  warCostKindRow('war_trajectory_losing', 'notable', 'public', 'war',
    [['settlement', 'newsLag'], [], ['fieldReport'], ['term'], []]),
  warCostKindRow('home_front_roads', 'notable', 'public', 'trade',
    [['route', 'tollLoss'], ['causewayNeglect'], [], ['bridgeDamage'], ['settlement', 'band']]),
  warCostKindRow('home_front_stores', 'notable', 'public', 'events',
    [['settlement', 'band', 'granary'], ['seedGood'], [], [], ['breadSupply']]),
  warCostKindRow('home_front_hands', 'notable', 'public', 'events',
    [['settlement', 'band'], ['harvestLabor'], ['smithMuster'], ['npc'], []]),
  // WR-4 routing correction: institution degradation is structural news on
  // the events desk, not a judicial act on the adjudication desk.
  warCostKindRow('home_front_institutions', 'notable', 'public', 'events',
    [['settlement', 'courtOffice'], ['temple', 'school'], [], ['courtOffice'], []]),
  warCostKindRow('home_front_markets', 'notable', 'public', 'trade',
    [['house', 'settlement'], ['wharfLabor'], ['good'], [], ['tollLoss']]),
  warCostKindRow('winning_abroad_losing_at_home', 'major', 'public', 'war',
    [['settlement', 'counterpart', 'band', 'storesEvidence', 'occupation'], ['marketAccount'], ['breadPrice'], ['compoundLoss'], []]),
  warCostKindRow('trajectory_misread', 'routine', 'dm-only', 'war',
    [['fieldReport'], ['settlement'], [], ['draftedTerms'], ['intentEvidence']]),
]);

/** The exact WR-4 reader-kind set, shared by future emitters and walkers. */
export const WAR_COST_KINDS = Object.freeze(
  WAR_COST_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<WarCostReceiptRegistryEntry>>} */
const WAR_COST_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<WarCostReceiptRegistryEntry>]>} */ (
    WAR_COST_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-4 receipt plus its stable family and governed presentation
 * metadata. Missing truths remove only the families that name them; a receipt
 * never fabricates a route, good, house, NPC, temple, settlement, counterpart,
 * term, or world-word band. Pure and deterministic.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function warCostReceipt(kind, seed, interp = {}) {
  const row = WAR_COST_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * WR-5's governed reader kinds. Adjudication is a RECORD desk rather than a
 * token-map output: the projector persists the row's explicit `section`, and
 * heraldSectionOfRecord honours that governed section after its structural
 * pending/resolution/forecast precedence.
 */
/** @typedef {'sued_for_peace_seat'|'sued_for_peace_realm'|
 * 'war_continued_for_the_seat'|'war_ended_against_rival_triumph'|'peace_refused'|
 * 'refusal_cost_legitimacy'|'refusal_cost_ally_patience'|'ruler_books_compromised'|
 * 'war_party_overturns_peacemaker'|'peace_party_overturns_warmonger'|
 * 'succession_demand_inherited'|'successor_repudiates_war'|
 * 'successor_escalates_war'|'war_dissolved_by_verdict'} WarRulingReceiptKind */
/** @typedef {{kind:WarRulingReceiptKind,significance:'major'|'notable',
 * audience:'public'|'dm-only',section:'war'|'adjudication',pool:readonly ProseVariant[],
 * requiredSlots:ReadonlyArray<readonly string[]>}} WarRulingReceiptRegistryEntry */

/**
 * @param {WarRulingReceiptKind} kind
 * @param {'major'|'notable'} significance
 * @param {'public'|'dm-only'} audience
 * @param {'war'|'adjudication'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<WarRulingReceiptRegistryEntry>}
 */
function warRulingKindRow(kind, significance, audience, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<WarRulingReceiptRegistryEntry>>} */
export const WAR_RULING_KIND_REGISTRY = Object.freeze([
  warRulingKindRow('sued_for_peace_seat', 'major', 'public', 'adjudication',
    [['npc'], [], [], ['npc'], []]),
  warRulingKindRow('sued_for_peace_realm', 'major', 'public', 'adjudication',
    [[], ['settlement', 'npc'], [], [], []]),
  warRulingKindRow('war_continued_for_the_seat', 'major', 'public', 'war',
    [['settlement', 'npc'], [], [], ['faction'], []]),
  warRulingKindRow('war_ended_against_rival_triumph', 'major', 'public', 'war',
    [['settlement', 'npc'], [], [], [], []]),
  warRulingKindRow('peace_refused', 'major', 'public', 'adjudication',
    [['counterpart', 'settlement', 'reason'], ['route'], [], [], ['npc']]),
  warRulingKindRow('refusal_cost_legitimacy', 'notable', 'public', 'adjudication',
    [['settlement'], [], [], ['npc', 'band'], []]),
  warRulingKindRow('refusal_cost_ally_patience', 'notable', 'public', 'war',
    [['counterpart', 'third_party'], [], ['band'], [], []]),
  warRulingKindRow('ruler_books_compromised', 'major', 'dm-only', 'adjudication',
    [['npc', 'faction', 'settlement'], [], [], [], []]),
  warRulingKindRow('war_party_overturns_peacemaker', 'major', 'public', 'adjudication',
    [['npc'], ['faction'], [], [], []]),
  warRulingKindRow('peace_party_overturns_warmonger', 'major', 'public', 'adjudication',
    [['settlement'], ['faction'], [], [], []]),
  warRulingKindRow('succession_demand_inherited', 'notable', 'public', 'adjudication',
    [['faction', 'npc'], [], [], [], []]),
  warRulingKindRow('successor_repudiates_war', 'major', 'public', 'war',
    [['npc'], [], [], [], []]),
  warRulingKindRow('successor_escalates_war', 'major', 'public', 'war',
    [['npc'], [], [], [], []]),
  warRulingKindRow('war_dissolved_by_verdict', 'major', 'public', 'adjudication',
    [['npc', 'counterpart'], [], [], [], []]),
]);

/** The exact WR-5 governed reader-kind set. */
export const WAR_RULING_KINDS = Object.freeze(
  WAR_RULING_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<WarRulingReceiptRegistryEntry>>} */
const WAR_RULING_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<WarRulingReceiptRegistryEntry>]>} */ (
    WAR_RULING_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-5 sentence without inventing a ruler, faction, ally, route,
 * reason, or qualitative band. Families whose named source facts are absent are
 * ineligible; their slotless siblings remain honest authored fallbacks.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function warRulingReceipt(kind, seed, interp = {}) {
  const row = WAR_RULING_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * WR-6's governed coalition-reader kinds. Coalition structure remains a graph
 * of bilateral facts; this registry governs only how an already-earned fact is
 * spoken, including the two adjudication records whose desk cannot be inferred
 * from their token alone.
 */
/** @typedef {'coalition_entry_priced'|'coalition_joined'|'coalition_refused'|
 * 'casus_alliance_obligation'|'mirror_obligation_discharged'|
 * 'coalition_expenditure_read'|'coalition_stayed'|'coalition_separate_peace'|
 * 'coalition_apportionment'|'coalition_spoils_divided'|'coalition_debt_paid'|
 * 'coalition_debt_unpaid'} WarCoalitionReceiptKind */
/** @typedef {{kind:WarCoalitionReceiptKind,significance:'major'|'notable',
 * audience:'public',section:'war'|'trade'|'events'|'adjudication',
 * pool:readonly ProseVariant[],requiredSlots:ReadonlyArray<readonly string[]>}} WarCoalitionReceiptRegistryEntry */

/**
 * @param {WarCoalitionReceiptKind} kind
 * @param {'major'|'notable'} significance
 * @param {'war'|'trade'|'events'|'adjudication'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<WarCoalitionReceiptRegistryEntry>}
 */
function warCoalitionKindRow(kind, significance, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience: 'public',
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<WarCoalitionReceiptRegistryEntry>>} */
export const WAR_COALITION_KIND_REGISTRY = Object.freeze([
  warCoalitionKindRow('coalition_entry_priced', 'notable', 'war',
    [['settlement', 'counterpart'], [], [], ['band'], []]),
  warCoalitionKindRow('coalition_joined', 'major', 'war',
    [['settlement', 'third_party'], ['route'], [], [], ['settlement']]),
  warCoalitionKindRow('coalition_refused', 'major', 'war',
    [[], ['settlement', 'route'], ['settlement', 'counterpart'], [], []]),
  warCoalitionKindRow('casus_alliance_obligation', 'notable', 'war',
    [['settlement', 'counterpart'], [], [], [], ['third_party']]),
  warCoalitionKindRow('mirror_obligation_discharged', 'notable', 'events',
    [['settlement'], [], [], [], []]),
  warCoalitionKindRow('coalition_expenditure_read', 'notable', 'trade',
    // Every family is confined to the evidence-bounded current-episode read;
    // no historic stores, named losses, healed damage, or lifetime total is
    // inferred from an absent ledger.
    [['settlement', 'band'], [], [], [], []]),
  warCoalitionKindRow('coalition_stayed', 'notable', 'war',
    // Staying does not imply that the borrowed cause ended.
    [[], ['settlement', 'third_party'], [], [], []]),
  warCoalitionKindRow('coalition_separate_peace', 'major', 'adjudication',
    [[], ['settlement', 'third_party'], [], [], []]),
  warCoalitionKindRow('coalition_apportionment', 'major', 'adjudication',
    [['settlement', 'band', 'good'], [], [], [], []]),
  warCoalitionKindRow('coalition_spoils_divided', 'major', 'trade',
    [[], ['settlement', 'band', 'good'], [], [], []]),
  warCoalitionKindRow('coalition_debt_paid', 'notable', 'trade',
    [[], ['counterpart', 'settlement'], [], ['route'], []]),
  warCoalitionKindRow('coalition_debt_unpaid', 'major', 'trade',
    [[], ['settlement', 'counterpart', 'route'], ['good'], [], []]),
]);

/** The exact WR-6 governed reader-kind set. */
export const WAR_COALITION_KINDS = Object.freeze(
  WAR_COALITION_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<WarCoalitionReceiptRegistryEntry>>} */
const WAR_COALITION_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<WarCoalitionReceiptRegistryEntry>]>} */ (
    WAR_COALITION_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-6 sentence from exact supplied truths. Missing slots remove
 * only the families that name them; unknown kinds stay closed, and a slotless
 * authored sibling is always preferred to fabricated identity or scalar prose.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function warCoalitionReceipt(kind, seed, interp = {}) {
  const row = WAR_COALITION_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
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
    // W-E (J-D4): the ground the settlers actually chose, named in-world. Selected
    // only when the founding SAMPLED the frozen spatial rasters (a spatial world);
    // an aspatial founding keeps summary_growth, so no existing world's prose moves.
    summary_site: [
      (x) => `${x.debit} settlers out of ${x.parent} have raised the steading of ${x.name} on ${x.place}.`, // canonical
      (x) => `${x.debit} settlers have set the steading of ${x.name} down on ${x.place}, a day out of ${x.parent}.`,
      (x) => `The steading of ${x.name} has taken root on ${x.place}, raised by ${x.debit} settlers out of ${x.parent}.`,
      (x) => `Out of ${x.parent}, ${x.debit} settlers have raised the steading of ${x.name} on ${x.place}.`,
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
