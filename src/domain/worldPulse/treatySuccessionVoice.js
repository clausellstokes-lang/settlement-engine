/**
 * domain/worldPulse/treatySuccessionVoice.js — GR-4b-α THE SUCCESSION DISAVOWAL VOICE.
 *
 * GR-4a gave the succession road an ACT: when the hand that swore is gone and the seat that
 * followed will not own the word, `treatyBreach.js` writes a graded `succession_repudiation`
 * breach, a `disavowed_by_succession` lineage ending and an authored house receipt. Until
 * this leaf the world never said so in any register — the dossier spoke the generic
 * economic-family line about wagons and tribute, so a torn-up oath and a missed grain
 * delivery were told with identical words. This composes the sentence.
 *
 * ── WHAT THIS FILE IS AND IS NOT ────────────────────────────────────────────────
 * A PURE LEAF, the `treatyLifecycleVoice.js` split applied again: `treatyBreach.js` decides
 * that an oath was disavowed and stays the treaty family's declared rewriter; this only
 * composes the beat. It writes no ledger, no world and no state, takes no clock and no draw,
 * and mutates no argument. `grammarReceipt`'s seeded pick is the only variability and it is
 * keyed, so the same world at the same seed says the same sentence forever.
 *
 * ⛔ AND IT MUST NEVER NAME THE LEDGER WRITE, EVEN IN PROSE. The ownership certification
 * discovers the treaties writers from executable syntax, and
 * `tests/lint/oathStampTotality.walker.test.js` scans src/ with a regex that matches INSIDE
 * COMMENTS — its own control proves it. No comment, docblock or string here may spell that
 * call against the treaties key. Reword the comment; never widen the walker.
 *
 * ⛔ THE SAME RULE, SECOND TOKEN. `tests/domain/roadsParticipation.test.js` shells out to
 * grep for the dotted roster token with EXACT SET EQUALITY over this directory, so a new
 * world-pulse leaf carrying it — even in a comment — reds a landed pin. The roster is not
 * read here and its spelling does not appear here.
 *
 * ── ⭐ THE SLOT AXIS IS BREAKER/OTHER, NOT OBLIGEE/OBLIGOR ──────────────────────
 * The GR-0 pools are authored across the OWED axis, so they bind through
 * `grammarSlotRoles`. This pool is not: variant 2 reads "{settlement}'s new seat has cast
 * off the oath" and variant 3 "In {counterpart} they had expected it", which makes
 * `{settlement}` the DISAVOWING court whether or not it happens to be the party owed.
 * Routing this kind through the obligee/obligor table would therefore accuse the wrong court
 * on every instrument where the breaker is the obligee — compiling, passing, and exactly
 * backwards, which is the hazard that table exists to hold down elsewhere. So this leaf
 * binds the two slots from `defaultedBy` directly and never calls `grammarSlotRoles`, and
 * the roles table is left at its pinned single row (JUDGMENT, vetoable).
 *
 * ── THE CASTING IS ONE NAME DEEP, AND THAT IS THE HONEST DEPTH ──────────────────
 * `{npc}` is the FALLEN holder — the hand that swore, whose name the parchment's own oath
 * stamp carries. The SUCCESSOR's name is on no surface this stage can read (the seat
 * transition records a ruler id and no name, and the standings are keyed by id), which is
 * why the annex was corrected rather than the slot filled (CR-GR4B-3). Names fail CLOSED:
 * a name that is merely the id echoed back is not a name, and a beat rendering a slug where
 * a town belongs is the fabrication the address law forbids.
 *
 * @enforced-by tests/domain/treatySuccessionVoice.test.js
 *   + tests/lint/grammarLifecycleKindPools.walker.test.js
 *   + tests/property/oathHolderDormancyFence.test.js
 */

import { grammarReceipt } from './grammarNews.js';
import { swornPartiesOf } from './oathHolder.js';
import { stablePart } from './stablePart.js';
import { treatyOrientationOf } from './treatyOrientation.js';

/**
 * The closed ending token this voice speaks — a `pactAmendment.js` frozen-list member.
 *
 * ⛔⛔ IT IS USED FOR THE POOL LOOKUP AND THE ID ONLY. `kind`, `impactKind` and `ending` below
 * are spelled as STRING LITERALS on purpose, and this is enforcement rather than style:
 * `tests/domain/impactKindWalkers.test.js` discovers every minted kind with a RAW TEXT scan,
 * `/impactKind:\s*['"]([a-z][a-z0-9_]*)['"]/`, and a kind minted through a constant is
 * INVISIBLE to it. The walker would then report the registration rows as STALE and — far
 * worse — a future kind could ship with no `WHAT_PHRASES` phrase and no voice decision at
 * all, which is exactly the silent de-registration the manifest-walker idiom exists to stop.
 * Measured here, not theorised: this file failed that walker until the literals went in.
 */
const DISAVOWED_BY_SUCCESSION = 'disavowed_by_succession';

/**
 * SP-6 presentation weight by significance class. ⭐ ITS OWN, deliberately: the GR-0 helper
 * has no `major` branch and silently returns the notable weight, and that file is a landed
 * do-not-touch with its own pins. The values are `envoyNews.js`'s, which does carry the arm
 * (CR-GR4B-6).
 *
 * ⛔⛔ A TABLE, NOT AN `if` LADDER, AND THE REASON IS MEASURED. Every sibling voice decides
 * this with an inline equality test against a quoted significance word, and
 * `tests/lint/significanceMigration.census.test.js` names that exact shape as CLASS A debt —
 * 40 occurrences across 20 modules, frozen SHRINK-ONLY, with the standing instruction that
 * "a wave that spells a new inline comparison reds and must argue for it". This leaf did red
 * it until the ladder became the lookup below. Keying the table by the family's own word is
 * what that migration is FOR, so this leaf joins the debtor list at zero rather than at one.
 *
 * ⚠⚠ AND THE CENSUS SCANS RAW SOURCE, SO IT CONVICTS A COMMENT. Spelling the offending
 * comparison here to illustrate it is itself an occurrence — measured, because the first
 * draft of this very docblock reddened the census after the code was already clean. Describe
 * the shape in words; never write it out. ⚠ The roster-token scan named at the head of this
 * file and the ledger-write scan are the same trap wearing two other faces — and this very
 * paragraph tripped the roster one by quoting the token while warning about it. Three
 * comment-convicting censuses now read this leaf; none of them may be widened.
 * @type {Readonly<Record<string, { severity: number, score: number }>>}
 */
const PRESENTATION_WEIGHT = Object.freeze({
  routine: Object.freeze({ severity: 0.34, score: 36 }),
  notable: Object.freeze({ severity: 0.56, score: 58 }),
  major: Object.freeze({ severity: 0.76, score: 78 }),
});

/** @param {string} significance */
function presentationWeight(significance) {
  return PRESENTATION_WEIGHT[String(significance)] || PRESENTATION_WEIGHT.notable;
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * A party's reader NAME, or '' when the record never resolved one — the `readerName` rule,
 * inherited verbatim from the lifecycle voice.
 * @param {string} id @param {string} name @returns {string}
 */
function readerName(id, name) {
  const resolved = text(name);
  return resolved && resolved !== text(id) ? resolved : '';
}

/**
 * Both courts' reader names, keyed to WHICH ONE BROKE THE OATH rather than to who owed
 * whom. Returns null when either name fails to resolve — fail closed.
 * @param {Record<string, unknown>} treaty
 * @param {string} breakerId
 * @returns {{ breakerName: string, otherId: string, otherName: string } | null}
 */
function courtNames(treaty, breakerId) {
  const orientation = treatyOrientationOf(treaty);
  if (!orientation.resolved) return null;
  const isObligee = orientation.obligeeId === breakerId;
  const otherId = isObligee ? orientation.obligorId : orientation.obligeeId;
  if (!breakerId || !otherId || breakerId === otherId) return null;
  const breakerName = readerName(breakerId, isObligee ? orientation.obligeeName : orientation.obligorName);
  const otherName = readerName(otherId, isObligee ? orientation.obligorName : orientation.obligeeName);
  if (!breakerName || !otherName) return null;
  return { breakerName, otherId, otherName };
}

/**
 * THE DISAVOWAL BEAT. One beat per oath a new seat tore up, composed from what was APPLIED
 * — the caller hands the record the writer actually produced, so this narrates the act and
 * never the intent.
 *
 * Returns an ARRAY so the caller's hook is one spread: an unresolvable record yields [],
 * which is `treatyLapsedBeats`' declared idiom rather than a half-built entry.
 *
 * @param {{ treaty: Record<string, unknown>,
 *   question: import('./treatySuccession.js').SuccessionQuestion,
 *   tick: number }} input
 * @returns {Array<Record<string, unknown>>}
 */
export function successionDisavowalBeat({ treaty, question, tick }) {
  const record = treaty && typeof treaty === 'object' ? treaty : {};
  const breakerId = text(record.defaultedBy) || text(question?.settlementId);
  const courts = courtNames(record, breakerId);
  if (!courts) return [];
  // The hand that swore, off the parchment's own stamp. The total reader is used rather than
  // an index into the raw map because it drops a half-written signature instead of handing a
  // blank to a slot; an unresolved name simply leaves `{npc}` unsupplied and the pool falls
  // back to one of its slotless families, which is what those siblings are for.
  const fallen = swornPartiesOf(record).find(
    (stamp) => stamp.settlementId === breakerId && stamp.npcId === text(question?.npcId),
  );
  const fallenName = fallen ? readerName(fallen.npcId, fallen.name) : '';
  const interp = {
    settlement: courts.breakerName,
    counterpart: courts.otherName,
    ...(fallenName ? { npc: fallenName } : {}),
  };
  const sourceEventId = `${breakerId}.${courts.otherId}.${tick}`;
  const receipt = grammarReceipt(DISAVOWED_BY_SUCCESSION, sourceEventId, interp);
  if (!receipt) return [];
  const weight = presentationWeight(receipt.significance);
  // THE RECORDED REASON, read back off the instrument rather than restated here (address law
  // part 4). The writer appended its authored sentence to `receipts`, and a beat that
  // re-spelled it would fork the corpus the moment either side was edited. ⚠ A producer
  // shipping an empty `reasons` passes every walker — no census asserts this leg — and then
  // collides with its own siblings under the feed's repeat suppression, which reads the
  // reasons set. It is asserted by hand in the acceptance battery.
  const receipts = Array.isArray(record.receipts) ? record.receipts.map(String) : [];
  const recorded = receipts.length ? [receipts[receipts.length - 1]] : [];
  const parties = Array.isArray(record.parties) ? record.parties.map(String) : [];
  return [{
    id: `wizard_news.${tick}.${DISAVOWED_BY_SUCCESSION}.${stablePart(breakerId)}.${stablePart(courts.otherId)}`,
    kind: 'disavowed_by_succession',
    // ITS OWN impactKind, never `diplomacy`. The Herald's SINGLE_PRODUCER_KEYS walker pins
    // that token to the one treaty signing beat, so a second producer of it would inherit
    // that desk in silence — the trap recorded twice in the lifecycle voice, and the same one.
    // ⛔ LITERAL, never the constant — see the note at its declaration.
    impactKind: 'disavowed_by_succession',
    significance: receipt.significance,
    severity: weight.severity,
    score: weight.score,
    tick,
    scope: 'regional',
    headline: `${courts.breakerName}'s new seat casts off the oath sworn to ${courts.otherName}`,
    summary: receipt.line,
    reasons: recorded,
    settlementIds: [breakerId, courts.otherId],
    settlementNames: [courts.breakerName, courts.otherName],
    parties,
    ending: 'disavowed_by_succession',
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
    tags: ['world_pulse', 'pact_grammar', 'lifecycle'],
  }];
}
