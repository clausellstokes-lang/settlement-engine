/**
 * domain/facts/heresyStance.js — THE FAITH'S STANCE ON MAGIC, READ FROM THE HERESY FLAG (BAR6-CULTURE, LAW 9 rule
 * 9e.heresy; the chair's ruling HR2 of 2026-11-16, vetoable by the owner).
 *
 * Two readings of one fact stood on one page. The Faith tab's line (the war-and-faith desk's DS-FTH-4 `FLAG:
 * heresySuppression: hunted` / `preached`, `warFaithStateProse.js :: heresyPoolKey`) reads the safety profile's heresy
 * flag ("The faithful of Raskot treat magic as heresy and hunt it as such"); the Magic tab's "Religious acceptance" row
 * printed the magic envelope's own word (`magicProfile.js :: deriveReligiousAcceptance`, drawn from the faction balance),
 * so the same hamlet read "Religious acceptance · indifferent" (C84616). THE FLAG IS THE ONE READING: the row reads it at
 * print. The stored envelope (`magicProfile.religiousAcceptance`) is left as it is.
 *
 * Pure: no randomness, no clock.
 */

/**
 * The faith's stance on magic as the heresy flag gives it: `hunted` at an intensity of one half or more, else `preached`
 * (DS-FTH-4's two pools, `warFaithStateProse.js :: heresyPoolKey`'s own band), or null where the flag is off.
 * @param {unknown} record the settlement record
 * @returns {'hunted'|'preached'|null}
 */
export function heresyStanceOf(record) {
  const flags = /** @type {{ economicState?: { safetyProfile?: { flags?: { heresySuppression?: unknown, heresyIntensity?: unknown } | null } | null } | null } | null | undefined} */ (record)
    ?.economicState?.safetyProfile?.flags;
  if (!flags || flags.heresySuppression !== true) return null;
  return typeof flags.heresyIntensity === 'number' && flags.heresyIntensity * 2 >= 1 ? 'hunted' : 'preached';
}

/**
 * The religious acceptance word the Magic tab prints, under the heresy flag: a faith that hunts or preaches against magic
 * as heresy is hostile to it, whatever the envelope's faction balance gave. Every other word prints as the envelope's.
 * @param {unknown} record the settlement record
 * @param {unknown} word the magic envelope's religious acceptance
 * @returns {unknown}
 */
export function religiousAcceptanceUnderHeresy(record, word) {
  return heresyStanceOf(record) && typeof word === 'string' ? 'hostile' : word;
}
