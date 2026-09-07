/**
 * checkpoint.mjs — THE FIX LOOP'S CHECKPOINT POLICY (SK-2B; ODQ §141.2).
 *
 * The WRITER and the READER live in `scripts/audit/soakRules.mjs`, on the certification
 * side of the fingerprint wall, because they decide what a soak measures. What lives
 * HERE is the POLICY: what cadence a rung asks for, where a checkpoint file goes, and
 * how a restore is invoked. None of it touches the engine.
 *
 * ⛔ CADENCE IS AN ARGUMENT, NEVER A CONSTANT IN THE SCRIPT. `--checkpoint-every` has no
 * default: absent means no checkpointing, which is the pre-harness behaviour exactly. A
 * rung picks from a band with a derivation home, and the band is here so a reader can
 * see the reasoning instead of finding a bare number in a call site.
 *
 * ⛔ THE YEAR BOUNDARY IS THE ONLY SEAM. `src/kernel/prng.js` closes over a live
 * seedrandom instance and exposes nothing that restores stream position; interior-tick
 * state lives inside `simulateCampaignWorldInterval`. A sub-year cadence is therefore
 * UNBUILDABLE without an engine-side serialization seam — which would flip this family's
 * no-`src/` classification, so any member reaching for one STOPS and returns to chair.
 */

/**
 * ⭐ DERIVED, not chosen. §141.2's stated intent is "reproduce from tick 3,900 instead
 * of from zero" — i.e. at most ONE YEAR of replay. At 52 ticks/year the ≤52-tick replay
 * serves it exactly. The band's lower bound is the write cost (one `finalRealmBytes` per
 * checkpoint, a figure the receipt already carries); the upper bound is that intent.
 */
export const CHECKPOINT_CADENCE_BANDS = Object.freeze({
  'cert-30': Object.freeze({ min: 1, max: 10, default: 5 }),
  century: Object.freeze({ min: 1, max: 10, default: 5 }),
  'century-300': Object.freeze({ min: 5, max: 25, default: 10 }),
});

/**
 * @param {string} rung
 * @param {number|null} asked  the operator's choice, or null for the band default
 * @returns {{cadence: number|null, refusals: string[]}}
 */
export function checkpointCadence(rung, asked = null) {
  const band = CHECKPOINT_CADENCE_BANDS[rung];
  if (!band) {
    return { cadence: null, refusals: [`REFUSED: no checkpoint cadence band for rung "${rung}"`] };
  }
  if (asked == null) return { cadence: band.default, refusals: [] };
  const years = Number(asked);
  if (!Number.isInteger(years) || years < band.min || years > band.max) {
    return {
      cadence: null,
      refusals: [
        `REFUSED: checkpoint cadence ${JSON.stringify(asked)} is outside the ${rung} band `
        + `[${band.min}, ${band.max}]. The band's upper bound is §141.2's own intent — at most `
        + 'one year of replay — and its lower bound is the per-checkpoint write cost.',
      ],
    };
  }
  return { cadence: years, refusals: [] };
}

/** The file one checkpoint lands in. Derived from the year alone, so it is stable. */
export function checkpointFileName(year) {
  return `checkpoint-year-${Number(year)}.json`;
}

/**
 * The invocation that resumes from a checkpoint.
 *
 * ⛔ `--case-id` IS ABSENT BY CONSTRUCTION, not by omission: a restored run may never
 * compute an official verdict, and the soak script refuses the combination anyway. Two
 * independent guards, because this is the rule a hurried fix lane would most like to
 * break.
 */
export function restoreInvocation({ checkpointPath, seed, years, settlements, sourceSha, receipt }) {
  return [
    '--restore-from', String(checkpointPath),
    '--seed', String(seed),
    '--years', String(years),
    '--settlements', String(settlements),
    '--source-sha', String(sourceSha),
    ...(receipt ? ['--receipt', String(receipt)] : []),
  ];
}

/**
 * The cost a cadence implies, reported so an operator chooses with the figure in front
 * of them rather than after the disk fills.
 */
export function checkpointBudget({ years, cadence, finalRealmBytes }) {
  const count = cadence > 0 ? Math.floor(Number(years) / Number(cadence)) : 0;
  return { count, approxBytes: count * Math.max(0, Number(finalRealmBytes) || 0) };
}
