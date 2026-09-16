# HB CHAIR RULINGS — the round-four close, the five questions, and the deferral book

**Date: 2026-08-06. Prepared under OPUS 5, NOT Fable 5.**
**⏳ OPUS-ERA — FABLE SURVEY OWED.**

**EVERY RULING IN THIS DOCUMENT IS VETOABLE.** Each carries the one sentence a future
session would need to overturn it intelligently. Nothing here was seen by the owner;
where a ruling consumes the blanket queue sign-off
(`memory/owner-blanket-queue-signoff.md`, repo-side row at the tail of
`docs/FABLE_VALIDATION_QUEUE.md`) it says so, and the grant supplies AUTHORITY, never
the DECISION. ⛔ **Q1 is ESCALATED and is not ruled here.**

**Target volume:** `docs/architected-volumes-pending-fold/HABIT_conditioning_round4-snapshot.md`
(4,426 lines, 363,030 bytes, md5 `a85acf92cd62247b4c073a432db80fc5`).
**NUL SCAN: ZERO.** `python3 -c "print(open(PATH,'rb').read().count(b'\x00'))"` → `0`.

---

## §A THE ROUND-FOUR CLOSE — THE VOLUME NEEDS A CLOSE STATEMENT, NOT ANOTHER ROUND

### A.1 The finding, stated first

**RULED: round four never closed, the volume's internal integrity is nevertheless
INTACT AND EXECUTED-TRUE at this byte sequence, and what is owed is a CLOSE STATEMENT
— one document — NOT a sixth-and-a-half pass.** The distinction is the whole cost
question: a close statement is an afternoon; another round is a full re-measurement of
every load-bearing premise at a moved HEAD.

### A.2 The evidence for "no close" — CONFIRMED

The file's last structural section is `## §9 THE COUNT CENSUS` (line 4260) and it
terminates at line 4426 on a lesson paragraph about instrument fallibility. There is
no seal, no verdict, no attestation block, and no promotion note. A grep across the
whole volume for `SEALED`, `ATTESTATION`, `VERDICT`, `CLOSE STATEMENT`, `READY TO FOLD`
returns only in-body uses (the attestation ROUND is named repeatedly as a prior pass;
`CHARTER_VERDICTS` and `DELIBERATION_VERDICTS` are vocabulary tokens).

⚠ **The italic colophon at lines 4217-4255 is NOT a close and must not be read as one.**
It opens *"Compiled and then AMENDED READ-ONLY against HEAD `5166a342`"* — it is the
AMENDMENT's provenance block, and it sits BEFORE §9. It is also, by that same sentence,
**STALE ON PROVENANCE**: the polish closed at `d48224e3` and round four re-measured at
`3e2bd309`, neither of which the colophon names. That staleness is invisible to the
volume's own instrument, for a reason recorded at §A.5 below.

**External corroboration (CONFIRMED):** `docs/START_HERE.md:182` lists *"the HABIT
volume's round-4 CAP"* among the lanes **IN FLIGHT** at the build-stream pause. The
most economical account of the missing close is that the round-four lane executed its
battery and its census and then ended without writing the closing declaration. That
account is PLAUSIBLE, not CONFIRMED — no lane transcript survives to prove it — but
nothing in the file contradicts it and the file's shape is exactly what it predicts.

### A.3 The evidence for "integrity intact" — CONFIRMED BY EXECUTION

I re-ran the volume's own instrument against the volume, from a scratchpad copy, with
the files restored to the names the script expects. **Exit code 0.** The census
reproduces the §9 appendix BYTE-FOR-BYTE, including both hashes and the line count:

```
volume BODY md5 (above §9, stable across re-pastes): 6622a9fbe8b4186d2d29e72cbb6d564a
countsweep.py md5                                  : 0aa8d27dbe8b786ab55c38df7d03a337
volume BODY lines (above §9)                       : 4258
...
52 quantities swept across TWO families, 0 FAIL, 52 PASS
TOTAL PROSE HOMES DIFFED: 131 ; TOTAL STRUCTURAL CROSS-CHECKS: 71 ; SIGNATURE PHRASES SCANNED: 42
ZERO DIFFS — every counted quantity agrees with every prose home that states it, and no refuted premise is restated unmarked.
```

⭐ **BOTH INSTRUMENT HASHES MATCH THE RECORDED VALUES ON DISK** — `HABIT_countsweep.py`
is `0aa8d27dbe8b786ab55c38df7d03a337` and `HABIT_VERIFY_oddsratio.py` is
`ec974edb4ee8f0b776d77d887f28bc6e`, exactly the two figures §9 diffs. **The instrument
that produced the appendix is the instrument on disk**, so the census is not merely
transcribed-consistent, it is REPRODUCIBLE.

I also ran the second instrument standalone: `python3 VERIFY_oddsratio.py` → **exit 0**,
`analytic.law_lo = 0.481481`, `law_hi = 2.076923`, and every case reports
`odds_inside_law: true` with `deleted_pin_reds: true` — the odds-ratio law holds and the
deleted per-probability pin correctly reds, which is P1's refutation standing up under
execution rather than under citation.

⭐ **NOTE ON THE FILENAMES, because it will bite the next runner.** The script's
`DEFAULT_VOLUME` is `DESIGN_HABIT_ARCHITECTURE-POLISHED.md` and its `SWEEP_SCRIPT` is
`VERIFY_oddsratio.py`, while this directory carries `HABIT_`-prefixed names. Run it from
a copy with the original three names, or the `sweep_script_md5` quantity dies on a
missing file. **The snapshot rename broke the instrument's own default invocation and
nothing records that.** It is a one-line note the close statement owes.

### A.4 The ruling and its reasoning

**RULED (CHAIR): WRITE THE CLOSE STATEMENT. DO NOT RUN ANOTHER ROUND.**

A round is a re-measurement pass. The product of a re-measurement pass is a census, and
the census already exists, reproduces, and is green **at this exact byte sequence**. A
new round could only find two things, and both are answered:

1. **New refutations against a moved HEAD.** The build tree has moved exactly **ONE
   commit** past round four's measurement head. Round four measured at `3e2bd309`;
   build HEAD is `cbd348a5` ("SP-C: the posture read"). The full changed-file list
   `3e2bd309..cbd348a5` is fifteen files and **none of them is any of the twenty-one
   premise files this volume's rulings rest on** — CONFIRMED by direct measurement. The
   four provenance commits (`7cb237e7` → `5166a342` → `d48224e3` → `3e2bd309`) exist and
   are strictly linear ancestors in that order, exactly as the volume claims.
2. **Defects the instrument cannot see.** Those are real and enumerated at §A.5. A
   second run of the same instrument does not find them; **naming them in the close
   statement does.**

**Cost comparison, stated because it is the decision:** the close statement is one
document plus one census re-run (both already done here, in this lane). Another round
is a full re-execution of fifteen load-bearing measurements plus an adversarial battery
plus a re-paste — and it would end by producing a census identical to the one above.

**THE VETO SENTENCE:** *Veto this if you hold that a volume architected across six
passes may not be declared closed by any authority except the one that opened the last
pass — in which case the remedy is not another round either, but a Fable-era
re-attestation of the existing round-four battery.*

### A.5 WHAT THE CLOSE STATEMENT MUST NAME — the instrument's four blind spots

These are the reason a close statement is worth writing rather than the round being
tacitly assumed. Each is CONFIRMED by execution.

1. **THE CENSUS DOES NOT DIFF PROVENANCE CLAIMS.** HEAD hashes, branch names and
   worktree addresses are neither counted quantities nor struck premises, so the stale
   colophon at line 4217 is structurally invisible. **The close statement must restate
   the provenance chain, or a reader two sessions from now will re-measure against
   `5166a342` because that is the only head the closing block names.**
2. **THE BODY HASH EXCLUDES §9 BY CONSTRUCTION** (`vol.text.split("\n## §9 THE COUNT
   CENSUS")[0]`). This is correct and deliberate — a self-hashing appendix cannot exist
   — but it means §9's own prose, including the round-four lesson paragraph, is outside
   the stable hash. It is still inside the prose-home and struck-premise scans, which
   run over the whole text; only the hash stops short.
3. **TWO GUARDS OVER ONE ROW, NEITHER SUFFICIENT ALONE.** Executed: with a cell removed
   from a coverage-table row, `coverage_rows` stays **PASS 12** while
   `malformed_row_scan` goes **FAIL 1**. The row count survives the mutilation because
   padding keeps it countable. This is correct design, but it means the malformed-row
   scan is the ONLY door on that class and must be pinned directly — the estate's
   recorded "defense-in-depth blinds mutants" law.
4. **⚠⚠ THE CURE AND THE DETECTOR SHARE ONE FUNCTION, AND A ONE-TOKEN TIDY RESTORES THE
   BLINDNESS.** See §B.3. This is the sharpest finding in this lane.

---

## §B THE INSTRUMENT-DEFECT AUDIT — the `coverage()` IndexError

### B.1 What the dead scan was supposed to catch

`malformed_rows()` walks every markdown table in the volume and reports any data row
whose cell count differs from its own header's. Its purpose is the class where a table
is edited and a cell is silently lost — after which every downstream parser reads
shifted columns and every derived quantity is quietly wrong while still reporting PASS.

### B.2 Has it since run to completion? YES — CONFIRMED

In my re-run it reports `malformed_row_scan PASS 0` with one structural cross-check,
**inside a census that printed all fifty-two quantities and exited 0**. I measured its
denominator to rule out vacuity — the classic "enumeration on the credit side fails
open" hazard:

```
TABLES PARSED : 15
DATA ROWS WALKED BY malformed_rows(): 126
malformed rows found: 0
coverage() rows: 12   cells-per-raw-row: [4]
```

**Fifteen tables, 126 data rows. The zero is a measured zero, not an empty-harness
zero.** And the three cures behave, proven by mutant on scratchpad copies:

- **MUTANT 1 — the exact round-four killer edit** (last cell removed from the first
  coverage-table data row): the census now **completes**, prints all 52 quantities,
  reports `malformed_row_scan FAIL 1` with
  `NOTE line 1363: header wants 4 cells, row has 3`, and **exits 1**. Padding preserved
  the other fifty-one verdicts exactly as the docstring claims.
- **MUTANT 2 — the backstop** (a navigated table header renamed): prints
  `⛔ PARSE ABORT — the instrument could not finish deriving. THIS IS A FINDING, NOT AN
  OUTAGE: LookupError: no table with header ['Site','Action','Close','Coverage']` and
  exits 1. **A named finding, not a traceback, not silence.**

### B.3 ⚠⚠ COULD ANYTHING HAVE SLIPPED THROUGH? — the honest answer, in two halves

**HALF ONE — the defect was MUTANT-ONLY, and this materially softens it.** On the
unmutated volume every coverage row carries exactly four cells (measured:
`cells-per-raw-row: [4]`), so `coverage()` never raised on the real document. The
IndexError therefore corrupted the instrument's **WARRANT**, not its **OUTPUT**: the
round-three claim *"a row with a cell removed reds `malformed_row_scan`"* was true of
the table it was tried on and false of the next one. **No census reading was ever wrong
because of this defect.** The README's framing — "the malformed-row scan never ran" — is
true of the mutant run and would be over-read if applied to the real censuses.

⚠ **The residual I cannot close:** pre-cure, a short row in any table reached by an
indexing parser would have aborted the whole census with *no output at all*, and a
reader could have taken that silence for "nothing found". The volume preserves only the
round-four census; earlier rounds' outputs are not in the file. So **"every earlier
census printed" is PLAUSIBLE, not CONFIRMED** — I cannot prove it from bytes that exist.
The cure makes it unfalsifiable going forward, which is the right place to leave it.

**HALF TWO — ⚠⚠ THE FINDING THAT MATTERS, AND IT IS LIVE.** The crash-cure and the
detector are the SAME FUNCTION, separated only by the presence of one argument:
`cells(row, want)` pads (the cure), `cells(row)` does not (the detector, at
`malformed_rows()`). Nothing pins that distinction. I tested it:

> I copied the instrument, changed `got = len(cells(r))` to `got = len(cells(r, want))`
> — the single most natural "tidy-up" a future editor could make, aligning the detector
> with the padding form the cure introduced everywhere else — and re-ran it against
> **the same short-row mutant that had just reddened**.
>
> **Result: `malformed_row_scan PASS 0`.** The detector goes completely blind. The
> census still exits 1, but only because `countsweep_md5` noticed I had edited the
> script; **the short row itself is caught by nothing.**

**This is the estate's recorded "a detector and the repair written to compensate for it
were blind through the same hole" class, sitting one token away from realization.** The
`cells()` docstring warns about it in prose — *"The scan measures the RAW row and is
unaffected by this padding"* — but **a comment is not a pin**, and round four's own
stated lesson is that every guard must be run against the edit it was built to catch.

**RULED (CHAIR): the instrument owes a SELF-MUTANT before HB-0 dispatches.** The
instrument must carry a test that plants a short row and asserts `malformed_row_scan`
reds, so that the tidy above turns red instead of green. This is a small, contained
addition to the instrument — not a volume round — and it belongs in the same commit as
the close statement. **VETO SENTENCE:** *Veto if you hold that an architecture-phase
instrument need not be self-guarded because it is re-run by hand each revision — but
note the guard costs less than the paragraph explaining why it was skipped.*

---

## §C THE FIVE CHAIR QUESTIONS

### Q1 — the two owner-gated persisted fields ⛔ ESCALATED, NOT RULED

**THE QUESTION IN ONE SENTENCE.** Do `deployment.habitEpisode` and
`treaty.habitEpisode` — two additive optional keys on persisted campaign records —
carry the owner's signature, so that close 1 (the flagship war-chooser close) and the
`sue_for_peace` join can be built?

**THE ARMS AS THE VOLUME STATES THEM.** (i) Stamp both fields — the volume's
recommendation, on the argument that both records are open bags with no validator and
no migration. (ii) An HB-side index from `(attackerId, targetId)` to a pledge — refused
as a second index over a live relation. (iii) Decline — HB-3 ships seven of eight
closes, `deploy` reads a stock nothing writes, and the sue arm loses its keyed join.

**⛔ ESCALATED, AND TO WHICH GATE.** Persisted-state shape is an ESCALATE-ALWAYS class
in this program, blanket sign-off notwithstanding. It escalates to **the owner
directly**, not to Fable — Fable holds architecture authority, not persistence-shape
authority. ⚠ **An additional and specific reason to escalate rather than consume the
grant:** the blanket sign-off is dated 2026-08-05 and signs queued items *per the
chair's recorded recommendation for that item*. Q1's ONE-FIELD form predates the grant
and is arguably inside it; **the SECOND field was minted at the polish, after it**. The
grant's own scope reading says a missed item is signed regardless because "the grant
says everything" — but that clause is about items the ENUMERATION missed, not items
that did not yet exist. **This lane declines to resolve that ambiguity in the owner's
name.**

**⚠⚠ THE VOLUME'S COST ARGUMENT IS PARTLY REFUTED. Three of its cheapness premises did
not survive an executed read, and the owner must price the real shape, not the stated
one.** All CONFIRMED against the live build tree:

| Volume's premise | Verdict | What is actually there |
|---|---|---|
| `DeploymentRecord` is ONE deliberately-untyped bag | **REFUTED** | **THREE** declarations. The loose one is `pulseShapes.js:51`; `navalKernel.js:53-54` and `armyTransitKernel.js:60-62` each declare their own **STRUCTURED shadow**. Touching `record.habitEpisode` inside those two modules is a tsc error under their local typedef |
| `TreatyRecord` is declared exactly once | **REFUTED** | **TWO**, byte-identical: `peaceTermsCatalog.js:137` and `treatyEnforcement.js:48` (a chartered dependency-free leaf that declares rather than imports) |
| A repo-wide search for a treaty key validator returns none | **REFUTED AS STATED** | `peaceTermsPrimitives.js#hasExactKeys` is a house idiom in ≥12 modules, and it **gates the carried term sheet** — the exact artifact the `sue_for_peace` join rides (`peaceTermsCarriedSheet.js:68-72`, plus a `schemaVersion` equality gate at `:73`). What IS true is the narrower claim: nothing validates the treaty record's own top-level key set |
| The treaty has two mint doors | **REFUTED** | **THREE.** `peaceTerms.js#mintTreaty`, `peaceTerms.js#mintTreatyFromCarriedSheet`, `peaceTermsSale.js#mintSovereigntySaleTreaties`. ⭐ The estate already learned this the hard way: `tests/lint/oathStampTotality.walker.test.js:79-83` says in-source *"the volume says 'both doors' and the tree has three — which is the whole reason this walker measures the set instead of trusting a sentence."* **A prior volume made this identical error about this identical record** |
| The two fields are byte-cheap | **RE-PRICED** | The +32-byte precedent is a **per-campaign singleton** cost (one key in `simulationRules`). These are **per-record**: `,"habitEpisode":` is 16 bytes plus the value, per deployment and per treaty. Realistic 40-80 bytes per record. Bounded by live settlements, not by history — deployments are deleted at five sites on resolution, treaties pruned at expiry |

**⭐ AND ONE PREMISE THAT WAS WRONG IN THE VOLUME'S FAVOUR, recorded because a chair
must correct in both directions.** I expected the four HB flags to cost persisted bytes
by the WR-9a `conquestDoctrineEnabled` precedent (+32 bytes/key on new campaigns). **They
do not.** `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`simulationRules.js:185`) states in-source
that the WR-9a fork offered exactly those two arms and **CR-WR10-C ruled the zero-byte
one**: *"it is UNIONED INTO THE CENSUS ONLY. Nothing here is written into a rules object,
spread into a preset, or persisted."* Its only code consumer is
`subsystemCertification.js:225`, a `keys.add()` into a census set. **CONFIRMED: HB's four
flags cost zero persisted bytes, and the ONLY persisted-shape cost in the entire HB
program is the two record fields.** That makes this escalation narrow and precisely
priceable. ⚠ The memory entry `wr9-partial-build-and-stops.md` records the +32-byte STOP
without its CR-WR10-C resolution and reads as a live hazard; it is stale in that respect.

**⭐⭐ THE FULL LIFECYCLE TRACE — required before escalation, and it changes the build
shape.** Every path below is CONFIRMED against live code.

| Path | `deployment.habitEpisode` | `treaty.habitEpisode` |
|---|---|---|
| CREATE | **SURVIVES.** `warDeployment.js:1088` seeds the record; the optional-key idiom is already there at `:1103` (`joinLedger`) and `:1120` (`casusReasons`) | **SURVIVES IF STAMPED AT THE RIGHT POINT** — see the ruling below |
| READ | SURVIVES — every consumer is a field-by-field read | SURVIVES |
| PERSIST | **SURVIVES.** `worldState.js:530` → `normalizeDeployments` does `{ ...record }` per record and validates only `casusReasons`/`joinLedger`. Then campaign JSON → `map_data jsonb`. ⚠ `jsonb` does not preserve key insertion order, so any byte-identity claim is a client-side serialization property, not a round-trip one | **SURVIVES.** `setSpatialLedger(out,'treaties',…)`; `deepCloneConditionalLedger` is a whole-namespace clone with no key filter |
| REGENERATE | **SURVIVES every rebuild** — `ensureStatefulRecord` returns `{ ...r, ...seeded, … }` with `r` spread FIRST. ⚠ The real loss is **DELETION** at five sites on withdrawal/conquest/return; anything stored only on the deployment dies with the army | **⚠⚠ THIS IS THE GHOST PATH** — `mintTreatyFromCarriedSheet` rebuilds the treaty from `materializeCarriedTermSheet`, whose source artifact is exact-key AND schema-version gated. A field written inside that mint, or carried on the sheet, is dropped or fails closed |
| UNDO / RESTORE | SURVIVES (session-only `pulseUndoStack`, wholesale `worldState` swap) | SURVIVES |
| CLONE | SURVIVES (`structuredClone` primary, JSON fallback — keep the value JSON-safe) | SURVIVES (every treaty deep-cloned each `advanceTreaties`) |
| MIGRATE / IMPORT | SURVIVES; and account IMPORT drops the whole `worldState` anyway, which the volume already declares | SURVIVES (`migrateTreatyClockMarkers` spreads `{ ...treaty, … }`) |

**⭐⭐ THE GHOST PATH IS ALREADY SOLVED BY PRECEDENT, AND THE VOLUME'S OWN WORDS POINT AT
THE WRONG PLACE.** The volume says `treaty.habitEpisode` is *"stamped onto the treaty
record at mint."* **Stamping at the mint is the shape that ghosts.** The estate already
solved this for GR-1's `sworn` field: at `peaceTerms.js:543`, `stampSworn(mint.treaty, …)`
is applied **AFTER** the `carriedTermSheet ? mintTreatyFromCarriedSheet(…) : mintTreaty(…)`
ternary at `:504-520` — with the in-source rationale at `:538-542`, *"THE SIGNATURE LINE,
STAMPED WHERE BOTH MINT ROADS MEET … that closure is defined TWICE, once per road, so an
arm added inside it would be two spellings of one law."*

**CONSEQUENCE, and it is the difference between a cheap field and an expensive one:**
stamped beside `stampSworn` at the roads-meet point, `treaty.habitEpisode` survives the
carried-sheet regenerate road, needs **NO** `hasExactKeys` widening and **NO**
`CARRIED_TERM_SHEET_SCHEMA_VERSION` bump. ⛔ **The alternative — putting the key on the
carried sheet — would require both, and a schema bump fails closed on every sheet
already in transit in a live save, so an in-flight errand's peace would silently never
land.** That is a live-save data hazard and it is refused here.

**THE RECOMMENDATION PUT TO THE OWNER (not a ruling).** **SIGN BOTH FIELDS**, with three
build conditions this lane attaches:
1. `treaty.habitEpisode` is stamped **at `peaceTerms.js`'s PASS-1 roads-meet point,
   beside `stampSworn`** — never inside either mint.
2. The third mint door (`peaceTermsSale.js#mintSovereigntySaleTreaties`) takes a
   **DECLARED EXEMPTION ROW**, not silence: a peacetime sovereignty sale has no
   `sue_for_peace` open, so it legitimately never carries a habit episode — but
   `oathStampTotality.walker.test.js` measures the door SET, and 2-of-3 coverage without
   a declared row is exactly the hole that walker exists to close.
3. `deployment.habitEpisode` is stamped after `seedDeploymentState`, in the
   `casusReasons`/`joinLedger` idiom, and the two **structured shadow typedefs**
   (`navalKernel.js`, `armyTransitKernel.js`) are widened in the same commit or the
   field is never read from those two modules.

**WHAT IT UNBLOCKS.** Close 1 → HB-3's flagship close → HB-5's war-chooser anchor. A
decline costs close 1 alone; close 2 survives on its recomputed road.

**THE VETO SENTENCE:** *Veto if the owner prefers that no habit program touch a persisted
campaign record in v1 — in which case HB-3 ships seven of eight closes, the war chooser
reads a stock nothing writes, and the honest instruction is to demote site 7 to DEFER
rather than ship a decorative anchor.*

---

### Q2 — the twelve circumstance classes ✅ CHAIR-RULED

**THE QUESTION.** Is `unpressed` the right total fallback, and is the declared
precedence order right?

**THE ARMS.** Accept the twelve and the declared precedence; or drop `unpressed` and
refuse to classify quiet decisions, costing totality.

**RULED: ACCEPT THE TWELVE AND THE DECLARED PRECEDENCE.** The vocabulary is disciplined
in the two ways that matter. It is TOTAL by construction (`unpressed` guarantees
`circumstanceClassOf` returns exactly one member — no null arm, no multi-class return),
and it BORROWS rather than mints: eleven of twelve tokens returned zero `src` hits, and
the twelfth candidate `ordinary` was rejected at seven hits in favour of `unpressed` at
zero. Refinement 9 already makes growth owner-signed and pins the ceiling with two
assertions rather than one, which is the correct shape — the count pin catches drift,
the ceiling pin refuses it. This is chair-rulable and not owner-gated because twelve is
the directive's own stated ceiling, not an expansion of it.

**⭐ TWO OBLIGATIONS THIS RULING ATTACHES, and the second is new here.**
1. The volume's own HB-0 measurement stands and is now BINDING: record the class-occupancy
   mix on generated worlds in the module header, and reopen before HB-4 if `unpressed`
   exceeds ~70%. **I sharpen it: measure the mix PER JOINED SITE, not globally.** A global
   70% can hide a site at 95% — route choice in a peaceful world is the obvious candidate
   — and a site whose every decision files under one heading is a site learning nothing,
   which a global average would conceal.
2. **`rival_ascendant` is precedence-LAST of the eleven real classes, and that deserves a
   measurement rather than a change.** It is the class most directly about a counterpart's
   believed strength — the anticipation half of the owner's directive — and any of the ten
   acute classes pre-empts it. Acute-beats-structural is defensible, but the consequence
   is that the directive's counterforce half accrues in the rarest class. **HB-0's
   occupancy measurement must report class 11 explicitly**, and if it is near-zero the
   chair should reconsider before HB-7 spends it.

**WHAT IT UNBLOCKS.** HB-0 (the pure substrate), and therefore the whole ladder.

**THE VETO SENTENCE:** *Veto if you hold that a modal `unpressed` class is a wasted
dimension rather than an honest one — the alternative is a non-total classifier, which
costs the totality law that every walker in this program is built on.*

---

### Q3 — the `Math.pow` residual ✅ CHAIR-RULED

**THE QUESTION.** Adopt the rounding fence now, or move decay into an exact
integer domain?

**THE ARMS.** The rounding fence (stocks stored and compared as integers in 1e-4 units,
every factor derived from the rounded integer); or a precomputed rational half-life
table over integer ages, which would be exact.

**RULED: ADOPT THE ROUNDING FENCE NOW; RECORD INTEGER-DOMAIN DECAY AS A NAMED FUTURE
WIDENING.** The volume's three reasons hold and I add nothing to them, but I do sharpen
why this is chair-rulable rather than escalated: it changes no persisted shape and no
owner-signed constant — it is an implementation discipline on a value that never leaves
the curve leaf. The decisive argument is the second one: a rational half-life table
would be a SECOND decay law in everything but name, and refinement 1 forbids that; the
estate already carries this exact exposure at fifteen sites including
`dispositionLedger`, so habit adds no new class of risk, only a new consequence for the
same risk.

**⚠ THE OBLIGATION IS THE PRICE OF THE RULING AND IS NOT OPTIONAL:** the HB envelopes
must include a same-input cross-run stock-identity check, so that if the residual ever
bites, an instrument sees it rather than a player. A ruling that accepts a fenced risk
without instrumenting the fence is a ruling that has spent the risk twice.

**WHAT IT UNBLOCKS.** Nothing — this blocks no wave. It is ruled now so HB-0 authors the
fence rather than discovering it.

**THE VETO SENTENCE:** *Veto if a cross-device divergence is ever actually observed at
the soak, at which point the rational table stops being a second decay law and starts
being the only correct one.*

---

### Q4 — the twelfth chartered coupling prefix ✅ CHAIR-RULED

**THE QUESTION.** Does HB earn its own chartered coupling prefix, or ride an existing
one?

**THE ARMS.** Add `HB` as the twelfth prefix with its own `couplingRegistryHabit.js`
leaf; or route HB's coupling rows through an existing volume's prefix.

**RULED: YES — ADD `HB` AS THE TWELFTH, WITH ITS OWN LEAF.** Confirmed against live
code: `CHARTERED_VOLUME_PREFIXES` is `['WR','TR','GR','WF','POP','IN','INT','SP','CW','ES','WY']`
— **eleven** — and `COUPLING_ID_SHAPE` is BUILT from it by regex interpolation, so the
first `CPL-<n>.<DIR>.HB-<n>.<facet>` row reds until the prefix joins. The substrate is
read by six ports (WAR, TRADE, GRAMMAR, POP, FAITH, INTERIOR) plus INFO reading all of
them; that is not a rider on someone else's volume. **The leaf pattern already exists**
— `couplingRegistryTrade.js` and `couplingRegistryWar.js` sit beside the head and the
schema in `src/domain/certification/`, so `couplingRegistryHabit.js` is the established
shape and not a new one. The corollary stands as the volume rules it: **no eighth
`LAYER_PATTERNS` family is owed**; the habit substrate leaves take ARGUED_UNLAYERED rows
on the argument already carrying four entries.

**⚠ THE MECHANICAL OBLIGATION, which the volume states loosely and which the README's
fold recipe states exactly: the prefix admission is FOUR EDIT SITES IN ONE FILE**
(`tests/domain/couplingRegistry.test.js`) — the `CHARTERED_VOLUME_PREFIXES` const the
id-shape regex is built from, the literal `toEqual([...])` list, the enclosing test's
count-bearing title, and the CLOSED-alternation comment. Editing only the const leaves
the `toEqual` red; editing only the `toEqual` leaves the regex rejecting the new ids.
⚠ Note the array lives in `tests/`, not `src/`.

**WHAT IT UNBLOCKS.** HB-2's first cross-layer row, and therefore HB-2.

**THE VETO SENTENCE:** *Veto if the chair intends to consolidate the prefix registry
before HB lands, in which case HB should wait for the consolidated shape rather than
becoming its twelfth exception.*

---

### Q5 — cross-class bleed ✅ CHAIR-RULED

**THE QUESTION.** Park cross-class bleed, or reserve a shape for it now (similarity
matrix vs hierarchy)?

**THE ARMS.** Park it and reserve nothing; or pre-answer the shape so later work can
build toward it.

**RULED: PARK IT, RECORDED, AND RESERVE NOTHING.** A reserved shape is a shape somebody
builds toward, and the honest answer is that nobody can know whether a 12×12 similarity
matrix or a hierarchy is right until the soak shows how sparse the per-class ledgers
actually are. Reserving the wrong one costs more than reserving neither, because a
reserved shape acquires defenders.

**⛔ THE PROHIBITION IS THE LOAD-BEARING HALF AND IT IS RULED, NOT MERELY RECOMMENDED:
BLEED MAY NEVER ARRIVE AS A TUNING KNOB.** A bleed coefficient is a credit-assignment
claim wearing a constant's clothing — it asserts "this outcome partly graded that
decision," which is a structural claim about causation, not a dial. When bleed arrives
it arrives as its own wave with its own owner signature. **This prohibition is the part
a future session must not quietly relax**, and it is exactly the creep refinement 4
exists to hold.

**WHAT IT UNBLOCKS.** Nothing directly; it prevents HB-0 from authoring a bleed
parameter "for later," which is how the knob would arrive.

**THE VETO SENTENCE:** *Veto only with an owner signature, because relaxing this turns a
structural change into a tuning act and that reclassification is itself owner-gated.*

---

## §D THE THREE CHOOSER SITES AT DEFER — can their `closeOwed` discharge?

All three were demoted from LEARN by the action-coverage law (R18) because no close
covers ANY of their actions. Each carries a written `closeOwed`. A `closeOwed` nobody
discharges is how a deferral rots into a bug, so each is given a discharge test here.

**SITE 2 — `generosityKernel`'s caller, all four `VERDICTS`. ⛔ NEEDS NEW MACHINERY.**
`closeOwed`: *grade the give verdict against the recipient's realized reciprocity or
betrayal over a stated horizon, WITHOUT re-reading the incidents `historyTerm` already
consumes.*
**CAN IT CLOSE NOW? NO, AND NOT BY NAMING ONE FACT — the record cannot express the
sentence.** Two independent breaks, both CONFIRMED:
1. **The incident row is PARTY-FREE.** `generosityReactions.js:358` returns
   `{ tick, type, severity, summary, holder }` — no giver, no receiver. And the
   relationship key is ONE key per PAIR (`relationshipKeyFromEdge` returns `edge.id`),
   so a gift A→B and a later reciprocal gift B→A write identical rows to the identical
   key. **"The recipient's realized reciprocity" is not expressible in the current
   record**, whatever horizon is chosen.
2. **The receipts array is never persisted and has no reader.** It is built at three
   sites in `generosityKernel.js` and returned at `:1367`, but `pulseKernel.js:2399-2415`
   reads only `changed / worldState / settlementUpdates / newsEntries`.

⭐ The fence itself measured cleanly: `historyTerm` consumes exactly three fields
(`reliefReceived01`, `reliefRefusedByThem01`, `betrayal`), sourced from incident types
`relief_received`, `relief_refused`, `credit_defaulted`. So `credit_repaid`,
`refuge_granted` and `trade_warmth` ARE unfenced and available. ⚠ **But the trap is
sharp: the BETRAYAL half of the credit fork is fenced while the REPAID half is not**, so
a close would grade "repaid present / absent" — an absence pin over an incident ring
**bounded to 8** (`prior.slice(-7)`) against a 24-tick `INCIDENT_LOOKBACK`. A busy pair
evicts the opening row before the horizon closes. That is the
harness-default-empty-state vacuity class waiting to happen.
**WHAT WOULD LET IT CLOSE:** a directed, party-tagged reciprocity record with a bound
larger than the 8-row ring. That is new persisted machinery and therefore re-opens Q1's
class at HB-9. ⚠ **A build-time correction the wave brief must carry regardless:** the
volume quotes ONE `receipts.push` site; there are **THREE** (give, purchase fall-through,
refusal), and the purchase site hard-codes `verdict: 'purchase'` rather than reading the
verdict vocabulary — a close keyed on the four `VERDICTS` will not see the purchase path.

**SITE 10 — `advanceIntervention`'s caller. ⭐ NEEDS ONE NAMED FACT — and it is the
cheapest of the three.**
`closeOwed`: *the intervention's own resolution (relieved / repelled / withdrawn) graded
against the engage decision that opened it.*
**CAN IT CLOSE NOW? ALMOST — every ingredient is live except the write.** A persisted
typed record exists: the `interventions` spatial ledger (`convergence.js:1223`), keyed
`${patronId}:${targetId}`, carrying `sinceTick`, `motive`, `side`, `strength` and an
optional `state`. Stable identity across ticks, traceable to its opening. **THE ONE
MISSING FACT: no terminal resolution is ever written, because the record is DELETED at
the exact moment the outcome exists** — `delete next[k]` at `:1030` (aftermath) and
`:1207` (defeat). Every ending but one is a silent delete.
**WHAT WOULD LET IT CLOSE: stamp the outcome onto the record before deleting it**, plus
the `move` that opened it. Nothing else is owed — no new record, no persisted-shape
change beyond a field on a ledger HB already reaches.

⚠⚠ **BUT THE `closeOwed` SENTENCE ITSELF IS REFUTED AND MUST BE RE-WRITTEN BEFORE IT IS
DISCHARGED.** None of `relieved`, `repelled` or `withdrawn` exists anywhere in
`src/domain/`. The live vocabulary is `INTERVENTION_STATES = { BESIEGING, HOLDING,
SCREENING, ATTRITED, RETREATED }` — and **only `HOLDING` and `ATTRITED` are ever
written; `BESIEGING`, `SCREENING` and `RETREATED` appear nowhere but their own
declaration.** A close authored against the `closeOwed`'s three words would be authored
against a vocabulary that does not exist, and a close authored against the declared five
would cover three dead rungs. **This is a `closeOwed` that has rotted exactly the way §D
exists to prevent, and it is the concrete proof that the discharge test was worth
running.**

⚠ A second correction: the volume calls the caller's vocabulary a two-member
`{engage, decline}`. `engagementOptions` in fact returns **FOUR** typed moves —
`{ engage, hold, screen, withdraw }` — which the caller then collapses to a binary at
`convergence.js:1187`. The two-member spelling is a caller-side collapse of a live
four-member vocabulary, not the vocabulary itself; `screen` and `withdraw` are computed,
ranked, and discarded.

**SITE 12 — `sovereigntyMarketStage`, the typed offer posture. ⭐ NEEDS ONE NAMED FACT.**
`closeOwed`: *the sale's completion or collapse graded against the offer posture, on the
WR-10 ledger-membership road.*
**CAN IT CLOSE NOW? THE OUTCOME HALF IS FULLY LIVE; THE POSTURE HALF IS DISCARDED.**
Completion is real and persisted: `peaceTermsSale.js:238-297` mints a treaty carrying
`parties`, `sellerId`, `buyerId`, `mintedTick`, `complianceState:'honored'` and a
`sovereignty_transfer` term, and `sovereigntyTransfer.js:205` actually moves ledger
membership. Collapse is real too, and graded by machinery that already exists: sale
treaties resolve through the ordinary compliance pass over
`'honored'|'strained'|'defaulted'`, plus repudiation breach and expiry-without-default,
plus a mint-time `lapsed: true` when eligibility fails at execution. Pair and tick
attribution are unambiguous.
**THE ONE MISSING FACT: the offer posture is never persisted.**
`readSovereigntySaleIntent` computes a rich typed read (`score01`, `interestKind`,
`booksDiverge`, `securityBand`) and `offerWeightOf(gate.score01)` turns it into a race
weight — **and none of it reaches the treaty.** What survives is prose only
(`reasons: [String(clearing.receipt), intent.receipt]` → `treaty.receipts`), and the
market's own typed receipts are dropped at the pulse seam (`applyPulseMover` returns only
`worldState / settlementUpdates / wizardNews`; nothing reads `result.receipts`).
**WHAT WOULD LET IT CLOSE: persist a BANDED `score01` (never the float — the no-decimal
runtime rule) onto the minted treaty.** ⚠ That is a stamped field on a persisted treaty
record, which is **Q1's class again**, and it must not be treated as a free close.
⚠ Note also the sale is ATOMIC — clearing, minting and conveyance all happen in one tick
inside `advanceSovereigntyMarket` — so there is no pending-offer record to hang the
posture on between decision and outcome.

⛔ **THE STANDING RULE THIS SECTION EXISTS TO SET:** all three `closeOwed` sentences are
HB-9's charter, and **HB-9 must re-measure each carry chain before building** — the
volume says so for the occupation close and the same discipline binds all three, because
a recompute claim here would be the third instance of the defect J-HB-13 already caught
twice.

---

## §E THE 43-ROW DEFERRAL BOOK — TRIAGE

The book is a self-asserted, executed quantity: `deferral_book PASS 43`, decomposed
`30 + 3 + 10` and derived from the coverage table by the census rather than transcribed.
I did not re-rule all forty-three. The classification:

| Category | Count | Disposition |
|---|---|---|
| **(1) Genuinely deferred-and-fine** — documented, reasoned, not bugs to re-find | **30** | The census-1 rows. **NO ACTION.** These are the published account of what the program cannot yet honestly learn from, and the walker keeps them honest (DEFER is shrink-only; every row's `closeOwed` must be non-empty) |
| **(2) `closeOwed` now come due** | **3** | The chooser sites at §D — sites 2, 10, 12, each now carrying an EXECUTED discharge test. **Site 10 closes cheapest** (stamp the outcome before the delete) but its `closeOwed` sentence is REFUTED and must be re-written first. **Site 12 needs one banded field** — but that field is a stamp on a persisted treaty, so it re-opens Q1's class. **Site 2 needs NEW MACHINERY** — the incident record is party-free and the pair shares one key, so the close is not expressible today at any horizon |
| **(3) Blockers wearing a deferral's clothing** | **10** | The per-action rows at site 7 — see below |

**⚠⚠ CATEGORY 3, AND IT IS THE FINDING OF THIS TRIAGE.** The ten per-action rows are the
nine `STRATEGY_MOVES` that close 1 cannot reach, plus the unkeyed `sue_for_peace` path.
They are filed as deferrals, and as bookkeeping that is correct — but **collectively they
are the statement that the program's ANCHOR SITE learns from one move out of eleven.**
`deploy` is the only unconditionally covered move; `sue_for_peace` is covered only behind
the measured `bilateralOffer` gate. **That is not a deferral, it is the actual scope of
v1 learning at site 7, and it should be stated as a headline rather than discovered by
summing a table.** The volume is honest about each row individually and never says so in
one sentence. **RULED: the close statement must carry that sentence.**

⚠ **A SECOND CATEGORY-3 CONCERN, raised as a finding rather than ruled.** The volume's
header states the four compile censuses are **session-scratchpad inputs, NOT repo files**,
that they do not land with the volume, and that every premise is re-measured at build.
Thirty of the forty-three rows originate in census 1. The volume names some of them by
symbol (`supplyWebWarfare.chooseInstrument`, captor/home ransom answers, the NPC verdict
table, conquest intent, envoy private goals, the interception decision, occupation
outcomes, route outcomes) but **I did not find a complete enumeration of all thirty inside
the volume.** HB-1's charter mints `habitForkRegistry.js` with "every row DEFER at this
wave," which requires the full list. **If the thirty cannot be recovered from the volume
alone, HB-1 owes a re-derivation pass, and that cost belongs in the close statement rather
than being discovered by the implementer.** Label: **PLAUSIBLE** — I searched the volume
and found partial enumeration; I did not exhaustively prove the absence of a complete list.

---

## §F VERIFY-AT-BUILD PREMISES — every place a ruling touches live code

Measured against the build tree at `.claude/worktrees/minifold`. ⚠ **The build tree is
DIRTY and a lane is mid-wave on the errand spine (SP-D)** — `errandMint.js` is untracked,
and several envoy-errand modules are modified. Readings below are of the WORKING TREE.

**CONFIRMED (21 of 21 attempted, with two qualifications):** `STRATEGY_K = 3.5` ·
`softmaxWeights`' normalized return (in `contestMath.js`, imported by
`settlementStrategy.js`) · the two `move === 'deploy' && bestTargetId != null` ternaries
and the optional `bestTargetId?:string` return type · `warIntent`'s single
`metadata.strategyMove === 'deploy'` stamp · `deliberationRead`'s
`if (row.urgent === true) return 'act_now';` guard head · `widenAcceptance` and
`compromiseRound` at **ZERO** fork idioms (whole 288-line module read; header declares
"PURE: no world state, no writer, no RNG, no clock") · `successScore(a)` ·
`adjustedDecayBase(decayKeep01)` · `SILENCE_DECAY: 0.92` · `LAW_WORDS` frozen at
`['balanced','lawful','lawless']` · `chance(IMPOSE_CHANCE)` with `IMPOSE_CHANCE = 0.3` ·
`progressOf(startScore, nowScore, threshold)` · `OBJECTIVE_BAR: 0.12`, `FORMATION_TALLY: 48`,
`CHARTER_VERDICTS` frozen at **7** · `refugeAcceptance`'s id-less signature ·
`settlementStrategy.js` baselined at **812**, unchanged · `CHARTERED_VOLUME_PREFIXES` at
**11** with `COUPLING_ID_SHAPE` built from it · `stableSampleByWeight` taking exactly one
`rng.random()` · `engagementOptions`' id-less/state-less signature and its two
`advanceIntervention` callers · `spatialLedgers` present in `WORLD_SNAPSHOT_HARD_DENY`
(`src/domain/display/worldSnapshotPublic.js:92`) · **the seven-token habit namespace
census at ZERO across `src/`, `tests/` and `scripts/`** — the namespace is entirely
unclaimed.

**QUALIFIED — two premises that did not verify as written:**
- **`generosityKernel`'s receipt push.** The field set is right at all three sites, but
  there are **THREE** push sites, not one, and the purchase site hard-codes
  `verdict: 'purchase'`. A premise depending on the receipt SHAPE holds; one depending on
  "one push site" or on the verdict vocabulary does not.
- **`generosityKernel.js` at 800/800.** There is **no entry** in
  `scripts/.size-baseline.json` — correctly, since that file lists only files EXCEEDING
  their ceiling. Recomputing eslint's `max-lines` metric (skipBlankLines, skipComments)
  gives **exactly 800**, cross-validated by the same method returning 812 for
  `settlementStrategy.js`, which byte-matches its frozen baseline. **Label: PLAUSIBLE
  (strongly cross-validated)** — the metric was recomputed, not run, because running the
  linter is a gate command and this lane is forbidden them. The operational consequence
  is unchanged and sharp: **any new logic in `generosityKernel.js` reds the gate**, so
  site 2's load point needs a lazy leaf.

**⚠ UNVERIFIED — premises I relied on and could not close:**
1. **That every pre-round-four census printed rather than aborting silently.** Only the
   round-four census survives in the file. §B.3.
2. **That the volume contains a complete enumeration of census 1's thirty deferral rows.**
   Partial enumeration found; absence not exhaustively proven. §E.
3. **The per-record byte cost in a real campaign.** The literal key cost is measurable
   (16 bytes plus value); the record COUNTS are not, without running the simulation,
   which this lane is forbidden. Structural bounds only: deployments ≤ member count and
   zero at peace; treaties ≤ one per live unordered pair.
4. **The exact remaining size headroom in `generosityKernel.js`** — 800/800 is a
   recomputed eslint metric, not an executed lint run. §F's qualification above.

⚠⚠ **THREE REFUTED PREMISES THAT ARE STOP-RULE TRIGGERS FOR THE BUILD** (J-WR-13 binds:
an implementer finding a further overstatement STOPS before building on it):
1. **`DeploymentRecord` is not one typedef but three**, two of them structured shadows.
2. **`TreatyRecord` is not one declaration but two**, and the treaty family DOES own an
   exact-key validator — applied to the very artifact the `sue_for_peace` join rides.
3. **Site 10's `closeOwed` names three states that do not exist** (`relieved`,
   `repelled`, `withdrawn`), while the live ladder carries five of which three are dead.
   §D.

⭐ **TOKEN CENSUS, CONFIRMED ZERO:** `habitForkRegistry.js` does not exist anywhere in the
worktree, and `habitStrength`, `habitEpisode`, `habitLoad`, `habitConditioningEnabled`
return zero hits tree-wide. The program is unbuilt and its namespace is unclaimed — which
is what makes the `episodeKeyFor` collision below worth fixing now rather than later.

**⚠ ONE COST NOBODY HAS PRICED, raised as a finding.** `peaceTerms.js:753-755` uses
`JSON.stringify(prevLedger)` against `JSON.stringify(sortedLedger(nextLedger))` as its
no-op change detector. A `treaty.habitEpisode` whose value moves each tick would force
`changed: true` and a full `worldState` rewrite on ticks where nothing else moved. The
episode key is minted once at the open and never rewritten, so this should not bite —
**but that is now a stated invariant rather than an accident, and HB-3 owes a pin on it.**

**⚠ A NAMESPACE COLLISION THE VOLUME DOES NOT NAME.** `episodeKey` is a heavily-live
token: **107 occurrences across 20 modules** in `src/` (the envoy-errand / negotiation
episode — `armyNegotiationEpisodeKey`, and an `episodeKey` field on at least four
exact-key-validated records including the carried term sheet). The FIELD name
`habitEpisode` is safe at zero hits. But HB-3's charter mints an **`episodeKeyFor`
family** into that occupied namespace. ⛔ This is the cross-vocabulary collision class
the volume's own HB-1 walker exists to red — the `'fortify'` lesson, one namespace over.
**RULED: HB-0/HB-1 owe a borrow census on every minted symbol, not only on the twelve
circumstance-class tokens**, per J-WR-10-B's "a mint must record what it looked for."
The volume records the census for twelve tokens and for none of the rest.

---

## §G WHAT BECOMES DISPATCHABLE

**Conditional on the close statement being written.** With no close, nothing dispatches —
that is the point of §A.

| Wave | Flag | Gate | State after these rulings |
|---|---|---|---|
| HB-0 | — | Q2 | ✅ **DISPATCHABLE** (Q2 ruled; carries the occupancy measurement + the borrow-census obligation) |
| HB-1 | — | the 43-row book | ✅ **DISPATCHABLE**, ⚠ subject to §E's category-3 re-derivation if the thirty are not fully enumerated |
| HB-2 | `habitConditioningEnabled` | Q4 | ✅ **DISPATCHABLE** (Q4 ruled; four prefix edit sites) |
| HB-3 | rides HB-2 | **Q1** | ⛔ **PARTIAL** — seven of eight closes buildable; close 1 and the sue join wait on the escalation |
| HB-4 | rides HB-2 | HB-3 | chain |
| HB-5 | rides HB-2 | **Q1** + HB-3 | ⛔ blocked — this is the anchor site |
| HB-6 | `believedDoctrineEnabled` | HB-2..5, SP-B (LANDED) | chain |
| HB-7 | `habitAnticipationEnabled` | HB-6 | chain |
| HB-8 | `doctrineTapEnabled` | SP-D | ⚠ tap arm dark-forever until SP-D — **which is landing now**; the build tree is mid-wave on the errand spine |
| HB-9 | — | the closeOwed set | ⚠ **gated on §D, and now priced**: one close is cheap (site 10), one re-opens Q1's class (site 12), one needs new persisted machinery (site 2). HB-9 is NOT a uniform "discharge the deferrals" wave and should not be chartered as one |

**THE HONEST HEADLINE: THREE of ten waves become fully dispatchable (HB-0, HB-1, HB-2),
a fourth (HB-3) becomes dispatchable in a narrowed seven-close form, and the remaining
six ride the chain plus Q1.** Q1 is the gate on the program's whole point: without it the
war chooser — the anchor the design is built around — reads a stock nothing writes.

⚠ **SEQUENCING NOTE, and it is timely.** §5 puts HB after the ES spine and JOINT with
the signed war-chooser wiring, because HB-5 needs the same 812-line file and the same
size-ratchet negotiation. SP-D — the gate on HB-8's tap arm — is being built in the tree
right now. **The joint window §5 describes is opening, not distant.**

---

## §H OBLIGATIONS THIS LANE RECORDS RATHER THAN DISCHARGES

Deliberately deferred — documented, not bugs to re-find.

1. **The pending-fold `README.md` Contents table has no row for this file.** Adding one
   was outside this lane's write scope (one new file, no edits to shared documents in a
   directory where sibling lanes are working). **The chair adds it at commit.**
2. **The close statement itself is not written here.** This document rules that it is
   owed and enumerates what it must contain (§A.5, §B.3, §E's headline sentence, the
   filename note at §A.3); it does not substitute for it.
3. **The instrument self-mutant (§B.3) is specified, not built.** It is a change to
   `HABIT_countsweep.py`, which this lane was scoped not to edit.
4. **The stale colophon at line 4217** is named, not repaired — editing the volume was
   outside scope.
5. **`memory/wr9-partial-build-and-stops.md`** records the +32-byte STOP without its
   CR-WR10-C resolution and reads as a live hazard when it is a settled one. A memory
   correction is owed.
6. **Site 10's `closeOwed` sentence is REFUTED and needs re-writing in the volume**
   (§D) — it names three intervention states that do not exist. Editing the volume was
   outside this lane's scope; the correction is specified, not applied.
7. **The three refuted Q1 premises (§F) are not struck at source in the volume.** Under
   the volume's own §0.3 discipline they would become R19-R21 with signature phrases and
   a struck-premise scan entry. This lane records them; it did not amend the volume.

---

## WHAT FABLE SHOULD RE-EXAMINE (protocol step 2)

1. **§A's close-vs-round call.** The reasoning turns on the claim that a round's only
   product is a census that already exists and reproduces. If Fable holds that a round
   also produces adversarial JUDGMENT that a census cannot, the answer flips to "one
   more round, narrowly scoped to the four blind spots at §A.5."
2. **Q1's escalation boundary.** I declined to consume the blanket sign-off on the second
   field because it postdates the grant. The alternative reading — that "everything"
   covers items minted after the grant so long as a chair recommendation exists — is
   defensible and would make Q1 signed rather than escalated. **One owner clause settles
   it either way, and that is the cheapest question in this document.**
3. **§E's category-3 claim** that the ten per-action rows are a headline rather than a
   deferral. That is a presentation ruling on somebody else's volume and Fable may
   reasonably hold that the rows are correctly filed as they are.
4. **Whether the `episodeKeyFor` collision (§F) is worth a rename.** I ruled a borrow
   census, not a rename. A rename is cheaper before HB-0 than after HB-3.
