# TOOL-25 — ⛔ STOP (uncommitted; not one tracked byte edited)

Branch `tool-25-nul-walker-2026-09-20` at **`578272a99`**, `git status --short` **empty**.
Goldens byte-identical (nothing was edited): `7177cd6e…` / `921c51cf…`.
Full measurement: `TOOL-25.evidence.md` beside this file.

## THE SMALLEST MEASURED CONTRADICTION

> The brief, §1: *"Expected: ZERO in the class today — if any exist, name them and STOP for the
> chair (a live NUL in a shipped source file is a defect the owning family cures, not this lane)."*

**The briefed work is "EXTEND that test's roots to every tracked text file." Extending them
reds the pin on two files this lane does not own and the chair has not ruled on.**

`tests/lint/controlBytes.test.js` walks `src/` and `tests/` and is **GREEN at my base**
(5,063 files, 1,513 ms, zero violations). Over **every tracked text file** there are three NUL
carriers; the instrument admits one:

| Carrier | Admitted? | In briefed scope? |
|---|---|---|
| `src/domain/worldPulse/supplyCompleteness.js:158` | ✅ `BINARY_ALLOWLIST`, owner-parked (MASTER_MERGE_PLAN §8 item 2 / §5.4) | already walked |
| `scripts/prose-wave-gate.mjs:753` | ❌ **nowhere** | ❌ not scoped, not ruled |
| `docs/implementation/packets/settlement-editor/EM-P2.md:333` | ❌ **nowhere** | ❌ not scoped, not ruled |

Curing either is outside this lane: one is a behaviour change inside a governed harness, the
other is an edit to a **placed, revalidated packet**. Allowlisting either is an adjudication —
it would permanently admit a NUL in shipped tooling and, worse, **silence the live tripwire
below**. The brief forbids improvising around a STOP, so I stopped.

---

## ⛔⛔ THE URGENT ONE — EM-P2 WILL PLANT A RAW NUL INTO `tests/` AND RED `tests/lint` AT ITS LANDING

This is not a hypothetical and it is time-critical: **EM-P2 is PLACED and revalidated
2026-09-20 at `e5f53ae95760d79084caa5f57b6d5d945b06b63b`** (its own header), and the memory
index records **"EM-P2 v4 BUILDING under seal."**

`docs/implementation/packets/settlement-editor/EM-P2.md:333` is inside the fenced ```js block of
**§6.2(c), "The HASH census is `vi.mock` over `src/kernel/proseHash.js`"**. The literal reads
(`<NUL>` = a raw 0x00 byte at file offset 40219, line 333 col 107):

```js
pickVariant: (pool, seed) => { if (hashCensus.on) hashCensus.picks.push({ seed: seed === undefined ? '<NUL>undefined' : String(seed), poolLen: … }); … }
```

The NUL is a **deliberate sentinel** — it distinguishes the value `undefined` from the string
`'undefined'`. The packet intends the character. But it is spelled as a **raw byte**, not as an
escape, and:

1. EM-P2's own §6.2 says the structural rules are ones **"the lane may not vary"**, and §8 step 0
   says the new test files copy the shape **verbatim**.
2. EM-P2's CREATE targets (§7 change table, lines 516–518) are
   `tests/lint/generationForkRegistry.contract.test.js`,
   `tests/generators/generationForkCensus.test.js` and
   `tests/helpers/generationForkCensus.js` — **all three under `tests/`**.
3. `tests/` is a root `controlBytes.test.js` **already walks**, with the whole-C0 predicate.

⇒ **A build lane copying §6.2(c) as instructed plants a raw NUL under `tests/`, and
`tests/lint` whole goes RED on `controlBytes` at the landing** — after that lane has proven
everything else green, hunting a defect its packet handed it. Exactly the run-17/18/19 family,
except the packet itself is the carrier.

**Cure (the chair's hand, not mine):** amend EM-P2 §6.2(c) so the sentinel is built rather than
embedded — `String.fromCharCode(0) + 'undefined'`, or a non-control sentinel. `controlBytes.test.js`'s
own header already states the estate's rule: *"when source code NEEDS a control character it
writes an ASCII escape spelling … which contains no raw byte."* A packet amendment is
content-addressed — `validate:packets` must reprint `valid:` after it.

⚠ The packet body's own byte would still red a tree-wide `docs/` scan even after the listing is
fixed, unless the amendment removes the raw byte from the `.md` itself (it must — the listing
*is* the byte).

---

## THE OTHER UNADMITTED CARRIER — `scripts/prose-wave-gate.mjs:753`

```js
const key = `${label}<NUL>${at.key}<NUL>${at.evidence}`;   // two raw NULs, offsets 39627 / 39637
const seen = inherited.get(key);
```

An in-memory `Map` key in the spine-inheritance dedupe of the wave gate. Facts bearing on the ruling:

- The key never crosses a process boundary in this use (`inherited` is a local `Map`), so a
  separator swap looks behaviour-neutral **by reading** — I did not execute that claim: **PLAUSIBLE, not CONFIRMED.**
- The file **has its own walker**: `tests/lint/proseWaveGate.walker.test.js:38` imports symbols
  straight out of it. Any edit owes that walker's arms.
- `scripts/mutation-coverage-manifest.json:2765` carries a long rationale row for this harness
  (plants executed 2026-09-08 under its former name `scripts/taste-measure.mjs`), and records
  that **"the sweep's `git checkout --` revert is forbidden in this program's shared tree."**
- The estate already cured the sibling instance: `COMPREHENSIVE_REVIEW_2026-07-15.md:1679`
  records **two** src carriers, `supplyCompleteness.js:158` and `generosityKernel.js:485`;
  only the first survives today. So this class has a cure precedent.

**Dispositions available (chair's pick, one line):** (a) convert the separator and run the wave
gate's walker; (b) admit it in `BINARY_ALLOWLIST` with a dated reason, as supplyCompleteness is;
(c) hold `scripts/` out of the roots until (a) lands.

---

## WHAT IS ALREADY PROVEN AND COSTS NOTHING TO RESUME

- **`-P` is correct and `-E` is inverted** for this class — proved on a fixture repo (evidence §2).
  `-E '\x00'` matches the *text* `\x00` and misses the raw byte. Worth a LANE-PARALLEL addendum
  beside the `\s` law: for NUL, `-E` returns the **wrong set**, not a short one.
- **The wall-clock premise holds**: 2,364 ms over the whole tracked tree / 123.8 MB (bar: 5 s).
- **The binary-classification arm would print ZERO** once the allowlisted file is excluded — its
  only member is `supplyCompleteness.js`, and that is a consequence of the NUL, not a second defect.
- **The instrument is already parameterised on its roots** (`findControlBytes(rootDirs, root)` is
  exported), so the extension is a roots change plus a `git ls-files` enumeration — no new file,
  no mutation-coverage row, no lighting movement beyond the titles added.
- **Base is green** (§1 of the evidence), so nothing here is pre-existing red I am handing back.

## SCOPING FORKS THE CHAIR MUST SETTLE WITH THE RULING

1. **Filesystem walk vs `git ls-files`.** Today's walk is the filesystem, so an untracked scratch
   file under `src/`/`tests/` reds the pin. Tracked-only enumeration is the brief's wording and is
   the safer contract for lanes; it is also a behaviour change to the existing arm.
2. **Whole-C0 vs NUL-only tree-wide.** The existing predicate is whole-C0. Extending *it* to
   `public/` reds on the vendored `public/map/libs/jszip.min.js` (0x01–0x06, no NUL). Either the
   tree-wide arm is NUL-only (the brief's wording) while `src`/`tests` keep whole-C0, or `public/`
   needs an admission for the vendored lib.
3. **The extension list vs `.gitattributes`.** The brief's 15 extensions omit `.svg`, yet
   `.gitattributes` declares `*.svg text eol=lf` — 132 tracked SVGs plus 14 other text-ish files
   (`.snap`, `.jsonl`, `.toml`, `.xml`, `.webmanifest`, dotfiles, the husky hooks) sit in the gap.
4. **25 `.glb` files are git-binary but undeclared** in `.gitattributes`. Harmless to every arm
   here (no text extension), but the declaration gap is real and cheap to close.

## NOTICED AND NOT TOUCHED

1. ⛔⛔ **EM-P2 §6.2(c)** — above. Live, sealed, building. The highest-value item this lane found.
2. ⛔ **`scripts/prose-wave-gate.mjs:753`** — above.
3. **The dispatch's premise that `src/` is unwalked is wrong** (evidence §1). The real gap that
   let FIX-P1b's NUL through is procedural: **the lane never ran `tests/lint` whole.** If the
   chair wants that class closed, the durable cure is not a wider walker but the existing
   addendum's rule — *a CREATE under `src/` or `tests/` runs the governing directory whole* —
   which no instrument enforces against a lane's own batch list.
4. **`controlBytes.test.js`'s allowlist comment is stale in one clause.** It says the file is
   exempted "so the pin can land green now" pending an owner ruling AT the master merge; the
   master merge is long past (`COMPREHENSIVE_REVIEW_2026-08-01.md:511` calls it "an explicit
   owner-parked exemption"). **Slot:** the owner's keep-vs-convert on supplyCompleteness:158 is
   still genuinely open and is now the *only* thing standing between this class and a clean
   tree-wide rule. One line from the owner closes it.
