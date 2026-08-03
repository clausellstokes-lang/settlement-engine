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
  const EXPECTED = [
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
    'src/domain/worldPulse/factionCapture.js',
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
    'src/domain/worldPulse/npcDmVerbs.js',
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
    'src/domain/worldPulse/settlementLifecycleFirstClass.js',
    'src/domain/worldPulse/successorNpc.js',
    'src/domain/worldPulse/worldSnapshot.js',
  ];
  it('the set of participation .npcs readers is exactly the dispositioned census (a new reader trips this)', () => {
    const out = execFileSync('grep', ['-rl', '\\.npcs', 'src/domain/worldPulse', 'src/domain/spatial'], { cwd: process.cwd(), encoding: 'utf-8' });
    const found = out.split('\n').filter((l) => l && !l.includes('.test.')).sort();
    expect(found).toEqual([...EXPECTED].sort());
  });
});
