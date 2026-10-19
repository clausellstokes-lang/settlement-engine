F = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_ST.md'
s = open(F, encoding='utf-8').read()
body, rec = s.split('## §15 THE CURE RECORD')
ids = [f'ST-r2-{i}' for i in range(1, 33)] + [f'SEAMS-r2-{i}' for i in (7, 9, 12, 18)] + [f'HOST-r2-{i}' for i in (3, 7, 8, 9, 10, 11, 19, 20)]
import re
missing = []
for i in ids:
    pat = re.compile(re.escape(i) + r'(?!\d)')
    nb = len(pat.findall(body)); nr = len(pat.findall(rec))
    if nb == 0 or nr == 0: missing.append((i, nb, nr))
    print(f'{i}\tbody={nb}\trecord={nr}')
print('MISSING', missing)
print('CURED r2 brackets:', body.count('[CURED 2026-10-18 (fp-final r2)'), ' STOP marks:', body.count('[STOP ST-r2-14') + body.count('[STOP HOST-r2-11'))
