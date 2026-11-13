# F5 plants through the classifier: three present-tense lines and one past control
S=$1; C=$2
node -e "
const f=(q,view)=>({seed:'x',view,word:'clergy',side:'names',quote:q,source:'unattributed'});
require('fs').writeFileSync('$S/f5page.json',JSON.stringify({findings:[
 f('The temple still collects the tithe from every household in the valley.','History'),
 f('The garrison captain still drills the recruits at dawn.','Overview'),
 f('Every market day the stalls fill the square before dawn.','Overview'),
 f('The plague came through twenty years ago and took the old priest.','History'),
 f('The records of that time say the priest was poisoned slowly.','Plot Hooks')]}));
require('fs').writeFileSync('$S/f5corpus.ndjson',JSON.stringify({seed:'x',s:{}})+'\n');"
gzip -kf $S/f5corpus.ndjson
node $C $S/f5page.json $S/f5corpus.ndjson.gz $S/f5out.json > /dev/null
node -e "for (const r of JSON.parse(require('fs').readFileSync('$S/f5out.json'))) console.log((r.class+'      ').slice(0,10), r.quote)"
