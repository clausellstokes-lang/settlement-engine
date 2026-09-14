# LANE: THE SCRIBE — W1, THE REFUTER AS A LIBRARY · THE EPOCH RECORD · THE DENO BUNDLE · THE PILOT HARNESS
(filled from W0's report 2026-09-14 08:0x; ready to dispatch)

DOCK: `$SC/kit/lane-scribe` at W0's tip `f4827c247` (W0's four commits: `1bd614ec9` scribePage · `3acf8cab8` the static card · `fa71589a3` townCard · `f4827c247` the tests + golden). Same laws as W0's brief (read it): pure code, zero product-facing bytes, no annex/census/leaf
change, the golden master and the recorder-blind pin (2756) byte-identical, new files only, no em dash/`!`, never push, never stash/checkout/reset,
`/usr/bin/grep`, vitest via `gate-mutex.sh`, the checkpoint line above `**+ 09-14 05:3x — THE OWNER OPENED A SECOND PROGRAMME` after every commit,
trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
READ FIRST: the design at the ledger `1e2a413af` (`git -C /Users/cstokes/Desktop/settlement-engine show 1e2a413af:docs/DESIGN_SCRIBE_GENERATION_TIME_PROSE.md`)
§3, §4, §5b, §7, §10, §11 · `$SC/kit/briefs/SCRIBE-RULINGS.md` · W0's report (the shape is restated in §A below) · `src/domain/prose/townCard.js` and its test · then the arms:
`src/domain/prose/moveGrammar.js` (MOVES :38 · NON_MOVES :67 · LEVEL1_ORDERS :98 · WALLS :130 · classifyMoves :268 · orderIdOf :310),
`src/domain/prose/composedWalker.js` (COMPOSED_ARMS :102 · walkComposed :1155 · composedVerdictOf :1190 · A1 :333 · A5 :598 · A6 :646 · A13 :1052 ·
Tail :901 · Aspect :935 · Restatement :967 · Ambiguity :1002 · Thread :821 · provenanceCount :1025), `src/domain/prose/entryWalker.js` (C3 :536 · C4 :614 ·
C5 :696 · Q :893 · X :948 · F25 :981 · the klass vocabulary :144), `src/domain/prose/entryGround.js` (estateGround :49 · settlementGround :96),
`src/domain/prose/holderTable.js` (sourceOfForTown :723), `tests/copy/voiceMechanics.test.js` (:273 the hard-zero bars · :527 the tell ban and its
quarantine), `tests/copy/proseLeak.test.js` (:5-22 the six leak classes), `$SC/kit/rewrite/clarity-sweep.mjs` (the proxy limbs), `$SC/kit/rewrite/measure-block.py`
(the four measures), `src/domain/display/stateProse/stateProseKernel.js` (variantIsAudible :211, hashKey :467).

## §A. THE CARD ADAPTER — W0's card, as landed
`townCard(settlement, { tab, audience, staticCard, world? })` (`src/domain/prose/townCard.js`) returns key-sorted plain data:
`{ schema, tab, tabIsKnown, audience, seed, engineVersion, staticCardJoined, epoch:{advanced, tick, calendar, renderYear, renderYearIsFrozen,
campaignEraEvents, foodStockpileLastTick}, lastAdvance: null|{id, tick, interval, committed, calendar, summary[], outcomes[{id,type,ruleId,headline,
summary}], corruption[], factionCapture[]}, town:{id, name, tier, culture, sources[], roles[{source, roster[{role,n}]}], compromised[], compromisedRate,
institutions[{name, category, services[]}], armedForces{bucket:[names]}, forceBuckets{militia,watch,garrison}, hasWorld}, pools:[ {blockId, poolKey, mount,
section, vid (the ANNEX row), authoredIndex, face, angle, marks[], pieces[{role,key,vid,index,face,source,pairOf,pairKind}], pairKinds[], faceSources[],
faceRoles[{source, roster[]}], slots:{declared[], fills[], verbs[], recovered}, compromised:null|{source,speaks,rate,year}, unit:{rendered, spine, faces[],
faceSourceTags[], pairs[]}, static:{wiring, keyFunction, rung, reads[], covert, variants, rateBp}, fields:[{field,value,clock,writers,status,grain}] } ]
(PAGE ORDER, unsorted on purpose), page:[PageLine{section, kind, text, block?, pool?, vid?, face?, mount?, label?, pieces?}], mounts:[{mount,blockId,rung,desk}] }`.
The static card is an INPUT (`options.staticCard`, from `docs/content/scribe-static-card.json`, 413 KB: 708 pools / 125 fields, 116 FROZEN / 9 LIVE);
absent is lawful and the card says `staticCardJoined:false`. `renderTabPage(settlement, tab, {audience})` in `src/domain/prose/scribePage.js` covers
all 13 tabs; the defense render is byte-identical to the script's over 168 towns × 2 audiences. Sizes: a whole 13-tab card is 145–261 KB; defense
~11.7k tokens, overview ~9k, power ~5.5k, the rest 2–5k; ~7 KB of every tab is the repeated `town` block — the harness HOISTS `town` once per
settlement into the cached prefix's tail and sends per-tab `pools`+`page` as the volatile turn.
⚠ W0's findings you inherit: (i) `history.age` is FROZEN at generation (measured 215→215 over 30 one-year advances while `calendar.year` went 2→31),
so `renderYearOf` is a constant and ruling 26's "seven years in ten, seeded on the year" roll never re-rolls — the card carries
`renderYearIsFrozen:true`; for the Scribe the EPOCH is `epoch.tick` (campaign-side, `worldState.tick`), and `epochRecord` keys on it; do NOT change the
kernel's roll (that moves rendered text; W2 declares it); (ii) no epoch field lives on a settlement — `lastAdvance` is `worldState.pulseHistory.at(-1)`
filtered to the town, reachable only through `world`; headless towns have `lastAdvance:null` and `hasWorld:false` (DS-REL-1 and `war.*` are dark
headless — the pilot needs campaign worlds for those tabs); (iii) only the HEAD face's roles are recovered per piece — a paired unit's partner and
weighing rows are not aligned (you align them, or surface `claimed` from the composer's `read` at BOTH duplicated sites); (iv) `opener`/`unitSentences`/
`overCap` are computed by the composer and dropped by the page line — surface them for the REPORT rows; (v) the same-page MACHINE read set exists for
Defense only (`prose-mark-card.mjs` TAB_PRODUCERS) — the page-level arms use `card.page` for every tab and say NOT-EXECUTABLE for the read-set limb
elsewhere; (vi) `symptomSourceOf` is DS-DEF-2-only, so `pools[].compromised` is null elsewhere by construction; (vii) ⚠ adding any `.js` under
`src/domain/**` moves `wiring-census.json`'s `stamp.producerIndexFiles` — declare the one-pair diff per commit, as W0 did; (viii) `voiceMechanics.test.js`
E2 is red at 7992713d0 on `labelBands.js`/`generalStateProse.js` (pre-existing, proven in a throwaway worktree) — report, never re-record.

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
