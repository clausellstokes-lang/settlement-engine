# FRAME-2 — hand-back (a part: handed over to FRAME-3)

Written 2026-11-20T07:37Z (`date -u`), updated as the last builders land (see THE HAND-OVER). Branch `lane/frame-2-2026-11-20`, cut from `origin/lane/frame-2026-11-20` at `4203eb655` (read back unmoved), with the working line `7e0c77ae2` (point 76) merged `--no-ff` first (`20caebf01`, clean). Every unit was built by a builder of this seat from a committed brief (`docs/chair/2026-11-20/content/frame2/B*.md`); each diff read by this seat; every ruling vetoable by the owner.

## THE COUNT THE OWNER READS FIRST (CF11 as built at this hand-over)

On the 330 calm born towns (55 a tier, seeds `frame-calm-<tier>-<i>`, 484 births tried):

| | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| a trouble of weight: the sheet opens on it | 0 | 9 | 15 | 9 | 29 | 31 | **93** |
| none: TODAY'S SHEET, byte for byte | 55 | 46 | 40 | 46 | 26 | 24 | **237** |

**THIS FIGURE WILL MOVE:** the chair ruled W2 "both powers" (a high conflict weighs only where BOTH its powers are the tension's sides); its brief B9 is committed and NOT built by this seat (FRAME-3 launches it). Measured, not built: **58 framed** under it, the crime wave opening about a fifth. FRAME-3 re-takes the table by tier and puts it here.

The opening trouble by type today (93): crime_wave 37 (39.8%: over a third, every one a high conflict between the guard and the criminal power, often over an unrelated issue: the reason for B9), succession_crisis 16, trade_dispute 9, trade_collapse 5, resource_scarcity 5, outside_debt 5, the rest 3 or fewer.

## Each ruling as built

| unit | what | commit | red → green |
|---|---|---|---|
| merge | the line at 7e0c77ae2 | 20caebf01 | clean |
| B1 | CF11's count (measure) | 343d2f72f, 06868af48 | — |
| B3 | the explicit audience gate: `composeTonightSheet(s, { audience })`, the frame for `'owner'` only (`TONIGHT_AUDIENCES`, frozen), fail closed; every caller explicit; the born test opens the sheet ON the gallery page (default and DM-full) and ON the party link (`PartyLinkView`) by the Overview's "Open Tonight" and finds no frame line | bf7193572 | veil 2 failed/4 → 6/6; 76 importer files 621/621 |
| B2 | CF11 weight (`troubleCast.js :: troubleOfWeight`, `WEIGHT_GRADES`, `WEIGHT_MATTER`; edges cited from `data/bandLadders.js :: LEGITIMACY_CUTS`); severity no longer read; a sheet with no frame carries NO `frame` key | 9d68605d3 (merge 65cca4160) | born test on the old tip 4 failed/4 (24 calm + 6 crisis + 2 journal pins) → `tests/domain/tension` 22/22 |
| B2c | the veil test re-seated to towns with weight (hamlet-7, village-0, village-76, town-1, city-0, city-4, metropolis-1, metropolis-5; criminal sides city-0, city-4, metropolis-1); digests measured at the base 85fccf898 | fdb4faac4 | 3 failed → 6/6; 35 files 241/241 |
| B5 | the names rule: `crisisHooks.js`'s 124 bare labels (111 bare, 13 "The" mid-sentence; three sites: `holderWords` 78, a power in a line role 2, `loserClause` 44) through `powerNameInProse`; no stored string changed | 8594e509d (merge 8df635b61) | names test 124 (A) → 0 |
| B5c | names composed with weight: crisis-sheet pins re-measured at 7e0c77ae2 + the crisisHooks diff alone (the names cause alone moved them); the names test's read floor 100 → 90, figure and cause written | cff8c03f5 | 56 importer files 460 passed (1 expected fail) |
| CF10 | measured and proposed (B7); the chair ruled | e200ef2dc, 46ac09598 | — |

Gates at the last green merge (`cff8c03f5`): typecheck:ratchet 167/167, typecheck:domain:strict 1113/1113, lint 0 errors (each builder's own run). `tests/lint` WHOLE and the lighting census by its door: NOT taken by this seat (FRAME-3's, at its final tree).

## Names: what changed, what was left (the chair's rule in this seat's files)

Changed: every power a crisis hook names (`crisisHooks.js`). The frame's own sentences (`troubleCast.js`) already went through `powerNameInProse`; the sheet composes no power name of its own. No (B) breach (a second mention by full name) in any of the four files. LEFT: (C) **the 598 stored strings of `crisisCast.js` that speak of their holder as "it" or a role are NOT a breach: the row carries its holder's name in its own field, and the security lane withholds a cast ENTRY whole, by its holder, never one string of it** (the chair's ruling); the 18 of them that call a PERSON "it" (the waverer's "its power could go either way") are a fault, ruled to be fixed (B10, below). 29 power names inside people's OWN goal text (`npc.goal`, the generator's) are the record's text, left. A latent singular "they" in `CAST_WANTS` (no breach on the pool; its cure touches `crisisFactFindings.js`).

## CF10's proposal and the chair's ruling

File: `docs/chair/2026-11-20/content/frame2/B7-CF10-PROPOSAL-RESULTS.md` (360 towns in crisis, 24 of each of 15 kinds; 9 kinds thin). RULED: build P1b and P4a (render-only), and P1, P2, P3 (P3a the revolt's own leader; P3b a defence gap filled), P4b (the criminal power as creditor; verify first that the criminal power is on the roster when `applyStressEventFactions` runs). NOT NOW, named for after the deploy: P5 (instigators), P6 (profiteers), P3c (the raids' lever). The build brief: `B8-CF10-BUILDS.md` (units U1–U6, the chair's law). None of them built by this seat.

## Stored figures that move (named, NOT re-frozen)

1. `tests/lint/sovereigntyLightingContract.walker.test.js` CENSUS.files: committed 3702; the tip carries more test files (B2's `troubleWeight.test.js`, B5's `frame2NamesRule.test.js`, FRAME-1's three): re-take by its door.
2. `tests/components/phoneChromeFloor.census.test.js` ROUTE_BASELINE: /create 621 → 622, /settlements 864 → 865, /gallery 666 → 667 (floored +1), red since FRAME-1's renderer lines (measured red at 9d68605d3, before B3 and B5). THE CHAIR'S RULING: this lane's: read the census's door; at or above the floor re-record with the cause; below it cure the line. NOT DONE.
3. The tuning register: FRAME_TUNING stays a DRAFT row (the owner signs); `troubleCast.js` now imports `rulingPowerCoup.js`, `governanceLedger.js`, `bandLadders.js` (dependents may move).
4. `docs/content/wiring-census.json` stamp (`producerIndexFiles`) moves with any new src file.
5. No golden: no stored string changed in any merged unit.

## For a security reader: what to attack

- The owner's audience is inferred at ONE mount: `OutputContainer.jsx` passes `audience={!publicDossier && !playerView ? 'owner' : …}`, i.e. any view with a `saveId` that is not a player view is "the owner". `SettlementDetail` mounts it over the owner's own shelf (`useOwnerScopedSaves`); a path that hands `SettlementDetail` another account's save would draw the frame. Session Mode, the PDF chapter and the Foundry Tonight page pass `'owner'` unconditionally (built only from the owner's record, per B3's read of their callers).
- The Table View mount and "Open Tonight" are still ungated on the gallery and the party link (the security lane's gap, reported by FRAME-1); the frame stays off them by the audience gate (first lock) and the stripped seed (second lock); the born test proves both on the rendered pages.
- `scripts/audit/soak-review/renderHarness.mjs` composes with no audience: it now sees no frame (an audit harness, untouched).
- The stored CF10 units, when built, put NEW KINDS OF HOLDER in stored cast roles: a criminal power (P4b), a foreigner reached through a lodging keeper (P1, P3b), a trade's master (P1, P2, P3b). Each builder lists the stored strings that name them (B8's law); the shared page of a town in that crisis is the surface to attack.

## Three calm towns' sheets byte-identical, and three with a trouble of weight

Executed in the born tests (not reprinted here, to keep this file short): `tests/domain/tension/troubleWeight.test.js` pins 24 calm towns without weight (four a tier), 6 crisis towns and 2 journal pages to the 7e0c77ae2 sheet (crisis towns: plus the names cause alone). The plain-text before/after of three calm and three weighty towns for the owner: NOT written by this seat: FRAME-3 writes them after B9, which changes which towns are weighty.

## Executed or plausible

Executed: every count above, each by a builder's script in its results file (B1, B2, B5, B7); every red-first and green line in the table. Plausible, not executed: the PDF chapter and the journal page as rendered pages beyond their text tests; the composition of the audience gate with the security lane's future mount gate.

## THE HAND-OVER (to FRAME-3)

(Completed below as the last builders land.)
