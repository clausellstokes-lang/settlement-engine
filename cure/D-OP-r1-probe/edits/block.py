import sys
path = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_OP.md'
ns = {}
exec(open(sys.argv[1], encoding='utf-8').read(), ns)
src = open(path, encoding='utf-8').read()
for start, end, new in ns['BLOCKS']:
    a = src.find(start); 
    assert a >= 0 and src.count(start) == 1, ('start', start[:80], src.count(start))
    b = src.find(end, a)
    assert b > a and src.count(end) == 1, ('end', end[:80], src.count(end))
    src = src[:a] + new + src[b:]
open(path, 'w', encoding='utf-8').write(src)
print('blocks applied', len(ns['BLOCKS']), 'size', len(src))
