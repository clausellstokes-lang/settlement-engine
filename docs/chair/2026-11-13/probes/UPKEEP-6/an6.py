"""COHERENCE-UPKEEP-6: the tables from births6.mjs dumps. MEASURES ONLY.
   python3 -I an6.py <a.ndjson> <b.ndjson> [section ...]   sections: band f3 guard walls move
   <a> is the earlier tree, <b> the later one, keyed by birth."""
import json, sys, collections as C

def load(p):
    return {r['key']: r for r in map(json.loads, open(p))}

a, b = load(sys.argv[1]), load(sys.argv[2])
secs = sys.argv[3:] or ['band', 'f3', 'guard', 'walls', 'move']
keys = [k for k in b if k in a]
TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']
BANDS = ['Undefended', 'Vulnerable', 'Lightly Defended', 'Defensible', 'Well-Defended', 'Fortress']
corpus = lambda k: 'fresh6' if k.startswith('fresh6') else 'u5'

if 'band' in secs:
    for name, d in (('a', a), ('b', b)):
        n = C.Counter(); bad = C.Counter()
        for k, r in d.items():
            n[corpus(k)] += 1
            if r['label'] != r['roundLabel']: bad[corpus(k)] += 1
        frac = sum(1 for r in d.values() if r['score'] is not None and r['score'] != int(r['score']))
        print(f"band[{name}]: label != band of the rounded figure: {dict(bad)} of {dict(n)}; scores with tenths {frac}")

if 'f3' in secs:
    six = ['agree-city-58', 'agree-force-famine-town-4', 'agree-force-famine-city-1', 'agree-force-famine-city-5', 'cold-famine-town-1', 'cold-famine-city-1']
    for k in six:
        if k in a and k in b:
            print(f"f3 {k}: held {a[k]['held']} -> {b[k]['held']}; months {a[k]['months']} -> {b[k]['months']}; granary {b[k]['granary']}; standing {b[k]['standing']}")
    t = C.Counter(); ex = collections_ex = C.defaultdict(list)
    for k in keys:
        if 'famine' not in b[k]['stresses'] and 'famine' not in a[k]['stresses']: continue
        x, y = a[k]['held'], b[k]['held']
        t[(corpus(k), x, y)] += 1
        if x != y: ex[(corpus(k), x, y)].append(f"{k}({a[k]['months']}->{b[k]['months']},{b[k]['standing']})")
    for key in sorted(t, key=str): print('f3 famine births', key, t[key])
    for key, v in ex.items(): print('f3 flips', key, len(v), ' '.join(v[:12]))

if 'guard' in secs:
    PAT = [('mercPaid', 'There is no standing guard; a hired company is paid'), ('mercShort', 'the coin to keep it runs short'),
           ('mercHunger', 'A hired company is on the books, paid from what the hunger leaves'),
           ('swordsPurse', 'Hired swords back the garrison when the purse allows.'), ('swordsHunger', 'Hired swords back the garrison, paid from what the hunger leaves.'),
           ('swords', 'Hired swords back the garrison.'),
           ('charterPurse', 'bounty work against threats, as far as the purse runs'), ('charterHunger', 'bounty work against threats, paid from what the hunger leaves'),
           ('charterLead', "The adventurers' charter hall coordinates emergency response")]
    for name, d in (('a', a), ('b', b)):
        t = C.Counter()
        for k, r in d.items():
            g = r['guard'] or ''
            for pid, s in PAT:
                if s in g:
                    crisis = ','.join(x for x in r['stresses'] if x in ('famine', 'under_siege')) or '-'
                    t[(pid, r['shown'], r['standing'], crisis, r['foodBand'])] += 1
        print(f"guard[{name}] lines by (line, shown, standing, crisis, food band):")
        for key in sorted(t): print('   ', key, t[key])
    # F4: the hunger lines in a siege whose food band shows no hunger
    for name, d in (('a', a), ('b', b)):
        hits = [k for k, r in d.items() if 'what the hunger leaves' in (r['guard'] or '') and 'famine' not in r['stresses']]
        print(f"F4[{name}] hunger line with no famine: {len(hits)}: " + ' '.join(f"{k}({d[k]['foodBand']},{d[k]['months']})" for k in hits[:20]))
    # F7: the mercenary pair's reach
    for name, d in (('a', a), ('b', b)):
        m = [k for k, r in d.items() if r['hired']['company'] and not (r['hired']['garrison'] or r['hired']['watch'] or r['hired']['militia'])]
        print(f"F7[{name}] a company and no standing force: {len(m)} " + ' '.join(m[:10]))

if 'walls' in secs:
    t = C.Counter(); kinds = C.Counter(); dis = []
    for k, r in b.items():
        names = tuple(r['walls'])
        if names: t[(r['tier'], names)] += 1
        kinds[(r['tier'], r['wallOf'], r['factsWallKind'])] += 1
        if (r['wallOf'] or None) != (r['factsWallKind'] or None): dis.append(k)
    print('walls: roster names in the walls bucket, by size')
    for key in sorted(t, key=lambda x: (TIERS.index(x[0]), x[1])): print('   ', key, t[key])
    print('walls: kind (the buckets home, the facts home) by size')
    for key in sorted(kinds, key=lambda x: (TIERS.index(x[0]), str(x[1:]))): print('   ', key, kinds[key])
    print('walls: the two homes disagree on', len(dis), ' '.join(dis[:10]))

if 'move' in secs:
    t = C.Counter(); ex = C.defaultdict(list); same = C.Counter()
    for k in keys:
        x, y = a[k], b[k]
        if x['label'] == y['label']:
            same[corpus(k)] += 1
            continue
        d = BANDS.index(y['label']) - BANDS.index(x['label'])
        g = f"{corpus(k)} {y['tier']} {'down' if d < 0 else 'up'}{abs(d)}"
        t[g] += 1; ex[g].append(f"{k}:{x['score']}->{y['score']}")
    print('move: bands unchanged', dict(same))
    for g in sorted(t): print('move', g, t[g], ' '.join(ex[g][:8]))
