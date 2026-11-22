# SettlementForge — Dossier Redesign (3-Band Brief): Implementation Handoff

STATUS: DRAFT — authored 2026-07-11 by the session architect from the approved-in-spirit
prototype `Dossier Redesign.dc.html` in '/Users/cstokes/Desktop/Settlement Forge template
review/'. The landing-page handoff in the same folder is the style precedent. OWNER
SIGN-OFF REQUIRED before implementation: this restructures the dossier's information
architecture, not just its paint. Execute as part of the Reunification wave's dossier
work — it *organizes* the tab transplants the feature-parity ledger already schedules
(Substrate / Magic / War & Faith / EngineSections / Relationships-tab registration),
rather than competing with them.

Audience: an Opus implementer in `settlement-engine/` (Vite + React + Zustand, tokens
from `src/design/tokens.js`). Visual reference: the prototype (do NOT port its runtime;
its Briarhollow copy is demo fixture, not product copy — the real dossier renders live
data through these structures).

---

## 1. Objective

Restructure the settlement dossier (`OutputContainer.jsx` and its header/tab machinery)
into **three bands before content**, per the prototype's caption law:

> identity (owned once, one lifecycle primary) · one nav axis · the brief.
> Movement first, provenance marked, absence as invitation, nothing under 11px.

The dossier's job changes from "container of tabs" to "the two-minute brief with depth
one axis away." Every claim the brief makes must be derived from live settlement data —
no new prose invented at the component layer.

## 2. The three bands

### Band 1 — Identity header, owned ONCE
- Eyebrow (11px caps, gold-700): terrain · biome · distinguishing landmark, from the
  settlement's existing config/trade fields.
- `h1` (Crimson, 44px desktop clamp): settlement name. The page's only h1.
- One-line state summary (17px serif): **ruler · prosperity band · headline tension** —
  ruler from powerStructure, band from the existing band vocabulary with its status
  tint, tension = the top-ranked hook/stressor one-liner in italic. All three from
  existing read-models; if no tension exists, the clause is omitted (never filler).
- Badges: StateBadge (draft/canon + event count suffix), StateBadge (narrated/raw from
  the narrative-layer state), Badge gold `Population N`.
- **ONE action cluster** (right-aligned):
  - ONE primary CTA derived from the lifecycle stage — never a button cluster:
    - draft → `Save Draft` (hint: "Drafts vanish. Saved towns join your Library.")
    - canon → `Send it to the Realm` (hint: "Place this canon town so the region
      advances around it.") — premium affordance: for non-premium the SAME slot renders
      the upgrade framing via the existing pricing-moment pattern; never a dead button.
    - in-realm → `Open the Realm` (hint: "This town lives in the Realm. Advance time
      from there.")
    - anon → the save slot carries the existing sign-in-to-save framing.
  - Secondary: `Export Dossier` (existing export flow; tier rules unchanged).
  - The ONE violet affordance: `✦ Narrate` (existing Button variant="ai" + credit title).
    Violet appears nowhere else in the header.
  - Overflow ⋯ menu: Reforge Draft / Share to Gallery / Reset to Draft / Delete
    settlement (danger-colored, confirm flow unchanged). Every item routes to the
    existing store action; anything unavailable in the current stage is omitted from
    the menu, not disabled-dead.
  - 11px hint line under the cluster, from the CTA map above.
- **Lifecycle spine**: Draft → Saved → Canon → In the Realm → Shared; gold dots for
  reached stages, ink label for current, muted for future; derived from save state,
  canon status, campaign membership, and gallery-share state. Read-only visualization —
  not clickable in v1.

### Band 2 — ONE nav axis
Single tab strip, 4 tabs: **Summary** (default) · **Systems · N** · **World** · **Notes**.
- Summary = Band 3 below.
- Systems = the existing deep tabs (economy, factions, military, magic, substrate,
  war & faith, relationships, versions…) nested as a secondary rail INSIDE the Systems
  tab; `N` = count of populated system sections for THIS settlement. The tab registry
  keeps stable ids so deep links and tests keep working; the Relationships registration
  fix (parity ledger #19) lands with this.
- World = neighbors, region/realm context, chronicle excerpts (the existing world-facing
  sections, relocated, unchanged logic).
- Notes = DM notes (existing notes surface).
- Active tab: gold inset underline per the prototype; counts in muted chrome. No second
  nav axis anywhere (the current header's scattered mode toggles move into the tabs or
  the overflow menu).

### Band 3 — Summary: the two-minute brief
Order is binding — **movement first**:
1. **"SINCE YOU LAST ADVANCED" why-trace panel** (gold-tint 0.07 card): renders ONLY
   when the settlement has advanced ticks since last view (else nothing — never an
   empty shell). Meta line: mono `why-trace · <season>, yr <N> · <k> ticks`. Rows =
   band deltas from the existing trace/receipts vocabulary: 13px/800 axis name +
   trend icon + FROM chip (neutral parchment) → TO chip (status tint) + italic serif
   reason from the cause chain (the legibility law: every change carries its cause).
   Footer link: `Open the Substrate — sixteen causal variables` → the Substrate system
   tab. Cap at 5 rows, most-severe first; overflow line "and N quieter shifts" links to
   the chronicle.
2. Two-column grid `repeat(auto-fit, minmax(360px, 1fr))`:
   - LEFT — `THE TOWN IN FOUR SENTENCES` (11px caps gold-700): the existing summary
     prose (18px serif, 1.65) + the top tension line in italic as its own paragraph.
     Below it, the **honest-gap card** (`NOT PROVIDED HERE`, status-warning tint):
     derived from the services/institutions absence model — name the absent service
     (e.g. Remove Curse when no temple/clergy), one factual sentence on why + where the
     nearest provider is (from neighbor data when available), then up to three Socratic
     prompt lines in italic, closing with the 11px line "The constraint generates the
     question; the question generates the session." Renders only when a genuine gap
     exists; never fabricates one.
   - RIGHT — `TONIGHT AT THE TABLE`: up to four provenance-marked cards
     (surface-card-alt, radius 6): **NPC** (success-green label) · **Hook** (warning-
     amber) · **Twist** (violet label ONLY when its text came from the narrative layer,
     with the ✦ `narrated` mono tag; otherwise a neutral label with `derived · history`)
     · **Red flag** (danger). Each card: 11px caps kind label + right-aligned mono
     provenance tag `derived · <system>` from the trace receipt that produced it +
     15px serif body. Cards come from the existing hooks/NPC/fragility read-models,
     ranked; absent kinds are omitted (3 cards is fine, 0 collapses the column).

## 3. Global constraints (binding — inherited from the landing handoff)
1. Tokens only (`tokens.js` semantic tokens); no `swatch[…]`, nothing under 11px.
2. Violet = AI provenance only (Narrate button + narrated tags). One gold primary in
   Band 1; status tints keep their existing semantics; chips always carry text labels.
3. Verbs: Forge / Reforge / Save Draft / Canonize / Apply Event / Narrate / Export
   Dossier. Never "Generate".
4. Type: Crimson Text for name + all narrative prose (italic = tension/narrated voice);
   Nunito 700–900 caps for chrome; JetBrains Mono for provenance/why-trace meta.
5. No emoji; Lucide icons only.
6. Every control works; nothing renders disabled-dead; decorative elements are spans.
7. Provenance tags are honest: `derived · <system>` must name the actual producing
   system from the trace, `narrated` only for narrative-layer output. Never decorative.
8. A11y: single h1; tab strip keyboard-navigable per existing pattern; the overflow
   menu focus-traps and closes on outside click/Escape; AA contrast on all tints.
9. Premium law unchanged: tier never touches generation; gating is presentational and
   write-action-level, reusing existing gates (canManageCampaigns, canUseCustomContent,
   canExport, pricing moments). Free/anon NEVER see live faith surfaces (the FaithSection
   constitutional seam is untouched by this redesign).

## 4. Repo realities / mapping notes
- The current dossier is `OutputContainer.jsx` + its tab components; Band 2's Systems
  nesting is a registry restructure, not a rewrite of tab contents.
- The why-trace panel should be built on the transplanted WhatChangedPanel machinery
  (feature-parity ledger row; currently unmounted in ours) rather than a new model —
  one movement vocabulary everywhere.
- StateBadge/Badge/Button primitives exist; verify StateBadge has `narrated`/`raw`
  kinds — if not, extend the primitive (do not fork it locally).
- Copy: all new strings into the copy registry under `dossier.*`; the Socratic
  honest-gap prompts are TEMPLATES with slots, not literals per service.
- Performance: the dossier is not first-paint, but keep Band 3 eager and Systems tab
  content lazy (current pattern); no new libraries.

## 5. QA / acceptance checklist
- [ ] Exactly one h1; one primary button visible in Band 1 for every stage × tier combo.
- [ ] Stage matrix: draft/canon/realm × anon/free/premium/lapsed renders the correct
      primary + hint, no dead controls (test-pinned).
- [ ] Why-trace panel absent for never-advanced settlements; present with correct rows
      after an advance (fixture-pinned); every row's reason string traces to a receipt.
- [ ] Violet audit: grep the dossier surface — violet only on Narrate + narrated tags.
- [ ] Provenance audit: every `derived · X` tag matches the producing system.
- [ ] Honest-gap card only when the absence model has a real gap.
- [ ] Tab deep links + existing tab tests updated, Relationships tab reachable.
- [ ] No font below 11px; AA spot-checks on warning/danger tints.
- [ ] Golden corpus byte-identical (display-only change); first-paint budget unchanged.

## 6. What NOT to do
- No new colors/gradients; no second violet; no carousel/animation libraries.
- Do not move logic out of read-models into components; the brief renders derivations.
- Do not gate harder than today (no new walls) or looser (no new leaks) — tier behavior
  is byte-identical to current except where a dead control becomes a working one.
- Do not port the prototype's demo copy (Briarhollow, Maera, the bell) anywhere.
