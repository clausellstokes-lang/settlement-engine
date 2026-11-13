# veil-probe-8 — the lane's planted-marker run and guard with a WIDER EYE (COHERENCE-VEIL-8)

Scratch tools and their outputs, not pins. Every database was a local scratch PostgreSQL 16.15 cluster on a unix
socket in this container (`/var/tmp/cv8sock`, trust auth, no TCP). Nothing here touches a hosted database.

## The instrument (`planted8.probe.jsx`, `planted8-summary.mjs`, `run8.sh`)

The review's `planted.probe.jsx` (REVIEW-VEIL-5, `lane/review-veil-3-2026-11-12` at 4700d33eb; the lane's run of it is
`veil-probe-7/native/planted-run.sh`) with the same towns (two seeds × six sizes × calm and infiltrated), the same
planting through the generator's own `onStep` hook, the same shares (every eye shut by hand, the DM reveal off and on,
live and frozen), and a wider eye (the file's header has the detail):

1. the marker is ` Vh8K<n>Q`, letters and digits only; every string AND every key of every response is searched in its
   FOLDED form (lower case, every run of other characters one `_`); a hit is `exact` (the marker in its own spelling:
   what the review's eye saw) or `folded`;
2. the name of every house hidden whole, and every name a chain gives it by the engine's own processor match, is searched
   `exact`, `folded` on `_` boundaries (a case fold, a slug, a snake or kebab key, an id such as `institution.<snake>`)
   and `joined` (every separator removed; ten characters or more); an open house whose folded name holds the hidden one
   is blanked first;
3. the TEXT hidden by hand (each planted string at the end of the birth and each sentence of it, twelve characters and
   three words or more) is searched folded, and listed only where the string does not hold it in its own spelling;
4. six reads: the gallery read, the party link, the map page, the map's party link (`get_unlisted_map`, which carries no
   member town at all), the town's import and the map's import.

**The exact half reproduces the review.** On the frozen 211 alone (`203 + 211`, `001..211`), master's shape: the same
4,447 markers, and the set of `exact` rows is the review's own seventeen rows a chain, row for row
(`veil-probe-7/out/planted/A-master-frozen211.txt`: 62 row keys, `diff` empty).

## Step 1: what the wider eye finds on the frozen 211 with the present 212 (45317ee3f)

`out/step1/master-shape-4chains.txt` (master's generator and writer, db832c892; chains `203+211`, `001..211`,
`203+211+212`, `001..212`) and `out/step1/new-shape-2chains.txt` (the lane's generator at 45317ee3f; `001..211`,
`001..212`). 24 towns a shape, 96 shares, 2,304 / 1,152 reads, 0 births threw, 0 reads raised. With 212, 40 rows
(master's shape, identical on `203+211+212` and `001..212`) and 42 (the new shape). Every row is one of these:

| # | What is sent | Where | Towns of 24 | Reads | Class |
|---|---|---|---|---|---|
| **N1** | **THE TWELFTH**: the name of a house hidden whole, LOWER-CASED (`"smuggling network"`, `"black market bazaar"`) | `economicState.compound.inst.names[]`, `economicState.safetyProfile.compound.inst.names[]` | 11 by the house's own name, 2 by a chain's name for it; both shapes | gallery, link, map, both imports; reveal off and on; live and frozen | **A NAME of a hidden thing: cure** |
| **N2** | **THE TWELFTH, the trace**: `institution.<snake>` of a house hidden whole; the house's name lower-cased in a cause (`"Contract killer" was absorbed into "assassins' guild"`) | `simulationTrace[].targetId`, `.causes[].source`, `.causes[].reason` | 11 (+2 by a chain's name); 3 for the causes; both shapes | gallery, import; Reveal DM only | **A NAME: cure** |
| **N3** | a person's ROLE that the person's own public card withholds (the person switched off by hand; a veiled member's role is not on the public card, 206), still in a TIE's copy of the end: `"the rookery boss"` (house "Rookery" hidden whole), `"the black marketeer"`, `"the front man"`, `"the network's head"`, `"the bloc's speaker"`... | `relationships[].npc1Role`, `.npc2Role` | 13 (new shape only; 226 tie ends); master's shape 0 | gallery, import; Reveal DM only | **A TEXT hidden by hand, in a second home (V5-4's class, for ties): cure.** The eye saw it by the name "rookery"; the class was then measured by SQL over the stored responses (a tie end whose person in `npcs[]` of the same response has no `role`) |
| **T1** | **A THIRTEENTH HOME**: a hidden event's first lasting effect, its first letter LOWER-CASED, inside the legacy annotation (`legacyGenerator.js :: annotationBody`: `What it left behind (price ceilings on the affected goods...)` ; master: `The lasting consequence (...)`) | `history.legacyAnnotations[].annotation` | 21, both shapes | gallery, link, map, both imports; reveal off and on | **A TEXT hidden by hand: cure.** The marker rides the effects list as its own entry, so no marker reached the annotation, and the case fold hid it from the review's sentence search |
| C1 | the flags' own KEYS (`hasBlackMarket`, `hasThievesGuild`...) | `economicState.compound.inst.<key>`, `.safetyProfile.compound.inst.<key>`, `.safetyProfile.flags.<key>` | 2 (joined only) | all | vocabulary present in every town whatever it holds; the VALUES are step 3's class |
| **N4** | the name of a house hidden whole inside fixed prose: `"Smuggling Network Revenue"` (house "Smuggling network"); `"...guild-organised fencing, extortion, and black market trade"` and a siege `safetyDesc` naming the black market (house "Black market", or "Black market bazaar" by its chain name) | `economicState.incomeSources[].source`, `.desc`; `economicState.safetyProfile.safetyDesc` | 1 each, both shapes | all | The words are the generator's fixed vocabulary, chosen by the KIND of criminal house present (`economicState.js`, the label ladder), so a renamed house gives the same words; but they ARE the hidden house's name, folded, and the lane's ruling (COHERENCE-VEIL-6 §1.6, "where the hidden name and an open chain's own label are the same words, the hidden name wins") decides it: **a NAME: cure** (the entry, or the sentence, withheld whole). It is also step 3's class (a value that exists because a hidden house exists) |
| C3 | `"blackMarket"`, `"arcaneBlackMarket"` | `simulationTrace[].downstreamEffects[].target` | 2 (joined only) | gallery, import; Reveal DM | the model's own field tokens, not a name |
| C4 | a coherence note's sentence (`Settlement is under active siege...`) beside `powerStructure.recentConflict`'s own pool line | `powerStructure.recentConflict` | 2 (master's shape) | all | two pools sharing a phrase; open at its own source |
| C5 | `"permanent teleportation circle"` (a house's description) beside the catalog's dependency detail | `economicState.tradeDependencies[].detail` | 1 | all | the catalog's own detail (`economicData.js`), open at its source |

On the frozen 211 alone the same towns also carry every row of the review (the `exact` rows above); 212 removes those
and nothing of N1 to T1.

**The guard, widened the same way** (`tests/security/gallerySecondHomes.pglite.test.js`: the marker letters and digits,
every string and key folded, the names in three forms, six reads): at 45317ee3f **RED, 3 of 3**
(`out/step1/guard-red-at-45317ee3f.txt`, the guard as committed): arm 1, 1,928 sends (N1 both lists, N2 targetId and causes, N4 the income desc); arm 3, 568 (the same classes); arm 2 green. The
guard does not search the JOINED form: it meets the model's own camel-case vocabulary (C1, C3) in every town, so the
probe lists it and classes it row by row. Arm 2 asks for five reads of six (the map's party link carries no town).

**The count for the chair:** with 212, FIVE classes of a hidden name or text still sent (N1, N2: the twelfth;
N3, N4, T1: found by the wider eye), and five classed as not a hidden name or text (C1, C3, C4, C5, and the joined
`"the black marketeer"`, which N3's cure covers).
