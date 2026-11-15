#!/usr/bin/env python3
# READ-ALL-4: the wide candidates measured by the record before any builder sees them: for a flagged fold, the towns that print it
# (the tabs' inventory at the landed tip) split by the record's own facts.
import io, re, sys, json, gzip, collections
INV, CENSUS, MERGED = sys.argv[1:4]
inv = json.load(io.open(INV, encoding='utf-8'))
rows = {r['id']: r for r in json.load(io.open(MERGED + '/flagged.sentences.json', encoding='utf-8'))}
rec = {}
for line in gzip.open(CENSUS + '/corpus.ndjson.gz', 'rt', encoding='utf-8'):
    o = json.loads(line); rec[o['seed']] = o['s']
def g(o, *ks):
    for k in ks:
        o = o.get(k) if isinstance(o, dict) else None
    return o
def stress(s):
    st = []
    for k in ('stress', 'stressors'):
        v = s.get(k)
        for x in (v if isinstance(v, list) else [v]):
            if isinstance(x, dict) and x.get('label') and x['label'] not in st: st.append(x['label'])
    return st
def towns(i):
    f = rows[i]['fold']; e = inv.get(f)
    return (e or {}).get('towns') or []
def split(i, name, pred):
    T = towns(i); c = collections.Counter()
    for t in T:
        s = rec.get(t)
        if s is None: c['(no record)'] += 1; continue
        c[str(pred(s))] += 1
    print('%s %-34s towns %3d · %s' % (i, name, len(T), dict(c.most_common(8))))
ARC = re.compile(r'arcan|mage|wizard|sorcer', re.I)
def govarc(s):
    ps = s.get('powerStructure') or {}
    gov = str(ps.get('government') or '')
    fs = [f for f in (ps.get('factions') or []) if isinstance(f, dict)]
    top = fs[0].get('faction') if fs else ''
    if ARC.search(gov): return 'GOVERNS (government: arcane)'
    if any(ARC.search(str(f.get('faction') or '')) and f.get('isGoverning') for f in fs): return 'GOVERNS (faction flagged governing)'
    if any(ARC.search(str(f.get('faction') or '')) for f in fs): return 'an arcane power stands, not governing'
    return 'no arcane power'
def crisis(s):
    st = ' '.join(stress(s)).lower()
    for k, w in (('siege', 'siege'), ('occup', 'occupation'), ('famine', 'famine'), ('plague', 'plague')):
        if k in st: return w
    return 'other stress' if st else 'calm'
def crim(s):
    src = [str(x.get('source')) for x in (g(s, 'economicState', 'incomeSources') or []) if isinstance(x, dict)]
    c = [x for x in src if re.search(r'black|smuggl|crim|illicit|contraband|fence|theft|thiev|protection|piracy|pirate|racket|bribe|shadow', x, re.I)]
    return 'criminal income: ' + '/'.join(sorted(c)) if c else 'NO criminal income source'
def access(s):
    es = s.get('economicState') or {}
    imp = es.get('primaryImports') or es.get('imports') or []
    return '%s%s' % (crisis(s), ' · isolated' if str(es.get('tradeAccess') or g(s, 'config', 'tradeRouteAccess') or '').lower().startswith('isol') else '')
for i, name, pred in (
    ('00897', 'money made outside the law', crim),
    ('00607', 'ARCANE_ADVISORY (not empowered)', govarc), ('01128', 'ARCANE_ADVISORY (advisory)', govarc),
    ('01020', 'standard patrol coverage', crisis), ('01022', 'the usual rounds', crisis), ('01018', 'well paid, patrol properly', crisis),
    ('00665', 'brings in the rest (luxury)', access), ('00676', 'brings in the rest (timber)', access), ('00666', 'brings in the rest (metals)', access),
    ('00993', 'buys in (luxury)', access), ('00987', 'buys in (luxury) 2', access), ('00992', 'buys in (timber)', access), ('01005', 'buys in (luxury) 3', access),
    ('01109', 'yards as busy (metropolis)', crisis), ('01108', 'yards as busy (hamlet)', crisis), ('01110', 'yards as busy (thorp)', crisis), ('01112', 'yards as busy (village)', crisis),
    ('00643', 'no guild keeps a house', lambda s: 'a guild power stands' if any(re.search(r'guild', str(f.get('faction') or ''), re.I) for f in (g(s, 'powerStructure', 'factions') or []) if isinstance(f, dict)) else 'no guild power'),
    ('00442', 'back rooms after dark', crim), ('00248', 'cargo lost on the road', crisis), ('00717', 'you would not see the quarrel', crisis),
    ('00950', 'council cannot agree', lambda s: 'seats on the council: %d' % sum(1 for n in (s.get('npcs') or []) if isinstance(n, dict) for m in (n.get('memberships') or []) if isinstance(m, dict) and 'Council' in str(m.get('power')))),
):
    if i in rows: split(i, name, pred)
    else: print(i, 'not in the merge')
