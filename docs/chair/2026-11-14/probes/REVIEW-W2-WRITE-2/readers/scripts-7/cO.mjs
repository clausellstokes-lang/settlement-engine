import base from './cC.mjs';
export default (t,p,ctx)=>{const r=base(t,p,ctx);const over=/local offices work only under their eye/.test(ctx.page);return {ok:r.ok&&!over,why:r.why+(over?' OVERSIGHT-ON-PAGE':'')};};
