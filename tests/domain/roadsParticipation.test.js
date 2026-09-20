/**
 * roadsParticipation.test.js — THE PARTICIPATION CHOKEPOINT (R-4a; DESIGN_THE_ROADS.md §8).
 *
 *  1. THE MASTER GATE — buildWorldSnapshot excludes an OFF-STAGE NPC (a hostage OR a
 *     DM-shelved NPC) from the settlement every pulse kernel reads, while a TRAVELLER stays
 *     in (travel is narrative, captivity is mechanical). One edit shelves a hostage from
 *     agency/growth/recruitment/blocs/ladder/councils/coups.
 *  2. THE LADDER BELT — eligibleMembersOf excludes a hostage (defense-in-depth).
 *  3. THE INVENTORY RATCHET — the set of `.npcs` readers in worldPulse+spatial is PINNED
 *     (the §8 census). A NEW reader trips this test until it is dispositioned (widen the belt
 *     or confirm it is via-snapshot) — the structural-prevention discipline.
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { eligibleMembersOf, ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';
// EM-B1k (A3, A5): the write-base cure is proved AT THIS CHOKEPOINT, because the thing it must
// not disturb is exactly what this file pins — the participation view. A3 drives the SHIPPED
// pulse entry so the seam under test is the real one; A5 is the regression belt around it.
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { applyWorldPulseResultToState } from '../../src/store/campaignPulseHelpers.js';
import { ensureRegionalGraph } from '../../src/domain/region/graph.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { applyNpcOp } from '../../src/store/settlementPendingEditWriters.js';
import { factionLifecycleStateOf } from '../../src/domain/density/factionLifecycle.js';
import { DENSITY_LAW_CONFIG_KEY, REGISTER_VII_DENSITY_LAW_VERSION } from '../../src/domain/density/densityLaw.js';
import { rosterPersonAvailable } from '../../src/domain/worldPulse/envoyCasting.js';
import { readWarSeatBooks } from '../../src/domain/worldPulse/warSeatBooks.js';
import { isOffStage } from '../../src/domain/roads/state.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

describe('participation chokepoint — the master gate (buildWorldSnapshot, §8)', () => {
  const npcs = [
    { id: 'home', name: 'Homebody', importance: 'notable' },
    { id: 'trav', name: 'Traveller', importance: 'notable', whereabouts: { state: 'traveling', placeId: 'd', missionId: 'm1' } },
    { id: 'visit', name: 'Visitor', importance: 'notable', whereabouts: { state: 'visiting', placeId: 'd', missionId: 'm2' } },
    { id: 'hos', name: 'Hostage', importance: 'notable', whereabouts: { state: 'hostage', placeId: 'e', missionId: 'm3' } },
    { id: 'shelved', name: 'Shelved', importance: 'notable', stasis: { reason: 'imprisoned' } },
  ];
  const save = { id: 's', name: 'S', phase: 'canon', settlement: { name: 'S', npcs }, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
  const campaign = { id: 'c', settlementIds: ['s'], worldState: { tick: 0, simulationRules: {} } };

  it('a HOSTAGE and a DM-shelved NPC are excluded; a TRAVELLER/VISITOR and a home NPC stay in', () => {
    const snap = buildWorldSnapshot({ campaign, saves: [save], worldState: campaign.worldState });
    const present = new Set((snap.byId.get('s').settlement.npcs || []).map((n) => n.id));
    expect(present.has('home'), 'home NPC participates').toBe(true);
    expect(present.has('trav'), 'a traveller still participates (travel is narrative)').toBe(true);
    expect(present.has('visit'), 'a visitor still participates').toBe(true);
    expect(present.has('hos'), 'a HOSTAGE is off-stage (mechanical absence)').toBe(false);
    expect(present.has('shelved'), 'a DM-shelved NPC is off-stage').toBe(false);
  });

  it('the raw save roster is UNTOUCHED — off-stage NPCs persist (no-death; nothing dropped)', () => {
    buildWorldSnapshot({ campaign, saves: [save], worldState: campaign.worldState });
    expect(save.settlement.npcs.map((n) => n.id).sort()).toEqual(['home', 'hos', 'shelved', 'trav', 'visit']);
  });

  it('dormant (no off-stage NPC) ⇒ same settlement reference (zero allocation)', () => {
    const plain = { id: 'p', name: 'P', phase: 'canon', settlement: { name: 'P', npcs: [{ id: 'a', importance: 'notable' }] }, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
    const snap = buildWorldSnapshot({ campaign: { ...campaign, settlementIds: ['p'] }, saves: [plain], worldState: campaign.worldState });
    expect(snap.byId.get('p').settlement, 'no allocation when nobody is off-stage').toBe(plain.settlement);
  });

  it('EM-B1k A3 — a house whose SOLE member is shelved survives the tick: crewed, seated, no dissolution beat', () => {
    // THE IRREVERSIBLE CONSEQUENCE, AND THE GUARD THAT WAS RIGHT ALL ALONG. §810.4 R18: an
    // irreversible consequence may only be triggered by irreversible causes, and
    // factionDensityKernel's own `stillEmpty` confirmation re-reads the roster at the moment it
    // applies. It failed only because the base it re-read was the PARTICIPATION VIEW. Shelving
    // is a reversible stage mark; dissolving a house is permanent. THE POPULATION AT RISK,
    // measured over the 525-row golden corpus: 1,608 of 3,378 factions (47.6%) hold exactly ONE
    // rostered member, 147 of them governing, and 100% of settlements hold at least one.
    const crown = { id: 'fac.crown', name: 'The Crown', faction: 'The Crown', isGoverning: true, power: 40 };
    const weavers = { id: 'fac.weavers', name: 'The Weavers', faction: 'The Weavers', power: 12 };
    const member = (house, extra) => ({ id: `npc.${house.replace(/\W/g, '')}`, name: `Factor of ${house}`, factionAffiliation: house, status: 'active', importance: 'notable', ...extra });
    const ashfordWith = (weaverExtra) => ({
      id: 'ashford', name: 'Ashford', tier: 'town',
      config: { [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION },
      npcs: [member('The Crown', {}), member('The Weavers', weaverExtra)],
      powerStructure: { governingName: 'The Crown', factions: [crown, weavers], seatOfPower: 'The Crown', publicLegitimacy: { score: 55 }, factionRelationships: [] },
    });
    const tickOnce = (settlement) => {
      const save = { id: 'ashford', name: 'Ashford', phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
      const world = { rngSeed: 'em-b1k-a3', tick: 4, simulationRules: {} };
      const result = simulateCampaignWorldPulse({
        campaign: { id: 'c-em-b1k-a3', name: 'C', settlementIds: ['ashford'], worldState: world, regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }), wizardNews: { currentTick: 4, entries: [] } },
        saves: [save], interval: 'one_month', commit: true, now: '2026-01-01T00:00:00.000Z',
      });
      const out = result.settlementUpdates[0].settlement;
      return { out, houses: (out.powerStructure?.factions || []).map((f) => String(f.name)), beats: (result.wizardNews?.entries || []).map((e) => String(e.impactKind || e.kind)) };
    };

    const control = tickOnce(ashfordWith({}));
    expect(control.houses, 'THE CONTROL: with its member on stage the house is untouched').toEqual(['The Crown', 'The Weavers']);

    const shelved = tickOnce(ashfordWith({ stasis: { reason: 'sequestered' } }));
    expect(
      shelved.houses,
      `A HOUSE WAS DISSOLVED BECAUSE ITS ONE MEMBER WAS SHELVED (houses ${JSON.stringify(shelved.houses)},`
      + ` lifecycle '${factionLifecycleStateOf(shelved.out, weavers)}', beats ${JSON.stringify(shelved.beats)}).`
      + ' Shelving is reversible; dissolution is not — the confirmation re-read a roster the'
      + ' participation filter had already shortened.',
    ).toEqual(['The Crown', 'The Weavers']);
    expect(factionLifecycleStateOf(shelved.out, weavers), 'the house still reads crewed by the estate\'s own lifecycle reader').toBe('crewed');
    expectAbsentWithAnchor(shelved.beats, 'faction_dissolved', 'faction_service_bolster', 'the tick must not narrate a dissolution that did not happen');
  });

  it('EM-B1k A5 — the participation reads are UNCHANGED, the post-time view is re-derived from the raw save, and a shelved person is frozen', () => {
    // ⛔ THE CURE'S CHIEF BURDEN. Three movers `.map` the update roster with an index, so under a
    // RAW write base they iterate more people than they used to. This arm is the proof that not
    // one participation guarantee moved with them. Measured denominators behind it: 24 corpus
    // towns swapped base-for-base moved worldState in 0 and a settlement key in only 6, every one
    // of those six a SPURIOUS faction_interregnum the cure REMOVES.
    const guild = { id: 'f1', name: 'Guild', faction: 'Guild', isGoverning: true, power: 40 };
    const fkey = ladderFactionKey(guild);
    const free = { id: 'free', name: 'Alia', importance: 'key', factionAffiliation: 'Guild', structuralRank: 'dominant', status: 'active' };
    const shelvedNpc = { ...free, id: 'shelved', name: 'Bram', stasis: { reason: 'imprisoned' } };
    const court = { id: 's', name: 'S', npcs: [free, shelvedNpc], powerStructure: { governingName: 'Guild', factions: [guild], seatOfPower: 'Guild', publicLegitimacy: { score: 55 } } };
    const world = { tick: 4, simulationRules: {} };
    const snap = buildWorldSnapshot({ campaign: { id: 'c', settlementIds: ['s'], worldState: world }, saves: [{ id: 's', name: 'S', phase: 'canon', settlement: court, campaignState: { phase: 'canon', eventLog: [], locks: {} } }], worldState: world });

    // 1. never cast · 2. never on stage for the roads lane · 3. never ladder-eligible
    expect(rosterPersonAvailable(free), 'LIVENESS: the free sibling IS castable').toBe(true);
    expect(rosterPersonAvailable(shelvedNpc), 'a shelved person is still never cast').toBe(false);
    expect(isOffStage(free), 'LIVENESS: the free sibling is on stage').toBe(false);
    expect(isOffStage(shelvedNpc), 'a shelved person is still off-stage for the roads lane').toBe(true);
    const ladder = eligibleMembersOf('s', court, guild, fkey).map((r) => r.npcId);
    expect(ladder, 'the ladder belt still admits the free member and only them').toEqual([npcId('s', free, 0)]);
    // 4. never holds the war seat — with the SHELVED person as the only seated candidate
    const booksFor = (npc) => {
      const sole = { ...court, npcs: [npc] };
      const seatWorld = { ...world, spatialLedgers: { npcLadder: { s: { factions: { [fkey]: { rungs: [npcId('s', npc, 0)] } } } } } };
      const seatSnap = buildWorldSnapshot({ campaign: { id: 'c', settlementIds: ['s'], worldState: seatWorld }, saves: [{ id: 's', name: 'S', phase: 'canon', settlement: sole, campaignState: { phase: 'canon', eventLog: [], locks: {} } }], worldState: seatWorld });
      return readWarSeatBooks({ worldState: seatWorld, snapshot: seatSnap, actorId: 's', opponentId: 'o' });
    };
    expect(booksFor(free).securityBand, 'LIVENESS: an on-stage ruler really does seat').toBe('secure');
    expect(booksFor(shelvedNpc).securityBand, 'a shelved ruler still holds no war seat').toBe('unseated');
    // 5. the dormancy reference — nobody off-stage ⇒ the SAME settlement object
    const plainSettlement = { id: 'p', name: 'P', npcs: [free] };
    const plainSnap = buildWorldSnapshot({ campaign: { id: 'c', settlementIds: ['p'], worldState: world }, saves: [{ id: 'p', name: 'P', phase: 'canon', settlement: plainSettlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } }], worldState: world });
    expect(plainSnap.byId.get('p').settlement, 'a world with nobody off-stage still passes the settlement through by reference').toBe(plainSettlement);
    expect(snap.byId.get('s').settlement.npcs.map((n) => String(n.id)), 'and the filtered view is still exactly the on-stage roster').toEqual(['free']);

    // 6+7. THE POST-TIME CONFIRMATION and THE FROZEN CLAUSE, through a real committed tick.
    const town = generateSettlementPipeline({ settType: 'town', culture: 'anglo_saxon', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' }, null, { seed: 'em-b1k-a5', customContent: {} });
    town.id = 'ashford';
    const shelfStore = { settlement: town };
    applyNpcOp(() => shelfStore, (fn) => fn(shelfStore), { kind: 'stasis-npc', payload: { npcId: String(town.npcs[0].id), reason: 'sequestered' } });
    const preRecord = JSON.parse(JSON.stringify(town.npcs[0]));
    const townSave = { id: 'ashford', name: town.name, phase: 'canon', settlement: town, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
    const townWorld = { rngSeed: 'ws-em-b1k-a5', tick: 4, simulationRules: {} };
    const townCampaign = { id: 'c-em-b1k-a5', name: 'C', settlementIds: ['ashford'], worldState: townWorld, regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }), wizardNews: { currentTick: 4, entries: [] } };
    const townResult = simulateCampaignWorldPulse({ campaign: townCampaign, saves: [townSave], interval: 'one_month', commit: true, now: '2026-01-01T00:00:00.000Z' });
    const townState = { savedSettlements: [JSON.parse(JSON.stringify(townSave))], activeSaveId: 'ashford', settlement: null, systemState: null, editedAt: null };
    const persisted = applyWorldPulseResultToState(townState, townCampaign, townResult, '2026-01-01T00:00:00.000Z')[0].settlement;
    // The projection is recomputed FROM TRUTH rather than from a previous projection: the save
    // the tick wrote holds the shelved person, and the view derived from it still hides them.
    const postSnap = buildWorldSnapshot({ campaign: { id: 'c-em-b1k-a5', settlementIds: ['ashford'], worldState: townWorld }, saves: [{ ...townSave, settlement: persisted }], worldState: townWorld });
    const postItem = postSnap.byId.get('ashford');
    expect((postItem.save.settlement.npcs || []).some((n) => String(n.id) === String(preRecord.id)), 'THE POST-TIME SAVE must INCLUDE the shelved person — the raw roster survived the tick').toBe(true);
    expect((postItem.settlement.npcs || []).some((n) => String(n.id) === String(preRecord.id)), 'and the post-time VIEW must still EXCLUDE them — participation is unchanged').toBe(false);
    const postRecord = (persisted.npcs || []).find((n) => String(n.id) === String(preRecord.id));
    expect(postRecord, 'THE FROZEN CLAUSE needs the person to still exist to be frozen').toBeTruthy();
    const movedKeys = [...new Set([...Object.keys(preRecord), ...Object.keys(postRecord || {})])]
      .filter((k) => JSON.stringify(preRecord[k]) !== JSON.stringify((postRecord || {})[k]));
    expect(movedKeys, 'A TICK WROTE ONTO A SHELVED PERSON. Stasis means frozen: a mover that now iterates the raw roster must not mark somebody who was not on stage').toEqual([]);
  });
});

describe('participation chokepoint — the ladder belt (eligibleMembersOf, §8)', () => {
  it('a hostage is excluded from ladder eligibility (defense-in-depth)', () => {
    const faction = { id: 'f1', name: 'Guild', isGoverning: true };
    const fkey = ladderFactionKey(faction);
    const settlement = {
      name: 'S', npcs: [
        { id: 'a', name: 'Alia', importance: 'key', factionAffiliation: 'Guild', structuralRank: 'dominant' },
        { id: 'b', name: 'Bram', importance: 'key', factionAffiliation: 'Guild', structuralRank: 'dominant', whereabouts: { state: 'hostage', placeId: 'e', missionId: 'm' } },
      ],
    };
    const rows = eligibleMembersOf('s', settlement, faction, fkey);
    const ids = new Set(rows.map((r) => r.npcId));
    expect(ids.has(npcId('s', settlement.npcs[0], 0)), 'the free member is eligible').toBe(true);
    expect(ids.has(npcId('s', settlement.npcs[1], 1)), 'the hostage is NOT eligible').toBe(false);
  });
});

describe('participation chokepoint — the .npcs-reader inventory ratchet (§8 census)', () => {
  // Every reader below is DISPOSITIONED (§8 table): worldSnapshot = THE MASTER GATE (widened
  // to isOffStage); npcLadderState = the BELT (widened); roadsKernel = the roads mover (reads
  // the FULL roster to manage hostages); partyImpact = the RAW READER (deliberately ungated —
  // DM sovereignty); everything else is via-snapshot (protected by the gate, no edit). A NEW
  // reader added here must be dispositioned before this pin is updated.
  //
  // ⛔ EM-B1k2 NARROWED THAT BLANKET, because it was FALSE of four rows and nobody had asked.
  // "everything else is via-snapshot" covers a reader that receives the SNAPSHOT. It does not
  // cover a reader whose base is its CALLER'S CHOICE, and `settlementLifecycleFirstClass.js`
  // and `successorNpc.js` are exactly that: permanent roster writers with no save in their
  // signatures, sitting here with no disposition at all and inheriting a sentence that was
  // never about them. Nor does it cover the two density roots the scan now reaches. Those four
  // rows carry their own dispositions below; the blanket binds only the rows that carry none.
  // ⛔ A row with no written disposition of its own is a row nobody has judged — the next
  // reader to notice that should write one, not widen this paragraph.
  const EXPECTED = [
    // ⭐ EM-B1k2 — THE R18 LAW ITSELF, and the row the widened roots exist for.
    // `factionRosterOf` (:113) is the estate's roster filter and `readFactionLifecycle` (:155)
    // is the §810.4 R18 law that reads it. PARTICIPATION-INDEPENDENT BY CONSTRUCTION AND
    // REQUIRED TO BE: it decides an IRREVERSIBLE consequence — a house swept out of
    // `powerStructure.factions` — and R18 admits only irreversible causes. Both of its
    // production callers in factionDensityKernel.js now hand it a RAW roster: the law at
    // `tickStart` (EM-B1k2) and the confirmation at `fresh` (EM-B1k). ⛔ A caller that hands
    // it the participation view dissolves a house because somebody is shelved — which is the
    // defect EM-B1k2 removed the habitat for, measured 7 of 7 towns before the cure.
    'src/domain/density/factionLifecycle.js',
    // THE DECOMPOSITION WAVE (war tranche, file 4) moved seedBetrayalTraitor — the one
    // `.npcs` read the apply pass owned — verbatim out of applyWorldPulse.js into this
    // leaf. Same reader, same disposition (via-snapshot, protected by the gate, no edit);
    // only the address changed, so the row moved rather than a new reader appearing.
    'src/domain/worldPulse/applyWorldPulseBetrayal.js',
    // V-K THE ASSIZE (dark): a RAW roster read (the roadsKernel/partyImpact idiom), gated by
    // assizeEnabled — scans the full roster for a corrupt un-ousted seat-holder (captured-bench
    // detection) and for the masses. Dormant by default (no flag in DEFAULT_SIMULATION_RULES);
    // participation-independent (the assize reads standing/corruption, not stage presence).
    'src/domain/worldPulse/assizeKernel.js',
    'src/domain/worldPulse/causeLifecycle.js',
    'src/domain/worldPulse/clergyTraitPlane.js',
    // V-K THE COMMONS' VOICE (dark): a RAW roster read gated by commonsVoiceEnabled — reads the
    // roster for the persistent per-settlement commons sidecar. Dormant by default; participation-
    // independent (reads legitimacy/corruption/unrest scalars, not stage presence).
    'src/domain/worldPulse/commonsVoiceKernel.js',
    'src/domain/worldPulse/corruptionImpair.js',
    'src/domain/worldPulse/corruptionWeb.js',
    'src/domain/worldPulse/disposition.js',
    // ENC-3 THE CHANCE-MEETING STAGE (dark): VIA-SNAPSHOT, protected by the master gate,
    // and the gate is WANTED here rather than merely tolerated. All three `.npcs` reads in
    // the file reach the roster through the same one accessor — `placeOf(snapshot, sid)`,
    // which returns `snapshot.byId.get(sid).settlement` — and the snapshot handed to the
    // stage is `envoyPulse.js`'s `snapshotWithUpdates(...)` re-projection of
    // `buildWorldSnapshot`'s rows, i.e. the participation view this file's master-gate arm
    // above pins. There is no raw `item.save` roster read in the stage and no second door:
    // the traveller projection indexes the projected roster to mint its `npcId`, the
    // resident census walks the projected roster to weigh candidates, and the party
    // re-resolve reads the same projection. Participation-DEPENDENT, and correctly so —
    // this is the one lane where being off-stage is exactly the right reason not to be met.
    // A hostage or a DM-shelved figure filtered out here cannot be picked as a resident
    // candidate, cannot be marked, cannot be leaned on and cannot be taught, which is what
    // keeps a captive out of a feast he could not have attended; read through a raw roster
    // instead, the lane would deposit a bond between a foreign envoy and a man who is
    // physically in another realm's cell. Dark by default (`chanceEncountersEnabled` is
    // virtual — MEASURED absent from DEFAULT_SIMULATION_RULES and from all 7 presets), and
    // the flag gate sits ABOVE every read: `advanceChanceMeetings` returns its input state
    // before `projectTravellers` is called at all.
    'src/domain/worldPulse/envoyChanceMeetingStage.js',
    // ES-5b §3.11 THE ABSENCE COST: a RAW roster read, and it is the ONE disposition in
    // this table where the gate would not merely be unnecessary but would INVERT the
    // feature. `presenceSharesFor` indexes `settlement.npcs` to ask, of each faction
    // member, whether they are traveling/visiting/returning — i.e. it exists precisely to
    // find the people the participation view removes. Read through the gate, every away
    // member would be absent from the index, score ZERO away under the leaf's own
    // absent-is-not-away rule, and the discount would report a full court forever while
    // looking perfectly healthy. Participation-INDEPENDENT by construction, and hostages
    // are excluded on the leaf's own terms (§3.11 excludes them BY NAME — they are already
    // off-stage and are not fined twice) rather than by inheriting isOffStage. Dark by
    // default: `espionageActive` refuses before the roster is touched at all.
    'src/domain/worldPulse/espionage/espionagePresence.js',
    'src/domain/worldPulse/factionCapture.js',
    // TE-DENSITY-1 (§810.1 R8, the emergence mint): applyCadence reads the RAW roster of
    // `fresh` — the freshest SAVED copy the write lands on — solely to append the minted
    // FOUNDER (`npcs: [...npcs, founder]`) when a thicken step births a house. It is a
    // MUTATION read of the stripNpcInfluence/DM-verbs idiom, not a stage read:
    // participation-INDEPENDENT by construction, because the append must land on the raw
    // saved roster — written through the filtered projection it would strand the alias
    // copies (the JSON-alias trap) exactly as the H2 relinquishment would. No eligibility
    // question is asked of the roster; nobody is filtered in or out. Dormant by default:
    // the cadence runs only under the density law's version gate (`_densityLawVersion: 2`),
    // which no shipped world carries — proven by the landing's three bit-identical
    // dormancy probes.
    //
    // ⭐ EM-B1k2 ADDS THE SECOND CLAUSE, because TE-DENSITY-1 above is about `applyCadence`
    // ALONE and the file's OTHER roster reader inherited the via-snapshot blanket it had no
    // right to. THE LIFECYCLE READ IS IRREVERSIBLE, SO IT IS RAW: `tickStart` (the base
    // `readFactionLifecycle` decides a dissolution from) reads `asObject(item.save).settlement`
    // and its confirmation (`stillEmpty` over `fresh`) reads the roster EM-B1k made raw at the write
    // base. IRREVERSIBLE ⇒ RAW is the whole rule: a permanent consequence may not be computed
    // from a projection and then rescued by a second guard, because the rescue is one edit
    // away from being skipped (the `fresh` fallback is that edit already written). Every
    // REVERSIBLE reading in this file keeps the participation view — the emergence founder's
    // append at `applyCadence`, the interregnum marks — so the roads chokepoint is untouched.
    // ⚠ And TE-DENSITY-1's own claim was ASPIRATIONAL until EM-B1k landed: `fresh` really is
    // the raw saved roster now, so the append it describes lands where it says it does.
    'src/domain/worldPulse/factionDensityKernel.js',
    // D-7e clause (i) (round-3 F3): seatGratitudeSevToward reads the persisted LADDER
    // record's `.npcs` STANDINGS map (priorLedger[sid].npcs — ladder state, never the
    // settlement roster), so it is participation-independent by construction: a
    // captive seat-holder's standing (and bonds) persist through captivity exactly
    // like the credibility-prune idiom. No roster read exists in the file.
    'src/domain/worldPulse/gratitudeBonds.js',
    // D-2 (fold batch 3): the statecraft MOUTHPIECE draw reads the participation view (a
    // hostage cannot front a court's bluff — via-snapshot, protected); the credibility PRUNE
    // scan reads the UNTOUCHED item.save roster (the roadsKernel idiom) so a captive's
    // credibility key survives captivity.
    'src/domain/worldPulse/informationStatecraft.js',
    // W-K2 THE TIED PRACTITIONER (dark): tiedPractitionerOf / practitionerLoss /
    // ensureTiedPractitioner read the RAW, UNTOUCHED settlement roster (settlement.npcs)
    // because the question they ask is WHO LIVES HERE, not who acted this tick, and the
    // lane already carries its own correct filter — LOST_NPC_STATUS (dead, exiled,
    // missing, retired, removed). Participation-INDEPENDENT for three reasons, the third
    // of which is a defect the gate would actually cause. (1) A captive wizard is still
    // the town's wizard: design §3b makes the thorp's practitioner rung a PERSON, and a
    // band that flickered with captivity would make a settlement's magic skyline a
    // report on its hostage situation. (2) practitionerLoss exists precisely to tell
    // "never had one" apart from "had one and lost them"; behind the participation gate
    // a hostage practitioner would vanish from tiedPractitionerOf and the loss read would
    // narrate a death that did not happen. (3) ensureTiedPractitioner is a MUTATION write
    // of the stripNpcInfluence/npcDmVerbs kind, and its idempotency guard IS
    // tiedPractitionerOf — filtered, it would fail to see the captive practitioner and
    // mint a SECOND one, duplicating a named soul against the law 6 conservation the H1
    // census enforces. Dormant by default (magicEconomyEnabled is virtual, declared false
    // in the full_simulation spread and lit in no preset) and unwired: nothing in the
    // pulse calls this leaf yet.
    'src/domain/worldPulse/magicFormsPractitioner.js',
    'src/domain/worldPulse/momentum.js',
    'src/domain/worldPulse/npcAgency.js',
    // W-H3 THE DESTRUCTION DISPERSAL (dark): disperseCastToPool reads the RAW, UNTOUCHED
    // settlement roster (settlement.npcs) to graduate every named soul into the pool when
    // the town itself dies. Participation-INDEPENDENT by construction, and for the
    // strongest possible reason: the settlement is GONE, so a hostage, a shelved figure
    // and an on-stage magistrate are in exactly the same position, and filtering by
    // participation would leave whoever happened to be off-stage that tick attached to a
    // settlement that no longer exists. Law 6 CONSERVATION requires the dispersal see
    // every soul or it drops one. Dormant by default (npcConsequencesEnabled is declared
    // false in the full_simulation spread and lit in no preset), and nothing calls it
    // from the pulse yet.
    'src/domain/worldPulse/npcCirculation.js',
    // W-H4 THE THREE DM VERBS (dark): markRosterDeath and clearJailHold read the RAW,
    // UNTOUCHED roster of the HOST SAVE (settlement.npcs) to stamp a death mark and to
    // clear a jail hold. Both are MUTATION reads of the stripNpcInfluence kind, not stage
    // reads, and they are participation-INDEPENDENT for three separate reasons. (1) A DM's
    // ruling lands on a person whether or not they were on-stage this tick — and the people
    // a PARDON exists for are precisely the ones participation excludes, so filtering here
    // would make the mercy verb unable to reach a jailed figure. (2) The settlement these
    // functions receive is the SAVED settlement handed down by npcVerbsBody.js, never the
    // snapshot projection, so there is no gate between them and the roster to honour. (3)
    // Writing a mark through the filtered projection would strand the alias copies (the
    // JSON-alias trap) exactly as the H2 relinquishment would. Dormant by default
    // (npcConsequencesEnabled has no entry in DEFAULT_SIMULATION_RULES) and unreachable
    // from the pulse: only a DM pressing a verb calls it.
    //
    // ⚠ THE ADDRESS MOVED, THE READER DID NOT — the applyWorldPulseBetrayal precedent
    // above, second instance. WR-7b (e51ec17ecb5c4ed64a337379d306a89ec2c12702) split the
    // DM-verb RECORDS leaf out of npcDmVerbs.js, and `markRosterDeath` / `clearJailHold`
    // — the two functions this disposition is ABOUT — went with it verbatim, taking both
    // `s.npcs` reads to npcDmVerbRecords.js:224 and :253. MEASURED, not assumed:
    // npcDmVerbs.js now contains ZERO occurrences of `.npcs` (it imports both functions
    // and calls them at :556 and :701), so its row here was STALE and is retired rather
    // than kept as slack. Same reader, same disposition, new address.
    'src/domain/worldPulse/npcDmVerbRecords.js',
    'src/domain/worldPulse/npcGrowthKernel.js',
    'src/domain/worldPulse/npcLadderChallenge.js',
    // D-4 (fold batch 3): `.npcs` here is the ladder-standings map PARAMETER (a
    // Record<string, LadderStanding> named npcs), never a settlement roster read — the
    // contest kernel receives post-gate standings; no participation exposure.
    'src/domain/worldPulse/npcLadderContest.js',
    'src/domain/worldPulse/npcLadderKernel.js',
    'src/domain/worldPulse/npcLadderState.js',
    // W-H1 THE NPC LEDGER (dark): settlementNpcCensus reads the RAW, UNTOUCHED settlement
    // roster (s.npcs + factions[].members[]) to count the named cast for CONSERVATION
    // accounting (law 6 — a graduation must neither duplicate nor drop a soul). It is a
    // raw-roster read by construction (the roadsKernel/partyImpact idiom): the census MUST
    // see EVERY soul, hostages and shelved included, so it is participation-INDEPENDENT and
    // correctly ungated. Dormant by default (npcConsequencesEnabled has no entry in
    // DEFAULT_SIMULATION_RULES).
    'src/domain/worldPulse/npcLedger.js',
    // W-H3 THE POPULATION FLOOR (dark): residentNamedNpcCount reads the RAW, UNTOUCHED
    // settlement roster (settlement.npcs) to count the named cast for the design section 9
    // reconciliation (population is never below the resident named count, and the empty
    // fast path evaluates against population MINUS that count). Participation-INDEPENDENT
    // for the same reason the H1 census is: a hostage still lives here and still eats, so
    // a floor computed off the participation view would let a town with three captive
    // magistrates read as emptier than it is and die for a reason that is not true. The
    // count is deduped by SLOT ID rather than summed across the alias homes, so it reads
    // the same in memory and after a reload. Dormant by default.
    'src/domain/worldPulse/npcReplacement.js',
    // W-H2 THE VERDICT APPLICATION (dark): stripNpcInfluence reads the RAW, UNTOUCHED
    // settlement roster (source.npcs) as the first of the THREE alias homes it relinquishes
    // across (roster + factions[].members[] + powerStructure.factions[].members[]). It is a
    // MUTATION read, not a stage read, and it is participation-INDEPENDENT by construction
    // for two separate reasons. (1) A verdict lands on a person whether or not they were
    // on-stage this tick: a captive, shelved or hostage NPC who is exiled must still have
    // their seat and influence relinquished, so filtering by participation would silently
    // leave a banished soul holding office. (2) The participation view is a FILTERED
    // PROJECTION, and writing a relinquishment through it would strand the alias copies the
    // JSON-alias trap makes indistinguishable in memory — the strip must see every home to
    // stay atomic. Dormant by default (npcConsequencesEnabled is declared false in the
    // full_simulation spread and lit in no preset), and nothing calls it from the pulse yet.
    'src/domain/worldPulse/npcVerdictApply.js',
    'src/domain/worldPulse/partyImpact.js',
    'src/domain/worldPulse/pulseKernel.js',
    'src/domain/worldPulse/religionLegitimacy.js',
    'src/domain/worldPulse/roadsKernel.js',
    // ⭐ EM-B1k2 — A PERMANENT ROSTER WRITER WHOSE BASE IS ITS CALLER'S. ⛔ NOT via-snapshot,
    // and saying so is the point of this row: it sat here under the blanket above with no
    // disposition at all, and the blanket is FALSE of it.
    // `applySettlementLifecycleOutcomeToSettlement` (:578) stamps `dispersed: true` on every
    // soul when a settlement dies — permanent, once. It takes NO save in its signature, so it
    // cannot read raw itself; its base is `applyWorldPulse.js:717`'s `entry.settlement`,
    // reaching it through `applyOutcomeToSettlement` (:733 → the writer call at :155), and
    // that entry comes from `buildSettlementMap`'s map, made RAW by EM-B1k. MEASURED on the
    // filtered base: roster out 2, dispersed stamps 2, the shelved soul absent, against
    // 3 / 3 / present on the raw base — law 6 conservation broken in silence. The file now
    // carries this contract in its own docblock, where the next editor will read it.
    'src/domain/worldPulse/settlementLifecycleFirstClass.js',
    // ⭐ EM-B1k2 — THE SECOND PERMANENT ROSTER WRITER, same shape, same correction. ⛔ NOT
    // via-snapshot. `replaceOustedNpcs` (:64) RETURNS A WHOLE ROSTER, so whatever it was not
    // handed is gone from the settlement its caller writes. No save in the signature; its base
    // is `npcVerdictPulse.js:133`'s `replacementSource` (bound at :99), which is
    // pulseKernel.js `for (const sid of [...localSettlements.keys()])`'s entry, made RAW by
    // EM-B1k (the seam is cited by CONTENT, never by line: tests/lint/
    // pulseKernelLineAddress.walker.test.js freezes hand-keyed kernel addresses at zero and
    // proves this backticked token still exists). MEASURED on the
    // filtered base: roster out 2, the ousted person replaced, the shelved soul absent;
    // against 3 / replaced / present on the raw base. ⚠ Its name join
    // (`String(name).toLowerCase()`) is a SEPARATE question, closed by measurement rather than
    // by cure: 0 duplicate display names across the 525-row golden corpus' 5,171 NPCs.
    'src/domain/worldPulse/successorNpc.js',
    'src/domain/worldPulse/worldSnapshot.js',
    // ⭐ EM-B1k2 — THE FOURTH ROOT'S REAL CONVICTION. `disperseNamedRoster` (:317) reads
    // `input.npcs` (:319) at GENERATION time: its one importer is narrativeGenerator.js:33,
    // called at :995 in the coherence seam, where no `buildWorldSnapshot` has run and
    // therefore no participation view exists at all. PARTICIPATION-INDEPENDENT BY
    // CONSTRUCTION, not by choice — the roster it reads is the one being generated. ⛔ A
    // future caller that hands it a TICK-TIME settlement owes the raw base and owes it here.
    'src/generators/density/applyDensityLaw.js',
    // ⭐ EM-B1k2 — DARK, and in this census only because the predicate now reaches past the
    // `.npcs` literal. It reads the roster solely through `factionRosterOf` (:74, :177, :231)
    // and the literal `.npcs` never appears in the file, so a `.npcs`-only scan could not see
    // it. It has NO `src/` importer: nothing in production reaches it, so whatever settlement
    // its future caller passes is what it will read, and it is policed by nothing else.
    // ⛔ THE PACKET THAT WIRES IT OWES THE RAW-BASE DISPOSITION — R22 binds a succession to a
    // title, which is exactly the kind of permanent seat consequence R18 governs.
    'src/generators/density/titularSuccession.js',
  ];

  /**
   * ⛔ THE UNDISPOSITIONED QUARANTINE — SHRINK-ONLY, EXACT IDENTITY BOTH DIRECTIONS.
   *
   * These are NOT dispositions and they must never be moved into EXPECTED without a
   * written §8 disposition: every entry in EXPECTED above carries (or inherits) a
   * judgement about whether the reader is via-snapshot, a deliberate raw read, or a
   * belt that had to be widened. Nobody has made that judgement about these seven.
   * They are `.npcs` readers that landed in worldPulse WITHOUT being dispositioned at
   * all, and they are named here so this ratchet can tell the debt it already knows
   * about from an EIGHTH new reader.
   *
   * WHY THEY ARE HERE RATHER THAN IN THE TEST CENSUS. Until 2026-08-07 the row
   * `tests/domain/roadsParticipation.test.js :: … the set of participation .npcs readers
   * is exactly the dispositioned census` sat in scripts/.test-ratchet-baseline.json.
   * That row is ONE assertion over an OPEN, tree-derived population, so tolerating it
   * tolerated the whole population: an eighth undispositioned reader produced the
   * byte-identical failing verdict and reddened nothing. A failing TEST is debt; a
   * failing WALKER is a DISABLED GUARD (CONTRIBUTING.md, "The gate"). The census row is
   * gone; the debt is INVENTORIED here, where a new reader reds again.
   *
   * ⚠ AND THE INVENTORY HAD ALREADY GROWN UNSEEN, MEASURED rather than feared: at the
   * moment the row was banked this scan found 38 readers against a frozen 31 — seven
   * undispositioned arrivals plus one stale address — and no report ever showed it,
   * because the failing row's bytes never changed. That is the recorded
   * A-RED-RATCHET'S-CONTENTS-GROW-INVISIBLY hazard, live in this file.
   *
   * MEASURED, NEVER TRANSCRIBED: this test's own `grep -rl` run inside an
   * integrity-counted `git archive` of committed abc5a78b (6,196 tracked paths in,
   * 6,196 files out, `git status` clean) — never over the live shared tree, which holds
   * an owner session's uncommitted work (THE ARCHIVE-CENSUS LAW).
   *
   * TO SHRINK IT (the only permitted direction): read the file, decide what its `.npcs`
   * read IS — via-snapshot, a deliberate raw read with a reason, or a belt that must be
   * widened — write that disposition as a comment in EXPECTED, move the row there, and
   * delete it here. The honesty arm below reds if a row goes stale without being
   * banked, so a silent shrink is not available either.
   */
  const UNDISPOSITIONED_NPCS_READERS = Object.freeze([
    'src/domain/worldPulse/envoyCasting.js',
    'src/domain/worldPulse/npcVerdictPulse.js',
    'src/domain/worldPulse/oathHolder.js',
    'src/domain/worldPulse/sovereigntyNews.js',
    'src/domain/worldPulse/warDeployment.js',
    'src/domain/worldPulse/warRulingsNews.js',
    'src/domain/worldPulse/warSeatBooks.js',
  ]);

  // A LITERAL, not a figure read out of the list it is supposed to cap — a ceiling
  // derived from its own array proves list == list and rises silently with every entry.
  // MONOTONE DOWN from here. You may burn it; you may never pad it.
  const UNDISPOSITIONED_CEILING = 7;

  /**
   * The live scan this whole block is about.
   *
   * ⭐ EM-B1k2 WIDENED IT ON BOTH AXES (2026-09-20), because the census asserted a protection
   * that did not reach the files where the IRREVERSIBLE decisions actually live. The ROOTS gain
   * `src/domain/density` (the R18 law itself and its roster filter) and `src/generators/density`
   * (the generation-time dispersal). The PREDICATE gains `factionRosterOf`, because the roster
   * can be read through the estate's own filter without the literal `.npcs` ever appearing —
   * `titularSuccession.js` is exactly that shape and was invisible to a `.npcs`-only scan.
   * Measured: 41 → 44 readers, the three new members each dispositioned below.
   *
   * ⛔ TWO `-e` FLAGS, NEVER A BRE `\|` ALTERNATION. `execFileSync('grep', …)` resolves through
   * PATH, which is BSD grep 2.6.0-FreeBSD on a macOS dev machine and GNU grep in CI. `-e` means
   * the same thing to both; `\|` does not, and a scan whose result depends on the host's grep
   * dialect is a ratchet that reports a different census depending on who runs it.
   */
  function foundReaders() {
    const out = execFileSync('grep', ['-rl', '-e', '\\.npcs', '-e', 'factionRosterOf', 'src/domain/worldPulse', 'src/domain/spatial', 'src/domain/density', 'src/generators/density'], { cwd: process.cwd(), encoding: 'utf-8' });
    return out.split('\n').filter((l) => l && !l.includes('.test.')).sort();
  }

  it('the set of participation .npcs readers is exactly the dispositioned census (a new reader trips this)', () => {
    const known = [...EXPECTED, ...UNDISPOSITIONED_NPCS_READERS].sort();
    expect(
      foundReaders(),
      'a `.npcs` reader appeared in worldPulse/spatial that is neither DISPOSITIONED in the §8'
      + ' table above nor named in the undispositioned quarantine. Read what it does with the'
      + ' roster and add it to ONE of them — EXPECTED with a written disposition if you know'
      + ' the answer, the quarantine if you do not. Do not raise a ceiling to make it go away.',
    ).toEqual(known);
  });

  it('⛔ quarantine honesty: the undispositioned list is EXACT — an un-banked shrink reds too', () => {
    // Audited in BOTH directions, which is what stops the quarantine becoming a second,
    // softer census:
    //   • a row that no longer reads `.npcs`, or has since been given a real disposition
    //     in EXPECTED, is a WIN — and it reds here until it is banked, because a
    //     quarantine that silently keeps stale rows drifts upward in effect exactly like
    //     the census row it replaced;
    //   • a NEW undispositioned reader never reaches this list at all — it reds in the
    //     exactness arm above, which is the whole point of moving the debt here.
    const found = new Set(foundReaders());
    const expected = new Set(EXPECTED);
    const stale = [];
    for (const rel of UNDISPOSITIONED_NPCS_READERS) {
      if (!found.has(rel)) stale.push(`${rel}: no longer reads .npcs (moved/renamed/cleaned) — delete its quarantine row`);
      else if (expected.has(rel)) stale.push(`${rel}: now carries a §8 disposition — delete its quarantine row (a file is one or the other, never both)`);
    }
    expect(stale, `bank these wins:\n  ${stale.join('\n  ')}`).toEqual([]);
    // anchored: the exactness loop above walked the quarantine against a LIVE scan, so
    // the two pins below are floors on a real population rather than on an empty array.
    expect(
      UNDISPOSITIONED_NPCS_READERS.length,
      'the quarantine emptied — if that is real, delete it and this arm together; if it is not, the scan stopped finding readers',
    ).toBeGreaterThan(0);
    expect(UNDISPOSITIONED_NPCS_READERS.length).toBeLessThanOrEqual(UNDISPOSITIONED_CEILING);
  });
});
