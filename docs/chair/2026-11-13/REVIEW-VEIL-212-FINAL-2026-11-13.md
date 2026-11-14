**NOT CLEAR** for migration 212 at sha256 `377cc61daf0916fbc769bd34fb5d4383aebf5f630d43f9e0207bb14f937e0733` (rollback `6a642ad048d1a5f6b73a7e9380a8349d05ccf922af016e647735c03068fbc66d`) and for the client's twin, at the lane's tip 6692efdda: two findings HIGH by the law, both executed, both narrow in reach (V7-1, V7-3). THIS IS NOT THE FINAL VERDICT: the chair has ruled that 212's sweep is rebuilt and that a fresh security reader gives the verdict on the final bytes; this file is what that reader stands on (section 8 says what is left). The frozen 211 (`eface6d0…be0b01`) is untouched and, on these findings, may still be applied alone (section 1.7).

# REVIEW-VEIL-7 — migration 212, its rollback and the client's twin (`lane/coherence-veil-2026-11-11`)

Nothing on the lane was changed. Every database was a scratch PostgreSQL 16.15 cluster in this container
(`/var/tmp/rv7`, unix socket only, trust auth, locale C.UTF-8). No hosted database, no production credential, nothing
applied anywhere else. Worktrees, all detached: 6692efdda (the lane's tip as the brief names it), db832c892
(origin/master, for master's stored shape), 60866ee3c (my own branch). One `npm ci`, in the lane's worktree. The probes
are in `probes/REVIEW-VEIL-7/` beside this file; the earlier reader's instruments (`probes/REVIEW-VEIL-6/`) were run
unchanged where a row below names them.

Three things of my own to declare. (1) My permission check refused a fast-forward of the primary checkout, as it
refused the last reader's; I worked in a detached scratch worktree of my branch and push from it plainly. (2) `npm ci`
wrote `core.hooksPath=.husky/_` into the repository's shared local config (husky's install); my review worktree has no
such folder, so no hook ran on my commits and none was skipped by a flag. (3) Fetching master for its generator
created the ref `refs/remotes/origin/master`. Refs and config were otherwise equal before and after each run.

Checksums at 6692efdda, read by me: 211 `eface6d0…be0b01` and its rollback `ce8474ff…49712f` (the frozen pair,
unchanged); 212 `377cc61d…7e0733`; its rollback `6a642ad0…fbc66d`.

Section 1 is the cold pass: written and pushed before PART 8, PART 9 or any commit body of the lane was opened. I had
read the two migrations, the twin (`gallerySecondHomes.js` whole; `galleryVeil.js` and `publicSafe.js` at their
changed lines), the earlier reader's review and probes, and three commit subjects that git printed at the fetch.

## 0. Findings (the cold pass; EXECUTED unless a cell says PLAUSIBLE)

| Id | Rank | What | The read, the town, the bytes that arrive | Which engine |
|---|---|---|---|---|
| **V7-1** | **HIGH** by the law; narrow | **A hidden house whose name has no ASCII letter or digit is sent in its own spelling.** The sweep's prefilter is built from the first `[a-z0-9]+` run of each folded name; such a name folds to nothing, so the string is never shown to the exact compare. | `hand/town-b.json` (house "Гильдия теней", Criminal, hidden whole), 001..212 and 203+211+212, link, gallery, import, reveal off and on: `economicState.situationDesc` = "The Гильдия теней taxes every stall on the quay."; `primaryExports[1]` = "Гильдия теней contraband". Reveal-DM reads also send `npcs[0].goal.short` = "Rule the гильдия теней" | the SERVER sends both exact strings; the TWIN removes them (it has no prefilter) and is right. BOTH send the lower-cased form (the fold makes every non-ASCII letter a separator) |
| **V7-3** | **HIGH** by the law; narrow; in the frozen 211's rule and the twin alike | **A house hidden whole that is in the hideable class by a declared facet or as an illegal brokerage alone is not removed.** The `function` eye (shut by the default veil with the card) strips `tags`, `facets`, `serviceKeys`; the removal then tests the class again on the trimmed card. | `hand/town-d.json` ({"name":"Hidden shrine of the Drowned","category":"Religious","tags":["facet:clandestine:clandestine"]}, hidden by hand and by default), link, gallery, import: on **001..211** `institutions[]` holds `{"name":"Hidden shrine of the Drowned","category":"Religious"}`; on **001..212** it holds `{"category":"Religious"}` (the sweep takes the name; a nameless record and its category stay) | both engines, 0 paths differ. Not on my 48 born towns (every house of the class is in it by category; 0 stubs in 384 link reads): custom content and edited houses |
| V7-2 | MEDIUM | **The text cures match a hidden sentence word for word**, so a source edited after the birth leaves its birth wording in the second home. | Hartdorf (born, new shape), link: the event's lasting effect as stored + 9 characters, its eye shut: the legacy annotation is sent, "…What it left behind (iron production rights still legally contested in some records) is still part of the place."; the same row unedited: withheld. 24 new-shape towns with " (as amended)" appended to the hidden sources: `history.siegeNarrative`, withheld as stored, is sent again in 5; the annotation in 23 (`out/edited-after-birth-ct212.txt`). `prominentRelationship.full` and `.tension` hold (they go by the tie's identity). On a hand row (`hand/town-e.json`, each source amended by a few words): the annotation, the siege narrative, `prominentRelationship.phrasing`, `pressureSentence` and the impression are all sent, and the unamended control annotation is withheld | both (same rule). Whether the editor recomposes a second home on an edit I did not trace |
| V7-4 | MEDIUM | **Forms of a hidden name the fold and the sweep do not reach**: a KEY; an `id` beside a `name`, and the joins `from` / `to`; a camel-cased or squeezed spelling; the name without its bracketed qualifier; a plural. | Born towns, Reveal-DM gallery read and import, 2 towns a shape with "Black market" hidden whole (Vatannuur, Khutulunkum): `simulationTrace[].downstreamEffects[].target` = "blackMarket". `hand/town-a.json`, link: `activeChains[0].institutionLoad` key "Thieves' guild (powerful)"; `links[0].from` = "institution.thieves_guild_powerful"; `offers[].id` = "thieves_guild_powerful.fence" (its `name` swept, its `id` kept); `npcs[0].title` = "Voice of the ThievesGuildPowerful"; `primaryExports` "thievesguildpowerful ledgers"; `situationDesc` "…the thieves' guilds of the coast…". `hand/town-d.json` (the two criminal groupings opened by exception, the house hidden): `incomeSources[0].source` = "Thieves' Guild Revenue" with its 19% sentence, `situationDesc` = "The Thieves' Guild sets the price of everything." | both, equal. The key, id and join rows are hand rows: no born town of 48 carries one |
| V7-5 | MEDIUM until the ruled cure lands | **A renamed hidden house's birth name** stays in the two derived lists and the trace. | `hand/town-a.json` (born "Smuggling network", now "The Velvet Hand", hidden): link `compound.inst.names` holds "smuggling network"; Reveal-DM gallery `simulationTrace[0].targetId` = "institution.smuggling_network", cause "smuggling network absorbed rivals" | both. The chair has ruled the positive account; not in these bytes |
| V7-6 | MEDIUM (availability) | **The sweep costs strings × hidden names.** | `hand/deep-cost.sql`, gallery read as anon of one stored row of about 300 KB (600 houses hidden whole, 10,000 short strings that pass the prefilter): 1,081 ms on 001..211, **32,611 ms** on 001..212; 200 × 5,000: 302 → 5,644 ms; 50 × 2,000: 69 → 605 ms | server. A reader's statement time limit bounds one call; the row is the sharer's own |
| V7-7 | LOW | **The sweep takes what is not hidden**: its exact compare has no open-name exception and no word boundary; an open name EQUAL in fold is not excepted. | `hand/town-a.json`: "Black market" hidden, "Black market bazaar" opened by exception: the open house is sent as `{"category":"Criminal"}`; the shown power "Assassins' Guild" (house "Assassins' guild" hidden) is sent as `{"desc":…,"power":10}`, its `faction` gone; the person "Black market broker" loses `name` and keeps `id` "npc.black_market_broker". On the 48 born towns the sweep takes ONE string in 768 reads (Vatannuur, `economicState.situationDesc` = "Honest trade gets by, but a busy black market undercuts it."), which names the hidden house: nothing is over-removed there | both, equal |
| V7-8 | LOW | **A boolean outside the five that only a hidden house raises.** | `hand/town-d.json`, link: `compound.inst.hasGuild: true`, `hasChurch: true`, `names: ["fish market"]`. On 48 born towns, by the engine's own `getInstFlags` over the listed houses: 0 flags of any name sent true that the listed houses do not raise, 0 list entries unaccounted (408 link reads) | both |
| V7-9 | LOW | **Two names the sweep never learns**: a name with U+0130 (the server sends "i̇stanbul den" lower-cased in the list and in an export, the twin removes both: the engines' lower-casing differs); a house with a `label` and no `name` (hidden whole by its id, its label then sent in a role, an export and the list: both engines). | `hand/town-c.json`, Reveal-DM gallery | as said |
| V7-10 | LOW | **A deep document under Reveal DM**: 3,000 arrays deep with one house hidden whole, the gallery read: 32 ms on 001..211, `stack depth limit exceeded` on 001..212 (the sweep calls itself once a level; 1,000 deep: 23 → 418 ms). Fails closed. With no reveal both chains raise alike from 450 deep. | `hand/deep-cost.sql -v dm=true` | server; the second review's R4 class |
| V7-11 | NOTE, PLAUSIBLE (read, not run) | Twin differences that withhold MORE on one side: the twin's sweep keeps an `id` only while `name` is still in the record when the walk reaches it (insertion order), the server always; the tie-role rule reads a number id on the server, a string id only in the twin. | | |

What I would tell the builder first: V7-1 and V7-3 are each a few lines (do not prefilter away a name with an empty
fold, and fold with letters of every script kept, the same class in both engines; remove a house by its id alone,
`gone_ids` being decided before the eyes run).

## 1. The cold pass

### 1.1 What 212 is, read as its output

Fourteen new helpers, five restated functions, one closing loop that revokes execute on every `_gallery_veil*`
function from `public`, `anon` and `authenticated`. On the chain 001..212, from the catalogue: 54 `_gallery_veil*`
helpers; 0 executable by a reader role; 0 `security definer`; 54 `immutable`; none sets a search_path, and each is
called only from a read that is `security definer` with `search_path = public, pg_temp`, every callee written
`public.…` (no unqualified call in the file). The one dynamic statement is the revoke loop, over
`oid::regprocedure` (quoted by the type). No name ever reaches a `LIKE`, and the one regular expression built at run
time (the prefilter) is made of `[a-z0-9]+` runs only: a name with `%`, `_`, `'`, `(`, `[`, `.*` was executed
(`town-a`, "100% Pure_Gold (O'Malley's) [.*]": gone from the list and from a role in every spelling planted).

No error path returns the unveiled document. `coalesce(vl.v -> 'body', proj.d)` falls back to the unveiled projection
only where the resolver returns NULL, which is 211's reviewed rule for an unmarked listing; a helper that raises fails
the read (V7-10), and a NULL body would be sent as JSON null, not as the projection.

What a reader receives, by rule: a house hidden whole leaves `institutions[]` (but see V7-3), the defence lists, the
chains, the trace entries that name it; the two derived lists lose an entry whose FOLD equals a hidden name's; five
booleans go false where no listed house raises them; an income row or a sentence that names it goes; then the sweep
walks every object and array of the document and drops every string that holds a hidden name, as written or folded
between word boundaries, outside an open house's or a shown power's longer name. A key is never looked at. The sweep
keeps `from`, `to`, `npc1Id`, `npc2Id`, an `id` beside a `name`, and the town's own `name`.

### 1.2 Born towns: the earlier reader's instruments, unchanged, at these bytes

`cold.probe.jsx` (its planted markers, every eye shut by hand, reveal off and on, live, frozen, narrated, and the
per-person switch alone), 24 towns a shape, 192 shares a shape, eight reads each (gallery, link, map, the map's link,
both imports, the card, more-by-creator).

| | the new shape on 001..212 | master's shape on 203 + 211 + 212 |
|---|---|---|
| reads / raised / births that threw | 1,536 / 0 / 0 | 1,536 / 0 / 0 |
| a marker in a list that takes no slug | 0 | 0 |
| marker rows that arrive | the earlier review's classes A (notes on a house, a power, the tabs; Reveal DM only), B (one structural-issues row restated by the viability block), C (the receipt's copies of open strings), D (two people drawing one phrase): nothing new | A, B, C: nothing new |
| a hidden house's name in any form (`names-anyform.mjs`: every string and KEY, folded and squeezed) | the two schema keys (`hasBlackMarket`, `arcaneBlackMarket`) and **the trace's `target: "blackMarket"`** on Reveal-DM reads, 2 towns (V7-4); the lower-cased list entries, the `targetId`, the roles and the income labels of the last review are gone | (running as this is written; step 2 has it) |
| hidden text in any case (`text-anyform.mjs`) | the legacy annotation in 23 towns, which is the instrument's own marker acting as a later edit (V7-2, with its control); a goal's inner reference to an open person's id; class D | |
| a role or title the person's own card withholds, anywhere else (`roles-census.mjs`, mine) | 0 copies for 1,300 (person, read) pairs | master's cards keep the role: 0 pairs |
| a `has…` flag sent true that the listed houses do not raise (`flags-census.mjs`, mine, by the engine's own `getInstFlags`) | 0 | 0 |
| a house of the class still listed, or a record with no name (`born/stub-census.sql`) | 0 of 192 link reads | 0 of 192 |
| strings the sweep takes (`born/sweep-removes.mjs`: the same rows read with the sweep and with it made a no-op) | 1 string, 15 reads, 1 town | 0 |

So on towns as the generator bears them, 212 sends none of the twelfth's and the thirteenth's forms that the last
review listed, and takes nothing it should keep. Every finding above but V7-2 and the trace row of V7-4 comes from a
row written by hand against the rule as read.

### 1.3 The hand rows (`hand/`), each stored three times (no veil record; the veil; the veil with Reveal DM) and read by gallery, link and import

| The plant | Server (001..212) | Twin | |
|---|---|---|---|
| a name with `%`, `_`, `'`, `(`, `[.*]` | every spelling gone | equal | holds |
| a name inside a string that is itself JSON; inside an array inside an array | the string goes whole; the inner entry goes | equal | holds |
| an empty name | nothing to send; the house leaves by its id | equal | holds |
| "Black market" hidden, "Black market bazaar" open (and the reverse is the earlier reader's eleventh, which holds) | the list keeps "black market bazaar"; the open house loses its own name | equal | V7-7 |
| a renamed hidden house | its birth name in the list and the trace | equal | V7-5 |
| a name in a key, an id, a join, camel case, plural, without its qualifier | sent | equal | V7-4 |
| a shown power named as a hidden house is | its name taken | equal | V7-7 |
| a name with no ASCII letter | sent as written | removed as written; lower-cased form sent by both | V7-1 |
| U+212A (Kelvin) and U+0130 in a name | the first folds as the twin's; the second is sent lower-cased | removed | V7-9 |
| a house with a label and no name | its label sent | equal | V7-9 |
| a clandestine house by facet, a Religious category | listed still | equal | V7-3 |
| booleans: the five | false where only a hidden house raised them; true kept where an open house raises it | equal | hold |
| booleans: `hasGuild`, `hasChurch` | true | equal | V7-8 |
| the criminal income row, its groupings shut (the default) | withheld whole | equal | holds |
| … its groupings opened by exception, the house hidden | sent, label and sentence | equal | V7-4 |

The twin against the server on these rows (`twin.probe.jsx`, `jdiff.mjs`): 0 paths differ on `town-a` and `town-d`
(base, veil and Reveal DM); 2 on `town-b` (V7-1) and 5 on `town-c` (V7-9), the twin withholding more each time.

### 1.4 What a reader can infer from what is absent

A record with no name in `institutions[]` (V7-3: one more house exists, and its category); an open house or a shown
power with no name (V7-7); a boolean with no house to explain it (V7-8); `compound.inst.names` shorter than the town's
other counts suggest is not readable as such (the list is the engine's working state and is compared with nothing on
the page). I found no count that moves with a hidden house on the born towns beyond the earlier review's section 2.5.

### 1.5 The chair's line, as I would draw it cold (each row the owner may veto)

- Agreed as drawn: (a) to (d); the stability label, the quarter's description, the export, the tension's type and a
  shown power stay outside.
- I would draw (b) wider: every `has…` boolean of the two `inst` records by the same positive account as the lists
  (V7-8), since the table of five is a copy that the next catalogue row can outrun.
- I would draw (a) to include a join or an id that spells a hidden house (`institution.<snake>` as `from`, `to` or a
  trace effect's `target`) and a key; and I would ask for a ruling on the engine's own word `blackMarket` as a trace
  effect's target where the house "Black market" is hidden (V7-4): it is the house's name in camel case and it is also
  the engine's name for a quantity.
- The name without its bracketed qualifier ("Thieves' Guild" for "Thieves' guild (powerful)") is, to a reader, the
  name. With the two groupings shut it does not arrive; with them opened by hand it does (V7-4). For a ruling.

### 1.6 What the cold pass did not do

The lane's own account (PART 8, PART 9), its guards and its pack were not opened. 211 alone was run on two hand rows
only (step 3 has its planted run). No rollback was run, no catalogue diffed (step 3). Timing on born towns was not
taken (V7-6 is a constructed worst case). The page, the PDF and the exports were not drawn. Towns advanced by the
world pulse or edited in the product's editor were not stored: V7-2's edit is mine, made in SQL.

## 1.7 Asked by the chair after the cold pass: does the FROZEN 211, applied alone, make V7-1 or V7-3 worse than today?

**No, by run.** Today is a chain at 203 (no server veil) under the deployed client (origin/master, db832c892), whose
own veil cuts the page. Chains: `t203` (001..203) against `p211` (203 + the frozen 211). The four hand towns, each
stored three times, read by gallery, link and import on both chains (`subset.mjs`); then the deployed client's page
model built from each chain's gallery read exactly as master's `src/lib/gallery.js` builds it (`deployed.probe.jsx`).

| | 203 (today) | 203 + 211 alone |
|---|---|---|
| on the wire: strings or keys that 211 sends and 203 does not, over 36 (town, share, read) responses | | **0 in each of the 36** |
| the deployed page model: strings or keys it holds with 211 and not without, over 12 shares | | **0 in each of the 12** |
| V7-1, `town-b`: the hidden name in the response (as written or lower-cased), veil / Reveal DM | 4 / 6 | 3 / 4 |
| … in the deployed page model | 3 / 4 | 3 / 4 (the same strings) |
| V7-3, `town-d`: houses the response lists | Thieves' guild (powerful), Hidden shrine of the Drowned, Fish market | Hidden shrine of the Drowned, Fish market |
| … houses the deployed page model lists | Hidden shrine of the Drowned, Fish market | the same |

The deployed client carries V7-3's rule already (`galleryVeil.js`, the same re-test after the eyes) and has no name
sweep, so its page shows both today; 211 alone takes strings off the wire and puts none on the page. On these two
findings the earlier review's sentence stands: 211 alone makes nothing worse. Limits: four hand rows; the page MODEL,
not a browser.

## 2. The plant library, as one command (the chair's narrowed list, item 1)

`sh probes/REVIEW-VEIL-7/run-all.sh <worktree of the bytes under test> [outdir]` — **60 seconds** on four cores at
6692efdda (`npm ci` done in that worktree; a local scratch cluster; `out/run-all-at-6692efdda.txt` is its print).
It builds 001..212 and 001..211 from the worktree's own migrations, stores the five hand towns three times each (no
veil record, the veil, the veil with Reveal DM), reads each by gallery, link and import, runs the client's twin over
the same rows, and prints one line a check from `hand/expected.json`: PASS or FAIL, with the first bytes that arrived.
Exit 0 only when every check passes. **At 6692efdda: 37 checks, 17 pass, 20 fail; server and twin differ on 4 of 15
shares (towns b and c); the deep document and both large rows fail.** A FAIL is red by design today; the table is the
expected state for the final bytes.

| Checks | The form | Town | Must not arrive | Must still arrive |
|---|---|---|---|---|
| a01 to a04 | a key; a join (`from`); an id beside a name; camel case and a squeezed spelling | a | "Thieves' guild (powerful)" in any spelling at those paths | |
| a05, a09, a11 | nested arrays, a string that is JSON, the derived list; a name with `% _ ' ( [ . *` | a | the name, any spelling | (pass today) |
| a06, d04 | the name without its bracketed qualifier; a plural | a, d | "Thieves' guild" / "Thieves' Guild", any spelling but the schema key | |
| a07 | a renamed house | a | "smuggling network" (the list, the trace's target and cause) | |
| a08, a12 | a hidden name that is a substring of an open house's | a | "Black market" outside "…bazaar" | the open house's own `name` "Black market bazaar" |
| a13 | a shown power named as a hidden house is | a | | the power's `faction` "Assassins' Guild" |
| a14, a16, a17, b02, c04, d07, e07 | what is open | all | | "Fish market" on its card, in the list, the chain and a nested entry; "Market Taxes"; an open person's goal and an open house's trace entry on Reveal DM; `hasMarket`, and `hasBlackMarket` / `hasCriminalInst` where an open house raises them |
| a15, d05 | the five booleans | a, d | true where only a hidden house raised it | |
| d06 | a boolean outside the five (for a ruling) | d | `hasGuild`, `hasChurch` true | |
| a10, b01 | a name in another script (beside others; alone) | a, b | "Гильдия теней" as written and lower-cased | |
| c01, c02, c03 | U+212A; U+0130; a label with no name | c | the name in any case | every listed house has a name |
| d01 to d03 | a house in the class by facet alone | d | its name (the unmarked link too); a record with no name; a second record | exactly one house listed |
| e01 | a hidden lasting effect in the legacy annotation, source as born (the control) | e | the clause | (pass today) |
| e02 to e06 | the same and four more homes, source amended after the birth | e | the birth wording in the annotation, the siege narrative, `phrasing`, `pressureSentence`, the impression | the events' names, the people |
| V7-10 | a document 3,000 deep, Reveal DM | (`hand/deep-cost.sql`) | an error where 211 alone serves | |
| V7-6 | 200 × 5,000 and 600 × 10,000 (hidden houses × strings that pass the prefilter) | | more than three times 211's time on the same row (today 17 and 29 times) | every string back |

**The born towns** are `born/run-born.sh <worktree> <master's worktree>`: the earlier reader's planted run in both
shapes (24 towns and 192 shares a shape, eight reads each, reveal off and on, live, frozen, narrated) and every census
of section 1.2, with the expected green written in its header. About 75 minutes on four cores. I ran and timed each of
its parts apart at these bytes; the one file that strings them together was not run end to end. What it printed at
6692efdda is section 1.2 and `out/`.

## 3. The split at the present bytes (item 2)

- **The frozen 211 is the reviewed file**: sha256 `eface6d0…be0b01`, rollback `ce8474ff…49712f`, both as the
  earlier review recorded them at 333b33973. Run alone here: on 203 + 211, 36 responses of the hand towns are each a
  strict subset of 203's (section 1.7), and 001..211 serves the deep and large rows of section 2 as the table shows.
- **212 over the frozen 211, and its rollback** (`../REVIEW-VEIL-6/split/rollback212.sh`, each file as `begin;` +
  the file + `commit;`; `out/rollback212-at-6692efdda.txt`):

| | full chain | 203 + 211 + 212 |
|---|---|---|
| 212's down file, against the frozen 211's chain | **0** of 2,842 lines | **0** of 2,839 |
| the down file a second time | 0 | 0 |
| then 212 again; 212 a second time over itself | 0; 0 | 0; 0 |
| `begin; 212; commit;` by hand on 203 + 211, against the chain built file by file | | 0 |
| 212 on a chain at 203 without 211 | | fails on its first statement; 0 lines changed |
| 211's down file while 212 is applied | | applies; 50 lines differ (212's helpers left behind): the order is 212's rollback FIRST |
| both rollbacks in order, then 203's party-link read, against a chain at 203 | | 0 |

  The catalogue is every function's body, arguments, volatility, definer, settings, owner and ACL, and the relations',
  as the earlier reader's `catalog2.sql` prints them. On 001..212: 54 `_gallery_veil*` helpers, 0 callable by a
  reader role, 0 definer, 54 immutable; the six reads `security definer` with `search_path=public, pg_temp`.
- Not repeated here: readers in flight during an apply or a rollback; the release order (204..210 after the early
  step); the equality of the responses, share by share, against the lane's earlier single file.

## 7. FOR THE OWNER (as far as it can be written on 2026-11-14; nothing here was run against a hosted database)

**Where things stand.** There are two files. Migration 211 is frozen and reviewed, and you hold its pack. Migration
212 is still being built. **Do not apply 212 as it stands today** (the file whose checksum begins `377cc61d`); the
reasons are below. Nobody applies 212 until a security reader says CLEAR on its final checksum.

**What 211 alone does.** When you share a town, the server itself stops sending what you (or the default veil) hid,
at the place the page reads it: a hidden house's card, a hidden field of a person, an event, a power or a
relationship, the hidden groupings. Before 211 the server sends everything and only the page hides it.

**What 211 alone does not close** (each is also true today, without it):
- copies of a hidden fact kept elsewhere in the town: a hidden relationship's words in the "most notable
  relationship" and the pressure line, a hidden tension inside the siege history, a hidden event's lasting effect in
  the legacy note, a hidden house's name in the economy's chains, lists, income labels and simulation notes;
- a house hidden whole that is "clandestine" only by a declared tag and not by a Criminal category (custom content):
  it stays listed by name (V7-3);
- the public chronicle, and the notes on a Reveal-DM share (the earlier reviews).

**May 211 be applied now? Yes.** I checked the two new serious findings against it by run (section 1.7): with 211
alone the server sends strictly less than it sends today in every response I compared (36 of 36), and the page your
deployed site would draw holds nothing it does not hold today (12 of 12 shares). 211 makes neither worse. Limits: four
towns written by hand; the page's data, not a browser. Its own step and rollback are in its own review (section 7 of
REVIEW-VEIL-211-333b33973).

**What 212 is meant to add.** It withholds the copies listed above, the author's custom-content library on a
Reveal-DM share, a switched-off person inside a power's member list, a hidden house's name wherever else it is
written, and the five "has a criminal house" flags where only a hidden house raised them.

**Why 212 is not to be applied as it stands.**
1. It still sends a hidden house's name, exactly as you wrote it, when the name has no English letter or digit (a
   name in Cyrillic, Greek, Chinese…) (V7-1).
2. A tagged-clandestine house hidden whole is left in the list as a nameless entry showing its category (V7-3).
3. If you edit a hidden sentence after the town was generated, the older wording kept elsewhere is still sent (V7-2).
4. It can take away things you did NOT hide: an open house whose name contains a hidden house's name loses its own
   name on the page, and so does a shown power with the same name as a hidden house (V7-7).
5. On a very large or very deep town of a sharer's own making it is up to thirty times slower than 211, or fails
   where 211 answers (V7-6, V7-10).
6. The builder is rebuilding the part that causes 1, 4 and 5. Applying today's file would mean applying twice.
None of these makes a reader see MORE than with 211 alone; 212 as it stands is incomplete and in places heavy-handed,
not harmful to secrecy. On towns as the generator makes them (48 towns, 3,072 reads) it behaved correctly.

**The order, when 212 is cleared.** 211 first (its pack). Then 212, once, as one transaction: if any statement fails
nothing changes; run twice it changes nothing (rehearsed). To undo: 212's rollback FIRST, then 211's; never 211's
rollback while 212 is applied (rehearsed: it leaves 212's helpers behind and the site reads as before 211). Each
leaves the catalogue exactly as it was (0 lines differ). No table, row or policy is touched by either file.

**What to look at before and after** will be the final reader's section 7 at the final checksum; the earlier review's
section 7.2 to 7.5 (the read-first, the check-after, the visitor's walk) is the shape it will take.

## 8. What the fresh reader must do that I did not, and what I would tell the builder first

**Not done here** (my step 4, and parts of 2 and 3):
- PART 9 and PART 8 were never opened: each home's claimed cure and proof by the reader's own run; the rows the lane
  leaves outside the law, each judged; its three limits (the rename, the fold, the booleans' table) against the
  chair's rulings; the chair's line row by row at the final bytes (my cold view of it is section 1.5).
- The lane's guards under planted faults (the earlier reader's `faults/plant.py`); the lane's owner pack for 212.
- The born-town run and every census again at the final bytes (`born/run-born.sh`); master's shape through the
  any-form name search (still running when this was written; its other censuses are in section 1.2).
- Timing on born towns (211 alone against 212 on the heaviest stored share); readers in flight; the release order.
- The page, the PDF, the exports, the map's inspector; a town advanced by the world pulse or edited in the editor.
- A hidden PERSON's or EVENT's plants beyond what section 1.2 and `town-e` hold: only a house can be hidden whole
  (211's grammar), so a person or an event is hidden field by field and its name stays by design.

**For the builder, before the sweep is rewritten** (shapes, not bytes):
1. **Decide once what is gone, before anything is trimmed, and remove by identity.** The set of houses removed whole
   (ids and names) is fixed before the eyes run; the list is filtered by id alone (V7-3); every structured reference
   goes by that set: a join, a `targetId`, an `institution.<snake>` value, a key equal to a name (V7-4).
2. **Positive account wherever the record allows it** (ruled for the two lists): the lists and EVERY `has…` flag as
   the listed houses give them (V7-5, V7-8); a second home by its source's identity, not its words (V7-2).
3. **Free text: one test a string, not one a name.** Today each string that passes the prefilter is tested against
   each hidden name with two regular-expression folds and a loop over the open names: strings × names (V7-6). Fold a
   string ONCE and test it against ONE alternation built from every hidden name's folded form; and ask the question
   first of the document's text as a whole (as 211's hook walk does), so that a town where nothing matches (47 of my
   48) is not walked at all. Then the cost is the document's length, whatever a sharer stores.
4. **Walk without calling yourself once a level** (V7-10): 211's `_gallery_veil_drop_hooks` already has the shape
   (only the nodes on the way to a hit are rebuilt, by a recursive query; a text pass past 64 levels).
5. **One fold, the same in both engines, for every script** (V7-1, V7-9): letters and digits of any script kept; no
   reliance on `lower()` and `toLowerCase()` agreeing outside ASCII (U+0130 differs today). A prefilter is a proven
   superset or is not there. Give the exact compare the same open-name exception and word boundary as the folded one,
   or drop it once the fold covers every script (V7-7).
6. **A card's own name is its floor**: an open house, a shown power or a person is never left without its `name` by
   the sweep; whether a PERSON whose own name contains a hidden house's name loses it is a row for the chair.
7. **Keys as well as values**; the name without its bracketed qualifier and the engine's processor name as forms of
   the name (the earlier review's 2.4); the engine's word `blackMarket` in a trace effect for a ruling.
8. Run `run-all.sh` red first: 20 of its 37 checks and its three timed rows are red at 6692efdda.
