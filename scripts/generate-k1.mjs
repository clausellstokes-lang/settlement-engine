/**
 * scripts/generate-k1.mjs -- K-1 EXHIBIT generator: the grammar cathedral, three tiers, viewable.
 *
 * Emits, from the pure dormant K-1 grammar kernel (src/domain/townMap/arch/*, imported by NOTHING
 * shipped -- closure Delta 0), into public/landing-maps/k1-exhibit/:
 *   1. cathedral-t2.glb / t1 / t0   -- deterministic GLBs (POSITION+NORMAL+_AO) of the 3 LOD tiers.
 *   2. buttress-grammar.glb          -- the byte-parity fragment (grammar == direct arch build).
 *   3. plate-{axonNW,westFront,southElev}.png -- the CPU PLATE triptych of the signature tier.
 *   4. index.html                    -- a SELF-CONTAINED raw-WebGL2 viewer (zero deps, file://):
 *      orbit/zoom, a LOD-tier switcher, the AO attribute wired into shading, a CREASE INK-LINE pass,
 *      and the K-5 qualityLevel HOOK (render-res scale + ink-pass + LOD bias off ONE scalar).
 *
 * DETERMINISM: the mesh/GLB/plate are pure (no clock, no rng); the script double-builds + asserts
 * byte identity before writing (the golden). The live WebGL pixels are device-dependent + NON-GOLDEN.
 * The qualityLevel hook is VIEW-ONLY -- it never touches the geometry, GLB, or plate.
 *
 * Usage: node scripts/generate-k1.mjs [--check]
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildArchMesh } from '../src/domain/townMap/arch/emitter.js';
import { encodeGlb } from '../src/domain/townMap/arch/glb.js';
import { renderMeshPlate } from '../src/domain/townMap/arch/plate.js';
import { encodePng } from '../src/domain/townMap/arch/png.js';
import { cathedralRuleset } from '../src/domain/townMap/arch/rulesets/cathedral.js';
import { buttressRuleset } from '../src/domain/townMap/arch/rulesets/buttressFragment.js';
import { interpret } from '../src/domain/townMap/arch/interpreter.js';
import { emitMesh } from '../src/domain/townMap/arch/emitter.js';
import { buildButtressDirect } from '../src/domain/townMap/arch/rulesets/buttressFragment.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'landing-maps', 'k1-exhibit');

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
/** base64 of a Uint32Array's bytes (little-endian). */
function u32b64(arr) { const b = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength); return base64(b); }

/** double-build a ruleset+tier -> GLB(with AO) + the mesh, asserting byte identity. */
function tierGlb(ruleset, tier) {
  const a = buildArchMesh(ruleset, { seedId: 'k1', tier });
  const b = buildArchMesh(ruleset, { seedId: 'k1', tier });
  const eqF = (x, y) => x.length === y.length && x.every((v, i) => v === y[i]);
  if (!eqF(a.positions, b.positions) || !eqF(a.normals, b.normals) || !eqF(a.indices, b.indices) || !eqF(a.ao, b.ao)) {
    console.error(`[k1] NON-DETERMINISTIC mesh at tier ${tier}. Aborting.`); process.exit(1);
  }
  const geo = { positions: a.positions, normals: a.normals, indices: a.indices, vertexCount: a.vertexCount, min: a.min, max: a.max };
  const glbA = encodeGlb(geo, { ao: a.ao, generator: 'k1-arch-grammar' });
  const glbB = encodeGlb(geo, { ao: a.ao, generator: 'k1-arch-grammar' });
  if (!bytesEqual(glbA, glbB)) { console.error(`[k1] NON-DETERMINISTIC GLB at tier ${tier}. Aborting.`); process.exit(1); }
  return { mesh: a, glb: glbA };
}

function viewerHtml(tiers, creaseB64, stats) {
  const glbsJs = tiers.map((t) => `"${base64(t.glb)}"`).join(',');
  const creaseJs = creaseB64.map((c) => `"${c}"`).join(',');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>K-1 &mdash; the grammar cathedral (deterministic mesh, 3 LOD tiers)</title>
<style>
  :root { color-scheme: light dark; }
  html,body { margin:0; height:100%; font:14px/1.5 -apple-system,system-ui,sans-serif; }
  body { background:#0e0d0b; color:#e9e2d4; overflow:hidden; }
  #c { position:fixed; inset:0; width:100vw; height:100vh; display:block; touch-action:none; cursor:grab; }
  #c:active { cursor:grabbing; }
  .panel { position:fixed; z-index:2; background:rgba(20,18,14,.72); border:1px solid rgba(200,180,120,.28);
    border-radius:10px; padding:12px 14px; backdrop-filter:blur(6px); max-width:360px; }
  #info { top:14px; left:14px; }
  #info h1 { font-size:15px; margin:0 0 6px; color:#e7c98a; }
  #info p { margin:4px 0; opacity:.85; }
  #info b { color:#f0e6cf; }
  .ctl { bottom:14px; left:14px; }
  .ctl label { display:block; margin:6px 0 2px; opacity:.85; font-size:12.5px; }
  button { font:inherit; color:#e9e2d4; background:rgba(90,78,52,.5); border:1px solid rgba(200,180,120,.35);
    border-radius:7px; padding:5px 10px; margin:2px 6px 2px 0; cursor:pointer; }
  button.on { background:rgba(150,124,70,.75); }
  input[type=range] { width:220px; vertical-align:middle; }
  .err { position:fixed; inset:0; display:none; place-items:center; text-align:center; padding:24px; color:#f2c9a0; }
</style></head><body>
<canvas id="c"></canvas>
<div id="info" class="panel">
  <h1>Grammar cathedral &mdash; full 3D structure</h1>
  <p>A deterministic, byte-reproducible mesh emitted by the K-1 shape-grammar. Drag to orbit &middot; wheel to zoom. Per-vertex baked AO + engraved crease ink lines travel with the geometry, so every machine sees the same occlusion + linework; only the raw pixels are your GPU's.</p>
  <p id="stats"><b>${stats.t2tri.toLocaleString()}</b> triangles (signature) &middot; GLB <b>${(stats.t2glb / 1024).toFixed(0)} kB</b> &middot; ${stats.roles} material roles</p>
</div>
<div class="ctl panel">
  <label>LOD tier</label>
  <div><button data-tier="2" class="on">signature</button><button data-tier="1">commons</button><button data-tier="0">glyph</button></div>
  <label>qualityLevel (K-5 governor hook) &mdash; <span id="qv">1.00</span></label>
  <input id="q" type="range" min="0.3" max="1" step="0.02" value="1">
  <div style="margin-top:6px"><button id="spin" class="on">auto-orbit</button><button id="reset">reset</button></div>
</div>
<div id="err" class="err"></div>
<script>
const GLBS = [${glbsJs}];       // [tier0, tier1, tier2] base64 GLB (POSITION/NORMAL/_AO)
const CREASE = [${creaseJs}];   // [tier0, tier1, tier2] base64 Uint32 crease-edge index
function b64ToBytes(s){ const bin=atob(s); const a=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i); return a; }
function b64ToU32(s){ const b=b64ToBytes(s); return new Uint32Array(b.buffer, b.byteOffset, b.byteLength/4); }
function parseGlb(bytes){
  const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(dv.getUint32(0,true)!==0x46546c67) throw new Error('not a GLB');
  let off=12, json=null, bin=null;
  while(off<bytes.byteLength){ const len=dv.getUint32(off,true), type=dv.getUint32(off+4,true); off+=8;
    const chunk=bytes.subarray(off,off+len); off+=len;
    if(type===0x4e4f534a) json=JSON.parse(new TextDecoder().decode(chunk)); else if(type===0x004e4942) bin=chunk; }
  const acc=(i)=>{ const a=json.accessors[i], bv=json.bufferViews[a.bufferView]; const base=(bv.byteOffset||0);
    const comp=a.type==='VEC3'?3:1, n=a.count*comp;
    if(a.componentType===5126) return new Float32Array(bin.buffer, bin.byteOffset+base, n);
    return new Uint32Array(bin.buffer, bin.byteOffset+base, n); };
  const prim=json.meshes[0].primitives[0];
  const ao = prim.attributes._AO!==undefined ? acc(prim.attributes._AO) : null;
  return { positions:acc(prim.attributes.POSITION), normals:acc(prim.attributes.NORMAL), indices:acc(prim.indices), ao };
}
const canvas=document.getElementById('c'); const gl=canvas.getContext('webgl2',{antialias:true});
function fail(msg){ const e=document.getElementById('err'); e.style.display='grid'; e.textContent=msg; }
if(!gl){ fail('WebGL2 is unavailable in this browser.'); }

// ── THE K-5 QUALITY HOOK: one scalar the LOD bias + optional passes READ (view-only, never geometry) ──
let qualityLevel = 1.0;
function lodTierFor(requested){ // qualityLevel biases the shown tier downward under load
  if(qualityLevel < 0.5 && requested>0) return requested-1;
  if(qualityLevel < 0.4 && requested>1) return 0;
  return requested;
}
function inkEnabled(){ return qualityLevel >= 0.55; }      // the crease ink-line pass is an optional pass
function resScale(){ return 0.6 + 0.4*qualityLevel; }       // dynamic render-resolution scale

function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function nrm(a){const m=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/m,a[1]/m,a[2]/m];}
const M={ persp:(fy,a,n,f)=>{const t=1/Math.tan(fy/2),nf=1/(n-f);return[t/a,0,0,0,0,t,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0];},
  look:(e,c,u)=>{const z=nrm(sub(e,c)),x=nrm(cross(u,z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,e),-dot(y,e),-dot(z,e),1];},
  mul:(a,b)=>{const o=new Array(16);for(let r=0;r<4;r++)for(let c=0;c<4;c++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;} };

let requestedTier=2, meshes=[], creases=[], center=[0,0,0], radius=1;
let prog, lineProg, vaos=[], lineVaos=[], counts=[], lineCounts=[];
if(gl){
  const vs=\`#version 300 es
  in vec3 aPos; in vec3 aNrm; in float aAO; uniform mat4 uMVP; out vec3 vN; out float vAO;
  void main(){ vN=aNrm; vAO=aAO; gl_Position=uMVP*vec4(aPos,1.0); }\`;
  const fs=\`#version 300 es
  precision highp float; in vec3 vN; in float vAO; out vec4 o; uniform vec3 uEye;
  void main(){ vec3 N=normalize(vN); if(!gl_FrontFacing) N=-N;
    vec3 L1=normalize(vec3(-0.42,0.76,0.50)); vec3 L2=normalize(vec3(0.6,0.25,-0.4));
    float key=max(dot(N,L1),0.0); float fill=max(dot(N,L2),0.0)*0.30; float hemi=0.30+0.22*(N.y*0.5+0.5);
    vec3 stone=vec3(0.84,0.79,0.69); vec3 c=stone*(hemi+0.85*key+fill)*(0.4+0.6*vAO);
    c=pow(clamp(c,0.0,1.0),vec3(1.0/2.2)); o=vec4(c,1.0); }\`;
  const lvs=\`#version 300 es
  in vec3 aPos; uniform mat4 uMVP; void main(){ gl_Position=uMVP*vec4(aPos,1.0); }\`;
  const lfs=\`#version 300 es
  precision highp float; out vec4 o; void main(){ o=vec4(0.13,0.11,0.09,1.0); }\`;
  function sh(t,src){const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
  function link(v,f){const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);return p;}
  try{ prog=link(vs,fs); lineProg=link(lvs,lfs); }catch(e){ fail('shader: '+e.message); }

  for(let t=0;t<GLBS.length;t++){
    const m=parseGlb(b64ToBytes(GLBS[t])); meshes[t]=m; creases[t]=b64ToU32(CREASE[t]);
    const vao=gl.createVertexArray(); gl.bindVertexArray(vao);
    const mk=(data,loc,size)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);};
    mk(m.positions,gl.getAttribLocation(prog,'aPos'),3); mk(m.normals,gl.getAttribLocation(prog,'aNrm'),3);
    mk(m.ao||new Float32Array(m.positions.length/3).fill(1),gl.getAttribLocation(prog,'aAO'),1);
    const ib=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);
    vaos[t]=vao; counts[t]=m.indices.length;
    const lvao=gl.createVertexArray(); gl.bindVertexArray(lvao);
    const lb=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,lb); gl.bufferData(gl.ARRAY_BUFFER,m.positions,gl.STATIC_DRAW);
    gl.enableVertexAttribArray(gl.getAttribLocation(lineProg,'aPos')); gl.vertexAttribPointer(gl.getAttribLocation(lineProg,'aPos'),3,gl.FLOAT,false,0,0);
    const lib=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,lib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,creases[t],gl.STATIC_DRAW);
    lineVaos[t]=lvao; lineCounts[t]=creases[t].length;
  }
  const m2=meshes[2]; let mn=[1e9,1e9,1e9], mx=[-1e9,-1e9,-1e9];
  for(let i=0;i<m2.positions.length;i+=3)for(let k=0;k<3;k++){const v=m2.positions[i+k];if(v<mn[k])mn[k]=v;if(v>mx[k])mx[k]=v;}
  center=[(mn[0]+mx[0])/2,(mn[1]+mx[1])/2,(mn[2]+mx[2])/2]; radius=Math.hypot(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])/2;
  gl.enable(gl.DEPTH_TEST);
  const uMVP=gl.getUniformLocation(prog,'uMVP'), luMVP=gl.getUniformLocation(lineProg,'uMVP');

  let yaw=-0.55, pitch=-0.10, dist=radius*3.0, spin=true;
  const start={yaw:-0.55,pitch:-0.10,dist:radius*3.0};
  function resize(){const dpr=Math.min(2,(window.devicePixelRatio||1))*resScale();
    canvas.width=Math.max(1,canvas.clientWidth*dpr); canvas.height=Math.max(1,canvas.clientHeight*dpr); gl.viewport(0,0,canvas.width,canvas.height);}
  window.addEventListener('resize',resize); resize();
  let drag=false,lx=0,ly=0;
  canvas.addEventListener('pointerdown',e=>{drag=true;spin=false;document.getElementById('spin').classList.remove('on');lx=e.clientX;ly=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointerup',()=>drag=false);
  canvas.addEventListener('pointermove',e=>{ if(!drag)return; yaw+=(e.clientX-lx)*0.008; pitch+=(e.clientY-ly)*0.008; pitch=Math.max(-1.4,Math.min(1.4,pitch)); lx=e.clientX; ly=e.clientY; });
  canvas.addEventListener('wheel',e=>{e.preventDefault(); dist*=Math.exp(e.deltaY*0.0011); dist=Math.max(radius*1.2,Math.min(radius*8,dist));},{passive:false});
  document.querySelectorAll('[data-tier]').forEach(b=>b.onclick=()=>{ requestedTier=+b.dataset.tier; document.querySelectorAll('[data-tier]').forEach(x=>x.classList.remove('on')); b.classList.add('on'); });
  document.getElementById('q').oninput=(e)=>{ qualityLevel=+e.target.value; document.getElementById('qv').textContent=qualityLevel.toFixed(2); resize(); };
  document.getElementById('spin').onclick=(e)=>{spin=!spin; e.target.classList.toggle('on',spin);};
  document.getElementById('reset').onclick=()=>{yaw=start.yaw;pitch=start.pitch;dist=start.dist;spin=true;document.getElementById('spin').classList.add('on');};

  function frame(){
    if(spin) yaw+=0.0030;
    const tier=lodTierFor(requestedTier);
    const eye=[center[0]+dist*Math.cos(pitch)*Math.sin(yaw), center[1]+dist*Math.sin(pitch), center[2]+dist*Math.cos(pitch)*Math.cos(yaw)];
    const proj=M.persp(0.6, canvas.width/canvas.height, radius*0.1, radius*20);
    const mvp=M.mul(proj, M.look(eye,center,[0,1,0]));
    gl.clearColor(0.055,0.05,0.043,1); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(prog); gl.uniformMatrix4fv(uMVP,false,new Float32Array(mvp));
    gl.bindVertexArray(vaos[tier]); gl.drawElements(gl.TRIANGLES,counts[tier],gl.UNSIGNED_INT,0);
    if(inkEnabled()){ gl.useProgram(lineProg); gl.uniformMatrix4fv(luMVP,false,new Float32Array(mvp));
      gl.bindVertexArray(lineVaos[tier]); gl.drawElements(gl.LINES,lineCounts[tier],gl.UNSIGNED_INT,0); }
    requestAnimationFrame(frame);
  }
  frame();
}
</script>
</body></html>
`;
}

function build() {
  // byte-parity fragment: grammar vs direct must match
  const eqF = (x, y) => x.length === y.length && x.every((v, i) => v === y[i]);
  const bg = emitMesh(interpret(buttressRuleset(20, 49, 1), { seedId: 'k1', tier: 2 }).terminals);
  const bd = buildButtressDirect(20, 49, 1);
  const parity = eqF(bg.positions, bd.positions) && eqF(bg.normals, bd.normals) && eqF(bg.indices, bd.indices);
  if (!parity) { console.error('[k1] BYTE-PARITY FAILED: grammar buttress != direct build. Aborting.'); process.exit(1); }
  const buttressGlb = encodeGlb({ positions: bg.positions, normals: bg.normals, indices: bg.indices, vertexCount: bg.vertexCount, min: bg.min, max: bg.max }, { ao: bg.ao, generator: 'k1-buttress-grammar' });

  const rs = cathedralRuleset();
  const t0 = tierGlb(rs, 0), t1 = tierGlb(rs, 1), t2 = tierGlb(rs, 2);
  const plates = ['axonNW', 'westFront', 'southElev'].map((view) => {
    const p = renderMeshPlate(t2.mesh, { view, width: 900, height: 720, ss: 2 });
    return { view, png: encodePng(p.width, p.height, p.rgb) };
  });
  const creaseB64 = [t0, t1, t2].map((t) => u32b64(t.mesh.creaseEdges));
  const html = viewerHtml([t0, t1, t2], creaseB64, {
    t2tri: t2.mesh.triangleCount, t2glb: t2.glb.length, roles: new Set(t2.mesh.roleRanges.map((r) => r.role)).size,
  });
  const files = [
    { file: 'cathedral-t2.glb', data: t2.glb }, { file: 'cathedral-t1.glb', data: t1.glb }, { file: 'cathedral-t0.glb', data: t0.glb },
    { file: 'buttress-grammar.glb', data: buttressGlb },
    { file: 'index.html', data: html },
  ];
  for (const p of plates) files.push({ file: `plate-${p.view}.png`, data: p.png });
  const stats = {
    parity, t0: t0.mesh.triangleCount, t1: t1.mesh.triangleCount, t2: t2.mesh.triangleCount,
    t2verts: t2.mesh.vertexCount, draws: t2.mesh.roleRanges.length, glb: t2.glb.length,
    meters2: t2.mesh.meters,
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
      if (!existsSync(path)) { console.error(`[k1] MISSING: ${path}`); stale++; continue; }
      if (typeof em.data === 'string') { if (readFileSync(path, 'utf8') !== em.data) { console.error(`[k1] STALE: ${path}`); stale++; } }
      else if (!bytesEqual(readFileSync(path), em.data)) { console.error(`[k1] STALE: ${path}`); stale++; }
    }
    if (stale > 0) process.exit(1);
    console.log('[k1] check OK -- committed exhibit matches a fresh deterministic build.');
    return;
  }
  mkdirSync(OUT_DIR, { recursive: true });
  for (const em of files) {
    const path = join(OUT_DIR, em.file);
    writeFileSync(path, em.data);
    const n = typeof em.data === 'string' ? Buffer.byteLength(em.data) : em.data.length;
    console.log(`[k1] emitted -> ${path} (${n} bytes)`);
  }
  console.log(JSON.stringify(stats));
}

main();
