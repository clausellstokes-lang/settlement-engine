import sys, re
lines = open(sys.argv[1], encoding='utf-8').read().split('\n')
def cells(l):
    out = 0; tick = False; prev = ''
    for ch in l:
        if ch == '`': tick = not tick
        elif ch == '|' and not tick and prev != '\\': out += 1
        prev = ch
    return out
bad = 0; i = 0
while i < len(lines):
    if lines[i].startswith('|'):
        start = i; want = cells(lines[i]); j = i
        while j < len(lines) and lines[j].startswith('|'):
            c = cells(lines[j])
            if c != want:
                bad += 1; print(f'line {j+1}: {c} pipes, header {want}: {lines[j][:90]}')
            j += 1
        i = j
    else:
        i += 1
odd = [k+1 for k, l in enumerate(lines) if l.count('`') % 2]
print('table mismatches:', bad, '| lines with odd backticks:', odd[:20])
