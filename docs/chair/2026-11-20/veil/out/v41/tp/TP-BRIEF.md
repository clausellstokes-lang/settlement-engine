# TP-BRIEF (VEIL-41's measuring builder "V41-TP", unit "TENSION-PARTIES", the chair's N72 (2)): READS NOTHING WHOLE (212 and the twin by grep and by the function a red points to, read whole only for that function). WINDOW 1,000,000; BUDGET ABOUT 200,000. A MEASURE: NO EDIT TO ANY FILE OF THE TREE, NO REGISTRY ROW, NO COMMIT ON A CODE BRANCH.

THE QUESTION: the registry has no row for the value path `history.currentTensions[].factions[]` (its `(only in A|B)` entry forms are rows
`history.tension.factions`, rng; the sibling `history.tension.crimeWave` is a choiceWithhold, house-hidden). C1 found it "unregistered" on 18 stored
places (all role B), as a prose coincidence ("The garrison" in defence prose): `docs/chair/2026-11-20/veil/out/v33/stored/receipts/stored-paths-and-prose.txt`,
the "(unregistered) history.currentTensions" line. THE CHAIR RULES THE ROW ON YOUR MEASURE.

THE MATERIAL (all on this box, local only, PGHOST=/var/tmp/rv7, user postgres; no hosted database, no `supabase` command):
- The 1,948 stored documents: `/var/tmp/v18/stored/today/docs/<seed>.json` and `index-shard*.json` (`{ index: [{ seed, role, size, crisis, ... }] }`).
- The tip's tree, READ-ONLY: `/home/user/wt/tip` (23bb8b8ae); its server template `v41_tip` (v27x211 + the tip's 212): create your own database from it
  (`createdb -T v41_tip v41_tp_<n>`), never write to the template.
- The seat's probe to copy the doors and settings from: `/home/user/settlement-engine/docs/chair/2026-11-20/veil/out/v41/c2/ppkey.probe.jsx` (twin =
  `loadVeil().twin`, settings = `loadVeil().settings(doc, dm).deltas` plus the unmarked `{}`; server doors get_gallery_dossier, get_unlisted_dossier,
  import_gallery_dossier as a non-owner reader) and its runner `ppkey.sh` (the vitest config `/var/tmp/v18/rv9/vitest.config.mjs`, RV6_SRC, RV9_PROBE).
  Write YOUR probe and runner under `/var/tmp/v18/out/v41/tp/` (never in a worktree). Heavy runs through `sh /home/user/wt/tip/scripts/gate-mutex.sh
  --run -- <command>` run from /home/user/wt/tip (exit 3 = gave up: run again); other seats share the box.

ANSWER, EACH WITH ITS COUNT (CONFIRMED = measured; PLAUSIBLE = read off source):
- Q0 how many of the 1,948 documents hold a non-empty `history.currentTensions[].factions[]` at all, and which 18 C1 meant (by its lookup).
- Q1 what stands in those lists (powers' names? houses'? generic words like "The garrison"?), and how many values name a power or house that a setting
  or a hand can hide (a hideable house, `isHideableHouse`; a power the veil can withhold).
- Q2 on every read that hides such a party (each setting, both Reveals, the twin and the three server doors): what is served at that path (the stored
  name, a mask word, the party gone, the tension gone), beside the owner's read.
- Q3 WHICH FUNCTION of 212 and of the twin does it (the hidden-name sweep, the power mask, a withheld power's tension parties), by name (and line).
- Q4 does any OPEN stored place (nothing hidden) show a tension with one party fewer than its kind carries elsewhere? (If none does, a shorter list
  is itself a tell.)

REPORT: `/var/tmp/v18/out/v41/tp/TP-REPORT.md`, at most 60 lines, every figure with its receipt path. Final message: at most 200 words, Q0-Q4, outcome
first. A permission refusal: stop and report it.
