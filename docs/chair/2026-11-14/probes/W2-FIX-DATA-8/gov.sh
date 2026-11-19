# sh gov.sh <tree> <name>: the governing set to JSON, reds listed
S=/tmp/claude-0/-home-user-settlement-engine/20da41e0-fdd7-5ba6-bcc5-735d1051c63c/scratchpad
cd "$1" && GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 --reporter=json --outputFile=$S/gov-$2.json $(cat $S/gov-desc.txt) > $S/gov-$2.log 2>&1; echo "EXIT $?" >> $S/gov-$2.log
node -e 'const j=require(process.argv[1]);const red=[];for(const f of j.testResults){if(f.status==="failed"&&!(f.assertionResults||[]).some(a=>a.status==="failed"))red.push("SUITE "+f.name.split("/tests/")[1]+" :: "+String(f.message).slice(0,100));for(const a of f.assertionResults||[])if(a.status==="failed")red.push(f.name.split("/tests/")[1]+" :: "+a.fullName.slice(0,140));}console.log(j.numTotalTests,j.numFailedTests,red.length);require("fs").writeFileSync(process.argv[2],red.sort().join("\n")+"\n")' $S/gov-$2.json $S/gov-$2.red
diff $S/gov-base.red $S/gov-$2.red && echo SAME-REDS
