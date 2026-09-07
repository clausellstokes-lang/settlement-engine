/**
 * scripts/generate-k0b.mjs -- K-0b EXHIBIT generator: the rotatable high-fidelity gothic structure.
 *
 * Emits, from the pure dormant arch/ mesh spike (src/domain/townMap/arch/*, imported by NOTHING
 * shipped -- closure Delta 0), the K-0b deliverables into public/landing-maps/k0b-exhibit/:
 *   1. gothic-bay.glb   -- the deterministic binary glTF of the 3D nave-bay mesh (the PORTABLE
 *      form of the geometry TRUTH; byte-reproducible, `cmp`-clean on a double run).
 *   2. index.html       -- a SELF-CONTAINED raw-WebGL2 viewer (zero npm deps, works from file://):
 *      orbit / rotate / zoom the structure with real-time Lambert+hemispheric shading. The GLB is
 *      embedded (base64) and parsed in-page, so the viewer also proves the GLB loads.
 *   3. still-oblique.png / still-front.png -- deterministic CPU-rendered stills of the SAME mesh
 *      (z-buffered, flat-shaded) for the manager to screenshot without a GPU.
 *
 * DETERMINISM: buildCathedralSection + encodeGlb are pure -- no clock, no rng. This script renders
 * the mesh + GLB TWICE and asserts byte-identity before writing (the geometry golden). The live
 * WebGL pixels are device-dependent and NON-GOLDEN by design (a view, not the truth); the committed
 * FILES are all deterministic on this engine and `--check` re-derives + diffs them (exit 1 if stale).
 *
 * Usage:
 *   node scripts/generate-k0b.mjs          # emit the exhibit
 *   node scripts/generate-k0b.mjs --check   # verify only (exit 1 if stale / non-deterministic)
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCathedralSection } from '../src/domain/townMap/arch/cathedralSection.js';
import { encodeGlb } from '../src/domain/townMap/arch/glb.js';
import { encodePng } from '../src/domain/townMap/arch/png.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'landing-maps', 'k0b-exhibit');
const GLB = 'gothic-bay.glb';
const HTML = 'index.html';
const STILL_A = 'still-oblique.png';
const STILL_B = 'still-front.png';

// ── small deterministic mat4 + vec3 (build-time only; trig allowed here -- these pixels are
//    a NON-GOLDEN preview, not the geometry truth) ────────────────────────────────────────────
const v3 = {
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  norm: (a) => { const m = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / m, a[1] / m, a[2] / m]; },
};
function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
}
function lookAt(eye, center, up) {
  const z = v3.norm(v3.sub(eye, center));
  const x = v3.norm(v3.cross(up, z));
  const y = v3.cross(z, x);
  return [
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -v3.dot(x, eye), -v3.dot(y, eye), -v3.dot(z, eye), 1,
  ];
}
function mul(a, b) {
  const o = new Array(16);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    o[c * 4 + r] = a[0 * 4 + r] * b[c * 4 + 0] + a[1 * 4 + r] * b[c * 4 + 1] + a[2 * 4 + r] * b[c * 4 + 2] + a[3 * 4 + r] * b[c * 4 + 3];
  }
  return o;
}
function apply(mtx, p) {
  const x = p[0], y = p[1], z = p[2];
  const o = [
    mtx[0] * x + mtx[4] * y + mtx[8] * z + mtx[12],
    mtx[1] * x + mtx[5] * y + mtx[9] * z + mtx[13],
    mtx[2] * x + mtx[6] * y + mtx[10] * z + mtx[14],
    mtx[3] * x + mtx[7] * y + mtx[11] * z + mtx[15],
  ];
  return o;
}

/**
 * Deterministic CPU still of the mesh: z-buffered, flat-shaded, 2x supersampled. A build-time
 * preview -- NON-GOLDEN by policy, but reproducible on this engine so --check can diff it.
 */
function renderStill(geo, W, H, eye, center) {
  const SS = 2, w = W * SS, h = H * SS;
  const proj = perspective(0.62, w / h, 1, 4000);
  const view = lookAt(eye, center, [0, 1, 0]);
  const mvp = mul(proj, view);
  const eyeV = eye;
  const depth = new Float32Array(w * h).fill(Infinity);
  const rgb = new Uint8Array(w * h * 3);
  // sky gradient background
  for (let y = 0; y < h; y++) {
    const t = y / h;
    const r = 208 - 70 * t, g = 214 - 60 * t, b = 224 - 44 * t;
    for (let x = 0; x < w; x++) { const o = (y * w + x) * 3; rgb[o] = r; rgb[o + 1] = g; rgb[o + 2] = b; }
  }
  const L = v3.norm([-0.5, 0.82, 0.62]);
  const pos = geo.positions, idx = geo.indices;
  const scr = new Array(geo.vertexCount);
  const clip = new Array(geo.vertexCount);
  for (let i = 0; i < geo.vertexCount; i++) {
    const c = apply(mvp, [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]]);
    clip[i] = c;
    const iw = 1 / c[3];
    scr[i] = [(c[0] * iw * 0.5 + 0.5) * w, (1 - (c[1] * iw * 0.5 + 0.5)) * h, c[2] * iw];
  }
  for (let t = 0; t < idx.length; t += 3) {
    const ia = idx[t], ib = idx[t + 1], ic = idx[t + 2];
    if (clip[ia][3] <= 0 || clip[ib][3] <= 0 || clip[ic][3] <= 0) continue;
    const A = scr[ia], B = scr[ib], C = scr[ic];
    // world-space face normal + backface cull
    const wa = [pos[ia * 3], pos[ia * 3 + 1], pos[ia * 3 + 2]];
    const wb = [pos[ib * 3], pos[ib * 3 + 1], pos[ib * 3 + 2]];
    const wc = [pos[ic * 3], pos[ic * 3 + 1], pos[ic * 3 + 2]];
    const nrm = v3.norm(v3.cross(v3.sub(wb, wa), v3.sub(wc, wa)));
    const cen = [(wa[0] + wb[0] + wc[0]) / 3, (wa[1] + wb[1] + wc[1]) / 3, (wa[2] + wb[2] + wc[2]) / 3];
    if (v3.dot(nrm, v3.sub(eyeV, cen)) < 0) continue; // facing away
    // shade (hemispheric ambient + key Lambert), gamma via pow (build-time preview)
    const lam = Math.max(0, v3.dot(nrm, L));
    const hemi = 0.28 + 0.22 * (nrm[1] * 0.5 + 0.5);
    const stone = [0.83, 0.78, 0.68];
    const shade = hemi + 0.85 * lam;
    const col = stone.map((c) => Math.min(255, Math.round(255 * Math.pow(Math.min(1, c * shade), 1 / 2.2))));
    // triangle raster (barycentric)
    const minX = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0])));
    const maxX = Math.min(w - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
    const minY = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1])));
    const maxY = Math.min(h - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
    const area = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    if (area === 0) continue;
    const ia2 = 1 / area;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const px = x + 0.5, py = y + 0.5;
        const w0 = ((B[0] - px) * (C[1] - py) - (B[1] - py) * (C[0] - px)) * ia2;
        const w1 = ((C[0] - px) * (A[1] - py) - (C[1] - py) * (A[0] - px)) * ia2;
        const w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        const z = w0 * A[2] + w1 * B[2] + w2 * C[2];
        const di = y * w + x;
        if (z >= depth[di]) continue;
        depth[di] = z;
        const o = di * 3; rgb[o] = col[0]; rgb[o + 1] = col[1]; rgb[o + 2] = col[2];
      }
    }
  }
  // box-downsample SS -> 1
  const out = new Uint8Array(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let r = 0, g = 0, b = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
      const o = ((y * SS + sy) * w + (x * SS + sx)) * 3; r += rgb[o]; g += rgb[o + 1]; b += rgb[o + 2];
    }
    const n = SS * SS, oo = (y * W + x) * 3;
    out[oo] = Math.round(r / n); out[oo + 1] = Math.round(g / n); out[oo + 2] = Math.round(b / n);
  }
  return encodePng(W, H, out);
}

/** standard base64 of a byte array (pure). */
function base64(bytes) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '', i = 0;
  for (; i + 3 <= bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + A[(n >> 6) & 63] + A[n & 63];
  }
  const rem = bytes.length - i;
  if (rem === 1) { const n = bytes[i] << 16; out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + '=='; }
  else if (rem === 2) { const n = (bytes[i] << 16) | (bytes[i + 1] << 8); out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + A[(n >> 6) & 63] + '='; }
  return out;
}

function bytesEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function viewerHtml(glbB64, stats) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>K-0b &mdash; the rotatable gothic bay (deterministic mesh)</title>
<style>
  :root { color-scheme: light dark; }
  html,body { margin:0; height:100%; font:14px/1.5 -apple-system,system-ui,sans-serif; }
  body { background:#0e0d0b; color:#e9e2d4; overflow:hidden; }
  #c { position:fixed; inset:0; width:100vw; height:100vh; display:block; touch-action:none; cursor:grab; }
  #c:active { cursor:grabbing; }
  .panel { position:fixed; z-index:2; background:rgba(20,18,14,.72); border:1px solid rgba(200,180,120,.28);
    border-radius:10px; padding:12px 14px; backdrop-filter:blur(6px); max-width:340px; }
  #info { top:14px; left:14px; }
  #info h1 { font-size:15px; margin:0 0 6px; color:#e7c98a; }
  #info p { margin:4px 0; opacity:.85; }
  #info b { color:#f0e6cf; }
  .hint { top:14px; right:14px; text-align:right; font-size:12.5px; opacity:.9; }
  button { font:inherit; color:#e9e2d4; background:rgba(90,78,52,.5); border:1px solid rgba(200,180,120,.35);
    border-radius:7px; padding:5px 10px; margin:2px 0 0 6px; cursor:pointer; }
  button:hover { background:rgba(120,104,66,.6); }
  .err { position:fixed; inset:0; display:none; place-items:center; text-align:center; padding:24px; color:#f2c9a0; }
</style></head><body>
<canvas id="c"></canvas>
<div id="info" class="panel">
  <h1>Gothic nave bay &mdash; full 3D structure</h1>
  <p>A deterministic, byte-reproducible mesh. Drag to orbit &middot; wheel to zoom &middot; the live pixels are your GPU's; the geometry is the pinned truth.</p>
  <p><b>${stats.tri.toLocaleString()}</b> triangles &middot; <b>${stats.vtx.toLocaleString()}</b> vertices &middot; GLB <b>${(stats.glb / 1024).toFixed(0)} kB</b></p>
  <p>Every curve is a cubic B&eacute;zier; the 7-fold rose sits on a pinned non-constructible table. Zero trig, zero GPU in the geometry.</p>
  <div><button id="spin">pause spin</button><button id="reset">reset view</button></div>
</div>
<div class="hint panel">drag &middot; scroll &middot; auto-orbit</div>
<div id="err" class="err"></div>
<script>
const GLB_B64 = "${glbB64}";
function b64ToBytes(s){ const bin=atob(s); const a=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i); return a; }
function parseGlb(bytes){
  const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(dv.getUint32(0,true)!==0x46546c67) throw new Error('not a GLB');
  let off=12, json=null, bin=null;
  while(off<bytes.byteLength){
    const len=dv.getUint32(off,true), type=dv.getUint32(off+4,true); off+=8;
    const chunk=bytes.subarray(off,off+len); off+=len;
    if(type===0x4e4f534a) json=JSON.parse(new TextDecoder().decode(chunk));
    else if(type===0x004e4942) bin=chunk;
  }
  const acc=(i)=>{ const a=json.accessors[i], bv=json.bufferViews[a.bufferView];
    const base=(bv.byteOffset||0); const n=a.count*(a.type==='VEC3'?3:1);
    if(a.componentType===5126) return new Float32Array(bin.buffer, bin.byteOffset+base, n);
    return new Uint32Array(bin.buffer, bin.byteOffset+base, n); };
  const prim=json.meshes[0].primitives[0];
  return { positions:acc(prim.attributes.POSITION), normals:acc(prim.attributes.NORMAL), indices:acc(prim.indices) };
}
// ── minimal mat4 ──
const M={
  persp:(fy,a,n,f)=>{const t=1/Math.tan(fy/2),nf=1/(n-f);return[t/a,0,0,0, 0,t,0,0, 0,0,(f+n)*nf,-1, 0,0,2*f*n*nf,0];},
  look:(e,c,u)=>{const z=nrm(sub(e,c)),x=nrm(cross(u,z)),y=cross(z,x);
    return[x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot(x,e),-dot(y,e),-dot(z,e),1];},
  mul:(a,b)=>{const o=new Array(16);for(let r=0;r<4;r++)for(let c=0;c<4;c++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;},
};
function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function nrm(a){const m=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/m,a[1]/m,a[2]/m];}

const canvas=document.getElementById('c');
const gl=canvas.getContext('webgl2',{antialias:true});
function fail(msg){ const e=document.getElementById('err'); e.style.display='grid'; e.textContent=msg; }
let mesh, center=[0,0,0], radius=1;
try { mesh=parseGlb(b64ToBytes(GLB_B64)); } catch(e){ fail('Could not load the mesh: '+e.message); }
if(!gl){ fail('WebGL2 is unavailable in this browser.'); }

if(gl && mesh){
  // bounds
  let mn=[1e9,1e9,1e9], mx=[-1e9,-1e9,-1e9];
  for(let i=0;i<mesh.positions.length;i+=3)for(let k=0;k<3;k++){const v=mesh.positions[i+k]; if(v<mn[k])mn[k]=v; if(v>mx[k])mx[k]=v;}
  center=[(mn[0]+mx[0])/2,(mn[1]+mx[1])/2,(mn[2]+mx[2])/2];
  radius=Math.hypot(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])/2;

  const vs=\`#version 300 es
  in vec3 aPos; in vec3 aNrm; uniform mat4 uMVP; uniform mat4 uModel; out vec3 vN; out vec3 vW;
  void main(){ vec4 w=uModel*vec4(aPos,1.0); vW=w.xyz; vN=mat3(uModel)*aNrm; gl_Position=uMVP*vec4(aPos,1.0); }\`;
  const fs=\`#version 300 es
  precision highp float; in vec3 vN; in vec3 vW; out vec4 o;
  uniform vec3 uEye;
  void main(){
    vec3 N=normalize(vN); vec3 V=normalize(uEye-vW);
    if(!gl_FrontFacing) N=-N;
    vec3 L1=normalize(vec3(-0.5,0.85,0.62)); vec3 L2=normalize(vec3(0.6,0.25,-0.4));
    float key=max(dot(N,L1),0.0); float fill=max(dot(N,L2),0.0)*0.35;
    float hemi=0.30+0.24*(N.y*0.5+0.5);
    float rim=pow(1.0-max(dot(N,V),0.0),3.0)*0.18;
    vec3 stone=vec3(0.84,0.79,0.69);
    vec3 c=stone*(hemi+0.9*key+fill)+vec3(rim);
    c=pow(clamp(c,0.0,1.0),vec3(1.0/2.2));
    o=vec4(c,1.0);
  }\`;
  function sh(t,src){const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
  const prog=gl.createProgram();
  gl.attachShader(prog,sh(gl.VERTEX_SHADER,vs)); gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(prog); gl.useProgram(prog);
  const vao=gl.createVertexArray(); gl.bindVertexArray(vao);
  function buf(data,loc,size){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);}
  buf(mesh.positions,gl.getAttribLocation(prog,'aPos'),3);
  buf(mesh.normals,gl.getAttribLocation(prog,'aNrm'),3);
  const ib=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST);
  const uMVP=gl.getUniformLocation(prog,'uMVP'), uModel=gl.getUniformLocation(prog,'uModel'), uEye=gl.getUniformLocation(prog,'uEye');

  let yaw=-0.5, pitch=-0.12, dist=radius*3.0, spin=true;
  const start={yaw:-0.5,pitch:-0.12,dist:radius*3.0};
  function resize(){const dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=canvas.clientWidth*dpr; canvas.height=canvas.clientHeight*dpr; gl.viewport(0,0,canvas.width,canvas.height);}
  window.addEventListener('resize',resize); resize();

  let drag=false,lx=0,ly=0;
  canvas.addEventListener('pointerdown',e=>{drag=true;spin=false;lx=e.clientX;ly=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointerup',()=>drag=false);
  canvas.addEventListener('pointermove',e=>{ if(!drag)return; yaw+=(e.clientX-lx)*0.008; pitch+=(e.clientY-ly)*0.008;
    pitch=Math.max(-1.4,Math.min(1.4,pitch)); lx=e.clientX; ly=e.clientY; });
  canvas.addEventListener('wheel',e=>{e.preventDefault(); dist*=Math.exp(e.deltaY*0.0011); dist=Math.max(radius*1.2,Math.min(radius*8,dist));},{passive:false});
  document.getElementById('spin').onclick=(e)=>{spin=!spin; e.target.textContent=spin?'pause spin':'resume spin';};
  document.getElementById('reset').onclick=()=>{yaw=start.yaw;pitch=start.pitch;dist=start.dist;spin=true;document.getElementById('spin').textContent='pause spin';};

  function frame(){
    if(spin) yaw+=0.0032;
    const eye=[center[0]+dist*Math.cos(pitch)*Math.sin(yaw), center[1]+dist*Math.sin(pitch), center[2]+dist*Math.cos(pitch)*Math.cos(yaw)];
    const proj=M.persp(0.6, canvas.width/canvas.height, radius*0.1, radius*20);
    const view=M.look(eye,center,[0,1,0]);
    const mvp=M.mul(proj,view);
    gl.clearColor(0.055,0.05,0.043,1); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uMVP,false,new Float32Array(mvp));
    gl.uniformMatrix4fv(uModel,false,new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]));
    gl.uniform3fv(uEye,new Float32Array(eye));
    gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0);
    requestAnimationFrame(frame);
  }
  frame();
}
</script>
</body></html>
`;
}

function build() {
  const geoA = buildCathedralSection();
  const geoB = buildCathedralSection();
  const eqF = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  if (!eqF(geoA.positions, geoB.positions) || !eqF(geoA.normals, geoB.normals) || !eqF(geoA.indices, geoB.indices)) {
    console.error('[k0b] NON-DETERMINISTIC: mesh double-build diverged. Aborting.');
    process.exit(1);
  }
  const glbA = encodeGlb(geoA), glbB = encodeGlb(geoB);
  if (!bytesEqual(glbA, glbB)) {
    console.error('[k0b] NON-DETERMINISTIC: GLB double-build diverged. Aborting.');
    process.exit(1);
  }
  const c = [(geoA.min[0] + geoA.max[0]) / 2, (geoA.min[1] + geoA.max[1]) / 2, (geoA.min[2] + geoA.max[2]) / 2];
  const R = Math.hypot(geoA.max[0] - geoA.min[0], geoA.max[1] - geoA.min[1], geoA.max[2] - geoA.min[2]) / 2;
  const oblique = renderStill(geoA, 960, 720, [c[0] - R * 1.7, c[1] + R * 0.9, c[2] + R * 2.4], c);
  const front = renderStill(geoA, 960, 720, [c[0], c[1] + R * 0.15, c[2] + R * 3.1], c);
  const html = viewerHtml(base64(glbA), { tri: geoA.triangleCount, vtx: geoA.vertexCount, glb: glbA.length });
  return {
    files: [
      { file: GLB, data: glbA },
      { file: HTML, data: html },
      { file: STILL_A, data: oblique },
      { file: STILL_B, data: front },
    ],
    stats: { tri: geoA.triangleCount, vtx: geoA.vertexCount, glb: glbA.length, elements: geoA.elements },
  };
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const { files, stats } = build();
  if (checkOnly) {
    let stale = 0;
    for (const em of files) {
      const path = join(OUT_DIR, em.file);
      if (!existsSync(path)) { console.error(`[k0b] MISSING: ${path}`); stale++; continue; }
      if (typeof em.data === 'string') { if (readFileSync(path, 'utf8') !== em.data) { console.error(`[k0b] STALE: ${path}`); stale++; } }
      else if (!bytesEqual(readFileSync(path), em.data)) { console.error(`[k0b] STALE: ${path}`); stale++; }
    }
    if (stale > 0) process.exit(1);
    console.log('[k0b] check OK -- committed exhibit matches a fresh deterministic build.');
    return;
  }
  mkdirSync(OUT_DIR, { recursive: true });
  for (const em of files) {
    const path = join(OUT_DIR, em.file);
    writeFileSync(path, em.data);
    const n = typeof em.data === 'string' ? Buffer.byteLength(em.data) : em.data.length;
    console.log(`[k0b] emitted -> ${path} (${n} bytes)`);
  }
  console.log(JSON.stringify({ tri: stats.tri, vtx: stats.vtx, glb: stats.glb, elements: stats.elements.length }));
}

main();
