# REVIEW-POWERS-3 redclass.py <tip.json> <tip tree> <base.json> <base tree> <prev reader's redtitles-tip.txt> — the red titles
# at each tree (vitest JSON reports of the same file list), red at tip only / at both / at base only, and against the earlier
# reader's red list at 714381934
import json, os, sys
def reds(f, root):
    j = json.load(open(f)); R = set()
    for t in j['testResults']:
        n = os.path.relpath(t['name'], root); fails = [a['fullName'] for a in t['assertionResults'] if a['status'] == 'failed']
        for x in fails: R.add(f'{n} :: {x}')
        if t['status'] != 'passed' and not fails: R.add(f'{n} :: [file-level]')
    return R, j['numPassedTests'], j['numFailedTests'], j['numPendingTests']
t, tp, tf, ts = reds(sys.argv[1], sys.argv[2]); b, bp, bf, bs = reds(sys.argv[3], sys.argv[4])
prev = set(l.strip() for l in open(sys.argv[5]) if l.strip())
def inprev(x): return any(x[:150] == p[:150] for p in prev)
print(f'tip: {len(t)} red titles ({tp} passed, {tf} failed, {ts} skipped); base: {len(b)} red ({bp} passed, {bf} failed, {bs} skipped)')
print('== red at the tip only, not in the earlier reader\'s list at 714381934:')
for x in sorted(t - b):
    if not inprev(x): print('  ', x[:230])
print('== red at the tip only, in that list:', sum(1 for x in t - b if inprev(x)))
print('== red at both:', len(t & b)); [print('  ', x[:200]) for x in sorted(t & b)]
print('== red at the base only (cured by the stage):'); [print('  ', x[:200]) for x in sorted(b - t)]
