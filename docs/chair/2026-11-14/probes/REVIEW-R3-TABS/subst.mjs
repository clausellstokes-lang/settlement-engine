// subst.mjs: TREE IN: the Substrate tab's food and trade rows per town as the tip prints them (re-stated from the tab:
// food = statusCase(foodSecurity.label); trade under a siege = statusCase(siege.label)), with the causal band word the
// line tip printed, and the facts: food balance, sources, siege summary, trade route.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { statusCase, tokenCase } = await import(R+'/components/new/labelLadder.js');
const { deriveCausalState, causalBandWord } = await import(R+'/domain/causalState.js');
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const food={}, trade={}, ex={};
for await (const l of rl){ const {seed,s}=JSON.parse(l); const fsec=s.economicState?.foodSecurity||{}; let cs=null; try{ cs=deriveCausalState(s); }catch(e){}
  const vars=cs?.variables||cs; const fb=vars?.food_security?.band ?? vars?.food_security; const tb=vars?.trade_connectivity?.band ?? vars?.trade_connectivity;
  const fw=fsec.label?statusCase(fsec.label.trim()):null; const was=fb?tokenCase(causalBandWord('food_security',fb)):null; const k=`${was} -> ${fw}`; food[k]=(food[k]||0)+1;
  const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]); const sg=st.find(x=>x?.type==='under_siege');
  if(sg){ const tw=sg.label?statusCase(sg.label.trim()):null; const tk=`${tb?tokenCase(causalBandWord('trade_connectivity',tb)):null} -> ${tw}`; trade[tk]=(trade[tk]||0)+1; (ex[tk]??=[]).push(seed); } }
console.log('FOOD (line word -> tip word):'); for(const [k,v] of Object.entries(food).sort((a,b)=>b[1]-a[1])) console.log('  ',v,k);
console.log('TRADE under siege:'); for(const [k,v] of Object.entries(trade).sort((a,b)=>b[1]-a[1])) console.log('  ',v,k,ex[k].slice(0,3).join(' '));
