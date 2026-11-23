# TP-REPORT (V41-TP, TENSION-PARTIES, the chair's N72 (2)). A measure only: no edit, no registry row, no commit.

Tree /home/user/wt/tip 23bb8b8ae, template v41_tip, 1,948 stored documents (/var/tmp/v18/stored/today/docs).
Probe /var/tmp/v18/out/v41/tp/tp.probe.jsx, runner tp.sh, tables tp-an.mjs.
Main receipt: /var/tmp/v18/out/v41/tp/full/tp-table.txt (run 09:47-10:50Z, full/window.txt, 4 shards rc=0).
Twin: every document, 12 settings (own, g:000..g:111, allOpen, off, unmarked {}) x 2 Reveals = 46,752 reads.
Server (three doors, page, link and import as a non-owner reader): 373 documents (server-seeds.txt), every document whose
tension list the twin changed on some read or whose parties name a criminal or hidden power or a hideable house, 8,952 reads per door.

## OUTCOME
No read on any engine or door SHORTENS a tension's party list. A tension naming a party the read hides is either
dropped WHOLE or has that party MASKED as "an unseen interest". C1's 18 are crime_wave tensions dropped whole on all
360 reads. "The garrison" and "The watch" are generic watch words that the defence prose also uses on its own.
"Unregistered" is an artifact of the lookup. The registry's tension path strings (`history.currentTensions[] (only in A)`,
`...[].description`) compile to regexes with an empty `[]` class and so match nothing (PLAUSIBLE, read off
rosterChoiceRegistry.js:333-337 and prose.probe.jsx :: rowOf). The removal itself is row history.tension.crimeWave.

## Q0 (CONFIRMED)
- 1,948 of 1,948 documents hold a non-empty factions[]: 4,045 tensions, 11,932 parties (tp-table.txt line "Q0").
- C1's lookup, rerun as written (a telling party served nowhere as a leaf yet whole in served prose; twin, 10 settings x 2
  Reveals): 18 documents, all role B. Every one is a crime_wave tension. Values: "The garrison" 11 (defense:state 6,
  defense:posture 5) and "The watch" 7 (defense:state). Seeds and per-document reasons are in tp-table.txt.
- Of the 18 tensions, 15 are dropped because the crime signal is false and 3 because they name a withheld power. On all
  20 reads the whole tension leaves.

## Q1 (CONFIRMED by class on the record)
- Generic words: 11,253 parties ("Those who...", "The garrison", "the criminal network", ...).
- Powers: 388 open, 168 governing, 18 governing that also share an open house's name. Governing powers are never
  withheld (VR42).
- Parties a setting or a hand can hide: 105 in 104 documents.
  - 78 name a non-governing criminal power.
  - 25 name a criminal power ("Thieves' Guild") whose name is also the bare form of a hideable house ("Thieves' guild (powerful)").
  - 2 name a `hidden: true` power ("The Independent Bloc", the infiltrator).
- 0 parties name a hideable house exactly.
- 104 of the 105 are hidden on some read. The one exception is t2p-town-none-170, which has no hideable house, so its
  criminal power is never withheld.

## Q2 (CONFIRMED; tp-table.txt "Q2" lines). Owner's read = the stored record: every party as stored.
- Twin, party-reads that name something hidden:
  - 1,166 + 418 tension gone (crime signal false).
  - 528 + 132 tension gone (it names a withheld power).
  - 24 masked as "an unseen interest". This is the hidden power on Reveal off; Reveal DM serves the name.
  - 0 party gone, 0 stored name served.
- Twin, generic party-reads that leave with their tension: 17,424 (crime signal) and 1,166 (withheld power).
- Page and import doors: identical tallies to the twin on every setting.
- Link door:
  - Masks on both Reveals (48 masked party-reads), because get_unlisted_dossier sends gallery_share_dm false
    (212:3078).
  - On `unmarked` {} it drops what page, import and twin serve: crime_wave tensions and tensions naming withheld powers,
    1,894 party-reads. This is a door difference outside this question; it is listed for the chair.
- 0 mask words other than "an unseen interest". 0 unmatched served tensions after the matcher fix.
- Whole-list twin/server equality is NOT receipted. The first run compared without sorting keys, and jsonb reorders
  keys (the peek in peek/peek.mjs shows the same content in another key order). The canonical rerun (srv/, srv-run.log)
  was queued on the mutex and had not run when this report was handed back.

## Q3 (functions; CONFIRMED by outcome class, attribution by source = PLAUSIBLE)
- Whole tension on a false crime signal:
  - twin: galleryRosterChoices.js :: applyRosterChoices:329 (reached only where a house is hidden whole, the `if (!whole) return` at 167)
  - 212: _gallery_veil_roster_choices, lines 2663-2666
- Whole tension naming a withheld power, including the husk the sweep leaves:
  - twin: galleryRosterChoices.js :: withholdPowerCopies (361), tensionNames:379, filter:399
  - 212: lines 2409-2413, with _gallery_veil_copy_names 'tension' (2116)
- Name sweep, which cuts the "Thieves' Guild" string first:
  - twin: gallerySecondHomes.js :: sweepHiddenNames:637, via withholdSecondHomes:1062
  - 212: _gallery_veil_name_sweep:1045, via _gallery_veil_second_homes:1695
  - Never seen alone: its remnant always leaves whole.
- Mask:
  - twin: publicSafe.js :: publicVeilPass -> maskHiddenNames:355 (HIDDEN_POWER_MASK:306)
  - SQL: 210 _gallery_sanitize_public_json:311

## Q4 (CONFIRMED)
- 1,192 open places, where no house is hidden and no power is withheld on any read.
- 21 open tensions carry fewer parties than their kind's longest: religious_tension 13 (["Reformists","Secular camp"]),
  succession_crisis 7, crime_wave 1.
- So a shorter list is not by itself a tell, and no veil read produces one: 0 "party gone" reads on any engine or door.
