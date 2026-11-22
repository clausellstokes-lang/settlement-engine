# SEAT-MEASURE — the chair's three added questions: the birth-law gate, where a true holder could live, the smallest stored change (written 2026-11-20T05:00Z, base `85fccf898`)

The labels below follow the operating standard: **CONFIRMED** means executed here; **read** means read in the code by symbol, not executed.

## (a) THE BIRTH-LAW GATE: yes, and it has a working template (two laws already ride it)

**Where the version lives.** It is on the settlement, in its persisted `config` (the same bag as `_seed`): `config._densityLawVersion` and `config._livingContentLawVersion`. Readers accept `settlement.config || settlement._config` (`rulingPower.js :: demotesIncumbent`'s read, `events/mutateEntities.js`).

**There is no separate campaign-world version.** The world pulse reads each settlement's own config:
- `worldPulse/factionDensityKernel.js`: "`rollsRegisterVii(settlement.config)` reads the version the world was BORN under";
- `pulseKernel.js`: "the world's OWN persisted law version, `_densityLawVersion`".

**What writes it.** One mint, `densityCreateBoundary.js :: birthConfig`, spreads `newSettlementDensityLaw()` and `newSettlementLivingContentLaw()` into a birth's config. Executed today, `birthConfig({ settType: 'town' })` → `{ settType, _densityLawVersion: 2, _livingContentLawVersion: 2 }` (CONFIRMED).
- The only callers are the two classified BIRTH reachers: `store/settlementGenerateAction.js` and `lib/instantWorld/composeInstantWorld.js`.
- `PIPELINE_REACHERS` classifies every module that can reach the pipeline as BIRTH, DERIVED, PREVIEW or EXECUTOR.
- `GENERATION_LAWS` registers each law (mint, module, dial, configKey, wiring).
- `tests/lint/densityCreateBoundary.walker.test.js` holds both tables to the tree.

**What reads it.** `densityLaw.js :: rollsRegisterVii` is read in 13 modules: `applyDensityLaw.js`, `successionGrammar.js`, `titularSuccession.js`, `densityAscension.js`, `factionRoles.js`, `densityCadence.js`, `factionLifecycle.js`, `rulingPower.js`, `tierResourceDynamics.js`, `factionDensityKernel.js`, `factionCompetition.js`, `mutateEntities.js` (and its own module). A save, a load, a same-seed re-derivation and an undo all replay the born law because the key travels in the record. The Library's "Apply Saved Configuration & Regenerate" is a **birth**: `birthConfig` re-mints, so a regenerated world takes the current law, by design and recorded in `densityLaw.js`'s header.

**Could the seat law be gated the same way?** Yes. A third law, `_seatLawVersion`, whose absence means "the law the world was born under before it", keeps every stored town's **record** byte-identical: no code rewrites a stored record on load. Three facts make it cheaper than it looks.

1. **The golden master would not move.** `tests/helpers/goldenMasterCorpus.js` builds its 525 configs with no law key (read: no `birthConfig`, no `_densityLawVersion`). The golden therefore pins **v1** births today. CONFIRMED: the seats are byte-identical between v1 and v2, and only the roster differs (SEAT-COUNT's correction). A gated seat law moves no golden row. The other side of that: the golden would not witness the new law either. It needs its own fixture arm, as Register VII's "distribution-shape fixtures drive v2 explicitly".
2. **The power step's replay follows.** `power/economyReconciliation.js` re-runs `generatePowerStructure` from the stored intent and the record's config, so a stored town replays its own law (read).
3. **The precedent cost is known.** The living-content law was added as the second law:
   - one law module (versions, `resolve…`, the `NEW_SETTLEMENT_…` dial, the mint);
   - one `GENERATION_LAWS` row;
   - one spread in `birthConfig`;
   - the walker's `MINT_SYMBOLS` widened;
   - its own wiring test (`tests/domain/livingContentLawWiring.test.js`);
   - measured on the golden 525 and the RATE 768: "zero movers".

   The config key rides into the public projection (`config` is allowlisted and `_`-keys survive; CONFIRMED for `_population`), which is harmless. `store/configSlice.js :: isAllowedConfigKey` admits any `_` key.

**What a gate does NOT protect.**
- **Render-time readers** (the contender list, the power page, the desk and print readers) run on every stored town at every view. A read-side change (K1 / O2) is byte-safe for old records only if the reader itself branches on `config._seatLawVersion`.
- That branch has a trap. `coupContenders` is also called on **partial** settlements that carry no config: `factionStanding.js :: annotateFactionStanding` hands it `{ powerStructure: { factions, publicLegitimacy } }`. Those callers must pass the config, or they will silently read the old law.
- **Save-time projections** recompute at each save (`publicProseCompose.js` → `publicProse`), so an old town's served prose moves on its next save unless they branch too.
- **The simulation** reads the stored settlement each tick, so a gated `coupContenders` keeps old campaigns on the old contest. Verdicts already applied are stored events and never move.

**The cost of the gate**, beyond the precedent list: the version argument threaded through every seat reader: 12 `coupContenders(` call sites in `src/` (counted), plus the chooser and the readers keyed on the government name in SEAT-MAP §1–§3, one walker row, and one fixture arm. **The benefit**: no stored town, golden row, or live campaign moves, so the build can land predeploy without a golden-door signing.

## (b) WHERE THE TRUE HOLDER COULD LIVE: what a non-owner reader is served today

The projection is `display/publicSafe.js :: toPublicSafe` (client). Its server twin is `_gallery_sanitize_public_json`, latest definition in `supabase/migrations/210_public_prose_text_projection.sql`. They are pinned equal by `tests/security/gallerySanitizer.pglite.test.js` and `snapshotDenylistDrift.test.js`. I executed the client and read the SQL.

**What it strips:**
- **Top level**: a fail-closed allowlist, `PUBLIC_TOPLEVEL_KEYS`. `powerStructure`, `config`, `npcs`, `institutions` and `publicProse` are in it. Dropped: `_seed`, `_config`, `aiData`, `dmNotes`, `dmCompass`, `plotHooks`, `simulationTrace`, `campaign`, and the rest of its comment's list.
- **Every nested key** matching `PRIVATE_KEY_RE`: `secret|private|\bdm|\bgm|guidance|dossierNotes|tabNotes|\bnotes?\b|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|latentPantheon|decrees|seed|_config`. The SQL is `key ~* '(secret|private|\m(dm|gm)|…)'` at every non-top level.
- **NPC cards**: reduced to `NPC_PUBLIC_KEYS` (`id, name, role, title, category, personality, physical, presentation, influence`), with `institution` and `memberships` public per row by the veil bit (206).
- **The root pass (206 / 207 / 210 twins)**:
  - removes `powerStructure.criminalCaptureState`, every `factions[].captureState`, and every `factionRelationships[]` row that carries `captureState` or is typed `corrupted`;
  - drops every `factions[]` row stamped `hidden: true`, and masks its name **everywhere** in the public JSON as `HIDDEN_POWER_MASK` = *"an unseen interest"*;
  - deletes a veiled face's `npc1Role` / `npc2Role` on its ties.

**What of `powerStructure` reaches a shared page today** (CONFIRMED on a criminal-haven city, seed `seat-measure-city-criminal_haven-0`):
- `government` (**"Corrupt City Council" is served**, and so are Corrupt Council and Shadow Senate: 22 criminal seats under the presets), `governingName`, `stability`, `recentConflict`, `publicLegitimacy`, `conflicts`, `economyInputFingerprint`, `powerProjectionVersion`;
- `factions[]` with `category, desc, faction, isGoverning, modifier, power, powerLabel, rawPower` (only `captureState` stripped);
- `factionRelationships[]` with `direction, narrative, pair, ratio, type` (4 of 6 rows served; the capture and corrupted rows dropped).

**The council held from behind by a criminal power already exists, DM-only.** `people/hallCapture.js :: writeHallCapture` (the one writer, called from `narrativeGenerator.js`) derives `criminalCaptureState` (`'none' … 'capture'`) and the governing row's `captureState` seed from the hidden allegiances of the ruling three. The projection strips both (migration 207). A true holder is therefore one more fact of the same class, and has two homes that **need no migration** (CONFIRMED on the client with a synthetic `powerStructure.seat`):
- under a key the denylist already matches: `secretHolder`, `dmHolder` and `holderPrivate` are **stripped** publicly and kept in a DM-full share. ⚠ `trueHolder` and `hiddenHolder` **LEAK**, so the key's name is the security boundary;
- or as a power row stamped `hidden: true`: its row leaves, and its name in `seat.holder` (or any other public string) becomes *"an unseen interest"*.

**What a true holder does not fix today.** The form's own name: "Corrupt Council" and "Shadow Senate" tell a public reader what the true holder is. The model's public face is a civic form (Town Council) with the criminal holder DM-only. That is a chooser change (O5 / K2), not a projection change.

## (c) THE SMALLEST STORED CHANGE, against what can be derived from what is stored today

**C0: store nothing; derive at render.**
- holder = the power whose rank-1 member is the seat-holder (`liveSeatCandidatesOf`, `memberships`);
- else the same-kind power beside the seat;
- else the body itself (a civic seat holds itself);
- person = `liveSeatCandidatesOf(s)[0]`;
- form = `government`.

Measured reach (CONFIRMED, `kin-*.json`, v2): the holder heads another power in 365 of 900 towns at default (213 of 960 under the presets). The same-kind fallback adds 93 (236), and the rest are civic seats holding themselves. Every town has a seat-holder (0 holderless).

*It cannot represent* a true holder that differs from the public face: the derivation reads only public links. Nor can it represent an unusual pair with its reason, which nothing stores.

*It moves*: render readers and save-time prose on every town, old ones included, unless gated by version as in (a). The birth writers that read contenders (`factionStanding.js`, `castPowers.js`) move births: one golden member, or none if gated.

**C1: one small `powerStructure.seat` beside the factions, the governing row kept** (the chair's example; my recommendation for the stored minimum): `{ holder: <power name>, holderReason?: <closed-vocabulary key for an unusual pair>, dmHolder?: <true holder, when it differs> }`.
- `form` stays `government`, and the person stays the derivation (never stored twice).
- Shares, labels and the governing row are untouched, so no share moves.

*It moves*:
- one new key on births under the new law only, with no golden move if gated;
- one registry row per field in the veil lane's `rosterChoiceRegistry.js`: `seat.holder` withhold-or-diffuse by house, `seat.dmHolder` withhold always;
- the `PUBLIC_TOPLEVEL_KEYS`-level projection needs nothing (`seat` rides under `powerStructure`, and `dmHolder` is denied by `\bdm` on both sides);
- the transfer: `rulingPower.js :: transferRulingPower` must write `seat.holder = winner` instead of only renaming the row.

Old towns lack `seat` and read C0.

**C2: the seat leaves the shares** (K2: the office carries no power figure). It moves every share, `powerLabel`, ranked sentence and contender on every new-law town, plus the transfer's roster arithmetic. It is a persisted-shape change, so it is the owner's call. Gated, it moves no stored town.

## Recommendation

Gate the seat law as a **third birth law** (`_seatLawVersion`, a `GENERATION_LAWS` row, the `birthConfig` mint). Store **C1** on new births, and read **C0** for every town that lacks `seat`. Keep the true holder under **`dmHolder`**, never a `true…` / `hidden…` key name. Pass the config to every `coupContenders` caller, the partial ones included. This lands predeploy with no stored town, golden row or live campaign moving. The owner's veto points are C2 (whether the office keeps a share) and the form-chooser change that would let a criminal hold a civic-faced seat.
