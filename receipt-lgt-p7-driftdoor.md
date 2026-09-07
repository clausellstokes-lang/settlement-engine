# RECEIPT — LGT-P7-DRIFTDOOR (L-HOMES CAR 7) — ⚠ PARTIAL → **CLOSED AS A MEASURED STOP, ZERO BYTES**

**Lane** L-HOMES-7 / `LGT-P7-DRIFTDOOR` · **Seat** Opus 5 — Fable-unvalidated · **Chair** Fable 5.1
**Dock** `$SC/laneLH7`, detached at `38474a59eba460f30d6596dcb65efda3a446738a`.
**Arrival verified:** HEAD == `38474a59e` ✅ · `git status --porcelain` = **0 lines** ✅ · `node_modules` = **453 symlinks +
`.bin` symlink into the owner tree** (NOT materialised — the false-red hazard) ✅.
**Exit state:** HEAD `38474a59eba460f30d6596dcb65efda3a446738a` (**UNCHANGED**) · porcelain **0 lines** (re-verified after
the plant was reversed). **No commit. No file added to the dock. No register act. No ref written.**
Scratch lives OUTSIDE the measured tree at `$SC/laneLH7-scratch/` and `$SC/lh7-*.log`.

---

## 0 · THE HEADLINE

**The car as briefed is REFUSED, and the ground is not scheduling — it is that the brief's stated charter does not
exist.** The brief's own words: *"ENCOUNTERS landed (§893.2) CONSUMING the flag without minting — so this car OWNS the
door."* **Measured: ENCOUNTERS did the exact opposite.** Commit `dc42a22c8` (an ancestor of my base, verified with
`git merge-base --is-ancestor`) says in terms: *"THE RESERVATION IS UNCLAIMED. STEP 2's roster is EMPTY. No door
exception was added."* And `RULINGS-893.md` §2 — the fresh charter the PLAN cites as chartering this car — says the
opposite of what the PLAN read into it, verbatim:

> "The narrow act (one named export, one reason, **no flag home minted**) leaves TE-VIRT-1's actual reservation — **the
> `characterDriftEnabled` manifest home — untouched and still reserved**, so the ruling takes exactly the piece ENC-3
> needs and nothing else."

⭐ **THE SCHEDULE-FREEING FINDING: THE DOOR IS A DOOR ONTO AN EMPTY ROOM, AND THE TREE SAYS SO IN ITS OWN WORDS.**
No production path in `src/` reaches `writeAxisDrift`, `foldLivedExperience`, or the W-LIVES read model — measured, not
assumed (§4). `src/domain/npc/characterReadModel.js:210`, verbatim: *"Today no caller runs foldLivedExperience, so the
vocabulary would guard nothing."* **Minting the door dark costs the wave a landed-seam respell, a certification row,
four censuses and a fence, and delivers ZERO product.** L-DEFAULT gains nothing by lighting it either.
⇒ **`LGT-P7-DRIFTDOOR` does not gate any other car of this wave**, and the consist may board without it.

---

## 1 · PREMISE RE-DERIVATION — EVERY LOAD-BEARING FIGURE THE BRIEF STATED

| # | brief's premise | measured at `38474a59e` | verdict |
|---|---|---|---|
| 1 | "3 src files name the flag (`characterDrift.js`, `envoyChanceMeet…`, a subsystem row)" | exactly 3 under `src/`: `npc/characterDrift.js`, `worldPulse/envoyChanceMeetingStage.js:61`, `certification/subsystemRowsLives.js`. **A FOURTH namer outside `src/` the brief does not carry: `scripts/review/readerCorpus.mjs:113`** — the owner's own walk corpus (§5) | ✅ **HOLDS**, and widens |
| 2 | "NO manifest entry, no caller" | `ENGINE_GATED_VIRTUAL_RULE_KEYS` = **30 members**, `characterDriftEnabled` absent (plant proved the count: received 31 vs expected 30 rows). No production caller of any gated writer | ✅ **HOLDS** |
| 3 | "ENCOUNTERS landed (§893.2) CONSUMING the flag without minting — so this car OWNS the door" | ⛔ **REFUTED.** `dc42a22c8` REMOVED the funnel call and left the reservation unclaimed. What ENCOUNTERS consumes is `positionValue` + `driftTaughtWithin` from `characterConsumers.js` — **not the flag**, and `RULINGS-893` §2(c) chartered exactly that one export and nothing more | ⛔ **REFUTED — the car's whole charter** |
| 4 | (PLAN §1.1) "⚠ DECAYED → chartered. `RULINGS-893` §2 charters it in three parts" | ⛔ **MISREAD.** §2's three parts are (a) ENCOUNTERS does **NOT** take the door, (b) ENCOUNTERS mints its own family leaf, (c) `positionValue` becomes a named export. **None charters the door**; (a) restates §890.1 and the ground paragraph reserves the manifest home in terms | ⛔ **THE BRIEF ERROR, traced to one sentence** |
| 5 | (brief) "If the landed test still reserves the funnel door, that is a STOP with the file:line" | ✅ **IT DOES — two doors, three landed arms, all CONFIRMED live by plant (§3)** | ⛔ **STOP CONDITION MET** |
| 6 | (sealed docket, `LIGHTING.json:LGT-P7-DRIFTDOOR`) | `"klass": "owner-gated"` — the ONLY owner-gated car in L-HOMES — and *"Treat the inventory's O-9 recommendation as **superseded**."* | ⛔ the docket itself classes this car owner-gated |
| 7 | (`dc42a22c8` body) "The funnel is absent from this tree" | ⚠ **FALSE and immaterial.** `src/domain/npc/livedExperienceFunnel.js` (45,484 B) landed at `e25df69f2` and was PRESENT at `dc42a22c8` (`git cat-file -e` — confirmed). The ruling's CONCLUSION survives on the true ground: the flag has no home, so `foldLivedExperience` returns dark at `:556` | ⚠ recorded, does not move the ruling |

---

## 2 · THE RESERVATION CHAIN, IN ITS OWN WORDS — WHY A LANE MAY NOT TAKE THIS

1. **`src/domain/certification/subsystemRowsLives.js:39–41`** (the reserving lane's own leaf): *"The manifest entry, the
   row and the first by-name gate read are ONE COMMIT by standing law (ODQ §49 ruling 3, CR-WR10-C item 4), and that
   commit is **the door car's**. What this lane owes and pays is the HOME."* ⇒ the ACT is the door car's…
2. **…but WHO may authorise the door car is the reserved question.** Ledger commit `03a51c95e` (§890.1), verbatim:
   *"TE-VIRT-1 already ran and DELIBERATELY left the rows empty, so **homing the flag is a NEW decision** rather than a
   pending one, and it is **the owner's or a fresh charter's, not the chair's.**"*
3. **The fresh charter was taken on 2026-09-04 and deliberately EXCLUDED this** (`RULINGS-893.md` §2, quoted in §0).
4. **The chair itself flagged the reading as the thing to test** — §893 R4: *"§890.1 … said the decision belonged to 'the
   owner, or a fresh charter'; the chair has taken it as the fresh charter. **That reading is the thing to test.**"*
5. **The live handoff still carries it on the owner's desk**: `docs/HANDOFF_CURRENT.md:194` and `:233`.

⇒ A lane that minted the home tonight would silently overturn a one-day-old, recorded, vetoable chair ruling **on a
premise that measurement refutes**, and would do it inside the one row the docket classes `owner-gated`. That is the
§890.1 fault shape exactly — *"VERIFY THE ANTECEDENT, NOT ONLY THE INFERENCE"* — and it is why this lane brings the
contradiction back instead of building through it.

---

## 3 · THE PLANT — the reservation arms are LIVE, and the mint's real cost is CONFIRMED, not argued

**Method.** Backup taken BEFORE the plant to a path outside the measured tree
(`$SC/laneLH7-scratch/BACKUP-simulationRules.js`, sha256 `57e518baf09333bbce6eb9b65c7ab8dce2005838b7db252ebc241f66a5b14176`),
one line planted (`'characterDriftEnabled',` in alphabetical position), instruments run, **restored by INVERSE EDIT**,
`cmp` against the backup → **IDENTICAL**, porcelain 0, then a **green re-run** as the second receipt.

| step | command | exit | result |
|---|---|---|---|
| BASE | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/npc/characterDrift.test.js tests/lint/engineGatedRuleKeys.walker.test.js` | **0** | 2 files / **52 passed** (`$SC/lh7-base-1.log`) |
| PLANT A (manifest entry ALONE) | same + `tests/lint/subsystemCertificationTotality.walker.test.js tests/domain/subsystemRowsVirtual.test.js` | **1** | **4 files failed · 5 tests failed / 66 passed** (`$SC/lh7-plantA.log`) |
| RESTORE | inverse edit + `cmp` | — | **CMP IDENTICAL**, porcelain 0 |
| RESTORE PROOF | same 4 files + `tests/scripts/readerCorpusManifest.test.js` | **0** | 5 files / **87 passed** (`$SC/lh7-restore.log`) |

**The five arms a manifest-alone entry reds, quoted:**

1. `tests/lint/engineGatedRuleKeys.walker.test.js:709` — *"manifest members the engine does not gate on:
   **characterDriftEnabled**"* + `manifestWithoutRead: ['characterDriftEnabled']`, `manifestWithoutRow: [...]`.
2. `tests/lint/subsystemCertificationTotality.walker.test.js:150` — *"uncertified rule keys … characterDriftEnabled"*.
3. `tests/domain/subsystemRowsVirtual.test.js:530` — manifest 31 vs authored rows 30 (**vitest prints ACTUAL first**;
   the received side carries the plant, so the base manifest is **30** — PLAN §1.1's figure HOLDS).
4. `tests/domain/npc/characterDrift.test.js:791` — *"the flag has no DEFAULT_SIMULATION_RULES entry…"* (see §6, this arm
   is over-broad).
5. `tests/domain/npc/characterDrift.test.js:869` — *"⭐ AND NO KEY IS REGISTERED — the door car's bill is still the door
   car's"*, assert at **`:876`** `expect(manifest).not.toContain(CHARACTER_DRIFT_FLAG_KEY)`. **This is the reservation,
   and it is live.**

**The funnel door's reservation, also live and untouched:** `tests/domain/npc/characterDrift.test.js:703–709` STEP 2 —
*"nothing outside the family names the funnel"*, roster asserted `[]`. Its own comment names the price of breaching it:
*"If this reds, a source adapter was wired early — car L4's act, and **it must arrive with the flag door TE-VIRT-1 owes**
and its own dormancy proof."* ⇒ **the two halves of CAR 7 are ONE atomic act, and both halves are reserved.**

---

## 4 · ⭐ THE PRODUCT MEASUREMENT — the door lights nothing, and that is the chair's decisive figure

| probe | result |
|---|---|
| `git grep -n "from '[^']*characterDrift\.js'" -- src` | **6 importers, all inside `src/domain/npc/`** — `characterConsumers`, `characterEdit`, `characterEditView`, `characterReadModel`, `knownCharacter`, `livedExperienceFunnel` |
| `git grep -n "from '[^']*livedExperienceFunnel\.js'" -- src` | **2, both inside the family** — `characterReadModel.js`, `livedExperienceSources.js` |
| importers of `characterReadModel.js` anywhere in `src` | **ZERO** — its only three hits are its own header and a sibling's comment |
| callers of `foldLivedExperience` / `writeAxisDrift` in `src` | **ZERO outside the family**; the only non-family mentions are the two DEFERRAL comments at `envoyChanceMeetingStage.js:66/:757` and `faithWitnessSource.js:17` |
| the tree's own sentence | `src/domain/npc/characterReadModel.js:210`: *"Today no caller runs foldLivedExperience, so the vocabulary would guard nothing"* |

⇒ Lighting `characterDriftEnabled` in any preset moves **no world byte and no reader sentence**. §893's ground —
*"the deferral costs no product"* — **re-confirms at my base**, on the correct mechanism (the flag has no home, so
`foldLivedExperience` takes its dark arm at `:556`), not on the false one the commit body gave (§1 row 7).

---

## 5 · ⛔ A FINDING IN THE OWNER'S OWN WALK CORPUS, FOUND WHILE PRICING THIS CAR

`scripts/review/readerCorpus.mjs:113–114`, verbatim: *"`characterDriftEnabled` is deliberately ABSENT: **no gate anywhere
reads it**, so setting it is a no-op that reads as intent."*

**The premise is FALSE at this base.** `src/domain/npc/characterDrift.js:273` is a gate and it reads the key:
`asObject(asObject(worldState).simulationRules)[CHARACTER_DRIFT_FLAG_KEY] === true`. **The CONCLUSION is true, for a
different reason** — setting it is a no-op because no production caller reaches the gated writers (§4).

⚠ **And the pin cannot catch it.** `tests/scripts/readerCorpusManifest.test.js:196–199` freezes the overlay's four KEYS
(`demographicsEnabled`, `espionageEnabled`, `neutralNeighborsEnabled`, `warMemoryEnabled`) — **not the prose**. So the
sentence is a silent false premise in the corpus the owner is about to walk, and it would stay silent through a door
landing. **Reported, not fixed:** correcting prose in the walk corpus is not this refused car's to take, and a lane that
edits the owner's walk material while its own car is refused is exactly the scope creep the preamble forbids.
**Recommended disposition: a one-line prose correction on whichever car next touches `scripts/review/`.**

---

## 6 · ⛔ THE MECHANICAL BLOCKER THAT SURVIVES ANY CHARTER — the manifest's membership law

`src/domain/worldPulse/simulationRules.js:175–176`, verbatim: *"**MEMBERSHIP IS NOT A JUDGMENT CALL:** a key belongs
here when `src/` gates on it with the strict idiom and neither surface above declares it."*

**`characterDriftEnabled` fails that law at the source.** All three walker arms
(`engineGatedRuleKeys.walker.test.js`, `GATE_RE` / `GATE_EXPR_RE` / `ALIAS_READ_RE`) require a literal `.<key> === true`
member access. `characterDriftActive` uses a **computed** member access through the exported constant — the class the
walker's own header records as *"a COMPUTED member access that attributes to no key at all"* and then says is
**"DELIBERATELY NOT GUARDED … zero live instances"**.

⭐ **THAT SENTENCE IS NOW STALE: `characterDrift.js:273` IS a live instance.** A real, strict, dark engine gate is
invisible to the CR-WR10-C census — which is the exact class that census exists to close. CONFIRMED by plant:
`manifestWithoutRead: ['characterDriftEnabled']`, `unaccountedReads: []`.

⇒ **A chartered door car cannot "just register" the key.** It must first RESPELL the seam's one chokepoint to
`rules.characterDriftEnabled === true` — a design change to landed, test-enforced code whose header rules that the read
goes through the constant *"so a second reader cannot invent a second spelling of the same door."*
⚠ **And the respell lands EXACTLY on a ceiling:** `characterDrift.js` carries **3** literal occurrences today and
`tests/domain/npc/characterDrift.test.js:815` asserts `<= 4`. The respell makes it 4. **No further prose mention of the
flag may ever enter that file.**

---

## 7 · THE PRICE OF A CHARTERED DOOR CAR — measured, so it can be dispatched in ONE shot if the owner charters it

| # | act | address | note |
|---|---|---|---|
| 1 | respell the gate to the strict by-name idiom | `src/domain/npc/characterDrift.js:273` | §6 — without it the manifest entry reds direction 1 immediately. Literal count 3 → **4, at the ceiling** |
| 2 | manifest entry | `src/domain/worldPulse/simulationRules.js`, between `'casusCommerciiEnabled'` and `'conquestDoctrineEnabled'` | manifest **30 → 31** |
| 3 | the first `LIVES_SUBSYSTEM_ROWS` row | `src/domain/certification/subsystemRowsLives.js:72` | the leaf's own recipe is at `:43–49`; ⭐ appending shifts NO existing row |
| 4 | three module-scope edits | `tests/domain/subsystemRowsVirtual.test.js` | the file names them at `:150` — the key const, the `VIRTUAL_RULES` member IN POSITION, the `LANE_LEAVES` entry |
| 5 | move TWO landed arms, by name | `tests/domain/npc/characterDrift.test.js:791` and `:869` (asserts at `:799`, `:876`) | ⚠ **`:791` is OVER-BROAD and must be NARROWED, not softened**: its stated claim is `DEFAULT_SIMULATION_RULES` membership but its assertion is `not.toContain` over the WHOLE file — and `ENGINE_GATED_VIRTUAL_RULE_KEYS` lives in that same file, so it convicts a legitimate manifest entry for a thing the entry does not do |
| 6 | a dormancy fence on CAR 3's shape | `tests/property/` | a NEW test file ⇒ lighting census + ratchet + **golden-freeze enrolment or written exclusion in the SAME commit** |
| 7 | the funnel wiring (the car's other half) | one call site: the stage → `foldLivedExperience` | reserved by `characterDrift.test.js:703` STEP 2; `envoyChanceMeetingStage.js` KEPT `chanceMeetingLessonEntries` + `collectLessons` WHOLE for exactly this successor |
| 8 | the prose correction | `scripts/review/readerCorpus.mjs:113` | §5 — nothing reds if it is skipped, which is why it must be written down |

⛔ **AND THE CHAIR SHOULD PRICE IT AGAINST §4: all eight acts deliver ZERO product until a source adapter exists.**
The honest order is *adapter first, door second* — a door car that lands ahead of a caller buys the wave a certification
row, a fence, four censuses and a moved lighting census in exchange for nothing a customer can see.

---

## 8 · REGISTER LAW — every predicted delta, RECORDED BEFORE ANY INSTRUMENT RAN

**Every figure below is ZERO, and the reason is the same reason in every row: this car committed no bytes.**

| register | predicted delta | why |
|---|---|---|
| Lighting census (`titles` / `suiteTitles` / `files` / …, all five) | **0 / 0 / 0 / 0 / 0** | no test file added, renamed or deleted; no `describe`/`test` title minted |
| Test-ratchet `totalTests` / `totalFiles` / `entries` | **0 / 0 / 0** | no test added; base was green (52 passed) and the tip is the base |
| Voice magnitudes (em / bang / files / total) | **0 / 0 / 0 / 0** | no string literal authored anywhere |
| `sizeBaseline` (eslint max-lines) | **0** | no `src/` line added; the plant was reversed and `cmp`-verified |
| Writer-reach | **0** | no identity's reach changed |
| OSR (`schema` / `total` / `identities`) | **0 / 0 / 0** | no observed shape read or written |
| Golden-freeze register | **0 rows** | no golden-adjacent env spelling read; no test file added ⇒ nothing to enrol or exclude |
| Engine-gated backlog (17 at ceiling 17) | **0** | ⚠ `characterDriftEnabled` is **not** a backlog member and must never become one — the walker's own law: *"Never to the backlog: that list is a measured burn-down, not a parking space"* |
| Four censuses per new `src/domain` leaf | **0** | no leaf authored |
| **⭐ EAGER FIRST-PAINT BYTES** | **0 B** | **no bytes at all were committed.** Independently: the whole W-LIVES family is reached by nothing in `src/` (§4), so even a lit door adds no module to any eager chunk — but the load-bearing reason here is simply that this car's diff is empty |
| Hashed-chunk listing diff | **0 B**, well inside `(margin − 100 B)` | same reason |

**Instruments NOT run, and why — stated rather than left as a gap:**
- **`tests/lint/` WHOLE directory run: NOT RUN.** The preamble's trigger is *"whenever your cars add, rename or delete
  any file under `src/` or `tests/`"*. This car adds, renames and deletes **nothing**; my tip **is** my base, so a
  directory run would measure the base and attribute nothing to me, at the cost of ~20 minutes of a box four lanes
  share. Recorded as a deliberate skip with its reason, not as an omission.
- **`typecheck:domain:strict`, `eslint`: NOT RUN.** Same reason — no `src/` byte changed. `cmp` against the pre-plant
  backup is the receipt that the tree is byte-identical to the base other lanes measured.
- **Same-seed byte-identity run: NOT RUN, and NOT OWED.** Byte identity is trivially satisfied by an empty diff. ⚠ And
  per CAR 5's standard I state the other half plainly: **there is no LIT arm to report, because nothing was built.**

---

## 9 · WHAT WOULD CHANGE MY ANSWER

One sentence, from the owner or from a chair charter that names the contradiction: **"the lighting wave takes the
`characterDriftEnabled` manifest home, notwithstanding RULINGS-893 §2's reservation."** With that, §7's eight acts are a
clean single-commit car and this lane can build it. Without it, the brief's charter is a misreading of its own citation
and the docket's own `klass` is `owner-gated`.

⛔ I did **not** soften a landed test, and I did **not** decide the row. §890.1's lesson is the one this lane applied.

---

## 10 · OUTCOME TABLE

| step | outcome | sha |
|---|---|---|
| 1 · arrival verification (HEAD, porcelain, `node_modules` form) | ✅ all three match the brief | `38474a59e` |
| 2 · premise re-derivation (7 premises) | ⛔ **2 REFUTED** (the car's charter; PLAN §1.1's citation), 1 corrected, 4 hold | — |
| 3 · base proof, 2 files | ✅ exit 0, 52 passed | `38474a59e` |
| 4 · plant A (manifest alone) + restore + restore proof | ✅ 5 arms convicted, `cmp` IDENTICAL, exit 0 / 87 passed | `38474a59e` (unchanged) |
| 5 · product reach measurement | ⭐ the door lights **nothing** | — |
| 6 · **the car** | ⛔ **REFUSED — ZERO BYTES.** Reservation live; charter refuted; docket says `owner-gated` | **no commit** |
| dock tip at exit | **`38474a59eba460f30d6596dcb65efda3a446738a`** · porcelain **0** | — |

---

## 11 · ⛔ RETROVALIDATION ROW (for the Fable 5.1 chair)

**What was judged.** That `LGT-P7-DRIFTDOOR` may not be built by a lane at this tip, and that the correct deliverable is
zero bytes plus the measurement. The lane REFUSED a chair dispatch; that refusal is the judgment.

**What the Fable chair must re-derive.**
1. ⭐⭐ **The charter question, and it is the only one that matters.** `RULINGS-893.md` §2's ground paragraph reserves
   the `characterDriftEnabled` manifest home in terms. Did the chair intend the L-HOMES brief to be a NEW fresh charter
   overriding it — and if so, does the amended carve-out line (reversibility) reach a row the sealed docket classes
   `owner-gated` and the live handoff carries on the OWNER'S DESK? **A lane cannot answer this; the chair or the owner
   must.**
2. **Whether the brief's factual ground can be repaired.** It cannot as written: ENCOUNTERS provably did not consume the
   flag. If the car is to run, it needs a different ground, stated.
3. **Whether the PLAN's §1.1 row should be corrected at the seal.** *"RULINGS-893 §2 charters it in three parts"* is a
   misreading of a document that says the opposite about this exact key; other cars may inherit it.
4. **§6's stale sentence in a landed walker.** `engineGatedRuleKeys.walker.test.js` says the computed-access class has
   *"zero live instances"*; `characterDrift.js:273` is one. Is that a comment fix, or a widening of the census — and
   does the wave own it? (⚠ A widening would pull the key into `unaccountedReads` and red the walker until the key is
   manifested, exempted or backlogged — i.e. **it would force this very decision**.)
5. **§5's false premise in the owner's walk corpus.** Whose car corrects `scripts/review/readerCorpus.mjs:113`?
6. **§7 row 5's over-broad arm** (`characterDrift.test.js:791`). It convicts a legitimate manifest entry for a claim the
   entry does not violate. Should it be narrowed now, independently of this car?
7. **Whether the honest order is adapter-before-door** (§4/§7), which would move this car OUT of L-HOMES entirely.

**Receipts by path.** `$SC/receipt-lgt-p7-driftdoor.md` (this file) · `$SC/lh7-base-1.log` (base green) ·
`$SC/lh7-plantA.log` (the five convictions, verbatim) · `$SC/lh7-restore.log` (restore green) ·
`$SC/laneLH7-scratch/BACKUP-simulationRules.js` (pre-plant backup, sha256 above) · `$SC/laneLH7-RULINGS893.md`
(`git show 3c491c6fd:RULINGS-893.md`) · `$SC/laneLH7-HANDOFF.md` · `$SC/laneLH7-LIGHTING.json` · `$SC/laneLH7-PLAN.md`.

**Priority: HIGHEST for item 1** (it decides whether a car of this wave exists at all), **HIGH for 3, 4 and 6** (each is
a landed instrument or a sealed plan carrying a statement measurement has falsified), **MEDIUM for 2, 5, 7.**

**Dock tip at exit: `38474a59eba460f30d6596dcb65efda3a446738a` · porcelain 0 · no commit, no ref, no register act.**
