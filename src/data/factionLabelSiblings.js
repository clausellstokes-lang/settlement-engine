/**
 * data/factionLabelSiblings.js — the faction LABELS the power step writes that presume a fact
 * (CENSUS-4f unit 2, 2026-11-05; the chair's ruling of 07:2x on the five `[guard]` conflict labels,
 * R-AP amended, R-C, R-G, R-AN).
 *
 * `generatePowerStructure` pushes the `Military/Guard` faction by the military PRIORITY and the
 * tier, not by the roster (`rulingStructure.js :: FACTION_DESC_SIBLINGS`'s note says the same of
 * its descriptions), so that key is not `guardPresence`'s reader and guarantees no enforcement
 * body: the label declares `guardPresence`. Its twin names the same bloc — the households and
 * officers who press the settlement's martial priorities — without a body; it keeps `Military` so
 * every name-keyed reader (`factionCategories.js :: inferFactionCategory`, `factionDynamics.js`,
 * the history, narrative and NPC placement readers' `includes('military')`) reads the same kind.
 * The twin is the chair's ruling (R-G), recorded in `docs/CENSUS_4_LANE_2026-11-04.md`.
 *
 * CARRIED, NOT RESOLVED (R-C). The power step reads the declared row through `textOf`
 * (byte-identical). `guardPresence` is NOT settled at that step (measured on the 1,000: of 363
 * births that hold the label, 1 differs between the power step and the final record — soak1k-331,
 * no guard at the power step, a militia after; R-AN), so the label cannot be resolved where it is
 * pushed. Its resolution — once the roster has settled, against the final record — is the
 * mechanism lane's site to wire (the name is copied into conflicts, affiliations and prose after
 * the push, so a resolution must reach every copy). Measured on the 1,000: 12 of 363 holders have
 * no `guardPresence` on the final record (soak1k-110, -236, -247, -260, -326, -446, -462, -470,
 * -571, -614, -674, -776); the `[guard]` instrument reads 5 of them on the plot-hooks tab.
 *
 * Pure data: no randomness, no clock, no write.
 *
 * @enforced-by tests/data/factionLabelSiblings.test.js
 */

/** The faction label for the military priority's bloc, declared: it presumes an enforcement body. */
export const MILITARY_GUARD_LABEL = Object.freeze({ text: 'Military/Guard', needs: Object.freeze(['guardPresence']) });

/**
 * Keyed by the printed label (the shape of `FACTION_DESC_SIBLINGS`, read by `resolveSibling`): the
 * original `needs` its atom; its twin `excludes` it.
 */
export const FACTION_LABEL_SIBLINGS = Object.freeze({
  'Military/Guard': Object.freeze([
    MILITARY_GUARD_LABEL,
    Object.freeze({ text: 'Military Party', twinOf: 'Military/Guard', excludes: Object.freeze(['guardPresence']) }),
  ]),
});
