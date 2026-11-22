# TRAD-2 · UNIT 1c — A PLURAL POWER TAKES A PLURAL VERB (THE LINE'S ONE READER OF A POWER'S NUMBER)

Read `TRAD-2-COMMON.md` first; it binds you. Base: `lane/trad-2-2026-11-20` at `797e759c3` (unit 1 picked as
`77ebf8d34`; the line merged at `0c9069489`).

## Files you may change
`src/data/traditionDescriptionTable.js`, `src/domain/traditions/traditionDescription.js`,
`tests/domain/traditionDescription.test.js`, `tests/lint/traditionDescriptionFrames.walker.test.js`. Anything else: STOP.

## The chair's ruling (2026-11-20, the line at 0c9069489)
A keeping power with a plural name takes a plural verb ("the Merchant Guilds keep it", never "keeps"; unit 1 saw "The
Merchant Guilds meets its cost"). The line's `src/data/people/powerSentenceName.js :: powerVerb(name, one, many)` (and
`withPowerVerb`, read whole) is THE ONE READER OF A POWER'S NUMBER: every verb the leaf puts after a power (the
POWER_FRAMES whose subject is `{Power}`, and any other frame where a power is a verb's subject) goes through it. No
private plural rule, no rewording to dodge the verb unless the pool's floor (three a kind) still holds with real
variety. The house frames stay as unit 1 left them (no house is a verb's subject).

RED FIRST: an arm with a plural power ("Merchant Guilds", category economy) for every POWER_FRAMES kind and twelve
seeds: no "{plural power} meets|oversees|keeps|has|pays" (singular) stands; and a singular power ("the Elder Council")
keeps its singular verb. Run it red at the base, quote the failing text. Also run `tests/lint/namesInSentences.walker.test.js`
(the line's names walker) and say what it reads of this leaf, if anything.
