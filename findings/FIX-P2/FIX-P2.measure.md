# FIX-P2 — the realm layer keyed on `settlement.id`: MEASUREMENT (Opus recon lane; no `src/` or `tests/` file touched)

Lane: FIX-P2 (Opus RECON + MEASUREMENT). Chair: Fable 5.1, session a9df403c. Stamp: **Sun Sep 20 05:11:57 EDT 2026** (`date`, read in the same call as this file's receipts block).
Read tip: `$SP/read-tip-5a3380e8d` at **5a3380e8d**, detached, `git status --short` empty, never edited. Preview: the tip's own Vite on **127.0.0.1:5233**, PID **33074** (kill receipt at the end).
Persona: `.env.development.local` copied read-only from `$SP/consist` — `VITE_PREVIEW_ROLE=admin`.

---

## OUTCOME FIRST

**REVIEW-P F2's reachable claim is REFUTED as stated.** Two saves grown from one seed and placed in one
campaign do **not** share a node key. Measured in the running product: the realm keys every member by the
**SAVE id**, and the twins appear as two independent nodes, two independent tick records, and two
independently addressed ends of every edge and channel (receipts R1–R6).

**But the lane found a live defect of a different shape at one of F2's four sites** — `mapDress.js` reads
the war ledger and the severity stream in the **wrong id namespace**, so a besieged realm member never gets
its siege mark and the map paints a different winter than the simulation scored (**FIX-P2-N1**, CONFIRMED by
executed probe, 17 of 20 years disagree).

Two further CONFIRMED findings: F1's collision reproduces on the **signed-in** path (**N2**), and
`settlement.id` is derived from `_seed` **alone**, so one typed seed with different configs yields
genuinely different worlds carrying one id (**N3**, executed).

Recommendation at the bottom: **take the remainder of shape A (mapDress), refuse shape B.** Shape B moves
all 525 generator-golden hashes (executed receipt) and cures nothing the realm suffers from.

---

## 1 · THE KEY'S LIFECYCLE

### 1.1 The mint — one writer, seed-only

`src/domain/normalizeSettlement.js:191` is the **only** writer of `settlement.id` in `src/`
(`grep -rn 'settlement\.id *=\|out\.id *=' src/` → normalizeSettlement.js:191 plus one unrelated
`npcLadderState.js:875` row id):

```js
if (!out.id) out.id = out._seed ? idFromSeed(out._seed) : contentId(out);
```

`idFromSeed` is FNV-1a over the seed string alone. `assembleSettlement.js:302-307` attaches `_seed` to the
settlement immediately before normalize, so every generated world's id is a pure function of its seed and of
nothing else — **not** of the resolved config. CONFIRMED (node, read tip):

```
$ node golden-id-probe.mjs
id = s_08299edf32384bbc
_seed = fixp2-alpha
```

`contentId` (name/tier/population + sub-collection-length fingerprint) is the fallback for id-less, seed-less
imported or mock data only.

### 1.2 The read — 41 sites, dispositioned

`grep -rn 'settlement\.id\b' src/ --include='*.js' --include='*.jsx'` → **41** hits. By disposition:

| Disposition | Count | Representative sites |
|---|---|---|
| **RNG / hash seed** (not a key) | 6 | `resourceSites.js:142` (`identityOf` → site bearing+band), `undercity/monotoneComponents.js:475` (worked seams, same `identityOf` idiom), `traditions/politics.js:90` + `traditions/genesis.js:339` (`_seed ?? id`), `crossSettlementConflicts.stableIdOf` via `neighbourBackLink.js:197` (`_seed ?? id ?? name`), `economyDeskRead.js:112` (`_seed ?? id`) |
| **Save-id variable that is merely *named* `settlement`** | 4 | `CampaignFolder.jsx:468,479,492` (the rows are save envelopes; `SettlementCard` passes the same value to `addToCampaign(c.id, s.id)`) |
| **Fallback after a save id, fails CLOSED** | 9 | `WarTab.jsx:399`, `SessionMode.jsx:99`, `SteadingsSection.jsx:27`, `RumorsTab.jsx:128`, `FaithTab.jsx:198`, `UnaffiliatesSection.jsx:101`, `livingWorldSignals.js:190`, `warResolve.js:362`, `warStatus.js:323` — all `saveId ?? settlement.id`, and every consumer then looks the value up in a save-id-keyed structure, so the fallback resolves to nothing rather than to the wrong row |
| **Display / payload field** | 9 | `aiGrounding.js:403`, `contextAnchor.js:29,67,88`, `entityLinks.js:457`, `worldSnapshotPublic.js:518`, `tradePressure.js:65`, `researchCapture.js:99` (UUID-guarded), `customContentUsage.js:417` |
| **Keys a structure** | 4 | `regionalGraph.js:302` (per-dossier graph centre), `mapDress.js:102` + `:167` (war ledger + severity stream — **N1**), `persistProjection.js:162` (`draftIdentity`, device-local), `realmItemReadModel.js:245` (`save.id ?? settlement.id`) |
| Other guards / comments | 9 | `normalizeSettlement.js:233`, `pendingEditIntents.js:342`, `settlementPendingEditActions.js:35`, `deriveRegionalState.js:286`, `neighbourBackLink.js:197`, … |

The four "keys a structure" sites are exactly F2's list, and each is dispositioned in §2.

### 1.3 Persist — what actually crosses the boundary

| Path | Does `settlement.id` cross it? | Receipt |
|---|---|---|
| A library save row | **As a field inside the blob, never as the row key.** `saves.js` Supabase insert carries no `id` (the DB mints it); local mode mints `Date.now()` (`localSaveEntry`: `const id = v2.id \|\| Date.now()`) | R1: two rows, save ids `1789894750514` / `1789894703388`, both `settlement.id = s_08299edf32384bbc` |
| Campaign membership | **No** — `campaign.settlementIds` are save ids (`addToCampaign(c.id, s.id)`; `campaigns.js:171` refuses a member id that is not `isPersistedId`) | R2 |
| The realm graph | **Yes, as a non-key side field.** `graph.js:389` writes `settlementId: state.settlementId` onto each node; `deriveRegionalState.js:285-286` sets `id: saveIdOf(...)` (the key) and `settlementId: settlement.id` (the field). **Census: nothing reads it.** The only `settlementId` reads inside `src/domain/region/graph.js` are the write itself, `normalizeNode`'s own `node.settlementId \|\| node.id` passthrough (189), and `findTargetSave`'s link probe (409); no consumer outside the module reads a node's `settlementId` | R3, R6 |
| World-pulse ledgers | **No** — `worldSnapshot.js:17` `saveId(save)` = `save.id \|\| save.settlement.id \|\| save.settlementId \|\| save.name`; with a save row present it is always the row id, and `byId`, `settlementTickStates`, `deployments`, `relationshipStates`, `warExhaustion`, pulse records and `pendingEvents[].saveId` all key on it | R4 |
| Cross-save handles | **No** — `neighbourBackLink.js` writes `{ id: partnerSave.id, linkId: 'link_<saveId>_<saveId>' }` into the persisted `neighbourNetwork` | code read (lines 118-147) |
| Realm map placements | **No** — `mapState.placements[burgId].settlementId` is a save id (remapped through the save-id map on gallery import, `galleryImportMap.js:402`) | code read |
| The anonymous draft slot | **Yes, as the comparison identity.** `persistProjection.draftIdentity(settlement, lastSeed)` = `` `${id}\0${lastSeed}` ``; the envelope itself holds the whole world, so the id is compared, never stored as a key | code read (persistProjection.js:137-166) |

### 1.4 Regenerate · undo · clone/fork · migrate/import

- **Regenerate** ("Regenerate draft") mints a new `_seed` ⇒ a new id. A same-seed regeneration reproduces the
  same id by design (THE PROMISE). CONFIRMED live: forging `fixp2-alpha` twice gave `s_08299edf32384bbc` both times.
- **Undo** — `pulseUndoStack` / `proposalUndoStack` snapshots are keyed by `campaignId` and restore ids verbatim;
  no id is minted on the undo path.
- **Clone / fork** — `forkSeedFor(sample, userId)` = `` `${sample.config.seed}-${(userId||'anon').slice(0,8)}` `` ⇒
  a new `_seed` and a new id **per identity**, and the **same** id for every repeat fork by that identity (N2).
- **Gallery import** — `galleryImportSettlement.js` strips `_seed` but spreads the source through
  `normalizeSettlement`, whose mint is guarded by `if (!out.id)`; the incoming `id` therefore **survives**, so an
  imported dossier carries the sharer's `settlement.id` into the importer's library and can never re-derive it.
- **Account import** — `accountImportBody.js` builds an `oldId → newId` map over **save** ids and remaps
  `campaign.settlementIds` and placements through it; `settlement.id` inside the blob is carried through unchanged.
- **Schema migrations** — `grep -n '\bid\b' src/domain/settlementMigrations.js` → **no hits**: no migration reads,
  writes or re-mints the id.

---

## 2 · THE LIVE REPRODUCTION — CONFIRMED / REFUTED

Walk (all in the product's own UI, on the lane's server; store reads via `window.__store.getState()`, which the
tree exposes in DEV; raw receipts in `receipts.md`):

1. `/create` → Advanced → **Exact seed** `fixp2-alpha` → **Forge seed** → *Niederstadt*, village, 692, `s_08299edf32384bbc`.
2. **Save to Library** → save row `1789894703388`.
3. **New Draft** → same seed → **Forge seed** → byte-identical world → **Save to Library** → save row `1789894750514`.
4. Library → **New campaign** "FIXP2 Realm" → **Add to FIXP2 Realm** on both rows.
5. **Discover regional channels**, **Canonize** both rows, **Advance by Month**.
6. Fork arm: `/create` → **Fork this sample** (Mossgate) twice as the same account → two more saves.

### The verdict, site by site

| F2's site | Verdict | Receipt |
|---|---|---|
| `regionalGraph.js:302` `centerId = settlement.id` | **REFUTED as a realm key.** `deriveRegionalGraph(settlement)` is the *per-dossier* neighbour graph; its only consumers are `mapProfile.js:211` and `aiGrounding.js:441`, both per-settlement, each building its own object. The **campaign's** graph is a different module — `region/graph.js#deriveRegionalGraphFromSaves` — and keys by save id | R3, R6; `grep -rn 'deriveRegionalGraph\b'` |
| `resourceSites.js:142` | **REFUTED as a key.** `identityOf` feeds a hash that picks a bearing and a band; there is no map keyed by it. Twins deriving identical sites is the correct answer (same seed ⇒ same world) | code read; `deriveResourceSites` probe |
| `mapDress.js:101-102, 167` | **NOT a collision — a NAMESPACE MISMATCH (N1, new).** See below | executed probe |
| `realmItemReadModel.js:245` | **REFUTED.** `textOf(save.id ?? settlement.id)` — with a save row present the key is always the save id. It could collide only for a save with no `id`, which neither backend produces | code read + R1 |

### R3 / R4 / R6 — the decisive receipts

```
nodes  : [{"id":"1789894750514","settlementId":"s_08299edf32384bbc","name":"Niederstadt"},
          {"id":"1789894703388","settlementId":"s_08299edf32384bbc","name":"Niederstadt"}]
tick 8 : settlementTickStates keys = ["1789894750514","1789894703388"]   ← two independent records
4 members, 2 twin pairs: 4 nodes, 10 edges, 26 channels — every endpoint a save id,
          e.g. edge.1789895282594.1789895242218 and channel.trade_dependency.…salt (Mossgate ↔ its own twin)
```

The realm's left rail rendered **two** cards, "Niederstadt · village · 692" twice. Nothing merged, nothing
overwrote, no `Map.set` collision anywhere in the chain.

**Why F2 read as plausible and is nonetheless wrong:** `saveId()` in `worldSnapshot.js` and `saveIdOf()` in
`deriveRegionalState.js` both *fall back* to `settlement.id`, and the region layer names its side field
`settlementId`. The fallback only fires for a save row without an id, which no backend mints.

---

## 3 · FIX-P2-N1 (NEW, CONFIRMED) — `mapDress` asks the realm a question in the wrong namespace

`mapDress.js:102` passes `settlement.id` into `settlementWarStatus`, and `:174-175` passes it into
`seasonalSeverityFor`. Both ledgers are keyed by **save** ids. Census of the twelve `settlementWarStatus`
call sites: `pdf/lib/liveWorld.js:139`, `ShareToGallery.jsx:186`, `livingWorldSignals.js:194`,
`PerspectiveStandings.jsx:76`, `heraldRegister.js:165`, `WarTab.jsx:428`, `SessionMode.jsx:112`,
`signalRegistry.js:338`, `warResolve.js:259` — **every one passes a save id.** `mapDress.js:102` is the only
site that passes `settlement.id`, and `sceneCompileInput.js:339` hands it `projected.settlement`, i.e. the
dossier object, so the mismatch is structural and not a caller mistake.

Executed (`mapdress-namespace-probe.mjs`, a synthetic campaign whose deployment ledger uses the two save ids
measured in the walk):

```
war status keyed by SAVE id      : {"besiegingTargets":[],"besiegedBy":["1789894703388"],"atWar":true}
war status keyed by settlement.id: null
resolveMapDress(settlement).state: null                                  ← the siege ring never lights
resolveMapDress(save id).state   : {"besieged":true,"scarLevel":0,"rebuiltCategories":[]}
severity disagreements over 20 years: 17/20
  year 1: kernel(save id)=null vs map(settlement.id)=hard_winter
  year 4: kernel(save id)=drought vs map(settlement.id)=hard_winter
```

Consequences, both silent by construction (which is why nothing has caught it):

1. A besieged campaign member never gets its siege works ring — the state read is *dormant-absent*, so the
   failure renders byte-identically to peace.
2. The painted seasonal severity is an independent draw from the one `traditionsKernel.js:263` scores the
   year with (`sid` there is a save id — `settlementIds: [sid]`, `relationshipStates[sid]`). mapDress's own
   header says "The map dresses the winter the sim ran." It does not.

Smallest cure (**not built**): give `resolveMapDress` an explicit id argument and thread the save id from the
scene pipeline's caller, instead of reading `settlement.id`. Display-only; no persisted byte moves.
**It is a behaviour change on a dormant path** (a siege lights; the painted severity moves for every campaign
member) — the chair rules it; it is not owner-gated (no persisted key, no schema, no paid surface).

---

## 4 · FIX-P2-N2 and N3 (NEW, CONFIRMED)

**N2 — F1 reproduces on the signed-in path.** Forking one sample twice as the *same account* yields a
byte-identical world: both forks `{"id":"s_c428e8848a3fd616","seed":"mossgate-004-mock-fix","name":"Mossgate","pop":3553}`,
saved as two rows. `forkSeedFor` folds only the user id, so the second fork of a sample is always the first one
again. REVIEW-P measured the anonymous arm; the account arm carries the same promise ("Each forks with a unique
character") and the same defect. **FIX-P1's salt must cover the repeat fork by one identity, not only the
anonymous case, or the cure is half a cure.**

**N3 — the id folds the seed and nothing else, so one typed seed spans different worlds.** Executed
(`same-seed-other-config-probe.mjs`):

```
village         id=s_08299edf32384bbc  name=Niederstadt  pop=530    tier=village
metropolis      id=s_08299edf32384bbc  name=Niederstadt  pop=44435  tier=metropolis
village/arabic  id=s_08299edf32384bbc  name=Hisnnagar    pop=530    tier=village
same id, different worlds : true
```

This is the one genuine defect shape B would cure. Its reachable consequence today is **not** in the realm
(save-id keyed) but in `persistProjection.draftIdentity`: two anonymous tabs holding *different* worlds forged
from one typed seed share `${id}\0${lastSeed}`, so case (b) lets one tab retire the other's slot — the exact
data-loss shape that module was written to stop. Boundedness measured only partly: `TIER_GATE.anon.preGenOptions`
is `false`, so whether an anonymous visitor can reach the exact-seed door at all is **unmeasured** (slot below).

---

## 5 · THE TWO CURE SHAPES, PRICED

### Shape A — "give the realm/graph layer the SAVE id as its node key"

**Already true everywhere except one site.** Nothing to build in the realm graph, the snapshot, the pulse
ledgers, membership, placements or the read model — receipts R2–R6. The remainder of shape A is exactly N1.

- **Chokepoint:** `resolveMapDress(settlement, worldState, regionalGraph)` in `src/domain/townMap/mapDress.js`
  (one function, two id reads at `:102` and `:167`) plus its one production caller chain
  `sceneCompileInput.js:339 → sceneLiving.js:330`.
- **Blast radius across the lifecycle:** create — none; read — the town scene / map dress only; **persist —
  none** (the module's own law: "never stored on the settlement"); regenerate — none; undo — none;
  clone/fork — none; migrate/import — none. **No persisted key changes.**
- **Goldens:** none move. The dress layer is off the generation path (`grep -rn 'resolveMapDress'` → townScene
  only), so `generator-golden-master.json` and `dossier-prose-manifest-golden.json` are untouched.
- **Pins that watch it:** `tests/security/townScenePlayerSafe.test.js` (audience projection), the dress dormancy
  receipts (a no-campaign surface still yields `null` either way, so the byte-identical off-state survives).
- **Declared shift:** a campaign whose member is besieged starts painting the ring, and the painted severity
  changes for every campaign member (17/20 years in the probe). That is a legitimate one-time output shift and
  must be recorded as one.

### Shape B — "make `settlement.id` fold the resolved config the way `contentId` does"

- **It moves every generator golden. EXECUTED:** `tests/property/generatorGoldenMaster.test.js:796-800` hashes
  `sha256(JSON.stringify(generateSettlementPipeline(cfg, null, {seed})))` — the whole settlement — and the id is
  inside that payload:

```
id appears in the hashed payload: true
sha256(payload)              = b74f4b825806c8f89bb19da1dcc7d42e097d6c52bd6883d836d0529be40fe907
sha256(payload without id)   = 3552a4372f882f9d5a79e42268744383cfc148ef308034b5ae13418ebbf92fdf
```

  All **525** rows move, plus every sweep corpus derived from the same key. Under LANE-PARALLEL §6 a golden move
  is an immediate STOP; it is also an owner-signed shift under the honesty law.

- **It creates a permanent mixed namespace with no migration door.** `normalizeSettlement` mints only when
  `!out.id`, so every existing save keeps its old-style id forever while new generations get new-style ones, and
  nothing distinguishes them. Nothing *orphans* (the one persisted consumer, `regionalGraph.nodes[].settlementId`,
  has no reader), but "the same seed gives the same id" stops being true across the cut — a THE PROMISE-adjacent
  claim, which makes this an **owner decision point**, not a chair one.

- **Derived values that move for new worlds:** `resourceSites` bearings and bands and, through the same
  `identityOf` idiom, `undercity/monotoneComponents` worked seams. (`stableIdOf` prefers `_seed`, so the
  cross-settlement conflict RNG is unaffected while `_seed` survives; the gallery clone strips `_seed`, so
  imported dossiers would shift to the `contentId` branch's behaviour.) Pins that would need re-reading:
  `tests/domain/resourceSites.test.js:144,153` and `tests/domain/undercityStaticComponents.test.js:200`
  (both pin literal bearings, but against hardcoded fixture ids, so they survive a derivation change).

- **What it buys:** only N3 — two same-seed/different-config worlds stop sharing an id. It buys the realm
  nothing at all, because the realm already distinguishes twins.

### RECOMMENDATION

1. **Take shape A's remainder (N1) and nothing else.** It is the only part of F2 that is a live defect, it moves
   no persisted byte and no golden, and it is a chair ruling.
2. **Refuse shape B.** Golden-moving, owner-gated, permanently mixed namespace, and it cures nothing the realm
   suffers from.
3. **If the chair wants N3 closed, close it at the forge, not at the id** — disambiguate at the door that mints
   the seed (FIX-P1's per-identity/per-browser salt, extended to cover a repeat fork by one identity, N2). A salt
   changes a *seed*, and a new seed is a new world by law: no golden moves, no namespace splits.
4. **Close F2 in the ODQ as REFUTED-with-receipt**, re-docketed as N1 (mapDress) + N2 (into FIX-P1) + N3
   (owner-visible, see below), so the "realm keyed on settlement.id" premise is not re-found by a later lane.

**For the owner, in plain words (N3):** if you type one exact seed and forge it twice at two different sizes,
you get two different towns that the engine privately labels with the same identity. Nothing in a realm confuses
them today. Giving them different labels would change the identity of every settlement the engine has ever made,
so it is not a repair we should make quietly — the cheaper honest fix is to make the *seed* differ.

---

## 6 · PROCESS NOTES (deviations, stated)

- **The persona does not seat a session.** `VITE_PREVIEW_ROLE=admin` supplies a *role* only
  (`authSlice.js:118-166`: `resolveRole`, "the SESSION stays exactly what it really is: anonymous"). Measured:
  `{user: null, tier: "premium", role: "admin"}`, and the dossier offered only the sign-in nudge
  ("We'll save your dossier as soon as you're in."), so the library — and therefore the realm — is unreachable
  under the persona alone. The chair's brief assumed otherwise; this is the correction.
- To reach the signed-in arm I used **the product's own local-mode door**, the one its e2e suite uses:
  `localStorage['settlement_mock_auth']` read by `auth.js mockGetSession` when `isConfigured` is false
  (`e2e/flow-c-save-journey.spec.js:87-92`). No credentials were entered, no account was created, nothing was
  sent to any server, and the tree has no Supabase configuration. Saves and campaigns round-trip through
  `dnd_settlement_saves` and the local campaign cache in the preview browser's own storage.
- Store reads were `window.__store.getState()` (a DEV-only global on the tip) — reads only; every state change
  in the walk came from clicking the product's own controls.
- No `src/` or `tests/` file was read-modified; no git mutation beyond the brief's own
  `worktree add --detach`; no gated run (no vitest, eslint, typecheck or build). The three node probes are plain
  `node` on scratch scripts under `$SP/lane-fix-p2-scratch/`.

**Artefacts:** `receipts.md`, `golden-id-probe.mjs`, `mapdress-namespace-probe.mjs`,
`same-seed-other-config-probe.mjs`, `vite-5233.log`, `vite.pid` — all under
`$SP/lane-fix-p2-scratch/`.

**Server teardown, executed at Sun Sep 20 05:15:52 EDT 2026:**

```
recorded PID: 33074
33074 npm exec vite --port 5233 --strictPort --host 127.0.0.1
PID 33074 is gone
no listener on 5233
```

Only that PID was killed (no `pkill`). The read tip is clean afterwards: `git -C $SP/read-tip-5a3380e8d
status --short` prints nothing, `log -1` is still `5a3380e8d`. The copied `.env.development.local` and the
`node_modules` symlink are both gitignored, so the worktree carries no stray row.

---

## 7 · ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. **`mapDress` is the whole of N1, but the same question should be asked of `fabricScarsOf` / `fabricRebirthsOf`**
   (`townMap/fabricRead.js`), which read the urban-fabric mirror off the settlement while the siege read goes to
   the realm. Slot: when N1 is cured, check whether the mirror is written under a save-id or settlement-id key.
2. **`campaign.regionalGraph.nodes[].settlementId` is persisted and read by nothing** (census in §1.3). Slot:
   either give it a reader (it is the only place the realm records which *world* a node holds) or drop it from
   `normalizeNode` — a persisted field with no reader is a future false lead, exactly the one that produced F2.
3. **The realm happily mints trade between a town and its own twin.** R6: `channel.trade_dependency.<A>.<B>.salt`
   plus `export_market`, `trade_route` and `migration_pressure` between two byte-identical Mossgates, and both
   rails read "Niederstadt · village · 692" twice with nothing to tell them apart. Not an id defect — a
   legibility one. Slot: a realm-side notice (or a disambiguating suffix at placement) when two members share a
   `settlement.id`; the datum is already on the node.
4. **`findTargetSave` (`region/graph.js:409-418`) falls back to NAME matching** — `saves.find(s => s.name === name
   || s.settlement?.name === name)`. Two same-seed members share a name, so a neighbour link that resolves by name
   binds to whichever twin sorts first. Slot: measure whether a persisted `neighbourNetwork` link can reach that
   branch (its writer stores a save id, so the branch may be legacy-only) and refuse the ambiguity if it can.
5. **`forkSeedFor` truncation and repeat-fork identity (N2)** belong to FIX-P1's brief — REVIEW-P noticed-item 8
   already has the truncation; the repeat fork by one identity is not in it. Slot: extend FIX-P1's charter line
   to both.
6. **`TIER_GATE.anon.preGenOptions === false` — is the exact-seed door actually hidden from an anonymous
   visitor?** Only `authSlice.js:873` consumes the flag; I did not walk the anonymous /create Advanced panel.
   Slot: one anonymous check; it decides whether N3's draft-slot shape is live or latent.
7. **The anonymous draft envelope survived a reload *into a signed-in boot*** — after seating the mock session,
   `/create` came back holding the anonymous Niederstadt draft (`draftOrigin: 'anon'`, `auth.user` set). That is
   REVIEW-P noticed-item 1's neighbourhood from the other side. Slot: walk `persistMerge`'s adoption rule for a
   boot that has a user and an envelope.
8. **The "Exact seed" field is inert for the main "Generate Draft" button.** Typing a seed and pressing
   *Generate Draft* silently generates a fresh random seed; only the field's own *Forge seed* button (or Enter,
   which did not fire for a synthetic keypress in my driver) honours it. Two of my three attempts lost the typed
   seed with no notice. Slot: either disable Generate Draft while the seed field is non-empty, or have it forge
   the typed seed; today the field looks like a config input and is not one.
9. **`galleryImportSettlement` keeps the sharer's `settlement.id` while stripping `_seed`** (§1.4), so an imported
   dossier carries a foreign identity that can never be re-derived, and two importers of one gallery page hold the
   same `settlement.id`. Slot: decide whether an import should re-mint (it would need the `contentId` branch) or
   keep — and write the answer next to the `if (!out.id)` guard, which is where the decision actually lives.
10. **`liveNeighbourEngagements` seeds the live conflict RNG with `_seed ?? id ?? name`
    (`neighbourBackLink.js:197` → `stableIdOf`), so a settlement paired with its own twin seeds
    `xconflict:S:S:<rel>`** — a pair identity that is its own mirror. Slot: measure what a self-mirrored pair
    renders before the editor's neighbour surfaces ship.
