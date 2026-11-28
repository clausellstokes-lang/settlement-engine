# W2-C-LEAVES-3 — the third seat's probes (2026-11-13)

Every probe takes trees by absolute path (a worktree with `node_modules`) and a corpus written by a births script; none
writes in a tree. Corpora: the census's 720 (`SECOND-WAVE-CENSUS/births.mjs`, lane/second-wave-census-2026-11-12:
`TREE=<tree> OUT=<dir> node births.mjs` → `<dir>/corpus.ndjson.gz`); the reader's 20 (`births20.mjs`,
`TREE=<tree> OUT=<dir> SEEDS=<REVIEW-R2-STAGES/seeds20.txt> node births20.mjs` → `<dir>/corpus20.ndjson.gz`); 150 fresh
seeds this seat never tuned on (`fresh.mjs`, `TREE=<tree> OUT=<file> node fresh.mjs`); the golden master's 525
configurations (`golden.mjs`, `TREE=<tree> OUT=<file> node golden.mjs`).

| probe | run | measures |
|---|---|---|
| fdiff.mjs | `node fdiff.mjs <corpusA> <corpusB>` | the FIELD DIFF: records differing, A against B (byte compare of each record) |
| pdiff.mjs | `node pdiff.mjs <corpus> <treeA> <treeB> <out.json>` | what moves on the page leaves: gap lines, grades, Produced locally, needs, arrivals |
| items.mjs | `node items.mjs <corpus> <beforeTree> <afterTree>` | this seat's seven classes before → after, judged by the after tree's readers |
| p452.mjs | `node p452.mjs <corpus> <treeA> <treeB> <out.json>` | the Unexploited cards' "Needs:" names a live house meets |
| p1.mjs / p1after.mjs / p1idle.mjs | `node p1.mjs <corpus> <tree> <out.json>` | the grade classes (filed × leaf), card vs sentence, ruling 7 |
| p1c.mjs / p1cpart.mjs / p1cnew.mjs | `node p1c.mjs <corpus> <treeA> <treeB>` | DS-ECO-11's exploitation line vs the card's grade; the Partial lines before/after |
| p1bwhich.mjs / p1bgap.mjs | `node p1bwhich.mjs <corpus> <tree> <diff.json>` | which export answers each P1-b move; the gap lines it returns |
| pring2.mjs | `node pring2.mjs <corpus> <treeA> <treeB>` | the criminal structure key, A against B, with the rings beside it |
| arc.mjs / arcread.mjs | `node arc.mjs <corpus> <tree>` | Arcane Support "Present" beside the defence's hasArcane false |
| p169.mjs / p169b.mjs | `node p169.mjs <corpus> <tree>` | imports listed under a siege that stops trade |
