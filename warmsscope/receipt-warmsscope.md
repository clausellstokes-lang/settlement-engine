# RECEIPT — lane WARMSSCOPE
⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧ · 2026-09-04 · Seat: Opus 5.
**STATUS: COMPLETE.** Measurement-and-design only. **Zero edits, zero commits, zero staged files, zero
refs written.** No `npm run check`, no `npm run build`, no full suite, no subagents, no node_modules
materialisation. No `vitest` run proved unnecessary (every figure came from committed blobs).

Product base (READ-ONLY): `.../58f0a8e2.../scratchpad/laneKERNELMARK-tree` @ **`f537ce47e`**, porcelain
**0** at first read. Every product figure below was read with `git show HEAD:<path>` or
`git ls-tree`/`git grep HEAD`, so a sibling lane's dirty tree cannot have contaminated it.
Ledger (READ-ONLY): `/Users/cstokes/Desktop/settlement-engine` @ `review-fixes-2026-07-08` = `88be66ab8`.

---

## 1 · WHAT I WAS SENT TO FIND, AND WHAT IT IS

W-ARMS was the one of the owner's seven remaining blocks nobody had looked at, believed to be "roughly
9 items". I found its authoritative home, read all 558 lines, re-measured 20 of its point-in-time
figures, re-read every recorded blocker's clause text, and checked every item against the two hard
limits.

**The authoritative home — CONFIRMED:**
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad/DESIGN_W_ARMS.md`
· 55,812 B · 558 lines · md5 `58e1e8dc6f9aebe55b3eeed7758524b2` · sections 0–9.

⛔ **It is in NO git ref on EITHER branch.** `git log --all --oneline -- '*DESIGN_W_ARMS*'` → empty;
absent from `git ls-tree -r --name-only master` and from `ls-tree -r HEAD`. The ledger's own record
(ODQ §880.5): *"**W-ARMS-DESIGN COMPLETE:** `DESIGN_W_ARMS.md` (55.8 KB, §§0–9, 74 CONFIRMED / 6
PLAUSIBLE)."* The full quoted denotation of "W-ARMS" is in `items.md` §0 — it is a CAPABILITY plus a
**two-part** named bill (design note **and** skeptic pass) plus 2–3 cars, under a standing veto.

## 2 · THE DENOMINATOR — 14, NOT 9

The claimed 9 is **derivable, not invented**: `$SC/pending/RECONCILED.json` stage **H** holds H1…H6 and
its `owner_gated` array holds three further W-ARMS rows (Car 3, Car 4, and the veto+taste rows as ONE
row). 6+3 = 9. `$SC/pending/WARMS.json` independently lists **10** (it splits the veto from the eleven
taste rows). Both are honest counts of what was scoped.

**MEASURED: 14 items. 0 done. 14 remain.** The 9/10 undercount by omitting the **four
landing-register acts** that the design's own §7 "Landing sequence" paragraph names as obligations of
the gate — the lighting refreeze, the DECLARED UI shift record, the §713.2 comparator + fence, and the
size/hash build. They are work, they are owed, and no prior scoping listed them as items.

Of the 5 build cars, **Car 4 is explicitly "not in this landing"**, so the landable build is **4 cars**.
Full table with per-item classification: `items.md` §3.

## 3 · THE UNWIRED-BUT-AUTHORED CHECK — the shape that bit four times tonight

**In the product code: ZERO instances. CONFIRMED.**
`git ls-tree -r --name-only HEAD | grep -iE "ornament/arms|armsKinship|HouseArmsBlock|CADENCY"` →
**empty**. `src/design/organic/ornament/` holds exactly `compose.js · emblemPaths.js · fnv.js ·
palette.js · pools.js` — no `arms.js`. `src/domain/display/` holds 103 files — no `armsKinship.js`.
§879.11 measured *"ZERO heraldry code"* at its tip and that is still true. **Nothing was half-built.**

**At the DOCUMENT layer: ONE HARD INSTANCE — and it is the block's own charter.**
A ruling was made (§728.1 ratification → §879.11 R2 charter → §880.5 slot ruling), the content was
authored (55,812 B, collected as COMPLETE in the ODQ), and **the wiring step — committing it to any git
ref — was never taken.** This is **instance five of tonight's pattern**, at the document layer rather
than the pool layer, and every other item in the block depends on it.

**ONE SOFT INSTANCE.** §879.11's bill named ONE slot with TWO halves: *"a short Fable design note **+
skeptic pass**"*. The note half landed and was collected. The skeptic half was never taken and **no row
anywhere records the omission.** Same shape: a ruling made, half the named act performed.

**Total: 2 (1 hard + 1 soft), both at the document layer, zero in code.**

## 4 · THE RE-MEASUREMENT — 20 figures, read at `f537ce47e`

The design labels itself 74 CONFIRMED / 6 PLAUSIBLE **measured at `60255ca8e`**. Twelve landings have
since gone down. Verdicts:

### HELD EXACTLY (10) — figure and line number both
| # | design claim | verdict |
|---|---|---|
| 1 | `public/map/charges/` = **104** files, **279,799 B**, all CC0 | ✅ EXACT (`ls-tree` count 104; byte sum 279799) |
| 2 | `DossierHeaderRow.jsx:55` renders `emblem(settlement.name \|\| 'settlement', { mode: 'field', size: 38 })` into an `aria-hidden` span via `dangerouslySetInnerHTML` | ✅ EXACT, line and text |
| 3 | `Cover.jsx:319` `<HouseCountersealSeal seed={settlement.name} size={14} />` | ✅ EXACT, line and text |
| 4 | `lineageClaim.js:124` `export function parentRefOf(item)` | ✅ EXACT |
| 5 | `hegemony.js:56` `export const SUBORDINATING_TERM_TYPES = Object.freeze([` | ✅ EXACT |
| 6 | `treatyOrientation.js:120` `export function treatyOrientationOf(treaty)` | ✅ EXACT |
| 7 | `spatialLedgerAccess.js:78` `export function getSpatialLedger(worldState, key)` | ✅ EXACT |
| 8 | `vite.config.js:31` `function computeEngineSharedDomain()`; excisions `.delete()`d AFTER derivation (`:223`) | ✅ EXACT; and `EAGER_FIRST_PAINT_MODULES` is exported at `:309` |
| 9 | `customContentCompile.test.js:116` lists `'heraldry'` as UNSUPPORTED | ✅ EXACT line |
| 10 | `goldenViewModel` `.snap` is **17 lines**; `goldenViewModel.test.js` is **94 lines** | ✅ BOTH EXACT |

### HELD IN SUBSTANCE, LINE/PATH DECAYED (7)
| # | design claim | measured |
|---|---|---|
| 11 | `SettlementCard.jsx:144` — 16 px medallion | `src/components/settlements/SettlementCard.jsx:160` — `emblem(s.name \|\| 'settlement', { mode: 'light', size: 16 })`. Path and line both moved; substance identical |
| 12 | `settlement.schema.js:229` "never mutate" | now `:231` (`:196` `SettlementParentRef` is EXACT) |
| 13 | `shippedAssetLicence.test.js:311` "only CC0 charges may ship" | now `:324` |
| 14 | `viewModel.js` = **917** lines, ZERO emblem/counterseal/parentRef/hegemony mentions | **924** lines (+7); the zero-mention claim ✅ re-measured at **0** |
| 15 | `tests/pdf/` = **42** files | **43** (+1) |
| 16 | `mechanismLitCoverage` denominator is flat `src/domain/worldPulse/*.js` | ✅ CONFIRMED verbatim (*"every flat *.js under src/domain/worldPulse … ~156 today"*), but the file is `tests/property/mechanismLitCoverage.test.js`, not `tests/lint/` |
| 17 | `parentRef on settlement` banked at rows `:911,:1295,:2172,:2179` | ✅ CONFIRMED as **exactly four files** (`settlementParentRef.js` 2, `lineageClaim.js` 1, `campaignPulseHelpers.js` 1, `campaignWorldPulseDeferred.js` 1); the line numbers are decayed |

### REFUTED (3)
| # | design claim | verdict |
|---|---|---|
| 18 | *"20 rows in `parityContract.js`"* (`SHARED_FIELDS`) | ⛔ **REFUTED — 11 `canonPath` rows** inside `SHARED_FIELDS` at `f537ce47e`. **IMMATERIAL:** W-ARMS adds no row, and the `.snap` byte-identity claim stands on its own |
| 19 | *"`src/design` has ZERO imports from `src/domain` … one comment mention only"* | ✅ substance CONFIRMED (exactly one hit, `src/design/townMapStyles.js:19`, a comment) — recorded here because a successor grepping will see a hit and must not read it as an edge |
| 20 | ⛔⛔ *"The T13 first-paint closure sits at **1,047,205 B** against a RAW ceiling of 1,047,000 — **205 B OVER**, the owner's open re-ask"* | ⛔⛔ **MATERIALLY REFUTED.** §883 records the T13 composed tip *"268 bytes **under** the ceiling nobody raised"*; `HANDOFF_CURRENT.md:39` and `:235` record *"**288 B under** the UNRAISED 1,047,000"*. **The tree is UNDER, not over.** The design's §3.1/§6/§8.2 all rest on this. **The conclusion it draws (W-ARMS must add 0 B) is unchanged and still right; its stated ground is stale, and a builder would price a live ceiling breach that does not exist.** ⛔ **I REFUSE to name the current closure figure** — it needs a build this lane may not run |

**Also re-measured, as fresh bases for the plan:** ornament samples **16** committed; lighting census
**files 2515 · parked 371 · credited 2144 · titles 22922 · suiteTitles 6153** (`measuredAtSha
450f7dbb7`, §891 landing, 2026-09-04); OSR baseline **total 1993 · identities 1409 · inventory 388
files · schema 15 · frozen 2026-09-03 at `ffe0dbb81``; `.domain-any-baseline.json` **total 2211** (any
2173 + suppress 38); `negativeAssertionAnchor` `SCAN_ROOTS = ['tests']`; `postureNameCollision` walks
`src/domain`; `couplingInclusion` `LAYER_PATTERNS` polices `worldPulse|spatial` only (design's
"3 of 4 censuses" claim ✅ CONFIRMED); `git grep "domain/display" HEAD -- src/generators` → **0**.

## 5 · THE BLOCKERS

**6 recorded. 3 survived. 2 REFUTED. 1 resolved from UNKNOWN.** Clause text, evidence and verdicts:
`warms-plan.md` §1.1. Headlines:

- **H1 "Car 0 blocked by the freeze" — REFUTED.** Car 0 is read-only with zero product bytes and not
  one of its five probes reads a freeze register; probe (2) is explicitly *"no build needed"* and
  `EAGER_FIRST_PAINT_MODULES` is exported at `vite.config.js:309` today. **Car 0 can run tonight.**
- **H5 "re-measure blocked by the freeze" — REFUTED as stated.** A re-measure needs A base, not THE
  freeze; this lane did 20 of them with no freeze in existence.
- **H6 "skeptic pass — UNKNOWN" — RESOLVED: NOT RUN, CONFIRMED** on a four-way negative (§879.11 names
  it; §880.5 records only the note; no ODQ row pairs W-ARMS with a skeptic; the design lane's own two
  `PLANS-SKEPTIC*` reports have zero "arms" hits, and `L3-arms.log`/`L3-final-arms.log` are **LIGHTING**
  lane logs from `laneL2-tree` — a name collision that would otherwise read as a skeptic receipt).
  ⚠ The volume's §8 five-lens refutation is **self-administered** and does not discharge it.
- **H4 "commit the volume, blocked by nothing" — CONFIRMED and re-measured CHEAPER.** The volume carries
  **ZERO** `enforcement-claims.test.js` `CLAIM_RE` hits (all eight alternates tested, rc=1) — which
  matters because that arm is a banked known-failure at **ceiling 6 with zero headroom**. No docs test
  freezes a docs/*.md count.
- **5 UNRECORDED blockers found** (`warms-plan.md` §1.2): UB-1 the census-full no-red-may-land rule the
  design predates; UB-2 the new test file landing inside `negativeAssertionAnchor`'s two-sided trap;
  UB-3 `armsKinship.js` taking **three** simultaneous zero ceilings, not one; UB-4 W-ARMS being NAMED in
  the FRQ's recurring-by-construction register defect (`FABLE_RETROVALIDATION_QUEUE.md:2280`); UB-5 the
  stale first-paint premise above.

## 6 · THE TWO HARD LIMITS

**All seven zero-headroom measures CONFIRMED EXACTLY as the brief states.** They are the
`magnitude.ceiling` values of the known-failure census's four voice rows plus the two typecheck totals —
JSX `em 34` / `bang 0` / `files 15`; Tier-2 `em 382` / `files 69` / `bang 9` / `total 770`;
domain-strict `1121`; full-typecheck `173`. Sources and the full collision table: `warms-plan.md` §2.

⚠ **ONE CORRECTION TO THE BRIEF'S FRAMING, and it changes the answer.** The brief says a new test file
reds three censuses and asks which items need census headroom. Measured: `totalTests` and `totalFiles`
in `scripts/.test-ratchet-baseline.json` are **scope-COLLAPSE floors** (`check-test-ratchet.mjs:1118`,
`:1138`, at `SCOPE_FLOOR_RATIO`), not exact ceilings — **so a new test file does NOT breach the
known-failure census.** The three censuses a new test file reds are the tree-scanner family (lighting,
`negativeAssertionAnchor`, `postureNameCollision`), all refreezable at a landing.
⇒ **NO W-ARMS item needs census headroom.** What the full census actually imposes is
**every car lands green or does not land** (UB-1), which is a stricter rule, not a slot shortage.

**Voice-arm collisions: Cars 2 and 3 only, and both by EXPOSURE rather than by content.** Car 1 is
**clear by placement** — `arms.js`, `pools.js` and `emblemPaths.js` are all `src/design/organic/ornament/`,
outside the `src/data`+`src/domain` walk (`voiceMechanics.test.js:165-166`). Comments are excluded
(the test's own positive control at `:363-374`), so docblocks are safe; only string literals count.

⭐ **THE SHARPEST FINDING, AND IT IS INVISIBLE IN THE DESIGN.** `blazonText(arms)` — the one prose-shaped
export in the whole design, producing *"Azure, a tower Or on a plate, a chief Argent; quarterly with
Gules, a sheaf Argent"* — is placed in **`arms.js` (`src/design/`)**, outside the Tier-2 walk. **Had it
gone into `armsKinship.js` (`src/domain/display/`), as the rejected "one file" alternative (iii) of §3.1
would have done, its punctuation would sit inside a ratchet at 382/382 and 770/770 with zero headroom.**
The two-file layer split is load-bearing for a reason the design never states — it was chosen on the
layer wall and the census bill, and it happens to also clear the voice arms. Worth recording before
anyone "simplifies" it back to one file.

## 7 · THE ORDER

**W0-1 commit the volume → W0-2 the skeptic pass → W0-3 Car 0's probes — all three NOW, in parallel
with the rest of the arc at zero critical-path cost (H1/H5 refuted, so none waits on the freeze) —
then after the GOLDEN freeze: W1-1 leaf → W1-2 adapter+web seam (the one new test file, the build, the
UI-shift record) → W1-3 the PDF seam LAST so the paid surface stays separately vetoable.**
Cars, registers and predicted figures: `warms-plan.md` §3.

W0-1 goes first because the volume is the charter for all five cars, exists in exactly one scratchpad
directory, moves **no register at all**, and **survives the owner's veto as a record** — everything
else in this block is recoverable; that file is not.

## 8 · WHAT I REFUSED TO NAME, AND WHY

Refusing is required, not a gap. Each of these is derivable only by an act this lane may not perform:
1. **First-paint closure and eager-chunk hashes at the boarding base** — needs a build. The design's own
   figure is materially wrong (§4 #20), so quoting it forward would propagate a false premise.
2. **§713.2's 525/525 goldens and fence 21/21** — quoted by §879.11 and the design; I located no
   comparator by name at `f537ce47e` and **could not re-derive either count**. Chair-owned at the
   landing. ⚠ These are the two most-quoted W-ARMS figures and neither is currently re-derived.
3. **Lighting `credited` 2144 → ?** — I did not read the credit rule, so I cannot say whether one new
   test file earns credit. `files` 2515 → 2516 and `parked` 371 → 371 **are** derived.
4. **Lighting `titles` / `suiteTitles`** — a function of describes/its nobody has authored.
5. **The ornament sample total** — 16 committed is measured; the design's "~24 new" is its own estimate,
   not a measurement.
6. **`EAGER_FIRST_PAINT_MODULES`'s size and the esbuild stub's bytes** — these ARE Car 0's probes; naming
   them would be inventing the answer the probe exists to produce.
7. **Whether any car's authored code introduces an em dash** — a property of code nobody has written.
   The correct control is named instead: a `grep -n '—'` arm on every touched `src/data`, `src/domain`
   and `src/**/*.jsx` file, in each car's own STOP list.
8. **A skeptic's finding count.**

---

## RETROVALIDATION ROW

**What I judged (all vetoable):**
1. **The real denominator is 14, not 9 or 10** — the prior scopings are honest counts of what was
   scoped, but the four landing-register acts named by the design's own §7 are unenumerated work.
2. **H1 and H5's recorded "blocked by the freeze" are PHANTOMS** — the zero-byte half of W-ARMS is
   landable tonight, off the critical path.
3. **H6 is CONFIRMED NOT RUN**, on absence-of-evidence across four independent surfaces; and **the
   volume's own §8 does not discharge it** because it is self-administered.
4. **NO W-ARMS item needs census headroom** — a correction to the brief's premise, grounded in
   `totalTests`/`totalFiles` being collapse floors rather than ceilings.
5. **W0-1 (committing the volume) should go first**, ahead even of the skeptic pass, because it moves no
   register, is measured clean of `CLAIM_RE`, and survives the owner's veto.
6. **The two-file layer split is load-bearing for an unstated third reason** (it keeps `blazonText`
   outside the Tier-2 voice arm) — recorded so a later simplification does not undo it blindly.
7. **The design's first-paint premise is materially REFUTED** and must be corrected in the volume before
   or at the commit that wires it, or the correction rides silently.

**What a reviewer re-derives, and how:**
- Every §4 figure: `git show f537ce47e:<path>` in `laneKERNELMARK-tree`. Twenty rows, ten exact, seven
  decayed, three refuted.
- The seven zero-headroom ceilings: `git show HEAD:scripts/.test-ratchet-baseline.json` → the four voice
  entries' `magnitude[].ceiling`; plus `.domain-strict-baseline.json` `total` and
  `.full-typecheck-baseline.json` `total`.
- The census-floor correction: `check-test-ratchet.mjs:1118` and `:1138`.
- The `CLAIM_RE` clean bill: `grep -E` the eight alternates of `enforcement-claims.test.js:40` over
  `DESIGN_W_ARMS.md` → rc=1.
- The zero-code claim: `git ls-tree -r --name-only HEAD | grep -iE "ornament/arms|armsKinship|HouseArmsBlock|CADENCY"` → empty.
- The four OSR `parentRef on settlement` rows: `git show HEAD:scripts/.observed-shape-readers-baseline.json`, `inventory` key.
- H6's negative: the four surfaces named in `warms-plan.md` §1.1.

**Receipts by path (all absolute):**
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/warmsscope/receipt-warmsscope.md` (this file)
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/warmsscope/items.md`
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/warmsscope/warms-plan.md`
- THE VOLUME (⛔ in no git ref): `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad/DESIGN_W_ARMS.md`
- Prior scopings: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/pending/WARMS.json` · `.../pending/RECONCILED.json` (stage H)
- Charter clauses: `/Users/cstokes/Desktop/settlement-engine/docs/OWNER_DECISION_QUEUE.md:32312` (§879.11 R2) and `:32323` (§880.5)
- The recurring register defect naming W-ARMS: `/Users/cstokes/Desktop/settlement-engine/docs/FABLE_RETROVALIDATION_QUEUE.md:2280`

**Priority:**
1. ⛔⛔ **HIGHEST — W0-1, commit the volume.** 55,812 B of charter for five cars in one scratchpad
   directory, zero registers moved, measured clean, survives the veto. This is the single cheapest
   high-consequence act in the block and it has no blocker at all.
2. ⛔ **HIGH — correct the first-paint premise (§4 #20)** in the same act or immediately after. A stale
   figure gets refused by a gate; a stale *ground sentence* gets believed.
3. **HIGH — W0-2, the skeptic pass.** An unmet term of the charter's own bill, and building past it is
   building past a named obligation.
4. **MEDIUM — W0-3, Car 0's probes**, now and again at the boarding base; carry §5's OSR pre-measurement
   so the probe does not re-find it, and make it distinguish "unbanked because unread" from "unbanked
   because unclassified".
5. **MEDIUM — put §9.1 and §9.3 on the owner's desk flagged as the only two of eleven that would move a
   landed golden family.** The other nine are cost-free either way.
6. **DEFERRED, DOCUMENTED, NOT A BUG TO RE-FIND — §713.2's 525/525 and fence 21/21 are unverified at
   `f537ce47e`.** Both are quoted by the charter and the design; neither was re-derived tonight. Owed at
   the landing, chair-owned.

---
**CLOSE-OUT (04:18).** Product tree porcelain moved 0 → 1 during this lane's run:
` M src/domain/worldPulse/warReceiptPools.js` — the SIBLING lane wiring the eight annex families into
`WAR_RECEIPTS` per `$SC/RULINGS-893-CENSUS-HEADROOM.md` §2. **Not this lane's** (this lane wrote
nothing anywhere but its own scratch dir), and it cannot have contaminated any figure above: every
product measurement was taken with `git show HEAD:<path>` / `git ls-tree HEAD` / `git grep HEAD`
against the committed tree, never the worktree. Ledger HEAD unmoved at `88be66ab8`; product HEAD
unmoved at `f537ce47e`.
