const T=process.env.TREE; const { FACE_HONORIFICS, styledTitleOf } = await import(T+'/src/data/faceHonorifics.js');
const out=[]; for(const k of Object.keys(FACE_HONORIFICS)){ const f=styledTitleOf(k,'female'); const m=styledTitleOf(k,'male'); if(f!==k||m!==k) out.push([k,f,m]); }
console.log(out.length); for(const o of out) console.log(o.join(' | '));
