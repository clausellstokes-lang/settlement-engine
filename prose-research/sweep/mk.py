import json,sys,os
D=os.path.dirname(os.path.abspath(__file__))
data=json.load(open(os.path.join(D,'payload.json'),encoding='utf-8'))
json.dump(data,open(os.path.join(D,'found-ai-arch-gazetteer-travel-history.json'),'w',encoding='utf-8'),indent=1,ensure_ascii=False)
print('claims',len(data['claims']),'sources',len(data['sourcesRead']))
