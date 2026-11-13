# REVIEW-W2-FIX-DATA-2: one plant of the reviewer's own per guard the third seat added. Each plant is applied in a
# scratch worktree at the tip (TREE), the guard's file is run alone through scripts/gate-tail.sh, and the tree is
# restored (git checkout) before the next. A plant is NOT the seat's own red-first: it breaks the cure another way.
#   python3 plant.py <TREE> <OUTDIR>
import subprocess, sys, os, re
T, O = sys.argv[1], sys.argv[2]; os.makedirs(O, exist_ok=True)
PLANTS = [
 ('P1-crisis-panel-arm', 'tests/generators/w2FixData3CrisisDescs.test.js', 'src/generators/steps/assembleInstitutions.js',
  "...(config.selectedStressesRandom === false ? (config.selectedStresses || []) : []),", "", 'the forced set loses the panel arm (selectedStresses with Random off) -- a NO-OP: resolveStress already folds the panel into intendedStressTypes'),
 ('P1b-crisis-raw-forced', 'tests/generators/w2FixData3CrisisDescs.test.js', 'src/generators/steps/assembleInstitutions.js',
  "    ...(effectiveConfig.intendedStressTypes || []),\n    ...(config.selectedStressesRandom === false ? (config.selectedStresses || []) : []),", "    ...(config.stressTypes || []),", 'the forced set read from the raw caller config only (the review-base shape of the bug)'),
 ('P2-dedup-offbyone', 'tests/generators/w2FixData3TensionDedup.test.js', 'src/generators/historyGenerator.js',
  "    pool.splice(pool.indexOf(candidate), 1);\n    if (candidate.type === 'crime_wave'", "    pool.splice(pool.indexOf(candidate) + 1, 1);\n    if (candidate.type === 'crime_wave'", 'the splice removes the neighbour, not the drawn candidate'),
 ('P3-hooknote-mirror', 'tests/generators/w2FixData3TimelineHookNote.test.js', 'src/generators/historyGenerator.js',
  "if (at >= 0) ledger[k] = { ...entry, lineId: at };", "if (at >= 0) ledger[k] = { ...entry, lineId: rows.length - 1 - at };", 'the note keyed by the mirrored row index'),
 ('P4-grove-second-clause', 'tests/data/w2FixData3Grove.test.js', 'src/data/institutionDescVariants.js',
  "hold the line between the town's spread and the wild", "hold the line between the city's spread and the wild", 'one clause of the town-voice variant speaks the city again'),
 ('P5-inland-key-miss', 'tests/data/w2FixData3Inland.test.js', 'src/generators/steps/assembleInstitutions.js',
  "const inland = dry.length ? null : INLAND_DESCRIPTIONS[`${tier}|${inst.category}|${inst.name}`];", "const inland = dry.length ? null : INLAND_DESCRIPTIONS[`${tier}|${inst.category}|${inst.name} `];", 'the draw misses the inland text (key typo): the ship text prints'),
 ('P6-mine-twin-city', 'tests/data/w2FixData3Mine.test.js', 'src/data/institutionServices.js',
  "Object.freeze({ text: \"Ore cut underground by the crews and brought out by cart for sorting.\", twinOf: \"Surface-level ore extraction. Lower yield than shaft mining but cheaper to operate.\", needs: Object.freeze(['tier: ≥ town']) }),",
  "Object.freeze({ text: \"Ore cut underground by the crews and brought out by cart for sorting.\", twinOf: \"Surface-level ore extraction. Lower yield than shaft mining but cheaper to operate.\", needs: Object.freeze(['tier: ≥ city']) }),", 'the twin narrowed to city: a town has no admitted line'),
 ('P7a-forge-racks-undeclared', 'tests/data/w2FixData3Round.test.js', 'src/data/arrivalProse.js',
  "{ text: () => 'Racks of new ironwork stand outside the workshops, waiting for the carts.', needs: ['tier: ≥ town'], excludes", "{ text: () => 'Racks of new ironwork stand outside the workshops, waiting for the carts.', excludes", 'one of the four forge lines loses its size'),
 ('P7b-precinct-twin-hamlet', 'tests/data/w2FixData3Round.test.js', 'src/data/cultureProfiles.js',
  "twinOf: 'a raised ceremonial precinct overlooks a broad and busy open plaza', needs: Object.freeze(['tier: ≤ village'])", "twinOf: 'a raised ceremonial precinct overlooks a broad and busy open plaza', needs: Object.freeze(['tier: ≤ hamlet'])", 'the small-place twin refused in a village'),
]
ONLY=set(os.environ.get('ONLY','').split(',')) - {''}
rows = []
for pid, test, f, old, new, what in PLANTS:
    if ONLY and pid not in ONLY: continue
    p = os.path.join(T, f); s = open(p, encoding='utf8').read(); n = s.count(old)
    if n != 1: rows.append(f'{pid}\tNOT-APPLIED(count={n})\t{test}\t{what}'); continue
    open(p, 'w', encoding='utf8').write(s.replace(old, new))
    log = os.path.join(O, pid + '.log')
    r = subprocess.run(['sh', 'scripts/gate-tail.sh', '-n', '30', 'npx', 'vitest', 'run', test], cwd=T, capture_output=True, text=True, env={**os.environ, 'TMPDIR': O})
    open(log, 'w').write(r.stdout + r.stderr)
    fails = re.findall(r'^\s+× (.+?)(?: \d+ms)?$', r.stdout, re.M)
    rows.append(f'{pid}\t{"RED" if r.returncode else "GREEN"}(exit {r.returncode})\t{test}\t{what}\t' + ' | '.join(fails))
    subprocess.run(['git', 'checkout', '--', f], cwd=T)
st = subprocess.run(['git', 'status', '--short'], cwd=T, capture_output=True, text=True).stdout
open(os.path.join(O, 'plants.tsv'), 'w').write('\n'.join(rows) + '\n# tree after: ' + (st.strip() or 'clean') + '\n')
print('\n'.join(rows)); print('tree after:', st.strip() or 'clean')
