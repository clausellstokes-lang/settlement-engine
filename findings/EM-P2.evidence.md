# EM-P2 — evidence (lane EM COMPILE P3, letter `c`, Opus, session 923472dc)

Base and drift: `EM-B2.evidence.md` §E0/§E12/§E14. Base `d31af2cee`; Wave 0 read at `1d2da8c95`.

## P2-E1 · ⛔ THE EXISTING REGISTRY CANNOT HONESTLY WIDEN — measured, both halves

The chair asked which: widen `HABIT_FORK_REGISTRY` or mint a sibling. **The tree answers sibling,
on three measurements.**

```
$ grep -n "every weighted decision fork in" -i src/domain/worldPulse/habitForkRegistry.js tests/lint/chooserTotality.walker.test.js
src/domain/worldPulse/habitForkRegistry.js:5:  ⛔ THE CHOOSER-TOTALITY STOP LAW. Every weighted decision fork in `src/domain` is
tests/lint/chooserTotality.walker.test.js:5:  ⛔ THE LAW: every weighted decision fork in `src/domain` is classified in the habit fork
```

**(a) BOTH headers state the law as `src/domain`-scoped**, so widening the walker's roots to
`src/generators` makes two stated laws false at once. A law a lane silently outgrows is the class
this estate refuses.

```
$ sed -n '64,69p' tests/lint/chooserTotality.walker.test.js
const SCAN_ROOTS = Object.freeze(['src/domain/worldPulse','src/domain/spatial',
  'src/domain/traditions','src/domain/region']);
$ sed -n '72,76p' tests/lint/chooserTotality.walker.test.js
const IDIOM_SIGNATURES = Object.freeze({
  SOFTMAX_SAMPLE: /\b(?:softmaxWeights|stableSampleByWeight)\s*\(/,
  KEYED_RACE: /\bhash01\s*\(/,
  SCORE_EXTREMUM: /\.sort\(\s*\([^)]*\)\s*=>[^;]*\b…(?:[Ss]core|[Cc]ost|[Ww]eight)\b…\)\s*\[\s*0\s*\]/,
});
```

**(b) THE THREE IDIOM SIGNATURES DO NOT MATCH HOW GENERATION DRAWS.** They look for
`softmaxWeights` / `stableSampleByWeight`, `hash01`, and a score-sorted `[0]` — the simulation's
weighted-fork idioms. Generation draws through a forked PRNG and a pick:

```
$ git grep -c "createPRNG(" -- src/generators | awk -F: '{s+=$2} END {print s+0}'   6
$ git grep -c "pickRandom(" -- src/generators | awk -F: '{s+=$2} END {print s+0}'  13
$ git grep -c "rng.fork("  -- src/generators | awk -F: '{s+=$2} END {print s+0}'   14
$ git grep -c "rng("       -- src/generators | awk -F: '{s+=$2} END {print s+0}'   74   (19 files)
$ git grep -c "pickRandom(" -- src/generators | sort -t: -k2 -rn
src/generators/structuralValidator.js:8
src/generators/narrativeGenerator.js:5
```

Pointed at `src/generators`, the idiom scan would find **zero** rows, so every generation row would
land as `discovery: 'checklist'` — the instrument the registry's own header calls the blind half
(*"a HAND-MAINTAINED list with its own totality assertion"*). Widening would therefore grow the
blind half by dozens of rows while the scan half stayed empty: the opposite of what the registry
was minted for.

```
$ grep -o "module: *'[^']*'" src/domain/worldPulse/habitForkRegistry.js | sort -u | wc -l   32
$ grep -c "generators" src/domain/worldPulse/habitForkRegistry.js                            0
$ node -e "…Linter max-lines…" src/domain/worldPulse/habitForkRegistry.js
File has too many lines (296).
```

**(c) Its 43 rows carry a `LEARN | STAY | DEFER | DEAD_CODE` disposition vocabulary about whether a
simulation fork should LEARN over time.** That axis is meaningless for a generation chooser, which
draws once from a seed and never adapts. A generation row would have to carry a different
disposition set, which is a second taxonomy inside one register.

**Conclusion, measured rather than chosen: a SIBLING registry for generation**, with its own scan
roots, its own idiom signatures (`rng.fork(` / `pickRandom(` / `createPRNG(`) and its own
disposition vocabulary (the output KEY a chooser writes, which is what EM-A1 and EM-B2a read).

## P2-E2 · THE DENOMINATOR THE SIBLING MUST COVER

The three ROOT-WRITING steps, read off the declared `provides` graph (`EM-P0.evidence.md` §P0-E1):

| step | root keys it writes |
|---|---|
| `assembleInstitutions` | `institutions` |
| `generatePower` | `powerIntent`, `powerStructure` |
| `generatePopulation` | `npcs`, `factions` (its `relationships` and `conflicts` are derivations) |

and the 14 `rng.fork(` sites, which are the sub-choosers inside them:

```
$ git grep -n "rng.fork(" -- src/generators | head
src/generators/density/applyDensityLaw.js:180:  const lawRng = input.rng.fork('density-law');
src/generators/density/applyDensityLaw.js:239:  … input.rng.fork('density-law').fork('niche-mint'),
src/generators/density/densityAscension.js:123: const rng = input.rng.fork('density-law').fork('seat-ascension');
src/generators/density/densityRoll.js:224:  const rival  = rollRival(rng.fork('rival'), ordered);
src/generators/density/densityRoll.js:265:  const nicheRng = rng.fork('niches');
src/generators/density/densityRoll.js:489:  const sizing = rng.fork('sizing');
src/generators/density/densityRoll.js:530:  … rng.fork('seats'), ordered, factionCount, …
src/generators/density/densityRoll.js:542:  … rng.fork('dispersal'), seated, namedMass, …
src/generators/density/densityRoll.js:547:  const rungRng = rng.fork('rungs');
```

`densityRoll.js` already documents the discipline the sibling registry formalises
(`densityRoll.js:20`): *"Every stage draws from its OWN keyed fork (`rng.fork('sizing')`, …"*. The
fork NAME is therefore already a de-facto chooser key; the registry makes it declared and total.

## P2-E3 · THE ENTROPY CENSUS'S WHOLE-`src` FIGURE, RE-MEASURED

```
$ grep -n "expect(READ_SITES).toHaveLength\|new Set(READ_SITES" tests/lint/entropyRootCensus.walker.test.js
350:    expect(READ_SITES).toHaveLength(23);
351:    expect(new Set(READ_SITES.map((r) => r[0])).size).toBe(23);
375:    expect(reads, 'measured read expressions').toBe(22);
$ sed -n '185p' tests/lint/entropyRootCensus.walker.test.js
  ['NC-1', 'src/generators/power/economyReconciliation.js', 'a generator STEP-RNG fork seed — the MANDATORY control'],
```

The census pins **23 read sites, 23 distinct ids, 22 measured read expressions**, and holds exactly
ONE `src/generators` row (`NC-1`), described as the mandatory control. Those four figures are the
packet's re-measure target; nothing about them is behaviour.

## P2-E4 · THE BUDGET

```
$ node -e "…Linter max-lines…"
src/domain/worldPulse/habitForkRegistry.js -> 296   (layer ceiling 800, no size-baseline entry)
```

A sibling registry is ONE new data leaf plus ONE new walker; the existing registry and its walker
are NOT edited, which is what keeps both stated laws true. Rows and a walker, no behaviour — the
packet mints no chooser, changes no draw, and cannot move a golden.

## P2-E5 · REGISTRATION COST

`tests/lint/` is an `ENFORCER_DIR`, so a new `tests/lint/` walker **owes its
`scripts/mutation-coverage-manifest.json` row** (`PACKET_STANDARD.md`, "A new `tests/lint/` file
carries one obligation"). A new `src/domain/**` data leaf does NOT move the lighting census —
the census's `files` is `TEST_FILES.length` over `walk(join(ROOT,'tests'))` only
(`EM-B2.evidence.md` §E7a); the NEW TEST FILE does.

---

## P2-E6 · ⭐ THE ROW SHAPE (ODQ §934.47 addendum 2, from lane P1's declarations compile)

EM-A1 joins the generation registry on `(cardShape, outputKey)`, where `outputKey` is the RECORD
PATH a chooser writes (`npcs[].role`, `institutions[].category`, `powerStructure.seats[].holder`) —
not the ctx `provides` key §P2-E2 used. The row becomes `{ forkId, module, symbol, outputKey }`
plus this registry's own fields. Two measurements settle its home and its resolution rule.

### (a) THE EXISTING ROW SHAPE CARRIES NO `outputKey` — measured

```
$ git show d31af2cee:src/domain/worldPulse/habitForkRegistry.js | grep -o "^    [a-zA-Z]*:" | sort -u
    actionVocabulary:   arity:   circumstanceClasses:   closeOwed:
    closeSource:   domain:   forkId:   reason:   symbol:
```

`forkId`, `symbol`, `reason` and `module` are shared vocabulary the sibling KEEPS, so the two
registers read alike. **`outputKey` is absent, and it is the one shape change.** Adding it to
`HABIT_FORK_REGISTRY` as an optional field would leave 43 simulation rows carrying an empty
optional forever and every generation row carrying the only field that matters to EM-A1 — a field
meaningful for one half of a register is a register that means two things. **This is a FOURTH
independent reason for the sibling**, on top of §P2-E1's three (both stated laws are
`src/domain`-scoped; the three idiom signatures match nothing in generation; the
`LEARN|STAY|DEFER|DEAD_CODE` axis is about adapting over time and a generation chooser never
adapts).

### (b) ⛔ `symbol` MUST RESOLVE AGAINST SOURCE, NOT EXPORTS — proved

```
$ git show d31af2cee:src/generators/npcGenerator.js | grep -n "pickFirst"
106:  const fullName = pickFirst(culture, gender, true, tier);
225:// ─── NPC name helpers (pickFirst, pickCulturalTitle, filterByGuild) ───
240:const pickFirst = (culture = 'germanic', gender = 'male', withSurname = true, tier = 'town') => {
```

`pickFirst` is declared `const pickFirst = (...)` and is **never exported** — it is module-local,
and it is a real chooser (the NPC name draw). A resolver keyed on exports would miss it and every
sibling like it, so the walker resolves `module#symbol` against the module's SOURCE — the same
thing `chooserTotality.walker.test.js`'s `enclosingSymbol(code, m.index)` already does for its own
idiom hits. The sibling copies that resolution, and A2 gains an arm that a module-local chooser
resolves.

⚠ Record paths such as `npcs[].role` and `powerStructure.seats[].holder` are ASSERTIONS ABOUT THE
RECORD, so the walker must check each one resolves on a generated settlement rather than trusting
the string — otherwise a typo makes a row that joins to nothing and EM-A1 silently loses a field.
A4 is re-cut to that check.
