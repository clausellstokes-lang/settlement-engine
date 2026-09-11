# COMPLETENESS CRITIC — lane SOAK-HONEST-909
**Seat: Opus 5 (completeness critic) · read-only dock `$SC/laneB6` at `68c3a1618` · no vitest, no npm run, no soak run · every claim below carries the command that produced it.**

Cars read: `ec265d24c` (car 1a), `268d53605` (car 2), `d58b489b8` (car 3) — and a FOURTH the question did not name, `68c3a1618` (car 4, test bytes only). Sources: the brief, the 02:59 addendum, `$SC/receipt-soak-honest-909.md`, the four diffs, and the tree at HEAD.

## 0. WHAT THE BRIEF ASKED FOR AND THE CARS DO DELIVER (verified, not taken on trust)

| brief item | measured at `68c3a1618` | verdict |
|---|---|---|
| `demographicsEnvelope.test.js` imports the lifted constants | `git show d58b489b8 -- tests/domain/demographicsEnvelope.test.js` — imports `CAMPAIGN_HORIZON_YEARS, MOTION_FLOOR_01, MOVING_SHARE_FLOOR` from `../../scripts/audit/soakInvariants.mjs`; the three local `const` spellings deleted | **DELIVERED** |
| the registry refusal comment reads armed at §909 | `tripwires.mjs` ~:300 — "AND THE FOURTH DESIGNED ROW IS ARMED AT §909 CAR 3"; the old "STILL NOT HERE" block is gone | **DELIVERED** |
| `requires` kept on BOTH series rows | `grep -n 'requires:' scripts/soak/tripwires.mjs` → `357: ['yearlyPopulations','yearlyDiedFlags']`, `399:` same, `442:` realm path, `480:` motion path | **DELIVERED** |
| roster and registry pins moved with MEASURED figures | `node -e "import(...tripwires.mjs)"` → roster **12**, order `…capacity_realm_load, capacity_envelope_30y, tick_duration_blowout, memory_watermark`; the test pins `deterministic.length` **10**, the not-executable plant list **4**, the unreadable list **2** | **DELIVERED** |
| the archived-receipt declaration | receipt CAR-1 table + FINAL GRADE CENSUS: `research-lit-4s-300y-4s-seed1` still `fullInstrument false`, both series rows NOT-EXECUTABLE naming both fields | **DELIVERED** |
| R1 carries the schema ruling AS A CHAIR RULING | receipt R1 verdict column: "**CHAIR ruling — the owner may veto.** Not a lane refusal"; the shipped source note says the chair "WITHDREW it on that measurement" | **DELIVERED** |
| the one-line schema note in the writer's header | `whole-world-soak.mjs` :1079-1110, naming §907 M1-F1 as the cause and the additive-v5 precedent as the form | **DELIVERED** (a ~20-line block, not one line — immaterial) |
| the dotted-path `requires` + walker extension | `receiptCarries` walks segments, `[last]` form, malformed path = registry DEFECT; `tripwireFieldReach(rows, writerSource, nestedSource)` with `unreachablePaths` / `unreadable` | **DELIVERED** |
| typecheck ratchet at the composed tip | receipt: `173/173, EXIT=0` at the car-3 tip AND at the car-4 tip | **DELIVERED (reported; not re-executed here — vitest/npm barred)** |

Everything on the parent's checklist is present in some form. The gaps below are gaps of PROOF, of SCOPE, and of DECLARATION — not of missing work.

## 1. WHAT IS MISSING, OR DELIVERED DIFFERENTLY WITHOUT A RECORDED REFUSAL

### G1 · HIGH — the on-disk grade census enumerates 4 receipts and claims a scope of "every receipt on disk"
The brief (car 2) says *declare which archived receipts change grade*; the receipt's CAR-2 row is titled **"GRADE MOVEMENT over every `whole_world_soak` receipt on disk"** and then names four: the archived 300-year `research-lit-4s`, the fresh 30-year dark, the fresh 30-year lit, and `tests/fixtures/simSoakReceiptFixture.json`.

Measured: `grep -rl 'whole_world_soak' $SC --include='*.json' | grep -v simSoakReceiptFixture | wc -l` → **32**, in four directories — `capacity/artifacts/research-lit-4s.cases` (1), `lprobe-out-905/902-osr18` (7), `lprobe-out-905/903-litdefault` (7), `lprobe-out-905/904-tip-full` (7), `soak909` (10, this lane's own). The **21 §905 L-PROBE battery receipts were never graded by the lane.**

I graded all 21 at the dock HEAD (`$SC/skeptic-909/grade.mjs`, importing `laneB6/scripts/soak/tripwires.mjs`): every one returns `notExecutable=[]`, `findings=[]`, because `subsystems.rules.demographicsEnabled` is `undefined` on 18 and `false` on 3, so all four capacity rows are NOT APPLICABLE before either `requires` is read. **The lane's conclusion survives — no real receipt changes grade — but the lane did not prove it over the set its own sentence claims.**

Second half of the same gap: that census sits under **CAR 2** and grades car 2's change. **Car 3 ADDS a row with its own `requires`**, which is exactly the act that can move `fullInstrument` on an archived receipt, and no on-disk census was re-run for it — the FINAL GRADE CENSUS covers three receipts. (The archived B6 receipt does carry `motion`, so it does not move; that is luck the lane measured, not a census it took.)

### G2 · HIGH — the weak zero is still open one door along: an EMPTY top-level series grades as CARRIED
`receiptCarries` (`tripwires.mjs:97-115`) rejects a missing key and a `null` key, and rejects an empty array **only inside a `[last]` segment**. A bare-name path — which is what both series rows declare — accepts `[]`.

Executed at HEAD (`$SC/skeptic-909/empty.mjs`):

- `{demographicsEnabled:true, yearlyPopulations: [], yearlyDiedFlags: [], behavioral:{yearly:[{motion:…, realmDemography:…}]}}` → `notExecutable = []`, `findings = []`.

That receipt is graded **fully instrumented** while `capacity_plateau` and `capacity_floor_thaw` take their `pops.length < 150` / `< 100` early return and answer the exact `[]` this lane exists to refuse. The shipped comment above `receiptCarries` states "An EMPTY array is absent by the same law `null` is" — true of the nested form only. **Two `requires` forms in one registry disagree about `[]`, in a lane whose whole subject is that disagreement.** No refusal, no measurement, no deferral recorded.

### G3 · MEDIUM — this lane's own later car staled its earlier car's line cites, which is the class R5 exists to correct
`git diff 6ebe0ef3b..68c3a1618 --unified=0 | grep '^+' | grep -oE '[A-Za-z0-9_.-]+\.(mjs|js|json):[0-9]+'` → five cites added by the consist. At HEAD:

| cite, as shipped | measured at HEAD | |
|---|---|---|
| `tripwires.mjs:314,:355` (whole-world-soak.mjs:1093) | `requires:` at **357** and **399** | ⛔ wrong — and it was already wrong at `ec265d24c` (319/361 there; correct only against the parent) |
| `behavioral-observation.mjs:1202` (whole-world-soak.mjs:1106) | `soak_subsystem_configuration` at **1208** | ⛔ correct at car 1, staled by car 3's +7 lines |
| `behavioral-observation.mjs:1054` (tripwires.mjs `receiptCarries` header) | the conditional spread at **1059** | ⛔ correct at car 2, staled by car 3's own import block |
| `behavioral-observation.mjs:957` (soakInvariants.mjs:139) | the comparison now at **962** | ⚠ a historical-state cite; weakest of the four |
| `behavioralContract.js:117` / `:125` | `SOAK_RECEIPT_SCHEMA_VERSION = 5` at **117**, `SUPPORTED_… = [4,5]` at **125** | ✅ correct |

The lane corrected two inherited cites (R5) and then shipped three of its own. Nothing declares this.

### G4 · MEDIUM — car 1's Proof: line is permanently false and the receipt does not say the durable record was left false
R8 records the mis-attribution (an alphabetically-ordered `grep -h` over the log set) and corrects the RECEIPT table. It does not say that `ec265d24c`'s **commit message** still reads `tripwireCaller 4/4, soakRegister 6/6, curveBandFreeze 10/10, demographicsEnvelope 9/9` against the lane's own per-file logs (10, 8, 4, 6), nor why no amend was taken. Amending is a chair call (it rewrites three later cars), but the **decision not to amend, and the fact that the immutable record is false, are undeclared**.

### G5 · MEDIUM — a third constant was lifted beyond the charter, and the lift left an unguarded twin
The brief chartered `MOVING_SHARE_FLOOR` and `MOTION_FLOOR_01`. Car 3 also lifted **`CAMPAIGN_HORIZON_YEARS = 30`** (`soakInvariants.mjs:163`), whose own comment concedes it is the same figure as `CERTIFICATION_HORIZONS.useful.years` — verified at `behavioralContract.js:129` = **30** — and calls it "a stated twin, not a silent one".

Measured: `grep -rn 'useful.years' --include='*.js' --include='*.mjs' tests scripts` returns **no equality assertion anywhere** (one unrelated hit at `behavioralCertificationContract.test.js:720`), and `tests/soak-harness/soakInvariants.test.js` carries **no arm at all** for any of the three new constants. A lift whose stated justification is ONE SPELLING left a two-home figure with nothing that reds when they drift. Declared in the commit message and the CAR-3 table; **in no retrovalidation row**.

### G6 · LOW/MEDIUM — "five pinned fixtures" is now a durable figure in product source, unmeasured
The claim rides in `whole-world-soak.mjs`'s schema note and in R1. The CODE-VS-MESSAGE skeptic measured 17 files pinning `schemaVersion: 5`. The lane inherited the figure from the predecessor and did not re-derive it, while re-deriving everything around it.

### G7 · LOW — the fixture declaration is incomplete
R10 declares `researchReceipt()`'s realm reading; R13 declares the register fixture's derived `motion` block. Car 3 ALSO planted `motion: { populationTransitions: 4, populationMoved: 4 }` into `tripwireRegistry.test.js`'s passing-corner receipt and into the plant at :324 — **typed, not derived**, unlike R13's — declared only in the commit message, in no receipt row. The brief's law is that a moved fixture is declared IN THE RECEIPT.

### G8 · LOW — an owed proof is recorded in a table cell, not as a deferral
`capacity_plateau` has never been proved against a **shipped** 300-row series — only against one rebuilt from `behavioral.yearly[].stateVectors[].population` (CAR-1 table: "a shipped 300-row series would need a fresh 300-year lit run, ~25 min, not in this lane's charter"). The receipt has no deferral ledger; the item is findable only by rereading a cell. The estate's own law is that an owed proof is a red until it runs.

### G9 · LOW — `fullInstrument: true` on a run where four designed rows never executed
R3 names the mechanism honestly (the `gate` is read before `requires`, so a dark run's `notExecutable: []` is a gate fact) and stops there. The fresh 30-year DARK receipt therefore certifies as the FULL instrument with all four capacity rows NOT APPLICABLE — and **car 3 widened that set from three rows to four**. Not something the brief asked to close; also not recorded as a deferral or an owner-visible open row.

### G10 · scope note — there are FOUR cars, not three
`68c3a1618` (test bytes only) is chartered by the chair's own whole-suite red rather than by the brief. It is declared at the top of the receipt and in R15. Flagged only so the landing note counts four.

## 2. EVERY JUDGMENT THE CHAIR MUST RULE ON, WITH MY VIEW

### Recorded by the lane (R1–R16)

| row | the judgment | my view |
|---|---|---|
| **R1** | the 5 → 6 schema bump withdrawn; the series ships additive on v5 | **RATIFY.** Already the chair's own ruling, correctly re-recorded as one. The measurement stands: the constant's home is outside this lane's charter, and the `requires` channel gives the freeze door a reading a version integer cannot. ⚠ but see G2 — the positive channel it rests on does not refuse an empty series, so the ruling's premise is true of missing fields and false of empty ones. |
| **R2** | the schema note went in as directed | **RATIFY.** Verified in the tree. |
| **R3** | ⛔ a DEFAULT 30-year soak cannot prove the acceptance line; a second LIT run was taken | **RATIFY — this is the lane's best act.** It refused a green that would have been a gate fact wearing an instrument's name, and paid for a second soak to get the real one. |
| **R4** | ⛔ the brief's "~80 s" is wrong; measured 2 m 34 s / 2 m 14 s | **RATIFY.** Cheap, correct, and the kind of correction the chair's future briefs should absorb. |
| **R5** | two inherited comment defects corrected | **RATIFY the correction, REOPEN the class.** See G3: the same lane shipped three fresh stale cites in the same consist. |
| **R6** | the two rows' own headers stop claiming a cured blindness | **RATIFY.** A source comment asserting a live defect that is cured is the exact false-report class this lane exists to close. |
| **R7** | no `--write`, no tuning move, no golden, no push, no stash | **RATIFY.** Porcelain 0 and the consist parents check out. |
| **R8** | ⚠ the lane's own six suite counts were false, caught and corrected | **RATIFY the catch; ORDER a follow-on.** The receipt is fixed and the commit message is not (G4). The chair should either amend the consist (it rewrites three shas) or, better, record the correction in the landing note and leave the shas alone — my view is **record, do not amend**: rewriting three cars to fix a Proof line trades a bad figure for four moved shas, and the estate's own hazard says an amend after a register is taken orphans it. |
| **R9** | the reachability identity RESTATED rather than deleted | **RATIFY.** The equality was a coincidence of one writer; the subset law plus a both-writers-blinded totality control is strictly stronger than what it replaced. |
| **R10** | a synthetic fixture corrected to the writer's shape, declared | **RATIFY.** The reading planted sits inside the row's band on both clauses, so it adds an instrument and not a green, and `realmReading:false` keeps the refusal provable. |
| **R11** | `capacity_envelope_30y` GATED on `demographicsEnabled` | **RATIFY, with the cost on the record.** The reasoning (the bar's derivation home runs the demographic kernel) is a real argument, not symmetry, and the measured cost today is zero (the dark share is 0.70, far above the 0.05 bar). But it means a dark world's population term is graded by nothing, and the reversal is one line. If the chair wants the wider net, ask for it explicitly; do not let the gate become invisible. |
| **R12** | a zero denominator is a FINDING, not a silence | **RATIFY, emphatically.** This is the lane's own lesson applied to its own new row, and the false-red risk was measured away (4 transitions per year on both real receipts, 0 rows at zero in 300 years). |
| **R13** | the register fixture gained a DERIVED `motion` block | **RATIFY the register fixture; QUERY the registry plants.** The register fixture's block is computed from its own series at the observer's own floor — nothing typed. The `tripwireRegistry.test.js` plants (G7) are typed constants and are not declared in the receipt. |
| **R14** | `instrumentComplete` KEPT against its own note | **RATIFY.** The note was written before anyone knew a synthetic pre-§909 shape would still be needed to prove the mint door refuses a blind instrument. Deleting the helper would have left that arm with no subject. |
| **R15** | seven bare negatives anchored; each anchor chosen by measurement and broken to prove it can fail | **RATIFY, and note it as the strongest verification act in the consist.** The `motionRenamedForControl` reasoning is real: a rename LENGTHENS the source, so the existing length check was satisfied by the deletion alone and a dead rename regex would have left the negative silently true. The 7-of-7 negative control with the file restored `diff`-clean is the receipt this class needs. |
| **R16** | ⛔ the dispatched gate command was refused by the mutex; `--maxWorkers=2` added | **RATIFY.** Verified: `gate-mutex.sh:34-39` refuses an uncapped shared run by design, `SHARED_MAX_WORKERS` defaults to 2 at `:118`. Adding the cap is compliance with the tier, not a downgrade of it. |

### NOT recorded, and therefore not yet vetoable

| # | the judgment the lane made silently | my view |
|---|---|---|
| **J1** | **`CAMPAIGN_HORIZON_YEARS` was lifted beyond the brief's charter**, creating a stated-but-unguarded twin of `CERTIFICATION_HORIZONS.useful.years` (G5) | **RATIFY the lift, ORDER the guard.** The lift genuinely removes a spelling from the envelope suite. But "a stated twin" with no test asserting the two are equal is exactly the shape that drifts. One assertion in `soakInvariants.test.js` closes it, and the same arm should pin the two new bars. |
| **J2** | **the empty-array asymmetry between the two `requires` forms** was shipped with a comment claiming they agree (G2) | **REOPEN.** Either make the bare-name form reject `[]` (my preference: an empty series carried no evidence, which is the nested form's own stated law) or amend the comment to say the bare form does not. As it stands the honesty channel this consist rests on has a hole with a comment over it. |
| **J3** | **the census's scope sentence was written wider than the census taken** (G1) | **ACCEPT the conclusion, correct the sentence.** I graded the missing 21 and none move; the fix is one measured line, not a re-run. |
| **J4** | **no deferral ledger** — the 300-year shipped-series proof and the dark-run `fullInstrument` question live in table cells (G8, G9) | **ORDER both onto the docket.** The 300-year shipped-series proof is the only thing standing between this consist and a CONFIRMED cure of §907 M1-F1 at the horizon the row actually grades. |
| **J5** | **`home:` on the new row still points at the test file** while the bar now lives in `soakInvariants.mjs` (the home string says so in prose, and the test asserts only that it contains "demographicsEnvelope") | **MINOR — accept.** The prose carries the truth; the estate's "a charter's home is a hypothesis" hazard argues for pinning the real home, but nothing is wrong today. |

## 3. THE ONE-LINE VERDICT
The consist delivers every item the brief and the addendum name, with unusually strong verification (the caused-zero controls, the same-seed byte-identity proof of the lift, the 7-of-7 broken-anchor control). What it does not deliver is **proof at the scope its own sentences claim** (G1), **a `requires` channel that refuses an empty series as well as a missing one** (G2), and **declaration of three things it decided quietly** (G3, G4, G5). None of these is a reason to reject a car; all three are reasons the landing note must say more than the receipt does.
