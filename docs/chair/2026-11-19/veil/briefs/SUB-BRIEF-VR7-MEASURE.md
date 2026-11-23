# SUB-BRIEF: VR7 MEASURE FIRST — VR9, VR10, THE DRAWN CENSUS, MASTER'S SHAPE (VEIL-18, list item 3, read-only)

You are a MEASUREMENT seat for VEIL-18 (assignment `lane/chair-2026-11-08 :: docs/chair/2026-11-19/veil/prompts/VEIL-18.txt`).
READ-ONLY: you change no tracked file in any tree; you commit nothing; you push nothing. Every output goes under
`/var/tmp/v18/out/vr7m/`; your one deliverable is `/var/tmp/v18/out/vr7m/VR7-MEASURE.md` (the seat commits it).

## Where you are
- The base tree, read-only: `/var/tmp/v18/base` (`git archive 1f501779b`, `node_modules` linked). The git repository
  (for `git show`/`git worktree add` of master only): `/home/user/settlement-engine` (do not edit, stage or commit
  anything there; do not touch `/home/user/wt/b1`, another seat's).
- Local PostgreSQL 16 (`PGHOST=/var/tmp/rv7 PGUSER=postgres`), unix socket only, if you need a chain:
  `sh /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-6/native/chain.sh <db> <211|212> <tree>/supabase/migrations`.
  No hosted database, no credential, no `supabase` command, ever.
- THE READER'S DIFFER: `/var/tmp/v18/rv9/differ.probe.jsx` (read it whole first; its merge and classify scripts beside
  it) and its runner `/var/tmp/v18/rv9/run-differ.sh <src tree> <outdir> [N]`. Its output at the base, every eye shut:
  `/var/tmp/v18/out/differ-base/classes-all.txt` (130 paths in the class) and `merge-all.txt`, `merge-default.txt`,
  `classes-default.txt`; the shards `shard*.json` hold the per-path example values.
- Background: `docs/chair/2026-11-19/veil/out/VR4-REPORT.md` (in `/var/tmp/v18/base`; sections 1, 2, 2b, 2c, 3) and
  `docs/chair/2026-11-19/veil/COHERENCE-VEIL-HANDBACK-PART18.md` section 4 (the rulings VR7 to VR14, quoted there).

## The four measurements

M1 · VR9, THE ROLE-LESS BASE RATE (the chair: "before you blank a role, MEASURE the base rate of people shown with no
role on unveiled pages; if role-less people are rare (a blank role would itself tell), the holder's card is withheld
WHOLE with its ties instead; if they are common, blanking stands"). On born towns (the differ's births or
`docs/chair/2026-11-14/veil-probe-13/measure/r5-born.probe.jsx`'s, at least 140 towns, every tier), with NO veil record
(the unveiled page: the twin's `galleryPayloadFor(rec, {shareDm:false})` and `{shareDm:true}`, then `projectShareVeil`
with an empty veil), count per town and in all: people in `npcs[]`; people whose served `role` is absent or empty;
whose `title` is absent or empty; whose both are. Both stored shapes (the new shape; master's old person shape: see
how `docs/chair/2026-11-14/veil-probe-13/measure/r5-born.probe.jsx` or the differ build it). Also: how many towns have
at least one role-less person. State the rate plainly and which way VR9 falls.

M2 · VR10, A PERSON ID STABLE ACROSS READS (the chair: "try a per-read re-key of EVERY person's id on non-owner reads
(salted, consistent within one payload), so no prefix or pattern tells; measure whether any non-owner view needs an id
stable across reads; if one does, report it"). READ the code of every non-owner surface and everything it hands on:
`src/components/gallery/**` (GalleryDetail, PartyLinkView, the map views), `PublicDossierView` and its tabs, the
public page's routes, the party link's refresh, the import path (`import_gallery_dossier`'s consumer in the store: does
an import keep person ids, merge with an earlier import of the same town, or diff against it?), comments or bookmarks
or URL fragments keyed by a person id, any localStorage/sessionStorage keyed by a person id, the map's pins, the
Foundry journal and PDF from an imported record. For each: does it read a person id, and must that id equal the id of
an earlier or later read of the same share? Report each surface with `path :: symbol` and a yes/no. Also list every
place INSIDE one payload where a person id is referenced (ties `from`/`to`/`npc1Id`/`npc2Id`, faction leaders,
`prominentRelationship`, stress casts, history, conditions, anything) — the re-key must reach them all.
Also: does the stored id spell anything (`npc_veiled_` prefix, `npc.<firstname>`, a house key)? Count the id forms on
born towns.

M3 · THE DRAWN CENSUS (VR14 (iii)/(iv): "a non-owner read carries any other derived number only in the form a shared
page DRAWS it (band or label or drawn score); a raw figure no shared page draws is not sent"; VR8; and "nothing draws
it" as VR4 §2b ruled for `spatialLayout.quarters`). For EVERY path in `classes-all.txt` (130) and `classes-default.txt`
(its extra paths), find whether a NON-OWNER surface draws it: the gallery detail, the party link, the public dossier
page (every tab, group and disclosure), the map; and separately whether the IMPORTER's own surfaces draw it (an import
becomes the importer's own record: its tabs, its PDF, its journal, its simulation kernels). Give per path: drawn on a
non-owner page (yes/no, where: `path :: symbol`), drawn for the importer (yes/no, where), and the form drawn (raw
figure, band/label, sentence). A table with one row per path. Method: grep the readers of each key in `src/components`,
`src/pdf`, `src/lib/foundry` (or wherever the journal is), `src/domain/display`; follow the public page's tab
components; do not guess: say "unread" where you could not settle it.

M4 · MASTER'S SHAPE (the reader's 113). Run the differ with `RV9_GEN` = a worktree of `origin/master`
(`git -C /home/user/settlement-engine worktree add --detach /home/user/wt/master origin/master`, then `npm ci` inside
it — this is the one write you may make, outside every lane tree; it may write `core.hooksPath` into the shared config:
leave it) and `RV6_SRC` = `RV9_VEIL` = `/var/tmp/v18/base` (read `run-differ.sh` and the probe for how to set them; copy
the runner into `/var/tmp/v18/out/vr7m/` and change only the env). N=2. Report its class count and the classes
(the merge and classify outputs), and which of its paths are NOT among the new shape's 130.

## Your deliverable
`/var/tmp/v18/out/vr7m/VR7-MEASURE.md`: M1 to M4, each with its method (what was executed, what was only read), its
numbers, and one plain line of what it means for the registry. Then a final report to the seat of at most 300 words:
the four headline numbers, the VR9 verdict, the VR10 verdict (and any surface that needs a stable id), the count of the
130 paths drawn / undrawn on a non-owner page, and executed told from plausible.
