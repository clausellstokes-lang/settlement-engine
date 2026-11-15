# TAIL-CLOSE-SWEEP-B — hand-back (kept current in every push)

Branch `lane/tail-close-sweep-b-2026-11-15`, cut from the joined line `lane/join-2026-11-14` at dc4bae117.
Every run below went to a file in the seat's scratch tree; every figure is a measured count, not an estimate.
The 720 births: the page census's banked plan (`censusPlan('r2')`), each birth's JSON hashed before and after.

## The files

| # | File | At dc4bae117 alone | Turning commit | Verdict |
|---|------|--------------------|----------------|---------|
| 1a | `tests/generators/captureBirthScale.test.js` | red (326 < 372) | 33b12cbef (JOIN-1 · 9, the upkeep lane), inside it 82c639b44 | (ii) re-derived through the manifest: base 0.965 -> 0.815, floor 372 -> 300 (3.348 sigma) |
| 1b | `tests/simulation/tierInertiaEnvelope.test.js` | red (45 > 43) | two steps: 33b12cbef (inside it c448bb3a0, the capacity branch's merge) and 65dc92af9 (JOIN-4 · 2, upkeep-monotone) | (ii) re-derived through the manifest: base 0.225 -> 0.3475, ceiling 43 -> 59 (3.317 sigma) |
| 2 | `tests/domain/worldFactRederive.test.js` | red (7 of 7 stride rows miss) | the golden master not re-taken since point 47 (fce41f2b7) | (iii) named: the owner's golden door |
| 3 | `tests/generators/coherenceAgreeCures.test.js` | green | — | green already |
| 4 | `tests/generators/urbanBandInstitutions.test.js` | red (village-3) | 343c26791 (W2-FIX-DATA-8 row 4) | (i) cured |
| 5 | `tests/generators/servicesStructure.test.js` | green | — | green already |
| 6 | `tests/domain/npc/paradigmAxisCatalog.test.js` | green | — | green already |

### 4. urbanBandInstitutions — (i) CURED
The magic-free village `urban-band-nomagic-village-3` failed its own `world_law_magic` check on its Apothecary:
"Sells poultices, common cures, and medicines drawn from herbs. Magical compounds and acid are no part of this
trade. ...". 343c26791 reworded the old denial ("Where the alchemist deals in magical compounds and acid, this
trade does not.") and said the world law's reading of a denial was unchanged; but the world law's denial list
(`src/domain/magicAssertionText.js` :: `NEGATED_MAGIC_PATTERNS`) held only the old sentence, so the new one read
as a claim that magic works. The cure adds the new sentence's denial beside the old one (the old one stays: the
module's own rule keeps a pattern whose corpus receipt a content wave spends). The wording the owner may veto is
untouched. The 720 births: byte-identical (0 of 720 moved). Proof: the red alone green; the nine test files that
name the module green; eslint and the full type check green.

### 2. worldFactRederive — (iii) NAMED
A7's stride re-derives seven golden rows with no layer and compares each to the committed golden master
(`tests/fixtures/generator-golden-master.json`, last re-taken at point 47, fce41f2b7). All seven miss: the births
have moved since that re-take, so the golden is stale. The message ("the stride is non-empty, or the absence above
is vacuous") is the arm's own label for `misses.length === 0`; the stride is not empty (7 rows). It turns green
when the golden is re-taken through its door, which is the owner's (another seat's), not this seat's.

### 1a. captureBirthScale — the measurement
The criminal-city sweep (`cap-crim-city-0..399`) at equilibrium or worse: 392 at 33b12cbef^1, 325 at 33b12cbef,
326 at dc4bae117. Inside the upkeep lane (bisected over its first parents from 976db5b19): 368 at e90c4f97d,
338 at 82c639b44 (COHERENCE-UPKEEP-5 V3 + R13 + R14, "defence is the sum of its parts"). WHY: of the 30 cities
that 82c639b44 drops below equilibrium, all 30 had their defence band raised (Defensible -> Well-Defended, the
readiness score up about five points), their public legitimacy rose (58 -> 65; `computePublicLegitimacy` reads
the defence label), and the governing faction outweighed the underworld (the capture state fell to adversarial).
The lane declared the defence rating's rewrite (its readiness, its parts) but not this consequence for capture.
RE-DERIVED by the test's own door (the manifest entry `capture.criminalCity.equilibrium`, re-checked by
`tests/lint/distributionEnvelopePower.test.js`): base 0.965 (386/400) -> 0.815 (326/400), alpha 1e-3 (74
non-events), floor 372 -> 300, margin 3.348 sigma. Proof: the red alone green; the power lint and
`tests/joins/ordering.test.js` green; eslint green. No `src/` line moved.

### 1b. tierInertiaEnvelope — the measurement so far
The town arm under matched stressors, with the test's own trial code, the test's first 120 seeds and the
400-seed family: 32/120, 90/400 at the merge base db832c892; 38/120, 121/400 at 33b12cbef; 45/120, 139/400 at
65dc92af9 and at dc4bae117. The family moved with the corpus, so this is the rate moving, not the corpus's noise.
Inside the upkeep lane: 90 at 976db5b19, 96 at 6b5a1c5a9, 121 at c448bb3a0 (the merge of
lane/upkeep-capacity-2026-11-13 at 9354d792a into the defence lane). 82c639b44 itself moves it not at all (99 -> 97).
Inside the capacity branch: 96 at 6e61d042a, 112 at 94c5d408f (UPKEEP-CAPACITY C1, "a house counts by its rung on its
own ladder", a DECLARED move of the defence scores), 121 at its tip 9354d792a (a later capacity commit, not isolated).
Inside upkeep-monotone (65dc92af9's lane): 121 at 9d48785a1, 138 at b49b871fd (UPKEEP-13 X1, the will's hold taken
score by score, the chair's ruling (4)), 127-139 over the commits after it, 139 at its tip 0ca0bbe94.
WHY: the drift's support vector is trade, defence and legitimacy (tierResourceDynamics.js), and every step is the
defence rating's declared rebuild; the structural-failure branch (support <= 0.25) fires more often under the same
held load. RE-DERIVED by the header's own rule (re-measure the 400-seed family with the instrument's trial code;
check the test's corpus against it): base 0.225 -> 0.3475, ceiling 43 -> 59, margin 3.317 sigma; the corpus 45/120
sits z +0.63 against the family, so the red was not the corpus's noise. The ordering still holds structurally:
village floor 93 > town ceiling 59 > city ceiling 8. Only this arm was re-measured (the other eight hold at the tip).
Proof: the red alone green; distributionEnvelopePower, joins/ordering, captureBirthScale green; eslint green.

## THE OWNER'S PART (plain words)
- **Criminal cities at birth.** Since the defence rating was rebuilt (the upkeep lane, commit 82c639b44, joined
  at 33b12cbef), more criminal-heavy cities are born well defended, so their people trust the government more
  and fewer of them are born with the underworld holding even: 392 of 400 -> 326 of 400. The test's floor was
  set from the old rate; it is re-derived from the new one (372 -> 300). **Yours to veto**: if fewer criminal
  cities born holding even is not what you wanted from the defence rebuild, the cure is in the defence rating, not here.
- **Towns losing their tier under the same pressure.** The defence rebuild (two merges of the upkeep lanes) raised
  how often a town drops a tier under the test's fixed load of five crises: 90 of 400 -> 121 -> 139 of 400 (22% -> 35%).
  A town's staying power reads its defence, and the rebuilt rating scores many towns lower. Villages still fall far
  more often (floor 93 of 120) and cities far less (ceiling 8 of 120), so your rule "bigger places are harder to
  topple" still holds; but the middle rung is now nearer the villages. The ceiling is re-derived 43 -> 59 (a
  loosening, said, not silent). **Yours to veto**: if towns should hold as before, the cure is in the defence rating.
- **The golden master** is stale against today's births (worldFactRederive's seven rows); a re-take is yours.

## Left for the chair
- The two envelopes are re-derived against the defence scores as they stand at dc4bae117; lane/tail-record-2026-11-15
  is changing the defence scores now, so both may move again when it lands (re-measure with the same probes:
  the cap-crim-city sweep; the tier-inertia family at CORPUS_N 400).
- The full run of tests/generators, tests/simulation and tests/domain at dc4bae117: 24 red files; beyond this list, every
  one is on the owner's list or another seat's (corpusEcoTailGuards: the corpus guards; defenseInvasionWithinACriticalBand:
  the defence scores). hookTruthAtBirth and generationCertificationCorpus: green.
