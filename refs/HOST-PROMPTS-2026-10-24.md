# The settlement-engine prompts — S1–S15 of J397 (2026-10-24)

Written 2026-10-24 by the research/host-prompts seat (Fable, max) of the experience pass (`docs/PROGRESS.md` J397),
against the host repository `settlement-engine` at commit **`81f1cd96`** (the merge of PR #60, the FP coherence fold).
It is a research-side document: it names the host, its files, functions, flags and rulings freely. Nothing in it is a
map-side text; the design seats v and w carry the map's half of every ask into V13, V09, V15 and V14.

## 0 What this file is, and how to use it

**What.** Fifteen prompts, one per host-side ask S1–S15 of J397, each written TO a Claude Code session running inside
the SettlementForge repository. That session will not have the map module's repository, so every prompt is
self-contained: it carries the files and lines to read first at `81f1cd96`, the host design documents that govern, the
host's own rules that must hold, the steps, the data contract the map module expects quoted in the port's field names,
the acceptance tests, what not to do, and the ledgers to write.

**How.** Paste one prompt per session turn, or one per session; never two at once. Run them in the order below unless
the dependency column says a prompt may go earlier. Each prompt begins with the sentence "This prompt is the owner's
authority for the change it describes", because the host's own law (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md` "Subsystem
dispatch") says that only a READY implementation packet is a coding assignment: the session's first act under every
prompt is to derive a packet under `docs/implementation/packets/<family>/` by `docs/implementation/PACKET_STANDARD.md`
and `PACKET_TEMPLATE.md` (manifest, scope budget, acceptance denominator, verification commands, STOP rules), mark it
READY on the owner's word in the prompt, and only then code. Line numbers below are dated measurements at `81f1cd96`;
the host's standing law is to navigate by symbol, and a prompt whose line has rotted names the symbol beside it.

**One prompt contains an OWNER DECISION** the owner makes before or while running it: **S14** (whether the capture
roll reads patrol coverage); it opens with a decision box: the options, the session's recommendation, and the prompt
conditioned on the answer. **S1**'s deity at birth (the owner's open word FPQ-62) is RULED by the manager (2026-10-24):
option B — the account's top-ranked custom deity seated as the capital's patron, none when the account holds none —
with option A as the owner's veto; its box keeps the options and the ruling. Three other prompts contain a choice J397
left open, marked "(chosen here; the map side accepts either)": S1's preset door, S3's re-sent `bindSeat` before the
first canon, S4's rung mapping. The port names below are the map side's as file v fixed them
(`docs/AMENDMENTS-2026-10-24v.md`, items 1085–1091 — `names` is item 1086) and file w's (`PolityRelation.terms`,
`SettlementFacts.editLaw`, `TravelLaw.calibration.basisWord`, `PolitySeat.military.netForce`/`.basis`, the claims' fields,
`hostEffect`'s enumeration); the prompts use them exactly, as revised for the review `docs/volumes/critique/experience-vwx.md`.

**The host's own method, which every prompt respects** (so the host session works in its own idiom):

- The constitution's requirements 16–24 (`docs/DESIGN_FP_COHERENCE_FOLD.md` §1, :90–256): every mechanism declares
  its **FIRST-VISIBLE** latency in DM advances, and "a wave whose FIRST-VISIBLE line fails its experience read does not
  LIGHT" (req 16); every wave carries a **TIER line** (aspatial-safe / spatial canon / belief infoMode / host flags) and
  its **DEGRADED ARM** (req 17); every band row carries its measured spread or the word **UNMEASURED** (req 18); a
  mechanism is DONE when its **DM-felt sentence** fires on a seeded world (req 19) — each prompt names one; every child
  receipt populates `causedBy` at its mint (req 20); engine-written state declares its lifecycle paths (req 22); and the
  **hearing week** (req 24, SP-9): at a one-week advance no climax resolves in the tick it arrives.
- Dark by default: a new behaviour ships behind a VIRTUAL flag (no entry in `DEFAULT_SIMULATION_RULES`, read `=== true`
  at one seam, absent ⇒ byte-identical) or as a declared same-seed shift for NEW campaigns only, recorded as a JSON
  record under `docs/shift-records/` (the `_doc` form of `2026-09-19-food-balance-arithmetic.json`). An installed
  campaign is never re-labelled or re-decided: "a seed is a starting world forever" (THE PROMISE,
  `src/domain/worldPulse/simulationRules.js:7–31`).
- No second writer: a mechanism that would write a fact another writer derives is the "ghost-write class"
  (`src/domain/worldPulse/razingExecution.js:30–45`, R-WZ-1); the one-way port law — the map module never writes a host
  fact, the host carries every change by its own command.
- The gate is the product: `npm run check:tail` (never a gate through a pipe), focused Vitest under
  `sh scripts/gate-mutex.sh --run -- npx vitest run <files>`, `npm run check:packet -- <ID>` while building, the full
  `npm run check` before landing (`CONTRIBUTING.md` "The gate").
- The K3 law ("NOBODY IS EVER CURRENT", `docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md:48–53`) and the Herald's truth law
  and contamination fence (`docs/DESIGN_FP_SPINE.md:467–480`) hold on every seam these prompts open.

**The ledgers every prompt ends by writing** (the host's PROGRESS/HANDOFF equivalents at `81f1cd96`): the packet row
in `docs/implementation/INDEX.md` and `PACKET_MANIFEST.json` (the dispatch surface; `validate:packets` is step 3 of the
gate); `docs/CURRENT_STATE.md` where program state moved; `docs/FABLE_VALIDATION_QUEUE.md` for any judgment an Opus
session makes under the post-exhaustion protocol; a `docs/shift-records/*.json` record for any declared shift; the
coherence fold's status table (`docs/DESIGN_FP_COHERENCE_FOLD.md` §2, "THIS TABLE is the record") where a wave's
status moves; and, on the ledger branch `review-fixes-2026-07-08` (named by `CLAUDE.md` and `docs/CURRENT_STATE.md`;
not checked out at `81f1cd96`), a row in `docs/HANDOFF_CURRENT.md` and, for S1's and S14's decisions, in the owner
decision queue `docs/OWNER_DECISION_QUEUE.md` (the ODQ). Every prompt also asks the session to report back the port
names it implemented, so the map side can seam them.

### 0.1 The prompts

| S | Title | H row(s) served | Depends on | Owner decision | Size |
|---|---|---|---|---|---|
| S1 | Born applied and born peopled | H22, H23 (the regime); M1, M6, M22, M49 | — | ruled B (the deity, FPQ-62); A is the owner's veto | M |
| S2 | The birth window | H23, H13, H9 (a window at creation) | S1 (the regime it sends) | no | M |
| S3 | The grace rule | H22, H12, H15 | S2 | no | M |
| S4 | The instant world, world-first | H31, H14, H12 | S1 (the applied preset), S3 | no | L |
| S5 | The party observer | H23 (the party set), H17, H13 | S2 | no | M |
| S6 | The headline join | H9, H23 (receipts and the register), req 20 | S2 | no | M |
| S7 | K3 at the map feed | H16, H4 | — (lands before H4's client) | no | S |
| S8 | Net force bands once WC lands | H13, H25 | H13's window; WC-1/WC-4 for the net arm | no | S |
| S9 | The cause walk crosses the seam | H16, H14, H34 | H4's client; S6 | no | M |
| S10 | Grievances, licences and treaty terms | H13, H45 | H13's window | no | S |
| S11 | The ambiguity law amended | H17, H23 (movers and dated facts) | — (documents) | no | S |
| S12 | The draft's dossier update; H24's two asks | H32, H24 | H31/H32's seam; EM's re-derivation | no | L |
| S13 | The raid's outcome word and the hearing week | H25; SP-9 | SP-9 for the hearing arm | no | M |
| S14 | Patrols and capture | H25, H16 | H16's `patrolOffer` | **yes** (the capture rule) | M |
| S15 | H33 and H34 restated | H33, H34 | H11 (the lanes), H9 (events) | no | M |

Sizes: S ≈ one packet of a day; M ≈ two to four packets; L ≈ a train of several packets with a measurement first.

---

## Prompt S1 — Born applied and born peopled

**Why.** The map's lenses read the regime the host runs, never a preset's name (V13 §5.8 (2)). Today the instant world
applies "Realistic Regional" with its virtual keys, while a hand-assembled or imported campaign is born plain under the
same label — two "Realistic" campaigns with different lenses alive, and the map is where the DM finds it out
(`research/experience/01` §2.3 item 3). The sway's labels read the host's own allegiance names where it sends them
(M22), and the religion lens reads `none` until a deity is seated (M6, M49), which no born world ever has (FPQ-62). This
prompt lights the birth door for module worlds, names the overlord chains at genesis, honours the label, and puts the
deity question to the owner in the host's own terms.

**Map-side counterpart:** M1, M6, M22, M49; V13 §2.2 (`PolityFacts`, `HostRegime`), §5.8 (2)–(3), §5.9 (6), §8.5 H22–H23.

> **OWNER DECISION (FPQ-62) — a deity seated at birth? RULED 2026-10-24: B, with A as the owner's veto.** J397
> recommends yes: "the top-ranked generated local deity as the capital's patron". That phrase was corrected by this
> seat's verification: at `81f1cd96` **generation mints no deity** — the premade pool and the `seedStartingPantheon`
> step were deleted by the deity doctrine (`src/domain/worldPulse/latentPantheon.js:6–12`, "no premade deities — custom
> content only"); every deity is a premium custom-content record the DM seats (`src/store/settlementDeityHelpers.js:62–67`
> refuses with `custom_content_required`). The options, and the manager's ruling:
> - **A — No (the owner's veto).** Born worlds pray to no named god; the map's religion lens reads `none` ("no creed
>   seated: the dossiers' temples pray to no named god", M6). Zero host change.
> - **B — Yes, from the account's own Compendium (RULED; the prompt below builds it).** At a module-world birth, if the
>   account holds at least one custom deity, seat the top-ranked one (by `rankAxis`, ties by codepoint name) as the
>   CAPITAL's patron through the existing writer (`setPrimaryDeityImpl`, `settlementDeityHelpers.js:146` →
>   `commitDeityEmbed`, `src/domain/deityCommitEmbed.js:129`); when the account holds no custom deity the born world
>   holds none and the lens reads "no creed seated" (M6). Nothing is generated; the doctrine stands.
> - **C — Yes, from a reinstated generated pool. REJECTED** (it reverses the owner's deity doctrine).

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive an implementation packet first (docs/implementation/PACKET_STANDARD.md), mark it READY on this
authority, then build. Navigate by symbol: the line numbers here were measured at 81f1cd96.

GOAL (one sentence): a campaign born on a world from the map module is born with the Realistic Regional preset
APPLIED (its virtual keys materialized), with every overlord chain of its genesis diplomacy carrying a name the
polity facts send, with its preset label telling the truth about a plainly born campaign, and with the account's
top-ranked custom deity seated at birth as the capital's patron (option B, ruled; option A is the owner's veto).

THE H ROW SERVED: V13 §8.5 H22 (a world from the module is canonized at the campaign's birth; "on the host's birth
defaults the crisis columns, the plague front and the routed supply links; rite adoption, pilgrim catchments and
booms only where its rules carry them (an applied preset, never the birth defaults alone)") and H23 (the lens
window's "resolved regime … born or applied … a deity seated"). In your terms: the birth seam decides which lanes a
new realm feels in its first month, and the lens window reports the regime it actually runs.

FELT SENTENCE (req 19): "my new realm trades, booms and suffers from its first week, and its rules dialog says
which world it runs." FIRST-VISIBLE: the first advance's caravan arrivals and the preset label at creation.
TIER: aspatial-safe; the deity arm needs the account's custom-content entitlement. DEGRADED ARM: a campaign not
born on a module world is byte-identical to today.

READ FIRST
- src/domain/worldPulse/simulationRules.js:7–31 (THE BIRTH SEAM: NEW_CAMPAIGN_SIMULATION_PRESET_ID = null and the
  measured cost of naming it, +7 persisted keys), :873–901 (realistic_regional: the twenty-one virtual keys and why a
  legacy id may take them), :1311–1316 (RULE_COMPARISON_KEYS), :1432–1457 (rulesMatchPreset, presetIdForRules — a
  plainly born campaign infers 'realistic_regional' because virtual keys are not comparison keys), :1552–1558
  (newCampaignSimulationRules and its FORCED-DOOR presetId parameter, "passed by no production caller").
- src/domain/worldPulse/worldState.js:664–669 (createNewCampaignWorldState — "BIRTH, and ONLY birth").
- src/store/campaignImportedCreation.js:57 (the one production birth call) and src/lib/instantWorld/
  composeInstantWorld.js:417–438 (applyTonePreset: the instant world already applies the preset's rules object).
- src/domain/instantWorld/genesisDiplomacy.js:216–270 (assignGenesisRelations: dominance ties, the suzerain
  closure at :248–255 — the vassalage graph is a forest), :294–360 (materializeGenesisRelations), :157–174 (the
  neighbour-plane entry, source 'genesis_diplomacy'), :30–42 (what genesis deliberately does not write).
- src/domain/instantWorld/worldPlan.js:287–289 (relations under plan law 2 only; absent under law 1).
- src/components/map/SimulationRulesDialog.jsx:227 and :387 (activePreset?.label || 'Custom').
- src/domain/worldPulse/latentPantheon.js:1–50; src/store/settlementDeityHelpers.js:62–67, :97, :146;
  src/domain/deityCommitEmbed.js:129; src/domain/deitySnapshot.js:1–40 (the embed is what the engine can see).
- tests/domain/simulationRulesPreset.stability.test.js:715 (the BIRTH SEAM block), tests/lib/instantWorld/
  composeInstantWorld.test.js (the determinism pins), tests/store/deityWriteGate.test.js.
- docs/DESIGN_FP_COHERENCE_FOLD.md §2 (:329–352; "the birth preset seats no deity (FPQ-62)"), §1 req 16–19.

BUILD
1. THE BIRTH DOOR FOR MODULE WORLDS (chosen here; the map side accepts either). Do NOT name
   NEW_CAMPAIGN_SIMULATION_PRESET_ID (that is the global shift, +7 keys on every new campaign, the owner's to
   declare). Instead make the module-world birth the first production caller of the forced door: every creation
   path that binds a campaign to a module world — the instant world's store body (src/store/instantWorldBody.js:158
   composes; today applyTonePreset already yields the applied rules, so this path CHANGES NOTHING), the
   hand-assembled campaign (campaignSlice's creation) and the imported creation (campaignImportedCreation.js:57) —
   calls createNewCampaignWorldState(campaign, 'realistic_regional') when and only when the campaign is bound to a
   module world (the binding is H22's/H4's world record; until it lands, the instant-world marker
   campaign.instantWorld, composeInstantWorld.js:500–506, is the proxy and you say so in the packet). ensureWorldState
   on LOAD stays plain forever (worldState.js:644–662's invariant).
2. ALLEGIANCES NAMED AT GENESIS. In worldPlan.js, under plan law 2, after relations are assigned, derive per overlord
   ROOT (a seat holding ≥ 1 overlord_of tie and no vassal_of tie) one row { root: slot, name } on
   plan.allegiances, drawn on rng.fork('allegiance') (a fork from the seed string, so no existing draw moves). Name
   form (chosen here): `The <Word> of <root settlement name>` with Word from a closed per-tier table
   (metropolis/city: Crown, Realm; town: Lordship, Hold) — the name is minted in genesisDiplomacy's materializer once
   the root's final name is known (after dedupeFactionNames). Materialize it on BOTH ends of every overlord_of /
   vassal_of entry as `allegiance: { rootId, name }` (patron_of/client_of ties are not allegiances). Absent-when-dark:
   law 1 writes no key; a plan with no overlord writes no key. Add the rows to genesisRelationsSection so the
   fingerprint pins them.
3. THE LABEL. Add a pure display read presetAppliedFor(rules) → 'applied' | 'birthDefaults' | null: 'applied' when
   every virtual override key of SIMULATION_RULE_PRESETS[rules.presetId].rules that is absent from
   DEFAULT_SIMULATION_RULES is present and equal in `rules`; 'birthDefaults' when none is; null for a preset with no
   virtual keys. SimulationRulesDialog.jsx:387 renders "Realistic Regional (birth defaults)" for 'birthDefaults'
   and the bare label otherwise. presetIdForRules and every installed save's presetId are untouched.
4. THE DEITY (option B, ruled — this prompt builds it; option A is the owner's veto and skips this step; J397's
   "generated local deity" is corrected here: the host mints none at generation, so the account's own deities are
   the only candidates). At a module-world birth, after the members are minted and before the campaign
   is committed, if the account's custom content holds ≥ 1 deity: pick the top-ranked (rankAxis order as
   deityRankStrength ranks it, ties by codepoint name), and seat it as the primary deity of the CAPITAL (slot 0,
   the realm's dominant centre) through setPrimaryDeityImpl — the same event the panel dispatches, so the embed,
   the receipt and the undo are the panel's. No custom deity ⇒ nothing is written and the born world holds none.

THE DATA CONTRACT THE MAP EXPECTS (quote it in the packet)
- The lens window's regime (S2 sends it): `HostRegime.born: boolean` — "the campaign runs its birth defaults, no
  preset applied"; a module-world campaign born under step 1 sends born: false. `HostRegime.deitySeated: boolean`.
- The polity facts: `PolityFacts.names?: { root: string /* the root seat's host key */; name: string }[]` (file v's
  name, item 1086; M22) — the sway's label order is the DM's christening (`christened`) first, else `names`, else the
  descriptive label (the root's name as now). Implement the row shape and report it.
- The map never reads a preset id; it never infers a regime from one.

ACCEPTANCE TESTS (name them so)
- tests/domain/simulationRulesPreset.stability.test.js, BIRTH SEAM block: a module-world birth's rules are byte-equal
  to normalizeSimulationRules(SIMULATION_RULE_PRESETS.realistic_regional.rules); a non-module birth is byte-identical
  to today's envelope (the existing pin, unmoved).
- tests/lib/instantWorld/genesisAllegiance.test.js: every overlord root has exactly one allegiance row; a seat with
  no overlord has none; both ends of a vassal tie carry the root's name; plan law 1 and a plan with no dominance tie
  write no key and fingerprint byte-identically to before; same seed ⇒ same names.
- tests/ui/simulationRulesPresetLabel.test.jsx: a plainly born campaign's dialog reads "(birth defaults)"; an
  instant-world campaign's reads the bare label; an installed campaign's presetId is unchanged by the read.
- tests/store/instantWorldBinding.test.js (option B): with one custom deity the capital's config.primaryDeitySnapshot
  equals deitySnapshotFrom(thatDeity) and hasActivePantheon is true; with none, the bundle is byte-identical; a
  free account's birth writes no deity (the write gate's refusal is honoured, never bypassed).

WHAT NOT TO DO
- Never re-label or re-decide an installed campaign (THE PROMISE); never move NEW_CAMPAIGN_SIMULATION_PRESET_ID.
- Never reinstate a premade deity pool; never seat a deity the account does not own; never bypass deityWriteGate.
- Never write relationshipStates rows or tick-stamped history at genesis (genesisDiplomacy.js:30–42).
- Never put the allegiance name into a settlement's name or faction names; it is a link-plane fact.

RECORD: the packet row in docs/implementation/INDEX.md and PACKET_MANIFEST.json; a shift record under
docs/shift-records/ for the module-world birth (a declared shift for NEW module-world campaigns only); the ODQ row
on the ledger branch (review-fixes-2026-07-08: docs/OWNER_DECISION_QUEUE.md) recording the FPQ-62 ruling (B) or the
owner's veto (A) and
docs/HANDOFF_CURRENT.md; the fold's §2 FAITH row if the deity arm lands. REPORT BACK the port names you implemented:
HostRegime.born, HostRegime.deitySeated, the PolityFacts.names row shape, presetAppliedFor.
```

---

## Prompt S2 — The birth window

**Why.** On a host-bound world every lens banner reads "the host's regime not sent" until the first advance, the sway
projects "before the host's first polity window", and the cover fold has no populations to clear fields with — a week-one
artifact the DM reads as "what happened?" (`research/experience/01` Moments 6–8, §4 Q3). M1 rules that the host sends
a lens window at the campaign's creation (its regime resolved, its polity facts at their genesis values, its
populations), so every banner resolves at birth and the first polity window redraws only what changed. The host's
window exporters do not exist yet (H23, H13 are unbuilt); this prompt builds them as pure exporters with a creation
call, so the client (H4) has something to send the day it lands.

**Map-side counterpart:** M1; V13 §2.2 (`LensFacts`, `HostRegime`, `AdvanceWindow`, `PolityFacts`), §3.11.6
(`lensWindow`, `polity`, `events` as windowed replaces), §5.8 (2), (7), (8); §8.5 H9, H13, H23.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet first (docs/implementation/PACKET_STANDARD.md). Navigate by symbol.

GOAL: at a module-world campaign's creation the host produces one lens window, one polity window and one (empty)
events window — sequence 0, weeks 0–0 — carrying its RESOLVED REGIME, its genesis polity facts and every seat's
population, from pure exporters that will also serve every later advance.

THE H ROWS SERVED: H23 ("the lens window after every advance, undo and resume … its resolved regime with every
window … so no lens reads a regime from a preset's name"), H13 (the polity facts per window) and H9 (the events
window … keyed by the advance nonce when its advance epoch is lit, else by its pulse-history sequence). In your
terms: a per-advance read-model over worldState and the saves, projected for an audience, with the week-zero
instance produced at birth.

FELT SENTENCE: "the realm map's legends name what my world runs from the moment it exists." FIRST-VISIBLE: at
creation (the map's banners), before any advance. TIER: aspatial-safe (the exporter reads what exists; a dark lane
reads false). DEGRADED ARM: nothing is persisted and no engine read changes — the exporter is view-time.

READ FIRST
- src/domain/worldPulse/simulationRules.js:1404–1409 (infoModeOf), :1571ff (isFaithSpreadEnabled — by symbol),
  :873–901 (the applied preset's virtual keys); src/domain/worldPulse/beliefMap.js:204–209 (beliefsActive);
  src/domain/spatial/pestilence.js:151 (epidemicActive); src/domain/spatial/migration.js:175 (migrationActive);
  src/domain/spatial/distanceRead.js:111 and :278–287 (the digest's reserved slots: seasonalOverlay, seaLanes,
  teleportEdges; the sea-lane dormancy gate); src/domain/worldPulse/latentPantheon.js:74 (hasActivePantheon).
- src/domain/worldPulse/worldState.js:323, :599, :788–800 (pulseHistory ring, pulseIdFor, appendPulseHistory — the
  hostSeq is the pulse-history sequence); src/domain/worldPulse/pulseKernel.js:338 (advanceEpochEnabled and the
  epoch term — the nonce arm, lit in no preset).
- src/domain/region/wizardNews.js:923–941 (projectWizardNewsForAudience: the host's audience words 'dm',
  'dm-only', covert — the convention the window's per-row audience mirrors).
- src/domain/instantWorld/genesisDiplomacy.js:157–174 (the neighbour-plane entry a genesis tie writes; S1 adds
  `allegiance`); src/domain/worldPulse/hegemony.js:56 (SUBORDINATING_TERM_TYPES) and
  src/domain/worldPulse/relationshipHierarchy.js:211 (the vassal plane the simulation reads).
- src/domain/prosperityRank.js (the prosperity rung); src/domain/density (tier population thresholds — by symbol).
- docs/DESIGN_FP_COHERENCE_FOLD.md §2 (:329–352: which lanes are lit per preset — the regime you resolve must agree
  with this table at 81f1cd96).

BUILD
1. src/domain/worldPulse/hostRegime.js: resolveHostRegime({ worldState, saves, digest }) → HostRegime:
   born = presetAppliedFor(rules) !== 'applied' (S1's read); canon = Number.isInteger(spatialCanonVersion) && > 0;
   slots = { seaLanes, teleport, seasonal } from the digest's reserved slots being non-null; lanes = one boolean
   per host lane by name — plagueFront: epidemicActive, columns: migrationActive, faithSpread:
   isFaithSpreadEnabled, war: warLayerEnabled === true, demographics: demographicsEnabled === true, beliefs:
   beliefsActive, pacts: pactFormationEnabled === true, roads: roadsActive — the full list is the packet's census of
   every `*Enabled` key an engine stage reads, by symbol; deitySeated = any save hasActivePantheon; plagueLive =
   any live disease_outbreak stressor; beliefs = beliefsActive; intensity = rules.intensity. Pure; total on garbage.
2. src/domain/worldPulse/lensWindowExport.js: exportLensWindow({ campaign, worldState, saves, window, audience })
   → one LensFacts set for audience 'dm' (and, where beliefsActive, S5's 'party' set). At 81f1cd96 fill what
   exists: sizes (every seat's population), faith (patron, shares from config.faithProfile where a deity is
   seated), plague (the epidemic ledger's rows on the canon; the live stressors' footprint rows off it), economy
   (the dossier's production/needs/exports/imports/services by catalog key, with foodCoverage as an integer
   percent), transfers, columns (spatialLedgers.migration), journeys, prosperity rungs; every row carries its
   resolved audience ('public' | 'dmOnly'), a row without one folded dmOnly. Leave a field ABSENT rather than
   defaulted when the host holds nothing for it (the map's legend says "not sent").
3. src/domain/worldPulse/polityWindowExport.js: exportPolityWindow(...) → PolityFacts: seats (tier; sizeThird —
   the third of the tier's population band the seat's OWN people fall in, satellites never counted; prosperity
   rung; strengthBand from settlementStrength banded on STRENGTH_BANDS where you choose to send it now; military
   absent until S8), links (the vassal plane's labels and hegemony's subordinating terms; a genesis overlord_of tie
   is a link with word 'overlord' since week 0), relations (pairwise relationship-state labels with atWar; S10 adds
   their `terms`), claims
   [], satellites, culture (absent now — the map reads W_POLITY_CULTURE_ABSENT), waterLanes { lit, lanes },
   roadWatch, christened, and S1's `names` rows.
4. THE BIRTH CALL: after a module-world campaign is created (the instant-world body after persistCampaignState; the
   hand-assembled and imported creations likewise), build the three windows for
   `{ fromWeek: 0, toWeek: 0, hostSeq: 0, seq: 0 }` and hand them to the world-port client seam
   `worldPortClient.send({ lensWindow, polity, events: [] })`. The client is H4's; until it lands the seam is a
   registered no-op (like the spatial capture registry, src/lib/spatialCaptureRegistry.js:21–31) and the packet says
   so. The same exporters run after every advance, undo and resume with that advance's window.
5. THE WINDOW KEY: window.hostSeq = the pulse-history sequence of the window's final record (pulseIdFor's tick);
   window.advanceNonce only when advanceEpochEnabled is lit.

THE DATA CONTRACT THE MAP EXPECTS
- `LensFacts { window: AdvanceWindow; audience: 'dm'|'party'; regime?: HostRegime; plague?; faith?; economy?;
  arrivals?; transfers?; columns?; sizes?; trend?; prosperity?; alignment?; pulses?; partySeat?; observer?;
  courts? (S5) }` — each row with its
  `audience: 'public'|'dmOnly'`; a window with no regime raises the map's W_LENS_REGIME_ABSENT.
- `HostRegime { born; canon; slots: { seaLanes; teleport; seasonal }; lanes: Record<string, boolean>;
  deitySeated; plagueLive; beliefs; intensity? }`.
- `AdvanceWindow { fromWeek; toWeek; advanceNonce?; hostSeq; seq }` — a windowed replace: the map adds,
  supersedes and retracts against the previous window; a retraction is a forward event, never an undo target.
- `PolityFacts { window; seats: PolitySeat[]; links: PolityLink[]; relations: PolityRelation[]; sites; satellites;
  claims; culture; waterLanes; roadWatch; christened; names? }`.
- The map treats every window as presentation (the lens window) or a recorded input (polity, events); it persists
  the lens window only as plates in its own cache, never a byte of it in your world state.

ACCEPTANCE TESTS
- tests/domain/hostRegime.test.js: for each shipped preset × canon on/off, the resolved regime agrees with the
  fold's §2 table (a table-driven pin); garbage rules resolve to every-lane-false; born is false for an applied
  preset's rules and true for a plain birth.
- tests/domain/lensWindowExport.test.js: the week-zero window of a composed instant world has seq 0, every member
  in sizes, a regime with every field a boolean, no row without an audience, and no field defaulted; exporting
  writes nothing (worldState and saves byte-identical before and after); a window after an advance has hostSeq
  equal to the last pulse record's tick.
- tests/domain/polityWindowExport.test.js: every genesis overlord tie is a link since week 0; sizeThird never
  counts a satellite; a pair with no relationship edge has no relation row (never a defaulted 'neutral').

WHAT NOT TO DO
- Never persist a window in worldState or a save; never let a stage, an encounter or the clerk read one.
- Never guess a regime from a preset id; never send a lane as lit because the preset's label implies it.
- Never send a believed value in the 'dm' set; never send a DM-only row without its audience.

RECORD: the packet rows; docs/CURRENT_STATE.md ("What this integration adds": the window exporters); the fold's §2
row for H23's first step. REPORT BACK: the HostRegime lane names you resolved, every LensFacts field you fill at
81f1cd96 and every one you leave absent, the window key arm (hostSeq) in force.
```

---

## Prompt S3 — The grace rule

**Why.** The host promises "every site is freely draggable at t=0, so exact coordinates are COSMETIC IN PLAY"
(`worldPlan.js:144–147`); H22 as first written canonized a module world at the campaign's birth, after which a move
was a premium re-canonize — two promises that collided in the first ten minutes (`research/experience/01` §2.3 item 1,
§4 Q5). M2 rules the grace rule, and file v has amended V13 §8.5 H22, §3.11.6 and `Placement.hostLocked` to it: the
genesis network's edges are named at creation and laid over the seats as they stand, re-laid at each drag; their costs
enter the canon at the first advance; the birth canon is taken at the FIRST ADVANCE over the seats as they then stand;
before it every seat drags free (a drag a re-sent `bindSeat`); the lanes the canon gates run from the first advance,
which is the first time anything runs; after it a move is the premium re-canonize H22 rules.

**Map-side counterpart:** M2; V13 §2.2 (`Placement.hostLocked` holds only from the first advance), §3.11.6 (`canon`,
`bindSeat`, `canonized`, the port consumption law), §8.5 H12, H15, H22.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet first. Navigate by symbol.

GOAL: on a campaign bound to a world from the map module, the birth canon (H22) is adopted at the head of the
campaign's FIRST advance over the seats as they then stand — not at creation — and until that advance every seat
may be dragged freely, each drag re-sent to the module; from the first advance on, a move is the premium
re-canonize and the canon-gated lanes run.

THE H ROWS SERVED: H22 as file v amended it (V13 §8.5 H22, §3.11.6 and `Placement.hostLocked` now say the first
advance): the genesis network's edges are named at creation and laid over the seats as they stand, re-laid at each
drag; their costs enter the canon at the first advance; the birth canon is taken at the first advance over the seats
as they then stand; before it every seat drags free, and "the canon-gated lanes its rules light run from its first
week". H12
("the move-lock's release named per seat"); H15 ("world edits held while an advance runs or is parked").
In your terms: runSpatialCanonize's first run on such a campaign is the engine's own act at the first advance head,
unasked, entitlement-blind; the DM's explicit canonize stays the DM's for everything after.

FELT SENTENCE: "I nudged three towns into the valley before my first week and nothing complained; after the first
week the map told me a move would be a re-canonize." FIRST-VISIBLE: the first advance (the canon receipt and the
per-seat move-lock line). TIER: spatial canon (this prompt creates it); premium-blind. DEGRADED ARM: a campaign not
bound to a module world is byte-identical (its canonize stays the DM's act).

READ FIRST
- src/store/campaignSpatialCanonize.js:30–60 (runSpatialCanonize: "Re-canonize BUMPS spatialCanonVersion"; the
  injected capture; kmScale on the FIRST canonize), and the whole module.
- src/lib/spatialPackCapture.js:1–25 and :251 (captureSpatialPack — the read-only capture of the FMG iframe the
  world port's `canon` replaces: V13 §3.11.6's consumption law, "the port replaces the host's capture of the
  reference generator, never the host's own frozen distance record").
- src/domain/spatial/spatialDigest.js:587 (buildSpatialDigest — the host's frozen record, built once, never
  recomputed); src/hooks/useInstantWorldMaterialize.js:33–61 (the pendingMapGen path a module world retires).
- src/domain/worldPulse/advanceInterval.js:1–60 (the orchestrator; the parked cursor at :327–340 as the fold cites
  it: a parked advance refuses advances and edits); src/store/campaignWorldPulseSlice.js (the advance action).
- src/domain/instantWorld/worldPlan.js:144–160 (the t=0 drag promise and the scatter box); src/lib/instantWorld/
  composeInstantWorld.js:395–411 (placeMembers — cellId null, "the live FMG cell resolves at canonize").
- docs/DESIGN_FP_COHERENCE_FOLD.md §1 req 22 (:141–152: lifecycle paths for engine-written state).

BUILD
1. THE FIRST-ADVANCE CANON. In the advance action, before tick 1 of a campaign whose world record is a module world
   and whose spatialCanonVersion is 0: request the module's canon for the bound seats as they then stand
   (`canon(world, { campaign, logHead, seats, costLawVersion, waterK })`), build the frozen record from it (H5's
   second builder — until H5 lands, the capture seam stays and the packet names the gap), stamp
   spatialCanonVersion 1, store the receipt with its causes, and send `canonized(world, { worldVersion;
   canonVersion; lawVersion })` and the travel law with its calibration (H8). Refuse the act while an advance runs
   or is parked (the H15 rule), and never inside a tick (the port consumption law).
2. THE GRACE DRAG. While spatialCanonVersion is 0 on such a campaign, a placement drag writes mapState.placements as
   today and re-sends the seat's placement to the module (`bindSeat(world, { hostKey; placement })` re-sent for the
   same key before the first canon — chosen here; the map re-places the seat with its blend and re-lays its roads).
   THE GENESIS NETWORK (H12): `genesis(world, RouteGenesis)` is sent at creation — its edges named over the seats as
   they then stand — and the map re-lays them at each drag; their costs enter the canon only at the first advance.
   The first advance adopts the canon over the dragged positions.
3. THE LOCK AFTER. From spatialCanonVersion ≥ 1, a drag on a seat the canon froze is refused with the host's own
   move-lock sentence naming the seat and offering the premium re-canonize (today's DM act), exactly as H12's "the
   move-lock's release named per seat" asks; a seat founded after the canon joins by the additive re-canonize the
   host runs itself (H22; J388) — a later packet, name it.
4. THE RECEIPT. The first canon's receipt names its parents: the campaign's creation receipt and the module's
   `causes` list (req 20); the Herald prints the planting line "the realm's roads and distances were fixed at the
   first week" in the DM's paper (the SP-6 subheader register: plain, no voice).

THE DATA CONTRACT THE MAP EXPECTS
- `CanonRequest { campaign; logHead; seats: string[]; costLawVersion; waterK; additive?: boolean }` → `WorldCanon`
  (the travel, water and sites slots, integer costs under your cost law, the envelope's version vector and
  causes); whole or refused, never partial; a pure function of the inputs its hashes name.
- `canonized(world, { worldVersion; canonVersion; lawVersion })` after adoption; `travelLaw(world, law)` with
  `basis: 'normalized'|'absolute'` and `calibration { weeks; perCost; basisWord? }` at every canon adopted (H8) —
  `basisWord` your own words for the basis, printed on the map's route label beside your weeks ("normalized:
  relative to this realm's nearest-neighbour hop", or your metric word; M5; file w item 1144); absent, the label
  names the `basis` field's word.
- `Placement.hostLocked` holds on the map only from the first advance; before it, a re-sent `bindSeat` for a key
  is accepted as a re-placement; `genesis(world, RouteGenesis)` at creation names the edges, re-laid at each drag,
  their costs entering the canon at the first advance (file v's H22).
- The lanes the canon gates (the plague front, the columns, the routed supply links) run from the first advance,
  which is the first time anything runs: no week-one artifact of a canon adopted at creation.

ACCEPTANCE TESTS
- tests/store/firstAdvanceCanon.test.js: a module-world campaign has spatialCanonVersion 0 after creation and
  three drags; after the first advance it is 1 and the frozen record's seat points equal the dragged positions; a
  second advance adopts no new canon; a drag after the first advance is refused with the move-lock sentence; an
  advance started while another is parked adopts no canon.
- tests/store/campaignWorldPulseSpatialCanon.test.js (existing): the DM's explicit canonize is byte-identical for
  a campaign not bound to a module world.
- The determinism pin: the same seed, knobs and drags ⇒ a byte-identical frozen record and receipt.

WHAT NOT TO DO
- Never adopt a canon at creation on a module world; never adopt one inside a tick or while parked.
- Never gate the birth canon on the premium canonize entitlement (J386; J388): it is the product ruling.
- Never move a frozen seat silently; never rebuild the whole record for a founding after the canon (that is the
  additive re-canonize, its own packet).
- Never let the map's geometry into the capture: the capture path is what this retires for module worlds.

RECORD: the packet rows; docs/CURRENT_STATE.md; a shift record (new module-world campaigns only); the fold's §2
row for POPULATIONS ("nothing writes ensureGenesisRouteNetwork") once H12's genesis lands with the canon.
REPORT BACK: the canon request fields you send, the receipt's parents, the move-lock sentence, and your
`calibration.basisWord` (your own words for the basis, printed on the map's route label, M5).
```

---

## Prompt S4 — The instant world, world-first

**Why.** The composer rolls nine members independently and scatters them "in a central box" of a 1000 × 600 canvas
over an island they were not made for (`worldPlan.js:144–160`); the map module then grows a world to justify them, which
can stretch a "settled region" across desert and tundra (`research/experience/01` Moment 1, §4 Q1–Q2). M4 rules the
instant world WORLD-FIRST: when the module replaces the scatter (H31), it grows the world from the host's three knobs
mapped onto the surface, lays planned sites from the plan's genesis ties, writes a charter per site, and the host mints
each member from its charter; "based off of my settlements" stays for saved settlements.

**Map-side counterpart:** M4; V13 §3.1 (5) (inclusions and relations as requirements), §3.11.4 (the charter, emitted
world-first), §3.11.6 (`charter(world, campaign)`, `proposals`, `place`), §8.5 H12, H14, H31.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet (a train: the adapter table, the awaited world, the charter-born member, the
share-code law — four packets at least; the first is a measurement). Navigate by symbol.

GOAL: the instant world's composer asks the map module for a world from the three knobs through an adapter table,
takes the module's planned sites with their charters in place of its own scatter, and mints each member FROM its
charter (terrain word, coast and side, river, climate row, latitude band, access word) — same seed, same knobs,
same realm, forever.

THE H ROWS SERVED: H31 ("its instant world's terrain-blind scatter replaced by a run with `include` set, so a
generated campaign's seats land where their words say"); H14 ("for a settlement generated from a world charter, its
access word derived from the charter's road and water facts, and its terrain word from the charter's relief, biome
and water facts by the inverse of DR1's relief-class row, before generation"); H12 (genesis at world birth with the
founding members placed first). In your terms: deriveWorldPlan's `sites` come from the module, and
memberConfigFor's random sentinels for terrain and route are answered by the charter before the pipeline runs.

FELT SENTENCE: "my new realm's port is on the coast, its hill fort on the ridge, and the roads between them are the
ones the map drew." FIRST-VISIBLE: the composed realm's first picture (creation). TIER: aspatial-safe for the
member mint (the charter is data); the world generate is the module's. DEGRADED ARM: an existing share code (plan
law 1 or 2) replays its scatter byte-identically forever; the charter path is plan law 3.

READ FIRST
- src/domain/instantWorld/worldPlan.js:39–41 (PLAN_LAW_VERSION/LEGACY — "a share code is a world"), :54–76
  (REALM_SIZES: 5/9/14 members), :87–91 (TONES → presets), :100–110 and :142 (MAP_KINDS, the random pool),
  :144–160 (the scatter box and its corrected comment), :226–317 (deriveWorldPlan: the map-kind draw stays first
  and unconditional; the surprise-me sentinels; the diplomacy fork).
- src/lib/instantWorld/composeInstantWorld.js:124–146 (memberConfigFor: settType, _randomizePriorities, the
  random_trade / random_culture / random_threat sentinels), :162–194 (mintSettlement), :261–324 (the step list),
  :395–411 (placeMembers: the join on slot, cellId null), :444–466 (buildMapState: pendingMapGen).
- src/lib/instantWorld/composerPipeline.js:85–97 (COMPOSER_STEP_CONTRACT — the order of record; a new step is
  declared here or runComposerSteps refuses it, :115–160).
- src/store/instantWorldBody.js:148–172 (the body awaits loadGenerationLawPayloads on its own async edge, then
  calls the synchronous composer — the world generate is awaited on the SAME edge).
- src/data/worldFactOptions.js:37–45 (TERRAINS: plains, hills, forest, riverside, coastal, mountain, desert — the
  terrain word the charter must map onto); src/domain/resolveTerrain.js:40–45 (terrainType > terrainOverride >
  terrain); src/store/configSlice.js:13–25 (tradeRouteAccess 'random_trade'; the route words the generators read:
  port, crossroads, road, … — census them by symbol in defenseGenerator.js:81 and aiLayer.js:134).
- src/hooks/useInstantWorldMaterialize.js:33–61 (the FMG materializer a module world retires: no fmgSnapshot, no
  bridge.resetMap; the module's world is the geography).
- tests/lib/instantWorld/composeInstantWorld.test.js and composerPipeline.test.js (the determinism and order pins).

BUILD
1. THE ADAPTER TABLE (data, src/domain/instantWorld/mapKindAdapter.js): MAP_KIND_ADAPTER over MAP_KINDS' ids →
   the module's request: '' → random (the module's own Random all); highIsland → template island, relief rugged;
   lowIsland → island, relief low; volcano → the volcanic scenario; peninsula → template peninsula; pangea →
   template continent; atoll → template atoll; sfArchipelago → template archipelago. REALM_SIZE_ADAPTER (chosen
   here; the map side accepts either): small → the province rung; medium → the realm rung; large → the realm rung
   at its largest extent (never the continent rung: a 14-member realm is a realm). TONE is not mapped to any world
   option: it stays the preset the composer applies (S1) and is SENT to the module with the request as the regime
   the banners will read (the module shows it read-only on its world dialog).
2. THE AWAITED WORLD. In instantWorldBody.js, after loadGenerationLawPayloads and before composeInstantWorld: build
   the world request from the plan's knobs (deriveWorldPlan runs first for the seed, tiers and relations as today),
   the tier ladder and genesis relations as requirements at RANK 1 (each member a `site` row with its tier as its
   one fact — a plan member lands at its tier as a saved town must at its facts; each tie a `relation` row with its
   word), await the module's generate through the world-port client, and
   receive `{ sites: [{ slot, at (world point), charter }], genesis }`. Pass them into composeInstantWorld as a new
   `plannedSites` argument under plan law 3; the composer stays SYNCHRONOUS and pure (the awaited world is an
   input like contentRuntime). Share codes: law 3 codes carry the world's seed; law 1 and 2 codes replay the
   scatter exactly as today (fail closed: a code without a world seed is law ≤ 2).
3. THE CHARTER-BORN MEMBER. memberConfigFor(site, plan) reads site.charter where present, each word derived as V13
   §3.11.4 (file w item 1167) gives it: terrainType = the inverse of DR1's relief-class row over the charter's
   `edges[].profileCm` (the relief), `outlines.coast` (a coast), `riverCrossings[]` (a river) and `biome.row` (a
   table in the adapter → one of TERRAINS: a coast → 'coastal', a river crossing with low relief → 'riverside',
   rugged relief → 'mountain', hilly → 'hills', a dry biome → 'desert', a wooded one → 'forest', else 'plains'); the
   coast flag and side from `waterEdges[]` (kind 'sea', its `side`); the river and its inflow from
   `riverCrossings[]` (`direction: 'in'`); the climate row from `biome.climateRow`; the latitude band from
   `climate.latitudeDeg`; tradeRouteAccess = the access word from `roads[]` and the canon's water access
   (`derivedFacts`' `SettlementMapRecord.waterAccess`: eligible ⇒ a port; ≥ 3 charter roads ⇒ crossroads; else
   road); culture and monsterThreat stay on their sentinels; the climate row and latitude band ride as explicit
   config fields the pipeline already accepts (census them). A member without a charter (law ≤ 2) is minted exactly
   as today.
4. PLACEMENT AND MAP STATE. placeMembers writes x,y from site.at through the one coordinate adapter (H6: y-north
   cm → the host's y-down frame); buildMapState sets no pendingMapGen and no FMG seed on a module world (the
   world record is the geography; useInstantWorldMaterialize stays inert by its own guard).
5. THE GENESIS NETWORK. The module's `genesis` (RouteGenesis: lawVersion, edges with host keys) is recorded as the
   campaign's route network at birth (H12 — the mount nothing writes today, fold §2 POPULATIONS: "nothing writes
   ensureGenesisRouteNetwork"); if the route lifecycle lane is dark the list is stored as presentation and the
   packet says so.

THE DATA CONTRACT THE MAP EXPECTS
- The request (V13 §3.1 (1), as file w leaves it): `WorldRequest { seed; size: WorldSizeRung | { widthKm; heightKm };
  choices?: OptionChoice[]; requirements?: Requirement[]; regime?: HostRegime }` — the `hostKnobs` mapping of V13
  §2.3 (file w item 1152 (b)) gives `size` (small → the province rung at its row's extent; medium → the realm rung;
  large → the realm rung at twice its row's extent) and the `set` `OptionChoice`s (a mountainous island → the
  `island` template with ruggedness set high; a low island → `island`, ruggedness low; a volcanic island → the
  `islandArc` scenario; a peninsula → `peninsula`; a supercontinent → `continent` with the land share set high; an
  atoll → `atoll`; an island chain → `archipelago`; the random island → the module's own Random all); `regime` is
  S1/S2's `HostRegime`, read-only on the world dialog; a knob word with no row is refused (`refuse.world.hostKind`).
- The requirements, both at RANK 1 (file w item 1156; the review's EX-19): a member `{ kind: 'site'; source:
  'inclusion'; rank: 1; target: { tier; hostKey } }`; a tie `{ kind: 'relation'; source: 'relation'; rank: 1;
  target: { a; b; word; travelDaysMax? } }` as V13 §2.2 types `Requirement.target` (the adapter folder's relation
  table maps your words overlord_of/vassal_of/patron_of/client_of/allied/trade_partner/rival).
- The answer per site: `FrameCharter` (V13 §2.2) with the fields you read — `edges[].profileCm`, `waterEdges[]:
  { side; kind: 'sea'|'lake'; … }`, `riverCrossings[]: { side; direction: 'in'|'out'; … }`, `outlines.coast`,
  `roads[]`, `climate.latitudeDeg`, `biome: { row; climateRow; landUseShare }`, `soil`, `bedrock`, `landforms[]` —
  plus the site's world point; the access word's water half from `derivedFacts`' `SettlementMapRecord.waterAccess`
  (V13 §3.11.6), never a charter field; and `RouteGenesis { lawVersion; edges: { hostKey; a; b; mode: 'land'|'water';
  grade }[]; week: 0 }`.
- `SettlementFacts` (what the module reads back for "based off of my settlements", H31): `{ hostKey; tier;
  population?; terrain; access; climateRow /* the adapter's, by DR42 from the terrain word — never yours */;
  latitudeBand? /* from your culture by the adapter's DR29 row: your culture reaches the port as this, never as a
  `culture` field */; resources; phase: 'draft'|'canonized'; editLaw? (S12) }` — the coast side, lake and river
  inflow are never asked of you (the frame's own geometry supplies them, J393 (13)).

ACCEPTANCE TESTS
- tests/lib/instantWorld/composeInstantWorld.test.js: a law-1 and a law-2 code compose byte-identically to
  81f1cd96's bundle (the fingerprint pin unmoved); a law-3 bundle with injected plannedSites is byte-identical
  across two runs; the random_trade sentinel never survives on a charter-born member; terrainType equals the
  adapter's inverse for a fixture of seven charters (one per terrain word); placements equal the sites' points.
- tests/lib/instantWorld/composerPipeline.test.js: the step contract gains no step that reads the network or the
  clock; the order guard still refuses a swapped list.
- tests/domain/instantWorld/mapKindAdapter.test.js: every MAP_KINDS id has a row; '' maps to random; a tier not
  in REALM_SIZE_ADAPTER is refused loudly.

WHAT NOT TO DO
- Never make composeInstantWorld async; never read the clock or the network inside a step.
- Never let a law-1 or law-2 code read a charter (THE PROMISE: "v1 codes REPLAY AS v1 FOREVER").
- Never ask the module for a culture, a threat or a name; never write the module's geometry into the FMG capture.
- Never second-guess the charter with the mismatch popup's three classes: on a mismatch the module's conflict list
  decides (H31), the host does not re-roll.

RECORD: the packet rows (a train); docs/CURRENT_STATE.md; a shift record (law 3 for new module worlds); the fold's
§2 POPULATIONS row when the genesis network is stored. REPORT BACK: the adapter tables' rows, the plannedSites
input's shape, the charter fields you consumed and the ones you ignored, the plan law number.
```

---

## Prompt S5 — The party observer

**Why.** The host records belief per court (`beliefMaps[observer].seat[subject]`); a party is not a court, and no
volume said whose belief the party's map shows (`research/experience/05` §2.1 item 1, §4 Q1–Q3). M8 rules the party's
observer: the believed record of the court of the settlement the party stands at (the party seat the host sends), else
the party's home seat (a campaign fact the DM names), else none; believed rows carry `asOfWeek` and a `confidence` band
so a season's forgetting shows. M9 adds a court viewpoint on request; M10 the default-preset arm (public rows delayed by
your own distance pricing when you send the party's seat).

**Map-side counterpart:** M8, M9, M10, M50; V13 §2.2 (`LensFacts` audience `party`), §3.11.6 (`beliefView`,
`lensWindow`), §5.8 (7); V15 `Viewpoint.audience` `court:<seat>`; §8.5 H17, H23.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet. Navigate by symbol. Depends on S2's exporters.

GOAL: the host names where the party stands, resolves a PARTY OBSERVER (the court of that settlement, else the
party's home seat, else none), sends the party's believed rows with their update tick and confidence band in the
lens window's party set, sends the party's seat every advance, and serves a named court's believed political facts
on request for a court viewpoint.

THE H ROWS SERVED: H23 ("a party set of believed rows where it records belief"), H17 ("the DM's believed view where
belief is recorded"), H13 (the polity facts a believed view mirrors). In your terms: a read-model over the belief
map and the rumor ledger, projected for the party as settlementRumors projects for the player, plus one DM-set
campaign fact.

FELT SENTENCE: "my players' map shows what Emberford's court has heard, as of the week it heard it, and fades what
it has not heard of lately." FIRST-VISIBLE: the first advance under a belief-recording infoMode. TIER: belief
infoMode (spatial canon ∧ infoMode ≠ omniscient) for the believed rows; aspatial-safe for the party seat.
DEGRADED ARM: omniscient ⇒ no believed rows; the party seat is still sent (the map delays public rows by your
distance pricing — M10).

READ FIRST
- src/domain/worldPulse/beliefMap.js:10–12 (the schema), :22–35 (the gate; the cold start to ground truth as of
  canonize for the declared neighbourhood), :74 and :87 (GOVERNING_SEAT_KEY 'seat', PUBLIC_FACTION_KEY 'public'),
  :110–120 (SILENCE_DECAY 0.92 per silent tick; MIN_CONFIDENCE), :204–209 (beliefsActive), :225–233
  (beliefRecord), :336–350 (BeliefRecord: readiness, strengthBand, allianceLabel, faithLabel, confidence01,
  lastUpdateTick, the D-1/SP-B axes when lit), :366–371 (belief(): 'truth' | 'unknown' | 'belief').
- src/domain/display/settlementRumors.js:1–38 (the player projection: a whitelisted, value-scrubbed field set;
  in-transit records invisible; the DM projection adds `truth`).
- src/domain/worldPulse/distancePricedNews.js:21, :30–35, :65–76 (NEWS_SPEED_FACTOR 0.5; hopDelayTicks; the
  route-aware form) — the constant the map adopts as data for the default-preset arm.
- src/domain/worldPulse/simulationRules.js:1404–1409 (infoModeOf: omniscient | perfect_delayed | unreliable |
  full), :953 and :996 (perfect_delayed in dramatic_campaign and living_realm).
- src/domain/worldPulse/partyImpact.js:1–25 (the party today: a cause tag on DM-declared consequences; no
  location anywhere — verify by grep for partySeat / party location before you add one).
- docs/DESIGN_FP_INFORMATION.md §1b (LAW ONE: "what courts BELIEVE and what the record SUGGESTS"; never a truth
  the DM has not authored); docs/DESIGN_FP_SPINE.md:467–480 (the truth law and the fail-closed projection down).

BUILD
1. THE PARTY'S PLACE: a campaign record `campaign.party = { seatId: string|null, homeSeatId: string|null }`, set
   by the DM from the realm dashboard ("the party is at …", "the party's home is …"); persisted like the other
   campaign fields (lifecycle paths per req 22a); never read by an engine stage.
2. THE OBSERVER: partyObserverOf(campaign, worldState) → the court's seat id, or null: the governing
   seat slot (GOVERNING_SEAT_KEY) of campaign.party.seatId when beliefsActive and that court holds a belief map;
   else of homeSeatId; else null (the map then shows the public truth or nothing; the basis is implied by this
   rule and never sent). Pure; total.
3. THE PARTY SET: in exportLensWindow (S2) for audience 'party', when beliefsActive and the observer resolves: for
   each subject with a belief record in the observer's slot, believed rows — `prosperity` (the believed band word
   where the belief axes carry one), `trend` (populationTrendBand → sign), the believed faith label, the believed
   strength band and alliance label, `scarcity`/`conditions` bands where lit — each row carrying
   `believed: { asOfWeek: lastUpdateTick; confidence: 0|1|2|3 }`, the confidence01 banded in QUARTERS (3 at
   ≥ 0.75, 2 at ≥ 0.5, 1 at ≥ 0.25, else 0 — file v's ruling), with `believed.integrity: 'clean'|'worn'|'planted'`
   where S6's register classifies the row's source; plus "heard of plague" rows from the observer's rumor
   ledger through settlementRumors' PLAYER projection (never the truth block). A subject with no record yields no
   row ('unknown' is never guessed as a value). Under perfect_delayed the rows are true but late: asOfWeek carries
   the lateness.
4. THE PARTY SEAT EACH ADVANCE: `LensFacts.partySeat?: string` and `LensFacts.observer?: string` (the court's
   seat; ABSENT when none resolved) on both sets, whatever the infoMode; the home seat travels as
   `CampaignFacts.homeSeat?: string` in the campaign facts (H31's windowed replace).
5. THE COURT VIEWPOINT (on request, DM-only): courtBeliefView(worldState, courtSeat) → the court's believed
   political facts over its subjects as `LensFacts.courts` rows `{ court; subject; allegiance?; strengthBand?:
   0|1|2|3|4; readiness?; faith?; believed: Believed; audience: 'dmOnly' }` (file v's shape), never mixed into the
   recorded polity window. The map draws it as "as
   {court} believes it, as of week n", DM-only unless the DM opens it; it never enters the map's canon.

THE DATA CONTRACT THE MAP EXPECTS
- `type Believed = { asOfWeek: Week; confidence: 0|1|2|3; integrity?: 'clean'|'worn'|'planted' }`; a party-set
  row: `{ seat; <believed value>; believed: Believed; audience: 'public' }` — believed marks draw "as of week n" and
  fade by band (M8); a believed row with no `asOfWeek` is refused at the map's fold.
- `LensFacts.partySeat?: string`, `LensFacts.observer?: string`, `CampaignFacts.homeSeat?: string`,
  `LensFacts.courts?: { court; subject; allegiance?; strengthBand?; readiness?; faith?; believed: Believed;
  audience }[]`; `beliefView(world, view)` for the DM (H17) and the court
  viewpoint's facts "through the port's presentation inputs only" (M50): never a recorded input.
- Nothing believed ever enters `PolityFacts` as recorded; a court viewpoint's rows are presentation.

ACCEPTANCE TESTS
- tests/domain/partyObserver.test.js: no party ⇒ observer absent and no party set; a party seat whose court holds no
  map ⇒ falls to home; omniscient ⇒ no believed rows and partySeat still present; totality on garbage.
- tests/domain/lensWindowExport.party.test.js (fixture tests/fixtures/belief-map-golden.json): every believed row's
  believed.asOfWeek is present and ≤ toWeek; believed.confidence is the quarter band of confidence01 (monotone); a
  subject absent from the observer's slot
  yields no row; the party set never contains a value the observer's record does not hold (a diff against the DM
  set proves no truth leaks); heard-of-plague rows come only from the player projection.
- tests/domain/courtBeliefView.test.js: a court with no belief map returns no courts rows, never the truth; every
  row carries believed with its asOfWeek.

WHAT NOT TO DO
- Never write a truth into a believed record (the cold start is the engine's own; this prompt adds no seeding).
- Never let partyObserverOf or the party set feed any engine read (settlementStrategy, the pact stage, the war
  chooser): K3 and the no-second-writer rule.
- Never send a believed row to the 'public' audience of the DM set; never send the truth block to the party.

RECORD: the packet rows; docs/CURRENT_STATE.md; the fold's §2 INFORMATION row (a consumer of the belief map on a
new surface). REPORT BACK: LensFacts.partySeat, LensFacts.observer, CampaignFacts.homeSeat, Believed (asOfWeek,
confidence 0–3, integrity), LensFacts.courts, courtBeliefView.
```

---

## Prompt S6 — The headline join

**Why.** The host's Herald is the DM's paper and always tells the truth; its causality popup marks every chain link
CLEAN, WORN IN THE TELLING or PLANTED, and is "summoned from ANY surface carrying a headline id-link" — but no map event
links to its headline, and nothing on the map carries the register (`research/experience/05` §1.4, §2.1 item 5). M7 and
M11 rule the join: `WorldEvent.causedBy` holds the host's receipt ids; a pin's "open the headline" calls the port's
`headlineOf(event)`; DM-side marks carry the integrity register where sent; the knowledge desk's events draw as DM-only
dated pins.

**Map-side counterpart:** M7, M11; V13 §2.2 (`WorldEvent.causedBy`, `audience`), §3.11.6 (`events`), §5.1 (the
events layer); §8.5 H9, H23; the fold's req 20.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet. Navigate by symbol. Depends on S2 (the events window exporter's seam).

GOAL: every dated event the host sends the map carries the receipt ids of its provenance; a map pin can open the
host's causality popup for one of them; DM-only events carry the integrity register; and the knowledge desk's
events reach the map as DM-only dated events.

THE H ROWS SERVED: H9 (the events window: committed facts, resolved audience) and H23 (the dated events each lens
reads), with the fold's requirement 20 ("every child receipt of a known outcome populates `causedBy` at its mint").
In your terms: the events window is a projection of wizardNews + pulseHistory + the provenance ledger; the popup
is the one you already have, opened over a new surface.

FELT SENTENCE: "I click the crossed blades on the map and read, in my paper's voice, why the raid happened — and
whether the tale that provoked it was planted." FIRST-VISIBLE: the first advance with a routed event. TIER:
aspatial-safe; the integrity arm reads persisted provenance only (the register's own law). DEGRADED ARM: a world
with no provenance ledger sends `causedBy: []` and the popup prints its "no deeper memory" line.

READ FIRST
- src/domain/region/wizardNews.js:80–118 (WizardNewsEntry: id, tick, kind, impactKind, settlementIds,
  sourceEventId, covert, region, audience, section), :923–941 (projectWizardNewsForAudience).
- src/domain/worldPulse/provenanceKernel.js:73, :127, :180, :275 (the provenance ledger: receiptId → parents);
  src/domain/worldPulse/worldState.js:788–790 (pulseIdFor: `world_pulse.<campaign>.<tick>`).
- src/domain/display/causeWalk.js:1–33 and :243 (buildCauseWalk; the secrets seam); src/domain/display/
  rumorHeraldLink.js:57, :110, :140 (the rumor → headline id join); src/components/map/CausalityPopup.jsx:1–45
  (the four tiers; PortablePopup; "summoned from ANY surface carrying a headline id-link").
- src/domain/display/heraldIntegrity.js:1–45 (the audit register outside the contamination fence), :45
  (INTEGRITY_STATES clean · worn · planted · planted_worn · unknown), :195 (classifyLinkIntegrity), :254
  (disclosureFor: null when seesSecrets is false).
- src/domain/realm/heraldRouting.js:74 (the seven desks), :416–417 (the knowledge desk's kinds: belief_misjudgment,
  false_accusation, lure_sprung, plant_took, sweep_launched).
- docs/DESIGN_FP_SPINE.md:467–520 (the truth law, the contamination fence, the portable popup, the manipulation
  disclosure); tests/lint/heraldContaminationFence.test.js; tests/ui/causalityPopup.test.jsx.

BUILD
1. THE EVENTS WINDOW EXPORTER (S2's third window, filled here): exportEventsWindow({ campaign, worldState,
   window, audience }) → WorldEvent[] from the window's committed wizardNews entries and pulse records: `kind` (the
   entry's impactKind or kind, by your closed vocabulary), `week: tick`, `where` (region → a settlement, else the
   entry's first settlementId; a border fight's `pair`), `audience` (covert | 'dm-only' | 'dm' → 'dmOnly'; else
   'public'), `causedBy: string[]` = the entry's own id, its sourceEventId, and the provenance ledger's parents of
   its receipt (req 20: populate at mint where a producer does not — a census of producers that mint without
   parents is the packet's first measurement), `sourceSeat`, `deity`, `cause`, `verdict` where the entry carries
   them, `detail`: the SUBHEADER sentence (plain, no voice), never the headline's gesture.
2. headlineOf: a READER the host registers with the map through the client (the map calls it with an event's
   `causedBy` receipt ids): resolve a receipt id (a wizardNews id, a sourceEventId or a pulse record id) to its
   Herald entry and open CausalityPopup over the current surface (the popup renders over the map exactly as over
   the dossier — zero navigation). An unresolvable id
   returns the honest line, never a dead link (the rumor-mill rule: "truthfully unlinked, never dead-linked").
3. THE INTEGRITY REGISTER: for every event in the DM set, `integrity: 'clean'|'worn'|'planted'` from
   classifyLinkIntegrity over the event's own chain link (the root link's state; your 'planted_worn' is sent as
   'planted' — your own popup shows both halves; your 'unknown' is the field ABSENT, never a word);
   never on a public row; never computed for a player audience (disclosureFor's null is the rule).
4. THE KNOWLEDGE DESK'S EVENTS: the five knowledge kinds reach the events window as `WorldEvent { kind; week;
   where: the seat where the plant took / the lure sprang / the sweep ran; audience: 'dmOnly'; causedBy }` — DM-only
   dated pins on the map; a player projection never sees them (projectWizardNewsForAudience's filter is the gate).

THE DATA CONTRACT THE MAP EXPECTS
- `WorldEvent { id; kind; at? | where?; pair?; verdict?; sourceSeat?; deity?; cause?; seats?; radiusM; week;
  window?; audience: 'public'|'dmOnly'|'local'; source: 'host'; factTier: 'dossier'; causedBy?: string[];
  integrity?: 'clean'|'worn'|'planted'; detail?: string }` — integrity DM-only; unknown is the field absent.
- `headlineOf(event)`: a reader the HOST registers with the map; the map's pin action calls it with the event's
  `causedBy` receipt ids; the map never composes prose from it.
- The map's `whatCaused` descends into `causedBy` naming the hops as the host's; its own reason chain is S9's.

ACCEPTANCE TESTS
- tests/domain/eventsWindowExport.test.js: every event has a `causedBy` array (empty allowed) whose ids all resolve
  by headlineOf or are listed as unresolvable with a reason; a public event never carries `integrity`; a covert
  entry never reaches a 'public' row; knowledge kinds are 'dmOnly'; the window is byte-identical to the entries it
  projects (no new state).
- tests/lint/heraldContaminationFence.test.js: unchanged and green — the exporter reads disinfo records only
  through heraldIntegrity (the audit register), never in a composer.
- tests/ui/causalityPopup.test.jsx: the popup opens from a map-pin summons with the same four tiers; seesSecrets
  false renders no disclosure.

WHAT NOT TO DO
- No new engine state, no new writer; never let a map reason or a map word into a Herald composer (the fence).
- Never attribute WORN to an author; never show PLANTED to a non-DM; never guess an integrity state.
- Never send a forecast or a proposal as an event (committed facts only, H9).

RECORD: the packet rows; the fold's §2 COUPLINGS row (causedBy adoption now has a consumer) and INFORMATION row.
REPORT BACK: WorldEvent.integrity (its three words; absent for unknown), headlineOf, the causedBy sources you
populate, the knowledge kinds you route.
```

---

## Prompt S7 — K3 at the map feed

**Why.** The map feed's crossing holders are truth sampled by the host at every hop; V13 never named K3, and if any
negotiation-side reader (the war volume lists "interceptor judgment") consumed the overlay, truth would enter by the
map's door (`research/experience/05` §2.1 item 3, §4 Q6). M12 adds a law line to V13 §3.11.6: the crossing holders and
every truth the feed carries are for the host's outcome and cost readers only, never a negotiation-side reader; the
host names its readers. This prompt names them, fences the rest, and pins it — before H4's client exists, so the client
is born inside the fence.

**Map-side counterpart:** M12; V13 §3.11.6 (`mapFeed` per-crossing holder, "a reading, never a gate"), §3.9 (13);
§8.5 H4 ("the client inside the host's own import scan for courts"), H16.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet (one packet; documents + one test). Navigate by symbol.

GOAL: name, in the war volume's K3 law and in code, which host modules may read the map feed's crossing-holder
overlay and any other truth the map feed carries (outcome and cost readers only), fence every negotiation-side
module out of it structurally, and prove the fence with the existing K3 idiom.

THE H ROWS SERVED: H16 ("the crossing holder … until adopted a map-feed reading only; patrol coverage re-priced
through its one distance reader, read by outcome rolls only, any route choice reading it through its belief (the
known world), and the crossing holder likewise") and H4 ("the client inside the host's own import scan for
courts"). In your terms: the world-port client joins the K3 pin set's forbidden imports for the negotiation
modules, and the overlay reader joins TRUE_STATE_TOKENS.

FELT SENTENCE (instrumentation — say so, req 19): none; this wave is a fence. FIRST-VISIBLE: n/a. TIER:
aspatial-safe. DEGRADED ARM: n/a (a lint).

READ FIRST
- docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md:48–53 (K3) and :248–262 (the pin set: envoyErrand.js,
  negotiationPictures.js, WR-8's feasibility composite, WR-10's appraiseSettlementAsset; peaceTerms.js outside;
  warDeployment.js the positive control); docs/DESIGN_FP_COHERENCE_FOLD.md §3.2.1 (the K3 breach as built in
  pactFormation's `backs`, and its repair car — chain C1's first) and §3.2.10 (d) re-ruled: "NO NEGOTIATION PATH
  MAY EVER READ TRUE WORLD STATE").
- tests/domain/envoyK3BeliefSeam.test.js:1–70 (the idiom: closed import lists, the token scan over comment-stripped
  source, the pure seam, guard-the-guard).
- The outcome and cost readers that read gates today, by symbol: src/domain/spatial/smuggle.js:164 and :287
  (isContraband, worstGate), src/domain/spatial/embattlement.js:156 (tollRateOf), src/domain/spatial/
  entrepots.js:163–192 (the toll reads), src/domain/spatial/navalLayer.js:520 (blockadeInterceptsSupply),
  src/domain/spatial/generosityEV.js:325 (routeRiskTerm's hostileGateOnRoute), src/domain/spatial/
  distanceRead.js:932 (gateAdjacency), src/domain/worldPulse/routeNetworkConsumersInterdiction.js, the supply
  kernel's interception read (supplyKernel.js, by symbol), src/domain/roads/state.js:390 (captureProbability) and
  its callers (roadsKernel.js:613–660, roads/embassyHazard.js:189).
- The negotiation-side set, by file: src/domain/worldPulse/envoyErrand.js, negotiationPictures.js,
  conquestFeasibility.js, sovereigntyAppraisal.js, pactFormation.js, peaceTermsAppraisal.js, the envoy stages.

BUILD
1. THE REGISTER (documents): under K3 in DESIGN_WAR_RULINGS_ARCHITECTURE.md §1b add a dated bracket: "[ADDED
   <date> — THE MAP FEED: the map module's crossing-holder overlay (its sway's holder per crossing, fetched at the
   advance head, at most one advance stale) and every truth its map feed carries are OUTCOME AND COST READINGS —
   readable by <the list above>, each behind its own switch with its tier line and degraded arm — and never by a
   negotiation path; a route CHOICE reads the holder only through the court's belief (knownWorld); the world-port
   client is a member of the K3 import pin's forbidden set.]" Mirror one line in the fold's vocabulary register
   (§5) under "border crossing / gate" and in DESIGN_FP_ARCH_WY.md's seam table where the overlay is named.
2. THE READER LIST IN CODE: src/domain/spatial/mapFeedReaders.js exporting MAP_FEED_READERS — the frozen list of
   module paths allowed to import the overlay reader (today empty of the client itself: the client is H4's; the
   list names the readers that WILL consume it, each with `switch`, `tier`, `degradedArm` strings, req 17).
3. THE FENCE: extend tests/domain/envoyK3BeliefSeam.test.js (or add tests/lint/worldPortK3Fence.test.js in the same
   idiom): TRUE_STATE_TOKENS gains 'mapFeed', 'crossingHolder', 'worldPortClient', 'swayOverlay'; the negotiation
   set's closed import lists refuse src/lib/worldPort/* and src/domain/spatial/mapFeedReaders.js; the positive
   control (warDeployment.js or a cost reader from the list) must contain the tokens once the client lands — until
   then the control is a fixture string with the tokens, named as a fixture so the scan cannot rot; the reader list
   is pinned: every module that imports the overlay reader is in MAP_FEED_READERS, and none is in the negotiation
   set (the two sets are disjoint by assertion).
4. The client, when H4 lands, is written INSIDE this fence: its only importers are MAP_FEED_READERS, the store and
   the UI.

THE DATA CONTRACT THE MAP EXPECTS
- `mapFeed(world, week, audience)` per crossing: `{ holder; status; stance? }` at the revision in force — "which
  the host may read as an advance-head overlay: fetched at the advance head, fixed for the whole advance and
  sampled from that baked table at each hop, at most one advance stale, stamped with swayRevision" — a reading,
  never a gate (V13 §3.9 (13)); `patrolOffer(world, revision)` likewise (S14).
- The map's law line (M12): "the crossing holders and every truth the feed carries are for the host's outcome and
  cost readers only, never a negotiation-side reader; the host names its readers" — your MAP_FEED_READERS is that
  naming.

ACCEPTANCE TESTS
- The extended K3 pin: red when any negotiation module imports the client or the reader list; red when the
  positive control loses its tokens; green at 81f1cd96 (no client yet).
- tests/lint/mapFeedReaders.walker.test.js: every reader row names a switch, a tier and a degraded arm; the list
  and the negotiation set are disjoint.

WHAT NOT TO DO
- Never add a negotiation-side reader "for now"; never let a route choice read the overlay directly.
- Never widen TRUE_STATE_TOKENS with a spelling the positive control does not carry (the scan would rot).

RECORD: the packet row; the K3 bracket; the fold's §5 register line; docs/FABLE_VALIDATION_QUEUE.md if an Opus
session judged the reader list. REPORT BACK: MAP_FEED_READERS' rows (module, switch, tier, degraded arm) and the
tokens you added.
```

---

## Prompt S8 — Net force bands once WC lands

**Why.** The sway's tie-break counts each member seat's own force band and each continuous member's `memberForce`
into the overlord's strength; WC's directive is that a vassal sends blocks "at the cost of reinforcing their own" (WC
§0.1). If the host's force band for the vassal is not net of its contribution, the same soldiers count at the vassal's
seat, in the overlord's `memberForce` and inside the overlord's field army — a double count the day WC-4 lands
(`research/experience/02` §2.3 item 5, §4 Q8). M17 rules that `memberForce` reads the host's force band net of blocks
already sent (`netForce` when the host sends one, else the band labelled gross).

**Map-side counterpart:** M17; V13 §2.2 (`PolitySeat.military`), §3.9 (10); §8.5 H13, H25; J384 (4).

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet (one now; a second with WC-4). Navigate by symbol. Depends on S2's polity window.

GOAL: the polity window's force band is sent with its basis — gross today — and, once the war-circulation
roster exists, as a NET band (the capacity facets net of blocks already sent), so the map never counts a vassal's
soldiers twice.

THE H ROWS SERVED: H13 ("its force band (its capacity facets bar the economy facet, renormalised on its existing
five floors) and garrison presence") and H25 (the sway asks). In your terms: deriveMilitaryCapacity's facets
banded on STRENGTH_BANDS, minus the blocks the contribution ledger says are away, labelled.

FELT SENTENCE: "when Aldmere sent its levy to Thornhold's war, its own border went soft on the map." FIRST-VISIBLE:
the polity window after the dispatch (one advance). TIER: aspatial-safe for the gross band; the net arm needs WC-1
(the arrival ledger) and WC-4 (the elected dispatch) — unbuilt at 81f1cd96 ("WC-1..WC-16 (no board row)", fold
§2). DEGRADED ARM: gross, labelled.

READ FIRST
- src/domain/worldPulse/militaryStrength.js:152–161 (deriveMilitaryCapacity: facets manpower, institutions,
  materiel, logistics, economy, will; hooks warExhaustion, warDrain, armyDeployed), :327 (militaryCapacityScalar).
- src/domain/worldPulse/warCapacityReads.js:56 (ARMY_DEPLOYED_CAPACITY_PENALTY — "home-defense points lost while
  the army is abroad": a deployed-army penalty exists today), :170 (buildCapacityLookup).
- src/domain/worldPulse/beliefMap.js:184–196 (strengthBandOf / STRENGTH_BANDS — the five floors the band uses).
- docs/DESIGN_FP_ARCH_WC.md §0.1 (:175–232, "at the cost of reinforcing their own"), :1165–1185 (recall_support:
  "blocks already serving return by the ordinary road (`depart` + `arrive_home`)"), §1.4 (the block roster),
  §1.17 (the coercion gradient — the occupied case).
- docs/PROGRESS.md J384 (4) as the map carries it: "MILITARY BANDS read the host's capacity facets manpower,
  institutions, materiel, logistics and will, renormalised, EXCLUDING the economy facet — so prosperity is counted
  once."

BUILD
1. NOW: `PolitySeat.military = { forceBand: 0..4; garrisonPresent: boolean; basis: 'gross' }` in the polity
   window exporter (S2): forceBand = the five facets bar economy, renormalised to 0..100 and banded by
   strengthBandOf's floors; garrisonPresent = a live garrison institution (the institutions facet's roster read).
   If you choose to apply today's armyDeployed hook, the basis word is still 'gross' (the map's word for "not net
   of blocks"): say in the packet which it is.
2. WITH WC-4: `netForce: 0..4` = the same band computed over the facets with the blocks the contribution ledger
   records as away subtracted from manpower (and materiel where the block carries it), `basis: 'net'`; the gross
   band kept beside it as `forceBand`. A recall returns the blocks to the band when they `arrive_home`, never at
   the recall.
3. The window's `changes` rows (optional, H13's per-tick capture) record a force-band change as `field: 'force'`
   dated to the dispatch tick.

THE DATA CONTRACT THE MAP EXPECTS
- `PolitySeat.military?: { forceBand: 0|1|2|3|4; garrisonPresent: boolean; netForce?: 0|1|2|3|4; basis:
  'gross'|'net' }` — "memberForce reads the host's force band net of blocks already sent (netForce when the host
  sends one, else the band labelled gross)" (M17); the legend prints the basis.
- A vassal's band never includes blocks already in the overlord's army; the overlord's own band never includes
  blocks received (they are the overlord's field army, not its seat's capacity) — the map adds memberForce itself.

ACCEPTANCE TESTS
- tests/domain/polityWindowExport.force.test.js: economy never enters the band (a settlement whose only change
  is economic keeps its band); the band is on STRENGTH_BANDS' floors; basis is 'gross' at 81f1cd96.
- With WC-4: a vassal with blocks away has netForce ≤ forceBand; blocks returned ⇒ netForce = forceBand; the sum
  over the pair never double counts (vassal net + blocks received by the overlord's army = vassal gross within one
  band).

WHAT NOT TO DO
- Never send a band without its basis; never fold economy into the band (prosperity is the sway's own term).
- Never compute memberForce host-side (the map's δ^depth sum is the map's).

RECORD: the packet row (the second packet joins WC-4's charter in the fold's §6 chain C2). REPORT BACK:
PolitySeat.military's fields, the basis words, the hook you applied today.
```

---

## Prompt S9 — The cause walk crosses the seam

**Why.** "Why is Kessar hungry?" is the host's question and "why is Kessar dry?" is the map's; the host's cause walk
and the map's reason records are each complete on their own side, and neither follows the other across the seam
(`research/experience/01` §2.3 item 6, §4 Q12). M7 rules that "why" crosses it: the port offers `reasonOf(world, fact |
where)` — the map's reason chain for any world word or world-caused dossier fact — to the host's cause walk, and the
map's `whatCaused` descends into the host's receipts naming them as the host's (S6).

**Map-side counterpart:** M7; V13 §4.7 (reason records), §3.11.6 (`reasonOf`, `physicalChange`, `consumed`); §8.5 H14,
H16 ("the canon's causes as receipt parents"), H34; the fold's requirement 7 and 20.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet. Navigate by symbol. Depends on H4's client (the port call) and S6's receipts.

GOAL: when the host's cause walk reaches a fact the WORLD caused — a terrain or access word derived from a charter
(H14), a physicalChange the host consumed at its tick head (H15), a land-cover or hazard reading it adopted (H34), a
route the map laid — its last hop asks the map's `reasonOf` and appends the map's reason chain as hops labelled the
world's, so one answer walks from the drought to the hunger.

THE H ROWS SERVED: H16 ("the canon's causes as receipt parents"), H14 (the charter-derived words) and H34 (the
readings). In your terms: a `source: 'world'` hop kind in the cause-walk read model, resolved through the port at
view time, never inside a tick.

FELT SENTENCE: "I clicked the famine and the walk ended on the rain shadow the map raised when I pushed the range
west." FIRST-VISIBLE: the first world-caused dossier fact (creation, for a charter-born member). TIER: spatial canon
(a bound world); the port call is view-time, so it is K3-safe and consumption-law-safe. DEGRADED ARM: no world bound,
or the client dark ⇒ the walk ends on the host's own root exactly as today.

READ FIRST
- src/domain/display/causeWalk.js:1–33 and :243 (buildCauseWalk: the provenance DAG walked backward; the secrets
  seam; NO_DEEPER_MEMORY, LEDGER_DARK_LINE); src/components/map/CauseWalkPanel.jsx; src/domain/worldPulse/
  provenanceKernel.js:73–127 (the ledger; receiptId → parents), :275 (recordProvenanceLedger).
- src/domain/explanation.js:1–30 and :1131 (explainEntity — the dossier's "why does this exist?" envelope; its
  world-facts entries will carry the "follows from the world" line).
- src/domain/edit/fieldDeclarations.js:160–164 (the world-fact declarations: terrain, culture, monsterThreat,
  stressors, resources — `provenance: 'world-fact'`, outputKey config.terrainType …): a charter-born terrain word
  is such a root with a WORLD provenance.
- docs/DESIGN_FP_SPINE.md requirement 7 (the cause walk "walks backward link by named link") and :405–430 (the two
  registers: the TABLE beneath both is the ground truth); docs/DESIGN_FP_COHERENCE_FOLD.md §1 req 20.

BUILD
1. THE WORLD ROOT: a receipt whose cause is a world fact records, at its mint, a parent id of the form
   `world:<kind>:<ref>` — `world:charter:<hostKey>` for a charter-born member's terrain/access words (S4 stamps it on
   the member's generation receipt), `world:edit:<editId>` for a consumed physicalChange (the `consumed` message
   names the edit ids; H15), `world:reading:<hostKey>:<field>` for an adopted reading (H34), `world:route:<hostKey>`
   for a laid route. These are parents in `causedBy`, never prose.
2. THE HOP: buildCauseWalk, on reaching a `world:` parent, calls the map's `reasonOf(world, { kind, ref }, audience)`
   (audience 'dm' when seesSecrets, else 'public') through
   the client and appends the returned chain as hops `{ receiptId: 'world:…', headline: the map's sentence AS SENT,
   tick: its week, parents: [], source: 'world', redacted: false }`; the panel labels them "the world's reason"; a
   DM-only reason (the map marks its own) is redacted for seesSecrets false exactly as a covert hop is. The call is
   memoized per (ref, week) for the panel's life; a client that is dark or refuses yields the root line
   NO_DEEPER_MEMORY plus "(the world's reason is not reachable)".
3. THE DOSSIER LINE: explainEntity's envelope for a world-fact root adds `followsFrom: 'world'` and the panel's
   provenance line "follows from the world — open the world's reason" that opens the same hop.

THE DATA CONTRACT THE MAP EXPECTS
- `reasonOf(world, subject: { kind: 'charter'|'edit'|'reading'|'route'; ref: string /* the member's host key; a
  consumed edit's id; a host key and a field (`hostKey:field`); a route's host key */ } | WorldWhere, audience:
  'dm'|'public')` → `{ chain: { week: Week; sentence: string /* whatCaused's tree flattened in walk order, each hop
  rendered for `audience` — a withheld input "something you cannot see" */; audience: 'dm'|'public'; reason: Id }[] }`
  (file v item 1091 as the manager ruled it: the flat chain, the MAP's feed function the host's cause walk calls),
  one level into a host event (its receipts named as the host's, not rendered); e.g. "arid at 180 mm/yr in the
  Greyspine's shadow". A host key is a `subject`, never a `where`; `where` is a `WorldWhere`. The map composes no
  Herald prose and the host prints the sentence as sent, in the TABLE register only.
- `consumed(world, editIds)` (H15) is what makes a world edit's id a lawful parent.

ACCEPTANCE TESTS
- tests/domain/causeWalk.test.js: a walk with no `world:` parent is byte-identical to today; a `world:` parent with
  a mocked client yields hops with source 'world' in the chain's order, redacted when seesSecrets is false and the
  map marked the reason DM-only; a dark client yields the honest line and no throw.
- tests/lint/heraldContaminationFence.test.js: green — no composer imports the client or reads a world hop.
- A pin that the client is called only from display code (an import-source scan: src/domain/worldPulse/* never
  imports the reasonOf seam).

WHAT NOT TO DO
- Never call the port inside a tick or from an engine stage (the consumption law); never persist a map reason.
- Never compose a headline or a telling from a world hop (the Herald's registers are its own).

RECORD: the packet row; the fold's §2 COUPLINGS row (CW-2x's cause walk gains a world root kind). REPORT BACK:
the `world:` parent forms you mint, reasonOf's argument shapes, the hop fields.
```

---

## Prompt S10 — Grievances and licences in the claims lane; the pairs' treaty terms

**Why.** The claim outline already draws the host's lineage claims as DM-only outlines; R2's vengeance licence and S's
sold-town grievance are durable, dated, pairwise host facts of exactly that class, and drawing them costs no new host
fact (`research/experience/02` §4 Q9). M20 rules that vengeance licences and sold-town grievances draw as DM-only
claim outlines in the claims lane where the host sends them as dated pairwise facts.

**Map-side counterpart:** M20, M13; V13 §2.2 (`PolityFacts.claims`, `PolityRelation.terms`), §3.9 (8) (the class table
reads a live non-aggression term as neutral and a live mutual-defence term as respect), (12) (a claim outline moves no
cell); §8.5 H13, H45.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet (one packet). Navigate by symbol. Depends on S2's polity window.

GOAL: the polity window's `claims` rows carry three kinds of dated pairwise standing — a lineage claim, a vengeance
licence and a sold-town grievance — each with its since-week and, where it has one, its expiry, DM-only, retracted
when the host's record is consumed, extinguished, pruned or decayed; and each pair's live peacetime treaty terms
travel on its relation row (`PolityRelation.terms`, H45).

THE H ROWS SERVED: H13 ("its standing claims of one seat on another (its lineage claims, while that lane is lit)") and
H45 (file w: "each pair's live non-aggression and mutual-defence terms with their since-weeks and whether its
simulation enforces them (`PolityRelation.terms`), so the class table reads a sworn peace as neutral and a sworn
defence as respect"). In your terms: four existing ledgers projected into two row shapes; no new state.

FELT SENTENCE: "a dashed line from Thornhold to the city that burned it, until the debt is paid or the heir gives it
up." FIRST-VISIBLE: the window after a razing or a sale (one advance). TIER: each lane's own — `conquestDoctrineEnabled`
(the licence; the full WR-8 conjunction in conquestDoctrineStage), `sovereigntyTradeEnabled` (the grievance),
`lineageClaimEnabled` (the claim) — all dark at 81f1cd96; the terms ride `pactFormationEnabled` (lit in four
presets, the default included). DEGRADED ARM: no rows.

READ FIRST
- src/domain/worldPulse/vengeanceLicense.js:1–70 (the licence: holder, razer, victim, heldSince; the five lifecycle
  paths; the closed loop), :88–96 (EXPIRY_YEARS 60), :134 (vengeanceLicensesActive), :220 (readVengeanceLicenses —
  validating), :345 (mintVengeanceLicenses), :413 (consume), :440 (extinguish), :471 (prune).
- src/domain/worldPulse/sovereigntyTransfer.js:129–137 and :283–288 ("THE GRIEVANCE IS FUEL, NOT A RECORD": the
  sale's resentment rides the sold town's edge to its seller and the reasons layer's grievance scorer reads it
  directly), :160 (accrueSaleGrievance), :309–313 (the `sold_settlement_grievance` news SEED — `assetId`, `fromId`,
  `toId`, `tick` — the receipt the row is derived from) and src/domain/worldPulse/grievanceRead.js:27–37, :56, :101
  (GRIEVANCE_READ_TUNING with REVANCHISM_RESENTMENT_FLOOR 0.2, scoreGrievanceLean, grievanceLean — the scorer).
- src/domain/worldPulse/pactFormation.js:203–204 (the security terms a pact may carry: `non_aggression`,
  `mutual_defense`), src/domain/worldPulse/pactAmendment.js:90 (COMPOSABLE_SECURITY_PAIR),
  src/domain/worldPulse/peaceTermsCatalog.js:193 (`non_aggression`'s row: family security, executor war_block) and
  src/domain/worldPulse/treatyEnforcement.js:57 (treatyLedgerOf — the ledger the terms are read from; by symbol);
  the fold's §2 GRAMMAR row (`mutual_defense` owed: `mutualDefenseFor` has no caller at 81f1cd96).
- src/domain/worldPulse/lineageClaim.js:442 (lineageClaimActive), :387 (scoreLineageClaim), :124 (parentRefOf).
- docs/DESIGN_REALM_DIRECTIVES.md R2 (:1155–1180: "a license held by every settlement whose relationship to the
  VICTIM stands at or above the adequacy band … executed ONCE") and S (:1227–1260: the sovereignty market).

BUILD
1. In the polity window exporter (S2): `claims: { by; target; kind: 'lineage'|'vengeance'|'grievance'; since: Week;
   expires?: Week; audience: 'dmOnly' }[]` — lineage: parent → child or the reverse where lineageClaimActive, since
   the claim's standing tick; vengeance: for each live licence from readVengeanceLicenses, `by: holder, target:
   razer, since: heldSince, expires: heldSince + EXPIRY_TICKS`; grievance: derived from the SALE'S RECEIPT (the
   `sold_settlement_grievance` seed's `tick`, `assetId`, `fromId` — there is no grievance record: the wound is fuel
   on the edge), `by: assetId (the sold town), target: fromId (the seller), since: the seed's tick`, and DROPPED
   when the edge's resentment falls below the grievance scorer's floor (grievanceRead.js:101's read; the
   REVANCHISM_RESENTMENT_FLOOR of :33) — a windowed replace, never a stored countdown.
2. Retraction is the windowed replace: a licence consumed, extinguished or pruned simply leaves the next window.
3. THE TERMS (H45): for each pair holding a live pact of the peacetime families (the security terms
   `non_aggression` and `mutual_defense` in the pact ledger, treatyLedgerOf by symbol; `mutualDefenseFor` has no
   caller at 81f1cd96 — the fold's §2.1 "the allies came"), a `PolityRelation.terms[]` row `{ kind:
   'nonAggression'|'mutualDefence'|string; since: Week /* the signing tick */; enforced?: boolean /* false while no
   engine stage reads the term */ }` on the pair's relation row of the polity window; a lapsed or broken pact leaves
   the next window.

THE DATA CONTRACT THE MAP EXPECTS
- `PolityFacts.claims` rows as above — "DM-only claim outlines in the claims lane where the host sends them as dated
  pairwise facts" (M20); a claim outline "moves no cell" (V13 §3.9 (12)); the map draws `expires` as the outline's
  fade week.
- `PolityRelation.terms?: { kind: 'nonAggression'|'mutualDefence'|string; since: Week; enforced?: boolean }[]` (file w
  item 1145 (c)): the class table reads a live non-aggression term as neutral and a live mutual-defence term as
  respect (M13); "a pair at war under a non-aggression term is at war" (item 1160); `enforced` absent or false ⇒ the
  legend notes the treaty is drawn as sworn.

ACCEPTANCE TESTS
- tests/domain/polityWindowExport.claims.test.js: a minted licence ⇒ one row with its expiry; consumed ⇒ absent in
  the next window; a forged licence (fails validateVengeanceLicense) ⇒ no row; a sale ⇒ a grievance row derived
  from the seed that leaves when the edge's resentment falls below the scorer's floor; every row audience 'dmOnly';
  all three lanes dark ⇒ `claims: []` and the window byte-identical to S2's.
- tests/domain/polityWindowExport.terms.test.js: a signed non-aggression pact ⇒ one `terms` row with `enforced`
  false; its lapse ⇒ absent; a pair at war keeps its row and `atWar` true.

WHAT NOT TO DO
- Never mint, consume or re-derive a licence here (the module's own ceiling, vengeanceLicense.js:24–30).
- Never send a claim public; never send a claim as a link or a relation.

RECORD: the packet row. REPORT BACK: the three claim kind words, since, expires, audience; PolityRelation.terms'
kind words and `enforced`.
```

---

## Prompt S11 — The ambiguity law amended

**Why.** WY §3b binds the canvas: "A marker is a presence, never an intention. No direction arrows, no destination
lines, no path highlights, no heading flips, no destination/ETA/purpose in canvas tooltips." The map's plague approach
ring ("the weeks to onset"), its hop links and its columns "toward their arrival" are DATED FACTS the host computed, not
a mover's intention — and one of the two documents must yield, in writing (`research/experience/03` §2.4 item 1, §4 Q3).
M23 splits mover markers (the host's ambiguity law) from dated facts the host computed, which may carry their weeks on
any surface; the approach ring is a dated fact; a column draws at its leg's fraction with no destination drawn and its
arrival captioned only as the host's dated fact; "likely road" flows are DM-only and labelled.

**Map-side counterpart:** M23, M24; V13 §5.8 (5) (split by seat v), §5.9 (1) approach and hop, (5) columns; §8.5 H17
(`hostOverlay`: "no destination and no arrival time"), H23.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet (documents; one anchored test note). Navigate by symbol.

GOAL: amend WY §3b with a dated bracket that keeps the ambiguity law for MOVER MARKERS on every surface, the map
module's included, and lets DATED FACTS the host computed carry their weeks on any surface as the host's dated fact.

THE H ROWS SERVED: H17 ("hostOverlay (movers on host edges by fraction and embattlement phases, projected by the
host for the audience before sending, with no destination and no arrival time)") and H23 (the dated events each
lens reads — "plague arrivals … column departures and arrivals … the week each took effect"). In your terms: the
law's object is the MARKER; a receipt's week is not a marker.

FELT SENTENCE (a law, not a mechanism — say so): the DM reads "arrived week 14" on a plague's hop and never sees an
arrow on a column. FIRST-VISIBLE: n/a. TIER: n/a. DEGRADED ARM: n/a.

READ FIRST
- docs/DESIGN_FP_ARCH_WY.md:763–781 (§3b, pinned; the WY-0 deletions; the anchored-negative enforcement: "no
  polygon/arrow/marker-end in the wayfare group; no destination string in a canvas <title>"), :57 (Q3: the
  deployment arrows deleted under the law), and the header's status line: WY-0 "never happened" — there is no
  wayfare canvas at 81f1cd96, so the amendment is documents and a test note.
- docs/DESIGN_FP_COHERENCE_FOLD.md §5 (the vocabulary register) and §1 req 22 (b): an erratum lands as a dated
  bracket in the same commit as the ruling.
- src/domain/spatial/pestilence.js:259–269 (arrivedTick, incubateUntil — the onset week IS a host-computed dated
  fact); src/domain/spatial/migration.js:572–616 (a column's arrivalTick is set at dispatch: a dated fact).

BUILD
1. Under §3b add: "[AMENDED <date> (the map module's experience pass, M23) — THE OBJECT OF THE LAW IS THE MOVER
   MARKER. A marker (an army, a column, a caravan, a named traveller) is a presence, never an intention, on every
   surface — the realm map, the map module's world view and its lenses included: no arrow, no destination line, no
   path highlight, no heading, no ETA in a canvas tooltip. A DATED FACT the host computed — an arrival week
   (`arrivalTick`), an onset week (`incubateUntil`), a hop's weeks, a column's dispatch and arrival weeks, a plague's
   `plague_arrival` — is a receipt, not a marker, and may carry its week on any surface, captioned as the host's dated
   fact ("arrived week n"; "word of plague has reached: onset in n weeks"), never as a destination the mover intends.
   A column draws at its leg's fraction with no destination drawn; its arrival is captioned only as the dated fact.
   A 'likely road' laid by the map under a column is a DM-only presentation and is labelled so. The anchored
   negatives bind the wayfare group's MARKERS; a caption of a dated fact is exempt by class, never by string.]"
2. Add the same split to the fold's §5 register under "marker" (presence) and "dated fact" (receipt), and a line
   to WY's §9 sentences: "the plague reached Kessar in week 14 (a receipt), the column is on the road (a marker)".
3. In the WY-0 test note (the enforcement paragraph), state that the anchored negative on `<title>` strings is
   scoped to marker elements, so a dated-fact caption class does not red it when the canvas lands.

THE DATA CONTRACT THE MAP EXPECTS
- `hostOverlay(world, view)`: movers by fraction, no destination, no arrival time (unchanged).
- `LensFacts.columns[].departWeek / arriveWeek`, `LensFacts.plague[].arrivedWeek / onsetWeek / clearWeek`,
  `WorldEvent.week`: dated facts the map captions as the host's; "a column draws at its leg's fraction with no
  destination drawn and its arrival captioned only as the host's dated fact" (M23).
- `LensFacts.columns[].cargo?: { faith?: string; plague?: boolean }` — a column's cargo the host sends (WY-4's faith
  cargo; pg-1's `plagueTouched`) is drawn as the host's fact; the map's refusal "migrants drawn carrying a faith or
  a plague" is gated "where the host's lane is dark" (M24).

ACCEPTANCE: a documents change — the brackets present; the register rows present; no code moves (a byte-identical
tree outside docs/). WHAT NOT TO DO: never delete the law's text; never admit an ETA on a marker's tooltip.

RECORD: the bracket itself is the record (req 22 (b)); a line in docs/HANDOFF_CURRENT.md on the ledger branch.
REPORT BACK: the bracket's wording as landed.
```

---

## Prompt S12 — The draft's dossier update, and H24's two asks

**Why.** The map's conflict list promises a draft's "Update the dossier" as "a plain edit, which re-rolls the
settlement" under its same-seed law (V13 §8.5 H32); the host's own edit law says a world fact "NEVER re-rolls — it
re-derives the computed facts with every chosen fact pinned", and §22 records that re-derivation now runs over the 63-row
corpus (`research/experience/04` Act 7, §4 Q2). M33 rules the host's law: "Update the dossier" on a draft RE-DERIVES with
every chosen fact pinned, never re-rolls; `hostEffect` gains `rederive`, the host's effect word shown as sent. With it,
H24's two asks restated: an arrived plague changes the town at arrival (M29 meanwhile), and a crisis is served as columns
or netted transfers, never both.

**Map-side counterpart:** M33, M29; V13 §3.11.5 (1), §3.11.6 (`requestDossierUpdate`, `dossierUpdated`,
`campaignFacts.phase`), §5.9 (1) (the condition gap), (5); §8.5 H24, H32.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY train (three packets: the dossier-update handler, the arrived plague's condition, the
one-service fence). Navigate by symbol. Depends on H31/H32's seam (campaignFacts and the request message) and the
EM re-derivation family.

GOAL: a map-side `requestDossierUpdate` is carried out by the host's own world-fact command — on a DRAFT a pinned
re-derivation and three-way merge, never a re-roll; on a canonized town a decree at the next advance (`landChanged`)
or the retcon path (`alwaysSo`) — confirmed with the effect word; and the plague and migration lanes stop telling
the map two stories: an arrived plague writes its condition at arrival, and one crisis is served once.

THE H ROWS SERVED: H32 ("requestDossierUpdate received as a guard-and-override entry on its world-fact card … the
change applied by the host's own command in the kind asked … dossierUpdated sent with applied and its sequence") and
H24 ("an arrived plague writing its condition where it lands (the condition gap closed), with its condition loop
capped as its famine loop is; … each crisis served as netted transfers or as columns, never both"). In your terms:
the fifth card's op through `rederive` + `mergeConsequence`; a condition promotion at the materialization; WY-4's
fence at the candidate seam.

FELT SENTENCE: "I let the map move my draft town onto the coast; it kept its harbour master and its history and
its food card said what a port says." FIRST-VISIBLE: the confirmation (creation-time, a draft); the next advance (a
canonized town). TIER: aspatial-safe for the edit; spatial canon for the plague and column arms. DEGRADED ARM: a
request on a settlement with no world binding is refused with `applied: false` and a reason.

READ FIRST
- docs/DESIGN_EDIT_MODE_AND_DECREES.md §14 (:188–214: "a change NEVER re-rolls — it re-derives the computed facts
  with every chosen fact pinned"; "Canon stays events"), §2.6 (:51, the canon rule), §22 (:358–384: HELD FACTS ARE
  FINAL), §22.1 (:385–402: "THE CONSEQUENCE OF AN EDIT IS THE DIFFERENCE BETWEEN TWO RE-DERIVATIONS"; the eight edits
  run, terrain → desert RUNS), §22.2 (:403–426: the consistency group; the chain is the semantics), §22.3.
- src/domain/edit/dmLayer.js:55–75 (the layer), :594–661 (a world-fact root routed to config′), :911 (rederive);
  src/domain/edit/mergeConsequence.js:277 (mergeConsequence(record, R0, R1)), :231 (guardMergedRecord);
  src/domain/edit/recordInvariants.js:377; src/domain/edit/fieldDeclarations.js:160–164 (the world-fact card's
  declarations; `terrain` → config.terrainType).
- src/domain/spatial/pestilence.js:1–66 (one plague truth; the front; onset), :259–269 (the record), :406
  (advancePestilence); src/domain/worldPulse/pestilenceKernel.js:122, :228–258 (the materialization mints the
  disease_outbreak stressor and its news, :279–298 `plague_arrival`); src/domain/conditionPromotion.js:1–30 (the
  stressor → condition promotion DM authoring already gets; archetype 'plague' at :29).
- src/domain/worldPulse/candidateEvents.js:599–605 (deriveFlowCandidates under migrationFlowsEnabled — the
  stressor refugee flow, same-tick) and src/domain/worldPulse/flows.js:173; src/domain/spatial/migration.js:1–60
  (M4: the origin-loss-proxy reconciliation "we NEVER apply abs*0.45 under spatial"), :362 (planMigration), :435
  (the conservation invariant), :572–616; src/domain/worldPulse/demographicsMigration.js:378.
- research notes you do not have: the map's reading that "the stressor refugee flow (P-5) still teleports beside
  the columns, so one famine can be served both ways" — verify it by execution on a canonized fixture first.

BUILD
1. THE HANDLER (packet 1): a store action receiving `requestDossierUpdate { settlement: hostKey; field; from; to;
   kind: 'landChanged'|'alwaysSo'; conflict; approvedBy: 'user'; week }`: on a DRAFT, the world-fact op for `field`
   (terrain, resources …) with `to` as the layer's value → `rederive` R0/R1 → `mergeConsequence` → the guard; the
   delta card shows the readings that moved; on a CANONIZED town, `landChanged` lands a decree applied at the next
   advance's tick (the §2.6 canon rule; a chronicle line in the herald's voice), `alwaysSo` the retcon path where the
   card admits one, else refused with the reason. A field the fifth card does not declare is refused. Then send
   `dossierUpdated { request; applied; hostSeq; kind; hostEffect: 'rederive'|'decreeAtNextAdvance'|'retcon'|
   'reroll'|'unknown' }` (the map's enumeration) — 'reroll' is the legacy word an older path sends only while it
   still re-rolls, never this handler; 'unknown' when the host cannot say. The host's own undo of
   the edit sends `dossierUpdated { applied: false }`.
2. THE PREVIEW WORDS (H32's exposure): per settlement in `campaignFacts`, beside `phase`, `editLaw: { effect:
   'rederive'|'reroll' /* what an updateDossier does there under your law in force: 'rederive' once packet 1 lands,
   'reroll' only while an older path still re-rolls */; warning?: string /* your own warning for that path, as
   written here: draft — "its computed facts re-derived with every chosen fact pinned; its people, trades and
   history kept"; canonized — "a decree at the next advance" */; exposure?: { economy: boolean; food: boolean } /*
   from a dry run of R1: the readings that would move */ }` (file w's `SettlementFacts.editLaw`), so the map's
   preview reads the effect word before the request and says whether the economy or the food feel it.
3. THE ARRIVED PLAGUE (packet 2): at the front's materialization (pestilenceKernel :233–258), promote the minted
   stressor to its `plague` condition in the same tick through conditionPromotion (the archetype rule at :29),
   capped as the famine condition loop is; emit the arrival event with `sourceSeat` (mat.sourceId), `arrivedWeek`
   (arrivedTick) and `onsetWeek` (incubateUntil); a settlement missing from the digest reads "no spatial delay
   known" (H24), never one week.
4. THE ONE-SERVICE FENCE (packet 3): on the canon (migrationActive), a source that dispatched a column this tick
   produces no `flow_migration` candidate for the same crisis (deriveFlowCandidates filtered at the
   candidateEvents seam, :599–605), and the reverse off the canon; the conservation invariant (Σ arrivals +
   deaths = departures) holds per dispatch; a declared shift for lit worlds, byte-identical dark.

THE DATA CONTRACT THE MAP EXPECTS
- `dossierUpdated { request: Id; applied: boolean; hostSeq; kind; hostEffect: 'rederive'|'decreeAtNextAdvance'|
  'retcon'|'reroll'|'unknown' }` — "`hostEffect` gains `rederive`,
  the host's effect word shown as sent; the preview reads 'its computed facts re-derived; its people, trades and
  history kept'" (M33); until it arrives the map holds W_DOSSIER_PENDING and refuses a second request on the seat.
- `SettlementFacts.phase: 'draft'|'canonized'` and `SettlementFacts.editLaw?: { effect: 'rederive'|'reroll';
  warning?: string; exposure?: { economy: boolean; food: boolean } }` (H32; file w): the preview's `hostEffect`
  reads `phase` and `editLaw.effect`, and its "would the economy or food feel it" reads `editLaw.exposure`.
- `LensFacts.plague[]` rows with `source`, `arrivedWeek`, `onsetWeek`; the map captions an arrived, unresolved
  plague "arrived; the town's record follows at resolution" (M29) until packet 2 lands, then drops the caption.
- `LensFacts.transfers` and `LensFacts.columns` never describe one shed twice.

ACCEPTANCE TESTS
- tests/domain/dossierUpdateHandler.test.js: the 63-row corpus — no-edit identity 63/63; terrain → desert on a
  draft runs with no throw, the roster held, hostEffect 'rederive'; a canonized town's request answers
  'decreeAtNextAdvance' and lands the decree at
  the next tick and nothing this week; an undeclared field is refused; applied:false on undo.
- tests/domain/pestilenceKernel.test.js: a materialization writes the plague condition in the same tick with its
  cap; the arrival event carries sourceSeat and the two weeks.
- tests/domain/migrationOneService.test.js: on a canonized fixture a crisis shed yields columns and zero flow
  candidates for that source and tick; off the canon the reverse; conservation holds.

WHAT NOT TO DO
- Never re-roll a draft from the map's request (the host's own §14); never write a dossier fact from the map's side
  (the one-way rule: the map sends a request, the host's command carries it).
- Never mint a second plague system (pestilence.js's first law); never let a condition write bypass promotion.
- Never serve a crisis twice on the canon; never drop the aspatial lane off the canon.

RECORD: the packet rows (a train); shift records for packets 2 and 3; the fold's §2 POPULATIONS and PG rows.
REPORT BACK: hostEffect's five words as sent, SettlementFacts.editLaw (effect, warning, exposure), the arrival
event's fields.
```

---

## Prompt S13 — The raid's outcome word and the hearing week

**Why.** The default preset's most frequent political beat is the drift raid, and its pin is its least satisfying:
"crossed blades, and no one can say who won — neither the map (by design) nor the host (it never computed it)"
(`research/experience/02` Week 14, §4 Q3). J384 (5) rules a drift raid is not a verdict until the host sends an outcome
word (H25); the fold's engagement registry already names `raid` with the vocabulary `repelled · succeeds · bought_off`,
owned by the war volume, landing with SP-9 — and under the owner's hearing week the DM may tilt or decide it.

**Map-side counterpart:** M15, M16; V13 §3.9 (11) ("once the host sends a raid's outcome word, that raid is a
verdict — its winner +1 at the victim's facing segments"); §8.5 H25; the fold's req 24 (SP-9).

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet (two: the outcome word now; the registry row with SP-9). Navigate by symbol.

GOAL: every drift raid resolves to one of three outcome words by the host's own comparator, sent to the map as the
event's verdict with its place; and the raid is registered as a CLIMAX engagement so that, under the hearing week,
a one-week advance lets the DM tilt or decide it before it resolves.

THE H ROW SERVED: H25 ("a raid's outcome word and, where known, its place (or its pair, placed by borderSegment) —
the word that makes a raid a verdict; its strength order in the polity window; tier changes as dated facts"). In
your terms: `hostile_raid` gains an outcome from the same state-decided comparator that picks the aggressor, and
the `raid` row of the engagement registry (fold §3.4) gets its producer.

FELT SENTENCE: "the raid on Thornhold was repelled — and because I advanced week by week, I was asked first."
FIRST-VISIBLE: the raid's headline at its landing (every week it fires); under the hearing week, the pending card.
TIER: aspatial-safe (the raid rule runs in every preset but SC); the hearing arm needs `hearingWeekEnabled` (SP-9,
unbuilt at 81f1cd96: no `registerEngagementKind`, no pending ledger — verify by grep) and the premium gate. DEGRADED
ARM: the word is minted and the raid resolves in its tick as today.

READ FIRST
- src/domain/worldPulse/relationshipRulesAdversarial.js:272–311 (the raid: the aggressor is the stronger side by
  STATE via settlementStrength; a tie forks on pair identity + tick; resentment +0.035, fear +0.04, a war_pressure
  condition on the victim; metadata incidentType 'raid', aggressorSaveId, victimSaveId — and no outcome).
- src/domain/realm/heraldRouting.js:95 (hostile_raid → the war desk); src/domain/display/engagementNarrative.js:69.
- docs/DESIGN_FP_COHERENCE_FOLD.md §1 req 24 (:160–256: the held docket, tilt, verdict; a month or longer resolves
  on the engine default; the seal is the verdict's `causedBy` parent), §3.4 (:353–391: the `raid` row — "the war
  volume (border incidents) · the raid's landing · repelled · succeeds · bought_off · CLIMAX"; ruling (2): the first
  lit rows), §4 (the planting line); docs/DESIGN_FP_ARCH_SP.md:14 (SP-9's charter: `registerEngagementKind`, the
  pending ledger `spatialLedgers.pendingEngagements`, the hearing seal, zero lines in pulseKernel.js).
- src/domain/worldPulse/beliefMap.js:184–196 (strengthBandOf — the five floors the strength order uses).

BUILD
1. THE WORD (packet 1): at the raid's landing compute `outcome` by the host's own comparator: the aggressor's
   strength against the victim's strength × its defence read (the defense ledger's military score), on a seeded fork
   `raid.outcome.<pair>.<tick>`: `succeeds` when the aggressor leads by the raid margin, `repelled` when the victim
   does, `bought_off` in the band between where the victim's prosperity rung is at or above the aggressor's (the
   payer buys the raider off) — a closed three-word vocabulary, banded, UNMEASURED until the soak signs it (req
   18). Write it to the candidate's metadata (`outcome`), the news entry's `reasons` and the Herald headline (the
   HEADLINE register: one gesture), and send it as `WorldEvent.verdict` with `where: { kind: 'settlement', seat:
   victim }`, `pair: [aggressor, victim]`. The map's verdict table (file w item 1162) reads the aggressor as the
   winner for `succeeds`, the victim for `repelled`, and nobody — no band moved — for `bought_off`.
2. THE STRENGTH ORDER (the same packet): `PolitySeat.strengthBand` = settlementStrength banded on STRENGTH_BANDS in
   every window (H13/H25: "the comparator its relationship drift reads to choose a raider and an overlord"), and
   tier changes as dated `changes` rows (`field: 'tier'`); say whether a promotion writes the save's tier label.
3. THE HEARING (packet 2, with SP-9): register `raid` through `registerEngagementKind` as CLIMAX with the three
   words; under `hearingWeekEnabled` at a one-week advance the raid is written to the held docket with its default
   word and resolves at the next advance from the seal or the default; the pending card is the FIRST-VISIBLE sign
   ("<aggressor> raids <victim> at <place>; the engine's verdict: repelled") under the Evidence Law; the seal event
   is the verdict's `causedBy` parent. Month, season and year advances resolve on the default without stopping.

THE DATA CONTRACT THE MAP EXPECTS
- `WorldEvent { kind: 'raid'; verdict: 'repelled'|'succeeds'|'bought_off'; where: the victim; pair; week; causedBy;
  audience }` — the map marks the victim's facing segments fighting and, with the word, credits the winner +1
  by its verdict table (file w item 1162: the aggressor for `succeeds`, the victim for `repelled`, nobody and no
  band for `bought_off`); "whyCell names the strength-band change,
  never the raids, when a season of raids has moved the band" (M16) — so send the band's own dated change too.
- `PolitySeat.strengthBand: 0..4` every window; `PolitySeat.changes[]` with `field: 'tier'|'strength'`.

ACCEPTANCE TESTS
- tests/domain/relationshipRulesAdversarial.test.js: every hostile_raid candidate carries exactly one of the three
  words; the word is deterministic for (pair, tick); the aggressor is unchanged from today's rule; a pin that the
  raid's bytes outside `outcome`/`reasons` are unchanged (a declared shift when the headline changes).
- With SP-9: the registry closure pin lists `raid`; under hearingWeekEnabled a raid at a one-week advance resolves
  one tick later from the docket; dark, byte-identical to today.

WHAT NOT TO DO
- Never let the map's sway or borderSegment decide the word (the map never decides a war — J384 (3), (5)).
- Never park the cursor for a hearing (fold §1 req 24 (b)); never edit pulseKernel.js for it (SP-9's own rule).

RECORD: the packet rows; a shift record (the headline changes); the fold's §3.4 row's owner column names the
producer. REPORT BACK: the three words and their bands, strengthBand, the changes fields.
```

---

## Prompt S14 — Patrols and capture

**Why.** ES's capture law and the patrols lens describe the same roads; offering patrol coverage to the capture roll
"would make the lens matter to the most covert play the host has — or would make a map presentation a hidden input
to a dice roll. Which does the owner want?" (`research/experience/02` §4 Q6). J397 S14 asks the host for its decision
whether its capture roll reads patrol coverage through `patrolOffer`; H25 asks that patrol coverage be given a host
meaning (a producer for its road-warden and road-predation pair kinds, or coverage as embattlement's security input).

**Map-side counterpart:** V13 §3.9 (14) (the cadence is the map's presentation; `patrolOffer` sends the extent and its
basis, never a time), §3.11.6 (`patrolOffer(world, revision)`); §8.5 H16 ("patrol coverage re-priced through its one
distance reader, read by outcome rolls only, any route choice reading it through its belief"), H25.

> **OWNER DECISION — does the capture roll read patrol coverage?**
> - **A — No.** Patrols stay a map presentation; the catch model is unchanged. Zero host change beyond the register.
> - **B — Yes, as an outcome-roll term only (recommended).** A bounded multiplier on the ROUTE-SEGMENT exposure class
>   (ES §3.3 (a): "route segments carrying enemy military") from the holder power's coverage on the segment the leg
>   crosses, read at the advance head from the baked `patrolOffer` table and priced through the host's own distance
>   reader — K3-safe because "the CATCH roll itself is truth-side … the WORLD acting on the traveller" (ES §3.3),
>   while route CHOICE keeps reading belief; dark behind `patrolCoverageEnabled`; UNMEASURED until the soak; receipted
>   on the capture ("the Emberford road watch at the ford").
> - **C — Yes, as the security input of embattlement** (H25's other arm): coverage lowers the embattlement ramp's
>   threat at the patrolled settlement, so every road reader feels it — broader, and it makes a presentation move a
>   stressor; not recommended first.
> The session's recommendation is **B**. The prompt below is conditioned on the owner's letter.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY packet. Navigate by symbol. Depends on H16's `patrolOffer` reaching the client.

GOAL (answer A): record in the register that patrol coverage is a map presentation the capture roll never reads, and
give coverage its host meaning only as a producer candidate for TR-1's route_wardenship / route_predation pair kinds.
GOAL (answer B): the capture roll on a route segment reads the holder's patrol coverage there as a bounded,
receipted, dark-by-default term; route choice never does.

THE H ROWS SERVED: H25 ("patrol coverage given a host meaning (a producer for its road-warden and road-predation
pair kinds, or coverage as its embattlement's security input)") and H16 ("read by outcome rolls only, any route
choice reading it through its belief (the known world)"). In your terms: one more banded factor in
gauntletCatchFactors / captureProbability's base, never in the dispatch's risk read.

FELT SENTENCE: "my spy was taken on the Thornhold road, and the receipt names the road watch that took him."
FIRST-VISIBLE: the capture receipt (event-timed; rare). TIER: spatial canon (a bound world with a sway); the
espionage and roads lanes' own flags (`espionageEnabled` needs `errandSpineEnabled`, dark everywhere; the roads
mover `roadsEnabled`); host flag `patrolCoverageEnabled` (virtual). DEGRADED ARM: dark ⇒ byte-identical.

READ FIRST
- docs/DESIGN_FP_ARCH_ES.md §3.3 (:483–570: the two exposure classes; the catch01 formula and its terms; "the K3
  boundary runs between a court's DECISIONS (belief) and the world's OUTCOMES (truth)"), §0 (:63–80).
- src/domain/roads/state.js:1–12 and :390–394 (captureProbability: base × exposure ÷ protection^α, capped);
  its callers src/domain/worldPulse/roadsKernel.js:613–660 (T1/T2/T3 rolls), src/domain/roads/embassyHazard.js:189,
  src/domain/roads/seaRoads.js:24; src/domain/worldPulse/espionage/espionageGauntlet.js:319
  (gauntletCatchFactors), :438 (stayDetectionRoll); src/domain/worldPulse/espionage/espionageMath.js:284 (legStack).
- src/domain/spatial/embattlement.js:194 (rampThreat — the security input, answer C's site), :156 (tollRateOf).
- docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md:48–53 (K3) and S7's MAP_FEED_READERS (this reader joins the list).

BUILD (answer B)
1. THE READ: patrolCoverageAt(segment, power, advanceHead) from the baked `patrolOffer` table fetched at the advance
   head (S7's reader list: `switch: patrolCoverageEnabled`, `tier: spatial canon`, `degradedArm: factor 1`): the
   extent (the station span the leg crosses), the basis ('hostWatch' | 'garrison' | 'debatable') and the nearest
   garrisoned seat's host key; the host prices the round trip itself through hopWeeks (never a cadence from the
   map) into a coverage band 0..3.
2. THE TERM: in the route-segment class only (roadsKernel's T1/T3 segment rolls and ES's `legStack` path), multiply
   the base by PATROL_FACTOR[band] ∈ [1, 1.5] (UNMEASURED; a banded table in ROADS_TUNING / the ES tuning surface),
   only where the holder power is hostile-class to the traveller's home; never in the stay-detection roll (class b);
   never in `riskToleranceOf`, the dispatch refusal or any route choice (HZ9: those read believed danger).
3. THE RECEIPT: the capture outcome names the watch ("taken by <power>'s road watch at <segment>", the subheader
   register) and carries the band in its metadata; the event reaches the map as `WorldEvent { kind: 'capture';
   where: { kind: 'road', edge, fraction } }` DM-only.
BUILD (answer A): the register bracket under H25's row in the fold's §5 and ES §3.3 ("patrol coverage is a map
presentation; the catch roll reads none of it"); patrolCoverageAt lands only as a candidate producer for TR-1's
route_wardenship / route_predation pair kinds (registered, no producer at 81f1cd96 — fold §2 TRADE row).

THE DATA CONTRACT THE MAP EXPECTS
- `patrolOffer(world, revision)` → per host edge and power `{ edge; power; extent: { fromStation; toStation };
  basis: 'hostWatch'|'garrison'|'debatable'; nearestGarrisoned: hostKey }` — "never a time-derived cadence: the host
  prices any round trip through its own distance reader" (V13 §3.9 (14)); computed without the DM's sway locks.
- The map draws patrols as tints and reads them in encounters; it never learns whether the host read them, except
  through the capture event's receipt.

ACCEPTANCE TESTS (B)
- tests/domain/roadsState.test.js and tests/property/roadsDormancyGolden.test.js: dark ⇒ byte-identical; lit, catch01
  is monotone non-decreasing in the band and ≤ 1.5 × the dark value; a friendly holder's coverage changes nothing;
  the stay-detection roll and every dispatch/route-choice read are byte-identical lit or dark (a scan that the
  reader is imported only by the two roll sites); the receipt names the power.
- The S7 fence: the reader is in MAP_FEED_READERS and in no negotiation module.

WHAT NOT TO DO
- Never let coverage into a route choice, a dispatch refusal or a believed danger (K3/HZ9).
- Never take a cadence or a time from the map; never read the sway's holder as a gate (V13 §3.9 (13)).

RECORD: the packet row; the ODQ row on the ledger branch with the owner's letter; a shift record when lit; the
fold's §5 register. REPORT BACK: the band table, the two roll sites, the capture event's fields, the flag name.
```

---

## Prompt S15 — H33 and H34 restated

**Why.** The routes layer can show a lane "three to seven times costlier against the wind in winter" while a plague or a
column crosses it in the host's symmetric week: "two different seas" until the host adopts direction (`research/
experience/03` §2.4 item 4); and a shrinking town's fields never return to forest because the host mints no dated
depopulation event the cover fold could read (§2.4 item 6; §4 Q5). M27 captions the two seas until H33; M24/M26 and
H34 ask for dated depopulation events with the population after, and for the map's readings beside the dossier.

**Map-side counterpart:** M27, M24, M26; V13 §3.8 (12) (sailing by direction, month and vessel; the canon's water
metres unchanged, J393 (2)), §3.6 (5) (the cover fold reads dated host facts), §2.2 (`SettlementPhysical`,
`WorldEvent`); §8.5 H33, H34.

```text
This prompt is the owner's authority for the change it describes. You are in the SettlementForge repository at
81f1cd96. Derive a READY train (two packets: the sea lanes; the readings and events). Navigate by symbol. Depends on
H11 (the lanes over the canon) and H9 (the events window).

GOAL: the sea-lane law may adopt the map's directional, seasonal sailing efforts behind its own switch, the storm
season staying the host's and applied once; and the host sends the map's physical readings for display beside the
dossier and every depopulation as a dated event carrying the population after it.

THE H ROWS SERVED: H33 ("routeFacts' per-edge sailing efforts by vessel, month and direction read behind its own
switch into its sea-lane law — a lane's cost per direction and month where it adopts them, its own lanes, unchanged,
where it does not … the offered efforts carrying wind and current only, its storm season its own and applied once")
and H34 ("physicalChange's land-cover share per seat catchment and SettlementPhysical's soil, stone, cover shares and
hazard readings shown beside its dossier as the map's derivation (labelled so), never written into its biome,
terrain word or genesis facts; … a razing, a plague's depopulation or an abandonment sent as a dated event with the
seat's population after it, so the cover fold withdraws the fields; a volcano the DM marks active and an eruption
the DM stamps arriving as dated events it may read, never as strikes it must roll").

FELT SENTENCE: "the grain fleet sails out in spring and limps home against the autumn wind; and the forest came
back over the town the plague emptied." FIRST-VISIBLE: the first sea shipment after lighting (weeks); the cover's
first withdrawn fields the advance after a depopulation event (one advance; the regrowth itself is years). TIER:
spatial canon with a sea-lane slot (H33); aspatial-safe for the events (H34). DEGRADED ARM: one symmetric lane cost
and no readings — byte-identical.

READ FIRST
- src/domain/spatial/seaLanes.js:1–64 (the builder: eligibility = geography ∧ institutions; the slot materialized
  only with ≥ 2 ports; storm season as the slot's own `stormSeasonCost`, read-time only), :420–422 and :522 (the
  slot: `{ version, ports, edges: [{ between, cost, capacity }], stormSeasonCost }`); src/domain/spatial/
  distanceRead.js:111 (the reserved slots), :265–287 (the self-describing read and its dormancy gate), :379 (the
  storm table applied); src/domain/spatial/navalLayer.js:84–86 (the naval layer reads the same storm law).
- src/domain/worldPulse/pestilenceKernel.js:279–298 (`plague_arrival`); src/domain/worldPulse/
  settlementLifecycleKernel.js:1001–1021 (`satellite_abandoned`, the abandoned-steading note); FORCE_ABANDON in
  src/domain/worldPulse/realmVerbExecution.js and settlementLifecycleFirstClass.js (by symbol); the razing's deaths
  (docs/DESIGN_REALM_DIRECTIVES.md R, :1064–1100: "DEATHS, NOT DEPARTURES … deaths with a `sack` cause class";
  src/domain/worldPulse/razingExecution.js:697 razingPlanFor); the terminal death (settlementLifecycleFirstClass.js).
- src/domain/resolveTerrain.js:40–45 (the terrain chain a reading must never write); src/domain/spatial/calamity.js (the
  calamity mover — the exposure a hazard reading may feed behind a switch).

BUILD
1. THE SEA LANES (packet 1, behind `seaLaneDirectionEnabled`, virtual): accept `routeFacts` per water edge the
   canon's candidate matches (by host key) with `sailing?: { vessel: 'sail'|'oared'|'coastal'; byMonth: { out:
   number; back: number; mean: number }[] /* twelve */ }[]` (file y's typing on `routeFacts`, matching
   `WorldRoute.sailing`; integer effort-metres a → b and b → a; wind and current only); where lit, the sea-lane
   read keys the lane by direction and month (an edge `{ between, costOut, costBack }` per month, the slot's version
   stepped) and the storm multiplier `stormSeasonCost[season]` applies ONCE on top; dark, the symmetric `mean` is
   not even read and the slot is byte-identical. The canon's water metres (the candidates' `waterM`) never move.
   Caravans, refugee pricing and plague latency read the lit lane; the naval layer reads the same read.
2. THE READINGS (packet 2a): `SettlementPhysical` (soil class and fertility, bedrock, `landCoverShare` per catchment,
   `hazards: { kind: 'volcano'|'fault'|'flood'|'glacier'; distanceM }[]`, `floodSummary.wetSeasonShare`) shown beside
   the dossier on the settlement page as "the map's derivation" (labelled), read from `derivedFacts`; the
   agriculture read may consume `soil.fertility` and the calamity exposure the hazards and the flood share, each
   behind its own switch (`physicalReadingsEnabled`, declared shifts), never written into config.terrainType, the
   biome word or any genesis fact.
3. THE DEPOPULATION EVENTS (packet 2b): every razing (the sack's deaths), every plague depopulation (the plague
   condition's population shed), every abandonment (`satellite_abandoned`, FORCE_ABANDON, a terminal death) emits a
   `WorldEvent { kind: 'razing'|'plagueDeaths'|'abandonment'; where: the seat; week; populationAfter: number;
   causedBy; audience: 'public' unless covert }` in the events window; and the DM's volcano mark and eruption stamp
   (map-side events the DM attributes) arrive as dated events the calamity exposure may read behind its switch —
   never a strike the engine rolls.

THE DATA CONTRACT THE MAP EXPECTS
- `routeFacts(world, request?)` per host water edge: the host key, integer water metres by kind, the per-class
  effort, the 52-week seasonal sets and, per water edge, `sailing?: { vessel; byMonth: { out; back; mean }[] }[]`
  (H33: the directional efforts and their symmetric mean, wind and current only) — "behind the host's own switch …
  the canon's water
  metres stay geometric and unchanged" (J393); until adopted the map captions every sea link "the host's movers do
  not yet read the season" (M27) and drops the caption on the host's switch.
- `SettlementPhysical` as above (a derived reading; the map "never a genesis fact and never its biome").
- `WorldEvent.populationAfter: number` on the three kinds — the cover fold dates its withdrawn fields from it
  (M26); `WorldEvent { kind: 'eruption'|'volcanoActive' }` from the DM, read never rolled.

ACCEPTANCE TESTS
- tests/domain/seaLanesDirection.test.js: dark ⇒ the digest and every hopWeeks read byte-identical; lit, `out` ≠
  `back` on a fixture edge in a windy month, the storm multiplier applies exactly once (a seeded month in storm
  season equals mean × storm,
  never × storm²), the candidates' waterM unchanged; the naval layer's EV reads the directional cost.
- tests/domain/physicalReadings.test.js: a reading never writes any config key (a byte-diff of config before and
  after display); the switch dark ⇒ agriculture and calamity byte-identical.
- tests/domain/depopulationEvents.test.js: each of the three kinds emits one event per occurrence whose
  populationAfter equals the settlement's population after the tick; an eruption event is read, never rolled
  (no rng fork for it).

WHAT NOT TO DO
- Never stack the map's seasonal factor on the storm multiplier; never move the canon's water metres (J393).
- Never write a reading into terrainType, the biome or a genesis fact; never roll a volcano.
- Never emit a depopulation event for a transfer or a column (they are movers, not deaths).

RECORD: the packet rows; shift records for the switches; the fold's §2 WAYFARE row (the sea read) and POPULATIONS
row. REPORT BACK: seaLaneDirectionEnabled, physicalReadingsEnabled, the `sailing[].byMonth` row shape as adopted,
populationAfter, the
three event kinds and the two DM-stamped kinds.
```

---

## 16 Closing

### 16.1 The owner's checklist

Tick each as it lands in the host; the map side lights the lens or layer named in 16.2.

- [ ] S1 born applied; allegiances named (`names`); the label honest; FPQ-62 ruled B (A the owner's veto), in the ODQ
- [ ] S2 the birth window (lens, polity, events at seq 0); the regime resolver
- [ ] S3 the first-advance canon; the grace drag; the move-lock sentence
- [ ] S4 the adapter tables; the awaited world; the charter-born member; plan law 3
- [ ] S5 the party's place; the observer; the party set with asOfWeek and confidence; the court viewpoint
- [ ] S6 causedBy on every event; headlineOf; the integrity register; the knowledge desk's pins
- [ ] S7 MAP_FEED_READERS; the K3 bracket; the fence test
- [ ] S8 the force band with its basis (gross now; net with WC-4)
- [ ] S9 the world root in the cause walk; reasonOf hops
- [ ] S10 claims: lineage, vengeance, grievance with since and expires; the pairs' live treaty terms (`terms`)
- [ ] S11 WY §3b's bracket; the register's marker/dated-fact split
- [ ] S12 the dossier-update handler (hostEffect); the arrived plague's condition; the one-service fence
- [ ] S13 the raid's three words; strengthBand each window; the registry row with SP-9
- [ ] S14 the capture decision (A | B | C) recorded in the ODQ; the term if B
- [ ] S15 the directional sea read; the readings beside the dossier; depopulation events with populationAfter

### 16.2 What the map module will do once each lands (in map terms)

- **S1** → the religion lens leaves `none` where a deity is seated (M49 stands until then); the sway's labels read
  the host's allegiance names (M22); every banner's `born` reads false on a module world (M1).
- **S2** → every lens banner resolves at birth, the sway projects from genesis facts instead of "before the host's
  first polity window", and the cover fold runs at birth from the populations sent (M1).
- **S3** → the genesis network named at creation and re-laid at each drag; `Placement.hostLocked` holds from the
  first advance; the canon-gated lanes run from it (M2).
- **S4** → the instant world grows the world first (M4): template or scenario from the adapter table, planned
  sites from the genesis ties, a charter per site; the world dialog shows the tone's regime read-only.
- **S5** → the party's believed rows draw "as of week n" and fade by band (M8); the believed sway as a court
  viewpoint, DM-only unless opened, `Viewpoint.audience: 'court:<seat>'` (M9); on the default preset the party's map
  delays public rows by the host's own distance pricing ("news reaches the party at a rider's pace", M10).
- **S6** → "open the headline" on a pin (M11); DM-side marks carry clean / worn / planted; the knowledge desk's
  events as DM-only dated pins; `whatCaused` descends into the host's receipts (M7).
- **S7** → the §3.11.6 law line holds with the host's reader list named (M12); the feed stays a reading.
- **S8** → `memberForce` reads `netForce` where sent, else the band labelled gross (M17).
- **S9** → the clerk's `reasonOf` answers the host's cause walk; one "why" crosses the seam (M7).
- **S10** → the claims lane draws vengeance licences and sold-town grievances as DM-only outlines (M20); a live
  non-aggression term reads neutral and a live mutual-defence term respect for the sway's class (M13).
- **S11** → §5.8 (5)'s split stands in both documents: mover markers under the host's law; dated facts captioned;
  the approach ring a dated fact; "likely road" DM-only (M23); the cargo refusal gated "where the host's lane is
  dark" (M24).
- **S12** → the conflict list's preview reads "its computed facts re-derived; its people, trades and history kept"
  and shows the effect word as sent (M33); the plague lens drops "arrived; the town's record follows at resolution"
  (M29); the populations lens draws one crisis once.
- **S13** → a raid with a word is a verdict by the verdict table (the aggressor for `succeeds`, the victim for
  `repelled`, nobody and no band for `bought_off`); `whyCell` names the strength-band
  change, never the raids (M15, M16).
- **S14** → the patrols lens's tints gain a host meaning (B) or a legend line saying they have none (A); nothing on
  the map changes either way — the lens never claimed an effect the host does not apply.
- **S15** → the sea links' caption "the host's movers do not yet read the season" drops (M27); the cover fold
  withdraws the fields from the depopulation week and the forest returns by the succession table (M24, M26); the
  physical readings appear beside the dossier as the map's derivation.

COMPLETE: head, S1–S15 and the closing written; every host citation verified at 81f1cd96 by symbol and line; one
owner decision (S14) boxed and S1's deity ruled B with A as the owner's veto; three "(chosen here)" choices marked
(S1's door, S3's re-sent bindSeat, S4's rung); port names aligned to files v/w on 2026-10-24 (names, partySeat,
observer, homeSeat, Believed, courts, integrity, hostEffect's enumeration, cargo); revised for the review
docs/volumes/critique/experience-vwx.md (EX-01, -02, -03, -05, -11, -12, -13, -14, -15, -19) on 2026-10-24.
