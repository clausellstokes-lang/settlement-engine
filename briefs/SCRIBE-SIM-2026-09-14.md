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

## RUN 3 — the corrected writer, the six-question reader, the honest card (workflow `wf_59ec807d-940`, 15:3x–16:4x; 64 seats, 8.9 M tokens)
Same 16 cells and seats as RUN 2; the dock at `fdc980f4c` (W3b cars 1–6); the reader handed the two cached blocks. Rows: `scribe-harness/out/sim/RUN-wf_59ec807d-940.json`.

| | pools | returned | tier 0 kept | tier 1 dropped | FINAL shipped | RUN 2 |
|---|---|---|---|---|---|---|
| Opus | 198 | 188 | 176 | 10 | **166 (84 %)** | 26 % |
| Sonnet | 198 | 188 | 173 | 18 | **155 (78 %)** | 30 % |

Per tab × seat (shipped): defense 89 / 79 · economics 88 / 85 · overview 84 / 76 · power 72 / 77 (Opus / Sonnet). Per tier (both): city 89 % · town 80 % · hamlet 79 % · village 77 %.
Second-reader contradictions, LINES over ~1,400: page 24 (Opus 5 · Sonnet 8 units; lines 24) · roster 8 · field 5 · record 2 · model 0 · forecast 0 — **28 lines, 2 %.** PATCHED units 6. Missing pools = exactly the world-only omissions the card ordered (`capture none/adversarial`, `layer DORMANT`, `governing faction holds …`).
WITHHELD (ships) is now the large column — Q 36 / 45 units, ORDER 36 / 35, C3 21 / 27, WALL-5 11 / 22, X 17 / 7: craft and structure arms, not truth. Q withholds because 70 % of the fields are unreadable by the card (W3c's cure); ORDER because the AI spine's move sequence is outside the eight closed orders (a craft arm; the corpus's own withholds are the same family).

**What RUN 3 settles**
1. **Under the owner's standard the Scribe is a product**: four pages in five ship as the Scribe's, one in fifty lines contradicts, and the corpus fills the rest. RUN 2's 70 % was the licence reading.
2. **The remaining contradictions are the card's, not the writer's.** 24 of 28 contradict a MACHINE LINE the writer never saw (W3a removed the page rows from the writer's turn; the tier-1 reader sees them and refuses): Warmholz "nothing here is urgent" beside `crisis.summary` "caravans are disappearing"; "no soldier in it" beside `guardEffectivenessDesc` "a mercenary company provides enforcement"; "nothing organised behind the wrongdoing" beside `Internal Security: Dangerous — Monster Threat`; "a break in the roads would not reach the table" beside the pool's own machine line "cut the roads, cut the supply". DECIDED: the page's machine lines go into the writer's turn (W3d).
3. **The roster refusals are mostly bodies the card names but the roster does not list**: "The Governing Council and The Order of the Watch", "the Commercial Circle and the Administrative Circle" come from the pool's own fills (faction and relation rows) and are absent from the town block's roster, so the reader's ROSTER test calls them unseated. The town block gains the named bodies of the page (factions, circles, councils, named relationships) — W3d. Two roster refusals are real: a "Cartographer's guild" where the row is a workshop; "the returns" / "the books wait" as records (the corpus's own DS-DEF-3 spine says "the season's returns" — the checklist should grant a record the corpus line itself names).
4. **Model choice, first evidence:** Opus leads on three tabs of four and on contradictions (10 vs 18 lines) and FAILs (22 vs 33); power is a coin-flip on 78 pools. Opus stays the writer; a per-tab Sonnet seat is not supported by this run. Re-open with live usage receipts.
5. **The card's own defects the reader flagged, for the ledgers:** a `STALLED trade` pool (DS-GEN-18) firing on all-null reads; `structure null (nothing organized)` firing on a town whose page says "organized violence"; `flagDriven count zero` on a town whose historicalCharacter names an occupation — three corpus/engine findings, not the Scribe's.

## RUN 4 — after W3d: the writer sees the page, the roster seats the bodies (workflow `wf_ce8d34f2-917`, 17:4x–18:4x; 64 seats, 8.9 M tokens)
Same grid and seats; dock `3def8f219`. Rows: `scribe-harness/out/sim/RUN-wf_ce8d34f2-917.json`.

| | returned | tier 0 kept | tier 1 dropped | FINAL shipped | RUN 3 | RUN 2 |
|---|---|---|---|---|---|---|
| Opus | 188 | 178 | 2 | **176 / 198 (89 %)** | 84 % | 26 % |
| Sonnet | 188 | 174 | 6 | **168 / 198 (85 %)** | 78 % | 30 % |

Contradiction LINES: Opus 2 (field 1 · page 1), Sonnet 8 (field 3 · page 3 · record 2) — **10 in ~1,400 (0.7 %)**; page 24 → 4, roster 8 → 0. Per tab (Opus/Sonnet, computed per cell): defense 86/86 · economics 96/92 · overview 94/89 · power 79/72. PATCHED units 5. The page in the writer's turn and `town.bodies` did exactly what RUN 3 said they would.
**What remains is tier 0's craft column, all shipping as WITHHELD:** ORDER (39/35 units — the AI spine's move sequence outside the eight closed orders), Q (22/41 — the second sentence's field unlicensed, 70 % of fields unreadable → W3c), C3 (24/27), X, WALL-5. Tier-0 FAILs: Opus 10, Sonnet 14 (NON-MOVE FEELING, C3 capacity on a state-only field, REFERENT). Power's 76 % is the world-only omissions plus the card's blindness on that desk.
**Two things the readers saw that are NOT the Scribe's:** (a) a copied corpus face ships raw (`{elders} {v:take} …`) — in the product the kernel's `fillSlots` renders or silences it; the HARNESS prints the raw row (a display item for `simulate.mjs`); (b) **a corpus face contradicts its own town**: DS-DEF-2 `Internal Security: full legal chain` face 5 "A soldier reckons a stranger stopped at the gate is the garrison's …" ships on a town with `forceBuckets.garrison = false` — a corpus finding for the banked lane's ledger (the face asserts a body the key does not guarantee; the same class the clarity audit hunted).
**Model:** Opus 89 vs Sonnet 85, 2 vs 8 contradictions, 10 vs 14 FAILs. Opus stays the writer.

## RUN 5 — after W3c: the card reads through the resolution (workflow `wf_00f13b26-496`, 19:3x–20:3x; 64 seats, 8.9 M tokens)
Same grid and seats; dock `f350d7ed5`. Rows: `scribe-harness/out/sim/RUN-wf_00f13b26-496.json`.

| | returned | tier 0 kept | tier 1 dropped | FINAL shipped | RUN 4 | RUN 3 | RUN 2 |
|---|---|---|---|---|---|---|---|
| Opus | 188 | 178 | 5 | **173 / 198 (87 %)** | 89 % | 84 % | 26 % |
| Sonnet | 188 | 172 | 6 | **166 / 198 (84 %)** | 85 % | 78 % | 30 % |

Contradiction LINES: Opus 6 (field 3 · page 3), Sonnet 6 (field 4 · page 2) — 12 in ~1,400; roster 0, model 0, record 0, forecast 0.
**Reading:** flat against RUN 4 within the writer's own draw-to-draw variance (the craft withholds swing ±20 between runs of one prompt: Q on Opus 36 → 22 → 41 across RUNS 3–5). W3c's gain is in TRUTH, not the headline: the writer and the second reader now see values (`military: 73`) where the card printed UNREADABLE, the `STALLED` caveat that was reporting the card's blindness has cleared, and the FIELD test can convict on 68 resolved paths. **The Scribe without a key is at its natural ceiling: 84–89 % of pools ship as the Scribe's, ~0.5–0.7 % of lines contradict, and what remains is the corpus's own craft column shipping as WITHHELD (ORDER · Q · C3) and the world-only omissions.** The next moves are the owner's five acts (the key first — the live pilot measures tokens, cache reads, dollars and wall-clock, which no simulation can) and W4/W5.
