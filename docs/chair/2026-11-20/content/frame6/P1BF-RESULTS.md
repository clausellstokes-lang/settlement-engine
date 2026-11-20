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
