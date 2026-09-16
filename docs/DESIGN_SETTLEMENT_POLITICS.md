# DESIGN — SETTLEMENT POLITICS (coalitions inside the walls; the realm's laws, scale-free)
## Fable 5 architecture, 2026-07-14 — owner-ratified ("competing powers in a settlement should be able to form coalitions against oppositions for more influence... align interests, or perpetually fragment"), with the NPC addendum verbatim: "take into account the NPCs within coalitions for the fragmentation, formation, direction, movement of said coalitions, how strong or how fragile, to what end."
### Companions: DESIGN_PEACE_ENGINE (the coalition machinery this reuses one level down + differential term strain), DESIGN_CORRUPTION_WEB (the swing-member target; compromise-tag glue), DESIGN_GENEROSITY_ENGINE (patronage), COHESION_WEAVE §B/§C (who can coalesce) + §G (the people) + §H (loaded dice). Builds in W-DOCTRINE.

## 0. THE PRINCIPLE: scale-free politics
Everything W-PEACE gives coalitions BETWEEN settlements — formation against a threat, terms
each member pays, differential strain, defection windows, separate exits priced as betrayal,
fracture on succession — runs unchanged INSIDE one, at faction grain. One vocabulary, two
arenas. The recon grounds it: factions are roster entries on `powerStructure.factions`
(name-keyed, power renormalized to exactly 100, `isGoverning`, category, captureState) with
pulse-side `factionStates` carrying archetypes, powerBases, same-settlement `rivals[]`, and
NAMED seat-holders (`internalSeats`: leader/lieutenant/agent) — every ingredient exists; only
the alignment overlay is new.

## 1. THE BLOC LEDGER (one small object, capped — the depth-cap law)
`worldState.politicsLedgers[cid]` (conditionally materialized, the rumorLedgers idiom — absent
⇒ byte-identical): `blocs[]`, HARD CAP 3 per settlement, each
`{ id (codepoint-sorted stableParts of members — stable composite), members[factionNames],
   glue[{type: 'concession'|'patronage'|'doctrine'|'threat'|'compromise', detail}],
   end ('seats'|'doctrine'|'commerce'|'survival'|'patron'), strain 0..1, sinceTick, covert? }`.
This is NOT a parliament simulator (the owner's simplicity boundary bites hardest here): blocs
have no treasury, no meetings, no sub-votes — they are an alignment overlay whose ONLY effects
are (a) decision-weight loading and (b) a handful of E0-classed event types (formed, realigned,
fractured, exposed). `dominantFaction` and governing reads DERIVE from bloc arithmetic once
this exists (single-writer; the old read stays as the no-ledger fallback).

## 2. FORMATION, DIRECTION, END (loaded dice all the way)
- **Who CAN coalesce** is the cohesion weave's job: quadrant affinity (§B — brothers coalesce
  cheap, natural enemies need extraordinary pressure), structural interest (§C — temple+peasantry
  vs crown+merchants is a standing fault line), archetype rivals[] as standing repulsion.
- **Who DOES is the people (the owner's addendum, mechanically):** formation odds are modulated
  by the §G ties between the blocs' NAMED seat-holders — warm ties (kin, partners,
  mentor/protégé) lower the threshold; a personal rivalry between two leaders BLOCKS a coalition
  their interests demand (the most DM-usable sentence this system produces: "the league and the
  temple need each other, and the guildmaster will not sit at her table"). All §G-clamped.
- **Glue typology decides strength** (the addendum's "how strong or how fragile"):
  people-held glue (personal loyalty between leaders) = strong while those hands hold those
  seats, brittle at succession; seat-held glue (concessions — seats traded, revenue shares,
  doctrine tolerated) = transactional, outbiddable any day, but survives leader changes;
  compromise glue (a member's seat-holder carries a corruption leash serving another member —
  or a foreign patron) = the strongest and the most catastrophic: exposure shatters the bloc
  AND fires the scandal machinery. VOCABULARY LAW: "concession" is the overt price;
  "compromise" remains corruption-only — the dossier never blurs which politics it is reading.
- **"To what end":** the bloc's `end` derives from member interests COLORED by the leading
  NPCs' goals (the goal fields exist on the roster; corruptionPass already rewrites them) — the
  same members steer toward seat capture under an ambitious guildmaster and toward doctrine
  under a pious matriarch; the end RE-DERIVES when the leading seat changes hands. Every
  formation/realignment is a §H weighted draw with the weights receipted.

## 3. WHAT A RULING BLOC DOES (the overt twin of corruption)
The bloc holding `isGoverning` or a majority power share LOADS the settlement's decision
weights toward its members' interests — the same §H kernel as the corruption web's foreign
asset, opposite legitimacy: overt, domestic, receipted in the visible record ("the Salt Ring
holds the council; the tariff passed"). Bounded and clamped exactly like every modulation in
the weave. A divided court (no ruling bloc / high fragmentation) decides closer to its raw
character weights — and is CHEAP TO CORRUPT (the corruption web reads court division as channel
quality; a consolidated coalition raises the patron's price — the two designs are one market).

## 4. STRAIN, FRAGMENTATION, MOVEMENT (the addendum's dynamics)
- **Differential cost is the engine of strain** (the W-PEACE mechanism, one level down): peace
  terms land on factions unevenly — someone's warehouses pay the tribute — and the loaded
  faction's strain climbs; the faction that bore the cost becomes the revanchist party of the
  next decade (the peace engine's revanchism now has a named mechanism).
- **Defection windows open** on succession (people-held glue evaporates — the §G seat/people
  law), on exposure (compromise glue detonates), on outbidding (seat-held glue is a market),
  and on the threat's end (survival blocs dissolve when the siege lifts). The
  `secondaryAffiliation` NPC — already on the roster — is the natural BRIDGE while the bloc
  holds and the natural DEFECTION POINT when it strains; broker NPCs carry the bloc's business
  between houses (its movement) and are its leak surface (§G information hook, same edge).
- **External threat consolidates** (the rally mechanic): a war footing, a siege, a revealed
  foreign asset, or an encircling hegemon compresses formation thresholds realm-inward — the
  fractious council that closes ranks when banners crest the ridge.
- **Perpetual fragmentation is a CHARACTER STATE, not a failure:** fragmentation-propensity
  derives from structure (§C — councils fragment; autarchies suppress blocs and breed
  CONSPIRACIES instead: a bloc with `covert: true`, discovered through the exposure machinery,
  the covert/revealed vocabulary reused whole). Some settlements' stable politics IS a short
  bloc half-life — Italian city-states as persistent texture. HYSTERESIS AS LAW: blocs are
  sticky to form and meaningful to break; E0 drama-classes every transition so realignment is
  an event the chronicle narrates, never weekly churn.

## 5. GUARDRAILS
Depth cap (≤3 blocs, one ledger, two effect channels — reviewable as a design bug if it
grows); §G clamps on all NPC modulation (a dense web matters, one friendship never overturns
strategy); state-never-fate (leaders estrange, warm, defect in AFFILIATION — the engine never
kills, exiles, or converts a named person); name-key fragility handled by the
pruneFactionStates grace-window precedent (a renamed faction's bloc membership follows the
rename cascade); endogeneity + party law untouched; dormancy (no ledger ⇒ prior bytes;
lights with W-DOCTRINE's gate); every formation/fracture/realignment carries typed reasons
with the glue and the people cited.

## 6. LEGIBILITY
The Power tab renders the coalition map — blocs, glue types (the DM sees which alliance rests
on friendship, which on gold, which on a leash), strain per member, the named bridge people.
The chronicle narrates realignments as fiction; the dramatic-irony brief shows strain the
members haven't acted on yet ("the Temple's patience with the Ring is spent; the matriarch has
not said so"). Player-safe surfaces get the public shape only (who governs, visible alliances)
— glue and strain are DM truth, riding the established includeCovert/truth-block convention.

## 7. PINS + SOAK
Byte-identity with no ledger (dormancy). Cap enforcement (a 4th bloc cannot form; E0 deferral
visible). Glue-typology behavior: succession dissolves people-held blocs and not seat-held
ones (the twin pin); exposure of compromise glue shatters the bloc + fires scandal; outbidding
flips a concession member with the offer receipted. The leader-rivalry block: interests-align +
leaders-hostile ⇒ no formation until the seat changes (negative control: same interests, warm
leaders ⇒ forms). Differential-strain → revanchism (the term-burdened faction's war appetite
measurably rises). Conspiracy discovery runs the covert→revealed path. Ruling-bloc loading is
clamped and receipted; a divided court measurably raises corruption channel quality (the
cross-design pin). Soak: bloc half-life distribution matches structure type; realignments at
story tempo.

## 8. SEQUENCING
Builds in W-DOCTRINE, consuming W-PEACE's coalition shapes (build order within the wave:
after the peace engine's term/strain machinery exists to reuse). Hooks: E1 patronage
(generosity as coalition currency, incl. the evil kind), W-PEACE differential term strain
(§4), CORRUPTION_WEB swing-member economics (§3). The NPC dimension ships inside this design —
no separate wave; §G supplies the clamps.
