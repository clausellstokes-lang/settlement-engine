# DEPTH-1: the measure and the proposal (first tranche of tie lines and hooks)

Written 2026-11-20 14:30 UTC (`date -u`) by DEPTH-1 on `lane/depth-1-2026-11-20`, cut from the working line `43ab0f5eb`.
Nothing here is built: no source file of the line is changed by this commit. Every figure is EXECUTED in this seat's container.

## 1. The chair's figures, re-run

The chair's `measures.mjs` and `bill.mjs` (origin/lane/chair-2026-11-08, `docs/chair/2026-11-20/seventh/measures/owner-q3/`) import
`./born.mjs`, which is NOT committed there. `measure/born.mjs` reconstructs it from `holistic/batch.mjs` (its birth and its masker;
a mulberry32 rng). With it, both outputs reproduce the chair's BYTE FOR BYTE apart from the timing lines (`diff`, executed):
city: ties 62.8%, own hook 46.5%, short wants 34.5%, long wants 35.4%, secrets 24.7%; metropolis 73.4%, 63.5%, 44.4%, 45.7%, 29.2%.
Section (D) is identical (wary_alliance 10 lines seen / 8.36 a city; peer_rivalry 16 / 9.30; old_debt 17 / 8.96; hook:other 66 / 26.00).

## 2. How a line is chosen (by symbol)

**A tie.** `src/generators/power/relationshipArchetypes.js :: createTieProseDraw`, one draw per town (`people/ties.js :: drawTies`).
The first tie of an archetype opens at `fnv1a32("<from>><to>::<key>") % size`; each further tie of that archetype in the town takes
the next index; past `size` it cycles over the lines naming both cards (`bothNamedTensions`). ZERO rng. `size` is
`archetype.tension.size` (the TENSION pool's length), and ONE index picks `desc[i % desc.length]` AND `tension[i % tension.length]`
(`src/data/npcData.js :: pairProse`); it is stored as `relationships[].proseVariant` (plus `REVERSED_TIE` = 65536 for a pair's
second tie written in the first's order). Every archetype the bill names holds 8 desc and 8 tension rows. CONSEQUENCES:
(a) a description appended ALONE is never reached (the cycle is 8 long); a new tie line is a PAIR, a description AND its tension,
appended at the same index; the house writes the pair as one beat (TAIL-TIES T2: "one state for the pair"). (b) The pool's
"distinct lines seen" (10, 16, 17) exceeds 8 because of twins (`sharedTrade`, `votes`, `sharedPlace`): a twin is the SAME index.
(c) `people/ties.js :: temperOfTie` reads the printed row's `trust`, and a pair's SECOND tie takes the first tie's temper
(`inTemperOf`): a new town whose first tie now prints another row can draw another archetype and strength for its second tie.

**A hook.** `src/generators/people/representatives.js :: drawCardHooks` (one per card, on the card's fork) ->
`npcGenerator.js :: drawPersonHook` -> `generatePlotHook` -> `drawLoyalty` -> `hookVariety.js :: drawUnique`: ONE roll, uniform over
the pool's rows the town has not printed, preferring rows whose THEME the town has not spoken (`domain/hookThemes.js ::
themeOfText`, an exact-text table `AUTHORED_HOOK_THEMES` with a totality walker). The pool is `NPC_FACTION_LOYALTY[hookPool]`,
`hookPool` from `people/poolMap.js :: hookPoolFor`: by the face's title, else its family's shelf, else **the generic row: `other`.
"The catch-all group" is `NPC_FACTION_LOYALTY.other`** (40 rows; 66 masked lines because rows carry the town's names), the pool of
every face whose title and shelf key no hook pool of their own (26 cards a city town). Then `people/personHooks.js ::
truePersonHooks` redraws, draw-free, a hook the record contradicts.

## 3. Where a new line must stand: IN THE DRAW, and what that moves

Both draws take an appended row from the FIRST card of a new town (the tie's offset is uniform over the new `size`; the hook's roll is
uniform over the unprinted rows). Measured: a probe with placeholder lines (`measure/probe3.patch`, a local detached commit, never
pushed) prints 701 placeholder ties and 356 placeholder hooks of 1,195 in 20 city towns. **A new hook MUST be tagged with a theme in
`AUTHORED_HOOK_THEMES`** (the walker demands it, and it is load-bearing: untagged placeholders passed the theme preference every
time and became the new head, 19 of 30 printed a city town, and the repeats FELL ONLY TO 41.9%; tagged with their pool's own
themes, 31.5%). So a hook unit touches two files: `src/data/npcData.js` (the pool) and `src/domain/hookThemes.js` (its tag).

**A saved town re-renders exactly:** the line's census 720 births re-rendered at each stored `proseVariant` by the line's code and by
the probe's: 20,014 ties, 20,014 identical, 0 without a stored variant (`measure/rerender.mjs`). A hook is stored as text and never
re-drawn. (A tie with NO stored variant would re-hash over the longer pool: 0 such in the corpus; a pre-GS-1 save would move.)

**What moves in a NEW town** (the shared two-tree tool, `trees.mjs 43ab0f5eb <probe> --words=none`): see §5.

## 5. What moves in a new town (EXECUTED: `trees.mjs 43ab0f5eb 284880c7e`, golden 525 + census 720; `measure/nonstring.mjs`)

THE ONE STORED NUMBER THAT MOVES: `relationships[].proseVariant` (golden 11,052 ties in 523 documents; census 15,544 in 606):
every tie of a lengthened archetype re-opens at `fnv % size` with the new size. No other number, boolean, key, order or array
length moves, except `generationCoherenceReceipt.judgments[record_coherence_battery].findings` in 35 golden documents (±1: the
same "role-only person" finding counted once more or less, read from the changed prose; no new kind of finding, none lost).
THE STRINGS THAT MOVE: `npcs[].plotHooks[]` (11,498 / 16,677), `relationships[].description` and `.tension` (every tie above),
`prominentRelationship.*` (416 / 274: it quotes a tie), `pressureSentence` (2 / 90: it quotes a tie's tension), the receipt's
`findings[].evidence/path/detail` (golden 106 documents), and three the brief did not foresee:
- `relationships[].archetypeKey/type/typeName/strength` of a pair's SECOND tie (1 golden, 3 census): `ties.js :: temperOfTie` reads
  the first tie's printed row's `trust`, and `inTemperOf` then turns the second tie (§2 (c));
- `npcs[].secret.what/stakes` (71 golden cards, 9 census): `src/generators/people/rareSecrets.js :: dealRareSecrets`, after the
  hooks, ties and goals: `holderAdmits` (`notHookWords`) reads the card's hook text against `SPOUSE_WORDS`/`KIN_WORDS`, and
  `namedFor` (`ownLinesOf`: goals and hook) drops a person the card's own lines name; the admitted list's length changes, and the
  row is `fnv1a32(<seed>::rare-secrets::<family>::<id>::row) % standing.length`. Draw-free (read by a helper; the observed rows,
  ghost, firstWord, parentOf, are `src/data/rareSecrets.js :: RARE_TIES`'s);
- `npcs[].goal.long` (1 / 1).
Saved towns: nothing moves (§3). Any change of a hook's or tie's text moves these the same way; it is no cost of THIS tranche alone.

## 6. What the chair rules

1. **A tie line is a PAIR** (§2 (a)): the tranche is 80 descriptions AND 80 tensions in `npcData.js :: STRESS_ECONOMIC_EFFECTS`, each
   tension written as its description's beat. The brief lists "tensions" as not mine; I read that as the town's tensions
   (`history.currentTensions`), not a tie's own tension line. Rule which.
2. **A hook is two files**: the pool row (`npcData.js :: NPC_FACTION_LOYALTY`) and its theme tag (`domain/hookThemes.js ::
   AUTHORED_HOOK_THEMES`); each new hook takes one of the 18 themes its group already speaks, in about the group's proportion.
3. **The tranche lands short of 30% at city**: ties 37.2%, hooks 31.5%. The chair's bill (+157 / +96) stands as the second tranche.
4. **Order**: hooks first (their pools are free now); ties after the goals seat lands, on the commit the chair names.
5. **The golden**: every tie's `proseVariant` and the pressure sentence move in new towns: one cause per signed shift, so hooks and
   ties are two shifts, never one.

## 4. The first tranche: placement and its measured gain

| pool | group | rows now | add | rows after |
|---|---|---|---|---|
| tie (desc + tension pairs) | wary_alliance · peer_rivalry · old_debt · mutual_leverage | 8 each | 14 each | 22 |
| | mentor_legacy · genuine_respect | 8 each | 12 each | 20 |
| hook | `other` (the catch-all) | 40 | 30 | 70 |
| | economy | 24 | 14 | 38 |
| | criminal · government | 18 · 24 | 8 each | 26 · 32 |

80 tie indices (= 80 descriptions + 80 tensions) and 60 hooks. MEASURED by the chair's own `measures.mjs` on the probe's births
(placeholders, colour, no declarations; hooks tagged with their pool's themes in its own proportion):

| size | ties now -> after | hooks now -> after |
|---|---|---|
| town | 35.4% -> 16.5% | 25.3% -> 17.1% |
| city | 62.8% -> 37.2% | 46.5% -> 31.5% |
| metropolis | 73.4% -> 48.9% | 63.5% -> 42.5% |

PLAUSIBLE, not CONFIRMED, for real lines: a real line with a `needs` refuses some towns, so the real gain is at most this.
