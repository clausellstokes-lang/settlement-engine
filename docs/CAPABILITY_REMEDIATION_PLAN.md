# Capability Remediation Plan — fixing what the Atlas found

> **Progress** (append after every wave — this blockquote alone must reconstruct program state)
> - Program opened 2026-07-26 from docs/SETTLEMENT_CAPABILITY_ATLAS.md (204-gap ledger, Part VI; 30-item owner queue, Part VII; every C/H-grade finding adversarially verified against code by the atlas's own Opus passes). Owner order: "fix it all thoroughly" (2026-07-26). Wave R-0 launched same day.

## Sources
- docs/SETTLEMENT_CAPABILITY_ATLAS.md — the audit. 600 rows, 204 numbered gaps (Part VI), 30-item owner queue (Part VII), 4 recorded CONFLICTs (§5). Findings are referenced below by their atlas ids (VI.n #k, queue #k). All load-bearing findings were probe-confirmed during the atlas build (node probes, importer censuses, executed greps) and survived a per-slice Opus adversarial pass plus a completeness critic — no separate probe phase is needed; probes re-run per wave at fix time.

## Method
Model split (owner order this session): Fable implements and manages; Opus verifies.
Gates: fast = focused vitest file(s), single-threaded (`--no-file-parallelism` — parallel reds are FAKE in this tree); quick = affected suites + touched ratchet/walker tests; full = `npm run build && npm run verify:dist` single-threaded. Known pre-existing red at program open: vendorPdfLazy engine-chunk ceiling (693,932 > 660,000), attributed to the concurrent programs' uncommitted work — 1 failed | 284 passed is the baseline; any NEW red is ours.
Every wave: fix → pins → fast gate → Opus adversarial verify → quick gate → plan-note update. **NO git mutations of any kind** — this is a live shared tree (574 foreign modified files; concurrent sessions commit under us). Waves land as verified uncommitted increments; folding is the owner's, at fold points. Staging any shared file would commit foreign hunks — that is why the standard one-commit-per-wave cadence is deliberately suspended (JUDGMENT, vetoable — a veto means the owner directs an explicit-file fold per wave instead).

## Owner decisions honored throughout (do not violate)
- THE PROMISE: no same-seed output drift; any legitimately shifting fix is declared BEFORE its wave and parked if it moves goldens.
- Finite-semantics law; deity doctrine (no premade pool; `deity:core:` lifecycle trace required); never resolve a named character's fate; legibility law (translate, never show formulas).
- Closure budget (~54 B margin): NEW code = lazy leaves only; nothing eager. sizeBaseline exact ceilings (JSX comments count).
- Store-action lifecycle: any new/renamed store action → operationRegistry + `gen:compendium-data` regen + label/description walkers.
- New dispatcher kinds → COMMITTABLE_EDIT_KINDS. Faction access only via nameOf/governingFactionOf/factionArchetype/npcInFaction.
- Owner-parked items (Part VII) stay parked — listed in the queue below; grazing one mid-wave = stop and flag, never ride momentum.

## Wave R-0 — Registry truth & gating honesty (risk: low; no user-visible behavior change except closing a documented fail-open)
Findings: VI.3 #62 (undoToken:null three-meaning overload); queue #5 (4 of 5 `undoLastPulse` advertisers never arm — cure = arm where the snapshot push is semantically correct at the op site, else stop advertising with a typed reason; per-op investigation, no blanket rule); the setLock/Edit-tooltip lie (tooltip promises reroll survival; setLock is inert for regen — fix the tooltip, do NOT touch regen itself: regenSection('history') destruction is owner-parked T4); queue #28/G5 frozen-record family (5 generation-frozen records shown in present tense — apply `src/domain/fieldManifest.js` FROZEN_VS_LIVE displayRules verbatim); queue #7 (Surveyor runtime gate: assert `spec.surveyor` before dispatch — defense in depth over the flag census); queue #27 deity-lane gating (single-source the premium check, fail CLOSED, and run the panel lane through the manifest predicate — JUDGMENT: "fix it all" covers enforcing a documented fail-open on a paid gate; veto reverts settlementDeityHelpers + panel in place).
Lanes (file-disjoint, enforced in briefs): A registry-truth (operationRegistry.js + walker + the 5 undoLastPulse op sites) · B frozen-tense display (DefenseTab + food-security display leaves, per displayRule) · C surveyor-assert (command dispatch seam) · D deity-gate (settlementDeityHelpers.js, DeityAssignmentPanel.jsx, buildEvent.js seam).
Gate: fast + quick per lane; wave-end joint quick gate. Verify: one Opus skeptic per lane (registry metadata and gating are sensitive substrate — plausible-but-wrong metadata has no failing test without the new pins).
Exit: tri-state undo metadata with walker enforcement; zero ops advertising undo they cannot deliver; frozen records read as generation verdicts; Surveyor dispatch asserts capability; deity writes tier-gated at ONE source; +pins counted per lane.

## Wave R-1 — Undo & destruction honesty (risk: medium)
Findings: queue #25 (uncanonize destroys eventLog while advertising undo — snapshot/tombstone first); queue #2 (named-fate cluster: 3 deletion paths bypass the consent barrier — route all through it; doctrine repair); queue #4 (settlement-terminal-death: THREE lanes with divergent confirm gates and recovery — converge confirm-gate parity and recovery honesty WITHOUT changing which lanes exist); eventNarrativeSnapshots cap disclosure (silent FIFO at 10 on a paid record — disclose at write surface; reader mount is R-2); VersionsTab pitch honesty (interim: stop selling manual snapshot + side-by-side diff that do not exist — copy-only repair, JUDGMENT vetoable; build-vs-copy stays in the owner queue).
Exit: no destruction path advertises recovery it lacks; consent barrier is the single door for named-entity deletion; paid surfaces promise only what exists.

## Wave R-2 — Reachability: mount the built (risk: medium; flag-off surfaces where applicable)
Findings: queue #19 (ChronicleScrollback paid-record reader unreachable — mount it); eventNarrativeSnapshots reader surface (paid content users already own); imposeCult(null) clear-cults path UI; faction-rename DOOR on generated saves (the convergence DIRECTION stays owner-queued — build the door on the existing lane only); the 24 phantom EDITABLE_FIELDS prose paths — wire through the flag-off Workbench EntityInspector (G-2b family work the program already owns; flag-off = no user-visible change until owner promotion).
Exit: every registered capability either reachable, flag-off-reachable, or moved to the owner retire-vs-wire queue with evidence.

## Wave R-3 — Parity forks & single-writer (risk: medium-high)
Findings: VI.12 #163b shapeless-patch trio (updateConfig/updateSavedCampaign/updateSavedSettlement — key validation at all three); DESTROY_SETTLEMENT two-writer convergence (from R-1's gate parity, now the writer seam itself); eventNarrativeSnapshots two-writer unification; economy post-applyEvent stale-derivation window (fieldManifest 'live' contracts are the spec — close the window or declare the staleness at the display site, whichever avoids golden drift); queue #9 toggle store-GLOBAL scope (investigate intended-vs-bug; fix if bug, pin-and-document if deliberate).
Exit: one writer per record family or a declared, pinned reason for two; no silent staleness.

## Wave R-4 — Normalization & prevention (LAST — correctness manifests only over honest data)
Findings: lever-field normalization to `traced input causes` (atlas + slice conventions, CONFLICT 4 cure); advertised-undo invariant test (every non-null undoToken must arm — the class guard for queue #5); dead-op ratchet (only-shrinks inventory of the 31, pending the owner's retire-vs-wire word); premium-gate single-source scan (the R-0 deity cure generalized); walkers for what still lacks them per structural-prevention.
Exit: the bug classes this program fixed have no habitat left; ratchets green over the final tree.

## Wave R-5 — OWNER-GATED (not started without sign-off)
Why gated: golden shifts, T4 regens, paid-feature builds, capability-vs-repair calls a code revert cannot cleanly undo.
- Network effects as declared engine input (shifts goldens) vs advisory label — owner pick (queue #8).
- The 31 dead ops: retire vs wire, per family (queue #21) — R-4's ratchet holds the line meanwhile.
- VersionsTab feature build (manual snapshot + diff) vs the R-1 copy fix standing (queue #18).
- regenSection('history') destruction (T4, standing park) · deity pool removal (T4) · G9/G10 polarity band fix (one-time visible shift, queue #3) · Edit toggle keep/retire (#1) · bands-vs-numbers (#20) · mass-update retire-vs-ship (#6) · ReadSystemStateBar remount-vs-delete (#22) · provenance-ledger merge (#10) · scene/canonical address join (#15) · flag-on review blackout cure ships with G-2b promotion, not before.

## Sequencing rationale
Metadata truth before behavior (R-0 makes the registry stop lying so later waves can trust it); destruction/undo honesty before mounting new reachability (R-1 before R-2 — do not widen access to lanes whose recovery story is false); writer unification after both sides are honest (R-3); correctness-asserting prevention deliberately last (R-4) so manifests never enshrine the pre-fix lies; owner-gated last (R-5) because none of it blocks the rest.

## Deferred (documented, NOT bugs to re-find)
- Wave commits suspended in this tree (foreign hunks in every shared file) — fold at owner fold points; this file is the program log.
- mutate.js line-number drift class: atlas citations are dated snapshots in a moving tree; re-resolve before use (documented in atlas §2).

## Owner-decision queue (parked, deliberate)
See Wave R-5 list + atlas Part VII (30 items). Recommendations recorded there; nothing in R-0..R-4 depends on them.
