#!/usr/bin/env python3
"""chair-verify-891.py <dock> <base-sha> <gate-log> [expected-cars]

The chair's OWN reads before a CAS (runs in Python per the §882.15 law — no zsh word-splitting).
Every check prints PASS/FAIL with the figure; exit 1 on any FAIL. Mutates nothing.
"""
import json, re, subprocess, sys

dock, base, log = sys.argv[1], sys.argv[2], sys.argv[3]
expected_cars = int(sys.argv[4]) if len(sys.argv) > 4 else None
REPO = '/Users/cstokes/Desktop/settlement-engine'
fails = []

def git(*a, cwd=dock):
    return subprocess.run(['git', *a], cwd=cwd, capture_output=True, text=True).stdout.strip()

def check(name, ok, detail):
    print(('PASS ' if ok else 'FAIL ') + name + ' — ' + str(detail))
    if not ok:
        fails.append(name)

tip = git('rev-parse', 'HEAD')
text = open(log, encoding='utf-8', errors='replace').read()
def field(k):
    m = re.search(r'^' + re.escape(k) + r'=(.*)$', text, re.M)
    return m.group(1).strip() if m else None

# 1. the gate, from its own log
check('gate TRUE_EXIT=0', field('TRUE_EXIT') == '0', field('TRUE_EXIT'))
check('gate HEAD == dock HEAD', field('GATE_HEAD') == tip == field('GATE_HEAD_POST'), (field('GATE_HEAD'), tip, field('GATE_HEAD_POST')))
check('gate porcelain empty pre/post', field('GATE_PORCELAIN_PRE') == '[0]' and field('GATE_PORCELAIN_POST') == '[0]', (field('GATE_PORCELAIN_PRE'), field('GATE_PORCELAIN_POST')))
ratchet = re.search(r'\[test-ratchet\] OK — no test regressions \((\d+) known failure\(s\) of (\d+) tests, ceiling (\d+)\)', text)
check('ratchet OK line, 10 known, ceiling 10', bool(ratchet) and ratchet.group(1) == '10' and ratchet.group(3) == '10', ratchet.group(0) if ratchet else 'ABSENT')
strict = re.search(r'STRICT DIST OK — (\d+) discovered/reported file\(s\), (\d+) test\(s\)', text)
check('STRICT DIST OK line', bool(strict), strict.group(0) if strict else 'ABSENT')
stages = len(re.findall(r'^> settlementforge@1\.0\.0 [a-z:-]+$', text, re.M))
check('gate stages counted', stages >= 15, stages)

# 2. the dock
porc = git('status', '--porcelain', '-uall')
check('dock porcelain 0 now', porc == '', repr(porc[:200]))
anc = subprocess.run(['git', 'merge-base', '--is-ancestor', base, tip], cwd=dock).returncode == 0
check('base is an ancestor of the tip', anc, (base, tip))
cars = git('rev-list', '--count', f'{base}..{tip}')
check('car count', expected_cars is None or int(cars) == expected_cars, cars)
shas = git('rev-list', '--reverse', f'{base}..{tip}').split()
parents_ok = all(len(git('rev-list', '--parents', '-n', '1', s).split()) == 2 for s in shas)
check('every car single-parent', parents_ok, len(shas))
seat_re = re.compile(r'^Seat: (Fable 5 — validated|Fable 5\.1 — validated|Opus 5 — Fable-unvalidated)$', re.M)
trailers = [len(seat_re.findall(git('log', '-1', '--format=%B', s))) for s in shas]
check('exactly one strict Seat trailer per car', all(t == 1 for t in trailers), trailers)
branch = git('rev-parse', 'refs/heads/claude/composite-r4', cwd=REPO)
check('claude/composite-r4 is at the base', branch == git('rev-parse', base, cwd=REPO), branch[:9])
numstat = git('diff', '--numstat', f'{base}..{tip}').splitlines()
add = sum(int(l.split('\t')[0]) for l in numstat if l.split('\t')[0].isdigit())
rem = sum(int(l.split('\t')[1]) for l in numstat if l.split('\t')[1].isdigit())
print(f'INFO paths {len(numstat)} +{add}/−{rem}')

# 3. the registers cite a sha inside the consist (or the base) and the tuple probe agrees
consist = set(shas) | {git('rev-parse', base, cwd=REPO)}
def reg(path, key):
    try:
        j = json.load(open(f'{dock}/{path}'))
    except Exception as e:
        return f'unreadable: {e}'
    return j.get(key)
for path, key in [('tests/lint/.lighting-census-baseline.json', 'measuredAtSha'),
                  ('scripts/.test-ratchet-baseline.json', 'measuredAtSha'),
                  ('scripts/.writer-reach-baseline.json', 'frozenAtSha'),
                  ('tests/lint/.tuning-inventory.json', 'measuredAtSha')]:
    v = reg(path, key)
    check(f'{path} {key} inside the consist', isinstance(v, str) and v in consist, v[:9] if isinstance(v, str) else v)
try:
    probe = subprocess.run(['node', f'{sys.path[0]}/chair-tools/lighting-tuple-probe.mjs', dock], cwd=dock, capture_output=True, text=True).stdout
    tuple_line = next((l for l in probe.splitlines() if l.startswith('tuple')), None)
    j = json.load(open(f'{dock}/tests/lint/.lighting-census-baseline.json'))
    regt = '/'.join(str(j[k]) for k in ['files', 'parked', 'credited', 'titles', 'suiteTitles'])
    check('lighting tuple probe == register', tuple_line is not None and tuple_line.split()[1] == regt, (tuple_line, regt))
except Exception as e:
    check('lighting tuple probe ran', False, e)
rj = json.load(open(f'{dock}/scripts/.test-ratchet-baseline.json'))
print(f"INFO ratchet register totalTests={rj.get('totalTests')} totalFiles={rj.get('totalFiles')} entries={len(rj.get('entries', []))}")
if ratchet:
    check('ratchet register totalTests == gate line', str(rj.get('totalTests')) == ratchet.group(2), (rj.get('totalTests'), ratchet.group(2)))

print('CHAIR-VERIFY ' + ('GREEN' if not fails else 'RED: ' + ', '.join(fails)))
sys.exit(1 if fails else 0)
