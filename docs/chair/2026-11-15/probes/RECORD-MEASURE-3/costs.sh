#!/bin/sh
# costs.sh <tree> <out>: the suite's generator, domain, component, ui and pdf tests in that tree; failed files and tests listed
cd "$1" && npx vitest run tests/generators tests/domain tests/components tests/ui tests/pdf tests/dossier tests/property tests/generation.test.js --reporter=json --outputFile="$2.json" > "$2.log" 2>&1
node -e "const r=require('$2.json');const f=r.testResults.filter(t=>t.status!=='passed');console.log('files',r.numTotalTestSuites,'tests',r.numTotalTests,'failed',r.numFailedTests);for(const t of f){console.log('FILE',t.name.replace('$1/',''));for(const a of t.assertionResults.filter(a=>a.status==='failed'))console.log('  -',a.fullName.slice(0,160))}" > "$2.failed.txt"
