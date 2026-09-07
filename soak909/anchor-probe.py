import subprocess, shutil, sys, os
SC = os.environ['SC']
F = os.path.join(SC, 'laneB6/tests/soak-harness/tripwireRegistry.test.js')
PRISTINE = os.path.join(SC, 'tripwireRegistry.AFTER-car4.js')
probes = [
 ("471 yearlyPopulations / finalPopulations",
  "'yearlyPopulations',\n      'finalPopulations'", "'yearlyPopulations',\n      'finalPopulationsBROKEN'"),
 ("472 yearlyDiedFlags / finalDiedFlags",
  "'yearlyDiedFlags',\n      'finalDiedFlags'", "'yearlyDiedFlags',\n      'finalDiedFlagsBROKEN'"),
 ("518 realmDemography / realmSelfSufficiency (both-blinded)",
  "'realmDemography',\n      'realmSelfSufficiency', 'the blinded observer still ships its spread sibling'",
  "'realmDemography',\n      'realmSelfSufficiencyBROKEN', 'the blinded observer still ships its spread sibling'"),
 ("519 motion / motionRenamedForControl",
  "'motion',\n      'motionRenamedForControl', 'the motion rename really matched'",
  "'motion',\n      'motionRenamedForControlBROKEN', 'the motion rename really matched'"),
 ("590 realmDemography / realmSelfSufficiency (pre-P4)",
  "'realmDemography',\n      'realmSelfSufficiency', 'the pre-P4 observer still ships its other spread key'",
  "'realmDemography',\n      'realmSelfSufficiencyBROKEN', 'the pre-P4 observer still ships its other spread key'"),
 ("723 OBSERVER 0.0025 / MOTION_FLOOR_01",
  "codeOnly(OBSERVER_SOURCE), '0.0025', 'MOTION_FLOOR_01'",
  "codeOnly(OBSERVER_SOURCE), '0.0025', 'MOTION_FLOOR_01_BROKEN'"),
 ("724 ENVELOPE 0.0025 / MOTION_FLOOR_01",
  "codeOnly(ENVELOPE_SUITE_SOURCE), '0.0025', 'MOTION_FLOOR_01'",
  "codeOnly(ENVELOPE_SUITE_SOURCE), '0.0025', 'MOTION_FLOOR_01_BROKEN'"),
]
src = open(PRISTINE).read()
ok = True
for name, old, new in probes:
    n = src.count(old)
    if n != 1:
        print(f"PROBE SETUP FAILED [{name}]: pattern occurs {n} times"); ok = False; continue
    open(F, 'w').write(src.replace(old, new, 1))
    r = subprocess.run(['sh','scripts/gate-mutex.sh','--run','--','npx','vitest','run',
                        'tests/soak-harness/tripwireRegistry.test.js','--maxWorkers=2'],
                       cwd=os.path.join(SC,'laneB6'), capture_output=True, text=True,
                       env={**os.environ, 'GATE_MUTEX_TIER':'shared'})
    out = r.stdout + r.stderr
    liveness = 'LIVENESS ANCHOR' in out
    print(f"{name}: exit={r.returncode} LIVENESS_ANCHOR_message={liveness}")
    if r.returncode == 0 or not liveness: ok = False
    shutil.copyfile(PRISTINE, F)
shutil.copyfile(PRISTINE, F)
print("ALL SEVEN ANCHORS PROVED BREAKABLE" if ok else "!! AT LEAST ONE ANCHOR DID NOT FAIL WHEN BROKEN")
