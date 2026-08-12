# Foreign Policy / GR-4b — the succession road speaks, once, where it acted

- **Status:** READY
- **Status note:** ✅ **PROMOTED 2026-08-12 by the Fable chair (session `c42c8924`, Lane AD),
  compiled from Lane AC's read-only draft and the seven rulings CR-GR4B-1..7 (§12a).**
  Lane AC carried GR-4b as DRAFT blocked on exactly two causes — the packet's SHAPE (a Herald
  desk kind costs more registration files than the default budget allows) and the authored
  annex naming a person the engine cannot name. ⭐ **Both are now ruled: CR-GR4B-2 records an
  explicit pre-dispatch budget override with its grounds, and CR-GR4B-3's annex correction is
  DISCHARGED IN THIS PROMOTION COMMIT rather than owed** (the CR-GR4-5 shape — a design/annex
  correction is a chair act, never an implementer edit).
- **What this packet is NOT:** GR-4b as chartered. **The charter's five voice surfaces do not
  all have honest producers** (§-1); three of five, plus `reaffirmed`, re-file behind **GR-4d**
  and are excluded here by name. This packet is the BREACH VOICE alone — **and after
  CR-GR4B-8, the SUCCESSION DISAVOWAL alone within it.**
- ⛔⛔ **AMENDED 2026-08-12 — CR-GR4B-8: THE α RE-SCOPE. `repudiated` IS OUT, AND
  CR-GR4B-4 IS VACATED.** Lane AE STOPPED at preflight before writing anything and reported
  three independent refutations of the `repudiated` half; the chair ruled the STOP correct and
  authorised this amendment (the CR-TC5BII-1 shape — a chair-ordered edit executed by the
  lane, recorded). ⭐ **The evidence, all measured at `a2222fee`:**
  1. **NO MOUNT.** `repudiateTreaty` has exactly TWO call sites in `src/`:
     `treatyBreach.js:283`, which is *unconditionally* succession-bearing
     (`{ tick, succession: question }`, so its verdict is always
     `SUCCESSION_REPUDIATION_TYPE` and it can never mint `repudiated`), and
     `realmVerbExecution.js:360`, the DM verb road — **a file this packet's own
     `PACKET_MANIFEST.json` does not reserve**, so reaching it is the FIFTEENTH handwritten
     file and STOP #15. The sink cannot see it either: `peaceTerms.js:670-684`'s
     `if (isRepudiationBreach(treaty)) { … continue; }` returns before EVERY
     `newsEntries.push` in `advanceTreaties` (`:603`, `:606`, `:754`, `:764`).
  2. ⛔ **THE OPEN ROAD WAS NEVER MUTE — §-1 row 5 and §0 are REFUTED BY A LANDED GREEN
     TEST.** `realmManifest.js:291` gives the verb `candidateType: 'treaty_breached'` and
     `worldPulseFeedCuration.js:80` stamps `impactKind: outcome.candidateType`, so
     `tests/domain/realmVerbExecution.test.js:212-221` asserts an applied DM repudiation
     mints **exactly one** `treaty_breached` beat carrying both party ids, both court NAMES
     in the summary and a recorded `reasons[]` — the whole NEWS ADDRESS LAW, today.
     **EXECUTED at pristine `a2222fee`: TRUE_EXIT=0, 26/26 passed.** That kind already holds
     `EXACT_SECTION 'trade'`, `KIND_SECTION 'courts'` and a `WHAT_PHRASES` row — the SAME
     desk and section §6.3 would have given `repudiated`. **A second desk kind there is a
     DOUBLE VOICE for one act.**
  3. **A PRODUCERLESS REGISTRATION WOULD BE ORPHAN VOCABULARY.**
     `impactKindWalkers.test.js`'s `MINT_RE` is a RAW-TEXT scan of `src/domain/**` and its
     `EXPECTED_VOICE` check is **two-way exact** — a key with no minted literal reds as
     stale — so the kind cannot be registered ahead of its producer. Doing it anyway is the
     ES-7 mistake §-1 exists to refuse.
  ⇒ **CR-GR4B-4's stated ground ("it costs ZERO additional files") is false.** The β option
  is RECORDED in §12c as a product option, not scheduled. ⛔ **Every "two kinds / two rows"
  instruction below now reads ONE.** The handwritten-file total is **FOURTEEN, measured** —
  unchanged, because α touches the same fourteen paths and only the ROW CONTENT shrinks.
- **Packet version:** `1`
- **Drafted by:** Lane AC (read-only compile lane), 2026-08-12, Opus-era — see §12b. Compiled
  to packet standard and promoted by Lane AD under the Fable chair, 2026-08-12.
- **Verified base:** `claude/composite-r4` at `32f4e520e71774a233a0f8627cffa90a31674357`
- **Base note:** ⚠ **THE BASE IS RESTAMPED AT THIS PROMOTION.** Lane AC measured its whole
  draft at `0e5881b6`; while the promotion lane was reading, a sibling micro-act lane landed
  `32f4e520` ("Three recorded micro-acts: the 164th callout cured, the seventh claim exposed,
  SCW-0's mutant planted"). ⭐ **That commit is what makes this packet dispatchable at all:**
  it committed the census-walker edits that were foreign uncommitted dirt at Lane AC's last
  reading, and the tree is now clean. `git merge-base --is-ancestor 0e5881b6 HEAD` exits 0.
  **CONFIRMED, executed at this promotion:** `git log --oneline 0e5881b6..HEAD` over all
  thirteen substrate paths in §5 is EMPTY — the six files `32f4e520` touched
  (`scripts/mutation-coverage-manifest.json`, `scripts/mutation-sweep.sh`,
  `src/components/map/TreatyPanel.jsx`, `tests/design/deepCraftKillList.test.js`,
  `tests/docs/enforcement-claims.test.js`,
  `tests/lint/sovereigntyLightingContract.walker.test.js`) intersect this packet's manifest in
  exactly one place, the census walker, whose figures §5b B6 re-records at the new base.
  ⛔ **Every figure below was re-derived at `32f4e520`, not inherited from the draft.**
- **⚠ HEAD MOVED AGAIN DURING THE PROMOTION, AND THE BASE DELIBERATELY DID NOT.** A second
  sibling commit, `5f687277` (*"The frozen census SHRINKS: 17 rows become 16, by cure not by
  adjustment"*), landed while this packet was being written. **CONFIRMED: it touches exactly
  one file, `scripts/.test-ratchet-baseline.json`, and `git log --oneline 32f4e520..HEAD` over
  every substrate path in §5 is EMPTY.** `5f687277` is therefore an **admissible unchanged
  descendant** under the standard's authority rule 4, and the verified base stays at
  `32f4e520` — the commit at which every figure here was actually measured. ⛔ The one figure
  it did move is B7's, and B7 records both readings.
- **⚠ The tree is a LIVE SHARED WORKTREE.** At this promotion the only working-tree entry
  outside this change is `scripts/.test-ratchet-baseline.json`, and it is **stale-index
  residue of `5f687277`, not foreign WIP** — `git diff HEAD` on it is empty. ⛔ It was neither
  staged, restored, nor attributed. That is a snapshot, not a permission: the implementer
  re-runs `git status` at dispatch and reserves whatever it finds.
- **Depends on:** **GR-4a at `a53ef7c6`** (the producer; `git merge-base --is-ancestor a53ef7c6
  HEAD` exits 0, CONFIRMED at this promotion). GR-0's lifecycle voice
  (`treatyLifecycleVoice.js`, `grammarNews.js`, `grammarReceiptPools.js`, all in history).
  GR-1's oath stamp (in history, `oathHolder.js`).
- **Collision group:** `treaty-ledger-and-breach` **plus** `grammar-kind-registry` — serialize
  against any lane touching `peaceTerms.js`, `treatyBreach.js`, `grammarNews.js`,
  `grammarReceiptPools.js` or `heraldRouting.js`.
- ⭐ **GR-4b IS THE IN-FLIGHT CENSUS HOLDER.** Every packet in `PACKET_MANIFEST.json` is
  terminal except **IA-2 (`STALE`)**, and a terminal packet reserves nothing
  (`scripts/implementation-packets.mjs:43`). **CONFIRMED at this promotion:
  `tests/lint/sovereigntyLightingContract.walker.test.js` is reserved by no packet, and GR-4b
  takes it as its own `TEST` row.** The census-holder rule re-applies the moment a second
  non-terminal packet is promoted.
- **Commit authority:** stated by the chair in the dispatch message. Absent explicit authority
  the coding agent leaves its changes unstaged and uncommitted.

---

## -1. THE PARTIAL REFUSAL — measured, and it is the packet's centre

**GR-4b as chartered is not compilable, and the reason is a producer gap rather than a budget
or an effort.** The charter (`GR-4A.md:82`, ratified at CR-GR4-1) reads: *"THE VOICE. Four
Herald/chronicle kinds plus the dossier line `succession_question_open`, through the existing
pools/pacing machinery."*

The corpus is **already authored** — `docs/content/RECEIPT_POOLS_GRAMMAR.md`,
`# GR-4 — THE SUCCESSION QUESTION`, **seven** pools. What is missing is producers:

| # | Annex pool | Sig. | Depth | What the authored prose ASSERTS | Producer at this base |
|---:|---|---|---:|---|---|
| 1 | `succession_question_opened` | notable | 7 | a question standing **open across ticks** | ⛔ **NONE.** §-1a |
| 2 | `honored_by_silence` | routine | 8 | the **expiry of an unanswered queue entry** | ⛔ **NONE.** §-1a |
| 3 | `reaffirmed` | notable | 7 | the **explicit** honor answer | ⚠ **DESCRIPTOR ONLY.** §3.3 |
| 4 | **`disavowed_by_succession`** | **major** | 5 | the seat that followed tears up the oath | ✅ **REACHABLE AND PERSISTED.** §3.2 |
| 5 | `repudiated` *(WR-0c producer)* | major | 4 | the DM verb's open repudiation | ⛔ **REFUTED — CR-GR4B-8.** The BREACH is persisted, but the kind has **no reachable mount** in this packet's fourteen paths, and the ACT was **never mute**: it already speaks a fully-addressed `treaty_breached` beat (executed green). **Excluded; β in §12c** |
| 6 | `credibility_charge` | notable | 6 | the oathbreaker's price | ⛔ **GR-4c's**, excluded by name |
| 7 | `succession_question_open` | n/a (dossier) | 8 | the seat has not yet answered | ⛔ **NONE.** `GR-4A.md:164` excludes it by name for this reason |

### -1a ⛔ The three unbuildable kinds — and why "mintable" is not "honest"

A descriptor **could** be handed to any of these pools: `successionQuestionsForTick` returns
`{ answer, cause, kind, npcId, … }` for every question including the honored ones. **That
reading is refuted by the annex's own machinery.** `RECEIPT_POOLS_GRAMMAR.md`'s hard-constraint
block states **HEADLINE HONESTY (R-28)** as a constraint on this corpus: *"Every verb here is
entailable by the receipt's own facts."*

- `succession_question_opened`'s fifth variant — the line asserting that nothing has been
  broken and nothing confirmed — is **false the instant it is minted**: GR-4a opens and answers
  the question inside a single expression (`treatyBreach.js`, `answerSuccessionQuestions`).
- `honored_by_silence`'s fourth variant names a **hold window that does not exist**.
  `treatySuccession.js` states it in the source: *"the question is answered AT the event …
  Nothing is ever left 'open'."*
- `succession_question_open` is a dossier line whose subject is a state **GR-4a mints nothing
  of**.

⇒ **They are not blocked on prose, on budget, or on effort. They are blocked on GR-4d.**
Building them would repeat the mistake that cost this estate the ES-7 volume — five waves of
consumers against a dispatcher nobody chartered. **Producer first, again.**

### -1b The split, RATIFIED at CR-GR4B-2

| Slice | What it is | Blocked on |
|---|---|---|
| **GR-4b** (α) | **THE SUCCESSION DISAVOWAL VOICE.** The ONE kind with a persisted producer AND a reachable mount — `disavowed_by_succession`. **This packet, as amended at CR-GR4B-8.** | nothing; dispatchable |
| **GR-4b-β** | **THE OPEN ROAD.** `repudiated`'s authored line. ⛔ Not a desk kind — the act already speaks as `treaty_breached`. | a ruling on double-voicing + a fifteenth path (§12c) |
| **GR-4b-ii** | **THE HONOR VOICE.** `reaffirmed` + `honored_by_silence`, and the noise question they raise. | **GR-4d** |
| **GR-4b-iii** | **THE OPEN-QUESTION SURFACE.** `succession_question_opened` (Herald) + `succession_question_open` (dossier). | **GR-4d** |

⚠ **The charter's dependency arrow is incomplete in one direction.** `GR-4A.md:84` files GR-4d
behind GR-4a and GR-4c; it does not record that **three fifths of the voice depends on GR-4d**.
And GR-4d's substrate was already measured as weaker than the design assumes
(`GR-4A.md:323-330`): `ACTOR_INITIATED_MAJOR_TYPES` is an unfrozen `new Set`, the terminal is
**global not per-type** with no override seam, `treaty_breached` has **no `authorityFor`
producer**, and `routineMajorApproval` appears in no preset, golden or soak. §13 D1.

---

## 0. Why this packet exists

`treatyBreach.js` writes a `succession_repudiation` breach with a graded severity, a
`disavowed_by_succession` lineage ending and an authored house receipt — **and the world never
says so, in any register.** CONFIRMED: the shell-preservation branch in `advanceTreaties`
`continue`s before the detection beat, and the shell is `delete`d at `breachExpiresTick`
without a lapse beat, so **no landed news beat can speak either repudiation road.** And
`treatyDocument.js` **never reads `breachType`** — GR-4a's own landed test asserts the
consequence at `tests/domain/successionQuestion.test.js`, where a succession disavowal speaks
the generic economic-family line about wagons and tribute. **A torn-up oath and a missed grain
delivery are today spoken with identical words.**

⛔ **CR-GR4B-8 CORRECTION.** The sentence above claiming *"no landed news beat can speak
EITHER repudiation road"* is **true of the succession road only**. The OPEN road already
speaks: an applied DM `REPUDIATE_TREATY` mints exactly one fully-addressed `treaty_breached`
beat, asserted by a landed green test (head note, evidence 2). **This packet's subject is the
SUCCESSION road, and only it.**

**Observable result:** with `oathHolderEnabled` lit, the tick a new seat tears up its
predecessor's oath, the world says so — naming both courts, the hand that swore, and the
recorded reason. Dark, nothing moves at all.

---

## 1. Reconciled authority

1. **Live git state at `32f4e520` decides what exists.** GR-4a is in history at `a53ef7c6`
   (ancestor, exit 0). Where design prose and code disagree, **the code wins**; §13 records
   each.
2. **Binding chair rulings:** CR-GR4-1..6 (`GR-4A.md:817-861`) — in particular **CR-GR4-1**
   (the split, and the shared/hot-file corollary), **CR-GR4-3** (a mount conditional on a
   measurement), **CR-GR4-5** (a design/annex correction is a **chair act**, never an
   implementer edit). Plus **CR-GR4B-1..7 (§12a)** and the serialization law ruled at
   `73f5be96`.
3. **Operating law** — `CONTRIBUTING.md`, `ARCHITECTURE.md`, the worktree `CLAUDE.md`
   (⛔ never read a gate through a pipe), `PACKET_STANDARD.md`.
4. **This packet is authoritative at `claude/composite-r4` @ the base above**, or an unchanged
   descendant admitted by sealed dispatch.
5. **Design after reconciliation** — `docs/DESIGN_FP_GRAMMAR.md` §GR-4 (`:1005-1152`, including
   the dated CR-GR4-5 correction at `:1016-1044`); the content annex
   `docs/content/RECEIPT_POOLS_GRAMMAR.md` `# GR-4` **and its seven hard constraints**;
   `DESIGN_FP_SPINE.md` §SP-6 (the frequency-scaled depth floor); the **NEWS ADDRESS LAW**
   (owner doctrine 2026-07-22; stated constitutionally at
   `DESIGN_WAR_RULINGS_ARCHITECTURE.md:39-42` and inherited verbatim by GRAMMAR at
   `DESIGN_FP_GRAMMAR.md:64-70`).
6. **Never authority** — `SOL_QUEUE.md`, `START_HERE`, `docs/briefs/`.

✅ **No authority conflict remains open.** Lane AC's two blocking questions are ruled at
CR-GR4B-2 and CR-GR4B-3, and CR-GR4B-3 is discharged in this promotion commit.

---

## 2. Outcome and non-goals

### 2.1 What GR-4b builds — one behavior family

**A broken oath is spoken once, by the road that broke it.** The succession road
(`breachType: 'succession_repudiation'`) gains a voice gated by **`oathHolderActive` alone**
(CR-GR4B-5). ⛔ **CR-GR4B-8: WR-0c's open road is OUT** — it has no mount here and is not
mute; `peaceCausalActive` gates nothing this packet adds, and **GR-4b-α mints exactly ONE
kind.**

### 2.2 Explicit non-goals

| Excluded | Why | Where it goes |
|---|---|---|
| `succession_question_opened`, `honored_by_silence`, `succession_question_open` | **no producer, and the authored prose would be untrue at mint time** — §-1a | GR-4b-iii / GR-4b-ii, both behind **GR-4d** |
| `reaffirmed` | a descriptor exists, but its semantics are the queue's, and minting on every honored succession is a second, noisier family | GR-4b-ii |
| ⛔ **`repudiated`** — **EXCLUDED AT CR-GR4B-8** | **no reachable mount** in the fourteen paths (both `repudiateTreaty` call sites enumerated; the sink `continue`s before every beat), and the act is **already spoken** by a fully-addressed `treaty_breached` beat, so a desk kind would DOUBLE-VOICE it | **GR-4b-β**, §12c — recorded, not scheduled |
| Any credibility delta or `credibility_charge` pool | second writer, second flag conjunction | **GR-4c** |
| Any repair or re-derivation of the fracture-charge dead window | **GR-4c's preflight owns it**; the ES-5d lag law requires it be **re-derived, not inherited** | GR-4c |
| The lit-mode queue and its terminal-HONOR divergence | second writer (`worldState.proposals`), second flag | **GR-4d** |
| Any treaty-ledger write, any new persisted key | GR-4b **writes no state** | never |
| Any new simulation rule or feature flag | `oathHolderEnabled` and `peaceCausalEnabled` are both minted and censused | never |
| Any change to GR-0's eight existing kind rows or pools | this packet **adds**; it moves none | never |
| A tenth kind registry | ⛔ `kindPoolFloors.walker.test.js` pins `expect(REGISTRIES).toHaveLength(9)` — **extend `GRAMMAR_KIND_REGISTRY`, never mint a tenth** | never |
| Any edit to `docs/content/RECEIPT_POOLS_GRAMMAR.md` | ⛔ **the annex correction is DISCHARGED at this promotion (CR-GR4B-3); the implementer does not touch the annex** | done |
| Tuning, lighting, soaks, deploys, pushes | `PACKET_STANDARD.md` §"Golden and behavior-shift law" | owner |

---

## 3. Verified tree contract

Measured at `32f4e520`. **Every line number is a hint; every symbol is the instruction.**
Navigate by symbol.

### 3.1 The producer surface — what GR-4a left behind

| Role | File | Symbol | Required fact |
|---|---|---|---|
| The applier | `src/domain/worldPulse/treatyBreach.js` | `answerSuccessionQuestions(worldState, tick)` | Gates on `oathHolderActive` **before reading anything**; applies only `answer === 'disavow'` through `repudiateTreaty`; keeps `out` only when `applied.ok`. ⭐ Returns the **same reference** when nothing is disavowed — pinned in `tests/domain/successionQuestion.test.js`. **This is the packet's one signature change.** |
| The shell | same | `defaultAllLiveTerms(treaty, verdict, nowTick)` | Writes `complianceState`, `defaultedBy`, `defaultSeverity01`, `breachType`, `repudiatedTick`, `breachExpiresTick`, and appends `verdict.receipt` to `receipts`. ⛔ `...treaty` carries `sworn` through unchanged. **Forbidden edit.** |
| The verdicts | same | `TREATY_REPUDIATION_TYPE`, `SUCCESSION_REPUDIATION_TYPE`, `OPEN_REPUDIATION_RECEIPT`, `SUCCESSION_DISAVOWAL_RECEIPT` | The two roads already carry **distinct authored sentences**. ⛔ Do not restate either in a pool. |
| The descriptor | `src/domain/worldPulse/treatySuccession.js` | `SuccessionQuestion`, `successionQuestionsForTick` | `{ treatyKey, settlementId, otherId, npcId, cause, kind:'lineal'\|'coup_born', answer, severity01, pressure01 }`. ⭐ **`cause` and `kind` are on NO persisted field** — the in-memory descriptor is their only lossless carrier. |
| The ending | `src/domain/worldPulse/pactAmendment.js` | `PACT_ENDINGS`, `PACT_LINEAGE_ACTS` | Both already contain `disavowed_by_succession`. ✅ **No registration owed.** ⚠ `appendLineage` is called without `termIds`, so the row's `termIds` is `[]` — the ending does **not** name which clauses died. |
| The sink | `src/domain/worldPulse/peaceTerms.js` | `advanceTreaties`, its `newsEntries` array | The early return treats `newsEntries.length === 0` as part of "nothing happened", so a beat correctly forces `changed: true`. |
| The dossier | `src/domain/display/treatyDocument.js` | `treatyAgeLine`, `renderTreatiesForSettlement` | Named only to be excluded. ⚠ Architectural fence: *"imported ONLY by the lazy treaty panels … must NEVER be imported by generation or the world-pulse kernel."* ⛔ **Forbidden file** — GR-4b mints no dossier line. |

### 3.2 What is persisted — and therefore what a voice may honestly say

After a succession disavowal, **CONFIRMED** from `defaultAllLiveTerms` + `appendLineage`:

| Field | Value | Serves |
|---|---|---|
| `breachType` | `'succession_repudiation'` | the **typed action** (address law part 2) |
| `defaultedBy` | the disavowing settlement id | the **subject** |
| `parties` | both settlement ids | the **affected settlements** (part 3) |
| `defaultSeverity01` | graded, lineal vs coup-born | the grade |
| `repudiatedTick` | the breach tick | the exact-once discriminator |
| `breachExpiresTick` | max original horizon, **always `> tick`** | the shell survives the same tick's prune |
| `receipts[last]` | `SUCCESSION_DISAVOWAL_RECEIPT` | the recorded **reason** (part 4) |
| **`sworn[defaultedBy]`** | `{ npcId, name, swornTick }` | ⭐ **the FALLEN holder's NAME** — part 1's deepest reachable level |
| `lineage[last]` | `{ act, ending: 'disavowed_by_succession', tick, termIds: [] }` | the ending token |

The `sworn` read is **sound**: `isSuccessionDisavowable` requires
`stamp.settlementId === sid && stamp.npcId === fallen`, and `defaultedBy === sid`.
`swornPartiesOf` (`oathHolder.js`) is total and drops half-written stamps.

**Not persisted anywhere:** the **successor's** id or name (only `seatTransitions[].toRulerId`
— an id, on a history capped at 24), and the succession `cause`. `kind` is *invertible* from
`defaultSeverity01` — ⛔ **but that inversion is a tuning coincidence, not a contract, and
`SUCCESSION_TUNING` is owner-signed. Do not build a reader on it.**

### 3.3 ⚠ The HONOR silence, and why `reaffirmed` is excluded rather than deferred quietly

GR-4a's C3 — *"the hardest pin"* — is asserted over the treaty **LEDGER**:
`expect(ledgerJson(lit)).toBe(ledgerJson(dark))`, and *"HONOR writes nothing at all — no
breach, no ending, no key"*. **CONFIRMED by read: a news entry would not violate C3's letter**,
because `newsEntries` is a mover return value.

⛔ **But it violates the guarantee's sense, which GR-4a states in its own words:** *"A world
where every heir keeps the word is byte-identical to a world where the question was never
asked"* (`treatySuccession.js`). And it is a second behavior family: an honor beat fires on
**every** stamped treaty at **every** seat change — a volume the pacing surfaces have never
been shown, against a hard `MAX_MECHANICAL_OUTCOMES_PER_PULSE = 8` (`pulseHelpers.js`) and a
`FEED_CAP = 240`.

### 3.4 ⛔⛔ THE ANNEX DEFECT — RULED AND DISCHARGED AT THIS PROMOTION (CR-GR4B-3)

The `disavowed_by_succession` exemplar as authored slotted `{npc}` to the **HEIR** — the
sentence read *"his predecessor swore"*, which is unambiguous — **and the heir's name is
unreachable. CONFIRMED three ways:**

1. The `seatTransitions` row typedef (`npcLadderKernel.js`) carries `toRulerId` and **no
   `toRulerName`**.
2. `LadderRecord.npcs` is `Record<string, LadderStanding>` — standings keyed by id, not a name
   source.
3. ⛔ The roster is `settlement.npcs`, and `tests/domain/roadsParticipation.test.js` shells out
   `execFileSync('grep', ['-rl', '\\.npcs', 'src/domain/worldPulse', 'src/domain/spatial'])`
   asserted with **exact set equality**. A new `worldPulse` leaf carrying the dotted token —
   *even in a comment* — reds it.

⚠ **The slot could not simply be left unfilled.** `grammarLifecycleKindPools.walker.test.js`
asserts `expect(reached.size).toBe(row.pool.length)` — *"unreachable family"* — driven by a
fixed `INTERP`. A pool with an unsupplied slot is unreachable and reds.

⚠ **The same defect hit `repudiated`.** Its third variant read *"…and said {reason}."* The DM
verb records no free-text reason — `OPEN_REPUDIATION_RECEIPT` is a fixed sentence — so that
family was ineligible, dropping reachable depth to **3 against a `major` floor of 4**.

⭐ **DISCHARGED.** Under CR-GR4B-3 the chair re-slotted the disavowal exemplar's `{npc}` to the
**FALLEN HOLDER** — whose name **is** persisted — and re-authored `repudiated`'s third variant
to drop the unrecorded `{reason}`, dropping it from that pool's `SLOTS:` line too. Both edits,
plus a dated correction note at the head of the annex's `# GR-4` section, are **in this
promotion commit**. GR-4a's own landed receipt already chose that voice: *"The oath was sworn
by a hand now gone, and the seat that followed would not own it"* (`treatyBreach.js`) — it
names the hand that swore and declines to name the heir, because it could not.

⛔ **The implementer therefore reads the annex and writes NOTHING to it.** The corrected text
is what P3's mechanical extraction must reproduce; a hand transcription of the pre-correction
wording is how the corpus forks.

⚠ **One structural instruction rides with the correction, and it is load-bearing for §7's
walker row.** The dated note sits **after** the `# GR-4` heading and **before** the first
`### <kind>` heading, so it lies outside every `kindBlock` the shared reader carves
(`tests/helpers/receiptAnnex.js`: a kind block runs from its `### <kind> ` heading to the next
`^#{1,3} ` heading, and only `^\d+\. ` rows are pool members). ⛔ **The GR-4 window the
implementer adds must therefore anchor `section: '# GR-4'` / `until: '# GR-5'` and must not
introduce a second line beginning `# GR-4 ` or `# GR-5 ` anywhere in the volume** —
`anchoredOnce` throws on two matches, and that throw is the first-match hole the helper exists
to close.

### 3.5 ⛔⛔ THE REGISTRATION COST — the measurement that decides the packet's shape

**CONFIRMED** by reading `grammarNews.js`, `grammarReceiptPools.js`, `heraldRouting.js`,
`chroniclersLetter.js`, `settlementRumors.js`, `tests/lint/grammarLifecycleKindPools.walker.test.js`,
`tests/lint/kindPoolFloors.walker.test.js` and `tests/domain/impactKindWalkers.test.js`.

| Surface | A Herald **DESK** kind (`section: 'trade'`) | A **dossier** kind (`section: null`) |
|---|---|---|
| `src/domain/worldPulse/grammarReceiptPools.js` — the pool | **REQUIRED** | **REQUIRED** |
| `src/domain/worldPulse/grammarNews.js` — `GRAMMAR_KIND_REGISTRY` row | **REQUIRED** | **REQUIRED** |
| `src/domain/realm/heraldRouting.js` — `EXACT_SECTION` | **REQUIRED** | ✅ not owed |
| `src/domain/display/chroniclersLetter.js` — `KIND_SECTION` (+ `KIND_SECTION_DIVERGENCES`) | **REQUIRED** | ✅ not owed |
| `src/domain/display/settlementRumors.js` — `WHAT_PHRASES` | **REQUIRED** (`impactKindWalkers.test.js`: `expect(unphrased).toEqual([])` over **every minted impactKind**) | ⛔ **FORBIDDEN** — `grammarLifecycleKindPools.walker.test.js` asserts `WHAT_PHRASES[row.kind]` is `toBeUndefined()` for every `section === null` row |
| **Registration-only production files** | **5** | **2** |
| `tests/domain/impactKindWalkers.test.js` — `EXPECTED_VOICE` | required (a voice decision is forced; the whole treaty cohort is deliberately `null`) | not owed |
| `tests/lint/kindPoolFloors.walker.test.js` frozen numerals | `REGISTERED_KIND_COUNT` *and* `ROUTED_TOKENS` *and* both arithmetic identities | `REGISTERED_KIND_COUNT` and one identity only |
| `tests/lint/heraldRouting.walker.test.js` | auto-scan; ⛔ the beat takes **its own** `impactKind`, never `diplomacy` (`SINGLE_PRODUCER_KEYS`) | not reached |

⛔⛔ **The default budget is `at most three additional registration-only production files`
(`PACKET_STANDARD.md`). A Herald desk kind costs FIVE — and the cost is identical for one kind
or four, because it is the DESK that is expensive, not the kind.** ⇒ **This, not
`peaceTerms.js`, is the packet's binding constraint, and CR-GR4B-2 rules it with an explicit
recorded override (§4).**

### 3.6 The NEWS ADDRESS LAW — satisfiable, and what each part reads

Constitutional statement, `DESIGN_WAR_RULINGS_ARCHITECTURE.md:39-42`, inherited verbatim by
GRAMMAR at `DESIGN_FP_GRAMMAR.md:64-70`: *"Receipts carry enforcement. Every news entry carries
`id` … a full address chain, typed action, affected settlements BY NAME, and the recorded
reason."*

| Part | Source, by symbol | Verdict |
|---|---|---|
| 1. subject + chain | `defaultedBy` (settlement) → `treaty.sworn[defaultedBy].name` (the **NPC** who swore) | ✅ two real levels. ⚠ power/faction are **not** reachable from this mount without an INTERIOR read the `.npcs` census forbids — the chain is as deep as the actor is nested in the record, which is the doctrine's own qualifier |
| 2. typed action | `breachType` — a **frozen** `BREACH_TYPES` member | ✅ finite-semantics clean |
| 3. affected settlements | `treaty.parties`, by id **and** by name via `treatyOrientationOf` | ✅ the sibling beats' exact idiom |
| 4. reason | the persisted `receipts[last]` authored sentence | ✅ the `reasons[]` slot |

⚠⚠ **The `reasons` leg has NO census.** `newsAuthoringCensus.shared.mjs`'s `REQUIRED_FIELDS` is
`['id','settlementIds','severity']` only; **no walker asserts a recorded reason**, so a producer
shipping `reasons: []` passes every gate. ⛔ **A4 asserts it by hand.** And it has a live
consequence: `worldPulseFeedCuration.js`'s `isMetronomeRepeat()` de-duplicates on `impactKind`
+ `headline` + settlementIds-set + **reasons-set** within `DRIFT_REEMIT_COOLDOWN_TICKS = 6` —
**empty `reasons` makes sibling beats collide and be silently dropped.**

### 3.7 The dark path — no new gate, no new conjunction

- ⛔ **`oathHolderEnabled` is absent from `DEFAULT_SIMULATION_RULES` and from every preset**
  (`simulationRules.js`). A succession voice cannot fire in any default world because the
  **act** cannot occur there.
- The succession voice gates on **`oathHolderActive`** — the single existing strict `=== true`
  read. ⛔ **Zero new `oathHolderEnabled` string sites**, so `oathHolderDormancyFence.test.js`'s
  FENCE 4 gate-polarity census stays trivially satisfied.
- ⭐ **NO conjunction with `treatyLifecycleVoiceEnabled` — CR-GR4B-5.** Precedent, CONFIRMED:
  the treaty **signing** beat in `advanceTreaties` is pushed **ungated** while the lapse and
  detection beats are `lifecycleVoiceLit`-gated.
- ⛔⛔ **`successionQuestionsForTick` IS UNGATED BY DESIGN** (`successionQuestion.test.js` proves
  it returns a question against a dark world), and `oathHolderDormancyFence.test.js` counts
  `swornPartiesOf` calls across a full `advanceTreaties` drive with
  `expect(successionDarkReads).toBe(0)` / `expect(successionFalseReads).toBe(0)` and a lit
  non-vacuity anchor. **Any production call to the leaf that is not behind `oathHolderActive`
  reds a landed fence.** This is STOP #5, and it is the reason CR-GR4B-1 composes the beat from
  what was APPLIED rather than re-deriving at the sink.

---

## 4. Hard scope budget — AND THE RECORDED OVERRIDE (CR-GR4B-2)

| Limit | Budget | GR-4b | |
|---|---:|---:|---|
| Behavior families | 1 | 1 | ✓ |
| New persisted record families | 1 | **0** — GR-4b writes no state | ✓ |
| Named writer per changed state | 1 | **0 states written** | ✓ |
| Feature flags | 1 | **0 new, 0 new conjunctions** | ✓ |
| User-facing surfaces | 1 | 1 — the Herald/chronicle feed | ✓ |
| Direct production consumers | 2 | 1 — `treatyBreach.js` calls the new leaf | ✓ |
| New logic-bearing production leaves | 2 | 1 — `treatySuccessionVoice.js` | ✓ |
| Existing logic-bearing production files modified | 3 | 2 — `treatyBreach.js`, `peaceTerms.js` | ✓ |
| **Registration-only production files** | **3** | **5** | ⛔ **OVERRIDE — CR-GR4B-2** |
| **Handwritten files total** | **12** | **14** | ⛔ **OVERRIDE — CR-GR4B-2** |
| New/changed effective production lines | 400 | ~200 projected | ✓ |
| Each new leaf | 250 | ~120 projected | ✓ |
| Shared/hot-file delta | 15 each | `peaceTerms.js` **0**, `treatyBreach.js` ≤15 | ✓ |
| Acceptance cases | 8 | 7 (§9) | ✓ |

⛔⛔ **THE OVERRIDE, RECORDED BEFORE DISPATCH AS THE STANDARD REQUIRES.**
`PACKET_STANDARD.md` §"Default hard scope budget" opens *"Unless the packet records a smaller
or explicitly approved larger budget before dispatch"*. **CR-GR4B-2 approves exactly two rows
and no others: registration-only production files 3 → 5, and handwritten files total 12 → 14.**
Precedent: TC-3 (`+45`) and TC-3b (`+18/+15`) both landed under recorded larger budgets.

**Grounds, stated so the override is vetoable rather than assumed:**

1. **The five registration files carry no independent decision.** Each takes ONE frozen row in
   an existing table — a pool, a registry row, a routing section, a chronicler section, a
   rumor phrase. That is the estate's mechanical kind-registration protocol, which is exactly
   what the registration-only category exists to describe.
2. **The cost is per-DESK, not per-kind.** ⭐ **CR-GR4B-8 makes this ground LOAD-BEARING
   rather than merely economical:** α registers ONE kind and still pays all five files,
   because it is the DESK that is expensive. **Row 1 of the override therefore stands
   verbatim at 3 → 5.**
3. **The alternative delivers something the design did not ask for.** A `section: null` dossier
   line fits with no override, but it leaves the disavowal absent from the feed, needs its own
   annex re-class plus **one more authored variant** (the `n/a` floor is 6 against 5 authored),
   and risks `treatyLifecycleVoiceDormancyFence`'s key-growth pin.
4. **Every other row is inside budget with headroom**, including the two that GR-4a had to
   spend at cap.

⚠⚠ **THE HANDWRITTEN COUNT IS 14, AND THE DRAFT'S 13 WAS AN UNDERCOUNT — CORRECTED HERE.**
Enumerated from §7, one row per file: `treatySuccessionVoice.js`, `treatyBreach.js`,
`peaceTerms.js`, `grammarReceiptPools.js`, `grammarNews.js`, `heraldRouting.js`,
`chroniclersLetter.js`, `settlementRumors.js`, `tests/domain/treatySuccessionVoice.test.js`,
`tests/domain/successionQuestion.test.js`, `tests/lint/grammarLifecycleKindPools.walker.test.js`,
`tests/lint/kindPoolFloors.walker.test.js`, `tests/domain/impactKindWalkers.test.js`,
`tests/lint/sovereigntyLightingContract.walker.test.js`. **Fourteen.** The draft omitted the
census walker, which GR-4a counted in its own §4 (ten rows, ten files). ⛔ The override is
recorded against the **measured** number; a packet that recorded 13 and then touched 14 would
be the quiet renegotiation the standard forbids.

⭐ **RE-MEASURED AT CR-GR4B-8 AND UNCHANGED: FOURTEEN.** Dropping `repudiated` removes no
FILE — α touches the same fourteen paths and only the ROW CONTENT shrinks (one pool, one
registry row, one routing row, one chronicler pair, one phrase). **Both override rows stand
verbatim: registration-only production files 3 → 5, handwritten files total 12 → 14.**
⛔ A fifteenth file remains a STOP, and `realmVerbExecution.js` is precisely the fifteenth
that CR-GR4B-8 refused.

⛔ **A fifteenth handwritten file, a sixth registration file, a SECOND kind (⛔ CR-GR4B-8: α mints exactly ONE), a dossier line, a
persisted key, a new flag or a new stage is a STOP, not a further override.**

---

## 5. Preflight

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 32f4e520e71774a233a0f8627cffa90a31674357 HEAD   # this packet's base
git merge-base --is-ancestor a53ef7c6 HEAD                                   # GR-4a, the producer

# Substrate untouched since the verified base.
git log --oneline 32f4e520..HEAD -- \
  src/domain/worldPulse/treatyBreach.js src/domain/worldPulse/peaceTerms.js \
  src/domain/worldPulse/treatySuccession.js src/domain/worldPulse/grammarNews.js \
  src/domain/worldPulse/grammarReceiptPools.js src/domain/worldPulse/pactAmendment.js \
  src/domain/realm/heraldRouting.js src/domain/display/chroniclersLetter.js \
  src/domain/display/settlementRumors.js src/domain/worldPulse/oathHolder.js \
  docs/content/RECEIPT_POOLS_GRAMMAR.md                        # expect EMPTY

# New files absent.
test ! -e src/domain/worldPulse/treatySuccessionVoice.js
test ! -e tests/domain/treatySuccessionVoice.test.js

# Targets clean (path-scoped — foreign dirt elsewhere is RESERVED, never touched).
for f in src/domain/worldPulse/treatyBreach.js src/domain/worldPulse/peaceTerms.js \
         src/domain/worldPulse/grammarNews.js src/domain/worldPulse/grammarReceiptPools.js \
         src/domain/realm/heraldRouting.js src/domain/display/chroniclersLetter.js \
         src/domain/display/settlementRumors.js tests/domain/successionQuestion.test.js \
         tests/lint/grammarLifecycleKindPools.walker.test.js \
         tests/lint/kindPoolFloors.walker.test.js tests/domain/impactKindWalkers.test.js \
         tests/lint/sovereigntyLightingContract.walker.test.js; do
  git diff --quiet -- "$f" || echo "DIRTY: $f"
done

# Live symbols — by symbol, never by line number.
rg -n 'export function answerSuccessionQuestions' src/domain/worldPulse/treatyBreach.js
rg -n 'SUCCESSION_REPUDIATION_TYPE|SUCCESSION_DISAVOWAL_RECEIPT|OPEN_REPUDIATION_RECEIPT' src/domain/worldPulse/treatyBreach.js
rg -n 'const newsEntries = \[\]' src/domain/worldPulse/peaceTerms.js
rg -n 'GRAMMAR_KIND_REGISTRY' src/domain/worldPulse/grammarNews.js
rg -n 'REGISTERED_KIND_COUNT|ROUTED_TOKENS|REGISTRIES' tests/lint/kindPoolFloors.walker.test.js
rg -n '^### disavowed_by_succession|^### repudiated' docs/content/RECEIPT_POOLS_GRAMMAR.md
```

⛔⛔ **RE-VERIFY EVERY FIGURE BELOW AT DISPATCH. NOTHING HERE IS INHERITED.** This packet's own
base moved once already between draft and promotion, and the substrate is a live shared tree.

⛔ **AND THE FOUR MANDATORY PREFLIGHT MEASUREMENTS, all before the first edit:**

- **P1 — `peaceTerms.js` effective lines** under eslint's own `Linter` (the
  `tests/lint/sizeBaseline.test.js` method; ⛔ never `wc -l`, never a `grep` heuristic).
  **MEASURED AT THIS PROMOTION: 797 of a ceiling of 800.** ⛔ **If the post-edit count would
  reach 800, STOP.**
- **P2 — the OSR reader-shape scan**, before and after the leaf exists. The composer reads keys
  off treaty records (`sworn` entries, `lineage`, `receipts`). ⛔ **If a schema mint is
  implicated, STOP; do not mint and do not edit
  `scripts/.observed-shape-readers-baseline.json`.**
- **P3 — the annex-verbatim extraction.** Render each authored pool line from the annex's
  `# GR-4` section **mechanically** (the `grammarReceiptPools.js` header's own discipline:
  *"EXTRACTED … mechanically rather than transcribed"*) and diff against what is about to be
  written. ⛔ A hand transcription is how the corpus forks — and the two corrected lines
  (§3.4) are exactly where a transcriber's memory would reproduce the old wording.
- **P4 — the `kindPoolFloors` numerals, measured before and after.** `REGISTRIES` (must not
  move off 9), `REGISTERED_KIND_COUNT`, `ROUTED_TOKENS`, `LEGACY_UNVOICED_TOKENS`,
  `LEGACY_UNDER_FLOOR`, plus both arithmetic identities. ⛔ **Any of them moving in a direction
  P4 did not predict is a STOP.**

⛔⛔ **THE DISPATCH-TIME STOP CONDITION THIS PACKET WAS DRAFTED UNDER.** At Lane AC's last
reading a foreign lane held **uncommitted** changes to
`tests/lint/sovereigntyLightingContract.walker.test.js`. That lane landed at `32f4e520` and the
tree is clean at this promotion — but the condition is standing, not spent: **if any foreign
lane holds uncommitted test titles, or holds that walker dirty, at dispatch time, STOP and
report. A manifest reservation and a clean working file are two different facts, and the second
is the one the serialization law's rule 3 stops on.**

Any target collision or material symbol drift makes this packet `STALE`.

### 5b. Baselines

⚠ Lane AC executed **no** test, build or gate command. Rows are **AUTHOR-TIME-UNMEASURED**
unless marked MEASURED. Rows marked **MEASURED AT PROMOTION** were executed by Lane AD at
`32f4e520`.

| # | Premise | Exact command | Expected / recorded |
|---|---|---|---|
| B1 | Grammar voice + kind walkers green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/grammarLifecycleKindPools.walker.test.js tests/lint/kindPoolFloors.walker.test.js tests/domain/impactKindWalkers.test.js tests/domain/treatyLifecycleVoice.test.js` | **UNMEASURED** — exit 0 |
| B2 | Succession + treaty suites + both fences green | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/successionQuestion.test.js tests/domain/peaceTerms.test.js tests/property/oathHolderDormancyFence.test.js tests/property/treatyLifecycleVoiceDormancyFence.test.js` | **UNMEASURED** — exit 0 |
| B3 | Herald routing + news authoring green | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/heraldRouting.walker.test.js tests/lint/wizardNewsAuthoring.walker.test.js` | **UNMEASURED** — exit 0 |
| B4 | ⛔ `peaceTerms.js` effective lines | P1 | **MEASURED AT PROMOTION at `32f4e520`: 797 of 800 — three lines of headroom.** Two independent instruments agreed at the draft's base and the figure did not move. ⛔ Re-derive at preflight; never inherit |
| B5 | Typecheck posture | `npm run typecheck:ratchet`; `npm run typecheck:domain:strict` | **UNMEASURED** — exit 0 both, each named with its own config and window. ⚠ An unbaselined new file's error allowance is **ZERO** |
| B6 | ⭐ Lighting census row | read `tests/lint/sovereigntyLightingContract.walker.test.js` | **MEASURED AT PROMOTION by read of the committed file at `32f4e520`: `files: 2403, parked: 365, credited: 2038, titles: 19862, suiteTitles: 5602`.** ⚠ `titles` moved 19861 → 19862 at `32f4e520`; the draft's figure was read one commit earlier. ⛔ A named-committed-sha snapshot per serialization-law rule 4 — **re-derive all five WHOLE from the file at preflight** |
| B7 | Test-ratchet headroom | read `scripts/.test-ratchet-baseline.json` + `tests/lint/testRatchet.test.js` | **MEASURED AT PROMOTION, TWICE — the figure moved under this lane.** At `32f4e520`: 17 entries against `const CEILING = 17`, ZERO headroom. ⭐ **Re-measured at `5f687277`, which landed mid-promotion (*"The frozen census SHRINKS: 17 rows become 16, by cure not by adjustment"*): 16 entries against an UNMOVED `CEILING = 17` — one line of headroom, bought by a cure.** `uncollectedSuites` empty; the `enforcement-claims` naked-claim entry is still banked. ⛔ **That headroom is not this packet's to spend.** Land with no new baselined failure, and never raise `CEILING` |
| B8 | News-authoring ledger | read `tests/lint/.wizard-news-authoring-baseline.json` | **MEASURED AT PROMOTION: 19 entries, and NONE is in `peaceTerms.js`** — so no relocation risk from this packet's mount edit. ⛔ A new authoring site missing `id`/`settlementIds`/`severity` becomes a new row, and *"A NEW row must be fixed, never baselined"* |
| B9 | Pre-existing gate reds | committed-base run, capturing `$?` yourself | **UNMEASURED.** ⚠ The only legitimate pre-existing red to attribute is the owner-approved `generatorGoldenMaster` golden |
| B10 | OSR posture | P2 | **UNMEASURED — a MANDATORY preflight with a STOP** |

---

## 6. Exact contracts

### 6.1 The signature change — `answerSuccessionQuestions` (CR-GR4B-1)

```js
answerSuccessionQuestions(worldState, tick)
  -> { worldState: Record<string, unknown>, newsEntries: Array<Record<string, unknown>> }
```

- ⛔ **The state-identity guarantee is PRESERVED and asserted:** when nothing is disavowed the
  returned `worldState` is the **same reference** the caller passed and `newsEntries` is a
  **fresh empty array**. The landed identity pin in `tests/domain/successionQuestion.test.js`
  is **re-addressed to `.worldState`, not weakened**.
- ⛔ **A beat is composed ONLY inside the `if (applied.ok)` arm** (A5). That arm is the only
  place that knows a `repudiateTreaty` call was not refused — the voice narrates the ACT, never
  the intent.
- ⛔ **`treatyBreach.js` composes nothing itself** — it calls the leaf, and stays the ledger's
  declared rewriter.
- ⚠ **`repudiateTreaty`'s signature and return shape do not change** — WR-0c's DM lane and the
  realm-verb apply path both read it. ⛔ **CR-GR4B-8 STRIKES the second half of this bullet.**
  It read *"the `repudiated` beat is composed from its `ok` result at the same call site"*,
  and that call site is `treatyBreach.js:283`, which **always** passes `succession`, so it can
  only ever mint `succession_repudiation`. The open road's only call site is
  `realmVerbExecution.js:360`, outside the manifest. **α composes exactly one beat, inside
  `answerSuccessionQuestions`' `ok` arm.**

### 6.2 The new leaf

**Home: `src/domain/worldPulse/treatySuccessionVoice.js`. PURE.**

```js
successionDisavowalBeat(input) -> Array<Record<string, unknown>>   // 0 or 1
```

⛔ **CR-GR4B-8: `openRepudiationBeat` IS NOT BUILT.** An exported composer with no `src/`
consumer is the reader-without-a-writer shape this estate refuses, and its kind cannot be
registered ahead of a producer (head note, evidence 3). **The leaf exports ONE beat.**

- ⛔ **The name is MEASURED, not preferred.** `couplingInclusion.walker.test.js`'s
  `LAYER_PATTERNS` claims a GRAMMAR prefix set — `treaty…`, `peaceTerms…`, `peaceReasons…`,
  `peaceEngine…`, `envoy…`, `negotiation[A-Z]`, `grammar[A-Z]`, `oath[A-Z]`, `pact[A-Z]`.
  **`treatySuccessionVoice.js` is claimed; `successionVoice.js` / `breachVoice.js` /
  `disavowalVoice.js` are UNLAYERED and would red** — the exact GR-4a rename defect. All three
  escape doors are shut: `ARGUED_ROSTER_CEILING = 13` (exact, live 13) and
  `UNLAYERED_BASELINE_CEILING = 179` (exact, live 179, *"may never grow"*). ⚠ A rename during
  implementation **must move the `PACKET_MANIFEST.json` row in the same change** — `CREATE`
  spellings become existence-checked at the LANDED flip
  (`scripts/implementation-packets.mjs:466-468`).
- **Returns an ARRAY** so the caller's hook is one spread; an unresolvable record yields `[]`
  rather than a half-built entry (`treatyLapsedBeats`' declared idiom).
- **Shape mirrors the landed siblings exactly** (`treatyLifecycleVoice.js`): `id`, `kind`,
  `impactKind`, `significance`, `severity`, `score`, `tick`, `scope`, `headline` (authored),
  `summary` (the pool line), `reasons[]`, `settlementIds[]`, `settlementNames[]`, `parties[]`,
  `ending`, `familyId`, `audience`, `section`, `tags`.
- ⛔ **`id` uses `stablePart` and the `wizard_news.${tick}.${kind}.…` spelling; `impactKind` is
  the kind's OWN token — never `diplomacy`**, whose `SINGLE_PRODUCER_KEYS` walker pins it to
  the one signing beat (the trap is recorded twice in `treatyLifecycleVoice.js`).
- ⛔ **Names fail closed.** Reuse `readerName`'s rule (`treatyLifecycleVoice.js`): *"a name that
  is merely the id echoed back is not a name, and a beat rendering a slug where a town belongs
  is the fabrication the address law forbids."*
- **Purity:** no `Date`, no `Math.random`, no store, no I/O, no argument mutation.
  `grammarReceipt`'s seeded pick is the only variability, and it is keyed.
- ⛔⛔ **TWO TOKEN TRAPS, both of which convict a COMMENT:** the leaf must contain neither
  `setSpatialLedger(<x>, 'treaties',` (`oathStampTotality.walker.test.js`) nor the dotted token
  `.npcs` (`roadsParticipation.test.js`). **Reword the comment; never widen either scan.**

### 6.3 The ONE kind — its registry row (⛔ was "the two kinds"; CR-GR4B-8)

| | `disavowed_by_succession` |
|---|---|
| Annex | the `# GR-4` section, as corrected at this promotion |
| Depth authored | 5 |
| Significance | `major` (floor 4) |
| Audience | `public` |
| Desk (`section`) | `'trade'` — the treaty cohort keeps one desk |
| Chronicler section | `'courts'` with a `'trade'` divergence — the cohort's landed idiom |
| Gate | `oathHolderActive` **alone** |
| `{npc}` binds to | ⭐ **the FALLEN holder**, `treaty.sworn[defaultedBy].name` |

⛔ **`repudiated`'s row is DELETED, not deferred quietly** — see the head note. Its authored
pool stays in the annex unwired, exactly as its three GR-4d siblings do.

⚠ **`'major'` significance: three surfaces disagree, and CR-GR4B-6 rules the cure.**
`grammarKindRow`'s `@param` union is `'notable'|'routine'|'n/a'` and has **no `'major'` arm**,
though `FLOOR_BY_SIGNIFICANCE` does (`major: 4`); and `treatyLifecycleVoice.js`'s
`presentationWeight` has **no `'major'` branch** — it silently returns the notable weight —
while `envoyNews.js`'s **does**. ⇒ **Widen the `grammarNews.js` JSDoc union to include
`'major'`, and give the new leaf its OWN `presentationWeight` carrying `envoyNews.js`'s values
(`severity 0.76 / score 78`).** ⛔ Do **not** edit `treatyLifecycleVoice.js`'s helper — a GR-0
file with its own pins, on the do-not-touch list.

### 6.4 The mount — `peaceTerms.js`, and it costs ZERO net lines

The mover already holds everything the beat needs, and both edit sites are one-line-for-one-line
replacements. **Target: 0 net effective AND 0 net raw lines.**

| Site | Today | After | Δ eff | Δ raw |
|---|---|---|---:|---:|
| the `answerSuccessionQuestions` call | `let workingState = answerSuccessionQuestions(worldState, tick);` | `let { worldState: workingState, newsEntries: successionBeats } = answerSuccessionQuestions(worldState, tick);` | **0** | **0** |
| the `newsEntries` initialiser | `const newsEntries = [];` | `const newsEntries = [...successionBeats];` | **0** | **0** |
| import block | unchanged | unchanged | **0** | **0** |

**Four measured facts make the zero real, each CONFIRMED by read:**

1. The call's initializer is evaluated before the new bindings initialise, and the destructured
   source `worldState` is the **function parameter** — a different name from the new binding
   `workingState` — so there is no TDZ or shadowing conflict.
2. `workingState` is **reassigned later**, so `let` is correct and `prefer-const`'s default
   `destructuring: "any"` (report only when *every* binding is never reassigned) stays quiet.
   ⚠ **Verify at build** — this is the one line that could force a second statement, and a
   second statement spends the last of the three-line headroom.
3. The initialiser's `@type {Array<Record<string, unknown>>}` JSDoc requires a **mutable**
   array; the spread supplies one, so the later `.push(...)` calls are unaffected.
4. ⭐ **Δ raw = 0 matters independently.** `tests/lint/.wizard-news-authoring-baseline.json`
   binds its 19 rows to **path + line + column + source signature**, and its own header records
   two prior relocations caused by lines inserted *above* a site. ✅ **CONFIRMED BENIGN: none of
   the 19 rows is in `peaceTerms.js`.** The walker still binds the **new** authoring site: it
   must carry `id`, `settlementIds` and `severity` (`newsAuthoringCensus.shared.mjs`'s
   `REQUIRED_FIELDS`) or it becomes a new debt row, and the ledger's own instruction is *"A NEW
   row must be fixed, never baselined."*

⚠ **The residual the chair has priced:** after GR-4b, `peaceTerms.js` still stands at 797 with
three lines of headroom and **no baseline entry to raise** — `scripts/.size-baseline.json`
carries none for it (its entry was deleted by the war decomposition tranche), and the exact-set
arm of `sizeBaseline.test.js` means a compliant file that *gains* an entry also reds. **There
is no door here.** If GR-4c or GR-4d are expected to reach this mover, a decomposition
micro-act is owed **before** them, and it must land alone — a same-file refactor of a hot mover
carries same-seed risk.

### 6.5 Machinery the shape must respect — checked

| Constraint | Verdict |
|---|---|
| **`LAYER_PATTERNS`** | ⛔ A new leaf must carry a GRAMMAR-claimed prefix — §6.2. |
| **The 15-line shared/hot-file cap** | The operative test is **drive-by vs primary target** (CR-GR4-1). `peaceTerms.js` is a **drive-by** ⇒ the cap binds ⇒ **Δ = 0.** `treatyBreach.js` is GR-4b's **primary target**, and the packet stays ≤15 there anyway. |
| **`scripts/.size-baseline.json`** | ⛔ **Named do-not-touch.** Never add or raise an entry to finish a packet. |
| **`ledgerOwnershipManifest.js`** | ✅ **Untouched.** The voice leaf is pure; `answerSuccessionQuestions` gains a return field, not a `setSpatialLedger` call. The `treaties` writer set stays the landed five. |
| **`pulseStageManifest.js`** | ✅ **Untouched.** No new stage or substage; version stays `2`. |
| **`oathStampTotality.walker`** | ✅ Green, trap inherited — §6.2. |
| **`couplingInclusion` baseline** | ✅ **No new pair.** Every new import is GRAMMAR→GRAMMAR inside `src/domain/worldPulse/`; `src/domain/realm/` and `src/domain/display/` are outside `CENSUS_SCOPE_RE`, and the registration rows there add no import. |
| ⛔ **the `.npcs` token census** | Exact set equality over `grep -rl '\.npcs'`. ⛔ The new leaf may not contain the dotted token, **not even in a comment** — §6.2. |

---

## 7. Exact change manifest

| Action | File | Symbol / region | Max Δ | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/worldPulse/treatySuccessionVoice.js` | `successionDisavowalBeat`, a module-local `presentationWeight` (⛔ **no `openRepudiationBeat` — CR-GR4B-8**) | `120` | §6.2. **PURE.** ⛔ Contains neither `setSpatialLedger(<x>, 'treaties',` nor `.npcs`, including in comments. |
| `MODIFY` | `src/domain/worldPulse/treatyBreach.js` | `answerSuccessionQuestions`; the `repudiateTreaty` call sites | `15` | §6.1. ⛔ Beats only inside the `ok` arm. ⛔ No new exported ledger-writing symbol; the `module#symbol` writer set does not move. |
| `MODIFY` | `src/domain/worldPulse/peaceTerms.js` | the `answerSuccessionQuestions` call + the `newsEntries` initialiser | **`3`** | §6.4. ⛔ **Target 0; 800 effective lines is a STOP.** |
| `REGISTER` | `src/domain/worldPulse/grammarReceiptPools.js` | `GRAMMAR_RECEIPTS` | `20` | **ONE pool** (`disavowed_by_succession`; ⛔ was two — CR-GR4B-8), **mechanically extracted** (P3), from the CORRECTED annex text. Pure data. |
| `REGISTER` | `src/domain/worldPulse/grammarNews.js` | `GRAMMAR_KIND_REGISTRY` | `12` | **ONE** `grammarKindRow` row (⛔ was two — CR-GR4B-8), plus the `'major'` JSDoc-union widening — §6.3, CR-GR4B-6. |
| `REGISTER` | `src/domain/realm/heraldRouting.js` | `EXACT_SECTION` | `6` | **ONE row**, `'trade'` (⛔ was two — CR-GR4B-8) — the treaty cohort's desk. ⛔ Do **not** mint a new `sectionAuthority`: `wizardNews.js#normalizeEntry` allowlists only three and would strip it on persist. |
| `REGISTER` | `src/domain/display/chroniclersLetter.js` | `KIND_SECTION`, `KIND_SECTION_DIVERGENCES` | `6` | **ONE row each** (⛔ was two — CR-GR4B-8), `'courts'` with the `'trade'` divergence — the cohort's landed idiom. |
| `REGISTER` | `src/domain/display/settlementRumors.js` | `WHAT_PHRASES` | `4` | **ONE in-world phrase** (⛔ was two — CR-GR4B-8). ⛔ **Required for a desk kind; forbidden for a `section: null` kind.** |
| `CREATE` | `tests/domain/treatySuccessionVoice.test.js` | A1–A7 | `n/a` | ⚠ **Name and site it exactly as given** (§8 item 2). Straight-line registration only (§8 item 1). |
| `TEST` | `tests/domain/successionQuestion.test.js` | the two identity arms | `n/a` | Re-address to `.worldState`, **without weakening the assertion**. |
| `TEST` | `tests/lint/grammarLifecycleKindPools.walker.test.js` | `EXPECTED`, the length pin, `INTERP`, the annex `SECTION`/`UNTIL` bounds, the `GRAMMAR_HERALD_KINDS` array | `n/a` | ⭐ **EXTEND this walker; do not author a new one** — CR-GR4B-7. Add a second annex window `'# GR-4'`/`'# GR-5'`; §3.4 carries the structural constraint on that window. |
| `TEST` | `tests/lint/kindPoolFloors.walker.test.js` | `REGISTERED_KIND_COUNT`, `ROUTED_TOKENS`, both arithmetic identities | `n/a` | Re-measure WHOLE (P4). ⛔ `REGISTRIES` stays `9`. |
| `TEST` | `tests/domain/impactKindWalkers.test.js` | `EXPECTED_VOICE` | `n/a` | **ONE row** (⛔ was two — CR-GR4B-8; `EXPECTED_VOICE` is TWO-WAY EXACT, so a `repudiated` key with no minted literal reds as stale). The treaty cohort is deliberately **`null`** (unvoiced) — follow it, with the reason. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` row + a dated comment | `n/a` | Re-derive all five figures WHOLE in ONE run and re-record whole, cause stated (§8 item 3). |

**These fourteen paths are GR-4b's complete reserved change set**, and `PACKET_MANIFEST.json`
carries exactly them, spelled identically.

⛔ **`docs/content/RECEIPT_POOLS_GRAMMAR.md` is NOT an implementer row.** Its two corrected
variants and one `SLOTS:` line are in this promotion commit under CR-GR4B-3; it is a **forbidden
file** for the coding agent and appears in neither the table above nor the JSON manifest. It is
named here so the manifest is honest about the surface the packet moved.

**Named do-not-touch:** `docs/content/RECEIPT_POOLS_GRAMMAR.md`, `scripts/.size-baseline.json`,
`scripts/mutation-coverage-manifest.json`, `scripts/.test-ratchet-baseline.json`,
`scripts/.observed-shape-readers-baseline.json`,
`tests/lint/.wizard-news-authoring-baseline.json`, `tests/lint/.coupling-inclusion-baseline.json`,
`tests/lint/.coupling-unlayered-baseline.json`, `eslint.config.js`, `vite.config.js`,
`src/domain/worldPulse/pulseKernel.js`, `src/domain/worldPulse/pulseStageManifest.js`,
`src/domain/worldPulse/ledgerOwnershipManifest.js`, `src/domain/worldPulse/dispositionChannels.js`,
`src/domain/worldPulse/treatySuccession.js`, `src/domain/worldPulse/treatyLifecycleVoice.js`,
`src/domain/worldPulse/oathHolder.js`, `src/domain/worldPulse/pactAmendment.js`,
`src/domain/display/treatyDocument.js`, `src/components/**`, and every file outside the table.
Generated artifacts: `NONE`.

### 7b. Reservations and pairwise disjointness — CHECKED

**CONFIRMED** against `docs/implementation/PACKET_MANIFEST.json` at `32f4e520`:

| Reserver | Status | Overlap with GR-4b |
|---|---|---|
| **All nineteen prior packets except IA-2** | terminal | ✅ **NONE** — a terminal packet reserves nothing (`implementation-packets.mjs:43`) |
| **IA-2** | STALE | ✅ **ZERO.** ⚠ STALE still reserves twelve paths: `package.json`, `scripts/implementation-*`, `tests/scripts/*`, and four under `docs/implementation/`. None is in §7. This packet's own INDEX and manifest rows are **coordinator acts**, not implementer rows — the TC-5B precedent |

⭐ **THE CENSUS RESERVATION VERDICT: GR-4b TAKES THE WALKER.** At this promotion
`tests/lint/sovereigntyLightingContract.walker.test.js` is named by no non-terminal packet, and
the foreign lane that held it dirty landed at `32f4e520`. GR-4b therefore carries it as its own
`TEST` row and is the sole in-flight census holder for its dispatch window. ⛔ **The
census-holder rule re-applies the instant a second non-terminal packet is promoted: the chair
MOVES the row, and only one implementer is in flight across the holders.**

---

## 8. Landing discipline this manifest incurs

1. ⚠⚠ **THE PARKED-SUITE TRAP TAKES THE WHOLE FILE.** A `test(`/`it(` inside a loop is
   `TEST_UNREGISTERED` and **the whole file parks**, losing every title; a non-straight-line
   `describe` parks the same way; `.each()` parks via `TEST_TABLE_UNPROVEN`. ⇒ Register every
   case **straight-line**; loops go **inside** an `it`. ⛔ **Verify `credited` moved, not just
   `files`** — `parked + credited === files` still closes, so nothing reds.
2. ⚠ **THE MUTATION-COVERAGE NAMING TRAP, AND GR-4b DODGES IT — KEEP THE DODGE.**
   `tests/lint/mutationCoverage.shared.mjs` makes a file an invariant automatically by living in
   one of seven enforcer dirs **or** by a basename matching
   `census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin`.
   `tests/domain/treatySuccessionVoice.test.js` matches **none** and sits in `tests/domain/`. ⛔
   Do not rename it or site it under `tests/design/`. ⭐ **This is also the decisive argument in
   CR-GR4B-7 against authoring a new `*.walker.test.js`.**
3. ⭐ **THE LIGHTING CENSUS.** Re-derive **all five figures in ONE run and re-record them
   WHOLE** — never patch `files` alone. ⚠ The sequence hazard is live: while any arm is red the
   census **stops measuring**, so later arms may read anything. ⭐ Probe with a temporary
   `console.log` **inside** the existing census test, **before its first assertion**, so it
   mints no title and cannot move what it measures. ⛔ STOP on a foreign lane holding
   uncommitted test titles, on a census already red at pristine committed base from a foreign
   cause, or if the chair has not confirmed this packet is the in-flight census holder.
4. ⚠ **ANCHORED NEGATIVES, AND THE TEST RATCHET HAS NO HEADROOM.**
   `negativeAssertionAnchor.walker.test.js` gives a **new file ZERO**; the counted matchers are
   `.not.toContain(`, `.not.toMatch(`, `.not.toHaveProperty(`, and the `// anchored:` escape is
   accepted on the assertion line or the **single** line immediately above. Route every negative
   through `tests/helpers/anchoredNegatives.js`. `scripts/.test-ratchet-baseline.json` is at
   **17 of ceiling 17** — land with no new baselined failure, and never raise `CEILING`.
5. ⚠ **THE ANNEX IS RE-DERIVED ON EVERY RUN.** The kind-pool walker re-extracts every pool from
   `RECEIPT_POOLS_GRAMMAR.md` and asserts rendered-line **equality**, plus the house sentence
   mold (capitalised, terminally punctuated, digit-free, token-free) and the **first-match law**
   (every anchor matches exactly once). ⛔ Extract mechanically (P3) from the CORRECTED text.
   ⚠ **The `# GR-4` slice contains `### repudiated (WR-0c producer)`** — a widened window picks
   it up, which is intended here and is a trap for anyone who does not intend it.

**What is NOT owed, measured so nobody "helpfully" edits it:**
`tests/lint/.coupling-inclusion-baseline.json` (§6.5); `ledgerOwnershipManifest.js` (no
`setSpatialLedger` call moves); `pulseStageManifest.js` (no new stage); `narrativeTempo.js` /
`DRAMA_CLASS_REGISTRY` (⚠ that machinery throttles **spontaneity, never causality** — a
consequence beat registers nothing there); `scripts/.size-baseline.json` (⛔ **never**).

---

## 9. Acceptance matrix — the closed denominator (7 of 8)

| ID | Case | Required observation |
|---|---|---|
| **A1** | **Named historical regression — the signature change is a no-op on state** | For a world with no seat change, and for one below the disavow band, `answerSuccessionQuestions(ws, tick).worldState` **is the same reference** as `ws` (`toBe`) and `.newsEntries` is `[]`. ⭐ Plus GR-4a's C3 ledger equality re-run unchanged: `ledgerJson(lit) === ledgerJson(dark)`. |
| **A2** | **Main reachable behavior — the disavowal speaks** | Lit; a stamped treaty; a `seatTransitions` row `{fromRulerId:'n1', cause:'coup', tick: now}`; burden above the band. `advanceTreaties` returns `changed: true` and **exactly one** entry with `kind: 'disavowed_by_succession'`, its own `impactKind`, `ending: 'disavowed_by_succession'`, both party ids **and names**, the fallen holder named from `treaty.sworn`, and a non-empty `reasons[]` carrying the persisted receipt. |
| **A3** | ⭐ **THE SILENCE-HONORS NEGATIVE, EXTENDED TO THE FEED (the hardest pin)** | The same fixture **below** the band ⇒ the treaty ledger is byte-identical to the pre-tick ledger **AND `newsEntries` is empty**. ⛔ **HONOR is silent in the feed as well as in the ledger.** |
| **A4** | ⭐ **THE NEWS ADDRESS LAW, asserted part by part — because no walker asserts part 4** | On A2's entry: (1) `settlementIds`/`settlementNames` name both courts **and** the summary names the hand that swore; (2) `kind`/`impactKind` are frozen-vocabulary tokens; (3) `parties` equals `treaty.parties`; (4) `reasons[]` is **non-empty** and contains the **recorded** receipt, not an invented one. ⚠ Part 4 has no census (§3.6), and an empty `reasons` also makes sibling beats collide under `isMetronomeRepeat`. |
| **A5** | ⭐ **THE REFUSED-WRITE NEGATIVE** | Two questions resolving to `disavow` on **one** treaty in **one** tick: the second `repudiateTreaty` is refused by the `isRepudiationBreach` guard, the ledger carries **one** breach, and the feed carries **exactly one** beat. ⛔ The voice narrates the ACT, never the intent. |
| **A6** | **Dark / disabled — the dormancy fences, both** | `oathHolderEnabled` absent, and separately explicit `false`: over a fixture whose lit control **does** break, the ledger is byte-identical **and `newsEntries` is empty**; `oathHolderDormancyFence`'s `successionDarkReads` / `successionFalseReads` counters read **0** with the lit anchor above 0. ⭐ Plus the LIT-MUTANT control, so the fence is shown to be able to SEE. |
| **A7** | **Duplicate/idempotent + determinism** (⛔ **the open-road clause is STRUCK — CR-GR4B-8**) | Re-running the same tick over an already-disavowed ledger mints **nothing further** (the shell is refused by the predicate that broke it); and the beat's `familyId`/`summary` are **byte-stable across two runs at the same seed**. |

**A8 (privacy boundary) is OMITTED, not replaced.** Both kinds are `audience: 'public'` in the
annex as authored, and the disavowal is a public court act by the design's own belief posture.
⛔ **Do not add an eighth case or a speculative cross-product.**

### 9b. LIT-OUTPUT POSTURE — declared, not discovered

> **`oathHolderEnabled` dark: NOTHING MOVES, and that is an assertion** (A6). The key is absent
> from `DEFAULT_SIMULATION_RULES` and from every preset, so the succession voice's **act**
> cannot occur in any default world.
>
> ⛔ **CR-GR4B-8 WITHDRAWS THE `peaceCausalEnabled` LIT-PATH ADDITION ENTIRELY.** The
> paragraph here claimed *"a DM repudiation that minted no beat now mints one"* — its premise
> was false (it already mints a `treaty_breached` beat) and its road had no mount. **GR-4b-α
> adds NO lit-path behavior on `peaceCausalEnabled`, so the goldens on that road may not move
> at all.** ⭐ The only declared behavior addition left is the `oathHolderEnabled` one, and
> that flag is absent from `DEFAULT_SIMULATION_RULES` and from every preset.
> ⛔ **If any committed golden moves at all, that is a STOP and a report — never a re-record.**
> The implementer runs the peace/belief/rumor goldens and the dormancy golden and quotes them
> unchanged.
>
> ⚠ **Figures permitted to move, each re-recorded whole with the cause stated:** the five
> lighting-census numbers; the `kindPoolFloors` numerals P4 predicts; and
> `scripts/.test-ratchet-baseline.json`'s scope figures via `--update`. ⛔ **Everything else
> moving is a STOP.**

---

## 10. Verification commands

```sh
# B1/B2/B3 baselines — the test slot is acquired in the same chain, never observed and released.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/grammarLifecycleKindPools.walker.test.js tests/lint/kindPoolFloors.walker.test.js \
  tests/domain/impactKindWalkers.test.js tests/domain/treatyLifecycleVoice.test.js \
  tests/domain/successionQuestion.test.js tests/domain/peaceTerms.test.js \
  tests/property/oathHolderDormancyFence.test.js

# Focused behavior — A1..A7.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/treatySuccessionVoice.test.js tests/domain/successionQuestion.test.js \
  tests/domain/peaceTerms.test.js tests/property/oathHolderDormancyFence.test.js

# The walkers this packet can break — all exact-equality pins.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/grammarLifecycleKindPools.walker.test.js tests/lint/kindPoolFloors.walker.test.js \
  tests/lint/heraldRouting.walker.test.js tests/lint/wizardNewsAuthoring.walker.test.js \
  tests/lint/couplingInclusion.walker.test.js tests/lint/oathStampTotality.walker.test.js \
  tests/lint/sizeBaseline.test.js tests/domain/roadsParticipation.test.js \
  tests/domain/pulseStageContracts.test.js

npx eslint src/domain/worldPulse/treatySuccessionVoice.js \
  src/domain/worldPulse/treatyBreach.js src/domain/worldPulse/peaceTerms.js \
  src/domain/worldPulse/grammarNews.js src/domain/worldPulse/grammarReceiptPools.js \
  src/domain/realm/heraldRouting.js src/domain/display/chroniclersLetter.js \
  src/domain/display/settlementRumors.js

npm run typecheck:ratchet          # tsconfig.full.json
npm run typecheck:domain:strict    # tsconfig.domain-strict.json

# Census re-derivation (§8 item 3), then the landing gate.
npm run check:tail
```

⚠ **Never read a gate through a pipe** — `npm run check:tail`, or `sh scripts/gate-tail.sh
<command…>`; a piped read reports the PIPE's status and has greenwashed red gates twice.
`npm run check` is a **17-step `&&` chain**: a red step blacks out every later step, so the
receipt must say **which steps actually ran**. ⛔ **Trust no exit status you did not capture
yourself.**
⚠ **Budget the wall-clock:** `observedShapeReaders.walker`'s `beforeAll` is sized to **900 s**
because it measures ~264 s contended; a timeout there skips all 27 tests and then trips the
test ratchet's skip sentinel — a cascade that looks like a defect and is not.

---

## 11. Ordered coding sequence

0. Run §5 preflight in full, including P1–P4. Capture every exit status yourself.
1. Capture B1/B2/B3 baselines and B6's five census figures from the committed file.
2. Add the smallest failing focused test for A2 in `tests/domain/treatySuccessionVoice.test.js`.
3. Register the two pools in `grammarReceiptPools.js`, mechanically extracted (P3).
4. Implement the pure leaf `treatySuccessionVoice.js`.
5. Widen `answerSuccessionQuestions` to `{ worldState, newsEntries }` and compose inside the
   `ok` arm; re-address the two identity pins in `tests/domain/successionQuestion.test.js`.
6. Mount at `peaceTerms.js` — the two one-for-one replacements only. Re-run P1.
7. Add the four remaining registrations (`grammarNews.js`, `heraldRouting.js`,
   `chroniclersLetter.js`, `settlementRumors.js`) and the `'major'` union widening.
8. Extend the two walkers and `impactKindWalkers.test.js`; re-run P4 and diff against its
   prediction.
9. Complete A1–A7. Run §10's focused and walker chains.
10. Re-derive the lighting census WHOLE in one run, re-record whole with the cause stated.
11. Run `npm run check:tail` and produce the completion receipt.

⛔ **The agent does not start by changing a golden, baseline, budget, or persisted shape.**

---

## 12. Rulings and recorded decisions

### 12a. The chair's rulings — CR-GR4B-1..7, BINDING

- **CR-GR4B-1 — THE FACTORING IS SHAPE A.** Widen `answerSuccessionQuestions` to return
  `{ worldState, newsEntries }`; compose the beat in a new **GRAMMAR-claimed** leaf called from
  `treatyBreach.js`; pay for it in `peaceTerms.js` with **two one-line-for-one-line
  replacements**, for **zero net effective and zero net raw lines** (§6.4). **Rejected:** a
  second pure derivation at the sink (it narrates INTENT rather than ACT, and an ungated
  production call to `successionQuestionsForTick` reds the landed dormancy fence); a composer in
  `treatyLifecycleVoice.js` (mints the `oathHolderEnabled × treatyLifecycleVoiceEnabled`
  conjunction the budget forbids); a composer in `treatySuccession.js` (drags the prose-corpus
  closure into a pure derivation leaf, against that leaf's declared contract); a mint in
  `dispositionChannels.js` (INTERIOR layer ⇒ a new cross-layer coupling pair needing a
  `COUPLING_REGISTRY` row in the same commit, more governed surface than the zero lines buy
  back, and it loses `cause`/`kind`).
- **CR-GR4B-2 — SHAPE H, THE HERALD BEAT, WITH AN EXPLICIT PRE-DISPATCH BUDGET OVERRIDE.** Two
  rows only: registration-only production files **3 → 5**, handwritten files total **12 → 14**.
  Grounds and the enumerated file list are in §4, recorded before dispatch as the standard's
  recorded-larger-budget provision requires. **Rejected:** Shape D, the `section: null` dossier
  line (fits with no override, but leaves the disavowal absent from the feed, needs an annex
  re-class plus one more authored variant, and risks the lifecycle-voice key-growth pin); and
  splitting the two kinds across two packets (doubles every fixed cost, because the five files
  are per-desk).
- **CR-GR4B-3 — THE ANNEX CORRECTION IS A CHAIR ACT, AND IT IS DISCHARGED IN THIS COMMIT.**
  `{npc}` in the `disavowed_by_succession` exemplar is re-slotted to the **FALLEN HOLDER**, and
  `repudiated`'s third variant is re-authored to drop the unrecorded `{reason}` (and the slot
  leaves that pool's `SLOTS:` line). A dated correction note sits at the head of the annex's
  `# GR-4` section. This is the CR-GR4-5 shape. ⛔ **The implementer does not touch the annex**
  — it is a forbidden file (§7). **Rejected:** supplying the heir's name (needs a roster read
  the `.npcs` exact-set census structurally forbids a new `worldPulse` leaf); deleting the
  defective variants (reachability is asserted at `pool.length`, and `repudiated` would fall
  under its floor of 4).
- ⛔⛔ **CR-GR4B-4 — VACATED AT CR-GR4B-8 (2026-08-12).** Struck on a refuted ground: its
  producer is landed but has **no mount in this packet's fourteen paths**, and the act is
  **not mute** — it already speaks a fully-addressed `treaty_breached` beat (executed green,
  TRUE_EXIT=0). The ruling's own premise, *"it costs zero additional files"*, is false: it
  costs a fifteenth. Preserved verbatim below, struck, so the reasoning that produced it stays
  legible to a successor rather than vanishing from the record.
  ~~**CR-GR4B-4 — `repudiated` IS IN.** Its producer is landed and mute; it costs **zero
  additional files** (rows only, in the surfaces CR-GR4B-2 already opens); and it is the
  negative control proving the succession beat is keyed on the **road** rather than on "any
  broken treaty". ⚠ Its cost is the declared lit-path addition at §9b, and that is the
  substantive thing this ruling signs.~~
- **CR-GR4B-5 — `oathHolderActive` ALONE; NO CONJUNCTION.** ⛔ **CR-GR4B-8 strikes this
  ruling's second sentence** (*"The open road gates on `peaceCausalActive` alone"*) — there is
  no open road in α. The operative half stands and is the one α needs: **the succession voice
  gates on `oathHolderActive` ALONE, with no conjunction.** Grounds: the treaty **signing**
  beat is pushed ungated in
  `advanceTreaties` while the lapse and detection beats are gated, so an ungated treaty beat is
  house precedent; and a conjunction would mint the second flag the budget forbids and that
  GR-4 was refused for carrying. ⚠ **It means a world running the lifecycle voice dark still
  hears the disavowal. That is intended.**
- **CR-GR4B-6 — WIDEN THE `'major'` UNION.** Widen `grammarNews.js`'s `grammarKindRow` JSDoc
  union to include `'major'`, and give the new leaf its OWN `presentationWeight` carrying
  `envoyNews.js`'s values. ⛔ Do not edit `treatyLifecycleVoice.js`'s helper. **Rejected:**
  re-classing both kinds `notable` to dodge the widening — it contradicts the authored annex and
  understates a treaty's violent death.
- **CR-GR4B-7 — EXTEND THE GR-0 KIND-POOL WALKER; NEVER AUTHOR A NEW ONE.** Add a second annex
  window (`'# GR-4'` / `'# GR-5'`) and two `EXPECTED` rows to
  `tests/lint/grammarLifecycleKindPools.walker.test.js`. ⛔ A new `*.walker.test.js` basename
  becomes an automatic mutation-coverage invariant owing a manifest entry against a pinned exact
  `uncovered` count, and it would move `files` and `credited` on top of `titles`/`suiteTitles`.
  Extending moves the fewest figures and keeps one census over one vocabulary.

⚠ **Where the draft's seventh open question went.** Lane AC's Q7 asked whether the three
unbuildable kinds and `reaffirmed` re-file under GR-4d. **They do, and the honest-producer
refusal that sends them there is recorded** — at §-1a (the measurement), §-1b (the split),
§2.2 (excluded by name) and §12c (the forward file). It is the disposition CR-GR4B-2's scope
ruling carries rather than an eighth ruling, which keeps the chair's CR-GR4B-1..7 numbering
exact.

### 12b. Lane AC judgments the chair ADOPTS at promotion

1. **`treatySuccessionVoice.js` as the leaf name** — measured against `LAYER_PATTERNS`, not
   preferred (§6.2).
2. **Beats returned as arrays** — the caller's hook is one spread and an unresolvable record
   yields `[]`, following `treatyLapsedBeats`.
3. **A4 asserts the address law part by part by hand**, because the `reasons` leg has no census
   and a producer shipping `reasons: []` would otherwise pass every gate (§3.6).
4. **The two corrections Lane AC made to earlier recon are adopted:** a `grep`-approximated
   `peaceTerms.js` figure of ~787 is wrong (the measured figure is 797, headroom 3, not 13); and
   a claim that inserting lines in `peaceTerms.js` would relocate a news-authoring baseline row
   is wrong (none of the 19 rows is in that file — the walker binds the NEW authoring site
   instead).

⚠ **One draft figure is CORRECTED rather than adopted:** the handwritten-file total is **14**,
not 13 (§4). The draft omitted the census walker from its own enumeration.

⏳ **FABLE VALIDATION OWED** on every judgment in this section and on CR-GR4B-1..7 — this
promotion is authored below the Fable-exhaustion boundary.

### 12c. Deferred, recorded so nobody pre-empts them

| Deferred | Owner | Why it is not here |
|---|---|---|
| `succession_question_opened`, `honored_by_silence`, `succession_question_open` | **GR-4d**, then GR-4b-iii / GR-4b-ii | No producer; the authored prose would be untrue at mint time (§-1a) |
| `reaffirmed` | **GR-4b-ii**, behind GR-4d | A descriptor exists, but it is a second, noisier behavior family (§3.3) |
| The credibility charge and any credibility delta | **GR-4c** | Second writer, second flag conjunction |
| The fracture-charge dead-window re-derivation | **GR-4c's preflight** | The ES-5d lag law requires it be re-derived from pulse call order, never inherited |
| A `peaceTerms.js` decomposition micro-act | chair, before GR-4c/GR-4d if either reaches that mover | A same-file refactor of a hot mover carries same-seed risk and must land alone (§6.4) |
| ⭐ **GR-4b-β — the open road's authored line** (**RECORDED AT CR-GR4B-8 AS A PRODUCT OPTION; NOT SCHEDULED, NOT AN IMPLEMENTER ROW**) | chair / product | The act already speaks a fully-addressed `treaty_breached` beat, so a second DESK KIND would double-voice it. The honest shape, if ever wanted, is the **`treatyLapsedBeats` idiom**: register `repudiated` `section: null` and hand its authored line to the EXISTING beat's `reasons[]`, minting no second kind and taking no `WHAT_PHRASES` row (⛔ which that walker FORBIDS for a `section: null` kind). ⚠ It still needs `realmVerbExecution.js`, a fifteenth path, so it is a chartering act and not a widening of this packet |
| ~~The `tintedCallouts` census re-freeze reported at `32f4e520`~~ | ✅ **DISCHARGED at `5f687277`** | Landed mid-promotion by a sibling lane, by cure rather than by adjustment; recorded here so the row is not re-found as open (§5b B7) |

---

## 13. Recorded deviations from design and charter prose (each vetoable)

| # | Prose says | Live code says | Resolution |
|---|---|---|---|
| **D1** | GR-4b is *"four Herald/chronicle kinds plus the dossier line"*, depending on **GR-4a** (`GR-4A.md:82`) | one kind has an honest producer; three of five need a hold queue only **GR-4d** builds | **Code wins.** Split three ways; GR-4b-ii / GR-4b-iii re-file **behind GR-4d**. The charter's dependency arrow is incomplete in one direction. |
| **D2** | *"Honoring mints a small receipted beat"* (`DESIGN_FP_GRAMMAR.md:1057`) | HONOR **writes nothing at all**, held by scoring not machinery; the landed pin returns the caller's own reference | **Code wins for now.** Excluded with a stated reason (§3.3); re-filed to GR-4b-ii, where the queue makes "answered aloud" a real distinction from silence. |
| **D3** | *"Dossier round-trip: WarFaithTab shows the open question"* (`:1146`) | there is **no open question** — `treatySuccession.js`: *"Nothing is ever left 'open'"* | **Code wins.** Excluded by name; GR-4b-iii. The **defaulted** dossier voice already speaks the broken shell with no edit (GR-4a C6). |
| **D4** | the `disavowed_by_succession` exemplar named the **heir** | the heir's name is on no surface the treaty stage can read, and the roster read is structurally forbidden to a new `worldPulse` leaf | **Code wins.** ⭐ **Chair correction to the annex, DISCHARGED at this promotion — CR-GR4B-3.** The fallen holder is nameable and is the honest subject. |
| **D5** | `repudiated`'s third variant spoke `{reason}` | the DM verb records no free-text reason; the receipt is a fixed sentence | **Code wins.** Same chair pass — CR-GR4B-3. |
| **D6** | *"Casting: the fallen holder, the heir, the installing faction — all existing planes"* (`:1103`) | only the **fallen holder** is on a plane the treaty stage reads; the heir is an id, the installing faction an optional ladder-row field this leaf does not reach | **Code wins.** The casting is one name deep, and the packet says so rather than fabricating two. |
| **D7** | *"the question hold window = the actor-major hold band"* (`:1106`) | there is no hold window; GR-4d's substrate has **no per-type terminal seam** | **Deferred to GR-4d**, whose substrate is already measured (`GR-4A.md` §3.5). |
| **D9** | §7 files `KIND_SECTION_DIVERGENCES` under `src/domain/display/chroniclersLetter.js` | that table is **exported from `src/domain/realm/heraldRouting.js`**; `chroniclersLetter.js` exports `KIND_SECTION` only, and the kind-pool walker imports each from its real home | **Code wins.** The divergence row went to `heraldRouting.js` and the section row to `chroniclersLetter.js`. ⚠ **No file-count effect** — both files were already reserved, so the manifest and the override are untouched. Recorded because a successor reading §7 alone would look for the table in the wrong file. |
| **D10** | §6.2 lists the beat's fields without constraining how the kind token is spelled | ⛔ `tests/domain/impactKindWalkers.test.js` discovers minted kinds with a RAW TEXT scan, `/impactKind:\s*['"]([a-z][a-z0-9_]*)['"]/` — a kind minted through a **constant** is INVISIBLE to it | **Measured, not theorised: the leaf failed that walker until the literal went in** (it reported the new registration rows as `stale`). `kind`, `impactKind` and `ending` are therefore spelled as string LITERALS and the reason is written at the constant's declaration. ⭐ The general hazard: a constant-minted kind silently loses its `WHAT_PHRASES` + `EXPECTED_VOICE` enforcement, so it could ship with no phrase and no voice decision at all. |
| **D8** | *"through the existing pools/pacing machinery"* (`GR-4A.md:82`) | the pools machinery exists and the corpus is authored, but a desk kind costs **five** registration files, and `narrativeTempo.js` — the obvious "pacing" reading — throttles **spontaneity, never causality** and takes no consequence beat | **Corrected.** The real pacing obligation is SP-6's frequency-scaled **pool depth**, which both kinds satisfy as corrected. |

---

## 14. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` §"Mandatory STOP conditions", stop — without expanding or
repairing — when:

1. ⛔ **`peaceTerms.js` measured under eslint's own `Linter` would reach 800** effective lines
   (P1). ⛔ Never add or raise a baseline entry.
2. ⛔ **The OSR scan implicates a schema mint** (P2). Report; do not mint.
3. ⛔ **Any committed golden moves** (§9b). A premise refutation, not a re-record.
4. ⛔ **A3 fails** — an honored succession puts anything at all in the feed.
5. ⛔ **`oathHolderDormancyFence`'s `successionDarkReads` is non-zero** — a production call
   reached the ungated leaf. §3.7.
6. ⛔ **A1 fails** — `answerSuccessionQuestions` no longer returns the caller's own reference
   when nothing is disavowed.
7. ⛔ **The kind-pool walker reds on a reachability arm** — a pool carries a slot the engine
   cannot supply. The answer is a **chair correction to the annex**, never an invented value
   handed to a slot, and never an implementer edit to the annex.
8. ⛔ **`kindPoolFloors`' `REGISTRIES` moves off 9**, or any numeral moves in a direction P4 did
   not predict.
9. ⛔ **`roadsParticipation.test.js` reds** — the leaf named `.npcs`, including in a comment.
10. ⛔ **`oathStampTotality.walker` reds** — the leaf named the ledger write, including in a
    comment.
11. ⛔ **`couplingInclusion.walker` reds** — the leaf lost its GRAMMAR family, or an import
    crossed a layer. ⛔ Never edit either baseline or the ARGUED roster.
12. ⛔ **`wizardNewsAuthoring.walker` gains a new debt row** — the new authoring site is missing
    `id`, `settlementIds` or `severity`. ⛔ *"A NEW row must be fixed, never baselined"*; never
    raise the 19-row ceiling.
13. ⛔ **`tests/domain/treatySuccessionVoice.test.js` parks** — `credited` did not move with
    `files`.
14. ⛔ **A foreign lane holds uncommitted test titles at census re-record time**, or holds the
    census walker dirty at dispatch, or the chair has not confirmed this packet is the in-flight
    census holder.
15. ⛔ **A fifteenth handwritten file, a sixth registration file, a SECOND kind (⛔ CR-GR4B-8: α mints exactly ONE), a dossier line, a
    persisted key, a new flag, a new stage, a new kind registry, a PRNG draw or a clock read
    would be needed.**
16. ⛔ **A ratchet, baseline, budget, timeout or ceiling would need raising** beyond the two rows
    CR-GR4B-2 explicitly overrides.
17. ⛔ **Any edit to `docs/content/RECEIPT_POOLS_GRAMMAR.md` appears necessary.** The correction
    is discharged; a second one is a chair act and a STOP.
18. **Any packet premise here is refuted by live code. The code wins; the packet stops.**

The STOP report contains the smallest measured contradiction, the evidence, and a proposed
split. It contains **no speculative repair.**

---

## 15. What a successor needs in one paragraph

⛔⛔ **READ THE CR-GR4B-8 HEAD NOTE FIRST.** This paragraph was written for the TWO-kind
packet. **α mints exactly one kind, `disavowed_by_succession`.** Everything below about
`repudiated` is superseded: it has no mount in the fourteen reserved paths, and the open road
it calls mute already speaks a fully-addressed `treaty_breached` beat (executed green). The
per-DESK cost argument is the part that survives intact and is now load-bearing — α registers
ONE kind and still pays all FIVE registration files, so the override stands verbatim.

GR-4a gave the succession road an act; GR-4b gives it a sentence, and the two things everyone
assumes about that job are both wrong. **`peaceTerms.js` is not the problem:** it sits at 797 of
800 effective lines with no baseline entry and no door, but the voice needs **zero** net lines
there, because both edit sites — the `answerSuccessionQuestions` call and the `newsEntries`
initialiser — are one-line-for-one-line replacements, and widening that landed function's return
to `{ worldState, newsEntries }` is also the only shape that narrates the **act** rather than the
intent (a second question on one treaty in one tick is refused by the writer) and the only one a
landed dormancy fence permits (`successionQuestionsForTick` is ungated, and `successionDarkReads`
is pinned to zero, so a re-derivation at the sink reds it). **The real constraint is the
registration-file budget:** any new Herald **desk** kind costs five registration-only production
files against a budget of three — pools, registry, herald routing, chronicler section, and
`WHAT_PHRASES` — and that cost is per-desk, not per-kind, so the chair's decision was an override
(CR-GR4B-2, two rows, recorded before dispatch), not a mount. **And three fifths of the chartered
voice cannot be built at all:** `succession_question_opened`, `honored_by_silence` and the dossier
line `succession_question_open` all describe a question standing open across ticks, which GR-4a
answers inside a single expression, so their authored prose would be untrue the instant it minted
— the annex's own headline-honesty constraint forbids it, and they belong behind GR-4d. The two
traps that will bite anyone who skips the recon are that a new leaf under
`src/domain/worldPulse/` **must** carry a GRAMMAR-claimed prefix (`treatySuccessionVoice.js` is
claimed; `successionVoice.js` reds the coupling walker with all three escape doors pinned shut —
the exact defect GR-4a hit and renamed around), and that the **authored annex named a person the
engine cannot name**: `{npc}` in the exemplar was the heir, whose name is on no readable surface,
and the roster that holds it sits behind an exact-set `grep '\.npcs'` census that convicts a new
`worldPulse` leaf for the token even inside a comment. **That annex defect is already cured** —
CR-GR4B-3 re-slotted the exemplar to the fallen holder in this promotion commit, and the annex is
a forbidden file for the implementer.
