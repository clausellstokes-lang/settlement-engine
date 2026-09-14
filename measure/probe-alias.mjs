// PROBE (car 0e, not committed): what would an extended localAliases move?
import { poolKeyFunctions, localAliases, keyForms, predicateRows, codeOnly } from '../laneMEASURE/src/domain/prose/wiringCensus.js';
import { composerSources } from '../laneMEASURE/tests/helpers/dossierComposedFill.js';

/** the extended rule: the FIRST identifier in the initialiser that is a param */
function extendedAliases(body, params) {
  const out = new Map(localAliases(body, params));
  for (const m of body.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)/g)) {
    if (out.has(m[1])) continue;
    for (const id of m[2].matchAll(/\b([A-Za-z_$][\w$]*)\b/g)) {
      if (params.includes(id[1])) { out.set(m[1], id[1]); break; }
    }
  }
  return out;
}

let fns = 0; let newAliases = 0; let guardsMoved = 0; let atomsGained = 0;
const examples = [];
for (const [file, src] of composerSources()) {
  for (const fn of poolKeyFunctions(src, file)) {
    fns += 1;
    const base = localAliases(fn.body, fn.params);
    const ext = extendedAliases(fn.body, fn.params);
    for (const [k, v] of ext) if (!base.has(k)) { newAliases += 1; if (examples.length < 25) examples.push(`${fn.name}: ${k} -> ${v}`); }
    for (const form of keyForms(fn)) {
      if (!form.guard) continue;
      const a = predicateRows(form.guard, fn.params, base);
      const b = predicateRows(form.guard, fn.params, ext);
      if (b.length !== a.length) { guardsMoved += 1; atomsGained += b.length - a.length; }
    }
  }
}
console.log(`key functions ${fns} · NEW alias entries ${newAliases} · guards whose predicate rows change ${guardsMoved} · atoms gained ${atomsGained}`);
for (const e of examples) console.log('  ' + e);
