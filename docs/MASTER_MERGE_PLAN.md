# THE MASTER MERGE PLAN — review-fixes-2026-07-08 × master reconciliation
## The full map for the endgame's highest-risk item. PLAN ONLY — nothing here has been executed.
### Fable 5, 2026-07-14. Read-only survey of both lineages; every claim carries a hash. A successor session executes from THIS document + fresh `git log`/`git status`, never from a session digest.

---

## §0 STATUS + HOW TO USE THIS DOCUMENT

- **This is a reconciliation MAP + step-ordered execution plan.** No merge has been performed.
  No code was changed by the planning session. All facts below were gathered read-only
  (git plumbing + file reads + an in-memory `git merge-tree --write-tree` simulation that
  touched no worktree and no refs).
- **Surveyed tips (re-verify before executing — both lineages move):**
  - `review-fixes-2026-07-08` @ **5a78af5a** ("Ledger: A-wave telemetry merge gate verdict") — "RF" below.
  - `master` @ **d024286e** ("Merge pull request #47 from clausellstokes-lang/fix/review-remediation") — tip authored 2026-07-05; observed unmoved through 2026-07-14.
  - merge-base **acf59a00** (the Phase 3 seal) — "BASE" below.
  - Divergence: master is 308 commits past BASE; RF is 343 past BASE; histories fully disjoint since BASE.
  - Local RF is **75 commits ahead of `origin/review-fixes-2026-07-08`, 0 behind** (intentional
    branch-lag; push is owner-gated).
- **Owner's endgame directive** (memory/handoff-plan-post-ladder): harden → master merge → the owner
  asked for a **GitHub PR** ("do a pull request to github") rather than a raw local merge+push.
  Deploy lands un-soaked (owner-chosen); soaks + tuning are the NEXT AI's scope.
- ⚠️ **LIVE DRIFT OBSERVED DURING THE SURVEY ITSELF:** review-fixes advanced 3 commits past the
  pinned tip while the sweeps ran — 88dac334 (Analytics V2 wave A1), cf65a3c1 (deletes
  CampaignStatePanel.jsx + MemberSettlementsList.jsx — see §4.4, this creates a REAL dangling
  import against master's silently-added MapGalleryDetail.jsx), 9fe425a7 (**budget ratcheted
  again: 1,216,350 → 1,215,520**). 5a78af5a remains an ancestor (fast-forward). Every budget
  figure below is stated at the pinned tip; **re-read the live budget const at execution time.**
- If any §1 topology fact no longer matches `git log` at execution time, STOP and re-survey — this
  plan's dispositions bind to the surveyed tips. The tree is under active parallel development;
  expect further drift.

---

## §1 TOPOLOGY + PROVENANCE (why this merge is unusual)

Three lineages share one repo (memory/third-lineage-mystifying-ride):

1. **BASE = acf59a00**, the Phase 3 seal. Everything diverges from here.
2. **master** — carries the settlementforge-export lineage: a **201-commit religion arc** built by a
   parallel claude.ai session (branch `claude/mystifying-ride-90b338`, fully merged into master,
   0 unique commits left), **plus ~107 post-arc commits** of review-remediation and money features
   (PRs #42–#47, referral/redeem migration 107, PDF entitlement ladder 108, deploy-gate + security
   fixes, applied-head marker @ cd6eb1bc, deploy-gate fail-closed @ 45a2e33b, CI dist contracts
   @ a50efa2e — see §4.5). **Master is the linked/production checkout's chain** (ruling #1).
3. **RF = review-fixes-2026-07-08** — the Phase-5.5 lineage. Crucially, RF is NOT a stranger to
   master's content: the staged **merge program (waves 1–5b, docs/MERGE_CLOSURE_SUMMARY.md)**
   ported master's substance INTO RF wave by wave (migrations 1713c37c, world-pulse 6bc0265b,
   religion 6ca27bef, store/deity 4056cfff, shell/landing 951f8758, pricing afdeee0b, Realm hub
   9b092d55, gate fusion 5b …), and RF then built on top: the full **M1–M11 spatial mover ladder**
   (M11b @ 62c81a0c), the **PART-9 comprehensive review+fix program** (~110 findings closed,
   unified @ d33c8ff8 with the budget ratcheted DOWN to 1,216,350), the golden-track merge
   (6d3e5ca2, FP-G1 stressorsCore split @ 98a08951), the dead-code wave (11fc55d0, −2,659 LOC),
   and A-wave usage telemetry (1ccf84a9).

**Consequence — and the load-bearing dating fact:** master's newest commit is **2026-07-05
14:02** (d024286e), while the port program ran **2026-07-10..13** — the port consumed master's
FINAL state, not a mid-stream snapshot. There is no "post-port master evolution" class at all
(spot-verified: the redeem-modal fix 6cceeced and founder-clawback fb8dbe5c are already on RF).
So the default disposition is **RF wins** (its copy is the adapted, reviewed, fixed superset),
and the real work is (a) catching **port OMISSIONS** — master content the waves deliberately
re-scoped (the entity-link consumer layer, §4.4) or silently never brought, (b) fencing OUT
master content RF deliberately deleted or superseded, and (c) keeping the merge's silent
channels (§2) from re-importing either.

---

## §2 MERGE MECHANICS — THE THREE ADOPTION CHANNELS

Simulated with `git merge-tree --write-tree review-fixes-2026-07-08 master` (in-memory; exit 1 =
conflicts). File-level censuses vs BASE: master touched 1,576 paths; RF touched 1,569; overlap 902.

A `git merge master` into RF adopts master content through **three distinct channels**, and only
the first one shouts:

| Channel | Count | Mechanism | Risk profile |
|---|---|---|---|
| **C1 — CONFLICTS** | **554 paths** = 337 content + 202 add/add + 15 modify/delete | both sides changed; git demands resolution | Visible. Labor, but safe-by-forcing. The 202 add/add are same-path parallel creations (each side built its own file there — e.g. institutionClassify.js, which git flags BINARY because master's side carries a raw NUL); the 15 modify/delete are RF deletions master kept editing — default DELETE. |
| **C2 — SILENT ADDS** | **433 paths** | new files master created that RF never had; merge carries them in with no marker | **The fence-breach channel.** WarFaithSection.jsx (the pantheon gating leak) and master's Workshop/change-queue system arrive HERE. ~300 are master-side tests written against master's tree shape — they will RUN against RF's engine post-merge. |
| **C3 — SILENT MODS** | **241 paths** | master modified files RF left at BASE; master's version silently wins | **The residue channel.** NotesTab.jsx (F24 NUL pair) arrives HERE. |

(RF-only changes — 667 paths — flow through untouched, including every spatial-engine file and all
RF goldens. Files RF deleted that master never touched stay deleted. Files RF deleted that master
modified surface in C1 as modify/delete conflicts — resolve as DELETE unless the master-side delta
is a wanted fix; see §4.)

Full lists are re-derivable at execution time (commands in §9); do not trust stale copies.

**Branch strategy (JUDGMENT, vetoable):** cut `claude/master-merge-r1` from the RF tip; run
`git merge master` there; resolve per this plan; run every gate; then (owner-gated) push and open
the PR **into master**. Chosen over (a) merging RF→master directly on master's lineage (loses RF's
gate/ledger context during resolution), (b) rebasing either side (343- or 308-commit rebase —
madness), (c) `-s ours`-style wholesale strategies (would silently discard master's wanted
post-port fixes). The PR merge lands the reconciled tree on master; master remains prod truth.

**Resolution mechanics for 554 conflicts:** resolve in bulk by disposition class —
`git checkout --ours -- <path>` (RF side) for the RF-WINS list, `--theirs` for the (short)
MASTER-WINS list, hand-merge the exceptions enumerated in §4. Never resolve a file not yet
classified: an unclassified conflict is a finding, not an annoyance.

---

## §3 BINDING PRECEDENT — THE OWNER RULINGS (never re-litigate)

The 8 reconciliation rulings (owner-delegated 2026-07-10, memory/reconciliation-decisions) plus
wave-0 addenda and later in-program rulings. These decided the FIRST reconciliation (the port
program) and bind this second one:

1. **Prod schema truth = master's chain** (their checkout is the linked one). Already honored:
   the chains are physically reconciled (§4.1) — RF adopted master's 001–112 and extended 113–131.
2. **Alignment axis** — superseded by the owner's 2026-07-10 addendum (c9f4ebac): warbound×peaceful
   integrates into lawful×chaos + good×evil; RF's Phase-4 planes implement this. RF wins all axis code.
3. **Seed posture = secret** on all shared/gallery surfaces; owner sees provenance. RF's
   fail-closed allowlist + `_regenSeed` strip is the implementation. Guards: RF migrations 121, 127.
4. **Pricing = adopt as-shipped** (Cartographer $5.99, Founder Lifetime 30 seats, referral/redeem,
   PDF entitlement ladder, delete-forfeits). LATER REFINEMENTS that bind on top: **free tier pays
   $2.99/dossier PDF export; only premium unlimited** (owner ruling 2026-07-13, implemented in RF
   F4 wave — RF wins); **Founder cap = 30 everywhere** (the 500 copy was the bug; RF F4);
   **mapChains stays unenforced/free** (ruled 2026-07-14 per this same precedent; §5.7).
5. **copyGuard = OFF by default**, keep the machinery + `[data-allow-copy]`. ⚠️ `src/lib/copyGuard.js`
   arrives via **C2 silent add** — verify the merged default is OFF (§5.8).
6. **Support email**: ruling text says settlementforge@gmail.com ratified via RF's copy/support.js
   seam; memory/support-email-destination-unconfirmed still lists confirmation as open. **Owner
   confirm before deploy** (queue §8) — do not resolve silently in either direction.
7. **Landing/IA = accept wholesale** ('/' → /home, Realm off mobile nav, OnboardingCoach retired).
   Already absorbed by RF wave 4c (951f8758). RF wins shell/landing conflicts.
8. **Auth = adopt as-shipped** (email-confirm ON, security questions, OAuth flag-gated OFF until
   keys). Absorbed by RF wave 4d (ddc33cbf). RF wins auth conflicts.

Wave-0 addenda: **(9)** narrate limiter = master's consume_ai_generate_rate_limit only (no dual
limiters); **(10)** OWNER_EMAIL env seam, no committed PII literals.

**Meta-rule:** where master's post-port commits touched a surface these rulings assign to RF's
implementation, the ruling wins; port the master delta only if it is a *fix to shared substance*
rather than a divergent implementation.

---

## §4 SURFACE-BY-SURFACE RECONCILIATION MAP

> The four sub-sections below were mechanically swept by dedicated read-only agents
> (migrations/edge, religion, engine/worldPulse, product/UI) and the findings adversarially
> spot-verified. Dispositions are stated per surface with the exceptions enumerated.

### 4.1 Migrations + supabase (the chain is ALREADY reconciled — the fear was stale)

**Chain state (CONFIRMED against both tips):** master `supabase/migrations/` = 112 files; RF = 131
files = master's 112 **plus additive 113–131**; **zero master-only migrations**; exactly **3 common
files differ in content**: `015_welcome_credit.sql`, `018_account_billing_models_credits.sql`,
`101_drop_privileged_email_backdoor.sql`. There is **no renumbering to do** — the port program
(wave 1 @ 1713c37c, per ruling #1) already renumbered RF's uniques onto master's chain. The old
"master 107/108 collide with our chain" fear (memory/third-lineage-mystifying-ride) was resolved
by that wave; this survey re-confirms it at current tips.

- **The 3 differing files (agent-M verified, all CONFIRMED):**
  - `015` — **not even a conflict**: master-only doc header ("superseded by 017"), SQL identical;
    auto-merges to master's version. Harmless.
  - `018` — **auto-merges to RF** (RF-only change e9db663d): RF's F4 scrub removed the hardcoded
    owner-email admin backdoor + the email-OR clause master still carries. RF wins by mechanism.
  - `101` — **genuine conflict, RF wins (hand-merge)**: both drop the runtime email-OR clause;
    RF additionally scrubs the owner-seed literal + documents the OWNER_EMAIL env seam (addendum
    10). Taking RF for 018+101 is internally consistent.
- **130/131 are WRITTEN, NOT DEPLOYED** (owner deploys — playbook owner-batch ruling 2026-07-14).
  The merge does not change this; deployment stays in the §8 owner queue.
- **131 vs master's cd6eb1bc — NO OVERLAP (CONFIRMED):** cd6eb1bc changes nothing but the
  applied-head ledger (110→112); migration 111 (byte-identical both tips) pins 3 functions;
  RF's 131 CREATE-OR-REPLACE-repins **8 different post-111 functions** (from migs 114/115/120/
  123/125). Disjoint sets. **131 stays, verbatim, still-undeployed.** Its matched ratchet test
  `tests/lint/migrationSearchPathPin.test.js` is RF-only and survives automatically.
- **applied-head marker + deploy gate (CONFIRMED):** the marker is `supabase/applied-head.json` —
  a genuine conflict: master says `appliedHead:112` (@ cd6eb1bc, appliedAt 2026-07-05), RF says
  `appliedHead:117` (appliedAt 2026-07-08). **Resolve to RF=117** (master's 112 understates and
  would regress the gate), then **owner-verify against the live prod DB before any deploy** —
  the marker is a claim about prod, and the two checkouts' claims diverged (§8 queue item).
  45a2e33b's fail-CLOSED corrupt-marker hardening is **already on BOTH tips**
  (`scripts/check-migration-head.mjs` is byte-identical) — nothing to adopt.
  `scripts/vercel-ignore-build.mjs` IS a conflict: RF's REQUIRED_CHECKS is a +2 superset
  (coverage floors, tr_TR/Chatham golden) — **RF wins**.
- **Migration test pins (CONFIRMED — none break at chain 001–131 / applied 117):** every pin
  walks `supabase/migrations/` dynamically (`migrationNumbers()`, no hardcoded head literal);
  `migrationAppliedHead.test.js` will correctly show 118–131 as PENDING DEPLOY. The one pglite
  conflict, `tests/security/migrationSequenceAll.pglite.test.js`, differs ONLY by RF's 60s
  timeout (the 131-file chain needs it) — **RF wins**.
- **supabase/functions (19 conflicted paths — agent-M census):** every one is genuine parallel
  evolution (both sides changed; the big features — OWNER_EMAIL seam, redeem/referral, founder
  reversal, 256KB body-cap, constant-time token compare, the entity-link PRODUCER
  `entityRefWrapper.ts` — exist on BOTH tips; the producer auto-merges). Dispositions:
  - **4 generated files** (`_shared/aiGroundingBundle.js`+`.meta.json`,
    `_shared/analyticsEventsBundle.js`+`.meta.json`) — **NEVER text-merge. Resolve their SOURCES**
    (`src/domain/aiGrounding.js`, `src/lib/analyticsEvents.js` + deps), then regenerate via
    `scripts/build-edge-shared.mjs` and verify sourceHash parity (RF's telemetry rev:
    EVENTS_REV=7 vs master's 5 — the regenerated bundle must carry 7).
  - **15 hand-authored `.ts` files — hand-merge each; neither side is a superset.**
    MUST-NOT-LOSE (master-side refinements not ancestors of RF): 6cceeced (redeem wrong-modal,
    create-checkout), 447b791a (PDF entitlement mig-108, account-actions), fb8dbe5c (Founder
    chargeback reversal, stripe-webhook), e260fba2 (constant-time compare, verify-single-dossier),
    80d374ff (256KB cap test alignment). MUST-NOT-LOSE (RF-side): 433641f8 (F4 commerce-trust:
    single tier-truth, $2.99 gate, founder=30, entity-token-leak fix), 6a8bfade (telemetry),
    93c9482a (golden regen). Caveat: master's refinements may already exist in RF's spelling —
    per-file content diff decides, per the §4.3 port rule.
  - **Contract pair:** generate-narrative (producer) ↔ ProseParagraph.jsx / aiGrounding.js /
    aiLayer.js (consumers) — after resolving the function, re-verify the wrapped-entity-ref field
    shape against the client (§4.4 port wave completes the pair).
  - RF migrations 128/129 (latent-pantheon denylists) must not be undercut by master's gallery
    function (§4.2 leak fence).
- **supabase/rollback/ (C2 silent adds, 6 files):** master-only down-migrations + README — adopt.

### 4.2 Religion / deity arc (RF is the descendant — fence master's legacy OUT)

**Provenance (verified 2026-07-11, re-verified by the religion sweep at current tips):** the export's
religion arc is the **direct ancestor** of RF's religion engine, not a rival. RF = export core
(byte-identical numeric core: LAG .12, W_RULER .42/.30/.20/.08, stain .45/.06, contest .78/.22)
+ Phase 4 on top (piety, stance/law-method plane, clergy plane, conduct loop, crisis conversion,
unaffiliated sink, dampener, gov×law synergy, martial/moral terms, **latent pantheon**).

**Default: RF wins — uniformly, on all 22 religion-surface conflicts** (agent-R census: master's
tip predates 2026-07-08, so NO master religion commit postdates RF's Phase-4/fix waves; RF holds
more and later commits on every load-bearing file; the shared constant core is byte-identical —
LEGIT_SEED_CULT .08, STAIN .45/decay .06, CONTEST .78/.22, LAG .12, W_RULER .42/.30/.20/.08 —
with RF's only delta an ADDED `SYNERGY_W: 0.06`). The fences, as re-verified at current tips:

- **FENCE 1 (re-verified, narrowed) — the hard gate, not the contest driver.**
  `evaluateReligiousContest` is **absent as code on BOTH tips** (only comments noting its removal
  — the prior memory claim is stale; nothing to fence). The live fence is `simulationRules.js`
  (a real conflict): master's sole `religionDynamicsEnabled:false` hard gate vs RF's
  `faithSpreadEnabled` split (with religionDynamicsEnabled kept as a tolerant-reader legacy alias,
  simulationProfile.js alias map). **RF wins**; same for religionState.js — RF's −77 lines there
  are the DELIBERATE removal of master's legacy path; a hand-merger must not "restore" them.
- **FENCE 2 — the War&Faith gating leak (5 silent-add files, delete post-merge).** CONFIRMED
  ungated on master: `WarFaithSection.jsx` renders the full live pantheon (names, standings,
  legitimacy, contestOdds, mandate) with zero tier reads; `useSettlementLiveWorld.js` is its
  ungated hook; `Workshop.jsx` imports+renders it (:47/:279); plus `PrimaryDeityPicker.jsx` +
  `WorkshopGateToggle.jsx` (master's hard-gate toggle UI). All five arrive via **C2 silent add**.
  RF's gated seam is `FaithSection.jsx` (tier + isElevated; ACTIVE/TEASER/HIDDEN; the teaser
  never names a deity, never reads latentPantheon) and `WarFaithTab.jsx` carries "THE
  NON-NEGOTIABLE" docstring refusing master's ungated section. Reachability stays dead only if
  `SettlementDetail.jsx` + `OutputContainer.jsx` (both conflicts) resolve RF-wins — **then
  `git rm` all five files anyway** (dead ungated leak surface + bundle weight is not a keepsake).
  If WarFaithSection is wanted for the entity-link port (§4.4), it enters ONLY re-written behind
  RF's tier gate — as new work, not as a carried file.
- **FENCE 3 (re-characterized — NOT a fence).** The gallery `primary_deity` facet is defined in
  migration `063` — **byte-identical on both tips, shared-range, intentional**: the ACTIVATED
  `primaryDeitySnapshot` is public by design under BOTH models. The real protected object is the
  UNREVEALED `latentPantheon`, and RF's 128/129 denylists + `latentPantheon.js`/
  `faithPanelModel.js`/`simulationProfile.js` are all RF-only → survive silently; master's chain
  (ends 112) never runs after them. Nothing to do beyond keeping RF's pins green.
- **FENCE 4 — master-only religion TESTS (C2 silent adds) that lock the master model:**
  `tests/components/{warFaithSection,warFaithOverlay,warFaithMapOverlay,pantheonPanel,
  pantheonDepth,adminSimTuningPantheon,assignDeityFromMap,workshop,workshopMobileGate}.test.jsx`,
  `tests/domain/imposeCult.test.js`, `tests/store/settlementSlice.setPrimaryDeity.test.js`,
  `tests/ui/pantheonActivationStrip.test.jsx`, pdf liveWorld/culture parity tests,
  `docs/RELIGION_REWORK.md`. Disposition per §4.6: the warFaith*/workshop*/setPrimaryDeity set
  tests deleted surfaces → drop-with-reason; review the rest individually.
- **Golden fixtures** (worldpulse-golden-master.json, generator golden, PDF viewModel snap) are
  both-modified regen ARTIFACTS: **take RF's, then treat them as the §4.3 byte-identity PROOF —
  do NOT regenerate.** (JUDGMENT, deviating from the sweep's "regen post-merge" suggestion:
  goldens here are the verification instrument that the engine resolved to RF everywhere; a regen
  would mask exactly the resolution errors the gate exists to catch, and regens are owner-gated.)

### 4.3 worldPulse / engine / generators (the 69-file 3-way, re-measured)

**Surface (CONFIRMED):** 69 conflicted files under `src/domain/worldPulse/` — exactly the prior
estimate (memory/phase55-review-and-fix-r1). Wider engine conflict surface: 156 under `src/domain/`,
27 under `src/generators/`, 63 under `tests/domain/`, 14 under `tests/generators/`.

- **Default: RF wins.** RF's worldPulse is master's world-pulse core, ported (wave 2a @ 6bc0265b),
  certified, then extended by the full spatial ladder (M1–M11 woven into the tick engine),
  reviewed (0 constitutional violations — memory/phase55-review-and-fix-r1), and fixed (~110
  findings). The spatial engine itself (`src/domain/spatial/**`, mover kernels, digest) is
  **RF-only and flows through untouched** — the engine sweep confirms master has ZERO files under
  `src/domain/spatial/**` (the ~21 mover/digest modules + spatial libs/tests are all absent on
  d024286e; none appear in the conflict set). The only spatial-NAMED conflict is the BASE-era
  `src/data/spatialData.js` (a data table, not an engine module) — one of the three
  spatial-ADJACENT exceptions listed below.
- **The exception class — port OMISSIONS (agent-W census: ~36 master fix commits verified by
  signature grep against the RF tip).** Verdict: the port was thorough but NOT complete.
  - **CONFIRMED ABSENT (the one proven silent loss): `ec6120e3`** — a dangling
    `requiredInstitution` ref (deleted institution / nulled import target) resolves `''` →
    short-circuits → the unproducible good is counted as supply and named a local export. RF
    `src/lib/dependencyEngine.js:298-300` carries the exact pre-fix code; master's regression
    test is also absent. **Port into RF's spelling + bring the test** (W3). ⚠️ Behavior-changing:
    expects a golden shift — see the golden protocol below.
  - **PLAUSIBLE, owner-adjudication: `614f6509` (auth half)** — master repointed the
    password-recovery `redirectTo` `/reset-password` → `/set-new-password`; RF auth.js:152-154
    still emits `/reset-password`, but RF's auth routing was deliberately obfuscated (`/l`,
    SetNewPasswordPage) AND auth is owner-ruled as-shipped (§3-8). Verify whether RF's recovery
    email lands on a page with a new-password field; if not, this is the same bug master fixed —
    owner queue (§8). (The commit's OTHER half, anon-checkout guard, IS ported + F23-hardened.)
  - **PLAUSIBLE hole: `780edc10`** — object-shaped exports crash: RF replaced master's
    `goodText()` with a richer normalize suite, but `src/pdf/sections/SupplyChainFlow.jsx:88`
    still calls raw `.toLowerCase()` on a `primaryExports` element. Confirm upstream
    normalization or port the guard (W3).
  - **ADAPTED/safe (no action):** f984e79e (RF's rewritten powerHeadline makes the comma bug
    structurally impossible); 3c45b2fc serviceTierData half (field doesn't exist on RF).
  - **CONFIRMED PORTED (spot list):** d7d28ee3/3da96586 (causal, generalized into
    `applyConditions`), 0503b56c (war levy dedup + test), d845a66b, 354839bf, 6cceeced (mig 112),
    fb8dbe5c, the full war-economy P1–P5 + levy + sack/forage set, the religion arc
    (neighbourFaithInfluence/divineMandate/STANDING_BACKING), money (447b791a mig 108, 48024ecb
    mig 107), review waves A–E, 351aad5c (advance worker), e73eb0a7, d07832f6, 6df42669
    (SHIFT_TIER), security 9c2692c2/e260fba2/6cc373e3.
- **God-file hand-merges (the highest-risk 3-ways, agent-W diff evidence):**
  - `src/generators/powerGenerator.js` (M +1821/−1561 vs RF +11/−2491) and
    `src/generators/economicGenerator.js` (M +938/−726 vs RF +11/−2707) — **both lineages
    independently de-minified/split the same god-slice, differently**: master rewrote in place,
    RF extracted modules. RF's split is the destination; check each master in-place correctness
    edit against RF's extracted modules.
  - `src/domain/worldPulse/stressors.js` (M +158/−43 vs RF +126/−526, the FP-G1 stressorsCore
    split) — verify master's +158 survive RF's refactor shape.
  - **`src/domain/settlement.schema.js` — OWNER-GATED (persistence shape):** master added MORE
    schema than RF (+542 vs +407). Master may carry schema fields RF lacks. Never blind-RF-wins;
    enumerate the field-level delta and queue the disposition (§8).
- **Spatial-adjacent exceptions to RF-wins (agent-W):** `src/data/spatialData.js` — CONFLICT
  where **master is the substantive side** (de-minify + token-integrity pass; RF +1/−1) —
  hand-merge toward master's content, watching F24 token integrity; `src/generators/
  spatialGenerator.js` — master 1-line change, RF at BASE → would silently adopt master
  (behavior-relevant: see golden protocol); `tests/data/spatialDataTokenIntegrity.test.js` —
  clean add, keep.
- **Constitutional law during resolution:** the merged tree must keep RF's determinism guarantees:
  same-seed byte-identity, dormancy, frozen distanceMatrix, the any-cast ceiling (const **2252**
  in domainAnyCastBaseline.test.js; committed baseline total **2,230** — never raise the ceiling
  without the owner), first-paint closure ≤ the live budget const (**1,216,350** at survey @
  d33c8ff8, **1,215,520** at the live drift tip 9fe425a7 — read it fresh; see §5.5). Any conflict
  resolution that touches an engine file must preserve RF's seeded-rng entry points verbatim.
- **Goldens — THE TWO-STAGE PROTOCOL (JUDGMENT, vetoable — reconciles the sweeps' "regen
  post-merge" mandate with the no-silent-regen law).** The fixtures are true conflicts (both
  sides regenerated since BASE: generator golden — master 16 regens newest 200f7d8c, RF 8 newest
  93c9482a THE ONE REGEN owner-signed; worldpulse golden; goldenViewModel snap; fieldManifest).
  Never text-merge a fixture.
  - **Stage 1 — the merge commit is GOLDEN-NEUTRAL by construction.** Resolve all fixtures to
    RF's; resolve every engine-reaching file to RF semantics — including *deliberately reverting
    the would-be silent adoptions* (`spatialGenerator.js`, and any C3 silent mod under
    src/domain, src/generators, src/data — enumerate them from the §9 C3 list filtered to those
    dirs) back to RF/BASE content, parking them for Stage 2. Then RUN the golden tests as the
    arbiter: **byte-identical = proof the resolution preserved RF's engine; any shift = a
    resolution error — fix it, never regen it.**
  - **Stage 2 — behavior-changing adoptions ride their OWN wave (W3) with ONE owner-signed
    regen.** The enumerated port list (ec6120e3, spatialData.js token pass, spatialGenerator.js
    1-liner, 780edc10 guard if confirmed, …) lands together; the golden shift is predicted per
    item, then ONE regen executes with the owner's sign-off, and the dist/budget census re-runs
    against a REAL build (the FP-G1 lesson: vitest-only regens skip the dist contracts).
  - Spatial goldens (spatial-digest-golden.json, worldpulse-spatial-golden.json) are RF-only —
    no conflict, no regen.

### 4.4 Product / UI / store / PDF (the biggest conflict bucket + the entity-link port)

**Surface:** 137 conflicted under `src/components/`, 17 `src/store/`, 18 `src/lib/`, 13 `src/pdf/`,
plus hooks/data/copy/config. Master's post-port remediation lives disproportionately here
(redeem-modal fix 6cceeced, billing reversal fb8dbe5c, gallery import premium, deploy/CSP).

- **Default: RF wins** (same superset logic). **Agent-P correction to the port-worklist premise:**
  the headline master post-port fixes are ALREADY on RF — 6cceeced's redeem `p_mode`/mode-mismatch
  handling (create-checkout/index.ts:496-502 + test), fb8dbe5c's `clawbackFounderForSession`
  (stripe-webhook/index.ts:585) — the port program's cutoff included master's tip. So the
  resolver's job on those files is to **confirm the fix survives the textual merge**, not to
  re-port it. Gallery import-premium gating: verify the GalleryDetail path specifically at
  resolve time (RF carries the account-surface gate; the gallery-detail conflict decides the rest).
- **`TIER_GATE.free.export` — PAID-SURFACE CONFLICT, RF WINS (owner-ruled):** master has
  `free.export: true` (free unlimited export); RF has `false`, implementing the 2026-07-13 ruling
  (free pays $2.99/dossier via the per-dossier entitlement; premium unlimited). Taking master's
  value would silently regress monetization. Also pick ONE export-access architecture: RF's pure
  `resolveExportAccess()` (implements the ruling with defense-in-depth) over master's
  `useDossierExportAccess()` hook — the hook arrives via C2 silent add
  (`src/hooks/useDossierExportAccess.js`); drop-or-quarantine it. Flagged §8 as paid-surface
  confirmation, not re-litigation.
- **`maxTier` rename divergence (new finding):** master's top settlement tier is `metropolis`;
  RF renamed/raised to `capital` (rides the same authSlice.js/pricing.js conflicts; ~80 master
  files reference `metropolis`). RF wins by lineage default, but master's C2 silent-add
  tier-backdrop feature (`src/lib/tierBackdrop.js`, `src/hooks/useAltitude.js`,
  `public/backgrounds/tiers/*.jpg` incl. metropolis.jpg) is keyed to master's vocabulary —
  **adapt it to RF's tiers or drop-with-reason**; do not ship a feature keyed to a tier name the
  merged engine never emits. Owner sanity-check queued (§8).
- **THE ENTITY-LINK CONSUMER PORT (first-class axis — playbook F4 row, "a reconciliation gap
  larger than the register finding"). Agent-P verified BOM:**
  - **Producer parity CONFIRMED:** `src/lib/entityRefTokenizer.js` AND
    `supabase/functions/generate-narrative/entityRefWrapper.ts` are **byte-identical on both
    tips**; the token format (`⟦entity:<id>|<name>⟧`-style) is identical; both tips call
    `wrapEntityRefsInProse` at the same two emission sites. The producer needs NO reconciliation.
  - **Six consumer files arrive via C2 silent add:** `components/primitives/EntityLink.jsx`,
    `pdf/primitives/EntityRef.jsx`, `components/dossier/DossierEntityContext.jsx`,
    `components/dossier/useNavigateToEntity.js`, `components/dossier/EngineSections.jsx`,
    `components/settlement/WarFaithSection.jsx` (⚠️ the last is ALSO fence-2 §4.2 — bring it in
    only behind RF's tier gate, or drop its mount).
  - **~20 RF files must be re-pointed** from the degrade path to the link primitives:
    ProseParagraph.jsx (currently renders plain spans, header comment documents the missing
    consumer layer), pdf/primitives/ProseText.jsx (`proseToPlainText()`), OutputContainer.jsx
    (provider hoist), DossierNarrativeBanner.jsx, the new/*Components + new/tabs/*Tab set, and
    pdf/lib/viewModel.js + pdf/sections/* per agent-P's list.
  - **THE RISK IS ID-PARITY:** `src/domain/dossier/entityLinks.js` diverged heavily (master↔RF
    +85/−142) though the public API (`entityIdFor`/`neighbourIdFor`/`buildDossierEntityIndex`)
    matches. RF already carries the guard master lacks —
    `tests/lib/entityRefProducerConsumer.contract.test.js` — keep it green through the wiring;
    re-run the parity assertion against RF's rewritten index.
  - Until the §7-W5 wiring lands, the degrade path keeps leak-safety — carrying files is not
    porting the feature; completeness is verifiable, not urgent-blind.
- **Master's Workshop / change-queue editing system (C2 silent adds):** `Workshop.jsx`,
  `WorkshopGateToggle.jsx`, `ChangeQueuePanel.jsx`, `changeQueueSlice.js`,
  `settlement{Canon,PendingEdits,Snapshot}Helpers.js`, `useChangeQueueCascade.js` — a parallel
  editing architecture beside RF's pending-edits system (which the persist-gap fix in §6 targets).
  **Two editing systems in one tree is the §II lifecycle hazard incarnate.** Disposition:
  drop-or-quarantine (RF's ported UI does not mount master's system; Workshop.jsx is also fence-2
  reachability surface, §4.2) and record as a deliberate deferral — adopt nothing here without
  first ruling which editing architecture the product keeps.
- **MapGalleryDetail class — import integrity (NOW A CONFIRMED INSTANCE):** C2 adds can import
  modules RF deleted. At the pinned tip the children survived, but the LIVE drift commit
  **cf65a3c1 deleted CampaignStatePanel.jsx + MemberSettlementsList.jsx** — and master's
  silently-added `MapGalleryDetail.jsx` imports both (master :44-45). At any post-cf65a3c1 base,
  the merged tree has a REAL dangling import. Disposition: drop-or-adapt MapGalleryDetail (it was
  already on RF's dead-code cascade list); the §7-W2 gate runs tsc + eslint + vite build on the
  merged tree specifically to catch this class.
- **PDF surface:** RF wins (sealed FaithWar chapter discipline, $2.99 gate, live-layer parity
  walker). Master's pdf fixes are ADAPTED-or-ported per the §4.3 census (f984e79e is structurally
  obsolete on RF; the one open pdf item is the 780edc10 object-shape guard, W3).

### 4.5 CI / gates / root config (compose, don't clobber)

Conflicted: `.github/workflows/ci.yml`, `package.json`, `eslint.config.js`, `vite.config.js`,
`vercel.json`, `scripts/deploy.sh`, `scripts/vercel-ignore-build.mjs`, `scripts/check-domain-strict.mjs`,
`playwright.config.js`, `index.html`, `deno.lock`, e2e specs, `api/csp-report.js`, `public/map/sf-bridge.js`,
`public/sitemap.xml`, religion soak scripts.

- RF's wave 5b already **composed** master's CI hardening into its own gate (e2e anti-vacuity,
  ciCheckParity, fail-closed Vercel ignoreCommand + Deploy-Hook redeploy, REQUIRED_CHECKS drift
  guards) while keeping RF's tighter bounds (domain-strict 0, coverage floors, mutation sweep).
  **Default: RF wins**, then port master's POST-5b CI deltas — notably master's "run the
  engine-chunk dist contracts post-build" CI change (a50efa2e, PR #47): master's CI now enforces
  dist contracts the way RF's verify:dist does — reconcile into ONE enforcement point, RF's.
  (The fail-closed applied-head gate needs NO porting — byte-identical on both tips, §4.1.)
- `package.json`: hand-merge — RF's script chain + any master-only deps/scripts that survive the
  fence screens. `deno.lock`: regenerate post-merge rather than hand-merging lock content.
- e2e specs: hand-merge, preferring RF harness + master's newer flow assertions where they test
  shared product truth.
- **CI-parity sequencing (agent-H):** RF's four parity gates (`ciCheckParity`, `ciGateHardening`,
  `e2eNotVacuous`, `vendorPdfLazy` — all both-modified conflicts) assert ci.yml matches an
  expected gate set — **they will fail until ci.yml is reconciled to the merged gate list**.
  Resolve ci.yml + the parity tests as ONE coherent unit in the same wave.
- **Budget-gate double-fire (agent-H):** master brings its OWN budget system via C2 silent adds —
  `tests/architecture/{bundleBudgetGuard,fileSizeBudget,fileSizeRatchet,importCycles}.test.js` +
  `scripts/check-bundle-budget.mjs` — while RF enforces the constitutional closure budget +
  `scripts/eslint-plugin-visual-budget.js` (which itself conflicts → RF wins). Both systems fire
  on the merged bundle with stale thresholds → both likely red. Disposition: **RF's constitutional
  closure budget is THE budget** (§5.5); master's file-size/cycle guards are complementary
  ratchets — adopt them ONLY re-baselined against the merged tree (shrink-only from there), or
  drop-with-reason. One enforcement point per contract.
- **any-cast baseline (RF-only gate):** `tests/lint/domainAnyCastBaseline.test.js` +
  `.domain-any-baseline.json` (RF: total 2,230) snapshot RF's domain tree; master's adopted
  domain files shift the counts → the gate goes red post-merge. Per the b6959c9a precedent
  ("worktree-lane baseline collisions → type honestly at merge"): **type master's incoming
  domain files honestly rather than widening**; the ceiling never rises without the owner.

### 4.6 The test estate (the silently-imported 300)

~300 of the 433 C2 silent adds are master-side test files (`tests/components` 78, `tests/ui` 47,
`tests/store` 45, `tests/security` 44, `tests/lib` 37, `tests/pdf` 23, …). They were written
against master's tree shape; post-merge they execute against RF's. Expect mass failures that mean
"the tree changed under this test", not "the tree is broken".

**Disposition protocol (§7-W6):** for each failing imported test — (a) it tests shared substance
RF also has → adapt imports/selectors and keep; (b) it tests master-only architecture RF
superseded (Workshop, legacy contest, master's eventComposer variants) → drop WITH the fence/
supersession reason recorded in the wave commit; (c) it reveals a REAL RF gap (master's security
pins are prime candidates — 44 files under tests/security) → keep, fix RF. Never bulk-delete;
never bulk-keep. The tests/security batch gets priority review because master's remediation era
concentrated auth/RLS pins there.

---

## §5 KNOWN SINGLE-FILE HAZARDS (each: file → channel → binding resolution)

| # | Hazard | Channel | Resolution |
|---|---|---|---|
| 5.1 | **`src/components/MapOverlay.jsx` — `data-map-overlay-svg`** absent on RF; master has it at :255; `src/lib/mapThumb.js:80` queries it on BOTH tips (RF campaign thumbs silently composite bare terrain). | **Auto-merge** (both-modified but NOT textually conflicting — agent-P 3-way: RF's only touch is +5 lines elsewhere; master's attribute + unmount-cleanup + signature change are theirs-only adds) | The attribute **returns automatically** from master's side — verify post-merge, don't hand-add. ⚠️ The REAL hand-resolve is the **coupled transform-threading cluster**: master's MapOverlay switched to an `onTransform` callback, while RF threads `transformOut` via `WorldMapStage` (the F2 "ref not callback" contract), and `WorldMap.jsx` / `map/WorldMapOverlays.jsx` / `map/WorldMapToolbar.jsx` ARE conflicts — pick ONE threading contract (RF's) end-to-end or drag-drop transform silently stops propagating. Then cherry-pick the guard test **ab1c30ba** (`tests/components/mapOverlayThumbContract.test.jsx`, proven non-vacuous) — it lives ONLY on `claude/brave-babbage-67b994`, **not on master**, so the merge alone never brings it. |
| 5.2 | **Map-icon hover emission** — QuickInspector's docstring claims MapOverlay emits hover; FALSE on every lineage since birth (9868fd52). NOT a merge casualty; nothing on master to restore. | n/a | **Do not re-file as a regression during this merge.** The owner has separately commissioned the wiring as NEW work on RF (pending relaunch); keep it out of merge scope. Cherry-pick the docstring correction **ccd0d670** (lives only on `claude/confident-leavitt-5b2441`, not master) in the guard-port wave. |
| 5.3 | **Entity-link consumer port** (from master 6d95adc7) | C2 silent adds + a port wave | §4.4. Files carry; §7-W5 wires them; producer↔consumer contract reconciled as a pair; F4 degrade-path contract test retained until the wiring lands. |
| 5.4 | **F24 NUL/escape residues.** Fresh python byte-count census at BOTH tips (agent-H; the detection law: **python byte scan + escape-spelling grep, never raw-byte grep alone** — escape spellings are byte-invisible): master carries RAW 0x00 in `NotesTab.jsx:68` (+ `\u0000` escape :28 — the two-sided render-sync key), `institutionClassify.js:60`, `supplyCompleteness.js:158`, plus escape-only `AccountPage.jsx:99`; RF carries ONLY `supplyCompleteness.js:158` raw (blob IDENTICAL to master's → merges clean, NUL rides) + one benign ASCII-range regex. **STALE-MEMORY CORRECTION: neither tip gates raw NULs today** — `controlBytes.test.js` is ABSENT on both (it lives ONLY on `claude/recursing-lovelace-65d03c` @ 263e53e0); RF's `copyCorruption.test.js` scans em-dash/emoji signatures, not NULs. | NotesTab = **auto-merge, master's NUL form silently WINS** (verified against the simulated merge tree: the merged blob carries raw 0x00 @68 + escape @28, no alert fires); institutionClassify = **add/add BINARY conflict** (the NUL makes git flag it binary); AccountPage = content conflict; supplyCompleteness = clean-identical | §7-W4: after resolution, hand-reapply **c0600f8c's intent** (NotesTab both sides → `\|` TOGETHER — fixing one side desyncs the render-sync equality and reintroduces the keystroke-clobber bug; institutionClassify key → `\|`; AccountPage resolves to RF's already-clean c85781f0 form), fix-or-owner-rule **supplyCompleteness.js:158** (the playbook §0.8-5 assigns the decision to exactly this pass — c0600f8c does NOT touch it), then **cherry-pick the 263e53e0 controlBytes pin** so the class cannot return — the pin FAILS until all of the above land, which is the correct order of operations. |
| 5.5 | **`tests/build/vendorPdfLazy.test.js` + budget** (the two tests/build conflicts are this + `ciGateHardening.test.js`) | C1 | RF wins outright: **master's copy has NO first-paint closure ratchet at all** (only loose vendor-chunk shape asserts) — taking master's would DELETE a constitutional invariant. Merged line: RF's `CLOSURE_BUDGET_BYTES` (ratcheted DOWN @ d33c8ff8 to **1,216,350**; the live drift tip 9fe425a7 re-ratcheted it to **1,215,520** — read the live const, RF file line ~300, with the full ratchet-history comment; §0.2-5 monotone). Margin at the pinned tip: **77 B**. ⚠️ Any resolution adding eager bytes busts it — C2/C3 imports must stay OUT of the entry closure; verify:dist on the merged tree is the arbiter. If red: diagnose provenance FIRST (the FP-G1 lesson: merge-time budget reds can be inherited, not merge-caused). Fold master's extra chunk-shape asserts in only if RF lacks them. |
| 5.6 | **applied-head.json + deploy gate** | C1 (both files conflict) | Marker → **RF=117** (master's 112 understates); fail-closed gate already shared (45a2e33b equivalent byte-identical both tips); `vercel-ignore-build.mjs` → RF (REQUIRED_CHECKS superset). Owner verifies the marker against live prod before deploying 118+. §4.1. |
| 5.7 | **mapChains tier gate** — declared in TIER_GATE, enforced nowhere, on BOTH lineages. RULED 2026-07-14: stays free (as-shipped, ruling #4); selector retained + flagged. | C1 (authSlice etc.) | Keep as-shipped free. The flag comment (ccd0d670) cherry-picks in the guard-port wave. Vetoable: owner says "enforce mapChains" to flip. |
| 5.8 | **copyGuard default** | C2 silent add (`src/lib/copyGuard.js`) | Ruling #5: machinery stays, default **OFF**. Verify the merged default + any mount site; add/keep the one-flag-to-flip comment. |
| 5.9 | **Test-suite double-fire / gate collisions** | C2 | Master's CI-era additions (tests/build 9 silent adds, tests/docs 5) may duplicate RF's 5b-composed gates (ciCheckParity, e2e anti-vacuity). Disposition per §4.6 — one enforcement point per contract, RF's spelling preferred. |

---

## §6 SATELLITE BRANCHES — settle BEFORE or ALONGSIDE, never after

Unmerged work that this merge either absorbs, sequences, or consciously leaves:

| Branch @ tip | What | Sequencing |
|---|---|---|
| `claude/persist-gap-edit-actions` @ **151a8ee3** | §10.4 edit-action persist-gap fix (5 gaps incl. the census-caught rename-settlement). Verified, committed, **BLOCKED on the owner-gated first-paint budget** (+596 B over the then-budget); **CONFIRMED merges clean onto 5a78af5a** (fresh merge-tree: 0 conflicts). | **Before the master merge if the owner resolves the budget** (reclaim-first precedent); otherwise AFTER — never inside the merge commit. Queue §8. |
| `claude/brave-babbage-67b994` (contains **ab1c30ba**) | mapOverlayThumbContract guard test (+5/−1 mapThumb.js, +92 new test) — **on NEITHER tip** | Cherry-pick in §7-W5; may need re-anchoring if mapThumb conflicts. |
| `claude/confident-leavitt-5b2441` (contains **ccd0d670**) | QuickInspector docstring correction + mapChains flag comment (+14/−4 QuickInspector, +8 authSlice) — **on NEITHER tip** | Cherry-pick in §7-W5, AFTER its two target files resolve. |
| `claude/magical-torvalds-9ef90e` @ **c0600f8c** | Master-side F24 NUL fixes (NotesTab pair, institutionClassify, AccountPage escape) — **on NEITHER tip; NOT a clean pick** (all 3 targets are conflict/auto-merge files) | **Hand-reapply the intent in §7-W4** after resolution; do not cherry-pick blind. Does NOT cover supplyCompleteness. |
| `claude/recursing-lovelace-65d03c` @ **263e53e0** | **The controlBytes raw-NUL pin** (tests/lint/controlBytes.test.js, +145) — **on NEITHER tip**; the only raw-NUL gate anywhere | Cherry-pick at the END of §7-W4 (it fails until the NUL fixes land — correct order). |
| `usage-telemetry` @ 6a8bfade | A-wave telemetry | **CONFIRMED already an ancestor of RF** (via 1ccf84a9) — nothing to do. |
| W2 feed-retention @ 2f4f7b58 | Round-21 W2 | **CONFIRMED re-landed on RF as 4cf84a40** (retention test blob byte-identical) — the "blocked on FP-2" memory note is STALE; the branch is redundant. Nothing to do. |
| `claude/adoring-wescoff-6a25a8` @ 312a5025 | W5 cosmetic-sweep reconciliation | Standing rule: **cherry-pick only, NEVER merge** (merging reverts the M-ladder). RF-internal; settle-or-defer before cutting the merge branch. |
| `claude/amazing-thompson-6dd363` @ **92973282** | perf(first-paint), 1 commit off RF — an unmerged FP-headroom candidate | Evaluate during W0 (relevant to the persist-gap budget question); not a merge blocker. |
| `claude/jovial-nash-b5a39a` / worktree branches (zealous-driscoll, heuristic-wu, hungry-driscoll, amazing-euclid) | **No unique merge-relevant work** (= one of the tips, or +2 dev-only) | Nothing to do. |
| `claude/phase55-review-fixes-r1` @ 0ed18d77 | R1 fix set | **SUPERSEDED** (folded in @ 5ea117ec) — do NOT also merge. |

---

## §7 STEP-ORDERED EXECUTION PLAN (waves, one commit each, full-gate checkpoints between)

**Standing rules for every wave:** the implementer brief FORBIDS `git stash` (memory/
agent-stash-incident-2026-07-14); briefs state the expected base HASH and verify before building
(memory/wrong-lineage-worktree-trap-2026-07-14 — 3 recurrences, one of them THIS planning session's
own worktree); model split per owner (Opus implements/verifies, Fable architects/checks); no push,
no deploy, no migration apply — ever — without the owner's in-session word; ledger row per commit
(playbook §0.3-7).

- **W0 — SETTLE THE BASE.** Re-verify tips vs this plan (§0 — the tree drifted DURING the survey;
  re-pin every disposition against the live tip, re-running the §9 censuses). Land-or-record the
  §6 satellites (persist-gap = owner call; evaluate 92973282 for headroom). Re-run the full gate
  on RF to re-baseline (at survey: 8,786-era suite + verify:dist 109/109; budget const now
  1,215,520 at the live tip). GATE: green baseline, else stop.
- **W1 — THE MERGE COMMIT** on `claude/master-merge-r1` (cut from the verified RF tip).
  `git merge master`; bulk-resolve C1 per §4 dispositions (RF-wins list → `--ours`; the short
  master-wins/hand-merge exception lists, §4/§5); **revert the Stage-1 golden-neutrality set**
  (§4.3: spatialGenerator.js + the engine-reaching C3 silent mods) back to RF/BASE content,
  parking them for W3. Do NOT fix anything else in-flight. Commit the resolved merge (tree may
  be red — that is W2–W6's job; the commit isolates resolution decisions from repair work).
  GATE: `git diff --check`; tsc parse-level sanity; fence greps — `faithSpreadEnabled` split
  intact in simulationRules.js, no mount of WarFaithSection/Workshop from any live route;
  `data-map-overlay-svg` present in the merged MapOverlay (it auto-returns from master — verify,
  §5.1); **golden tests byte-identical (the Stage-1 arbiter, §4.3)**.
- **W2 — FENCE + SCREENING SWEEP.** Disposition the C2 silent adds and C3 silent mods per §4/§5:
  `git rm` the 5 WarFaith leak-surface files (§4.2 fence 2), drop-or-quarantine master's
  Workshop/change-queue system + PrimaryDeityPicker + useDossierExportAccess + MapGalleryDetail
  (§4.4), copyGuard default OFF (§5.8), tier-backdrop vocabulary adaptation (§4.4), budget-gate
  singleness (§4.5). GATE: fence greps + tier-gate pins green; **eslint + tsc + vite build clean
  (the C2 dangling-import catcher — MapGalleryDetail is a known instance)**.
- **W3 — BEHAVIOR-CHANGING PORTS + THE ONE OWNER-SIGNED REGEN (Stage 2, §4.3).** Port ec6120e3
  (+ its regression test), the spatialData.js token pass, the spatialGenerator.js one-liner, the
  780edc10 guard if confirmed, and any other parked engine adoption — each with its predicted
  golden impact stated up front. Then ONE regen across the shared golden surfaces with the
  owner's sign-off, followed by a REAL build + dist census (never vitest-only). GATE: goldens
  green post-regen, shift map matches prediction, budget still ≤ the live const.
- **W4 — BYTE-INTEGRITY PASS (F24).** Python byte-count scan + escape-spelling grep over the FULL
  merged tree; hand-reapply c0600f8c's intent (NotesTab BOTH sides together; institutionClassify;
  AccountPage already clean via RF); surface the supplyCompleteness owner call (§8); THEN
  cherry-pick the 263e53e0 controlBytes pin (it fails until the fixes land — correct order).
  GATE: controlBytes + copyCorruption pins green repo-wide; scan output quoted in the commit.
- **W5 — GUARD-PORT + ENTITY-LINK WIRING.** Cherry-pick ab1c30ba + ccd0d670 (after their target
  files resolved); wire the entity-link consumer layer (§4.4) producer↔consumer as a pair against
  RF's rewritten entityLinks.js index; keep `entityRefProducerConsumer.contract.test.js` green
  throughout, then extend it to the link-path contract. GATE: new pins + PDF/dossier suites;
  goldens still byte-identical (the wiring must not shift them — same-seed prose carries no tokens).
- **W6 — TEST-ESTATE RECONCILIATION.** Run the ~350 imported master-only tests; disposition per
  §4.6 protocol (adapt / drop-with-reason / fix-RF-gap). tests/security (44) first; the
  §4.2-fence-4 religion set drops with the fence reason. Re-baseline the any-cast gate by TYPING
  master's incoming domain files honestly (b6959c9a precedent), never by widening. GATE: full
  suite green, file/test counts reconciled and recorded.
- **W7 — THE FULL CONSTITUTIONAL GATE.** `npm run check` on a quiet machine (the budget/dist
  contracts NEED the build): full suite; goldens matching the W3-signed state; any-cast at the
  honestly-typed baseline; closure ≤ the live budget const; verify:dist; edge bundles REGENERATED
  via build-edge-shared.mjs with sourceHash parity (EVENTS_REV=7 side, §4.1); ci.yml + the four
  parity gates resolved as one unit (§4.5); e2e. Every number quoted in the ledger row. GATE:
  green, or each red dispositioned with provenance (inherited vs merge-caused) before proceeding.
- **W8 — OWNER GATE (nothing below happens on agent judgment):** push `claude/master-merge-r1`
  (+ the 75 unpushed RF commits it contains), open the **PR into master**, migrations 113–131
  deploy sequencing (incl. 130/131 and the applied-head update), support email confirmation (§3-6),
  the supplyCompleteness NUL call, persist-gap budget call if still open, and the acknowledged
  un-soaked deploy. Present as one batch (§8).

Sizing: W1–W2 are the heavy waves (554 + 674 dispositions — budget several sessions; the
disposition LISTS in §4/§5 are the deliverable of this plan, the labor is mechanical); W3–W6 scale
with the port/fence worklists enumerated in §4; W7 is one gate run plus triage.

---

## §8 OWNER-DECISION QUEUE (batch these; none are agent calls)

1. Persist-gap budget: reclaim-first (FP-2b/2c, and the unmerged 92973282 perf commit is a
   candidate), sign a raise, or defer past the merge (§6).
2. supplyCompleteness.js:158 intentional NUL: keep-as-is (documented, and the controlBytes pin
   then needs an explicit allowlist entry) or convert to `|` (§5.4) — the playbook explicitly
   parks this decision AT this merge.
3. Support email destination (settlementforge@gmail.com per ruling #6) — confirm before deploy.
3b. `settlement.schema.js` field-level delta (master +542 vs RF +407 — persistence shape, §4.3):
   enumerate and adjudicate which master-only schema fields (if any) the merged shape keeps.
3c. The W3 golden-shift sign-off (the ONE regen) — per-item predicted shifts presented together.
3d. Auth recovery-redirect (§4.3, 614f6509): confirm RF's recovery email lands on a working
   set-new-password page; if not, sanction the fix inside the auth-as-shipped posture.
3e. Paid-surface confirmations (no re-litigation, just sign-off visibility): `free.export:false`
   survives the merge (the $2.99 ruling); `maxTier` stays RF's `capital` vocabulary.
4. Migrations deploy plan: verify `applied-head.json` (=117 post-merge) against the LIVE prod DB —
   the two checkouts' claims diverged (112 vs 117) — then sequence 118–131 (incl. the written
   130/131). Owner deploys; the merged gate will correctly show 118–131 PENDING.
5. Push + PR authorization (W8) — includes the 75 currently-unpushed RF commits.
6. The un-soaked deploy acknowledgment (standing owner choice; restated so it is re-affirmed, not
   assumed).
7. (Standing vetoes available: "enforce mapChains"; "wire map hover" — both explicitly NOT in
   merge scope per §5.2/§5.7.)

---

## §9 RE-DERIVATION COMMANDS + SURVEY RECEIPTS

All censuses regenerate from two tips + base (replace hashes if tips moved):

```bash
BASE=acf59a00; RF=review-fixes-2026-07-08; M=master
git diff --name-only $BASE $M | sort > /tmp/m.txt
git diff --name-only $BASE $RF | sort > /tmp/rf.txt
comm -12 /tmp/m.txt /tmp/rf.txt > /tmp/both.txt                 # 902 at survey
git merge-tree --write-tree --no-messages $RF $M | tail -n +2 \
  | awk -F'\t' 'NF==2{print $2}' | sort -u > /tmp/conflicts.txt # 554 at survey
comm -23 /tmp/m.txt /tmp/rf.txt > /tmp/m-only.txt               # 674 at survey
git diff --diff-filter=A --name-only $BASE $M | sort > /tmp/m-adds.txt
comm -12 /tmp/m-only.txt /tmp/m-adds.txt   # C2 silent adds: 433 at survey
comm -23 /tmp/m-only.txt /tmp/m-adds.txt   # C3 silent mods: 241 at survey
# F24 byte scan (the python law — raw grep misses escape spellings):
git ls-tree -r --name-only <tip> -- src tests | while read f; do
  git cat-file blob <tip>:"$f" | python3 -c "import sys;d=sys.stdin.buffer.read();\
bad=[b for b in d if (b<32 and b not in (9,10,13)) or b==127];print(len(bad))" ; done
git grep -n -E '\\x00|\\u0000' <tip> -- src               # escape spellings
```

Key evidence hashes used above: 5a78af5a (RF pinned tip) · 88dac334/cf65a3c1/9fe425a7 (live
drift observed mid-survey; 9fe425a7 = budget 1,215,520) · d024286e (master tip, 2026-07-05) ·
acf59a00 (BASE) · 1713c37c/6bc0265b/6ca27bef/951f8758/afdeee0b/9b092d55 (port waves) · 62c81a0c
(M11b) · d33c8ff8 (budget ratchet 1,216,350) · 6d3e5ca2/98a08951/27f15da9 (golden merge/FP-G1/
regen census) · 93c9482a (THE ONE REGEN, owner-signed) · 11fc55d0 (dead-code) · 1ccf84a9
(telemetry merge) · 6d95adc7 (entity-link consumer, IN master) · 3c9ad9ad (map-overlay contract
birth) · ab1c30ba / ccd0d670 / c0600f8c / 263e53e0 / 151a8ee3 / 92973282 (satellite commits, on
NEITHER tip) · 4cf84a40 (W2 feed-retention re-landed on RF) · cd6eb1bc / 45a2e33b (master
applied-head + fail-closed gate) · ec6120e3 (the ONE confirmed un-ported master fix) ·
614f6509 / 780edc10 (the two judgment items) · 0503b56c / d7d28ee3 / f984e79e / 6cceeced /
fb8dbe5c / 447b791a / 48024ecb / 354839bf / d845a66b / 6df42669 (master fixes CONFIRMED ported) ·
200f7d8c (master's newest golden regen) · c9f4ebac (axis addendum) · c85781f0 (RF AccountPage NUL
fix) · 9868fd52 (hover-docstring birth) · 312a5025 (W5 cherry-pick-only) · 5ea117ec (R1 folded) ·
b6959c9a (type-honestly-at-merge precedent) · e9db663d (RF 018 PII scrub) · 08b11499
(mystifying-ride tip, fully inside master).

---

## PROVENANCE NOTE

Five dedicated read-only Opus sweep agents surveyed the surfaces — referenced inline as
**agent-M** (migrations/edge), **agent-R** (religion), **agent-W** (engine/worldPulse + port
census), **agent-P** (product/UI/store/pdf), **agent-H** (hazards/satellites/topology). Their
findings are folded INLINE above (there are no separate addenda), and the synthesis was then
adversarially re-verified against git before this document was committed. Epistemic labels:
statements marked CONFIRMED carry executed git evidence from this survey; PLAUSIBLE items
(614f6509 auth redirect, 780edc10 export-shape hole, cherry-pick cleanliness of ab1c30ba/
ccd0d670) are flagged at their sites with the exact experiment that settles each.
