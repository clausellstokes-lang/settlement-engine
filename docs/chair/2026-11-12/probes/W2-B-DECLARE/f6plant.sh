# F6 plant through the classifier: a corpus-block row (DS-ECO-9, rule V1b) is attributed; a truth-home leaf attributes nothing
# sh f6plant.sh <scratch dir> <tree>
S=$1; T=$2
node -e "
const f=(word,q)=>({seed:'x',view:'Systems/Economics',word,side:'names',quote:q,source:'unattributed'});
require('fs').writeFileSync('$S/f6page.json',JSON.stringify({findings:[f('smallMargin','A small margin of grain stands between the town and want.'),f('streets','Its streets are badly watched.')]}));
require('fs').writeFileSync('$S/f6corpus.ndjson',JSON.stringify({seed:'x',s:{}})+'\n');"
gzip -kf $S/f6corpus.ndjson
TREE=$T node $T/docs/chair/2026-11-12/probes/W2-B-DECLARE/classify.mjs $S/f6page.json $S/f6corpus.ndjson.gz $S/f6out.json > /dev/null
node -e "for (const r of JSON.parse(require('fs').readFileSync('$S/f6out.json'))) console.log(r.word, r.rule, r.source, r.file || '')"
