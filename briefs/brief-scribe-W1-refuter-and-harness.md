# LANE: THE SCRIBE — W1, THE REFUTER AS A LIBRARY · THE EPOCH RECORD · THE DENO BUNDLE · THE PILOT HARNESS
(DRAFT written 2026-09-14 06:2x before W0 reported; §A is filled from W0's report before dispatch — do not dispatch with ⟦…⟧ tokens unfilled)

DOCK: `$SC/kit/lane-scribe` at W0's tip ⟦W0 TIP SHA⟧. Same laws as W0's brief (read it): pure code, zero product-facing bytes, no annex/census/leaf
change, the golden master and the recorder-blind pin (2756) byte-identical, new files only, no em dash/`!`, never push, never stash/checkout/reset,
`/usr/bin/grep`, vitest via `gate-mutex.sh`, the checkpoint line above `**+ 09-14 05:3x — THE OWNER OPENED A SECOND PROGRAMME` after every commit,
trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
READ FIRST: the design at the ledger `1e2a413af` (`git -C /Users/cstokes/Desktop/settlement-engine show 1e2a413af:docs/DESIGN_SCRIBE_GENERATION_TIME_PROSE.md`)
§3, §4, §5b, §7, §10, §11 · `$SC/kit/briefs/SCRIBE-RULINGS.md` · W0's report ⟦path⟧ · `src/domain/prose/townCard.js` and its test · then the arms:
`src/domain/prose/moveGrammar.js` (MOVES :38 · NON_MOVES :67 · LEVEL1_ORDERS :98 · WALLS :130 · classifyMoves :268 · orderIdOf :310),
`src/domain/prose/composedWalker.js` (COMPOSED_ARMS :102 · walkComposed :1155 · composedVerdictOf :1190 · A1 :333 · A5 :598 · A6 :646 · A13 :1052 ·
Tail :901 · Aspect :935 · Restatement :967 · Ambiguity :1002 · Thread :821 · provenanceCount :1025), `src/domain/prose/entryWalker.js` (C3 :536 · C4 :614 ·
C5 :696 · Q :893 · X :948 · F25 :981 · the klass vocabulary :144), `src/domain/prose/entryGround.js` (estateGround :49 · settlementGround :96),
`src/domain/prose/holderTable.js` (sourceOfForTown :723), `tests/copy/voiceMechanics.test.js` (:273 the hard-zero bars · :527 the tell ban and its
quarantine), `tests/copy/proseLeak.test.js` (:5-22 the six leak classes), `$SC/kit/rewrite/clarity-sweep.mjs` (the proxy limbs), `$SC/kit/rewrite/measure-block.py`
(the four measures), `src/domain/display/stateProse/stateProseKernel.js` (variantIsAudible :211, hashKey :467).

## §A. THE CARD ADAPTER (from W0's report) — ⟦the card's shape; which key holds the fired pools, the seated roles, the machine lines, the frozen values, the epoch identity, `lastAdvance` if W0 carried it⟧

## §B. DELIVERABLE 1 — `src/domain/prose/refuteUnit.js`: `refuteUnit(unit, card, { corpusUnit?, options? }) → { verdict, findings[], report{} }`
ONE function, pure, headless, deterministic, that runs EVERY tier-0 arm the design names (§4) over one unit `{stance?, source?, pair?, text}`:
  - the mechanical bars (em dash · `!` · digit · semicolon · contraction · first person · `will`/`shall`) and the setting-agnostic tell ban WITH its
    quarantine list, ported from voiceMechanics as a function (never re-implemented from memory — import or lift the regexes and pin equality);
  - the proseLeak classes (flagKey from `DEFAULT_SIMULATION_RULES` live, tick, week, schema, rawId);
  - the move grammar: `classifyMoves` → NON_MOVES; on a SPINE `orderIdOf` must be a LEVEL1 order; WALLS 5, 6, 10;
  - the composed arms that need only text (A1 over the unit's pieces · A5 · A6 · Tail · Aspect · Restatement · Ambiguity · Thread);
  - the entry arms grounded on THE CARD, not the census: C3 (with `eventProvenance` from the card's frozen table) · C4 (columns from the card's rows) ·
    C5 (the pool's own siblings from the card) · X (office/institution columns from the card) · Q · F25;
  - A13 with `sourceOfForTown` over the card's holder rows; THE REFERENT SCAN: every role phrase in the text must be one the card seats, every
    body named must be a row the card has (a body the card lacks = FAIL, floor 1);
  - THE CORPUS DIFF when `corpusUnit` is given: moves ADDED (PROVENANCE, HISTORY) are findings; a LEVEL1 order lost on a spine is a finding;
  - THE EPOCH SCAN (§5b) when the card carries `epoch`: a value the text asserts that the current card does not hold = FAIL; "since the last
    survey"/elapsed-course language only over a field the delta names;
  - the clarity proxy and the four measures as REPORT rows (refuse nothing; ruling 1).
`verdict` ∈ FAIL > WITHHELD > PASS by the walker's own rule (REPORT never moves a verdict). Every census-dependent arm that cannot execute returns
NOT-EXECUTABLE exactly as today (a truthful partial verdict, never a manufactured PASS or FAIL). A companion `refuteTab(units, card)` runs the
page-level arms (C7 sibling agreement across the tab, opener-trigram repeats, sibling overlap) over a whole tab's units.
TESTS `tests/domain/refuteUnit.test.js`: every arm has a positive and a NEGATIVE CONTROL (a unit built to trip it, and the same unit repaired);
the batch-4 corpus of moved claims is the fixture — the ~20 lines the audit found (habitual→episode, town→room, actor change, added sentence, the
`The elders say` PROVENANCE) MUST each be caught by a named arm, and their repaired forms MUST pass; the 24 DS-DEF-2 pools' landed units all PASS
or WITHHELD, never FAIL (the corpus is the floor); equality pins against the walker (`walkComposed` on the same unit gives the same findings).

## §C. DELIVERABLE 2 — `src/domain/prose/epochRecord.js`: `cardDelta(prev, next)` and `epochRecord(prevCard, nextCard, campaignState)`
`cardDelta` names every typed field that moved between two cards and nothing else (deep, key-sorted, values before/after; roster rows added/
removed by name; pools that started/stopped firing). `epochRecord` = `{ advanceSeq, delta, events, pulse }` from `campaignState.eventLog` entries
since the previous epoch, the interval aggregate and the final `pulseRecord`, `wizardNews` — plain data in the engine's typed vocabulary, no prose.
TESTS: `cardDelta(c, c)` is empty; a one-field change names exactly that field; a golden over two epochs of the first golden town advanced one
season through the real advance path (find how the property suites advance a world — `advanceCampaignWorld`, `tests/property/*soak*`).

## §D. DELIVERABLE 3 — THE DENO BUNDLE: `scripts/scribe-bundle.mjs` → `supabase/functions/_shared/proseKernel.bundle.js`
Bundle `refuteUnit.js` + `epochRecord.js` + their imports (moveGrammar, composedWalker, entryWalker, entryGround, holderTable, faceSources, the
desk key functions, institutionRoles) into ONE dependency-free ESM file Deno can import — with esbuild if it is already in node_modules, else a
hand-rolled concatenation is acceptable ONLY if a test proves it evaluates. Pin: `tests/lint/scribeBundle.walker.test.js` rebuilds the bundle and
asserts byte-equality with the committed file (the census idiom), and `deno check` or a node evaluation proves it loads. ⚠ THE PRODUCT'S
`package.json` IS A MINT TRIGGER — add no dependency; if esbuild is absent, say so and hand-roll.

## §E. DELIVERABLE 4 — THE PILOT HARNESS (in the KIT, never the product): `$SC/kit/scribe-harness/` (the SDK 0.125.0 and zod are installed there)
`render-town.mjs <settlement.json> --tab <tab> --epoch <k> [--model claude-opus-5] [--dry]` — builds the card (imports `townCard.js` from the dock by
absolute path), builds the block brief (the v3 VOICE verbatim from `$SC/kit/rewrite/rewrite-block-v3.workflow.js`'s `VOICE` constant + the exemplar
pack + the static card sections + the output schema), calls the model through the SDK EXACTLY as the claude-api skill specifies (`client.messages.parse`
with `output_config.format: zodOutputFormat(schema)` · `model: 'claude-opus-5'` · adaptive thinking · `output_config.effort: 'high'` · the block brief as
a `system` block with `cache_control: {type:'ephemeral', ttl:'1h'}` and the card + delta as the volatile user turn · `max_tokens` 16000 · the server-side
`fallbacks` opted in per the skill), runs `refuteUnit` over every returned unit, writes `out/<seed>/<tab>-e<k>.json` (units, verdicts, report, `usage`
incl. `cache_read_input_tokens`, wall-clock) and prints one line per unit: verdict · arm · text. `--dry` builds everything and prints the token count
(`client.messages.countTokens`) without calling the model. `pilot.mjs --towns 20 --funnel rate|wizard --epochs 1|12` drives `rateGrid()` towns through
all six tabs and, with `--epochs 12`, advances the world a season at a time through the real advance path, rendering each epoch from its record.
NO KEY IS IN THE ENVIRONMENT TODAY: the harness must run end to end in `--dry` and stop with a plain sentence if `ANTHROPIC_API_KEY` is unset; the
owner supplies the key for W3. Never read the product's Supabase secrets.

## GATES: W0's list, plus the new tests, plus `tests/lint/scribeBundle.walker.test.js`. REPORT (data for the chair): the shas · the arm roster with
each arm's ground (text-only / card / NOT-EXECUTABLE) · the batch-4 fixture's catch table (line → arm) · bundle size · the `--dry` token count per tab
for the median golden town · every judgment call · what W2 needs.
