# D-CH-p5 — THE CHAMPIONS' P5 dispositions (chair 6eb7b5b6, Fable 5.1; lane Opus 5.5; 2026-10-20)

Inputs: `assessments/P5-COMPLETENESS-2026-10-20.md` (P5C-11 CH half · P5C-13 CH rows · P5C-14 CH rows · P5C-15 WC-CH-69 · P5C-19 `patrol_will` · P5C-21 CH half) + `briefs/RULINGS-P5.md` ADDENDUM §A.2 · §C.11 · §C.13 · §C.14 · §C.15 · §C.19 · §C.21. Owned file: `docs/DESIGN_FP_ARCH_CH.md` only.

## Status: COMPLETE (15:16 CDT by `date`) — 18 of 18 input items disposed: 18 CURED · 0 REFUTED · 0 STOP · 0 NOTED (+3 housekeeping rows in the volume's P5 block: the header, OD-CH-16, one NOTED token)

## §1 Measured first (15:02–15:10 CDT by `date`; master `81f1cd963`, the detached worktree, READ-ONLY)
- Volume read whole (l.1–971 the design; the cure record's tail). 0 prior `fp-final P5` brackets in CH (no killed predecessor).
- Page hosts (eslint's own count, `max-lines` skipBlankLines+skipComments; components ceiling 600 — `eslint.config.js` "files: ['src/components/**/*.jsx'] … max: 600"): `components/map/RealmInspector.jsx` 572 · `components/map/HeraldBody.jsx` 284 · `components/map/HeraldWanderers.jsx` 124 · `components/map/WandererVerbControls.jsx` 166 · `components/new/tabs/UnaffiliatesSection.jsx` 95 · `components/WorldMap.jsx` 599. CONFIRMED (executed). The Wanderers door is the landed CONDITIONAL Herald door: `RealmInspector.jsx :: realmInspectorSectionsFor` "`return npcConsequencesActive(campaign?.worldState || null) ? Object.freeze([...REALM_INSPECTOR_SECTIONS, WANDERERS_SECTION]) : REALM_INSPECTOR_SECTIONS;`" and `HeraldBody.jsx` "`const HeraldWanderers = lazy(() => import('./HeraldWanderers.jsx'));`" + "`if (section === 'wanderers') {`" (CONFIRMED by read). RN's "person page" (RN l.434, l.496) names no host either.
- WC's DM door (the volume, read): `DESIGN_FP_ARCH_WC.md` §7.D "`removeFreeUnit  WC-11  the dm_removed disposition. … The verb offers two dispositions -- absorb-to-nearest (a `shed`, conserved) or the declared sink`"; §0.2 "`dm_removed  block|free_unit -> SINK`". `paragon` WC 0 (census). CONFIRMED (read).
- PR's will gate (read): PR l.231 "`WILL_SHARE`: `internal < 30` → the minimum … `< 60` 0.7 · `< 80` 0.9 · else 1.0"; "ONE named lean steps it — a magistrate's order (CH, §10.5), one step, never past 1.0"; PR l.465 "a MAGISTRATE's order (CH's `order` domain) raises the town's will gate one step for a season". `patrol_will` 0 everywhere (census below). CONFIRMED.
- Belief carrier for another town's plague: `beliefMap.js` l.348 "`[conditionsBands]  SP-B: believed {pullBand, routePositionBand, storesBand, tierBand}`" — no plague. CONFIRMED (read).
- RN: `REGARD_CAUSES` (RN l.206) lacks `paid_well · sheltered · slandered`; "PT/CH append rows by registration only". `deedIndex(worldState) → { byDoer, byTarget, … }` (RN l.197). CONFIRMED (read).
- Fold: `ransom` ↳ P4 (fold l.545) "the court's choices in its weeks `pay · hunt · wait`", CLOCKED; §3.3.13 ↳ P4 (l.438) "The landed `HOME_ANSWERS` `pay · refuse · abandon` stay the court-to-court leaf's … `refuse` and `abandon` only DELAY … `abandon` still marks the landed grievance". CONFIRMED (read).
- Token census `cure/D-CH-p5-probe/census-p5.out` (script `census.sh`): `patrol_will` 0·0·0·0·0 · `PARAGONS_SECTION` 0·0·0·0·0 · `ParagonPage` 0·0·0·0·0 · `NEED_URGENCY_WEIGHT` 0·0·0·0·0 · `paid_well` 0 src · 0 tests · 1 master doc (this volume's copy) · 1 ledger doc · 0 quoted · `slandered` 1 src (a prose comment, `CardEditorDialog.jsx`) · 0 quoted · ⚠ `sheltered` 10 src · **4 quoted** — LANDED as a `defensiveTerrain` band (`mapProfile.js` "`'exposed', 'open', 'mixed', 'sheltered', 'fortified'`"; `townMapModel.js` / `townLayoutV2.js` `DEFENSIVE_BANDS`) → a HOMONYM, registered (§2.3 P5 row), the ruled word kept so RN's parallel lane and CH append ONE word.

## §2 Progress (15:2x CDT)
- Applied: header · P2 strikes · §2.2 (`patrol_will`, `needsOf`'s reader) · §2.3 P5 row · §3 page · §4.4/§4.7 needs · §5 map + patrols (d) · §6.2 shared seams · §7 record · §9 road 2 · §10 registration row · §11 quarantine · §12.4 OPENED + ransom words · §13 duel deed, nemesis, turn, line · §16b corps ×4 · §18 custody/ransom/participation · §19 custody tier.
- Left: §20 (CH-0 page host, CH-1 car-0, CH-10, table) · §21 (L3, L8) · §22 (S9, S16, S27, S56–S59) · §23 (OD-CH-11, OD-CH-36, OD-CH-48..50) · §25 P5 block.

## §3 The record (also `DESIGN_FP_ARCH_CH.md` §25, "P5" block)
| Id | Sev | Disposition | Where |
|---|---|---|---|
| P5C-11 WC-CH-88·148 / 89 / 90 / 92 | MAJOR | CURED — the fold's WC INBOX row (13) cited for the normalizer arm, the DM-authority SOURCE, the destination input; `disband` = WC's `removeFreeUnit` absorb-to-nearest | §16b · CH-10 · L8 · OD-CH-36 · S56 |
| §A.2 / P5W-2 | MAJOR | CURED — OPENED bracket; one reading for every "waits on ES-2b, the owner's slot"; nothing widened | §12.4 · §18 · §19 · OD-CH-11 · S27 |
| P5C-13 WC-CH-114 | MINOR | CURED — needs as urgency multipliers (REFINED, OD-CH-49) | §2.2 · §4.4 · §4.7 |
| P5C-13 WC-CH-134 | MINOR | CURED — `liaisonId` struck | P2 · §7 |
| P5C-13 WC-CH-143 | MINOR | CURED — `turnedAt`/`crossedAt` struck | P2 · §13 · L3 · S16 |
| P5C-14 WC-CH-124 | MINOR | CURED — `pay · hunt · wait`, CLOCKED | §12.4 · §18 · OD-CH-11 |
| P5C-14 (RN-50 CH half) | MINOR | CURED — registration row with doors; `sheltered` homonym registered | §10 · §2.3 |
| P5C-15 WC-CH-69 | MINOR | CURED — origin read only via the deciding court's call board | §11 step 3 · S58 |
| P5C-19 `patrol_will` | MINOR | CURED — fourth seam word, `{ mult }` on `WILL_SHARE` | §2.2 · §5 (d) · S57 · OD-CH-50 |
| P5C-21 WC-CH-21 / 29 / 44 / 59 / 81 / 96 | MINOR | CURED — page host named and measured; map row in EP's unit; composers RN's; ES row cited; nemesis by `duel_won` deeds; `participation` column cited | §3 · §5 · §6.2 · §9 · §13 · §18 · CH-0 · OD-CH-48 · S59 |

CROSS-VOLUME CHECK (grep 15:13 CDT): PT l.328 cites "CH's believed-plague test" — consistent (CH names the read once, PT never re-reads); the fold l.326/357/815 list the reason word only — consistent; the fold `ransom` ↳ P4 l.545 = CH's new §18 row; WC §7.D = CH's `disband`; BD §9.10 untouched by CH (its OPENED bracket is D-BD-p5's). OPEN until the routed lanes land: PR l.231/l.465 still say "one step for a season" (route 7); RN l.206 still lacks the three causes (route 8); the fold §3.1.24 still says "first of RN-4 · CH-3 to land" (route 2). No STOP.

## §4 ROUTED (one line each: volume · exact edit)
1. FOLD (D-FOLD-p5) §3.1 WC INBOX row (13): at WC-10 — the corps mark's arm in WC's free-unit normalizer · a DM-authority people SOURCE in WC's conservation walker beside `dm_removed` · a destination input to the free-unit stepper · `removeFreeUnit` (WC-11, absorb-to-nearest) as the corps' disband door (CH §16b cites "(13)").
2. FOLD §3.3.16 ↳ P5 owned units: FP MAP LAYERS (owner EP, cut before the first FP map piece; CH's piece one row, `WorldMap.jsx` 599/600) and the shared lean composers `strengthByRef` · `reserve01` (owner RN, TRUTH); amend §3.1.24's "built by the first of RN-4 · CH-3 to land" by bracket.
3. FOLD §3.1 ES row: the `paragon_employer` confirm/refute subject kind at ES's C1 unit (CH §9 road 2 its first consumer).
4. FOLD §3.4: ONE `participation` column on every registered card (CH §18 fills it from `paragonsAt` + `aim`); census `participation` (20 src files, 0 quoted — `cure/D-CH-p5-probe/census-p5.out`).
5. FOLD §5 register pass: copy CH §2.3's P5 row — `patrol_will`; `paid_well · sheltered · slandered` (`sheltered` a homonym of the landed `defensiveTerrain` band); `NEED_URGENCY_WEIGHT`; `PARAGONS_SECTION` · `ParagonPage`; strike `retainer.liaisonId`, `marks.turnedAt`, `marks.crossedAt`.
6. FOLD OD-FC-60 ↳: the A.2 OPENED bracket (CH §12.4 and OD-CH-11 carry CH's).
7. PR (D-PS-ST-PR-p5) §3.1 WILL row (l.231), §10.5 (l.465), the CH row (l.602), OD-PR-30: the magistrate's will = `paragonLean(worldState, settlementId, 'order', 'patrol_will')`, read `min(1, WILL_SHARE × mult)` in the weeks the exertion stands; strike "one step for a season" / "steps it … one step".
8. RN (D-PL-MN-RN-p5) §2.4 `REGARD_CAUSES` (l.206): append `paid_well · sheltered · slandered` by CH's registration row (CH §10 names each door, holder, subject; `slandered` DARK until IN's C1); `sheltered`'s homonym note; `ransomed_by · betrayed · served_with · gift`'s doors stay RN's half of WC-RN-50.
9. RN §"the person page" (l.434, l.496), MINOR: a paragon's page host is CH's OD-CH-48 (the Herald door); a non-paragon person's page host stays RN-4's to name.
10. EP (D-BRACKETS-p5): the FP MAP LAYERS unit row where the fold places it (C.21); CH's map piece one row in it.
11. ES (D-BRACKETS-p5): ES's custody wave row (A.2) names its consumers in order — BD-4's ransom race, then CH's road arm and CH §12.4's held paragon.
12. BD (D-BD-p5) §9.10: the A.2 OPENED bracket; a body's TAKING of a paragon is BD's act on ES's hold — CH adds no road-arm verdict.

## §5 REFINED (vetoable) and open questions for the chair
- REFINED: needs as urgency multipliers (`NEED_URGENCY_WEIGHT` DRAFT 0.5; alt: strike `needsOf`) · `sheltered` kept as a registered homonym (alt: rename in CH and RN at once) · the nemesis counts decided duels only (alt: register an `indecisive` act kind) · the page as a conditional Herald door (alt: a dossier tab, which a settlement-less person cannot carry) · `slandered`'s door is IN's C1 lie exposure, DARK until then.
- OPEN (not a STOP): with ES-2b OPENED, does the chair want a `capture` rung on the failure ladder once ES's wave lands? CH designs none (the opening is "the shapes as written"); it would be new design.
- DRAFT on the FP-46 roster: `NEED_URGENCY_WEIGHT` 0.5 · `patrol_will` `d` 0.10.

## §6 CONFIRMED vs PLAUSIBLE
CONFIRMED: the host line counts (eslint executed at `81f1cd963`), the token census (executed), and every quoted volume or master line (read). PLAUSIBLE: every cure's behaviour (design, nothing built), `removeFreeUnit`'s undo restoring the mark (WC's store-action lifecycle, unread), and the page hosts' added-line estimates (≤ 6 · ≤ 7 · ≤ 4).
