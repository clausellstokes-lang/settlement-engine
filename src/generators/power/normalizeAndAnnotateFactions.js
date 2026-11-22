/**
 * power/normalizeAndAnnotateFactions.js — moved verbatim out of power/rulingStructure.js (COHERENCE-POWERS-3, F12:
 * that module held its 800-line ceiling by packing statements onto shared lines; the ceiling law cures by a split,
 * never raised, never packed). rulingStructure.js re-exports it, so every importer keeps its path.
 */
import { annotateFactionStanding } from './factionStanding.js';

// normalizeAndAnnotateFactions — renormalise faction powers to percentages,
// sort governing-first then by descending power, and append inter-faction
// standing colour to each faction's description in place. Guard the degenerate
// empty / all-zero-power roster: without it `f.power / 0` is NaN and
// Math.round(NaN) = NaN corrupts every share, the sort, and the standing
// annotation — it degrades to 0 shares instead. Byte-identical on the normal
// path (totalPower > 0). Exported for the focused degenerate-roster test.
export const normalizeAndAnnotateFactions = (factions, force, { annotate = true } = {}) => { // SW-B1 (P51): generatePowerStructure annotates after its last power write
  const totalPower = factions.reduce((sum, faction) => sum + (faction.power || 0), 0);
  factions.forEach((faction) => {
    faction.power = totalPower > 0 ? Math.round(((faction.power || 0) / totalPower) * 100) : 0;
  });
  factions.sort((a, b) => (a.isGoverning ? -1 : b.isGoverning ? 1 : b.power - a.power));
  if (annotate) annotateFactionStanding(factions, force);
  return factions;
};
