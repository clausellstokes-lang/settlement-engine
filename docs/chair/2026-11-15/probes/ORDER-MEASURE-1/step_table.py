# ORDER-MEASURE-1 · item 1 as markdown: python3 step_table.py <order.json> > steps.md
import json, sys
O = json.load(open(sys.argv[1])); T = O['towns']
print('| # | step (in run order; A0–A14 are the assembly\'s own sub-steps, in `assembleSettlement.js` order) | WRITES facts (family: towns where it changes there) | WRITES prose (final strings born there: count; top record paths) | READS (fact families) |')
print('|---|---|---|---|---|')
for i, s in enumerate(O['steps'], 1):
    if s == 'FINAL': continue
    w = ', '.join(f'{k} {v}' for k, v in sorted(O['writes'][s].items(), key=lambda x: -x[1])) or '—'
    b = O['born'][s]; n = sum(b.values())
    top = '; '.join(f'`{k}` {v}' for k, v in list(b.items())[:4]) if n else ''
    r = ', '.join(O['reads'][s]) or '—'
    if s.startswith('A') and '-' in s: r = 'the settlement as it stands (all but conditions)'
    print(f'| {i} | {s} | {w} | {n}{"; " + top if top else ""} | {r} |')
