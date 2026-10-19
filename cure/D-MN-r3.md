# D-MN-r3 — round-3a disposition of `docs/DESIGN_FP_ARCH_MN.md` (THE MENACE)

Seat D-MN-r3 (Opus 5.5), chair session a73343ed continued by chair 0a2e8bd9 (Fable 5.1), 2026-10-18. Read whole: the kit README, COMPILE-COMMON, DISPOSE, OWNERSHIP, RESEARCH-COMMON (head), RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 (+ADDENDUM), RULINGS-ROUND2, RULINGS-ROUND2b (+ADDENDUM), RULINGS-ROUND3 (+§D); the BOARD (its menace lines and its tail); `skeptic/MN-r2-verify.md` and its probes; the MN-routed rows of the other eight `*-r2-verify.md` (grep `MN`/`menace`, read in context); the volume (778 lines). Sibling texts read for coherence at 17:4x–17:5x EDT while their round-3a lanes were writing: PL §4.3 · OD-PL-53 (A.6 as PL cured it), ST ST8 · ST10 · §2.3–§2.4 · §3.4 · §8 `site_siege`, PR PR5 · §6.1 · OD-PR-43 · its ROUTES line, PS PS12 · OD-PS-19, CH §2.2 `paragonLean` · its wildland row, WC's `armies_meet` row and the fold §3.4 `armies_meet` / `menace_met` rows, `briefs/L-BD.md` item 6; the round-3a cure files D-PL-r3 · D-PR-r3 · D-PS-r3 · D-ST-r3 (their MN routes). Code of record: master `81f1cd963` (the detached worktree, read-only). Probes: `cure/D-MN-r3-probe/`. No git; no suite.

## §1 MEASUREMENTS FIRST (each could refute what it supports)

(a) **The exit law** (SEAMS-r2-7 (a)(b)). `spatial/embattlement.js :: EMBATTLEMENT_TUNING` "`ENTER_THRESHOLD: 0.55,`" · "`EXIT_THRESHOLD: 0.3,`" · "`MIN_DWELL_TICKS: 6,`"; `stepEmbattlement` "`} else if (rawT < T.EXIT_THRESHOLD && (now - priorSince) >= T.MIN_DWELL_TICKS) {`". The verifier's `hysteresis.mjs` RE-RUN (`hysteresis.out`): an embattled town at raw 0.35 (or 0.45) for 52 weeks stays `embattled`, its level easing to 0.350; a calm town at 0.35 stays calm. NEW `m53.mjs` (`m53.out`) on M53's own numbers (σ = min(0.25, 0.20 + 0.15) = 0.25 → raid part 0.35): with the column present the calm town latches (0.60); the column gone, it stays `embattled` 26 weeks (level 0.440 → 0.361 → 0.351 → 0.350); the raid stopped (raw 0), it leaves in one week (the dwell long satisfied); a calm watched country at 0.35 never enters in 52 weeks. CONFIRMED (executed).

(b) **The id collision** (MN-V5). `worldPulse/stressors.js :: evaluateStressorRules`: "`if (existingKeys.has(targetKey)) continue;`" then "`if (activeIds.has(idFor({ type, originSettlementId: String(pressure.settlementId) }))) continue;`" with its comment ("a fresh birth there would mint the SAME id and the byId upsert would silently clobber the live record"). The verifier's `idcollide.mjs` RE-RUN (`idcollide.out`): an adopted war siege keeps `world_stressor.siege.kell`, which is exactly the id a later `declared_war` birth mints and the guard tests; a MINTED menace id (`…siege.kell.menace.<id>`) does not collide; the menace stamp survives `normalizeStressor`. The war's siege STRESSOR is a crisis-catalog birth from pressure (`stressorDynamics.js :: interpretStressorOrigin`: "`if (['siege', 'wartime', 'occupation'].includes(type)) { const hostiles = hostileNeighborsOf(snapshot, settlementId); if (hostiles.length && hostiles[0].type === 'hostile') { return { variant: 'declared_war', …`"), not the war layer's deployment — so the guard's refusal blocks the second CRISIS RECORD and leaves the war layer's own front untouched. ⚠ MN §3.2 cited the interpreter as `interpretOriginContext`; the landed export is `interpretStressorOrigin` (cured in passing). CONFIRMED (read + executed).

(c) **`armies_meet` cannot take a menace** (the chair's MN-V5 line). Fold §3.4: "`armies_meet` | WC (Arc A; the live encounter in `armyTransitKernel` …) | the tick the forecast paths of two hostile armies overlap"; the army-meets-menace kind is MN's `menace_met` (fold §3.4 ↳ row). A menace has no transit record and is no army (MN6). So the ruling's clause is applied through `menace_met` (§2 below). CONFIRMED (read).

(d) **The sea route** (minor 1). `spatial/distanceRead.js :: pathCost` reads `const seaLanes = activeSeaLanes(digest);` and escalates to the augmented route "ONLY when a slot is lit AND at least one endpoint is that modality's node — a PORT"; `activeSeaLanes` returns `null` unless `digest.reserved.seaLanes` has a versioned, non-empty edges array. CONFIRMED (read).

(e) **The blockade** (minor 4). `worldPulse/navalKernel.js` header: "a navy blockading a hostile port MINTS A SIEGE through the existing machinery (the interdiction term fed from the water side), authority-routed." — so the blockade's crisis at a port reaches the stressor list only through the pressure loop's `declared_war` birth: the admission at a minted menace record, the id guard at an adopted one. Stays PLAUSIBLE. (read)

(f) **The landed separators** (A.14). `events/realmManifest.js`: "`export const COURSE_TARGET_SEP = '␟';`" — MN's dial composites (`a␟b`, `anchor␟menaceId`) are this LANDED verb-dial idiom, never a pair key; the landed pair key is `spatialDigest.js`: "`const pairKey = (a, b) => (a < b ? \`${a}|${b}\` : \`${b}|${a}\`);`". CONFIRMED (read).

(g) **`paragonLean`'s form** (A.15). CH §2.2 (12:14 text): "`paragonLean` | `(worldState, settlementId, domain, side) → { mult, reason, wnpcIds } | null`". `m53.out`: under `× mult` the warden's wear lean on a 0.30 score gives 0.330 (< modest 0.35), on 0.33 gives 0.363 (≥ 0.35); the siege draw's shift under `u × 1.05` is +0.005 / +0.025 / +0.045 at u = 0.1 / 0.5 / 0.9 (proportional to the draw, at most the stated 0.05). CONFIRMED (read + arithmetic executed).

(h) **Tokens.** `presenceComposer` — 0 hits on master `src`/`tests`/`docs` and the ledger's docs (`rg -w`). `warSiegeRefused` — 0 hits. CONFIRMED.

(i) **A.6 at PL (read 17:4x).** PL §4.3 as cured: the OUTCOME row "written when the siege ENDS — `protection_failed` if it ends `falls`, `protection_kept` if it ends any other way (`relieved`, `lifted`) — whatever the answer was"; OD-PL-53 the same, the siege arm included. MN M11 and §4.9 still said `kept` ⇒ `protection_failed` (D-PL-r3's route). CONFIRMED (read).

(j) **L-BD's thresholds.** `briefs/L-BD.md` item 6 says "ENTER 0.35 / EXIT 0.30"; master is ENTER 0.55 (a). Routed (the brief is the chair's). CONFIRMED (read).

## §2 THE RECORD (every input id; the volume's §14 round-3a block is the same table)

| id | sev | disposition | where (MN) | receipt |
|---|---|---|---|---|
| SEAMS-r2-7 (FAIL in part) | M | CURED | MN5 · §0 · §3.3 · §4.2 · OD-MN-29 · M50 · M53 | §1(a): `stepEmbattlement`'s exit arm; `hysteresis.out` + `m53.out` EXECUTED; ruling B's three cure lines applied verbatim in substance |
| MN-V5 (NEW) | MAJOR | CURED (+REFINED) | §3.2 · §0 · §5.6 · §6 · OD-MN-31 · M37 · M57 | §1(b)(c): the id guard read and `idcollide.out` EXECUTED; `armies_meet` is two armies (fold §3.4) |
| MN-V6 (NEW) | MAJOR | CURED (+REFINED) | MN5 · §3.3 · §4.2 · §8 · §9 MN-0/MN-1 · §10 A · OD-MN-29 · M24 · M56 | A.3; siblings' halves read (PS12, ST §3.4/ST-1, PR5/§6.1/OD-PR-43) |
| minor 1 (`pathCost` / `activeSeaLanes`) | m | CURED | §6 | §1(d) |
| minor 2 (`paragonLean` `{ mult }`) | m | CURED | §5.2 · §5.5 · OD-MN-16 · OD-MN-33 · M44 · M54 | §1(g); A.15 |
| minor 3 ("until H16 opens") | m | CURED | §14 round-2 row | RULINGS-ROUND2b HOST-r2-5 |
| minor 4 (the blockade PLAUSIBLE) | m | CURED (kept PLAUSIBLE, marked) | §6 | §1(e) |
| PR-V2 (routed) | MAJOR | CURED | M53 · M50 · MN5 | A.1; ST §3.4 r3 |
| FOLD-r2-verify note (menace rationale) | m | CURED (MN's half) | §2 | A.7 |
| PS-r2-12 (cites MN M53) | — | CURED by cite | M53 | PS12's selector (PS's cure, D-PS-r3) |
| ST-r2-verify note 3 | m | NOTED | — | ST's side; ST §3.4 r3 cites MN §3.3 |
| A.1 | — | CURED | M50 · M53 · MN5 · §5.5 · OD-MN-29 | — |
| A.2 | — | NOTED | — | a menace takes no border hold |
| A.3 | — | CURED (= MN-V6) | — | — |
| A.4 | — | NOTED | — | MN has no fame/court regard (0 hits) |
| A.5 | — | NOTED | §4.7 · §4.9 · §8 already consistent | — |
| A.6 | — | CURED | §4.9 · M11 | PL §4.3 · OD-PL-53 (§1(i)) |
| A.7 | — | CURED | §2 | — |
| A.8 · A.9 · A.11 · A.12 | — | NOTED ×4 | — | no MN text (0 hits each) |
| A.10 | — | CURED | §6 (site siege) | ST §2.3–§2.4, §8 (`siteReadiness01`, `SITE_READINESS`) |
| A.13 | — | CURED | §6 | OD-PS-28 |
| A.14 | — | CURED | §2 · §7 · §3.4 | §1(f) |
| A.15 | — | CURED (= minor 2) | — | — |
| RULINGS-ROUND3 B (MN) | — | applied through the rows above | — | — |

**Disposed 26 of 26: CURED 18 · REFUTED 0 · STOP 0 · NOTED 8.**

Considered and not MN's (no row): CH-r2-verify's "§5 (d) … PR5 (a) says raiding menaces and untied dens" (CH's text); PT-r2-verify's "§15's EDITOR … 'court, person or menace'" (PT's text); CH-r2-verify l.10 (a hold that cites MN's `exertion.outcome`).

## §3 STOPs
None.

## §4 REFINED (beyond the findings; each marked in the volume, vetoable)
1. The shared composer's home is NEUTRAL, `src/domain/spatial/presenceComposer.js :: presenceTerms` (not `menaceReads.js`), since any of four chains may build it; its registration list is closed and walker-pinned and admits a later feeder (THE BODIES' road-country row, L-BD item 6) by the same door. M56 added.
2. MN-V5's ruling clause "meets the menace's force under WC Arc A's `armies_meet`" is applied as `menace_met` (the army-meets-menace kind); `armies_meet` is two hostile armies' contact. "The column camps" is said only where PS's border hold makes it so — the guard refuses a crisis RECORD and leaves the war layer's front untouched. The refusal is receipted as `warSiegeRefused` on the docket row (derived; no Herald allowlist edit). M57 added.
3. The cite `interpretOriginContext` → the landed `interpretStressorOrigin`.
4. Under A.15 the siege lean is proportional to the draw (≤ 0.05; +0.025 at u = 0.5) — stated for the FP-46 roster.
5. "the town's own garrison" (§5.5) → "the town's own capacity, never a keep's garrison" (A.1's vocabulary).

## §5 ROUTES (the other halves this lane cannot write)
- **The fold (the chair, P4):** §6's builder note for THE SHARED PRESENCE COMPOSER with its home `spatial/presenceComposer.js`; §3.4's `menace_met` row gains a third producer — a hostile column's arrival at a menace's town, owed by WC Arc A's contact leaf — and the `armies_meet` row says "two armies; a menace meets an army only as `menace_met`"; §1's requirement-24 bracket, the spine mirror and §3.3's row list five actor kinds with the menace rationale (A.7); §5 registers `presenceComposer`, `warSiegeRefused`, `stretch:<a|b>`.
- **WC (its inbox, the chair's):** Arc A's contact leaf registers a hostile column's arrival at a menace's town as a `menace_met` producer (MN-V5's ruling clause).
- **CH (D-CH-r3):** the wildland row (CH l.424) still words the siege lean as "shifts the verdict's keyed draw ±DRAFT 0.05" and the raid row as "+DRAFT 0.10 to the wear read" — under A.15 (CH owns the form) both are `{ mult }` with deviations ±0.05 / ±0.10, applied `draw × mult` and `score × mult` as MN §5.2/§5.5 now say.
- **THE BODIES (the chair's brief `L-BD.md` item 6):** it says "ENTER 0.35 / EXIT 0.30"; master is `ENTER_THRESHOLD: 0.55` (§1(a)) — the bodies' feeder must be sized against 0.55; it registers into the shared composer's `roadCountry` like ST's untied holders.
- **PL · ST · PR · PS:** none — their round-3a halves (A.6; A.1/A.3/A.10; A.1/A.3; A.3/PS-r2-12) were read and agree with MN as cured.

## §6 OPEN QUESTIONS FOR THE CHAIR
1. REFINED 2 departs from the literal ruling (`armies_meet` → `menace_met`; "the column camps" scoped). Veto by one clause if the chair meant something else by "the menace's force".
2. A.15's multiplicative lean makes a paragon weakest in the low draws where a town falls; if the chair wants a symmetric lean, the alternative is `mult` applied to the odds (`pFall`), a one-line change at CH's leaf and MN §5.2 — not taken (the ruling says `draw × mult`).

## §7 CONFIRMED vs PLAUSIBLE
CONFIRMED by execution against master's own modules: the exit-law cure (`hysteresis.out`, `m53.out`) and the id collision behind MN-V5 (`idcollide.out`). CONFIRMED by read: every cited symbol (`EMBATTLEMENT_TUNING`, the birth loop's two guards, `interpretStressorOrigin`, `activeSeaLanes`/`pathCost`, `COURSE_TARGET_SEP`, `pairKey`, W-NAVY's blockade header) and the siblings' round-3a texts as of 17:4x. PLAUSIBLE: the blockade's crisis arriving only through the pressure loop; every DRAFT constant (unchanged, UNMEASURED); the composer's walker pin and the `warSiegeRefused` receipt (designed, unbuilt).
