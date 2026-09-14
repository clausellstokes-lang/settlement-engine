# LANE: THE SCRIBE — W0, THE TOWN CARD (pure code; zero product-facing bytes; the piece everything else stands on)

THE OWNER (2026-09-14 ~05:5x): "build it in! this will likely happen first before the handwritten prose lands."
DOCK: `$SC/kit/lane-scribe` — a worktree at `7992713d0` (the DEF-2 clarity tip, which carries cars 18a–18o: roles,
compromised sources, the pin, the instruments). `$SC` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad`.
node_modules symlinked. Porcelain 0 now — verify before every commit. NEVER push. NEVER stash/checkout/reset --hard.
`/usr/bin/grep`. vitest only via `sh scripts/gate-mutex.sh --run -- npx vitest run <files>`. Trailer on every commit:
`Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. THE CHECKPOINT LAW: after every commit insert one line into
`$SC/kit/RESUME-NOTE.md` immediately ABOVE the line beginning `**+ 09-14 05:3x — THE OWNER OPENED A SECOND PROGRAMME`
(python insert; never rewrite the file) with the sha and the figures.

READ FIRST, whole: the design — `git -C /Users/cstokes/Desktop/settlement-engine show ee32d71ca:docs/DESIGN_SCRIBE_GENERATION_TIME_PROSE.md`
(§2 the town card, §3 the contract, §5 READ, §7 the pins, §11 W0). Then in the dock: `src/domain/display/stateProse/faceSources.js`
(sourcesOf :128 · rolesOf :236 · compromisedSourcesOf :326 · renderYearOf :358 · withFaceSources :377 · pageProse :449),
`src/domain/display/stateProse/stateProseKernel.js` (eligibleVariants :299 · drawVariant :432 · hashKey :467 · drawRole :1147 ·
compromisedSpeaks :1309 · variantIsAudible :211), `src/domain/display/stateProse/composeStateProse.js` (the closed `read` literal at
:1182-1208 AND :1322-1348 — the duplicated seam; the return shape :1267-1277; COMPROMISED_SYMPTOM_POOLS :477),
`src/domain/display/stateProse/legibilityRung.js` (:62 the {glance, sentence, detail, provenance} shape),
`src/domain/display/stateProse/dossierMounts.js` (DOSSIER_MOUNTS :257, drawnAtMount :581), `scripts/lib/prose-render-defense-page.mjs`
(renderDefensePage :59 — the pattern: it follows DefenseTab.jsx line by line), `scripts/prose-mark-card.mjs` (the nine-section corpus
card; the header explains each section), `scripts/lib/prose-mark-fields.mjs` (clockOf, normaliseRead, the frozen-field census),
`src/domain/prose/holderTable.js` (sourceOfForTown :723, holdersOf :599), `src/data/institutionRoles.js`, `scripts/prose-rate-corpus.mjs`
(the desk-read recipes at :59-73 and `rateGrid`), `tests/property/generatorGoldenMaster.test.js` (the 525-town fixture and how it is
loaded), the five tab components `src/components/new/tabs/{Overview,Power,Economics,Defense,WarFaith}Tab.jsx` (which leaf mounts where).

## WHAT W0 DELIVERS (four things, each its own commit)

### 1. `src/domain/prose/townCard.js` — `townCard(settlement, { tab, audience, world? }) → card` (pure, headless, deterministic)
THE PRINCIPLE (design §3.3): the card is the composer's OWN TRACE plus the town's own rows. Build it by RUNNING the existing
pipeline over the settlement — the shipped desk-read recipes (as `prose-rate-corpus.mjs` calls them, never `{}` readings) →
`pageProse` → the desk entry points → `composeStateProse` → `legibilityRung` — and HARVESTING what it drew, so the card carries:
  (a) per pool that FIRED on this tab: blockId · poolKey · the drawn vid · the variant's stance/angle tag · its marks (dm-only etc.) ·
      the seated sources and the roles `rolesOf` printed for them · the pair kinds · the slot fills · whether the compromised roll
      said the compromised source speaks this year (`compromisedSpeaks`, the SAME seed/year the page used) · and THE CORPUS UNIT AS
      DRAWN (spine + faces text) — the exemplar and the fallback;
  (b) the town: `sourcesOf`, `rolesOf` (all seated roles, so the model may draw variety), `compromisedSourcesOf`, the institution rows
      by name with the services actually on, the armed-forces filing the page derived, the holder rows (`sourceOfForTown`) — i.e.
      corpus-card sections (2), (2b), (2c), (7) collapsed to this town;
  (c) THE MACHINE LINES actually on the tab, in page order (the corpus card's (3)/(4) collapsed to the literal page) — this is the
      per-tab page render (deliverable 3);
  (d) the frozen fields' actual VALUES with the FROZEN/LIVE classification from the static table (deliverable 2) and `renderYearOf`;
  (e) the audience, the seed the draw was keyed to (`r._seed ?? r.id`, the tabs' own expression), the tab, the engine version.
The card is PLAIN DATA (JSON-serialisable, key-sorted, no functions, no class instances) and MUST be byte-stable: two calls on the same
settlement return identical JSON. It must contain no field the display layer does not already read (the same espree `producerReads` walk
the corpus card uses is the oracle — put the field list in the test).
⛔ THE `read` LITERAL IS DUPLICATED at composeStateProse.js:1182-1208 and :1322-1348 — if you need the composer to surface anything new
(e.g. the compromised roll's outcome), add it in `withFaceSources` AND BOTH copies, and say so in the commit. Prefer harvesting from
`pieces`/`provenance` over touching the composer at all.

### 2. `docs/content/scribe-static-card.json` + `scripts/scribe-static-card.mjs [--check]`
The three corpus-card parts that are properties of the CODEBASE, not the town — the read clocks (SNAPSHOT/LIVE-ROSTER/PULSE/CONFIG per
field, `clockOf`), the FROZEN/LIVE classification of every field a desk reads (the pulse-tree writer census, `frozenFieldCensus`), and the
wiring status per pool from the committed census — precomputed ONCE per pool key into a small JSON, key-sorted, with `--check` that
rebuilds and diffs byte-for-byte (the estate's census idiom). The card (1) joins on it by pool key. Do NOT change wiring-census.json.

### 3. Per-tab page render: `src/domain/prose/scribePage.js` — `renderTabPage(settlement, tab, { audience }) → PageLine[]`
The `renderDefensePage` pattern (`{section, kind, text, block?, pool?, vid?, face?}`) for ALL tabs the six leaves mount on, following
each Tab.jsx line by line — machine rows and composed rows interleaved in page order. Move/adapt the defense one so the script and
the library share one implementation (the script keeps working). This is what the card's (c) reads and what the refuter's page-level
arms (C7, the sibling-repeat measures) will read in W1.

### 4. Tests + a fixture: `tests/domain/townCard.test.js`
  - BYTE-STABILITY: over the 525 golden-master towns (load them the way generatorGoldenMaster does), `townCard` on every tab is
    identical across two calls, and identical before and after `regenSection` on a non-locked section for a 20-town sample;
  - NO NEW READ: every settlement field path the card carries is in the producer-reads set (fail with the offending path);
  - EVERY FIRED POOL HAS A STATIC ROW, and every card pool key exists in the corpus leaf;
  - DETERMINISM OF THE TRACE: the vid on the card equals what `drawVariant` returns for `(seed, blockId, poolKey)`; the roles on the card
    are a subset of `rolesOf`; the compromised flag equals `compromisedSpeaks(...)` recomputed;
  - AUDIENCE: a `player` card carries no dm-only unit and no notebook line; a `dm` card may;
  - A GOLDEN: `tests/fixtures/scribe-town-card.golden.json` — one town (the first golden-master town), all tabs — exact-equality, with
    the SHIFT RECORD discipline the golden master uses (a re-record needs a written cause);
  - a negative control for each pin (a deliberately broken card fails the arm).
  Also assert the module is HEADLESS: importing `townCard.js` pulls nothing from `src/components/` (a source scan).

## GATES (after every commit)
`generate-dossier-state-prose.mjs --check` and `wiring-census.mjs --check` must be GREEN AND BYTE-IDENTICAL (W0 changes no annex, no
census). The per-commit suites: `tests/data/dossierStateProseProjection.contract.test.js` · `tests/lint/proseComposed.walker.test.js` ·
`tests/lint/proseMoveGrammar.walker.test.js` · `tests/domain/stateProseKernel.test.js` · `tests/domain/composeStateProse.test.js` (the
recorder-blind pin stays 2756) · `tests/property/generatorGoldenMaster.test.js` (the 525 hashes MUST NOT MOVE — W0 writes nothing onto a
settlement) · your new test · `tests/lint/sizeBaseline.test.js` and `tests/build/vendorPdfLazy.test.js` (a new headless module is not in
the eager chain; if a ratchet needs a new row for a new file, add it and DECLARE it in the body — never touch a baselined file's line
count; put new code in NEW files) · `tests/copy/voiceMechanics.test.js` (no em dash/`!` in any string you add). Typecheck if the repo runs
one (`package.json`). Report the measured SIZE of a card per tab (bytes and a rough token count at 4 chars/token) for the median golden
town and the largest, and the wall-clock per card.

## REPORT (the final text is data for the chair): the four shas · the card's top-level shape as a JSON schema sketch · the field list ·
sizes and timings · every judgment call (what you harvested vs recomputed; anything you had to add to the composer's `read`) · every
gate's figure · what W1 (the refuter library) will need from the card that you did not provide.
