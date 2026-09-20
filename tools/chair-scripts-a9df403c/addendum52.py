# -*- coding: utf-8 -*-
"""ODQ §934.47 addendum 52 + §934.64 (owner decision point) + the charter's amendment section. Run from the ledger
checkout on review-fixes-2026-07-08. Both files are re-read from HEAD first (the checkout is stale). The stamp is read
from `date` at run time. Prints the diff stat; the commit is the caller's, by pathspec."""
import io, subprocess, sys

ODQ = "docs/OWNER_DECISION_QUEUE.md"
CH = "docs/implementation/charters/EDIT-MODE-TRAIN.md"

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True, check=True).stdout

for p in (ODQ, CH):
    io.open(p, "w", encoding="utf-8").write(run("git", "show", "HEAD:" + p))
stamp = run("date", "+%H:%M").strip()
print("stamp", stamp)

# ---------- the pieces, shared by the ODQ line and the charter section ----------
P_CUREH = ("**CURE-H LANDED `902580c71`:** A8 of `tests/store/participationWriteBase.contract.test.js` derives the settlement-clock chain "
    "(`advanceTime → advanceFoodStockpile → applyBlockadeTransportImpairment → advanceTreasury`) from `src/domain/worldPulse/pulseKernel.js` by its own "
    "`// @pulse-stage: settlement_clock` marker, found AND ordered, five red controls fired in throwaways, every prior assertion kept; suite 5/5, the anti-vacuity "
    "walker 15/15, `tests/lint` ×5 42/42, eslint 0; one file (+207/−13); no title moved (the refreeze measured it). The `contract` token's consumer census, "
    "delivered: exactly TWO enforcers — the mutation register's `NAME_PATTERN` and `contractTestAntiVacuity.walker.test.js`, whose `inScope` applies FIVE rules "
    "(the pre-proof brief's step 12 stands; TOOL-6b's brief carries the census).")
P_REFREEZE = ("**THE THIRD REFREEZE `5a3380e8d`:** the tuple measured through the walker's own door — `2652 · 383 · 2269 · 25043 · 6679` = the frozen "
    "`2651·383·2268·25035·6678` + EM-B3c's `+1/+0/+1/+8/+1`, CURE-H `+0` — exactly the expected tuple, measured not assumed.")
P_RUN19 = ("**RUN 19 = train EM-T3's terminal** at `5a3380e8d`, bare and detached in the consist (nohup; the log at the scratchpad root), launched 04:18:49 EDT; "
    "the ratchet took the exclusive lock at 04:24. GREEN ⇒ T3 closes and the push chain's recommended moment arrives (it carries EM-B1k, EM-B3c, CURE-E…H); "
    "RED ⇒ the chair rules the cure from the ratchet's JSON.")
P_B1K2 = ("**EM-B1k2's build is SEALED in the slot** (dispatched 04:2x under `LANE-EM-BUILD.md` with the chair's two cuts restated: the anti-vacuity walker in "
    "its instruments, its red a STOP; every 'every …' population read from the producer, CURE-H's idiom the model); its batches pause behind run 19; "
    "the chair places nothing while the seal holds (EM-P2 v4 waits for B1k2's flip).")
P_GATE = ("**THE CHAIR'S GATE JUDGMENT** (the owner: \"nvm i leave it to your judgemetn\"): SIX live lanes now wait at the gate (FIX-C2 · FIX-P1 · FIX-P3 · FIX-P4 · "
    "FIX-L1 · FIX-P5) and four staged dead-agent lanes behind them (FIX-G · TOOL-2b · FIX-F2b · TOOL-3) — more than two — so the SHARED-TIER OVERLAP OPENS "
    "after run 19: the slot's build resumes first with ONE paused lane beside it, thereafter two lanes at a time in the order they paused; an EXCLUSIVE-tier "
    "build (TOOL-3's two real builds) runs alone. Recorded, vetoable.")
P_P5 = ("**FIX-P5 REPORTED, paused at its gate** (four commits over six batches; goldens byte-identical; the route census moves exactly one row, `/pricing`): "
    "F9 — ten sub-12 px sites and twenty-four 12–13 px paragraphs through the two ladders (`bare 10 → 0`, `floored 7 → 17`) with a NEW opt-in prose-floor arm "
    "for the gap no instrument saw (a 12 px `<p>` clearing the chrome floor); F16 — the `$2.99` ladder cell wears the lock mark, both directions pinned; F8 — the "
    "phone bar's seats content-sized, 'Compendium' no longer ellipsises (271 + 20 ≤ 375); noticed 7 — the 44 px control's overhang proved clear of content by "
    "≥ 12.92 px at every narrow width; noticed 4 — the `†` became the check the contrast test already calls it; F14 — `tierFacts.js:35-38` REFUTED the review's "
    "split reading (the spellings were unified to the wizard's 'Thorpe'; only the machine TOKEN stays `thorp`), so three label tables and `SummaryTabV2`'s "
    "upper-cased token now say 'Thorpe'; noticed 6 — thirteen shouted dossier badges became written words wearing `textTransform`. "
    "F7 STOPPED BY MEASUREMENT → **§934.64 asked** (below). Noticed 5 → **CLOSED — refuted by the source:** the exclamation is `src/copy/en.js:496`, "
    "`voiceMechanics` DOES scan it under a count-pinned Tier-1 exception citing §934.26, where the owner's verbatim order outranks the voice law; re-wording "
    "needs the owner's word and the owner has ruled — not re-asked. FATES: F14's two registered-not-cured surfaces (the Compendium's tier label baked into a "
    "BYTE-PINNED generated artifact — a generator/record touch, the brief's STOP; the gallery's `capitalize` covering every facet it draws) → **FIX-F5 (NEW; "
    "small; after FIX-P5 composes):** the Compendium's artifact re-stamped with the unified word under its own pin's door (the lane names the pin and the door; "
    "the chair rules it at the train) and the gallery's tier chip reading the label table, the other facets keeping `capitalize` — the census row P5 executed "
    "against the shipped artifact reds the day it is cured, which is the proof; the taste sample `organic/samples/PricingSample.jsx` drawing `†` where the "
    "shipped row now draws `✓` → SLOT: **FIX-F4** syncs the sample to the shipped mark (one character; the sample records the shipped taste, it is not a second "
    "design); `phoneChromeFloor.census`'s `/create` (bare 98, measured 97) and `/settlements` (files 206, measured 208) rows stale at 63e40fe57, green in the "
    "permitted direction → SLOT: **FIX-F4** re-takes both rows to the measured figures (ratchet-tightening only); the five prose-shaped 12–13 px lines in "
    "`App.jsx`, `HomeHero.jsx`, `generate/ClerkNote.jsx` (lane 28's remainder — why the prose floor is opt-in by roster) → SLOT: **FIX-F4** extends the "
    "prose-floor roster to them, measured. **FIX-F4 IS RE-SCOPED:** its `SummaryTab.jsx` population is re-measured after P5's Group D composes (P5 touched "
    "`SummaryTab.jsx` and seven siblings).")
P_T7 = ("**TOOL-7 MEASURED** (read-only at 63e40fe57, one commit behind CURE-E, whose two cured sites are in the count — the §0 delta suffices; Q7 ruled): "
    "arm A — 341 membership `in` tests, 96 resolving to an object literal (63 absence checks that read a prototype key as PRESENT, 31 guard-then-reads that "
    "hand back a FUNCTION), nine `src/` convictions; arm B — `.substring`/`.substr` ZERO tree-wide, 113 `.slice` calls with an inline finder in their arguments "
    "(unassertable by construction: no name is bound to the index) — B1 two-distinct-anchor ≥ 21 (three cured by CURE-E ⇒ ≥ 18 live), B2 6, B3 49, B4 38; "
    "arm C1 — ≥ 25 of 36 files brace-count raw source; C2 — five sites, five distinct labels. Priced: ~2.0 s for the whole tree. ⭐ THE FINDING: "
    "`tests/helpers/sourceContract.js` already IS the cure (a fail-closed extractor chokepoint whose header names the silent-`''` class) and its enforcer "
    "`contractTestAntiVacuity.walker.test.js` declares the exact gap at lines 38-39 (Rule 1b keys on extractor NAMES; an inline slice has no callee) — and both "
    "of CURE-E's instances lie OUTSIDE that walker's scopes, which the file's own lines 78-80 call vacuity one level up. RULED (Q1–Q7): "
    "**TOOL-7a (Act 1; a parallel lane, LAUNCHED; `tooling-7a-2026-09-20` @5a3380e8d; kit `briefs/launch/TOOL-7a.md`):** ONE throwing `spanBetween` helper in "
    "`sourceContract.js` with every live B1 site re-routed (CURE-E's two and its `declarationBody` among them; `surveyorByok.test.js`'s five on the paid BYOK "
    "surface, `byokNeverLogged.test.js:89`'s security pin, `autoplacementStore.test.js:101`'s retirement-comment anchor, `aiAnalyst.test.js:461`'s prose "
    "anchors); `fnBody`/`objectLiteralKeys` extracted there as THROWING and strip-aware (six matchers → one family; `statementWindowAt` stripped); "
    "`codeSkeleton` co-located in `tests/helpers/codeOnlySource.js` as the DECLARED strict strip with `codeOnly` unchanged (Q6 CLOSED as intended: two strips "
    "with declared purposes in one file, 23 importers untouched); Rule 5 convicting the B1 shape over `tests/**` + `scripts/**` (a declared new scope; empty "
    "allowlist; three adversarial self-tests; the shape parsed on the stripped source with a balanced splitter — class 9; no new mutation row, the file's is "
    "`self-proving-meta`); the walker's own three `in` gates (`:357, :369, :382`) → `Object.hasOwn` (Q3: arm B before arm A). Two commits, composed at EM-T4. "
    "**TOOL-7b (Act 2; after 7a composes):** B4 (38 sites, drops the last character silently — the sneakiest) cured wholesale; B2/B3 (55) under a shrink-only "
    "baseline; C1 the brace-matcher ADOPTION baseline (not a detector — conviction needs data flow), `dossierMountRegistry.walker.test.js`'s four rows among it. "
    "**TOOL-7c (arm A; after 7a):** the ESLint `no-restricted-syntax` selector `BinaryExpression[operator='in']` merged into each owning block under the "
    "config's one-block-per-file law (`eslint.config.js:441`; ~7 merges into a 58 KB config — tooling, NOT owner-gated, Q2), with a declared exemption register "
    "for the class-8 sites and the 55 % unresolvable-RHS blind spot declared chooser-totality style. "
    "**FIX-K1 (NEW; product; a parallel lane, LAUNCHED; `fix-hasown-2026-09-20` @5a3380e8d; kit `briefs/launch/FIX-K1.md`):** the nine `src/` convictions cured "
    "with `Object.hasOwn` — FIRST and red-first the copied tier-band pair `src/domain/traditions/genesis.js:143` + `politics.js:99`, where a SAVED CAMPAIGN's "
    "`tier: 'constructor'` passes the guard and `tierIndex` becomes the `Object` constructor (a live product defect, Q4 — one resolver if the import is "
    "acyclic, the copied family collapsed); `commercialReasonTaxonomy.js:138-139` (both lines leak; the JSDoc's `string | null` made true); "
    "`pulseFingerprint.js:160` (a prototype-named token minted `\"function toString() { [native code] }1\"` into a telemetry payload — executed); "
    "`flagRegistry.js:177` (`flag('constructor')` reads ON past the unknown-flag warning); `espionageDoctrine.js:170`; `AdminTrendsCharts.jsx:108`; "
    "`constructionUsage.js:112-113`; the accumulator-guard family (`commodityFlow.js:500,505`, `generosityKernel.js:1041,1094,1121`, "
    "`routeNetworkLedger.js:554`, `traditionsKernel.js:448` — `if (k in writes) continue` SKIPS A WRITE on a prototype-named key, the EM-B1k shape); "
    "`no-prototype-builtins` warn → error if its population is zero (item 16). Behaviour-identical for every own key; goldens byte-identical (no seed carries "
    "a prototype-named key — the golden suites prove it); the three class-8 sites (`beliefMap.js:1127`, `disinformationPlant.js:162`, "
    "`espionageProducts.js:311`) untouched with the reason; composed at EM-T4 with the chair's dist measure. "
    "CLOSED WITH REASON: C2 (five sites, five distinct labels, zero cross-file matching — no population); the `substring` arm (zero in the tree — dead on "
    "arrival); item 9 (the lint's exemplar is CURE-E's helper, not `tradeRouteSemantics.test.js`'s `match` form — corrected in 7a's brief); item 17 (the "
    "exact-equality `.not.` row — a budget note in 7a's brief); item 18 (the instrument's splitter — class 9 in 7a's brief).")
P_CUREH_NOTICED = ("**CURE-H's noticed items:** the stale docblock name at `participationWriteBase.contract.test.js:2` → SLOT: **TOOL-6b** (its admission dock "
    "touches the file's register row); the `@pulse-stage` marker family now has FOUR consumers (A8 the fourth) and the `contract` token reaches five rules → "
    "both recorded in TOOL-6b's brief.")
P_SEATS = ("**SEATS at this stamp:** gate = run 19; working = EM-B1k2 (slot, sealed) · TOOL-8 (the dark-guard census) · FIX-K1 · TOOL-7a; paused at the gate "
    "(live agents, in order): FIX-C2 · FIX-P1 · FIX-P3 · FIX-P4 · FIX-L1 · FIX-P5; (dead agents, staged; `briefs/RESUME-PARALLEL.md`): FIX-G · TOOL-2b · "
    "FIX-F2b · TOOL-3. **SEAT QUEUE:** FIX-P2 (measure-first, the persona) → FIX-F4 (after P5 composes) → FIX-T1 → FIX-G3 → TOOL-9 → FIX-C2b → REVIEW-P2 → "
    "EM-A1 (after P2 v4) → the EM-R pre-proofs (R0a + the `history` group; R0d; R0b v3; R0f compile; R0c) → EM-B1f (after B1k2 lands; its pre-proof re-run) → "
    "EM-B1j compile → R6 v3.1's arms → TOOL-7b → TOOL-7c → FIX-F5 → TOOL-6b (after T4).")

odq_line = ("- **§934.47 addendum 52 — CURE-H LANDED (`902580c71`); THE THIRD REFREEZE (`5a3380e8d`, `2652·383·2269·25043·6679`); RUN 19 LAUNCHED; "
    "EM-B1k2 BUILDING UNDER SEAL; FIX-P5 AND TOOL-7 REPORTED — ONE OWNER POINT (§934.64), ONE CLOSED BY THE OWNER'S OWN RULING, A PRODUCT-DEFECT FAMILY "
    "(FIX-K1) AND TOOL-7 RE-CUT AS THREE ACTS, BOTH LANES LAUNCHED; THE GATE OVERLAP OPENED (2026-09-20 " + stamp + " EDT; the chair; vetoable).** "
    + " ".join([P_CUREH, P_REFREEZE, P_RUN19, P_B1K2, P_GATE, P_P5, P_T7, P_CUREH_NOTICED, P_SEATS]))

odq_964 = ("- **§934.64 — OWNER DECISION POINT (asked 2026-09-20 " + stamp + " EDT; the chair keeps the status quo until the word): THE PAINTED SIGN IN PLATE — "
    "RE-CUT IT, OR 10 PX STANDS?** FIX-P5 measured the plate REVIEW-P flagged (F7): at 375 px the brass plate's box is 83.92 × 22.47 and the slip the type "
    "sits in has a content box of 38.92 × 9.89; `slipStyle` sets `lineHeight: 1`, so a 12 px face needs 12 px of height and MISSES BY 2.11 px — at 320, 391 "
    "and 430 too. Nothing was shrunk or overlaid. This is already the estate's recorded position: `publicChromeFloor.census.test.js` carries an EXECUTED "
    "EXCEPTIONS row (§934.26) that re-derives LIVE/FORCED/PAID every gate run and reds the day a re-cut makes 12 px fit. THE CHAIR'S READING: the plate is "
    "the owner's painting (the 09-19 brand law: the full logo is the painted plaque and seal on the arrow; never judge or extend the painting), so a re-cut is "
    "a design act and the owner's; the 10 px face sits on a paid 83.92 × 44 target. **The owner's word: re-cut the plate (a taller slip, the painting "
    "re-composed), or keep 10 px.** RECOMMENDATION: keep — the exception is executed, honest and self-retiring. Until the word, nothing moves.")

u = io.open(ODQ, encoding="utf-8").read()
key = "- **§934.47 addendum 51 —"
i = u.index(key); j = u.index("\n", i)
assert u.count(key) == 1 and "§934.47 addendum 52" not in u and "§934.64" not in u
u = u[:j + 1] + odq_line + "\n" + odq_964 + "\n" + u[j + 1:]
io.open(ODQ, "w", encoding="utf-8").write(u)

ch_section = ("\n## Amendments of 2026-09-20 " + stamp + " EDT — CURE-H landed and the third refreeze; run 19 launched; EM-B1k2 building under seal; "
    "FIX-P5 and TOOL-7 reported: FIX-K1 and TOOL-7a launched, TOOL-7b/7c and FIX-F5 chartered, FIX-F4 re-scoped, §934.64 asked (ODQ §934.47 addendum 52)\n\n"
    "- " + P_CUREH + " " + P_REFREEZE + " " + P_RUN19 + " " + P_B1K2 + "\n"
    "- " + P_GATE + "\n"
    "- " + P_P5 + " **§934.64 (the painted Sign In plate: re-cut, or 10 px stands — the chair keeps the executed §934.26 exception until the word; "
    "recommendation: keep).**\n"
    "- " + P_T7 + "\n"
    "- " + P_CUREH_NOTICED + "\n"
    "- " + P_SEATS + "\n")
c = io.open(CH, encoding="utf-8").read()
assert "addendum 52" not in c
if not c.endswith("\n"): c += "\n"
c += ch_section
io.open(CH, "w", encoding="utf-8").write(c)

print(run("git", "diff", "--stat", "--", ODQ, CH))
print("ODQ has addendum 52:", io.open(ODQ, encoding="utf-8").read().count("§934.47 addendum 52 —"), "| §934.64:", io.open(ODQ, encoding="utf-8").read().count("§934.64 —"))
