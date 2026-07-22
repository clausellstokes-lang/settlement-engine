# Compendium Completion Plan

> **Progress** (append after every wave — this blockquote alone must reconstruct program state)
> - Continuation branch `claude/compendium-completion-2` off composite-r4 `95f57988` (A+B folded). Baseline closure now 1,039,961.
> - Wave C2 (shipped, `def9fe8c`) — Magic Level + Magic Legality ladders (getMagicLevel + magicProfile bands); the drifted config Magic whisper corrected (Mundane/Common/High -> None/Low/Medium/High). Gate green; closure Δ0.
> - Wave C1 (shipped, `52a4d8c1`) — the deity FOUR AXES (from DEITY_AXIS_EFFECTS, no roster) lead the arcane tab + Pantheon Rank ladder (seats, PANTHEON_TUNING-bound). +compendiumFaith pin; totality pin gains the arcane tab. Gate green; closure Δ0.
> - Wave A (shipped, `e13a7ef8`) — the owner's four Economy examples as W6 ladders: Priority Bands, Chain Status, Coherence Check (renamed from "Viability Score"), Exports & Imports enriched. Gate green (60 focused + 282 copy/lint + build/verify:dist). Closure 1,039,961 (+5, shared-chunk rebalance, under hard cap — flagged for owner reclaim).
> - Wave B (shipped, `140f56cd`) — the 15 empty Stress rows now render viabilityNote + crisisHook (was a bare EMPTY_VALUE dash); +1 pin (compendiumStressRows). No CD change. Gate green (21 focused, eslint/tsc 0).
> - Plan opened + committed (`ea4b126f`) 2026-07-22 from the completeness audit (63 critic-reconciled gaps; 5 analysts + critic). Branch `claude/compendium-completion` off composite-r4 `d93f8699`. Audit ran against the OLDER tip `53d72f57`, so several gaps are already closed by the operations-legibility fold — see "Already closed".
> - REMAINING (for the successor / next session): Waves C (faith/magic/deity-axes) · D (cultures/terrain/dead-anchors) · E (presets) · F (monster-threat vocabulary lie, producer-bound + T4) · G (MED power/economy/arcane ladders) · H (LOW searchIndex drift + walker). See wave specs below; each is spec'd with truthSources.

## Sources
- The completeness audit: `/private/tmp/.../tasks/w4twahdqu.output` (63 gaps: census + 3 truth lenses + critic; per-agent JSON in the workflow journal). Every gap carries entry / missing vocabulary / truthSource file:line / proposal / severity. Reviewer-derived — each truthSource verified at code before authoring.

## Method
Gates (this repo): fast = `npx vitest run <files>`; quick = lint + affected tests; full = `npm run check` (validate + typecheck + typecheck:domain:strict + lint + test + build + verify:dist).
Every wave = fix -> focused tests (incl. the totality pin) -> full gate (quartered w/ isolation for the suite) -> one commit naming the wave -> plan-note commit. Push/deploy never in the loop.

The SANCTIONED fix path (from the audit notes): the **W6 ladder machinery** — add a row to `LADDER_META` in `src/domain/compendium/bandLadders.js`, with per-rung readings either (a) authored there (the `PROSPERITY_READINGS` idiom, both-directions coverage-pinned) or (b) read from a glossary `*_DEFS` category (`src/domain/display/glossary.js`), then `npm run gen:compendium-data` bakes it into `CD.bandLadders`. The tab component renders `laddersFor(tab)`; the totality pin `tests/ui/compendiumBandLadders.test.jsx` reds until every canonical rung has a reading and renders. For a NEW tab id, extend the pin's `TAB_COMPONENT` map and make that tab render `laddersFor`. HONESTY GATE: never invent a fact; lift readings from code comments/enums; where the engine emits a vocabulary the app never shows, say so.

## Owner constraints / fences (do not violate)
- Parallel-lane fences (do NOT edit): walk-completions surfaces, admin/gallery-detail, pricing files, the DOSSIER `PowerTab.jsx` + Wave-2 display files (monsterThreat, safetySeverity, defenseDisplay, laneClassifier, dramaticIronyBrief), `src/domain/townMap/arch/`, migrations. Compendium-side additions (bandLadders / gen script / CatalogTabs / RegistryHubs / glossary) are IN scope.
- Deities: NO roster, NO premade names (owner deity doctrine). Author the AXES + pantheon-rise mechanics + custom-authorship-as-the-way only.
- The Monster Threat vocabulary fix must bind to the PRODUCER emission (resolveConfig canonical enum) and stay true AFTER the queued T4 deriveSystemState fixes.
- Closure Δ0 vs 1,039,956 (compendium rides lazy chunks; ladders are pure CD data). No em-dash / no exclamation in authored copy. Regen sanctioned. python -> ensure_ascii=False.

## Already closed by the operations-legibility fold (verify, then strike from the audit)
- Living-World causal 16-variable list (now `causal.variableEntries`, all 16 rendered with labels+descriptions).
- Living-World system one-liners (each system now carries `blurb`, rendered).
- Pressures per-kind reading (now `pressures.entries` with descriptions, rendered).
- Deity ROSTER gaps + roster tag-legend — MOOT (roster deleted).
- Calamity dormant-flag defect (calamity flag corrected to disastersEnabled).
- VERIFIED at code (2026-07-22): RegistryHubs renders `variableEntries` + `.blurb` + `pressures.entries` (all three closures confirmed). Dead anchors id="power"/id="terrain"/id="cultures" confirmed ABSENT (Waves D/G still open).

## Waves (severity-first; each an independent commit)

### Wave 0 — Enforcement readiness
The W6 totality pin already exists and auto-covers every LADDER_META ladder. Wave 0 work: extend the pin's `TAB_COMPONENT` as new tabs gain ladders; add coverage pins for new non-ladder vocabularies (stress-row completeness, monster-threat producer parity, searchIndex drift walker). Land each guard WITH its fix wave.

### Wave A — Economy HIGH (owner's four examples) (risk: low)
Gaps: Priority Bands ladder (5 sliders, 5-95, cuts 15/35/65/85, magic remap); Chain Status ladder (panel display set primary + canonical 7-status receipt + honesty line that captured/collapsing are not yet emitted); Viability verdict (RENAME "Viability Score" -> coherence verdict: COHERENT/MARGINAL COHERENCE/NOT COHERENT + 4 severity rungs); Exports & Imports dependency bands (vulnerable/critical + route capacity order + entrepot); Food Security ladder (6 rungs). Owner call parked: is "Viability Score" golden-observed beyond the compendium? (SEO meta CompendiumPanel says "viability scoring".)
Exit: four economy ladders render + read; the four thin prose Cards replaced/augmented; totality pin green.

### Wave B — Stress (risk: low)
Gaps: the 15 empty stress rows (render viabilityNote + crisisHook — authoring-free); Stressor Severity + Relief Magnitude dial ladders (ZERO-authoring: glossary severity/magnitude DEFS already exist, just add two LADDER_META rows tab:'stress').
Exit: no stress row shows EMPTY_VALUE; severity + magnitude ladders render.

### Wave C — Faith / Magic / Deity axes HIGH (risk: med)
Gaps: Deity AXES section (from DEITY_AXIS_EFFECTS single source — alignment/law/rank/temperament couplings, lead the tab); Pantheon Rank ladder (cult->minor->major, seats, PANTHEON_TUNING); Magic Level + Magic Legality ladders (getMagicLevel + magicProfile band exports) + correct the drifted magicLevel whisper; Devotion + Faith Legitimacy ladders (lift faithPanelModel bands to domain first).

### Wave D — World inputs HIGH (dead anchors) (risk: med)
Gaps: Cultures section id="cultures" (12-value enum, arcane tab); Terrain section id="terrain" (7-value, tiers tab); repoint dead anchors (verb->living-world, id="power"); the whisper deep-links currently land nowhere.

### Wave E — Presets HIGH (risk: med)
Gap: the 4 "quiet" presets are indistinguishable ("lights no endgame systems"). Extend the gen-script presets projection with per-preset one-liner + distinguishing axes (intensity/autonomy/toggles from SIMULATION_RULE_PRESETS); render per preset row.

### Wave F — Vocabulary lies (risk: med; producer-bound)
Gap: Monster Threat — replace fabricated Safe/Frontier/Dangerous/Plagued with real 3 arms heartland/frontier/plagued (display Safe Heartland/Active Frontier/Embattled Region), producer-bound to resolveConfig; re-word archetype cond strings; searchIndex threat entries. Stays true after T4.

### Wave G — MED power/economy/arcane ladders (risk: low-med)
Legitimacy ladder, governance-stability vocabulary, faction-archetypes (13), power-structure concept, archetype cond re-word, corruption machinery, safety ladder, defense readiness, magic-as-buffer substitution, prosperity food-cap clause, calamity scale/kFactor plain-English, map-lens one-liners + Illustrated 6th, district wealth/safety/category, institutions selection vocabulary, operations klass/scope legend, settlement lifecycle phases. (Several coordinate with the folded power-strata #29 — verify current state.)

### Wave H — LOW (risk: low)
searchIndex drift (affluent phantom, stale tier pops, derive from CD, all-15 stress entries, ladder search entries) + walker; power-tab intro formula; NPC growth goal vocabulary; resources & goods pointer; the two dead-link LOW anchors.

## Sequencing rationale
Owner's explicit examples first (Wave A). Zero-authoring + authoring-free wins next (Wave B). Then the doctrine-mandated faith/magic (C) and the broken-lifeline world inputs (D). Presets (E) and the producer-bound vocabulary lie (F) need care. MED/LOW ladders (G/H) last. Data (bandLadders/glossary) before consumers (CatalogTabs render); the searchIndex drift walker (prevention) last so it does not enshrine current drift.

## Deferred / owner-decision queue
- Viability rename: correct BOTH the compendium card AND the SEO meta ("viability scoring") together; check for pinned display tests first.
- BandPill orphan (critic finding): display-label vocabulary (Contested/Stretched/...) is dark (zero importers). Do NOT author "shown as X" aliases while the path has no UI consumer. Own-lane decision, not a compendium edit.
- Whether the deity roster stays rendered at all is moot (already deleted).

## Judgment calls (vetoable)
> Wave A (delegated 2026-07-22; each vetoable; all favor honest, enumerated vocabulary):
> - Renamed "Viability Score" -> "Coherence Check" across the compendium (card, search term, SEO meta, long-tail route). Veto reverts those strings. No test pinned the old name; the dossier already renders COHERENT/NOT COHERENT.
> - Accepted closure +5 (1,039,961) as a shared-chunk rebalance (a length-neutral SEO edit did not move it), under the 1,040,000 hard cap. Veto requires a Δ<=0 reclaim (module-split idiom) before Wave A folds.
> - Chain Status ladder renders the DISPLAY set (what the DM sees), with captured/collapsing named in the blurb as defined-but-not-yet-emitted (critic's merged guidance; honesty gate).

## Ledger (deferrals — documented, not bugs to re-find)
- Food Security ladder (economy, 6 rungs from foodGenerator.js:223-243) — deferred from Wave A to Wave G to keep Wave A on the owner's four named examples. Not a bug; the dossier StatusTag shows it, the compendium does not yet.
- Stressor Severity + Relief Magnitude dial ladders (glossary severity/magnitude DEFS already exist) — deferred to Wave G: routing them into CD requires first removing the em-dashes in SEVERITY_DEFS/MAGNITUDE_DEFS (glossary.js:89-100), else the generated file's voice em-dash count grows past its baseline of 2. A voice-fix + LADDER_META rows; documented, not dropped.
- The searchIndex "subsistence to affluent" phantom rung + stale tier populations (LOW, Wave H) — left in place this wave to keep Wave A's searchIndex change scoped to the Viability rename; the phantom is a known LOW gap, not undiscovered.
- Renamed long-tail route /compendium/econ-viability-score -> econ-coherence-check: the old URL now 404s. Acceptable consequence of an honest concept rename; noted for SEO awareness.
