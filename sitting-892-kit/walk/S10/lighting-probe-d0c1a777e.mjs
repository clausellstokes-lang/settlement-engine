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
 * ⚠ THE STATE THIS SECTION DESCRIBES ENDED ON 2026-08-06. ES-4 LANDED, and the condition now
 * reads `SATISFIED / satisfiable true / missing []` — measured off this file's own shipped
 * evaluator, with `tests/domain/espionageDistantSourceEs4.test.js` as the one carrying file.
 * The design below is UNCHANGED and every word of it still binds: it was built to be green in
 * BOTH build states, so nothing here needed loosening when the second state arrived, and the
 * mutants that proved the flip without waiting for ES-4 are the same ones that now prove it
 * did not arrive by accident. The paragraph is kept in its own tense because it records why
 * the assertions are shaped as they are; rewriting it to the new tree would delete the
 * argument. What follows describes the world before that landing.
 *
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
import { readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import espreeCjs from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad/laneCUREPORC-tree/node_modules/espree/dist/espree.cjs'; const { parse } = espreeCjs;
const describe=()=>{}; const test=()=>{}; const expect=()=>{throw new Error('probe: expect() in pure region')}; expect.soft=expect; expect.extend=()=>{};

import { expectAbsentWithAnchor } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad/laneCUREPORC-tree/tests/helpers/anchoredNegatives.js';

import {
  SOVEREIGNTY_LIGHTING_EVIDENCE,
  SOVEREIGNTY_LIGHTING_FLAG,
  SOVEREIGNTY_LIGHTING_STATES,
  WAR_RULINGS_FLAG_KEYS,
  evaluateSovereigntyLighting,
} from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad/laneCUREPORC-tree/src/domain/certification/warConvergenceContract.js';
import { ENGINE_GATED_VIRTUAL_RULE_KEYS } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad/laneCUREPORC-tree/src/domain/worldPulse/simulationRules.js';

const ROOT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad/laneCUREPORC-tree';

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

// ── THE CENSUS REGISTER (ODQ §778.2, TE-EFF-1 car 2) ─────────────────────────────────
// The five figures used to be an inline constant a few thousand lines below, at the foot
// of their own derivation history. They are now a file, and the reason is measured rather
// than aesthetic: EVERY landing on the night of 2026-08-29/30 conflicted on that one line.
// Two lanes measuring the same instrument from the same base produce tuples that are each
// correct and JOINTLY MEANINGLESS — a composed delta is arithmetic performed on two
// different trees — so the conflict could never be resolved by merging, only by
// re-measuring. TE-QSTYLE's own block says so in as many words: "THE PRE-REBASE BLOCK WAS
// DROPPED WHOLE, NOT MERGED, and that is the law rather than a convenience."
//
// ⭐ THE EXTRACTION DOES NOT MAKE THAT LAW UNNECESSARY — IT MAKES OBEYING IT CHEAP. The
// resolution for a conflicted register is "take either side, then regenerate", and the
// regeneration is one command. Nothing here permits a hand-composed figure; the register
// simply stops dragging four thousand lines of history through every rebase.
//
// ⚠ THE HISTORY DELIBERATELY DID NOT MOVE. Every prior row, its cause and the census laws
// stay in this file beside the assertions they explain, because a derivation history in a
// JSON `_doc` array is a history nobody reads. Only the live tuple is a file.
//
// §769.4 WALKER-INVISIBLE REGISTER: the register is a `.json`, so TEST_FILES (which filters
// `\.test\.(js|jsx)$`) cannot see it and the tuple cannot count itself. That invisibility is
// ASSERTED below rather than assumed — renaming the register into census range would
// otherwise be a silent off-by-one nobody could attribute.
const CENSUS_BASELINE_REL = 'tests/lint/.lighting-census-baseline.json';
const CENSUS_BASELINE_PATH = join(ROOT, CENSUS_BASELINE_REL);
const CENSUS_FIGURE_KEYS = Object.freeze(['files', 'parked', 'credited', 'titles', 'suiteTitles']);
// PROVENANCE IS LOAD-BEARING, NOT DECORATION. A tuple whose measuring sha is unknown cannot
// be audited against the tree it was measured on, and the one failure this register could
// introduce that the inline constant could not is a figure someone typed. Absent or blank
// provenance therefore REDS — a register that accepts an anonymous number is a register that
// has quietly become a place to park a guess.
const CENSUS_PROVENANCE_KEYS = Object.freeze(['measuredAtSha', 'measuredBy', 'date', 'note']);

function loadCensusBaseline() {
  let raw;
  try {
    raw = readFileSync(CENSUS_BASELINE_PATH, 'utf8');
  } catch (error) {
    throw new Error(`the census register ${CENSUS_BASELINE_REL} is missing or unreadable`
      + ` (${error.message}). It is not optional: without it this walker asserts nothing.`,
    { cause: error });
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`the census register ${CENSUS_BASELINE_REL} is not valid JSON`
      + ` (${error.message}) — regenerate it rather than repairing it by hand.`,
    { cause: error });
  }
  for (const key of CENSUS_PROVENANCE_KEYS) {
    const value = parsed[key];
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`the census register ${CENSUS_BASELINE_REL} is missing provenance field`
        + ` '${key}'. Every figure here must name the sha it was measured at, who measured it,`
        + ' when, and why it moved — a tuple nobody can attribute is a guess with a filename.'
        + ' Regenerate it; never hand-fill the field.');
    }
  }
  const figures = {};
  for (const key of CENSUS_FIGURE_KEYS) {
    const value = parsed[key];
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`the census register ${CENSUS_BASELINE_REL} figure '${key}' is`
        + ` ${JSON.stringify(value)}, not a non-negative integer.`);
    }
    figures[key] = value;
  }
  return figures;
}

/**
 * THE ONE SPELLING OF THE MEASUREMENT. Both the assertion arm and the regeneration arm read
 * the estate through this, so the thing that is re-frozen is by construction the same thing
 * that is asserted. A regeneration path with its own copy of these four expressions would be
 * a second implementation that drifts, and the drift would be invisible precisely because
 * both halves would agree with themselves.
 */
function measureCensus() {
  const parked = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length > 0);
  const credited = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length === 0);
  const titles = credited.reduce((sum, { src }) => sum + liveTitlesIn(src).length, 0);
  const suiteTitles = credited.reduce((sum, { src }) => sum + liveSuiteTitlesIn(src).length, 0);
  return {
    parked,
    credited,
    titles,
    suiteTitles,
    figures: {
      files: TEST_FILES.length,
      parked: parked.length,
      credited: credited.length,
      titles,
      suiteTitles,
    },
  };
}

/**
 * TWO READERS, BECAUSE GIT SPEAKS TWO SHAPES AND ONE TRIM CANNOT SERVE BOTH. `gitRaw` is the
 * exec. `gitOut` is the SCALAR reader, and its `.trim()` is LOAD-BEARING exactly there: the one
 * caller below is `gitOut('rev-parse', 'HEAD')`, whose value is written straight into the
 * register's `measuredAtSha` provenance field, and an untrimmed read would carry a trailing
 * newline into it. The LINE reader is `parsePorcelainPaths` below, and it must not travel
 * through the scalar trimmer — that routing, not the trim itself, was the defect.
 */
const gitRaw = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
const gitOut = (...args) => gitRaw(...args).trim();

/**
 * THE PORCELAIN READER, AND WHY IT IS NOT A ONE-LINE `.trim().split()` ANY MORE. It replaces
 * one, and that one REFUSED THE SINGLE PATH THIS DOOR EXISTS TO PERMIT — but only sometimes,
 * which is exactly why it survived a landing and two lanes disagreed about whether it was real.
 *
 * `git status --porcelain` emits one record per line, `XY<space>path`: X and Y are the two
 * columns of the status field, column 3 is the separator, and THE PATH BEGINS AT COLUMN 4. For
 * a worktree-only modification X is a SPACE, so the record reads ` M tests/lint/…`. Trimming
 * the WHOLE command output — which is the right thing for a scalar and the wrong thing here —
 * eats that leading space ON THE FIRST LINE ONLY, so a `slice(3)` correct for every other line
 * takes one character too many from line one, and the mangled path fails the allowlist.
 *
 * MEASURED, NOT REASONED (lane CURE-PORCELAIN, at this file's own blob, both arms executed):
 * a FIRST refreeze from a clean tree SUCCEEDS, because a clean tree has no line to mis-slice.
 * A SECOND refreeze — the register dirty and therefore first, which is the state the first
 * refreeze itself creates and which this register's documentation promises is permitted —
 * refused itself with `Dirty: ests/lint/.lighting-census-baseline.json`, one letter short. So
 * the promise that a refreeze is REPEATABLE was false, and the failure was silent in the
 * safe-looking direction: it refuses when it should permit, and a refusal reads as caution.
 *
 * THE SEPARATOR IS ASSERTED, NOT ASSUMED, AND THAT IS THE PREVENTION. A column slice is only
 * correct while the record really is `XY<space>path`, and this defect WAS a column slice
 * applied to a record whose columns had shifted underneath it. A row without the separator now
 * THROWS instead of being sliced on faith — which means the very mistake this cures can no
 * longer happen quietly: put the whole-output trim back and the first record arrives as
 * `M tests/…`, whose column 3 is a letter, and this parser says so out loud.
 *
 * NOT HANDLED, DELIBERATELY, AND IT FAILS IN THE CONSERVATIVE DIRECTION: a rename record spells
 * `R  old -> new`, and a path needing quoting arrives C-quoted. Neither can ever equal the
 * register's own path, so both land in the dirty list and the door REFUSES rather than permits.
 * Reading them properly wants the NUL-separated form, which is a different command and a wider
 * change than this one — `scripts/implementation-session.mjs` already spells it that way.
 *
 * PURE ON PURPOSE: it takes the bytes rather than fetching them, so the parse can one day be
 * proved against canned records without a subprocess and without a dirty tree.
 */
function parsePorcelainPaths(raw) {
  return raw
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => {
      if (line.length < 4 || line[2] !== ' ') {
        throw new Error('census refreeze REFUSED — this is not a `git status --porcelain`'
          + ` record: ${JSON.stringify(line)}. The status field is columns 1-2, column 3 is the`
          + ' separator, and the path begins at column 4. Refusing to slice a record whose shape'
          + ' it cannot recognise is this parser\'s whole job. Nothing was written.');
      }
      return line.slice(3);
    });
}

/**
 * THE REGENERATION PATH. One command, documented in the register's own `_doc`:
 *
 *   LIGHTING_CENSUS_REFREEZE='<lane or seat id>' LIGHTING_CENSUS_NOTE='<why it moved>' \
 *     npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
 *
 * THREE REFUSALS, each for a failure this program has actually taken:
 *
 *  1. A DIRTY TREE. This census counts the WORKING TREE, and in a shared tree that working
 *     tree can hold ANOTHER lane's uncommitted test files — measuring then charges their
 *     files to you and writes a figure no checkout of your commit can reproduce. ES-1 was
 *     bitten by exactly this and had to re-measure on a `git archive` of its own parent. The
 *     register itself is the one permitted dirty path, so a refreeze is repeatable.
 *  2. A PARTIAL WRITE. All five figures are measured, integer-checked and arithmetic-checked
 *     BEFORE anything is written, and the write is a temp file plus a rename — so an
 *     interrupted refreeze leaves the previous register intact rather than a half-tuple that
 *     would read as a real measurement.
 *  3. BLANK PROVENANCE. The lane id and the cause are required inputs. `REFREEZE=1` would
 *     write `measuredBy: "1"`, which is provenance in shape only.
 *
 * ⭐ AND IT EXITS NON-ZERO ON SUCCESS, WHICH IS DELIBERATE. A mode that both rewrites the
 * baseline and reports a green test is a mode that can silently disarm this guard for a whole
 * gate run. Refreezing therefore always fails loudly, and the VERIFICATION is a separate,
 * ordinary run of the same walker — that green is the receipt, not this one.
 */
function refreezeCensusBaseline() {
  const measuredBy = (process.env.LIGHTING_CENSUS_REFREEZE ?? '').trim();
  const note = (process.env.LIGHTING_CENSUS_NOTE ?? '').trim();
  if (measuredBy === '' || measuredBy === '1' || note === '') {
    throw new Error('census refreeze REFUSED — provenance is an input, not a formality.'
      + ' Set LIGHTING_CENSUS_REFREEZE to the lane or seat doing the measuring (not "1") and'
      + ' LIGHTING_CENSUS_NOTE to the cause of the movement.');
  }

  const dirty = parsePorcelainPaths(gitRaw('status', '--porcelain'))
    .filter((path) => path !== CENSUS_BASELINE_REL);
  if (dirty.length) {
    throw new Error('census refreeze REFUSED — the tree is dirty, and this census counts the'
      + ' WORKING TREE. In a shared tree those paths may belong to another lane, and charging'
      + ' their files to this measurement writes a figure no checkout can reproduce. Commit'
      + ` first, then refreeze at the clean tip. Dirty: ${dirty.join(', ')}`);
  }

  const { figures } = measureCensus();
  for (const key of CENSUS_FIGURE_KEYS) {
    if (!Number.isInteger(figures[key]) || figures[key] < 0) {
      throw new Error(`census refreeze REFUSED — measured '${key}' is`
        + ` ${JSON.stringify(figures[key])}. Nothing was written.`);
    }
  }
  if (figures.parked + figures.credited !== figures.files) {
    throw new Error('census refreeze REFUSED — the measured figures do not close:'
      + ` ${figures.parked} parked + ${figures.credited} credited !== ${figures.files} files.`
      + ' Nothing was written.');
  }

  const previous = JSON.parse(readFileSync(CENSUS_BASELINE_PATH, 'utf8'));
  const next = {
    _doc: previous._doc,
    measuredAtSha: gitOut('rev-parse', 'HEAD'),
    measuredBy,
    date: new Date().toISOString().slice(0, 10),
    note,
    ...figures,
  };
  const temporary = `${CENSUS_BASELINE_PATH}.refreeze-${process.pid}`;
  writeFileSync(temporary, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  renameSync(temporary, CENSUS_BASELINE_PATH);

  const moved = CENSUS_FIGURE_KEYS
    .map((key) => `${key} ${previous[key]} -> ${figures[key]}`)
    .join(', ');
  throw new Error(`census REFROZEN at ${next.measuredAtSha} by ${measuredBy}: ${moved}.`
    + ' This run fails BY DESIGN so a refreeze can never be mistaken for a passing gate —'
    + ' re-run this walker without LIGHTING_CENSUS_REFREEZE, and THAT green is the proof.');
}

const censusRefreezeRequested = () => (process.env.LIGHTING_CENSUS_REFREEZE ?? '') !== '';

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
 *
 * ⛔⛔ AND THAT LAST SENTENCE WAS FALSE — CORRECTED 2026-08-31 (TE-INSTR-2), BY MEASUREMENT.
 * An inline literal table is NECESSARY AND NOT SUFFICIENT. It clears THIS rule and lands the
 * file on G1 instead, because `each`/`for` hand the ROW to the callback and `contextFreeCallback`
 * refuses a registration callback that declares ANY parameter — so the prescribed reformat
 * converts `TEST_TABLE_UNPROVEN` into `TEST_CONTEXT_PARAM` and CREDITS NOTHING. A table-driven
 * test that cannot read its row is not a reformat, it is a deletion.
 *
 * MEASURED AT a107bcde3 over the whole estate, and the numbers are why this is a correction
 * rather than a caveat: 2,455 test files, 371 parked. 112 of them — 30 % OF THE ENTIRE PARKED
 * POPULATION — park SOLELY on the each/for family. Of those, 51 park ONLY on
 * `*_CONTEXT_PARAM:*.each()`, which this classifier can only reach when `tableOk` is already
 * TRUE: those 51 files ALREADY HAVE THE INLINE LITERAL TABLE THIS COMMENT PRESCRIBED AND ARE
 * PARKED ANYWAY. The remaining 55 park on `TABLE_UNPROVEN` alone — i.e. doing the prescribed
 * reformat on all 55 would move them into the 51 and bank NOTHING.
 *
 * ⭐ THE ONE REFORMAT THAT ACTUALLY CREDITS A TABLE-DRIVEN FILE is the one W-FAITH F3c's J11
 * arrived at independently: a plain `it`/`test` whose callback takes NO PARAMETER, looping over
 * the rows INSIDE its body with a per-row assertion label (the estate's
 * `expect(problems, msg).toEqual([])` idiom, which also reports every failing row instead of
 * only the first). Its costs are real and must be sized before it is taken: the runtime test
 * count falls to one per loop, and the whole loop runs under ONE 20 s `testTimeout` that
 * `argFormAccepts` forbids raising per-test — so a slow table must be split into several
 * bucket-sized plain tests rather than collapsed into one.
 *
 * ⚠ THIS WAS NOT A DRAFTING SLIP, AND THE BATTERY IS WHY IT SURVIVED: every literal-table
 * source in this file's own accuracy controls is written with a PARAMETERLESS callback — a
 * shape no estate file writes — so the arm proving "a literal table is credited" proved it
 * through a door the estate never walks through. The missing pin is added beside those
 * controls: the same literal table, credited without a parameter and parked with one.
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
 *   • ES-4's declared home. DECLARED HERE BEFORE IT EXISTED and BUILT 2026-08-06 — the ES
 *     charter's VERIFY-AT-BUILD step resolves to this walker, so the address was declared
 *     here and the builder read it here, which is exactly how the cap is meant to work. A
 *     marker in any other file is not evidence — the walker will read the pin, refuse it, and
 *     the census arm below says which addresses are declared and which are still unbuilt.
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
/**
 * The declared addresses whose wave has NOT been built. EMPTY since ES-4 landed
 * (2026-08-06): all three evidence homes now stand in the tree.
 *
 * ⚠ EMPTYING THIS LIST IS A TIGHTENING RATHER THAN BOOKKEEPING, AND IT CLOSES A HOLE THAT
 * ONLY OPENED WHEN THE FILE ARRIVED. The census arm below excuses a DECLARED address that is
 * missing from the tree exactly when it is named here. With ES-4's address listed AND its
 * file present, DELETING that file would have been excused as "not built yet" — the
 * condition would have fallen back to `UNSATISFIED_TRACKED` and this walker would have
 * stayed green over it. EXECUTED BOTH WAYS AT THE LANDING: with the address still listed a
 * deleted evidence file passes that arm; with the list empty it reds by name. An address
 * belongs here only while its wave genuinely has no file.
 * @type {ReadonlyArray<string>}
 */
const UNBUILT_EVIDENCE_ADDRESSES = Object.freeze([]);
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


console.log('TUPLE ' + JSON.stringify(measureCensus().figures));
