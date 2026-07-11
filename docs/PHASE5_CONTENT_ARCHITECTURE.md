# Phase 5 — Situational Content Architecture (W2 design contract)

Owner directive (2026-07-11): overabundance of SITUATION-SPECIFIC content — "the guard
captain is compromised because the garrison is underfunded" — across war, economics, faith;
specific to the situation yet generic enough for any campaign.

## The conjunction architecture
Content is keyed to CONJUNCTIONS, not entities: (role x situation x cause).
- ROLES: the institution/NPC role vocabulary (guard captain, high priest, guildmaster,
  magistrate, harbormaster, ...).
- SITUATIONS: the engine's state vocabulary (compromised-covert, compromised-revealed,
  understaffed, underfunded, zealous, desperate, thriving, contested, ...).
- CAUSES: the trace/cause-chain classes the engine ALREADY EMITS (the legibility law's
  receipts become the content selectors): economic (underfunded, chain-starved, depleted,
  trade-strangled), war (levied-away, garrison-drained, siege-scarred, occupation), faith
  (conduct-drift, conversion-pressure, secularization, clergy-scandal), corruption
  (captured, scandal).
The dimensions multiply: ~30 roles x ~12 situations x ~10 cause classes x >=3 variants —
a few thousand authored lines covering a space that feels bottomless.

## The specific-yet-generic rule
Every variant names the MECHANISM structurally, never the setting: template slots
({name}, {institution}, {faction}, {deity}); concrete causation in the prose.
"The garrison's pay has run short three seasons now, and Captain {name} has quietly
started taking {faction}'s coin." Portable everywhere; selected only where true.

## The coverage ladder (pinned)
A coverage test enumerates the ENGINE'S actually-reachable conjunction space (derived from
the state + cause vocabularies, not hand-listed) and asserts every conjunction resolves:
specific variant -> cause-class generic -> role generic. Nothing renders empty; a coverage
gap FAILS THE GATE. Anti-repetition (familyId, drawUnique, Jaccard pins) applies per
conjunction-family; the 0.20%/6.3% repeat gates must be beaten and tightened.

## Downstream
Phase 6's funnel measures which conjunctions DMs copy (feedback widget + generation_id) —
content investment follows demand. The W2 reviewed golden regen carries the multiplication.

## Cause-resolution lifecycle (OWNER, 2026-07-11 — machinery = Phase 5 W3 engine companion; variants = W2)
When a situation RESOLVES (the garrison gets funded) but its effect (the captain's
corruption) was keyed to it, the adjudication is DERIVED FROM CHARACTER, never fixed:
1. RE-CAUSE (organically, in canon): the greedy-flawed captain finds a new patron for the
   old habit — need became appetite; new cause minted with its receipt.
2. RESOLVE/REFORM: the dutiful captain whose corruption was purely situational heals when
   the pressure lifts — sole-cause effects can end. (The redemption arc: without this the
   world darkens monotonically; with it, reform is earned by character and climate.)
3. HISTORICIZE: the weak-willed captain's habit outlives its reason — originating cause
   becomes PAST, a sustaining cause (habit) carries it forward.
Selection inputs: the NPC's trait plane + settlement corruption climate (plane multiplier —
rotten cities rarely reform; devout LG purge arcs invite it) + patron pressure. Seeded,
deterministic, cause-chained; transitions are pulse events entering canon (receipt spine,
DM-visible, undoable).
STRUCTURAL: cause chains gain TEMPORAL STATUS (originating vs sustaining), and the content
conjunction space gains a fourth dimension — cause-status: live | historicized | re-caused |
resolved — with transition prose ("the garrison was funded; the ledger never closed").
Coverage ladder extends over the new dimension. Third instance of the memory principle:
piety lags, armies rust, habits outlive their reasons.

### The two terminals (OWNER, 2026-07-11 — closes the lifecycle)
The re-cause/reform/historicize branches are the COVERT lifecycle, and they run only until:
1. EXPOSURE (covert -> revealed): the thread exits the quiet branches into the PUBLIC arc —
   scandal, legitimacy drag, justice textured by the settlement's law axis (lawful tries,
   chaotic mobs or shrugs, evil promotes). Revealed corruption never quietly historicizes.
2. INFRASTRUCTURE DEATH: sustaining causes must be LIVE entities (the paying syndicate, the
   fence, the backed habit). When the related criminal institution is destroyed (abolition,
   purge, war), every thread keyed to it RE-ADJUDICATES immediately: resolve (the
   arrangement died with its paymaster) or re-cause to another live patron if character
   reaches for one — receipt either way. Habit survives resolved circumstances, never
   demolished infrastructure. Destroying the den cauterizes its threads — targeting it is
   mechanically meaningful.
Liveness checks per tick on sustaining-cause entities; both terminals cause-chained and
canon-entering.

## The temporal constitution (OWNER, 2026-07-11 — audit + registry = Phase 5 W3; age bands = W2 selectors)
THE TICK IS ONE WEEK, on the COMMITTED 4-4-5 calendar (corrected 2026-07-11 to the landed
Calendar Option A, commits 6ca73878 + 888c2769; verified in advanceInterval.js: "a one_year
advance is 52 synchronous one-week ticks" — 4-week months on the 4/4/5 quarter grid,
THIRTEEN-week seasons (four equal 13-week quarters; the 5-week months 3/6/9/12 close each
season), a FIFTY-TWO-week year). The calendar LAW in code is worldState.js's INTERVAL_WEEKS
{one_week:1, one_month:4, one_season:13, one_year:52} + MONTH_END_WEEKS — derive from those,
never restate them. The architect's earlier month assumption was WRONG and may have
propagated into implementer tuning justifications — the audit must therefore NORMALIZE EVERY
constant to tick=week, not merely inventory them.
1. AGE BANDS bind the cause-status dimension: this-week (1) / this-month (<=4) /
   this-season (<=13) / this-year (<=52) / years-past (>52), read from elapsed ticks
   (domain/ageBands.js — pinned equal to INTERVAL_WEEKS by test). PIN:
   historicizing language ("the lean years") is impossible below the years threshold;
   freshly-resolved causes read fresh ("the pay came through just last month").
2. THE TEMPORAL REGISTRY: one documented table — constant, world-time meaning, intuitive
   justification IN WEEKS — covering every time constant (legitimacy LAG ~5-6wk half-life,
   piety ~11wk (~a season — audit whether devotion should be slower), tenure half 8wk =
   2 months, stain, sink/revival rates, readiness up (~2-3wk spike), betrayal cooldown 8wk,
   abolition arc ~5wk to floor, chronicle window 12wk (~a season; a 4-4-5 season is 13wk), rust,
   cause-status thresholds, ...). COMPLETENESS PIN: no unregistered time constant ships.
3. FIRST AUDIT CATCH, NOW SEVERE (fix in W3): readiness DOWN_DECAY 0.04/tick = ~17 WEEKS
   (~4 months) against a specced "generation" (~20 years ~= 1,000 ticks => ~0.001-class
   decay); re-tune with envelope checks. Sweep every W-F5.5/W-F8 constant for
   month-assumption contamination.
4. UNBOUNDED ITEMS GET DURATIONS: army travel costs route-hops in ticks (channel-graph
   distance — no instant arrivals); sieges run distribution-bounded months; famine
   onset/recovery follows stockpile burn arithmetic; audit anything else with an implicit
   clock (conversion arcs, occupation consolidation, mercenary contracts, trade
   normalization, institution founding).
5. SANCTIONED FAST PATHS, explicitly marked (the owner's extreme-case exception):
   compromise-fiat legitimacy collapse, conquest conversion — deliberate, documented, rare.

## The Repaint + Reunification Wave (OWNER, 2026-07-11 — Phase 5, between the engine companion and session mode)
The merge left a VISUAL SEAM: adopted surfaces (landing/pricing/legal) wear the reference
universe's page-shell language; kept-functional-core surfaces (GenerateWizard, Library/
SettlementsPanel, CompendiumPanel, GalleryPage shell, Realm inner panels, WizardNewsPanel,
authUI, HowToUse frame) still render pre-merge layouts. Owner directive: match the reference
universe's page/layout work.
- ADOPT their Page/PageHeader-shell versions of the seven seam surfaces, PRESERVING our
  logic inside them (the standard re-land pattern, pointed at presentation): our wizard's
  E4 fixes, anti-repetition wiring, BuyThisDossier threading, dossier fixes all survive.
- LIBRARY RICHNESS GAP: adopt their four missing components — BulkActionBar, HealthPip,
  SaveQuotaMeter, LivingWorldSignalRow — the Library becomes a dashboard of living places,
  not a list.
- Session mode is built AFTER the repaint (born into the new shell). F-ledger screening,
  ratchets/budget hold, all lazy, browser-verify the seam is gone (landing -> wizard ->
  library -> dossier reads as ONE product).
- REUNIFICATION (owner, same directive): the merge's keep-our-cores decisions dropped THEIR
  FEATURES living inside kept surfaces, not just chrome — confirmed: OAuth sign-in buttons
  (Google/Discord; flags+backend landed, UI never adopted), advance-time from the Library,
  "and so much more." A read-only FEATURE-PARITY AUDIT is combing every surface/control/
  setting/flag in their tree vs ours into memory/feature-parity-ledger.md (present/partial/
  absent/ours-better + transplant notes + top-20 ranked). The wave executes against that
  ledger as its checklist: their features transplanted, our logic preserved inside, F-ledger
  screening as always. Nothing ships on memory of the diff — only on the ledger.
