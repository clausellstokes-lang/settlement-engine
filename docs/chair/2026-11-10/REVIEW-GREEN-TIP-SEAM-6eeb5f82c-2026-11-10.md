# REVIEW — GREEN-TIP's delta and the seam with PULSE-SITES (read-only reviewer, 2026-11-10)

> **Filed by the chair** (session `session_01FbPLbejcfwX5nii12VM673`) from the reviewer's two messages of 2026-11-10 08:45 and 09:18 UTC. The reviewer's own report file lives in its scratchpad and could not be pushed (the seat was read-only), so this is the chair's transcription of the messages; the wording is the reviewer's except where a bracket says otherwise. **Verdict history:** CLEAR at 08:45 under the owner's re-scope; changed to BLOCK on item (4) by the addendum at 09:18 (four reds that neither lane names). The chair's rulings on both are in `docs/chair/2026-11-07/ODQ-934.105-DRAFT.md`.

Reviewer session `session_01FbPLbfrUCWquFmqxL5ejLi`. Nothing in the repository was changed: no commit, push, branch or file in the checkout. All work ran in a scratch clone with detached worktrees (one shared `npm ci`; the lockfile is byte-equal on all five refs).

Trees measured, each by the same probes:
- **master** `db832c892` · **base** `bf14617ca` · **line** `f0f98d883` · **gt** `6eeb5f82c`
- **M** = line `f0f98d883` + GREEN-TIP `6eeb5f82c` + PULSE-SITES `dbaa54418`, the reviewer's own scratch merge.

Corpus: the soak corpus (`scripts/audit/soak-review/corpus.mjs :: birth`), the one the veil tests use. Each town is advanced alone through `simulateCampaignWorldPulse` (one-week ticks, `commit: true`).

## VERDICT (08:45): CLEAR to merge the two lanes as ONE batch, under the re-scoped rule

One item was still open: the full-suite red list at the merged tip (the addendum below).

| Block item | Result | Evidence |
|---|---|---|
| (1) Load and migration byte-identical, base → tip | PASS, CONFIRMED | 134 legacy records (67 master-made v1 saves, each at birth and after 3 master ticks) and 120 fresh births: `migrateSettlementToLatest`, `normalizeSettlement`, the v1→v2 step alone, and `toPublicSafe` of each result hash equal at `bf14617ca` and `6eeb5f82c` (254 rows, 0 differ), and equal again line `f0f98d883` vs merged (254 rows, 0 differ). All 134 reach schemaVersion 3, normalize twice is a fixed point, 0 errors |
| (2) Generator | PASS, CONFIRMED | Fresh births byte-identical base → tip and line → merged on 120 towns, 20 per size across the six sizes, with their public projections. `generatorGoldenMaster` green at the merged tip. `foodLandOf` is a pure move (section 5) |
| (3) Pins | PASS | None loosened; each is still an exact equality. Three proved by the reviewer's own plants (section 5) |
| (4) Build, boot, lazy edge | PASS, CONFIRMED | On a clean copy of the merge: `npm run build` exit 0; `boot-smoke: stage 2: 596/596 chunks initialised … PASS — the built bundle boots.`; `engineCoreLazyEdge` green |
| (4) Reds neither lane names | see the addendum | Known reds at the merged tip: the walker's 11 stale rows (PULSE-SITES names them; green once removed), the three register conflicts (the merge seat's union), and `dossierProseManifest`'s two drift titles, which are red on the line alone with the same titles |

**The two lanes must land together.** GREEN-TIP alone leaves exposeCorruptionNpc red; PULSE-SITES alone carries 11 rows that only GREEN-TIP's cures make true.

**Everything F-numbered below is REPORT-ONLY under the re-scope**, for the simulation's own program. Under the original brief F1 was a BLOCK by the letter of the chair's rule; it needs the event layer or the pulse, so it no longer is. One caution on scope: F2, F3 and F8 are reachable only through the pulse or the composer, but F5's class (a public card named after a criminal power) and F8's `killNpc` line already sit on the line, so they predate this batch either way.

## Findings, ranked

| # | Rank | Finding | Status | From the batch? |
|---|---|---|---|---|
| F1 | HIGH (report-only now; a BLOCK under the original brief) | An exposure publishes the ousted card's veiled membership on the power's public row | CONFIRMED | Yes, the seam |
| F2 | HIGH | A hidden power's name is unmasked once its row is folded or dissolved; client and SQL agree | CONFIRMED | No. The line does it to every infiltrated town on tick 1; the batch narrows it |
| F3 | HIGH (the chair's ruling) | Faceless-at-birth powers are deleted on the first tick: 43 powers in 42 of 400 towns, Dominant ones included, with a false reason | CONFIRMED | Generation-side; the batch reduces it from 156 to 5 per 60 towns |
| F4 | MEDIUM-HIGH | A raw v1 record in the cured pulse loses 187 of 254 powers; a paused advance resumed after the deploy feeds exactly that | kernel CONFIRMED, store route PLAUSIBLE | Yes: the line and master tolerate raw v1 |
| F5 | MEDIUM | The pulse's founder of a criminal power is a fully public card named after it | CONFIRMED | No (the line and master name it the same) |
| F6 | MEDIUM | Two "first-rank" readers disagree on 93 of 1,793 born cards | CONFIRMED | Yes, the seam |
| F7 | MEDIUM | One key NPC's death now impairs up to 35 institutions (0 on the line) | CONFIRMED | Yes (GREEN-TIP P3; declared as "the edge fires") |
| F8 | MEDIUM | References to dead and ousted cards persist, some on public projections | CONFIRMED | No |
| F9 | LOW | The walker is red at M with exactly the 11 CURED-ON-LANE rows; three register files conflict | CONFIRMED | Declared merge-seat acts |
| F10 | LOW | Beat grammar "the The …"; successor has no `title`; `corrupt: false` is still written; the swap leaves ranks alone | CONFIRMED | Mostly older |

---

## 1. The veil on what the pulse writes

### F1. An exposure publishes a veiled membership (CONFIRMED; new at the seam)

**Mechanism.** PULSE-SITES re-pointed `corruption.js :: npcHomeInstitution` to the card's first-rank power. GREEN-TIP routed both exposure sites through it (`mutateEntities.js :: exposeCorruptNpc`, and the organic exposure in `npcAgency.js :: advanceNpcCorruption`). On the line the home read `factionAffiliation`, which no current card carries, so it was null and no home impairment was written. In M the home is a power, and the impairments land on its public row.

**Executed.** `EXPOSE_CORRUPTION` on soak1k-3's "the madam", Tariq al-Hassan. The card is a public house face; its first membership is `{"power":"Thieves' Guild","rank":3,"share":0.6,"veiled":true}`. New public mentions after the event, by tree:

- line: `activeConditions[1].causes[0].detail` "…publicly exposed as corrupt and ousted." and `institutions[31].impairments[0].description` "Exposure of Tariq al-Hassan disrupted Street gang."
- M, in addition:
  - `$.powerStructure.factions[0].impairments[1].description :: Tariq al-Hassan's corruption scandal tarnished Thieves' Guild.`
  - `$.powerStructure.factions[0].impairments[2].description :: Tariq al-Hassan's network inside Thieves' Guild is now public knowledge.`

The same holds for soak1k-9 (Zi Chen) and soak1k-15 (Fuad al-Aziz, Corrupt Council).

**Organic, with no DM act.** soak1k-9 advanced 3 natural ticks in M: the pulse ousts Zi Chen and `toPublicSafe` of the advanced record carries "Zi Chen's network inside Thieves' Guild is now public knowledge." At birth that card's public memberships were `[Merchant Guilds]` only.

**Frequency.** Over 60 towns and 12 ticks, M ousts 11 cards organically (line 7, master 0). One of the 11 published a veiled membership.

**Smallest cure.** In the exposure path, when the home power is veiled (`isVeiledPower(row)`, or the card's membership in it has `veiled !== false`), either skip the two home impairments or stamp them `covert: true`. `publicSafe.js :: sanitizePublicValue` and migration 142's SQL already drop a covert object whole. Add one red-first on soak1k-9.

### F2. A hidden power's name is unmasked once its row leaves (CONFIRMED; older than the batch)

**Mechanism.** `publicSafe.js :: hiddenPowerNamesOf` (and 210's SQL) build the mask from the rows currently stamped `hidden: true`. The fold (R9) and the dissolution (R18) delete the row, so the name stops being masked wherever else it stands.

**By tree, over the 7 infiltrated towns of soak1k-0..399** (113, 183, 214, 242, 321, 334, 389; 9 hidden powers):

| tree | natural ticks | result |
|---|---|---|
| master | birth | all 7 show the name (production has no veil) |
| base and line | tick 1 | all 7 leak: the hidden bloc is dissolved with everything else |
| M | 12 ticks | 0 leaks, 0 dissolved; client equals SQL at birth and at tick 6 |

**Forced on M, two triggers:**

- *Kill the face, then tick twice* (`KILL_NPC` on the "bloc's speaker"). All 7 towns dissolve the hidden power ("faction_dissolved: Temüriin: the The Independent Bloc is no more"). The name then appears at:
  - `$.stress.cast.stakes[4].factionId :: The Independent Bloc` (and the `stressors` twin);
  - on soak1k-242 also `$.powerStructure.factions[0].rivals[1]`.
- *Decline* (tier forced to thorp, 4 ticks). The fold picks the hidden power first in 5 of 7 towns: it is the weakest non-governing seat. soak1k-389 leaks "The Grey Council" at `$.conflicts[0].parties[1]`, `$.conflicts[0].desc`, the `powerStructure.conflicts` twins and the stakes.

**Twins.** Through 210's net-current `_gallery_sanitize_public_json` in pglite, client and SQL are canonically EQUAL on all 37 states (birth, t6, kill, kill+2, fold, expose), including the leaking ones. The twins agree; the hole is in the shared rule.

**What did not leak.** The cards. A folded hidden face keeps `institution.veiled: true`, so its public card shows no title, role or memberships. The composed public prose (`composePublicProse`) carried no hidden name in any state.

**One side effect of the fold ruling.** Folding hidden "The Grey Council" into the public "Democratic assembly" turns five public-house faces' veiled memberships into public ones (`{"power":"Democratic assembly","rank":null,"share":null,"veiled":false}`). No hidden name is shown, but the DM's secret roster becomes public members of the hall.

**Smallest cure (the chair's ruling).** One of:
- (a) R9 and R18 never remove a row stamped `hidden`;
- (b) the removal leaves a tombstone the mask reads, for example `powerStructure.formerHiddenPowers: [name]`, in both twins;
- (c) the removal scrubs the name from `rivals`, `conflicts` and `stress.cast`.

(a) is one predicate in `densityCadence.js :: planDensityCadence` and one in `factionLifecycle.js`.

### The other writers (CONFIRMED clean)

- **Cadence founder and ADD_FACTION founder.** The membership is stamped with the row's own bit, for example `{"power":"Shadow Interests","rank":null,"share":null,"veiled":true}`. `ADD_FACTION` ignores a payload `category` or `hidden`, so it cannot mint a veiled power. See F5 for the name.
- **Successor.** Per-entry bits are copied. soak1k-3's successor publishes `memberships:[Grain Holders]` only; the veiled Thieves' Guild entry is withheld, and `institution` and `role` show only where the house is public. Checked on 7 towns.
- **Natural advance, 67 towns × 12 ticks on M.** 0 hidden names on `toPublicSafe`, 0 public memberships in a veiled power, 0 title or role on a veiled card, and 0 in `composePublicProse` or in the projection with the prose attached.

### F5. The founder of a criminal power is a public card named after it (CONFIRMED; not a regression)

The cadence founded "Shadow Interests" (category criminal) in 3 of 60 towns on tick 1. Its founder is `id: npc.the_shadow_interests_founder_…`, `name: "The Shadow Interests Founder"`, `role: "Head"`, `institution: null`. With no `institution` record the veil reader answers 'none', so the card is fully public apart from its memberships. A born criminal head, by contrast, gets an opaque `npc_veiled_…` id and loses title and role.

Master and the line write the same name, so it is not a regression. GREEN-TIP rewrote this writer and gave the membership its veil bit but left the name, id and house unveiled.

Cure: the founder writers stamp `institution: {kind:'power', key, title, veiled: isVeiledPower(row)}`, and for a veiled row use `veiledCardIdFor` and a personal name.

## 2. Saved records

**Shape (CONFIRMED byte-shape-equal).** Every cured writer goes through `cardVeil.js :: membershipInPower`, which `migrateV1toV2` now calls too. For the same fact (a founder of Shadow Interests):
- a master-made founder after migration: `"memberships":[{"power":"Shadow Interests","rank":null,"share":null,"veiled":true}],"institution":null`;
- the cured pulse's founder on M: the same keys in the same order with the same values.

The fold writes the same object for the absorbing house; a card already in that house keeps its entry. The successor copies the ousted card's `memberships` (ranks included) and `institution` verbatim.

**Retired fields (CONFIRMED).**
- 67 towns × 12 ticks on M: 0 cards carry `factionAffiliation`, `linkedFactionIds`, `secondaryAffiliation` or `densityRungRole`. Base carries 692 card-ticks, master 7,230.
- A grep of `src/` outside the migration finds the two writes the seat named. Neither reaches a saved record:
  - `applyDensityLaw.js :: assignRoster` is called only by `disperseNamedRoster`, which has no caller in `src/`;
  - `pdf/lib/viewModel.js`'s key is a PDF view row.
- Still written by `successorNpc`: `corrupt: false` (v3's retired mark) and `timesExposed: 0`. The seat declared the first.
- `swapNpcStanding` stamps `factionId` on both cards. That is older behaviour, but `npcAgency :: factionIdFor` reads `factionId` BEFORE the membership.

**A legacy record through the cured pulse (CONFIRMED).** 67 master-made records (schemaVersion 1; 703 cards, 254 powers), each at birth and after 3 master ticks:

| path | cards kept | affiliations kept | faceless after | dissolved |
|---|---|---|---|---|
| load path (`normalizeSettlement` → v3), then 12 cured ticks | 703 of 703 | 703 of 703 as memberships | 0 | **0** |
| raw v1 straight into the cured pulse, 3 ticks | 703 | none read | — | **187 of 254 on tick 1** |

- On the load path, 80 `secondaryAffiliation` values that name no power are reported in `migrationReports` ("criminal network", "Smuggling operation"…), per the migration's rule. Nothing else is lost. The master-advanced records give the same result (709 of 709 cards, 0 dissolved).
- On the raw path the record stays at schemaVersion 1: the pulse does not migrate.
- Every stored save is normalized on read (`lib/saves.js :: migrateSettlementShape`, both backends), so the ordinary path is the safe row.

### F4. The raw path is reachable through a paused advance (kernel CONFIRMED; store route PLAUSIBLE)

`campaignAdvanceSession.js` persists a paused interval's cursor in `campaign.worldState.pausedAdvance`. It holds `preSnapshot.saves` (resume fuel) and `preIntervalUndo` (every member save), written by whichever build paused. The resume passes `preSaves: pre.saves` to the kernel. The reviewer found no normalization on that path: a grep of the three store files shows none.

So a DM who paused on production and resumes after the deploy would re-derive the paused tick from v1 clones and commit the dissolution of every non-ruling power in each member town. The same applies to Undo from the parked snapshot followed by an advance in the same session.

The line and master read `factionAffiliation` and tolerate this; the batch removes that tolerance. The reviewer did not drive the store end to end. Under the re-scope this needs the pulse, so it is report-only.

Smallest cure: migrate at the pulse's door (`worldSnapshot`'s save read, or the head of `simulateCampaignWorldPulse`, for any record below `SCHEMA_VERSION`), or normalize `pre.saves` and the parked undo at resume.

## 3. The five dissolutions (F3)

**Which.** soak1k-2 "Occupation Authority", -22 "The Old Houses", -25 "People's Council", -39 "Quarantine Council", -55 "Religious Authorities". Over soak1k-0..399 there are 43 faceless powers in 42 towns (10.5%): War Council 9, Religious Authorities 6, People's Council 4, Military/Guard 4, Thieves' Guild 3, The Old Houses 3, Occupation Authority 2, Quarantine Council 2, and others.

**They are not minor.** People's Council holds power 53 "Dominant"; soak1k-55's Religious Authorities holds 75 "Dominant", the strongest power in the hamlet. Most are the stress's own actor: the occupier in an occupied village, the quarantine council in a plague town.

**Why faceless.** Generation-side. The cast gives a power members only through the houses that back it (R-P5); a power no house backs is born with none. The hidden infiltrator is not faceless because the seam mints it a "speaker". This is R17 ("NPC-less factions are unrepresentable at birth on every generation path") broken at birth.

**Master.** The same R18 rule exists and never meets such a power: 0 of 254 master-born powers are faceless, because the old generator affiliates a card to every power. Migrated master saves are also at 0, so **existing users lose nothing; newly generated towns do, once the pulse runs.**

**What the reader sees on tick 1.**
- A wizard-news beat: "Copanucan: the Occupation Authority is no more — The last named figure of the Occupation Authority is off its roster … the last named figure left the roster (death, exile or removal)". That is false: nobody was ever on it.
- On soak1k-55 the same tick prints "Religious Authorities is pressing a challenge to the government" and "the Religious Authorities is no more".
- The row is gone from the Power tab.
- The record keeps 2 to 14 dangling mentions per town: `rivals[]`, `factionRelationships[].pair` and `.narrative` ("Occupation Authority no longer takes orders from Elected Reeve…"), `stress.cast.roles` and `.stakes`, NPC goals ("Leave Occupation Authority holding nothing…"), and `worldState.factionStates`. Most of these are public too.

**Is data lost?** Yes: the power's row (name, description, power score, category) is deleted from the saved record on the first advance. The beat's "its grudges and its receipts stay on the record" holds only as dangling strings.

**Smallest cures.**
- Generation: mint a face for any power the cast leaves with none. The seam's `other` mint already does this for the infiltrator.
- Pulse, as a stopgap that also covers saves already made on the line: R18 dissolves only a house that has at least one card off its roster. That makes the beat's own sentence true. It is one predicate in `factionLifecycle.js`: "no member at all" reads as *unrepresented*, not *emptied*.

## 4. KILL_NPC 0 → 60 and clergy 25 → 28

**Why 0 on master and base.** The edge is `propagate.js :: findLinkedEntities`' NPC → faction hop, which read `linkedFactionIds`. Master's generated cards never carry it: 6 of 709 cards in the reviewer's master records do, all pulse founders. Current cards do not either. So the hop was unreachable for a generated card on both trees. P3 re-points it to the memberships, so it now fires for every card with a membership. Nothing else changed its reach.

**One firing end to end** (M, soak1k-5, `KILL_NPC` on Jambavati Banerjee, key, "the house boss"; memberships Thieves' Guild rank 3 veiled and Merchant Guilds rank 2):
- *The card:* `status: 'dead'`, `removedByEventId`, memberships and ranks unchanged.
- *Direct impairments on both power rows:* "membership@0.7: Jambavati Banerjee is gone: ranks affected." These are already written on the line and base by `entities/npcs.js :: killNpc`, which reads memberships there; they are not the batch's.
- *New in M:* hop 2 writes "staffing@0.189: Propagated from faction "Merchant Guilds" (membership → staffing, hop 2)" onto **35 institutions**, against 0 on the line. Across 8 sampled kills: 15, 35, 0, 1, 28, 3, 0 and 6 institutions. This is F7: designed, but dark until now, and wide in a metropolis.
- *Lifecycle:* the dead card is off the roster. If it was the last member the power dissolves on the next tick (F2's trigger).
- *No successor:* KILL_NPC mints none, by design.

**F8, references afterwards (CONFIRMED; older than the batch).**
- The dead card stays in the public `npcs[]` with no status (the public allowlist has no `status`), and its ties stay.
- soak1k-15, -39 and -46: three ticks after the governing head is killed, `composePublicProse` still prints "Jabir ibn Khalid, the first councillor, holds the seat of the Corrupt Council."
- The line already publishes "X is gone: ranks affected." on a criminal power's public row for a card whose membership there is veiled. That is the same class as F1, from `killNpc` on the line, with identical output at base, line and M. It is outside this batch but belongs in the same cure.
- Organic ousts remove the card but leave its ties: soak1k-46 and -59 each keep 2 ties to a removed id, one of them public, naming the ousted with no card behind it. The successor inherits no tie.

**Clergy (CONFIRMED by lifecycle arithmetic; `readClergyPlane` not called).** The 25 at birth is the generator's: 25 of the 60 towns are born with a crewed religious power, and base shows 25 at birth too. Base falls to 4 because its tick 1 dissolves them. The +3 on M is the cadence founding "Devout Assembly" in soak1k-44 and -52 at tick 1 and -59 at tick 7. That is the same thicken rule that takes master 0 → 2 → 3.

## 5. The re-keyed pins

| pin | exact still? | stated mover | the reviewer's check |
|---|---|---|---|
| `institutionBudgetPromise` (60 digests) | Yes: `expect(moved).toEqual([])` over 60 whole-record hashes | 27 lane merges, "none the budget" | CONFIRMED: no commit in `8308f13f8..bf14617ca` touches `src/data/institutionBudget.js`. CONFIRMED live: the mock planted at 1.25 turns it red. Per-stage counts PLAUSIBLE (not re-measured) |
| `x46NpcBand` dark digests | Yes: exact per-seed equality | 23 merges | Stage shas exist and are the named merges. Counts PLAUSIBLE |
| `editWorldFactResources` (6 digests) | Yes | "re-captured by the same plant" | CONFIRMED by the reviewer's own plant: with `dde845c15^`'s `resolveResources.js` (sha256 `62e16d59…`) over the lane tree, A2 and A6 stay green and A1 and A3 go red, so the feature is convicted and the no-edit path is unmoved. Restored: 6/6 |
| `composeStateProse` DS-POW-1, 72 → 60 | Yes: `toEqual(DECLARED_APART)` | `bf718398e` inside `c6e8a4ad6` | Commits exist as named. The mover is PLAUSIBLE (72 not re-measured at `2482faa60`) |
| `DECLARED_GROWTH_CEILING`, 10 → 12 | Zero slack: the register holds exactly 12 attributed rows (6 + 6) | relocation | CONFIRMED: a 169-line block of `foodLand.js` is line-identical to the lines removed from `foodGenerator.js`; the inventory moves 48 → 41 + 7 and 5 → 1 + 4 |
| `editCorpusRatchet` A3/A4/A7/A8 | Not inspected beyond the diff | merge wave | Sampled, not swept |

None is loosened: each still fails on any moved byte. The standing caveat is the one the seat states: a digest re-captured from the current tree certifies "unchanged since capture", and its link to the original promise rests on the per-stage attribution.

## 6. The seam

**The merge itself.** No source conflict. Three register files conflict (CONFIRMED): `tests/lint/.source-citation-baseline.json` and `sourceCitationIntegrity.walker.test.js` (both lanes), and `.lighting-census-baseline.json` (PULSE-SITES). The reviewer resolved all three to the line's side, so those walkers are the merge seat's union and refreeze.

**Suites at M** (`sh scripts/gate-tail.sh npx vitest run` over the walker, `engineCoreLazyEdge`, `tests/domain/events`, `tests/simulation`, successorNpc, densityLaw, worldPulseFactionSeating, factionRefContract): 50 files, **608 passed, 1 failed**, gate exit 1.

- The one red is `noLegacyFactionReaders.walker` > "the scan of src/ equals the named list exactly (shrink-only)": "a STALE row … expected [ …(11) ] to deeply equal []". The 11 are PULSE-SITES' CURED-ON-LANE rows, and they match GREEN-TIP's cures by file and line:
  - factionLifecycle:117
  - propagate:350
  - mutateEntities:505, 751, 895, 896, 918
  - factionDensityKernel:640
  - npcAgency:302, 825
  - successorNpc:37
- No unlisted read was found. This is the declared merge-seat act: remove the 11 rows, count 19 → 8. CONFIRMED in a second scratch copy: with exactly those rows removed the walker is 4/4 green, gate exit 0.
- `exposeCorruptionNpc`: green at M (3 files, 9 tests passed with `engineCoreLazyEdge` and `killNpcDoubleImpair`); red on gt alone (1 failed, 2 passed), as claimed.

**The swap (CONFIRMED agree).** The handler and the affordance both read `firstRankMembershipOf(card, powerOrderOf(settlement))`. Over 60 towns the gate is available in 54 and a same-power pair exists in the same 54. Every offered swap changed the record (`importance`, `structuralRank`, `factionId`, sometimes `influence`); none was a no-op and none was vetoed.

Note: the swap never touches `memberships[].rank`, so the card line still reads "first of X" for the demoted head. That hollowness is older than the batch.

**F6, a second first-rank reader.** `npcHomeInstitution` calls `firstRankMembershipOf(npc)` with no power order, so ties break by array order. GREEN-TIP's seat and swap readers pass the order. On the 60 births, 93 of 1,793 cards resolve to a different power under the two; in 11 the two answers differ in veil. The exposure's home therefore lands on a different power than the one the pulse seats the card in.

Cure: thread the settlement's order into the exposure sites. It folds into F1's cure.

**The sanity table (CONFIRMED on all four trees, 60 births):**

| measure | master | base | line | M |
|---|---|---|---|---|
| born powers surviving t1 / t12 | 215 / 215 | 60 / 60 | 60 / 60 | 211 / 211 |
| founded / dissolved on tick 1 | 5 / 0 | 40 / 156 | 40 / 156 | 5 / 5 |
| founded / dissolved over 12 ticks | 6 / 0 | 70 / 156 | 70 / 156 | 6 / 5 |
| organic successors over 12 ticks | 0 | 7 | 7 | 11 |

**Golden and manifest at M.** `generatorGoldenMaster` green. `dossierProseManifest` has 2 failed of 20 ("THE DRIFT CORPUS CARRIES FOUR SEEDS…" and "THE DRIFT ARM: no row added, no row removed, no row moved", 1,050 rows); the line alone fails the same two titles, so they are the line's.

## 7. Anything else

- **Behaviour lit against master:** organic oust-and-replace (0 → 11; the line already has 7), the hop-2 institution impairments (F7), the home impairments (F1), and real seating.
- **Shape:** a fold-moved minted face keeps `institution: {kind:'power', key:<the folded power>}`, a house that no longer exists. It is harmless to the veil (fail-closed) and stale on the DM's card.

## Limits

- **Not run:** `verify:dist`, the first-paint ceilings, `writerReach`'s door, e2e. Build and boot were run (verdict table).
- **Legacy corpus:** the 67 legacy records are master-generated v1 saves; no real production saves, and no hand-edited or DM-authored legacy shapes beyond what master's pulse writes (founders with `linkedFactionIds`).
- **Sampled, not swept:** hidden-power veil on 7 towns (all the infiltrated ones in soak1k-0..399); kills on 14 cards; exposures on 7 to 10; legacy on 67 master records; pins as in the table. Towns were advanced one per campaign, so no cross-town pulse paths (war, occupation, migration) were exercised.
- **PLAUSIBLE only:** the paused-advance store route (F4), the natural frequency of a decline fold (F2), and the per-stage movers of the digest re-keys.
- **Environment:** the checkout is shallow. The reviewer deepened its scratch clone from the same remote to read the stage commits; the checkout was not touched.

---

## ADDENDUM (09:18 UTC): the full suite at the merged tip — THE VERDICT CHANGES TO BLOCK, on item (4) only

Items (1), (2), (3) and build/boot/lazy-edge stand as PASS.

Full `npx vitest run` at M (line f0f98d883 + 6eeb5f82c + dbaa54418): 38,772 tests, 46 failed in 25 files (exit 1). The reviewer re-ran exactly those 25 files on a clean copy of the merge, on the line alone, and the suspicious ones on each lane alone and on GREEN-TIP's base.

**Four reds that neither lane's record names. All four are red on GREEN-TIP alone and green at its base `bf14617ca` (CONFIRMED):**

| Test | At base | On GREEN-TIP and at the merge | What it says |
|---|---|---|---|
| `tests/domain/warH2VerdictComposition.test.js` | 5/5 green | 4 failed of 5 | The fixture still expects the successor to carry `factionAffiliation: "Crown"`; GREEN-TIP's successor no longer writes it. A retired-vocabulary fixture the lane did not re-key |
| `tests/property/heraldKnowledgeDeskGolden.test.js` | green | 1 failed: "THE REFILE MOVES NO CONTENT BYTE, AND EXACTLY THE DECLARED ITEMS CHANGE DESK" | A recorded golden's `contentSha256` moved (`eb569068…` expected; `b112d393…` on the lane, `a89eda1e…` at the merge). The record says none of its 51 golden files moved; this one did, unsigned |
| `tests/lint/newsVoiceContract.walker.test.js` | 8/8 green | the suite throws, 8 skipped | `Error: Wizard News homes drifted: expected 43, got 44` (`scripts/lib/news-voice-contract.mjs :: reconstructWizardNewsIntroductions`) |
| `tests/lint/newsHeadlineContract.walker.test.js` | 2 failed (the line's own rows) | the suite throws, 8 skipped | The same throw, so the file's other six arms no longer run at all |

The first is a one-fixture re-key. The other two need the lane to say why: the golden goes through its door with a cause, and the 43 → 44 home count is re-declared or the new home found. All sit on the simulation's surface, but the gate admits no failing test, so they stop the merge until cured or named.

**One more merge-only red not attributed to a named door:** `tests/lint/proseWiringCensus.walker.test.js`, 2 failed ("the committed census is byte-identical to a fresh build, and the stamp is live", "THE DRY READ"). Green on each lane alone and on the line; GREEN-TIP edits `docs/content/wiring-census.json`, so it reads as a refreeze the merge seat owes, but neither record names it.

**Named, or the line's own (nothing beyond what is already declared):**
- Named by a lane: `landingFixtureFreshness` (2), the four edge-bundle freshness and reproducibility files, `writerReach` (10), `observedShapeReaders`' erasure guard, `sovereigntyLightingContract`, `sourceCitationIntegrity`, and the walker's 11 stale rows (green once removed).
- Same failures on the line alone: `deepCraftKillList`, `institutionBudgetPromise`, `dossierProseManifest`, `editCorpusRatchet`, `proseFamilyContract`, `proseRegisterLoaders`.
- Environment (shallow clone, no ledger branch): `ledgerCitationIntegrity`, `provenanceMap`.
- Green on the clean copy, so artifacts of the reviewer's probe files or load: `mutationCoverageManifest`, `pgliteHookTimeoutRatchet`.

Note on `institutionBudgetPromise`: green on the lane, red at the merge and on the line alone — the sixty have moved again on the line since GREEN-TIP's re-key, so that re-key must be repeated at the merged tip.

Limits: the base comparison covered the four files above, not the whole suite; the per-lane comparison covered five files.
