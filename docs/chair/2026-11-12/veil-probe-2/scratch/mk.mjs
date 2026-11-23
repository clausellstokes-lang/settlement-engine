import { nativeChain } from '/home/user/settlement-engine/docs/chair/2026-11-12/veil-probe-2/native.mjs';
const r = await nativeChain(process.argv[2], 999, { '211_server_side_share_veil.sql': process.argv[3] });
console.log(process.argv[2], r.failed); await r.db.end();
