/**
 * decreeHook.js — THE HEAD-OF-TICK APPLICATION (EM-E1, wave 3; ARCH §1 and §6, design
 * §2.6, §11, §12.1, §12.11 and §20.3).
 *
 * "The pulse's head takes the pending decrees in order, applies each as a cause, then
 * runs the simulation" (design §2.6). This module is that head and nothing else: it
 * produces the CAUSES and the amended registry, and the world effect of each op belongs
 * to the members that bind the verbs (EM-E4 to EM-E7). At this wave a cause is a
 * receipt — the finite record of what the table's hand did, which EM-E2's chronicle
 * line and EM-E3's advance report read. It invents no world state, and a cause whose
 * verb is not yet bound still lands as a cause rather than as nothing (design §9: a
 * missing warning costs less trust than a false one, and a silently-dropped decree is
 * the worst of both).
 *
 * ⛔ IT CONSUMES NO PRNG AND READS NO CLOCK (design §12.11; ARCH §6). The stamp and the
 * tick reference are the CALLER's, exactly as EM-C1's `stage` takes its id and its
 * `orderedAt` (HZ-STAMP — a clock is read in the command that writes it). The import
 * fence is the structural half of that claim and case E1-3 executes the other half over
 * a counting stream: the kernel's draws are identical with and without a decree.
 *
 * ⛔ AT ZERO DUE DECREES EVERY INPUT COMES BACK BY REFERENCE. The preset lighting
 * witness hashes `JSON.stringify` of a simulated year, so a key minted on a world that
 * has no decrees — or a registry re-sealed into a new array — would move a byte golden
 * with no cause (design §12.11, §12's finding 11). Every verb here short-circuits on an
 * empty due set and returns its argument, and the kernel spreads its receipt key ONLY
 * when the cause list is non-empty.
 *
 * ⛔ EM-C1 IS THE WRITER; THIS MODULE HOLDS ONE ROW-WRITE, AND ARCH §1 PLACES IT HERE.
 * `applyDecreesAtTick` reaches every row through EM-C1's own `markApplied` and
 * `withdraw`, so the DM-facing verbs keep their single home (§P4: exactly one writer per
 * state). `retractDecreesOfTick` is the rewind's half (design §12.1) and CANNOT route
 * through EM-C1: its `amendPending` is pending-only by law, and an applied entry is
 * read-only to every verb but the rewind (THE PROMISE, design §12's product ruling). It
 * is written as the exact inverse of `markApplied` — it removes precisely the keys that
 * verb adds, and restores `status` in its own place — and case E1-7 executes the
 * round-trip identity over the SERIALIZED registry, so the two writers cannot drift.
 *
 * ⛔ THE PREDICATES BELOW ARE RE-SPELLED, NOT RE-DECIDED. `isPlainObject`, `isName`,
 * `isEntry` and `orderIndexOf` are module-private in `registry.js`, so this leaf spells
 * its own; each is a character-for-character copy of EM-C1's and case E1-8 holds this
 * module's entry predicate equal to EM-C1's observable behaviour over the same rows.
 * The ORDER is not re-spelled at all — `compareDecrees` is imported, so the sequence the
 * tick applies is the sequence the guards judged (EM-C1's header, design §11).
 */

import { compareDecrees, markApplied, resolveDecree, withdraw } from '../edit/registry.js';
import { saveId } from './pulseHelpers.js';

/** @typedef {import('../edit/registry.js').Decree} Decree */
/** @typedef {import('../edit/registry.js').Resolution} Resolution */

/**
 * The kernel's event form for one applied decree (ARCH §6). `cause` is the table's hand;
 * `offStage`, `overrode` and `followsFrom` are CARRIED from the entry and are absent when
 * the entry does not hold them, because absence is a fact (EM-C1's header, design §20.3).
 *
 * ⭐ `consequence` IS DESIGN §13's RESOLVED POLICY (EM-E4d unit 3, U88) and is CARRIED
 * exactly as the three above are: present only for an act the off-stage resolver speaks
 * for, absent — never defaulted, never `null` — for every home act and for every caller
 * that composed no resolution. Its two words are `PHANTOM_CONSEQUENCE_POLICIES`' and are
 * spelled NOWHERE in this file; see `applyDecreesAtTick`'s `consequences` clause.
 *
 * @typedef {{ decreeId: string, saveId: string, opType: string, cause: 'table',
 *   tickRef: string, orderIndex: number, target?: unknown, offStage?: true,
 *   consequence?: string, overrode?: readonly unknown[],
 *   followsFrom?: readonly unknown[] }} DecreeCause
 */

/** The one cause word an applied decree carries (ARCH §6; design §2.6's "the table's hand"). */
export const DECREE_CAUSE = 'table';

const PENDING = 'pending';
const APPLIED = 'applied';
/** Design §20.3's one withdrawal family, spelled as EM-C1's `WITHDRAWN_REASON_KINDS[0]`. */
const VOCABULARY_MOVED = 'vocabulary-moved';
/** The off-stage marker of ARCH §2's `Op.stage`. */
const OFF_STAGE = 'off-stage';

/**
 * ⭐ EM-E2'S OWN ADDRESS FOR ONE DECREE'S CHRONICLE LINE, RE-SPELLED HERE AND HELD EQUAL
 * RATHER THAN IMPORTED (EM-C1b unit 2 / the verifier's FIX-7, U76).
 *
 * `decreeChronicleLine` mints a line's id from the entry's RECORDED reference when it has
 * one and from `decree:` plus the decree's own id when it does not, so this prefix is that
 * leaf's grammar and not a second one. It is spelled here for the reason case E1-8 spells
 * out: THIS FILE'S IMPORT LIST IS EXACTLY TWO, and the prose leaf — which has no `src/`
 * importer at all, on purpose, so its volume stays out of the editor's chunk — cannot be
 * the third. `EditModeShell.jsx`'s `chronicleHrefFor` already re-spells the same grammar
 * for the same reason, and the estate's answer to a re-spelling is the one taken here:
 * case C1b-1 drives the REAL producer over the same row and holds the two EQUAL, so a
 * change to the leaf's minting reds rather than drifting.
 */
const CHRONICLE_REF_PREFIX = 'decree:';

/** One frozen empty list, so a dormant tick allocates nothing and compares alike. */
const NO_CAUSES = /** @type {readonly DecreeCause[]} */ (Object.freeze([]));

/** The same, for the due set EM-E4's fork consult reads (design §12.11). */
const NO_DUE = /** @type {readonly unknown[]} */ (Object.freeze([]));

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain object, never an array and never null */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {value is string} a non-empty string */
function isName(value) {
  return typeof value === 'string' && value.length > 0;
}

/** @param {unknown} value @returns {value is Record<string, unknown>} an entry this module will read or write */
function isEntry(value) {
  return isPlainObject(value) && isName(value.id)
    && isPlainObject(value.op) && isName(value.op.type);
}

/** @param {unknown} registry @returns {readonly unknown[]} the rows, never mutated */
function rowsOf(registry) {
  return Array.isArray(registry) ? registry : [];
}

/** @param {unknown} row @returns {number} an absent or non-finite index reads 0 (EM-C2 §6) */
function orderIndexOf(row) {
  const raw = isPlainObject(row) ? row.orderIndex : undefined;
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
}

/** @param {unknown} worldState @returns {number} the tick this pulse is composing */
function tickOf(worldState) {
  const raw = isPlainObject(worldState) ? worldState.tick : undefined;
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
}

/**
 * The season this tick falls in, read off the world's own calendar
 * (`calendarFromWeeks` writes `season` on every advance). A world with no calendar
 * season reads the empty string, which no entry can equal, so a season-scheduled entry
 * WAITS rather than applying by accident.
 * @param {unknown} worldState @returns {string}
 */
function seasonOf(worldState) {
  const calendar = isPlainObject(worldState) && isPlainObject(worldState.calendar)
    ? worldState.calendar
    : null;
  return calendar && isName(calendar.season) ? calendar.season : '';
}

/**
 * ⛔ DUE — AND THE ONE READING HERE THAT IS A JUDGMENT, RECORDED SO IT CAN BE VETOED.
 * ARCH §6 says "pending entries whose `when` is this tick (or unset)". Read `===`, a
 * decree whose tick has already passed can never apply and waits pending forever with no
 * line anywhere saying so — the silent loss design §20.3 refuses for a moved vocabulary,
 * arriving instead through the schedule. Read `<=`, an overdue entry lands at the next
 * tick, in its own order, visibly. THE CHAIR'S READING IS `<=`: due, never missed.
 * REVERSAL: spell it `===` — one character, and case E1-5's future arm is untouched
 * either way, because a `when.tick` GREATER than this tick is not due under both.
 *
 * Three classes, exactly EM-C1's `whenOf`: no `when` (or an empty one) is due now; a
 * `when.tick` is due at or after its tick; a `when.season` is due in that season.
 *
 * @param {unknown} row @param {number} tick @param {string} season @returns {boolean}
 */
function isDue(row, tick, season) {
  if (!isEntry(row) || row.status !== PENDING) return false;
  const when = isPlainObject(row.when) ? row.when : null;
  if (!when) return true;
  const at = typeof when.tick === 'number' && Number.isFinite(when.tick) ? when.tick : null;
  if (at !== null) return at <= tick;
  return isName(when.season) ? when.season === season : true;
}

/**
 * One entry's cause, in the kernel's event form (ARCH §6). Frozen, finite, and built
 * only from what the entry holds — no field is invented and none is defaulted.
 * @param {Record<string, unknown>} row @param {string} saveKey @param {string} tickRef
 * @param {unknown} consequence design §13's policy for THIS entry, or absent
 * @returns {DecreeCause}
 */
function causeFor(row, saveKey, tickRef, consequence) {
  const op = isPlainObject(row.op) ? row.op : {};
  /** @type {Record<string, unknown>} */
  const cause = {
    decreeId: String(row.id),
    saveId: saveKey,
    opType: isName(op.type) ? op.type : '',
    cause: DECREE_CAUSE,
    tickRef,
    orderIndex: orderIndexOf(row),
  };
  if (isPlainObject(op.target)) cause.target = op.target;
  if (op.stage === OFF_STAGE) cause.offStage = true;
  if (isName(consequence)) cause.consequence = consequence;
  if (Array.isArray(row.overrode)) cause.overrode = Object.freeze([...row.overrode]);
  if (Array.isArray(row.followsFrom)) cause.followsFrom = Object.freeze([...row.followsFrom]);
  return /** @type {DecreeCause} */ (Object.freeze(cause));
}

/**
 * THE HEAD OF THE TICK for ONE registry (ARCH §6's signature). Every DUE pending entry,
 * in EM-C1's reading order, becomes a cause and is `markApplied` with this tick's
 * `tickRef`; an entry that no longer resolves against the live catalogues is WITHDRAWN
 * with its reason and never applied (design §20.3). A future `when` is untouched.
 *
 * PURE. It reads no clock and takes no draw: `tickRef` and `options.now` are the
 * caller's. `now` and `tickRef` must both be non-empty strings for anything to apply,
 * because that is `markApplied`'s own refusal (EM-C1) and a silent half-apply would put
 * a cause in the record for an entry the registry still calls pending.
 *
 * `options.catalogues` is `{ opTypes, pools }`, HANDED IN exactly as EM-C1's
 * `resolveDecree` requires — this leaf may no more import the op catalogue than that one
 * may (`tests/lint/editMutationPath.walker.test.js`). ABSENT, resolution is not
 * consulted and every due entry applies; that is this wave's shape, because the caller
 * that can supply the catalogues is the store (EM-C4b), not the kernel.
 *
 * ⭐ `options.consequences` IS DESIGN §13's POLICY, RESOLVED AND HANDED IN (EM-E4d unit 3,
 * U88; the verifier's FIX-6). *"The op catalogue carries one `consequence` policy per
 * off-stage op — `home-procedures+record` for a phantom target, `world` for a real save —
 * decided at apply time by the target's reality; the tick hook applies that policy and
 * nothing else."* This is the "applies" half: one flat `{ entryId: policy }` table for THIS
 * registry, and each applied entry named in it carries its word onto its cause. ABSENT (every
 * direct caller, every preview, every test that does not supply one) no cause carries the
 * key and the output is byte-identical to this member's base.
 *
 * ⛔ THE HOOK RESOLVES NOTHING AND SPELLS NOTHING, FOR THE REASON IT RESOLVES NO VOCABULARY.
 * Reality is a fact about the SAVES and the verb that judges it is `phantoms.js`'s
 * `consequenceFor`, under `src/domain/edit` — the one directory case E1-8's two-import pin
 * exists to keep out of this leaf, and whose own importer roster is asserted EXACT in both
 * directions by `tests/domain/phantoms.test.js` A12. So the knowledge travels as an argument,
 * exactly as `catalogues` does, and the two policy words are carried verbatim rather than
 * compared: a SECOND spelling of them here is precisely the drift the estate refuses ("the
 * badge and the policy are one fact read twice").
 *
 * ⛔ AND "NOTHING ELSE" IS STRUCTURAL RATHER THAN POLICED. This verb reads no world state and
 * writes none on either policy — a phantom act produces the home procedures and the record,
 * and a REAL counterparty's consequence is the simulator's, "which the editor only hands the
 * decree". The cause is that hand. Case E4d3-3 executes it: the whole simulation digest is
 * byte-identical with a phantom act, with a real one, and with no decree at all.
 *
 * @param {unknown} worldState @param {unknown} registry @param {unknown} tickRef
 * @param {{ now?: unknown, saveId?: unknown, catalogues?: unknown,
 *   consequences?: unknown }} [options]
 * @returns {{ registry: unknown, causes: readonly DecreeCause[] }} the registry BY
 *   REFERENCE when nothing moved, else EM-C1's sealed registry.
 */
export function applyDecreesAtTick(worldState, registry, tickRef, options) {
  const rows = rowsOf(registry);
  if (rows.length === 0 || !isName(tickRef)) return { registry, causes: NO_CAUSES };
  const bag = isPlainObject(options) ? options : {};
  const now = bag.now;
  const consequences = isPlainObject(bag.consequences) ? bag.consequences : null;
  const saveKey = isName(bag.saveId) ? bag.saveId : '';
  const tick = tickOf(worldState);
  const season = seasonOf(worldState);
  const due = rows.filter((row) => isDue(row, tick, season)).sort(compareDecrees);
  if (due.length === 0) return { registry, causes: NO_CAUSES };
  /** @type {DecreeCause[]} */
  const causes = [];
  let current = registry;
  for (const row of due) {
    if (!isEntry(row)) continue;
    const entryId = String(row.id);
    if (bag.catalogues !== undefined) {
      const resolution = /** @type {Resolution} */ (resolveDecree(row, bag.catalogues));
      if (resolution.ok === false) {
        // A refusal whose `was` is empty (a malformed entry) withdraws WITHOUT a reason:
        // that is EM-C1's `withdrawnReasonOf` refusing to record a word it does not have,
        // and the entry is still kept for the record with its own order (design §2.5).
        current = withdraw(current, entryId, {
          kind: VOCABULARY_MOVED, missing: resolution.missing, was: resolution.was,
        });
        continue;
      }
    }
    if (!isName(now)) continue;
    // ⭐ THE LINE'S REFERENCE IS WRITTEN IN THE SAME ACT AS THE APPLICATION, because this is
    // the ONLY instant at which it can be: `markApplied` reaches its row through EM-C1's
    // `amendPending`, which amends a PENDING entry and nothing else, so a writer seated
    // after the tick hands the reference to a verb that has already declined it — silently,
    // the registry re-sealed and the key absent (EM-E2b measured exactly that, case E2b-1,
    // and STOPPED on it). The LINE itself is composed and appended by the advance, which is
    // the layer that holds the campaign and its one `chronicles[]` writer; this leaf may
    // reach neither, and the address is all it needs to write.
    const next = markApplied(current, entryId, {
      appliedAt: now, tickRef, chronicleRef: `${CHRONICLE_REF_PREFIX}${entryId}`,
    });
    current = next;
    // Own-key only, so a policy inherited from a prototype is not one this tick applies.
    causes.push(causeFor(row, saveKey, tickRef,
      consequences && Object.hasOwn(consequences, entryId) ? consequences[entryId] : undefined));
  }
  if (causes.length === 0 && current === registry) return { registry, causes: NO_CAUSES };
  return { registry: current, causes: Object.freeze(causes) };
}

/**
 * ⭐ THE PULSE'S FORK CONSULT, ITS SCHEDULE HALF (EM-E4, wave 3; design §16's "ONE HOOK:
 * the pulse consults pins at each registered fork"). The DUE pending entries of one
 * registry, in EM-C1's own reading order: exactly the set `applyDecreesAtTick` is about to
 * apply, selected by the same `isDue` over the same three `when` classes, so the pins a
 * tick honours and the decrees it applies can never be two different sets.
 *
 * ⛔ THE CONSULT IS TWO PURE VERBS AND THE SECOND ONE IS NOT HERE, WHICH IS MEASURED
 * RATHER THAN CHOSEN. EM-E4's `forkPinsFor` folds these entries into the pin bag and
 * judges each one against its fork's declared vocabulary; it lives under `src/domain/edit`
 * with the rest of the directive vocabulary, and this leaf does not import it because case
 * E1-8 pins this file's import list at EXACTLY TWO and the coupling walker measures the
 * same leaf's declared `reads` against the live import graph. The estate's own answer to
 * that pair of instruments is the one EM-C1 and EM-C3 already took: the knowledge travels
 * as an argument, not as an edge. The kernel composes the two in one line at the head, and
 * the SCHEDULE stays where the schedule lives.
 *
 * ⛔ IT READS PENDING ENTRIES, SO IT IS CONSULTED BEFORE THE APPLY. `isDue` is pending-only
 * by law and `applyDecreesAtTick` marks every entry it applies, so the same read AFTER the
 * apply is empty. Case E4-10 executes that, and the same case holds this verb's due ids
 * equal to the causes the apply names, so the two readings of `isDue` cannot drift.
 *
 * ⛔ AT ZERO DUE ENTRIES IT RETURNS ONE SHARED FROZEN LIST, so a dormant tick allocates
 * nothing and compares alike (design §12.11).
 *
 * PURE. No clock, no draw, no write: the registry is read and nothing comes back from it
 * but its own rows, by reference.
 *
 * @param {unknown} worldState @param {unknown} registry
 * @returns {readonly unknown[]} the due rows, or the shared empty list.
 */
export function dueEntriesAtTick(worldState, registry) {
  const rows = rowsOf(registry);
  if (rows.length === 0) return NO_DUE;
  const tick = tickOf(worldState);
  const season = seasonOf(worldState);
  const due = rows.filter((row) => isDue(row, tick, season));
  return due.length === 0 ? NO_DUE : Object.freeze(due.sort(compareDecrees));
}

/**
 * THE KERNEL'S ONE HOOK — the same verb over every member save that carries a registry
 * (design §2.5: `decrees` is a key on the SAVED SETTLEMENT, so the campaign's tick is N
 * registries, not one). A save without the key is returned untouched and the key is
 * NEVER MINTED here: the persisted shape is the owner's, and a world that holds no
 * decree must come out of the kernel exactly as it went in (design §12.11).
 *
 * ⭐ AND BECAUSE THE TICK'S SUBJECT IS N REGISTRIES, IT IS N VOCABULARIES (U86, lane E's
 * ruling 2). `options.catalogues` here is the REALM's bag — `{ opTypes, poolsBySave }` —
 * and each registry is judged against the pools filed under ITS OWN save id, never against
 * a fold across the members. EM-E1's `applyDecreesAtTick` still takes the FLAT
 * `{ opTypes, pools }` that `resolveDecree` requires; this verb is where the realm's bag
 * becomes one town's, which is the only layer that knows which registry belongs to whom.
 * U72 shipped the LAX UNION and recorded the cost in its own header: a word alive in SOME
 * member town admitted an order in a town that had never offered it — "a pin on a fork
 * that no longer means what the DM chose is a lie" told about the wrong town.
 *
 * ⛔ A SAVE THE BAG DOES NOT NAME IS HANDED NO CATALOGUES AT ALL, which is not the same
 * fact as a save named with an empty pool set. The first is silence — the composer never
 * read that town, so nothing here may claim its words moved (design §9: a missing warning
 * costs less trust than a false one) — and resolution is simply not consulted, exactly as
 * it is for every caller that composes no bag. The second is a reading, and its orders are
 * resolved and withdrawn on it.
 *
 * ⭐ THE REALM'S BAG CARRIES A THIRD TABLE AT THIS MEMBER — `consequenceBySave` (EM-E4d unit
 * 3, U88) — filed under the SAME `saveId` and narrowed by the same own-key reading, because
 * design §13's policy is decided by a fact about the campaign's saves and is therefore a
 * town's own just as its vocabulary is. A realm bag without the key hands every registry
 * `undefined` and no cause carries a policy word, which is this member's base exactly.
 *
 * @param {unknown} worldState @param {unknown} saves @param {unknown} tickRef
 * @param {{ now?: unknown, catalogues?: unknown }} [options]
 * @returns {{ saves: unknown, causes: readonly DecreeCause[] }} the saves BY REFERENCE
 *   when no registry moved.
 */
export function applyDecreesToSaves(worldState, saves, tickRef, options) {
  const rows = Array.isArray(saves) ? saves : [];
  if (rows.length === 0 || !isName(tickRef)) return { saves, causes: NO_CAUSES };
  const bag = isPlainObject(options) ? options : {};
  const realm = isPlainObject(bag.catalogues) ? bag.catalogues : null;
  const poolsBySave = realm && isPlainObject(realm.poolsBySave) ? realm.poolsBySave : null;
  // ⭐ §13's RESOLUTION IS FILED THE SAME WAY THE VOCABULARY IS, and for the same reason: the
  // tick's subject is N registries, so a town's consequences are its own town's. Narrowed
  // here rather than in `applyDecreesAtTick` because THIS is the layer that knows which
  // registry belongs to whom (EM-E4d unit 3).
  const consequenceBySave = realm && isPlainObject(realm.consequenceBySave)
    ? realm.consequenceBySave
    : null;
  // Lifted out of the walk because the op catalogue is ONE table for the realm — only the
  // pools are a town's own — and because reading it here is what keeps the narrowing on
  // `realm` a real one rather than a cast inside the loop (the any-cast floor is zero).
  const opTypes = realm ? realm.opTypes : undefined;
  /** @type {DecreeCause[]} */
  const causes = [];
  let moved = false;
  const next = rows.map((save) => {
    const settlement = isPlainObject(save) && isPlainObject(save.settlement) ? save.settlement : null;
    if (!settlement || !Array.isArray(settlement.decrees) || settlement.decrees.length === 0) return save;
    const saveKey = saveId(save);
    const applied = applyDecreesAtTick(worldState, settlement.decrees, tickRef, {
      ...bag,
      saveId: saveKey,
      // `undefined` is the ABSENCE the hook's own guard reads, so an unnamed member takes
      // the documented no-resolution path rather than an empty vocabulary.
      catalogues: poolsBySave && Object.hasOwn(poolsBySave, saveKey)
        ? { opTypes, pools: poolsBySave[saveKey] }
        : undefined,
      consequences: consequenceBySave && Object.hasOwn(consequenceBySave, saveKey)
        ? consequenceBySave[saveKey]
        : undefined,
    });
    if (applied.registry === settlement.decrees) return save;
    moved = true;
    causes.push(...applied.causes);
    return { ...save, settlement: { ...settlement, decrees: applied.registry } };
  });
  if (!moved) return { saves, causes: NO_CAUSES };
  return { saves: next, causes: Object.freeze(causes) };
}

/**
 * THE REWIND's hook half (design §2.5a and §12.1; ARCH §1 and §6). Every entry this
 * `tickRef` applied returns to the WAITING sequence with its chronicle line retracted:
 * `appliedAt`, `tickRef` and `chronicleRef` are removed, `status` returns to `pending`
 * IN ITS OWN PLACE, and the op, the `orderIndex` and every other word are carried
 * verbatim — "a rewind never loses a decree and never reorders one". Nothing else in the
 * registry is touched, so an entry applied at an EARLIER tick stays applied.
 *
 * The exact inverse of `markApplied`, and the ONLY verb in the estate that returns an
 * applied entry to pending (THE PROMISE). It pairs with EM-C1's `revertTick`, which
 * re-appends what was staged after the tick: the snapshot restore supplies the pre-tick
 * registry, `revertTick` supplies the later entries, and this verb is what the undo path
 * uses where a restore is not the source (an applied entry reached by any other rewind).
 *
 * @param {unknown} registry @param {unknown} tickRef
 * @returns {unknown} the registry BY REFERENCE when no entry belonged to that tick.
 */
export function retractDecreesOfTick(registry, tickRef) {
  const rows = rowsOf(registry);
  if (rows.length === 0 || !isName(tickRef)) return registry;
  let moved = false;
  const next = rows.map((row) => {
    if (!isEntry(row) || row.status !== APPLIED || row.tickRef !== tickRef) return row;
    moved = true;
    const { appliedAt: _appliedAt, tickRef: _tickRef, chronicleRef: _chronicleRef, ...rest } = row;
    return Object.freeze({ ...rest, status: PENDING });
  });
  return moved ? Object.freeze(next) : registry;
}
