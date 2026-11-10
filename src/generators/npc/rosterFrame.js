/**
 * generators/npc/rosterFrame.js — A TEXT'S FRAME, REMEMBERED PER ROSTER (GEN-SPEED cure 2,
 * 2026-11-10).
 *
 * `npcGenerator.js :: generateCrimeLevel`'s 25% branch refuses a secret whose FRAME — every roster
 * name masked by a sequential, longest-first `split(name).join('@')` (STYLE-2 SW-7, B10(b)) — the
 * rest of the roster already holds. It re-framed the WHOLE held set for every person who took the
 * branch: persons × held × names masking steps, cubic in the roster, a sixth of the CPU of the
 * wizard's heaviest request (one press of "Force all" at Metropolis, 226 named people).
 *
 * THE EXACTNESS ARGUMENT. The frame of a text is a pure function of two values: the ordered name
 * list and the text. It is remembered under exactly those two, by CONTENT:
 *   - the slot is keyed by the ordered list's JSON, read afresh at every call, never by the
 *     identity of a record or an array a later step may still write to; a call over a different
 *     list (another roster, the same names in another order, a renamed person) replaces the slot;
 *   - within the slot, by the text's own string value.
 * The masking that fills the slot is the same sequential split/join, over the same list, in the
 * same order, as before the cure — never one alternation regex, which differs from it where names
 * overlap and would change which secrets are refused. So a remembered frame is the frame a fresh
 * call computes, and no draw, no roll and no refusal moves.
 * A list holding anything but strings is not remembered (its JSON could not stand for the values
 * `split` coerces); it is masked afresh, as before.
 *
 * One slot, the last roster's frames: a few hundred texts at most, replaced by the next roster.
 * Pure apart from that slot: no randomness, no clock, no record write.
 *
 * @enforced-by tests/generators/crimeLevelFrameWork.test.js
 */

/** @type {{ key: string | null, frames: Map<string, string> }} */
let slot = { key: null, frames: new Map() };

/**
 * The framer of one roster: masks every name of `rosterNames`, in the order given, out of a text.
 * @param {ReadonlyArray<unknown>} rosterNames the roster's names, in masking order (longest first)
 * @returns {(t: unknown) => string} the text's frame, trimmed
 */
export function rosterFramer(rosterNames) {
  /** @param {string} text @returns {string} */
  const mask = (text) => {
    let acc = text;
    for (const nm of rosterNames) acc = acc.split(/** @type {string} */ (nm)).join('@');
    return acc.trim();
  };
  if (!rosterNames.every((nm) => typeof nm === 'string')) return (t) => mask(String(t ?? ''));
  const key = JSON.stringify(rosterNames);
  if (slot.key !== key) slot = { key, frames: new Map() };
  const { frames } = slot;
  return (t) => {
    const text = String(t ?? '');
    let frame = frames.get(text);
    if (frame === undefined) {
      frame = mask(text);
      frames.set(text, frame);
    }
    return frame;
  };
}
