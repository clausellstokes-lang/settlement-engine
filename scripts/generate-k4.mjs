/**
 * scripts/generate-k4.mjs -- K-4 EXHIBIT generator: the drift binding, made visible on a settlement block.
 *
 * Emits, from the pure dormant K-4 kernel (src/domain/townMap/arch/conditionParams.js -- THE SINGLE
 * WRITER of drift into geometry -- over the massing floor + the cathedral signature; imported by NOTHING
 * shipped, closure Delta 0), into public/landing-maps/k4-exhibit/:
 *   1. THE SETTLEMENT BLOCK at 3 LOD tiers (block-{glyph,commons,signature}.png): a coherent frontier
 *      settlement -- a war-scarred, morally-darkening, siege-remembered town -- rendered as a row of
 *      wards. ONE settlement dress (the coherence law) with per-ward local conditions: the cathedral
 *      carries the siege RELIEF BAND + macabre statuary, the keep carries WAR-DAMAGE struts, the other
 *      wards read their condition through the shared weathered dress. Drift geometry lands at SIGNATURE
 *      (glyph = massing silhouettes, byte-identical to the undrifted floor), which the 3-tier set makes
 *      explicit -- the LOD ladder the saliency budget enforces.
 *   2. PER-WARD drift plates (ward-*.png) -- each building close up, dressed by its own dressRoleAlbedo.
 *   3. GLBs -- each ward's drifted geometry + the merged block; a raw-WebGL2 viewer (orbit/zoom).
 *
 * DETERMINISM: every mesh/GLB/plate is pure (no clock, no rng, no trig); the script double-builds + asserts
 * byte identity before writing. Live WebGL pixels are device-dependent + NON-golden. Usage:
 *   node scripts/generate-k4.mjs [--check]
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodeGlb } from '../src/domain/townMap/arch/glb.js';
import { renderMeshPlate } from '../src/domain/townMap/arch/plate.js';
import { encodePng } from '../src/domain/townMap/arch/png.js';
import { cathedralRuleset } from '../src/domain/townMap/arch/rulesets/cathedral.js';
import { archetypeMassingRuleset } from '../src/domain/townMap/arch/archetypeMassing.js';
import { writeDriftedMesh } from '../src/domain/townMap/arch/conditionParams.js';
import { makeConditionVector } from '../src/domain/townMap/arch/params.js';
import { resolveSettlementDress, driftBuildingDress, dressRoleAlbedo } from '../src/domain/townMap/arch/settlementDress.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'landing-maps', 'k4-exhibit');
const SEED = 'k4-block', ANCHOR = 'frontier';

function bytesEqual(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
const eqF = (x, y) => x.length === y.length && x.every((v, i) => v === y[i]);
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
const glbOf = (m, gen) => encodeGlb({ positions: m.positions, normals: m.normals, indices: m.indices, vertexCount: m.vertexCount, min: m.min, max: m.max }, { ao: m.ao, generator: gen });

// ── THE SETTLEMENT: one coherent dress (war-scarred / darkening / siege-remembered) + per-ward locals ──
// corruptionCovert is omitted (the contract forces it to EXACTLY 0 -- covert never dresses the map).
const SETTLEMENT = { warScar: 0.35, patronAlignGood: 0.15, patronAlignLaw: 0.70, moral: 0.20, legitimacy: 0.60, prosperity: 0.70, corruptionRevealed: 0.10, historyMark: 6, patronEmblem: 9 };
/** the wards: id, archetype, footprint, height class, and the LOCAL condition delta over the settlement. */
const WARDS = [
  { id: 'cathedral', archetype: 'sacred', kind: 'cathedral', local: {} },                         // the signature: siege relief + macabre statuary
  { id: 'keep', archetype: 'martial', footprint: [150, 120], height: 'tall', local: { warScar: 0.95 } }, // the frontline: war-damage struts
  { id: 'guildhall', archetype: 'civic', footprint: [150, 110], height: 'mid', local: { prosperity: 0.8, corruptionRevealed: 0, warScar: 0.2 } },
  { id: 'mill', archetype: 'industrial', footprint: [120, 100], height: 'mid', local: {} },
  { id: 'market', archetype: 'mercantile', footprint: [160, 110], height: 'low', local: {} },
  { id: 'rowhouses', archetype: 'domestic', footprint: [140, 90], height: 'mid', local: {} },
];

/** build a ward's ruleset. @param {object} w @returns {object} */
function wardRuleset(w) {
  return w.kind === 'cathedral' ? cathedralRuleset() : archetypeMassingRuleset({ archetype: w.archetype, footprint: w.footprint, heightClass: w.height });
}
/** the ward's local conditionVector (settlement + local delta). @param {object} w @returns {object} */
function wardCv(w) { return makeConditionVector({ ...SETTLEMENT, ...w.local }); }

/** drift a ward at a tier, asserting double-build byte identity. @param {object} w @param {number} tier @returns {ReturnType<typeof writeDriftedMesh>} */
function driftWard(w, tier) {
  const opts = { seedId: SEED, anchorKey: `${ANCHOR}:${w.id}`, archetype: w.archetype, conditionVector: wardCv(w), tier };
  const a = writeDriftedMesh(wardRuleset(w), opts), b = writeDriftedMesh(wardRuleset(w), opts);
  if (!eqF(a.positions, b.positions) || !eqF(a.normals, b.normals) || !eqF(a.indices, b.indices) || !eqF(a.ao, b.ao)) {
    console.error(`[k4] NON-DETERMINISTIC ward ${w.id} tier ${tier}. Aborting.`); process.exit(1);
  }
  return a;
}

/** merge translated ward meshes into one scene mesh (for the block plate + the block GLB). @param {Array<{mesh:object,dx:number,dz:number}>} placements @returns {object} */
function mergeScene(placements) {
  /** @type {number[]} */ const positions = []; const normals = []; const indices = []; const ao = []; const triRole = []; const crease = [];
  let vOff = 0;
  for (const { mesh, dx, dz } of placements) {
    for (let i = 0; i < mesh.positions.length; i += 3) { positions.push(mesh.positions[i] + dx, mesh.positions[i + 1], mesh.positions[i + 2] + dz); }
    for (let i = 0; i < mesh.normals.length; i++) normals.push(mesh.normals[i]);
    for (let i = 0; i < mesh.indices.length; i++) indices.push(mesh.indices[i] + vOff);
    for (let i = 0; i < mesh.ao.length; i++) ao.push(mesh.ao[i]);
    for (let i = 0; i < mesh.triRole.length; i++) triRole.push(mesh.triRole[i]);
    for (let i = 0; i < mesh.creaseEdges.length; i++) crease.push(mesh.creaseEdges[i] + vOff);
    vOff += mesh.vertexCount;
  }
  const P = Float32Array.from(positions);
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < P.length; i += 3) for (let k = 0; k < 3; k++) { if (P[i + k] < min[k]) min[k] = P[i + k]; if (P[i + k] > max[k]) max[k] = P[i + k]; }
  return {
    positions: P, normals: Float32Array.from(normals), indices: Uint32Array.from(indices), ao: Float32Array.from(ao),
    triRole: Uint8Array.from(triRole), creaseEdges: Uint32Array.from(crease), vertexCount: vOff, triangleCount: indices.length / 3, min, max,
  };
}

/** lay the wards along x with a fixed gap between footprints (each ward's own origin is at 0). @param {number} tier @returns {Array<{w:object,mesh:object,dx:number,dz:number}>} */
function layout(tier) {
  const GAP = 90; let cursor = 0; const out = [];
  for (const w of WARDS) {
    const mesh = driftWard(w, tier);
    const width = mesh.max[0] - mesh.min[0];
    out.push({ w, mesh, dx: cursor - mesh.min[0], dz: -(mesh.max[2] + mesh.min[2]) / 2 });
    cursor += width + GAP;
  }
  return out;
}

function build() {
  const plate = (mesh, view, opts) => { const p = renderMeshPlate(mesh, { view, width: 1100, height: 640, ss: 2, ...(opts || {}) }); return encodePng(p.width, p.height, p.rgb); };
  const files = []; const stats = { wards: {}, block: {} };

  // the shared settlement albedo (the coherence law: one town, one weathered dress)
  const settlementDress = resolveSettlementDress(SEED, ANCHOR, makeConditionVector(SETTLEMENT));
  const blockAlbedo = dressRoleAlbedo(driftBuildingDress(settlementDress, 'sacred', makeConditionVector(SETTLEMENT)));

  // (1) THE BLOCK at 3 LOD tiers
  for (const [tier, name] of [[0, 'glyph'], [1, 'commons'], [2, 'signature']]) {
    const scene = mergeScene(layout(tier).map(({ mesh, dx, dz }) => ({ mesh, dx, dz })));
    files.push({ file: `block-${name}.png`, data: plate(scene, 'axonNW', { roleAlbedo: blockAlbedo }) });
    stats.block[name] = { tris: scene.triangleCount, verts: scene.vertexCount };
    if (tier === 2) files.push({ file: 'block.glb', data: glbOf(scene, 'k4-block') });
  }

  // (2) PER-WARD drift plates (each dressed by its own local condition) + (3) GLBs
  const viewerModels = [];
  {
    const sig = layout(2);
    // the whole block as the first viewer model
    viewerModels.push({ name: 'the block', glb: glbOf(mergeScene(sig.map(({ mesh, dx, dz }) => ({ mesh, dx, dz }))), 'k4-block'), mesh: mergeScene(sig.map(({ mesh, dx, dz }) => ({ mesh, dx, dz }))) });
    for (const { w, mesh } of sig) {
      const bldg = driftBuildingDress(settlementDress, w.archetype, wardCv(w));
      files.push({ file: `ward-${w.id}.png`, data: plate(mesh, 'axonNW', { roleAlbedo: dressRoleAlbedo(bldg) }) });
      files.push({ file: `ward-${w.id}.glb`, data: glbOf(mesh, `k4-${w.id}`) });
      stats.wards[w.id] = { archetype: w.archetype, tris: mesh.triangleCount, statuaryMode: bldg.statuaryMode, damageState: bldg.damageState, weathering: bldg.weathering, reliefMotif: bldg.reliefMotif };
      viewerModels.push({ name: w.id, glb: glbOf(mesh, `k4-${w.id}`), mesh });
    }
  }

  // the viewer
  files.push({ file: 'index.html', data: viewerHtml(viewerModels) });
  return { files, stats };
}

function viewerHtml(models) {
  const modelJs = models.map((m) => `{name:"${m.name}",glb:"${base64(m.glb)}",crease:"${u32b64(m.mesh.creaseEdges)}"}`).join(',');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>K-4 &mdash; the drift binding: a settlement block that remembers its history</title>
<style>
  :root{color-scheme:light dark}
  html,body{margin:0;height:100%;font:14px/1.5 -apple-system,system-ui,sans-serif}
  body{background:#0e0d0b;color:#e9e2d4;overflow:hidden}
  #c{position:fixed;inset:0;width:100vw;height:100vh;display:block;touch-action:none;cursor:grab}
  #c:active{cursor:grabbing}
  .panel{position:fixed;z-index:2;background:rgba(20,18,14,.72);border:1px solid rgba(200,180,120,.28);border-radius:10px;padding:12px 14px;backdrop-filter:blur(6px);max-width:380px}
  #info{top:14px;left:14px}#info h1{font-size:15px;margin:0 0 6px;color:#e7c98a}#info p{margin:4px 0;opacity:.85}
  .ctl{bottom:14px;left:14px}.ctl label{display:block;margin:6px 0 2px;opacity:.85;font-size:12.5px}
  button{font:inherit;color:#e9e2d4;background:rgba(90,78,52,.5);border:1px solid rgba(200,180,120,.35);border-radius:7px;padding:5px 10px;margin:2px 6px 2px 0;cursor:pointer}
  button.on{background:rgba(150,124,70,.75)}
  .err{position:fixed;inset:0;display:none;place-items:center;text-align:center;padding:24px;color:#f2c9a0}
</style></head><body>
<canvas id="c"></canvas>
<div id="info" class="panel"><h1>K-4 the drift binding &mdash; a settlement that remembers</h1>
<p>A war-scarred frontier town under a darkening, lawful patron with a remembered siege. The cathedral wears the siege as a relief band and macabre statuary; the keep wears war damage; every ward shares one weathered dress. Same seed &rarr; the same town, forever. Drag to orbit &middot; wheel to zoom.</p>
<p id="stats"></p></div>
<div class="ctl panel"><label>model</label><div id="models"></div>
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
let modelIdx=0,vaos=[],lineVaos=[],counts=[],lineCounts=[],center=[0,0,0],radius=1,prog,lineProg,parsed=[];
if(gl){
  const vs='#version 300 es\\nin vec3 aPos;in vec3 aNrm;in float aAO;uniform mat4 uMVP;out vec3 vN;out float vAO;void main(){vN=aNrm;vAO=aAO;gl_Position=uMVP*vec4(aPos,1.0);}';
  const fs='#version 300 es\\nprecision highp float;in vec3 vN;in float vAO;out vec4 o;void main(){vec3 N=normalize(vN);if(!gl_FrontFacing)N=-N;vec3 L1=normalize(vec3(-0.42,0.76,0.50)),L2=normalize(vec3(0.6,0.25,-0.4));float key=max(dot(N,L1),0.0),fill=max(dot(N,L2),0.0)*0.30,hemi=0.30+0.22*(N.y*0.5+0.5);vec3 stone=vec3(0.84,0.79,0.69),c=stone*(hemi+0.85*key+fill)*(0.4+0.6*vAO);c=pow(clamp(c,0.0,1.0),vec3(1.0/2.2));o=vec4(c,1.0);}';
  const lvs='#version 300 es\\nin vec3 aPos;uniform mat4 uMVP;void main(){gl_Position=uMVP*vec4(aPos,1.0);}';
  const lfs='#version 300 es\\nprecision highp float;out vec4 o;void main(){o=vec4(0.13,0.11,0.09,1.0);}';
  function sh(t,s){const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(x));return x;}
  function link(v,f){const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);return p;}
  try{prog=link(vs,fs);lineProg=link(lvs,lfs);}catch(e){fail('shader: '+e.message);}
  for(let mi=0;mi<MODELS.length;mi++){const m=parseGlb(b64ToBytes(MODELS[mi].glb));parsed[mi]=m;const cr=b64ToU32(MODELS[mi].crease);
    const vao=gl.createVertexArray();gl.bindVertexArray(vao);
    const mk=(d,loc,sz)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,d,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,sz,gl.FLOAT,false,0,0);};
    mk(m.positions,gl.getAttribLocation(prog,'aPos'),3);mk(m.normals,gl.getAttribLocation(prog,'aNrm'),3);mk(m.ao||new Float32Array(m.positions.length/3).fill(1),gl.getAttribLocation(prog,'aAO'),1);
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);
    vaos[mi]=vao;counts[mi]=m.indices.length;
    const lvao=gl.createVertexArray();gl.bindVertexArray(lvao);const lb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,lb);gl.bufferData(gl.ARRAY_BUFFER,m.positions,gl.STATIC_DRAW);
    gl.enableVertexAttribArray(gl.getAttribLocation(lineProg,'aPos'));gl.vertexAttribPointer(gl.getAttribLocation(lineProg,'aPos'),3,gl.FLOAT,false,0,0);
    const lib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,lib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,cr,gl.STATIC_DRAW);
    lineVaos[mi]=lvao;lineCounts[mi]=cr.length;}
  const mdiv=document.getElementById('models');
  MODELS.forEach((m,i)=>{const b=document.createElement('button');b.textContent=m.name;if(i===0)b.classList.add('on');b.onclick=()=>{modelIdx=i;[...mdiv.children].forEach(x=>x.classList.remove('on'));b.classList.add('on');recenter();};mdiv.appendChild(b);});
  function recenter(){const m=parsed[modelIdx];let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];
    for(let i=0;i<m.positions.length;i+=3)for(let k=0;k<3;k++){const v=m.positions[i+k];if(v<mn[k])mn[k]=v;if(v>mx[k])mx[k]=v;}
    center=[(mn[0]+mx[0])/2,(mn[1]+mx[1])/2,(mn[2]+mx[2])/2];radius=Math.hypot(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])/2;dist=radius*2.6;}
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
  document.getElementById('spin').onclick=e=>{spin=!spin;e.target.classList.toggle('on',spin);};
  document.getElementById('reset').onclick=()=>{yaw=-0.6;pitch=-0.12;spin=true;document.getElementById('spin').classList.add('on');recenter();};
  function frame(){if(spin)yaw+=0.003;
    const eye=[center[0]+dist*Math.cos(pitch)*Math.sin(yaw),center[1]+dist*Math.sin(pitch),center[2]+dist*Math.cos(pitch)*Math.cos(yaw)];
    const proj=M.persp(0.6,canvas.width/canvas.height,radius*0.1,radius*20),mvp=M.mul(proj,M.look(eye,center,[0,1,0]));
    gl.clearColor(0.055,0.05,0.043,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(prog);gl.uniformMatrix4fv(uMVP,false,new Float32Array(mvp));gl.bindVertexArray(vaos[modelIdx]);gl.drawElements(gl.TRIANGLES,counts[modelIdx],gl.UNSIGNED_INT,0);
    gl.useProgram(lineProg);gl.uniformMatrix4fv(luMVP,false,new Float32Array(mvp));gl.bindVertexArray(lineVaos[modelIdx]);gl.drawElements(gl.LINES,lineCounts[modelIdx],gl.UNSIGNED_INT,0);
    requestAnimationFrame(frame);}
  frame();
}
</script></body></html>`;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const { files, stats } = build();
  if (checkOnly) {
    let stale = 0;
    for (const em of files) {
      const path = join(OUT_DIR, em.file);
      if (!existsSync(path)) { console.error(`[k4] MISSING: ${path}`); stale++; continue; }
      if (typeof em.data === 'string') { if (readFileSync(path, 'utf8') !== em.data) { console.error(`[k4] STALE: ${path}`); stale++; } }
      else if (!bytesEqual(readFileSync(path), em.data)) { console.error(`[k4] STALE: ${path}`); stale++; }
    }
    if (stale > 0) process.exit(1);
    console.log('[k4] check OK -- committed exhibit matches a fresh deterministic build.');
    return;
  }
  mkdirSync(OUT_DIR, { recursive: true });
  for (const em of files) {
    const path = join(OUT_DIR, em.file);
    writeFileSync(path, em.data);
    const n = typeof em.data === 'string' ? Buffer.byteLength(em.data) : em.data.length;
    console.log(`[k4] emitted -> ${path} (${n} bytes)`);
  }
  console.log(JSON.stringify(stats, null, 2));
}

main();
