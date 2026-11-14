const fs=require("fs");
const {leaves,rec,tab}=require("./lib.js");
const rows=JSON.parse(fs.readFileSync("prose-rows.json","utf8"));
const T=[
 ["frame:watching",/^\{N\}'s position is worth watching over/],
 ["frame:newcomer",/^A newcomer to \{N\} soon hears/],
 ["frame:othersWant",/^Others want \{N\} for what it controls\.$/],
 ["frame:seeLittle",/^The people who live there see little of that value\.$/],
 ["frame:couldNotKeep",/^The people of \{N\} know what their ground is worth/],
 ["frame:anyone",/^Anyone who looks at \{N\}'s position/],
 ["frame:forAsLong",/^For as long as others value/],
 ["part:easyHalf",/^The <T> takes the easy half of this trade/],
 ["part:worksPart",/^The <T> works part of the line that (.+) could support/],
 ["part:halfFinished",/^(.+) leaves \{N\} half-finished/],
 ["full:builtOn",/^This is the trade the <T> is actually built on/],
 ["full:everyStage",/^Every stage of the (.+) trade at \{N\} is done here/],
 ["full:allWay",/^The (.+) in \{N\}'s country is worked all the way through: the ground gives it, (.+) finishes it, and it leaves as (.+)\.$/],
 ["dep:nothingMore",/^Nothing more can be taken from the (.+) at \{N\}\.$/],
 ["dep:workedOutExh",/^The <T> has worked out its (.+), and it will not come back on its own/],
 ["dep:workedOut",/^It has worked out its (.+)\.$/],
 ["dep:bothers",/^Nobody at \{N\} bothers with the (.+) this year/],
 ["dep:leftAlone",/^Left alone, the ground will come back/],
 ["dep:untilPays",/^Until somebody pays to open new workings/],
 ["un:beenThere",/^(.+) has been there for \{N\} to take/],
 ["un:leavesUnworked",/^The <T> leaves its (.+) unworked\.$/],
 ["un:fetch",/^It would fetch barely enough/],
 ["un:outThere",/^There is (.+) out there and nobody has ever thought/],
 ["un:realMoney",/^There is (.+) in \{N\}'s country worth real money/],
 ["un:point",/^Everybody in this <T> can point at the (.+), and nobody/],
 ["un:liesUnworked",/^(.+) lies unworked around \{N\}/],
 ["un:lacks",/^The <T> has the (.+); what it lacks is (.+) to start the work\.$/],
];
const fam={};const unk=[];
for(const r of rows){let hit=null;for(const [k,re] of T){const m=r.t.match(re);if(m){hit=[k,m];break}}
 if(!hit){unk.push(r.t);continue}
 r.fam=hit[0];r.m=hit[1].slice(1);(fam[hit[0]]=fam[hit[0]]||[]).push(r)}
console.log("unknown",unk.length,[...new Set(unk)].slice(0,10));
for(const k in fam)console.log(k,new Set(fam[k].map(r=>r.seed)).size);
fs.writeFileSync("prose-fam.json",JSON.stringify(fam));
