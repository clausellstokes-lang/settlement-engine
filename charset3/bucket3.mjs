import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const req=createRequire(DOCK+'/package.json');
const { sanitizeJsPdfText }=await import(pathToFileURL(DOCK+'/src/utils/jsPdfText.js'));
const { CUSTOM_CONTENT_CHARSET }=await import(pathToFileURL(DOCK+'/src/domain/content/customContentCharset.generated.js'));
const { decodeRanges }=await import(pathToFileURL(DOCK+'/src/domain/content/customContentCharset.js'));
const jspdfMod=await import(pathToFileURL(req.resolve('jspdf')));
const jsPDF=jspdfMod.jsPDF||jspdfMod.default?.jsPDF||jspdfMod.default;
const winAnsi=new jsPDF().getFont().metadata?.Unicode?.encoding?.WinAnsiEncoding;
const U=(cp)=>'U+'+cp.toString(16).toUpperCase().padStart(4,'0');
const has=(s,cp)=>cp<0x10000?(s.bmp[cp>>3]&(1<<(cp&7)))!==0:s.astral.some(([l,h])=>cp>=l&&cp<=h);

const encodable=new Set();
for(let c=0x20;c<=0x7e;c++)encodable.add(c);
for(let c=0xa0;c<=0xff;c++)encodable.add(c);
for(const k of Object.keys(winAnsi))encodable.add(Number(k));
const passes=(cp)=>{const a='a'+String.fromCodePoint(cp)+'a';return sanitizeJsPdfText(a)===a;};
const textPass=[...encodable].filter(passes);

const bans={};
for(const k of ['control','bidi','invisible','noncharacter']) bans[k]=decodeRanges(CUSTOM_CONTENT_CHARSET.bans[k]);
console.log('### BUCKET 3 — admitted by the sanitiser yet named by the product\'s own ban table');
for(const cp of textPass.sort((a,b)=>a-b)){
  for(const k of ['control','bidi','invisible','noncharacter'])
    if(has(bans[k],cp)) console.log('   ',U(cp),JSON.stringify(String.fromCodePoint(cp)),'ban class:',k);
}
console.log('\n### admitted-but-not-encodable (sanitiser looser than the encoder)?');
const looser=textPass.filter(cp=>!encodable.has(cp));
console.log('   count',looser.length, looser.map(U).join(' ')||'(none)');
console.log('\n### soft-hyphen round trip:', JSON.stringify(sanitizeJsPdfText('a­a')));
console.log('### nbsp round trip:', JSON.stringify(sanitizeJsPdfText('a a')));
console.log('### tab round trip:', JSON.stringify(sanitizeJsPdfText('a\ta')));
