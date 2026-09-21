# Settlement editor / EM-D0d — `PoolField` + `FreeField`: the editor's two PURE input controls, taking a resolved options array and one `FieldDeclaration` as props, drawing no random number of their own, and costing first paint nothing

- **Status:** `LANDED`
  ⚠ The status value above stands ALONE on its line (interim rule 5): `parsePacketHeader` anchors
  the row at end-of-line and takes `status` only when exactly one row matches. Every stamp, caveat
  and date is on these continuation lines.
  ⭐ **THE FOURTH OF THE FIVE MEMBERS OF EM-D0**, the first door (`EM-D0.partition.md`, section
  "D0d"; ratified by `CHAIR-RULING.md` item 2). It needs **EM-A1 LANDED** and rides train **EM-T10**.
  ⛔ **ONE CLAUSE OF THE BRIEF IS REFUTED BY MEASUREMENT AND THE CONTRACT BELOW CORRECTS IT.** The
  partition's acceptance (1) and the launch brief's clause 3 join two DIFFERENT empties into one
  sentence: *"with an EMPTY array it renders empty and disabled, never absent … and `npc.status` is
  occupied on 24 of 336 NPCs = 7.1 %, so the empty case is the COMMON one."* The 7.1 % is the
  occupancy of the FIELD'S VALUE on the record (EM-A1 §1c.2's "occupancy" column, which reads 0 %
  for `institution.state` and 100 % for four other rows); it is **not** a claim about the pool's
  OPTIONS array, which EM-A2a resolves from the generator's catalogue and which is non-empty for
  every declared pool. Building one rendering for both would leave **93 % of NPC status fields
  disabled** — the precise opposite of design §2.1. ⇒ **A2 and A3 are two acceptance cases, not
  one**: an empty OPTIONS ARRAY renders empty AND disabled; an empty VALUE renders shown-empty and
  **ENABLED**. Everything else in the brief's six clauses is confirmed at the read tip.
- **Landed at:** `b44ab38e17571ab680646d3b12889ebc07aaa89b` — the eighteenth landing — train EM-T10: PoolField and FreeField, the editor's two pure input controls (the first door, member 4)
- **Packet version:** 2
  **What version 2 changed and why (version 1 was the compile's).** The independent pre-proof
  confirmed every fact version 1 asserted and closed ONE measured contract gap, in `PoolField`
  only. Version 1 declared `roll` with no default and no guard, and item 6 called
  `roll(seed, entryId, n + 1)` unconditionally — so a mount that has no roller to bind (EM-A2a's
  `rollFrom` is UNWRITTEN at this member's landing, and EM-D0e is the first mount) would throw a
  `TypeError` on the first click of an ENABLED affordance. Version 2 defaults the prop to `null`,
  makes `typeof roll === 'function'` the one predicate that decides whether the affordance is live
  (§6.1 items 5 and 6), and adds STOP 9. In the same leaf it states the normalization A3 already
  required but §6.1 never spelled: `value` is reduced ONCE to `String(value ?? '')`, so the
  `<select>` stays CONTROLLED for all three of A3's empty spellings instead of silently becoming
  uncontrolled on `null`. **Third, on the chair's ruling (judgment 93): §6.3 now SPELLS the five
  copy strings verbatim** rather than describing each key's job — a build lane builds exactly what
  a packet says and may not invent a user-facing word — and `edit.field.limit` takes TWO measured
  parameters, `actual` and `max`, in the estate's own shipped idiom. ⛔ **NO COUNT MOVED:** no
  acceptance case, no `it`, no title, no change path and no `checks` entry changed; the count
  prover re-run exits 0 and the §7/capsule path sets stay SET-EQUAL at four rows.
- **Verified base:** `em-t10-d0d-2026-09-21` at `e348d59b609e2c62c957a4cd78653849792043b7`
  ⚠ Left for the chair's promotion stamp (interim rule 5: the value stands alone on its line).
  **The revalidation sentence the chair will use:** *"Re-measured at
  `429141e2d1c21cb5ee9dd5005ed1a77bbc9b3cd8` (read tip `read-tip-em-t8-tip`, detached,
  `git status --short` EMPTY at the start and at the end of the lane): all three CREATE targets
  ABSENT (`git ls-files src/components/edit` → EMPTY; `git ls-files tests/components/editFields.test.jsx`
  → EMPTY); every `requiredSymbols` row present VERBATIM at `git grep -c -F` = 1 (thirteen rows);
  `retiredSymbols` empty and proved by the post-edit simulation; the preamble measured
  `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`; the eager first-paint set
  measured **269** by importing `vite.config.js`'s own export, with `src/components/edit/`
  contributing **0** members and `src/copy/en.js` and `src/copy/index.js` both OUTSIDE it;
  `git grep -l -F 'PoolField' -- src tests scripts e2e` → EMPTY (its only estate hits are two doc
  files describing this member)."*
  ⛔ A `__BASE__` packet can never pass `validate:packets`; validation is downstream of this stamp.
- **Last revalidated:** left for the chair, with the sentence above.
- **Depends on:** **EM-A1 (LANDED)** — and the dependency is **TYPE-ONLY**, which is a measured fact
  the chair should see: the two leaves name `FieldDeclaration` in JSDoc
  (`@typedef {import('../../domain/edit/types.js').FieldDeclaration} FieldDeclaration`, EM-A1's own
  idiom at `fieldDeclarations.js:37`) and call **nothing** from the edit volume. `declarationsFor`
  is EM-D0e's caller, not this packet's. **Q1 to the chair, §12.**
  EM-A2a is **NOT** a dependency: the `roll` prop arrives already bound (§6.1).
- **Collision group:** ⛔ **NONE at this tip, measured.** No waiting packet names
  `src/components/edit/PoolField.jsx`, `src/components/edit/FreeField.jsx`,
  `tests/components/editFields.test.jsx` or `src/copy/en.js`
  (`grep -l` over `packets-waiting/` → no hits for any of the four).
  ⚠ **EM-D0e WILL WANT `src/copy/en.js` TOO** (the dialog's own strings). The mechanism is measured
  in EM-D0c's header: `reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)` with
  `TERMINAL = {LANDED, SUPERSEDED}` (`scripts/implementation-packets.mjs:828, 44`), so EM-D0e may
  name that path only once this member is `LANDED` — which its own landing order (D0d before D0e)
  already guarantees. Nothing is owed here; it is recorded so it is not re-found.
- **Lane branch:** `em-t10-d0d-2026-09-21` (interim rule 11: a forward posture; the chair re-points
  this row at promotion).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. EM-A1's two built leaves read WHOLE in `$SP/lane-em-a1-t9`
  (READ-ONLY); `src/components/EntityPicker.jsx` and `src/components/primitives/Button.jsx` read
  WHOLE at the read tip as the estate's two shipped control idioms; the eager first-paint set by
  IMPORTING `vite.config.js`'s own export (269, reading no `dist`); the `<select>` / combobox
  populations counted; the three JSX-hygiene rules and the three born-empty a11y registries read at
  source; the `e2e/` inventory grepped name by name; the line-addressed registers grepped path by
  path; the copy hub's five governors read. Receipts in `EM-D0d.evidence.md`.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR;
  measured at this read tip as
  `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`).
  > **Interim compile rules:** `COMPILE-RULES.interim.md` (the chair, 2026-09-20) — the fifth
  > amendment's rules (1–17 as of 2026-09-21 05:26), obeyed before they land. Where this packet and
  > `EM-PREAMBLE.md` (SHA-256 `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`)
  > disagree, the interim rules govern and this row is the record of it.

---

## §1 · Reconciled authority

| authority | section + item | what it binds here |
|---|---|---|
| the owner-ratified design | §2.1 | field declarations are the source of every modal; **"Empty fields are declared and shown empty"** |
| the owner-ratified design | §3, "The modal" | pool controls (**drop-down, search, or both**; "roll another" beside every name); free fields as plain text **with a length limit** |
| the owner-ratified design | §12 item 3 | `free-cascade` is a third field kind: typeable, but a change is a typed op that runs the existing cascade — **the control is still plain text; the cascade is the op's** |
| the owner-ratified design | §12 item 7 | pools read the GENERATOR's catalogue, never the display seams — ⛔ **which is why this member resolves no pool at all** |
| the owner-ratified design | §20.4 | the door lands behind the tier gate and DARK; ⛔ visibility is the OWNER's |
| the chair's ruling | `CHAIR-RULING.md` item 2 | EM-D0d is ratified as its own member: `PoolField` + `FreeField` |
| the chair's ruling | `CHAIR-RULING.md` item 5 | the numeric `'share'` control is **EM-D2's**, not the door's — this member mints none |
| the charter | `EDIT-MODE-TRAIN.md`, the **EM-D0** row (`:94`) | "PoolField (drop-down / search / seeded roll another), FreeField (**plain text, maxLength**)" — ⛔ the font-coverage check is EM-D2's row (`:79`), and design §12.13 calls it NEW CAPABILITY |
| EM-A1 (built, staged) | §6.2 + `src/domain/edit/types.js` | the `FieldDeclaration` typedef, its four `FieldKind`s and the absence table: `pool` present iff kind is `'pool'`; `maxLength` iff the kind is `'free-cascade'` or `'free'` |
| EM-A2a | §6, chair ruling (3) | `rollFrom(poolId, world, seed, entryId, n)` → `string | null`, pure in its arguments, `n` in the stream key — the shape the `roll` prop is bound to |
| interim compile rules | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 | each discharged by name in §7, §9a, §10 and §12 |

⛔ **WHAT THIS PACKET DOES NOT DECIDE.** Whether the editor is ever SHOWN is the owner's (design
§20.4). These two controls are mounted by nothing: `src/components/edit/` has no consumer until
EM-D0e, so with this member landed the product renders not one pixel differently.

---

## §2 · Outcome

### §2.1 What this packet delivers
Two pure function components under a new directory `src/components/edit/`, five copy strings, and
one test file. Each control takes **one already-resolved `FieldDeclaration`** and, for `PoolField`,
**one already-resolved options array** — and resolves nothing itself. That is the whole reason this
member needs EM-A1's typedef and **not** EM-A2a or EM-A2b at its own landing.

### §2.2 ⛔ THE FOUR MEASURED FACTS THAT SHAPE THE CONTRACT

**(a) A NEW FILE UNDER `src/` MAY NOT WRITE A RAW `<button>`, AND THE ESTATE'S COMBOBOX IDIOM DOES.**
`jsx-hygiene/no-raw-button` is `'error'` on `src/**/*.jsx` (`eslint.config.js:779-784`); the rule
exempts only `primitives/` and the files listed in `scripts/.raw-button-baseline.json`, a
monotone-shrink burn-down list a new file can never join
(`scripts/eslint-plugin-jsx-hygiene.js:137-139`). The shipped aria-combobox — `EntityPicker.jsx` —
renders each option as a raw `<button role="option" tabIndex={-1} onMouseDown=…>` (`:247-254`), and
**`src/components/EntityPicker.jsx` is itself in that baseline** (`:5`). ⇒ the estate's search idiom
cannot be copied verbatim into a new leaf; every clickable control here is `<Button>` from
`src/components/primitives/Button.jsx`, which spreads `...rest` onto its own `<button>`
(`Button.jsx:126, 176`) and therefore carries any `role`, `aria-*`, `id` or `tabIndex` a caller
needs.

**(b) THE DOMINANT DROP-DOWN IDIOM IS THE NATIVE `<select>`, BY 53 TO 3.** Executed:
`git grep -l -F '<select' -- src/components` → **53 files**; `git grep -l -F 'role="combobox"' --
src/components` → **3** (`CommandPalette.jsx`, `EntityPicker.jsx`,
`CompendiumGlobalSearch.jsx`) — all three OPEN registries with hundreds of entries. Every pool the
first door mounts is a CLOSED bounded vocabulary (`npc.role` is the distinct roles of one
settlement's institutions, EM-A2b `:256`; `faction.category` is 13 archetypes; `worldFact.*` are
3–6 members each). ⇒ `PoolField` is a native `<select>`, which also gives the label join, the
disabled state and full keyboard operation without minting a second idiom. Design §3's own words
are *"drop-down, **search, or both**"*, so a drop-down alone is the design's, not a reduction of it.
**Q2 to the chair, §12.**

**(c) `src/copy/en.js` IS NOT EAGER, SO FIVE NEW STRINGS COST THE OWNER-SIGNED BUDGET ZERO.**
Executed by the membership probe: of the 269 members of `EAGER_FIRST_PAINT_MODULES`, `src/copy/en.js`
→ **0**, `src/copy/index.js` → **0**, `src/copy/footer.js` → **1**. `src/copy/index.js`'s own header
states the law: *"this whole module is off the eager entry closure — only lazy surfaces import it,
and the app shell reads `footer` through copy/footer.js."* ⇒ there is **no lazy home to look for**,
because en.js already IS the lazy home, and a second editor-only registry would contradict en.js's
own *"This is the SINGLE copy registry"* (F45) while saving nothing.

**(d) THE PRNG BAN DOES NOT REACH `src/components`, AND THE REAL RULE IS REACT PURITY.**
`tests/lint/determinismBanCoverage.test.js` pins the eslint determinism blocks for the entropy
layers it names — *"generators / domain / workers / kernel / kernel-prng / pdf"* — and
`src/components` is in none of them (7 shipped component files call `Math.random`). The rule that
DOES bind is the estate's own, written at `src/components/generate/PipelineReveal.jsx:95-96`:
*"so we don't call Date.now()/Math.random() during render (purity rule)."* And
`tests/lint/entropyRootCensus.walker.test.js` anchors on a `.rngSeed` read off a CLOSED set of
world-shaped receivers (`WORLD_ROOTS = ['worldState','startingWorldState','state','ws','raw','base']`,
`:57`) whose `ENTROPY_CONSUMERS` are exactly `['createPRNG','hash01','fnv1a32']` (`:67`) — ⇒ a
`seed` STRING arriving as a prop matches neither detector and joins **no** shrink-only roster.

### §2.3 In scope / out of scope
**In:** two pure controls; five copy keys; one test file.
**Out:** ⛔ every mount (EM-D0e is the first caller). ⛔ the `'share'` control (`CHAIR-RULING.md`
item 5 — its one member is `faction.power`, the FACTION card's, i.e. EM-D2's). ⛔ any pool
resolution, any catalogue read, any `rollFrom` import. ⛔ the font-coverage cmap read (EM-D2's row;
design §12.13 NEW capability). ⛔ search-as-you-type (§2.2 b, Q2). ⛔ any `e2e/` spec. ⛔ any new
hex, any lucide icon, any `zIndex` literal, any `@keyframes`, any hand-rolled focus trap.

---

## §3 · Hard scope budget

| limit | this packet | cap |
|---|---|---|
| behaviour families | 1 (one declared field becomes editable through a control) | 1 |
| new persisted record families | 0 | ≤1 |
| feature flags | 0 | ≤1 |
| user-facing surfaces | **0 — nothing mounts these controls** | ≤1 |
| direct production consumers | **0** (EM-D0e is the first) | ≤2 |
| new logic-bearing production leaves | **2 — EXACTLY AT THE CAP** | ≤2 |
| existing logic-bearing production files modified | **1** (`src/copy/en.js`, additive) | ≤3 |
| handwritten files total | **4** | ≤12 |
| new/changed effective production lines | **≈ 192** (`PoolField.jsx` ≈ 110; `FreeField.jsx` ≈ 70; `en.js` +12) | ≤400 |
| each new production leaf | `PoolField.jsx` ≈ **110**; `FreeField.jsx` ≈ **70** | ≤250 each |
| shared / hot-file delta | `src/copy/en.js` **+12** | ≤15 |
| named acceptance cases | **8 — AT THE CAP** | ≤8 |

Overrides approved before dispatch: **NONE.** Two new logic leaves is exactly the standard's cap and
the partition says so in those words; no override is asked.

**Hot files:** `src/copy/en.js` is a HUB (16 test files name it, enumerated in §10). The delta is +12
purely additive lines inside the frozen object literal — no existing namespace, key, value or order
moves — so the consequence is a `checks`-scoping rule (§10), not a budget one.

---

## §4 · Sealed dispatch and preflight

- **branch name** — the chair's; the packet asserts nothing beyond the `Lane branch` row.
- **ancestry** — the chair replaces `__BASE__` at promotion and nowhere else.
- **substrate unchanged since the verified base** — of the thirteen `requiredSymbols` paths this
  packet writes exactly ONE (`src/copy/en.js`), and its required text
  (`export const en = Object.freeze({`) survives the additive edit verbatim (§5's post-edit
  simulation).
- **CREATE targets absent** — verified at `429141e2d`: `git ls-files src/components/edit` → EMPTY
  (the directory does not exist); `git ls-files tests/components/editFields.test.jsx` → EMPTY.
- **git-clean** — the lane wrote nothing in any tree; `git status --short` in `read-tip-em-t8-tip`
  was EMPTY at the start and at the end.
⚠ **SEALED DISPATCH WANTS THE WORKTREE ON THE VERIFIED BRANCH:** one build lane holds the
integration branch in its worktree while the chair's stays detached at the tip.

---

## §5 · Verified tree contract

| # | path | symbol | the fact | the command that proved it |
|---|---|---|---|---|
| V-1 | `src/copy/index.js` | `export function t(` | the ONE copy accessor; missing keys return the key string, which is exactly the defect `copyKeyResolution` exists against | `git grep -c -F 'export function t(' src/copy/index.js` → 1 |
| V-2 | `src/copy/en.js` | `export const en = Object.freeze({` | the single copy registry, frozen; the packet adds a namespace INSIDE it and moves nothing | `git grep -c -F 'export const en = Object.freeze({' src/copy/en.js` → 1 |
| V-3 | `src/components/primitives/Button.jsx` | `export default function Button({` | spreads `...rest` onto its `<button>` (`:126, :176`), so `role` / `aria-*` / `id` / `tabIndex` pass through; `disabled` folds into `inert` (`:135, :147`) | `git grep -c -F 'export default function Button({' …` → 1 |
| V-4 | `src/components/theme.js` | `BORDER` `CARD` `INK` `MUTED` `sans` `FS` `SP` | the seven tokens both leaves theme from; no new hex is needed and none is minted | seven `git grep -c -F` runs, each → 1 (evidence §E) |
| V-5 | `src/design/proseScale.js` | `export function chromeFontSize(` | the phone font floor, the estate's one idiom (`EntityPicker.jsx:30, :172`; `Button.jsx:4, :167`) | `git grep -c -F 'export function chromeFontSize(' …` → 1 |
| V-6 | `src/hooks/useIsMobile.js` | `export default function useIsMobile(breakpoint = DEFAULT_BREAKPOINT) {` | the ONE shared reactive viewport flag | `git grep -c -F …` → 1 |
| V-7 | `vite.config.js` | `export const EAGER_FIRST_PAINT_MODULES` | the eager set, importable; **269** members at this tip | `git grep -c -F …` → 1; probe `fp-d0d.mjs` → `EAGER COUNT: 269` |
| V-8 | `scripts/eslint-plugin-jsx-hygiene.js` | `'no-raw-button'` | flags every `JSXOpeningElement` named `button` outside `primitives/` and the baseline (`:136-146`); wired `'error'` at `eslint.config.js:782` | read at source |
| V-9 | `scripts/.raw-button-baseline.json` | — | `src/components/EntityPicker.jsx` is a member (`:5`); the list is monotone-shrink | `grep -n EntityPicker …` → line 5 |
| V-10 | `tests/lint/uiA11yContract.walker.test.js` | `isTabbable` | `!/tabIndex\s*=\s*\{?\s*['"]?-1/` (`:76`) — a `tabIndex={-1}` option is NOT a tab stop and is exempt from the mouse-only arm; all three registries are BORN EMPTY | read at source |
| V-11 | `tests/lint/mutationCoverage.shared.mjs` | `ENFORCER_DIRS` | exactly `['tests/lint','tests/design','tests/docs','tests/data','tests/copy','tests/security','tests/edgeFunctions','tests/generators']` (`:36-45`); `tests/components` is in NONE; `NAME_PATTERN` (`:48-49`) matches none of `editFields` | read at the tip, never recalled |
| V-12 | `scripts/lib/tuning-inventory.mjs` | `TREES_P2P3` | exactly `['src/domain','src/generators']` (`:60`) ⇒ **interim rule 17 does not reach `src/components`**; `TREES_P1` governs `*_TUNING` TABLES, of which this packet declares none | read at the tip |
| V-13 | `tests/lint/entropyRootCensus.walker.test.js` | `WORLD_ROOTS` / `ENTROPY_CONSUMERS` | `['worldState','startingWorldState','state','ws','raw','base']` (`:57`) and `['createPRNG','hash01','fnv1a32']` (`:67`); a `seed` STRING prop matches neither detector | read at source |
| V-14 | `tests/lint/errorCopyBaseline.test.js` | the detector | matches `set<X>Error('…')` / `set<X>Notice('…')` / `showToast('error','…')` / `fallbackTitle="…"` with a DIRECT literal; **a new literal in a clean file FAILS** | read at source |
| V-15 | `$SP/lane-em-a1-t9/src/domain/edit/fieldDeclarations.js` | `TEXT_LIMITS` | `Object.freeze({ name: 60, note: 280 })` (`:53`), and its own comment: *"the control that enforces them is EM-D0's"* (`:44`) | read WHOLE from the build lane's worktree, READ-ONLY |
| V-16 | `$SP/lane-em-a1-t9/src/domain/edit/types.js` | `FieldDeclaration` | `{ card, field, kind, provenance, label, group, outputKey?, pool?, maxLength?, readersProof?, writer?, createdBy?, tier1? }` (`:45-50`); `FieldKind` is the closed four `'pool'|'free'|'free-cascade'|'share'` (`:30`) | read WHOLE, READ-ONLY |

**POST-EDIT SIMULATION (pre-proof step 10), row by row.** Twelve of the thirteen `requiredSymbols`
rows sit at paths this packet does not write, so they cannot move. The thirteenth, V-2, is at
`src/copy/en.js`, and the packet's only edit there is the insertion of one namespace INSIDE the
object literal — the `export const en = Object.freeze({` line itself is not touched. ⇒
`retiredSymbols` is **EMPTY**, and no other LANDED or waiting packet carries a row for any of the
thirteen pairs, so nothing is owed a discharge.

---

## §6 · Exact contracts

### §6.1 `src/components/edit/PoolField.jsx` — the pool control
```js
/** @typedef {import('../../domain/edit/types.js').FieldDeclaration} FieldDeclaration */
export default function PoolField({ declaration, options, value, onChange, seed, entryId, roll = null, disabled = false })
```
**Types, closed, no discretion.**
`declaration` — one `FieldDeclaration` whose `kind` is `'pool'`. `options` — `readonly string[]`,
**already resolved**, rendered in the array's OWN order and never sorted, filtered or de-duplicated
by this control. `value` — `string | null | undefined`; ⭐ **all three empty spellings are
normalized ONCE, at the top of the component, to `String(value ?? '')`**, and it is that normalized
string the `<select>` receives — so the element is CONTROLLED in every one of A3's three cases and
React is never handed `null` or `undefined` as a `value`. `onChange` — `(next: string) => void`,
called with a MEMBER of `options` and with nothing else. `seed` — `string`, the settlement seed.
`entryId` — `string`, the edited entity's id. `roll` — `((seed: string, entryId: string, n: number)
=> string | null) | null`, **already bound to its pool and its world by the mount**, and **`null` by
default**. `disabled` — `boolean`, default `false`.

⭐ **THE CONTROL IS SAFE WITH NO ROLLER, AND THAT IS NOT AN EDGE CASE.** EM-A2a's `rollFrom` is
unwritten at this member's landing, so a mount may legitimately have nothing to bind; the prop
therefore defaults to `null` and **`typeof roll === 'function'` is the ONE predicate that decides
whether the roll affordance is live** (items 5 and 6). A control that reached
`roll(seed, entryId, n + 1)` on an absent roller would throw a `TypeError` on the first click, and
that throw would be this member's, not EM-A2a's.

**Rendering, exactly.**
1. A `useId()`-keyed `<label htmlFor>` carrying `declaration.label` verbatim, then a native
   `<select id value onChange>`.
2. The FIRST `<option>` is always the empty member: `value=""`, text `t('edit.field.emptyOption')`.
   It is SELECTABLE, so a DM may clear a field back to empty (design §2.1).
3. Then one `<option value={o}>{o}</option>` per member of `options`, in order.
4. ⭐ **WHEN `options.length === 0`:** the `<select>` is STILL RENDERED, carries `disabled`, and
   holds exactly ONE option — text `t('edit.field.noOptions')`. **Empty and disabled, never absent.**
5. The roll affordance is a `<Button variant="secondary" size="sm">` whose child is
   `t('edit.field.rollAnother')`, `disabled` when
   `disabled || options.length === 0 || typeof roll !== 'function'`.
6. On click: `const next = roll(seed, entryId, n + 1)`, where `n` is this control's own
   `useState(0)` roll index. **The handler's FIRST statement is the same predicate item 5 disables
   on — `if (typeof roll !== 'function') return;` — so the absent roller has no call path even if a
   caller re-enables the button through `...rest`.** If `next` is a non-empty string, set `n` to
   `n + 1` and call `onChange(next)`. **If `next` is `null`, call `onChange` zero times**, leave `n`
   unchanged, and render `t('edit.field.rollUnavailable')` beside the control.
7. Theming: `BORDER`, `CARD`, `INK`, `MUTED`, `sans`, `FS`, `SP` from `../theme.js` and
   `chromeFontSize(FS.sm, useIsMobile())`. ⛔ No hex literal, no `swatch[…]`, no lucide icon, no
   `zIndex`.

⛔ **THE CONTROL DRAWS NO RANDOM NUMBER AND NO CLOCK READING**, in render or in an effect: neither
leaf spells `Math.random`, `Date.now` or `new Date`, and A4(b) asserts that positively.
⛔ **IT RESOLVES NO POOL**: it imports nothing from `src/domain/edit/`, no generator catalogue and
no display seam (design §12 item 7).

### §6.2 `src/components/edit/FreeField.jsx` — the free-text control
```js
/** @typedef {import('../../domain/edit/types.js').FieldDeclaration} FieldDeclaration */
export default function FreeField({ declaration, value, onChange, disabled = false })
```
`declaration` — one `FieldDeclaration` whose `kind` is `'free'` or `'free-cascade'`; EM-A1's absence
table makes `maxLength` present for exactly those two kinds. `value` — `string | null | undefined`,
rendered as `''` when nullish. `onChange` — `(next: string) => void`.

**Rendering, exactly.**
1. The same `useId()`-keyed `<label htmlFor>` pair carrying `declaration.label`.
2. **The element branches on the DECLARED `kind`, never on a number:** `'free'` → `<textarea>`;
   `'free-cascade'` → `<input type="text">`. ⛔ No threshold constant is minted, so nothing here
   can read as a simulation dial.
3. Both carry `maxLength={declaration.maxLength}` — the platform's own clamp, and the number is
   READ from the declaration, never retyped. EM-A1's real values: **60** for the three
   `free-cascade` join keys and **280** for the two annotations (`TEXT_LIMITS`, V-15).
4. ⭐ **THE LIMIT IS REPORTED, NEVER SILENT.** Let `text = String(value ?? '')`. When
   `text.length >= declaration.maxLength`, the SAME render carries
   `t('edit.field.limit', { actual: text.length, max: declaration.maxLength })` beside the field —
   **two parameters, `actual` and `max`**, both interpolated through `t`'s own `{name}`
   substitution (`src/copy/index.js:112`), and both READ, never retyped. It renders
   `60 of 60 characters`. Below the limit the notice is absent. ⇒ a paste the browser clamps can
   never be invisible.
5. ⛔ The notice is copy, not an error idiom: it is rendered as text and never passed to
   `set*Error(`, `set*Notice(`, `showToast('error'` or `fallbackTitle=` (V-14).
6. ⛔ **No font-coverage check.** The charter's EM-D0 row is *"FreeField (plain text, maxLength)"*;
   the cmap read is EM-D2's row and design §12.13 calls it NEW capability.
7. ⛔ **The cascade is not this control's.** A `free-cascade` field renders as plain text here; the
   rename op, its cascade and its refusals are EM-B1c1's and EM-C4a v2's (design §12 item 3).

### §6.3 `src/copy/en.js` — the five keys, additive
One new top-level namespace, placed in the file's authored order, holding one `field` object:

⛔ **THE FIVE STRINGS ARE SPELLED HERE, VERBATIM, AND THE BUILD LANE COPIES THEM CHARACTER FOR
CHARACTER.** A build lane builds exactly what a packet says and may not invent a user-facing word;
a key list without its text is an invitation to do so. The chair authored these (judgment 93); they
are vetoable by the owner, who sees them in the staff-only preview before he opens the door.

| key | the string, VERBATIM | the string's job |
|---|---|---|
| `edit.field.emptyOption` | `Not set` | the selectable empty member of a pool, and the label of the shown-empty state A3 requires |
| `edit.field.noOptions` | `No choices available` | the lone option when the options array is empty (A2) |
| `edit.field.rollAnother` | `Roll another` | the roll affordance's label — **the design's own words at line 72**, copied rather than paraphrased |
| `edit.field.rollUnavailable` | `Rolling is unavailable here` | shown when a roll answers `null` (A5) |
| `edit.field.limit` | `{actual} of {max} characters` | the length report (A6); **two parameters**, `actual` and `max` |

**THE INTERPOLATION IDIOM IS THE ESTATE'S OWN, MEASURED, NOT INVENTED.** `t()` substitutes
`/\{(\w+)\}/g` (`src/copy/index.js:112`), so a placeholder is one lowercase word in braces.
Two shipped "X of Y" count strings give the SHAPE — `stepCounter: 'Step {current} of {total}'`
(`en.js:818`) and `stepLabel: 'Month {step} of {total}'` (`en.js:1783`) — and one shipped string
gives the PARAMETER NAMES for this exact concept, a character limit on a field:
`length: 'This field holds {actual} characters. The limit is {max}.'` (`en.js:1261`), whose caller
passes `{ actual: entry.actual, … }` (`CustomContentEditor.jsx:357`) from `points.length`
(`customContentCharset.js:393`). ⇒ **the two parameter keys `FreeField` passes are `actual` (the
value's current length) and `max` (`declaration.maxLength`)** — the estate's existing pair for a
used-of-limit count, not a second word minted for the same idea.

**EVERY CHARACTER CHECKED AGAINST WHAT GOVERNS `en.js` ADDITIONS.** The registry arm of
`tests/copy/voiceMechanics.test.js` is a HARD ZERO over `REGISTRIES = { en, … }` for exactly two
characters — `v.includes('—') || v.includes('!')` (`:144`): none of the five carries U+2014 or `!`.
None carries an apostrophe, so the file's curly-apostrophe convention is not engaged. None carries
a literal numeral, so `tests/lint/proseNumerics.test.js` gains nothing (the counts are placeholders,
which is the point of spelling them this way). `tests/lint/copyKeyResolution.walker.test.js` is
satisfied by construction: all five keys exist in `en` and none resolves to its own key string.
`tests/copy/localeParity.test.js` is FREE — the pseudo-locale is `deepPseudo(en)`, derived.
`tests/copy/tierWord.census.test.js` looks for tier-label TABLES and a six-rung ladder; five
verb-and-noun strings mint none. `tests/lint/errorCopyBaseline.test.js` is not engaged: these are
registry strings, not inline literals routed through an error idiom (§6.2 item 5).
`tests/lint/refusalNoticeCoverage.walker.test.js` keys off the CLOSED `REFUSAL_REASON_IDS` register
(`src/lib/refusalReasons.js`); `Rolling is unavailable here` is copy, not a registered refusal
reason, so no row is owed. ⛔ **No casing or length convention over `en.js` exists to meet** —
grepped for one across `tests/copy/` and the key resolver and found none.

⛔ **No inline string is rendered by either leaf.** A7 asserts the set equality positively.

### §6.4 The eight arms of `tests/components/editFields.test.jsx`
Eight straight-line literal `it`s under ONE literal `describe`: A1, A2, A3, A4, A5, A6, A7 and the
eighth ANTI-VACUITY arm. Every opener is bound by this file's own `vitest` import and bound exactly
once; ⛔ no variable, parameter or alias is named `it`, `test` or `describe` (the measured cause of
26 of the estate's 384 parked files); ⛔ no bare `for (const seed of …) { expect(…) }` — arms that
sweep collect first and assert once.

### §6.5 Ordering, determinism, lifecycle, receipts
**Ordering** — `options` renders in its given order; the empty member is always first.
**Determinism** — both leaves are pure functions of their props; `PoolField`'s only state is an
integer roll index, and its only source of a value is the injected `roll`. Two mounts with the same
props reach the same markup.
**Lifecycle** — neither leaf reads or writes the store, persistence, the URL or `localStorage`;
create / read / persist / regenerate / undo / migrate are all untouched because nothing here is
persisted. **Receipts** — none; these controls emit no analytics event and no receipt.

---

## §7 · Exact change manifest

Generated from `EM-D0d.manifest.json` (interim rule 6: §7 and the capsule are SET-EQUAL; the path
sets were diffed before hand-off and the count prover re-checks it).

| action | path | what |
|---|---|---|
| CREATE | `src/components/edit/PoolField.jsx` | the pool control at §6.1's exact contract: a native `<select>`, a `<Button>` roll affordance, a `useId()` label join; ⛔ it resolves no pool, imports nothing from `src/domain/edit/` at runtime, and draws no random number |
| CREATE | `src/components/edit/FreeField.jsx` | the free-text control at §6.2's exact contract: `<textarea>` for `'free'` and `<input type="text">` for `'free-cascade'`, `maxLength` read from the declaration, the limit REPORTED in the same render |
| MODIFY | `src/copy/en.js` | one new top-level namespace with §6.3's five keys; purely additive, nothing moves. ⛔ **NOT EAGER** — measured absent from `EAGER_FIRST_PAINT_MODULES`, so the eager byte delta is ZERO BY MEMBERSHIP |
| CREATE | `tests/components/editFields.test.jsx` | **EIGHT** straight-line literal `it`s under ONE literal `describe` (§9's matrix homes SEVEN acceptance cases here); every opener bound by this file's own `vitest` import and bound exactly once; no variable, parameter or alias named `it`, `test` or `describe`; no bare seed loop |

**Interim rule 13 — the line-addressed registers, grepped path by path:** ⛔ **NONE FOUND**, with the
commands. `git grep -n -F '<path>' -- tests/lint scripts tests/copy` for each of the four paths in
play returns, for `src/copy/en.js` alone, three rows in `scripts/.observed-shape-readers-baseline.json`
— which addresses by `path` + `sha256` + `size`, **not by line** — plus prose mentions in test
headers. `tests/lint/.prose-numerics-baseline.json` names `src/copy/en.js` **0 times**;
`tests/copy/.voice-mechanics-baseline.json` and `.voice-mechanics-jsx-baseline.json` name it **0
times** (the en registry is required to be CLEAN, which is why it carries no debt row). The three
CREATE paths do not exist, so no register can address them. **No re-address row is owed**, and the
precedent agrees: six of the last six commits touching `src/copy/en.js` touched the observed-shape
baseline **zero** times.

**Interim rule 15 — the mutation-coverage manifest: NOT OWED, measured.** `ENFORCER_DIRS` read at
the read tip (V-11) does not contain `tests/components`, and `NAME_PATTERN`'s sixteen words match
none of `editFields`. Confirmed by precedent: `63f3288ab` landed a brand-new
`tests/components/landingNarrateRefusal.test.jsx` with no `scripts/mutation-coverage-manifest.json`
row at all.

**Interim rule 17 — NOT REACHED, measured.** `TREES_P2P3` is exactly `['src/domain','src/generators']`
(V-12); this packet writes two `.jsx` leaves under `src/components/edit/` and one `.js` under
`src/copy/`, so `countUnregisteredNamed` and `countBareDecimals` have no file of this packet's to
count and `tests/lint/.tuning-inventory.json` is unmoved. Both leaves are additionally written so
the P2 predicate would find nothing even if the trees were widened: no module-top-level
`const UPPER_SNAKE = <number>;` exists in either (§6.2 item 2 is why).

**Interim rule 14 — the byte arm: THIS PACKET IS NOT THE HOLDER.** It carries **no row** on
`tests/build/vendorPdfLazy.test.js`. Train EM-T10's byte-arm holder is the chair's to name at the
pre-proof; this member's predicted delta is below.

### The deferred rows — PREDICTIONS, named in no `checks` and in no `changeManifest`

1. **`docs/content/wiring-census.json` — interim rule 1: `+0`.** This packet CREATEs no `.js` under
   `src/generators/**` or `src/domain/**`; those are the two roots measured against.
   `stamp.producerIndexFiles` **+0**; `stamp.files`, `stamp.candidateLeaves` and `totals.*` UNMOVED.
   ⛔ The path is named in NEITHER §7 NOR the capsule NOR `checks`.
2. **`tests/lint/.lighting-census-baseline.json` — a named INTERIOR RED, delta only**, in the
   register's own order: **files +1 · parked +0 · credited +1 · titles +8 · suiteTitles +1**, from
   the ONE new straight-line test file with its EIGHT literal `it`s under ONE literal `describe`.
   ⚠ The credited/parked split is a PREDICTION until the build lane prints `parkReasonsFor` over the
   new file; if it parks, the delta is **parked +1 · credited +0 · titles +0**. ⛔ The row names the
   BASELINE FILE, never the walker; regenerated at the train's terminal BY THE CHAIR, and this
   member never sets `LIGHTING_CENSUS_REFREEZE`.

### The byte price per closure — PREDICTED, never asserted (interim rule 2)

| closure | predicted delta | how it is bounded |
|---|---|---|
| **eager first paint** | **+0 modules AND +0 bytes** | ⭐ the zero is by MEMBERSHIP, not by estimate: every file this packet writes is measured OUTSIDE the 269 (`src/components/edit/` → 0 members; `src/copy/en.js` → 0; only `src/copy/footer.js` is eager). The module count is **269 → 269**, so rule 2's module-count clause has nothing to state |
| lazy engine | **+0** | no engine chunk reaches `src/components/**` |
| generation worker (EXACT, zero slack, no placement cure) | **+0 — NOT REACHED** | nothing under `src/workers`, `src/generators` or `src/domain` imports `src/components/**` |
| the five edge-shared metas | **+0** | no edge function imports `src/components/**` |
| the editor's own LAZY chunk (entered at EM-D0e's `lazy(() => import(…))`) | ≈ **+6 KB** source for the two leaves, ≈ **+400 B** in the copy registry's lazy chunk | outside every signed budget |

⛔ **A rise in the eager first-paint CLOSURE is a STOP for the OWNER.** The probe says +0 modules and
the packet asserts no byte figure. ⛔ **THE ONE WAY THIS COULD BREAK SILENTLY** is a static `import`
of anything under `src/components/edit/` from an eager module; the probe in `checks` is the standing
guard and it reads no `dist`.

---

## §8 · Ordered coding sequence

1. **K-GATE, BEFORE THE FIRST EDIT.** Confirm `git status --short` is EMPTY; confirm EM-A1 is LANDED
   at the base by `git grep -c -F 'FieldDeclaration' -- src/domain/edit/types.js` ≥ 1; confirm
   `git grep -c -F 'PoolField' -- src` = 0; confirm `src/components/edit/` and
   `tests/components/editFields.test.jsx` are ABSENT.
2. **RED FIRST (§9a).** Write `tests/components/editFields.test.jsx` whole and run it — **all eight
   arms MUST be RED** with a module-not-found on the two leaves. An arm that was green before the
   leaves existed is proving nothing, and this is the step that makes that impossible.
3. `src/copy/en.js` — add §6.3's namespace. Nothing else moves.
4. `src/components/edit/FreeField.jsx` — §6.2, the smaller leaf first.
5. `src/components/edit/PoolField.jsx` — §6.1.
6. Re-run the test file: **all eight arms GREEN**.
7. Run §10's sealed `checks`, then §10's instruments. ⛔ Nothing else is repaired on the way.

---

## §9 · Acceptance matrix

| id | case | the FILE that holds it | the §7 row that authorizes that file |
|---|---|---|---|
| **A1** | **A NON-EMPTY POOL RENDERS A SELECTABLE CONTROL.** `PoolField` given EM-A1's `npc.role` row and a three-member options array renders one `<option>` per member in the ARRAY'S OWN ORDER, is ENABLED, takes its accessible name from `declaration.label` through the `useId()`/`<label htmlFor>` pair, and on selection calls `onChange` exactly once with that option's string. | `tests/components/editFields.test.jsx` | its CREATE row |
| **A2** | **AN EMPTY OPTIONS ARRAY RENDERS EMPTY AND DISABLED, NEVER ABSENT.** With `options = []` the `<select>` is IN the document, carries `disabled`, holds exactly ONE option (`t('edit.field.noOptions')`), and the roll `<Button>` is present and `disabled`; `onChange` is never called. | `tests/components/editFields.test.jsx` | its CREATE row |
| **A3** | ⭐ **AN EMPTY VALUE WITH A NON-EMPTY POOL RENDERS SHOWN-EMPTY AND ENABLED — THE COMMON CASE.** With `value` empty (`''`, `undefined` and `null` all three) and a non-empty options array the control renders, is NOT disabled, and its selected option is the selectable `t('edit.field.emptyOption')` member. Design §2.1; EM-A1 §1c.2's *"The card must show it EMPTY"*. ⛔ Measured denominator: `npc.status` 24/336 = 7.1 %, `institution.state` 0 % — the empty VALUE is common; the empty OPTIONS array (A2) is a different fact. | `tests/components/editFields.test.jsx` | its CREATE row |
| **A4** | **THE SEEDED ROLL IS DETERMINISTIC BY REPETITION, AND THE CONTROL DRAWS NOTHING.** (a) Two INDEPENDENT mounts with the same `seed`, `entryId` and `roll`, clicked ONCE each, reach the SAME value, equal to `roll(seed, entryId, 1)` computed outside the component — no mock, no fake timer, no stubbed random. (b) A POSITIVE source scan over both leaves collects every `Math.`, `Date.` and `new Date` occurrence and asserts the list EQUALS the declared EMPTY set. | `tests/components/editFields.test.jsx` | its CREATE row |
| **A5** | **A `null` ROLL ANSWER COMMITS NOTHING.** When the bound `roll` returns `null` (EM-A2a's empty-pool answer), `onChange` is called ZERO times, the rendered value is unchanged, and `t('edit.field.rollUnavailable')` appears. | `tests/components/editFields.test.jsx` | its CREATE row |
| **A6** | **`maxLength` ENFORCED AND REPORTED IN THE SAME RENDER, BOTH FREE KINDS.** `npc.name` → `<input type="text" maxLength=60>`; `npc.note` → `<textarea maxLength=280>`; both numbers asserted against EM-A1's own table, never retyped. At the limit the same render carries `t('edit.field.limit', { actual, max })` — its resolved text `{actual} of {max} characters`, so `60 of 60 characters` for `npc.name` — and BOTH interpolated numbers are asserted, which convicts a notice that reports the limit but not the count; below the limit the notice is absent. ⛔ No `set*Error(` / `set*Notice(` / `showToast('error'` / `fallbackTitle=` idiom is used. | `tests/components/editFields.test.jsx` | its CREATE row |
| **A7** | **EVERY RENDERED STRING COMES FROM `en.js` THROUGH `t()` — A POSITIVE SET EQUALITY.** A source scan over both leaves collects every literal first argument of `t(` and asserts the set EQUALS the declared five; each is RESOLVED against the imported `en` table and asserted to be a non-empty string that is not its own key; each resolved value is asserted to contain no em dash and no exclamation point. | `tests/components/editFields.test.jsx` | its CREATE row |
| **A8** | **FIRST PAINT: `src/components/edit/` CONTRIBUTES ZERO EAGER MODULES, AS A DELTA.** The membership probe imports `vite.config.js`'s own exported set, reads no `dist` and can never skip; the size is N before and N after, no member matches `src/components/edit/` or `src/copy/en.js` in either state, and `src/components/theme.js` is present as the anti-vacuity canary. ⛔ The BYTE delta is not asserted here; it is zero by membership and priced in §7. | the membership probe, `checks[4]` (a command, not a file — this packet edits no file that could hold it, and says so rather than homing it falsely) | n/a |

**Eight cases, AT the cap of eight, and every one of the seven test-borne cases names the same
authorized file.** The count prover (`EM-D0d.count-prover.mjs`) refuses any inequality between this
matrix, §7's row text, §6.4's declared arms and §12's lighting delta.

### §9a · ⛔ THE RED-FIRST PROOF, SPELLED — how no arm can pass vacuously

1. **THE TEST FILE IS WRITTEN AND RUN BEFORE EITHER LEAF EXISTS (§8 step 2).** All eight arms are
   RED with a module-not-found. An arm that is green before its subject exists is a fabricated arm,
   and this ordering makes that impossible.
2. **THE EIGHTH ARM IS THE ANTI-VACUITY ARM.** It asserts (a) that a DIFFERENT `seed` reaches a
   different rendered value through the same injected `roll` — so a roll affordance wired to nothing
   is convicted; and (b) that A1's markup and A2's markup DIFFER — so a serializer returning `''`,
   or a query that found nothing in either case, is convicted here and nowhere else in the file.
3. **A4(b) AND A7 ARE POSITIVE SET EQUALITIES, NOT BARE NEGATIVES.** A positive equality convicts a
   new draw or a new inline string AND convicts a scanner that found nothing; a bare
   `not.toContain(` would do neither, and would owe an `// anchored:` marker under
   `tests/lint/negativeAssertionAnchor.walker.test.js` (`SCAN_ROOTS = ['tests']`).

⛔ **A DEVIATION IF ANY EXISTING FILE OTHER THAN `src/copy/en.js` IS EDITED AT ALL.** The packet's
claim is that two pure leaves need nothing else; editing a shipped component would be the packet
disproving itself.

---

## §10 · Verification commands

**Sealed `checks`** (interim rule 8: FILES, never the `tests/lint` directory, never the lighting
walker; the validator last).

The governing set was computed by `git grep -l -F '<basename without extension>' -- tests` for every
file this packet writes: **`PoolField` → 0 test files; `FreeField` → 0; `editFields` → 0** — the two
new leaves are governed by no existing test, which is what a greenfield directory means. The sealed
set is therefore founded on the CHANGED HUB. `src/copy/en.js` is named by **sixteen** test files
(`tests/components/copyRawKeyRender.test.jsx`, `galleryListErrorSurface`, `galleryPage`;
`tests/copy/localeParity`, `narrativeArchiveDisclosure`, `tierWord.census`, `voiceMechanics`;
`tests/docs/docCounts`; `tests/domain/guidanceNotes`, `guidanceRegistry.walker`;
`tests/helpers/dossierCorpus.js`; `tests/lint/dialogExit.walker`, `errorCopyBaseline`,
`refusalNoticeCoverage.walker`, `settlementMapSurfaceAllowlist.walker`,
`sourceCitationIntegrity.walker`). By the chair's ruling 3 on EM-B2a4 a hub takes the governors of
the CHANGED SYMBOL, not all sixteen: the new namespace is NEW and is named by no existing test, so
the sealed set takes the five that govern the registry ITSELF plus the resolver and the error
ratchet. **The ten excluded, with their reasons:** `galleryListErrorSurface`, `galleryPage`,
`docCounts`, `guidanceNotes`, `guidanceRegistry.walker`, `dossierCorpus.js`, `dialogExit.walker`,
`refusalNoticeCoverage.walker`, `settlementMapSurfaceAllowlist.walker` and
`sourceCitationIntegrity.walker` each read a NAMED existing namespace (`gallery`, `guidance`,
`refusals`, the pipeline-step labels, the dialog `common.close` key) that this packet does not
touch; they are stated here rather than silently omitted, and the whole-directory instrument below
runs them anyway.

```
npx vitest run --pool=threads --maxWorkers=2 tests/components/editFields.test.jsx
npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js tests/copy/localeParity.test.js tests/copy/tierWord.census.test.js tests/copy/narrativeArchiveDisclosure.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/lint/copyKeyResolution.walker.test.js tests/lint/errorCopyBaseline.test.js tests/lint/uiA11yContract.walker.test.js tests/lint/rawButtonBaseline.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/lint/rawColorLiteral.test.js tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/proseNumerics.test.js tests/components/copyRawKeyRender.test.jsx
node -e "const{pathToFileURL}=require('node:url');import(pathToFileURL('vite.config.js').href).then(m=>{const S=[...m.EAGER_FIRST_PAINT_MODULES].map(String);const mine=S.filter(p=>p.includes('src/components/edit/'));const copy=S.filter(p=>p.endsWith('src/copy/en.js'));console.log('EAGER_FIRST_PAINT_MODULES:',S.length,'| src/components/edit members:',mine.length,'| src/copy/en.js members:',copy.length);if(mine.length!==0)process.exit(1);if(copy.length!==0)process.exit(1);if(!S.some(x=>x.endsWith('src/components/theme.js')))process.exit(1);})"
node scripts/implementation-packets.mjs validate
```

**Instruments (the build lane runs them; they are NOT sealed checks).**
- `npx vitest run tests/lint --exclude=tests/lint/sovereigntyLightingContract.walker.test.js` — MUST
  EXIT 0.
- `npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` — the named interior red;
  its five figures must move by §7's declared delta and by nothing else. The lane PRINTS
  `parkReasonsFor` over the new test file and records what it printed, so the credited/parked
  prediction is settled by measurement, not by hope.
- ⭐ **`npx vitest run tests/components`, WHOLE** — the chair's addendum of 2026-09-20 (runs 17, 18
  and 19 were one family): a CREATE under `tests/<dir>` opts into every walker that governs that
  directory. Eleven `tests/lint` files name `tests/components`, and this run plus the excluded
  directory run above covers them.
- `npx eslint src/components/edit/PoolField.jsx src/components/edit/FreeField.jsx` — the three
  ERROR-level JSX rules that bind a brand-new leaf (`jsx-hygiene/no-raw-button`,
  `jsx-hygiene/icon-button-needs-label`, `visual-budget/no-raw-color`). ⛔ **If `no-raw-button`
  fires, the leaf wrote a raw `<button>` and §6.1 item 5 was not followed — STOP, do not add the
  file to `scripts/.raw-button-baseline.json`.**
- ⭐ **THE BROWSER SUITE (interim rule 10) — MEASURED, AND THE ANSWER IS "NONE", SAID WITH THE
  COMMANDS.** This packet writes `src/components/**`, so the rule binds and was discharged by grep
  rather than by assumption. It adds no route and no `data-testid`, and nothing mounts these
  controls until EM-D0e, so no spec can reach them. Executed at the read tip, name by name:
  `git grep -c -F 'PoolField' -- e2e` → **0**; `FreeField` → **0**; `pool-field` → **0**;
  `free-field` → **0**; `roll-another` → **0**; `roll another` → **0**; `editFields` → **0**;
  `edit/PoolField` → **0**; `edit/FreeField` → **0**; and the broad sweep
  `git grep -n -E 'edit-mode|editor|settlementEditor|CardEditor' -- e2e` → **0 hits**. The fifteen
  specs were enumerated from `git ls-files 'e2e/**'`, so the denominator is read and not
  transcribed. ⇒ **this packet names NO `e2e/` spec**, exactly as rule 10's *"If you touch none of
  those, SAY SO and name no spec"* directs.
  ⚠ **AND IT CORRECTS A STALE ROW.** `03-PHONE-AND-DOOR.md` §4.4's table was written against the
  FOUR-member partition: its "D0c" row (*"pure controls, mounted by no route"*) is today's **D0d**
  and its "D0d" row (the four phone specs, *"a new phone sheet at the page's bottom edge"*) is
  today's **D0e**. The partition's own Q6 — ratified by `CHAIR-RULING.md` item 6 — already maps
  those four to D0e and gives D0c "none of its own"; today's D0d is unlisted there and is measured
  here as **NONE**. EM-D0e is the member that opts in (`mobile-pointer-targets`,
  `phone-horizontal-overflow`, `pinned-footer`, `visual-polish`), after
  `lsof -nP -iTCP:5173 -iTCP:5174 -sTCP:LISTEN` prints nothing. ⛔ A spec is never weakened.
- `node EM-D0d.count-prover.mjs EM-D0d.md EM-D0d.manifest.json` — interim rule 12; KIT FURNITURE,
  run from the kit path, never a `checks` entry and never placed in the tree. It reads this packet's
  Markdown and the capsule JSON, never a test runner, and exits non-zero on any inequality between
  the declared arms, the cases the matrix homes, the titles delta and the two path sets.

---

## §11 · Mandatory STOP conditions

1. **`src/domain/edit/types.js` does not export a resolvable `FieldDeclaration` typedef at the base**
   — EM-A1 has not landed. STOP; do not inline a second spelling of the shape.
2. **The eager first-paint set RISES by even one module, or `src/copy/en.js` is found INSIDE it** —
   that budget is owner-signed. STOP for the OWNER; do not re-cut the probe.
3. **`jsx-hygiene/no-raw-button` fires on either leaf** — the leaf wrote a raw `<button>`. STOP; the
   cure is `<Button>` with the role passed through `...rest`, never a baseline entry.
4. **An arm is GREEN at §8 step 2, before either leaf exists** — the arm is fabricated. STOP and
   rewrite it; never keep an arm that was never red.
5. **Making A2 pass would disable a control that A3 requires enabled** — the two empties have been
   conflated again. STOP: A2 is the options array, A3 is the value.
6. **`maxLength` has to be retyped as a literal to make A6 pass** — the number belongs to EM-A1's
   `TEXT_LIMITS` and is read, never copied. STOP.
7. **A rendered string cannot be expressed without an inline literal** — design §3 and A7 forbid it.
   STOP and add the key to §6.3 rather than the string to a leaf.
8. **`node scripts/implementation-packets.mjs validate` reports a duplicate change path on
   `src/copy/en.js`** — a sibling (EM-D0e) has been placed non-terminally. STOP and tell the chair;
   do not drop the row silently.
9. **`PoolField` reaches `roll(...)` on a mount that passed no `roll`** — the leaf dropped version
   2's `typeof roll === 'function'` predicate from item 5, item 6, or both. STOP: EM-A2a is
   unwritten, so an absent roller is a LAWFUL mount at this member's landing and a `TypeError` on
   the first click would be this packet's defect, not EM-A2a's. The cure is the predicate, never a
   `try`/`catch` and never a stub roller inside the control.

---

## §12 · Receipt, questions and handoff

**What EM-D0e consumes, by exact name.** Two default exports and their exact prop names, and nothing
else:
- `PoolField` from `src/components/edit/PoolField.jsx` —
  `{ declaration, options, value, onChange, seed, entryId, roll, disabled }`.
- `FreeField` from `src/components/edit/FreeField.jsx` — `{ declaration, value, onChange, disabled }`.
- The `roll` prop's shape: `(seed: string, entryId: string, n: number) => string | null`, which the
  mount binds as `(seed, entryId, n) => rollFrom(declaration.pool, world, seed, entryId, n)` —
  exactly ARCH §1's *"seeded by settlement seed + entry id + roll counter"*.
- The five copy keys `edit.field.{emptyOption,noOptions,rollAnother,rollUnavailable,limit}` — EM-D0e
  adds `edit.dialog.*` beside them and re-uses none of these.
- EM-D0e's own mapping obligation: `kind: 'pool'` → `PoolField`; `kind: 'free'` and
  `'free-cascade'` → `FreeField`; `kind: 'share'` → ⛔ **EM-D2's**, absent from the NPC card.

**The lighting delta this packet predicts:** files **+1** · parked **+0** · credited **+1** · titles
**+8** · suiteTitles **+1**, in the register's own order.

**QUESTIONS ONLY THE CHAIR CAN ANSWER** (four, each with a one-line recommendation):

1. **EM-A1's dependency is TYPE-ONLY, measured.** Neither leaf calls `declarationsFor` or reads
   `FIELD_DECLARATIONS`; the only edge is a JSDoc `import()` of the typedef. *Recommend: keep
   `Depends on: EM-A1 (LANDED)` and the typedef import. Dropping it would let D0d ride an earlier
   train, but it would mint a second spelling of the shape EM-A1 §6.2's absence table exists to
   keep single — and the saving is one train, not one gate.*
2. **`PoolField` is a native `<select>`, not the aria-combobox, and search is therefore not built
   here.** Measured: 53 files to 3, and all three combobox files are OPEN registries; the shipped
   combobox's option rows are raw `<button>`s in a grandfathered file a new leaf may not join.
   Design §3's own words are *"drop-down, search, **or both**"*. *Recommend: ratify the `<select>`.
   If the chair wants search at the first door, it is a second affordance on the same leaf — about
   +40 lines and a fourth `useState` — and it should be said now, because adding it later is a
   contract change to a landed control.*
3. **The brief's clause 3 conflates two empties** (header, and A2 vs A3). *Recommend: adopt the
   split as compiled — A2 the empty OPTIONS array (empty and disabled), A3 the empty VALUE (shown
   empty and ENABLED). The alternative disables 93 % of NPC status fields and 100 % of institution
   state fields on the day the door opens.*
4. **The `roll` prop's arity is a contract this packet fixes and no authority fixed before it.**
   EM-A2a's `rollFrom` takes five arguments; a pure control may supply only three of them.
   *Recommend: `(seed, entryId, n)` as compiled — the control supplies exactly ARCH §1's three named
   key parts and stays ignorant of `poolId`, `world` and the catalogue. The alternative, passing
   `declaration.pool` through as a fourth argument, is defensible but puts a pool id in a control
   that is supposed not to know one.*

**One CONFIRMED-versus-PLAUSIBLE sentence.** Every fact in §2.2, §5 rows V-1 to V-16, §7's rule-13,
rule-15 and rule-17 rows, §10's browser-suite greps and A8's +0 is **CONFIRMED** — executed at
`429141e2d` (or, for V-15 and V-16, read from EM-A1's real staged files in `$SP/lane-em-a1-t9`) with
the command quoted in `EM-D0d.evidence.md`; everything resting on EM-A2a's unwritten code (the
`roll` prop's bound body, `rollFrom`'s `null` answer, and therefore A5's exact behaviour) is
**PLAUSIBLE**, to be re-measured at placement against the landed `src/domain/edit/pools.js`.

**Noticed, not touched** (not this packet's, and recorded so they are not re-found): (1)
`src/components/EntityPicker.jsx` renders inline English strings (`'Search to add…'`, `'Remove'`,
`'No matches in …'`) rather than `t()` keys — the estate's copy law is not universal in components,
and this member does not widen the debt; (2) `03-PHONE-AND-DOOR.md` §4.4's per-member `e2e/` table
is still numbered for the FOUR-member partition and disagrees with the partition's own Q6, which the
chair ratified — one edit to that finding file would close it; (3) EM-A2b mints a `name.npc` POOL
(`:419`) that no `FieldDeclaration` consumes, because EM-A1 declares `npc.name` as `free-cascade`
with no `pool` key — a pool with no declared consumer at the first door.
