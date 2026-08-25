---
name: realm-inspector-news-architecture
description: Owner-ratified 2026-07-22 — the Realm Inspector becomes a 7-section NEWSPAPER (Wizard News/The Herald); full spec in docs/REALM_INSPECTOR_TAB_ARCHITECTURE.md
metadata: 
  node_type: memory
  type: project
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T16:43:03.895Z
---

# THE REALM INSPECTOR = A NEWSPAPER (owner-ratified 2026-07-22, planning)

Canonical spec: **docs/REALM_INSPECTOR_TAB_ARCHITECTURE.md**. The 11-tab inspector collapses to
**7 news SECTIONS by subject** (not mechanism): Dashboard (front page + prose digest = old Letter),
War, Faith, Trade, Events (catch-all: misc stressors + traditions), Divination (FORECAST — rising
pressures, future/amendable, different substrate = the pressure model not the event log),
Adjudication (the DECISIONS desk — pending + resolved manual/autoresolve, actionable).

**The frame:** each entry is a HEADLINE (glance, "just enough", inverted pyramid); click = the
ARTICLE = the recorded cause DAG (chains + co-current reasons), NEVER invented — the article is the
engine's own memory. The tools (Stage the Road, Timelapse) leave the paper for a "desk" strip;
Chronicle/history becomes a TIME-FILTER LENS on every section, not a tab.

**Load-bearing new artifact:** the ROUTING TABLE `SECTION_OF(eventKind)` — total, typed, single-home,
walker-enforced, **routed by what the event IS not what caused it** (a trade-caused siege = War; the
cause shows in the article). Events = explicit catch-all.

**Sort law:** alphabetical-by-settlement grouping, severity/recency WITHIN, urgent-pin + Dashboard
banner float the crisis above the alphabet.

**Focus = the local edition:** built on the EXISTING selectedSettlementId store field (mapSlice) —
click a settlement, whole paper scopes to it; hard-filter within, tabs stay visible with count badges.

**Build sequencing:** AFTER [[news-address-law]]'s resolver (claude/inspector-address-web) folds —
it provides the per-item settlement/faction/power key routing+facets+focus need. Then the routing
walker, the 7-section shell, the filter strip. Display-only, golden-neutral, lazy, FINITE-SEMANTICS.

**OPEN owner items:** the NAME (Wizard News vs The Herald — mgr rec Herald; "wizard" overloaded 3
ways incl. GenerateWizard); the War-standing "what counts" W-L unit (content decision). Relates to
[[legibility-law]], [[finite-semantics-law]], [[deity-doctrine-no-premade-pool]] (Faith section).
