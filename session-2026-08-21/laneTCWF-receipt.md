# laneTCWF — VERIFICATION RECEIPT

**Lane:** TC-WF, OPUS COMPILE lane under `OWNER_DECISION_QUEUE.md` §291.5.
**Task:** compile the WF FAMILY PACKET PREAMBLE and its STAMPED SUBSTRATE ANNEX — the two documents
gating WF-1b's dispatch.
**Base:** `claude/composite-r4` @ `f8d978dfeb08d26d0edfd30798d9401beaf4f05c`, confirmed by
`git rev-parse f8d978df`. Every build-branch read went through `git show "<sha>:<path>"` or
`git grep <pattern> <sha> -- <paths>` against the COMMIT TREE; the working tree, which matches no
branch, was read only for the ledger-branch `docs/OWNER_DECISION_QUEUE.md`.
⚠ Confirmed at sweep end: the main worktree's `git rev-parse HEAD` is **`e60bc192`**, which is NOT
`f8d978df` — the recorded main-worktree-matches-no-branch hazard, live. **No build-branch fact in
either deliverable came from the working tree.**

**Deliverables, in this scratchpad:**
- `draft-WF-PREAMBLE.md` — 756 lines
- `draft-WF-SUBSTRATE.md` — 424 lines
- `laneTCWF-receipt.md` — this file

**Helpers (scratchpad only, not deliverables):** `laneTCWF-measure-eff.mjs`,
`laneTCWF-volume-WF.md`, `laneTCWF-WF-1A.md`, `laneTCWF-volume-copies.diff`, `laneTCWF-terms.txt`.

⛔ **THIS LANE WROTE NOTHING TO THE REPOSITORY.** No commit, no stage, no `git add`, no branch or ref
move, no worktree creation, no file created or edited under `/Users/cstokes/Desktop/settlement-engine`.
No gate, no `npm run check*`, no `gate-mutex.sh`, no vitest run. Every artifact lives in the session
scratchpad and is the chair's to land.

---

## 1 · WHAT WAS EXECUTED — CONFIRMED, with the command that produced it

Grades below use `adversarial-verify`'s definitions: **CONFIRMED** = a tool result in this session
demonstrates the claim; **PLAUSIBLE** = reasoning only.

### 1.1 The effective-line measurement (the annex's §6a table)

**CONFIRMED.** A scratchpad script imported the repo's own eslint `Linter`
(`/Users/cstokes/Desktop/settlement-engine/node_modules/eslint/lib/api.js`, eslint **10.4.0**) and
fed it source text extracted from git blobs, under
`max-lines { max: 1, skipBlankLines: true, skipComments: true }`, reading the actual count out of the
rule's own message. Thirty files in two invocations; `TRUE_EXIT=0` captured in-shell both times.

```
node <scratchpad>/laneTCWF-measure-eff.mjs f8d978df <paths…> ; echo TRUE_EXIT=$?
```

⚠ Reading the BLOB rather than a checkout is what makes these the build branch's figures rather than
the working tree's. This lane created no worktree in order to measure, deliberately: a worktree is a
git write.

Load-bearing results, all CONFIRMED:
`peaceTerms.js` **797** (⇒ 3 lines of headroom against the 800 layer ceiling — an independent
confirmation of §78 F-2's "headroom is 3 lines, not ~24") · `warTermination.js` **818** against its
frozen baseline literal **818** (zero headroom) · `pulseKernel.js` **1581** against the volume's
claimed 1580 · `warDeployment.js` **684** (⇒ 116 lines of headroom; WF-7's declared STOP is not met
at this base) · `religionState.js` **356** · `realmEvents.js` **283** · `pilgrimage.js` **41**.

### 1.2 The copy reconciliation (the annex's headline)

**CONFIRMED.**

```
git rev-parse "f8d978df:docs/DESIGN_FP_ARCH_WF.md"                    → f2e5c935… (774 lines)
git rev-parse "review-fixes-2026-07-08:docs/DESIGN_FP_ARCH_WF.md"     → 169c75e7… (846 lines)
diff <(git show "f8d978df:…") <(git show "review-fixes-2026-07-08:…")  → 141 lines, NINE hunks
```

Every hunk was read in full and each maps to a §78 cure. Saved verbatim to
`laneTCWF-volume-copies.diff`.

### 1.3 The §78 stamp and its five obligations

**CONFIRMED by transcription.** `grep -n "WF FABLE ROUND" docs/OWNER_DECISION_QUEUE.md` → line 2987;
`sed -n '2985,3120p'` produced the section, transcribed byte-for-byte into the annex. Line-break
positions preserved as read.

**Each cure's factual premise was then re-measured INDEPENDENTLY**, without opening `laneWFF-round.md`
or `laneWFF-report.md` (this lane never read them). All five reproduce — see the annex's cure table.

### 1.4 The symbol sweeps

**CONFIRMED**, roughly forty `git grep -n` / `git show | grep -n` / `git show | sed -n` reads. The
ones a WF-1b compile depends on directly:

| what | command shape | result |
|---|---|---|
| `suppressedAtTick` absence | `git grep -n suppressedAtTick f8d978df -- src` | **ZERO hits**; five `docs/**` files only |
| the three suppression writes | `git grep -n suppressed f8d978df -- …/religionState.js` | `:262`, `:277`, `:485`, each a `suppressed: true` write |
| the enclosing scopes | `git show … \| sed -n '240,300p;425,500p'` | `:262`/`:277` in `attemptEntry`; `:485` in `resolvePatronContest`'s siege-resolution loop |
| no tick in scope | same reads | `attemptEntry(state, deity, newcomerStrength, opts = {})` `:242`; `resolvePatronContest(state, rng)` `:444` |
| the caller census | `git grep -n attemptEntry\|resolvePatronContest f8d978df -- src tests scripts` | 1 `src` caller each; `scripts/audit/religion-balance.mjs` ×2; 15 test call sites |
| `pruneSuppressed` is private | `git grep -n pruneSuppressed f8d978df -- src tests` | `function pruneSuppressed` `:353` (no `export`); one call at `:312` inside `advanceShares` |
| the WF-1a landed block | `git show … \| sed -n '690,720p;755,775p;800,850p'` | `priorPatron` `:695`, `contestOwned` `:811`, the gated `recordPatronFall` `:814-829` |
| the flag manifest | `git show … simulationRules.js \| awk` | **24** keys; only `faithUnseatingEnabled` is WF's; array tail NOT alphabetical |
| the flag-domain census | `git show … coveringArrayCoverage.test.js \| grep -n` | governed 25 / ungoverned 32 / virtual 24 / union 81 / union−governed 56, sequenced |
| `LAYER_PATTERNS.FAITH` | `git show … couplingInclusion.walker.test.js \| sed -n '145,175p'` | 8 noun prefixes + WF-1a's exact-path regex; `UNLAYERED_BASELINE_CEILING = 179` `.toBe`; `ARGUED_ROSTER_CEILING = 20` `.toBe` |
| the errand registry | `git show … envoyErrandVocabulary.js \| sed -n '270,340p'` | both WF-2b rows verbatim, `personal` for pilgrims |
| the registry walker | `git show … errandConsumerRegistry.walker.test.js \| sed -n '262,425p'` | both directions + the exact `builtModules` list + the anti-vacuity arm |
| the GR-3 faith rows | `git show … peaceTermsCatalog.js \| grep -n "family: '"` | five `family:'faith'` rows at `:228/:231/:236/:240/:245`; catalog **26 terms / 13 families** |
| the tripwire | `git show … sovereigntyBundleWr10.test.js \| sed -n '330,362p'` | `toBe(true)` `:336`; grown set `['amnesty','commercial','faith','jubilee','population']` `:348` |
| the normalizer | `git show … worldState.js \| sed -n '255,290p;515,530p'` + greps | `CONDITIONAL_LEDGER_KEYS` `:439`, loop `:518`, dedicated branch `:524`, alias `:496`; migration `:259-287` |
| the module census | `git ls-tree -r --name-only f8d978df -- src \| grep` per leaf | 1 of 10 leaves, 1 of 8 flags, 1 of 6 persisted additions |
| the census tuple | `git show … sovereigntyLightingContract.walker.test.js \| grep -n` | live tuple at `:4848` (live code, not a comment ancestry row) |

### 1.5 Every anchor cited in the deliverables was re-read

**CONFIRMED.** After drafting, each line number appearing in the annex's two-anchor table and in the
preamble was re-read with `git show "<sha>:<path>" | sed -n "<n>p"`. **Seven were wrong on the first
pass and were corrected before finalizing**: `RELIGION_TUNING` (41→40), `WR10_FAMILIES_AT_LANDING`
(113→116), the two `ERRAND_CONSUMERS` row anchors (321/334→325/332), the unlayered `.toBe` arm
(1159→1160), the escaped-module arm (1135→1134), and V32's compliance-union address (122→134). The
last of those is itself a refutation now recorded in the annex.

⚠ **A ZSH TRAP THIS LANE HIT AND RECORDS FOR EVERY SUCCESSOR.** An unquoted `$SHA:src/...` in zsh is
parsed with a history modifier on the `:s` and silently mangles the ref into a different path. Two
sweeps returned EMPTY and one returned a mangled-path error before it was caught. **An empty grep
from a mangled ref reads exactly like a true zero.** Quote the whole ref: `git show "<sha>:<path>"`.

---

## 2 · WHAT IS PLAUSIBLE, NOT CONFIRMED

Everything below is reasoning from confirmed facts. It is labelled in the deliverables where it
appears, and none of it is stated as a measurement.

1. **"WF-8 is a multi-member train by arithmetic."** CONFIRMED inputs: a Herald desk kind costs five
   registration homes (CR-GR4B-2, quoted from the landed `WF-1A`); the cap on registration-only
   production files is three; the volume charters roughly twenty new kinds for WF-8. The
   *conclusion* is arithmetic on an unbuilt wave and belongs to WF-8's own compile.
2. **The predicted registration cost of each unbuilt WF leaf.** That `pilgrimSeason.js` in
   `traditions/` costs no coupling row while the same file in `worldPulse/` owes one is a CONFIRMED
   reading of `CENSUS_SCOPE_RE` and `LAYER_PATTERNS.FAITH`, but it is a PLAUSIBLE prediction about a
   file that does not exist.
3. **That WF-1b's tick threading is a two-signature change.** The signatures, the absence of a tick
   field, and the caller census are CONFIRMED. Whether the cure is a threaded parameter, a
   `suppressDeity(state, ref, tick)` helper, or a fold-side stamp is a design decision for WF-1b's
   packet, not a measurement.
4. **That the annex's denominator is 102.** The tally itself — **79 MEASURED-TRUE, 23 REFUTED, 0
   UNVERIFIABLE-AT-BASE** — was counted MECHANICALLY over the annex's graded rows rather than
   asserted, so it is CONFIRMED. What is a judgment is the DENOMINATOR: what counts as one claim
   (see RAISED-6). A different enumeration rule yields a different total without changing a single
   verdict.
5. **That the build copy's five dead premises "would mis-build four waves."** Each premise's falsity
   is CONFIRMED. The counterfactual — what a compiler would actually have produced — is inference.

---

## 3 · WHAT THIS LANE DID NOT DO, STATED AFFIRMATIVELY

- **Ran no test and no gate**, so it graded no claim about test OUTCOMES. Where the annex reports a
  pinned constant it is labelled a PINNED read under the capsule's own provenance law, not an
  executed assertion.
- **Did not re-derive raw-line figures** (a unit no instrument in the estate pins). Four volume
  claims resting only on raw lines are graded UNVERIFIABLE-AT-BASE rather than guessed at.
- **Did not open `laneWFF-round.md` or `laneWFF-report.md`.** Every §78 confirmation is independent,
  which is what makes it corroboration rather than transcription.
- **Did not grade the DISPOSITION of volume Q1 or Q4** — only their premises. Both premises
  reproduce; both dispositions are the chair's.
- **Could not locate any document titled "engine queue"** at `f8d978df` (`docs/implementation/INDEX.md`
  has no such heading) or in the ledger working tree (`docs/` holds only
  `OWNER_DECISION_QUEUE.md` and `FABLE_RETROVALIDATION_QUEUE.md`). **The §27 dispatch gate is taken
  from the dispatching brief and is NOT independently verified here** — see RAISED-10.
- **Did not verify `WF-1A`'s own landed figures** (its census tuple, its budget reconciliation).
  They were measured at `0cf18bed`, four landings back; where this lane needed one it re-measured.

---

## 4 · JUDGMENT CALLS THIS LANE MADE — each vetoable

- **J-TCWF-1: the LEDGER copy `169c75e7` is named the extraction source of record, not the build
  copy.** Chose it over the build copy because it carries the chair's own signed §78 cures and the
  build copy contradicts five of them. Say "veto" to flip it — but the flip would require some other
  answer to the divergence, and RAISED-1 is where that answer belongs.
- **J-TCWF-2: eight named refutations in §P1 rather than folding them into §P2's dispositions.**
  Chose the WC shape (a refutation register that grows) over the INT shape (a single hazard list)
  because §P7 STOP condition 16 requires a register for the next compiler to add to.
- **J-TCWF-3: measurements to the annex, laws to the preamble.** `PACKET_STANDARD` forbids per-wave
  figures in a preamble and names effective-line counts explicitly. The preamble therefore says
  "ZERO-HEADROOM-CLASS" where the annex says "797/800". A stricter reading would strip the two
  numbers the preamble does keep (the 800 layer ceiling and the frozen-baseline literal); both are
  cited as LAWS rather than budgets.
- **J-TCWF-4: the estate-wide §81.3 block is numbered §P10**, matching GR/HB/IN/INFRA/INT, with this
  file's own sections continuing at §P11/§P12. See RAISED-12.
- **J-TCWF-5: V24 is graded REFUTED, not MEASURED-TRUE-with-a-note.** `drawsPilgrims` admits a
  metropolis-grade spectacle on ANY act; the volume quotes only the act-set half as "its own bar".
  Under §1.2's no-fourth-grade rule a claim with a false component is REFUTED with its surviving
  half stated, which is what the row does.
- **J-TCWF-6: the claim denominator is 96**, enumerated over R1–R8, V1–V42, the §2 flag law, the §3
  model, the §4 wave-spec figures, the §5 seams and the §6 questions. See RAISED-6.

---

## 5 · ⛔ RAISED — every judgment-dense call the chair must make at signing

**RAISED-1 · THE COPY DIVERGENCE IS A GOVERNANCE PROBLEM, NOT JUST A CITATION ONE.**
The build branch's WF volume is the pre-cure text; the ledger branch's is cured. The preamble
resolves this by naming the ledger blob as authoritative, but that leaves a document on the build
branch — the branch where packets live and compiles run — that actively contradicts five signed
obligations. **Three doors, and the chair's call:** (a) fold the ledger copy's nine hunks into the
build copy as a docs act, so the two agree and the preamble's warning becomes historical; (b) leave
them divergent and rely on the preamble's citation law; (c) prepend a banner to the build copy
pointing at the ledger blob, which is cheap and is the shape the EP fold used. **This lane
recommends (a)**, because (b) puts the whole defence on a compiler reading a preamble header before
opening the volume, which is exactly the reading order that failed at `WF-1A`.

**RAISED-2 · THE STAMP FLIPS WF FROM THE 4-MEMBER COLUMN TO THE 8-MEMBER COLUMN, AND A LANDED PACKET
SAYS OTHERWISE.** `WF-1A`'s header states, correctly for its moment, *"Fable-round stamp:
UN-STAMPED … the family therefore sits in the 4-member column."* §78.1 accepted the stamp on
2026-08-15; `WF-1A` read the family as un-stamped because no build-branch artifact carried it. The
preamble records the supersession as an erratum. ⛔ **Member caps are the chair's, not a compile
lane's.** The chair should confirm at signing (i) that WF engine trains now cap at eight, and
(ii) whether `WF-1A` takes an erratum line or whether the preamble's supersession sentence suffices.
**This lane wrote the STAMPED line because the dispatching brief directed it; it is flagged rather
than assumed.**

**RAISED-3 · WF-1b's SCOPE MAY NOT FIT ONE MEMBER, AND THE EVIDENCE FOR THAT IS NEW.**
`WF-1A` charters WF-1b as *"`suppressedAtTick` behind its single writer, the flag-forked narrative
prune key, and the settlement extinction obituary beat."* Three CONFIRMED facts, none of them in
either copy of the volume, all push against one member:
1. the single-writer helper must route **three** sites, and **none has a tick in scope** — a
   signature change to two exported functions with one `src` caller each, one `scripts/audit/`
   caller with two call sites, and fifteen test call sites;
2. `pruneSuppressed` is **unexported**, its `KEEP` is function-local, and its only caller is
   `advanceShares` — so the flag-forked narrative key cannot be reached from the fold without
   either threading through `advanceShares` or lifting the prune out, an architectural fork;
3. the extinction beat is **one Herald desk kind = five registration homes**, which is already at
   the registration-only cap on its own.
**The chair's call: does WF-1b compile as one member, or split (e.g. WF-1b-i the stamp + the
single-writer helper; WF-1b-ii the prune key + the beat)?** This lane makes no recommendation on the
split shape — it is precisely the kind of decision `PACKET_STANDARD` reserves to a compile that has
priced it — but records that the one-member charter was written before facts 1–3 were measured.

**RAISED-4 · DOES §78 F-5 GATE WF-1b, AND ON WHICH NUMBER?**
F-5 requires a derivation home table and a chair signature under §42/§43 **BEFORE any WF band
lands**. WF-1b authors at least one candidate: the obituary's *"≥4-suppressed prune bar"* in the
volume's §4-WF-1. `FALL_RING_CAP = 3` and `KEEP = 3` are existing idioms rather than new dials, and
`WF-1A` argued exactly that for its own number. **The chair should say at signing whether the
≥4 bar is (a) a new band needing an F-5 derivation and signature, or (b) a restatement of the
existing `KEEP = 3` boundary and therefore free.** Getting this wrong in either direction is
expensive: (a)-treated-as-(b) lands an unsigned band; (b)-treated-as-(a) stalls a wave for a
signature it does not need.

**RAISED-5 · A VOLUME LAW THAT LIVE CODE REFUTES, AND IT AIMS AT WF-0's ACCEPTANCE.**
The volume's WF-0 acceptance builds a precondition pin on *"a qualifying grand observance scaleBand
≥ 3 with act ∈ {procession, offering, fair} … `pilgrimage.js:31-38`'s own bar."* The live predicate
is `scaleBand >= GRAND_SCALE_MIN && (PILGRIM_ACTS.has(act) || scaleBand >= SPECTACLE_SCALE)` —
a metropolis-grade spectacle qualifies on **any** act. ⛔ **A WF-0 negative arm shaped "wrong act ⇒
no pilgrims" is VACUOUS at scaleBand ≥ 5.** The preamble carries this as the family's fifth
pin-vacuity instance (§P2.9). **The chair should decide whether this is a volume-text correction
(docket it) or a WF-0 acceptance correction (fold into WF-0's compile).**

**RAISED-6 · THE ANNEX'S DENOMINATOR IS A CHOICE.** 102 graded rows, enumerated over the volume's
numbered rows plus its §2–§6 assertions. `DESIGN_PREVERIFICATION.md` §1.2 rule 1 says "extracted by
enumeration over the volume's text" without fixing the granularity, and EP's annex chose 131 over a
4,059-line volume while this one chose 102 over 846. **A finer rule (every sentence bearing a
substrate fact) would roughly double it without changing a verdict.** The chair may wish to fix the
granularity rule once, estate-wide, rather than per family.

**RAISED-7 · Q1 AND Q4 ARE STILL OPEN AND THE WF FAMILY SITTING IS NOW.**
§78.3 leaves Q1 (accept five authored realm arcs, Schism included) and Q4 (treat the DS-FTH corpus
as binding spelling law) open "for the WF family sitting", both recommendations validated on
measured substrate. Both premises reproduce at `f8d978df` (no realm schism arc exists; DS-FTH-3
binds the state signature verbatim). **Signing this preamble is the natural moment to rule them** —
Q4 in particular, because it converts a divergence from a silent drift into a STOP, and WF-1b is the
first wave after WF-1a to write a bound spelling.

**RAISED-8 · WHERE DOES `pilgrimSeason.js` LIVE?** `pilgrimage.js` is under `src/domain/traditions/`,
outside the coupling census's scope. A `pilgrimSeason.js` beside it costs no `LAYER_PATTERNS` row; in
`src/domain/worldPulse/` it owes an exact-path regex. **Neither copy of the volume names a
directory.** This is a real architectural choice with a registration-cost consequence, and it should
be settled before WF-2a compiles rather than at its terminal gate — which is exactly how WF-1a's
coupling row was found.

**RAISED-9 · TWO IN-TREE FIGURES ARE STALE AND NEITHER IS THIS LANE'S TO EDIT.**
(a) `scripts/.size-baseline.json`'s R-BLD-10 rationale key says `pulseKernel.js` "IS BANKED
PERMANENTLY AT ITS MEASURED 1580" while the literal beside it — and the measurement — is **1581**.
That is a chair ruling's own text. (b) `src/domain/certification/subsystemRowsBaseline.js:60`'s
`FAITH_SPREAD_OTHER` prose cites `whole-world-soak.mjs:112`, an address dead twice over (the empty
`customContent: {}` is now at `:210` and `:680`). Both are prose-only and neither reds anything
today. **The chair may docket them, fold them into WF-0's compile, or leave them; this lane records
rather than repairs.**

**RAISED-10 · THE §27 DISPATCH GATE COULD NOT BE VERIFIED.** No document titled "engine queue"
exists at `f8d978df` or in the ledger working tree's `docs/`. The brief's statement that these two
documents gate WF-1b's dispatch under engine-queue §27 is taken as given. **If §27 lives in a
chair-side scratchpad, the chair should confirm that the two drafts satisfy it as written** — in
particular whether §27 expects the annex at `docs/implementation/preverification/WF-SUBSTRATE.md`
(the EP precedent, which this draft assumes) or at some other path.

**RAISED-11 · THE CURED VOLUME COPY IS ITSELF STALE IN THREE PLACES.** Recorded so the ledger copy
does not become the next document nobody re-measures: its catalog figure says "24 terms / 11
families" (live: **26 / 13**); its grown-family set says `['commercial','faith','population']` (live
pin: **five**, `amnesty` and `jubilee` having joined at WC-0D); its `peaceTerms.js` figure of 797 is
unmoved but was re-executed here rather than inherited. **None changes a cure; all three are
docket-class prose corrections.**

**RAISED-12 · SECTION NUMBERING, MINOR.** The estate-wide §81.3 block is numbered §P10 here to match
GR/HB/IN/INFRA/INT. ⚠ **`WC-PREAMBLE.md` does not carry that block at all** — EFF-M3 amended five
preambles and WC's landed afterwards — so the WC family currently has no in-preamble stamp line,
which `PACKET_STANDARD` says is *"where a compiler reads which column it is in."* That is outside
this lane's scope and is flagged only because signing the WF preamble makes WF the second family
whose stamp line lives in its preamble and WC the only stamped family without one.

---

## 6 · WHAT LANDING THESE TWO FILES UNBLOCKS, AND WHAT IT DOES NOT

**Unblocks (CONFIRMED against `PACKET_STANDARD`'s own text):** WF gains an in-preamble stamp line,
which is *"where a compiler reads which column it is in"*; a WF compile citing the annex no longer
inherits §70.4's STOP for citing an unstamped annex; and WF-1b gains a preamble to cite by SHA-256
instead of re-deriving family law in-packet as `WF-1A` had to.

**Does not unblock:** the five §78 obligations still bind each wave individually; F-5 still gates
every band on a chair signature under §42/§43; Q1 and Q4 remain open (RAISED-7); and WF-1b's scope
question (RAISED-3) is not answered by either document — it is answered by WF-1b's own compile, once
the chair says whether one member or two.
