# usage: python3 -I facts.py <outdir> <out.ndjson> : the record's own facts per birth (roster, crises, buckets, scores, words)
import sys, os, gzip, json
from multiprocessing import Pool
D = sys.argv[1]
def band(x):
    x = x or 0
    return 'STRONG' if x >= 65 else 'ADEQUATE' if x >= 40 else 'WEAK' if x >= 20 else 'CRITICAL'
def one(fn):
    s = json.load(gzip.open(os.path.join(D, fn)))
    dp = s.get('defenseProfile') or {}; e = s.get('economicState') or {}; fs = e.get('foodSecurity') or {}
    b = dp.get('institutions') or {}
    sp = e.get('safetyProfile') or {}
    return {'seed': fn[:-8], 'tier': s.get('tier'), 'pop': s.get('population'),
        'stress': (s.get('config') or {}).get('stressTypes') or [], 'threat': (s.get('config') or {}).get('monsterThreat'),
        'roster': [i.get('name') for i in s.get('institutions') or []],
        'buckets': {k: [i.get('name') if isinstance(i, dict) else i for i in (v or [])] for k, v in b.items()},
        'scores': {k: v for k, v in (dp.get('scores') or {}).items() if isinstance(v, (int, float))},
        'readiness': dp.get('readiness'), 'prosperity': e.get('prosperity'), 'standing': e.get('prosperityStanding'),
        'income': [(x.get('source'), x.get('percentage'), x.get('desc')) for x in e.get('incomeSources') or []],
        'imports': e.get('primaryImports'), 'exports': e.get('primaryExports'),
        'chains': [(c.get('chainId'), c.get('status')) for c in e.get('activeChains') or [] if isinstance(c, dict)],
        'food': {k: v for k, v in (fs.get('foodRecord') or {}).items() if not isinstance(v, (list, dict))},
        'hasFamine': fs.get('hasFamine'), 'hasSiege': fs.get('hasSiege'),
        'safety': {k: sp.get(k) for k in ['safetyLabel', 'safetyDesc', 'guardEffectivenessDesc', 'economicDragDesc']},
        'crimes': [(c.get('type'), c.get('desc')) for c in sp.get('crimeTypes') or [] if isinstance(c, dict)],
        'inst': (e.get('compound') or {}).get('inst'), 'viable': (s.get('economicViability') or {}).get('viable'),
        'warnings': [(w.get('title'), w.get('description')) for w in (s.get('economicViability') or {}).get('warnings') or [] if isinstance(w, dict)],
        'tradeAccess': (s.get('config') or {}).get('tradeRouteAccess')}
if __name__ == '__main__':
    fs = sorted(f for f in os.listdir(D) if f.endswith('.json.gz'))
    with Pool(2) as p, open(sys.argv[2], 'w') as o:
        for r in p.imap_unordered(one, fs, chunksize=8): o.write(json.dumps(r) + '\n')
