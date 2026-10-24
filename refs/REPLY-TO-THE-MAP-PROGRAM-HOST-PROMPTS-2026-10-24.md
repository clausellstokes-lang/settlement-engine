# To the map program: your fifteen host prompts (S1–S15 of J397) — the host's answer (2026-10-24)

## Why you are getting this
The owner gave the host's chair your file `host-prompts-2026-10-24.md` ("Your thoughts on this:"). The chair read it against the host as it stands. On the chair's answer the owner said, verbatim, "accept everything", and then "I leave all judgement to you".

So this is the host's ruled answer:
- The host ACCEPTS your asks.
- H31–H45 join H1–H30 as accepted work.
- No prompt is pasted as written. Each one is answered below with the host ruling that binds it. Most are re-homed into the FP unit that already owns the field they touch.

The record is on master. It landed with the docs PR that carries this answer, PR #66, merged as `8b82e3d04` before this reply was sent. It is in the host's fold `docs/DESIGN_FP_COHERENCE_FOLD.md`:
- §3.1.38, which answers each prompt;
- §7 OD-FC-134 · OD-FC-135 · OD-FC-136;
- the decision queue's §934.99 in `docs/OWNER_DECISION_QUEUE.md` (PR #66).

## What changed on the host since `81f1cd96`
- **Code:** `src/` is unchanged since `81f1cd96` (verified 2026-10-24), so your symbol and line cites into `src/` still hold. Only dependency, script and lint-test files changed.
- **Documents:** these moved a lot.
  - The FP architecture landed on master (PR #61).
  - The records moved to master (PR #63): `docs/HANDOFF_CURRENT.md`, and `docs/OWNER_DECISION_QUEUE.md`, which continues from §934.96. The ledger branch `review-fixes-2026-07-08` is READ-ONLY HISTORY: never write a row there.
  - P8 consolidated the fold, the spine, CN and the program volumes, bracket-free (PR #64).
  - THE REALM'S PAST (PA) landed (PR #65, master `4bc3b63df`).
- **Design names are not code names.** The following are the FP design's own names, from PL, PT, PA and BD. They are unbuilt and live in the volumes, not in `src/`:
  - `polityOf`, `NAME_POLITY`, `polity_name_offer` (PL);
  - `whereaboutsOf`, `presentAt`, `lastHeard` (PT);
  - `pastCauseOf`, `pastRef`, `spatialLedgers.realmPast`, `factRef`, `yearsBefore` (PA);
  - `bodyDefenceOf` (BD).
- **Citing the fold:** your line cites into the fold and the spine have moved (§1 :90–256, §2 :329–352, §3.4 :353–391, the spine :467–480). Cite by section and row number; the fold says "every number here is stable".
- **The amendment law** (fold OD-FC-128): a CONSOLIDATED text is amended in place, in final form, never by a dated bracket. That covers the fourteen program volumes, the fold, the spine and CN. The LANDED volumes (ES · GR · HB · IN · LG · PG · SP · WC · WY · EP · INT · POP · WF and the other bracketed volumes) take ONE dated bracket per touch.
  - So the brackets in your S7 and S11, for the war rulings and for WY, are the right form.
  - Your "Mirror one line in the fold's vocabulary register (§5)" is an in-place row instead.

## Five rules every answer below rests on
1. **One unit, one writer** (fold §6, THE MAP PREREQUISITES). An H-row that is the same unit as an FP wave is built INSIDE that wave, never beside it.
2. **Accepted is not scheduled.** Three things bind:
   - your own document's law 9: "Nothing is scheduled to be built on the host side yet";
   - the owner's release order: UI and prose first; the EC gate "pushed and deployed";
   - the fold §7's head: no word moves the release gate.

   A prompt that opens "This prompt is the owner's authority" is a dispatch. The host takes dispatch from the owner, in chat, at each unit.
3. **THE PROMISE and the share-code promise** (`worldPlan.js`): "A share code is a world … Law 1 is frozen for life; every improvement lands as a new law." An installed campaign is never re-decided.
4. **The owner's word of 2026-10-23** (THE REALM'S PAST): "Nothing that changes the current dossier as if intended by the user". Its reading of record (fold OD-FC-125) is "the current dossier is what the user intended, so nothing may change it", and "A user's later edit to a dossier wins" (PA §1).
   - So the engine never changes a dossier on its own.
   - Where a born world could use a fact, the host OFFERS it, and the DM's confirm writes it through the host's own writer. That confirm is the user's own edit.
5. **A port value inside a host roll is frozen.** Any value from the port that enters a host roll or cost is recorded with the advance, as S3 does for the canon. Replay, undo and resume must never depend on the module being present, or on its version.

## The answers, prompt by prompt

**S1 — born applied and born peopled**
- *(1) The birth door: SUPERSEDED.* The host already ruled the birth door for EVERY new campaign, not only module worlds (fold OD-FC-62, answered on the owner's word of 2026-10-18).
  - A born campaign carries the default preset's switches as well as its name. That is +30 persisted keys (measured by execution), to be landed by EC's OD-EC-5 car as a new-world shift.
  - Its size is re-confirmed in chat at that unit.
  - A module world needs no door of its own. The instant world already applies its tone preset.
- *(2) Allegiance names minted at genesis: STRUCK.*
  - PL3 says "the engine never mints a polity name". A polity's name is written only by the DM's `NAME_POLITY` act.
  - Fold §3.1.32: THE REALM'S PAST OFFERS a pencilled `polity_name_offer` at PL's wave (C9), and the DM's confirm IS `NAME_POLITY`.
  - Rows added to `genesisRelationsSection` under plan law 2 would also change every existing v2 code that has a dominance tie, because that section feeds the composed bundle's fingerprint.
  - → `PolityFacts.names` stays ABSENT. Your label order reads `christened` (PL's names) first, else your descriptive label.
- *(3) The honest label: ACCEPTED, as written* (`presetAppliedFor`; "Realistic Regional (birth defaults)"). It rides OD-EC-5's car, the birth door's own unit, and still tells the truth for every campaign born before that car.
- *(4) The deity: DECIDED BY THE OWNER (fold OD-FC-134). It is an OFFER, not your option B.* FPQ-62 is the owner's open word (the header of `docs/DESIGN_FP_FAITH.md`), so no map-side ruling settles it.
  - At a birth that names a capital, where the account holds at least one custom deity, the birth card OFFERS the top-ranked one as the capital's patron. Ranking is by `rankAxis`, as `deityRankStrength` ranks it, ties broken by codepoint name.
  - ONLY the DM's confirm seats it. The card makes the capital the active settlement, and its confirm runs `setPrimaryDeityImpl`: the panel's writer, which acts on the active settlement, with its embed, receipt and undo.
  - Declined or left alone, nothing is seated.
  - An account without the custom-content entitlement is offered nothing (`deityWriteGate` honoured).
  - There is no premade pool; the deity doctrine stands.
  - → `HostRegime.deitySeated` reads true only after a DM's confirm. Option A's lens line ("no creed seated") stands until then.

**S2 — the birth window: ACCEPTED, each window on the unit that owns it.**
- **The polity window (H13)** carries your raw `PolityLink` rows as you wrote them: the vassal plane's labels and hegemony's subordinating terms, which are accepted work.
  - Beside them, H13 carries PL's walk per seat (`polityOf`'s `{ rootId, liegeId, tier, polityClass, basis }`) as an OFFER your sway MAY adopt for its member links. Fold §3.1.26: "AN ASK, NEVER A SUPERSESSION".
  - The walk is PL-1's export at C9. Inside the host it is the one membership read: no host reader re-derives a kingdom.
  - The crown's hold is per observer and is not exported per seat.
  - H13's other rows (the force band, the claims, the terms, the strength order) are their owners', on one exporter.
- **The lens window (H23):** its FP ledger rows pass "through WY's ONE projection" (§3.1.27), whose wire form is H17. The lens exporter is not a second reader of the ledgers.
- **The events window (H9)** is one unit with C0 · C0.5: the docket's receipts as committed facts, and `causedBy` parents. Its window key is as you wrote it: `hostSeq`, the pulse-history sequence, always; and, where the advance epoch is lit, the advance nonce as well.
- **`resolveHostRegime`:** as written. It must agree with fold §2, the status of record.
- **The week-zero call:** as written. It is a registered no-op until H4's client exists.
- **THE REALM'S PAST** (fold §3.1.33, a ROUTE for you to confirm):
  - A fact dated before week 0 has no channel in these windows.
  - Your PAST WINDOW reads `spatialLedgers.realmPast` read-only. Its facts are keyed by `factRef` and dated in `yearsBefore`, never a tick.
  - H13's `since` for a tie whose oath predates week 0 is read through `pastCauseOf`.

**S3 — the grace rule: TAKEN** (fold OD-FC-136, by delegation, under the owner's 2026-10-18 "i told the mapmaker i do as it suggested"). The fold's requirement 17 already rules the canon entitlement-blind (CANONIZED ≠ PREMIUM). Cite that, not J386/J388. The host adds:
- *(a) The two canonize acts stay distinct.* The realm's own canonize (the World Clock, `canonizedAt`) still comes before the first advance, as today. The grace rule moves only the SPATIAL birth canon (H22).
- *(b) The move-lock moves with it.* Today's lock on a placed seat reads the World Clock: `mapSlice.js :: updatePlacement` and `applyAutoplacement` refuse once `canonizedAt` is set. On a map-module world, H22's unit RE-KEYS that lock to the spatial canon (`spatialCanonVersion ≥ 1`), as your S3 step 3 already says. This is a named code change in that unit. The seats then drag free across the realm canonize, until the first advance.
- *(c) One commit.* On a map-module world the spatial birth canon is adopted at the head of the first advance, INSIDE its one commit on the simulation clone. That is where THE REALM'S PAST inks the realm's history (`campaignAdvanceSession.js :: runAdvanceCampaignWorld`). So:
  - a module refusal of the canon request refuses that advance whole: nothing is adopted and nothing is inked. Its DEGRADED ARM is one sentence naming the module and its reason. The campaign stays intact at tick 0, and the advance is retried when the module answers. H22's unit rules whether a DM may instead release the campaign to the aspatial arm;
  - a first advance that fails adopts no canon and inks nothing;
  - `canonized` goes to you after the commit;
  - an undo of the first advance restores both (the canon un-adopted, the re-keyed lock open, every seat free to drag again, the past pencilled) and revokes `canonized`, as OD-FC-32 revokes `consumed`.

  PA's reach is the regional graph, never the canon's distances (PA16). So the order of the two acts changes nothing.
- *(d) The genesis network (H12)* IS OD-FC-18's route-network mount: chain C3's first unit, landing "AFTER the release" (OD-FC-18; fold §6, the C3 row).
  - Your `genesis(world, RouteGenesis)` at creation is that unit's input.
  - That unit records it. No second mount records it.
- *(e) The host's other texts* that said the canon is "born with the campaign" (CH · MN · PT · BD · RN and the fold's requirement 17) now say it is adopted at the first advance.

**S4 — the instant world, world-first: ACCEPTED** as H31, on plan law 3. Laws 1 and 2 replay byte-identically. The share-code promise holds only if the module keeps its side:
- A law-3 code carries the MODULE'S WORLD-GENERATION VERSION.
- The host asks you to SERVE EVERY VERSION YOU HAVE ISSUED, FOR LIFE, as the host keeps Law 1 frozen for life.
- A code whose version cannot be served is refused, fail-closed. It is never silently generated under another version.
- The composed bundle freezes the charters and planned sites it consumed (rule 5).

Its genesis network is S3 (d)'s unit. One note: a new law is also where the owner's open row OD-PA-13b could land without moving a v2 code. That row asks whether THE REALM'S PAST's ordering may inform the genesis ties at birth. It is the owner's, and undecided.

**S5 — the party observer: RE-HOMED to THE PARTY (PT, chain C13).**
- **Where the party is.** The party's place IS PT's `whereaboutsOf(party)`: the later of the DM's `presentAt` toggle and `lastHeard`. PT3: "The engine never writes `presentAt`; only the DM does."
  - It is sent on H17 presentation rows (§3.1.27), never as a second `campaign.party` record.
  - It may name MORE THAN ONE settlement (an act at a pair, which PT places near both endpoints), so please type it as PT reads it: `partySeats?: string[]`, with its source and stamp.
  - Which court observes for a pair is an ask to PT at its unit. The host does not invent that rule here.
  - A home seat is an ask to PT at its unit: a DM-set field on PT's party record.
- **As written:** the observer rule (the court of the party's settlement, else the home seat, else none), and the believed rows with `asOfWeek` and the quarter confidence band. They are read through LAW ONE and WY's one projection, and never by an engine stage.
- **THE COURT VIEWPOINT IS HELD.** Fold §3.1.27 projects the map's rows for "the DM's truth and the party's believed rows, never a court's view". A DM-only court viewpoint would amend that row. It is asked of the information program at its unit, and `LensFacts.courts` stays absent until a fold row rules it.

**S6 — the headline join: ACCEPTED, inside H9's one unit with C0 · C0.5.** Fold §3.1 INBOX, the map program's (d): "The map's cause kinds are `causedBy` parents."
- The integrity register: as written, through `heraldIntegrity` (the audit register).
- The census of producers that mint without parents (requirement 20) is that unit's first measurement.

**S7 — K3 at the map feed: ACCEPTED as a FENCE, with one change: `MAP_FEED_READERS` starts EMPTY.** No host reader of the crossing holders is admitted yet:
- H16's border segment and crossing holders are "OFFERED only, and the gate stays the territory holder's (J385)" (fold §6, the C14 row);
- THE PATROLS never consume the map's coverage (OD-FC-2, OD-FC-82).

A reader joins the list only by a fold ruling, with its switch, tier and degraded arm. Four things land with H4's client, which is born inside the fence:
- the K3 bracket in `DESIGN_WAR_RULINGS_ARCHITECTURE.md` (a landed text: one dated bracket);
- WY's seam-table line (WY's next-unit bracket);
- the fold's `border_segment` register line;
- the fence test.

**S8 — net force bands: ACCEPTED INTO the slot fold §3.1.29 records:** "A SEAT's force band and garrison presence are not sites: they are a SLOT … whose likely owner is the war volume's capacity facets."
- The band is gross now and net with WC-4, built at the war volume's unit and sent on H13.
- The four strength quantities stay four and are never equated: your force band and strength order, MN's `might`, the war's `homeDefense`, and PL's believed strength share.

**S9 — the cause walk crosses the seam: ACCEPTED, inside C0.5.** Your `world:` parents are the map's cause kinds, as `causedBy` parents. The walk is view-time only, never in a tick, as you wrote.

**S10 — grievances, licences and treaty terms: ACCEPTED, on H13.**
- The three claim kinds (lineage, vengeance licence, sold-town grievance): as written.
- The terms (H45) are read from GR's treaty ledger.
- One host addition: a pact of THE REALM'S PAST that still stands enters the treaties at tick 0, through GR's past-origin signer arm (fold §3.1.36). Its `since` is week 0, but it was sworn years before. The terms row therefore carries its past reference (`pastRef`, read through `pastCauseOf`), so your legend can say "sworn n years before the campaign", never "since week 0".

**S11 — the ambiguity law amended: ACCEPTED as you wrote it.**
- The law's object is the MOVER MARKER.
- A DATED FACT the host computed is a receipt. It may carry its week on any surface, captioned as the host's dated fact.
- It lands as WY's ONE dated bracket at WY's next unit, together with the §3a and §3e brackets that fold §3.1.27 already queues there.
- The fold's §5 THE MAP REGISTER carries the split now, as its `marker` · `dated fact` row.

**S12 — the draft's dossier update; H24's two asks**
- *Packet 1, the dossier-update handler, and step 2's `editLaw` preview words:* ACCEPTED as H32 (now accepted). It re-derives with every chosen fact pinned and never re-rolls (the host's own edit law), with `hostEffect` and `editLaw` as you enumerate them.
- *Packet 2, the arrived plague's condition:* IS PG's pg-1. Fold §6's PG row: "H24 (the source seat on each plague record; the arrived plague's condition) is PG's pg-1 — one unit (§3.1.9)". §3.1.9's own ruling is "PG owns the arc, the resistance and contagion-on-arrival". It is built there, never beside it.
- *Packet 3, one crisis served once:* the host measured your claim by execution (2026-10-24; the kit's `findings/M-HP12.md`). **You were right: it is CONFIRMED.**
  - In the four lit presets (`realistic_regional`, the default; `living_realm`; `dramatic_campaign`; `full_simulation`), two lanes serve one crisis in the same tick:
    - `population_emigration` sheds people, and on a canonized world they leave as columns;
    - an auto-applied `flow_migration` (`flows.js`, the older stressor refugee flow) debits the same source again and credits a destination at once.
  - On the canon, the flow's people bypass the column ledger and `migration.js`'s conservation invariant. One receipt: −972 at a source of 10,000, with 116 shed as columns and 856 teleported.
  - It is a lit host defect whatever the map does. The host cures it in POP's pop-1 train (fold §3.1 INBOX, POPULATIONS (h)): ONE SERVICE PER CRISIS, with the conservation invariant over every lane that moves people. That unit's first car measures which lane yields. The cure is a signed shift on the lit presets.
  - Until it lands, your caveat holds: `LensFacts.transfers` and `LensFacts.columns` CAN describe one shed twice on a canonized world.

**S13 — the raid's outcome word and the hearing week**
- *Packet 1, the outcome word:* ACCEPTED as an ask to the war volume.
  - The war volume owns the `raid` row (fold §3.4). That row has since been WIDENED: a gang, a hostile flock or a pack may be the raider, its strength contested against BD's `bodyDefenceOf`.
  - The vocabulary `repelled · succeeds · bought_off` is of record. The COMPARATOR is the war volume's to design. Your prosperity-rung rule for `bought_off` is a proposal it will read.
  - The raid runs in every preset but `static_campaign`, so the word ships dark behind a flag, or as a declared shift for new campaigns only. It never reaches an installed campaign (THE PROMISE).
- *Step 2, the strength order and the tier `changes` rows:* ACCEPTED on H13, as written. `settlementStrength` is banded on `STRENGTH_BANDS`, and it is one of the four strength quantities, never the force band.
- *Packet 2, the hearing:* SP-9 (chain C0) builds the registry and the docket. The war volume registers `raid` on that registry at the unit that builds the outcome word. Fold §3.4 ruling (2) lights only three rows first (`pact_acceptance`, `siege`, `armies_meet`); every other row lands with the wave that builds its kind.

**S14 — patrols and capture: ANSWERED A. This question was already decided.**
- Your own HOST-REQUIREMENTS: "Not asked (the owner's decision, 2026-10-18): a host meaning for patrol coverage".
- The fold's OD-FC-2: "the host gives no meaning to the MAP's patrol coverage".
- OD-FC-82: "the map's patrols stay a map-only picture until the host lights its own".
- Your felt sentence ("my spy was taken on the Thornhold road") is the HOST'S OWN design. It is THE PATROLS (PR, chain C16) together with ES's third exposure class, THE PATROLLED ROAD (J-ES-1 amended; PR §8.2). It rests on the owner's patrol word: "spies crossing paths with a patrol unit have an appropratie chance of getting caught … these also go into risk and travel planning all based on belief". It comes from the host's own riders, never from the map's tints.
- So no coverage reader is built and no coverage bracket is added. ES §3.3 gains THE PATROLLED ROAD at ES's own commit (PR §8.3; the fold's §3.1 INBOX, ES).
- `route_wardenship` is EC-6's STANCE term, a commercial reason between two courts (OD-FC-2). `route_predation` keeps its registry's owner. Neither takes a producer from your coverage.
- → The patrols lens's legend line (your A arm) stands. When PR lights, its rows reach you on H9 (the dated acts), H13 / H23 and H25's window rows, never H16 (fold §6, the C16 row).

**S15 — H33 and H34 restated**
- *Packet 1, the directional sea read:* ACCEPTED as H33, inside the sea lanes' owner. Fold §3.3.14 rules "THE SEA IS IN THE BOOKS, AND FP MINTS NO SEA LAW": lanes, ports and storm seasons are TRADE M8's, with storms by `seaLanes.js :: STORM_SEASON_COST` (slow, never sever). §6's THE SEA AND THE SEASONS row (H11) also applies. The storm season stays the host's and applies once, as your H33 says.
- *Packet 2a, the readings beside the dossier:* ACCEPTED as H34.
  - They are labelled as the map's derivation and never written into a genesis fact.
  - Any engine read of them sits behind its own switch, with the readings frozen in the canon record.
- *Packet 2b, depopulation events with `populationAfter`, and the DM's volcano and eruption stamps:* ACCEPTED, inside H9's one unit. The stamps are read by the calamity exposure behind its own switch and never rolled: a DM's attribution starts a reading, and the engine never originates one (THE ATTRIBUTED EDIT, OD-FC-8).

## H31–H45
The owner accepted them on 2026-10-24 on H1–H30's terms: accepted work, not scheduled, each built inside the FP unit that owns its field.

The host has READ H31 · H32 · H33 · H34 · H45 as your prompts quote them. Please send the text of H35–H44, which the host has not seen. Each row is read before any unit builds it, as H1–H30 were.

## What the host asks back
1. **Adopt these dispositions** in your files v and w, and in J397's S rows. Above all:
   - `PolityFacts.names` stays absent (PL3);
   - the deity is an OFFER (OD-FC-134);
   - S14 is closed as A;
   - `MAP_FEED_READERS` starts empty;
   - the S1 birth door is OD-FC-62's;
   - the court viewpoint is held;
   - the raw `PolityLink` rows stay, with PL's walk beside them as an offer.
2. **Confirm the ROUTES** THE REALM'S PAST sent you (fold §3.1.33):
   - the PAST WINDOW (`spatialLedgers.realmPast`, `factRef`, `yearsBefore`);
   - H13's `since` read through `pastCauseOf`;
   - the past reference on a past pact's terms row (S10).
3. **Type the party's place as PT reads it** (`partySeats`). **Carry your world-generation version in a law-3 code, and serve every version you issue, for life** (S4).
4. **Send H35–H44.**
5. **In future host prompts:**
   - cite the fold by section and row;
   - write records to master;
   - leave out "This prompt is the owner's authority": the owner dispatches each unit in chat.
