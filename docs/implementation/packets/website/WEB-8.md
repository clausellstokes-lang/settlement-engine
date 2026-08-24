# Website / WEB-8 — paywall honesty: the ladder stops claiming gates that are not there (member 1 of `W-C`)

- **Status:** LANDED
- **Built by:** lane TE-WEB-8 on 2026-08-23, `[OPUS-RUN · FABLE-VALIDATION OWED]`. The member
  is commit `200d7e549407323c3a405c4f224f071deb848703` on base
  `b2852ccc3cc4753499996da6582dd672e90499d0`; this packet is the commit after it. All seven
  member blobs were sha256-proved byte-identical at the committed tip against their pre-hook
  readings — the pre-commit `eslint --fix` re-stage changed nothing, and the untracked packet
  survived the hook's stash cycle. Held at the lane tip for the chair; do not redispatch.
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `7009f115bc8fda7a19bd3408893ca08351294a18`
- **Last revalidated:** 2026-08-24 at `7009f115bc8fda7a19bd3408893ca08351294a18` (the TE-STACK-2 act)
- **Train:** `W-C` (paid-surface honesty), family **website** — un-stamped, so the train
  holds the four-member cap. Car 1 of 4: WEB-8 → WEB-9a → WEB-9b → WEB-10.
- **Owner authority:** `OWNER_DECISION_QUEUE.md` **§464.2** (O-P1 de-advertise with a
  contract-test pin, O-P3 the `pdfExport` drift pinned), compiled as the website train's
  second charter, ruled at **§471** and ruled-as-amended at **§473**. The §449 docket that
  raised the items is superseded on one load-bearing point by its own §471 correction, and
  this member implements the CORRECTED reading — see §1.
- **Depends on:** nothing. This car is independent of every W-C sibling; WEB-9a, WEB-9b and
  WEB-11 depend on IT, for the registrations in §6.
- **Collision group:** **this car alone owns `src/config/pricing.js`,
  `tests/config/pricing.test.js` and `.env.example` for the train's duration** (§471.1/F1).
  WEB-9a and WEB-9b name none of the three. WEB-10's two dial flips are the one residue and
  its packet is minted only after this one is LANDED (serial mint, as
  `implementation-packets.mjs` enforces it: a non-terminal packet reserves every path it
  names). Measured at this base, the reservation set is EMPTY — all packets in the manifest
  are LANDED or SUPERSEDED, so none of this member's eight paths was reserved.
- **Behavior posture:** **NO PAID-SURFACE BEHAVIOUR MOVES.** Not one gate is added, removed,
  widened or narrowed; no user gains or loses a capability. What changes is what the pricing
  TABLE claims, one dead catalog field that had no reader, two documentation surfaces, and
  three registrations that nothing imports yet. Same-seed: **NEUTRAL** — no engine byte, no
  generator, no golden. Money: nothing sells, nothing grants; the only money-adjacent bytes
  are env NAMES (never values) and the removal of an instruction to configure a SKU the
  platform refuses to sell.

---

## §1 · THE RULING, AND THE CORRECTION THAT CHANGES WHAT "DE-ADVERTISE" MEANS

§464.2 ruled O-P1: "the ten unenforced Cartographer map rows are DE-ADVERTISED until the map
ships (the pricing table stops claiming a paywall that does not exist), with a contract-test
pin that every advertised Cartographer-only row has an enforcement symbol; at map activation
(D3b/P6) the rows return WITH their gates."

**Its premise was measured FALSE for four of the six rows that actually claimed anything**
(§449's later correction, CONFIRMED by the §471 skeptic and re-executed here). §449 hunted
for a `canUse*` symbol and found none, and concluded there was no gate. There is a gate; it
is not spelled `canUse*`. It is `viewerCanAuthor` (`src/lib/viewerAuthority.js:74-78`,
fail-closed), threaded `SettlementDetail.jsx:231 canEdit` → `SettlementDossierHero.jsx:103
mapCanEdit` → `OutputContainer.jsx:729` → `MapTabShell.jsx:216` → `SettlementMapPane.jsx:751
/:773/:781 entitled`.

So a literal reading of the ruling — strip ten rows — would have DE-ADVERTISED FOUR
CAPABILITIES THE PRODUCT ACTUALLY ENFORCES AND SELLS. This member implements the ruling's
INTENT, which its own words state: *the table stops claiming a paywall that does not exist*.
Where the paywall exists, the row stays and names the true symbol; where it does not, the row
leaves. That is the shape §471.2/F4 ruled and §473 ratified.

## §2 · THE MEASUREMENT — EVERY ROW, ADVERTISED VERSUS GATED

Executed at `b2852ccc3`, all 19 rows of `ENTITLEMENT_LADDER`, not the two the charter named.
"Claims" is `row.free !== row.cartographer` — the pair comparison, never `free !== true`
(§471.2/F4; the second spelling convicts `all-lenses` and `surveyor-stages`, whose cells are
equal STRINGS, and the executed counts at this base are 11 claiming under the right predicate
against 13 under the wrong one).

| row | axis (§514.1b) | ladder cells (free / cartographer) | claims? | the gate, measured | verdict | disposition |
|---|---|---|---|---|---|---|
| every-size | account | true / true | no | `TIER_GATE.free.maxTier === TIER_GATE.premium.maxTier === 'capital'` (authSlice.js:53-54) | parity, TRUE | unchanged |
| saves | account | `3 saves` / `unlimited` | YES | `TIER_GATE.maxSaves` free 3 vs premium Infinity → `maxSaves()` authSlice.js:693 | BOTH | unchanged |
| custom-content | authoring | false / true | YES | `TIER_GATE.customContent` → `canUseCustomContent()` authSlice.js:681 | BOTH | unchanged |
| gallery-viewing | viewing | true / true | no | none needed; `PublicDossierView.jsx:147` mounts the pane `canEdit={false}` for everyone | parity, TRUE | marker → `parity` |
| same-engine | account | true / true | no | constitutional — the engine is never tier-gated | parity, TRUE | unchanged |
| living-realm | account | false / true | YES | `TIER_GATE.neighbour` → `canUseNeighbour()` authSlice.js:654 | BOTH | unchanged |
| map-chains | **viewing** | false / true | YES | `TIER_GATE.mapChains` → `canUseMapChains()` authSlice.js:674, plus three affordance consumers (MapOverlay.jsx:62, LayersPanel.jsx:54, RoutesToolbar.jsx:50) | BOTH | unchanged |
| map-view | viewing | true / true | no | none needed; SettlementMapPane is the VIEWER and viewing is free on every tier | parity, TRUE | marker → `parity` |
| provenance-hover | viewing | true / true | no | none needed (`townMap/provenanceModel.js` is tier-blind) | parity, TRUE | marker → `parity` |
| all-lenses | viewing | `all 5 lenses` / `all 5 lenses` | no | derives from `TOWN_MAP_STYLE_IDS` (5) — equal cells | parity, TRUE | unchanged |
| panorama | viewing | true / true | no | none needed (`buildTownMapPanoramaDrawList`, SettlementMapPane.jsx:41) | parity, TRUE | marker → `parity` |
| map-editing | authoring | false / true | YES | **`viewerCanAuthor`** → `useTownMapPresentation.js:120-124 editing = audience==='dm' && Boolean(canEdit) && authoringSaveId != null && desktop` | BOTH — the ladder named the wrong symbol | marker → `viewerCanAuthor` |
| dm-pins | authoring | false / true | YES | **`viewerCanAuthor`** → `SettlementMapEditControls.jsx:93 {savedMap && !entitled && <LockedMarkers />}` | BOTH — wrong symbol named | marker → `viewerCanAuthor` |
| change-view | **viewing** | false / true | YES | **`viewerCanAuthor`** → `SettlementMapNotes.jsx:157 depth = entitled ? Infinity : FREE_CHANGE_DEPTH` with `FREE_CHANGE_DEPTH = 1` (:33) | BOTH — **and the free CELL was a small lie**: free is not refused, it is capped at the latest change per band | marker → `viewerCanAuthor`; free cell → `'latest change only'` |
| fog-table | **viewing** | false / true | YES | **`viewerCanAuthor`** → `fog/SettlementMapFogControls.jsx:70 if (!entitled)` → the locked panel | BOTH — wrong symbol named | marker → `viewerCanAuthor` |
| interiors | viewing | `1 sample per settlement` / true | YES | **NONE.** `InteriorView.jsx` has ZERO real importers in `src` (the six textual hits are three posture comments, the artwork registry row `design/boundBook.js:117`, a comment in `domain/interior/index.js`, and the module itself; a scan for an `import … InteriorView` statement returns nothing). `onEnterInterior\|enterInterior\|openInterior` over `src` → 0. `sample` under `src/components/interior` → 0. | **ADVERTISED, NEITHER gated NOR shipped** | **DE-ADVERTISED** → `DEFERRED_LADDER_ROWS` |
| v2-redraw | authoring | false / true | YES | **NONE, and the claim is inverted.** `withLayoutLawVersion` (mapEdits.js:581) has no caller outside its own module and the barrel. `newSettlementMapEdits()` (:610) returns `{ layoutLawVersion: NEW_SETTLEMENT_LAYOUT_LAW_VERSION }` = 2, stamped TIER-BLIND onto every newly saved settlement at four create boundaries (SaveToLibraryButton.jsx:41 and :91, SettlementsPanel.jsx:166, BuyThisDossier.jsx:158). **The free tier already receives v2.** | **ADVERTISED, NEITHER — and free already has it** | **DE-ADVERTISED** → `DEFERRED_LADDER_ROWS` |
| export-bundle | account | `$2.99 per settlement` / `included` | YES | `TIER_GATE.export` → `canExport()` authSlice.js:660 | BOTH | unchanged |
| surveyor-stages | account | `per task` / `per task` | no | derives from `SURVEYOR_AI_COSTS` — equal cells | parity, TRUE | unchanged |

**Totals at this base: 19 rows, 11 claiming, 8 parity. At this member's tip: 17 rows, 9
claiming, 8 parity.** Of the six rows that carried the retired `ruled-2026-07-17` marker AND
claimed a paywall, FOUR were enforced all along and TWO were not. Four further rows carried
the marker while claiming nothing.

⭐ **THE OWNER-GATED QUESTION, ANSWERED BY MEASUREMENT: no de-advertisement here removes
anything a paying customer currently receives.** A Cartographer subscriber gets nothing
today for `interiors` (nothing mounts) and nothing extra for `v2-redraw` (every tier is
minted at v2). `change-view`'s free cell moves from `false` to `'latest change only'`, which
ENLARGES what the table admits the free tier already has and takes nothing from the paid
tier, whose depth stays `Infinity`. Had any row measured the other way, it would have been
raised to the owner rather than shipped.

## §2b · THE OWNER'S AUTHORING RULING, MEASURED (ODQ §514 / §514.1b)

Two owner rulings landed while this car was in flight. **"Full plan free: every free and
anonymous user … gets the map included with the dossier"**, refined to **"Editing the map is
paywall gated at all levels of the map. But viewing and interacting with it is not."**

⭐ **THE RULING CONVERGES WITH THIS CAR'S OWN CORRECTION.** §449 found the real gate on four
of six rows was `viewerCanAuthor` — literally the authoring question. The owner has now made
authoring the product line. The same symbol answers both, which is the strongest evidence
either finding could have. Every ladder row therefore now declares an
`axis: 'viewing' | 'authoring' | 'account'`, and the walker pins the ruling as a law rather
than as prose.

**THE SPLIT, EXECUTED:** viewing 8 · authoring 3 · account 6.

**(a) AUTHORING GIVEN AWAY FREE — a revenue leak. Measured: ZERO.** Every authoring row
claims a paywall and every one resolves. The map's authoring surfaces were swept level by
level: the settlement pane's edit chrome mounts only inside `{editing && …}`
(`SettlementMapEditControls.jsx:94`) where `editing = audience==='dm' && Boolean(canEdit) &&
authoringSaveId != null && desktop` (`useTownMapPresentation.js:120-124`); annotations ride
the same flag (`SettlementMapAnnotations.jsx:63`); pin drags, reroll, legend and reset all
route through affordances rendered under it (`SettlementMapPane.jsx:387-398`, passed at
`:767-770`); the plot/3-D level guards internally
(`scene3d/TownSceneInspector.jsx:130 if (!canEdit || !anchor || !onCommitEdits) return;`,
`scene3d/TownSceneOrphanOverrides.jsx:61 const authoring = canEdit && typeof onCommitEdits === 'function'`);
the interior level ships no authoring surface at all. No ungated authoring affordance exists.

⚠ **(b) THE STRUCTURAL FINDING — A CHOKEPOINT WITHOUT A GUARD.** `commitEdits`
(`useTownMapPresentation.js:142`) is the SINGLE writer of `mapEdits`, and it has **no gate of
its own**: it normalizes, pushes undo history and persists, for any caller. The invariant
"authoring is gated at every level" is therefore held at N render boundaries rather than at
the one place all authoring flows through. Nothing leaks today — that was measured, not
assumed — but a future car that wires an affordance to `commitEdits` outside an
`{editing && …}` block leaks silently and no test in the estate would see it. Reported to the
chair; a chokepoint guard is the structural cure and it is not this car's to add, because it
changes enforcement on a paid surface.

⛔ **(c) VIEWING BEHIND A PAYWALL — the opposite error. Measured: THREE rows.** Under the
ruling these are wrong at the PRODUCT level, not merely mis-marked:

| row | what is gated | where | why it reads as viewing |
|---|---|---|---|
| `map-chains` | the region map's supply-chain LAYER | `TIER_GATE.mapChains` → `canUseMapChains()` authSlice.js:674; locked affordances at MapOverlay.jsx:62, map/LayersPanel.jsx:54, map/RoutesToolbar.jsx:50 | toggling a layer on is interaction; the derivation is already tier-blind by design |
| `change-view` | the DEPTH of change history a reader may see | `FREE_CHANGE_DEPTH = 1` (SettlementMapNotes.jsx:33) applied at `:157` through the authoring predicate | reading history is interaction, and it is capped by the AUTHORING gate |
| `fog-table` | the fog panel | `fog/SettlementMapFogControls.jsx:70 if (!entitled)` | revealing quarters at a live table reads as interaction — though the owner may class the session's PERSISTENCE as authoring, which is exactly why this one is reported rather than decided |

⛔ **ALL THREE ARE REPORTED, NOT SHIPPED.** Changing any of them changes what a user
receives, and paid-surface behaviour is owner-gated (§464 carve-outs). They are carried in a
frozen `VIEWING_PAYWALLS_PENDING_514` ledger in `entitlementLadder.js`, each with a written
reason, and the walker pins that ledger EXACTLY equal to the measured set — so a fourth
offender reds, and a stale entry reds. When the ruling is implemented the entries leave and
rule F holds with no exceptions at all.

**(d) ANONYMOUS.** The ruling admits no free/anonymous distinction for the plan. Measured:
`TIER_GATE.anon` and `TIER_GATE.free` differ on `maxTier` ('town' vs 'capital') and
`maxSaves` (0 vs 3) — account-axis facts, both outside the map — and are IDENTICAL on every
other gate. `viewerCanAuthor` refuses both identically (neither is `premium` or `founder` and
neither is elevated). No map-axis divergence between anonymous and free exists.

**(e) NO MAP-SPECIFIC SKU OR CAPABILITY ID EXISTS,** and this car mints none: the ladder's map
rows resolve through `viewerCanAuthor` and `TIER_GATE`, both of which govern the rest of the
dossier identically. `ACTIVE_CHECKOUT_SKUS` contains no map product.

## §3 · THE ENFORCEMENT-SYMBOL WALKER

`tests/config/entitlementLadder.enforcement.test.js` (CREATE). Rule A: every claiming row
names a symbol in a RESOLVER TABLE that is **driven**, not grepped — each resolver answers
"is free refused and premium granted?" against the real `TIER_GATE` / `viewerCanAuthor`.
Rule B: a non-claiming row demands no resolution, every `'parity'`-marked row has literally
equal cells, and **no row carries the retired marker**. Rule C: the two de-advertised ids are
in `DEFERRED_LADDER_ROWS`, absent from the ladder, their copy labels retained, and the
RENDERED comparison table carries neither — anchored on the same render containing 'DM pins'.
Rule D: the `'latest change only'` cell is tied to `FREE_CHANGE_DEPTH = 1` by source scan.
**Rule E (§514.1b): every `authoring` row is gated** — it claims, and its symbol resolves.
**Rule F (§514.1b): no `viewing` row claims a paywall**, except the three ids in
`VIEWING_PAYWALLS_PENDING_514`, and that ledger is pinned EXACTLY equal to the measured set
so it can neither grow silently nor go stale. Each half carries a POSITIVE CONTROL driven
through the rule's own predicate: a planted free-authoring row and a planted
paywalled-viewing row outside the ledger.

⛔ **THE ABSENCE PIN READS ROW VALUES, NEVER SOURCE TEXT.** `entitlementLadder.js`'s own
header explains the retired marker and therefore contains the string; a source scan for it
would match that prose and pass while a live row still carried the marker. This is the
doc-agreement vacuity class (ODQ, TE-NOTICES), and the walker avoids it by construction.

## §4 · `pdfExport` — A DEAD FIELD THAT LIED (O-P3)

`TIERS.wanderer.features.pdfExport` was `true` while `TIER_GATE.free.export` is `false` and
`EXPORT_MODE.free` is `'per_dossier'`. It survived because **it has no reader**: `pdfExport`
over `src` returns the three catalog lines plus the unrelated i18n key `errors.pdfExportFail`;
over `tests` it returns one comment. Flipping it is therefore INERT — no surface behaves
differently — which is exactly why it needed a pin rather than a fix. The tierFacts contract
test now asserts `TIERS.<tier>.features.pdfExport === TIER_GATE.<legacy>.export` for
wanderer/free, cartographer/premium and founder/premium, plus the literals, so a future edit
cannot restore the drift by moving both sides together into a tautology.

## §5 · THE TWO DOCUMENTS THAT DISAGREED ABOUT SELLABLE SKUs

`.env.example` listed `STRIPE_PRICE_CREDITS_10/50` — legacy packs kept resolvable for refund
and replay only — while the entire ACTIVE catalog (credits 25/60/150, single_dossier,
surveyor) was absent. `docs/DEPLOY.md`'s money block still instructed a deployer to set
`STRIPE_PRICE_FOUNDER_LIFETIME`, a SKU `create-checkout` refuses to sell
(`ABOLISHED_PRODUCTS`, ODQ §118) and that **no function reads** — verified: no
`Deno.env.get` for that name exists anywhere under `supabase/`, only a header comment and a
test fixture. `deployRunbookFreshness` runs one-directionally (consumed ⇒ documented), so the
stale line was inert to every pin.

`.env.example` now carries an ACTIVE block derived from the one exported list
`ACTIVE_CHECKOUT_SKUS` and a LEGACY block under its own marker, walked in three classes.
`docs/DEPLOY.md` loses the abolished line (−1), and the paragraph that used it as its worked
example of the tolerated "documented-but-unconsumed" state moves to past tense at +0 lines
(J-R2-4's second option, taken — see §11 J3).

## §6 · THE DARK REGISTRATIONS (§471.1/F1)

Three registrations land here because this car alone owns the file. All are inert.
`SURVEYOR_PLAN` ($14.99/mo, BYOK, `surveyor_entitlements`) sits OUTSIDE `TIERS` because
`TIERS` keys are `profiles.tier` shapes and Surveyor is an entitlement — the same reason
migration 139 declined to widen the tier CHECK — so `getVisibleTiers()` stays three-way.
`ANNUAL_FACTOR = 0` with a DERIVED `CARTOGRAPHER_ANNUAL`; at 0 the plan derives to zero price
and zero credits. `ACTIVE_CHECKOUT_SKUS` is dial-aware: `premium_annual` joins if and only if
`ANNUAL_FACTOR > 0`, so WEB-10's flip needs no second edit here. Every pin written for them
asserts the SHAPE and the DERIVATION, never the dial's value, and is therefore green at 0 and
at 10. **STOP check executed:** `SURVEYOR_PLAN|CARTOGRAPHER_ANNUAL|ACTIVE_CHECKOUT_SKUS|ANNUAL_FACTOR`
over `src tests` at the base returned exit 1 — no name collided.

## §7 · CHANGE MANIFEST

| action | path | what |
|---|---|---|
| MODIFY | `src/config/entitlementLadder.js` | header rewritten; 4 markers → `parity`; 4 → `viewerCanAuthor`; change-view free cell → `'latest change only'`; 2 rows removed; `DEFERRED_LADDER_ROWS` added |
| MODIFY | `src/config/pricing.js` | `pdfExport: false` on wanderer + its reason; the Surveyor header sentence re-worded; `SURVEYOR_PLAN`; `ANNUAL_FACTOR` + `CARTOGRAPHER_ANNUAL`; `ACTIVE_CHECKOUT_SKUS` |
| DOC | `.env.example` | the ACTIVE and LEGACY price-id blocks |
| DOC | `docs/DEPLOY.md` | the abolished SKU struck; the worked-example paragraph to past tense |
| CREATE | `tests/config/entitlementLadder.enforcement.test.js` | the walker (rules A–D, four negative controls) |
| TEST | `tests/config/tierFacts.contract.test.js` | the `pdfExport` parity block |
| TEST | `tests/config/pricing.test.js` | the `.env.example` walker, the two-way parity scan, the stub pins |
| TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` | the census row — WALKED and REVERTED digest-exact here; it rides to the landing act (§417) |

Effective PRODUCTION lines: entitlementLadder.js and pricing.js only; both live under
`src/config/`, which **no `max-lines` rule covers** (`ceilingFor()` in
`tests/lint/sizeBaseline.test.js` returns null for that path, and `eslint.config.js` declares
no `src/config` layer) — so the size baseline has no entry for either and none is owed. The
new leaf measures **138 effective lines** by eslint's own Linter, under the 250 cap. No
generated artifact, no migration, no `package.json` byte, and **none of the eight paths
appears in any `supabase/functions/_shared/*.meta.json` inputs roster**, so no
`build:edge-shared` is owed.

## §8 · CENSUS

Lighting census WALKED at the member tip and REVERTED digest-exact (sha256
`49488f215f11379177768f48bcee0654d61f1bb734f0aa7c988be26714572770` restored, both readings
printed):
**`2516/366/2150/20863/5808` → `2517/366/2151/20896/5817`, DELTA `+1/+0/+1/+33/+9`.**

⚠ **THE DELTA IS SMALLER THAN THE TITLES ADDED, AND IT WAS ATTRIBUTED RATHER THAN ACCEPTED.**
Reverting ONE file at a time and re-walking: the new leaf contributes +1 file, +1 credited,
+19 titles; `tests/config/pricing.test.js` contributes +14 titles (measured — with it
reverted the walker reads 20882, and 20882 − 20863 = the leaf's 19, restored `cmp` 0); and
`tests/config/tierFacts.contract.test.js` contributes **ZERO**, because it was ALREADY PARKED
at the base — its four new arms are real coverage the census cannot see, and nothing reds.
`parked` is unmoved at 366 and the new leaf is CREDITED, which is what the arithmetic
requires: `credited` +1 with `parked` +0.

The other two censuses a new test file can red were checked and are not owed:
`scripts/mutation-coverage-manifest.json` enumerates the seven enforcer dirs plus, elsewhere
under `tests/`, basenames matching its NAME_PATTERN — `tests/config` is not an enforcer dir
and `entitlementLadder.enforcement` matches no token in that pattern — and the test-ratchet
total is a landing-act figure, not a member one.

## §9 · ACCEPTANCE

| id | case |
|---|---|
| A1 | **(merged, ≤8)** Walker rules A and B, the two halves of one predicate. **A:** every row that CLAIMS a paywall (`free !== cartographer`) names an enforcement symbol that RESOLVES to "free refused, premium granted" when DRIVEN against the real gate; the claiming set is the nine named in §2 and the parity set the eight, both printed and both asserted non-empty so no arm passes on an empty walk. **B:** every non-claiming row carries a parity-class marker, every `'parity'` row has literally equal `true` cells, and NO row carries the retired `ruled-2026-07-17` value — read off `row.enforcement`, never off source text, and anchored on the same array proven fully populated. |
| A3 | Walker rule C: `interiors` and `v2-redraw` are in `DEFERRED_LADDER_ROWS` with a `returnsAt` of `map activation D3b/P6` and a written reason, are absent from `ENTITLEMENT_LADDER` (anchored on the list containing `dm-pins`), keep their `band4.rows` labels, and the RENDERED pricing page contains neither 'Building interiors' nor 'The v2 map redraw' while containing the 'DM pins' label. |
| A4 | Walker rule D: `change-view`'s free cell is `'latest change only'` and `SettlementMapNotes.jsx` declares `const FREE_CHANGE_DEPTH = 1;`, with the negative control that the same scan is false against a planted `= 2`. |
| A5 | `TIERS.<tier>.features.pdfExport === TIER_GATE.<legacy>.export` for wanderer/free, cartographer/premium and founder/premium, plus the literals: wanderer false, the two paying tiers true, `TIER_GATE.free.export` false. |
| A6 | `.env.example`'s ACTIVE block names `STRIPE_PRICE_<KEY>` for every key in `ACTIVE_CHECKOUT_SKUS`, names no abolished SKU and no legacy pack (anchored on a live positive); legacy names appear only below the legacy marker and the two blocks account for every occurrence in the file; the markers themselves are asserted present so a rot cannot produce an empty slice. |
| A7 | The two-way source scan: `ACTIVE_CHECKOUT_SKUS` equals the key set of `create-checkout`'s ACTIVE `PRICE_MAP` block in BOTH directions, with a planted extra on EACH side as a negative control, and the block markers asserted present. Re-runs: the existing LADDER WALKER (pricingPageBands #5), `illustratedLensFree`, and the four gate suites (`dmPinsTierGate`, `fogTierGate`, `changeViewDepthGate`, `settlementMapPaneEdit`) stay green. |
| A9 | **(§514.1b, merged)** The owner's AUTHORING axis, both halves with a positive control on each. **Rule E:** every row declares an `axis`; the three-way split is the measured one (`viewing` 8 · `authoring` 3 · `account` 6, each membership asserted in GROUP order so a row moving groups reds); every `authoring` row claims a paywall AND resolves its symbol, so authoring is never given away free. **Rule F:** no `viewing` row claims a paywall except the three in `VIEWING_PAYWALLS_PENDING_514`, and that ledger is pinned EXACTLY equal to the measured claiming-viewing set, in order, each with a written reason — so it can neither grow silently nor go stale. **Positive controls:** a planted free-authoring row is driven through rule E's own predicate and caught; a planted paywalled-viewing row outside the ledger is caught, and the ledger is proved not to be a mute button. Both `DEFERRED_LADDER_ROWS` carry an axis so their return is classified. |
| A8 | `SURVEYOR_PLAN` is $14.99 monthly BYOK keyed to `surveyor_entitlements`, frozen, its `stripeProduct` a key `create-checkout` already resolves, and it is NOT a `TIERS` key nor in `getVisibleTiers()`; `CARTOGRAPHER_ANNUAL.priceCents`/`.credits` equal `ANNUAL_FACTOR ×` the monthly plan's, the same arithmetic is driven live at factor 10 (5990 / 300, and 10× is proved equal to 12× minus two months), and `ACTIVE_CHECKOUT_SKUS.includes('premium_annual') === (ANNUAL_FACTOR > 0)`. |

## §10 · MUTANTS DRIVEN

Each planted at the member tip, executed, and restored `cmp`-verified. A CLEAN-GREEN control
was run first (75 passed, 0 failed over the three edited config suites) so an all-red sweep
could not be mistaken for conviction by a broken runner.

| id | mutation | conviction |
|---|---|---|
| M1 | plant `{ id:'planted-x', free:false, cartographer:true, enforcement:'ruled-2026-07-17' }` into the ladder | walker 3 failed / 9 passed — the claiming-set membership, the resolver arm ("no resolver — the row claims a paywall no symbol enforces") and rule B's retired-marker absence |
| M2 | `map-editing` enforcement → `'parity'` with `free:false` intact | walker 2 failed / 10 passed — rule A's resolver lookup and rule B's parity-marker list |
| M3 | restore `pdfExport: true` on wanderer | tierFacts contract 2 failed / 19 passed |
| M4 | move `interiors` back into the ladder | walker 3 failed / 9 passed — including `expected [...] to not include 'interiors'` |
| M5 | `FREE_CHANGE_DEPTH = 2` | walker 2 failed / 10 passed — rule D and its control |
| M6 | rewrite rule A's predicate to `free !== true` | the equal-string control convicts: `all-lenses` and `surveyor-stages` become claiming rows with no resolver |
| M7 | add `premium_annual` to `ACTIVE_CHECKOUT_SKUS` unconditionally | pricing.test two-way parity scan reds — the server block lacks it |
| M8 | `SURVEYOR_PLAN.priceCents: 1999` | the derived-equals pin reds |

⭐ **ONE MEMBER-CAUSED RED, FOUND BY THE SWEEP AND CURED IN-MEMBER.**
`tests/lint/negativeAssertionAnchor.walker` reported **12 un-anchored negative assertions**
across this member's two test files (4 in the new leaf, 8 in `pricing.test.js`) against a
frozen ceiling of 0. Neither the focused config battery nor the §489.3 grep arm could see it:
the walker scans the whole test corpus from `tests/lint`, and no token of this member points
there. It was cured with the repo's own helper — `expectAbsentWithAnchor` from
`tests/helpers/anchoredNegatives.js` — rather than with the `// anchored:` comment escape
hatch, so every exclusion now names a live sibling that travels the same code path and a
collection that drifted away reds on the anchor instead of passing the absence.

## §11 · JUDGMENTS (VETOABLE) AND DEFERRALS

- **J1 — the four re-pointed rows STAY on the table.** The ruling says "de-advertise the ten";
  measured, four of them advertise a real paywall. Rejected: the literal ten-row strip, which
  would have removed four capabilities the product enforces and sells. Reversal: move the four
  back out and restore the marker. Blast radius: none — the rows render exactly as before;
  only `enforcement` changed, and it has no renderer (`PricingBands.jsx:255-270` reads
  `row.free`/`row.cartographer` only).
- **J2 — `change-view`'s free cell becomes a qualifier rather than staying `false`.** The
  ladder said free is refused; the code caps free at depth 1 and shows the latest change per
  band. Rejected: leaving `false` (a lie in the customer's favour is still a lie, and the
  ruling is about the table telling the truth). Reversal: one cell. Blast radius: the table
  admits more for the free tier and nothing changes for the paid tier; no gate moves.
- **J3 — the DEPLOY.md worked-example paragraph moves to past tense** (J-R2-4's second,
  explicitly-lawful option) rather than being left as written. Rejected: leaving it, which
  would leave a paragraph describing a state this very commit ended. Reversal: revert four
  comment lines. Blast radius: prose only; CLAIM_RE over every added line returns 0 with the
  regex proved live against a planted control.
- **J4 — the new leaf keeps the charter's filename**, which by measurement escapes the
  mutation-coverage census (its NAME_PATTERN has no `enforcement` token and `tests/config` is
  not an enforcer dir). Rejected: renaming it to `…walker.test.js` to opt in, which would buy
  a `scripts/mutation-coverage-manifest.json` entry against a SHRINK-ONLY count arm and change
  the ruled CREATE path. Reversal: rename plus one manifest entry. **Deferred and written
  down:** this walker's mutation coverage is proved in §10 by drive, not by registry
  membership — a successor widening the mutation manifest should pick it up.
- **J5 — the ladder gains an `axis` field rather than the walker inferring one.** §514.1b
  makes authoring the paid axis, and a rule that cannot be stated per row cannot be pinned.
  Rejected: inferring the axis from the row id or from a hardcoded list inside the test —
  both put the product law in the enforcer instead of in the config it governs, and both go
  stale the first time a row is added. Reversal: delete one field from 19 rows and rules E/F.
  Blast radius: none rendered — `PricingBands.jsx` reads only `free`/`cartographer`; the
  existing ladder walker and `illustratedLensFree` re-run green.
- **J6 — the three violating rows go into a pinned exception ledger, not a silent pass and
  not a behaviour change.** Rejected: (a) un-gating them here, which is paid-surface
  behaviour and the owner's call; (b) marking them `authoring` to make the rule green, which
  would launder the finding into a lie; (c) leaving rule F out until the ruling is
  implemented, which would ship the car with no pin on the thing the owner just ruled.
  Reversal: delete the ledger and the two arms that read it. Blast radius: no user-visible
  change whatsoever — the ledger is a test fixture with a written reason per row.
- **DEFERRED (charter §10, unchanged):** the credit-pack analytics event, which cannot fit
  under the cap and touches a generated bundle.
- **DEFERRED:** `tests/config/tierFacts.contract.test.js` is PARKED, so its pins are invisible
  to the lighting census (§8). Not this member's to cure — un-parking it would move `parked`
  and `credited` for reasons unrelated to paywall honesty.

## §12 · AFFIRMATIVELY NOT DONE

No `canUse*` symbol added; `viewerCanAuthor` untouched; no gate's behaviour moved. No edge
function, webhook, migration, RLS or grant. Interiors and the v2 opt-in are NOT shipped —
they return at map activation. The Cartographer price HOLDS at $5.99. Neither dial is
flipped; `premium_annual` is NOT added to `create-checkout` (the parity scan holds because
BOTH sides lack it); neither `SURVEYOR_PLAN` nor `CARTOGRAPHER_ANNUAL` is given a reader.
The `band4.rows` copy labels are NOT deleted. No migration head figure and no migration
filename is pinned anywhere in this packet.

## §13 · THE SWEEP, CLASSIFIED

The chair's §511 throttle landed mid-build, so the widened twelve-tree sweep was replaced by a
**capped, targeted battery over the SIX trees this change set can reach** — `tests/config`
`tests/docs` `tests/lint` `tests/scripts` `tests/ui` `tests/security` — run once at the final
tree with `--pool=threads --maxWorkers=2`:

`Test Files 5 failed | 468 passed | 1 skipped (474)` · `Tests 7 failed | 4802 passed |
1 skipped (4810)`.

| # | failing title | class |
|---|---|---|
| 1 | `enforcement-claims` — every completeness claim carries an @enforced-by tag | banked |
| 2 | `clampPrimitiveBaseline` — baseline matches the local clamp definers | banked |
| 3–5 | `warCostKindPools` — `trajectory_misread`, `war_trajectory_losing`, `war_trajectory_winning` | banked |
| 6 | `warRulingKindPools` — `succession_demand_inherited` | banked |
| 7 | `sovereigntyLightingContract` — THE CENSUS IS AN ASSERTION | **this member's ONE authorized interior red** (§417 — the row rides to the landing act) |

**ZERO strays.** Six of the banked seven are reachable in these six trees; the seventh,
`metronomeCooldownLint`, lives in `tests/domain` and is unreachable by this change set (no
domain byte moves). The banked set was ALSO re-proved by execution in a detached baseproof
worktree at this exact base over twelve trees before the throttle arrived — `Tests 7 failed |
21351 passed` — which corroborates ODQ §507.3/§509.1 independently rather than inheriting it.

**TREES NOT RUN, AND WHY.** `tests/domain`, `tests/lib`, `tests/components`, `tests/copy` and
`tests/edgeFunctions` contain readers of this member's symbols, but every one of them was
enumerated by the §489.3 grep arm — 36 fixed-string tokens across all 37 `tests/` trees,
yielding 25 files — and all 25 ran GREEN, so running the whole trees adds no reachability.
The remaining trees are unreachable: no engine byte, no generator, no golden, no migration, no
`package.json` byte, no edge-shared bundle input.

⚠ **AN INSTRUMENT LIE BANKED BY THIS LANE, AND IT IS THE §507.5 FAMILY WITH THE SIGN FLIPPED.**
The throttle's first prescribed flag, `--poolOptions.threads.maxThreads=2`, **does not exist in
vitest 4.1.8**: it raises `CACError: Unknown option` and exits **1 with ZERO tests collected**.
An exit code with no collected-test count is not a verdict. It was caught here by the printed
counts rather than by the exit status, diagnosed as an instrument error rather than classified
as a red, and re-run with `--pool=threads --maxWorkers=2` before anything was concluded.
