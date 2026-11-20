# FRAME-6 · P1BF — the outside hand's keeper in the modest words, and one keeper rule at both doors: results

Builder P1BF of FRAME-6, in the worktree `wt-p1bf` on branch `frame6-p1bf`, cut at `0f34be803`, from the brief
`frame6/P1BF-WORDING-PARITY.md` (and the COMMON section of `frame4/FRAME4-BRIEFS-U0-P1B-P4A.md`). Written 2026-11-20
from 13:48 UTC (`date -u`). Every run is a file under the scratchpad folder `P1BF/`. Each gate was read from a file by its
count lines, or through `sh scripts/gate-tail.sh`, with its own exit code. Every vitest run went through
`sh scripts/gate-mutex.sh --run --`, one at a time.

## Commit 1 — the wording (the chair's ruling: the modest one)

`src/domain/crisis/crisisPage.js :: CRISIS_ABSENCE_REACH.outsideHand` is now
`'{keeper} keeps the {house}, where strangers lodge, and would know of them'`. It was
`'{keeper} keeps the {house} where its people come and go'`. These are the trouble frame's own words
(`troubleCast.js :: FRAME_REASONS.outsider`). The doc comment above it gains a paragraph that says why. Nothing else in
`src/` changes.

**The pins moved, by the chair's ruling, and no others:**
- `tests/domain/crisis/crisisOutsideHand.test.js`:
  - "the closed set: one fixed sentence, frozen, naming no one but the record's keeper and house" (the sentence).
  - The `REACHED` table read by "the owner's page gains the words on B7's drafted towns (3); the stored absence stays"
    (three lines: Chae Yang / alehouse, Peppo Schubert / taverns, Pitao Ucan / inn).
- `tests/security/frameShareVeil.test.jsx`, describe "P1B: the outside hand's keeper is drawn for the owner only":
  the `P1B_TOWNS` words (two lines), read by "the owner's Crisis tab reaches the hand; no shared page and no other
  reader does (2 born towns)".
- Every other assertion of both files is unchanged. No other pin moved: the lane gate and the 60 importer and walker
  files below are green apart from the one known red. `crisisPageAudience.test.js`'s `withoutOwnerReach` cuts on
  `"an outside hand, unnamed; "` and is untouched and green.

**Red first** (`c1-red.txt`: the re-recorded pins run on the tree with `crisisPage.js` at the base, `-t P1B`): exit 1,
`Test Files 2 failed (2)`, `Tests 3 failed | 6 passed | 8 skipped (17)`. The failing titles:
- `crisisOutsideHand.test.js > … > the closed set: one fixed sentence, frozen, naming no one but the record's keeper and house`
- `crisisOutsideHand.test.js > … > the owner's page gains the words on B7's drafted towns (3); the stored absence stays`
- `frameShareVeil.test.jsx > P1B: the outside hand's keeper is drawn for the owner only > the owner's Crisis tab reaches the hand; no shared page and no other reader does (2 born towns)`

**Green** (`c1-green.txt`): exit 0, `Test Files 2 passed (2)`, `Tests 9 passed | 8 skipped (17)`.

**Byte-identity.** I ran P1B's `run.mjs` and a `compare.mjs` written for the new words. Base = `0f34be803` (before any
edit). Tip = commit 1. The pools are the same three: B7's crisis pool, the natural pool and the 525-row golden master,
1,245 towns in all.

`run6.mjs` is P1B's `run.mjs` verbatim with one field added. `ownerCut` is the owner's page digested with the owner-only
clause cut back to the stored reason. It lets the compare prove that the owner's page differs by the clause alone.

`compare6.mjs` checks four things on every town:
- **The stored record:** identical at base and tip.
- **Every non-owner reader** (nine readers: no options, `undefined`, `null`, `{}`, `{ audience: undefined }`, `'player'`,
  `'gallery'`, `'Owner'`, the bare string `'owner'`): the page is identical to today's page (the base, no options), at
  base and at tip.
- **Where a keeper stands for the hand:**
  - the owner's page moved against the base owner's page;
  - its absence line reads the old words at base and the new words at tip, and nothing else;
  - every other absence row is unchanged;
  - with the clause cut, the owner's page is today's page, at base and at tip.
- **Every other town:** the owner's page is unchanged and equal to today's page.

| pool | towns | stored identical | non-owner pages identical | owner pages moved (by the clause alone) | owner pages identical | unexpected |
|---|---|---|---|---|---|---|
| B7's crisis pool | 360 | 360 | 3,240 of 3,240 | 5 of 5 | 355 | 0 |
| natural pool | 360 | 360 | 3,240 of 3,240 | 1 of 1 | 359 | 0 |
| golden master | 525 | 525 | 4,725 of 4,725 | 120 of 120 | 405 | 0 |
| **all** | **1,245** | **1,245** | **11,205 of 11,205** | **126 of 126** | **1,119** | **0** |

The 126 are exactly the towns P1B predicted. The base summaries match P1B's measure 3: hand 14 / keeper 5, hand 2 /
keeper 1, hand 288 / keeper 120. Two lines, before and after:
- `b7-infiltrated-town-0`, "instigator: an outside hand, unnamed; Peppo Schubert keeps the taverns where its people come
  and go" becomes "… ; Peppo Schubert keeps the taverns, where strangers lodge, and would know of them".
- `b7-natural-town-42`, "… ; Ursus Bassus keeps the inn where its people come and go" becomes "… ; Ursus Bassus keeps
  the inn, where strangers lodge, and would know of them".

**Gates at commit 1:**
- **The lane gate** (`c1-lane.txt`: `tests/domain/crisis`, `tests/domain/tension` and
  `tests/security/frameShareVeil.test.jsx`, all whole): `Test Files 28 passed (28)`, `Tests 222 passed (222)`.
- **Importers and walkers** (`c1-importers.txt`, `c1-importers.json`; 60 files, listed in `importers.txt`). The files are
  every test importing `crisisPage.js`, `CrisisTab.jsx`, `CrisisSections.jsx` or `journalPages.js` outside the lane gate,
  plus these walkers: styleLaw, domainAnyCastBaseline, presumedThings, presumptionClasses, factLayers, ruinFilterRoster,
  statusUnionTotality, sovereigntyLightingContract, seedLoopTotality and tuningRegister. Result:
  `Test Files 1 failed | 59 passed (60)`, `Tests 1 failed | 709 passed (710)`.
  - **The one red is not mine:** `tuningRegister.walker.test.js > … > the measured tree matches the committed inventory
    exactly`. It fails on exactly the lane's three known rows (FRAME-5 hand-back, `eb555d407`):
    `sideArchetypes.js#FRAME_TUNING`, `crisisCast.js#CRISIS_CAST_TUNING` and `tonightSheet.js#WANT_MAX_WORDS`.
- **Typecheck and lint:**
  - `npm run typecheck:ratchet`: 167, ceiling 167 (OK).
  - `npm run typecheck:domain:strict`: 1113, ceiling 1113 (OK).
  - `npm run lint`: 0 errors (38 warnings). `eslint` on the three touched files prints nothing.

## The byte-identity scripts (from the scratchpad folder `P1BF/`)

For each pool (`crisis`, `natural`, `golden`): `node run6.mjs <worktree> <pool> base-<pool>.json` at the base, before any edit; the same to `tip-<pool>.json` at commit 1; then `node compare6.mjs base-<pool>.json tip-<pool>.json`.

### `run6.mjs`: P1B's `run.mjs` (in `frame5/P1B-RESULTS.md`) with this diff

```diff
0a1
> // P1BF: P1B's run.mjs verbatim plus one field, `ownerCut` (the owner's page digested with the owner-only clause cut).
75a77,78
>   // P1BF: the owner's page with the owner-only clause cut (an instigator row reading the hand's reason then '; …')
>   const ownerCut = digest(owner.map((x) => ({ ...x, absent: x.absent.map((a) => (a.role === 'instigator' && a.reason.startsWith(`${CAST_ABSENCES.outsideHand}; `) ? { ...a, reason: CAST_ABSENCES.outsideHand } : a)) })));
80c83
<     stored: digest(s), sections: owner.length, page,
---
>     stored: digest(s), sections: owner.length, page, ownerCut,
```

### `compare6.mjs`

```js
// FRAME-6 · P1BF — base vs tip, one pool (P1B's compare.mjs, for the new words): the stored record; every non-owner
// reader's page against the BASE page with no options (today's page); the owner's page against the base OWNER's page:
// moved exactly where a keeper stands for the hand, and there by the clause alone (the owner's page with the clause cut
// equals today's page, at base and at tip; the line reads the old words at base and the new words at tip).
// argv: base.json tip.json
import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));
const OLD = 'where its people come and go';
const NEW = ', where strangers lodge, and would know of them';
const key = (r) => `${r.seed}|${r.at}|${r.tier}`;
const byB = new Map(b.map((r) => [key(r), r]));
let storedSame = 0, strangerPages = 0, strangerSame = 0, ownerExpected = 0, ownerMoved = 0, ownerSame = 0, clauseAlone = 0;
const bad = [];
const examples = [];
for (const r of a) {
  const t = byB.get(key(r));
  if (!t) { bad.push([key(r), 'missing']); continue; }
  if (t.stored === r.stored) storedSame++; else bad.push([key(r), 'stored moved']);
  for (const k of Object.keys(r.page)) {
    if (k === 'owner') continue;
    strangerPages++;
    if (t.page[k] === r.page.none && r.page[k] === r.page.none) strangerSame++; else bad.push([key(r), `${k} moved`]);
  }
  const expectWords = r.hand && !!r.keeper;
  if (expectWords) {
    ownerExpected++;
    const oldLine = `infiltrated: an outside hand, unnamed; ${r.keeper.name} keeps the ${r.keeper.house} ${OLD}`;
    const newLine = `infiltrated: an outside hand, unnamed; ${r.keeper.name} keeps the ${r.keeper.house}${NEW}`;
    if (t.page.owner !== r.page.owner) ownerMoved++; else bad.push([key(r), 'owner did not move']);
    const rest = (x) => x.ownerAbsent.map((l) => l.split('; ')[0]);
    const ok = r.ownerAbsent.includes(oldLine) && t.ownerAbsent.includes(newLine)
      && JSON.stringify(t.ownerAbsent) === JSON.stringify(r.ownerAbsent.map((l) => (l === oldLine ? newLine : l)))
      && JSON.stringify(rest(t)) === JSON.stringify(rest(r))
      && t.ownerCut === r.page.none && r.ownerCut === r.page.none;
    if (ok) clauseAlone++; else bad.push([key(r), 'owner differs by more than the clause', r.ownerAbsent, t.ownerAbsent]);
    if (examples.length < 3) examples.push({ seed: r.seed, before: oldLine, after: newLine });
  } else if (t.page.owner === r.page.owner && t.page.owner === r.page.none) ownerSame++;
  else bad.push([key(r), 'owner moved unexpectedly']);
}
console.log(JSON.stringify({ towns: a.length, storedSame, strangerPages, strangerSame, ownerExpected, ownerMoved, clauseAlone, ownerSame, bad: bad.length, badRows: bad.slice(0, 10), examples }));
```

## Commit 2 — one keeper rule at both doors (a test that holds the two copies together)

### Measure first (taken before any edit for commit 2; it refuted nothing)

**The instrument** is `parity.mjs` (below). It runs both rules on every town of a pool. Neither source file is edited: each
module is copied into the scratch folder with its relative imports made absolute and one export line appended. The
crisis rule is `crisisPage.js :: lodgingKeeperOf`, as written. The frame's rule is the outsider rung's own line
(`troubleCast.js` line 440 at the base), run with troubleCast's own private helpers (`rosterOf`, `crisisHeld`,
`tradeWordsOf`, `houseOf`, `idOf`) and with its `free` at the empty state: no side taken yet, the seat not yet used. The
rung's first keeper is compared with the crisis page's keeper, person and house.

**Sanity check of the instrument:** wherever the real module's owner page prints a keeper (5 crisis-pool towns, 120
golden towns), the probe's keeper is the printed one (0 disagree).

**The pools:**
- **Calm:** B2's `pool.mjs 55`, the first 55 calm births a tier, `frame-calm-<tier>-<i>`.
- **Crisis:** B7's crisis pool (`gen.mjs`'s seeds, 24 a kind).
- **Golden:** the golden master's 525 rows.

| pool | towns | agree, a keeper | agree, none | disagree | the two "free" sets differ | towns with more than one keeper |
|---|---|---|---|---|---|---|
| calm (B2's 330) | 330 | 218 | 112 | **0** | 0 | 157 |
| B7's crisis pool | 360 | 223 | 137 | **0** | 0 | 159 |
| golden master | 525 | 309 | 216 | **0** | 0 | 201 |
| **all** | **1,215** | **750** | **465** | **0** | **0** | **517** |

**What each rule takes as input, and what "free" means to each:**
- **The live roster:** the same in both. No temporary person, nobody ousted, no office stand-in, a name.
- **The order:** the same in both. Strongest by the card's `power`, then roster order.
- **The trade words:** the same in both. Role, title, house key and family, tested against `LODGING_HOUSE`.
- **The house word:** the same in both. The key less a trailing parenthesis, lower case.
- **"Free" in the crisis copy:** nobody an active crisis's stored cast holds, read through `crisisContainer(s)`. Its
  carrier order is `stressors`, then `stress`, then `stresses`.
- **"Free" in the frame's rung:** the same "held" set, read through `crisisHeld(s)`, which reads `s.stress` alone. The
  frame's `free` also excludes:
  - the people its other sides have already taken (`used`);
  - the seat, once used `FRAME_TUNING.seatSidesMax` times.

  The two "held" sets were equal on all 1,215 towns. A born record keeps `stressors` and `stress` as one object. The
  sets could differ only on a hand-built record that carries one alias and not the other.
- **The pick differs, by design:**
  - The frame chooses AMONG the rung's keepers by its hash (`castHash(seed, type, '<side>:outsider:who')`).
  - The crisis page takes the first keeper (rate 1, no hash: B7 §P1b and P1B's brief).

**A finding for the chair (not a refutation; nothing was changed for it).** Where the frame actually casts an outsider
face, it can name a different keeper from the crisis page in the same town. Frames cast an outsider face twice in the
calm pool, and never in the other pools (frames cast: calm 63, crisis 235, golden 172):
- `frame-calm-town-20` names Hulegu Khwarezm (taverns), the crisis page's keeper.
- `frame-calm-town-80` names Xenia Publicola (inn). The crisis rule names Junia Publicola (coaching inn).
  - The keepers are Xenia (power 1), Accia Cicero (2) and Junia (3).
  - Accia was already taken by the frame's "take the law into their own hands" side, through the trade rung (`used`).
  - The hash 0.639 over the two left chose the second, Xenia.

In production the two doors never open on the same town: the sheet composes no frame where a crisis is active, and the
crisis page reaches the hand only in an infiltration. So the rule is the same; the frame's choice among its keepers is
its own. If the chair wants the frame's FACE and the crisis keeper to be the same person, that is a change to a rule,
and I made none.

### What was built

- **`src/domain/tension/troubleCast.js`:** the outsider rung becomes one named, exported function,
  `lodgingKeepersOf(s, free?)`.
  - It returns the eligible keepers, strongest first, each as `{ npc, keeper, house }`.
  - `free` defaults to "nobody an active crisis's cast holds", which is the rung at the empty state.
  - `castTroubleFrame`'s outsider rung now calls it with its own `free`. The frame's other code is untouched, so the
    test holds the rung the frame really runs, not a third copy.
- **`src/domain/crisis/crisisPage.js`:** `lodgingKeeperOf` gains `export` and two comment lines. It is otherwise
  unchanged.
- **`tests/domain/crisis/crisisKeeperBothDoors.test.js`** (the name avoids the mutation manifest's patterns under rule
  39's addendum; it is not a walker), three tests:
  - **One rule, four born towns:** on `frame-calm-town-80` (calm, framed, three keepers), `frame-calm-thorp-0` (calm,
    none), `b7-infiltrated-town-0` (infiltrated, two keepers) and `b7-infiltrated-thorp-0` (infiltrated, none), the
    crisis page's keeper equals the rung's first, person and house, or both are null. Each town's measured keeper count
    is pinned. The set is asserted to hold calm and infiltrated towns, each with a keeper and with none. Uses
    `collectSeedFailures`, so it satisfies `seedLoopTotality`.
  - **The same FREE test:** with the first keeper put into the crisis cast, both rules pass over to the same second
    keeper.
  - **The same ORDER:** with the strongest keeper's `power` set to -1, the rung's first moves, and the crisis keeper
    moves with it.
- **The veil walker's "one door" still holds.** Its walk (`frameShareVeil.test.jsx`, "one door: only the sheet's
  composer imports the trouble cast") reads `src/` alone, skips `src/domain/tension`, and expects exactly
  `['src/domain/summary/tonightSheet.js']`. `crisisPage.js` still imports nothing from the trouble cast, and a test file
  is not walked. Green in the lane gate.

### Red first, then green

- **RED on the tree without the exports** (`c2-red-base.txt`): exit 1, `Tests 3 failed (3)`. All three titles fail with
  "lodgingKeepersOf is not a function".
- **RED against a deliberately broken copy. Each plant was made in the worktree file, run, then restored by copying the
  kept file back (`cmp` identical). No plant was committed. Plant 1 (`c2-plant-free.txt`):**
  - The plant: the crisis copy's free test dropped.
  - Result: exit 1, `Tests 1 failed | 2 passed (3)`.
  - The failing title: "the same FREE test: a keeper an active crisis's cast holds is passed over by both rules, for the
    same next keeper". On born towns no cast holds a keeper, as the measure found.
- **Plant 2** (`c2-plant-order.txt`):
  - The plant: the rung's order reversed, weakest first.
  - Result: exit 1, `Tests 2 failed | 1 passed (3)`.
  - The failing titles: "the two rules name the same keeper (person and house), or both none, on 4 born towns"
    (frame-calm-town-80: Junia vs Xenia; b7-infiltrated-town-0: Peppo Schubert vs Diemoda Pfeiffer) and "the same ORDER:
    strongest first, then roster order, at both doors (the strongest keeper weakened)".
- **GREEN** (`c2-green.txt`): exit 0, `Tests 3 passed (3)`.

### Byte-identity of commit 2 (`frames.mjs`, base = commit 1 `e4a5de61f` before the edit, tip = commit 2)

Every town's stored record, its trouble frame (`castTroubleFrame`), the owner's Tonight sheet and the owner's crisis page
were digested and compared (`framescmp.mjs`):

| pool | towns | framed | stored | frame | owner's sheet | owner's crisis page |
|---|---|---|---|---|---|---|
| calm | 330 | 63 | 330 | 330 | 330 | 330 |
| B7's crisis pool | 360 | 235 | 360 | 360 | 360 | 360 |
| golden master | 525 | 172 | 525 | 525 | 525 | 525 |

Every one of these is identical: 0 differ.

### Gates at commit 2

- **The lane gate** (`c2-lane.txt`: `tests/domain/crisis`, `tests/domain/tension` and
  `tests/security/frameShareVeil.test.jsx`, all whole): `Test Files 29 passed (29)`, `Tests 225 passed (225)`.
- **Importers and walkers** (`c2-importers.txt`, `c2-importers.json`; 82 files, `importers2.txt`). These are commit 1's
  60, plus every test importing `tonightSheet.js` (the trouble cast's one importer), plus `frame2NamesRule.test.js`
  (which imports `troubleCast.js`). Result: `Test Files 2 failed | 80 passed (82)`,
  `Tests 2 failed | 831 passed | 1 expected fail (834)`.
  - **Red, caused by me, left for the integrator's door:** `sovereigntyLightingContract.walker.test.js > … > THE CENSUS
    IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed`. It reads "the estate's file count moved —
    re-measure, do not re-word: expected 3717 to be 3716". My new test file is the 3717th. The baseline
    (`tests/lint/.lighting-census-baseline.json`) is outside my manifest and is re-taken by its door at the merge, as
    P1B's was.
  - **Red, not mine:** `tuningRegister.walker.test.js`, on the same three known rows as at commit 1. The trouble cast
    adds no row.
- **Typecheck and lint:**
  - `npm run typecheck:ratchet`: 167, ceiling 167.
  - `npm run typecheck:domain:strict`: 1113, ceiling 1113.
  - `npm run lint`: 0 errors (38 warnings). `eslint` on the three touched code files prints nothing.

## For the join: the readers that break ties by a card's `power`

**The line:** ties by a card's `power` are broken by:
- `troubleCast.js :: strongest` (the trade and hook rungs; office orders by a POWER's power);
- `troubleCast.js :: lodgingKeepersOf` (the outsider rung, now named; the same order);
- `tonightSheet.js`'s people to voice;
- `crisisCast.js`'s exploiter and collaborator (through `barred`);
- `crisisPage.js :: lodgingKeeperOf`.

**Which of my pins read one:**
- The keeper lines in `crisisOutsideHand.test.js`'s `REACHED` and the veil test's `P1B_TOWNS` read `lodgingKeeperOf`.
  The two-keeper towns `b7-infiltrated-town-0` and `town-1` pick by `power`. Every reached town's FREE set depends on
  `crisisCast`'s collaborator.
- The new test reads `lodgingKeeperOf` and `lodgingKeepersOf` on both sides. Its pinned keeper counts (3, 0, 2, 0) read
  no power but read the crisis cast's free set. Its equality reads `power` identically at both doors.
- The 126 owner pages of commit 1's byte-identity read `lodgingKeeperOf`.

## For the security reader

- **Commit 1:** no new holder or line. The owner's one existing line changes its words. A non-owner reader's page is
  byte-identical, 11,205 of 11,205.
- **Commit 2:** two exports, no new line on any surface. Every frame, sheet and page is byte-identical on 1,215 towns.
  The trouble cast still has one importer in `src/`.

## Judgment calls (each vetoable)

- **Measured on the rule, not on the frame's face.** The parity is measured and pinned on the RULE: the rung's keepers in
  order, with the shared free test. It is not measured on the frame's hash-chosen face, which differs in one framed town
  of 63 (`frame-calm-town-80`, above). The brief's own test design (calm and infiltrated towns, with a keeper and with
  none, most of them unframed) can only compare the rule.
- **The rung extracted rather than mirrored.** The "smallest thing" exported from `troubleCast.js` is the rung itself
  as a named function, which the frame now calls. A standalone copy for the test would have made a third copy and left
  the frame's own line untested. The rung's sort is written inside the new function; the closure's `strongest`, which
  the trade and hook rungs use, is untouched (same comparator).

### `parity.mjs` (commit 2's measure; `node parity.mjs <worktree> <calm|crisis|golden> par-<pool>.json`)

```js
// FRAME-6 · P1BF — MEASURE FIRST for commit 2: crisisPage.js :: lodgingKeeperOf against troubleCast.js's outsider rung,
// on every town of a pool. Neither source file is edited: each module is copied into this folder with its relative
// imports made absolute and ONE export line appended (the private helpers), then imported from the copy.
// argv: worktree root, pool (calm | crisis | golden), output path.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const ROOT = process.argv[2].replace(/\/?$/, '/');
const POOL = process.argv[3];
const out = process.argv[4];
const HERE = path.dirname(new URL(import.meta.url).pathname);

/** Copy a module with its relative imports made absolute and `extra` appended; import the copy. */
async function probe(rel, extra) {
  const file = ROOT + rel;
  const dir = path.dirname(file);
  const src = fs.readFileSync(file, 'utf8').replace(/(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, (_, a, p, b) => a + pathToFileURL(path.resolve(dir, p)).href + b);
  const copy = path.join(HERE, `probe-${path.basename(rel, '.js')}.mjs`);
  fs.writeFileSync(copy, `${src}\n${extra}\n`);
  return import(pathToFileURL(copy).href);
}
const page = await probe('src/domain/crisis/crisisPage.js', 'export { lodgingKeeperOf as __lodgingKeeperOf };');
const trouble = await probe('src/domain/tension/troubleCast.js', 'export { rosterOf as __rosterOf, crisisHeld as __crisisHeld, tradeWordsOf as __tradeWordsOf, houseOf as __houseOf, idOf as __idOf };');
const { LODGING_HOUSE } = await import(ROOT + 'src/domain/tension/sideArchetypes.js');
const { crisisContainer } = await import(ROOT + 'src/domain/facts/crisisKind.js');
const { generateSettlementPipeline } = await import(ROOT + 'src/generators/generateSettlementPipeline.js');
const { STRESS_TYPE_MAP } = await import(ROOT + 'src/data/stressTypes.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const str = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

/** troubleCast's outsider rung, line 440 of the base, run with the frame's OWN helpers and its `free` at the empty state
 *  (no side yet taken, the seat not yet used): the eligible keepers, strongest first. */
function rungOf(s) {
  const held = trouble.__crisisHeld(s);
  const roster = trouble.__rosterOf(s);
  const free = (n) => !!n && !held.has(trouble.__idOf(n));
  const strongest = (list) => list.map((n, i) => ({ n, i })).sort((a, b) => (num(b.n.power) - num(a.n.power)) || (a.i - b.i)).map(({ n }) => n);
  return strongest(roster).filter((n) => free(n) && LODGING_HOUSE.test(trouble.__tradeWordsOf(n)) && trouble.__houseOf(n))
    .map((n) => ({ keeper: str(n.name), house: trouble.__houseOf(n), id: trouble.__idOf(n) }));
}
/** The frame's own outsider faces, as castTroubleFrame casts them (hash among the eligible, after the other sides). */
function frameOutsiders(s) {
  const f = trouble.castTroubleFrame(s);
  if (!f) return { framed: false, faces: [] };
  return { framed: true, faces: f.sides.filter((x) => x.face?.rule === 'outsider').map((x) => ({ keeper: x.face.viaName, house: (/keeps the (.+?), where strangers lodge/.exec(x.face.reason) || [])[1] || null, side: x.label })) };
}
const heldOfPage = (s) => new Set(crisisContainer(s).flatMap((e) => (Array.isArray(e?.cast?.roles) ? e.cast.roles : [])).filter((r) => r?.kind === 'npc').map((r) => str(r.id)));
const sameSet = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

function seeds() {
  const list = [];
  if (POOL === 'crisis') {
    for (const kind of Object.keys(STRESS_TYPE_MAP)) {
      const gate = STRESS_TYPE_MAP[kind].requiresTier;
      const tiers = TIERS.filter((t) => !gate || TIERS.indexOf(t) >= TIERS.indexOf(gate));
      const per = Math.ceil(24 / tiers.length);
      for (const tier of tiers) for (let i = 0; i < per; i++) list.push({ seed: `b7-${kind}-${tier}-${i}`, cfg: { settType: tier, stressType: kind } });
    }
    return list;
  }
  if (POOL === 'golden') {
    return null;
  }
  return 'calm';
}
let list = seeds();
const rows = [];
const one = (seed, cfg, at, s) => {
  const crisis = page.__lodgingKeeperOf(s);
  // sanity: the probe's keeper is the one the real module's owner page prints, wherever it prints one
  const own = page.composeCrisisPage(s, { audience: 'owner' }).flatMap((x) => x.absent).map((a) => a.reason).find((r) => r.startsWith('an outside hand, unnamed; ')) || null;
  const realKeeper = own ? own.slice('an outside hand, unnamed; '.length) : null;
  const rung = rungOf(s);
  const head = rung[0] || null;
  const fr = frameOutsiders(s);
  const agree = (!crisis && !head) || (!!crisis && !!head && crisis.keeper === head.keeper && crisis.house === head.house);
  rows.push({
    pool: POOL, seed, at: at ?? null, tier: cfg.settType, kind: [s.stress].flat().filter(Boolean).map((e) => e.type).join('+') || 'calm',
    crisis, rungHead: head ? { keeper: head.keeper, house: head.house } : null, eligible: rung.length,
    verdict: agree ? (crisis ? 'agree-keeper' : 'agree-none') : 'disagree',
    printed: realKeeper, printedAgrees: !realKeeper || (!!crisis && realKeeper.startsWith(`${crisis.keeper} keeps the ${crisis.house}`)),
    heldSame: sameSet(trouble.__crisisHeld(s), heldOfPage(s)),
    framed: fr.framed, frameFaces: fr.faces,
    frameAgree: fr.faces.map((f) => !!crisis && f.keeper === crisis.keeper && f.house === crisis.house),
  });
};
if (list === 'calm') {
  // B2's pool.mjs 55 (FRAME-1's): the first 55 calm births a tier, seeds frame-calm-<tier>-<i>
  for (const tier of TIERS) {
    let got = 0, i = 0;
    while (got < 55) {
      const seed = `frame-calm-${tier}-${i++}`;
      const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
      const st = Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []);
      if (st.length) continue;
      one(seed, { settType: tier }, null, s); got++;
    }
  }
} else {
  if (!list) {
    const { manifestRows } = await import(ROOT + 'scripts/lib/golden-corpus-key.mjs');
    const r = manifestRows(JSON.parse(fs.readFileSync(ROOT + 'tests/fixtures/generator-golden-master.json', 'utf8')));
    list = r.map((config, at) => { const { _seed, ...cfg } = config; return { seed: _seed, cfg, at }; });
  }
  for (const { seed, cfg, at } of list) one(seed, cfg, at, generateSettlementPipeline(cfg, null, { seed, customContent: {} }));
}
fs.writeFileSync(out, JSON.stringify(rows));
const c = (v) => rows.filter((r) => r.verdict === v).length;
const faces = rows.flatMap((r) => r.frameAgree);
console.log(JSON.stringify({
  pool: POOL, towns: rows.length, agreeKeeper: c('agree-keeper'), agreeNone: c('agree-none'), disagree: c('disagree'),
  printed: rows.filter((r) => r.printed).length, printedDisagrees: rows.filter((r) => !r.printedAgrees).length,
  heldDiffers: rows.filter((r) => !r.heldSame).length, multiEligible: rows.filter((r) => r.eligible > 1).length,
  framed: rows.filter((r) => r.framed).length, frameOutsiderFaces: faces.length, frameFaceIsCrisisKeeper: faces.filter(Boolean).length,
  disagreeRows: rows.filter((r) => r.verdict === 'disagree').slice(0, 20).map((r) => [r.seed, r.crisis, r.rungHead]),
}));
```

### `frames.mjs` and `framescmp.mjs` (commit 2's byte-identity)

```js
// FRAME-6 · P1BF — commit 2's byte-identity: every town's trouble frame (castTroubleFrame), the owner's Tonight sheet and
// the owner's crisis page, digested. argv: worktree root, pool (calm | crisis | golden), output path.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const ROOT = process.argv[2].replace(/\/?$/, '/');
const POOL = process.argv[3];
const out = process.argv[4];
const { generateSettlementPipeline } = await import(ROOT + 'src/generators/generateSettlementPipeline.js');
const { STRESS_TYPE_MAP } = await import(ROOT + 'src/data/stressTypes.js');
const { castTroubleFrame } = await import(ROOT + 'src/domain/tension/troubleCast.js');
const { composeTonightSheet } = await import(ROOT + 'src/domain/summary/tonightSheet.js');
const { composeCrisisPage } = await import(ROOT + 'src/domain/crisis/crisisPage.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const digest = (v) => createHash('sha256').update(JSON.stringify(v) ?? 'undefined').digest('hex').slice(0, 16);
const rows = [];
const one = (seed, at, s) => rows.push({ seed, at: at ?? null, stored: digest(s), frame: digest(castTroubleFrame(s)), sheet: digest(composeTonightSheet(s, { audience: 'owner' })), page: digest(composeCrisisPage(s, { audience: 'owner' })), framed: !!castTroubleFrame(s) });
if (POOL === 'calm') {
  for (const tier of TIERS) { let got = 0, i = 0; while (got < 55) { const seed = `frame-calm-${tier}-${i++}`; const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} }); if ([s.stress].flat().filter(Boolean).length) continue; one(seed, null, s); got++; } }
} else if (POOL === 'crisis') {
  for (const kind of Object.keys(STRESS_TYPE_MAP)) {
    const gate = STRESS_TYPE_MAP[kind].requiresTier;
    const tiers = TIERS.filter((t) => !gate || TIERS.indexOf(t) >= TIERS.indexOf(gate));
    const per = Math.ceil(24 / tiers.length);
    for (const tier of tiers) for (let i = 0; i < per; i++) { const seed = `b7-${kind}-${tier}-${i}`; one(seed, null, generateSettlementPipeline({ settType: tier, stressType: kind }, null, { seed, customContent: {} })); }
  }
} else {
  const { manifestRows } = await import(ROOT + 'scripts/lib/golden-corpus-key.mjs');
  manifestRows(JSON.parse(fs.readFileSync(ROOT + 'tests/fixtures/generator-golden-master.json', 'utf8'))).forEach((config, at) => { const { _seed, ...cfg } = config; one(_seed, at, generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })); });
}
fs.writeFileSync(out, JSON.stringify(rows));
console.log(JSON.stringify({ pool: POOL, towns: rows.length, framed: rows.filter((r) => r.framed).length }));
```

```js
// FRAME-6 · P1BF — base vs tip of frames.mjs. argv: base.json tip.json
import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));
const k = (r) => `${r.seed}|${r.at}`; const m = new Map(b.map((r) => [k(r), r]));
const c = { towns: a.length, stored: 0, frame: 0, sheet: 0, page: 0 }; const bad = [];
for (const r of a) { const t = m.get(k(r)); for (const f of ['stored', 'frame', 'sheet', 'page']) { if (t && t[f] === r[f]) c[f]++; else bad.push([k(r), f]); } }
console.log(JSON.stringify({ ...c, framed: a.filter((r) => r.framed).length, bad: bad.length, badRows: bad.slice(0, 10) }));
```
