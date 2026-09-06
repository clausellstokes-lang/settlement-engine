# Website / WEB-3 — the referral loop emit wiring (member 3 of `W-A`)

- **Status:** LANDED
- **Landed at:** the `W-A` train's third car, on the lane tip held for the chair's CAS.
  Built by lane TE-WEB3 on 2026-08-23 at base `acc466a6` (holding tip
  `da9d9c40731fddc93ae4d03e12d742e36a3574a5`, four commits, pinned at
  `refs/preserve/holding-web3`). Do not redispatch. The census tuple in §8 and the
  implementation shas were re-derived from the hash AFTER the last edit at the slot, never
  carried across the rebase.
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `718e485529cdcfc6eff4c0b0e1e508bb31e1a994`
- **Last revalidated:** 2026-08-23 at `718e485529cdcfc6eff4c0b0e1e508bb31e1a994`
- **Landing note:** the verified base is the landing slot (WEB-2's landing, the 41st). The
  member was authored at `acc466a6e6c15ea904b47c50b2b41732b516b4b1` (WEB-4's landing) as
  `be07c6c3` (the member) + `fd1c617e` (this packet) + `7c97c51c` (the terminal-found cures)
  + `da9d9c40` (the §460.2 raise), and rebased onto the slot by lane TE-WEB3-LANDING as
  `b1ab1fbf26fd9dbbfa2f589d651be35f3547f544` (the member, with the edge-shared bundle set
  regenerated at the slot) + `9082bc8f` + `acc64db4a` + the commit that carries this re-stamp;
  43 landings crossed. Twelve of the twenty-nine delivered paths had moved under it — the three
  migration-doc figures, the rehearsal core and its test (WEB-2's 198 wave is the slot's; the
  199 wave and pins were re-applied on top), `INDEX.md`, the manifest, and all five edge-shared
  bundle `.meta.json` (the UC-stack's §475 regen) — every one resolved keep-slot + re-apply;
  the other seventeen are the SAME blob as the holding commit's. The census walker (§8) was
  written ONCE at this landing act, never carried. See §13.
- **Train:** `W-A` (telemetry and privacy), family **website/product-surface** —
  un-stamped, so any train carrying it holds the four-member cap.
- **Owner authority:** `OWNER_DECISION_QUEUE.md` **§359.8** (the ruling: "migration 107
  ships, nothing emits — the structural blindness"), ruled as compiled at **§402**, whose
  chair question **C5 is SIGNED** and judgment **J4 RATIFIED**: referral conversions
  derive read-side from the referral tables and no analytics write ever touches the money
  path. Compile of record: the website train's charter §3. The member's ONE STOP — the
  `title=` shrink-only census — is ruled at **§460** (see §5b).
- **Depends on:** **migration 198 (WEB-2), which lands FIRST by train order** — DISCHARGED at
  the slot: 198 is on the branch (ODQ §478) and 199 is contiguous on it natively. This member
  is authored at 199 and its docs figures are written to the LANDING state (199 migration
  files, contiguous to 199, head 199 is 78 ahead of applied head 121). See §11.
- **Collision group:** none with WEB-1 (`src/lib/consent.js`) or WEB-4
  (`scripts/telemetry/**`). WEB-2 shares no source path but DOES share four figure
  surfaces — `ARCHITECTURE.md`, `docs/CURRENT_STATE.md`, `docs/DEPLOY.md`,
  `scripts/ops/migrationRehearsalCore.mjs` — plus `tests/ops/migrationRehearsal.test.js`,
  because both members mint a migration. Every edit of this member on those five paths is
  figure-only and expects a resolve-to-199 conflict at the slot.
- **Behavior posture:** ADDITIVE OBSERVATION-SIDE on the client, READ-ONLY on the server.
  No engine byte, no seed motion, no golden re-record. Same-seed: **NEUTRAL**. No value
  moves anywhere: this member adds no writer to any table and changes no money path.

---

## §1 · THE RULING, AND THE BLINDNESS RE-MEASURED AT THIS BASE

§359.8's finding is exact and it is exactly telemetric. The MONEY loop is whole — 107's
RPCs, the webhook's `grant_referral`, the post-grant emails, the client field on three
surfaces — and **nothing observes it**. Re-measured at `acc466a6` by execution, not
inherited from the charter:

- `grep -i 'referr|refer_|invite|redeem|promo'` over `src/lib/analyticsEvents.js` → exit 1,
  **zero hits**. The same grep over `docs/analytics-event-dictionary.md` → exit 1, **zero
  hits**. The only referral token anywhere near the contract is
  `supabase/functions/_shared/referralEmails.ts:23`'s `ReferralParty` TYPE, which is not an
  event. Migration 157's `money_events` mirror names no referral kind.
- ⇒ **The charter's census is CONFIRMED and there is no STOP-RAISE.** No existing referral
  event under another name exists to re-scope around.

## §2 ⭐ THE CHOKEPOINT REFUTES THE CHARTER'S CALL SITES — THERE ARE THREE, NOT TWO

The charter placed the intent emit "in the PARENT after `referral.recordIntent()` resolves
(both call sites)". Measured here, that placement is both incomplete and unable to know
what it would be reporting.

- `useReferralIntent` is the **only** caller of `recordReferralIntent` in the whole tree.
- `recordIntent()` returns `Promise<void>` and swallows every rejection into local React
  state. A parent that awaits it cannot distinguish `recorded` from `rejected` from
  `error` without racing a state flush — so a parent-side emit could carry a surface but
  not an honest outcome.
- There are **three** invocation paths, not two: `PricingPage.jsx`'s buy,
  `PurchaseModal.jsx`'s buy, and `ReferralIntentField.jsx`'s own Record button, which is
  wired directly to `referral.recordIntent`. Two parent-side emits would have missed the
  third silently — an under-count that looks exactly like low referral interest.

⇒ The emit lives at the chokepoint and the call sites inject `surface`. This is the
charter's own rule ("the chokepoint wins"), which it applied to the redeem half and not to
this one. **A1b pins the totality**: every call site of the hook in the tree carries one of
the two enum values, so an unlabelled mount reds instead of emitting `surface: undefined`.

## §3 ⛔ STRUCTURE NEVER CONTENT, AND HERE THE CONTENT IS THE SECRET

107 is enumeration-hardened on purpose: unknown / inactive / expired / exhausted all read
back as one `invalid_code`, so the client cannot probe the code space, and a banned
referrer is indistinguishable from an unknown account number so the prompt cannot probe
moderation state. An event carrying the code string would hand an observer precisely the
oracle the RPC refuses to be.

- `redeem_code_checked` carries `{ outcome }` and nothing else. `already_used` folds into
  `invalid`: the ruled enum has three values, and a fourth would re-widen what 107
  deliberately collapsed.
- `referral_intent_recorded` carries `{ surface, outcome }`. The referrer's account number
  never enters a payload.
- **A3 pins the payload's KEY SET**, not a sampled value, so a code field added later reds
  even if no test ever reads it — which is exactly how mutant M2 is convicted.

## §4 ⛔ THE CONVERSION HALF EMITS NOTHING, BY RULING

`public.referrals` already holds the money-grade record of intent → grant → clawback:
written idempotently, claimed once, replay-safe. Migration **199** adds ONE read-only
report function over it — per-day counts, service_role only, no identity in the output —
and `AdminTrendsPanel` renders it through a new `admin-actions` route.

**REFUSED alternative, recorded:** a webhook-side `referral_converted` analytics event. It
would mint a second, weaker record of a money fact and put an analytics write on the money
path. The two-layer discipline and 107's single-writer posture both refuse it, and §402 C5
signed the refusal. **A8 proves the refusal structurally**, not by promise: zero analytics
import and zero `track(` under `supabase/functions/stripe-webhook/`, and the set of
migrations writing `public.referrals` enumerated from the corpus is exactly
`['107_referral_redeem.sql']`.

## §5 ⚠ THE CHARTER'S EDGE-BUNDLE LINE IS FALSE FOR THIS MEMBER

Charter §13 states that none of the train's targets is in the edge bundle. At this base
that is **refuted for WEB-3**: `scripts/build-edge-shared.mjs:35` names
`src/lib/analyticsEvents.js` as the `analyticsEventsBundle.js` entry, and
`tests/edgeFunctions/analyticsEventsBundle.freshness.test.js` drift-guards it. The member
therefore owes an edge-bundle regeneration, so this member has TWO generators and a
SEVEN-file generated artifact set, every one committed and none hand-edited:

| generator | artifacts |
|---|---|
| `npm run gen:analytics-dictionary` | `docs/analytics-event-dictionary.md` |
| `npm run build:edge-shared` | `analyticsEventsBundle.js` + `analyticsEventsBundle.meta.json`, and the four sibling `*.meta.json` (aiCharter / aiGrounding / aiOutputSchema / intentAtlas) |

⛔ **THE FOUR SIBLING METAS ARE PART OF THE MEMBER, AND MY FIRST INSTINCT WAS WRONG.**
`build:edge-shared` rewrites all six bundles' `generatedAt` while leaving four
`sourceHash` values unchanged, and I initially RESTORED those four on the reasoning that a
provenance stamp claiming a rebuild that did not happen is a small lie. The estate
disagrees, in writing and with a gate:
`tests/edgeFunctions/edgeSharedBundleReproducibility.test.js` (CR-EB-2 (b)) requires **all
bundles to share ONE build window** — `generatedAt spread is 49623.1s across the bundles —
some were not rebuilt with the rest` — because a stale sibling is the failure that actually
bites, and `generatedAt` records WHEN THE BUILD RAN, not whether a byte moved. Restored the
restore: one `build:edge-shared`, all six metas committed together. Found only by the
terminal, never by the four-tree sweep.

## §5b ⛔ THE ONE STOP: THE `title=` RATCHET — RAISED, THEN AUTHORIZED AT §460

`tests/domain/guidanceRegistry.walker.test.js`'s shrink-only census reads **486 against a
baseline of 485** at this member's tip. The cause is `<Card title="Referral funnel (intents
→ grants)">` in `AdminTrendsPanel.jsx` — a **React component prop, not a native OS
tooltip**, and `Card`'s ONLY heading API is that prop (`AdminTrendsCharts.jsx:37`, which
renders it into an `<h4>`), so A7's ruled mount cannot be expressed without it.

This is byte-for-byte the FP IN-1b situation the walker's own comment block records — and
that block also records the correct executor behaviour: the implementing lane **STOPPED on
this ratchet rather than raising it unbidden**, and the raise was authorized at CR-IN1B-8.
So the baseline was **left at 485**, the row was RAISED rather than self-authorized, and
the evidence handed over is the one IN-1b supplied, measured whole and never transcribed:

- `countTitles()` over base `acc466a6` = **485**; over this tip = **486**.
- Per-file delta, computed both directions across every `src/**` `.js`/`.jsx`:
  **`src/components/admin/AdminTrendsPanel.jsx`: 15 → 16, and NOTHING else moved.**

⇒ **RULED — the raise is AUTHORIZED at `OWNER_DECISION_QUEUE.md` §460**, on the ground the
raise was asked on: the funnel card's heading is a React `Card` prop rendered into an
`<h4>`, not a native tooltip, and A7's ruled mount cannot be expressed without it; the
IN-1b precedent applies exactly. **APPLIED** in the house form the walker's own comment
block documents — `TITLE_BASELINE` raised by exactly one, with the per-file receipt above
written into that block, both figures re-measured at the tip that carries the raise (the
base read taken from an integrity-checked `git archive` of `acc466a6`, never from the live
tree). `tests/domain/guidanceRegistry.walker.test.js` is therefore a **change path of this
member** and appears in the change manifest; it is the ONE STOP, discharged.

## §6 · SCOPE AND BOUNDARY (the non-goals, affirmatively)

- **ZERO** edits under `supabase/functions/stripe-webhook/`, proven by source scan.
- **ZERO** new writers on the referral tables, proven by corpus enumeration.
- **No RPC surface widened.** `validate_redeem_code`'s SELECT surface is untouched —
  widening it is the charter's STOP, and nothing here needed to.
- No research-class or market-class data; both events are essential and inherit track()'s
  existing `isClassAllowed` + DNT gate rather than re-implementing it.
- The funnel is admin-only; no non-admin surface renders it.
- No referral UI string is renamed or re-copied.

## §7 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the modal emits `referral_intent_recorded` with its own surface and the real outcome, strictly after the RPC settles; and EVERY call site of the hook carries one of the two ruled surface values |
| A2 | a failed intent emits outcome `error` while checkout completes anyway — proved with the RPC throwing AND the analytics provider throwing at once; a server rejection reads `rejected`, not `error` |
| A3 | redeem verdicts collapse to valid/invalid/error and the payload's KEY SET is exactly `['outcome']` — the code string appears in no emitted payload |
| A4 | the inherited gate silences both events when essential consent is off, and again under DNT |
| A5 | `EVENTS_REV` is 13, both events are essential, and the GENERATED dictionary carries both rows |
| A6 | `report_referral_funnel` counts intents/grants/clawbacks per day each from its own stamp, returns counts with no identity, is EXECUTE-able by service_role alone, and adds no writer |
| A7 | `AdminTrendsPanel` renders the funnel row, figures and all, from the report's own shape |
| A8 | the money path is structurally untouched: no emit under stripe-webhook, and the referral tables' writer set is still exactly migration 107 |

## §8 · DECLARED FIGURE MOVES

| figure | from | to | cause |
|---|---|---|---|
| `EVENTS_REV` | 12 | 13 | the two new events (a contract-shape change) |
| dictionary event totals | 130 total / 126 essential | 132 total / 128 essential | regenerated by `npm run gen:analytics-dictionary`, never hand-edited |
| `ARCHITECTURE.md` `migrations/** (N)` | 197 | **199** | migration 199, written to the LANDING state (198 lands first) |
| `docs/CURRENT_STATE.md` contiguous head | 197 | **199** | same |
| `docs/CURRENT_STATE.md` train blocker | head 197, 76 ahead | head **199**, **78** ahead | same, over applied head 121 |
| `docs/DEPLOY.md` current head line | `197_consent_person_adjacent_default.sql` | `199_referral_funnel_report.sql` | same |
| `MIGRATION_TRAIN_REPO_HEAD` | 197 | 199 | the new reviewed wave |
| `TITLE_BASELINE` (`tests/domain/guidanceRegistry.walker.test.js`) | 485 | **486** | the funnel card's `<Card title=…>` heading prop — a raise, authorized at §460 and applied in the walker's house form; see §5b. Re-measured at the tip in both directions: the whole delta is `AdminTrendsPanel.jsx` 15 → 16 |
| estate census `files/parked/credited/titles/suiteTitles` | 2,500 / 365 / 2,135 / 20,732 / 5,787 | **2,501 / 365 / 2,136 / 20,741 / 5,788** | delta `+1/+0/+1/+9/+1` — one new CREDITED test file with nine straight-line `test()` arms and one `describe`. `parked` does NOT move: the new file is a jsdom component test, not a runIf-gated suite |
| `tests/lint/.prose-numerics-baseline.json` | 3 rows at lines 253 / 372 / 372 | 258 / 383 / 383 | LINE SHIFT ONLY in `AdminTrendsPanel.jsx`; 413 rows before and after, no row added, removed, or re-categorised |

⚠ **THE CENSUS ROW IS CARRIED BY THIS PACKET, NOT BY THE COMMIT** (§417). The walker edit
was executed to green — each figure read from its own failure message, iteratively, in the
walker's own documented order — and then REVERTED, so
`tests/lint/sovereigntyLightingContract.walker.test.js` is byte-identical to base in the
member. The landing applies the tuple above and re-derives it at the slot. The path is
therefore **absent from the change manifest**, and that is doubly correct: MF-T2H is READY
and READY is non-terminal, so it RESERVES the walker and the validator refuses a second
claim on it — a member that had also written the walker could not have been packeted at
all until MF-T2H lands.

⭐ **RE-DERIVED AT THE LANDING SLOT (TE-WEB3-LANDING, 2026-08-23).** The slot `718e4855` reads
`2,511 / 366 / 2,145 / 20,817 / 5,802` (WEB-2's landing re-recorded the block above this
member's); the delta `+1/+0/+1/+9/+1` is what crossed, so the landed tuple is
**`2,512 / 366 / 2,146 / 20,826 / 5,803`** — the ONE live tuple line in the walker, convicted by
execution at the rebased tree (33/33, mutexed) with two negative controls: the slot's own
tuple put back reds at `files` ("expected 2512 to be 2511"), and `credited` alone put back at
the slot's 2,145 reds at `credited` ("expected 2146 to be 2145") — the proof that the new file
is COUNTED rather than parked; the file restored byte-identical both times. The walker `TEST`
row joins this change manifest only now, at LANDED: MF-T2H is still READY at the slot and
reserves the path, and a terminal status reserves nothing (the §410 order — walk first).

⚠ **A6's four arms are INVISIBLE TO THE CENSUS.** They live in
`tests/security/referralRedeem.pglite.test.js`, which is PARKED, so `credited` does not
move for them and their titles are not counted. They are real coverage the census cannot
see; a later lane attributing the `+9` by arithmetic would mis-attribute it.

## §9 · MUTANTS

| id | plant | conviction (executed) |
|---|---|---|
| M1 | the two new keys are filtered out of `EVENT_CLASS` — the derived-map analogue of "an event minted without an EVENT_CLASS row", because `EVENT_CLASS` is built from `Object.keys(EVENTS)` and a literally missing row cannot be written | the EXISTING registry totality walker convicts: `EVENT_CLASS keys are 1:1 with EVENTS keys — expected [ …129 ] to deeply equal [ …131 ]`, and A5 reds beside it |
| M2 | the code string joins the redeem payload | A3 reds on the key set: `expected [ 'outcome', 'code' ] to deeply equal [ 'outcome' ]` |
| M3 | the emit moves BEFORE `recordIntent`'s await | A1 reds on the payload and A2b reds with `expected 'error' to be 'rejected'` — the pre-await emit can only ever report the initial value, which is the whole defect |
| M4 | `report_referral_funnel` is also granted to `authenticated` | A6c reds: `expected true to be false` on `has_function_privilege('authenticated', …)` |

Each was planted, run, and restored; `shasum -a 256` before and after is identical for all
four target files, and a CLEAN-TREE CONTROL over the same three suites is green (70 tests).

## §10 · HAZARDS AND NOTES

- ⚠ **`tests/ops/migrationRehearsal.test.js` carries THREE absolute `197`-class figures,
  not one.** WEB-1's receipt names the relative `plan.waves.at(-N)` pins and the head/count
  pair; building this member found two MORE absolute pins at `:340-341`
  (`snapshot.repoHead` / `migrationCount`) and `:459` (`repoHead` in the plan-mode admission
  arm). Both are invisible until the chain is contiguous, because the plan throws first.
  The next migration-minting lane should expect all three.
- ⚠ **The migration bill is ELEVEN gates at this base, not ten.** WEB-1 enumerated ten;
  `tests/docs/migrationContiguity.test.js` is an eleventh that reds on a gap independently
  of `check-migration-head.mjs`. And a NEW EVENT owes a TWELFTH obligation nobody's
  migration bill names: `tests/docs/metricsRegistry.test.js` requires every `EVENTS` member
  to be a metric source or explicitly exempt. Discharged with a real metric (**M13**) rather
  than an exemption, because a funnel event whose stated analytical purpose is "none" would
  be the §320 class in a docs file.
- ⚠ Both new events are essential BY CONSTRUCTION: `EVENT_CLASS` is DERIVED from
  `RESEARCH_EVENT_KEYS`, so the charter's "+2 EVENT_CLASS rows" costs zero lines and the
  class cannot drift from the registry.
- ⚠ `RedeemBlock`'s `!isConfigured` early return emits NOTHING, deliberately: no check
  occurred, so there is no verdict to report.
- ⚠ §102.3 / E-A: the one new test file is
  `tests/components/referralFunnelTelemetry.test.jsx`, outside the seven `ENFORCER_DIRS`
  with a basename matching no `NAME_PATTERN` token, so **no mutation-coverage manifest row
  is owed** — measured against `tests/lint/mutationCoverage.shared.mjs`, not assumed.
- ⛔ **THREE MEMBER-CAUSED REDS EXISTED THAT THE FOUR-TREE SWEEP COULD NOT SEE**, and all
  three lived outside `tests/lint tests/build tests/docs tests/ops`: the `title=` census
  (`tests/domain/**`), the admin two-key walker and the bundle-reproducibility pin (both
  `tests/edgeFunctions/**`). WEB-1's lesson was "the sweep must include `tests/ops`"; this
  member's is that **`tests/domain` and `tests/edgeFunctions` belong in it too** whenever a
  member touches a UI prop or an edge function. Two were cured (below); one is the STOP.
- ⛔ **EVERY NEW `admin-actions` CASE OWES A TWO-KEY CLASSIFICATION.**
  `tests/edgeFunctions/adminActionTwoKeyWalker.test.js` requires the switch and
  `_shared/twoKey.ts` to agree EXACTLY, so a new route with no classification reds — the
  right shape, since the unclassified default for an admin action should never be "assume
  harmless". `get_referral_funnel` is UNGATED with its reason written beside it: a
  read-only per-day aggregate that moves no value and writes nothing.
- ⛔ **A LANDED PACKET'S `requiredSymbols` TRAPPED THIS MEMBER, exactly as the estate's own
  law warns.** WEB-1 (LANDED) pins the literal `197_consent_person_adjacent_default.sql` in
  `docs/DEPLOY.md` — but that filename lives there ONLY as the "Current migration head"
  line, which every subsequent migration is REQUIRED to move. So the next migration in the
  estate could not both satisfy `deployRunbookFreshness` and leave WEB-1's pin resolvable.
  Cured here by adding one truthful operator sentence naming 197 as the head this line
  replaced (and why its own preamble is worth reading — it is a DATA migration). The cure is
  honest, but the shape is not: **a re-recorded FIGURE must never enter `requiredSymbols`**,
  and WEB-2 will hit the identical wall at 198. Raised for the chair.
- ⚠ **Budget, stated loudly rather than renegotiated quietly.** PACKET_STANDARD caps a
  dispatch unit at twelve handwritten files; this member lands at **eighteen** — ten of its
  own plus eight the migration mint compels (three docs figures, the rehearsal core and its
  test, the prose-numerics baseline, the metrics registry, and the packet's own INDEX/
  manifest pair). The smallest available split is client-emit / read-layer, and it is NOT
  taken here for two reasons the executor cannot rule on: `W-A` is already at the un-stamped
  four-member cap, so a fifth car needs a chair act; and the single acceptance file spans
  both halves, so splitting costs a second new test file against the same rule. **The chair
  owns this conflict; the member is severable at the file level if it wants to split.**

## §11 ⛔ THE 198 DEPENDENCY, AND WHAT WAS PROVED WHERE

**DISCHARGED AT THE SLOT (§13):** WEB-2 landed at `718e4855` (ODQ §478), so at the verified
base `ls supabase/migrations` ends 196 / 197 / 198 with no foreign `199_*`, and this member's
199 is contiguous natively — the four build-state reds below are history, and the carry was
never needed at the landing. The rest of this section records the BUILD state as it was.

Migration 198 (WEB-2) was not on the branch at the build base and landed FIRST. Four gates
therefore redded at this member's build tip, all for the one reason, each with its exact text:

| gate | red at the tip | green under the carry |
|---|---|---|
| `check-migration-head.mjs` | `migration numbering has gaps: 198. A missing migration file corrupts the ordered-apply contract.` | `repo migration head = 199 (199 files, contiguous)` |
| `tests/docs/migrationContiguity.test.js` | `expected [ 198 ] to deeply equal []` | pass |
| `architectureFreshness` + `docCounts` | `expected 199 to be 198` (both) | pass |
| `tests/ops/migrationRehearsal.test.js` | `Error: Migration chain is not contiguous at 197 → 199` — a throwing `beforeAll` collects ZERO tests, which the ratchet's SCOPE SENTINEL turns into a full-gate red | 13 passed |

**The carry, and why it is two artifacts.** `buildMigrationRehearsalPlan` throws on a
non-contiguous chain AND on a wave set that fails to cover every pending migration, so
carrying only the SQL file would not have made the tree provable. The lane therefore
carried WEB-2's `198_retention_numbers.sql`
(sha256 `d96a1065c505b2f8ebfe054015be1dd7ca3f38d69f8a614af54fe68d4bd8cb6a`) **and** its
`retention-numbers` wave object, byte-exact from the sibling worktree, ran the full bill
green, then removed both. **Neither is in this member's change manifest and neither is in
the commit**: the delivered `migrationRehearsalCore.mjs` contains zero occurrences of
`retention-numbers`, and the working tree is empty at the tip. The carry state IS the
landing state, which is why the docs figures are written to it.

## §12 · CHECKS

```
npx vitest run tests/components/referralFunnelTelemetry.test.jsx \
  tests/security/referralRedeem.pglite.test.js tests/lib/analyticsTaxonomy.test.js \
  tests/lib/analytics.test.js tests/docs/analyticsDictionaryFreshness.test.js \
  tests/edgeFunctions/analyticsEventsBundle.freshness.test.js \
  tests/docs/metricsRegistry.test.js
npx vitest run tests/lint tests/build tests/docs tests/ops
npx eslint src/lib/analyticsEvents.js src/hooks/useReferralIntent.js \
  src/components/account/ReferralRedeemBlocks.jsx src/components/admin/AdminTrendsPanel.jsx \
  tests/components/referralFunnelTelemetry.test.jsx
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run check:observed-shape-readers
npm run validate:packets
npm run check:tail
```

## §13 · THE LANDING SLOT

- **Rebase:** `git rebase --onto 718e4855 acc466a6 HEAD`, detached, the four holding commits
  carried as authored. Carry-proof at blob level FIRST (braced `${sha}:path`, with non-vacuity
  controls: `package.json` / `package-lock.json` identical at base and slot — no mint trigger
  crossed; a nonexistent path reads ABSENT; the known-moved census walker reads as moved).
  Twelve of twenty-nine delivered paths had moved at the slot and every one was resolved
  keep-slot + re-apply: `ARCHITECTURE.md` `(198)` → `(199)`; `docs/CURRENT_STATE.md` both
  figures → contiguous to 199, head 199 is 78 ahead of 121; `docs/DEPLOY.md` head line →
  `199_referral_funnel_report.sql` with WEB-2's "Read these preambles before the push" section
  kept verbatim (the build's extra sentence naming 197 as "the head this line replaced" was
  DROPPED at the slot — it would have been false, 198 is the head this line replaced, and the
  preambles section already names 197 for WEB-1's pinned symbol); the rehearsal core keeps
  WEB-2's `retention-numbers` wave and appends `referral-funnel-report` with head 199; the
  rehearsal test keeps WEB-2's 198 block at `.at(-2)` (its header retitled "198 IS …", the same
  edit WEB-2 made to 197's) ahead of this member's 199 block at `.at(-1)`, every relative pin
  shifted by two and the three absolute figures at 199 / 78; `INDEX.md` keep-both (this row
  between RR-2 and WEB-4, where the build placed it); the manifest = the slot's bytes + this
  row appended by string surgery, never re-serialized (164 → 165, ADDED=["WEB-3"], REMOVED=[],
  DRIFTED=[]).
- **The edge-shared bundle set (§475 law):** `src/lib/analyticsEvents.js` is a rostered input
  of `analyticsEventsBundle`, and all five `.meta.json` had moved at the slot (the UC-stack's
  regen at 11:54:54Z). `npm run build:edge-shared` was run ONCE at the commit-1 stop of the
  rebase, so the member commit carries ONE coherent set: the three UC-0 bundle `.js` byte-
  identical to the slot's, `analyticsEventsBundle.js` byte-identical to the build's, the five
  metas within one builder window; the build's later re-stamp of the four sibling metas
  (7c97c51c) resolved keep-ours (the regen), so that commit carries no meta change.
- **The sibling contract that trapped this landing (raised, cured in-train, vetoable):**
  `validate:packets` at the re-stamped tree redded on THREE rows of WEB-2's LANDED
  `requiredSymbols` — `MIGRATION_TRAIN_REPO_HEAD = 198`, `**migrations/** (198)`,
  `migrations are contiguous to 198` — each a pin on the current migration-head FIGURE that
  199 is required to move. The §455.2 / §478.3 class, one specimen wider (figures, not a
  filename). Cured as those rulings cure it: the three rows deleted inside WEB-2's manifest row
  span with the citation written into WEB-2's packet §11; WEB-2's `docs/DEPLOY.md` filename row
  left for HK-A's landing act as §478.3 ruled (the slot's preambles section satisfies it). No
  other row of any packet moved. RAISED for HK-3: the validator guard must refuse a
  migration-head FIGURE pin on these three paths, not only a filename pin on a doc.
- **The status walk:** READY → LANDED at the re-stamp, FIRST, so the walker `TEST` row could
  join the manifest (§8). `verifiedBase` → the slot sha in the header and the manifest row,
  scoped to this row's span — WEB-5's `acc466a6` row at the slot untouched.
- **The migration bill at the slot:** the twelve gates re-run mutexed at the rebased tree with
  per-file verdicts; S0 two-part; the widened sweep; the terminal — all in the lane receipt
  (`laneTEWEB3-receipt.md`, "THE LANDING SLOT").
