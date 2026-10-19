import re, sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
lines = s.split('\n')
# 1. table column consistency (per contiguous table block)
def cells(line):
    # split on unescaped pipes outside code spans
    out, cur, inc = [], '', False
    i = 0
    while i < len(line):
        ch = line[i]
        if ch == '`':
            inc = not inc; cur += ch
        elif ch == '\\' and i + 1 < len(line) and line[i+1] == '|':
            cur += '\\|'; i += 1
        elif ch == '|' and not inc:
            out.append(cur); cur = ''
        else:
            cur += ch
        i += 1
    out.append(cur)
    return out
bad = 0; raw_pipe_in_code = 0
block = []
def flush(block):
    global bad
    if not block: return
    n = len(cells(block[0][1]))
    for ln, l in block:
        if len(cells(l)) != n:
            bad += 1
            print('COLS line %d: %d vs %d' % (ln, len(cells(l)), n))
in_code = False
for idx, l in enumerate(lines, 1):
    if l.startswith('```'):
        in_code = not in_code
    if not in_code and l.startswith('|'):
        block.append((idx, l))
        # naive raw pipe within backticks check: count backticks parity
        segs = l.split('`')
        for k in range(1, len(segs), 2):
            if '|' in segs[k].replace('\\|', ''):
                raw_pipe_in_code += 1
                print('RAW PIPE IN CODE line %d: %s' % (idx, segs[k][:60]))
    else:
        flush(block); block = []
flush(block)
# 2. r2 ids each have a body bracket
body = s.split('### Round r2')[0]
ids = ['PT-r1-1', 'PT-r1-8', 'PT-r1-10', 'PT-r1-14', 'PT-r1-16', 'PT-V1', 'PT-V2', 'PT-V3', 'PT-V4']
missing = []
r2br = re.findall(r'\[CURED 2026-10-18 \(fp-final r2\) — ([^\]]*)\]', body)
joined = ' || '.join(r2br)
for i in ids:
    if not re.search(re.escape(i) + r'(?![0-9])', joined):
        missing.append(i)
print('r2 CURED brackets:', len(r2br), '; REFINED r2:', len(re.findall(r'\[REFINED 2026-10-18 \(fp-final r2\)', body)) + len(re.findall(r'REFINED on B|REFINED \(vetoable\)|REFINED, vetoable|REFINED: ', joined)))
print('ids without an r2 body bracket:', missing)
print('carries/§E mentions in r2 brackets: carry=%d sites=%d patrols=%d doctrines=%d plague=%d' % (joined.count("verifier's carr"), joined.count('sites'), s.count('**Patrols considered**'), joined.count('doctrines'), joined.count('plague-R7')))
print('table column mismatches:', bad, '; raw pipes in code spans in tables:', raw_pipe_in_code)
