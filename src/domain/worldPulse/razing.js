/**
 * razing.js — WR-8 amendments R + R2: THE THIRD INTENT.
 *
 * N3 named two goals a victor can hold: TAKE IT (conquest) or PRICE IT (terms).
 * R adds the third: PUNISH IT. The sack is war as sentence rather than
 * acquisition — the grievance is discharged in fire, and the victor walks home.
 *
 * ── WHAT THIS LEAF IS, AND WHAT IT DELIBERATELY IS NOT ──────────────────────
 * It is the LAW of the razing: the gates that decide whether one may happen, the
 * conserved arithmetic of what a sack does to a population, the disposition of
 * what was standing, the material self-limits, and the receipts. It holds NO
 * IMPORTS AT ALL, exactly like `conquestIntent.js` and `conquestExecution.js`,
 * for the reason those two do: a law that can reach into the world acquires the
 * ability to be quietly conditioned by it, and every one of the gates below is a
 * gate whose whole value is that nothing can lean on it.
 *
 * It is NOT the tier writer, and that is a ruling rather than an omission. See
 * THE TIER FOLLOWS THE TRUTH below.
 *
 * It is also NOT the license ledger. Whether a would-be avenger HOLDS a license
 * is a persisted world fact and lives in `vengeanceLicense.js`; this module takes
 * the answer as a boolean and asks only what it unlocks.
 *
 * ── LAW 1: INITIATION IS EVIL-EXCLUSIVE, AND IT IS A BOUNDARY ───────────────
 * R2, binding: "evil settlements are the only ones that can initiate a
 * sacking/razing... No pressure, no deception, no dice sequence opens it." This
 * is the one place in the whole war program where alignment is a CAPABILITY
 * BOUNDARY rather than a weight — amendment B lets alignment tilt motive
 * everywhere else, and here it decides reachability outright.
 *
 * THE STRUCTURAL GUARANTEE, not a tendency in a number: `razingGate` reaches the
 * `initiation` road through exactly one expression, `razingInitiationPermitted`,
 * which consults NOTHING but the actor's own alignment band. Because the band
 * vocabulary is closed and small, a pin can WALK it exhaustively and prove that
 * no other input — not siege, not extremity, not severity, not a planted belief
 * about who the neighbour serves — can carry a non-evil court onto that road.
 * The deception road that reaches conquest intent (N3/I4) stops at the door.
 *
 * ── LAW 2: THE GATE IS DOUBLE, AND THE NEGATIVE CASE PINS HARDEST ───────────
 * R: "the relationship at its authored EXTREME band AND a won siege." A
 * victorious besieger whose relationship is merely bad chooses occupation or
 * terms; "razing from mild enmity must be UNREACHABLE, or every war ends in ash
 * and the acquisition ladder is decoration."
 *
 * WHAT "EXTREME" MEANS, AND WHY IT IS A COMPOSITE (chair block CR-WR8-A..D,
 * 2026-08-03, vetoable). The substrate audit found the scalar reading
 * unbuildable: relationship axes mean-revert toward their type baseline at
 * ~0.12/tick while a license persists a generational band, and no type baseline
 * exceeds hostile's resentment 0.78 — so "the axes at their authored extreme"
 * resolves to either nearly-unreachable or ubiquitous depending on where the
 * band is put, and the band was never named. The ruling makes extremity a
 * THREE-PART CONJUNCTION:
 *   (1) the edge TYPE is `hostile` — durable structure, which is what survives
 *       the axis decay, and which the razing itself sets (LAW 5);
 *   (2) resentment at or above HOSTILE's OWN type baseline (0.78) — the axis
 *       must be at least as hot as the structure already implies, so a hostile
 *       edge cooling toward its floor is not extreme;
 *   (3) a LIVE grievance or atrocity-casus against the counterpart at or above
 *       the LICENSE-ADEQUACY band.
 * The type conjunct makes extremity REACHABLE; the live-grievance conjunct
 * breaks UBIQUITY. J-WR-10 is honored: no new relationship vocabulary is minted
 * anywhere in this file — `hostile` is `relationshipState.js`'s word, 0.78 is
 * that module's own `hostile.resentment` default, and the adequacy band is ONE
 * number reused rather than a family of new ones.
 *
 * THE SAME COMPOSITE SERVES THREE MASTERS, which is why it is a function and not
 * three inlined predicates: R's own extremity gate, the extremity NEGATIVE-case
 * pin (victorious-but-not-extreme cannot raze — writable in both directions
 * because the composite is), and R2's license coupling.
 *
 * ── LAW 3: DEATHS, NOT DEPARTURES — AND CONSERVED TO THE PERSON ─────────────
 * Owner, binding: the razing's population loss is IMMEDIATE death, not
 * emigration; a SMALL banded escape share flees as refugees ("the broadcast
 * needs survivors — someone carries the story down the road"); and THE NAMED
 * CAST IS NEVER ENGINE-KILLED — named NPCs disperse into roaming, carrying the
 * grievance personally.
 *
 * `conservedSack` is arithmetic, and its post-condition is an identity rather
 * than a tolerance: deaths + escapees + namedRoaming + survivors EQUALS the
 * population it was handed, exactly, in whole people. The three non-survivor
 * buckets are filled in the order the law's own priorities imply — the named
 * cast first, because "never engine-killed" is absolute and must not be a
 * rounding accident; then the banded escape share of what remains; then the
 * dead, who are the remainder. Deaths-dominant falls out of the band rather
 * than being asserted.
 *
 * ── LAW 4: THE TIER FOLLOWS THE TRUTH (chair ruling CR-WR8-F, 2026-08-03,
 * vetoable) ─────────────────────────────────────────────────────────────────
 * THE RAZING FORCES NO TIER. The volume's own §0b law says demotion is never a
 * second writer, and the ruling holds it literally: the sack writes POPULATION,
 * and `tierEligibility`'s single population law (pop < currentMin * 0.82) reads
 * the new truth and decides. Nothing in this file computes, proposes, or targets
 * a tier.
 *
 * That RETIRES the volume's own 2026-08-02 self-audit correction, which had
 * inverted the derivation so that sack severity picked a TARGET RUNG and the
 * death fraction derived from it. The inversion was written to guarantee the
 * "one or two tiers" clause, and the ruling declines that guarantee: if a light
 * sack demotes nothing, that is the world being honest, and the descriptor below
 * says so. `tierFallDescriptor` therefore reads tiers AFTER the fact and is a
 * RECEIPT DESCRIPTOR — how many rungs actually fell — never an input, and the
 * signature enforces it (it cannot see severity, and nothing that computes
 * severity can see it).
 *
 * ── LAW 5: THE EDGE TYPE FLIPS (chair ruling CR-WR8-A, vetoable) ────────────
 * A razing mints NO EDGE TO STRANGERS — relationship states exist per regional-
 * graph neighbour edge, and a razer who is nobody's neighbour has no object to
 * drive to an extreme. What the razing DOES do is flip the TYPE to `hostile` on
 * every EXISTING victim-adequate edge the razer shares with a license holder.
 * The durable structure carries the memory while the axes spike and decay as
 * they always do, and the healing lattice may re-type the edge over years — at
 * which point the license decouples on its own, with no expiry machinery
 * required to notice. The D5 `undying` memoryHorizon arm was explicitly NOT
 * taken (recorded, re-openable with INT-5).
 *
 * ── LAW 6: AND THEY LEAVE ───────────────────────────────────────────────────
 * No occupation record, no garrison, no vassal ledger, no terms. The departure
 * IS the signature, and the Herald sentence is "They burned Thornwall and rode
 * home." Structurally the sack dodges amendment N's inheritance brake — all of
 * the punishment, none of the responsibility — so its price lands entirely on
 * the moral ledger, which is exactly why R2 exists.
 *
 * ── LAW 7: WHAT SELF-LIMITS IT, WITH NO PACIFISM TERM ANYWHERE ──────────────
 * TWO self-limits, and they are NOT the same KIND of limit. Saying so is the
 * point: the earlier reading of this law claimed both were structural, and only
 * one of them is.
 *
 *   (1) ASH PAYS NO TRIBUTE — a PRICE, and a CONDITIONAL one. A sack yields
 *       one-time plunder against terms' streams of years, so holding out-earns
 *       burning ONLY ABOVE A CROSSOVER in (annual draw x horizon). Measured at
 *       the shipped PLUNDER_SHARE 0.6: against a tributary paying 15% a year,
 *       razing is materially RICHER for any horizon under about four years, and
 *       against one paying 1% it is richer across thirty. So this limit prices
 *       punishment as a luxury for a realm that expects to HOLD what it takes,
 *       and prices it as a BARGAIN for one that expects the peace to collapse
 *       anyway — which is a design fact worth owning rather than a bug, because
 *       "the war was going to end badly regardless" is exactly the state a realm
 *       burns a town from. It is NOT a rule against burning, and this file has
 *       no pacifism term. The crossover is walked and pinned in razingWr8.test.js.
 *
 *   (2) RAZING THE SAME REMNANT TWICE YIELDS NOTHING — STRUCTURAL, and absolute.
 *       A settlement already at or under the skeleton floor loses nobody and
 *       yields no plunder, because both quantities are computed from the room
 *       above the floor. No tuning reaches it and no rule states it.
 *
 * PURE: no rng, no wall-clock, no mutation, no state, NO IMPORTS. Deterministic
 * over its arguments. Strict-clean.
 */

/** The two roads onto the razing. There is no third, and none is minted. */
export const RAZING_ROADS = Object.freeze(['initiation', 'vengeance']);

/**
 * THE RAZING OUTCOME ID, SPELLED ONCE (WR-8 amendment R2, the believed-razing
 * casus). The emission MINTS this id and the observer's read model RECONSTRUCTS
 * it — and both call this function, because the alternative is a format string
 * hand-copied into a reader, which is the writer/reader payload-spelling class
 * this codebase has already been bitten by. One spelling cannot drift from
 * itself.
 *
 * ⚠️⚠️ ATTRIBUTION IS BY PROOF, NOT BY PARSING, AND THE SHAPE IS WHY. Settlement
 * ids may contain dots, so splitting this id on `.` cannot reliably recover the
 * razer — a reader that tried would mis-attribute an atrocity, which through R2's
 * license machinery is a warrant to burn a city. The reader instead RE-MINTS the
 * id from a candidate (accused, victim, tick, road) and compares for EQUALITY.
 * A candidate that does not reconstruct exactly is not the razer, whatever its
 * id contains.
 *
 * ⚠️ THE ROAD RIDES IN THE ID, and that is the whole reason it was added. The
 * JUST razing — a vengeance answer executed under a license R2 already granted —
 * must NOT raise a fresh atrocity casus against the avenger, or the world's moral
 * ledger becomes a perpetual-motion machine: every answer manufactures the next
 * grievance. Carrying the road makes that polarity decidable BY RECONSTRUCTION
 * over the closed `RAZING_ROADS` vocabulary, with no second surface to persist
 * and nothing for a reader to look up.
 *
 * @param {{ road?: unknown, razerId?: unknown, victimId?: unknown, tick?: unknown }} args
 * @returns {string} the id, or '' when the road is not one of RAZING_ROADS or an
 *   endpoint is missing — an unspellable id is never guessed at.
 */
export function razingOutcomeIdFor({ road, razerId, victimId, tick } = {}) {
  const lane = String(road ?? '');
  if (!RAZING_ROADS.includes(lane)) return '';
  const razer = String(razerId ?? '');
  const victim = String(victimId ?? '');
  if (!razer || !victim) return '';
  return `world_outcome.razing.${lane}.${razer}.${victim}.${Math.trunc(Number(tick) || 0)}`;
}

/**
 * Why a razing did not happen, as a closed vocabulary. Every refusal below names
 * exactly one of these, so a pin can assert the REASON and not merely the
 * refusal — a gate that refuses for the wrong reason is a gate that will open
 * for the wrong reason later.
 */
export const RAZING_REFUSALS = Object.freeze([
  'no_siege',
  'not_extreme',
  'alignment_forbids_initiation',
  'license_absent',
  'nothing_left',
  // WR-8 amendment R, THE DETERRENT: "a fat victim with devoted friends is
  // expensive to burn; a friendless one is cheap." This refusal is APPETITE, not
  // permission — it can only ever turn a PERMITTED verdict down, never open a
  // road the law closed, which is why it is applied last (see razingGate).
  'deterrence_prohibitive',
]);

/**
 * The alignment vocabulary this gate reads, closed so the initiation walk can be
 * EXHAUSTIVE. `unknown` is a real member and is refused: an unread alignment is
 * not an evil one, and the strict direction is the one that keeps the razing
 * rare.
 */
export const RAZING_ALIGNMENT_BANDS = Object.freeze([
  'unknown', 'benevolent', 'balanced', 'malicious',
]);

/**
 * The ONE band that may initiate. A single-member list rather than a comparison,
 * because "only the wicked burn first" is a membership fact and a pin should be
 * able to read it as one.
 */
export const RAZING_INITIATION_BANDS = Object.freeze(['malicious']);

export const RAZING_TUNING = Object.freeze({
  // ── THE EXTREMITY COMPOSITE (CR-WR8-B) ───────────────────────────────────
  // The edge TYPE conjunct. `hostile` is relationshipState.js's own word; it is
  // spelled here rather than imported for the reason conquestExecution.js
  // re-declares the occupation ladder — a leaf must not acquire a reach it does
  // not otherwise need, and a drift between the two spellings is caught by a
  // pin rather than by a comment.
  EXTREME_EDGE_TYPE: 'hostile',
  // The resentment conjunct: hostile's OWN authored type baseline, verbatim from
  // RELATIONSHIP_DEFAULTS.hostile.resentment. Reading the baseline as the bar is
  // what makes the conjunct mean "at least as hot as the structure implies"
  // rather than a number somebody picked.
  HOSTILE_RESENTMENT_BASELINE: 0.78,
  // ⚠️ THE LICENSE-ADEQUACY BAND IS ONE NUMBER, USED IN THREE PLACES, AND THAT
  // IS THE RULING RATHER THAN AN ECONOMY. CR-WR8-B says "one band reused, none
  // minted". It is (a) the live-grievance floor in the extremity composite, (b)
  // the floor a bystander's relationship to the VICTIM must clear to be minted a
  // license, and (c) the floor an edge must clear to be flipped hostile by LAW 5.
  // Splitting it into three tunables would be three numbers nobody could check
  // against each other, and the coupling between them is the design.
  LICENSE_ADEQUACY_01: 0.6,

  // ── THE CONSERVED SACK (LAW 3) ───────────────────────────────────────────
  // The loss band, read off warDeployment's conserved sack/forage core as the
  // amendment instructs ("the razing is its settlement-scale harsher sibling,
  // same conservation discipline, bigger fractions, deaths-dominant"). That
  // core takes SACK_POP_FRACTION = 0.08 of a stormed town; a razing at its
  // gentlest takes three times that and at its worst takes most of the place.
  LOSS_FRACTION_MIN: 0.24,
  LOSS_FRACTION_MAX: 0.72,
  // "Some may escape, but this is a razing and a sacking." The share is small on
  // purpose: the broadcast needs survivors, and deaths-dominant is the law.
  ESCAPE_SHARE: 0.12,
  // The skeleton floor, the warDeployment SACK_POP_FLOOR idiom at settlement
  // scale: a razing is not an annihilation (which is a SEPARATE ending in the
  // endings mix, and must stay separable in the soak). This floor is also what
  // makes LAW 7's second self-limit structural rather than tuned.
  SKELETON_FLOOR: 40,

  // ── WHAT WAS STANDING (LAW 6's "what stands, stands dark") ───────────────
  // Above this severity an institution is a SHELL — the building remembers what
  // it was and does nothing; at or below it the institution is IMPAIRED. Both
  // words are K1's, not this file's.
  SHELL_SEVERITY: 0.55,

  // ── THE MATERIAL SELF-LIMIT (LAW 7) ──────────────────────────────────────
  // What share of a settlement's movable wealth an army carries off. Generous on
  // purpose — the self-limit is not that plunder is small, it is that plunder
  // happens ONCE and the stream is gone forever.
  PLUNDER_SHARE: 0.6,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {number} */
function clamp01(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** @param {number} value @returns {number} 4-dp round, the repo's byte-tidy float */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/**
 * A whole non-negative head count, or null when the value was NOT READ.
 *
 * ⚠️ `Number(null)` IS 0, AND 0 IS A RUIN. The distinction conquestExecution.js
 * draws for capacities is the same one a population needs, and here it is
 * sharper: an unread population coerced to zero would make every settlement look
 * like a place with nothing left to lose, which is precisely the state LAW 7
 * uses to refuse a second razing. So an unreadable count refuses rather than
 * flattering the razer.
 * @param {unknown} value @returns {number|null}
 */
function headCount(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// LAW 2 — THE EXTREMITY COMPOSITE (CR-WR8-B).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} ExtremityRead
 * @property {boolean} extreme          all three conjuncts met
 * @property {boolean} edgeTypeMet      the durable structure is hostile
 * @property {boolean} resentmentMet    the axis is at/above hostile's own baseline
 * @property {boolean} grievanceMet     a live grievance at/above the adequacy band
 * @property {string[]} missing         which conjuncts failed, in declaration order
 * @property {string} receipt           the world's own sentence about the relationship
 */

/**
 * THE EXTREMITY READ, as a three-part conjunction. Serves R's own gate, the
 * extremity negative-case pin, and R2's license coupling — one function, so the
 * three can never drift apart.
 *
 * A NOTE ON WHAT `grievance01` IS. It is the magnitude of a LIVE grievance or
 * atrocity-casus this party holds against the counterpart — the war layer's own
 * cause magnitude, already banded by the machinery that owns causes. This leaf
 * neither derives nor decays it; it reads the number and compares it to the one
 * adequacy band. A grievance that has decayed out of liveness arrives as 0, and
 * the conjunct fails, which is exactly the ubiquity brake the ruling wanted.
 *
 * @param {{ edgeType?: unknown, resentment01?: unknown, grievance01?: unknown,
 *   partyId?: unknown, counterpartId?: unknown }} input
 * @returns {ExtremityRead}
 */
export function readRelationshipExtremity(input) {
  const row = recordOf(input);
  const T = RAZING_TUNING;
  const partyId = text(row.partyId) || 'the court';
  const counterpartId = text(row.counterpartId) || 'its neighbour';
  const edgeType = text(row.edgeType);
  const resentment = clamp01(row.resentment01);
  const grievance = clamp01(row.grievance01);

  const edgeTypeMet = edgeType === T.EXTREME_EDGE_TYPE;
  const resentmentMet = resentment >= T.HOSTILE_RESENTMENT_BASELINE;
  const grievanceMet = grievance >= T.LICENSE_ADEQUACY_01;

  /** @type {string[]} */
  const missing = [];
  if (!edgeTypeMet) missing.push('edge_type');
  if (!resentmentMet) missing.push('resentment');
  if (!grievanceMet) missing.push('live_grievance');
  const extreme = missing.length === 0;

  const receipt = extreme
    ? `${partyId} stands at the extreme with ${counterpartId}: the border is openly hostile,`
      + ` the resentment (${round4(resentment)}) is at what open hostility itself implies, and the`
      + ` grievance between them is still live (${round4(grievance)}).`
    : `${partyId} is not at the extreme with ${counterpartId} — ${missing.length === 3
      ? 'the border is not hostile, the resentment has not reached what hostility implies, and no live grievance stands'
      : missing.map((m) => (
        m === 'edge_type'
          ? `the border is ${edgeType || 'unread'} rather than hostile`
          : m === 'resentment'
            ? `the resentment (${round4(resentment)}) is under what open hostility itself implies (${T.HOSTILE_RESENTMENT_BASELINE})`
            : `no live grievance stands between them (${round4(grievance)})`
      )).join(', ')}.`;

  return { extreme, edgeTypeMet, resentmentMet, grievanceMet, missing, receipt };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAW 1 — INITIATION IS EVIL-EXCLUSIVE.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * May this court initiate a razing? Consults NOTHING but its own alignment band.
 *
 * The narrowness of this signature IS the law. There is no expression in this
 * module through which pressure, deception, a planted belief, a won siege, a
 * severity roll, or an extremity read could reach the `initiation` road, because
 * this is the only door onto it and it can see none of them.
 *
 * @param {unknown} alignmentBand one of RAZING_ALIGNMENT_BANDS
 * @returns {boolean}
 */
export function razingInitiationPermitted(alignmentBand) {
  return RAZING_INITIATION_BANDS.includes(text(alignmentBand));
}

// ─────────────────────────────────────────────────────────────────────────────
// LAW 2 — THE DOUBLE GATE, AND R2's COUPLING.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} RazingVerdict
 * @property {boolean} permitted
 * @property {string|null} road      one of RAZING_ROADS when permitted
 * @property {string|null} refusal   one of RAZING_REFUSALS when refused
 * @property {string} receipt
 */

/**
 * THE FULL GATE. Two roads reach a razing and both are double-gated.
 *
 *   INITIATION — evil alignment AND own-extremity AND a won siege.
 *   VENGEANCE  — a held license AND own-extremity AND a won siege, at ANY
 *                alignment. R2: the license "legitimizes ONE war of retribution
 *                whose razing intent is unlocked REGARDLESS of alignment", and
 *                the coupling clause makes it NECESSARY, NEVER SUFFICIENT: "you
 *                do not burn a city you are merely angry at, even licensed."
 *
 * THE ORDER OF REFUSALS IS DELIBERATE and is itself pinned. The siege is checked
 * first because it is the cheapest fact and the least arguable; extremity next,
 * because it is the gate the amendment says must pin hardest; and only then the
 * road-specific credential. A gate that reported `license_absent` for a court
 * that never won a siege would be telling the truth about the wrong thing, and
 * the receipts are read by people.
 *
 * WHY THE LICENSE IS CHECKED AFTER ALIGNMENT FAILS RATHER THAN BEFORE. An evil
 * court holding a license takes the `initiation` road, not the `vengeance` one:
 * it did not need the license, so consuming one would let an evil realm launder
 * an ordinary atrocity as an answer to somebody else's, and R2's whole moral
 * economy turns on the two being counted separately (the endings envelope tracks
 * their ratio as a health metric).
 *
 * ⚠️ THE DETERRENT IS APPLIED LAST, AND ONLY DOWNWARD (amendment R). The believed
 * retaliation web is priced BEFORE the act, and what it prices is APPETITE, not
 * permission: `deterred` can turn a PERMITTED verdict into a refusal and can
 * never do the reverse. It is checked after the road resolves rather than before,
 * for the same reason the license is checked after alignment — a court that could
 * not have burned the town anyway must not be told it was frightened off. The
 * receipts are read by people, and "deterred" is a claim about a choice.
 *
 * Absent (`deterred` not true) ⇒ the verdict is EXACTLY what it was before this
 * conjunct existed, so every pre-deterrence caller and every dark world is
 * byte-identical.
 *
 * @param {{ siegeWon?: unknown, extremity?: ExtremityRead|null|undefined,
 *   alignmentBand?: unknown, licenseHeld?: unknown,
 *   actorId?: unknown, victimId?: unknown,
 *   deterred?: unknown, deterrenceReceipt?: unknown }} input
 * @returns {RazingVerdict}
 */
export function razingGate(input) {
  const row = recordOf(input);
  const actorId = text(row.actorId) || 'the victor';
  const victimId = text(row.victimId) || 'the defeated';
  const extremity = recordOf(row.extremity);
  /** The deterrent's one expression: a permitted road, declined.
   *  @param {string} road one of RAZING_ROADS @returns {RazingVerdict} */
  const deterredFrom = (road) => ({
    permitted: false,
    road: null,
    refusal: 'deterrence_prohibitive',
    receipt: `${actorId} took ${victimId} and could have burned it by ${road}, and did not:`
      + ` ${text(row.deterrenceReceipt) || 'the friends the burning would arm are too many'}.`
      + ' The army rode home and the town still stands.',
  });

  if (row.siegeWon !== true) {
    return {
      permitted: false,
      road: null,
      refusal: 'no_siege',
      receipt: `${actorId} has not taken ${victimId}: there is no razing without a won siege.`,
    };
  }
  if (extremity.extreme !== true) {
    return {
      permitted: false,
      road: null,
      refusal: 'not_extreme',
      receipt: `${actorId} took ${victimId} and will not burn it: ${text(extremity.receipt)
        || 'the relationship never reached the extreme'} A victor whose quarrel is merely bad`
        + ' holds the walls or names its terms.',
    };
  }
  if (razingInitiationPermitted(row.alignmentBand)) {
    return row.deterred === true ? deterredFrom('initiation') : {
      permitted: true,
      road: 'initiation',
      refusal: null,
      receipt: `${actorId} took ${victimId} and means to burn it. Only the wicked burn first,`
        + ' and this is a court that will.',
    };
  }
  if (row.licenseHeld === true) {
    return row.deterred === true ? deterredFrom('vengeance') : {
      permitted: true,
      road: 'vengeance',
      refusal: null,
      receipt: `${actorId} took ${victimId} and holds the right of vengeance against it. The`
        + ' license legalizes what the quarrel had already reached: it does not create the quarrel.',
    };
  }
  return {
    permitted: false,
    road: null,
    refusal: 'alignment_forbids_initiation',
    receipt: `${actorId} took ${victimId} and hates it, and still will not burn it: only the`
      + ' wicked burn first, and no license names this court an avenger.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAW 3 — THE CONSERVED SACK.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} SackAccounting
 * @property {boolean} known         false when the population could not be read
 * @property {number} population     what was handed in, rounded to whole people
 * @property {number} losses         everyone who is no longer counted here
 * @property {number} deaths
 * @property {number} escapees       refugees; the broadcast's survivors
 * @property {number} namedRoaming   named cast dispersed, NEVER killed
 * @property {number} survivors
 * @property {number} lossFraction   the derived fraction, receipted
 * @property {boolean} nothingLeft   already at/under the skeleton floor
 * @property {string} receipt
 */

/**
 * THE SACK ARITHMETIC, CONSERVED TO THE PERSON.
 *
 * The post-condition is an identity and the pin asserts it as one:
 *   deaths + escapees + namedRoaming + survivors === population
 * in whole people, for every input. Rounding is therefore done ONCE, on the
 * losses, and every other bucket is a subtraction — a shape chosen precisely
 * because independently-rounded buckets are how conservation laws quietly stop
 * holding at the third decimal place.
 *
 * THE ORDER OF FILLING IS THE LAW'S OWN PRIORITY ORDER. The named cast is taken
 * out first, because "never engine-killed" is absolute and must not be a
 * rounding accident. Then the banded escape share of what remains. The dead are
 * the remainder, which is why deaths-dominant is a consequence of the band
 * rather than an assertion.
 *
 * ⚠️ THE SEVERITY IS AN INPUT AND THE TIER IS NOT AN OUTPUT (CR-WR8-F). This
 * function returns people. Nothing here names, computes, targets, or proposes a
 * tier; `tierEligibility` reads the new population and decides on its own.
 *
 * @param {{ population?: unknown, severity01?: unknown, namedCastCount?: unknown }} input
 * @returns {SackAccounting}
 */
export function conservedSack(input) {
  const row = recordOf(input);
  const T = RAZING_TUNING;
  const population = headCount(row.population);
  if (population == null) {
    return {
      known: false,
      population: 0,
      losses: 0,
      deaths: 0,
      escapees: 0,
      namedRoaming: 0,
      survivors: 0,
      lossFraction: 0,
      nothingLeft: true,
      receipt: 'the settlement cannot be counted, and an uncounted place cannot be sacked.',
    };
  }
  const severity = clamp01(row.severity01);
  const named = Math.max(0, headCount(row.namedCastCount) ?? 0);

  // THE ROOM ABOVE THE FLOOR is the whole of LAW 7's second self-limit. A
  // remnant at or under the skeleton floor has no room, so losses are zero, no
  // matter how severe the sack or how willing the army: razing the same remnant
  // twice yields nothing, structurally rather than by a rule that says so.
  const room = Math.max(0, population - T.SKELETON_FLOOR);
  const fraction = T.LOSS_FRACTION_MIN + severity * (T.LOSS_FRACTION_MAX - T.LOSS_FRACTION_MIN);
  const losses = Math.min(Math.round(population * fraction), room);

  const namedRoaming = Math.min(named, losses);
  const remainder = losses - namedRoaming;
  const escapees = Math.round(remainder * T.ESCAPE_SHARE);
  const deaths = remainder - escapees;
  const survivors = population - losses;

  const nothingLeft = losses <= 0;
  return {
    known: true,
    population,
    losses,
    deaths,
    escapees,
    namedRoaming,
    survivors,
    lossFraction: round4(fraction),
    nothingLeft,
    receipt: nothingLeft
      ? `there is nothing left in ${population === 0 ? 'the ash' : 'this place'} to take:`
        + ` ${population} souls is at or under what a sack leaves standing, and an army that burns`
        + ' a ruin burns a ruin.'
      : `${deaths} dead, ${escapees} fled down the road, ${namedRoaming} scattered`
        + ` and named, ${survivors} left in the ash.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAW 4 — THE TIER FOLLOWS THE TRUTH (descriptor only).
// ─────────────────────────────────────────────────────────────────────────────

/** The rung-count words, closed. `more` exists because the world may be honest. */
export const TIER_FALL_BANDS = Object.freeze(['none', 'one', 'two', 'more']);

/**
 * ⚠️⚠️ A RECEIPT DESCRIPTOR, NOT A DERIVATION (CR-WR8-F). This reads the tier
 * the world settled on AFTER the sack and says how many rungs fell. It is the
 * volume's "one or two tiers" clause turned into a thing the Herald can say,
 * and it is deliberately DOWNSTREAM of the truth: its signature cannot see
 * severity, population, or the sack at all, so it is structurally incapable of
 * being the thing that decided.
 *
 * IF NOTHING FELL, IT SAYS SO. A light sack that leaves the tier standing is the
 * world being honest, and the `none` band exists to report exactly that rather
 * than to be an error state.
 *
 * @param {{ tierBefore?: unknown, tierAfter?: unknown, tierOrder?: unknown,
 *   settlementName?: unknown }} input
 * @returns {{ known: boolean, rungsFallen: number, band: string, receipt: string }}
 */
export function tierFallDescriptor(input) {
  const row = recordOf(input);
  const order = Array.isArray(row.tierOrder) ? row.tierOrder.map((t) => text(t)) : [];
  const before = text(row.tierBefore);
  const after = text(row.tierAfter);
  const name = text(row.settlementName) || 'the settlement';
  const iBefore = order.indexOf(before);
  const iAfter = order.indexOf(after);
  if (iBefore < 0 || iAfter < 0) {
    return {
      known: false,
      rungsFallen: 0,
      band: 'none',
      receipt: `what ${name} was and what it is now cannot both be read, so no fall can be counted.`,
    };
  }
  const rungsFallen = Math.max(0, iBefore - iAfter);
  const band = rungsFallen === 0 ? 'none' : rungsFallen === 1 ? 'one' : rungsFallen === 2 ? 'two' : 'more';
  return {
    known: true,
    rungsFallen,
    band,
    receipt: rungsFallen === 0
      ? `${name} burned and is still a ${before}: the fire took its people and not its standing.`
      : `${name} fell from ${before} to ${after} — ${rungsFallen === 1 ? 'one rung' : `${rungsFallen} rungs`}.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAW 5 — THE EDGE-TYPE FLIP (CR-WR8-A).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WHICH EXISTING EDGES THE RAZING RE-TYPES.
 *
 * ⚠️ IT MINTS NOTHING. The input is the set of edges that ALREADY EXIST between
 * the razer and someone else; the output is the subset whose type should become
 * `hostile`. A holder who shares no edge with the razer appears in neither, and
 * that is the ruling rather than a gap: relationship states exist per regional-
 * graph neighbour edge, and R's razer typically burns and rides home from
 * somewhere else entirely.
 *
 * VICTIM-ADEQUATE, NOT MERELY PRESENT. The flip lands on edges the holder shares
 * with the RAZER, gated on that holder's relationship to the VICTIM clearing the
 * one adequacy band — the same band the license itself mints on. An indifferent
 * neighbour of the razer does not become its enemy because a stranger burned.
 *
 * ALREADY-HOSTILE EDGES ARE REPORTED AS UNCHANGED rather than silently included,
 * so a consumer can tell "the razing made this enemy" from "this was already an
 * enemy" — which matters, because the flip is what carries the memory past the
 * axis decay, and an edge that was already hostile carries no new memory.
 *
 * @param {Array<{ holderId?: unknown, edgeType?: unknown,
 *   adequacyToVictim01?: unknown }>} edges
 * @returns {{ flipped: Array<{ holderId: string, fromType: string, toType: string }>,
 *   unchanged: Array<{ holderId: string, type: string, why: string }> }}
 */
export function razingEdgeFlips(edges) {
  const T = RAZING_TUNING;
  const rows = Array.isArray(edges) ? edges : [];
  /** @type {Array<{ holderId: string, fromType: string, toType: string }>} */
  const flipped = [];
  /** @type {Array<{ holderId: string, type: string, why: string }>} */
  const unchanged = [];
  for (const raw of rows) {
    const row = recordOf(raw);
    const holderId = text(row.holderId);
    if (!holderId) continue;
    const fromType = text(row.edgeType);
    const adequacy = clamp01(row.adequacyToVictim01);
    if (adequacy < T.LICENSE_ADEQUACY_01) {
      unchanged.push({ holderId, type: fromType, why: 'not_victim_adequate' });
      continue;
    }
    if (fromType === T.EXTREME_EDGE_TYPE) {
      unchanged.push({ holderId, type: fromType, why: 'already_hostile' });
      continue;
    }
    flipped.push({ holderId, fromType, toType: T.EXTREME_EDGE_TYPE });
  }
  return { flipped, unchanged };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAW 6 — WHAT STANDS, STANDS DARK; AND THEY LEAVE.
// ─────────────────────────────────────────────────────────────────────────────

/** K1's own status words. Nothing new is minted here. */
export const RAZED_INSTITUTION_STATUSES = Object.freeze(['intact', 'impaired', 'shell']);

/**
 * THE DISPOSITION OF WHAT WAS STANDING. Institutions take damage-impairment or
 * shell per K1's vocabulary; what stands, stands dark. The infrastructure-
 * remembers law makes the razed city's recovery arc real — a town with a city's
 * quiet towers.
 *
 * PROTECTED INSTITUTIONS SURVIVE AS `intact` rather than being dropped from the
 * result, so the caller sees a total census and cannot mistake an omission for
 * an absence.
 *
 * @param {Array<{ id?: unknown, protectedFromSack?: unknown }>} institutions
 * @param {unknown} severity01
 * @returns {Array<{ id: string, status: string }>}
 */
export function razedInstitutions(institutions, severity01) {
  const T = RAZING_TUNING;
  const severity = clamp01(severity01);
  const rows = Array.isArray(institutions) ? institutions : [];
  /** @type {Array<{ id: string, status: string }>} */
  const out = [];
  for (const raw of rows) {
    const row = recordOf(raw);
    const id = text(row.id);
    if (!id) continue;
    if (row.protectedFromSack === true) {
      out.push({ id, status: 'intact' });
      continue;
    }
    out.push({ id, status: severity > T.SHELL_SEVERITY ? 'shell' : 'impaired' });
  }
  return out;
}

/**
 * THE DEPARTURE, WHICH IS THE SIGNATURE. No occupation record, no garrison, no
 * vassal ledger, no terms — the Herald sentence the amendment asks for by name.
 *
 * The function returns the ABSENCES explicitly rather than merely omitting them,
 * because a consumer that has to infer "no occupation" from a missing key is a
 * consumer that will one day infer it from a bug.
 *
 * @param {{ razerName?: unknown, victimName?: unknown }} input
 * @returns {{ occupation: null, garrison: null, terms: null, receipt: string }}
 */
export function razingDeparture(input) {
  const row = recordOf(input);
  const razerName = text(row.razerName) || 'The victor';
  const victimName = text(row.victimName) || 'the settlement';
  return {
    occupation: null,
    garrison: null,
    terms: null,
    receipt: `They burned ${victimName} and rode home.`
      + ` ${razerName} took no ground, left no garrison, and asked for nothing.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAW 7 — ASH PAYS NO TRIBUTE.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WHAT A RAZING YIELDS: one-time plunder, and no stream at all, ever.
 *
 * THE STRUCTURAL SELF-LIMIT LIVES IN THESE TWO LINES. Plunder is computed from
 * the ROOM ABOVE THE SKELETON FLOOR — the same room the sack's losses are capped
 * by — so a remnant already at the floor yields exactly zero however rich it once
 * was, and the second razing of the same place is materially pointless without
 * any rule that says "no second razing". And `tributePerYear` is a hard 0: the
 * departure took the stream with it.
 *
 * THE OTHER SELF-LIMIT IS NOT HERE, and this docstring used to claim it was.
 * Whether burning is dearer than holding is a comparison against a tribute
 * stream this function never sees, it turns on the horizon and the draw the
 * comparison assumes, and below the crossover burning is the RICHER road (see
 * the module header's LAW 7 note, and the walked grid in razingWr8.test.js).
 * `compareSpoils` is where that comparison lives; nothing here decides it.
 *
 * @param {{ movableWealth?: unknown, population?: unknown }} input
 * @returns {{ plunder: number, tributePerYear: number, nothingLeft: boolean, receipt: string }}
 */
export function razingSpoils(input) {
  const row = recordOf(input);
  const T = RAZING_TUNING;
  const wealth = Number(row.movableWealth);
  const population = headCount(row.population);
  const room = population == null ? 0 : Math.max(0, population - T.SKELETON_FLOOR);
  const nothingLeft = room <= 0 || !Number.isFinite(wealth) || wealth <= 0;
  if (nothingLeft) {
    return {
      plunder: 0,
      tributePerYear: 0,
      nothingLeft: true,
      receipt: 'there is nothing in the ash: the army carries off what a ruin has, which is nothing.',
    };
  }
  // The share is taken against the LIVING part of the place — a settlement that
  // is mostly floor is mostly ash already.
  const livingShare = room / Math.max(1, /** @type {number} */ (population));
  const plunder = round4(wealth * T.PLUNDER_SHARE * livingShare);
  return {
    plunder,
    tributePerYear: 0,
    nothingLeft: false,
    receipt: `the army carries off ${plunder} and rides home. There will be no tribute:`
      + ' ash pays none.',
  };
}

/**
 * THE COMPARISON THAT PRICES PUNISHMENT AS THE LUXURY IT IS. One number against
 * the other, over a stated horizon, so the amendment's economic claim is a thing
 * a pin can execute on a real fixture rather than a sentence a reader must
 * believe.
 *
 * @param {{ plunderOnce?: unknown, tributePerYear?: unknown, years?: unknown }} input
 * @returns {{ razingTotal: number, holdingTotal: number, razingIsPoorer: boolean, receipt: string }}
 */
export function compareSpoils(input) {
  const row = recordOf(input);
  const plunderOnce = Number(row.plunderOnce);
  const tribute = Number(row.tributePerYear);
  const years = Number(row.years);
  const razingTotal = round4(Number.isFinite(plunderOnce) && plunderOnce > 0 ? plunderOnce : 0);
  const holdingTotal = round4(
    (Number.isFinite(tribute) && tribute > 0 ? tribute : 0)
    * (Number.isFinite(years) && years > 0 ? years : 0),
  );
  const razingIsPoorer = razingTotal < holdingTotal;
  return {
    razingTotal,
    holdingTotal,
    razingIsPoorer,
    receipt: razingIsPoorer
      ? `burning yields ${razingTotal} once; holding yields ${holdingTotal} over the same years.`
        + ' A realm that razes its neighbours impoverishes its own future taking.'
      : `burning yields ${razingTotal} once against ${holdingTotal} from holding — this was a`
        + ' place worth more dead than alive, which is the rarer and darker case.',
  };
}
