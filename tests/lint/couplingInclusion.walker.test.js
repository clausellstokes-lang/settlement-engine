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
  ],
  TRADE: [
    /^src\/domain\/worldPulse\/(?:routeNetwork|tradeRoute|tradeWar|commodity|merchant|foodStockpile|foodLedger)/,
    // CR-FP-11 arm A: TR-1's casus-commercii family. Four leaves landed in FP cycle 1
    // matching NO pattern here, which made them invisible on BOTH sides of the scan.
    /^src\/domain\/worldPulse\/commercial[A-Z]/,
    /^src\/domain\/spatial\/(?:tradeFlow|commodityFlow|supplyShipments|entrepots|dispatchEV|smuggle|seaLanes)\.js$/,
  ],
  FAITH: [
    /^src\/domain\/worldPulse\/(?:faith|sacred|religion|pantheon|conversion|piety|deity|temple)/,
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
    /^src\/domain\/spatial\/(?:rumorNetwork|intelActs)\.js$/,
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
 */
const ARGUED_ROSTER_CEILING = 13;

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
 * and receipt address, and the GRAMMAR row additionally needs a registry LEAF that
 * does not exist yet plus a widening of the owningVolume set pin. That is a chair
 * declaration, not a walker repair, so this lane measured and froze it rather than
 * improvising it.
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
