/**
 * sovereigntyLightingContract.walker.test.js — THE INSTRUMENT THAT REPLACES THE PHANTOM.
 *
 * Five doc homes stated `sovereigntyTradeEnabled`'s green condition as "SP-B + SP-B2 +
 * ES-4 landed" and pointed at a WR-9 certification lighting-order row as if it were an
 * artifact. It never was — re-measured across src/, tests/ and docs/ at the fold head
 * `32cc17f7` and again at this landing. This file, with `SOVEREIGNTY_LIGHTING_EVIDENCE`
 * in src/domain/certification/warConvergenceContract.js, is the artifact: the contract
 * declares the three wave evidences and their addresses, and this walker MEASURES whether
 * each has arrived.
 *
 * ── WHY IT MUST STAY GREEN TODAY, AND WHAT THAT COSTS IT ────────────────────────
 * ES-4 is unbuilt, so the condition reads `UNSATISFIED_TRACKED`. A walker that failed on
 * that would red the base suite for the crime of the build order being the build order,
 * and the first thing anyone would do is delete it. So the assertions are chosen so that
 * BOTH build states pass:
 *
 *   • RATCHET — SP-B's and SP-B2's evidence must be PRESENT. Those waves have landed;
 *     if either regresses this reds, and that is a correct red.
 *   • BICONDITIONAL — the condition reads SATISFIED if and only if ES-4's marker is
 *     found. Green in both worlds, and it proves the state is driven by the measurement
 *     rather than by a constant.
 *   • MUTANTS — the evaluator is driven with injected presence maps: all-three ⇒
 *     SATISFIED (the flip, proven without waiting for ES-4), and each row absent in turn
 *     ⇒ UNSATISFIED_TRACKED naming exactly that wave (the discrimination).
 *   • NEGATIVE CONTROL — a fabricated marker finds nothing, so "found" is a real read
 *     and not a substring that always hits.
 *
 * ── THE ADDRESS RULE ───────────────────────────────────────────────────────────
 * The first cut of this file measured a TEST_MARKER row with `src.includes(marker)` over
 * every test file. That read is VACUOUS IN THE ONLY DIRECTION THAT MATTERS, and it was
 * proven so by execution: a one-line file whose entire content was the bare comment
 * `// ES-4-DISTANT-SOURCE-EVIDENCE` flipped the ES-4 row to present and the whole
 * condition to `SATISFIED / satisfiable true / missing []`. An instrument whose green
 * condition can be forged by a comment is a worse artifact than the phantom row it
 * replaced, because the phantom was at least visibly absent.
 *
 * SO A MARKER IS EVIDENCE ONLY WHERE IT STANDS IN THE TITLE OF A **TEST** THAT WILL ACTUALLY
 * RUN, IN A FILE WHOSE ADDRESS THIS WALKER DECLARES. FIVE DOORS, each pinned individually
 * below because a second door silently covering a deleted first is this program's
 * most-repeated verification failure:
 *   0. THE DECLARED ADDRESS (THE CAP, § the tenth statement) — the file must be one of the
 *      three literal paths in `EVIDENCE_FILE_ADDRESSES`. A marker anywhere else in tests/ is
 *      not evidence, and the census arm says which addresses are declared.
 *   1. TITLE POSITION — the marker must sit in the first argument of an `it`/`test` call, and
 *      that argument must be a static string. A comment, a string constant and an `expect(...)`
 *      argument are all refused — AND SO, SINCE THE TENTH CUT, IS A `describe`/`suite` TITLE,
 *      which is parsed and kept but never joined against (§ the tenth statement).
 *   2. THE TEST MUST BE ONE THIS WALKER CAN PROVE RUNS — only the closed running TEST grammar
 *      keeps its title, only through a word that RESOLVES to vitest's own `it`/`test` by that
 *      export's OWN name, only with a FUNCTION BODY in argument two, only off a table this
 *      reader can prove has rows, only with a CONTEXT-FREE callback (no parameters at all),
 *      and only where the call stands as a direct statement of the module body or of a
 *      credited suite's STRAIGHT-LINE block. A test in a helper, a loop, a conditional or a
 *      callback registers nothing that a syntax tree can prove, so it keeps nothing.
 *   3. THE SUITE MUST BE ONE THIS WALKER CAN PROVE RUNS — a file is refused WHOLE unless every
 *      suite it opens meets the same conditions AND opens a block that is straight-line
 *      registration. The conditions are what this walker CREDITS; they are not a census of
 *      what vitest reads, and § the eighth statement is where that distinction is argued.
 *   4. SELF-EXCLUSION — this walker never vouches for itself (it names every marker by
 *      import). SUBSUMED BY DOOR 0 AND KEPT AS BELT: no declared address is under tests/lint/,
 *      so the walker's own file could not be a carrier even with the clause deleted. It is
 *      pinned as what it now is, rather than pinned as if it were still load-bearing.
 *
 * ── DOOR 3, FIFTH STATEMENT: CLASSIFICATION IS BY PARSE ────────────────────────
 * Four cuts of door 3 were REGEX classifiers over TEXT, and all four were falsified the
 * same way. Cut one read one line and one literal `.skip`. Cut two added a closed
 * allowlist but read PHYSICAL lines, so the same spellings walked back in with a newline
 * inside them. Cut three welded a dangling head, but its head detector and its opener
 * detector shared a character class, so `describe[` ending a line was invisible to both.
 * Cut four stated a POLARITY instead of a reach — and was falsified on its own stated
 * falsifier by NINE executed credited-non-running suites in three classes: a leading
 * block comment on the opener line, a computed or destructured alias binding, and any
 * line prefix outside the three-character class the mid-line arm enumerated. The root
 * cause was structural and not three misses: admission was `^\s*`-anchored and narrow
 * while the DEFAULT was credit, which is the opposite polarity from the one the header
 * claimed.
 *
 * THE FIFTH CUT STOPS READING TEXT. Every test file is PARSED with `espree` — eslint's
 * own parser, which this repository already declares as a direct dependency and already
 * uses for three other AST walkers — and every verdict is taken from the syntax tree:
 *
 *   • A SUITE is any CallExpression whose callee chain ROOTS in a suite word. Dotted,
 *     computed, comment-interrupted, line-broken, parenthesised, prefixed by `void` or
 *     `await` or `&&` — the parser makes all of these ONE shape, so there is no spelling
 *     left to enumerate and none left to miss. Comments and line breaks cease to exist.
 *   • CREDIT is a CLOSED GRAMMAR of AST shapes (`RUNNING_SUITE_MODIFIERS`), stated below
 *     and MEASURED against vitest 4.1.8 rather than assumed.
 *   • PARK is the DEFAULT. Any other suite-rooted callee shape, and any Identifier
 *     reference to a suite word outside a credited call and off the two-entry credit-back
 *     list, park the file whole. A BINDING IS NOT ITSELF A PARK — see the sixth statement
 *     below, which is where the fifth cut's stated polarity was WRONG and said so in two
 *     places at once.
 *   • A FILE THAT FAILS TO PARSE PARKS WHOLE. Fail-closed at the parser door.
 *   • ENUMERATION SURVIVES ONLY ON THE CREDIT SIDE, which is the side that was always
 *     closed: the running grammars, and an explicit CREDIT-BACK LIST of two benign
 *     reference positions (a `vitest` import specifier; a bare suite value assigned to a
 *     member target, which is how four estate files wire eslint's RuleTester). Each is
 *     pinned individually, and each has an executed mutant below.
 *
 * ── DOOR 3, SIXTH STATEMENT: THE SEMANTIC LAYER ────────────────────────────────
 * THE FIFTH CUT'S LEXICAL LAYER HELD COMPLETELY AND IS UNCHANGED BELOW. The proving lane
 * drove 39 shipped battery entries plus 20 newly invented spellings — unicode-escaped
 * identifiers AND properties, optional chaining computed and dotted, U+2028 inside the
 * chain, two bidi/trojan-source comments (one whose comment reads `.concurrent` while the
 * code says `.skip`), `.bind` re-heads, comma-expression heads, hashbangs, ASI splits,
 * tagged-template heads, class static blocks, `Reflect.apply` re-heads — and every one
 * parked or fail-parse-parked. All 59 are pinned below. Inventing a SPELLING cannot
 * falsify this door, and that half of the fifth cut's claim survived intact.
 *
 * INVENTING A BINDING COULD, and did, in one line. THREE SEMANTIC HOLES WERE EXECUTED
 * against the fifth cut and all three are closed here:
 *
 *   B1 — THE SHADOW-SWALLOW. The suite loop skipped every call whose root word was BOUND
 *     *before* it pushed `SUITE_NOT_RUNNING`, so a bound suite word was not opaque, it was
 *     MUTE: it DELETED the park for every non-running suite opened through it.
 *     `import * as V from 'vitest'; const { describe, it } = V; describe.skip(…)` around
 *     the live marker read SATISFIED / satisfiable true / missing [] off a file vitest
 *     reported as `1 skipped`. The skip is now conditioned on the call being in the RUNNING
 *     grammar, where `SUITE_SHADOW_AMBIGUOUS` already speaks. Cost, MEASURED: one estate
 *     file, tests/edgeFunctions/contracts.test.js, whose `for (const suite of …)` loop
 *     variable is a STRING and whose `suite.replace(…)` is a suite-rooted non-running call.
 *   B2 — TEST-WORD BINDINGS WERE NOT TRACKED AT ALL. `markShadowed` and the non-vitest
 *     import clause both keyed on SUITE_ROOTS, so `function it(name, fn) {}` — a no-op
 *     shadow that registers nothing — kept full title credit beside a real `describe`, and
 *     the file ran green. Both families were made to shadow. Cost: 25 estate files. (The
 *     shadow set itself is RETIRED at the ninth statement — the hole it closed is now closed
 *     by resolution instead, and those same 25 files park on `OPENER_UNRESOLVED`.)
 *   B3 — REACHABILITY, named nowhere before. A real vitest `it`, squarely inside the
 *     running grammar, that is never invoked: `function never() { it(…) }`,
 *     `cases.forEach((c) => it(…))`, `if (false) { it(…) }`, `for (…) { it(…) }`. All were
 *     credited; vitest registered none. Registration is now STATIC — a direct statement of
 *     the module body, or of the block a credited suite opens, recursively. Dynamic
 *     registration is statically undecidable, so it parks: the cost of parking is a
 *     reformat to `it.each`, which IS in the running grammar, and the cost of crediting is
 *     a lie. Cost: 121 estate files, ENUMERATED in the landing commit as reformat debt.
 *
 * ── DOOR 3, SEVENTH STATEMENT: RUN-CONTROL OUTSIDE THE CALLEE CHAIN ────────────
 * THE SIXTH CUT'S STATED FALSIFIER WAS MET, TWICE, BY THE ADVERSARIAL ENDGAME — and both
 * times through a channel the header did not know it was ignoring. Neither was a spelling and
 * neither was a binding: the walker read the CALLEE CHAIN and nothing else, while vitest 4
 * takes run-control from other places too, and both of these sat squarely inside
 * "statically-proven registration under an unbound running grammar". That is why the sixth
 * cut's sentence DESCRIBED its mechanism correctly and still did not close the door.
 *
 *   L1 — THE OPTIONS ARGUMENT. `{ skip | only | todo | fails | concurrent }` in position two
 *     is `.skip`/`.only`/`.todo`/`.fails`/`.concurrent` expressed as DATA, which no chain
 *     reader can see. Executed under 4.1.8: `it(n, { skip: true }, fn)` → `↓ skipped`;
 *     `{ todo: true }` → `□ todo`; a bagged `describe` skipped its whole block; `{ only: true }`
 *     left its SAME-FILE SIBLING `↓ skipped` while this walker credited the sibling's title.
 *     THE SAME PREDICATE CLOSES THE ABSENT BODY — `it('x')` is a todo and `describe('x')`
 *     registers nothing, both executed, both credited before. CREDIT NOW REQUIRES ARGUMENT
 *     TWO TO BE A FUNCTION EXPRESSION. Estate cost, measured over all 2,314 files: ZERO.
 *   L2 — THE TABLE'S CARDINALITY. `each`/`for` are in both running grammars and the grammar
 *     asks only that the returned function be CALLED, never that the table have rows.
 *     Executed: `describe.each([])(…)` and `it.each([])(…)` registered ZERO tests beside a
 *     passing anchor, silently, exit 0. A TABLE IS CREDITED ONLY AS A NON-EMPTY ARRAY LITERAL
 *     WITH STATICALLY PRESENT ELEMENTS. Estate cost, measured: 61 credited files park.
 *
 * ── DOOR 3, EIGHTH STATEMENT: THE BODY AND THE BLOCK, AND WHY THE CLAIM MOVED ──
 * THE SEVENTH CUT'S STATED FALSIFIER WAS MET AGAIN, AND TWICE MORE, in a category its list had
 * no row for. Every channel the first seven cuts closed is a property of the CALL — its callee,
 * its arguments, its table. These two are not properties of the call at all:
 *
 *   G1 — THE BODY'S OWN CONTEXT. vitest hands every callback a TestContext and `ctx.skip()`
 *     cancels the test from INSIDE it. EXECUTED under 4.1.8 beside a green anchor:
 *     `it('MARKER', ({ skip }) => { skip(); throw new Error('THIS RAN'); })` reported
 *     `↓ MARKER 0ms`, exit 0, the throw never fired — and the seventh cut credited the title
 *     with `reasons=[]`, reading `SATISFIED / satisfiable true / missing []` off the SHIPPED
 *     evaluator. `beforeEach(({ skip }) => skip())` does the same to every test in a suite.
 *     CREDIT IS NOW FOR CONTEXT-FREE CALLBACKS ONLY — see `contextFreeCallback`.
 *     Estate cost, MEASURED: 47 files, 51 by reason kind. ENUMERATED in the landing commit.
 *   G2 — THE BLOCK'S OWN REACHABILITY. `markRegistered` was POSITIONAL, so a statement after a
 *     `return` in a credited suite's block was still "a direct statement of that block".
 *     EXECUTED: a suite holding one real anchor, then `if (!GATE) return;`, then the marker,
 *     registered NO ROW for the marker at all, exit 0, silently — and the seventh cut credited
 *     it. The same suite WITHOUT the anchor reds loudly (`No test found in suite`), which is
 *     why seven cuts never met this. A CREDITED SUITE'S BLOCK MUST NOW BE STRAIGHT-LINE
 *     REGISTRATION — see `straightLineBlock`. Estate cost, MEASURED: 9 files newly parked,
 *     135 by reason kind. ENUMERATED in the landing commit.
 *
 * ── DOOR 3, NINTH STATEMENT: THE BINDING, AND THE LAST ENUMERATION IS GONE ─────
 * THE EIGHTH CUT'S STATED FALSIFIER WAS MET — by a construct that is not a property of the
 * call, nor of its arguments, nor of its body or block, but of the MODULE'S OWN BINDING
 * STRUCTURE. `import { expect as it } from 'vitest';` rebinds an opener word to a non-opener
 * vitest export. The eighth cut's shadow clause keyed on the module SOURCE and never on
 * whether a specifier's local name equalled its imported one, so the rebind never became
 * opaque and the call through it was credited with `reasons=[]` — the shipped evaluator
 * reading `SATISFIED / satisfiable true / missing []` off the REAL marker while vitest 4.1.8
 * registered NO ROW and a deliberate throw never fired. `expect as describe` forged TWO titles
 * from one line, because `creditedSuiteBody` handed registration through the aliased word.
 *
 * THAT IS THE FIFTH CHANNEL THE EIGHTH CUT PREDICTED, AND IT ARRIVED WHERE THAT CUT SAID IT
 * COULD NOT. Its header called its binding list "a declaration, a parameter, a destructure, a
 * catch binding, a function name, a non-vitest import" and argued that enumeration was safe
 * BECAUSE it sat on the credit side, "the side that was always closed". It was an ENUMERATION
 * ON THE CREDIT SIDE THAT FAILED OPEN. The lesson is the one this file keeps re-learning at a
 * cost: an enumeration is unsafe on whichever side it decides credit, and which side that is
 * cannot be read off the polarity of the surrounding sentence.
 *
 * SO THE LAST ENUMERATION IS RETIRED AND REPLACED BY A TOTAL PREDICATE. A callee is credited
 * only where it RESOLVES, through the module's own bindings, to a vitest export whose IMPORTED
 * name — never its local alias — is in the running grammar. Resolution succeeds for a named
 * import read by its imported name, and for a namespace member whose member name is the
 * imported name; it succeeds for nothing else, and a RESERVED word that resolves to anything
 * but itself parks the file. There is no third state for a new spelling to occupy: "bound by
 * something else", "bound twice", "not bound at all" and "bound to a different vitest export"
 * are not rows on a list, they are simply the ways a total function fails to return an opener.
 * The machinery this deletes is named in `bindingsOf`, and the estate cost is ZERO — measured
 * file-for-file, title-set for title-set, against the eighth cut.
 *
 * ── DOOR 3, TENTH STATEMENT AND **THE CAP**: THE TITLE'S OWN LAYER, AND THE ADDRESS ──
 * THE NINTH CUT'S STATED FALSIFIER — "a credited file whose opener does not so resolve, or which
 * is outside that grammar" — WAS NOT MET, AND THAT IS THE FINDING. The adversary produced a
 * credited-non-running forgery that lives ENTIRELY INSIDE the grammar: its `describe` resolves
 * through the module's own bindings to vitest's `describe` by that export's own name, the call
 * is straight-line, context-free, statically registered and function-bodied. Every clause of the
 * ninth cut's sentence is TRUE of it. It forges anyway, because the sentence had stopped being
 * about evidence:
 *
 *   T1 — THE SUITE TITLE, BACKED BY NOTHING. `titleArgs` was called into ONE `titles` array from
 *     both the suite loop and the test loop, so `filesTitling`/`titledIn`/`measure` read a
 *     `describe` title exactly as they read an `it` title. EXECUTED AT ALL THREE LAYERS against
 *     the ninth cut: the source
 *       `import { describe, it } from 'vitest';`
 *       `describe('ES-4-DISTANT-SOURCE-EVIDENCE — the espionage confirmer lane', () => {`
 *       `  it.skip('the pin that never runs', () => { throw new Error('THIS RAN'); });`
 *       `});`
 *     classified `{"reasons":[],"titles":["ES-4-DISTANT-SOURCE-EVIDENCE — …"]}`; the SHIPPED
 *     evaluator, driven through the real `measure` with the real `SOVEREIGNTY_LIGHTING_EVIDENCE`
 *     row, read `SATISFIED / satisfiable true / missing []`; and vitest 4.1.8 in a `git archive`
 *     tree reported `↓ … > the pin that never runs`, `Tests 1 passed | 1 skipped (2)`, exit 0,
 *     `grep -c 'THIS RAN'` = 0, with `vitest list --json` collecting NO runnable test for the
 *     file at all. WITH A LIVE SIBLING SUITE ABOVE IT THE FILE IS INDISTINGUISHABLE FROM A
 *     HEALTHY ONE — `Test Files 1 passed (1)`, exit 0 — because the empty-suite case that WOULD
 *     red loudly (`No test found in suite`) is exactly the case the sibling removes. That is the
 *     same mistake-versus-forgery line the zero-row table (L2) and the early return (G2) drew.
 *     EIGHT SPELLINGS of the family were measured and every one classified `reasons=[]` while
 *     carrying the marker in `titles`: `it.skip` under a marker suite; `it.todo('x', fn)` with a
 *     body; `it.skipIf(!gate)` — THE LIVE ESTATE SHAPE; `it.runIf(gate)`; `it.fails`, which runs
 *     only to prove a throw and which door 2 explicitly refuses one level down; a nested suite
 *     whose inner tests are all skipped; `describe.each([1])('MARKER — %s', …)` over skipped
 *     rows; and the marker suite beside a live sibling.
 *     THE ASYMMETRY WAS THIS FILE'S OWN, AND DELIBERATE ONE LEVEL DOWN. `NON_FOCUSING_TEST_
 *     MODIFIERS` lets `it.skip` cost only its OWN title while the file keeps the rest — correct
 *     at test level, and pinned since the first cut (`DOOR 2 REFUSES: a parked pin proves as
 *     little as a comment does`). At SUITE level there was no matching rule, so door 2's own
 *     principle was defeated by moving the marker up one line.
 *     THE FIX IS THE LAYER SPLIT: `suiteTitles` is parsed and kept, `titles` is test-only, and
 *     `measure` joins against `titles` alone. EVIDENCE IS TEST TITLES ONLY. This restores the
 *     instrument's own original spec — the row's `kind` is `TEST_MARKER` and its `why` names a
 *     PIN — which every cut of this door had quietly widened.
 *     THE LIVE ESTATE INSTANCE, DISPOSITIONED RATHER THAN LEFT TO BE FOUND:
 *     tests/build/prerenderRoutes.test.js opens `describe('prerender — dist walk (the emitted
 *     files carry their own truth)', …)` whose four tests are ALL `it.skipIf(!requireDistRead)`.
 *     The ninth cut credited that suite title with `reasons=[]` while `vitest list` collects
 *     twelve runnable tests for the file and NOT ONE lies under that suite. It was the ONLY such
 *     divergence in the whole estate. Its suite title was never a marker and the file is not a
 *     declared evidence address, so the TREE READING IS UNCHANGED by this cut — MEASURED both
 *     ways, and the census figures below are the receipt.
 *
 *   T2 — THE ADDRESS, WHICH IS WHY THIS IS A CAP AND NOT AN ELEVENTH CUT. Ten rounds narrowed
 *     WHICH SHAPES inside an ARBITRARY file may carry a marker, and ten times an adversary found
 *     a shape the standing sentence had no row for. The surface kept outrunning the parse rule
 *     and each cut bought a narrower sentence. So the open address is RETIRED ON PURPOSE:
 *     a marker is evidence only in one of the three literal paths in `EVIDENCE_FILE_ADDRESSES`.
 *     With the address designated, the whole title-surface question is MOOT for every other file
 *     in the estate — no `describe`/`it` shape, no grammar, no binding, no options bag and no
 *     block reachability sits between a marker and the measurement anywhere else, because
 *     nowhere else is read. EVERYTHING THE PARSE LAYER LEARNED IS KEPT AND STAYS EXECUTED: it is
 *     what decides whether the pin AT the declared address really runs, and the battery is what
 *     stops it rotting. It simply stops being the only thing standing between a comment in an
 *     arbitrary file and a lit wave.
 *
 * ── THE STANDING AUDIT: `vitest list --json`, THE FRAMEWORK'S OWN GROUND TRUTH ──
 * THE ORACLE THAT FOUND T1, RECORDED AS THE AUDITOR'S METHOD RATHER THAN RE-DERIVED NEXT TIME.
 * vitest can be asked what it will RUN, without running it, and that answer is not a claim this
 * file makes about vitest — it is vitest's:
 *
 *     npx vitest list --json=<ABSOLUTE OUT PATH> [<file filter> …]
 *
 * ⚠ THE SPELLING IS LOAD-BEARING AND MIS-SPELLING IT DESTROYS A FILE. `--json` takes an OPTIONAL
 * VALUE, so the bare `--json <path>` form consumes the NEXT POSITIONAL as the OUTPUT path and
 * OVERWRITES it. Executed by this lane on 2026-08-06: `npx vitest list --json
 * tests/domain/sovereigntyMarketStageWr10w.test.js tests/domain/sovereigntyWaveCloseIntegration.
 * test.js` truncated SP-B2's own evidence file from 836 lines to 41 lines of JSON, silently and
 * exit 0. It was restored from `git show HEAD:<path>` and verified `cmp`-clean. ALWAYS write
 * `--json=<path>`, and always to a path outside the repository.
 *
 * THE RECONCILIATION, AS THE ADVERSARY EXECUTED IT AND AS THE NEXT AUDITOR SHOULD: collect the
 * oracle over the estate, then check EVERY title this walker credits, in every file it credits,
 * against the set of tests vitest reports it will run, by substring containment with
 * format-specifier heads handled. At the ninth cut that was 23,676 credited titles across 1,957
 * credited files, and it yielded EXACTLY ONE divergence — the prerenderRoutes suite title above.
 * ZERO credited TEST titles failed to run: the test-level rule is empirically sound across the
 * whole estate and the defect was confined to the suite-title surface, which is precisely why
 * T1's remedy is a LAYER SPLIT and not another grammar clause. Two files are dropped from such a
 * collection because they need a git repo a `git archive` tree lacks
 * (tests/ops/migrationRehearsal.test.js and tests/security/committedSecretsScan.test.js), and
 * `vitest list --filesOnly --json=<path>` collects exactly the same 2,314 files this walker
 * scans — measured, which is what shuts the file-pattern half of residual (a5).
 *
 * WHY THE ORACLE IS DOCUMENTED HERE AND NOT LANDED AS A TEST, MEASURED RATHER THAN ASSERTED.
 * Collecting the oracle over ONLY the two BUILT declared addresses costs 2.61s wall — against
 * this walker file's own whole-file vitest Duration of 2.58s. It would more than double the
 * instrument's runtime to re-derive a fact that does not change between commits, and it would do
 * it by SPAWNING A SECOND VITEST LANE INSIDE A RUNNING ONE, which this program forbids outright
 * (one vitest lane per tree). So the method is banked here, executed once at this landing:
 * `vitest list` collects 31 runnable tests in tests/domain/sovereigntyMarketStageWr10w.test.js
 * and 10 in tests/domain/sovereigntyWaveCloseIntegration.test.js, and this walker's TEST titles
 * for those files number exactly 31 and 10 — an EXACT agreement that did not hold before the
 * layer split, when the same files read 41 and 11 because their 10 and 1 SUITE titles were
 * counted as evidence. That +11 is T1 measured on the only two files the cap admits.
 *
 * ── THE TERMINAL CLAIM, IN ADDRESS-AND-LAYER TERMS ─────────────────────────────
 * THIS WALKER TREATS A MARKER AS EVIDENCE ONLY WHERE IT STANDS IN THE STATIC TITLE OF A **TEST**
 * CALL — NEVER A SUITE — IN A FILE AT ONE OF THE THREE DECLARED ADDRESSES, WHERE THAT CALL'S
 * CALLEE RESOLVES THROUGH THE MODULE'S OWN BINDING STRUCTURE TO A VITEST OPENER NAMED BY ITS
 * IMPORTED NAME AND IS STRAIGHT-LINE, CONTEXT-FREE AND STATICALLY REGISTERED UNDER THE CLOSED
 * CALL GRAMMAR. THE STANDING FALSIFIER IS A MARKER THAT LIGHTS A WAVE FROM ANYWHERE ELSE.
 *
 * AND THAT FALSIFIER IS NOW AUDITABLE BY READING THREE FILES, WHICH IS THE WHOLE POINT OF THE
 * CAP. Every earlier terminal sentence quantified over an open surface — first over VITEST (four
 * cuts, four channels the list had no row for: the options bag, the table's cardinality, the
 * body's context, the block's reachability), then over THIS WALKER'S grammar (the ninth cut,
 * which survived by narrowing until it was a claim about parsing rather than about evidence, and
 * the tenth statement's T1 is what that narrowing cost). A claim about vitest's surface is one
 * this file has no way to verify and every reason to get wrong, and under J-WR-13 stating one is
 * an overstatement whether or not it happens to be true this week. A claim about a THREE-FILE
 * address is one a reader can settle by opening them.
 *
 * THE SIX CHANNELS THAT TAUGHT THE GRAMMAR ITS SHAPE, kept as record and NOT as an inventory
 * anyone should read as complete: the BINDING (§ the ninth statement, a positive resolution),
 * the CALLEE CHAIN (a closed running grammar, § the fifth and sixth statements), the SECOND
 * ARGUMENT (L1, a function body and no options bag), the TABLE'S CARDINALITY (L2, a non-empty
 * array literal), the CALLBACK'S BODY AND ITS BLOCK (G1/G2, context-free and straight-line),
 * and — the one that closed the file — THE TITLE'S OWN LAYER (T1, a suite title is not a test
 * title). Each was found by an adversary AFTER a cut of this file declared the previous list
 * complete, WHICH IS THE ARGUMENT FOR THE CAP AND NOT MERELY A HISTORY OF IT. The sixth channel
 * the ninth statement said "may well exist" arrived one round later, in the one place ten cuts
 * had never looked; a seventh is to be expected on exactly the same evidence. The answer is no
 * longer a narrower sentence about shapes — it is that only three files are read at all
 * (§ the tenth statement, T2), so a seventh channel costs a title in a declared home rather
 * than lighting a wave from anywhere in tests/.
 *
 * THE RESIDUALS, NAMED AND NOT CLAIMED AWAY.
 * (a) `test.extend({})` — vitest's first-class fixture API, EXECUTED under 4.1.8 and it
 *     RUNS, while this walker parks the whole file on `TEST_UNCLASSIFIED:test.extend`. That
 *     is the correct DIRECTION (a title cost, never a credit) but it is a real cost, and it
 *     is named here rather than left to be discovered by the first fixture-using suite to
 *     lose its titles. Zero estate instances today, measured. `describe.skipIf(false)` and
 *     `it.runIf(true)` are the same shape and the same deliberate refusal.
 * (a2) THE RUN-TIME-EMPTY TABLE, the residual L2 leaves and does not claim away. A NON-LITERAL
 *     table that evaluates empty at run time (`it.each(rows)` where `rows` is `[]`) registers
 *     nothing, exactly as `[]` does, and no static reader can tell. L2 refuses the whole
 *     non-literal class rather than pretending to measure it, so this residual costs titles
 *     rather than buying credit — but it is the J-ES-4-F family by another route, and it is
 *     listed HERE rather than counted as closed. Its price is 61 estate files of reformat
 *     debt, enumerated in the landing commit; the reformat is an inline literal table.
 * (a3) THE THIRD-POSITIONAL BAG IS NOT A RESIDUAL AND IS RECORDED SO NOBODY RE-OPENS IT:
 *     `it(n, fn, { skip: true })` THROWS under 4.1.8 (`Signature "test(name, fn, { ... })"
 *     was deprecated in Vitest 3 and removed in Vitest 4`, executed), so it cannot forge —
 *     a source that cannot run at all cannot lie about running. It is credited, correctly.
 *     THE SAME HOLDS AT SUITE LEVEL, measured by the endgame and recorded here because the
 *     seventh cut's version of this sentence said only `it`: `describe(name, fn, { skip: true })`
 *     throws the SAME removed-signature TypeError.
 * (a4) `skip()` REACHED THROUGH A HELPER, which is the J-ES-4-F factory route at BODY level and
 *     is the honest limit of G1. G1 refuses every callback that DECLARES a parameter, so the
 *     context cannot be named; a helper that closes over a context obtained some other way, or
 *     a call like `cancel(this)` in a non-arrow body, is not reachable by a reader that does not
 *     execute the file. The VISIBLE form is refused and the INDIRECT form is named, which is the
 *     shape the fifth cut used for the alias half and the right one here.
 * (a5) CONFIG-DRIVEN FILTERING. `tags` / `tagsFilter` / `testNamePattern` are real run-control in
 *     4.1.8's `VitestRunnerConfig` and none of them is expressible in a test file alone; this
 *     repository sets none of them (measured). It is listed NOW rather than after it bites,
 *     because the day a tags filter is configured, a credited title may stop running for a
 *     reason no reader of a single file can see.
 * (a6) VERIFIED AND NOT A HOLE — executed by the endgame, kept because these cost a lane the same
 *     hunt: `aroundEach`/`aroundAll` that never call their continuation throw
 *     `AroundHookSetupError`; `this.skip()` throws `Cannot read properties of undefined`;
 *     `beforeAll((ctx) => …)` throws `FixtureParseError`; `it.each([1,2])('…', (n, { skip }) => …)`
 *     throws on the destructure. None of these forges. G1 parks the first four anyway, on the
 *     parameter rather than on the throw, which is the cheaper thing to state.
 *     ONE SENTENCE THAT USED TO SIT HERE WAS FALSE AND IS CORRECTED RATHER THAN DELETED, because
 *     the correction is the useful part. The seventh cut wrote that an `async` `describe`
 *     callback IS awaited, so `describe('x', async () => { await …; it('MARKER', fn); })`
 *     "genuinely RUNS and this walker credits it correctly". It no longer credits it: G2 landed
 *     in the EIGHTH cut and that exact spelling now PARKS — executed,
 *     `reasons=["TEST_UNREGISTERED:it","SUITE_NOT_STRAIGHT_LINE:describe"]` — because a bare
 *     `await setup();` is an ExpressionStatement wrapping an AwaitExpression, and
 *     `straightLineBlock` admits only calls, plain declarations and empty statements. The vitest
 *     half of the sentence is still true and the walker half was stale for a whole cut: the
 *     DIRECTION is safe (a title cost, never a credit), and an async suite callback with no
 *     `await` STATEMENT is credited as before. A file that needs the await should hold it inside
 *     a hook or a test body, where it is not a registration decision.
 * (b) THE FACTORY ROUTE (J-ES-4-F), NARROWED BY THE NINTH STATEMENT AND STILL OPEN AT ITS CORE.
 *     A suite word that reaches its call site through a value this file cannot follow — a
 *     helper module's export, an object property, a function return — is invisible to a reader
 *     that does not EXECUTE the file. THE ALIAS HALF IS NOW CLOSED AT THE BINDING RATHER THAN
 *     AROUND IT, which is what the fifth and eighth cuts each got wrong in their own direction:
 *     an aliased or rebound opener does not RESOLVE, so the call through it parks as
 *     `OPENER_UNRESOLVED` on the spot, and there is no longer any need to argue that the
 *     reference rules happen to catch it. A binding on its own still parks nothing, and must
 *     not — one estate file names a loop variable `suite` and opens no suite at all.
 *     THE FACTORY HALF IS NOT CLOSED and no prevalence figure is claimed for it, because
 *     prevalence is exactly what a static reader cannot measure there: a value taken from a
 *     resolved opener and passed onward (`const d = describe; d('x', fn)`) is refused, but a
 *     value that arrives from another MODULE cannot be followed at all. What resolution buys is
 *     that such a value can never be MISTAKEN for vitest's own — it simply is not an opener
 *     here, so nothing it opens is credited. Two estate files spell
 *     `RuleTester.itOnly = it.only`, which is that shape at TEST level; it is inert here because
 *     no estate RuleTester case sets `only: true` (measured, zero occurrences), and it is
 *     recorded rather than smoothed.
 * (b2) THE REFERENCE RULE IS STILL SUITE-ONLY, AND THAT ASYMMETRY IS DELIBERATE RATHER THAN AN
 *     OVERSIGHT. `SUITE_REF` parks a file that mentions a resolved suite opener outside a
 *     classified call; there is no `TEST_REF`. Widening it to test words would park the two
 *     `RuleTester.itOnly = it.only` files above for a shape measured inert, which is a cost with
 *     no matching risk — a bare `it` handed to a helper cannot silence a sibling the way a bare
 *     `describe` can hide a whole block. It is named here so that the next cut widens it on
 *     purpose or leaves it on purpose, rather than discovering it.
 *
 * ── THE DOC CLAUSE ES-4 IS OWED, ADDRESSED BY SENTENCE AND NOT BY LINE ──────────
 * Two documents tell the ES-4 builder to keep the marker stable and to "put it in the test
 * NAME rather than a comment": docs/DESIGN_FP_ARCH_ES.md, in the paragraph whose VERIFY-AT-
 * BUILD step resolves to this walker, and docs/DESIGN_FP_ARCH_SP.md, in the paragraph that
 * mints `SOVEREIGNTY_LIGHTING_EVIDENCE`. Both are addressed by their SENTENCE here rather
 * than by a line number, because hand-keyed line addresses rot — the sixth cut's landing
 * commit recorded one of them ~256 lines from where it actually sits, and the endgame caught
 * it. THAT SENTENCE IS NO LONGER SUFFICIENT AND NEEDS NINE CLAUSES, one per closed hole, and
 * the NINE IS THIS WALKER'S COUNT rather than a claim about how many ways vitest can park a
 * test. The ES-4 pin must sit in a title
 *   (0) IN THE FILE `tests/domain/espionageDistantSourceEs4.test.js` — ES-4's DECLARED evidence
 *       address, listed in `EVIDENCE_FILE_ADDRESSES`. A pin in any other file carries the token
 *       and lights nothing. If ES-4 needs a different filename, edit that list in the same
 *       commit and re-measure the census; do not move the marker (§ the tenth statement, T2),
 *   (0b) IN A **TEST** TITLE AND NOT A SUITE TITLE — `it('ES-4-…', () => {…})`, never
 *       `describe('ES-4-…', …)`. A suite title is parsed, kept in `suiteTitles`, and joined
 *       against by nothing, because a suite registers no test of its own and every test under it
 *       may be skipped while the file stays green (§ the tenth statement, T1),
 *       imported from 'vitest' and NOT renamed to or from another export, not destructured off
 *       a namespace, not taken from a shim, not bound anywhere else in the file, and not left
 *       to a global (§ the ninth statement),
 *   (2) at a STATICALLY REGISTERED position — a direct statement of the module body or of a
 *       credited suite's block (B3),
 *   (3) in a block that is STRAIGHT-LINE registration, with no `return`, `throw`, conditional,
 *       loop or bare `await` STATEMENT anywhere in it (G2),
 *   (4) with a FUNCTION BODY in argument two and NO options bag (L1),
 *   (5) whose callback takes NO PARAMETERS — no context, no destructured `{ skip }`, no table
 *       row (G1),
 *   (6) and, if it is table-driven, off a NON-EMPTY ARRAY LITERAL (L2),
 *   (7) in a file whose OTHER suites and tests also satisfy all of the above, because every
 *       refusal in this walker is FILE-SCOPED — one rebound word or one focused sibling costs
 *       the whole file its titles, the marker's included.
 * A pin that misses any of the nine carries the token, does not run or cannot be proven to run,
 * and does not light the wave. THE SHORTEST PIN THAT SATISFIES ALL NINE IS THE PLAIN ONE, in
 * `tests/domain/espionageDistantSourceEs4.test.js`:
 * `import { describe, it } from 'vitest';` — plainly, with no `as` on either opener — and then
 * `it('ES-4-…-EVIDENCE — …', () => { … });` at the top level of the file, or in a suite whose
 * block holds nothing but calls and declarations. That import is the ordinary first line of
 * every one of the estate's 2,314 test files, so clause (1) costs a new pin nothing; it is
 * spelled out only because the eighth cut credited a pin whose `it` was vitest's `expect`.
 * The doc edit is out of this commit's pathspec
 * by the chair's ONE-COMMIT scope and both files are read by three other walkers, so it is
 * recorded here — where the ES-4 builder is already reading — rather than left to be discovered.
 *
 * ── WHAT THIS FILE DELIBERATELY IS NOT ──────────────────────────────────────────
 * It is not a second gate scanner. `ENGINE_GATED_VIRTUAL_RULE_KEYS` is the estate's own
 * register of virtual keys that have a real gate — the CQ5 one-commit law puts a key
 * there in the SAME commit as its first gate read — so joining against it is an exact
 * mechanical read of build state that costs no new machinery. The trade sibling's R6
 * repair is the precedent, and its lesson is the reason no row here declares its own
 * build state: a table that asserts what it is supposed to be measuring can only ever
 * agree with itself.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { parse } from 'espree';
import { describe, expect, test } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import {
  SOVEREIGNTY_LIGHTING_EVIDENCE,
  SOVEREIGNTY_LIGHTING_FLAG,
  SOVEREIGNTY_LIGHTING_STATES,
  WAR_RULINGS_FLAG_KEYS,
  evaluateSovereigntyLighting,
} from '../../src/domain/certification/warConvergenceContract.js';
import { ENGINE_GATED_VIRTUAL_RULE_KEYS } from '../../src/domain/worldPulse/simulationRules.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Every test file in the estate, read once. The marker addresses are measured here. */
const TEST_FILES = walk(join(ROOT, 'tests'))
  .filter((p) => /\.test\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }))
  .sort((a, b) => a.rel.localeCompare(b.rel));

/** This walker's own address — door 4, and the one file that may never be a carrier. */
const SELF_REL = 'tests/lint/sovereigntyLightingContract.walker.test.js';

/**
 * THE PARSER DOOR. These options are eslint.config.js's base `languageOptions` spelled
 * back: `ecmaVersion: 'latest'`, `sourceType: 'module'`, `ecmaFeatures.jsx`. That parity is
 * the reason espree was chosen over acorn — both are direct dependencies of this
 * repository, but espree IS eslint's parser, so a file the estate's lint gate can read is a
 * file this walker can read, and a file this walker cannot parse could not have passed
 * lint. `range` is on because a title's source offset is what puts the titles of one file
 * into source order.
 */
const PARSE_OPTIONS = Object.freeze({
  ecmaVersion: 'latest',
  sourceType: 'module',
  ecmaFeatures: { jsx: true },
  range: true,
});

/** The two words vitest really exports as suite openers. `suite` is measured, not assumed. */
const SUITE_WORDS = Object.freeze(['describe', 'suite']);
/** The two it exports as test openers. */
const TEST_WORDS = Object.freeze(['it', 'test']);
/**
 * …and the jest-compat prefixes, which vitest neither exports nor globals. They are RESERVED
 * WORDS rather than openers: nothing can ever resolve to them, so a call rooted in one of
 * these can never be credited, and — under the ninth statement's rule — it PARKS THE FILE.
 */
const SUITE_ROOTS = new Set([...SUITE_WORDS, 'xdescribe', 'fdescribe', 'xsuite', 'fsuite']);
const TEST_ROOTS = new Set([...TEST_WORDS, 'xit', 'fit', 'xtest', 'ftest']);

/**
 * DOOR 3's RUNNING GRAMMAR — the ONLY suite modifiers read as running, MEASURED against
 * vitest 4.1.8 in a git-archive tree rather than taken from documentation. Each of these
 * ran its block unconditionally (`describe.concurrent`, `.sequential`, `.shuffle`,
 * `.each([1])(…)`, `.for([1])(…)` all reported a passing leaf; bare `describe(` and bare
 * `suite(` likewise).
 *
 * `only` is deliberately ABSENT even though its own block runs, and that is a measurement
 * too: in the same archive `describe.only` in one file left its SAME-FILE sibling reported
 * `↓ skipped` while a NEIGHBOURING file ran whole. Focus is therefore a FILE-scope fact,
 * exactly as a parked suite is, so a file that focuses anything is a parked file by another
 * route. `runIf`/`skipIf` are absent because their argument is evaluated at run time —
 * measured both ways, `runIf(true)` ran and `runIf(false)` skipped — and this walker reads
 * a syntax tree, not a run.
 */
const RUNNING_SUITE_MODIFIERS = Object.freeze(['concurrent', 'sequential', 'shuffle', 'each', 'for']);

/**
 * DOOR 2's RUNNING GRAMMAR, the same idea one level in. Measured in the same archive:
 * `it.concurrent`, `it.sequential`, `it.each([1])(…)`, `it.for([1])(…)` all passed.
 */
const RUNNING_TEST_MODIFIERS = Object.freeze(['concurrent', 'sequential', 'each', 'for']);

/**
 * THE KNOWN NON-FOCUSING TEST MODIFIERS — a test that does not run and does not silence
 * its siblings. Its own title is refused (door 2) while the file keeps its other titles,
 * because a skipped test proves nothing about itself and nothing about its neighbours.
 * Measured: `.skip` and `.skipIf(true)` reported `↓ skipped`, `.todo` reported a todo, and
 * `.fails` RAN its body and reported `1 expected fail` — running, but running to prove a
 * throw, so it is refused as evidence rather than credited. `.failing` IS NOT A VITEST
 * MODIFIER AT ALL in 4.1.8 (`TypeError: it.failing is not a function`, executed); it is
 * kept here as defence in depth against a jest-compat shim, and the file it appears in
 * would die loudly rather than forge anything.
 *
 * THIS LIST IS AN ENUMERATION AND IT IS ON THE SAFE SIDE OF THE POLARITY — WITHIN ITS OWN
 * CHANNEL, WHICH IS THE CLAUSE THE SIXTH CUT DID NOT WRITE AND WAS FALSIFIED FOR. Anything
 * rooted in a test word whose CALLEE CHAIN is outside both grammars parks the file whole, so
 * a chained modifier nobody has thought of costs a file its titles rather than buying one
 * credit. That sentence was stated WITHOUT the chain qualifier and was FALSE as stated: a
 * modifier expressed in the second-positional OPTIONS OBJECT is not in the chain at all, so
 * it bought a credit rather than costing one — `it(n, { skip: true }, fn)` was credited while
 * vitest reported `↓ skipped` (executed). The options argument is now its own refusal
 * (`argFormAccepts`, L1), the table's cardinality is a third (`tableProven`, L2), and the
 * callback's own context is a fourth (`contextFreeCallback`, G1). THE SAFE-SIDE CLAIM HOLDS
 * ONCE PER CHANNEL AND IS CLAIMED NO WIDER THAN THAT: this list is safe for chained modifiers
 * and says nothing about channels outside the chain, which is precisely the sentence the sixth
 * and seventh cuts were falsified for writing without its qualifier.
 */
const NON_FOCUSING_TEST_MODIFIERS = Object.freeze(['skip', 'todo', 'failing', 'fails', 'skipIf', 'runIf']);

/**
 * The modifiers that return a FUNCTION rather than opening a block — `describe.each(table)`
 * is not a suite until the returned function is called with a name. A chain that ends on
 * one of these without its call has registered NOTHING, so it can never be credited.
 */
const TABLE_MODIFIERS = new Set(['each', 'for', 'skipIf', 'runIf']);

const RUNNING_SUITE_SET = new Set(RUNNING_SUITE_MODIFIERS);
const RUNNING_TEST_SET = new Set(RUNNING_TEST_MODIFIERS);
const KNOWN_TEST_SET = new Set([...RUNNING_TEST_MODIFIERS, ...NON_FOCUSING_TEST_MODIFIERS]);

/**
 * THE CALLEE CHAIN, FLATTENED. Walks down `.object` / `.callee` / `.tag` to the identifier
 * the chain roots in, recording each link on the way. A computed member is recorded as
 * `computed` WITHOUT reading what is inside it: `describe['sk' + 'ip']` and
 * `describe[someVariable]` are the same shape to this walker, which is the point — the
 * grammar cannot express a computed member at all, so both park.
 *
 * A `call` link CARRIES ITS ARGUMENT LIST, which the sixth cut did not record and the
 * seventh needs: `each`/`for` take run-control from the CARDINALITY of the table they are
 * called with, and a chain that discards its arguments cannot see a zero-row one. A tagged
 * template carries `args: null` — there is no argument list to read, so no table it opens
 * can ever be proven non-empty.
 * @param {any} node @returns {{root: string|null, rootNode: any, steps: Array<any>}}
 */
function chainOf(node) {
  const steps = [];
  let cur = node;
  for (;;) {
    if (cur.type === 'MemberExpression') {
      steps.unshift(cur.computed ? { kind: 'computed' } : { kind: 'dot', name: cur.property.name });
      cur = cur.object;
    } else if (cur.type === 'CallExpression') { steps.unshift({ kind: 'call', args: cur.arguments }); cur = cur.callee; }
    else if (cur.type === 'TaggedTemplateExpression') { steps.unshift({ kind: 'call', args: null }); cur = cur.tag; }
    else if (cur.type === 'Identifier') return { root: cur.name, rootNode: cur, steps };
    else return { root: null, rootNode: null, steps };
  }
}

/**
 * THE CLOSED GRAMMAR, AS A PREDICATE OVER CHAIN LINKS. Every link must be a tight dotted
 * member drawn from `allowed`, or a call that immediately follows a table modifier; and
 * every table modifier must be followed by its call. A computed link fails outright, and so
 * does a chain that ends on a table modifier without calling it.
 * @param {Array<any>} steps @param {Set<string>} allowed @returns {boolean}
 */
function grammarAccepts(steps, allowed) {
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    if (step.kind === 'dot') {
      if (!allowed.has(step.name)) return false;
      if (TABLE_MODIFIERS.has(step.name) && (!steps[i + 1] || steps[i + 1].kind !== 'call')) return false;
      continue;
    }
    if (step.kind !== 'call') return false;
    const prev = steps[i - 1];
    if (!prev || prev.kind !== 'dot' || !TABLE_MODIFIERS.has(prev.name)) return false;
  }
  return true;
}

/**
 * ── THE SECOND HOME OF RUN-CONTROL: THE OPTIONS ARGUMENT (L1) ──────────────────
 * vitest 4 takes `skip` / `only` / `todo` / `fails` / `concurrent` from a SECOND-POSITIONAL
 * OBJECT as readily as from the callee chain — the same modifiers, expressed as DATA, which
 * `chainOf` and `grammarAccepts` never look at because neither reads an argument. EXECUTED
 * under 4.1.8, each beside a green anchor in a real .test.js: `it(n, { skip: true }, fn)`
 * reported `↓ skipped`; `{ todo: true }` reported `□ todo`; `describe(n, { skip: true }, fn)`
 * skipped its whole block; `{ fails: true }` reported `1 expected fail`; `{ only: true }` RAN
 * the marker and left its SAME-FILE SIBLING `↓ skipped` — which is the very argument door 2
 * gives for keeping a closed test grammar, defeated through a route the grammar cannot see.
 *
 * THE SAME PREDICATE CLOSES THE ABSENT BODY, which no cut before this one named: `it('x')`
 * with NO second argument is a TODO under 4.1.8 (executed: `□ todo`), and `describe('x')`
 * with no callback registers nothing at all (executed: no row, file green). Both were
 * CREDITED by the sixth cut — bare word, running grammar, statically registered, static
 * title — and both are forgeries of exactly the shape this instrument exists to refuse.
 *
 * SO CREDIT REQUIRES A BODY THE PARSER CAN SEE: argument two must EXIST and must be a
 * function expression. Anything else — an object, an identifier, a call, a member read, or
 * nothing at all — is run-control this reader cannot classify, and it parks.
 * ESTATE COST, MEASURED over all 2,314 test files: ZERO. One file holds a non-function
 * second argument (tests/edgeFunctions/contracts.test.js's `suite.replace(…)`, the known B1
 * string-loop stray) and it is already parked as `SUITE_NOT_RUNNING`, so this rule takes no
 * file's titles today. It is a LATENT closure, and it is stated as one.
 *
 * `it(n, fn, { skip: true })` — THIRD-positional — IS NOT A ROUTE. Executed: vitest 4 throws
 * `Signature "test(name, fn, { ... })" was deprecated in Vitest 3 and removed in Vitest 4`,
 * so the file dies loudly rather than forging anything. It is named, not guarded.
 * @param {any} node @returns {boolean}
 */
const BODY_ARG_TYPES = new Set(['FunctionExpression', 'ArrowFunctionExpression']);
function argFormAccepts(node) {
  if (node.type !== 'CallExpression') return false;
  const second = node.arguments[1];
  return !!second && BODY_ARG_TYPES.has(second.type);
}

/**
 * ── G1: THE BODY'S OWN RUN-CONTROL ─────────────────────────────────────────────
 * vitest 4.1.8 hands every callback a TestContext, and that context CANCELS THE TEST FROM
 * INSIDE ITS OWN BODY: `TestContext.skip` is declared at
 * node_modules/@vitest/runner/dist/tasks.d-DEYaIMIu.d.ts:1310, and the same file records at
 * :325 that `onTestFinished` does not fire "if the test is canceled with a dynamic
 * `ctx.skip()` call". EXECUTED under 4.1.8, planted as a real .test.js beside a green anchor:
 * `it('MARKER', ({ skip }) => { skip(); throw new Error('THIS RAN'); })` reported
 * `↓ MARKER 0ms`, the run read `Tests 3 passed | 2 skipped (5)`, EXIT 0, and the deliberate
 * throw never fired. The SAME channel runs through a hook — `beforeEach(({ skip }) => skip())`
 * inside a credited suite skips every test under it, executed, file green, throw never fired.
 * Neither is a callee chain, an options bag or a table: it is the BODY, which no predicate in
 * this file looked inside before.
 *
 * THE RULE IS THE CONSERVATIVE ONE AND IT IS DELIBERATELY BLUNTER THAN THE HOLE: a credited
 * registration callback, or a hook callback anywhere in the file, that declares ANY PARAMETER
 * — destructured, named, defaulted or rest — parks the file. Not "a parameter whose `skip` is
 * referenced": reading the reference would be a scope analysis, and `const s = ctx.skip` or
 * `cancel(ctx)` defeats it in one line, which is exactly how four cuts of door 3 died. CREDIT
 * IS FOR CONTEXT-FREE TESTS ONLY. A context parameter is refused whatever it is spelled and
 * whatever it is used for.
 *
 * ITS LIMIT, STATED RATHER THAN CLAIMED AWAY: `skip()` reached through a HELPER that closes
 * over nothing this reader declares — the J-ES-4-F factory route at body level — is not closed
 * by this and is listed in the residuals.
 * @param {any} node @returns {boolean}
 */
function contextFreeCallback(node) {
  for (const arg of (node.arguments || [])) {
    if (BODY_ARG_TYPES.has(arg.type) && arg.params.length > 0) return false;
  }
  return true;
}

/**
 * The words vitest attaches a callback to AROUND a test rather than as one. They are read
 * wherever they stand, at any depth and through any binding, because the conservative
 * direction for a hook is the same as for a test: a hook whose callback takes the context can
 * cancel every test beneath it, and a hook this reader cannot classify is a hook it must not
 * stand behind. `aroundEach`/`aroundAll` are here even though vitest throws
 * `AroundHookSetupError` when their continuation is never called (executed) — a loud death is
 * not a forgery, but the parameter rule costs nothing to state once for the whole family.
 */
const HOOK_WORDS = new Set(['beforeAll', 'beforeEach', 'afterAll', 'afterEach', 'aroundEach', 'aroundAll']);

/**
 * ── THE NINTH STATEMENT'S WORD LIST: WHAT IS RESERVED ──────────────────────────
 * The words this walker refuses to let a file redefine. A call whose callee chain roots in
 * one of these must resolve — through the module's own binding structure — to the vitest
 * export OF THE SAME NAME; anything else parks the file. That is the whole of the alias,
 * shadow, rebind and global class in one predicate, and it is stated on the CREDIT side
 * (resolution must SUCCEED) rather than as a list of the ways it can fail.
 *
 * The jest-compat prefixes are in here precisely BECAUSE nothing can resolve to them: vitest
 * exports no `xdescribe`, so `xdescribe(…)` is a word that reads like an opener and provably
 * is not one, and the file parks. The hooks are in here for the same reason G1 reads hooks at
 * all — a hook that is not vitest's own is a hook whose callback this reader cannot classify.
 */
const RESERVED_WORDS = new Set([...SUITE_ROOTS, ...TEST_ROOTS, ...HOOK_WORDS]);

/**
 * ── G2: THE BLOCK'S OWN REACHABILITY ───────────────────────────────────────────
 * `markRegistered` is POSITIONAL, not flow-sensitive, and the sixth cut's own sentence
 * ("credit is granted only at statement positions reachable from the module body") was
 * therefore aspirational rather than true. EXECUTED under 4.1.8:
 * `describe('lane', () => { it('anchor', …); if (!GATE) return; it('MARKER', …); })`
 * registered NO ROW AT ALL for the marker, `Test Files 3 passed (3)`, exit 0 — and the sixth
 * cut credited the title. THE SILENCE TURNS ON THE ANCHOR: an EMPTY suite whose block returns
 * early reds loudly (`Error: No test found in suite outer 01`, executed), so four cuts never
 * met this. Put one real test ahead of the `return` and vitest says nothing at all.
 *
 * SO A CREDITED SUITE'S BLOCK MUST BE STRAIGHT-LINE REGISTRATION. Every statement in it is a
 * call (a registration, a hook attachment, or a helper call that registers nothing anyone can
 * see), a plain declaration, or an empty statement. A `return`, a `throw`, an `if`, a loop, a
 * `switch`, a `try`, a bare block, a labelled statement or an assignment expression is NOT
 * straight-line, and the file parks whole — not merely the statements below it. Stopping at
 * the first `return` would be the narrower repair and it is deliberately NOT the one taken: a
 * block whose registrations are wrapped in a conditional at all is a block whose contents this
 * reader cannot prove vitest reaches, and the whole point of door 3 is that it refuses what it
 * cannot prove rather than guessing the common case.
 *
 * THE MODULE BODY IS NOT SUBJECT TO THIS AND MUST NOT BE — it holds the imports, the mocks,
 * the constants and the helpers of every file in the estate. It also cannot carry the hole:
 * a top-level `return` is a syntax error under `sourceType: 'module'` and parks at the parser
 * door, and a top-level `throw` kills collection loudly rather than silently.
 * @param {Array<any>} statements @returns {boolean}
 */
const STRAIGHT_LINE_STATEMENTS = new Set(['VariableDeclaration', 'FunctionDeclaration', 'ClassDeclaration', 'EmptyStatement']);
function straightLineBlock(statements) {
  for (const stmt of statements) {
    if (!stmt) return false;
    if (STRAIGHT_LINE_STATEMENTS.has(stmt.type)) continue;
    if (stmt.type === 'ExpressionStatement' && !!stmt.expression
      && (stmt.expression.type === 'CallExpression' || stmt.expression.type === 'TaggedTemplateExpression')) continue;
    return false;
  }
  return true;
}

/**
 * ── THE THIRD HOME OF RUN-CONTROL: THE TABLE'S CARDINALITY (L2) ────────────────
 * `each` and `for` sit in BOTH running grammars, and `TABLE_MODIFIERS` demands only that the
 * returned function BE CALLED — never that the table have rows. So cardinality is invisible
 * to a grammar that reads only the chain, and a ZERO-ROW table registers NOTHING while the
 * file stays green. EXECUTED under 4.1.8: `describe.each([])('MARKER — %s', …)` and
 * `it.each([])('MARKER — %s', fn)`, each beside a real anchor test, both ran the anchor and
 * registered no marker at all — no row, no skip, no todo, exit 0. Alone in a file they red
 * loudly (`No test suite found in file`); beside any anchor the absence is SILENT.
 *
 * A TABLE IS CREDITED ONLY WHERE IT IS A NON-EMPTY ARRAY LITERAL WITH STATICALLY PRESENT
 * ELEMENTS. An empty literal registers nothing; a spread, an identifier, a call or any other
 * expression has a length this reader cannot compute, and "probably non-empty" is precisely
 * the kind of credit four cuts of this door were falsified for. Run-time emptiness of a
 * non-literal table is UNDECIDABLE here, which is why the rule refuses the whole class
 * rather than pretending to measure it.
 *
 * ESTATE COST, MEASURED BY THIS LANE'S OWN CENSUS: 61 currently-credited files park
 * (64 files call `each`/`for` on a non-literal table; three were already parked). They are
 * ENUMERATED in the landing commit as reformat debt, and the reformat is an inline literal
 * table. ZERO estate files use an empty literal or a tagged-template table.
 * @param {any} arg @returns {boolean}
 */
const CREDITED_TABLE_MODIFIERS = new Set(['each', 'for']);
const staticTableRows = (arg) => !!arg && arg.type === 'ArrayExpression' && arg.elements.length > 0
  && arg.elements.every((el) => !!el && el.type !== 'SpreadElement');

/**
 * Every `each`/`for` link in a chain must be called with a table this reader can prove has
 * rows. A chain with no table modifier is vacuously proven — this predicate never widens
 * credit, it only ever removes it.
 * @param {Array<any>} steps @returns {boolean}
 */
function tableProven(steps) {
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    if (step.kind !== 'dot' || !CREDITED_TABLE_MODIFIERS.has(step.name)) continue;
    const call = steps[i + 1];
    if (!call || call.kind !== 'call' || !call.args || !staticTableRows(call.args[0])) return false;
  }
  return true;
}

/**
 * THE TITLE READ, FROM THE TREE. A title is the FIRST argument of a credited call and it
 * must be STATIC: a string Literal, or the static segments of a template literal. An
 * interpolated segment is not read, so `it(`${x} MARKER`)` credits `MARKER` while a marker
 * split ACROSS an interpolation is credited to neither half — which is the honest read,
 * because such a marker is not in the file.
 *
 * IT IS CALLED INTO TWO SEPARATE ARRAYS AND THAT SEPARATION IS THE TENTH CUT — see the tenth
 * statement. Under every earlier cut this function was called into ONE array from both the
 * suite loop and the test loop, so `measure` could not tell a suite title from a test title
 * and a marker in a `describe` was evidence for a wave nothing under it ran.
 * @param {any} node @param {Array<[number, string]>} out
 */
function titleArgs(node, out) {
  const first = node.arguments && node.arguments[0];
  if (!first) return;
  if (first.type === 'Literal' && typeof first.value === 'string') { out.push([first.range[0], first.value]); return; }
  if (first.type !== 'TemplateLiteral') return;
  for (const quasi of first.quasis) if (quasi.value.cooked) out.push([quasi.range[0], quasi.value.cooked]);
}

/** Every identifier a binding pattern introduces — destructuring, defaults and rest included. */
function patternIds(node, out) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'Identifier') { out.push(node); return; }
  if (node.type === 'ObjectPattern') {
    for (const p of node.properties) patternIds(p.type === 'RestElement' ? p.argument : p.value, out);
    return;
  }
  if (node.type === 'ArrayPattern') { for (const e of node.elements) patternIds(e, out); return; }
  if (node.type === 'AssignmentPattern') { patternIds(node.left, out); return; }
  if (node.type === 'RestElement') patternIds(node.argument, out);
}

/**
 * An inner link of a longer chain — `describe.each([1])` inside `describe.each([1])('n', f)`.
 * Only the OUTERMOST node of a chain is classified; classifying the links as well would park
 * every table-driven suite in the estate for the crime of being written in two calls.
 */
const isChainLink = (parent, key) => !!parent
  && ((parent.type === 'CallExpression' && key === 'callee')
    || (parent.type === 'TaggedTemplateExpression' && key === 'tag')
    || (parent.type === 'MemberExpression' && key === 'object'));

/** A static member/property NAME that happens to spell a suite word — `RuleTester.describe`. */
const isNameNotReference = (parent, key) => !!parent
  && ((parent.type === 'MemberExpression' && key === 'property' && !parent.computed)
    || ((parent.type === 'Property' || parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition')
      && key === 'key' && !parent.computed));

/**
 * ── DOOR 3, NINTH STATEMENT: THE BINDING ENVIRONMENT, READ POSITIVELY ──────────
 * ONE PASS OVER THE TREE THAT ANSWERS ONE QUESTION: for each name this module binds, WHAT
 * BINDS IT, and is that binding a vitest import? Everything the eighth cut spent on shadow
 * tracking — a `shadowed` set, a `markShadowed` writer, two `*_SHADOW_AMBIGUOUS` reasons, a
 * `node.source.value !== 'vitest'` clause and an import-specifier credit-back — is replaced
 * by this environment plus one predicate, and the replacement is not a tidy-up: the eighth
 * cut's arrangement FAILED OPEN, and this one cannot fail in that direction at all.
 *
 * WHAT FAILED, AND WHY IT WAS STRUCTURAL RATHER THAN A MISSED ROW. The eighth cut asked
 * whether a word was BOUND and, if so, treated it as opaque. But its import clause read the
 * module SOURCE and never the specifier's own names, so a vitest-sourced specifier that
 * REBOUND an opener word to a NON-opener export was not a binding at all in its eyes:
 * `import { expect as it } from 'vitest';` followed by `it('MARKER', fn)` was credited with
 * `reasons=[]`, and the shipped evaluator read `SATISFIED / satisfiable true / missing []`
 * off the real marker while vitest 4.1.8 registered NO ROW and a deliberate
 * `throw new Error('THIS RAN')` never fired (RE-EXECUTED by this lane in a git-archive tree:
 * `Test Files 1 passed (1) / Tests 1 passed (1)`, exit 0, `grep -c 'THIS RAN'` = 0). The
 * eighth cut's header called its binding list — "a declaration, a parameter, a destructure, a
 * catch binding, a function name, a non-vitest import" — an enumeration that was safe because
 * it lived on the credit side. It was an ENUMERATION ON THE CREDIT SIDE THAT FAILED OPEN, in
 * the one place four cuts of prose had insisted was "always closed". `expect as describe` was
 * worse still: `creditedSuiteBody` handed registration through the aliased word, so ONE line
 * forged two titles.
 *
 * THE REPLACEMENT IS A POSITIVE PREDICATE AND IT ENUMERATES NOTHING. A callee is credited
 * only where it RESOLVES to a vitest opener, and resolution is total: it either succeeds by
 * naming the vitest export, or it fails. There is no third state for a new spelling to
 * occupy, because "bound by something else", "bound twice", "not bound at all" and "bound to
 * a different vitest export" are not rows on a list — they are simply the ways resolution
 * does not succeed. Two forms resolve, and they are the two vitest itself offers:
 *   • A NAMED IMPORT, read by its IMPORTED name and never by its local alias. `import
 *     { describe as mkSuite }` resolves `mkSuite` to `describe`; `import { expect as it }`
 *     resolves `it` to `expect`, which is not an opener, so the call parks.
 *   • A NAMESPACE MEMBER. `import * as V from 'vitest'` makes the MEMBER NAME the imported
 *     name, so `V.describe(…)` is `describe`. A COMPUTED member (`V['describe']`) names
 *     nothing a syntax tree can read, so it parks.
 * BOTH WERE EXECUTED UNDER VITEST 4.1.8 BEFORE BEING CREDITED, because each is a credit this
 * walker did not previously grant: `import { describe as mkSuite, it as check }` reported
 * `✓ RENAMED-SUITE-VIA-ALIAS > RENAMED-TEST-VIA-ALIAS`, and `V.describe`/`V.it` reported
 * `✓ NAMESPACE-SUITE > NAMESPACE-TEST`. Nothing else resolves — not a destructure off a
 * namespace, not a shim import, not a helper's return, not a global.
 *
 * AND THE RESERVED-WORD RULE, WHICH IS THE OTHER HALF AND THE REASON A GLOBAL CANNOT COAST.
 * A call rooted in a RESERVED word must resolve to the vitest export OF THAT SAME NAME. So
 * `import { expect as it }` parks (`it` resolved to `expect`), `import { it as describe }`
 * parks (`describe` resolved to `it` — accurate, and refused anyway because a word that reads
 * `describe` and means `it` is the trap this cut exists to close), a locally declared
 * `function it(){}` parks, and a file with NO vitest import at all parks every opener call it
 * makes. AN OPENER WORD MAY ONLY EVER MEAN ITSELF; ANY OTHER WORD MAY MEAN AN OPENER.
 *
 * ESTATE COST, MEASURED FILE-FOR-FILE AGAINST THE EIGHTH CUT: ZERO. The parked set, the
 * credited set and the title count are unchanged, and the title SETS are identical on every
 * credited file — the eighth cut's classifier and this one were run over the same estate and
 * their outputs compared row by row, in both directions, with no divergence. This is a pure
 * retirement of machinery, not a behaviour change. THE ABSOLUTE FIGURES ARE DELIBERATELY NOT
 * RESTATED HERE: they live in the `CENSUS` table of the census arm, where the suite ASSERTS
 * them against a live measurement, because this header stated that count wrongly in two
 * consecutive cuts and prose is where the staleness was able to hide (§ the chair's second
 * ruling). The only movement is in reason KINDS, where `TEST_SHADOW_AMBIGUOUS` (25 files) and
 * one `SUITE_NOT_RUNNING` (tests/edgeFunctions/contracts.test.js, whose `suite` loop variable
 * is a string) become the single `OPENER_UNRESOLVED` (26 files). The repository declares no
 * `globals: true`, and all 2,314 test files import from 'vitest' — measured, and the reason a
 * positive rule is affordable here at all.
 * @param {any} ast @returns {{resolve: (name: string) => string|null,
 *   isNamespace: (name: string) => boolean, bindingNodes: Set<any>, bound: Set<string>}}
 */
function bindingsOf(ast) {
  const counts = new Map();
  const bindingNodes = new Set();
  const vitestNamed = new Map();
  const vitestNamespaces = new Set();
  const bind = (id) => {
    if (!id || !id.name) return;
    bindingNodes.add(id);
    counts.set(id.name, (counts.get(id.name) || 0) + 1);
  };
  const bindPattern = (pattern) => { const ids = []; patternIds(pattern, ids); for (const id of ids) bind(id); };

  const stack = [ast];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== 'object' || typeof node.type !== 'string') continue;
    if (node.type === 'ImportDeclaration') {
      const fromVitest = node.source.value === 'vitest';
      for (const spec of node.specifiers) {
        bind(spec.local);
        // The `imported` half of `import { describe as d }` is a MODULE-LINKAGE NAME, not a
        // reference to anything in this file. Recording it here is what lets the reference
        // rule below read every remaining Identifier as a real reference without needing a
        // credit-back list for import specifiers — the eighth cut's CREDIT-BACK 1, retired.
        if (spec.imported) bindingNodes.add(spec.imported);
        if (!fromVitest) continue;
        if (spec.type === 'ImportNamespaceSpecifier') vitestNamespaces.add(spec.local.name);
        else if (spec.type === 'ImportDefaultSpecifier') vitestNamed.set(spec.local.name, 'default');
        else vitestNamed.set(spec.local.name,
          spec.imported.type === 'Identifier' ? spec.imported.name : spec.imported.value);
      }
    }
    if (node.type === 'ExportSpecifier') { bindingNodes.add(node.local); bindingNodes.add(node.exported); }
    if (node.type === 'VariableDeclarator') bindPattern(node.id);
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression'
      || node.type === 'ArrowFunctionExpression' || node.type === 'ClassDeclaration'
      || node.type === 'ClassExpression') {
      if (node.id) bind(node.id);
      for (const param of (node.params || [])) bindPattern(param);
    }
    if (node.type === 'CatchClause' && node.param) bindPattern(node.param);
    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'range') continue;
      const value = node[key];
      if (!value || typeof value !== 'object') continue;
      if (Array.isArray(value)) { for (const child of value) if (child && typeof child === 'object') stack.push(child); }
      else stack.push(value);
    }
  }

  // A name is resolvable only where the file binds it EXACTLY ONCE and that one binding is
  // the vitest import. Two bindings mean a rebind somewhere this reader has no scope resolver
  // for, and the honest answer to "which one is at the call site" is that it cannot say.
  const sole = (name) => counts.get(name) === 1;
  return {
    resolve: (name) => (sole(name) && vitestNamed.has(name) ? vitestNamed.get(name) : null),
    isNamespace: (name) => sole(name) && vitestNamespaces.has(name),
    bindingNodes,
    bound: new Set(counts.keys()),
  };
}

/**
 * THE RESOLUTION OF ONE CALLEE CHAIN. Returns the vitest export the chain's head names
 * (`name`), the modifier steps that follow it, and the LEXICAL word the chain roots in — the
 * last of which is what the reserved-word rule needs, because a word that reads like an
 * opener and resolves to something else is exactly the case the eighth cut credited.
 * @param {any} head @param {ReturnType<typeof bindingsOf>} env
 */
function resolveChain(head, env) {
  const { root, rootNode, steps } = chainOf(head);
  if (!root) return { name: null, steps: [], rootNode: null, lexicalRoot: null, namespaced: false };
  if (env.isNamespace(root)) {
    const first = steps[0];
    if (!first || first.kind !== 'dot') {
      return { name: null, steps: [], rootNode, lexicalRoot: root, namespaced: true };
    }
    return { name: first.name, steps: steps.slice(1), rootNode, lexicalRoot: root, namespaced: true };
  }
  return { name: env.resolve(root), steps, rootNode, lexicalRoot: root, namespaced: false };
}

/**
 * THE ONE REFERENCE-SIDE ALLOWANCE THAT SURVIVES — `RuleTester.describe = describe;`, four
 * estate files. A BARE suite value assigned to a member target can only ever alias a suite
 * that RUNS, so parking it would buy nothing and cost four files their marker rights. A
 * MODIFIED value (`RuleTester.d = describe.skip`) is not this shape and is not allowed back.
 * It is keyed on the RESOLVED name now, not on the spelling, so an aliased import gets the
 * same treatment as a plain one. Mutant: delete this clause and those four files park.
 */
const isBareSuiteValueOnMemberTarget = (ref, resolve) => {
  const p = ref.parent;
  return !!p && p.type === 'AssignmentExpression' && ref.key === 'right'
    && p.left.type === 'MemberExpression' && SUITE_WORDS.includes(resolve(ref.node.name));
};

/**
 * DOOR 3'S VERDICT FOR ONE SOURCE, STRUCTURAL. Returns the park reasons (empty when the file
 * keeps its titles) and the titles of the tests that will actually run.
 *
 * THE ORDER OF THE CLAUSES IS THE ARGUMENT, and every one of them defaults to PARK:
 *   • the file must PARSE, or it parks whole with reason `PARSE`;
 *   • an OPENER word — suite or test — BOUND anywhere in the file (a declaration, a
 *     parameter, a destructure, a catch binding, a function name, a non-vitest import) is
 *     either a rebind or a shadow, and a reader without a scope resolver cannot tell which,
 *     so the word is treated as OPAQUE. A BINDING IS NOT ITSELF A PARK — it must not be, or
 *     a loop variable named `suite` would cost a file its titles — but IT NEVER DELETES ONE
 *     EITHER, which is the clause the fifth cut got backwards. Every call through an opaque
 *     word parks: as `*_SHADOW_AMBIGUOUS` when the call would otherwise have been credited,
 *     and by the ordinary rules below when it would not;
 *   • every suite-rooted call that is not in the running grammar parks the file — with no
 *     exception for a bound root, which is precisely what the sixth cut repaired;
 *   • every suite-word reference that is not the root of a credited call and not on the
 *     two-entry credit-back list parks the file;
 *   • every test-rooted call outside BOTH test grammars parks the file, because an
 *     unrecognised test modifier may be `only` and `only` silences its siblings;
 *   • every suite- or test-rooted call whose SECOND ARGUMENT is not a function expression
 *     parks the file (L1) — run-control expressed as DATA is unclassifiable-as-running, and
 *     an options bag can spell `only` exactly as the chain can. Checked on the TEST side
 *     BEFORE the chain, because the file-scope consequence does not depend on which modifier
 *     the data names;
 *   • every `each`/`for` link whose table is not a non-empty array literal with statically
 *     present elements parks the file (L2) — a table this reader cannot count may be empty,
 *     and an empty table registers nothing while the file stays green;
 *   • every suite- or test-rooted call whose CALLBACK DECLARES A PARAMETER parks the file, and
 *     so does every hook call that does (G1) — a callback that can name its context can call
 *     `ctx.skip()` and cancel itself from the inside, which no reader of the call alone sees;
 *   • every credited suite whose block is not STRAIGHT-LINE REGISTRATION parks the file and
 *     opens no registered scope (G2) — a `return` above a registration means vitest never
 *     reaches it, and a conditional or a loop around one means this reader cannot say;
 *   • every suite- or test-rooted call that is not STATICALLY REGISTERED parks the file —
 *     one that stands anywhere but as a direct statement of the module body or of a
 *     credited suite's block, because a call in a helper, a loop, a conditional or a
 *     callback may register nothing at all and a syntax tree cannot say which.
 * @param {string} src @returns {{reasons: string[], titles: string[]}}
 */
function classifySource(src) {
  let ast;
  try { ast = parse(src, PARSE_OPTIONS); } catch (err) { return { reasons: [`PARSE:${err.message}`], titles: [] }; }

  // THE BINDING ENVIRONMENT IS BUILT FIRST AND WHOLE, which is what lets every verdict below
  // be taken on the spot instead of deferred. The eighth cut could not do this: it read
  // bindings during the same DFS that classified calls, so a patch consulting the shadow set
  // mid-walk was decided by DFS ORDER — measured failing to close the forgery it was written
  // for. Resolution is a property of the module, so it is computed as one.
  const env = bindingsOf(ast);

  const suiteCalls = [];
  const testCalls = [];
  const suiteRefs = [];
  const hookReasons = [];
  const unresolvedReasons = [];
  const reasons = [];
  // TWO TITLE ARRAYS, NEVER ONE — the tenth statement. `titles` is the EVIDENCE layer and only
  // a credited TEST ever writes to it; `suiteTitles` is kept so the split is observable (and
  // pinnable) rather than a silent deletion, and nothing downstream reads it as evidence.
  const titles = [];
  const suiteTitles = [];
  const creditedRoots = new Set();

  const stack = [{ node: ast, parent: null, key: null }];
  while (stack.length) {
    const { node, parent, key } = stack.pop();
    if (!node || typeof node !== 'object' || typeof node.type !== 'string') continue;

    if ((node.type === 'CallExpression' || node.type === 'TaggedTemplateExpression') && !isChainLink(parent, key)) {
      const head = node.type === 'CallExpression' ? node.callee : node.tag;
      const { name, steps, rootNode, lexicalRoot, namespaced } = resolveChain(head, env);
      // THE SHAPE IS SPELLED FROM THE RESOLVED NAME, never from the local alias, so a reason
      // string names the thing vitest would have run rather than whatever this file called it.
      const shape = `${name}${steps.map(stepText).join('')}`;
      // THE NINTH STATEMENT'S TWO REFUSALS, TAKEN BEFORE ANY GRAMMAR IS CONSULTED. A reserved
      // word that resolved to something other than itself is a rebind however it was spelled;
      // a vitest namespace reached through a COMPUTED member names nothing a tree can read.
      // Either way the file parks, and no title anywhere in it is credited.
      const rebound = !!lexicalRoot && RESERVED_WORDS.has(lexicalRoot) && name !== lexicalRoot;
      const blindNamespace = namespaced && name === null;
      // THE CHANNELS OF RUN-CONTROL THIS WALKER READS, EACH SEPARATELY SO EACH CAN NAME ITS
      // OWN REFUSAL. The binding is `resolveChain`, the chain is `grammarOk`, the table's
      // cardinality is `tableOk`, the second argument's form is `argOk`, the callback's own
      // context is `ctxOk`; a call is credited only when all five hold. Five cuts in a row were
      // falsified by a channel the header did not know it was ignoring, so the channels stay
      // separate rather than folded into one predicate — and the grammar is stated as what this
      // walker CREDITS, never as a census of what vitest reads.
      if (rebound || blindNamespace) {
        unresolvedReasons.push(`OPENER_UNRESOLVED:${lexicalRoot}`);
      } else if (name && SUITE_WORDS.includes(name)) {
        const grammarOk = node.type === 'CallExpression' && grammarAccepts(steps, RUNNING_SUITE_SET);
        const tableOk = tableProven(steps);
        const argOk = argFormAccepts(node);
        const ctxOk = contextFreeCallback(node);
        suiteCalls.push({
          running: grammarOk && tableOk && argOk && ctxOk, grammarOk, tableOk, argOk, ctxOk,
          rootNode, node, shape,
        });
      } else if (name && HOOK_WORDS.has(name)) {
        // G1 AT HOOK LEVEL. A hook is never credited and never carries a title, so it has no
        // entry in either call list — its ONLY consequence is this park, and it is taken
        // wherever the hook stands because a hook that takes the context can cancel every test
        // beneath it from inside its own body.
        if (!contextFreeCallback(node)) hookReasons.push(`HOOK_CONTEXT_PARAM:${name}`);
      } else if (name && TEST_WORDS.includes(name)) {
        const grammarOk = node.type === 'CallExpression' && grammarAccepts(steps, RUNNING_TEST_SET);
        const tableOk = tableProven(steps);
        const argOk = argFormAccepts(node);
        const ctxOk = contextFreeCallback(node);
        testCalls.push({
          running: grammarOk && tableOk && argOk && ctxOk, grammarOk, tableOk, argOk, ctxOk,
          known: grammarAccepts(steps, KNOWN_TEST_SET), node, shape,
        });
      }
    }

    // THE REFERENCE RULE, RE-KEYED ON RESOLUTION. A reference to a value this file can PROVE
    // is vitest's own suite opener, standing anywhere but at the head of a call this walker
    // classified, is the factory route in plain sight. It is keyed on `resolve` rather than on
    // the spelling, so an aliased import is read the same way — and a BINDING SITE is not a
    // reference at all, which is a structural fact rather than the credit-back list the eighth
    // cut needed for import specifiers.
    if (node.type === 'Identifier' && !env.bindingNodes.has(node)
      && SUITE_WORDS.includes(env.resolve(node.name)) && !isNameNotReference(parent, key)) {
      suiteRefs.push({ node, parent, key });
    }

    for (const childKey of Object.keys(node)) {
      if (childKey === 'loc' || childKey === 'range') continue;
      const value = node[childKey];
      if (!value || typeof value !== 'object') continue;
      if (Array.isArray(value)) {
        for (const child of value) if (child && typeof child === 'object') stack.push({ node: child, parent: node, key: childKey });
      } else stack.push({ node: value, parent: node, key: childKey });
    }
  }

  // THE REGISTRATION WALK, top-down from the module body, over the closed environment. It now
  // reports as well as marks: a credited suite whose block is not straight-line hands out NO
  // registration AND parks the file (G2), and only the walk is in a position to see it.
  const registered = new Set();
  const flowReasons = [];
  markRegistered(ast.body, registered, env, flowReasons);

  // B1'S HOLE IS NOW STRUCTURALLY UNREACHABLE, AND THAT IS WHY ITS MACHINERY IS GONE. The
  // fifth cut skipped every call whose root was bound BEFORE pushing `SUITE_NOT_RUNNING`, so
  // a bound word was not opaque but MUTE — it DELETED the park for every non-running suite
  // opened through it, and two lines read SATISFIED off a file vitest reported `1 skipped`.
  // The sixth cut repaired that by ordering a skip after a push. There is no skip left to
  // order: an unresolved word never reaches these loops at all, it parks at
  // `OPENER_UNRESOLVED` above, and a resolved word is vitest's own and has nothing to be
  // opaque about. A repair that removes the possibility outranks a repair that sequences it.
  for (const call of suiteCalls) {
    creditedRoots.add(call.rootNode);
    // A CREDITED SUITE'S TITLE IS NOT EVIDENCE — it goes to `suiteTitles`, which nothing joins
    // against. THE TENTH CUT'S WHOLE MECHANISM IS THIS LINE. A suite title is backed by nothing:
    // vitest registers no test for it, and a `describe` whose every inner test is `.skip`,
    // `.todo`, `.skipIf`, `.runIf` or `.fails` runs NOTHING while this file still parses it as a
    // fully credited source with `reasons=[]`. Door 2 has refused `it.skip('MARKER')` since the
    // first cut; moving the same marker one line up into the enclosing `describe` defeated that
    // refusal completely, and the fix is to stop reading suite titles as evidence at all.
    if (call.running && registered.has(call.node)) { titleArgs(call.node, suiteTitles); continue; }
    if (call.running) { reasons.push(`SUITE_UNREGISTERED:${call.shape}`); continue; }
    // THE CHANNEL THAT REFUSED IT IS THE REASON IT CARRIES. The chain speaks first, so the
    // sixth cut's reason strings are unchanged for every source it already refused; the two
    // new channels speak only where the chain had nothing to say.
    if (!call.grammarOk) { reasons.push(`SUITE_NOT_RUNNING:${call.shape}`); continue; }
    if (!call.tableOk) { reasons.push(`SUITE_TABLE_UNPROVEN:${call.shape}`); continue; }
    if (!call.argOk) { reasons.push(`SUITE_ARG_FORM:${call.shape}`); continue; }
    reasons.push(`SUITE_CONTEXT_PARAM:${call.shape}`);
  }
  // DOOR 2, THE SAME LAWS ONE LEVEL IN: a test whose opener did not RESOLVE has already
  // parked above (the word is not vitest's), a test that is not STATICALLY REGISTERED parks
  // (it may never be invoked at all), and a test outside both grammars parks (it may be
  // `only`). Only a resolved, running, registered call keeps its title.
  for (const call of testCalls) {
    // THE OPTIONS BAG PARKS THE FILE, AND IT PARKS BEFORE THE CHAIN IS CONSULTED — because
    // the bag can spell `only`, and `only` silences its siblings exactly as a chained
    // `.only` does. It is checked ahead of `known` for the same reason `it.invented` is
    // refused: the file-scope consequence does not depend on which modifier the data names.
    if (!call.argOk) { reasons.push(`TEST_ARG_FORM:${call.shape}`); continue; }
    if (call.running && registered.has(call.node)) {
      titleArgs(call.node, titles);
      continue;
    }
    if (call.running) { reasons.push(`TEST_UNREGISTERED:${call.shape}`); continue; }
    if (call.grammarOk && !call.tableOk) { reasons.push(`TEST_TABLE_UNPROVEN:${call.shape}`); continue; }
    // THE BODY'S OWN CONTEXT SPEAKS LAST OF THE FOUR CHANNELS, and the ORDER IS LOAD-BEARING
    // rather than cosmetic. It was written directly after `argOk` first, and the estate census
    // showed why that is wrong: `it.each(rows)('…', (row) => …)` fails BOTH channels, so the
    // ctx clause swallowed all 64 of L2's estate files and `TEST_TABLE_UNPROVEN` stopped firing
    // on a single one — a rule with no estate evidence left, silently covered by its successor.
    // That is this program's defence-in-depth failure in its purest form, caught by the census
    // rather than by a pin, so the more specific channel now names the refusal.
    if (call.grammarOk && !call.ctxOk) { reasons.push(`TEST_CONTEXT_PARAM:${call.shape}`); continue; }
    if (!call.known) reasons.push(`TEST_UNCLASSIFIED:${call.shape}`);
  }
  for (const ref of suiteRefs) {
    if (creditedRoots.has(ref.node)) continue;
    if (isBareSuiteValueOnMemberTarget(ref, env.resolve)) continue;
    reasons.push(`SUITE_REF:${ref.parent ? ref.parent.type : 'Program'}.${ref.key}`);
  }
  // THE CHANNELS THAT ARE NOT PROPERTIES OF A CREDITED CALL AT ALL, appended last so the
  // reason ORDER of every source the earlier cuts already refused is unchanged. A binding is
  // not a call's property, a hook is not a registration, and a block's shape is not a call's
  // shape.
  for (const reason of unresolvedReasons) reasons.push(reason);
  for (const reason of hookReasons) reasons.push(reason);
  for (const reason of flowReasons) reasons.push(reason);

  titles.sort((a, b) => a[0] - b[0]);
  suiteTitles.sort((a, b) => a[0] - b[0]);
  const parked = reasons.length > 0;
  return {
    reasons,
    titles: parked ? [] : titles.map(([, text]) => text),
    suiteTitles: parked ? [] : suiteTitles.map(([, text]) => text),
  };
}

/**
 * DOOR 2's REGISTRATION RULE — the callback body of a suite that is CREDITED. Returns the
 * statement list a credited suite opens, or null for anything else: a call whose head does not
 * RESOLVE to vitest's own `describe`/`suite`, a reserved word that resolved to something else,
 * a chain outside the running grammar, a table this reader cannot prove has rows, a second
 * argument that is not a function, or a callback with no block body.
 *
 * ALL FIVE CHANNELS ARE CONSULTED HERE TOO, and that is deliberate defence in depth rather
 * than duplication: this predicate decides which blocks OPEN a registered scope, so a suite
 * refused above but credited here would hand registration to every test underneath it. The
 * refusals are spelled in the same order and from the same predicates. This is exactly where
 * the eighth cut's alias hole did its worst work — `import { expect as describe }` forged TWO
 * titles rather than one, because this function handed registration through the aliased word
 * to everything beneath it — so the ninth statement's rule is carried here in the same commit
 * that introduces it rather than left for the next cut to discover.
 * @param {any} node @param {ReturnType<typeof bindingsOf>} env @returns {Array<any>|null}
 */
function creditedSuiteBody(node, env) {
  if (node.type !== 'CallExpression') return null;
  const { name, steps, lexicalRoot } = resolveChain(node.callee, env);
  if (lexicalRoot && RESERVED_WORDS.has(lexicalRoot) && name !== lexicalRoot) return null;
  if (!name || !SUITE_WORDS.includes(name)) return null;
  if (!grammarAccepts(steps, RUNNING_SUITE_SET)) return null;
  if (!tableProven(steps) || !argFormAccepts(node)) return null;
  if (!contextFreeCallback(node)) return null;
  for (let i = node.arguments.length - 1; i >= 0; i -= 1) {
    const arg = node.arguments[i];
    if ((arg.type === 'FunctionExpression' || arg.type === 'ArrowFunctionExpression')
      && arg.body.type === 'BlockStatement') return arg.body.body;
  }
  return null;
}

/**
 * THE STATIC REGISTRATION WALK — door 2's reachability half, and the ONLY top-down pass in
 * this file. A call is REGISTERED when it stands as a direct statement of the module body,
 * or as a direct statement of the block a credited suite opens, recursively. Nothing else
 * is: not a call in a helper function, not one in a loop or a conditional, not one in a
 * `forEach` callback, not one under a suite this walker did not credit. Descent is the
 * argument — an unregistered suite opens no registered scope, so a whole subtree of tests
 * under a never-invoked `describe` is unregistered too.
 * IT IS ALSO WHERE G2 LIVES, because a block's shape is not a call's property and nothing else
 * in this file walks blocks. A credited suite whose block is not STRAIGHT-LINE registration
 * opens no registered scope at all — every test under it is `*_UNREGISTERED`, exactly as
 * though the suite had never been invoked — AND the file parks on its own named reason, which
 * is what keeps this from being a guard a later cut can delete silently.
 * @param {Array<any>} statements @param {Set<any>} registered
 * @param {ReturnType<typeof bindingsOf>} env @param {string[]} flowReasons
 */
function markRegistered(statements, registered, env, flowReasons) {
  for (const stmt of statements) {
    if (!stmt || stmt.type !== 'ExpressionStatement') continue;
    const expr = stmt.expression;
    if (!expr || (expr.type !== 'CallExpression' && expr.type !== 'TaggedTemplateExpression')) continue;
    registered.add(expr);
    const inner = creditedSuiteBody(expr, env);
    if (!inner) continue;
    if (!straightLineBlock(inner)) {
      const { name, steps } = resolveChain(expr.callee, env);
      flowReasons.push(`SUITE_NOT_STRAIGHT_LINE:${name}${steps.map(stepText).join('')}`);
      continue;
    }
    markRegistered(inner, registered, env, flowReasons);
  }
}

const stepText = (step) => (step.kind === 'dot' ? `.${step.name}` : (step.kind === 'call' ? '()' : '[]'));

/**
 * One parse per distinct source, held for the run. Without it the estate is re-parsed once
 * per census and the walker's wall time multiplies by the number of arms.
 */
const CLASSIFIED = new Map();
function classify(src) {
  let hit = CLASSIFIED.get(src);
  if (!hit) { hit = classifySource(src); CLASSIFIED.set(src, hit); }
  return hit;
}

/**
 * ── SYNTHETIC-SOURCE SCAFFOLDING, AND IT IS SCAFFOLDING RATHER THAN A RULE ─────
 * Under the ninth statement an opener resolves through the file's OWN vitest import, so a
 * bare fragment like `it('x', () => {})` — which is what 108 battery entries are — names a
 * word nothing in it binds, and parks. That is the CORRECT verdict for such a file and the
 * estate proves it costs nothing (all 2,314 real test files import from 'vitest'; the
 * repository declares no `globals: true`), but it would make every synthetic arm below park
 * for the same uninteresting reason and the battery would stop discriminating.
 *
 * SO EVERY SYNTHETIC SOURCE IS GIVEN THE IMPORT A REAL TEST FILE HAS. The prelude names only
 * the words the source does not itself bind — otherwise a deliberate rebind like
 * `import { describe } from './shim.js'` would become a duplicate module-scope declaration
 * and die at the PARSER door, which would silently move the arm's refusal from the grammar to
 * the parser and is exactly the confusion `parses()` exists to prevent. A hashbang keeps its
 * place at the top of the file, because it must.
 *
 * THE ARMS THAT PROVE THIS IS SCAFFOLDING AND NOT A LOOPHOLE are in the alias battery: the
 * SAME fragments WITHOUT a prelude park on `OPENER_UNRESOLVED`, and a preluded fragment whose
 * prelude is renamed away parks too. The prelude buys a synthetic file the ordinary standing
 * of a real one and nothing else.
 */
const PRELUDE_WORDS = Object.freeze(['describe', 'suite', 'it', 'test',
  'beforeAll', 'beforeEach', 'afterAll', 'afterEach', 'aroundEach', 'aroundAll']);
function withVitest(src) {
  let names;
  try {
    const { bound } = bindingsOf(parse(src, PARSE_OPTIONS));
    names = PRELUDE_WORDS.filter((word) => !bound.has(word));
  } catch {
    // A source that does not parse gets the whole prelude, because an import line above an
    // unparseable body is still unparseable — the parser door stays the parser door.
    names = PRELUDE_WORDS;
  }
  if (names.length === 0) return src;
  const line = `import { ${names.join(', ')} } from 'vitest';\n`;
  if (!src.startsWith('#!')) return `${line}${src}`;
  const afterHashbang = src.indexOf('\n') + 1;
  return `${src.slice(0, afterHashbang)}${line}${src.slice(afterHashbang)}`;
}

/** THE ADDRESS READ — the titles of the tests in one source that will actually run. */
const liveTitlesIn = (src) => classify(src).titles;

/** The SUITE titles of the same source — parsed, kept, and NEVER evidence (the tenth cut). */
const liveSuiteTitlesIn = (src) => classify(src).suiteTitles;

/** Why one source was refused, so the parser door can be told apart from the grammar. */
const parkReasonsFor = (src) => classify(src).reasons;

/**
 * ── THE TENTH STATEMENT'S SECOND HALF: THE DECLARED EVIDENCE ADDRESS (THE CAP) ─
 * EVERY FILE IN tests/ USED TO BE A POSSIBLE CARRIER. Eleven adversarial rounds proved that
 * open address unwinnable: each cut narrowed WHICH SHAPES inside an arbitrary file could carry
 * a marker, and each time an adversary found a shape the previous sentence had no row for —
 * the callee chain, the options bag, the table's cardinality, the callback's context, the
 * block's reachability, the module's bindings, and finally the title's own LAYER. A DESIGNATED
 * ADDRESS retires the question instead of narrowing it: there are three files a marker may
 * stand in, they are listed here, and a reader can audit the whole evidence surface by opening
 * them. Generality is given up ON PURPOSE and this is THE CAP.
 *
 * WHAT THE LIST IS. One literal repo-relative path per evidence home — the tightest pattern
 * there is, and the one that cannot drift into a prefix that admits a file nobody meant:
 *   • SP-B2's home, MEASURED: `filesTitling('SP-B2-LEG-SUPPLY-EVIDENCE')` names exactly this
 *     file today, and the ratchet arm asserts it.
 *   • the sovereignty WAVE-CLOSE INTEGRATION family, which is where a wave-close pin that
 *     supplies this condition belongs and where the mutant corpora below are addressed.
 *   • ES-4's declared home, NOT YET BUILT. The ES charter's VERIFY-AT-BUILD step resolves to
 *     this walker, so the address is declared HERE and the builder reads it here. A marker in
 *     any other file is not evidence — the walker will read the pin, refuse it, and the census
 *     arm below says which addresses are declared and which are still unbuilt.
 *
 * THE COST, STATED: an ES-4 pin written into a differently-named file does not light the wave,
 * and the remedy is a one-line edit to this list (and a re-measure of the census). That is the
 * trade the cap buys — a red that names its own fix, in place of a surface no sentence could
 * close.
 */
const EVIDENCE_FILE_ADDRESSES = Object.freeze([
  'tests/domain/sovereigntyMarketStageWr10w.test.js',
  'tests/domain/sovereigntyWaveCloseIntegration.test.js',
  'tests/domain/espionageDistantSourceEs4.test.js',
]);
/** The declared addresses whose wave has not been built. ES-4's, and today only ES-4's. */
const UNBUILT_EVIDENCE_ADDRESSES = Object.freeze(['tests/domain/espionageDistantSourceEs4.test.js']);
const isEvidenceAddress = (rel) => EVIDENCE_FILE_ADDRESSES.includes(rel);

/** THE REFUSED READ, kept executable so the tightening is PROVEN and not merely claimed:
 *  any occurrence anywhere in the file. Used only by the side-by-side control below. */
const mentionedIn = (src, marker) => src.includes(marker);

/** THE ACCEPTED READ — the marker stands in a title that runs. */
const titledIn = (src, marker) => liveTitlesIn(src).some((title) => title.includes(marker));

/** DECLARED-ADDRESS files whose LIVE TEST TITLES carry a marker token, this walker excluded.
 *  THREE FILTERS AND EACH IS PINNED ALONE BELOW: the address must be DECLARED (the cap), the
 *  file must not be this walker (door 4, now subsumed by the cap and kept as belt), and the
 *  marker must stand in a TEST title that runs (doors 1-3 plus the tenth cut's layer split).
 *  The corpus is a PARAMETER with the tree as its default, which is what lets the mutants
 *  below drive forged corpora through the real `measure` — a tightening that could only be
 *  checked against the tree would be uncheckable on any day the tree agreed. */
const filesTitling = (marker, corpus = TEST_FILES) => corpus
  .filter(({ rel, src }) => isEvidenceAddress(rel) && rel !== SELF_REL && titledIn(src, marker))
  .map(({ rel }) => rel);

/** The same census under the REFUSED read — the control arm, never the measurement. */
const filesMentioning = (marker, corpus = TEST_FILES) => corpus
  .filter(({ rel, src }) => rel !== SELF_REL && mentionedIn(src, marker))
  .map(({ rel }) => rel);

/** THE MEASUREMENT — one wave row to one boolean, by the row's own declared kind. */
function measure(row, corpus = TEST_FILES) {
  if (row.kind === 'FLAG_MANIFEST') {
    return row.manifestFlags.length > 0
      && row.manifestFlags.every((flag) => ENGINE_GATED_VIRTUAL_RULE_KEYS.includes(flag));
  }
  return filesTitling(row.marker, corpus).length > 0;
}

const measured = Object.fromEntries(SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => [row.wave, measure(row)]));

describe('the sovereignty lighting condition — the contract is well-formed', () => {
  test('guard the guard: the tables this walker joins are all live and non-empty', () => {
    // Every claim below is worthless if one of these silently emptied.
    expect(TEST_FILES.length, 'the test-file scan found nothing').toBeGreaterThan(300);
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS.length, 'the CQ5 manifest is empty').toBeGreaterThan(3);
    expect(SOVEREIGNTY_LIGHTING_EVIDENCE).toHaveLength(3);
    // …and the CAP's own table: an empty address list would refuse every marker in the estate
    // and read UNSATISFIED forever, which is the way this door fails silently.
    expect(EVIDENCE_FILE_ADDRESSES.length, 'no evidence address is declared — every marker in'
      + ' the estate is refused and the condition can never be satisfied').toBeGreaterThan(0);
  });

  test('the flag it gates is a REAL war flag, and the three waves are named once each', () => {
    expect(WAR_RULINGS_FLAG_KEYS).toContain(SOVEREIGNTY_LIGHTING_FLAG);
    const waves = SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => row.wave);
    expect(waves).toEqual(['SP-B', 'SP-B2', 'ES-4']);
    expect(new Set(waves).size, 'a wave named twice would be counted twice').toBe(3);
    // Each row supplies a DIFFERENT part of the condition — surfaces, seam, source. Two
    // rows supplying the same thing would mean one of them is not load-bearing.
    expect(new Set(SOVEREIGNTY_LIGHTING_EVIDENCE.map((r) => r.supplies)).size).toBe(3);
  });

  test('every row carries exactly one kind of address, and a written reason', () => {
    const problems = [];
    for (const row of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      const hasFlags = row.manifestFlags.length > 0;
      const hasMarker = row.marker.length > 0;
      if (row.kind === 'FLAG_MANIFEST' && (!hasFlags || hasMarker)) {
        problems.push(`${row.wave}: a FLAG_MANIFEST row names manifest flags and no marker`);
      }
      if (row.kind === 'TEST_MARKER' && (hasFlags || !hasMarker)) {
        problems.push(`${row.wave}: a TEST_MARKER row names a marker and no manifest flags`);
      }
      if (row.why.length < 40) problems.push(`${row.wave}: admitted without a reason`);
    }
    expect(problems, 'the evidence table is malformed').toEqual([]);
  });
});

describe('the sovereignty lighting condition — MEASURED against the tree', () => {
  test('RATCHET: SP-B and SP-B2 have landed, and their evidence is really there', () => {
    // These two waves are IN the tree. Their evidence going missing is a regression, and
    // this is the arm that says so. ES-4 is deliberately not asserted here.
    expect(measured['SP-B'], 'SP-B\'s two family flags are no longer both in the CQ5 manifest'
      + ' — either a flag was dropped or the row\'s spelling drifted').toBe(true);
    expect(measured['SP-B2'], 'no live test carries the SP-B2 leg-supply marker — the pin was'
      + ' renamed past its join key, or deleted').toBe(true);
    // …and the SP-B2 marker sits in exactly one place, so the join cannot be satisfied by
    // a stray copy in a file that proves nothing.
    const spb2 = SOVEREIGNTY_LIGHTING_EVIDENCE.find((row) => row.wave === 'SP-B2');
    expect(filesTitling(spb2.marker)).toEqual(['tests/domain/sovereigntyMarketStageWr10w.test.js']);
  });

  test('THE CONDITION READS SATISFIED IF AND ONLY IF ES-4\'s evidence is found', () => {
    const verdict = evaluateSovereigntyLighting(measured);
    const es4 = SOVEREIGNTY_LIGHTING_EVIDENCE.find((row) => row.wave === 'ES-4');
    const sourceLanded = filesTitling(es4.marker).length > 0;

    // Green in BOTH build states, which is the point: this walker tracks a condition, it
    // does not fail a build for the condition not yet being met.
    expect(SOVEREIGNTY_LIGHTING_STATES).toContain(verdict.state);
    expect(verdict.satisfiable, 'the state disagrees with the measurement that produced it')
      .toBe(sourceLanded);
    expect(verdict.missing, 'SP-B and SP-B2 are landed, so ES-4 is the only wave that may be'
      + ' missing — anything else here is a regression the ratchet above should have caught')
      .toEqual(sourceLanded ? [] : ['ES-4']);
    expect(verdict.flag).toBe(SOVEREIGNTY_LIGHTING_FLAG);
    expect(String(verdict.message).length).toBeGreaterThan(40);
  });

  test('THE NEGATIVE CONTROL: a fabricated marker finds nothing, so "found" is a real read', () => {
    // If the scan were a substring that always hit, every arm above would be theatre.
    expect(filesTitling('SV-0-LIGHTING-MARKER-THAT-NOTHING-CARRIES')).toEqual([]);
    // …and the live marker DOES hit, so the two halves are a real discrimination.
    expect(filesTitling('SP-B2-LEG-SUPPLY-EVIDENCE').length).toBeGreaterThan(0);
    // The line above spells a live marker in an `expect` argument, which is exactly the
    // position door 1 refuses — so this file mentions it without ever carrying it.
    expect(filesMentioning('SP-B2-LEG-SUPPLY-EVIDENCE')).toEqual(filesTitling('SP-B2-LEG-SUPPLY-EVIDENCE'));
  });
});

/**
 * THE ADDRESS RULE — the doors, one pin each. These run against SYNTHETIC sources rather
 * than the tree, so they keep discriminating on the day every wave has landed and the
 * tree can no longer supply a negative case of its own.
 */
describe('the sovereignty lighting condition — a marker is EVIDENCE only in a live title', () => {
  // A token no repository file carries, so a stray tree hit can never green these arms.
  const PROBE = 'ZZ-SYNTHETIC-ADDRESS-PROBE';
  /**
   * A DECLARED evidence address, and one that is not. EVERY forged corpus below is addressed
   * to `AT_ADDRESS`, because under the cap a corpus at an undeclared address is refused at
   * door 0 and every mutant would be green FOR THE WRONG REASON — the classifier would never
   * be consulted at all, and the whole battery would go vacuous in one line. `OFF_ADDRESS` is
   * the cap's own discriminator and is used only where the cap itself is the thing on trial.
   */
  const AT_ADDRESS = 'tests/domain/sovereigntyWaveCloseIntegration.test.js';
  const OFF_ADDRESS = 'tests/domain/notADeclaredEvidenceHome.test.js';
  /**
   * THE BATTERY LEDGER. Each group asserts its own size against this table and the table's
   * SUM is asserted once, so a group that shrinks reds twice — at the group and at the
   * total. A battery that can quietly shrink is a battery that can quietly reopen, and four
   * cuts of this door were falsified by a spelling somebody had already thought of.
   */
  const BATTERY = Object.freeze({
    escapes: 28, provingLane: 11, invented: 18, parserDoor: 2, dataForm: 22, bodyBlock: 27,
    alias: 14, suiteTitle: 8,
  });
  /** Every synthetic source is read WITH the vitest import a real test file carries — see
   *  `withVitest`. The alias battery below is where the prelude itself is put on trial. */
  const carries = (src) => titledIn(withVitest(src), PROBE);
  /** …and the REASONS for the same source, which is the discriminator every individually
   *  pinned clause below uses, because `carries` alone cannot tell a live guard from one
   *  whose work a later clause silently absorbed. */
  const parkedFor = (src) => parkReasonsFor(withVitest(src));
  /** A source is only a forgery if it is a source at all — every refusal below is asserted
   *  to PARSE, so the parser door can never be the thing doing the work by accident. */
  const parses = (src) => !parkedFor(src).some((reason) => reason.startsWith('PARSE:'));
  const body = `\n  it('${PROBE} — a pin that never runs', () => { expect(1).toBe(2); });\n});\n`;
  const inner = `\n  it('${PROBE} — a real body', () => {});\n});\n`;

  test('DOOR 1 ACCEPTS: the marker in the title of a TEST that runs — and only a test', () => {
    expect(carries(`  it('${PROBE} — a real pin', () => { expect(1).toBe(1); });\n`)).toBe(true);
    expect(carries(`test('${PROBE} — a real pin', () => {});\n`)).toBe(true);
    // …AND A SUITE TITLE IS NOT ONE, WHICH IS THE TENTH CUT ASSERTED WHERE THE OLD ACCEPTANCE
    // STOOD. Every cut before this one credited the line below; the whole suite-title battery
    // is at `DOOR 1+2 REFUSE THE SUITE-TITLE FAMILY` and this line is its shortest form, kept
    // here so a reader of the ACCEPT arm cannot miss that the acceptance narrowed.
    expect(carries(`describe('${PROBE} — a real suite', () => {});\n`)).toBe(false);
    // Quote style is not the point, so all three spellings are admitted.
    expect(carries(`  it("${PROBE} — double quoted", () => {});\n`)).toBe(true);
    expect(carries(`  it(\`${PROBE} — templated\`, () => {});\n`)).toBe(true);
    // A modifier that still runs the test keeps the evidence.
    expect(carries(`  it.concurrent('${PROBE} — a real pin', () => {});\n`)).toBe(true);
    // THREE POSITIONS THE FOUR TEXT CUTS ALL LOST, and the AST reads without effort. A
    // table-driven title (the estate spells `it.each`/`test.each` 189 times), a title on a
    // line the reader would have had to rejoin, and a call reopened after another
    // statement — all of these RUN, and all of them are now credited.
    expect(carries(`it.each([1])('${PROBE} — %s', () => {});\n`)).toBe(true);
    expect(carries(`it\n  ('${PROBE} — a real pin, line-broken', () => {});\n`)).toBe(true);
    expect(carries(`describe('a', () => {\n  it('b', () => {});\n}); it('${PROBE} — reopened', () => {});\n`)).toBe(true);
    // …and the static SEGMENTS of an interpolated title are read, so an interpolation in
    // the middle of a title cannot hide the marker standing beside it.
    expect(carries(`it(\`\${prefix} ${PROBE} — interpolated\`, () => {});\n`)).toBe(true);
  });

  test('DOOR 1 REFUSES: a BARE COMMENT no longer flips the condition — the chair control', () => {
    // THE EXECUTED DEFECT THIS INSTRUMENT CLOSES. Under the old `src.includes` read every
    // one of these returned true, and a file containing only the first line read as a
    // landed wave. The paired `mentionedIn` assertion is what makes that a proof rather
    // than a story: the refused read still accepts them, so the two reads really differ.
    const comment = `// ${PROBE}\n`;
    expect(carries(comment)).toBe(false);
    expect(mentionedIn(comment, PROBE)).toBe(true);

    const jsdoc = `/**\n * ${PROBE} — named in a header\n */\n`;
    expect(carries(jsdoc)).toBe(false);
    expect(mentionedIn(jsdoc, PROBE)).toBe(true);

    // A `describe`/`it` spelled inside a comment is still a comment — and under the AST it
    // is not merely unanchored, it does not EXIST.
    const commentedPin = `/**\n * it('${PROBE} — what the pin will say one day')\n */\n`;
    expect(carries(commentedPin)).toBe(false);
    expect(mentionedIn(commentedPin, PROBE)).toBe(true);

    // A string constant is not a title, and neither is another call's argument.
    const constant = `const marker = '${PROBE}';\n`;
    expect(carries(constant)).toBe(false);
    expect(mentionedIn(constant, PROBE)).toBe(true);

    const argument = `    expect(filesTitling('${PROBE}')).toEqual([]);\n`;
    expect(carries(argument)).toBe(false);
    expect(mentionedIn(argument, PROBE)).toBe(true);

    // A NON-STATIC title carries nothing: the marker is not in the file, it is in whatever
    // the expression evaluates to, and this walker does not run the file.
    const computedTitle = `it(marker, () => {});\n`;
    expect(carries(computedTitle)).toBe(false);
  });

  test('DOOR 2 REFUSES: a parked pin proves as little as a comment does', () => {
    for (const modifier of ['skip', 'todo', 'failing', 'fails']) {
      const parked = `  it.${modifier}('${PROBE} — parked', () => {});\n`;
      expect(carries(parked), `it.${modifier} was credited as evidence`).toBe(false);
      expect(mentionedIn(parked, PROBE)).toBe(true);
      expect(parses(parked)).toBe(true);
    }
    // The CONDITIONAL pair, whose argument is evaluated at run time. Measured both ways in
    // a git-archive tree: `runIf(true)` ran and `runIf(false)` skipped, so neither polarity
    // is readable from a syntax tree and both are refused.
    for (const conditional of ['skipIf(true)', 'runIf(true)', 'skipIf(cond)', 'runIf(cond)']) {
      const parked = `  it.${conditional}('${PROBE} — conditional', () => {});\n`;
      expect(carries(parked), `it.${conditional} was credited as evidence`).toBe(false);
    }
    // …and a NON-FOCUSING modifier costs only its OWN title: the file keeps the rest.
    const mixed = `it.skip('${PROBE} — parked', () => {});\nit('${PROBE} — live', () => {});\n`;
    expect(liveTitlesIn(withVitest(mixed))).toEqual([`${PROBE} — live`]);
  });

  test('DOOR 1+2 REFUSE THE SUITE-TITLE FAMILY — a marker one line up, backed by nothing', () => {
    // THE TENTH CUT'S BATTERY, AND THE ONE THAT FALSIFIED THE NINTH CUT'S OPERATIVE SENTENCE
    // WITHOUT VIOLATING ITS TERMINAL ONE. Every source below is a file this walker classifies as
    // FULLY CREDITED — `reasons` is empty, the openers resolve to vitest's own exports by their
    // imported names, the calls are straight-line, context-free, function-bodied and statically
    // registered — and in every one of them vitest registers NOT ONE RUNNABLE TEST under the
    // suite carrying the marker. The first was executed at all three layers against the ninth
    // cut: classifier `{"reasons":[],"titles":["…"]}`, the SHIPPED evaluator reading
    // `SATISFIED / satisfiable true / missing []` off the real ES-4 row, and vitest 4.1.8 in a
    // `git archive` tree reporting `Tests 1 passed | 1 skipped (2)`, exit 0, with the deliberate
    // throw never firing and `vitest list --json` collecting no runnable test for the file.
    //
    // THE ASYMMETRY IT EXPLOITED WAS THIS FILE'S OWN. Door 2 has refused `it.skip('MARKER')`
    // since the first cut — it is pinned directly above — because a parked pin proves as little
    // as a comment does. Moving the SAME marker one line up into the enclosing `describe`
    // defeated that refusal entirely, because `titleArgs` fed suite titles and test titles into
    // one array and `measure` could not tell them apart.
    const suiteTitle = {
      'it.skip under a marker suite': `describe('${PROBE} — the lane', () => {\n`
        + `  it.skip('the pin that never runs', () => { throw new Error('THIS RAN'); });\n});\n`,
      'it.todo WITH a body': `describe('${PROBE} — the lane', () => {\n`
        + `  it.todo('the pin that never runs', () => {});\n});\n`,
      'it.skipIf — THE LIVE ESTATE SHAPE': `describe('${PROBE} — the lane', () => {\n`
        + `  it.skipIf(!gate)('the pin that may never run', () => {});\n});\n`,
      'it.runIf': `describe('${PROBE} — the lane', () => {\n`
        + `  it.runIf(gate)('the pin that may never run', () => {});\n});\n`,
      'it.fails, which runs only to prove a throw': `describe('${PROBE} — the lane', () => {\n`
        + `  it.fails('the pin that runs to fail', () => { throw new Error('x'); });\n});\n`,
      'a NESTED suite whose inner tests are all skipped': `describe('${PROBE} — the lane', () => {\n`
        + `  describe('inner', () => {\n    it.skip('a', () => {});\n    it.skip('b', () => {});\n  });\n});\n`,
      'a table-driven marker suite over skipped rows':
        `describe.each([1])('${PROBE} — the lane %s', () => {\n  it.skip('a', () => {});\n});\n`,
      // THE PUREST FORM, AND THE REASON THE EMPTY-SUITE CASE NEVER CAUGHT THIS. A marker suite
      // ALONE in a file reds loudly (`No test found in suite`); beside a live sibling suite
      // vitest reports `Test Files 1 passed (1)`, exit 0, and nothing distinguishes the file
      // from a healthy one. That is the same mistake-versus-forgery line the zero-row table
      // (L2) and the early return (G2) each drew.
      'a marker suite beside a LIVE sibling suite': `describe('a live sibling', () => {\n`
        + `  it('a real anchor', () => {});\n});\n`
        + `describe('${PROBE} — the lane', () => {\n  it.skip('the pin that never runs', () => {});\n});\n`,
    };
    expect(Object.keys(suiteTitle), 'a suite-title forgery was dropped from the arm')
      .toHaveLength(BATTERY.suiteTitle);
    for (const [spelling, src] of Object.entries(suiteTitle)) {
      expect(carries(src), `${spelling} was credited — a suite title is being read as evidence`)
        .toBe(false);
      expect(parses(src), `${spelling} was refused at the PARSER door, not by the layer split`)
        .toBe(true);
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
      // THE DISCRIMINATOR, AND IT IS WHAT MAKES THIS ARM UNABSORBABLE BY ANY OTHER GUARD. Each
      // source is a fully CREDITED file — no park reason anywhere in it — so nothing in doors
      // 1-3 is in a position to be doing this work. The ONLY thing refusing the marker is the
      // layer split, and the line below says so by reading the title out of `suiteTitles`.
      expect(parkedFor(src), `${spelling} parked, so this arm is not testing the layer split`)
        .toEqual([]);
      expect(liveSuiteTitlesIn(withVitest(src)).some((title) => title.includes(PROBE)),
        `${spelling} did not put the marker in suiteTitles — the arm is vacuous`).toBe(true);
    }

    // …AND THE ACCURACY HALF, without which the split would just be a way to lose evidence: the
    // SAME shapes with the marker in a TEST title are credited exactly as before.
    const stillCredited = {
      'a test title under a plain suite': `describe('the lane', () => {\n`
        + `  it('${PROBE} — a real pin', () => {});\n});\n`,
      'a test title under a NESTED suite': `describe('a', () => {\n  describe('b', () => {\n`
        + `    it('${PROBE} — a real pin', () => {});\n  });\n});\n`,
      'a test title under a table-driven suite':
        `describe.each([1])('the lane %s', () => {\n  it('${PROBE} — a real pin', () => {});\n});\n`,
      'a test title beside a skipped sibling': `describe('the lane', () => {\n`
        + `  it.skip('parked', () => {});\n  it('${PROBE} — a real pin', () => {});\n});\n`,
    };
    expect(Object.keys(stillCredited), 'an accuracy control was dropped').toHaveLength(4);
    for (const [label, src] of Object.entries(stillCredited)) {
      expect(carries(src), `${label} was PARKED but vitest really runs it`).toBe(true);
    }
    // …and the two layers really are two, on ONE source: the suite title is READ and kept, the
    // test title is READ and joined. A cut that merged the arrays again would red here.
    const both = withVitest(`describe('${PROBE} — the suite half', () => {\n`
      + `  it('${PROBE} — the test half', () => {});\n});\n`);
    expect(liveSuiteTitlesIn(both)).toEqual([`${PROBE} — the suite half`]);
    expect(liveTitlesIn(both)).toEqual([`${PROBE} — the test half`]);
  });

  test('DOOR 2 PARKS THE FILE for a test modifier outside BOTH grammars', () => {
    // An unrecognised TEST modifier may be `only`, and `only` silences its siblings — so
    // the fail-closed verdict is the whole file, not just that title. This is the arm that
    // makes the test-side grammar closed rather than a skip-list.
    //
    // `extend({})` IS A NAMED RESIDUAL AND NOT A DEFECT, and it is called out here because
    // the header alone would not be found by whoever trips it. `test.extend({})` is
    // vitest's first-class fixture API, EXECUTED under 4.1.8 and it RUNS — so parking the
    // whole file on it is a TITLE COST, never a credit, which is the safe direction. Zero
    // estate instances today (`grep -rl '\.extend('` over tests/*.test.js|jsx = 0). The day
    // a fixture-using suite lands, this list is where it must be reconciled — by MEASURING
    // the shape under vitest and moving it to a grammar, not by loosening the default.
    for (const shape of ['only', 'onlyIf(true)', 'extend({})', 'invented']) {
      const src = `it.${shape}('elsewhere', () => {});\ndescribe('outer', () => {${inner}`;
      expect(carries(src), `it.${shape} did not park the file`).toBe(false);
      expect(parses(src)).toBe(true);
    }
    // …and the jest-compat prefixes vitest does not export park the same way.
    for (const word of ['xit', 'fit', 'xtest', 'ftest']) {
      expect(carries(`${word}('elsewhere', () => {});\ndescribe('outer', () => {${inner}`),
        `${word} did not park the file`).toBe(false);
    }
  });

  test('DOOR 3 REFUSES: a title inside a parked SUITE, and the whole file with it', () => {
    const parkedSuite = `describe.skip('outer', () => {\n  it('${PROBE} — a real body', () => {});\n});\n`;
    expect(carries(parkedSuite)).toBe(false);
    expect(mentionedIn(parkedSuite, PROBE)).toBe(true);
    // …and the refusal is the SUITE's doing, not the inner line's: the same inner line
    // under a live suite IS evidence. Without this arm door 3 could be refusing for the
    // wrong reason and nothing would say so.
    const liveSuite = `describe('outer', () => {\n  it('${PROBE} — a real body', () => {});\n});\n`;
    expect(carries(liveSuite)).toBe(true);
  });

  test('DOOR 3 REFUSES THE WHOLE ESCAPE BATTERY — four cuts of forgeries, all parseable', () => {
    // THE BATTERY IS KEPT WHOLE rather than rewritten each time a cut lands, so that no
    // earlier round can silently reopen. Every spelling below was CREDITED by the walker at
    // some commit in this file's history, and every one is now a refusal.
    //
    // ROUND ONE (four): door 3 refused a file only where ONE line matched both a
    // `describe(` opener AND a literal dotted `.skip`/`.todo`/`.failing`.
    // ROUND TWO (five): the allowlist was right but read PHYSICAL lines, so the same
    // spellings walked back in with a newline inside them.
    // ROUND THREE (nine): the dangling-head join closed round two, but its head detector
    // and the opener detector shared the character class `[^\]\n]`, so an unterminated
    // computed member walked through both.
    // ROUND FOUR (the polarity's own): the arms that were not spellings at all.
    //
    // UNDER A PARSER NONE OF THESE IS A CATEGORY. They are kept because a battery that
    // shrinks is a battery that can be reopened, and because each one is now ALSO asserted
    // to PARSE — without that, a source refused at the parser door would look exactly like
    // a source refused by the grammar, and this arm would be crediting the wrong door.
    const escapes = {
      'describe.skipIf(true)': `describe.skipIf(true)('parked by skipIf', () => {${body}`,
      "describe['skip']": `describe['skip']('parked by computed member', () => {${body}`,
      'describe . skip (spaced)': `describe . skip ('parked by spaced member', () => {${body}`,
      xdescribe: `xdescribe('parked by the x prefix', () => {${body}`,
      'describe / newline / .skip(': `describe\n  .skip('parked across a line', () => {${body}`,
      'describe. / newline / skip(': `describe.\n  skip('parked across a line', () => {${body}`,
      'describe.skipIf / newline / (true)(': `describe.skipIf\n  (true)('parked across a line', () => {${body}`,
      "describe / newline / ['skip'](": `describe\n  ['skip']('parked across a line', () => {${body}`,
      'describe / newline / .only(': `describe\n  .only('focused across a line', () => {});\ndescribe('outer', () => {${body}`,
      "describe / newline / [ / newline / 'skip' / newline / ](": `describe\n[\n'skip'\n]('bracket walked down', () => {${body}`,
      "describe / newline / ['skip' / newline / ](": `describe\n['skip'\n]('bracket walked down', () => {${body}`,
      "describe[ / newline / 'skip'](": `describe[\n'skip']('the attester spelling', () => {${body}`,
      'describe.concurrent[ / newline / \'skip\'](': `describe.concurrent[\n'skip']('allowlisted, then a bracket', () => {${body}`,
      'describe[ / newline / templated member](': `describe[\n\`skip\`]('a templated member', () => {${body}`,
      "describe['sk' + / newline / 'ip'](": `describe['sk' +\n'ip']('a concatenated member', () => {${body}`,
      "xdescribe[ / newline / 'each'](": `xdescribe[\n'each']('the x prefix plus a bracket', () => {${body}`,
      "suite[ / newline / 'skip'](": `suite[\n'skip']('the suite word', () => {${body}`,
      "describe[ / newline / 'only'](": `describe[\n'only']('focused elsewhere', () => {\n  it('a sibling that really runs', () => {});\n});\ndescribe('outer', () => {${body}`,
      'describe.runIf(true)': `describe.runIf(true)('parked by runIf', () => {${body}`,
      'it / newline / .only(': `it\n  .only('focused elsewhere', () => {});\ndescribe('outer', () => {${body}`,
      'describe / blank lines / .skip(': `describe\n\n\n\n\n  .skip('parked far below', () => {${body}`,
      'describe.skipIf / newline / tagged template': `describe.skipIf\n\`t\`('tagged across a line', () => {${body}`,
      'a suite head that never opens a suite': `  it('${PROBE} — the pin above a bare head', () => {});\ndescribe\n`,
      'the comment-interrupted modifier': `describe/* c */.skip('comment-interrupted', () => {${body}`,
      'a parked suite reopened after });': `describe('live', () => {\n  it('a', () => {});\n});\ndescribe.skip('parked after a close', () => {${body}`,
      'a parked suite introduced by if (x)': `if (x) describe.skip('parked mid-line', () => {${body}`,
      'a ternary-aliased describe.skip': `const d = COND ? describe : describe.skip;\nd('outer', () => {${body}`,
      'a plainly-aliased describe.skip': `const d = describe.skip;\nd('outer', () => {${body}`,
    };
    expect(Object.keys(escapes), 'an escape spelling was dropped from the arm').toHaveLength(BATTERY.escapes);
    for (const [spelling, src] of Object.entries(escapes)) {
      expect(carries(src), `${spelling} was credited — door 3 fails OPEN for it`).toBe(false);
      expect(parses(src), `${spelling} was refused at the PARSER door, not by the grammar`).toBe(true);
      // …and each really is a forgery rather than a source that says nothing: the refused
      // read swallows it whole, so the two reads genuinely disagree on every one.
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }
  });

  test('DOOR 3 REFUSES THE PROVING LANE\'S NINE FORGERIES, in the three classes it found', () => {
    // EVERY ONE OF THESE WAS EXECUTED AGAINST THE FOURTH CUT AND CREDITED BY IT: planted as
    // a real .test.js in a git-archive tree, vitest reported `Tests 1 skipped (1)` with the
    // pin body a deliberate `expect(1).toBe(2)`, and eslint exited 0 for seven of the nine.
    // They are the reason this file stopped classifying text. Each is asserted to PARSE, so
    // none of them is refused by the parser door.
    const forgeries = {
      // CLASS 1 — a leading block comment on the opener line. Named nowhere in the fourth
      // cut, which pinned only a comment BETWEEN the members.
      'a leading block comment, then describe.skip': `/* c */ describe.skip('outer', () => {${body}`,
      'a leading block comment, then a focused sibling': `/* c */ describe.only('elsewhere', () => {});\ndescribe('outer', () => {${body}`,
      'a leading block comment, then describe.skipIf': `/* c */ describe.skipIf(true)('outer', () => {${body}`,
      'an indented block comment, then xdescribe': `  /*c*/ xdescribe('outer', () => {${body}`,
      // CLASS 2 — a computed or destructured alias binding, which the fourth cut's header
      // declared CLOSED. Its `SUITE_VALUE_BOUND` required a DOTTED chain, so every
      // non-dotted way of taking the same modified value walked through.
      'a computed alias binding': `const d = describe['skip'];\nd('outer', () => {${body}`,
      'a let alias assigned a computed member': `let d;\nd = describe["skip"];\nd('outer', () => {${body}`,
      'a destructured alias binding': `const { skip: d } = describe;\nd('outer', () => {${body}`,
      // CLASS 3 — any line prefix outside the three-character class `[;})]` the fourth
      // cut's mid-line arm enumerated. An enumeration is exactly what that cut claimed to
      // have abandoned.
      'a logical-and prefix': `true && describe.skip('outer', () => {${body}`,
      'a void prefix': `void describe.skip('outer', () => {${body}`,
      'a comma-operator prefix': `0, describe.skip('outer', () => {${body}`,
      'an await prefix': `await describe.skip('outer', () => {${body}`,
    };
    expect(Object.keys(forgeries), 'a proven forgery was dropped from the arm').toHaveLength(BATTERY.provingLane);
    for (const [spelling, src] of Object.entries(forgeries)) {
      expect(carries(src), `${spelling} was credited — the parse classifier fails OPEN for it`).toBe(false);
      expect(parses(src), `${spelling} was refused at the PARSER door, not by the grammar`).toBe(true);
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }
  });

  test('DOOR 3 PARSER DOOR: a file this walker cannot parse parks WHOLE', () => {
    // FAIL-CLOSED AT THE PARSER, and pinned as its own door because it is the one refusal
    // the grammar has no part in. A source that does not parse cannot be classified, and an
    // unclassifiable file is exactly the file whose titles must not be believed.
    const unterminated = `describe[\n  it('${PROBE} — the pin below an unclosed head', () => {});\n`;
    expect(carries(unterminated)).toBe(false);
    expect(parkedFor(unterminated).some((r) => r.startsWith('PARSE:')),
      'an unparseable source was refused for some other reason').toBe(true);

    const truncated = `describe('outer', () => {\n  it('${PROBE} — a pin', () => {});\n`;
    expect(carries(truncated)).toBe(false);
    expect(parkedFor(truncated).some((r) => r.startsWith('PARSE:'))).toBe(true);

    // …and the parser door is not swallowing the estate: every real test file parses.
    const unparseable = TEST_FILES.filter(({ src }) => parkReasonsFor(src).some((r) => r.startsWith('PARSE:')));
    expect(unparseable.map(({ rel }) => rel), 'a real estate test file failed to parse').toEqual([]);
  });

  test('DOOR 3 BINDINGS: a suite word bound to a name is opaque, and an ambiguous file parks', () => {
    // A BINDING IS WHERE THE SUITE WORD IS STILL VISIBLE, and the AST makes every spelling
    // of it one shape: declaration, destructure, parameter, non-vitest import.
    expect(carries(`const describe = shim.skip;\ndescribe('outer', () => {${inner}`),
      'the global suite word was rebound and the file was still credited').toBe(false);
    expect(carries(`import { describe } from './shim.js';\ndescribe('outer', () => {${inner}`),
      'a suite word imported from a shim was credited').toBe(false);
    expect(carries(`function open(describe) {\n  describe('outer', () => {${inner}}\nopen(realDescribe);\n`),
      'a suite word taken as a parameter was credited').toBe(false);
    // …AND THE OTHER POLARITY, which is what stops this from parking the estate: a suite
    // word used as an ORDINARY NAME, with no suite ever opened through it, is opaque rather
    // than fatal. A binding on its own must cost nothing — one estate file names a loop
    // variable `suite` — so this arm is the one that would red if the blanket rule (any
    // binding parks the file) were ever adopted in place of the per-word one.
    expect(carries(`const suite = paths[0];\nit('${PROBE} — beside an ordinary name', () => {});\n`),
      'a local binding that happens to be called `suite` parked a live file').toBe(true);
  });

  test('DOOR 3 B1 — THE SHADOW-SWALLOW: a bound word is OPAQUE, and NEVER MUTE', () => {
    // THE SIXTH CUT'S REPAIR, PINNED ON THE CLAUSE ITSELF. The fifth cut skipped every call
    // whose root was bound BEFORE pushing `SUITE_NOT_RUNNING`, so binding a suite word
    // DELETED the park for every non-running suite opened through it. The proving lane
    // executed it: the spelling below read SATISFIED / satisfiable true / missing [] while
    // vitest 4.1.8 reported `1 skipped`, and eslint exited 0 on it.
    const swallow = `import * as V from 'vitest';\nconst { describe, it } = V;\n\n`
      + `describe.skip('the espionage confirmer lane', () => {\n`
      + `  it('${PROBE} — a distant source is confirmed by a covert asset', () => {});\n});\n`;
    expect(carries(swallow), 'the shadow-swallow still credits a suite vitest skips').toBe(false);
    expect(parses(swallow)).toBe(true);
    expect(mentionedIn(swallow, PROBE)).toBe(true);

    // …AND THE REASON IT NOW CARRIES IS THE NINTH CUT'S, WHICH IS THE HONEST RECORD OF A
    // REPAIR BEING RETIRED RATHER THAN KEPT. The sixth cut fixed the swallow by ORDERING a
    // skip after a park push; the ninth cut removed the skip entirely, because a word bound by
    // a destructure never resolves and so never reaches the loop that could have swallowed
    // anything. Both openers in this source are refused at the binding, before any grammar is
    // consulted — so `SUITE_NOT_RUNNING` is no longer what speaks here, and pretending it were
    // would be a pin asserting machinery that is gone.
    expect(parkedFor(swallow), 'the destructured suite word resolved to something')
      .toEqual(['OPENER_UNRESOLVED:describe', 'OPENER_UNRESOLVED:it']);
    // …and the CHAIN guard is still pinned alone, on a source where the word DOES resolve, so
    // retiring the shadow machinery did not take `SUITE_NOT_RUNNING` down with it.
    expect(parkedFor(`describe.skip('outer', () => {${inner}`),
      'the running-grammar refusal stopped firing on a resolved suite word')
      .toEqual(['SUITE_NOT_RUNNING:describe.skip', 'TEST_UNREGISTERED:it']);

    // THE FULL 6 x 3 MATRIX THE PROVING LANE EXECUTED. The shipped pin covered only the
    // bound-word + RUNNING-opener corner (`SUITE_SHADOW_AMBIGUOUS`); its complement — bound
    // word + NON-RUNNING opener — was the leak, in all six binder spellings.
    const binders = {
      'a const declaration': 'const describe = shim.thing;\n',
      'a destructure from a namespace': `import * as V from 'vitest';\nconst { describe } = V;\n`,
      'a non-vitest import specifier': `import { describe } from './shim.js';\n`,
      'a function parameter': 'function open(describe) { return describe; }\n',
      'a catch parameter': 'try { x(); } catch (describe) { void describe; }\n',
      'a function declaration id': 'function describe(n, f) {}\n',
    };
    const openers = ['describe(', 'describe.skip(', 'describe.only('];
    expect(Object.keys(binders)).toHaveLength(6);
    for (const [label, binder] of Object.entries(binders)) {
      for (const opener of openers) {
        const src = `${binder}${opener}'outer', () => {${inner}`;
        expect(carries(src), `${label} + ${opener} was CREDITED — the matrix leaks again`).toBe(false);
        expect(parses(src), `${label} + ${opener} was refused at the PARSER door`).toBe(true);
        expect(mentionedIn(src, PROBE)).toBe(true);
      }
    }
    // …AND THE TWO HALVES NOW PARK FOR THE **SAME** REASON, WHICH IS THE POINT OF THE NINTH
    // CUT AND NOT A LOSS OF DISCRIMINATION. The sixth cut needed two guards here — one for the
    // bound word under a RUNNING opener (`SUITE_SHADOW_AMBIGUOUS`) and one for its complement
    // under a NON-RUNNING one (`SUITE_NOT_RUNNING`) — and the leak it was falsified for lived
    // exactly in the seam between them. Under positive resolution there is no seam: a word
    // that does not resolve is refused whatever follows it, so the modifier is never reached.
    // One predicate replaces the pair, and the pair's failure mode with it.
    expect(parkedFor(`const describe = shim.thing;\ndescribe('outer', () => {${inner}`))
      .toEqual(['TEST_UNREGISTERED:it', 'OPENER_UNRESOLVED:describe']);
    expect(parkedFor(`const describe = shim.thing;\ndescribe.skip('outer', () => {${inner}`),
      'the modifier changed the verdict for a word that never resolved')
      .toEqual(['TEST_UNREGISTERED:it', 'OPENER_UNRESOLVED:describe']);
  });

  test('DOOR 2 B2 — TEST-WORD BINDINGS: a bound `it`/`test` is opaque exactly as a suite is', () => {
    // THE SECOND SEMANTIC HOLE, EXECUTED AGAINST THE FIFTH CUT. `markShadowed` and the
    // non-vitest import clause both keyed on SUITE_ROOTS, so TEST_ROOTS never entered the
    // shadow set at all and a locally declared, destructured, aliased or shim-imported
    // `it`/`test` kept FULL title credit while registering nothing. The proving lane ran the
    // source below: the walker read the forged title, vitest reported only the real anchor,
    // the file was GREEN and eslint exited 0.
    const noOpShadow = `import { describe, expect, it as vitestIt } from 'vitest';\n`
      + 'function it(name, fn) {}\n'
      + `describe('outer', () => {\n`
      + `  vitestIt('a real anchor so the file is not empty', () => { expect(1).toBe(1); });\n`
      + `  it('${PROBE} — forged', () => { throw new Error('THIS RAN'); });\n});\n`;
    expect(carries(noOpShadow), 'a no-op local `it` still forges a title').toBe(false);
    expect(parses(noOpShadow)).toBe(true);
    expect(mentionedIn(noOpShadow, PROBE)).toBe(true);
    // …and it is the BINDING clause that does it, alone and on its own reason: the forged call
    // sits at a registered position inside a credited suite, in the running grammar, with a
    // function body and no context parameter, so nothing else in this file is in a position to
    // speak. Note the shape of the source — the real `it` IS imported here, under the alias
    // `vitestIt`, and the walker credits the anchor through it while refusing the local `it`.
    expect(parkedFor(noOpShadow), 'a locally declared `it` resolved to vitest\'s')
      .toEqual(['OPENER_UNRESOLVED:it']);

    // THE OTHER SPELLINGS THE PROVING LANE MEASURED, each independently credited before.
    const bindings = {
      'a shim import of it': `import { it } from './shim.js';\nit('${PROBE} — forged', () => {});\n`,
      'a destructured it': `const { it } = helpers;\nit('${PROBE} — forged', () => {});\n`,
      'a const-declared test': `const test = shim.t;\ntest('${PROBE} — forged', () => {});\n`,
      'a callback parameter named test': `rows.forEach((test) => test('${PROBE} — forged', () => {}));\n`,
      'a catch parameter named it': `try { x(); } catch (it) { void it; }\nit('${PROBE} — forged', () => {});\n`,
      'a function declaration named test': `function test(n, f) {}\ntest('${PROBE} — forged', () => {});\n`,
    };
    expect(Object.keys(bindings), 'a measured test-word binding was dropped').toHaveLength(6);
    for (const [label, src] of Object.entries(bindings)) {
      expect(carries(src), `${label} was CREDITED — the test door is not shadow-aware`).toBe(false);
      expect(parses(src), `${label} was refused at the PARSER door`).toBe(true);
      expect(mentionedIn(src, PROBE)).toBe(true);
    }
    // …AND THE OTHER POLARITY AGAIN, which is what keeps this from parking the estate on
    // sight: 29 estate files bind a test word today (tests/domain/coalitionTrust.test.js
    // spells `const snap = (it) => ({ settlements: [it] });`), and a binding with NO test
    // opened through that word must stay opaque rather than fatal.
    expect(carries(`const snap = (it) => ({ settlements: [it] });\n`
      + `describe('outer', () => {\n  test('${PROBE} — beside a bound test word', () => {});\n});\n`),
      'a helper parameter named `it` parked a file that opens no test through it').toBe(true);
    expect(carries(`const its = rows.map((row) => row.it);\nit('${PROBE} — beside a property read', () => {});\n`),
      'reading a PROPERTY called `it` was treated as a binding').toBe(true);
  });

  test('DOOR 2 B3 — STATIC REGISTRATION: a test that is never invoked is never evidence', () => {
    // THE THIRD SEMANTIC HOLE, NAMED NOWHERE BEFORE. Every source here is a real vitest
    // `it`, squarely inside the running grammar, that vitest REGISTERS NOTHING FOR — the
    // proving lane ran each as a real .test.js and each file was green with the title
    // absent. Door 2's old law was a GRAMMAR claim; reachability is a separate claim and it
    // is now made, conservatively: credit only at statement positions the parser can reach.
    const unreachable = {
      'a never-invoked function declaration': `function never() { it('${PROBE} — forged', () => {}); }\n`,
      'a forEach callback over an array': `const cases = [];\ncases.forEach((c) => it(\`${PROBE} \${c}\`, () => {}));\n`,
      'a for-of loop body': `for (const c of cases) {\n  it(\`${PROBE} \${c}\`, () => {});\n}\n`,
      'an if (false) block': `if (false) { it('${PROBE} — forged', () => {}); }\n`,
      'an if (cond) block that may never run': `if (cond) { it('${PROBE} — forged', () => {}); }\n`,
      'a while loop body': `while (more()) { it('${PROBE} — forged', () => {}); }\n`,
      'a try block': `try { it('${PROBE} — forged', () => {}); } catch (e) { void e; }\n`,
      'a nested arrow that is never called': `const run = () => { it('${PROBE} — forged', () => {}); };\n`,
      'a loop INSIDE a credited suite': `describe('outer', () => {\n  for (const c of cases) {\n`
        + `    it(\`${PROBE} \${c}\`, () => {});\n  }\n});\n`,
      'a helper called from inside a credited suite': `function add() { it('${PROBE} — forged', () => {}); }\n`
        + `describe('outer', () => { add(); });\n`,
      'a suite opened inside a helper': `function mk() { describe('${PROBE} — forged', () => {}); }\n`,
      'a suite opened inside a loop': `for (const c of cases) { describe(\`${PROBE} \${c}\`, () => {}); }\n`,
      'a test under a suite that is itself unregistered': `function mk() {\n  describe('outer', () => {\n`
        + `    it('${PROBE} — forged', () => {});\n  });\n}\n`,
    };
    expect(Object.keys(unreachable), 'an unreachable shape was dropped from the arm').toHaveLength(13);
    for (const [label, src] of Object.entries(unreachable)) {
      expect(carries(src), `${label} was CREDITED but vitest registers nothing for it`).toBe(false);
      expect(parses(src), `${label} was refused at the PARSER door, not by the rule`).toBe(true);
      expect(mentionedIn(src, PROBE)).toBe(true);
    }
    // B3's clause pinned ALONE, on its own reason, in a source no other clause touches: no
    // binding anywhere, a running grammar, a parseable file.
    expect(parkedFor(`function never() { it('${PROBE} — forged', () => {}); }\n`))
      .toEqual(['TEST_UNREGISTERED:it']);
    expect(parkedFor(`function mk() { describe('${PROBE} — forged', () => {}); }\n`))
      .toEqual(['SUITE_UNREGISTERED:describe']);

    // …AND THE ACCURACY HALF, without which this rule would be a way to park the estate.
    // Every registered position vitest really runs is still credited.
    const registered = {
      'a top-level test': `it('${PROBE} — real', () => {});\n`,
      'a test in a credited suite': `describe('outer', () => {\n  it('${PROBE} — real', () => {});\n});\n`,
      'a test in a NESTED credited suite': `describe('a', () => {\n  describe('b', () => {\n`
        + `    it('${PROBE} — real', () => {});\n  });\n});\n`,
      'a function-expression callback': `describe('outer', function () {\n  it('${PROBE} — real', () => {});\n});\n`,
      'a table-driven test': `it.each([1])('${PROBE} — %s', () => {});\n`,
      'a table-driven SUITE': `describe.each([1])('outer %s', () => {\n  it('${PROBE} — real', () => {});\n});\n`,
      'a concurrent suite': `describe.concurrent('outer', () => {\n  it('${PROBE} — real', () => {});\n});\n`,
      'a test beside statements in the same block': `describe('outer', () => {\n  const x = 1;\n`
        + `  beforeEach(() => { void x; });\n  it('${PROBE} — real', () => {});\n});\n`,
    };
    expect(Object.keys(registered), 'a running shape was dropped from the accuracy half').toHaveLength(8);
    for (const [label, src] of Object.entries(registered)) {
      expect(carries(src), `${label} was PARKED but vitest really registers it`).toBe(true);
    }
    // THE REFORMAT THIS RULE COSTS, AND THE ONE IT ACCEPTS, side by side — the loop form
    // parks and its `it.each` rewrite does not, which is the whole remedy for the 121
    // estate files enumerated in the sixth cut's landing commit.
    //
    // THE REMEDY IS NARROWED BY L2 AND THE NARROWING IS STATED HERE, where whoever pays the
    // reformat debt will read it: `it.each(cases)` on a NON-LITERAL table no longer buys a
    // file back, because a table whose length this reader cannot compute may be empty and an
    // empty table registers nothing. The reformat that works is an INLINE LITERAL table.
    expect(carries(`describe('outer', () => {\n  for (const c of cases) {\n`
      + `    it(\`${PROBE} \${c}\`, () => {});\n  }\n});\n`)).toBe(false);
    expect(carries(`describe('outer', () => {\n  it.each(cases)(\`${PROBE} %s\`, () => {});\n});\n`)).toBe(false);
    expect(carries(`describe('outer', () => {\n  it.each(['a', 'b'])(\`${PROBE} %s\`, () => {});\n});\n`)).toBe(true);
  });

  test('DOOR 3 REFUSES TWENTY INVENTED SPELLINGS — the lexical layer, independently probed', () => {
    // THE PROVING LANE'S OWN INVENTIONS, kept as executed controls beside the shipped
    // battery. None of these was ever credited by the fifth cut — they are here because the
    // one claim of that cut which SURVIVED adversarial pressure was the lexical one, and a
    // surviving claim that is not pinned is a claim that can be quietly reopened. Every
    // entry below carries the marker under the refused read and parks under the accepted
    // one, and each is asserted to PARSE so the parser door is not doing the work.
    const LINE_SEPARATOR = String.fromCharCode(0x2028);
    const RLO = String.fromCharCode(0x202e);
    const PDI = String.fromCharCode(0x2069);
    const invented = {
      'a unicode-escaped IDENTIFIER': `d\\u0065scribe.skip('escaped identifier', () => {${body}`,
      'a unicode-escaped PROPERTY': `describe.sk\\u0069p('escaped property', () => {${body}`,
      'an optional-chained modifier': `describe?.skip('optional chain', () => {${body}`,
      'an optional-chained COMPUTED modifier': `describe?.['skip']('optional computed', () => {${body}`,
      'a LINE SEPARATOR inside the chain': `describe${LINE_SEPARATOR}.skip('U+2028 mid-chain', () => {${body}`,
      'a parenthesised head': `(((describe))).skip('parenthesised head', () => {${body}`,
      'a bidi trojan-source comment': `/* ${RLO}piks.${PDI} */ describe.skip('trojan source', () => {${body}`,
      'a comment that READS .concurrent while the code says .skip':
        `describe/* ${RLO}tnerrucnoc.${PDI} */.skip('a lying comment', () => {${body}`,
      'a .bind re-head': `describe.skip.bind(null)('rebound head', () => {${body}`,
      'a comma-expression head, BARE': `(0, describe)('comma head', () => {${body}`,
      'a comma-expression head, MODIFIED': `(0, describe.skip)('comma head modified', () => {${body}`,
      'a hashbang prefix': `#!/usr/bin/env node\ndescribe.skip('below a hashbang', () => {${body}`,
      'an ASI split': `const a = 1\ndescribe.skip('after an ASI split', () => {${body}`,
      'a tagged-template head': `describe.skip\`t\`('tagged head', () => {${body}`,
      'numeric-separator noise': `const n = 1_000_000;\ndescribe.skip('after a separator', () => {${body}`,
      'a class static block': `class C { static { describe.skip('in a static block', () => {${body} } }\n`,
      'an optional chain, computed, across line breaks': `describe\n  ?.\n  ['skip']('walked down', () => {${body}`,
      'a Reflect.apply re-head': `Reflect.apply(describe.skip, null, ['reflected', () => {\n`
        + `  it('${PROBE} — a pin that never runs', () => {});\n}]);\n`,
    };
    expect(Object.keys(invented), 'an invented spelling was dropped from the arm').toHaveLength(BATTERY.invented);
    for (const [spelling, src] of Object.entries(invented)) {
      expect(carries(src), `${spelling} was credited — the lexical layer fails OPEN for it`).toBe(false);
      expect(parses(src), `${spelling} was refused at the PARSER door, not by the grammar`).toBe(true);
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }
    // …and the two that die at the PARSER door instead, which is the fail-closed half.
    const parserDoor = {
      'an HTML comment open': `<!-- describe('outer', () => {${body}`,
      'a malformed Reflect.apply': `Reflect.apply(describe.skip, null, ['broken', () => {${body}`,
    };
    expect(Object.keys(parserDoor)).toHaveLength(BATTERY.parserDoor);
    for (const [spelling, src] of Object.entries(parserDoor)) {
      expect(carries(src), `${spelling} was credited`).toBe(false);
      expect(parses(src), `${spelling} parsed — it belongs in the grammar half of this arm`).toBe(false);
    }
    // THE WHOLE BATTERY IS 130 ENTRIES — 28 escapes + 11 proving-lane forgeries + 18 newly
    // invented spellings + 2 that die at the parser door + 22 data-form forgeries + 27 body
    // and block forgeries + 14 alias forgeries + 8 suite-title forgeries — and the total is
    // asserted here so that dropping a group reds even if its own arm is deleted with it.
    expect(Object.values(BATTERY).reduce((a, b) => a + b, 0),
      'the refusal battery shrank — a closed round has been reopened').toBe(130);
  });

  test('DOOR 2+3 REFUSE THE TWO DATA-FORM FORGERY FAMILIES — run-control that is not a chain', () => {
    // THE SEVENTH CUT'S OWN BATTERY, AND THE REASON THIS FILE EXISTS IN ITS CURRENT SHAPE.
    // The sixth cut's stated falsifier — "a suite or test this walker CREDITS that vitest
    // does not RUN" — was MET TWICE by the adversarial endgame, in shapes no spelling and no
    // binding could have produced, because both take run-control from somewhere the callee
    // chain is not. Every spelling below is the endgame's own, and every behaviour claimed
    // for it was RE-EXECUTED by this lane under vitest 4.1.8 in a git-archive tree, planted
    // as real .test.js files beside a green anchor. Each was CREDITED by the sixth cut with
    // `reasons=[]` and read `SATISFIED / satisfiable true / missing []` off the SHIPPED
    // evaluator; each parks here.
    //
    // FAMILY 1 — THE OPTIONS BAG. vitest 4's second-positional object expresses `.skip`,
    // `.only`, `.todo`, `.fails` and `.concurrent` as DATA. Executed, each beside a passing
    // anchor: `{ skip: true }` → `↓ skipped`; `{ todo: true }` → `□ todo`; a bagged
    // `describe` skipped its whole block while a neighbouring suite ran; `{ fails: true }` →
    // `1 expected fail`; `{ only: true }` RAN its own marker and left its SAME-FILE SIBLING
    // `↓ skipped`, which is the exact consequence door 2's closed grammar exists to prevent.
    //
    // FAMILY 1b — THE ABSENT BODY, which no cut before this one named and which the same
    // predicate closes. Executed: `it('x')` with no second argument reported `□ todo` and
    // never ran; `describe('x')` with no callback registered nothing at all and the file was
    // green. Both were credited by the sixth cut — bare word, running grammar, statically
    // registered, static title — so the absent body is a forgery of the same family.
    //
    // FAMILY 2 — THE ZERO-ROW AND UNPROVEN TABLE. `each`/`for` sit in both running grammars
    // and the grammar demands only that the returned function BE CALLED, never that the table
    // have rows. Executed: `describe.each([])('MARKER — %s', …)` and `it.each([])(…)`, each
    // beside a real anchor, registered ZERO tests while the file reported the anchor passing
    // and exited 0. Alone in a file the same source reds loudly; beside an anchor it is
    // SILENT, which is the property that makes it a forgery rather than a mistake.
    const anchor = `\n  it('a real anchor that really runs', () => {});\n});\n`;
    const dataForm = {
      // FAMILY 1 — the endgame's six, verbatim.
      'it + { skip: true }': `it('${PROBE} — bagged skip', { skip: true }, () => { throw new Error('THIS RAN'); });\n`,
      'it + { todo: true }': `it('${PROBE} — bagged todo', { todo: true }, () => {});\n`,
      'describe + { skip: true }, pin inside': `describe('outer', { skip: true }, () => {${body}`,
      'it + { only: true }, the pin on its SILENCED sibling':
        `it('elsewhere', { only: true }, () => {});\nit('${PROBE} — the sibling vitest skips', () => {});\n`,
      'it + { fails: true }': `it('${PROBE} — bagged fails', { fails: true }, () => { throw new Error('x'); });\n`,
      'it.each([1]) + { skip: true }': `it.each([1])('${PROBE} — %s', { skip: true }, () => {});\n`,
      // …and the shapes the RULE closes beside them, each measured under the same rule.
      'it + { concurrent: true }, WHICH RUNS': `it('${PROBE} — bagged concurrent', { concurrent: true }, () => {});\n`,
      'it + an EMPTY bag': `it('${PROBE} — empty bag', {}, () => {});\n`,
      'describe.each([1]) + { skip: true }': `describe.each([1])('outer %s', { skip: true }, () => {${body}`,
      // FAMILY 1, the non-object halves of "anything but a function".
      'it + an identifier body': `it('${PROBE} — a named body', sharedBody);\n`,
      'it + a member-read body': `it('${PROBE} — a borrowed body', bodies.shared);\n`,
      'it + a call-expression body': `it('${PROBE} — a built body', makeBody());\n`,
      // FAMILY 1b — the absent body, executed as a todo and as nothing at all.
      'it with NO second argument': `it('${PROBE} — no body at all');\n`,
      'describe with NO callback': `describe('${PROBE} — a suite with no body');\n`,
      // FAMILY 2 — the endgame's two, verbatim, then the rest of the class.
      'describe.each([]), pin inside': `describe.each([])('outer — %s', () => {${body}`,
      'it.each([])': `it.each([])('${PROBE} — %s', () => {});\n`,
      'it.for([])': `it.for([])('${PROBE} — %s', () => {});\n`,
      'describe.for([]), pin inside': `describe.for([])('outer — %s', () => {${body}`,
      'it.each(identifier)': `it.each(rows)('${PROBE} — %s', () => {});\n`,
      'it.each([...spread])': `it.each([...rows])('${PROBE} — %s', () => {});\n`,
      'it.each(call())': `it.each(rows.filter(Boolean))('${PROBE} — %s', () => {});\n`,
      'it.each([, 1]) — a table with a HOLE': `it.each([, 1])('${PROBE} — %s', () => {});\n`,
    };
    expect(Object.keys(dataForm), 'a data-form forgery was dropped from the arm')
      .toHaveLength(BATTERY.dataForm);
    for (const [spelling, src] of Object.entries(dataForm)) {
      expect(carries(src), `${spelling} was credited — a data channel of run-control leaks`).toBe(false);
      expect(parses(src), `${spelling} was refused at the PARSER door, not by the rule`).toBe(true);
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }

    // THE FOUR NEW CLAUSES PINNED INDIVIDUALLY, EACH ON ITS OWN REASON AND EACH IN A SOURCE
    // NO OTHER CLAUSE TOUCHES. This is the defence-in-depth corollary and it has bitten this
    // program twice: a `carries` assertion alone would be green while a second guard silently
    // covered a deleted first, so the discriminator is the REASON STRING.
    expect(parkedFor(`it('${PROBE} — bagged', { skip: true }, () => {});\n`))
      .toEqual(['TEST_ARG_FORM:it']);
    expect(parkedFor(`describe('${PROBE} — bagged', { skip: true }, () => {});\n`))
      .toEqual(['SUITE_ARG_FORM:describe']);
    expect(parkedFor(`it.each([])('${PROBE} — %s', () => {});\n`))
      .toEqual(['TEST_TABLE_UNPROVEN:it.each()']);
    expect(parkedFor(`describe.each([])('${PROBE} — %s', () => {});\n`))
      .toEqual(['SUITE_TABLE_UNPROVEN:describe.each()']);

    // …AND `creditedSuiteBody`'s OWN COPY OF BOTH RULES, which the classifier's park SILENTLY
    // COVERS — measured, not assumed: deleting that clause left all 29 arms green, because a
    // file whose suite already parked has no titles to lose either way. This program's most
    // repeated verification failure, reproduced inside the repair for it, for the third time.
    // The observable difference is the REGISTRATION it hands out: a suite refused by L1 or L2
    // must open NO registered scope, so the test underneath it is UNREGISTERED too, and the
    // REASON SET is the only place that shows. Delete the clause and exactly these two reds.
    expect(parkedFor(`describe('outer', { skip: true }, () => {\n`
      + `  it('${PROBE} — under a bagged suite', () => {});\n});\n`),
    'a suite refused by L1 still handed out registration to the tests inside it')
      .toEqual(['SUITE_ARG_FORM:describe', 'TEST_UNREGISTERED:it']);
    expect(parkedFor(`describe.each(rows)('outer %s', () => {\n`
      + `  it('${PROBE} — under an unproven table', () => {});\n});\n`),
    'a suite refused by L2 still handed out registration to the tests inside it')
      .toEqual(['SUITE_TABLE_UNPROVEN:describe.each()', 'TEST_UNREGISTERED:it']);

    // …AND THE ACCURACY HALF OF BOTH RULES, without which each would be a way to park the
    // estate rather than a rule. A function body in position two is credited in every
    // spelling vitest accepts, and a table with statically present rows still runs.
    const accurate = {
      'an arrow body': `it('${PROBE} — real', () => {});\n`,
      'a function-expression body': `it('${PROBE} — real', function () {});\n`,
      'an async arrow body': `it('${PROBE} — real', async () => {});\n`,
      'a generator body': `it('${PROBE} — real', function* () {});\n`,
      'a body followed by a numeric timeout': `it('${PROBE} — real', () => {}, 5000);\n`,
      'a one-row literal table': `it.each([1])('${PROBE} — %s', () => {});\n`,
      'a multi-row literal table': `it.each([[1, 2], [3, 4]])('${PROBE} — %s %s', () => {});\n`,
      'a literal table of objects': `it.each([{ a: 1 }])('${PROBE} — %s', () => {});\n`,
      'a literal table on a SUITE': `describe.each(['a'])('outer %s', () => {${inner}`,
      'a literal table under for': `it.for([1])('${PROBE} — %s', () => {});\n`,
    };
    expect(Object.keys(accurate), 'an accuracy control was dropped').toHaveLength(10);
    for (const [label, src] of Object.entries(accurate)) {
      expect(carries(src), `${label} was PARKED but vitest really runs it`).toBe(true);
    }

    // THE THIRD-POSITIONAL BAG IS NOT A ROUTE, AND IT IS NAMED RATHER THAN GUARDED.
    // EXECUTED: `it(name, fn, { skip: true })` throws under 4.1.8 — `Signature
    // "test(name, fn, { ... })" was deprecated in Vitest 3 and removed in Vitest 4` — so the
    // file dies loudly and forges nothing. This walker CREDITS it, which is correct: a source
    // that cannot run at all is not a source that can lie about running.
    expect(carries(`it('${PROBE} — third positional', () => {}, { skip: true });\n`)).toBe(true);
  });

  test('DOOR 2+3 REFUSE THE BODY AND THE BLOCK — run-control that is not the call at all', () => {
    // THE EIGHTH CUT'S BATTERY, AND THE FIRST ONE WHOSE SHAPES ARE NOT PROPERTIES OF A CALL.
    // The seventh cut's stated falsifier — "a suite or test this walker CREDITS that vitest
    // does not RUN" — was met twice more by the adversarial endgame, through the callback's own
    // TestContext and through the reachability of the statement position inside a credited
    // suite's block. Every spelling below was CREDITED by the seventh cut with `reasons=[]`,
    // and the two the endgame planted as real .test.js files under vitest 4.1.8 read
    // `SATISFIED / satisfiable true / missing []` off the SHIPPED evaluator while vitest either
    // reported the marker `↓ skipped` or registered NO ROW FOR IT AT ALL, exit 0 both times.
    //
    // FAMILY A — THE BODY'S OWN CONTEXT. `TestContext.skip` is declared at
    // node_modules/@vitest/runner/dist/tasks.d-DEYaIMIu.d.ts:1310, and the same file records at
    // :325 that a "dynamic `ctx.skip()` call" cancels the test. Executed:
    // `it('MARKER', ({ skip }) => { skip(); throw new Error('THIS RAN'); })` reported
    // `↓ MARKER 0ms` and the throw never fired; `beforeEach(({ skip }) => skip())` did the same
    // to every test in the suite beneath it. G1 refuses ANY declared parameter rather than a
    // referenced `skip`, because reading the reference is a scope analysis and `const s =
    // ctx.skip` defeats it in one line — which is exactly how four cuts of door 3 died.
    //
    // FAMILY B — THE BLOCK'S OWN REACHABILITY, WHICH FALSIFIED A SENTENCE THIS FILE HAD ALREADY
    // WRITTEN. The sixth cut claimed "credit is granted only at statement positions reachable
    // from the module body"; `markRegistered` was positional, so a statement after a `return`
    // in a credited suite's block was still a direct statement of that block. Executed: a suite
    // holding one real anchor, then `if (!GATE) return;`, then the marker, registered no row for
    // the marker, `Test Files 3 passed (3)`, exit 0. THE ANCHOR IS WHY SEVEN CUTS MISSED IT —
    // the same suite WITHOUT it reds loudly (`Error: No test found in suite outer 01`,
    // executed), which is the same mistake-versus-forgery line the zero-row table drew.
    const dead = `\n  it('${PROBE} — a pin that never runs', () => { expect(1).toBe(2); });\n});\n`;
    const bodyBlock = {
      // FAMILY A — the endgame's two, verbatim, then the rest of the class.
      'it + a destructured { skip } context':
        `it('${PROBE} — ctx skip', ({ skip }) => { skip(); throw new Error('THIS RAN'); });\n`,
      'beforeEach + a destructured { skip }, the pin beside it':
        `beforeEach(({ skip }) => { skip(); });\nit('${PROBE} — skipped by a hook', () => {});\n`,
      'it + a NAMED context parameter': `it('${PROBE} — named ctx', (ctx) => { ctx.skip(); });\n`,
      'it + a context parameter it never touches': `it('${PROBE} — an unused ctx', (t) => { void t; });\n`,
      'it + a RENAMED destructure': `it('${PROBE} — renamed', ({ skip: cancel }) => { cancel(); });\n`,
      'it + a DEFAULTED destructure': `it('${PROBE} — defaulted', ({ skip } = {}) => { skip(); });\n`,
      'it + a REST parameter': `it('${PROBE} — rest', (...args) => { args[0].skip(); });\n`,
      'it + a function-expression body that takes ctx':
        `it('${PROBE} — fn ctx', function (ctx) { ctx.skip(); });\n`,
      'it.each + a row parameter': `it.each([1])('${PROBE} — %s', (n) => { void n; });\n`,
      'describe + a context parameter, pin inside': `describe('outer', ({ skip }) => {${dead}`,
      'beforeAll + a context parameter':
        `beforeAll((ctx) => { ctx.skip(); });\nit('${PROBE} — skipped by a hook', () => {});\n`,
      'afterEach + a context parameter':
        `afterEach((ctx) => { void ctx; });\nit('${PROBE} — beside a ctx hook', () => {});\n`,
      'a ctx hook INSIDE a credited suite':
        `describe('outer', () => {\n  beforeEach(({ skip }) => { skip(); });${dead}`,
      'aroundEach + a continuation parameter':
        `aroundEach((run) => { void run; });\nit('${PROBE} — beside an around hook', () => {});\n`,
      // FAMILY B — the endgame's early return, verbatim, then the rest of the class.
      'the endgame\'s early return, beside a live anchor': `describe('the espionage confirmer lane', () => {\n`
        + `  it('an anchor so the suite is not empty', () => {});\n  if (!GATE) return;\n`
        + `  it('${PROBE} — after an early return', () => {});\n});\n`,
      'a bare return above the pin': `describe('outer', () => {\n  it('anchor', () => {});\n`
        + `  return;\n  it('${PROBE} — below a bare return', () => {});\n});\n`,
      'a return BELOW the pin, which parks the block all the same':
        `describe('outer', () => {\n  it('${PROBE} — above a return', () => {});\n  return;\n});\n`,
      'a throw in the block': `describe('outer', () => {\n`
        + `  it('${PROBE} — beside a throw', () => {});\n  throw new Error('x');\n});\n`,
      'a conditional registration': `describe('outer', () => {\n`
        + `  if (cond) { it('${PROBE} — conditional', () => {}); }\n});\n`,
      'a for-of loop beside the pin': `describe('outer', () => {\n`
        + `  it('${PROBE} — beside a loop', () => {});\n  for (const c of cases) { void c; }\n});\n`,
      'a while loop beside the pin': `describe('outer', () => {\n`
        + `  it('${PROBE} — beside a while', () => {});\n  while (more()) { break; }\n});\n`,
      'a switch beside the pin': `describe('outer', () => {\n`
        + `  it('${PROBE} — beside a switch', () => {});\n  switch (x) { default: break; }\n});\n`,
      'a try wrapping the pin': `describe('outer', () => {\n`
        + `  try { it('${PROBE} — in a try', () => {}); } catch (e) { void e; }\n});\n`,
      'a bare block wrapping the pin': `describe('outer', () => {\n`
        + `  { it('${PROBE} — in a bare block', () => {}); }\n});\n`,
      'a labelled statement wrapping the pin': `describe('outer', () => {\n`
        + `  done: { it('${PROBE} — labelled', () => {}); }\n});\n`,
      'an assignment expression beside the pin': `describe('outer', () => {\n`
        + `  it('${PROBE} — beside an assignment', () => {});\n  seen = true;\n});\n`,
      'a NESTED suite whose block returns early': `describe('a', () => {\n  describe('b', () => {\n`
        + `    it('anchor', () => {});\n    if (!GATE) return;\n`
        + `    it('${PROBE} — nested, after a return', () => {});\n  });\n});\n`,
    };
    expect(Object.keys(bodyBlock), 'a body-or-block forgery was dropped from the arm')
      .toHaveLength(BATTERY.bodyBlock);
    for (const [spelling, src] of Object.entries(bodyBlock)) {
      expect(carries(src), `${spelling} was credited — run-control outside the call leaks`).toBe(false);
      expect(parses(src), `${spelling} was refused at the PARSER door, not by the rule`).toBe(true);
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }

    // THE FOUR NEW CLAUSES PINNED INDIVIDUALLY, EACH ON ITS OWN REASON STRING AND EACH IN A
    // SOURCE NO OTHER CLAUSE TOUCHES — the defence-in-depth corollary, which has now bitten this
    // program three times. A `carries` assertion alone cannot tell a live guard from one whose
    // work a later clause silently absorbed; the REASON SET can.
    expect(parkedFor(`it('${PROBE} — ctx', ({ skip }) => { skip(); });\n`))
      .toEqual(['TEST_CONTEXT_PARAM:it']);
    expect(parkedFor(`beforeEach(({ skip }) => { skip(); });\nit('${PROBE} — real', () => {});\n`))
      .toEqual(['HOOK_CONTEXT_PARAM:beforeEach']);
    // …and G1's copy inside `creditedSuiteBody`, which is the clause the classifier's own park
    // would otherwise cover: a suite refused for taking a context must open NO registered scope,
    // so the test underneath it is UNREGISTERED too, and only the reason SET shows it.
    expect(parkedFor(`describe('outer', (ctx) => {\n  it('${PROBE} — inside', () => {});\n});\n`),
      'a suite refused by G1 still handed out registration to the tests inside it')
      .toEqual(['SUITE_CONTEXT_PARAM:describe', 'TEST_UNREGISTERED:it']);
    // …and G2's own reason, in the endgame's exact shape. The two `TEST_UNREGISTERED` rows are
    // the registration withdrawal — the ANCHOR loses its credit too, which is the honest read of
    // a block this walker cannot follow.
    expect(parkedFor(`describe('the espionage confirmer lane', () => {\n`
      + `  it('an anchor so the suite is not empty', () => {});\n  if (!GATE) return;\n`
      + `  it('${PROBE} — after an early return', () => {});\n});\n`))
      .toEqual(['TEST_UNREGISTERED:it', 'TEST_UNREGISTERED:it', 'SUITE_NOT_STRAIGHT_LINE:describe']);

    // …AND THE ACCURACY HALF OF BOTH RULES, without which each is a way to park the estate
    // rather than a rule. A parameterless callback is credited in every spelling, and a block
    // that is calls and declarations is straight-line however much of it is not a registration.
    const accurate = {
      'a context-free top-level test': `it('${PROBE} — real', () => {});\n`,
      'a parameterless hook beside the pin': `beforeEach(() => {});\nafterAll(() => {});\n`
        + `it('${PROBE} — real', () => {});\n`,
      'a straight-line block of every allowed statement': `describe('outer', () => {\n  const x = 1;\n`
        + `  let y;\n  function helper() { return x; }\n  class Shape {}\n  ;\n`
        + `  beforeEach(() => { helper(); });\n  seed();\n  it('${PROBE} — real', () => {});\n});\n`,
      'a nested pair of straight-line blocks': `describe('a', () => {\n  describe('b', () => {\n`
        + `    it('${PROBE} — real', () => {});\n  });\n});\n`,
      'a table-driven test whose callback takes nothing': `it.each([1, 2])('${PROBE} — %s', () => {});\n`,
      'a suite whose callback is a parameterless function expression':
        `describe('outer', function () {\n  it('${PROBE} — real', () => {});\n});\n`,
    };
    expect(Object.keys(accurate), 'an accuracy control was dropped').toHaveLength(6);
    for (const [label, src] of Object.entries(accurate)) {
      expect(carries(src), `${label} was PARKED but vitest really runs it`).toBe(true);
    }

    // THE REFORMAT G1 AND G2 COST, side by side with the form that works — this is what whoever
    // pays the 56 files of debt enumerated in the landing commit needs to read. A context
    // parameter comes out; a conditional comes out of the block and goes inside the test body,
    // where it is an assertion rather than a registration decision.
    expect(carries(`it.each([['a']])('${PROBE} — %s', (name) => { void name; });\n`)).toBe(false);
    expect(carries(`it.each([['a']])('${PROBE} — %s', () => {});\n`)).toBe(true);
    expect(carries(`describe('outer', () => {\n  if (!GATE) return;\n`
      + `  it('${PROBE} — gated', () => {});\n});\n`)).toBe(false);
    expect(carries(`describe('outer', () => {\n`
      + `  it('${PROBE} — gated inside the body', () => { if (!GATE) return; });\n});\n`)).toBe(true);
  });

  test('DOOR 2+3 REFUSE THE ALIAS FAMILY — run-control taken at the BINDING', () => {
    // THE NINTH CUT'S BATTERY, AND THE ONE THAT FALSIFIED THE EIGHTH CUT'S TERMINAL SENTENCE.
    // Every spelling below was CREDITED by the eighth cut with `reasons=[]`, and the first was
    // executed at all three layers against it: classifier `reasons=[]`, the SHIPPED evaluator
    // reading `SATISFIED / satisfiable true / missing []` off the REAL
    // `SOVEREIGNTY_LIGHTING_EVIDENCE` marker, and — planted as a real .test.js beside a green
    // anchor in a `git archive` of that commit — vitest 4.1.8 registering ZERO ROWS for the
    // forged title, `Tests 1 passed (1)`, exit 0, `grep -c 'THIS RAN'` = 0 on the deliberate
    // throw. RE-EXECUTED BY THIS LANE at the same three layers before the rule was written.
    //
    // THE MECHANISM. The eighth cut's shadow clause keyed on the module SOURCE
    // (`node.source.value !== 'vitest'`) and never on whether a specifier's LOCAL name equals
    // its IMPORTED one, so a vitest-sourced specifier that rebound an opener word never became
    // opaque. `expect as describe` was the worst of them: `creditedSuiteBody` handed
    // registration THROUGH the aliased word, so one line forged two titles at once.
    const aliases = {
      'expect as it': `import { expect as it } from 'vitest';\nit('${PROBE} — forged', () => {});\n`,
      'assert as it': `import { assert as it } from 'vitest';\nit('${PROBE} — forged', () => {});\n`,
      'vi as test': `import { vi as test } from 'vitest';\ntest('${PROBE} — forged', () => {});\n`,
      'beforeEach as it': `import { beforeEach as it } from 'vitest';\nit('${PROBE} — forged', () => {});\n`,
      'beforeEach as test': `import { beforeEach as test } from 'vitest';\ntest('${PROBE} — forged', () => {});\n`,
      'expect as describe, which forges the suite AND its inner test':
        `import { expect as describe, it } from 'vitest';\ndescribe('${PROBE} — forged suite', () => {\n`
        + `  it('${PROBE} — forged inner', () => {});\n});\n`,
      'expect as suite': `import { expect as suite, it } from 'vitest';\nsuite('outer', () => {\n`
        + `  it('${PROBE} — forged', () => {});\n});\n`,
      // …and the OTHER direction of the same rebind: a real opener wearing another opener's
      // name. It is not a forgery — the title really runs — and it is refused anyway, because
      // a word that reads `describe` and means `it` is precisely the trap this cut closes.
      'it as describe': `import { it as describe } from 'vitest';\ndescribe('${PROBE} — really a test', () => {});\n`,
      'describe as it': `import { describe as it, test } from 'vitest';\nit('${PROBE} — really a suite', () => {\n`
        + `  test('inner', () => {});\n});\n`,
      // A DEFAULT import, which vitest does not have at all.
      'a default import': `import it from 'vitest';\nit('${PROBE} — forged', () => {});\n`,
      // THE GLOBAL, which is what the whole positive rule buys and what the prelude would
      // otherwise hide. No binding at all is not a resolution.
      'no import anywhere in the file': `it('${PROBE} — forged by a global', () => {});\n`,
      'no import, a suite too': `describe('outer', () => {\n  it('${PROBE} — forged', () => {});\n});\n`,
      // A NAMESPACE reached through a COMPUTED member names nothing a syntax tree can read.
      'a computed namespace member': `import * as V from 'vitest';\nV['describe']('outer', () => {\n`
        + `  V.it('${PROBE} — forged', () => {});\n});\n`,
      // A locally declared hook, which is not vitest's and whose callback this reader
      // therefore cannot stand behind.
      'a locally declared beforeEach': `import { it } from 'vitest';\nfunction beforeEach(fn) { void fn; }\n`
        + `beforeEach(() => {});\nit('${PROBE} — beside a shim hook', () => {});\n`,
    };
    expect(Object.keys(aliases), 'an alias forgery was dropped from the arm')
      .toHaveLength(BATTERY.alias);
    for (const [spelling, src] of Object.entries(aliases)) {
      // NOTE THE RAW READ. These sources are NOT given a prelude — several carry their own
      // import, and the two `no import` rows are the whole point of the positive rule.
      expect(titledIn(src, PROBE), `${spelling} was credited — the binding channel leaks`).toBe(false);
      expect(parkReasonsFor(src).some((r) => r.startsWith('PARSE:')),
        `${spelling} was refused at the PARSER door, not by the rule`).toBe(false);
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }

    // THE CLAUSE PINNED ALONE, ON ITS OWN REASON, IN SOURCES NO OTHER CLAUSE TOUCHES — the
    // defence-in-depth corollary, which has now bitten this program four times. Each source
    // below is in the running grammar, statically registered, straight-line, context-free and
    // function-bodied, so `OPENER_UNRESOLVED` is the ONLY clause in a position to speak.
    expect(parkReasonsFor(`import { expect as it } from 'vitest';\nit('${PROBE}', () => {});\n`))
      .toEqual(['OPENER_UNRESOLVED:it']);
    expect(parkReasonsFor(`it('${PROBE}', () => {});\n`))
      .toEqual(['OPENER_UNRESOLVED:it']);
    expect(parkReasonsFor(`import { it } from './shim.js';\nit('${PROBE}', () => {});\n`))
      .toEqual(['OPENER_UNRESOLVED:it']);
    // A word bound TWICE — once by the vitest import and once by a nested parameter — cannot be
    // resolved by a reader with no scope analysis, and the honest answer is that it does not
    // say. (The module-scope spelling of this, `import { it }` beside `function it(){}`, is a
    // duplicate declaration and dies at the PARSER door instead, which is the same direction.)
    expect(parkReasonsFor(`import { it } from 'vitest';\nconst wrap = (it) => it;\n`
      + `it('${PROBE}', () => {});\n`), 'a word bound TWICE resolved to one of its bindings')
      .toEqual(['OPENER_UNRESOLVED:it']);
    // …and `creditedSuiteBody`'s OWN copy of the rule, which the classifier's park would
    // otherwise cover completely. The observable difference is the REGISTRATION it hands out:
    // a suite whose opener did not resolve must open NO registered scope, so the test beneath
    // it is UNREGISTERED too. Delete that clause and exactly this red.
    expect(parkReasonsFor(`import { expect as describe, it } from 'vitest';\n`
      + `describe('outer', () => {\n  it('${PROBE} — under an aliased suite', () => {});\n});\n`),
    'a suite whose opener did not resolve still handed out registration to the tests inside it')
      .toEqual(['TEST_UNREGISTERED:it', 'OPENER_UNRESOLVED:describe']);
    // …AND THE SAME CLAUSE IN ITS **OTHER** DIRECTION, WHICH THE LINE ABOVE DOES NOT REACH AND
    // AN EXECUTED MUTANT PROVED IT DOES NOT. `expect as describe` resolves to a NON-suite word,
    // so `creditedSuiteBody`'s ordinary `SUITE_WORDS.includes(name)` test already refuses it and
    // the reserved-word clause there is never consulted — deleting that clause left all 31 arms
    // green. The case that needs it is the reverse rebind: `describe as it` resolves to a REAL
    // suite word through a RESERVED test word, so without the clause `creditedSuiteBody` opens a
    // registered scope for a call the classifier refused, and `TEST_UNREGISTERED:test` vanishes
    // from this set. That reason is the whole discriminator.
    expect(parkReasonsFor(`import { describe as it, test } from 'vitest';\n`
      + `it('outer', () => {\n  test('${PROBE} — inside an aliased suite', () => {});\n});\n`),
    'a RESERVED word resolving to a real suite word still opened a registered scope')
      .toEqual(['TEST_UNREGISTERED:test', 'SUITE_REF:CallExpression.callee', 'OPENER_UNRESOLVED:it']);
    // …AND THE COMPUTED-NAMESPACE CLAUSE, pinned on its own reason for the same measured
    // reason: a computed member registers no suite, so the test under it is UNREGISTERED and
    // the file parks either way — `carries` cannot tell. Deleting the clause left all 31 arms
    // green until this line existed. `OPENER_UNRESOLVED:V` is what says the walker SAW a vitest
    // namespace reached by a name it could not read, rather than merely losing the suite.
    expect(parkReasonsFor(`import * as V from 'vitest';\nV['describe']('outer', () => {\n`
      + `  V.it('${PROBE} — under a computed namespace member', () => {});\n});\n`),
    'a computed vitest-namespace member was passed over instead of parking the file')
      .toEqual(['TEST_UNREGISTERED:it', 'OPENER_UNRESOLVED:V']);

    // …AND THE ACCURACY HALF, without which this rule would simply park the estate. Both
    // resolving forms were EXECUTED under vitest 4.1.8 in a git-archive tree BEFORE being
    // credited, because each is a credit this walker did not previously grant:
    // `import { describe as mkSuite, it as check }` reported
    // `✓ RENAMED-SUITE-VIA-ALIAS > RENAMED-TEST-VIA-ALIAS — this must really run`, and
    // `V.describe`/`V.it` reported `✓ NAMESPACE-SUITE > NAMESPACE-TEST — this must really run`.
    const resolving = {
      'a plain named import': `import { describe, it } from 'vitest';\ndescribe('outer', () => {\n`
        + `  it('${PROBE} — real', () => {});\n});\n`,
      'a RENAMED import, credited by its TRUE name': `import { describe as mkSuite, it as check } from 'vitest';\n`
        + `mkSuite('outer', () => {\n  check('${PROBE} — real', () => {});\n});\n`,
      'a namespace member': `import * as V from 'vitest';\nV.describe('outer', () => {\n`
        + `  V.it('${PROBE} — real', () => {});\n});\n`,
      'a namespace member with a running modifier': `import * as V from 'vitest';\n`
        + `V.describe.concurrent('outer', () => {\n  V.it('${PROBE} — real', () => {});\n});\n`,
      'a multi-line import': `import {\n  describe,\n  it,\n} from 'vitest';\ndescribe('outer', () => {\n`
        + `  it('${PROBE} — real', () => {});\n});\n`,
    };
    expect(Object.keys(resolving), 'a resolving form was dropped from the accuracy half').toHaveLength(5);
    for (const [label, src] of Object.entries(resolving)) {
      expect(titledIn(src, PROBE), `${label} was PARKED but vitest really runs it`).toBe(true);
    }
    // …AND THE BINDING-SITE RULE'S OWN ACCURACY PIN, which is the third clause an executed
    // mutant caught unpinned. `bindingsOf` records a specifier's IMPORTED-name node as a
    // binding site so the reference rule never reads it as a reference. For a SHORTHAND import
    // espree hands back one node for both halves, so nothing shows; the case that needs the
    // rule is a RENAMED specifier beside a plain one, where `describe` appears as an imported
    // name while a live `describe` binding also exists. Without the rule that node becomes a
    // `SUITE_REF:ImportSpecifier.imported` and a perfectly ordinary file loses every title.
    expect(titledIn(`import { describe, it } from 'vitest';\n`
      + `import { describe as mkSuite, test } from 'vitest';\nmkSuite('a', () => {\n`
      + `  test('t', () => {});\n});\ndescribe('outer', () => {\n  it('${PROBE} — real', () => {});\n});\n`, PROBE),
    'a renamed specifier\'s imported NAME was read as a reference and parked a live file').toBe(true);
    // …and the running grammar still bites THROUGH a resolved alias, so resolution widens the
    // door rather than replacing it: the shape is spelled by the TRUE name, not the local one.
    expect(parkReasonsFor(`import { describe as mkSuite, it } from 'vitest';\n`
      + `mkSuite.skip('outer', () => {\n  it('${PROBE} — under an aliased skip', () => {});\n});\n`))
      .toEqual(['SUITE_NOT_RUNNING:describe.skip', 'TEST_UNREGISTERED:it']);
    expect(parkReasonsFor(`import * as V from 'vitest';\nV.describe.skip('outer', () => {\n`
      + `  V.it('${PROBE} — under a namespaced skip', () => {});\n});\n`))
      .toEqual(['SUITE_NOT_RUNNING:describe.skip', 'TEST_UNREGISTERED:it']);

    // …AND THE PRELUDE ITSELF ON TRIAL, because every other synthetic arm in this file leans
    // on it. It must add the import a real file has and buy nothing else: the same fragment
    // parks bare and is credited preluded, and a fragment that binds the word keeps its park.
    const fragment = `it('${PROBE} — a plain pin', () => {});\n`;
    expect(titledIn(fragment, PROBE), 'a bare fragment was credited without any binding').toBe(false);
    expect(titledIn(withVitest(fragment), PROBE), 'the prelude failed to give a fragment standing').toBe(true);
    expect(carries(`function it(n, f) { void n; void f; }\n${fragment}`),
      'the prelude overrode a source\'s own binding of the word').toBe(false);
  });

  test('DOOR 3 CREDIT-BACK: ONE benign reference position, and nothing else', () => {
    // THE ACCURACY HALF OF THE POLARITY — AND IT IS NOW A LIST OF ONE, which is the ninth
    // cut's deletion showing up where a reader will notice it. The eighth cut needed TWO
    // entries here and argued that "enumeration is safe HERE and fatal on the park side". That
    // argument was FALSE for entry (1): the import-specifier credit-back was on the credit side
    // and it FAILED OPEN, because it credited back every specifier without ever reading whether
    // the specifier's local name matched its imported one. Entry (1) is DELETED rather than
    // patched — an import specifier is a BINDING SITE, which is a structural fact about the
    // tree and needs no allowance at all, and `bindingsOf` records those nodes so the reference
    // rule never sees them. What survives is entry (2), and it survives because it is a
    // genuine REFERENCE that a resolution rule cannot decide on its own.
    //
    // THE VITEST IMPORT IS STILL PINNED, but as an ACCURACY control rather than a credit-back:
    // if this ever reds, resolution has stopped recognising the ordinary first line of all
    // 2,314 estate test files and the whole tree parks.
    expect(carries(`import {\n  describe,\n  expect,\n  it,\n} from 'vitest';\ndescribe('outer', () => {${inner}`),
      'a multi-line vitest import parked a live file').toBe(true);
    expect(carries(`import { describe, it } from 'vitest';\ndescribe('outer', () => {${inner}`),
      'a single-line vitest import parked a live file').toBe(true);
    // (2) A BARE suite value on a member target — four estate files wire eslint's RuleTester
    // this way. A bare value can only ever alias a suite that RUNS. MUTANT, RE-MEASURED at this
    // cut rather than carried forward: delete the clause and exactly those four files park,
    // 357 → 361 — tests/lib/funnelEventContract.test.js, tests/lib/noInlineStoreSelector.test.js,
    // tests/lint/analyticsPropsHygiene.test.js and tests/lint/rawColorLiteral.test.js, each on
    // `SUITE_REF:AssignmentExpression.right`. (The eighth cut's prose said "93 to 97", which was
    // its own census era; the direction held and the base had moved.)
    expect(carries(`RuleTester.describe = describe;\nRuleTester.it = it;\ndescribe('outer', () => {${inner}`),
      'the RuleTester binding parked a live file').toBe(true);
    // …and the clause is keyed on RESOLUTION, not on spelling, so an aliased import gets the
    // same treatment — which is the one place the ninth cut WIDENED a credit rather than
    // narrowing one, and it is pinned so the widening is deliberate.
    expect(titledIn(`import { describe as mkSuite, it } from 'vitest';\n`
      + `RuleTester.describe = mkSuite;\nmkSuite('outer', () => {\n`
      + `  it('${PROBE} — beside an aliased RuleTester wire', () => {});\n});\n`, PROBE),
    'the RuleTester allowance did not follow a renamed import').toBe(true);
    // …and the MODIFIED form of the same shape is NOT credited back, which is what keeps
    // entry (2) from being a hole the size of the alias class.
    expect(carries(`RuleTester.describe = describe.skip;\ndescribe('outer', () => {${inner}`),
      'a MODIFIED suite value on a member target was credited back').toBe(false);
    // …and prose is not a category at all any more: a header sentence ending in the word
    // `suite`, which the fourth cut needed a whole COMMENT_LINE guard to survive, is simply
    // not in the tree.
    expect(carries(`/**\n * exercised in the domain suite. This\n */\ndescribe('outer', () => {${inner}`),
      'a prose full stop after the word suite parked a live file').toBe(true);
  });

  test('DOOR 3 RUNNING GRAMMAR: only a suite MEASURED to run keeps its titles', () => {
    // The positive half, without which the door could be refusing everything and every arm
    // above would still be green. Every opener here was RUN under vitest 4.1.8 in a
    // git-archive tree and reported a passing leaf.
    for (const opener of ['describe(', 'suite(', 'describe.concurrent(', 'describe.sequential(',
      'describe.shuffle(', 'describe.each([1])(', 'describe.for([1])(']) {
      expect(carries(`${opener}'outer', () => {${inner}`), `${opener} was parked but it runs`)
        .toBe(true);
    }
    // A head broken across lines, or interrupted by a comment, is the SAME head to a parser.
    expect(carries(`describe\n  ('outer', () => {${inner}`)).toBe(true);
    expect(carries(`describe\n  .concurrent('outer', () => {${inner}`)).toBe(true);
    expect(carries(`describe/* c */.concurrent('outer', () => {${inner}`)).toBe(true);
    // …and the grammar is CLOSED, not a substring test: an unknown-but-plausible modifier
    // parks, a computed member parks, and a chain that mixes a running modifier with a
    // conditional one parks.
    expect(carries(`describe.eachly('outer', () => {${inner}`)).toBe(false);
    expect(carries(`describe.concurrent.skipIf(x)('outer', () => {${inner}`)).toBe(false);
    for (const mod of RUNNING_SUITE_MODIFIERS) {
      const opened = TABLE_MODIFIERS.has(mod) ? `describe.${mod}([1])(` : `describe.${mod}(`;
      expect(carries(`${opened}'outer', () => {${inner}`),
        `describe.${mod} is in the running grammar but was parked`).toBe(true);
      expect(carries(`describe['${mod}']('outer', () => {${inner}`),
        `a COMPUTED describe['${mod}'] was credited — the grammar admits brackets`).toBe(false);
    }
    // A TABLE MODIFIER WITHOUT ITS CALL REGISTERS NOTHING, and this is the arm that says so.
    // `describe.each('outer', fn)` returns a function and opens no suite at all; crediting
    // its first argument as a title would be a credited suite that vitest never ran.
    for (const mod of ['each', 'for']) {
      expect(carries(`describe.${mod}('outer', () => {${inner}`),
        `describe.${mod} without its table call was credited, but it opens no suite`).toBe(false);
      expect(carries(`it.${mod}('${PROBE} — never registered', () => {});\n`),
        `it.${mod} without its table call was credited, but it registers no test`).toBe(false);
    }
    // Focus parks the file at BOTH levels — MEASURED: in a git-archive tree a
    // `describe.only` left its SAME-FILE sibling `↓ skipped` while a neighbouring file ran
    // whole, so focus is a file-scope fact exactly as a parked suite is.
    expect(carries(`describe.only('elsewhere', () => {});\ndescribe('outer', () => {${inner}`)).toBe(false);
    expect(carries(`it.only('elsewhere', () => {});\ndescribe('outer', () => {${inner}`)).toBe(false);
    expect(carries(`fdescribe('elsewhere', () => {});\ndescribe('outer', () => {${inner}`)).toBe(false);
    expect(carries(`fit('elsewhere', () => {});\ndescribe('outer', () => {${inner}`)).toBe(false);
    // The estate's own dominant conditional spelling parks 93 of 2,314 files under this
    // rule, and the one file that actually carries a marker is not among them — asserted,
    // not assumed.
    expect(carries(`describe.runIf(distExists)('outer', () => {${inner}`)).toBe(false);
    expect(filesTitling('SP-B2-LEG-SUPPLY-EVIDENCE'))
      .toEqual(['tests/domain/sovereigntyMarketStageWr10w.test.js']);
  });

  test('THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed', () => {
    // ── THE CHAIR'S SECOND RULING, AND WHY A FLOOR AND A CEILING WERE NOT ENOUGH ──────
    // Three cuts in a row stated this census in PROSE and two of them stated it WRONG, in the
    // same direction, for the same reason: the cut's own new arm added exactly the title its
    // sentence was describing, and a sentence cannot notice that. The seventh cut wrote 24,456
    // against a live 24,457 and the eighth corrected it — then wrote 23,674 against a live
    // 23,675 and shipped, and the adversary found it. A floor of 1,900 and a ceiling of 420
    // could not catch either, because both figures were true and merely not the truth.
    //
    // SO THE FIGURES MOVE OUT OF THE PROSE AND INTO THIS TABLE, WHERE BEING WRONG IS RED. The
    // stale-numeral class cannot survive a constant that the suite compares against a live
    // measurement — it either matches or the gate says so, which is the whole difference
    // between a claim and a receipt.
    //
    // THE COST, STATED PLAINLY BECAUSE IT IS REAL AND IT IS THE POINT. Any lane that adds or
    // removes a test TITLE anywhere in tests/ reds this arm, and any lane that parks or unparks
    // a file reds it too. That is not a false red: it is this walker asking to be RE-MEASURED
    // rather than restated, and the fix is one command and one number, never a loosened bound.
    // A lane that finds this red should confirm the delta is its own, then re-record here.
    // MEASURED AT THIS COMMIT, AND THE MOVEMENT IS THE TENTH CUT'S LAYER SPLIT PLUS THIS FILE'S
    // OWN TWO NEW ARMS. The ninth cut read 23,676 live titles with SUITE and TEST titles in one
    // array. They are two arrays now, and the same tree reads 18,434 TEST titles and 5,244 SUITE
    // titles — 23,678 together, which is the ninth cut's 23,676 plus exactly the two `test(…)`
    // arms this cut adds (DOOR 0 and the suite-title family). NOTHING WAS LOST: every title the
    // ninth cut counted is still parsed and still counted, and 5,244 of them simply stopped
    // being EVIDENCE. Both figures are asserted, so the split cannot silently drift back.
    // ── RE-RECORDED 2026-08-06 BY FP WAVE SP-C, WITH ITS CAUSE STATED ────────────────
    // 2,314/357/1,957/18,434/5,244 → 2,318/358/1,960/18,471/5,260. THE CAUSE IS FOUR NEW
    // TEST FILES and nothing else: tests/domain/dispositionAppetite.test.js,
    // tests/domain/strategicPosture.test.js,
    // tests/property/strategicPostureDormancyFence.test.js and
    // tests/lint/postureNameCollision.walker.test.js. No rule here widened or narrowed and
    // no existing file changed shape — the arithmetic below still adds up, and the deltas
    // are exactly what four files contribute.
    //
    // ONE OF THE FOUR PARKS, AND IT IS THE INTERESTING ONE: dispositionAppetite.test.js
    // parks on `TEST_UNREGISTERED:it` ×3 + `SUITE_NOT_STRAIGHT_LINE:describe`, because its
    // per-family reachability arm generates one `it` per lesson family from a `for…of` over
    // the LIVE table rather than spelling three by hand. That is door 3's polarity working
    // as designed rather than a defect: the reader cannot statically recognise a
    // loop-generated title, so it credits nothing and parks the file. The file carries no
    // marker and is nobody's declared evidence address, so parking costs the instrument
    // nothing — and the loop is kept deliberately, because a hand-spelled three would drift
    // from APPETITE_TUNING.LESSON_FAMILIES the day a fourth family lands.
    //
    // THE HEADER PROSE ABOVE STILL SAYS 2,314 IN SEVERAL PLACES AND IS LEFT ALONE ON
    // PURPOSE: those sentences record what the ninth and tenth cuts MEASURED, and rewriting
    // a historical measurement to match a later tree is how a record becomes fiction. The
    // live figures are here, in the assertion, where they can fail.
    // ── RE-RECORDED 2026-08-06 BY FP WAVE SP-D, WITH ITS CAUSE STATED ────────────────
    // 2,318/358/1,960/18,471/5,260 → 2,322/358/1,964/18,519/5,279. THE CAUSE IS FOUR NEW
    // TEST FILES and nothing else: tests/domain/errandMint.test.js,
    // tests/domain/envoyErrandSpineLifecycle.test.js,
    // tests/property/errandSpineDormancyFence.test.js and
    // tests/lint/errandConsumerRegistry.walker.test.js. No rule here widened or narrowed
    // and no existing file changed shape.
    //
    // ALL FOUR ARE CREDITED — parked is UNCHANGED at 358, which is the interesting half
    // of this re-record and the contrast with SP-C's. Every title in the four is spelled
    // as a literal: none generates its arms from a `for…of` or a `test.each` over a live
    // table, so door 3's reader can recognise all of them statically. That was not a
    // stylistic accident — the registry walker's per-row arms deliberately loop INSIDE a
    // single named test rather than generating one test per row, which keeps the file
    // credited while still failing by name on the offending row.
    const CENSUS = Object.freeze({
      // RE-MEASURED at FP GR-2 (2026-08-06), which added five test files: the four pact
      // batteries and the dormancy fence. Every figure below is EXECUTED against the tree
      // by the assertions that follow — this block is a record of a measurement, never a
      // description of one, which is why the header says "re-measure, do not re-word".
      //
      // ── RE-RECORDED 2026-08-06 BY FP WAVE IN-0a, WITH ITS CAUSE STATED ──────────────
      // 2,327/358/1,969/18,624/5,317 → 2,328/358/1,970/18,641/5,324. THE CAUSE IS ONE NEW
      // TEST FILE and nothing else: tests/domain/brokeragePlantHandoffPins.test.js. No
      // rule here widened or narrowed and no existing file changed shape; the deltas are
      // exactly +1 file, +1 credited, +17 titles, +7 suite titles, and PARKED IS UNCHANGED
      // at 358 — the new file spells every one of its titles as a literal, so door 3's
      // reader recognises all of them statically and credits the file rather than parking
      // it. (Its one `for…of` walks the SOURCE TREE inside a single named test, which is
      // the registry-walker idiom SP-D recorded: loop INSIDE a named test, never generate
      // tests from a loop.)
      //
      // ── RE-RECORDED 2026-08-06 BY THE GR-2 REPAIR ROUND, WITH ITS CAUSE STATED ──────
      // 2,328/358/1,970/18,641/5,324 → 2,329/358/1,971/18,655/5,329. THE CAUSE IS ONE NEW
      // TEST FILE PLUS TWO AMENDED ONES, and nothing else. New: tests/domain/
      // pactKernelMount.test.js (10 titles, 3 suite titles) — the kernel-mount pin whose
      // total absence let a fatal `changed`-fold defect and an unenforced stage-order
      // claim ship. Amended, both already credited: pactProposals.test.js (+3 titles,
      // +1 suite title) and pactFormation.test.js (+1 title, +1 suite title), the
      // real-digest dwell arms. Deltas are exactly +1 file, +1 credited, +14 titles,
      // +5 suite titles, and PARKED IS UNCHANGED at 358.
      // ⚠ PARKED STAYING PUT WAS EARNED, NOT LUCK. The mount file's FIRST draft generated
      // its six door tests from a `for…of` over a table; measured, that parked the whole
      // file (358 → 359, credited unmoved). The six tests are now spelled out one by one
      // and the file is credited. SP-D's idiom holds twice over in this block now.
      //
      // ── RE-RECORDED 2026-08-06 BY THE SP-D REPAIR ROUND, WITH ITS CAUSE STATED ──────
      // 2,329/358/1,971/18,655/5,329 → 2,329/358/1,971/18,666/5,331.
      //
      // ⚠⚠ THIS RE-RECORD ABSORBS A +4 TITLE DISCREPANCY THAT IS NOT THIS WAVE'S, AND THE
      // SPLIT IS STATED RATHER THAN BLURRED. MEASURED AT PRISTINE HEAD 94d0c798, BEFORE A
      // SINGLE EDIT OF THIS WAVE: the walker reported "expected 18659 to be 18655" — the
      // figure committed by the GR-2/IN-0a repair round was already 4 short of the tree it
      // was recorded against, so this row was ALREADY RED on arrival. The census cannot be
      // corrected by halves (it is one integer), so landing this wave's own +7 necessarily
      // carries the inherited +4 with it. THE ARITHMETIC, both parts executed:
      //   18,655 recorded → 18,659 measured at pristine HEAD  = +4 INHERITED, not ours
      //   18,659 → 18,666 with this wave applied              = +7 OURS, counted below
      // Reported to the chair as a stop rather than absorbed in silence. A later lane
      // reconciling the GR-2/IN-0a rows should expect their stated +14 to have been +18.
      //
      // THE +7 IS SEVEN NEW PINS IN TWO ALREADY-CREDITED FILES, AND NOTHING ELSE — NO NEW
      // TEST FILE, which is why files/parked/credited are all UNCHANGED. tests/domain/
      // envoyErrandSpineLifecycle.test.js gains +6 titles and +2 suite titles (the two new
      // describes: the dark-mint/dark-import dormancy pair, and the four rows that pin each
      // door of the persist-side split conjunction ALONE — the adversarial verifier proved
      // two of those three doors could be deleted with the whole SP-D battery still green).
      // tests/lint/errandConsumerRegistry.walker.test.js gains +1 title and NO suite title
      // (the mint-detector guard-the-guard row, added to an existing describe).
      // PARKED IS UNCHANGED at 358 because every one of the seven is a literal title — the
      // conjunction rows are spelled out one per door rather than generated from a table,
      // which is SP-D's own recorded idiom and the reason the count stays creditable.
      // ── RE-RECORDED 2026-08-06 BY FP WAVE ES-1, WITH ITS CAUSE STATED AND MEASURED ──
      // 2,331/358/1,973/18,690/5,346 → 2,333/358/1,975/18,731/5,357. THE CAUSE IS TWO NEW
      // TEST FILES and nothing else: tests/domain/espionageMission.test.js and
      // tests/property/espionageMissionDormancyFence.test.js. No rule here widened or
      // narrowed. The deltas are exactly +2 files, +2 credited, +41 titles, +11 suite
      // titles, and PARKED IS UNCHANGED at 358 — both new files spell every title as a
      // literal, so door 3's reader recognises them statically and credits the files.
      // ⚠ THE PARENT MOVED TWICE MID-WAVE. A concurrent build lane landed IN-0b and then
      // IN-0d in this same tree, each adding a test file of its own, and this census counts
      // the WORKING TREE rather than HEAD — so the figures were re-measured from scratch
      // against THIS commit's actual parent (db35bad6) rather than against the HEAD the
      // wave opened on. That is what "re-measure, do not re-word" means when two lanes
      // share a tree: the number belongs to a parent, not to a wave.
      //
      // ⚠ HOW THESE FIGURES WERE MEASURED, BECAUSE THE WORKING TREE COULD NOT MEASURE
      // THEM. A SECOND BUILD LANE was running in the same tree with its own uncommitted
      // test files, and this census counts the WORKING TREE rather than HEAD — so reading
      // the numbers off a live run would have recorded the other lane's files against this
      // wave and left a figure no checkout of this commit could reproduce. They were taken
      // instead from a `git archive` of this wave's start HEAD (d615171a) carrying ONLY
      // this wave's test-side changes, and the whole file was EXECUTED green there
      // (33 passed / 33) before the numbers were written here. That is also why this
      // census may read RED in a shared working tree between the two lanes' commits: the
      // difference is exactly the other lane's uncommitted test files, and its own wave
      // re-measures — which is this walker doing its job rather than failing at it.
      files: 2333, parked: 358, credited: 1975, titles: 18731, suiteTitles: 5357,
    });
    const parked = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length > 0);
    const credited = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length === 0);
    const titles = credited.reduce((sum, { src }) => sum + liveTitlesIn(src).length, 0);
    const suiteTitles = credited.reduce((sum, { src }) => sum + liveSuiteTitlesIn(src).length, 0);
    expect(TEST_FILES.length, 'the estate\'s file count moved — re-measure, do not re-word')
      .toBe(CENSUS.files);
    expect(parked.length, 'the parked-file count moved from SP-C\'s measured 358 —'
      + ' a rule widened or narrowed, or a lane changed a file\'s shape; re-MEASURE and re-record')
      .toBe(CENSUS.parked);
    expect(credited.length, 'the credited-file count moved from SP-C\'s measured 1,960')
      .toBe(CENSUS.credited);
    expect(titles, 'the live TEST-title count moved from SP-C\'s measured 18,471 — this'
      + ' is the evidence layer, the exact figure two cuts in a row stated wrongly in prose, and'
      + ' the reason it is asserted rather than described')
      .toBe(CENSUS.titles);
    // …AND THE SUITE LAYER IS COUNTED TOO, WHICH IS WHAT MAKES THE SPLIT UNABSORBABLE. A cut
    // that merged the two arrays again would leave `titles` at 23,678 and `suiteTitles` at 0,
    // and BOTH of these reds. Counting only the evidence layer would let the merge look like an
    // ordinary re-measure.
    expect(suiteTitles, 'the live SUITE-title count moved from SP-C\'s measured 5,260 —'
      + ' if it went to zero the layer split was deleted and suite titles are evidence again')
      .toBe(CENSUS.suiteTitles);
    expect(suiteTitles, 'no estate suite title is parsed at all — the suite layer is not being'
      + ' read, so the split is not a split').toBeGreaterThan(0);
    // …and the three FILE figures are consistent with each other, so a constant cannot be
    // nudged to silence this arm without the arithmetic saying so.
    expect(CENSUS.parked + CENSUS.credited, 'the census constants do not add up')
      .toBe(CENSUS.files);
    // ── THE LIVE ESTATE INSTANCE OF T1, DISPOSITIONED ─────────────────────────────────
    // tests/build/prerenderRoutes.test.js opens a suite whose four tests are all
    // `it.skipIf(!requireDistRead)`. Under the ninth cut that suite TITLE was credited as
    // evidence with `reasons=[]` while `vitest list` collected no runnable test beneath it —
    // the only such divergence in the whole estate. It is recorded here rather than left to be
    // rediscovered, and the disposition is: NOTHING CHANGES IN THE TREE READING. The title was
    // never a marker, the file is not a declared evidence address, and the title is still
    // parsed — it has simply moved to the layer nothing joins against. Both facts asserted.
    const prerender = TEST_FILES.find(({ rel }) => rel === 'tests/build/prerenderRoutes.test.js');
    expect(prerender, 'the estate instance of T1 was renamed — re-locate it or drop this record')
      .toBeDefined();
    expect(liveSuiteTitlesIn(prerender.src),
      'the T1 estate instance stopped parsing its suite titles')
      .toContain('prerender — dist walk (the emitted files carry their own truth)');
    expect(liveTitlesIn(prerender.src).some((title) => title.includes('dist walk (the emitted')),
      'the all-skipIf suite title is back in the EVIDENCE layer — T1 has reopened').toBe(false);
    expectAbsentWithAnchor(EVIDENCE_FILE_ADDRESSES, 'tests/build/prerenderRoutes.test.js',
      'tests/domain/sovereigntyMarketStageWr10w.test.js',
      'the T1 estate instance is not a declared evidence address');
    // THE COLLAPSE DIRECTION, KEPT AS AN ARGUMENT RATHER THAN AS A SECOND GUARD. The exact
    // equalities above subsume the old floor of 1,900 and ceiling of 420 completely — a
    // collapse to two credited files, or a park set widening by a fifth, reds on the equality
    // long before it reaches either bound — so those two arms are DELETED rather than kept
    // beside their successor. A guard whose work a later guard silently absorbs is this
    // program's most-repeated verification failure, and keeping a redundant bound here would
    // have reproduced it inside the repair for it.
    //
    // …and the refusal classes the sixth through ninth cuts added are really present in the
    // estate, so none of B1/B2/B3/L2/G1/G2 or the ninth cut's binding rule is a rule that fires
    // only on synthetic sources. TEST_TABLE_UNPROVEN is in this list for a reason worth
    // keeping: G1's clause was written directly after `argOk` at first, which swallowed all 64
    // of L2's files and left this row firing on NONE — a live rule silently covered by its
    // successor, caught by the census.
    const reasonKinds = new Set(parked.flatMap(({ src }) => parkReasonsFor(src).map((r) => r.split(':')[0])));
    for (const kind of ['SUITE_NOT_RUNNING', 'OPENER_UNRESOLVED', 'TEST_UNREGISTERED',
      'SUITE_UNREGISTERED', 'TEST_TABLE_UNPROVEN', 'SUITE_TABLE_UNPROVEN', 'SUITE_REF',
      'TEST_CONTEXT_PARAM', 'SUITE_NOT_STRAIGHT_LINE']) {
      expect(reasonKinds.has(kind), `${kind} fires on no estate file — the rule is synthetic-only`)
        .toBe(true);
    }
    // …AND THE SHADOW REASONS ARE GONE FOR GOOD, which is the ninth cut's deletion asserted
    // rather than described. `TEST_SHADOW_AMBIGUOUS` named 25 estate files under the eighth cut
    // and `SUITE_SHADOW_AMBIGUOUS` was its suite-level twin; both, and the `shadowed` set that
    // fed them, are replaced by the single positive `OPENER_UNRESOLVED`. If either string ever
    // returns, shadow tracking has been reintroduced alongside the rule that subsumed it.
    for (const kind of ['TEST_SHADOW_AMBIGUOUS', 'SUITE_SHADOW_AMBIGUOUS']) {
      expect(reasonKinds.has(kind), `${kind} is back — shadow tracking was reintroduced beside`
        + ' the positive binding rule that replaced it').toBe(false);
    }
    // …AND THE LATENCY CLAIMS ARE ASSERTIONS, NOT SENTENCES. L1 (both levels) and the SUITE and
    // HOOK halves of G1 are stated above as costing zero estate files today. If any of them ever
    // stops being true this reds, and whoever reads it is exactly the person who needs to know
    // that vitest's options argument and its TestContext are refused here: the cure is to
    // MEASURE the shape under vitest and give it a grammar, never to loosen the default.
    for (const kind of ['TEST_ARG_FORM', 'SUITE_ARG_FORM', 'SUITE_CONTEXT_PARAM', 'HOOK_CONTEXT_PARAM']) {
      expect(reasonKinds.has(kind), `${kind} now fires on an estate file — it was measured as`
        + ' a LATENT closure costing zero files, and that measurement has expired')
        .toBe(false);
    }
  });

  test('DOOR 0 — THE CAP: only a DECLARED evidence address can carry a marker', () => {
    // THE TENTH CUT'S SECOND HALF, PINNED AS ITS OWN DOOR. Eleven adversarial rounds narrowed
    // WHICH SHAPES inside an arbitrary file may carry a marker, and eleven times the address
    // surface outran the parse rule. The cap retires the surface instead of narrowing it, and
    // this arm is what makes it a door rather than a sentence in the header.
    //
    // THE LIST IS SMALL, LITERAL AND AUDITABLE — three paths, one per evidence home, with no
    // prefix or glob that could quietly admit a file nobody meant.
    expect(EVIDENCE_FILE_ADDRESSES).toEqual([
      'tests/domain/sovereigntyMarketStageWr10w.test.js',
      'tests/domain/sovereigntyWaveCloseIntegration.test.js',
      'tests/domain/espionageDistantSourceEs4.test.js',
    ]);
    expect(new Set(EVIDENCE_FILE_ADDRESSES).size, 'an address is declared twice')
      .toBe(EVIDENCE_FILE_ADDRESSES.length);
    // …and the unbuilt set is a SUBSET of the declared one, so a typo in it cannot silently
    // excuse an address that was never declared at all.
    for (const rel of UNBUILT_EVIDENCE_ADDRESSES) {
      expect(EVIDENCE_FILE_ADDRESSES, `${rel} is marked unbuilt but is not a declared address`)
        .toContain(rel);
    }

    // THE CENSUS THE WALKER OWES ITS READER — which declared addresses exist, and whether each
    // is a file this walker can read titles out of at all. A declared address that PARKS is an
    // evidence home that can never light its wave, which is exactly the failure a designated
    // address is supposed to make impossible to miss.
    const present = EVIDENCE_FILE_ADDRESSES.filter((rel) => TEST_FILES.some((f) => f.rel === rel));
    const absent = EVIDENCE_FILE_ADDRESSES.filter((rel) => !present.includes(rel));
    expect(absent, 'a declared evidence address is missing from the tree and is not recorded as'
      + ' unbuilt — either the file was renamed or the list is stale; re-declare it here')
      .toEqual(UNBUILT_EVIDENCE_ADDRESSES.filter((rel) => absent.includes(rel)));
    expect(present.length, 'every declared evidence address has vanished — the instrument has'
      + ' no home left to read').toBeGreaterThan(0);
    for (const rel of present) {
      const file = TEST_FILES.find((f) => f.rel === rel);
      expect(parkReasonsFor(file.src), `${rel} is a declared evidence address but it PARKS —`
        + ' no marker in it could ever light a wave. Repair the file, or move the address.')
        .toEqual([]);
    }

    // THE DOOR ITSELF, AND ITS DISCRIMINATOR. The SAME source — a real, live, running pin — is
    // evidence at a declared address and is not evidence one path away. Without the second
    // line this arm could not tell the cap from a corpus that never matched.
    for (const row of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      if (row.kind !== 'TEST_MARKER') continue;
      const src = withVitest(`  it('${row.marker} — a real, live, running pin', () => {});\n`);
      expect(filesTitling(row.marker, [{ rel: AT_ADDRESS, src }]),
        `${row.wave}'s marker was refused at a DECLARED address — the cap admits nothing`)
        .toEqual([AT_ADDRESS]);
      expect(filesTitling(row.marker, [{ rel: OFF_ADDRESS, src }]),
        `${row.wave}'s marker lit the wave from an UNDECLARED address — the cap leaks`)
        .toEqual([]);
      // …and the CONDITION refuses it too, not merely the census helper.
      expect(measure(row, [{ rel: OFF_ADDRESS, src }]),
        `${row.wave} can be lit from any file in tests/ — the cap is not wired into measure`)
        .toBe(false);
      expect(measure(row, [{ rel: AT_ADDRESS, src }]),
        `${row.wave} cannot be lit from its own declared home — the cap parks the instrument`)
        .toBe(true);
    }
    // …and the LOOSE read is deliberately NOT capped, which is what keeps the control arms
    // honest: `filesMentioning` still swallows an undeclared address whole, so the two reads
    // genuinely disagree on it.
    expect(filesMentioning('SP-B2-LEG-SUPPLY-EVIDENCE', [{ rel: OFF_ADDRESS,
      src: '// SP-B2-LEG-SUPPLY-EVIDENCE\n' }])).toEqual([OFF_ADDRESS]);
  });

  test('DOOR 4: this walker is excluded, and the CAP now subsumes that exclusion', () => {
    const self = TEST_FILES.find(({ rel }) => rel === SELF_REL);
    expect(self, 'the walker no longer finds itself — the exclusion joins on a stale path')
      .toBeDefined();
    // Belt: the exclusion is applied to every census this file performs.
    expect(filesTitling(PROBE)).toEqual([]);
    expect(filesMentioning(PROBE)).toEqual([]);
    // THE HONEST RECORD OF A DOOR BEING RETIRED INTO ANOTHER, which this file has done twice
    // before (the eighth cut's shadow set, the ninth cut's credit-back entry 1) and which it
    // states rather than smooths. Door 4 was `rel !== SELF_REL` in `filesTitling`; under the cap
    // the walker's own address is not a declared evidence address at all, and no declared
    // address is under tests/lint/, so the clause can no longer be the thing doing the work.
    // IT IS PINNED AS WHAT IT NOW IS — a structural fact about the address list — rather than
    // pinned as though deleting the clause would still red, which would be a false receipt.
    expectAbsentWithAnchor(EVIDENCE_FILE_ADDRESSES, SELF_REL,
      'tests/domain/sovereigntyMarketStageWr10w.test.js',
      'this walker is not a declared evidence address');
    expect(EVIDENCE_FILE_ADDRESSES.filter((rel) => rel.startsWith('tests/lint/')),
      'an evidence address was declared inside the enforcer tree — a walker could then vouch'
      + ' for its own wave, which is the whole thing door 4 exists to prevent').toEqual([]);
    // Braces: this file never spells a live marker in a TEST title, so door 1 would refuse it
    // even with both the exclusion and the cap gone.
    for (const row of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      if (row.kind !== 'TEST_MARKER') continue;
      expect(liveTitlesIn(self.src).some((title) => title.includes(row.marker)),
        `this walker titles ${row.wave}'s marker and would vouch for its own evidence`)
        .toBe(false);
      // …and it does not spell one in a SUITE title either. That read is no longer evidence,
      // but a marker standing there would be read by whoever audits `suiteTitles`, and the
      // instrument should not be the file that muddies its own audit.
      expect(liveSuiteTitlesIn(self.src).some((title) => title.includes(row.marker)),
        `this walker carries ${row.wave}'s marker in a suite title`).toBe(false);
      const selfCorpus = [{
        rel: SELF_REL,
        src: withVitest(`  it('${row.marker} — a title this file must never be credited for', () => {});\n`),
      }];
      expect(filesTitling(row.marker, selfCorpus),
        `this walker would vouch for ${row.wave} if it ever titled the marker`).toEqual([]);
      // …and the corpus is a real positive at a DECLARED address, so the empty result above is
      // the address rule talking and not a corpus that could never match.
      expect(filesTitling(row.marker, [{ ...selfCorpus[0], rel: AT_ADDRESS }]))
        .toEqual([AT_ADDRESS]);
    }
    // …and the walker's own titles are READ rather than lost: under the four text cuts this
    // file parked itself on the escape spellings quoted in its own arms, which meant door 4
    // was being held up by an accident. The parser sees those spellings as STRINGS, so this
    // file is credited like any other and the exclusion is doing the work alone.
    expect(liveTitlesIn(self.src).length, 'the walker reads none of its own titles')
      .toBeGreaterThan(10);
  });

  test('THE MUTANT: `measure` driven on a FORGED corpus refuses it and accepts a real pin', () => {
    // THE ARM THAT MAKES THE TIGHTENING LOAD-BEARING, and the reason the corpus is a
    // parameter. Comparing the two reads against the TREE proves nothing today — on a
    // clean tree they agree, so a revert to `src.includes` would slip through green. Here
    // the real `measure` is driven with corpora built to disagree, so the revert reds.
    for (const row of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      if (row.kind !== 'TEST_MARKER') continue;

      const forged = [{ rel: AT_ADDRESS, src: withVitest(`// ${row.marker}\n`) }];
      expect(measure(row, forged), `${row.wave}'s evidence can be forged by a bare comment`)
        .toBe(false);
      // …and the forgery IS a forgery: the refused read swallows it whole.
      expect(filesMentioning(row.marker, forged)).toHaveLength(1);

      // …and a PARKED-SUITE forgery, which is the shape four cuts of this door leaked.
      const parkedForgery = [{
        rel: AT_ADDRESS,
        src: withVitest(`describe.skip('outer', () => {\n  it('${row.marker} — parked', () => {});\n});\n`),
      }];
      expect(measure(row, parkedForgery), `${row.wave}'s evidence can be forged by a parked suite`)
        .toBe(false);

      // …and the SEMANTIC forgeries, driven through the real `measure` rather than asserted
      // through `carries` alone. These are the shapes the sixth, eighth and ninth cuts closed,
      // and this is the arm that says the CONDITION — not merely the classifier — refuses them.
      const semantic = {
        'a shadow-swallowed parked suite': `import * as V from 'vitest';\nconst { describe, it } = V;\n`
          + `describe.skip('outer', () => {\n  it('${row.marker} — forged', () => {});\n});\n`,
        'a no-op local `it`': `import { describe, expect, it as vitestIt } from 'vitest';\n`
          + 'function it(name, fn) {}\n'
          + `describe('outer', () => {\n  vitestIt('anchor', () => { expect(1).toBe(1); });\n`
          + `  it('${row.marker} — forged', () => {});\n});\n`,
        'a test that is never invoked': `function never() { it('${row.marker} — forged', () => {}); }\n`,
        // …and the eighth cut's two, driven through the CONDITION rather than the classifier.
        // Both were planted as real .test.js files under vitest 4.1.8 and both read
        // `SATISFIED / satisfiable true / missing []` off this very evaluator.
        'a test that cancels itself from its own body':
          `it('${row.marker} — forged', ({ skip }) => { skip(); throw new Error('THIS RAN'); });\n`,
        'a marker below an early return, beside a live anchor':
          `describe('the espionage confirmer lane', () => {\n`
          + `  it('an anchor so the suite is not empty', () => {});\n  if (!GATE) return;\n`
          + `  it('${row.marker} — forged', () => {});\n});\n`,
        // …and the NINTH cut's, driven through the CONDITION and not merely the classifier.
        // This is THE terminal falsifier the eighth cut shipped with: executed at all three
        // layers against that cut — classifier `reasons=[]`, shipped evaluator
        // `SATISFIED / satisfiable true / missing []` off the REAL marker, and vitest 4.1.8
        // registering NO ROW while the deliberate throw never fired.
        'a renamed vitest import specifier':
          `import { expect as it, describe, it as realIt, assert } from 'vitest';\n`
          + `describe('anchor suite', () => {\n  realIt('a real anchor', () => { assert.ok(true); });\n});\n`
          + `it('${row.marker} — forged', () => { throw new Error('THIS RAN'); });\n`,
        'a renamed specifier that forges the SUITE and its inner test at once':
          `import { expect as describe, it } from 'vitest';\n`
          + `describe('${row.marker} — forged suite', () => {\n`
          + `  it('${row.marker} — forged inner', () => {});\n});\n`,
      };
      for (const [label, plain] of Object.entries(semantic)) {
        // The alias forgeries carry their OWN vitest import — that is the whole shape — so
        // `withVitest` adds only what each source does not already bind.
        const src = withVitest(plain);
        expect(measure(row, [{ rel: AT_ADDRESS, src }]),
          `${row.wave}'s evidence can be forged by ${label}`).toBe(false);
        expect(filesMentioning(row.marker, [{ rel: AT_ADDRESS, src }]),
          `${label} never carried ${row.wave}'s marker at all`).toHaveLength(1);
      }

      // …AND THE ONE FORGERY THE PRELUDE WOULD ITSELF CURE, so it is driven WITHOUT one: an
      // opener bound by nothing at all. Every real estate file imports its openers from
      // 'vitest' (all 2,314, measured) and the repository declares no `globals: true`, so a
      // marker in a file that binds no opener is a marker this reader cannot tie to vitest at
      // all — and the CONDITION refuses it, not merely the classifier.
      const bareGlobal = [{
        rel: AT_ADDRESS,
        src: `it('${row.marker} — forged by a global opener', () => {});\n`,
      }];
      expect(measure(row, bareGlobal),
        `${row.wave}'s evidence can be forged by an opener bound by nothing`).toBe(false);
      expect(filesMentioning(row.marker, bareGlobal)).toHaveLength(1);

      const real = [{
        rel: AT_ADDRESS,
        src: withVitest(`  it('${row.marker} — the pin the row is an address for', () => {});\n`),
      }];
      expect(measure(row, real), `${row.wave}'s row cannot be satisfied by a real live pin —`
        + ' the SATISFIED arm would be unreachable and the instrument permanently dark')
        .toBe(true);
    }
  });

  test('THE MEASUREMENT USES THE TIGHT READ: every TEST_MARKER row agrees with it', () => {
    // The join between the module-level `measured` map and the address rule, asserted
    // rather than assumed — this is the tree-side half of the mutant above.
    for (const row of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      if (row.kind !== 'TEST_MARKER') continue;
      expect(measured[row.wave], `${row.wave}'s measurement is no longer the titled read`)
        .toBe(filesTitling(row.marker).length > 0);
    }
  });
});

describe('the sovereignty lighting condition — the evaluator can flip, proven by injection', () => {
  test('SIMULATED EVIDENCE: with all three present the condition flips SATISFIED', () => {
    // THE FLIP, PROVEN WITHOUT WAITING FOR ES-4. The day ES-4 lands its marker, the
    // measured map above becomes exactly this one and the tree reaches this state on its
    // own. Pinning it by injection is what stops the SATISFIED arm from being an
    // unreachable branch for however many waves ES-4 is away.
    const all = Object.fromEntries(SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => [row.wave, true]));
    const verdict = evaluateSovereigntyLighting(all);
    expect(verdict.state).toBe('SATISFIED');
    expect(verdict.satisfiable).toBe(true);
    expect(verdict.missing).toEqual([]);
    expect(verdict.rows.every((row) => row.present)).toBe(true);
  });

  test('EACH row is load-bearing: dropping any ONE reads UNSATISFIED_TRACKED, naming it', () => {
    for (const dropped of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      const presence = Object.fromEntries(
        SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => [row.wave, row.wave !== dropped.wave]),
      );
      const verdict = evaluateSovereigntyLighting(presence);
      expect(verdict.state, `${dropped.wave} dropped and the condition still read satisfied`)
        .toBe('UNSATISFIED_TRACKED');
      expect(verdict.missing).toEqual([dropped.wave]);
      expect(verdict.message, 'the failure names the wave that is missing').toContain(dropped.wave);
    }
  });

  test('DARK-NEVER-PERMISSIVE: only strict `true` counts as evidence', () => {
    // A scanner that broke and returned `undefined`, a truthy string, or a 1 must never
    // read as a landed wave — the same law the flag tables stand on.
    for (const impostor of [undefined, null, 1, 'true', {}, []]) {
      const presence = Object.fromEntries(
        SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => [row.wave, impostor]),
      );
      const verdict = evaluateSovereigntyLighting(presence);
      expect(verdict.state, `${String(impostor)} was accepted as evidence`).toBe('UNSATISFIED_TRACKED');
      expect(verdict.missing).toHaveLength(3);
    }
    // A non-object measurement is the all-dark reading, which is the honest one.
    expect(evaluateSovereigntyLighting(null).missing).toHaveLength(3);
  });
});
