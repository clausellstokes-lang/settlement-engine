/**
 * The complete device-local Zustand persistence projection.
 *
 * Keeping this as a named pure seam makes the persisted shape executable in
 * tests. Capabilities, reporter leases, auth, and every other owner/session
 * field are excluded by construction rather than by serialization luck. Missing
 * fields are restored by persistMerge.
 *
 * ⭐ THE ONE GENERATED WORLD THAT IS PERSISTED, AND WHY (2026-09-18). This
 * projection used to exclude generated worlds outright, and a refresh therefore
 * took an anonymous visitor's dossier: an anonymous account has maxSaves 0
 * (store/authSlice TIER_GATE), so there is no library for the draft to live in
 * and nothing else held it. /create is where the promise is made — the hero's
 * `ctaSubline`, "your first dossier stays in this browser" (copy/en.js) — and
 * this key is the whole of what makes it true, which is why that line was
 * narrowed to exactly what this code does when the rule below was cut.
 *
 * MEASURED before it was written, not assumed: a TOWN at 4,000 population
 * serializes to 141,607–192,830 B across five seeds (the fattest world the
 * engine makes, a 59,248-population metropolis, is 217,286 B) — roughly an
 * eighth of the 1.5 MB ceiling this was gated on, and a small fraction of the
 * ~5 MB localStorage origin budget.
 *
 * SCOPED TO ANON ON PURPOSE. A signed-in keeper's draft belongs in their
 * library, and their save path already covers the interrupted-save case
 * (lib/pendingSaveDraft.js). Scoping it also bounds the cost: zustand's persist
 * calls setItem on EVERY store write with no diffing, and serializing a world of
 * this size measures 0.637 ms per write against a 0.001 ms baseline. On the
 * anonymous path — hero, generate, read the dossier — store writes are discrete
 * user actions, and it is the only cohort that gets nothing without it.
 *
 * ⛔ ONE KEY, NOT TWO PLUS A FLAG — AND THE REASON IS A BUG THIS SHAPE CLOSES.
 * The first cut wrote `settlement` and `lastSeed` as top-level keys, gated on the
 * tier at WRITE time. The READ had no such gate: mergePersistedState restores by
 * top-level spread, so a returning user booted with a previous anonymous session's
 * draft in the editor. A gate on one side of a round trip is not a gate. The draft
 * now travels as ONE envelope, and the merge refuses anything that is not a
 * genuine envelope (absent, `true`, a string, a stale `{}`) — see persistMerge.js.
 *
 * ⭐⭐ THE ONE RULE (2026-09-18, ODQ §934.8) — AND WHAT IT REPLACED. The envelope
 * is written when, and only when, the world in the editor was BORN ANONYMOUS and
 * nobody is signed in right now: `state.draftOrigin === 'anon' && auth.user ==
 * null`. Nothing else ever writes it.
 *
 * `draftOrigin` is TRANSIENT STORE-ROOT STATE, and deliberately not a key on the
 * settlement. It is set at the birth (settlementGenerateAction.js), DERIVED on
 * every rehydrate (persistMerge.js: 'anon' when this boot adopted the envelope,
 * 'account' otherwise), re-stamped when a signed-in person makes the world theirs
 * (claimSettlementForAccount), and nulled at the settlement-swap chokepoint, so a
 * door that installs a world without answering the question fails CLOSED. It is
 * absent from this projection on purpose — a derived session fact that persisted
 * itself could outlive the session it describes.
 *
 * Every earlier cut asked the same question with SESSION CLAIMS standing beside
 * the world — `restoredAnonDraft`, `signedInWorld` — and each one needed raising,
 * retracting at a chokepoint, stashing across an OAuth redirect and spending at a
 * boot resolution in another module. They were flags rather than references
 * because immer replaces `state.settlement` on every mutation, so a reference test
 * missed after one edit and the gate failed OPEN. One derived root field needs
 * none of that, and unlike a stamp ON the world it never rides into a save row or
 * into the observed-shape corpus: there is no drop at the boot resolution, no
 * claim and no stash — a device's anonymous draft belongs to the device, and a
 * signed-in person who finds it on screen keeps or clears it.
 *
 * ⛔ AND "ANONYMOUS TIER" IS NOT THE SAME QUESTION AS "AN ANONYMOUS WORLD" —
 * which is why the condition names the ORIGIN and the USER, never the tier.
 * Sign-out sets tier 'anon' and deliberately leaves the editor's settlement
 * standing (eviction routes through the same path and must never destroy unsaved
 * work). A tier-only gate therefore stashed the DEPARTING ACCOUNT's loaded world,
 * possibly one of their saves, into this device's storage for the next anonymous
 * visitor to boot into. That world's origin is 'account', so it is refused here
 * by the same one rule — no sign-out-time bar to raise, and nothing to retract.
 *
 * ⭐⭐ A WRITE THAT IS NOT CASE (a) NULLS THE SLOT ONLY WHEN THE SLOT HOLDS THIS
 * TAB'S OWN WORLD (2026-09-19). zustand's persist writes the WHOLE projection on
 * every store write, so this key's else-branch used to be a bare `null` — and a bare
 * null is a write ABOUT a slot that may not be this tab's.
 *
 * THE FLAP IT CLOSES, walked: tab A holds an anonymous world and writes the
 * envelope. Tab B — a different anonymous world, same device — writes next, so the
 * slot is B's. A then signs in, and A's next store write nulled the slot: B's draft
 * was gone, and A had never held it. The same write happened whenever A saved,
 * opened a save or canonized. The slot is one and the tabs are many, and "the last
 * write wins" is only tolerable while every write is ABOUT the thing it overwrites.
 *
 * So the else-branch reads the slot back and compares IDENTITY before writing:
 *   (a) born anonymous + nobody signed in → write this world, exactly as before.
 *       This branch reads nothing, so the cohort the key exists for pays nothing.
 *   (b) otherwise, and the slot holds THIS world → null it. The world was claimed
 *       by an account here, and the device stops remembering it.
 *   (c) otherwise → write the stored envelope back UNTOUCHED. It is another tab's
 *       draft, and this tab has no standing to retire it.
 *
 * ⭐ AND A CLEARED EDITOR HAS STANDING TOO, THROUGH THE CHOKEPOINT (2026-09-19).
 * `clearSettlement` ends with NO world and NO origin, so the first cut of this rule
 * had nothing to compare and left the slot standing — a visitor who cleared their
 * own draft got it back on the next reload, which is a regression a reader meets
 * rather than a theoretical edge. The cure is where the knowledge is: the swap
 * chokepoint reads the OUTGOING world's identity before the door replaces it and
 * stamps `state.retiringDraftIdentity` (settlementLifecycleHelpers.js), and case (b)
 * falls back to that identity WHEN AND ONLY WHEN the editor is empty. So a clear
 * retires its own draft; a clear while another tab owns the slot still leaves that
 * draft alone; and an empty editor with nothing retired touches nothing.
 *
 * ⛔ THE REJECTED ALTERNATIVE, recorded because it is the obvious one: nulling the
 * slot whenever the editor is empty. That is the flap again — it eats another tab's
 * draft on a guess, which is the data loss this whole rule exists to stop. The
 * identity is what makes "I am throwing MY draft away" different from "my editor
 * happens to be empty".
 *
 * ⚠ THE INVARIANT IS PER-DEVICE, AND THE SLOT STILL HOLDS EXACTLY ONE DRAFT.
 * localStorage is shared across a device's tabs, so two anonymous tabs can hold
 * different drafts and the last case-(a) write owns the slot; the other tab's world
 * lives on screen and is simply not the one the device kept. What changed is that
 * only a case-(a) write may TAKE the slot, and only its holder may give it back.
 *
 * ⚠ The whole settlement is persisted, not a projection of it. A restored draft
 * must be byte-identical to the one generated, or saving after a reload would
 * write a thinner world than saving before it — the same-path/other-path write
 * that this codebase has been bitten by before.
 */
import { readAnonDraft } from './persistMerge.js';

/**
 * The localStorage key zustand's persist writes this projection under, named ONCE
 * because the projection now has to read back what the middleware wrote. Two
 * spellings of the key would leave every write working while the read silently saw
 * nothing — a gate on one side of a round trip, which is the defect the envelope
 * shape itself was cut to close. `src/store/index.js` takes its `name` from here.
 */
export const PERSIST_KEY = 'settlementforge';

/**
 * WHICH WORLD AN ENVELOPE HOLDS, as one comparable string — or null when there is
 * no world, or none this code can name.
 *
 * `settlement.id` LEADS because it is seed-stable AND rename-stable
 * (domain/normalizeSettlement.js stamps `idFromSeed(_seed)` at assembleSettlement),
 * so a visitor who renames their own draft does not lose the claim to it — a
 * name-first identity would hand their own slot to the "another tab's draft" branch.
 * `name` is the fallback for an un-normalised world (imported or hand-built, no id),
 * and `lastSeed` rides along in both cases as the other half of the provenance the
 * envelope carries.
 *
 * ⛔ AN UNNAMEABLE WORLD RETURNS NULL, AND THAT FAILS SAFE IN THE RIGHT DIRECTION.
 * A null identity can never equal a stored one, so the slot is LEFT STANDING rather
 * than nulled. The two errors here are not symmetric: keeping a draft that could
 * have been retired is an annoyance, and retiring one that was another tab's is the
 * data loss this whole rule exists to stop.
 *
 * Exported because the SWAP CHOKEPOINT stamps the same identity for the world it
 * is retiring (settlementLifecycleHelpers.js). One definition, two readers — a
 * second spelling would let the recorder and the comparer disagree about which
 * world a slot holds, which is the whole question this rule turns on.
 *
 * @param {any} settlement the world to name
 * @param {any} lastSeed the seed it was drawn from, or null
 * @returns {string|null}
 */
export function draftIdentity(settlement, lastSeed) {
  if (!settlement) return null;
  const id = typeof settlement.id === 'string' && settlement.id !== '' ? settlement.id : null;
  const name = typeof settlement.name === 'string' && settlement.name !== '' ? settlement.name : null;
  if (id === null && name === null) return null;
  return `${id ?? `name:${name}`}\u0000${lastSeed ?? ''}`;
}

/**
 * The envelope this device is holding right now, read back out of the persisted
 * blob — or null when there is none, when storage is unavailable, or when what sits
 * there is not a genuine envelope.
 *
 * ONE READ PER WRITE, and only on the writes that can change the answer: case (a)
 * returns before this is ever called, so an anonymous visitor reading their own
 * dossier pays nothing for it. `readAnonDraft` is the SAME fail-closed guard the
 * rehydrate uses (persistMerge.js) rather than a second spelling of "is this a
 * genuine envelope" — one spelling is why the read and the write cannot drift.
 *
 * ⚠ IT PARSES THE WHOLE BLOB, and that is reasoned rather than shrugged at: this
 * projection is the only thing that puts a settlement in there, so the blob is large
 * ONLY when it carries an envelope — and when it carries one, case (c) has to write
 * that payload back verbatim, so the parse is not waste. A device with no draft
 * parses a few KB of settings and toggles.
 *
 * @returns {{ settlement: any, lastSeed: any }|null}
 */
function storedAnonDraft() {
  try {
    // zustand's createJSONStorage writes `{ state, version }`, where `state` is
    // this projection's own return value — so the envelope is two levels down.
    const raw = globalThis.localStorage?.getItem(PERSIST_KEY);
    if (!raw) return null;
    return readAnonDraft(JSON.parse(raw)?.state?.anonDraft);
  } catch {
    // A blocked, full or half-written device has no draft to protect.
    return null;
  }
}

/**
 * Cases (b) and (c) of the header's rule: null the slot when it holds a world THIS
 * TAB has standing over, and otherwise hand back exactly what is already there.
 *
 * THE WORLD ON SCREEN SPEAKS FOR ITSELF, AND ONLY AN EMPTY EDITOR FALLS BACK.
 * When the editor holds a world, that world is the whole of this tab's standing.
 * When it holds nothing — which is what a CLEAR leaves — there is no live world to
 * name the thing being thrown away, and the slot would stand: a visitor who cleared
 * their own draft got it back on the next reload. So an empty editor falls back to
 * `retiringDraftIdentity`, the world this tab's last swap took OUT, stamped at the
 * chokepoint (settlementLifecycleHelpers.js).
 *
 * ⭐ THE FALLBACK IS WHAT SPENDS THE CLAIM, and it is why no post-write consumption
 * step exists. The claim is READ only while the editor is empty, and the only way
 * out of an empty editor is a door — which re-stamps the field, to an identity or
 * to null, at this same chokepoint. So it can never outlive the window it was
 * raised for. A null written back from inside the projection would have to cross
 * the persist middleware to be observed at all, and a claim that depends on
 * middleware ordering to stay honest is exactly the machinery this design retired.
 *
 * Returning the stored envelope is what "leave it untouched" has to mean here —
 * persist writes the whole projection every time, so a slot is only preserved by
 * being re-emitted. The value is the object `readAnonDraft` lifted, so the bytes
 * that go back are the bytes that came out.
 *
 * ⛔ AN UNNAMEABLE SLOT IS NEVER RETIRED. `null` is what `draftIdentity` returns
 * for a world it cannot name, so comparing against it would make two unnameable
 * worlds equal. The slot's own identity is resolved FIRST and a null one returns
 * early, which is what keeps the null from ever matching anything.
 *
 * @param {any} settlement the world in this tab's editor, or null
 * @param {any} lastSeed that world's seed, or null
 * @param {any} retiring the identity this tab's last swap retired, or null — read
 *   ONLY when the editor is empty
 * @returns {{ settlement: any, lastSeed: any }|null}
 */
function retireOrKeepStoredDraft(settlement, lastSeed, retiring) {
  const stored = storedAnonDraft();
  if (!stored) return null;
  const slot = draftIdentity(stored.settlement, stored.lastSeed);
  if (slot === null) return stored;
  const here = settlement ? draftIdentity(settlement, lastSeed) : retiring;
  return slot === here ? null : stored;
}

export function partializeStoreState(state) {
  // Destructured, and the envelope below is built from SHORTHAND, on purpose:
  // the persist-shape walker (tests/store/lifecycleRoundTrip) discovers this
  // projection's keys by scanning the return block for `name: state.field`, so an
  // inline `{ settlement: state.settlement }` inside the envelope would register
  // as two more TOP-LEVEL persisted keys that do not exist.
  const { settlement = null, lastSeed = null } = state || {};
  return {
    config: state.config,
    configExplicitFields: state.configExplicitFields,
    institutionToggles: state.institutionToggles,
    categoryToggles: state.categoryToggles,
    goodsToggles: state.goodsToggles,
    servicesToggles: state.servicesToggles,
    // Device-scoped display preferences, deliberately separate from session UI.
    displayPrefs: state.displayPrefs,
    // World play-mode preference; additive and absent-tolerant on older blobs.
    advanceAutoResolve: state.advanceAutoResolve,
    // The anonymous draft, as ONE envelope (see the header) — never a bare
    // settlement and never a lone flag. THIS TAB'S world goes in on TWO
    // conditions: nobody is signed in NOW, and the editor's recorded origin says
    // an anonymous session made this world. A world installed by a door that set
    // no origin leaves the origin null, which is not 'anon', so it fails closed.
    // Anything else defers to what the DEVICE already holds — see the header's
    // cases (b) and (c). ⚠ `draftOrigin` is read here and is NOT itself a
    // persisted key — see the header.
    // ⚠ The value expression must keep OPENING on `state.` — the persist-shape
    // walker (tests/store/lifecycleRoundTrip) discovers this projection's keys by
    // scanning the return block for a key followed by a `state` member read, so a
    // key whose value opens on a local reads to it as a REMOVED persisted key.
    // (Which is also why this note may not spell that pattern out: the scan would
    // count the example as a key.)
    // The else-branch is no longer a bare null: it retires the slot only when the
    // slot holds a world this tab has standing over — the one on screen, or the one
    // its last swap retired — and otherwise re-emits what another tab put there.
    anonDraft: state.auth?.user == null && state.draftOrigin === 'anon' && settlement
      ? { settlement, lastSeed }
      : retireOrKeepStoredDraft(settlement, lastSeed, state.retiringDraftIdentity),
  };
}
