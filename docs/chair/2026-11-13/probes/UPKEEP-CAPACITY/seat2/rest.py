import json,sys,glob
a={json.loads(l)['key']:json.loads(l)['base'] for f in glob.glob(f'{sys.argv[1]}/c2-*.ndjson') for l in open(f)}
b={json.loads(l)['key']:json.loads(l)['base'] for f in glob.glob(f'{sys.argv[2]}/c2-*.ndjson') for l in open(f)}
r=[k for k in a if a[k]['hRest']!=b[k]['hRest']]; al=[k for k in a if a[k]['hAll']!=b[k]['hAll']]
p=[k for k in a if a[k]['parts']!=b[k]['parts']]
print('record outside defence+powers differs',len(r),r[:5],'| whole record',len(al),'| parts differ',len(p))
