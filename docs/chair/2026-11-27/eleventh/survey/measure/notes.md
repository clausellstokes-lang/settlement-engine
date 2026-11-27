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
