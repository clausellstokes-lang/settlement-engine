COVERAGE = open('coverage.txt').read().strip()
COMPLETE = open('complete.txt').read().strip() == 'true'
import json
json.dump({"complete": COMPLETE, "coverage": COVERAGE, "sourcesRead": sources, "claims": claims}, open(OUT,'w'), indent=1, ensure_ascii=False)
print("wrote", OUT, len(sources), "sources", len(claims), "claims")
