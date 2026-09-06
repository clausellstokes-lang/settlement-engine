# RECEIPT — LANE L-UI-MAT — **PARTIAL** (in flight)
Seat: Opus 5 — Fable-unvalidated · Lane: L-UI-MAT · Chair: Fable 5.1
Dock: $SC/laneLUIMAT · cut at dd5f1321825b58fed2db54e9473440a310195eed (§903 CAS)
Started: 2026-09-06 (session 19ace14d)

## STATUS: PARTIAL — nothing proven yet.

## ARRIVAL CHECK — PASS (all three)
- HEAD: dd5f1321825b58fed2db54e9473440a310195eed  == brief expectation. CONFIRMED.
- porcelain: 0 lines. CONFIRMED.
- packages: `ls -A node_modules | wc -l` = 453 (452 without the `.bin` dotfile; `find -maxdepth 1 -type l` = 453). CONFIRMED == brief's 453.

## CARS
- CAR A (L-UI: three boolean flips) — NOT STARTED
- CAR B (L-MAT: dial + three persistence paths) — NOT STARTED

## PREMISES TO RE-DERIVE (chair's claims, not yet facts)
1. warEconomySurfacing / handbookVoice / mobileSingleChrome are all `false` today — UNVERIFIED
2. O-13 ruled the three promotion contracts satisfied — UNVERIFIED
3. The MAT dial (NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION) is dormant — UNVERIFIED
4. CAR A moves no engine hash — UNVERIFIED
5. CAR B's stamp never touches an existing world on regen — UNVERIFIED

## OWED
- tests/lint/ directory run (exit + every failing arm)
- npm run typecheck:domain:strict + npm run typecheck if src/ moved

---
# PREMISE RE-DERIVATION (measured in the dock at dd5f13218)

## P1 — "the three flags are `false` today" — ✅ CONFIRMED (with a line-number correction)
`src/lib/flagRegistry.js` `FLAG_DEFAULTS`:
- `:78  mobileSingleChrome: false,`
- `:87  handbookVoice: false,`
- `:88  warEconomySurfacing: false,`
The plan (sealed ref, measured at `272dbd2da`) cited `:78 / :86 / :87`. Two of the three drifted by one line
between `272dbd2da` and `dd5f13218`. Values unchanged. Immaterial to the act; recorded so the chair's next
citation is right.

## P2 — "O-13 ruled them satisfied" — ✅ CONFIRMED, verbatim
`review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md` §882.1:
  "O-13 three product flags flip in L-UI (`warEconomySurfacing`, `handbookVoice`, `mobileSingleChrome`),
   three wait for the walk's preview, `imFellDisplayFace` to the walk with its vendoring, RATIFIED"
The permission is real and names exactly these three. (See P3: the permission is sound; one mechanism is not.)

## P3 — ⛔ REFUSED WITH MEASUREMENT: `mobileSingleChrome` HAS NO CONSUMER. THE FLIP IS A NO-OP.
`git grep -n mobileSingleChrome` over the WHOLE tracked tree returns exactly 4 hits, and not one is a read:
  docs/UIUX_AUDIT_AND_PLAN.md:1960        (prose)
  docs/critique-implementation-status.md:71 (prose — claims "shipped (flag-off)")
  src/lib/flagRegistry.js:78              (its own default declaration)
  src/lib/flags.js:73                     (its own description string)
Zero `flag('mobileSingleChrome')` / `useFlag('mobileSingleChrome')` sites. The only dynamic `flag(name)` call in
`src/` is `components/dev/DevFlagPanel.jsx:141`, which enumerates FLAG_DEFAULTS for the dev panel — not product code.

WHEN IT DIED, bisected by consumer count over `-- src` excluding the registry/description pair:
  71681bb66  consumers=1  src/App.jsx
  8bf493d05  consumers=0     <-- "fix(nav): resolve 17 navigation-audit findings (3 blockers, 6 majors, 8 minors)"
  ... HEAD    consumers=0
The feature was DELETED, not promoted. At `71681bb66` App.jsx had three reads:
  :315  `.slice(0, _readFlag('mobileSingleChrome') ? 4 : 5)`
  :351  `{isMobile && !_readFlag('mobileSingleChrome') && (`   (mobile top header)
  :639  `{_readFlag('mobileSingleChrome') && (`                (auth chip as 6th bottom-nav slot)
At HEAD the same three sites are:
  :482  `.slice(0, 5)`            — hard-coded, no branch
  :533  `{isMobile && (`          — the mobile top header renders UNCONDITIONALLY (the flag-OFF shape)
  (no auth-chip slot exists at all — `git grep "6th slot"` in src/ is empty)
So the tree permanently ships the flag-OFF behaviour and the flag-ON behaviour no longer exists in source.

⇒ Flipping `mobileSingleChrome: false → true` changes NO product behaviour. Its only observable effect is that
the dev flag panel and the crash-forensics `flags_on` payload would report a capability the build cannot render.
This is precisely the shape the plan itself CONFIRMED for `L-DOORS (ii)` / `generationWorker` — "0 hits — there is
nothing to flip" — and correctly classed a BLOCKED RESIDUE. The plan's L-UI row ("3 boolean flips", READY NOW)
missed it because the lighting census enumerated the REGISTRY, not consumer reach.
THE LAW THIS IS AN INSTANCE OF: charter the permission, measure the mechanism. O-13's permission stands;
its third mechanism is gone.
⇒ CAR A lands as TWO flips. The third is refused and returned to the chair as a row (below).

## P4 — ⛔ REFUSED WITH MEASUREMENT: THE MAT DIAL IS DORMANT *AND UNWIRED*. FLIPPING IT IS ALSO A NO-OP.
Dormancy CONFIRMED: `src/domain/content/livingContentLaw.js:94-95`
  `export const NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION = DEFAULT_LIVING_CONTENT_LAW_VERSION;`
with `livingContentLawVersion.js:72 DEFAULT_…=1`, `:75 ROSTER_…=2`.

But the dial's ONLY reader is `newSettlementLivingContentLaw()` (`livingContentLaw.js:154-162`), and that mint
HAS NO CALLER. `git grep -n newSettlementLivingContentLaw` over the whole tree = 6 hits:
  livingContentLaw.js:16 (prose), :154 (the definition)
  densityCreateBoundary.js:204 (prose: "NO CALLER ANYWHERE"), :275 (the string field `mint:`)
  tests/domain/livingContentMaterialization.test.js:61 (import), :311 (the dormancy assertion)
No `src/` call site. The create boundary states it as a register row, `GENERATION_LAWS.livingContent`
(`densityCreateBoundary.js:~284`): `wiring: 'UNWIRED'`.

⇒ Setting the dial to `ROSTER_LIVING_CONTENT_LAW_VERSION` mints nothing into any config. A new world would still
be born with no `_livingContentLawVersion` key — i.e. still v1, still dormant. The brief's car ("turn on
materialization for NEW worlds only") CANNOT be delivered by the dial line.

WHY THE WIRING IS NOT MINE TO TAKE — the module states it as an executable measurement, re-derived here:
  1. `densityCreateBoundary.js` is EAGER — inside `src/main.jsx`'s 237-module static closure
     (store/index -> settlementSlice -> settlementSliceHelpers -> here).
  2. `livingContentLaw.js` AND its leaf `livingContentLawVersion.js` are BOTH outside that closure; the leaf is
     listed in `vite.config.js` `ENGINE_SHARED_DOMAIN_EXCISIONS` (`:200-203` region) — excised and UNPINNED.
  3. A static import boundary -> law therefore puts both modules into first paint, and
     `tests/build/engineChunkLazy.test.js`'s orphan-excision arm convicts an unpinned excision the moment first
     paint reaches it. The excision's own note measures the alternative at engine-core +214 B / 112 chunks re-hashed.
  4. `GENERATION_LAWS`' own contract: "an UNWIRED law that acquires a generation-side caller REDS until somebody
     changes its row to WIRED and states what the edge costs."
The cure the module names is to mint on the LAZY engine side the birth caller already awaits, which needs
`livingContentLaw.js` added to `ENGINE_SHARED_DOMAIN_EXCISIONS` **plus a hashed-chunk listing diff to prove it
free** — i.e. a BUILD. My brief forbids `npm run build` ("unless the brief names one"; it names none).
⇒ CAR B is REFUSED. It is a build-gated wiring car, not a dial flip. Detail + the recommended car shape below.

## P5 — O-11's three persistence paths, re-derived from the row (the brief asked me to)
§882.13 verbatim: "**LIGHTING O-11 SIGN** the three persistence paths (publicSafe allowlist, accountImport
id-resolution, provenance receiptHash)." The third — which the brief left for me to derive — is
**provenance receiptHash**. Recorded; not built, because CAR B does not land (P4).

---
# ⛔⛔ FOREIGN RED FOUND AT BASE, BEFORE ANY EDIT — THE ENGINE GOLDEN MASTER IS 525/525 DRIFTED

Found while establishing CAR A's engine-hash control. **I had made no edit; porcelain was 0.** This is
FOREIGN to my consist and is reported, not banked as mine.

`GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/generatorGoldenMaster.test.js --maxWorkers=2`
  EXIT=1 · `Test Files 1 failed (1)` · `Tests 1 failed | 2 passed (3)` · Duration **9.79s**
  `AssertionError: expected [ …(525) ] to deeply equal []`
(⚠ vitest prints ACTUAL first: the 525-element array is the RECEIVED drift list. Every row drifted.)

⛔ IT IS NOT LOAD STARVATION. 9.79 s, an ASSERTION failure, not a timeout or a SCOPE SENTINEL line.
Machine 1-min load at the time was 3.20.

**Characterised with an independent probe** (`$SC/luimat-scratch/hashprobe.mjs` — plain node, replicates the
suite's `corpus()`/`hashFor()` byte-for-byte, reads the dock, writes only to lane scratch):
- rows computed **525**; key set vs committed manifest: **0 only-in-manifest, 0 only-in-computed** — the corpus
  is not the problem, the VALUES are.
- **525 of 525 values differ** from `tests/fixtures/generator-golden-master.json`.
  e.g. `city|arabic|coastal|port|civilized|golden-master-v3`
       manifest `3bd9db193001422bf90ef74333ad1672748dd90f9f6fd5c7686826db00d7cf65`
       computed `135346c7590e659acfd1dd3dacdda7ecf36203cbaaa24c4c77ec41fabb2f0f34`
- **DETERMINISTIC within the build**: two full runs produced byte-identical output files and the same
  aggregate `92ef697dbea663df6d72c9e584a36595b6fd52b0d4bad4ba3f38272c8b146d8d`.
  ⇒ this is a STALE/OWED MANIFEST or an unrecorded engine shift, NOT a nondeterministic generator.
- **NEGATIVE CONTROL CONVICTS** (the comparator was proven able to see FIRST, per the suite's own D-4 law):
  one planted enumerable field on the returned settlement moved the aggregate
  `92ef697d…8b146d8d` → `d72c1ea762a02dad8601e4b2b090935cad7452d84305c2d36a19d8dfd180ed3d`.

Last re-record of the fixture: `e4aebd28a` ("HYGIENE landing act: the golden re-records ONCE at the coupled tip").
The surface IS enrolled in the freeze register (`tests/fixtures/.golden-freeze-register.json:323-325`).
⇒ **CHAIR ROW, HIGH.** Either an owed re-record was never taken, or an engine shift landed undeclared between
`e4aebd28a` and `dd5f13218`. A 525/525 drift is not a subtle logic drift; it has the shape of a field
added to (or removed from) every settlement. ⛔ I did NOT re-record it — `UPDATE_GOLDEN` is a register door and
my brief forbids one. Naming it is the act available to me.

**CONSEQUENCE FOR MY OWN PROOF:** the committed manifest cannot serve as CAR A's control while it is stale.
CAR A's engine-identity proof is therefore taken DIFFERENTIALLY — the probe's aggregate at BASE vs at TIP —
which is immune to the manifest and strictly stronger (it compares the tree against itself).
**BASE AGGREGATE (525 rows): `92ef697dbea663df6d72c9e584a36595b6fd52b0d4bad4ba3f38272c8b146d8d`**

---
# CAR A — PREDICTIONS WRITTEN BEFORE THE INSTRUMENTS RAN
1. Engine aggregate at TIP: **UNMOVED**, `92ef697dbea663df6d72c9e584a36595b6fd52b0d4bad4ba3f38272c8b146d8d`,
   **0 of 525** rows changed. Ground: zero `src/domain/**` or `src/generators/**` importers of the flag modules.
2. `tests/components/handbookVoice.test.jsx` — **1 test REDS**: the case at `:39`
   ("flag OFF (default): the original handbook copy renders") renders `<HowToUse standalone />` with NO
   override and asserts `toContain(PLAIN_ONLY)` / `not.toContain(VOICED_ONLY)`. With the default now `true`
   it receives the voiced copy. This is the DECLARED display shift, not a defect.
3. Same file `:56` ("THE CLARITY CLAUSE") — **GREEN**. Its OFF half now renders voiced, but it asserts only
   STEPS + LIFELINE, which the clarity clause keeps in BOTH states.
4. `tests/components/warFaithSurfacing.test.jsx` — **GREEN**. It `vi.mock`s `src/lib/flags.js` wholesale with
   `flagMock` and drives both ON and OFF explicitly; it never reads FLAG_DEFAULTS.
5. `tests/ui/warResolveSection.test.jsx` — GREEN expected (same mocking idiom), UNVERIFIED before the run.
6. The four HowToUse-rendering files (aboutSplit, howToInversion, howToUseLivingWorld, handbookClaimsParity)
   — GREEN expected; they render HowToUse but I have not confirmed none asserts voiced-exclusive copy. If one
   asserts plain essay text it will red and is part of the same declared shift.
