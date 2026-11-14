# REVIEW-POWERS-5 plants5.py — run in a detached tip worktree used for nothing else: python3 plants5.py <tree>
# Each plant re-opens one fault the stage cured, runs the stage's guard for it, and restores the file.
import subprocess, sys, pathlib
T = pathlib.Path(sys.argv[1])
P = [
 ('chip-crime-always', 'src/domain/display/governingModifierWords.js', "if (family === 'crime') return facts.crime !== 'none';", "if (family === 'crime') return true;", 'tests/components/powerTabSupport.test.jsx'),
 ('chip-arcane-always', 'src/domain/display/governingModifierWords.js', "if (family === 'arcane') return magicOf(settlement).functions === true && practisingInstitutions(settlement).length > 0;", "if (family === 'arcane') return true;", 'tests/components/powerTabSupport.test.jsx'),
 ('chip-raw-key', 'src/domain/display/governingModifierWords.js', "if (!entry) return '';", "if (!entry || true) return key;", 'tests/components/powerTabSupport.test.jsx'),
 ('levies-no-market', 'src/generators/power/governanceNarrative.js', "if ((hasCivicInstitution || hasUrbanCommerceInstitution) && hasLiveMarket) {", "if (hasCivicInstitution || hasUrbanCommerceInstitution) {", 'tests/generators/power/conflictLadderReadsRoster.test.js'),
 ('courts-no-court', 'src/generators/power/governanceNarrative.js', "if (hasMilitaryInstitution && hasCourt) {", "if (hasMilitaryInstitution) {", 'tests/generators/power/conflictLadderReadsRoster.test.js'),
 ('murdered-no-market', 'src/generators/power/governanceNarrative.js', "return hasMilitaryInstitution && hasLiveMarket", "return hasMilitaryInstitution || hasCivicInstitution", 'tests/generators/power/conflictLadderReadsRoster.test.js'),
 ('noble-no-market', 'src/generators/power/governanceNarrative.js', "institutionFlags.economyOutput > 55 && hasLiveMarket) {", "institutionFlags.economyOutput > 55) {", 'tests/generators/power/conflictLadderReadsRoster.test.js'),
 ('stab-underdefended', 'src/generators/power/governanceNarrative.js', "institutionFlags.militaryEffective < 30 &&\n    !defended", "institutionFlags.militaryEffective < 30", 'tests/generators/power/stabilityReadsReadiness.test.js'),
 ('stab-ordered', 'src/generators/power/governanceNarrative.js', "if (institutionFlags.militaryEffective > 68 && !exposed) {", "if (institutionFlags.militaryEffective > 68) {", 'tests/generators/power/stabilityReadsReadiness.test.js'),
 ('stab-reconcile', 'src/generators/power/economyReconciliation.js', "  powerStructure.stability = projected.stability;\n", "", 'tests/generators/power/stabilityReadsReadiness.test.js'),
 ('hall-syndicate', 'src/domain/people/patronage.js', "const syndicate = rung === 'none' && factsOf(s).crime === 'organized';", "const syndicate = false;", 'tests/domain/people/hallLineReadsCrime.test.js'),
 ('inn-excludes', 'src/generators/people/poolMap.js', "excludes: d.excludes || []", "excludes: []", 'tests/generators/people/coachingInnUnderCrisis.test.js'),
 ('inn-siege-only-welcoming', 'src/data/people/titleSecretsPresentations.js', "Object.freeze({ excludes: Object.freeze(['crisis: under_siege']) }),", "Object.freeze({}),", 'tests/generators/people/coachingInnUnderCrisis.test.js'),
]
for name, f, old, new, test in P:
    p = T / f; src = p.read_text()
    if src.count(old) != 1: print(f'{name}: ANCHOR MISSING ({src.count(old)})'); continue
    p.write_text(src.replace(old, new))
    try:
        r = subprocess.run(['npx', 'vitest', 'run', test], cwd=T, capture_output=True, text=True, timeout=900)
        out = r.stdout + r.stderr
        tl = [l.strip() for l in out.splitlines() if l.strip().startswith('Tests ')]
        print(f'{name}: exit {r.returncode} | {tl[-1] if tl else "?"}')
    finally:
        p.write_text(src)
r = subprocess.run(['git', 'status', '--short'], cwd=T, capture_output=True, text=True); print('restored, status:', repr(r.stdout))
