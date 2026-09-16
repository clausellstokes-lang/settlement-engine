/**
 * treatyTermRoles.js — THE FIGURES THAT FOLLOW THE OBLIGATION (chair ruling CR-GR3B-3-R1).
 *
 * PASS 2 of `advanceTreaties` has always priced one direction per instrument: the party
 * that owes has a delivery capacity, and the party that is owed has a monitoring reach
 * over it. That was exactly right while every treaty ended a war, because a war
 * settlement points one way for its whole life. A negotiated pact does not — its clauses
 * are asked for one at a time, by either court, and a reciprocal bargain is two opposed
 * promises on one record — so the figures have to follow the CLAUSE, not the document.
 *
 * WHY THIS IS ITS OWN LEAF AND NOT A BLOCK INSIDE `peaceTerms.js`. That head is at 790 of
 * its 800 effective lines and shares the remainder with another waiting packet; and the
 * obvious alternative home, `peaceTermsAppraisal.js`, would have to gain an import edge to
 * `relationshipEvolution.js` and drag it into everything that imports the appraiser — the
 * recorded barrel-hop hazard.
 *
 * ⚠ WHY THE PRESSURE READ IS INJECTED RATHER THAN IMPORTED (chair ruling CR-ORIENT-C, and
 * it was a MEASURED red, not a preference). This leaf's first draft imported
 * `buildPressureSummary` from `relationshipEvolution.js` on the argument that the edge was
 * already in `peaceTerms.js`'s import set, so reachability from the head was unchanged.
 * CW-0w does not measure reachability: `tests/lint/couplingInclusion.walker.test.js` keys
 * its shrink-only inventory on the (importer, imported) PAIR, so a brand-new module reading
 * across a port is a brand-new unlicensed coupling however well-trodden the port is — and
 * it demands a `couplingRegistry` row in the SAME commit. Taking the summary as a pure
 * injected function removes the port crossing outright: the head, which already holds the
 * baselined INTERIOR→GRAMMAR row, does the reading and hands the result down. Every import
 * that remains is GRAMMAR's own or the shared kernel, so this leaf crosses nothing.
 *
 * ⚠ THE EAGER ARM IS LOAD-BEARING FOR BYTE-IDENTITY, and it is the reason this reader is a
 * factory rather than a per-term function. The instrument's own direction is priced AT
 * CONSTRUCTION, in the order the head used to price it — pressure summary, then monitor
 * reach — so every war and sale treaty in the tree performs the same calls, the same
 * number of times, with the same arguments as before. A negotiated pact is the only
 * instrument that can resolve a SECOND direction, and it pays for it lazily, on first use.
 * A treaty has two parties, so the memo can hold at most two directions plus the
 * directionless row.
 *
 * PURE. No rng, no clock, no writes — `peaceTerms.js`'s no-rng law extends here.
 */
import { termObligationOf } from './treatyOrientation.js';
import { victorMonitorReach } from './peaceTermsAppraisal.js';
import { clamp01 } from '../../kernel/math.js';

/**
 * @typedef {Object} TermRoleFigures
 * @property {number} burden01    the obligor's delivery burden
 * @property {number} capacity01  what is left of it to deliver with
 * @property {number} reach01     the obligee's monitoring reach over the obligor
 */

/**
 * @typedef {Object} TermRole
 * @property {string} obligorId   bears this clause — pays, is watched, is named on default
 * @property {string} obligeeId   is owed it
 * @property {boolean} mutual     both courts hold it; there is no transfer direction
 * @property {boolean} resolved   false ⇒ both ids are the empty string
 * @property {number} burden01
 * @property {number} capacity01
 * @property {number} reach01
 */

/**
 * BUILD THE PER-TREATY ROLE READER.
 *
 * `pressureFor` is the head's own pressure read, handed down as a PURE function of a
 * settlement id (see the header's coupling note). It must be the same summary the head
 * would have computed for that id — nothing here re-derives it.
 *
 * @param {{ treaty: Record<string, unknown> | null | undefined,
 *           orientation: { resolved: boolean, obligorId: string, obligeeId: string },
 *           pressureFor: (id: string) => (Record<string, unknown> | null | undefined),
 *           worldState: Record<string, unknown>,
 *           truthFor: (id: string) => number }} args
 * @returns {{ forTerm: (term: Record<string, unknown> | null | undefined) => TermRole,
 *             instrument: TermRoleFigures }}
 */
export function makeTermRoleReader({ treaty, orientation, pressureFor, worldState, truthFor }) {
  /** @type {Map<string, TermRoleFigures>} */
  const byDirection = new Map();

  /** ⚠ THE THREE EXPRESSIONS ARE TRANSCRIBED FROM THE HEAD, NOT RE-DERIVED. They are what
   *  PASS 2 has always computed for its one direction; a "simplification" here is a silent
   *  same-seed shift on every treaty in every world.
   *  @param {string} obligorId @param {string} obligeeId @returns {TermRoleFigures} */
  function figuresFor(obligorId, obligeeId) {
    const key = `${obligorId}>${obligeeId}`;
    const memo = byDirection.get(key);
    if (memo) return memo;
    const pressure = pressureFor(obligorId);
    const burden01 = clamp01(0.6 * clamp01(Number(pressure?.economy) || 0) + 0.4 * clamp01(Number(pressure?.food) || 0));
    /** @type {TermRoleFigures} */
    const figures = {
      burden01,
      capacity01: clamp01(1 - burden01),
      reach01: victorMonitorReach(obligeeId, obligorId, worldState, truthFor),
    };
    byDirection.set(key, figures);
    return figures;
  }

  // THE EAGER ARM. Priced whether or not the instrument resolves, because an unresolved
  // treaty's obligor IS the empty id and the head has always priced that pair too — the
  // identity row (burden 0, capacity 1, the reach for the empty pair) a mutual clause and
  // an unresolved clause both fall back to.
  const instrument = figuresFor(orientation.obligorId, orientation.obligeeId);

  return {
    instrument,
    /** @param {Record<string, unknown> | null | undefined} term @returns {TermRole} */
    forTerm(term) {
      const duty = termObligationOf(treaty, term);
      // A mutual or unresolved clause carries the empty pair by contract, so this one call
      // covers all three cases without a branch that could disagree with the reader.
      const figures = figuresFor(duty.obligorId, duty.obligeeId);
      return {
        obligorId: duty.obligorId,
        obligeeId: duty.obligeeId,
        mutual: duty.mutual,
        resolved: duty.resolved,
        burden01: figures.burden01,
        capacity01: figures.capacity01,
        reach01: figures.reach01,
      };
    },
  };
}
