# U3R: UNIT 3's REWORK UNDER RULING V28 (the covert check at every door that reads a copy). VEIL-56's builder seat.

## 0. WHERE THIS SEAT STANDS (kept current; hours from `date -u`)
- CODE `lane/veil-56-2026-11-27-door2-wip` (cut at 08a9dd8fb): 5ab9caeb7 (V28 (1) a, b, c for the copy; d taken in; pin; comments),
  e492c6f8e (the frozen member's name and tier, N95). Pushed. THE TIP IS e492c6f8e until the proofs below say otherwise.
- DOCUMENTS `lane/veil-56-2026-11-27-u3r-docs` (cut at d06820b02): this file, `N84D-CHRONICLE-REKEY.md`, `probe/`, `run/`, `out/`.
- DONE AND PROVED: A, A2, A3 (sections 1 to 3); B's red then green for (a)(b)(c-PR)(d), the pin's members, the name and tier (section 4).
- HALF-DONE: see section 5's table (rows not yet run say so).
- HELD FOR A RULING: (c) for the SENTENCE (PS-RULE); the chronicle (N84 (d)'s rule for `gone_people`); orphan rule's reach (every
  public read, the link included, as built: section 3's surprise is why).
- THE MACHINE: `run/restore.sh` (VEIL-52's recipe, Q pointed at a copy of v52's scripts), then `run/runA.sh` (templates, A, A2, A3),
  `run/runB.sh`, `run/runC.sh` (tests, rollback, lint, typecheck), `run/runD.sh` (the measure after the cure, galleryImportEqualsRead).

## 1. A: VEIL-52's MEASURE RE-RUN AS IT STANDS (CONFIRMED)
Four runs of `v52/frozen/fc.sh` unchanged (tree 2f849aa53, master db832c892; both pools x v52tip, v52dsql), each through the mutex,
exit 0. Every table (`out/a/*.table.txt`), from its first line through the RULE section, is BYTE-IDENTICAL to VEIL-52's
`v52/frozen/out/*.table.txt`: 69 covert towns today-born; the master-made copy serves the covert prominentRelationship 7 / 7 / 7 at the
gallery read / import / map member on both templates; the tip-made copy and the link 0; the live map member 7 on v52tip only; the
master pool holds no covert tie.

## 2. A2: THE SENTENCE BY ITS WRITER (CONFIRMED; under the hour)
The oracle is `settlementNarrative.js :: genRelNarrative` (the tie branch of `narrativeGenerator.js :: generatePressureSentence`),
driven per tie with its skip refused and its template forced, in a seeded context: every phrasing the writer can give each tie
(`probe/fc2.probe.jsx :: phrasingsOf`). A first run was BLIND (the writer's score draw throws outside a seeded context; the probe
swallowed it): an independent count (stored sentences holding a tie's tension or description tail: 12 per pool) exposed it, and the
re-run with a context finds those 12.
| pool | sentences that are a tie's phrasing | a COVERT tie's | of those, the name test misses | served covert phrasing, any door (link incl.), any copy |
|---|---|---|---|---|
| today-born | 12 | 0 | 0 | 0 |
| master-born | 12 | 0 | 0 | 0 |
| PLANT (each covert town's sentence = its first covert tie's phrasing) | 78 | 69 | 0 | 69 at the master-copy gallery / import / map; 0 at the link, the tip copy and live |
NO LEAK on the stored pools. The planted positive is caught by the instrument (69 of 69) and is itself a RED of the sentence at the copy
doors on the base (`out/a2/`).

## 3. A3: THE DRIFT PLANT (CONFIRMED, on v52dsql = unit 3 as built; 69 covert towns)
Frozen by master's path, THEN the live row changed. Served covert prominentRelationship (oracle: the town as born):
| drift | M gallery / import / map / link | T copy doors / link | live gallery / import / map / link |
|---|---|---|---|
| (i) covert tie deleted | 7 / 7 / 7 / **7** | 0 / **7** | **7 / 7 / 7 / 7** |
| (ii) one end renamed | 7 / 7 / 7 / 0 | 0 / 0 | 0 |
THE SURPRISE (sent at once): after (i) the stored copy outlives its tie and EVERY door serves it, the link and live mode included. Only
the orphan rule closes it; that is why (c) runs on every public read.

## 4. B: THE BUILD (red first, each part)
SQL (212): `_gallery_apply_member_overrides` gains `pr_orphan` (c) and 662a9c207's `unread` clause (d); `get_gallery_dossier`,
`import_gallery_dossier` and `get_gallery_map`'s member join the live row's covert ties (`s.data` and `s.ai_data -> 'aiSettlement'`,
by the sanitiser's condition) to the source's relationships[] for the check (b); the frozen member's name and tier (N95); header (41);
three stale comments (V28 (5)). TWIN: `gallerySecondHomes.js :: withholdCovertCopies(pub, full, shareDm, live = [])`, rule for rule.
No function added, removed or re-signed; the rollback is unchanged (it restores 211's statements of all four).
NOT BUILT, AS ORDERED: (c) for the sentence (PS-RULE); the chronicle (held on N84 (d)). Named for unit 4: `get_gallery_map` keeps
`s.data` and the served source `src.j` in scope.
