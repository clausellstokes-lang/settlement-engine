# The gate's cure: no identical goal sentence made by the rotation or the post-pass (for GOALS-3 to staff)

Written 2026-11-20 13:09 UTC by GOALS-2 at its hand-over, on the chair's gate of 12:32 UTC (`GOALS-2-HANDBACK.md` §1.1). Base of the work: `lane/goals-2-2026-11-20` at its hand-over commit (units 1, 3, 4, 5, 6 merged). One builder; the integrator reads the diff line by line and re-runs red and green.

## The measure that convicts (EXECUTED)
`goals/measures/goals-final.df2a87131.out.txt`: identical goal sentences in one town 7 (city 2, metropolis 5) against the base's 3 (city 1, metropolis 2: `goals-final.base-835fabd2d.out.txt`); every survivor named in `goals/measures/identical-survivors.df2a87131.out.txt` (10 sentences, 21 lines). None was moved by the post-pass. Two causes, both in `goals.js :: dealGoals`' PASS TWO:

1. **A wording with NO name slot taken at rung (ii)/(iii).** A wording whose template names no one (every PERSONALITY line; any line whose only slots are `resource`, `import`, `issue`, `chain`) IS its sentence, so a second holder at 'twice' prints the same sentence. The mirror guard `mirror = (x) => { const n = namesOf(x); return !!n && n === heldNames.get(x.wording)[0]; }` returns false for `n === ''`, so it lets them through. Survivors: hxd-city-49 "PERSONALITY/sway", hxd-metropolis-11 "forbidden_patron", hxd-metropolis-19 "grudge" (each: a non-repeater and a second holder at rung 'twice').
2. **Rung (iv) 'stands' on a wording another holder already filled with the SAME name values.** An earlier repeat X takes wording W at 'twice' (W's first holder filled other names); a later repeat Z drawn on W with X's names finds no rung and STANDS, printing X's sentence. Pass one's exact-text `held` set guards pass-one texts only, never a text pass two assigned. Survivors: hxd-city-5, hxd-metropolis-23, hxd-metropolis-33 ×2 (POWER competitive/tense: X 'twice', Z 'stands').

The post-pass (`refuseWantsBesideSecrets`) has the same two holes in its own rungs (`once`'s `namesOf(c) && …`; its `walk[0]` fallback): it moved no survivor on the 300 towns, but a cure closes it there too.

## The cure (draw-free; only repeats move; ONE rule for both places)
- A candidate is the SAME SENTENCE as a holding when its filled text equals that holding's text (exactly what the measure counts). Rungs (ii) and (iii) never take a candidate that is the same sentence as any holder of its wording (this subsumes the mirror for name-less lines; keep the mirror rule as it is for named ones).
- Rung (iv): the drawn wording stands ONLY if its text is no holder's text. Otherwise the walk goes on, in rotation order, the reserve included, to the first candidate whose TEXT nobody in the town holds (any holder count of its wording); only if no candidate of the group qualifies does the drawn one stand, counted on the receipt as a new rung (say 'stands-identical'), so the measure can name it with its cause ("cell exhausted for these name values").
- The same two rules in the post-pass's rungs.
- Pass one, every draw and the `held` set are untouched (the chair's 12:05 ruling: the held set is a named survivor, not this unit's).

## Tests (red first on the hand-over commit)
- A planted cast where two cards of one PERSONALITY cluster are a non-repeater and a repeat with no free wording: the repeat never prints the first card's sentence (red today: it takes 'twice').
- A planted cast reproducing cause 2 (X 'twice' on W, Z drawn on W with X's names): Z does not print X's sentence (red today: 'stands').
- An exhausted cell (one line, three holders of one cluster): the third stands, counted as the new rung (the residue is allowed only there).
- Keep green: `goalsNoRepeatedWording.test.js` (a)–(h), `goalSecretRefusals.test.js` (j)–(o), `tests/generators/people`, `goalFamilies`, the two walkers.

## The count owed
`goals-final.mjs` on the 300 towns before and after, by size: identical ≤ the base's 3 at EVERY size (city ≤ 1, metropolis ≤ 2) with each survivor named and its rung; mirror below 222 (80 at df2a87131) with the rest named by cell; template>2 and template=2 reported; the confinement 833e4d413 → the cure: only repeats move (GOALS-1's `only-repeaters.mjs`).

## Files
`src/generators/people/goals.js`; `tests/generators/people/goalsNoRepeatedWording.test.js` (or a sibling); `tests/generators/people/goalSecretRefusals.test.js` only if the post-pass's arms need a planted case. No rename; no data file.
