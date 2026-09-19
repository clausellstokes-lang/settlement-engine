# R-HERALD-NUMERICS — the realm news surface vs the no-naked-numbers directive (survey at `4bb9f80d9`)

Owner directive (2026-08-29 sitting, in-chat, ODQ §754.3): every realm/Herald news line must be contextual
narrative — "X attacked Y", "A captured B", "D did Z because of W" — NEVER numerical deltas; register =
SimCity/Bannerlord/Manor Lords. This survey (read-only Fable seat, all facts at build tip `4bb9f80d9` via
`git show`/`git grep`) measures how far the shipped surface already complies and names the entire gap.

## The pipeline (CONFIRMED)
THE HERALD = `RealmInspector.jsx` ("THE REALM INSPECTOR = NEWSPAPER", owner doctrine 2026-07-22): report
doors War/Faith/Trade/Events/Divination/Adjudication + registers (Gazetteer, Remembrance, Wanderers) +
Dashboard prose mode (ChroniclersLetterPanel · AdvanceReport · WizardNewsPanel). Mint: ~83 worldPulse files,
~245 `headline:` sites + authored pools (`eventProse.js`, six `*ReceiptPools.js`, `roadsProse.js`,
`traditionProse.js`). File: `heraldFeed.js` → HeraldItems `{headline, summary, severity, reasons, subject,
affectedIds}`; `heraldGrammar.js` = the NEWS ADDRESS LAW implemented: `[SUBJECT-ADDRESS] [ACTION OBJECT] ·
[AFFECTED] | [REASON] [·PROVENANCE]`, typed reason labels (Casus/From/Driver/Origin/Drivers/Stakes). Render:
`HeraldHeadline.jsx` — headline byte-verbatim, severity as a BAND WORD pill; `HeraldForecast`/`LiveWarStatus`/
`RealmDashboard` grep CLEAN for `toFixed`/`%`. Player sibling: dossier "Rumors & News" World tab
(`RumorsTab.jsx` ← `settlementRumors.js`).

## The verdict, with denominator
Of ~245 headline sites + ~30 pool families, the DOMINANT class is named-actor narrative WITH recorded reason
(exemplars, verbatim: "`${winner}'s army breaks ${loser}'s in the field`" · "`${verdict.winner.name} seizes
power in ${settlementName}`" · "The siege of X broke. Y's army holds the walls; an occupation authority now
rules in the conqueror's name." · casus prose: "Their granaries stand full while ours thin. Hunger is faster
than patience."). Demographics speaks via `quantityWords` — "SPEAK A COUNT WITHOUT WRITING ONE"
(nobody…thousands). Crier/body pools are settlement-agnostic BY DESIGN (names ride the AddressChain).

**THE ENTIRE GAP = 94 worldPulse sites where engine scalars ride inside `reasons` strings**, all frozen in
`tests/lint/.prose-numerics-baseline.json` (census ceiling 408 repo-wide, shrink-only; its own comments call
these "FROZEN AS UN-HUMANIZED DEBT… owed a humanization wave"). CONFIRMED user-reachable offenders (verbatim):
- `deploymentReturn.js:211/:369/:405/:471` — "A returning army at NN% of its muster strength could not
  prevail. Success 0.62, roll 0.41." / "Hold chance… roll…"
- `occupation.js:767/950/1021` — "Resistance at 0.34 (occupation contested)."
- `institutionLifecycle.js:775/843-4` — "Build chance now 45%." / "Economic contribution N%, impairment N%."
- `moralInstitutionPressure.js:372/526` — "Viability pressure has built to NN% over sustained ticks."
- `flows.js:96` (severity 0.xx) · `beliefMap.js:1569` (confidence 0.xx) · `mobilizationReactions.js:333`
  ("Disposition 1.12 (centered on 1.0) → march") · `feasibilityGate.js:197` (capacity ratio) ·
  `deityStanceLane.js:373` (piety ×mult) · `magicRegimeLifecycle.js:246` (economy 0.xx) · `momentum.js:1171`
  (relief %) · `tradeWar.js:683/720` (strength 0.xx) · `armyTransitKernel.js:598` ("believed ~N" fog line).
PLAUSIBLE-only reach (admin/records surfaces): `peaceTermsDrafting.js:87-90` term receipts (TreatyPanel
renders banded labels, not receipts) · `attrition.js:222` · militaryStrength/npcAgency/warCapacity reasons.
⚠ Structural: `newsReasonPhrases` recasts only a closed token map and PASSES PROSE THROUGH — a numeric
sentence in `reasons` is invisible to the display sidecar. **The cure is AT MINT.**

## Rumor mill (CONFIRMED)
No feature by that name; the substance is "Rumors & News": `rumorNetwork.js` ledgers, trade-carried +
hop-delayed (`distancePricedNews.js`), distance-degraded tellings with epistemic bands ("Known here
firsthand" / "Told by more than one road" / "A single unverified telling" / "The tale is thin and much-worn
by the road") and a DM truth-divergence block. The lies/carriers/planted-stories tier is deliberately
deferred ("arrives in a later chapter"); brokerage lanes (`road/hearth/vice/underworld`) are the adjacent
planted-story machinery.

## The chartered cure — TE-HERALD-1 (ODQ §754.3, vetoable)
Humanization wave: drive the 94 rows to zero — every scalar becomes band/world words at mint; the
prose-numerics census ratchets down in the same acts; regression policed by the existing walls
(`newsHeadlineContract` · `newsVoiceContract` · `wizardNewsAuthoring` · `heraldRouting` ·
`settlementRumors.walker`). ⚠ OWNER BOUNDARY AWAITED: honest concrete counts in world words ("an answer is
owed in three weeks", "two marks in the ledger", "Ny left") are census-legitimate and RECOMMENDED KEPT;
the wave dispatches on the owner's word on that boundary.
