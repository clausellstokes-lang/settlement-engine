/**
 * domain/display/heraldJoinMolds.js — THE JOIN MOLDS: the ARGUMENT FORMS a
 * connective's slot demands (docs/content/RECEIPT_POOLS_CAUSAL.md §1, keyed at
 * §3.1's pool grain under §0c's eight typed edges; SP-6's CAUSAL GRAMMAR
 * amendment).
 *
 * ── WHY THIS MODULE EXISTS ──────────────────────────────────────────────────
 * §3 tags every connective with an ARGUMENT TYPE — `N` a noun phrase, `F` a
 * finite clause, `V` a bare verb phrase, `A` absolute (no argument at all) — and
 * §2's composition contract calls the F/N split "the load-bearing rule of the
 * whole section": *a phrase-taking connective in front of a finite clause is
 * ungrammatical, and a display-side composer with no engine state has no repair
 * for it.* The cause walk hands the composer exactly one thing per hop: the
 * receipt's own byte-verbatim recorded headline, which is a FINITE CLAUSE. Feed
 * it to an `N` connective and the page prints
 *
 *     "…, against the refusal of the eastern road was cut"
 *
 * — measured on 49 of the 71 back-direction connective lines. The molds below are
 * that repair, and they are the supply §3's argument tags were written to
 * receive: per pool, the FORM the argument takes, with the receipt's own clause
 * carried through inside it, unchanged.
 *
 * ── WHAT A MOLD MAY AND MAY NOT DO (law 1 at the mold grain) ────────────────
 * A mold is a FRAME, never a fact. It renders the parent receipt's own clause in
 * the grammatical position the connective demands and asserts nothing the edge
 * does not already carry — which is why the frames are licensed PER POOL rather
 * than shared: "the word that …" nominalises a report and is lawful under
 * `answered`, where the parent is the thing responded to, and unlawful under
 * `caused`, where it would quietly convert a recorded cause into a belief. The
 * clause inside the frame is the receipt's, byte for byte, less the terminal
 * stop the composer owns (§2's composition contract: "casing and the closing
 * stop are display-side").
 *
 * ── THE UNSUPPLIED ARGUMENTS ARE DECLARED, NOT DISCOVERED ───────────────────
 * Seven (pool, arg) pairs have NO mold, and every one of them fails for the same
 * single reason: the connective's argument is an ENTITY the parent's clause is
 * not — the PLANTER, the JUDGING party, the ANCESTOR, the CARRIER. The fenced
 * composer holds no such name and may not fetch one, so the honest answer is the
 * corpus's own: the line is not drawn, and if nothing in the pool is drawable the
 * link is DROPPED — never re-labelled into a pool whose edge would fit the prose
 * (§3.1's whole prohibition). `UNSUPPLIED_ARGS` records the seven with their
 * reasons, and the totality pin asserts that supplied ∪ unsupplied covers every
 * (pool, arg) pair the connective corpus actually spends, so a new connective
 * cannot land un-molded and un-noticed.
 *
 * `A` never takes a mold BY LAW: it carries its own parent and would render a
 * link to nothing on a page that never named the parent. An `A` draw is a drop.
 *
 * PURE: no store, no React, no Date, no Math.random, no I/O, no mutation.
 *
 * @enforced-by tests/domain/heraldCausalVoice.test.js
 * @enforced-by tests/lint/heraldContaminationFence.test.js
 */

import { pickCausal } from './heraldCausalGrammar.js';

/** The token a mold carries the receipt's own clause in. */
export const CLAUSE_TOKEN = '{clause}';

/** The argument types a mold can supply. `A` is argument-less by law. */
export const MOLDED_ARGS = Object.freeze(['N', 'F', 'V']);

// ── THE FRAME VOCABULARY ─────────────────────────────────────────────────────
// Each frame turns one finite clause into one argument form. Named so a pool's
// licence list reads as a statement about which nominalisations its edge allows.

/** TEMPORAL — the join's own meaning under `succession`: when, not why. */
const DAY = `the day ${CLAUSE_TOKEN}`;
const SEASON = `the season ${CLAUSE_TOKEN}`;
const TURNING = `the turning when ${CLAUSE_TOKEN}`;
const YEAR = `the year ${CLAUSE_TOKEN}`;

/** FACTIVE — the neutral nominal; asserts the record, and nothing about minds. */
const FACT = `the fact that ${CLAUSE_TOKEN}`;
const PLAIN_FACT = `the plain fact that ${CLAUSE_TOKEN}`;

/** VERIDICAL — for edges that assert the thing was so (`exposed`, `believed`). */
const TRUTH = `the truth that ${CLAUSE_TOKEN}`;

/** REPORTIVE — lawful ONLY where the edge already runs through a telling. */
const WORD = `the word that ${CLAUSE_TOKEN}`;
const REPORT = `the report that ${CLAUSE_TOKEN}`;
const SAID_WHEN = `was said when ${CLAUSE_TOKEN}`;

/** THE GATE'S NOMINALS — what was standing to be blocked or to lapse. */
const AT_ISSUE = `what stood at issue when ${CLAUSE_TOKEN}`;
const STATE_OF_THINGS = `the state of things when ${CLAUSE_TOKEN}`;

/** THE INSTRUMENT'S NOMINALS — the drafted artifact the join runs through. */
const INSTRUMENT = `the instrument by which ${CLAUSE_TOKEN}`;
const WRITING = `the writing under which ${CLAUSE_TOKEN}`;
const PROMISE = `the promise that ${CLAUSE_TOKEN}`;

/** THE IDENTITY FORM — an `F` slot wants a finite clause, which is what we hold. */
const AS_RECORDED = CLAUSE_TOKEN;

/**
 * THE MOLDS, per §3.1 pool. A pool's list for an arg is the closed set of forms
 * its edge licenses; an absent or empty list means the composer may not draw a
 * line with that arg from that pool (see `UNSUPPLIED_ARGS`).
 * @type {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>}
 */
export const JOIN_MOLDS = Object.freeze({
  // succession — WHEN, never why. Only temporal nominals: a factive or reportive
  // frame here would let a reader hear a cause the edge refuses to assert.
  followed: Object.freeze({ N: Object.freeze([DAY, SEASON, TURNING]), F: Object.freeze([AS_RECORDED]) }),
  remembered: Object.freeze({ N: Object.freeze([DAY, SEASON, YEAR]), F: Object.freeze([AS_RECORDED]) }),
  // exposed asserts the thing became SAID and was true before it was said.
  exposed: Object.freeze({ N: Object.freeze([TRUTH, FACT]), F: Object.freeze([AS_RECORDED]) }),
  // origination is the ONE edge licensed to read as causation, so its argument
  // stays factive: a reportive frame would demote a recorded cause to a rumour.
  caused: Object.freeze({ N: Object.freeze([FACT, PLAIN_FACT]), F: Object.freeze([AS_RECORDED]) }),
  // an answer answers a thing OR the word of it — both are what the act replied to.
  answered: Object.freeze({ N: Object.freeze([FACT, WORD, REPORT]), F: Object.freeze([AS_RECORDED]) }),
  priced: Object.freeze({ N: Object.freeze([FACT, DAY]), F: Object.freeze([AS_RECORDED]) }),
  // belief's charter is to attribute without asserting; the frame names what was
  // held, and the connective supplies the holding.
  believed: Object.freeze({ N: Object.freeze([TRUTH, FACT]), F: Object.freeze([AS_RECORDED]) }),
  // planted's `N` lines take the PLANTER (see UNSUPPLIED_ARGS). Its one `F` line
  // ("believing exactly what …") wants a free relative, which SAID_WHEN supplies
  // without naming a hand.
  planted: Object.freeze({ F: Object.freeze([SAID_WHEN]) }),
  judged: Object.freeze({}),
  // gate and instrument spend no `F` line at all — every one of their clause-
  // taking positions is an `A`. A mold for an arg the pool never draws would be
  // dead content, and the totality pin reds on it.
  refused: Object.freeze({ N: Object.freeze([AT_ISSUE, FACT]) }),
  dissolved: Object.freeze({ N: Object.freeze([AT_ISSUE, STATE_OF_THINGS]) }),
  enforced: Object.freeze({ N: Object.freeze([INSTRUMENT, WRITING]) }),
  breached: Object.freeze({ N: Object.freeze([INSTRUMENT, WRITING, PROMISE]) }),
  inherited: Object.freeze({}),
  buried: Object.freeze({}),
  carried: Object.freeze({}),
});

/**
 * THE DECLARED HOLES. Key is `${pool}::${arg}`; the value is why no frame can be
 * authored for it without the composer holding a name it is fenced from. Every
 * row is the same failure: the connective's argument is an ENTITY, and the
 * composer holds a CLAUSE. A row here means the line is never drawn, and a pool
 * with no drawable line in a direction DROPS the link.
 * @type {Readonly<Record<string, string>>}
 */
export const UNSUPPLIED_ARGS = Object.freeze({
  'planted::N': 'the argument is the PLANTER ("planted on them by …"); the contamination fence forbids the composer that name, and R-W5-F degrades the pool to `believed` for every audience that must not learn it',
  'judged::N': 'the argument is the JUDGING party or the verdict\'s name ("in the reckoning of …"), neither of which the parent receipt\'s clause is',
  'refused::V': 'a bare verb phrase — what they would not DO. §2 authors F and N forms only; no receipt carries its own act de-tensed, and inventing one would publish an act the record never entered',
  'inherited::N': 'the argument is the ANCESTOR who left it ("left them by …", "come down from …")',
  'inherited::F': 'the one `F` line ("and the son holds what …") wants a free relative naming the inheritance, not the parent clause',
  'buried::N': 'the argument is the decree or the seat that set it aside, not the buried matter\'s own clause',
  'carried::N': 'the argument is the CARRIER — the column, the caravan, the legate ("carried down the road by …"); a clause is not a carrier',
});

/**
 * The receipt's clause as it enters a mold: trimmed, and less ONE terminal full
 * stop. §2's composition contract puts the closing stop on the composer's side
 * of the line precisely so a clause can sit mid-sentence; `!` and `?` are content
 * and are left alone.
 * @param {unknown} clause
 * @returns {string}
 */
export function clauseBody(clause) {
  const trimmed = String(clause ?? '').trim();
  return trimmed.endsWith('.') ? trimmed.slice(0, -1).trim() : trimmed;
}

/**
 * The forms a pool licenses for one argument type (empty when unsupplied).
 * @param {string} pool
 * @param {string} arg
 * @returns {ReadonlyArray<string>}
 */
export function moldFormsFor(pool, arg) {
  const forms = JOIN_MOLDS[String(pool)];
  const list = forms ? forms[String(arg)] : undefined;
  return Array.isArray(list) ? list : [];
}

/**
 * Whether this composer can print a connective line with this argument type at
 * all. `A` is false BY LAW (argument-less: it would point at a parent the page
 * never showed); everything else is true exactly when a mold exists.
 * @param {string} pool
 * @param {string} arg
 * @returns {boolean}
 */
export function argIsMolded(pool, arg) {
  if (arg === 'A') return false;
  return moldFormsFor(pool, arg).length > 0;
}

/**
 * The argument, in the form the connective's slot demands. Deterministic on
 * `seed`. Returns null when the pool licenses no form for that argument type or
 * the receipt carried no clause — in both cases the caller DROPS the link rather
 * than printing a form the grammar did not license.
 * @param {Object} args
 * @param {string} args.pool
 * @param {string} args.arg
 * @param {unknown} args.clause
 * @param {string} args.seed
 * @returns {string|null}
 */
export function moldFormFor({ pool, arg, clause, seed }) {
  if (arg === 'A') return null;
  const body = clauseBody(clause);
  if (!body) return null;
  const drawn = pickCausal(moldFormsFor(pool, arg), `${seed}::mold::${pool}::${arg}`);
  if (!drawn) return null;
  return drawn.replace(CLAUSE_TOKEN, body);
}

/**
 * THE WELL-FORMEDNESS PARSE. True when `text` is exactly one of the pool's
 * licensed forms for `arg`, filled with this clause and nothing else — the pin's
 * instrument, and the reason the pins can assert SHAPE rather than substrings.
 * A bare finite clause in an `N` slot is the negative control and returns false.
 * @param {Object} args
 * @param {string} args.pool
 * @param {string} args.arg
 * @param {unknown} args.clause
 * @param {unknown} args.text
 * @returns {boolean}
 */
export function conformsToMold({ pool, arg, clause, text }) {
  const body = clauseBody(clause);
  if (!body) return false;
  const candidate = String(text ?? '');
  return moldFormsFor(pool, arg).some((form) => form.replace(CLAUSE_TOKEN, body) === candidate);
}
