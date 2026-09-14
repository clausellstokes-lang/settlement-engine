# SKEPTIC — LANE SEAM, lens: THE SCHEMA, THE LEAVES AND THE SHIFT REGISTER (car 4) + car 5b

Seat: Opus 5 — Fable-unvalidated (the verifier). Dock read: `$SC/skepSEAM`, HEAD
`b573bb5f4f748e07600b348b80156a8419aae98b`. Base control: `c45a46a78` (car 3h) via `git show`
inside the dock; never `laneSEAM`, never the main tree.

**PORCELAIN: BEFORE 0 · AFTER 0.** Runner count 0 before every vitest run; `$SC/HOLD-VITEST`
absent throughout. Four focused test files run, one at a time. No write to any dock; every
file I created is under `skeptic-seam/`.

⚠ **THE PINNED DOCK IS SHARED, AND IT WENT NON-PRISTINE MID-SESSION.** At 18:07 the dock read
porcelain 1 with `src/domain/display/stateProse/stressorsStateProse.js` carrying a deleted line
(`- spineKey: key,` in `crisisBannerRung`); it was restored by 18:09. It is a SIBLING SKEPTIC's
mutation plant, taken by the book — `skeptic-seam/stressors.BACKUP.js` and
`composeStateProse.BACKUP.js` sit beside my own files in this same output directory. Nothing was
lost, but it is worth the chair knowing: several lenses run plant-and-restore cycles in ONE
pinned dock, so a lens that reads a whole-tree instrument during a sibling's window gets a
false reading. Mine did: my first `wiring-census --dry` ran inside that window and reported
STALE. Every figure below was re-taken on a tree measured porcelain 0 in the same command, and
the accident turned into evidence (see `--dry`, below).

---

## THE VERDICTS

### (a) The projector's typed lines — §2.5's refusal table
**CONFIRMED.** `scripts/lib/dossier-annex-grammar.mjs` carries one `refuse()` throat and 56
refusal sites. I drove them directly (`skeptic-seam/refusals.mjs`), outside the suite: ROLE
outside the three, MOVE `ABSENCE`, MOVE `HISTORY`, RELATION outside the four, FORM `fragment`
while S2 unsigned, an unknown tag, a face beyond the pin, a face on a `canonical` row, a
fragment face opening on a comma, a vid renumbering, a count above a pin, a backwards
numbering, a duplicate row number, and a missing §7b — every one threw with its own message;
the three clean controls passed. The contract test carries a named PLANT for each row plus a
clean control (`dossierStateProseProjection.contract.test.js:1195-1464`); it ran green,
**67 passed**. One ARCH row is folded rather than separate: "a site on a tab where the fact is
a spine (§4.6)" is refused by the same site that refuses a spine whose branch tests the
modifier's field (`:363`, which cites §4.6). Not a gap; a naming difference.

### (b) `poolMeta` on every pool
**CONFIRMED**, re-derived from the six committed leaves (`skeptic-seam/poolmeta.mjs`):
68 blocks · 708 pools · 2,266 variants; `poolMeta` key union is exactly
`attach,faceCounts,readsCount,role,variantCount,vids`; **0** pools with a wrong role (all
`spine`), **0** with a `faceCounts` entry ≠ 1, **0** with a non-empty `attach`, **0** missing a
`vid`, **0** whose `vids` disagree with the variants' own, **0** non-ascending, **0**
`variantCount` disagreeing with the pool length, **0** `poolMeta` rows without a pool and none
missing. `vid` IS the annex row number: DS-DEF-1 `readiness STRONG` reads `[1,2,3,4]` against
the annex's numbered rows 1–4 at `RECEIPT_POOLS_DOSSIER_STATE.md:2524-2529`, in order and in
text. **701 of 708** pools have vids differing from the 0-based position (the receipt's "700+").
A renumbering that moves a vid is refused — driven live above.

### (c) The three leaves
**CONFIRMED.**
- CONNECTIVES: exactly the four keys; `consequence.clause` **[]**, `tension.sentence` **[]`,
  both printed OWED against a floor of 3 in the leaf header; `contrast.sentence` and
  `addition.sentence` each exactly `[""]`. 1,365 bytes.
- NORMS: **271** rows — exactly the 271 census rows carrying a `rateBp` — of which **72** read
  1. I recomputed the bit independently as `rateBp < 1000` over all 271: **0 mismatches**
  (ten sampled by name and printed). 437 unfired pools carry no row: ABSENT, not zero. The
  census's own `rate.departureReport` reads `{lineBp:1000, uncommon:72, common:199}`, so the
  receipt's correction of the brief's "70 of 267" to **72 of 271** is the true reading.
- RELATIONS: **165** pairs / **165** rows, every `direction` `a→b`, every `relation`
  `consequence`, sources `a`/`b`/`c` only (source (d) empty); `DOSSIER_RELATION_ALIASES` holds
  exactly the three ratified `identifier` rows. **The join is 0**: I resolved every endpoint
  against the census's read roots with the aliases applied — 0 rows resolve both endpoints,
  10 resolve exactly one (the contract test asserts that same 10 as its non-vacuity control),
  and the committed census's own `relations.join` reads `strictBoth 0 · leafBoth 0`.

**UNTESTED — the lazy-chunk claim.** "All three in the lazy chunk by the `/src/data/` rule" is
NOT proved at this tip and the shipped arm says so in its own words: it asserts only the
PRECONDITION (the files live under `src/data/` and `vite.config.js` still carries
`id.includes('/src/data/')`). Membership depends on `isEagerData(id)`, which is DERIVED from
what an eager chunk statically reaches, and can only be measured after a build — which my
fence forbids. Car 2's `VERIFY_DIST` arm owns it.

### (d1) The SHIFT REGISTER, printed and recomputed
**CONFIRMED.** `docs/content/prose-shift-register.json` carries **14 mechanisms**, each with a
non-empty `mechanism`/`shift`/`door`/`idiom` and at least one pin; the contract test prints the
roster and RECOMPUTES every non-`source` pin from the leaves, with the honest guard
`if (now === undefined) drift.push('nothing recomputes it — the pin is a promise')`. Drift `[]`.
`readsCount` is named on `notMechanisms` with its reason and both figures (340 / 368).

⚠ ONE CORRECTION: the receipt's "14 mechanisms, **3** named NOT mechanisms" is car 4's tip. At
the SEAM tip the register prints **4** — car 4d added `seat`. The receipt discloses 4d's row;
the §4.2 table simply predates it.

### (d2) ⛔ A LOOSE PIN — `comparator-and-band-rule` does not pin the band
**REFUTED (partly).** The row is named "comparator-and-band-rule" and its two `source` pins are
`` `${seed}::${blockId}::${spineKey}::salience::${row.key}` `` and
`return a.key < b.key ? -1 : 1;` — the salience DRAW KEY and the comparator's TIE-BREAK. The
BAND itself is `bandOf()` (`composeStateProse.js:454-456`), a sum of three signals
(`departureBit + (relation is tension|contrast) + change`), and **no pin anywhere in the
register contains any part of it**. A car that made `consequence` count toward the band, or
added a fourth signal, would re-order every multi-candidate rung for every existing world with
the register green and the shift undeclared — which is the one thing the register exists to
make impossible.
MITIGATION, measured: every candidate leaf still ships `const fired = [];` (asserted by
`proseWiringCensus.walker.test.js`), so no rung has more than one candidate today and the
comparator orders nothing. The looseness cannot move a reader-facing byte at this tip; it is a
forward hole in the instrument the authoring cars will lean on.

### (e) The acceptance — leaf diff, ratchet, manifest, interlock
**CONFIRMED, re-derived independently** (`skeptic-seam/leafdiff.mjs`, base extracted from
`c45a46a78` by `git show`, i.e. a stronger span than the receipt's: car 3h → the SEAM tip):

```
[leaf-diff] 0 ADDED / 0 REMOVED / 0 CHANGED pools
VARIANT key-set moves: 2080 x angle,slots,text -> angle,slots,text,vid
                        186 x angle,marks,slots,text -> angle,marks,slots,text,vid   (2266)
BLOCK key-set moves:     42 + 25 + 1 = 68, every one adding poolMeta and nothing else
tip variants 2266 · tip pools 708
```

- **The manifest never moved.** `tests/fixtures/dossier-prose-manifest-golden.json` is
  sha256-IDENTICAL at the §915 product tip `3b22b5c56` and at the SEAM tip
  (`4191775aed6e2608a76fa7909da2d689cc1c7054e9358a8ccf8f2cb000f57add`). The drift arm compares
  rows added/removed/moved AND the whole file's sha against a live 73,284-cell run; I ran it:
  **14 passed**, every printed figure byte-equal to the receipt (5966 · 345/36 /0 · 4/0/0 ·
  1087/217).
- **No `src/data/` byte has moved since `802589718`** (car 4c) — so cars 4d, 5 and 5b are the
  zero-corpus cars they claim to be.
- **The sha interlock is real and wired.** `assertCensusCurrent` is called by the projector at
  `generate-dossier-state-prose.mjs:863` over the census's own 7 stamped files; its plant drives
  a fake reader and the arm carries a non-vacuity floor (`stamped.length >= 7`). I re-derived
  every stamp against the COMMITTED bytes: 7/7 files and 6/6 candidate leaves OK.

### (f) The annex gained typed lines only
**CONFIRMED, run.** `git diff --word-diff=porcelain c45a46a78 HEAD -- <annex>` removes
**0** word tokens; `git diff -U0` shows ONE hunk, `@@ -6313,0 +6314,42 @@`, at the end of the
file; the 42 lines are the `## §7b THE STATE CONNECTIVES` section. No prose word moved. (Note
the accurate reading of the car: the annex authors NO per-pool typed line at this tip — the
receipt says so; §7b is the whole of the addition.)

### (g) The byte ratchets' declared rows
**CONFIRMED.** `scripts/.prose-byte-baseline.json` carries **six** `declared` rows, one per state
leaf, each naming SEAM car 4 and its `fromRaw`/`toRaw`; every one of the ten leaves' `raw`
EQUALS its bytes on disk. The six `fromRaw` figures are exactly the base leaves I extracted from
`c45a46a78` (111827 / 90212 / 182518 / 81802 / 59298 / 115753). Sum after = 884,728, delta
+243,318 against a ceiling of 2,800,000; the three new leaves sit under a `ceilingTotalRawNewLeaves`
of 77,000. No ceiling crossed; the causal leaf's `ceilingRaw` equals its raw (210,260) and it
took no `poolMeta` and no `vid`.

### (h) The 68 STATE-KEY transcriptions
**PARTLY.** The measurement reproduces exactly — the arm printed
`68 paragraphs · 46 name a field their own header declares · 110 tokens · 16 AGREE · 23
DARK-BLOCK · 71 READS-OTHER`, and all 94 disagreements are printed by name. The correction:
**nothing is transcribed anywhere.** The 16 "agreeing" tokens agree *because* the census already
carries them, so the transcription is a no-op by construction, and the arm's own comment says
so ("where the two AGREE the transcription is a no-op … AND NOTHING IS WRITTEN"). The receipt is
honest about this; the brief's phrasing ("transcribed into the census's authoring half") is what
does not survive. Second, smaller: the arm's assertions are FLOORS
(`agreeing >= 16`, `total >= 110`) and its last line (`dark + other === total - agreeing`) is
arithmetic that cannot fail, so a future census that resolved the debt would leave the roster
green with nothing printed. Declared in the arm as recorded-not-asserted.

### (i) `poolMeta.readsCount`
**CONFIRMED.** Read, never derived: `generate-dossier-state-prose.mjs:795` emits
`...(row && row.reads.length ? { readsCount: row.reads.length } : {})` from the census row.
I joined the two committed files myself (`skeptic-seam/readscount.mjs`): **340 present, 368
absent, 0 mismatches, 0 present-where-census-is-empty, 0 absent-where-census-reads** — exactly
the census's RESOLVED / WIRING-UNRESOLVED split. Named on the register as a NON-mechanism with
its reason and both integers.

---

## CAR 5b — THE HOLDER CENSUS

### The table and its citations
**CONFIRMED, and stronger than the receipt's sample.** `HOLDER_SOURCES` carries **49** mapping
rows (treasury 4 · market 9 · toll-bar 3 · muster 12 · watch 4 · court 9 · parish 2 · elders 1 ·
road 2 · office 3; `census` and `tradition` map none). I re-derived **all 49** citations against
the live tree: **49 of 49** name a file:line whose text contains the mapped token. `holderTable.js`
measures **410** effective lines and `wiringCensus.js` **751**, both against 800.

### The counts
**CONFIRMED from the committed JSON, recomputed rather than read:** ROWS LICENSED **114** ·
OFFICE **3** · SOURCE-UNRESOLVED **591**, two-source **10**; of the 591, **368** carry no reading
at all and **223** read a field the table does not map. FIELDS LICENSED **191** · OFFICE **5** ·
SOURCE-UNRESOLVED **415** over 611 field entries; by kind muster 61 · market 49 · treasury 22 ·
court 21 · toll-bar 13 · watch 9 · road 7 · elders 5 · parish 4 (+ office 5). The two unresolved
grounds are kept apart (`no-mapping 415`, `no-institution-in-roster 0`) and `tradition` is the one
kind with no institution behind it.

⚠ **BUT THE HEADLINE COUNTS ARE NOT PINNED.** The brief's item 3 asks for "the counts asserted as
integers". No walker arm asserts 114 / 3 / 591 or 191 / 5 / 415 — they are `console.log`'d beside
an assertion on `kindsWithNoInstitution` only. What DOES hold them is the byte interlock (the
committed JSON must equal a fresh serialisation), so they cannot move in a green tree without a
register door; they can move *through* one without any arm naming the move. The DS-DEF-2 figures
(13 / 13 / 66) ARE pinned, so the idiom exists and was simply not applied to the corpus totals.

### DS-DEF-2's 26 sources, and A0b's blindness
**CONFIRMED by name.** 26 rows; 13 LICENSED (7 Beasts rows through `force=muster`, 6 Invasion
rows through `walls/garrison/militia=muster`) and 13 SOURCE-UNRESOLVED (4 Internal Security
`court`/`prison`, 4 Economic Survival `economicScore`, 5 Disasters `granary`/`hospital`/`church`);
**66** sourced field entries, **0** of them containing `(via `. `Invasion & War: walls with
citizen militia` sources `{walls: muster, garrison: muster, militia: muster}` — ARCH §4.4's own
example.

### The three withdrawn rows
**PARTLY.** Run through the car's own live index (`producerCitations()`, 1,154 files):
- `granary` — exactly **2** writers, at exactly `display/demographicReading.js:145` and
  `worldPulse/demographicsObservation.js:106`. The receipt is exact.
- `ledger` — **15** citations across **7** distinct files (treasury, peaceTerms, pantheon,
  institutionStatusLifecycle, magicRegimeLifecycle, dispositionLedger, commercialReasons). The
  receipt's "seven writers across the treasury, the peace terms, the pantheon and three
  lifecycles" is right if a writer is a file.
- `church` — **6** citations across **3** files (`historyEventStrands.js:176`, `pestilence.js`
  ×4, `religionLegitimacy.js:181`). The receipt names **two** ("a `pick()` inside a history
  strand and a classifier regex") and misses `pestilence.js` entirely. The withdrawal stands —
  it stands harder — but the evidence line understates its own instrument.

### The producer-token defect and its cure
**CONFIRMED.** `court`, `elders`, `parish` and `toll-bar` now have **0** producer citations
anywhere in the estate; the 18 tokens `holderTable.js` alone writes are all its own field names
(`rosterBacked`, `dutyNamed`, `LICENSED`, …) and none is a token any pool reads.

### The docblock withdrawal
**CONFIRMED against the parent commit's own assertions.** At `da080313d` the walker asserted
`draft.rows.length 33 · endpointsWithCandidate 14 · noCandidate 75 · WOULD join 4`; at the tip it
asserts `7 · 4 · 85 · docblockReports 28 · WOULD join 0`, with `rows.every(r => r.evidence !==
'docblock')` and a non-vacuity control (rows reached on exactly one endpoint > 0). The walker ran
green, **69 passed**.

### `--dry` writes nothing
**CONFIRMED, and accidentally proved non-vacuous.** On a tree measured porcelain 0 in the same
command: `the committed register is CURRENT · bytes committed 2052050 · fresh 2052050 · delta 0 ·
sections (none) · ROWS 0`, exit 0, porcelain 0 after, census md5 unchanged
(`b43633e640d1848ad98d4582466b9d84` before and after). My earlier reading, taken while the
foreign plant was in the tree, correctly reported STALE and named
`stressorsStateProse.js` as the stamped file that would move — the dry read detects a real
stamped-source mutation and is not a rubber stamp.

### A13's executable verdicts
**CONFIRMED.** `proseComposed.walker.test.js` (66 passed) prints
`variants naming a record holder: 18 of 2266 · LICENSED 6 · WITHHELD 12 ·
WITHHELD <- SOURCE-UNRESOLVED 12`, with the by-block roster matching the receipt row for row.

### ⛔⛔ THE INTERESTED-FACT ZERO — the figure holds, ONE OF ITS THREE GROUNDS DOES NOT
I re-ran the RATE corpus myself (768 towns, 0 generation throws, 12 s,
`skeptic-seam/probe-grounds.mjs`, imports re-pointed at `skepSEAM` — I never entered `laneSEAM`).

**The figure reproduces exactly.** INTERESTED = **0** at every tier; the per-tier "holder named"
column reads 78 / 5 / 640 / 6497 / 2741 / 3284 — byte-identical to the receipt — over 87,552
(row, town) pairs; the per-kind line reproduces character for character:
`treasury 151/0 · muster 0/0 · census 0/0 · parish 166/0 · toll-bar 81/0 · market 140/0 ·
watch 173/0 · court 339/0 · elders 13/0 · tradition 0/0 · road 53/0 · office 2/0`.

Ground by ground, as the lens asks:

| ground | verdict | what the execution says |
|---|---|---|
| 2 · no generated town carries an institution impairment | **A FACT OF THE ENGINE** | towns with ANY impairment **0**, corruption-typed **0**, of 768 |
| 3 · the covert channel cannot reach a security institution | **A FACT OF THE ENGINE'S WIRING** (and the car says so) | **178** corrupt un-ousted NPCs, **178** homed, **0** homed to a security institution; every home is a faction name (Military/Guard 25 · Religious Authorities 24 · Merchant Guilds 23 · …) |
| 1 · capture and patron control are "structurally absent at birth" | **REFUTED AS STATED — A BLIND SPOT OF THE READER THE CAR WROTE** | see below |

**Ground 1, measured.** It is true that `settlementCaptureState` takes `factionStates` and
`capturedPatronOf` takes a `worldState`, and that a headless town has neither. It is NOT true
that the engine holds no capture fact at birth. Every generated town carries
`powerStructure.criminalCaptureState`, written at `power/rulingStructure.js:797` — **the very
line the holder table cites as a `watch` field** — and it moves on the SAME five-rung ladder
`standingOf` consumes (`none · adversarial · equilibrium · corrupted · capture`;
`factionCapture.js:137`). Over the RATE corpus it reads **none 495 · adversarial 194 ·
equilibrium 64 · corrupted 15**, and **79** towns additionally carry a non-`none` `captureState`
on a faction entry of `powerStructure.factions` (`rulingStructure.js:766`). `standingOf` scores
`captured = (captureState === 'corrupted' || === 'capture')`, so the fact is already in the
reader's own vocabulary — the probe simply never hands it over. Feeding the town's own
`criminalCaptureState` into the same reader, changing nothing else:

```
CAR's reading                       INTERESTED pairs      0 · towns with any  0
COUNTERFACTUAL (captureState = the town's own criminalCaptureState)
                                    INTERESTED pairs    532 · towns with any 14
                                    town 346 · city 55 · metropolis 131
```

I am not saying the car should have used it: `criminalCaptureState` is SETTLEMENT-wide and
`standingOf` asks about ONE institution, so feeding it marks every holder in a corrupted town
interested, which is its own error. The refutation is narrower and it matters: **"the engine
holds no captured institution at birth" is false — it holds a typed capture fact at birth, on
the reader's own ladder, on the field the holder table itself maps to the watch — and the car
reported that fact ABSENT rather than asking whether it licenses a per-institution standing.**
The chair's ruling (2) on car 5b (the DM face of an interested fact is a WORLD-RUN feature and
not a birth feature; car 6 composes its interested fact on a world-run fixture) rests on this
ground, so the correction is the chair's to take before car 6 is briefed.

---

## WHAT I COULD NOT TEST
- **`tests/lint` whole (149 files / 2,479 tests).** My fence permits one focused file at a time.
  Three ran green (projection contract 67, manifest 14, census walker 69, composed walker 66 —
  four files, one at a time). Beside them, at porcelain 0 and by execution:
  `check-observed-shape-readers.mjs` → `1972 finding(s), exactly matching the frozen inventory`,
  exit 0; `check-domain-strict.mjs` → `1120 errors, ceiling 1120`, exit 0.
- **Chunk membership of the three new leaves** (needs a build).
- **The classifier's 73,284-cell base/tip table** (needs a second dock and two 10 s runs; the
  golden manifest's sha identity across `3b22b5c56` → tip is the stronger control and it holds).
