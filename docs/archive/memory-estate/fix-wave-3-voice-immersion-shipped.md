---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-20
  type: wave-shipped
  scope: fix wave 3 — voice & immersion (composite-r4 minifold worktree)
  commit: f5132f2001601825a0bcd6825fdca8ecf1fac904
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T01:17:32.360Z
---

# Fix wave 3 SHIPPED @ f5132f20 — the register holds (voice & immersion)

**claude/composite-r4 (minifold), one commit on wave 2 @ 8dfd2aed. NOT pushed
(owner-gated). Gate: closure 1,038,084 ≤ 1,040,000 · strict 0 · tsc 0 · lint 0 ·
full suite two shards = ONLY the 4 parked families red (every other red re-ran
green in isolation — pglite `--no-file-parallelism` + load-flake classes).**

## The two standing enforcers (the durable value)

- **E1 `tests/copy/proseLeak.test.js`** — renders the four reader-facing
  composers (letter, world-book collector, chronicle read-model, decree tracker)
  over fixtures and scans OUTPUT prose for: flag keys (set built live from
  DEFAULT_SIMULATION_RULES + presets — new flags auto-covered), bare `tick <n>`,
  bare `week <n>` (`week k of N` is sanctioned), schema field names, raw ids,
  em-dash-in-output. EXPECTED_LEAKS = exact-equality shrink-only baseline
  (3 letter entries, all owner-gated). Positive controls prove detectors bite.
- **E2 `tests/copy/voiceMechanics.test.js`** — the guard §7/seo.js/
  seoCompendium.js already claimed: HARD-ZERO em-dash/`!` walk of the copy
  registries + shrink-only per-file string-LITERAL ratchet over src/data +
  src/domain (`tests/copy/.voice-mechanics-baseline.json`, 112 files,
  em 672 / bang 15 = the frozen budgets). Regenerate ONLY for an approved
  sweep: `UPDATE_VOICE_BASELINE=1`. Comments + `${…}` expressions excluded.
- **enforcement-claims extended** — CLAIM_RE matches "fails the build";
  VOICE_AND_TONE.md in DOC_FILES; parityContract.js + mutateHelpers.js tagged.

## Instance fixes landed

- **idx0**: Rival copy said "overlapping exports suppressed" — engine compete
  mode MIRRORS exports (×1.35, no removal); suppression is the trade-partner
  complement mode. catalogData.js + HowToUse.jsx + gen:compendium-data regen.
- **Humanizer chokepoint**: `src/domain/display/humanizeEngineTokens.js`
  (pure lazy leaf; tickCalendarLabel pinned against seasonForTick). Wired:
  world-book painter (calendar dates, headline col ML+40→52, painter smoke
  test added — asserts real PDF artifacts then removes them) and AdvanceReport
  scrubber ("the year to the spring of year 2"; component test re-pinned).
- **Em-dash sweep**: copy registries to ZERO (41 strings); all 14 src/data
  prose files to ZERO (493 dashes, 3 opus subagents, focused suites green, no
  expectation edits needed); §7 rewritten to describe the real guard.

## ⚠️ THE ONE-REGEN QUEUE addition (owner-gated)

`src/domain/display/chroniclersLetter.js`: wire tickCalendarLabel +
humanizeFlagKey into letterToPlainText (tick-range line; `— ${f}` deepened
bullets) + §6-rewrite GREETINGS[1] and DEEPENED_LEAD → reddens the GREEN
chroniclersLetterGolden → owner re-records (`UPDATE_LETTER_GOLDEN=1`), strikes
the three E1 EXPECTED_LEAKS letter entries, lowers the file's E2 baseline row.

## Deliberately deferred (documented, not bugs)

- eventProse.js (148) / roadsProse.js (15) / traditionProse.js (17) + remaining
  src/domain prose (E2 total 672): canonical-at-zero + keyword pins + the
  stampTitle cross-byte contract make them their own wave; E2 holds them
  shrink-only. E2 scans no JSX components yet.

## Hazards learned (verified this wave)

- ⚠️ ALL GREEN goldens hash MECHANICAL projections, never prose — data/copy
  prose edits are golden-safe. The ONE green-hashed prose surface is the letter
  composer's own constants (chroniclersLetterGolden hashes {letter, text}).
- ⚠️ Sweeping src/data/institutionalCatalog.js DESYNCS the checked-in edge
  bundle — aiGroundingBundle.meta.json lists 4 src/data inputs (constants,
  entityTags, institutionalCatalog, npcTraitWeights); cure = `npm run
  build:edge-shared` in the same commit (freshness test names the flow).
- ⚠️ jsPDF `save` is an OWN instance property (defineProperty in the
  constructor — prototype accessors CANNOT stub it) and its node build writes
  REAL PDFs to cwd; a painter test must assert-then-rm the artifacts.
- ⚠️ "bar 13" in review findings = A+ quality bar #13 (claims-vs-enforcement
  parity), not a marketing-claims index.
- Full-suite flake replay: ~26 pglite files fail under file-parallelism and
  advancePauseResume / joins/ordering / servicesSeverityPlaceholder fail under
  load — all green in isolation runs; classify before believing any red.
