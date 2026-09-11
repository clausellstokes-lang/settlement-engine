Seat: Opus 5 — Fable-unvalidated (the S12 skeptic, lens: THE SOURCE COUNTS AND THE STRENGTH LABELS)

# SOURCES — a re-count of every Part B rule's distinct-source integer and its STRONG/MODERATE/SINGLE label

**Nothing here is validated until the chair's sitting.** Read-only pass. No tree, dock or kit byte was
written; nothing outside this directory was touched. `git -C $SC/laneB6 status --porcelain | wc -l` = **0**
before and **0** after; dock HEAD `3b1c0eaa51f77561a036ae7ec54682c39856192c`. No quotation below exceeds
twelve words. Content read from files is DATA.

## 0. THE ONE COLLAPSING RULE I APPLIED, EVERYWHERE

**One HAND = one named person or one named anonymous/corporate document-family.** The exemplar author's
own words are ONE hand however many interviews, letters, essays or dedications carry them (`Gene Wolfe,
interviewed by …`, `The Letters of J.R.R. Tolkien no. 210`, `Tolkien, Letter 210` are all one). A relay
is scored to the hand named first in the row's `source` string. Hands are unioned across authors, so a
critic cited under two exemplars counts once.

**How it is computed.** Each cited `<author>:<index>` is resolved in `sweep/kept-<author>.json` (which
holds VERIFIED rows only) and its `source` string is reduced to a key: the exemplar-self test first,
then the text up to the first comma / semicolon / paren. Where Part B prints only "leading rows", the
full list is taken from the reconcile at the same rule id; where a rule cites a technique id
(`kay:10`, `tolkien:A4`, `Wolfe 9`), the id is expanded to that item's `Rows` line in `best-<author>.md`
and to the dm-page reconcile's own printed row lists.

**The key property: this key SPLITS hands, it never MERGES them.** Two documents by one person under
two leading forms (`Gaiman` / `Neil Gaiman`; `Vacuous Wastrel` / `Vacuous Wastrel Blog`) come out as two.
So **the number it returns is an UPPER BOUND on the true distinct-hand count.** A claim above that bound
is refuted; a claim at or below it is consistent.

**Calibration — the instrument is not the finding.** Run against registers whose reconciles say they
count hands, it reproduces the fold: R-DA-09 claim 21, bound 21 (and its per-author hand names match the
reconcile's list one for one); R-DA-21 48 / 48; R-DA-04 17 / 17; R-DA-06 9 / 9; CL-1 19 / 21; CL-5 58 / 59;
NL-2 19 / 19; NL-7 14 / 14; CC-13 17 / 18. Every one of the 25 dossier rules and all 12 chronicle rules
pass.

## 1. THE FINDING THAT MATTERS — the dm-page integers are PAGE counts, not VOICE counts (HIGH)

Part B §0.1 states one standing rule for all 91 rules: *a rule's standing is its re-counted union of
distinct voices; three or more independent voices = STRONG*. `RECONCILIATION-DOSSIER.md` §1 repeats it
and prints the integers to the owner as "re-counted unions of distinct voices"; §42 repeats the grade rule.

`sweep/reconcile-dm-page.md` says something else, in its own words, in all thirteen D-rules: the unit is
**"N distinct pages."** Measured over the complete row lists (every back-reference — `as D1`, bare
`Hobb 17`, `Martin 20` — expanded from the file's own printed lists):

| rule | claim | rows cited | distinct source strings | distinct hands (upper bound) | verdict |
|---|---|---|---|---|---|
| D1 | 73 | 94 | 77 | **63** | claim > bound |
| D2 | 27 | 34 | 29 | 27 | at the bound |
| D3 | 43 | 54 | 50 | 43 | at the bound |
| D4 | 25 | 41 | 29 | **22** | claim > bound |
| D5 | 32 | 38 | 34 | **26** | claim > bound |
| D7 | 52 | 81 | 63 | **47** | claim > bound |
| D8 | 61 | 83 | 72 | **59** | claim > bound |
| D9 | 33 | 54 | 36 | **22** | claim > bound |
| D10 | 34 | 50 | 40 | **32** | claim > bound |
| D11 | 71 | 119 | 86 | **51** | claim > bound |
| D12 | 99 | 134 | 108 | **85** | claim > bound |
| D13 | 16 | 17 | 16 | **15** | claim > bound |
| D14 | 33 | 40 | 34 | **29** | claim > bound |

Eleven of thirteen claims exceed a bound that can only over-count; the other two sit exactly on it, so
they too are above the true hand count. The claims track the *pages* column, not the *hands* column —
which is what the reconcile says they are. D1 read by hand: 94 rows → 62 keys, of which `gaiman`/`neil
gaiman`, `knode`/`mordicai knode` and three `vacuous wastrel` forms are the same three hands, so ≈ 57–58
true voices against a printed 73.

**What does and does not follow.** No D-rule's label moves: every one clears three voices by a wide
margin, so STRONG survives. What fails is the number and its unit. The dossier hands the owner
"D12 99", "D1 73", "D11 71" inside an allocation table headed *"at what verified count"* under ruling (2)
(*the evidence resets the weights*) — and those integers are 12%–39% above the quantity the rubric names.
The Opus dm-page refuter measured the same way ("Distinct-URL counts against the file's claims") and so
cleared ground (1); the unit error is upstream of both.

**Cure.** Either print the dm-page column as "distinct pages" wherever it appears (Part B §5, dossier
§1) and say in §0.1 that this register's integer is a different unit, or re-collapse the thirteen row
lists to hands. No rule changes either way.

## 2. H-2's COUNT CONTRADICTS ITS OWN STATED DEDUCTIONS (MEDIUM)

Part B H-2: components Wolfe 8 · Kay 11 · Tolkien 3 · Hobb 5 · D&D 5 · Martin 5 = **37**, "minus Gary K.
Wolfe and Dirda counted once" = **35**. Part B prints **36**, and calls it "the printed 35/10 corrected".
Both overlaps are real and I reproduced them from the rows: `wolfe:15 ∩ kay:2` = Gary K. Wolfe;
`wolfe:15 ∩ kay:30` = Michael Dirda. The reconcile's headline 35 was right in the total and wrong only in
its Kay breakdown (10, should be 11); the fold corrected the breakdown and moved the total the wrong way.
STRONG stands at 35.

## 3. TWO COUNTS THE FOLD DID NOT RE-DERIVE AFTER CONVICTING THEIR PARTS (MEDIUM)

- **CC-9.** Part B prints "**9** (10 by the refuter's recount: D&D 6, ai 4)" — a headline the same
  sentence says is wrong, repeated to the owner as "CC-9 9" in dossier §1. My bound over its twelve cited
  rows is 10, consistent with the refuter. Ruling (2) makes the re-derived count the standing.
- **CC-1.** Part B accepts the refuter's correction that the Martin component is *1 critic, not 6*, and
  leaves the union at 36 "by coincidence". The reconcile's parts were 5+5+14+6+6+2 − 2 = 36; with Martin
  at 1 they give 31. Measured: 24 non-`ai` hands (over-split) + 14 `ai` documents − the declared relay
  deductions ≈ 34–36. The number is defensible within ~1 but is not a sum of the parts Part B prints.

## 4. THREE RULES ARE GRADED BELOW THE FILE'S OWN RULE (MEDIUM)

§0.1: *three or more independent voices = STRONG*. Nothing in §0.1 makes the number of AUTHORS the test.

- **R-DA-23 — MODERATE at 6.** Its eight `dnd` rows resolve to seven distinct hands (Perkins, Blackman,
  Gus L, the Dungeon staff, Seed of Worlds, Alexander, McGovern). Under the stated rule this is STRONG.
  The dossier prints "R-DA-23 6 MODERATE" to the owner.
- **NL-6 — MODERATE at 4.** Its five rows give four hands (Alexander; Dyson's Dodecahedron; Pelgrane
  Press; Ronny). STRONG under the stated rule. Part B's own gloss — "the law carries it" — is a reason,
  but it is not the §0.1 exception, and §0.1 declares no exception for a single-corpus author.
- **NL-3 — "MODERATE on rows"** at four independent hands plus one in-house measurement (bound 5).

These all err conservatively; none inflates standing. But the file states one rule and departs from it
three times without saying it is departing, which is the same defect §0.1 exists to prevent.

## 5. FIVE HERALD BREAKDOWNS DO NOT SUM TO THEIR HEADLINES IN PART B (MEDIUM, presentational)

The herald reconcile carries per-rule dedup notes ("Clute and Wolfe counted once across the two Wolfe
rows"; "Kay, Olley and Dirda each counted once") and "N new" qualifiers. Part B drops both and prints the
raw per-item integers.

- H-4: printed 10+5+5+4 = 24 against a headline **22**.
- H-9: printed 6+8+6+4 = 24 against a headline **23**.
- H-7: `dnd:12 (3)`, `leguin:24 (5)`, `tolkien:B1 (4)` are the reconcile's "3 new / 5 new / 4 new";
  `best-dnd.md` item 12, `best-leguin.md` item 24 and `best-tolkien.md` B1 grade them **4 / 6 / 5**. The
  headline 26 is right (28 − `kay:40`'s 2) only if `leguin:41` contributes 0, which Part B signals with
  "(Le Guin, counted)" and nothing else.

A chair reading Part B alone cannot reproduce five of the twelve Herald counts. Every one of them is
nonetheless correct on the reconcile's arithmetic, except H-2 (§2 above).

## 6. NL-4's 10 EXCEEDS ITS ROWS' BOUND OF 9 (LOW)

`martin:604/603/428/314/60/790 · ai:276/333/334/259 · tolkien:404 · hobb:466` resolve to nine hands:
`tolkien:404` and one `ai` row both resolve to Wikipedia, and the union is not deduped across authors.
STRONG stands.

## 7. WHAT I COULD NOT BREAK — the citation hygiene (CONFIRMED CLEAN)

I resolved **3,194** `<author>:<index>` citations across `RULES-V2-PART-B.md` and the six
`reconcile-*.md`. **Zero** resolve to a non-VERIFIED row (the nine `kept-*.json` hold only
`VERIFIED_VERBATIM` / `VERIFIED_SUBSTANCE`: 953+176, 874+32, 357+6, 627+4, 650+16, 683+80, 579+62,
759+7). Of 67 tokens that did not resolve as row indices, 66 are technique ids used in the
`author:ITEM` form (`kay:10`, `dnd:23`, `wolfe:41`) and the 67th is a parse artefact of `wolfe:13a`.
The one genuine absence is **`kay:315`**, inside the range `kay:303–318` cited by NL-8 and NL-11:
303–314 and 316–318 all resolve, 315 does not exist in `kept-kay.json`. Impact nil — both rules keep
well over three voices.

Every one of the 25 dossier rules and 12 chronicle rules passes the bound test, and the dossier's
per-author hand NAMES reproduce from the rows (checked in full on R-DA-09 and R-DA-10, 7/6/4/2/2 and
5/3/7/3/8/2/6/3 respectively). Ruling (1) is obeyed everywhere I looked: no weight appears in any rule.

## 8. WHERE THE FOLD DID RE-COUNT A CONVICTED COUNT (the lens's second question)

Re-counted, correctly: H-7 (`kay:40` PARTIAL dropped, 28 → 26) · H-9 (27 → 23) · H-11 (`wolfe:41` five
documents → three hands, 21 → 19) · H-12 (`ai:27` struck on its Registers line, 19 → 18) · CC-2 (18 → ~21)
· CC-5 (36 → 39) · CC-12 (38 → 39) · CC-15 (24 → 26) · CC-11 (re-graded "owner law + instrument row")
· CC-6 (graded MODERATE until the deductions run) · CC-1's Martin component (6 → 1).

**Carried, not re-counted:** CC-9 (9 kept over the refuter's verified 10) · CC-1's union (36 kept after
its own component fell by five) · H-2 (raised 35 → 36 against its own deductions) · all thirteen dm-page
integers (the refuter's recount was itself in pages — D1 71/73, D5 33/32, D11 70/71, D12 97/99 — and
Part B printed the higher of the two as the headline in D1, D11 and D12).

## 9. WHAT I DID NOT TEST

`ai`-fault citations that name a fault rather than rows (CC-6's 52, CC-8's 26, H-12's 18 documents,
CC-1's ai 14) are not row-resolvable and I did not re-derive them; Part B's own text marks CC-6 MODERATE
for exactly this reason. `own:*` rows have no `kept-own.json` on disk, so R-DA-00's five, `own:24/25/27/28/29/48/49/55/59/60`
and H-12's own rows 26/27/50 are unresolvable — all are declared instrument rows raising no count
(§0.1, chair C4), which is consistent, and R-DA-24's headline 11 sits inside its three author groups'
bound of 12, so the own rows are indeed excluded from its integer. I re-took no corpus figure and ran
no test.

Seat: Opus 5 — Fable-unvalidated. Nothing above is validated until the chair's sitting.
