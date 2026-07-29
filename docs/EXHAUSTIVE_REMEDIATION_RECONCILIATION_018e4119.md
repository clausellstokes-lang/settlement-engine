# Exhaustive remediation reconciliation — `018e4119`

**Status:** source-bound implementation snapshot; not a competing backlog
**Architecture source:** `docs/EXHAUSTIVE_REMEDIATION_ARCHITECTURE.md` at `8dc57337`
**Code source:** `claude/composite-r4` at `018e4119f4603cc702ad6a42d0ccd000ee2f6fde`
**Reconciled:** 2026-07-28
**Authority:** `docs/COMPREHENSIVE_REVIEW_PROGRAM.md` remains the append-only program ledger. This file records what the 202 architecture items meant against one exact code tip so stale greenfield assumptions cannot become duplicate systems.

## Status vocabulary

| Status | Meaning |
|---|---|
| `done` | The outcome and enforcement already exist. Preserve them; do not rebuild them under the proposed filename. |
| `partial` | Substantial working machinery exists. Adopt and extend it to close the stated remaining outcome. |
| `superseded` | The prescribed design conflicts with a stronger landed design or a later owner ruling. Record the replacement and do not implement the obsolete prescription. |
| `true_gap` | The repository-owned outcome is materially absent and should be built, subject to dependencies. |
| `external_evidence` | Repository preparation exists, but completion requires a real deployment, device, human, counsel, or provider-produced receipt. |
| `demand_gated` | Deliberately deferred until measured demand justifies the additional product surface. |

## Summary

| Status | Count |
|---|---:|
| `done` | 18 |
| `partial` | 146 |
| `superseded` | 9 |
| `true_gap` | 21 |
| `external_evidence` | 6 |
| `demand_gated` | 2 |
| **Total** | **202** |

## Binding implementation refinements

1. Public pulse outcomes remain represented by absence of `recordMode`; central validation and predicates are extended without introducing an in-memory `public_event` sentinel.
2. The existing belief map, rumor-carrier, misinformation, credibility, and actor-belief machinery is the epistemic authority. No second proposition engine or monolithic full-world projection compiler is introduced.
3. Automatic capped catch-up is an intentional, tested product feature. Its remaining work is command/receipt consolidation; the architecture's refusal of wall-clock catch-up is superseded.
4. Catch-up is required to produce canonical mechanical-state equivalence, not byte-identical journal history. Its labels and receipts may legitimately differ from individually issued advances.
5. Identity keys remain minimal and immutable. Presentation labels, provenance, and content revision metadata wrap identity rather than participating in equality.
6. Projection policy is shared, while surface-specific least-privilege serializers remain separate. Consolidation must reduce leak risk rather than create a universal high-privilege object.
7. New manifests must eliminate an existing duplicate authority, feed runtime or a hard gate, and have a totality source. A manifest that only describes another manifest is not built.
8. Functional expected-red state begins empty against a green source tip. Historical failures are never pre-registered as acceptable.
9. The existing migration train freezes at repository head 192 until migrations 122–192 are rehearsed and deployment evidence is produced. New schema work is a follow-on train.
10. Behavioral changes and responsibility-only refactors land separately. Full-gate evidence is recorded at integration folds; focused passing groups are not called a green repository.
11. Anonymous acquisition analytics remains possible through a separately defended anonymous plane. Authenticated user-linked telemetry receives stronger admission; JWT-only ingestion is not imposed on every event.
12. “Exhaustive” means every REM item receives a durable disposition and every repository-owned remaining delta is closed. It does not mean rebuilding completed systems or fabricating external evidence.

## Item register

### Architecture

| ID | Status | Execution |
|---|---|---|
| REM-ARCH-01 | partial | Extend the existing worktree inventory into a source-bound integration-train census; archive before any deletion. |
| REM-ARCH-02 | true_gap | Build the federated capability-completion matrix without copying plane-specific authorities. |
| REM-ARCH-03 | partial | Extend the existing command executor vertically and add typed conflicts/direct-mutation burn-down. |
| REM-ARCH-04 | partial | Converge the existing destroy writer through a deterministic, atomic command vertical. |
| REM-ARCH-05 | partial | Make canon/uncanon state and tombstones durable without clearing historical events. |
| REM-ARCH-06 | partial | Migrate remaining durable mutation families to the journal one vertical at a time. |
| REM-ARCH-07 | partial | Add a minimal immutable reference contract and burn down name-shaped joins; G11 stamping is already landed. |
| REM-ARCH-08 | partial | Enumerate both flag planes without turning the manifest into runtime defaults. |
| REM-ARCH-09 | partial | Extend the existing layer/SCC walker only where a new directional rule catches real edges. |
| REM-ARCH-10 | partial | Federate existing boundary normalizers under versioned aggregate registration. |
| REM-ARCH-11 | partial | Consolidate authority metadata while preserving stronger existing per-document freshness checks. |

### Simulation

| ID | Status | Execution |
|---|---|---|
| REM-SIM-01 | partial | Centralize record-mode constants, validation, predicates, and literal enforcement; keep public as absence. |
| REM-SIM-02 | partial | Finish central arbitration and unknown-mode failure around the landed v4 partition. |
| REM-SIM-03 | true_gap | Introduce only a minimal in-memory effect envelope that demonstrably deletes duplicate adapters. |
| REM-SIM-04 | partial | Make the existing stage manifest assertion-relevant without making it execution-driving. |
| REM-SIM-05 | partial | Add one post-fold reconciliation boundary over declared conserved ledgers. |
| REM-SIM-06 | partial | Fix the 12-ticks/year peace-term defect and consolidate the canonical 52-week calendar law compatibly. |
| REM-SIM-07 | partial | Remove ambient-time durable identities while retaining legitimate wall-clock metadata. |
| REM-SIM-08 | partial | Extend the existing persisted cursor with input revision, version, receipt identity, and stale-base rejection. |
| REM-SIM-09 | superseded | Preserve automatic capped catch-up; wrap/audit its existing behavior rather than refuse it. |
| REM-SIM-10 | partial | Add cancellation-as-pause and revision-fenced worker response admission to the existing worker. |
| REM-SIM-11 | true_gap | Add an honest behavior epoch and replay receipt without claiming replay of implementations no longer retained. |
| REM-SIM-12 | partial | Structurally distinguish correctness and calibration where tests materially mix the two. |

### Epistemology

| ID | Status | Execution |
|---|---|---|
| REM-EPI-01 | superseded | Version and normalize the existing belief-map authority; do not add a parallel proposition store. |
| REM-EPI-02 | superseded | Share audience policy while preserving least-privilege surface-specific projections. |
| REM-EPI-03 | partial | Enumerate projection surfaces and add shared containment canaries/output-path totality. |
| REM-EPI-04 | partial | Map shared status vocabulary onto richer existing record workflows. |
| REM-EPI-05 | partial | Audit and fence cross-settlement truth reads; preserve specialized typed belief reads. |
| REM-EPI-06 | done | Existing carriers, delay, degradation, corroboration, credibility, forgetting, and decision consumption satisfy the outcome. |
| REM-EPI-07 | partial | Extend the existing disinformation ledger with explicit competing-account and correction lifecycles. |

### War

| ID | Status | Execution |
|---|---|---|
| REM-WAR-01 | true_gap | Compile a read-only WarRecord from existing truths; do not create a second persisted war authority. |
| REM-WAR-02 | partial | Consolidate existing conservation bookkeeping into per-war participant accounts. |
| REM-WAR-03 | partial | Add stable mission identity and an enumerated lifecycle over existing transit/deployment. |
| REM-WAR-04 | partial | Formalize fronts over canonical graph edges and shared movement capacity. |
| REM-WAR-05 | partial | Reference the existing naval engine from common war/front truth. |
| REM-WAR-06 | partial | Add explicit siege transitions, idempotency, and treaty-linked terminal outcomes around the existing occupation ladder. |
| REM-WAR-07 | partial | Totalize named-fate proposal/consent coverage while preserving anonymous cohort casualties. |
| REM-WAR-08 | true_gap | Add and enforce one shared distinct-belligerents predicate across every conflict arm. |
| REM-WAR-09 | partial | Expand residue handling into an exit-kind registry without stripping legitimate scars. |
| REM-WAR-10 | partial | Normalize identifiers and receipts around the mature treaty engine. |
| REM-WAR-11 | partial | Centralize war/peace hysteresis and add anti-thrash certification. |
| REM-WAR-12 | partial | Normalize existing conflict fan-out through typed cause references without duplicating writers. |
| REM-WAR-13 | partial | Compile contest records from existing war, trade-war, and faith-contest facts. |
| REM-WAR-14 | partial | Finish war record-mode literal consolidation and long-horizon public/mechanical evidence. |

### Faith

| ID | Status | Execution |
|---|---|---|
| REM-FAITH-01 | partial | Promote existing deity identity into a documented namespaced reference/provenance contract. |
| REM-FAITH-02 | partial | Codify existing planes and add the missing concealed-practice plane. |
| REM-FAITH-03 | partial | Consolidate existing piety, legitimacy, and stance derivations behind one read model. |
| REM-FAITH-04 | partial | Add explicit syncretism/reform states around existing contest and conversion behavior. |
| REM-FAITH-05 | partial | Route the existing patron-replacement door through a typed command and receipt. |
| REM-FAITH-06 | partial | Normalize latent-pantheon namespaces and prove old-save round trips. |
| REM-FAITH-07 | true_gap | Add canonical concealed-practice state and fail-closed projection containment. |
| REM-FAITH-08 | partial | Register long-horizon faith bounds and local-identity invariants. |
| REM-FAITH-09 | done | Premium isolation for faith mechanics is implemented and enforced. |
| REM-FAITH-10 | partial | Register and run the faith-specific certification family. |

### Economy

| ID | Status | Execution |
|---|---|---|
| REM-ECO-01 | partial | Totalize exact-ID economic joins and isolate legacy name fallback. |
| REM-ECO-02 | partial | Enforce resource semantics authority against projection-side inference. |
| REM-ECO-03 | partial | Compile one validated supply graph from existing flow organs. |
| REM-ECO-04 | partial | Consolidate route capacity, cost, risk, access, blockade, and maintenance truth. |
| REM-ECO-05 | partial | Replace display-local pricing approximation with a freshness-stamped compiler when dependencies are ready. |
| REM-ECO-06 | partial | Normalize existing shortage/embargo/blockade/smuggling/piracy effects without double application. |
| REM-ECO-07 | done | Economy freshness/versioned power intent is implemented and strict. |
| REM-ECO-08 | partial | Make the existing reviewed custom-content promotion point the sole supply-graph compiler. |
| REM-ECO-09 | partial | Generalize the existing economy input fingerprint and stale-result policy. |
| REM-ECO-10 | partial | Extend Table Ledger verbs through commands and receipts. |
| REM-ECO-11 | partial | Normalize existing resource lifecycle records and dark measurement dials. |
| REM-ECO-12 | superseded | Retain scoped ownership authority; do not add the proposed borrow ledger. |
| REM-ECO-13 | partial | Register graph, conservation, rename, non-vacuity, and distribution evidence. |

### Population

| ID | Status | Execution |
|---|---|---|
| REM-POP-01 | partial | Add initialize-once cohort identity and reconciliation around existing aggregate population truth. |
| REM-POP-02 | partial | Expand typed migration reasons and displaced/refugee/diaspora/return lifecycle. |
| REM-POP-03 | partial | Structurally enforce NPC/cohort separation and model optional accompaniment. |
| REM-POP-04 | partial | Normalize existing founding/decline/abandonment/relic/resettlement state. |
| REM-POP-05 | partial | Add whole-realm conservation and long-horizon non-vacuous envelopes. |
| REM-POP-06 | partial | Compile Travelers from canonical movement records and connect selection/containment. |
| REM-POP-07 | superseded | The alleged population founder-tier branch does not exist; guard against its introduction. |

### Stressors

| ID | Status | Execution |
|---|---|---|
| REM-STR-01 | partial | Reconcile existing lifecycle vocabularies into one transition contract and aging authority. |
| REM-STR-02 | true_gap | Add a total stressor declaration contract over every live adapter. |
| REM-STR-03 | partial | Consolidate record modes and add headline-only throttling with receipts. |
| REM-STR-04 | superseded | Preserve the mature upswing engine; share causes/effects rather than forcing a generic adapter. |
| REM-STR-05 | partial | Register non-vacuous envelopes and negative controls for every stressor family. |

### NPCs and factions

| ID | Status | Execution |
|---|---|---|
| REM-NPC-01 | partial | Normalize durable NPC identity and eliminate name/index fallback joins. |
| REM-NPC-02 | partial | Consolidate agency admissibility and presence-state receipts. |
| REM-NPC-03 | partial | Move named-fate enforcement into the common command layer and totalize construction paths. |
| REM-NPC-04 | partial | Close the final held dead operation and prove every advertised facet arms. |
| REM-NPC-05 | partial | Map contextual affordances to typed commands one vertical at a time. |
| REM-NPC-06 | partial | Formalize coalition, succession, leadership, and office-memory ownership. |
| REM-NPC-07 | partial | Wrap existing relational laws in one cause-bound ledger entry contract. |
| REM-NPC-08 | done | Faction rename has one writer, convergence, persistence, undo, and receipt coverage. |

### Diplomacy

| ID | Status | Execution |
|---|---|---|
| REM-DIP-01 | partial | Extend mature generosity receipts with canonical parties, costs, obligations, and causes. |
| REM-DIP-02 | partial | Consolidate statecraft impacts only where it removes duplicate writers. |
| REM-DIP-03 | partial | Wrap the existing corruption web in a canonical, cause-bound projection record. |
| REM-DIP-04 | partial | Expose existing information-statecraft verbs through typed commands and receipts. |
| REM-DIP-05 | partial | Add a mirror-mode admissibility gate before any behavior-bearing enforcement. |

### Code quality

| ID | Status | Execution |
|---|---|---|
| REM-QUAL-01 | true_gap | Build the export/responsibility census and behavior-preservation harness before large splits. |
| REM-QUAL-02 | true_gap | Extract pulse-kernel responsibilities only after QUAL-01 proves preservation. |
| REM-QUAL-03 | partial | Continue settlement-slice responsibility extraction around existing transactions/helpers. |
| REM-QUAL-04 | partial | Continue AI-slice extraction around existing lifecycle seams. |
| REM-QUAL-05 | partial | Finish edge narrative admission/provider/spend/projection separation. |
| REM-QUAL-06 | true_gap | Split the Stripe webhook by event family after billing disorder evidence is locked. |
| REM-QUAL-07 | partial | Continue Gallery responsibility extraction without duplicating release authority. |
| REM-QUAL-08 | partial | Thin OutputContainer around landed read models while preserving lazy boundaries. |
| REM-QUAL-09 | partial | Incrementally close external-boundary runtime contracts. |
| REM-QUAL-10 | partial | Shrink the existing 2,217-entry cast baseline; do not create a second baseline. |
| REM-QUAL-11 | partial | Extend declared generation contracts without wholesale object-identity changes. |
| REM-QUAL-12 | partial | Consolidate operation contracts only where semantic differences permit it. |
| REM-QUAL-13 | partial | Close typed failure/rollback outcomes around existing boundaries and action results. |
| REM-QUAL-14 | partial | Add a shared undo-policy vocabulary without weakening truthful advertiser checks. |
| REM-QUAL-15 | superseded | Preserve import undo invalidation/pruning rather than adding generic redo tombstones. |
| REM-QUAL-16 | superseded | Preserve the bounded proposal undo ring; durable compensation would be separate scope. |
| REM-QUAL-17 | partial | Federate existing build/reclaim budgets without raising ceilings. |
| REM-QUAL-18 | partial | Share worker fencing primitives without erasing different cancellation semantics. |
| REM-QUAL-19 | partial | Add measured cache/disposal coverage rather than universal premature memoization. |
| REM-QUAL-20 | partial | Refactor edge handlers family by family and enforce progress with existing CI. |

### Generation

| ID | Status | Execution |
|---|---|---|
| REM-GEN-01 | partial | Centralize existing executable pipeline metadata without changing order. |
| REM-GEN-02 | partial | Strengthen undeclared read/write detection before patch-only conversion. |
| REM-GEN-03 | partial | Totalize durable generated identity where material entities still lack it. |
| REM-GEN-04 | partial | Extend provenance where it answers a real consumer question without bloating saves. |
| REM-GEN-05 | demand_gated | Keep the deeper three-layer regeneration editor parked pending demand. |
| REM-GEN-06 | partial | Burn down remaining heuristic coherence joins and option reachability. |
| REM-GEN-07 | partial | Prove exactly-once generation-to-campaign handoff. |
| REM-GEN-08 | partial | Add safe cancellation and prove prose follows coherence. |

### Realm and maps

| ID | Status | Execution |
|---|---|---|
| REM-RLM-01 | done | Canonical RealmItem read model exists. |
| REM-RLM-02 | done | Herald routing and totality are implemented. |
| REM-RLM-03 | done | Herald sections are implemented. |
| REM-RLM-04 | done | Wizard-news subject IDs are stable and pinned. |
| REM-RLM-05 | partial | Finish vocabulary consolidation without rebuilding the Herald. |
| REM-RLM-06 | partial | Reduce dual map authority while preserving import/save compatibility. |
| REM-RLM-07 | partial | Migrate structural map writes to commands incrementally. |
| REM-RLM-08 | true_gap | Add topology-conflict records and resolver semantics. |
| REM-RLM-09 | partial | Version and fail-close the existing map bridge protocol. |
| REM-RLM-10 | external_evidence | Produce live DNS/TLS/CSP/origin handshake receipts. |
| REM-RLM-11 | partial | Formalize cross-scale identity without invalidating existing saves/fog references. |
| REM-RLM-12 | partial | Audit one route authority and all movement consumers. |
| REM-RLM-13 | partial | Close remaining TownScene promotion evidence and source binding. |
| REM-RLM-14 | external_evidence | Run physical-device, assistive-technology, resilience, and GM studies. |
| REM-RLM-15 | done | Footprint-derived interiors are implemented. |
| REM-RLM-16 | done | Player-safe UVTT/export contract is implemented. |

### Custom content

| ID | Status | Execution |
|---|---|---|
| REM-CC-01 | external_evidence | Rehearse/deploy migrations 185–188 and capture RPC/RLS/cross-device receipts. |
| REM-CC-02 | partial | Finish tick/Herald/Chronicle/legacy provenance totality. |
| REM-CC-03 | external_evidence | Capture current gate, device, recovery, and uncoached-author evidence. |
| REM-CC-04 | done | Atomic versioned definitions/bindings/environments and rollback are implemented. |
| REM-CC-05 | done | Deterministic preview and mechanics explanation are implemented. |
| REM-CC-06 | done | Migration preview, stale refusal, immutable rollback, and recovery are implemented. |
| REM-CC-07 | done | Supported visual boundaries are registered and enforced. |
| REM-CC-08 | done | Bounded, hashed, versioned atomic pack import is implemented. |
| REM-CC-09 | done | Reviewed supply-chain persistence is implemented locally; deployment belongs CC-01. |
| REM-CC-10 | done | Custom-content restraints are structurally enforced. |

### AI

| ID | Status | Execution |
|---|---|---|
| REM-AI-01 | partial | Make the existing model registry generated/runtime authoritative and close current provider facts. |
| REM-AI-02 | partial | Consolidate shared AI admission without erasing endpoint-specific refund laws. |
| REM-AI-03 | partial | Make BYOK funding/no-fallback semantics explicit and prove production custody. |
| REM-AI-04 | partial | Totalize registered least-privilege slices and consumer coverage. |
| REM-AI-05 | partial | Add one data-class retention/deletion/revocation authority. |
| REM-AI-06 | partial | Add world-revision answer fencing and mounted operation-log visibility. |
| REM-AI-07 | partial | Complete command/receipt parity around existing stage gates and fallbacks. |
| REM-AI-08 | partial | Close task registry, COGS, refund/cache, and operation-log contracts. |
| REM-AI-09 | partial | Add independent bounded evaluation receipts around the existing capability probe. |
| REM-AI-10 | partial | Add exact engine-isolation and telemetry-non-authority enforcement. |

### Gallery

| ID | Status | Execution |
|---|---|---|
| REM-GAL-01 | true_gap | Add immutable release artifacts without retaining live mutable publication authority. |
| REM-GAL-02 | partial | Compile client/SQL sanitization from one privacy policy authority. |
| REM-GAL-03 | true_gap | Add release lifecycle, immutable URLs, supersession, archive, and tombstones. |
| REM-GAL-04 | partial | Route sanitized imports through durable reconciliation with fork provenance. |
| REM-GAL-05 | partial | Finish media sniffing/EXIF/external-URL/user-block/release-tombstone hardening. |
| REM-GAL-06 | partial | Complete release-aware discovery, keyset pagination, ranking, and funnel instrumentation. |

### Analytics

| ID | Status | Execution |
|---|---|---|
| REM-AN-01 | true_gap | Separate defended anonymous acquisition ingestion from authenticated user-linked planes. |
| REM-AN-02 | true_gap | Build one producer-to-dashboard golden path and production canary. |
| REM-AN-03 | partial | Extend the event registry with producer/plane/property totality. |
| REM-AN-04 | partial | Bind metric definitions to rollups, dashboards, and versions. |
| REM-AN-05 | partial | Generalize k-anonymous rollups, retention, environment, and engine-import firewall. |
| REM-AN-06 | partial | Add field vitals, complete operational emissions, monitors, and drills. |
| REM-AN-07 | true_gap | Build a decision-oriented internal operations dashboard with human-only tuning. |

### Product and UX

| ID | Status | Execution |
|---|---|---|
| REM-UX-01 | partial | Complete the progressive positioning ladder and prove it with user evidence. |
| REM-UX-02 | true_gap | Centralize action-teaching empty states and enforce coverage. |
| REM-UX-03 | partial | Finish vocabulary authority and synonym burn-down. |
| REM-UX-04 | partial | Add one shared command/pulse/coherence receipt presenter. |
| REM-UX-05 | true_gap | Add a safe, pinned guided sample realm without production side effects. |
| REM-UX-06 | partial | Centralize era classification across historical and campaign timelines. |
| REM-UX-07 | partial | Complete the trust lens and durable uncanon tombstone behavior. |
| REM-UX-08 | partial | Add full-tree accessibility, contrast, flow, device, and AT evidence. |
| REM-UX-09 | done | Dossier grouping and Realm Inspector order are implemented and enforced. |

### Operations and commercial trust

| ID | Status | Execution |
|---|---|---|
| REM-OPS-01 | partial | Harden the existing executable migration waves and formalize checkpoints/reversibility. |
| REM-OPS-02 | partial | Execute attested rehearsal/deployment and bind live-head evidence. |
| REM-OPS-03 | partial | Complete command/obligation journal coverage over remaining high-risk verticals. |
| REM-OPS-04 | partial | Add dual-monitor math, configuration, live paging, and drill receipts. |
| REM-OPS-05 | partial | Bind backup/restore receipts and perform real timed RPO/RTO drills. |
| REM-OPS-06 | partial | Add authenticated canaries, secret inventory, rotation, and live CSP evidence. |
| REM-OPS-07 | partial | Add independent billing disorder/concurrency reconciliation around the strong webhook suite. |
| REM-OPS-08 | partial | Finish commercial truth/generated values/advertised-capability enforcement; keep built Versions features. |
| REM-OPS-09 | true_gap | Build COGS reporting in the follow-on migration train after 122–192 is deployed. |
| REM-OPS-10 | partial | Complete the activation-tail checklist; counsel, mail, DNS, Stripe, and final activation remain real external acts. |

### Testing and evidence

| ID | Status | Execution |
|---|---|---|
| REM-TEST-01 | partial | Add gate totality/cadence/evidence metadata around existing scripts. |
| REM-TEST-02 | superseded | Do not seed historical expected reds; any future flake registry begins empty and expires entries. |
| REM-TEST-03 | partial | Extend the landed v4 certifier and obligation coverage rather than replacing it. |
| REM-TEST-04 | partial | Federate existing invariant families and close replay/conservation/surface/handoff gaps. |
| REM-TEST-05 | partial | Finish source/section classification and long-horizon public/mechanical evidence. |
| REM-TEST-06 | external_evidence | Run the source-bound release matrix and human Chronicle review. |
| REM-TEST-07 | partial | Totalize golden surfaces and enforce declared shift/dirty-tree rules. |
| REM-TEST-08 | partial | Extend option-intent reachability from the live configuration census. |
| REM-TEST-09 | partial | Add cross-kind rename and installed-but-unbound neutrality certification. |
| REM-TEST-10 | true_gap | Build the generation-to-simulation exactly-once initialization certifier. |
| REM-TEST-11 | demand_gated | Keep deeper regeneration closure parked until stable entry identity and demand exist. |
| REM-TEST-12 | partial | Add a federated evidence index while retaining canonical plane contracts and anonymous analytics. |
| REM-TEST-13 | true_gap | Repair the user-validation protocol denominators/order and add protocol lint. |
| REM-TEST-14 | external_evidence | Run the real human/device/diary/Chronicle/WTP program after protocol and consent readiness. |

## First implementation folds

1. **Baseline and governance:** record a dependency-complete full gate, migration plan, worktree census, and this reconciliation snapshot.
2. **Bounded correctness:** central record-mode validation, the 52-week peace-term fix, distinct-belligerents enforcement, and validation-protocol repair.
3. **Release operations:** harden the existing 122–192 migration train, produce an attested clone rehearsal, and close post-deploy/backup/monitoring receipts.
4. **Authority verticals:** destroy and canon/uncanon command convergence; minimal identity; effect-envelope proof through one real vertical.
5. **Evidence closure:** simulation certification, generation-to-simulation handoff, projection-surface containment, and truthful release readiness.
6. **Responsibility refactors:** only after preservation harnesses exist, split the pulse kernel, Stripe webhook, and remaining coordinators by responsibility.
7. **Major new release structures:** immutable Gallery releases and authenticated analytics planes only after the migration and command spines are stable.
