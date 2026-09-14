import * as G from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/scripts/lib/dossier-annex-grammar.mjs';
const t=(label,fn)=>{ try{ fn(); console.log('NO THROW  ', label); } catch(e){ console.log('throws    ', label, '::', String(e.message).slice(0,80)); } };
// vids
t('vid renumbering moves an existing vid', ()=>G.vidsOf('L',[{index:1},{index:3}],[1,2],undefined));
t('count above pin', ()=>G.vidsOf('L',[{index:1},{index:2},{index:3}],undefined,2));
t('backwards numbering', ()=>G.vidsOf('L',[{index:3},{index:2}],undefined,undefined));
t('duplicate row number', ()=>G.vidsOf('L',[{index:2},{index:2}],undefined,undefined));
t('CLEAN vids', ()=>{const v=G.vidsOf('L',[{index:1},{index:2}],[1,2],2); if(JSON.stringify(v)!=='[1,2]') throw new Error('wrong '+JSON.stringify(v)); console.log('   clean vids ->',JSON.stringify(v));});
// declarations
t('ROLE outside three', ()=>G.applyDeclaration({tag:'ROLE',tokens:['banner'],body:'banner'},{},'L'));
t('MOVE: ABSENCE', ()=>G.applyDeclaration({tag:'MOVE',tokens:['ABSENCE'],body:'ABSENCE'},{},'L'));
t('MOVE: HISTORY', ()=>G.applyDeclaration({tag:'MOVE',tokens:['HISTORY'],body:'HISTORY'},{},'L'));
t('RELATION outside four', ()=>G.applyDeclaration({tag:'RELATION',tokens:['irony'],body:'irony'},{},'L'));
t('FORM fragment while S2 unsigned', ()=>G.applyDeclaration({tag:'FORM',tokens:['fragment'],body:'fragment'},{},'L'));
t('unknown typed line', ()=>G.applyDeclaration({tag:'BANNER',tokens:['x'],body:'x'},{},'L'));
t('CLEAN ROLE modifier', ()=>{const into={};G.applyDeclaration({tag:'ROLE',tokens:['modifier'],body:'modifier'},into,'L'); if(into.role!=='modifier') throw new Error('not set');});
// connectives §7b
const mk=(joint)=>'## §7b THE STATE CONNECTIVES\n\n| relation | seat | joints | pin |\n|---|---|---|---|\n| `addition` | `sentence` | `'+joint+'` | 1 |\n';
t('§7b joint with a digit', ()=>G.parseConnectives(mk('5 men')));
t('§7b joint with an em dash', ()=>G.parseConnectives(mk('a — b')));
t('§7b joint with which', ()=>G.parseConnectives(mk('which is')));
t('§7b missing section', ()=>G.parseConnectives('# nothing here'));
// faces
t('face beyond the pin', ()=>G.assertFaces({label:'L',parent:{angle:'plain',text:'a',slots:[]},faces:['b','c','d','e'],pinnedFaceCount:4,shapeOf:()=>null,clauseOpeners:new Set(),form:'sentence'}));
t('face on a canonical row', ()=>G.assertFaces({label:'L',parent:{angle:'canonical',text:'a',slots:[]},faces:['b'],pinnedFaceCount:4,shapeOf:()=>null,clauseOpeners:new Set(),form:'sentence'}));
t('fragment face opening on a comma', ()=>G.assertFaces({label:'L',parent:{angle:'plain',text:'a',slots:[]},faces:[', and so'],pinnedFaceCount:4,shapeOf:()=>null,clauseOpeners:new Set(),form:'fragment'}));
t('CLEAN faces', ()=>G.assertFaces({label:'L',parent:{angle:'plain',text:'a',slots:[]},faces:['b'],pinnedFaceCount:4,shapeOf:()=>null,clauseOpeners:new Set(),form:'sentence'}));
