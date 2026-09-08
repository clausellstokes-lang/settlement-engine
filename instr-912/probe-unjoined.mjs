import * as C from '../laneINSTR/tests/helpers/dossierCorpus.js';
const r1 = await C.loadStateLeaves();
const { unjoined } = C.joinAnnexToLeaves(C.loadStateAnnex(), r1);
for (const u of unjoined) {
  console.log('---', u.id, u.block, '|', u.angle, '|', JSON.stringify(u.text).slice(0,160));
  const near = r1.filter(e=>e.block===u.block && e.text.slice(0,30)===u.text.slice(0,30));
  console.log('    leaf near:', near.length ? JSON.stringify(near[0].text).slice(0,160) : 'none with same 30-char prefix');
}
