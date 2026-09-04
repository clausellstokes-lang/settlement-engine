# receipt-lightingscope.md — COMPLETE

**Lane LIGHTINGSCOPE · SEAT: Opus 5 — Fable-unvalidated · 2026-09-04.**
**Measurement-and-design only. No file edited, no ref written, no commit, no staging, no test command
run.** Read-only `node` inspection and `git` reads only, exactly as briefed. No subagents. No
`node_modules` materialisation. No `git stash`, `checkout`, `reset` or `clean`.

**Dock read (never written):** `$SP/laneKERNELMARK-tree` — verified `HEAD = c2f80ffc957a15ab…`,
`git status --porcelain` = **0 lines at open and at close**, 24 cars over `ca651d54b`.
**Ledger read:** `/Users/cstokes/Desktop/settlement-engine`, `review-fixes-2026-07-08`.
**Everything written by this lane lives only in** `$SC/lightingscope/`.

**Deliverables:** `doors.md` (the enumeration + the denominator) · `wave-plan.md` (blockers, consists,
predicted and refused figures) · `measure-presets.mjs` (the re-runnable denominator instrument, ~1 s,
no vitest) · this receipt.

---

## 1. THE FOUR ANSWERS, UP FRONT

| question | answer |
|---|---|
| **the measured door count vs. the claimed 31** | **31 is CORRECT as an item count** — I located its home (`$SC/pending/LIGHTING.json` `items` = 31) and re-verified all 31 at the current tip. **It is NOT a door count.** The doors number **151 total, 113 dark, of which 91 are rules doors** — executed at `c2f80ffc9`. The docket's own prose contradicts its own array twice (says "30 pending", says "7 wave cars"; the array holds 31 items and 6 cars). |
| **blockers surviving re-measurement** | **ONE of three.** The prose-car rebase survives (2 of 200 paths overlap). `{complexity}` is REFUTED as a blocker. The MAT persistence paths are REFUTED — **signed twice**. Three further docket blockers were found dead in passing (O-5, O-14, the drift door), plus O-10(b) and the prose window's gate. |
| **recommended consist order** | **0 L-PROBE (dark arm, 0 bytes) → 1 PROSE (re-ordered to the FRONT) → 2 L-HOMES → 3 L-DEFAULT → 4 L-MAT + L-DOORS + L-UI → 5 L-PROBE-2 + the 11 declarations + the registers.** SEAT-7/8 runs in PARALLEL on its own consist from day one. |
| **the single biggest risk** | **The wave has no bit-level witness and every existing golden is blind to it.** Every pulse golden drives a LITERAL rules object and `generatorGoldenMaster` is flag-blind, so the whole preset table can be lit — or silently re-darkened later — without moving one row of 525+8 instruments. `presetLightingWitness` has **0 hits at HEAD**. And the file that would fix it is a NEW test file against a known-failure census measured **FULL at 10/10**. |

---

## 2. FINDINGS, EACH LABELLED

### CONFIRMED (executed evidence, quoted)

1. **The authoritative inventory exists and is NOT in the repository.**
   `…/825f209c-…/scratchpad/LIGHTING-INVENTORY.md`, 169,776 B, 436 lines, folded 2026-09-02 04:06 ET,
   header verdict `BUILD-READY WITH CHAIR ROWS 23`, measured at `fab576aba`. Chartered on the ledger
   at §882.1; the owner's directive is `docs/OWNER_DECISION_QUEUE.md:32333` (§881.4).
2. **The dark-door denominator at `c2f80ffc9`:** 56 union preset keys (11 lit / 45 dark) + 29
   `ENGINE_GATED_VIRTUAL_RULE_KEYS` + 17 `BACKLOG_RULE_KEYS` = **102 rules doors, 91 dark**.
   Re-runnable: `node $SC/lightingscope/measure-presets.mjs <dock>`.
   ⭐ **The inventory's 91, measured two landings ago, reproduces EXACTLY.**
3. **No preset value has moved since the inventory.** `git diff fab576aba HEAD --
   src/domain/worldPulse/simulationRules.js` = **+25 lines, all comment** (the §890 O-12 supersession
   record, which explicitly holds the eight war sub-flags dark *"HERE BY THIS RECORD"* pending a lit
   successor id). **The wave has not started.**
4. **`EXEMPT_RULE_KEYS` = 4, not 3.** The fold's ⟦A2·F7⟧ correction is right; the inventory's body text
   is wrong.
5. **The known-failure census is FULL at 10/10** — `scripts/.test-ratchet-baseline.json` `entries` has
   exactly 10 records. **4 of the 10 are `tests/copy/voiceMechanics.test.js` arms.** (The live-fault
   list says the refreeze "may retire two"; **four is the ceiling**, and the actual number is not
   derivable.) Ratchet at HEAD: `totalTests=31223`, `totalFiles=2462`. OSR: `total=1993`,
   `identities=1409`. Lighting census: `2515/371/2144/22922/6153` at `450f7dbb7`.
6. **BLOCKER `{complexity}`: REFUTED as a blocker, CONFIRMED as a worse defect.** `deriveEconomicComplexity`
   (`prosperity.js:293`) emits 11 title-cased values, 5 em-dashed; `bareCommonFill` refuses all 11 by
   construction. **Executed both directions:** with a real engine value the DS-ECO-1 C1 pool renders
   **1 distinct sentence over 24 seeds**; with a conformant value it renders **3**. C1 loses **two of
   three** variants, not "a variant". No pool reaches zero ⇒ nothing is blocked.
7. **BLOCKER prose rebase: CONFIRMED and cheap.** `8f4d5c648` is based at `30c1667bc`; neither is an
   ancestor of the other; **exactly 2 of 200 paths overlap** the dock's 83 moved paths, and on both the
   prose edit is a one-line sentence cure.
8. **BLOCKER MAT persistence paths: REFUTED — SIGNED TWICE.** Ledger §882.13 (`:32362`): *"**O-11 SIGN**
   the three persistence paths (publicSafe allowlist, accountImport id-resolution, provenance
   receiptHash)"*, positioned inside "THE NINETEEN RULED" and before "⛔ THE FIVE HELD". Re-ruled
   `$SC/RULINGS-893.md` §4 **"RULED: SIGNED"**. **Zero occurrences of `O-11` after ledger line 32362**;
   the only withdrawal in RULINGS-893 is §5b and it names its own target. **The live docket
   (`LIGHTING.json`, written 2026-09-04, two days after the ledger ruling) still records O-11 as
   blocked, and L-MAT as half a car. Both rows are stale.**
9. **Three further phantom blockers, and a fourth.** O-5 (§882.13 *"LIGHTING O-5 BUILD the Remembrance
   reader"* + RULINGS-893 §3) · O-14 (§882.13 *"premium-only canonize STAYS AS DESIGNED"*) · the drift
   door (RULINGS-893 §2 charters it) · the prose window (the §6 amendment leaves **exactly two** gated
   acts: every push/deploy, and the owner's walk). **O-10(b) is both takeable and moot: the residual
   was MEASURED at ZERO** across three real builds with an identical engine content hash
   (`$SP/receipt-lighting-rows.md`), and the `+1,047 B` in the docs priced a re-export shape
   `livingContentLaw.js:79–87` records as *never taken*.
   ⇒ **Of the docket's six owner rows, ZERO still gate the wave.**
10. **Every docket "landed=NO" claim re-verified at `c2f80ffc9`** (10 probes, table in `doors.md` §E).
    `NEW_CAMPAIGN_SIMULATION_PRESET_ID`, `presetLightingWitness`, `irregularForceEnabled` and
    `generationWorker` all have **0 hits**; the three L-UI flags are all `false`; charset enforcement
    is `"report"`; **0 of 18 espionage files write a news entry**. Nothing has moved.
11. **`FLAG_DEFAULTS` = 38 flags: 27 true, 11 false** (executed).
12. **The inventory has NO git home — executed, both repositories.** `git log --all --oneline -- '*LIGHTING-INVENTORY*'` returns **0 commits** in the dock and **0 commits** in the ledger. It exists only under a session uuid that dies with the account.
13. **No state was changed by this lane.** Dock porcelain **0** and `HEAD = c2f80ffc9…` at open and at close; ledger `review-fixes-2026-07-08` at `04f6b255e` unchanged.

### PLAUSIBLE (reasoning or inherited, labelled, with the act that settles it)

- **+25 newly-discoverable OSR keys (21 class F + 4 class G).** INHERITED from the fold ⟦A5·B9⟧; not
  re-derived here. **Settled by** L-PROBE's per-parent presence dump, before any regeneration.
- **L-HOMES costs the engine 0 B.** Strongly plausible — `src/generators` imports zero
  `worldPulse`/`display`/`espionage` modules — but the transitive closure is unproven. **Settled by**
  the hashed chunk listing diff under `VERIFY_DIST`.
- **The wave lights ≈96 rules doors.** Arithmetic over a plan, not a measurement; the backlog
  contribution is a design choice not yet made.

### REFUSED FIGURES (refusing is the deliverable)

| figure | why refused |
|---|---|
| the composed lighting-census tuple at the wave's tip | ⭐ **the sum of independently-measured deltas is not the composed delta** (§891 register 1/2: four lanes summed +75 titles, the composed tree measured +78). Predict per file at the composed tip. |
| lighting `titles` / `suiteTitles` per consist | per-arm, not derivable from a car list. ⚠ the walker asserts `titles` first and throws, so **predict BOTH or the second figure is invisible**. |
| the post-prose voice em/bang totals | require running the espree instrument, which is a gate act. Direction (a FALL) is derivable; magnitude is not. |
| how many known-failure slots the voice refreeze retires | ceiling 4, floor 0; the value is measured, not derived. |
| `BACKLOG_RULE_KEYS`'s landing count | shrink-only and exact by the walker's equality arm, but the value depends on how many keys earn manifest entries this wave. |
| OSR `total`/`identities` deltas | need the corpus builder; **`--update` is FORBIDDEN on the OSR**. |
| writer-reach identity movements for the prose car | a 200-path sweep moves grades a JSX-prop read grades N — not even the direction is derivable. |
| the engine byte figure at the current build | every published figure is base-relative and two landings stale; **re-measure before L-MAT boards.** |

---

## 3. THE JUDGMENT CALLS I MADE (each vetoable by name)

1. **The prose car is re-ordered from the BACK of the wave to the FRONT (its own consist, right after
   the §891 CAS).** Two measured grounds: the voice baseline is shrink-only and already REFUSES a
   raise, while the wave is a string-adding wave; and 4 of the 10 banked known-failure slots are
   voiceMechanics arms, making that refreeze the only identified road to the census headroom DOOR 3's
   timeout needs. *Veto shape:* leave it at the back, and accept that L-HOMES's register act is
   refused on arrival and the census stays at 10/10.
2. **`{complexity}` is re-classed from BLOCKER to CONTENT CAR** and removed from the wave's dependency
   graph. *Veto shape:* keep it as a blocker and L-DEFAULT waits on a band vocabulary it does not need.
3. **L-MAT is planned as a WHOLE car** (dial + create boundary + the three persistence paths), because
   O-11 is signed. *Veto shape:* treat O-11 as unsigned and land wiring only.
4. **SEAT-7/8 is scheduled in PARALLEL from day one** rather than in sequence. It is the only item any
   source says adds DAYS, and it does not share a file with the wave. *Veto shape:* sequence it and
   let it, not the wave, set the freeze date.
5. **I did not re-open any owner-gated class.** The only two gated acts (push/deploy, the walk) are
   untouched, and the tuning signature is left where the chair left it.

---

## 4. RETROVALIDATION ROW

**Seat:** Opus 5 — Fable-unvalidated. **Act:** a read-only measurement and design pass; no repository
state changed anywhere.

| # | what I JUDGED | what a reviewer RE-DERIVES | receipts, by absolute path | priority |
|---|---|---|---|---|
| 1 | The dark-door denominator is **91 rules doors dark in the default preset** (102 exist, 11 lit), unchanged from the inventory's base | run `node $SC/lightingscope/measure-presets.mjs <dock>` at any tip; compare to the table in `doors.md` §B | `$SC/lightingscope/measure-presets.mjs` · `$SP/laneKERNELMARK-tree/src/domain/worldPulse/simulationRules.js` · `…/tests/lint/engineGatedRuleKeys.walker.test.js:118,191,789–794` | **HIGH** — every consist's scope rests on it |
| 2 | The `{complexity}` row is **not a blocker**; C1 collapses 3 → 1 | re-run the 24-seed both-arms drive in `wave-plan.md` Part 1 Blocker 1; confirm 1 vs 3 distinct sentences | `…/src/generators/economy/prosperity.js:293` · `…/src/domain/display/stateProse/economyStateProse.js` (`bareCommonFill`) · `…/tests/domain/economyStateProseDesk.test.js:358` · `…/src/data/dossierStateProse/economy.generated.js` | **HIGH** — it removes an item from the critical path |
| 3 | **O-11 is SIGNED**, and the live docket is stale | read ledger line 32362 in full and confirm `O-11 SIGN` sits before "⛔ THE FIVE HELD"; grep `O-11` after 32362 (expect zero) | `/Users/cstokes/Desktop/settlement-engine/docs/OWNER_DECISION_QUEUE.md:32362` · `$SC/RULINGS-893.md` §4 · `$SC/pending/LIGHTING.json` (`LGT-O11`, `LGT-C3-MAT`) | **HIGH** — it converts L-MAT from half a car to a whole one |
| 4 | **Zero of the six docket owner rows still gate the wave** | read §882.13's "NINETEEN RULED" list and `RULINGS-893.md` §§2,3,4,6; confirm the gated list is exactly two | same ledger line · `$SC/RULINGS-893.md` | **HIGH** — it is the difference between a wave that can be dispatched now and one waiting on the owner |
| 5 | The **prose car moves to the front** of the wave | re-run the merge-base/overlap measurement; then read the 4 voiceMechanics entries in the ratchet baseline and the `UPDATE_VOICE_BASELINE=1` refusal text | `$SP/laneKERNELMARK-tree` git reads (Blocker 2 block) · `…/scripts/.test-ratchet-baseline.json` `entries` · `$SC/RESUME-NOTE.md` heartbeat checkpoint | **HIGH** — the one ordering change against the standing plan |
| 6 | The biggest risk is the **missing bit witness**, not a byte budget | grep `presetLightingWitness` (expect 0); read the literal-rules drives in the pulse goldens named in `wave-plan.md` Consist 3 | dock git reads · `LIGHTING-INVENTORY.md` FACT 1 | **HIGH** |
| 7 | The "31" is an ITEM count whose own prose miscounts itself (says 30 items / 7 cars; the array holds 31 items / 6 cars) | `node -e` over `items` and read `status` | `$SC/pending/LIGHTING.json` | MEDIUM |
| 8 | `EXEMPT_RULE_KEYS` = 4 and `FLAG_DEFAULTS` = 38/27/11 | re-run the two parsers in §C/§D of `doors.md` | `…/tests/lint/engineGatedRuleKeys.walker.test.js:118` · `…/src/lib/flagRegistry.js:31` | MEDIUM |
| 9 | The inventory is **scratchpad-only and unreachable from git** — its loss would cost the wave its design | `git log --all -- '*LIGHTING-INVENTORY*'` and a `for-each-ref` search | `…/825f209c-…/scratchpad/LIGHTING-INVENTORY.md` | **MEDIUM-HIGH** — a preservation act is recommended and was NOT taken (writing a ref is forbidden to this lane) |
| 10 | The 2,185 dossier state-prose variants remain **on nobody's bill** | grep `stateProse`/`DS-ECO`/`DS-GEN` over the 436-line charter (expect zero) | `LIGHTING-INVENTORY.md` · `$SC/RESUME-NOTE.md` "THE GAP NO CHARTER FUNDS" | MEDIUM |

**Open, deliberately not acted on** (documented, not a bug to re-find): the inventory has no git home;
the engine byte figures are two landings stale everywhere they are published; the desk state-prose
stage is unscheduled; `$SC/pending/LIGHTING.json` carries at least five stale `blocked_by` rows and
should be regenerated rather than read as current.
