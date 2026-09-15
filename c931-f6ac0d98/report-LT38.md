# LT38 — the landing page and first-contact ladder — LANE REPORT (LIVE; updated per car)

**Seat:** Opus 5 (1M context), resumed after the previous Opus 5 seat was killed by a usage
limit at ~06:02 EDT with car 3 staged but uncommitted.
**Dock:** `.../4e3d2f70-.../scratchpad/kit/lane-LT38-ladder`, detached, cut at `f73bdbf16`
(`claude/composite-r4`, THE BUILD SLOT). Never rebased, never merged; the chair cherry-picks.
**Tip at last update:** `8ff904dbd`. Porcelain 0.

## THE CARS, IN ORDER

| car | sha | state |
|---|---|---|
| 1 | `3b363bd02` | LANDED (previous seat) |
| 2 | `646da630f` | LANDED (previous seat) |
| 2 census | `0676efe9f` | LANDED (previous seat) |
| **2 follow-up** | **`be28f2011`** | **LANDED (this seat) — a typecheck regression car 2 left behind** |
| **3** | **`52cfa319f`** | **LANDED (this seat)** |
| **3 census** | **`8ff904dbd`** | **LANDED (this seat)** |
| 4–16 | — | in progress |

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
