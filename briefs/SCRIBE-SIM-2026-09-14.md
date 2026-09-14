# THE SCRIBE, SIMULATED — a Claude session seated as the model (2026-09-14 ~12:1x)

The owner: "you yourself can run as a simulation of it… take the place of the API key and test it."
So the harness gained `scribe-harness/simulate.mjs` (build → judge). `build` writes exactly what the
boundary would send — the cached brief (`brief.md`), the volatile turn (`turn.md`), the output schema
(`schema.json`) and the card — for one real generated town; a fresh-context agent is handed those
three files and nothing else and writes the JSON; `judge` parses it under `UnitSchema` (the grammar
test) and runs `refuteAll` (tier-0, the same bundle the product runs) + `refuteTab` (the page arms).
It measures everything the live path measures EXCEPT tokens-by-the-API, cache reads, dollars and
wall-clock.

## The run: Spitzplatz (town, germanic, river, road, seed `render-town`), tab `defense`, audience dm

- The prompt: brief 115,307 chars (cached) + turn 33,583 chars (volatile) ≈ 37 K tokens; 15 pools
  over DS-DEF-1/2/3/4/5/6/11.
- OPUS SEAT (fresh context, `claude-opus` via the Agent tool; 142 K tokens of reading + writing,
  234 s): **15 of 15 units, schema-valid, every pool matched, none unknown; page arms PASS.**
  Per unit: **PASS 3 · WITHHELD 7 · FAIL 5.** Under `scribeCore.ts`'s rule (FAIL → dropped, the
  corpus line ships; WITHHELD → ships) **10 of 15 AI lines would reach the page and 5 would fall
  back to the corpus.**
- The five FAILs: FOUR are `CORPUS-DIFF · a level-1 order lost on a spine` (the AI spine does not
  realise the corpus spine's closed move order); ONE is `C4 · a totality over an open column`
  ("Every household here can name the corners") — a true catch, the same class the corpus's own
  inherited C4 reds are.
- The seven WITHHELDs: six `Q · a second sentence naming no second field`, one `ORDER · a move
  sequence outside the closed set`. All ship.
- TRUTH, read by the chair against the card: every named source and body is on the card (a clerk
  of the court, the ostler, an innkeeper, a master of one of the crafts, the alchemist's shop, a
  priest, the cells of a prison, the gate); no digit; no invented history; "no port" is engine-true
  (the pool is the road-supply variant). ONE line a same-model checklist should have queried:
  "the money for it would come out of the trades" against the engine's own assess line "Tax revenue
  funds emergency measures" — not a contradiction, but an interpretation the card does not hold.

## What the simulation found (for W3, in order of weight)

1. **THE CORPUS-DIFF ORDER ARM IS THE SCRIBE'S BIGGEST DROP AND IT IS NOT A TRUTH RULE.** Four of
   five fallbacks are for losing the spine's LEVEL1 order id — a corpus-register property the model
   is NEVER TOLD (the card carries `unit.spine` but not its order). Two cures, the chair's call for
   W3: (a) put each spine's order id and its one-line definition on the card so the model can keep
   it; (b) demote the arm to WITHHELD for Scribe text, since the AI unit replaces the pool per town
   and the census's grammar is the corpus's, not the page's. Recommendation: (a) first, measured;
   (b) if (a) does not bring the drop under one in ten.
2. **THE CARD CONTRADICTS ITSELF AND THE MODEL NOTICED.** The posture badge prints `Well-Defended`
   (the LABEL ladder, `defenseGenerator.js:517`, ≥55) beside pool key `readiness ADEQUATE` (the
   BAND ladder, `defenseScoreBands.js`, ≥40 <65) for a score of 57; every threat row's funding note
   says `Upkeep underfunded … at 97–98%` beside `Economic Backing: Well-funded — Full pay`. R-2 makes
   the first lawful (two vocabularies), but a reader sees both on one page, and a model asked to
   write the truth has to pick. This is an ENGINE finding, older than the Scribe; the owner's.
3. **THE BRIEF LEAVES FOUR THINGS TO GUESS** (the Opus seat's own notes, all confirmed on the card):
   `stance` — every `pieces[].role` is `spine` while four DEF-2 pools carry sources and an attributed
   `rendered`, so spine-vs-face is undetermined; the DM REGISTER — audience is `dm` but the schema
   has no dm-only field and the brief never says whether to write the notebook register; SLOT FILL —
   `unit.spine` is templated, `rendered` is literal, and "declared slot" pushes against ruling 12's
   twelve-slot-openers tell; and TWO CORPUS UNITS ON THE CARD BREAK THE LAW THEY EXEMPLIFY
   (`WALLED-STRAINED` renders "The town walls around Spitzplatz **is** sound … **which** is the kind
   of arithmetic" — a number error plus a which-closer, a shipped defect in the `{defwork}` fill; and
   `walls PRESENT` renders a colon plus not-X-but-Y). Each is a one-line brief or card fix.
4. **THE Q ARM WITHHOLDS ALMOST EVERY TWO-SENTENCE UNIT.** Six of fifteen. It ships them, so nothing
   is lost, but the tier-1 checklist inherits a WITHHELD on nearly half the page and cannot tell a
   real second-field problem from the arm's blanket. Worth a look at whether the Scribe's card can
   license the second sentence (the card holds the fields the corpus's Q arm reads).
5. **THE PROSE IS GOOD.** Read cold, the page is the archiver's hand: "A master of one of the crafts
   reckons the town could pay its way through a long bad season, and that the money for it would
   come out of the trades." / "The town walls are kept sound out of a purse that comes up short.
   What the purse cannot cover is carried by the people who do the work." Concrete, sourced, plain,
   no tells. It is better than the shipped corpus row beside it in most of the fifteen cells, and it
   is written FOR this town (its walls, its unpaid muster, its alchemist's wards) in a way the
   corpus cannot be.

## What the simulation cannot tell us
Tokens by the API's own count, cache-hit rate, dollars, wall-clock, and whether `parse` with
`zodOutputFormat` behaves as written. Those are the key's.

## The Sonnet seat, same prompt (the cheaper-tier question)

- **15 of 15, schema-valid, page arms PASS; PASS 10 · WITHHELD 5 · FAIL 0 → all 15 ship.** 346 words
  against Opus's 427 (mean 23 vs 28.5 a unit). One page-level REPORT: the opener "At the tavern
  they say" twice.
- WHY IT OUT-SCORED OPUS ON THE INSTRUMENTS: it rewrote CLOSER TO THE CORPUS ROW. "Spitzplatz holds
  its own entry points. A perimeter buys not safety but the choice of where trouble happens" is the
  shipped line's own shape one step over, so the spine's order survives and CORPUS-DIFF is quiet.
  Opus wrote freer lines for the same pools and lost the order four times. So the arm is measuring
  DISTANCE FROM THE CORPUS, and on this arm the conservative writer wins — which is exactly why the
  order id belongs on the card rather than being a silent tax on the better rewrite.
- TRUTH, read by the chair: Sonnet also invents nothing the card refuses — but BOTH seats reached
  for a MECHANISM the card does not hold on `Internal Security: full legal chain`: Sonnet "a man
  who cannot pay his fine sits in the cell until somebody else does" (fines and a debtor's cell:
  the card has `court AND prison`, no fine, no debt); Opus "waits in a cell … until the court makes
  room for him" (a backlog: no field). The corpus row says "called in for who he knows and let out
  for what he can pay". Neither is a contradiction; both are the PLAUSIBLE-ADDITION class the
  tier-0 arms cannot see and the tier-1 checklist must. This is the finding the owner asked the
  pilot to measure, and the simulation produced it on the first town: **2 of 30 lines across the
  two seats add a mechanism the card does not name.**
- ON MODEL CHOICE: on this one tab the cheaper model was not worse under the instruments and its
  prose is clean, if flatter and nearer the corpus. That is one page; the per-tab model choice
  stays an open item to measure over the pilot's twenty towns, not a decision.

## RUN 2 — the unified prompt, the whole grid (workflow `wf_0c7e8fcf-e4a`, 13:1x–14:1x; 64 seats, 7.3 M tokens)
16 cells (hamlet Warmholz · village Hochhausen · town Spitzplatz · city Rundgate × defense · economics · overview · power) × {Opus, Sonnet} writers, an Opus second reader per pair, the product's one judge. Rows: `scribe-harness/out/sim/RUN-wf_0c7e8fcf-e4a.json`; per cell `response-/answers-/judged-/page-<seat>` files.

| | pools | returned | tier 0 kept | tier 1 dropped | FINAL shipped |
|---|---|---|---|---|---|
| Opus | 198 | 186 (94%) | 177 (95% of returned) | 126 | **51 (26%)** |
| Sonnet | 198 | 191 (96%) | 173 (91%) | 113 | **60 (30%)** |

By tab (both seats): defense 44/126 (35%) · overview 46/140 (33%) · economics 11/52 (21%) · power 10/78 (13%).
Second-reader `yes` LINES by question: certainty 177 · mechanism 205 · scope 106 · quantifier 76 · same page 63 · actor 26 · forecast 12.

**What it settles**
1. **RULING 27 IS MEASURED: THE ORDER ARM NEVER FIRED.** `CORPUS-DIFF` is absent from every arm list over 377 units. With the order on the card the arm is fair; it stays FAIL. Tier 0 as a whole is now a 5–9 % gate (ORDER, WALL-5, Q, C3, NON-MOVE, C2, X, EPOCH, C4, REFERENT).
2. **THE WRITER INVENTS, AND THE SECOND READER IS RIGHT.** The readers' notes name the classes, and each is a real addition the card does not hold: an ABSENCE asserted on a null read ("nothing here is being built and nothing sold off" on `prosperityRank = null`; "no goods come in" on all-null reads); an ORIGIN ("carts stopped on this spot before any stall did"); a named CONTEST between two bodies with `conflict.intensity` null and no relation row; a PRACTICE behind a boolean (`hasGranary`, `hasChurch`, `hasHospital=false` → "inn servants nurse the sick", "the court's business waits on the parish"); a VERDICT the card's own institutions cut against ("no through-traffic" beside a Caravaneer's post, a Carriers' guild, a Customs house). Actor and forecast drew almost nothing: the roster and the no-future bar hold. **The disease is gap-filling on thin cards** — worst on power (13 %) and economics (21 %), where the pools read few or null fields; best on defense (35 %).
3. **ONE WEAK FACE KILLS A WHOLE UNIT.** A seven-line unit died on face 1 with its spine and face 0 answered all-no. The unit-ships-whole rule turns one invented face into six lost lawful lines.
4. **THE JUDGE UNDER-REPORTS TIER 1:** it prints only the FIRST yes per unit (every drop shows as `T1-CERTAINTY`); the per-question counts are the honest picture. An instrument defect, not a finding about certainty.
5. **THE TWO LADDERS BIT THE SECOND READER TOO:** the writer wrote to the band (as told) and the reader, shown the page's `Well-Defended` badge and three STRONG rows, answered SAME PAGE yes. The ladders note lives in the writer's brief; the checklist did not carry it. (In the product the checklist rides under the same cached brief; in this run the simulated reader was not given the brief — a fidelity gap in the workflow, now fixed.)
6. **A CORPUS FINDING:** `WALLED-STRAINED` fires at `economicGates.military = 0.98` — a 2 % shortfall reads as "strained" beside "Well-funded — Full pay". The key's threshold is the corpus lane's question (the STRAINED key was already a proposal on a wage-less roster).
7. **MODEL CHOICE CANNOT BE DECIDED YET:** Sonnet 30 % vs Opus 26 % is noise inside a 70 % invention rate; the question re-opens when the writer stops inventing.

**Before the cure, the honest state of the product:** on a cold card the Scribe would ship one line in four and the corpus the rest — lawful, never false, but not the product. The cure is in the writer's brief and the unit rule, not in the readers.
