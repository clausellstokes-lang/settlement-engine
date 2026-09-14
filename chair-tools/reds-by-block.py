# -*- coding: utf-8 -*-
"""reds-by-block.py <vitest log> [--md] — every failed arm with ITS OWN assertion text, parsed by FAIL-block boundaries
(`FAIL  <file> > <suite> > <arm>` up to the next `FAIL`/`⎯⎯` rule), never by a fixed grep window (the window mis-paired two
files and invented a red on 2026-09-05). Prints: file | arm | first Error/AssertionError line (cut) | expected/received if present."""
import io,re,sys
p=sys.argv[1]; md='--md' in sys.argv
s=io.open(p,encoding='utf-8',errors='replace').read()
blocks=re.split(r'\n(?= FAIL  )',s)
rows=[]
for b in blocks:
    m=re.match(r' FAIL  (\S+)(?: > (.*))?\n',b)
    if not m: continue
    f=m.group(1); path=(m.group(2) or '').strip(); arm=path.split(' > ')[-1] if path else ''
    body=b.split('\n',1)[1] if '\n' in b else ''
    body=re.split(r'\n⎯⎯',body)[0]
    err=next((l.strip() for l in body.split('\n') if re.match(r'\s*(AssertionError|TypeError|Error|SyntaxError|RangeError)',l)),'')
    exp=next((l.strip() for l in body.split('\n') if l.strip().startswith('- Expected') or l.strip().startswith('Expected:')),'')
    rec=next((l.strip() for l in body.split('\n') if l.strip().startswith('+ Received') or l.strip().startswith('Received:')),'')
    rows.append((f,arm,err[:220],exp[:120],rec[:120]))
seen=set(); out=[]
for r in rows:
    k=(r[0],r[1]); 
    if k in seen: continue
    seen.add(k); out.append(r)
if md:
    print('| file | arm | assertion |'); print('|---|---|---|')
    for f,a,e,x,r in out: print(f'| `{f}` | {a} | {e} {("· "+x) if x else ""} {("· "+r) if r else ""} |')
else:
    for f,a,e,x,r in out: print(f'{f}\n    arm: {a}\n    err: {e}'+(f'\n    {x}' if x else '')+(f'\n    {r}' if r else ''))
print(f'\n{len(out)} failed arm(s) in {len(set(r[0] for r in out))} file(s)', file=sys.stderr)
