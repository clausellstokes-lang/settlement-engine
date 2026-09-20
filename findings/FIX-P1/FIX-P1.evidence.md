# FIX-P1 — THE MEASUREMENT, taken BEFORE the first edit

Lane: Opus FIX-P1. Chair: Fable 5.1, session a9df403c. Date 2026-09-20.
Worktree `$SP/lane-fix-p1`, branch `fix-fork-salt-2026-09-20`, cut from **63e40fe57**
(`PACKETS: EM-B1k LANDED at 19c4cb853 (version 2)…`). `git status --short` empty at cut.

Subject: REVIEW-P **F1** (two anonymous visitors fork byte-identical worlds) and
**noticed 1** (`main.jsx:127`'s false premise), **noticed 2** ("New Draft" and the strip),
**noticed 8** (the 8-character user-id truncation).

---

## M1 — EVERY READER OF THE FORK SEED (the consumer census)

`git grep -n "forkSeedFor" -- src tests scripts e2e docs`

**Production callers — exactly TWO, both passing the auth id:**

| Site | Call |
|---|---|
| `src/components/generate/FoundingWorlds.jsx:91` | `const seed = forkSeedFor(sample, authUserId);` (`authUserId = useStore((s) => s.auth.user?.id)`) |
| `src/components/SettlementsPanel.jsx:158` | `const seed = forkSeedFor(sample, authUser?.id);` |

No other `src` file imports it. No `scripts/` reader. No `e2e/` reader.

**Test readers — FIVE files:**

| File | How it reads the seed | Does my change move it? |
|---|---|---|
| `tests/data/sampleSettlements.test.js:153-187` | `describe('forkSeedFor()')` — five cases, two of which **pin the defect** | **YES, deliberately** (see M6) |
| `tests/components/foundingWorlds.test.jsx:80-81` | recomputes the expected seed by **calling `forkSeedFor(first, undefined)`** and asserting the component passed the same value | **NO** — both sides call the same function against the same jsdom `localStorage`, so they agree by construction. Only its comment ("the seed suffix is 'anon'") goes stale |
| `tests/lib/editTravel.test.js:129` | `seed: forkSeedFor(sample, 'user-1234')` — an explicit id, used as an opaque input | NO |
| `tests/store/generateStrayConfigSeed.test.js:136` | `forkSeedFor(sample, 'user1234')` — explicit id, opaque | NO |
| `tests/domain/contentSamplePreview.test.js:16` | `seed: 'mossgate-004-anon'` as a **legacy STORED save value**, never derived | NO — and it is positive evidence for THE PROMISE (M4) |

## M2 — GOLDENS AND FIXTURES: NOTHING PINS A FORK'S OUTPUT (no STOP)

```
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  dossier-prose-manifest-golden.json
```

- `grep -c "anon"` in **both** golden files: **0**.
- `grep -o "cnocby…|mossgate…|blackcrag…"` in both golden files: **no match**.
- `grep -rln "mossgate-004-anon\|cnocby-033a-anon\|blackcrag-016-anon" tests/fixtures/ src/`: **no match**.
- `git grep -rn "cnocby-033a"` over the whole tree: **one hit**, `src/data/sampleSettlements.js:156`,
  the sample's OWN curated seed (not a fork seed).

**No golden moves. No committed fixture moves.** The `sample-cnocby` card's own seed
(`cnocby-033a`) is untouched by this cure; only the SUFFIX changes.

## M3 — THE ANONYMOUS ENVELOPE: what it is, and why the salt does NOT go in it

Two distinct local persistences exist, and the launch message's "non-schema" qualifier
separates them:

1. **The zustand projection** — `PERSIST_KEY = 'settlementforge'`
   (`src/store/persistProjection.js:131`), holding lane 12's one-key `anonDraft` envelope
   (ODQ §934.8). ⛔ **This surface IS registry-guarded**: `tests/store/lifecycleRoundTrip.test.js:141`
   freezes `ZUSTAND_PERSIST_KEYS` and its walker demands *"add it to ZUSTAND_PERSIST_KEYS and
   cover it in mergePersistedState (persistMerge.js) or a returning user forks shapes"* (:694).
   Adding a key here is a **persisted-shape** act.
2. **Standalone device-local keys under `src/lib/`** — `sf.anon.gens`
   (`src/lib/anonGenCounter.js:37`), `sf_view_token` (`src/lib/deviceToken.js:14`). Mint-once,
   fail-soft, no schema, no registry. **`git grep` finds NO storage-key registry walker**
   (`STORAGE_KEY_REGISTRY|storageKeys|STORAGE_KEYS` over `tests src scripts`: no match).

REVIEW-P's own cure names surface 2 — *"Mint a per-browser anonymous fork salt once (**beside
`sf.anon.gens`**)"*. **RULED: surface 2.** It is non-schema, it moves no registry, and
`src/lib/deviceToken.js` is a byte-for-byte precedent for the exact shape (mint-once +
localStorage + in-memory fallback for private mode).

## M4 — WHAT THE PROMISE REQUIRES, traced through every lifecycle path

THE PROMISE: *a seed is a STARTING world forever; lived history is immutable.*

| Path | Measurement | Verdict |
|---|---|---|
| A **saved** world | `src/domain/normalizeSettlement.js:191` stamps `out.id = idFromSeed(out._seed)` **once**, and `_seed` is persisted in the save row. Nothing re-derives a stored seed | ✅ untouched — only the derivation of **NEW** forks changes |
| A legacy stored fork seed | `tests/domain/contentSamplePreview.test.js:16` forges from a save carrying `seed: 'mossgate-004-anon'` and proves it still previews | ✅ old seeds keep working as inputs |
| Same visitor, re-fork | salt is stable in localStorage ⇒ same seed ⇒ same world | ✅ determinism held |
| Two visitors | distinct salts ⇒ distinct seeds ⇒ `idFromSeed` distinct | ✅ **this is the cure** |
| Reload | localStorage; **`git grep "localStorage.clear()" -- src` returns NO hits** | ✅ survives |
| Cleared editor (`retiringDraftIdentity`, lane 23) | the clear path touches the store's `anonDraft` slot only; the salt is a separate key no store code reads or writes | ✅ kept |
| Sign-in | both call sites pass `auth.user?.id`; a non-empty id wins over the salt with no extra wiring | ✅ adopts the account id from then on |

## M5 — THE PUBLICATION TRACE (does a user id in a seed escape?)

Because the ruling puts the **full user id** into a seed string, I traced where a seed goes:

- **Gallery / public share: STRIPPED.** `src/lib/gallery.js:119-130` `stripImportConfidential`
  deletes `seed`, `_seed`, `_config` and `config._seed` under the stated contract
  *"never the generation seed"*, and the contract is pinned by a dedicated security suite,
  `tests/security/gallerySeedLeak.pglite.test.js`.
- **Account export / campaigns**: the user's own data, containing their own id already.
- ⇒ **The full id does not reach a third party.** Not a new leak, and not a STOP.
- Seed length: the only length constant in the tree is `SEED_MAX = 200` in
  `src/lib/errorReporter.js:62` (a defensive truncation for error payloads, not a product
  limit). `idFromSeed` is FNV-1a over an arbitrary-length string.

## M6 — THE TWO EXISTING TESTS THAT PIN THE DEFECT (the red-first material)

`tests/data/sampleSettlements.test.js`:

- `:167` **`it('truncates the user-id suffix to keep seeds short and stable')`** asserts
  `forkSeedFor(sample,'aaaaaaaa-different-tail-1') === forkSeedFor(sample,'aaaaaaaa-different-tail-2')`,
  with the comment *"two users whose ids differ only after char 8 collide **deliberately**"*.
  **This test asserts noticed 8's defect as if it were a contract.** It must INVERT.
- `:177` `it('handles anonymous (no user id) gracefully')` asserts the seed
  `toContain('anon')`. Under the cure the anonymous suffix is the salt, not the word.

## M7 — ⛔ THE OWNER-PARKED ROW BESIDE THIS WORK (reported, NOT decided)

`docs/DESIGN_FP_ARCH_EP.md` **§7a row 1** parks `forkSeedFor` as
**"PAID / FOUNDER SURFACE BEHAVIOUR"**, recommendation *"LIVING DOOR — the fork button mints
fresh"*, echoed at `:2695` (A4) and `:2696` (A5) as ⛔ **NOT EP-4 — §7a ROW 1 (OWNER-PARKED)**.

**The parked question and the chair's ruling are different axes, and I am touching only one:**

- §7a row 1 asks: *should a SECOND CLICK by the SAME user draw a fresh world?* Its own text is
  explicit that today's justification *"is about different USERS, **never a second click**"*.
- ODQ §934.63 rules: *two DIFFERENT VISITORS must differ*, and **"a visitor's own re-forks of a
  sample stay deterministic"** — which is precisely the behaviour §7a row 1 parks, **preserved
  byte-for-byte**.

⇒ This cure **does not decide, pre-empt or foreclose §7a row 1**; a later "living door" ruling
composes on top of it unchanged. Recorded here so the chair can veto if it reads the boundary
differently. **I build no per-click freshness.**

## M8 — NOTICED 1: the comment is false, the code is not (measured)

`src/main.jsx:127` — *"generated worlds are not persisted locally"*. **FALSE since 2026-09-18**:
`src/store/persistProjection.js`'s header block is titled *"⭐ THE ONE GENERATED WORLD THAT IS
PERSISTED, AND WHY"* and the anonymous draft rides the `anonDraft` envelope.

Does `hasWorkOnScreen` misbehave on the false premise? **No — measured, not assumed:**

```
src/lib/staleDeploy.js:117  export function decideRecovery({ running, served, workOnScreen, … }) {
src/lib/staleDeploy.js:119    if (workOnScreen) return 'notice';
```

`main.jsx:130` returns `s.settlement != null || s.activeCampaignId != null`. With a draft on
screen `workOnScreen` is **true** ⇒ `'notice'` ⇒ the reader is ASKED rather than reloaded under.
The premise is false but the arm it justifies is the conservative one, and it is the arm the
persisted draft would want anyway. ⇒ **comment-only cure; no behaviour change; no widening.**

## M9 — NOTICED 2: a MEASUREMENT ARTIFACT of the review's driver, not a product defect

The report records `B_newDraft: null`. Reading the driver, that value is written by:

```js
// $SP/lane-review-p-scratch/walk3.mjs:97-108
const nd = page.getByRole('button', { name: /^\s*New Draft\s*$/ }).first();
let strip = null;
if (await nd.isVisible().catch(() => false)) { … strip = … }
if (v === 0) out.B_newDraft = strip;
```

`null` therefore means **"New Draft was not VISIBLE"**, not "the strip failed to return".

Why it was not visible, from the product source:

- `src/components/GenerateWizard.jsx:529` — the toolbar carrying New Draft mounts only on
  `settlement && showOutput && !pipelineRevealActive`.
- The driver waited `waitForFunction(… .settlement)` **then `waitForTimeout(2500)`** (walk3.mjs:88-89).
- REVIEW-P's own F5 measured `storeMs = 785` and `readableMs = 7700`. So the driver looked for
  the button at **~3.3 s**, while the reveal runs until **~7.7 s** and `pipelineRevealActive`
  is still true. The button was not mounted yet.

And the return path itself is sound by reading: `handleNewSettlement` → `requestExit('new')` →
`doExit('new')` (`GenerateWizard.jsx:251-258`) clears the settlement, `setWizardMode(null)`,
`setWizardStep(0)`; the `if (!wizardMode && !settlement)` branch at `:337` then renders
`<FoundingWorlds onNavigate={onNavigate} />` at `:369`.

⇒ **REPORT, DO NOT CURE** — the chair's condition ("cure only if it is a defect") is not met.
A walker is added anyway (cheap, and it converts this reading into an executed pin).

## M10 — THE COPY: true after the cure, so NOT edited

- `src/components/generate/FoundingWorlds.jsx:117` — *"Fork one of these curated settlements into
  your own draft: no two the same, all deterministic from their seed."*
- `src/components/settlements/SampleDashboard.jsx:63` — *"Each forks with a unique character.
  Same setting, different settlement."*

Post-cure both are TRUE as written: forks differ across visitors (clause 1) **and** stay
deterministic from the seed for their owner (clause 2, which is THE PROMISE restated).
⇒ **the code is made to match the copy, and the copy is left alone** — the smaller change, and
the one the chair's "(made true either way)" prefers.

## M11 — INSTRUMENT ADMISSION (measured before writing a test file)

`tests/lint/mutationCoverage.shared.mjs:36-49`: enumeration = `ENFORCER_DIRS`
(`tests/lint, design, docs, data, copy, security, edgeFunctions, generators`) **OR** a basename
matching `NAME_PATTERN` (`census|scan|baseline|ratchet|walker|…|contract|pin`).

- `tests/data/sampleSettlements.test.js` **is enumerated** and already carries a manifest entry
  `{"kind": "uncovered"}` ⇒ extending it moves **no** manifest row and **no** `uncoveredBaseline`
  (186).
- A new `tests/lib/anonForkSalt.test.js` is **not** enumerated (`tests/lib` is not an enforcer dir;
  the basename matches no pattern word) ⇒ **no manifest row needed**, exactly as its precedent
  `tests/lib/anonGenCounter.test.js` carries none.

`tests/copy/voiceMechanics.test.js` Tier 2 scans string literals in `src/data/*.js`
(comments and `${…}` excluded), shrink-only. My `sampleSettlements.js` edit adds **no** string
literal. Tier 3 (jsx, shrink-only) covers `src/main.jsx`; my edit there is a **comment**.
`src/lib/` is in no voiceMechanics tier.

---

## THE PLAN THIS MEASUREMENT AUTHORISES

1. **New leaf** `src/lib/anonForkSalt.js` — mint-once per-visitor salt on `sf.anon.fork-salt`,
   `deviceToken.js`'s exact shape (localStorage, length guard, in-memory private-mode fallback).
2. `src/data/sampleSettlements.js#forkSeedFor` — suffix is the **full** `userId` when signed in
   (noticed 8), else the salt (F1). One writer, so **both** call sites are cured without either
   remembering; the two components are not edited at all.
3. `src/main.jsx` comment corrected to what the code does (noticed 1).
4. Laws with walkers: two distinct visitors differ / one visitor repeats identically / an
   account's seed carries the FULL id / the salt survives a reload and a cleared editor.
5. Noticed 2: reported, plus a pin that New Draft returns the strip.
