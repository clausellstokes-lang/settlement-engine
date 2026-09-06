import json, os, sys, unicodedata

FILES = {
 'guardian': 'guardian-kay2.txt',
 'bwflood': 'bw-flood.txt',
 'ts': 'kay-ts.txt',
 'pembroke': 'kay-pembroke.txt',
 'olleyintro': 'olley-intro-flat.txt',
 'olleyverse': 'olley-verse-flat.txt',
 'btdh': 'bw-btdh.txt',
 'larb': 'larb-kay.txt',
 'locus': 'locus-margins.txt',
 'foxed': 'foxed-dunnett.txt',
 'pilgrim': 'pilgrim-lecture.txt',
}
TEXT = {}
for k,v in FILES.items():
    TEXT[k] = open(v, encoding='utf-8', errors='replace').read() if os.path.exists(v) else ''

def norm(s):
    s = s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    s = s.replace('–','-').replace('—','-').replace(' ',' ')
    return ' '.join(s.split())

def check(key, q):
    if not q: return True
    return norm(q).lower() in norm(TEXT[key]).lower()

claims = json.load(open('claims.json', encoding='utf-8')) if os.path.exists('claims.json') else []
bad = []
for i,c in enumerate(claims):
    q = c.get('quote','')
    k = c.pop('_src')
    if q and not check(k, q):
        bad.append((i, c['feature'], q))
    if q and len(q.split()) > 12:
        bad.append((i, 'TOOLONG', q))
print("MISMATCHES:", len(bad))
for b in bad: print(b)
