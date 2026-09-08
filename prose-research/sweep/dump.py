import json, sys, os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import claims_data, sources_data
out = {
 "complete": sources_data.COMPLETE,
 "coverage": sources_data.COVERAGE,
 "sourcesRead": sources_data.SOURCES,
 "claims": [{k:v for k,v in c.items() if k!='_src'} for c in claims_data.CLAIMS],
}
p = os.path.join(os.path.dirname(os.path.abspath(__file__)),'found-kay-silmarillion-and-verse.json')
json.dump(out, open(p,'w',encoding='utf-8'), ensure_ascii=False, indent=1)
print('wrote', p, 'claims', len(out['claims']), 'sources', len(out['sourcesRead']), 'complete', out['complete'])
