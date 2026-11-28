# F5 plants through the classifier: four present-tense lines (the fourth printed in quotation marks, as the Overview prints
# it: the fifth seat's plant) and three past controls (one quoted)
S=$1; C=$2
node -e "
const f=(q,view)=>({seed:'x',view,word:'clergy',side:'names',quote:q,source:'unattributed'});
require('fs').writeFileSync('$S/f5page.json',JSON.stringify({findings:[
 f('The temple still collects the tithe from every household in the valley.','History'),
 f('The garrison captain still drills the recruits at dawn.','Overview'),
 f('Every market day the stalls fill the square before dawn.','Overview'),
 f('\"The Religious Conflict is why the local clergy and the civic authority maintain a relationship of careful, documented mutual respect\"','Overview'),
 f('\"The plague came through twenty years ago and took the old priest.\"','History'),
 f('The plague came through twenty years ago and took the old priest.','History'),
 f('The records of that time say the priest was poisoned slowly.','Plot Hooks')]}));
require('fs').writeFileSync('$S/f5corpus.ndjson',JSON.stringify({seed:'x',s:{}})+'\n');"
gzip -kf $S/f5corpus.ndjson
node $C $S/f5page.json $S/f5corpus.ndjson.gz $S/f5out.json > /dev/null
node -e "for (const r of JSON.parse(require('fs').readFileSync('$S/f5out.json'))) console.log((r.class+'      ').slice(0,10), r.quote)"
