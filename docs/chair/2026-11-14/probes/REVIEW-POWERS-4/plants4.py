# REVIEW-POWERS-4 plants4.py — PLANT=<a detached worktree at the tip, used for nothing else> OUT=<dir> python3 plants4.py [name ...]
# One plant per cure the stage added or changed: each puts ONE cure back to the base's behaviour (or breaks it) in one
# place, runs the stage's guard files (added or changed by the stage), records which files red, and restores the file
# from git. A plant that reds no file is a cure with no guard.
import json, os, subprocess, sys
P = os.environ['PLANT']; OUT = os.environ['OUT']; os.makedirs(OUT, exist_ok=True)
GUARDS = """tests/data/faceHonorificsGender.test.js tests/data/goalChainWords.test.js tests/generators/npcStructureBody.test.js
tests/generators/people/goalCharterRefused.test.js tests/generators/people/personsHeldLines.test.js tests/generators/power/claimRungReadsRoster.test.js
tests/generators/power/claimRungsCommanding.test.js tests/components/legitimacyPlainWords.test.jsx tests/components/powerTabSupport.test.jsx
tests/data/dmPowerLinesPossessive.test.js tests/data/faceHonorifics.test.js tests/data/goalFamilies.test.js tests/data/midwifeHonorific.test.js
tests/domain/dossier/criminalHouseNoDefault.test.js tests/generators/npcStructureHouseKind.test.js tests/generators/npcStructureSeatPlain.test.js
tests/generators/npcStructureWantsVoiceable.test.js tests/generators/people/lordNotGovernment.test.js tests/generators/people/mintedFaceUnderworld.test.js
tests/generators/people/mintedLordKeepsLines.test.js tests/generators/people/titleLineDisqualifiers.test.js tests/generators/power/sovereignNoCrown.test.js
tests/generators/power/standingAgainstFigure.test.js""".split()
PLANTS = {
 'none': [],
 'alewife-male': [('src/data/faceHonorifics.js', '"the alewife": [{ male: "Brewster", female: "Alewife" }, "Brewster"]', '"the alewife": ["Alewife", "Brewster"]')],
 'midwife-first': [('src/data/faceHonorifics.js', '"the midwife": [{ male: "Goodman", female: "Midwife" },', '"the midwife": ["Midwife",')],
 'madam-male': [('src/data/faceHonorifics.js', '"the madam": [{ male: "Master", female: "Madam" }]', '"the madam": ["Madam"]')],
 'district-madam-male': [('src/data/faceHonorifics.js', '"the district madam": [{ male: "Master", female: "Madam" }]', '"the district madam": ["Madam"]')],
 'supply-siege-one': [('src/data/people/goalFamilies.js', "{ line: 'Find whoever can still supply {house}, and pay them what they ask.', excludes: ['crisis: siege'] },", "'Find whoever can still supply {house}, and pay them what they ask.',")],
 'supply-famine-one': [('src/data/people/goalFamilies.js', "{ line: 'Take on more hands at {house}, and keep them busy all season.', excludes: ['crisis: siege', 'crisis: famine'] },", "{ line: 'Take on more hands at {house}, and keep them busy all season.', excludes: ['crisis: siege'] },")],
 'supply-chain-word': [('src/data/people/goalFamilies.js', "'Waste nothing at {house} while the supply is short.',", "'Waste nothing in {house} for Grain & Bread while the supply is short.',")],
 'charter-refusal-off': [('src/generators/people/goals.js', "const chosen = picked?.refused ? admittedAfter(by, family, picked, families) : picked;", "const chosen = picked;")],
 'charter-crim-only': [('src/generators/people/goals.js', "const refuseCharter = ctx.crimHouseNames.has(houseKey) || (!!govPower && memberships.some((m) => str(m.power) === govPower && Number(m.rank) === 1));", "const refuseCharter = ctx.crimHouseNames.has(houseKey);")],
 'charter-gov-only': [('src/generators/people/goals.js', "const refuseCharter = ctx.crimHouseNames.has(houseKey) || (", "const refuseCharter = (")],
 'persons-some': [('src/generators/people/poolMap.js', ".concat(d.topic || []).every((t) => town.boundaries?.[t] === true)", ".concat(d.topic || []).some((t) => town.boundaries?.[t] === true)")],
 'persons-lanista-pres': [('src/data/people/titleSecretsPresentations.js', "    'Thick-necked and scarred, with the eye of someone who buys and sells people.': Object.freeze({ topic: PERSONS_HELD }),\n", "")],
 'persons-apprentice': [('src/data/people/titleSecretsPresentations.js', "    'Has kept an apprentice on for years past the indenture by holding back the papers that would free them': Object.freeze({ topic: PERSONS_HELD }),\n", "")],
 'under-military': [('src/generators/npcStructure.js', ", magic: Object.freeze(['magic']), military: Object.freeze(['military']) });", ", magic: Object.freeze(['magic']) });")],
 'body-off': [('src/generators/npcStructure.js', "    if (!isHolder && !inItsBody(cat, standing, powerFactions)) return { ...npc, structuralRank: standing.standing };\n", "")],
 'body-noble-off': [('src/generators/npcStructure.js', "government: Object.freeze(['government']), other: Object.freeze(['noble']), religious", "government: Object.freeze(['government']), religious")],
 'body-gov-off': [('src/generators/npcStructure.js', "const BODY_KINDS = Object.freeze({ government: Object.freeze(['government']), other:", "const BODY_KINDS = Object.freeze({ other:")],
 'merchant-rung-always-local': [('src/generators/power/claimStanding.js', "? LEADING_LOCAL_MERCHANTS : LOCAL_MERCHANTS;", "? LOCAL_MERCHANTS : LOCAL_MERCHANTS;")],
 'noble-minor-unconditional': [('src/generators/power/claimStanding.js', "  ? (merchantsBeside(ctx).some((m) => Number(m.power || 0) > Number(ctx.self.power || 0))\n", "  ? (true\n")],
 'noble-minor-competitive': [('src/generators/power/claimStanding.js', "  : (merchantsBeside(ctx).length\n", "  : (true\n")],
 'crim-council-unconditional': [('src/generators/power/claimStanding.js', "minor: (/** @type {string} */ tier, /** @type {RungContext} */ ctx) => COUNCIL_SEAT.test(ctx.governing)", "minor: (/** @type {string} */ tier, /** @type {RungContext} */ ctx) => true")],
 'major-church-off': [('src/generators/power/claimStanding.js', "  { claim: /^Major church institutions hold structural influence\\. Land grants, [^.]*\\./, minor: () => CLERGY_AT_MARGINS, suppressed: () => CLERGY_AT_MARGINS },\n", "")],
 'ruling-class-off': [('src/generators/power/claimStanding.js', "  { claim: 'The ruling class and the merchant class are the same people; commercial decisions are political decisions and civic access is purchased.',\n    minor: merchantRung, suppressed: merchantRung },\n", "")],
 'army-watch-always': [('src/generators/power/claimStanding.js', "const watchStands = (ctx) => ctx.names.some(", "const watchStands = (ctx) => true || ctx.names.some(")],
 'army-off': [('src/generators/power/claimStanding.js', "minor: (_tier, ctx) => watchStands(ctx) ? 'Well-funded", "minor: (_tier, ctx) => null && watchStands(ctx) ? 'Well-funded")],
 'great-families-off': [('src/generators/power/claimStanding.js', "  ...['Hereditary great families with land grants, court appointments, and dynastic marriage networks; structurally embedded in governance even when not formally in power.',\n", "  ...[\n")],
 'militarised-off': [('src/generators/power/claimStanding.js', "    \"Militarised noble families whose landholdings double as fortified estates; they provide the settlement's heavy cavalry and expect political weight in return.\",\n  ].map((claim) => ({ claim, minor: () => LESSER_LANDED", "  ].map((claim) => ({ claim, minor: () => LESSER_LANDED")],
 'rung-roster-blind': [('src/generators/power/rulingStructure.js', "settleClaimsToLabel(factions, tier, lowerInstNames);", "settleClaimsToLabel(factions, tier);")],
 'sovereign-garrison': [('src/generators/power/governingStressVignettes.js', "(sovereign ? 'Those under arms have doubled, and the city treasury pays their keep, so", "(sovereign ? 'The garrison has doubled and the city treasury pays its bills, so")],
 'host-contests-only': [('src/generators/power/rosterText.js', "const host = before.get(name) ? null : hostByStanding(String(f?.desc || ''), before);", "const host = !before.get(name) && f?.contestsNiche ? String(f.contestsNiche) : null;")],
 'host-off': [('src/generators/power/rosterText.js', "const host = before.get(name) ? null : hostByStanding(String(f?.desc || ''), before);", "const host = null;")],
}
def run(name):
  edits = PLANTS[name]; done = []
  for f, old, new in edits:
    p = os.path.join(P, f); s = open(p).read()
    if s.count(old) != 1: print(name, 'ANCHOR', s.count(old), f); [subprocess.run(['git', '-C', P, 'checkout', '--', x]) for x in done]; return {'plant': name, 'error': 'anchor'}
    open(p, 'w').write(s.replace(old, new)); done.append(f)
  log = os.path.join(OUT, f'{name}.json')
  r = subprocess.run(['npx', 'vitest', 'run', '--reporter=json', f'--outputFile={log}', *GUARDS], cwd=P, capture_output=True, text=True)
  for f in done: subprocess.run(['git', '-C', P, 'checkout', '--', f])
  try: j = json.load(open(log))
  except Exception as e: return {'plant': name, 'error': 'no json ' + r.stdout[-500:] + r.stderr[-500:]}
  red = {}
  for t in j['testResults']:
    n = sum(1 for a in t['assertionResults'] if a['status'] == 'failed')
    if n or t['status'] == 'failed': red[os.path.relpath(t['name'], P)] = n
  return {'plant': name, 'exit': r.returncode, 'red': red, 'tests': j.get('numTotalTests'), 'failed': j.get('numFailedTests')}
names = sys.argv[1:] or list(PLANTS)
res = [run(n) for n in names]
for x in res: print(json.dumps(x))
with open(os.path.join(OUT, 'plants.summary.txt'), 'a') as fh:
  for x in res: fh.write(json.dumps(x) + '\n')
