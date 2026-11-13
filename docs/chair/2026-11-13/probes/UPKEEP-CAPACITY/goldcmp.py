import json,sys
a={json.loads(l)['key']:json.loads(l) for l in open(sys.argv[1])}; b={json.loads(l)['key']:json.loads(l) for l in open(sys.argv[2])}
print('golden corpus rows', len(a), 'records moved', sum(a[k]['all']!=b[k]['all'] for k in a), 'defence moved', sum(a[k]['def']!=b[k]['def'] for k in a), 'powers moved', sum(a[k]['pow']!=b[k]['pow'] for k in a), 'readiness moved', sum(a[k]['score']!=b[k]['score'] for k in a), 'band', sum(a[k]['band']!=b[k]['band'] for k in a))
