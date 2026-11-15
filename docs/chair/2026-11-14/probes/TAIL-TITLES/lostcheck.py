# TAIL-TITLES: every sentence that prints in fewer towns (or none) holds a face word of the table, a face honorific, or
# is the base run's flake; python3 -I lostcheck.py <before.json> <after.json>
import json, sys, re
B = json.load(open(sys.argv[1])); A = json.load(open(sys.argv[2]))
FACE = re.compile(r"ferryman|boat-headman|headman|camp foreman|front man|spokesman|\blord\b|abbot|high priest\b|foundling-mother|alewife|madam", re.I)
bad = []; n = 0
for s, v in B.items():
    lost = set(v['towns']) - set(A.get(s, {'towns': []})['towns'])
    if not lost: continue
    n += 1
    if not FACE.search(s): bad.append((len(lost), s[:150], sorted(lost)[:3]))
print(f'sentences that lost towns {n}; without a face word {len(bad)}')
for b in sorted(bad, reverse=True)[:20]: print('  ', b)
