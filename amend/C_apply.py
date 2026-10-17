# LANE C amendment applier — exact-string anchors, each asserted unique in the BASE.
# Modes: after (new line after the anchor's line) · before (new line before the anchor's line)
#        inline (" " + text right after the anchor) · para (own paragraph after the anchor's
#        line and the blank line that follows it — used after tables).
import sys, json

KIT = '/Users/cstokes/Desktop/settlement-engine-kits/fp-coherence-2fc13d59-2026-10-16'
DST = '/Users/cstokes/Desktop/settlement-engine/docs'
C = '2026-10-16 (coherence fold'
W = '2026-10-16 (coherence fold, req 16/17) — '

def fv(first, tier, degraded):
    return f'[ADDED {W}FIRST-VISIBLE: {first} · TIER: {tier} · DEGRADED ARM: {degraded}]'

BELIEF = 'belief infoMode (spatial canon ∧ infoMode ≠ omniscient)'
ESTIER = f'{BELIEF} · host flags: `errandSpineEnabled` + `espionageEnabled`'

E = {}

# ============================ DESIGN_FP_INFORMATION.md ============================
E['DESIGN_FP_INFORMATION'] = [
 ('R1 status header', 'after', '(spine §5: SP → GRAMMAR → INFO → …). Every wave ships DARK. The §6 judgment',
  f"[CORRECTED {C}) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. In one line: LIT: none (no IN flag, and neither host flag `infoStatecraftEnabled` nor `informationBrokeragesEnabled`, is true in any preset) · BUILT DARK at 00b648c9d: IN-0a/0b/0c/0d (the HIDE toll INERT, zero consumers), IN-1a/1b (a DM display only; `wealthShown`/`devotionShown` hard-wired 'unknown'), IN-2 (the axis law; `lureCommission` has no production caller), IN-3 (reads + Watch panel + Houses block; every verb unmounted pending U123), IN-4/1-2 (the race; couriers not), IN-5/1 (the seventh desk + refile), IN-6 (the instrument) · UNBUILT: IN-1c-b, IN-2-c (the commission's consumer, U123), IN-3's verbs, IN-4b couriers, IN-5/2 (the arc) and `court_sat_still` (zero hits in src).]\n"
  f"[ADDED {C}, req 17) — TIER DECLARATION for every wave in this volume: the medium runs only where `beliefsActive` holds — the spatial canon marker AND `infoMode !== 'omniscient'` (beliefMap.js:204-209); the default infoMode is 'omniscient' (simulationRules.js:56), so no IN mechanism runs in an aspatial world nor in a spatial world under the default rules. Only three presets record beliefs: dramatic_campaign and living_realm ('perfect_delayed', simulationRules.js:953, :996) and full_simulation ('full', :1073). On top of that every IN wave needs `infoStatecraftEnabled` and/or `informationBrokeragesEnabled`, dark in every preset, and ES (DESIGN_FP_ARCH_ES.md) needs `errandSpineEnabled`, dark everywhere. Paid-tier sense: the spatial canon is the premium tier (anonymous = town, free = village + town), so this whole family is premium-only by construction. Each wave below carries its own FIRST-VISIBLE/TIER line.]"),
 ('R2/S1 thesis plant (C1)', 'after', 'reported-not-made); and the whole knowledge lane speaks 4 beats among 269 routed',
  f"[CORRECTED {C}) — HISTORICAL (the 2026-08-02 survey). The fold was already built (DESIGN_FP_ARCH_IN.md §1b R1) and IN-0a landed the pulse handoff (`brokeragePlantHandoff.js`; `appliedPlantEnvelopesAt` consumed at informationStatecraft.js:1387 and envoyPulse.js:207): the bought lie plants wherever both host flags are lit. The race has a consumer too (see the bracket at §2's race row). Read §5 IN-0a's Model as superseded by AIN §4 IN-0a.]"),
 ('vocab lure (§5)', 'inline', 'a bait (the lure)',
  f"[RULED {C} §5) — in this volume \"lure\" is ONLY the bought lie (IN-2); FAITH's sack lure is \"the sack's draw\" in prose.]"),
 ('OD-FC-12 M9b row (§3.2.15)', 'inline', '`beliefMap.js:801-1009` | BUILT',
  f"[OWNER ROW OD-FC-12 — {C} §3.2.15) — a MEASUREMENT CAR is owed (PLAUSIBLE, reasoned from code): an adopted ally share REPLACES the receiver's whole seat record (beliefMap.js:1117) and carries only the six core keys, dropping believed scarcity/conditions/devotion and the D-1 axes; the next report re-seeds an absent axis from GROUND TRUTH (beliefAxes.js:225) — a K3 truth leak in full_simulation. The fixture (ally share → adoption → next report; the axes survive or re-seed from the prior, never from truth) rides the next spine lane; a confirmed cure is a one-time full_simulation belief shift the owner signs.]"),
 ('§2 HIDE row (§3.1.4 pointer)', 'inline', '**HIDE\'s trade tax** (narrated, unwired)',
  f"[CORRECTED {C}) — IN-0d landed the read (`secrecyTradeFactor.js`, zero consumers by design); its home is RULED at coherence fold §3.1.4 — see the bracket at IN-0d.]"),
 ('S20 §2 disclosure row (IN-0c landed)', 'inline', 'PARTIAL — minted, strains, expires; the feed effect never executes',
  f"[CORRECTED {C}) — IN-0c LANDED after this volume and after DESIGN_FP_ARCH_IN.md's first handoff: `peaceTermsDisclosure.js` (the signing credit at T+1, mounted informationStatecraft.js:1487) + `disclosureFidelityFor`; `treaty_disclosure_opened` is GRAMMAR-voiced (grammarNews.js:118) and routes 'trade' (heraldRouting.js:270).]"),
 ('S1 §2 PLANT_WIRING row', 'inline', 'the bought lie charges the buyer and plants NOTHING',
  f"[CORRECTED {C}) — see the bracket at the thesis: IN-0a landed and PLANT_WIRING now names the landing.]"),
 ('R8/S2 §2 race row', 'inline', 'BUILT, **ZERO consumers in src/** (executed grep) — "the thing the machinery is for" narrates nothing',
  f"[CORRECTED {C}) — first consumer `reputationRaceConsumer.js` (IN-4/2), mounted in the lifecycle host (settlementLifecycleKernel.js:591). Refugee columns are NOT raced (`RACE_ARRIVAL_KINDS = ['army','envoy','exile']`, reputationRaceConsumer.js:103; the column is deleted at release): a declared gap, not the degraded arm §3 names. The race kinds route 'events' (heraldRouting.js:338).]"),
 ('S5 §2 Herald row', 'inline', 'BUILT, THIN — war carries 68 tokens and a section',
  f"[CORRECTED {C}) — see the bracket at IN-5(a): the seventh section `knowledge` landed at IN-5/1.]"),
 ('S7 §2 sightPostures row', 'inline', 'BUILT, **no UI consumer** — the DM cannot see standing espionage even as DM truth',
  f"[CORRECTED {C}) — HISTORICAL: IN-3 mounted `WatchPanel.jsx` (5731d4052).]"),
 ('S8/S10 §2 projections row', 'inline', "the 'exposed' list is a parameter nothing supplies",
  f"[CORRECTED {C}) — HISTORICAL: `HousesBlock.jsx:40` projects patron bindings and `projectPlants` (now brokerageServicesPlant.js:577) is mounted at briefs/composers.js:97, still fail-OPEN on its default (J-INF-17 stands).]"),
 ('S3 §2 gate-stack row', 'inline', 'knowledge-lane starvation is FIRST on the owner-held tuning agenda (DESIGN_REALM_DIRECTIVES.md:49)',
  f"[CORRECTED {C}) — the four IN flags and `espionageEnabled` are manifested (simulationRules.js:290-411) and `intelTradeEnabled` joined the manifest (IN-4/1 `9e916163b`); `distancePricedNewsEnabled` (:743) and `allyIntelSharingEnabled` (quiet_local :897, full_simulation :1082) are LIT in shipped presets; no IN wave flag and neither host flag is lit anywhere. See the Tier declaration at the head.]"),
 ('S2 §2 absent-list race', 'inline', 'structure (the belief schema stores world-attributes only; every deception\ntargets minds through engine omniscience) · any reputationRace consumer',
  f"[CORRECTED {C}) — see the bracket at §2's race row.]"),
 ('R9/S4 WAR_REASON_TYPES', 'inline', 'the 13 WAR_REASON_TYPES carry none',
  f"[CORRECTED {C}) — sixteen (warReasonTaxonomy.js:24-41); J-INF-9's substance holds.]"),
 ('R3/C2 SEND-TWO first site', 'inline', 'zero `envoyErrand|sendTwo|SEND_TWO` hits in src/)',
  f"[CORRECTED {C}) — DISCHARGED: WR-7d built first; `sendTwoDivergence.js` is the one home (DESIGN_FP_ARCH_IN.md §1b R2, J-INF-15 discharged) and IN-3 consumes it (counterIntelSweep.js:44). VET's vocabulary is built there too (VETTING_QUALITIES).]"),
 ('R4/C3/S9/S13 believed axes first site', 'inline', 'does not exist yet). [CORRECTED 2026-08-02 (fp-audit)]',
  f"[CORRECTED {C}) — UNBLOCKED by SP-B (ARCH J-FP-5): `SCARCITY_BANDS` and `DEVOTION_BANDS` are live (beliefAxisSubjects.js:85, :115) and every family's lure axis is built (infoLure.js:157-199). What is missing is the commission's CONSUMER (U123), not the substrate. The DisinfoRecord comparator is axis-typed as built. `CHANNEL_BELIEF_AXES.trade` is STILL empty (brokerageServices.js:129), so brokerage houses vouch for no SP-B belief.]"),
 ('R4 §3 lit-preconditions', 'inline', "(§2's Verified-ABSENT)",
  f"[CORRECTED {C}) — unblocked by SP-B; see the bracket at §2's Verified-ABSENT list.]"),
 ('R3 §3 SEND-TWO', 'inline', 'rules ownership if INFO lights first.',
  f"[CORRECTED {C}) — DISCHARGED; see the bracket at §2's Verified-ABSENT list.]"),
 ('S2/T10 §3 refugee degraded arm', 'inline', 'refugee columns — a named degraded arm).',
  f"[CORRECTED {C}) — refugee columns are NOT raced as built; see the bracket at §2's race row.]"),
 ('C1 seam contract one', 'inline', 'exposure law (2-band contradiction or shelf-life), one blowback triple.',
  f"[CORRECTED {C}) — the contract HOLDS; its spelling moved: `processLies` takes `commissionedPlants` (AIN R1) and IN-0a carries the envelope through `brokeragePlantHandoff.js`. See the bracket at the thesis.]"),
 ('C14 seam contract three', 'inline', 'ledgered and all already decaying on their own laws.',
  f"[CORRECTED {C}) — false for three of the seven families; see CR-IN1-7 and the bracket at IN-1's Model.]"),
 ('R5/C4 devotion two axes (code block)', 'after', '  // label-inequality, not band distance — stated, not discovered. Each',
  f"  // [CORRECTED {C}) — TWO axes: faithLabel (which god; label-inequality) and SP-B's devotionBand (how devout; rung distance on DEVOTION_BANDS). The spine's \"planted devotion feeding sacred tension\" is the RUNG; both are lure axes in code (infoLure.js:176-180). §5 register: \"devotion\" names the belief axis, \"piety\" the substrate scalar.]"),
 ('R4 §4 hard-blocked (code block)', 'after', "  // BLOCKED on SP-2's families landing (§3 LIT-PRECONDITIONS).",
  f"  // [CORRECTED {C}) — UNBLOCKED by SP-B; the SP-B axes exist and the comparator is axis-typed as built. See the bracket at §2's Verified-ABSENT list.]"),
 ('wave IN-0', 'after', '### four slices, each its own commit)',
  fv('per slice below', f'{BELIEF}, plus each slice\'s host flags (§3)', 'per slice')),
 ('wave IN-0a', 'before', '**IN-0a — THE FOLD (PLANT_WIRING).** The one-call fold per SEAM CONTRACT ONE.',
  fv('the lie\'s take inside its 8-week shelf (`EXPOSE_MAX_AGE_TICKS: 8`, disinformationPlant.js:93) — the DM-truth `plant_took` line and the town page\'s "Stories standing against this town" within a month of a commission landing; the credibility verdict is yearly (52-tick half-life)',
     f'{BELIEF} · host flags: `informationBrokeragesEnabled` × `infoStatecraftEnabled`', 'dark (byte-identical)')),
 ('C1 IN-0a model superseded', 'after', '  takes no commissionedPlants param today.',
  f"  [CORRECTED {C}) — SUPERSEDED: the fold was already built when DESIGN_FP_ARCH_IN.md was compiled (AIN §1b R1); IN-0a re-scoped to THE HANDOFF and landed it (`brokeragePlantHandoff.js`). Read AIN §4 IN-0a for the landed shape.]"),
 ('vocab spent (§5)', 'inline', 'MARKET [CORRECTED 2026-08-02 (fp-audit)]',
  f"[RULED {C} §5) — `spent` is also a landed `MIRROR_BANDS` rung (secondOrderBelief.js:64); prose says \"spent credibility\" here and \"a spent mirror\" for the rung, never bare.]"),
 ('wave IN-0b', 'before', '**IN-0b — THE INTERCEPT CONSUMER.** brokerage_intercept stops being',
  fv('the bought claim on the patron\'s intelligence surface the tick the act resolves; the act lane runs at INTEL_TRADE cadence (26-week pair cooldown, 12/tick cap), so a month shows at most a first claim. Built endings are `read`/`refused` (`INTERCEPT_ENDINGS`, brokerageServices.js:588); `caught` stays UNMOUNTED with IN-3\'s sweep',
     f'{BELIEF} · host flag: `informationBrokeragesEnabled`', 'dark')),
 ('wave IN-0c', 'before', '**IN-0c — THE DISCLOSURE EXECUTOR (compelled intel).** The \'disclosure\' peace',
  fv('`treaty_disclosure_opened` one tick after signing (the credit at T+1, peaceTermsDisclosure.js:10-14; routed \'trade\', voiced by GRAMMAR); the term\'s verdict runs on 52-week treaty years. LANDED — see the bracket at §2\'s disclosure row',
     'host flags: peaceCausalActive (`warLayerEnabled` ∧ `peaceEngineEnabled`) × `allyIntelSharingEnabled` (lit in quiet_local and full_simulation) for the feed, × `infoStatecraftEnabled` for the credit; the feed is a belief write (belief infoMode)',
     'the term mints, strains and expires with no feed (named, pinned)')),
 ('wave IN-0d', 'before', '**IN-0d — HIDE\'S TRADE TAX.** The narrated toll becomes an enforced read.',
  fv('none — the read has zero consumers (secrecyTradeFactor.js:17-23); once EC-6 consumes it (§3.1.4), the toll\'s band word at the counting-house the week the gates shut',
     'host flag `infoStatecraftEnabled` (+ EC-6 lit for any effect)', 'the 1.0 identity (dark-identical)')),
 ('§3.1.4 HIDE toll home', 'after', '  consumed there, the WR-6/WR-8 pointer discipline).',
  f"  [RULED {C} §3.1.4) — \"the consuming join is TRADE's\" is SUPERSEDED: no TRADE or EC volume names the join and COUPLINGS CPL-9 said the opposite, so the toll was homeless. The read is EC-6's STANCE INPUT: a HIDE posture is a `restricted` STANCE on every pair into the hiding court; the stance derivation reads `secrecyTradeFactorOf` as one input, and the factor's bands {{unhindered, curtailed, throttled, choked}} map onto {{open, taxed, restricted, closed}}. One read, no new join; a lit-world shift only when EC-6 lights (dark-identical). The fold's §6 keeps it CUT-TO-SENTENCE: the law \"sealed gates cost trade\" and the band word.]"),
 ('wave IN-1', 'after', '### IN-1 — THE MIRROR (second-order belief; flag `secondOrderBeliefEnabled`)',
  fv('the DM standing line under "WHAT THE NEIGHBOURS HAVE BEEN SHOWN" (display/neighbourMirror.js:202), moving the tick we show something — strength only; `mirror_shift` has no producer; staleness runs seasonal to generational (HALF_LIFE_BANDS)',
     f'{BELIEF} · host flags: `secondOrderBeliefEnabled` + `infoStatecraftEnabled`', 'dark (no line)')),
 ('R10/C14/S17 mirror inputs', 'after', '  nothing new). Each input already ledgered, already decaying.',
  f"  [CORRECTED {C}) — CR-IN1-7 below is the reading. What it leaves unsaid: the mirror cannot yet degrade on our exposure receipts (that counterforce is IN-1c-b's), so until then it is a read without its counterforce; `wealthShown`/`devotionShown` have no producer and always read 'unknown' (secondOrderBelief.js:292, :297); and no engine consumer exists — GRAMMAR's negotiation posture, IN-2's aim and IN-3's mirror gap are injected readers nobody injects (infoLure.js:418-437, suspicion.js:152).]"),
 ('R15 IN-1 receipt pointer', 'after', '  §8 matches verbatim.]',
  f"  [CORRECTED {C}) — unproduced; see the bracket at §8's mirror sentence.]"),
 ('wave IN-2', 'after', '### IN-2 — THE LURE (flag `infoLureEnabled`; the program\'s signature)',
  fv('`lure_sprung` a tick after the planted story lands, inside the 8-week shelf — the fastest felt beat in the family, and UNREACHABLE today: `lureCommission` has no production caller (infoLure.js:45-48), so the axis-typed lie can never be minted; only the built strength bluffs and brokerage plants can spring',
     f'{BELIEF} · host flags: `infoLureEnabled` + `informationBrokeragesEnabled` + `infoStatecraftEnabled` + `secondOrderBeliefEnabled` + the U123 direction transport',
     'dark; with the war restraint (`warLayerEnabled` ∧ `warTerminationEnabled`) lit, the degree-and-timing channel only')),
 ('R4 IN-2 baits blocked', 'inline', 'Verified-ABSENT: those axes do not exist)',
  f"[CORRECTED {C}) — UNBLOCKED by SP-B; see the bracket at §2's Verified-ABSENT list.]"),
 ('S15 IN-2 restraint pointer', 'inline', "WR-1's optional coherence restraint",
  f"[CORRECTED {C}) — a derived conjunction; see the bracket at J-INF-14.]"),
 ('lure flagship pointer (receipts)', 'inline', '  marched on a weakness that was bought for them")',
  f"[CORRECTED {C}) — see the bracket at §8: no commission path.]"),
 ('wave IN-3', 'after', '### IN-3 — THE COUNTER-GAME (flag `counterIntelEnabled`; joined to SP-4)',
  fv('the DM Watch panel and Houses block (WatchPanel.jsx, HousesBlock.jsx) at any advance; the sweep\'s catch beat would be the fast sign, but every verb is UNMOUNTED pending U123 (`resolveSweep` has no production caller); the sweep cooldown (~26 weeks) and the witch-hunt\'s remembered grievance are seasonal-to-yearly, and the spy exposure the counter-game prices against runs at `EXPOSE_BASE 0.01`/tick (informationStatecraft.js:822, FP-43) ≈ a two-year spy life — a clock shift this volume never recorded',
     f'{BELIEF} · host flags: `counterIntelEnabled` + `infoStatecraftEnabled` (+ U123 for the verbs)',
     'mirror-gap arm dark ⇒ suspicion from exposure/contradiction evidence only')),
 ('vocab measured/zeal (§5)', 'inline', 'above a zeal band',
  f"[RULED {C} §5) — the built zeal ladder is `ZEAL_POSTURES = measured · paranoid · trusting` (suspicion.js:86); `measured` is also a `HABIT_HOLD_BANDS` rung and the estate's evidence word, so prose says \"a measured zeal\", never \"measured\" bare.]"),
 ('R3 IN-3 SEND-TWO', 'inline', 'accounts caught by the corroboration ladder. SPEC-ONLY UPSTREAM',
  f"[CORRECTED {C}) — DISCHARGED; see the bracket at §2's Verified-ABSENT list.]"),
 ('IN-3 verbs unmounted + §3.1.12', 'after', '  needs harder evidence).',
  f"  [CORRECTED {C}) — AS BUILT (IN-3, 582527f13/5731d4052): `suspicionOf` (suspicion.js) and the DM panels are built; all four verbs are UNMOUNTED pending U123's direction transport (`resolveSweep` has no production caller; the sweep endings are UNMOUNTED, infoConvergenceContract.js:135-137). VET and SEND-TWO consume the built one-home readers (counterIntelSweep.js:44).] [RULED {C} §3.1.12) — ONE suspicion derivation for the family: IN-3's `suspicionOf`; ES's `wariness01Core` and HB's awareness become its consumers.]"),
 ('§3.1.4 HIDE-as-answer pointer', 'inline', "HIDE-as-answer pays IN-0d's trade tax.",
  f"[RULED {C} §3.1.4) — through EC-6's stance; see the bracket at IN-0d.]"),
 ('R6/C5/S6 PLANT_REFUSALS', 'inline', '  (brokerageServicesPlant.js:98-101) grows by ONE to `too_hot`;',
  f"[CORRECTED {C}) — SEVEN at 00b648c9d, `too_hot` included (brokerageServicesPlant.js:98-100); the base was six, not five (AIN R5).]"),
 ('R11 sweep endings', 'inline', '{burned, withdrawn, gone_quiet}; sweep: {catch, clean_miss, witch_hunt};',
  f"[CORRECTED {C}) — the built sweep tokens are `caught · clean_miss · false_accusation` (`SWEEP_OUTCOMES`, counterIntelSweep.js:65); the long forms are prose, as J-INF-16's discipline requires. The house endings `weathered`/`ruined_name` have no producer.]"),
 ('§3.1.3 witch-hunt grievance', 'inline', 'grievance ladder — DESIGN_FP_COUPLINGS.md)',
  f"[RULED {C} §3.1.3) — the witch-hunt LANDS A ROW in POP's `GRIEVANCE_INPUTS` registry (kind · owning program · weight · cap, in `commonsVoiceKernel.js`), never \"adds a term\" to `commonsGrievance01`; the composite's clamp and POP-2's pins re-run on that row. Lighting `commonsVoiceEnabled` is OWNER ROW OD-FC-3.]"),
 ('wave IN-4', 'after', '### IN-4 — THE ROAD (couriers, double agents, and the race; flags per §3)',
  fv('the race at the gate — instantaneous at an army, envoy or exile arrival (`race_person`/`race_story`/`race_together`/`word_came_too_late`, routed \'events\'), the fastest MOUNTED beat in the family; courier legs would be weekly (law M) but couriers are not built',
     f'{BELIEF} · host flags: `reputationRaceEnabled` + `distancePricedNewsEnabled` (lit in the ONE_REGEN spread); couriers additionally `intelTradeEnabled` × `errandSpineEnabled` (both dark)',
     'the race only at arrivals the ledgers already stage (army, envoy, exile — refugee columns NOT raced)')),
 ('R12/C6 §3.2.7 double agent', 'after', '  discipline cross-referenced, never duplicated.',
  f"  [OWNER ROW OD-FC-9 — {C} §3.2.7) — TWO DOUBLE AGENTS WITH OPPOSITE HONESTY LAWS: this courier delivers \"a mutated telling onward\"; ES's double agent is LEAK-ONLY (J-ES-11, inside CR-ES-2's amendment of the owner's 2026-07-19 ruling; DESIGN_FP_ARCH_ES.md §3.13). Widening or narrowing that amendment is the owner's. CHAIR RECOMMENDATION: ONE law, leak-only — a courier that falsifies its cargo is the plant road (J-INF-3) wearing a courier, so a mutated telling enters only through the commission fold. Until ruled, nothing builds this clause.]"),
 ('S2/T10 IN-4 race half', 'inline', '  columns — run `reputationRace` (the built, pinned, zero-consumer read)',
  f"[CORRECTED {C}) — consumed since IN-4/2; refugee columns are not raced; see the bracket at §2's race row.]"),
 ('wave IN-5', 'after', '### state — beats ride their producing flags, routing is dark-safe)',
  fv('the seventh Herald section `knowledge` (heraldRouting.js:74) carrying `belief_misjudgment` and `plant_took` at the weekly clock; the arc spans years and is UNBUILT (IN-5/2 owed); `court_sat_still` has zero hits in src',
     f'{BELIEF} for the refile (beliefsActive); the desk config is dark-safe; each beat rides its producer\'s host flags',
     'the desk present, its beats absent while producers are dark')),
 ('R7/S5 HERALD_SECTIONS', 'inline', 'a FROZEN closed vocabulary of six',
  f"[CORRECTED {C}) — seven since IN-5/1: 'knowledge' after 'trade' (heraldRouting.js:74).]"),
 ('R13/T12 desk kinds', 'inline', 'every kind THIS program mints',
  f"[CORRECTED {C}) — at 00b648c9d the race kinds route 'events' (heraldRouting.js:338), `treaty_disclosure_opened` routes 'trade' (:270, GRAMMAR-minted) and `infowar_*` stay 'war' (:139); either refile them under J-INF-6's goldens-first discipline or record why they stay.]"),
 ('court_sat_still unbuilt', 'inline', '  (significance-gated) as `court_sat_still`;',
  f"[CORRECTED {C}) — UNBUILT: zero hits for `court_sat_still` in src at 00b648c9d; the fold's felt-value read keeps it (cheap; every input exists).]"),
 ('wave IN-6', 'after', '### lit soak, and not before)',
  fv('none — instrumentation (`infoConvergenceContract.js`; IN-6 r2 landed 2026-10-02); the lit/dark differential\'s presence was not traced (PLAUSIBLE)',
     'none of its own; it grades the lit soak', 'n/a')),
 ('R11 IN-6 sweep envelope pointer', 'inline', 'mix {catch, clean_miss, witch_hunt}',
  f"[CORRECTED {C}) — the built tokens differ; see the bracket at IN-3's Endings.]"),
 ('R14/S15 J-INF-14', 'after', '  reverse the live sign). The lure is NOT exempted, and the veto is NOT',
  f"  [CORRECTED {C}) — the lure reads the restraint as `warLayerEnabled ∧ warTerminationEnabled` (infoLure.js:383-399, held equal to warReasons' `predationCounterforcesLit` by a source pin), not as a free option; the ruling's substance stands.]"),
 ('R3 J-INF-15', 'inline', 'no envoyErrand/sendTwo code in\n  src/).',
  f"[CORRECTED {C}) — DISCHARGED: WR-7d built first (AIN R2); this block's own last arm applies — IN-3 consumes `sendTwoDivergence.js`.]"),
 ('lure flagship §8', 'after', '- "They marched on a weakness that was bought for them." (IN-2)',
  f"  [CORRECTED {C}) — CANNOT FIRE at 00b648c9d: `lureCommission` has no production caller (\"the commission's consumer lands when U123 composes the direction transport\", infoLure.js:45-48), so the lie cannot be commissioned; `resisted`/`exposed_first`/`backfired` are OWED. The sentence belongs to chain 1, THE STATECRAFT BAND (coherence fold §6).]"),
 ('R15 §8 mirror sentence', 'after', '  [Y]\'s eyes" asserted the observer\'s perception, which Law One forbids]',
  f"  [CORRECTED {C}) — UNSAYABLE at 00b648c9d: `mirror_shift` has no honest producer (informationNews.js:113-118). It stays the acceptance string; IN-1c-b owes the producer.]"),
 ('court_sat_still §8', 'after', '- "The court knew, and sat still; the knowing is part of the account now." (IN-5)',
  f"  [CORRECTED {C}) — UNSAYABLE today; see the bracket at IN-5(e).]"),
 ('R3 §9 SEND-TWO', 'inline', 'J-INF-15 rules its ownership if INFO lights first',
  f"[CORRECTED {C}) — DISCHARGED; see the bracket at J-INF-15.]"),
]

# ============================ DESIGN_FP_ARCH_IN.md ============================
E['DESIGN_FP_ARCH_IN'] = [
 ('status header + tier', 'after', '> packet records it.',
  f"> [CORRECTED {C}) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. In one line: LIT: none · BUILT DARK at 00b648c9d: IN-0a/0b/0c/0d (IN-0c landed after DESIGN_FP_INFORMATION.md and after this volume's first handoff — `peaceTermsDisclosure.js`, mounted informationStatecraft.js:1487; the HIDE toll INERT), IN-1a/1b (display only), IN-2 (no commission caller), IN-3 (verbs unmounted pending U123), IN-4/1-2, IN-5/1, IN-6 · UNBUILT: IN-1c-b, IN-2-c, IN-3's verbs, IN-4b couriers, IN-5/2 arc, `court_sat_still`.]\n"
  f"> [ADDED {C}, req 17) — TIER DECLARATION for every wave in this volume: `beliefsActive` (the spatial canon marker ∧ infoMode ≠ 'omniscient', beliefMap.js:204-209; the default infoMode is 'omniscient', simulationRules.js:56) holds in only three presets — dramatic_campaign, living_realm ('perfect_delayed') and full_simulation ('full') — and `infoStatecraftEnabled`, `informationBrokeragesEnabled` and `errandSpineEnabled` are dark in every preset. No IN wave runs aspatially or in the default preset; the family is spatial-canon (premium-tier) only. Each wave below carries its own FIRST-VISIBLE/TIER line.]"),
 ('OD-FC-12 S2 M9b row', 'inline', 'detectMisjudgment :1468. Volume\'s :801-1009 / :1362-1386 cites rotted | VERIFIED (addresses REFINED)',
  f"[OWNER ROW OD-FC-12 — {C} §3.2.15) — the ally-share ghost-write measurement car (PLAUSIBLE): an adopted share replaces the seat record and drops the SP-B axes, and the next report re-seeds them from truth (beliefMap.js:1117, beliefAxes.js:225); a fixture rides the next spine lane, and a confirmed cure is an owner-signed one-time full_simulation shift.]"),
 ('R19 §1a history (S8/S11-S14/S16/S32)', 'para', '| S35 | Envoy transit obeys law M |',
  f"[CORRECTED {C}) — the \"absent/zero\" verdicts above are HISTORY at 00b648c9d: S11 (the race is consumed by `reputationRaceConsumer.js`, mounted settlementLifecycleKernel.js:591), S12 (`WatchPanel.jsx`), S13 (`HousesBlock.jsx:40`), S14 (`projectPlants` now at brokerageServicesPlant.js:577, mounted briefs/composers.js:97, still fail-OPEN — J-INF-17 stands), S16 (seven sections since IN-5/1, heraldRouting.js:74). S8's premise moved — the SP-B families are live — but its gap remains: `CHANNEL_BELIEF_AXES.trade` is still `[]` (brokerageServices.js:129), so houses vouch for no trade belief. See DESIGN_FP_COHERENCE_FOLD.md §2.]"),
 ('R19 §1b history (R1/R3/R5)', 'para', '| R8 | **Herald numerators: 4 knowledge beats / 269 routed tokens, war 68** |',
  f"[CORRECTED {C}) — R1's handoff landed (`brokeragePlantHandoff.js`); R3c is cured (`intelTradeEnabled` joined the manifest at IN-4/1 `9e916163b`); R5's count is SEVEN at 00b648c9d (brokerageServicesPlant.js:98-100, `too_hot` included). These rows are history; DESIGN_FP_COHERENCE_FOLD.md §2 is the status.]"),
 ('R19 verified-absent paragraph', 'inline', '`suspicionOf`/`secrecyTradeFactorOf` (no hits).',
  f"[CORRECTED {C}) — HISTORICAL (2026-08-04): the race consumer, the knowledge desk, the mirror (`secondOrderBelief.js`), `suspicionOf` and `secrecyTradeFactorOf` all exist at 00b648c9d; still absent: the arc, `court_sat_still`, the sweep's production caller.]"),
 ('R4 §2 lure flag row', 'inline', '(HARD, still absent — S8)',
  f"[CORRECTED {C}) — unblocked by SP-B; see the bracket at IN-2's J-INA-3.]"),
 ('wave IN-0', 'after', '### IN-0 — THE PRICES BECOME LAW (four slices, four commits; rides existing flags) — **⭐ ALL FOUR SLICES LANDED (0c per PACKET_MANIFEST IN-0C = LANDED)**',
  fv('per slice below', f'{BELIEF}, plus each slice\'s host flags (§2)', 'per slice')),
 ('wave IN-0a', 'before', '**IN-0a — THE HANDOFF (re-scoped by R1; was "the fold").** The fold is built;',
  fv('the lie\'s take inside its 8-week shelf (`EXPOSE_MAX_AGE_TICKS: 8`) — the DM-truth `plant_took` line and the town page\'s plants panel within a month of a commission landing; credibility is the yearly verdict',
     f'{BELIEF} · host flags: `informationBrokeragesEnabled` × `infoStatecraftEnabled`', 'dark (byte-identical, ONE_REGEN included)')),
 ('R17/S12 pulseKernel size', 'inline', 'ZERO edits ever, L1)',
  f"[CORRECTED {C} §3.3.8) — pulseKernel is 1581 EFFECTIVE and frozen (scripts/.size-baseline.json:13); applyWorldPulse 907; cite the baseline and the eslint effective count, never a raw `wc`.]"),
 ('wave IN-0b', 'before', '**IN-0b — THE INTERCEPT CONSUMER — LANDED 2026-08-06 @ `6a497bab`.**',
  fv('the bought claim on the patron\'s intelligence surface the tick the act resolves (26-week pair cooldown); `caught` UNMOUNTED',
     f'{BELIEF} · host flag `informationBrokeragesEnabled`', 'dark')),
 ('wave IN-0c', 'before', '**IN-0c — THE DISCLOSURE EXECUTOR — ⭐ LANDED',
  fv('`treaty_disclosure_opened` one tick after signing (credit at T+1; routed \'trade\')',
     'host flags: peaceCausalActive × `allyIntelSharingEnabled` (lit in quiet_local and full_simulation) for the feed, × `infoStatecraftEnabled` for the credit',
     'the term mints, strains and expires with no feed (pinned)')),
 ('wave IN-0d', 'before', '**IN-0d — HIDE\'S TRADE TAX — LANDED 2026-08-06 @ `db35bad6`.**',
  fv('none — zero consumers; once EC-6 consumes it, the toll\'s band word the week the gates shut',
     'host flag `infoStatecraftEnabled` (+ EC-6 lit for any effect)', 'the 1.0 identity')),
 ('§3.1.4 HIDE toll home (AIN)', 'inline', 'row 14, AFTER us — the seam contract in §5 pre-pins it).',
  f"[RULED {C} §3.1.4) — \"the consuming join is TRADE's\" is SUPERSEDED: no TRADE or EC volume names the join (COUPLINGS CPL-9 said the opposite). The read is EC-6's STANCE INPUT — a HIDE posture is a `restricted` STANCE on every pair into the hiding court; the stance derivation reads `secrecyTradeFactorOf` as one input, its bands {{unhindered, curtailed, throttled, choked}} mapping onto {{open, taxed, restricted, closed}}. One read, no new join; a lit-world shift only when EC-6 lights. Kept CUT-TO-SENTENCE (fold §6).]"),
 ('wave IN-1', 'after', '### IN-1 — THE MIRROR (`secondOrderBeliefEnabled`)',
  fv('the DM standing line per neighbour (display/neighbourMirror.js:202), strength only, moving the tick we show something; staleness seasonal to generational',
     f'{BELIEF} · host flags: `secondOrderBeliefEnabled` + `infoStatecraftEnabled`', 'dark')),
 ('IN-1 as built (two axes unknown)', 'after', '   and IN-1a renders nothing.',
  f"[CORRECTED {C}) — AS BUILT: the mirror has ONE caller, the DM standing line (display/neighbourMirror.js:40, :202), and NO engine consumer — GRAMMAR's negotiation posture (§5 pre-pin 4), IN-2's aim and IN-3's mirror gap are injected readers nobody injects (infoLure.js:418-437 `softnessOf = null`; suspicion.js:152 `mirrorGapOf = null`). `wealthShown`/`devotionShown` are hard-wired 'unknown' in the real answer (secondOrderBelief.js:292, :297), and `mirror_shift` has no honest producer (informationNews.js:113-118), so the volume's mirror sentence cannot be said.]"),
 ('wave IN-2', 'after', '### IN-2 — THE LURE (`infoLureEnabled`)',
  fv('`lure_sprung` a tick after the planted story lands, inside the 8-week shelf — UNREACHABLE today (no commission caller; see the bracket at Spine 14 below)',
     f'{BELIEF} · host flags: `infoLureEnabled` + `informationBrokeragesEnabled` + `infoStatecraftEnabled` + `secondOrderBeliefEnabled` + the U123 direction transport',
     'dark; with the war restraint lit, the degree-and-timing channel only') +
  f"\n[RULED {C} §5) — \"lure\" in this volume is ONLY IN's bought lie; FAITH's sack lure is \"the sack's draw\" in prose.]"),
 ('R4/C3/C4 J-INA-3', 'inline', 'all baits now so nothing re-opens).',
  f"[CORRECTED {C}) — UNBLOCKED by SP-B (ARCH J-FP-5): `SCARCITY_BANDS`/`DEVOTION_BANDS` are live (beliefAxisSubjects.js:85, :115) and the code built every family's axis (infoLure.js:157-199: strength · faithLabel · devotion rung · three conditions stems · scarcity). What is missing is the commission's CONSUMER (U123). DEVOTION is TWO axes, not one: `faithLabel` (which god; label-inequality) and SP-B's `devotionBand` (how devout; rung distance) — the spine's \"planted devotion feeding sacred tension\" is the rung.]"),
 ('lure flagship (AIN)', 'inline', '  from CR-7.',
  f"[CORRECTED {C}) — NOT LANDED: IN-2 shipped the axis law, `lieExposure` and `lure_sprung`, but `lureCommission` has NO production caller (\"the commission's consumer lands when U123 composes the direction transport\", infoLure.js:45-48). The lie cannot be commissioned in a running world, so \"They marched on a weakness that was bought for them\" cannot fire; only the built strength bluffs and brokerage plants can spring.]"),
 ('wave IN-3', 'after', '### IN-3 — THE COUNTER-GAME (`counterIntelEnabled`)',
  fv('the DM Watch panel and Houses block at any advance; the sweep beats are UNMOUNTED (U123); the sweep cooldown and the witch-hunt grievance are seasonal-to-yearly, priced against `EXPOSE_BASE 0.01`/tick ≈ a two-year spy life',
     f'{BELIEF} · host flags: `counterIntelEnabled` + `infoStatecraftEnabled` (+ U123 for the verbs)',
     'mirror-gap arm dark ⇒ suspicion from exposure/contradiction evidence only')),
 ('vocab measured/zeal (AIN)', 'inline', 'Spine 13: ENGAGED (zeal = posture-derived;',
  f"[RULED {C} §5) — `ZEAL_POSTURES = measured · paranoid · trusting` (suspicion.js:86); prose says \"a measured zeal\", never \"measured\" bare.]"),
 ('IN-3 verbs unmounted + §3.1.12 (AIN)', 'inline', 'Spine 14: the SWEEP DM verb (same store-action lane discipline as IN-2\'s verb).',
  f"[CORRECTED {C}) — NOT LANDED: IN-3 built `suspicionOf`, the Watch panel and the Houses block; every verb (sweep, vet, send-two, hide-as-answer) is UNMOUNTED pending U123 (`resolveSweep` has no production caller).] [RULED {C} §3.1.12) — ONE suspicion derivation: ES's `wariness01Core` and HB's awareness become consumers of `suspicionOf`.]"),
 ('wave IN-4', 'after', '### IN-4 — THE ROAD (couriers, double agents, the race)',
  fv('the race at the gate, instantaneous at an army/envoy/exile arrival (routed \'events\'); couriers not built',
     f'{BELIEF} · host flags: `reputationRaceEnabled` + `distancePricedNewsEnabled` (ONE_REGEN); couriers + `intelTradeEnabled` × `errandSpineEnabled` (both dark)',
     'the race only at already-staged arrivals')),
 ('S2/T10/T12 race as built + OD-FC-9', 'inline', 'last is NEW substrate the volume could not name).',
  f"[CORRECTED {C}) — AS BUILT (IN-4/2 `d7b779928`→`769c2363e`): `RACE_ARRIVAL_KINDS = ['army','envoy','exile']` (reputationRaceConsumer.js:103) — refugee columns are NOT raced (`releaseMigrationArrivals` deletes the column), a declared gap; the race kinds route 'events' (heraldRouting.js:338), not the knowledge desk. Couriers (IN-4b) are OWED. The courier double agent's honesty law is OWNER ROW OD-FC-9 (coherence fold §3.2.7; see DESIGN_FP_INFORMATION.md IN-4).]"),
 ('wave IN-5', 'after', '### IN-5 — THE VOICE (no engine state; routing + composers)',
  fv('the `knowledge` desk (landed IN-5/1) carrying the refiled `belief_misjudgment` weekly; the arc and `court_sat_still` UNBUILT',
     f'{BELIEF} for the refile; desk config dark-safe; beats ride their producers\' flags', 'desk present, beats absent')),
 ('R7/S5 HERALD six (AIN)', 'inline', "HERALD_SECTIONS' frozen six (S16)",
  f"[CORRECTED {C}) — seven since IN-5/1 (heraldRouting.js:74).]"),
 ('court_sat_still (AIN)', 'inline', 'LOW-confidence sitting still mints NOTHING),',
  f"[CORRECTED {C}) — UNBUILT: zero hits in src at 00b648c9d; the arc (IN-5/2) is OWED.]"),
 ('wave IN-6', 'after', '### IN-6 — THE MEASURE (no flag; the acceptance harness)',
  fv('none — instrumentation', 'none of its own', 'n/a')),
 ('§3.1.4 collision-map pointer', 'inline', "TRADE (row 14) consumes IN-0d's export;",
  f"[RULED {C} §3.1.4) — EC-6's stance consumes it; see the bracket at IN-0d.]"),
 ('§3.1.4 pre-pin 1 pointer', 'after', '   contract moved.',
  f"   [RULED {C} §3.1.4) — the consumer is EC-6's stance derivation, not a TRADE row; see the bracket at IN-0d.]"),
 ('R4 pre-pin 2 re-opened', 'inline', "   scarcity/conditions baits' deferral is re-opened deliberately, never\n   silently.",
  f"[CORRECTED {C}) — re-opened by the build: `IN2_AXIS_FAMILIES = conditionsBands · devotionBand · scarcityBands` (infoLure.js:159); see the bracket at J-INA-3.]"),
 ('R4 Q4 pointer', 'inline', 'scarcity/conditions SP-2-blocked;',
  f"[CORRECTED {C}) — overtaken by the build; see the bracket at J-INA-3.]"),
 ('R18/C7 J-INA-1', 'inline', "cure, the mirror's seventh input).",
  f"[CORRECTED {C}) — there is NO J-INA-1 block in this document: the transport is §6 Q1, ruled as CR-FP-4 (DESIGN_FP_ARCHITECTURE.md:2926). The mirror's seventh input (J-INA-5) was DEFERRED at the IN-1a promotion (CR-IN1-2).]"),
]

# ============================ DESIGN_FP_ARCH_ES.md ============================
E['DESIGN_FP_ARCH_ES'] = [
 ('vocab rooted (§5)', 'after', '## HEAD at landing: 32cc17f7 (stamped by the landing lane).',
  f"## [RULED {C} §5) — `rooted` in this volume is ES's ROOTED DWELL (§3.4b); W-OPS's infiltration rung `rooted` (operationsVoice.js ARC_RUNGS_MIRROR) is a homonym in an unsanctioned design (OWNER ROW OD-FC-4) and renames if sanctioned.]"),
 ('R20 status header + tier', 'after', '**Status: ARCHITECTURE. Nothing is scheduled until the owner sequences it.',
  f"[CORRECTED {C}) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. In one line: LIT: none (`espionageEnabled` needs `errandSpineEnabled`, dark in every preset) · BUILT DARK at 00b648c9d: ES-0, ES-1, ES-2, ES-3, ES-4 (the `ES-4-DISTANT-SOURCE-EVIDENCE` pin), ES-5a (the stage as a leaf; no autonomous dispatch mount found — PLAUSIBLE, import census only), ES-5b, ES-5c, ES-5d, ES-6a (the leak) and ES-Da (the composite rider — the ONLY mission mint path, absent from §4's wave list) · UNBUILT: ES-6b, ES-7 (no `espionage_*` kind is registered or routed; missions resolve silently), ES-Db; W-OPS's cars are orphans (OWNER ROW OD-FC-4, see §0).]\n"
  f"[ADDED {C}, req 17) — TIER DECLARATION for every wave in this volume: `espionageActive` = `beliefsActive` (the spatial canon marker ∧ infoMode ≠ 'omniscient', beliefMap.js:204-209) ∧ `errandSpineEnabled` ∧ `espionageEnabled`. Only three presets record beliefs (dramatic_campaign and living_realm at 'perfect_delayed', full_simulation at 'full'; the default infoMode is 'omniscient', simulationRules.js:56), and `errandSpineEnabled` is lit in NO preset, so no mission can run in any shipped configuration. The family is spatial-canon (premium-tier) only by construction and has no aspatial degraded arm. Each wave below carries its own FIRST-VISIBLE/TIER line.]"),
 ('§3.1.8 W-OPS (OD-FC-4)', 'para', 'tap level is fidelity metadata, receipted in house voice — §3.7).',
  f"[ADDED {C}) — OWNER ROW OD-FC-4 — W-OPS (DESIGN_W_OPS / W_LIVES) is a successor DRAFT over espionage, unsanctioned, every leaf unimported; ES's volumes are the authority for missions until the owner signs. What it adds: one operation grammar (`operations/operationGrammar.js`, \"THE ONE GRAMMAR every operation walks\", absorbing these missions into MISSION/GOAL/ERRAND classes), the infiltration rungs `passing_ear → observer → rooted → placed → seated`, a mission dispatcher and acceptance (`missionDispatcher.js`, `missionAcceptance.js`), infiltration depth and drift, and an operations voice (`operationsVoice.js`); its mission catalog is owner-UNSIGNED (`signedBy: null`). That is new capability, not repair; the chair's recommendation is NO for now (coherence fold §3.1.8, §7).]"),
 ('R21/C11/S19 legRefs (code block)', 'after', '                                   // REFUSES a legRef outside the six.',
  f"                                   // [CORRECTED {C}) — FIVE members at 00b648c9d: EP-r cut 'exports' 2026-08-10 (ES-1's charter in §4; envoyErrandVocabulary.js:207-213).]"),
 ('C13 §1 zero sub-keys pointer', 'inline', 'ZERO new\nspatialLedgers sub-keys.',
  f"[CORRECTED {C}) — ES-5d added one; see the bracket at §3.14's ES-5d note.]"),
 ('R29/S11 §2 names clear', 'inline', 'wariness01` anywhere in src (re-measured at 99d63d92).',
  f"[CORRECTED {C}) — HISTORICAL (99d63d92): `espionageEnabled` (simulationRules.js:310), `espionageActive` (espionageGate.js), `suspicionOf` (suspicion.js) and `wariness01Core` (espionageMath.js:375) all exist.]"),
 ('R22/C15/S18 ACQUIRE as built + exports', 'after', '  banded slot with a live consumer).',
  f"  [CORRECTED {C}) — AS BUILT (ES-3): the TARGET read carries `conditionsBands` and the declared `allianceLabel` ONLY — \"no strengthBand, no readiness, and NO faithLabel\" (espionageProducts.js:28-31); strength, readiness and faith come only from a HOST's belief row at a waypoint (:32-40). `exports` is not a legRef (see the bracket at §1). WC's \"spies count banners\" therefore has no road.]\n"
  f"  [OWNER ROW OD-FC-12 — {C} §3.2.15) — the axes these products fold (`conditionsBands`, via `foldBeliefAxes`) are exposed to the SP-B × M9b ally-share ghost-write (PLAUSIBLE, reasoned): an adopted ally share replaces the whole seat record (beliefMap.js:1117) and drops every SP-B axis, and the next report re-seeds an absent axis from ground truth (beliefAxes.js:225) — a spy-filled leg could be erased by an ally's share and re-anchored to truth. A measurement car rides the next spine lane; a confirmed cure is a one-time full_simulation belief shift the owner signs.]"),
 ('R22 first-hand cap pointer (code block)', 'after', "                 cap PERF_SELF_CAP < 1, its paraded granaries)",
  f"                 [CORRECTED {C}) — as built the first-hand target read carries conditions + alliance only; see the bracket at §3.6 ACQUIRE.]"),
 ('§3.1.12 suspicion one derivation', 'inline', 'the minimal own-read above is the declared dark arm.',
  f"[RULED {C} §3.1.12) — ONE suspicion derivation: IN-3's `suspicionOf`. As built it is NOT WIRED — suspicion.js:8-10 records that ES carries `espionageMath.js :: wariness01Core` until its own lane composes the read, and no espionage module imports `suspicionOf` — so two derivations stand, declared only in a code comment. `wariness01Core` BECOMES A CONSUMER of `suspicionOf` where `counterIntelEnabled` is lit and keeps the minimal own-read as the dark arm; the composing lane is ES-5's next unit. HB's `awareness01` likewise consumes it (its truth read of `sightPostures` is struck).]"),
 ('R23/C10 §3.11 no further code', 'inline', 'faction IS the two-books texture with no further code.',
  f"[CORRECTED {C}) — FALSE as measured; see the ES-5 block in §4: `factionCompetition.js` held no bloc read, and ES-5b BUILT the reach on its contest weight (`entry.power`). Felt value: expect almost none from a pure spy's absence (the paragraph's own texture note).]"),
 ('R24/S16 §3.2.9 J-ES-13 release', 'inline', 'chooser is a future owner ruling, not an oversight.',
  f"[RULED {C} §3.2.9) — RELEASED: the owner's blanket grant of 2026-08-05 (\"I give permission for everything that requires my sign off in the full queue\", FABLE_VALIDATION_QUEUE.md:2598; its scope reading names this deferred arm, :2615-2617) is the future owner ruling this sentence waits on. The war-chooser spy-before-decision wiring is no longer deferred: it lands as ONE joint unit with HB-5 (DESIGN_FP_ARCH_HB.md R1 \"REFUTED BY EVENT\", :3442-3450). CR-ES-4 stands as the ruling that deferred it; coherence fold §6 places the joint unit in chain 1, THE STATECRAFT BAND.]"),
 ('§3.2.7 double agent (ES)', 'after', "  widen; the cost is REFUTE's honesty guarantee.",
  f"  [OWNER ROW OD-FC-9 — {C} §3.2.7) — the family holds TWO double agents with OPPOSITE honesty laws: this leak-only operative and DESIGN_FP_INFORMATION.md IN-4's courier, which \"delivers a mutated telling onward\". CR-ES-2 amends the owner's 2026-07-19 ruling, so widening or narrowing it is his. CHAIR RECOMMENDATION: ONE law, leak-only; a courier that falsifies is the plant road (J-INF-3) wearing a courier.]"),
 ('R28/C13 ES-5d carrier vs §1', 'inline', 'the fold is SAME-TICK rather than one-tick-lagged (deviation D7 above).',
  f"[CORRECTED {C}) — the carrier must be recorded against §1's law: `missionCreditEvents` is a NEW `spatialLedgers` sub-key (one-tick, drop-when-empty, classified TRACKED; espionageCareerCredit.js:16, :200-209; spatialUsage.js:307), so §1's \"ZERO new spatialLedgers sub-keys\" no longer holds as written. Recorded, not re-ruled; if contested, a persisted-shape question is the owner's.]"),
 ('wave ES-0', 'before', '**ES-0 — THE PURE LEAVES + THE FLAG (dark by construction; early-eligible).**',
  fv('none — instrumentation (pure leaves + the flag\'s manifest row and certification row)', 'host flag `espionageEnabled` (manifested, lit nowhere)', 'dark by construction')),
 ('wave ES-1', 'before', '**ES-1 — THE MISSION (⚠ RIDES `espionageEnabled`; DOES NOT MINT IT — see §2\'s',
  fv('none a DM can see at a month — the mint has no production dispatch (`espionageMissions.js` has zero importers under src; ES-Da\'s rider is the only traffic), and a mission\'s legs (one week per leg, 2-3 legs + dwell) speak no beat until ES-7',
     ESTIER, 'dark (`envoyErrands` bytes identical)')),
 ('wave ES-2', 'before', '**ES-2 — THE GAUNTLET (second slice of `espionageEnabled`; needs ES-1;',
  fv('a `caught_spying` foreign-guest hold on the hold surfaces at a hostile stop\'s dwell interval; the ransom gate opens at week 4 / protracted at week 16 (`DWELL_CUTS_COVERT`) — seasonal; no `espionage_*` beat until ES-7',
     ESTIER, 'dark (covert rows absent ⇒ the stage no-ops byte-identically)')),
 ('wave ES-3', 'before', '**ES-3 — THE PRODUCTS + THE GRADIENT (third slice; needs SP-B landed for',
  fv('the home court\'s belief about the subject moving when the mission folds home — mundane at `markEnvoyHome` after 2-3 weekly legs + dwell (a month to a season), magic at the stop\'s confirmation tick — visible only on DM belief surfaces until ES-7 voices the tap registers',
     f'{ESTIER} (+ `believedConditionsEnabled` for the axis arm)', 'core slots only, the receipt naming the missing family')),
 ('wave ES-4', 'before', '**ES-4 — THE JOINT-LEGS DISCHARGE (rides SP-B/SP-B2; the lighting wave).**',
  fv('none — instrumentation (the evidence pin); its felt sentence is WR-10\'s market', f'{ESTIER} (+ `sovereigntyTradeEnabled`, lit nowhere, for any effect)', 'dark')),
 ('wave ES-5', 'before', '**ES-5 — DOCTRINE ENGAGED + THE ABSENCE AMENDMENT (fourth slice; needs',
  fv('none at a month — the bench discount (ES-5b) moves bloc math per tick but a pure spy\'s absence costs the council little (§3.11); the career register and credit (ES-5c/5d) read at the yearly clock; the autonomous cadence (ES-5a) is not mounted',
     f'{ESTIER} (+ `npcLadderActive` for ES-5c/5d; ES-5b/5c are not covert-gated, §3.13\'s ES-Da note)', 'the promotion term declared-absent; ladder dark ⇒ the grade stays a receipt')),
 ('ES-5a handshake + dispatch PLAUSIBLE', 'inline', 'handshake — **LANDED at `41ddeae0`**.',
  f"[CORRECTED {C}) — LANDED AS A LEAF: `espionageDoctrineStage.js` is imported only by `espionageRider.js` among engine modules; no autonomous dispatch mount was found (PLAUSIBLE — import census only), so \"the court decides to spy\" is not mounted, and the IN-3 handshake is NOT wired (see the bracket at §3.8).]"),
 ('ES-5d stale', 'inline', 'just-in-time after ES-5c lands.',
  f"[CORRECTED {C}) — STALE: ES-5d LANDED (`espionageCareerCredit.js` → npcLadderKernel.js:93); see §3.14's ES-5d notes and the bracket there.]"),
 ('wave ES-6', 'before', '**ES-6 — THE DOUBLE AGENT (fifth slice; degraded-dark when the web is',
  fv('none — silent success by law; the leak surfaces only on exposure (yearly; ES-7\'s retroactive clause)', f'{ESTIER} (+ the corruption web for the leash read)', 'web dark ⇒ no leash read')),
 ('wave ES-7', 'before', '**ES-7 — THE VOICE + THE MEASURE (final slice; after IN-5 for the knowledge',
  fv('UNBUILT — when built, the six `espionage_*` beats at a mission\'s weekly legs (departures dm-only; confirmations and refutes on the knowledge desk; captures and betrayals public) and the three tap registers; this wave is the gate to all felt value in the family',
     f'{ESTIER} (+ IN-5\'s desk)', 'dm-only kinds fail-closed upstream')),
 ('R25/C9 ES-Da wave count', 'inline', '**Wave count: 9**',
  f"[CORRECTED {C}) — the count omits ES-Da, the composite rider (LANDED `6dbb76c2`; `espionageRider.js` → envoyDiplomacy.js:41, \"THE ONE caller since ES-Da\", subsystemRowsBelief.js:178), which is the ONLY mission mint path at 00b648c9d (§3.13's amendment records it; this list never did), and ES-Db (FP-ORDER pair 4, after U26). The program is ES-0..4, 5a-5d, 6a/6b (6c folded into ES-7), 7, Da/Db; twelve units landed at 00b648c9d (ES-0..4, 5a-5d, 6a, Da). ES-Da's own line — FIRST-VISIBLE: none (silent covert cargo on an accepted peace envoy until ES-7) · TIER: {ESTIER} + the envoy-diplomacy gate that carries the host envoy (PLAUSIBLE) · DEGRADED ARM: dark.]"),
 ('§3.1.12 seam row 9', 'inline', 'ONE derivation, ES consumes it lit / derives minimally dark.',
  f"[RULED {C} §3.1.12) — not wired at 00b648c9d (suspicion.js:8-10); see the bracket at §3.8.]"),
 ('§3.2.7 seam row 9', 'inline', 'distinct purposes on the one spine, both in the consumer map.',
  f"[OWNER ROW OD-FC-9 — {C} §3.2.7) — this row never reconciles IN-4's falsifying courier double agent with §3.13's leak-only one; see the bracket at §3.13.]"),
 ('§3.2.9 CR-ES-4', 'inline', 'OWNER ruling and filed as an owner-queue row. No ES wave wires the chooser.',
  f"[RULED {C} §3.2.9) — the deferral is RELEASED by the owner's 2026-08-05 grant; see the bracket at §3.12 J-ES-13. This ruling's text stands as history.]"),
 ('R25 colophon', 'inline', 'ES-6c folded into ES-7), all dark;',
  f"[CORRECTED {C}) — see the bracket at §4's wave count.]"),
]

def apply(name, edits):
    base = open(f'{KIT}/volumes-master/{name}.md', encoding='utf-8').read()
    ops = []
    for (rid, mode, anchor, text) in edits:
        n = base.count(anchor)
        if n != 1:
            raise SystemExit(f'ANCHOR {name} [{rid}] found {n} times: {anchor!r}')
        i = base.index(anchor); j = i + len(anchor)
        if mode == 'inline':
            pos, chunk = j, ' ' + text
        elif mode == 'after':
            k = base.find('\n', j); pos = (len(base) if k < 0 else k); chunk = '\n' + text
        elif mode == 'before':
            k = base.rfind('\n', 0, i); pos = k + 1; chunk = text + '\n'
        elif mode == 'para':
            k = base.find('\n', j)            # end of anchor line
            k2 = base.find('\n', k + 1)       # end of the next line
            assert base[k + 1:k2].strip() == '', f'{rid}: line after anchor not blank'
            pos, chunk = k2 + 1, text + '\n\n'
        else:
            raise SystemExit(mode)
        ops.append((pos, chunk, rid, base[:pos].count('\n') + 1))
    # combine identical positions in edit order
    ops_sorted = sorted(enumerate(ops), key=lambda t: (t[1][0], t[0]))
    out = []; last = 0
    for _, (pos, chunk, rid, line) in ops_sorted:
        out.append(base[last:pos]); out.append(chunk); last = pos
    out.append(base[last:])
    dest = ''.join(out)
    # verification: remove every inserted chunk once, must reproduce the base byte-for-byte
    tmp = dest
    for (pos, chunk, rid, line) in ops:
        assert tmp.count(chunk) >= 1, rid
        tmp = tmp.replace(chunk, '', 1)
    assert tmp == base, f'{name}: reconstruction != base'
    open(f'{DST}/{name}.md', 'w', encoding='utf-8').write(dest)
    return [(rid, line) for (pos, chunk, rid, line) in ops]

report = {}
for name, edits in E.items():
    report[name] = apply(name, edits)
json.dump(report, open(f'{KIT}/amend/C_applied.json', 'w'), indent=1, ensure_ascii=False)
for name, rows in report.items():
    print(name, len(rows))
    for rid, line in rows:
        print(f'  {line:5d}  {rid}')
