import { classifyMoves, orderIdOf } from '../laneINSTR/src/domain/prose/moveGrammar.js';
import { loadStateLeaves, loadCausalLeaf } from '../laneINSTR/tests/helpers/dossierCorpus.js';
const all = [...await loadStateLeaves(), ...await loadCausalLeaf()];
// a deterministic stratified sample: every 97th entry, 24 of them
const pick = [];
for (let i = 0; i < all.length && pick.length < 24; i += 97) pick.push(all[i]);
for (const e of pick) {
  const m = classifyMoves(e.text);
  console.log(`--- ${e.id}\n    CLASSIFIER: ${m.join('→')}  ${orderIdOf(m)||'(no member)'}\n    ${e.text}`);
}
