# LANE H amendment applier — exact-string anchors, each asserted unique in the BASE.
# Modes: inline (" " + text right after the anchor) · after (new line after the anchor's line)
#        afterp (blank line + text + blank line after the anchor's line — used inside ## banners)
import json, sys

KIT = '/Users/cstokes/Desktop/settlement-engine-kits/fp-coherence-2fc13d59-2026-10-16'
import os
DST = os.environ.get('LANEH_DST', '/Users/cstokes/Desktop/settlement-engine/docs')
C = '2026-10-16 (coherence fold'
W = '2026-10-16 (coherence fold, req 16/17) — '

def fv(first, tier, degraded):
    return f'[ADDED {W}FIRST-VISIBLE: {first} · TIER: {tier} · DEGRADED ARM: {degraded}]'

BELIEF = 'belief infoMode (spatial canon ∧ infoMode ≠ omniscient)'
WARGATE = 'host flags: war-gated (`hasLiveWarState`, warStatus.js:262; the war layer `warLayerEnabled` lights only in dramatic_campaign and full_simulation, compiled fold §12.8)'
JEM6 = '[CORRECTED 2026-09-23 by J-EM-6 (§12.3); pointer added 2026-10-16 (coherence fold) — '

BASES = {
    'DESIGN_FP_ARCHITECTURE': f'{KIT}/volumes-master/DESIGN_FP_ARCHITECTURE.md',
    'DESIGN_FP_ARCH_CN': f'{KIT}/volumes/DESIGN_FP_ARCH_CN.md',
    'DESIGN_FP_ARCH_LG': f'{KIT}/volumes-master/DESIGN_FP_ARCH_LG.md',  # byte-equal to volumes/
    'DESIGN_FP_ARCH_PG': f'{KIT}/volumes/DESIGN_FP_ARCH_PG.md',
    'DESIGN_FP_ARCH_MF': f'{KIT}/volumes/DESIGN_FP_ARCH_MF.md',
}

E = {}

# ============================ DESIGN_FP_ARCHITECTURE.md (the compiled fold) ============================
E['DESIGN_FP_ARCHITECTURE'] = [
 ('STATUS + R1 (§5.1, X2)', 'inline', 'runs, no band ratifies outside the owner-signed schedule.',
  f"[CORRECTED {C}) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. 'Every wave ships DARK; no flag lights' is SUPERSEDED for FP by §12.8 (J-EM-15/16, ODQ §934.84 \"shipped lit\"). In one line: nine FP keys lit; 37 landed · 12 partial · 62 not started of 111 at 00b648c9d (65 not started of 114 with §13) — LIT: `pactFormationEnabled` + `faithUnseatingEnabled` in the four world-alive presets incl. the realistic_regional default chip; `beliefAxesEnabled` + `believedConditionsEnabled` + `believedScarcityEnabled` in dramatic_campaign, living_realm and full_simulation; `mediationGeneralizedEnabled` + `oathHolderEnabled` + `treatyLifecycleVoiceEnabled` + `treatyRenewalEnabled` in dramatic_campaign and full_simulation (simulationRules.js FP_LIT_*, :789–802) · BUILT DARK: every other minted FP layer (24 of §3's 63 flags are minted; errandSpine, merchantHouses, espionage, the IN four, cascadeGovernor, habitConditioning, the WC pair and advanceEpoch among them) · UNBUILT: the rest, per the coherence fold's §2 table.]"),
 ('§2a row 3 (sealing header)', 'inline', '"sealed" has been warned here first.',
  f"[CORRECTED {C}) — the sealing statement is not re-measured here; its 'not started' and 'standing escalation' halves are stale: HB-0..2, EP-0..3 and WC-0 LANDED (coherence fold §2); CR-WC-9 is ruled PARKED until chain 2 asks for a field (OD-FC-20, by delegation; see the bracket at §4's 2026-08-07 sub-key paragraph).]"),
 ('R5 see-ref (header §10 verbatim)', 'inline', 'its §10 binds verbatim in §10 below)',
  "[see the bracket at §10's heading: an amended superset, not verbatim]"),
 ('R2 see-ref (EM fold banner 28·10·73)', 'inline', '(28 landed · 10 partial · 73 not started)',
  f"[RE-DERIVED {C}) — see the bracket at §5's 2026-09-23 progress block: 37 · 12 · 62 at 00b648c9d]"),
 ('R3 + S1/S2 (L1 kernel "ever")', 'inline', 'treaty mint folds, or the mover seam.',
  f"[CORRECTED {C}) — two sanctioned exceptions exist: EP-1's six-token seam (§5 EP-1) and Edit Mode's `applyDecreesAtTick` hook (L10(d)), which moved the enforcer baseline 1580 → 1581 (`scripts/.size-baseline.json:13`); applyWorldPulse stands at 907, not 941 (`:9`). The law reads: no FP stage mounts in the kernel; EP-1 is the one FP edit.]"),
 ('S6 (L10 provenance 6 of 86)', 'inline', 'at this fold 6 of 86',
  f"[CORRECTED {C}) — 104 distinct `HBF-` ids and 10 `actionVocabulary:` rows at 00b648c9d (habitForkRegistry.js)]"),
 ('§5 register: pin/seal, doctrine sheet, tithe, phantom policy', 'after', 'never a silent rename.',
  f"[RULED {C} §5, the vocabulary register) — in this volume: 'pin' means a test assertion and 'seal' the Edit Mode directive (the landed op token `pin-fork` stands; prose never says 'pinned' for a seal); HB's 'doctrine sheet' is 'the habit sheet' in prose and in every unlanded token (`habitSheet`, `habit_sheet_shifted`; the flag `believedDoctrineEnabled` stands); there is ONE tithe (§3.1.5 — see the bracket at #39 WF-7); the phantom policies are L10's two, `real-only` and `home+record` — §12.2's 'home-only' is not a policy (see the bracket at §12.2 row 4).]"),
 ('S5 (TERM_CATALOG 12/8)', 'inline', 'now **12 terms / 8 families**,',
  f"[CORRECTED {C}) — 26 terms / 13 families at 00b648c9d (node import of peaceTermsCatalog.js); derive from the live export, as this row says.]"),
 ('§3.1.7 + §5 returning→column_return (first use)', 'inline', "the closed class set gains `'returning'`",
  f"[RULED {C} §3.1.7, §5) — the return class is `column_return`, ruled once across POP/WC/LG/ES (not `returning`, which collides with three existing states); ONE union with one `columnOf` whitelist — POP owns the CIVILIAN classes, WC the MILITARY classes (WC-0 landed `MILITARY_COLUMN_CLASSES`).]"),
 ('S3 (§2b item 5 five members)', 'inline', 'sovereigntyTrade — all with certification rows);',
  f"[CORRECTED {C}) — 43 entries at 00b648c9d (simulationRules.js:230–668), and nine FP keys are LIT (see the status bracket at the head).]"),
 ('S9 + S1/S2 (§2c sizes)', 'inline', 'settlementStrategy 1,360 raw / 812;',
  f"[CORRECTED {C}) — at 00b648c9d: pulseKernel 1581 effective (the decree hook), applyWorldPulse 907, and settlementStrategy's baseline entry is DELETED (812 → 760, under the ceiling; J-EM-6) — `scripts/.size-baseline.json`.]"),
 ('INT-7 see-ref (§3 lane file)', 'inline', '(INT mints subsystemRowsInterior.js; others follow',
  "[see the bracket at #56 INT-7: subsystemRowsVirtual.js, J-EM-6]"),
 ('§5 register embattled (first use, flag row 60)', 'inline', 'fission and free units, brigandage and the embattled state',
  f"[RULED {C} §3.1.16, §5) — 'embattled' is ONE thing: the live `embattlement` ledger phase (spatial/embattlement.js); a brigand siege is one more ramp term on that ledger, never a parallel stressor.]"),
 ('§6 overturned: lighting owner-held', 'inline', 'the signed soak redo.',
  f"[SUPERSEDED BY EVENT {C}) — the owner's 2026-09-23 word \"no just build it all shipped lit\" (§12.8 J-EM-15/16, ODQ §934.84) superseded owner-held lighting at the soak redo; LIT-n units light in dependency order, each with its re-record cause.]"),
 ('§5 register kmScale (first use)', 'inline', 'plus the frozen-digest datum `spatialDigest.kmScale`.',
  f"[RULED {C} §5) — `kmScale` is the WORLD scale (km per realm map unit; WY-1 `bfe4830d0` minted the datum, which nothing writes yet — FPQ-37); the town map's scale bar is MF's distinct `viewMetersPerUnit`; prose says 'the world scale' / 'the map's scale bar'. Its default is the map's implied scale (OD-FC-22, by delegation).]"),
 ('OD-FC-20 CR-WC-9 (§4)', 'inline', 'the escalation is LIVE (CR-WC-9), on the WY §2a precedent:**',
  f"[RULED {C} §7 OD-FC-20, by delegation, vetoable) — five records disagreed; CR-WC-9 is read PARKED until chain 2 asks for a field, and WC-0E's two normalizers stand (writer-less, no byte persisted).]"),
 ('§3.1.9 calamityArcs row', 'inline', 'RE-DERIVED from replayed evidence; pruned after aftermath window',
  f"[RULED {C} §3.1.9) — POP-4 FOLDS INTO PG; `calamityArcs` is NOT minted (the name collided with the lit calamityKernel); PG owns the arc.]"),
 ('returning see-ref (§4 POP fields)', 'inline', "- POP: migration column extensions `travelClass:'returning'`",
  "[see the bracket at §2a class 4: `column_return`]"),
 ('§3.2.21 INVENTORY (§5 heading)', 'after', '## here is the binding charter, order, and cross-program deltas)',
  f"[RULED {C} §3.2.21) — the §5 charters below are declared the INVENTORY: the program volumes are normative, and a CUT-TO-SENTENCE (one line per wave plus a status column) is recorded, executed when this volume is next re-compiled, not now. They carry no FIRST-VISIBLE/TIER lines; the program volumes do. Where J-EM-6 (§12.3) corrected a charter, the charter now carries a pointer.]"),
 ('EP-18 (EP placement)', 'inline', 'half is the one carrying the argument.',
  f"[CORRECTED {C}) — EP §5 item 3: EP-0 EARLY-ELIGIBLE; EP-1..3 after CR-WR10-H (all LANDED 2026-08-16); EP-4 an independent lane whose slice 2 may not light before EP-1; FP-ORDER pair 7 now carries EP-4 slices 2–3 ‖ EP-5 LAST.]"),
 ('§6 overturned: CQ2 early motion', 'inline', 'and all four of these run in STRICT ORDER at the positions above.',
  f"[SUPERSEDED BY EVENT {C}) — the CQ2 early-motion set is moot: overtaken by the tests-only area lanes (J-EM-10) and then FP-40 CHAIN-FIRST (2026-10-02, FP-ORDER.md); GR-0 and TR-1 landed, GR-1 and TR-9 are partial.]"),
 ('R2 + R12 + §3.3.11 (09-23 progress block)', 'inline', 'under tests-only mode; a design row is not a coding assignment.',
  f"[RE-DERIVED {C}) at 00b648c9d — 37 landed · 12 partial · 62 not started of 111 (114 with §13: 65 not started); moved since this block: GR-2 (partial → landed, GR-2b `3f05e36e0`); GR-6, IN-2, IN-3, IN-6, TR-3, CW-1, WF-0, WY-1 (not started → landed); IN-4, IN-5, TR-2 (not started → partial); SP-D2 landed as a §12 member (`3fd25f5df`). '(HB Q1)' is stale: HB Q1 is SIGNED by the owner's word as read at J-EM-15(2) (§12.8), so HB-3..HB-9 are released. The LG volume is on master (J-EM-12 discharged; zero LG code). The count is derived (PLAUSIBLE as a count; each row CONFIRMED by symbol or commit — findings FOLD-SMALL §2b). The table is the coherence fold's §2; this block is history (fold §3.3.11).]"),
 ('§3.3.11 see-ref (08-09 block)', 'inline', '> **PROGRESS — HISTORICAL CORROBORATION; RE-DERIVED 2026-08-09.**',
  "[see the bracket at the 2026-09-23 block above; the status of record is the coherence fold §2]"),
 ('§6 overturned: Edit-verb clauses (first site)', 'inline', 'recorded. Zero existing-src edits.',
  f"[SUPERSEDED BY EVENT 2026-09-23 (L10, J-EM-1); bracket added {C}) — every §5 'Edit-verb:' clause below is history: a remaining wave's editor obligation is its §12.4 EDITOR row, and a DM verb is a `REALM_MANIFEST` or `DIRECTION_OP_TYPES` row (J-EM-2), never the operationRegistry/store-action lane these clauses name.]"),
 ('S10 + SP-CW R-24 + §3.3.11 (SP-C BLOCKED ON Q1)', 'inline', 'both-site header documentation land with it.',
  f"[CORRECTED {C}) — Q1 RULED (CR-FP-3, then CR-C4-1): the build spells `courtPostureOf` / `courtRiskAppetiteOf` (strategicPosture.js:222, :303); SP-C LANDED `cbd348a50`, dark; its appetite writer is unmounted — SEAM-0 (§13) owes the mount.]"),
 ('R8 WF-2 religious (SP-D charter)', 'inline', 'WF-2b (purpose `religious`)',
  JEM6 + "WF-2's pilgrims travel with purpose `personal`, not `religious`; see §12.3.]"),
 ('§3.1.1 see-ref (GR-3 TR-5 producers)', 'inline', 'and producers later.',
  f"[RULED {C} §3.1.1) — EC-6 owns the READ-side executor and GRAMMAR's `PACT_DRAFT_LENS` row owns the producer; see the bracket at #27 TR-5]"),
 ('R8 HB-2 first coupling row', 'inline', 'its own `couplingRegistryHabit.js` leaf, in the same commit as the row.',
  JEM6 + "HB's first coupling row lands with HB-4 (the first cross-layer read) and `couplingRegistryHabit.js` is minted then; no such leaf exists at 00b648c9d. `HB` is admitted, and the closed set is now THIRTEEN (see seam row 32).]"),
 ('S9 see-ref (IN-4 812)', 'inline', '(settlementStrategy at its 812 baseline)',
  "[see the bracket at §2c: the entry is deleted, ≈760]"),
 ('R8 TR-5 five + §3.1.1 + §3.1.2/OD-FC-2 + §3.3.11', 'inline', 'commercialTermExecutors (five executors as lazy peaceTerms-family siblings)',
  JEM6 + "TR-5 builds executors for the THREE commercial term rows GR-3 minted (`exclusivity`, `market_access`, `toll_exemption`), not five, and mints no term family. RULED (coherence fold §3.1.1): EC-6 owns the READ-side executor (the trade-stance derivation IS the executor), and the PRODUCER is GRAMMAR's `PACT_DRAFT_LENS` row; TR-5's 'lands executors + producers' points there. RULED (§3.1.2, OD-FC-2 by delegation): `realmPressure01`'s consumer is EC-17's partner arm, so 'the DEAD CONSUMER finally lands' is no longer TR-5's sentence.]"),
 ('§3.1.7 WC-0 column union', 'inline', "classes reds WC-0's pins.",
  f"[RULED {C} §3.1.7) — the union stays (it shipped): POP owns the CIVILIAN classes, WC the MILITARY classes, ONE union, one `columnOf` whitelist; the return class is `column_return` across POP/WC/LG/ES.]"),
 ('R8 WC-2 warStanceOf + §3.2.19', 'inline', '`warStanceOf` live (a derivation over deployments + credit;',
  JEM6 + "the derivation is `derivedWarStanceOf`; `warStance.js :: warStanceOf(rung)` keeps its accessor meaning. RULED (coherence fold §3.2.19): the spelling carries the episode key — `derivedWarStanceOf(worldState, partyId, warEpisodeKey)` (L-WC-8's per-episode law).]"),
 ('§5 register crossing (first use)', 'inline', 'crossing beat.',
  f"[RULED {C} §5) — prose qualifies: this is the 'stance crossing'; the 'entrepot crossing' is WC-3's counter.]"),
 ('§5 register bond (first bare use)', 'inline', 'arithmetic exactly; it lights at WC-9).',
  f"[RULED {C} §5) — prose says 'service bond' (WC's `serviceBonds`), 'diaspora bond' (WC-15) or 'court bond' (§13), never bare 'bond'.]"),
 ('§5 register partial (WC-9)', 'inline', "WC-5 supplies `partial`'s askedBand",
  f"[CLARIFIED {C} §5) — here `partial` is the `CONTRIBUTION_CLOSE_GRADES` rung; the `CALL_IN_ANSWERS` rung of the same spelling is renamed `half_answered`.]"),
 ('embattled see-ref (WC-12)', 'inline', 'the embattled stressor injected',
  "[see the bracket at §3 flag row 60: one more ramp term on `embattlement.js`, §3.1.16]"),
 ('R8 WF-2 religious (WF-2 charter)', 'inline', "by order — war's closed ENVOY_PURPOSES was never widened);",
  JEM6 + "WF-2's pilgrims travel with purpose `personal`, not `religious`.]"),
 ('§3.1.5 one tithe (WF-7)', 'inline', '**#39 WF-7 — THE TITHE** (flag `titheEnabled`).',
  f"[RULED {C} §3.1.5) — ONE tithe: W-COIN's `tithe_share` is the coin arm; `templeWealth` is NOT a second stock but a BAND derived from the treasury's `tithe_share` row where the treasury is lit and from piety × temple presence where it is dark (the named degraded arm); the house-fortune source is struck.]"),
 ('§5 register sack lure', 'inline', 'the NINE-row counterforce audit + sack lure;',
  f"[RULED {C} §5) — FAITH prose says 'the sack's draw'; 'lure' is IN-2's bought lie.]"),
 ('returning see-ref (POP-1)', 'inline', "`'returning'` — the closed set extended per RF-2/Q-resolved,",
  "[see the bracket at §2a class 4 — `column_return`, not `'returning'`]"),
 ('§3.1.9 POP-4 folds into PG', 'inline', '**#45 POP-4 — THE PLAGUE ARC** (flag `calamityArcEnabled`).',
  f"[RULED {C} §3.1.9) — POP-4 FOLDS INTO PG (docs/DESIGN_FP_ARCH_PG.md): PG owns the arc, the resistance and contagion-on-arrival under its ONE PLAGUE TRUTH; POP keeps the burial LINE (THE BELLS, a Herald generalisation) and the disaster cause; the `calamityArcs` ledger is not minted.]"),
 ('R8 INT-7 subsystemRowsInterior', 'inline', 'subsystemRowsInterior.js — the new certification lane',
  JEM6 + "INT-7 reads `subsystemRowsVirtual.js`, not the superseded `subsystemRowsInterior.js`.]"),
 ('returning see-ref (§6 POP J)', 'inline', '(Q-resolved: the class IS the ownership mark)',
  "[see the bracket at §2a class 4: the class is `column_return`]"),
 ('OD-FC-40 see-ref (§6 POP Q6)', 'inline', '(deferred beside J-POP-14 — Q6 carries it to the owner)',
  "[see the bracket at CR-FP-6: slotted in chain 3, OD-FC-40]"),
 ('see-ref subsystemRowsInterior (§6 INT)', 'inline', 'subsystemRowsInterior.js lane (Q5 owns the war-flag uniformity half)',
  "[see the bracket at #56 INT-7]"),
 ('§5 register ERA-PRESET-ELIGIBLE (§7 heading)', 'after', '## tuning-table totality both directions, growing one volume at a time)',
  f"[RULED {C} §5; OD-FC-17 by delegation, vetoable) — ERA-PRESET-ELIGIBLE stands or falls with SP-8 / J-D12, the age layer, which is DEFERRED past launch with the slot \"THE AGES\".]"),
 ('S16 knowledge desk', 'inline', 'knowledge desk exists only after IN-5)',
  f"[CORRECTED {C}) — DISCHARGED: IN-5/1 `6cf6920d4` landed the seventh Herald desk (knowledge).]"),
 ('R4 + S8 seam row 32', 'inline', 'SC-7: the closed TWELVE-prefix alternation',
  f"[CORRECTED {C}) — THIRTEEN at 00b648c9d: `ENC` admitted (`tests/domain/couplingRegistry.test.js:119`), whose own header (:94) requires this row's amendment; EC, WC, EP, LG, PG, MF and CN are not chartered — each is chartered in the same commit as its first registry row (coherence fold §3.3.2, requirement 21c).]"),
 ('EP-19 dormancy counts', 'inline', '(32 goldens · 27 fixtures · 8 oracle suites · 4 four-fence sets)',
  f"[CORRECTED {C}) — refuted by EP §8.1 row 4: 53 · 16 · 49 · 12 at the EP-F round; re-derive at any re-use.]"),
 ('R4 see-ref (twelfth prefix)', 'inline', 'the twelfth chartered coupling prefix (`HB`, HB Q4 RULED',
  "[see the bracket at seam row 32: thirteen, `ENC` admitted]"),
 ('R5 + S11 §10 verbatim', 'after', "## the FP compile's additions — L7/L9 at verbatim strength)",
  f"[CORRECTED {C}) — not verbatim: an AMENDED SUPERSET of the war volume's §10 (seven clauses → ten; clauses 1, 3, 4, 5, 6 and 8 re-worded); read THIS section as the FP protocol and the war §10 as its ancestor. Clause 1's branch gate names `claude/composite-r4`, which no FP lane has built on since 2026-09-23 (FP lanes build on `fp/*` and train branches) — read it as \"the lane's own branch, hard-gated\". Clause 4's \"never a re-record\" is superseded for FP by the signed-door re-records WITH THE CAUSE (J-EM-16); clause 6's operationRegistry lane for DM verbs by L10/J-EM-2 (see the bracket at 6). Every volume that \"inherits §10 verbatim\" inherits this bracket.]"),
 ('R6 §10.6 operationRegistry', 'inline', '(diff exactly the new\n   operations);',
  f"[CORRECTED {C}) — for DM verbs read L10/J-EM-2: a `REALM_MANIFEST` or `DIRECTION_OP_TYPES` row; operationRegistry remains for store actions only.]"),
 ('lighting see-ref (§10.10)', 'inline', 'tuning, pushes are the terminal phase).',
  "[SUPERSEDED BY EVENT 2026-09-23 for lighting — see §12.8 (\"shipped lit\"); pushes stay the owner's]"),
 ('OD-FC-20 see-ref (§11 CR-WC-9)', 'inline', 'which blocks WAVES (WC-6 onward) and never blocked the fold.',
  "[see the bracket at §4: CR-WC-9 is read PARKED, OD-FC-20]"),
 ('App. A Q1 CR-FP-3', 'inline', 'one-row constitution erratum;\nimport-source pin set + both-site headers land regardless of arm.',
  f"[CLARIFIED {C}) — DISCHARGED and later amended: the build spells `courtPostureOf` / `courtRiskAppetiteOf` (CR-C4-1; strategicPosture.js:222, :303), not `postureOf`; the constitution erratum is applied (coherence fold §3.3.3).]"),
 ('App. A Q3 CR-FP-4', 'inline', 'fallback = the `pendingPlants`\nconditional deposit under the D-3 contract; both fail = STOP for a\nchair-signed kernel seam.',
  f"[CLARIFIED {C}) — DISCHARGED: IN-0 landed.]"),
 ('App. A Q4 CR-FP-5', 'inline', 'the owner may\nlater take the re-record arm with the WR-0b field-level diff.',
  f"[CLARIFIED {C}) — INT-8 is not started; the owner's ODQ §934.88 signs text-only re-records wave by wave, so the \"every existing golden byte-identical\" premise is PLAUSIBLY overtaken — re-read at INT-8's compile.]"),
 ('App. A Q6 CR-FP-6 / OD-FC-40', 'inline', 'this goes on the owner queue, not into any wave.',
  f"[CORRECTED {C} §7 OD-FC-40, by delegation, vetoable) — no ODQ row was ever written for Q6 / J-POP-14; the coherence fold SLOTS it as a row of chain 3's clearing (POP-1) under the 2026-09-19 never-deferred law.]"),
 ('App. A Q8 CR-FP-8 dangling', 'inline', 'harmonization\nrecorded as a post-GR-2 candidate owned jointly with the war chair.',
  f"[CORRECTED {C}) — the trigger has fired: GR-2 is COMPLETE (GR-2b `3f05e36e0`), and no record names the harmonization's slot; under the 2026-09-19 never-deferred law it is owed a slot or a CLOSED-with-reason (reported to the chair, not ruled here).]"),
 ('App. A Q10 CR-FP-10', 'inline', 'DECLINED (owner-gated persistence churn on a live save shape, zero\nbehavioral payoff); the constitution owes the erratum row.',
  f"[CLARIFIED {C}) — DISCHARGED: `worldState.envoyErrands` is kept (OD-FC-14 KEEP, by delegation); the constitution erratum is applied (coherence fold §3.3.4).]"),
 ('App. A CR-FP-12 moot', 'inline', 'One owner clause admits ES-0 to CQ2 if the owner reads the collision risk\ndifferently.',
  f"[CLARIFIED {C}) — MOOT: ES-0 landed.]"),
 ('CQ2 see-ref (STANDING)', 'inline', '**exactly those four; CR-FP-12 above declined widening it to ES-0.**',
  "[see the bracket at §5's 2026-08-07 fold paragraph: CQ2 is moot]"),
 ('R9 + §5.4 parked list', 'inline', 'and every tuning band (raw-authored\nuntil owner-signed, per THE PROMISE).',
  f"[CORRECTED {C}) — F9 is SIGNED (§4's F9 note; J-EM-9); the war-chooser spy wiring was RELEASED by the 2026-08-05 grant (the HB-5 block: CR-ES-4's deferred arm); ES-0's CR-FP-12 is moot (ES-0 landed). Still parked: the ES Q5 alliance-topology ACQUIRE and the tuning bands (the owner's signature). Q6 / J-POP-14 is SLOTTED as a row of chain 3's clearing (POP-1) under the never-deferred law (OD-FC-40, by delegation, vetoable).]"),
 ('S7 envoyArrived', 'inline', '`envoyArrived` is the stub `ABSENT_UNTIL_E4`)',
  f"[CORRECTED {C}) — DISCHARGED by SP-D2: `envoyArrived` is a `liveRow` at 00b648c9d (src/domain/edit/worldConditions.js:241).]"),
 ('S6 see-ref (§12.0 item 4)', 'inline', '**The decision-fork registry has 86 rows and SIX outcome vocabularies**',
  "[see the bracket at L10's provenance: 104 ids and 10 vocabularies at 00b648c9d]"),
 ('S17 + LG (§12.0 census)', 'inline', 'The last FP landing was EP-3B on 2026-08-16.',
  f"[CORRECTED {C}) — true at 2026-09-23; 60+ FP commits landed 09-24..10-02 (coherence fold §2), and the LG volume is now on master (J-EM-12 discharged; zero LG code). This census is re-derived at the bracket on §5's 2026-09-23 block.]"),
 ('dark-layer law see-ref', 'inline', 'puts the LAUNCH LINE — which FP flags light before the first real world — to the owner as a decision point (§12.7), where it already stood.',
  "[SUPERSEDED BY EVENT 2026-09-23 — see §12.8 (J-EM-15/16, \"shipped lit\") and its 2026-10-16 bracket]"),
 ('R7 home-only (§12.2 row 4)', 'inline', "each lands its row in the wave's own module | home-only",
  f"[CORRECTED {C} §5) — 'home-only' is not an L10 policy: read `home+record` (L10(b)/(c)) until L10(c) mints a third policy by ruling; the code carries none of the three literals.]"),
 ('R7 see-ref (row 5)', 'inline', 'the herald\'s reason "no supply line" | home-only',
  "[read `home+record`; see row 4]"),
 ('R7 see-ref (row 7)', 'inline', 'read the same seat) | home-only',
  "[read `home+record`; see row 4's bracket]"),
 ('S7 see-ref (seal 8)', 'inline', '`envoyArrived` = `ABSENT_UNTIL_E4` (unsatisfiable by construction)',
  "[see the bracket at §12.0 item 2: discharged by SP-D2]"),
 ('§3.2.19 + §3.1.1 + §3.1.9 beside J-EM-6', 'inline', 'hold the decomposition-first premise wherever a wave touches them.',
  f"[RULED {C} §3.2.19, §3.1.1, §3.1.9) — WC-2's derivation is spelled `derivedWarStanceOf(worldState, partyId, warEpisodeKey)` (the episode key is part of the spelling, L-WC-8's per-episode law); TR-5's executor sentence is superseded by §3.1.1 (EC-6 owns the read-side executor; GRAMMAR's `PACT_DRAFT_LENS` owns the producer); POP-4 FOLDS INTO PG (PG owns the arc; POP keeps the burial line and the disaster cause; `calamityArcs` is not minted). J-EM-6's other corrections stand and are now pointed from the §5 charters they correct.]"),
 ('OD-FC-20 + HB Q1 beside J-EM-9', 'inline', 'Veto surface: one word on F1..F8 re-parks WY-3/4/6.',
  f"[RULED {C} §7 OD-FC-20, by delegation, vetoable) — CR-WC-9 is read PARKED until chain 2 asks for a field (five records disagreed; the grant pre-dates the escalation); WC-0E's two normalizers stand. HB Q1 is no longer the owner's open gate: J-EM-15(2) read \"build it all\" as its signature (§12.8).]"),
 ('R10 + X1 J-EM-12', 'inline', 'LG-1.. waits on POP-1 as its §D says).',
  f"[CORRECTED {C}) — LG §D: LG-0..LG-8 are unblocked; only LG-9+ waits on POP-1. LG-0's willingness gate (a LIVE routing defect) is pulled forward alone (OD-FC-38, by delegation). The docs member is discharged: DESIGN_FP_ARCH_LG.md is on master; zero LG code.]"),
 ('R3 see-ref (J-EM-13)', 'inline', "(L1; the decree hook is EM's one call)",
  "[see the bracket at L1: EP-1's seam is the one FP edit]"),
 ('J-EM-14 superseded', 'inline', "until then the ledger's copy is one fold behind, and this sentence says so.",
  f"[SUPERSEDED BY EVENT {C}) — the ledger's copy now carries master's text (coherence fold §0: the base is master; the two copies are one truth after the fold).]"),
 ('R12 HB-3 row', 'inline', "Gated: HB Q1's two owner-gated persisted fields are unsigned",
  f"[CORRECTED {C}) — HB Q1 is SIGNED by the owner's word as read at J-EM-15(2) (§12.8); HB-3..HB-9 are released.]"),
 ('R12 see-ref (HB-5 row)', 'inline', '| NOT STARTED. Gated (HB Q1),',
  "[HB Q1 signed — see the HB-3 row]"),
 ('§3.2.19 WC-2 row', 'inline', 'Change the signature of `warStanceOf`, or give the derivation another name.',
  f"[RULED {C} §3.2.19) — another name: `derivedWarStanceOf(worldState, partyId, warEpisodeKey)`; `warStanceOf(rung)` keeps its accessor meaning.]"),
 ('§5 addendum REINFORCE (WC-4 row)', 'inline', 'Take `REINFORCE` (bind what is built) or `resupply`.',
  f"[RULED {C} §5, the §3.2 addendum, vetoable) — WC-4's executor LIGHTS the greyed realm verb `REINFORCE` (realmManifest.js:471–487) and routes the reactive `reinforce` move and the own-army flow (`reinforcement.js`) through one commitment seam; no separate `resupply` seal is minted.]"),
 ('R10 see-ref (§12.5)', 'inline', '(populations; POP-1 unlocks WY-4/5 and LG)',
  "[LG-9+ only — see the bracket at J-EM-12]"),
 ('OD-FC-20 see-ref (§12.5)', 'inline', 'WC-6 onward (CR-WC-9 signed)',
  "[read PARKED — OD-FC-20, see the bracket at J-EM-9]"),
 ('R12 see-ref (§12.5)', 'inline', 'HB-3..HB-9 **after the owner signs HB Q1**',
  "[signed — J-EM-15(2)]"),
 ('App. A §12.7.1 launch line', 'inline', "The signatures are pre-signed; the act is the owner's at the soak.",
  f"[CORRECTED {C}) — CLOSED by J-EM-15(1) (§12.8): THE LAUNCH LINE IS EVERYTHING; at 00b648c9d nine FP keys are lit and the rest stay dark for want of layers or prerequisites.]"),
 ('App. A §12.7.2 HB Q1', 'inline', 'Recommendation: sign; it releases HB-3..HB-9.',
  f"[CORRECTED {C}) — CLOSED: signed by J-EM-15(2).]"),
 ('S3/S4 + §3.2.20 (§12.8 35 keys)', 'inline', 'every one of the 35 keys in `ENGINE_GATED_VIRTUAL_RULE_KEYS` is dark in all seven presets',
  f"[CORRECTED {C}) — at 00b648c9d the manifest holds 43 entries (simulationRules.js:230–668) and NINE FP keys are lit (FP_LIT_ALIVE / FP_LIT_BELIEF / FP_LIT_WARPEACE, :789–802; see the status bracket at the head). RULED (coherence fold §3.2.20): ODQ §934.84's \"errandSpine and merchantHouses light at LIT-2\" (FPQ-19) was declined by the code — LIT-2 lit mediation only, and both are HELD DARK on purpose (:783–787: the envoy keys are dark everywhere; the houses have no pulse mount until TR-2b); FPQ-19's slot moves to TR-2b's lighting (EC Phase B) and to the envoy-key ruling OD-FC-39 (by delegation: the envoy pair and the statecraft head light in the belief presets with chain 1; `demographicsEnabled` / `routeLifecycleEnabled` with OD-FC-18; `warTerminationEnabled` with chain 2). No re-light without the owner's word (a same-seed shift).]"),
 ('§2a colophon', 'inline', 'Nothing is scheduled until the owner\nsequences it.*',
  f"[CORRECTED {C}) — the owner sequenced it: §12.5 dispatched FP-T1 and §12.8 records \"no just build it all shipped lit\"; the status of record is the coherence fold's §2.]"),
 ('§5 register SEAM-n (§13 heading)', 'after', "## §13 THE SEAM FAMILY — three waves, one flavour and one mount owed, added by the owner's word (the chair, session 87797a6a, Fable 5.1, 2026-09-24 11:38 EDT; every ruling vetoable by one owner clause)",
  f"[RULED {C} §5) — 'SEAM-n' here means this section's family (SEAM-0..3); prose says \"the SEAM family (§13)\", \"seam row n\" for §9's matrix and \"the T5 cars\" for the landed TE-NET-1 \"car SEAM-3/4/5\" commits; a new seam id is spelled `SEAM-<family>-<n>`.]"),
 ('OD-FC-37 SEAM-2 (X13/X14)', 'inline', 'The read: two neighbours of equal standing answer the same proposal differently, for a reason the Herald says.',
  f"[OWNER ROW OD-FC-37 — RULED BY DELEGATION {C} §3.1.19, §7; vetoable): one court-side truth, no third home. The NEED is EC's derived read (EC-17's need read, never persisted — the court knows its own shelves); the REGARD is THE STANDING's one centre (the owner's 2026-10-02 directive, STANDING-U0); SEAM-2's driver set is a READER of both — its `scarcity` is EC-17's need read by name and its `appetite` is SP-C's stock (mounted by SEAM-0). What this moves is what the STANDING lane persists.]"),
 ('bond see-ref (court bonds)', 'inline', 'The Herald voices the sealing ("a match sealed between the two courts") and its breaking as a cause.',
  "[prose: \"court bond\", never bare \"bond\" — see the bracket at WC-3]"),
 ('R11 §13 order clause', 'inline', "The wave count from this section on is 114 (the §5 header's 111 is the compile's figure and stays).",
  f"[CORRECTED {C}) — the pair cadence is the INVENTORY since FP-40 CHAIN-FIRST (2026-10-02, FP-ORDER.md), so this clause no longer orders anything: SEAM-0..3 are taken in the order of the chains they unlock (the coherence fold's §6, OD-FC-19); SEAM-0 is OWED and unslotted until a chain asks for SP-C's appetite. SEAM-2 overlaps THE STANDING (FPQ-78) and EC's persistent condition (ODQ §934.90 addendum 4): one court-side truth, ruled once — see the OD-FC-37 row at SEAM-2.]"),
 ('FV SEAM-0 (§13, no program-volume home)', 'inline', "**SEAM-0 — SP-C's MOUNT (owed, not new; rides pair 2 as a small unit of the spine's files).**",
  fv("none — instrumentation (the appetite facet's mount; felt only through SEAM-2's readers and SP-C's posture colour)", "aspatial-safe; host flag `strategicPostureEnabled` (dark in every preset)", "dark (the facet stays without data)")),
 ('FV SEAM-1', 'inline', "**SEAM-1 — THE STANDING DISPUTE** (flag `standingDisputeEnabled`, virtual per §3; SP with CW's exits).",
  fv("SEASONAL/YEARLY (the charter's own read: a dispute heats and exits within twenty advances — FOLD-SMALL §7); the fast-layer sign is the heat's news kind", "aspatial-safe (a typed bucket); host flag `standingDisputeEnabled` (unminted)", "dark")),
 ('FV SEAM-2', 'inline', "**SEAM-2 — THE NEIGHBOUR'S OWN DRIVERS** (flag `neighbourDriversEnabled`; SP).",
  fv("UNMEASURED", f"host flag `neighbourDriversEnabled` (unminted); the beliefs ABOUT the drivers need {BELIEF}", "dark")),
 ('FV SEAM-3', 'inline', "**SEAM-3 — LAW ACROSS THE SEAM** (flag `seamLawEnabled`; GR + IN).",
  fv("UNMEASURED", "host flags `seamLawEnabled` (unminted) + the errand spine (`errandSpineEnabled`, dark in every preset — FOLD-SMALL §8: DEFER)", "the outlaw band is a news fact before POP is lit (the charter's own arm); otherwise dark")),
]

# ============================ DESIGN_FP_ARCH_CN.md ============================
E['DESIGN_FP_ARCH_CN'] = [
 ('STATUS + R13 (§5.8)', 'afterp', '## CHARTER remains the citable home and this draft is the proposed fold.',
  f"[CORRECTED {C}) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. LANDED on the ledger at 1d77ceb67 (2026-08-16); NOT on master; NOT in the compiled order; carries none of the spine's obligations (no Req 13/14 or L10 line, no coupling prefix, no annex). In one line: LIT: none · BUILT DARK: none · UNBUILT: cn-1..cn-6 entire (zero code at 00b648c9d: `stressorPinsEnabled`, `externalBesiegersEnabled`, `warCouncilModel` — 0 hits).]\n\n"
  f"[OWNER ROW OD-FC-38 — RULED BY DELEGATION {C} §3.1.20, §7; vetoable): CN is FOLDED INTO THE EDIT MODE PROGRAM — it is a DM surface written in the pre-Edit-Mode Change-Dock idiom L10 replaced (the compiled fold's L10, J-EM-2). cn-1/cn-2 (the read model and the tab) are KEPT; cn-3's verbs become `REALM_MANIFEST` / `DIRECTION_OP_TYPES` rows under L10, never command specs of their own; cn-4's persisted stressor pin is NOT minted — the DM's hold is Edit Mode seal 6 `letSiegeFall` (a `pin-fork` over HBF-86 `SIEGE_VERDICT_BANDS`) plus an HBF-84 `STRESSOR_LIFECYCLE_STAGES` stage directive; cn-5's external host reconciles with L10(c)'s PHANTOM. OQ-1 (are command powers tier-gated, and is AUTHOR priced apart from ORDER) is a paid-surface question inside this row and stays OPEN. Vocabulary (§5): CN's 'pin' is not minted; read 'seal' for an Edit Mode hold and 'pin' for a test.]"),
 ('OD-FC-38 see-ref (slotting)', 'inline', '- **SLOTTING (§130.2):**',
  "[superseded by OD-FC-38 at the head: re-sequenced into the Edit Mode program]"),
 ('S14 SIEGE_MAX_AGE address', 'inline', '**`SIEGE_MAX_AGE = 60` :101 — a backstop that force-ends long sieges**',
  f"[CORRECTED {C}) — address rot: `warSiegeVerdict.js:179` at 00b648c9d; the value is still 60.]"),
 ('§3.3.9 WarFaithTab', 'inline', '`WarFaithTab.jsx:1–27`',
  f"[CORRECTED {C} §3.3.9) — WarFaithTab no longer exists: the §805 split moved the war half to `src/components/new/tabs/WarTab.jsx` and the faith half to `FaithTab.jsx` (dossierLazyTabs.js:27, :50).]"),
 ('§5 register CONDITION_BANDS', 'inline', '`CONDITION_BANDS` :94',
  f"[RULED {C} §5) — `CONDITION_BANDS` is armyStrength.js's own (module-local at :133 at 00b648c9d, exported through `ARMY_STRENGTH_PHRASES` :237); EC's market ladder is `MARKET_CONDITION_BANDS`; WY-8b reuses this ladder.]"),
 ('X15 law 2 beside', 'inline', 'provenance-carried, undo-covered, honest per THE PROMISE (orders are events, never\n   rewrites).',
  f"[RULED {C} §3.1.20; OD-FC-38) — see the bracket at cn-3: under L10 a console verb is a REALM_MANIFEST / DIRECTION_OP_TYPES row through the one mutation boundary, not a command spec through C3's `execute`.]"),
 ('§5.9 flag count', 'inline', 'TWO engine-gated virtual flags mint in this family,',
  f"[CLARIFIED {C}) — the count of THIS family's flags as chartered 2026-08-15; neither is minted at 00b648c9d (0 hits).]"),
 ('FV cn-1', 'after', '### cn-1 — THE WAR READ MODEL (one view model, belief-first)',
  fv("none — instrumentation (a headless view model; felt only through cn-2's tab and cn-6's chapter)", f"{WARGATE}; belief sections need {BELIEF}", "omniscient or aspatial worlds render the fact plane, no mirror (cn-2's feeder map)")),
 ('FV cn-2', 'after', '### cn-2 — THE WAR TAB READ SURFACES (dormancy-as-absence mounting)',
  fv("UNMEASURED (a read surface shown whenever the war tab opens on a war-live settlement; no advance clock measured)", "as cn-1; the LG-fed sections need `circleNetworkEnabled` ∧ `vesselFleetsEnabled` (unminted) and spatial canon", "in-fiction absence per section until its feeder lights (CN law 4)")),
 ('FV cn-3', 'after', '### cn-3 — THE CONSOLE (typed ops through the one dispatch point; every verb two-hatted)',
  fv("WEEKLY — an ORDER moves on weekly legs (law M) and becomes a world-input event the next tick consumes; the order receipt is its first sign (FOLD-SMALL §7: the one family whose drama lives at the session clock)", f"{WARGATE}; order-class message latency needs a non-omniscient infoMode; paid tier: OQ-1 (inside OD-FC-38)", "dark — no live war, no console (in-fiction absence, CN law 3); omniscient worlds carry orders without message physics")),
 ('X15 cn-3 RULED', 'inline', "C3's `execute`, each with its ORDER and AUTHOR variants (§129.2):",
  f"[RULED {C} §3.1.20; OD-FC-38, by delegation) — under L10 each verb below is a `REALM_MANIFEST` row (realm-scale: deploy/recall toward a court, the envoy, the peace proposal) or a `DIRECTION_OP_TYPES` row (settlement-scale), through the one mutation boundary and `authorityFor` — never a bespoke command spec or a third registry (J-EM-2). The two-hat law (§2 law 10) stands as the content of those rows.]"),
 ('FV cn-4 + R16 + X16', 'after', '### cn-4 — THE STRESSOR PIN (mints `stressorPinsEnabled`; solo train per the flag-boundary law)',
  fv("per tick — the DM's own hand; the held state shows from the first advance after the toggle (FOLD-SMALL §7: session clock)", "aspatial-safe (a stressor-record read)", "dark (flag off ⇒ byte-identical)") + "\n"
  f"[NOTED {C}) — overlaps Edit Mode seal 6 `letSiegeFall` (HBF-86 `SIEGE_VERDICT_BANDS`, the compiled fold's §12.2) and HBF-84 `STRESSOR_LIFECYCLE_STAGES`; and L10 requires the verb as a REALM_MANIFEST / DIRECTION row, not a command spec. RULED (§3.1.20; OD-FC-38, by delegation): the persisted pin field is NOT minted — the DM's hold is seal 6 plus an HBF-84 stage directive; this charter stands as the design record of what the hold must do (§2 laws 5–7: the resolution arm only, clamped floors, the dyadic clause) and is re-read against Edit Mode at its compile.]"),
 ('FV cn-5 + X17', 'after', '### cn-5 — THE EXTERNAL HOST + THE CONVERSION VALVE (mints `externalBesiegersEnabled`; solo train)',
  fv("UNMEASURED", f"{WARGATE}; a siege needs the war layer", "dark (flag off ⇒ byte-identical; unpinned external sieges resolve organically when lit)") + "\n"
  f"[RULED {C} §3.1.20; OD-FC-38, by delegation) — the external authored host reconciles with L10(c)'s PHANTOM (a minimal save record, `kind: 'phantom'`, no simulated side) rather than minting a second record kind. The conversion valve is pin-conditional; with cn-4's pin not minted its trigger must be re-read against seal 6 (FOLD-SMALL §8: CUT-TO-SENTENCE until a held siege exists in a shipped world) — owed a chair ruling at the Edit Mode fold.]"),
 ('FV cn-6', 'after', '### cn-6 — PDF ALIGNMENT + POLISH (the projection closes)',
  fv("UNMEASURED (a PDF projection; no advance clock)", "the PDF war chapter is premium + canon-only (C14); host flags as cn-1", "the chapter's existing shared-selector projection")),
 ('OQ-1 inside OD-FC-38', 'inline', "Owner signs at cn-3's compile at the latest.",
  f"[OWNER ROW OD-FC-38 — {C} §7) — this paid-surface question sits inside OD-FC-38 and stays OPEN; the delegated ruling settled membership, not the price.]"),
]

# ============================ DESIGN_FP_ARCH_LG.md ============================
E['DESIGN_FP_ARCH_LG'] = [
 ('STATUS (LG)', 'inline', 'the build branch, CLAIM_RE-checked, at the next integration point.',
  f"[CORRECTED {C}) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. The fold obligation is DISCHARGED: this volume is on master (J-EM-12). It is NOT in the compiled order and carries none of the spine's obligations (no Req 13/14 or L10 line, no coupling prefix, no annex). In one line: LIT: none · BUILT DARK: none · UNBUILT: LG-0..LG-13+ entire (zero code at 00b648c9d: `circleNetworkEnabled`, `vesselFleetsEnabled` — 0 hits).]"),
 ('OD-FC-38 (LG)', 'after', '  cite THIS volume plus the graded substrate — never the volume alone.',
  f"- [OWNER ROW OD-FC-38 — RULED BY DELEGATION {C} §3.1.20, §7; vetoable): LG stays FP-ADJACENT and takes requirement 15's obligations before any wave compiles — a requirement-13 Alignment line and an L10 EDITOR line per wave, a coupling prefix chartered in the same commit as its first registry row (§3.3.2, requirement 21c; `CHARTERED_VOLUME_PREFIXES` excludes LG today), and a named receipt annex; LG-0's willingness gate (Q2: a LIVE defect, hostile routing through a target's circle) is PULLED FORWARD ALONE, ahead of the rest of the family.]"),
 ('FV LG-0', 'inline', '- **LG-0 — THE WILLINGNESS GATE**',
  fv("UNMEASURED (the repair is a refusal — a hostile route that no longer crosses a target's circle; LG travel is felt at the weekly clock, FOLD-SMALL §7)", "spatial canon (one graph over `distanceRead`)", "dark (no graph in an aspatial world)")),
 ('FV LG-1', 'inline', '- **LG-1 — GRAPH FORMALIZATION**',
  fv("none — instrumentation (the political predicate and capacity as edge attributes; the relay becomes guarded)", "spatial canon", "dark")),
 ('FV LG-2', 'inline', '- **LG-2 — FLEETS**',
  fv("UNMEASURED (rebuild timers run at the seasonal clock, FOLD-SMALL §7)", "spatial canon", "dark")),
 ('FV LG-3', 'inline', '- **LG-3 — AIRSHIP TRAVEL**',
  fv("WEEKLY (travel, FOLD-SMALL §7)", "spatial canon; host flag `vesselFleetsEnabled`", "dark (the existing roads and sea lanes)")),
 ('FV LG-4', 'inline', '- **LG-4 — INTERCEPTION**',
  fv("none until LG-13+ (producers land here, prose after — the GR law)", "spatial canon; host flag `vesselFleetsEnabled`", "dark")),
 ('FV LG-5', 'inline', '- **LG-5 — WAR LOGISTICS**',
  fv("WEEKLY (travel, FOLD-SMALL §7)", "spatial canon; host flags: the war layer (`warLayerEnabled`, lit only in dramatic_campaign and full_simulation)", "dark")),
 ('FV LG-6', 'inline', '- **LG-6 — THE RESCUE EXCEPTION**',
  fv("UNMEASURED", "spatial canon (route-absence is a graph query); war-gated", "dark")),
 ('FV LG-7', 'inline', '- **LG-7 — ENVOY VESSELS**',
  fv("WEEKLY (travel, FOLD-SMALL §7)", "spatial canon; host flags: the envoy keys (`envoyDiplomacyEnabled`, dark in every preset — OD-FC-39)", "dark")),
 ('FV LG-8', 'inline', '- **LG-8 — NEWS CARRIAGE**',
  fv("WEEKLY (vessel arrivals)", BELIEF, "a proven no-op under omniscient (Q8)")),
 ('FV LG-9..12', 'inline', '- **LG-9..12 — THE JOURNEY WAVES**',
  fv("UNMEASURED", "spatial canon; host flags: `vesselFleetsEnabled` ∧ the ES mission flags (`errandSpineEnabled`, `espionageEnabled` — dark in every preset); BLOCKED-ON POP-1", "dark (a missing producer blocks the wave, L-LG-6)")),
 ('FV LG-13+', 'inline', '- **LG-13+ — PROSE/DOSSIER WAVES**',
  fv("UNMEASURED (the producers' sentences; no DM-felt sentence is authored anywhere in this volume yet — FOLD-SMALL §1)", "as their producers", "dark")),
 ('§3.2.16 size-scaled speed', 'inline', 'slower with size (chair-derived bands, §42/§43; the transit kernels\n  gain the read).',
  f"[CLARIFIED {C} §3.2.16; OD-FC-13, by delegation) — the owner's §125.4 size-scaled speed binds: for columns it is a WY-4 band (column speed by size band, the army idiom), not an LG mechanism; LG consumes it.]"),
 ('R17 + §3.1.7 (§C)', 'after', 'follows the existing includeGroundTruth seam.',
  f"[NOTED {C}) — WC-0 (landed) widened the column predicates with `MILITARY_COLUMN_CLASSES` outside a POP-family wave. RULED (§3.1.7): the union stays (it shipped); ownership reads \"POP owns the CIVILIAN classes, WC the MILITARY classes, ONE union, one `columnOf` whitelist\"; the return class is ruled ONCE across POP/WC/LG/ES as `column_return` (not `returning`).]"),
 ('§D vs J-EM-12', 'after', 'with other families under the standard dependency rules.',
  f"[CLARIFIED {C}) — this section is right and the compiled fold's J-EM-12 (\"LG-1.. waits on POP-1\") is the stale text (bracketed there). Before any wave compiles, the OD-FC-38 obligations at the head bind; LG-0 goes first and alone.]"),
]

# ============================ DESIGN_FP_ARCH_PG.md ============================
E['DESIGN_FP_ARCH_PG'] = [
 ('STATUS + R13 + OD-FC-38 (PG)', 'afterp', '## citable home and this draft is the proposed fold.',
  f"[CORRECTED {C}) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. LANDED on the ledger at 1d77ceb67 (2026-08-16); NOT on master; NOT in the compiled order; carries none of the spine's obligations (no Req 13/14 or L10 line, no coupling prefix, no annex). In one line: LIT: none · BUILT DARK: none · UNBUILT: pg-0..pg-4 entire (zero code at 00b648c9d: `contagionEnabled`, `afflictionBand`, `plagueTouched` — 0 hits; `CONDITIONS_KEYS` still four, beliefAxisSubjects.js:123).]\n\n"
  f"[OWNER ROW OD-FC-38 — RULED BY DELEGATION {C} §3.1.20, §7; vetoable): PG stays FP-ADJACENT and takes requirement 15's obligations before any wave compiles — a requirement-13 Alignment line and an L10 EDITOR line per wave, a coupling prefix chartered in the same commit as its first registry row (§3.3.2; see the bracket at §5 item 5), and a named receipt annex (today it rides POP's).]"),
 ('§3.1.9 one plague truth names POP-4', 'afterp', '## second plague system has failed, however green its gate.',
  f"[RULED {C} §3.1.9) — ONE PLAGUE TRUTH now names POP-4: POP-4 (THE PLAGUE ARC — DESIGN_FP_ARCH_POP.md, the compiled fold's #45) FOLDS INTO PG — PG owns the arc, the resistance and contagion-on-arrival; POP keeps the burial LINE (THE BELLS, a Herald generalisation) and the disaster cause; the `calamityArcs` ledger is not minted (its name collided with the lit calamityKernel).]"),
 ('OD-FC-38 see-ref (slot)', 'inline', 'The pg family compiles beside cn in the family-train tail,',
  "[re-read under OD-FC-38 at the head: cn is folded into Edit Mode, and pg compiles only after requirement 15's obligations land]"),
 ('§5 register pin (first use)', 'inline', '| the stressor pin interplay — CITE-ONLY, already ruled',
  f"[RULED {C} §5, §3.1.20) — CN's persisted stressor pin is not minted; the DM's hold on a stressor is an Edit Mode seal (a `pin-fork` directive), and 'pin' in prose means a test. Every §128 interplay row in this volume is re-read against the seal at its compile.]"),
 ('FV pg-0', 'after', '## §2 · pg-0 — THE FLAG',
  fv("none — instrumentation (a flag mint)", "n/a (gates pg-1/pg-2)", "dark")),
 ('FV pg-1', 'after', '### pg-1 — CONTAGION-ON-ARRIVAL',
  fv("SEASONAL (plague fronts, FOLD-SMALL §7) — the landed \"Plague reaches X\" (`plague_arrival`) when a plague-touched column lands and the onset takes", "spatial canon (the marker: migrationActive and epidemicActive — ruling 5); the P2 arm also needs `demographicsEnabled` (lit in no preset, OD-FC-18)", "dark — marker absent ⇒ zero writes, byte-identical (ruling 5)")),
 ('§3.1.7 column union (pg-1 ruling 2)', 'inline', 'says the shape refusals surface at compile, not at design).',
  f"[CLARIFIED {C} §3.1.7) — the column union is ruled: POP owns the civilian classes, WC the military, one `columnOf` whitelist; `plagueTouched` is a FIELD and still owes its carry-through row there.]"),
 ('FV pg-2', 'after', '### pg-2 — RESISTANCE AND DURATION',
  fv("SEASONAL (plague duration, FOLD-SMALL §7)", "aspatial-safe for the birth-gate arm (`diseaseOutbreakGate`); spatial canon for the onset arm (M11a, the epidemic ledger)", "aspatial worlds get the birth-gate arm only (FOLD-SMALL §7); the counterforce decay arm's tier is UNMEASURED")),
 ('FV pg-3', 'after', '### pg-3 — BELIEF-BASED REFUSAL AT THE GATES',
  fv("SEASONAL (belief decay, FOLD-SMALL §7) — \"refused at the wall\" with the plague reason", f"{BELIEF}; host flags `believedMigrationEnabled` (POP-1, unbuilt) ∧ `beliefAxesEnabled` ∧ `believedConditionsEnabled` ∧ `contagionEnabled`", "contagion lit, belief dark ⇒ plague seeds and nobody refuses (ruling 5)")),
 ('§3.1.21 afflictionBand', 'inline', "SP-B's whole gate machinery for no added fiction.",
  f"[RULED {C} §3.1.21) — an axis addition is SP-B's by its one-writer-family rule: pg-3 lands `afflictionBand` as a ROW in `beliefAxisSubjects.js` under SP-B's extension clause, with the ES-1 legRefs census amended in the same commit; `CONDITIONS_KEYS` holds four keys at 00b648c9d (beliefAxisSubjects.js:123).]"),
 ('FV pg-4', 'after', '### pg-4 — OTHER COHERENCES, priced as candidates (none in pg-1..3 scope)',
  fv("UNMEASURED (candidates, each its own act)", "per item", "per item")),
 ('§3.3.2 PG prefix', 'inline', '⚠ ONE new coupling row moves THREE pins (the ES-Da lesson) — priced per row.',
  f"[RULED {C} §3.3.2, requirement 21c) — `CHARTERED_VOLUME_PREFIXES` excludes PG (tests/domain/couplingRegistry.test.js:119); the PG prefix is chartered in the SAME commit as its first registry row.]"),
]

# ============================ DESIGN_FP_ARCH_MF.md ============================
E['DESIGN_FP_ARCH_MF'] = [
 ('R15 + §5 FABRIC rename', 'after', '## (the Watabou/FTG clone, truth-bound — the settlement-map fabric overhaul)',
  f"[NOTED {C}) — a presentation program, not FP; the DESIGN_FP_ARCH_ prefix is lane UF-1's naming; distinct from MF-CH2B (the magic shelf gate). RULED (§5): in prose this is \"the FABRIC program\"; its file keeps its name until OD-FC-38 moves it.]"),
 ('STATUS + R13 + OD-FC-38 (MF)', 'afterp', "## lane's** — this file is delivered to scratchpad and no docs/ path was written.",
  f"[CORRECTED {C}) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. LANDED on the ledger at 1d77ceb67 (2026-08-16); NOT on master; NOT in the compiled order; carries none of the spine's obligations (no Req 13/14 or L10 line, no coupling prefix, no annex). In one line: LIT: none · BUILT DARK: none · UNBUILT: MF-1..MF-7 entire (zero code at 00b648c9d: `mapFabricEnabled` / `map-fabric` — 0 hits; `LAYOUT_LAW_VERSIONS = [1, 2]`, mapEdits.js:123 — Door B's v3 is not minted).]\n\n"
  f"[OWNER ROW OD-FC-38 — RULED BY DELEGATION {C} §3.1.20, §7; vetoable): the FABRIC program is OUT of FP — a presentation program (\"Zero simulation-engine changes; zero persisted-state changes\", §0) that belongs to the map program's own family; the file keeps its name until it is moved under this row. It is distinct from the landed MF-CH2B (the magic shelf-gate census).]"),
 ('§5.9 August count', 'inline', 'the contributionLedgerShape.test.js:51-52 length-22 literals moving to 23)',
  f"[CLARIFIED {C}) — an August count (2026-08-16), Door A's bill only; re-derive at compile.]"),
 ('R14 + X22 + S13 + §5 kmScale', 'inline', "no `kmScale` and no physical-distance metric exists anywhere in the estate (the digest's matrix is integer cost units; the traveler read is hopWeeks TIME).",
  f"[CORRECTED {C}) — WY-1 (`bfe4830d0`) minted `spatialDigest.kmScale`, km per REALM map unit (nothing writes it yet, FPQ-37); the town plan's `viewMetersPerUnit` is still owed by MF-5 — the conclusion stands. RULED (§5): distinct identifiers; prose says \"the world scale\" for kmScale and \"the map's scale bar\" for this family's.]"),
 ('FV MF-1', 'inline', '- **MF-1 fabric model:**',
  fv("none — a headless model (felt when a lens renders it, MF-4)", "aspatial-safe (a pure projection, `fabric = f(settlement, style)`)", "the legacy v1/v2 plan (until §14's cutover)")),
 ('FV MF-2', 'inline', '- **MF-2 dressed ground:**',
  fv("every view (render-time, FOLD-SMALL §7)", "aspatial-safe", "the legacy v1/v2 plan")),
 ('FV MF-3', 'inline', '- **MF-3 walls/water/roads:**',
  fv("every view (render-time)", "spatial canon for the TRUE exit-road bearings (the frozen digest); aspatial-safe otherwise", "standalone settlements take the seeded slot layout, declared (§2 law 4)")),
 ('FV MF-4', 'inline', '- **MF-4 the ten-role lens architecture:**',
  fv("every view (render-time)", "aspatial-safe", "the legacy lenses")),
 ('FV MF-5', 'inline', '- **MF-5 cartography chrome:**',
  fv("every view (render-time)", "aspatial-safe; the TRUE scale bar needs its derivation home (§2 law 6)", "a walking-time bar, or the TRUE claim CUT per §8.2 (§2 law 6)")),
 ('FV MF-6', 'inline', '- **MF-6 tools:**',
  fv("on use (render-time tools)", "aspatial-safe; the measure is TRUE only under §2 law 6's home", "the legacy tools")),
 ('FV MF-7', 'inline', '- **MF-7 export + PDF projection parity**',
  fv("on export (render-time)", "aspatial-safe", "the base-geometry 08C plate (untouched)")),
 ('kmScale see-ref (§11.12 a)', 'inline', '(a) THE TRUE MEASURE MINTED — the physical-distance metric gets its derivation home inside this family',
  "[see the bracket at §2 law 6: the world scale exists since WY-1; this family's home is the town map's scale bar]"),
]


def apply(name, edits):
    base = open(BASES[name], encoding='utf-8').read()
    ops = []
    missing = []
    for (rid, mode, anchor, text) in edits:
        n = base.count(anchor)
        if n != 1:
            missing.append((rid, n, anchor))
            continue
        i = base.index(anchor); j = i + len(anchor)
        if mode == 'inline':
            pos, chunk = j, ' ' + text
        elif mode == 'after':
            k = base.find('\n', j); pos = (len(base) if k < 0 else k); chunk = '\n' + text
        elif mode == 'afterp':
            k = base.find('\n', j); pos = (len(base) if k < 0 else k); chunk = '\n\n' + text + '\n'
        else:
            raise SystemExit(mode)
        ops.append((pos, chunk, rid))
    if missing:
        for m in missing:
            print('ANCHOR', name, m)
        raise SystemExit('missing anchors')
    ops_sorted = sorted(enumerate(ops), key=lambda t: (t[1][0], t[0]))
    out = []; last = 0
    for _, (pos, chunk, rid) in ops_sorted:
        out.append(base[last:pos]); out.append(chunk); last = pos
    out.append(base[last:])
    dest = ''.join(out)
    tmp = dest
    for (pos, chunk, rid) in ops:
        assert tmp.count(chunk) >= 1, rid
        tmp = tmp.replace(chunk, '', 1)
    assert tmp == base, f'{name}: reconstruction != base'
    assert '\x00' not in dest
    open(f'{DST}/{name}.md', 'w', encoding='utf-8').write(dest)
    rows = []
    for (pos, chunk, rid) in ops:
        line = dest[:dest.index(chunk)].count('\n') + 1 + (1 if chunk.startswith('\n') else 0)
        rows.append((rid, line))
    return rows

if __name__ == '__main__':
    report = {}
    for name, edits in E.items():
        report[name] = apply(name, edits)
    json.dump(report, open(f'{KIT}/amend/H_applied.json', 'w'), indent=1, ensure_ascii=False)
    for name, rows in report.items():
        print(name, len(rows))
        for rid, line in sorted(rows, key=lambda r: r[1]):
            print(f'  {line:5d}  {rid}')
