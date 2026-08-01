# FABLE VALIDATION QUEUE — post-exhaustion judgment ledger

## Owner order 2026-07-31: "If I run out of fable, I want you to seamlessly switch to
## opus 5. For all validations post fable weekly usage is up, write in your documents
## and instructions for an account that has fable usage to validate those that weren't
## and readjust instructions where appropriate."

## THE PROTOCOL (binding on any Opus-era session)
The standing model split (owner law): Fable = manage / architect / VALIDATE / survey;
Opus = verify + implement. When Fable usage is exhausted, an Opus 5 successor inherits
FULL standing authority immediately (do not wait for the owner; the 2026-07-18
continuity order applies, updated to Opus 5) and performs BOTH chairs — but every
judgment that the split assigns to Fable's validate/architect chair MUST be recorded
here as a row, so a Fable-capable account can re-validate later and readjust.

**What gets a row (judgment-density items only — not mechanical green gates):**
- Wave/slice ACCEPTANCE judgments (reading implementer reports, deciding a wave is done)
- Any NEW architecture decision beyond the frozen design corpus (the six DESIGN_* docs
  are Fable-authored and FROZEN — building from them needs no row; deviating does)
- Golden-shift adjudications and any re-record acceptance
- Soak/certification verdict INTERPRETATIONS (what the receipts mean, not that they ran)
- Tuning-band ratifications (highest density — every ratified band gets a row)
- Deferral/skip/block dispositions with product consequences

**Row shape:**
| date | item | Opus decision | evidence (commits/receipts/reports) | what Fable should re-examine |

## RE-VALIDATION PROTOCOL (for the Fable-capable account)
1. Read this queue oldest-first alongside DESIGN_REALM_DIRECTIVES.md Progress.
2. For each row: re-derive the judgment from the cited evidence; CONFIRM (mark ✓ with
   date), ADJUST (record the correction as a new Progress entry + fix forward — never
   rewrite the Opus-era row), or ESCALATE to the owner if the correction is owner-gated.
3. Readjust instructions where appropriate: if a class of Opus-era judgment shows a
   systematic lean, amend the relevant design doc's judgment block (vetoably) and note
   the amendment here.
4. Tuning rows get priority: re-examine ratified bands against the same receipts before
   any further tuning.

## THE QUEUE (empty at creation — all judgments through 2026-07-31 ~21:50 are
## Fable-validated; rows begin when an Opus-era session begins)

| date | item | Opus decision | evidence | Fable re-examination |
|---|---|---|---|---|
| 2026-08-01 | Wave D acceptance (CREATE_ROUTE + migration 193) | ACCEPTED. Bilateral one-transaction CAS mirrors 183; two real defects (missing requestedAt; Immer draft reference-equality) were found by exercising recovery, not asserting it. | `8c82e8ae`; tests/security/createRouteCommand.pglite.test.js 21/21; combined gate exit 0 | Whether config._userRoutes is the right provenance home vs a first-class column when the train deploys |
| 2026-08-01 | J1 acceptance (route ledger + genesis) | ACCEPTED, incl. the implementer's design correction (water edges took the LAND grade ladder; ports totality now holds structurally, repair pass retired) | `ed5ac49d`; routeNetworkGenesis 80/80, dormancy golden 18/18 | The grade-ladder correction: confirm road-grade water genesis is the intended §8 reading |
| 2026-08-01 | H1 acceptance (durable NPC identity) | ACCEPTED. Mint is zero-PRNG FNV-1a, one-way, idempotent; Law 7 projection structural. NOTE: a persistence-shape change was disclosed (campaigns under full_simulation gain the ledger key) | `2bafa5d1`; npcLedger suites green; dormancy golden captured | The persistence-shape disclosure — confirm it needs no migration/versioning treatment |
| 2026-08-01 | First-paint reclaim: FP-G16 ESD trim | ACCEPTED as reclaim, not raise. cultureProfiles boundary excised from ENGINE_SHARED_DOMAIN and pinned to engine-core-lazy; closure 1,056,635 to 1,020,590 | `05786319`; VERIFY_DIST build suites 45 files/341 tests; golden master 3/3 unchanged | Whether other ESD boundary re-exports carry the same over-inclusion (a sweep, not a one-off) |
| 2026-08-01 | Soak harness remnant amendment | ACCEPTED. The population assertion excepts settlements by their own lifecycleDiedAtTick stamp rather than a magic number | `05786319`; realmScaleCertification 9/9 | Confirm the exception cannot mask a genuine zero-population bug in a NON-died settlement |
| 2026-07-31 | Golden-shift adjudication: npc-credibility dormancy `nc-b\|8\|one_month` re-recorded | ACCEPTED as a legitimate one-time shift caused by the wizard-news id fix (an `infowar_spy_exposed` beat, previously discarded, now counted by the golden's newsKinds histogram) | Commit 8d71a479; the projection was dumped with and without the fix on an isolated base worktree and diffed field-by-field: only `newsKinds` moved, tick/rollSummary/all four ledgers byte-identical | Re-derive the field-level diff from the commit's test-header account; confirm no ledger drift hides behind the histogram change |
| 2026-07-31 | Herald routing sections for the nine newly-flowing kinds | Eight war-doctrine kinds → `war`; `intel_transfer` → `trade` (rides the generosity obligation machinery) | Commit 8d71a479, heraldRouting.js; forced by the WHAT_PHRASES totality walker once rumor phrases landed | Re-file any kind whose door reads wrong in play; note `treaty_signed` FILES UNDER `events` in the Herald (impactKind `diplomacy` outranks kind by routing law) — decide whether bare `diplomacy` should re-route to `trade` or `war` |
| 2026-07-31 | `treaty_signed` upgraded to significance `major` (severity 0.55, score 66) | A dictated peace ends a war — on par with the climb-down (major/68); it previously graded notable/severity 0/score 0 by normalizeEntry defaults | peaceTerms.js signingBeat (wave-2 commit) | Confirm a signed treaty belongs in World Book majorHeadlines and the 240-cap major-arc rescue; downgrade if treaty spam emerges in long soaks |
| 2026-07-31 | Severity scale for the ten late-lane receipts | climb-down 0.6 · webwar mint 0.45 / raid+wrong-village 0.65 / abandon 0.4 / complete 0.5 · infowar lie 0.45 / spy 0.4 / intel 0.35 · treaty 0.55 — register anchored to the upswing exemplars (bust 0.6 major, boom 0.4 notable) | wave-2 commit; fixes "Severity 0%" cards and mildest-band rumor magnitudes. **MEASURED 2026-08-01 against the estate** (94 severity literals in 28 news-authoring files): band distribution 13/58/16/7 across the four magnitudeBandOf bands (cut-points 0.3 / 0.55 / 0.8), so the estate is band-1 dominated and these ten (6 in band 1, 4 in band 2) sit in the house register. Band 3 is reserved for REALM-scale beats only (a calamity strike, a pantheon shift, one npcAgency 0.85), so band 2 is the correct ceiling for settlement/actor-scale beats and webwar_wrong_village was deliberately NOT promoted to the atrocity band. treaty 0.55 sits exactly on the band-2 cut-point but has a house sibling at the same value (armyTransitKernel), so it is consistent rather than an outlier. No value changed on this evidence. | ~~Re-examine against a lit-realm soak's rumor magnitude distribution~~ **INSTRUCTION CORRECTED 2026-08-01 — that check is NOT EXECUTABLE: no soak receipt carries severity, rumor or magnitude data (verified against artifacts/soak release.json + smoke.json; the envelope holds eventTypeCounts/moverCounts, not entry severities).** What Fable CAN do: (a) re-derive the estate census above and judge whether band 1 vs band 2 is the right split per beat — the values are Opus-chosen even though the register is now measured; (b) rule on whether intel_transfer (0.35, "a notable turn") should drop under 0.3 to "a minor stir"; (c) decide whether a rumor-magnitude channel belongs in the receipt envelope at all, which is the instrument gap that made the original instruction unwritable |
| 2026-07-31 | `diplomacy` re-filed `events` → `trade` in heraldRouting (resolves row 2's open question) | Bare `diplomacy` has exactly ONE producer (the treaty signing beat), and its kind-row `treaty_signed` already filed `trade`, so both routing keys now agree; recorded as a KIND_SECTION divergence (the letter files diplomacy under `courts`) | heraldRouting.js + the walker's divergence registry (wave-3 commit); walker 17/17 green | ~~If a future producer mints `diplomacy` for a non-treaty beat, `trade` may misfile it~~ **RISK NOW ENFORCED 2026-08-01, not merely recorded:** heraldRouting.walker gained a SINGLE-PRODUCER KEYS test asserting `impactKind: 'diplomacy'` is minted by peaceTerms.js and nothing else, anchored both directions (a rename empties it and reds too). Mechanism proven by a two-producer fixture: the scan finds both, including in a subdirectory, and the assertion fails. So a second producer can no longer inherit the trade filing silently. Fable's remaining call is the taste one: when it does red, re-split `diplomacy` or give treaties their own impactKind |
| 2026-07-31 | Herald-doors architecture: buildHeraldFeed gains a READ-ONLY fourth source (campaign.wizardNews.entries) instead of widening the persisted impactDigest freeze | Display-layer completion of the module's own stated contract ("pulse + wizard-news records"); rejected the pulseKernel freeze-widening because it rewrites persisted per-tick pulseHistory content and grazes provenanceKernel's read of `applied.newsEntries` | heraldFeed.js + tests/components/heraldFeedSources.test.js (wave-2 commit) | Validate the lens rule (advance = `entry.tick >= latestPulse.tick`; movers receive the same worldState.tick the pulse record stores) against a multi-interval advance; confirm the persisted-digest road stays closed |
