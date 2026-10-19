import re, sys
F = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_ST.md'
lines = open(F, encoding='utf-8').read().split('\n')
def cells(line):
    # split on unescaped pipes (GFM: pipes split even inside code spans unless escaped)
    parts = re.split(r'(?<!\\)\|', line)
    return parts
def raw_pipes_in_code(line):
    bad = []
    for m in re.finditer(r'`([^`]*)`', line):
        if re.search(r'(?<!\\)\|', m.group(1)):
            bad.append(m.group(0)[:80])
    return bad
issues = 0
i = 0
in_code = False
while i < len(lines):
    l = lines[i]
    if l.startswith('```'):
        in_code = not in_code; i += 1; continue
    if not in_code and l.startswith('|') and i + 1 < len(lines) and re.match(r'^\|[-| :]+\|$', lines[i+1]):
        n = len(cells(l))
        j = i + 2
        while j < len(lines) and lines[j].startswith('|'):
            if len(cells(lines[j])) != n:
                print(f'COLS line {j+1}: {len(cells(lines[j]))} vs {n}: {lines[j][:100]}'); issues += 1
            for b in raw_pipes_in_code(lines[j]):
                print(f'PIPE-IN-CODE line {j+1}: {b}'); issues += 1
            j += 1
        i = j; continue
    i += 1
print('issues', issues)
