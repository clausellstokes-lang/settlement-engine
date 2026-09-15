#!/usr/bin/env python3
"""Declared-scope classifier: base vs tip golden-corpus dumps. Every differing line must be one of LT41b's declared moves."""
import json,sys,re,difflib
base=json.load(open(sys.argv[1])); tip=json.load(open(sys.argv[2]))
assert set(base)==set(tip), 'key sets differ'
# RULING 1 — the eleven crossSettlementConflicts sentences (base carries ' — ' inside these fragments)
R1_OLD=[r"locked in a .* — ", r"reached an impasse over a .* — ", r"over a .* — the client settlement", r"deliberately undercutting a .* — ", r"orchestrating a .* — ", r"opposite sides of an active .* — ", r"pressing .* over a .* — ", r"quietly at odds over a .* — ", r"soured the arrangement between .* — ", r"parallel intelligence operations — ", r"share routes and fences — "]
R1_NEW=[r"locked in a .*\. Both claim the right", r"reached an impasse over a .*\. The alliance holds", r"over a .*, and the client settlement needs better terms", r"deliberately undercutting a .*\. The charge is probably true", r"orchestrating a .*\. There is no proof", r"opposite sides of an active .*\. Formal violence", r"pressing .* over a .*\. The oath holds", r"quietly at odds over a .*, and neither can bring", r"soured the arrangement between .*\. The network still runs", r"parallel intelligence operations, and each knows", r"share routes and fences\. The partnership is profitable"]
# RULING 3 — the nine labels + the annotation
BANDS=r"(Unstable|Critical|Fractured|Shaken|Desperate|Anxious|Volatile|Strained|Tense)"
R3_OLD=[BANDS+r" — ", r"Critical \(active siege — survival priority\)", r"; monster threat active"]
R3_NEW=[BANDS+r" \([^)]*\)"]
def cls(line, pats):
    return any(re.search(p,line) for p in pats)
changed=0; undeclared=[]; declared={'R1':0,'R3':0}; unchanged=0
for k in sorted(base):
    if base[k]['sha']==tip[k]['sha']: unchanged+=1; continue
    changed+=1
    bl=base[k]['json'].split('\n'); tl=tip[k]['json'].split('\n')
    for d in difflib.unified_diff(bl,tl,n=0,lineterm=''):
        if d.startswith('---') or d.startswith('+++') or d.startswith('@@'): continue
        if d.startswith('-'):
            if cls(d,R1_OLD): declared['R1']+=1
            elif cls(d,R3_OLD): declared['R3']+=1
            else: undeclared.append((k,d[:200]))
        elif d.startswith('+'):
            if cls(d,R1_NEW): declared['R1']+=1
            elif cls(d,R3_NEW): declared['R3']+=1
            else: undeclared.append((k,d[:200]))
print(f"configs: {len(base)} · unchanged: {unchanged} · changed: {changed}")
print(f"declared lines: RULING 1 {declared['R1']} · RULING 3 {declared['R3']}")
print(f"UNDECLARED lines: {len(undeclared)}")
for k,d in undeclared[:40]: print('  ',k,d)
sys.exit(1 if undeclared else 0)
