# X-PA probe: the executed realms' founding ages against their genesis ties (reads R-PA2's birth.mjs outputs; no code of record touched)
import json, sys
base = sys.argv[1]
for f in ['out-small.json', 'out-medium.json', 'out-large.json']:
    d = json.load(open(f'{base}/{f}'))
    ms = d['members']
    ages = sorted([(m['founding']['age'], m['slot'], m['tier']) for m in ms], reverse=True)
    o1, o2 = ages[0][1], ages[1][1]
    tie = [r for r in d['planRelations'] if {r['a'], r['b']} == {o1, o2}]
    print(f'== {f} ages desc (age, slot, tier): {ages}')
    print(f'   oldest slot {o1} ({ages[0][0]}y) · second-oldest slot {o2} ({ages[1][0]}y) · genesis tie between them: {tie or "NONE"}')
    for r in d['planRelations']:
        A = next(m for m in ms if m['slot'] == r['a']); B = next(m for m in ms if m['slot'] == r['b'])
        print(f"   {r['type']:14s} {r['cause']:18s} {A['tier']} {A['founding']['age']}y -> {B['tier']} {B['founding']['age']}y")
