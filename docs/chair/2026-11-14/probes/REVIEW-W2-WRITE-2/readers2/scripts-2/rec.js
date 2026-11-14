const fs=require('fs'),zlib=require('zlib');
const R=process.env.R||'/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/r/tip';
module.exports=function(t){return JSON.parse(zlib.gunzipSync(fs.readFileSync(R+'/records/'+t+'.json.gz')))};
