# RECEIPT — lane PROSE-REBASE (Opus 5 under a Fable 5.1 chair)
## REBASE **COMPLETE** · THE FINDING **RULED AND FIXED** · RE-RECORD **TAKEN** · THREE CARS AT `3ab6fd9d3`

⛔ **COMPLETE ON THE REBASE — AND IT ENDS ON A STOP.** The cherry-pick is clean and proved eight ways; every proof the
brief lists was executed and is quoted below. **But the sealed car carries a measured defect class that the rebase did
not create and cannot fix, and the owed re-records were NOT taken.** Nothing here is a prediction dressed as a result:
every figure carries the command that produced it, and the **three** places where my own first instrument lied are
reported in place rather than quietly re-measured.

⛔ **THE DOCK IS NOT SEALED — the fence forbids me ref writes.** `83c7b6b66` lives only as a detached worktree HEAD at
`$SC/lanePROSE` and is one `git worktree prune` from gone. **The chair should seal it to `refs/preserve/*` first.**

# ✅ HEADLINE — **RULED, FIXED, AND PROVED.** The chair ruled the STOP: those strings are field separators.
**13** of them (not the 11 the ruling listed) are reverted to byte-identity with `df7cdd37e` in `dac3b15a8`; all five
consumer sites are **0/360**, the persisted fingerprint moves **0/360**, and the fence-1 residue is **`NON_CURE_DIFFS=0`**,
which is what made the golden re-record (`3ab6fd9d3`) legitimate rather than a banked defect. THE FINDING below is kept
verbatim as the record of what was wrong and how it was measured; THE FIX CAR records what was done about it.
⛔ **One thing the chair must still act on before the landing: the voice refreeze will THROW** — see register row 2.

## 0 · WHAT LANDED

| | |
|---|---|
| Dock | `$SC/lanePROSE`, detached, **porcelain 0 at open** (`git status --porcelain \| wc -l` = 0) |
| Base | `df7cdd37e11bde8365c0322f0c882f61988865d5` — verified, = `refs/preserve/landing-clamp-2026-09-05` |
| Sealed car | `refs/preserve/srcprose-2026-09-03` = `8f4d5c648ce62fc51231110b9c4ace2127fbdd18` — **ONE commit** (`git log --oneline 30c1667bc..8f4d5c648` = 1 line; the record's "ONE car" CONFIRMED) |
| Merge-base | `30c1667bc31b9b6f7c64683fddd79a904aad3fee` — CONFIRMED by `git merge-base 8f4d5c648 df7cdd37e` |
| **Rebased car** | **`83c7b6b66`** — cherry-pick, exit **0**, `200 files changed, 1084 insertions(+), 1019 deletions(-)` — byte-for-byte the sealed span's own stat |
| Trailer | the car keeps its own `Seat: Opus 5 — Fable-unvalidated` (a cherry-picked car keeps its trailer, per the fence) |
| Hooks | none active — `$(git rev-parse --git-common-dir)/hooks` holds no non-sample hook, so the pre-commit `eslint --fix` re-staging hazard did not apply |

## 1 · ⛔ THE BRIEF'S OVERLAP SET IS 7, NOT 8 — AND THE 8TH IS AN ANCHORS PROBLEM, NOT MINE

Re-derived at the actual dock base, as the brief instructed:

```
comm -12 <(git diff --name-only 30c1667bc 8f4d5c648 | sort) \
         <(git diff --name-only 30c1667bc df7cdd37e | sort)   ⇒ 7 paths
```

`docs/content/RECEIPT_POOLS_LEGACY.md` is **NOT** in the overlap at `df7cdd37e`: `git diff --name-only 30c1667bc
df7cdd37e -- docs/content/RECEIPT_POOLS_LEGACY.md` is EMPTY. The chair's 8 came from LIGHT-PLAN §3, which measured
against `272dbd2da` — and `git merge-base --is-ancestor 272dbd2da df7cdd37e` says **NO**. `272dbd2da` is clamp+ANCHORS
over `90702c3e9`; my base is the clamp landing without ANCHORS. The two tips are siblings, not a line.

⛔ **A CORRECTION THE CHAIR NEEDS BEFORE THE REPLAY.** The brief states *"The ANCHORS consist (4 cars, **none in the
overlap set**)"*. That is false:

```
git log --oneline 30c1667bc..272dbd2da -- docs/content/RECEIPT_POOLS_LEGACY.md
  2a7550741 §894: the twelve mutilated anchors are de-slugged, and their pins moved in the same act
git diff --numstat 30c1667bc 272dbd2da -- docs/content/RECEIPT_POOLS_LEGACY.md   ⇒ 81  35
```

`2a7550741` is an ANCHORS car and it rewrites 81/35 lines of a file the prose car also edits (+1/−1). **When the chair
replays this car onto the ANCHORS tip, `RECEIPT_POOLS_LEGACY.md` becomes an 8th conflict.** Its prose side is one line;
the resolution is pre-derived in §2 row 8 so the replay does not have to re-find it.

## 2 · THE RESOLUTION TABLE — 7 REAL + 1 PRE-DERIVED FOR THE REPLAY

⛔ **Every one of the 7 AUTO-MERGED. Exit 0, no `<<<<` markers anywhere — which is precisely the condition the brief
warned is not a proof.** So none of these rows rests on the merge's silence. Each is proved twice, in both directions,
plus module evaluation:

- **the cure survived**: `git diff -U0 df7cdd37e HEAD -- <p>` +/− content is **byte-identical** to `git diff -U0 30c1667bc 8f4d5c648 -- <p>`
- **the mainline survived**: `git diff -U0 8f4d5c648 HEAD -- <p>` +/− content is **byte-identical** to `git diff -U0 30c1667bc df7cdd37e -- <p>`
- **the file still is a module**: `node -e "import('./<p>')"` exit 0, export count recorded

⚠ The first pass of this comparison was a **FALSE GREEN** and is reported rather than buried: written in zsh, `for p in
$PATHS` does not word-split, so one iteration ran with the whole list as a single pathspec, git matched nothing, and two
empty strings compared equal — "IDENTICAL" for all seven, measured on nothing. Re-run under `/bin/bash` with an explicit
vacuity guard (`a=0 ⇒ VACUOUS`, `fail=1`). The line counts below are that guard's own output.

| # | path | prose side | mainline side | resolution | proof |
|---|---|---|---|---|---|
| 1 | `src/domain/display/defenseDisplay.js` | +4/−4 | +4/−16 | both kept; disjoint lines | PROSE-OK 8 lines · MAINLINE-OK 20 lines · eval OK, 8 exports |
| 2 | `src/domain/display/dossierViewModel.js` | +5/−5 | +15/−7 | both kept; disjoint lines | PROSE-OK 10 · MAINLINE-OK 22 · eval OK, 13 exports |
| 3 | `src/domain/display/settlementRumors.js` | +1/−1 | +4/−0 | both kept; the frame pool grew on the mainline, the cure moved one existing frame | PROSE-OK 2 · MAINLINE-OK 4 · eval OK, 15 exports |
| 4 | `src/domain/region/propagation.js` | +1/−1 | +7/−2 | both kept; disjoint | PROSE-OK 2 · MAINLINE-OK 9 · eval OK, 8 exports |
| 5 | `src/domain/rulingPowerCoup.js` | +2/−2 | +47/−0 | both kept; the mainline is a pure 47-line addition, the cure touches two pre-existing verdict sentences | PROSE-OK 4 · MAINLINE-OK 45 · eval OK, 5 exports |
| 6 | `src/domain/worldPulse/npcLadderKernel.js` | +6/−6 | +6/−5 | both kept; disjoint | PROSE-OK 12 · MAINLINE-OK 11 · eval OK, 8 exports |
| 7 | `src/domain/worldPulse/warReceiptPools.js` | +5/−5 | +13/−0 | both kept; the mainline adds pool rows, the cure moves five existing ones | PROSE-OK 10 · MAINLINE-OK 13 · eval OK, 4 exports |
| 8 | `docs/content/RECEIPT_POOLS_LEGACY.md` | +1/−1 | **not a conflict here**; +81/−35 at the ANCHORS tip | **PRE-DERIVED for the replay** (§1) — the prose side is a single annex row; keep the ANCHORS de-slugging wholesale and re-apply the one-line mark change to the row it names | not exercised at this base — flagged, not claimed |

**The applied cure, verbatim (the 7 paths, `git diff -U0 df7cdd37e HEAD`):** 28 lines, every one a punctuation
substitution inside an existing sentence — em dash → period (13), → colon (10), → comma (3), and 2 clause re-joins.
Not one hunk touches a mainline-introduced line.

### RETIRED cures: **NONE — zero.**
No cured sentence had vanished from the mainline. The proof is the numstat identity in both directions: the prose delta
applied at HEAD is `4/5/1/1/2/6/5` insertions — *exactly* the sealed car's per-path counts — so no hunk was dropped,
skipped, or fuzzed. A retirement would have shown as a shortfall on the prose side; there is none.

## 3 · N — THE ENGINE-SIDE EMITTED-TEXT REACH

**Method (stated because "emitted" is a claim, not a grep).** For every `.js/.jsx/.mjs` path in the span I parsed the
base blob and the HEAD blob with **espree** — the repo's own parser — and compared the sorted multiset of `Literal`
(string), `TemplateElement.cooked` and `JSXText` values. **Comments and docblocks are not literals, so they are excluded
by construction**, which is exactly the "not merely docblocks/comments" the brief asks for.

```
TOTAL_JS_PATHS_IN_SPAN=194   LITERALS_MOVED_PATHS=193   LITERALS_UNCHANGED_PATHS=1   ERRORS=0
```

| set | paths |
|---|---|
| span, all | **200** (194 JS + 6 `docs/content/RECEIPT_POOLS_*.md` annexes) |
| `src/**` | 179 |
| `src/domain/**` | **113** — all 113 move literals |
| **`src/domain/**` outside `display/` = ENGINE-SIDE** | **94 — all 94 move literals** |
| `src/domain/display/**` | 19 — all 19 move literals |

### ⇒ **N = 94.**

⚠ **A chair figure corrected.** LIGHT-PLAN §3 says *"113 of those are `src/domain/` outside `display/`"*. Measured:
113 is `src/domain` **including** display; outside display it is **94** (`git diff --name-only df7cdd37e HEAD | grep
'^src/domain/' | grep -v '^src/domain/display/' | wc -l` = 94, display = 19, 94+19 = 113). The ordering argument that
figure supports is untouched — 94 engine-side paths still contaminate a later-measured dark control — but the number in
the declaration must be 94.

**The one path whose literals did not move** is `tests/components/powerTabSupport.test.jsx`, and it is a *good* result:
its change is inside a **regex literal** (`/…claimants circle: Claimant Bloc A…/`), which espree types as a RegExp, not
a string — a consumer pin moved with the prose, correctly invisible to a string-literal walker. The walker is not
over-counting.

**Dev-register control.** Of every `+` line the cure adds across the 94 engine-side paths, the count sitting in a
`console.` / `throw new` / `new Error(` / `assert(` context is **0**. The moved literals are reader prose, not
diagnostics.

### The declaration's last clause, PROVEN EMPTY

| claim | command | result |
|---|---|---|
| no rules value moved | `git diff --stat df7cdd37e HEAD -- src/domain/worldPulse/simulationRules.js` | **EMPTY** |
| no preset moved | only preset-named path in the span is `src/domain/worldPulse/temperamentPresets.js`; its whole delta is **one `description:` string** (`'Every gear turning at once — the ceiling…'` → `': the ceiling…'`) — a reader sentence, not a preset value | **no value moved** |
| no flag moved | `FLAG_DEFAULTS` lives in `src/lib/flagRegistry.js`, `src/lib/flags.js`, `scripts/audit/town-scene-certification.mjs`, 2 tests — **none is in the span** | **EMPTY** |
| no detector/scanner source moved | `git diff --name-only df7cdd37e HEAD | grep -E '^(schema|scripts)/'` | **(none)** |

⇒ **the sentence the chair owes LGT-REG-DECL, with N filled in and every clause measured:**
> *"1,001 reader sentences across 200 paths were cured; emitted text moves on **94** engine-side paths; no rules value,
> no preset and no flag moved."*

## 4 · THE SHIFT'S OWN RECEIPT — A FIXED-SEED DRIVE, BEFORE AND AFTER

A pristine base tree (`git archive df7cdd37e src tests`, the dock's **own** `node_modules` **symlinked**, never
materialised) and the dock tip, driven by one script through consumers that reach engine-side cured paths:
`resolveCoupVerdict` over 13 fixed seeds (a `mulberry32` the driver owns, so the seed is pinned, not sampled), the whole
frozen `WAR_RECEIPTS` pool drawn at head/middle/tail of every key, `HEADLINE_FRAMES`, and five display derivations over
6 fixed settlements. Both runs exit **0**; the outputs are 358 lines each.

```
diff drive-BASE.json drive-HEAD.json   ⇒ exit 1, 28 changed lines per side
```

**Every changed line is punctuation inside emitted text, and nothing else moved:**
- `holds=`, `winner=`, and every numeric verdict field are **identical on all 13 seeds** — the same seed still draws the
  same variant, which is the DECLARED-SHIFT's own claim, now executed rather than asserted.
- every `len=` line for every `WAR_RECEIPTS` key is **unchanged** ⇒ **no pool length and no pool key moved**.
- the changes are e.g. `…against the seat — the plot collapses…` → `…against the seat. The plot collapses…`;
  `Availability limited — restricted…` → `Availability limited: restricted…`.

This is the receipt for the behaviour shift: **text moves, draw does not.**

## ⛔⛔ THE FINDING — THE SEALED CAR CURES FIVE **STRUCTURAL BAND SEPARATORS**, AND THREE LIVE DISPLAY CONSUMERS BREAK

**This is a STOP. It is not a rebase problem — the rebase is clean. It is a defect in the sealed car itself, and it is
measured, not argued: 360 driven settlements, the same corpus the fence-1 golden uses, base vs tip.**

### How it surfaced
`espionageDormancyFence.test.js` FENCE 1's driven golden demands *"FIND THE MOVER — and attribute it to zero residue —
before touching this constant."* I replicated it outside vitest and the base run reproduced the committed constant
**exactly** (`72acacd8583f70f6b0a5a551ad067f32eb35060e5e08cf8589e8e2135a5c4f6d`), which is the positive control that the
replication is faithful. At the tip it moves to `16b1b14d6e1814c5cbe747a116979735a80c8ecd6602b5d733fadd1d88bb7d16`.
Attributing that move leaf by leaf over all 360 settlements is what found this:

```
settlements_compared=360   total_leaf_diffs=11855   by_kind={"STRING":11855}
string_diffs_that_are_PURE_emdash_cures=11825      NON_CURE_DIFFS=30
```

⭐ **Every one of 11,855 differing leaves is a STRING.** Not one TYPE, LENGTH, KEYS, number or boolean moved anywhere in
360 settlements — the strongest possible statement of "text moved, structure did not". But **30 were not sentence
punctuation**, and they are the finding.

### The class: `"<Band> — <Condition>"` is a FIELD SEPARATOR, and the car cured five of them as if they were prose

Five generated fields share one shape — a band word, ` — `, then a condition — and **live code splits on that dash to
recover the band**. The car's own rule names this class exactly:

> *"A producer is parse-coupled if ANY consumer splits on its dash, and a consumer can live in `tests/`, in a `.jsx`
> component, or inside a regex."*

It found four such producers and reverted them at cause. It did not find these. Driven over the same 360 settlements:

| consumer (verbatim expression) | BROKEN on | before → after |
|---|---|---|
| `SummaryTab.jsx:213` `eco.economicComplexity?.split('—')[0].trim()` | ⛔ **186/360 (52%)** | `"Highly diversified"` → `"Highly diversified: multiple major revenue streams"` (83x), `"Subsistence"` → `"Subsistence: survival economy"` (66x), +2 more |
| `SummaryTab.jsx:212` `powStab.split(';')[0].split('(')[0].split('—')[0].trim()` | ⛔ **50/360** | `"Desperate"` → `"Desperate: hunger is eroding order"` (14x), `"Fractured"` → `"Fractured: no stable governing authority"` (12x), +3 more |
| `OverviewTab.jsx:301` `sp.safetyLabel?.split('—')[0].trim()` | ⛔ **8/360** | `"Dangerous"` → `"Dangerous: Plague Unrest"` |
| `safetyProfile.js:218` `safetyLabels.slice(1).map(l => l.split(' — ')[1] \|\| l)` — **the producer parses its own labels** | ⛔ **8/360** | `[1]` becomes `undefined`, so `\|\| l` appends the WHOLE label instead of the condition |
| `dailyLifeLogic.js:74` `(sp.safetyLabel \|\| '').split(':')[0].trim()` | ⚠ **8/360** | a parser that was a **no-op on every label** now truncates one: `"Dangerous — Plague Unrest — Plague Conditions"` → `"Dangerous"` |
| `aiLayer.js:140` `via.summary?.split('—')[0]` | ✅ 0/360 | unaffected |
| `settlementNarrative.js:32` `rel.description.split('—')[1]` | ✅ 0/360 | unaffected |

These are **compact tiles and status tags** — `SitTile value=`, `StatusTag value=` — whose whole purpose is the band
word. They now render the band plus its gloss.

⚠ **A FALSE REPORT I CAUGHT BEFORE MAKING IT.** My first pass measured `settlementNarrative.js:32` against
`powerStructure.factionRelationships[].description` and got **300/360** — a headline number. It is **wrong**:
`genRelNarrative` is fed `settlement.relationships[]` (NPC relationships, `npc1Name`/`npc2Name`), a different collection,
whose `description` carries no em dash at either tip. Re-measured against the real collection: **0/360, unaffected.**
The 300/360 figure describes a field nothing parses. It is struck.

### The cure sites — all four files are in the span, all four cures are one-line reverts

| file | what to restore | consumers it repairs |
|---|---|---|
| `src/generators/economy/prosperity.js` | 4 `economicComplexity` bands (`Subsistence`, `Highly diversified`, `Diversified`, `Concentrated`) | SummaryTab:213 (186/360) |
| `src/generators/power/governanceNarrative.js` | 5 `stability` bands (`Shaken`, `Desperate`, `Volatile`, `Fractured`, `Anxious`) | SummaryTab:212 (50/360) |
| `src/generators/safetyProfile.js:119` | `'Dangerous — Plague Unrest'` | OverviewTab:301, safetyProfile:218, dailyLifeLogic:74 (8/360) |
| `src/generators/foodGenerator.js:342` | `'Deficit — Active Famine'` | the economy fingerprint (14/360) |

**The rest of `safetyProfile.js` is evidence the car knew this class:** it left 20 sibling `Band — Condition` labels
alone (`:87`, `:222`, `:229`) and its `:470–471` exact-equality comparisons are the *"2 literals that are COMPARED
rather than displayed"* the car's exemption list names. It exempted the compared pair and cured one displayed sibling.

⚠ **A stale pin rides along:** `tests/domain/safetySeverity.test.js:53` still lists `'Dangerous — Plague Unrest'`. That
file is not in the span, so at this tip a test names a string `src` no longer emits.

### ⛔ AND A CLAUSE OF THE DECLARATION IS FALSE

The car's DECLARED BEHAVIOUR SHIFT states: *"**Text is never a hash input**, and no pool length or pool key moved."*
The second half holds — every `WAR_RECEIPTS` pool length is byte-identical (§4). **The first half does not.**

`src/generators/power/economyReconciliation.js:96` hashes a 5-tuple —
`[version, tier, prosperity, safetyLabel, foodLabel]` — into `powerStructure.economyInputFingerprint`, which is
**PERSISTED ON THE SETTLEMENT**. `safetyLabel` and `foodLabel` are reader-facing display strings, and both were cured:

```
settlements=360  fingerprint_moved=22
prosperity: changed on 0
safetyLabel: 8x  "Dangerous — Plague Unrest — Plague Conditions" -> "Dangerous: Plague Unrest — Plague Conditions"
foodLabel:  14x  "Deficit — Active Famine"                       -> "Deficit: Active Famine"
```

⚠ **The lifecycle risk, stated precisely.** `assertPowerEconomyFreshness` recomputes the fingerprint and **throws** when
it differs from the persisted one (*"Power/economy freshness invariant failed"*). Within a single generation both sides
recompute from the same tree, so nothing throws today — the 360-settlement drive is `errors=0` at both tips. The hazard
is the **cross-version** path: a settlement persisted before the cure, re-asserted after it, composes a new
`safetyLabel`/`foodLabel` and mismatches its stored fingerprint. Pre-launch that is bounded by "no saved worlds"; it
stops being bounded the moment worlds are saved, and **any future prose cure to a band label re-arms it.**

⇒ **the declaration sentence must not ship as written.** Either revert the four band files (then the clause is true
again and the fingerprint stops moving), or amend it to: *"…emitted text moves on 94 engine-side paths; no rules value,
no preset and no flag moved; and the persisted `economyInputFingerprint` moves on 22 of 360 driven settlements because
two of its four inputs are display labels."*

### What I did about it: **NOTHING — reported, not repaired.**
Reverting is the car's own precedent, and the one-line shape is tempting. I did not take it: the car is **sealed and
chair-approved**, the set is five producers across four files rather than one, and the brief's own rule for this
situation is *"anything else is a finding — STOP on it and report."* Re-cutting a sealed car is the chair's act. The
measurements, the cure sites and the one-line reverts are all above, ready to execute on a ruling.

### ⭐ A SECOND BYTE-TWIN PROOF, AT THIS TIP

The car's *"28 byte-twins, both sides, one commit"* claim was verified at ITS base, not this one. Re-verified here, on
the rebased tree: every cured annex row is normalised (slot placeholders dropped, row-number prefix stripped, whitespace
collapsed) and looked for among the espree-parsed string and template literals of all of `src/`:

```
cured annex rows examined = 28    byte-twin FOUND in src = 28    NO twin found = 0
```

⚠ **My first version of this check reported 27 of 28 MISSING.** It was a false-negative machine: annex rows spell slots
`{settlement}` while `src` spells the same holes as template expressions, so a literal match could never succeed, and the
probe was also swallowing the `5. ` row-number prefix. Reported here rather than buried, because the wrong number was
alarming and would have sent the chair hunting a break that does not exist. **28/28 is the corrected figure.**

The annexes were never at risk of a merge collision either: across `30c1667bc..df7cdd37e` the mainline touched exactly
one annex, `RECEIPT_POOLS_DOSSIER_STATE.md` (+5/−3), and the prose car does not edit that file. The six it does edit
(`CAUSAL`, `FAITH`, `GRAMMAR`, `LEGACY`, `TRADE`, `WAR`) are untouched by the mainline at this base.

### ⛔⛔ THE QUIET-WINDOW PROBE MEASURED ITS OWN REFLECTION — AND SO DOES THE ONE THE SIBLING LANES RUN

The law is *"zero `[v]itest/dist/workers` processes for three consecutive 60-second probes"*. Over **fourteen**
consecutive probes it never once reached zero, sitting at 11–12 and then 5–8 long after the load had collapsed from
71.09 to 2.83. Reading `ps -Ao pid,ppid,etime,pcpu,command` instead of counting it:

**every single one of the remaining 7 matches was a probe process, not a test runner.** The probe's own command line
contains the literal text `[v]itest` and `dist/workers`, so `ps | grep -E "[v]itest|[d]ist/workers"` matches **itself**,
my `tail -f … | grep -E …` monitor, and every sibling lane's identically-shaped probe. The count has a **floor above
zero that rises with the number of lanes watching**, so the condition is unsatisfiable by construction.

⚠ **This is not only my bug.** A sibling lane's probe visible in `ps` runs
`W=$(ps -ax -o command | grep -c '[v]itest/dist/workers')` — the same self-match. **Any lane obeying the quiet-window law
as written waits forever**, and the more lanes that obey it, the further from zero the count sits.

**The authority that does not lie is the repo's own**: `sh scripts/gate-mutex.sh` reported
`gate-mutex: FREE — no held lock or Vitest runner outside this process's ancestry.` (exit 0), with `load1 = 2.83`.
⇒ every vitest run below was taken under `sh scripts/gate-mutex.sh --run --`, the EXCLUSIVE tier, which acquires the
atomic lock and drains other runners — the actual mutual exclusion, rather than a count of my own shadow.

## 5 · THE REGISTER DELTAS — PREDICTED IN WRITING, MEASURED WITHOUT TOUCHING A DOOR

⛔ **No register act was taken. `UPDATE_VOICE_BASELINE` was never set.** The figures below come from a standalone script
that **replicates `tests/copy/voiceMechanics.test.js`'s Tier-2 counting exactly** — both counters, the char tokenizer and
the espree one — run over the base tree and the tip tree. They are what the instrument will report; the vitest run owes
only confirmation.

Committed baseline (`tests/copy/.voice-mechanics-baseline.json`, untouched by both the car and the mainline):
**102 entries, em 455, bang 10.** Budgets in the test: `EM_BUDGET = 670`, `BANG_BUDGET = 15`.

**Executed at both tips** — each arm's own predicate replicated and run against the base tree and the rebased tree, so
BEFORE is a measurement, not a memory:

| arm | BEFORE (`df7cdd37e`) | AFTER (`83c7b6b66`) | verdict |
|---|---|---|---|
| **E2 Tier-2 TOTAL** | **FAIL** — em **770** by the counter the base test actually ships (the char tokenizer), **779** by the espree counter the car installs; budget **670** either way | **PASS** — em **311** ≤ 670, bang **8** ≤ 15 | ⭐ **the car turns a standing red GREEN** |
| **E2 Tier-2 per-file** | FAIL — **69** drifted by the shipped counter (74 by espree): **68 RISES, 1 fall** | FAIL — **126** drifted: **89 FALLS, 37 rises** | magnitude grows, debt falls (below) |
| **E-E Tier-3 per-file JSX** | FAIL — 15 drifted | FAIL — **15 drifted, byte-identical** | ⛔ **PRE-EXISTING — the car moves it by 0** |
| **E-E Tier-3 total JSX** | FAIL — em **37** > budget 6 | FAIL — em **37** > budget 6 | ⛔ **PRE-EXISTING — identical** |
| files carrying Tier-2 debt | 160 | 55 | −105 |
| `proseLeak` | — | **PASS** | predicted and confirmed |

⇒ **four voiceMechanics arms red at base, three at this tip.** The car retires one and reds none — which is exactly what
the car's own body claimed, now re-confirmed at a base it was never measured against.

⭐ **THE CHAIR'S RECORDED READING OF THE PER-FILE ARM IS TOO HARSH, AND THE SPLIT SHOWS WHY.** The car's body and the
plan both read `69 → 126` as *"the instrument punishes the cure"*. Measured by direction, it does the opposite:

- at base the 69 drifted files are **68 RISES and 1 fall** — 68 files that grew em dashes since the freeze and were never
  re-baselined. That arm was **already red, on mainline debt, before this car existed.**
- at the tip the 126 are **89 FALLS and 37 RISES**. The car adds 89 wins and **retires 31 of the 68 standing rises.**

So the magnitude grows because *falls* are counted the same as *rises*, not because the cure created debt. **After the
chair's refreeze the baseline becomes 55 entries / em 311 / bang 8 — a fall on both totals, so
`writeShrinkOnlyBaseline` will ACCEPT it** (it refuses only a rising total). The 37 residual rises are mainline debt the
refreeze banks; they are named in `$SC/prose-rebase-scratch/voice-split.mjs` output and are **not this car's**.

### ⭐ THE VOICE ARMS, EXECUTED — AND TWO OF THE THREE REDS ARE NOT MINE

`sh scripts/gate-mutex.sh --run -- npx vitest run tests/copy/voiceMechanics.test.js tests/copy/proseLeak.test.js`
⇒ **`VOICE_EXIT=1`**, `Test Files 1 failed | 1 passed (2)`, `Tests 3 failed | 35 passed (38)`, duration 3.36s.

- ✅ **`tests/copy/proseLeak.test.js` PASSES** — exactly as predicted (its ratchet is the JSX baseline, and no `src` `.jsx` is in the span).
- ✅ **the E2 Tier-2 TOTAL arm PASSES** — the standing red at base (em 770 > budget 670) is **gone**; measured 311.
- ⛔ **2 of the 3 reds are the Tier-3 JSX arms, and they are PRE-EXISTING.** Proven, not asserted: the test's **own**
  helper (`tests/helpers/jsxLiteralWalk.js`) run over both trees returns byte-identical figures —

  ```
  BASE df7cdd37e : jsx_files_scanned=526 files_with_debt=17 total_em=37 total_bang=0 drifted=15
  HEAD 83c7b6b66 : jsx_files_scanned=526 files_with_debt=17 total_em=37 total_bang=0 drifted=15
  ```

  and all 15 drifted files are `src/components/**/*.jsx` (`AccountIdentitySection`, `FoundersHallPage`,
  `HeraldGazetteer`, `PerspectiveStandings`, `WarTab`, …) — **not one of which is in the span**, which contains zero
  `src` `.jsx` files. `expected 37 to be less than or equal to 6` measures **mainline** debt against a budget of 6; my
  car moves it by exactly **0**.
- ⛔ the third red is the **E2 Tier-2 per-file arm**, at the predicted magnitude — the one the chair's refreeze banks.

### Register acts still owed to the chair (I took none)
voice baseline `UPDATE_VOICE_BASELINE=1` (banks the fall above) · writer-reach `--write` **plain, never `--genesis`** ·
the test ratchet · the `tests/lint/` scanner family · **prose-numerics** — path-and-line addressed, so 1,084 moved lines
relocate its rows; the fence names it the chair's, so I did not touch it.

## 6 · THE OWED RE-RECORDS — **NOT TAKEN**, AND THE THREE SEPARATE REASONS

The car's body records eight files / eleven assertions owed. **The enumeration exists nowhere in the tree or in any
preserve ref** — I searched the ledger, `emdash-2026-09-03`, `emdash-annex-2026-09-03`, `readerreview2-2026-09-03`; all
are product trees, none carries the lane's scratch receipt. What I could bind by measurement:

| owed artefact | status | why not taken |
|---|---|---|
| `espionageDormancyFence.test.js:262` `PRE_COUPLING_CORPUS_SHA` | **delta MEASURED**: `72acacd8…` → `16b1b14d…`, anti-vacuity arms hold at both tips (rows 360, distinct 360, errors 0) | ⛔ **STOPPED BY THE FINDING.** Its own message demands the mover be attributed *"to zero residue"*. It is not zero: **30 of 11,855 leaf diffs are not sentence punctuation** and 22 settlements move a persisted fingerprint. Re-recording this constant now would bank a defect as a golden. |
| `tests/design/organicSamples.test.js` + `docs/samples/organic-craft/*.html` | **WILL RED** — `src/components/organic/samples/fixtures.js` is in the span (+6/−6), the 3 committed HTML fixtures are not, and the test byte-matches a fresh SSR render | ⛔ its re-record is `UPDATE_ORGANIC_SAMPLES=1`, and the preamble forbids a lane **any `UPDATE_*` env var**. Chair's act. |
| `tests/lint/.prose-numerics-baseline.json` | 1,352 rows, path-and-line addressed; 1,084 moved lines relocate them | ⛔ the fence names the prose-numerics freeze the **chair's**. |
| `generatorGoldenMaster` (525 rows), the four edge-function bundles | not measured | the bundles need `npm run build`, which the fence forbids. |

**A content-search census of what is stale, run as a single pass over 823 non-`src` tracked files** (677 distinct
cured-sentence probes): **15 artefacts store a sentence the cure moved** — `docs/samples/organic-craft/{dossier-desk,
dossier-field,pricing-desk}.html`, `docs/GOLDEN_SHIFT_LEDGER.md`, `docs/SETTLEMENT_CAPABILITY_ATLAS.md`,
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, `tests/lint/.prose-numerics-baseline.json`, and 8 historical review docs.
⚠ **Exactly one lives under `tests/`**, and it is the chair's. ⚠ **This instrument is blind to a DIGEST golden** — the
car made that exact mistake once and corrected itself; I repeat the caveat rather than inherit the false confidence.

## 7 · PROOFS — EXITS, QUOTED

Every vitest run below was taken under `sh scripts/gate-mutex.sh --run --` (EXCLUSIVE tier). The first inspection
returned `HELD by atomic lock PID 58238: … tests/domain/warFaithStateProseDesk.test.js` — a sibling lane — and the mutex
**blocked until it drained**, which is the exclusion actually working.

| proof | command | exit / output |
|---|---|---|
| cherry-pick | `git cherry-pick 8f4d5c648` | **0** — 7 paths auto-merged, `200 files changed, 1084 insertions(+), 1019 deletions(-)` |
| module evaluation ×7 | `node -e "import('./<p>')"` | **0 × 7** (exports 8/13/15/8/5/8/4) |
| two-direction content identity | `/bin/bash` loop + vacuity guard | `FAIL=0` — 7 PROSE-OK, 7 MAINLINE-OK |
| byte-twins at this tip | `twins.mjs` | **0** — 28 examined, **28 found**, 0 missing |
| **`npm run typecheck:domain:strict`** | as named | **exit 0** — `✓ no strict-type regressions (1120 errors, ceiling 1120)` |
| **`npx eslint`, 194 touched files** | `-f json` + negative control | **exit 0** — `files_reported=194 errors=0 warnings=0`; a seeded parse error returns exit 1, so the linter is live, not vacuous |
| **VOICE** `voiceMechanics` + `proseLeak` | mutex `--run` | **`VOICE_EXIT=1`** — `Test Files 1 failed \| 1 passed (2)`, `Tests 3 failed \| 35 passed (38)` |
| **LINTDIR** `tests/lint/` WHOLE | mutex `--run` | **`LINTDIR_EXIT=1`** — `Test Files 3 failed \| 135 passed (138)`, `Tests 4 failed \| 2127 passed (2131)` |
| **OWED** `espionageDormancyFence` + `organicSamples` | mutex `--run` | **`OWED_EXIT=1`** — `Test Files 2 failed (2)`, `Tests 2 failed \| 23 passed (25)` |
| TOUCHING — 95 test files referencing the 7 paths | mutex `--run` | see below |
| fixed-seed drive ×2 + diff | `seed-drive.mjs` | **0**, **0**; diff exit 1, 28 lines/side, all punctuation |
| fence-1 golden ×2 | `fence1.mjs` | **0**, **0** — base **reproduces the committed constant** |
| literal-delta walker | `literal-delta.mjs` | **0** — 193/194 moved, ERRORS=0 |

### The `tests/lint/` failing arms, named — **re-run with FULL capture, identical both times**

The first run's `tail -80` truncated the `[1/4]` and `[4/4]` headers, so I re-ran the whole directory capturing
everything. Same verdict twice: `Test Files 3 failed | 135 passed (138)`, `Tests 4 failed | 2127 passed (2131)`.

| # | failing arm | disposition |
|---|---|---|
| 1 | `clampPrimitiveBaseline.test.js` › *baseline exactly matches the files that still define a local clamp/clamp01* | ✅ **THE PERMITTED RED** — the brief names this as the only arm allowed to be red. Not mine. |
| 2 | `proseNumerics.test.js` › *path + line + category + snippet debt exactly matches the committed baseline* | ⚠ **MINE, PREDICTED** — a relocation, e.g. `stressConfirmPass.js:127` `…roster-blind roll) — the re-weighted…` → `…): the re-weighted…`. Chair's register act. |
| 3 | `proseNumerics.test.js` › *the baseline itself has exact, unique, source-verifiable identities* | ⚠ **MINE, PREDICTED** — `src/domain/activeConditions.js:983 no longer contains its frozen snippet`. Same cause. |
| 4 | `wizardNewsAuthoring.walker.test.js` › *the frozen legacy ledger is exact, location-bound, and shrink-only* | ⚠ **MINE, PREDICTED-BY-CLASS** — a **second** location-bound frozen ledger, the same shape as prose-numerics. It is **not** in the car's owed list; the chair should add it. |

⛔ **A CORRECTION TO MY OWN EARLIER LINE IN THIS RECEIPT.** I first wrote *"`clampPrimitiveBaseline` is GREEN — it
appears nowhere in the failure output."* **That was false, and it was false for the textbook reason:** I grepped a log
that `tail -80` had already truncated, and read absence-from-a-truncated-file as absence-from-the-run. It is **red**, it
is the **permitted** red, and the full-capture re-run above is the receipt. The claim is struck.

⇒ **no unexpected scanner-family red.** Every red in the 138-file directory is either the permitted clamp row or a
frozen-location ledger the cure relocated.

### The OWED arms — both reds are the ones I predicted offline, and both are barred to a lane

- `organicSamples.test.js` › *each committed fixture is byte-identical to a fresh SSR render* —
  `dossier-desk.html is stale — regen with UPDATE_ORGANIC_SAMPLES=1`. **Predicted in §6 before the run.** The door is an
  `UPDATE_*` env var; the preamble forbids a lane every one. Chair's act.
- `espionageDormancyFence.test.js` › *THE DRIVEN GOLDEN: 360 settlements at this tip hash to the PRE-COUPLING corpus* —
  the constant I had already measured offline (`72acacd8…` → `16b1b14d…`). Its message demands the mover be attributed
  *"to zero residue"*. **It is not zero — see THE FINDING. Not re-recorded.**


### The TOUCHING run — 95 test files that reference the 7 overlapping modules

`Test Files 3 failed | 92 passed (95)` · `Tests 6 failed | 2655 passed | 22 skipped (2683)` · `TOUCHING_EXIT=1`,
reproduced identically on a full-capture re-run.

⭐ **All six failures are register/golden instruments already accounted for. Not one is a consumer pin, a domain
assertion, or a display test.** The 7 resolved files' own tests — `dossierViewModel.test.js`, `settlementRumors.test.js`,
`npcLadderKernel.test.js`, `rulingPower.test.js`, `warTermination.test.js`, `powerTabSupport.test.jsx` and the rest —
**all pass.** That is the behavioural proof of the eight resolutions, on top of the byte-identity and module-evaluation
proofs in §2.

| failing arm | already known as |
|---|---|
| `voiceMechanics` › E2 Tier-2 per-file debt | §5, the refreeze the chair banks |
| `voiceMechanics` › E-E Tier-3 per-file JSX debt | §5, **proven pre-existing** (identical at base) |
| `voiceMechanics` › E-E Tier-3 total JSX debt | §5, **proven pre-existing** (37 at both tips) |
| `proseNumerics` × 2 | §7, the relocations |
| **`generatorGoldenMaster.test.js` › every config produces byte-identical output to the golden master** | ⚠ the **525-row golden** the car lists as owed — **CONFIRMED red**, and it is a `UPDATE_*`-door re-record, so not a lane's |


## ⭐ THE FIX CAR — THE CHAIR'S RULING, EXECUTED

**Ruling received:** the five `"<Band> — <Condition>"` strings are FIELD SEPARATORS, not reader prose; the sealed car's
cure of them was a category error and the fingerprint movement is the same error one layer down.

| car | sha | what |
|---|---|---|
| 1 | `83c7b6b66` | the rebased prose car (unchanged; keeps its own trailer) |
| 2 | **`dac3b15a8`** | **THE FIX CAR** — 13 structural separators reverted to byte-identity with `df7cdd37e` |
| 3 | **`3ab6fd9d3`** | **THE RE-RECORD** — `PRE_COUPLING_CORPUS_SHA`, taken because the residue is now zero |

Dock `$SC/lanePROSE` at `3ab6fd9d3`, **porcelain 0**. No amend; three separate cars; cars 2 and 3 carry
`Seat: Opus 5 — Fable-unvalidated` + `Lane: PROSE-REBASE`.

### ⛔ THE SET IS THIRTEEN STRINGS, NOT ELEVEN — the file set is four, exactly as ruled

The ruling told me to enumerate from my own drive rather than from its list, and the drive alone would have **missed
two**: the corpus is a single culture (6 tiers × 4 routes × 15 seeds), so a band string it never renders is invisible to
it. I enumerated instead from the **consumer** side — the seven `split('—')` sites and the one `split(':')` site in
`src` — and then decided each candidate by **running the consumer predicate on the literal**.

| file | reverted | the strings |
|---|---|---|
| `src/generators/economy/prosperity.js` | **5** (ruling said 4) | Highly diversified · Diversified · Concentrated · **Limited** · Subsistence |
| `src/generators/power/governanceNarrative.js` | **6** (ruling said 5) | Fractured · Shaken · Desperate · Anxious · Volatile · **Unstable — criminal governance** |
| `src/generators/safetyProfile.js` | 1 | `Dangerous — Plague Unrest` (:119) |
| `src/generators/foodGenerator.js` | 1 | `Deficit — Active Famine` (:342) |

The two extras — `'Limited — narrow economic base for this scale'` (`prosperity.js:305`) and
`'Unstable — criminal governance'` (`governanceNarrative.js:250`, from `deriveBaselineStability`, a different function
from the other five) — are never produced by the 360-settlement corpus. Both **BREAK** their consumer when the predicate
is run on them directly (`"Limited"` → `"Limited: narrow economic base for this scale"`; `"Unstable"` →
`"Unstable: criminal governance"`).

### ⭐ ONE CANDIDATE REFUSED — shape would have reverted it, the predicate kept it

`'Suppressed (under occupation — resistance simmers)'` looks exactly like a band separator. It is not:
`SummaryTab.jsx:212` is `.split(';')[0].split('(')[0].split('—')[0]` — the **paren split runs first**, so both forms
yield `"Suppressed"` and the em dash is never the boundary. It is punctuation inside a parenthetical gloss, so **the
cure stays.** Reverting on shape alone would have destroyed a legitimate cure.

### ⭐ THE TREE ITSELF ALREADY SAID FIVE

`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:179`, an annex the prose car never touched:

> *"…its eleven values are title-cased and **five carry an em-dashed gloss**
> (`Highly diversified — multiple major revenue streams`)…"*

The repo's own documentation says five and calls the dash a **gloss separator**. Between the sealed car and this fix the
tree's documentation contradicted its code; they agree again. This is also the answer to the twin question the ruling
asked: **no twin pairs a structural string with a prose string** — the only annex naming one of the thirteen quotes the
dash form and was never cured, so the revert restores agreement rather than breaking a pair.

### THE PROOFS

| what | result |
|---|---|
| all 13 byte-identical to `df7cdd37e` | ✅ `base=1 head=1` for every one; **0** band lines still differ |
| genuine reader prose preserved in those 4 files | ✅ **56** cures remain |
| module evaluation of the 4 files | ✅ exit **0** ×4 (exports 5/1/1/1) |
| `OverviewTab.jsx:301` | ✅ **0/360** (was 8) |
| `SummaryTab.jsx:213` | ✅ **0/360** (was **186**) |
| `SummaryTab.jsx:212` | ✅ **0/360** (was 50) |
| `safetyProfile.js:218` | ✅ **0/360** (was 8) |
| `dailyLifeLogic.js:74` | ✅ **0/360** (was 8) |
| `aiLayer.js:140` · `settlementNarrative.js:32` | ✅ 0/360 (unaffected throughout) |
| **`economyInputFingerprint`** | ✅ **`fingerprint_moved=0/360`** (was 22); prosperity/safetyLabel/foodLabel each "changed on 0" |
| fence-1 residue | ✅ 11,575 leaf diffs, `by_kind={"STRING":11575}`, **`NON_CURE_DIFFS=0`** (was 30) |
| byte-twins | ✅ 28 examined, **28 found**, 0 missing |
| `espionageDormancyFence.test.js` after the re-record | ✅ **exit 0**, `Test Files 1 passed (1)`, `Tests 21 passed (21)` |

⇒ **the declaration's clause is TRUE again.** No reader-facing label reaches the persisted hash, so
*"…no rules value, no preset and no flag moved"* can now be joined by *"and no emitted text reaches persisted state"*.

### N IS UNCHANGED — **N = 94**, verified as the chair expected

The four band files are `src/generators`, not `src/domain`. Re-derived at the fixed tip:
`src/domain/**` outside `display/` with moved literals = **94**. The span is now 201 files (200 prose + the re-recorded
fence test); 195 are JS, 194 of which move literals.
⚠ For the chair's wording: `src/generators` contributes a further **39** paths that also move emitted text. If
"engine-side" in the declaration is meant to cover the generator pipeline, the honest figure is **94 + 39 = 133**; under
the plan's definition (`src/domain` outside `display/`) it is **94**. I report both rather than pick for you.

### THE SUITES AT THE FIXED TIP — every one re-run, none moved

| suite | exit | result | vs the pre-fix tip |
|---|---|---|---|
| `voiceMechanics` + `proseLeak` | **1** | `Test Files 1 failed \| 1 passed (2)` · `Tests 3 failed \| 35 passed (38)` | **identical** |
| `tests/lint/` WHOLE (138 files) | **1** | `Test Files 3 failed \| 135 passed (138)` · `Tests 4 failed \| 2127 passed (2131)` | **identical** — clampPrimitiveBaseline (permitted) · proseNumerics ×2 · wizardNewsAuthoring |
| TOUCHING (95 files on the 7 paths) | **1** | `Test Files 3 failed \| 92 passed (95)` · `Tests 6 failed \| 2655 passed \| 22 skipped (2683)` | **identical** — voice ×3, proseNumerics ×2, generatorGoldenMaster. **No consumer pin, no domain test, no display test fails.** |
| `espionageDormancyFence` after the re-record | **0** | `Test Files 1 passed (1)` · `Tests 21 passed (21)` | ⭐ **was failing; now green** |
| `organicSamples` | 1 | `Tests 1 failed \| 3 passed (4)` — the `UPDATE_*` door a lane may not open | unchanged |
| `npm run typecheck:domain:strict` | **0** | `✓ no strict-type regressions (1120 errors, ceiling 1120)` | unchanged |
| `npx eslint`, the 5 files cars 2+3 touch | **0** | `files_reported=5 errors=0 warnings=0` | — |

⭐ **`sovereigntyLightingContract.walker.test.js` is GREEN** in the directory run (0 occurrences in the failure list),
so register row 8 — the lighting census — is **executed**, not predicted.

⚠ **Two more zsh traps caught in this act**, both of the family that has now bitten four times in this lane: `$FILES`
unquoted does not word-split, so `npx eslint -f json $FILES` linted **nothing** and exited 2 with an empty report; and
`${PIPESTATUS[0]}` is bash-only, so the typecheck exit printed empty. Both re-run under `/bin/bash` with the exits
captured; the figures above are from the corrected runs. **Every multi-file shell loop in this lane now runs under
`/bin/bash` with a vacuity guard.**

### ⛔ WHAT THE FIX CAR DELIBERATELY DID NOT DO

The chair ruled on the five band strings. It did **not** rule on `factionRelationships[].description`, whose ` — ` is
also cured and which loses its dash on **300 of 360** settlements. I left it alone, and the reason is measured, not
assumed: **nothing parses that field.** The consumer that looked like it did — `settlementNarrative.js:32` — is fed
`settlement.relationships[]` (NPC relationships), a different collection, whose `description` carries no em dash at
either tip (0/360). The full `src` splitter census is seven `split('—')` sites and one `split(':')` site, and none of
them reads `factionRelationships`. It is a pure prose cure with no parser, so it stays cured.

### ⛔⛔ THE REGISTER-DELTA TABLE AT THE FIXED TIP — AND ONE ACT THAT WILL BE REFUSED

Figures are per file and are what the instrument will read, so the chair's register runner can be written from them.
**I took no register act; `UPDATE_VOICE_BASELINE` was never set.**

| # | register | file the act writes | committed now | at the fixed tip | act |
|---|---|---|---|---|---|
| 1 | **voice Tier-2** | `tests/copy/.voice-mechanics-baseline.json` | 102 entries · em **455** · bang **10** | **55** entries · em **311** · bang **8** | ✅ both totals FALL ⇒ shrink-only **accepts** |
| 2 | ⛔ **voice Tier-3 (JSX)** | `tests/copy/.voice-mechanics-jsx-baseline.json` | 2 entries · em **3** · bang 0 | **17** entries · em **37** · bang 0 | ⛔ **RISES +34 ⇒ `writeShrinkOnlyBaseline` THROWS** |
| 3 | **writer-reach** | `scripts/.writer-reach-baseline.json` | — | `check-writer-reach.mjs` **exit 0** — WRWALKER HOLD, judged 6520 · LIT 550 · LIT-NAME 4644 · DARK 1326 | ✅ **no act owed** (executed, not predicted) |
| 4 | **wizardNewsAuthoring** | the frozen legacy ledger in `tests/lint/wizardNewsAuthoring.walker.test.js` | 19 rows (ceiling 19) | **1 row moves** — `"signature": "6498a01695d46731"` → `"eeced77054e13a05"` | replace that one exact entry; **ceiling stays 19** |
| 5 | **proseNumerics** | `tests/lint/.prose-numerics-baseline.json` | 1,352 lines | **10 rows relocate**, 3 files: `src/generators/steps/stressConfirmPass.js` ×6 (:126, :127) · `src/domain/spatial/moralDrift.js` ×2 (:315) · `src/domain/activeConditions.js` ×2 (:983) | re-record the 10 |
| 6 | **organicSamples** | `docs/samples/organic-craft/*.html` | 6 HTML files | **3 stale**: `dossier-desk.html` (4 sentences), `dossier-field.html` (4), `pricing-desk.html` (2); `compendium-desk`, `library-desk`, `index` clean | `UPDATE_ORGANIC_SAMPLES=1` — **a lane may not**. ⚠ the test's assert throws on the FIRST stale fixture (`dossier-desk`), so the run alone names one of three; the per-fixture list above is probed separately |
| 7 | **test ratchet** | `scripts/.test-ratchet-baseline.json` | — | the span is **201 files, every one `M`** — zero added, zero deleted, zero renamed | ⚠ **PLAUSIBLE: no movement.** `totalTests`/`totalFiles` cannot move without a file add/delete. Not executed — the ratchet runs the whole suite and I was not going to hold the mutex that long for a prediction |
| 8 | **lighting census** | `sovereigntyLightingContract.walker` figures | — | `files`/`titles`/`suiteTitles` are compared exactly; no test file added or removed and no `describe`/`it` title changed (car 3 edits one constant) | ✅ **no movement — and it is EXECUTED, not predicted**: that walker lives in `tests/lint/`, and it is green in the directory run below |

#### ⛔⛔ ROW 2 IS A BLOCKER FOR THE CHAIR'S OWN REFREEZE, AND IT IS NOT THIS TRAIN'S DEBT

The documented command — `UPDATE_VOICE_BASELINE=1 npx vitest run tests/copy/voiceMechanics.test.js` — regenerates
**both** baselines in one run: the Tier-2 write at `:245`, then the Tier-3 write at `:270`. Tier-2 will succeed. **Tier-3
will throw**, because `writeShrinkOnlyBaseline` refuses any metric that grew and JSX `em` goes **3 → 37 (+34)**. The run
therefore lands the Tier-2 file and then errors, which is the worst of both outcomes: a half-applied refreeze.

**None of it is the prose car's.** All 15 drifted `.jsx` files — `AccountIdentitySection`, `FounderChairBio`,
`LockControls`, `FoundersHallPage`, `HallCovenant`, `RequestChairLetter`, `InstantWorldEntry`, `HeraldGazetteer`,
`PerspectiveStandings`, `RealmComparisons`, `SimulationRulesAxes`, `FaithTab`, `PowerTab`, `WarTab`,
`LivingWorldGates` — are **mainline** components, and the span contains **zero** `src` `.jsx` files. Measured with the
test's own helper, the JSX tier is byte-identical at `df7cdd37e` and at the fixed tip: `total_em=37`, `drifted=15`, both.

**Three ways out, none of them mine to choose:** cure the 34 component em dashes first (then both writes fall and the
documented command works); or split the two writes so Tier-2 can be banked alone; or bank Tier-2 by hand and leave the
JSX baseline stale with a written exclusion. ⚠ **Whatever is chosen, do not discover it mid-refreeze.**

## 8 · RETROVALIDATION ROW — updated after the ruling

| what was judged | what the Fable chair must re-derive | receipts | priority |
|---|---|---|---|
| ⛔⛔ **the voice refreeze WILL THROW** — JSX `em` 3 → 37 (+34); the documented command writes Tier-2 then errors on Tier-3, half-applying the refreeze | `writeShrinkOnlyBaseline`'s rise check against `.voice-mechanics-jsx-baseline.json`; then choose: cure the 34 component dashes, split the writes, or bank Tier-2 with a written exclusion | register row 2 | ⛔⛔ **HIGHEST — it blocks a landing act, and it is mainline debt, not this train's** |
| **13 strings reverted, not the 11 ruled** — 2 extras the corpus never renders, each decided by running the consumer predicate | the two predicates (`Limited`, `Unstable`); confirm the file set is still four | THE FIX CAR | ⛔ HIGH — the ruling's own count was short |
| **1 candidate refused**: `Suppressed (under occupation — resistance simmers)` keeps its cure because `split('(')` runs first | that predicate | THE FIX CAR | HIGH — reverting on shape would have destroyed a good cure |
| the residue is **zero**, so the golden re-record is legitimate | `fence1-attrib.mjs` at the fixed tip: `NON_CURE_DIFFS=0`; and the base run reproduces the OUTGOING constant | car 3 | ⛔ HIGH — it is the whole basis of the re-record |
| `factionRelationships[].description` moves on 300/360 and was **left cured** | the splitter census: nothing parses that field | THE FIX CAR | MEDIUM — a deliberate non-action, recorded |
| the overlap is **7, not 8**; the 8th is an **ANCHORS** conflict the brief said did not exist | `comm -12` at the ANCHORS tip; `2a7550741` × `RECEIPT_POOLS_LEGACY.md` | §1 | ⛔ HIGH — changes the replay |
| **N = 94**, unchanged by the fix (the band files are `src/generators`) | the `grep -v display` count; **decide whether "engine-side" includes `src/generators`** — if it does the figure is 94 + 39 = **133** | §3, THE FIX CAR | ⛔ HIGH — a declaration figure with a definitional fork |
| **`wizardNewsAuthoring` is a SECOND location-bound ledger** the cure moves — 1 signature row, not in the car's owed list | add it to the owed register set | register row 4 | ⛔ HIGH — an unlisted obligation |
| the per-file voice arm was **already red at base on 68 mainline rises**; the car retires 31 and adds 89 falls | `voice-split.mjs` at both tips | §5 | HIGH |
| both JSX arms are **pre-existing** and move by 0 | `jsx-tier.mjs`, 37/37 and 15/15 at both tips | §5 | MEDIUM |
| `organicSamples`: **3 of 6** fixtures stale; the test names only the first | the per-fixture probe | register row 6 | MEDIUM |
| the test-ratchet row is **PLAUSIBLE, not executed** — 201 files, all `M`, zero adds/deletes | run it at the composed tip if the chair wants it CONFIRMED | register row 7 | MEDIUM — the one unexecuted row in the table |
| ⛔ **the quiet-window law as written is unsatisfiable for lanes whose probe lacks the bracket form** | the chair's own runners use `'[v]itest/dist/workers'` and are fine; mine matched its own reflection. The mutex is the authority | §5 preamble | MEDIUM — resolved, recorded |
| **five of my own instruments lied and were corrected before publication** — a zsh no-word-split compare (×2), a placeholder-blind twin probe, a truncated-log read that called a red arm green, a wrong-collection consumer replication | nothing to re-derive; recorded so the corrections are not re-found as findings | §2, §5, §7, THE FIX CAR | LOW |

### Scratch, for the chair (all under `$SC/prose-rebase-scratch/`)
`literal-delta.mjs` (N) · `voice-predict.mjs` · `voice-split.mjs` · `voice-arms.mjs` · `jsx-tier.mjs` · `seed-drive.mjs`
· `fence1.mjs` · `fence1-attrib.mjs` (11,575-leaf attribution at the fixed tip) · `fp-inputs.mjs` · `parse-coupled.mjs`
+ `parse-coupled2.mjs` · `edge-predicates.mjs` (the three edge rulings) · `twins.mjs` · `owed-scan2.mjs` ·
`fixed-*.log` (every fixed-tip run, full capture) · `base/` (a `git archive` of `df7cdd37e`; node_modules **symlinked**).

**Dock at close: `3ab6fd9d3`, porcelain 0.** Three cars: `83c7b6b66` (rebased prose, its own trailer),
**`dac3b15a8`** (the fix), **`3ab6fd9d3`** (the re-record) — the last two carrying
`Seat: Opus 5 — Fable-unvalidated` + `Lane: PROSE-REBASE`. ⛔ **Cars 2 and 3 are unsealed** — the fence forbids me ref
writes, and they exist only as this dock's detached HEAD.
