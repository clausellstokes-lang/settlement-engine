import re, sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
lines = s.split('\n')
def cells(line):
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
bad = 0; raw = 0; block = []
def flush(block):
    global bad
    if not block: return
    n = len(cells(block[0][1]))
    for ln, l in block:
        if len(cells(l)) != n:
            bad += 1; print('COLS line %d: %d vs %d' % (ln, len(cells(l)), n))
in_code = False
for idx, l in enumerate(lines, 1):
    if l.startswith('```'): in_code = not in_code
    if not in_code and l.startswith('|'):
        block.append((idx, l))
        segs = l.split('`')
        for k in range(1, len(segs), 2):
            if '|' in segs[k].replace('\\|', ''):
                raw += 1; print('RAW PIPE IN CODE line %d: %s' % (idx, segs[k][:60]))
    else:
        flush(block); block = []
flush(block)
body = s.split('### Round r2b')[0]
ids = ['SEAMS-r2-6', 'SEAMS-r2-14', 'HOST-r2-12', 'STOP-PR-2', 'OD-PT-28', 'HOST-r2-5', 'ST-r2-14', 'ST-r2-19', 'HOST-r2-19', 'PR-r2-13']
br = re.findall(r'\[CURED 2026-10-18 \(fp-final r2\) — ([^\]]*)\]', body)
joined = ' || '.join(br)
missing = [i for i in ids if not re.search(re.escape(i) + r'(?![0-9])', joined)]
refs = re.findall(r'R2b-[1-5]', body)
print('ids without a body bracket:', missing)
print('R2b refinement marks in body:', sorted(set(refs)), len(refs))
print('residual tokens: party_revealed_site=%d  "opens H16"=%d  HR:600=%d HR:513=%d HR:655=%d HR:666=%d HR:872=%d  "chair notes items 13–14)"=%d  "banTick"=%d' % (
    s.count('party_revealed_site'), s.count('opens H16'), s.count('HR:600'), s.count('HR:513'), s.count('HR:655'), s.count('HR:666'), s.count('HR:872'), s.count('chair notes items 13–14).'), s.count('banTick')))
print('M-SITE-A mentions:', s.count('M-SITE-A'), '; u:<unitKey> mentions:', s.count('u:<unitKey>'), '; road arm mentions:', s.lower().count('road arm'))
print('table column mismatches:', bad, '; raw pipes in code spans in tables:', raw)
print('lines:', len(lines), 'bytes:', len(s.encode()))
