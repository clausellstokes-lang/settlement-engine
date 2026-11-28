# SURVEY-MEASURE running notes (scratch: /tmp/survey; deliverables: /tmp/survey/out)

- 22:3x UTC 2026-11-27. Tree: /home/user/settlement-engine at 682667fe2bbfc614be8185668119c638b2e3cf71 (HEAD checked). Chair record: lane/chair-2026-11-08 at 1342ea950 (worktree /home/user/chair, read-only).
- npm ci: exit 0. git fetch --unshallow: exit 0.
- Earlier seat's tools copied to /tmp/survey/tools. My instrumented renderer: /tmp/survey/tools3 (build3.mjs = the seat's build.mjs plus a BUNDLE-TIME source transform of four tree files, nothing written to the tree:
  factVocabulary.js (declarationAdmits wrapped: a refusal outside the draw doors is logged with its caller),
  drawDeclared.js (the drawn line's verdict, filterDeclared's refused items),
  stateProseKernel.js (eligibleVariants/drawVariant: the variant that would have won the hash draw over the pool less its fact filter, when it was refused; a pool silenced by facts; resolveDeclaredPosition),
  presumptionLedger.js (a setter so the harness keeps a ledger open per phase: the notes of every drawn line)).
  harness3.jsx = the seat's harness (birthConfig, OutputContainer, walkDossier owner then share) with phases birth / stamp (withPublicProse) / owner / share.
- Trial 3 births: 8 s mean (thorp 8 s first-run, village 3 s, metropolis 13 s); 100-130 unique refusals a page; 0 hook errors.
- Corpus run: runboth.sh (C then V, chunks of 75, niced, one process at a time), log /tmp/survey/run.log.
- (G) method: a TypeScript-AST sweep of every string literal and JSX text under src (comments are not read) for coher|contradict|consistent|self-check|trust|accurate|reconcil (411 hits; most are town prose: "trust" between people, import "reconcile" UI); kept only the lines where the PRODUCT speaks about the page or the engine; plus the landing copy read whole (src/copy/landing.js, src/copy/en.js hero), the About ("trust") and Bounty pages read whole, the page's own self-check pool DS-GEN-11 (all 22 vids, incl. THE FIRST-SURVEY QUALIFICATION, which already frames the page as a survey: "This town has been described once; nobody has been back to check."), the verdict badge, the PDF's Viability front lines. The PDF Cover carries no promise line ("AI NARRATIVE EDITION", "Free preview…"). docs/content holds only receipt/census docs (no user copy). 80 rows.
- 22:5x first D reading on C's first 300 pages (thorp, hamlet): 30,750 unique refusals (median 102 a page); 3 with an UNKNOWN atom (prosperity: ≥ prosperous, troubleHooks outside_debt); every other refusal is an atom the record ANSWERS. The charter's fail-open would lift 3 of 30,750 there.

## C corpus complete (900 pages, 2026-11-27 23:59 UTC), CONFIRMED by script (an/d.mjs, an/e-ledger.mjs)
- refusals (unique per page/phase key): 80,839; per page median 91 (47..140).
- primary bucket: noun-answered 46,875; both-answered 20,007; state-answered 7,564; judgment-answered 5,067; held 1,048; other-answered 255; judgment-unknown 23.
- by door: filter 57,419; draw 14,302; kswap 7,674; direct 1,362; kempty 82.
- ANY unknown atom: 23 refusals, 23 pages, ONE pool (`troubleHooks:TROUBLE_HOOKS:outside_debt`, "A wealthy household offers to pay the debt itself…", needs `prosperity: ≥ prosperous`, drawn at birth before prosperity is written). Fail-open on JUDGMENT unknown lifts 23; on JUDGMENT-or-BOTH unknown also 23.
- the 23 read against the page's printed prosperity (an/dsample.mjs; Economics field 1): 19 below prosperous (refusal TRUE), 4 at Prosperous (dp-thorp-17, dp-village-21, dp-village-27, dp-town-16: refusal FALSE). The line printed on none of the 23 (its sibling hooks filled the three).
- declared-excludes clashes (ledger): `guild` 4 pages, `crisis: under_siege` 6 pages (owner = share).

## V corpus, sweep, B and D (2026-11-28 01:20 UTC), CONFIRMED by script
- V: 900 pages, 0 errors; refusals 80,718, median 91; judgment-unknown 20 (20 pages, same pool, same line). C + V: 161,557 refusals; 43 JUDGMENT-unknown.
- births sweep (tools3/sweep.jsx, bundle4): 1,800 births, 0 errors. 10 atoms answer UNKNOWN on a final record: 7 context atoms (by construction) and 3 UNKNOWN BY DESIGN (clay kilns, charcoal kilns, critical import brought in: undefined silences line and twin). Every other atom answers on all 1,800.
- D readings of the 43 (against the printed prosperity): TRUE 33, FALSE 5, CANNOT TELL 5.
- V run log: React warned of two children with the same key `Thieves' Guild` (one metropolis-tier chunk, 793..868): a page lists one Thieves' Guild twice (not chased: out of the seven).
