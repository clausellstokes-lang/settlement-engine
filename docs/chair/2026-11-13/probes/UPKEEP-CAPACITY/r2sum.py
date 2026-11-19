import sys,json,glob,collections as C
for t in sys.argv[2:]:
    r=[json.loads(l) for f in glob.glob(f'{sys.argv[1]}/{t}-*.ndjson') for l in open(f)]
    a=[x for x in r if x['above']]; ar=[x for x in r if x.get('aboveR')]
    print(t, 'hired-only', len(r), 'military above', len(a), 'readiness above', len(ar), 'both', sum(1 for x in r if x['above'] and x.get('aboveR')))
    print('   mil above:', [(x['key'],x['hired'],x['watch']) for x in a])
    print('   readiness above:', [(x['key'],x['rHired'],x['rWatch']) for x in ar][:12])
