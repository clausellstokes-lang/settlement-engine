# ORDER-MEASURE-1 · the five candidate cures, written by anchor into five scratch trees: python3 mkcures.py <scratch>
import sys, re
S = sys.argv[1]; F = 'src/generators/steps/assembleSettlement.js'
RR = "  rerenderStressSummary(settlement.stress);\n  rerenderStressSummary(settlement.stressors);\n"
CLOSE = "resolveFactionLabelsAtClose(settlement); // CENSUS-1i R-AW"
ARR = "  settlement.arrivalScene     = inAssemblySubstream(rng, 'arrival-scene', () => generateArrivalScene(settlement));\n"
DEF_ = "  settlement.defenseProfile   = generateDefenseProfile(settlement, keepOfRecord(settlement.economicState)); settlement.economicState = withGuardPaidFromDefence(settlement);"
def edit(tree, f, fn):
    p = f'{S}/{tree}/{f}'; t = open(p).read(); u = fn(t); assert u != t, (tree, f); open(p, 'w').write(u)
def after_close(t, ins):
    i = t.index(CLOSE); j = t.index('\n', i) + 1; return t[:j] + ins + t[j:]
# C1a: the crisis summary (and its hook and note) rendered AFTER the last power write (A13), not at A1
def c1a(t):
    assert RR in t; t = t.replace(RR, "  // ORDER-MEASURE-1 C1a: the re-render moved below, after the last write of the powers (A13)\n", 1)
    return after_close(t, "  // ORDER-MEASURE-1 C1a: the stress summary re-rendered here, on the SETTLED record (moved from after the name pin)\n" + RR)
edit('c1a', F, c1a)
# C1b: the draw kept at A1; a late pass re-renders each entry from its kept roll against the SETTLED record (the resolver swaps a line whose needs fail for its twin)
def c1b(t):
    t = t.replace("        delete e.summaryRoll;\n", "        OM_ROLLS.set(e, e.summaryRoll); // ORDER-MEASURE-1 C1b: the roll kept for the late re-read\n        delete e.summaryRoll;\n", 1)
    t = t.replace("  const rerenderStressSummary = (container) => {", "  const OM_ROLLS = new Map(); // ORDER-MEASURE-1 C1b\n  const rerenderStressSummary = (container) => {", 1)
    late = ("  // ORDER-MEASURE-1 C1b: THE LINE RE-READ on the settled record: the same roll, the declared sets resolved against the final facts (draw-free)\n"
            "  for (const [e, roll] of OM_ROLLS) { const facts = factsOf(settlement); e.summary = renderStressSummary(e.type, settlement.name, roll, e.direction, facts);"
            " const cellOpts = { facts, poolId: 'stressTypes:STRESS_TYPE_SIBLINGS', surface: 'crisis', drawKind: /** @type {'T'} */ ('T') };"
            " if (typeof e.crisisHook === 'string') e.crisisHook = resolveSibling(e.crisisHook, STRESS_TYPE_SIBLINGS, cellOpts);"
            " if (typeof e.viabilityNote === 'string') { const note = resolveSibling(e.viabilityNote, STRESS_TYPE_SIBLINGS, { ...cellOpts, dropRefused: true }); if (note == null) delete e.viabilityNote; else e.viabilityNote = note; } }\n")
    return after_close(t, late)
edit('c1b', F, c1b)
# C2a: the narratives re-run on the SETTLED roster, on their own step stream (the same seed::generateNarratives), after the resize (A5/A6), before the coherence seam (A7)
def c2a_n(t):
    t = t.replace("}, (ctx) => {\n  const {\n    tier, population, tradeRoute, effectiveConfig,", "}, (ctx) => narrativesOf(ctx));\n\n/** ORDER-MEASURE-1 C2a: the step's body, exported so the assembly can re-run it on the settled roster */\nexport function narrativesOf(ctx) {\n  const {\n    tier, population, tradeRoute, effectiveConfig,", 1)
    assert t.rstrip().endswith('});'); return t.rstrip()[:-3] + '}\n'
edit('c2a', 'src/generators/steps/generateNarratives.js', c2a_n)
def c2a(t):
    anchor = "  if (settledEconomy !== settlement.economicState) settlement.economicState = settledEconomy;\n"
    ins = ("  // ORDER-MEASURE-1 C2a: THE PROSE STEP MOVED after the last write of the roster it reads: the narratives re-run on the resized roster,\n"
           "  // on the narrative step's own stream (createPRNG(seed).fork('generateNarratives'), the stream step 20 drew on), so no other draw moves.\n"
           "  if (rosterResized) { const nr = createPRNG(ctx._seed).fork('generateNarratives'); const prevNr = setActiveRng(nr);"
           " try { const re = narrativesOf({ ...ctx, powerStructure: settlement.powerStructure, simulationTrace: [] });"
           " settlement.history = re.history; settlement.settlementReason = re.settlementReason; settlement.resourceAnalysis = re.resourceAnalysis; settlement.economicViability = re.economicViability; }"
           " finally { clearActiveRng(prevNr); } }\n")
    assert anchor in t; t = t.replace(anchor, anchor + ins, 1)
    return t + "import { narrativesOf } from './generateNarratives.js'; import { createPRNG } from '../../kernel/prng.js'; // ORDER-MEASURE-1 C2a\n"
edit('c2a', F, c2a)
# C3a: the arrival scene drawn AFTER the last write of what it reads (A13), on its own named child stream as before
def c3a(t):
    assert ARR in t; t = t.replace(ARR, "  // ORDER-MEASURE-1 C3a: the arrival scene moved below, after A13\n", 1)
    return after_close(t, "  // ORDER-MEASURE-1 C3a: the arrival scene, on the settled record (its own 'arrival-scene' child, unchanged)\n" + ARR)
edit('c3a', F, c3a)
# C3c: the defence settled BEFORE the arrival scene is written (A3 above A2)
def c3c(t):
    assert ARR in t and DEF_ in t; t = t.replace(ARR, "", 1); return t.replace(DEF_, DEF_ + " // ORDER-MEASURE-1 C3c: the defence settled before the arrival scene\n" + ARR.rstrip('\n'), 1)
edit('c3c', F, c3c)
print('ok')
