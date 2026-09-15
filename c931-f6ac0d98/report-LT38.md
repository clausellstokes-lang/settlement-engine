# LT38 — the landing page and first-contact ladder — LANE REPORT (LIVE; updated per car)

**Seat:** Opus 5 (1M context), resumed after the previous Opus 5 seat was killed by a usage
limit at ~06:02 EDT with car 3 staged but uncommitted.
**Dock:** `.../4e3d2f70-.../scratchpad/kit/lane-LT38-ladder`, detached, cut at `f73bdbf16`
(`claude/composite-r4`, THE BUILD SLOT). Never rebased, never merged; the chair cherry-picks.
**Tip:** `edd7361cf`. **Porcelain 0.** LANE CLOSED at the chair's order of 16:5x EDT.

## THE CARS, IN ORDER

| car | sha | state |
|---|---|---|
| 1 | `3b363bd02` | LANDED (previous seat) |
| 2 | `646da630f` | LANDED (previous seat) |
| 2 census | `0676efe9f` | LANDED (previous seat) |
| **2 follow-up** | **`be28f2011`** | **LANDED (this seat) — a typecheck regression car 2 left behind** |
| **3** | **`52cfa319f`** | **LANDED (this seat)** |
| **3 census** | **`8ff904dbd`** | **LANDED (this seat)** |
| **4** | **`4b3a6c1c0`** | **LANDED (this seat)** |
| **5** | **`00e601c9a`** | **LANDED (this seat)** |
| **5 census** | **`edd7361cf`** | **LANDED (this seat)** |
| 6–16 | — | **NOT DONE — lane yielded; deferred and recorded below** |

---

## CAR 2 FOLLOW-UP — `be28f2011` — the scope registry's type is DECLARED

*Files:* `src/lib/momentScope.js` (+21, JSDoc only; the registry rows, the render predicate,
the fail-closed branch and `DECLARED_SCOPE_VIEWS` are byte-identical).

**FOUND BY RUNNING A GATE STEP THE DEAD LANE'S CAR 2 NEVER RAN.** `npm run check:quick`
reported `src/lib/momentScope.js: 1 error(s) (baseline 0) — +1` against `tsconfig.full.json`:

    src/lib/momentScope.js(376,59): error TS2367: This comparison appears to be
    unintentional because the types 'readonly string[]' and 'string' have no overlap.

The cause is the finding car 2 itself recorded: **no moment is GLOBAL at this tree**, so
TypeScript read the registry's value type off today's census and concluded `scope` is always
a view-id array — which makes `r.scope === GLOBAL` a comparison between non-overlapping
types. New and un-baselined files must be typecheck-clean, so the file reddened the ratchet
from the moment car 2 landed.

**The cure is the law, not the silencer.** Deleting the comparison or casting at the call
would have deleted law 3's cross-page branch on the grounds that nobody has used it YET —
the same inference trap the file's own header warns about one law up ("travelling is SAID,
never inferred"). The ROW TYPE is now declared (`scope: readonly string[] | typeof GLOBAL`)
and `MOMENT_SCOPES` carries `@type {Readonly<Record<string, Readonly<MomentScopeRow>>>}`.

**JUDGMENT (vetoable): chose a `Record<string, …>` over preserving the literal key union,
because** every consumer reads the registry through `Object.keys` / `Object.entries` /
`hasOwnProperty` (pricingMoments.js, the walker's four census arms, `momentIsDeclared`), the
key set's authority is the walker's two-way runtime equality with the copy registry rather
than a type, and the alternative (`@satisfies`) CHECKS without WIDENING, so it would not have
fixed the comparison at all.

*Gate (verbatim):*

    uptime at gate start:  12:15  up 2 days, 16:07, 1 user, load averages: 5.43 57.16 68.23

    $ GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 \
        tests/lint/momentScopeRegistry.walker.test.js tests/ui/pricingMomentRouting.test.jsx \
        tests/lint/mutationCoverageManifest.test.js tests/lint/sizeBaseline.test.js
     Test Files  4 passed (4)
          Tests  31 passed (31)
       Duration  19.83s

    $ npm run check:quick
      validate-packets: exit 0, 714 ms
      typecheck-full: exit 0, 24740 ms     <- was exit 1 (+1 on momentScope.js) before this commit
      typecheck-domain: exit 0, 15750 ms   <- no strict-type regressions (1120 errors, ceiling 1120)
      lint-changed: exit 0, 1587 ms

    $ npm run lint
      31 problems (0 errors, 31 warnings)  <- all pre-existing; none in a file this lane touched

    size: src/lib/momentScope.js = 253 effective lines vs the 800 lib-layer ceiling, so NO
    baseline entry (sizeBaseline's exact-set arm green above).

    uptime at gate end: 12:16  up 2 days, 16:07, 1 user, load averages: 5.35 49.96 65.01

---

## CAR 3 — `52cfa319f` — LD-10's real remainder

*Files:* `src/components/PrivacySettings.jsx`, `tests/components/privacyPolicyParity.test.js`,
`tests/ui/privacySettings.test.jsx`, `docs/FIRST_CONTACT_BACKLOG.md`.
(+178 / −24 across four files.)

**No consent default moved and none may** — that is the owner's call alone. What moved is the
truth defect §359.6's flip left pointing the other way: four in-app statements told every new
account its research toggle was ON when the product ships it OFF. All four are restated to the
shipped opt-IN posture, and the research row's TITLE — "You're helping improve the generator",
a statement of fact about the reader that is false for every new account — becomes "Help
improve the generator", an invitation that is true in both states.

**The class is closed, not just the instance.** `privacyPolicyParity.test.js` named this exact
blind spot in its own header ("CANNOT-CATCH: … consent BEHAVIOR changes (consent.js defaults)")
and then took the defect it predicted. It now binds the settings copy to `getConsent()`'s live
answer as a **biconditional**, so a future flip back to opt-OUT that left "off by default"
standing reds too. The shipped default is READ from the module that decides it, never restated.

**`legal/PrivacyPage.jsx:26` and `:56` are deliberately untouched** — owner + counsel gated.
The gap is named in the test header and in the LD-10 blockquote, with the proposed minimal
truth-restoring edit recorded for the owner.

### ⭐ THE WIDE GATE CAUGHT A RED THE FOCUSED ONE STRUCTURALLY COULD NOT
`tests/lint/` whole reddened `negativeAssertionAnchor.walker.test.js`: the new describe added
FOUR bare absence assertions over a source string, against a file frozen at a ceiling of TWO.
**THE CEILING WAS NOT RAISED.** Every absence is now anchored, and the anchors are ASSERTIONS
rather than markers wherever one could be written — each arm asserts the ROW IS PRESENT in the
scanned source (`id="research" title=`, `id="market" title=`) before asserting what the copy
must not say, and the title arm gained the POSITIVE that is the stronger half of the pair
(the row must CARRY the invitation title; banning only the old title would go green on a row
whose title attribute had been deleted outright).

*Gate (verbatim):*

    uptime at gate start:  11:37  up 2 days, 15:29, 1 user, load averages: 4.54 3.28 3.80

    $ ... npx vitest run --maxWorkers=2 tests/lib/consent.test.js \
        tests/components/privacyPolicyParity.test.js tests/ui/privacySettings.test.jsx
     Test Files  3 passed (3)
          Tests  34 passed (34)
       Duration  1.83s

    $ ... npx vitest run --maxWorkers=2 tests/components/ tests/lint/
     Test Files  2 failed | 411 passed (413)
          Tests  2 failed | 4337 passed (4339)
       Duration  624.30s
      (a) negativeAssertionAnchor — CURED IN THE COMMIT and re-proved below
      (b) sovereigntyLightingContract "expected 24189 to be 24185" — this car's own four
          new titles; the re-freeze is its own commit, 8ff904dbd

    $ ... npx vitest run --maxWorkers=2 tests/lib/consent.test.js \
        tests/components/privacyPolicyParity.test.js tests/ui/privacySettings.test.jsx \
        tests/lint/negativeAssertionAnchor.walker.test.js
     Test Files  4 passed (4)
          Tests  43 passed (43)
       Duration  4.04s

    $ ... npx vitest run --maxWorkers=2 tests/copy/       <- the chair's gate addendum
     Test Files  1 failed | 9 passed (10)
          Tests  1 failed | 120 passed (121)
       Duration  24.82s

    $ npm run lint        -> 31 problems (0 errors, 31 warnings), all pre-existing
    $ npm run check:quick -> validate-packets 0 · typecheck-full 0 · typecheck-domain 0 · lint-changed 0

    uptime at gate end: 12:16  up 2 days, 16:07, 1 user, load averages: 5.35 49.96 65.01

---

## CAR 3 CENSUS — `8ff904dbd`

titles 24185 → 24189 (four new `it`), suiteTitles 6455 → 6456 (one new `describe`);
files / parked / credited unchanged (no test file added or removed). Refrozen at
`52cfa319f` on the clean tip; the refreeze FAILS BY DESIGN and the receipt is the plain
re-run: `Test Files 1 passed (1) · Tests 34 passed (34) · Duration 3.22s`.

---

## ⛔ FINDINGS FOR THE CHAIR (not this lane's to fix)

1. **`tests/copy/voiceMechanics.test.js` IS RED AT THE BUILD SLOT, INHERITED AND BANKED.**
   Its per-file Tier-2 arm reports `src/domain/display/labelBands.js` (em 0 → 5) and
   `src/domain/display/stateProse/generalStateProse.js` (em 0 → 3). **PROVEN NOT MINE:** both
   files are byte-identical at `f73bdbf16`, at my dock's HEAD and in the working tree, and
   neither was touched by any LT38 car. The row is banked in
   `scripts/.test-ratchet-baseline.json` at ODQ §900 by the Fable chair with OWED_CEILING +1
   ("a producer's authored dashed vocabulary as map keys and parsed delimiters"), structural
   cure recorded as §901. **Consequence for the chair's gate addendum: `tests/copy/` WHOLE can
   never print a clean count on this slot** — the honest reading is `1 failed | 120 passed
   (121)` with that one row named. The Tier-3 `src/**/*.jsx` E-E arm the addendum is aimed at
   PASSES, and that is the arm I will quote per car.
2. **A SIBLING LANE IS TAKING THE EXCLUSIVE MUTEX TIER FOR TARGETED RUNS.** At 11:51–12:03 a
   lane held `/tmp/settlementforge-vitest-gate.502.lock` for a 21-file targeted run
   (`voiceMechanics`, `testRatchet`, `relationshipChronicleSection`, `centuryLegSoak`, … — it
   reads as LT39) with no `GATE_MUTEX_TIER=shared`, blocking every shared entrant for 20
   minutes and driving load to 128 (peak 300 on 8 cores). `docs/LANE_LAW_ADDENDUM_EFF1.md` §2
   is the incantation that exists to prevent exactly this.
3. **`src/components/PrivacySettings.jsx:205` ships `title="AI-prose research (coming later)"`**
   — a player-facing 'AI' string. It is OUT of car 4's named scope and out of car 3's: the
   `ai_prose` tier is a consent-model member named in `consent.js`'s `CONSENT_TIERS`, in the
   privacy policy, and in `privacyPolicyParity`'s roster arm, so renaming its user-facing label
   is a consent/legal-surface coordination, not a copy edit. **Deliberately deferred —
   documented, not a bug to re-find.**


---

## CAR 4 — `4b3a6c1c0` — the residual "AI" language

*Files:* `src/copy/en.js`, `src/components/settlement/AIInlineCard.jsx`,
`src/components/settlement/VersionsTab.jsx`, `src/components/HowToUse.jsx`,
`src/components/SettlementDetail.jsx` (+39 / −17).

Two of the backlog's three premises had moved, and reading the tree first is what found it.
The shared CTA is ONE line (`polishCta: 'Polish with AI'` → `'Refine narrative'`, the house
term already at en.js:160/:923/:1244 and the pair of `regenerateCta: 'Regenerate narrative'`)
and it moves BOTH consumers without either file being touched. **The export labels were never
a rename**: no control in `src/` is called "Narrative AI Prompt" or "Map AI Prompt", so the
guide was describing controls that do not exist and the fix is a DESCRIPTION REPAIR against the
real surface (ExportSheet's cuts and formats, the Foundry module, Export Image, the map
toolbar's own Download map (PNG)). "The purple button" now names the action.

**One site the record did not list was FALSE, not merely off-voice.** `VersionsTab.jsx:122`
said "Exported (PDF / JSON / AI prompt)"; the product exports neither JSON nor a prompt, and
the label omitted the two exports that DO stamp the timestamp. `markExported` has exactly
three callers (SettlementDetail.jsx:431 and :464, generate/ExportDraftButton.jsx:77).

### ⭐⭐ THE GATE CAUGHT A BUG I PUT IN — the best receipt in this lane so far
`tests/lint/observedShapeReaders.walker` (the reader-with-no-writer ratchet) reddened in three
arms: stale 1, reads 1971 vs a frozen 1972, cohort counts 191 vs 192. The governed checker
named it in one line — `"lastExportAt on campaignState" is 1 against a frozen count of 2` —
and the cause was that rewriting the label had **silently dropped `ts: cs.lastExportAt`** from
the entry object, so the export milestone would have rendered with no timestamp *in a timeline
sorted by time*. The component's own suite could not have seen it. Restored; the scan now reads
`1972 finding(s), exactly matching the frozen inventory`, and NO baseline was re-frozen because
the correct count never moved.

*Gate:* `tests/components/ tests/ui/ tests/lib/ tests/copy/ tests/lint/` →
`3 failed | 746 passed (749)` / `5 failed | 7175 passed (7180)`; all three red files resolved —
observedShapeReaders cured and re-proved (`8 passed (8)` / `113 passed (113)`),
observedShapeSentinel a 20 s timeout at load 129 re-measured ALONE (`1 passed` / `33 passed`,
16.18 s), voiceMechanics the inherited banked §900 row. `tests/copy/` re-run at the final tree:
`1 failed | 9 passed (10)`, byte-identical failure list. lint 0 errors; check:quick all exit 0.
No test file changed, so no census re-freeze owed.

---

## CAR 5 — `00e601c9a` (+ census `edd7361cf`) — LD-11, nav reset-on-self-click

*Files:* `src/lib/routes.js` (the declaration + `NAV_RESETS`/`resetKindFor`),
`src/hooks/useRoute.js` (`navigateSelfClick`), `src/store/uiSlice.js` (`navResetRequest` +
`requestNavReset`/`clearNavReset`), `src/components/GenerateWizard.jsx` (the Create answer),
`src/App.jsx` (one line), five sibling suites' `useRoute` mocks kept valid, and a new
`tests/components/navResetOnSelfClick.test.jsx`.

Two declared kinds — `RESET_ROUTE` (the URL is the whole of it; five sections) and
`RESET_SECTION` (Create alone, because its dirty guard `pendingExit` is component-local and a
reset dispatched from App could not have raised that dialog). The nonce App.jsx's own note
promised is `uiSlice.navResetRequest`. **App.jsx is NET ZERO, measured with eslint's own Linter:
650 before, 650 after** — no baseline moved.

⭐ Four planted mutations, each restored by file copy and cmp-verified byte-identical, with a
restored-baseline control: BASELINE 12 passed · M1 strip one `reset` declaration → 3 failed
(TOTALITY + both route arms, because they drive the REAL router) · M2 dispatch stops failing
closed → 1 failed · M3 wizard bypasses its dirty guard → 1 failed · M4 wizard answers any
section's request → 1 failed · RESTORED 12 passed.


**It lands LIT** (owner, 16:5x): the car has no dial to light — no flag, no flagRegistry
entry — and it adds **no user-facing string at all**, so the em-dash rule has nothing to
bite on (every em dash in the diff is in a `//` comment or a test title; the only `!` are
operators, verified by parsing each added line).

*Gate (verbatim):*

    uptime at gate start:  17:14  up 2 days, 21:06, 1 user, load averages: 7.52 20.95 25.81

    $ ... npx vitest run --maxWorkers=2 tests/components/ tests/ui/ tests/lib/ tests/copy/ tests/lint/
     Test Files  5 failed | 745 passed (750)
          Tests  12 failed | 7180 passed (7192)
      (a) createWorkflowRail + generateWizardFocus — THE REAL BREAK, cured in the commit
      (b) entropyRootCensus.walker — two 20 s timeouts under contention
      (c) sovereigntyLightingContract — this car's one new test file
      (d) voiceMechanics — the inherited banked §900 row

    $ ... npx vitest run --maxWorkers=2 tests/lint/entropyRootCensus.walker.test.js   (ALONE)
     Test Files  1 passed (1) · Tests 31 passed (31) · Duration 7.64s

    $ ... npx vitest run --maxWorkers=2 <the 11 suites this car can reach>
     Test Files  11 passed (11) · Tests 174 passed (174)

    $ npm run lint        -> 31 problems (0 errors, 31 warnings); the count did not move
    $ npm run check:quick -> validate-packets 0 · typecheck-full 0 · typecheck-domain 0 · lint-changed 0

    SIZE (eslint's own Linter, the enforcer's rule):
      src/App.jsx                        650 -> 650   ⭐ NET ZERO on a file frozen at 650
      src/components/GenerateWizard.jsx  414 -> 427   (600 ceiling, unbaselined)
      src/lib/routes.js                  168 -> 176   (800)
      src/hooks/useRoute.js               47 ->  65   (800)
      src/store/uiSlice.js                25 ->  33   (800)
    No ceiling crossed, no baseline number moved.

    uptime at gate end: 17:38  up 2 days, 21:29, 1 user, load averages: 8.20 6.55 10.94

**Census `edd7361cf`:** files 2564 → 2565, credited 2189 → 2190, titles 24189 → 24201,
suiteTitles 6456 → 6459, parked unchanged. Refrozen at `00e601c9a`; the plain re-run is the
receipt — `Test Files 1 passed (1) · Tests 34 passed (34) · Duration 5.11s`.

---

# ⛔ CARS NOT DONE — DEFERRED AND RECORDED, NOT DROPPED

The lane yielded its slot at the chair's order of 16:5x EDT (the simulation is prioritised).
**Cars 6 through 16 of the brief were not started.** What the next implementer needs:

- **CAR 6 — the per-page polish tranche.** I re-verified the backlog's sites at the tree.
  Live and editable: `PREMIUM_PITCH` (SaveQuotaMeter.jsx:26, centralized and test-asserted),
  the war-weary pip's raw-decimal `title=` (LivingWorldSignalRow.jsx:133 —
  `` `War-weariness: ${band} (${value.toFixed(2)})` ``, exactly the row the backlog flags),
  `Basic Generate` (generate/ModeSelector.jsx), `inactive retained`
  (account/AccountSubscriptionSection.jsx), `Revert to Raw` (SettlementDetail.jsx).
  ⚠ **TWO BACKLOG ROWS ARE STALE:** "Viability Score" and "AI prose pass" resolve NOWHERE in
  `src/`. Do not go looking for them.
- **CARS 7–10 — LD-5a–d** (nav cells as real anchors, the Compendium/About/Account/Gallery
  menus). Un-started. LD-5's spec is at `docs/FIRST_CONTACT_BACKLOG.md:668-843` and the brief
  summarises it correctly; the ribbon is `src/components/nav/NavRibbon.jsx:153-220`.
  ⭐ **Car 5 helps car 7 directly:** `viewToPath` is now joined by `resetKindFor`/`NAV_RESETS`
  on the same `nav` block, so the anchor conversion and the self-click reset read one table.
- **CAR 11 — THE GATE CAR** (decompose `OutputContainer.jsx`). Un-started and still the
  blocker for 12–15. RE-MEASURED at this dock: it is at **exactly 600 of its 600 layer
  ceiling** with zero headroom and no baseline entry, so one added effective line makes it a
  NEW offender. The brief's two extraction hazards are real and I confirmed both by reading:
  `tests/ui/dossierTabGroups.walker.test.js:25-38` reads the file BY PATH and regex-matches
  `TAB_GROUPS` plus ≥15 tab objects IN THAT FILE, and `collectChronicle` (:157-200) is
  imported across the boundary by `tests/components/publicChronicleTab.test.jsx:41`. The
  cleanest leaf I found is the **dossier-reading-analytics block at :607-675** (three effects
  plus `dwellMsBand`/`readSessionRef`) — self-contained, touches no TAB_GROUPS text and no
  exported symbol.
- **CARS 12–15 — LM-1/2/3 and LD-4.** Un-started, and BLOCKED ON CAR 11 by construction (the
  `demoMode` prop cannot thread through a file at 600/600). `docs/DESIGN_LIVING_MINIATURE.md`
  is the binding spec and its §11 conditional escalation still stands: if LM-2's build-time
  tab-set enumeration shows the demo mount's tabs differ from the /create draft view's, that
  delta is a chair ruling BEFORE LM-2 lands.
- **CAR 16 — LD-3b, the two ribbons.** Un-started. ⚠ App.jsx is at exactly 650 and car 5 spent
  its margin to stay net-zero, so the ribbon mount must pay for itself with an extraction.

## THE WEATHER, because it will shape the next lane's estimate
Four lanes plus the chair's landing chain shared 8 cores all afternoon. One-minute load ran
between 2 and **300**; a `tests/components/ + tests/lint/` run took **624 s** at load 40 and
produced a cascade of false reds at load 200. Two rules earned their keep and should be
treated as binding, not advisory: **every targeted run takes the SHARED tier at a hard
worker cap of 2**, and **every timeout red is re-measured ALONE before it is believed** —
four separate walkers reddened on 20 s timeouts today and every one of them passed alone.
