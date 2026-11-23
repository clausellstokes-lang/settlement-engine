# CLOSE-4 — HAND-BACK (kept current at every push; for a reader who has never seen this session)

The close's seat for its two word cures, seated by THE NINTH CHAIR (session_01FbPLbdpQrxXktCeSf32d4j) on 2026-11-23; the successor
of CLOSE-3 (unit "VACANT") and of CLOSE-2 (unit "PRONOUN") for these two units only. Prompt: the ninth chair's seating message
(CLOSE-4, the middle tier at high effort). THE FLIP IS NOT THIS SEAT'S: it touches nothing of it.

## 0. WHERE THE SEAT STANDS (written 2026-11-23 01:3x UTC)

| ref | tip | state |
|---|---|---|
| `lane/close-4-2026-11-23` (this lane) | this push | docs only: this hand-back; `briefs/VACANT-15.md` (the builder's brief for arm (15)) |
| `lane/close-4-2026-11-23-vacant-wip` | 4ef6d6c32 | VACANT's code, cut AT CLOSE-3's 2b8cc2946 (on the line's tip 244fa84ef): fc0ec46a0 the cure; 003a1723b census; 2b8cc2946 cure one; d4ea9a9f2 arm (15); ac8121863 census; 4ef6d6c32 the voice cure |
| `lane/close-4-2026-11-23-lit-scratch` | 1a2ee47e3 | the -wip + the flip's three dials and the `powersList` row (`close-2/census/light.sh`, 296668dea), the -wip merged in at 4ef6d6c32: a SCRATCH ref, never merged by anyone |
| `lane/close-4-2026-11-23-pronoun-wip` | f5fa6316a | PRONOUN's code AT CLOSE-2's -wip (cut from the line at point 102, c1144ba18): NOT YET READ-RUN by this seat beyond its diff |

### (1) VACANT
- CURE ONE READ WHOLE (003a1723b..2b8cc2946, 3 files): the findings judge imports nothing from `src/generators/`; it reads
  `SEAT_HOLDER_PATTERNS` derived from the table. THE NINTH CHAIR'S RULING: the `{holder}` slot `(?!They )[^.]+?` ACCEPTED, on
  ONE NEW ARM (15), red first (the chair confirmed this seat's reading: own pool's patterns over the carrying text, other pools'
  patterns on the line alone).
- ARM (15), BUILT (builder, brief `briefs/VACANT-15.md`), d4ea9a9f2: over arm (11)'s 135 lit births (born once, `censusBirthOf`,
  shared with (11)): (i) every written W3/W1/W3v/W1v line found by its own pool, by no other; (ii) no name begins "They " or
  carries a full stop. Liveness W3 57, W1 46, W3v 10 (its floor), W1v 6. RED BY PLANTS (never committed): the holder renamed
  "They Who Watch" reds (ii) only (10 lines): the fill writes "The They Who Watch sat in ...", so (i) does not miss; a form named
  "St. Brigid's Council" reds (i) (16 lines missed: 10 W3v, 6 W1v) and (ii). The data file's header carries the full-stop premise.
- A RED FOUND BY THIS SEAT'S GATE, CURED: `tests/copy/voiceMechanics.test.js` E2 (src/data string literals): cure one's two "!" in
  string literals of `seatHolderLines.js` (bang 0 -> 2). Cured at 4ef6d6c32 by regex literals' `.source` (the
  `personMention.js :: NOT_AFTER_LETTER` idiom); the 18 pattern sources byte-identical before and after; no baseline re-taken.
- RUN AT ac8121863 (this seat): seat file 19/19; `domainGeneratorsBoundary` + `tests/architecture` 351/351; the 8 files naming a
  changed symbol 105/105; `tests/lint` whole 3 red of 3,364 = the line's three (`ledgerCitationIntegrity` GREEN: the ledger ref
  235efce1a is local on this box); eslint 0; `typecheck:ratchet` 167/167; strict 1113/1113; THE DARK PROOF EQUAL 242edc8e… (900).
  LIT BASE re-made: c1128c8f6 fb3f0172… (900 lit births, equal to CLOSE-3's figure).
- THE FINAL WINDOW AT 4ef6d6c32: IN FLIGHT (see (3)).

### (2) PRONOUN: not started beyond reading. Its diff 2904f0475..f5fa6316a READ WHOLE (the leaf `personMention.js` and the walker
whole; the leaf test, the census and manifest rows). NOTE for the chair: the follower cure turns "an introduction him would rather
keep to themselves" into "...he would rather keep to themselves": the template's "themselves" is the template's, not the cure's.

### (3) NEXT, IN ORDER
1. VACANT's final window (`scratchpad/vf/gate.sh`): the ratchet dirs + architecture + named files; both typechecks; the dark
   proof; the lit twin's 900 against fb3f0172…'s per-birth file; ONE build, `VERIFY_DIST=1 tests/build`, `bootSmoke` alone.
2. "VACANT <commit>" to the chair. 3. PRONOUN by the prompt's unit (2). 4. This hand-back final.

## 1. WORKTREES ON THIS BOX (scratch; lost with the container)
`/home/user/wt/vacant` (the -wip), `/home/user/wt/vlit` (its lit twin), `/home/user/wt/lit` (c1128c8f6, detached),
`/home/user/wt/pronoun` (the pronoun -wip). Each has a `node_modules` symlink to the main checkout's; `.git/info/exclude`
carries `/node_modules`.
