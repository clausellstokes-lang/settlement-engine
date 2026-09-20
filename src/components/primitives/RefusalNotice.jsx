/**
 * primitives/RefusalNotice.jsx — THE ONE WAY A GATE SAYS NO.
 *
 * ⛔ NO GATE REFUSES SILENTLY (owner ruling, ODQ §934.24(c)). Before this existed,
 * four surfaces each answered the same anonymous-cap refusal in their own way, and
 * three of the four answered it by navigating with nothing said — on /create, to the
 * page the reader was already on. A reader clicked, and the product did nothing.
 *
 * So there is ONE component. It takes a refusal record from the store
 * (`{ reason, vars }`, minted by lib/refusalReasons.js at the gate that refused),
 * resolves its sentence from the ONE `refusals.*` block in copy/en.js, and renders it
 * WHERE THE READER CLICKED.
 *
 * ⭐ THE IDIOM IS THE ESTATE'S OWN, NOT A NEW ONE. It is the rubric-headed clerk's
 * note (components/generate/ClerkNote.jsx) that PricingPage already raises for a
 * failed checkout and HomeHero for a failed forge — a reserved oxblood rubric on a
 * drawn left rule, no wash, no radius, with `role="alert"` so the refusal is
 * ANNOUNCED as well as shown. The estate's Toast primitive is deliberately not used:
 * it has no consumer anywhere in src/, so reaching for it would introduce a second
 * notice idiom rather than reuse the live one.
 *
 * ⚠ THE IMPORT DIRECTION IS A RECORDED CHOICE, NOT AN OVERSIGHT. This primitive reads
 * ClerkNote out of components/generate/, which is the wrong way round for a leaf in
 * primitives/. The alternative — promoting ClerkNote into primitives/ — is right and
 * should happen, but it rewrites eight importers, and this lane is one of several
 * holding uncommitted work in that tree. Duplicating ClerkNote's markup here to avoid
 * the import would be worse: two notice idioms that agree on the day they are written
 * and drift by the month. Left for the chair with the reason written down.
 *
 * BODY RESOLUTION, and why `bodyRef` exists. Two reasons — a failed generation and a
 * stale build — already have their sentence in `errors.*`, written for exactly those
 * failures and pinned by the error-copy register. A reason may therefore carry
 * `bodyRef: 'errors.forgeStart'` instead of its own `body`, and this resolves it.
 * That keeps ONE dictionary without restating a sentence the registry already holds.
 *
 * @enforced-by tests/lint/refusalNoticeCoverage.walker.test.js
 * @enforced-by tests/components/refusalNotice.test.jsx
 */
import { ClerkNote } from '../generate/ClerkNote.jsx';
import { tOptional } from '../../copy/index.js';
import { accountHolderPhrase, signInUnlocksSizes } from '../../config/tierFacts.js';
import { isRefusalReason } from '../../lib/refusalReasons.js';

/**
 * The sentence a reason renders, following `bodyRef` when the reason defers to an
 * existing registry key. Exported so the walker can prove every registered reason
 * resolves to real words rather than to a dotted key path.
 *
 * @param {string} reason
 * @param {Record<string, string|number>|null} [vars]
 * @returns {{ rubric: string, body: string }|null}
 */
export function refusalCopy(reason, vars = null) {
  if (!isRefusalReason(reason)) return null;
  const rubric = tOptional(`refusals.${reason}.rubric`);
  const ref = tOptional(`refusals.${reason}.bodyRef`);
  // ⭐ `{sizes}` IS A DEFAULT VAR, SO A REFUSAL CAN NAME WHAT SIGNING IN UNLOCKS WITHOUT
  // ITS RAISER KNOWING THE LADDER (the owner, 2026-09-19). Two of these sentences typed
  // "city and metropolis" and were short a thorpe, the same defect as the hero's — and
  // the gates that raise them (the daily cap, the tier door) have no business holding the
  // size ladder. The gate's OWN vars are spread last, so a raiser that passes `sizes`
  // still wins: a fact measured at the gate always beats a default computed here.
  // ⭐ `{holder}` IS A DEFAULT VAR FOR THE SAME REASON `{sizes}` IS (REVIEW-P F13).
  // Two sentences said "past what this account forges" to a visitor with no account.
  // The tier is known only at the GATE, so the gate passes the measured phrase and
  // wins here; the default keeps the sentence resolving — a missing var renders the
  // literal `{holder}` at a reader — and it is deliberately the words those sentences
  // already carried, so an unmeasured raiser claims nothing new.
  const withDefaults = { sizes: signInUnlocksSizes(), holder: accountHolderPhrase(), ...(vars ?? {}) };
  const body = ref ? tOptional(ref, withDefaults) : tOptional(`refusals.${reason}.body`, withDefaults);
  if (!rubric || !body) return null;
  return { rubric, body };
}

/**
 * @param {object} props
 * @param {{ reason: string, vars?: Record<string, string|number>|null }|null|undefined} props.refusal
 *   the store's `lastRefusal`, or null
 * @param {object} [props.style]   layout overrides only
 * @param {import('react').ReactNode} [props.actions]  an optional instrument row (a door the reader can take)
 */
export default function RefusalNotice({ refusal, style, actions }) {
  // A refusal this build does not recognise renders NOTHING rather than a dotted key
  // path or an empty alert — a surface that has been handed a stale or hand-rolled
  // shape should be silent here and reported by the walker, not loud at a reader.
  const copy = refusal ? refusalCopy(refusal.reason, refusal.vars ?? null) : null;
  if (!copy) return null;
  // No marker attribute: ClerkNote takes a fixed prop set and does not forward extras,
  // and widening a component eight other surfaces render, in a lane that is one of
  // several holding work in that tree, buys a test convenience with a shared-file
  // conflict. The rubric IS the reason's public name, and that is what the pins read.
  return (
    <ClerkNote role="alert" rubric={copy.rubric} style={style} actions={actions}>
      {copy.body}
    </ClerkNote>
  );
}
