import os
_d = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-r2b-probe/tools'
for _p in ('edits_r2b_part1.py', 'edits_r2b_part2.py', 'edits_r2b_part3.py'):
    exec(open(os.path.join('/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-r2b-probe/tools', _p), encoding='utf-8').read())
