#!/usr/bin/env python3
"""Validate every commit-like hex token (8 or 9 chars) in the given files against git; exit 1 on any that does not resolve exactly.
usage: checkrec.py <file>... ; tokens listed in QUOTED are hashes quoted from older documents and are allowed unresolved."""
import re, sys, io, subprocess
QUOTED = {'4534ea5e3', 'a59796dda', '632dd125f', 'a19a0ee1c'}  # the last two: the chair's own wrong abbreviations, quoted in their corrections
bad = 0
for p in sys.argv[1:]:
    s = io.open(p, encoding='utf-8').read()
    for t in sorted(set(re.findall(r'(?<![0-9a-zA-Z_])[0-9a-f]{8,9}(?![0-9a-zA-Z_])', s))):
        if not re.search(r'[a-f]', t) or not re.search(r'[0-9]', t):
            continue
        r = subprocess.run(['git', '-C', '/home/user/settlement-engine', 'rev-parse', '--verify', '--quiet', t + '^{commit}'], capture_output=True, text=True)
        if r.returncode != 0 and t not in QUOTED:
            print('UNRESOLVED', p, t); bad += 1
print('checkrec:', 'OK' if not bad else '%d bad' % bad)
sys.exit(1 if bad else 0)
