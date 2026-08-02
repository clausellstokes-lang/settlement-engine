# DESIGN — THE REALM MAGIC TOGGLE (one question before the world exists)

## Fable 5 architecture, 2026-08-02, under full owner delegation. Owner order
## (verbatim intent): the multi-settlement generate flow gains ONE extra step —
## a pop-up asking whether the settlements (ALL of them) enable or disable
## magic. IMPLEMENTATION IS ASSIGNED TO THE EXTERNAL IMPLEMENTER (Sol); the war
## volume's §10 implementer protocol binds verbatim. Substrate claims below
## carry file:line receipts from the three-surveyor recon executed 2026-08-02
## against claude/composite-r4 @ 59d298d3 (workflow wf_7bd3c9b3-2f8); claims
## the surveyors could not execute are marked REPRODUCE-FIRST and their slices
## begin with the reproduction test. Where this document and the tree disagree,
## live code outranks the census — STOP and report.

---

## §0 THE THESIS

The task is off by one level from how it sounds. A full per-settlement magic
disable ALREADY EXISTS and is architecturally clean: `magicExists` (a hard
world fact), `priorityMagic` (the 0–100 dial, zeroed when magic is off), and
`magicLevel` (a derived band — none/low/medium/high, constants.js:37-41) —
arbitrated at generation by ONE world-law chokepoint
(`createGenerationWorldLaw`, generationContext.js:199-356: magicEnabled,
allowsInstitution/Role/Service/Secret/HistoryEvent/GeneratedContent/
MagicClaim, 15 consumer modules), read at advance by ONE canonical accessor
(`magicLedger`, magicLedger.js:73-87), displayed honestly (magicProfile's
all-absent envelope, magicProfile.js:377-399; the compendium already authors
"Magic is disabled in this world", bandLadders.js:131-135), and pinned by 68
test files including a dedicated dead-magic leak suite. What does NOT exist is
the REALM: the Instant World flow hard-codes every member magical
(`{ ...DEFAULT_CONFIG, settType: site.tier, _randomizePriorities: true }`,
composeInstantWorld.js:180 — DEFAULT_CONFIG carries magicExists:true,
configSlice.js:31), the realm knob surface is exactly three values
(realmSize/tone/mapKind, worldPlan.js:120-126), and no pre-generation modal
exists anywhere in the flow (InstantWorldEntry.jsx has no Dialog import; the
config is an inline panel, :106-170). THE CURE IS PROJECTION, NOT A GATE: the
realm answer is asked once, then STAMPED INTO EVERY MEMBER'S per-settlement
config at mint — after which every existing mechanism (world law, ledger,
display, regen, share, tests) is correct by inheritance, because they all
already read per-settlement truth. The realm keeps only a default-for-later
and a provenance echo. One question, zero new authorities.

## §1 THE LAWS THAT BIND EVERY SLICE

- **MG-LAW-1 — PROJECTION, NEVER A SECOND AUTHORITY.** The toggle is
  GENERATION INPUT projected into each member's `config`/`_config` at mint.
  No pulse, generator, or display path ever consults a live realm-level magic
  gate: per-settlement config remains the ONE truth every consumer already
  reads (the pulse reads `magicLedger(settlement)` per member —
  magicLedger.js:73-86 — and that stays exactly right because the projection
  wrote the member). A realm rule that must be consulted at read time is the
  double-authority defect this law exists to prevent.
- **MG-LAW-2 — MAGIC IS NOT FAITH (ruled, vetoable).** The toggle gates the
  ARCANE axis and FUNCTIONING SUPERNATURAL EFFECTS. The deity system —
  beliefs, temples, patrons, religion state — is untouched (no deity module
  reads magicExists; verified by grep). The existing code line stands: divine
  MECHANICAL effects (Turn Undead, blessed granaries, divine healing
  substitution) follow magicOn (defenseGenerator.js:112-119,
  chainMagicSubstitution.js:25-29) — a mundane world still prays; its prayers
  move belief, never physics. This is Law One's own posture: the engine never
  confirmed the divine anyway. The pop-up copy states it plainly.
- **MG-LAW-3 — A MUNDANE WORLD IS NOT A THINNER WORLD.** Suppression rides
  the existing substitution arms (chainMagicSubstitution's food/timber/heal/
  extract mundane paths; the isolation gap's non-magical support routes;
  stripArcaneInstitutions' roster repair, isolationGenerator.js:225-245).
  MG-4's twin-world envelope measures it: a mundane realm's member count,
  institution count, and service count land within tolerance of its magical
  twin on the same seed-family. Narrower route rolls (resolveConfig.js:104's
  isolation guard) are ACCEPTED and documented, not a defect.
- **MG-LAW-4 — AUTHORED PREMISES SURVIVE.** A MANUALLY selected magical_node
  survives by design (resolveResources.js:169-177 — "authored premises stay
  visible for the validator to classify"); user custom content keeps its own
  path; the DM's per-settlement override (ConfigurationPanel.jsx:443-450)
  remains sovereign AFTER mint — one strange glowing city in a mundane realm
  is a deliberate act. The validator warns (MG-3f), never erases.
- **MG-LAW-5 — DETERMINISM + THE FINGERPRINT.** The knob joins the seed's
  input surface: same seed + same knob = same world, forever. magicExists is
  already a structural-fingerprint input (structuralFingerprint.js:315), so
  the toggle changes fingerprints exactly as any config input does — a NEW
  world, never a mutated one. No golden moves for existing saves (their
  configs are untouched); the instant-world composer's own goldens gain the
  mundane arm as NEW cases.
- **MG-LAW-6 — THE VIRTUAL-FLAG DISCIPLINE.** The realm-level remainder
  (`realmMagicDefault`, §4) follows the house idiom exactly: ABSENT from
  DEFAULT_SIMULATION_RULES (preset-identity hazard, simulationRules.js:552-564
  — adding a default key re-infers presets for every save), DECLARED in one
  preset so the certification walker sees it (the invisible-key hazard,
  simulationRules.js:430-437), read `=== true`/`=== 'mundane'` defensively
  (virtual keys ride `...input` unnormalized, :697-706), added to BOTH
  telemetry allowlists (spatialUsage.js:75 TRACKED_FLAGS +
  pulseFingerprint's twin) and to PUBLIC_SIMULATION_RULE_KEYS for the world
  export (worldExport.js allowlist — the four-key list must grow or the
  field silently drops from exports).
- **MG-LAW-7 — REQUIREMENTS 13 + 14 (spine).** Alignment line: DECLARED
  EMPTY — a config knob reads no alignment axis and moves none. Edit-verb
  story: the modal IS the create verb; post-creation the campaign surface
  shows the realm's magic stance READ-ONLY with "chosen at creation — new
  settlements follow it; regenerate the realm to change it" (honest regen
  semantics, never a silent live flip); each member keeps its existing
  per-settlement edit verb; the AI surface proposes nothing here (a
  generation-time choice has no typed-proposal lane).
- Constitutional inheritance (war §1a): same-seed byte identity; seeded
  purity; monotone ratchets (all new logic in lazy leaves); finite semantics;
  premium isolation (the Instant World card is already the premium-gated
  surface, premiumGateSingleSource.test.js:135).

## §2 SUBSTRATE CENSUS (receipts from wf_7bd3c9b3-2f8; live code outranks)

| Surface | Receipt | State |
|---|---|---|
| Bulk-gen UI (the ONLY one; desktop-only) | InstantWorldEntry.jsx:58-71 handleGenerate, :151-165 CTA; mounted solely at SettlementPalette.jsx:155-157 (realm empty state) | BUILT |
| Dispatch chain | instantWorld(basicConfig,{seed}) → instantWorldSlice.js:12-34 → instantWorldBody.js:103-267 runInstantWorld → composeInstantWorld.js:86-191 | BUILT |
| Realm knobs | worldPlan.js:120-126 normalizeBasicConfig → {realmSize, tone, mapKind} ONLY | THE GAP |
| Member mint | composeInstantWorld.js:180 `{...DEFAULT_CONFIG, settType, _randomizePriorities:true}` — magic hard-ON | THE GAP |
| The knob→realm-rule precedent | tone → SIMULATION_RULE_PRESETS → ensureWorldState (composeInstantWorld.js:221-226) | BUILT — the pattern MG-1 copies |
| Pre-generation modal | NONE anywhere (no Dialog in InstantWorldEntry; GenerateWizard's only dialog is a post-gen exit guard :595-603) | NET-NEW |
| Per-settlement axis | configSlice.js:28,31; resolveConfig.js:79-80,147; constants.js:37-41; magicLedger.js:73-87; priorityHelpers.js:105-108 | BUILT, deep |
| Generation arbiter | generationContext.js:199-356 (worldLaw; 15 consumers; patterns :29-55; NEGATED_MAGIC :41-49) | BUILT |
| Display honesty | magicProfile.js:377-399; MagicTab.jsx:63; pdf viewModel.js:916-926; bandLadders.js:131-135 ("Magic is disabled…") | BUILT |
| Regen contract | settlement.`_config` raw + `config` resolved (assembleSettlement.js:157,163); full regen = restore `_config` → fresh generate (SettlementsPanel.jsx:102-103); magicExists/priorityMagic NOT in DERIVED_CONFIG_KEYS strip (settlementSlice.js:187-193) — the projection SURVIVES both regen paths; regenSection reads resolved config (:1091) — benign here | BUILT |
| Config-key allowlist | updateConfig filters unknown keys (configSlice.js:98-102) — no new key needed (magicExists exists) | BUILT |
| Realm settings home | campaign.worldState.simulationRules; unknown keys survive normalize (:689-696) + ensureWorldState spread; persisted wholesale (localStorage sf_campaigns + saved_maps map_data JSONB, campaigns.js:265-338); account export round-trips verbatim (accountData.js:334-342) | BUILT |
| Existing realm magic rule | magicEconomyEnabled (dark, simulationRules.js:481) gates the W-K sim lane — ORTHOGONAL: the lane reads magicLedger per settlement and magicFormFloor already nulls when !magicExists (magicForms.js:408-423); a mundane realm leaves it naturally inert; no interaction | BUILT |
| Undo hazard | pulse-undo restores worldState WHOLESALE (campaignWorldPulseDeferred.js:465-469) — a live realm setting would silently revert on Undo Last Pulse; the projection design dodges this entirely (members ride their own saves; the default key is create-time-written, then never edited live) | HAZARD, dodged by design |
| Certification hook | world_law_magic row per settlement (generationCoherence.js:365-376,503) — inherited free per member | BUILT |
| Dead-magic tests | 68 files reference magicExists incl. deadMagicLeaks.test.js + generationWorldLaw.test.js | BUILT |

## §3 THE LEAK REGISTER (pre-existing per-settlement defects a whole-mundane
## realm makes visible; all CONFIRMED-BY-READ, marked REPRODUCE-FIRST)

| # | Leak | Receipt |
|---|---|---|
| L1 | teleportEdges is config-blind: deriveTeleportEligibility(seeds, institutionsById) takes NO config; a legacy roster's 'Teleportation circle' forms teleport edges in a magic-off world | teleportEdges.js:116-132,150-158 vs its own header claim :16-18 |
| L2 | feasibilityGate can verdict `require_magic` ("arcane force could tip…") off PURELY MUNDANE materiel (weapon/armor/forge/siege terms) | feasibilityGate.js:148,196 |
| L3 | warDeployment mints a magicSupport combat facet from materiel with no magic gate | warDeployment.js:672-679 |
| L4 | neighbourGenerator mints 'Arcane Exchange Circle', 'Arcane Envoys', 'Arcane Observers', 'Anti-N Arcane Resistance' with zero magicExists reads | neighbourGenerator.js:313-384 |
| L5 | legacyGenerator branches on type==='magical' with no worldLaw import | legacyGenerator.js:165-170 |
| L6 | structuralValidator's high-magic-institution warning fires at 'low' but NOT at 'none' — the dead-magic world with a legacy circle gets no warning | structuralValidator.js:481-495 |
| L7 | Display asymmetry: magicExists:true + priorityMagic:0 falls past the short-circuit to the ladder — band 'none' renders availability 'rare' + legality 'restricted' (claims rare magic where generation produced none) | magicProfile.js:36,112-114,384 |
| L8 | TWO duplicate legacy-migration writers with the same magicExists inference rule — a change to one silently forks | settlements/helpers.js:12 + SettlementDetail.jsx:93-95 |
| L9 | canonBand swallows ANY unknown band token to 'medium' silently (already caused the medium/moderate zero-supply incident of record) | magicLedger.js:49-57 header :8-13 |
| L10 | Faction classifiers label mundane 'Tower/Academy/College/Sage' factions arcane by name-regex, ungated | factionArchetypes.js:60; factionCategories.js:62 |
| L11 | institutionProbability's magic suppression is INDIRECT (dial-zero), leaking if a caller passes unresolved config | institutionProbability.js:90-95,174 |
| L12 | customContent's arcane path keys on config.magicLevel separately from worldLaw | customContent.js:268-273 |

## §4 THE ARCHITECTURE (four slices, dependency order)

### MG-1 — THE QUESTION (the modal + the fourth knob)

`basicConfig` gains `magic: 'yes' | 'no'` (default 'yes'):
`normalizeBasicConfig` widens to four keys; `deriveWorldPlan` echoes it into
the plan (beside tonePresetId); the plan's provenance echo lands on
`campaign.instantWorld` as the realm's recorded stance. THE MODAL is net-new,
built on the house Dialog primitive (13 existing consumers to pattern-match;
nearest analogue per recon: the autoplacement confirm), interposed between the
Generate CTA and `instantWorld(...)` in InstantWorldEntry.handleGenerate:

- Copy (game-grade UX law — the DM's question, never the engine's):
  **"Does magic exist in these lands?"** — subtext: "This shapes every
  settlement in the realm: its mages and arcane orders, its magical events,
  its enchanted trade. Gods and temples remain either way — belief is not a
  spell." Buttons: **"A world of magic"** (default focus) / **"A mundane
  world"**. Esc/дismiss = cancel the generation entirely (never a silent
  default); the choice is remembered per user via displayPrefs (already in
  the persist allowlist, store/index.js:116-145) and pre-selected next time.
- The inline knob panel gains a read-only echo chip of the remembered choice
  so the modal never surprises.
- Accessibility: role="dialog", aria-modal, focus trap — the existing Dialog
  primitive's contract.

### MG-2 — THE PROJECTION (the core; one spread, whole-lifecycle correctness)

`composeInstantWorld.mintSettlement` (:87-93) projects the answer into every
member at the ONE mint site:

`{ ...DEFAULT_CONFIG, settType: site.tier, _randomizePriorities: true,
   ...(plan.magic === 'no' ? { magicExists: false, priorityMagic: 0 } : {}) }`

Both fields together, matching the per-settlement UI's own coupling
(ConfigurationPanel.jsx:443-450 writes both). Because the member's `_config`
persists this raw truth (assembleSettlement.js:163) and neither field is in
the DERIVED strip list, the projection SURVIVES: full regen (restore-`_config`
→ generate), section reroll (reads resolved config — carries both), save/load,
share (publicSafe keeps `config`), account export, and every pulse read
(magicLedger reads the member). Zero new gates. Additionally:

- `worldState.simulationRules.realmMagicDefault: 'mundane'` is written at the
  same site the tone preset already writes rules (composeInstantWorld.js:
  221-226) — ONLY when 'no' (virtual-flag idiom, MG-LAW-6; absent = magical).
  Its ONE consumer: the single-settlement wizard, when generating INTO an
  active campaign whose realmMagicDefault is 'mundane', pre-sets
  magicExists:false in the config panel (visibly, overridably — the DM's
  glowing-city exception stays one click away). It is never read by
  generators, pulse, or display (MG-LAW-1).
- The campaign surface renders the stance line per MG-LAW-7's edit story.
- Analytics: the GenerateWizard already emits magic_exists
  (GenerateWizard.jsx:220); the instant-world completion event gains the
  realm knob; both telemetry allowlists updated (MG-LAW-6).

### MG-3 — THE LEAK CLOSURES (§3's register; each slice REPRODUCE-FIRST)

Order by structural load: (a) L1 teleport — deriveTeleportEligibility gains
the config/ledger gate at the spatialDigest call site (:52,277-281); (b)
L2+L3 war — feasibilityGate's magicEdge and warDeployment's magicSupport
consult the PAIR's magicLedger (both must hold magic for an arcane edge;
mundane realms get verdict vocabulary without `require_magic`); (c) L4+L5
neighbour + legacy generators import worldLaw and gate their magic arms
(mundane neighbour-org name pools authored under the content-depth floor —
four variants per slot, the SP-6 discipline); (d) L7 display asymmetry —
magicProfile short-circuits on band 'none' as well as magicExists:false; (e)
L6 validator gains the 'none' arm (warn on ANY high-magic institution in a
none-band world); (f) L8 the duplicate migration writers consolidate into one
shared helper (single-writer law); (g) L9 canonBand's unknown-token arm emits
a classified warning receipt instead of a silent 'medium'; (h) L10-L12
classifier/probability/custom-content gates, lowest load. EVERY slice begins
with the surveyor's named reproduction (e.g., L1: roster with 'Teleportation
circle' + magicExists:false ⇒ assert edges form TODAY, then close), per
adversarial-verify's reproduce-then-clear.

### MG-4 — THE MEASURE (realm-scope acceptance)

The dead-magic discipline promoted to realm scope, all soak/gate-side:
(1) THE MUNDANE-REALM PIN — a fixed-seed instant world with magic:'no'
asserts, across ALL members: every world_law_magic certification row green,
zero arcane institutions/factions/services (the §3 classifiers' vocabulary as
the census), zero magical/wild_magic history events, zero teleport edges,
magicProfile all-absent everywhere. (2) THE TWIN-WORLD ENVELOPE (MG-LAW-3) —
same seed-family magical vs mundane: member/institution/service counts within
an authored tolerance band; a mundane world measurably NOT thinner. (3) THE
PULSE PIN — N advances of the mundane realm mint zero magic_deadzone /
magic_practitioner / magic_regime_* events (the four pulse magic kinds,
grep-censused). (4) A mutant control per pin (un-gate one closure, prove the
pin reds).

## §5 WHAT IS DELIBERATELY NOT BUILT

No third "low magic" realm option in v1 (the binary maps to the existing
hard axis; a graded realm preset would need the dead genre/magicBias axis
revived — schema.js:1569's typedef is disposed dead code, and reviving it is
an owner call). No live realm-level magic gate (MG-LAW-1). No deity/faith
gating (MG-LAW-2). No retroactive mutation of existing campaigns (the toggle
is create-time; existing realms keep their members' truth). No stripping of
authored magical premises (MG-LAW-4). No mobile surface (the bulk-gen card is
desktop-only by existing design, WorldMap.js:758-770).

## §6 CHAIR CHECKPOINTS FOR SOL

| At | Checkpoint |
|---|---|
| Before MG-3 | Read docs/DESIGN_MAGIC_ECONOMY.md (unread by recon; reconcile — it may carry owner rulings on the magic-off case) |
| MG-2 | If any supabase server-side sanitizer (migrations 089/121/123/129 mirrors) strips realmMagicDefault, STOP and report (recon did not read the DDL) |
| MG-3b | If gating magicSupport shifts existing war goldens, STOP — that is a live-behavior change needing its own disclosed ruling |
| MG-4 | Twin-world tolerance bands are owner-signed at the soak (tuning surface) |
| MG-LAW-2 | The divine-effects ruling is vetoable — if the owner overturns it, defenseGenerator:112-119 + chainMagicSubstitution:25-29 change POLICY, a separate disclosed wave |
