# W2-WRITE — the draft shift record (UNSIGNED; the merge seat signs, the writer runs no golden's door)

Measured by running each surface's own test at the scratch base `a98e459f0` (202e58953 + W2-A-LEAVES 96d698de7: every merge this lane carries, none of its writing) and at the lane's tip, and diffing the failure output line for line (timings stripped).

| surface | test | base | tip | verdict |
|---|---|---|---|---|
| generator golden master | tests/property/generatorGoldenMaster.test.js | red (the base's own, not this lane's) | red, failure output IDENTICAL | **UNMOVED** (display-only lane: no generator byte moves) |
| espionage fence | tests/property/espionageDormancyFence.test.js | red (the driven golden) | red, IDENTICAL | **UNMOVED** |
| dossier prose manifest | tests/property/dossierProseManifest.test.js | red ×3 (the drift arm: 954 rows moved, 73,569 cells) | red ×3: 1,050 rows moved, 73,751 cells | **MOVED** by this lane's lines (+96 rows, +182 cells): the merge seat re-pins through the manifest's door |
| PDF golden | tests/pdf/goldenViewModel.test.js | red (canon values) | red, IDENTICAL | **UNMOVED** (the canon values carry no corpus prose) |
| Herald desk golden | tests/property/heraldKnowledgeDeskGolden.test.js | red (the refile) | red, IDENTICAL | **UNMOVED** |
| preset-lighting witness | tests/simulation/presetLightingWitness.test.js | green | green | **UNMOVED** |

Rows red at the tip as the merge seat's act: the manifest's three drift titles (they were red at the base for W2-A-LEAVES's 5a; this lane adds 96 moved rows to them).
