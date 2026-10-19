# D-RN-r2b — anchored, unique, in-place edits to docs/DESIGN_FP_ARCH_RN.md (each old string asserted unique first)
import sys, io
PATH = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_RN.md'
src = io.open(PATH, encoding='utf-8').read()
C = '[CURED 2026-10-18 (fp-final r2) — '
EDITS = []
def E(old, new):
    EDITS.append((old, new))

# 1 status line
E("P3 ROUND 2 DISPOSED (2026-10-18, lane D-RN-r2).**",
  "P3 ROUND 2 DISPOSED (2026-10-18, lane D-RN-r2); P3 ROUND 2b DISPOSED (2026-10-18, lane D-RN-r2b).**")
E("RN is a READ MODEL plus one deed ledger: it owns no engagement kind (§11).",
  "RN is a READ MODEL plus one deed ledger: it owns no engagement kind (§11). Round 2b disposed the ids `skeptic/SEAMS-r2.md` routes to RN (SEAMS-r2-6 THE CORPS — `briefs/RULINGS-ROUND2b.md`: `u:<unitKey>`; SEAMS-r2-11; SEAMS-r2-13), the chair's round-2b correction RN had echoed (HOST-r2-5: the host's patrol facts leave by the window, never H16) and the RN rows the sibling lanes routed here (`cure/D-CH-r2.md` §5.2, `cure/D-PT-r2.md` §5.1) — §19's round-r2b block, the log `cure/D-RN-r2b.md`; `skeptic/HOST-r2.md` routes nothing to RN.")

# 2 RN1 — who holds fame
E("it is fame read beside a negative regard, on read, for one surface (RN4).",
  "it is fame read beside a negative regard, on read, for one surface (RN4). " + C + "SEAMS-r2-6 · SEAMS-r2-13: FAME is held by an actor the world speaks of by name — a person (`p:`), a free company carrying the paragon mark (THE CORPS, `u:`, §2.2; CH §16b) or the party. A SETTLEMENT doer's deed (a court's act: a passage, a site taken, a patrol's clash) adds no fame to anyone: it travels as a TALE (its telling), the persons and paragons who hear it regard the doing court (§2.1 `doer`), and a court is known through its ruler's office (§4.2).]")

# 3 RN16 — the corps' identity
E("and person fame is office fame plus the deeds of persons that already have a durable key (the party has its own ref, `{kind:'party'}`).",
  "and person fame is office fame plus the deeds of persons that already have a durable key (the party has its own ref, `{kind:'party'}`). " + C + "SEAMS-r2-6 (`briefs/RULINGS-ROUND2b.md`: \"a corps keys in RN as `u:<unitKey>` (a UNIT holder/subject; the `c:` prefix stays the court body; the refused-pair rule does not apply to `u:`)\"): a CORPS (CH §16b) is not a person and takes no `wnpc_`; it keys on WC's free-unit key (`spatialLedgers.freeUnits[unitKey]`, WC §1.7.2: `unit.<rootOriginId>.<fissionTick>` for a fission product; a DM-authored company's key minted by WC's DM-authority birth event, CH §16b) and on nothing else. It exists only where CH's `paragonCorpsEnabled` and WC-10's `freeCompaniesEnabled` are lit — over the person tier, because CH's pass runs only under `npcConsequencesActive` — so until then no `u:` key exists anywhere.]")

# 4a doer row
E("(subject `c:<id>`: CH's `barred_at_gate` and `covert_hire_exposed`; the causes `refused_at_gate` and `banned_by`)",
  "(subject `c:<id>`: CH's `barred_at_gate` and `covert_hire_exposed`; the causes `refused_at_gate` and `banned_by`), and a settlement doer's deed adds no fame — it is a tale (RN1); `{kind:'corps', id: unitKey}` — a free company's act (CH §16b's `sold_out` and every `paragon_act` kind a company can do): a corps doer's deed moves any hearer's regard of `u:<unitKey>` exactly as a person doer's moves `p:`, and the settlement-doer rule never applies to it " + C + "SEAMS-r2-6: the doer values were `party · person · settlement`, so the corps' `sold_out` deed had a doer the one normalizer does not name]")

# 4b target row
E("never by `npc_N`) |",
  "never by `npc_N`); a company is `{kind:'corps', id: unitKey}` (CH's `barred_at_gate` at a company) " + C + "SEAMS-r2-6] |")

# 4c partySeq row (after actAt)
E("| `struck` | `{ tick }` | RN |",
  "| `partySeq` | integer, only on a deed whose doer is `{kind:'party'}` | PT | the deed's place in the party's order of recording, stamped at mint from PT's sub-ledger (PT3; PT §2.1: every deed whose doer is the party takes the next `partySeq`, whichever door mints it), so `whereaboutsOf` orders two acts of one tick; RN reads it nowhere, and its one normalizer NAMES it because an unnamed field is dropped on every read (the `normalizeEntry` lesson) " + C + "D-PT-r2 §5.1(a): PT's round-2 field was missing from RN's normalizer] |\n| `struck` | `{ tick }` | RN |")

# 4d sourceEventRef
E("the COMPOSER event's id — always on a `party_event` deed, and on a `party_impact` deed ONLY when the composer supplied it",
  "the COMPOSER event's id — on every `party_event` deed minted from a composer event (PT's own verbs — `SEND_WORD`, `RECORD_MEETING`, the answer `no`, the backing resolutions — have no composer event and key by their command id, `deedId` above) " + C + "D-PT-r2 §5.1(b): \"always\" was false for PT's own verbs], and on a `party_impact` deed ONLY when the composer supplied it")

# 5 key table + refused pairs
E("| `p:<wnpc>` | yes | yes | a graduated person (an ordinary NPC, a court member, a paragon) |",
  "| `p:<wnpc>` | yes | yes | a graduated person (an ordinary NPC, a court member, a paragon) |\n| `u:<unitKey>` | yes | yes | a free company carrying the paragon mark (THE CORPS, CH §16b; actor ref `{kind:'corps', id: unitKey}`) — a holder as a person is: its authored relations (CH's `relations[]` through `DECLARE_STANCE`), the DM's sets and the deeds heard at the town its unit stands at (§5.1); its lens is its mark's authored `alignment` and `character.axes` (§6.2) " + C + "SEAMS-r2-6 (RULINGS-ROUND2b): CH's round-2 `c:<unitKey>` would have read a company as a court BODY with a derived regard and refused it any feeling about the court that hires it] |")
E("the verb card points the DM to the landed relationship acts (the composer's `SETTLEMENT_DISPUTE` · `BROKERED_ALLIANCE`). [CURED 2026-10-18 (fp-final r1) — RN-r1-1.]",
  "the verb card points the DM to the landed relationship acts (the composer's `SETTLEMENT_DISPUTE` · `BROKERED_ALLIANCE`). [CURED 2026-10-18 (fp-final r1) — RN-r1-1.] " + C + "SEAMS-r2-6: the rule binds `s:` and `c:` only — a `u:` holder may hold an entry about a town or a court (the company's feeling for the court that retains it, CH §4.4 and §7), a town's commons may hold one about a `u:` (a company's deeds heard), and a court's regard of a company is derived like any other (§5.3).] [REFINED 2026-10-18 (fp-final r2) — SEAMS-r2-11, the third volume to ask RN for court↔court feeling (after PS-r2-17 and RN-V4): `regardOf` and `courtRegardOf` asked for a refused pair return `null` with the reason `pair_state` — never a derived number — and a program that needs how one town or court stands with another reads the landed pair state (`relationshipState`; `pairNet`, §2.3, is RN's READ of that state for lens two, never an RN regard); RN-1 pins it (§13), so no later reader can take a court's feeling about a town from RN.]")

# 6 derived reads
E("- `fameOf(worldState, actorRef, tick) → { scope: FAME_SCOPES member, office01, deeds: [{ deedId, scope }] }` — §4.",
  "- `fameOf(worldState, actorRef, tick) → { scope: FAME_SCOPES member, office01, deeds: [{ deedId, scope }] }` — §4; `actorRef` is a person, a corps or the party (RN1) " + C + "SEAMS-r2-6].")
E("- `heardAt(worldState, deed, observerSettlementId, tick) → { heard: boolean, arm, ver, mag }`",
  "- `heardAt(worldState, deed, observerSettlementId, tick) → { heard: boolean, arm, ver, mag, heardTick }`")
E("Regard, a body's re-reading and the party's credibility at a town read it; fame adds the decayed ring [CURED 2026-10-18 (fp-final r2) — RN-V1 · RN-r1-11].",
  "Regard, a body's re-reading and the party's credibility at a town read it; fame adds the decayed ring [CURED 2026-10-18 (fp-final r2) — RN-V1 · RN-r1-11]. `heardTick` is when that version was heard: the telling's `arrivalTick` in the road arms (the rumor module keeps the earliest — `arrivalTick: Math.min(existing.arrivalTick, incoming.arrivalTick)`), the stored heard term's `tick` once the telling has expired, `deed.tick` + the news delay in the omniscient arm, `deed.tick` aspatially. `heardAt` is therefore THE PER-DEED ARRIVAL READ that CH's `believedWhereabouts` composes: the newest heard deed whose doer is the paragon (`deedIndex(...).byDoer`, then `heardAt` at the observer's town; newest `heardTick`, ties by deed tick, then id), its place the deed's `actAt[0]`, else its first witness — RN mints no second arrival test " + C + "D-CH-r2 §5.2(c): CH's read was PLAUSIBLE until RN named it].")

# 7 vocabularies
E("the ENGINE sources for courts and ordinary persons are registered as SLOT rows in §3.1 [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-7 (RULINGS-AFTER-COMPILE: `party_pledge` accepted) · RN-r1-14] |",
  "the ENGINE sources for courts and ordinary persons are registered as SLOT rows in §3.1 [CURED 2026-10-18 (fp-final r1) — SEAMS-r1-7 (RULINGS-AFTER-COMPILE: `party_pledge` accepted) · RN-r1-14]; the slot row `passage` (PS, C14) joins them " + C + "SEAMS-r2-13] |\n| `TELLING_SOURCES` | CH's two rows: the LEAK of a covert hire (CH §9 road 1; `eventRef` `leak:<wnpcId>:<employerId>`) · the POSTED OPERATIVE'S FINDINGS (CH §8; its `eventRef` prefix CH's to name at CH-7's car) | FREE (`TELLING_SOURCES` 0 src · 0 tests, `cure/D-RN-r2b-probe/census.out`); a closed registration list of NON-DEED tellings RN's one telling call seeds (§3.4); grows only by a row in its owner's wave; a registered telling is never a deed and never a renown fact " + C + "D-CH-r2 §5.2(d)] |")
E("· `in_office` (a W-H1 cause member) [CURED 2026-10-18 (fp-final r1) — HOST-r1-5 · SEAMS-r1-22 · RN-r1-17].",
  "· `in_office` (a W-H1 cause member) [CURED 2026-10-18 (fp-final r1) — HOST-r1-5 · SEAMS-r1-22 · RN-r1-17] · `u:` (RN's corps key prefix inside `spatialLedgers.regard`; the ingest rate limiter's bare user key — `supabase/functions/ingest-events/index.ts`: ``const rateKey = actorId ? `u:${actorId}` : …`` — is another surface) · `corps` (a value of the actor-ref `kind` and of CH's `holderKind`, never an identifier alone, CH §2.3) · `heardTick` (FREE; `atTick`, landed in 22 source files and CH's P3 field, is avoided) " + C + "SEAMS-r2-6 · D-CH-r2 §5.2(c)].")

# 8 §3.1 mint signature
E("`deedLedger.js :: mintDeed({ worldState, source, sourceEventRef, feedRef, recordKey, tick, kind, doer, target, witnessIds, magnitude, snapshot }) → { worldState, deedId, minted }`",
  "`deedLedger.js :: mintDeed({ worldState, source, sourceEventRef, feedRef, recordKey, tick, kind, doer, target, witnessIds, magnitude, partySeq, snapshot }) → { worldState, deedId, minted }` (`partySeq` from PT's door for a party doer, D-PT-r2 §5.1(a))")
# party_event row
E("the composer's `partyCaused` path (`settlementLifecycleHelpers.js`, `drainQueuedEvents.js`) for EVERY party-caused settlement event, not only the six that ripple (R2 R-14: \"attribution only — no ripple\" today leaves no world trace) (PT)",
  "the composer's `partyCaused` path (`settlementLifecycleHelpers.js`, `drainQueuedEvents.js`) for every party-caused settlement event that does NOT ripple — the six that ripple mint ONCE, through `party_impact` (PT's static skip: the composer's `party_event` door passes over every event `mapEventToPartyImpact` maps, PT §3.1), so R2 R-14's \"attribution only — no ripple\" events leave their world trace here — plus PT's other `party_event` acts: a suggestion answered, the party's hand on MN's verbs, PT's own verbs (`SEND_WORD`, `RECORD_MEETING`, the answer `no`) and the backing resolutions (PT §3.1) (PT) " + C + "D-PT-r2 §5.1(b): \"for EVERY party-caused settlement event, not only the six that ripple\" contradicted PT's one-act-one-deed door]")
# paragon_act lit-when
E("| `renownEnabled` ∧ CH's flag ∧ `npcConsequencesEnabled` |",
  "| `renownEnabled` ∧ CH's flag ∧ `npcConsequencesEnabled`; a CORPS' acts also `paragonCorpsEnabled` ∧ WC's `freeCompaniesEnabled` (CH §16b) " + C + "SEAMS-r2-6] |")
# passage slot row (after patrol row)
E("| PR · its chain; dark until PR lights [REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E] |",
  "| PR · its chain; dark until PR lights [REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E] |\n| `passage` | the MOVER'S court (`{kind:'settlement', id}`), or a retained CORPS on its own fame (`{kind:'corps', id: unitKey}`, PS13); kinds `passage_kept · passage_breached · passage_trespassed` (PS13; FREE, PS §15 — clear of RULINGS-ROUND2 A.3's ruled-against `kept`/`broken`) | THE PASSAGE's crossing end — the WITNESSED archive row PS writes at a unit's exit (`kept` · `broken` · `trespassed`, PS §4.1 step 5 and §7.1–§7.3; an unwitnessed crossing mints nothing); witnesses the territories crossed (each holder whose land the unit crossed with a witnessed row). As a SETTLEMENT doer's deed it is a TALE: it adds no fame (RN1) and moves no town's or court's RN regard of the mover (court↔court feeling is the landed pair state PS's own outcomes write, PS13), while a person or a paragon who hears it regards the mover's court (`c:<id>`) as for any settlement doer | PS · C14 " + C + "SEAMS-r2-13: RN's slot table had no `passage` row, so PS's tale of a trespass had no producer] |")
# patrols bracket
E("PR reads RN at two seams — a traveller's cover by fame (item 15) and `patrol_joins`' default by the ally court's regard of the asker (`courtRegardOf`) — and names two engine deed sources for the slot table above (`patrol_clash`, `patrol_catch`). The cover read must be fame AT THE PATROL'S TOWN (`fameIn`, the belief read), never `fameOf` (the world's widest knowledge, §4.1): PR's `fameOf(…).scope` is routed to the chair as PR's lane. Patrols stay map-only until the host's PR lights and opens H16 (PR item 18; the newest host document), so no RN read of a patrol exists before then;",
  "PR reads RN at ONE seam — a traveller's cover by fame AT THE PATROL'S TOWN (`fameIn`, the belief read; never `fameOf`, the world's widest knowledge, §4.1 — PR §8.1 as cured) — and names two engine deed sources for the slot table above (`patrol_clash`, `patrol_catch`). `patrol_joins`' default between the ally court and the asking town reads the LANDED PAIR STATE in every arm (PR §10.1(d) as cured), never `courtRegardOf`: a court's feeling about a town is a refused pair (§2.2), and RN's regard could enter only through a PERSON decider (`actingOfficer`, §5.2) if a later wave wants one " + C + "SEAMS-r2-11: this bracket itself named `courtRegardOf` for a court↔town question RN never holds]. Patrols stay a map-only picture while PR is dark; when PR lights, the host's patrol facts go OUT through the events WINDOW (H9) like every other fact — H16 is the map's INBOUND door, which the host never consumes (RULINGS-ROUND2b HOST-r2-5; PR §13) " + C + "HOST-r2-5, the chair's correction (routed by `cure/D-PL-r2b.md` §5.3): \"opens H16\" echoed the chair's withdrawn words] — so no RN read of a patrol exists before PR lights;")

# 9 §3.4 registered tellings
E("PT-4 adds the deed's PARTS (backing, reason, proof) and their visibility thresholds to the read model; RN reads only the visible version (`ver` and `mag`, §5.1).",
  "PT-4 adds the deed's PARTS (backing, reason, proof) and their visibility thresholds to the read model; RN reads only the visible version (`ver` and `mag`, §5.1).\n\n**REGISTERED TELLINGS THAT ARE NOT DEEDS** (`TELLING_SOURCES`, §2.4). The same one call inside `advanceRumorLedgers` (it already receives `worldState`: `export function advanceRumorLedgers({ worldState, feedEntries, graph, tick, … })`) also seeds the tellings of a CLOSED registration list — CH's two rows: the LEAK of a covert hire (CH §9 road 1: `eventRef` `leak:<wnpcId>:<employerId>`, hop-0 origin the worked-against town) and the POSTED OPERATIVE'S FINDINGS (CH §8: one telling about its post, hop-0 origin the meeting town). Each row is a pure function of `(worldState, tick)` returning its seeds `{ eventRef, eventTick, originIds, significance, score, content }`; the arm builds each seed exactly as it builds a deed's (the landed arrival record: `hopCount: 0`, `provenance: { originId, relayIds: [] }`, `completeness01: 1`), copies only the structured content fields the row DECLARES (`captureContent`'s law: \"ONLY structured fields are copied\"; each declared field is a persisted rumor-ledger field whose lifecycle row is its OWNER's — CH's), and never writes a person or a party into `partyIds`. A registered telling carries no `deed:` eventRef, so RN's heard pass (§5.1) never reads it: it moves no fame, no regard and no credibility; CH's pass in THE ONE PERSON STAGE reads its arrivals (CH's `paragonBeliefs`). Its belief-map refresh through `reportsBySubject` is CH's flag's disclosed shift (`paragonCovertEnabled`), never RN's. Host: zero further lines — the list is read inside `renown/deedTelling.js`, so CH's ≤ 3-line fallback in `rumorNetwork.js` is not needed (PLAUSIBLE until CH-7's car-0 measures that each row's inputs stand on `worldState` at the rumor stage, the tick after CH's pass wrote them). " + C + "D-CH-r2 §5.2(d): CH's leak (§9) and findings (§8) named RN's telling arm as their seeding seam, PLAUSIBLE until RN's arm took a registered source; it now takes them, by a closed list.]")

# 10 §4.1 corps fame
E("**Counterforce:** time, by the one half-life; a struck deed; no deed, no fame beyond office.",
  "**Counterforce:** time, by the one half-life; a struck deed; no deed, no fame beyond office. The actor is a person, a corps or the party (RN1); a CORPS holds no office, so its office scope is `unknown` and its fame is its deeds' alone — its `legend_recorded` at introduction first (CH §2.2b) " + C + "SEAMS-r2-6].")

# 11 §5.1 corps hearing + mount threading
E("A person holder hears what the town it STANDS IN has heard (the npcLedger `residency`/`placed` host; R1 RF-6).",
  "A person holder hears what the town it STANDS IN has heard (the npcLedger `residency`/`placed` host; R1 RF-6). A CORPS holder (`u:`) hears what the town its unit stands at has heard — the node its free unit's position names (WC §1.7.2's army-style stepper, read as `armyTransit.js :: currentRegion`: \"the node at its position along the path (rounded to the nearest hop)\"; PLAUSIBLE until WC-10 lands, named at CH-10's car) " + C + "SEAMS-r2-6].")
E("reads each through §6's lenses for the town (`s:`) and for the graduated persons standing there (`p:`),",
  "reads each through §6's lenses for the town (`s:`), for the graduated persons standing there (`p:`) and for a marked company standing there (`u:`),")
E("its world returned to the kernel unconditionally (`memoryState = envoys.worldState;`); `envoyPulse.js` 332 → ≈ 336; zero kernel lines.",
  "its world returned to the kernel unconditionally (`memoryState = envoys.worldState;`); `envoyPulse.js` 332 → ≈ 336; zero kernel lines. THE MOUNT THREADS THREE BINDINGS (measured at `81f1cd963`): the early return hands back its INPUTS (`if (!envoyDiplomacyActive(worldState)) { return { worldState: meetingLedgers.changed ? meetingLedgers.worldState : worldState, regionalGraph, wizardNews, settlementUpdates, …`), the full path re-reads the ORIGINAL parameters (`let feed = wizardNews;` · `let updates = settlementUpdates;`), and the kernel keeps all three (`memoryState = envoys.worldState;` · `settlementUpdates = envoys.settlementUpdates;` · `wizardNews = envoys.wizardNews;`). The stage therefore REBINDS the three parameters `worldState`, `wizardNews` and `settlementUpdates` from its result before ENC-3's drop pass and the early return, so both returns and the full path's `snapshotWithUpdates(snapshot, settlementUpdates, state, regionalGraph)` read the rebound values with no further edit (no `no-param-reassign` rule in `eslint.config.js`); CH's court hits (CH §9, written into `settlementUpdates`) and any Herald line a registered pass appends survive a world whose envoy gate is shut. ≈ 4 host lines: one call and one rebinding " + C + "D-CH-r2 §5.2(a) · CH-r1-30: RN named no `settlementUpdates` threading, so CH's court hits would have been lost on the early return].")

# 12 §5.6 anchor for a corps
E("(the holder's settlement; for a person, where it stands; for a deed, its first witness)",
  "(the holder's settlement; for a person, where it stands; for a corps, the town its unit stands at, else its employer's seat " + C + "SEAMS-r2-6]; for a deed, its first witness)")

# 13 §6.2 corps coordinates
E("a BODY — its ruler's person lens. **Which character each holder reads, declared:**",
  "a BODY — its ruler's person lens; a CORPS (`u:`) — its mark's authored `alignment` (`NPC_ALIGNMENTS`, CH P1) through the person lens's declared-alignment arm, its μ from the mark's `character.axes` exactly as a paragon's (below), and no force coordinate (it carries no roster traits, so the force term reads no signal, as for a town) " + C + "SEAMS-r2-6]. **Which character each holder reads, declared:**")

# 14 §7 readers
E("**Readers:** an actor's willingness to accept \"later\" (PT), the truth chasing a rumor (PT), the dossier's sentence;",
  "**Readers:** an actor's willingness to accept \"later\" (PT's answer `later`: `partyCredibilityAt` at the requester's town), the dossier's sentence " + C + "D-PT-r2 §5.1(c): \"the truth chasing a rumor (PT)\" is struck — once A.2 withdrew credibility's scaling of a told reason, PT's correction (`SEND_WORD`) reads no credibility: it replaces a version by the parts it carries (§3.3)];")

# 15 §10 envoyPulse row
E("| 332 | ≈ 4 (the pre-gate pass; CH and PT register on its closed list) | none needed |",
  "| 332 | ≈ 4 (the pre-gate pass — one call and one rebinding of `worldState`, `wizardNews` and `settlementUpdates`, which both returns read, §5.1; CH and PT register on its closed list) " + C + "D-CH-r2 §5.2(a)] | none needed |")

# 16 §12 host flags
E("`npcConsequencesEnabled` (person keys and `npc_verdict`),",
  "`npcConsequencesEnabled` (person keys and `npc_verdict`), CH's `paragonCorpsEnabled` with WC's `freeCompaniesEnabled` (corps keys `u:`; SEAMS-r2-6),")

# 17 §13 pins
E("the party never holds an entry (refused at the writer); `dmSet` wins until lifted and survives reload; the ransom projection's three rows.",
  "the party never holds an entry (refused at the writer); `dmSet` wins until lifted and survives reload; the ransom projection's three rows. Round 2b pins: the stage's rebinding — a registered pass's write into `settlementUpdates` or `wizardNews` reaches the kernel with `envoyDiplomacyActive` false and true alike (D-CH-r2 §5.2(a)); a refused-pair read (`regardOf`/`courtRegardOf` with an `s:`/`c:` holder and an `s:`/`c:` subject) returns `null` with reason `pair_state`, never a number (SEAMS-r2-11); a `u:` holder keeps an entry about the court that retains it, and a town's commons one about the company (SEAMS-r2-6); a disbanded company's entries are skipped and return exactly when the disbandment is undone.")
E("a realm deed reads realm about two and a half years and then regional.",
  "a realm deed reads realm about two and a half years and then regional; a registered `TELLING_SOURCES` telling seeds once per seed, copies only its declared content fields and moves no fame, regard or credibility (no `deed:` eventRef — D-CH-r2 §5.2(d)); a corps doer and a party deed's `partySeq` survive a save round-trip through the one normalizer (SEAMS-r2-6, D-PT-r2 §5.1(a)).")

# 18 §14 lifecycles
E("| regenerate | person keys are `wnpc_` only (RN16); town and court keys are settlement ids, stable across rerolls |",
  "| regenerate | person keys are `wnpc_` only (RN16); town and court keys are settlement ids, stable across rerolls; corps keys are WC's `unitKey` (world-scoped lived history, untouched by a settlement reroll) " + C + "SEAMS-r2-6] |")
E("entries ABOUT the dead stay until they decay (the dead are remembered) [CURED 2026-10-18 (fp-final r1) — RN-r1-15] |",
  "entries ABOUT the dead stay until they decay (the dead are remembered) [CURED 2026-10-18 (fp-final r1) — RN-r1-15]; a CORPS' disbandment (the DM's `disband`, CH §16b; WC's `dissolving` road) is its death — its entries are skipped while its unit is absent and pruned only by decay, and undoing the disbandment restores them exactly " + C + "SEAMS-r2-6] |")
E("| create | the deed arm of `advanceRumorLedgers` seeds an arrival with `eventRef: deed:<deedId>` and a typed `doerRef` (an actor-ref string, never in `partyIds`) |",
  "| create | the deed arm of `advanceRumorLedgers` seeds an arrival with `eventRef: deed:<deedId>` and a typed `doerRef` (an actor-ref string, never in `partyIds`); the same call seeds the registered `TELLING_SOURCES` rows' tellings (§3.4), whose declared content fields carry their OWNER's lifecycle row (CH's) " + C + "D-CH-r2 §5.2(d)] |")

# 19 §15 rows
E("| R48 | a deed marked `moralWeight: heroic` with proof `unspoken`, heard at a town | the town reads the derived value; the DM's view shows `heroic` [CURED 2026-10-18 (fp-final r2) — A.2] |",
  "| R48 | a deed marked `moralWeight: heroic` with proof `unspoken`, heard at a town | the town reads the derived value; the DM's view shows `heroic` [CURED 2026-10-18 (fp-final r2) — A.2] |\n"
  "| R49 | persons, CH's corps and WC-10 lit; Merewick retains the Grey Company (`u:<unitKey>`); later the company sells Merewick out | the company holds an entry about `c:<Merewick>` (not refused); the `sold_out` deed's doer is `{kind:'corps', id}` and survives a reload; every hearer's regard of `u:<unitKey>` falls (villainous on its face); no entry keys the company as `c:`; with WC-10 dark no `u:` key exists anywhere " + C + "SEAMS-r2-6] |\n"
  "| R50 | DARK until THE PASSAGE lands: a witnessed `trespassed` crossing of B's land by A's army | one `passage_trespassed` deed (doer `{kind:'settlement', id: A}`, witnesses the territories crossed); no fame for A's court; no town's or court's RN regard of A moves (the pair state moves by PS's own writer); a paragon who hears it holds a term about `c:<A>` " + C + "SEAMS-r2-13] |\n"
  "| R51 | any world; a caller asks `courtRegardOf(c:<ally>, c:<asker>)` or `regardOf(s:<x>, s:<y>)` | `null`, reason `pair_state`; the landed pair state is what the caller reads (PR's `patrol_joins` reads it directly) " + C + "SEAMS-r2-11] |\n"
  "| R52 | `envoyDiplomacyActive` false; CH's pass writes a court hit into `settlementUpdates` | the kernel receives it (the early return hands back the stage's rebound `settlementUpdates`); the same with the gate lit " + C + "D-CH-r2 §5.2(a)] |\n"
  "| R53 | a belief preset with CH's covert arm lit; a leak telling seeded by its registered row | one hop-0 arrival at the worked-against town; RN's heard pass writes no term from it; no fame or credibility moves; CH's pass reads its arrival " + C + "D-CH-r2 §5.2(d)] |\n"
  "| R54 | the DM sets the party's presence and records a party deed in the same tick | the deed carries `partySeq` through RN's normalizer (a reload keeps it); `whereaboutsOf` orders the two by it (PT3) " + C + "D-PT-r2 §5.1(a)] |\n"
  "| R55 | persons and CH lit; a court asks where a paragon is | `believedWhereabouts` = the `actAt` of the newest deed of that paragon by `heardAt(...).heardTick` at the court's town; the omniscient arm's newest deed in that arm " + C + "D-CH-r2 §5.2(c)] |")

# 20 §16 rulings
E("| OD-RN-35 | Sites and patrols | no RN site or patrol number; deeds at sites through the doors that already mint; slot rows `site_verdict`, `patrol_clash`, `patrol_catch` (RULINGS-ROUND2 §E) |",
  "| OD-RN-35 | Sites and patrols | no RN site or patrol number; deeds at sites through the doors that already mint; slot rows `site_verdict`, `patrol_clash`, `patrol_catch` (RULINGS-ROUND2 §E); PR's one RN read is `fameIn` (its joins read the landed pair state, SEAMS-r2-11) |\n"
  "| OD-RN-36 | THE CORPS' key (RULINGS-ROUND2b SEAMS-r2-6; a persisted key grammar) | `u:<unitKey>` — a holder and a subject as a person is, the refused-pair rule binding `s:`/`c:` only; doer and target `{kind:'corps', id: unitKey}`; fame by deeds alone; its lens the mark's authored alignment and chart; it hears at its unit's town; lit only with CH's corps and WC-10 |\n"
  "| OD-RN-37 | The passage's tale (SEAMS-r2-13) | the slot row `passage` (PS · C14), kinds `passage_kept · passage_breached · passage_trespassed`, doer the mover's court (or a retained corps), witnesses the territories crossed — a tale: no court fame, no RN court↔court regard |\n"
  "| OD-RN-38 | Non-deed tellings (D-CH-r2 §5.2(d)) | a closed `TELLING_SOURCES` list read by RN's one telling call; CH's leak and findings its two rows; never deeds, never renown facts |\n"
  "| OD-RN-39 | The person stage's bindings and the refused-pair read (D-CH-r2 §5.2(a); SEAMS-r2-11, REFINED) | the stage rebinds `worldState`, `wizardNews` and `settlementUpdates` before the early return, so both returns carry every registered pass's writes; a refused-pair read returns `null` (`pair_state`) |")

# 21 §18 refinements + open
E("· round 2 (2026-10-18): the 10-18 doctrines read (under the status line) · sites and patrols considered (§3.1) · the slot rows `site_verdict`, `patrol_clash`, `patrol_catch` (§3.1).",
  "· round 2 (2026-10-18): the 10-18 doctrines read (under the status line) · sites and patrols considered (§3.1) · the slot rows `site_verdict`, `patrol_clash`, `patrol_catch` (§3.1) · round 2b (2026-10-18): a refused-pair read returns `null` with reason `pair_state`, pinned (§2.2, SEAMS-r2-11).")
E("RN-S1 and the deed ledger's ownership are RULED (RULINGS-AFTER-COMPILE); OD-RN-14 is accepted.",
  "RN-S1 and the deed ledger's ownership are RULED (RULINGS-AFTER-COMPILE); OD-RN-14 is accepted. (3) Round 2b routes (`cure/D-RN-r2b.md` §5): CH re-points its three `c:<unitKey>` lines (§16b, CH-10, OD-CH-36) to RN's `u:<unitKey>`; PS strikes \"a court's fame moves\" (PS13 and its §14 RN row) — the passage deed is a tale, and RN keeps no court fame (RN1); the fold at P4 adds `corps` to §3.3.12, the `passage` slot row and `TELLING_SOURCES` to its §5 rows, and the stage's three bindings to §3.1.22. (4) For the chair: the fold's `party_voiced` trigger reads \"a court, or a person of `regional` fame\" (fold §3.4), while RN §5.5's crossing reads the HOLDER's fame, which a court does not have (RN1) — RN's reading is that a court speaks through its ruler (a `p:` holder once persons light; voices need persons, §12), so the fold's word \"a court\" means its ruler; unchanged here.")

for old, new in EDITS:
    n = src.count(old)
    if n != 1:
        print('ANCHOR COUNT', n, 'for:', old[:120]); sys.exit(1)
for old, new in EDITS:
    src = src.replace(old, new, 1)
io.open(PATH, 'w', encoding='utf-8').write(src)
print('applied', len(EDITS), 'edits')
