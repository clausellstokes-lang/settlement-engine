# THE OWNER DECISION QUEUE — the single surface (consolidated 2026-07-26)

> **THE LAW OF THIS QUEUE.** As of 2026-07-26 (owner order: "consolidate the owner
> queue into one surface") this file is THE ONE place owner decisions live. The six
> prior surfaces — the 07-21 CONSOLIDATED OWNER QUEUE (ledger §1338), THE_REMAINING_
> ARCHITECTURE §9, MASTER_MERGE_PLAN §8, the Herald veto list (memory), SETTLEMENT_
> CAPABILITY_ATLAS Part VII, and the scattered memory picks — are now HISTORICAL
> feeder lists; they are cited as sources below and must not grow new items. New
> decisions APPEND here with a source tag. A resolution is recorded in place:
> `✅ RULED <date>: <ruling>` — never deleted. Sessions surface the relevant section
> at the decision's blocking point; nothing here blocks work before that point.
>
> Source tags: [CQ]=07-21 consolidated queue · [RA§9]=THE_REMAINING §9 · [MM§8]=
> MASTER_MERGE_PLAN §8 · [ATLAS#n]=Capability Atlas Part VII · [GRH]=generation
> remediation handoff addendum · [CRP]=CAPABILITY_REMEDIATION_PLAN R-5 · [HER]=
> Herald veto list · [MEM]=memory-tracked pick · [NEW]=surfaced 2026-07-26.

## §1 · THE LAUNCH TAIL — ⛔ owner-physical acts, in execution order
Tail order (owner ruling 2026-07-19, unchanged): loop convergence → PUSH #1 → soak
→ tuning → THE ONE REGEN → THE WALK → PUSH #2 → THE VERY END deploy → PUSH #3.

- **T1. Marketing-masters LFS-vs-move** — ~460MB in `marketing/` on this ledger branch; before pushing review-fixes: LFS-migrate OR move masters out (recorded default: move out, commit the removal). Blocks: the ledger-branch push only if the masters ride it. [RA§3]
- **T2. PUSH #1** — dark, soak-ready composite to origin as backup/transfer. ⭐ *Materially satisfied 2026-07-26 by THE BANKING PUSH (standing backup authorization + owner re-order); see ledger row.* Residual: owner may still declare a formal PUSH#1 point post-convergence. [RA§5]
- **T3. The soak** — CERT-30 / CENTURY-100 / CENTURY-300 with pre-declared bands; now also the realm-scale certification profiles (soak:release). Blocks: tuning. [CQ-T6, NEW]
- **T4. Tuning sign-off** — idx21 · idx19 · obligations-decay F6+F19 · depletion town/city steps (§3.G6) · tuning manifest SIGNED. Blocks: THE ONE REGEN. [CQ-T4.5, GRH]
- **T5. THE ONE REGEN signature** — the single flag-lighting batch: seven flags in DEFAULT_SIMULATION_RULES · letter humanizer · pressureModel raw.reasons · em-dash sweep + C2-Q1/Q2 · re-record ALL golden families ONCE · declared-shift row. See adjudication §6.R2 for what the 07-24 in-tree regens were and were not. Blocks: PUSH #2. [CQ-T4, RA§7, MM§8.3c]
- **T6. THE WALK** — the owner's finished-site walk; walk feedback = rulings. Blocks: PUSH #2. [RA§9.9]
- **T7. PUSH #2** — flag-lit, golden-re-minted, walk-corrected; 100%-green gate mandatory. [RA§5]
- **T8. Master-merge execution authorization** — re-survey MASTER_MERGE_PLAN first (STALE at execution level: pinned tips, conflict censuses, budget constants all pre-drift; mig-collision §2.D1). PR to master + merge button = owner-physical. [MM, RA§8]
  ✅ RULED 2026-07-26 (vetoable): execution authorized-in-advance by the owner's order, slotted at its tail position (THE VERY END), CONTINGENT on (a) the fresh re-survey (executed this sitting — addendum appended to MASTER_MERGE_PLAN.md) and (b) the composite push landing at the remediation lane's close. The PR and the merge button remain owner-physical.
  ⭐ RE-SURVEY VERDICT (2026-07-26, measured): **the merge ALREADY EXECUTED 2026-07-15** — W1 merge commit 0168e287 resolved 568 conflicts per the plan's own dispositions; W2–W6 verified in history (fences held file-by-file, both paid-surface rulings survived, schema is a strict superset, any-cast 2252 exact); master @ d024286e is an ANCESTOR of composite-r4. Remaining: **W7** = full-gate evidence on the composite tip (the banking-fold gate run IS this evidence once the golden re-capture lands) and **W8** = a zero-conflict FAST-FORWARD PR of 1,573 commits — owner button only. The plan doc is retired to after-action status; its addendum is the live state. NEW sub-decisions it surfaced: see M38–M40 below.
- **T9. Migration-train deploy** — now 118→188 (+189/190 from Wave 8; the committed plan's "138–154+" and "mig 170" lines are stale). 9-wave clone rehearsal + rollback classification FIRST (MIGRATION_REHEARSAL_RUNBOOK); applied-head bumped only after live verification. `supabase db push` = owner-physical. [RA§8, NEW]
  ✅ RULED 2026-07-26 (sequencing, vetoable): deploy authorization acknowledged as granted-in-principle by the owner's order; the binding sequence is unchanged — clone rehearsal receipts FIRST (the tooling correctly refuses anything but an attested clone; the clone itself is an owner console act, exact steps in docs/ops/OWNER_CONSOLE_RUNSHEET.md), then the owner-physical push. Nothing deployed this sitting.
- **T10. Legal consult** — ToS/privacy + seal trademark clearance. Blocks: public launch. [RA§9.17]
- **T11. Support-email flip** — configure MX/forwarding, verify round-trip, THEN flip SUPPORT_EMAIL in the same deploy batch; never flip first. Destination itself still unconfirmed. [RA§8, MM§8.3, CQ-standing]
  ✅ RULED 2026-07-26 (mechanics, vetoable): NO code flip exists or is needed — src/copy/support.js already reads VITE_SUPPORT_EMAIL at build time with the gmail default as fallback. The entire act is owner-console: confirm destination → MX/forwarding → round-trip test → set VITE_SUPPORT_EMAIL in the deploy environment. Runsheet steps added; the destination confirmation itself remains yours.
- **T12. PUSH #3 (activation)** — may fire multiple times (MX, legal, Stripe Connect clear on different days); each on a 100%-green gate. [RA§5]
- **T13. Founder-transfer activation** — code-complete, key-inert; LEGAL SIGN-OFF is the activation gate. [RA§9.15, CQ-standing]
- **T14. The un-soaked-deploy acknowledgment** — standing owner choice; restate and re-affirm at deploy, never assume. [MM§8.6]
- **T15. Microsite public deployment** — unscheduled, owner-only. [RA§9.19]

## §2 · DEPLOY-COUPLED decisions (each rides a named deploy)
- **D1. CSP enforce-flip ratification** — the banked vercel.json flips Report-Only→ENFORCING directly, skipping the report-only soak the old csp-report punch list prescribed. Decide: ship enforce-at-deploy vs restore a soak window first. Blocks: first production deploy. [CQ-T5.7, NEW]
  ✅ RULED 2026-07-26 (owner order "do all of these"; manager ruling, vetoable): ENFORCE-AT-DEPLOY stands. Pre-launch there is no organic traffic for a meaningful report-only soak — the first real traffic IS launch traffic and deserves the enforcing header from minute one. Conditions: the post-deploy verification run includes a zero-CSP-violation browse of the primary routes on both origins; rollback is the one-line rename back to Report-Only if legitimate resources break.
- **D2. Migration-numbering respec for Wave 8 + admin items** — Wave 8's "mig 170 inert" spec is dead (170=founders_roll; head=188; next free=189). Any new money migration respecs from 189. Blocks: Wave 8 dispatch. [NEW — Wave-8 confirmation]
- **D3. COGS/margin readout deploy** — report_ai_cogs fn + migration. [CQ-T5.8]
- **D4. admin-actions deploy AFTER client release** + amr-claim verification at deploy. [MEM]
  ✅ RULED 2026-07-26 (vetoable): sequencing affirmed — admin-actions ships strictly after the client release. Code-side amr machinery CONFIRMED present AND WIRED: _shared/twoKey.ts (signature-verified claim decode + latestPasswordAmrTs + freshness window) is consumed by admin-actions/index.ts:48 (checkTwoKey + decodeJwtAmr; enforcement ~424-435, stale session → 403). The deploy-time act is verifying production GoTrue actually mints amr entries — runsheet line added.
- **D5. DR runbook rehearsal** — now superseded-in-shape by MIGRATION_REHEARSAL + POST_DEPLOY_VERIFICATION runbooks; owner schedules the rehearsal + the backup/restore drill receipts. [CQ-T5.9, NEW]
- **D6. Cron/monitor infrastructure** — map.settlementforge.com Vercel project + DNS/TLS + VITE_FMG_URL; ACCOUNT_DELETION_CRON_SECRET + PAYMENT_REFUND_CRON_SECRET + pg_net schedules; the private obligation monitor (≤4-min cadence) + alert-delivery drill. All owner-only infrastructure; SERVICE_OBJECTIVES says the 5-min objective is unmet until these exist. [NEW]
- **D7. Stripe Connect activation timing.** [RA§5 PUSH#3]
  ✅ RULED 2026-07-26 (vetoable): event-anchored, not calendar-dated — Connect activates AT PUSH #3, after legal sign-off (T10) and BEFORE founder-transfer activation (T13, which depends on Connect for payouts). Owner performs in the Stripe dashboard; runsheet line added.

## §3 · GOLDEN-SHIFTING / ENGINE rulings (each changes same-seed outputs; batch with T5 where possible)
- **G1. Network effects** — wire as declared engine input (shifts goldens) vs label the panel advisory. [ATLAS#8, CRP]
- **G2. G9 polarity-blind banding** — 3 of 4 dimensions display OPPOSITE of truth (executed proof ×2); fix moves band words/colors/Library sort/PDF; G10 causalBandWord rides along. One-time visible shift. [ATLAS#3, CRP]
- **G3. regenSection('history') destruction** — destroys authored beats + worldPulse campaignEra entries; standing park; blocks safe exposure of history/tension prose editing. (NPC-half preservation is BANKED as of 2026-07-26 — the atlas lineage CONFLICT 1 is dissolved.) [ATLAS#12, MEM]
- **G4. Deity cluster** — pool removal (T4-batched) · dropped lawAxis · undo-less non-DM patron replacement · third `converted:` namespace · deity:core: ref lifecycle trace. [ATLAS#13, MEM]
- **G5. Cascade-borrowed `required` beyond the roster** — 5 borrows wrongly immune to decline/closure/calamity; producer-side fix costs +103 golden keys. [GRH#1]
- **G6. Depletion tuning depth** — flat town↔city step 0.35/0.35; "go lower" = city 0.30 + town 0.25 (second tuning; re-measures town-pinned tests). Veto point for the already-applied city 0.55→0.35 ruling. [GRH#2]
- **G7. Distribution-red depth measurements owed** — distributionEnvelopes base-vs-now depth · ordering.test siege suppression at large N (NOT yet measured; no bound may move before measurement). [GRH#7/#9]
- **G8. tradeRoute→neighbourRelationship rename** — crosses the POWER_INTENT_VERSION frozen snapshot shape. [GRH#4]
- **G9. Founding-seeds receipt prose** — the-enduring-mill synopsis/receipt edit (tests-only importer); the besi-1 history.founding.reason prose edit is the live veto surface. [GRH#3]
- **G10. E-J TIER-2 digest-move + family-2 war edge** — shipped-path risk; recorded rec: after soak. [CQ-T5.10/11]
- **G11. Wizard-news record identity** — wizardNews carries no npc/faction id; Herald subjects degrade to settlement links; needs an engine/persistence decision. [ATLAS#29, HER]
- **G12. Per-order marginal forecast in RealmForecast** — stays owner-gated; program restates it as a non-goal. [GAME_GRADE]
- **G13. Terrain-at-cursor forecasting** — deferred unless the map bridge gets a truthful per-cell read. [GAME_GRADE, ATLAS#15-adjacent]

## §4 · PRODUCT / TASTE rulings
- **P1. HERALD_TITLE** — "The Herald" (manager pick, live) vs owner's "Wizard News". One string. [HER]
- **P2. Herald routing vetoes** — the 3 recorded routing calls + post-advance→Dashboard auto-open (live behavior). [HER]
- **P3. War W-L unit** — open Herald question. [HER]
- **P4. DmScreen slot** — what fills the Oracle's old DM-card slot. [MEM]
- **P5. Edit-toggle keep vs retire** — premium paywall seam vs G-2a no-global-mode thesis. [ATLAS#1, CRP]
- **P6. Stat-bars bands-vs-numbers** + whether OverviewTab raw-ratio retirement extends to DefenseTab. [ATLAS#20, MEM]
- **P7. Order-8 film ruling** — backdrop vs rebuild (band NEVER existed). [MEM]
- **P8. Realm-unfurl film** — no master exists; produce/choose = taste + media production. [RA§9.2]
- **P9. Losing journey-legs media set** — deleted at the walk (bg vs journey). [RA§9.4]
- **P10. HowToUse direction** — About-pivot vs master's 11-heading how-to. [RA§9.5]
- **P11. Hero line.** [MEM] · **P12. The 05 numbering gap.** [MEM] · **P13. Maker's-name on About.** [RA§9.13]
- **P14. Tone gate + K-3 ornament tone plates** (sent, veto open) + **K-1 grammar-kernel budget sheet signature**. [MEM]
- **P15. DE-ROUND taste call** (~500 live lines) + the 3 orphaned components (delete vs wire: MemberSettlementsList / GalleryMapsSidebar / SimulationRulesGateToggle). [CQ-T5.12]
- **P16. Compendium deep-link scheme** — owner-gated infrastructure (deity links = cheapest proof). [MEM, ATLAS#15-adjacent]
- **P17. Glossary extension · bulk-Canonize confirm · persona-door** — legibility-wave deferrals. [MEM]
- **P18. Open-bottom ladder amendment.** [RA§9.12] · **P19. Six deep-wave JUDGMENTs.** [RA§9.10] · **P20. Plate `.orig` deletions.** [RA§9.11]
- **P21. Frozen-record family** — 5 generation-frozen records shown in present tense; land as fieldManifest FROZEN_VS_LIVE rows. [ATLAS#28]
- **P22. Scene vs canonical address spaces** — deliberately NOT joined; re-open only with the deep-link scheme. [ATLAS#15]

## §5 · PLATFORM / MONEY rulings
- **M1. Wave 8 dispatch** — CONFIRMED 2026-07-26: Wave 8 never ran; all four items MISSING with live defect sites (amount-blind clawback arm stripe-webhook:3021 · mig-142/publicSafe npcs-only allowlist vs factions[].members[] · verify-checkout-session sole money endpoint without rateLimit · M11 mount-time verify race SingleDossierSuccessPage:89-131). Decide: dispatch respec'd Wave 8 (migs from 189) pre-deploy or fold items into the deploy train. [NEW, CQ-Wave8]
  ✅ RULED + DISPATCHED 2026-07-26 (owner order; manager ruling, vetoable): its own respec'd wave, executed this sitting — mig 189 = faction-member scrub parity, mig 190 reserved for the credit-clawback RPC if needed. POLICY AMENDMENT to the original H20 spec: the amount-aware-leniency half is SUPERSEDED by the banked webhook's red-team CRIT-1 posture — full clawback for EVERY reversal class stands BY POLICY; goodwill flows are credit grants, never partial refunds; the chokepoint lands as explicit classification + intent-pinning tests, zero behavior change. This retires the "issue no partial refunds" rule's accident status: it becomes permanent policy with a sanctioned goodwill path.
  ✅✅ LANDED @ composite-r4 2725780e / 02ae1d6f / 91ec7c22 (2026-07-26): all four items built + verified (manager checker runs: consolidated vitest 246/246, webhook deno 115/115, scrub parity 114/114 with EXECUTED two-direction mutation proofs, limiter deno 14/14, validate:edge 69 green). Scope truths recorded: the members leak was goal/gender/power (secret/plotHooks were already depth-caught); mig 190's RPC proves negative-balance netting (20→−30→+40→10); reversal class is recorded durably via p_reason. Post-deploy, partial refunds become SAFE-and-classified; until then the operator rule stands.
- **M2. Credit-pack refund clawback** policy. [CQ-BatchB]
  ✅ RULED 2026-07-26 (manager, vetoable): a refunded/disputed credit-pack purchase claws back the FULL granted amount; the balance may go NEGATIVE (a debt future grants and purchases net against — a zero-floor would make buy→spend→refund profitable); idempotent claim-once keyed on the session, mirroring the grant. Implementation dispatched with Wave 8.
- **M3. Dead ai_ip_rate_limit config** — wire or delete. [CQ-BatchB]
- **M4. VersionsTab paid pitch** — "manual snapshot" + "side-by-side diff" sold, neither exists; build vs the copy-only repair. [ATLAS#18, CRP]
- **M5. Pricing sheet sign-off** + 10-byte budget raise + livePricing +9B Option A/B + applyCreditCosts switch. [MEM]
- **M6. FMG BYOK re-enable** (product call) + byok fail-open posture. [CQ-T5.13, MEM]
- **M7. The 31 dead registered ops** — retire vs wire, per family; sharpest: setLock/clearLocks (locks engine vs retirement + durable lock map). [ATLAS#21, CRP]
- **M8. uncanonize eventLog destruction** — snapshot/tombstone before it keeps advertising as canonize's undo. [ATLAS#25]
- **M9. Deity-lane premium gating** — hand-mirrored in 3 places, enforced in none (documented fail-open); enforce fail-closed (CRP R-0 does this vetoably) or bless fail-open. [ATLAS#27, CRP]
- **M10. Named-fate cluster** — 3 NPC-deletion paths bypass the identity-consent barrier; tombstone-vs-successor dial. [ATLAS#2]
- **M11. DESTROY_SETTLEMENT convergence** — three settlement-ender lanes need confirm-gate + review-gate parity. [ATLAS#4]
- **M12. Advertised-undo class** — 4 of 5 undoLastPulse advertisers never arm; cure = ratchet. [ATLAS#5]
- **M13. Toggle-surface scope** — store-GLOBAL 15 ops, no receipts/per-item undo; intended? [ATLAS#9]
- **M14. Provenance-ledger merge** (composer vs pulse). [ATLAS#10] · **M15. Table-event economy verbs** (may the desk record a burned granary?). [ATLAS#11]
- **M16. content.definition.mass-update** — retire spec vs ship bulk lane. [ATLAS#6] · **M17. Surveyor flag runtime gate** (spec.surveyor===true before executeSessionCommand). [ATLAS#7]
- **M18. Faction-rename convergence + door** [ATLAS#14] · **M19. Factions bucket** — mechanism or retire authoring; tierMin reclass. [ATLAS#24, MEM faction-refs gap]
- **M20. ChronicleScrollback** — mount the built paid-record reader or ratchet an importer. [ATLAS#19] · **M21. ReadSystemStateBar** — remount vs delete. [ATLAS#22]
- **M22. 3D quality-ceiling persistence** — cheap fix, touches saved-state shape. [ATLAS#17]
- **M23. settlementScene3dDefault promotion** — external-evidence-gated per TOWN_SCENE contract (device lab · AT journeys · 12-GM study · taste walk · RC soak; 30/45/90-day windows). [ATLAS#16]
- **M24. CC open gates** — CC-CLOUD-CUTOVER clone rehearsal (data-loss stakes) · CC-PROVENANCE-COVERAGE · CC-PLATFORM-EVIDENCE. [ATLAS#23]
- **M25. Flag-on review blackout** — ChangeDock/PendingChangesBar mount reconciliation; ships with G-2b promotion, not before. [ATLAS#26, CRP]
- **M26. DM-parked proposals sweep** — owner word open. [MEM]
- **M27. Research-consent opt-in→opt-out posture.** [RA§9.6] · **M28. Backend-gated restores** (profile-name RPCs mig-075 · productPrefs defaults). [RA§9.7]
- **M29. Audit-spine write path** — rec: edge endpoint. [RA§9.14] · **M30. customRegistry de-eagering** (~41KB, post-launch owed). [RA§10]
- **M31. supplyCompleteness.js:158 intentional NUL** — keep-with-allowlist vs convert; parked AT the master merge. [MM§8.2]
  ✅ RULED 2026-07-26 (vetoable): KEEP, with the explicit controlBytes allowlist entry added at merge time. Byte-identity preserved (THE PROMISE outranks scanner tidiness); converting shifts bytes for zero user value. Revisit post-launch only if the allowlist grows a second member.
- **M32. settlement.schema.js field delta** (master +542 vs RF +407) — adjudicate kept fields at merge. [MM§8.3b]
  ✅ RULED 2026-07-26 (principle, vetoable): the RF/composite shape is canonical. A master-only field survives the merge ONLY with a named live consumer; otherwise it is dropped and noted in the merge record. Enumeration executes at the merge sitting using the re-survey's field list.
  ✅ CLOSED by re-survey (measured): the answer set is EMPTY — master-only @property fields = 0; the composite is a strict superset (224 props vs master's 181; exported surface identical; SCHEMA_VERSION/SIMULATION_VERSION/GENERATOR_VERSION identical). Nothing to adjudicate.
- **M33. Auth recovery-redirect confirmation** at merge. [MM§8.3d]
  ✅ RULED 2026-07-26 (procedure, vetoable): a functional check of the recovery email → set-new-password path runs during merge verification; if broken, the fix lands within the auth-as-shipped posture — no scope reopening.
- **M34. Paid-surface sign-offs at merge** (free.export:false survives; maxTier=capital vocabulary). [MM§8.3e]
  ✅ RE-AFFIRMED 2026-07-26: both prior owner rulings stand — free.export stays false through the merge; maxTier keeps RF's `capital` vocabulary. Sign-off recorded; no re-litigation.
- **M35. Golden-branch first-paint overage** (~10.7KB) — MASTER-MERGE BLOCKER; reclaim-first vs signed raise vs defer-past-merge. [MM§8.1, MEM]
  ✅ RULED 2026-07-26 (vetoable): RECLAIM-FIRST, per the monotone-ratchet law ("prefer reclaiming headroom over requesting a raise"). Named candidates: FP-2b/2c + the unmerged perf commit 92973282. A signed raise is entertained only if reclaim demonstrably exhausts at merge time — with the measurement attached.
- **M36. Whole-system-engineer skill: 11 amendments** — veto open. [MEM]
- **M38. Historical-migration in-place edits (024/057)** — the composite retro-edited two ALREADY-APPLIED migrations (the spend_credits fallback CASE ladder, narrative 3→5 / progression 5→6), deliberate per mig 174's header, but repo replay-from-scratch now diverges from prod's applied bytes. Acknowledge-and-document (a REPLAY_NOTES entry) vs forward-fix migrations restoring byte-history. Money-shaped; surfaced by the re-survey. [NEW]
- **M39. RF branch disposition** — review-fixes is no longer a code branch (0/308 master commits; 507 post-fold commits are docs/marketing; its two source files were deliberately deleted on the composite; its closure-budget constant is a stale fork 1,066,400 vs 1,040,000). Ruling proposed (vetoable): formally retire RF as LEDGER/MARKETING lane, never merge it toward master, and align its budget constant at the next ledger sitting. [NEW — re-survey §A6.2/3]
- **M40. Un-landed cherry-picks** — ab1c30ba (mapOverlayThumbContract) and ccd0d670 (QuickInspector docstring + mapChains flag) are on NO tip; 92973282 (perf first-paint) remains the M35 reclaim candidate. Land, re-implement, or drop — per item. [NEW — re-survey §A6]
- **M41. Refund-copy contradictions (pre-consult repo defects)** — the Account FAQ promises a 7-day single-dossier refund window that appears in NO terms and collides with CRIT-1 reality; Pricing copy says $5.99 while config/pricing.js says $6.00; the ToS DRAFT's credit costs (3/4/5) are stale vs live (5/4/6); DESIGN_MONEY_WAVE §12 vs §13 disagree $25 vs $49.50 (code implements $25). All four are OWNER copy/policy calls (paid surface — not self-ruled); packet: docs/legal/LEGAL_CONSULT_PACKET.md. [NEW — legal inventory]
- **M37. The uncoached-evidence program** — schedule/recruit the human cohorts the promotion contracts require (SED-01 five-second protocol · HER-01 timed triage · TS3D external gates · CC authoring study · USER_VALIDATION 12-DM + 30-DM pricing cohorts). Engineering cannot produce these; several carry staleness windows. [NEW]

## §6 · VETOABLE RULINGS MADE 2026-07-26 (manager, under the owner's banking order — veto window open)
- **R1. The 07-24 completion pivot is RATIFIED-BY-BANKING**: PRODUCT_COMPLETION_ARCHITECTURE's 10-step order is the governing endgame FRAME; THE_REMAINING_ARCHITECTURE's ⛔ tail acts remain binding and embed at their steps; the GAME_GRADE 07-24 re-architecture supersedes the 8033ddbe wave plan; the command/import/custom-content verticals are in-scope (the 07-19 scope freeze is amended to that extent). Veto restores the 07-21 frame.
- **R2. GOLDEN-REGEN ADJUDICATION**: the 07-24/26 in-tree regenerations of the four golden families are RECLASSIFIED as documented defect-correction shifts of the generation-remediation lane (evidence: GOLDEN_SHIFT_LEDGER.md, per-cause rows) — they are NOT the SS7 ONE REGEN and do not consume it. THE ONE REGEN remains OWED, singular, owner-signed: the flag-lighting + humanization batch (T5 above), after which goldens shift once more, pre-declared here. The law is amended from "never two regens" to "never an UNDECLARED regen; the flag-lighting regen remains singular." Veto = void the in-tree regens and restore parked goldens (destructive to the remediation lane; not recommended).
- **R3. THE BANKING FOLD executed** — minifold's ~1,046 uncommitted entries committed as 12 lane commits on claude/composite-r4 (b503fe05..7a6603de) and pushed to origin under the standing backup authorization + the owner's 2026-07-26 order. CRP's "wave commits suspended in this tree" method line is superseded by that order for the fold itself; the live capability-remediation session resumes committing per its own plan on a banked tree.
- **R4. Governance home declared**: successor bootstrap chain = docs/START_HERE.md → this ledger's newest rows → docs/OWNER_DECISION_QUEUE.md (decisions) → minifold docs/CURRENT_STATE.md + PRODUCT_COMPLETION_ARCHITECTURE.md (program frame) → lane docs. COMPREHENSIVE_REVIEW_PROGRAM.md stays the append-only ruling ledger.

## §7 · RECENTLY RESOLVED (kept for confidence; full detail in ledger rows)
- ✅ Surveyor semantics — owner 2026-07-19: premium-as-Surveyor FINAL. [RA§9.3]
- ✅ Composite eager-closure 998B breach — dissolved by later reclaim; TRANCHE-3 closure 1,039,977 (margin 23B). [RA§9.1]
- ✅ Criminal-capture shift — owner 2026-07-26 "recalibrate"; N=400 proportional bounds; ledgered in GOLDEN_SHIFT_LEDGER.md. [GRH#6]
- ✅ Chain-stability red — owner "tune depletion down" (city 0.55→0.35); residual depth = §3.G6. [GRH#8]
- ✅ eventComposer faction phantom — owner "(c)+prefill"; custom factions pickable in ADD_FACTION. [MEM]
- ✅ Regen edit-loss lineage CONFLICT — dissolved by the banking fold (the NPC preservation fix is committed). [ATLAS CONFLICT 1]
- ✅ plot-hook envelope mis-spec — manager authority (mis-specified max → exceedance-count; base failed too); depth measurement still owed (§3.G7). [GRH#7]

## §8 · STANDING / INFORMATIONAL (recorded, not decisions)
- Mutation-manifest uncovered burn-down (shrink-only). · Parley has no client seam (E-D). · E-E content-fidelity variant = possible future enforcer. [CQ-standing]
- Golden re-capture owed at remediation-lane close (generatorGoldenMaster 84 city keys; UPDATE_GOLDEN=1 from a quiet tree, by whoever closes the lane). [GRH]
- Two standing vetoes available, explicitly out of merge scope: "enforce mapChains" · "wire map hover". [MM§8.7]
- The partial-refund operator rule stands until the webhook train deploys: **issue no partial refunds.** [CQ/W10]
