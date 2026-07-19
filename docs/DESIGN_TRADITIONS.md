# DESIGN — THE TRADITIONS (Engine Lift #4: culture)
### FROZEN 2026-07-18 · owner commission "lets bring in culture" → "yes do it"
Recon receipts: scratchpad trad-{time,powers,movement,machinery}.md (4 agents,
file:line-anchored, composite @ 78a04afc). NO existing traditions machinery exists
(verified NOT FOUND) — greenfield on the virtual-flag + sidecar-ledger + pulse-seam
precedents. Builds DARK; `traditionsEnabled` = the EIGHTH flag at THE ONE REGEN.

## §0 OWNER SPEC (binding, verbatim spine)
Per-settlement holidays/festivals/events/fairs · singular ORIGIN, core always
persists · tier-coherent evolution (thorp family rite → metropolis spectacle) ·
timebound (week/month/season; variable reasonable duration) · affects economy/
legitimacy dynamically by SUCCESS which depends on economy (weighted PRNG, manager
determines) · slow believable mutation from economic identity/terrain/alignment/
patron deity · thorp 1-2, metropolis many · a POWER owns each; ownership mutates
with settlement state; owner accountable (success = legitimacy + economy boost) ·
vassals may be forced to trade a tradition for the overlord's · economic war/low
prosperity ⇒ skipped or failed · population influx ⇒ adoption/replacement from the
source settlement. Dossier surface: the WORLD tab group (owner placement).

## §1 STATE MODEL — kernel-owned, sidecar ledger + display mirror
- Engine truth: `worldState.spatialLedgers.traditions` (set/getSpatialLedger idiom —
  zero persisted bytes when absent; occupations' top-level key is the exception, NOT
  the template). Shape: `{ [settlementId]: TraditionRec[] }`.
- `TraditionRec = { id, coreMotif:{element, act}, name, foundedYear, window:{startWeekOfYear,
  weeks}, scaleBand, ownerKey, ownerKind:'faction'|'institution'|'seat', deityRef|null,
  expression:{trappings[], epithet}, mutationLog:[{year, kind, cause}], lastHeldYear,
  lastOutcome, suppressedBy:null|{overlordId, sinceYear, traded:TraditionRec},
  adoptedFrom:null|settlementId }`.
- Display mirror: `settlement.traditions` written by the mover via settlementUpdates
  (npcLadder mirror precedent) — read-only for UI/dossier/exports. KERNEL-STATE RULE
  (recon §time): ALL state rides the kernel's returned worldState/settlementUpdates —
  survives BOTH store commit paths (runAdvanceCampaignWorld Phase-2 AND
  runResolveIntervalMajors resume) for free; NO store-side cursors, ever.
- CULTURE-DERIVED-LAW RECONCILIATION (recon red flag): traditions are RECORDED EVENTS/
  HISTORY (calamityHistory class), not an authored culture coordinate — the culture
  VECTOR (cultureDistance.js) stays derived; it MAY later read tradition state as one
  input (deferred seam §16), never the reverse.

## §2 GENESIS — tick-time, with a pure view-time preview (THE MINT-TIME RULING)
Recon (machinery ⚠): a GENERATION-time mint shifts ALL ~190 generatorGoldenMaster
hashes (sha256 of the full settlement object; virtual flags never reach generation).
RULED: genesis is TICK-TIME — the mover mints a settlement's traditions at its FIRST
LIT TICK (flag-gated), making existing-settlement backfill INHERENT (no separate
veteran-backfill pass) and the generator goldens untouched by construction.
- ONE PURE FUNCTION `deriveFoundingTraditions(settlement)` (new lazy domain leaf):
  seeded `${settlementSeed}::tradition:genesis`, reads ONLY stable settlement fields
  (origin story fields, terrain, culture, economic identity, alignment axes via
  primaryDeitySnapshot evil01/chaos01, tier, age). Returns the founding set: core
  motif(s) {element: hearth|harvest|river|stone|founding|the-dead|first-landing…,
  act: feast|procession|vigil|contest|fair|offering}, window (seeded weekOfYear,
  duration 1-2 weeks; 4-4-5 calendar, 52-week year — mechanics bind to weeks;
  "the third week of harvest" is prose), name from the tradition prose corpus.
- Count at genesis: by CURRENT tier band (thorp/hamlet 1-2 · village 2 · town 3 ·
  city 4-5 · metropolis 5-7, seeded jitter) — an old city minted late reconstructs
  its ladder: founding core(s) + per-tier-band additions with synthesized
  expression, all from the same seed (deterministic regardless of WHEN minted).
- THE PREVIEW: the dossier Traditions tab calls the SAME pure function view-time for
  draft/uncampaigned settlements (the town-map view-time-projection precedent) —
  drafts show their FOUNDING traditions; evolution/ownership/outcomes exist only
  where time exists (a campaign). Zero settlement-object writes ⇒ zero golden risk.

## §3 OCCURRENCE — the calendar hook
- Tick = 1 week ALWAYS (orchestrator calls one_week; catch-up runs REAL weeks —
  recon: the collapse is persist-shape only, so occurrences fire correctly inside
  collapsed decades; NO aggregation logic). CATCH_UP_CAP_WEEKS=26: weeks skipped
  past the cap don't fire (documented limitation, matches every other system).
- Gate (calamity year-boundary precedent): occurrence OPENS when weekOfYear (from
  seasonForTick(elapsedWeeks)) enters rec.window and lastHeldYear < year.
  Idempotent: outcome drawn ONCE per (tradition, year); stamp lastHeldYear.
- SKIP CHECK first: hard stressors (active siege/occupation-burden/plague famine via
  activeConditions archetypes + worldState.stressors) or prosperity band ≤ desperate
  ⇒ CANCELLED (recorded, mild owner-legitimacy cost, no success roll). Cancelled ≠
  failed — deliberate restraint reads better than public collapse.

## §4 SUCCESS — the weighted outcome model (manager determination per delegation)
One draw: `createPRNG(`${worldState.rngSeed}::tradition:${rec.id}:${year}`).random()`
— TICK-INVARIANT world-seed fork (seasonalSeverityFor pattern; NEVER the per-tick
pulse rng). Score = base 0.55
  + prosperity: via prosperityRank ONLY (recon ⚠ never string-match): rank-3 map
    [-0.25 … +0.15]
  + seasonalSeverityFor(rngSeed, year, sid): drought/hard_winter −0.12 (if window in
    the afflicted half-year), bountiful +0.08
  + owner health: publicLegitimacy.score (defend legacy bare-number shape!) mapped
    [−0.10 … +0.08]; ladderInstabilityOf(settlement, ownerKey) −0.06 when >0.5
    (read-only, null-safe when ladder dark)
  + war pressure (non-siege wartime stressor) −0.08
  + scale-vs-means mismatch: scaleBand > prosperity-supported band ⇒ −0.10/step
  + streak: lastOutcome failure −0.04 (fading memory), triumph +0.03.
Clamp [0.05, 0.95]; draw r: r < score−0.25 ⇒ TRIUMPH · < score ⇒ GOOD · < score+0.15
⇒ MODEST · < score+0.30 ⇒ TROUBLED · else FAILURE. (Tuning-window dials; soak
certifies the distribution.)

## §5 EFFECTS — read-many, WRITE-BOUNDED (the constitution of this design)
Writes go ONLY through existing idioms, all bounded, all inside the mover's result:
- Economy: applyProsperityDeltasToUpdates band-step pulse (upswing precedent):
  TRIUMPH +1 band-step (decays via the existing in-kind write), FAILURE −1;
  MODEST/GOOD/TROUBLED 0 (news-only texture).
- Legitimacy: applyLegitimacyHits idiom (momentum.js:1094; integer, clamp, score-only
  — the KNOWN stale-label drift is accepted, identical to every sibling writer;
  never hand re-band): TRIUMPH +3 · GOOD +1 · TROUBLED −1 · FAILURE −3 · CANCELLED −1.
  Legacy publicLegitimacy polymorphism guarded (Number.isFinite(pl?.score)).
- Faith: deity-flavored traditions nudge religionStates share/legitimacy via the
  religionState writer ±1 (existing write surface).
- News: WizardNewsEntry via the mover's newsEntries[] (applyPulseMover fold): MAJOR
  for triumph/failure of the largest scaleBand, NOTABLE otherwise; distance-priced
  spread rides the existing news machinery untouched.
- Chronicle/provenance: outcomes carry outcomeId `tradition.${kind}.${sid}.${year}`;
  provenance edges via the existing collectProvenanceEdges pass (no new writer).
- ⛔ NOT WRITTEN: faction.power (no live writer exists to reuse — recon ⚠; the
  failed-festival→coup-window coupling is DEFERRED SEAM §16 until the ladder's
  faction-key fix lands). No new write paths into any other kernel's state. Ever.

## §6 OWNERSHIP — powers with stakes
- ownerKey targets the REAL faction shape: powerStructure.factions[] carry the name
  in `.faction` (NO .name/.id — recon ⚠ the ladder's key fn would collapse these;
  do NOT copy ladderFactionKey; key = `fac.${slugify(f.faction,{sep:'_',max:80,
  fallback:'unknown'})}` with the .faction field). Institutions (no instance ids —
  recon ⚠) key by `inst.${name}` and ownership REASSIGNS if the institution
  disappears from the roster (orphan check each occurrence year). The ruling seat =
  `seat` (governingFactionOf).
- Assignment at genesis by motif-fit: offering/vigil → religious institution/faction
  (deityRef stamped); fair/market → merchant/craft; contest → military/defense;
  founding feast → the seat. Seeded tie-breaks.
- REASSIGNMENT CHECKPOINTS (event-driven, not polled): transferRulingPower cause
  coup/conquest/election (seat-owned traditions follow the new seat; others may be
  claimed by the ascendant faction, seeded chance) · urbanFabric 'turn' beat (the
  regime-lingering district class flips → district-anchored traditions re-anchor) ·
  religionState patron change (deity-flavored traditions re-dedicate = mutation §7).
- Stakes: §5 legitimacy pulses land on the OWNER (seat ⇒ publicLegitimacy; a
  faction/institution owner ⇒ publicLegitimacy at half weight + the news names them
  — display-side accountability until the faction.power seam opens).

## §7 MUTATION — slow, believable, checkpoint-gated (reframe-class discipline)
Core motif IMMUTABLE forever. Expression mutates ONLY at: tier crossing (scale-up:
scaleBand++, trappings re-express; the thorp hearth-supper → the Night of Ten
Thousand Hearths) · ownership reassignment (patron re-dress) · deity change
(re-dedication) · imposition/liberation (§8) · adoption arrival (§9) · GENERATIONAL
DRIFT: one seeded micro-mutation per tradition per ~30 years (hysteresis: min 8
years between ANY two mutations of one tradition; cap 1/checkpoint). Every mutation
appends mutationLog {year, kind, cause} — the tradition's own readable history
(provenance-grade content for the dossier register).

## §8 IMPOSITION — the vassal mechanic (occupation ledger = the authority)
- Trigger: worldState.occupations[sid].state === 'vassalized' (the ONE model that
  actively mints on transition — recon; treaties/hegemony stay derived-only).
  Seeded chance per vassalized year: the overlord's highest-scale tradition is
  IMPOSED — the local tradition of matching motif-slot is SUPPRESSED, NOT deleted:
  suppressedBy {overlordId, sinceYear, traded:<the record>}. The imposed copy
  carries adoptedFrom: overlordId and the overlord's expression.
- LIBERATION (occupation ends/state ladder drops): the suppressed core RETURNS at
  the next occurrence window — mutationLog kind 'restoration' — liberation
  festivals emerge from pure mechanics. Reframe reading of imposition = deferred
  seam §16 (REFRAME_VOCAB is frozen at 8 act classes; extension rides reframeEnabled).

## §9 ADOPTION — culture travels with population (aggregate-only, NPC boundary binding)
- Detection: the mover reads the MIGRATION LEDGER's due columns (arrivalTick ≤ tick)
  at tick start — spatialLedgers.migration, pure read — capturing {originId, count}
  BEFORE the drain (recon ⚠: originIds exist only transiently at release; reading
  the due columns pre-drain avoids any handoff; implementer orders the mover
  accordingly in the chain). Influx fraction = count/(pop+count).
- Threshold: cumulative influx from one origin ≥ 12% of destination pop within a
  rolling 3 years ⇒ ADOPTION CHECKPOINT: mint a transplanted tradition — the
  ORIGIN's highest-affinity tradition's CORE, re-expressed in the destination's
  identity (adoptedFrom stamped); if the destination is at its tier cap, it
  REPLACES the lowest-scale non-founding tradition (recorded 'displaced').
- Aspatial campaigns (spatialCanonVersion absent): NO origin exists (teleport path)
  ⇒ adoption dormant, byte-identical (recon ⚠ honored).

## §10 SURFACES
Dossier: Traditions register IN THE WORLD GROUP beside daily_life (owner placement;
data-only TAB_GROUPS registration; NPC-first ordering untouched) — register rows:
name · motif glyph · window ("Harvest, the third week") · owner · last outcome ·
the mutationLog as a provenance line. Draft settlements: the §2 pure preview.
Almanac/RealmStrip: "coming this season" line. Chronicle: outcome entries. Map:
festival-week dress via IT-3's state-dress hook (groundDressOps parameter swap —
lanterns on the high street during the window; deferred to the IT lane's seam).
Exports: the register + almanac ride the existing PDF sections (new section =
declared golden shift at the regen). Hooks: outcome-conditioned plot hooks join the
hook corpus (content leaf).

## §11 CUSTOM CONTENT + AI
Facet-law citizen: declared traditions via a NEW custom_content bucket 'traditions'
(validator per validateDeity template; ⚠ the custom_content_category_check MUST be
widened via the 049-pattern DROP+re-ADD migration — written-not-deployed; omitting
it hard-rejects cloud writes). Declared-over-derived at genesis (a declared
tradition claims a genesis slot). AI proposals ride S4/StyleOverhaul accept→mint,
SURVEYOR-gated per the One Door ruling. Prose corpus: new src/data leaf pools via
the eventProse registry — CANONICAL-AT-ZERO law preserved (index 0 = canonical,
falsy seed ⇒ 0; no calamity substrings).

## §12 FLAG · DORMANCY · GOLDENS
- `traditionsEnabled` VIRTUAL: ABSENT from DEFAULT_SIMULATION_RULES (⚠ BOOLEAN_KEYS/
  RULE_COMPARISON_KEYS derive from it — adding it there changes preset identity and
  persists bytes); rides preset ...overrides (WAVES idiom); gate read
  `rules?.traditionsEnabled === true` (npcLadderActive idiom).
- Mover: a NEW lazy leaf that NAME-SWAPS the chain (pulseKernel is at its frozen
  line ceiling — advanceNpcGrowthWithFabricAndConsequenceAndLadder →
  …AndTraditions on the SAME line; traditions run LAST).
- Dormancy golden: npcLadderDormancyGolden template — full-advance mechanical hash
  with the gate ABSENT (byte-identical), contract assertions (no ledger key, no
  settlement.traditions mirror, no news), lit anti-vacuity block.
- No generator golden shift by construction (§2). The dossier tab/PDF additions are
  display-side; the PDF goldenViewModel shift is declared at the regen batch.

## §13 SOAK METRICS (certification targets, not assumptions)
Occurrence cadence (every tradition fires its window yearly unless skipped — verify
skip rate 5-20% band across CENTURY-300) · outcome distribution (triumph+failure
combined 15-35%; neither degenerate) · mutation rarity (median gap ≥ 12 years;
no tradition >6 mutations/century) · adoption frequency (>0, <1 per settlement per
50 years on spatial campaigns) · imposition/restoration round-trips observed ·
legitimacy pulse net-drift bounded (no runaway from festival stacking).

## §14 COHERENCE MATRIX (reads → / writes ⇒)
READS: calendar/seasonForTick · seasonalSeverityFor · prosperityRank ·
publicLegitimacy (legacy-guarded) · activeConditions/stressors · powerStructure
.factions(.faction!)/governingFactionOf · religionStates/primaryDeitySnapshot ·
urbanFabric 'turn' beats · occupations (vassalized) · migration ledger due columns ·
ladderInstabilityOf (null-safe) · settlement stable seed/tier/terrain/culture.
WRITES ⇒ ONLY: its own spatialLedgers.traditions + settlement.traditions mirror ·
prosperity band-step (existing applicator) · legitimacy score (existing applicator)
· religion share ±1 (existing writer) · newsEntries[] · outcomes/provenance via
existing passes. NOTHING ELSE — enforced at review by grepping the lane's diff for
writes outside this list.

## §15 SLICES (dark lane claude/traditions off the composite; Opus; lettered
commits; focused gates + full suite at lane end with the flake-isolation protocol)
- T-1 GENESIS: deriveFoundingTraditions (pure leaf + corpus data leaf) + the
  view-time dossier preview (World-group tab registration, lazy) + unit/property
  tests (same seed ⇒ same set across 200 seeds).
- T-2 THE MOVER: flag + ledger + first-lit-tick mint + occurrence/skip/outcome
  engine + effects (§5) + dormancy golden + lit anti-vacuity.
- T-3 POLITICS: ownership assignment/reassignment checkpoints + tier-crossing +
  drift mutations + mutationLog.
- T-4 RELATIONS: imposition/suppression/restoration + migration adoption (+ its
  aspatial dormancy proofs).
- T-5 SURFACES: register polish + almanac line + hooks + news prose pools + PDF
  section (declared) + custom-content bucket + CHECK migration (written-not-
  deployed) + facet/AI seam.
- Each slice's report: JUDGMENTs vetoable (motif vocabulary, weight table, prose
  register — all taste-adjacent).

## §16 DEFERRED SEAMS (recorded, never silent)
faction.power feed for failed festivals (awaits the ladder faction-key fix — filed
to ROUND 3 intake) · REFRAME_VOCAB 'tradition' act class (frozen table edit, rides
reframeEnabled) · culture-vector reading tradition state · map festival-week dress
(IT lane's groundDressOps hook) · tradition-aware trade lane bonus (fair = trade
pulse beyond the prosperity step) · cross-settlement pilgrimage attendance.

## §17 RECON HAZARDS BOUND INTO THE BRIEFS (fire = defect)
Weeks are canonical, 4-4-5 grid; never derive from elapsedMonths · keep ALL state
in kernel results (both commit paths) · spatialLedgers namespace (not top-level) ·
tick-invariant world-seed forks only · prosperity via prosperityRank · legitimacy
legacy-shape guard · .faction not .name · institutions have no instance ids ·
pulseKernel line-ceiling name-swap · eventProse canonical-at-zero · custom bucket
CHECK migration · NPC aggregate-only boundary · CATCH_UP_CAP unsimulated weeks.
