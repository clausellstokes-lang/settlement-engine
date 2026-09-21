# Settlement editor / EM-D0c — THE HALO-CAPABLE SURFACE: one optional `editorHalo` prop on `PortablePopup` and on `BottomSheet`, defaulted off, so the editor's pop-up wears the forge's ground, gold rim and parchment bloom while three shipped consumers stay byte-identical

- **Status:** `LANDED`
  ⚠ The status value above stands ALONE on its line (interim rule 5): `parsePacketHeader` anchors
  the row at end-of-line and takes `status` only when exactly one row matches. Every stamp, caveat
  and date is on these continuation lines.
  ⭐ **THE THIRD OF THE FIVE MEMBERS OF EM-D0**, the first door (design §3 "The halo" and §20.1 /
  §20.4; `EM-D0.partition.md`, section "D0c"; ratified by `CHAIR-RULING.md` item 2). It needs
  **EM-D0a LANDED** and rides the train AFTER EM-T9.
  ⛔ **THE PARTITION'S NAME `EDITOR_HALO` DOES NOT EXIST AND EM-D0a DOES NOT MINT IT.** EM-D0a
  version 2.1 §6.1 mints `houseBloom(tone)` — a pure function — and its own change-manifest row for
  `src/components/theme.js` says, verbatim: *"The editor's halo constants are NOT minted here: they
  arrive with EM-D0c, which is the member that has a consumer for them, so this packet mints no
  unconsumed export."* This packet is therefore the member that mints the editor's one ground
  constant, and the halo's pin is re-founded on names that will exist (§6.4). **Q1 and Q2 to the
  chair, §12.**
- **Landed at:** `7277520c215f827637d4961e9344406c6336f3e3` — the twentieth landing — train EM-T10: PortablePopup and BottomSheet can wear the editor's halo through one optional prop (the first door, member 3; the train's byte-arm holder)
- **Packet version:** 2
  ⭐ **WHAT VERSION 2 CHANGED AND WHY.** An INDEPENDENT pre-proof re-measured this packet against
  the chair's train worktree `em-train-9-2026-09-21`, where train EM-T9's four members exist as
  REAL CODE and stand `LANDED` in the estate. Four things moved. (1) **THIS PACKET IS NOW TRAIN
  EM-T10'S BYTE-ARM HOLDER** (interim rule 14; the chair's judgment 89 item 4): it carries the one
  `TEST` row on `tests/build/vendorPdfLazy.test.js` with a stated bound covering the TRAIN'S SUM,
  and §7 prices that sum member by member. (2) Every fact version 1 marked **PLAUSIBLE** because
  EM-D0a was unwritten is now **CONFIRMED against real code** — `houseBloom`'s exported spelling,
  its arity, the background value it returns, `ArrowControl.jsx`'s consumption of it, and both
  colour tokens — so the `houseBloom` row moves from `_pendingRequiredSymbols` into
  `requiredSymbols`. (3) **A2's byte identity was REFOUNDED:** `BottomSheet` calls `useId()` and
  renders the result twice into the opened markup, and React 19.2.5's client id counter is a
  MODULE-LEVEL global that never resets between roots — so a raw byte literal of the opened sheet
  could not have been stable across the file's own renders (§9 A2, measured). (4) Interim rule 17
  (added 2026-09-21 05:26) is discharged by measurement, and the interim-rules header row now reads
  1–17.
- **Verified base:** `em-t10-d0c-2026-09-21` at `e348d59b609e2c62c957a4cd78653849792043b7`
  ⚠ Left for the chair's promotion stamp (interim rule 5: the value stands alone on its line).
  **The revalidation sentence the chair will use:** *"Re-measured at the train worktree
  `em-train-9-2026-09-21` (`$SP/em-train-9`, READ-ONLY; the pre-proof wrote nothing in it and ran
  nothing heavier than `git show`, `git grep` and plain-node reads): train EM-T9's four members are
  `LANDED` in `docs/implementation/PACKET_MANIFEST.json` and EM-D0a's `theme.js` reservation is
  therefore released (`reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)`), as is
  EM-D0b's on `tests/build/vendorPdfLazy.test.js`, which this packet now holds; the one CREATE
  target ABSENT (`git ls-files tests/components/primitives` lists exactly one file,
  `useDialogFocusTrap.test.jsx`); all TWELVE `requiredSymbols` rows present VERBATIM at
  `git grep -c -F` = 1, including `export function houseBloom(tone) {` at `src/components/theme.js`
  and both byte-arm rows at `tests/build/vendorPdfLazy.test.js`; `retiredSymbols` empty and proved
  by the post-edit simulation; the eager first-paint set measured **269** by importing
  `vite.config.js`'s own export, with BOTH primitives and all THREE consumers OUTSIDE it and no
  module entering; `git grep -l -F 'editorHalo' -- src` and `git grep -l -F 'EDITOR_GROUND' -- src`
  both EMPTY (0 files), and `git grep -l -F 'houseBloom' -- src` exactly
  `src/components/nav/ArrowControl.jsx` and `src/components/theme.js`."*
  ⚠ The preamble hash is MEASURED at the chair's own read tip at promotion and never copied from
  this row (the three laws, 2026-09-20); the figure version 1 recorded is kept below as history.
  ⛔ A `__BASE__` packet can never pass `validate:packets`; validation is downstream of this stamp.
- **Last revalidated:** left for the chair, with the sentence above.
- **Depends on:** **EM-D0a (LANDED — MEASURED, no longer a prediction)** — this packet calls
  `houseBloom` and cannot compile without it. At the train worktree the recipe is real code at
  `src/components/theme.js:91` and EM-D0a's estate row reads `- **Status:** \`LANDED\``, so the
  dependency is discharged and the row that version 1 held in `_pendingRequiredSymbols` is now a
  `requiredSymbols` row (§5).
- **Collision group:** ⭐ **BOTH RESERVATIONS ARE RELEASED, MEASURED AT THE TRAIN TIP.**
  ⛔ **THE MECHANISM (`scripts/implementation-packets.mjs:828, 866`):
  `reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)` and
  `TERMINAL_PACKET_STATUSES = new Set(['LANDED','SUPERSEDED'])`.** Read over the tip's own
  `PACKET_MANIFEST.json`, exactly TWO placed packets reserve a path this one writes, and both are
  terminal: **EM-D0a `LANDED` → `MODIFY src/components/theme.js`** and **EM-D0b `LANDED` →
  `TEST tests/build/vendorPdfLazy.test.js`** (the row this packet now takes as train EM-T10's
  byte-arm holder). ⛔ **If either is NOT terminal when the chair places this packet, the validator
  refuses with `duplicate change path across packets: <path> (EM-D0a|EM-D0b, EM-D0c)` — STOP
  condition 7, now widened to name both paths.** No placed packet reserves
  `src/components/primitives/PortablePopup.jsx`, `src/components/primitives/BottomSheet.jsx` or
  `tests/components/primitives/editorHalo.test.jsx`.
  ⭐ **PATH-DISJOINT INSIDE TRAIN EM-T10, MEASURED AGAINST ALL SIX SIBLING CAPSULES**
  (EM-B1i v3 · EM-B2a1 v2.1 · EM-B3e v2 · EM-B1a v7 · EM-D0d v1 · EM-P4 v1): **ZERO shared paths
  with any of them**, and no sibling names the byte-arm path, so rule 14's "two members naming it
  refuse at placement" cannot fire inside this train.
- **Lane branch:** `em-t10-d0c-2026-09-21` (interim rule 11: a forward posture; the chair re-points
  this row at promotion).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Both primitives read WHOLE at the read tip; the three consumers'
  call sites read at source; the eager first-paint set by IMPORTING `vite.config.js`'s own export
  (269, reading no `dist`); the motion grammar's closed twelve and its reduced-motion block read at
  source; the `e2e/` inventory grepped name by name; the line-addressed registers grepped path by
  path. Receipts in `EM-D0c.evidence.md`.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR;
  measured at this read tip as
  `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`, identical to the hash the
  installed EM-D0a v2.1 carries).
  > **Interim compile rules:** `COMPILE-RULES.interim.md` (the chair, 2026-09-20) — the fifth
  > amendment's rules (1–17 as of 2026-09-21), obeyed before they land. Where this packet and
  > `EM-PREAMBLE.md` (SHA-256 `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`)
  > disagree, the interim rules govern and this row is the record of it.

---

## §1 · Reconciled authority

| authority | section + item | what it binds here |
|---|---|---|
| the owner-ratified design | §3 "The halo", bullets (1)–(6) | light not elevation; the GROUND darker than today's scrims; STILL after kindling; the phone's top-edge glow; where it may not go; it is decoration |
| the owner-ratified design | §20.1 | the RIM is the forge's `GOLD`, the BLOOM is the arrow's parchment light, ONE recipe home, never a second recipe, never a new hex |
| the owner-ratified design | §20.4 | the door lands behind the tier gate and DARK; ⛔ visibility is the OWNER's |
| the chair's ruling | `CHAIR-RULING.md` item 2 | EM-D0c is ratified as its own member |
| the chair's ruling | `CHAIR-RULING.md` item 4 | ⭐ **`BottomSheet`'s existing elevation on the phone STAYS; on the phone the halo is the sheet's top-edge glow** |
| the chair's ruling | `CHAIR-RULING.md` item 6 | the per-member `e2e/` sets are adopted as measured |
| EM-D0a v2.1 | §6.1, §6.2 and its `theme.js` manifest row | `houseBloom(tone)` is the ONE recipe; the editor's halo constants arrive with THIS packet |
| interim compile rules | 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 | each discharged by name in §7, §9a, §10 and §12 |
| the chair's ruling | `PREPROOF-EM-T10…/CHAIR-RULING.md`, the EM-B3e section item (4) | ⭐ **EM-D0c IS TRAIN EM-T10's BYTE-ARM HOLDER** (interim rule 14, judgment 89) |

⛔ **WHAT THIS PACKET DOES NOT DECIDE.** Whether the editor's pop-up is ever SHOWN is the owner's
(design §20.4). This packet makes a surface CAPABLE of the halo and mounts it nowhere: with the prop
absent — which is every shipped call site — nothing in the product renders one pixel differently.

---

## §2 · Outcome

### §2.1 What this packet delivers
`PortablePopup` and `BottomSheet` each gain **ONE optional boolean prop, `editorHalo`, defaulted
`false`**. With it absent the two primitives render markup that is **byte-identical** to the markup
they render at the verified base. With it set, the surface wears the three marks design §3 names:
the **GROUND** (warm umber, near-opaque, darker than the house warm-dim), the **RIM** (the forge's
`GOLD`) and the **BLOOM** (`houseBloom(PARCH_100)`, a background value and never a shadow).

### §2.2 ⛔ THE THREE MEASURED FACTS THAT SHAPE THE CONTRACT

**(a) `PortablePopup` has no phone sheet and no style slot.** Its whole contract at the base is
`{ open, title, onClose, children, testId = 'portable-popup', width = 560 }` — no `style`, no
`surface`, no `scrim`. It hard-codes the scrim (`rgba(27,20,8,0.58)`, line 63), the surface
(`border`/`borderRadius: 0`/`background: CARD`/**`boxShadow: 'none'`**, lines 82-85), the header
(line 95) and the close control (line 104). `useIsMobile()` feeds font size only.

**(b) `BottomSheet` is NOT a controlled dialog** — a fact the partition did not carry. It owns its
`open` as internal `useState(false)` (line 52) and renders its own trigger `Button` (lines 74-83);
its props are `{ title, triggerLabel, count, children, triggerVariant, fullWidthTrigger, onOpen, onClose }`.
Its surface carries **`boxShadow: ELEV[3]` (line 116)**, which stays (CHAIR-RULING item 4), and its
scrim carries **no class and no animation** (line 95) — unlike `PortablePopup`'s, which carries
`className="oc-m-warmdim"` (line 50).

**(c) ⛔ THE MOTION VOCABULARY IS CLOSED AT TWELVE AND THE HALO MAY NOT GROW IT.**
`src/design/organic/motion.js` declares *"Twelve named behaviors, and nothing else, ever … a new
behavior is a design-law change, not a convenience"*; `MOTION_GRAMMAR` is frozen and
`tests/design/organicMotion.test.js` asserts `expect(MOTION_CLASSES).toHaveLength(12)`, that every
class exists in `organic.css`, that **keyframes animate transform/opacity ONLY**, and that the
reduced-motion block collapses `[class*='oc-m-']` globally to `0.001ms`. ⇒ **this packet mints no
thirteenth behavior, no new `@keyframes` and no new `prefers-reduced-motion` media query.** It
reuses `oc-m-warmdim` — the existing behavior already on `PortablePopup`'s scrim — as the halo's
kindling vehicle on both primitives.

### §2.3 ⭐ HOW `prefers-reduced-motion` IS ALREADY HONOURED — MEASURED, AND NO SECOND IDIOM IS MINTED
The estate honours the query **twice, globally, with no per-component work**:
`src/styles/a11y.css:91-99` collapses `animation-duration`, `animation-iteration-count`,
`transition-duration` and `scroll-behavior` on `*`, `*::before`, `*::after` with `!important`; and
`src/styles/organic.css`'s reduced-motion block collapses `[class*='oc-m-']` and
`[class*='oc-m-']::after` to `0.001ms`, asserted by `organicMotion.test.js`. Because the halo's
kindle rides `oc-m-warmdim`'s existing `oc-warmdim` keyframe (`from { opacity: 0 } to { opacity: 1 }`
over `--oc-motion-settle`), **under reduced motion the halo simply appears — by construction, with
nothing added.** Design §3 bullet (3) is discharged without one new line of CSS. (The eleven files
that carry their own `prefers-reduced-motion` query are the estate's older, per-component form; the
global blocks supersede them for a class-driven behaviour, and minting a twelfth would be the second
idiom the brief forbids.)

### §2.4 In scope / out of scope
**In:** one optional prop per primitive; one ground constant in `theme.js`; one new test file.
**Out:** ⛔ every mount. No consumer is edited; `CardEditorDialog` (EM-D0e) is the first caller.
⛔ No copy string is added, so `src/copy/en.js` is untouched (§6.5). ⛔ No `e2e/` spec is touched or
weakened. ⛔ `BottomSheet`'s `ELEV[3]` is not changed in either branch. ⛔ No scrim, header or close
control of any shipped consumer moves.

---

## §3 · Hard scope budget

| limit | this packet | cap |
|---|---|---|
| behaviour families | 1 (one surface becomes halo-capable) | 1 |
| new persisted record families | 0 | ≤1 |
| feature flags | 0 — the prop is a render option, not a flag | ≤1 |
| user-facing surfaces | **0 — nothing mounts the prop** | ≤1 |
| direct production consumers | **0** (EM-D0e is the first) | ≤2 |
| new logic-bearing production leaves | **0** | ≤2 |
| existing logic-bearing production files modified | **3** | ≤3 |
| handwritten files total | **4** | ≤12 |
| §7 rows (four handwritten + one `TEST` row that makes NO EDIT) | **5** | n/a |
| new/changed effective production lines | **≈ 34** (`theme.js` +4; `PortablePopup.jsx` +13; `BottomSheet.jsx` +17) | ≤400 |
| each new production leaf | n/a — none | ≤250 each |
| shared / hot-file delta | `src/components/theme.js` **+4** | ≤15 |
| named acceptance cases | **7** | ≤8 |

Overrides approved before dispatch: **NONE.** The three modified logic files sit AT the cap, not
over it; §12 Q2 carries the two-file alternative if the chair prefers headroom.

**Hot files:** `src/components/theme.js` is a HUB (EM-D0a measured 50 test files naming it). The
delta is +4 purely additive lines — no existing export's declaration, value or order moves — so the
consequence is a `checks`-scoping rule (§10), not a budget one.

---

## §4 · Sealed dispatch and preflight

- **branch name** — the chair's; the packet asserts nothing beyond the `Lane branch` row.
- **ancestry** — the chair replaces `__BASE__` at promotion and nowhere else.
- **substrate unchanged since the verified base** — of the `requiredSymbols` paths this packet
  writes three (`theme.js`, `PortablePopup.jsx`, `BottomSheet.jsx`); every required text survives
  those edits verbatim (§5's post-edit simulation, row by row).
- **CREATE targets absent** — `tests/components/primitives/editorHalo.test.jsx` verified absent at
  `429141e2d` (`git ls-files tests/components/primitives` returns exactly
  `tests/components/primitives/useDialogFocusTrap.test.jsx`).
- **git-clean** — the lane wrote nothing in any tree; `git status --short` in `read-tip-em-t8-tip`
  was EMPTY at the start and at the end.
⚠ **SEALED DISPATCH WANTS THE WORKTREE ON THE VERIFIED BRANCH:** one build lane holds the
integration branch in its worktree while the chair's stays detached at the tip.

---

## §5 · Verified tree contract

⭐ **RE-PROVED BY THE INDEPENDENT PRE-PROOF at the train worktree `em-train-9-2026-09-21`, where
train EM-T9 is real code:** every row below returns `git grep -c -F` = **1**, all FOURTEEN of them
(the twelve `requiredSymbols` rows and the two the byte arm adds), unless its cell says otherwise
(receipts: `EM-D0c.evidence.md` §E; version 1's receipts at `429141e2d` are kept unrewritten).

| what | path | symbol (verbatim) | why it must not move |
|---|---|---|---|
| ⛔ light, never elevation | `src/components/primitives/PortablePopup.jsx` | `boxShadow: 'none',` | **the packet WRITES this path.** Design §3 (1) grounds the whole halo on this line; it is UNTOUCHED in BOTH branches and survives the edit verbatim |
| ⛔ the phone's shipped elevation | `src/components/primitives/BottomSheet.jsx` | `boxShadow: ELEV[3],` | **the packet WRITES this path.** CHAIR-RULING item 4: it STAYS, in both branches, so two foreign consumers do not move |
| the kindling vehicle | `src/components/primitives/PortablePopup.jsx` | `className="oc-m-warmdim"` | the existing member of the closed twelve the halo rides; the packet does not remove it |
| the door, desktop | `src/components/primitives/PortablePopup.jsx` | `const popupRef = useDialogFocusTrap(open, onClose);` | §934.31's lifecycle arm; the packet adds a prop and does not touch the hook call |
| the door, phone | `src/components/primitives/BottomSheet.jsx` | `const sheetRef = useDialogFocusTrap(open, close);` | the same, for the sheet |
| the desktop consumer's call | `src/components/map/CausalityPopup.jsx` | `<PortablePopup open={open} title="Why this happened" onClose={onClose} testId="causality-popup">` | **PRESERVE UNTOUCHED.** The negative control renders the primitive with exactly this prop set |
| the gallery consumer's call | `src/components/gallery/GalleryFilterShell.jsx` | `<BottomSheet title="Filters" triggerLabel="Filters" count={activeCount} fullWidthTrigger>` | **PRESERVE UNTOUCHED.** Same, for the sheet's first consumer |
| the library consumer's call | `src/components/library/LibraryToolbar.jsx` | `triggerVariant={activeFilterCount > 0 ? 'gold' : 'secondary'}` | **PRESERVE UNTOUCHED.** Same, for the sheet's second consumer (its `<BottomSheet` opener spans lines 340-345, so the one-line anchor is the distinguishing prop) |
| the tone the bloom takes | `src/components/theme.js` | `export const PARCH_100 = L.PARCH_100;` | **the packet WRITES this path**, additively; `PARCH_100`'s declaration is untouched |
| the rim's colour | `src/components/theme.js` | `export const GOLD     = L.GOLD;` | the forge's gold, §20.1; untouched |
| the eager set | `vite.config.js` | `export const EAGER_FIRST_PAINT_MODULES` | the membership probe imports it; a hand-seeded replica drifts silently |
| ⭐ **the ONE recipe, NOW REAL** | `src/components/theme.js` | `export function houseBloom(tone) {` | **PROMOTED from `_pendingRequiredSymbols` by the pre-proof.** EM-D0a is LANDED: the recipe is real code at `theme.js:91`, arity ONE, and it returns `` `radial-gradient(closest-side, color-mix(in srgb, ${tone} 34%, transparent), transparent)` `` — a BACKGROUND value, which is what §6.2 and §6.3 paint. **the packet WRITES this path**, additively, so the text survives its own edit |
| ⛔ **the owner-signed ceiling** | `tests/build/vendorPdfLazy.test.js` | `const CLOSURE_BUDGET_BYTES = 1_048_000;` | the bound §7 prices the WHOLE TRAIN against. ⛔ **This packet makes NO EDIT on this path**; the ceiling moves only if the OWNER moves it |
| ⛔ the ceiling's own pin | `tests/build/vendorPdfLazy.test.js` | `expect(CLOSURE_BUDGET_BYTES, 'the raw first-paint budget moved').toBe(1_048_000);` | the arm (`:1769`, under *"ARCH car 2 — the three first-paint budgets stay where the owner signed them"*) that makes a raise a deliberate act; untouched |

**`_pendingRequiredSymbols` (interim rule 3 — a SIBLING KEY, never an element of `requiredSymbols`):
⭐ NOW EMPTY, BOTH ROWS DISCHARGED BY MEASUREMENT.**

| what | path | how version 2 discharged it |
|---|---|---|
| the ONE recipe | `src/components/theme.js` | **PROMOTED into `requiredSymbols` above** — the symbol is present VERBATIM at the train tip (`git grep -c -F` = 1) |
| the recipe's proof | `tests/design/houseBloom.test.js` | **DISCHARGED BY EXISTENCE, not carried as a symbol row.** The file exists (86 lines, EM-D0a's CREATE) and this packet neither calls into it nor adds a second proof of the recipe; a `requiredSymbols` row on a file this packet does not consume would pin a sibling's test text for no contract reason |

⛔ **`import { BORDER, BORDER2, CARD, CARD_ALT, FS, INK, SECOND, SP, sans } from '../theme.js';`
(`PortablePopup.jsx:26`) AND the `BottomSheet.jsx:34-36` specifier block ARE DELIBERATELY NOT
REQUIRED SYMBOLS:** the packet changes both lines (each specifier list gains names), so naming them
would refuse at the packet's own post-edit validation. Recorded here rather than silently omitted.

**`retiredSymbols`: EMPTY**, and proved row by row (pre-proof step 10). Nothing is renamed, moved or
deleted: every edit is additive or a literal lifted into a `const` in the same file. Interim rule 16
discharged: **this packet renames no binding, parameter or call shape**, so there is no old spelling
to grep — and the two prop names it introduces (`editorHalo`) are new words, measured absent from
`src`, `tests`, `scripts` and `docs/implementation` at the base (`git grep -c -F 'editorHalo'` → 0).

---

## §6 · Exact contracts

### §6.1 `src/components/theme.js` — the editor's ground, minted where EM-D0a says it belongs

```js
/**
 * THE EDITOR'S GROUND — the warm umber the forge's pop-up is laid over. Design §3 halo (2):
 * "THE GROUND is warm umber and near-opaque, never pure black … darker than today's dialog
 * scrims (0.58 on PortablePopup, 0.46 on BottomSheet), which is also what makes the editor
 * known at a glance". It mixes the SAME ink token organic.css's `.oc-m-warmdim` mixes at 58%,
 * through the house color-mix idiom — never a new hex, never a second recipe.
 */
export const EDITOR_GROUND = 'color-mix(in srgb, var(--oc-ink-deepest) 76%, transparent)';
```

⛔ **EXACT, WITH NO DISCRETION, EXCEPT THE ONE FIGURE §12 Q2 PUTS TO THE CHAIR.** `76%` is the only
number in this packet that no authority fixes: the design says "darker than 0.58" and
"near-opaque, never pure black" and stops. It is spelled ONCE, in one file, and both primitives read
it — so it can never become two grounds. ⛔ No `#` literal and no `rgba(` is added to `theme.js`.

### §6.2 `src/components/primitives/PortablePopup.jsx` — the desktop surface

```js
import { BORDER, BORDER2, CARD, CARD_ALT, EDITOR_GROUND, FS, GOLD, INK, PARCH_100, SECOND, SP, houseBloom, sans } from '../theme.js';

/**
 * @param {boolean} [props.editorHalo]  the editor's forge light: the warm-umber ground, the
 *   GOLD rim and the PARCH_100 bloom of design §3. DEFAULT FALSE, and with it absent this
 *   component renders byte-identically to its shipped self. ⛔ The halo goes on the editor's
 *   pop-up and NOWHERE else (design §3 bullet 5).
 */
export default function PortablePopup({ open, title, onClose, children, testId = 'portable-popup', width = 560, editorHalo = false }) {
```

Three edits inside the body, and **nothing else in the 112-line file moves**:

1. **THE GROUND.** The scrim's `background` value becomes a computed one, declared beside `mobile`:
   ```js
   // THE EDITOR'S GROUND, or the house warm-dim this popup has always drawn. The literal is the
   // token warm-dim value (58% ink-deepest, matching .oc-m-warmdim), kept byte-for-byte.
   const ground = editorHalo ? EDITOR_GROUND : 'rgba(27,20,8,0.58)';
   ```
   and line 63 becomes `background: ground,`. ⛔ `className="oc-m-warmdim"` (line 50) STAYS in both
   branches: it is what kindles the ground and, with it, the bloom layered on the same node.
2. **THE BLOOM.** Appended to the scrim's style object, AFTER `background`, and present only when
   the prop is set:
   ```js
   ...(editorHalo ? {
     backgroundImage: houseBloom(PARCH_100),
     backgroundRepeat: 'no-repeat',
     backgroundPosition: 'center',
     backgroundSize: `${width * 2}px ${width * 2}px`,
   } : null),
   ```
   ⛔ **THE BLOOM IS A BACKGROUND AND NEVER A SHADOW** (EM-D0a §6.1's own words). It is painted on
   the scrim, centred where the flex box already centres the plate, so the light reads AROUND the
   opaque plate — the owner's *"glow around the edges of the box … like a halo"* — and the plate's
   own `boxShadow` is untouched. `width` is the existing prop, so the bloom's box tracks the plate.
3. **THE RIM.** Line 82's border becomes
   ``border: `1px solid ${editorHalo ? GOLD : BORDER}`,`` — with the prop absent this produces the
   identical string. ⛔ `borderRadius: 0`, `background: CARD` and **`boxShadow: 'none'`** are
   UNTOUCHED in both branches.

### §6.3 `src/components/primitives/BottomSheet.jsx` — the phone surface (CHAIR-RULING item 4)

```js
import {
  BODY, BORDER, CARD, CARD_ALT, EDITOR_GROUND, ELEV, FS, GOLD, INK, MUTED, PARCH_100, R, SP, houseBloom, sans,
} from '../theme.js';

export default function BottomSheet({
  title, triggerLabel = 'Filters', count, children, triggerVariant = 'secondary',
  fullWidthTrigger = false, onOpen, onClose, editorHalo = false,
}) {
```

Three edits inside the body, and **nothing else in the 179-line file moves**:

1. **THE GROUND AND THE KINDLE.** The scrim div (line 86) gains, only when the prop is set, the
   house behaviour that both darkens and kindles:
   ```js
   className={editorHalo ? 'oc-m-warmdim' : undefined}
   ```
   ⛔ React omits the attribute entirely for `undefined`, so the default markup is byte-identical —
   and with the prop set the sheet's ground joins the SAME member of the closed twelve the desktop
   popup already uses, which is why this packet mints no thirteenth behaviour (§2.2 c) and needs no
   new media query (§2.3). Line 95's background becomes
   `background: editorHalo ? EDITOR_GROUND : 'rgba(27,20,8,0.46)',`.
2. **THE TOP-EDGE GLOW.** Appended to the same style object, only when set:
   ```js
   ...(editorHalo ? {
     backgroundImage: houseBloom(PARCH_100),
     backgroundRepeat: 'no-repeat',
     backgroundPosition: 'center bottom',
     backgroundSize: '100% 40vh',
   } : null),
   ```
   Design §3 bullet (4): *"THE PHONE: the sheet meets the scrim only along its top edge, so there
   the halo is that edge's glow."* The bloom is anchored to the scrim's BOTTOM, which is exactly the
   sheet's top edge.
3. **THE RIM.** Line 112 becomes ``borderTop: `1px solid ${editorHalo ? GOLD : BORDER}`,`` — the rim
   on the one edge that meets the scrim. ⛔ **`boxShadow: ELEV[3]` (line 116) IS UNTOUCHED IN BOTH
   BRANCHES** (CHAIR-RULING item 4): the phone sheet keeps its shipped elevation and wears light
   beside it; no shared shadow changes for `GalleryFilterShell` or `LibraryToolbar`.

### §6.4 ⭐ THE HALO'S PIN — re-founded on names that will exist, and written to be GROWN

The partition's pin (`git grep -l EDITOR_HALO -- src`) cannot be written: the name exists nowhere
(§2, and `EM-D0c.evidence.md` §A.1). The pin this packet writes is **two greps, both exact-set**:

⭐ **BOTH ENDS ARE NOW MEASURED AGAINST REAL CODE** — the BASE column at the train worktree where
EM-D0a is landed, the LANDING column derived from this packet's own §7 rows.

| grep | the set at the BASE (measured) | the set AT THIS PACKET'S LANDING | grown by |
|---|---|---|---|
| `git grep -l -F 'editorHalo' -- src` | **EMPTY (0 files)** | `src/components/primitives/BottomSheet.jsx` · `src/components/primitives/PortablePopup.jsx` — **and nothing else** (2 files) | ⭐ **EM-D0e**, which adds exactly one file: `src/components/edit/CardEditorDialog.jsx`, the one caller that passes the prop |
| `git grep -l -F 'houseBloom' -- src` | **`src/components/nav/ArrowControl.jsx` · `src/components/theme.js`** — exactly two, measured | `src/components/theme.js` (the recipe) · `src/components/nav/ArrowControl.jsx` (EM-D0a's reader) · the two primitives — **and nothing else** (4 files) | ⭐ **EM-D0e** adds none: the dialog passes `editorHalo` and never re-composes the recipe |
| `git grep -l -F 'EDITOR_GROUND' -- src` | **EMPTY (0 files)** | `src/components/theme.js` · the two primitives — **and nothing else** (3 files) | ⭐ **EM-D0e** adds none |

⛔ Design §3 bullet (5) is what these sets enforce: *"the editor's pop-up only — never a dossier
card, a pencil, a plus, the mode indicator or the registry page."* The arm asserts the sets
**exactly, in both directions**, so a later surface that wears the halo reds the pin and a later
packet that widens it must say so in its own §7 row. It is grown by a NAMED packet, never loosened.

### §6.5 Copy, determinism, lifecycle, receipts
- **Copy:** ⛔ **THE PROP ADDS NO RENDERED STRING** — not a label, not a title, not an aria value.
  `src/copy/en.js` is untouched and `t()` gains no key, so interim clause 8 is discharged by there
  being nothing to route. `tests/copy/voiceMechanics.test.js`'s two line-addressed baselines name
  none of this packet's paths (§7's rule-13 row).
- **Hash / fork key:** NONE. No random number, no id, no clock.
- **Ordering:** n/a. Two pure render branches of one boolean.
- **Absence vs empty vs null:** `editorHalo` defaults to `false`; `undefined` and absence are the
  same path by the default parameter; no other falsy value is special-cased, because the prop is
  read only in three ternaries.
- **Lifecycle, every path** — *create / read / persist / regenerate / undo / import / migrate*: ⛔
  **NONE OF THEM.** No record, no save, no store, no persisted key, no chronicle line. Two render
  options on two presentational primitives.
- **Golden posture: UNCHANGED.** No generator, no prose, no seed. `tests/property/*` do not move.

---

## §7 · Exact change manifest

Generated from `EM-D0c.manifest.json` (interim rule 6: §7 and the capsule are SET-EQUAL; the path
sets were diffed before hand-off and the count prover re-checks it).

| action | path | what |
|---|---|---|
| MODIFY | `src/components/theme.js` | `EDITOR_GROUND` — one exported string constant, §6.1's exact spelling, minted where EM-D0a's own manifest row says the editor's halo constants belong. Purely additive; no existing export moves. ⛔ **EAGER FILE** — priced in §7's byte row |
| MODIFY | `src/components/primitives/PortablePopup.jsx` | the `editorHalo` prop and §6.2's three edits: the ground `const`, the bloom spread, the rim ternary. ⛔ `boxShadow: 'none'` and `className="oc-m-warmdim"` survive verbatim |
| MODIFY | `src/components/primitives/BottomSheet.jsx` | the `editorHalo` prop and §6.3's three edits: the conditional `oc-m-warmdim` class + ground, the bottom-anchored bloom, the top rim ternary. ⛔ `boxShadow: ELEV[3]` survives verbatim |
| CREATE | `tests/components/primitives/editorHalo.test.jsx` | **EIGHT** straight-line literal `it`s under ONE literal `describe` (§9's matrix homes SIX acceptance cases here); every opener bound by this file's own `vitest` import and bound exactly once; no variable, parameter or alias named `it`, `test` or `describe`; no bare seed loop |
| TEST | `tests/build/vendorPdfLazy.test.js` | ⛔ **NO EDIT.** Interim rule 2's row, held by this member because the chair named it **TRAIN EM-T10's BYTE-ARM HOLDER** (rule 14, judgment 89 item 4). **The stated bound is `CLOSURE_BUDGET_BYTES = 1_048_000`** (`:565`, pinned at `:1769`), and it covers THE TRAIN'S SUM, priced below. The measuring arm is `:1020`, gated on `VERIFY_DIST=1` and reading `dist` with `statSync`, so it prices the BUILT closure and JSDoc costs it nothing. ⛔ The row adds, removes and renames nothing; the ceiling moves only if the OWNER moves it |

**Interim rule 13 — the line-addressed registers, grepped path by path:** ⛔ **NONE FOUND**, with the
command. `git grep -n -F '<path>' -- tests/lint scripts tests/copy` for each of the five paths in
play returns only `scripts/.observed-shape-readers-baseline.json`, which is **CONTENT-addressed, not
line-addressed** (`grep -c '"line"'` over it → **0**; its own `_doc` says *"The line number is
excluded so unrelated line churn does not rewrite the governed identity"*), plus
`tests/lint/lucideTotality.test.js:193`, which names `BottomSheet.jsx` in `GATE_PRIMITIVES` — a
FROZEN LIST OF PATHS, not of lines, and this packet changes neither the lucide import nor the
`useIconsOn()` gate, so the row is UNMOVED. `tests/lint/proseNumerics.test.js` names none of the
five paths, and neither `.voice-mechanics-baseline.json` nor `.voice-mechanics-jsx-baseline.json`
does. **No re-address row is owed.**

**Interim rule 15 — the mutation-coverage manifest: NOT OWED, measured.** `ENFORCER_DIRS` read at
the read tip from `tests/lint/mutationCoverage.shared.mjs:36-45` is exactly
`['tests/lint','tests/design','tests/docs','tests/data','tests/copy','tests/security','tests/edgeFunctions','tests/generators']`.
This packet's one CREATE is under **`tests/components/`**, which is in none of them, so no
`REGISTER` row on `scripts/mutation-coverage-manifest.json` and no `rowKey` is owed, and
`tests/lint/mutationCoverageManifest.test.js` is not in `checks`. (EM-D0a's CREATE under
`tests/design` DOES owe one; this packet's does not, and the difference is the directory.)

**Interim rule 14 — the byte arm: ⭐ THIS PACKET IS TRAIN EM-T10's BYTE-ARM HOLDER** (the chair's
judgment 89 item 4). It carries the ONE row on `tests/build/vendorPdfLazy.test.js`; every other
member of the train carries none and names this packet. **The bound covers the train's SUM:**

| member | eager file(s) it writes | eager delta | how the figure was got |
|---|---|---|---|
| **EM-D0c** (holder) | `src/components/theme.js` **only** — both primitives measured LAZY | **≤ 100 B** | §6.1's block is **557 source bytes**, of which **466 are JSDoc** the minifier strips; the one code line is **91 B** and its incompressible core is the 60-byte value string. EM-D0a's own build-lane precedent on the same file: 861 source / 721 JSDoc / **140 code → ≈ +79 minified** |
| EM-P4 | `src/domain/entities/npcs.js` · `src/domain/entities/status.js` · `src/generators/lookups.js` (its two CREATEs are LAZY) | **≤ 100 B**, and **the eager MODULE count moves 269 → 270** | a pure relocation: the moved bodies are the same bytes, so its pre-proof measures **+14 SOURCE bytes** net across the whole eager closure — one module wrapper and the re-export statements. ⛔ Rule 2 as AMENDED: the count is a derivation no test asserts, the BYTES are what the owner signed |
| EM-D0d | none | **+0** | by MEMBERSHIP: `src/copy/en.js` and `src/components/edit/**` are outside the 269 |
| EM-B1a | none | **+0** | both CREATEs (`src/domain/edit/operations.js`, `worldConditions.js`) measured outside the 269 |
| EM-B1i | none | **+0** | `src/domain/worldPulse/causeLifecycle.js` measured outside the 269 |
| EM-B2a1 | none | **+0** | `src/domain/edit/dmLayer.js` measured outside the 269 |
| EM-B3e | none | **+0** | all three `src/lib/**` paths measured outside the 269 |
| **TRAIN SUM** | — | **< 250 B** | against `CLOSURE_BUDGET_BYTES = 1_048_000` |

⚠ **THE SLACK, AND WHAT ONLY A BUILD CAN SETTLE.** The last EXECUTED raw-closure figure in the
tree is **1,047,205 B** against 1,048,000 — **795 B of slack** — recorded in the constant's own
ratification block (2026-09-01, T13 build #4). Train **EM-T9 has since added eager source that has
not been re-measured**: EM-A1 **+0** and EM-B1h **+0** (both files measured outside the 269),
EM-D0a **≈ +79 B** (measured: 140 code bytes), EM-D0b **≤ 200 B** (measured: +225 net code bytes in
the eager `authSlice.js`) ⇒ EM-T9 consumed **≈ 280 B**, exactly inside the `< 320 B` its own holder
declared. ⇒ **the slack entering train EM-T10 is ≈ 515 B**, and this train's `< 250 B` fits it with
roughly 265 B to spare. ⛔ **That subtraction is arithmetic on SOURCE bytes, not a build.** The
chair takes EM-T9's terminal build's printed `first-paint static closure = N bytes` and hands N to
this row before EM-T10 is cut; if N leaves under 250 B of slack, the cure is PLACEMENT (split the
train), never a re-mint — **a summed closure over 1,048,000 is a STOP FOR THE OWNER** (§11 item 2).

**Interim rule 17 — the tuning inventory and the wiring census's two red arms: BOTH N/A, MEASURED.**
`scripts/lib/tuning-inventory.mjs:60` reads `export const TREES_P2P3 = Object.freeze(['src/domain',
'src/generators'])`, and all three of this packet's `src/` writes are under `src/components/`, so
`countUnregisteredNamed` and `countBareDecimals` never read them and **no count moves**. `TREES_P1`
(`['src']`, line 58) scans for `*_TUNING` TABLES; `EDITOR_GROUND` is a single exported string
constant and names no table, so P1 is unmoved too. This packet CREATEs no `.js` leaf under either
tree, so `proseWiringCensus.walker.test.js` stays GREEN and rule 17's two-arm exclusion is not owed
(rule 1's row already says `+0`).

### The deferred rows — PREDICTIONS, named in no `checks` and in no `changeManifest`

1. **`docs/content/wiring-census.json` — interim rule 1: `+0`.** This packet CREATEs no `.js` under
   `src/generators/**` or `src/domain/**`; those are the two roots measured against, and its only
   `src/` writes are under `src/components/`. `stamp.producerIndexFiles` **+0**; `stamp.files`,
   `stamp.candidateLeaves` and `totals.*` UNMOVED. ⛔ The path is named in NEITHER §7 NOR the
   capsule NOR `checks`.
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
| **eager first paint** | **+0 modules** (CONFIRMED by the membership probe, re-executed at the train tip: **269 → 269**) and **≤ 100 B minified** from `theme.js`'s one code line — the ONLY eager file this packet writes (both primitives measured LAZY) | ⭐ **this packet IS the holder**: the row above states the bound and the train's sum; the terminal's ONE real build proves it |
| lazy engine | **+0** | neither primitive nor `theme.js` is reached from the engine chunk |
| generation worker (EXACT, zero slack, no placement cure) | **+0 — NOT REACHED** | no import under `src/workers`, `src/generators` or `src/domain` names either primitive; EM-D0a measured the same for `theme.js` (its one grep hit is JSDoc prose at `src/domain/display/labelCase.js:7`) |
| the five edge-shared metas | **+0** | no edge function imports `src/components/**` |
| the two primitives' own chunks | **≈ +900 B** total, LAZY | outside every signed budget; both primitives are absent from the eager 269 (probe, executed) |

⛔ **A rise in the eager first-paint CLOSURE is a STOP for the OWNER.** The probe says +0 modules;
the packet does not assert the byte figure.

---

## §8 · Ordered coding sequence

1. **K-GATE, BEFORE THE FIRST EDIT.** Confirm `git status --short` is EMPTY; confirm EM-D0a is
   LANDED at the base by `git grep -c -F 'export function houseBloom' -- src/components/theme.js`
   = 1; confirm `git grep -c -F 'editorHalo' -- src` = 0; confirm
   `tests/components/primitives/editorHalo.test.jsx` is ABSENT.
2. **CAPTURE THE PRE-CHANGE MARKUP (§9a's red-first; this step happens BEFORE any source edit).**
   Write the new test file with its three byte-identity literals and run it — it must be **GREEN
   against the UNEDITED primitives**. A literal that was never green pre-change is a fabricated
   capture, and this is the step that makes that impossible.
3. `src/components/theme.js` — add `EDITOR_GROUND` (§6.1) beside `houseBloom`. Nothing else moves.
4. `src/components/primitives/PortablePopup.jsx` — the prop, the import names, §6.2's three edits.
5. `src/components/primitives/BottomSheet.jsx` — the prop, the import names, §6.3's three edits.
6. Add the five lit-branch arms and the anti-vacuity arm to the test file (eight `it`s in total).
7. Run §10's sealed `checks`, then §10's instruments. ⛔ Nothing else is repaired on the way.

---

## §9 · Acceptance matrix

| id | case | the FILE that holds it | the §7 row that authorizes that file |
|---|---|---|---|
| **A1** | **NEGATIVE CONTROL, DESKTOP — AND IT IS A BYTE IDENTITY, NOT A LIKENESS.** `PortablePopup` rendered with exactly `CausalityPopup.jsx:123`'s prop set (`open`, `title="Why this happened"`, `onClose`, `testId="causality-popup"`, children) serializes to markup **character-for-character equal** to the capture taken from the PRE-CHANGE source in §8 step 2. | `tests/components/primitives/editorHalo.test.jsx` | its CREATE row |
| **A2** | **NEGATIVE CONTROL, PHONE, BOTH CONSUMERS — AND THE ONE TOKEN THE PACKET CANNOT OWN IS NORMALIZED, NOT ASSERTED.** `BottomSheet` rendered twice — once with `GalleryFilterShell.jsx:84`'s props (`title="Filters"`, `triggerLabel="Filters"`, `count`, `fullWidthTrigger`) and once with `LibraryToolbar.jsx:340-345`'s (`title="Filter settlements"`, `triggerLabel="Filters"`, `count`, `triggerVariant`) — serializes to its two pre-change captures, **in both the closed and the opened state** (the sheet owns its `open`, so the arm clicks the trigger to reach the dialog). ⛔ **MEASURED, AND IT REFOUNDS THIS ARM: `BottomSheet.jsx:53` calls `useId()` and renders the value TWICE into the opened markup — `aria-labelledby` on the `<section>` and `id` on the `<h2>` — and React 19.2.5's client id is `"_" + prefix + "r_" + (globalClientIdCounter++).toString(32) + "_"` (`react-dom/cjs/react-dom-client.development.js:9060-9062`), from a MODULE-LEVEL counter initialised once at `:26130` and never reset between roots.** So the generated id DIFFERS on every render in one test module, and a raw byte literal of the opened sheet could not have stayed green as §8 step 6 adds five more renders after the step-2 capture. The arm therefore **normalizes exactly that token — `/_r_[0-9a-z]+_/g` → `_ID_` — in BOTH the capture and the comparison, and in NOTHING else**, and adds one positive assertion in its place: the `<section>`'s `aria-labelledby` EQUALS the heading's `id` (the idiom `tests/components/gatheredAdjudication.test.jsx:187` already uses), so the label relationship is proved rather than frozen. Every byte this packet could move is still compared verbatim. ⛔ This case plus A1 is **the member's whole justification**. | `tests/components/primitives/editorHalo.test.jsx` | its CREATE row |
| **A3** | **THE HALO LIT, DESKTOP.** With `editorHalo`, the scrim's style carries `EDITOR_GROUND` verbatim and `houseBloom(PARCH_100)`'s exact string; the plate's border is `1px solid ${GOLD}`; and **`box-shadow: none` is STILL on the plate** — asserted positively, by reading the serialized style, so design §3 (1)'s "light, not elevation" is proved rather than assumed. | `tests/components/primitives/editorHalo.test.jsx` | its CREATE row |
| **A4** | **THE HALO LIT, PHONE — AND THE SHIPPED ELEVATION STAYS.** With `editorHalo`, the sheet's scrim carries the class `oc-m-warmdim` and `EDITOR_GROUND`; the bloom's `background-position` is `center bottom` (design §3 (4): the glow is the top edge's); `border-top` is `1px solid ${GOLD}`; and **`box-shadow` still equals `ELEV[3]`** (CHAIR-RULING item 4), asserted against the token's own value read from `theme.js`. | `tests/components/primitives/editorHalo.test.jsx` | its CREATE row |
| **A5** | **NO NEW HEX — ASSERTED POSITIVELY, NOT AS A BARE NEGATIVE.** A source scan over the two primitives collects every `#`-colour and `rgba(` literal and asserts the collected list **EQUALS** the declared two-element set (`'rgba(27,20,8,0.58)'`, `'rgba(27,20,8,0.46)'`) — the two the files already carry. A positive set equality convicts a new literal AND convicts a scanner that found nothing, so no `// anchored:` marker is owed (`tests/lint/negativeAssertionAnchor.walker.test.js` scans `tests` whole and its frozen map carries `tests/components/*` rows — this arm deliberately writes no `not.toContain(` / `not.toMatch(` / `not.toHaveProperty(`). | `tests/components/primitives/editorHalo.test.jsx` | its CREATE row |
| **A6** | **THE PIN, EXACT IN BOTH DIRECTIONS, AND THE DOOR UNMOVED.** (a) §6.4's three source scans over `src/` return exactly their declared sets and nothing else. (b) The §934.31 door survives in BOTH branches for BOTH primitives: each still renders `role="dialog"` with `aria-modal="true"`, each file still calls `useDialogFocusTrap`, and each still renders a control whose accessible name contains "Close" (`Close ${title}` on the popup's `IconButton`; `aria-label="Close"` on the sheet's button) — the three facts `tests/lint/dialogExit.walker.test.js` reads, asserted here on the rendered output so the walker's verdict cannot move silently. | `tests/components/primitives/editorHalo.test.jsx` | its CREATE row |
| **A7** | **FIRST PAINT: +0 EAGER MODULES, AS A DELTA.** The membership probe imports `vite.config.js`'s own exported `EAGER_FIRST_PAINT_MODULES`, reads no `dist` and therefore can never skip; the set's size is N before and N after, with **both primitives and all three consumers absent** from it in both states and no module entering. ⛔ The BYTE delta is NOT asserted here — it is priced in §7 and summed by the chair from ONE real build. | the membership probe, `checks[3]` (a command, not a file — this packet edits no file that could hold it, and says so rather than homing it falsely) | n/a |

**Seven cases, at no more than eight, and every one of the six test-borne cases names the same
authorized file.** The count prover (`EM-D0c.count-prover.mjs`) refuses any inequality between this
matrix, §7's row text, §6's declared arms and §12's lighting delta.

### §9a · ⛔ THE RED-FIRST PROOF, SPELLED — how the negative control cannot pass vacuously

The arm is a **byte identity against a capture taken from the PRE-CHANGE source**, and three things
make it un-fakeable:

1. **THE CAPTURE IS TAKEN BEFORE THE EDIT (§8 step 2).** The test file, with its three expected-markup
   literals, is written and run to GREEN against the unedited primitives. A literal that has never
   been green pre-change cannot enter the file.
   ⛔ **ONE TOKEN IS NORMALIZED BEFORE THE COMPARISON, AND ONLY ONE (A2, measured):** the React
   `useId` value `BottomSheet` renders twice into the opened sheet, rewritten `/_r_[0-9a-z]+_/g` →
   `_ID_` on BOTH sides. It is normalized because React's counter is a module-level global that
   advances on every render in the file, so it is the one substring no packet can hold still; and
   because it is normalized on both sides, it can hide nothing this packet could move. The label
   relationship it used to carry is asserted positively in its place.
2. **PLANT AND RESTORE, IN THE BUILD LANE'S GATE SCRIPT.** After the source edits land, the build
   lane re-proves the capture's provenance without trusting step 2's memory:
   ```sh
   git stash push -- src/components/theme.js src/components/primitives/PortablePopup.jsx src/components/primitives/BottomSheet.jsx
   npx vitest run --pool=threads --maxWorkers=2 tests/components/primitives/editorHalo.test.jsx -t 'byte-identical'   # MUST be GREEN
   git stash pop
   npx vitest run --pool=threads --maxWorkers=2 tests/components/primitives/editorHalo.test.jsx                        # MUST be GREEN, all eight
   ```
   Green on BOTH sides of the same literals is what "byte-identical before and after" means, executed.
3. **THE ANTI-VACUITY ARM (the eighth `it`).** The same three renders with `editorHalo` SET are
   asserted to **DIFFER** from those literals, and the diff is asserted to contain the gold rim's
   spelling. A comparison that compared nothing, or a serializer that returned `''`, is convicted by
   this arm and by nothing else in the file.

⛔ **A DEVIATION IF ANY OF THE THREE CONSUMERS IS EDITED AT ALL.** The packet's claim is that they do
not change; editing one would be the packet proving itself.

---

## §10 · Verification commands

**Sealed `checks`** (interim rule 8: FILES, never the `tests/lint` directory, never the lighting
walker; the validator last). The governing set was computed by `git grep -l -F '<basename>' -- tests`
for every file this packet writes and every consumer whose call shape it must not move:
`PortablePopup` → `tests/design/deepCraftKillList.test.js`; `BottomSheet` →
`tests/components/mobilePrimitives.test.jsx`, `tests/components/libraryMobile.test.jsx`,
`tests/ui/gallerySidebarRestore.test.jsx`, `tests/lint/lucideTotality.test.js`; `CausalityPopup` →
`tests/ui/causalityPopup.test.jsx`; `GalleryFilterShell` →
`tests/components/galleryFilterParity.test.jsx`; `LibraryToolbar` →
`tests/components/libraryToolbar.test.js`, `tests/components/livingWorldSignals.test.js`.
`theme.js` is a HUB, so by the chair's ruling 3 on EM-B2a4 the sealed set takes the grep of the
CHANGED SYMBOL only — `EDITOR_GROUND` is NEW and names no existing test, stated rather than silently
omitted.

```
npx vitest run --pool=threads --maxWorkers=2 tests/components/primitives/editorHalo.test.jsx tests/components/primitives/useDialogFocusTrap.test.jsx
npx vitest run --pool=threads --maxWorkers=2 tests/ui/causalityPopup.test.jsx tests/components/galleryFilterParity.test.jsx tests/components/libraryToolbar.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/components/mobilePrimitives.test.jsx tests/components/libraryMobile.test.jsx tests/ui/gallerySidebarRestore.test.jsx tests/components/livingWorldSignals.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/lint/dialogExit.walker.test.js tests/lint/lucideTotality.test.js tests/design/organicMotion.test.js tests/design/deepCraftKillList.test.js
node -e "const{pathToFileURL}=require('node:url');import(pathToFileURL('vite.config.js').href).then(m=>{const S=[...m.EAGER_FIRST_PAINT_MODULES].map(String);const out=['src/components/primitives/PortablePopup.jsx','src/components/primitives/BottomSheet.jsx','src/components/map/CausalityPopup.jsx','src/components/gallery/GalleryFilterShell.jsx','src/components/library/LibraryToolbar.jsx'];const inn=out.filter(p=>S.some(x=>x.endsWith(p)));console.log('EAGER_FIRST_PAINT_MODULES:',S.length,'| of this packet=s five surfaces, eager:',inn.length);if(inn.length!==0)process.exit(1);if(!S.some(x=>x.endsWith('src/components/theme.js')))process.exit(1);})"
node scripts/implementation-packets.mjs validate
```

**Instruments (the build lane runs them; they are NOT sealed checks).**
- `npx vitest run tests/lint --exclude=tests/lint/sovereigntyLightingContract.walker.test.js` — MUST EXIT 0.
- `npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` — the named interior red; its
  five figures must move by §7's declared delta and by nothing else.
- ⭐ **THE BROWSER SUITE (interim rule 10) — MEASURED, AND THE ANSWER IS "NONE", SAID WITH THE
  COMMANDS.** This packet touches `src/components/**`, so the rule binds and was discharged by grep
  rather than by assumption. It adds **no route, no `data-testid`, no accessible name and no role**:
  every identifier the two primitives and their three consumers expose was grepped across `e2e/`
  name by name —
  `git grep -l -F 'portable-popup' -- e2e` → **none**;
  `git grep -l -F 'causality-popup' -- e2e` → **none**;
  `git grep -l -F 'Filters' -- e2e` → **none**;
  `git grep -l -F 'Close' -- e2e` → two files, and **neither is these primitives'**
  (`e2e/regional-causality.spec.js:374` drives `getByTitle('Close inspector')`, a different surface;
  `e2e/visual-polish.spec.js:51` is the word "Closed" inside a comment).
  The fifteen specs were enumerated from `git ls-files 'e2e/*.spec.js' 'e2e/**/*.spec.js'`, so the
  denominator is read and not transcribed. ⇒ **this packet names NO `e2e/` spec**, exactly as rule
  10's *"If you touch none of those, SAY SO and name no spec"* directs, and it re-derives at this tip
  the partition's `03-PHONE-AND-DOOR.md` §4.4 row for D0c. ⚠ **EM-D0e IS THE MEMBER THAT OPTS IN**
  (`mobile-pointer-targets`, `phone-horizontal-overflow`, `pinned-footer`, `visual-polish`), and it
  runs them only after `lsof -nP -iTCP:5173 -iTCP:5174 -sTCP:LISTEN` prints nothing. ⛔ A spec is
  never weakened.
- ⭐ **THE BYTE ARM (interim rule 2: a `dist` arm is an INSTRUMENT, never a sealed check).** After
  the train's ONE real build, at the terminal, by the chair:
  ```sh
  VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js
  ```
  Stated bound: `CLOSURE_BUDGET_BYTES = 1_048_000` (`:565`, pinned at `:1769`). The arm at `:1020`
  prints `first-paint static closure = N bytes (budget 1048000)`; **N is the figure §7's slack
  paragraph is waiting for**, and the train's summed growth must sit inside the bound. ⛔ A closure
  over the ceiling is a STOP FOR THE OWNER (§11 item 2), never a re-mint.
- `node EM-D0c.count-prover.mjs <packet.md> <capsule.json>` — interim rule 12; KIT FURNITURE, run
  from the kit path as the build lane's PRE-SEAL instrument, never a `checks` entry and never placed
  in the tree. It reads this packet's Markdown and the capsule JSON, never a test runner, and exits
  non-zero on any inequality between the declared arms, the cases the matrix homes and the titles
  delta.

---

## §11 · Mandatory STOP conditions

1. **`houseBloom` is not exported from `src/components/theme.js` at the base** — EM-D0a has not
   landed and this packet cannot compile. STOP; do not re-mint the recipe.
2. **The eager first-paint set RISES by even one module** — that budget is owner-signed. STOP for
   the OWNER; do not re-cut the probe.
3. **Any of the three byte-identity captures is red before the source edits** (§8 step 2) — the
   capture is wrong or a sibling moved the primitive. STOP and re-measure; never adjust a literal to
   make it green.
4. **`boxShadow: 'none'` on the popup's plate or `boxShadow: ELEV[3]` on the sheet's surface has to
   move to make an arm pass** — both are §5 rows and CHAIR-RULING item 4. STOP.
5. **The halo needs a thirteenth `oc-m-*` behaviour, a new `@keyframes`, or a new
   `prefers-reduced-motion` query** — the twelve are closed by design law (§2.2 c). STOP and bring it
   to the chair as a design-law change.
6. **The scrim's darker ground cannot be expressed without a new `#` or `rgba(` literal** — design
   §20.1 forbids a new hex. STOP.
7. **`node scripts/implementation-packets.mjs validate` reports `duplicate change path across
   packets` on EITHER `src/components/theme.js` (EM-D0a) OR `tests/build/vendorPdfLazy.test.js`
   (EM-D0b)** — the named sibling is not yet terminal. Both were measured `LANDED` at the train tip;
   if either has moved, STOP and tell the chair. Do not drop either row silently, and do not move
   the byte arm to another member without the chair's word: rule 14 gives one train ONE holder.
8. **The opened-sheet capture is red and the only difference is a `_r_…_` token** — that is the
   `useId` counter, not a regression (A2). Apply the declared normalization on BOTH sides; ⛔ never
   widen the normalization to any other substring, and never adjust a markup literal to make it
   green (STOP condition 3 stands).
9. **EM-T9's terminal build reports a first-paint closure that leaves under 250 B of slack** —
   the train's summed price no longer fits under `CLOSURE_BUDGET_BYTES`. STOP and bring it to the
   chair as a PLACEMENT question (split the train), never as a ceiling re-mint; a summed closure
   over the ceiling is a STOP FOR THE OWNER.

---

## §12 · Receipt, questions and handoff

**What EM-D0e consumes, by exact name:** the prop **`editorHalo`** (boolean, default `false`,
identical spelling on both primitives) and nothing else. It passes `editorHalo` on the desktop
`PortablePopup` and on the phone `BottomSheet`; it does **not** import `EDITOR_GROUND`, `GOLD`,
`PARCH_100` or `houseBloom`, and §6.4's pin is what holds it to that.

**The lighting delta this packet predicts:** files **+1** · parked **+0** · credited **+1** · titles
**+8** · suiteTitles **+1**, in the register's own order — the ONE new file with its EIGHT literal
`it`s under ONE literal `describe`.

**VERSION 1'S FOUR QUESTIONS ARE RULED** (judgment 84, 2026-09-21 03:11): the pin is §6.4's three
exact-set greps; `EDITOR_GROUND` at 76 % lives in `theme.js` and the packet is placed only once
EM-D0a is `LANDED`; the phone's kindle is the conditional `oc-m-warmdim` class; three modified logic
files AT the cap is accepted with no override. Version 2 changes none of them — it CONFIRMS the
measurements each rested on.

**QUESTIONS ONLY THE CHAIR CAN ANSWER — VERSION 2** (four, each with a one-line recommendation):

1. **THE SLACK, NOT THE BOUND, IS THE TRAIN'S RISK.** The bound (`1_048_000`) is the owner's
   ceiling; what the train actually spends is measured only by a real build, and the last executed
   closure figure in the tree is 2026-09-01's **1,047,205** — three weeks and one whole train old.
   *Recommend: the chair reads `first-paint static closure = N bytes` off **EM-T9's terminal build**
   and hands N to this row before EM-T10 is cut. If N leaves under 250 B, split the train by
   PLACEMENT (EM-P4 rides alone); never re-mint the ceiling.*
2. **A2's normalization is a deliberate hole in a byte identity, and the chair should ratify it in
   terms.** *Recommend: ratify `/_r_[0-9a-z]+_/g → _ID_`, on both sides, plus the positive
   `aria-labelledby` ↔ heading-`id` assertion — the alternative (freezing a literal `_r_3_`) makes
   the arm depend on how many renders precede it, which is exactly the fragility §9a exists to
   remove.*
3. **`tests/components/mobilePrimitives.test.jsx` is a FOURTH direct caller of `BottomSheet` and it
   asserts the OPENED dialog** (`:13`, `:33`, `:43`, `:53`, four `test()`s). It is already in §10's
   sealed `checks`. *Recommend: leave it a sealed check and add nothing to it — the prop defaults
   `false`, so its four arms cannot move; if any of them reds, that is the negative control failing
   in a second file and it is a STOP, not a fixture to update.*
4. **`EDITOR_GROUND`'s eager cost may be ZERO rather than ≤ 100 B, and the packet does not claim to
   know which.** `theme.js` is eager, but the constant's only consumers (the two primitives) are
   LAZY, so whether the bundler keeps the declaration in the eager chunk or hoists it to the lazy
   one is a rollup decision no source read settles. *Recommend: keep the conservative ≤ 100 B in the
   bound — a bound that is too generous costs nothing, and the terminal's one build replaces the
   estimate with the measurement.*

**One CONFIRMED-versus-PLAUSIBLE sentence.** **CONFIRMED**, executed at the train worktree where
EM-T9 is real code: every §5 row at `git grep -c -F` = 1 (fourteen of fourteen), `houseBloom`'s
exported spelling and arity and the background value it returns, `ArrowControl.jsx:39/42`'s
consumption of it, both colour tokens, the three shipped consumers being EXACTLY three (every other
`PortablePopup` / `BottomSheet` hit in `src` inspected and found to be prose), §6.4's three pin sets
in both their base and their post-landing form, the eager set at **269** with all five of this
packet's surfaces outside it and `theme.js` inside it, every sibling's eager membership (so the
train's `+0` rows are measured here and not relayed), the estate's two released reservations, rule
10's `e2e` answer of NONE over a denominator of 15 specs, rules 13 · 15 · 17 as N/A, React 19.2.5's
`useId` counter read from its own source, and the count law re-proven after these edits.
**PLAUSIBLE**, and named: every MINIFIED byte figure in §7 (source bytes and the EM-D0a precedent
are the derivation; only the terminal's ONE real build settles them), and therefore the train's
`< 250 B` sum and the `≈ 515 B` of slack it is subtracted from.

**Noticed, not touched** (not this packet's, and recorded so they are not re-found): (1)
`BottomSheet.jsx:117` animates `sf-sheet-up`, a keyframe defined nowhere — the sheet's slide is
dead; (2) `PortablePopup`'s scrim carries `oc-m-warmdim` while `BottomSheet`'s does not, so the two
modal grounds are inconsistent today; (3) `tests/components/useDialogFocusTrap.test.jsx` and
`tests/components/primitives/useDialogFocusTrap.test.jsx` both exist — two files for one hook.
