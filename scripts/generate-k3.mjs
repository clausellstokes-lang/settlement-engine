/**
 * scripts/generate-k3.mjs -- K-3 EXHIBIT generator: ornament, materials, the tone gate, viewable.
 *
 * Emits, from the pure dormant K-3 kernel (src/domain/townMap/arch/*, imported by NOTHING shipped --
 * closure Delta 0), into public/landing-maps/k3-exhibit/:
 *   1. MILESTONE 1 -- rose-{t0,t1,t2}.glb + vault-{t0,t1,t2}.glb (the measured rose + ribbed vault bay).
 *   2. tracery-families.glb + evil-chapel.glb -- the four-family sampler + the tone-gate building.
 *   3. plate-rose.png / plate-vault.png / plate-tracery.png -- CPU plates of the ornament.
 *   4. DRESSED CATHEDRAL -- plate-cathedral-{skin}.png for four skins (the reskin seam: one shape,
 *      many skins, geometry untouched).
 *   5. TONE GATE -- plate-tone-gate.png: grotesque + skull iconography on the evil-drift chapel, for
 *      the OWNER taste veto BEFORE the vocabulary freezes.
 *   6. materials-swatches.png -- the 11-material x 6-weathering baked-texture library sheet.
 *   7. index.html -- a self-contained raw-WebGL2 viewer (orbit/zoom, model + LOD switchers).
 *
 * DETERMINISM: every mesh/GLB/plate/texture is pure (no clock, no rng); the script double-builds +
 * asserts byte identity before writing. Live WebGL pixels are device-dependent + NON-golden.
 *
 * Usage: node scripts/generate-k3.mjs [--check]
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildArchMesh } from '../src/domain/townMap/arch/emitter.js';
import { encodeGlb } from '../src/domain/townMap/arch/glb.js';
import { renderMeshPlate } from '../src/domain/townMap/arch/plate.js';
import { encodePng } from '../src/domain/townMap/arch/png.js';
import { roseWindowRuleset } from '../src/domain/townMap/arch/rulesets/roseWindow.js';
import { vaultBayRuleset } from '../src/domain/townMap/arch/rulesets/vaultBay.js';
import { traceryFamiliesRuleset } from '../src/domain/townMap/arch/rulesets/traceryFamilies.js';
import { evilChapelRuleset } from '../src/domain/townMap/arch/rulesets/evilChapel.js';
import { cathedralRuleset } from '../src/domain/townMap/arch/rulesets/cathedral.js';
import { SKINS, skinRoleAlbedo } from '../src/domain/townMap/arch/materials/skins.js';
import { MATERIAL_IDS, WEATHERING_CLASSES, bakeMaterialTexture } from '../src/domain/townMap/arch/materials/materials.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'landing-maps', 'k3-exhibit');

function bytesEqual(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function base64(bytes) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '', i = 0;
  for (; i + 3 <= bytes.length; i += 3) { const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]; out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + A[(n >> 6) & 63] + A[n & 63]; }
  const rem = bytes.length - i;
  if (rem === 1) { const n = bytes[i] << 16; out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + '=='; }
  else if (rem === 2) { const n = (bytes[i] << 16) | (bytes[i + 1] << 8); out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + A[(n >> 6) & 63] + '='; }
  return out;
}
function u32b64(arr) { const b = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength); return base64(b); }
const eqF = (x, y) => x.length === y.length && x.every((v, i) => v === y[i]);

/** double-build a ruleset+tier -> {mesh, glb}, asserting byte identity. */
function tierGlb(ruleset, tier, gen) {
  const a = buildArchMesh(ruleset, { seedId: 'k3', tier });
  const b = buildArchMesh(ruleset, { seedId: 'k3', tier });
  if (!eqF(a.positions, b.positions) || !eqF(a.normals, b.normals) || !eqF(a.indices, b.indices) || !eqF(a.ao, b.ao)) {
    console.error(`[k3] NON-DETERMINISTIC mesh: ${gen} tier ${tier}. Aborting.`); process.exit(1);
  }
  const geo = { positions: a.positions, normals: a.normals, indices: a.indices, vertexCount: a.vertexCount, min: a.min, max: a.max };
  const glb = encodeGlb(geo, { ao: a.ao, generator: gen });
  return { mesh: a, glb };
}

/** compose the 11x6 material-texture library into one RGB sheet PNG. */
function materialsSheet(cell) {
  const cols = WEATHERING_CLASSES.length, rows = MATERIAL_IDS.length, pad = 4;
  const W = cols * (cell + pad) + pad, H = rows * (cell + pad) + pad;
  const rgb = new Uint8Array(W * H * 3).fill(24);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tex = bakeMaterialTexture(MATERIAL_IDS[r], WEATHERING_CLASSES[c], cell);
      const ox = pad + c * (cell + pad), oy = pad + r * (cell + pad);
      for (let y = 0; y < cell; y++) for (let x = 0; x < cell; x++) {
        const s = (y * cell + x) * 3, d = ((oy + y) * W + (ox + x)) * 3;
        rgb[d] = tex.rgb[s]; rgb[d + 1] = tex.rgb[s + 1]; rgb[d + 2] = tex.rgb[s + 2];
      }
    }
  }
  return { png: encodePng(W, H, rgb), W, H };
}

function viewerHtml(models) {
  const modelJs = models.map((m) => `{name:"${m.name}",glbs:[${m.tiers.map((t) => `"${base64(t.glb)}"`).join(',')}],creases:[${m.tiers.map((t) => `"${u32b64(t.mesh.creaseEdges)}"`).join(',')}]}`).join(',');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>K-3 &mdash; gothic ornament, materials, the tone gate</title>
<style>
  :root{color-scheme:light dark}
  html,body{margin:0;height:100%;font:14px/1.5 -apple-system,system-ui,sans-serif}
  body{background:#0e0d0b;color:#e9e2d4;overflow:hidden}
  #c{position:fixed;inset:0;width:100vw;height:100vh;display:block;touch-action:none;cursor:grab}
  #c:active{cursor:grabbing}
  .panel{position:fixed;z-index:2;background:rgba(20,18,14,.72);border:1px solid rgba(200,180,120,.28);border-radius:10px;padding:12px 14px;backdrop-filter:blur(6px);max-width:360px}
  #info{top:14px;left:14px}#info h1{font-size:15px;margin:0 0 6px;color:#e7c98a}#info p{margin:4px 0;opacity:.85}
  .ctl{bottom:14px;left:14px}.ctl label{display:block;margin:6px 0 2px;opacity:.85;font-size:12.5px}
  button{font:inherit;color:#e9e2d4;background:rgba(90,78,52,.5);border:1px solid rgba(200,180,120,.35);border-radius:7px;padding:5px 10px;margin:2px 6px 2px 0;cursor:pointer}
  button.on{background:rgba(150,124,70,.75)}
  .err{position:fixed;inset:0;display:none;place-items:center;text-align:center;padding:24px;color:#f2c9a0}
</style></head><body>
<canvas id="c"></canvas>
<div id="info" class="panel"><h1>K-3 ornament kernel &mdash; deterministic 3D</h1>
<p>The gothic ornament algebra + material library, byte-reproducible. Drag to orbit &middot; wheel to zoom. Per-vertex baked AO + crease ink lines travel with the geometry; only the raw pixels are your GPU's.</p>
<p id="stats"></p></div>
<div class="ctl panel"><label>model</label><div id="models"></div><label>LOD tier</label>
<div><button data-tier="2" class="on">signature</button><button data-tier="1">commons</button><button data-tier="0">glyph</button></div>
<div style="margin-top:6px"><button id="spin" class="on">auto-orbit</button><button id="reset">reset</button></div></div>
<div id="err" class="err"></div>
<script>
const MODELS=[${modelJs}];
function b64ToBytes(s){const bin=atob(s);const a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return a;}
function b64ToU32(s){const b=b64ToBytes(s);return new Uint32Array(b.buffer,b.byteOffset,b.byteLength/4);}
function parseGlb(bytes){const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(dv.getUint32(0,true)!==0x46546c67)throw new Error('not a GLB');let off=12,json=null,bin=null;
  while(off<bytes.byteLength){const len=dv.getUint32(off,true),type=dv.getUint32(off+4,true);off+=8;const chunk=bytes.subarray(off,off+len);off+=len;
    if(type===0x4e4f534a)json=JSON.parse(new TextDecoder().decode(chunk));else if(type===0x004e4942)bin=chunk;}
  const acc=(i)=>{const a=json.accessors[i],bv=json.bufferViews[a.bufferView],base=(bv.byteOffset||0),comp=a.type==='VEC3'?3:1,n=a.count*comp;
    if(a.componentType===5126)return new Float32Array(bin.buffer,bin.byteOffset+base,n);return new Uint32Array(bin.buffer,bin.byteOffset+base,n);};
  const prim=json.meshes[0].primitives[0];const ao=prim.attributes._AO!==undefined?acc(prim.attributes._AO):null;
  return{positions:acc(prim.attributes.POSITION),normals:acc(prim.attributes.NORMAL),indices:acc(prim.indices),ao};}
const canvas=document.getElementById('c'),gl=canvas.getContext('webgl2',{antialias:true});
function fail(m){const e=document.getElementById('err');e.style.display='grid';e.textContent=m;}
if(!gl)fail('WebGL2 is unavailable in this browser.');
function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]];}function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}function nrm(a){const m=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/m,a[1]/m,a[2]/m];}
const M={persp:(fy,a,n,f)=>{const t=1/Math.tan(fy/2),nf=1/(n-f);return[t/a,0,0,0,0,t,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0];},
  look:(e,c,u)=>{const z=nrm(sub(e,c)),x=nrm(cross(u,z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,e),-dot(y,e),-dot(z,e),1];},
  mul:(a,b)=>{const o=new Array(16);for(let r=0;r<4;r++)for(let c=0;c<4;c++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;}};
let modelIdx=0,requestedTier=2,vaos=[[]],lineVaos=[[]],counts=[[]],lineCounts=[[]],center=[0,0,0],radius=1,prog,lineProg,parsed=[];
if(gl){
  const vs='#version 300 es\\nin vec3 aPos;in vec3 aNrm;in float aAO;uniform mat4 uMVP;out vec3 vN;out float vAO;void main(){vN=aNrm;vAO=aAO;gl_Position=uMVP*vec4(aPos,1.0);}';
  const fs='#version 300 es\\nprecision highp float;in vec3 vN;in float vAO;out vec4 o;void main(){vec3 N=normalize(vN);if(!gl_FrontFacing)N=-N;vec3 L1=normalize(vec3(-0.42,0.76,0.50)),L2=normalize(vec3(0.6,0.25,-0.4));float key=max(dot(N,L1),0.0),fill=max(dot(N,L2),0.0)*0.30,hemi=0.30+0.22*(N.y*0.5+0.5);vec3 stone=vec3(0.84,0.79,0.69),c=stone*(hemi+0.85*key+fill)*(0.4+0.6*vAO);c=pow(clamp(c,0.0,1.0),vec3(1.0/2.2));o=vec4(c,1.0);}';
  const lvs='#version 300 es\\nin vec3 aPos;uniform mat4 uMVP;void main(){gl_Position=uMVP*vec4(aPos,1.0);}';
  const lfs='#version 300 es\\nprecision highp float;out vec4 o;void main(){o=vec4(0.13,0.11,0.09,1.0);}';
  function sh(t,s){const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(x));return x;}
  function link(v,f){const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);return p;}
  try{prog=link(vs,fs);lineProg=link(lvs,lfs);}catch(e){fail('shader: '+e.message);}
  for(let mi=0;mi<MODELS.length;mi++){vaos[mi]=[];lineVaos[mi]=[];counts[mi]=[];lineCounts[mi]=[];parsed[mi]=[];
    for(let t=0;t<MODELS[mi].glbs.length;t++){const m=parseGlb(b64ToBytes(MODELS[mi].glbs[t]));parsed[mi][t]=m;const cr=b64ToU32(MODELS[mi].creases[t]);
      const vao=gl.createVertexArray();gl.bindVertexArray(vao);
      const mk=(d,loc,sz)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,d,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,sz,gl.FLOAT,false,0,0);};
      mk(m.positions,gl.getAttribLocation(prog,'aPos'),3);mk(m.normals,gl.getAttribLocation(prog,'aNrm'),3);mk(m.ao||new Float32Array(m.positions.length/3).fill(1),gl.getAttribLocation(prog,'aAO'),1);
      const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);
      vaos[mi][t]=vao;counts[mi][t]=m.indices.length;
      const lvao=gl.createVertexArray();gl.bindVertexArray(lvao);const lb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,lb);gl.bufferData(gl.ARRAY_BUFFER,m.positions,gl.STATIC_DRAW);
      gl.enableVertexAttribArray(gl.getAttribLocation(lineProg,'aPos'));gl.vertexAttribPointer(gl.getAttribLocation(lineProg,'aPos'),3,gl.FLOAT,false,0,0);
      const lib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,lib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,cr,gl.STATIC_DRAW);
      lineVaos[mi][t]=lvao;lineCounts[mi][t]=cr.length;}}
  const mdiv=document.getElementById('models');
  MODELS.forEach((m,i)=>{const b=document.createElement('button');b.textContent=m.name;if(i===0)b.classList.add('on');b.onclick=()=>{modelIdx=i;[...mdiv.children].forEach(x=>x.classList.remove('on'));b.classList.add('on');recenter();};mdiv.appendChild(b);});
  function recenter(){const m=parsed[modelIdx][Math.min(requestedTier,parsed[modelIdx].length-1)];let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];
    for(let i=0;i<m.positions.length;i+=3)for(let k=0;k<3;k++){const v=m.positions[i+k];if(v<mn[k])mn[k]=v;if(v>mx[k])mx[k]=v;}
    center=[(mn[0]+mx[0])/2,(mn[1]+mx[1])/2,(mn[2]+mx[2])/2];radius=Math.hypot(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])/2;dist=radius*3.0;}
  gl.enable(gl.DEPTH_TEST);
  const uMVP=gl.getUniformLocation(prog,'uMVP'),luMVP=gl.getUniformLocation(lineProg,'uMVP');
  let yaw=-0.6,pitch=-0.12,dist=3,spin=true;recenter();
  function resize(){const dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.max(1,canvas.clientWidth*dpr);canvas.height=Math.max(1,canvas.clientHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);}
  window.addEventListener('resize',resize);resize();
  let drag=false,lx=0,ly=0;
  canvas.addEventListener('pointerdown',e=>{drag=true;spin=false;document.getElementById('spin').classList.remove('on');lx=e.clientX;ly=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointerup',()=>drag=false);
  canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-lx)*0.008;pitch+=(e.clientY-ly)*0.008;pitch=Math.max(-1.4,Math.min(1.4,pitch));lx=e.clientX;ly=e.clientY;});
  canvas.addEventListener('wheel',e=>{e.preventDefault();dist*=Math.exp(e.deltaY*0.0011);dist=Math.max(radius*1.2,Math.min(radius*8,dist));},{passive:false});
  document.querySelectorAll('[data-tier]').forEach(b=>b.onclick=()=>{requestedTier=+b.dataset.tier;document.querySelectorAll('[data-tier]').forEach(x=>x.classList.remove('on'));b.classList.add('on');recenter();});
  document.getElementById('spin').onclick=e=>{spin=!spin;e.target.classList.toggle('on',spin);};
  document.getElementById('reset').onclick=()=>{yaw=-0.6;pitch=-0.12;spin=true;document.getElementById('spin').classList.add('on');recenter();};
  function frame(){if(spin)yaw+=0.003;const tier=Math.min(requestedTier,parsed[modelIdx].length-1);
    const eye=[center[0]+dist*Math.cos(pitch)*Math.sin(yaw),center[1]+dist*Math.sin(pitch),center[2]+dist*Math.cos(pitch)*Math.cos(yaw)];
    const proj=M.persp(0.6,canvas.width/canvas.height,radius*0.1,radius*20),mvp=M.mul(proj,M.look(eye,center,[0,1,0]));
    gl.clearColor(0.055,0.05,0.043,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(prog);gl.uniformMatrix4fv(uMVP,false,new Float32Array(mvp));gl.bindVertexArray(vaos[modelIdx][tier]);gl.drawElements(gl.TRIANGLES,counts[modelIdx][tier],gl.UNSIGNED_INT,0);
    gl.useProgram(lineProg);gl.uniformMatrix4fv(luMVP,false,new Float32Array(mvp));gl.bindVertexArray(lineVaos[modelIdx][tier]);gl.drawElements(gl.LINES,lineCounts[modelIdx][tier],gl.UNSIGNED_INT,0);
    requestAnimationFrame(frame);}
  frame();
}
</script></body></html>`;
}

function build() {
  const rose = [0, 1, 2].map((t) => tierGlb(roseWindowRuleset(), t, 'k3-rose'));
  const vault = [0, 1, 2].map((t) => tierGlb(vaultBayRuleset(), t, 'k3-vault'));
  const tracery = [0, 1, 2].map((t) => tierGlb(traceryFamiliesRuleset(), t, 'k3-tracery'));
  const chapel = [0, 1, 2].map((t) => tierGlb(evilChapelRuleset(), t, 'k3-chapel'));

  const files = [
    { file: 'rose-t2.glb', data: rose[2].glb }, { file: 'rose-t1.glb', data: rose[1].glb }, { file: 'rose-t0.glb', data: rose[0].glb },
    { file: 'vault-t2.glb', data: vault[2].glb }, { file: 'vault-t1.glb', data: vault[1].glb }, { file: 'vault-t0.glb', data: vault[0].glb },
    { file: 'tracery-families.glb', data: tracery[2].glb },
    { file: 'evil-chapel.glb', data: chapel[2].glb },
  ];
  const plate = (mesh, view, opts) => { const p = renderMeshPlate(mesh, { view, width: 900, height: 720, ss: 2, ...(opts || {}) }); return encodePng(p.width, p.height, p.rgb); };
  files.push({ file: 'plate-rose.png', data: plate(rose[2].mesh, 'axonNW') });
  files.push({ file: 'plate-vault.png', data: plate(vault[2].mesh, 'axonNW') });
  files.push({ file: 'plate-tracery.png', data: plate(tracery[2].mesh, 'westFront') });
  files.push({ file: 'plate-tone-gate.png', data: plate(chapel[2].mesh, 'axonNW') });

  // dressed cathedral: one shape, four skins (the reskin seam)
  const cath = buildArchMesh(cathedralRuleset(), { seedId: 'k1', tier: 2 });
  for (const skinId of ['stoneAshlar', 'timberVillage', 'marbleTemple', 'ruinedGothic']) {
    files.push({ file: `plate-cathedral-${skinId}.png`, data: plate(cath, 'axonNW', { roleAlbedo: skinRoleAlbedo(skinId) }) });
  }
  // material library swatch sheet
  files.push({ file: 'materials-swatches.png', data: materialsSheet(72).png });

  files.push({ file: 'index.html', data: viewerHtml([
    { name: 'rose window', tiers: rose }, { name: 'vault bay', tiers: vault },
    { name: 'tracery families', tiers: tracery }, { name: 'evil chapel', tiers: chapel },
  ]) });

  const stats = {
    roseT2: rose[2].mesh.triangleCount, vaultT2: vault[2].mesh.triangleCount, traceryT2: tracery[2].mesh.triangleCount, chapelT2: chapel[2].mesh.triangleCount,
    skins: Object.keys(SKINS).length, materials: MATERIAL_IDS.length,
  };
  return { files, stats };
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const { files, stats } = build();
  if (checkOnly) {
    let stale = 0;
    for (const em of files) {
      const path = join(OUT_DIR, em.file);
      if (!existsSync(path)) { console.error(`[k3] MISSING: ${path}`); stale++; continue; }
      if (typeof em.data === 'string') { if (readFileSync(path, 'utf8') !== em.data) { console.error(`[k3] STALE: ${path}`); stale++; } }
      else if (!bytesEqual(readFileSync(path), em.data)) { console.error(`[k3] STALE: ${path}`); stale++; }
    }
    if (stale > 0) process.exit(1);
    console.log('[k3] check OK -- committed exhibit matches a fresh deterministic build.');
    return;
  }
  mkdirSync(OUT_DIR, { recursive: true });
  for (const em of files) {
    const path = join(OUT_DIR, em.file);
    writeFileSync(path, em.data);
    const n = typeof em.data === 'string' ? Buffer.byteLength(em.data) : em.data.length;
    console.log(`[k3] emitted -> ${path} (${n} bytes)`);
  }
  console.log(JSON.stringify(stats));
}

main();
