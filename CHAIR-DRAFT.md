# CHAIR DRAFT — the judgments, before the census (2026-10-17, Opus 5.5)

## THE DOMINION (the kingdom layer)
- Token `dominion` ("realm" = the campaign world, landed). Prose word by the apex's ruling power (closed table; default "kingdom"; the apex court in its dominion role = "the crown").
- DERIVED, never stored: the connected tree of SWORN edges (`overlord_of`/`vassal_of`, at most one overlord — the suzerain closure) plus HELD lands (occupied). Patron/client is influence, not sovereignty — not a member.
- The apex (a member with no overlord) is THE SEAT. Tier = depth from the seat. Immediate liege = the overlord.
- Persisted: only IDENTITY + LINEAGE (`spatialLedgers.dominions[id] = {name, seatId, foundedTick, lineage[]}`), so history can name it and it survives a change of seat. Membership is never stored.
- CROWN AUTHORITY band (derived): nominal · contested · firm · absolute — from the seat's share of the dominion's strength, its legitimacy, the direct vassals' loyalty, the dominion's age.
- LOYALTY band per sworn edge (derived): defiant · restive · dutiful · devoted — from the edge's trust/fear/dependency, the burden (tribute + levy vs capacity), protection kept or failed (relationship turning points), shared faith/culture, the liege's legitimacy, the vassal's own appetite, distance (when the physical world lands).

THE PRECEDENCE PRINCIPLE: the crown speaks for the dominion abroad; each settlement governs itself at home; obligation binds the seam; the crown's AUTHORITY decides how far "abroad" reaches.
| matter | reserved to the crown | owed | retained by the settlement |
|---|---|---|---|
| war with outsiders | declare, end | levy (service) up; relief (protection) down | its own defense when struck |
| peace with outsiders | sign for the dominion | — | (a separate peace = breaking fealty) |
| alliance | military pacts with outsiders (firm+); all foreign pacts (absolute) | — | pacts with fellow members; trade/faith pacts abroad (firm and below) |
| trade | embargo of an outsider; tolls at the dominion's gates; charters | dues (tribute) | local trade; free passage inside the dominion |
| justice | arbitration between members (the crown's peace) | redress down | its internal politics, faith, building |
Authority widens/narrows the reserved column: absolute (all foreign pacts need leave; the crown reaches sub-vassals directly — liege homage) · firm (military reserved; summons through direct vassals) · contested (reserved in law; members act and the crown punishes or not) · nominal (the crown speaks for its own domain only).
NO HARD OVERRIDES — a member's deciders stay its own; the dominion adds PRICED inputs (obedience = loyalty × authority vs the member's interest); defiance is a choice with consequences (authority and loyalty move; the crown punishes or tolerates). TWO DEFINITIONAL RULES: a sworn member's separate peace with the crown's enemy, or its joining a coalition against its own liege, IS the act of breaking fealty (it routes to secession) — not forbidden, defined.
"The vassal of my vassal is not my vassal" below absolute: a mid-lord may withhold its sub-vassals' service (the great vassal's leverage).
COMPROMISES (the nuance): scutage (coin for service, W-COIN) · partial service (half_answered) · commuted dues · charters (the three trade-rights rows become the crown's GRANTS — their first producer) · autonomy grants (a member's reserved sphere narrowed by charter) · court bonds (marriage) · arbitration.

FEUD · REBELLION · CIVIL WAR (three different things):
- FEUD: members vs members over a local wrong; the dominion is not at war; the crown is the first mediator (a GR-6 occasion); tolerated under nominal/contested, a breach of the crown's peace under firm/absolute.
- SECESSION (rebellion): a member (with its sub-vassals) breaks fealty to leave; won → it is the seat of a NEW dominion (lineage "broke from"); lost → re-sworn or held.
- CIVIL WAR: members vs members over THE CROWN ITSELF (a contested succession, a usurpation, a barons' war over the dominion's form). YES — it is still the same kingdom: one dominion, its members split into SIDES behind claimants; outsiders may recognise a side; the dominion's treaties are in abeyance; it ends in REUNION (one side holds the seat; the losers re-swear or are stripped) or PARTITION (two dominions; the side holding the old seat keeps the name).
SUCCESSION CRISIS: at the seat's change of ruler, a strong direct vassal's CLAIM (strength share, legitimacy, court bonds, faith) may be pressed; each vassal chooses (loyalty test; W-SEAT §736.1's legitimacy scaling) — splitting towns. DECAPITATION: the seat captured by an outsider → each direct vassal chooses submit · rally to a claimant · go free.
Fealty IS an oath (GR-1's sworn stamp); its renewal at a succession IS GR-4's reaffirm/repudiate. The levy IS WC's call-in; the service record IS WC's contribution ledger.

## EXTERNAL FORCES
- ONE generic kind. The DM authors it (Edit Mode): NAME (free text, never parsed; prose uses it as a proper noun) · WHERE (at a settlement, on a road between two, or around a settlement) · MIGHT (troubling · dangerous · dire · overwhelming — RELATIVE to the defence of what it presses, the reference-price idiom) · COURSE (stays, or goes toward a named settlement). Nothing else: no type, no motive, no behaviour list.
- The force has no deciders. The engine moves it on its course, wears its might when it is beaten, and simulates the WORLD'S RESPONSE through existing channels: it PRESSES (a stressor/embattlement term; danger on its road); it is BELIEVED (news, believed might may swell or shrink); it STRIKES at a hearing (STANDING while it besieges; default verdict from might vs defence; the DM tilts or rules; the engine never razes on its own); COURTS RESPOND (a war target; relief; call-ins; the SHARED-THREAT pact and truce; the crown's protection duty; prices and caravans; flight; dread and devotion; the commons' anger; the council's demand; the habit of who came).
- On-map = an external force (full consequence); off-map = a phantom (record + home procedures, ODQ §934.43). CN cn-5's "external authored host" becomes an external force.
