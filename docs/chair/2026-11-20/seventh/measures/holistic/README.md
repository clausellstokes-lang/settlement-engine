# A holistic count of freshly born towns (the seventh chair, 2026-11-20 07:52 UTC)

Taken to answer the owner's question of 2026-11-20 ("tell me about your expectation of generated settlements
holistically") from the towns and not from memory. EXECUTED by the chair in its own container.

- THE TREE: the chair's copy of the working line at `7f18b9edb94e395134839e6bb6931cd587ccdcfd` (points 77 and 78 merged: the names work and the
  first titles table; the seat's law, the session sheet's frame and the traditions' descriptions are NOT in it).
- THE BIRTH: the names walker's own recipe (`tests/lint/namesInSentences.walker.test.js`):
  `loadGenerationLawPayloads()`, then `generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} })`.
- THE TOWNS: a prefix nobody tuned to. UNTOUCHED: `{ ...DEFAULT_CONFIG, settType }`, seeds `hxd-<size>-<i>`, 50 a
  size (300). EVERY DIAL RANDOM: the page census's `DIALS` over it, seeds `hxr-<size>-<i>`, 25 a size (150).
  At untouched settings culture, trade access, monster threat and the crisis are already random; the five
  priorities stand at 50.
- RE-RUN (about one minute each, from the line's checkout): `node batch.mjs <line> 50 25`; `node batch2.mjs <line> 50`.
- THE OUTPUTS: `batch.out.txt` (size by tier, state, government, culture, the capture rung, and SAMENESS with names
  masked); `batch2.out.txt` (legitimacy by tier, all and born under no stress, with the breakdown's means; repeated
  lines INSIDE one town by tier; one example).

WHAT IS A CRUDE PROXY AND NOT A MEASURE: the masking (a town's own names, roles, houses and powers replaced by a
mark; digits by #) under-counts a repeat whose names it fails to mask and over-counts none; the "secret that does not
fit its holder" figure is one keyword family only (a floor; the true rate is unknown). Sample sizes are 50 a size
(30 to 37 born under no stress): a share is good to about fifteen points; the gradient by size is far outside that.

ALSO READ, WHOLE: `docs/chair/2026-11-20/content/NAMES-2-PAGE-AFTER.txt` on the line (one town's whole page).
