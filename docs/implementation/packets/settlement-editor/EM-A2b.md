# Settlement editor / EM-A2b — the SIX world-derived pools, and the one world fact the estate still has no canonical option list for

- **Status:** `READY`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
  ⭐⭐ **THE BLOCK IS RE-AIMED, NOT RESOLVED — MEASURED AT `583f8f644` BY THIS PRE-PROOF.** This
  packet was compiled BLOCKED on `worldFact.tradeAccess` (no canonical option list; the wizard's
  six disagreeing with the generator's five). EM-P3 IS LANDED and reaches the SAME measured
  contradiction independently (its P-4: *"TRADE ACCESS HAS NO CANONICAL LIST ANYWHERE … This is a
  MINT, not a move"*) — but it does **not** mint the list. ⛔ Version 4 said it did; that is
  REFUTED at the tip. `src/domain/worldFactOptions.js` exists, its `WORLD_FACT_SOURCES` holds
  **SEVEN** keys, and its own comment reads *"Trade access is EM-P3b's row … EM-P3b mints
  `TRADE_ACCESS` … and adds the eighth key here"*; `TRADE_ACCESS` is exported NOWHERE under `src`.
  **So R1 stands, re-aimed at `EM-P3b` (UNWRITTEN), and this packet is DRAFT with no
  `worldFact.tradeAccess` row, no source row and no arm** — the contract was always right; only
  version 4's prose was wrong. §2 is retained as the finding's record.
- **Packet version:** 7
  - ⭐⭐ **VERSION 7 (THE CHAIR, JUDGMENT 138; the walker's own red at the version-6 build, queue window 35 job 6, 2026-09-21 18:25–18:37 EDT; cut 2026-09-22 by the successor chair, session cce01f87). NO ARM, NO CASE, NO TITLE AND NO CONTRACT MOVES; ONE TEST ROW IS ADDED.** The version-6 build was GREEN on every sealed check, every red-first and every instrument but ONE: `tests/lint` whole convicted `src/domain/edit/pools.js` in `tests/lint/ruinFilterRoster.walker.test.js` — *"reads the raw .institutions roster but neither routes through the ruin filter nor is exempted"* — and that walker's discovery-count arm read **94** where its pin says **93**. The cause is the `npc.role` row's read, `rosterField(world?.institutions, 'role', 'name')`: the walker source-scans every `src/domain` file whose CODE reads `.institutions`, and EM-A2a's landed leaf read none (its `institutions` stood only in a typedef comment, which `codeOnly` blanks). No earlier version of this packet named the walker (measured: zero occurrences in the version-6 body and capsule). **RULED EXEMPT, NOT ROUTED.** The pool offers a DM the roles the record already holds as a SELECTION LIST — the *name-lookup* class the walker's own header names, and the reason `src/domain/events/targetRosters.js` and `src/domain/tableLedger.js` already hold: it answers *"what may a human name for this field"*, never *"what capacity does this settlement have"*. A ruined institution's role is a legitimate answer for an NPC (the former warden of a burned keep), and `liveInstitutions()` would silently drop it; routing would also add a THIRTEENTH import to a leaf whose header forbids one and whose fence A7 pins at twelve. **THE ONE NEW ROW:** `TEST tests/lint/ruinFilterRoster.walker.test.js` — one `RUIN_AGNOSTIC_EXEMPT` entry with its reason and the count arm re-measured 93 → 94; no pattern, quarantine row or other exemption moves. The walker file's own `it` count is unchanged, so the lighting delta is unchanged (still EIGHT arms, EIGHT cases, `+8` titles). Three paths, was two (§3, §7, §10, the capsule). LAW for the sixth amendment (the compile's instrument list): a member whose `src/domain` leaf gains a `.institutions` read runs `tests/lint/ruinFilterRoster.walker.test.js` at compile against its planted leaf and declares the disposition — route or exempt — as a §7 row. Also in this version: the placed body's `Last revalidated` stamp, which the version-6 placement left at version 5's value (2026-09-19, `d31af2cee`; read by nothing), is set to the kit's `2026-09-21 EDT, 04ac6520e`.
  - ⭐⭐ **VERSION 6 (THE CHAIR, JUDGMENT 134; the RE-SHAPE, 2026-09-21, measured at the tip
    `04ac6520ee79f749435587b2e61b585cb5381c09` on `em-train-12-2026-09-21`).** Version 5 was
    pre-proved against EM-A2a's PREDICTED shape and not its LANDED one, and its build lane STOPPED
    before the seal on two measured contradictions. Both are cured here, and **no arm, no case and no
    title moves: still EIGHT arms (B1–B8), EIGHT cases, `+8` titles.**
    1. ⛔ **THE `deity` POOL NO LONGER IMPORTS A DISPLAY SEAM — IT READS THE RECORD.** Version 5's
       §6 required `pantheonStandings(world).map(e => e.id)`, and that symbol exists at exactly ONE
       address, `src/domain/display/pantheonDepth.js`, which EM-A2a's LANDED fence
       (`tests/domain/editPools.test.js:89`, `/^src\/domain\/display\//`) convicts by pattern and
       which this leaf's OWN header forbids (*"it never reads a display seam"*). Version 6's row is
       `world?.pantheon && typeof world.pantheon === 'object' ? Object.keys(world.pantheon) : EMPTY`
       — the same record read `npc.role` and `power.holder` already use. **MEASURED EQUAL** to the
       display read after `poolValues`' own normalization across EIGHTEEN world shapes, degenerate
       ones included, with a control that discriminates (§5, P1). ⭐ It reads STRICTLY LESS than the
       display seam did — no `tier`, no `seats`, no `fromMajor` — so the deity doctrine is served
       better, not merely as well. **NO FENCE IS WIDENED, NO `FORBIDDEN` PATTERN IS NARROWED, AND
       `src/domain/display/**` STAYS BANNED AT FULL STRENGTH.**
    2. ⛔ **`worldFact.resources` NOW READS THE ENGINE'S GATE, NOT THE UNGATED CATALOGUE.**
       `getCompatibleResources(route, terrain)` returns the WHOLE 33-row catalogue ANNOTATED with a
       `compatible` boolean — it filters nothing. Version 5's `.map(r => r.key)` therefore answered
       **the same 33 keys for every route and terrain**: the gate never fired, B5's "non-empty
       symmetric difference" was **0** and would have RED at the build, and the pool would have
       offered `deep_harbour` at a desert settlement. Version 6 reads
       `.filter((r) => r.compatible).map((r) => r.key)` — **6** at `('port','coastal')`, **19** at
       `('isolated','desert')`, **16** at the `('road', null)` fallback, symmetric difference **21**.
       ⭐ And this is the wizard's OWN option set with no second copy: `ConfigurationPanel.jsx:135`
       filters on the same flag and writes `compatible.map(r => r.key)` at `:146` — the engine gate
       and the wizard predicate are **set-equal across all 54 route × terrain combinations**,
       measured (P10, P11). B4's figure moves 33 → 6 and B5's premise becomes true.
    3. **EVERY EM-A2a ARM THIS LANDING MOVES IS NAMED IN §7 ROW 2 WITH ITS EXACT NEW VALUE** — NINE
       edit points across FIVE landed arms (A1 ×4, A3 ×1, A5 ×1, A6 ×1, A7 ×2), each re-computed at
       the tip by replicating the landed file's own helpers (P2). ⛔ §11's "a fourth assertion in A1
       is a STOP" is DISCHARGED BY NAME by judgment 134 and re-aimed at a FIFTH.
    4. **THE TWO STALE STAMPS, CORRECTED.** The `Preamble` row carried *"TO BE STAMPED BY THE
       CHAIR"* and the interim-rules row asserted the FOURTH amendment was *"still the tree's live
       text"*. The FIFTH amendment landed with train EM-T11: the preamble MEASURES
       `fdecd426828665cad2dfaf872871f29f46fa4816e1bd4c43c20ccd84dacc9e7c` at this tip, and its own
       text retires the interim sheet (*"a packet compiled after this amendment carries no interim
       row"*), so **the interim-rules row is DELETED** rather than re-pointed, here and in the capsule.
    5. **THE COMBINED `pools.js` FIGURE IS NOW MEASURED, NOT ESTIMATED: 101 of 250** under §11's own
       instrument (eslint's `Linter`, `skipBlankLines` + `skipComments`) — the landed file is **56**
       and this packet's planted six rows add **+45**. The ≈230 estimate is kept as annotated
       history: it was never executed, and R3's "about twenty lines of margin" was wrong by ~129
       lines. §11's STOP and the EM-A2c contingency are unchanged.
    6. **RE-ADDRESSED AT THE TIP** (the citation law, judgment 124): all **9** `<path>:<line>`
       citations in this body AND in the capsule resolve and name their symbol at `04ac6520e`,
       **0 past EOF**, measured with the walker's own `citationsIn` / `buildTargetIndex` (P7); every
       `requiredSymbols` row found verbatim (counts 1,2,1,1,1,1,1,1,1 / 1,1,1); P2.8's claim that the
       register grep "returns nothing for either" is CORRECTED — there is ONE hit,
       `tests/lint/entropyRootCensus.walker.test.js:813`, prose with no line address, so no
       re-address is owed; the stale sentence three lines below it is RAISED as **R6**.
    ⛔ **No pool id, no acceptance COUNT, no budget cap, no non-goal, no change path and no `checks`
    entry moved**, and §2's BLOCK is untouched.
  - ⭐ Version 5 (the independent PRE-PROOF, 2026-09-21, read tip `583f8f64448b21a58fa64d0b757e93ffffcc7c2b`
    = train EM-T10's promotion commit) makes the packet measurable against the tree EM-A2a will land on.
    **The one contract edit is §7's TEST row and B1: EM-A2a version 7's A1 arm asserts the
    eleven-and-eleven EXACTLY, so this packet's landing must RE-SPELL that arm's three assertions,
    not merely append beside it** (judgment 106 item 2). Everything else is a stale fact repaired or a
    measurement made executed: the COMBINED `pools.js` figure re-derived from EM-A2a **version 7**
    (≈140, not version 4's ≈148) to **≈230 of 250**; version 4's claim that EM-P3 minted
    `TRADE_ACCESS` REFUTED at the tip and re-aimed at EM-P3b; the interim-rules row corrected from
    eleven rules to **seventeen**; the Status value backticked; the lighting delta EXECUTED by the
    walker's own `measureCensus`; interim rules 13, 14, 15 and 17 discharged with their commands; the
    three symbols this packet's deliverable CALLS added as `_pendingRequiredSymbols`; `home` and
    `authorizedBy` written on every acceptance case; `checks` re-ordered so the validator runs LAST.
    ⛔ **No pool row, no acceptance COUNT, no budget cap, no non-goal and no change path moved**, and
    §2's BLOCK is untouched.
  - ⭐ Version 4 (ESTATE-REPAIR-4b, 2026-09-20, read tip `bdbf7c89c2569679bcccdb188d5d831ccfaa0e6d`)
    applies the chair's ESTATE-REPAIR-4 **ruling 1** (judgment 54): `worldFact.goods` and
    `worldFact.services`, their two source rows, acceptance **B4**'s two set-equalities and risk
    **R4** LEAVE this packet and ride **EM-P3c**'s sitting (§1.8), so the packet's own estimate is
    re-derived from §3's decomposition to **≈90**, the COMBINED `pools.js` figure to **≈238 of
    250**, and every pool count that moves with the two rows follows. ⛔ **No contract, budget,
    acceptance COUNT, change row or non-goal moved beyond the two rows the ruling names**; §2's
    BLOCK and its two unblock paths are untouched, and the "never squeeze" STOP at §11 stands.
  - ⭐ Version 3 (ESTATE-REPAIR-4, 2026-09-20, read tip `bdbf7c89c2569679bcccdb188d5d831ccfaa0e6d`)
    adds ONE pool row — **`power.holder`**, the row EM-A1 version 5's BLOCK-4b says "EM-A2b's
    pre-proof owes" — to §5, §6, §7, §8, a new acceptance case **B8** and the registration ledger;
    brings the packet under `COMPILE-RULES.interim.md` with the header row it had **omitted
    entirely**; and corrects three counts that were stale before this lane touched them (§6's
    "SEVEN rows", B1's "eighteen ids" and §12's "eighteen pools" all counted EM-A2a at ELEVEN rows
    while revision 2 had left it at TEN). ⛔ No other contract, budget, required symbol, change row
    or non-goal moved; **§2's BLOCK and its two unblock paths are untouched.** ⚠ **The COMBINED
    `pools.js` estimate crossed its 250 cap AS OF VERSION 3 — R3**, which version 4's ruling 1
    resolves at ≈238.
  - Version 2 is the DOCS repair only (ESTATE-REPAIR-2, 2026-09-20): §7's row for the lighting
    walker — a path this packet does not edit — was deleted so §7 and the capsule are set-equal.
    ⛔ **No contract, budget, acceptance case, required symbol or non-goal moved.**
- **Verified base:** `em-t12-a2b-2026-09-21` at `efd0eb4481669fce0fa00c356fef9399ab374d17`
  ⭐ **RE-MEASURED AT VERSION 6.** `d31af2cee` (the compile base, the chair's ruling (6)) and
  `efd0eb448` (train EM-T11's landed tip) are both ancestors of this sha, executed. EM-A2a is LANDED
  here at version 10, so this packet's two `MODIFY` targets are PRESENT and git-clean and every
  contract claim below is measured against the file that actually exists rather than against a
  predicted one. ⛔ This row and `Status` are the two rows `tools/place-train.py` re-stamps; the
  capsule agrees with them.
- **Last revalidated:** 2026-09-21 EDT, `04ac6520e`
- **Depends on:** **`EM-A2a`** (LANDED) — this packet APPENDS rows to A2a's `POOLS`, uses its
  `poolValues` / `rollFrom` machinery unchanged, and **RE-SPELLS A2a's A1 totality arm**; A2a lands
  first, on train EM-T11. Also **`EM-A1`** (LANDED at `e7bdb944b`: its eleven `kind: 'pool'`
  declarations are what A1's totality arm is held against) and, transitively through EM-A2a, **`EM-P4`**.
  ⛔ **`EM-P3` is LANDED and gives six of the seven world facts a domain-reachable address, but it does
  NOT mint `TRADE_ACCESS`** — that is **`EM-P3b`**, UNWRITTEN, and it gates only §2's blocked row,
  which this packet does not write. **MEASURED at `583f8f644`: EM-A2b's own validator errors name EM-A2a's
  two CREATE targets and NOTHING ELSE; with those two paths present and EM-P4 ABSENT the validator is clean.**
- **Collision group:** **`EM-A2a`** — one shared production file, `src/domain/edit/pools.js`, and
  one shared test file, `tests/domain/editPools.test.js`. ⛔ **They must serialize**, and this
  packet's arms re-assert A2a's totality so a dropped row reds. Measured: all 182 registered
  packets are TERMINAL, so nothing in the manifest reserves either path.
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: `NAMING_DATA` 11 cultures, all
  name-complete; `pantheonStandings` returns `[]` when the pantheon is absent;
  `getCompatibleResources('port','coastal')` → an **array of 33 objects** each carrying `key`,
  `label`, `desc`, `commodities`; `GOODS_CATEGORIES` 7 keys; `INSTITUTION_SERVICES` **285** keys;
  `TERRAIN_ROUTE_POOLS` is **not exported** and holds five values; the wizard's trade menu holds
  six. Census tuple `2645 / 383 / 2262 / 25009 / 6670` — **EXECUTED HISTORY, AS OF `d31af2cee`**
  (interim rule 9's as-of mark; rewriting it would falsify a receipt). ⭐ The LIVE base this packet
  predicts against is measured at §7 P2.1. No test was run.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: `fdecd426828665cad2dfaf872871f29f46fa4816e1bd4c43c20ccd84dacc9e7c`)
  ⭐ **MEASURED with `shasum -a 256` at this packet's own read tip `04ac6520e`** (§P5: this file's
  hash is a DELTA a member measures, never a figure copied from a brief or a sibling). ⛔ **THERE IS
  NO INTERIM-RULES ROW, BY THE AMENDMENT'S OWN INSTRUCTION.** The FIFTH amendment landed with train
  EM-T11 and retires `COMPILE-RULES.interim.md` in its own opening — *"every one of its seventeen
  rules is permanent law here, in `PACKET_STANDARD.md` or in `PACKET_TEMPLATE.md`, so a packet
  compiled after this amendment carries no interim row and no clause saying which of the two governs
  where they disagree."* Version 5's row named the FOURTH amendment's hash and called it *"still the
  tree's live text"*, which is false at this tip; it is deleted rather than re-pointed, here and in
  the capsule.

---

## 1. Reconciled authority

1. **THE CHAIR'S RULINGS, 2026-09-19** (§934.36 addendum, §934.46): **(4)** names take the
   `instantNpc` shape — a root-composed PRNG with the culture bag passed in; **(5)** the pools gain
   the world-facts pools, *"the wizard's own option sets for terrain, culture, trade access,
   resources, goods, services, stressors — find the wizard's canonical option lists by symbol and
   name them; **never a second copy**"*, with the pre-declared A2a/A2b split used if over the cap;
   **(6)** the base stays `d31af2cee`; **(8)** the census counts test files.
2. **ODQ §934.45 / design §14 FINAL** — *"the editor edits them on a fifth card, whose pools are
   the wizard's own option sets"*; a change never re-rolls, it re-derives with pins.
3. **THE PROMISE**; the **deity doctrine** — faith is culture, never theology, so the deity pool
   reads the WORLD's pantheon and holds no premade list.
4. **design §12.7 GOVERNS** — the generator's catalogue, never the display seams.
5. **`EM-PREAMBLE.md`** §P2–§P5 (HZ-PRNG), §P8 — cited by hash.
6. Live code at `d31af2cee` — which refutes ruling (5)'s premise for one of the seven world facts.
7. ⭐ **EM-A1 VERSION 5's BLOCK-4b, and the chair (judgment 33; ESTATE-REPAIR-4):** `power.holder` is
   **this packet's** row — *"it is world-derived — the faction roster — and A2b owns the
   world-derived pools"*. Design §2.2 names the pool (*"powers → the power structure's seats"*), so
   its absence was an OMISSION, not a scope line.
8. ⭐⭐ **THE CHAIR'S ESTATE-REPAIR-4 RULING 1 (2026-09-20; judgment 54) — THE TWO DIALS LEAVE THIS
   PACKET.** EM-A1 version 5's **BLOCK-7** (judgment 33) took `goods` and `services` off the fifth
   card for the first wave — they are **not facts the record holds** (`resolveConfig` lifts
   `_goodsToggles` / `_servicesToggles` into context keys; `record.config` carries neither over 36
   settlements; they live on the save's `toggles` column) — so a pool for either is a pool for a
   field **nothing declares**: premature by the standard's rule 3 and an orphan for EM-A3's census.
   **RULED: the two pool rows, their two SOURCE rows (`GOODS_CATEGORIES`, `INSTITUTION_SERVICES`),
   acceptance B4's two set-equalities and risk R4 LEAVE this packet and RIDE `EM-P3c`'s sitting** —
   the measure-first member chartered for where the two dials live through save, load and
   regenerate. ⛔ **Nothing about them is re-decided here and no arm is written for either**; an arm
   would be an instruction. `worldFact.resources` is untouched by this ruling and stays.

**Resolved contradictions:**

- "names from the culture's generator" → **REFUTED** and cured by the chair's ruling (4): no
  exported, seedable name generator exists (the only export draws on the ambient fail-closed
  `rngContext`), so the pool reads the generator's name **DATA** and rolls on its own stream, the
  `instantNpc` shape. Closed by ruling.
- "the wizard's canonical option lists" → **REFUTED FOR `tradeAccess` ONLY.** §2.

---

## 2. ⛔ THE BLOCK — the smallest measured contradiction

**The premise:** ruling (5) and design §14 say each world-fact pool is *the wizard's own option
set*, named **by symbol**, and **never a second copy**.

**The measurement.** For six of the seven world facts a canonical symbol exists and this packet
names it. For **trade access it does not**, and the two live sets **disagree**:

```
$ sed -n '325,331p' src/components/ConfigurationPanel.jsx          # the WIZARD's menu
  <option value="random_trade">Random</option>
  <option value="road">Road</option>          <option value="river">River</option>
  <option value="port">Port</option>          <option value="crossroads">Crossroads</option>
  <option value="isolated">Isolated</option>  <option value="mountain_pass">Mountain Pass</option>

$ node -e '<extract TERRAIN_ROUTE_POOLS from src/generators/steps/resolveConfig.js>'
["crossroads","isolated","port","river","road"]
exported? false
```

Three facts follow, and each is load-bearing:

1. **The wizard's set lives only as JSX `<option>` literals** in a component. Reading it would
   make `src/domain/edit/pools.js` import `.jsx` — a layering violation (§P4: `src/domain/edit/**`
   imports nothing from `src/components`) — and re-typing it is precisely the **"second copy"** the
   ruling forbids.
2. **The generator's set is a module-PRIVATE `const`** (`TERRAIN_ROUTE_POOLS`, not exported), so
   there is no symbol to name.
3. **The two sets are not the same set.** The wizard offers **six**; the generator rolls **five**.
   `mountain_pass` is offerable in the wizard and is drawn by the generator **never** — so even
   "use the generator's five" would silently narrow a menu the owner ships today, and "use the
   wizard's six" would put a value into a pool no chooser has ever produced.

⛔ **This is an authority disagreement between two higher sources — the shipped wizard and the
shipped generator — and the standard is explicit: the packet is BLOCKED and a coding agent never
adjudicates it.** No instruction for `worldFact.tradeAccess` is written below.

**The two unblock paths, costed, so the ruling is one read:**

| path | act | cost | consequence |
|---|---|---|---|
| **U1 — mint the canonical list** | `export const TRADE_ROUTE_OPTIONS` in `src/generators/steps/resolveConfig.js`, derived from `TERRAIN_ROUTE_POOLS` **plus** `mountain_pass` with its reason recorded, and re-point the wizard's six `<option>`s at it | a production MODIFY of a generator file **and** a component — outside this packet's zero-modify posture, so **its own small member** | one truth; the wizard's menu and the pool can never drift again; the `mountain_pass` gap becomes visible rather than latent |
| **U2 — rule the pool the generator's five** | the pool is `TERRAIN_ROUTE_POOLS`' five, exported as-is; `mountain_pass` is recorded as a wizard-only value the editor does not offer | one export line | the editor offers less than the wizard, deliberately, with the reason on record |

⚠ **`mountain_pass` is an out-of-scope finding either way** and is recorded here without
investigation, per the edge-case budget: a value the wizard offers that the generator never rolls
is a pre-existing estate condition this packet neither caused nor may repair.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families / writers / flags / surfaces | `0` | ≤1 each |
| Direct production consumers | `0` — lands DARK | ≤2 |
| New logic-bearing production leaves | `0` — **it extends A2a's leaf** | ≤2 |
| Existing logic-bearing production files modified | **`1`** (`src/domain/edit/pools.js`, A2a's) | ≤3 |
| Handwritten files total | `3` (+1 deferred census row; ⭐ v7: the ruin-filter walker's TEST row) | ≤12 |
| New/changed effective production lines | ⭐ **+45 MEASURED (6 pools + 2 shared readers + 1 import)**; ≈90 was the estimate | ≤400 |
| Effective lines per new leaf | `n/a` — creates no leaf | ≤250 |
| **Combined `pools.js` after A2a + A2b** | ⭐⭐ **101 of 250 — MEASURED AT VERSION 6, not estimated; see R3** | ≤250 |
| Delta in a shared/hot file | `0` — `pools.js` is a SIBLING's file, not a hot-list file | ≤15 |
| Acceptance cases | `8` | ≤8 |

Overrides approved before dispatch: `NONE`. **HOT FILES: none named** — `pools.js` is new in this
train and carries no `scripts/.size-baseline.json` entry and no ceiling of its own.

⛔⛔ **THE COMBINED FIGURE IS THE ONE THAT BINDS, AND AT VERSION 6 IT IS MEASURED RATHER THAN
ESTIMATED.** Executed at `04ac6520e` with **§11's OWN INSTRUMENT** — eslint's `Linter` running
`max-lines` with `skipBlankLines: true, skipComments: true` — over the landed file and over a
copy-only estate carrying version 6's six rows: **EM-A2a's landed `pools.js` measures 56 effective
lines; with this packet's rows it measures 101. The combined figure is 101 of 250, with about
149 lines of margin.** ⚠⚠ **THE ≈230 ESTIMATE WAS NEVER EXECUTED AND IS WRONG BY ABOUT 129 LINES**
— the estimates counted added SOURCE lines, and §11's instrument skips every comment and blank,
which is most of this file. The estimate history below is KEPT because it is why ruling 1 was made
(§P5: a record is annotated, never rewritten), but **R3's "about twenty lines of margin" is
withdrawn as a live figure**; §11's STOP and the EM-A2c contingency are unchanged, and nothing is
squeezed. The historical derivation, unaltered: re-derived by
ESTATE-REPAIR-4b at `bdbf7c89c` from each packet's OWN decomposition, never from a quoted figure:
**EM-A2a ≈140** — its VERSION 7 §3 figure, re-read at the pre-proof tip; version 4's ≈148 fell to
≈140 when two frozen literal vocabularies became imports — plus **this packet's ≈90** (below, after
the two rows left with ruling 1) is **≈230 against the 250 cap** — ⭐ about twenty lines of margin,
and an ESTIMATE over code that does not exist, not a measurement. ⚠ **Version 4 spelled ≈238 from
EM-A2a's version-4 ≈148**; EM-A2a version 7's own R4 already states the combined figure as ≈230, and
this row now agrees with its sibling rather than with a superseded version of it.
⚠ **The history is kept because it is why the ruling was needed:** version 3 read **≈256 of 250** and
was OVER; the ≈244 before it was stale in two ways, quoting A2a at ≈147 — its PRE-revision-2 estimate,
revision 2 having dropped `stance` and left ≈143 — so the "six lines of margin" were ten and the two
new rows then spent sixteen. ⭐ **EM-A2c STAYS a pre-declared contingency and is RE-AIMED by the same
ruling:** with goods and services gone, the separable rows are `worldFact.resources` (≈12, the one
route/terrain-gated row that remains) and, once R1 is ruled, `worldFact.tradeAccess`. ⛔ **Do not
squeeze the rows to fit** — the chair's own instruction, and the estate's hot-file lesson — and
**§11's STOP stands unchanged**: if the figure eslint's `Linter` measures at implementation crosses
250, the split is taken, never a squeeze.

Decomposition of the ≈90: two name rows + the culture resolver ≈ 26; `npc.role` derivation ≈ 14;
`deity` ≈ 6; ⭐ **`power.holder` ≈ 11** (the world-derived rate EM-A2a §3 states, and the same shape
`npc.role` already uses — a roster walked, one field taken, normalized by A2a's helper);
`worldFact.resources` ≈ 12; row scaffolding and imports ≈ 21 (26+14+6+11+12+21 = 90).
⚠ **The scaffolding term is NOT re-prorated**: two rows and their two imports left with ruling 1, so
≈21 is an UPPER bound and ≈90 is the conservative figure. ⛔ **`worldFact.goods` (≈6) and
`worldFact.services` (≈12) are no longer costed here — they ride EM-P3c (§1.8).**
**`worldFact.tradeAccess` is NOT costed either — it is BLOCKED.**

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-A2b
```

⭐ **MEASURED AT VERSION 6, AT THE TIP `04ac6520e`:** **`CREATE` targets NONE**; **non-CREATE
targets `src/domain/edit/pools.js` and `tests/domain/editPools.test.js` BOTH PRESENT AND
git-clean** — EM-A2a is LANDED here at version 10, so this packet's ancestry check and its
dependency check are both satisfied; all nine `requiredSymbols` rows resolve verbatim (counts
1,2,1,1,1,1,1,1,1) and the three `_pendingRequiredSymbols` rows now resolve too (1,1,1), so they
promote at placement. The tree's own `node scripts/implementation-packets.mjs validate`, run over a
copy-only estate carrying this version's body and an entry rebuilt from its capsule, exits **0** at
`valid: 215 packets (4 READY)` with **zero EM-A2b rows**.

⛔ **Version 5's line *"dispatch is refused while the status is BLOCKED … when the chair rules R1 and
the status moves"* is STALE and is withdrawn.** Judgment 111 (2) ruled that **R1 no longer gates
READY**: no pool row, no source row, no arm and no budget line is written for
`worldFact.tradeAccess`, so the block gates a LATER member and never this one. The status value in
the kit is `DRAFT` and `tools/place-train.py` stamps it `READY` at placement, together with
`Verified base` — the two rows the kit and the placed entry are allowed to differ on.

⚠ **A2a and A2b share both files and must serialize.** A2a is terminal at this tip, so the
duplicate-path refusal is cleared; dispatching while a sibling of the same train claims either path
would red `validate:packets`.

---

## 5. Verified tree contract

Every row found BY SYMBOL at `d31af2cee`; commands in `EM-A2b.evidence.md`.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Name DATA | `src/data/namingData.js` | `NAMING_DATA` | Executed: **11** culture keys, **all 11** carrying `maleNames`, `femaleNames`, `surnames`; plus `settlementPrefixes` / `settlementSuffixes`. 4,038 lines / ~68.6 kB | The name source — **passed in as `world.namingData`**, never imported (bundle law, §6) |
| Roll precedent | `src/domain/npc/npcOps.js` | `instantNpc`, `pickFromNaming` | `createPRNG(\`instant-npc:${seed}\`)` — a ROOT composition; `pickFromNaming(rng, cultureData, gender)` takes the culture bag as a PARAMETER | **Copy exactly** (chair ruling 4) |
| ⛔ The refuted export | `src/generators/npcGenerator.js` | `generateSettlementName` | `(r = 'germanic') => string`, whose body reads `_rng()` = `random` from `src/kernel/rngContext.js` (`:16`) — the ambient context, which **throws** with none active and **steals a world draw** with one. `pickFirst` is not exported at all | ⛔ Called nowhere. Named so the refutation is findable from the manifest |
| ⛔⭐ **THE EQUIVALENCE ANCHOR — NOT AN IMPORT** | `src/domain/display/pantheonDepth.js` | `pantheonStandings` | `(worldState) => Array<{id, seats, wins, losses, tier, fromMajor}>`; it guards `worldState?.pantheon && typeof === 'object'`, keys the ledger with `Object.keys`, normalizes each entry and sorts by descending seats then codepoint id; **`[]` when dormant or absent**. ⭐ **MEASURED at the tip: this is the ONLY address under `src/` that exports the pantheon roster** — `git grep pantheonStandings -- src` finds one definition and four callers, and no non-display alias exists | ⛔ **CALLED NOWHERE BY THIS PACKET; IMPORTED NOWHERE.** The leaf may not reach it — EM-A2a's LANDED fence bans `/^src/domain/display//` by pattern (`tests/domain/editPools.test.js:89`, asserted empty by A3 and A7) and `pools.js`' own header bans a display seam in prose. It is a `requiredSymbols` row because **§6's `deity` row is justified BY ITS EQUIVALENCE TO THIS FUNCTION**: if this dormancy contract moved, the record read would no longer be the same answer and the row would need re-ruling (§11's STOP). The same idiom as the refuted-export row above: named so the reasoning is findable from the manifest |
| ⭐ **Resource legality — THE ONE NEW IMPORT** | `src/domain/resourceTerrainCompatibility.js` | `getCompatibleResources` | `(route, terrain = null) => Array<{ key, compatible, incompatibleReason } & …>`. ⛔ **IT FILTERS NOTHING.** Executed at the tip: it returns the WHOLE catalogue — **33 objects at every route and every terrain** — each ANNOTATED with a `compatible` boolean and an `incompatibleReason`. THE GATE IS THE FLAG, NOT THE ARRAY. Executed: `.filter(r => r.compatible)` gives **6** at `('port','coastal')`, **19** at `('isolated','desert')`, **16** at `('road', null)`. Its own header records why it lives in `src/domain` — the layering move that lets a domain reader take it without opening a `domain → generators` edge — and `src/generators/terrainHelpers.js:12` re-exports it for the generator side | `worldFact.resources`, and **the leaf's TWELFTH import: the only address this packet adds to EM-A2a's eleven**. ⭐ Read `.filter((r) => r.compatible).map((r) => r.key)` — the flag, then the key, never `.label`. ⭐⭐ **THIS IS THE WIZARD'S OWN OPTION SET WITH NO SECOND COPY** (ruling 5): `src/components/ConfigurationPanel.jsx:135` filters on the SAME flag and `:146` writes `compatible.map(r => r.key)` into `config.nearbyResources`; the engine gate and the wizard predicate are set-equal across **all 54 route × terrain combinations**, measured |
| ⛔ **THE BLOCKED SOURCE** | `src/generators/steps/resolveConfig.js` | `TERRAIN_ROUTE_POOLS` | **NOT EXPORTED** (measured); holds five values `crossroads, isolated, port, river, road`, against the wizard's six | ⛔ **Unreachable. §2's block.** Named so the contradiction is findable from the manifest |
| ⭐ **The seat, and what fills it** | `src/generators/power/rulingStructure.js` | `generatePowerStructure` — the return at `:787` | `governingName: (factions.find((f) => f.isGoverning) \|\| {}).faction \|\| null`, with the file's own comment *"it must always name the faction entry that carries isGoverning"*. ⇒ the seat's value is drawn from `powerStructure.factions[]`, by each entry's `faction` field | `power.holder` — the CANDIDATE SET is the world's own faction roster, read off the record. ⛔ Never a catalogue: there is no module that holds this world's faction names |
| ⭐ **The seat is a rename surface** | `src/domain/factionRename.js` | `FACTION_RENAME_SURFACES` | Executed at the read tip: **32 rows**, **exactly one** naming the seat — `{ path: 'powerStructure.governingName', kind: 'key', why: 'the exact name of the faction holding the governing seat' }` | The proof that the holder IS a faction name, not an id or an NPC — which is what makes the pool the roster (EM-A1 v5's V-9) |
| Stable order | `src/domain/deterministicSort.js` | `export const compareCodepoint` | The estate's one sanctioned, locale-free string order. Executed at the read tip: present verbatim | Every pool's order, and the order of A1's two residue lists |
| ⭐ **The totality arm's other half** | `src/domain/edit/fieldDeclarations.js` | `export const FIELD_DECLARATIONS` | **LANDED (EM-A1, `e7bdb944b`). Executed at `583f8f644`: 17 declarations, of which exactly ELEVEN are `kind: 'pool'`** — `faction.category`, `institution.class`, `institution.state`, `npc.role`, `npc.status`, `power.holder`, `worldFact.culture`, `worldFact.monsterThreat`, `worldFact.resources`, `worldFact.stressors`, `worldFact.terrain`. **Three of them — `npc.role`, `power.holder`, `worldFact.resources` — are this packet's**, which is exactly why EM-A2a's A1 arm calls them PENDING and why this packet's landing shrinks that residue to `[]` | ⛔ Read by A2a's A1 arm, which this packet RE-SPELLS (§7 row 2), so it is a **`requiredSymbols` row of this packet's** (row 9, new at version 5). The production leaf imports it nowhere |
| **A2a's machinery** | `src/domain/edit/pools.js` | `export const POOLS`, `export function poolValues`, `export function rollFrom` | ⚠ **Does not exist at the read tip** — EM-A2a creates it, and this packet's two `MODIFY` rows are its two CREATE targets. ⭐ Held against EM-A2a **version 7**: `rollFrom(poolId, world, seed, entryId, n)` — FIVE parameters, `seed` a PARAMETER, matching EM-D0d's landed consumer binding `(seed, entryId, n) => rollFrom(declaration.pool, world, seed, entryId, n)` | Extend; never fork a second `poolValues` or a second stream. ⛔ **The three symbols are `_pendingRequiredSymbols` rows** (interim rule 3): the deliverable CALLS all three and must find them unchanged, and they promote to `requiredSymbols` at this packet's own placement, once EM-A2a has LANDED |
| Test precedent | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q …')` + seven straight-line `it` | One literal `describe`, no `.each`/nesting, positive control first | Copy this shape (§P3.4) |

> ⛔ **THE TWO SOURCE ROWS FOR `GOODS_CATEGORIES` AND `INSTITUTION_SERVICES` ARE DELETED
> (ESTATE-REPAIR-4b, the chair's ruling 1 — §1.8).** They existed only to feed `worldFact.goods` and
> `worldFact.services`, and both pools left with the ruling; the two matching `requiredSymbols` rows
> leave `EM-A2b.manifest.json` in the same act, so §5 and the capsule stay set-equal. ⭐ The measured
> facts themselves are NOT withdrawn — `GOODS_CATEGORIES` 7 keys and `INSTITUTION_SERVICES` 285 keys
> at `bdbf7c89c` stand in "Baseline posture" as executed history — they are simply not this packet's
> contract any more. **EM-P3c reads both at their canonical homes when it sits.**

**Forbidden alternatives:** ⛔ **no import of `src/data/namingData.js`** — the culture bag is passed
in; ⛔ **no import of any `.jsx` or anything under `src/components/**`** (§P4, and §2's whole
point); ⛔⭐ **NO IMPORT OF ANYTHING UNDER `src/domain/display/**`, AND NO DOMAIN RE-EXPORT MINTED TO
LAUNDER ONE PAST THE FENCE** — the ban is EM-A2a's landed `FORBIDDEN` pattern and this leaf's own
header (*"it never reads a display seam, which relabels and passes unknowns through"*), and a new
`src/domain` module whose only job is to forward `pantheonStandings` would defeat both while adding
a module to the estate for an `Object.keys`; ⛔ **no second pantheon PROJECTION** — the row reads the
record's own keys behind `pantheonStandings`' own dormancy guard and computes no tier, seat or rank;
⛔ **no second resource-legality PREDICATE** — read the engine's own `compatible` flag, never a
re-typed route/terrain rule and never the wizard's three-clause JSX filter; no second `poolValues`
and no second stream; no import of `src/kernel/rngContext.js` or `src/generators/npcGenerator.js`;
no premade deity list anywhere; no edit to any existing file **other than A2a's two**; no files
outside the manifest. ⭐ **EXACTLY ONE NEW IMPORT IS AUTHORIZED**, `../resourceTerrainCompatibility.js`;
the leaf's specifier count goes **11 → 12** and A7's `FENCE` gains that one address and nothing else.

---

## 6. Exact contracts

### The six pool ids — exact, closed, and their exact sources

| id | source kind | exact read | values at this base |
|---|---|---|---|
| `name.settlement` | `generator` | `world.namingData[culture]`: `settlementPrefixes` × `settlementSuffixes`, concatenated | per culture |
| `name.npc` | `generator` | `world.namingData[culture]`: `maleNames` + `femaleNames`, then `' '` + a `surnames` member | per culture |
| `npc.role` | `world` | the distinct non-empty `role` of `world.institutions[]`, plus each institution's `name` where `role` is absent | world-derived |
| ⭐ **`power.holder`** | `world` | the distinct non-empty `faction` of `world.powerStructure?.factions[]` | world-derived; `[]` with no power structure |
| ⭐ `deity` | `world` | `world?.pantheon && typeof world.pantheon === 'object' ? Object.keys(world.pantheon) : EMPTY` — **THE RECORD, READ DIRECTLY; NO IMPORT** | world-derived; `[]` when dormant |
| ⭐ `worldFact.resources` | `world` | `getCompatibleResources(world?.tradeRoute ?? 'road', world?.terrain ?? null).filter((r) => r.compatible).map((r) => r.key)` | **6** at `('port','coastal')`; **16** at the `('road', null)` fallback |
| ⛔ `worldFact.tradeAccess` | — | **BLOCKED (§2)** | — |

⛔⭐ **`worldFact.resources` FILTERS ON `compatible` FIRST, AND MAPS TO `.key`, NEVER `.label`.**
`getCompatibleResources` does NOT return a gated set: it returns the WHOLE 33-row catalogue with a
`compatible` boolean and an `incompatibleReason` on each row, at EVERY route and EVERY terrain
(executed at this tip over 54 route × terrain combinations: the array length is 33 in all 54).
⛔ **Version 5's read — `.map(r => r.key)` with no filter — therefore answered the same 33 keys for
every world**: the gate never fired, the editor would have offered `deep_harbour` at a desert
settlement, and B5's "non-empty symmetric difference" measured **0** and would have RED at the
build. The filter is not a second copy of anything: it reads the engine's own computed flag at the
engine's own address, which is exactly what `src/components/ConfigurationPanel.jsx:135` does before
writing `compatible.map(r => r.key)` into `config.nearbyResources` at `:146`. ⭐ MEASURED: the flag
alone and the wizard's full predicate are **set-equal in all 54 combinations**, so ruling (5)'s
"name it by symbol, never a second copy" is satisfied EXACTLY here — unlike `tradeAccess` (§2).
Then `.key` and never `.label`, because a label is a display string and a pool is a fact set: a pool
of labels would be the display-seam mistake §12.7 forbids, arriving by a different door.

⛔ **`power.holder` is the ROSTER, read off the record, and it holds no list.** `rulingStructure.js:787`
sets `governingName` from `factions.find(isGoverning).faction` — a display NAME taken from
`powerStructure.factions[]` — so the seat's candidate set is exactly the names that roster carries,
and it changes settlement by settlement. `PoolWorld` gains one already-optional field,
`powerStructure`, answered with `[]` when absent, exactly as `institutions` is for `npc.role`.
⚠ **A MEASURED DOCUMENTATION LAG, RAISED AND NOT ADJUDICATED (R5):** ARCH §9 reads *"power seat
(holder pool over factions/**npcs**)"*, and the record has no NPC counterpart — `governingName` is
written ONLY from the faction roster, and `FACTION_RENAME_SURFACES` (not any NPC surface) is the one
register that claims the key. This packet follows **EM-A1 version 5**, which already rules the
reading — *"`powerStructure.governingName` is ITSELF a declared `FACTION_RENAME_SURFACES` key (V-9),
which is what makes the pool the faction roster"* — and records ARCH §9's "/npcs" as the SAME
lagging paragraph EM-A2a's R1 reports for its nine-pool line. ⛔ No `npc` arm is written: an arm
would be an instruction.

⛔⭐ **`deity` READS THE RECORD DIRECTLY — THE SAME DOOR `npc.role` AND `power.holder` USE — AND
IMPORTS NOTHING.** The three world-derived pools are one shape: a roster the save already carries,
walked off the passed-in bag, with `poolValues` doing the normalizing, the de-duplication, the
codepoint order and the freeze once for every row. Version 5 made `deity` the odd one out by routing
it through `pantheonStandings`, whose only address is `src/domain/display/pantheonDepth.js` — an
address EM-A2a's LANDED fence convicts by pattern and this leaf's own header forbids in prose. That
was a contradiction, not a preference, and it is cured by deleting the import rather than by
widening a guard.

⭐ **THE TWO READS ARE MEASURED EQUAL, NOT ASSUMED EQUAL.** `pantheonStandings` keys the ledger with
`Object.keys` behind a `typeof === 'object'` guard and stringifies each id; `poolValues` then
`String`-coerces, trims, drops blanks, de-duplicates and re-sorts by `compareCodepoint`, which
DISCARDS the seats-descending order the display projection computed. So every value the display read
could contribute survives the normalizer identically. Executed at this tip over **eighteen** world
shapes — absent, `undefined`, `{}`, a bare town, `pantheon: null` / `{}` / a string / a number /
`true` / an array, a three-deity ledger, a ledger whose seat order disagrees with codepoint order,
null and non-object entries, blank and whitespace keys, numeric-ish keys and a `constructor` key —
**zero differences**, with a control that discriminates: dropping the `typeof` guard makes a string
`pantheon` answer fourteen index keys instead of `[]`.

⛔ **THE GUARD IS LOAD-BEARING AND IS SPELLED, NOT INHERITED.** `Object.keys(world?.pantheon ?? {})`
alone is WRONG: `Object.keys` of a string returns its indices, so a malformed save would mint a pool
of `"0"`,`"1"`,… The row carries `world?.pantheon && typeof world.pantheon === 'object'` verbatim.

⭐ **AND IT SERVES THE DOCTRINE BETTER THAN THE IMPORT DID.** The deity doctrine is constitutional:
faith is culture, never theology. The record read takes the world's own minted ids and NOTHING ELSE
— no `tier`, no `seats`, no `wins`/`losses`, no `fromMajor`, no rank and no axis — where the display
projection computes a rank per deity before the `.map` throws it away. A world with no pantheon
yields `[]`, and B7 proves no premade deity array exists anywhere in the module.

### Inputs and outputs

Unchanged from EM-A2a — this packet adds no export and changes no signature:

```js
export const POOLS;              // gains SIX rows; A2a's ELEVEN rows are untouched
export function poolValues(poolId, world);        // unchanged
export function rollFrom(poolId, world, seed, entryId, n);   // unchanged
```

`PoolWorld` gains the optional fields in use here — `namingData`, `terrain` / `tradeRoute`, and
`powerStructure` (new with `power.holder`) — every one optional and every absence answered with `[]`.

### State schema

**NONE.** Nothing persisted, written or minted.

Absence rules — **identical to A2a and deliberately not re-specified in a second place**: absent
and empty both yield the frozen empty array; `null` is forbidden as a `poolValues` return and IS
`rollFrom`'s empty answer; invalid members are dropped in normalization; an unknown id yields `[]`.
⭐ For this packet that rule does real work: **a world with no `namingData` yields `[]` for both
name pools rather than reaching for the real table**, which is the whole point of passing the bag
in (A7).

### Transition table

Not applicable: no state, no transitions.

### Ordering and precedence

Pipeline position **NONE**. Stable enumeration: `compareCodepoint` for all six (no exception —
`tier` is A2a's). De-duplication first-occurrence-kept, then the sort, so order-independent.

### Determinism

- **Hash/fork key:** A2a's, unchanged and **not re-spelled here** —
  `createPRNG(\`edit-pool:${poolId}:${seed}:${entryId}:${n}\`)`, a ROOT composition with
  single-colon separators, never `fork`, so `tests/kernel/prngForkLabelDelimiter.test.js` cannot
  move. §P5 HZ-PRNG requires the key be spelled **once, in EM-A2**; A2a is where it lives.
- **No-draw behaviour:** unchanged and load-bearing. ⭐ It is this packet that would have broken it
  had the charter's "culture's generator" clause been followed literally — `generateSettlementName`
  consumes a world draw. A6 re-asserts the law across the combined pool set.
- **Rounding/clamping:** none; no float produced or rendered.

### Bundle law — the constraint that shapes the name pools

⛔ **`src/data/namingData.js` is imported NOWHERE.** It is 4,038 lines / ~68.6 kB, and
`src/domain/townCartography/cartographyWards.js:19-21` records the estate refusing that exact
import into a bounded leaf for that exact reason. `pools.js` reaches the first-paint graph through
`src/store/editSlice.js` (EM-C4). The culture bag is therefore **passed in**, exactly as
`instantNpc` takes `namingData` — the chair's ruling (4). ⭐ **AFTER RULING 1 THIS LEAF IMPORTS
NEITHER `src/data/tradeGoodsData.js` NOR `src/data/institutionServices.js`**: both existed only for
`worldFact.goods` and `worldFact.services`, which ride EM-P3c (§1.8), so the first-paint question
those two static imports raised **leaves this packet with them** — R2 is re-stated that way and is no
longer an unmeasured path of this packet's. The one remaining catalogue read is
`getCompatibleResources` for `worldFact.resources`.

### Flag and dormancy

**Flag:** `NONE`. **Dormancy:** zero importers. **Golden posture:** `UNCHANGED` — structurally,
since nothing imports the leaf and it takes no draw. **Motion is a STOP.**

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| Frozen rows on A2a's constant | pure reads | **Never** | n/a | Re-read live every call | n/a | **Nothing to migrate** | **Nothing to veil** — `pantheonStandings` reads public standings only |

### Receipts and privacy

`NONE` — no receipt, no figure, no DM-only field, no projection.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY: the deity pool returns the world's own pantheon IDS and reads no
  alignment, law or temper field. A pool that ranked deities would cross the doctrine's line.`
- **Edit story:** `ENGINE-ONLY: the DM's verb is EM-D2's PoolField and the fifth world-facts card;
  this packet is the catalogue beneath them.`

---

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/edit/pools.js` | six new rows in `POOLS` + their readers | **+45 effective, MEASURED (the combined file 56 → 101 of 250); see §3 and R3** | Append the six rows of §6 and their readers. Change no existing row, no signature and no stream key. ⭐ **ADD EXACTLY ONE IMPORT: `import { getCompatibleResources } from '../resourceTerrainCompatibility.js';`** — the specifier count goes 11 → 12 and A7's `FENCE` gains that one address. ⛔ **ADD NO OTHER IMPORT.** In particular ⛔ **import nothing under `src/domain/display/**`, and do NOT mint a domain re-export of `pantheonStandings`** — `deity` reads `world.pantheon`'s own keys behind the `typeof === 'object'` guard, spelled verbatim (§6). ⛔ Import no `namingData.js`, no `.jsx`, no `rngContext`, and ⛔ **no `tradeGoodsData.js` and no `institutionServices.js`** — those two imports left with ruling 1. ⭐ `npc.role`, `power.holder` and `deity` share ONE roster shape and ONE normalizer (A2a's); a reader returns only `string` members, because `poolValues` coerces with `String` and would turn an absent field into the literal `"undefined"`. ⛔ `worldFact.resources` filters on `r.compatible` BEFORE mapping to `.key`. ⛔ Write no `worldFact.goods` and no `worldFact.services` row (ruling 1 moved both to EM-P3c) and no `worldFact.tradeAccess` row — it is BLOCKED. |
| `MODIFY` | `tests/domain/editPools.test.js` | eight new `it` arms (B1–B8) **AND the IN-PLACE WIDENING of FIVE landed EM-A2a arms at NINE named edit points** | `n/a` | ⭐⭐ **TWO ACTS, AND THE SECOND IS NOT OPTIONAL.** (1) Append B1–B8 to A2a's single literal `describe`; straight-line `it`, no `.each`/nesting (§P3.4); negatives carry `// anchored:` on the line immediately above; never name a variable or parameter `it`, `test` or `describe`. (2) **WIDEN EM-A2a's LANDED ARMS IN PLACE — do not duplicate, do not append a parallel arm** (judgment 110/111's rule: *a landed arm is widened only by the packet whose landing needs it, under its own seal*; authorized by name in **judgment 134**). ⭐ **ADD ONE FIXTURE beside `TOWN` at `:50`: `RICH_WORLD`** — `{ ...TOWN }` plus a SYNTHETIC `culture` + `namingData` bag, two `institutions`, three `powerStructure.factions`, a two-deity `pantheon`, `tradeRoute: 'port'`, `terrain: 'coastal'`. It imports no real table (the bundle law, and B3's whole point). **THE NINE EDIT POINTS, EACH WITH ITS EXACT NEW VALUE, ALL RE-COMPUTED AT `04ac6520e`:** ⓵ **A1 `:164`** — `faultIn(poolValues(id, TOWN))` becomes `poolValues(id, RICH_WORLD)`; the assertion TEXT and its expected value are UNCHANGED at `[]`, and on a bare `TOWN` it would read `['deity','name.npc','name.settlement','npc.role','power.holder']` — five pools that answer `[]` on a record carrying none of those fields, **which is the contract** (B2), not a fault. ⓶ **A1 `:196`** — `contractIds` **eleven → SEVENTEEN**, gaining `deity`, `name.npc`, `name.settlement`, `npc.role`, `power.holder`, `worldFact.resources` in `compareCodepoint` order. ⓷ **A1 `:197`** — DECLARED-BUT-UNPOOLED `['npc.role','power.holder','worldFact.resources'] → []`, the PENDING residue this packet exists to discharge. ⓸ **A1 `:200`** — POOLED-BUT-UNDECLARED `['cause.remove','commodity','tier'] → ['cause.remove','commodity','deity','name.npc','name.settlement','tier']`. ⓹ **A3 `:259`** — `specifiers.length` **11 → 12**. ⓺ **A5 `:354`** — `strays` takes `RICH_WORLD` in place of `TOWN` (all three reads on that line); the assertion text and its expected `[]` are UNCHANGED, and on a bare `TOWN` it would read the same five (an empty pool rolls `null`, and `null` is a member of no pool). ⓻ **A6 `:376`** — `calls` **55 → 85** (`Object.keys(POOLS).length * 5`) and the message "fifty-five rolls across the eleven pools" becomes eighty-five across the seventeen. ⓼ **A7 `:394`** — `specifiers.length` **11 → 12**. ⓽ **A7 `FENCE` (`:66-78`)** — gains `'src/domain/resourceTerrainCompatibility.js'` and NOTHING ELSE, so `:396` stays set-equal both ways at twelve. ⛔⛔ **CHANGE NOTHING ELSE.** `A1:179` (`declared.length` 11), `A2:225`, `A3:253`/`:255`/`:261`, `A4:313`, `A5:352-353`, `A7:397`, `A7`'s nine-address plant at `:400-412` and every arm of A8 are **measured UNMOVED** and stay byte-identical. ⛔⛔ **`FORBIDDEN` (`:81-90`) IS NOT TOUCHED.** No pattern is narrowed, no exemption is added, and `/^src/domain/display//` keeps full strength — which is only possible because §6's `deity` row imports nothing. A3`:261` and A7`:397` therefore still assert `[]` and are not among the nine. |
| `TEST` | `tests/lint/ruinFilterRoster.walker.test.js` | `RUIN_AGNOSTIC_EXEMPT` gains ONE entry (`src/domain/edit/pools.js`); the discovery-count arm re-measured 93 → 94 | `n/a` | ⭐ **VERSION 7 (judgment 138).** The `npc.role` row reads `world?.institutions` raw, so the walker's discovery set — every `src/domain` file whose CODE reads `.institutions` — gains `src/domain/edit/pools.js`, and its COMPLIANT-or-EXEMPT arm convicts the leaf. It is EXEMPT, not routed: the pool offers a DM the roles the record holds as a SELECTION LIST (an affordance — *"what may a human name for this field"*, never *"what capacity does this settlement have"*), the same reason `src/domain/events/targetRosters.js` and `src/domain/tableLedger.js` hold; routing through `liveInstitutions()` would drop a ruined institution from a picker where it is a legitimate answer, AND would add a thirteenth import to a leaf whose header forbids one. **(1)** Add `'src/domain/edit/pools.js'` to `RUIN_AGNOSTIC_EXEMPT` in the name-lookup group beside `src/domain/tableLedger.js`, with a reason string in that table's own shape, beginning `name-lookup/affordance —`, that says the pool is a DM selection list over the record's own roster and credits no provider capacity. **(2)** The count arm `expect(readers.length).toBe(93)` becomes `toBe(94)`, with ONE comment line in the arm's own running record naming this packet and the reason (`pools.js` enrolled as a reader, exempted above). ⛔ Nothing else in the walker moves: no pattern, no quarantine row, no other exemption, no header sentence; the `exempt honesty` arm must stay green on its own (the leaf still reads `.institutions` and is not compliant). ⛔ The figure 94 is the arm's own red at the version-6 build; the build lane reads the arm's message at its tip and a different figure is a STOP for the chair. |

Generated artifacts: `NONE`. ⛔ **Edge-shared closure NOT owed** — the only modified production
file is a leaf this train creates, which is in no bundle closure.

> ⛔ **THE §7 ROW FOR `tests/lint/sovereigntyLightingContract.walker.test.js` IS DELETED
> (ESTATE-REPAIR-2, 2026-09-20 — the SEVENTH instance of one shape, found by this lane's sweep and
> not on its named list).** This packet does not edit that path — the row said so itself
> (*"DEFERRED TO THE TERMINAL — no edit"*) — and the JSON capsule correctly omits it, so §7 and the
> capsule were not set-equal: the shape the chair's EM-B2a ruling 8 makes the placement script
> refuse, on the estate's most contended path. ⭐ The deferred row the chair inserts at the terminal
> names `tests/lint/.lighting-census-baseline.json` — the file the refreeze actually writes
> (`CENSUS_BASELINE_REL`, measured at `bdbf7c89c`) — never the walker.

### The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — the DELTA is `+0 / +0 / +0 / +8 / +0`** | ⭐ **VERSION 6 MOVES NO TITLE.** The nine widening edit points change the BODIES of five existing `it`s and add one `const`; they add and remove no `it`, no `describe` and no title, so the delta below is inherited unchanged and the count law does not move. The five ABSOLUTES below are EXECUTED HISTORY carrying their as-of mark `583f8f644` (§P5's exception); the **DELTA** is what this packet predicts, and it is re-measured at the member's own build. This packet adds **no new test file** — it appends arms to A2a's. `files` is `TEST_FILES.length` (`:612`), so only `titles` moves. ⭐ **MEASURED at the pre-proof with the walker's OWN `measureCensus`, `parkReasonsFor`, `liveTitlesIn` and `liveSuiteTitlesIn` over a copy-only estate at `583f8f644`:** the tip reads `2670/359/2311/25589/6823`; with EM-A2a's eight-arm file `2671/359/2312/25597/6824`; with this packet's eight appended (sixteen `it`s under ONE literal `describe`) `2671/359/2312/25605/6824` — i.e. exactly **`+0 files / +0 parked / +0 credited / +8 titles / +0 suiteTitles`** (interim rule 9's five figures, in the register's own order). `parkReasonsFor` printed **`[]`** at both eight and sixteen arms, so the file stays CREDITED and the eight titles really count (shared-brief step 14b). ⛔ The deferred row the chair writes at the terminal names `tests/lint/.lighting-census-baseline.json`, never the walker. |
| P2.2 | mutation-coverage row | **NOT OWED (interim rule 15)** | `ENFORCER_DIRS` READ AT THE READ TIP (`tests/lint/mutationCoverage.shared.mjs:36-45`, never recalled) is `tests/lint · tests/design · tests/docs · tests/data · tests/copy · tests/security · tests/edgeFunctions · tests/generators`. **`tests/domain` is in none of them, and this packet CREATEs nothing at all** — both of its rows are `MODIFY` of a sibling's file. ⚠ Version 4 cited `:36-37`; the block now runs `:36-45`. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key read. The scanner covers every `.js` under `src/` (`:250`); the check is in `checks`. |
| P2.4 | writer-reach | **CANNOT MOVE** | `SURFACE_CLOSURE_STOP` includes `'src/store/'` (`writer-reach-scan.mjs:115-117`). |
| P2.5 | decision-fork + mechanism-coverage | **NOT OWED — measured** | `chooserTotality`'s `SCAN_ROOTS` are the four worldPulse-family dirs (`:64-69`); `src/domain/edit` is not among them. (A2a's R2.) |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |
| ⭐ P2.8 | line-addressed registers (**interim rule 13**) | **NONE FOUND** | ⛔ Version 5 said this grep *"returns nothing for either"*. RE-RUN at `04ac6520e`: `tests/domain/editPools.test.js` really is **0 hits**, but `src/domain/edit/pools.js` has **ONE** — `tests/lint/entropyRootCensus.walker.test.js:813`, inside the closure record EM-A2a version 9 wrote (judgment 128). It is **PROSE naming the path with no line address**, so nothing re-addresses and no row is owed by this packet or by its terminal. ⚠ **BUT THE SAME COMMENT CARRIES A SENTENCE THIS LANDING FALSIFIES** — `:819-820` reads *"takes fifty-five rolls across all eleven pools and finds the next ambient draw unmoved"*, which becomes eighty-five across seventeen the moment B6 lands, and it is the prose twin of A6's own message. The walker's two PINS are untouched: `createPRNG(` measures **36 in `src/domain` / 47 whole-src** at this tip, equal to both pins, with and without version 6's planted text — the six rows are reader lambdas and seed no stream. **RAISED as R6**; whether the re-word rides a third `§7` row here or the chair's terminal is the chair's. |
| ⭐ P2.9 | the byte closures | **+0 B AND +0 MODULES — RE-EXECUTED AT `04ac6520e`** | Measured by IMPORTING `EAGER_FIRST_PAINT_MODULES` from the tree's own `vite.config.js` — **no `dist` is read, so the probe cannot skip**: the set is **270 at this tip and 270 with version 6's planted text** (⚠ version 5 quoted **269 → 269** at `583f8f644`; the ABSOLUTE moved under it, which is §P5's whole point — the **DELTA `+0`** is what this packet predicts), and it holds **no `src/domain/edit/*` member at all**. POSITIVE CONTROL: making a `src/generators` module import the leaf takes the set to **275** and puts `src/domain/edit/pools.js` in it, so the probe discriminates; restoring the file returns it to 270. ⭐ The one new import, `src/domain/resourceTerrainCompatibility.js`, is ALREADY an eager member — the leaf reaches nothing new, and nothing reaches the leaf. The leaf has **zero importers** anywhere in `src`, `tests`, `scripts` or `e2e`, so it lands in the generation worker's bundle, the lazy engine and the five edge-shared metas at **+0 B** as well. ⛔ **This packet is NOT its train's byte-arm holder and carries NO row on `tests/build/vendorPdfLazy.test.js`**; the chair names train EM-T12's holder at the pre-proof. |
| ⭐ P2.10 | the tuning inventory (**interim rule 17**) | **P2 +0 · P3 +0** | The library's OWN `discoverTables(root, register, sourceOf) → { tables }` then `countUnregisteredNamed(root, tables, TREES_P2P3, sourceOf)` and `countBareDecimals(...)` — the four-argument arity, because the wrong one returns a silent false zero. `TREES_P2P3` read at the tip is `['src/domain','src/generators']`; 237 tables. ⛔ **AND THE RETURN SHAPE IS THE ARITY'S TWIN HAZARD:** `countUnregisteredNamed` answers `{ counts, sites }` while `countBareDecimals` answers the map itself — summing the first without `.counts` prints a silent nonsense total, which is how this measurement first read a false zero on its own positive control. RE-EXECUTED AT `04ac6520e` with the four-argument arity AND `.counts`: **237 tables**, totals **535 / 6985** at the tip and **535 / 6985** with version 6's planted text; `src/domain/edit/pools.js` and `src/domain/resourceTerrainCompatibility.js` appear in neither map. POSITIVE CONTROL: `src/domain/activeConditions.js` P2 = **3**, equal to the banked inventory. TWO PLANTED CONTROLS CONVICT, each restored byte-identical (`shasum -a 256` equal): a top-level `UPPER_SNAKE = <number>` → pools.js P2 1 / totals 536; a bare fractional decimal → pools.js P3 1 / totals 6986. ⛔ **No number this packet writes is a simulation dial** — §3's `26/14/6/11/12/21` are effective-line estimates and §5's `33 / 285 / 11` and B4's `33` are measured set sizes — so no tuning-register row is owed and nothing here is the owner's to sign. |
| ⭐ P2.11 | the wiring census | **`+0` — and the path is named NOWHERE** | This packet CREATEs no `.js` leaf under `src/generators/**` or `src/domain/**` — it MODIFIES one that its named sibling creates — so `stamp.producerIndexFiles` moves **+0** against both roots. RE-EXECUTED at `04ac6520e`: **1,180** `.js` leaves under the two producer roots at the tip and **1,180** with version 6's planted text. ⛔ `docs/content/wiring-census.json` appears in no §7 row, in no `changeManifest` row and in no `checks` entry, and rule 17's two census arms are EM-A2a's to predict, not this packet's. |

| ⭐ P2.12 | the goods migration roster (**NEW AT VERSION 6 — judgment 131's class**) | **`+0` — UNMOVED, EXECUTED** | EM-A2a version 10 added `src/domain/goods.schema.js`'s row for this leaf after the verifier's pass-2 STOP-1, and ST-2's roster arm in `tests/build/vendorPdfLazy.test.js` RE-DERIVES every column from the import graph — so a NEW IMPORT is exactly the shape that moves it, and version 5 never priced one. MEASURED by replicating the arm's own derivation: it resolves each file's **OWN static specifiers, one hop, with no transitive walk**, against `GOODS_IDENTITY_TABLES = ['src/data/resourceData.js']` and the two surfaces. `src/domain/resourceTerrainCompatibility.js` is itself a CONSUMER in that roster, not a member of the namespace, so it contributes no half and no door — and the leaf still imports `resourceData.js` directly. The derived row is **`l\|identity\|direct` at the tip and `l\|identity\|direct` with version 6's planted text**, equal to the row `goods.schema.js` declares. The eager flag cannot move either: the leaf has ZERO importers, measured in both states. ⛔ **No `§7` row on `src/domain/goods.schema.js` is owed and none is written.** |

> ⛔ **THE CENSUS ROW IS DEFERRED (§417 shape)** — DRAFT reserves as READY does, so no edit is made
> and `EM-A2b.manifest.json` **omits** the path. Predicted interior red at this member's tip:
> a title-count mismatch, not a file-count one.

---

## 8. Ordered coding sequence

0. Dispatch and seal — **only after the chair rules R1 and EM-A2a has landed**; re-read
   `git rev-parse HEAD` in the same command.
1. Capture the baseline: the census figures; `sha256` of `tests/fixtures/generator-golden-master.json`.
2. Append B1–B8 to `tests/domain/editPools.test.js`, **failing**.
3. Implement the six rows: the two name pools and the culture resolver first (the `instantNpc`
   shape), then `npc.role`, **`power.holder`** and **`deity`** — ⭐ **all three are the SAME
   roster-walking shape over the passed-in record, one field taken and normalized through A2a's
   helper, never a second normalizer and NEVER AN IMPORT** — then the ONE world-fact reader,
   `worldFact.resources`, which adds the packet's single new import and **filters on `r.compatible`
   before mapping to `.key`**.
3a. ⭐ **WIDEN EM-A2a's FIVE LANDED ARMS AT THE NINE EDIT POINTS §7 ROW 2 NAMES, AND NOWHERE ELSE**,
   adding the `RICH_WORLD` fixture beside `TOWN`. Run A1–A8 green before B1–B8 are implemented, so
   the widening is proved to be a widening and not a repair of this packet's own code.
4. Sole writer / lifecycle seam: **NOT APPLICABLE** — record as skipped.
5. Wire consumers: **NOT APPLICABLE** — lands DARK. Record as skipped.
6. Registrations: none owed. The prevention guard is A7 (the import fence), extended.
7. Run focused verification (§10).
8. Run the wave-end gate per the train's plan; write the completion receipt.

```text
name.npc (the instantNpc shape, adapted to a POOL rather than a single roll):
1. bag = world?.namingData?.[world?.culture ?? 'germanic'] ?? null
2. if !bag -> return []                     // never reach for the real table
3. first = [...(bag.maleNames ?? []), ...(bag.femaleNames ?? [])]
4. last  = bag.surnames ?? []
5. values = last.length ? first.flatMap(f => last.map(l => `${f} ${l}`)) : first
6. normalize + dedupe + compareCodepoint    // A2a's shared normalizer, not a second one
```

⚠ **Step 5's cross product can be large.** At this base the largest culture's product is bounded
by `maleNames.length + femaleNames.length` times `surnames.length`; the implementer **measures it
at step 2 and reports the figure**, and if any single pool exceeds what a drop-down can hold, that
is an out-of-scope observation for the receipt and a `PoolField` search-affordance question for
EM-D2 — **not** a reason to truncate a pool here. Truncation would make `rollFrom` non-total over
the value set and is a STOP.

---

## 9. Acceptance matrix

Eight arms (B1–B8) appended to A2a's single literal `describe`. ⛔ **THE NINE WIDENING EDIT POINTS
INSIDE A2a's OWN A1/A3/A5/A6/A7 ARE NOT ARMS AND ADD NO TITLE** — they are §7 row 2's second act,
listed there with each exact new value, and the count law does not see them.

| ID | Case | Required observation |
|---|---|---|
| **B1** | **Main + GUARD-THE-GUARD, and A2a's TOTALITY ARM RE-SPELLED** | `POOLS` now holds exactly **seventeen** ids — A2a's eleven **plus** these six — set-equal both directions with a full offender list, so a row dropped by either packet reds here. ⭐ **And A2a's A1 totality arm is WIDENED IN PLACE, not duplicated:** `POOLS`' ids against `FIELD_DECLARATIONS`' eleven `kind: 'pool'` ids in BOTH directions, with **DECLARED-BUT-UNPOOLED asserted exactly `[]`** — the shrink this packet's landing OWES (judgment 106 item 2) — and **POOLED-BUT-UNDECLARED asserted exactly `['cause.remove','commodity','deity','name.npc','name.settlement','tier']`**, so neither residue can silently grow and a TWELFTH declaration reds here. Every new pool returns a frozen, duplicate-free `string[]` on a real world — **`RICH_WORLD`, because the five world-derived pools answer `[]` on a record that carries none of their fields and that emptiness IS the contract (B2)** — asserted before any negative below. |
| **B2** | **Absence is the typed value** | A world with **no `namingData`** yields `[]` for both name pools; a world with no `pantheon` yields `[]` for `deity`; a world with no `institutions` yields `[]` for `npc.role`; `null`/`undefined`/`{}` never throw for any of the six. Anchored against a populated control in the same arm. |
| **B3** | **⛔ THE PASSED-IN BAG, AND THE IMPORT FENCE (counterforce)** | A `namingData` bag carrying **one invented prefix** produces a `name.settlement` value containing it — proving the pool draws from the SUPPLIED bag and never reaches for the real table behind the caller's back. A source scan proves `pools.js` imports **neither `src/data/namingData.js` nor `src/generators/npcGenerator.js` nor any `.jsx`**, with the matcher proved live on a planted string. |
| **B4** | **The source is read at its canonical home, AND THE GATE IS THE FLAG** | `worldFact.resources` at `('port','coastal')` set-equals `getCompatibleResources('port','coastal').filter(r => r.compatible).map(r => r.key)` — **exactly 6 of the catalogue's 33**, both figures asserted so the arm cannot pass on an ungated read — and is asserted to hold **no `.label` value**, which is what keeps a display string out of a fact pool. ⛔ **The unfiltered `.map(r => r.key)` is asserted to be a DIFFERENT, larger set in the same arm** (33 against 6), which is the counterforce that would have caught version 5. ⛔ **The two set-equalities for `worldFact.goods` and `worldFact.services` LEFT this arm with their pools (ruling 1, §1.8) and ride EM-P3c**; no arm is written for either, because an arm would be an instruction. |
| **B5** | **Boundary: the resource gate is LIVE, not inherited** | `worldFact.resources` differs between two routes/terrains (`('port','coastal')` **6** vs `('isolated','desert')` **19**) — asserted as a **symmetric difference of exactly 21**, so the gate is proved to fire rather than returning one fixed list. ⛔ **MEASURED AT THE TIP: the same two worlds under version 5's unfiltered read differ by ZERO**, because `getCompatibleResources` returns all 33 rows at every route and every terrain — this arm is precisely what convicts an ungated read, and version 5 would have RED here. Absent route/terrain falls back to `('road', null)` and still returns a non-empty frozen array (**16**). |
| **B6** | **Determinism across the combined set** | `rollFrom` on each of the six returns the same value on repeat calls (`toBe`); roll 3 taken alone equals roll 3 taken in sequence (the reopen guarantee); different `entryId`s differ for at least one pool. ⭐ And the no-draw law re-asserted **across all seventeen pools**: with an ambient RNG active, fifty `rollFrom` calls leave the next ambient draw equal to the pre-recorded value. |
| ⭐ **B8** | **⛔ THE SEAT IS THE ROSTER, AND NOTHING ELSE** | For a world whose `powerStructure.factions[]` carries three named entries, `power.holder` set-equals exactly those three `faction` values, sorted — **asserted first, populated, so no later arm passes on nothing**. A world with no `powerStructure`, one with `factions: []`, and one whose entries carry a blank `faction` each yield the frozen `[]` and never throw. ⛔ A source scan finds **no premade faction-name array anywhere in the module** and **no read of `governingName`** — the pool offers every seat-eligible faction, not the one already seated, which is what makes it a POOL rather than a readback of the current value. ⭐ An invented faction name planted in the supplied roster APPEARS in the pool, proving the read is off the passed-in world and not a catalogue behind the caller's back. ⚠ `npc`-kind holders are asserted ABSENT by name, so ARCH §9's "/npcs" clause is a recorded verdict (R5) rather than an oversight. |
| **B7** | **⛔ THE DEITY DOCTRINE, AND THE FENCE IT IS READ THROUGH** | `deity` returns exactly the world's own pantheon ids for a three-deity world and `[]` for a world with none; an INVENTED deity id planted in the supplied `pantheon` APPEARS in the pool, proving the read is off the passed-in record; a source scan finds **no premade deity-name array anywhere in the module** — faith is culture, never theology. ⭐⭐ **AND THE SAME SCAN ASSERTS THE MODULE IMPORTS NOTHING UNDER `src/domain/display/`, WITH THE MATCHER PROVED LIVE ON A PLANTED SPECIFIER** — the structural half of the doctrine: this pool could only ever be a premade list if it were read through a seam that relabels, and the one address in the estate that projects a pantheon is a display seam A2a's fence bans. ⛔ `pantheonStandings` is asserted to be called NOWHERE in the module, and the arm records that the record read and that function answer the SAME SET after normalization, a world with a non-object `pantheon` included (`[]` both ways — the `typeof` guard, pinned). Anchored by the populated case asserted first. |

**8 new + A2a's 8 = 16 across the two packets; 8 of ≤8 in this one — AT THE CAP.** ⛔ A ninth arm is a
STOP, not a squeeze: a further pool takes a further member (EM-A2c). ⛔ **No arm is written for
`worldFact.tradeAccess`** — it is BLOCKED, and an arm would be an instruction.

---

## 10. Verification commands

```sh
npx eslint src/domain/edit/pools.js tests/domain/editPools.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editPools.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/ruinFilterRoster.walker.test.js

node scripts/check-observed-shape-readers.mjs
npm run typecheck:ratchet
npm run typecheck:domain:strict
node scripts/implementation-packets.mjs validate

npm run check:packet -- EM-A2b
npm run implementation:resume -- EM-A2b
```

⭐ **The sealed `checks` array ENDS with `node scripts/implementation-packets.mjs validate`** (interim
rule 8): version 4 left the two `typecheck:*` entries after it, and they now precede it in the capsule
as well. ⛔ **The count prover is KIT FURNITURE** (interim rule 12, judgment 81) — it is never a
`checks` entry and is never placed in the tree. The build lane runs it from the kit path BEFORE its
seal: `node <kit>/packets-waiting/EM-A2b.count-prover.mjs <kit>/packets-waiting/EM-A2b.md <kit>/packets-waiting/EM-A2b.manifest.json`.
⭐ **INSTRUMENTS, not sealed checks:** `tests/lint` run WHOLE with
`--exclude=tests/lint/sovereigntyLightingContract.walker.test.js` (must EXIT 0), then the lighting
walker ALONE, expected NONZERO on the titles figure only until the terminal's refreeze.

Expected: every command exits `0`, **except** the named census interior red until the terminal.
⛔ Never read a gate through a shell pipe (§P7).

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: **the dispatched status is not `READY`**
(⛔ R1 does NOT gate it — judgment 111 (2)); **EM-A2a is not LANDED at the dispatched base** — this
packet modifies its two files, and at version 6's own tip it is LANDED at version 10; the seal is missing or
foreign; HEAD is not `d31af2cee` or a descendant proved non-interfering; **the COMBINED
`pools.js` measures > 250 effective lines** under eslint's own `Linter` with `skipBlankLines` and
`skipComments` → take the pre-declared **EM-A2c** split, RE-AIMED by ruling 1 at the rows that are
still separable here (`worldFact.resources`, and `worldFact.tradeAccess` once R1 is ruled),
**never squeeze**; a golden or the prose manifest moves by one byte — the rows to hold UNMOVED are
`tests/fixtures/generator-golden-master.json` and `tests/fixtures/dossier-prose-manifest-golden.json`
**named in `tests/fixtures/.golden-freeze-register.json`**, never a quoted digest (the chair's estate-wide
ruling of 2026-09-21); ⭐⭐ **EM-A2a's FIVE LANDED ARMS ARE NOT SPELLED AS §7 ROW 2 DESCRIBES THEM** — each of the NINE
edit points must be found verbatim at the line the row names before it is changed, and its stated
"at the tip" value must be the value the arm actually holds. ⛔ **A TENTH EDIT POINT — any landed
assertion §7 row 2 does not name — IS A STOP FOR THE CHAIR, not a lane's to adjudicate.** (Version 5
carried only three named assertions and §11 made a FOURTH a STOP; **judgment 134 DISCHARGES that
STOP by name**, authorizes the four A1 points and the five beyond A1 with their exact values, and
re-aims the tripwire at the tenth.) ⛔ **A WIDENING OF `FORBIDDEN` IS ITSELF A STOP:** no pattern
there may be narrowed, deleted or given an exemption by this packet — if an arm cannot be satisfied
without one, the SHAPE is wrong, not the fence; ⛔ **`getCompatibleResources` begins FILTERING its
return** (today it annotates all 33 rows and the gate is the `compatible` flag: a filtered return
would make B4's 33-against-6 counterforce vacuous and silently re-shape the pool), or the
`compatible` flag stops being the wizard's own predicate at `ConfigurationPanel.jsx:135`;
⛔ **the MEASURED combined `pools.js` crosses 250** under eslint's own `Linter`; **the DECLARED-BUT-UNPOOLED residue does not shrink to
`[]` when the six rows are appended** (a TWELFTH `kind: 'pool'` declaration would have landed under this
packet); A6/B6 shows the ambient sequence advancing; the leaf would need `namingData.js`, `npcGenerator.js`,
`rngContext.js` or any `.jsx` to satisfy an arm; a name pool's cross product would have to be
TRUNCATED to be usable (that is an EM-D2 affordance question, and truncating makes `rollFrom`
non-total); `pantheonStandings` no longer returns `[]` for an absent pantheon, or no longer keys the live ledger
with `Object.keys` behind a `typeof === 'object'` guard — **the record read's equivalence anchor, and
the only thing that makes §6's `deity` row the same answer** (§5); **`powerStructure.factions[]`
entries no longer carry a `faction` field, or `rulingStructure.js` no longer derives the seat from
`factions.find(isGoverning)`** (B8's premise, and the reason the pool is the roster); any A2a row
would have to change; ⭐ **VERSION 7:** `tests/lint/ruinFilterRoster.walker.test.js` gains more than the ONE exemption entry and the ONE count change, or any pattern, quarantine row, header sentence or other exemption there moves, or the count arm's own red at the build reads a figure other than 94 (the arm's message decides; a different figure is a STOP for the chair, never a figure adopted by hand).

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · exact changed files and effective-line deltas, **with
the COMBINED `pools.js` figure measured by eslint's `Linter`** · acceptance B1–B8 plus A2a's A1–A8
re-run green · the measured largest name-pool cross product · focused commands, exits and counts ·
sealed per-step receipt and resume status · both typecheck configurations · gate stages actually
executed · base-versus-wave failure identity diff · dormancy/golden result · the ambient-stream
no-draw proof across all seventeen pools · census tuple before and at the tip with the interior red
quoted verbatim · generated artifacts `NONE` · deviations `NONE | STOP` · out-of-scope
observations without investigation (including `mountain_pass`; the first-paint question R2 raised
left with the two modules at ruling 1) ·
⭐ **the NINE widening edit points, each quoted BEFORE and AFTER with the landed line it stood at,
and A1–A8 re-run green with the widening alone, before B1–B8 exist** · ⭐ the `deity` pool's values
proved equal to `pantheonStandings(world).map(e => e.id)` on the arm's own worlds, and the module's
import list quoted in full at twelve · ⭐ the MEASURED combined `pools.js` figure beside version 6's
predicted 101 · **judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | ⛔⛔ **THE BLOCK (§2), RE-AIMED AND RE-MEASURED AT `583f8f644`. `worldFact.tradeAccess` STILL has no canonical exported option list**, and the wizard's six still disagree with the generator's five (`mountain_pass`). Ruling (5)'s "name it by symbol, never a second copy" still cannot be executed. ⛔ **Version 4 recorded this block as RESOLVED by EM-P3. That is REFUTED**: EM-P3 IS landed, `src/domain/worldFactOptions.js` exists, but its `WORLD_FACT_SOURCES` holds **SEVEN** keys and its own comment reserves the eighth — *"Trade access is EM-P3b's row … EM-P3b mints `TRADE_ACCESS` … and adds the eighth key here"*; `git grep TRADE_ACCESS -- src` finds the mint NOWHERE. So the two paths costed at §2 stand, now with a third and cheapest: **U3 — EM-P3b, already chartered by EM-P3's own text**, mints `TRADE_ACCESS` at `src/data/worldFactOptions.js` with the domain re-export and the eighth `WORLD_FACT_SOURCES` key, and this packet's row is then one line at a landed address. ⛔ **Nothing in this packet waits on it**: no pool row, no source row, no arm and no budget line is written for `worldFact.tradeAccess`, so the block gates a LATER member (EM-A2c's re-aim), never this one. **This packet is READY-able without R1 being ruled.** |
| **R2** | ⭐ **CLOSED FOR THIS PACKET BY RULING 1, AND HANDED ON.** R2 asked whether `src/data/tradeGoodsData.js` and `src/data/institutionServices.js` are already inside the eager first-paint closure, because this packet imported them statically for the two struck pools. **After ruling 1 it imports neither**, so this packet adds no such edge and the question is no longer its unmeasured path — it rides **EM-P3c** with the two rows. ⛔ Still UNMEASURED by any lane: recorded, not answered. |
| ⭐ **R3** | **RESOLVED BY THE CHAIR'S RULING 1, AND RE-DERIVED AT THE PRE-PROOF — THE COMBINED `pools.js` NOW ESTIMATES ≈230 OF 250 AND FITS.** A2a **≈140** (its VERSION 7 §3, after two frozen literal vocabularies became imports) + this packet's ≈90 (with `power.holder`, after `worldFact.goods` ≈6 and `worldFact.services` ≈12 left): **≈230, about twenty lines of margin**, each figure re-derived from its own packet's decomposition (§3), never quoted. ⚠ **Version 4 spelled ≈238** because it read EM-A2a at its version-4 ≈148; EM-A2a version 7's own R4 states ≈230 and the two packets now agree. ⚠ The row's history, kept: version 3 read ≈256 and was OVER, and the ≈244 before it counted A2a at ≈147, its PRE-revision-2 figure. **EM-A2c stays PRE-DECLARED and is RE-AIMED** at `worldFact.resources` (≈12) and, once R1 is ruled, `worldFact.tradeAccess` — it is a contingency, not a scheduled split, and §11's STOP is what fires if the MEASURED figure crosses. ⛔ **No row was squeezed to reach ≈238**; the twelve lines come from the ruling, not from an edit to a row. |
| ⚠ **R5** | **ARCH §9 says the holder pool is *"over factions/npcs"*; the record has no NPC half.** Measured: `governingName` is written only from `factions.find(isGoverning).faction` (`rulingStructure.js:787`), and `FACTION_RENAME_SURFACES` holds the one row that claims the key. EM-A1 version 5 already rules the reading (the pool is the faction roster) and this packet follows it; B8 asserts the NPC half ABSENT by name so the verdict is recorded. **This is the same lagging ARCH §9 paragraph EM-A2a's R1 reports** — one documentation correction closes both. |

| ⭐ **R6** | ⚠ **A SENTENCE THIS LANDING FALSIFIES, IN A WALKER THIS PACKET DOES NOT EDIT — THE CHAIR'S, NOT A LANE'S.** `tests/lint/entropyRootCensus.walker.test.js:819-820` (EM-A2a version 9's closure record, judgment 128) reads *"takes fifty-five rolls across all eleven pools and finds the next ambient draw unmoved"*. B6 and A6 make that eighty-five across seventeen. ⛔ **No pin moves** — `createPRNG(` measures 36 in `src/domain` / 47 whole-src at this tip and with version 6's planted text, equal to both pins — so this is prose, not an assertion, and nothing reds. **The two paths:** (a) a THIRD `§7` row on that walker (one comment line; it takes this packet from two change paths to three, and the path is EM-A2a's most recently contended); (b) the chair's terminal re-word beside the census regeneration, where the walker is already being read. ⭐ **The packet RECOMMENDS (b)** and writes no row, because an unasked-for row on a sibling's walker is the shape judgment 110 convicted; the intake is recorded here so it is not re-found. |
| ⭐ **R7** | **THE COMBINED EFFECTIVE-LINE ESTIMATES ACROSS THE EM-A2 FAMILY WERE NEVER EXECUTED, AND ONE OF THEM DROVE A RULING.** Measured at version 6 with §11's own instrument: EM-A2a's landed `pools.js` is **56** effective lines and this packet's rows take it to **101**, against estimates of ≈140 and ≈90 summing to ≈230 — the estimates count added source lines, the instrument skips comments and blanks. ⛔ **Nothing is re-opened**: ESTATE-REPAIR-4's ruling 1 moved `worldFact.goods` and `worldFact.services` to EM-P3c for reasons of RECORD SHAPE as well as size (§1.8 — they are not facts the record holds), and that half stands on its own. But **EM-A2a version 7's own R4 and EM-A1's ≈-figures carry the same convention**, and a future lane reading "about twenty lines of margin" would squeeze a row that has 149 lines of room. **RAISED so the family's figures are re-measured once, by whoever next opens EM-A2a**; this packet corrects only its own. |

> ⛔ **R4 LEFT THIS PACKET AT VERSION 4 (the chair's ruling 1, §1.8).** *"`worldFact.services` would
> be a 285-value pool … a drop-down question for EM-D2's `PoolField`"* was a risk OF the services
> row, and the row is gone: the risk rides **EM-P3c**'s sitting with the two pools, their two source
> rows and B4's two set-equalities. ⭐ **Nothing about the 285 is withdrawn** — it was executed at
> `bdbf7c89c` and stands as measured history; it is simply not this packet's risk any more.
