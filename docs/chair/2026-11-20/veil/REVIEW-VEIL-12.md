# REVIEW-VEIL-12 — the twelfth fresh security reader of the share veil (212)

Seat of the seventh chair (session_019yED1SUxGVHyjQnoqoFvQ8). Assignment: `lane/chair-2026-11-08 ::
docs/chair/2026-11-20/seventh/prompts/REVIEW-VEIL-12.txt`. I change no product code. **No verdict yet: 212 is NOT cleared.**
Probes and outputs: `probes/REVIEW-VEIL-12/` (every figure below has its output file there). Every database is a scratch
PostgreSQL 16.15 in this container (unix socket `/var/tmp/rv7`, `listen_addresses = ''`, `fsync = off`). Hours by `date -u`.

## 0. Instruments (07:29–07:39 UTC)

Built from the lane `origin/lane/veil-22-2026-11-20` at **c1b772e55** (VEIL-23's cut). 211 `eface6d0…` confirmed at every
tree read. Chains (`chain.sh`, REVIEW-VEIL-11's with my scratch path): `x212` (c1b772e55, 212 `05b915ab…`), `pre212`
(R2's base 302850b0b, 212 `fec111c2…`), `r4b212` (the unmerged R4 branch dfa031f3e), each with the owner, reader,
profiles and the premium stub. Runner: REVIEW-VEIL-10's `run.sh` and `vitest.config.mjs`.

BITE PROOF (REVIEW-VEIL-11's `r2a.probe.jsx`, arm C; 24 births x unmarked/default veil x Reveal DM off/on): RED at
302850b0b, every raw measure served 24/24 per arm (`out/r2a-red-at-302850b0b.txt`); GREEN at c1b772e55, 0/24 on every
one (`out/r2a-green-at-c1b772e55.txt`). The tile's stability arm stays red at the lane (21/24 per arm, e.g. "Shaken —
nobody trusts those in charge"): VR44 is built at DOORS-IN.

MY OWN INSTRUMENTS:
- `catalogue.sh <db> <migdir>`: every function 211/212 create or restate (parsed from the files), its `provolatile`, and a
  RECURSIVE closure of calls over every public function's source (by name followed by `(`); violators = reaches a drawer
  (gen_random_uuid, gen_random_bytes, random(, setseed, clock_timestamp, nextval) and is not volatile. Bites at dfa031f3e:
  `_gallery_veil` i (draws), `get_gallery_dossier`, `get_unlisted_dossier`, `import_gallery_dossier` s (reach it); empty at
  c1b772e55 (`out/catalogue-at-*.txt`).
- `rk.probe.jsx`: VR46's teeth on the SERVER through node-pg NAMED prepared statements (the extended protocol a client
  library uses), K executions per door in one session, the last 3 under `force_generic_plan`; gallery, party link,
  import (an authenticated non-owner); a stored id served whole, as a word-bounded substring, or as a key; the bijection
  by name; every served re-keyed-form string names a served card (a dangle the stored town already has is recorded, not
  red); a planted NUMBER id with a tie to it; an unserved person's full name in any served string.
- `rc.probe.jsx`: R3 where the two rulings meet (section 1).

## 1. Pre-measures before the stages arrive (executed; leads for the cold reads, not verdicts)

**R4 branch dfa031f3e (NOT GREEN, unmerged), `rk` K=3 and K=7 (`out/rk-at-dfa031f3e.txt`):** the K prepared reads differ
in every case (96/96 per door), even with `_gallery_veil` IMMUTABLE: no plan here folds the salt (its arguments are never
constants), so the catalogue, not the prepared path, is what proves the cure. Stored ids served: 0 (whole, substring,
key) on all three doors; bijection holds; every new dangling reference 0 (the goal targets, cast roles and trace targets
that dangle are dangles the stored town already holds). **RED: a planted NUMBER id (90001) is served as itself on every
door, 64/64**: R4 re-keys only string ids. The R4 cure must re-key it (its brief says so); this is my red for it.

**R3, at the lane c1b772e55 (before R3), `rc` (35 towns with a hideable house; 29 control):** the oracle (the engine's own
Thieves' Guild predicate on `getInstFlags`, with the hidden houses removed) finds the guild RAISED by the hidden houses in
6 towns: served as a row 6/6, its name traced in served strings 6/6 (with Reveal DM on also in people's goals, "Bring
Thieves' Guild under the sway of The Guard…", and 6 memberships). Derived Defense key: organized 11/35, semi 21/35
against the control's 1/29 and 5/29. Faction shares below 100 where a power left (92, 93): VR31 not yet built for powers.
ONE TOWN WHERE THE RULINGS MEET was found by the probe (a criminal-worded governing "Shadow Senate" beside a guild raised
by hidden houses): the R3 read will widen that sample.

**THE RANK-WORD CLASS (the chair, 08:37 UTC), baseline at the lane c1b772e55 (`rank.probe.jsx`, `out/rank-at-c1b772e55.txt`;
21 towns with a hideable house, default veil, gallery read, Reveal DM off and on; sanity compose(A) = stored prose 21/21):**
the counterfactual (the stored town with the SERVED houses, income rows, factions and safety profile put in place) composes
the same sentence on 183 prose keys. It differs on four keys, every one an R5 row already registered and not yet built:
`warFaith:faith.templeFraud` ("The church and the city's thieves share what…", absent in the counterfactual: 4 reads),
`power:desk.structureFlag` ("the richest merchants and the criminal bosses are often the same people": 8),
`economy:economics.shadowEconomy` ("small, but … somebody organises it" against "some petty theft": 10),
`economy:economics.incomeWeight` (26). No rank word on an alias row differed at this tip. The probe runs again at R5 and
at FINAL, with the groupings shut and opened (`RV12_OPEN=1`) and on a control pool.

## 2. Cold read: "VR47 e4cce485f" (merge df6809f9c of e971c8ff2; lane origin/lane/veil-23-2026-11-20 at 4c753ec52). HOLDS.

Executed 09:12 UTC. THE DIFF, line by line: one new helper `honorificSeedOf(name, title)` (name and title trimmed,
joined by `::`); its two callers `cardDoor.js :: cardHonorificOf` and `seatKeeper.js :: keeperHonorificOf` pass it in
place of `<id or name>::<institution name or key>`; nothing else in `src/` moves (the rest of the commit is tests, pins
re-recorded and outputs). `honorificOfTitle` itself reads only the title, the gender, the seed, and the place's culture and
coast; neither the culture nor the coast is a row the veil can withhold (no registry row, no 211/212 path names them).
RED/GREEN: its own `honorificSeed.test.js` red at 4d91d5c5f (4 tests fail), green at 4c753ec52 with the three re-recorded
pin files (38 of 38; `out/vr47-*`). THE EDGE BUNDLE: rebuilt by me at e4cce485f with `build-edge-shared.mjs`: every
bundle byte-equal; only `generatedAt` and `builtFromCommit` differ (`out/edge-rebuild-at-e4cce485f.txt`).
MY ATTACK (`hon.probe.jsx`; 24 born towns, unmarked and default veil, Reveal DM off and on; the gallery read through the
tree's own client; 3,830 drawn cards with a house): the honorific the card prints and the Institutions tab's connection
name, under six changes of fields a read withholds or re-keys (the card's id, its institution key, `institution.veiled`,
every other card removed, every hideable house removed, every person id re-keyed): at the base 1,606 / 1,596 / 0 / 0 / 0 /
1,594 moved; at the tip **0 on all six** (`out/hon-at-4d91d5c5f.txt`, `hon-at-4c753ec52.txt`). No drawn card carries a
house record not stamped public, nor a hidden house's record, on a Reveal-DM-off page (0 of 1,884). Owner against visitor:
78 of 3,830 cards print a different form, **every one a woman whose served card carries no gender** (0 of 2,858 otherwise;
`hon-at-4c753ec52-bygender.txt`): that is VR48's field, read at R4.

## 3. Pre-measure of the R3 cure 4db8e4208 (UNMERGED, not a stage read; 09:18 UTC)

`rc.probe.jsx` sharpened on the chair's three owed points (the fold: a withheld name and its bare form, word-bounded, as a
string or a key, with a bracketed-qualifier plant `RV12_PLANT=1`; the derived key's feeders against the control pool;
Reveal-DM goals). Chain `r3c212`. 35 towns with a hideable house, groupings opened, every hideable house hidden; 28-town
control (`out/rc-at-4db8e4208-*.txt`; the lane's own run `rc-at-c1b772e55-plant.txt`).
- CURED there: the guild raised by hidden houses leaves whole (rows 24/24 at the lane -> 0/24; name traces 24/24 -> 0/24;
  memberships 6/24 -> 0/24); faction shares sum 100 on every town (6 below at the lane -> 0); VR42 0/8, 4 of them towns
  where a criminal-worded governing power stands beside a guild the hidden houses raised.
- LEAD 1, TIER 1: a SHOWN power's `powerStructure.factions[].desc` names the withheld guild ("…they play Thieves' Guild and
  City-State Council against each other when they can. A slow war with the guild: arrests are made, the gangs rebuild…";
  rv12-rc-metropolis-indebted-0-42; all four reads).
- LEAD 2, THE OBSERVABLE: with nothing criminal served, the served operations list carries "Rival Gangs" in 17 of 33 towns
  (control 0 of 28), "Gambling District" 14 (0), "Red Light District" 13 (2), "Gambling Halls" 9 (2); the derived key reads
  semi-organized in 29 of 35 against the control's 5 of 29 (my hidden pool is crime-heavy by its dials: a confounder).
- The fold's one remaining hit: "black marketeer" served with Reveal DM on (a holder of the hidden Black market: R4's VR9;
  that branch has no R4).
