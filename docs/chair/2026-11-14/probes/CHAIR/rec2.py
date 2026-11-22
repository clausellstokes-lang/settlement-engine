# THE CHAIR'S RECORDER, second form (2026-11-14, session_01ACmDYZrFEVXyZEUg1NDxxC). Run from the checkout of lane/chair-2026-11-08:
#   CHAIR_TRAILER='<your trailer lines>' python3 docs/chair/2026-11-14/probes/CHAIR/rec2.py <record.json>
# It checks every hash in the record against git, appends the record to the decision-queue draft, appends one line to the chair's
# block of the handoff (found by its opening words, not by its line number: since the lane took the integration line by merge the
# block is no longer the file's first line), runs three walkers and commits (with any 'extra' paths). IT DOES NOT PUSH.
# The push is the chair's own plain command afterwards (`git push origin lane/chair-2026-11-08`): the lane now carries the lane rule
# of the push hook, so its three gates run; the hook is never skipped.
import io, os, re, sys, json, datetime, subprocess

BLOCK = '**⭐⭐⭐⭐⭐ 2026-11-07 22:3x UTC — PICKUP FOR AN ACCOUNT SWITCH'
QUOTED = {'4534ea5e3', 'a59796dda', '632dd125f', 'a19a0ee1c'}  # hashes quoted from older documents, or quoted inside their own corrections


def check_hashes(text, where):
    bad = []
    for t in sorted(set(re.findall(r'(?<![0-9a-zA-Z_])[0-9a-f]{8,9}(?![0-9a-zA-Z_])', text))):
        if not re.search(r'[a-f]', t) or not re.search(r'[0-9]', t):
            continue
        r = subprocess.run(['git', 'rev-parse', '--verify', '--quiet', t + '^{commit}'], capture_output=True, text=True)
        if r.returncode != 0 and t not in QUOTED:
            bad.append(t)
    assert not bad, '%s: hashes that do not resolve in git: %s' % (where, bad)


j = json.load(io.open(sys.argv[1], encoding='utf-8'))
check_hashes(json.dumps(j), sys.argv[1])
now = datetime.datetime.now(datetime.timezone.utc)
stamp = now.strftime('%H:') + now.strftime('%M')[0] + 'x'; hhmm = now.strftime('%H:%M'); day = now.strftime('%Y-%m-%d')
odq = 'docs/chair/2026-11-07/ODQ-934.105-DRAFT.md'; hand = 'docs/HANDOFF_CURRENT.md'
s = io.open(odq, encoding='utf-8').read(); assert s.count(j['key']) == 0
io.open(odq, 'w', encoding='utf-8').write(s.rstrip('\n') + '\n\n**%s (%s %s UTC) (the chair).** %s\n' % (j['key'], day, hhmm, j['entry']))
h = io.open(hand, encoding='utf-8').read(); g = '%s (%s %s)' % (j['guard'], day[5:], stamp); assert h.count(j['guard'] + ' (' + day[5:]) == 0
L = h.split('\n')
idx = [i for i, x in enumerate(L) if x.startswith(BLOCK)]
assert len(idx) == 1, 'the chair block was not found exactly once: %r' % idx
L[idx[0]] = L[idx[0]].rstrip() + ' ' + g + ': ' + j['sent']
io.open(hand, 'w', encoding='utf-8').write('\n'.join(L))
r = subprocess.run('sh scripts/gate-tail.sh npx vitest run tests/lint/sourceCitationIntegrity.walker.test.js tests/lint/ledgerCitationIntegrity.test.js tests/lint/testRatchet.test.js', shell=True, capture_output=True, text=True)
print('walkers exit', r.returncode); assert r.returncode == 0, r.stdout[-1500:]
msg = j['subject'] + '\n\n' + os.environ['CHAIR_TRAILER'] + '\n'
subprocess.run(['git', 'add', odq, hand] + j.get('extra', []), check=True)
subprocess.run(['git', 'commit', '-q', '-m', msg], check=True, capture_output=True)
print('committed', subprocess.run(['git', 'log', '-1', '--format=%h'], capture_output=True, text=True).stdout.strip(), '(not pushed: push plainly, the hook runs)')
