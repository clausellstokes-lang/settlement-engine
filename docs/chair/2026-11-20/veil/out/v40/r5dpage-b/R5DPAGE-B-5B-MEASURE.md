# R5D-PAGE-B: item 5b's MEASURE, phase 1 (Q1, Q2, Q3)

VEIL-40, chain A, builder R5D-PAGE-B. Brief: `briefs/R5D-PAGE-B-BRIEF.md` (ec23449fc), "PHASE 1"; ruling 107 (3). Tree: worktree
`/home/user/wt/r5desc` at 74afc8219, nothing in `src/` or `supabase/` changed. Written 2026-11-23T06:56Z (date -u). NO CURE and nothing of
phase 2 is built here.

**The instrument** (in this directory): `r5dpageb-5b.probe.mjs` (the probe: births, reads, records as ndjson), `aggregate.mjs` (the
tables; no engine and no database), `rivalRows.mjs` (T12's seven rows, copied as data from `applyDensityLaw.js :: RIVAL_DESC_OF_HOST`
at 74afc8219; the probe checks the copy against every born rival: drift 0 of 346), `run.sh` (the one runner). The run's tables are
in `run-full/tables.md`, its exits in `run-full/exits.txt`, its records in `run-full/shard-*.ndjson.gz`.

## What was run, and how the figures are built

- **The places.** A's born pool by `R5DP_POOL=full`'s recipe: 140 births (`r3m-<size>-<crisis>-<k>-<idx>`). R5-RECENT's pool by
  `R5C6_POOL=full`'s recipe: 480 births (`r5c2-m3{,b}-<size>-<i>`). Act T on jp6-city-8 (Noble Families, hidden by the DM, takes the
  seat). Every birth of a pool was made first, in its recipe's order, in one process per pool, before any read.
  **NOT RUN: the stored today-born pool** (phase 2, item 5c: not made yet).
- **The rivals.** Every stored power row with `contestsNiche` (the mint in `resizePoliticalRoster`). Its host is the other row whose
  `seatKey` is the niche. Its template is **T12.<row>** where its stored base is a `RIVAL_DESC_OF_HOST` row's text, and **T13** (the
  mint's `{ ...host }` copy) otherwise. There are 346: A 116, R5-RECENT 228, act T 2 (T12.0 44, T12.1 4, T12.3 2, T12.4 13, T12.5 8,
  T13 275). Every rival stands in a city or a metropolis. Every rival has a host on its born roster. Two T13 bases are not their
  host's (r3m-metropolis-politically_fractured-1-130 and 1-140, The Clergy Alliance: the host's own base was rewritten after the
  mint).
- **The hides.** For each distinct host, the record with that host hidden BY HAND (`hidden: true`, as A's plants do it): 344
  records. Act T as it stands (its taker hidden), plus act T with The Independent Bloc also hidden: 2 more. That is 346 records.
  Each is read Reveal off and DM, by both engines (212 on a pglite chain of every migration on disk; the twin), at both doors (the
  gallery page; the import). That makes 2,768 rival reads. **The setting differs from A's differential:** every read is at the
  owner's own setting with every criminal grouping open AND every house card and field shown (galleryVeilDesc's `shown`). So the
  only hide on a read is the hand's, plus the rule's. My first smoke used the open setting alone, and there no born place hid
  nothing, because the born criminal houses stay hidden.
- **"Never there", exactly.** This is A's `neverThere`, copied whole. It takes the hiding record and **DELETES** the withheld rows
  (powers and houses), their relation rows and their tension parties. On the player view it also masks each name the owner hid,
  as the projection does. It is not a birth without the host. **A rival's copied or chosen base is therefore KEPT on the
  never-there place BY CONSTRUCTION.** Q1's equality, and Q3's "also on the never-there read", are counted below, **NOT
  EVIDENCE**.
- **The open index (Q2).** Every pool birth (620) read with nothing hidden by hand, at the same setting, Reveal off and DM, both
  engines, both doors. A read counts only where it hides nothing (galleryVeilDesc's `hidesNothing`). 607 places qualify, with
  4,856 of 4,960 engine-door reads. The other 104 reads withhold The Independent Bloc (and in 8 of them The Grey Council) as born.
  The four engine-door rosters (name, base) agree on 1,214 of 1,214 place-and-Reveal pairs. "Base" means the served desc with its
  standing cut by the JS reference cut (`standingForms.mjs :: cutDesc`).

**Runs** (every heavy run through `scripts/gate-mutex.sh --run`, the exclusive tier; vitest read by `gate-tail.sh`; no git
repository variable in a run's environment; logs in the scratch directory, read by tail/grep):

| run | what | exit |
|---|---|---|
| smoke | `run.sh <dir> smoke` (r3m-city-none-0-37 and jp6-city-8; the open setting, before the fix); mutex give-ups (exit 3) at 03:56:10, 04:17:10 and 04:38:11, each waited out and retried | 0 (04:58:22Z), agg 0 |
| a full run queued at 04:58 | stopped by me before any shard wrote a line (0 records): the smoke had shown the open-setting fault | none (stopped) |
| full | `run.sh <dir> full`: queued 05:00:20Z, waited for the seat's `arerun` (give-up at 05:20:20), lock taken 05:39; three shards side by side under one hold: A 0/1 (141 places), C6 0/2, C6 1/2 (240 each) | A 0 (06:41:52Z), C6 0/2 0 (06:50:05Z), C6 1/2 0 (06:52:10Z); full 0; errors 0 |
| agg | `run.sh <dir> agg` (re-run after the focused figures were added to `aggregate.mjs`) | 0 (06:54:32Z) |

## Q1: is the rival's SERVED base equal to its base on the never-there place?

**EQUAL ON EVERY READ, BY CONSTRUCTION (counted, not evidence).** The rival's base is equal on 2,760 of 2,760 reads that serve its
row. On every read that serves its desc, the served base equals the stored base: 2,504 of 2,504 (no mask in it, no cut). The
never-there place keeps the same row with the same copied or chosen text, so this equality says nothing about the host.

| template | Reveal | rival x record | reads | row served | desc served | base equal (hiding = never there) | page desc (base+S) equal | served base = stored base | label |
|---|---|---|---|---|---|---|---|---|---|
| T12.0 | off / DM | 44 | 176 / 176 | 176 / 176 | 176 / 176 | 176 / 176 | 176 / 160 | 176 / 176 | CONFIRMED (by construction) |
| T12.1 | off / DM | 4 | 16 / 16 | 16 / 16 | 16 / 16 | 16 / 16 | 16 / 16 | 16 / 16 | CONFIRMED (by construction) |
| T12.3 | off / DM | 2 | 8 / 8 | 8 / 8 | 8 / 8 | 8 / 8 | 8 / 8 | 8 / 8 | CONFIRMED (by construction) |
| T12.4 | off / DM | 13 | 52 / 52 | 52 / 52 | **0 / 0** (a criminal rival's desc, never served) | n/a | n/a | n/a | CONFIRMED |
| T12.5 | off / DM | 8 | 32 / 32 | 32 / 32 | 32 / 32 | 32 / 32 | 32 / 32 | 32 / 32 | CONFIRMED (by construction) |
| T13 | off / DM | 275 | 1,100 / 1,100 | 1,096 / 1,096 | 1,020 / 1,020 | 1,096 / 1,096 | 1,096 / 1,036 | 1,020 / 1,020 | CONFIRMED (by construction) |

- On the hiding read the host is absent on every player-view read (1,384) and stamped on every DM read (1,384). CONFIRMED.
- Rows not served: 8 reads, one record (r5c2-m3b-metropolis-13, The Grey Council, when its host The Independent Bloc is hidden).
  CONFIRMED (the cause is not chased).
- The page desc (base + S) differs on 76 DM reads, and on 0 player-view reads. **The free differential** over every served power of
  the 346 records (16,152 power rows) finds the base differing on 0 rows. The page desc differs on 520 rows in 444 reads on 111
  records, all of them on the DM door, server = twin, page = import. This is the place of A's listed share class (36 reads on 9
  records on the standing slice; here re-counted on the full pools). Its four conditions (107 (1)) are NOT judged in phase 1.
  PLAUSIBLE: the share class.
- The 13 templates' differential: only T12 (by row) and T13 fall out of this run. T01–T11 and T14 need R5D-0's template patterns,
  which are not in phase 1. NOT RUN.

## Q2: does any OPEN place serve a power with THAT base WITHOUT its source on its roster?

**"Lone"** means that on an open read's served roster, the power P with base B has no source of B beside it. For T13, no other
power holds B. For T12.<row>, no other power's base opens with the row's host line.

**Strict, over every open read:** 2,680 open rival rows, and **0** of them stand without their host on the served roster.
**0** natural rows carry a T12 text. CONFIRMED.

| template | rival x record (desc served) | reads | B served on an open place | **lone** | lone, by a rival (host absent) | lone, by a natural power | ... named as the hidden host itself | ... named otherwise | lone, under the rival's own NAME | that, by a natural power | label |
|---|---|---|---|---|---|---|---|---|---|---|---|
| T12.0 | 44 | 352 | 352 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | CONFIRMED |
| T12.1 | 4 | 32 | 32 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | CONFIRMED |
| T12.3 | 2 | 16 | 16 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | CONFIRMED |
| T12.5 | 8 | 64 | 64 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | CONFIRMED |
| T13 | 255 | 2,040 | 2,040 | 2,000 | 328 | 2,000 | 1,992 | 168 | **80** | **0** | CONFIRMED |
| (T12.4) | 13 | 104 | (no base served) | – | – | – | – | – | – | – | CONFIRMED |

The same split by kind (rival x record / reads / lone / lone under the rival's name): economy 97 / 776 / 752 / 0; magic 39 / 312 /
312 / 0; military 71 / 568 / 104 / 0; noble 24 / 192 / 176 / 0; religious 67 / 536 / 536 / 80; other 14 / 112 / 112 / 0;
government 1 / 8 / 8 / 0. By size: city 152 rival x records (1,216 reads; 24 lone under the rival's name), metropolis 161 (1,288;
56). No smaller place mints a rival. CONFIRMED (`run-full/tables.md`, "Q2 by kind" and "by size").

- **T12 (58 rival x records, 464 reads): NO open place serves a T12 text without a power carrying the row's host line. THE ROSTER
  ITSELF IS THE TELL, whatever the words say:** on these pools, a "second watch" (or a rival bloc or body) with no watch, army,
  committee, body or administration beside it never happens unless something is hidden. CONFIRMED (0 of 464 reads, 0 of 4,856
  open reads).
- **T13 (255 rival x records with a served desc, 2,040 reads): the WORDS alone do not tell.** On 2,000 of 2,040 reads, B stands lone
  on some open place, always on a natural power. On 1,992 of those reads that power is named as the hidden host itself: it is the
  host's own card on another place. On 168 it also appears under another natural name (for example Landed Gentry with Noble
  Families' base, at r5c2-m3-town-8 and r5c2-m3b-town-0). CONFIRMED.
- **T13, the card:** B under the rival's own NAME stands lone on an open place on 80 reads (10 rival x records), and only on 2 open
  places: r3m-metropolis-politically_fractured-1-130 and 1-140, The Clergy Alliance, where the engine rewrote the host's base after
  the mint (so the rival there is "lone" because its host's base moved, not because a host was hidden). No natural power carries
  B under the rival's name lone: 0. CONFIRMED.
- **The rival vocabulary:** 29 rival names. On open rosters, natural rows carry only 3 of them: The Independent Bloc on 34 places
  (an injected stress power), The Highborn Circle on 4, The Peerage on 1. The other 26 never appear as a natural power. CONFIRMED.
  READ: a rival-vocabulary name carrying a host-kind base with no host card beside it occurs on no open place but those 2. The card
  is the tell, as the T12 roster is. PLAUSIBLE (the reader model is my inference from the figures; contestsNiche itself stays
  withheld always, ruling 51).

## Q3: every case form of a withheld power's name in any served string

**The search.** It covers the name of each withheld POWER (the hand-hidden host; act T's taker), in every string leaf of each
served document, keys excluded. It is case-blind, and each hit is listed by its exact form. The forms: the name; its bare form
with the bracketed qualifier dropped; the name without a leading "The"; its singular, where the name is a plural. Each may carry a
leading "the " (the article form) and a plural or possessive ending. The same search runs on the never-there read; a hit with the
same form, path and text there is "also never there".

| Reveal | hits (hiding) | the exact name or bare form | other forms | hiding only | also never there | server = twin; page = import | label |
|---|---|---|---|---|---|---|---|
| off (player view) | 7,008 | **0** (the mask holds the exact form) | 7,008 | **0** | 7,008 (by construction: never-there keeps every string but the deleted rows) | yes (1,752 each) | CONFIRMED |
| DM | 49,324 | 38,308 exact | 11,016 | 6,100 | 43,224 | yes | CONFIRMED |

**Player view, in a served power's DESC: 36 hits.**

| record | the desc of | form and exact text | engine-door reads | class | label |
|---|---|---|---|---|---|
| jp6-city-8 act T (Noble Families, the taker) | The Highborn Circle (T13) | sentence "Noble families" | 4 (server/twin x page/import) | **one of the 8 known** | CONFIRMED |
| jp6-city-8 act T + The Independent Bloc hidden | The Highborn Circle (T13) | sentence "Noble families" | 4 | the same place, a second record | CONFIRMED |
| r5c2-m3-city-4, Craft Guilds hidden | The Commercial Circle (T13) | sentence "Craft guilds" | 4 | **new on the full pool** | CONFIRMED |
| r5c2-m3b-city-21, Craft Guilds hidden | The Guild Alliance (T13) | sentence "Craft guilds" | 4 | new | CONFIRMED |
| r5c2-m3b-city-2, Noble Families hidden | The Highborn Circle (T13) | sentence "Noble families" | 4 | new | CONFIRMED |
| r5c2-m3-city-9, Noble Families hidden | The Peerage (T13) | sentence "Noble families" | 4 | new | CONFIRMED |
| r5c2-m3b-city-37, Noble Families hidden | The Landed Bloc (T13) | sentence "Noble families" ("...with residual feudal claims") | 4 | new | CONFIRMED |
| jp6-city-8 act T (both records) | Royal Authority (the seat, natural) | lower singular "noble family" ("A noble family rules; ...") | 8 | the seat's own label text, a different class | CONFIRMED |

- **The 8 known hits.** jp6-city-8 act T, The Highborn Circle: found, 4 of 4. **r3m-city-none-0-37, The Trade Compact ("Craft
  guilds regulating production...", Craft Guilds hidden): NOT REPRODUCED.** On this tree that place's roster is Merchant Guild
  Council, Merchant Guilds, Religious Authorities, The Merchant Bloc and The Devout Circle. It is the same roster whether the place
  is born alone (the smoke) or 37th of A's full pool, and it holds no Craft Guilds and no The Trade Compact. A's figure came from
  its standing slice, where the place is born 13th, on its own tree. The difference is not chased here. PLAUSIBLE: birth order or
  tree. The class itself appears on 5 places of R5-RECENT's pool (above): **28 hits on 6 places (7 records) in total.**
  CONFIRMED.
- **The rest of the player view** (6,972 hits). These are words of the hidden name inside other served names: a house named in
  sentence case (`institutions[].name` 400, `availableServices.legal[].institution` 676, `economicState.activeChains[].processingInstitutions[]`
  952, `npcs[].institution.key/family` 376 each); "Merchant Guild" inside another power's name (`npcs[].memberships[].power` 2,180); and
  lower case in the compound's house list (400 + 400). Every one also occurs on the never-there read. CONFIRMED (a different class,
  counted, not judged).
- **The DM door.** It serves the stamped row and names it, so the hiding-only exact hits are the DM door's own. The largest
  groups: the stamped row's own `faction` 1,364 (+56 by its article form); `factionRelationships[].pair[]` 1,476 and `.narrative`
  1,456; `stress(ors).cast.stakes[].factionId` 648 + 648; `history.currentTensions[].factions[]` 168; `factionRelationships[].dmNote`
  88. CONFIRMED (counted; the DM door's class).

## Not run, and what a ruling would need

- NOT RUN: the stored today-born pool (item 5c); T01–T11 and T14's differential; 107 (1)'s four conditions on the DM page-desc
  differences (phase 2's share-class arm).
- Q2's T12 answer and the near-tell of T13's card are the figures the chair asked for to rule 107 (3)'s cure. Nothing is cured
  here.
