# THE CRISIS RECORD AND THE CRISIS TAB — a singular event with one record, one home and a derived cast

**Status:** DESIGN, ruled by the owner on 2026-11-03 ("Do it"); the build is the first fix window after the coherence window lands (ODQ §934.104), its own signed generation change and its own pull request. The rules below are the owner's to veto before any seat builds them.

## The owner's words (2026-11-03, in chat, verbatim)

> "Some crises are without cause, such as a famine and everyone may suffer. So think about that carefully. We have to respect the bounds of this work. There can be an occasional exploiter. There can be an occasional person taking the fall. Where appropriate and reasonable there can be an engineered crises and an instigator. But for some of these other ones, aren't they already implied in everything else? Like legitimacy and such? I would either add temporary NPCs, or based off of personality, faction, and compromised status, abd whose factions benefit or lose accordingly to the crisis. assign approprroles to existing NpCs. What are your thoughts? And this is turning into a bigger thing where I would make an emergent new Crises Tab in the summary section. Since this describes a singular event."

Then: "Do it".

## The principle

A crisis is a singular event. Today its facts are written separately on the Tonight sheet, in the hooks, in the faction notes and in the print chapter, and each writer speaks of people in roles while naming nobody, because the generator never ties particular people to the event. The cure is DERIVATION, not invention: the dossier already holds everything needed to say who a crisis touches — the faction web and who backs whom (`src/domain/dossier/powerSupport.js :: houseBacksOf`), public legitimacy (`src/generators/factionDynamics.js :: computePublicLegitimacy`), who gains under a legitimacy state (`src/generators/factionDynamics.js :: applyLegitimacyMultipliers`), the stress-aware faction stances (`src/generators/factionDynamics.js :: computeFactionRelationships`), the corrupted NPCs (`src/generators/steps/corruptionPass.js`, `npc.corrupt`, `npc.corruptionVector`, `npc.corruptTies`), personality (`src/data/npcData.js :: NPC_PERSONALITY_TRAITS`), faction affiliation (`npc.factionAffiliation`), the institutions that hold the levers (`src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS`), the seat (`src/domain/dossier/powerStrata.js :: rulingChainOf`) and the rival (`src/domain/dossier/powerStrata.js :: outrankingRivalOf`). A crisis record reads those facts and assigns roles to EXISTING people, keeping the reason for each assignment, so the DM sees why this person and not another. A famine has no villain; it has people who bear it, a lever someone holds, and, occasionally, someone who exploits it or someone who is blamed.

ONE FACT, ONE HOME: the event gets one record and one page, and every other surface reads them. TRUST THE DM: the cast is editable on that page and nowhere else.

## The record

The settlement's stress-container entry (`src/generators/stressGenerator.js :: buildStressEntry`; the one of three representations the dossier reads, kept in step by `src/domain/crisisLifecycle.js`) grows one field, `cast`, written at generation by a new pipeline step after the NPCs, the factions and the legitimacy pass exist:

- `nature`: `natural` | `social` | `engineered` | `external` (the table below; a property of the kind, not a draw).
- `roles`: a list of `{ role, kind: 'npc' | 'faction' | 'institution', id, name, reason, temporary }`. Each `reason` is one sentence from a FIXED vocabulary keyed by the rule that fired (never free prose), e.g. "runs the granary", "faction gains while the seat weakens", "corrupt, with ties to the thieves' guild", "the seat, with legitimacy already contested".
- `stakes`: per faction, `{ factionId, stake: 'gains' | 'loses' | 'split', reason }`, derived from the gains rules and the catalog's affected systems (`src/domain/worldPulse/stressorsCore.js :: STRESSOR_CATALOG`, `affectedSystems`) against each faction's category.
- `levers`: the institutions the crisis turns on, from `STRESS_INSTITUTION_EFFECTS`, each with the NPC who holds it where the roster has one.
- `ifNothingIsDone`: the escalation line, read from the entry's existing `viabilityNote` and the catalog's `residualEffects`; nothing new is written.
- `playersSeeFirst`: the two facts the Tonight sheet already derives (food and defence), by reference.

Zero new random draws, with one exception: a TEMPORARY NPC, minted only when a REQUIRED role has no plausible holder on the roster (a plague with no healer; a famine with neither granary nor market nor anyone whose role touches food). It is a minimal NPC record flagged `temporary: true` with the crisis id, one draw for its name, removed by `crisisResolve` through the one transition module so the trio stays in sync (`tests/joins/crisisTripleSync.test.js` keeps enforcing that nothing else writes the trio). Measured target: temporary NPCs in under one crisis in ten; if the thousand-settlement soak shows more, the roster is too thin and that is a finding, not a reason to mint more.

## The role vocabulary, bounded by the nature of the crisis

| nature | kinds (`STRESS_TYPE_MAP` keys) | required roles | occasional roles (a rate, never a coin per crisis) | never |
|---|---|---|---|---|
| natural | famine, plague_onset, mass_migration, monster_pressure | bears the brunt; holds the lever | exploiter; scapegoat | instigator |
| social | politically_fractured, succession_void, insurgency, slave_revolt, religious_conversion, recently_betrayed | instigator; target | waverer; scapegoat | — |
| engineered | infiltrated | instigator ONLY where a faction has the motive (it gains); otherwise an outside hand, unnamed | collaborator | — |
| external | under_siege, occupied, wartime, indebted | defender (siege, wartime); the one who would treat (siege, indebted); the occupying authority's local face (occupied) | profiteer; collaborator | a local instigator |

"Occasional" means a registered rate per role (`CRISIS_CAST_RATES`, one table, the owner's dials): the proposal is exploiter 1 in 3 natural crises, scapegoat 1 in 4 where legitimacy is contested or worse, waverer 1 in 2 social crises, profiteer 1 in 3 external, collaborator 1 in 2 occupations. The choice of WHICH crisis gets the occasional role is a deterministic rank over the seed (a hash of seed and crisis id against the rate), not a fresh draw, so the draw order of everything else is untouched.

## The derivation rules (deterministic, over existing records; cite the rule in the reason)

1. **Bears the brunt.** The faction whose base the crisis hits, from the catalog's `affectedSystems` against faction category (food security → the commons and the farming houses; labour → the crafts; trade connectivity → the merchants; defence readiness → the military; public legitimacy → the governing faction), and within it the NPC with the lowest power whose role touches that base. A thorp with one faction names the commons.
2. **Holds the lever.** The institution `STRESS_INSTITUTION_EFFECTS` names for the kind (the granary or market in a famine, the healer or temple in a plague, the walls and garrison in a siege), and the NPC whose `role` is that institution's office where the roster has one; otherwise the institution itself is the lever and no NPC is invented, unless the role is required and the temporary rule applies.
3. **Instigator.** Social kinds: the outranking rival (`outrankingRivalOf`) where one exists, else the faction with the highest `gains` stake, and its leading NPC by power. Engineered kinds: the same, but only where a faction's stake is `gains`; with no such faction the instigator is "an outside hand" and no name is given.
4. **Target.** The seat (`rulingChainOf`'s named holder) or the governing faction.
5. **Exploiter / profiteer.** Among NPCs affiliated to a faction whose stake is `gains`, prefer `npc.corrupt`, then a negative trait from the register's greed and ambition slots, then power; chosen at the role's rate.
6. **Scapegoat.** Only where public legitimacy is contested or worse (`legitimacyBandFor`): the seat-holder, else the lever-holder, whichever's faction `loses`.
7. **Defender.** The military faction's leading NPC, else the garrison's office-holder, else the institution.
8. **The one who would treat.** The merchant faction's leading NPC when the seat's legitimacy is contested, else the seat.
9. **Collaborator.** Under occupation or infiltration: a corrupt NPC whose `corruptTies` reach the occupying or infiltrating interest, else the most ambitious NPC of a faction that `gains`.
10. **Waverer.** In a social crisis: an NPC of a faction whose stake is `split`.
11. **Stakes.** From `applyLegitimacyMultipliers`'s rules (the military gains in a vacuum, the church under a struggling seat, the merchants when endorsed), the stress-aware stances in `computeFactionRelationships`, and the catalog's affected systems against category; every faction gets exactly one stake and one reason.

Every rule is total: when nothing matches, the role is absent and the record says why ("no faction gains"), never "Unnamed NPC".

## The Crisis tab

In the Summary section of the Table View, beside the Overview and the Tonight sheet (`src/components/TonightSheet.jsx`), one tab named Crisis. One section per active crisis, worst first by the lifecycle stage and severity (`STRESSOR_LIFECYCLE_STAGES`); each section: the event in one line (kind, since when, the nature); the cast by role with the reason beside each name and a door to the person, the faction or the house (`src/domain/dossier/entityLinks.js :: buildDossierEntityIndex`); the stakes, one line per faction; the levers; what the players see first; what happens if nothing is done. A place with no active crisis shows one line, "No active crisis", and the pressure closest to becoming one from the world pulse, if the owner wants it; otherwise nothing. The Overview's crisis block becomes a one-line pointer to the tab (one home).

Editing (Trust the DM): `src/domain/userEdits.js :: EDITABLE_FIELDS` gains `crisis` with the cast as its editable path, served by the Crisis tab alone and never by the prose queue: reassign a role to another roster NPC, remove a role, add one from the vocabulary; ✎ YOU where the DM spoke; "As the engine has it" reverts; the edit rides the crisis entry's id through `walkUserEdits`. No free text.

## The surfaces that read it

The Tonight sheet's crisis line takes its person from the cast (the instigator for social and engineered kinds, the one who bears the brunt for natural and external kinds); its three people to voice become the cast's first three by a fixed order (instigator or brunt, lever, exploiter or defender), falling back to the present seat, secret and cleric where the cast is short. The crisis hook (`crisisHook` on the entry) gains slots filled from the cast by name where the cast has them; where it does not, the present sentence stands. The print chapter and the Foundry journal page print the same sections from the same record. The faction notes' `crisisNote` keeps naming the rival as the RULERS lane left it. Nothing else changes.

## What it does not do

No new prose pools; no new NPC generation beyond the temporary rule; no second record (the entry is the record, its twin stays in step through `crisisLifecycle.js`); no districts or taverns (X-47); no look, voice or tell (X-48).

## Goldens, registers and proof

A generation-time field moves every same-seed golden: one signed shift record, cause "the crisis record carries its derived cast", the rows predicted in the stage before the write. The new fields are observed-shape declarations (a schema migration, the chair's). `EDITABLE_FIELDS.crisis` lands with its spine test. The certification corpus gains a check: every cast member's faction stake agrees with the role (an exploiter's faction gains; a scapegoat's loses). Measured on 120 seeds before and after: crises whose Tonight line names a person 0 → every crisis with a holder; roles filled per nature; the occasional rates within their dials; temporary NPCs under 1 in 10; the audit's "unnamed crisis people" reading 0.

## Open for the owner's veto

The five rates; whether the no-crisis state shows the leading pressure; whether the Overview keeps more than a pointer; whether `monster_pressure` is natural (proposed) or external.
