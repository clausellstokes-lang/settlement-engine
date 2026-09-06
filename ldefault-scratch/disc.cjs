const { execSync } = require('child_process');
const out = execSync('node --input-type=module -e "import(\'./scripts/lib/observed-shape-corpus.mjs\').then(m=>{const f=m.discoverSimulationFlags?m.discoverSimulationFlags():null;console.log(JSON.stringify(f&&f.length))})"', {cwd: process.cwd()}).toString();
console.log(out);
