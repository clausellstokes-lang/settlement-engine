# Review: the PULSE-SITES delta, `5da82ea59..dbaa54418`

**Verdict: BLOCK.** One blocking finding: the PROMOTE and DEMOTE narration cure puts a hidden power's name, and a named person's tie to it, on the public chronicle. Nothing else in the delta blocks. The pulse itself is byte-identical base to tip at default flags in every town I ran.

Counts: 1 high (blocking), 3 medium, 3 low, and one exposure that predates the lane.

Reviewed: 13 commits, 22 files, read whole. Everything ran on file exports of the base and the tip in the scratchpad (no worktree registered, nothing staged, nothing pushed; the one repository action was the fetch of the lane ref you named). **CONFIRMED** = executed by me unless marked "read". **PLAUSIBLE** = mechanism traced, outcome not observed.

Limits, stated once: GREEN-TIP's half and the seam between the lanes are a second pass and are not judged here. I could not run the full hand-back gate (1,417 files), the build, or the PDF and Foundry exports.

---

## Findings, most severe first

### 1. HIGH, BLOCKING — the narration cure names hidden powers on the public chronicle

- **Where:** `src/domain/events/registry.js:807-810` and `:824-825` (the cure). The path out: `src/domain/events/eventPipeline.js:290` → `applyEvent.js:59` (`logEntry.narrativeSummary`) → `campaign_state.eventLog` → `supabase/migrations/032_gallery_public_chronicle.sql:35` (`'narrativeSummary', e -> 'narrativeSummary'`, no sanitizer, no veil) → `get_gallery_dossier` (`147…sql:558`) and each settlement of a shared campaign (`088…sql:227`), both served to anon. The client keeps the field (`src/lib/gallery.js:786`).
- **Reproduction.** Ten corpus towns, six with hidden powers (soak1k-113, -183, -214, -242, -321, -389) and three with criminal powers (-3, -5, -15). For 14 cards whose first-rank power is hidden or criminal I committed a PROMOTE_NPC and a DEMOTE_NPC through the real `applyEvent`, at the base and at the tip, and passed each log entry through the real SQL `_gallery_chronicle_json`.
- **Output.** 28 committed events. Public chronicle names the power: **base 0 of 28, tip 28 of 28** (16 for hidden powers, 12 for criminal ones). No veto at either tree. Examples, base → tip:
  - "Yordan Klimov rises within their power…" → "Yordan Klimov rises within **The Independent Bloc**, displacing a rival on the way up."
  - "Coatl Zapote is pushed down the ranks of their power." → "…the ranks of **The Grey Council**." This card is an open face (`npc_multiple_court_buildings`) whose hidden membership the sanitizer strips; the chronicle now states it.
  - "Abbas al-Isfahani rises within their power…" → "…within **Thieves' Guild**…" (a veiled face, id `npc_veiled_cd07dfe12e573467`).
- **The public dossier itself does not move:** its projection is identical base to tip for all 28 events, and the cards keep their stripped public keys. The chronicle is the only surface that changes.
- **Who can trigger it.** The DM, from the event composer. The composer already groups cards by first-rank power (`src/components/settlement/EventComposer.jsx:212-224`, read), and this lane opens the gate that offers the event: PROMOTE available in 0 of 10 towns at the base, 10 of 10 at the tip. The composer needs two first-rank members of one power, which holds for criminal powers and for multi-member hidden powers (The Grey Council in soak1k-389): 12 of the 28 events had a same-power peer. A single-member hidden power is reachable through a batch or an intent op, which take any peer. No pulse code emits these two events.
- **Population at risk at birth, same ten towns:** of 448 cards, the narration would name a hidden power for 12 and a criminal power for 26; 38 of those memberships are stamped veiled, and 22 of the cards are veiled faces. The base names a power for none.
- **Other surfaces, read only:** the PDF Timeline chapter prints the same field (`src/pdf/sections/Timeline.jsx:66`), as does the Foundry journal export (`src/foundry/journalPages.js:433`). The party link carries no chronicle.
- **Smallest cure:** in the two `narrate` functions, name the power only where the card's first-rank membership is stamped `veiled: false` (the stamp migration 206 reads), and keep "their power" otherwise. The DM's own card still shows the tie. Add a pin that drives a committed event through the chronicle projection for a hidden-power member.

### 2. MEDIUM — on the cards the pulse itself writes, the cured sites go blind at this tip

- **Where:** the same six sites; the writers are GREEN-TIP's (`factionDensityKernel.js`, `successorNpc.js`).
- **Reproduction.** Three towns pulsed 12 weekly ticks. The pulse mints founder and successor cards with `factionAffiliation` and `memberships: []` (two or three per town by tick 12). On those cards, base → tip:
  - narration: "The Sworn Companies Founder rises within Sworn Companies…" → "…within their power…";
  - vacated seat: `Sworn Companies` → empty;
  - home: `Sworn Companies` → null;
  - house factor: the founder → none.
- **Why:** each re-point replaced the retired read; none kept it behind the membership read. `vacatedSeatOf` keeps its other handles but drops `factionAffiliation` from them (`npcVerdictTable.js:710-717`).
- **Consequence:** every power minted after birth has no member in the eyes of these sites until GREEN-TIP's writer cure lands. If the two lanes merge as one batch this closes; if this lane lands alone it is a regression against the base on pulse-written cards.
- **Related, the other lane's cause showing through this lane's cure:** after tick 1 the roster dissolves and 282 memberships across my ten towns name powers no longer on it. At the tip the narration names such an off-roster power for 61, 5 and 50 cards in the three towns checked, and the PROMOTE gate is open in all three at tick 12. Second-pass material.
- **Smallest cure:** none on this lane if the batch is one merge; say so in the merge order. Otherwise read `firstRankMembershipOf(...)?.power || npc.factionAffiliation` until the writers are cured.

### 3. MEDIUM — one tip-only red has no named curer, and one moved row hides inside a title that is already red

- **Reproduction.** I ran the five tests the lane names, plus `newsHeadlineContract` and the walker, at the base and at the tip (clean exports, two workers).

  | Test the lane names | Base | Tip | What makes it green, and who |
  |---|---|---|---|
  | `sourceCitationIntegrity` | green | green | cured on the lane (roster bump, `c51a1f53f`) |
  | `proseTasteCorruption` | green | green | cured on the lane (re-keyed, `e73b5d88b`) |
  | `writerReach` | green | green | cured on the lane (its door, `8500d4268`) |
  | `sovereigntyLightingContract` | green | green | cured on the lane (census door, `0f2719364`) |
  | `observedShapeReaders` › "THE ERASURE GUARD: no frozen row has vanished from the DETECTOR while its read still stands" | green | **red** | a re-freeze through the observed-shape door, which refuses until the baseline's schema 39 is migrated to 40. The record owes it to "the seat that migrates the schema". **No seat is named.** |

  The guard's message at the tip names exactly one row: `src/domain/worldPulse/causeLifecycle.js / secondaryAffiliation on npcs — the read is gone from the file (a lawful repair)`.
- **The unsigned row.** `newsHeadlineContract` A2 and A3 are red at both trees. At the tip A2 carries one more changed row, `applied|npc_verdict|summary|indicative` (distinct values 2, occurrences 3), which the base output does not list. It cannot be signed until the base's own rows in that title are cured; the record gives it to the merge seat.
- **Why it matters:** the integration gate admits no failing test. One failing title is this lane's and has an owner by description only.
- **Not verified:** the lane's totals (32 red at the tip, 27 at the base). I ran seven files, not the gate.

### 4. MEDIUM — the walker's list is not shrink-only

- **Where:** `tests/lint/noLegacyFactionReaders.walker.test.js:96-118`.
- **Reproduction 1, three planted reads plus four more shapes** in a new file under `src/domain/worldPulse/`:

  | Planted read | Caught |
  |---|---|
  | `const { factionAffiliation } = npc` | yes |
  | `npc?.linkedFactionIds?.[0]` | yes |
  | `npc['secondaryAffiliation']` | yes |
  | `const { factionAffiliation: fa } = npc` | yes |
  | `npc['faction' + 'Affiliation']` | no |
  | ``npc[`secondary${'Affiliation'}`]`` | no |
  | keys filtered by `/Affiliation$/` | no |

  The run went red on both arms, naming the four caught lines.
- **Reproduction 2, growing the list.** I appended a new read of `factionAffiliation` to `npcVerdictApply.js` (one of the 38 files the older arm exempts whole), added a row for it with a class and a reason, and set `count` to 20. Result: 4 of 4 tests pass.
- **So:** the arm proves the list equals the scan. Nothing stops the list growing by a JSON edit, in any of the 38 exempt files, which are the simulation files. The failure message itself offers "name it with its class".
- **Smallest cure:** a ceiling in the test (`sites.length <= 19`, lowered as rows leave), or a frozen baseline behind a door like the other registers.

### 5. LOW — the corrupt card's home breaks ties differently from the other five readers, and returns a power where two consumers compare institutions

- **Where:** `src/domain/corruption.js:646-650`; consumers `worldPulse/corruptionImpair.js:153`, `worldPulse/npcAgency.js:781`, `events/mutateEntities.js:843`.
- **CONFIRMED.** Over 120 towns, 3,201 cards have a first-rank power; for 183 of them (5.7%) `npcHomeInstitution` names a different power than `firstRankMembershipOf(npc, powerOrderOf(s))`, because it has no settlement to order by. The lane discloses the tie-break.
- **What the home feeds.** Two consumers match it against institution names by substring (the reform roll's "rot still inside" test, and the exposure roll's proximity bonus). 46 of 120 towns have a power whose name overlaps an institution's ("Merchant Guilds" and "Merchant guilds (50-100+)"), so in those towns a reform can be withheld or an exposure made likelier where the base did neither. The third consumer looks the home up as an institution: with the Impose Corruption institution scope on six such cards, no impairment was written at either tree and the public dossier was identical.
- **PLAUSIBLE:** that this moves a default-flag pulse somewhere. It moved nothing in my ten towns over 12 ticks.

### 6. LOW — the verdict seat and the house factor name hidden powers too, behind dark flags

- **CONFIRMED.** At birth `vacatedSeatOf` returns a hidden or criminal power for the same 38 cards as the narration, and `castHouseFactor` casts a factor for every hidden and criminal power in the ten towns (a veiled face's hashed id in most, an open card's id for The Grey Council).
- **With both flags lit**, 12 ticks, ten towns: one town's news gained "The office is forfeit and the seat at Merchant Guilds stands open." (an open power). That text was in Wizard News only: not in the world state, the settlement, the public dossier, the public chronicle or the public world snapshot. No lit output differed anywhere else.
- **PLAUSIBLE:** a verdict on a hidden-power member would write "the seat at The Independent Bloc stands open" into Wizard News. The public world snapshot does carry pulse headlines and summaries (`src/domain/display/worldSnapshotPublic.js:452-454`), so the question returns on the day the flags are lit. Carry finding 1's rule to these two when that day comes.

### 7. LOW — walker blind spots and a comment

- Keys built by concatenation, template or pattern are not seen (finding 4's table). Rows are keyed by file, line and field, so a second read of the same field on a listed line is covered by the existing row (read).
- `npcLadderFactionMembership.js:54-55` says the arm reads "a card with no memberships". It reads any card whose memberships do not name the faction in question (read). On current records that is still only the pulse-written cards.

### Outside the delta, for the chair — the chronicle has no veil at all

- **CONFIRMED, at the base and the tip alike.** An Impose Corruption event's summary reaches the public chronicle unchanged: "Npc barracks has been turned by the Smuggling operation. Corruption takes root in the shadows." The act is covert by design and its impairment is dropped from the public dossier. This is the same surface as finding 1 and predates the lane (`registry.js:413-416`, `032…sql:35`). The durable cure is at the chronicle projection, not in one narration.

---

## The seven questions, in your order

**1. The veil.** Traced and executed for all six outputs:

| Cured output | Stored or printed | Public at the tip? |
|---|---|---|
| PROMOTE / DEMOTE narration | event log `narrativeSummary`; owner timeline, PDF Timeline, Foundry journal | **Yes: the gallery chronicle and a shared campaign's per-settlement chronicle.** Finding 1. |
| PROMOTE gate | a boolean for the composer | No. It opens the path to the narration. |
| House factor | a card id in the house ledger, dark | Not observed: lit world state identical base to tip in ten towns. |
| Verdict seat | Wizard News summary, dark | Not observed on any public projection. Finding 6. |
| Corrupt card's home | read by three consumers; writes nothing by itself | No public difference in 6 fixed-card events or in 10 pulsed towns. |
| `causeLifecycle` fallback | removed | No output moved. |

Pulse runs: ten towns, 12 weekly ticks, single-settlement campaigns, default and lit. I compared the whole save, the world state, the news, the client and SQL public dossiers, the composed prose, the SQL chronicle and the public world snapshot. **Default: identical in 10 of 10 towns on every one. Lit: identical in 9; the tenth differs in news only.** The pulse wrote no event-log entries in any run.

**2. Pure re-points.** Each cure changes the reader and nothing done with the answer (read). The difference is on a record carrying only the retired field:

| Site | Raw v1 card (retired field, no memberships), base → tip | Matters? |
|---|---|---|
| narration ×2 | names the faction → "their power" | Only for unmigrated or pulse-written cards. Finding 2. |
| PROMOTE gate | open → closed | same |
| house factor | casts → none | same |
| vacated seat | names it → empty | same |
| home | names it → null | same |

Executed on a v1 copy of soak1k-3: raw, the base reads all five and the tip none; after `migrateSettlementToLatest` the card holds a membership, loses the retired field, and the tip reads all five. So a saved legacy record is safe once loaded through the migration; the pulse-written cards are the ones that are not.

**3. The house factor row.** Reproduced on ten towns (factors cast, base → tip): tick 0, 0 → 53; tick 1, 10 → 10; tick 3, 10 → 10; tick 12, 19 → 10. Powers on the roster at both trees: 53, 20, 20, 29.
- The fall after tick 1 is **the other lane's dissolution**: the roster drops from 53 to 20 identically at the base and the tip, and 282 memberships are left naming powers that are gone.
- The base exceeding the tip at tick 12 is **this lane's**: the nine extra factors at the base are founders of newly minted powers, written in the retired shape, which the tip no longer reads. Finding 2.

**4. LEGACY, DEAD, DARK.**
- LEGACY `npcFactionHandle`: reached through `npcInFaction` after the membership arm, from the seat-holder readers, the assize, the realm web and others (read). Executed: the only cards that give it a value after 12 ticks are the pulse-written ones.
- LEGACY `eventConsumes`: one caller, the batch stager (`batch.js:225`). No source composer writes `linkedFactionIds` into an ADD_NPC payload; it arrives only on an external or older staged payload (read).
- LEGACY `classifyCustomNpc`: one caller, the custom-content classifier (read).
- DEAD: `disperseNamedRoster` has no caller in `src/` and `titularSuccession.js` has no importer (grep of imports and calls at the tip). PLAUSIBLE only against a dynamic import by a computed path, which I did not find.
- DARK: `npcVerdictApply.js` is unchanged by the lane. At default flags no verdict summary appears in any of ten towns; lit, three do.

**5. The walker.** Finding 4.

**6. The gate claim.** Finding 3.

**7. Anything else.** No saved record's shape changes: at default flags every save and world state is byte-identical base to tip in my runs, and the lane touches no generator file. The lane's own touched suites pass when I run them (five files, 125 tests). The only moved register row I found is the one it declares.

---

## What I did not check

- GREEN-TIP's lane, and the seam: `swapNpcStanding`'s reader, the dissolution, the writers. Second pass.
- The whole hand-back gate, `tests/property`, the goldens, the build, boot smoke and byte figures. My evidence that goldens hold is my own base-to-tip comparison, not those suites.
- The composer in a browser. Its grouping and the gate are read and the gate predicate executed; the event itself was committed through `applyEvent`, not the UI.
- PDF, handout and Foundry output. Read only.
- Multi-settlement campaigns, monthly intervals, and runs longer than 12 ticks.
- The edge bundles, which the lane says are not re-emitted.
- The record document line by line.

Probes and their outputs are in the `probe4/` folder beside this report.
