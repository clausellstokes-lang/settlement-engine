const fs=require("fs");const T=["1930cec6e","9d5d6e091","a51634ede","aa41b1f25","c3913f999"];const dir=process.argv[2];
const M=Object.fromEntries(T.map(t=>[t,JSON.parse(fs.readFileSync(`${dir}/${t}.json`,"utf8"))]));
const keys=JSON.parse(fs.readFileSync(`${dir}/keys30.json`,"utf8"));
const out={_doc:"W2-B-DECLARE sixth seat, R2 (REVIEW-W2B third read, finding 3): the dossier prose manifest's drift rows MOVED against the one committed fixture (tests/fixtures/dossier-prose-manifest-golden.json, unchanged at every tree), re-measured by this seat with the reader's own probe (lane/review-w2b-2026-11-13 cc0dd4ed2 :: docs/chair/2026-11-13/probes/REVIEW-W2B-3/manifestmoved.mjs, run unchanged, TREE=<a detached worktree of each commit>). movedAt: the rows that differ from the fixture at each tree. changedBetween: the rows whose hash differs between consecutive trees. rows: the 30 keys whose hash differs between the record's base 1930cec6e and the lane's tip c3913f999, with each tree's hash (null = equal to the fixture). AGREES with the reader's results/manifest-moved-rows.json: the same 30 keys, every hash equal at 9d5d6e091 and at the tip.",
movedAt:Object.fromEntries(T.map(t=>[t,Object.keys(M[t]).length])),
changedBetween:Object.fromEntries(T.slice(1).map((t,i)=>{const a=M[T[i]],b=M[t];const ks=new Set([...Object.keys(a),...Object.keys(b)]);return [T[i]+".."+t,[...ks].filter(k=>a[k]!==b[k]).length];})),
newlyMoved:keys.filter(k=>!(k in M["1930cec6e"])),
rows:Object.fromEntries(keys.map(k=>[k,Object.fromEntries(T.map(t=>[t,M[t][k]??null]))]))};
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1)+"\n");console.log(out.movedAt,out.changedBetween,out.newlyMoved);
