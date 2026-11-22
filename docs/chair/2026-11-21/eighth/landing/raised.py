#!/usr/bin/env python3
"""raised.py: WHAT ROSE BETWEEN TWO COMMITS IN THE REGISTERS (the eighth chair, 2026-11-22).

WHY. A merge can RAISE a shrink-only row with no gate reading it: a lane that took its own side of a register at a
merge of the line, and whose door only tightens, keeps a looser row than the line's; at the landing the two no longer
conflict there, so the row lands green. This tool makes every such rise VISIBLE. It judges nothing: a census rises
when content is added and that is its law; a ratchet, a ceiling or a budget may not. THE READER DECIDES, row by row.

USE (from any checkout that holds both commits; it reads git objects only and writes nothing):
    python3 -I raised.py <before> <after>            # e.g. the line before a stack, and the stack's top
    python3 -I raised.py <line tip> <lane tip>       # a lane against the line it merged

IT REPORTS, for every tracked JSON register that differs (dot-files named *baseline*.json, *register*.json,
.tuning-*.json, *census*.json, the mutation manifest, the sameness walker's lists), each numeric leaf that ROSE and
each array that GREW, with counts of what fell, appeared and left; and every numeric constant named *CEILING*,
*BUDGET*, *BASELINE* or *FLOOR* in a file under tests/ or scripts/ whose value changed.
"""
import json
import re
import subprocess
import sys

REGISTER = re.compile(
    r'(?:^|/)(?:\.[^/]*baseline[^/]*\.json|[^/]*register[^/]*\.json|\.tuning-[^/]*\.json|[^/]*census[^/]*\.json'
    r'|mutation-coverage-manifest\.json|samenessHideable\.[A-Za-z]+\.json|[^/]*-baseline\.json)$')
CONST = re.compile(r'^\s*(?:export\s+)?const\s+([A-Z][A-Z0-9_]*(?:CEILING|BUDGET|BASELINE|FLOOR)[A-Z0-9_]*)\s*=\s*(-?\d[\d_]*(?:\.\d+)?)\b', re.M)


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True, check=False).stdout


def blob(commit, path):
    out = subprocess.run(['git', 'show', f'{commit}:{path}'], capture_output=True, text=True, check=False)
    return out.stdout if out.returncode == 0 else None


def leaves(node, path, out):
    if isinstance(node, bool) or node is None:
        return
    if isinstance(node, (int, float)):
        out[path] = node
    elif isinstance(node, dict):
        for k, v in node.items():
            leaves(v, f'{path}/{k}', out)
    elif isinstance(node, list):
        out[f'{path}[#]'] = len(node)
        if all(isinstance(x, dict) for x in node):
            return  # rows of objects: their count is the leaf; a row's own figures are read by its door
        for i, v in enumerate(node):
            leaves(v, f'{path}[{i}]', out)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    before, after = sys.argv[1], sys.argv[2]
    changed = [p for p in git('diff', '--name-only', before, after).splitlines() if p]
    shown = 0
    for path in sorted(p for p in changed if REGISTER.search(p)):
        a, b = blob(before, path), blob(after, path)
        if a is None or b is None:
            print(f'{path}: {"APPEARED" if a is None else "LEFT"}')
            shown += 1
            continue
        try:
            la, lb = {}, {}
            leaves(json.loads(a), '', la)
            leaves(json.loads(b), '', lb)
        except ValueError as err:
            print(f'{path}: NOT JSON ({err})')
            shown += 1
            continue
        rose = sorted((k, la[k], lb[k]) for k in la.keys() & lb.keys() if lb[k] > la[k])
        fell = sum(1 for k in la.keys() & lb.keys() if lb[k] < la[k])
        added, left = sorted(lb.keys() - la.keys()), sorted(la.keys() - lb.keys())
        print(f'{path}: ROSE {len(rose)} · fell {fell} · appeared {len(added)} · left {len(left)}')
        for k, x, y in rose[:40]:
            print(f'    ROSE  {k}  {x} -> {y}')
        if len(rose) > 40:
            print(f'    ... and {len(rose) - 40} more rises')
        for k in added[:12]:
            print(f'    appeared  {k} = {lb[k]}')
        if len(added) > 12:
            print(f'    ... and {len(added) - 12} more appeared')
        shown += 1
    for path in sorted(p for p in changed if re.match(r'^(?:tests|scripts)/.*\.(?:m?js|jsx)$', p)):
        a, b = blob(before, path) or '', blob(after, path) or ''
        ca, cb = dict(CONST.findall(a)), dict(CONST.findall(b))
        for name in sorted(ca.keys() | cb.keys()):
            x, y = ca.get(name), cb.get(name)
            if x != y:
                word = 'ROSE' if x is not None and y is not None and float(y.replace('_', '')) > float(x.replace('_', '')) else 'moved'
                print(f'{path}: {word}  {name}  {x} -> {y}')
                shown += 1
    if not shown:
        print('no register and no named ceiling differs between the two commits')


if __name__ == '__main__':
    main()
