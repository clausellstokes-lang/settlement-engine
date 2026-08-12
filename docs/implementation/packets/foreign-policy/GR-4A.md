# Foreign Policy / GR-4a — the succession question, answered at the event

- **Status:** LANDED
- **Landed:** at `a53ef7c6`, 2026-08-11; flipped by the chair after verification (11 files by diff-tree, 23 acceptance cases, census folded in-change, gate TRUE_EXIT=0 at HEAD; six deviations ratified incl. the treatySuccession.js rename and the third severity cure). Do not redispatch.
- **Status note:** ✅ **PROMOTED READY 2026-08-11 by the Fable chair (session `c42c8924`,
  Lane U), compiled from Lane P's read-only draft and the six rulings CR-GR4-1..6 (§12).**
  Lane P's draft carried GR-4a as BLOCKED on exactly one cause — the lighting-census walker
  was TC-5b-i's fifth reserved path and its fold was uncommitted. ⭐ **That cause is
  DISCHARGED: TC-5b-i LANDED at `9183d52c`, its census fold is in history, and a LANDED
  packet reserves nothing** (`scripts/implementation-packets.mjs:43`). GR-4a therefore takes
  the walker as its own TEST reservation (CR-GR4-6) and is dispatchable.
- **What this packet is NOT:** GR-4 as chartered. **GR-4 was REFUSED as one packet and split
  four ways** (§-1); this is slice (a) alone — the dark answer at the event. GR-4b (the
  voice), GR-4c (the credibility charge) and GR-4d (the lit-mode queue) are compiled later,
  each just-in-time, and none is released by this landing.
- **Packet version:** `1`
- **Drafted by:** Lane P (read-only compile lane), 2026-08-11, Opus-era — see §12b.
  Compiled to packet standard and promoted by Lane U under the Fable chair, 2026-08-11.
- **Verified base:** `claude/composite-r4` at `33487c77b0d9290db157f08330840558e17902bf`
- **Base note:** CONFIRMED at `33487c77` — *"The observed-shape baseline shrinks by exactly
  the two rows the repair retired"*, the fully-green-gate commit. Lane P measured its recon at
  `a75c76c2`, and re-confirmed nothing in `src/`, `tests/` or `scripts/` moved to `63c62822`
  (docs-only). ⛔ **The base is restamped to `33487c77` at this promotion, and every figure
  quoted from Lane P's recon is re-derived at preflight rather than inherited** — five commits
  have landed since `63c62822` (`9183d52c`, `e7774ff2`, `da31d170`, `b0912f7f`, `33487c77`),
  and one of them (`da31d170`) re-recorded the lighting census.
  ⚠ **`git merge-base --is-ancestor 40afbdd6 HEAD` (GR-3b) exits 0** — the producer half of
  GR-3 is in history and this packet builds on it.
- **⚠ The tree is a LIVE SHARED WORKTREE.** At this promotion: **one porcelain entry,
  `MM scripts/.observed-shape-readers-baseline.json`**, stale-index residue of `33487c77`
  rather than foreign WIP. A sibling lane owns the OSR instrument files
  (`scripts/check-observed-shape-readers.mjs`, `scripts/lib/observed-shape-*`,
  `tests/lint/observedShapeReaders.walker.test.js`, and that baseline). **CONFIRMED disjoint
  from all ten paths in §7.** ⛔ Reserved and untouched; the preflight re-measures.
- **Depends on:** GR-3b at `40afbdd6`; GR-3B-ORIENT at `d56d944c`; IN-0c at `29e2dc3c`;
  GR-1's oath-holder stamp (landed, `oathHolder.js`). ⭐ **TC-5b-i at `9183d52c` is a
  RESERVATION dependency only** — it freed the census walker. There is no code dependency
  between the two lanes.
- **Collision group:** `treaty-ledger-and-breach` — serialize against any lane touching
  `peaceTerms.js`, `treatyBreach.js`, `treatyDisposition.js` or `pactAmendment.js`.
- ⚠⚠ **CENSUS-HOLDER RULE (chair, 2026-08-11).** `SCW-0`, `ES-Da` and `TC-5b-ii` were
  promoted READY in the same documentation change, and all four packets fold the one
  estate-wide lighting census. **Only ONE of the four may have an implementer in flight at a
  time; the chair sequences.** ⭐ **GR-4a holds the walker's manifest reservation** because it
  is the packet the chair dispatches first; the chair MOVES that row, as a one-line manifest
  edit, when it dispatches another.
- **Commit authority:** to be stated by the chair in the dispatch message. Absent explicit
  authority, the coding agent leaves its changes unstaged and uncommitted.

---

## -1. THE REFUSAL THAT PRODUCED THE SLICE — measured, and RATIFIED at CR-GR4-1

**GR-4 as chartered (`docs/DESIGN_FP_GRAMMAR.md` §"GR-4 — THE SUCCESSION QUESTION";
position #12 at `docs/DESIGN_FP_ARCHITECTURE.md:1121-1129`) is not compilable as one packet.
CONFIRMED by Lane P against live source.** It requires modifying **at minimum six and
realistically nine** existing logic-bearing production files against a budget of three:

| # | File | Why the full design forces the edit |
|---:|---|---|
| 1 | `src/domain/worldPulse/treatyBreach.js` | J-GR-16's factoring: a shared default-application shell plus a second eligibility predicate |
| 2 | `src/domain/worldPulse/peaceTerms.js` | the breach-shell guard compares a **literal** `'repudiation'`, and the succession pass needs a mount |
| 3 | `src/domain/worldPulse/treatyDisposition.js` | a second **literal** `'repudiation'` comparison |
| 4 | `src/domain/worldPulse/pactAmendment.js` | `disavowed_by_succession` joins `PACT_ENDINGS`; a lineage act is owed |
| 5 | `src/domain/worldPulse/informationStatecraft.js` | the credibility charge — the delta-kind union is CLOSED and filters unknown kinds away |
| 6 | `src/domain/worldPulse/actorMajorApproval.js` | the lit-mode terminal-HONOR divergence; the terminal is **global, not per-type** today |
| 7 | `src/domain/events/realmManifest.js` | Spine §14's edit verb, if a verb is owed |
| 8 | `src/domain/display/treatyDocument.js` | dossier voice for the new ending |
| 9 | `src/domain/worldPulse/pulseKernel.js` **or** `settlementLifecycleKernel.js` | the mount, if not inside `advanceTreaties` |

It also carries **two behavior families** (a treaty-ending decision and a credibility-stock
write), **two flag conjunctions** (`oathHolderEnabled × routineMajorApproval`;
`oathHolderEnabled × infoStatecraftEnabled`) and **three writers** (the treaty ledger, the
proposals queue, the credibility ledger). `PACKET_STANDARD.md` permits one family, one flag,
and one named writer per changed state, and forbids renegotiating the budget.

**THE SPLIT, RATIFIED AT CR-GR4-1 — four slices, this is (a):**

| Slice | What it is | Depends on |
|---|---|---|
| **GR-4a** | **THE ANSWER AT THE EVENT (dark mode).** The succession-disavowal predicate, the J-GR-16 shell factoring, the frozen breach vocabulary with its two literal-consumer cures, the HONOR/DISAVOW scoring, and the `disavowed_by_succession` ending. **This packet.** | — |
| **GR-4b** | **THE VOICE.** Four Herald/chronicle kinds plus the dossier line `succession_question_open`, through the existing pools/pacing machinery. | GR-4a |
| **GR-4c** | **THE CREDIBILITY CHARGE.** The repudiation-derived deltas for WR-0c's verb and GR-4a's disavowal; the `oathHolderEnabled × infoStatecraftEnabled` conjunction. Carries §3.4's dead-fracture-window finding as a *recorded observation*, not a repair. | GR-4a |
| **GR-4d** | **THE LIT-MODE QUEUE.** `routineMajorApproval` routing with the per-type terminal-HONOR divergence. ⚠ Its substrate is weaker than the design assumes — §3.6. | GR-4a, GR-4c |

⛔ **The RENEGOTIATE arm is not a slice.** `treatyRenewalEnabled` does not exist in
`simulationRules.js`; GR-5 mints it. The arm is ABSENT by flag independence, exactly as the
design states. **CONFIRMED** — `grep treatyRenewalEnabled src/` returns nothing but prose.

⭐ **Order matters, and the estate has already paid for getting it wrong.** ES-7 was refused
because five waves of consumers were built against a dispatcher nobody chartered. GR-4b, c and
d are all consumers of the answer this packet produces. **Producer first.**

---

## 0. Why this packet exists, and what it starts from

`swornPartiesOf` (`src/domain/worldPulse/oathHolder.js:224-236`) is a landed, total, frozen
reader of GR-1's oath stamp with **ZERO `src/` consumers**. **CONFIRMED** — `grep -rn
swornPartiesOf src/` returns only its own definition. That is a reader-without-a-writer's
mirror image: a *writer without a reader*, and it has been dark since GR-1 landed.

GR-4a gives it its first production consumer, in the correct direction.

**Observable result:** with `oathHolderEnabled` lit, on any tick where a settlement's seat
changes and the change is recorded on the ladder's `seatTransitions` history, every treaty
whose GR-1 `sworn` stamp for that settlement names the **fallen** holder is answered — HONORed
silently (the scored default; the ledger is byte-identical) or DISAVOWed past a band (a
`succession_repudiation` breach through the factored shared shell, severity banded below 1.0
and graded by succession kind). Dark, nothing moves at all.

---

## 1. Reconciled authority

Reconciled per `PACKET_STANDARD.md` §"Authority order".

1. **Live git state at `33487c77` decides what exists.** GR-3b LANDED at `40afbdd6`
   (ancestor, exit 0). Where design prose and code disagree, the code wins and §11 records it.
2. **The newest chair rulings are BINDING: CR-GR4-1..6** (§12), plus the serialization law
   ruled at `73f5be96` and CR-TC5BI-6's census-fold shape.
3. **Operating law** — `CONTRIBUTING.md`, `ARCHITECTURE.md`, the worktree `CLAUDE.md` (never
   read a gate through a pipe), `PACKET_STANDARD.md`.
4. **This packet is authoritative at `claude/composite-r4` @ `33487c77`**, or an unchanged
   descendant admitted and pinned by sealed dispatch.
5. **Design after reconciliation** — `DESIGN_FP_GRAMMAR.md` §GR-4;
   `DESIGN_FP_ARCH_GR.md` §"GR-4 — THE SUCCESSION QUESTION" (⚠ **cite by heading, never by
   line**: `63c62282` inserted 24 lines above it); `DESIGN_FP_ARCHITECTURE.md:1121-1129`;
   `DESIGN_FP_SPINE.md:76-107` (requirements 13 + 14);
   `docs/content/RECEIPT_POOLS_GRAMMAR.md:601-670`.
6. **Never authority** — `SOL_QUEUE.md`, `START_HERE`, `docs/briefs/`.

**No unresolved authority conflict remains.** The two design/code disagreements (§11 D1, D2)
are recorded corrections in which the code wins; CR-GR4-5 lands the D1 correction *into the
design document itself* in the same documentation change that promotes this packet, so a
later reader of `DESIGN_FP_GRAMMAR.md` is not re-misled.

---

## 2. Outcome and non-goals

### 2.1 What GR-4a builds — one behavior family

A legitimate-power change answers the oaths the fallen holder swore.

- **HONOR** — the scored default in dark mode. **Nothing is written to the treaty.** The world
  is byte-identical to a world where the question never opened. This is J-GR-3's guarantee
  held **by scoring, not by machinery**.
- **DISAVOW** — reachable only past a band. The treaty takes a
  `breachType: 'succession_repudiation'` breach through the **factored shared shell**, with
  severity **banded below 1.0** and **graded by succession kind** (coup-born seats pay least;
  lineal heirs most).

Structurally it also lands the **J-GR-16 gate separation**: `treatyBreach.js` splits into a
shared default-application shell plus **two** eligibility predicates. The DM verb's
`isRepudiableTreaty` stays **byte-identical** and its composer surface `repudiableTreatyPairs`
does **not** widen; succession disavowal takes its own predicate.

### 2.2 Explicit non-goals — each excluded on purpose

| Excluded | Why | Where it goes |
|---|---|---|
| Any Herald / chronicle beat | a second behavior family (news minting + pacing registration) | GR-4b |
| The dossier *line* `succession_question_open` | needs an open-question state GR-4a does not mint — dark mode answers **at** the event, so nothing is ever "open" | GR-4b |
| Any credibility delta | second writer, second flag conjunction, second family | GR-4c |
| The `routineMajorApproval` queue, hold window, terminal-HONOR divergence | second writer (`worldState.proposals`), second flag | GR-4d |
| The RENEGOTIATE arm | `treatyRenewalEnabled` does not exist | GR-5 |
| Any change to `isRepudiableTreaty` or `repudiableTreatyPairs` output | J-GR-16 pins them UNCHANGED; GR-4a **asserts** they did not move | never |
| Any repair of the fracture-charge dead window (§3.4) | out of manifest; a recorded observation, not this packet's work | its own micro-act |
| Any new simulation-rule key | `oathHolderEnabled` is already minted and censused | never |
| Backfilling `sworn` onto legacy treaties | `oathHolderGr1.test.js:322-356` pins no backfill; unstamped means the seat swore, forever | never |
| Widening the trigger to coup verdicts, conquest, H2, DM KILL/ASSIGN, faction capture | none of them writes a `seatTransitions` row (§3.1); minting records at six new sites is a different, larger wave nobody has chartered | never here |
| Tuning, lighting, soaks, deploys, pushes | `PACKET_STANDARD.md` §"Golden and behavior-shift law" | owner |

---

## 3. Verified tree contract

Measured by Lane P at `a75c76c2`; **every line number is a hint, every symbol is the
instruction** (`PACKET_STANDARD.md` §"Required verified tree contract"). Navigate by symbol.

### 3.1 The trigger surface — `seatTransitions`

| Role | File | Symbol | Required fact |
|---|---|---|---|
| State authority | `src/domain/worldPulse/npcLadderKernel.js` | `spatialLedgers.npcLadder[settlementId].seatTransitions` (`:174-178`; row typedef `:148-157`) | `{ id, fromRulerId, toRulerId, cause, tick, authorityEpoch?, installerFactionId?, installerFactionName?, governingFactionId?, governingFactionName?, warDemand? }`. **Forbidden edit.** |
| Sole writer | `src/domain/worldPulse/npcLadderKernel.js` | `appendNpcLadderSeatTransition` (`:282`) | Idempotent twice over — a repeat `row.id` is a no-op (`:291`); a repeat `warDemand.decisionId` strips the demand and keeps the seat fact (`:295-299`). **Forbidden edit.** |
| Normalizer | `src/domain/worldPulse/npcLadderState.js` | `normalizeSeatTransitions` (`:706`) | Drops rows with no seat on either side, no `cause`, or no finite `tick` (`:721`); sorts by `tick` then codepoint(`id`) — ⚠ **imported array order is not chronology** (`:748`); caps at `LADDER_TUNING.SEAT_TRANSITION_CAP = 24`, keeping the **newest**. **Forbidden edit.** |

**Two producers, two disjoint cause namespaces — this is load-bearing:**

| Producer | Site | `cause` values |
|---|---|---|
| applied `government_change` | `src/domain/worldPulse/applyWorldPulse.js:953-1027` (`fromRulerId` snapshotted pre-mutation at `:936`) | `'government_change'` only |
| organic ladder succession | `npcLadderKernel.js:805-829`, applied at `:942-946` | `'coup'` \| `'challenge'` \| `'succession'` \| `'vacancy'` |

⚠ Neither uses `RULING_POWER_CAUSES` (`src/domain/rulingPower.js:335` =
`['coup','election','succession','conquest','appointment']`), which is what
`transferRulingPower` applies. **Three cause vocabularies exist; none is a registry.
CONFIRMED.** ⇒ **GR-4a's succession-kind grading is authored against exactly the five literals
the row can carry, and MUST have a default arm for any other string.**

⚠ **The negative that bounds the trigger, CONFIRMED.** A coup verdict (`coup.js:83+` →
`applyWorldPulse.js:152-189`), a conquest (`deploymentReturn.js:449, :474`), a DM
`CHANGE_RULING_POWER` (`mutateWorld.js:715-733`), an H2 verdict removal
(`npcVerdictApply.js:505`, `:29` — *"Nothing here mints a successor"*), DM KILL/ASSIGN
(`npcDmVerbs.js:487`, `:248`) and underworld faction capture (`factionCapture.js:48`) all
change or vacate the seat and **write no `seatTransitions` row.**
`docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md:1581` records the intent: *"KILL/ASSIGN/H2 are not
ruler transfers."* ⇒ **The trigger is exactly what `seatTransitions` records, and the packet
says so in those words** (§11 D2).

### 3.2 The oath surface — `sworn`

`src/domain/worldPulse/oathHolder.js` (237 lines; Lane P read it whole). **CONFIRMED:**

- Shape: `treaty.sworn = { [settlementId]: { npcId, name, swornTick } }`, written at
  `:190-199`, keys codepoint-sorted (`:194`).
- **Drop-when-absent (T4):** `if (Object.keys(sworn).length === 0) return false;` (`:198`) —
  dark, or a pair resolving no holder, leaves **no `sworn` key at all**. Never `null`, never
  `{}`. Pinned at `tests/domain/oathHolderGr1.test.js:305-320`.
- `npcId` is the H1 durable id (`durableIdForRoster`, `npcLedger.js:586`) when available, else
  the roster id (`oathHolder.js:163-168`).
- **The one sanctioned read:** `swornPartiesOf(treaty)` (`:224-236`) → frozen,
  codepoint-ordered `[{ settlementId, npcId, name, swornTick }]`. Total — never throws
  (`:222-223`). Half-written stamps dropped (`:232`). Legacy/unstamped → **empty array**.
  Does **not** re-resolve against the living roster (`:206-219`): *the parchment is history.*
- ⛔ **There is NO per-side accessor** — `swornFor(treaty, settlementId)` does not exist, and
  GR-4a **must not mint one in `oathHolder.js`**. It filters `swornPartiesOf` itself.
- **The gate:** `oathHolderActive(worldState)` (`:117-123`) is the **only** by-name read of
  `oathHolderEnabled` in `src/`. `simulationRules.js:230` registers the key in
  `ENGINE_GATED_VIRTUAL_RULE_KEYS`; the certification row is at
  `src/domain/certification/subsystemRowsVirtual.js:555-576`. **NO new flag is owed.**

### 3.3 The breach surface — and the two literals that would swallow the new type

`src/domain/worldPulse/treatyBreach.js` (186 lines; read whole). **CONFIRMED:**

- Exports `TREATY_REPUDIATION_TYPE = 'repudiation'` (`:28`), `repudiableTreatyPairs` (`:72`),
  `repudiateTreaty` (`:101`). `isRepudiableTreaty` (`:57`) is **module-private** — ⚠ the design
  cites `:46-51`; the true address is `:56-62` (§11 D3).
- `isRepudiableTreaty(treaty, tick)`: `complianceState !== 'defaulted'` **and**
  `breachType !== 'repudiation'` **and** some live term with `type === 'non_aggression'`.
  ⭐ **A tribute-only instrument really is unreachable through it** — the design's Troyes
  premise holds, and C5 turns it into the gate-separation proof.
- `repudiateTreaty` writes, per live term: `repudiatedComplianceState`, `repudiatedTrueState`,
  `repudiatedExpiresTick`, `repudiatedTick`, then `complianceState: 'defaulted'`,
  `trueState: 'defaulted'`, `expiresTick: nowTick` (`:135-143`). Per treaty:
  `complianceState: 'defaulted'`, `defaultedBy`, `defaultSeverity01: 1`, `breachType`,
  `repudiatedTick`, `breachExpiresTick` (= the max ORIGINAL horizon) (`:147-157`). The
  `...treaty` spread carries `sworn` through **unchanged** — deliberate.
- Three refusal codes, each a no-op returning the same `worldState` reference:
  `treaty_breach_gate_dark` (`:103`), `treaty_breach_invalid` (`:108`),
  `treaty_breach_no_live_nap` (`:117`).

⚠⚠ **THE HAZARD THAT DECIDES THE PACKET'S SHAPE.** `breachType` has **no frozen vocabulary, no
validator, no walker** — one producer, one value — and **two of its three consumers compare a
hardcoded literal rather than the exported constant:**

- `src/domain/worldPulse/peaceTerms.js:654` — `if (String(treaty.breachType || '') === 'repudiation') {`
- `src/domain/worldPulse/treatyDisposition.js:37` — `String(input.treaty?.breachType || '') === 'repudiation'`

**CONFIRMED.** A treaty stamped `'succession_repudiation'` would therefore (1) **miss the
shell-preservation branch** at `peaceTerms.js:648-658` and fall through into the ordinary
advance as a live instrument whose terms carry `expiresTick: nowTick`; and (2) **mint
`treaty_held` disposition "win" deltas for BOTH parties** at `treatyDisposition.js:37` when
the shell reaches its horizon — the world would reward both courts for a treaty one of them
tore up.

⇒ **Curing both literals is not opportunistic cleanup. It is GR-4a's one necessary integration
path, and CR-GR4-2 rules it IN SCOPE.** Skipping it ships a defect.

**Also CONFIRMED absent:** `treatyBreach.js` writes **no** `ending` and appends **no**
`lineage` act — a repudiation is invisible to both `PACT_ENDINGS` vocabularies. There is **no**
`tests/domain/treatyBreach.test.js`.

⚠ **Two `PACT_ENDINGS` exports exist, share a name, hold disjoint values, and no test imports
both:** `pactAmendment.js:68` (`['broken_by_war','expired_unanswered','no_overlap','refused','signed']`)
and `treatyLifecycleVoice.js:73` (`['ran_its_term','hollowed_detected','hollowed_quiet']`).
**`disavowed_by_succession` belongs to the `pactAmendment.js` list** — §12 Q3.

### 3.4 The pulse order — measured, and it forces the mount

**CONFIRMED** by direct read of `src/domain/worldPulse/pulseKernel.js`:

| Pulse line | Mover | Relevance |
|---:|---|---|
| 302 | `expireStaleActorMajors(...)` | GR-4d's terminal |
| 1429 | `applyWorldPulseOutcomes({...})` | **seatTransitions writer #1** (`applyWorldPulse.js:1016`) |
| 2073 | `advanceInformationStatecraft({ … tick: worldState.tick … })` | the ONLY credibility fold |
| 2467 | `advanceSettlementLifecycle(...)` → `advancePeacetimePacts` | GR-2's pactProposals |
| **2563** | ladder mover | **seatTransitions writer #2** (`npcLadderKernel.js:943`) |
| **2580** | `advanceTreatiesWithDisposition({ … tick: worldState.tick … })` → `peaceTerms.js:296` `advanceTreaties` | **the treaty stage — GR-4a's mount** |

**Both movers receive the identical `worldState.tick`** (`pulseKernel.js:2079`, `:2582`).

⇒ **Consequence 1 — the mount is forced.** To see **both** seat-transition writers in the same
tick the pass must run at pulse position **≥ 2563**. The treaty stage at 2580 is the only stage
that satisfies this *and* owns the ledger being written. **Any earlier mount is half-blind** —
it would see `government_change` successions and miss every organic
coup/challenge/succession/vacancy. **CR-GR4-3 rules the mount inside `advanceTreaties`,
conditional on §6.6's measurement.**

⇒ **Consequence 2 — a RECORDED OBSERVATION, NOT THIS PACKET'S WORK.** `treaty.fracture.tick =
tick` (`peaceTerms.js:955`) is written at pulse 2580 of tick *T*.
`fractureCredibilityDeltas(worldState, tick)` skips any fracture whose `fracture.tick !== now`
(`informationStatecraft.js:409`) and runs at pulse 2073. At tick *T* the fracture does not
exist yet; at *T+1*, `now = T+1 ≠ T`. **The window looks dead.** Its unit pin is a hand-built
fixture fed straight to the deriver (`tests/domain/informationStatecraftPins.test.js:132-135`)
— the "fixture mirrors the deriver" vacuity class, which is exactly the shape that hides this.
⚠ **This is PLAUSIBLE, stated at high confidence and deliberately NOT converted:** call order,
tick arguments and the equality predicate are each CONFIRMED by read, but nothing was executed.
⛔ **GR-4a does not touch it, and must not "fix" it inside this manifest.** It is recorded so
GR-4c does not build on a live-looking idiom that never fires, and it must be **re-derived, not
inherited** (the ES-5d lag law: *a lag belongs to a WRITER/READER PAIR*).

### 3.5 Two further measurements that bound the later slices

- **The credibility delta union is CLOSED.** `informationStatecraft.js:315` types
  `kind: 'proven_true'|'deception'|'fracture'|'climb_down'` and the filter at `:357-359` keeps
  only those four. A delta with `kind: 'succession_repudiation'` is dropped without a word.
  **CONFIRMED.** GR-4c's problem, listed at §12 Q6.
- ⚠ **GR-4d's substrate is weaker than the design assumes.**
  `ACTOR_INITIATED_MAJOR_TYPES` (`actorMajorApproval.js:57`) is a **bare `new Set`, not
  frozen**, guarded only by an exact-list pin at `tests/domain/actorMajorApproval.m10a.test.js:82`.
  The terminal is **global, not per-type** — one `ACTOR_MAJOR_HOLD_WEEKS = 6` (`:44`), a pure
  membership test (`:131`), **no per-type override seam** (`:122-142`), and the persisted status
  is `'expired'`, not `'declined'`. `treaty_breached` has **no `authorityFor` producer anywhere
  in `src/domain/`**, and `routineMajorApproval` appears in **no** preset, golden, soak profile
  or JSON. **CONFIRMED.** Flagged now so it is not discovered at GR-4d's compile (§11 D6).

### 3.6 The dossier round-trip is INHERITED, not built

**CONFIRMED.** `src/domain/display/treatyDocument.js:43-131` authors a **`defaulted`** voice
line for **every** term family in `TREATY_COMPLIANCE_VOICE`, plus a generic fallback (`:126`:
*"The term is broken, and this seam of the peace has torn."*).
`src/components/new/tabs/WarFaithTab.jsx:34, :112, :222` renders through
`renderTreatiesForSettlement`. A succession-disavowed treaty's live terms become
`complianceState: 'defaulted'` through the shared shell, so **the existing dossier already
speaks it, in house voice, with no edit.**

⇒ Spine requirement 6 (the Dossier Coherence Law) is satisfied by a **PIN**, not a build — C6.
**This is what keeps the user-facing-surface count at ZERO and the packet inside budget.**

---

## 4. Hard scope budget

| Limit | Budget | GR-4a | |
|---|---:|---:|---|
| Behavior families | 1 | 1 | ✓ |
| New persisted record families | 1 | **0** — the breach rides the existing treaty record | ✓ |
| Named writer per changed state | 1 | 1 — `treatyBreach.js`; the new leaves are **pure** | ✓ |
| Feature flags | 1 | **0 new** — `oathHolderEnabled` is minted and censused | ✓ |
| User-facing surfaces | 1 | **0 new** — the dossier landing is INHERITED (§3.6) | ✓ |
| Direct production consumers | 2 | 2 — `peaceTerms.js`, `treatyDisposition.js` | ⚠ at cap |
| New logic-bearing production leaves | 2 | 2 — `successionQuestion.js` + `treatyBreachTypes.js` | ⚠ at cap |
| Existing logic-bearing production files modified | 3 | **3** — `treatyBreach.js`, `peaceTerms.js`, `treatyDisposition.js` | ⚠ **at cap** |
| Registration-only production files | 3 | 1 — `pactAmendment.js` frozen-list rows | ✓ |
| Handwritten files total | 12 | 10 (§7) | ✓ |
| New/changed effective production lines | 400 | ~210 projected | ✓ |
| Each new leaf | 250 | ~150 / ~25 projected | ✓ |
| **Shared/hot-file delta** | **15 each** | `peaceTerms.js` ≤12, `treatyDisposition.js` ≤3, **`treatyBreach.js` ≤40 — RULED NOT a shared-file delta, CR-GR4-1 / §12 Q2** | ✓ |
| Acceptance cases | 8 | 7 (§9) | ✓ |

⛔ **The budget fits with ZERO headroom on the three ⚠ rows.** Any scope creep — a receipt, a
news kind, a dossier line — breaks it, and breaking it is a STOP rather than a renegotiation.

---

## 5. Preflight

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 33487c77 HEAD              # this packet's verified base
git merge-base --is-ancestor 40afbdd6 HEAD              # GR-3b

# Substrate untouched since the verified base.
git log --oneline 33487c77..HEAD -- \
  src/domain/worldPulse/treatyBreach.js src/domain/worldPulse/peaceTerms.js \
  src/domain/worldPulse/treatyDisposition.js src/domain/worldPulse/pactAmendment.js \
  src/domain/worldPulse/oathHolder.js src/domain/worldPulse/npcLadderKernel.js \
  src/domain/worldPulse/npcLadderState.js                       # expect EMPTY

# New files absent.
test ! -e src/domain/worldPulse/treatyBreachTypes.js
test ! -e src/domain/worldPulse/successionQuestion.js
test ! -e tests/domain/successionQuestion.test.js

# Targets clean (path-scoped — foreign dirt elsewhere is RESERVED, never touched).
git diff --quiet -- src/domain/worldPulse/treatyBreach.js
git diff --quiet -- src/domain/worldPulse/peaceTerms.js
git diff --quiet -- src/domain/worldPulse/treatyDisposition.js
git diff --quiet -- src/domain/worldPulse/pactAmendment.js
git diff --quiet -- tests/domain/pactAmendment.test.js
git diff --quiet -- tests/property/oathHolderDormancyFence.test.js
git diff --quiet -- tests/lint/sovereigntyLightingContract.walker.test.js

# Live symbols — by symbol, never by line number.
rg -n 'export function appendNpcLadderSeatTransition' src/domain/worldPulse/npcLadderKernel.js
rg -n 'export function normalizeSeatTransitions'      src/domain/worldPulse/npcLadderState.js
rg -n 'export function swornPartiesOf|export function oathHolderActive' src/domain/worldPulse/oathHolder.js
rg -n 'TREATY_REPUDIATION_TYPE|repudiableTreatyPairs|repudiateTreaty' src/domain/worldPulse/treatyBreach.js
rg -n "=== 'repudiation'" src/domain/worldPulse/peaceTerms.js src/domain/worldPulse/treatyDisposition.js
rg -n 'PACT_ENDINGS' src/domain/worldPulse/pactAmendment.js
rg -n 'export function advanceTreaties' src/domain/worldPulse/peaceTerms.js
```

⛔ **AND the two MANDATORY PREFLIGHT MEASUREMENTS, both before the first edit** — §6.6
(`peaceTerms.js` effective lines under eslint's own `Linter`) and §6.7 (the OSR scan). Each
carries its own STOP.

Any target collision or material symbol drift makes this packet `STALE`.

### 5b. Baselines

⚠ Lane P executed **no** test, build, or gate command (read-only draft lane). Rows are
**AUTHOR-TIME-UNMEASURED** unless marked MEASURED.

| # | Premise | Exact command | Expected / recorded |
|---|---|---|---|
| B1 | Treaty suites green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/peaceTerms.test.js tests/domain/pactAmendment.test.js tests/domain/pactFormation.test.js tests/domain/treatyOrientationWr10g.test.js` | **UNMEASURED** — exit 0 |
| B2 | Oath-holder dormancy fence green | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/oathHolderDormancyFence.test.js tests/domain/oathHolderGr1.test.js` | **UNMEASURED** — exit 0 |
| B3 | ⛔ `peaceTerms.js` effective lines | eslint `Linter` under `max-lines{skipBlankLines,skipComments}` — §6.6 | **UNMEASURED, AND A BLOCKER.** A crude `grep` count gives ~784 against a layer default of **800**. ⛔ Measure with the enforcer's own engine before the first edit |
| B4 | Typecheck posture | `npm run typecheck:ratchet` then `npm run typecheck:domain:strict` | **UNMEASURED** — exit 0 both, named separately with their windows. ⚠ An unbaselined new file's error allowance is **ZERO** |
| B5 | ⭐ Lighting census row | read `tests/lint/sovereigntyLightingContract.walker.test.js` | **MEASURED BY READ at the verified base `33487c77`, line `:3731`: `files: 2397, parked: 365, credited: 2032, titles: 19763, suiteTitles: 5578`.** ⛔ A named-committed-sha snapshot per serialization-law rule 4 — **re-derive from the FILE at preflight; never fold onto this row** |
| B6 | Test-ratchet headroom | read `scripts/.test-ratchet-baseline.json` + `tests/lint/testRatchet.test.js:177` | **MEASURED BY READ: 17 entries against `const CEILING = 17` — ZERO headroom.** Land with no new baselined failure |
| B7 | Pre-existing gate reds | committed-base run, capturing `$?` yourself | **UNMEASURED.** ⚠ The **only** legitimate pre-existing red to attribute is the owner-approved `generatorGoldenMaster` golden. ⛔ `observedShapeReaders.walker`'s old free attribution EXPIRED at `ffc85a90`; if it reds here it is this packet's until proven otherwise against a committed-base run |
| B8 | OSR reader-shape posture | §6.7 | **UNMEASURED — a MANDATORY preflight with a STOP** |

---

## 6. Exact contracts

### 6.1 New leaf — the frozen breach vocabulary

**Home: `src/domain/worldPulse/treatyBreachTypes.js`. Dependency-free by construction.**

```js
BREACH_TYPES = Object.freeze(['repudiation', 'succession_repudiation'])
isRepudiationBreach(treatyLike) -> boolean
```

- ⛔ **`BREACH_TYPES[0] === 'repudiation'` is load-bearing** — see §6.5's superset rule.
- `isRepudiationBreach` is **total**: `null`, `undefined`, a non-object, a missing
  `breachType`, and a foreign string all answer `false` without throwing. It reads
  `String(x?.breachType || '')` and tests membership — the same coercion the two literals use
  today, so the dark-path answer is bit-for-bit identical.
- ⛔ **ZERO imports.** A vocabulary leaf that imports nothing cannot participate in a cycle,
  and cannot drag a graph into either consumer's closure.
- ⛔ **`TREATY_REPUDIATION_TYPE` keeps its exported spelling and value in `treatyBreach.js`.**
  Do not move it, do not re-export it, do not "deduplicate" it — it is a landed public symbol
  and the coupling registry may name it.

### 6.2 New leaf — the pure succession derivation

**Home: `src/domain/worldPulse/successionQuestion.js`. PURE — it writes nothing.**

```js
isSuccessionDisavowable(treaty, settlementId, fallenNpcId) -> boolean
successionAnswerFor(input) -> { answer: 'honor'|'disavow', severity01: number, kind: string }
successionQuestionsForTick(worldState, tick) -> ReadonlyArray<Descriptor>
```

- **The second eligibility predicate:** any treaty with **any live term** whose `sworn` stamp
  for the settlement names the fallen holder. ⛔ It does **not** require a live
  `non_aggression` term — that is the DM verb's gate and it stays untouched (C5).
- **Trigger derivation** reads `seatTransitions` rows at `tick` and pairs each row's
  `fromRulerId` against `swornPartiesOf(treaty)`'s `npcId`. ⚠ **Filter `swornPartiesOf`'s
  output; do not add an accessor to `oathHolder.js`** (§3.2).
- **Severity is banded strictly below 1.0** and **graded by `cause`**, over exactly the five
  literals §3.1 measured, **with a default arm** for any other string. `defaultSeverity01: 1`
  remains the DM repudiation's value and must not move.
- **Stable enumeration order:** iterate treaties in the ledger's own order and
  `seatTransitions` in `normalizeSeatTransitions`'s order (`tick`, then codepoint(`id`)).
  ⛔ No `Object.keys` iteration over an unsorted map may reach an output.
- **Purity:** no `Date`, no `Math.random`, no store, no I/O, no mutation of any argument. The
  scoring is arithmetic over already-resolved facts.
- **Returns descriptors. It never calls `setSpatialLedger` and never touches `worldState`.**

⛔⛔ **THE OATH-STAMP WALKER TRAP — and it convicts a COMMENT.**
`tests/lint/oathStampTotality.walker.test.js:137` scans `src/` with
`/setSpatialLedger\(\s*[^,()]+,\s*'([^']+)'\s*,/g` and asserts every treaty-ledger writer is a
declared mint door or rewriter. **The regex matches text inside comments — the walker's own
control proves it** (`:166`). ⇒ **`successionQuestion.js` must not contain the string
`setSpatialLedger(<anything>, 'treaties',` ANYWHERE, including in a comment or a docblock.
Reword the comment; never widen the walker.** Because the ledger write stays inside the
already-registered `treatyBreach.js`, **no walker row is owed and the walker stays green.**
⭐ The walker's own `REWRITE_MODULES` prose for `treatyBreach.js` anticipates GR-4 by name
(*"it would pre-empt GR-4's succession question by answering it in the wrong module"*), which
independently confirms the chosen home.

### 6.3 Module-local frozen tuning — CR-GR4-4

GR-4a needs **three** authored values: the dark-mode disavow threshold and two severity
grades (coup-born vs lineal).

**RULED (CR-GR4-4): one module-local frozen `SUCCESSION_TUNING` object inside
`successionQuestion.js`**, on the `pactFormation.js:113-125` `F` idiom and the
`PACT_PROPOSAL_TUNING` precedent, marked `⚠ UNSOAKED`.

- ⛔ **ZERO new keys in any existing tuning table**, and **zero** keys in `simulationRules`.
  Do not touch `CREDIBILITY_TUNING`, `PEACE_TERMS_TUNING`, `LADDER_TUNING`, `CHALLENGE_TUNING`
  or `ESPIONAGE_TUNING`.
- ⛔ **The three numbers themselves ride the endgame tuning signature** — they are chair-authored
  defaults inside an owner-suggested band, on the `ACTOR_MAJOR_HOLD_WEEKS` precedent
  (`actorMajorApproval.js:34`: *"⚠️ OWNER-DECISION DEFAULT"*), and they carry an in-file
  `⚠ UNSOAKED — rides the endgame tuning signature` comment so the owner's tuning pass finds
  them. **The implementer may not tune them, and may not add a fourth.**
- The band must satisfy the C3 fixture: **below the band, nothing is written at all.**

### 6.4 The J-GR-16 factoring — exact edits to `treatyBreach.js`

1. Extract `defaultAllLiveTerms(treaty, breachType, severity01, nowTick)` — the per-term and
   per-treaty write body that `repudiateTreaty` performs today, verbatim in effect.
2. `repudiateTreaty` calls it with `('repudiation', 1)` and **must produce a byte-identical
   record** to today's output. That is C1, an executable `JSON.stringify` equality, not a claim.
3. Add the succession application path. ⛔⛔ **CR-GR4-1 / §12 Q4: it may NOT be a new EXPORTED
   symbol that itself calls `setSpatialLedger`.** `src/domain/worldPulse/ledgerOwnershipManifest.js`
   pins writers by **`module#symbol` set equality**
   (`tests/domain/pulseStageContracts.test.js:350-355`), and that manifest is a **forbidden
   edit**. Route the succession write through the existing `repudiateTreaty` symbol with a
   widened internal arm, **or** make `applySuccessionDisavowal` module-private and called from
   it. ⚠ **Verify the discovered identity at build; a red there is a STOP, not a manifest edit.**
4. ⛔ **`isRepudiableTreaty` and `repudiableTreatyPairs` are BYTE-IDENTICAL after this packet.**
   C1 asserts it and C5 proves the two gates are separate.

### 6.5 The two literal cures — and the superset rule that keeps dark worlds still

Two edits, and no others:

- `src/domain/worldPulse/peaceTerms.js:654` — `String(treaty.breachType || '') === 'repudiation'`
  becomes `isRepudiationBreach(treaty)`.
- `src/domain/worldPulse/treatyDisposition.js:37` — the same substitution against
  `input.treaty`.

⛔⛔ **THE SUPERSET RULE, AND IT IS THE PACKET'S SHARPEST DARK-PATH HAZARD.** If either cure is
implemented as anything other than a **strict superset** of today's `=== 'repudiation'` test, a
**DARK** world's existing repudiation shells change behavior. The predicate must be membership
in `BREACH_TYPES` with `BREACH_TYPES[0] === 'repudiation'`, so for every record any current
world can hold the answer is bit-for-bit the same. ⛔ **If the implementer measures ANY
dark-path motion, that is a STOP and a premise refutation — never a golden re-record.**

### 6.6 ⛔⛔ THE MOUNT IS CONDITIONAL — CR-GR4-3, and the measurement is a BLOCKER

**RULED (CR-GR4-3): the succession pass mounts INSIDE `advanceTreaties`
(`src/domain/worldPulse/peaceTerms.js:296`) — a bounded call, not a new stage — CONDITIONAL ON
A MEASUREMENT.**

Grounds for the home: `advanceTreaties` owns the ledger being written; it sits at pulse 2580,
the only position that sees both `seatTransitions` writers (§3.4); it leaves
`pulseStageManifest.js` untouched (`PULSE_SUBSTAGE_MANIFEST_VERSION` stays `2`); and it avoids
the kernel's stage-order law, under which **any reordering is a same-seed shift**.

**THE CONDITION.** `scripts/.size-baseline.json` carries **no live entry** for `peaceTerms.js`
— the war decomposition tranche took it from 1680 to 765 and **deleted** the entry — so its
ceiling is the layer default of **800 effective lines**, enforced by an `eslint.config.js`
override and pinned four ways by `tests/lint/sizeBaseline.test.js:10-32`, **including EXACT
SET: a new offender with no entry REDS, and a compliant file's entry ALSO reds.**

⇒ **BEFORE THE FIRST EDIT, measure `peaceTerms.js` with eslint's own `Linter` under the
enforcer's rule** — the method `sizeBaseline.test.js` itself uses, so measurer and enforcer
cannot disagree. ⛔ **Never `wc -l`, never a `grep` heuristic** (Lane P's crude count of ~784
over-counts and its real headroom is unknown).

- **If the post-edit count would stay under 800:** proceed with the mount inside
  `advanceTreaties`.
- **If it would cross 800: the packet STOPS and reports back to the chair.** ⛔ The implementer
  may **not** choose the alternative mount (a new call in `pulseKernel.js` between 2563 and
  2580) — that touches the pulse mouth, which is a different risk class, and `pulseKernel.js`
  is on the do-not-touch list. ⛔ **Never raise or add a baseline entry to finish this packet.**

### 6.7 ⛔ THE OSR SCAN IS A MANDATORY PREFLIGHT WITH A STOP — §12 Q5

The new leaves read new keys off `seatTransitions` rows and `sworn` entries. **Whether the
observed-shape-reader resolver reaches them is not knowable without running the scan**, and if
it does, a **schema mint** is implicated — which is a chair-gated act, because `--write`
throws on eleven governed paths.

⇒ Run the OSR scan at preflight and again after the leaves exist. **If a mint is implicated,
STOP and report; do not mint, and do not edit
`scripts/.observed-shape-readers-baseline.json`.**
⚠ **A sibling lane owns the OSR instrument files at this promotion.** Even a legitimate mint
would be a two-lane collision, which is a second reason the answer here is STOP.

### 6.8 The lineage ending — `pactAmendment.js`, registration only

Add `disavowed_by_succession` to `PACT_ENDINGS` (`pactAmendment.js:68`) and its matching
lineage act. **Frozen-list rows only; no logic.** ⛔ The `treatyLifecycleVoice.js:73`
`PACT_ENDINGS` export is a **different vocabulary with disjoint values and is NOT touched**
(§12 Q3). `tests/domain/pactAmendment.test.js`'s three exact-array pins at `:45-55` are
extended in the same change.

---

## 7. Exact change manifest

| Action | File | Symbol / region | Max Δ | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/worldPulse/treatyBreachTypes.js` | `BREACH_TYPES`, `isRepudiationBreach` | `25` | §6.1. Dependency-free frozen vocabulary + a total predicate. `BREACH_TYPES[0] === 'repudiation'`. **Zero imports.** |
| `CREATE` | `src/domain/worldPulse/successionQuestion.js` | `isSuccessionDisavowable`, `successionAnswerFor`, `successionQuestionsForTick`, module-local `SUCCESSION_TUNING` | `150` | §6.2 + §6.3. **PURE — writes nothing.** ⛔ Must not contain `setSpatialLedger(<x>, 'treaties',` anywhere, including comments. |
| `MODIFY` | `src/domain/worldPulse/treatyBreach.js` | extract `defaultAllLiveTerms`; add the succession path; keep `isRepudiableTreaty` + `repudiableTreatyPairs` byte-identical | `40` | §6.4. ⛔ No new **exported** ledger-writing symbol. `TREATY_REPUDIATION_TYPE` keeps its spelling and value. |
| `MODIFY` | `src/domain/worldPulse/peaceTerms.js` | the `advanceTreaties` mount + the `:654` shell guard | **`12`** | §6.5 + §6.6. ⛔ **The mount is conditional on the §6.6 measurement; over 800 effective lines is a STOP.** |
| `MODIFY` | `src/domain/worldPulse/treatyDisposition.js` | the `:37` guard | **`3`** | §6.5. Strict superset only. |
| `REGISTER` | `src/domain/worldPulse/pactAmendment.js` | `PACT_ENDINGS`, the lineage act | `3` | §6.8. Frozen-list rows only; no logic. |
| `CREATE` | `tests/domain/successionQuestion.test.js` | C1–C7 | `n/a` | ⚠ **Name and site it exactly as given** — §8 item 2. Straight-line registration only — §8 item 1. |
| `TEST` | `tests/domain/pactAmendment.test.js` | the three exact-array pins at `:45-55` | `n/a` | Extend the frozen-list equality arms. |
| `TEST` | `tests/property/oathHolderDormancyFence.test.js` | FENCE 1 + FENCE 3 counters | `n/a` | ⭐ **EXTEND the existing fence; do not author a new file** — §8 item 4. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` row + a dated comment | `n/a` | Re-derive all five WHOLE in one run and re-record whole, cause stated — §8 item 3. ⛔ Subject to the foreign-title STOP **and** the census-holder rule. |

**These ten paths are GR-4a's complete reserved change set**, and `PACKET_MANIFEST.json`
carries exactly them, spelled identically. ⚠ **The three `CREATE` spellings become
existence-checked at the LANDED flip** (`scripts/implementation-packets.mjs:466-468`), so a
rename during implementation must move the manifest row in the same change.

**Named do-not-touch:** `scripts/.size-baseline.json`, `scripts/mutation-coverage-manifest.json`,
`scripts/.test-ratchet-baseline.json`, `scripts/.observed-shape-readers-baseline.json`,
`tests/lint/.coupling-inclusion-baseline.json`, `eslint.config.js`, `vite.config.js`,
`src/domain/worldPulse/pulseKernel.js`, `src/domain/worldPulse/pulseStageManifest.js`,
`src/domain/worldPulse/ledgerOwnershipManifest.js`, `src/domain/events/realmManifest.js`,
`src/domain/worldPulse/informationStatecraft.js`, `src/domain/worldPulse/actorMajorApproval.js`,
`src/domain/worldPulse/oathHolder.js`, `src/domain/worldPulse/npcLadderKernel.js`,
`src/domain/worldPulse/treatyLifecycleVoice.js`, and every file outside this table.
Generated artifacts: `NONE`.

### 7b. Reservations and pairwise disjointness — CHECKED

| Reserver | Status | Paths | Overlap with GR-4a |
|---|---|---|---|
| **TC-5B-I** | LANDED | — | ✅ **NONE — a terminal packet reserves nothing** (`implementation-packets.mjs:43`). This is what freed the census walker. |
| **TC-5B-II** | READY | 9, under `src/components/townMap/`, `src/lib/`, `src/design/`, `tests/ui/`, `tests/lib/`, `tests/build/` | ✅ **ZERO.** |
| **SCW-0** | READY | 5, under `tests/lint/` and `scripts/` | ✅ **ZERO** (see the census note below). |
| **ES-DA** | READY | 7, under `src/domain/worldPulse/espionage/`, `src/domain/worldPulse/envoyDiplomacy.js`, `src/domain/certification/`, `tests/domain/`, `tests/property/` | ✅ **ZERO.** ⚠ Both packets live under `src/domain/worldPulse/` — the near-miss is real and the file sets are disjoint. |
| **IA-2** | STALE | 12, incl. `package.json`, `scripts/implementation-*`, `tests/scripts/*`, `docs/implementation/*` | ✅ **ZERO.** ⚠ STALE still reserves. This packet's own INDEX/manifest rows are **coordinator acts**, not change-manifest rows — the TC-5B precedent. |

⭐ **THE CENSUS WALKER IS GR-4a's, BY RULING.** All four READY packets move estate-wide
`titles`/`suiteTitles` and the serialization law re-derives the census WHOLE in the change that
moves any figure — but the validator forbids two non-terminal packets naming one path.
**RULED (chair, 2026-08-11): GR-4a holds the reservation because it is dispatched first; the
chair MOVES the row into whichever packet it dispatches next, as a one-line manifest edit.**
⛔ **Only one implementer may be in flight across the four.**

---

## 8. Landing discipline this manifest incurs — FIVE obligations, all measured

1. ⚠⚠ **THE PARKED-SUITE TRAP, AND IT TAKES THE WHOLE FILE.** A `test(`/`it(` registered inside
   a loop is `TEST_UNREGISTERED` and **the WHOLE FILE parks**, losing every other title in it
   (`sovereigntyLightingContract.walker.test.js:1266-1271`); a `describe` whose body is not
   straight-line parks the same way; `.each()` parks via `TEST_TABLE_UNPROVEN`. **This bit
   TC-5a: `townCartographyPaint.test.js` scored 0 live titles against 34 real tests on its
   first cut.** ⇒ Register every case **straight-line**; loops go **inside** an `it`, never
   around one. **Verify `credited` moved, not just `files`.**
2. ⚠ **THE MUTATION-COVERAGE MANIFEST IS A NAMING TRAP, AND GR-4a DODGES IT — KEEP THE DODGE.**
   `tests/lint/mutationCoverage.shared.mjs:27-39` makes a file an invariant automatically by
   living in one of seven enforcer dirs **or** by a basename matching
   `census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin`.
   `tests/domain/successionQuestion.test.js` matches **none** and sits in `tests/domain/`, so
   **no manifest entry is owed.** ⛔ **That dodge is load-bearing and is lost to a rename** — do
   not call it `successionQuestionContract.test.js`, `...Pins.test.js`, or site it under
   `tests/design/`.
3. ⭐ **THE LIGHTING CENSUS.** Re-derive **all five figures in ONE run and re-record them
   WHOLE** — never patch `files` alone. All five arms are `.toBe(...)` exact equality plus a
   `parked + credited === files` cross-check. ⚠ **The sequence hazard is live:** while any arm
   is red the census **stops measuring**, so later arms may read anything. ⭐ Probe with a
   temporary `console.log` **inside the existing census test, before its first assertion**, so
   it mints no title and cannot move what it measures. ⛔ **STOP conditions:** a foreign lane
   holding uncommitted test titles at re-record time; a census already red at pristine
   committed base from a foreign cause; or the chair not having confirmed this packet is the
   in-flight census holder. **Never census a live shared tree, and never quantify a foreign
   lane's uncommitted delta.**
4. ⭐ **THE DORMANCY FENCE IS EXTENDED, NOT REPLACED.**
   `tests/property/oathHolderDormancyFence.test.js` runs four fences: (1) own-footprint
   byte-identity, (2) ABSENT vs EXPLICIT-FALSE differential, (3) call-path dormancy via
   `vi.hoisted` counters on **cross-module** edges, (4) a gate-polarity census requiring every
   production line containing `oathHolderEnabled` (after comment/string stripping) to match
   `/\.\s*oathHolderEnabled\s*===\s*true/` (`:272`), plus a LIT-MUTANT CONTROL (`:280-293`).
   **FENCE 4 is FREE** — GR-4a adds zero new `oathHolderEnabled` sites and gates through
   `oathHolderActive`. **FENCE 3 needs one new counter** on the `swornPartiesOf` edge, proving
   a dark tick never reads a stamp. ⚠ Honour the file's own recorded authoring hazard
   (`:32-45`): a file that imports a module it also `vi.mock`s loses interception for that
   module's other consumers — the existing file hand-builds fixtures, and the extension keeps
   that discipline. ⛔ **A new fence FILE would move `files` and `credited` on top of
   `titles`/`suiteTitles`; extending moves only the latter two.**
5. ⚠ **ANCHORED NEGATIVES, AND THE TEST RATCHET HAS NO HEADROOM.**
   `tests/lint/negativeAssertionAnchor.walker.test.js:728` gives a **new file ZERO**; the three
   counted matchers are `.not.toContain(`, `.not.toMatch(`, `.not.toHaveProperty(`, and the
   `// anchored:` escape is accepted on the assertion line or the **single** line immediately
   above. Route every negative through `tests/helpers/anchoredNegatives.js`. Separately,
   `scripts/.test-ratchet-baseline.json` is at **17 of ceiling 17** — land with **no** new
   baselined failure, and never raise `CEILING`.

⚠ **What is NOT owed, measured so nobody "helpfully" edits it:**
`tests/lint/.coupling-inclusion-baseline.json` (both new leaves import within
`src/domain/worldPulse`; `DOMAIN_MODULES` walks `src/domain` only, `:501-503`, and a same-layer
import is not a cross-layer pair — `treatyBreachTypes.js` imports nothing);
`ledgerOwnershipManifest.js` (writer identity unchanged, §6.4 item 3);
`pulseStageManifest.js` (no new stage or substage). `scripts/.test-ratchet-baseline.json`'s
scope figures (`totalTests`/`totalFiles`) move via `--update` only; per-test entries are
shrink-only and `--update` refuses to add an unseen failure.

---

## 9. Acceptance matrix — the closed denominator (7 of 8)

| ID | Case | Required observation |
|---|---|---|
| **C1** | **Named historical regression — the refactor is a no-op** | `defaultAllLiveTerms(treaty, 'repudiation', 1)` produces a record **byte-identical** (`JSON.stringify` equality) to today's `repudiateTreaty` output on the `peaceTerms.test.js:659-697` fixture. `isRepudiableTreaty`'s three conditions and `repudiableTreatyPairs`' output are asserted **UNCHANGED**. |
| **C2** | **Main reachable behavior** | Lit; a treaty stamped `sworn` for settlement S naming NPC `n1`; a `seatTransitions` row `{fromRulerId:'n1', toRulerId:'n2', cause:'coup', tick: now}`. Past the disavow band the treaty carries `breachType: 'succession_repudiation'`, `defaultSeverity01 < 1`, every live term `defaulted` with its four `repudiated*` provenance fields, and a `disavowed_by_succession` lineage ending. |
| **C3** | ⭐ **THE SILENCE-HONORS NEGATIVE (the hardest pin)** | The same fixture **below** the band ⇒ the treaty ledger is **byte-identical to the pre-tick ledger**. No breach, no ending, no lineage entry, no receipt, no key. *Nothing defaults.* |
| **C4** | **Absent / disabled — the dormancy fence** | `oathHolderEnabled` absent, and separately explicit `false`: a succession over a stamped treaty leaves the ledger byte-identical, and FENCE 3's `swornPartiesOf` counter reads **0**. ⭐ Plus the LIT-MUTANT control, so the fence is shown to be able to SEE. |
| **C5** | ⭐ **THE TRIBUTE-ONLY DISAVOWAL + gate separation** | A treaty with **no live `non_aggression` term** disavows through the succession predicate, while `repudiableTreatyPairs(worldState, tick)` for that pair is asserted **still empty** — the two gates provably separate (J-GR-16). |
| **C6** | **Writer→reader integration + the inherited dossier round trip** | After C2: `treatyBlocksWar` returns false for the pair (`treatyEnforcement.js:126`); `scoreTreatyDefault` (`warReasons.js:545-557`) scores the **graded** severity, not `1.0`; `treatyDisposition` mints **no** `treaty_held` deltas at horizon; and `renderTreatiesForSettlement` speaks the broken shell in the existing `TREATY_COMPLIANCE_VOICE` `defaulted` voice with no display edit. |
| **C7** | **Duplicate / idempotent + lifecycle round trip** | Re-running the same tick's pass writes nothing further (the `isRepudiationBreach` guard, mirroring `isRepudiableTreaty:59`); a `succession_repudiation` shell survives a JSON round trip with its graded severity, is pruned at `breachExpiresTick` by `peaceTerms.js:648-658`, and `treatyOrientationOf` still resolves against it. |

**C8 (privacy boundary) is OMITTED, not replaced** — GR-4a mints no beat and no audience
projection; the belief-posture question belongs to GR-4b. ⛔ **Do not add an eighth case or a
speculative cross-product.**

### 9b. LIT-OUTPUT POSTURE — declared, not discovered

> **In a world that never lights `oathHolderEnabled`: NOTHING MOVES, and that is an
> assertion.** `oathHolderEnabled` is absent from `DEFAULT_SIMULATION_RULES` and from every
> preset (`simulationRules.js:230`, `:276`), so the dark path is byte-identical by **three
> independent mechanisms**, and the packet requires all three: (1) **the gate** —
> `oathHolderActive`, the single existing strict `=== true` read; (2) **the empty-stamp
> floor** — even lit, a treaty with no `sworn` key yields `swornPartiesOf → []`, so legacy
> unstamped treaties open no question, held by the data shape rather than by a branch; and
> (3) **the unchanged predicates** — `isRepudiableTreaty` and `repudiableTreatyPairs` asserted
> byte-identical.
>
> **In a world with `oathHolderEnabled` lit: YES, a new treaty-ending path exists, by design.**
> That is a declared, expected shift confined to the lit path — the GR-3 `pactFormationEnabled`
> precedent (J-GR-14's LIGHTING pin). **No golden in the estate lights `oathHolderEnabled`**,
> so **no committed golden should move**; the implementer proves it by running the dormancy
> golden and the peace/belief/rumor goldens unchanged.
> ⚠ **Figures permitted to move, each re-recorded whole with the cause stated:** the five
> lighting-census numbers, and the `scripts/.test-ratchet-baseline.json` scope figures via
> `--update`. ⛔ **Everything else moving is a STOP.**

---

## 10. Verification commands

```sh
# B1/B2 baselines — the test slot is acquired in the same chain, never observed and released.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/peaceTerms.test.js tests/domain/pactAmendment.test.js \
  tests/domain/pactFormation.test.js tests/domain/treatyOrientationWr10g.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/property/oathHolderDormancyFence.test.js tests/domain/oathHolderGr1.test.js

# Focused behavior — C1..C7.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/successionQuestion.test.js tests/domain/pactAmendment.test.js \
  tests/property/oathHolderDormancyFence.test.js tests/domain/peaceTerms.test.js \
  tests/domain/treatyOrientationWr10g.test.js

# The walkers this packet can break — all exact-equality pins.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/oathStampTotality.walker.test.js \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/sizeBaseline.test.js \
  tests/domain/pulseStageContracts.test.js

npx eslint src/domain/worldPulse/treatyBreachTypes.js \
  src/domain/worldPulse/successionQuestion.js src/domain/worldPulse/treatyBreach.js \
  src/domain/worldPulse/peaceTerms.js src/domain/worldPulse/treatyDisposition.js

npm run typecheck:ratchet          # tsconfig.full.json
npm run typecheck:domain:strict    # tsconfig.domain-strict.json

# Census re-derivation (§8 item 3), then the landing gate.
npm run check:tail
```

⚠ **Never read a gate through a pipe** — `npm run check:tail`, or
`sh scripts/gate-tail.sh <command...>`; a piped read reports the PIPE's status and has
greenwashed red gates twice. `npm run check` is a **17-step `&&` chain**: a red step blacks out
every later step, so the receipt must say **which steps actually ran**. **Trust no exit status
you did not capture yourself.**
⚠ **Budget the wall-clock:** `observedShapeReaders.walker`'s `beforeAll` is sized to **900 s**
because it measures ~264 s contended. A timeout there skips all 27 tests and then trips the
test ratchet's skip sentinel — a cascade that looks like a defect and is not.

---

## 11. Ordered coding sequence

0. Run §5 preflight **and both mandatory measurements** (§6.6 `peaceTerms.js`, §6.7 OSR).
   Stop on mismatch or on either measurement's STOP.
1. Capture B1/B2 and the dark-path goldens **before the first edit**.
2. Add the smallest failing focused test — **C1, the byte-identity refactor pin** — before
   `defaultAllLiveTerms` exists.
3. Implement `treatyBreachTypes.js` (the pure vocabulary leaf).
4. Perform the `treatyBreach.js` factoring; make C1 green. **This is the no-op step and its
   receipt is a `JSON.stringify` equality.**
5. Implement `successionQuestion.js` (pure; writes nothing).
6. Cure the two literals (§6.5), then mount the pass inside `advanceTreaties` (§6.6) — in that
   order, so the consumers are safe before the producer can fire.
7. Add the `pactAmendment.js` frozen-list rows and extend the dormancy fence's FENCE 3 counter.
8. Run §10's focused checks and the four walkers.
9. Re-derive and re-record the lighting census WHOLE (§8 item 3), or STOP per its conditions.
10. Run the wave-end gate and produce the completion receipt: exact deltas, both typecheck
    windows named, which of the 17 gate steps ran, the census row before/after with this
    packet's delta attributed **in isolation against a named committed sha**, the dark-path
    golden evidence quoted, and `deviations: NONE` or a STOP.

⛔ **Do not start by changing a golden, baseline, budget, or persisted shape.**

---

## 12. Rulings and recorded decisions

### 12a. The chair's rulings — CR-GR4-1..6, BINDING

- **CR-GR4-1 — THE SPLIT, AND SLICE (a) ONLY. RULED.** GR-4 is REFUSED as one packet on the
  measured file count, family count, flag count and writer count (§-1). **GR-4a is the dark
  answer at the event and nothing else:** the succession predicate, the J-GR-16 shell
  factoring, the frozen breach vocabulary, the HONOR/DISAVOW scoring, and the
  `disavowed_by_succession` ending. GR-4b/c/d are named, ordered, and **not released by this
  landing**. ⭐ **Corollary, recorded because the standard does not say it in as many words
  (Lane P's Q2): `treatyBreach.js`'s ~40-line factoring is NOT a "shared/hot-file delta"
  subject to the 15-line cap.** It is the packet's *primary target* and the subject of J-GR-16,
  not a drive-by on a file owned by another concern. The 15-line caps bind `peaceTerms.js` and
  `treatyDisposition.js`, which **are** drive-bys.
- **CR-GR4-2 — THE FROZEN BREACH VOCABULARY AND ITS TWO LITERAL CURES ARE IN SCOPE. RULED.**
  `peaceTerms.js:654` and `treatyDisposition.js:37` are the packet's **one necessary
  integration path** under `PACKET_STANDARD.md` §"Dispatch unit", not opportunistic cleanup:
  minting `succession_repudiation` without curing them ships a treaty that both parties are
  rewarded for breaking (§3.3). ⛔ **Bound by the superset rule at §6.5** — any dark-path
  motion is a STOP.
- **CR-GR4-3 — THE MOUNT IS `advanceTreaties`, CONDITIONAL. RULED.** Inside
  `peaceTerms.js#advanceTreaties`, at pulse 2580, as a bounded call — **conditional on the
  §6.6 effective-line measurement under eslint's own `Linter`. If the measurement fails, the
  packet STOPS and returns to the chair**; the implementer may not re-home the mount.
  **Rejected:** a new call in `pulseKernel.js` between 2563 and 2580 (touches the pulse mouth,
  a different risk class, and both mouths sit at exact zero line headroom); a new substage
  (moves `PULSE_SUBSTAGE_MANIFEST_VERSION` and the stage-order law makes any reordering a
  same-seed shift).
- **CR-GR4-4 — MODULE-LOCAL FROZEN `SUCCESSION_TUNING`. RULED.** Three values, module-local
  and frozen inside `successionQuestion.js` on the `pactFormation.js` `F` idiom, marked
  `⚠ UNSOAKED`. **ZERO new keys in any existing tuning surface and zero in `simulationRules`.**
  ⛔ **The values ride the endgame tuning signature** — chair-authored defaults, owner-signed at
  the tuning pass; the implementer may neither tune them nor add a fourth. **Rejected:** adding
  them to any shared tuning table (that is a tuning act and it is owner-signed).
- **CR-GR4-5 — THE DESIGN DOCUMENT IS CORRECTED IN THIS COMMIT. RULED.**
  `DESIGN_FP_GRAMMAR.md`'s GR-4 trigger sentence — *"the same event list WR-5's D re-read
  consumes; shared surface, declared"* — is **FALSE at HEAD** (§11 D1). A dated correction note
  lands **in that file, in the same documentation change that promotes this packet**, so the
  next reader of the design is not re-misled. ⛔ It is a chair act; it is **not** a
  change-manifest row and the implementer does not touch the design document.
- **CR-GR4-6 — THE CENSUS: FOLD IN-CHANGE, WALKER AS A TEST RESERVATION. RULED.** GR-4a adds
  test titles, so under serialization-law rule 5 the census moves whether or not a file is
  added; under rule 1 it is re-derived WHOLE in the same change. **TC-5b-i's LANDING released
  the path** (a terminal packet reserves nothing), so GR-4a takes
  `tests/lint/sovereigntyLightingContract.walker.test.js` as its own **TEST** row. ⭐ **GR-4a
  holds it for all four READY packets; the chair moves the row when it dispatches another, and
  only one implementer is in flight at a time.**

### 12b. Lane P judgments the chair ADOPTS at promotion — ✅ FABLE-VALIDATED 2026-08-11

Each was a recommendation in the read-only draft; each is ratified here so the packet carries
**zero** open items. All five were validated by the Fable chair in session `c42c8924`; **no
`⏳` marker lands.**

1. **Q3 — `disavowed_by_succession` joins `pactAmendment.js`'s `PACT_ENDINGS`, not
   `treatyLifecycleVoice.js`'s.** Ground: it is the *instrument's* lineage vocabulary, written
   by the ending act; `treatyLifecycleVoice.js` holds *observation* endings derived from
   compliance. ⚠ The name collision itself (two frozen exports, disjoint values, no test
   imports both) is a **separate micro-act for the chair to open — explicitly NOT GR-4a's
   work**, and it is recorded here rather than fixed.
2. **Q4 — NO new EXPORTED ledger-writing symbol in `treatyBreach.js`.** Ground: the
   ledger-ownership manifest pins writers by `module#symbol` set equality and is a forbidden
   edit; a new exported writer reds it. §6.4 item 3.
3. **Q5 — the OSR scan is a MANDATORY preflight with a STOP.** Ground: a schema mint is
   chair-gated and `--write` throws on eleven governed paths; and a sibling lane owns the OSR
   instruments at this promotion. §6.7.
4. **Q8 (Spine §14, the Edit Verb) — ENGINE-ONLY, RECORDED.** Requirement 14 permits *"a
   RECORDED decision ('engine-only, because X'), never silence"*. **Because X:** the DM's pen
   over this exact subject already exists — `REPUDIATE_TREATY` (`realmManifest.js:288-303`) is
   the open-repudiation road and is always proposal-routed (`changeAuthorityPolicy.js:223-231`).
   A second verb meaning *"make the heir disavow"* would be two roads to one outcome.
5. **Q10 (Spine §13, the Alignment line) — ENGAGED, read-only, ONE axis.** The disavow score
   reads `lawfulness01` (`computeLawfulness`, `disposition.js:534`) — a lawful seat is likelier
   to keep a word it did not give — composed alongside SP-4 posture (`courtPostureOf`,
   `strategicPosture.js:222`) as **colour on the scoring, never a selector**. `malice01`
   (`disposition.js:566`) is declared **alignment-empty with reason**: tearing up a father's
   treaty is a legitimacy calculation, not a cruelty, and reading malice here would price a
   revolution as a vice. **WRITE-side: none** — GR-4a moves no constituent, roster or
   institution and mints no settlement-alignment stock. ⚠ **Correction carried:** the Spine
   cites `alignmentOf` at `beliefMap.js:915` / `informationStatecraft.js:584`; both are
   **injection sites, not definitions**. Navigate to `disposition.js`.

### 12c. Deferred to GR-4c, recorded so nobody pre-empts them

- **Q6 — a fifth credibility delta kind, or a banded `fracture`?** The union is CLOSED (§3.5).
  Lane P recommends reusing `kind: 'fracture'` with a banded `magnitude01` for zero new tuning
  keys. **Not ruled here; GR-4c's decision.**
- **Q7 — a same-tick second `advanceCredibility` fold at the treaty stage, or a `now - 1`
  lag?** §3.4 Consequence 3. Lane P recommends the second fold (arithmetically safe: re-decaying
  entries already stamped `lastUpdateTick: now` uses `age = 0`, factor 1). **Not ruled here.**
  ⛔ **Neither may be built inside GR-4a's manifest.**

---

## 13. Recorded deviations from design prose (each vetoable)

| # | Design says | Live code says | Resolution |
|---|---|---|---|
| **D1** | the trigger rides *"the same event list WR-5's D re-read consumes"* (`DESIGN_FP_GRAMMAR.md:1011`) | D is a **string diff of a computed authority signature** — `momentumBroken = !!priorAuthoritySignature && priorAuthoritySignature !== books.authoritySignature` (`warTermination.js:633-642`, over `authoritySignatureFor`, `warSeatBooks.js:370-380`). It never touches `seatTransitions` and **cannot learn from whom, to whom, or by what kind.** The event-list consumer is WR-5 **H** — `inheritedWarDemandFor` (`warPeaceDecision.js:79-152`) | **Code wins.** The trigger reads `seatTransitions` by symbol. ⭐ **CR-GR4-5 lands a dated correction note in the design file itself.** |
| **D2** | the trigger fires on *"succession, coup, faction capture, H2 verdict removal, DM KILL/ASSIGN"* | only two producers write a row; coup verdicts, conquest, H2, KILL/ASSIGN and faction capture write **none** (§3.1) | **Code wins.** Trigger = exactly what `seatTransitions` records; the gap is **named, not silently widened**. Widening would need succession records minted at six new sites — a larger wave nobody has chartered, and the ES-7 lesson applied early. |
| **D3** | `isRepudiableTreaty` at `treatyBreach.js:46-51` | it is at `:56-62` and is **module-private** | Navigate by symbol (`PACKET_STANDARD.md` §"Required verified tree contract"). |
| **D4** | *"open repudiation prices NO credibility delta (coalition fracture does)"* | `spatialLedgers.credibility` has **five** delta producers folded in one place (`informationStatecraft.js:1434-1441`); what is absent is any **treaty-breach-derived** delta — and the fracture one appears **dead** (§3.4, PLAUSIBLE) | **Corrected.** The seam GR-4c closes is narrower and better-founded than the survey's sentence. ⭐ The consumer is real: `reserveFor` (`pactFormation.js:358-375`) computes `disavowal = clamp01(-credibilityScoreOf(...))` and applies `F.OATHBREAKER_PENALTY = 0.35`. |
| **D5** | `alignmentOf` at `beliefMap.js:915` / `informationStatecraft.js:584` | those are **injection sites**; the exports are `computeLawfulness` / `computeMalice` at `disposition.js:534` / `:566` | **Code wins** (§12b item 5). |
| **D6** | the lit-mode terminal-HONOR divergence is *"per-type and pinned both ways"* | the terminal is **global**, the type Set is **unfrozen**, and `treaty_breached` has **no organic producer** (§3.5) | **Deferred to GR-4d**, whose substrate is now measured. |
| **D7** | GR-4 is one wave | it needs 6–9 existing production files, 2 families, 3 writers, 2 flag conjunctions | **Refused and split four ways** — CR-GR4-1. |

---

## 14. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` §"Mandatory STOP conditions", stop — without expanding or
repairing — when:

- ⛔ **`peaceTerms.js` measured under eslint's own `Linter` would cross 800 effective lines**
  after the mount edit (§6.6). Report; the chair re-homes it.
- ⛔ **The OSR scan implicates a schema mint** (§6.7). Report; do not mint.
- ⛔ **Any dark-path motion is measured at all** (§9b). That is a premise refutation, not a
  golden to re-record.
- ⛔ **The C1 byte-identity assertion fails on any fixture**, or `isRepudiableTreaty` /
  `repudiableTreatyPairs` change output on any fixture.
- ⛔ **`oathStampTotality.walker.test.js` reds** — it means the new leaf reached the ledger, or
  named it in a comment, and the home is wrong (§6.2).
- ⛔ **The ledger-ownership manifest reds on a `module#symbol` identity change** (§6.4 item 3).
  Never edit `ledgerOwnershipManifest.js` to make it green.
- ⛔ **`tests/domain/successionQuestion.test.js` parks** — `credited` did not move with `files`
  (§8 item 1).
- ⛔ **A foreign lane holds uncommitted test titles at census re-record time**, or the chair
  has not confirmed this packet is the in-flight census holder (§7b, §8 item 3).
- ⛔ **Any `CREDIBILITY_TUNING`, `PEACE_TERMS_TUNING`, `LADDER_TUNING` or `simulationRules` key
  would need to change** — that is tuning, and tuning is owner-signed.
- ⛔ **Any solution needs a fourth `SUCCESSION_TUNING` value**, a new persisted key, a new flag,
  a new stage, a PRNG draw, a clock read, or a Herald kind.
- ⛔ **Any edit would reach a do-not-touch path in §7**, including `pulseKernel.js`,
  `informationStatecraft.js`, `oathHolder.js`, or any baseline.
- ⛔ **A ratchet, baseline, budget, timeout or ceiling would need raising.** Never raise one to
  finish a packet.
- **Any packet premise here is refuted by live code. The code wins; the packet stops.**

The STOP report contains the smallest measured contradiction, the evidence, and a proposed
split. It contains **no speculative repair**.
