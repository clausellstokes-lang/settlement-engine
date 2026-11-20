# R4-CURE HAND-BACK (VEIL-22's builder, branch `v22-r4`, on R4's dfa031f3e)

Brief: `briefs/R4-CURE-BRIEF.md`, with the chair's additions relayed by the seat (the salt's red over eight executions
and a forced generic plan; VOLATILE on every function that draws, carries or reaches the salt; the catalogue; the cost
before and after; the twin's test) and the seat's three later cures (tooth (ii) sharpened; numeric ids; the holders'
names). VR46 governs the guards (two more teeth: (iv) bijection within a read, (v) two reads differ). Receipts here.

## 0. The bytes
211 BYTE-FROZEN before and after: `eface6d0…be0b01`, rollback `ce8474ff…49712f` (`sha256-before.txt`, `sha256-after.txt`).
212 before `ba7d8631…3a51c9` (dfa031f3e), AFTER `e5b31073567827cbd42dcdcd09aeb5466f093e27f2916a8d9d78dc9ae56a11a0`;
212's rollback unchanged `786c8bd8…31b2` (it restates 211's statements, so 211's volatility comes back; it already drops
R4's seven helpers; this cure adds no function).

## 1. CURE 1, THE SALT'S VOLATILITY (CONFIRMED)
RED at dfa031f3e: `_gallery_veil` IMMUTABLE; a prepared statement of it with constant arguments is folded at planning
(`Output: 'npc_fa81…'::text`): 8 executions + 1 under `force_generic_plan` serve ONE key (9 keys, 1 distinct), marked and
unmarked; one constant call over two rows of one statement serves one key (`salt-red-pg16.txt`; pglite: `red-cures12.txt`,
run in an export of dfa031f3e with this commit's test). The read functions, called on a row's columns, already drew a new
salt each execution (45 keys, 45 distinct) — but they REACH the salt, so by the chair's word they change too.
CURE (212): VOLATILE on `_gallery_veil` (draws), the six `_gallery_veil_rekey*` helpers (carry `salt`), and the three
restated reads `get_gallery_dossier`, `get_unlisted_dossier`, `import_gallery_dossier` (reach it; were STABLE).
211's `get_gallery_map` and `import_gallery_map` were VOLATILE already. `_gallery_veil_holders` carries no salt: IMMUTABLE.
GREEN: every execution a different key (9/9 both; two rows 2/2; reads 45/45) (`salt-green-pg16.txt`, pglite
`green-cures12.txt`). THE CATALOGUE (`volatility-catalogue.txt`, one statement, chain r4ctip at this tip): every
function 211 and 212 create or restate, its volatility and why; THE PROOF over every public function: 12 draw, carry or
reach the salt, 0 of them IMMUTABLE or STABLE.

## 2. CURE 2, THE TWIN'S SALT (CONFIRMED)
RED at dfa031f3e: two projections of one town in one module load serve the same keys (projectShareVeil marked and
unmarked, applyVeil, projectServedVeil). CURE: `galleryVeilPeople.js` draws `readSalt()` per `rekeyPeople` call (one a
projection call; consistent within the payload). GREEN (`green-cures12.txt`).
A CONSEQUENCE, MEASURED, NOT MINE TO CURE (the switch's file is VEIL-V102's): `criminalVeilSwitch.js ::
presentCriminalGroupings` compares two `applyVeil` outputs byte-for-byte, so every family grouping now counts as present
wherever the town has a person: on 16 of 24 copies `block:power.criminalUnderside` joins (parts +1), and a town with a
person and no criminal content reads 'hidden', not 'none' (probe: base d136940c3 against this tree). Falls toward hiding;
the switch's own compare needs VR46's bijection (or a salt argument).

## 3. NUMERIC IDS (the seat's cure; CONFIRMED)
RED at dfa031f3e (`red-numeric.txt`): a card with id `7` served as `7` by the server and the twin. CURE: 212
`_gallery_veil_rekey_ref` / `_rekey_at` / `_gallery_veil_rekey` (ids, tie ids) and the twin re-key a NUMBER id by its
String() (`_gallery_veil_jsstr`); the served marker's key follows (its re-key is the same string's). GREEN
(`green-cures12.txt`). PLAUSIBLE, not built: `_gallery_veil_holders`/`withholdHolders` match a holder's ties by string id
(a numeric-id holder's tie is caught only by its end's name).

## 4. THE GUARDS (VR46)
Instrument `tests/security/personIdBijection.shared.mjs` (canonical names by first appearance in the re-key's fixed walk;
`unkeyPeople` throws on a stored id served or two cards under one id; `bijectionTeeth` executes (i)-(v)).
- `criminalVeilSwitch.test.js` (b) `person N allegiance` (the handler id re-keyed) and (c) (served copies compared
  byte-for-byte, a salt a projection): RE-STATED; teeth (i)-(v) executed on a DM copy, all bite (`switch-after.tail`).
  LEFT RED, NOT MINE: 24 × `(b): safety blackMarketCapture`, IDENTICAL at the base d136940c3 (run in an export of it).
- `publicSafe.test.js` 7 reds: 6 RE-STATED green (lookups by stored id through `unkeyPeople`); teeth (i)-(v) executed
  (a new arm, all bite). STOP, REPORTED: PROPERTY reds by TOOTH (ii): a Reveal-DM projection keeps a person card's own
  `relationships[].to` as the STORED id (`n2`): the re-key does not follow that path; confirmed through the server
  (`card-relationships-probe.txt`: marked and unmarked Reveal-DM gallery reads serve `"to": "n2"`). Not in R4's census
  (born towns carry no per-card ties); a cure is a new re-key path in both engines: the seat's call.
- `galleryServerVeil` 10 of 17, `galleryVeilSignalCopies` 4 of 5: see section 6.
- `galleryVeilPeople.pglite.test.js`: tooth (ii) SHARPENED (every served string AND key, the served marker included, by
  substring; plants in a sentence, as a key, as a marker key: each caught); the holders' names arm (section 6).

## 5. HARNESSES, ACCEPTANCE, COST
- Inversion 4 of 4 green (`harnesses.txt`).
- RENDER-TWICE: STOP, REPORTED: CONTROL and MAIN red (`harnesses.txt`): two renders of ONE document differ (a) in DOM ids
  `dossier-npc-npc-<key>` (re-stateable) and (b) in a NON-ID BYTE: the honorific ("Master Apothecary Mongke Urgench" |
  "Apothecary Mongke Urgench"), which `faceHonorifics.js :: honorificOfTitle` picks by a seed of the CARD'S ID
  (cardDoor.js, seatKeeper.js). VR10 makes the drawn title vary per read (and, with cure 2, per render). Not a bijection
  matter: the seat's call (seed the honorific by what does not re-key, or serve it).
- Acceptance: see section 6. Typechecks strict and ratchet exit 0; eslint on touched files exit 0; registry `--check`
  exit 0; the registry walker, veilCopySites, mutation manifest, size baseline, publicSafeVeil, publicProseVeil*,
  gallery, galleryImportRederive green (`guards-nonpglite.txt`).
- COST (VR36), x211 | BEFORE (dfa031f3e) | AFTER, medians (`cost-v8245.txt`, `cost-big-town.txt`, under load):
  V8-3 row 5085 | 6171 | 5682 ms (1.12x); 50/500/500 93 | 203 | 191 (2.05x; not a law row); the 300 KB rows 308 | 340 |
  344 and 1086 | 1139 | 1149. Largest born town (Maghwick, 520,504 B): gallery off 250.5 | 451.4 | 464.8; gallery DM
  169.5 | 473.3 | 468.1 — BOUND MET (468.1 <= 2 × 250.5 = 501.0); link 189.4 | 414.9 | 407.3 (2.15x its own 211 read,
  2.19x before: R4's, not changed by this cure). Every read served.

## 6. RUNS FINISHING AT THE COMMIT
(filled below)
- ACCEPTANCE (REVIEW-VEIL-7 at this tip, `acceptance.txt`): EXIT 0, checks 37 | PASS 37 | FAIL 0. Its server-against-twin
  table is byte-exact and so differs on every row (1 to 5 paths); the one row read (rv7a-veil) differs ONLY at
  `npcs[].id` (each engine its own salt: VR46); the other 14 PLAUSIBLY the same (not read).
- THE BORN TEST, whole (`born-test.txt`): 13 of 13 green: VR9, VR10 with tooth (ii) sharpened, its plants (a sentence, a
  key, a marker key: each caught), the HOLDERS' NAMES arm (every string of the whole gallery row, every column, and the
  served markers, marked reads: `holder-names.json`: 0 hits anywhere, so 0 outside R5's and the doors' rows), one salt a
  read, the twin, the owner, and the five cure arms.
- `galleryVeilSignalCopies` 4 of 5 (`guards-A-cured.txt`, run after cure 1's first step and cure 2): STOP, REPORTED: its
  faults are drawn LINES, not ids: "Connection: Master Cooper Iztli Nah" on a shut page vs "Cooper …" on the open one —
  the id-seeded honorific of section 5 (each fetch is a read, a new salt, a new title). Not re-stateable under VR46.
- `galleryServerVeil` 10 of 17 (same run): NOT RE-STATED (budget). Its faults (792 of each kind: gallery/link page
  changed, data carried, data readable) are keyed by `npcs[id=…]`: the client RE-KEYS the served page again
  (projectServedVeil -> applyVeil -> rekeyPeople), so the server's data and the page never share an id, and the 210
  reference keeps stored ids; LAW (4) looks ties up by stored id (`t0`); the clamp arm compares paths keyed by id.
  PLAUSIBLE: beyond the ids, the town arms also hold VR9's withheld holders and the honorific (R4's hand-back measured
  the holders): if so, not re-stateable under VR46: STOP. A seat's question beside it: should the page re-key a payload
  the server already re-keyed (the served marker's person keys then name no card on the page)?
- R4's `out/v21/r4/guards-try1.txt` (its late batch) kept and committed as found.

## 7. WHAT I RAN (CONFIRMED) AND WHAT I INFER (PLAUSIBLE)
CONFIRMED: every red and green above with its file; the catalogue and its proof; the cost rows; the acceptance; the
typechecks, eslint, `--check`; the switch's present sets (probe `measure/present.probe.jsx`, base vs tip); the per-card
relationships leak through the server; the honorific seed (read in `faceHonorifics.js`; its effect seen in render-twice and
SignalCopies). PLAUSIBLE: galleryServerVeil's non-id faults; the 14 unread acceptance diff rows; the numeric-id holder ties.
