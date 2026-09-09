# SKEPTIC PASS — LENS: THE ENTRY WALKER (INSTR-912 car 1, sha 950c0c204)
Seat: Opus 5 — Fable-unvalidated (the verifier). Dock read: `$SC/skepINSTR` @ `74a1aa0e8`.
Porcelain before: 0. Porcelain after: 0 (see the tail).
Every figure below came from a command I ran in this session; probes live beside this file
(`probe1.mjs` … `probe10.mjs`) and import the dock's modules by absolute path — no dock byte moved.

## VERDICT IN ONE BREATH
The instrument is real and most of the receipt reproduces exactly — all four Brackwater
fixtures, every count in §1.5 and §1.7 I recounted, the four live breaches and their cures,
and the 19-test gate (green, EXIT=0, re-run here). **Two claims fail.** The three "breaches the
sitting did not name" are ground artefacts of an office roster that under-reads the estate by
25 of 37 candidate nouns, and the brief's own named QUALIFY control passes silently.

---

## (a) THE FOUR BRACKWATER FIXTURES — CONFIRMED, arm for arm
`node probe1.mjs` (my own driver, not the lane's test):

| fixture | fails | arm set measured |
|---|---|---|
| (a) TABLE_EMPTY | 7 | C1 figure · C2 duty · C2 office ×2 · C2 exemption-on-null · C4 totality ×2 |
| (b) TABLE_FULL | 3 | C1 figure · C4 totality ×2 |
| (c) TABLE_CLOSED | 1 | C1 figure only — zero C4 quantifier fails |
| (d) TABLE_ROW_CLOSED | 3 | identical set to (b) |

Withheld on (a): route claim + processing claim on the goods sentence (§2.4's "goes upriver
salted"), plus two Q rows and one X row. Matches receipt §1.2 exactly, including its refusal
of §2.4's word "ONLY" for (b) and of the bare "PASS" for (c).

One overstatement: §1.2 calls (a) "§2.4(a) exactly". §2.4(a) names ONE office fail (the
bailiff); the walker returns two (bailiff, priest). The second is entailed by an empty office
column, so it is lawful — but it is one more fail than the spec's table names.

## (b) THE CONTROLS — what would silence each
| control | silenced by | strength |
|---|---|---|
| four tables | a walker returning one set for all four — the test pins each set exactly AND `new Set(sets).size > 2` | strong |
| POSITIVE ×3 | any arm firing on them | **two of three are near-vacuous**: `control::pre-seed` fires NO arm at all (one not-executable C5 row); `control::lack` fires only a C4 note. Only `banded-count` exercises a masking path. |
| NL-4 gender | making the two texts differ | strong — the test pins the texts byte-identical and only the field differs |
| anti-vacuity ×4 | the breach text leaving the corpus | not silenced: `expect(entry).toBeTruthy()` reds with a named message |
| mutation ×3 | an arm that stopped working | not silenced: `expectPresentThenAbsent` asserts present-before then absent-after |
| composed fill vs `UNMOUNTED_BLOCKS` | the resolver going dark | strong: two independent witnesses, both 15, sets equal (I compared them) |

## (c) THE ANTI-VACUITY GUARD — CONFIRMED, and it cannot pass vacuously
`node probe3.mjs`, estate ground, 35-role roster:
- `VOICE_LINES::war::onset#4` (newsVoice line recovered = **97**) → `a totality over an open column`; cure → `[]`
- `general.generated.js::DS-GEN-1::occupation_legacy#2` → `exemption on a null column`; cure → `[]`
- `src/generators/factionDynamics.js:466` → `exemption on a null column`; cure → `[]`
- annex `RECEIPT_POOLS_DOSSIER_STATE.md:5233` → `exemption on a null column`; **cure → `[]` (I ran it; the test's mutation loop covers only the first three)**

Zero-breach corpus: the guard does NOT go quiet — `corpus.find(...)` returns undefined and the
assertion reds with "the breach text is no longer in the corpus". The census test also reds
(`failing > 4`). **Forward hazard:** that is the same reason the reconstruction wave will red
this file the moment it cures `newsVoice.js:97` or either exemption line. The cure is planned
work, so the gate needs a successor plan; the receipt does not name one.

## (d) THE TOTALITY ARM — reads the COLUMN, never the row
`entryWalker.js` armC4: `const col = ground.columns?.[column]; … else if (!col.closed)`. The
`rows` array is never consulted by any C4 limb — which is why (d) equals (b). `estateGround`
hard-codes `whoIsCounted: {closed: false}`; `institutionTable.js`'s own column carries
`closed: false` with the comment "FALSE FOREVER, ON EVERY SETTLEMENT". `settlementGround`
passes a table's columns through unchanged, so the only way to license a quantifier over
persons is a hand-built fixture (TABLE_CLOSED). **No shipped producer can license it.**
`scripts/mutation-sweep.sh:1031` plants `else if (false)` on this exact line, so the gate is
proved to notice its removal.

## (e) DOES THE FILE GATE THE INSTRUMENT AND NEVER THE CORPUS? — PARTLY
The header says it does not assert the corpus is clean, and that is true. But three
assertions bind the corpus in the other direction: the three breach TEXTS must remain
verbatim, `failing > 4`, and `failing < corpus.length / 4`. So the file gates the corpus's
*dirtiness*. §1.5's parenthetical "the walker gates the instrument, never the corpus" is
therefore imprecise.

## (f) THE COUNTS — recounted independently (`probe2`, `probe7`, `probe9`)
| receipt figure | my measurement |
|---|---|
| R1+R2 = 2,734 in 786 pools | 2,266 + 468 = **2,734**; **786** pools |
| R1 blocks 68 | **68** |
| annex rows 2,030, joined 2,030/2,030, unjoined 0 | **2,030 / 2,030 / 0**; leaves 2,266 − 2,030 = 236 ✓ |
| R5 374 lines / 397 sentences / 374 distinct | **374 / 397 / 374** |
| fill sites 96, 31 raw, 0 unresolved | **96**, 31 distinct file:line, **0** unresolved, 0 parameterised |
| bags 53 of 68; 15 = `UNMOUNTED_BLOCKS` | **53 / 15**, sets equal |
| office roster 35, no bailiff | **35**, no bailiff (5 `bailiff` hits in `src`, all in this lane's own new files or comments) |
| census 3,132 · 254 fails · 1,311 withheld · 1,399 not-executable · 128/114/13/3/3 | **identical, every row** |
| three hand bags (POW-5, GEN-18, ECO-11) | identical |

Gate re-run here: `Tests 19 passed (19)`, EXIT=0.

## (g) THE REFUSALS IN §1.6
1. (b) also fails the FIGURE — **legitimate**, grounded in CLERK-LAWS §1.4, reproduced.
2. "goes upriver salted" withheld on route/processing rather than "semantic" — **legitimate**;
   both withheld rows are present and name the field they wanted.
3. C5 office/status downgraded to WITHHELD — **legitimate but incomplete**: §2.2 C5 names four
   mechanisable typed facts (bands, office nouns, status words, **quantifiers**). `typedFactsOf`
   computes `quantifiers` and **nothing compares them** — not `armC5`, not `grammarWalker`'s
   C-sibling (which reads `bands` only). The quantifier limb is silently absent, not declared.
4. R5 374 vs PROBE_ALL 373 reported, not reconciled — **legitimate**; both units measured here.
5. Annex pool grammar not re-parsed; join by text at 2,030/2,030 — **legitimate**, reproduced.

---

# FINDINGS

## F1 · HIGH — the three "breaches the sitting did not name" are ground artefacts
Receipt §1.4 asserts: `reeve` is held "ONLY as part of an institution NAME … no NPC role
catalogue carries it", and banks three crier lines (`VOICE_LINES::authority::onset#3`,
`::relief#3`, `::fade#3`) as new C2 breaches. **Refuted three ways in the pinned dock:**
- `src/data/historyData.js:119` — `{ role: 'Reeve', title: 'overseer', priority: 6, minTier: 'hamlet' … }`
  inside `POWER_ROLES_BY_CATEGORY`, whose own header calls it a catalog of power-holder roles,
  exported and consumed by `economicGenerator.js:9` and `economy/upgradeOpportunities.js:22`.
  Its rows carry `role`/`title` — exactly the shape `deriveOfficeRoster()` harvests.
- `src/generators/roleCategory.js:34` — `reeve` in `ROLE_CATEGORY_KEYWORDS.government`.
- `src/generators/npcGenerator.js:1006` — `['reeve', govFaction]` in `ROLE_FACTION_MAP`.

The ground is derived from `FACTION_ROLES` + `factionRoleCatalog` only. Measured
(`probe10.mjs`): **25 of 37** office candidates are called absent by that ground, and **10 of
those 25 are in the estate's own `ROLE_CATEGORY_KEYWORDS`** — reeve, sheriff, constable,
magistrate, sergeant, governor, abbot, bishop, chaplain, guild master. `historyData` adds
`Tax Collector` and `Chief Magistrate` on top.

Consequence: the census row `3 C2 · an office the world does not hold` is composed entirely of
the three reeve lines, so **that row is 3 false positives and 0 true ones**, and the arm would
send the wave to rewrite three licensed shipped crier strings. The `bailiff` anti-vacuity
foundation is unaffected — bailiff really is absent everywhere.
Cure direction (not applied): the roster is the union of every role source, or the arm
withholds where a role-category keyword holds the noun.

## F2 · MEDIUM — the brief's named QUALIFY control passes silently
Brief car 1: *"the taste sample's [street] variant 'Both usages are precise' is the positive
control: it must WITHHELD/NOTE as unlicensed, never pass silently."* Measured (`probe9.mjs`)
on the real corpus entry `power.generated.js::DS-POW-5::governing body name…#2`:
`verdict PASS`, `fails []`, `withheld []`, `notes []`. `armQualify` returns early on
`sentences.length < 2`, and the clause is a trailing coordinate inside ONE sentence. No Q
assertion exists anywhere in the gate file, and §1.6 does not declare the omission.

## F3 · MEDIUM — `holds()` matches at a word boundary, `indexOf()` does not
`entryWalker.js` armC4 detects a quantifier with `holds(masked, q)` (word-boundary regex) and
then locates it with `masked.indexOf(q)` (plain substring). When the quantifier's letters occur
earlier inside another word, the arm reads the wrong tail and degrades a FAIL to a NOTE.
Demonstrated (`probe4.mjs`, TABLE_EMPTY):
- "All souls are counted here." → **FAIL** `C4/a totality over an open column`
- "The wall is old, and all souls are counted here." → **NOTE** `a quantifier over an unnamed column`
- "…keeps its hall, and any household may be counted." → NOTE (the `any` inside "company")
- "The roll is not kept, and no households are counted." → NOTE (the `no` inside "not")

Corpus reach today (`probe5`/`probe6`): 69 of 3,132 entries carry at least one mis-located
quantifier (70 occurrences); exactly one changes column resolution, and it lands on a CLOSED
column, so **the shipped census figure 13 is unchanged**. The defect is latent, not live —
but it sits in the flagship arm the four fixtures exist to prove. `bandReadings` uses the same
`holds` → `indexOf` pair.

## F4 · LOW — two of the three positive controls are near-vacuous
`control::pre-seed` engages no arm (`fails/withheld/notes` all empty; one not-executable C5
row). §1.3's claim that the positive set proves "a walker that reds on a licensed sentence has
the detector doing the judging" rests on `banded-count` and the gender fixture alone.

## F5 · LOW — "(resource conditional)" does not distinguish anything
`byBlock.get('DS-GEN-18').conditional` = `["good","institution","resource","settlement"]` —
all four slots, not resource alone. The test's `toContain('resource')` passes either way.

## F6 · LOW — §1.9's "imported today only by a test" has drifted at the tip
True at `950c0c204`. At `74a1aa0e8`, `src/domain/prose/grammarWalker.js:45-46` imports
`entryWalker.js` and `entryLexicons.js`. No product path imports either (only `grammarWalker`,
its own test, and `scripts/mutation-sweep.sh`), so THE PROMISE claim survives intact.

## THE PROMISE — held
No corpus byte, pool, key or index moves; `drawVariant` is not imported by and does not import
any car-1 file; the three `src/` leaves are display-side and reachable only from tests.
