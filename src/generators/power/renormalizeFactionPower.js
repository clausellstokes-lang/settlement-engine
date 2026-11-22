/**
 * power/renormalizeFactionPower.js — the faction-power share renormaliser (largest-remainder
 * rounding to integer points summing to exactly 100). Moved VERBATIM out of rulingStructure.js
 * (LANDING-R2, the chair's ruling under ODQ §934.105: the module ceiling is cured by a split,
 * never raised); rulingStructure.js re-exports it, so every importer keeps its path.
 */

// renormalizeFactionPower — rescale every faction's `power` to integer
// percentage points summing to exactly 100, using largest-remainder rounding
// so the rounded points always total 100 (never 99 or 101). Mutates in place
// and preserves rank order. Reused by the neighbourFactions step, which injects
// raw-scale powers into the already-percentage-normalized roster and must
// restore the power-share invariant. No-op for an empty/zero-power roster.
// (factionDynamics carries a file-local copy — it cannot import from here
// without closing an import cycle the architecture test bans.)
export const renormalizeFactionPower = (factions) => {
  if (!factions || !factions.length) return factions;
  const total = factions.reduce((sum, f) => sum + (f.power || 0), 0);
  if (total <= 0) return factions;
  // Floor each share, track remainders, then distribute the leftover points to
  // the largest remainders (ties broken by current order) so the sum is 100.
  const shares = factions.map((f, i) => {
    const exact = ((f.power || 0) / total) * 100;
    const floor = Math.floor(exact);
    return { i, floor, remainder: exact - floor };
  });
  let leftover = 100 - shares.reduce((sum, s) => sum + s.floor, 0);
  shares
    .slice()
    .sort((a, b) => b.remainder - a.remainder || a.i - b.i)
    .forEach((s) => {
      if (leftover > 0) {
        s.floor += 1;
        leftover -= 1;
      }
    });
  shares.forEach((s) => {
    factions[s.i].power = s.floor;
  });
  return factions;
};
