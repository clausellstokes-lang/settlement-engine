import base from './c21.mjs';
export default (t,p,ctx)=>{const r=base(t,p,ctx);const g=/The garrison keeps order/.test(ctx.page);return {ok:r.ok&&!g,why:r.why+(g?' GARRISON-KEEPS-ORDER':'')};};
