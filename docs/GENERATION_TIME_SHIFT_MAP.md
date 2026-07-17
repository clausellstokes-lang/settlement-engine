# GENERATION-TIME CONTENT — SHIFT MAP (predict-first)

Lane: `claude/generation-time-content` (base = claude/w7-prep tip `07d3a1d2`).
Task #27's remaining half — the generation-time content-volume park wave.
This branch **PARKS RED** (the G2 pattern): growing seeded corpora shifts same-seed
picks into persisted/golden state. **No golden is re-recorded here.** The goldens
regen ONCE at the pre-signed ONE REGEN on the composite. This doc is written BEFORE
the corpus growth (predict-first discipline) and the "VERIFIED" section is filled in
AFTER the build.

Authoritative inventory: `docs/review-r2/CONTENT_THINNESS_SURVEY_RAW.txt` (banked on
the ledger branch `review-fixes-2026-07-08` @ 71dea09f). CONTENT-VT (the view-time
half) already landed @ 222806be (newsVoice 129→342) — this lane touches NONE of the
view-time surfaces.

---

## SCOPE (JUDGMENT, vetoable)

This lane grows the **world-pulse GENERATION-TIME event-prose slice** — the coherent
survey slice that contains all three brief headliners and shares ONE selection
mechanism and ONE register-guard surface. Every surface here is in a **lazy worldPulse
sim chunk** (never eager first-paint), and the picks persist into save/golden data.

**GROWN (this lane):**
1. **Calamity** (CRITICAL) — stamp title, strike-news summary + reasons. Bucket-neutral.
2. **War reason receipts** — 10 in `warReasons.js` + `fear_of_dominance` (`hegemonyFear.js`)
   + the decree-default template.
3. **Peace reason receipts** — 10 in `peaceReasons.js` (branches preserved) +
   `balance_restored` (`hegemonyFear.js`).
4. **Upswing news** — reconstruction / boom / bust / flourishing (headline+summary+reasons).
5. **Resource news** — discovery / exhaustion (headline+summary).
6. **Settlement-lifecycle news** — the NEWS prose of the steading kinds (headline+summary
   +reasons). In-record `history` state-log strings and `impactKind`s are PRESERVED.
7. **Realm order/refusal news** — applied-order + refusal news phrasing (the generation-time
   leg baked into `wizardNews`). Gate-dark instructional boilerplate + veto codes preserved.

**DEFERRED-with-reason** (routed to a sibling `CONTENT-GT-DOSSIER` lane with owner
taste-samples — spawned as a follow-up task):

| Survey surface | File | Why deferred |
|---|---|---|
| Historical events catalog | `src/data/historyData.js` | Owner-taste-sample AI-bulk narrative prose; needs world-scoped registry (survey's own rec) not just pool growth. |
| Founding / arrival / stress vignettes | `src/generators/narrativeGenerator.js`, `src/data/narrativeData.js` | Same taste-sample class; combinatorial pools already 3-6 deep. |
| Pressure sentence (CRITICAL) | `src/generators/narrativeText.js` (PRESSURE_SENTENCES) | Dossier narrative prose (taste-sample); `name.length%3` selector needs a mechanism swap. |
| Political-character flavor | `src/generators/narrativeText.js` (POLITICAL_FLAVOR) | Taste-sample class. |
| Institution descriptions (301) | `src/data/institutionalCatalog.js` | 301 single-variant blurbs; taste-sample bulk. |
| Institution service menus (935) | `src/data/institutionServices.js` | Rated adequate (menu/reference register); 935 entries. |
| NPC persona / hooks / goals | `src/data/npcData.js` | Taste-sample; needs world-scoped registry for cross-settlement dedupe. |
| Faction names (CRITICAL) | `src/data/powerData.js` (FACTION_DESCRIPTORS) | Real fix is a world-scoped dedupe registry (survey's rec), not pool growth; power-generation not event-prose. |
| Institution name tables | `src/data/institutionalCatalog.js` | Load-bearing substring lookup keys (rulingStructure/npcGenerator) — needs a `displayName` schema field = owner-gated persistence shape. |
| Deity names | `src/generators/data/deityPool.js` | Owner-ratified architecture (cross-settlement repetition IS the design). |
| Naming cultures | `src/data/namingData.js` | Rated adequate; thousands of combos per culture. |
| Impact digest | `src/domain/worldPulse/pulseHelpers.js` | Authors 0 prose (pure amplifier); fixed upstream for free. |

**Deferral rationale:** the dossier/naming corpora are exactly the commission's
"AI-bulk + owner taste-sample" material (docs/COMPREHENSIVE_REVIEW_PROGRAM.md ~1565).
Growing them blind and parking them into the permanent ONE REGEN — with no owner
taste-pass — risks a wholesale-revert grab-bag and mixes power/dossier generation into
an event-prose lane. Several also need world-scoped-registry architecture (the survey's
own recommendation) rather than pool growth. Routing them to a taste-sampled sibling lane
is the commission-faithful disposition, not under-delivery.

---

## SELECTION MECHANISM (the new generation-time mechanism, per CONTENT-VT-2 note)

`src/domain/worldPulse/eventProse.js` — a **pure** module (no rng, no clock):

- `fnv1a32(str)` — the repo's pure variant-selection hash idiom (as in newsVoice).
- `pickLine(pool, seed, interp)` → `pool[seed ? fnv1a32(seed) % pool.length : 0]`,
  resolving a function entry with `interp`. **Seed falsy ⇒ index 0 = the exact
  canonical string**, so every seedless caller (all existing scorer unit tests) is
  byte-identical.

Selection keys are **stable, non-tick** where phrasing must not churn:
- War/peace receipts: keyed on the **directed pair key** `${from}>${to}` (+ reason type).
  Same pair+type ⇒ same phrasing across ticks (no per-tick churn); different pairs differ.
- Calamity/kernel-news: keyed on the **stable event identity** (`${id}::${year}` for the
  calamity stamp; `${id}:${tick}` for the per-advance news beats).

**Why the shift is tightly localized:** selection is a PURE hash — it consumes **no rng
draw**, so the rng stream is unperturbed and NO structural/numeric/mechanical field moves.
The varied strings (receipts, headlines, summaries, reasons) are **display/record-only**
(no downstream code branches on their text). So the only bytes that can change are the
specific prose fields, and ONLY on the LIT path (dark flags never reach the pools ⇒
byte-identical ⇒ all dormancy goldens stay green). The framing-vs-semantics rule
(preserve every interpolated semantic token — counts, cause, provenance, names — vary
only the surrounding framing) keeps all keyword/structural pins green.

---

## PREDICTED GOLDEN-RED SET (before build)

The current suite exact-pins this prose in very few places (most surfaces are pinned by
keyword-regex, structural bounds, or self-provided inputs — all stay green under
canonical-as-v0 + framing-only variety). Predicted reds:

1. `tests/domain/calamity.kernel.integration.test.js:156` — `stamp.name` exact title
   (`'The Great Calamity of Thornwood, year 2'`). The kernel now selects a bucket-neutral
   title variant by hash of name+year. **PREDICT RED** (unless the hash lands on the
   canonical variant for Thornwood/year-2).

**All other exact-string pins predicted GREEN** because:
- Scorer unit tests call seedless ⇒ index 0 ⇒ canonical (keyword preserved: `unforgotten`,
  `oathbreach`, `same truth`, `supply web`, `blockaded`, `exhaustion`, `horde/passes`).
- `calamity.test.js:119-120` pin the pure `stampTitle` — **left UNCHANGED (canonical)**;
  the variety lives in the lazy kernel. GREEN.
- `calamity.kernel.integration.test.js:349-350` — force==natural (determinism holds) and
  `toContain('Great Calamity')` (every title variant keeps "Great Calamity"). GREEN.
- `calamity.kernel.integration.test.js:420-433` — the bucket-neutrality LAW: no summary/
  reason variant contains flood/fire/quake/earthquake/storm; every joined prose contains
  "calamity". Register guard enforces this. GREEN.
- War/peace lit-integration tests assert `receipt.length > 0` (structural). GREEN.
- Lifecycle in-record `history` pins (`folded into one palisade`, `a charter awaits`) and
  `impactKind` fallbacks are preserved. GREEN.
- Soaks (cacophony, upswingRecovery) compare run-vs-run (determinism) — deterministic. GREEN.
- No lit stored-manifest golden captures the receipts / calamity stamps / news summaries
  (spatialDigestGolden captures geometry; dormancy goldens hash the DARK projection).

**NEW green tests added:** register guards (bucket-neutrality, no canon proper nouns,
non-empty), full-reachability (every pool line reachable), determinism pins (same
seed→same pick, different pairs differ).

---

## VERIFIED (after build)

_(filled in after running the suite — actual red set vs predicted; eager delta)_
