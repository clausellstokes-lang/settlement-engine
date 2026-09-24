/**
 * couplingInclusion.walker.test.js — CW-0w slice 2: THE CROSS-LAYER INCLUSION
 * RATCHET. The machinery behind the same-commit registry obligation (seam SC-1).
 *
 * THE CLASS. DESIGN_FP_COUPLINGS.md §0.3 and the SOL_QUEUE chair checkpoint both
 * say "any cross-layer read adds its CW-0 registry row in the SAME commit", and
 * the CW architecture's substrate audit found that obligation enforced by review
 * courtesy alone: no walker existed. Every wave that lands a quiet cross-layer
 * import without a row makes the registry a partial map that READS as a total
 * one — the most expensive kind of wrong, because CW-3's aliveness floors and
 * CW-1's layer counting both treat the registry as the layer authority.
 *
 * WHY BASELINE-FROZEN AND NOT GREENFIELD-CLEAN (the implementation-grade
 * correction recorded in the CW architecture's §4, vetoable): the volume's own
 * §4 documents dozens of LIVE pre-program cross-layer reads in its EXISTS
 * blocks. Rows are never pre-registered and the registry enumerates DESIGNED
 * couplings, so those legacy edges will not get rows retroactively. A clean scan
 * would red 152 pairs on day one and be deleted by Friday. So today's inventory
 * is FROZEN by (importer, imported) pair identity, and:
 *
 *   1. A NEW cross-layer pair absent from the baseline REDS unless a registry
 *      row licenses it — the row IS the license, which is why licensed pairs
 *      need no baseline edit and the baseline can only shrink.
 *   2. A baseline pair whose import is GONE REDS, demanding the entry be deleted
 *      so the reduction is banked (the sizeBaseline honesty idiom).
 *   3. The baseline may never GROW: an entry naming a pair that is not a live
 *      cross-layer import is stale by definition and reds under (2).
 *
 * ⚠ THE ONE NARROW EXCEPTION TO (3), and it is narrow on purpose (2026-08-07). When a
 * layering repair moves the SYMBOL a frozen legacy pair reads into a smaller provider
 * inside the SAME layer, (1) and (2) fire together and the honest record is a
 * COUNT-NEUTRAL RETARGET of the existing entry — not a bank plus a fresh mint, which
 * would either force a false licence row or block the cleanup that the layer walkers
 * demand. A retarget is NOT a general escape hatch. A retarget that changes what is
 * READ is a new coupling and must go through (1).
 *
 * ⭐ THAT EXCEPTION IS MACHINERY, NOT PROSE (2026-08-07, second pass). It shipped as
 * this paragraph plus a `note` on one baseline entry, and a paragraph checks nothing:
 * a later lane could repoint ANY entry at ANY module and no test would notice, because
 * the walker cannot see an entry's history. So the exception now has a REGISTER —
 * BASELINE_RETARGETS below — and every clause of it is asserted against LIVE code
 * rather than asserted about it: same importer, same direction (DERIVED from the layer
 * map, never transcribed), same read symbol actually named at the live import site,
 * a same-layer move, a strictly smaller provider, the old provider still re-exporting
 * the symbol so no other consumer moved, and the `note` present, provenance-bearing and
 * joined BOTH WAYS to the register. The register is frozen at its measured length, so
 * a second retarget is a chair conversation rather than an edit.
 *
 * WHAT THAT STILL CANNOT CATCH, stated rather than discovered later: a lane that
 * repoints an entry, adds no note and adds no register row, in a commit where the OLD
 * import genuinely died and the NEW pair is genuinely live. Arm (1) closes the common
 * case — the pair it repointed AWAY from stays live and reds as unlicensed — but not
 * that one. Closing it needs the PREVIOUS baseline, which no test in a working tree
 * has. Reviewing the diff is the remaining guard, and it is now a diff that must also
 * move a frozen count if the lane is honest.
 *
 * Declared-empty directions stay enforced as the ABSENCE of rows (J-CPL-2 — no
 * forbidden-list lives anywhere in this estate).
 *
 * THE LAYER MAP is a frozen in-walker table of MODULE SETS resolved from
 * patterns at scan time, never a list of filenames: a module that relocates out
 * of its family drops out of the set, its frozen pairs go stale, and (2) reds.
 * That is the cure for the recorded filename-anchored-pin vacuity class. The
 * seven layers are DESIGN_FP_COUPLINGS.md §2's seven ports.
 *
 * DELIBERATELY UNMAPPED — see ARGUED_UNLAYERED below: the four infrastructure
 * hosts, plus a SUBSTRATE roster that opened with CR-FP-11's two SP leaves and has
 * grown since, every growth a recorded act against the ceiling. Each entry carries a
 * written reason and is asserted to still exist and still have no layer. This sentence
 * deliberately names no COUNT: the count lives on ARGUED_ROSTER_CEILING, which is
 * asserted, and a prose second copy of it could only drift out of step — as this one
 * silently had, still saying "two" at a roster of ten, until 2026-08-10.
 *
 * ── CR-FP-11: WHAT THIS FILE COULD NOT CATCH, AND WHY IT CAN NOW ─────────────
 *
 * THE REACH GAP (measured, repaired 2026-08-05). The layer map was a frozen table
 * of family PREFIXES, and `scanCrossLayerPairs` iterated only LAYERED modules as
 * importers while skipping any dependency with no layer. A module matching no
 * pattern was therefore invisible on BOTH sides at once — not merely unclassified
 * but unscannable. Nine of the ten leaves FP cycle 1 landed matched nothing, and
 * an unregistered WAR read inside one of them left this walker fully green, while
 * the SAME import in a layered sibling reds by name. That matched pair is the
 * proof, and it is why arm B exists: an inventory that grows only by pattern will
 * always trail an estate that grows by file, so the unclaimed are now COUNTED.
 *
 * THE STANDING CANNOT-CATCH LIST — stated so the next gap is documented before it
 * is discovered, not after:
 *   • DYNAMIC imports. IMPORT_RE reads static `from '…'` specifiers only; an
 *     `await import()` crosses layers with nothing here to see it.
 *   • RE-EXPORT LAUNDERING. A→B→C shows two pairs, and if B is unlayered (now
 *     impossible in scope) or same-layer, the A→C coupling is never named.
 *   • NON-IMPORT COUPLING. Reading a foreign key straight off worldState needs no
 *     import at all; the registry's receipt addresses, not this scan, cover that.
 *   • ANYTHING OUTSIDE THE CENSUS SCOPE. The census is total over
 *     src/domain/worldPulse and src/domain/spatial only; a layer leaf that lands
 *     in a third directory is unclaimed and uncounted until the scope widens.
 *
 * @enforced-by this file
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

import { COUPLING_REGISTRY } from '../../src/domain/certification/couplingRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests/lint/.coupling-inclusion-baseline.json');

/**
 * The seven ports of DESIGN_FP_COUPLINGS.md §2, as module SETS. Each pattern
 * names a family, not a file. Membership is asserted non-empty per layer below,
 * so a family that emptied reds instead of silently excusing every pair in it.
 */
const LAYER_PATTERNS = Object.freeze({
  WAR: [
    /^src\/domain\/worldPulse\/war[A-Z]/,
    /^src\/domain\/worldPulse\/(?:occupation|deploymentReturn|mobilization|razing|conquest|siege|vengeance|atrocity)/,
    /^src\/domain\/spatial\/(?:armyTransit|embattlement|navalLayer)\.js$/,
    // WC-0A: the people ledger. Where the people a war moves actually ARE — the pools, the
    // events and the conservation identity WC-6's walker derives its checks from — is WAR's own
    // subject, so the leaf takes WAR whatever noun it is named after, on exactly the reading that
    // gave secondOrderBelief.js INFO and strategicPosture.js INTERIOR: the distinction is
    // SUBJECT, not program. It is NOT an ARGUED_UNLAYERED case — the roster is for modules that
    // own no subject and are spoken by every port, and this one owns people-conservation
    // outright. A family home is what will force WC-13's absorption market and WC-15's cohorts to
    // register their couplings instead of reading across a port in silence.
    // ⛔ AN EXACT-PATH REGEX, NOT A `people[A-Z]` PREFIX: a prefix would claim files nobody has
    // designed and silently widen a frozen family (the IN-1 precedent, verbatim; and INT-3B took
    // this identical shape for emigreErrand.js one wave before this one landed).
    /^src\/domain\/worldPulse\/peopleLedger\.js$/,
    // WC-0E: the war-contribution ledger. Who owes whom for a war — the kinds, the record
    // shapes and the conservation the credit rides on — is WAR's own subject, on the same
    // reading that gave peopleLedger.js WAR and emigreErrand.js INTERIOR: the distinction is
    // SUBJECT, not program. It is NOT an ARGUED_UNLAYERED case; the roster is for modules
    // that own no subject and are spoken by every port, and this one owns war-contribution
    // outright. A family home is what will force WC-1's arrival fold and WC-9's close fold to
    // register their couplings instead of reading across a port in silence.
    // ⛔ AN EXACT-PATH REGEX, NOT A `contribution[A-Z]` PREFIX: a prefix would claim files
    // nobody has designed and silently widen a frozen family (the IN-1 precedent, verbatim).
    /^src\/domain\/worldPulse\/contributionLedger\.js$/,
    // W-SEAT SEAT-2c: Stage 3, the REACTIVE ART OF WAR, split out of convergence.js along that
    // file's own declared belief-vs-live-state boundary. What a power does when it believes a
    // column is coming — reinforce, intercept, counter-intervene, stand — is WAR's own subject
    // outright, on the reading that gave peopleLedger.js WAR and emigreErrand.js INTERIOR: the
    // distinction is SUBJECT, not program. Its one layered read is spatial/armyTransit.js, which
    // is WAR already, so the home mints no cross-layer pair — the leaf simply stops being
    // invisible to this ratchet, which is the whole point of giving a new file a family.
    // ⛔ AN EXACT-PATH REGEX, NOT A `convergence[A-Z]` PREFIX: the standing rule above, and here
    // it has teeth — a prefix would also silently claim `convergence.js` itself, which is
    // baselined-unlayered, shrinking a baseline the volume says may never move by accident.
    /^src\/domain\/worldPulse\/convergenceReactive\.js$/,
    // W-SEAT SEAT-2c: who may march to a contest, how long the march takes, and what an
    // unwelcome column keeps of its tilt. A march and its arrival time is WAR's subject on the
    // same reading; the leaf's layered read is `armyMarchWeeks` in spatial/armyTransit.js — WAR
    // — so this home too mints no pair. It is NOT an ARGUED_UNLAYERED case: that roster is for
    // modules owning no subject and spoken by every port, and this one owns march eligibility.
    // ⛔ AN EXACT-PATH REGEX, NOT A `seat[A-Z]` PREFIX: a prefix would claim the whole W-SEAT
    // program's unwritten leaves for WAR, and the seat's other files are not WAR's subject at
    // all — foreignPrimacy.js is INTERIOR two families down, which is the counter-example.
    /^src\/domain\/worldPulse\/seatIntervention\.js$/,
    // W-MEM (lane T12): the Remembrance ledger of concluded wars, and the record shape it
    // opens. What a war WAS once it is over — its sides, its casus pins, the fact block a
    // classifier reads an ending out of — is WAR's own subject as outright as anything in
    // this list, on the identical reading that gave peopleLedger.js and contributionLedger.js
    // their homes: the distinction is SUBJECT, not program. It is NOT an ARGUED_UNLAYERED
    // case; that roster is for modules owning no subject and spoken by every port, and these
    // two own concluded-war memory and nothing else. A family home is what forces the
    // writer's reads to register as couplings instead of crossing a port in silence — which
    // matters more here than usual, because this writer's whole job is to read across the
    // war layer's siblings at the one tick their state is about to be deleted.
    // ⛔ EXACT-PATH REGEXES, NOT A `concluded[A-Z]` PREFIX: the standing rule above (the IN-1
    // precedent), and it binds normally here — a prefix would claim the unwritten leaves of a
    // ledger whose read-side door (Remembrance) is chartered but deliberately NOT built in
    // this train, so the files it would pre-claim are exactly the ones nobody has designed.
    /^src\/domain\/worldPulse\/concludedWars\.js$/,
    /^src\/domain\/worldPulse\/concludedWarRecord\.js$/,
  ],
  TRADE: [
    /^src\/domain\/worldPulse\/(?:routeNetwork|tradeRoute|tradeWar|commodity|merchant|foodStockpile|foodLedger)/,
    // CR-FP-11 arm A: TR-1's casus-commercii family. Four leaves landed in FP cycle 1
    // matching NO pattern here, which made them invisible on BOTH sides of the scan.
    /^src\/domain\/worldPulse\/commercial[A-Z]/,
    // FP TR-2 (lane FP-D, 2026-09-23): the merchant house — the ledger writer and the chooser
    // leaf. A house is a TRADE subject (commerce at faction grain), and both leaves read only
    // unlayered substrate: the faction-plane id comes through dossier/realmEntityWeb.js, never
    // from INTERIOR's factionCompetition.js, so the family owes no coupling row at this wave.
    /^src\/domain\/worldPulse\/house[A-Z]/,
    /^src\/domain\/spatial\/(?:tradeFlow|commodityFlow|supplyShipments|entrepots|dispatchEV|smuggle|seaLanes)\.js$/,
  ],
  FAITH: [
    /^src\/domain\/worldPulse\/(?:faith|sacred|religion|pantheon|conversion|piety|deity|temple)/,
    // WF-1a: the typed patron fall. WHY the family list needed a row at all: the eight
    // prefixes above are named for the SUBJECT's nouns, and this leaf is named for the
    // EVENT — a patron falling — so it matched none of them and landed as a NEW UNLAYERED
    // module against a baseline with zero headroom. That is the whole of the finding: the
    // module owns FAITH's subject outright (the closed fall vocabulary, the classifier and
    // the one ring writer). ⚠ IT NOW HAS TWO IMPORTERS AND THE SECOND CROSSES A LAYER:
    // religiousContest.js in this same family, and warTermination.js — a WAR module — which
    // WF-1d gave `fallCauseFor` as its chartered production caller. THE RATIO IS UNAFFECTED,
    // because the ratio reads SUBJECT OWNERSHIP and never importer count (WF-1d RAISED-4's
    // own finding); what the second importer owes is a licensing row, and WF-1d landed
    // `CPL-23.FAITH_TO_WAR.WF-1d.dissolution_names_the_fall` in couplingRegistryWar.js in the
    // same commit, so the pair reaches the licensing filter and neither ceiling moves.
    // It is NOT an ARGUED_UNLAYERED case — that roster is for
    // modules owning no subject at all — on exactly the reading that gave peopleLedger.js
    // WAR and emigreErrand.js INTERIOR: the distinction is SUBJECT, not program.
    // ⛔ AN EXACT-PATH REGEX, NOT A `patron[A-Z]` PREFIX: a prefix would claim files nobody
    // has designed and silently widen a frozen family (the IN-1 precedent, verbatim, and
    // the same shape WC-0A and WC-0E took for their two ledgers).
    /^src\/domain\/worldPulse\/patronFall\.js$/,
  ],
  POP: [
    /^src\/domain\/worldPulse\/(?:demographics|population|lineageClaim|steading|settlementLifecycleFirstClass)/,
    /^src\/domain\/spatial\/(?:migration|migrationRumors)\.js$/,
  ],
  INFO: [
    /^src\/domain\/worldPulse\/(?:beliefMap|belief[A-Z]|credibility|brokerage|information|disinfo|intel|sightPosture|outboundImpression)/,
    // ES-0: the espionage family. The ES volume folds into the INFORMATION program as a
    // wave family of it, so its leaves are INFO whatever noun they are named after —
    // the same reading CR-FP-11 arm A gave TR-1's commercial leaves and GR-0/GR-1's
    // grammar leaves. It is a DIRECTORY pattern rather than a prefix because the family
    // lives in its own folder; every future ES leaf is claimed the day it lands, which
    // is what stops the unclaimed census from trailing the estate again.
    /^src\/domain\/worldPulse\/espionage\//,
    // IN-0d: the secrecy family. A HIDE posture is INFORMATION's own state — the layer
    // mints it, advances it and owns its hysteresis — so a leaf that reads it takes INFO
    // whatever noun it is named after, on exactly the reading that gave strategicPosture.js
    // INTERIOR and beliefAxisSubjects INFO: the distinction is SUBJECT, not program. It is
    // NOT an ARGUED_UNLAYERED case, and the contrast is sharp — the arguments below are for
    // modules that own no subject and are spoken by every port (the band vocabulary, the
    // law word, the errand mint). This one owns secrecy outright, and giving it a family is
    // precisely what will force FP-TRADE's coming consumer of `secrecyTradeFactorOf` to
    // register its coupling instead of reading across a port in silence.
    /^src\/domain\/worldPulse\/secrecy[A-Z]/,
    // IN-1: the second-order mirror. "What our own record says they have been shown" is
    // INFORMATION's own subject — the layer mints the outbound acts, owns their decay, and
    // owns the belief partition the mirror is forbidden to cross — so the leaf takes INFO
    // whatever noun it is named after, on exactly the reading that gave secrecyTradeFactor
    // INFO and beliefAxisSubjects INFO: the distinction is SUBJECT, not program. It is NOT
    // an ARGUED_UNLAYERED case: the argued roster is for modules that own no subject and are
    // spoken by every port, and this one owns second-order belief outright. Giving it a
    // family is precisely what will force GRAMMAR's coming negotiation-posture consumer to
    // register its coupling instead of reading across a port in silence.
    // ⛔ AN EXACT-PATH REGEX, NOT A `second[A-Z]` PREFIX: a prefix would claim files nobody
    // has designed and silently widen a frozen family.
    /^src\/domain\/worldPulse\/secondOrderBelief\.js$/,
    /^src\/domain\/spatial\/(?:rumorNetwork|intelActs)\.js$/,
    // W-SEAT SEAT-4: the anticipated-reaction forecast. HOMED BY CHAIR DECLARATION
    // (ODQ §861, the SEAT-A2 landing) rather than by the landing lane's judgment, because
    // this is the case the family has no free answer for: the leaf statically reads
    // `beliefMap.js` (INFO) AND `treatyOrientation.js` (GRAMMAR), so EVERY home mints an
    // unlicensed cross-layer pair, and the row that licenses one declares a coupling's
    // direction, desk, flags and receipt address — a chair act, not a walker repair.
    // ⭐ BOTH CANDIDATES WERE MEASURED BY PROBE BEFORE THE RULING, so the choice was made on
    // subject and not on price: INFO ⇒ exactly ONE pair (GRAMMAR→INFO on the treatyOrientation
    // read, now licensed as `WR-6c` in couplingRegistryWar.js); GRAMMAR ⇒ exactly one the
    // other way (INFO→GRAMMAR on the beliefMap read). The cost is one row either way.
    // INFO wins on SUBJECT: the module's heaviest substrate is the belief map and every band
    // it returns is one court's PICTURE of another, which is the shape INFO already owns —
    // "derive a court's decision input from beliefs while consulting a grammar vocabulary"
    // is the espionage-career reading verbatim. The treaty read is the deliberate exception
    // the leaf's own header argues for: a compact is TRUE STRUCTURE, never believed.
    // It is NOT an ARGUED_UNLAYERED case: that roster is for modules owning no subject and
    // spoken by every port, and this one owns the anticipated-reaction forecast outright.
    // ⛔ AN EXACT-PATH REGEX, NOT AN `anticipated[A-Z]` PREFIX: the standing rule above — a
    // prefix would claim files nobody has designed and silently widen a frozen family.
    /^src\/domain\/worldPulse\/anticipatedReactions\.js$/,
  ],
  GRAMMAR: [
    // 2026-08-07: `negotiationPictures` widened to `negotiation[A-Z]`. The layering
    // repair at 67f8a58e split the picture module into a RECORD half and an
    // EVALUATION half, and the new `negotiationEvaluation.js` matched nothing — the
    // exact CR-FP-11 reach gap, reopened by a split rather than by a new leaf. It
    // takes GRAMMAR on the reading this table draws everywhere else: pricing a peace
    // through the term leaves is the pact grammar's own subject, not shared
    // vocabulary. The idiom is `belief[A-Z]` / `commercial[A-Z]` / `pact[A-Z]`, and
    // it claims the negotiation family the day a member lands instead of trailing it.
    /^src\/domain\/worldPulse\/(?:treaty|peaceTerms|peaceReasons|peaceEngine|negotiation[A-Z]|envoy)/,
    // CR-FP-11 arm A: GR-0's news/receipt pools and GR-1's oath-holder identity. The
    // pact grammar's own leaves are GRAMMAR whatever noun they are named after.
    /^src\/domain\/worldPulse\/(?:grammar[A-Z]|oath[A-Z])/,
    // FP GR-2: peacetime formation's four leaves. A LAYER HOME rather than an
    // ARGUED_UNLAYERED entry, and the distinction is the one this table draws: the
    // unlayered arguments below are for modules that own NO subject and are spoken by
    // every layer (the band vocabulary, the law word). These four own the pact grammar's
    // own subject outright, so their cross-layer reads — WAR's alliance-web risk, SPINE's
    // posture and errand mint, INFORMATION's credibility — are exactly the couplings this
    // ratchet exists to make visible, and burying them in an argument would hide them.
    /^src\/domain\/worldPulse\/pact[A-Z]/,
  ],
  INTERIOR: [
    /^src\/domain\/worldPulse\/(?:faction|legitimacy|relationship|institution|commons|disposition|generosity|grievance|rulingPower|npcLadder|seatBooks)/,
    // W-COIN-1a: the state treasury. THE SUBJECT IS WHO RULES AND WHAT RULING COSTS AT
    // HOME, which is INTERIOR's outright — the stock is taxed by the governing archetype
    // through the resolver this leaf exports (composed from rulingPower + factionArchetypes,
    // both INTERIOR's own), its ONLY write to any opinion anywhere is the legitimacy price
    // of extraction through INTERIOR's existing applicator, and the resolver is shared with
    // W-SEAT rather than with any port.
    // ⛔ NOT WAR, and the temptation is real: W-COIN-2's warCosts / coalitionExpenditure
    // reads are the first consumers, and the coffers component is the charter's headline
    // deliverable. But this walker's own settled reading is that the distinction is SUBJECT,
    // not program, and never importer count — the same reading that put peopleLedger.js in
    // WAR, secondOrderBelief.js in INFO and strategicPosture.js here. A crown's purse is not
    // a war subject; a war merely spends it. Giving it INTERIOR is precisely what will force
    // W-COIN-2's WAR reads and W-COIN-3's TRADE-adjacent transfer legs to REGISTER their
    // couplings instead of reading across a port in silence, which is the whole point.
    // ⛔ NOT TRADE either: the design forbids this layer any market, any price model and any
    // exchange rate with grain, and §4.4 separates the STOCK from the prosperity/wealth
    // OPINIONS outright. It is a state purse, not commerce.
    // ⛔ AN EXACT-PATH REGEX, NOT A `treasur[A-Z]` PREFIX: a prefix would claim files nobody
    // has designed and silently widen a frozen family (the IN-1 precedent, verbatim).
    /^src\/domain\/worldPulse\/treasury\.js$/,
    // W-COIN-2: the treasury's news leaf. It takes INTERIOR on exactly the reading that gave
    // treasury.js INTERIOR one line above — a ruler's BOOKS are INTERIOR's own subject, and
    // this leaf composes the beats those books produce (a vault crossing a band, a court that
    // cannot meet its army's wages). The distinction is SUBJECT, not program.
    // ⚠ STATED PLAINLY BECAUSE IT LOOKS LIKE A COUNTER-EXAMPLE: no other `*News.js` module in
    // the estate carries a layer — sovereigntyNews, faithNews, informationNews, grammarNews
    // and commercialReasonsNews all sit in the argued/unlayered roster. They are not the
    // precedent here, because a family follows the SUBJECT a leaf owns and not the noun it is
    // named after; this one owns the crown's books outright, the way peopleLedger.js owns
    // people-conservation. Giving it a family is what will force W-COIN-4's realm aggregation
    // and any TRADE consumer of the band to register their couplings rather than read across
    // a port in silence.
    // ⛔ AN EXACT-PATH REGEX, NOT A `treasur[A-Z]` PREFIX: the note above rules it, and a
    // prefix here would have silently swallowed this very file instead of forcing this row.
    /^src\/domain\/worldPulse\/treasuryNews\.js$/,
    // SP-C: the strategic posture read. It is an SP leaf, and it is NOT unlayered — the
    // distinction the two exclusions below draw is SUBJECT, not program. bandedStock and
    // bandFamilies are shared VOCABULARY every port spells against; this leaf composes a
    // court's remembered standing, its disposition channels, its learned appetite and
    // (behind INT-1) its ruler's books, and every one of those is INTERIOR's own state.
    // The SP-B precedent is the same reading in the other direction: beliefAxisSubjects
    // took INFO because belief is INFO's subject. Giving this a port is also what makes a
    // future WAR or TRADE consumer of `courtPostureOf` register its coupling, which is
    // exactly the designed-coupling discipline this ratchet exists to enforce.
    /^src\/domain\/worldPulse\/strategicPosture\.js$/,
    // INT-3b: the émigré mint seam. A defeated claimant's flight is INTERIOR's own
    // subject — the layer mints the contest that defeats him, owns the standing he
    // loses and owns the grievance his harboring will raise — so the leaf takes
    // INTERIOR whatever noun it is named after, on exactly the reading that gave
    // strategicPosture.js INTERIOR and secondOrderBelief.js INFO: the distinction is
    // SUBJECT, not program. It is NOT an ARGUED_UNLAYERED case, and the contrast is
    // sharp: the argued roster is for modules that own no subject and are spoken by
    // every port — errandMint.js, the head this leaf calls, is exactly such a module
    // and is argued as substrate — while this one owns an exile's departure outright.
    // Giving it a family is what will force INT-3b-ii's coming trigger, and any WAR or
    // POP consumer of an émigré's journey, to register the coupling instead of reading
    // across a port in silence.
    // ⛔ AN EXACT-PATH REGEX, NOT AN `emigre[A-Z]` PREFIX: the secondOrderBelief.js note
    // above rules it, and the reason is unchanged — a prefix would claim files nobody
    // has designed and silently widen a frozen family.
    /^src\/domain\/worldPulse\/emigreErrand\.js$/,
    // W-SEAT SEAT-2a: the primacy axis — WHICH DECISIONS a foreign power may reach, and
    // whether the local court still proposes them or is refused outright. "Whose decision
    // is this at all" is the INTERIOR reading verbatim — the subject is who rules and what
    // ruling costs at home — and the fact that the power doing the reaching is foreign is
    // about the ACTOR, not the subject, exactly as an occupier's tax is still TRADE's.
    // It is NOT an ARGUED_UNLAYERED case: the argued roster is for modules owning no
    // subject and spoken by every port, and this one owns the override class outright.
    // The leaf's only domain read is `src/domain/rulingPowerSeat.js`, which sits outside
    // CENSUS_SCOPE_RE and every family, so this home mints no cross-layer pair.
    // ⛔ AN EXACT-PATH REGEX, NOT A `foreign[A-Z]` PREFIX: the standing rule, and here it
    // would be actively wrong — `foreignGuestHold.js` is a different subject entirely.
    /^src\/domain\/worldPulse\/foreignPrimacy\.js$/,
    // TE-CEIL: the settlement chooser's STRENGTH-AND-EDGE READ LAYER, carved out to bring
    // settlementStrategy.js under the 800-line domain ceiling. Its subject is how strong a
    // court is under the shared pressure index, which raw relationship edge pairs two
    // settlements, and which non-hostile neighbour is strongest — INTERIOR's subject verbatim,
    // on exactly the reading that gave strategicPosture.js its family: the distinction is
    // SUBJECT, not program. It is NOT an ARGUED_UNLAYERED case; that roster is for modules
    // owning no subject and spoken by every port, and this leaf speaks ONE.
    // ⭐ THE CHOOSER ITSELF STAYS UNCLAIMED, and that is the point of the split rather than an
    // inconsistency: settlementStrategy.js reads INTERIOR, INFO, WAR and GRAMMAR in one breath,
    // which is why it has always been unlayered debt. The belief-fogged reads (misjudgmentFor /
    // trueRelationshipType / makeBeliefStrengthFor) were deliberately LEFT in it so this leaf
    // speaks no second port, and the exhaustion pair stayed with them for a different register's
    // sake. This leaf's ONLY import is relationshipEvolution.js, INTERIOR's own, so this home
    // mints NO cross-layer pair — measured, not asserted.
    // ⛔ AN EXACT-PATH REGEX, NOT A `settlementStrategy[A-Z]` PREFIX: the standing rule above —
    // a prefix would claim files nobody has designed and silently widen a frozen family.
    /^src\/domain\/worldPulse\/settlementStrategyReads\.js$/,
    // W-SEAT D10, car SEAT-7a/SEAT-78: THE IRREGULAR-FORCE LEAF. Its subject is whether a
    // settlement's own people would rise against their seat and what that mass is worth — a
    // DOMESTIC-POLITICS quantity composed from three INTERIOR readings (the legitimacy
    // deficit, the commons grievance blend, the faction roster's challenger weight) and
    // handed to the coup verdict, which INTERIOR's own first regex already claims by the
    // `rulingPower` spelling. That is INTERIOR's subject verbatim, on the reading that gave
    // strategicPosture.js and settlementStrategyReads.js their homes: the distinction is
    // SUBJECT, not program. It is NOT an ARGUED_UNLAYERED case — that roster is for modules
    // owning no subject and spoken by every port, and this leaf speaks ONE.
    // ⚠ THE MILITARY-CAPACITY READ DOES NOT MAKE IT WAR, and the distinction is the one F1's
    // UNIT LAW draws: the leaf consumes `deriveMilitaryCapacity`'s precomputed 0..100 FACETS
    // as scalars and touches no army, no deployment, no transit and no headcount — the same
    // facet-scalar reading for which attrition.js and warDeployment.js are exempted from the
    // ruin-filter roster. militaryStrength.js is itself unlayered, so that import mints no
    // pair in either direction — measured, not asserted.
    // ⛔ AN EXACT-PATH REGEX, NOT AN `irregular[A-Z]` PREFIX: the standing rule above — a
    // prefix would claim files nobody has designed and silently widen a frozen family.
    /^src\/domain\/worldPulse\/irregularForce\.js$/,
  ],
});

/**
 * Per-layer floors, RE-MEASURED at CR-FP-11 against the widened table above. They
 * tighten toward reality and are never raised to admit a budget: a floor set at the
 * measured size means a module leaving a family reds rather than shrinking it in
 * silence. (Landing measurement: WAR 40 · TRADE 20 · FAITH 6 · POP 15 · INFO 10 ·
 * GRAMMAR 30 · INTERIOR 28 — every family has GROWN since, and none may fall back.)
 */
const LAYER_FLOORS = Object.freeze({
  WAR: 52, TRADE: 30, FAITH: 8, POP: 19, INFO: 13, GRAMMAR: 42, INTERIOR: 34,
});

/**
 * THE ARGUED EXCLUSIONS — modules inside the FP scope that deliberately carry NO
 * layer home, each with the reason it is not a port. Stated, never omitted: the
 * census below reds on any OTHER unlayered module, so this map is the only door.
 *
 * The four infrastructure hosts were argued when the ratchet landed: a host that
 * mounts every layer's stages is not a layer, and mapping one would mint a pair for
 * every mount and drown the signal in hosting. settlementLifecycleKernel.js is named
 * explicitly because L1 routes every future FP stage through it.
 *
 * CR-FP-11 adds the two SP substrate leaves on the SAME argument one rung down: they
 * are the shared band/severity/decay VOCABULARY every layer spells against, not a
 * port that owns a subject. Giving them a family would make every layer's reading of
 * a band word a cross-layer coupling, which is hosting by another name.
 *
 * ⭐ EACH ADMISSION HAS A MEASURED COVERAGE COST, AND IT IS NOW COUNTED (2026-08-07,
 * second pass). An argued module has no layer, so `scanCrossLayerPairs` — which
 * iterates LAYERED importers and skips any dependency with no layer — cannot see it on
 * EITHER side. Admitting a module therefore does not merely leave its edges
 * unclassified; it deletes them from the scan. That was true of every entry here from
 * the day the ratchet landed, and it was invisible, so each new argument silently
 * subtracted coverage. It is now typed and paid for:
 *
 *   kind: 'host'      — exempt from edge declaration, because mounting many layers IS
 *                       the argument. Bought with a CLOSED set: the host kind is
 *                       exactly the four named infrastructure hosts, by exact equality,
 *                       and each is asserted to really mount more than one layer. A
 *                       fifth host cannot be admitted by adding a line.
 *   kind: 'substrate' — argued because it owns no subject and is spoken by every port.
 *                       That claim is now CHECKED: the entry DECLARES `reads`, its exact
 *                       set of layered imports, and the walker asserts equality against
 *                       the live scan. A true leaf declares `[]` and any port it later
 *                       reaches REDS. A substrate that does read a port must declare
 *                       every module by name and say why in `readsReason`, so the
 *                       coverage it costs is enumerated instead of erased.
 *
 * WHY NOT SIMPLY SCAN THEM ANYWAY (the alternative, considered and rejected with a
 * reason): a pair's direction is spelled `${sourceLayer}→${consumerLayer}`, so an edge
 * touching a module with no layer has no direction to carry and cannot enter the
 * inventory or be licensed by a registry row — the registry addresses couplings BETWEEN
 * PORTS. Declaring the reach is the same information without inventing a fake port for
 * a module the whole argument says has none. The residue is honest and named: edges
 * INTO an argued module (a layered module importing lawWord.js, say) remain outside the
 * pair scan, which is exactly what "this module is vocabulary, not a coupling" asserts.
 */
const ARGUED_UNLAYERED = Object.freeze({
  'src/domain/worldPulse/pulseKernel.js': Object.freeze({
    kind: 'host',
    reason: 'infrastructure host — mounts every layer\'s stages',
  }),
  'src/domain/worldPulse/applyWorldPulse.js': Object.freeze({
    kind: 'host',
    reason: 'infrastructure host — the apply-side mount',
  }),
  'src/domain/worldPulse/worldState.js': Object.freeze({
    kind: 'host',
    reason: 'infrastructure host — the state shape itself',
  }),
  'src/domain/worldPulse/settlementLifecycleKernel.js': Object.freeze({
    kind: 'host',
    reason: 'infrastructure host — L1 routes every FP stage through it',
  }),
  'src/domain/worldPulse/bandFamilies.js': Object.freeze({
    kind: 'substrate',
    reason: 'SP substrate — the shared band/severity vocabulary, spelled by every layer',
    reads: Object.freeze([]),
  }),
  // SUBSTRATE COUPLING (W-LIVES L5 F15, landed at this consist): the goal rule tree became
  // a RULE TABLE, extracted VERBATIM from npcAgency.js so the 830-wall could fall (the size
  // baseline's own burn-down entry records the act). The table owns NO subject — it is the
  // rule tree's data, weights and directions, with a two-line delegate as its only consumer
  // — and wave 3 proved it mints zero cross-layer pairs (couplingInclusion byte-identical
  // base vs tip). Its parent npcAgency.js sits in the PRE-PROGRAM baseline, a door closed
  // to new files by that register's own law, and giving the table a family home would claim
  // a subject the data does not own.
  'src/domain/worldPulse/npcGoalBranches.js': Object.freeze({
    kind: 'substrate',
    reason: 'L5 rule table — npcAgency\'s goal tree as data, extracted verbatim; no subject, one delegate consumer',
    reads: Object.freeze([]),
  }),
  'src/domain/worldPulse/bandedStock.js': Object.freeze({
    kind: 'substrate',
    reason: 'SP substrate — the shared decay law over that vocabulary',
    reads: Object.freeze([]),
  }),
  // ES-0 adds two on the SAME argument the two SP leaves above carry, one rung down.
  // Neither owns a subject; both answer a question every port asks. lawWord.js is the
  // estate's ONE law-band spelling (CR-ES-3) and is spelled by WAR (warSeatBooks),
  // INFORMATION (the espionage doctrine) and GRAMMAR (the testimony/ransom consumer
  // sets), with INTERIOR queued behind INT-1 — giving it a family would make every
  // layer's reading of the word "lawful" a cross-layer coupling. magicWorksAt.js is the
  // world-law predicate "does magic function here", lifted out of warMagicGate.js under
  // ⟨F7⟩ precisely because it was never war-specific: WAR asks it of a siege and
  // INFORMATION asks it of a message.
  'src/domain/worldPulse/lawWord.js': Object.freeze({
    kind: 'substrate',
    reason: 'shared vocabulary — the estate\'s ONE law-band spelling (CR-ES-3), spelled by four ports',
    reads: Object.freeze([]),
  }),
  'src/domain/worldPulse/magicWorksAt.js': Object.freeze({
    kind: 'substrate',
    reason: 'shared world-law predicate — does magic function here, asked by WAR and INFORMATION alike',
    reads: Object.freeze([]),
  }),
  // SP-D adds one on exactly the lawWord.js argument, and it is the argument's clearest
  // case yet. The generalized errand mint head owns NO SUBJECT: it answers "is this
  // person lawfully on the road, and what kind of business is this" — a question five
  // ports are architected to ask (TRADE's factors, FAITH's legates and pilgrims,
  // ES-1/IN-4's couriers, INTERIOR's emigres), which is the whole content of J-SP-2's
  // ruling that the estate has ONE purposeful-travel substrate. Giving it a family would
  // make every port's own lawful mint a cross-layer coupling and would mean choosing a
  // port for a leaf that exists precisely so no port has to own travel. Note the
  // contrast with strategicPosture.js three lines up in INTERIOR: that leaf composes a
  // COURT's memories, which is INTERIOR's subject, so it takes a family. The distinction
  // both times is SUBJECT, not program. Registration is not lost, it moves: the
  // consumers are enumerated in ERRAND_CONSUMERS and measured both ways by
  // tests/lint/errandConsumerRegistry.walker.test.js, which is a stricter register than
  // an import pair (it reds an unregistered minter AND a registry row with no minter).
  'src/domain/worldPulse/errandMint.js': Object.freeze({
    kind: 'substrate',
    reason: 'SP substrate — the estate\'s ONE purposeful-travel mint head (J-SP-2), minted through by five ports; consumers registered in ERRAND_CONSUMERS',
    // MEASURED, not assumed: this is the ONE argued module that is not a leaf, and
    // declaring it is the whole point of the `reads` field. The three are the errand
    // spine's own record/transit/vocabulary leaves, all GRAMMAR — so the mint head sits
    // ON TOP of the envoy family rather than beside it, and SP-D's own note that the
    // errand ROW is still war-welded is the same fact seen from the other side. It is
    // declared rather than repaired here because dissolving it means giving the spine a
    // port-free record leaf, which is a chair-sized move, not a walker's.
    reads: Object.freeze([
      'src/domain/worldPulse/envoyErrandRecords.js',
      'src/domain/worldPulse/envoyErrandTransit.js',
      'src/domain/worldPulse/envoyErrandVocabulary.js',
    ]),
    readsReason: 'the mint head composes the errand spine\'s GRAMMAR-family record, transit and vocabulary leaves; the port-free record leaf that would dissolve this is a chair move (J-SP-2), so the reach is declared and counted rather than erased',
  }),
  // 2026-08-07, and it is the worldState.js argument one rung down rather than a new
  // one. The layering repair at 67f8a58e lifted the four `worldState.spatialLedgers`
  // accessors verbatim out of distanceRead.js so a property read would stop dragging a
  // 53 kB digest reader onto first paint. What the leaf accesses is a CONTAINER, not a
  // subject: the sub-ledgers nested under that one key belong to WAR (warReasons,
  // embattlement), INFORMATION (beliefMaps, rumorLedgers), TRADE (supplyShipments), POP
  // (spatialArrivals) and every future mover. Giving it a port would make each layer's
  // read of ITS OWN ledger a cross-layer coupling — hosting by another name, which is
  // precisely the argument the four infrastructure hosts carry. The baseline was the
  // wrong door for the opposite reason it is usually wrong: that file is for the
  // volume's §4 PRE-PROGRAM debt, and a module minted this week is not that, so putting
  // it there would launder a program-era edit into permanent invisibility.
  'src/domain/spatial/spatialLedgerAccess.js': Object.freeze({
    // NOT kind:'host' — the host kind is closed at the four named mounts, and this is
    // not a mount. It is argued on the SUBSTRATE reading and it pays the substrate
    // price: it declares `reads: []`, which is the machine form of "zero-import leaf",
    // so the day it reaches into a port this reds instead of hiding the edge.
    kind: 'substrate',
    reason: 'infrastructure accessor — the ONE spatialLedgers namespace container, whose sub-ledgers are owned by WAR, INFORMATION, TRADE, POP and every future mover; a port here would make each layer\'s read of its own ledger a cross-layer coupling',
    reads: Object.freeze([]),
  }),
  // ── 2026-08-29, W-CAP CAP-4 (lane TE-CAP): the water flood-fill, extracted ─────
  //
  // The SAME argument spatialLedgerAccess.js carries three lines up, and it arrives the
  // same way: a leaf lifted VERBATIM out of a bigger module because two consumers needed
  // it and two copies would drift. `waterComponents` was private inside seaLanes.js — a
  // TRADE-family module — and design §2 D2 rules ONE water flood-fill home producing both
  // the sailing view TRADE reads and the interior-vs-ocean split the lake typology reads,
  // "never a third ad-hoc BFS".
  //
  // WHY NOT TRADE, WHICH IS WHERE IT CAME FROM. Because it is not TRADE's subject. What it
  // owns is "what shape is the water here" — geometry the sea lanes ask of it, the lake
  // typology asks of it, and any later shoreline or naval reader will ask of it. Filing it
  // under TRADE would make the lake typology's read of pure map geometry a cross-layer
  // coupling into the trade port, which is the exact inversion the substrate reading exists
  // to prevent. The distinction is SUBJECT, not program — the same one that gave
  // peopleLedger.js WAR and spatialLedgerAccess.js no port at all.
  //
  // AND NOT THE BASELINE, for the reason spatialLedgerAccess.js records: that file is for
  // the volume's §4 PRE-PROGRAM debt, and a module minted this week is not that. A baseline
  // row would launder a program-era edit into permanent invisibility.
  //
  // WHAT IT COSTS, MEASURED: its outbound reach is ONE import, `./spatialCost.js`, which is
  // itself unlayered (it sits in the frozen baseline), so it is not a layered read and the
  // declaration below is `[]` — the machine form of "this leaf reaches no port". The day it
  // reaches one, this reds by name instead of hiding the edge.
  'src/domain/spatial/waterBodies.js': Object.freeze({
    kind: 'substrate',
    reason: 'map-geometry substrate — the ONE water flood-fill home (design §2 D2), producing the sailing components TRADE\'s sea lanes read and the interior-vs-ocean split the lake typology reads; a port here would make a pure geometry read a cross-layer coupling',
    reads: Object.freeze([]),
  }),
  // ── 2026-08-30, WEAVE SEAM-5 (lane T6 · REALM-NET): the canon membership read ──────
  //
  // THE THIRD ARRIVAL OF spatialLedgerAccess.js's ARGUMENT, and it arrives by the same
  // road: a read lifted out of `distanceRead.js` because a FIRST-PAINT consumer needed
  // it and importing the 53 kB frozen-digest reader would have dragged that module into
  // the consumer's chunk — the recorded `warCoalitionLedger` incident, and the exact
  // reason the four spatialLedgers accessors were lifted in the first place.
  //
  // WHAT IT OWNS is "which settlements did the canon actually map" — the membership
  // roster the freeze recorded, and nothing else. Every mover already consults it
  // through `mappedDistanceWeight`, which refuses to attenuate a tie whose endpoint the
  // canon never saw; WAR's fronts, TRADE's flows, POP's migrations and every future
  // layer ask the same question of the same roster. Filing it under any one of them
  // would make the others' read of the canon's own membership a cross-layer coupling
  // into that port — the inversion the substrate reading exists to prevent, and the
  // same distinction (SUBJECT, not program) that gave peopleLedger.js WAR and
  // spatialLedgerAccess.js no port at all.
  //
  // AND NOT THE BASELINE, for the reason spatialLedgerAccess.js records: that file is
  // for the volume's §4 PRE-PROGRAM debt, and a module minted this week is not that. A
  // baseline row would launder a program-era edit into permanent invisibility, and the
  // arm above says so in as many words.
  //
  // WHAT IT COSTS, MEASURED: its outbound reach is ONE import, `../display/numberWords.js`
  // — itself a zero-import table, OUTSIDE this census's scope (worldPulse + spatial), and
  // not a port. So the declaration below is `[]`, the machine form of "this leaf reaches
  // no port", and the day it reaches one this reds by name instead of hiding the edge.
  'src/domain/spatial/canonMembership.js': Object.freeze({
    kind: 'substrate',
    reason: 'canon-membership substrate — the ONE read of which settlements the frozen digest actually mapped, asked by every mover through mappedDistanceWeight and by the re-canonize CTA; a port here would make each layer\'s read of the canon\'s own roster a cross-layer coupling, and it is lifted out of distanceRead.js precisely so a first-paint consumer does not drag the 53 kB digest reader into its chunk',
    reads: Object.freeze([]),
  }),
  // ── 2026-08-30, WEAVE NAME-1 (lane TE-NAME): the prose-selection kernel, extracted ──
  //
  // The SAME argument waterBodies.js carries directly above, arriving the same way: a
  // leaf lifted VERBATIM out of a bigger module because a new consumer needed it and a
  // second copy would drift. `fnv1a32` + `pickLine` were minted inside eventProse.js —
  // 1,100 lines of authored prose over ~2,400 lines of frozen pool closure, flattened at
  // module scope and pinned to the lazy engine chunk — and a RENDER-time namer that
  // wanted three lines of hashing would have dragged the whole generation-time corpus
  // behind it. Six independent fnv1a32 transcriptions already exist in this tree, so a
  // seventh was the other available answer and the worse one.
  //
  // WHY NO PORT. What it owns is "pick one of these strings, deterministically" — a
  // protocol every port's prose already speaks. WAR's receipts, TRADE's roads pools,
  // FAITH's, POP's and the calamity register all select through it. Filing it under any
  // one of them would make every other port's prose selection a cross-layer coupling
  // into that port, which is the exact inversion the substrate reading exists to
  // prevent. The distinction is SUBJECT, not program — the same one that gave
  // peopleLedger.js WAR and spatialLedgerAccess.js no port at all.
  //
  // AND NOT THE BASELINE, for the reason spatialLedgerAccess.js records: that file is for
  // the volume's §4 PRE-PROGRAM debt, and a module minted this week is not that.
  //
  // WHAT IT COSTS, MEASURED: its outbound reach is ZERO imports — the leaf is
  // contractually import-free, because an import added there re-parents whatever it
  // reaches into every consumer's chunk, which is the whole defect the extraction cures.
  // `reads: []` is the machine form of that contract, so the day it reaches a port this
  // reds by name instead of hiding the edge.
  'src/domain/worldPulse/proseSelection.js': Object.freeze({
    kind: 'substrate',
    reason: 'prose substrate — the ONE deterministic variant-selection kernel (FNV-1a, canonical-at-zero), spoken by every port\'s prose pools; a port here would make every other layer\'s phrasing pick a cross-layer coupling',
    reads: Object.freeze([]),
  }),
  // ── 2026-08-30, W-SEAM SEAM-3 (T5 train): the capture provenance stamp ─────────
  //
  // The SAME argument waterBodies.js and spatialLedgerAccess.js carry above, and it is
  // the map-geometry reading rather than a new one. What this leaf owns is "is the pack
  // in hand the geometry these coordinates came from" — a question about the MAP, asked
  // at capture and again at a headless re-canonize. It is not TRADE's sea lanes, not
  // WAR's transit, not POP's migration: every port that reads a stored coordinate asks
  // it, and filing it under whichever port happens to capture first would make every
  // OTHER port's read of pure map provenance a cross-layer coupling into that port. The
  // distinction is SUBJECT, not program — the same one that gave peopleLedger.js WAR and
  // waterBodies.js no port at all. Checked against all seven family patterns: none
  // claims the name.
  //
  // AND NOT THE BASELINE, for the reason spatialLedgerAccess.js records: that file is
  // for the volume's §4 PRE-PROGRAM debt, and a module minted this week is not that — a
  // baseline row would launder a program-era edit into permanent invisibility, and the
  // baseline size is an exact 179 the volume says may never grow.
  //
  // WHAT IT COSTS, MEASURED: its outbound reach is ONE import,
  // `../../kernel/proseHash.js`, which sits outside src/domain entirely and therefore
  // carries no layer, so its LAYERED reach measures 0, it is declared `reads: []`, and
  // NO edge leaves the pair scan. What the raise buys is that the FIRST port this leaf
  // ever reaches reds by name.
  'src/domain/spatial/captureSidecar.js': Object.freeze({
    kind: 'substrate',
    reason: 'map-geometry substrate — the provenance stamp answering "is the pack in hand the geometry these coordinates came from" (W-SEAM SEAM-3), asked by every port that reads a stored coordinate; a port here would make a pure map-provenance read a cross-layer coupling into whichever family won the name',
    reads: Object.freeze([]),
  }),
  // ── FP WY-1 (THE SCALE CHARTER): the one mode-speed table, argued as substrate ──
  //
  // OWED BY THE CHARTER'S OWN CREATE (docs/DESIGN_FP_ARCHITECTURE.md §5, CR-FP-11 arm B:
  // a new .js under src/domain/spatial/ takes an ARGUED_UNLAYERED entry in the same commit,
  // never a baseline row). The lawWord.js / bandFamilies.js argument, one rung down: the
  // leaf owns no subject. It holds J-D11(b)'s ONE mode-speed table, the admission of the
  // map's km-scale datum and the reach-band words, and every mover of every port reads its
  // distance through it (armies, envoys, wanderers, columns, caravans, via
  // distanceRead.hopWeeks), so a family here would make each port's own march a cross-layer
  // coupling. MEASURED: its one import is intervalWeeks.js, which sits in the pre-program
  // baseline (unlayered), so its layered reach is 0 and `reads: []` is structural; its
  // importers (distanceRead.js, spatialDigest.js, the store's canonize body) are unlayered
  // or outside the census scope, so no edge leaves the pair scan.
  'src/domain/spatial/modeSpeeds.js': Object.freeze({
    kind: 'substrate',
    reason: 'WY-1 spine substrate — the ONE mode-speed table and the km-scale admission every mover\'s distance is read through (J-D11(b)); owns no subject',
    reads: Object.freeze([]),
  }),
  // ── 2026-08-10: THREE LEAVES THAT LANDED WITHOUT THEIR CLASSIFICATION ──────────
  //
  // These three are not new arguments. They are the SAME two arguments already on this
  // map — worldState.js's host reading one rung down, and the bandFamilies/lawWord
  // vocabulary reading — applied to three modules that landed inside CENSUS_SCOPE_RE
  // owing a classification and not carrying one. IA-1 (d7ec3885) minted the first two
  // and 6e7acc4d the third; neither commit discharged the same-commit obligation
  // DESIGN_FP_ARCHITECTURE.md states for exactly this case ("a NEW .js file under
  // src/domain/worldPulse/ or src/domain/spatial/ … takes a NEW ARGUED_UNLAYERED entry
  // with a written reason in the same commit, never a baseline row"). The census caught
  // all three, which is arm B doing precisely the job it was built for.
  //
  // WHAT THE ADMISSION COSTS, MEASURED RATHER THAN ASSUMED (and it is the cheapest kind
  // this roster holds). The header above says each admission deletes a module's edges
  // from the pair scan. That is true of a module that HAD edges in it. None of these
  // three did: all three are unlayered TODAY, so `scanCrossLayerPairs` already skips
  // them on both sides, and LIVE_PAIRS is the same 176 before and after. Their outbound
  // reach measures 0, 0 and 1. The single edge — worldStateHydration.js reading the
  // GRAMMAR errand-record normalizer — is UNDECLARED today and is declared below, so
  // the net effect of these three rows is one cross-layer edge that was dark becoming
  // enumerated. Nothing is erased. What the roster genuinely buys with the ceiling move
  // is the SECOND edge each of them might grow, which now reds by name.
  'src/domain/worldPulse/ledgerOwnershipManifest.js': Object.freeze({
    // The spatialLedgerAccess.js argument applied to the RECORD rather than the
    // container. This manifest says who may write each ledger, and those ledgers belong
    // to different ports — envoyErrands and treaties to GRAMMAR, beliefMaps to
    // INFORMATION. A port here would make ONE layer the owner of the record of every
    // other layer's writer family, which is hosting by another name.
    kind: 'substrate',
    reason: 'certification-only ownership record over ledgers owned by GRAMMAR (envoyErrands, treaties) and INFORMATION (beliefMaps) alike; every module and symbol is stored as TEXT, it imports nothing, and no runtime writer reads it',
    // Structural, not restraint: the file carries no import statement at all, and the
    // arm below re-derives that from the live file on every run.
    reads: Object.freeze([]),
  }),
  'src/domain/worldPulse/pulseStageResult.js': Object.freeze({
    // The bandFamilies.js / bandedStock.js argument one rung up. Those two are the band
    // VOCABULARY every layer spells; this is the result SHAPE every layer's stage
    // returns. `changed` / `worldState` / `settlementUpdates` / `newsEntries` /
    // `evidence` / `effects` is the mover protocol, not any port's state, so giving it a
    // family would make every port's own stage return a cross-layer coupling.
    //
    // ⚠ THE ONE RESIDUE ON THIS PAGE WORTH NAMING, because it grows rather than shrinks,
    // and the arm below CANNOT see it. `reads` is measured against `layeredImportsOf`, so
    // it is OUTBOUND-only: it catches this envelope reaching into a port, and it is blind
    // to ports reaching into the envelope. This leaf exists precisely to be adopted, so
    // its INBOUND edges are the ones that will multiply, and every one of them sits
    // outside the pair scan. Stated concretely rather than as a caution: the adoption this
    // file is waiting for is pulseKernel.js calling `normalizePulseStageResult` — pinned
    // as not-yet-happened by tests/domain/pulseStageContracts.test.js — and pulseKernel.js
    // is itself an argued HOST four entries up, so that first edge would be invisible
    // under EVERY door, including a LAYER_PATTERNS home. Nothing here is being hidden that
    // a different classification would have caught. What the substrate claim asserts is
    // that returning the common shape is not reading another port's subject, which is the
    // same residue the header already names for edges INTO lawWord.js.
    kind: 'substrate',
    reason: 'the shared pulse-stage result SHAPE every port\'s stage returns; it schedules, imports and executes no mover, so the envelope is the movers\' common protocol rather than any one layer\'s subject',
    reads: Object.freeze([]),
  }),
  'src/domain/worldPulse/worldStateHydration.js': Object.freeze({
    // NOT kind:'host', on the same reading spatialLedgerAccess.js carries: the host kind
    // is closed at the four named mounts by exact equality, and cold ingress is not a
    // mount. So it is argued as SUBSTRATE and pays the substrate price below.
    //
    // It is worldState.js's argument one rung down. The world this leaf admits is every
    // port's state at once, so a family here would make each layer's own persisted state
    // a cross-layer read on admission. The tempting alternative — GRAMMAR, because it
    // imports the envoy record leaf — is the mistake this table refuses everywhere else:
    // the distinction is SUBJECT, not import. Admitting a whole persisted world is the
    // subject; the envoy normalizer is an argument this leaf passes through.
    kind: 'substrate',
    reason: 'the cold persisted-world ingress into the state shape itself — the world it admits belongs to all seven ports, so a port here would make each layer\'s own persisted state a cross-layer read at admission',
    reads: Object.freeze([
      'src/domain/worldPulse/envoyErrandRecords.js',
    ]),
    readsReason: 'the one GRAMMAR read is the strict envoy DTO normalizer, held HERE rather than in worldState.js precisely so its negotiation/peace-term closure does not ride first paint while every raw world still crosses the validator once — that split is the module\'s whole reason for existing, so the reach is declared and counted rather than erased, and a second port reds this arm by name',
  }),
  // ── HB-0 (2026-08-14): THE HABIT FAMILY'S TWO SUBSTRATE LEAVES ────────────────
  //
  // Not a new argument — the bandFamilies / bandedStock / lawWord VOCABULARY reading,
  // applied one rung down to the family that spells against them. Neither leaf owns a
  // subject: one is a closed circumstance-class vocabulary and a borrowed hold ladder,
  // the other is a frozen curve over the shared decay law and the shared outcome ladder.
  // Giving either a LAYER_PATTERNS home would make every port's own reading of a habit
  // word a cross-layer coupling, which is hosting by another name — and no HB filename
  // matches any of the seven family patterns anyway, checked against all seven.
  //
  // ⛔ THE BASELINE DOOR IS CLOSED TO THEM BY DOCTRINE, and the walker's own census arm
  // says so: a new .js under src/domain/worldPulse takes a family or an argued entry in
  // the SAME commit, NEVER a baseline row. The census scope regex recurses into
  // subdirectories, so `habit/` is inside it from the day it exists.
  //
  // ⚠ THE TWO ROWS DO NOT CARRY THE SAME `reads`, AND THE DIFFERENCE IS MEASURED, not
  // copied across. The curve reaches only argued-unlayered siblings; the vocabulary
  // reaches one INTERIOR module, because the hold ladder is a one-directional borrow of
  // a table that is declared `const` upstream and reachable only through that port's own
  // exported tuning bag. A `reads: []` row on the vocabulary would red this file by name.
  'src/domain/worldPulse/habit/habitVocabulary.js': Object.freeze({
    kind: 'substrate',
    reason: 'HB substrate — the closed circumstance-class vocabulary and the borrowed hold ladder, spelled by every port that will file a habit key; it owns no subject and mints no action word',
    reads: Object.freeze([
      'src/domain/worldPulse/dispositionLedger.js',
    ]),
    readsReason: 'the one INTERIOR read is the disposition channel tuning bag, and it is a DERIVATION rather than a coupling: the channel band table is declared const upstream and its only outward path is that bag, so the hold ladder is projected from the live table instead of transcribed into a second array that could drift — declaring the reach is what keeps the borrow one-directional and visible',
  }),
  'src/domain/worldPulse/habit/habitCurve.js': Object.freeze({
    kind: 'substrate',
    reason: 'HB substrate — the frozen reinforcement/decay curve and the single rounding door, riding the shared decay law and the shared outcome ladder rather than authoring either',
    reads: Object.freeze([]),
  }),
  'src/domain/worldPulse/habit/habitGate.js': Object.freeze({
    kind: 'substrate',
    reason: 'HB substrate — the first door of the four-door habit gate ladder, the ONE by-name read of the conditioning flag in the tree; it imports nothing at all, which is what makes its empty reads structural rather than argued',
    reads: Object.freeze([]),
  }),
  'src/domain/worldPulse/habit/habitLedger.js': Object.freeze({
    kind: 'substrate',
    reason: 'HB substrate — the habit sub-ledger and its single writer, storing a learned contrast without computing, deciding or classifying one; the circumstance class arrives as an argument rather than being derived here',
    reads: Object.freeze([]),
  }),
  // ⚠ THE TWO HB-2 ROWS ABOVE CARRY AN EMPTY `reads` FOR TWO DIFFERENT REASONS, MEASURED
  // RATHER THAN COPIED. The gate imports NOTHING, so its row cannot drift in either direction.
  // The ledger imports four modules and every one of them is absent from the layer map: three
  // are habit-family leaves this very map holds as argued-unlayered, and spatialLedgerAccess.js
  // is itself an argued-unlayered row here — an unlayered read is not a cross-layer reach.
  // ⛔ THIS IS WHY `num` AND `asObject` ARE RE-IMPLEMENTED LOCALLY IN THE LEDGER RATHER THAN
  // IMPORTED FROM npcLadderState.js, which exports both: that module matches the INTERIOR layer
  // family, and `layeredImportsOf` is direct-imports-only, so importing those two helpers would
  // give the ledger a real interior read and red this row BY NAME, in both directions. The
  // duplication is deliberate and the trade is recorded where the next reader will meet it.
  // ⚠ THE TWO HB-1 ROWS BOTH CARRY AN EMPTY `reads`, AND THAT IS MEASURED RATHER THAN COPIED
  // FROM THE PAIR ABOVE. The vocabulary leaf is dependency-FREE by contract — the cross-volume
  // collision contract requires it, and a head re-export is how a dependency arrives by the
  // back door, so it has none. The fork registry has exactly ONE import, the habit vocabulary,
  // which this very map already holds as argued-unlayered and which is therefore absent from
  // the layer map — an unlayered read is not a cross-layer reach. ⛔ Neither row may be
  // pattern-matched against habitVocabulary.js's row above, which carries a NON-empty `reads`
  // and a `readsReason`: those rows are not interchangeable.
  'src/domain/worldPulse/strategyMoves.js': Object.freeze({
    kind: 'substrate',
    reason: 'HB-1 substrate — the estate\'s ONE closed strategy-move vocabulary, minted DEPENDENCY-FREE because the cross-volume collision contract rules that exactly one module exports it and that the volume building its strategy wave first mints it as a zero-import leaf; it owns no subject and decides nothing',
    reads: Object.freeze([]),
  }),
  'src/domain/worldPulse/habitForkRegistry.js': Object.freeze({
    kind: 'substrate',
    reason: 'HB-1 substrate — the frozen classification of every weighted decision fork the estate can see, read only by its two totality walkers and never by the engine; its single import is the habit circumstance vocabulary, itself argued-unlayered, so its cross-layer reach is empty',
    reads: Object.freeze([]),
  }),
  'src/domain/worldPulse/lawBandModulation.js': Object.freeze({
    kind: 'substrate',
    reason: 'The law-band modulation table is shared VOCABULARY, not a layer\'s state: four consumer families across two volumes read it — HABIT\'s learning rate-decay, and WC\'s relay efficiency, block cohesion and drift expression — and it owns none of their subjects. It is the bandFamilies / bandedStock / lawWord case exactly: a module every port spells against, carrying a SHAPE and no values. Giving it a layer home would make every port\'s own reading of a shared table read as a cross-layer coupling into whichever family won the name',
    reads: Object.freeze([]),
  }),
  // ── W-OPS O1 (2026-08-31): THE OPERATION FAMILY'S TWO SUBSTRATE LEAVES ────────────
  //
  // Not a new argument — the bandFamilies / bandedStock / lawWord VOCABULARY reading and
  // the HB-0 application of it, taken one volume across. DESIGN_W_OPS §1 rules that GOAL,
  // MISSION and ERRAND are THREE CLASSES OF ONE GRAMMAR, and those three are willed in
  // three different ports: a GOAL by INTERIOR's npc agency, a MISSION by INFORMATION's
  // espionage layer and by the corruption web, an ERRAND by GRAMMAR's envoy spine. A
  // vocabulary spoken by three ports owns none of their subjects, which is precisely the
  // roster's own criterion.
  //
  // ⛔ AND THE LAYER DOOR IS SHUT BY ARITHMETIC, NOT BY PREFERENCE. `Object.keys(
  // LAYER_PATTERNS)` is asserted at EXACTLY 7 in this file, so an eighth OPS family is a
  // new PORT — a chair conversation on the FP volume's own §5 wave order, not something a
  // train car may take in passing. The baseline door is shut by doctrine as well: a new
  // .js under src/domain/worldPulse takes a family or an argued entry in the SAME commit,
  // NEVER a baseline row, and the census scope regex recurses, so `operations/` is inside
  // it from the day it exists.
  //
  // ⚠ THE TWO ROWS CARRY DIFFERENT `reads`, MEASURED RATHER THAN COPIED ACROSS — the same
  // warning the HB pair carries, and for the same reason. The grammar leaf imports
  // NOTHING AT ALL, which is what makes its empty reads structural. The dispatcher imports
  // five modules and exactly ONE of them is layered; the other four are absent from the
  // layer map (deterministicSort and contestMath live outside the census scope, stablePart
  // is unlayered, and the grammar leaf is this very map's own argued row), and an
  // unlayered read is not a cross-layer reach.
  'src/domain/worldPulse/operations/operationGrammar.js': Object.freeze({
    kind: 'substrate',
    reason: 'W-OPS substrate — the ONE typed operation record, its state machine and the owner-unsigned mission-kind catalog, spelled by every port that wills an operation (INTERIOR wills goals, INFORMATION and the corruption web will missions, GRAMMAR wills errands); it owns no subject, decides nothing, rolls nothing and reaches no world',
    reads: Object.freeze([]),
  }),
  'src/domain/worldPulse/operations/missionDispatcher.js': Object.freeze({
    kind: 'substrate',
    reason: 'W-OPS substrate — the §3.12 deliberation road run over a principal\'s unmet demands; it authors no verdict, holds no clock and walks no roster, taking every world fact as an argument, so what it owns is the CAP and the ordering rather than any port\'s subject',
    reads: Object.freeze([
      'src/domain/worldPulse/espionage/espionageDoctrine.js',
      'src/domain/worldPulse/espionage/espionageMath.js',
    ]),
    readsReason: 'both INFORMATION reads are the ES charter\'s own vocabularies, called at their one home rather than copied here, and that is DELIBERATE: DESIGN_W_OPS §0 rules that this volume re-rules none of the ES charter\'s math, so §3.12\'s deliberation verdict and ES-5\'s three-word doctrine targeting are IMPORTED — a copied threshold or a transcribed target set would become a second spelling of one law that nobody notices until the two drift, and declaring the reach is what keeps the extension one-directional and visible',
  }),
  // ── W-OPS O2 (2026-09-01): THE ACCEPTANCE SEAM'S SUBSTRATE LEAF ──────────────────
  //
  // The operation family's THIRD substrate leaf, and the same argument the two rows
  // above carry, taken one car further. DESIGN_W_OPS §1 rules that GOAL, MISSION and
  // ERRAND are three classes of ONE grammar; this leaf is the ACCEPTANCE half of that
  // grammar — whether a principal takes the operation it was offered, priced against the
  // register the offer was rooted at. Acceptance is willed in the same three ports the
  // grammar is: INTERIOR's npc agency accepts a goal, INFORMATION's espionage layer and
  // the corruption web accept a mission, GRAMMAR's envoy spine accepts an errand. A
  // vocabulary spoken by three ports owns none of their subjects, which is precisely the
  // roster's own criterion.
  //
  // ⛔ THE LAYER DOOR IS SHUT BY ARITHMETIC, exactly as it is for the pair above.
  // `Object.keys(LAYER_PATTERNS)` is asserted at EXACTLY 7 in this file, so an eighth OPS
  // family is a new PORT — a chair conversation on the FP volume's own §5 wave order, not
  // something a train car may take in passing. The baseline door is shut by doctrine as
  // well: a new .js under src/domain/worldPulse takes a family or an argued entry in the
  // SAME commit, NEVER a baseline row, and the census scope regex recurses, so
  // `operations/` is inside it from the day it exists.
  //
  // ⚠ `reads` IS MEASURED, NOT COPIED ACROSS — the warning the two rows above carry, and
  // here the empty declaration is STRUCTURAL rather than incidental: this leaf has ZERO
  // relative import specifiers of any kind, so its layered reach is empty before any
  // filter runs. It takes every world fact as an argument and reaches no module at all,
  // which is the machine form of "spoken by every port, speaking none back". The day it
  // reaches one, the coverage arm above reds it by name.
  'src/domain/worldPulse/operations/missionAcceptance.js': Object.freeze({
    kind: 'substrate',
    reason: 'W-OPS substrate — the ACCEPTANCE verdict of the ONE typed operation record: the vetting/willingness/risk seam order, the closed refusal vocabulary, and the register-rooted pricing a principal answers an offer with, spelled by every port that wills an operation (INTERIOR wills goals, INFORMATION and the corruption web will missions, GRAMMAR wills errands); it owns no subject, decides no port\'s state, holds no clock, rolls nothing and walks no WORLD roster, taking every world fact as an argument, so what it owns is the VERDICT SHAPE rather than any port\'s subject',
    reads: Object.freeze([]),
  }),
  // EM-B1h: the pulse's fate words become a CLOSED, KINDED vocabulary. The leaf is the
  // FINITE-SEMANTICS answer to an open one — eighteen words, each with a declared kind,
  // derived from what the six pulse writers already stamp — and it owns no subject: the
  // writers keep every decision, the leaf only holds the spelling and refuses a foreign
  // word on their behalf. Like bandFamilies.js above, a LAYER_PATTERNS home would claim
  // a family for a vocabulary that belongs to all of them at once.
  'src/domain/worldPulse/worldPulseFates.js': Object.freeze({
    kind: 'substrate',
    reason: 'FP substrate — the pulse\'s CLOSED fate vocabulary: the one spelling of every word the world pulse may stamp on worldPulseFate, with the kind each writer\'s own record literal earns it, spoken by every layer that closes, raises or renames an institution; it imports nothing at all, which is what makes its empty reads structural rather than argued',
    reads: Object.freeze([]),
  }),
  // EM-E1: the head-of-tick application of the DM's decrees. THE ARGUMENT IS THE ONE
  // worldPulseFates.js carries one row up, and it is the clearest case the roster has for
  // "spoken by every port, speaking none back": a decree's SUBJECT is whatever the DM
  // decreed, and the charter's own wave-3 rows say so by enumeration — EM-E4 pins forks
  // across WAR (the siege verdict), FAITH (the festival), POP (the court's verdict, the
  // exile's landing) and GRAMMAR (the envoy's road); EM-E5 binds the realm verbs and the
  // information ops; EM-E6 the event catalogue; EM-E7 missions. Filing the hook under any
  // one of those would make every OTHER port's decree a cross-layer coupling into that
  // port — the inversion the substrate reading exists to prevent — and it is not the HOST
  // kind either: that set is closed at four by exact equality, and this leaf mounts no
  // stage. What it owns is the SCHEDULE and the CAUSE SHAPE (which staged entries are due
  // at this tick, in EM-C1's reading order, and the finite receipt each one lands), which
  // is a verdict shape rather than any port's subject — missionAcceptance.js's reading,
  // one volume across.
  // MEASURED AT THE RAISE, never copied: the leaf imports TWO modules and NEITHER is
  // layered. `../edit/registry.js` sits outside CENSUS_SCOPE_RE (worldPulse + spatial) and
  // therefore carries no layer at all; `./pulseHelpers.js` is in the PRE-PROGRAM unlayered
  // baseline, and an unlayered read is not a cross-layer reach. Its layered reach is
  // therefore 0, it is declared `reads: []`, and NO edge leaves the pair scan. What the
  // raise buys is that the FIRST port this leaf ever reaches reds by name — which matters
  // more here than usual, because wave 3's whole remaining programme is bindings between
  // this leaf and the ports.
  'src/domain/worldPulse/decreeHook.js': Object.freeze({
    kind: 'substrate',
    reason: 'EM substrate — the head-of-tick SCHEDULE and CAUSE SHAPE for the DM\'s decrees: which staged entries are due at this tick, in the registry\'s own reading order, and the finite receipt each one lands; it decides no port\'s state, rolls nothing and holds no clock, and the subject of a decree is whatever the DM decreed, which is every port by the charter\'s own wave-3 enumeration',
    reads: Object.freeze([]),
  }),
});

/** The CLOSED host set. A fifth infrastructure host is a chair conversation. */
const ARGUED_HOSTS = Object.freeze([
  'src/domain/worldPulse/pulseKernel.js',
  'src/domain/worldPulse/applyWorldPulse.js',
  'src/domain/worldPulse/worldState.js',
  'src/domain/worldPulse/settlementLifecycleKernel.js',
]);

/**
 * THE ROSTER SIZE — the exact count measured today, and asserted EXACTLY. Admitting one
 * more argued module costs a visible ratchet edit with a written argument, which is the
 * whole cure for "each admission silently subtracts coverage"; retiring one costs the
 * same edit downward, which is what banks the win.
 *
 * ⚠ It is deliberately NOT "a ceiling, not a target" — it said exactly that until
 * 2026-08-10 while the arm was `toBeLessThanOrEqual`, and the two halves of that sentence
 * were in conflict: under an inequality the shrink half was unenforceable, so a dissolved
 * argument left headroom no diff ever recorded. Both directions are now the same
 * deliberate act. The full reasoning sits on the assertion itself.
 *
 * 10 → 13 on 2026-08-10, and the raise is recorded rather than merely made. It admits
 * ledgerOwnershipManifest.js, pulseStageResult.js and worldStateHydration.js — three
 * leaves that landed inside the census scope owing a classification, under two arguments
 * this map already carried rather than any new one. Measured at the raise: all three were
 * unlayered and therefore already invisible to `scanCrossLayerPairs`, LIVE_PAIRS is 176
 * on both sides of the edit, and their outbound reach is 0, 0 and 1 — against 43 and 26
 * for the two big hosts and 3 for errandMint. The single edge is declared below, so the
 * roster grew by three and the estate's DECLARED cross-layer reach grew by one edge that
 * was previously dark. A fourteenth admission is the next deliberate act.
 *
 * 15 → 17 on 2026-08-14 (HB-1, the `hb-1p` train's single member), and the raise is recorded
 * rather than merely made. It admits the closed strategy-move vocabulary leaf and the habit
 * fork registry, both under the substrate argument this map already carries — no new argument.
 * Measured at the raise: both are unlayered and therefore already invisible to
 * `scanCrossLayerPairs`, so no edge leaves the pair scan; the vocabulary leaf's outbound reach
 * is 0 because the collision contract forbids it an import at all, and the registry's is 0
 * because its one import is the argued-unlayered habit vocabulary. An eighteenth admission is
 * the next deliberate act.
 *
 * 13 → 15 on 2026-08-14 (HB-0, the `hb-1` train's first member), and the raise is recorded
 * rather than merely made. It admits the habit family's two substrate leaves under the
 * vocabulary argument this map already carries for bandFamilies, bandedStock and lawWord —
 * no new argument, one rung down. Measured at the raise: both leaves are unlayered and
 * therefore already invisible to `scanCrossLayerPairs`, so no edge leaves the pair scan;
 * their outbound layered reach measures 1 and 0, and the single edge is DECLARED below
 * with its reason. The net effect is one cross-layer read that would otherwise have been
 * dark becoming enumerated. A sixteenth admission is the next deliberate act.
 *
 * 20 → 21 on 2026-08-29 (W-CAP CAP-4, lane TE-CAP), and the raise is recorded rather than
 * merely made. It admits `src/domain/spatial/waterBodies.js` under the SUBSTRATE argument
 * `spatialLedgerAccess.js` already carries — no new argument, applied to map geometry
 * instead of a ledger container: design §2 D2 rules ONE water flood-fill home producing the
 * sailing view TRADE's sea lanes read and the interior-vs-ocean split the lake typology
 * reads, and filing that under TRADE (where the code came from) would make a pure geometry
 * read a cross-layer coupling into the trade port. MEASURED AT THE RAISE, because "every
 * admission deletes that module's edges from the pair scan" is only a real cost for a module
 * that HAD edges: this leaf's outbound reach is ONE import, `./spatialCost.js`, which is
 * itself unlayered, so its layered reach measures 0, it is declared `reads: []`, and NO edge
 * leaves the pair scan. What the raise buys is that the FIRST port this leaf ever reaches
 * reds by name. A twenty-second admission is the next deliberate act.
 *
 * 21 → 22 on 2026-08-30 (WEAVE NAME-1, lane TE-NAME), recorded rather than merely made,
 * and it is the CAP-4 raise one line up applied to prose instead of geometry: a leaf
 * lifted VERBATIM out of a bigger module because a new consumer needed it and a second
 * copy would drift. `src/domain/worldPulse/proseSelection.js` admits `fnv1a32` +
 * `pickLine`, which were private inside `eventProse.js` — 1,100 lines of authored prose
 * over ~2,400 lines of frozen pool closure, flattened at module scope and pinned to the
 * lazy engine chunk. Filing the kernel under any one port would make every OTHER port's
 * phrasing pick a cross-layer coupling into that port, which is the inversion the
 * substrate reading exists to prevent; "pick one of these strings deterministically" is
 * a protocol WAR, TRADE, FAITH, POP and the calamity register all already speak.
 * MEASURED AT THE RAISE, on the same reading: this leaf's outbound reach is ZERO imports
 * — the zero-import contract is the whole point of the extraction, since an import added
 * there re-parents whatever it reaches into every consumer's chunk — so its layered reach
 * is 0, it is declared `reads: []`, and NO edge leaves the pair scan. What the raise buys
 * is that the FIRST port this leaf ever reaches reds by name.
 * A twenty-third admission is the next deliberate act.
 *
 * 22 → 23 on 2026-08-30 (W-SEAM SEAM-3, the T5 train), recorded rather than merely made,
 * and it is the CAP-4 raise two paragraphs up applied to map PROVENANCE instead of map
 * SHAPE. `src/domain/spatial/captureSidecar.js` stamps WHICH GEOMETRY a capture actually
 * held, so a later capture or a headless re-canonize can PROVE the pack in hand is the one
 * a canon's coordinates came from instead of inferring it from a witness row. Filing that
 * under the port that happens to capture first would make every OTHER port's read of pure
 * map provenance a cross-layer coupling into that port — the inversion the substrate
 * reading exists to prevent — and no spatial family pattern claims the name anyway,
 * checked against all seven. MEASURED AT THE RAISE, on the same reading CAP-4 and NAME-1
 * carry: the leaf's outbound reach is ONE import, `../../kernel/proseHash.js`, which sits
 * outside src/domain and therefore carries no layer, so its LAYERED reach is 0, it is
 * declared `reads: []`, and NO edge leaves the pair scan. What the raise buys is that the
 * FIRST port this leaf ever reaches reds by name.
 * A twenty-fourth admission is the next deliberate act.
 *
 * ── 23 → 24, 2026-08-31, WEAVE SEAM-5 (lane T6 · REALM-NET), AT THE LANDING ───────
 * THE TWENTY-FOURTH, AND IT IS THE DELIBERATE ACT THE LINE ABOVE ASKED FOR.
 * ⚠ THE LANE WROTE THIS RAISE AS 22 → 23 AGAINST ITS OWN BASE (ecc6def3e) AND IT IS
 * RE-SEATED HERE, at the landing, because W-SEAM SEAM-3 took the twenty-third seat in
 * the 76 commits that landed in between. Only the SEAT moved: the argument, the measured
 * reach and the `reads: []` declaration below are the lane's own and are unchanged. A
 * ceiling raise is a COUNT of the roster, so two lanes raising 22 → 23 from one base is
 * the same arithmetic-versus-measurement trap the lighting census records — resolved the
 * same way, by re-counting the roster here rather than by keeping the number written
 * there. The roster length is asserted against this constant below, so a wrong seat reds.
 * `src/domain/spatial/canonMembership.js` — the read of which settlements the frozen
 * canon actually mapped, lifted out of `distanceRead.js` so a FIRST-PAINT settings
 * control could ask the question without dragging the 53 kB frozen-digest reader into
 * its chunk. Its full argument sits beside its ARGUED_UNLAYERED entry above; the short
 * form is the one `spatialLedgerAccess.js` established and `waterBodies.js` re-used:
 * what it owns is a roster every port already consults (through `mappedDistanceWeight`),
 * so filing it under any single port would make the others' read of the canon's own
 * membership a cross-layer coupling.
 * MEASURED AT THE RAISE, on the same reading every admission here is measured on: this
 * leaf's outbound reach is ONE import, `../display/numberWords.js` — a zero-import table,
 * OUTSIDE this census's scope (worldPulse + spatial) and not a port. Its layered reach is
 * therefore 0, it is declared `reads: []`, and NO edge leaves the pair scan. What the
 * raise buys is that the FIRST port this leaf ever reaches reds by name.
 * A twenty-fifth admission is the next deliberate act.
 *
 * ⏱ 24 → 26, W-OPS car O1, 2026-08-31 — the twenty-fifth and twenty-sixth admissions, taken
 * together because they are one family and splitting them would leave the dispatcher
 * importing a module this map did not yet know about. Both rows sit above with their full
 * arguments; the short form is the HB-0 one, applied a volume across: DESIGN_W_OPS §1 rules
 * GOAL / MISSION / ERRAND as three classes of ONE grammar, willed in three different ports,
 * so the vocabulary they share owns none of their subjects.
 * MEASURED AT THE RAISE, never copied between the two rows. The grammar leaf imports NOTHING
 * — a zero-import module, so its `reads: []` is structural and cannot drift in either
 * direction. The dispatcher imports six and exactly TWO are layered (`espionageDoctrine.js`
 * and `espionageMath.js`, both INFORMATION, declared with their reason);
 * `deterministicSort.js` and `region/contestMath.js` sit outside this census's scope,
 * `stablePart.js` is unlayered, and the grammar leaf is this map's own row — an unlayered
 * read is not a cross-layer reach. What the raise buys is that the SECOND port either leaf
 * ever reaches reds by name.
 * A twenty-seventh admission is the next deliberate act.
 */
// 26 -> 27 at the SUBSTRATE COUPLING landing: npcGoalBranches.js admitted as substrate —
// L5's rule table, extracted verbatim from the pre-program-baselined npcAgency.js; owns no
// subject, one delegate consumer, zero cross-layer pairs proven at the coupling (the full
// argument sits on its roster entry above). Deliberate, in this diff, per this anchor's law.
// 28 -> 29 at EM-B1h: worldPulseFates.js admitted as substrate — the pulse's CLOSED, kinded
// fate vocabulary, a ZERO-IMPORT leaf, so its `reads: []` is structural rather than argued
// and it mints no cross-layer pair in either direction (scanCrossLayerPairs iterates LAYERED
// importers and skips unlayered deps, and its one consumer, calamityKernel.js, is itself
// unlayered). Deliberate, in this diff, per this anchor's law.
// 29 -> 30 at EM-E1: decreeHook.js admitted as substrate — the head-of-tick schedule and
// cause shape for the DM's decrees, whose subject is whatever the DM decreed and therefore
// every port at once (the full argument sits on its roster entry above). Its two imports
// are BOTH unlayered — one outside CENSUS_SCOPE_RE, one in the pre-program baseline — so
// `reads: []` is measured rather than asserted and no edge leaves the pair scan. THE RAISE
// IS OWED BY THE CHARTER'S OWN CREATE, not chosen: this header's law is that a new .js
// under src/domain/worldPulse takes a family or an argued entry in the SAME commit, and
// wave 3's row puts the leaf at exactly that address. Deliberate, in this diff, per this
// anchor's law.
// 30 -> 31 at WY-1 (SR-1: a count pin the wave's own CREATE moves): modeSpeeds.js admitted as
// substrate — J-D11(b)'s one mode-speed table and the km-scale admission, owning no subject;
// its one import (intervalWeeks.js) is pre-program baselined, so `reads: []` is measured and no
// edge leaves the pair scan. OWED BY THE CHARTER'S OWN CREATE, not chosen. Deliberate, in this
// diff, per this anchor's law.
const ARGUED_ROSTER_CEILING = 31;

/** The FP scope the unlayered census is TOTAL over. */
const CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//;
const UNLAYERED_BASELINE_PATH = join(ROOT, 'tests/lint/.coupling-unlayered-baseline.json');

/**
 * THE UNLAYERED-BASELINE SIZE, and until 2026-08-10 the census's central claim had
 * NOTHING BEHIND IT.
 *
 * DESIGN_FP_ARCHITECTURE.md states the rule absolutely — "the unlayered baseline MAY
 * NEVER GROW; such a file takes a NEW ARGUED_UNLAYERED entry with a written reason in
 * the same commit, never a baseline row" — and arm B's own header below says the frozen
 * set "only shrinks". The test that carries the words "never grew" in its NAME checked
 * four things and not one of them was the size: an anti-vacuity floor, uniqueness,
 * in-scope-and-still-exists, and exact-set equality against LIVE_UNLAYERED. Exact-set
 * equality is the trap: a lane that lands a new unlayered module AND adds its baseline
 * line moves BOTH sides of that equality together and passes green, every arm. The
 * forbidden door was held shut by prose and review courtesy alone — in the same file
 * that says, of a different exception, "a paragraph checks nothing".
 *
 * MEASURED as a matched pair before this landed, which is the only way to know a guard
 * is not decoration: plant a zero-import module under src/domain/worldPulse/ and add its
 * line to the baseline JSON. Against the walker as it stood ten minutes earlier — 16/16
 * GREEN, the growth completely silent. Against this constant — RED, by name, here.
 *
 * EXACT rather than a `<=` ceiling, for the reason the roster arm above now carries: a
 * bound that only forbids growth lets a shrink go unbanked and leaves free slots behind
 * it. The census legitimately shrinks whenever a baselined module finds a layer home, and
 * the arm above already reds to demand that line be deleted; this makes the SAME event
 * also move the recorded size, so the reduction is banked in the diff instead of becoming
 * invisible headroom. That is the sizeBaseline honesty idiom this file's header already
 * cites for the pair inventory, applied at last to the module census.
 */
const UNLAYERED_BASELINE_CEILING = 179;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(p) && !/\.test\./.test(p)) out.push(p);
  }
  return out;
}

/** Every domain module, repo-relative with forward slashes. */
const DOMAIN_MODULES = walk(join(ROOT, 'src/domain'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();

/** module -> layer, plus the modules two families both claimed (must be none). */
const LAYER_OF = new Map();
const DOUBLE_CLAIMED = [];
for (const rel of DOMAIN_MODULES) {
  for (const [layer, patterns] of Object.entries(LAYER_PATTERNS)) {
    if (!patterns.some((re) => re.test(rel))) continue;
    if (LAYER_OF.has(rel)) DOUBLE_CLAIMED.push(`${rel}: ${LAYER_OF.get(rel)} + ${layer}`);
    else LAYER_OF.set(rel, layer);
  }
}

/** Static `from '...'` specifiers only — a dynamic import is a different seam. */
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g;

function relativeImportsOf(rel) {
  const source = readFileSync(join(ROOT, rel), 'utf8');
  const out = new Set();
  for (const match of source.matchAll(IMPORT_RE)) {
    const specifier = match[1];
    if (!specifier.startsWith('.')) continue;
    out.add(relative(ROOT, resolve(dirname(join(ROOT, rel)), specifier)).replace(/\\/g, '/'));
  }
  return [...out].sort();
}

/** The LAYERED subset of a module's relative imports — the reach an argued module owes. */
const layeredImportsOf = (rel) => relativeImportsOf(rel).filter((dep) => LAYER_OF.has(dep));

/**
 * The binding names an importer takes FROM one specific module, at the live import
 * site. This is what makes "same read symbol" checkable instead of merely stated: a
 * retarget that quietly widened what it reads reds here rather than passing on a note.
 */
function importedNamesFrom(importerRel, targetRel) {
  const source = readFileSync(join(ROOT, importerRel), 'utf8');
  const names = new Set();
  for (const match of source.matchAll(IMPORT_RE)) {
    const specifier = match[1];
    if (!specifier.startsWith('.')) continue;
    const resolved = relative(ROOT, resolve(dirname(join(ROOT, importerRel)), specifier)).replace(/\\/g, '/');
    if (resolved !== targetRel) continue;
    const braces = match[0].match(/\{([\s\S]*?)\}/);
    if (!braces) { names.add('*'); continue; }
    for (const raw of braces[1].split(',')) {
      const name = raw.trim().split(/\s+as\s+/)[0].trim();
      if (name) names.add(name);
    }
  }
  return [...names].sort();
}

/** Does `rel` export `symbol` by name — as a declaration or in an export clause? */
function exportsSymbol(rel, symbol) {
  const source = readFileSync(join(ROOT, rel), 'utf8');
  if (new RegExp(`export\\s+(?:async\\s+)?(?:function|const|let|var|class)\\s+${symbol}\\b`).test(source)) return true;
  for (const clause of source.matchAll(/export\s*\{([\s\S]*?)\}/g)) {
    if (clause[1].split(',').some((raw) => raw.trim().split(/\s+as\s+/).pop().trim() === symbol
      || raw.trim().split(/\s+as\s+/)[0].trim() === symbol)) return true;
  }
  return false;
}

/** `${sourceLayer}→${consumerLayer}` — the registry's own direction spelling. */
function scanCrossLayerPairs() {
  const pairs = [];
  for (const [rel, layer] of [...LAYER_OF].sort()) {
    for (const dep of relativeImportsOf(rel)) {
      const depLayer = LAYER_OF.get(dep);
      if (!depLayer || depLayer === layer) continue;
      pairs.push({ importer: rel, imported: dep, direction: `${depLayer}→${layer}` });
    }
  }
  return pairs.sort((a, b) => (`${a.importer}|${a.imported}` < `${b.importer}|${b.imported}` ? -1 : 1));
}

const keyOf = (pair) => `${pair.importer}|${pair.imported}|${pair.direction}`;
const LIVE_PAIRS = scanCrossLayerPairs();
const LIVE_KEYS = new Set(LIVE_PAIRS.map(keyOf));
const BASELINE = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const BASELINE_KEYS = new Set(BASELINE.map(keyOf));

/**
 * THE RETARGET REGISTER — the machine half of the narrow (3) exception in the header.
 *
 * A retarget is the only edit that may change an existing baseline entry's `imported`
 * without banking-and-re-minting. It shipped as a comment plus one `note`, which
 * checked nothing; every clause of the exception is now asserted below against LIVE
 * code, and the register is frozen at length 1 so a second one is a chair conversation
 * rather than a line. `direction` is stated here ONLY so the test can prove it against
 * the layer map — it is DERIVED, never trusted (derive-don't-restate).
 */
const BASELINE_RETARGETS = Object.freeze([
  Object.freeze({
    importer: 'src/domain/worldPulse/peaceTermsPrimitives.js',
    from: 'src/domain/worldPulse/warReasons.js',
    to: 'src/domain/worldPulse/warReasonTaxonomy.js',
    direction: 'WAR→GRAMMAR',
    symbol: 'reasonPairKey',
    at: '67f8a58e',
  }),
]);
/** The baseline key a retarget's surviving entry must carry. */
const retargetKeyOf = (entry) => `${entry.importer}|${entry.to}|${entry.direction}`;
/** The only field a baseline entry may carry beyond the pair identity. */
const BASELINE_ENTRY_KEYS = Object.freeze(['importer', 'imported', 'direction', 'note']);
const basenameOf = (rel) => String(rel).split('/').pop();

/** Scoped modules with no layer home and no argued exclusion — the census subject. */
const LIVE_UNLAYERED = DOMAIN_MODULES
  .filter((rel) => CENSUS_SCOPE_RE.test(rel))
  .filter((rel) => !LAYER_OF.has(rel))
  .filter((rel) => !Object.prototype.hasOwnProperty.call(ARGUED_UNLAYERED, rel));
const LIVE_UNLAYERED_SET = new Set(LIVE_UNLAYERED);
const UNLAYERED_BASELINE = JSON.parse(readFileSync(UNLAYERED_BASELINE_PATH, 'utf8'));

/**
 * THE OWED-ROWS REGISTER — CR-FP-11, measured 2026-08-05, SHRINK-ONLY.
 *
 * Widening the layer table did not merely make future waves visible; it revealed two
 * cross-layer reads FP cycle 1 had already landed with no registry row, because the
 * importer matched no family and the scan skipped it on both sides. They are real
 * couplings, not legacy edges: both landed inside the program, days ago, under the
 * same-commit obligation they escaped only through this blindness.
 *
 * They are frozen HERE rather than dropped into the legacy baseline on purpose. The
 * baseline is for the volume's §4 pre-program EXISTS blocks; putting a program-era
 * violation in it would launder the debt into permanent invisibility, which is the
 * "partial map that READS as a total one" failure this file exists to prevent. So the
 * omission is machine-visible instead, exactly the way the desk walker's DISPUTED
 * register carries its measured disagreements.
 *
 * WHOSE RULING: minting a registry row declares a coupling's direction, desk, flags
 * and receipt address. That is a chair declaration, not a walker repair, so this
 * lane measured and froze it rather than improvising it.
 *
 * ⚠ DATED CORRECTION 2026-08-12: this note formerly said a GRAMMAR row also
 * needed "a registry LEAF that does not exist yet plus a widening of the
 * owningVolume set pin." Both infrastructure clauses were stale.
 * `couplingRegistryGrammar.js` exists and exports the live GRAMMAR coupling
 * aggregates, and `CHARTERED_VOLUME_PREFIXES` already contains `GR`. Only the
 * chair's declaration of the particular coupling remains owed.
 *
 * TO COMPLY: when a row lands, DELETE the entry — the licensing join then covers the
 * pair and the exactness test below reds until the entry is gone, so the win is
 * banked. The register never grows without a chair ruling.
 */
const REACH_OWED_ROWS = Object.freeze([
  Object.freeze({
    importer: 'src/domain/worldPulse/commercialReasons.js',
    imported: 'src/domain/worldPulse/relationshipState.js',
    direction: 'INTERIOR→TRADE',
    owingWave: 'TR-1',
    reads: 'ensureRelationshipState / relationshipKeyFromEdge / normalizeRelationshipType — the trust and resentment the commercial scorers price',
  }),
  Object.freeze({
    importer: 'src/domain/worldPulse/oathHolder.js',
    imported: 'src/domain/worldPulse/npcLadderState.js',
    direction: 'INTERIOR→GRAMMAR',
    owingWave: 'GR-1',
    reads: 'ladderFactionKey / npcInFaction / compareCodepoint — the sanctioned affiliation test the oath-holder identity is composed from',
  }),
]);
const OWED_KEYS = new Set(REACH_OWED_ROWS.map(keyOf));

/** A row licenses a pair when it names the IMPORTER as its read (or its
 *  counterforce) home AND records the same direction. Registry rows address a
 *  module as `path.js#symbol`; the module half is the join key. */
const moduleOf = (address) => String(address || '').split('#')[0];
function licensingRows(pair) {
  return COUPLING_REGISTRY.filter((row) => row.direction === pair.direction
    && (moduleOf(row.read) === pair.importer || moduleOf(row.counterforce) === pair.importer));
}

describe('CW-0w cross-layer inclusion ratchet — anti-vacuity anchors', () => {
  test('the scanned corpus, the layer map and the registry are all non-empty', () => {
    // Every absence claim below is worthless if the walk, the map or the
    // registry silently emptied. Floors tighten toward reality; they are never
    // raised to admit a budget.
    expect(DOMAIN_MODULES.length).toBeGreaterThan(500);
    expect(COUPLING_REGISTRY.length).toBeGreaterThan(0);
    expect(LIVE_PAIRS.length).toBeGreaterThan(100);
    expect(Object.keys(LAYER_PATTERNS)).toHaveLength(7);
  });

  test('every layer family resolves to a real, non-empty, exclusive module set', () => {
    const sizes = {};
    for (const [, layer] of LAYER_OF) sizes[layer] = (sizes[layer] || 0) + 1;
    for (const [layer, floor] of Object.entries(LAYER_FLOORS)) {
      expect(sizes[layer] ?? 0, `${layer} family emptied or shrank past its floor`)
        .toBeGreaterThanOrEqual(floor);
    }
    // A module has exactly ONE layer home; two families claiming it would make
    // the direction of every pair through it a coin flip.
    expect(DOUBLE_CLAIMED).toEqual([]);
  });

  test('every argued exclusion is a real module that still has no layer, under a TYPED argument', () => {
    // Stated, not omitted: a host that mounts every layer is not a layer, and the SP
    // substrate leaves are vocabulary rather than a port. If one ever acquires a layer
    // home — or vanishes — this reds and the exclusion must be re-argued. Each carries
    // a written reason, so the map can never grow a silent member.
    for (const [module, argument] of Object.entries(ARGUED_UNLAYERED)) {
      expect(DOMAIN_MODULES, `${module} vanished — re-aim the exclusion`).toContain(module);
      expect(LAYER_OF.has(module), `${module} acquired a layer home`).toBe(false);
      expect(['host', 'substrate'], `${module} has no recognised argument kind`).toContain(argument.kind);
      expect(argument.reason.length, `${module} is excluded without a reason`).toBeGreaterThan(20);
    }
    // The roster is a measured count, so an admission cannot ride in as one more line:
    // it must move this number, in the diff, with an argument. That is the cure for
    // "each future admission silently subtracts coverage".
    //
    // ⭐ EXACT, NOT `toBeLessThanOrEqual` (2026-08-10). It was an inequality until today,
    // and that quietly defeated half of its own purpose. The docblock on the constant
    // says "Lowering it when an argument dissolves banks the win" — under `<=` nothing
    // ever made that happen: a dissolved argument left the ceiling untouched and the
    // roster one BELOW it, so the next admission rode in through the free slot with no
    // ceiling diff and therefore no review trigger. The whole cure is the diff, so a
    // number that only has to be "not exceeded" is not a ratchet, it is a budget. Exact
    // equality makes BOTH directions a recorded act, and it puts this arm in the same
    // form as the two registers below it (BASELINE_RETARGETS toHaveLength(1),
    // REACH_OWED_ROWS toHaveLength(2)), which were exact from the day they landed.
    expect(Object.keys(ARGUED_UNLAYERED).length,
      'the argued roster no longer matches ARGUED_ROSTER_CEILING. If it GREW: every'
      + ' admission deletes that module\'s edges from the pair scan, so raise the ceiling'
      + ' deliberately, in this diff, with a written argument. If it SHRANK: an argument'
      + ' dissolved — LOWER the ceiling in the same commit so the win is banked and the'
      + ' slot cannot be refilled unreviewed.')
      .toBe(ARGUED_ROSTER_CEILING);
  });

  test('the HOST kind is CLOSED at the four named mounts, and each really mounts more than one layer', () => {
    // The host argument buys its exemption from the reach declaration below with an
    // exact-equality roster: a fifth infrastructure host cannot be admitted by adding a
    // line, and a future edit cannot quietly drop one of the four out of the map and
    // leave the census to catch it as ordinary debt.
    const hosts = Object.entries(ARGUED_UNLAYERED)
      .filter(([, argument]) => argument.kind === 'host').map(([module]) => module);
    expect([...hosts].sort()).toEqual([...ARGUED_HOSTS].sort());
    // …and the claim is checked, not taken: a "host" that mounts one layer or none is a
    // consumer wearing a host's exemption. Floor 2, the measured minimum today
    // (settlementLifecycleKernel reads POP and GRAMMAR); pulseKernel reads all seven.
    for (const host of ARGUED_HOSTS) {
      const layers = new Set(layeredImportsOf(host).map((dep) => LAYER_OF.get(dep)));
      expect(layers.size, `${host} is argued as an infrastructure host but mounts ${layers.size} layer(s)`
        + ' — a module that reads one port is a consumer, and its edges belong in the scan')
        .toBeGreaterThanOrEqual(2);
    }
  });

  test('⭐ every SUBSTRATE exclusion DECLARES its exact cross-layer reach — argued is exempt from CLASSIFICATION, never from the SCAN', () => {
    // THE COVERAGE ARM. An argued module has no layer, so scanCrossLayerPairs cannot see
    // it on either side and every edge through it leaves the inventory. The substrate
    // argument — "it owns no subject, every port speaks it" — implies the module speaks
    // no port back, and that implication is now MEASURED against the live import graph
    // rather than asserted in a sentence. A leaf declares []; anything it later reaches
    // reds by name here instead of vanishing.
    const drift = [];
    for (const [module, argument] of Object.entries(ARGUED_UNLAYERED)) {
      if (argument.kind !== 'substrate') continue;
      const declared = [...argument.reads].sort();
      const actual = layeredImportsOf(module);
      const missing = actual.filter((dep) => !declared.includes(dep));
      const stale = declared.filter((dep) => !actual.includes(dep));
      for (const dep of missing) {
        drift.push(`${module} (argued SUBSTRATE) now reads ${dep} [${LAYER_OF.get(dep)}] and does not`
          + ' declare it. That edge is INVISIBLE to the pair scan because the importer has no'
          + ' layer, so either give the module a LAYER_PATTERNS home (and let the read be'
          + ' licensed like any other coupling), or add it to `reads` with a `readsReason`'
          + ' saying why the substrate argument survives it.');
      }
      for (const dep of stale) {
        drift.push(`${module} (argued SUBSTRATE) declares a read of ${dep} it no longer has`
          + ' — DELETE it from `reads`; the declared reach only shrinks.');
      }
      if (argument.reads.length > 0) {
        expect(String(argument.readsReason || '').length,
          `${module} declares a cross-layer reach with no readsReason — a substrate that speaks`
          + ' a port owes the reason its argument survives that').toBeGreaterThan(40);
      }
    }
    expect(drift).toEqual([]);
    // Guard-the-guard: the arm above is worthless if `reads` is never non-empty anywhere,
    // because then it only ever compares [] to []. errandMint is the live non-leaf, and
    // this pins that the exactness arm is doing real work on a real reach today.
    const declaringModules = Object.entries(ARGUED_UNLAYERED)
      .filter(([, argument]) => argument.kind === 'substrate' && argument.reads.length > 0);
    expect(declaringModules.length,
      'no argued substrate declares any reach — if that became true legitimately, delete this'
      + ' anchor; while it is false the exactness arm above is comparing [] to [] forever')
      .toBeGreaterThan(0);
  });

  test('POSITIVE CONTROL: the scan finds WR-4\'s registered trade read and the join licenses it', () => {
    // Guard-the-guard (the K3 idiom): before trusting what the detector does NOT
    // flag, prove it sees a coupling everyone agrees is there. readWarHomeFront
    // reads the route network for the home front's roads-and-markets band, and
    // WR-4 registered it as CPL-1 TRADE→WAR.
    const control = LIVE_PAIRS.find((pair) => pair.importer === 'src/domain/worldPulse/warCosts.js'
      && pair.imported === 'src/domain/worldPulse/routeNetworkLedger.js');
    expect(control, 'the known TRADE→WAR read is invisible to the scan').toBeTruthy();
    expect(control.direction).toBe('TRADE→WAR');
    const rows = licensingRows(control);
    expect(rows.map((row) => row.couplingId)).toContain('CPL-1.TRADE_TO_WAR.WR-4.home_front_trade');
  });
});

describe('CW-0w cross-layer inclusion ratchet — the shrink-only inventory', () => {
  test('a NEW cross-layer import is either licensed by a registry row or REDS', () => {
    const unlicensed = LIVE_PAIRS
      .filter((pair) => !BASELINE_KEYS.has(keyOf(pair)))
      // The two CR-FP-11 discoveries are accounted for by name in the owed register
      // above, whose own exactness test reds the moment either gains its row.
      .filter((pair) => !OWED_KEYS.has(keyOf(pair)))
      .filter((pair) => licensingRows(pair).length === 0)
      .map((pair) => `${pair.importer} imports ${pair.imported} (${pair.direction})`
        + ' — add its couplingRegistry row in THIS commit (the same-commit obligation,'
        + ' DESIGN_FP_COUPLINGS.md §0.3), naming the importer as the row\'s read address.');
    expect(unlicensed).toEqual([]);
  });

  test('a baseline pair whose import is GONE reds so the win is banked', () => {
    const stale = BASELINE
      .filter((pair) => !LIVE_KEYS.has(keyOf(pair)))
      .map((pair) => `${pair.importer} no longer imports ${pair.imported} (${pair.direction})`
        + ' — DELETE its baseline entry; the inventory only shrinks.');
    expect(stale).toEqual([]);
  });

  test('the committed baseline is exact, unique, and never grew', () => {
    expect(BASELINE.length).toBeGreaterThan(100);
    expect(new Set(BASELINE.map(keyOf)).size).toBe(BASELINE.length);
    for (const pair of BASELINE) {
      expect(typeof pair.importer === 'string' && pair.importer.startsWith('src/domain/')).toBe(true);
      expect(typeof pair.imported === 'string' && pair.imported.startsWith('src/domain/')).toBe(true);
      expect(pair.direction).toMatch(/^[A-Z]+→[A-Z]+$/);
      // No silent fields. `note` is the ONE extra, and it means exactly one thing (a
      // registered retarget, joined below); a lane cannot invent a new key to carry an
      // unreviewed exception in a data file nobody reads as code.
      expect(Object.keys(pair).filter((key) => !BASELINE_ENTRY_KEYS.includes(key)),
        `${pair.importer} → ${pair.imported} carries an unrecognised baseline field`).toEqual([]);
    }
    // The two tests above are jointly an exact-set assertion for UNLICENSED
    // pairs; this states it as one readable claim: the baseline never carries a
    // pair the live scan does not see.
    expect(BASELINE.filter((pair) => !LIVE_KEYS.has(keyOf(pair)))).toEqual([]);
  });

  test('⭐ every RETARGET is what it claims: same importer, DERIVED direction, same symbol, same layer, smaller provider', () => {
    // THE EXCEPTION, MADE CHECKABLE. Nothing here trusts the register's own words:
    // the direction is recomputed from the layer map, the symbol is read off the live
    // import site, and the move is confirmed by the old import being GONE. Repoint an
    // entry at an unrelated module and one of these fires by name.
    for (const entry of BASELINE_RETARGETS) {
      const { importer, from, to, symbol } = entry;
      expect(DOMAIN_MODULES, `${to} vanished — the retarget target is gone`).toContain(to);
      expect(DOMAIN_MODULES, `${from} vanished — re-argue the retarget`).toContain(from);
      // SAME LAYER: the exception is a move INSIDE a port, never a hop between ports.
      expect(LAYER_OF.get(from), `${from} and ${to} are not in the same layer — that is a NEW`
        + ' coupling, not a retarget; bank the old entry and mint a registry row')
        .toBe(LAYER_OF.get(to));
      // SAME DIRECTION, DERIVED. The register's `direction` string is proven, not read.
      expect(`${LAYER_OF.get(to)}→${LAYER_OF.get(importer)}`).toBe(entry.direction);
      // THE MOVE HAPPENED: the importer reads the new provider and no longer the old.
      const imports = relativeImportsOf(importer);
      expect(imports, `${importer} does not import ${to}`).toContain(to);
      const stillOld = `${importer} still imports ${from} — the retarget did not happen, so the`
        + ' old pair is live debt and must keep its own baseline entry';
      // The assertion above proves `imports` CONTAINS `to` — the same array, in the same
      // test, read fresh off the live file — so this absence cannot go vacuous on an
      // emptied or drifted collection.
      // anchored: the preceding toContain(to) on the same array is the liveness proof
      expect(imports, stillOld).not.toContain(from);
      // SAME READ SYMBOL, and ONLY it. A retarget that widened what it reads is a new
      // coupling and must go through arm (1).
      expect(importedNamesFrom(importer, to)).toEqual([symbol]);
      expect(exportsSymbol(to, symbol), `${to} does not export ${symbol}`).toBe(true);
      // NO CONSUMER MOVED: the old provider still re-exports the symbol, which is what
      // made the move count-neutral for everyone other than this importer.
      expect(exportsSymbol(from, symbol), `${from} no longer re-exports ${symbol} — other`
        + ' consumers moved too, so this was a refactor with a wider blast radius than the'
        + ' exception permits').toBe(true);
      // A SMALLER PROVIDER: "moved DOWN" is the whole justification, so it is measured.
      expect(relativeImportsOf(to).length,
        `${to} is not a smaller provider than ${from} — the retarget bought nothing`)
        .toBeLessThan(relativeImportsOf(from).length);
    }
  });

  test('⭐ a retarget is joined BOTH WAYS to a provenance-bearing baseline note, and is count-neutral', () => {
    // The `note` field is the retarget door and nothing else. Both directions are
    // pinned, so neither a noted entry with no register row nor a register row with no
    // note can pass — and the note must actually carry its provenance rather than say
    // "moved".
    const noted = BASELINE.filter((pair) => Object.prototype.hasOwnProperty.call(pair, 'note'));
    expect([...noted].map(keyOf).sort())
      .toEqual([...BASELINE_RETARGETS].map(retargetKeyOf).sort());
    for (const entry of BASELINE_RETARGETS) {
      const rows = BASELINE.filter((pair) => keyOf(pair) === retargetKeyOf(entry));
      expect(rows, `no baseline entry for the retarget onto ${entry.to}`).toHaveLength(1);
      const note = String(rows[0].note || '');
      expect(note).toContain('RETARGET');
      expect(note, 'the note must name the module the entry was moved FROM')
        .toContain(basenameOf(entry.from));
      expect(note, 'the note must carry the commit that moved it').toContain(entry.at);
      expect(note, 'the note must name the symbol whose home moved').toContain(entry.symbol);
      expect(note.length, 'the note must be provenance, not a word').toBeGreaterThan(120);
      // COUNT-NEUTRAL: the entry MOVED. A surviving entry for the old pair would be a
      // bank-plus-mint wearing a retarget's clothes, and would grow the inventory.
      expect(BASELINE.filter((pair) => pair.importer === entry.importer && pair.imported === entry.from),
        `the baseline still carries ${entry.importer} → ${entry.from}; a retarget is count-neutral`)
        .toEqual([]);
    }
    // Frozen: a SECOND retarget is a chair conversation. Raising this number is the
    // reviewable act that stops the exception becoming a general escape hatch.
    expect(BASELINE_RETARGETS).toHaveLength(1);
  });

  test('the owed register is EXACT: each entry is still live, and still unlicensed', () => {
    const stale = [];
    for (const entry of REACH_OWED_ROWS) {
      if (!LIVE_KEYS.has(keyOf(entry))) {
        stale.push(`${entry.importer} no longer imports ${entry.imported} (${entry.direction})`
          + ' — DELETE its owed-register entry; the register only shrinks.');
        continue;
      }
      if (licensingRows(entry).length > 0) {
        stale.push(`${entry.importer} → ${entry.imported} (${entry.direction}) IS licensed now`
          + ` by ${licensingRows(entry).map((row) => row.couplingId).join(', ')}`
          + ' — DELETE its owed-register entry so the win is banked.');
      }
    }
    expect(stale).toEqual([]);
    // Frozen count: the register cannot grow silently while individual rows churn. A
    // third owed row is a chair conversation, not an edit.
    expect(REACH_OWED_ROWS).toHaveLength(2);
    expect(new Set(REACH_OWED_ROWS.map(keyOf)).size).toBe(REACH_OWED_ROWS.length);
    // Every entry is a pair the baseline does NOT already excuse, so the register can
    // never be green merely by duplicating legacy debt.
    for (const entry of REACH_OWED_ROWS) expect(BASELINE_KEYS.has(keyOf(entry))).toBe(false);
  });
});

/**
 * ARM B — THE HABITAT. The ratchet above can only see a module a family pattern
 * claims: `scanCrossLayerPairs` iterates layered importers and skips any dependency
 * with no layer, so a module matching NO pattern is invisible on BOTH sides and an
 * unregistered cross-layer read through it is silent. That is how nine FP cycle-1
 * leaves escaped, and it was invisible because nothing counted the unclaimed.
 *
 * This census removes the habitat rather than the instance: every module in the FP
 * scope is layered, argued, or frozen debt. A NEW unlayered module reds and must pick
 * one of the three. The frozen set only shrinks, so the estate walks toward total
 * coverage instead of accumulating blind spots faster than families.
 */
describe('CW-0w cross-layer inclusion ratchet — the unlayered-module census (CR-FP-11)', () => {
  test('the census subject is real and the scope is non-empty', () => {
    // Guard-the-guard: an absence claim over an empty scan is worthless. The scope
    // must still resolve modules, and the layer map must still claim most of them.
    const scoped = DOMAIN_MODULES.filter((rel) => CENSUS_SCOPE_RE.test(rel));
    expect(scoped.length).toBeGreaterThan(300);
    expect(scoped.filter((rel) => LAYER_OF.has(rel)).length).toBeGreaterThan(150);
    expect(UNLAYERED_BASELINE.length).toBeGreaterThan(100);
  });

  test('a NEW unlayered module REDS — it must get a family, an argument, or the baseline', () => {
    const frozen = new Set(UNLAYERED_BASELINE);
    const escaped = LIVE_UNLAYERED
      .filter((rel) => !frozen.has(rel))
      .map((rel) => `${rel} matches NO layer family pattern, so every cross-layer read`
        + ' through it is INVISIBLE to this ratchet. Give it a LAYER_PATTERNS home (the'
        + ' usual answer), or an ARGUED_UNLAYERED entry with a written reason, or — only'
        + ' for pre-program debt — a line in tests/lint/.coupling-unlayered-baseline.json.');
    expect(escaped).toEqual([]);
  });

  test('a baseline module that FOUND a home reds so the win is banked', () => {
    const stale = UNLAYERED_BASELINE
      .filter((rel) => !LIVE_UNLAYERED_SET.has(rel))
      .map((rel) => `${rel} is no longer unclaimed debt (${LAYER_OF.get(rel) || 'gone or argued'})`
        + ' — DELETE its line from tests/lint/.coupling-unlayered-baseline.json; the'
        + ' census only shrinks.');
    expect(stale).toEqual([]);
  });

  test('the frozen unlayered set is exact, unique, in scope, and never grew', () => {
    // ⭐ THE ARM THAT MAKES THE TEST'S OWN NAME TRUE (2026-08-10). Everything else here
    // pins the baseline's CONTENT against the live set; nothing pinned its SIZE, so the
    // one edit the doctrine forbids outright — a new unlayered module smuggled in with a
    // matching baseline line — moved both sides together and passed. It reds here now,
    // and it reds FIRST, before the content arms, because "the census grew" is the more
    // fundamental fact about a diff than which entry moved.
    expect(UNLAYERED_BASELINE.length,
      'the unlayered census CHANGED SIZE. If it GREW, that is the edit'
      + ' DESIGN_FP_ARCHITECTURE.md forbids outright: a new .js under src/domain/worldPulse'
      + ' or src/domain/spatial takes a LAYER_PATTERNS home or an ARGUED_UNLAYERED entry'
      + ' with a written reason in the same commit, NEVER a baseline row. If it SHRANK, a'
      + ' module found a home — bank the win by lowering UNLAYERED_BASELINE_CEILING in this'
      + ' same commit.')
      .toBe(UNLAYERED_BASELINE_CEILING);
    expect(new Set(UNLAYERED_BASELINE).size).toBe(UNLAYERED_BASELINE.length);
    for (const rel of UNLAYERED_BASELINE) {
      expect(typeof rel === 'string' && CENSUS_SCOPE_RE.test(rel), rel).toBe(true);
      expect(DOMAIN_MODULES, `${rel} vanished — delete its baseline line`).toContain(rel);
    }
    // The two tests above are jointly an exact-set assertion; this states it once as a
    // readable claim, so neither direction can drift without a named failure.
    expect([...UNLAYERED_BASELINE].sort()).toEqual([...LIVE_UNLAYERED].sort());
    // An argued module may never ALSO sit in the baseline — two doors for one module
    // would let a deleted argument pass unnoticed through the other.
    for (const module of Object.keys(ARGUED_UNLAYERED)) {
      // The exact-set equality above proves UNLAYERED_BASELINE equals the LIVE unlayered
      // set, and the anti-vacuity anchor holds it over 100 entries, so an emptied
      // baseline reds there rather than passing silently here.
      // anchored: the exact-set equality above is the liveness proof for this collection
      expect(UNLAYERED_BASELINE, `${module} is both argued and baselined`).not.toContain(module);
    }
  });
});
