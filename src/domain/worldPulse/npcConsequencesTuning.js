/**
 * domain/worldPulse/npcConsequencesTuning.js — NPC_CONSEQUENCES_TUNING, the ONE house
 * table for the personal consequence economy (design DESIGN_NPC_CONSEQUENCES.md §11).
 *
 * WHY THIS FILE EXISTS, AND WHY IT IS NOT A SECOND TABLE. Design §11 declares one
 * tuning table for the whole W-H program and the H2 header says it explicitly: "H3
 * extends this SAME object with the replacement delay, the rehost pressure curve, the
 * rejection strictness and the pool pressure bands rather than minting a second tuning
 * table beside it." H2 declared the verdict half inside npcVerdictTable.js, which sits
 * at 735 of its 800 permitted lines. Adding H3's bands there would have spent the
 * remaining budget of a file H4 still has to touch, so the table MOVED here verbatim
 * and grew here instead. npcVerdictTable.js RE-EXPORTS it, so every existing importer
 * and every existing pin reads the same object through the same name and nothing
 * downstream can tell the difference. That is a relocation, not a fork: there is still
 * exactly one NPC_CONSEQUENCES_TUNING in the estate.
 *
 * EVERY RATE IS A BAND, EVERY BAND IS SOAK-VETOABLE, and no rate is a bare literal at
 * any call site. A number that appears here and nowhere else is a number the owner can
 * retune by reading one file.
 *
 * ZERO IMPORTS BY DESIGN (the npcLedgerFacets.js / lowDiscrepancy.js leaf posture): a
 * tuning table is reachable from the verdict lane, the circulation lane, the residency
 * lane and the replacement lane, and a table that pulls in a graph would drag that
 * graph into all four.
 *
 * PURE + LAZY: data only. No Date, no Math.random, no store, no React, no I/O.
 *
 * @enforced-by tests/domain/npcVerdictTable.test.js,
 *   tests/domain/npcCirculation.test.js,
 *   tests/domain/npcReplacement.test.js,
 *   tests/domain/npcResidency.test.js
 */

/**
 * NPC_CONSEQUENCES_TUNING (design §11) — the house table shape. Every rate is a band,
 * every band is soak-vetoable, and no rate is a bare literal anywhere else.
 *
 * H2 declared the verdict half. H3 adds the circulation, replacement and residency
 * halves BELOW the H2 keys, in one object, in the order the design lists them.
 */
export const NPC_CONSEQUENCES_TUNING = Object.freeze({
  // ── H2: THE VERDICT HALF (moved verbatim from npcVerdictTable.js) ──────────
  /**
   * The weighted choice for each ELIGIBLE arm, as integer weights against the base
   * verdict. Integers rather than probabilities so the pin can read the table and the
   * reader can see the ratio without arithmetic. `eligible` is the arm's own outcome;
   * `base` is jailed-or-banished, whichever the settlement supports.
   */
  VERDICT_WEIGHTS: Object.freeze({
    // A rival power would rather have an asset abroad than a corpse in a cell, and a
    // compromised official generally knows it. Better than even, not overwhelming.
    rival_power: Object.freeze({ eligible: 55, base: 45 }),
    // A criminal power already inside the walls has somewhere to put them, so the
    // underworld arm carries slightly more pull than the foreign one.
    criminal_institution: Object.freeze({ eligible: 60, base: 40 }),
  }),
  /**
   * The jail sentence, in TICKS. A tick is one advance of whatever interval the DM
   * chose, which makes this a coarse unit; it is the unit H1 already chose for
   * sinceTick and for the exclusion window, and a second time base inside one
   * subsystem would be worse than a coarse one. Recorded as an adjacency.
   */
  JAIL_TERM_TICKS: 8,
  /**
   * The banishment exclusion window, in ticks. NULL means INDEFINITE, which is the
   * default: an edict of banishment does not lapse on a clock, it is lifted by the
   * DM's PARDON verb (design §7). A finite number here makes every new edge windowed.
   */
  BANISHMENT_EXCLUSION_TICKS: null,
  /**
   * A person exposed this many times or more is spoken of one band louder. The repeat
   * offender is the one the whole road has heard of.
   */
  REPEAT_EXPOSURE_NOTORIETY_BUMP_AT: 2,
  /**
   * The alignment-read deadband. An authored conscience score inside this band reads
   * 'neutral'; outside it reads good or evil. Wide enough that one stray trait does
   * not brand somebody.
   */
  ALIGNMENT_READ_DEADBAND: 0.15,

  // ── H3: REPLACEMENT (design §5) ────────────────────────────────────────────
  /**
   * "Shortly after" a slot empties, banded in ticks. The floor is 1 rather than 0
   * because a seat that refills on the very tick it emptied reads as no vacancy at
   * all, and the contested opening H2 emits needs at least one tick to be contested in.
   */
  REPLACEMENT_DELAY_TICKS: Object.freeze({ min: 1, max: 6 }),
  /**
   * THE MARGINAL BIAS (design §5): how far a fresh mint's trait draw leans toward the
   * settlement's own state, as a probability mass shifted onto the leaning half of the
   * candidate list. 0 would make replacement blind to the town; 1 would make every
   * successor a copy of it. 0.18 is the designed effect size: small enough that
   * individuals surprise (the leaning half still loses four times in ten at a neutral
   * base), large enough to read at scale (a 100-mint corpus separates from an unbiased
   * one at better than 3 sigma, which is what the envelope pin measures).
   */
  REPLACEMENT_BIAS_WEIGHT: 0.18,

  // ── H3: CIRCULATION (design §6) ────────────────────────────────────────────
  /**
   * THE POOL FLOOR (design §14's pool-starvation inversion, answered). A roamer makes
   * no rehost attempt at all for this many ticks after entering the pool. Without a
   * floor a high pressure curve makes roaming trivially brief and the Wanderers
   * register vestigial; with it, every displaced person is genuinely displaced for a
   * while, and the register always has somebody in it.
   */
  ROAM_FLOOR_TICKS: 6,
  /** The rehost pressure the moment the floor lifts. Deliberately low: the first weeks
   *  on the road are the ones nobody takes you in. */
  REHOST_BASE_PRESSURE: 0.08,
  /** How much pressure rises per tick in the pool past the floor (design §6's
   *  equilibrium: unassigned roamers eventually settle themselves). */
  REHOST_PRESSURE_PER_TICK: 0.02,
  /** The pressure ceiling. Below 1 on purpose: a settlement that will never take a
   *  person still never takes them, however long they walk. */
  REHOST_PRESSURE_CEILING: 0.7,
  /**
   * The pool-size envelope, as roamers per mapped settlement. The equilibrium claim
   * design §6 makes is that the pool is BOUNDED at soak horizons, and a bound that
   * does not scale with the realm would red on a big map for the wrong reason.
   */
  POOL_PER_SETTLEMENT_CEILING: 1.5,
  /** How long a rejected pair waits before the roamer may knock again (design §6: no
   *  per-tick retry spam). A season and a bit at one-week ticks. */
  REJECTION_COOLDOWN_TICKS: 16,
  /**
   * REJECTION STRICTNESS: the believed-notoriety rank at or above which an
   * archetype's authored aversion becomes a refusal. Rank is the NOTORIETY_BANDS
   * index, so 2 is 'known'. Below it a faction may dislike the story and still open
   * the door, which is what makes the belief layer worth deriving.
   */
  REJECTION_NOTORIETY_RANK: 2,
  /** Seats a faction holds, banded by settlement tier. The admission rule needs a
   *  capacity and the estate has never had one, so it is authored here rather than
   *  inferred from a roster that would make capacity a function of who already joined. */
  FACTION_SEATS_BY_TIER: Object.freeze({
    thorp: 2,
    hamlet: 3,
    village: 4,
    town: 5,
    city: 7,
    metropolis: 9,
  }),
  /** The seat count for a settlement whose tier is missing or unknown. */
  FACTION_SEATS_DEFAULT: 4,

  // ── H3: TRAVEL PHYSICS (design §6, owner amendment 2026-07-31) ─────────────
  /** Route-hops a wanderer may take per tick. ONE, constitutionally: a person travels
   *  at road speed while their story travels at news speed, and that gap is the
   *  reputation race. Named rather than inlined so the pin reads the table. */
  TRAVEL_HOPS_PER_TICK: 1,
  /** How much slower a wanderer is than a hop's nominal week count when they use a
   *  HIDDEN path. Design: wanderers may use hidden paths (slowly); armies may not. */
  HIDDEN_PATH_SLOWDOWN: 2,

  // ── H3: REPUTATION AS BELIEF (design §6b) ──────────────────────────────────
  /** Ticks of elapsed time after which a story has faded one notoriety band, before
   *  distance is priced in. A scandal is loudest the year it happens. */
  BELIEF_FADE_TICKS: 40,
  /** Hop-delay ticks that fade a story one further band. This is what lets a wanderer
   *  outrun their reputation on a long road and not on a short one. */
  BELIEF_DISTANCE_FADE_TICKS: 3,
  /** Under an UNRELIABLE infoMode a story may grow instead of fading. The share of
   *  (settlement, roamer) pairs whose seeded reading REINFORCES rather than counters. */
  BELIEF_REINFORCE_SHARE: 0.35,

  // ── H3: UNAFFILIATES + RESIDENCY (design §6c) ─────────────────────────────
  /** Stay durations, banded in ticks: weeks to years at one-week ticks. */
  RESIDENCY_STAY_TICKS: Object.freeze({ min: 4, max: 104 }),
  /** The residency preference is WEIGHTED, NEVER BOUNDED (design §6c): the worst-matched
   *  settlement in the realm still carries this share of the best one's weight, so a
   *  wanderer can always turn up anywhere. */
  RESIDENCY_PREFERENCE_FLOOR: 0.25,
  /** The per-tick experience deposit a resident roamer accrues, at full match. Capped
   *  well under the growth kernel's own per-signal loudness so residency bends a
   *  person more slowly than office does. */
  RESIDENCY_DRIFT_LOUD: 0.12,
  /** The cap on the TOTAL deposit one residency tick may emit across all traits. A
   *  decade bends a person; it never replaces them. */
  RESIDENCY_DRIFT_TICK_CAP: 0.3,

  // ── H3: THE POPULATION FLOOR (design §9) ──────────────────────────────────
  /** The named-cast floor is exact (population is never below the resident named
   *  count), so this is not a band. It is declared as a table entry anyway because
   *  the reconciliation reads it, and a bare 0 at the call site would be the kind of
   *  invisible constant this table exists to abolish. */
  POPULATION_NAMED_FLOOR_SLACK: 0,
});

export default NPC_CONSEQUENCES_TUNING;
