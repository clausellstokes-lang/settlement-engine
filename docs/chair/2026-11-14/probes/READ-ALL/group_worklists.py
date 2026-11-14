#!/usr/bin/env python3
# READ-ALL: the traced rows partitioned into GROUPS OF FILES (no file in two groups), one worklist a group, widest first.
# usage: group_worklists.py <trace dir (traced.json)> <merge dir (flags.all.json)> <out dir>
import io, os, sys, json, collections, fnmatch
TRACE, MERGED, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
G = collections.OrderedDict([
 ('SERVICES', ("the Services tab's rows: what each house offers", ['src/data/institutionServices.js', 'src/generators/servicesGenerator.js'])),
 ('HOUSES', ("the houses' descriptions and the catalogue", ['src/data/institutionDescColour.js', 'src/data/institutionDescVariants.js', 'src/data/institutionalCatalog.js', 'src/data/resourceChains.js', 'src/data/supplyChainData.js', 'src/data/economicData.js', 'src/data/geographyData.js'])),
 ('HISTORY', ("history, arrival and culture rows", ['src/generators/history/historyRouteContext.js', 'src/data/historyData.js', 'src/data/arrivalProse.js', 'src/data/cultureProfiles.js', 'src/data/stressTypes.js', 'src/data/historyDescVariants.js', 'src/generators/historyGenerator.js', 'src/domain/foodways.js'])),
 ('TIES', ("people's ties, goals and the plot hooks", ['src/data/npcData.js', 'src/domain/hookThemes.js', 'src/data/powerSiblings.js', 'src/generators/npcStructure.js', 'src/data/personHooksByTitle.js', 'src/data/faceHonorifics.js', 'src/data/people/goalFamilies.js', 'src/domain/dossier/plotHooks.js'])),
 ('NARRATIVE', ("the told history: origin prose and the narrative tables", ['src/generators/narrativeGenerator.js', 'src/generators/narrative/settlementOriginProse.js', 'src/data/narrativeData.js', 'src/data/stressInstitutionEffects.js', 'src/generators/narrativeText.js', 'src/domain/facts/founder.js', 'src/generators/narrative/foundingRowAdmits.js'])),
 ('CORPUS-ECO', ("the corpus: the economy and general pools", ['src/data/dossierStateProse/economy.generated.js', 'src/data/dossierStateProse/general.generated.js'])),
 ('CORPUS-DEF', ("the corpus: the defence, power, conditions and faith pools", ['src/data/dossierStateProse/defense.generated.js', 'src/data/dossierStateProse/power.generated.js', 'src/data/dossierStateProse/stressors.generated.js', 'src/data/dossierStateProse/warFaith.generated.js'])),
 ('POWERS', ("the powers: standing, claims, governance, the people's power lines", ['src/data/people/handlerTieLines.js', 'src/data/stressPowerFaces.js', 'src/domain/factionProfile.js', 'src/data/people/titleSecretsPresentations.js', 'src/data/people/dmPowerLines.js', 'src/generators/power/*', 'src/domain/dossier/powerStrata.js', 'src/domain/display/governanceAccount.js', 'src/generators/factionDynamics.js'])),
 ('DEFECON', ("the safety, defence and economy generators and their display", ['src/generators/economy/foodBalance.js', 'src/data/resourceData.js', 'src/generators/isolationGenerator.js', 'src/generators/safetyProfile.js', 'src/generators/economy/economicState.js', 'src/generators/economy/prosperity.js', 'src/generators/economy/incomeLineSiblings.js', 'src/generators/economy/tradeGoods.js', 'src/generators/economy/viability.js', 'src/generators/safetyLineTruth.js', 'src/domain/display/defenseDisplay.js', 'src/domain/display/dossierViewModel.js', 'src/generators/computeActiveChains.js', 'src/generators/resourceGenerator.js', 'src/generators/steps/cascadePass.js'])),
 ('CRISIS', ("the crisis summary, the quick guide, the faith reading, the outlook hooks", ['src/domain/coherence/hookTruth.js', 'src/domain/crisis/crisisHooks.js', 'src/domain/activeConditions.js', 'src/domain/dossier/faithReading.js', 'src/domain/coherence/crisisFactFindings.js', 'src/generators/stressNarrative.js', 'src/domain/summary/settlementQuickGuide.js', 'src/generators/economy/outlookHookSiblings.js', 'src/domain/crisis/crisisSummaryVantage.js', 'src/domain/crisis/crisisCast.js'])),
 ('DISPLAY-ECON', ("rows the display composes on the Economics, Resources, Magic and Outlook tabs (no fixed run to trace: find the writer first), and those tabs' own leaves", ['src/components/new/tabs/EconomicsTab.jsx', 'src/components/new/tabs/ResourcesTab.jsx', 'src/components/new/tabs/MagicTab.jsx', 'src/components/new/tabs/OutlookTab.jsx', 'src/domain/facts/magicSource.js', 'src/domain/facts/chainWorking.js', 'src/domain/display/magicProvisionShown.js', 'src/domain/display/chainNeedShown.js', 'src/domain/display/foodBalanceBar.js', 'src/domain/display/tradeListDisplay.js'])),
 ('DISPLAY-CIVIC', ("rows the display composes on the Power tab, the Summary, and the World tabs (no fixed run to trace: find the writer first), and their own leaves", ['(untraced)', 'src/components/*', 'src/domain/display/*', 'src/domain/facts/*'])),
])
def group_of(f):
    for g, (_, pats) in G.items():
        for p in pats:
            if f == p or fnmatch.fnmatch(f, p) or (p.endswith('/*') and f.startswith(p[:-1])): return g
    return 'REST'
H = json.load(io.open(TRACE + '/traced.json', encoding='utf-8'))
rows = collections.defaultdict(list)
for h in H:
    f = (h.get('writer') or {}).get('file') or '(untraced)'
    g = group_of(f)
    if f == '(untraced)':
        sec = h.get('view') or ''
        g = 'SERVICES' if sec in ('Systems/Institutions', 'Systems/Services') else 'DISPLAY-ECON' if sec in ('Systems/Economics', 'Systems/Resources', 'Systems/Magic', 'Systems/Outlook') else 'DISPLAY-CIVIC'
    rows[g].append(h)
tot = 0
for g, hs in sorted(rows.items(), key=lambda kv: -sum(h['n'] for h in kv[1])):
    hs.sort(key=lambda h: (-(h['sev'] == 'HIGH'), -h['n'])); tot += len(hs)
    title, pats = G.get(g, ('files no group holds', []))
    files = collections.Counter(); ftowns = collections.Counter(); wr = collections.defaultdict(lambda: [0, 0])
    for h in hs:
        w = h.get('writer') or {}; f = w.get('file') or '(untraced)'
        files[f] += 1; ftowns[f] += h['n']; k = f + ' :: ' + str(w.get('fn', '')); wr[k][0] += 1; wr[k][1] += h['n']
    print('%-11s rows %4d (HIGH %2d) · towns printing (sum) %5d · files %2d · writers %3d' % (g, len(hs), sum(1 for h in hs if h['sev'] == 'HIGH'), sum(h['n'] for h in hs), len(files), len(wr)))
    json.dump([{'id': h['rid'], 'sev': h['sev'], 'n': h['n'], 'town': h['seed'], 'section': h['view'], 'fold': h['fold'], 'text': h['line'], 'why': h['why'], 'kinds': h['kinds'],
                'writer': {k: (h.get('writer') or {}).get(k) for k in ('file', 'line', 'fn')}} for h in hs], io.open('%s/WORKLIST-%s.json' % (OUT, g), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    with io.open('%s/WORKLIST-%s.md' % (OUT, g), 'w', encoding='utf-8') as fh:
        fh.write('# READ-ALL worklist · %s · %s\n\n' % (g, title))
        fh.write('%d flagged sentences (HIGH %d), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town\'s facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-%s.json` beside this file (each row\'s `fold` is its key in an inventory).\n\n' % (len(hs), sum(1 for h in hs if h['sev'] == 'HIGH'), g))
        fh.write('## YOUR FILES (no other seat holds them)\n\n')
        for p in pats: fh.write('- `%s`\n' % p)
        fh.write('\n## By file (flagged sentences · towns printing, summed)\n\n')
        for f, c in sorted(files.items(), key=lambda kv: -ftowns[kv[0]]): fh.write('- `%s` · %d · %d\n' % (f, c, ftowns[f]))
        fh.write('\n## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)\n\n')
        for k, (c, n) in sorted(wr.items(), key=lambda kv: -kv[1][1])[:70]: fh.write('- %s · %d · %d\n' % (k, c, n))
        fh.write('\n## The sentences, HIGH first, then widest first\n\n| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |\n|---|---|---|---|---|---|---|---|\n')
        for h in hs:
            w = h.get('writer') or {}
            fh.write('| %s | %d | %s | %s | %s | %s | %s | %s (line %s at e5b421802) %s |\n' % (h['sev'], h['n'], h['rid'], h['view'], h['seed'], h['line'][:320].replace('|', '/'), h['why'][:240].replace('|', '/'), w.get('file', '(untraced)'), w.get('line', ''), str(w.get('fn', ''))[:70]))
print('rows', tot)
# the record's own incoherence: every flag on a header
F = json.load(io.open(MERGED + '/flags.all.json', encoding='utf-8'))
rec = [f for f in F if str(f.get('id')) == 'HEADER' or f.get('kind') == 'RECORD']
with io.open(OUT + '/RECORD-FLAGS.md', 'w', encoding='utf-8') as fh:
    fh.write('# READ-ALL · the record itself cannot be so: every flag a reader put on a town\'s header (%d)\n\nEach line: the town, the severity, what the reader said. These are faults of the generated RECORD (the page prints them faithfully): a cure moves the record and is a declared move: MEASURE FIRST.\n\n' % len(rec))
    for f in sorted(rec, key=lambda f: (str(f.get('town')), str(f.get('why')))): fh.write('- %s · %s · %s\n' % (f.get('town'), f.get('sev'), str(f.get('why', '')).replace('\n', ' ')))
json.dump(rec, io.open(OUT + '/RECORD-FLAGS.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
low = [f for f in F if f.get('sev') == 'LOW' and f not in rec]
json.dump(low, io.open(OUT + '/LOW-FLAGS.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('record flags', len(rec), '· LOW flags kept apart', len(low))
