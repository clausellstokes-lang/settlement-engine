# THE REALM INSPECTOR — CANONICAL TAB ARCHITECTURE (owner-ratified 2026-07-22)

STATUS: design ratified ("I like all of it"), planning — build sequences AFTER the
`claude/inspector-address-web` resolver folds. Working name **Wizard News / The Herald** (OPEN —
owner deciding; manager recommends The Herald: "wizard" is overloaded 3 ways in this codebase —
spellcaster, GenerateWizard, creator).

Binds THE NEWS ADDRESS LAW, THE LEGIBILITY LAW (regular-human glance test), FINITE-SEMANTICS
(every slot + the routing table are typed vocabularies from producers, never freeform), and the
discourse kernel (the sentence templates ARE the grammar the kernel fills deterministically —
byte-verbatim realizations, not composed prose). Supersedes the 11-tab inspector.

## THE FRAME: IT IS A NEWSPAPER

- **The headline** = the glance. Complete, truthful, "just enough" for a snap DM opinion.
- **The article** = the click-through: the recorded cause DAG — the CHAIN (A then B then C) or the
  CO-CURRENT reasons (X, Y and Z together), whichever the record holds. NEVER invented; the article
  IS the engine's own memory (the recorded-causal-depth work is its source). Free, deterministic, true.
- **The paper** = 7 news tabs (below). **The desk** = the tools, kept OUT of the paper.
- Inverted-pyramid law: a DM forms a take from the headline alone and defends a table ruling from
  the article alone. A headline that needs its article is a bad headline; an article that can't
  justify its headline means the event isn't recording enough.

## THE 7 SECTIONS

| Tab | Kind | Substrate | Reports |
|-----|------|-----------|---------|
| **Dashboard** | front page + digest | aggregate of all below | the realm's state at a glance; prose "session-prep" mode (absorbs the old Letter) |
| **War** | past-report | pulse events routed `war` | battles, sieges, declarations, occupation, NPC capture (absorbs War & Resolve) |
| **Faith** | past-report | pulse events routed `faith` | religion spread, rising powers, pantheon-rank changes (absorbs Pantheon) |
| **Trade** | past-report | pulse events routed `trade` | trade dynamics + inter-settlement relationship changes NOT war (absorbs Treaties) |
| **Events** | past-report | pulse events routed `events` | stressors unrelated to the above + traditions (the catch-all) |
| **Divination** | **forecast** | the pressure/emergence model ("emerging" stressors, rising-pressure signals) | rising pressures at macro level — NOT past events; things BUILDING |
| **Adjudication** | **decisions desk** | proposals/pending + resolved log (manual + autoresolve) | manual decisions via advance-time + autoresolve results; can DEMAND action |

## THE SHARED HEADLINE GRAMMAR

`[SUBJECT-ADDRESS] [ACTION] [OBJECT] · [AFFECTED] — [REASON] [·PROVENANCE]`
- **SUBJECT-ADDRESS** — `Settlement › Power › Faction › NPC`, each an EntityLink resolved by ID
  (never name-matched — the faction-key defect class). Subjectless events take a system/region root.
- **ACTION / OBJECT** — typed verb + complement, frozen vocab per event kind, kernel-realized.
- **AFFECTED** — the settlement(s) touched, by name + link, always explicit.
- **REASON** — the recorded cause (link to prior event or typed cause). Absent if unrecorded — never faked.
- **PROVENANCE chip** (shown ONLY when non-canonical): `amendable` (a prediction — the default in
  Divination) · `covert` (DM-only) · `decreed` (DM-authored). `canon`/`derived` are the silent default.
- **Two forms**: full/standalone inline, or nested under a group header that hoists the shared upper
  levels (presence over repetition).

## THE ROUTING TABLE (the load-bearing artifact — build it first, walker-enforced)

Every event kind → EXACTLY ONE section. **Total** (every candidateType/impactKind/stressor
type/proposal kind classified — no orphan, walker-enforced both ways) · **single-home** (no dupes) ·
**routed by what the event IS, not what caused it** (a trade-caused siege is War; the trade cause
shows in the *article*). `Events` is the explicit catch-all. A typed `SECTION_OF(kind)` map, single
source, source-scanned so no surface re-derives. Examples: siege/deployment/blockade/occupation/
capture → War; conversion/seat-change/pantheon-rank → Faith; trade-route/dependency/embargo/
non-war relationship → Trade; tradition/misc-stressor → Events; emerging-pressure → Divination;
proposal/resolution → Adjudication.

## PER-SECTION

### DASHBOARD — the front page
Purpose: the realm's state at a glance + what needs a decision. Glance verdict:
`The realm [is at peace | simmers | is strained | is at open war].` Aggregates; each stat is a
DRILL-IN seed (click → focus/filter into a section). **Prose mode** = the old Letter's session-prep
digest (`[N] things of note since [date]; [M] of moment`), in the house voice. Front-page banner =
"needs attention": the K most-severe live items cross-realm, severity-first (NOT alphabetical here).

### WAR — battles and their making
Siege: `[Attacker Power] besieges [Settlement] — [N weeks], [momentum-band].`
Declaration: `[Power] declares war on [Power] — [casus, linked].`
Occupation: `[Power] occupies [Settlement] — [since date].`
Capture: `[Faction] takes [NPC] captive at [Settlement] — [circumstance].`
Standing: `[Power] vs [Power] — [W]–[L] of [UNIT — OPEN CONTENT DECISION].`

### FAITH — the spread and the ranking
`[Deity] rises across [region] — [N] settlements turning.`
`[Deity] — [tier] now, [N] seats ([W] won, [L] lost).`
`[Faith] takes the seat at [Settlement] — [from whom].`

### TRADE — dynamics and non-war relations
`[Settlement] and [Settlement] — [relationship] now ([from]→[to]) — [driver].`
`[Power] embargoes [Settlement]'s [good] — [effect-band].`
`[route] opens/closes between [A] and [B] — [consequence].`

### EVENTS — stressors and traditions (the catch-all)
`[Settlement] — [stressor label] [lifecycle-verb] — [origin].`
`[Settlement] keeps [tradition] — [what it marks].`

### DIVINATION — the forecast (present-progressive, always amendable)
Different grammar (future/building, not past) and different source (pressure model, not the event
log). Every entry carries the `amendable` chip so a forecast is never read as a fact.
`Pressure toward [outcome] builds in [region] — [drivers], [N ticks to reckoning]. (amendable)`
`[Settlement] nears [threshold] — [what tips it].`

### ADJUDICATION — the decisions desk (actionable)
Two states, styled apart from reportage. Pending (demands you):
`[Settlement] › [Power] — [decision] awaits you — [stakes]. [Approve | Decline | Amend]`
Resolved (the log): `[decision] resolved [by you | by autoresolve] — [outcome].`
Home of "needs attention" as a to-do, not just a chip.

## THE SORT LAW
Within every section: **alphabetical by associated settlement** = the grouping (predictable, focus-
friendly), **severity then recency WITHIN** each settlement, and an **urgent pin** (+ the Dashboard
banner) floats the true crisis above the alphabet so a fall isn't buried under "Aberdeen."

## THE DESK (tools — OUT of the 7 news tabs)
- **Stage the Road** (compose a journey) and the **Timelapse scrubber** → a small tools strip,
  separate from the paper (they generate/scrub; they are not news).
- **Chronicle / history** → NOT a tab: a **time-filter lens** on every section (this advance /
  whole campaign) — history is a lens, not a door.

## SEARCH / FILTER / FOCUS (from the scaling design, wf_e940f170)
- ONE persistent strip in the shell chrome (survives tab switches): search + focus chip +
  needs-attention one-tap toggle + Filters(N) + context strip. Rides the lazy inspector chunk (the
  ~132-byte first-paint margin untouched).
- **Focus mode = the local edition.** Built on the EXISTING `selectedSettlementId` store field
  (mapSlice) — click a settlement on the map (or the strip) and the WHOLE paper scopes to it. No new
  state; generalizes the 4 ad-hoc honorings. Hard-filter WITHIN each tab, every tab still visible
  with a focused count badge (empty reads "nothing at [name]") — the local edition's table of contents.
- **Facets are the typed slots** — settlement, section/action-kind, power/faction, severity,
  recency, needs-attention — bound to producers, never freeform.
- Search = structured over entity/settlement names via the resolver + typed facets, never blind prose grep.

## BUILD SEQUENCING + DEPENDENCIES
1. `claude/inspector-address-web` (in flight) lands the realm-wide resolver — the address + the
   per-item settlement/faction/power key the routing + facets + focus need. THIS FIRST.
2. The ROUTING TABLE (`SECTION_OF`) + its totality walker — the new load-bearing artifact.
3. The 7-section shell (consolidate the old tabs; move the desk out; Chronicle→lens).
4. The filter/focus strip on `selectedSettlementId`; alphabetical-by-settlement + urgent sort.
5. Divination (forecast substrate + amendable grammar) and Adjudication (pending/resolved states).
All display-layer, golden-neutral, lazy-chunk (closure Δ≤0), FINITE-SEMANTICS, canonical helpers only.

## OPEN OWNER ITEMS
- **The name** — Wizard News vs The Herald (or other). Manager rec: The Herald.
- **War standing "what counts"** — the W–L unit (raids? sieges? trade contests?) — a CONTENT decision.
