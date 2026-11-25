# V53 cures UNIT D: NOTES (partial, written as I go)

- Tip found: lane/veil-53-2026-11-24-cures-wip at b61c1e630 (/home/user/cures53).
- Read whole: `src/domain/seat/holderOfSeat.js`, `tests/lint/recentConflictReaders.walker.test.js`, `rulingPower.js :: transferRulingPower`.
- The question before any src change (the unit's STOP): in REDSCAUSE (5)'s construction the owner's holder (A) is decided
  ONLY by `transferTakerOf`'s tie-break on `powerStructure.recentConflict`, a key withheld on every shared read
  (registry `power.recentConflict`, withhold always) and re-derived by `pageRederive.js :: rederiveRecentConflict` to the
  BASELINE sentence. Hypothesis: two owner records that differ only in that withheld key (naming A, naming B) serve the
  SAME document, so no read of the served document can equal the owner's on both. Probe follows.

## MEASURED (d5.probe.test.js beside this file, run from /home/user/cures53 through `sh scripts/gate-mutex.sh --run --`, exit 0; d5.out)
- Construction and twin (r5-city-0, r5-city-1): the owner's `holderOf` names A where `recentConflict` names A, and B where it
  names B. The two SERVED documents (`toPublicSafe` + `applyVeil(resolveVeil(defaultVeilFor))`) are DEEP-EQUAL; neither holds
  `powerStructure.recentConflict`; the two pages after `rederiveForPage` are deep-equal; the reader's holder is B on both.
- So no function of the served document (or of the page) can equal the owner's holder on both records: the only fact that
  tells A from B is the withheld key. Edge order is not that fact either: `transferRulingPower` rewrites a taker's existing
  edge IN PLACE (`pairedWithWinner`), so the last matching edge need not be the last taker on a real record.

## VERDICT: STOP (the unit's own STOP; COMMON-RULES 14 (e), N102). No src change, no test change, NO COMMIT.
The owner's holder cannot be told from the served document without serving a new fact. A cure would need ONE of (each an
owner/chair decision, none mine):
1. a NEW SERVED FACT naming the last transfer's taker (e.g. a structured `lastTransfer.taker`, or serving the
   `recentConflict` sentence where it is a `TRANSFER_WORDINGS` 'conflict' row; the key is withheld always today, registry
   `power.recentConflict`, 212 `_gallery_veil_withhold_always`: a migration and a registry change); or
2. retiring the earlier taker's edge on OLD records (U5 does it at a transfer only under the seat law): a record rewrite; or
3. changing the OWNER's read so it no longer consults `recentConflict` (both audiences then read only edges: the last
   matching edge, or NOBODY on two takers per Addendum 3's fail-closed). That moves the owner's page off the ruled CS2 R1
   tie-break ("the transfer's own recentConflict sentence decides") and is not the ruling's "names the holder the owner's
   page names" as written.
The walker row for `holderOfSeat.js :: transferTakerOf (1)` is NOT added either: no honest verdict exists until the cure
does (`page-copy` would be false: it reads the BASELINE copy and tie-breaks wrong).

## RULING V16 (route (4), FAIL CLOSED): build notes, partial
- Tip 90ddc2fe5. Readers of the seat's holder in src (grep holderOf / transferTakerOf / holderOfSeat / seatOf / holderName):
  `holderOfSeat.js :: holderOf` (the one function; the only caller of `transferTakerOf`); `powerStrata.js :: rulingHouseApartOf`
  (the page's door, audience passed; its four callers read its answer); `factionDynamics.js :: seatHolderApartOf` (owner, birth
  and the final-record pass); `rulingPowerCoup.js` (owner, play-time engine). Crisis `levers[].holderName` is an institution's
  holder, another fact.
- FOUND: `rulingPowerCoup.js :: coupContenders` reads `holderOf` with the OWNER's audience and runs on shared pages
  (`powerStrata.js :: derivePowerStrata`, `EngineSections.jsx`, `powerDeskRead.js`, `printProse.js`): on the served
  two-taker page it drops the LAST edge's taker (B) from the contest, a wrong holder read through `transferTakerOf`'s
  undecided fallback (the walker's unregistered site is reached exactly here). So the fail-closed belongs in the ONE function
  for both audiences: two or more takers that the transfer's own sentence does not decide answer NOBODY (R1, Addendum 3's
  shape). Owner: unchanged wherever its own sentence decides (the plant, arm (3)'s real three-transfer town); the only owner
  change is the undecided fallback (last edge -> nobody), which arm (3)'s own comment shows can name a stale taker.
- RED (old code, /var/tmp/v53/cures/D/red.log): `holderTwoTakers.test.js` 2 failed | 3 passed: "(2) the shared page names NO
  holder from the transfer ..." -> `r5-city-0 reader: ... "holderName": "Merchant Guilds"` (B; the owner names
  Military/Guard); "(3) none anywhere on the page ..." -> `r5-city-0: expected [ 'Merchant Guilds' ] to deeply equal [ 'City Council' ]`.
- CURE: `holderOfSeat.js :: transferTakersOf` (new export: the edge read alone); `transferTakerOf` returns null where the
  sentence singles out no taker (was: the last edge); `holderOf` answers NOBODY (R1, no R2/R3) on two or more undecided
  takers, and refuses every undecided taker's keeper as a crowned seat's person (fail closed).
- WALKER: `recentConflictReaders.walker.test.js` REGISTER row `holderOfSeat.js :: transferTakerOf` (n 1, page-copy, with
  why) + new arm HOLDER_READERS (5 sites: holderOf, transferTakerOf, rulingHouseApartOf, coupContenders, seatHolderApartOf;
  the leaf's R1 reads called by holderOf alone). GREEN: walker + new test 10/10.
- COMMITTED 168587f9c (hooks ran, eslint --fix clean). Governing files: 10 naming holderOfSeat.js or its exports + the new
  one = 11: 256 passed, 1 failed = proseComposed.walker SHRINK-ONLY (2327 > 2103), on the trial join's 66.
- Next: tests/lint whole (log /var/tmp/v53/cures/D/lint.log), then the banked-720 pool probe (pool/pool.probe.test.js).
- tests/lint WHOLE (--maxWorkers=1): 25 files | 65 failed | 3378 passed; against the trial join's 66 (prefix match, the list
  truncates titles): NEW none; GONE one, recentConflictReaders.walker "every site is registered ..." (lintfails-D.txt).
- POOLS (pool.probe.test.js, pool.out): born, the banked 720 (censusPlan('r2', 1)) at 168587f9c, all 720 under the seat law:
  two or more takers 0 on the owner's record, 0 on the shared page (no birth carries a transfer edge at all: 0 R1). Stored:
  no stored pool is reachable locally (no hosted database by law; no fixture under tests/fixtures carries
  factionRelationships), so the stored count is NOT measured.
- RESIDUAL named, not cured (outside the manifest): the served edges' own narratives ("<taker> is the power behind ...") print
  wherever the page prints faction relationships (`PowerStrata.jsx :: groupRelationships`); they are relation prose on both pages,
  not a holder read.
