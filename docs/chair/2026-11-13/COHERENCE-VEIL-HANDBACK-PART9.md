# COHERENCE-VEIL — hand-back, part 9: the eighth seat (the twelfth and the thirteenth, cured in 212 and the client's twin)

Seat: COHERENCE-VEIL-8, lane `lane/coherence-veil-2026-11-11`, from **45317ee3f** (read back from origin first:
equal). Stopped by the chair's context check (22:43 UTC) after the cure in hand. Every database was a scratch
native PostgreSQL 16.15 cluster in this container (`/var/tmp/cv8sock`, trust auth, unix socket only) or an
in-process pglite. No hosted database, no production credential, no `supabase db push`, no `migration repair`,
no deploy, no golden's door. **Nothing was applied anywhere but those local databases.**

**TIP:** the commit carrying this file, read back from origin.

## 0. The bytes

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN, untouched) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN, untouched) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` |
| `supabase/migrations/212_share_veil_later_cures.sql` (this seat's last bytes) | `377cc61daf0916fbc769bd34fb5d4383aebf5f630d43f9e0207bb14f937e0733` |
| `supabase/rollback/212_share_veil_later_cures.down.sql` | `6a642ad048d1a5f6b73a7e9380a8349d05ccf922af016e647735c03068fbc66d` |

211's two checksums: proved at the first commit (996fd214e) and at this one. **212 at these bytes has NOT been
read by the security reader and its owner's pack (`veil-212/`) still describes the OLD bytes (`057e215c…`): do
not hand the pack to the owner.**

## 1. The homes, each with its cure and its proof

The guard is `tests/security/gallerySecondHomes.pglite.test.js` (planted markers letters-and-digits only; every
string and key folded; names in their own spelling and folded; six reads; DM off and on; live, frozen, and a
`houses` share with only the houses hidden and every other eye opened; both stored shapes; **the client's twin as
a read of its own**, V6-2). At this tip: **3 of 3, server and client** (`veil-probe-8/out/guard-after-d.txt`).

| Home (the chair's class) | 212 (server) | Client twin | Red first → green |
|---|---|---|---|
| N1 the twelfth: `economicState.compound.inst.names[]`, `…safetyProfile.compound.inst.names[]` (a)| 4157ea616 | ad85c0a66 | guard-red-at-45317ee3f → guard-after-twelfth (server); guard-a-red → guard-after-a (client) |
| N2 the twelfth: trace `targetId`, causes, in any spelling (a) | 4157ea616 | ad85c0a66 | the same |
| N4 a hidden house's name in fixed prose: income source label/desc, `safetyDesc` (a) | 98620a262 | ad85c0a66 | guard-after-twelfth → guard-after-N4; client as N1 |
| (a) ANYWHERE: the sweep (`_gallery_veil_sweep` / `sweepNames`): a person's goal, intent target id, `allegiance.house`, secret, role, title; the criminal houses' list; the public prose; `situationDesc`; joins and the town's name kept; open houses and SHOWN powers blanked | ad85c0a66 | ad85c0a66 | guard-a-red (server 516, client 1,034) → guard-after-a (0 names); the reviewer's `eleventh-hand.sql` green on 001..212 |
| (b) the five booleans, from the houses still listed | 370fa8391 | 370fa8391 | guard-client-flags-income-red → guard-after-b |
| (c) the criminal income row withheld whole where its groupings are shut | d1ed24d93, **its NULL bug cured 0978c9c26** | d1ed24d93 | guard-after-c; the bug: guard-c-null-red (2,320 open rows taken, server) → guard-c-null-fixed |
| (d) T1 a hidden event's lasting effect in `history.legacyAnnotations[].annotation` (case-blind embeds) | 2d4e62a66 | 1a2412716 | guard-T1-red → guard-after-T1; client guard-after-a → guard-after-d |
| (d) N3 a tie's copy of a role the person's public card withholds | 81350423d | 1a2412716 (`publicSafe.js :: toPublicSafe`) | guard-N3-red → guard-after-N3; client as T1 |
| PART 8's two red loaders (`galleryMapMemberCount`, `gallerySanitizer`) | — | — | d599a66bc, 5fbe9186a: loaders-red → loaders-after (47 of 47) |

Gates at every `src/` commit: `typecheck:domain:strict` 0 (1,113), `typecheck:ratchet` 0 (167), eslint 0, each
through `scripts/gate-tail.sh`.

## 2. NOT DONE (for the ninth seat), in order

1. **A RED PIN, MINE: `tests/security/galleryServerVeil.pglite.test.js`, 6 of 16 red** (`out/pins-at-1a2412716.txt`):
   "all+dm … gallery page changed: relationships[…].npc1Role / npc2Role" on six towns. The pin compares the live
   page with 210's page; N3's cut (both twins) makes the DM page show less, by the chair's ruling (d). Every fault
   is that one class; nothing else moved. To do: re-key that arm by identity (the ruled cut named as the one
   expected difference, every other path still equal), never loosened. The other 13 files of the run passed (262 of
   285 tests; the two loader files there ran before their cure).
2. Step 4's proofs at the final bytes: `veil-probe-8/planted8.probe.jsx` (with `RV8_HOUSES_ONLY=1`; the uncommitted
   `houses` mode is in this commit) on chains built from THESE bytes, both shapes, every read: expected 0 but the
   classed rows below; on the frozen 211 alone the exact half equals the review (proved at step 1: 62 row keys,
   `diff` empty). **Timing not measured for the sweep** (a full-document walk when a house is hidden whole; a
   first-word prefilter): measure against the earlier seats' figures before anything else.
   Page before/after (Vatanhiid's link and two more) not rendered.
3. Step 5: the lane's other pins against these bytes (V5-7's signature pin in galleryVeilCures counts helpers:
   212 now has fourteen new helpers, 54 `_gallery_veil*` in all); the lint registers (a new frozen record
   `HOUSE_FLAG_NAMES`, `SWEEP_KEEPS`, `CRIMINAL_INCOME_SOURCES` in `gallerySecondHomes.js` may meet `tuningRegister`).
4. Step 6: the owner's pack `veil-212/` rebuilt for the new bytes (the review's section 7 whole: V6-4's rollback
   order, V6-9's same-push). Step 7: the whole suite once, classed against PART 8's ten.
5. The rehearsal: 212 applied twice, its rollback to the frozen 211's catalogue (only spot-checked: 212 re-applied
   over itself on a local chain without error, each cure).

## 3. Rows left outside the law (the chair's line; for the security reader and the owner's veto, row by row)

- C1 the flags' own KEYS (`hasBlackMarket`…) and `safetyProfile.flags.*` (stress flags such as `arcaneBlackMarket`): vocabulary in every town.
- C3 `simulationTrace[].downstreamEffects[].target` `blackMarket`, `arcaneBlackMarket`: model field tokens.
- C4 a coherence note's sentence beside `powerStructure.recentConflict`'s own pool line (two pools).
- C5 `economicState.tradeDependencies[].detail` "permanent teleportation circle" (the catalog's own detail).
- The joined role word "the black marketeer" where its person is revealed (N3 cuts it where not).
- From REVIEW-VEIL-6 §2.5, by the chair's ruling: `powerStructure.stability` "pervasive organized crime";
  `spatialLayout.quarters[].desc`; `economicState.primaryExports[]` "Contraband goods"; `history.currentTensions[].type`
  "crime_wave"; `stress.cast.stakes[]` (powers shown). Not named by the sweep unless they hold a hidden house's name.
- Limits: a house renamed after birth keeps its birth name in the compound lists (only the current name is
  folded); Unicode case folds differ between PostgreSQL's `lower` and JavaScript's (`İ`, the Kelvin sign); the
  booleans' SQL table does not exclude custom content as `nativeSemanticNames` does.

## 4. Leaving

Refs and local config compared before every push: only `veil8` (this seat's worktree branch) and the remote-tracking
ref moved; `core.hooksPath=.husky/_` (npm ci) and the worktree's branch tracking were added to the shared local
config, as earlier seats found. A push hook once ran the whole check (no ref to push: the seventh seat had moved the
lane); it was stopped and the lane merged by fast-forward. The machine restarted once mid-run; nothing was lost.
Scratch at the session's scratch directory; the cluster at `/var/tmp/cv8`.

## 5. The rulings worked to (the chair, session_01FE9mEws7PXYRYdjQPbSX15, 2026-11-13)

> BRIEF-VEIL-8 (this seat's first message): red first with a wider eye; the cure in 212 (211 frozen); measure the
> flags; prove; pins; the owner's step; the suite. NOT the client's veil (withdrawn below for (a)–(d)).

> 21:40 UTC: THE LAW REACHES, and 212 AND THE CLIENT'S TWIN cure: (a) a hidden thing's NAME in any spelling,
> anywhere; (b) the five booleans sent as they would read from the houses still listed; (c) the criminal income row
> withheld whole; (d) a hidden person's role in a tie's copy and a hidden event's effect in the legacy annotation.
> THE LAW DOES NOT REACH a separate fact that does not name the hidden thing (a stability label, a quarter's
> description, an export, a tension's type, a shown power): list each row left. V6-2: the guard says where the
> twin is held or gains an arm (done: the client read). V6-4, V6-9: the owner's step takes the review's §7 whole.
> V6-3 not yours. V6-5: a sentence whose own home is open on the page is not a second home.

> 21:52 UTC: the two red loader files are yours, each at its cause, its own commit (done).

> 22:43 UTC: hand back by file now; 211's two files stay frozen; nothing applied anywhere.
