---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-22
  title: THE HERALD — the 7-section newspaper rebuild of the Realm Inspector
  branch: claude/the-herald
  base: claude/composite-r4 @ d097f180
  status: "ALL 5 PHASES SHIPPED + gated (2026-07-22)"
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T22:30:38.289Z
---

# THE HERALD (Realm Inspector = newspaper rebuild)

The owner-ratified 7-section newspaper rebuild of the Realm Inspector. Spec:
`docs/REALM_INSPECTOR_TAB_ARCHITECTURE.md` (governs). Working name **The Herald**
(manager pick, owner-vetoable) — rendered from ONE constant `HERALD_TITLE`
(RealmInspector.jsx), so a veto is a one-string change.

Branch `claude/the-herald` off composite-r4 tip **d097f180**. FIVE commits (all gated):
- **7fd3e605** — Phase 1 (routing table).
- **b7787c88** — Phase 2 (the shell).
- **311c3067** — Phase 3 (headline grammar + article).
- **06c0bd76** — Phase 4 (filter/focus strip + sort law).
- **ca27f099** — Phase 5 (Divination forecast + Adjudication resolved log).
Final fresh-build closure = **1,039,806 bytes = base d097f180 EXACTLY, Δ 0** (all
phases add zero first-paint bytes — RealmInspector is lazy, absent from the entry
static closure). VERIFY_DIST closure contract 26/26 green.

## Why (the frame)
It is a NEWSPAPER: headline = the glance; article = the recorded cause DAG
(CauseWalkPanel); the paper = 7 news doors; the desk = tools kept OUT. 6 routing
sections {war, faith, trade, events, divination, adjudication} + Dashboard (the
aggregate front page).

## Phase 1 — THE ROUTING TABLE (SHIPPED, load-bearing)
`src/domain/realm/heraldRouting.js` — PURE, IMPORT-FREE leaf (zero runtime imports
of the producer graphs it classifies; closure-safe). Exports:
- `HERALD_SECTIONS` (6, frozen) · `SECTION_OF(kind)` (total, single-home; `events`
  is the explicit catch-all; exact table + stressor-lifecycle delegation + uniform
  family prefixes) · `heraldSectionOfRecord(record)` (STRUCTURAL: pending proposal /
  resolved ruling -> adjudication; emerging-stage stressor -> divination; else
  SECTION_OF by content) · `routingKeyOf` · `isExplicitlyRouted` · KIND_SECTION
  correspondence + divergences.
- ⚠️ Adjudication is NEVER a token output (single-home: `settlement_terminal_death`
  is both a war event AND a proposal payload) — "it is a proposal" is a RECORD
  property, decided in heraldSectionOfRecord.
- ⚠️ Divination gets the 6 `${kind}_pressure` candidate tokens + `regional_pressure`
  (forecast semantics). `war_pressure` (war-layer archetype) stays war — routed by
  EXACT entry, not a `_pressure` prefix.
- Seeded from precedent `KIND_SECTION` (chroniclersLetter.js). 2 recorded per-kind
  divergences (vetoable): settlement_terminal_death -> events, vassal_tribute_
  extraction -> trade.
- Walker `tests/lint/heraldRouting.walker.test.js` (17 tests): totality both ways via
  node matchAll source scan of every `candidateType:`/`impactKind:` literal in
  src/domain + frozen-constant template expansion. E-A mutation plant ("realm/herald
  routing no-orphan", drop `conquest`) in mutation-sweep.sh + manifest entry (added
  with python json.dump indent=2 ensure_ascii=False — F24 hazard).

## Phase 2 — THE SHELL (SHIPPED)
Consolidated the OLD 10 doors (dashboard/letter/war/road/treaty/resolve/pantheon/
pulse/chronicle/timelapse) -> 7 (dashboard/war/faith/trade/events/divination/
adjudication). Files:
- `RealmInspector.jsx` = chrome ONLY now (size states, tabs, desk strip, time lens).
  ⚠️ The size/chrome machinery (data-testid, data-expanded, geometry, aria-labels,
  Suspense 'Loading…') is preserved VERBATIM — `realmInspectorSize.test.jsx` pins it
  all. `REALM_INSPECTOR_SECTIONS` export name KEPT (oracleRemoved pins it).
- `HeraldBody.jsx` = the 7 bodies. Letter->Dashboard prose mode; Pantheon->Faith
  (ALWAYS present now, graceful empty when deity-free); Treaties->Trade; War&Resolve
  ->War (flag-gated fold-in under warEconomySurfacing); WhileYouWereAway + Advance
  report + WizardNews -> Dashboard prose mode.
- `heraldFeed.js` (display selector, components/map — NOT domain, so it can import
  WorldPulseData helpers) files pulse+chronicle records into the 4 report doors via
  heraldSectionOfRecord. Two lenses: advance = latest pulse; campaign = all
  pulseHistory. Live stressors + forecast are lens-independent.
- `HeraldSection.jsx` renders items through the EXISTING OutcomeCard (already carries
  the AddressChain subject + AffectedSettlements — so Phase 2 ALREADY honors the News
  Address Law partially). Sort = severity-then-recency (the alphabetical-by-settlement
  grouping + urgent pin is Phase 4).
- `HeraldAdjudication.jsx` = decisions desk: pending proposals (apply/dismiss), the
  paused-verdict resume surface, the canonize gate, RealmVerbComposer. ⚠️ EVERY store
  action reused verbatim (applyWorldPulseProposal/dismissWorldPulseProposal/
  resolveIntervalMajors/canonizeCampaignWorld) — NO new store action.
- THE DESK: Road + Timelapse moved to a chrome tools strip (deskTool state; panels
  unchanged). THE TIME LENS (advance/campaign) is a chrome toggle, persists across
  door switches.
- `useRealmInspector` WORKSPACE_TO_SECTION + `useAdvanceSession` openInspectorAt
  redirect the removed doors: pulse/news->dashboard, pantheon->faith, canonize->
  adjudication.

## Gate receipts (Phase 2, CONFIRMED)
- first-paint static closure = **1,039,806 bytes** = base d097f180 EXACTLY (Δ=0,
  margin 194). RealmInspector is lazy -> absent from the entry static closure, so UI
  changes cannot move it. Measured via `npm run build` + VERIFY_DIST closure test.
- 32 inspector tests green (size/hub/oracle/warFaith/deepCraftKillList/controlBytes);
  tsc 0; domain-strict 0; eslint 0.
- ⚠️ tintedCallouts kill-list (deepCraftKillList.test.js) is SHRINK-ONLY at 163 and
  counts lines with `GOLD_BG|successBg|...` under src/components — my HeraldAdjudication
  GOLD_BG usage tripped it; cured by using CARD_ALT + gold border. Any new Herald
  tinted wash must avoid those tokens (use rule-framed clerk's-note idiom).
- ⚠️ PRE-EXISTING RED: `tests/ui/worldMapMobileGate.test.jsx` "mobile" test fails
  identically on base d097f180 (verified in temp worktree) — NOT ours; it renders
  RealmDashboard via RealmMobileGate, a path the Herald never touches.

## Test updates made (faithful to the ratified rename)
- `realmHub.test.jsx` Pantheon-self-hide -> "Faith folds the Pantheon in, always
  present, graceful when dormant" (Faith/War door buttons; no 'Pantheon' door).
- `warFaithSurfacing.test.jsx` "War & Resolve tab" -> "War door fold-in" (mocks
  LiveWarStatus/RealmIntrigue/BeliefDivergenceBand/WarResolveSection sentinel; asserts
  WarResolveSection mounts in the War door iff flag ON + campaign).

## Phase 3 — THE HEADLINE GRAMMAR (SHIPPED @ 311c3067)
`heraldGrammar.js` (headlineSlotsOf reads the record, never composes; frozen
HEADLINE_TEMPLATES per-section reason label; groupBySettlement) + `HeraldHeadline.jsx`
(the shared line by REUSE only: AddressChain subject, AffectedSettlements, RealmEntityLink
group header, Pill provenance; click 'Trace the causes' -> CauseWalkPanel on item.rootId).
⚠️ The recorded headline is the ACTION+OBJECT, carried BYTE-VERBATIM (discourse-kernel
truth-surface law — NOT re-composed). ⚠️ The spec's '—' reason separator is a STYLED gold
rule (layout element), NOT an em-dash char (voice-safe). Provenance chip only when
non-canonical. NESTED form: HeraldSection groups by settlement, header hoists the name,
nested headlines omit the settlement level. Pins: tests/ui/heraldHeadline.test.jsx (11).

## Phase 4 — THE FILTER/FOCUS STRIP + SORT LAW (SHIPPED @ 06c0bd76)
`heraldFilter.js` (pure): matchesFocus (primary OR membership), matchesQuery (structured
over resolved names + headline + kind, NOT deep fields), needsAttention, severityBand,
filterFeed, partitionUrgent, sortGroupsAlphabetical, needsAttentionDigest. `HeraldStrip.jsx`
= persistent chrome strip: search + FOCUS chip on store-global selectedSettlementId (no new
state) + needs-attention toggle + Filters(N) INLINE facet sheet (severity facet; inline =>
no Z_LAYERS entry). RealmInspector computes the filtered feed + per-door count badges;
focused-empty reads 'Nothing at [name]'. SORT LAW in HeraldSection: urgent pin (>=0.85)
above the alphabet, then alphabetical settlement groups; Dashboard front-page needs-
attention banner. Adjudication pending proposals now collapsible group-by-settlement +
focus-scoped. Pins: tests/components/heraldFilter.test.js (8).
⚠️ DEFERRED (follow-up): facet sheet ships only the SEVERITY facet (action-kind/faction-
power/recency facets pending); search is substring, not the ranked Compendium-index
type-ahead.

## Phase 5 — DIVINATION + ADJUDICATION deepening (SHIPPED @ ca27f099)
`HeraldForecast.jsx` = the weather page: frozen 'Pressure builds toward' present-
progressive lead, outcome byte-verbatim, region + recorded drivers, dashed frame + the
amendable chip on EVERY entry (a forecast never reads as fact). Divination door = the
forecast substrate (RealmDocket) above the HeraldForecast list, severity-first.
Adjudication RESOLVED LOG: proposals applied/dismissed ('by you') + latest-pulse auto-
applied significant turns ('by autoresolve'), collapsible + muted, styled APART from the
gold pending desk, focus-scoped + capped 15. NO new store action. Pins:
tests/ui/heraldForecast.test.jsx (4).

## Full-gate receipts (ALL phases, CONFIRMED)
- Closure 1,039,806 = base, Δ0 (fresh build + VERIFY_DIST 26/26). tsc 0; domain-strict 0;
  eslint 0. tests/components 919/919. Copy/voice families + walkers + manifest 50/50.
  All Herald pins green (routing 17 + headline 11 + filter 8 + forecast 4 = 40).
- ⚠️ tintedCallouts kill-list SHRINK-ONLY at 163 (GOLD_BG|successBg|... under
  src/components) — avoid those tokens in new Herald tint (use CARD_ALT + border / clerk-
  note idiom). The 4 parked goldens (belief/generator/deity/pdf-viewmodel) RED by design.
  ⚠️ PRE-EXISTING RED (not ours): worldMapMobileGate "mobile" fails on base d097f180 too.

## Record-gaps for the T4 queue (degrade sites — honest, not fabricated)
- ⚠️ wizardNews entries carry NO npc/faction id, only headline prose (WizardNewsPanel
  documents this) — so a campaign-lens item's SUBJECT can't link deeper than the
  settlement. Phase 3 headlines degrade to the affected-settlement link; deterministic
  subject-id wiring is T4.
- heraldFeed provenance is inferred from applyMode/status/covert flags — a record with
  no explicit provenance defaults to canon (silent). Fine per degrade-honestly.

## Standing hazards touched
- Closure: RealmInspector is LAZY; static children ride its chunk at zero first-paint.
  NEVER add a `lazy()` inside RealmInspector/HeraldBody (mints an eager preload-manifest
  entry). The 6 existing lazy panels kept their split (net-zero).
- domain vs display split: heraldRouting = domain (pure, import-free); heraldFeed =
  display (components/map, imports WorldPulseData). Do NOT import components into domain.
