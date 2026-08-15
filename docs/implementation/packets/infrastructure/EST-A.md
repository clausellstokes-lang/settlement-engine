# INFRA / EST-A — the F6 source contract is anchored to its own boundary

**Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` at SHA-256
`c4e3f531ba585ef6d033ac3deb3b88ece5648c527c6ef7f46020ef0156de38ce`.

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `a6fd63952ad15624548f775ce18c24ad099ce3ff`
- **Train:** `est-1`, member **1 of 3** (E-2 in the `OWNER_DECISION_QUEUE.md` §56 charter's
  lettering). Member order `EST-A → EST-B → EST-C` is SIGNED at §60.3, and **staged
  promotion is LAW for this train**: all three members re-record the lighting census, so
  all three reserve that change path and only one may stand non-terminal at a time.
- **Authority:** `OWNER_DECISION_QUEUE.md` §56.1 (E-2) as corrected and re-derived at §60,
  which signs the corrected E-2 — *"a boundary anchor, not a wider number; burns a FOURTH
  banked row the charter missed; both XSS negatives hold; the blind branch enters the
  scan."* Compile evidence: `laneTC15-report.md` §F-2 and `laneTC15-PACKET-EST-A.md`.
- **Code of record:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`,
  branch `claude/composite-r4`. `git status --porcelain` was **empty** at the read.
- **Capsule:** `docs/implementation/BASE_STATE.json`, `stampedAt` `24c61190`. **The
  consumption law's docs-only clause is satisfied and EXECUTED:**
  `git diff --name-only 24c61190 a6fd6395` returns four paths, **all under
  `docs/implementation/`**. This packet cites four capsule rows and re-executes every row
  its own manifest touches.
- **⚠ THE COMPILE'S ABSOLUTE TUPLES ARE BASE-BOUND AND WERE RE-DERIVED, NOT INHERITED.**
  Lane TC15 compiled at `fc8451c4`; **two landings have moved the tree since** (INT-3B →
  IN-1C-A). §60.4 makes the per-file DELTA table the durable product. §-1 below carries this
  lane's own re-derivation at `a6fd6395`: three absolute figures moved, **every delta held,
  and one premise of a sibling member was refuted** (recorded in `EST-B.md`, not here).

---

## §-1 · THE RE-DERIVATION AT THIS BASE — EXECUTED, NOT TRANSCRIBED

| Figure | TC15 at `fc8451c4` | **re-derived at `a6fd6395`** | How |
|---|---|---|---|
| Lighting census | `2429/366/2063/20115/5654` | **`2431/366/2065/20131/5656`** | the walker's own CENSUS literal, read at this base; equals the capsule row |
| Runtime tests | 28138 | **28154** | capsule `runtimeTests`, itself transcribed from the IN-1C-A landing's executed receipt |
| Frozen known failures | 16 | **16** | `scripts/.test-ratchet-baseline.json` — 16 entries, unmoved |
| `validate:packets` | 45 packets / 0 READY | **47 packets / 0 READY** | capsule row; re-executed live at P1 |
| **This member's subject files** | — | **BYTE-IDENTICAL** | `git diff fc8451c4 a6fd6395 --` over `mapSnapshotImport.contract.test.js`, `galleryImportMap.js` and `.test-ratchet-baseline.json`: **no change on any of the three** |

⭐ **Because all three subject files are byte-identical across that window, every measured
quantity in §2 and §6 reproduces exactly.** They were still re-executed at this base rather
than inherited — §6 is this lane's own run, not a quotation.

## §1 · What this member does, in one sentence

`tests/security/mapSnapshotImport.contract.test.js` stops slicing the campaign-import action
with a hard `start + 6000` and anchors on the impl's own closing brace, which (a) repairs a
banked security guard whose recorded cause is **statically false**, (b) puts the impl's last
**1,718** characters — including the only branch that touches the untrusted shared snapshot —
back inside the XSS negative, and (c) adds the truncation control that would have caught it.

## §2 · The contradiction this member resolves — MEASURED at `a6fd6395`

Reproducing the test's own reader (`readFileSync(…,'utf-8')` → JS string → `indexOf`/`slice`
on UTF-16 units):

| Quantity | Measured |
|---|---:|
| `SRC.length` | 14,859 |
| `SRC.indexOf('importGalleryMapWithCampaignImpl')` | 7,141 |
| seed carry `mapState.seed = sharedMap.seed ?? null;` | abs **13,347**, line **381** |
| **its offset into the body** | **6,206** |
| the window in the file today | **6,000** |
| unscanned impl tail | **1,718** |
| `sharedMap.fmgSnapshot` branch | abs **13,264**, line **379** — past the window |

⛔ **The banked row's cause is flatly wrong.** `scripts/.test-ratchet-baseline.json` entry
15 says *"The import no longer carries the safe `seed` field through"*. It does carry it, at
line 381, and the test's own regex `/mapState\.seed\s*=\s*(backdrop|sharedMap)\.seed/`
**matches that line**. The test never sees it. **Code right, pin wrong** — the recorded
hand-keyed-address rot class, and a burn-down lane dispatched on this attribution would hunt
a product defect that does not exist.

⛔⛔ **The security half is worse than the bookkeeping half.** The XSS negative in the same
`describe` shares the truncated window, so the **one branch in the campaign import that
handles `sharedMap.fmgSnapshot`** — the untrusted cross-user blob this whole file exists to
guard — sits past the window and is invisible to the guard. A raw-snapshot assignment there
is unseen today.

## §3 · ⛔ THE WIDTH IS THE WRONG DIAL (§43 — the number is derived, or there is no number)

A wider constant would be an **authored number** and would rot again the next time the module
grows. Measured instead, at this base:

- `importGalleryMapWithCampaignImpl` is the **LAST top-level declaration** in
  `src/store/galleryImportMap.js`. Full list, in source order: `isSafeBackdropUrl` ·
  `captureGalleryImportSession` · `gallerySessionChangedAfterWrites` ·
  `assertGalleryImportSession` · `cleanupImportedSaves` · `importGalleryMapImpl` ·
  `importGalleryMapWithCampaignImpl`.
- The column-0 `\n}` positions in the whole file are
  `[888, 1371, 1697, 2672, 2964, 3474, 6535, 14856]` — **exactly one follows the impl**, at
  14,856. The anchor is unambiguous, and that is an enumeration rather than a claim.
- The sibling helper in this very file — `singleImportActionBody()` — **already uses a
  boundary**, ending at the next impl's `indexOf`. This member makes the two helpers agree.

## §4 · The change manifest (4 rows — AMENDED AT BUILD, see §4.1)

| # | Action | Path |
|---:|---|---|
| 1 | `MODIFY` | `tests/security/mapSnapshotImport.contract.test.js` — anchor `importActionBody()`; add the truncation control |
| 2 | `MODIFY` | `scripts/.test-ratchet-baseline.json` — the **remove-only** re-freeze, entry 15 drops (16 → 15) |
| 3 | `MODIFY` | `tests/lint/testRatchet.test.js` — the burned row's `ORDINARY_TEST_CONTROL` name is evicted and the floor steps down with the population (§4.1) |
| 4 | `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` — the census re-recorded WHOLE |

### 4.1 ⚠ THE FOURTH PATH WAS FOUND AT BUILD, AND IT IS PRICED RATHER THAN SMUGGLED

The compile declared three paths. Burning a census row costs a **fourth**, and no packet in
this train had enumerated it.

`tests/lint/testRatchet.test.js` holds `ORDINARY_TEST_CONTROL` — the false-positive half of
the walker-census classifier control — and an anti-padding arm requiring **every named file to
carry a LIVE census row**. That list names exactly three files, and
`tests/security/mapSnapshotImport.contract.test.js` is one of them. The moment entry 15 is
banked the name goes stale and the arm reds:

```
these control files carry no census row — a control over green tests proves nothing about
the census. Drop them, or name a file whose debt is real.
  + [ "tests/security/mapSnapshotImport.contract.test.js" ]
```

⭐ **That is the guard working, and its own comment prescribes the cure**: *"a file whose debt
is burned down leaves the list rather than lingering as a stale certificate."* The name is
evicted, and the list's floor steps `3 → 2` on the file's own written law — *"the floor is
BOUNDED ABOVE by the ordinary-debt population it controls… **It steps down WITH the
population**"* — which landed once already as `5 → 3` for the identical reason. The list stays
**REAL**: both surviving names carry live census rows.

⛔⛔ **AND THE SAME MEASUREMENT PUTS A HARD FLOOR UNDER THIS TRAIN.** Of the 15 census rows
remaining after this member, **12 are ledgered walkers and the other 3 are EST-C's three
targets**. Paying them takes the ordinary-debt population to **ZERO**, the control list cannot
be refilled — naming any survivor would certify a walker as ordinary — and the arm goes
vacuous. That is a disabled guard, not a banked win, and what replaces the control is a
governance question about verification adequacy. **It is recorded in `EST-C.md` and on the
lane receipt as a STOP.**

⭐ **No ledger row is touched.** `WALKER_ROWS_ADMITTED` (4) and `WALKER_ROWS_OWED` (8) were
checked by substring over the walker source **before** the re-freeze: entry 15 appears in
neither, so no ledgered id goes stale and neither ceiling moves. `CEILING` is 17 against a
census of 15 — monotone down.

⛔ **No `CREATE` row anywhere in this member** ⇒ the recorded `validate:packets`
LANDED-CREATE-existence hazard cannot fire. Stated affirmatively.

⭐ **§85.4 REGISTRY-MINT TWO-OBLIGATION PREFLIGHT — BOTH SUBJECTS EMPTY.** This member mints
no seeded chooser and no pool module (it touches no `src/` file at all), so neither the
decision-fork classification row nor the mechanism-coverage baseline row is incurred. Stated
affirmatively rather than by silence, because silence on the sibling law has stopped two
trains mid-chain.

## §5 · The edit, exactly

Replace `importActionBody()`'s window with the boundary anchor, and add the truncation
control as the **first** `it` of the existing `describe`. The control asserts (a) the extract
ends on a closing brace and (b) nothing follows it in the module.

⭐ **That control is the member's own anti-vacuity guard, at its site.** The estate's
anti-vacuity walker (Rule 1b) catches **EMPTY** extracts; this is the
**non-empty-but-truncated** shape it cannot see, and the control refuses it locally.
Widening the walker itself is out of this member's chartered scope — docketed as
**`CR-EST-TRUNC`** (§60 Q4, ruled DOCKET).

## §6 · ⭐ PREFLIGHT — EXECUTED AT `a6fd6395`, ALL FIVE OUTCOMES

Against the anchored body (`SRC.slice(start, SRC.indexOf('\n}', start) + 2)`, length
**7,717**):

```
CONTROL 1  body.trimEnd().endsWith("}")                  true
CONTROL 2  tail after body is "\n" -> trim() === ""      true
GUARD      seed regex          (banked entry 15)         false -> TRUE
GUARD      xss X1              (must stay false)         false / false
GUARD      xss X2              (must stay false)         false / false
           sharedMap.fmgSnapshot branch now IN body      true
```

⇒ **the repaired guard passes, the two negatives stay passing, and no new red is introduced.**

## §7 · §48 RE-SWEEP ON THIS CURE'S OWN PREMISES

| Premise | Re-swept how | Verdict |
|---|---|---|
| "the impl is last, so EOF is the boundary" | full top-level declaration list parsed at this base | ✅ **HOLDS** — and §5's control makes it **self-proving**: if a declaration is ever appended, CONTROL 2 reds honestly rather than the extract silently over-scanning |
| "exactly one column-0 `}` follows the impl" | every `\n}` position enumerated | ✅ **HOLDS** — 1 after, 7 before |
| "widening cannot introduce a new red" | both XSS regexes executed against the widened body | ✅ **HOLDS** — both `false` |
| "entry 15 is the only row this member repairs" | all 16 rows read; no other names this file | ✅ **HOLDS** — 16 → 15 |
| "the subject files did not move since the compile" | `git diff fc8451c4 a6fd6395` over all three | ✅ **HOLDS** — byte-identical |
| the negative-assertion anchor walker | this file holds **zero** `not.toContain/toMatch/toHaveProperty` sites and the control adds none | ✅ **NO ROW OWED** |
| the anti-vacuity walker (this file IS in its scope) | Rule 1b keys on a `.not.` matcher over an extractor binding; `body` is never used in one, and the control adds a positive assertion | ✅ **NO NEW VIOLATION** |

## §8 · Declared terminals (BY FIGURE)

| Figure | at `a6fd6395` | at EST-A | Δ | Cause |
|---|---|---|---|---|
| Lighting census | `2431/366/2065/20131/5656` | **`2431/366/2065/20132/5656`** | titles **+1** | one new `it` in an already-CREDITED file (4 → 5 titles, suites unchanged at 2) |
| Runtime tests | 28154 | **28155** | +1 | the same single case |
| Frozen known failures | 16 | **15** | −1 | entry 15 repairs; **remove-only** `--update` |
| `validate:packets` | 47 / 0 READY | 48 / 1 → **48 / 0** at flip | +1 | staged promotion |
| `ORDINARY_TEST_CONTROL` | 3 names, floor 3 | **2 names, floor 2** | −1 | §4.1 — the burned row's name is evicted and the floor steps down with its population |
| everything else | — | unchanged | 0 | no `src/` file touched; no flag, no golden, no OSR surface, no hot file |

⭐ **`totalTests` in the re-frozen baseline is the VERIFY-AT-BUILD figure, and it MEASURED
28,155** — the base capsule's 28,154 plus this member's one new case, exactly as declared.
`--update` writes it from vitest's own run counters, so it was never predicted, only checked.

## §9 · ⛔ MANDATORY STOPS

1. **A new OSR finding** → STOP. Never `--write`. (Not expected: no `src/` file is touched.)
2. **Either XSS negative flips to `true`** → **STOP and escalate as a security finding**, not
   a test repair. It would mean the widened scan found a real raw-snapshot assignment in the
   tail — which is precisely the defect this member exists to make visible.
3. **`--update` reports any failing test not already in the census** → STOP; it is refusing to
   bank a regression, and that refusal is correct.
4. **The re-freeze taken over the live shared tree** → STOP. It must be an integrity-counted
   checkout of a **committed** sha with `TEST_RATCHET_SHA` set. Prove DETACHED.
5. **Any attempt to re-word entry 15 rather than remove it** → STOP. §60 Q3 ruled REMOVE: the
   row's whole content is the false cause, and `--update`'s remove-only arm is the lawful
   instrument.

## §10 · Acceptance cases

| id | case |
|---|---|
| A1 | `tests/security/mapSnapshotImport.contract.test.js` — all **five** `it`s pass, including the repaired seed guard and the new truncation control |
| A2 | the anchored body contains `sharedMap.fmgSnapshot` — the previously blind branch is now scanned |
| A3 | `npm run test:ratchet` prints `RATCHET DOWN` naming exactly the F6 row, and **exits 0** |
| A4 | after the detached `--update`: the baseline holds **15** entries and no F6 row |
| A5 | the lighting walker's CENSUS literal reads `2431/366/2065/20132/5656` and the walker is **green in this same commit** |

## §11 · Checks

```
npx vitest run tests/security/mapSnapshotImport.contract.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
npx vitest run tests/lint/contractTestAntiVacuity.walker.test.js
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js
node scripts/implementation-packets.mjs validate
# then, DETACHED at the committed member sha, TEST_RATCHET_SHA=<sha>:
npm run test:ratchet          # expect RATCHET DOWN, exit 0
npm run test:ratchet:update   # remove-only; expect "1 removed"
```
