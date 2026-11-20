# BAR8-DESKS-ECO · hand-back (2026-11-17)

Seat DESKS-ECO of the round BAR8 (`docs/chair/2026-11-17/sixth/briefs/BRIEF-BAR8.md` on the chair's lane, section
DESKS-ECO). Base: `lane/join-2026-11-14` at f1ca75555. Branch: `lane/bar8-desks-eco-2026-11-17`.

**⚠ FIRST: MY COMMITS WERE REFUSED BY MY OWN PERMISSION CHECK.** The first `git commit` on my branch was denied by the
session's auto-mode classifier ("Destructive or Unwanted Actions": CLAUDE.md forbids committing without explicit
authority, and the seat's prompt reached me as a system notification, which the check does not read as the owner's
word). Per the prompt ("a refusal by your own permission check stands: tell the chair, do not route round it") I did not
retry. Everything below is in the seat's working tree, uncommitted, with a patch copy in the session's scratchpad; it
lands when the owner (or the chair, with the owner's word in this session) grants the commit and the push.

## 1 · The rules, before and after (towns · instances; my base's render, measured by `runK.mjs` and `runJ.mjs`)

My base's own render reads exactly the auditors' figures on the 720 (every row of `RUN-K.720.txt` and `RUN-J.720.txt`).

| rule | the thirty | the 150 | the 720 | cure |
|---|---|---|---|---|
| 12d.enough (K) | 1 · 2 → **0** | 5 · 10 → **0** | 16 · 32 → **1 · 2** | POOR v1 declares `food: ≥ secure`; v5 its twin (below) |
| 12d.enough.wide (K, not mine) | 0 → 0 | 5 · 10 → 4 · 8 | 21 · 42 → 21 · 42 | unchanged class; nothing struck that was true |
| 11c.needed (J) | 1 → **0** | 3 → **0** | 8 → **0** | CRITICAL IMPORT v2 declares the new atom `critical import brought in`; v4 its twin |
| 11c.venture (J) | 1 → **0** | 0 → 0 | 0 → 0 | the same atom (the venture's material is on no arriving import) |
| 11c.idle (J) | 0 → 0 | 1 → **0** | 1 → **0** | the same atom |
| 15e.newBuild (K) | 1 → 1 | 0 → **1** | 2 → 2 | **LEFT** (section 4): no atom answers either premise; the 150's one is a moved draw (below) |
| the fishmonger (J, LOW) | 0 | 0 | 6 → 6 | **LEFT** (section 4) |
| the brewer's tavern secret | 0 | 0 | 2 towns → **0** | `institution: tavern` |
| DS-GEN-3 Import-Dependent (MED-2) | — | — | — | declared; v4 retired; v7 twin (prints in none of the populations) |

The 720's remaining 12d.enough is r2r-hamlet-21: food Secure, "Needed, and not brought in: stone, salt." The food band
answers 15 of the 16 towns; the salt half is the need list's (section 4, item 1).

THE CONTROLS. K's C39124 (12d, bar0-town-occupied-rand-46) and J's C34102 (11c.venture, bar0-town-calm-rand-46) are
CLEAR at the tip, so both runners exit 3 over the thirty BY DESIGN. Every other control of both runners reads as at the
base (the controls tables diffed line by line: only those two rows differ). NO RULE OF ANOTHER SEAT ROSE: every rule row
of both runners at the base equals the tip's over the thirty, the 150 and the 720, except the rows above.

WHY THE FOOD BAND AND NOT THE NEW ATOM FOR 12d (BR14 (c), "measure both and say which you took"). The need list is read
off `resourceAnalysis.imports` (a layer-3 stratum), so any atom that reads it is a layer-4 fact, and DS-ECO-8::POOR sits
at layer 3 in `tests/lint/factLayers.poolTable.json`: declaring it there reds the walker's POOLS arm, and the table is not
my file. The food band (`food`, layer 2) answers 15 of the 16 towns of the 720 (and all 5 of the 150, the one of the
thirty). I took the band.

## 2 · The guard and the tests

- NEW: `tests/domain/bar8DesksEco.test.js` (7 tests). Fails at the base (its leaf does not exist there: the file cannot
  load), passes at the tip. Arms: the desk lines and twins over a constructed record (12d at pressured, importDependent
  and deficit; 11c; Import-Dependent v1, v2, v6 against v7), each with its positive anchor; no Import-Dependent line that
  says the food comes in is admitted under a siege or where nothing is brought in, and v4's number is unused; the atom
  over born towns of the thirty that printed the line false (bar0-city-wartime-rand-47's copper ore, bar0-town-calm-rand-46's
  failed venture's clay) beside one that bears it (bar0-metropolis-calm-rand-45's iron ore); THE SECOND HOME HELD EQUAL (the
  leaf's good is the desk's `criticalImportRow` good, and "brought in" is the need list's matching of the arriving imports,
  on 16 born towns; measured equal on all 900 towns of the three populations: 0 differences of 415 rows on the 720); the
  shared page (N4: the record, `toPublicSafe` and the share veil read the atom alike); the brewer's secret (constructed,
  and the two census brewers with no tavern-kind house beside one beside a tavern).
- RE-KEYED BY IDENTITY (R8, each with a dated note): `tests/domain/leftLines.test.js` the L8 Import-Dependent row (v4 is
  retired: the row now holds v6 against its twin v7, the positive anchor the key's band with food brought in, a state a
  birth produces); its shared-page arm takes the constructed states of the economy's and the general desk's rows (LOW-2:
  a NEW `it` beside the old, which is kept); `tests/domain/generalStateProseDesk.test.js` the food trap's Import-Dependent
  record carries the food record a born town carries, and a village record beside the town record (LOW-3).

## 3 · The new and the changed lines (for the owner's veto list), and where each prints

Measured by a diff of every dump at the base against the tip (30 · 150 · 720 towns changed: 4 · 22 · 55).

| line | prints in (30 · 150 · 720) | three towns |
|---|---|---|
| NEW TWIN, DS-ECO-12 CRITICAL IMPORT v4 `[visitor · no crisis: under_siege · no critical import brought in]` "Some of {settlement}'s work needs {good} that the country around it does not give, and none of it is brought in." (BR17 (3), given) | 2 · 8 · 24 | bar0-city-wartime-rand-47 (copper ore), bar0-village-calm-rand-47 (livestock), r2r-city-0 |
| NEW TWIN, DS-ECO-8 POOR v5 `[ledger · crisis: any · food: ≤ pressured]` "{settlement} pays for what it must and nothing beyond, and it does not raise all the food it eats." (**NOT GIVEN BY NAME**: written under R7, below) | 0 · 4 · 14 | bar0-city-wartime-rand-31, bar0-hamlet-calm-rand-31, r2r-hamlet-42 |
| NEW TWIN, DS-GEN-3 Import-Dependent v7 `[ledger · crisis: any · food: = deficit]` "{settlement} does not grow enough to eat, and nothing comes in to make up the rest." (**NOT GIVEN BY NAME**: the guard row's form and R7, below) | none of the populations (admitted in r2s-wartime-thorp-3 and bar0-hamlet-under_siege-rand-34; the food row draws elsewhere there) | — |
| RETIRED, DS-GEN-3 Import-Dependent v4 "eats well, but on food grown elsewhere" (dead by construction: no town moves) | — | — |
| DECLARED (no text change): POOR v1 `food: ≥ secure`; CRITICAL v2 `critical import brought in`; Import-Dependent v1, v2 `no crisis: under_siege · food: = importDependent`, v3, v5 `food: = importDependent`, v6 `food: ≤ pressured` → `food: = importDependent`; the brewer's secret `institution: tavern` | | |

TOWNS WHERE A DRAW MOVED AND NEITHER LINE WAS FALSE (the hash draw keys on vid, so a twin admitted where its original is
refused moves the towns where the twin out-hashes the other admitted lines):
- POOR "Money is short …" (v4) → the twin v5: bar0-thorp-calm-rand-35, bar0-town-occupied-rand-41 (the 150); r2r-thorp-34,
  r2r-thorp-4, r2s-occupied-metropolis-2 (the 720). "… nothing new goes up" (v3) → v5: bar0-city-wartime-rand-31,
  r2s-plague_onset-village-1.
- CRITICAL "… so the town buys from outside or that work stops" (v1) → the twin v4: r2r-town-42, r2s-infiltrated-town-1,
  r2s-mass_migration-town-0.
- Where v1 or v2 was false and refused, the pool's other admitted lines took the draw: POOR v1 → v3 in 6 towns of the 150
  (bar0-city-wartime-rand-38 among them: see 15e) and 5 of the 720; → v4 in 2 and 4. CRITICAL v2 → v1 in bar0-town-calm-rand-46
  ("… so the town buys from outside or that work stops": true there, the potter is failing) and bar0-village-calm-rand-32.
- The brewer's secret: r2r-village-16 and r2s-insurgency-village-0 now hold "Buys up grain that was meant for bread …".

NEW VOCABULARY (the owner's veto list): ONE atom, `critical import brought in` (BR17 (3)), beneath `imports` in
`factVocabulary.js`; its reader the import-free leaf `src/domain/facts/criticalImportBroughtIn.js` (it imports only
`canonicalAccessors.js`, already eager); its getter in `factsOf.js` (import at the end, no line above moves) and its home
row in `factLayers.js` (layer 4: `resourceAnalysis`, `economicState`). The leaf is a SECOND HOME of the page's reading (the
desk's row and the need list's matching cannot be imported: both read `factsOf`, and the trade list reads modules pinned
lazy), so it copies the desk's two fill tests and the need list's family table, and the guard holds it equal.

THE POOLS (R7). Measured by admission over every town of the three populations where each pool is keyed (POOR 216 towns of
the 720, CRITICAL 415, Import-Dependent 15): POOR and CRITICAL keep, in every town, the count they held at the base. ONE
town falls under three: r2s-wartime-thorp-3 (Import-Dependent, nothing brought in: [v1, v2, v6] → [v7]); its three base
lines were all false there. Two siege towns of the 720 go from two lines to none (each was "comes up the road" or "buys the
rest" under a siege; v7 needs nothing brought in, and their food is brought in in ordinary times).

WHY TWO TWINS NOT GIVEN BY NAME. R7 binds the desks ("no pool under three lines in any town of your populations where it held
three at your base"), and POOR's v1 declared alone leaves the pool at two in every food-short POOR town (17 of the 720, at
three at the base); the leftLines row of L8 (item 6) keeps its form only with a line admitted where nothing is brought in.
The owner's rule admits "a twin that says what is true where a line was false" as the fixing itself. Each is listed above
for the veto: striking v5 leaves POOR at two in those towns; striking v7 leaves the Import-Dependent pool empty there and
the leftLines row must change its form.

## 4 · Left by name

1. **12d's need-list half (1 town of the 720, r2r-hamlet-21: salt).** A food-secure POOR town whose need list names salt,
   fuel or livestock still prints v1. Its fact is layer 4 and DS-ECO-8::POOR is placed at layer 3 in
   `tests/lint/factLayers.poolTable.json` (not my file): a seat holding the table places POOR at 5, then a declaration on an
   atom of the need list (BR14 (c)'s named atom) cures it.
2. **15e (2 towns of the 720, 1 of the thirty, 1 of the 150).** Neither premise is answerable with an existing atom. The
   brickmaker's presentation is settled at BIRTH (`people/representatives.js :: titleTown` hands `birthFactsOf`: the roster,
   the config, the tier), before the town's prosperity is reckoned; POOR v3's premise ("nothing new goes up") has no atom,
   and the nearest, `trade at work: clay kilns`, is UNANSWERED where no kiln house stands (fail-closed: as an exclusion it
   would strike v3 in 29 of the 44 POOR towns of the thirty and the 150) and true for a potter (7 of the 15 kiln towns are
   potter-only). The cure wants a key of `trade at work` for a brickworks (new vocabulary, not given). The 150's one
   (bar0-city-wartime-rand-38) is NEW at the tip: the food-short town's POOR draw moved from v1 (false) to v3.
3. **The fishmonger's "Talks about the boats, the catch …" (6 towns of the 720, LOW).** No existing atom answers "the town's
   own boats fish": in the 6 bought-in towns the food record still lists fish (`fish`), the fish trade is at work (`trade at
   work: fish`) and the water is navigable; and the line is settled at birth, where the supply story is not yet read. SCENES's
   key `taken here` is not at my base. BR17 (3)'s twin has no slot: `poolMap.js :: settleTitleLines` takes the title's next
   admitted row of three, and a fourth row moves every master fishmonger's draw (`npcGenerator.js` draws
   `pickFromArray(titled.presentations)`); the twin slot is `poolMap.js`'s (not my file).
4. **DS-GEN-3 Import-Dependent under a siege with food brought in in ordinary times** prints no line (2 towns of the 720);
   a siege twin ("Whatever {settlement} used to buy for its table, none of it has come by road since the siege began.", DS-ECO-2's
   own words) would be a new line here, not given.

## 5 · Declared moves, books, doors

- DECLARED MOVE: the brewer's secret, `npcs[].secret` (read at birth): 0 of the 525 reference configurations
  (`tests/helpers/goldenMasterCorpus.js`, born at the base and at the tip: the whole-record hash, the cards' secrets and
  presentations, and the rest of the record each equal in all 525); in the populations it moves the two census brewers above.
  The desk lines are read at print: no stored field moves.
- THE TWO DOORS (R9): presumption classes `hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938` at the base and at
  the tip; presumed things `fresh 38 · stale 72 · first-register stale 7 · banked 4688 …` at both, the fresh lists identical.
  No `--shrink`, no `--bank`.
- BOOKS FOR THE CLOSE (R10, AX1): the wiring census and `proseNorms.generated.js` were re-taken in scratch to let the
  generator run and are NOT committed. The variant count stands 3033 → 3035 (the two new twins and the 11c twin, less v4):
  the pins that count variants (`dossierStateProseProjection.contract`, `proseComposed`, `proseWiringCensus`, the annex rows of
  `proseEntryContradiction`'s loaders, the byte ratchet) are the close's.
- THE ANNEX LINE ANCHORS of `tests/lint/proseEntryContradiction.walker.test.js`, re-addressed by their text with a dated
  note: 2428 → 2430 and 6181 → 6183 (two lines now above both: POOR v5, CRITICAL IMPORT v4). THE SECOND DESK SEAT TO LAND
  RE-ADDRESSES THEM ONCE MORE on a scratch merge of the first's tip.

## 6 · The net (R11, N2, N5), each gate alone through `sh scripts/gate-tail.sh`, at the base first

| gate | base (f1ca75555) | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | 0 | 0 |
| `npm run typecheck:ratchet` | 0 (167, ceiling 167) | 0 (167, ceiling 167) |
| `npx eslint` on the changed sources and tests | — | 0 |
| `npx vitest run tests/architecture` | 347 passed | 347 passed |
| ONE `npm run build`, then `tests/build/vendorPdfLazy.test.js tests/build/bootSmoke.test.js` | 0 · 0 | 0 · 0 |
| the guard `tests/domain/bar8DesksEco.test.js` | FAILS (its leaf is absent: the file cannot load) | 7 passed |
| the tests I re-keyed (`leftLines`, `generalStateProseDesk`) | pass | pass |
| the rounds before (`bar5*`, `bar6*` in tests/domain and tests/generators) | 1 failed: `bar6MarksLaw8` (a) THE ZERO over the 720, 17 instances | the same test, the same message |
| ALL of `tests/lint`, by name (`failnames.mjs`, `comm`) | 70 names red | the SAME 70 names (none new, none gone) |

Of the same-named reds, the files my cure touches were read message by message: `factLayers.walker` prints the base's own
messages at the tip (the new leaf and atom add no row to any arm); `proseEntryContradiction`'s loaders read the annex rows
2794 → 2796 and homes 3501 → 3503 and the QUALIFY arm's trailing coordinates 377 → 376 (each a figure of the close; red at
the base already). `node scripts/generate-dossier-state-prose.mjs --check` is red at the base and at the tip with the same
message (the wiring census stale against its stamped files: AX1, the close's).

N5 · A SCRATCH MERGE: the line's tip `lane/join-2026-11-14` at 3b06c724b (POINT 39) touches none of my files (each file
three-way merged clean in a scratch worktree, no index, no commit); there my guard, `leftLines`, `generalStateProseDesk`
pass, and `proseEntryContradiction` reds only its four base reds. Clean.

N3 · nothing under `src/generators/` is touched. N4 · the new atom reads alike on the record, `toPublicSafe` and the share
veil (the guard, 16 born towns); the desk lines read only facts the public record keeps (`food`, the imports, the resource
analysis), and the guard's leftLines arm takes the constructed states over all three forms.

THE MEASUREMENTS. Every render by PAGE-COPY's `census3.sh --count-only` at the base's tree and at the tip's, outside every
tree. One worker of the base's 720 was killed by the kernel for memory (a gate I ran beside it); its 79 seeds were rendered
again by the same configuration into the same dump folder (720 of 720, and the base's counts equal the auditors' to the
row). The tip's 150 and 720 were rendered before the 12d twin's last rewording ("covers what it must and nothing beyond,
except its food: the {tier} does not raise all it eats." → the words above, after its first form read as a 12d instance
where livestock was also needed); the draw keys on the vid, so the 36 printed instances were rewritten to the final words by
one substitution, and the runners and the diff read those dumps. The scratchpad holds every dump, JSON and table.
