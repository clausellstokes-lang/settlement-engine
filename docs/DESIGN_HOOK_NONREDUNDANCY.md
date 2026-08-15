# DESIGN — HOOK NON-REDUNDANCY (the snapshot's one-story-once law)

## Fable 5 architecture, 2026-08-02, under full owner delegation. Owner order
## (verbatim intent): in dossiers, randomly generated or advanced, limit repeated
## hooks even amongst different or the same actors — non-redundant per snapshot,
## retaining only the most dramatic and interesting; alternative-plausible-hook
## or removal both acceptable; "coherency and cohesion have to be maintained at
## all cost"; hooks include RELATIONSHIPS and plot hooks of many kinds, grouped
## where convenient. IMPLEMENTATION IS ASSIGNED TO THE EXTERNAL IMPLEMENTER
## (Sol). The war volume's §10 implementer protocol
## (DESIGN_WAR_RULINGS_ARCHITECTURE.md §10) binds here verbatim. This document
## is self-contained: an implementer with zero session context can build every
## wave. Where this document and the tree disagree, live code outranks the
## census — STOP and report.

---

## §0 THE THESIS

The estate already measured this defect and half-cured it. hookVariety.js's own
header records the baseline: **8.19% corpus repeat rate, 35% in the worst
settlement** — several NPCs drawing from the same ~11-string authored pool
collide, and the DM reads the same "secret" twice. Wave E batch E2 built the
draw registry (within-source variety at generation); the aggregator added
exact-text + echo-prefix-family dedup (cross-source, display-side). What
remains — and what the owner now orders — is the THEMATIC layer: two
*different* authored strings telling the *same beat* ("a hidden debt", worn by
two different actors) survive every existing layer, and nothing ranks a
snapshot's hooks by dramatic interest to retain the best telling. The cure is
three waves: a closed THEME vocabulary over the authored pools (HK-1), a
projection-side non-redundancy + ranked-retention layer at the one aggregator
(HK-2), and theme-aware draws at generation so the source itself repeats less
(HK-3). Coherency is bought structurally: the machine only ever DROPS from a
projection or REDRAWS from the same authored pool — it never rewrites prose,
never invents, never judges free prose, and never touches a DM's edit.

## §1 THE LAWS THAT BIND EVERY WAVE

1a Constitutional (inherited verbatim from DESIGN_WAR_RULINGS_ARCHITECTURE.md
§1a): same-seed byte identity — THE PROMISE; seeded purity (every roll through
rngContext, no ambient Math.random); monotone ratchets (new logic = lazy leaf);
finite semantics (closed vocabularies; the AI is a bucketing clerk, never a
writer); receipts/legibility where surfaces speak; premium isolation on covert
context.

1b Program laws (violations are design defects):

- **HK-LAW-1 — DROP OR REDRAW, NEVER REWRITE.** The machinery may (a) omit a
  hook from a PROJECTION, or (b) at generation time select a DIFFERENT template
  from the SAME authored pool the naive draw would have used. It may never
  synthesize, merge, truncate, or paraphrase hook prose. Plausibility is
  inherited from the pool's own context-scoping — a redraw is safe by
  construction; a rewrite is not.
- **HK-LAW-2 — THE DM'S PEN IS SACRED (spine requirement 14's spirit).** A hook
  whose prose carries a user edit (userEdits.js kinds 'hook'/'plotHook',
  userEdits.js:309-310,363-364) is NEVER dropped, deduped, or displaced by this
  program — it always survives retention, and it participates in theme-dedup
  only as a BLOCKER (its theme counts as taken, evicting machine hooks, never
  the reverse).
- **HK-LAW-3 — FREE PROSE IS NEVER THEME-JUDGED.** Only AUTHORED templates
  carry theme tags (HK-1's totality is over the authored pools). Hooks whose
  prose is not template-derived — user edits, AI-bucketed custom content,
  legacy free strings — classify `untyped`: exact-text dedup still applies;
  theme-dedup and interest-pruning NEVER touch them. Machine taste is not
  authorized over human prose.
- **HK-LAW-4 — STORY-IN-MOTION IS PROTECTED.** A hook anchoring a live
  escalation clock (deriveEscalationClocks, hookEscalation.js) is retained
  regardless of theme collision — dropping it orphans a multi-stage trajectory
  mid-story. Within a theme, a clock-anchored hook outranks any unanchored one
  at equal interest.
- **HK-LAW-5 — PROJECTION-SIDE DROPS ONLY (HK-2).** The non-redundancy layer is
  a PURE PROJECTION: persisted state (npc.plotHooks etc.) is never mutated,
  so regen/undo/import/serialize are unaffected by construction, and the same
  cure covers generated AND advanced snapshots uniformly (the projection reads
  whatever state the advance produced).
- **HK-LAW-6 — THE ROLL BUDGET IS INVARIANT (HK-3).** drawUnique spends exactly
  ONE roll today (hookVariety.js:42-55, documented contract); the theme-aware
  filter changes the CANDIDATE SET, never the roll count — the surrounding RNG
  stream must not shift by even one draw beyond the selected element itself.
- **HK-LAW-7 — DETERMINISTIC TASTE.** "Most dramatic and interesting" is a
  typed, tunable, deterministic composite (§4 INTEREST) with a codepoint
  tie-break — same seed, same survivors, forever. No model, no heuristic
  text-scoring, no length preference.
- **HK-LAW-8 — ONE HELPER, TWO COLLECTORS.** The estate has TWO hook collectors
  (display: collectPlotHooks, dossier/plotHooks.js:212; structured/escalation:
  collectAllHooks, hookEscalation.js:43 — the latter additionally walks
  defenseProfile/powerStructure/settlement.plotHooks). The retention layer is
  built ONCE as a pure shared helper and consumed by both surfaces (and by
  aiGrounding's hook context) — a second implementation is the writer/reader
  drift class (§1c below).
- **HK-LAW-9 — ALIGNMENT LINE (spine requirement 13):** declared
  alignment-EMPTY — this program is dossier projection + draw selection; it
  reads no alignment axis and moves nothing. (Recorded per the requirement:
  empty with reason, not silence.)

1c Recorded hazards that WILL bite these waves (each has bitten this estate):
writer/reader payload-spelling drift (two collectors, mixed hook shapes:
string | {hook} | {text} | {description} — pin by booting the REAL collector
against the REAL generator output, never fixtures alone); vacuous absence pins
(a no-duplicates pin on a harness whose settlement has two hooks proves
nothing — seed the WORST-settlement shape, many same-category NPCs); the
self-referential pin (the repeat-rate envelope's denominator must come from an
independent census of raw hooks, not from the deduped output); hot-file law
(new logic lands in lazy leaves; check sizeBaseline before touching any
at-ceiling file); id-less news drop N/A (no news minted here).

## §2 SUBSTRATE CENSUS (verified 2026-08-02 by the architect on
## claude/composite-r4 @ fdf43790; live code outranks this table)

| Surface | Where | State |
|---|---|---|
| Draw registry (within-source variety) | src/generators/hookVariety.js:42 `drawUnique(pool, used, keyFn)`; settlement-scoped Set; one-roll budget documented :17-22; pool-exhausted ⇒ accepted repeat :48-51 | BUILT (Wave E batch E2) |
| Registry wiring | src/generators/npcGenerator.js:16 (import), :73 + :600-613 (`usedTitles` created once per settlement; loyalty-pool draw through drawUnique) | BUILT — NPC title/loyalty pools only; other pool-draw sites VERIFY-AT-BUILD |
| Display aggregator | src/domain/dossier/plotHooks.js:212 `collectPlotHooks` — sources: npcs[].plotHooks, conflicts[].plotHooks, history.currentTensions[].plotHooks, relationships[].tension (category 'relationship', :259-274), economicViability.plotHooks, economicState.safetyProfile.plotHooks, history.historicalEvents[].plotHooks, traditions mirror; priority-sorted :329, then dedup | BUILT |
| Existing dedup (two layers) | plotHooks.js:119-133 `dedupeHooks` — exact-text (`normHookText` :91) + echo-family (`hookFamilyId` :102, ECHO_PREFIXES :81-87), first-kept on the priority-sorted list | BUILT — text-identity only; blind to thematic redundancy |
| Structured collector (the second walker) | src/domain/hookEscalation.js:43 `collectAllHooks` — additionally walks settlement.plotHooks (aggregate), defenseProfile.plotHooks, powerStructure.plotHooks; `deriveEscalationClocks` same module | BUILT — NOT deduped; wider source set than display |
| Display consumers | PlotHooksTab.jsx:23, SummaryTab.jsx:115, SessionMode.jsx:190 ("the canonical hook collector"), OutputContainer.jsx:479, pdf/lib/viewModel.js:1124 (maps categories + priority bands) | BUILT — all route through collectPlotHooks |
| DM hook edits | src/domain/userEdits.js:5 (prose edits for "NPC secrets, plot hooks"), :76 `hook` field family, :309-310 + :363-364 ('hooks'/'plotHooks' → edit kinds 'hook'/'plotHook') | BUILT — the edit lane HK-LAW-2 protects |
| AI context | src/domain/aiGrounding.js consumes hooks (grep-verified consumer) | BUILT — exact wiring VERIFY-AT-BUILD; must consume the retained projection |
| Advance path | src/domain/timeProgression.js consumes hookEscalation; whether advancement MINTS new hooks into persisted arrays (vs re-deriving) | VERIFY-AT-BUILD — if advancement mints via pool draws, HK-3's registry covers it; if it re-derives, HK-2 covers it; either way one of the two layers catches it |
| Measured baseline | hookVariety.js:5-8 — 8.19% corpus repeat rate / 35% worst settlement, pinned by distribution envelopes | The number HK-2/HK-3 must beat |

## §3 THE ARCHITECTURE (three waves, dependency order)

### HK-1 — THE THEME VOCABULARY (finite-semantics work; no behavior change)

A CLOSED theme taxonomy, authored once, assigned per authored template at the
pool definitions. Proposed starting set (owner-tunable at signing; closure is
the law, membership is not): `{ hidden_debt, forbidden_love, secret_identity,
divided_loyalty, smuggling, blackmail, rivalry, betrayal, corruption,
succession, faith_crisis, vanished_person, forbidden_knowledge, old_wound,
looming_threat, scarcity_pressure, crime_ring, outsider_suspicion, ambition,
grief }`.

- Mechanism: each authored pool row gains a `theme` tag — as a parallel
  `THEME_OF` map keyed by template string (zero change to pool shapes and to
  every existing consumer) or inline where a pool already holds objects;
  implementer's pick per pool, recorded.
- A TOTALITY WALKER asserts every authored template in the censused pools
  carries exactly one theme from the closed set (the structural-prevention
  idiom: the walker is the habitat-remover; an untagged new template reds the
  gate, so the vocabulary can never silently rot).
- Free prose (user edits, custom content) is NEVER tagged (HK-LAW-3) —
  `themeOf(text)` returns the tag for a known template, `untyped` otherwise —
  an exact-string lookup, never fuzzy matching.
- Relationships: `relationships[].tension` prose is template-derived
  (relationship tension pools); those pools are tagged like any other. Where a
  relationship tension is flag-driven/emergent free prose, it rides `untyped`
  and is retained (the owner's "grouped where convenient" — relationships group
  into the same theme space, at zero special-casing).

### HK-2 — THE RETENTION LAYER (projection-side; the visible cure)

One new pure module — `src/domain/dossier/hookRetention.js` (lazy leaf, one
export) — consumed at plotHooks.js's aggregation tail (after the existing
`dedupeHooks`, :330) and offered to hookEscalation/aiGrounding consumers per
HK-LAW-8:

`retainHooks(hooks, { themeOf, editedTextKeys, clockAnchoredKeys, scaleBand })
→ PlotHook[]`

- Layer 3 (after existing exact + family layers): THEME RETENTION — group by
  `themeOf(hook.text)`; per theme keep the top `K(scaleBand)` by INTEREST (§4):
  default K = 1 for hamlet/village bands, 2 for town and above (owner-signed
  band; a snapshot rich enough to repeat a theme twice must be a city).
  `untyped` is exempt (exact-text layer already caught true duplicates).
- Survivor precedence within a theme, in order: user-edited (HK-LAW-2, always
  retained even beyond K) → clock-anchored (HK-LAW-4) → highest INTEREST →
  codepoint tie-break on normalized text (HK-LAW-7).
- Output preserves the input's priority ordering (a projection reorder is a UI
  regression); dropped hooks simply vanish from the projection — persisted
  state untouched (HK-LAW-5).
- The PDF path (viewModel.js:1124) inherits automatically (it maps
  collectPlotHooks output); SessionMode/SummaryTab/PlotHooksTab likewise. The
  hookEscalation surface adopts the same helper for its structured list so
  clocks and dossier agree on the visible story set.

### HK-3 — THEME-AWARE DRAWS (generation-side; the source cure; disclosed shift)

`drawUnique` gains an optional second registry: `drawUnique(pool, used, keyFn,
themes?, themeOfFn?)` — candidate preference order: (1) unused family AND
unused theme, (2) unused family, (3) accepted repeat (pool exhausted) — with
the SAME single roll spent on the final filtered set (HK-LAW-6). One
settlement-scoped theme Set rides beside `usedTitles` (same creation site,
npcGenerator.js:73 idiom), shared across ALL tagged pool draws in that
settlement — this is what cures "different actors, same beat" at the source,
and it is the owner's preferred arm ("alternative but plausible hook") because
the redraw stays inside the same authored, context-scoped pool.

- SAME-SEED DISCLOSURE: HK-3 changes which template a given roll selects —
  a disclosed generation shift, owner-ordered 2026-08-02 (this document is the
  recorded ruling; the golden re-record for affected generation goldens —
  including the 525-row corpus where it pins hook text (recount 2026-08-03 —
  523 was the PRE-HK-3 figure, and this line describes the HK-3 re-record
  itself) — happens in the HK-3
  commit under war §10.4's discipline, field-level diff quoted). HK-2 alone
  moves NO persisted bytes; sequencing HK-2 first ships the visible cure with
  zero golden motion while HK-3's re-record is prepared.
- Advance path: if the VERIFY-AT-BUILD census finds advancement minting hooks
  through pool draws, those sites adopt the same registry (the registry is
  settlement-scoped state within the advancement pass, transient, never
  persisted); if advancement only re-derives, HK-2 already covers it.

## §4 INTEREST (the deterministic taste function)

`interestOf(hook) = priority (existing 0-9, plotHooks.js per-source)
+ accentBonus (accent ? 1.5 : 0)
+ severityBonus (critical 2 | high 1 | else 0)
+ linkBonus (0.25 × min(links.length, 2))
+ categoryWeight (owner-signed table; default: relationship +0.5, npc +0.25,
  faction +0.25, else 0 — persons over abstractions, per the named-actor rule)`

All terms typed and tunable in ONE table (§5); tie-break = codepoint compare on
normalized text. No term reads prose content, length, or any model output.

## §5 TUNING SURFACE (owner-signed; none a bare float on a surface)

| Band | Default | Notes |
|---|---|---|
| K per theme by scale band | hamlet/village 1 · town 1 · city+ 2 | HK-2 |
| categoryWeight table | relationship .5 · npc .25 · faction .25 · else 0 | §4 |
| accent/severity/link bonuses | 1.5 / 2,1 / .25×≤2 | §4 |
| Repeat-rate envelope | corpus < 2%; worst settlement < 10% (from 8.19%/35%) | HK-2+3 acceptance |
| Theme-repeat envelope | duplicate visible theme share ≈ 0 above K, walker-measured | HK-2 acceptance |

## §6 PINS (negative case hardest; every envelope carries a mutant control)

- **pin:same-seed-survivors** — two runs, same seed ⇒ byte-identical retained
  list (HK-2) and byte-identical generated pools (HK-3, post-re-record).
- **pin:the-DM's-pen** — a user-edited hook colliding with a higher-interest
  machine hook on the same theme SURVIVES; the machine hook is the one evicted.
- **pin:the-clock-holds** — a clock-anchored hook survives theme eviction; its
  escalation stages still derive after retention.
- **pin:untyped-untouched** — a free-prose hook never drops except on exact
  duplicate; mutant control: tag it artificially and prove the pin reds.
- **pin:roll-budget** — RNG stream length is identical pre/post HK-3 on a
  fixed seed (count draws; the wave E2 discipline re-asserted).
- **pin:worst-settlement** — a seeded fixture shaped like the measured 35%
  case (many same-category NPCs) lands under the envelope; negative control:
  disable retention, prove the envelope reds (guard-the-guard).
- **pin:independent-census** — the repeat-rate denominator derives from raw
  collected hooks, never from the retained output (self-referential-pin class).
- **pin:projection-only** — serialize→regen→undo round-trip: persisted hook
  arrays byte-identical with HK-2 active.

## §7 SEQUENCING + JUDGMENT BLOCKS

Order: HK-1 → HK-2 (ship the visible cure, zero golden motion) → HK-3 (the
source cure, disclosed re-record in its own commit). One wave = one commit,
focused gates per slice, full gate at wave end, ledger row each (war §10.3).

- **J-HK-1 (projection over mutation):** the snapshot cure is display-side,
  not a persisted-state scrub — regen/undo/import safety by construction
  outweighs the aesthetic of "clean" stored arrays; VETO orders a
  generation-time prune of persisted hooks (and accepts the lifecycle burden).
- **J-HK-2 (drop over substitute at the aggregator):** cross-actor collisions
  at display time resolve by ranked drop, never by fetching a replacement
  (a display-time fetch cannot see generation context; the redraw arm lives
  only at generation where plausibility is structural) — VETO adds a
  display-time replacement draw.
- **J-HK-3 (the theme set is closed, membership owner-tunable):** closure is
  law (finite semantics); the starting membership above is the architect's
  proposal — the owner signs or amends at HK-1 review.
- **J-HK-4 (K defaults conservative):** K=1 below city keeps "plenty of
  variety" honest; raising K is a tuning-table edit, never code.
- **J-HK-5 (both collectors converge):** hookEscalation's structured surface
  adopts retainHooks rather than staying un-deduped — one visible story set
  estate-wide; VETO keeps the structured surface raw and accepts the fork.

## §8 WHAT IS DELIBERATELY NOT BUILT

No prose rewriting or merging (HK-LAW-1). No AI scoring of hooks (HK-LAW-7;
finite semantics). No persisted theme state (themes derive from templates at
read time). No cross-SETTLEMENT dedup (each snapshot is its own story surface;
two towns may share a beat — that is the world, not a defect). No dedup of the
DM's own edits, ever. No new news kinds, no Herald surface, no flags beyond
the goldens discipline HK-3 already carries.
