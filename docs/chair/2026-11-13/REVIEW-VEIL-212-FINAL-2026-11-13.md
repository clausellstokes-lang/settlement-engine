VERDICT SO FAR (the cold pass only, at the lane's tip 6692efdda; the final verdict waits for the tip the chair names): **NOT CLEAR** for migration 212 at sha256 `377cc61daf0916fbc769bd34fb5d4383aebf5f630d43f9e0207bb14f937e0733` (rollback `6a642ad048d1a5f6b73a7e9380a8349d05ccf922af016e647735c03068fbc66d`) and for the client's twin: two findings HIGH by the law, both executed, both narrow in reach, both curable in 212 and the twin (V7-1, V7-3)

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
| V7-2 | MEDIUM | **The text cures match a hidden sentence word for word**, so a source edited after the birth leaves its birth wording in the second home. | Hartdorf (born, new shape), link: the event's lasting effect as stored + 9 characters, its eye shut: the legacy annotation is sent, "…What it left behind (iron production rights still legally contested in some records) is still part of the place."; the same row unedited: withheld. 24 new-shape towns with " (as amended)" appended to the hidden sources: `history.siegeNarrative`, withheld as stored, is sent again in 5; the annotation in 23 (`out/edited-after-birth-ct212.txt`). `prominentRelationship.full` and `.tension` hold (they go by the tie's identity) | both (same rule). Whether the editor recomposes a second home on an edit I did not trace |
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
