# W-ARMS — THE INDEPENDENT SKEPTIC PASS (item B2)
Lane WARMS-CAR0 · Seat Opus 5 — Fable-unvalidated · 2026-09-05 · base `272dbd2da` · **zero product bytes.**

**Why this document exists.** §879.11's bill named ONE slot with TWO halves — *"a short Fable design note **+ skeptic
pass**"*. §880.5 records only the note. The volume's own §8 is a five-lens refutation **authored by the design lane
itself**; a self-administered refutation does not discharge an independent pass. This is the missing half.

**Standard applied.** I attack each claim the way a **build lane would be bitten by it** — not "is this elegant"
but "if Car 1/2/3 acts on this sentence, what reds, what ships wrong, what does the owner see." Verdicts:
**RATIFY** (survives, act on it) · **REFUTE** (false at `272dbd2da`, do not act on it) · **THIN** (conclusion may
hold, evidence does not carry it — measure before acting).

⚠ Note on independence: I read the volume in full before measuring, so this is not a blind pass. It **is**
independent of the design lane, and every verdict below rests on a command executed at `272dbd2da`, not on the
volume's own citations. Receipts are in `CAR0.md`.

---

## 1 · CLAIM-BY-CLAIM

### C1 · "W-ARMS adds ZERO bytes to first paint, and by import direction it does." (§3.1, §6, §8.2)
**Verdict: RATIFY the conclusion · REFUTE the ground.**
The conclusion is now measured and true: every file that would import `arms.js` or `armsKinship.js` is **absent from
`EAGER_FIRST_PAINT_MODULES`** (265 modules). But two of the three stated grounds are false at `272dbd2da`:
- The design cites `vite.config.js:31 computeEngineSharedDomain()` as "the eager set". **It is not.**
  `EAGER_FIRST_PAINT_MODULES = EAGER_MODULES = computeEagerModuleGraph()` (`:300`, `:309`). The design tests a
  different graph than the one that decides first paint.
- *"`src/design/**` is outside the walk entirely"* — **false**: `src/design/tokens.js` is eager.
- *"generators import zero `domain/display` ⇒ display is safe"* — the grep still returns rc=1, but the inference
  fails: `src/domain/display/exportPosture.js` is eager anyway, by a non-generator path.

**Why a build lane would be bitten:** a Car 2 lane that "verifies the design's ground" would re-run the *generators*
grep, get 0, and conclude safety — while the actual risk (an eager module gaining an edge to the leaf) went
unexamined. **Give Car 2 the correct test:** assert the two new files are absent from `EAGER_FIRST_PAINT_MODULES`
**and** that the set size is still 265, so a rename cannot make the pin pass vacuously.
Harmless-but-alarming datum to pre-empt: `src/domain/deterministicSort.js` **is** eager. A lazy module importing an
eager one adds no eager bytes. Do not let a lane stop on it.

### C2 · "the adapter's import of `lineageClaim.js` … PLAUSIBLY marginal" (§6 size row, §8.2)
**Verdict: THIN — and it is the design's own named open obligation, now measured.**
`parentRefOf` alone bundles to **80,334 B minified**; the adapter's other four imports total **2,712 B**. 97 % of
the cost is `eventProse.js` (64,222 B raw / 83,271 B bundled), reached via `lineageClaim.js:25`. The design
estimated **4–5 KB raw for the whole leaf** — the adapter's import chain alone is ~17× that.
**What rescues it:** a static import-closure walk shows `eventProse.js` and `lineageClaim.js` are **already
resident** in `liveWorld.js` (273 modules), `SettlementPDF.jsx` (357), `pdfRender.worker.js` (359) and
`OutputContainer.jsx` (1218). So the marginal delta is plausibly ≈ 0 **by chunk co-location**.
**What does not:** the two files the design picks as call sites carry **neither** — `DossierHeaderRow.jsx` (25
modules) and `Cover.jsx` (15 modules). The guarantee is therefore "Rollup dedupes within the chunk", **not** the
import-direction guarantee the design asserts, and only a build settles it.
**Why a build lane would be bitten:** it would read "PLAUSIBLY marginal", skip the measurement, and discover an
80 KB delta at the Car 2 build gate — after the leaf is written. **Move this measurement ahead of Car 2's code**,
and treat a non-zero dossier-chunk delta as a STOP, not a surprise.

### C3 · The seam it hooks — `DossierHeaderRow.jsx` and `Cover.jsx` (§4.1, §4.2)
**Verdict: RATIFY the placement · THIN on the size change.**
Both citations are exact at `272dbd2da`: `DossierHeaderRow.jsx:55` renders
`emblem(settlement.name || 'settlement', { mode: 'field', size: 38 })` into an `aria-hidden` span via
`dangerouslySetInnerHTML`; `Cover.jsx:319` renders `<HouseCountersealSeal seed={settlement.name} size={14} />`.
The "one mark across surfaces" claim holds: all three surfaces seed from `settlement.name`
(`SettlementCard.jsx:160` — **not :144**, the design's line has decayed).
**The unstated change:** the design moves the header mark **38 px → 48 px**. That span is `flexShrink: 0` in a
`display:flex, gap:12, flexWrap:'wrap'` row whose title block is `flex:1, minWidth:0`. Ten pixels come out of the
title's width on **every dossier for every user**. Not a break — `flexWrap` and `minWidth:0` absorb it — but it is a
layout change the DECLARED UI shift record (§5.3) describes only as "the medallion becomes the arms". **Say the size
change out loud in the record**, or the owner meets it at the walk.

### C4 · The test file it adds — the census bill (§6)
**Verdict: REFUTE the framing (both the design's and my own brief's) · RATIFY the residual.**
The design bills the ONE new test file as "lighting + anchor only, TWO not three", and my brief warned of **three**
censuses (test-ratchet `totalFiles`, lighting, known-failure list). Measured at `272dbd2da`:
- `scripts/check-test-ratchet.mjs:97` `SCOPE_FLOOR_RATIO = 0.9`; `:1138` reds only when
  `totalFiles < floor(baseline.totalFiles * 0.9)`. Its own comment names it the **FILE FLOOR**. `:1118` is the same
  for `totalTests`. A new test file **raises** both; it cannot breach them. (`totalTests 31489 · totalFiles 2468`.)
- The known-failure census holds **6 entries against `CEILING = 17`** — eleven free slots, and a *passing* file adds
  no entry.
⇒ **Exactly one census binds a passing new test file: the lighting census** (`files` 2521 → 2522), plus the
`negativeAssertionAnchor` walker (`SCAN_ROOTS = ['tests']`, `:64`). **The design's "TWO not three" is right.**
⚠ The anchor walker is the **two-sided trap** (standing hazard): it reds when a file gains an un-anchored negative
*and* when one too many is cured, and a hand-paired two-direction proof does not count. Cure only the new sites.

### C5 · Car 3 and the paid surface (§4.2, §8.3, §8.4)
**Verdict: REFUTE — the design chartered the wrong obligation, and the real one is bigger.**
§8.3 calls the cross-surface name-resolution risk *"the top refutation that survived"* and charters Car 3 to thread
`campaign.settlements`/`nameById`. Measured: **`nameById` is already built and threaded.**
`resolveExportSeam.js:37-42` constructs a complete `Record<string,string>` deliberately, with an F41 docblock
forbidding a `nameFor` function; `liveWorld.js:130-135` prefers it natively. That obligation is discharged.
**The real exposure is a PDF↔PDF drift the design never names.** Four export entry points exist; **two thread no
`campaign` at all**:
- `SettlementCard.jsx:115` — `generateSettlementPDF(s.settlement, { phase: canonPhaseOf(s) })`
- `SingleDossierSuccessPage.jsx:183` — `generateSettlementPDF(settlement, { isAnonymous: false })` — the
  **post-purchase download**
(`ExportDraftButton.jsx:64` passes `campaign: null` deliberately and correctly — a draft has no campaign.)
Every export is premium (`authSlice.js:48-50`), so **all four are paid surfaces**. The same settlement therefore
exports **different arms depending on which button was pressed**: quartered from the dossier, un-quartered from the
Library card and from the purchase-completion page. §8.3's defence — *"an unresolvable name is a typed
`unknown_liege` ⇒ the borne coat"* — degrades gracefully on a **missing name**; it does not cover a **missing
campaign on a settlement that has one**, which is silent and produces a wrong-but-plausible artifact.
**Chair-gated, two options, neither a lane call:** (a) route entry points 3 and 4 through `resolveExportSeam` — a
behaviour change on two paid surfaces; or (b) render un-quartered on every surface until (a) lands — consistent,
but it drops the charter's headline capability. **Car 3's brief must carry this in place of the name-threading row.**

### C6 · `goldenViewModel` is unmoved "by construction, three ways" (§4.2)
**Verdict: RATIFY the conclusion · REFUTE one supporting figure.**
The construction proof holds where it matters: `src/pdf/lib/viewModel.js` contains **zero** mentions of
emblem/counterseal/parentRef/hegemony/treaty/cover (re-measured, 0 hits), the cover's counterseal reads
`settlement.name` directly at `Cover.jsx:319`, and the snapshot is **17 lines** as recorded.
**But the design says "20 rows in `parityContract.js`". Measured: `SHARED_FIELDS.length = 11`** (and
`PARITY_EXEMPT.length = 8`). The file is at `src/domain/display/parityContract.js`, not `src/pdf/lib/`.
`viewModel.js` is **924 lines**, not 917. The conclusion survives; two of its figures do not. A lane that quotes
"20 rows" into a commit body publishes a false receipt.

### C7 · The TWO-FILE split across the layer wall (§3.1)
**Verdict: RATIFY — and it is more load-bearing than the design says.**
`voiceMechanics.test.js:164-167` — `SCANNED_FILES = walkJs(src/data) + walkJs(src/domain)` (CONFIRMED). So
`arms.js` at `src/design/organic/ornament/` is **outside** the Tier-2 voice walk, and `armsKinship.js` at
`src/domain/display/` is **inside** it, at `em 382/382` and `total 770/770` with zero headroom.
⇒ `blazonText()` — the one prose-shaped export in the design, emitting *"Azure, a tower Or on a plate, a chief
Argent; quarterly with…"* — is placed in the file **outside** the punctuation ratchet. Had §3.1's rejected
alternative (i) (one file at `src/domain/display/heraldry.js`) been taken, its punctuation would sit inside two
zero-headroom ratchets. **The split is correct for a reason the design never states.** Carry it into Car 1's brief so
nobody "simplifies" the two files into one.
**The standing constraint for Cars 2 and 3:** one em dash or one bang in any *string literal* in `armsKinship.js`
breaches `em 382` and `total 770`; one in `Ornament.jsx`/`DossierHeaderRow.jsx`/`Cover.jsx`/`HouseArmsBlock.jsx`
breaches `em 34` / `bang 0`. Docblocks are excluded. **Each car should run `grep -n '—\|!' ` over its own touched
files as a self-arm before the gate.**

### C8 · The OSR reasoning (§6, §2.4)
**Verdict: REFUTE the inference · RATIFY the cure.**
The design reasons *"NOT banked (0 rows) ⇒ PLAUSIBLY clean."* **Backwards.** Zero rows is the *harshest* state:
the scanner's own law (`:44`) is that a new identity in an already-listed file has **ceiling 0 and REDS**, and a file
absent from the inventory has ceiling 0 for anything. A banked identity carries headroom equal to its count.
The cure — route every read through `parentRefOf` / `treatyOrientationOf` / `getSpatialLedger` and take resolved
scalars — is **right**, but for the reason the design omits: the identity is `<key> on <receiver-variable-name>`,
leaf-spelled, proven by the same key yielding three identities (`parentRef on config` / `on save` / `on settlement`).
Routing keeps the read inside the file that already banks it.
**The Car-2 landmine the design does not name:** `src/components/OutputContainer.jsx` — the file Car 2 edits to
thread the two props — **is already in the inventory with 5 identities**, so any new `<key> on <receiver>` read
written there reds at ceiling 0 with no lawful bank. Thread through the existing selectors only.
**And `src/components/` is not shielded:** `EXACT_SCAN_EXCLUDED_SCOPE` removes those files from **exact resolution
only**; the gate prints *"These are ENFORCED, not excluded"*, and the unfiltered heuristic leg is the gate authority
under `BASELINE_SCAN_MODE = 'legacy-leaf'`.

### C9 · Car 1's sample count N (§5.1)
**Verdict: REFUTE — the design contradicts itself, and no reading gives 24.**
The design says *"the seven fields on one charge, the six ordinaries, one differenced coat, one quartered coat, one
differenced-and-quartered coat, **at 48 and 64 px, light and field modes** — **~24 files**."*
- The enumeration yields **7 + 6 + 3 = 16 distinct coats**.
- "at 48 and 64 px, light and field modes" is 2 sizes × 2 modes = **×4 ⇒ 64 files**.
- The stated total is **24**. **The three do not reconcile.**
**Derived from the family's own rule** (CONFIRMED, `scripts/gen-organic-ornament.mjs:29-42`): `ornamentSamples()`
emits **one sample per pool member at one size/mode, plus exactly THREE deliberate second-mode proofs**
(`cartouche-thornwall-field`, `emblem-mine-field`, `compass-rose-field`) — 8 emblems + 4 cartouche seeds + 2
compass + those extras = **16, matching the measured base exactly**.
⇒ Applying the family's rule to the design's 16 coats gives **N ≈ 16, +2–3 mode proofs = ~18–19**, not 24 and not 64.
**Why a build lane would be bitten:** every sample is a byte-pinned golden *and* an owner taste artifact. A lane that
authors 64 renders a cross-product the family has never used; one that authors 24 cannot say which 24.
**Car 1 must fix N from the family's rule and state it before authoring**, and the §9.5 glance test (38/48/64) is a
*taste surface for the owner*, not licence to triple the golden family.

### C10 · The CC0 charge roster (A5 / §1.5, owner taste row §9.8)
**Verdict: RATIFY — deferral is correct, and the substrate is stable.**
`public/map/charges/` = **104 files / 279,799 B** at `272dbd2da`, unchanged from every prior reading.
`THIRD-PARTY-NOTICES.md:286` names the 104 positively. `tests/lint/shippedAssetLicence.test.js` carries *"only CC0
charges may ship"* — at **:324**, not the design's `:311`. Cars 1–3 copy no charges, so the walker is untouched.
The register-mismatch and walker-gap grounds are sound and the byte case (~30 KB for a curated dozen vs ~1 KB for
four hand-drawn cadency marks) is the right trade. **Do not reopen; it is the owner's row and it is out of this
landing.** ⚠ One residual the design states correctly and a later car must honour: the licence walker walks
`public/` **only**, so a charge copied into `src/` as path data escapes it and owes a new copy-fidelity pin.

### C11 · Determinism and dormancy (§2.3, §5.2)
**Verdict: RATIFY, with one figure unverifiable here.**
The derived-never-stored posture is coherent: no settlement field, no `worldState` key, no chronicle entry, no
ledger namespace; regeneration/undo/restore/import carry nothing because the input records are already theirs.
The rename path is honestly handled — the counterseal already re-seeds on rename, so the arms inherit shipped
behaviour rather than adding a lifecycle. The integer-geometry / no-transcendental discipline is the right answer to
the determinism law.
**Unverifiable here:** §713.2's **525/525 + fence 21/21**. I could not locate a comparator by name at `272dbd2da`
and I will not quote a count I did not derive. It is chair-owned at the landing, and the charter is explicit that it
is **NOT by construction — it must be PROVEN**. **OWED.**

---

## 2 · THE TWO QUESTIONS A SKEPTIC PASS EXISTS FOR

### Q1 · What would make this landing fail its gate?

Ranked by probability × cost, measured where possible.

1. **An OSR red with no lawful bank.** A convenience shape read in `OutputContainer.jsx` (already-listed, ceiling 0)
   or any direct `settlement.parentRef` / `worldState.spatialLedgers.treaties` read in the new adapter. Growth is
   **unbankable by `--write`** (§879.12), so this does not "cost a refreeze" — it **stops the landing**.
   *Mitigation:* the per-file table in `CAR0.md` §2 Probe 1; route through existing readers only.
2. **The dossier-chunk / worker byte delta.** 80,334 B of exposure sitting behind a "PLAUSIBLY marginal". If the
   dedupe does not hold, Car 2's build reds and the leaf is already written. *Mitigation:* measure before coding.
3. **One em dash or one bang.** Seven voice measures sit at **zero headroom** (34/0/15/382/69/9/770). A single
   typographic character in a string literal in `armsKinship.js` or any touched `.jsx` reds the gate — and the
   baseline **refuses upward**. This is the cheapest possible way to lose a landing.
4. **The `negativeAssertionAnchor` two-sided trap** on the one new test file. Reds in both directions; a hand-paired
   proof does not count.
5. **The lighting census refreeze taken from a stale base.** UB-4 fired *again* between `90702c3e9` and
   `272dbd2da` (`titles` 23178→23184, `suiteTitles` 6213→6214). Any figure quoted from a plan — **including this
   one** — is stale at the landing. Re-derive at the landing base.
6. **A schema-17 collision.** The OSR rung 17 is claimed by the OSR-SCHEMA17 lane. W-ARMS must land schema-neutral:
   `--write` not run, `total` unchanged at 1993.
7. **`enforcement-claims` at 6/6** if B1 lands in the same consist — one claim phrase in the volume breaches a
   zero-headroom banked arm. *Mitigation:* land B1 as its own docs-only car, and re-run the regex at the base.

**The single structural point:** items 1, 3 and 6 are all **unbankable** — they cannot be absorbed by a refreeze.
A W-ARMS car lands green or does not land.

### Q2 · What does this change for a user who never asked for heraldry?

**Every settlement gets arms. There is no opt-out** — §5.4 recommends always-on, and I agree with the reasoning
(a flag would be a self-imposed constant bounding a ratified capability, per the 08-27 law). So this question is not
hypothetical: it describes **every existing save.**

**What does NOT change — and this is the load-bearing half:**
- **The charge is the mark they already have.** `baseCoat` uses the counterseal's own `'emblem'` slot seeded from
  `settlement.name`, so the emblem on the header, the Library card and the PDF cover is **the same mark as before**.
  A user's town does not get a new symbol; it gets its existing symbol on a shield.
- **No persisted state moves.** No settlement field, no save key, no schema byte. **A same-seed world is
  byte-identical with the leaf present or absent** — which is precisely why §713.2's 525/525 + 21/21 is billed as
  a proof and not an assertion. **This is NOT a same-seed generation shift**, and THE PROMISE is not touched.
- The `SettlementCard` 16 px medallion, the 14 pt PDF counterseal, the About colophon and the map are unchanged.

**What DOES change, and must be DECLARED, never absorbed:**
1. **The dossier header looks different for every existing save** — a 38 px emblem becomes a 48 px banner carrying a
   field tincture, an ordinary and (for cadets/vassals) a cadency mark or quartering. Rendered output for an
   unchanged input. **Declared UI shift.** The design's §5.3 record covers this.
2. **The header grows 38 → 48 px**, taking ~10 px from the title block in a flex row. Small, absorbed by
   `flexWrap`/`minWidth:0`, but visible on every dossier — and **absent from the §5.3 record**. Add it.
3. **A re-exported PDF differs from the one the user already downloaded.** The cover gains a text-free arms block.
   Same settlement, same seed, a different paid artifact than the one in their folder. The view-model golden is
   unmoved, so no *comparator* catches it — which is exactly why it must be stated rather than measured.
4. **Arms encode relationships the user may not have looked at.** A settlement quarters its liege's arms because a
   subordinating treaty stands in the ledger. That is a *visible political claim* on the dossier of a town whose
   owner never opened the treaty screen. It is "state, never fate" — the ledger's existence is the state — but it
   makes a previously-buried fact prominent. **This is a taste call, and it belongs on the owner's desk beside the
   §9 rows.** It is not currently one of the eleven.
5. **A rename re-arms the settlement** — field, ordinary and cadency change with the name, not just the charge.
   The counterseal already re-seeds on rename, so the *behaviour* is inherited; but the *visible surface* of that
   behaviour grows from one small mark to a full coat. §9.1 offers `_seed` as the alternative and correctly prices
   it (a declared shift of the ornament golden family and the PDF cover).

⇒ **Answer to the question as asked: it is not a same-seed output shift** (generation is inert, provable at 525/525)
**but it is a rendered-output shift on every existing save and every re-export, and item 3 above touches a paid
artifact.** Both belong in the DECLARED UI shift record verbatim, and **item 4 belongs on the owner's desk as a
twelfth taste row.**

---

## 3 · WHAT THIS PASS DID *NOT* SETTLE

Named so nobody reads silence as clearance.

- **The eleven §9 taste rows and the C1 one-word veto** — the owner's, untouched by design. I record only that
  §9.1 (seed root) and §9.3 (colour tinctures) are the two whose "ALT" answer moves a landed golden family, and that
  a **twelfth row** is owed (Q2 item 4: arms make an unopened political relationship visible).
- **§713.2's 525/525 and the fence's 21/21** — no comparator located by name; not re-derived; **OWED to the chair
  at the landing.**
- **"measured == ceiling" on the seven voice arms** — the *ceilings* are CONFIRMED; the tree sitting at them is
  **PLAUSIBLE only**, needing a `voiceMechanics` run this lane is fenced from.
- **Every byte figure behind a build** — first-paint closure, eager-chunk hashes, the dossier/worker delta. The
  design's own closure premise (1,047,205 B, "205 B OVER") was already refuted as stale by D-11 and is now **six-plus
  landings old**; do not carry it forward in any form.
- **Whether `arms.js` as actually written stays inside its byte estimate** — the file does not exist; the esbuild
  probe the design asks for is **OWED to Car 1**.
