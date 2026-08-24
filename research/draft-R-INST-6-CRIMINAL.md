# R-INST-6 — CRIMINAL AND UNDERGROUND INSTITUTIONS AND THEIR FRONTS (DW program P1b, tranche 6: the undercity seam)

**MARK: [OPUS-RUN · FABLE-VALIDATION OWED]** (owner directive ODQ §484). Written by lane
TC-R-INST-6 running SOLO on `claude-opus-5[1m]` from 2026-08-23T18:10:45Z; the program's lane
cap is TWO and a sub-lane counts, so this dossier used NO Agent, Workflow or sub-agent call of
any kind — every search, fetch, figure and simulation below was issued by the one lane and is
logged in the APPENDIX. **Owner taste-gates this dossier (the CT-0 pattern); nothing here is
grammar yet.** The status map at §0.3 is the truth of what is at depth and §L is the numbered
ledger of what is not. This is the LAST of the six research tranches: §M closes with the
RESEARCH-COMPLETE statement DW-0 starts from.

**Lane.** Read-only on the repo; scratchpad-only deliverable; the receipt
`laneTCRINST6-receipt.md` holds the round-by-round log and the resume points. The dossier is
regenerated only by `RINST6-merge/assemble.sh` over `head.md` + `sec-*.md` — it is never
hand-edited (the R-INST-4 / R-INST-5 method). Charter: `docs/DESIGN_DWELLINGS_PROGRAM.md` §2
(the nine laws), §3 (the thirteen-system weave), §4 S6 (circulation classes ODQ §452; storage
and service classes ODQ §453), §5 (data contracts), §8 (the corpus program — R-INST-6 is named
there as "criminal/underground fronts (the undercity seam)"), §13 (anti-scope), §15 P1a-P1d,
§16 (the integration carry-notes, of which carry-note 1 is THIS tranche's seam); ODQ §435-§438,
§441 (the undercity charter ruling), §452, §453, §456, §482, §484, §485, §488, §490. The
undercity charter `draft-UNDERCITY-PLAN.md` §§UC-0..UC-5 is read as the ENGINE CONTRACT this
tranche describes against. Sibling dossiers read for boundaries and hand-offs:
`draft-R-INST-1-CIVIC-DEFENSE.md` (the enforcement counterpart),
`draft-R-INST-2-TRADE-CRAFTS.md` (the shop-house, the warehouse, the counting house),
`draft-R-INST-3-FAITH-LEARNING.md`, `draft-R-INST-4-HOSPITALITY-POVERTY-UTILITY.md` (the vice
rows and the lodging ladder), `draft-R-INST-5-MAGICAL.md` (the style and depth template, and
the five §488.2 findings this tranche tests) and `draft-R-INST-CIRC-ADDENDUM.md`.

**THE FOUR DISCIPLINES THAT BIND THIS TRANCHE.**
(1) **CLINICAL, NEVER MORAL.** The deity doctrine transposed (memory
`deity-doctrine-no-premade-pool.md`): faith is treated as culture and never as theology, and
crime is treated here as a PRACTICE WITH A BUILDING PROGRAM and never as a moral essay. The
trafficking, kidnapping, slave-market and brothel rows are handled exactly as the granary and
the tannery are handled — as building types with functions, fixtures, thresholds and hazards.
No sentence in this dossier characterises a person; the product-scope law forbids a NAMED
character's fate and this dossier names no fate at all.
(2) **CONVENTIONS, NEVER EXPRESSION.** Where the historical record is thin and the genre
expectation is thick — the thieves' guild above all — the genre expectation is reported AS a
convention, cited as one convention among several, with no protected text, name, creature or
setting copied. The §488.3 boundary (a named proprietary setting reached shipped prose) is
live: this dossier names no commercial setting as a source of truth.
(3) **FINITE SEMANTICS.** Every finding lands as typed closed vocabulary — parti ids, function
names, fixture kinds, structural buckets, licensing fields — and the criminal-share dial in
(f) is proposed as a CLOSED ENUM, never a float. The clerk composes; the research never writes
a probability. `EUROPEAN_FANTASY_BASE` governs: every cited building is a BOUNDED POSSIBILITY
or a COUNTEREXAMPLE, never a prevalence prior. **This dossier mints no probabilities.**
(4) **ONE TRUTH WITH THE ENGINE.** Where the landed undercity leaves already derive a fact,
this dossier describes AGAINST that fact and never re-derives it. The criminal share has
exactly one home (`corruption.js:539-542`, read through `readCorruptionClimate`); the front has
exactly one home (`colonization.js`'s `frontFor`); the smuggler cellar and the smugglers'
tunnel are two DIFFERENT engine rows with two different licences and this dossier keeps them
apart. §Σ's UC SEAM TABLE is the join sheet.

**EPISTEMIC LABELS, used on every load-bearing claim.** **CONFIRMED** = this lane opened the
page or the PDF this session; the URL is inline and the words "fetched 2026-08-23" appear.
**CONFIRMED-digest** = the claim came back inside a search-engine digest quoting the page; the
page itself was not opened. **PLAUSIBLE** = this lane's synthesis or training knowledge, given
as a RANGE, never as a bare precise figure. **CONVENTION** = a genre expectation, cited as one
convention among several. **GATED** = a Cloudflare or 403 interstitial; per the lane's budget
rule a GATED response is not a fetch and nothing behind it is quotable as primary.
**PLAUSIBLE-by-simulation** = a statement about live engine behaviour produced by running the
engine's own tables in a standalone script over the roster's names (`RINST6-facetsim.mjs`),
which is stronger than reasoning and weaker than executing the real module in the real tree.
Dates are absolute. Protected prose is never copied beyond a short attributed phrase.

---

## §0 · THE ENUMERATED ROSTER (printed before research; grep-complete over all six tier blocks)

### §0.1 · The Criminal shelf, entry by entry, re-verified at its catalog line

The roster below was seeded from the flat table `RINST2-catalog-flat.tsv` and then **every
line number was re-read in `src/data/institutionalCatalog.js` at the clean tree
`chair-baseproof-b10ed1a1`** (`sed -n "${L}p"`, 28 of 28 lines printed and matched — the
verification transcript is in the receipt). The shelf blocks were located by structural grep
(`^    [A-Z][A-Za-z ]*: {`) so no tier's Criminal block could be missed: thorp L58, hamlet
L334, village L857, town L1416, city L1932, metropolis L2365.

| # | tier | line | name | tags | priorityCategory | baseChance | notes |
|---|---|---|---|---|---|---|---|
| 1 | thorp | L59 | `Local fence` | criminal | criminal | 0.10 | |
| 2 | thorp | L66 | `Outlaw shelter` | criminal | criminal | 0.08 | |
| 3 | hamlet | L335 | `Fence (word of mouth)` | criminal | criminal | 0.12 | |
| 4 | hamlet | L342 | `Bandit affiliate` | criminal | criminal | 0.10 | |
| 5 | hamlet | L349 | `Smuggling waypoint` | criminal | criminal | 0.09 | |
| 6 | village | L858 | `Fence (word of mouth)` | criminal, economy | criminal | 0.15 | the brief's roster spelled this "Fence"; the catalog's own key is `Fence (word of mouth)` at BOTH hamlet and village |
| 7 | village | L865 | `Smuggling network` | criminal, trade | criminal | 0.10 | carries `minTier: 'city'` while authored in the VILLAGE block — see §0.2's defect note |
| 8 | village | L880 | `Underground network` | criminal, smuggling, underground | criminal | 0.08 | `facets: { clandestine, subterranean }`; `forbiddenResources: ['marshlands','fertile_floodplain']` |
| 9 | town | L1417 | `Street gang` | criminal | criminal | 0.55 | |
| 10 | town | L1424 | `Smuggling operation` | criminal, smuggling | criminal | 0.45 | |
| 11 | town | L1431 | `Front businesses` | criminal | criminal | 0.45 | |
| 12 | town | L1440 | `Underground network` | criminal, smuggling, underground | criminal | 0.15 | same facets + forbiddances |
| 13 | town | L1454 | `Rookery` | criminal, information, brokerage | criminal | 0.16 | `serviceKeys: ['info_calibration','info_query']` — **a LOFT OF MESSAGE BIRDS, not a slum**; see §0.2 |
| 14 | city | L1933 | `Thieves' guild chapter` | criminal | criminal | 0.60 | `exclusiveGroup: 'criminalPower'` |
| 15 | city | L1941 | `Multiple criminal factions` | criminal | criminal | 0.50 | `exclusiveGroup: 'criminalPower'` |
| 16 | city | L1949 | `Black market` | criminal, underground | criminal | 0.60 | |
| 17 | city | L1959 | `Underground network` | criminal, smuggling, underground | criminal | 0.22 | same facets + forbiddances; merged into metropolis by `mergeCatalogs(city, metropolis)` |
| 18 | city | L1968 | `Contract killer` | guild, military | **military** | 0.25 | the ONE Criminal-shelf row whose `priorityCategory` is not `criminal` |
| 19 | city | L1975 | `Front businesses` | criminal | criminal | 0.70 | the highest baseChance on the shelf |
| 20 | city | L1982 | `Kidnapping ring` | criminal, underground | criminal | 0.15 | `exclusionConditions: ['Slave market','Slave market district']` |
| 21 | city | L1990 | `Human trafficking network` | criminal, underground, smuggling | criminal | 0.20 | same exclusionConditions |
| 22 | city | L1998 | `Smuggling network` | criminal, smuggling | criminal | 0.60 | |
| 23 | city | L2010 | `Rookery` | criminal, information, brokerage | criminal | 0.20 | same serviceKeys as L1454 |
| 24 | city | L2018 | `Whisper market` | criminal, information, brokerage | criminal | 0.18 | `serviceKeys: ['info_calibration','info_query','info_feed','info_plant']` — `info_plant` is declared HERE AND NOWHERE ELSE |
| 25 | metropolis | L2366 | `Thieves' guild (powerful)` | criminal | criminal | 0.55 | `minTier: 'metropolis'`, `exclusiveGroup: 'criminalPower'` |
| 26 | metropolis | L2375 | `Black market bazaar` | criminal, underground | criminal | 0.45 | `minTier: 'metropolis'` |
| 27 | metropolis | L2383 | `Underground city` | criminal, underground | criminal | 0.25 | `minTier: 'metropolis'` |
| 28 | metropolis | L2391 | `Assassins' guild` | criminal | criminal | 0.20 | `minTier: 'metropolis'` |

**Number audit, performed.** 2 + 3 + 3 + 5 + 11 + 4 = 28 rows on the Criminal shelf.
`grep -c "priorityCategory: 'criminal'"` over the whole catalog returns **27**, and the
difference is exactly row 18 (`Contract killer`, `priorityCategory: 'military'`). The undercity
charter's §5 says "27 criminal-priority entries" and that figure is therefore CORRECT as
written and is NOT the shelf count. **The dispatch note at ODQ §490.3 says "the whole Criminal
shelf (≈25 rows over five tiers)"; the measured shelf is 28 rows over SIX tiers** (the
metropolis block is a distinct authored block, and the city block additionally merges into it).
Both figures are recorded so the discrepancy is not re-found: this dossier's roster is 28.

### §0.2 · The keyword sweep over ALL shelves, and every exclusion with its reason

The sweep ran the brief's thirty-one keyword stems (`thie`, `smuggl`, `fence`, `crim`, `gang`,
`syndic`, `assassin`, `black market`, `racket`, `bandit`, `pirate`, `forger`, `counterfeit`,
`spy`, `informant`, `underworld`, `beggar`, `cutpurse`, `den`, `poacher`, `outlaw`,
`contraband`, `whisper`, `rookery`, `front`, `safe house`, `hideout`, `cellar`, `tunnel`,
`sewer`) case-insensitively over every one of the 311 flat rows, in two passes: name-plus-tags,
and description-only. The results, complete:

**Name/tag hits outside the Criminal shelf — six, of which FOUR are substring artefacts.**

- `Communal root cellar` (thorp L104, Infrastructure) — matched on `cellar`. **NOT a criminal
  row; RETAINED AS A HOST.** It is the thorp's only below-grade cell and it is therefore the
  only plausible physical home for the thorp `Outlaw shelter`'s "a barn, a cellar". Family B
  uses it; the enumeration excludes it from the roster proper.
- `Gambling den` (town L1471, Entertainment) — matched on `den`. **EXCLUDED: R-INST-4's vice
  rows.** Cross-referenced in family E as a FRONT HOST, never re-researched here.
- `Resident smith (part-time)` (hamlet L157) — matched on `den` inside "resi**den**t".
  **EXCLUDED: substring artefact.**
- `Priest (resident)` (village L762) — same artefact. **EXCLUDED.**
- `Dragon resident` (city L2149) — same artefact, and already carried by R-INST-5 family K.
  **EXCLUDED.**
- `Warden's Lodge` (town L1364) — matched on `den` inside "War**den**'s". **EXCLUDED: R-INST-5
  family I**, which also recorded the live consequence (the same substring makes the engine
  infer `vice` for this row: §488.2 finding 5, defect G1).

**Description-only hits — nine, every one a BOUNDARY row, none added.**

- `Mill` (village L532) and `Tailor` (village L696) and `Tailor's guild` (town L1184) — the
  descriptions contain "resented", "seamstress" and "livery"; substring artefacts of `sent` /
  `crim` variants. **EXCLUDED.**
- `Carriers' hiring hall` (town L985) — the description says drivers "share road conditions and
  **bandit** reports over a cup of ale". **EXCLUDED from the roster; RETAINED as an INTELLIGENCE
  SEAM** — it is the licit twin of the `Rookery` and the `Whisper market` and family G cites it.
- `Slave market` (town L1001) and its city pair `Slave market` (L1635) / `Slave market district`
  (L1642) — the town description names "trafficked individuals" and "convicted criminals".
  **EXCLUDED: R-INST-4's rows**, and structurally load-bearing here only because rows 20 and 21
  carry `exclusionConditions` against them. Family H states the boundary and cross-references.
- `Multiple courthouses` (city L2204), `Large prison` (city L2211), `Multiple court buildings`
  (metropolis L2269), `Massive prison` (metropolis L2453) — descriptions name "criminal".
  **EXCLUDED: R-INST-1's enforcement counterpart.** Family I states the boundary per entry.

**No `sewer` row exists in the catalog under that spelling on any shelf.** The sanitation
institution the undercity's UC-1 rung reads is spelled `Sewage system`; the sweep confirms it
is not a Criminal-shelf row and never was. This matters to §Σ: the sewers under a criminal
front are UC-1's fact, not this shelf's.

**Two catalog defects found by the enumeration itself and recorded, not fixed.**

- **D6-1 · `Smuggling network` at village L865 carries `minTier: 'city'`.** The row is authored
  inside the VILLAGE block and then gated to city. This is the same SHAPE as R-INST-5's §488.2
  defect G2 (four "(high magic)" rows and `Dragon resident` authored in the city block carrying
  `minTier: 'metropolis'`), which means the defect CLASS has now been observed on two different
  shelves by two different tranches and is a catalog-wide audit item, not a magic-shelf quirk.
  Effect on this dossier: the village tier's smuggling verdict in family C is written for the
  row AS AUTHORED and flagged; if the gate is intended, the village tier has NO smuggling
  institution and the family's village rung is empty.
- **D6-2 · The catalog's `Rookery` is a BIRD LOFT, and the brief's family D assumed the slum.**
  The two `Rookery` rows (L1454, L2010) read "A loft of message birds kept by people who file no
  returns. Word arrives unsigned and ahead of the watch. Only a standing criminal organization
  can protect a loft like this, so one never appears without that backing." with
  `serviceKeys: ['info_calibration','info_query']`. This is the W-I INFORMATION BROKERAGES
  design's illegal MINOR form — a PIGEON LOFT — and it has nothing to do with the Victorian
  slum rookery of Beames and Booth. **This dossier researches BOTH and keeps them apart:** the
  bird loft is family G (with the dovecote as its measured analogue); the slum rookery is family
  D's analogue for `Street gang`, `Multiple criminal factions` and `Underground city`. The
  brief's family-D wording ("the rookery ... Victorian rookery literature, the Old Nichol,
  St Giles, the Liberties") is therefore right about the RESEARCH and wrong about the ENTRY, and
  the correction is stated here so DW-0 does not inherit it.

### §0.3 · THE NINE FAMILIES, and the honest STATUS MAP

Families A-I as chartered, with the roster rows each carries and the depth actually reached.
**FULL** means the family has at least one measured primary this lane opened, a negation search
run, a circulation and a storage typology, and a typed proposal. **PARTIAL** means the family
is complete in structure and named what it owes; the owed item is a numbered §L entry.

| family | rows | depth | what is owed if PARTIAL |
|---|---|---|---|
| **A** the fence and the receiver's shop | 1, 3, 6 | **FULL** | — |
| **B** the outlaw shelter, the bandit affiliate, the safe house | 2, 4 | **FULL** | — |
| **C** the smuggling waypoint → operation → network → underground network → underground city | 5, 7, 8, 10, 12, 17, 22, 27 | **FULL** | — |
| **D** the street gang and the multi-occupied fabric | 9, 15 | **FULL** | — |
| **E** front businesses — the two-plan building | 11, 19 | **FULL** | — |
| **F** the thieves' guild chapter, the powerful guild, the assassins' guild | 14, 25, 28 | **FULL** | — |
| **G** the black market, the bazaar, the whisper market, the rookery (bird loft) | 13, 16, 23, 24, 26 | **PARTIAL** | **L.7** — no measured pigeon-loft-as-message-station of any period; the dovecote is the analogue and the message loft's own fittings are DERIVED |
| **H** contract killer, kidnapping ring, human trafficking network | 18, 20, 21 | **PARTIAL** | **L.9** — the holding cell is measured only by ITS LICIT TWIN (the recruiting rendezvous strong-room); no measured criminal holding room was found |
| **I** the enforcement boundary | none (cross-reference) | **BOUNDARY ONLY, by charter** | — |

**Roster coverage audit:** rows carried by a family = 1,3,6 (A) + 2,4 (B) + 5,7,8,10,12,17,22,27
(C) + 9,15 (D) + 11,19 (E) + 14,25,28 (F) + 13,16,23,24,26 (G) + 18,20,21 (H) = 3+2+8+2+2+3+5+3
= **28**. Every roster row is carried by exactly one family; none is carried twice; none is
dropped. Row 27 (`Underground city`) sits in C rather than D because its licence is the
undercity's colonization, not the surface fabric — the reason is argued at C(a).

**What the reader should distrust.** Seven of the nine families rest on ENGLISH sources of the
seventeenth to nineteenth centuries, because that is where the record of clandestine building
actually is — court proceedings, slum surveys and revenue prosecutions produce descriptions
that medieval sources do not. §15 states the correction and supplies the continental and
non-European register. Three measured anchors do most of the structural work (the priest hide,
the rookery room, the crimp house's strong-room) and all three are 1590-1863, not 1200-1500.
Where a figure is later than the product's own register the dossier says so at the figure.

(research sections follow — §1 the undercity spine's seven anchors; §2–§10 the nine families A–I; §15 the continental and non-European register; §Σ the nine-law map, the sixteen engine-gap flags, the 28-entry verdict table and the UC SEAM TABLE; §L the 45-item open-questions ledger; §M the method disclosure and the RESEARCH-COMPLETE statement; the APPENDIX of every search, URL and file)

---

## §1 · THE UNDERCITY SPINE — the seven anchor findings this tranche stands on

Seven findings carry the rest of the dossier. Each is stated as a LAW the grammar can hold,
then evidenced. Two of them are the measured concealed-cell primary and the measured smuggling
store the brief asked this tranche to find; both were found, and the second one turned out to
refute the shape everybody expects.

---

### §1.1 · ANCHOR ONE — A HIDE IS SUBTRACTED FROM A DECLARED VOLUME, NEVER ADDED TO A BUILDING. (The measured concealed-cell primary.)

The best-measured concealed cells in the European record are the Elizabethan and Jacobean
priest hides of English recusant houses, and they are measured because they survive, are
surveyed, and are open. **Harvington Hall, Worcestershire, has seven hides**; four of them sit
around the Great Staircase and carry the marks of Nicholas Owen, the Jesuit lay brother who
built hides from about 1588 until his arrest in 1606 (CONFIRMED, harvingtonhall.co.uk/our-story/,
fetched 2026-08-23; the Owen dating and apprenticeship as a joiner in February 1577 CONFIRMED,
en.wikipedia.org/wiki/Nicholas_Owen_(Jesuit), fetched 2026-08-23).

Two of the Harvington hides are given with dimensions, and these are the dossier's measured
anchor:

- **The swinging-beam hide: "8ft long, 3ft wide and 5ft high"** — 2.44 m by 0.91 m by 1.52 m —
  formed in "three walls of a book cupboard", entered through a pivoting structural beam, with
  the entrance "barely a foot wide" (about 0.30 m). It was concealed behind panelling and was
  **rediscovered in 1894**, having been lost for roughly three centuries (CONFIRMED, harvingtonhall.co.uk,
  fetched 2026-08-23).
- **The bread-oven hide: "5ft deep 2ft 7in by 3ft 9in"** — 1.52 m by 0.79 m by 1.14 m — built
  probably in the early 1590s inside the chimney stack above the kitchen bread oven, entered by
  a trapdoor in the privy off the South Room above, and obsolete by the end of the sixteenth
  century (CONFIRMED, same source).

Two structural facts follow, and they are the ones a grammar needs.

**First: the hide is always carved out of something the house already declares.** A book
cupboard's three walls. The void above a bread oven inside a chimney stack. A garderobe shaft.
At Baddesley Clinton, Warwickshire, one of three hides "was formerly a medieval sewer, beneath
the kitchen", reached by sliding down a rope from the first floor through the old garderobe
shaft, and it held — the two accounts differ, and both are reported — "six or seven people with
their clothes and the equipment required for a Mass" or "at least a dozen"; nine priests are
recorded hiding in it for four hours in October 1591 (CONFIRMED-digest, 2026-08-23, of the
National Trust's Baddesley Clinton history pages; the National Trust's own priest-hole index
page was opened and gives the sewer-hide and Coughton Court's "double hide" but no dimensions —
CONFIRMED, nationaltrust.org.uk/visit/houses-buildings/places-to-find-priest-holes, fetched
2026-08-23). **The capacity figures are contested** and are carried as a range of 6-12 persons.

**Second: the hide is subtracted BECAUSE the searcher measures.** "Priest hunters measured the
height of ceilings and the length of walls in the hope of detecting hidden chambers"
(CONFIRMED-digest, 2026-08-23). This is the whole causal mechanism, and it is why the type is
architecturally disciplined rather than whimsical: a concealed cell that ADDS volume is
detectable by arithmetic, so the surviving hides are all volume STOLEN from a cell whose
apparent size the house can still account for — the thickness of a chimney breast, the depth of
a stair well, the run of a garderobe.

**The live engine already implements this law, and did not know it was historical.** In
`src/domain/interior/interiorModel.js` on the branch of record, the covert concealed chamber is
nested INSIDE the back-most existing room — `cw = clamp(round(host.w * 0.5), 40, host.w - 16)`,
`ch = clamp(round(host.h * 0.5), 40, host.h - 16)`, positioned at `host.x + host.w - cw - 8` —
with three solid covert walls and one covert door on the inner edge into its host, and the
comment above it says the visible geometry of a covertly corrupt building is byte-identical to a
clean one (CONFIRMED by reading the file; see §Σ's engine table). That is the priest-hunter law
in code. The finding for DW-0 is not "build this" but "this is right, keep it, and make it the
GENERAL rule": **a `HIDE_CELL` is always a child of a declared cell and its area is debited from
that cell, never from the building.**

---

### §1.2 · ANCHOR TWO — THE ATTESTED SMUGGLING STORE IS A CELLAR, A BARN, OR A DOOR THROUGH A PARTY WALL. THE LONG TUNNEL IS THE FOLKLORE CASE. (The measured smuggling store, and this tranche's largest discrepancy bucket.)

The brief predicted that the smugglers'-tunnel folklore problem would be this tranche's largest
discrepancy bucket. It is, and the negation search settled it in the useful direction.

**The negation, run and returned strongly.** The Kent Underground Research Group — a fieldwork
body that surveys the actual holes — states that of the sites claimed as smugglers' tunnels
"most of these sites have much humbler origins as drainage tunnels, cellars, follies, etc.",
argues that smugglers "would rather carry goods at night on packhorses rather than drag them for
long distances along wet, low passages", and observes that "just about every church and large
house has its accompanying secret passage rumour but nobody seems to know where it is"
(CONFIRMED, kurg.org.uk/tunnels-and-secret-passages, fetched 2026-08-23). KURG names only two
candidates with any smuggling case at all: Frank Illingworth's tunnel at Pegwell Bay, Kent —
"low, artificial", about 500 feet long and about 7 feet in diameter, where an old pistol and
three buttons from an exciseman's tunic were found — and a shaft with a primitive winch at the
Smugglers' Farm Hotel, Herstmonceux, Sussex, blocked at the bottom.

**The economic reason, from the other side.** For the great armed gangs of the 1740s the tunnel
was not merely rare, it was pointless: "many hidden cellars and remote barns could have been
used for storage so it is unlikely that tunnels would have been needed at that period when large
armed gangs operated openly" (CONFIRMED-digest, 2026-08-23, on the Hawkhurst Gang, active
1735-1749 out of the Oak and Ivy Inn at Hawkhurst with a second headquarters at the Mermaid Inn,
Rye; the gang ran a network of safe houses, agents and up to 200 horses and could mobilise 100
men or more). **A gang that can put a hundred armed men on a beach does not dig.** The tunnel is
the technology of the WEAK smuggler and the CROWDED town, not the strong one and the open
coast — which is exactly the licence the engine already carries (see §1.3 and §Σ).

**What IS attested, and what it looks like.** Three shapes, in ascending order of how well they
are evidenced:

1. **The concealed store inside an ordinary building.** Tubs "hidden in recesses in walls,
   chimneys, holes in floors and other hidey-holes", and goods stored "in holes dug in
   sand-dunes, in haystacks, in vaults in parish churches, and in concealed cupboards built into
   large hearths in village inns" (CONFIRMED-digest, 2026-08-23). Note the repetition of the
   HEARTH and the CHIMNEY — the same volume the priest hide steals. The unit of storage is
   itself standardised: a tub was "a small cask, flat on one side, oval on the other", carried
   in pairs slung over a packhorse, the spirit half-anchors "holding about four gallons apiece"
   and the tea in "oilskin bags ... holding from a quarter to half a hundredweight each"
   (CONFIRMED-digest). **This gives the storage cell a MODULE**: a smuggler's store is sized in
   pairs of four-gallon casks, not in cubic metres.
2. **The cellar-to-cellar chain.** At Deal, Kent — Middle Street became Kent's first
   Conservation Area in 1968 — "the small houses here used to have secret hideaways, concealed
   cellars and interconnecting tunnels designed to hide from the revenue officers ... you can see
   their cellars where the contraband would have been rushed from cellar to cellar"
   (CONFIRMED-digest, 2026-08-23). This is the honest form of the "tunnel": **a door through a
   party wall between adjoining cellars of a terrace**, giving a route that crosses several
   properties without surfacing. It is short, it is cheap, it needs no engineering, and it
   defeats a search warrant naming one house. It is also EXACTLY the undercity's ADJACENCY
   BREACH connection class (§311.9), and §Σ's seam table binds them.
3. **The one credible bore, and why it is credible.** At Hayle, Cornwall (SW562382), in the
   garden of a house at the end of a cul-de-sac on the north side of the inlet, "a sloping trench
   leads down from ground level to the arched tunnel entrance, where the hinges for a gate or
   door can still be seen. The tunnel is still open, and runs due north for hundreds of yards",
   walkable "only in a stooping posture", and the assessment is that "many smugglers' tunnels
   prove disappointing, or just non-existent, but this one seems authentic: it is the right
   shape; it runs towards the coast; it even has a drainage gulley along its length to keep the
   flat floor dry" (CONFIRMED, smuggling.co.uk/gazetteer_sw_13.html, curl-fetched 2026-08-23
   after WebFetch failed on a TLS internal error). **The drainage gulley is the tell that cuts
   both ways**: it is why the tunnel works, and it is why a drain is the most likely thing it
   originally was. The dossier reports it as attested-as-a-tunnel and unresolved-as-to-origin.

**The grammar consequence, stated once.** A `SMUGGLER_STORE` is a FIXTURE or a CELL inside a
building the settlement already has; a `CELLAR_BREACH` is a door, not a passage; and a
`SMUGGLERS_TUNNEL` is a rare, licensed, stooping-height bore that needs a wall or a toll to be
worth digging and is very often a repurposed drain. All three already have engine homes and
§Σ maps them.

---

### §1.3 · ANCHOR THREE — THE FRONT IS A REAL TRADE THAT REALLY TRADES. IT IS NOT A DISGUISE; IT IS A SECOND BUSINESS THE SAME ROOMS SUPPORT.

The catalog's `Front businesses` rows say "Legitimate covers for criminal activity" (town L1431)
and "Warehouses, taverns, shops as criminal covers" (city L1975). The historical record says the
word "cover" is doing too much work: the front trades are chosen because their ORDINARY room
program is already the criminal program.

- **The fence trades behind another trade, and the catalog says so.** The village row's own
  description reads "Local contact for moving stolen goods quietly. **Operates behind another
  trade**" (village L858) — historically exact. Mayhew's receivers run "from the keepers of
  miserable low lodging-houses and dolly shops in the East-end and West-end of the metropolis, to
  pawnbrokers and opulent Jews" (CONFIRMED, victorianlondon.org/publications/mayhew1-11.htm,
  fetched 2026-08-23), and in the low lodging-houses "the proprietor — more often a proprietress
  — were 'fences', or receivers of stolen goods in a small way" (same source).
- **The drink house that is also a workshop.** The anonymous manuscript *A List of Houses of
  Resort for Thieves of Every Description*, c.1815 (The National Archives, HO 42/146), lists
  **67 flash houses** with a note on each. At the Sun in Brownlow Street, Drury Lane, there are
  "Men (wearing Leather Aprons) who work at smith's Work, and who Manufacture the Implements for
  Housebreaking and also Screws or Skeleton Keys" (CONFIRMED, Eleanor Bland, "'Flash houses':
  Public houses and geographies of moral contagion in 19th-century London", *History of the Human
  Sciences*, open-access copy at radar.brookes.ac.uk, curl-fetched and pypdf-extracted
  2026-08-23; WebFetch returned the binary). A FORGE inside a TAVERN: the licit interior's
  workfloor and the illicit function are the same room.
- **The private door is the front's real architecture.** The Victorian pawnbroker's premises are
  the type specimen: the shop is "situated near Drury-Lane, at the corner of a court, which
  affords a side entrance", the door "stands always doubtfully, a little way open: half inviting,
  half repelling", and pledging happens in "a series of small booths facing the pawnbroker's
  counter" — separate compartments called "boxes" — with the boxes "in shadow" while "two or
  three gas-jets lighted the interior of the shop" (CONFIRMED for the Dickens *Sketches by Boz*
  description, victorianweb.org/history/london/pawnbrokers.html, fetched 2026-08-23; the boxes
  and side-street entrance CONFIRMED-digest 2026-08-23). Above, "large frames full of ticketed
  bundles" behind "the dirty casement up-stairs", and the pledge warehouse runs "from basement to
  roof built up in skeleton frames or 'stacks'" (CONFIRMED-digest).
- **The Houndsditch case shows the whole ladder in one street.** The jewellery marts there "were
  housed in converted taverns", the third and most prominent with "a spacious private entrance",
  a "demurely whitened" step and "a door so closely ajar that at first sight it seemed shut",
  opening on a room "as long as Fleet Street is broad, and wide in fair proportion", holding "at
  least two hundred people", with "a line of tables about four feet wide on either side down the
  whole length of it", a "snug country posting-house liquor-bar" at one end and "a broad
  skylight" over (CONFIRMED, James Greenwood, *Unsentimental Journeys*, 1867, ch. 22, at
  victorianlondon.org/publications/unsentimental-22.htm, fetched 2026-08-23).

**The grammar consequence.** A front is a `TWO_PLAN_FRONT`: ONE building, TWO circulation graphs
over the same cells — the public graph from the street door to the counter, and the trade graph
from a side or court door to a back or below cell that the public graph does not reach. The
second graph's entrance is the thing to model, not a secret room: the side door, the court, the
yard gate, the cellar flap.

---

### §1.4 · ANCHOR FOUR — CRIMINAL FABRIC IS CUL-DE-SAC FABRIC WITH ONE MOUTH, AND THE ROOMS INSIDE IT ARE THE SMALLEST MEASURED ROOMS IN THE CORPUS.

Thomas Beames, *The Rookeries of London* (1850; the 1852 edition is the text read here),
describes the St Giles rookery as "triangular, bounded by Bainbridge street, George street, and
High street", and its internal fabric as **"like an honeycomb, perforated by a number of courts
and blind alleys, culs de sac, without any outlet other than the entrance"** (CONFIRMED,
victorianlondon.org/publications5/rookeries-03.htm, fetched 2026-08-23).

The same chapter gives the smallest measured habitable rooms this whole six-tranche research
program has produced:

- a room **"six feet by five broad"** — 1.83 m by 1.52 m, 2.8 square metres — with **eight
  people** sleeping in it;
- a room **"about 8 feet by 12"** — 2.44 m by 3.66 m, 8.9 square metres — with **twelve**;
- three rooms in one house occupied "first room, by eight persons second by fifteen third by
  twenty-four"; a house with **100 persons** in one night; another house averaging twelve per
  room;
- a back-alley den "so low, that a tall man could not stand upright in it", with **seventeen**
  occupants, its "floor was damp and below the level of the court";
- and the ventilation audit that makes the rest legible: **175 cubic feet of air per person on
  average, the largest 605 cubic feet, the smallest fifty-two** (4.95 / 17.1 / 1.47 cubic metres)
  (all CONFIRMED, same page).

Two corroborating measured sources bracket it. The 1863 survey *More Revelations of Bethnal
Green* describes a cellar dwelling at No. 59 Nichol Street whose window is "a little over 3 feet
in width, and about the same in height" but where the area "extends from the wall about 2 feet"
so that the remaining opening is "a chink 3 feet wide by 4 and a half inches in height"; the
room is "not quite 6 feet" high and holds "a widow and her four children" at "2s. a week"; the
adjoining cellar holds a man, his wife and six children; and the party wall between two houses
was "bulged at the basement to the extent of at least 2 feet" (CONFIRMED,
mernick.org.uk/thhol/morevbg.html, fetched 2026-08-23). And the plot geometry underneath it all
comes from the *Victoria County History* of Middlesex, vol. 11: the Nichol estate was subleased
from 1680 "usually in plots giving a frontage of 16-20 ft. with a depth of 60 ft. for each
house", and "by 1827 there were 237 houses on the 5-a. Nichol estate" (CONFIRMED,
british-history.ac.uk/vch/middx/vol11/pp103-109, fetched 2026-08-23). **Number audit,
performed:** 237 houses on 5 acres = 20,234 square metres, so about 85 square metres of estate
per house, against a nominal plot of 16-20 ft by 60 ft = 89-111 square metres — the estate is
built past its own plot arithmetic by roughly a tenth to a quarter, which is what
"back-building" means numerically.

**The convergence with R-INST-5.** §488.2's finding (3) — that law 6 INVERTS for a precinct, the
single controlled entrance being that tranche's most repeated finding across five instances — is
independently reproduced here from a completely different literature. The rookery court, the
fondaco, the han, the bastle and the triad lodge all resolve to ONE ENTRANCE. That makes
`compound.entrances: 1` a cross-tranche parti attribute rather than a magic-shelf special case,
and it is the single strongest joint recommendation the two dossiers make together.

---

### §1.5 · ANCHOR FIVE — THE HOLDING CELL IS A STRONG-ROOM OR A GARRET IN A LICIT HOUSE, AND ITS LICIT TWIN IS SIGNED WITH A FLAG.

Handled clinically, as a building type. The best-evidenced European holding room attached to a
coercive trade is the London CRIMP HOUSE of the 1790s, and it is well evidenced because a
fortnight of riots in August 1794 pulled five or six of them down and produced a court record.

J. Stevenson, "The London 'Crimp' Riots of 1794" (*International Review of Social History*),
gives the type in two halves (CONFIRMED, cambridge.org open PDF, curl-fetched and
pypdf-extracted 2026-08-23):

- **The licit twin.** "Recruiting centres for army, navy, and militia were known as 'rendezvous
  houses', usually set up in a conveniently sited alehouse ... Most of them had some form of
  strong-room to secure unruly recruits; but though regarded with suspicion, they were at least
  openly recognisable as recruiting centres and **usually displayed a flag or posters**."
- **The illicit form.** Francis Place: "In these houses the basest of villainies were practised.
  In most such houses there was a strong-room in which men who had been impressed or crimped were
  locked up, **unlit**, until they could be removed to the tender off the Tower or to the Savoy
  prison." The variants recorded in the same source: Edward Barrett was "decoyed into the White
  Horse, Whitcomb Street" and "imprisoned in the garret of the public house for a fortnight"; and
  in another house "a man dying of small-pox was found chained in a tiny cell".

Four grammar facts fall out, and all four are typed vocabulary the engine already has or nearly
has. The holding cell is (i) **inside a licit hospitality building**, not a building of its own;
(ii) either the STRONG-ROOM or the GARRET, i.e. the two cells of an inn that already lock and
already lack windows; (iii) distinguished from its licit twin by the ABSENCE OF A SIGN — the
rendezvous house flies a flag, the crimp house does not; and (iv) transient by design, sized for
days, with the route out being a cart or a boat rather than a door onto the street.

---

### §1.6 · ANCHOR SIX — A CLANDESTINE INSTITUTION'S IDEAL PLAN COMPRESSES INTO THE HOST'S AVAILABLE CELLS, AND THE COMPRESSION IS LAWFUL, NOT A FAILURE.

Two independent traditions show the same mechanism, and it is the mechanism DW's law 1
(FUNCTIONS, NOT ROOMS) needs for every clandestine type.

**The Chinese triad lodge.** The 1879 *Journal of the Straits Branch of the Royal Asiatic
Society* account records that in the Straits Settlements "each Lodge has a substantial
'Hui-Koan' or Meeting-house" and that at Singapore the Grand Lodge had "a very superior building
at Rochore"; that the ritual passes an outer "Ang Gate", a "Hall of Sincerity and Justice", then
the "City of Willows", the "Red flowery Pavilion" before the Grand Altar on the East side, a
"Two Planked Bridge", the "Fiery valley", and ends at the "Market of Universal Peace"; that
theoretically meetings were "held in the jungle or mountains"; and — the load-bearing sentence —
that the City of Willows theoretically had gates at "each point of the compass" **though
practically only one gate was represented** in the Singapore lodges (CONFIRMED,
en.wikisource.org/wiki/Journal_of_the_Straits_Branch_of_the_Royal_Asiatic_Society/Volume_3/Chinese_Secret_Societies,
fetched 2026-08-23). An eight-station processional ideal, executed in one room with one gate.
The same source's other note is the ladder: elsewhere "the gates were solid, bridges dangerous,
swords sharp", the lodge being "a small encampment" pitched for the night, while in Singapore,
where the societies were tolerated, "they had built handsome structures" (CONFIRMED-digest,
2026-08-23). **Tolerance is what turns a rite into a building.**

**The Dutch clandestine church.** *Ons' Lieve Heer op Solder* — a canal house of 1630 at
Oudezijds Voorburgwal 40, Amsterdam, whose top three floors were converted between 1661 and 1663
into a full Catholic church — is the type specimen of an entire institution installed inside a
dwelling that continues to read as a dwelling from the street. Its museum sequence is still the
building's own: "the front room, the between room, the hall, the church, the Lady chapel, the
confessional, the ... kitchen" (CONFIRMED, en.wikipedia.org/wiki/Ons'_Lieve_Heer_op_Solder,
fetched 2026-08-23); the entrance to the church was through a disguised door in the living room
onto a tight spiral stair (CONFIRMED-digest, 2026-08-23). The legal rule that produced it is the
purest statement of the two-plan law in the record: worship was permitted "just so long as they
didn't do it in public or even in a building that looked like a church" (CONFIRMED-digest).
**The prohibition was on the FACADE, not the function** — so the function moved inward and
upward and the facade stayed obedient.

The consequence for DW: a clandestine institution's parti is not its own; it is
`HOSTED_COMPRESSED` — the ideal function list, ordered by priority, poured into whatever cells
the host building has above the minimum, with the surplus functions SHED in a stated order (law
3's shedding, applied to a guest rather than to poverty).

---

### §1.7 · ANCHOR SEVEN — AN ILLICIT MARKET GETS A BUILDING ONLY WHEN SOMEBODY CAN CHARGE AT A DOOR.

The London second-hand and stolen-goods trade is the cleanest longitudinal case, because the
same trade is documented open-air and enclosed within a century.

**Open, for three centuries.** Rag Fair in Rosemary Lane (later Royal Mint Street) was "by far
London's largest used clothing market in the eighteenth century", thriving by 1700, running "six
afternoons a week (not Sundays) along the whole length of Rosemary Lane", "mainly out in the open
in the street", trading "unlicensed and in large part in stolen goods" and handled largely by
women; Ned Ward in 1699 called it a place of a "Tatter'd Multitude" and "all the Rag-pickers in
Town" (CONFIRMED-digest, 2026-08-23, from the Survey of London's Whitechapel pages and
St George-in-the-East's history pages). Rag Fair "did give rise to some market buildings on its
north side" — the buildings are a LATE and PARTIAL consequence, not the market's condition.

**Enclosed, in 1843.** The Old Clothes Exchange at Phil's Buildings, Houndsditch, was formed
when "Mr. L. Isaac purchased the houses which then filled up the back of Phil's-buildings"
about eight years before Mayhew wrote; before that "the head-quarters of the traffic ... were
confined to a space not more than ten square yards, adjoining Cutler-street"
(CONFIRMED-digest, 2026-08-23). The built version is "a warehouse, with a wide, open entrance
... at the end of a broad street lined by three- or four-storey buildings" (CONFIRMED-digest).
And Greenwood's 1867 jewellery mart, quoted at §1.3, is the same move at the luxury end: a
converted tavern, one private entrance, a hall of paired four-foot tables, a bar and a skylight.

**The mechanism is the toll, not the secrecy.** An open market needs no walls because nobody
collects at the edge; an enclosed exchange exists because an owner bought the frontage and can
now charge for entry and for a table. This is the same causal shape as the fondaco and the han
(§15), and it gives the black-market ladder its rungs: NO_BUILDING (ground, a lane, a fair) →
HOSTED (a converted tavern or a yard behind a shop) → BUILDING (a walled exchange with one
controlled entrance, tables in rows, a bar, top light).

---

## §2 · FAMILY A — the fence and the receiver's shop: `Local fence` (thorp L59 "Somebody in this settlement buys things without asking where they came from. Everyone knows who. Nobody says it directly.") · `Fence (word of mouth)` (hamlet L335 "Stolen goods move through this hamlet quietly. The contact is known by face, not name."; village L858 "Local contact for moving stolen goods quietly. Operates behind another trade.")

**(a) Analogue.** Three rows, one type, three rungs — and the catalog's own three descriptions
already encode the correct architectural progression, which is unusual enough to say plainly:
the thorp row names a PERSON, the hamlet row names a FLOW, and the village row names a HOST
("Operates behind another trade"). The historical record supports exactly that ordering.

**The floor is a household, and the fence's only architectural requirement is a place a thing
can sit unremarked.** At thorp scale the catalog says "somebody ... buys things without asking",
and no historical fence at that scale had premises. What the practice needs is one lockable or
one unobserved volume: a chest, a loft, a root cellar. The thorp's own catalog carries the
volume already — `Communal root cellar` (thorp L104, Infrastructure): "A shared underground
store for grain, roots, and preserved food." A SHARED store is a poor hiding place and a good
one at once: nothing is remarkable in it, and nothing in it is anybody's alone. The dossier's
verdict at this rung is NO_BUILDING with a FIXTURE, and the fixture is a chest or a covered
pit inside a dwelling or its outbuilding.

**The middle rung is a flow with a contact point, not a store.** The hamlet description —
"goods move through ... the contact is known by face, not name" — is the transit case. The
architectural requirement is a THRESHOLD where a stranger can hand something over and leave: a
yard gate, a barn door on the road side, a wayside inn's stable. This is the same threshold
R-INST-4's family on hospitality gives the wayside inn (hamlet L382), and the reuse is the
point: the fence at hamlet scale is a FUNCTION SITED ON SOMEBODY ELSE'S THRESHOLD.

**The top rung of this family is the receiver's shop, and the shop is a real trade.** Mayhew's
enumeration of receivers is a list of TRADES, not of hideouts: "the keepers of miserable low
lodging-houses and dolly shops in the East-end and West-end of the metropolis, to pawnbrokers
and opulent Jews" (CONFIRMED, victorianlondon.org/publications/mayhew1-11.htm, fetched
2026-08-23). The four recurring host trades across the sources are (i) the PAWNBROKER, (ii) the
OLD-CLOTHES or dolly shop, (iii) the CHANDLER'S or general shop, and (iv) the LOW LODGING-HOUSE,
where "the proprietor — more often a proprietress — were 'fences', or receivers of stolen goods
in a small way" (CONFIRMED, same source). Each of the four is a trade whose ordinary business is
receiving MISCELLANEOUS SECOND-HAND OBJECTS FROM STRANGERS FOR CASH. That is why they are the
hosts: the criminal transaction and the licit transaction are physically identical, and no room
has to change.

**The countermeasure explains the fixtures.** The reason a receiver needs anything beyond a
counter is IDENTIFICATION. London's Goldsmiths' Company ran a "warning carrier" system from as
early as the mid-sixteenth century: printed notices of stolen property were carried by the
Company's beadles "across the city to goldsmiths, jewelers, watchmakers, bankers, refiners,
toymen, salesmen, and pawnbrokers", alerting the luxury trades not to receive or sell it
(CONFIRMED-digest, 2026-08-23, of the *Journal of Social History* article "Lost Things and the
Making of Material Cultures in Eighteenth-Century London"). From 1691 onward legislative change
made receivers "increasingly wary" (CONFIRMED-digest, same). A described object cannot be
resold; therefore the receiver's trade requires an ALTERATION CAPABILITY, and the alteration
capability is the family's one genuinely distinctive fixture set: a crucible and a small hearth
for plate, an unpicking bench and a dye tub for cloth, a file and a punch for marks. **None of
these is exotic.** A crucible hearth is a smith's or a pewterer's; a dye tub is a dyer's; an
unpicking bench is a tailor's. The receiver is architecturally a CRAFT WORKSHOP crossed with a
SHOP COUNTER, which is why the pawnbroker, who legitimately holds and eventually sells other
people's goods, is the perfect host.

**The organised extreme, and its premises.** Jonathan Wild's operation, London, 1714-1725, is
the record's clearest case of the receiver scaled into an institution, and its building program
is instructive precisely because it is BANAL. By December 1714 he "had installed himself in
Little Old Bailey where his house became an 'Office of Intelligence for lost Goods'"; he moved
to "better premises in Old Bailey in 1719"; he "owned warehouses to store large amounts of
goods, and he kept a sloop for carrying stolen items into Flanders and Holland"; and his
warehouses were searched and the goods confiscated (CONFIRMED-digest, 2026-08-23, from the
Guildhall Library blog on eighteenth-century thief-takers, *History Today*'s account of his
execution, and the Wikipedia article). The typed reading: an OFFICE with a public counter for
the intelligence trade, WAREHOUSES held separately from the office, and a SHIP as the export
leg. Wild's genius was legal, not spatial — he sold restitution rather than goods, which is why
his front could be an office with a signboard rather than a hidden room, and why the 1718 Act
that criminalised taking a reward without prosecuting the thief destroyed him.

**Live/work.** At all three rungs the fence sleeps on the premises, because the premises are a
dwelling or a shop-house. There is no rung of this family at which the fence's building is
non-residential — even Wild lived at his office. The consequence for DW is that this family
never draws a non-domestic parti; it draws R-INST-2's shop-house and adds cells.

**Siting/anchor law.** Three anchors in the sources, in order of strength: (i) the CORNER OF A
COURT — the pawnbroker "at the corner of a court, which affords a side entrance"
(CONFIRMED, victorianweb.org/history/london/pawnbrokers.html, fetched 2026-08-23), i.e. a
frontage on a main street plus a second frontage on a subordinate one; (ii) the MARKET EDGE —
the dolly shops and old-clothes dealers cluster on the streets feeding a market, because that
is where second-hand goods legitimately move; (iii) at rural tiers the ROAD, because the flow is
the asset. **No source in this lane's reading sites a fence at a gate or a waterfront** — that
is the smuggler's anchor, not the fence's, and the two must not be merged (§Σ flags the risk,
because the engine's `smuggler_cellar` licence is gate-or-waterfront and a careless DW rule
could put the fence there too).

**Prosperity and wear.** Floor: one chest in a dwelling. Middle: a counter added to a
dwelling's front room, a back room that locks. Ceiling: the pawnbroker's full stack — shop,
boxes, counter, back office, and a pledge warehouse running "from basement to roof built up in
skeleton frames or 'stacks'" (CONFIRMED-digest, 2026-08-23). Decline sheds the warehouse first
(pledges are sold off), then the boxes (privacy is a luxury), and never the counter, because
the counter IS the trade.

**Era grades.** The counter-and-back-room shop-house is available from the thirteenth century in
the English urban register (R-INST-2 holds the type). The BOXES — separately partitioned pledge
compartments — are a late refinement attested in the nineteenth century and should be era-gated
LATE; a medieval receiver has a counter and a curtain, not booths. The crucible-and-file
alteration set is available at every era.

**(b) Measured.** This family's measured content is thin and the dossier says so rather than
padding it.

- **Pawnbroker's boxes:** "a series of small booths facing the pawnbroker's counter", entered
  "by an inner door" from a side doorway; **no width, depth or count is given in any source this
  lane opened** (CONFIRMED for the description, victorianweb.org, fetched 2026-08-23).
- **Pawnbroker's lighting:** "Two or three gas-jets lighted the interior of the shop, but the
  boxes were in shadow" (CONFIRMED-digest, 2026-08-23). A count of light sources is the only
  quantity the source gives, and it is a NINETEENTH-CENTURY quantity.
- **Houndsditch, the enclosed successor:** the earlier headquarters of the trade were "confined
  to a space not more than ten square yards, adjoining Cutler-street" (CONFIRMED-digest,
  2026-08-23). **Number audit, performed:** ten square yards is 8.4 square metres — the size of
  Beames's second measured rookery room. If the phrase means ten yards square (83.6 square
  metres) the figure is eight times larger. The source's wording is "ten square yards" and the
  dossier reports it as written with the ambiguity flagged; it is **ledger item L.1**.
- **The receiver's stock as a volume:** Mayhew's list of what lodging-house fences held —
  "fish got from the gate", "sawney" (stolen bacon), "flesh found in Leadenhall" — is
  PERISHABLE, which caps the store: a fence of this grade needs turnover in days and a cool
  cell, not a strongroom (CONFIRMED, victorianlondon.org/publications/mayhew1-11.htm, fetched
  2026-08-23).
- **NOT FOUND, searched:** any measured plan of a receiver's shop of any period; any dimension
  of a fence's concealed store; any Old Bailey trial text opened this session (the search for
  "back room / shop cellar / hidden evidence" returned only the database's front matter — the
  Proceedings themselves were not opened, which is **ledger item L.2** and a P1c work order,
  since the Old Bailey Proceedings are the single richest untapped source for this family).

**(c) Contested and counterexamples — the negation searches.**

(i) **"The fence had no premises."** Run, and the answer is a QUALIFIED YES at the bottom two
rungs and a NO at the top. Mayhew's own taxonomy puts receivers on a ladder from
lodging-house keepers to pawnbrokers, i.e. from a person with a room to a business with a
building, and the catalog's three rows sit on that ladder correctly. The negation therefore
does not refute the family; it PARTITIONS it, and the partition is the (f) verdict.

(ii) **The Wild counterexample cuts against the whole "hidden" reading.** The most organised
receiver in the English record advertised. He kept an "Office of Intelligence for lost Goods"
with a public address in the Old Bailey and was reported on by name in the newspapers
(CONFIRMED-digest, 2026-08-23). The lesson for a grammar that wants to draw secret rooms: **at
the top of this family the concealment is LEGAL, not spatial.** A DW rule that gives every
criminal institution a hidden cell will get Wild exactly wrong.

(iii) **The pawnbroker is not a criminal institution and must not be modelled as one.** The
side entrance and the boxes exist for SHAME, not for crime: "the gloom, the narrow compartments,
the low tones of conversation, suggested stealth and shame" (CONFIRMED-digest, 2026-08-23), and
the same fittings serve an honest customer pledging a coat. This is the family's sharpest
warning to the engine: the architecture of DISCRETION and the architecture of CRIME are the same
architecture, and the building cannot tell them apart. §Σ turns this into a projection-tier rule.

**(d) CIRCULATION typology (§452).** Per rung.

- **thorp `Local fence` — NO_BUILDING.** Circulation is the host dwelling's:
  `THROUGH_ROOM` only. The one addition is a VERTICAL joint to the store: a `LADDER` to a loft
  or a trap to a pit. Stair type: ladder. No width bucket is supportable.
- **hamlet `Fence (word of mouth)` — NO_BUILDING, threshold on a host.** `THROUGH_ROOM` plus
  the host's own yard or gate passage. Where the host is the wayside inn, R-INST-4's carriage
  passage bucket governs and is not restated here.
- **village `Fence (word of mouth)` — HOSTED in a shop-house.** Two classes, and the second is
  the family's signature: `THROUGH_ROOM` for the public route (street door → shop → counter),
  and a `CROSS_PASSAGE` or a court-side `LOBBY` for the trade route (side door → back room),
  where the site allows. The pawnbroker's "side entrance" from "the corner of a court" with "an
  inner door" into the compartments is a two-door LOBBY in everything but name (CONFIRMED,
  victorianweb.org, fetched 2026-08-23). **Width buckets, DERIVED and flagged:** a side-entry
  lobby serving one person at a time, 0.8-1.1 m; a pledge box, 0.7-0.9 m wide by 0.9-1.2 m deep
  (DERIVED from the requirement that one adult stand at a counter unseen by the next; **no
  measured source** — this is part of ledger item L.1).
- **The CORRIDOR class is not licensed anywhere in this family at any era.** A receiver's
  premises are small and pre-corridor by type; the dedicated hallway would be a false note.
- **The `GALLERY` class appears only at the pledge-warehouse ceiling**, as the working gangway
  between stacks "from basement to roof" (CONFIRMED-digest) — a `GALLERY` in the service sense,
  not the great-house sense, and licensed only at the top prosperity rung of the village entry.

**(e) STORAGE typology (§453).** This family is a STORAGE family; the storage typology IS its
program.

- `STORE` — the received-goods store. **Adjacency law: it must NOT open onto the public shop.**
  Every host trade in the sources reaches its store from the back or from above. **Light: NONE
  or NORTH** (perishables at the low rungs; fading at the high). Size buckets, DERIVED and
  flagged: chest-only at thorp; 4-8 square metres at hamlet/village floor; the whole upper
  house at the pawnbroker ceiling.
- `CELLAR` — licensed at village tier and above, and at the low rungs it is a FIXTURE (a covered
  pit) rather than a cell. Where the settlement's `Communal root cellar` exists at thorp tier the
  fence uses it and mints nothing.
- `ATTIC` / `GARRET_STORE` — the pawnbroker's "large frames full of ticketed bundles" behind
  "the dirty casement up-stairs" (CONFIRMED, victorianweb.org, fetched 2026-08-23) is a
  GARRET_STORE with a WINDOW, which is unusual for the class and worth typing: pledged goods must
  be findable, so this store is LIT where a contraband store is not. **This is the family's
  cleanest discriminator between a licit and an illicit store: the licit one has a window.**
- `CLOSET` — a lockable press or aumbry for the small valuable, present as a FIXTURE at every
  rung including the thorp's chest.
- **PROHIBITIONS.** (i) No internal door from the store to the street. (ii) No store cell that
  the public counter can see into — a sight-line prohibition, which the engine has no vocabulary
  for and which §Σ raises as a gap. (iii) The alteration bench (crucible, file, dye tub) must be
  adjacent to the store and NOT to the counter, and where the host trade already has a hearth
  the bench shares it rather than adding one — a fire-load rule with a criminal motive.

**(f) Typed proposal.**

- **parti ids:** `SHOP_HOUSE_RECEIVER` (village; R-INST-2's shop-house with the trade route
  added), `DWELLING_WITH_STORE` (thorp/hamlet). No new parti at the low rungs — the point of the
  family is that it draws an existing one.
- **functions[]** — floor: `receive` (the counter or threshold), `store`. Ladder rung 1:
  `alter` (the crucible/file/dye bench). Rung 2: `sort` (a back room with a table). Rung 3:
  `pledge_boxes` (the partitioned compartment set, era-gated LATE). Ceiling: `warehouse_stack`.
  Shedding order on decline: `warehouse_stack` → `pledge_boxes` → `sort` → `alter`; `receive` and
  `store` are the floor and never shed.
- **fixtures[]** with grades: `counter` (all rungs above thorp), `strongbox` (rung 1+),
  `chest`/`press` (all), `crucible` + `hearth` (rung 1+, shared with the host's hearth where one
  exists), `file`/`punch` (rung 1+), `dye_tub` (rung 1+ where the host is a clothes trade),
  `shelf`, `crate`, `rack`, `ledger` (rung 2+ — a receiver at scale keeps books, as Wild did),
  `ticketed_frame` (the pledge stack, ceiling only).
- **structural buckets:** `lockableCell` (the store), `smallHearth` (the alteration bench),
  `secondFrontage` (the corner-of-a-court requirement — the family's one SITE-level structural
  demand), `heavyFloor` NOT required (the goods are portable by definition).
- **licensing fields:** tier × prosperity × era (`pledge_boxes` LATE only) × siting
  (`secondFrontage` present ⇒ the trade route is drawn; absent ⇒ the trade route collapses onto
  the yard) × culture (neutral; the type is not culture-specific).
- **criminal-share dial, as a CLOSED ENUM (never a float):** `receiverGrade: NONE | OCCASIONAL |
  STANDING | ORGANISED`. NONE draws nothing. OCCASIONAL adds the `store` fixture. STANDING adds
  the `alter` bench and licenses the trade route. ORGANISED adds `sort`, the `ledger`, and the
  separate warehouse (Wild's shape) — and at ORGANISED the concealment is legal, so ORGANISED
  adds NO hidden cell. That last clause is the family's whole finding compressed to one rule.
- **verdict per tier:** thorp **NO_BUILDING** (fixture set inside a dwelling or the communal root
  cellar) · hamlet **NO_BUILDING** (threshold on a host: the wayside inn, a roadside farm) ·
  village **HOSTED** (host named by the catalog itself: "another trade"; the four attested hosts
  are pawnbroker, old-clothes/dolly shop, chandler's shop, low lodging-house) · at town tier and
  above the row does not exist and the function is absorbed by `Front businesses` (family E) and
  `Black market` (family G) — a catalog fact worth noting, because the fence DISAPPEARS as a
  named row exactly where the record says fencing industrialises.
- **HOME tags:** `receive` → HOME: `ROOM_KINDS.stall` (the shop counter room) or
  `ROOM_KINDS.main`. `store` → HOME: `ROOM_KINDS.store`. `cellar store` → HOME:
  `ROOM_KINDS.cellar`. `alter` → HOME: `ROOM_KINDS.workfloor`. `sort` → HOME: `ROOM_KINDS.back`.
  `warehouse_stack` → HOME: `ROOM_KINDS.store` (no distinct stack kind). `pledge_boxes` →
  **NO TYPED HOME** — the partitioned compartment set has no ROOM_KINDS member and is not a
  furnishing either; it is a SUBDIVISION of a room, which the engine's model has no vocabulary
  for. `crucible` → **NO TYPED HOME** in FURNISHING_KINDS (`hearth` is the nearest;
  `cauldron` is wrong). `ticketed_frame` → **NO TYPED HOME** (`rack` and `shelf` are near).

**(g) Consequences for the grammar.** Four, in order of how hard they are.

1. **The engine must be able to express TWO ENTRANCES ON ONE BUILDING with different reach.**
   Today `interiorModel.js` draws exactly one entrance, on one edge, rotated to the map-facing
   side (`const rot = (footprint.entranceSide + 2) & 3`). The receiver's premises require a
   second, subordinate entrance reaching a cell the first cannot. This is the same requirement
   family E raises for the front business and it is the tranche's single largest engine ask.
2. **A SIGHT-LINE prohibition is needed.** "The store must not be visible from the counter" is
   an adjacency rule about VIEW, not about doors, and neither §452's circulation contract nor
   §453's adjacency law can state it. Proposal: add `sightlineProhibitions[]` to the
   `StorageCell` contract, holding cell-kind pairs.
3. **A room SUBDIVISION class is missing.** The pledge boxes, the market tables, the lodging
   house's bed rows and the exchange's stalls are all the same thing: a room partitioned into
   repeated small units that are not cells. Proposal: a `subdivision: { unit, count, axis }`
   attribute on a cell, closed-vocabulary `unit`.
4. **`receiverGrade` must be derivable, not drawn.** The natural input already exists: the
   settlement's criminal share (`corruption.js:539-542`). §Σ's seam table binds it.

**(h) Continental vs English.** The English register supplies the pawnbroker, the dolly shop and
the thief-taker's office; it is parochial in two ways. First, the CONTINENTAL PAWN INSTITUTION
is public, not private: the Italian *monte di pietà* (from 1462) and its Netherlandish and German
successors are civic charitable lenders with a public hall, a valuation counter and a municipal
strongroom, which means that on the continent the pawn function is a CIVIC building and cannot
be the fence's host — the fence's host there is the *fripier* / *Trödler* (the second-hand
dealer) and the *cabaretier*. Second, the ORGANISED receiver's premises in the Mediterranean
record attach to the port rather than to the court-corner shop, because the export leg is the
whole business (Wild's sloop is the English echo of it). The mechanism travels — a receiver
hosts in the trade that legitimately takes used goods from strangers — while the specific host
does not; a setting whose licit second-hand trade is a temple almonry or a caravan factor will
put the fence there, and the grammar should read the HOST from the settlement's own roster
rather than name a trade.

**(i) Fantasy note.** None. This family is entirely mundane; the only fantasy-adjacent question
is whether a magical identification capability changes the alteration requirement, and that
belongs to R-INST-5's `magicLicense` proposal rather than here. Recorded as a one-line
cross-reference: if a world's `magicLicense` is HIGH, the Goldsmiths'-warning countermeasure gets
stronger and the alteration bench gets larger, which is a WEIGHT, not a room.

---

## §3 · FAMILY B — the outlaw shelter, the bandit affiliate and the safe house: `Outlaw shelter` (thorp L66 "Someone here provides cover for people who need to disappear. A barn, a cellar, an arrangement that isn't discussed.") · `Bandit affiliate` (hamlet L342 "One or more households here have ties to bandit groups operating the surrounding roads. Information, shelter, and supply flow both ways.")

**(a) Analogue.** This is the tranche's purest NO_BUILDING family, and the catalog knows it. The
thorp row names its own architecture in six words — "a barn, a cellar, an arrangement that isn't
discussed" — and the hamlet row names a HOUSEHOLD ("one or more households here have ties"), not
a place. The research task is therefore not to find the building; it is to establish what the
practice DOES to a building that already exists, and to find the era and the frontier at which
the practice acquires one.

**Harbouring is a legal category before it is a spatial one.** In medieval and early-modern
England, sheltering an outlawed person is a named offence with named consequences: the
trailbaston commissions of 1304 were established to punish not only perpetrators "but those
more powerful and shadowy figures who instigated such crimes and shielded the criminals from
justice"; a man suspected of being an accessory who failed to appear was himself outlawed; and
one Walter of Barton, "a small landowner in Somerset and Dorset, had already been charged with
harbouring an outlawed killer in 1288" (all CONFIRMED-digest, 2026-08-23, from The National
Archives' research guide on outlaws and outlawry and the associated scholarship). Major outlawry
carried death on proof and "immediate forfeiture of all property and possessions to the crown"
(CONFIRMED-digest, same). **The forfeiture clause is the architectural driver.** A harbourer who
is caught loses the house, so the harbourer's rational strategy is to keep the shelter OUTSIDE
the house he would lose — in a detached outbuilding, a field barn, a wood — and to keep the
arrangement deniable. That is precisely the catalog's "a barn, a cellar, an arrangement that
isn't discussed", and it is why this family's shelter is nearly always DETACHED and NEVER
modified.

**The three attested rural shelter volumes, and none of them is built for the purpose.**

1. **The detached barn or field house.** The eighteenth-century smuggling record gives the
   clearest statement, because for once the historians ask the question directly: "many hidden
   cellars and remote barns could have been used for storage so it is unlikely that tunnels
   would have been needed at that period when large armed gangs operated openly"
   (CONFIRMED-digest, 2026-08-23, on the Hawkhurst Gang). Remote barns are the default shelter
   for goods and, by the same logic and the same network, for people.
2. **The inn on the road.** The Hawkhurst Gang's own bases are inns: the Oak and Ivy at
   Hawkhurst and the Mermaid at Rye, "where they would sit with their loaded weapons on the
   table", supported by "a network of safehouses, agents, and up to 200 horses"
   (CONFIRMED-digest, 2026-08-23). The catalog's hamlet tier already carries `Wayside inn`
   (L382) and that is this row's named host wherever the settlement has one.
3. **The subterranean store the settlement already dug.** At thorp scale the only below-grade
   volume the catalog offers is `Communal root cellar` (L104). Family A uses it for goods; family
   B uses it for a night. This is the tranche's cleanest instance of a general law: **a
   clandestine function occupies the settlement's existing exceptional volume before it ever
   makes one.**

**The frontier case, where the shelter DOES become a building: the bastle house.** Along the
Anglo-Scottish border in the sixteenth and early seventeenth centuries — the reiver country —
the ordinary farmstead is rebuilt as a defensible unit, and the resulting type is the closest
thing in the British record to a purpose-built rural safe house. Its measured characteristics:
"extremely thick stone walls (about one meter thick)"; a "ground floor devoted to stable space
for the most valuable animals"; "a vaulted stone or flat timber floor between it and the first
floor"; "the family's living quarters ... on the floor above the ground", which "during the times
before the suppression of the reivers, were only reachable by a ladder which was pulled up from
the inside at night"; and windows that "were small or even only arrow slits" (all CONFIRMED,
en.wikipedia.org/wiki/Bastle_house, fetched 2026-08-23). A digest adds that the ground-floor
doorway is "a single narrow doorway set in the middle of the gable wall" (CONFIRMED-digest,
2026-08-23).

Read as a grammar, the bastle is four rules: **byre below, hall above, one narrow entrance in the
gable, and a removable vertical connection.** The last is the one that matters to this dossier
and to the undercity: *the bastle's stair is a REMOVABLE LADDER, so the building's circulation
graph is different at night from what it is by day.* A criminal or defensive building's
circulation is a STATE, not a fixture — which is the same law the undercity's connectivity
charter states for edges ("connectivity is state — sever without delete", §311.9's law 5),
arrived at from above ground.

**Live/work.** The affiliate household lives normally and works normally; nothing about its
dwelling reads as criminal. The sheltered person does not live there — the practice is measured
in nights, not seasons. This bounds the sheltering cell hard: it needs somewhere to lie and
nothing else. No hearth (a fire is a signal), no window (a window is a witness), no fixed bed.

**Siting/anchor law.** Two anchors, and they are opposites. (i) The ROAD, for the affiliate:
"bandit groups operating the surrounding roads. Information, shelter, and supply flow both ways"
— the household must be reachable from the road and able to see it. (ii) The BACK OF THE HOLDING,
for the shelter itself: the volume used is the one furthest from the road and nearest the wood or
the water. A settlement with both a road and an edge therefore sites this family's two halves at
opposite ends of the same parcel, which is a legible and drawable fact.

**Prosperity and wear.** This family barely has a prosperity ladder, and pretending otherwise
would be padding. Floor and ceiling are nearly the same building. What prosperity buys is a
SECOND DETACHED OUTBUILDING (a wealthier farm has a barn AND a byre AND a cart shed, so the
shelter is less conspicuous), and at the frontier it buys the bastle's stone. Decline sheds the
outbuildings, which paradoxically DESTROYS the practice's habitat — a poorer settlement is a
worse place to hide, because there is nowhere unwatched.

**Era grades.** The barn-and-cellar shelter is available at every era. The bastle is tightly
gated: "typically built in the 16th or early 17th cent." and geographically restricted to the
Anglo-Scottish border (CONFIRMED, Wikipedia, fetched 2026-08-23) — in engine terms a
`frontier`/`raided` condition, not a date, since the mechanism travels and the century does not.

**(b) Measured.**

- **Bastle wall thickness: about 1 metre** (CONFIRMED, en.wikipedia.org/wiki/Bastle_house,
  fetched 2026-08-23).
- **Bastle ground-floor entrance: a single narrow doorway in the middle of the gable wall**
  (CONFIRMED-digest, 2026-08-23). **No width figure was obtained.**
- **Bastle windows: "small or even only arrow slits"** (CONFIRMED, same). No dimension.
- **Bastle plan dimensions: NOT FOUND.** The RCHME survey of the Chesterwood bastles is cited by
  a gazetteer as containing measured dimensions but the gazetteer page was not opened and the
  RCHME report was not reached. This is **ledger item L.3** and a P1c work order: the bastle is
  the corpus's best candidate for a measured DEFENSIBLE FARMSTEAD and its plan is missing.
- **The sheltering volume itself:** the only dimensioned concealed rural cell obtained anywhere
  in this tranche is §1.1's priest-hide pair, and those are gentry-house hides, not farm ones.
  Used as the BOUND rather than the type: a human-occupiable hide runs from about 0.79 m by
  1.52 m in plan (the bread-oven hide) to 0.91 m by 2.44 m (the swinging-beam hide), with
  headroom 1.14-1.52 m — i.e. **a hide is a space you lie or crouch in, never one you stand in.**
  That single sentence is the most transferable measured fact in the family.
- **The night's capacity:** Baddesley Clinton's sewer hide held "six or seven people with their
  clothes and the equipment required for a Mass" on one account and "at least a dozen" on
  another, with nine recorded for four hours in October 1591 (CONFIRMED-digest, 2026-08-23).
  **Contested; carried as 6-12.**
- **NOT FOUND, searched:** any measured plan of a barn identified as a smugglers' or outlaws'
  store; any dimension for the "cellar" of the catalog's own thorp description; any survey of a
  bandit refuge in the continental record.

**(c) Contested and counterexamples — the negation searches.**

(i) **"The outlaw shelter is not a building."** Run as the family's primary negation and
CONFIRMED in the strong direction: nothing in this lane's reading gives an outlaw shelter its own
structure anywhere outside frontier conditions. The catalog's own text agrees. **This is a
positive finding, not a gap:** the row should draw NO_BUILDING and the DW rule that generates it
should attach a FLAG to an existing building rather than mint one.

(ii) **The counterexample that nearly works, and why it does not.** The bastle house IS a
purpose-built rural defensible dwelling, so it looks like a refutation. It is not, for two
reasons: it is built by the VICTIM of raiding as much as by the raider (both sides of the border
built them), and it houses the household and its stock, not a fugitive. It is the frontier's
NORMAL FARM, not a criminal type. Reported because the distinction is exactly the kind a grammar
gets wrong: a settlement under raiding pressure should get bastles as its ordinary farmstead
parti, and giving them to the `Bandit affiliate` row instead would be a category error.

(iii) **The affiliate is a RELATION, not an institution, and the engine has no relation.** The
catalog row describes a two-way tie between households in this settlement and a group OUTSIDE
it. Nothing in the institution model can express "this settlement's household is affiliated with
an off-map actor". R-INST-5 raised the same shape as its finding (1) — DW needs an OCCUPATION
relation distinct from construction — and this is its sibling: **DW needs an AFFILIATION relation
distinct from presence.** Two tranches, two independent routes, one missing relation kind. §Σ
elevates it.

(iv) **Harbouring is not always criminal, and the same volume serves sanctuary.** The medieval
church's right of sanctuary, the pilgrim's night in a barn, and the recusant hide are all the
same act performed with different legal valence. As in family A, the architecture cannot tell
them apart, and the projection tier must.

**(d) CIRCULATION typology (§452).**

- **thorp `Outlaw shelter` — NO_BUILDING.** The circulation is a HOST's. Two classes appear:
  `EXTERIOR_WALK` (the yard route from the dwelling to the detached outbuilding — this family's
  defining circulation, and the reason the shelter is deniable, since nobody passes through the
  house) and a `VERTICAL` joint into the volume (a ladder to a loft, a trap to a pit). **The
  EXTERIOR_WALK is the finding:** the family's entire circulation grammar is that the sheltered
  route never enters the licit building.
- **hamlet `Bandit affiliate` — NO_BUILDING.** Same as above, plus the ROAD-SIDE THRESHOLD where
  supply and information change hands: a gate, a barn door, an inn's stable yard. Where the host
  is the wayside inn, the inn's own gateway passage governs and R-INST-4 holds its bucket.
- **The bastle, as the frontier variant of the same function:** `LOBBY` is absent, `CORRIDOR` is
  absent, and the vertical connection is a `LADDER` that is REMOVED at night — a circulation
  edge with a STATE, exactly as §1 anchor six's lodge and the undercity's edges have.
  Ground-floor entrance: one, narrow, in the gable. **Width bucket, DERIVED and flagged:**
  0.7-0.9 m for a bastle's byre door (DERIVED from the requirement that stock pass singly and
  that the opening be defensible; no measured source — part of ledger item L.3).
- **No `THROUGH_ROOM` enfilade, no `SCREENS_PASSAGE`, no `GALLERY`, no `STAIR_HALL` at any rung.**
  Stated affirmatively so the absence is a licensed absence rather than an omission.

**(e) STORAGE typology (§453).**

- `STORE` — the barn. Light: ANY (a barn is lit; that is not the secret part). Size: the host's.
  Adjacency: DETACHED, which is the whole point, and which §453's adjacency vocabulary can
  express only as a negative.
- `CELLAR` — the catalog's own word. At thorp tier this is the `Communal root cellar` and the
  family MINTS NOTHING; at hamlet tier a household cellar. Light: NONE. **Prohibition: no
  external cellar flap on the road side** — a below-grade store that opens toward the road is
  useless for this function and useful for family C's, and the two must not share a rule.
- `ATTIC` / `GARRET_STORE` — the loft over the byre or the barn, reached by ladder. The most
  frequently attested sheltering volume in the folk record and the one with the best circulation
  argument (one ladder, one hatch, one person can watch it).
- `CLOSET` — absent. There is nothing small to hide here; the thing hidden is a person.
- **PROHIBITIONS.** (i) No hearth in the sheltering cell. (ii) No fixed bedstead — a bedstead in
  an outbuilding is evidence, and the fixture is straw or a pallet. (iii) The sheltering cell
  must not be the same cell as the family's food store, because a searcher enters the food store
  legitimately. That third one is a genuine historical inference from the search-and-forfeiture
  regime and is flagged PLAUSIBLE.

**(f) Typed proposal.**

- **parti ids:** none new for the two catalog rows — they attach to `FARMSTEAD_YARD` (DWR1A's
  and R-INST-2's rural group) and to R-INST-4's `WAYSIDE_INN`. One new parti is proposed for the
  frontier condition only: **`BASTLE`** — a two-cell vertical stack, byre below, hall above, one
  gable entrance, removable vertical link, walls at the thickest bucket.
- **functions[]** — this family adds FLAGS to a host rather than functions to a plan:
  `shelter_night` (occupies an existing `STORE`, `CELLAR` or `ATTIC` cell), `handover` (occupies
  an existing threshold). Ladder: none — the family has no prosperity ladder and says so.
  For `BASTLE`: floor `byre`, `hall`; ceiling adds `chamber`.
- **fixtures[]:** `pallet` (**NO TYPED HOME**; `bed` is wrong — a bed is furniture, a pallet is
  its absence), `ladder` (**NO TYPED HOME**), `hatch` (**NO TYPED HOME**), `bar`/`drawbar` on the
  byre door (**NO TYPED HOME**; the FURNISHING_KINDS `bar` means a tavern bar, and the collision
  is worth flagging to DW-0 so a drawbar is never typed as one).
- **structural buckets:** `thickWall` (bastle only), `removableVertical` (bastle; and the
  general case of a circulation edge with a state), `detachedOutbuilding` (a PARCEL-level
  requirement, not a building one — the family needs the parcel to hold more than one structure,
  which is a fabric fact DW reads rather than draws), `noHearth` (a negative structural bucket,
  which the contract currently has no way to express).
- **licensing fields:** tier × siting (road present) × prosperity (outbuilding count) × era
  (`BASTLE` gated on a `raided`/`frontier` condition, never on a century) × culture (neutral).
- **criminal-share dial, as a CLOSED ENUM:** `shelterGrade: NONE | OCCASIONAL | STANDING`.
  NONE draws nothing. OCCASIONAL flags one existing detached cell as `shelter_night`-capable and
  adds a pallet. STANDING additionally licenses the road-side `handover` threshold and, where the
  settlement is under raiding pressure, permits the `BASTLE` parti for the affiliated household.
  **There is no ORGANISED rung in this family** — organised sheltering is family C's network and
  family E's front, and the ladder deliberately stops.
- **verdict per tier:** thorp **NO_BUILDING** · hamlet **NO_BUILDING** (host: the affiliated
  household's farmstead; the wayside inn where present) · at village tier and above the rows do
  not exist, and the function migrates to `Smuggling network`'s waypoints and to `Front
  businesses`. The migration is correct and the catalog should not be asked to carry the row
  upward.
- **HOME tags:** `shelter_night` → HOME: `ROOM_KINDS.store` / `ROOM_KINDS.cellar` (occupied, not
  minted). `handover` → **NO TYPED HOME** (a threshold is not a room; the nearest is
  `ROOM_KINDS.main`, which is wrong). `byre` → **NO TYPED HOME** — the engine has no animal
  cell at all, which is a real gap for a program that intends to draw farmsteads. `hall` →
  HOME: `ROOM_KINDS.hall`. `chamber` → HOME: `ROOM_KINDS.chamber`.

**(g) Consequences for the grammar.** Three.

1. **A circulation EDGE must be able to carry a STATE.** The bastle's ladder is pulled up at
   night; the priest hide's panel is closed; the undercity's flooded gallery is severed. All
   three are the same construct. §452's `CirculationCell` contract has `joints[]` but no state on
   an edge. Proposal: `edgeState: PERMANENT | REMOVABLE | SEALED | FLOODED`, aligned by name with
   the undercity's own posture vocabulary so the two never diverge.
2. **An AFFILIATION relation is missing** (see (c) iii). It composes with R-INST-5's OCCUPATION
   relation as a pair: DW needs to say that an institution OCCUPIES a structure it did not build
   and that a household IS AFFILIATED WITH an actor that is not present.
3. **A NEGATIVE structural bucket is unrepresentable.** "This cell must have no hearth" and "this
   cell must have no window" are licensing facts here, and every current bucket is an
   affirmative requirement. Proposal: allow `prohibits[]` beside `requires[]` on a Function.

**(h) Continental vs English.** The English record's outlaw is a legal status; the continental
analogues are territorial. The Neapolitan and Calabrian *brigantaggio*, the Iberian *bandolerismo*
of Catalonia and Andalusia, and the Balkan *hajduk* / *klepht* traditions all describe bands
based in terrain rather than in settlements, supplied by villages that host nothing — which
CORROBORATES the NO_BUILDING verdict from a second register rather than complicating it. The one
continental type that does what the bastle does is the fortified farm of contested frontiers:
the *maison forte* of the French Midi and the Alps, the *casa torre* of the Basque country and
Tuscany, the *kula* of the Balkans, the Transylvanian fortified church precinct into which a
whole village's stock and stores withdraw. Two of those invert the bastle's rule in a way worth
recording: the *casa torre* is URBAN and its single entrance is at FIRST-FLOOR level reached by a
removable external stair, and the fortified church precinct is COMMUNAL, so the shelter is a
public institution rather than a household's outbuilding. Where a setting's frontier response is
communal rather than domestic, this family's function moves out of the farmstead entirely and
into R-INST-3's precinct — the grammar should read which response the settlement has rather than
assume the English one.

**(i) Fantasy note.** None.

---

## §4 · FAMILY C — the smuggling ladder and the dug network: `Smuggling waypoint` (hamlet L349) · `Smuggling network` (village L865, city L1998) · `Underground network` (village L880, town L1440, city L1959) · `Smuggling operation` (town L1424) · `Underground city` (metropolis L2383)

Eight rows, the tranche's largest family, and the one that meets the landed engine most
directly: three of the eight (`Underground network` at village, town and city) are the D6
UNDERWAYS rows that already carry `facets: { clandestine, subterranean }` and
`forbiddenResources: ['marshlands','fertile_floodplain']`, and their derived underside is UC-4's
`colonization.js` on the branch of record. This family therefore has TWO jobs: describe the
surface program, and state precisely where the surface program joins what the engine already
derives.

**(a) Analogue.** The ladder in the catalog's own words runs: a hamlet through which "goods pass
... to avoid toll roads or customs checkpoints. The hamlet benefits from fees paid in kind"
(L349) → a village where "goods move through ... avoiding tolls or legal scrutiny. Usually tied
to a specific commodity" (L865) → a town "illicit goods trade. Tax evasion" (L1424) → a city
"organized contraband trade" (L1998); beside it the dug ladder runs "dug smuggling passages
beneath the village" (L880) → "a dug network of smuggling tunnels and cellars" (L1440) → "an
extensive warren of smuggling tunnels beneath the city" (L1959) → "extensive tunnels and
catacombs repurposed as criminal and refugee sanctuary" (L2383). **The two ladders are different
things and the catalog is right to separate them:** the first is a TRADE, whose architecture is
storage and threshold; the second is an EXCAVATION, whose architecture is a route.

**The trade ladder's architecture is entirely conventional storage in unconventional places.**
The eighteenth-century English record is emphatic. Contraband arrived in standardised units —
a tub was "a small cask, flat on one side, oval on the other", carried in pairs slung over a
packhorse, the spirit half-anchors "holding about four gallons apiece" and the tea in "oilskin
bags ... holding from a quarter to half a hundredweight each" (CONFIRMED-digest, 2026-08-23) —
and it was stored in whatever volume was to hand: tubs "hidden in recesses in walls, chimneys,
holes in floors and other hidey-holes", and goods "in holes dug in sand-dunes, in haystacks, in
vaults in parish churches, and in concealed cupboards built into large hearths in village inns,
before being sent to warehouses south of London" (CONFIRMED-digest, 2026-08-23). Note the
progression inside that one sentence: **dune → haystack → church vault → inn hearth → warehouse.**
That is the family's whole prosperity ladder, given by a single source, and it runs from a hole
in the ground to a licit bonded building.

**The waypoint is a THRESHOLD WITH A FEE, and the catalog says so.** "The hamlet benefits from
fees paid in kind" (L349). This is the most important sentence in the family, because it makes
the waypoint an ECONOMIC INSTITUTION rather than a hiding place: the settlement is paid to be
passed through. Architecturally that means a place to stop, water and change animals — a yard, a
pound, a barn — and it means the whole settlement is complicit, which is why nothing needs
hiding. The Hawkhurst logistics confirm the scale of what has to be accommodated: "up to 200
horses", able to mobilise "100 men or more" (CONFIRMED-digest, 2026-08-23). **A hundred men and
two hundred horses do not fit in a cellar.** They fit in a field, a drove road and a barn yard,
and the honest architecture of a waypoint is a YARD.

**The dug ladder is the rare case and needs a reason to exist.** §1.2 established the negation:
of the sites claimed as smugglers' tunnels "most of these sites have much humbler origins as
drainage tunnels, cellars, follies, etc.", and smugglers "would rather carry goods at night on
packhorses rather than drag them for long distances along wet, low passages" (CONFIRMED,
kurg.org.uk/tunnels-and-secret-passages, fetched 2026-08-23). So the dug row's licence must be a
POSITIVE, SPECIFIC reason, and the record gives exactly two:

1. **Something to bypass.** The catalog's own hamlet text names it — "to avoid toll roads or
   customs checkpoints" — and the engine's own licence is the same fact:
   `license: 'WALL_OR_TOLL_AND_CRIMINAL_SHARE'` in `colonization.js`, resolved on
   `defenseProfileHasWalls` (CONFIRMED by reading the file at `f1e4d515`). A bypass needs
   something to bypass; where the settlement has no wall and no toll, the dig is irrational and
   the row should not fire.
2. **Density.** In a terrace where houses share party walls, the "tunnel" is nearly free: at
   Deal, "concealed cellars and interconnecting tunnels ... contraband would have been rushed
   from cellar to cellar" (CONFIRMED-digest, 2026-08-23). The dug network at village tier is
   implausible and at city tier is nearly inevitable, and the reason is not criminality but
   PARTY WALLS.

**The one credible long bore, and its shape.** Hayle, Cornwall: "a sloping trench leads down from
ground level to the arched tunnel entrance, where the hinges for a gate or door can still be
seen ... runs due north for hundreds of yards", walkable "only in a stooping posture", with "a
drainage gulley along its length to keep the flat floor dry" (CONFIRMED,
smuggling.co.uk/gazetteer_sw_13.html, curl-fetched 2026-08-23). And KURG's Pegwell Bay candidate:
"low, artificial", about 500 feet long, about 7 feet in diameter, with an old pistol and three
exciseman's tunic buttons found in it (CONFIRMED, kurg.org.uk, fetched 2026-08-23). **Two bores,
two very different sections** — one stooping-height with a gulley, one 7 ft round — and the
7 ft one is almost certainly an engineered work reused. Both are carried.

**The `Underground city` row is a DIFFERENT act from the rest of the family and belongs here
anyway.** "Extensive tunnels and catacombs REPURPOSED as criminal and refugee sanctuary" (L2383)
— repurposed, not dug. It is the metropolis rung of the dug ladder only in the sense that its
extent is greatest; causally it is an OCCUPATION of pre-existing void, which is exactly
R-INST-5's finding (1) (DW needs an OCCUPATION relation distinct from construction) arriving
from a third direction. Its historical analogues are quarries and catacombs under cities that
outgrew them, and the row's own word "refugee" makes it the only entry on the Criminal shelf
whose population is partly non-criminal. It sits in family C rather than family D because its
licence is the undercity's colonization of existing void, not the surface fabric's density.

**Live/work.** Nobody lives in the trade ladder's buildings as a smuggler; they live in them as a
farmer, an innkeeper or a merchant. The dug ladder houses nobody at all — with the single
exception of `Underground city`, whose "sanctuary" reading implies residence, and whose residence
implies air, water and waste, which no other row in this family needs. That is a hard structural
distinction and the (f) proposal keeps it.

**Siting/anchor law.** The engine has already ruled this and the dossier does not re-derive it:
the smuggler cellar anchors at a GATE or a WATERFRONT (`smugglerLicence` in
`monotoneComponents.js` reads `defenseProfileHasWalls` for the gate half and the settlement's own
`tradeRouteAccess` in `coastal|port|river` for the waterfront half), and the smugglers' tunnel
anchors at the same two, joining through `stair`/`gate` inland and `sluice`/`waterfront` on the
water (`colonization.js`). The historical record agrees on both anchors and adds a third the
engine does not carry: the PARISH CHURCH, whose vault appears in the storage list above and whose
Kentish and Sussex examples (a tunnel to a churchyard to hide goods under a grave mound; a church
with a large cellar and a tunnel to tombs) are the most-repeated single motif in the local
literature (CONFIRMED-digest, 2026-08-23). **The church is a smuggling anchor and the engine has
no licence for it** — but the engine DOES already derive a crypt under every burying institution
(UC-2's `crypt` row, licensed by `institutionSubstructure = crypt`, joining through a
`stair` at a "church stair"). §Σ proposes the join rather than a new licence.

**Prosperity and wear.** Floor: a hole in a dune or a hayrick — no building at all. Rung 1: the
concealed cupboard in a hearth (the priest-hide volume, reused). Rung 2: the house cellar with a
street flap. Rung 3: the cellar chain through party walls. Rung 4: a dedicated store behind a
licit warehouse. Ceiling: the licit BONDED warehouse itself, which is the family's most
interesting endpoint and is treated in (e). Decline seals: an abandoned run is bricked, not
filled, which is the undercity's own "sever, never delete" and its fossil vocabulary.

**Era grades.** The trade ladder is available at every era; the specific EXCISE regime that makes
it lucrative is not, and the honest engine reading is that the row's strength should track the
settlement's TOLL/CUSTOMS apparatus rather than a century. The dug ladder's density rung requires
terraced party-wall building; the bonded-warehouse ceiling requires a state with a customs
bureaucracy, which is late.

**(b) Measured.**

- **Tunnel section, candidate 1 (Hayle):** stooping height, i.e. roughly **1.4-1.6 m** clear
  (DERIVED from "only in a stooping posture" plus the source's own note that "in the last two
  centuries, the average stature has risen considerably, so possibly 17th century smugglers could
  have walked upright"); flat floor with a longitudinal drainage gulley; arched mouth with door
  hinges; length "hundreds of yards" (CONFIRMED, smuggling.co.uk, curl-fetched 2026-08-23).
- **Tunnel section, candidate 2 (Pegwell Bay):** **about 500 feet (152 m) long, about 7 feet
  (2.13 m) in diameter** (CONFIRMED, kurg.org.uk, fetched 2026-08-23).
- **Cargo module:** spirit half-anchor **about 4 gallons (about 18 litres) per tub**, carried in
  PAIRS; tea in oilskin bags of **a quarter to half a hundredweight (about 12.7-25.4 kg) each**,
  also in pairs (CONFIRMED-digest, 2026-08-23). **Number audit, performed:** a packhorse load is
  therefore about 8 gallons (36 litres, roughly 0.036 cubic metres of liquid plus cask) or about
  25-50 kg of tea. A hundred-horse run is on the order of **3.6 cubic metres of spirit** or
  **2.5-5 tonnes of tea** — which is a BARN, not a cellar, and independently confirms §1.2's
  economic argument.
- **Bonded storage, the licit ceiling (London Docks):** "50 acres of warehouse space, containing
  20 warehouses, 18 sheds and 17 vaults, with the vaults covering around 20 acres of cellarage,
  built with ventilated vaulting"; an Act of 1807 funded "Customs and Excise offices, barracks
  for the Military Guard, and a wall to enclose the Export Dock ... required for the security of
  bonded goods"; and early West India Dock plans "omitted quay sheds because Customs and Excise
  considered them a security risk" (all CONFIRMED-digest, 2026-08-23). **The last clause is the
  most useful sentence in the family**: a customs authority deletes a building type because a
  roofed space beside a quay is an unwatchable space. Security is expressed as ABSENCE of a
  building.
- **Undercroft, the measured licit below-grade cell** (the type the smuggler cellar is a subset
  of): a thirteenth-century undercroft "measures approximately 10m by 6m and is 3m high, with
  three bays deep featuring groined rib vaulting rising from two round piers"; another, "of chalk
  ashlar and rubble ... four bays of quadripartite rib vaulting, measuring 54 ft x 16 ft 8.5 in
  with an overall height of 11 ft" (both CONFIRMED-digest, 2026-08-23, of Historic England list
  entries; **historicengland.org.uk returned 403 to this lane and is GATED**, so neither figure
  is quotable as primary). **Number audit, performed:** 54 ft x 16 ft 8.5 in = 16.46 m x 5.09 m,
  height 11 ft = 3.35 m — so the two undercrofts bracket a consistent type: **5-6 m span, 3-3.4 m
  headroom, length 10-16.5 m in three or four bays.** That is a real measured bucket and it is
  the one §453's `UNDERCROFT` class should carry.
- **Undercroft access:** "entered using original steps from a doorway dressed with Caen stone",
  "originally ... entered from the outside through a doorway and down a flight of steps on the
  property" (CONFIRMED-digest, 2026-08-23). **The medieval undercroft's stair is EXTERNAL** —
  which is why it is the smuggler's cell of choice: it can be reached without entering the house,
  and its joint is the engine's own `stair` at a "cellar door".
- **NOT FOUND, searched:** a measured plan or section of ANY cellar identified in a survey as a
  smuggler's cellar; the Deal Middle Street conservation-area appraisal itself (it exists as a
  Kent Planning Department publication and was not obtained — **ledger item L.4**, a P1c work
  order); any dimension for a party-wall cellar breach.

**(c) Contested and counterexamples — the negation searches.**

(i) **"Smugglers' tunnels are mostly folklore."** Run as the family's primary negation and
CONFIRMED strongly — this is the tranche's largest discrepancy bucket and §1.2 holds the full
statement. The separation this dossier draws: **ATTESTED** — cellars, barns, church vaults,
hearth cupboards, cellar-to-cellar doors, and two long bores of uncertain original purpose;
**LEGENDARY** — the long passage from an inn to a church or a cliff, of which "just about every
church and large house has its accompanying secret passage rumour but nobody seems to know where
it is" (CONFIRMED, kurg.org.uk, fetched 2026-08-23). Two named legend cases were checked and both
failed: the Ship Inn at Porthleven "was once a smuggling inn said to have had secret passages,
although none have been discovered", and a search by the landlord for the Methleigh Manor tunnel
"revealed no trace" (CONFIRMED-digest, 2026-08-23). A third, at Bideford, has "a tradition that a
smugglers' tunnel runs from the cellar several miles westward to Abbotsham cliffs"
(CONFIRMED-digest) — several miles, which is the tell.

(ii) **The counterexample to the counterexample.** The Gunwalloe Cove tunnel "once led from a
cave by the beach to the village church of St. Winwaloe", and the Hayle tunnel is judged
authentic on structural grounds (CONFIRMED-digest and CONFIRMED respectively, 2026-08-23). The
honest verdict is not "no tunnels" but **"tunnels are rare, short-to-moderate, usually reused,
and always have a reason"** — which is exactly the form of licence the engine already implements.

(iii) **The engine's own licence is NARROWER than the record and the dossier says so.**
`colonization.js`'s smugglers' tunnel resolves on the WALL alone, because "the TOLL half has NO
TYPED HOME: no engine accessor exists and the catalog's toll rows ('Toll bridge', 'Customs
house', 'Gates (if walled)', "Harbour master's office") carry no facet a chokepoint read could
resolve, and a name-list match is REFUSED BY NAME everywhere in this train" (CONFIRMED by reading
the file's own comment at `f1e4d515`; the slot is deferred as D-UC0-2). The historical record
puts the TOLL at least on a par with the wall — the catalog's own hamlet row names tolls and
customs and not walls. **This dossier's recommendation is therefore not "widen the licence" but
"give the toll a facet"**: an `institutionRevenue: toll | customs | none` declared kind, resolved
through the same chokepoint, would wake the inert half without a name list. §Σ carries it.

(iv) **A conflict between the two engine floors, reported with both sides.**
`monotoneComponents.js` licenses the smuggler CELLAR at `criminalShare >= 0.45`
(`smugglerShareFloor`, chosen by a 420-settlement sweep because "the criminal-share corpus is
LUMPY, not smooth (p25 0.275, p50 0.371, p75 0.500, p90 0.575)"), while `colonization.js`
licenses the smugglers' TUNNEL at `criminalShare >= 0.35` (`smugglerCriminalFloor`). Both figures
are deliberate and measured, and both are PROVISIONAL until the tuning signature. **The
consequence is that a settlement in the 0.35-0.45 band gets a dug TUNNEL and no smuggler CELLAR
— a bypass with nowhere to put the goods.** That is not obviously wrong (the tunnel's cargo may
go straight to a barn), but it is a composition the historical record finds odd, and it is
recorded here as **ledger item L.5** for the tuning pass, with both sides stated and no
recommendation to change either number.

**(d) CIRCULATION typology (§452).** The richest circulation section in the tranche, because this
family's building program IS circulation.

- **hamlet `Smuggling waypoint` — NO_BUILDING.** `EXTERIOR_WALK` in a yard; the drove route
  through the settlement is a fabric fact, not an interior one. Where the wayside inn hosts,
  R-INST-4's gateway passage governs. **Nothing interior is licensed.**
- **village/town/city `Smuggling network` / `operation` — HOSTED.** Two graphs over the host's
  cells (family E's `TWO_PLAN_FRONT` in miniature). The public graph is the host's own. The trade
  graph is: `EXTERIOR_WALK` (yard or lane) → `VERTICAL` (an external cellar stair, the medieval
  undercroft's own arrangement) → `CELLAR`. **The external cellar stair is the family's signature
  circulation element** and it is licensed by the historical undercroft, not invented.
  **Width buckets:** external cellar stair 0.8-1.0 m (DERIVED from a tub-pair passing on a man's
  shoulders — the cargo module gives the width, which is the right way round; no measured
  source, flagged).
- **The CELLAR BREACH is a DOOR, and it is the family's most important circulation finding.**
  Deal's "rushed from cellar to cellar" (CONFIRMED-digest, 2026-08-23) is an opening in a party
  wall, and the party wall is a fabric object DW already reads (charter §3: "party walls" is a
  listed fabric input). **Proposed class: `PARTY_BREACH`** — a circulation edge between two
  BUILDINGS at below-grade level, with `edgeState` (see B(g)) and a width bucket of 0.6-0.9 m
  (DERIVED: a man with a tub, stooping; flagged). It is not a `CORRIDOR`, not a `THROUGH_ROOM`,
  and not any existing §452 class, because every existing class is intra-building.
- **The TUNNEL as a circulation class.** Two measured sections (above) give two buckets:
  **`TUNNEL_STOOP`** 0.9-1.2 m wide by 1.4-1.6 m high, flat floor, longitudinal gulley (Hayle;
  the width is DERIVED and flagged, the height is derived from "stooping posture"); and
  **`TUNNEL_BORE`** about 2.1 m diameter (Pegwell Bay, measured). Both carry a MOUTH which is a
  typed joint, and the Hayle mouth is specifically "a sloping trench ... to the arched tunnel
  entrance, where the hinges for a gate or door can still be seen" — **a tunnel mouth is a
  GATED THRESHOLD, not an opening**, and the hinges are the evidence.
- **`STAIR_HALL`, `GALLERY`, `LONG_GALLERY`, `SCREENS_PASSAGE`: absent at every rung.** Stated so
  the absence is licensed.
- **`Underground city` (metropolis) is the one row that licenses a below-grade GALLERY**, because
  it is the one row with residents: a repurposed quarry or catacomb has working galleries by
  construction, and people living in them need a circulation spine. Its class is
  `GALLERY` with `lightReq: NONE`, and its licence is the pre-existing void, never a dig.

**(e) STORAGE typology (§453).** This family is the §453 family; almost every class appears.

- `CELLAR` / `UNDERCROFT` — **the primary cell.** Measured bucket from (b): 5-6 m span, 3-3.4 m
  headroom, 10-16.5 m long in three or four bays, at the licit merchant grade. Light: NONE.
  Access: EXTERNAL steps. Adjacency: under the host's own footprint. **This is exactly UC-2's
  `undercroft` / `smuggler_cellar` pair, and the join is one-to-one** (see §Σ).
- `STORE` — the barn, the shed, the loft. Light: ANY. The waypoint's whole storage program.
- **The BONDED vs UNBONDED distinction, which §453 asks for by name.** The licit ceiling of this
  family is a store the state locks: bonded goods sit in warehouses with "strict security
  measures due to excise duty requirements", behind a wall built expressly to enclose them, with
  Customs and Excise offices and a military guard on the same site, and with a building type
  (the quay shed) DELETED for security (all CONFIRMED-digest, 2026-08-23). The typed proposal:
  `STORE` gains `custody: OWNER | BONDED | SEIZED`, where BONDED demands an adjacent
  `revenue_office` cell and a controlled precinct entrance, and where the smuggler's whole
  business model is the arbitrage between OWNER and BONDED. **This is the cleanest example in the
  tranche of a criminal institution being defined by a civic one**, and it is the reason family I
  (the enforcement boundary) is a cross-reference rather than a silence.
- `ATTIC` / `GARRET_STORE` — the hayloft over the waypoint's barn. Light: ANY.
- `CLOSET` — the hearth cupboard: "concealed cupboards built into large hearths in village inns"
  (CONFIRMED-digest, 2026-08-23). **This is a FIXTURE-grade concealed store, and it is the same
  volume as the priest hide's chimney-stack cell** — the bread-oven hide at Harvington is 1.52 m
  by 0.79 m by 1.14 m, which is a very large cupboard or a very small room, and the two traditions
  are using the same masonry void for the same reason. Light: NONE. **Prohibition: a hearth
  cupboard may not be drawn where the hearth is in use for cooking** — the historical cupboards
  are in the thickness beside or above the fire, not in it.
- `PANTRY`, `BUTTERY`, `LARDER`, `STILL_ROOM`, `DAIRY`, `SCULLERY` — **absent from this family
  and licensed as absent.** Contraband is not a domestic provision and does not want the service
  end of a hall.
- **PROHIBITIONS, collected.** (i) No smuggler cellar without a gate or a waterfront (engine law,
  UC-2). (ii) No dug tunnel without a wall or a toll (engine law, UC-4; the toll half inert).
  (iii) No below-grade store at all on `marshlands` or `fertile_floodplain` — the catalog's OWN
  `forbiddenResources` on the three `Underground network` rows, whose stated reason is "tunnels
  flood", and which UC-0's `deriveStrataExistence` already honours by refusing the seed and
  recording it in `refused[]`. (iv) `Underground city` may not be drawn where no pre-existing
  void exists — occupation, not excavation.

**(f) Typed proposal.**

- **parti ids:** `WAYPOINT_YARD` (hamlet — a yard, a barn, a pound, no house of its own),
  `CELLAR_UNDER_TRADE` (village/town — the host's undercroft with an external stair),
  `CELLAR_CHAIN` (town/city — three or more adjoining `CELLAR_UNDER_TRADE` linked by
  `PARTY_BREACH`), `TUNNEL_RUN` (town/city — one licensed bore between two typed joints), and
  `OCCUPIED_VOID` (metropolis `Underground city` only — a pre-existing quarry or catacomb, never
  minted, only occupied).
- **functions[]** — floor: `store_contraband`, `threshold_handover`. Ladder rung 1: `conceal`
  (the hearth cupboard / false floor as a FIXTURE). Rung 2: `cellar_store` (a cell). Rung 3:
  `breach` (the party-wall door). Rung 4: `tunnel_mouth` + `run`. Ceiling (licit inversion):
  `bonded_store` + `revenue_office`. `Underground city` additionally: `dwell_below`, `water`,
  `waste` — the only row in the family that needs the last two.
  Shedding order: `run` → `breach` → `cellar_store` → `conceal`; `store_contraband` and
  `threshold_handover` are the floor.
- **fixtures[]:** `barrel` and `crate` (both existing FURNISHING_KINDS; the tub IS a barrel and
  needs no new kind), `rack`, `shelf`, `hatch` (**NO TYPED HOME**), `false_floor` (**NO TYPED
  HOME**), `gulley` (**NO TYPED HOME**; the drainage channel that makes a tunnel usable), `winch`
  (**NO TYPED HOME**; the Herstmonceux shaft's "primitive winch"), `gated_mouth` (**NO TYPED
  HOME**; hinges in an arched opening).
- **structural buckets:** `belowGrade`, `vaultedSpan` (the 5-6 m undercroft span),
  `externalStair`, `partyWall` (a FABRIC precondition, read not drawn), `waterTable` (the flood
  consequence UC-4 already derives at `floodDepth: 2`), `noLight`.
- **licensing fields:** tier × siting (`gate` | `waterfront` | `church` | none) × prosperity
  (the dune→barn→cellar→warehouse ladder) × era (bonded ceiling LATE) × terrain (the catalog's
  own `forbiddenResources`) × culture (neutral) × **`hasWall`/`hasToll`** (the dug rows only).
- **criminal-share dial, as a CLOSED ENUM:** `contrabandGrade: NONE | WAYPOINT | OPERATION |
  NETWORK | UNDERCITY`. The five rungs map one-to-one onto the catalog's own five names, which is
  the strongest argument for the enum: the catalog already IS the enum. NONE draws nothing.
  WAYPOINT licenses the yard and the barn. OPERATION licenses `conceal` and `cellar_store`.
  NETWORK licenses `breach` and, where `hasWall || hasToll`, `tunnel_mouth`. UNDERCITY licenses
  `OCCUPIED_VOID` and is the only rung that adds residence.
- **verdict per tier:** hamlet **NO_BUILDING** (yard + barn, hosted by a farm or the wayside
  inn) · village **HOSTED** (the commodity's own trade building — the catalog says "usually tied
  to a specific commodity", so the host is the trade that handles that commodity) · town
  **HOSTED** with the cellar as a real cell · city **HOSTED + BUILDING** (the network acquires a
  warehouse of its own, the licit form of which is the bonded warehouse) · metropolis
  `Underground city` **BUILDING (occupied, not built)**.
- **HOME tags:** `store_contraband` → HOME: `ROOM_KINDS.store`. `cellar_store` → HOME:
  `ROOM_KINDS.cellar`. `conceal` → HOME: `ROOM_KINDS.concealed` — **the engine already has this
  room kind and this is the one family whose use of it is historically exact.** `breach`,
  `tunnel_mouth`, `run` → **NO TYPED HOME** (all three are circulation, and §452's class set has
  no below-grade member). `bonded_store` → HOME: `ROOM_KINDS.store` with the proposed `custody`
  attribute. `revenue_office` → HOME: `ROOM_KINDS.counting`. `dwell_below` → HOME:
  `ROOM_KINDS.lodging`. `water`, `waste` → **NO TYPED HOME**.

**(g) Consequences for the grammar.** Five, and this family generates the tranche's two hardest.

1. **An INTER-BUILDING circulation edge is required.** `PARTY_BREACH` connects two buildings
   below grade. Every §452 class is intra-building and `FloorPlan` is per-building. Without this,
   the best-attested smuggling circulation in the record is inexpressible. Note that the
   undercity's UC-5 connectivity graph is exactly the right home for it — **so the recommendation
   is not to add it to DW but to have DW READ it from UC-5** (§Σ).
2. **A below-grade circulation class set is missing** from §452 entirely: the class list is a
   domestic-and-institutional list (through room, cross passage, corridor, gallery, lobby, stair
   hall) with nothing for a run, a bore or a breach. Proposal: `TUNNEL_STOOP`, `TUNNEL_BORE`,
   `PARTY_BREACH`, and reuse `GALLERY` below grade with `lightReq: NONE`.
3. **`STORE.custody` (OWNER | BONDED | SEIZED)** — the bonded/unbonded distinction §453 asks for,
   with its adjacency obligation.
4. **A cell must be able to be OCCUPIED rather than BUILT.** `OCCUPIED_VOID` is R-INST-5's
   OCCUPATION relation again, third instance.
5. **The `Underground city` row needs air, water and waste, and no other row in six tranches
   does.** A below-grade residence is the only building in the corpus whose survival depends on a
   service the surface takes for granted. Proposal: `lifeSupport[]` on a parti, closed vocabulary
   `air | water | waste`, required when a residence cell is below grade.

**(h) Continental vs English.** The English coast supplies the tub, the riding officer and the
folklore; it is parochial in one large way and one small one. The large one: **the continental
contraband problem is a LAND-BORDER problem**, and its architecture is the customs post and the
mountain path, not the beach and the cellar — the Pyrenean and Alpine smuggling traditions, the
Rhine and Meuse river trades, and the internal customs barriers of the *ancien régime* (the
*mur des Fermiers généraux* around Paris, whose whole purpose was to make a city-scale toll
enforceable) produce a type this dossier's English sources never show: **the bypass path around
a customs barrier, which is a ROUTE with no building at all until it reaches the barrier's
shadow.** That is precisely the engine's `WALL_OR_TOLL_AND_CRIMINAL_SHARE` licence, and it means
the engine's licence is CONTINENTAL in shape while its measured examples are English. The small
one: the Mediterranean *fondaco* and the Ottoman *han* handled the same problem from the
authority's side by concentrating foreign trade into ONE gated building (§15), which makes the
smuggler's bypass a bypass of a BUILDING rather than of a wall. Both readings are compatible and
both are safe to generalise, because the mechanism travels: **contraband architecture is always
the negative of the revenue apparatus in that settlement**, whatever the revenue apparatus is.

**(i) Fantasy note.** None. One cross-reference: R-INST-5's `magicLicense` proposal has a
consequence here that this dossier will not develop — in a HIGH world the bypass problem changes
character entirely, and any grammar that lets a teleportation circle exist beside a toll should
expect the toll's architecture to change. Recorded, not researched.

---

## §5 · FAMILY D — the street gang and the multi-occupied fabric: `Street gang` (town L1417 "Organized pickpockets and thugs. 10-30 members.") · `Multiple criminal factions` (city L1941 "Competing gangs. Turf disputes.")

**(a) Analogue.** These two rows are the tranche's hardest test of the NO_BUILDING verdict,
because everybody's mental image of them is a building — the den, the hideout, the gang's
headquarters — and the historical record does not supply one. What it supplies instead is a
FABRIC: a district whose morphology is the institution. The finding, stated first so the rest is
readable: **a street gang has a TERRITORY, a HAUNT and a WARREN, and of those three only the
haunt is a building, and the haunt belongs to somebody else.**

**The warren: the rookery as a morphology, measured.** Thomas Beames's 1850 survey describes the
St Giles rookery as "triangular, bounded by Bainbridge street, George street, and High street"
and its internal fabric as "like an honeycomb, perforated by a number of courts and blind alleys,
culs de sac, without any outlet other than the entrance" (CONFIRMED,
victorianlondon.org/publications5/rookeries-03.htm, fetched 2026-08-23). Three properties are
doing the work in that sentence, and each is drawable:

- **Perforation.** The block is entered at many points but connected internally, so the fabric
  reads as a single permeable mass rather than as a row of parcels.
- **Blind ends.** Most of those entries lead nowhere; the court is a bag.
- **One outlet per bag.** Each cul-de-sac has exactly one mouth, which is why the fabric is
  defensible: a watcher at the mouth sees everyone.

Beames's earlier chapter is honest about its own limits and this dossier is too: chapter 2 gives
no measurements at all and mentions St Giles only in passing (CONFIRMED, opened
victorianlondon.org/publications5/rookeries-02.htm, fetched 2026-08-23, and it contains none of
the figures the family needed). All the measured content is in chapter 3.

**The cells inside the warren, measured, and they are the smallest in the corpus.** From the same
chapter (all CONFIRMED, fetched 2026-08-23): a room **"six feet by five broad"** with eight
people; a room **"about 8 feet by 12"** with twelve; one house's three rooms occupied "first
room, by eight persons second by fifteen third by twenty-four"; a house with **100 persons** in a
night; a back-alley den "so low, that a tall man could not stand upright in it" with seventeen
occupants, its "floor was damp and below the level of the court"; and the ventilation audit —
**175 cubic feet of air per person on average, largest 605, smallest fifty-two.**

**Number audit, performed, because these figures constrain each other.** 6 ft x 5 ft = 30 sq ft
(2.79 sq m); at eight persons that is 3.75 sq ft (0.35 sq m) each. 8 ft x 12 ft = 96 sq ft
(8.92 sq m); at twelve that is 8 sq ft (0.74 sq m) each. Now take the average air supply of
175 cubic feet per person: at 3.75 sq ft of floor per person the ceiling would have to be
**46 feet high**, which is impossible, so the 175-cubic-foot average CANNOT be the average of
these worst rooms — it must be the average across a wider sample including better ones. And the
SMALLEST figure, 52 cubic feet per person, at the 8-by-12 room's 8 sq ft per person, implies a
ceiling of **6.5 feet**, which is exactly right for the type and matches the 1863 survey's
independent "not quite 6 feet" cellar. **The figures are therefore internally consistent once
the average is read as a sample average**, and the derived headroom bucket for this fabric —
**1.8-2.1 m** — is supported from two directions. This is the tranche's one genuine
cross-source numerical corroboration and it is what the (f) bucket rests on.

**The 1863 corroboration, and the cellar dwelling as the fabric's floor.** *More Revelations of
Bethnal Green* (1863) gives No. 59 Nichol Street: a window "a little over 3 feet in width, and
about the same in height", reduced by an area that "extends from the wall about 2 feet" to "a
chink 3 feet wide by 4 and a half inches in height"; the room "not quite 6 feet" high; a widow
and four children at "2s. a week"; the adjoining cellar holding a man, wife and six children; and
a party wall "bulged at the basement to the extent of at least 2 feet" (CONFIRMED,
mernick.org.uk/thhol/morevbg.html, fetched 2026-08-23). The same source gives the whole-house
density: "The first two adjoining houses that we looked into, of six rooms each, contained
forty-eight persons" — **eight per room, matching Beames's smallest room exactly** — and the rent
arithmetic: "For four such rooms as we have attempted to describe, there are paid on the whole
12s. a week; that is, 31l. 4s. per year."

**The plot geometry, from the survey record.** The Nichol was subleased from 1680 "usually in
plots giving a frontage of 16-20 ft. with a depth of 60 ft. for each house"; Nichol Street
existed by 1683; New Nichol Street was "new intended" in 1708; neighbouring survivors were
"three- or four-storeyed brick and tiled houses"; "at least 22 houses were built in Old Nichol
Street in 1801-2"; and "by 1827 there were 237 houses on the 5-a. Nichol estate" (all CONFIRMED,
british-history.ac.uk/vch/middx/vol11/pp103-109, fetched 2026-08-23). The 1890 slum declaration
and the clearance of "730 houses inhabited by 5,719 people" from 1891 is CONFIRMED-digest,
2026-08-23. **Number audit:** 5,719 / 730 = 7.8 persons per house at clearance, against 48
persons in two six-room houses (24 each) in the 1863 sample — so the 1863 sample is the WORST
case by a factor of three, not the average, and this dossier uses it as the FLOOR of habitability
and not as the type.

**The haunt: the one building, and it is a public house.** The gang's institutional building, in
so far as it has one, is the flash house — and Eleanor Bland's synthesis is careful that the
category is largely a DISCURSIVE one, "a shadowy and little-studied aspect of early 19th-century
London", where "it remains unclear where the flash houses fit in the changing landscape of
drinking spaces" (CONFIRMED, Bland, *History of the Human Sciences*, radar.brookes.ac.uk,
curl-fetched and pypdf-extracted 2026-08-23). What the sources DO establish about the premises:

- The anonymous *A List of Houses of Resort for Thieves of Every Description*, c.1815 (TNA,
  HO 42/146) enumerates **67 flash houses**, house by house, with a note on each, in a tone the
  article calls "factual and official; this is not a sensationalised guide for public
  consumption" (CONFIRMED, same). Henry Grey Bennett, chairing the 1817 Select Committee, treated
  it as of "undoubted" authenticity.
- What they contained: "flash houses provided spaces for drinking, lodging, and gambling, and
  ... the landlords typically received and sold on the stolen goods" (CONFIRMED, same). **Four
  functions in one house: bar, beds, gaming, fence.**
- What made them notorious was the mixing of populations, not a special room: watchmen "are
  always at the command of the landlord", and there are "sprinkled about the bars and parlours of
  the flash-houses, watchmen, whose silence is purchased with gin" (George Smeeton, quoted;
  CONFIRMED, same). **Bars and parlours** — the ordinary two-room drink house.
- The one genuinely distinctive interior fact is the WORKSHOP: at the Sun in Brownlow Street,
  Drury Lane, "Men (wearing Leather Aprons) who work at smith's Work, and who Manufacture the
  Implements for Housebreaking and also Screws or Skeleton Keys" (CONFIRMED, same).
- Age and scale: the Magpie in Skinner Street, Bishopsgate, was frequented by "50 to 60 Boys and
  Girls very Young but very desperate" (CONFIRMED, same). The catalog's own "10-30 members" for a
  street gang is therefore CONSERVATIVE against this datum by a factor of two, and the dossier
  reports the divergence without recommending a change: the List's figure is a house's clientele,
  not a gang's roster.
- **The lodging half is the crucial one for the fabric argument.** Mayhew's low lodging-houses
  are where the gang sleeps, and his measured specimen is the Farm House in the Mint: "forty
  rooms, 200 beds (single and double)", a yard that "covers an acre and a half", "three kitchens"
  of which the largest held "400 people" and had "two large fire-places", the main kitchen
  "detached from the sleeping apartments, so that the lodgers are not annoyed", a "washing-house,
  built recently" in the yard, and a "porter's lodge" at the entrance. The standard house
  averaged "52 single or 24 double beds" for about fifty persons, across roughly 200 London
  lodging-houses holding "no fewer than 10,000 persons"; beds were packed so that "their
  partition one from another admitted little more than the passage of a lodger", with
  "shake-downs, or temporary accommodation" between them; children paid "2d." and smaller
  children "1d." (all CONFIRMED, victorianlondon.org/publications/mayhew1-11.htm, fetched
  2026-08-23). Crucially the Farm House "stands away from any thoroughfare, and lying low is not
  seen until the visitor stands in the yard" — **the porter's lodge plus the invisible-from-the-
  street siting is the gang-adjacent building's entire security program.**

**Live/work.** Everybody lives in this fabric; nobody works in it in the trade sense. The
distinction that matters for a plan generator is that the rookery's buildings are DWELLINGS in
their program and INSTITUTIONS only in their occupancy — which is why the catalog's `Street gang`
row must not draw a building. It must MARK one.

**Siting/anchor law.** The rookery sites itself on the residue of an older layout: a triangle
between three streets, a former great-house garden subdivided, a liberty outside a jurisdiction.
The engine has an exact counterpart in UC-1's district enum — the `criminal` zone, which
`monotoneComponents.js` already uses as `SMUGGLER_ZONE`. **This family's siting rule is
therefore: it does not choose a site, it INHERITS the settlement's shadows district**, and if the
settlement has no such district the gang has no warren and only a haunt.

**Prosperity and wear.** The warren's ladder runs DOWNWARD: prosperity destroys it. The Old
Nichol's arc — subleased plots 1680, houses rebuilt 1801-2, 237 houses by 1827, slum declaration
1890, clearance 1891 — is a single-parcel biography of decline followed by demolition, and it is
the best available narrative model for DW's law 5 (stable anchors and dated renovation) applied
to the poor end. Wear is the fabric's most legible property: "windows stuffed up with rags, or
patched with paper", "walls of the houses mouldy, discoloured, the whitewash peeling off from
damp", "walls in parts bulging, in parts receding", "floor covered with a coating of dirt",
houses "so far below the level of the street, that, in wet weather, they are flooded" (all
CONFIRMED, Beames ch. 3, fetched 2026-08-23).

**Era grades.** The measured rookery is 1680-1891 English urban. The MORPHOLOGY — a permeable
block of blind courts with one mouth each — is much older and much wider (see (h)), so the
grammar should gate the FABRIC on density and jurisdiction rather than on a century.

**(b) Measured.** Consolidated, because this is the tranche's best-measured family.

| figure | value | source | label |
|---|---|---|---|
| smallest measured room | 6 ft x 5 ft (1.83 x 1.52 m), 8 occupants | Beames ch. 3 | CONFIRMED |
| typical measured room | about 8 ft x 12 ft (2.44 x 3.66 m), 12 occupants | Beames ch. 3 | CONFIRMED |
| persons per house, worst | 100 in one night | Beames ch. 3 | CONFIRMED |
| persons per room, three-room sample | 8 / 15 / 24 | Beames ch. 3 | CONFIRMED |
| air per person | 175 cu ft avg; 605 max; 52 min | Beames ch. 3 | CONFIRMED |
| derived headroom | 1.8-2.1 m | this dossier's audit above | DERIVED, flagged |
| cellar dwelling height | "not quite 6 feet" (about 1.8 m) | 1863 Bethnal Green | CONFIRMED |
| cellar window, nominal | just over 3 ft x 3 ft | 1863 Bethnal Green | CONFIRMED |
| cellar window, effective | 3 ft x 4.5 in (0.91 x 0.11 m) | 1863 Bethnal Green | CONFIRMED |
| legal minimum for a let cellar | 1 ft of light at pavement level, a fireplace, drainage, 7 ft (2.1 m) head | period statute, as reported | CONFIRMED-digest |
| plot frontage x depth | 16-20 ft x 60 ft (4.9-6.1 x 18.3 m) | VCH Middx XI | CONFIRMED |
| estate density | 237 houses on 5 acres (1827) | VCH Middx XI | CONFIRMED |
| clearance | 730 houses, 5,719 people (1890-91) | digest | CONFIRMED-digest |
| lodging house, standard | 52 single or 24 double beds, about 50 persons | Mayhew | CONFIRMED |
| lodging house, largest | 40 rooms, 200 beds, yard 1.5 acres, kitchen for 400 | Mayhew, Farm House in the Mint | CONFIRMED |
| London total | about 200 lodging-houses, 10,000 persons | Mayhew | CONFIRMED |
| flash houses enumerated | 67 | TNA HO 42/146 c.1815, via Bland | CONFIRMED |
| one flash house's young clientele | 50-60 | List of Houses of Resort, via Bland | CONFIRMED |

**The legal-minimum row is the most useful line in the table for a generator**, because it is a
CONSTRAINT rather than an observation: a lettable cellar needed "a window giving at least one
foot of light at pavement level, a fireplace, drainage and head room of at least 7 ft (2.1 m)",
"though cellars were often illegally rented in violation of these standards"
(CONFIRMED-digest, 2026-08-23). A grammar can draw the lawful cellar dwelling and the unlawful
one as the same cell with a `compliant: true|false` flag, and the 1863 specimen is the
non-compliant case measured.

- **NOT FOUND, searched:** any measured COURT WIDTH for a rookery court (the single figure this
  family most needs and does not have — **ledger item L.6**, a P1c work order; Booth's maps and
  the 1891 clearance surveys are the targets); any plan of a flash house; any measured plan of a
  low lodging-house.

**(c) Contested and counterexamples — the negation searches.**

(i) **"The gang had no building."** Run, and CONFIRMED. Nothing in the sources gives a gang
premises of its own. Every candidate turns out to be somebody else's licensed trade — a public
house, a lodging-house, a coffee shop. Bland's own conclusion is the strongest form of it: the
flash house is a category assembled by magistrates and journalists rather than an architectural
type, and "many so-called flash houses were beer houses" created by the 1830 Beer Act's relaxed
licensing (CONFIRMED, radar.brookes.ac.uk, extracted 2026-08-23). **A grammar that draws a gang
headquarters is drawing a genre convention, not a building.**

(ii) **The counterexample: the Farm House in the Mint is very nearly a headquarters.** Forty
rooms, a porter's lodge, invisible from the thoroughfare, a yard of an acre and a half, and
proprietors who were fences. It is a BUILDING with a GATEKEEPER and a criminal function, which is
as close as the record gets. Reported as the ceiling of the HOSTED verdict rather than as a
refutation: the building is a lodging-house that a gang uses, and its licence, its rateable
value and its trade are all lodging.

(iii) **The "rookery" word trap, restated because it bites twice.** §0.2's defect D6-2 established
that the catalog's `Rookery` rows are bird lofts. There is a second half to the trap: the
Victorian slum sense of "rookery" is itself a metaphor from the bird colony (a rookery is a
crowded, noisy, communal nesting mass), so the two senses are etymologically the same image and a
careless reader will merge them. **They must not merge in the grammar.** The bird loft is a
fixture on a roof (family G); the slum is a fabric condition (this family).

(iv) **A contested count.** The catalog's `Street gang` says "10-30 members" while the c.1815
List records a single house frequented by "50 to 60 Boys and Girls". Both are carried; the
difference is that one counts an organisation and the other counts a room's occupancy at a
moment. No recommendation.

**(d) CIRCULATION typology (§452).** This family's circulation is mostly URBAN, not interior, and
the dossier says so rather than inventing interior classes.

- **The fabric level (not a §452 class today, and this is the gap).** The rookery's circulation is
  the court: a bag with one mouth, entered from a street, giving onto house doors. §452's classes
  are all interior. **Proposed:** `COURT` as a fabric-level circulation class DW reads from the
  parcel data rather than draws — with `mouths: 1` as its defining attribute, which is R-INST-5's
  single-controlled-entrance finding at the block scale. Width bucket: **NOT FOUND** (ledger
  item L.6).
- **Interior, at the dwelling:** `THROUGH_ROOM` only, and often not even that — a room let to a
  family IS the dwelling, so the circulation is the stair and the landing. The one class that is
  genuinely licensed is a bare `STAIR_HALL` degenerate: a common stair serving one room per floor
  per family. **Width bucket, DERIVED and flagged:** 0.7-0.9 m for a subdivided-house common
  stair.
- **Interior, at the lodging-house:** Mayhew gives the arrangement precisely — beds whose
  "partition one from another admitted little more than the passage of a lodger", with the
  kitchen "detached from the sleeping apartments". That is a `THROUGH_ROOM` dormitory with
  aisle-gaps as its only circulation. **Aisle bucket, DERIVED from the quoted phrase:**
  0.45-0.6 m, i.e. one person edgeways. Flagged.
- **Interior, at the flash house:** "bars and parlours" — two public cells plus lodging above.
  `THROUGH_ROOM` and, where the house is a coaching type, R-INST-4's gateway passage.
- **`CORRIDOR`: not licensed** in the dwelling or the flash house at any era in this family. It
  IS licensed in the LARGE lodging-house at the top rung, because forty rooms cannot be reached
  enfilade — which is a nice instance of the charter's own rule that institutions license the
  corridor earlier than domestic work does.
- **`EXTERIOR_WALK`: heavily licensed.** The yard, the court, the passage between blocks. The
  Farm House's "porter's lodge" at the entrance is the type's control point and should be a
  first-class cell.

**(e) STORAGE typology (§453).** Sparse by nature, and the sparseness is the finding.

- `CLOSET` — absent as a cell; present as a FIXTURE at best (a shelf, a nail, a box under the
  bed). **A one-room family has no storage cell and §453's grammar must be able to say so.**
- `STORE` — licensed only at the lodging-house rung (the porter's store, the washing-house) and
  at the flash house (the drink store).
- `CELLAR` — present and INHABITED, which inverts the class: in this family the cellar is a
  DWELLING cell, not a storage cell, and it carries the compliance flag from (b). This is the
  only family in the tranche where `CELLAR` is a living space.
- `ATTIC` / `GARRET_STORE` — likewise inverted: the garret is let, not stored in.
- `PANTRY`, `BUTTERY`, `LARDER`, `STILL_ROOM`, `DAIRY`, `SCULLERY` — absent, licensed as absent.
  The lodging-house's three kitchens are COMMON cooking, not a service range; the "washing-house,
  built recently" in the Farm House yard is the closest thing to a `SCULLERY` and it is DETACHED.
- **PROHIBITIONS.** (i) No storage cell in a single-room let. (ii) The washing-house is detached
  where it exists. (iii) The common kitchen is detached from sleeping "so that the lodgers are not
  annoyed" (Mayhew's own reason, CONFIRMED) — an adjacency PROHIBITION with a stated cause, which
  is exactly the form §453 wants.

**(f) Typed proposal.**

- **parti ids:** `SUBDIVIDED_HOUSE` (a house of the ordinary parti, let by the room, with a
  degenerate common stair), `COURT_BLOCK` (a fabric-level parti: a permeable block of blind
  courts, one mouth each — DW reads it, the map draws it), `COMMON_LODGING_HOUSE` (Mayhew's type:
  porter's lodge, dormitories, detached common kitchen, yard, washing-house), and `FLASH_HOUSE`
  as a VARIANT FLAG on R-INST-4's public-house parti rather than a parti of its own — because
  Bland's evidence says the flash house is not architecturally distinct, and the honest model is
  a flag.
- **functions[]** — `SUBDIVIDED_HOUSE`: floor `let_room` (repeated), `common_stair`; no ladder,
  because subdivision is what DECLINE produces. `COMMON_LODGING_HOUSE`: floor `dormitory`,
  `common_kitchen`, `lodge` (the porter); ladder adds `washhouse`, `yard`, a second and third
  kitchen. `FLASH_HOUSE` flag adds `gaming` (R-INST-4's), `receive` (family A's) and, rarely,
  `alter` — the Sun's smiths.
- **fixtures[]:** `bunk` and `bed` (existing), `shake_down` (**NO TYPED HOME**; a temporary floor
  bed, and the record's own word), `hearth`, `cauldron`, `bench`, `table`, `bar`; and for the
  fabric, `porter_hatch` (**NO TYPED HOME**).
- **structural buckets:** `subdivision` (the room-count multiplier — see A(g)3's proposal, which
  this family independently requires), `lowHeadroom` (1.8-2.1 m), `belowGrade` with
  `compliant: true|false`, `detachedService` (the washhouse and kitchen), `singleMouth` (the
  court).
- **licensing fields:** tier (town+) × prosperity (INVERSE — the fabric is licensed by LOW
  prosperity and by high-water DECLINE, which is T2R's own signal and DW law 2's third clamp read
  backwards) × era (the compliance statute LATE) × district (`criminal`/shadows zone) × culture.
- **criminal-share dial, as a CLOSED ENUM:** `gangGrade: NONE | STREET | FACTIONS`. NONE draws
  nothing. STREET marks one existing public house as `FLASH_HOUSE` and, where a shadows district
  exists, marks its block `COURT_BLOCK`. FACTIONS (the city row) marks TWO OR MORE haunts in
  DIFFERENT districts and is the only rung that says anything spatial the lower one does not —
  which is exactly what "competing gangs, turf disputes" means architecturally: **not more
  buildings, but more DISJOINT ones.**
- **verdict per tier:** town `Street gang` **NO_BUILDING** (marks a host: a public house, a
  lodging-house, and a block of the shadows district) · city `Multiple criminal factions`
  **NO_BUILDING** (marks two or more disjoint hosts). Neither row ever draws a building.
- **HOME tags:** `let_room` → HOME: `ROOM_KINDS.lodging`. `dormitory` → HOME:
  `ROOM_KINDS.lodging` (the engine has no dormitory kind; `quarters` is the security template's
  and is close). `common_kitchen` → HOME: `ROOM_KINDS.kitchen`. `lodge` (the porter's) →
  **NO TYPED HOME** — a gatekeeper's cell has no room kind in the engine and it is required by
  this family, by the fondaco, by the han and by the precinct types of R-INST-5's finding (3);
  **this is the tranche's most-requested missing room kind.** `common_stair` → **NO TYPED HOME**
  (circulation). `washhouse` → **NO TYPED HOME** (`SCULLERY` in §453 is the nearest and it is a
  service cell, not a detached building). `gaming` → R-INST-4 holds it.

**(g) Consequences for the grammar.** Four.

1. **A GATEKEEPER CELL is missing from ROOM_KINDS.** The porter's lodge, the fondaco's gate, the
   han's gate, the rookery court's watched mouth and R-INST-5's precinct entrance are one cell.
   Proposal: `ROOM_KINDS.gatehouse` (or `lodge`), with `controls: entranceId`.
2. **Prosperity must be able to run BACKWARD into subdivision.** DW law 1 says prosperity buys
   walls then duplication; this family is the inverse operation — a house of a good parti,
   SUBDIVIDED, with the same walls now enclosing more households. The charter anticipates it
   ("tenement subdivision" appears in §3's demography row), and this family supplies the measured
   endpoint: 8 persons in 2.8 square metres, 1.8-2.1 m headroom, 52 cubic feet of air.
3. **A FABRIC-level circulation class (`COURT`) is needed**, or DW must be able to read the
   block's permeability from the map's own parcel graph. The latter is preferable and is a
   carry-note to the fabric program rather than a DW ask.
4. **The `compliant` flag generalises.** A cell that exists in violation of a stated rule — the
   illegal cellar let, the unlicensed beer house, the unbonded store — is a recurring shape in
   this tranche. Proposal: `lawfulness: COMPLIANT | TOLERATED | UNLAWFUL` on a cell, which the
   projection tier can also use.

**(h) Continental vs English.** The English rookery is one instance of a wide European type and
the continental instances are older, which corrects the impression that this is a Victorian
phenomenon. **The Cour des Miracles of Paris** is the type's most famous name and its most
cautionary source: Henri Sauval (1623-1676) was the first to describe the one behind the convent
of the Filles-Dieu, between the rue Saint-Denis and Neuve-Saint-Sauveur, as "a great cul-de-sac
which was stinking, muddy, irregular and unpaved", reached "through tiny and foul streets, which
twist and turn in all directions", and containing "a half-buried house of mud, strikingly old and
rotten, of no more than fifty square yards, but which lodged fifty women in charge of an infinite
number of infants" (CONFIRMED-digest, 2026-08-23). **Number audit:** fifty square yards is
41.8 square metres; fifty women in it is 0.84 square metres each — the same order as Beames's
0.35-0.74 square metres per person, from a source two centuries earlier and 300 km away, which is
a striking independent corroboration of the density floor. **But Sauval is contested**: "there is
some debate about how reliable Sauval was as a historian and there are a lot of unsubstantiated
claims in his work" (CONFIRMED-digest, same), and the more recent scholarship treats the *cours*
as a partly literary construction (the 2020s UQAM thesis "Les cours des miracles de Paris
(1667-1791)" was found and NOT opened — **ledger item L.8**). The figure is therefore carried as
CONTESTED and used only as a corroborating order of magnitude, never as a datum.

Three further continental and Anglo-Irish parallels are recorded as pointers, not researched:
the **Liberties** of Dublin and of London (jurisdictional islands where the sheriff's writ ran
weakly — the mechanism is JURISDICTION, not morphology, and it is the one this dossier most
wishes it had researched); the Neapolitan ***bassi***, ground-floor one-room dwellings opening
directly on the street, which produce the same density with the OPPOSITE morphology (maximum
street exposure rather than blind courts); and the Roman and Ostian ***insula***, whose upper
floors were let room by room and which supplies the ancient ceiling for subdivision. The
mechanism that travels is: **where jurisdiction is weak or density is extreme, the block becomes
permeable and the room becomes the dwelling** — and the two do not have to co-occur, which the
*bassi* prove.

**(i) Fantasy note.** None.

---

## §6 · FAMILY E — front businesses, the two-plan building: `Front businesses` (town L1431 "Legitimate covers for criminal activity."; city L1975 "Warehouses, taverns, shops as criminal covers.")

The tranche's central family, and the one the DW grammar most needs, because it is the only
entry on the Criminal shelf whose whole content is an ARCHITECTURAL PROPOSITION: that one
building serves two programs. The city row carries the highest baseChance on the shelf (0.70),
so it is also the row a city plan will most often have to draw.

**(a) Analogue.** The catalog names its own hosts at city tier — "warehouses, taverns, shops" —
and the record adds the pawnbroker, the lodging-house, the laundry, the chandler's shop, the
counting house and the coffee house. The finding that organises them, established at §1.3 and
elaborated here: **the front is not a disguise over a criminal building; it is a real business
whose ordinary rooms already do the criminal work, plus ONE ADDITIONAL CIRCULATION GRAPH.**

**The purest documented case in Europe is not criminal at all, and that is why it is so useful.**
The Dutch *schuilkerk* — the clandestine church — is a complete institution installed inside a
building that must continue to read as a private house from the street, and it survives measured
and open. *Ons' Lieve Heer op Solder*, Oudezijds Voorburgwal 40, Amsterdam: a canal house built
1630; "between 1661 and 1663 the top three floors of the house were changed into a house church"
for the merchant Jan Hartman; the sequence of spaces still shown is "the front room, the between
room, the hall, the church, the Lady chapel, the confessional, the Jaap Leeuwenberg Hall, and the
17th-century kitchen" (CONFIRMED, en.wikipedia.org/wiki/Ons'_Lieve_Heer_op_Solder, fetched
2026-08-23); "narrow corridors and stairs lead to historically decorated living quarters,
kitchens and bedsteads, ending in ... a complete church in the attic", with "entrance to the
church ... gained through a fake door hidden in the living room" onto "a tiny spiral staircase"
(CONFIRMED-digest, 2026-08-23). The legal rule that produced it is quoted in the sources as the
plainest possible statement of the two-plan law: worship was tolerated "just so long as they
didn't do it in public or even in a building that looked like a church"
(CONFIRMED-digest, 2026-08-23).

Read as grammar, that gives the family its four rules:

1. **The prohibition attaches to the FACADE.** The street elevation must read as the host type.
   Nothing about the interior is constrained except by what the facade can conceal.
2. **The hidden program takes the LEAST VISIBLE part of the envelope** — here the top three
   floors of a canal house, which from the street are a roof and two rows of small windows.
3. **The two programs share the lower cells.** The living quarters, kitchen and bedsteads are
   NOT duplicated; the congregation walks through the household.
4. **The junction is a single disguised door onto a tight vertical.** One joint, one stair.

**The commercial cases put the hidden program BELOW rather than above, and the reason is goods.**
A church needs volume and light and finds them upward; a store needs mass, coolness and
concealment from a searcher and finds them downward. Hence the medieval undercroft with its
external stair, the tavern cellar, the pawnbroker's basement stacks. The generalisation — and it
is the family's most useful single rule — is: **a front's second program goes UP when it is
people and DOWN when it is goods.**

**The tavern as the archetypal front, with a measured interior fact.** The flash-house evidence
(family D) gives the tavern-front's contents: "drinking, lodging, and gambling", with "the
landlords typically received and sold on the stolen goods" (CONFIRMED, Bland,
radar.brookes.ac.uk, extracted 2026-08-23). And at the Sun in Brownlow Street, Drury Lane, a
SMITHY inside the drink house: "Men (wearing Leather Aprons) who work at smith's Work, and who
Manufacture the Implements for Housebreaking and also Screws or Skeleton Keys" (CONFIRMED, same).
That is the family's cleanest interior evidence: the second program can be a CRAFT, occupying a
back cell of a hospitality building, needing a hearth the building already has.

**The shop as front, and the private door.** The pawnbroker again, because it is the best-
described: the shop "situated near Drury-Lane, at the corner of a court, which affords a side
entrance"; the door "stands always doubtfully, a little way open: half inviting, half repelling";
a customer "would enter a side-doorway and, by an inner door, pass into one of a series of
compartments constructed before the pawnbroker's counter"; the boxes "in shadow"; upstairs "large
frames full of ticketed bundles" (CONFIRMED, victorianweb.org/history/london/pawnbrokers.html,
fetched 2026-08-23, and CONFIRMED-digest for the boxes). **The corner-of-a-court siting is the
architectural precondition of the whole family** and it is a PARCEL fact: the building needs two
frontages of unequal status.

**The warehouse as front, and Greenwood's converted tavern.** The Houndsditch jewellery mart
shows a front at full scale: "housed in converted taverns", the most prominent with "a spacious
private entrance", a "demurely whitened" step, "a door so closely ajar that at first sight it
seemed shut", opening into "an apartment as long as Fleet Street is broad, and wide in fair
proportion" with "a line of tables about four feet wide on either side down the whole length of
it", vendors "seated on forms", "a snug country posting-house liquor-bar" at one end and "a broad
skylight" above, holding "at least two hundred people" and "chokeful" in trade, operating on
Sunday mornings "about eleven o'clock" while "church bells were summoning good folks" (CONFIRMED,
James Greenwood, *Unsentimental Journeys*, 1867, ch. 22, victorianlondon.org/publications/unsentimental-22.htm,
fetched 2026-08-23). **Number audit, performed:** Fleet Street's carriageway-plus-footways in the
mid-nineteenth century is on the order of 12-15 m, so "as long as Fleet Street is broad" gives a
hall of roughly 12-15 m by (in fair proportion) perhaps 7-9 m — about 90-135 square metres for
two hundred people, i.e. 0.45-0.68 square metres each, which is a market crush and is consistent
with "chokeful". The figure is DERIVED from a simile and is flagged as such; it is the only
dimension the source gives and it is honest to say so.

**The two-plan building's modern popular form, cited as CONVENTION.** Prohibition-era American
speakeasies are the image most readers carry, and the popular literature describes cigar shops,
mortgage-company offices and similar fronts with a trapdoor or a back stair to a basement room,
false walls and floors, a door latch for a lookout to inspect callers, and a bell or light signal
(CONVENTION, from popular and trade sources, CONFIRMED-digest 2026-08-23; **no scholarly
architectural study of speakeasy plans was reached and none of these details is treated as
primary**). It is included because it is a CONVENTION the audience expects, cited as one
convention among several, and because it independently reproduces the same four rules the
*schuilkerk* gives — facade obedience, least-visible volume, shared lower cells, one controlled
junction — from a completely different century and legal regime. Its one genuinely additional
element is the **INSPECTION APERTURE**: a small closable opening in the junction door through
which the doorkeeper examines a caller before opening. That element is attested historically
elsewhere too (monastic and college gate wickets, the prison judas), so this dossier types it
without leaning on the Prohibition sources.

**Live/work.** The front's keeper lives above the front, as any shopkeeper or publican does. The
second program's participants do not live there. The exception is the lodging-house front, where
the second program's participants are the lodgers.

**Siting/anchor law.** Three, in order of evidential strength. (i) **Two frontages of unequal
status** — the corner of a court, the main street plus the back lane. (ii) **The waterfront or
the gate**, for goods fronts, which is the engine's own smuggler anchor. (iii) **The market
edge**, for receiving fronts. A building with only one frontage can still be a front, but its
second circulation graph must then run VERTICALLY (the *schuilkerk* case) rather than
horizontally, which is a clean and drawable dichotomy.

**Prosperity and wear.** Floor: a shop with a back room and a curtain. Rung 1: a lockable back
room with its own yard door. Rung 2: a cellar with an external stair. Rung 3: a separate upper
suite with a concealed junction. Ceiling: a compound — front building, yard, and a second
structure the public route never reaches. Decline sheds the compound, then the upper suite, then
the yard door; the back room and the curtain are the floor and never shed. **Wear has a
distinctive signature in this family and it is worth stating**: a front is kept CONSPICUOUSLY
ORDINARY, so its exterior wear grade should track its neighbours rather than its owner's wealth.
A shabby front on a rich street is as suspicious as a lavish one on a poor street; the type's
whole discipline is matching.

**Era grades.** The two-frontage shop-house is available from the medieval urban register. The
cellar-with-external-stair is medieval. The concealed upper suite is documented from the
seventeenth century in the Dutch case; the inspection aperture is available at any era that has a
monastic or collegiate gate. Nothing in this family needs a late era except the pledge boxes
(family A's) and the industrial warehouse.

**(b) Measured.**

- **The exchange hall (Greenwood, 1867):** tables "about four feet wide" (1.22 m) in two lines
  down the length; capacity "at least two hundred people"; hall length "as long as Fleet Street
  is broad"; top-lit by "a broad skylight" (CONFIRMED, fetched 2026-08-23). Derived hall
  dimensions above; flagged.
- **The concealed junction (Amsterdam):** "a tiny spiral staircase" from a "fake door hidden in
  the living room" (CONFIRMED-digest, 2026-08-23). **No dimension.** A tight spiral stair in a
  Dutch canal house is on the order of 0.8-1.0 m in overall diameter (PLAUSIBLE, given as a
  range).
- **The host canal house:** built 1630; church formed in the top THREE floors, 1661-1663;
  85,000 visitors a year today; museum since 28 April 1888 (CONFIRMED,
  en.wikipedia.org/wiki/Ons'_Lieve_Heer_op_Solder, fetched 2026-08-23). **No plan dimensions were
  obtained and this is the family's principal measured gap** — the building is exhaustively
  surveyed and published, and none of it was reached this session. **Ledger item L.10**, a P1c
  work order, and the highest-value single target in the tranche.
- **The cellar the goods front uses:** family C's measured undercroft bucket (5-6 m span, 3-3.4 m
  headroom, 10-16.5 m long) governs here and is not restated.
- **NOT FOUND, searched:** any measured plan of a building identified as a criminal front; any
  dimension for an inspection aperture; any survey of a two-frontage shop-house that
  distinguishes the two entrances' widths.

**(c) Contested and counterexamples — the negation searches.**

(i) **"The front business is not architecturally distinguishable."** Run, and CONFIRMED — which
is the family's most important result and its most awkward one. Bland's conclusion about flash
houses is the general case: the category was assembled by observers, not by builders, and many
so-called flash houses "were beer houses" of the ordinary licensed kind (CONFIRMED,
radar.brookes.ac.uk, extracted 2026-08-23). **The correct engine consequence is not to draw a
different building; it is to draw the SAME building and add ONE element** — the second
circulation graph. Everything else about a front is identical to its host type, and a grammar
that makes fronts look different has invented a tell that history does not supply.

(ii) **The counterexample that proves the rule.** The *schuilkerk* IS radically different inside
— a church in an attic is not an ordinary attic — and it is different because the second program
is a CONGREGATION, which needs volume, sight lines and seating. **The rule that emerges:** the
second program changes the building only to the extent that it needs a ROOM SHAPE the host does
not have. Goods need no special shape (a cellar is a cellar), so goods fronts are invisible.
People-in-numbers need a hall, so people fronts are the ones that leave archaeology.

(iii) **The discretion/crime ambiguity, third instance.** As at A(c)(iii), the pawnbroker's side
door and boxes exist for shame; the *schuilkerk*'s hidden door exists for a religious minority;
the crimp house's strong-room exists for a legal recruiting trade. **Three of this tranche's four
best-attested "criminal" architectural devices were built for non-criminal reasons.** §Σ turns
this into the projection-tier rule and into a warning about the engine's `concealed` room.

(iv) **The engine currently renders this row as a two-cell box, and the simulation proves it.**
Running the live `FACET_INFERENCE` table over the roster names (`RINST6-facetsim.mjs`;
PLAUSIBLE-by-simulation), `Front businesses` at both town and city infers NO
`institutionNature` — none of the seven regexes matches "Front businesses Criminal" — so
`interiorKindOf` returns the kind-default `generic`, whose template is `main` (front) + `back`
(back, `minTierIndex: 2`). **The one row in the whole catalog whose subject is the two-plan
building draws the engine's two-cell default box.** It is not wrong, exactly — a front IS a main
room and a back room — but it is right by accident, and it carries none of the family's content.
§Σ's engine table holds the full simulation.

**(d) CIRCULATION typology (§452).** This family IS a circulation family and the section is the
tranche's densest.

**The core proposal: `TWO_PLAN_FRONT` is a parti whose defining property is that the building's
circulation graph is DISCONNECTED when restricted to the public entrance.** Formally: there
exists a partition of the cells into PUBLIC and TRADE such that no PUBLIC cell has a door to a
TRADE cell except through exactly one JUNCTION, and the TRADE partition additionally has its own
exterior entrance OR is reachable only through the junction. Three variants:

- **`SIDE_DOOR` (horizontal, two frontages).** Public: street door → `THROUGH_ROOM` → counter.
  Trade: court or lane door → `LOBBY` → back cell. Junction: one internal door between the two
  back cells, or none at all. The pawnbroker's arrangement exactly. **Width buckets:** street
  door 1.0-1.2 m (DERIVED, and the ordinary shop door bucket R-INST-2 holds); side door
  0.8-1.0 m (DERIVED, flagged); lobby 0.8-1.1 m (DERIVED, flagged).
- **`UNDER_PLAN` (vertical down, one frontage).** Public: street door → shop. Trade: external
  cellar steps from the yard or the street flap → `CELLAR`. Junction: an internal cellar stair,
  often absent — and its ABSENCE is the security feature. The medieval undercroft's external
  stair is the historical warrant (CONFIRMED-digest, 2026-08-23: undercrofts "originally ...
  entered from the outside through a doorway and down a flight of steps"). **Bucket:** external
  cellar stair 0.8-1.0 m, going steep.
- **`OVER_PLAN` (vertical up, one frontage).** Public: street door → house. Trade: the disguised
  door → tight spiral → the upper suite. The *schuilkerk*. **Bucket:** tight spiral 0.8-1.0 m
  overall diameter (PLAUSIBLE range, flagged).

Further classes and their licences:

- **`LOBBY` / `VESTIBULE`** — licensed at the TRADE entrance in every variant, because the trade
  entrance is where inspection happens. Carries the **INSPECTION APERTURE** as a fixture.
- **`STAIR_HALL`** — not licensed. A front does not advertise its vertical.
- **`CORRIDOR`** — not licensed at any era in the shop or tavern variants; licensed only where
  the host is already a corridor-bearing institution (a large warehouse, a large lodging-house).
- **`GALLERY`** — licensed only in the warehouse variant, as the working gangway.
- **`EXTERIOR_WALK`** — the yard route, heavily licensed, and often the trade graph's whole spine.
- **The junction's typed joint.** Where the trade partition is below grade, the junction is the
  engine's own `stair` at a "cellar door" and the exterior trade entrance is the same joint kind
  at the street or yard — which means **DW's front interior and UC-2's `undercroft` /
  `smuggler_cellar` row meet at exactly one typed joint and it already exists.** This is the
  single cleanest item in §Σ's seam table.

**(e) STORAGE typology (§453).**

- `STORE` — the trade partition's principal cell in the goods variant. Light: NONE.
  **Adjacency PROHIBITION: no door to a PUBLIC cell.** Where the host trade legitimately needs a
  store (every shop does), the front has TWO stores — the licit one off the counter and the trade
  one off the yard — and the doubling is the type's one detectable arithmetic signature. That is
  worth saying plainly: **the way to find a front on a plan is that it has one more store than
  its trade needs.**
- `CELLAR` / `UNDERCROFT` — the `UNDER_PLAN` variant's whole content. Family C's measured bucket.
- `CLOSET` — the concealed press in the junction wall; a FIXTURE, not a cell.
- `ATTIC` / `GARRET_STORE` — the `OVER_PLAN` variant's host volume before conversion, and the
  thing the conversion consumes.
- `PANTRY` / `BUTTERY` / `LARDER` / `SCULLERY` — present exactly as the HOST type requires and
  not otherwise; a tavern front has R-INST-4's service range unchanged.
- **PROHIBITIONS.** (i) The trade store has no public door. (ii) The trade store has no window on
  the principal frontage. (iii) Where the host is a victualling trade, the trade store must not
  be the cool store, because the cool store is inspected. (iv) The junction must be exactly ONE.
  That last is a hard structural rule and it is what makes the parti checkable: **two junctions
  is not a front, it is a through route.**

**(f) Typed proposal.**

- **parti id:** **`TWO_PLAN_FRONT`**, with `variant: SIDE_DOOR | UNDER_PLAN | OVER_PLAN` and
  `host: <the host institution's parti id>`. It is a MODIFIER PARTI: it does not replace the
  host's parti, it wraps it. This is a new shape for the charter's §5 `Parti` contract, which
  today has `{ id, form, weights, verticalGrammar, stairGrammar, exteriorConsequences[] }` and no
  notion of a parti applied to another parti. **This is the family's principal contract ask.**
- **functions[]** — the front adds, on top of the host's own roster: floor `trade_entrance`,
  `trade_store`. Ladder rung 1: `inspect` (the junction lobby with its aperture). Rung 2:
  `count` (a private counting cell — the record's counting house, where the second business keeps
  its own books). Rung 3: `assembly` (the `OVER_PLAN` variant's hall, where the second program is
  people). Ceiling: `second_structure` (the yard building the public route never reaches).
  Shedding order: `second_structure` → `assembly` → `count` → `inspect`; `trade_entrance` and
  `trade_store` are the floor.
- **fixtures[]:** `counter`, `strongbox`, `ledger`, `crate`, `barrel`, `rack`, `shelf` (all
  existing); plus `inspection_aperture` (**NO TYPED HOME**), `disguised_door` (**NO TYPED HOME**),
  `cellar_flap` (**NO TYPED HOME**), `signal_bell` (**NO TYPED HOME**; the lookout's device,
  CONVENTION-grade only).
- **structural buckets:** `secondFrontage` (a PARCEL precondition for `SIDE_DOOR`), `belowGrade`
  (`UNDER_PLAN`), `atticVolume` (`OVER_PLAN`), `singleJunction` (the checkable invariant),
  `facadeConformity` (the wear rule: the exterior grade tracks the street, not the owner).
- **licensing fields:** tier (town+) × prosperity × era × siting (two frontages / waterfront /
  gate / market edge) × host (the host institution must exist in the roster — **a front cannot be
  drawn where there is nothing to front**) × culture.
- **criminal-share dial, as a CLOSED ENUM:** `frontGrade: NONE | ONE | SEVERAL | DISTRICT`.
  NONE draws nothing. ONE wraps a single existing institution in `TWO_PLAN_FRONT`. SEVERAL wraps
  two or three, preferring different host types (the record's own "warehouses, taverns, shops").
  DISTRICT wraps enough of one quarter that the quarter reads as fronted — the city row's 0.70
  baseChance and the engine's own criminal-share driver make this the realistic top rung for a
  large settlement.
- **verdict per tier:** town **HOSTED** (one or two hosts) · city **HOSTED, PLURAL** (the row is
  plural in the catalog and should stay plural: it is a PROPERTY OF SEVERAL BUILDINGS, never a
  building). **`Front businesses` must never be given a building of its own.** It is the clearest
  case in the tranche of a catalog row that is a RELATION over other rows.
- **HOME tags:** `trade_entrance` → **NO TYPED HOME** (a second entrance is not a room; the
  engine draws exactly one). `trade_store` → HOME: `ROOM_KINDS.store`. `inspect` → **NO TYPED
  HOME** (a lobby has no room kind; `main` is wrong). `count` → HOME: `ROOM_KINDS.counting`.
  `assembly` → HOME: `ROOM_KINDS.hall`. `second_structure` → **NO TYPED HOME** (the engine's
  interior model is one building). The concealed cell the engine DOES have —
  `ROOM_KINDS.concealed` — maps to this family's `trade_store` when the store is a hide rather
  than a cellar, and §Σ notes that today it is unreachable for a criminal institution.

**(g) Consequences for the grammar.** Five, and the first two are the tranche's headline asks.

1. **A building must be able to have MORE THAN ONE ENTRANCE, with different reach.** The live
   `interiorModel.js` derives a single `entranceSide` and rotates the plan to it. Without a
   second entrance the entire family is inexpressible, and so is family A's side door and family
   C's external cellar stair. **This is the tranche's single largest engine ask** and it is
   requested by three families independently.
2. **A parti must be able to WRAP another parti.** `TWO_PLAN_FRONT` is a modifier, not a form.
   The §5 `Parti` contract needs either a `modifies: partiId` field or a separate
   `PartiModifier` record.
3. **Reachability must be provable PER ENTRANCE, not per building.** S6's circulation totality
   currently asks that every room be reachable. A front requires that some rooms be reachable
   ONLY from the trade entrance. Proposal: S9's certification gains `reachabilityByEntrance[]`
   and the validator asserts the partition rather than global totality.
4. **A cell needs a VISIBILITY tier that is not the same as the projection tier.** The engine
   already scrubs covert geometry for a public projection, which is the DM/player split. This
   family needs something else: a cell that is PHYSICALLY present and publicly visible but whose
   USE is secret (the tavern's back room). Proposal: separate `secrecy: OPEN | DISCREET | HIDDEN`
   on a cell's USE from the existing projection tier on its GEOMETRY.
5. **The exterior wear grade must be able to track the STREET rather than the owner**
   (`facadeConformity`). This is a small rule with a large legibility payoff and it applies to
   every institution that wants not to be noticed.

**(h) Continental vs English.** The English record supplies the shop and the tavern; the two most
instructive continental cases invert it in opposite directions. The Dutch *schuilkerk* (above) is
the type's clearest specimen and is CONTINENTAL, not English — the English recusant equivalent
went into the priest hide (§1.1), i.e. into a CELL rather than into a HALL, because English
recusancy was a household affair and Dutch Catholicism was a congregation's. **That single
contrast is the family's best generalisation: the size of the hidden program is set by the size
of the community that must fit in it, and the building follows.** In the other direction, the
Venetian *fondaco* and the Ottoman *han* (§15) are ANTI-FRONTS: buildings designed by the
authority so that a trade CANNOT have a second graph, with one gate, a gatekeeper and everything
inside a court. A settlement that has fondaco-type institutions has fewer fronts, not more,
because the trade the front would host has been concentrated where it can be watched. That is a
real, drawable interaction between two catalog rows and §Σ records it.

**(i) Fantasy note.** None.

---

## §7 · FAMILY F — the guild that may not exist: `Thieves' guild chapter` (city L1933 "Organized crime chapter. 10,000+ population for viable operation. 30-100 members.") · `Thieves' guild (powerful)` (metropolis L2366 "Dominant criminal syndicate. Tolerated because the alternative (gang war) is worse.") · `Assassins' guild` (metropolis L2391 "Professional contract killing. Operates through cutouts, never acknowledged officially.")

The family where the genre expectation is thickest and the historical record thinnest, so the
method's three directions are stated separately and kept apart, and the negation search is done
FIRST rather than last.

**(a) Analogue — and the negation, run first.**

**(a.1) The negation: the European thieves' guild is a literary construction.** The standard
example offered whenever the question is asked is the **Garduña** of Spain, "legendarily founded
in Toledo around 1412 as a brotherhood of brigands and assassins with a hierarchical structure
and nine degrees", supposedly persisting into the nineteenth century and into the Spanish
colonies. It is a fabrication: "modern historiography regards the Garduña as a fictional
construct, lacking verifiable primary evidence and tracing its popularization to 19th-century
sensational literature, including French pulp novels and derivative accounts that romanticized
underworld guilds" (CONFIRMED-digest, 2026-08-23, from the Wikipedia article, which describes it
as "mythical", and from the aggregated historiography; **the Roguish long-form article on the
thieves'-guild idea returned 403 and is GATED**, so this dossier's genre-history is thinner than
intended — **ledger item L.11**).

The second-most-cited example is **Cervantes' *Rinconete y Cortadillo*** (published 1613, set in
sixteenth-century Seville), which "presented a well-organized thieves' guild modeled on medieval
professional guilds, complete with apprenticeship systems and even 'their own church where they
go to pray'" (CONFIRMED, en.wikipedia.org/wiki/Thieves%27_guild, fetched 2026-08-23). It is
fiction, and — importantly for a design program — **it is fiction that invents the guild by
ANALOGY WITH THE REAL CRAFT GUILD.** The whole genre convention descends from an author noticing
that if thieves organised they would organise like cutlers. That is worth saying plainly to
DW-0: the thieves' guild is a real institution's parti applied to an imaginary institution, which
is exactly what the engine's own facet grammar does by accident (see (c) iv).

**(a.2) What IS attested, and what its building was.** Three cases, in ascending order of
architectural content.

- **Cairo, Ottoman period.** "Thieves' guilds existed in Cairo during the Ottoman period and were
  known to return stolen goods for a price, managed by a sheikh. These survived until the 19th
  century and were mentioned by Edward William Lane in the 1830s" (CONFIRMED,
  en.wikipedia.org/wiki/Thieves%27_guild, fetched 2026-08-23; Lane's *An Account of the Manners
  and Customs of the Modern Egyptians* was written from a residence of 1833-1835 and **was NOT
  opened this session** — the Gutenberg and Internet Archive copies were located and not fetched,
  **ledger item L.12**, and it is the highest-value unopened text in this family). The
  architectural content available at digest grade is one word — SHEIKH — and a sheikh of a guild
  in Ottoman Cairo has the same institutional apparatus as any other guild head: a place he sits,
  which is typically a room in a *wikala* or a shop, not a hall of his own. **The attested
  thieves' guild is a REGULATORY OFFICE, not a lodge**, and its function is the same as Jonathan
  Wild's: paid restitution.
- **The English thief-taker's office (family A).** Wild's "Office of Intelligence for lost Goods"
  in the Old Bailey is functionally the same institution with an English legal skin, and its
  premises are an office with a public counter plus separate warehouses (CONFIRMED-digest,
  2026-08-23). Recorded here as well as in family A because it is the ONLY European institution
  that plays the thieves'-guild role and it has a mundane building.
- **The Chinese sworn brotherhood, which does have a lodge.** The 1879 *Journal of the Straits
  Branch of the Royal Asiatic Society* account of the Hung league is the family's one genuine
  measured-adjacent primary. In the Straits Settlements "each Lodge has a substantial 'Hui-Koan'
  or Meeting-house", and at Singapore the Grand Lodge had "a very superior building at Rochore".
  The ritual plan runs: outer door and "Ang Gate" with assigned sentries → the "Hall of Sincerity
  and Justice" → the "City of Willows" → the "Red flowery Pavilion" before the "Grand Altar" on
  the East side → the "Two Planked Bridge" with a spirit tablet → the "Fiery valley" or "Red
  Furnace" → the "Market of Universal Peace" and the "Temple of Virtue and Happiness"; the "Peck
  measure" or "Ang Tau" sits "on the West side of the Altar" (all CONFIRMED,
  en.wikisource.org/wiki/Journal_of_the_Straits_Branch_of_the_Royal_Asiatic_Society/Volume_3/Chinese_Secret_Societies,
  fetched 2026-08-23). Theoretically meetings were "held in the jungle or mountains"; a lodge
  elsewhere was "a small encampment" with distances "of several miles" between stations
  (CONFIRMED-digest, 2026-08-23).

**(a.3) The load-bearing sentence in the whole family.** From the same 1879 account: the City of
Willows theoretically had gates at "each point of the compass" **though practically only one gate
was represented** in the Singapore lodges (CONFIRMED, fetched 2026-08-23). An eight-station
processional ideal, executed in one room with one gate, because that is what the building had.
**This is the compression law of §1.6 stated by a primary source about its own practice**, and it
gives DW the exact rule for every clandestine institution: hold the IDEAL SEQUENCE as an ordered
function list, pour it into the host's cells, and let the surplus stations collapse onto the
cells that remain. The resulting plan is not a degraded plan; it is the correct plan for that
building, and the ritual says so.

**(a.4) The tolerance ladder, which is the family's real architecture.** Put the three cases in
order and a single variable explains all of them: **how much the authority tolerates.** Where the
society is hunted, the lodge is an ENCAMPMENT pitched for a night in the jungle. Where it is
winked at, the lodge is a ROOM IN A HOUSE with one gate standing for four. Where it is tolerated
outright — Singapore's registered societies — "they had built handsome structures", a real
building at Rochore (CONFIRMED-digest, 2026-08-23). And the catalog's own metropolis row says
exactly this: "Dominant criminal syndicate. **Tolerated because the alternative (gang war) is
worse.**" The catalog has independently written the top of the tolerance ladder into its own
description, and the grammar should read the ladder rather than the tier: **it is TOLERANCE, not
population, that buys the building.**

**(a.5) The legitimate parallel the record does supply, and R-INST-2 already holds it.** The
*huiguan* — the Chinese native-place association hall — is what a real fraternal organisation
with money builds, and it is measured. Britannica describes huiguan as guildhalls established by
regional organisations in the Qing period "where merchants and officials from the same locale or
the same dialect groups could obtain food, shelter, and assistance while away from home"
(CONFIRMED-digest, 2026-08-23); the typical complex is "1) Opera stage ... 2) Courtyard ...
3) Side rooms located on both sides, used as council halls; 4) Main hall for worshiping Yu the
Great or sages; and 5) Wing rooms located on both sides of the courtyard, for reading and
lodging"; and the Beijing Huguang Guild Hall's "front courtyard ... features a stage, with 10
backstage rooms, and to the north, east, and west of the stage are viewing galleries, totaling 40
rooms on two levels" (all CONFIRMED-digest, 2026-08-23). That is a measured five-part parti and
it is the fraternal building this family's TOP rung should draw — with the crucial qualification
that the huiguan is entirely legitimate, and the criminal version differs from it by having ONE
GATE instead of a street presence, and by lacking the stage.

**Live/work.** Nobody lives in a lodge. The huiguan's wing rooms lodge travellers, which is the
legitimate version's whole point; the criminal version's lodging is a family B or D matter. The
`Assassins' guild` row explicitly "operates through cutouts, never acknowledged officially",
which is a statement that the institution has no address at all.

**Siting/anchor law.** For the tolerated form: the same anchors as any fraternal hall — a lane
off a main street, a courtyard, a quarter where the membership lives. For the hunted form: no
site; the meeting moves. **The engine's own colonization order gives the criminal siting
preference already** — `SEED_PROXIMITY` in `colonization.js` is `cellar 0, subterranean 1,
sanitation 2, crypt 3, mine 4, other 5`, i.e. the criminal economy reaches the trade cellars
first, and its comment says cellars "sit behind the trade fronts the shadows district already
uses" (CONFIRMED by reading the file at `f1e4d515`). A guild lodge with an underside therefore
sits behind a trade front, which is family E's parti, and the two rows compose.

**Prosperity and wear.** Floor: no premises; a table in a hired room. Rung 1: one room with a
controlled door. Rung 2: a room plus a counting cell plus a store. Rung 3: a courtyard building
with a gate. Ceiling: the huiguan-scale compound minus the stage. Decline is the tolerance ladder
run backwards, and its fossil is legible: an abandoned lodge is a courtyard building with a
blocked gate, which is precisely UC-4's `sealed` fossil kind on the surface.

**Era grades.** The fraternal hall with a courtyard is available wherever guilds are; the
processional ritual plan is available wherever an initiatory society is; the "guild of thieves"
as a legally recognised body is attested only in the Ottoman Egyptian case and should be gated on
a `toleratedCrime` condition rather than on any era.

**(b) Measured.**

- **Beijing Huguang Guild Hall:** a front courtyard with a stage, **10 backstage rooms**, viewing
  galleries north, east and west of the stage, **40 rooms on two levels** (CONFIRMED-digest,
  2026-08-23). **Number audit, performed:** 40 rooms on two levels around a courtyard with 10
  backstage rooms gives roughly 15 rooms per side per level if evenly distributed — a large
  courtyard building of the same order as a European inn of the largest kind. No linear
  dimensions were obtained.
- **The huiguan's five-part parti:** stage · courtyard · side council halls · main hall · wing
  rooms for reading and lodging (CONFIRMED-digest, 2026-08-23). A COUNT, not a dimension, and the
  most useful count in the family.
- **The Hung lodge:** an eight-station ritual sequence compressed to one gate in practice; a
  "small encampment" in the hunted form; "several miles" between stations in the theoretical
  form (CONFIRMED and CONFIRMED-digest, 2026-08-23). **No dimensions.**
- **The catalog's own numbers, recorded as the design's data:** city chapter "10,000+ population
  for viable operation. 30-100 members"; metropolis guild "dominant". **Number audit against the
  record:** 30-100 members is the same order as the huiguan's 40 rooms and as the c.1815 List's
  67 flash houses, and it is a plausible membership for a courtyard building. No source
  contradicts it.
- **NOT FOUND, searched:** any measured plan of any criminal fraternal building of any period;
  any dimension in the Hung lodge account; Lane on the Cairo guild (not opened). **This family
  reached NO linear measured figure and is honest about it** — its measured content is COUNTS
  (10 backstage rooms, 40 rooms, five parts, one gate, eight stations) and counts are what the
  (f) proposal uses.

**(c) Contested and counterexamples.**

(i) **"The thieves' guild had no hall."** Run as the family's primary negation and CONFIRMED for
the European register, with the Garduña specifically identified as a fabrication and Cervantes
specifically identified as fiction. **The honest verdict for a European-base world is: the
thieves' guild is a CONVENTION, and the engine should draw it as a tolerated fraternal
organisation whose building is somebody else's building until tolerance buys it one.**

(ii) **The counterexample is real and it is not European.** Ottoman Cairo's guild and the Straits
Chinese lodges are attested organisations with sheikhs, meeting-houses and property. A
setting-agnostic engine must be able to express BOTH — the European "no hall" and the Ottoman /
Straits "hall" — and the variable that selects between them is tolerance, not culture. This is
the family's contribution to §15's setting-agnostic law.

(iii) **The `Assassins' guild` row is the one the record most nearly refutes and the dossier says
so.** "Professional contract killing. Operates through cutouts, never acknowledged officially"
(L2391) is a description of an institution WITHOUT PREMISES, by its own text. There is no
historical building type for it. Every well-known claimed instance is either a state apparatus
(which has a real building and is not this row), a sect known chiefly through hostile and
legendary sources, or fiction. **Verdict: NO_BUILDING at every tier, and the dossier declines to
invent one.** Its city-tier sibling `Contract killer` (row 18) is handled in family H and gets
the same verdict for the same reason.

(iv) **The engine currently draws these three rows as COUNTING HOUSES, and the simulation proves
it.** Running the live `FACET_INFERENCE` table over the roster names
(`RINST6-facetsim.mjs`; PLAUSIBLE-by-simulation): the `trade` regex is
`/market|guild|exchange|bank|counting|merchant|bazaar/i` and it fires on the substring `guild`
before the `vice` row is ever tested, so `Thieves' guild chapter`, `Thieves' guild (powerful)`
and `Assassins' guild` all resolve to `institutionNature: trade` and receive the TRADE template —
`hall` (front) + `counting` (back, tier 1+) + `strongroom` (back, tier 2+). **An assassins' guild
renders as a merchant's counting house.** It is not absurd — a criminal syndicate does keep
accounts and a strongroom, and Wild kept books — but it is arrived at by an unanchored substring
and it produces the same interior for a bank and for a murder-for-hire cell. `Black market`,
`Black market bazaar` and `Whisper market` fire the same regex on `market` / `bazaar` and get the
same three rooms (family G). §Σ's engine table holds the full 28-row simulation and the proposed
cure.

**(d) CIRCULATION typology (§452).**

- **The hunted rung — NO_BUILDING.** No circulation. The meeting occupies a hired room, a barn or
  a hillside; the "gates" of the ritual are represented by cloth, by chalk, or by a spoken
  formula. This is the primary-source position ("theoretically ... held in the jungle or
  mountains") and it is not a poverty case; it is a security case.
- **The tolerated rung — HOSTED.** One `LOBBY` at the controlled door with an inspection
  aperture (family E's fixture), then `THROUGH_ROOM` into the meeting cell. **One gate, always
  one** — the primary source's own reduction of four compass gates to one.
- **The built rung — BUILDING.** The huiguan parti: `GATEHOUSE` (the controlled entrance and the
  gatekeeper's cell — the tranche's most-requested missing room kind, see D(g)1) → `COURTYARD`
  (an `EXTERIOR_WALK` class, and the building's real circulation spine) → `GALLERY` on the
  courtyard's sides at both levels, giving onto the wing rooms → the main hall on the axis.
  **This is a courtyard-and-gallery parti, not a corridor parti**, and it is the same shape as
  the fondaco and the han (§15) and as the inn (R-INST-4), which is a strong convergence: **every
  building in this research program whose problem is CONTROLLED ACCESS TO MANY ROOMS solves it
  with a gate, a court and a gallery, and never with a corridor.** That is a general finding and
  §Σ elevates it.
  **Width buckets, DERIVED and flagged:** courtyard gallery 1.2-1.8 m (the same bucket
  R-INST-4's inn gallery carries — reused deliberately, since the huiguan's galleries do the same
  job); gate passage 2.4-3.0 m where carts enter, 1.0-1.2 m where only people do.
- **`CORRIDOR`: not licensed at any rung.** **`STAIR_HALL`: not licensed** — the gallery does the
  vertical distribution, reached by a stair in the corner of the court.
- **The RITUAL PROCESSION is a circulation requirement and it has no class.** An initiatory
  sequence needs a path that passes named stations in order, which is neither a corridor nor an
  enfilade but a ROUTE OVER CELLS. Proposal in (g).

**(e) STORAGE typology (§453).**

- `STRONGROOM` — the one storage cell the family certainly has at the tolerated rung and above,
  because a fraternal organisation holds a common purse. Light: NONE. Adjacency: off the counting
  cell, never off the meeting cell.
- `STORE` — the regalia store. A ritual society's peculiar storage requirement is that its
  APPARATUS must be hidden between meetings: the Hung ritual's Peck measure, altar furniture,
  spirit tablet and gate hangings are portable and incriminating. **Proposed as a first-class
  storage sub-kind, `REGALIA_STORE`**, light NONE, adjacent to the meeting cell, and sized to hold
  a room's worth of dressing. This is a genuinely distinctive finding: **a clandestine ritual
  building's ordinary state is EMPTY, and the room that makes it look ordinary is the regalia
  store.**
- `CELLAR` — where the lodge sits over a trade front (the engine's own seed proximity), the
  cellar is family C's and family E's, not this family's.
- `CLOSET`, `PANTRY`, `BUTTERY`, `LARDER`, `SCULLERY` — absent except where the huiguan-scale
  building lodges and feeds, at which point R-INST-4's inn service range governs unchanged.
- **PROHIBITIONS.** (i) The regalia store must not open on the court. (ii) The strongroom must not
  be reachable from the gate without passing the counting cell — a control sequence, not a
  distance. (iii) At the hunted rung, NO permanent storage exists at all, which is why the
  encampment form leaves no archaeology.

**(f) Typed proposal.**

- **parti ids:** `NO_PREMISES` (the hunted rung — a typed absence, so the generator can say so
  rather than draw nothing silently), `HOSTED_LODGE` (one controlled room in another building),
  and **`COURT_LODGE`** (the built rung: gatehouse, court, galleries at two levels, main hall on
  axis, side council rooms, wing rooms; the huiguan minus the stage). `COURT_LODGE` is
  deliberately the SAME parti family as R-INST-2's guildhall and R-INST-4's galleried inn, with
  one difference stated as a licence: `entrances: 1`.
- **functions[]** — floor: `meet`, `gate`. Ladder rung 1: `count` (the purse), `regalia_store`.
  Rung 2: `strongroom`, `council` (the side rooms). Rung 3: `lodge_members` (the wing rooms).
  Ceiling: `court` as a first-class cell. Shedding order: `lodge_members` → `council` →
  `strongroom` → `count` → `regalia_store`; `meet` and `gate` are the floor, and at the hunted
  rung even `gate` is notional.
- **fixtures[]:** `table`, `bench`, `dais` (the master's seat — an existing FURNISHING_KIND and
  exactly right), `altar` (existing; used here in the fraternal-oath sense, and the deity
  doctrine applies — the object is a focus of oath-taking, never a theology), `brazier`,
  `strongbox`, `ledger`, `shelf`; plus `spirit_tablet` (**NO TYPED HOME**; and note it is a
  CULTURE-SPECIFIC object that a setting-agnostic engine should type as
  `oath_focus` instead), `inspection_aperture` (family E's), `gate_bar` (**NO TYPED HOME**).
- **structural buckets:** `singleEntrance` (`entrances: 1`), `courtyard`, `galleryTwoLevel`,
  `processionalRoute` (see (g)), `emptiableRoom` (the meeting cell that must be able to look like
  nothing).
- **licensing fields:** **`tolerance: HUNTED | WINKED_AT | TOLERATED | DOMINANT`** — the family's
  central licensing axis, and the one that selects the parti — × tier × prosperity × culture ×
  era. Population is a WEAK input and the catalog's "10,000+ population for viable operation" is
  better read as a floor under DOMINANT than as the parti selector.
- **criminal-share dial, as a CLOSED ENUM:** `syndicateGrade: NONE | CHAPTER | DOMINANT`, which
  maps to the catalog's own two guild rows plus absence. The engine already derives the input:
  `colonization.js`'s `syndicateStandingOf` reads the settlement's factions and its
  `powerHighWater` field carries the peak, so **`tolerance` and `syndicateGrade` are both
  derivable from facts the engine has** (§Σ).
- **verdict per tier:** city `Thieves' guild chapter` **HOSTED** (`HOSTED_LODGE` inside a trade
  building, per the engine's own seed proximity) · metropolis `Thieves' guild (powerful)`
  **BUILDING** (`COURT_LODGE`) — and it is the ONLY row on the whole Criminal shelf that this
  dossier grants an unqualified building of its own · metropolis `Assassins' guild`
  **NO_BUILDING** at every tier, on the row's own testimony.
- **HOME tags:** `meet` → HOME: `ROOM_KINDS.hall`. `gate` → **NO TYPED HOME** (the gatehouse
  again). `count` → HOME: `ROOM_KINDS.counting`. `strongroom` → HOME: `ROOM_KINDS.strongroom`.
  `council` → HOME: `ROOM_KINDS.chamber`. `lodge_members` → HOME: `ROOM_KINDS.lodging`.
  `regalia_store` → HOME: `ROOM_KINDS.store` (adequate) or `ROOM_KINDS.vestry` (**exactly right
  in function** — a vestry is where an institution's ritual apparatus and dress are kept — but it
  is currently reachable only from the `faith` interior template, which is an engine gap worth
  naming: the vestry is a FUNCTION, not a faith room). `court` → **NO TYPED HOME** (an open court
  is not a room and the engine's model has no unroofed cell at all).

**(g) Consequences for the grammar.** Four.

1. **`tolerance` must be a first-class licensing input.** It selects the parti for this family,
   and it generalises: R-INST-3's minority faith, R-INST-4's stews, R-INST-5's outlawed
   practitioner and every row on this shelf are all licensed by how much the authority permits.
   Proposal: a settlement-level `toleranceOf(practice)` reader, derived from the existing
   corruption, watch and power-structure facts rather than stored.
2. **A PROCESSIONAL ROUTE is a circulation requirement with no class.** An ordered path through
   named stations, where the stations may collapse onto fewer cells than the ideal names.
   Proposal: `route: { stations[], compressible: true }` as a circulation attribute, with S9
   certifying that the stations appear in order along a walkable path. It serves this family, the
   temple procession (R-INST-3) and the court ceremony (R-INST-1).
3. **An UNROOFED cell is missing.** The court is the organising element of the family's top parti
   and of the fondaco, the han, the inn and the huiguan, and the engine's `FloorPlan.storeys[].cells[]`
   has no way to say a cell has no roof. This is a large and general gap.
4. **`ROOM_KINDS.vestry` should be liberated from the faith template.** The regalia store is a
   vestry; so is a court's robing room and a guild's livery store. Making it a
   function-addressable kind rather than a faith-template member costs nothing and serves four
   families.

**(h) Continental vs English.** Handled above and in §15, because this family's whole evidence is
non-English. Summary of the correction: the English record has NO thieves' guild and its nearest
institution is a private office selling restitution; the Ottoman record has a REGULATED guild
with a sheikh; the Chinese record has a LODGE with a ritual plan and, where tolerated, a real
building. A European-base world should therefore draw `NO_PREMISES` or `HOSTED_LODGE` by default
and reserve `COURT_LODGE` for the DOMINANT tolerance rung, which is exactly what the catalog's
metropolis row describes. **The mechanism travels; the hall does not.**

**(i) Fantasy note.** This is the family where the genre convention is strongest, so it is stated
explicitly and bounded. The convention — a thieves' guild with a hall, a guildmaster, dues,
territories and a training room — is a widespread expectation across fantasy fiction and
tabletop and computer games, and it descends, as (a.1) shows, from Cervantes' analogy with the
craft guild. **This dossier's position: the convention is legitimate to serve and must be served
HONESTLY**, i.e. the engine should be able to produce it at the DOMINANT tolerance rung, where
history supports it (Singapore's registered societies, Ottoman Cairo's regulated guild), and
should NOT produce it by default in a European-base world, where history refutes it. The
"training room" element of the convention has no historical warrant this lane could find in any
register and is recorded as CONVENTION-only; if DW-0 wants it, it should be a signed band, not a
research finding.

---

## §8 · FAMILY G — the illicit market and the message loft: `Black market` (city L1949 "Illicit goods trade. Hidden locations.") · `Black market bazaar` (metropolis L2375 "Permanent underground market: contraband, forged documents, illegal services.") · `Whisper market` (city L2018) · `Rookery` (town L1454, city L2010)

Five rows and TWO distinct types, joined because both trade in things that are not goods-in-shops:
the GOODS market (three rows) and the INFORMATION brokerage (two `Rookery` rows plus the
`Whisper market`, which straddles). **Marked PARTIAL** at §0.3: the goods half is at full depth,
the message-loft half rests on the dovecote as an analogue and has no measured message station.

### §8.1 · The goods market

**(a) Analogue.** §1.7 established the ladder from the London second-hand trade and it is
restated here as the family's spine, with its evidence.

**The open rung, attested for three centuries.** Rag Fair in Rosemary Lane (later Royal Mint
Street) was "by far London's largest used clothing market in the eighteenth century", thriving by
1700, running "six afternoons a week (not Sundays) along the whole length of Rosemary Lane",
"mainly out in the open in the street", trading "unlicensed and in large part in stolen goods",
handled largely by women, and continuing "with gradual decline until after 1900"; Ned Ward in
1699 called the street a place of a "Tatter'd Multitude" and "all the Rag-pickers in Town", and
the modern assessment is that "Rosemary Lane and Rag Fair possessed one of the most powerfully
articulated reputations for disorder of any London street" (all CONFIRMED-digest, 2026-08-23,
from the Survey of London's Whitechapel pages, the St George-in-the-East history and the COVE
annotation). **The critical clause for a grammar: Rag Fair "did give rise to some market
buildings on its north side"** — buildings are a LATE and PARTIAL consequence of a market, never
its precondition.

**The enclosed rung, dated 1843.** "Mr. L. Isaac purchased the houses which then filled up the
back of Phil's-buildings, and formed the present Old Clothes Exchange eight years ago", before
which "the head-quarters of the traffic at that time were confined to a space not more than ten
square yards, adjoining Cutler-street"; the built form is "a warehouse, with a wide, open
entrance ... at the end of a broad street lined by three- or four-storey buildings" (all
CONFIRMED-digest, 2026-08-23). **The mechanism is the toll, not the secrecy** (§1.7): an owner
buys the frontage and can then charge for entry and for a table.

**The luxury rung, described in detail.** Greenwood's 1867 Houndsditch jewellery mart: converted
taverns; "a spacious private entrance"; a "demurely whitened" step; "a door so closely ajar that
at first sight it seemed shut"; a hall "as long as Fleet Street is broad, and wide in fair
proportion"; "a line of tables about four feet wide on either side down the whole length of it"
with vendors "seated on forms"; "a snug country posting-house liquor-bar" at one end; "a broad
skylight"; "at least two hundred people", "chokeful"; Sunday mornings about eleven o'clock
(CONFIRMED, victorianlondon.org/publications/unsentimental-22.htm, fetched 2026-08-23).

**Three structural facts the three rungs share, and they are the family's typed content.**

1. **The trade is TABLES, not shops.** Every enclosed instance is a hall of tables, four feet
   wide, in two lines, with dealers seated on forms. The unit is a TABLE, and a table is a
   subdivision of a room, which is the same missing construct family A raised for the pledge
   boxes and family D for the bed rows.
2. **The market has HOURS, and the hours are its security.** Six afternoons a week; Sunday
   mornings at eleven while the church bells ring. A market that exists for three hours a week
   leaves no building to seize. **Time is this family's substitute for concealment**, and it is a
   real design finding: the catalog's "Hidden locations" (L1949) is probably the wrong reading of
   the historical mechanism, which is hidden HOURS in an ordinary location.
3. **The drink bar is always there.** Lloyd's coffee house, the Houndsditch mart's
   "posting-house liquor-bar", the flash house, the converted tavern. An exchange needs a
   hospitality cell because bargaining takes time, and R-INST-4's vocabulary supplies it.

**The `Black market bazaar` row's "permanent underground market" is the one claim the European
record does not support**, and the dossier says so. "Permanent" and "underground" together
describe a subterranean commercial hall, and no such thing appears in this lane's reading of the
European record as a MARKET. What the record supplies instead is (i) permanent above-ground
enclosed exchanges (the Old Clothes Exchange, 1843), (ii) below-ground STORAGE at scale (the
London Docks' "17 vaults ... around 20 acres of cellarage, built with ventilated vaulting",
CONFIRMED-digest 2026-08-23), and (iii) the metropolis catalog's own separate `Underground city`
row (family C), which is where subterranean occupancy properly lives. **Recommendation, recorded
not decided:** `Black market bazaar` should draw a permanent enclosed exchange that MAY sit over
or beside the undercity rather than a hall dug beneath it, and its "underground" should be read
as the register's idiom for "illicit", which is exactly how the catalog uses the word in its own
`tags: ['criminal','underground']` on rows that are plainly above ground.

**Live/work.** Nobody lives in a market. The keeper of an enclosed exchange lives in the house
whose back it occupies, which is how Phil's Buildings worked.

**Siting/anchor law.** The record gives three, all of them EDGES: (i) a street that is a route
and not a destination (Rosemary Lane runs from Tower Hill to Cable Street); (ii) the BACK of a
block — the Exchange was formed from "the houses which then filled up the back of
Phil's-buildings", i.e. the market ate the block's interior; (iii) the boundary of a
jurisdiction, which is the general European rule for fairs. The engine's `criminal` district enum
and its `SEED_PROXIMITY` ordering both put this family in the shadows quarter, which is
consistent.

**Prosperity and wear.** Floor: ground, in a lane, at a stated hour. Rung 1: a yard behind a
public house. Rung 2: sheds around the yard. Rung 3: a roofed hall of tables with one entrance
and a bar. Ceiling: the hall plus warehousing plus an office. Decline sheds in reverse and the
market returns to the lane, which is why the type is so hard to abolish.

**Era grades.** The open market is available at every era. The ENCLOSED private exchange with a
paid entrance is late in the English record (1843) but the mechanism — an owner enclosing a
trading place and charging — is medieval and general (the market hall, the cloth hall, the
bourse). The grammar should gate on ENCLOSURE RIGHTS, not on a century.

**(b) Measured — goods half.**

| figure | value | source | label |
|---|---|---|---|
| earlier headquarters of the trade | "not more than ten square yards" (8.4 sq m, ambiguity flagged at A(b)) | Mayhew via digest | CONFIRMED-digest |
| Exchange formed | 1843, by purchase of the houses behind Phil's Buildings | digest | CONFIRMED-digest |
| built form | a warehouse with a wide open entrance, in a street of three- or four-storey buildings | digest | CONFIRMED-digest |
| mart hall length | "as long as Fleet Street is broad" (about 12-15 m) | Greenwood 1867 | CONFIRMED (simile); metrication DERIVED |
| table width | "about four feet" (1.22 m), two lines, full length | Greenwood 1867 | CONFIRMED |
| capacity | "at least two hundred people" | Greenwood 1867 | CONFIRMED |
| derived density | 0.45-0.68 sq m per person | this dossier's audit (§6) | DERIVED, flagged |
| top light | "a broad skylight" | Greenwood 1867 | CONFIRMED |
| hours, open market | six afternoons a week, not Sundays | digest | CONFIRMED-digest |
| hours, mart | Sunday about 11 a.m. | Greenwood 1867 | CONFIRMED |
| licit below-ground bulk store, for scale | 17 vaults, about 20 acres of cellarage, ventilated vaulting | digest | CONFIRMED-digest |

- **NOT FOUND, searched:** any plan of the Old Clothes Exchange; any measured aisle width between
  the two lines of tables (**derivable from the hall width and the tables and flagged as such:
  if the hall is 7-9 m wide and two 1.22 m tables occupy each side, the aisle is 4.5-6.5 m, which
  is generous and consistent with "chokeful" at two hundred people**); any toll or table-rent
  figure.

### §8.2 · The information brokerage and the message loft

**(a) Analogue.** Defect D6-2 (§0.2) established that the catalog's `Rookery` is a LOFT OF MESSAGE
BIRDS. The type therefore has two analogues — the DOVECOTE, which is the measured building, and
the PIGEON POST, which is the institution — and one licit twin, the news exchange.

**The dovecote is one of the best-measured minor building types in the English record.** From the
Historic England listing for the Beddington Park dovecote (**the list entry itself returned 403
to this lane and is GATED**; the following is CONFIRMED-digest, 2026-08-23): an early
eighteenth-century pigeon house, "a large octagonal red brick building of two storeys",
originally containing "about 1360 'L' shaped nesting boxes built into the inner face of the wall
giving it a complex honeycomb-like structure", with "a large rotating ladder, or potence" at the
centre used to reach them. Other measured specimens, all CONFIRMED-digest 2026-08-23: a
Lincolnshire dovecote "perhaps twenty feet in diameter" (6.1 m), "lined from floor to roof with
numerous nest holes"; Hall Farm, Canwick, with "1,100 nest boxes" and a potence surviving in a
SQUARE dovecote, which the source calls unusual; and a Sibthorpe dovecote, "circular stone, 10m
diameter at base and tapering in towards the top, 15m high".

**Number audit, performed.** A 6.1 m internal diameter gives a wall circumference of about
19.2 m; at a nest box of roughly 0.2 m width and 0.25 m course height, a 4 m high wall holds
about 16 courses of about 96 boxes, i.e. of the order of 1,500 — the right order for the 1,100
and 1,360 figures. The arithmetic closes, which means the type's defining number is real: **a
dovecote is a wall of 1,000-1,500 nest boxes, reached by a rotating ladder from a single
central pivot.**

**Four structural facts follow, and every one of them is useful.**

1. **The dovecote's interior IS its wall.** There is no room; the enclosure's inner face is
   entirely occupied by the fittings. That is a room type the engine has no vocabulary for at
   all: a cell whose furnishing is its envelope.
2. **The potence makes a circular plan functional.** The rotating central ladder is why the
   circular and octagonal plans dominate: one pivot reaches every box. This is a genuine
   plan-form CAUSE of exactly the kind DW's P1a construction-history leg wants — the form follows
   a fitting, not a fashion.
3. **The building is a STATUS OBJECT as well as a working one.** A large brick octagon in a park
   is not a utility shed, and dovecote rights were in many places seigneurial. That matters to
   the criminal reading: a `Rookery` that looks like a dovecote is CONSPICUOUS, and the catalog's
   own text handles this by making protection the licence — "Only a standing criminal
   organization can protect a loft like this, so one never appears without that backing."
4. **A message loft is NOT a dovecote and the dossier is explicit about it.** A dovecote breeds
   squabs for the table; a message loft keeps homing birds and needs a very different fitting set
   — trap entrances that admit and hold returning birds, individual perches, a handling bench, a
   record of dispatches. **No measured message loft of any period was found**, which is why this
   family is PARTIAL (§0.3, **ledger item L.7**).

**The institution: pigeon post as documented infrastructure.** The Abbasid caliphate is credited
with the first organised service under al-Mahdi in the late eighth century; a regular service
between Baghdad and Syria was established by Nur ad-Din in 1167; the system continued under the
Ayyubids and reached its height under the Mamluks in the thirteenth century, with "a series of
government-run pigeon stations ... each station overseen by a chief of the dovecote supported by
a guardian that cared for the birds" and "specialized towers or pigeon lofts ... for the birds to
land" (CONFIRMED-digest, 2026-08-23). **A very large figure — "over 3,000 pigeon lofts and
500,000 birds" for the thirteenth-century Abbasid service — appears in an aggregator and this
dossier flags it as SUSPECT and does not use it** (the Abbasid caliphate in the thirteenth
century was not in a position to run such a system, and no primary is cited); it is recorded so
that a later reader does not adopt it. The best-documented service is European and late: the
Paris siege of 1870-71, run from bases at Tours (about 200 km) and Poitiers (about 300 km), with
birds "transported by train toward the city before release"; "from 7 January to the end, 61 tubes
were sent off, containing 246 official and 671 private despatches", and across the siege roughly
"150,000 official and 1 million private communications" reached Paris; messages were "carefully
unpacked and placed between two thin sheets of glass", then projected by magic lantern or read
under microscopes for transcription by clerical teams (all CONFIRMED,
en.wikipedia.org/wiki/Pigeon_post, fetched 2026-08-23).

**That last sentence is the family's best find, and it is the WHISPER MARKET'S ROOM.** A message
service at scale needs a TRANSCRIPTION ROOM: a lit bench where a physically tiny message is
enlarged, read and copied by several clerks. It is a scriptorium in function (R-INST-3 holds the
type), it needs the best light in the building, and it is the one cell that makes an information
brokerage architecturally distinct from a shed with birds in it. **Number audit:** 61 tubes
carrying 917 despatches is about 15 despatches per tube, and 1.15 million communications over
roughly four months is on the order of 9,500 a day — which is a clerical operation, not a hobby,
and it justifies a room.

**The licit twin: the news exchange, and its one fixture.** Lloyd's Coffee House, opened by
Edward Lloyd on Tower Street in 1686 and moved to Lombard Street in December 1691, "had become
known as the meeting place in the City for those seeking shipping intelligence"; Lloyd "had a
pulpit installed in the new premises, from which maritime auction prices and shipping news were
announced", ran candle auctions, published "a regular sheet of intelligence on ships, cargo and
foreign events", and kept "a network of correspondents in ports across Europe" (all
CONFIRMED-digest, 2026-08-23). **The PULPIT is the fixture** — an information exchange needs a
raised speaking place, and that is an existing FURNISHING_KIND (`lectern`) and an existing
ROOM_KINDS member (`dais`). The catalog's own licit sibling is the `Carriers' hiring hall` (town
L985), whose description says returning drivers "share road conditions and bandit reports over a
cup of ale" — the same institution at village scale with no pulpit and an ale bench instead.

**The `Whisper market`'s own text is unusually specific and it should be respected.** "Brokers who
buy and sell knowledge by the piece, grade what they sell, and will manufacture a claim for a
patron who pays enough. It sites itself where the talk already is, among the fences, the late
houses, and the inns that ask nothing" (L2018). **This is a SITING RULE written into a
description** — the row sites itself relative to OTHER catalog rows — and it is the only row on
the shelf that does so. Its `serviceKeys` add `info_feed` and `info_plant` to the loft's
`info_calibration` and `info_query`, and `info_plant` is declared here and nowhere else in the
catalog.

**(b) Measured — information half.**

| figure | value | source | label |
|---|---|---|---|
| Beddington dovecote | octagonal, red brick, two storeys, about 1,360 L-shaped nest boxes, central potence | HE list entry 1002017 (page GATED, 403) | CONFIRMED-digest |
| Lincolnshire dovecote | about 20 ft (6.1 m) diameter, lined floor to roof with nest holes | digest | CONFIRMED-digest |
| Hall Farm, Canwick | 1,100 nest boxes, potence, SQUARE plan (called unusual) | digest | CONFIRMED-digest |
| Sibthorpe dovecote | circular stone, 10 m base diameter, tapering, 15 m high | digest | CONFIRMED-digest |
| derived box arithmetic | about 1,000-1,500 boxes for a 6 m circular dovecote | this dossier's audit | DERIVED, flagged |
| Paris siege bases | Tours about 200 km, Poitiers about 300 km | Wikipedia | CONFIRMED |
| Paris siege volume | 61 tubes, 246 official + 671 private despatches (7 Jan onward); about 150,000 official + 1,000,000 private over the siege | Wikipedia | CONFIRMED |
| message handling | between two thin sheets of glass, magic lantern or microscope, clerical teams | Wikipedia | CONFIRMED |
| Great Barrier Island service | up to five messages per bird | Wikipedia | CONFIRMED |
| Catalina service | 48 miles in about one hour, fifty birds trained | Wikipedia | CONFIRMED |
| Lloyd's | opened 1686 Tower Street; moved December 1691 Lombard Street; pulpit installed | digest | CONFIRMED-digest |

- **Bird range and speed, usable as a bound:** 48 miles (77 km) in about an hour (Catalina,
  CONFIRMED), and operational release points at 200-300 km (Paris, CONFIRMED). **A message loft's
  catchment is therefore of the order of 100-300 km**, which is a settlement-network fact the
  engine could one day use and is recorded for the record rather than for DW.
- **NOT FOUND, searched:** any measured plan, section or fitting schedule of a loft used for
  MESSAGE birds as distinct from table birds — **ledger item L.7**, the reason this family is
  PARTIAL. Targets for P1c: the Paris siege service's own operational records; military
  signal-pigeon loft standards of the 1914-1918 period (late, but measured and published);
  Ottoman and Mamluk *burj al-hamam* studies.

**(c) Contested and counterexamples.**

(i) **"The black market had no building."** Run, and the answer is TIME-DEPENDENT rather than
yes/no, which is the useful result: for three centuries Rag Fair had none, and in 1843 the same
trade acquired one when somebody bought the frontage. **The negation therefore produces the
ladder rather than refuting the type**, and the ladder's driver is enclosure rights, not
criminality.

(ii) **The `Black market bazaar`'s "permanent underground market" is unsupported** in the
European register and the dossier states it plainly rather than inventing a source (see §8.1).
Both readings are carried: the row as written (a subterranean hall) and the row as the record
supports it (a permanent enclosed exchange in the shadows quarter, possibly with undercity
storage below it). **Ledger item L.13.**

(iii) **The dovecote is not a message loft** — stated at (a) 4 and repeated here because it is
the family's honest limit. Everything measured in this section is about a building for eating
birds.

(iv) **The engine renders three of these five rows as counting houses.** From the simulation
(`RINST6-facetsim.mjs`, PLAUSIBLE-by-simulation): `Black market`, `Black market bazaar` and
`Whisper market` all match the `trade` regex on `market` / `bazaar` and receive `hall` +
`counting` + `strongroom`. Both `Rookery` rows match NOTHING and receive the two-cell `generic`
box. **So the two rows whose content is a specialised roof fitting get a generic house, and the
three rows whose content is a hall of tables get a merchant's strongroom.** Neither outcome is
absurd and neither is derived from anything about the row. §Σ holds the table.

(v) **A number this dossier refuses to use.** The "3,000 lofts / 500,000 birds" Abbasid figure
(above) is flagged SUSPECT and excluded. Recorded so it is not adopted later.

**(d) CIRCULATION typology (§452).**

- **The open market — NO_BUILDING.** The street IS the circulation. Nothing interior.
- **The enclosed exchange — BUILDING.** One `LOBBY` at the single private entrance (Greenwood's
  "spacious private entrance" and the door "so closely ajar that at first sight it seemed shut"),
  then a single `HALL` whose internal circulation is the AISLE between two lines of tables.
  **Aisle bucket, DERIVED from the hall's own arithmetic:** 4.5-6.5 m for the Houndsditch case,
  which is unusually wide and is explained by the crush; a general bucket of 2.0-3.0 m is
  proposed for a smaller exchange and flagged DERIVED. Top light rather than side light, because
  the hall is landlocked in the block's interior — **which is itself a circulation consequence:
  a market that eats a block's back has no elevation to put windows in.**
- **`GALLERY`** — licensed where the exchange occupies a yard with ranges around it (the yard
  rung), as the covered walk. Bucket 1.2-1.8 m, shared with R-INST-4's inn gallery.
- **`CORRIDOR`, `SCREENS_PASSAGE`, `STAIR_HALL`** — not licensed.
- **The message loft — HOSTED, and its circulation is VERTICAL and EXTERNAL.** A loft is reached
  by a stair or ladder that does not pass through the house's living cells, because birds are
  tended at dawn and the keeper must not wake the household; and the birds' own circulation is a
  set of trap entrances on the outside face. **The bird entrance is a typed joint on the ROOF,
  which is a surface the engine's joint vocabulary does not reach** — the five joints are
  `grate`, `stair`, `sealed_door`, `sluice`, `breach`, all of them ground-or-below. Recorded in
  §Σ as a small but real gap: **a settlement with an information brokerage has a joint in the
  sky.**
- **The transcription room** wants the best light in the building and therefore the best
  elevation, which puts it in tension with the loft's concealment. That tension is the whisper
  market's characteristic plan problem and is stated as such.

**(e) STORAGE typology (§453).**

- **The exchange:** `STORE` behind or beneath the hall (dealers leave stock); `CELLAR` where the
  host is a converted tavern, which is the usual case. Light NONE. **PROHIBITION: the store must
  not open on the hall**, or the hall's own security (one entrance) is defeated.
- **The message loft:** `STORE` for grain and for baskets; a `CLOSET` for the dispatch record —
  and the record is the incriminating object, so it is the loft's equivalent of family F's
  regalia store. Light NONE for the grain, ANY for the record if it is kept in the transcription
  room. **PROHIBITION: grain store not adjacent to the record**, because vermin.
- **The dovecote proper has NO storage cell at all** — its whole interior is nest boxes. This is
  the one building in six tranches whose storage typology is EMPTY by construction, and it is
  worth typing as such rather than leaving unstated.
- `PANTRY`, `BUTTERY`, `LARDER`, `STILL_ROOM`, `DAIRY`, `SCULLERY` — absent throughout; the
  exchange's bar takes R-INST-4's minimum service set.

**(f) Typed proposal.**

- **parti ids:** `OPEN_MARKET` (a typed NO_BUILDING with hours), `YARD_MARKET` (a hosted yard
  with ranges), **`ENCLOSED_EXCHANGE`** (one private entrance, one top-lit hall of paired table
  lines, a bar at one end, a store behind), and **`MESSAGE_LOFT`** (a roof-level cell with an
  external vertical, a wall of perches, external trap entrances, and — at the whisper-market rung
  — a transcription cell below it).
- **functions[]** — `ENCLOSED_EXCHANGE`: floor `trade_hall`, `entrance_control`; ladder adds
  `bar`, `store`, `office`; ceiling adds `warehouse`. `MESSAGE_LOFT`: floor `loft`,
  `bird_entrance`; ladder adds `handle` (the bench), `transcribe`, `record_store`.
  Shedding: `warehouse` → `office` → `store` → `bar`; `trade_hall` and `entrance_control` are the
  floor. For the loft: `transcribe` → `record_store` → `handle`; `loft` and `bird_entrance` are
  the floor.
- **fixtures[]:** `table` (the four-foot trading table — an existing kind, and the count matters
  more than the kind), `bench`/`form`, `bar`, `barrel`, `crate`, `shelf`, `ledger`, `lectern`
  (Lloyd's pulpit), `dais`; plus `nest_box_wall` (**NO TYPED HOME**; the dovecote's envelope-as-
  furnishing), `potence` (**NO TYPED HOME**; the rotating central ladder), `bird_trap`
  (**NO TYPED HOME**), `reading_glass` / `light_bench` (**NO TYPED HOME**; the transcription
  fitting).
- **structural buckets:** `topLit` (the landlocked hall), `singleEntrance`, `subdivision`
  (tables — the same construct families A and D require), `envelopeFitting` (the nest-box wall:
  a cell whose furnishing is its enclosure), `roofJoint` (the bird entrance), `bestLight` (the
  transcription cell's requirement, which competes with concealment).
- **licensing fields:** tier × prosperity × era (`ENCLOSED_EXCHANGE` gated on enclosure rights,
  not a century) × siting (route street / block interior / shadows quarter) × **`hours`** (a
  first-class licensing attribute for this family: a market that exists for six hours a week is a
  different building from one that exists daily) × culture.
- **criminal-share dial, as a CLOSED ENUM:** `illicitMarketGrade: NONE | LANE | YARD | EXCHANGE |
  BAZAAR` for the goods half, and `brokerageGrade: NONE | LOFT | MARKET` for the information half
  — where LOFT is the catalog's `Rookery` and MARKET is its `Whisper market`, exactly as the
  W-I design's minor/major pairing already has it. **The information half's licence is NOT the
  criminal share alone**: the catalog's own text makes it protection ("only a standing criminal
  organization can protect a loft like this"), which in engine terms is the syndicate standing
  `colonization.js` already reads, not the black-market capture. §Σ records the distinction,
  because using the wrong one would put lofts in settlements with no organisation to protect
  them.
- **verdict per tier:** town `Rookery` **HOSTED** (a loft on an existing building — and the
  catalog's protection clause means the host should be a building the organisation already holds,
  i.e. a family E front) · city `Black market` **HOSTED** (a yard or a converted tavern; "hidden
  locations" read as hidden HOURS) · city `Rookery` **HOSTED** · city `Whisper market`
  **HOSTED** (its own text sites it "among the fences, the late houses, and the inns that ask
  nothing") · metropolis `Black market bazaar` **BUILDING** (`ENCLOSED_EXCHANGE`).
- **HOME tags:** `trade_hall` → HOME: `ROOM_KINDS.hall`. `entrance_control` → **NO TYPED HOME**
  (the gatehouse again — third family to ask). `bar` → HOME: `ROOM_KINDS.common` (R-INST-4's
  vice template's front room). `store` → HOME: `ROOM_KINDS.store`. `office` → HOME:
  `ROOM_KINDS.counting`. `loft` → **NO TYPED HOME** — there is no roof-level working cell in
  ROOM_KINDS at all; `ATTIC`/`GARRET_STORE` in §453 is a STORE and this is a WORKING cell.
  `transcribe` → HOME: `ROOM_KINDS.records` (adequate) or `ROOM_KINDS.study`/`reading` (better in
  light terms but both are learning-template members). `record_store` → HOME:
  `ROOM_KINDS.records`. `bird_entrance` → **NO TYPED HOME**.

**(g) Consequences for the grammar.** Four.

1. **`hours` must be a first-class licensing attribute.** A market that exists six afternoons a
   week, or one Sunday morning, is architecturally different from a daily one — it needs no
   permanent structure, and the ABSENCE of a structure is its security. Nothing in §5's contracts
   can express temporal occupancy. This is the family's distinctive ask and it generalises to
   fairs (R-INST-2) and to the weekly market rows.
2. **A ROOF-LEVEL WORKING CELL and a ROOF JOINT are missing.** `ROOM_KINDS` has no loft that is
   not a store, and the joint vocabulary has no aperture above ground. Small, real, and required
   by two catalog rows.
3. **An ENVELOPE-AS-FURNISHING cell is missing** (`nest_box_wall`). The dovecote is the clean
   case; the arsenal's racked walls and the library's shelved walls are the same construct at a
   larger scale, so this is not a one-off.
4. **The `subdivision` construct is now requested by three families** (A's pledge boxes, D's bed
   rows, G's trading tables). It should be in the §5 contract.

**(h) Continental vs English.** The goods half's English evidence is a fair sample of a European
type: the *marché aux puces*, the German *Trödelmarkt*, the Italian second-hand fairs and the
Iberian *Rastro* all show the same open-street form and the same late enclosure. The information
half is where the English register is badly parochial and the correction is large: **the
organised message service is an ISLAMIC-WORLD institution in its developed form** — al-Mahdi's
service in the late eighth century, Nur ad-Din's Baghdad-Syria line in 1167, the Mamluk system of
the thirteenth century with a chief of the dovecote at each station (CONFIRMED-digest,
2026-08-23) — and Europe has nothing comparable until the nineteenth century's commercial
services and the 1870-71 siege. A setting-agnostic engine should therefore treat the state-run
relay network as an available INSTITUTION with a station building, not as an exotic, and the
criminal version (the catalog's `Rookery`) as the unlicensed shadow of it. The mechanism that
travels: **where a state runs relays, an unlicensed relay is worth protecting; where no state
does, an unlicensed relay has no network to be faster than.** That is a genuine licensing
condition and §Σ records it.

**(i) Fantasy note.** None required, but one boundary is worth stating because the row invites
it: the catalog's `Rookery` and `Whisper market` are MUNDANE information institutions, and
R-INST-5's family F holds the magical message network (`Message network (high magic)`, city
L2187). The two must not merge. Where a world's `magicLicense` is HIGH, the mundane loft is
outcompeted at the top of the market and survives at the bottom, exactly as a courier survives
beside a telegraph — a WEIGHT, not a room.

---

## §9 · FAMILY H — the rows with no premises, and the one cell they need: `Contract killer` (city L1968) · `Kidnapping ring` (city L1982) · `Human trafficking network` (city L1990)

**Handled clinically throughout, as the lane's brief requires and as the deity doctrine's
transposition demands: these are BUILDING TYPES with functions, thresholds and hazards, and
nothing in this section characterises a person or narrates a fate.** The product-scope law
forbids a named character's fate; this section names none. **Marked PARTIAL** at §0.3: the
holding cell is measured only through its licit twin.

**(a) Analogue.** Three rows, and the first of them is quickly disposed of.

**`Contract killer` has no building and its own text says so.** "An individual or small cell
operating beneath the assassins guild threshold. Accepts contracts through criminal
intermediaries. Less reliable but deniable" (L1968). An institution that operates THROUGH
INTERMEDIARIES has, by construction, no address that a client reaches, and the intermediaries are
other rows on this shelf (the fence, the flash house, the whisper market). Its verdict is
NO_BUILDING at every tier, for the same reason family F gave `Assassins' guild` the same verdict.
It is also the one Criminal-shelf row whose `priorityCategory` is `military` and whose tags are
`['guild','military']`, which means the engine treats it as a military institution for
prioritisation — a fact recorded at §0.1 and worth restating here, because any DW rule keyed on
`priorityCategory` will route this row to R-INST-1's shelf behaviour rather than to this one's.

**The other two rows DO need one cell, and the record supplies its licit twin in detail.** The
best-evidenced European building with a room for holding people against their will, outside the
prison system proper, is the London CRIMP HOUSE of the 1790s — documented because a fortnight of
riots in August 1794 pulled several of them down and generated court and press records.

From J. Stevenson, "The London 'Crimp' Riots of 1794" (*International Review of Social History*),
all CONFIRMED (Cambridge open PDF, curl-fetched and pypdf-extracted 2026-08-23):

- **The licit twin, and its sign.** "Recruiting centres for army, navy, and militia were known as
  'rendezvous houses', usually set up in a conveniently sited alehouse. There were a large number
  permanently established in the capital and at the outbreak of hostilities the number was
  increased. **Most of them had some form of strong-room to secure unruly recruits**; but though
  regarded with suspicion, they were at least openly recognisable as recruiting centres and
  **usually displayed a flag or posters**."
- **The illicit form.** Francis Place, quoted: "In these houses the basest of villainies were
  practised. **In most such houses there was a strong-room in which men who had been impressed or
  crimped were locked up, unlit**, until they could be removed to the tender off the Tower or to
  the Savoy prison."
- **The variants.** Edward Barrett, a discharged sailor, "claimed that he had been decoyed into
  the White Horse, Whitcomb Street, where he was at first given drink and then **imprisoned in
  the garret of the public house for a fortnight**"; and at another house "it was claimed that a
  man dying of small-pox was found **chained in a tiny cell**".
- **The hosts, named.** The Turks Head in Johnson's Court, Charing Cross ("an inn and brothel");
  the White Horse, Whitcomb Street; the Bull in Holborn; the Black Raven in Golden Lane,
  Cripplegate; the Sash in Middle Moorfields; houses in Shoe Lane and Bride Lane. **Every single
  one is a public house.**
- **The scale of the type.** The rioters' declared intention was "to pull down every house which
  had been opened as a House of Rendezvous", and five or six were destroyed with more attacked —
  so the type was numerous enough in one city to be a riot's target list.

**Five structural facts, and they are the family's entire typed content.**

1. **The holding cell is INSIDE A HOSPITALITY BUILDING.** Not a compound, not a warehouse, not a
   ship — a public house, because the trade begins with a drink and a conversation and the person
   must not move between the recruitment and the confinement.
2. **The cell is one of the inn's TWO CELLS THAT ALREADY LOCK**: the strong-room (a licensed
   victualler's secure store for drink and cash) or the GARRET (the topmost lodging, with one
   stair and no other exit). Nothing is built; two existing cells are repurposed.
3. **UNLIT is the operative modifier.** Place's word. A holding cell is distinguished from a
   store by the deliberate absence of light, and from a lodging by the same.
4. **The licit and illicit forms are architecturally IDENTICAL and are distinguished by a SIGN.**
   The rendezvous house flies a flag or posts bills; the crimp house does not. **This is the
   cleanest instance in six tranches of an institution whose only exterior difference from its
   lawful twin is signage** — and it is a real, drawable, projection-tier-friendly fact.
5. **The exit is not the street door.** Confinement is transient ("until they could be removed to
   the tender off the Tower"), and the removal is by CART or BOAT. The building therefore needs a
   yard or a water access that the front door does not serve — family E's second circulation
   graph, arriving from a fourth direction.

**The catalog's own logic about these rows is careful and should be respected.** Both
`Kidnapping ring` and `Human trafficking network` carry
`exclusionConditions: ['Slave market','Slave market district']`, and their descriptions explain
why in opposite directions: the ring "targets free persons for fraudulent insertion into slavery
through forged provenance documents. **Exploits the legal market's infrastructure where one
exists; runs its own operation where it doesn't**" (L1982); the network is a "fully clandestine
operation moving persons across jurisdictions outside legal channels. **Only fires where no legal
slave market exists.** Distinct logistics, safe houses, and corrupt border infrastructure"
(L1990). **The architectural consequence is exact and the dossier states it as the family's
headline finding:**

> **Where a licit market for the same traffic exists, the illicit operation has NO BUILDING OF
> ITS OWN — it uses the licit one, and its only architectural need is a DOCUMENT CELL. Where no
> licit market exists, the illicit operation must supply the whole chain itself — holding,
> moving, and a border joint — and it acquires cells.**

That is a general law of criminal architecture, derived here from the catalog's own exclusion
logic and corroborated by the fence (family A: no premises where the pawnbroker exists) and by
the smuggler (family C: no cellar where a bonded warehouse serves). **The illicit building is the
complement of the licit one**, and the engine can compute the complement because it knows the
roster.

**The DOCUMENT CELL is this family's genuinely distinctive room.** The ring's method is "forged
provenance documents", and forgery is a CRAFT with a fixed requirement set: a good north light, a
flat bench, storage for exemplars, and a press or seal matrix. It belongs with the scriptorium
(R-INST-3) in every respect except its secrecy, and its light requirement puts it in direct
tension with concealment exactly as the whisper market's transcription room does (family G).
**Two families independently produce the same plan problem — a secret room that needs the best
window — and that is a real design tension DW should be able to express.**

**Live/work.** Nobody lives in these rows' cells. The host's keeper lives above the house as any
publican does. Confinement is measured in days or a fortnight.

**Siting/anchor law.** The historical hosts cluster where the traffic embarks: Whitcomb Street
and Charing Cross for the recruiting trade, and the removal "to the tender off the Tower" names
the river as the exit. **The engine's own waterfront licence is therefore right for these rows**
— `WATER_ROUTE_VALUES` of `coastal | port | river` in both `monotoneComponents.js` and
`colonization.js` — and the family's siting rule is: a host with WATER OR ROAD EGRESS THAT IS NOT
THE FRONT DOOR. A settlement with neither should not draw these rows' cells at all, which is a
strong and checkable licence.

**Prosperity and wear.** There is no ladder worth the name and the dossier does not manufacture
one. What varies is the NUMBER of hosts and the presence of the document cell. Decline removes
the document cell first (forgery needs a skilled hand and good light, both expensive), leaving
the crudest form.

**Era grades.** The strong-room-in-an-inn is available wherever licensed victualling with a
secure store exists, i.e. very widely. The document cell requires a documentary state — seals,
registers, provenance papers — which is a REGISTRATION condition rather than a century, and it is
the same condition R-INST-1's records offices depend on.

**(b) Measured.**

- **The holding cell:** "a tiny cell" is the only size word in the record, with a man "chained"
  in it (CONFIRMED, Stevenson, extracted 2026-08-23). **No dimension exists in any source this
  lane reached** — this is why the family is PARTIAL and it is **ledger item L.9**.
- **The bound this dossier uses instead, and its warrant.** The measured concealed cells of §1.1
  give the human-occupiable minimum from a completely independent tradition: 0.79 m x 1.52 m x
  1.14 m high (the bread-oven hide) to 0.91 m x 2.44 m x 1.52 m high (the swinging-beam hide);
  and Beames's measured rookery rooms give the lived minimum at 1.83 m x 1.52 m for eight
  persons. **A holding cell for one to a few persons for days therefore sits between about 2 and
  9 square metres with headroom of 1.5-2.1 m**, and the whole of that bucket is DERIVED from
  other families' measurements and is flagged as such. It is offered because a grammar needs a
  number and inventing one silently would be worse.
- **The garret variant:** no dimension; the type's own bound is the roof pitch, and R-INST-4's
  inn chamber figures govern.
- **The strong-room's licit dimensions:** none found. A victualler's secure store is not a
  surveyed type.
- **Scale of the type in one city:** "five or six" crimp houses pulled down in August 1794 with
  more attacked, out of "a large number permanently established in the capital" (CONFIRMED,
  Stevenson, extracted 2026-08-23). **Number audit:** this is the same order as the 67 flash
  houses of c.1815 — a few dozen premises of a marked kind in a city of about a million, i.e.
  roughly one per 15,000-30,000 people. Recorded as an ORDER OF MAGNITUDE and explicitly NOT as a
  prevalence prior (`EUROPEAN_FANTASY_BASE` forbids one), and the engine mints no probability
  from it.
- **NOT FOUND, searched:** any measured plan of a crimp house; any dimension for a barracoon or
  any other holding structure of the licit slave trade (the search was framed clinically as a
  building-type search and returned nothing measured); any survey of a forger's workshop.

**(c) Contested and counterexamples.**

(i) **"These rows have no building."** Run, and CONFIRMED for `Contract killer` on its own text,
and CONFIRMED-with-one-exception for the other two: the exception is the single holding cell, and
the cell is a repurposed cell of a licit building. **No source gives any of these three rows a
structure of its own.**

(ii) **The counterexample, and why the dossier does not take it.** The licit slave trade DID
build: barracoons, market enclosures, holding yards. But that is R-INST-4's `Slave market` and
`Slave market district` (town L1001, city L1635, city L1642), it is a CIVIC COMMERCIAL type where
it is lawful (the town row's own description says "Where slavery is legally sanctioned, this is
civic commercial infrastructure"), and the catalog's `exclusionConditions` deliberately prevent
these two rows from coexisting with it. **Taking the barracoon as this family's analogue would
invert the catalog's own logic**, which is that the illicit rows fire only where the licit
building is absent. The boundary is stated and the type is left to R-INST-4.

(iii) **A discrepancy inside the catalog's own exclusion logic, reported with both sides.**
`Kidnapping ring` says it "exploits the legal market's infrastructure where one exists; runs its
own operation where it doesn't" — but it carries `exclusionConditions` against the slave-market
rows, so in the engine it CANNOT fire where the legal market exists, and the first half of its
own description is unreachable. Both readings are recorded: the description is richer than the
condition, and either the condition is doing what the designer wanted (the ring is a
no-legal-market phenomenon) or the description anticipates a coexistence the engine forbids.
**Ledger item L.14**, for the content train rather than for DW.

(iv) **The engine draws all three as the generic two-cell box.** From the simulation
(`RINST6-facetsim.mjs`, PLAUSIBLE-by-simulation): `Contract killer`, `Kidnapping ring` and `Human
trafficking network` match no `institutionNature` regex and resolve to `generic` — `main` +
`back`. For rows whose verdict is NO_BUILDING, drawing a generic box is arguably the WRONG
failure mode in a specific way: **the engine has no way to decline to draw**, so a row with no
building gets a small house. §Σ raises `NO_BUILDING` as a first-class verdict the interior model
needs.

(v) **The signage finding cuts against a common design instinct.** Every instinct says the
criminal building is the concealed one; here the criminal building is the UNMARKED one and its
lawful twin is the MARKED one. A grammar that expresses "criminal" as hidden geometry will miss
this entirely, while a grammar that can express SIGNAGE gets it for free.

**(d) CIRCULATION typology (§452).**

- **All three rows: NO_BUILDING.** The circulation belongs to the host.
- **The holding cell's circulation, where it exists.** One door, lockable, on the host's own
  route: from the taproom by the inn's back stair to the garret, or from the service end to the
  strong-room. **The defining property is that the cell is a LEAF with degree one** — one door,
  no second exit, no window big enough. That is a graph property the validator can check.
- **The removal route is the family's second circulation element** and it is EXTERIOR: yard →
  cart, or yard → stair → water. `EXTERIOR_WALK` plus, where the host is waterside, a
  `VERTICAL` to a landing. **The engine's `sluice` joint at a "waterfront" anchor is the nearest
  typed thing and it is a DRAIN joint, not a landing** — a settlement's water access for PEOPLE
  has no typed joint at all, which §Σ records.
- **`CORRIDOR`, `GALLERY`, `LOBBY`, `STAIR_HALL`:** the host's, unchanged. This family adds
  nothing to a plan's circulation except a degree-one leaf and a back route.
- **The document cell** sits on the host's ordinary circulation at the best-lit end, which is the
  opposite end from the holding cell. **The plan therefore has a legible polarity: light at one
  end, lock at the other** — and stating it that way makes the family drawable without any new
  class.

**(e) STORAGE typology (§453).**

- `STRONGROOM` — the holding cell's first form. Light: **NONE, deliberately.** Adjacency: the
  service end. **PROHIBITION: no external window; no second door.**
- `ATTIC` / `GARRET_STORE` — the holding cell's second form, and here it is an OCCUPIED cell
  rather than a store, exactly as family D's garret is. Light: minimal.
- `STORE` — the host's own, unchanged.
- `CLOSET` — the document cell's exemplar store: seals, blank forms, sample hands. Light: NONE.
  **This is the one cell in the family whose contents are the evidence**, and it is therefore the
  one that gets a hide (family A's and §1.1's construct) rather than a lock.
- `PANTRY`, `BUTTERY`, `LARDER`, `SCULLERY`, `DAIRY`, `STILL_ROOM` — the host's.
- **PROHIBITIONS, collected.** (i) The holding cell has one door and no window. (ii) The holding
  cell is not adjacent to the street elevation. (iii) The document cell has the best light and is
  therefore ON the street elevation, which is the tension noted above and is resolved
  historically by putting it UPSTAIRS at the front, where a window is unremarkable. (iv) The
  document store is a HIDE, not a locked cell, because a lock invites a warrant.

**(f) Typed proposal.**

- **parti ids:** none. All three rows are **NO_BUILDING** and the proposal is a set of CELL
  MODIFIERS applied to a host, which is the honest shape.
- **functions[]** — applied to a host: `hold` (the unlit degree-one cell), `remove` (the yard or
  water egress — a THRESHOLD, not a room), `forge_documents` (the lit bench), `exemplar_store`
  (the hide). No ladder; the family's variation is in WHICH of these four a settlement licenses,
  not in how many rungs it climbs.
- **fixtures[]:** `cell` (an existing FURNISHING_KIND, and exactly right — the engine's `cell`
  furnishing is drawn in the `cells` room of the security template), `bunk`, `bar`/`drawbar`
  (**NO TYPED HOME**, and colliding with the tavern `bar` as family B noted), `desk`, `shelf`,
  `strongbox`; plus `seal_matrix` (**NO TYPED HOME**), `press` (**NO TYPED HOME**; and note §453
  already uses "press" for a storage fixture, so the collision must be resolved by DW-0).
- **structural buckets:** `unlit`, `degreeOneCell` (one door, no window — a GRAPH constraint
  expressed as a structural bucket), `rearEgress` (yard or water, not the street),
  `bestLightCell` (the document bench), `unsigned` (the negative of the licit twin's flag).
- **licensing fields:** tier (city only, per the catalog) × siting (the host must have rear or
  water egress) × **`licitCounterpartAbsent`** (the catalog's own `exclusionConditions`, promoted
  to a named licensing field because it is the family's central law) × era
  (`forge_documents` requires a documentary state) × culture.
- **criminal-share dial, as a CLOSED ENUM:** `coercionGrade: NONE | HOSTED_CELL | CHAIN`. NONE
  draws nothing. HOSTED_CELL marks one existing lockable cell of one host as `hold` and unlights
  it. CHAIN additionally licenses `forge_documents` and requires the host to have rear or water
  egress — and CHAIN is available only where `licitCounterpartAbsent`, which is the catalog's own
  rule expressed as a licence.
- **verdict per tier:** all three rows **NO_BUILDING** at every tier. `Contract killer` marks
  nothing at all (it has no cell; its intermediaries are other rows). `Kidnapping ring` and
  `Human trafficking network` each mark ONE host and, at CHAIN, add the document cell.
- **HOME tags:** `hold` → HOME: `ROOM_KINDS.cells` — **the engine already has this room kind and
  it is exactly right**, though today it is reachable only through the `security` interior
  template at tier index 2 and above. `remove` → **NO TYPED HOME** (a threshold). `forge_documents`
  → HOME: `ROOM_KINDS.records` (adequate) or `ROOM_KINDS.study` (better in light terms).
  `exemplar_store` → HOME: `ROOM_KINDS.concealed` — the second family after C whose use of the
  engine's own concealed room is historically exact.

**(g) Consequences for the grammar.** Four.

1. **`NO_BUILDING` must be a first-class verdict the interior model can execute.** Today an
   institution with no building still resolves to a template and draws a box. Six tranches have
   now produced dozens of NO_BUILDING rows; this is the accumulated ask, and this family is the
   clearest case because drawing a "contract killer's house" is actively misleading.
2. **SIGNAGE must be expressible.** The rendezvous house's flag and the crimp house's absence of
   one is the only exterior difference between a lawful and an unlawful building in the entire
   tranche. Proposal: `signage: NONE | TRADE_SIGN | OFFICIAL` on a building, which also serves
   the inn (R-INST-4), the guild (R-INST-2) and the shop.
3. **A cell needs a GRAPH-DEGREE constraint.** "One door, no window" is a property of the plan
   graph, not of the cell. S9's validator can check it if the contract can state it. Proposal:
   `maxDoors` and `maxWindows` on a Function.
4. **A WATER LANDING joint is missing.** The joint vocabulary's `sluice` is a drain; a settlement
   with a waterfront needs a typed joint for people and goods crossing between land and water.
   This is a genuine gap that affects family C, family H and R-INST-2's port rows equally.

**(h) Continental vs English.** The English record supplies the crimp house because England had a
press-gang problem that produced riots and therefore records. The continental analogues are the
same institution under different names — the *racoleur*'s house in France, the recruiting
*Werbehaus* in the German states — and the maritime version, *shanghaiing*, is documented on both
sides of the Atlantic in the nineteenth century with the same building: a waterfront boarding
house whose keeper supplies crews. **Every version is a HOSPITALITY BUILDING WITH A LOCKABLE
UPPER ROOM AND A WATER EXIT**, which is a strong cross-register convergence and makes the type
safe to generalise. The one continental element the English record lacks is the LAND-BORDER
crossing point, which the catalog's `Human trafficking network` names directly ("moving persons
across jurisdictions ... corrupt border infrastructure") — and that is not a building this
family draws but a JOINT at the settlement's edge, which the map program owns rather than DW.

**(i) Fantasy note.** None. The row set is deliberately mundane and stays so.

---

## §10 · FAMILY I — THE ENFORCEMENT BOUNDARY (cross-reference only, by charter)

**This family researches nothing.** The brief's instruction is explicit: the enforcement rows —
watch, courthouse, prison, gallows — belong to R-INST-1, and the vice rows belong to R-INST-4;
this family states the boundary per entry and cross-references rather than re-researching. It
exists because a criminal-institutions dossier that said nothing about enforcement would leave
DW-0 to guess where the seam is, and because three of this tranche's findings are ABOUT the
seam and have to be filed somewhere.

### §10.1 · The boundary, entry by entry

Every row this dossier declined, with the tranche that holds it and the section number to read.

| catalog row | line(s) | held by | their section | why this tranche declined it |
|---|---|---|---|---|
| `Town watch` | L1309 (REQ) | R-INST-1 | §14 family K | the watch is a civic institution; this dossier reads it only as the FORCE the criminal rows are sited against |
| `Professional city watch` | L1860 (REQ) | R-INST-1 | §14 family K | as above |
| `Courthouse` | L1508 | R-INST-1 | §6 family E | |
| `Multiple courthouses` | L2204 (REQ) | R-INST-1 | §6 family E | the description names "criminal" courts, which is why the keyword sweep caught it (§0.2) |
| `Multiple court buildings` | L2269 | R-INST-1 | §6 family E | |
| `Small prison/stocks` | L1515 | R-INST-1 | §7 family F | |
| `Large prison` | L2211 | R-INST-1 | §7 family F | |
| `Massive prison` | L2453 | R-INST-1 | §7 family F | |
| `Workhouse` | L2218 | split: R-INST-1 §7 (carceral half), R-INST-4 §12 family K (poverty half) | | a precedent for a split row, and the reason this dossier splits nothing |
| `Toll bridge` | L508 | R-INST-1 | §8 family G | **load-bearing here**: it is half of the smugglers' tunnel's licence (family C) |
| `Customs house` | L1022 | R-INST-1 | §8 family G | **load-bearing here**: same |
| `Harbour master's office` | L1677 | R-INST-1 | §8 family G | **load-bearing here**: same |
| `Gates (if walled)` | L1317 | R-INST-1 | §12 family I | **load-bearing here**: the wall half of the same licence, and the anchor of the smuggler cellar |
| `Town walls` / `City walls and gates` / `Massive walls and fortifications` | L1293, L1852 (REQ), L2279 | R-INST-1 | §11 family H' | the engine reads them through `defenseProfileHasWalls` |
| `Mint` / `Assay office` / `Mint (official)` | L1205, L1015, L1663 | R-INST-1 | §9 family G' | the counterfeiter's target; no counterfeiting row exists on the Criminal shelf (§10.3) |
| `Gambling den` | L1471 | R-INST-4 | §8 family G | a front HOST for family E |
| `Gambling halls` / `Gambling district` | L2036, L2084 | R-INST-4 | §8 family G | as above |
| `Fighting pits` | L2052 | R-INST-4 | §10 family I | described as "illegal or semi-legal ... underground locations" and therefore very nearly this tranche's; declined per the charter, and flagged to DW-0 as the row most likely to need BOTH dossiers |
| `Brothel` / `Brothel (red light district)` / `Red light district` | L1492, L2044, L2076 | R-INST-4 | §7 family F | treated clinically there; a front HOST here |
| `Slave market` / `Slave market district` | L1001, L1635, L1642 | **R-INST-2** | §R (exchanges, auction and brokerage) | **the brief assigned these to R-INST-4 and they are in fact R-INST-2's** (verified by grep: 9 occurrences in `draft-R-INST-2-TRADE-CRAFTS.md`, 0 in R-INST-4's). Correction recorded so DW-0 looks in the right dossier. Load-bearing here: the `exclusionConditions` on rows 20 and 21 |
| `Carriers' hiring hall` | L985 | R-INST-2 | (economy) | the licit information exchange; cited by family G |
| `Warden's Lodge` | L1364 | R-INST-5 | §10 family I | caught by the keyword sweep as a `den` substring artefact (§0.2) |

**No gallows row exists in the catalog.** The sweep found none under `gallows`, `gibbet`,
`scaffold` or `pillory`; `Small prison/stocks` (L1515) carries the stocks and is R-INST-1's.
Recorded because the brief named the gallows as an enforcement counterpart and it turns out not
to be an entry.

### §10.2 · The three findings that live ON the seam

These are this tranche's, not R-INST-1's, because in each case the criminal row is the thing
being explained.

**(i) THE COMPLEMENT LAW.** Stated at H(a) and reached independently by three families: **the
illicit building is the complement of the licit one.** Where a pawnbroker exists, the fence needs
no premises (family A). Where a bonded warehouse exists, the smuggler's problem is the
arbitrage rather than the store (family C). Where a legal slave market exists, the trafficking
row does not fire at all and the kidnapping row's own text says it uses the licit
infrastructure (family H). The engine can compute this because it knows the roster: **a criminal
row's building program should be derived from what the settlement's LICIT roster does NOT
supply.** That is a real, cheap, checkable rule, and it is the single most portable thing in
this dossier.

**(ii) THE SIGNAGE LAW.** Stated at H(a) 4. The licit recruiting house and the illicit crimp
house are the same building, and the difference is a flag. Generalised: **an unlawful institution
is most often distinguished from its lawful twin not by concealment but by the absence of a
public sign.** This is the seam's most drawable fact and it costs one enum on a building.

**(iii) THE COUNTERMEASURE SHAPES THE CRIMINAL PLAN, AND THE CRIMINAL PLAN SHAPES THE
COUNTERMEASURE.** Three instances from this tranche, each of which is a piece of enforcement
architecture appearing INSIDE a criminal building's requirements:
- Priest hunters "measured the height of ceilings and the length of walls in the hope of
  detecting hidden chambers" (CONFIRMED-digest, 2026-08-23), which is why a hide is subtracted
  and never added (§1.1).
- The Goldsmiths' Company's "warning carrier" system carried printed descriptions of stolen
  property to "goldsmiths, jewelers, watchmakers, bankers, refiners, toymen, salesmen, and
  pawnbrokers" from the mid-sixteenth century (CONFIRMED-digest, 2026-08-23), which is why a
  receiver needs an alteration bench (family A).
- Customs and Excise "considered [quay sheds] a security risk" and had them omitted from the
  early West India Dock plans (CONFIRMED-digest, 2026-08-23) — enforcement DELETING a building
  type, which is the inverse operation and the reason the bonded warehouse looks as it does
  (family C).

The general statement for DW-0: **criminal architecture and enforcement architecture are one
design problem with two authors.** A grammar that generates them from separate rosters will
produce fronts that no watch could ever detect and watch-houses that guard nothing.

### §10.3 · Two absences on the Criminal shelf, noted for the content train

Not defects, but gaps a reader of this dossier will notice and should not have to re-derive.

- **There is no COUNTERFEITING or FORGERY row on the Criminal shelf.** The sweep ran `forger` and
  `counterfeit` across all 311 rows and found nothing. The function appears only inside another
  row's description (`Kidnapping ring`'s "forged provenance documents") and in the metropolis
  `Black market bazaar`'s "forged documents". The catalog has a `Mint`, an `Assay office` and an
  official `Mint`, i.e. the whole apparatus the counterfeiter attacks, and no attacker. This
  dossier's family H supplies the DOCUMENT CELL, which is the forger's room, and records that if
  a row were ever added the cell already has its research.
- **There is no SPY, INFORMANT or intelligence-service row.** `spy` and `informant` returned
  nothing. The information function is carried entirely by the two `Rookery` rows and the
  `Whisper market` (family G) on the illegal side and by the `Carriers' hiring hall` on the licit
  side. Recorded, with no recommendation: the undercity charter's OB-6 ruling is DECLINE-AS-
  DEFAULT on roster expansion (§5 of `draft-UNDERCITY-PLAN.md`), and this dossier does not
  reopen it.

### §10.4 · What R-INST-1 should be told

Three items, small, and listed here because this is the last research tranche and nothing after
it will notice them.

1. **R-INST-1's family G (toll bridge, customs house, harbour master's office) is half of an
   ENGINE LICENCE that is currently inert.** `colonization.js`'s smugglers' tunnel is licensed by
   `WALL_OR_TOLL_AND_CRIMINAL_SHARE`, and the TOLL half resolves to nothing because those three
   rows carry no facet a chokepoint read could resolve. Family C proposes an
   `institutionRevenue: toll | customs | none` declared facet as the cure. **The three rows are
   R-INST-1's; the consequence is this tranche's.**
2. **R-INST-1's family I (the gatehouse) supplies the missing ROOM KIND four families here have
   asked for.** The porter's lodge, the fondaco's gate, the han's gate, the huiguan's gate and
   the rookery court's watched mouth are the same cell as a town gatehouse's porter's room, and
   R-INST-1 will have the measured version. §Σ requests `ROOM_KINDS.gatehouse` once, on behalf of
   both tranches.
3. **R-INST-1's family F (gaol / lock-up) and this tranche's family H holding cell are the same
   cell at different legal temperatures**, and the engine already types it: `ROOM_KINDS.cells`
   with the `cell` furnishing, in the `security` interior template at tier index 2 and above.
   The only difference the record supports is LIGHT — a gaol has a barred window and a crimp
   house's strong-room is "unlit" (CONFIRMED, Stevenson, extracted 2026-08-23). One boolean
   separates a lawful cell from an unlawful one, which is a pleasingly small answer.

**No (a)-(i) sub-structure is given for this family**, because it researches nothing and a full
family shape would be padding. §0.3 records it as BOUNDARY ONLY, by charter.

---

## §15 · THE CONTINENTAL AND NON-EUROPEAN REGISTER — where this tranche's base is parochial, and the setting-agnostic law that governs the borrowing

**The law first, stated before any borrowing, because the borrowing is the risky part.** The
product is SETTING-AGNOSTIC (memory `product-scope-boundaries.md`) and the map program's own rule
governs: **the MECHANISM travels; the geography, the style and the name do not.** A finding from
Venice, Istanbul, Cairo, Amsterdam, Chongqing or Iga enters the grammar as a CAUSAL RULE — "a
trade the authority wishes to watch is concentrated into one gated building" — and never as a
named form. Nothing in this section proposes that a settlement generate a *fondaco*, a *han*, a
*huiguan* or a ninja house; each is cited as evidence that a mechanism is general rather than
English. Where a source is a modern museum or a tourism page rather than scholarship, the label
says so and the finding is used only for its mechanism.

### §15.1 · Why this tranche needs the correction more than its five siblings

Seven of the nine families rest on English sources of 1590-1890, and the reason is not that
England was more criminal but that England produced the RECORD: printed trial proceedings, a
parliamentary committee culture, slum surveys by clergymen and journalists, and a revenue service
that prosecuted in writing. **A dossier built from that record will over-fit to a society that
writes its crimes down.** The correction below is therefore not decoration; it changes three
verdicts (family F's guild, family G's message loft, family E's front) and supplies the tranche's
single most repeated structural finding.

### §15.2 · THE CONTROLLED-GATE BUILDING — the mechanism this section exists to establish

Four institutions from four cultures, all solving the same problem — *how does an authority let a
suspect trade happen while seeing all of it* — and all reaching the same plan.

**The Venetian *fondaco*.** The Fondaco dei Tedeschi concentrated the German merchants of Venice
into a single building from the thirteenth century; the word is from the Arabic *funduq*; the
idea was "part palace, part warehouse, part dormitory, with merchants living on-site and access
carefully regulated". After a fire it was rebuilt in the sixteenth century as "a solid
four-storey Renaissance structure arranged around a large inner courtyard", with "the ground
floor ... designed for storage and canal access, the middle levels ... administration and trade,
and the upper areas ... a large number of merchant rooms under rules that limited movement and
managed taxation"; boats reached the ground floor; the first floor held offices (all
CONFIRMED-digest, 2026-08-23). **The mechanism, stripped of Venice: residence, storage and trade
are stacked in one building with ONE regulated access, so that the authority's revenue and its
surveillance are the same act.**

**The Ottoman *han*.** "The han or caravanserai consisted of cells arranged around a courtyard";
"it has a rectangular shape, much deeper than wide, with **one single entrance gate to ensure
security**"; the courtyard held a fountain and often a small mosque; "ground floors for stables
and warehouses, upper levels for guest rooms"; "drovers and merchants slept and did business
upstairs, with their precious cargo stored in the ground-floor rooms"; "along the inner wall on
the right runs a shady arcade in front of the merchants' sleeping quarters" (all
CONFIRMED-digest, 2026-08-23). **Same plan, same reason, different empire — and the source states
the causal clause explicitly ("to ensure security"), which the Venetian sources only imply.**

**The Chinese *huiguan*.** Family F's evidence: a five-part complex of stage, courtyard, side
council halls, main hall and wing rooms for reading and lodging, with the Beijing Huguang hall's
"10 backstage rooms" and "40 rooms on two levels" (CONFIRMED-digest, 2026-08-23). Not built by an
authority to watch a trade but by a trade to look after its own — and it arrives at the same
courtyard-and-gallery plan, which is the point: **the plan is a solution to CONTROLLED ACCESS TO
MANY ROOMS, whoever is doing the controlling.**

**The English galleried inn (R-INST-4's, cited not re-researched).** The gateway passage, the
yard, the gallery over it giving onto the chambers. Same plan again, in the register this tranche
otherwise over-uses.

**The convergence, and what it licenses.** Four cultures, four centuries, one plan: **GATE →
COURT → GALLERY → CELLS, with `entrances: 1`.** This is R-INST-5's §488.2 finding (3) — the
single controlled entrance, its most repeated finding across five instances — reproduced here
across four more, from an entirely different literature. **Two of the six research tranches have
now independently converged on `compound.entrances: 1` as a first-class parti attribute, and this
dossier joins R-INST-5 in recommending it.** The joint recommendation, stated once for DW-0: a
parti may declare `entrances: 1`, and when it does, law 6 (frontage from the parcel) reads the
COURT as the frontage surface for every cell except the gate itself.

**The consequence for the criminal shelf, which is the reason it is in THIS dossier.** A
settlement rich in gated-court institutions has FEWER fronts, not more, because the trade a front
would host has been concentrated where it can be watched (stated at E(h)). And conversely the
`Thieves' guild (powerful)` row's own building, at the DOMINANT tolerance rung, is the same plan
turned inward: the criminal fraternity that can build adopts the authority's own device. **The
gate is neutral technology.**

### §15.3 · The clandestine institution inside an obedient facade — the Dutch correction

Family E's evidence, restated here because it is the section's second mechanism. The *schuilkerk*
exists because Dutch law prohibited the FACADE and not the function: worship was permitted "just
so long as they didn't do it in public or even in a building that looked like a church"
(CONFIRMED-digest, 2026-08-23), and *Ons' Lieve Heer op Solder* is the surviving specimen — a
1630 canal house whose top three floors became a full church between 1661 and 1663, entered
through a disguised door and a tight spiral (CONFIRMED, en.wikipedia.org/wiki/Ons'_Lieve_Heer_op_Solder,
fetched 2026-08-23, plus digest for the door).

**The English contrast is the finding.** English recusancy produced the priest HIDE — a cell for
one to a dozen people, subtracted from a chimney or a stair (§1.1). Dutch Catholicism produced a
CHURCH — a hall for a congregation, installed in an attic. Same prohibition class, same century,
two completely different buildings, and the variable is **the size of the community that must
fit.** Generalised for the grammar: `hiddenProgramSize` selects between `HIDE_CELL` and
`OVER_PLAN`, and nothing else needs to.

### §15.4 · The concealed-mechanism house — Japan, and an honest caveat

The Iga-ryu Ninja Museum's house at Iga-Ueno, Mie prefecture, is "an authentic old house ... 
actually inhabited by an Iga clan ninja", moved from the Takayama area; "from the outside it
appears to be an ordinary one-storied Japanese-style house with a thatched roof, but on the
inside it is a complicated structure that is full of many traps and devices"; the named devices
are *dondengaeshi* (a revolving trapdoor or turning wall), *nukemichi* (a secret passage),
*kakushido* (a hidden door) and *katanakakushi* (a hidden sword store) (all CONFIRMED-digest,
2026-08-23). **No dimension of any kind was obtained**, and the source class is museum and
tourism material rather than architectural survey — **ledger item L.15**.

**Two honest caveats before anything is taken from it.** First, the museum was established in
1964 and its house was relocated; the provenance of individual devices is not established by
anything this lane read, and the popular ninja-house literature is heavily reconstructed. Second,
and more usefully: even at face value the devices are the SAME FOUR CONSTRUCTS the European
record gives — a turning panel (Harvington's swinging beam), a hidden door (the *schuilkerk*'s
fake door), a passage (Deal's cellar chain), and a concealed store for an incriminating object
(the receiver's press, family F's regalia store). **The convergence is the finding, and the
absence of measurement means the Japanese case CORROBORATES rather than contributes.** It is
included because it is the non-European concealed-cell case a reader will expect, and because
saying "it adds no measured content" is more useful than quietly leaning on it.

### §15.5 · The illicit district that is not a rookery — three inversions

Family D's rookery is one morphology and the record supplies at least three others, which
matters because a grammar that only knows the blind court will site every criminal district
wrongly in every culture that does not have one.

- **The Cour des Miracles (Paris).** Sauval's seventeenth-century description — "a great
  cul-de-sac which was stinking, muddy, irregular and unpaved", reached "through tiny and foul
  streets, which twist and turn in all directions", with "a half-buried house of mud ... of no
  more than fifty square yards, but which lodged fifty women" (CONFIRMED-digest, 2026-08-23) —
  is the SAME morphology as St Giles two centuries earlier, which is the corroboration family D
  used. **But Sauval is contested** ("there is some debate about how reliable Sauval was as a
  historian and there are a lot of unsubstantiated claims in his work", CONFIRMED-digest), and
  the modern scholarship treats the *cours* as partly a literary construction. Carried as
  CONTESTED (**ledger item L.8**).
- **The Neapolitan *bassi*.** Ground-floor one-room dwellings opening directly on the street:
  the same density with the OPPOSITE morphology — maximum street exposure instead of blind
  courts. Recorded as a pointer, not researched (**ledger item L.16**). Its existence is what
  proves that density and permeability are INDEPENDENT variables, which family D's grammar needs.
- **The Liberties.** Jurisdictional islands — of Dublin, of London, of many European cathedral
  and monastic precincts — where the sheriff's writ ran weakly. **The mechanism is JURISDICTION,
  not morphology**, and it is the one this dossier most wishes it had researched: it would give
  the criminal district a licence that has nothing to do with poverty or with plan form, which is
  a shape none of the researched families supply. **Ledger item L.17**, and the single strongest
  recommendation for a P1c follow-up in this tranche.

### §15.6 · The organised message relay is not a European institution

Family G's correction, restated because it changes a verdict. The developed pigeon post is an
Islamic-world institution: al-Mahdi's service in the late eighth century; Nur ad-Din's regular
Baghdad-Syria line in 1167; the system at its height under the Mamluks in the thirteenth century,
with government stations "each ... overseen by a chief of the dovecote supported by a guardian
that cared for the birds" and "specialized towers or pigeon lofts ... for the birds to land" (all
CONFIRMED-digest, 2026-08-23). Europe has nothing comparable until commercial services of the
1840s-50s and the Paris siege of 1870-71 (CONFIRMED, en.wikipedia.org/wiki/Pigeon_post, fetched
2026-08-23). **A grammar built only on the European base would make the catalog's `Rookery` an
oddity; on the wider base it is the unlicensed shadow of an ordinary state institution.** The
licensing rule that follows is stated at G(h): where a state runs relays, an unlicensed relay is
worth protecting; where none does, it has no network to be faster than.

### §15.7 · The attested criminal guild is Ottoman, and the fabricated one is European

Family F's correction, restated in one line because it is the section's fourth verdict change:
the European "thieves' guild" is a nineteenth-century literary construction (the Garduña,
CONFIRMED-digest 2026-08-23) built by analogy on Cervantes' fiction, while the attested cases are
Ottoman Cairo's guild under a sheikh (CONFIRMED, en.wikipedia.org/wiki/Thieves%27_guild, fetched
2026-08-23, on Lane's 1830s observation) and the Straits Chinese lodges with their meeting-houses
(CONFIRMED, JSBRAS vol. 3, fetched 2026-08-23). **A European-base world should draw no guild
hall; a tolerated-crime world of any culture may.**

### §15.8 · What this section does NOT license

Stated affirmatively, per the anti-scope discipline. It does not license: a named form in the
parti catalog (`FONDACO`, `HAN`, `HUIGUAN` and `NINJA_HOUSE` are all refused as ids — the
proposed ids are `COURT_LODGE`, `ENCLOSED_EXCHANGE`, `TWO_PLAN_FRONT` and `HIDE_CELL`, which name
the mechanism); a culture-keyed weight table (the licensing axes proposed throughout are
tolerance, jurisdiction, enclosure rights, hours, and the presence or absence of a licit
counterpart — none of them is a culture name); a theological or ethnic attribute anywhere; or any
prevalence prior. The Beijing hall's forty rooms and the Beddington dovecote's 1,360 nest boxes
are BOUNDS on what a building of that kind can be, not statements about how often one occurs.

---

## §Σ · THE NINE-LAW MAP, THE ENGINE TABLES, THE 28-ENTRY VERDICT TABLE, AND THE UC SEAM TABLE

Four instruments, in the order DW-0 will want them: what this tranche says about each of the
charter's nine founding laws; what the LIVE engine actually does with these 28 rows, measured by
simulation and by reading the landed code; the per-entry verdict; and the seam table that binds
each entry to the undercity component already derived beneath it.

---

### §Σ.1 · FINDING → DW-LAW MAP, over all NINE founding laws

**Law 1 — FUNCTIONS, NOT ROOMS.** This tranche is the strongest evidence for law 1 in the whole
program, because nearly every criminal function occupies a room built for something else. The
hide is a book cupboard's three walls; the holding cell is a victualler's strong-room; the fence's
alteration bench is a smith's hearth; the guild's meeting cell is a hired room; the trading floor
is a converted tavern. **The law's own corollary, supplied here: a function may be satisfied by a
cell it did not cause.** That is the OCCUPATION relation R-INST-5 asked for (its finding 1),
reached from three more directions (family B's outbuilding, family C's `OCCUPIED_VOID`, family
H's repurposed strong-room). *Recommendation:* the requirement roster's satisfaction step must
accept an existing cell as a match, and record which function CAUSED the cell and which merely
occupies it — because the two behave differently under law 3's shedding.

**Law 2 — THE THREE-CLAMP CEILING.** The tranche adds a FOURTH clamp candidate and argues it is
not really a fourth: **TOLERANCE.** Family F's ladder — hunted encampment → one hired room →
built hall — is a ceiling that has nothing to do with the institution's own ceiling, the parcel,
or the settlement's economy. A dominant syndicate in a rich metropolis that is hunted builds
nothing. *Recommendation:* express tolerance as an input to clamp (a) rather than as a new clamp,
i.e. `institutionCeiling(inst, settlement)` reads a derived `toleranceOf(practice)`. The inputs
already exist (corruption, the watch, the power structure, the syndicate standing).

**Law 3 — THE FLOOR IS EXISTENCE.** Every family in this tranche has a floor of ZERO CELLS, and
the tranche's contribution is that **a zero-cell floor is a legitimate, expressible state, not a
generation failure.** Eleven of the 28 rows are NO_BUILDING at every tier they exist at (see
§Σ.4). The engine cannot currently say this — an institution always resolves to a template and
draws a box — and that is the tranche's engine gap E1. *Recommendation:* `NO_BUILDING` becomes a
first-class verdict on the requirement roster, and the interior model returns a typed absence
with a reason, which the projection can render as "this institution has no premises: it works out
of X".

**Law 4 — DERIVE, DON'T STORE.** No conflict, and one strong corroboration: every criminal fact
this tranche wants is derivable from facts the engine already holds — the criminal share
(`corruption.js:539-542`), the syndicate standing (`colonization.js`'s `syndicateStandingOf`), the
wall (`defenseProfileHasWalls`), the water route (`tradeRouteAccess`), the licit roster (the
complement law, §10.2 i). **Not one of this dossier's proposed dials needs a stored byte.** The
closed enums proposed per family (`receiverGrade`, `shelterGrade`, `contrabandGrade`, `gangGrade`,
`frontGrade`, `syndicateGrade`, `illicitMarketGrade`, `brokerageGrade`, `coercionGrade`) are all
DERIVATIONS over existing facts, and each family's (f) says which facts.

**Law 5 — STABLE ANCHORS.** The tranche's contribution is the FOSSIL vocabulary, and it already
matches the undercity's. A criminal building's characteristic decline products are: the bricked
cellar breach, the blocked gate of an abandoned lodge, the panelled-over hide (Harvington's
swinging-beam hide was "rediscovered in 1894" after three centuries — a fossil that stayed a
fossil), the sealed tunnel mouth with its hinges still in the arch. **These are exactly UC-4's
`FOSSIL_KINDS = ['abandoned','sealed','flooded']`**, and DW's above-ground fossils should reuse
that vocabulary rather than mint a parallel one. *Recommendation:* one fossil vocabulary,
imported from `colonization.js`, for both strata.

**Law 6 — FRONTAGE FROM THE PARCEL.** The tranche INVERTS law 6 twice and both inversions are
already known to the program. (i) **The single controlled entrance** — §15.2's four-culture
convergence plus R-INST-5's five instances; when a parti declares `entrances: 1`, the COURT is the
frontage surface for every cell but the gate. (ii) **The second frontage of unequal status** —
family E's `SIDE_DOOR` variant needs the parcel to have a subordinate frontage (a court, a back
lane), and the whole two-plan building depends on it. *Recommendation:* law 6's frontage reader
returns an ORDERED list of frontages with a status grade, not a single primary; corner-lot
handling already contemplates picking a primary from the street hierarchy, so this is a small
extension of an existing idea.

**Law 7 — BASEMENTS ARE THE UNDERCITY'S PROJECTION.** This is the tranche's own law and §Σ.5 is
its instrument. The one finding that changes how law 7 should be implemented: **the criminal
shelf almost never seeds the underground itself** — 3 of 28 rows seed, all three the same
`Underground network` row (§Σ.3) — so a criminal building's basement is nearly always the
projection of a seed some LICIT institution planted. A front over a merchant's undercroft is the
normal case; a criminal institution with its own excavation is the rare one. *Recommendation:*
law 7's per-building query must resolve through the anchor key of whatever institution SEEDED the
component, not through the criminal row that occupies it — which is exactly what
`colonization.js`'s `frontFor(seed)` already does, and §Σ.5 shows the join is one-to-one.

**Law 8 — THE PARTI DRAW.** Two contributions. (i) **A parti may WRAP another parti**
(`TWO_PLAN_FRONT`), which the §5 contract cannot express. (ii) **The compression law** (§1.6 and
F(a.3)): an ideal ordered function sequence poured into a host's available cells, with surplus
stations collapsing — a primary source describes exactly this ("gates at each point of the
compass ... though practically only one gate was represented"). *Recommendation:* a
`PartiModifier` record, and a `compressible: true` flag on an ordered function sequence.

**Law 9 — VERTICAL HONESTY.** The tranche's best gift to law 9 is the DETECTION argument (§1.1):
priest hunters "measured the height of ceilings and the length of walls in the hope of detecting
hidden chambers", which means a hide MUST be subtracted from a declared volume and never added.
The live `interiorModel.js` already does this by nesting the concealed room inside its host at
half the host's dimensions. *Recommendation:* generalise it into law 9's own arithmetic — every
concealed cell debits its host's area, and S9's validator checks the sum. A second, smaller item:
family B's bastle and family F's lodge both have circulation edges whose state CHANGES (a ladder
pulled up, a gate barred), so vertical honesty must survive a state change — the floor count
reconciles either way.

---

### §Σ.2 · THE ENGINE-GAP FLAGS — sixteen, ordered by how many families ask

| # | gap | asked by | severity |
|---|---|---|---|
| **E1** | **`NO_BUILDING` is not an expressible verdict** — every institution resolves to a template and draws a box | A, B, C, D, F, G, H (7 of 9) | **highest** |
| **E2** | **A building has exactly ONE entrance** (`interiorModel.js` derives one `entranceSide` and rotates to it); the second, subordinate entrance is inexpressible | A, C, E, G (4) | **highest** |
| **E3** | **No GATEKEEPER room kind.** The porter's lodge, the gate, the watched court mouth | D, E, F, G (4) | high |
| **E4** | **No ROOM SUBDIVISION construct** — pledge boxes, bed rows, trading tables are repeated units inside a cell | A, D, G (3) | high |
| **E5** | **A parti cannot WRAP another parti** (`TWO_PLAN_FRONT`) | E (and C's hosted rungs) | high |
| **E6** | **No below-grade circulation classes** — `TUNNEL_STOOP`, `TUNNEL_BORE`, `PARTY_BREACH`; §452's set is entirely intra-building and above ground | C, E | high |
| **E7** | **No INTER-BUILDING circulation edge.** The cellar-to-cellar breach crosses a party wall. *Cure: read it from UC-5's graph rather than adding it to DW* | C | high |
| **E8** | **No SIGHT-LINE prohibition.** "The store must not be visible from the counter" is neither a door rule nor an adjacency rule | A, E | medium |
| **E9** | **No NEGATIVE structural bucket.** "No hearth", "no window", "unlit" are licensing facts here and every bucket is affirmative | B, H | medium |
| **E10** | **No SIGNAGE attribute.** The rendezvous house's flag versus the crimp house's absence of one is the only exterior difference between a lawful and an unlawful building in the whole tranche | H, and generally | medium |
| **E11** | **No UNROOFED cell.** The court is the organising element of four proposed partis | F, G, and §15 | medium |
| **E12** | **No `hours` licensing attribute.** A market that exists six afternoons a week needs no building; time is its security | G | medium |
| **E13** | **No ROOF-LEVEL WORKING cell and no ROOF JOINT.** The message loft is a working cell above the top storey and the birds enter through an aperture in the sky; the joint vocabulary's five members are all ground-or-below | G | medium |
| **E14** | **No ENVELOPE-AS-FURNISHING cell.** The dovecote's interior IS its wall; the arsenal's racks and the library's shelves are the same construct | G | low |
| **E15** | **No LIFE-SUPPORT requirement for a below-grade residence.** `Underground city` is the only row in six tranches whose residents need air, water and waste | C | low |
| **E16** | **No WATER-LANDING joint.** `sluice` is a drain; a settlement's water access for people and goods has no typed joint | C, H, and R-INST-2's ports | low |

Two further items that are DEFECTS rather than gaps, recorded for the content/catalog train:

- **D6-1** `Smuggling network` at village L865 carries `minTier: 'city'` while authored in the
  village block — the same shape as R-INST-5's §488.2 defect G2, now observed on a second shelf,
  which promotes it from a magic-shelf quirk to a catalog-wide audit item.
- **D6-2** the catalog's `Rookery` is a bird loft, not a slum (§0.2) — not a defect in the
  catalog, a defect in the READING of it, and corrected here before it propagates.

---

### §Σ.3 · WHAT THE LIVE ENGINE ACTUALLY DRAWS FOR THESE 28 ROWS (simulation, executed)

Two simulations were run this session over the roster's names, using tables copied verbatim from
the live code. Both are **PLAUSIBLE-by-simulation**: the tables are the engine's, the runner is
not. Scripts: `RINST6-facetsim.mjs` and `RINST6-seedsim.mjs`.

**Provenance of the tables.** `institutionNature` and `institutionFunction` from
`src/domain/spatial/cohesionWeave.js` on the branch of record `review-fixes-2026-07-08`;
`institutionSubstructure` from the same file at `refs/preserve/holding-uc2` (the UC-0 addition);
the templates from `src/domain/interior/interiorTemplates.js` on the branch of record; the seed
logic from `src/domain/undercity/strataExistence.js` at `refs/preserve/holding-uc2`. The text the
regexes see is `name + ' ' + type + ' ' + category`, and `assembleInstitutions.js` pushes
`{ category, name, ...inst }` where `category` is the SHELF name, so every row's text ends in the
word `Criminal` and no row carries a `type`.

**Result 1 — the interior template each row receives today.**

| tier | row | nature inferred | interior kind | resolved room set |
|---|---|---|---|---|
| thorp | Local fence | (none) | generic | main |
| thorp | Outlaw shelter | (none) | generic | main |
| hamlet | Fence (word of mouth) | (none) | generic | main |
| hamlet | Bandit affiliate | (none) | generic | main |
| hamlet | Smuggling waypoint | **vice** | vice | common + kitchen + cellar |
| village | Fence (word of mouth) | (none) | generic | main + back |
| village | Smuggling network | **vice** | vice | common + kitchen + cellar |
| village | Underground network | (none) | generic | main + back |
| town | Street gang | (none) | generic | main + back |
| town | Smuggling operation | **vice** | vice | common + kitchen + cellar + lodging |
| town | Front businesses | (none) | generic | main + back |
| town | Underground network | (none) | generic | main + back |
| town | Rookery | (none) | generic | main + back |
| city | Thieves' guild chapter | **trade** | trade | hall + counting + strongroom |
| city | Multiple criminal factions | (none) | generic | main + back |
| city | Black market | **trade** | trade | hall + counting + strongroom |
| city | Underground network | (none) | generic | main + back |
| city | Contract killer | (none) | generic | main + back |
| city | Front businesses | (none) | generic | main + back |
| city | Kidnapping ring | (none) | generic | main + back |
| city | Human trafficking network | (none) | generic | main + back |
| city | Smuggling network | **vice** | vice | common + kitchen + cellar + lodging |
| city | Rookery | (none) | generic | main + back |
| city | Whisper market | **trade** | trade | hall + counting + strongroom |
| metropolis | Thieves' guild (powerful) | **trade** | trade | hall + counting + strongroom |
| metropolis | Black market bazaar | **trade** | trade | hall + counting + strongroom |
| metropolis | Underground city | (none) | generic | main + back |
| metropolis | Assassins' guild | **trade** | trade | hall + counting + strongroom |

**Number audit, performed:** 17 generic + 6 trade + 4 vice + 1 (`Smuggling waypoint`, vice at
hamlet) = 28. Recount by kind: generic 17, trade 6, vice 5. 17 + 6 + 5 = 28. Closes.

**Three readings of that table, in order of importance.**

1. **There is no `criminal` INTERIOR_KIND.** `INTERIOR_KINDS` has eight members — faith,
   security, trade, craft, learning, vice, civic, generic — and the Criminal shelf is not one of
   them. Seventeen of 28 rows therefore fall to the kind-default and receive `main` + `back`, a
   two-cell box (and at thorp and hamlet tiers only `main`, because `back` carries
   `minTierIndex: 2`).
2. **Six rows receive the LEGITIMATE TRADE interior**, because the `trade` regex
   `/market|guild|exchange|bank|counting|merchant|bazaar/i` matches the substrings `guild`,
   `market` and `bazaar` and is tested BEFORE `vice`. An assassins' guild and a black-market
   bazaar both render as a merchant's counting house with a strongroom. This is the same DEFECT
   CLASS as R-INST-5's §488.2 finding 5 / G1 (unanchored substrings in `FACET_INFERENCE`),
   extended: G1 named three mis-inferences on the Magic and Entertainment shelves; this tranche
   adds six on the Criminal shelf, all from `guild|market|bazaar`, plus five from `smuggl`.
3. **`Front businesses` — the one row in the catalog whose subject is the two-plan building —
   renders the default box.** It is right by accident (a front IS a main room and a back room)
   and carries none of family E's content.

**The proposed cure, costed.** The `category` string is already in the inference text, so a
single anchored row added to `institutionNature` — a `criminal` value matching `/\bcriminal\b/i`
— would capture all 28 rows by their SHELF rather than by their names, with no name list and no
new reader. It would need a `criminal` template in `TEMPLATES` (this dossier's families supply
its room set: a public front cell, a back cell, a store, and a concealed cell licensed by grade)
and it would be a GOLDEN-SHIFTING change wherever the facet is read on the generation path, so it
is a declared-shift act and NOT a housekeeping one. **Recorded as a recommendation for DW-0 with
its bill named, not as a fix.** Note also the ORDERING hazard: adding `criminal` after `trade` in
the table changes nothing (first match wins on `guild`), so the row would have to be placed
BEFORE `trade`, which is itself a same-seed shift for any row whose name contains both.

**Result 2 — which rows SEED the underground sheet.** Executed over `seedClassesOf`'s own logic:

| seeding rows | 3 of 28 |
|---|---|
| `Underground network` (village L880, town L1440, city L1959) | `seedClasses = ['subterranean']`, via the DECLARED `facets: { subterranean }` |
| every other row | `seedClasses = []` |

**Two consequences, and the second is a finding.**

- **The criminal shelf is almost entirely a TENANT of the underground, not its landlord.** A
  criminal building's basement is the projection of a seed planted by a licit institution — a
  warehouse, a granary, a church, a mine — which is exactly how `colonization.js`'s
  `frontFor(seed)` is built.
- **`Underground city` (metropolis L2383) and `Black market bazaar` (metropolis L2375) seed
  NOTHING, and both are explicitly subterranean in their own text** ("extensive tunnels and
  catacombs repurposed as criminal and refugee sanctuary"; "permanent underground market"), and
  both carry `tags: ['criminal','underground']`. They carry no `facets` block and their names
  match no `institutionSubstructure` pattern. **So the two rows that most obviously ARE the
  undercity do not license the underground sheet.** This is not a bug in UC-0 — UC-0 reads the
  chokepoint correctly and refuses name matching by design — it is a CATALOG DATA gap: the two
  rows want `facets: { subterranean: 'subterranean' }` exactly as the three `Underground network`
  rows have. **Recorded as recommendation R-INST-6-1**, with the bill named: adding a `facets`
  key to a catalog row is a generation-path byte change and therefore golden-shifting (the D6
  note on the existing rows says so: "Golden-shifting (G2)"), so it is a declared-shift act for
  the catalog train, not a housekeeping edit. It would also arm the catalog's own
  `forbiddenResources` inheritance — `buildCatalogForbiddance()` unions forbiddances BY FACET
  KIND, so a row declaring `subterranean` inherits "tunnels flood" even without its own list,
  which is the correct behaviour for an underground city and is currently absent.

---

### §Σ.4 · THE 28-ENTRY VERDICT TABLE

`B` = BUILDING (own parti) · `H` = HOSTED (host named) · `N` = NO_BUILDING (function on ground or
as a flag on a host). "Cells added" is what the row contributes to a plan when it fires.

| # | tier | row | fam | verdict | host, where HOSTED | cells added |
|---|---|---|---|---|---|---|
| 1 | thorp | Local fence | A | **N** | a dwelling; the communal root cellar | a chest or covered pit (fixture) |
| 2 | thorp | Outlaw shelter | B | **N** | a detached outbuilding or the communal root cellar | a pallet (fixture); an EXTERIOR_WALK route |
| 3 | hamlet | Fence (word of mouth) | A | **N** | a threshold: a farm gate, the wayside inn | none |
| 4 | hamlet | Bandit affiliate | B | **N** | an affiliated household's farmstead | a road-side handover threshold |
| 5 | hamlet | Smuggling waypoint | C | **N** | a yard, a barn, the wayside inn | a store; a yard |
| 6 | village | Fence (word of mouth) | A | **H** | pawnbroker / old-clothes shop / chandler / lodging-house | counter, store, alteration bench |
| 7 | village | Smuggling network | C | **H** | the commodity's own trade building | cellar store, concealed cupboard |
| 8 | village | Underground network | C | **H** | the seeded institutions above it | the below-grade run (UC's, projected) |
| 9 | town | Street gang | D | **N** | a public house; a lodging-house; a block of the shadows district | none (marks hosts) |
| 10 | town | Smuggling operation | C | **H** | a trade building; an inn | cellar store, hearth cupboard |
| 11 | town | Front businesses | E | **H** | warehouse / tavern / shop | trade entrance, trade store, junction |
| 12 | town | Underground network | C | **H** | as row 8 | as row 8 |
| 13 | town | Rookery | G | **H** | a building the organisation already holds (a family E front) | loft, bird entrance, handling bench |
| 14 | city | Thieves' guild chapter | F | **H** | a trade building, per the engine's seed proximity | meeting cell, counting cell, regalia store |
| 15 | city | Multiple criminal factions | D | **N** | two or more DISJOINT hosts in different districts | none (marks hosts) |
| 16 | city | Black market | G | **H** | a yard or a converted tavern; hidden HOURS, not hidden place | trade hall, entrance control, bar |
| 17 | city | Underground network | C | **H** | as row 8 | as row 8 |
| 18 | city | Contract killer | H | **N** | none; operates through other rows as intermediaries | none |
| 19 | city | Front businesses | E | **H, PLURAL** | warehouses, taverns, shops | as row 11, on several buildings |
| 20 | city | Kidnapping ring | H | **N** | a public house with rear or water egress | an unlit degree-one cell; a document cell at CHAIN |
| 21 | city | Human trafficking network | H | **N** | as row 20 | as row 20 |
| 22 | city | Smuggling network | C | **H + B** | a trade building; and a warehouse of its own at the top rung | cellar chain; warehouse |
| 23 | city | Rookery | G | **H** | as row 13 | as row 13 |
| 24 | city | Whisper market | G | **H** | its own text: "among the fences, the late houses, and the inns that ask nothing" | transcription cell, record store, a dais or lectern |
| 25 | metropolis | Thieves' guild (powerful) | F | **B** | — | `COURT_LODGE`: gatehouse, court, galleries, hall, council rooms, wing rooms |
| 26 | metropolis | Black market bazaar | G | **B** | — | `ENCLOSED_EXCHANGE`: one private entrance, top-lit hall of paired table lines, bar, store |
| 27 | metropolis | Underground city | C | **B (occupied, not built)** | — | `OCCUPIED_VOID`: galleries, dwelling cells, and the only `lifeSupport` requirement in the corpus |
| 28 | metropolis | Assassins' guild | F | **N** | none, on the row's own testimony ("operates through cutouts, never acknowledged officially") | none |

**Number audit, performed.** BUILDING 3 (rows 25, 26, 27) · BUILDING-and-HOSTED 1 (row 22) ·
HOSTED 13 (rows 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 23, 24) · NO_BUILDING 11 (rows 1, 2, 3,
4, 5, 9, 15, 18, 20, 21, 28). **3 + 1 + 13 + 11 = 28. Closes.**
Read plainly: **only THREE of twenty-eight rows on the Criminal shelf get a building of their own
and nothing else, and all three are metropolis rows; a fourth (row 22, the city smuggling
network) acquires one at its top rung on top of its hosted cells.** Eleven rows get no cell
anywhere. That ratio is the tranche's single most consequential number for DW-0's planning, and
it is why engine gap E1 (`NO_BUILDING` as a first-class verdict) is ranked highest.

---

### §Σ.5 · THE UC SEAM TABLE — what the undercity already derives beneath each entry, the joint kind, and what DW must add above

The charter's law 7 says a below-grade room, hatch or passage exists in a floor plan IFF the
undercity graph anchors it at that building. This table is that IFF, entry by entry, against the
components the landed and holding leaves actually produce. **Engine provenance, stated once:**
UC-0 `strataExistence.js`, UC-1 `sewerDerivation.js`, UC-3 `staticComponents.js` and UC-4
`colonization.js` are LANDED at `f1e4d515` on `claude/composite-r4` (ODQ §490.1); UC-2
`monotoneComponents.js` is BUILT AND HOLDING at `refs/preserve/holding-uc2` = `694965577` and is
in the landing seat (ODQ §490.2); **UC-5 `connectivity.js` DOES NOT EXIST at any ref** (verified
by `git log --all --diff-filter=A`, zero adds), so every row below that would consume an EDGE is
marked accordingly.

The joint vocabulary is closed and has five members —
`grate | stair | sealed_door | sluice | breach` (`jointVocabulary.js`) — and the anchors used
below are the ones the leaves themselves write.

| # | roster row | UC component beneath it today | its licence, verbatim from the code | joint kind + anchor | what DW must add ABOVE |
|---|---|---|---|---|---|
| 1 | Local fence (thorp) | none | — | — | a fixture-grade store; NO below-grade cell unless the settlement's own `Communal root cellar` seeded one |
| 2 | Outlaw shelter (thorp) | none | — | — | as row 1; the shelter uses the licit cellar |
| 3 | Fence (hamlet) | none | — | — | nothing below grade |
| 4 | Bandit affiliate (hamlet) | none | — | — | nothing below grade |
| 5 | Smuggling waypoint (hamlet) | none (no tier-appropriate component) | — | — | a barn store; the row is above ground entirely |
| 6 | Fence (village) | `undercroft` where the HOST is a storing commerce | `STORING_COMMERCE`, extent `QUARTER_TRADE_VOLUME` | `stair` at "cellar door" | the external cellar stair and the store's interior; the fence does not cause the cellar, it occupies the host's |
| 7 | Smuggling network (village) | `smuggler_cellar` **if** gate-or-waterfront and `criminalShare >= 0.45` | `CRIMINAL_SHARE_AT_GATE_OR_WATERFRONT`, extent `CONTRABAND_SHARE`, zone `criminal` | `stair` at "cellar door"; plus `sluice` at "waterfront sluice" when waterside | the surface cell over it, the external stair, and the concealed cupboard variant |
| 8 | Underground network (village) | the SEED itself (`seedClasses: ['subterranean']`) — the one criminal row that licenses the sheet | declared facet `subterranean`; refused on `marshlands` / `fertile_floodplain` | its components' joints | nothing above ground: **the row IS the underside**, and DW must draw its SURFACE JOINTS only |
| 9 | Street gang (town) | none | — | — | nothing; the row marks hosts |
| 10 | Smuggling operation (town) | `smuggler_cellar` as row 7 | as row 7 | as row 7 | as row 7, plus the party-wall breach at terrace density (**an EDGE — UC-5, unbuilt**) |
| 11 | Front businesses (town) | whatever the HOST seeded: `undercroft`, `crypt`, or nothing | the host's licence, not the front's | `stair` at "cellar door" (undercroft) or "church stair" (crypt) | **the whole two-plan interior**: trade entrance, junction, trade store — and the junction is the SAME `stair` joint the undercity already writes. **This is the tranche's cleanest one-to-one seam.** |
| 12 | Underground network (town) | as row 8 | as row 8 | as row 8 | as row 8 |
| 13 | Rookery (town) | none | — | **a ROOF joint, which the vocabulary does not have** (gap E13) | the loft, the bird entrance, the handling bench — all ABOVE the top storey, which is the opposite end of the building from the undercity |
| 14 | Thieves' guild chapter (city) | `undercroft` or `smuggler_cellar` of the trade front it sits behind (the engine's `SEED_PROXIMITY` puts `cellar` first, at 0) | the host's | `stair` at "cellar door" | the meeting cell and the regalia store above; the cellar is the host's and the guild occupies it |
| 15 | Multiple criminal factions (city) | none | — | — | nothing |
| 16 | Black market (city) | `undercroft` of the converted tavern that hosts it | `STORING_COMMERCE` | `stair` at "cellar door" | the trade hall above; the cellar is the host's store |
| 17 | Underground network (city) | as row 8 | as row 8 | as row 8 | as row 8 |
| 18 | Contract killer (city) | none | — | — | nothing |
| 19 | Front businesses (city) | as row 11, on SEVERAL buildings | as row 11 | as row 11 | as row 11, plural |
| 20 | Kidnapping ring (city) | none of its own; the HOST's `undercroft` if any | the host's | `stair` at "cellar door" | the unlit degree-one cell (which is UPSTAIRS or in the strong-room, NOT below grade — the record puts the holding cell in the garret or the strong-room, not the cellar) |
| 21 | Human trafficking network (city) | as row 20 | as row 20 | as row 20; and the removal route wants a **WATER LANDING joint that does not exist** (gap E16) | as row 20 |
| 22 | Smuggling network (city) | `smuggler_cellar` + the host's `undercroft`s; and, where `hasWall`, UC-4's `smugglers_tunnel` | cellar: `CRIMINAL_SHARE_AT_GATE_OR_WATERFRONT` at `>= 0.45`; tunnel: `WALL_OR_TOLL_AND_CRIMINAL_SHARE` at `>= 0.35` (**toll half INERT**, D-UC0-2) | cellar `stair`/"cellar door"; tunnel `stair` at "gate" inland or `sluice` at "waterfront" on water | the cellar chain above; the tunnel MOUTH as a gated threshold (hinges in an arch); **the breach between cellars is an EDGE — UC-5, unbuilt** |
| 23 | Rookery (city) | none | — | roof joint (gap E13) | as row 13 |
| 24 | Whisper market (city) | the host's `undercroft` | the host's | `stair` at "cellar door" | the transcription cell — and it wants the BEST LIGHT, so it is the one cell in the tranche that pulls AWAY from the undercity seam |
| 25 | Thieves' guild (powerful) (metropolis) | its host's, plus whatever UC-4 colonizes under it | UC-4 `colonized_seed`, `front: { kind: 'INSTITUTION', anchor, name }` — **the UNIVERSAL FRONT names this institution by canonical key** | the seed's own joints | the `COURT_LODGE` above; and the court's own below-grade access is a `stair` from the court, not from a room |
| 26 | Black market bazaar (metropolis) | **NOTHING — the row seeds no class** (§Σ.3, result 2) though its text says "permanent underground market" | — | — | the enclosed exchange above; and R-INST-6-1 recommends the row declare `subterranean` so the sheet it describes actually exists |
| 27 | Underground city (metropolis) | **NOTHING — the row seeds no class** though it IS the undercity in its own text | — | — | R-INST-6-1 again, and more urgently: this row's entire content is below grade and it licenses none of it |
| 28 | Assassins' guild (metropolis) | none | — | — | nothing |

**Six readings of the seam table, for DW-0.**

1. **The dominant joint is one kind at one anchor.** `stair` at "cellar door" appears in eleven
   rows. DW's front interior and UC-2's `undercroft` / `smuggler_cellar` meet at exactly that
   joint and it already exists in code. **The seam is one line, not a subsystem.**
2. **The UNIVERSAL FRONT is already implemented and DW should consume it, not re-derive it.**
   `colonization.js`'s `frontFor(seed)` returns `{ kind: 'INSTITUTION', anchor, name }` where the
   seed has an anchor and `{ kind: 'ANONYMOUS_FABRIC', anchor: null, name: null }` otherwise, and
   the file's own header states the law: "every colonized piece names its surface cover ... No
   institution is ever minted here, so nothing clickable is invented." **DW law 7's per-building
   query is a lookup on that anchor key**, and §16's carry-note 1 (graph rows stay per-building
   addressable by canonical institution key) is therefore already satisfied.
3. **The smugglers' tunnel has NO front.** `smugglersTunnel()` returns
   `front: { kind: 'ANONYMOUS_FABRIC', anchor: null, name: null }` unconditionally, because a
   bypass under a wall is under nobody's building. **So the one component with the most vivid
   surface story projects into no floor plan at all**, and its two joints (a `stair` at a gate, a
   `sluice` at a waterfront) are FABRIC joints rather than building joints. DW should not try to
   draw it; the map's D5 strata wave should.
4. **UC-5 is unbuilt and three seam rows depend on it.** The party-wall breach (rows 10 and 22)
   and every statement about what connects to what are edges. Until UC-5 lands, DW can draw
   COMPONENTS under buildings but cannot draw ROUTES between them, and the honest thing is to say
   so in the projection rather than to imply connectivity.
5. **Two rows point AWAY from the seam.** The `Rookery`'s loft is above the top storey and its
   bird entrance is a joint in the roof (gap E13); the `Whisper market`'s transcription cell wants
   the best window. A tranche about the undercity ends with two of its own rows in the attic,
   which is a useful corrective against assuming criminal means subterranean.
6. **The tuning-band note.** `smugglerShareFloor` (0.45, UC-2) and `smugglerCriminalFloor` (0.35,
   UC-4) differ, so a settlement in the 0.35-0.45 band gets a tunnel with no smuggler cellar
   (ledger item L.5). Both are PROVISIONAL until the §362.4 tuning signature and both are
   registered tuning-pass inputs; **this dossier recommends no change and flags the composition
   for the tuning pass**, where the DW soak leg (§456) will be able to observe it directly.

---

## §L · THE OPEN-QUESTIONS LEDGER — 45 numbered items, built by script over this dossier's own marker sentences

**Construction, so the count can be audited.** `RINST6-merge/ledger-extract.py` walks `sec-1`,
`sec-A`…`sec-I`, `sec-15` and `sec-sigma`, splits them into sentence-scale chunks, and tags every
chunk carrying one of nine markers — NOT FOUND · PARTIAL · a `ledger item L.n` reference ·
a blocked-source token (GATED / 403 / ENOTFOUND / TLS / cert) · "number audit" ·
contested / conflict / discrepancy · a DERIVED-and-flagged bucket statement · SUSPECT ·
unresolved / work order — into `RINST6-merge/ledger-extract.txt`. **The extract holds 82 marker
sentences.** The buckets below are composed over that extract and over the call log
`RINST6-calls.tsv`, not from memory, which is what makes the ledger complete by construction
rather than by recollection. **The seventeen inline `L.n` pointers planted in the sections map to
items 1-17 below**, and a grep confirms all seventeen are present and none is orphaned:
L.1 (sec-A x2) · L.2 (sec-A) · L.3 (sec-B x2) · L.4 (sec-C) · L.5 (sec-C, sec-sigma) ·
L.6 (sec-D x2) · L.7 (sec-G x2) · L.8 (sec-D, sec-15) · L.9 (sec-H) · L.10 (sec-E) ·
L.11 (sec-F) · L.12 (sec-F) · L.13 (sec-G) · L.14 (sec-H) · L.15 (sec-15) · L.16 (sec-15) ·
L.17 (sec-15).

### §L.1 · Grammar-load-bearing figures that stayed OPEN (items 1-10, the inline pointers)

1. **"Ten square yards" is ambiguous and the ambiguity is load-bearing** (family A, inline L.1).
   The pre-1843 headquarters of the London old-clothes trade was "confined to a space not more
   than ten square yards, adjoining Cutler-street". Ten square yards is 8.4 square metres; ten
   yards square is 83.6. The two readings differ by a factor of eight and the figure is the only
   dimension the source gives for the unenclosed rung of family G's ladder. Reported as written.
   Target: Mayhew's own text at the passage.
2. **The Old Bailey Proceedings were never opened** (family A, inline L.2). The single richest
   untapped source for the fence, the flash house and the receiver's premises. The search for
   trial texts describing a back room, a shop cellar or hidden evidence returned only the
   database's front matter. Bland's article cites six flash-house references in the Proceedings
   and one in the Ordinary of Newgate's Account; none was read. **P1c work order.**
3. **No bastle plan dimension** (family B, inline L.3). Wall thickness (about 1 m) and the single
   gable doorway are confirmed; plan length, width, storey heights and door width are not. The
   RCHME survey of the Chesterwood bastles is cited by a gazetteer as holding measured dimensions
   and was not reached. The bastle is the corpus's best candidate for a measured DEFENSIBLE
   FARMSTEAD. **P1c work order.**
4. **The Deal Middle Street conservation-area appraisal was not obtained** (family C, inline L.4).
   It exists as a Kent Planning Department publication, "Deal: Middle Street Conservation Area: An
   architectural appraisal", and it is the one document likely to hold measured cellar-to-cellar
   evidence for the tranche's most important circulation finding. **P1c work order, highest value
   for family C.**
5. **The two engine smuggler floors differ and the composition is odd** (family C and §Σ.5, inline
   L.5). `monotoneComponents.js` licenses the smuggler CELLAR at `criminalShare >= 0.45`;
   `colonization.js` licenses the smugglers' TUNNEL at `>= 0.35`. A settlement in the band gets a
   bypass with no store. Both figures are measured, deliberate and PROVISIONAL until the §362.4
   signature. **No change recommended; flagged for the tuning pass and for the DW soak leg.**
6. **No measured rookery COURT WIDTH** (family D, inline L.6). The single figure family D most
   needs. Beames gives room sizes, occupancies and air volumes and no court dimension. Targets:
   Booth's maps and notebooks, the 1891 Boundary Street clearance surveys, the LCC's own plans.
   **P1c work order.**
7. **No measured MESSAGE loft** (family G, inline L.7; the reason family G is PARTIAL). Everything
   measured in §8.2 is a dovecote for table birds. A homing loft's traps, perches, handling bench
   and dispatch record are typed from function alone. Targets: the 1870-71 Paris service's
   operational records; published military signal-loft standards of 1914-1918; Mamluk and Ottoman
   *burj al-hamam* studies. **P1c work order.**
8. **Sauval's Cour des Miracles figures are contested** (families D and 15, inline L.8). "No more
   than fifty square yards ... lodged fifty women" corroborates the density floor from two
   centuries earlier, and the source is judged unreliable in part. The UQAM thesis "Les cours des
   miracles de Paris (1667-1791)" was found and not opened. Used only as an order of magnitude.
9. **No dimension for any holding cell** (family H, inline L.9; the reason family H is PARTIAL).
   "A tiny cell" is the record's only size word. The bucket used (2-9 square metres, 1.5-2.1 m
   headroom) is DERIVED from the priest hides and Beames's rooms, i.e. from other families'
   measurements, and says so at the figure.
10. **No plan of *Ons' Lieve Heer op Solder*** (family E, inline L.10). The building is a museum,
    exhaustively surveyed and published, and it is the type specimen of the two-plan front — and
    this lane obtained its dates, its room sequence and its visitor numbers and not one dimension.
    **The highest-value single target in the tranche.**
11. **The genre-history of the thieves' guild rests on a GATED source** (family F, inline L.11).
    The long-form Roguish article "What's a Thieves' Guild and where did it come from?" returned
    403. The Garduña's fabrication is CONFIRMED-digest only, and the descent of the convention
    from Cervantes is stated on the strength of one opened encyclopedia article.
12. **Lane on the Cairo thieves' guild was not opened** (family F, inline L.12). *An Account of
    the Manners and Customs of the Modern Egyptians* (written 1833-1835) is the primary for the
    one ATTESTED thieves' guild in the whole dossier, and it exists in free full text at Project
    Gutenberg and the Internet Archive. Both were located; neither was fetched. **The highest-value
    unopened text in family F, and a cheap one.**
13. **`Black market bazaar`'s "permanent underground market" is unsupported** (family G, inline
    L.13). No European subterranean commercial hall was found. Both readings carried: the row as
    written, and the row as the record supports it (a permanent enclosed exchange in the shadows
    quarter, possibly over undercity storage).
14. **The `Kidnapping ring` row's description and its `exclusionConditions` disagree** (family H,
    inline L.14). The text says it "exploits the legal market's infrastructure where one exists";
    the condition prevents it from firing where the legal market exists, so half the description
    is unreachable. For the content train, not for DW.
15. **The Japanese concealed-mechanism house has no measured content** (§15, inline L.15). Museum
    and tourism sources only; the house was relocated in or after 1964 and device provenance is
    not established by anything read. It corroborates the four European constructs and contributes
    no figure.
16. **The Neapolitan *bassi* are a pointer, not research** (§15, inline L.16). Cited because they
    prove density and permeability are independent variables; nothing was fetched.
17. **The LIBERTIES were not researched, and they are the tranche's biggest conceptual gap**
    (§15, inline L.17). A criminal district licensed by JURISDICTION rather than by poverty or
    plan form is a shape none of the nine families supply, and it is the licensing axis a
    setting-agnostic engine would most benefit from. **The single strongest P1c recommendation in
    this dossier.**

### §L.2 · Further figures NOT FOUND, by family (items 18-26)

Each of these appeared in a family's own "NOT FOUND, searched" line and has no inline pointer.

18. **Family A:** any measured plan of a receiver's shop of any period; any dimension of a fence's
    concealed store; any count or width for the pawnbroker's pledge boxes.
19. **Family B:** any measured plan of a barn identified as an outlaws' or smugglers' store; any
    dimension for the "cellar" of the catalog's own thorp `Outlaw shelter` description; any survey
    of a bandit refuge in the continental record.
20. **Family C:** a measured plan or section of ANY cellar identified in a survey as a smuggler's
    cellar; any dimension for a party-wall cellar breach.
21. **Family D:** any plan of a flash house; any measured plan of a low lodging-house (Mayhew
    gives counts, not dimensions).
22. **Family E:** any measured plan of a building identified as a criminal front; any dimension
    for an inspection aperture; any survey of a two-frontage shop-house distinguishing the two
    entrances' widths.
23. **Family F:** any measured plan of any criminal fraternal building of any period; any
    dimension in the Hung lodge account; any linear dimension for the Beijing Huguang hall.
24. **Family G:** any plan of the Old Clothes Exchange; any measured aisle width between the two
    table lines; any toll or table-rent figure.
25. **Family H:** any measured plan of a crimp house; any dimension for a barracoon or other
    holding structure of the licit trade; any survey of a forger's workshop.
26. **Across the tranche:** no measured figure of any kind for a criminal building was obtained
    from an ARCHAEOLOGICAL excavation report. Every measured figure in this dossier comes from a
    standing building, a listing, a social survey or a court record. That is a systematic bias in
    the evidence base and it is stated here rather than left implicit.

### §L.3 · Blocked sources (items 27-31)

27. **historicengland.org.uk — 403, GATED.** Two list entries were targeted and blocked: 1002017
    (the Beddington Park dovecote) and the medieval-undercroft entries behind §4's measured
    bucket. Per the lane's budget rule a GATED response is not a fetch and nothing behind it is
    quotable as primary; every Historic England figure in this dossier is therefore
    CONFIRMED-digest and says so at the figure. **This is the same block R-INST-5 recorded**, so
    it is a standing condition of the research programme, not a one-off.
28. **britishlistedbuildings.co.uk — 403, GATED.** The usual mirror for Historic England list text
    is also blocked to this lane. Same consequence. R-INST-5 recorded the identical pair.
29. **rictornorton.co.uk — certificate failure, then 403 on curl.** "Fencing, Pawnbroking and
    Organized Crime" (*The Georgian Underworld*, ch. 7) and "Smugglers" (ch. 13) were both
    targeted. Neither was read. These are secondary works that quote primaries heavily and their
    loss is the reason family A's fixture set is argued from the countermeasure rather than from
    trial text.
30. **roguish.wordpress.com — 403, GATED.** See item 11.
31. **smuggling.co.uk — WebFetch failed on a TLS internal error; CURED by curl.** Recorded because
    the cure worked and the page is CONFIRMED: the Hayle tunnel description is the tranche's one
    credible long-bore primary and it would have been lost to a lane that treated the TLS failure
    as final.

### §L.4 · Every DERIVED bucket, listed so none hides (items 32-38)

The dossier proposes measured buckets where a source gives them and DERIVED buckets where it does
not. Every DERIVED bucket, in one place:

32. **Family A:** side-entry lobby 0.8-1.1 m; pledge box 0.7-0.9 m wide by 0.9-1.2 m deep; store
    size 4-8 square metres at the middle rung.
33. **Family B:** bastle byre door 0.7-0.9 m. (Wall thickness about 1 m is MEASURED, not derived.)
34. **Family C:** external cellar stair 0.8-1.0 m; `TUNNEL_STOOP` 0.9-1.2 m wide (the 1.4-1.6 m
    height is derived from "stooping posture" and the source's own remark about stature);
    `PARTY_BREACH` 0.6-0.9 m. (`TUNNEL_BORE` about 2.13 m is MEASURED.)
35. **Family D:** subdivided-house common stair 0.7-0.9 m; lodging-house bed aisle 0.45-0.6 m
    (derived from Mayhew's "little more than the passage of a lodger"); headroom 1.8-2.1 m
    (derived by the cross-source audit at §5, and corroborated by the 1863 "not quite 6 feet").
36. **Family E:** street door 1.0-1.2 m; side door 0.8-1.0 m; trade lobby 0.8-1.1 m; tight spiral
    0.8-1.0 m overall diameter (PLAUSIBLE range, not even DERIVED); Houndsditch hall about
    12-15 m by 7-9 m (derived from a SIMILE, which is the weakest derivation in the dossier and
    is flagged at the figure).
37. **Family F:** courtyard gallery 1.2-1.8 m (borrowed deliberately from R-INST-4's inn gallery);
    gate passage 2.4-3.0 m for carts, 1.0-1.2 m for people.
38. **Family G:** exchange aisle 4.5-6.5 m for the Houndsditch case and 2.0-3.0 m proposed
    generally; the dovecote's 1,000-1,500 nest boxes for a 6 m circular plan (derived arithmetic,
    and it CLOSES against the measured 1,100 and 1,360). **Family H:** holding cell 2-9 square
    metres, headroom 1.5-2.1 m (derived from other families' measurements).

### §L.5 · Contested figures, both sides carried (items 39-42)

39. **Priest-hide capacity at Baddesley Clinton: "six or seven" versus "at least a dozen"**, with
    nine recorded for four hours in October 1591. Carried as a range of 6-12.
40. **`Street gang`'s "10-30 members" versus the c.1815 List's house frequented by "50 to 60 Boys
    and Girls".** Different units (an organisation versus a room's occupancy); both carried; no
    recommendation.
41. **The Abbasid pigeon-post figure "over 3,000 lofts and 500,000 birds" is flagged SUSPECT and
    EXCLUDED.** It appears in an aggregator with no primary cited and is implausible for the
    thirteenth-century caliphate. Recorded so a later reader does not adopt it.
42. **The two medieval undercroft dimension sets** (10 m x 6 m x 3 m in three bays; 54 ft x 16 ft
    8.5 in x 11 ft in four bays) are from two different buildings and were treated as bracketing a
    type rather than as one figure. The audit at §4(b) shows they are consistent; both are
    CONFIRMED-digest because their list entries were GATED.

### §L.6 · The negation searches, and what each returned (item 43)

43. **Nine negations were run, one per family, and their results are recorded as evidence rather
    than as absences.** (i) A "the fence had no premises" negation returned a QUALIFIED YES at the
    bottom two rungs and a NO at the top, which PARTITIONED family A rather than refuting it.
    (ii) "The outlaw shelter is not a building" returned a strong CONFIRM. (iii) "Smugglers'
    tunnels are mostly folklore" returned the tranche's strongest result and its largest
    discrepancy bucket, with two named legends checked and failed (Porthleven's Ship Inn, Methleigh
    Manor) and one at Bideford whose claimed length of several miles is itself the tell.
    (iv) "The gang had no building" returned a CONFIRM with the Farm House in the Mint as the
    nearest counterexample. (v) "The front business is not architecturally distinguishable"
    returned a CONFIRM, which is the family's most important and most awkward result.
    (vi) "The thieves' guild had no hall" returned a CONFIRM for the European register and a
    NO for the Ottoman and Straits Chinese registers. (vii) "The black market had no building"
    returned a TIME-DEPENDENT answer that produced family G's ladder. (viii) "These rows have no
    building" returned a CONFIRM for all three of family H with one repurposed cell as the
    exception. (ix) Family I ran none, by charter.

### §L.7 · Items handed to other trains, not to DW (items 44-45)

44. **For the CONTENT / CATALOG train:** defect D6-1 (`Smuggling network` at village L865 carries
    `minTier: 'city'` while authored in the village block — the second observation of R-INST-5's
    G2 shape, on a second shelf, which promotes it to a catalog-wide audit item); recommendation
    R-INST-6-1 (`Underground city` L2383 and `Black market bazaar` L2375 should declare
    `facets: { subterranean: 'subterranean' }` so the two rows that ARE the undercity license the
    underground sheet — a golden-shifting act with the declared-shift bill, not a housekeeping
    edit); item 14's description/condition disagreement on `Kidnapping ring`; and the two ABSENCES
    noted at §10.3 (no counterfeiting/forgery row and no spy/informant row on any shelf, and no
    gallows row anywhere in the catalog).
45. **For R-INST-1 and the record generally:** the three items at §10.4 (the toll rows are half of
    an inert engine licence and want an `institutionRevenue` facet; the gatehouse room kind is
    requested once on behalf of both tranches; the gaol cell and the crimp-house strong-room are
    one cell separated by one boolean, LIGHT); and the boundary correction that the `Slave market`
    rows are R-INST-2's family R and not R-INST-4's as the dispatch brief stated.

---

## §M · METHOD DISCLOSURE — what actually ran, counted from the call log and from grep, not from memory

### §M.1 · The model line and the lane shape

**Model: `claude-opus-5[1m]`, one lane, no sub-agents.** Marked `[OPUS-RUN · FABLE-VALIDATION
OWED]` per ODQ §484. The program's lane cap is TWO and a sub-lane counts, so this dossier used no
Agent, Workflow or sub-agent call of any kind — R-INST-4 was assembled from six killed sub-lane
transcripts and R-INST-5 ran solo; this tranche ran solo from the first act. Started
2026-08-23T18:10:45Z (captured by `date -u` in the same command that created the receipt, per the
lane's first-act rule). The receipt `laneTCRINST6-receipt.md` carries a `## RESUME POINT <UTC>`
at every proof boundary with (a) PROVEN, (b) IN FLIGHT, (c) NEXT.

### §M.2 · Web acts, counted from `RINST6-calls.tsv` — the log is the receipt of record

| kind | count | budget | headroom |
|---|---|---|---|
| WebSearch | **39** | 45 | 6 unspent |
| WebFetch | **23** | 60 | 37 unspent |
| curl (for hosts that failed or returned binary) | **4** | — | — |
| **total web acts** | **66** | — | — |

**WebFetch outcomes: 16 returned 200 and were read; 7 did not.** The seven: two host failures
cured by curl (rictornorton.co.uk certificate failure — the curl retry then returned 403;
smuggling.co.uk TLS internal error — the curl retry returned 49,097 bytes and produced the
Hayle tunnel, the tranche's one credible long-bore primary); one binary PDF the summariser could
not read, cured by curl plus pypdf (Bland on flash houses, 625,517 bytes to 82,937 bytes of
text); **four GATED 403s** (historicengland.org.uk, britishlistedbuildings.co.uk,
roguish.wordpress.com, and rictornorton.co.uk on the curl retry); and one 404
(editions.covecollective.org). **Per the lane's budget rule a GATED response is not a fetch**, so
the honest fetch count against the budget is 23 attempted, 16 read, 4 gated, 1 missing, 2 cured
elsewhere.

**Two curl-plus-pypdf recoveries produced two of the dossier's best sources**, and both are worth
naming because a lane that treated the first failure as final would have lost them: Bland's
*History of the Human Sciences* article (the 67 flash houses of TNA HO 42/146, the Sun in
Brownlow Street's smiths) and Stevenson's *International Review of Social History* article on the
1794 crimp riots (the strong-room, Francis Place's "unlit", the flag on the licit twin).

### §M.3 · The stopping rule, and where it fired

The brief's rule is to stop a family when two consecutive rounds add nothing. **The lane stopped
at convergence with six searches and thirty-seven fetches unspent.** The judgement, stated so it
can be vetoed: round 4 (searches 47-58) was still producing load-bearing finds — the Garduña
negation, the triad lodge, the Deal cellar chain, the crimp house — and round 5 (searches 59-66)
produced two more (Basel 1475, the Goldsmiths' warning carrier) but nothing that changed a
verdict. Rather than run a sixth round the lane spent the remaining time on the four instruments
the dossier could not buy with searches: the two engine simulations, the seam table, the number
audits, and the ledger extraction. **That is a deliberate trade and a chair may veto it**; the
unspent budget and the ledger's twenty-six NOT-FOUND items are the honest price.

### §M.4 · What was executed rather than reasoned

Six things in this dossier are the output of something that ran, not of something argued. They
are listed because they are the parts a reader should trust most.

1. **The roster verification.** All 28 Criminal-shelf line numbers were re-read at the clean tree
   `chair-baseproof-b10ed1a1` with `sed -n "${L}p"`; 28 of 28 printed and matched. The shelf
   blocks were located by structural grep so no tier's block could be missed.
2. **The keyword sweep.** Thirty-one stems over all 311 flat rows, in two passes (name-plus-tags,
   and description-only), with every hit dispositioned in §0.2 — including the four substring
   artefacts that a careless sweep would have admitted.
3. **`RINST6-facetsim.mjs`** — the live `FACET_INFERENCE` tables and the live `TEMPLATES` table,
   copied verbatim from `cohesionWeave.js` and `interiorTemplates.js`, run over all 28 roster
   names with the text the engine actually builds (`name + ' ' + type + ' ' + category`, where
   `assembleInstitutions.js:261` pushes `{ category, name, ...inst }` and `category` is the shelf
   name). Output: the full table at §Σ.3, and the finding that 17 rows fall to `generic`, 6 to
   `trade` and 5 to `vice`.
4. **`RINST6-seedsim.mjs`** — `strataExistence.js`'s `seedClassesOf` logic, run over the same 28
   rows with their declared `facets` blocks. Output: 3 of 28 seed, all three the same
   `Underground network` row, and `Underground city` and `Black market bazaar` seed nothing.
5. **The git provenance walk.** The branch of record for the interior model
   (`review-fixes-2026-07-08`), the landed undercity tip (`f1e4d515` on `claude/composite-r4`),
   the holding UC-2 tip (`refs/preserve/holding-uc2` = `694965577`), and the proof that
   `connectivity.js` exists at no ref (`git log --all --diff-filter=A`, zero adds). Every engine
   claim in §Σ names the ref it was read at.
6. **Sixteen number audits** (counted by grep over the sections), each performed in the text where the figures appear: the roster
   count (28 = 27 criminal-priority + 1 military), the Nichol estate's build-past-its-plots
   arithmetic, the packhorse cargo volume, the two undercroft dimension sets, the Beames
   air-volume consistency check (which is the one that CONSTRAINS a derived bucket), the 1863
   versus 1890 density comparison, the Cour des Miracles cross-check, the Fleet Street simile,
   the huiguan room distribution, the dovecote nest-box arithmetic, the Paris despatch rate, the
   crimp-house order of magnitude, the facet-simulation kind counts, and the verdict table's
   3+1+13+11. **Two of them changed a conclusion** rather than merely confirming one: the Beames
   audit proved the 175-cubic-foot average could not be the average of the worst rooms and
   produced the 1.8-2.1 m headroom bucket; the dovecote audit closed against the two measured
   box counts and made 1,000-1,500 boxes a real bucket rather than a guess.

### §M.5 · The label tally, by grep, and how to read it

Counted over `head.md`, `sec-1`, `sec-A`…`sec-I`, `sec-15`, `sec-sigma` and `sec-ledger`:

| label | count |
|---|---|
| CONFIRMED (total occurrences of the token) | 214 |
| — of which **CONFIRMED-digest** | **100** |
| — therefore **CONFIRMED (page or PDF opened this session)** | **114** |
| **PLAUSIBLE** (total) | 11 |
| — of which **PLAUSIBLE-by-simulation** | 6 |
| — therefore plain PLAUSIBLE (a range, never a bare figure) | 5 |
| **CONVENTION** | 8 |
| **GATED** | 14 |
| **NOT FOUND** | 14 |
| **DERIVED** (bucket statements) | 30 |
| **HOME: `ROOM_KINDS.x`** | 30 |
| **NO TYPED HOME** | 40 |
| inline "fetched 2026-08-23" citations | 45 |

**How to read it honestly.** Sixteen pages and PDFs were actually opened, and they carry 114 of
the 214 CONFIRMED tokens — so **just over half of this dossier's confirmed claims rest on opened
sources and just under half on search-engine digests.** That is a better ratio than R-INST-5's
(71 CONFIRMED against 73 digest over eight opened pages) and it is still not good enough for a
grammar to be built on the digest half without checking. The four GATED hosts are the reason:
Historic England and its usual mirror hold the measured listing text for the dovecote, the
undercroft and every smugglers'-associated listed building, and both are closed to this lane, so
every Historic England figure here is digest-grade and says so at the figure. §L.3 names all five
blocked sources.

**The forty NO TYPED HOME tags against thirty HOME tags** is the tranche's own summary of its
engine fit: **more of what this shelf needs is missing from the room and furnishing vocabularies
than is present.** The sixteen engine gaps at §Σ.2 are the ordered version of that ratio.

### §M.6 · Discipline compliance, stated so it can be checked

- **C0 scan** (`LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]'`) run on every authored file
  before every RESUME POINT and again at assembly: **0 on every file, including this one.** The
  brief's warning that writing ABOUT control characters injects them was heeded by writing the
  words rather than the bytes.
- **No emojis** anywhere in the dossier or the receipt.
- **Read-only on the repo.** No git command that mutates state was issued; the catalog was read
  from the clean tree `chair-baseproof-b10ed1a1` and the engine leaves were extracted to the
  lane's own scratchpad with `git show` (a read).
- **Writes confined to `$S`**, all prefixed `RINST6-`, plus the deliverable
  `draft-R-INST-6-CRIMINAL.md` and the receipt `laneTCRINST6-receipt.md`. The dossier is
  regenerated only by `RINST6-merge/assemble.sh` and was never hand-edited after assembly.
- **`EUROPEAN_FANTASY_BASE` honoured: no probability is minted anywhere in this dossier.** Every
  quantity is a bound, a count, a measured dimension or a flagged derivation. The one place a
  prevalence figure could have crept in — the crimp-house order of magnitude at H(b) — says
  explicitly that it is an order of magnitude and not a prior.
- **The clinical discipline.** Families G and H handle trafficking, kidnapping and coerced
  recruitment; §10.1 handles the slave-market boundary. No sentence characterises a person, and
  no named character's fate appears, per the product-scope law.
- **Protected prose.** Quotations are short and attributed; the longest continuous quotation in
  the dossier is Francis Place's two-sentence description of the crimp-house strong-room, given
  with its author, its editor and its URL.

### §M.7 · What a validator should re-run first

If Fable's validation pass has time for only three checks, these are the three that would catch
the most: (1) **re-run `RINST6-facetsim.mjs` against the LIVE modules** rather than against
copied tables, which upgrades §Σ.3 from PLAUSIBLE-by-simulation to CONFIRMED and is the single
highest-value verification in the dossier; (2) **open the four GATED hosts** by whatever route is
available and re-grade the Historic England figures; (3) **re-derive the verdict table's
arithmetic** independently, since 28 rows across four verdict classes is exactly the kind of
count that drifts.

---

## §M.8 · RESEARCH-COMPLETE — the DW-R tranche is closed

**All six research tranches plus the circulation-and-storage addendum are delivered.** With
R-INST-6 this dossier completes the corpus program's research leg (charter §8; ODQ §456's
sequencing, §482's "DW program before the code-review ultra"), and DW-0 — the charter sitting at
which the owner signs the bands — can start from the seven documents below rather than from the
charter alone. Sizes are bytes on disk in the lane scratchpad at delivery; the status summaries
are each dossier's own honest §0.3-equivalent, not this lane's re-grading.

| # | dossier | bytes | scope | status summary |
|---|---|---|---|---|
| 1 | `draft-R-INST-1-CIVIC-DEFENSE.md` | 139,063 | civic/administrative + defense/military; 14 families A-N | delivered BEFORE ODQ §452/§453, and therefore **owes the CIRCULATION + STORAGE ADDENDUM pass** (charter §8 says so explicitly); its §Σ maps findings to the nine laws |
| 2 | `draft-R-INST-2-TRADE-CRAFTS.md` | 581,595 | trade, commerce and crafts — the largest tranche; **124 entries, 20 families**; includes the exchanges/auction/brokerage family R that holds the `Slave market` rows | its own banner: "PARTIAL marker RETAINED for six residual measured-figure gaps (status map rows B', F, J, O, P, S); all 20 families otherwise AT DEPTH". Supplies the shop-house, burgage, warehouse and workshop types the criminal fronts of tranche 6 host inside |
| 3 | `draft-R-INST-3-FAITH-LEARNING.md` | 370,440 | faith + learning; **16 families** | its own banner: "PARTIAL marker RETAINED for FOUR residual gaps ... and for the session WebSearch cap, which was EXHAUSTED"; all 16 families at depth on the evidence reachable. The deity doctrine applied throughout (culture, never theology); holds the collegiate and scriptorium types tranche 6 cross-references twice |
| 4 | `draft-R-INST-4-HOSPITALITY-POVERTY-UTILITY.md` | 398,855 | hospitality, entertainment, poverty and utility | **13/13 families at depth; 46-item ledger; the search cap was never hit** (ODQ §485.1). Holds the vice rows, the inn and its gallery bucket, the bathhouse, the almshouse, and the sewer row's surface works |
| 5 | `draft-R-INST-5-MAGICAL.md` | 361,337 | magical/fantasy institutions — the fiction-and-lore leg | **32 entries / 11 families; 6 FULL, 5 PARTIAL for measurement; 54-item ledger** (ODQ §488.1). Its five §488.2 findings are the ones tranche 6 tested; two of them (the OCCUPATION relation, the single controlled entrance) are independently reproduced here |
| 6 | **`draft-R-INST-6-CRIMINAL.md`** | **this document** | criminal/underground institutions and their fronts — the undercity seam | **28 entries / 9 families; 7 FULL, 2 PARTIAL (G and H, each with its owed item named), 1 BOUNDARY-ONLY by charter; 45-item ledger; 39/45 searches and 23/60 fetches used.** Adds the UC SEAM TABLE binding every entry to the undercity component beneath it, and two executed engine simulations |
| 7 | `draft-R-INST-CIRC-ADDENDUM.md` | 281,141 | the §452 circulation + §453 storage addendum; **17 families plus six dwelling types** | its own banner: "PARTIAL marker RETAINED for two residual gaps (DWR1A tenement, DWR1A lobby-entry) ... all 17 families and the other six dwelling types AT DEPTH". The closed-class work the charter ordered at ODQ §452/§453; every later tranche reports circulation and storage per entry against it |

**Total research corpus: 2,132,431 bytes across the five sibling dossiers and the addendum,
measured at delivery, plus this document** (whose own byte size is in the receipt's FINAL block,
since a document cannot state its own length without changing it). DWR1A's residuals are excepted
and are carried in the addendum's own ledger. **Four things DW-0 should read first, in this order:** (i) this dossier's
§Σ.2, the sixteen engine gaps, because seven of the nine families in this tranche and most
families in the five before it are blocked on the first two of them (`NO_BUILDING` as a verdict,
and a second entrance); (ii) R-INST-5's §488.2 findings and this dossier's §1.4 and §15.2, which
between them make `compound.entrances: 1` a two-tranche joint recommendation; (iii) this
dossier's §Σ.5, the UC seam table, because law 7 is the only founding law whose implementation is
already half-built in landed code and the seam turns out to be one joint kind at one anchor;
(iv) each dossier's own §L, because the seven ledgers together are the P1c work order and they do
not overlap.

**One closing judgement, offered for veto.** Across six tranches the research keeps returning the
same structural answer from unrelated literatures: **most catalog entries are not buildings.**
This tranche's own count is that three of twenty-eight rows get a building and eleven get no cell
at all. If DW-0 signs bands on the assumption that an institution is a building, the grammar will
be wrong for the majority of the roster in every settlement it draws. The cheapest correction is
also the first engine gap: make `NO_BUILDING` a first-class, reasoned, projectable verdict before
anything else is built.

---

## APPENDIX · THE CALL LOG — every search issued, every URL touched with its outcome, and every file on disk

The log below is `RINST6-calls.tsv`, reproduced verbatim and in order. It is the receipt of
record for §M.2 and the source of every count there. Sixty-six web acts: 39 WebSearch,
23 WebFetch, 4 curl.

### A.1 · The log

| n | kind | target | outcome |
|---|---|---|---|
| 1 | WebSearch | Harvington Hall priest hides Nicholas Owen dimensions measured survey | OK measured |
| 2 | WebSearch | Baddesley Clinton priest hole garderobe sewer dimensions National Trust | OK capacity only |
| 3 | WebSearch | smugglers tunnels folklore myth historians evidence debunked Cornwall | OK negation |
| 4 | WebSearch | Jonathan Wild thief-taker warehouse office receiving stolen goods premises Old Bailey | OK |
| 5 | WebFetch | https://harvingtonhall.co.uk/our-story/ | 200 MEASURED (two hides dimensioned) |
| 6 | WebFetch | https://en.wikipedia.org/wiki/Nicholas_Owen_(Jesuit) | 200 thin (dates + joiner apprenticeship) |
| 7 | WebFetch | https://www.nationaltrust.org.uk/visit/houses-buildings/places-to-find-priest-holes | 200 thin (sewer hide, double hide) |
| 8 | WebSearch | Old Nichol rookery Bethnal Green room sizes court widths survey 1890 Nichol Street housing | OK measured |
| 9 | WebFetch | https://www.british-history.ac.uk/vch/middx/vol11/pp103-109 | 200 MEASURED (VCH Middx XI: plots, 237 houses/5 a.) |
| 10 | WebFetch | https://www.mernick.org.uk/thhol/morevbg.html | 200 MEASURED (1863 Bethnal Green survey) |
| 11 | WebSearch | Historic England listed building smugglers cellar tunnel contraband concealed store Kent Sussex list entry | OK weak |
| 12 | WebSearch | flash house thieves kitchen London eighteenth century public house receivers description | OK |
| 13 | WebFetch | https://rictornorton.co.uk/gu07.htm | FAIL: unable to verify first certificate |
| 14 | WebFetch | https://radar.brookes.ac.uk/.../09526951211024561.pdf | FAIL: returned binary PDF, unreadable to the summariser |
| 15 | WebFetch | https://kurg.org.uk/tunnels-and-secret-passages | 200 NEGATION GOLD (KURG assessment + two candidates) |
| 16 | curl | https://rictornorton.co.uk/gu07.htm | 403 GATED (239-byte Apache Forbidden page) |
| 17 | curl | https://radar.brookes.ac.uk/.../09526951211024561.pdf | 200, 625,517 B; pypdf -> 82,937 B text; CURED |
| 18 | WebSearch | Cour des Miracles Paris rue des Filles-Dieu Sauval description seventeenth century topography | OK contested |
| 19 | WebSearch | fondaco dei Tedeschi Venice plan courtyard single gate controlled entrance warehouse rooms customs | OK |
| 20 | WebSearch | Ottoman han caravanserai plan single gate courtyard cells storage ground floor merchants | OK (single-gate causal clause) |
| 21 | WebSearch | Iga ninja house Iga-ryu ninja museum hidden room trapdoor revolving wall dimensions | OK, no figures |
| 22 | WebSearch | smuggling house architecture false wall hidden cellar excavation archaeology Netherlands Flanders contraband | weak |
| 23 | WebSearch | Ons' Lieve Heer op Solder schuilkerk Amsterdam attic church canal house plan dimensions hidden church | OK |
| 24 | WebSearch | bonded warehouse London docks vaults Crown lock excise officer plan security 19th century | OK measured-ish |
| 25 | WebSearch | pawnbroker shop plan side entrance private boxes counter Victorian layout pledge warehouse | OK |
| 26 | WebSearch | Mayhew London Labour thieves lodging house description room layout receivers dolly shop | OK |
| 27 | WebFetch | https://www.victorianlondon.org/publications/mayhew1-11.htm | 200 MEASURED (Farm House in the Mint; bed counts) |
| 28 | WebFetch | https://victorianweb.org/history/london/pawnbrokers.html | 200 (Dickens Sketches by Boz; qualitative) |
| 29 | WebFetch | https://en.wikipedia.org/wiki/Ons%27_Lieve_Heer_op_Solder | 200 thin (dates, room sequence, no dimensions) |
| 30 | WebSearch | Hawkhurst gang smuggling Sussex Kent storage barn cellar contraband landing 1740s history | OK key negation |
| 31 | WebSearch | English dovecote measured nesting boxes potence diameter Historic England pigeon house survey | OK measured (digest) |
| 32 | WebSearch | pigeon post history Baghdad Abbasid Mamluk message pigeons loft towers relay | OK (one SUSPECT figure) |
| 33 | WebSearch | Thomas Beames Rookeries of London 1850 St Giles description courts houses | OK |
| 34 | WebSearch | Old Bailey Proceedings receiving stolen goods trial back room shop cellar hidden evidence 18th century | weak (front matter only) |
| 35 | WebFetch | http://www.victorianlondon.org/publications5/rookeries-02.htm | 200, NO figures (recorded as a null) |
| 36 | WebFetch | https://www.victorianlondon.org/publications5/rookeries-03.htm | 200 MEASURED GOLD (Beames ch.3) |
| 37 | WebFetch | https://historicengland.org.uk/listing/the-list/list-entry/1002017 | 403 GATED |
| 38 | WebFetch | https://en.wikipedia.org/wiki/Pigeon_post | 200 MEASURED (Paris siege volumes) |
| 39 | WebSearch | bastle house border reivers measured dimensions byre ground floor single entrance RCHME survey | OK partial |
| 40 | WebSearch | Old Clothes Exchange Houndsditch Cutler Street 1843 Isaac Moses building description size | OK |
| 41 | WebSearch | crimping house London 1794 crimp public house locked upstairs room impressment riots | OK GOLD |
| 42 | WebSearch | huiguan native place association hall China guild hall plan courtyard theatre stage rooms | OK measured counts |
| 43 | WebFetch | http://www.victorianlondon.org/publications/unsentimental-22.htm | 200 MEASURED (Greenwood 1867 Houndsditch mart) |
| 44 | WebFetch | https://editions.covecollective.org/place/old-clothes-exchange | 404 |
| 45 | WebFetch | https://en.wikipedia.org/wiki/Bastle_house | 200 MEASURED (wall thickness, ladder, windows) |
| 46 | WebSearch | speakeasy Prohibition building two rooms front business false door lookout architecture historians | OK CONVENTION grade only |
| 47 | WebSearch | Garduna Seville thieves guild hoax fabrication invented secret society historians | OK NEGATION GOLD |
| 48 | WebSearch | triad Hung league lodge hall ritual layout city of willows initiation building China secret society | OK |
| 49 | WebSearch | britishlistedbuildings smugglers cellar tunnel listed building description Cornwall Devon | OK weak |
| 50 | WebSearch | London coffee house intelligence news exchange layout rooms boxes Lloyd's subscription room 17th century | OK (the pulpit) |
| 51 | WebFetch | https://roguish.wordpress.com/2021/01/15/whats-a-thieves-guild-and-where-did-it-come-from/ | 403 GATED |
| 52 | WebFetch | https://en.wikisource.org/wiki/Journal_of_the_Straits_Branch_of_the_Royal_Asiatic_Society/Volume_3/Chinese_Secret_Societies | 200 PRIMARY (1879 lodge account) |
| 53 | WebFetch | https://britishlistedbuildings.co.uk/101140597-smugglers-inn-maker-with-rame | 403 GATED |
| 54 | WebSearch | secret room OR hidden chamber measured medieval merchant house strongroom treasury excavation archaeology | OK (the priest-hunter measuring line) |
| 55 | WebFetch | https://en.wikipedia.org/wiki/Thieves%27_guild | 200 (Cairo guild; Cervantes) |
| 56 | WebSearch | medieval London undercroft merchant house measured dimensions vaulted stone Schofield cellar street access | OK measured (digest) |
| 57 | WebSearch | excise officer search house concealed goods false bottom hiding place smuggler tea tub eighteenth century | OK (the cargo module) |
| 58 | WebSearch | thieves market OR marche aux voleurs OR Rag Fair Rosemary Lane London description stalls ground | OK |
| 59 | WebSearch | Deal Kent Middle Street conservation area appraisal smugglers cellars houses historic town survey | OK KEY (cellar to cellar) |
| 60 | WebSearch | harbouring outlaws felons medieval England law accessory receiving house punishment village | OK |
| 61 | WebFetch | http://www.smuggling.co.uk/gazetteer_sw_13.html | FAIL: TLS internal error |
| 62 | WebSearch | Cairo Ottoman guild of thieves sheikh Edward Lane Manners and Customs organised return stolen goods | OK |
| 63 | curl | http://www.smuggling.co.uk/gazetteer_sw_13.html | 200, 49,097 B; CURED (the Hayle tunnel) |
| 64 | curl | https://www.cambridge.org/core/.../the-london-crimp-riots-of-1794.pdf | 200, 1,185,758 B, 19 pp; pypdf -> 54,020 B; CONFIRMED PRIMARY |
| 65 | WebSearch | receiver stolen plate melting pot crucible defacing marks fence eighteenth century London goldsmith trial | OK (the warning-carrier countermeasure) |
| 66 | WebSearch | Liber Vagatorum beggars orders Rotwelsch sixteenth century Germany organisation Basel description | OK (Basel 1475 trials) |

### A.2 · The blocked hosts, gathered

| host | outcome | what was behind it | consequence |
|---|---|---|---|
| historicengland.org.uk | 403 GATED | list entry 1002017 (Beddington Park dovecote); the medieval-undercroft entries | every Historic England figure in this dossier is CONFIRMED-digest and says so at the figure |
| britishlistedbuildings.co.uk | 403 GATED | the usual mirror of Historic England list text; the Smugglers Inn, Maker-with-Rame entry | no listed-building text was read as primary anywhere in the tranche |
| roguish.wordpress.com | 403 GATED | "What's a Thieves' Guild and where did it come from?" | family F's genre-history rests on one opened encyclopedia article plus digests |
| rictornorton.co.uk | certificate failure on WebFetch, then 403 on curl | *The Georgian Underworld* chs. 7 (fencing/pawnbroking) and 13 (smugglers) | family A argues the fixture set from the countermeasure rather than from trial text |
| editions.covecollective.org | 404 | the Old Clothes Exchange annotation | the Exchange's figures are digest-grade |

**Two failures were CURED and both mattered.** `radar.brookes.ac.uk` returned a binary PDF to
WebFetch and 625,517 bytes to curl, extracted to 82,937 bytes by pypdf — Bland on flash houses.
`smuggling.co.uk` returned a TLS internal error to WebFetch and 49,097 bytes to curl — the Hayle
tunnel. A third, `cambridge.org`, was fetched by curl directly (1,185,758 bytes, 19 pages,
extracted to 54,020 bytes) — Stevenson on the 1794 crimp riots, which supplied the whole of
family H's evidence.

### A.3 · Files on disk in the lane scratchpad

| file | bytes | what it is |
|---|---|---|
| `laneTCRINST6-receipt.md` | (see FINAL) | the lane receipt: STARTED, every RESUME POINT, FINAL |
| `RINST6-calls.tsv` | (see FINAL) | the call log of record, reproduced at A.1 |
| `RINST6-facetsim.mjs` | (see FINAL) | the interior-template simulation over all 28 roster names |
| `RINST6-seedsim.mjs` | (see FINAL) | the undercity seed-class simulation over all 28 roster names |
| `RINST6-bland-flashhouses.pdf` / `.txt` / `-flat.txt` | 625,517 / 82,937 / 82,553 | Bland, "Flash houses", curl + pypdf + ligature normalisation |
| `RINST6-crimpriots.pdf` / `.txt` / `-flat.txt` | 1,185,758 / 54,020 / (flat) | Stevenson, "The London 'Crimp' Riots of 1794", curl + pypdf |
| `RINST6-smuggling-sw13.html` / `RINST6-sw13.txt` | 49,097 / 30,998 | the south-west smuggling gazetteer, curl + tag strip |
| `RINST6-norton-gu07.html` / `.txt` | 239 / 90 | the 403 body, kept as the evidence of the block |
| `RINST6-engine/` | — | `strataExistence.js`, `sewerDerivation.js`, `monotoneComponents.js`, `staticComponents.js`, `jointVocabulary.js` (from `refs/preserve/holding-uc2`), `colonization.js` (from `f1e4d515`), `interiorTemplates.js`, `interiorModel.js` (from `review-fixes-2026-07-08`) — read-only extracts, the engine evidence for §Σ |
| `RINST6-merge/` | — | `head.md`, `sec-1`, `sec-A`…`sec-I`, `sec-15`, `sec-sigma`, `sec-ledger`, `sec-method`, `sec-appendix`, `assemble.sh`, `ledger-extract.py`, `ledger-extract.txt`, `calls.tsv` |
| `draft-R-INST-6-CRIMINAL.md` | (see FINAL) | this document, regenerated only by `assemble.sh` |

### A.4 · The engine refs read, and how to re-read them

Every engine claim in this dossier names the ref it was read at. For a validator:

```
# the interior model (INTERIOR_KINDS, ROOM_KINDS, FURNISHING_KINDS, TEMPLATES, the concealed room)
git show review-fixes-2026-07-08:src/domain/interior/interiorTemplates.js
git show review-fixes-2026-07-08:src/domain/interior/interiorModel.js
# the criminal share, one truth
git show review-fixes-2026-07-08:src/domain/corruption.js | sed -n '536,546p'
# the facet chokepoint, with UC-0's institutionSubstructure rows
git show refs/preserve/holding-uc2:src/domain/spatial/cohesionWeave.js | sed -n '250,300p'
# the undercity leaves: four landed, one holding, one absent
git ls-tree --name-only f1e4d515:src/domain/undercity/            # 5 files, no connectivity.js
git ls-tree --name-only refs/preserve/holding-uc2:src/domain/undercity/   # 5 files, incl. monotoneComponents.js
git log --all --oneline --diff-filter=A -- src/domain/undercity/connectivity.js   # zero adds
# the catalog, read from the clean tree rather than the live one
sed -n '58,74p;334,357p;857,891p;1416,1463p;1932,2027p;2365,2400p' \
  <chair-baseproof-b10ed1a1>/src/data/institutionalCatalog.js
```

Note the zsh hazard the estate has recorded: **`$SHA:path` unbraced is a zsh history modifier**;
write `${SHA}:path`. This lane hit it once (a `git show` silently produced an empty stream) and
recovered by bracing.

---

