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

---
# CAR A — ✅ LANDED at `c2337220a` (2 flips of 3; the third REFUSED with measurement)

Files: `src/lib/flagRegistry.js`, `tests/components/handbookVoice.test.jsx` (+70/−11). No file added, renamed or deleted.

## Every prediction above was CONFIRMED by execution
| # | predicted | measured | verdict |
|---|---|---|---|
| 1 | engine aggregate unmoved, 0/525 | BASE `92ef697d…146d8d` == TIP `92ef697d…146d8d`; **0 of 525** rows moved | ✅ |
| 2 | exactly 1 red: handbookVoice.test.jsx `:39` | `Tests 1 failed \| 66 passed (67)`, the failure named `flag OFF (default): the original handbook copy renders` | ✅ |
| 3 | `:56` clarity clause stays green | green | ✅ |
| 4 | warFaithSurfacing green (mocks the flag module) | green | ✅ |
| 5 | warResolveSection green | green | ✅ |
| 6 | the four HowToUse renderers green | green | ✅ |

## Receipts, quoted
- BASE UI arms (before the flip): `Test Files 7 passed (7)` · `Tests 67 passed (67)` · **EXIT=0**
- After the flip, before the cure: `Test Files 1 failed | 6 passed (7)` · `Tests 1 failed | 66 passed (67)` · **EXIT=1**
- After the cure: `Test Files 7 passed (7)` · `Tests 67 passed (67)` · **EXIT=0** — same 67, no test lost
- Engine probe TIP: `ROWS=525` · `AGGREGATE=92ef697dbea663df6d72c9e584a36595b6fd52b0d4bad4ba3f38272c8b146d8d`
- Negative control (planted field): aggregate → `d72c1ea762a02dad8601e4b2b090935cad7452d84305c2d36a19d8dfd180ed3d` ⇒ comparator sees
- `npx eslint src/lib/flagRegistry.js tests/components/handbookVoice.test.jsx` → **EXIT=0**
  (⚠ NO git hook runs in this repo or any dock — hooksPath unset, `.husky/_` absent — so this was run BY HAND
   and no commit of mine was hook-processed. Saying so because "committed with the pre-commit hook" is a false claim here.)
- `tests/lint/negativeAssertionAnchor.walker.test.js:303` baselines this file at **2** negative assertions;
  after the cure it still has exactly 2 (`:57`, `:67`). Baseline NOT moved — no ratchet act owed.

## The declared shift, in one line
No golden, snapshot, fixture or freeze-register row moved. The shift is a TEST CONTRACT: `handbookVoice.test.jsx`'s
OFF arm rendered bare and so pinned the DARK default; with the flag lit that arm would have become a second ON test
that passes while proving nothing. Polarity is now explicit on every arm (OFF takes an override, ON asserts the
shipped default), plus two vacuity guards so neither half can silently observe the same state twice.

## What CAR A does NOT claim
`warEconomySurfacing` opens a DOOR. I verified its data gate is unchanged (the premium/campaign gate is in
`RealmInspector`, pinned by `warFaithSurfacing.test.jsx`'s "flag ON + no campaign ⇒ empty state, never war data"),
so no entitlement moves. I did NOT visually verify the lit surfaces — no browser arm was in scope, and a mount
walker proves a mount exists, not that a reader sees it. **A taste/visibility pass on both lit surfaces is OWED
to the chair before the walk.**

---
# CAR B — ⛔ REFUSED WITH MEASUREMENT. It is not a dial flip; it is a build-gated wiring car
#          sitting behind a SERVER-SIDE MIGRATION. Zero bytes written.

A refusal is a result. Three independent measurements each defeat the car as briefed; any ONE would.

## GROUND 1 — the dial flip is a NO-OP, so the car cannot deliver its own headline
The brief's act is "turn on custom-content materialization for NEW worlds only". The dial's only reader is
`newSettlementLivingContentLaw()` (`livingContentLaw.js:154-162`) and that mint **has no caller in `src/`**.
`git grep newSettlementLivingContentLaw` = 6 hits: the definition, two prose mentions, the `mint:` STRING field in
the create-boundary register, and two test references. The create boundary declares it in its own words —
`densityCreateBoundary.js:204` "living content `newSettlementLivingContentLaw()`  NO CALLER ANYWHERE", and
`GENERATION_LAWS.livingContent.wiring = 'UNWIRED'`.
⇒ Setting the dial to 2 mints nothing into any config; a new world is still born markerless, still v1, still dormant.
Flipping it would produce a commit that LOOKS like the lighting act and delivers none of it — the worst outcome
available, because the next reader would believe it landed.

## GROUND 2 — the wiring is BUILD-GATED and my brief forbids the build
Re-derived, not quoted: (1) `densityCreateBoundary.js` is EAGER — inside `src/main.jsx`'s 237-module static closure;
(2) `livingContentLaw.js` and its leaf `livingContentLawVersion.js` are both OUTSIDE it, and the leaf is listed in
`vite.config.js` `ENGINE_SHARED_DOMAIN_EXCISIONS` (`:200-203`), excised and deliberately UNPINNED; (3) a static import
boundary→law puts both into first paint and `tests/build/engineChunkLazy.test.js`'s orphan-excision arm convicts an
unpinned excision the moment first paint reaches it. The excision's own note measures the alternative at engine-core
**+214 B, 112 chunks re-hashed**. The cure the module names — mint on the lazy engine side, add `livingContentLaw.js`
to the excisions — requires **a hashed-chunk listing diff to prove it free**, i.e. `npm run build`.
My brief: "NO `npm run build` unless the brief names one." It names none.
⚠ The brief said `P12-PRELOAD` is MOOT (residual 0) and told me not to build it. That is a DIFFERENT blocker — the
preload cure (O-10a) addresses the ~1,047 B re-export cost, not the eager/lazy boundary above. Moot preload does not
unblock this car; the chair should not read it as having done so.

## GROUND 3 — ⛔ THE DECISIVE ONE. The three O-11 paths are ALL unprepared, and path 1 needs a SQL MIGRATION.
O-11 (§882.13) SIGNED "the three persistence paths (publicSafe allowlist, accountImport id-resolution, provenance
receiptHash)", and the brief is emphatic: they land in the SAME car or the car does not land. Measured:
| path | file | names `customContentRoster` / `_livingContentLawVersion`? |
|---|---|---|
| publicSafe allowlist | `src/domain/display/publicSafe.js` | **0** |
| accountImport | `src/lib/accountImport.js`, `importScrub.js`, `accountTransferContract.js` | **0** |
| provenance receiptHash | `settlementContentProvenance.js`, `accountSettlementContentPortability.js` | **0** |

The lit law writes ONE new top-level key, `settlement.customContentRoster`
(`generateSettlementPipeline.js:185`). `publicSafe.js` gates the settlement ROOT by an explicit **fail-closed
ALLOWLIST**, `PUBLIC_TOPLEVEL_KEYS` — 38 keys, and `customContentRoster` is not one of them; `customContent` appears
nowhere in the file. So a lit roster is **silently dropped on every public / gallery / anonymous surface.**

⛔⛔ AND ADMITTING IT IS NOT A CLIENT EDIT. That allowlist is DRIFT-PINNED to the SERVER by
`tests/security/gallerySanitizeAllowlist.contract.test.js`, which parses the `public_toplevel constant text[]` array
out of `supabase/migrations/123_money_and_public_projection_hardening.sql` and asserts the two are identical. The file's
own header: the SERVER "remains the security boundary for stored public reads". Admitting the roster therefore requires
**a new SQL migration against the gallery sanitizer** — a migration, and a security-boundary one.
⇒ Owner-gated by nature (migrations / security posture), and not a lane act under any delegation. Even §882.13's
"persisted shape is CHAIR-CLASS pre-launch" boundary does not reach it: that boundary rests on "reversible by a plain
code revert and carries no migration", and this one IS the migration.

## THE PROMISE — the STOP the brief set was checked and CANNOT fire today, and I say why rather than claiming safety
The brief's STOP: `_livingContentLawVersion` stamped on an EXISTING world at regen. Traced:
- **create** — `birthConfig` is the one mint; the living-content mint is UNWIRED, so nothing is stamped at birth either.
- **read** — `resolveLivingContentLawVersion(config)` reads THE CONFIG AND NOTHING ELSE, deliberately, and never falls
  back to the dial (`livingContentLawVersion.js:97-101` states the fallback would be "the exact PROMISE breach the
  version gate exists to prevent"). A closed membership test, fail-closed.
- **regenerate** — `regenSection` takes `settlement.config || config`, **settlement first**, so a markerless v1 world
  regenerates as v1 (`densityCreateBoundary.js:52`, `settlementGenerateAction.js:113`).
- **config hydration** — `config` lives in `configSlice.js` behind `updateConfig`, which validates against an admitted
  key surface and drops unknown keys; nothing hydrates it from a saved settlement.
- **geography carry-over** — `geographyLockedConfig` overlays ONLY geography keys, so it cannot smuggle the marker.
⇒ THE PROMISE holds structurally today. But note the honest reading: **it holds because the law is unwired, not because
the wiring was proven safe.** The STOP is un-fireable now and becomes live the day a caller exists. It must be
re-proven by execution inside the wiring car, not inherited from this receipt.

## WHAT I RECOMMEND THE WIRING CAR BE (named, not built)
One car, in this order, and it is bigger than the brief assumed: (1) the lazy-side mint + the `livingContentLaw.js`
excision row, with a hashed-chunk listing diff proving it free; (2) flip `GENERATION_LAWS.livingContent.wiring` to
WIRED and state the edge cost, or the register reds by its own contract; (3) the three O-11 paths, publicSafe FIRST
because it carries a SQL migration and therefore an owner word; (4) the dial; (5) THE PROMISE re-proven by execution
across create/read/regen/undo/clone/import. Steps 1 and 3 each need an authority this lane does not hold.
