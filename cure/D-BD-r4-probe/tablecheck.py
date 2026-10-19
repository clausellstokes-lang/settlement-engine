# tablecheck.py — every markdown table row has its header's cell count (unescaped pipes, code spans respected)
import re, sys
p = sys.argv[1]
lines = open(p, encoding='utf-8').read().split('\n')

def cells(line):
    # count cells: split on | not escaped and not inside backticks
    out, cur, in_code, i = [], '', False, 0
    while i < len(line):
        c = line[i]
        if c == '\\' and i + 1 < len(line) and line[i+1] == '|':
            cur += '\\|'; i += 2; continue
        if c == '`':
            in_code = not in_code
        if c == '|' and not in_code:
            out.append(cur); cur = ''
        else:
            cur += c
        i += 1
    out.append(cur)
    return len(out)

tables, bad, cur = 0, [], None
for n, line in enumerate(lines, 1):
    if line.startswith('|'):
        if cur is None:
            cur = cells(line); tables += 1; hdr = n
        else:
            k = cells(line)
            if k != cur:
                bad.append((n, k, cur, hdr))
    else:
        cur = None
print(f'tables={tables} mismatches={len(bad)}')
for b in bad[:40]:
    print(f'line {b[0]}: {b[1]} cells vs header {b[2]} (table at {b[3]})')
