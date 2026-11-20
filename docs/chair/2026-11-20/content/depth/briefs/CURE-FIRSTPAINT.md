# Brief: CURE-FIRSTPAINT (DEPTH-3's builder; the conflict unit's edge into first paint; written 2026-11-20T19:51Z by `date -u`; dispatched only on the chair's word)

THE FINDING (DEPTH-3, fresh `npm run build` + `VERIFY_DIST=1` `tests/build/vendorPdfLazy.test.js`, figures in DEPTH-3-HANDBACK.md): at 15b13325e
(hooks tranche 2 merged) the entry's static closure is 1,190,052 raw with no lazy chunk in it; at 2582075ed (the conflict unit merged at
743dbb3c1) it is 3,309,715 raw / 950,068 gzip / 774,953 Brotli: `coherence-lazy` (279k), `data-lazy` (1.84M) and `narrative-mutations`
ride first paint; red there: "the FIX-B2 anchored-leaf chunks are ABSENT from the entry transitive static closure", "no prose leaf reaches a
first-paint chunk…", "every prose leaf lands in a data-lazy chunk". In the built chunks, `engine-core` statically imports one export of
`coherence-lazy` (a function `(e) => rows(e).map(nameOf).filter(Boolean)`, the live roster's names) and calls it from code beside the three
`rosterGrounds.js` readers. PLAUSIBLE cause: the conflict unit's new `src/domain/facts/rosterGrounds.js` (imported by `facts/factsOf.js`,
generator-reached) joined vite.config's DERIVED engine-core set (`ENGINE_SHARED_DOMAIN`) and imports a module routed to coherence-lazy.
`tests/architecture/engineCoreLazyEdge.test.js` is GREEN on this tree: it missed the edge.

THE CURE, by vite.config.js's own convention (read its `ENGINE_SHARED_DOMAIN_EXCISIONS` and `FIRSTPAINT2_LAZY_DOMAIN` notes WHOLE, and the
guard's header): FIRST establish by execution which module carries the edge (run the shipped `manualChunks` over the source as the guard does;
name the module, its chunk, and the lazy module it imports); then cure it the convention's way (excise from the derived set and pin with the
lazy module it imports, with a measured note beside the pin; or the alternative the notes prescribe), changing NO source behaviour: no draw,
no text, no stored field moves (DEPTH-3 runs the two-tree proof: 0 differences). Then WIDEN `engineCoreLazyEdge.test.js` so it reds on this
tree (say why it missed: e.g. an unpinned or excised hop it does not follow) and greens after, at full strength (no case removed).
RED FIRST (record titles and counts): the widened guard red at your base, green after. DO NOT run `npm run build` or tests/build (DEPTH-3
takes the build proof: the FIX-B2 test red now, green after, and the closure figures).
FILES YOU OWN: `vite.config.js`, `tests/architecture/engineCoreLazyEdge.test.js` (and `tests/architecture/factHomesLazy.test.js` only if it
must move with it; say why). Not `package.json`. Branch `lane/depth-3-2026-11-20-firstpaint` cut from 2582075ed in your own worktree under the
scratchpad (symlink node_modules from /home/user/settlement-engine). Commit by explicit paths with receipts; never push, never `--no-verify`,
never `git stash`, no census, never the whole suite, no GIT_* variable in a test run's environment, runs to files read by count lines via
`sh scripts/gate-tail.sh`, one test process at a time. GREEN AT YOUR TIP: `tests/architecture` whole; every test under tests/ naming
`vite.config`, `ENGINE_SHARED_DOMAIN` or `FIRSTPAINT2_LAZY_DOMAIN`; `npx eslint` on touched files.
ANSWER (at most 200 words): the module and the edge, by execution; the cure; shas; red-first receipts; count lines.

THE CHAIR'S GO AND RULINGS (19:54 UTC; recorded 19:56 UTC by `date -u`; they govern where they differ above):
(R1) `src/domain/facts/rosterGrounds.js` is NOT reached from engine-core: the eager vocabulary (`factVocabulary.js`, `registeredWords.js`,
`factLayers.js`) declares the three atoms BY NAME only; the code that ANSWERS them (it needs `liveInstitutionNames`) is imported only where
`factsOf` answers, on the lazy side; `liveInstitutionNames.js` STAYS pinned where it is. (DEPTH-3's read: those three name rosterGrounds only
in comments and `factsOf.js` is its one importer, so establish by execution how it reaches engine-core and cure THAT; if the cure needs a
source edit, it moves no behaviour; you may then edit those three and `factsOf.js`/`rosterGrounds.js` only as far as the edge requires.)
(R2) RED FIRST TWICE: DEPTH-3's build (FIX-B2 and "no prose leaf" red at 2582075ed, green after; beside the line's 1,177,668 / 374,676 /
314,472 at 8196e5712), and `engineCoreLazyEdge.test.js` WIDENED so its derivation sees this edge: red at 2582075ed, green after. Write in
your commit message and answer ONE SENTENCE saying what the derivation missed (the chair carries the widened test to the line).
(R3) No draw moves (DEPTH-3's two-tree proof: 0 non-string differences). (R4) The conflict unit's own tests green at your tip:
`tests/generators/power/conflictQuarrelPick.test.js`, `tests/domain/facts/factVocabulary.test.js`, `tests/generators/governanceNarrative.test.js`,
and every test file naming `rosterGrounds`, `factsOf` or `factVocabulary`; tell DEPTH-3 if a test title moved (the lighting census is DEPTH-3's).
